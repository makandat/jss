/*
=============================
  App2 app.js
=============================
*/
'use strict';
const sv = require('./server.js');
const tm = require('./tag_maker.js')
const server = new sv.Server();

const escape = (str)=>{
  str = str.replace(/&/g, "&amp;");
  str = str.replace(/</g, "&lt;");
  str = str.replace(/>/g, "&gt;");
  return str;
}

/* '/' (root) */
const root = (request, response) => {
  return `
    <html>
    <script>location.replace('/index.html');</script>
    <body style='font-size:larger;'>
      GO TO <a href='/index.html'>index.html</a>
    </body>
    </html>
  `;
}

/* /about */
const about = (request, response) => {
  return sv.Server.simple('about.html', {title:'about App2', version:server.Version});
}

/* /htmlTag/ */
const htmlTag = (request, response) => {
  let result = "";
  if (request.method == 'GET')
    return sv.Server.simple('htmlTag.html', {result:result});
  sv.Server.postParams(request, (params)=>{
    try {
      result = tm.htmlTag(params.tag, params.attrs, params.text);
      result = escape(result);
      let htm = sv.Server.simple('htmlTag.html', {"result":result});
      response.end(htm);
    }
    catch (e) {
      response.end("<html>" + e.message + "</html>");
    }
  });
  return;
}

/* /styleAttr/ */
const styleAttr = (request, response) => {
  let result = "";
  if (request.method == 'GET')
    return sv.Server.simple('styleAttr.html', {result:result});
  sv.Server.postParams(request, (params)=>{
    try {
      let v = params['styledef'];
      let hash = JSON.parse(v);
      result = tm.styleAttr(hash);
      result = escape(result);
      let htm = sv.Server.simple('styleAttr.html', {"result":result});
      response.end(htm);
    }
    catch (e) {
      response.end("<html>" + e.message + "</html>");
    }
  });
}

/* /htmlAttr/ */
const htmlAttr = (request, response) => {
  let result = "";
  if (request.method == 'GET')
    return sv.Server.simple('htmlAttr.html', {result:result});
  sv.Server.postParams(request, (params)=>{
    try {
      let v = params['styledef'];
      let hash = JSON.parse(v);
      result = tm.htmlAttr(hash);
      result = escape(result);
      let htm = sv.Server.simple('htmlAttr.html', {"result":result});
      response.end(htm);
    }
    catch (e) {
      response.end("<html>" + e.message + "</html>");
    }
  });
}

/* /bulletList/ */
const bulletList = (request, response) => {
  let result = "";
  if (request.method == 'GET')
    return sv.Server.simple('bulletList.html', {"result":result});
  sv.Server.postParams(request, (params)=>{
    try {
      let tag = params['tag'];
      let texts = JSON.parse(params['texts']);
      let ulattr = params['ulattr'];
      let liattr = params['liattr'];
      result = escape(tm.bulletList(tag, texts, ulattr, liattr));
      let htm = sv.Server.simple('bulletList.html', {"result":result});
      response.end(htm);
      }
    catch (e) {
      response.end("<html>" + e.message + "</html>");
    }
  });
}

/* /defineList/ */
const defineList = (request, response) => {
  let result = "";
  if (request.method == 'GET')
    return sv.Server.simple('defineList.html', {result:result});
  sv.Server.postParams(request, (params)=>{
    try {
      let list = JSON.parse(params['list']);
      let dl_attr = params['dl_attr'];
      let dt_attr = params['dt_attr'];
      let dd_attr = params['dd_attr'];
      result = escape(tm.defineList(list, dl_attr, dt_attr, dd_attr));
      let htm = sv.Server.simple('defineList.html', {"result":result});
      response.end(htm);
    }
    catch (e) {
      response.end("<html>" + e.message + "</html>");
    }
  });
}

/* /htmlTable/ */
const htmlTable = (request, response) => {
  let result = "";
  if (request.method == 'GET')
    return sv.Server.simple('htmlTable.html', {result:result});
  sv.Server.postParams(request, (params)=>{
    try {
      let dataset = JSON.parse(params['dataset']);
      let table_attr = JSON.parse(params['table_attr']);
      let th_attr = JSON.parse(params['th_attr']);
      let td_attr = JSON.parse(params['td_attr']);
      result = escape(tm.htmlTable(dataset, table_attr, th_attr, td_attr));
      let htm = sv.Server.simple('htmlTable.html', {"result":result});
      response.end(htm);
    }
    catch (e) {
      response.end("<html>" + e.message + "</html>");
    }
  });
}

/* /htmlForm/ */
const htmlForm = (request, response) => {
  let result = "";
  if (request.method == 'GET')
    return sv.Server.simple('htmlForm.html', {result:result});
  sv.Server.postParams(request, (params)=>{
    try {
      let attrs = JSON.parse(params['attrs']);
      let captions = JSON.parse(params['captions']);
      let controls = JSON.parse(params['controls']);
      result = escape(tm.htmlForm(attrs, captions, controls));
      let htm = sv.Server.simple('htmlForm.html', {"result":result});
      response.end(htm);
    }
    catch (e) {
      response.end("<html>" + e.message + "<html>");
    }
  });
}


// -----------------------------------
// add actions
server.addAction('/', root);
server.addAction('/index.html', root);
server.addAction('/about', about);
server.addAction('/htmlTag/', htmlTag, 'POST|GET');
server.addAction('/styleAttr/', styleAttr, 'POST|GET');
server.addAction('/htmlAttr/', htmlAttr, 'POST|GET');
server.addAction('/bulletList/', bulletList, 'POST|GET');
server.addAction('/defineList/', defineList, 'POST|GET');
server.addAction('/htmlTable/', htmlTable, 'POST|GET');
server.addAction('/htmlForm/', htmlForm, 'POST|GET');


// ----------------------------------
// start server ...
try {
  server.start();
  console.log(`\nStart server version=${server.version}  port=${server.port} ...`);
}
catch (err) {
  console.error(err.message);
}
