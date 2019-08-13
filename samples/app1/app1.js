'use strict';
const sv = require('./server.js');
const server = new sv.Server();

server.actions = [
 {
   method: 'GET',
   pattern: '/',
   mimetype: 'text/html',
   header: false,
   action: (request, response) => {
     return '<html>\n<script>location.replace(\'/index.html\');</script>\n<body style=\'font-size:larger;\'>\n	GO TO <a href=\'/index.html\'>index.html</a>\n</body>\n</html>';
   }
 },
 {
   method: 'GET',
   pattern: '/about',
   mimetype: 'text/html',
   header: false,
   action: (request, response) => {
       return sv.Server.ejs('about.ejs', {
         title: 'Sample App',
         version: server.Version
       });
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
