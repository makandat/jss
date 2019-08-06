// 簡易 HTTP サーバ for node.js ver 1.0  (2019-08-03)
'use strict';

const PORT = 8124;
const VERSION = "1.01";
const http = require("http");
const url = require("url");
const fs = require("fs");






/*  クラス定義 */
/* Server クラス */
class Server {
  /* コンストラクタ */
  constructor(port=PORT) {
    this.port = port;
    this.actions = [];
    this.version = VERSION;
  }

  /* ポート番号を返す。*/
  get Port() {
    return this.port;
  }

  /* バージョンを返す。*/
  get Version() {
    return this.version;
  }

  /* リクエスト前処理 */
  before(request, response) {
    if (request.url.includes('?') || request.url.includes('*'))
      return;
    if (request.url.match("\\.jpg$")) {
      return response.writeHead(200, {
        'Content-Type': 'image/jpeg'
      });
    } else if (request.url.match("\\.png$")) {
      return response.writeHead(200, {
        'Content-Type': 'image/png'
      });
    } else if (request.url.match("\\.gif$")) {
      return response.writeHead(200, {
        'Content-Type': 'image/gif'
      });
    } else if (request.url.match("\\.svg$")) {
      return response.writeHead(200, {
        'Content-Type': 'image/xml+svg'
      });
    } else if (request.url.match("\\.txt$")) {
      return response.writeHead(200, {
        'Content-Type': 'text/plain'
      });
    } else if (request.url.match("\\.js$")) {
      return response.writeHead(200, {
        'Content-Type': 'text/javascript'
      });
    } else if (request.url.match("\\.css$")) {
      return response.writeHead(200, {
        'Content-Type': 'text/css'
      });
    } else if (request.url.match("\\.xml$")) {
      return response.writeHead(200, {
        'Content-Type': 'application/xml'
      });
    } else if (request.url.match("\\.json$")) {
      return response.writeHead(200, {
        'Content-Type': 'application/json'
      });
    } else {
      return response.writeHead(200, {
        'Content-Type': 'text/html'
      });
    }
  };

  /* リクエスト後処理 */
  after(request, response) {
    return response.end();
  };


  /* リクエストに応じた処理を行う。 */
  dispatch(request, response) {
    let actions = this.actions;
    let len = actions.length;
    console.log("dispatch: " + request.url);
    // 静的テキストファイルのリクエスト
    for (let i = 0; i < len; i++) {
      if (request.method === "GET" && request.url ==='/') {
        let html = fs.readFileSync("./public/index.html", "utf-8");
        response.write(html);
        return;
      }
      else if (request.method === "GET" && request.url.includes('?') == false && request.url.match("\\.html$|\\.htm$|\\.xml$|\\.json$|\\.txt$|\\.svg$|\\.js$|\\.css$")) {
        console.log(request.method + " file=" + request.url);
        let file = "./public" + request.url;
        let html ="";
        if (fs.existsSync(file)) {
          html = fs.readFileSync(file, "utf-8");
        }
        else {
          html = `<html>${request.url} does not exists.</html>`;
        }
        response.write(html);
        return;
      }
      else {}
    }
    // 静的画像ファイルのリクエスト
    for (let i = 0; i < len; i++) {
      if (request.method === "GET" && request.url.includes('?') == false && (request.url.match("\\.jpg$|\\.png$|\\.gif$") || request.url == 'favicon.ico')) {
        console.log(request.method + " file=" + request.url);
        let file = "./public" + request.url;
        let img = null;
        if (fs.existsSync(file)) {
          img = fs.readFileSync(file);
        }
        response.write(img);
        return;
      }
    }
    // actions に登録したパターンに一致するリクエスト (パラメータなし)
    for (let i = 0; i < len; i++) {
      let a = actions[i];
      let b = a.pattern;
      if (b.endsWith("*") && request.url.includes('?') == false) {
        let s = b.substring(0, b.length-2);
        if (request.method === a.method && request.url.startsWith(s))
          response.writeHead(200, {'Content-Type': actions[i].mimetype});
          response.write(a.action(request));
          return;
      }
      else if (request.method === a.method && request.url === b) {
        response.writeHead(200, {'Content-Type': actions[i].mimetype});
        response.write(a.action(request));
        return;
      }
    }
    // actions に登録したパターンでパラメータがある場合のリクエスト
    for (let i = 0; i < len; i++) {
      let a = actions[i];
      let s = a.pattern.split('?');
      if (s.length < 2)
        continue;
      if (request.method === a.method && request.url.startsWith(s[0])) {
        response.writeHead(200, {'Content-Type': actions[i].mimetype});
        let htm = a.action(request);
        response.write(htm);
        return;
      }
    }
    console.log(request.method + " undefined pattern is " + request.url);
    response.writeHead(200, {'Content-Type':'text/html'});
    return response.write("<html>\n<body>\n<h1 style=\"text-align:center;color:red;margin-top:20px;\">This action is not defined.</h1>\n</body>\n</html>\n");
  };

  /* イベント処理 */
  eventHandler(request, response) {
    this.before(request, response);
    this.dispatch(request, response);
    return this.after(request, response);
  };

  /* サーバ開始処理 */
  start() {
    return this.server = http.createServer((request, response) => {
      return this.eventHandler(request, response);
    }).listen(this.port);
  }

  /* アクション追加 */
  addAction(pattern, mimetype, action, method, callback) {
    if (method == null) {
      method = 'GET';
    }
    if (callback == null) {
      callback = null;
    }
    this.actions.push({
      method: method,
      pattern: pattern,
      mimetype: mimetype,
      action: (request) => {
        return action(request, callback);
      }
    });
    return this.actions.length;
  }

  /* クッキーを得る。*/
  getCookie(request, key) {
    let strcookie = "";
    if (request.headers.cookie !== undefined) {
      strcookie = request.headers.cookie;
    }
    let data = strcookie.split(';').map(data => data.trim());
    let kvpair = data.find(data => data.startsWith(`${key}=`));
    if (kvpair === undefined)
      return '';
    let value = kvpair.split("=")[1];
    return unescape(value);
  }

  /* クッキーをセットする。*/
  setCookie(response, key, value) {
    let escval = escape(value);
    response.setHeader('Set-Cookie', [`${key}=${escval}`]);
  }


/* 外部から参照可能な関数たち */
  /* テンプレートエンジン ejs でレンダリングする。*/
  static ejs(filename, vars) {
    let ejs = require("ejs");
    let htm = fs.readFileSync("./views/" + filename, "utf-8");
    return ejs.render(htm, vars);
  };

  /* テンプレートエンジン pug でレンダリングする。*/
  static pug(filename, vars) {
    let pug = require('pug');
    let htm = fs.readFileSync("./views/" + filename, "utf-8");
    let fn = pug.compile(htm);
    return fn(vars);
  };

  /* 組み込みテンプレートエンジンでレンダリングする。*/
  static simple(filename, vars) {
    let htm = fs.readFileSync("./views/" + filename, "utf-8");
    for (let key in vars) {
      htm = htm.replace("(*" + key + "*)", vars[key]);
    }
    return htm;
  };


  /* GET メソッドのリクエストパラメータを得る。*/
  static getParams(request) {
    let x = url.parse(request.url, true);
    return x.query;
  };

  /* POST メソッドのリクエストパラメータを得る。*/
  static postParams (request, callback) {
    let body = '';
    request.addListener("data", (chunk) => {
      return body += chunk;
    });
    return request.addListener("end", () => {
      let params = require("querystring").parse(body);
      return callback(params);
    });
};

  /* ミリ秒単位でスリープする。*/
  static sleep(ms) {
    let sleeping = true;
    let now = new Date();
    let startingMSeconds = now.getTime();
    while (sleeping) {
      let alarm = new Date();
      let alarmMSeconds = alarm.getTime();
      if (alarmMSeconds - startingMSeconds > ms) {
        sleeping = false;
      }
    }
  };

  /* URL文字列からパターンを除いた文字列を得る。*/
  getUrlParam(n, request) {
    let sa = this.actions[n].pattern;
    let pat = sa.substring(0, sa.length - 1);
    let result = request.url.replace(pat, "");
    return result;
  }

}  // クラス終わり




/* Server クラスをエクスポートする。*/
exports.Server = Server;
