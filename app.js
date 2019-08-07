// テストアプリ for Server
'use strict';

const sv = require('./server.js');
var server = new sv.Server();

/* ハンドラ登録 */
server.actions = [
  {
    // 0
    method: 'GET',
    pattern: '/',
    mimetype: 'text/html',
    header: false,
    action: (request, response) => {
      return '<html>\n<script>location.replace(\'/index.html\');</script>\n<body style=\'font-size:larger;\'>\n	GO TO <a href=\'/index.html\'>index.html</a>\n</body>\n</html>';
    }
  },
  {
    // 1
     method: 'GET',
     pattern: '/about',
     mimetype: 'text/html',
     header: false,
     action: (request, response) => {
       return sv.Server.pug('about.pug', {
          title: 'Sample App'
       });
     }
  },
  {
    // 2
     method: 'GET',
     pattern: '/text/?',
     mimetype: 'text/html',
     header: false,
     action: (request, response) => {
       let vars = sv.Server.getParams(request);
       return sv.Server.pug('text.pug', vars);
     }
  },
  {
     // 3
     method: 'GET',
     pattern: '/text/*',
     mimetype: 'text/html',
     header: false,
     action: (request, response) => {
       let p = server.getUrlParam(3, request);  // 3はこのアクションの番号
       return sv.Server.pug('text.pug', {"msg":p});
     }
  },
  {
    // 4
    method: 'GET',
    pattern: '/image/?',
    mimetype: 'text/html',
    header: false,
    action: (request, response) => {
      console.log("/image/?");
      let vars = sv.Server.getParams(request);
      let htm = sv.Server.simple('image.html', vars);
      return htm;
    }
  },
  {
    // 5
    method: 'GET',
    pattern: '/cookie',
    mimetype: 'text/html',
    header: true,
    action: (request, response) => {
      console.log("/cookie");
      let cookie = server.getCookie(request, "key1");
      if (cookie === "") {
        server.setCookie(response, "key1", "value1");
      }
      response.writeHead(200, {'Content-Type': server.actions[5].mimetype});
      let htm = sv.Server.pug('cookie.pug', {"key1":cookie});
      return htm;
    }
  },
  {
    // 6
    method: 'POST',
    pattern: '/form1',
    mimetype: 'text/html',
    header: false,
    action: (request, response) => {
      console.log("/form1");
      sv.Server.postParams(request, (data)=>{
        response.writeHead(200, {'Content-Type': server.actions[5].mimetype});
        let htm = sv.Server.pug("form1.pug", data);
        response.end(htm);
      });
    }
  },
  {
    // 7
    method: 'GET',
    pattern: '/getJSON',
    mimetype: 'text/html',
    header: false,
    action: (request, response) => {
      console.log("/getJSON");
      let htm = sv.Server.ejs('getJSON.ejs', {});
      return htm;
    }
  },
  {
    // 8
    method: 'GET',
    pattern: '/Ajax/?',
    mimetype: 'application/json',
    header: true,
    action: (request, response) => {
      console.log("/Ajax/?");
      let vars = sv.Server.getParams(request);
      response.writeHead(200, {'Content-Type': server.actions[8].mimetype});
      //return "{" + vars + "}";
      return "{'text1':'Hello'}";
    }
  }
];


try {
  server.start();
  console.log("\nstart server version=" + server.Version + " .. \n port=" + server.Port);
}
catch (err) {
  console.error(err.message);
}
