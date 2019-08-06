// テストアプリ for Server
'use strict';

const sv = require('./server.js');
var server = new sv.Server();

/* ハンドラ登録 */
server.actions = [
  {
    method: 'GET',
    pattern: '/',
    action: (request) => {
      return '<html>\n<script>location.replace(\'/index.html\');</script>\n<body style=\'font-size:larger;\'>\n	GO TO <a href=\'/index.html\'>index.html</a>\n</body>\n</html>';
    }
  },
  {
     method: 'GET',
     pattern: '/about',
     mimetype: 'text/html',
     action: (request) => {
       return sv.Server.pug('about.pug', {
          title: 'Sample App'
       });
     }
  },
  {
     method: 'GET',
     pattern: '/text/?',
     mimetype: 'text/html',
     action: (request) => {
       let vars = sv.Server.getParams(request);
       return sv.Server.pug('text.pug', vars);
     }
  },
  {
     method: 'GET',
     pattern: '/text/*',
     mimetype: 'text/html',
     action: (request) => {
       let p = server.getUrlParam(3, request);  // 3はこのアクションの番号
       return sv.Server.pug('text.pug', {"msg":p});
     }
  },
  {
    method: 'GET',
    pattern: '/image/?',
    mimetype: 'text/html',
    action: (request) => {
      console.log("/image/?");
      let vars = sv.Server.getParams(request);
      let htm = sv.Server.simple('image.html', vars);
      return htm;
    }
  },
  {
    method: 'GET',
    pattern: '/cookie',
    mimetype: 'text/html',
    action: (request) => {
      console.log("/cookie");
      let htm = sv.Server.pug('cookie.pug', {});
      return htm;
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
