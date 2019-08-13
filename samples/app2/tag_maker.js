/* tag_maker.js */
'use strict';

// htmlTag(tag, attrs=null, text=null)
//   機能: タグを作成する。
//   tag: タグ (例) 'a', 'br' など
//   attrs: タグの属性(ハッシュ)。(例) {class:"normal"}
//   text: タグで囲まれる文字列。ただし、brタグの場合は、brタグの前に付加される。
//   戻り値: タグの文字列。(例) "<a href=\"/index.html\">HOME</a>\n"
exports.htmlTag = (tag, attrs=null, text=null) => {
  let htm = ""
  if (tag == 'br' || tag == 'img' || tag == 'meta' || tag == 'link' || tag=="input") {
    htm += "<" + tag;
    if (attrs == null) {
      htm += " />\n";
      if (tag == 'br' && text) {
        htm = text + htm;
      }
    }
    else {
      htm += (" " + attrs);
      htm += " />\n";
      if (tag == 'br' && text) {
        htm = text + htm;
      }
    }
  }
  else {
    htm += "<" + tag;
    if (attrs != "") {
      htm += (" " + attrs + ">");
      if (text) {
        htm += `${text}</${tag}>\n`;
      }
      else {
        htm += `</${tag}>\n`;
      }
    }
    else {
      if (text) {
        htm += `>${text}</${tag}>\n`;
      }
      else {
        htm += `></${tag}>\n`;
      }
    }
  }
  return htm;
}

// styleAttr(hash)
//   機能: style属性を作成する。
//   hash: スタイルの定義(ハッシュ)。(例) {'color':'red', 'font-size':'small'}
//   戻り値: スタイル属性の文字列。(例) " color:red;font-size:small;"
exports.styleAttr = (hash) => {
  let style = " \"";
  for (let key in hash) {
    let val = hash[key];
    style += `${key}:${val};`;
  }
  return style + "\""
}

// htmlAttr(hash)
//   機能: ハッシュからタグの属性文字列を生成する。
//   hash: タグの属性定義(ハッシュ)。(例) {class:'textbox', size:80}
//   戻り値: 属性文字列。(例) "class=\"textbox\" size=\"80\""
exports.htmlAttr = (hash) => {
  let attr = "";
  for (let key in hash) {
    let val = hash[key];
    attr += ` ${key}="${val}"`;
  }
  return attr;
}

// bulletList(tag, texts, attrs=null, li_attrs=null)
//   機能: リスト(ulやolタグ)を作成する。
//   tag: 'ul'または'ol'
//   texts: liタグで挟まれる文字列(配列)。
//   ul_attrs: ulタグまたはolタグの属性(ハッシュ)。(例) {class:'listClass'}
//   li_attrs: liタグの属性(ハッシュ)。(例) {style:'font-color:black'}
//   戻り値: リストの完全なHTML文字列
exports.bulletList = (tag, texts, ul_attrs=null, li_attrs=null) => {
  let list = ""
  for (let s of texts) {
    list += "<li";
    if (li_attrs) {
      list += (" " + li_attrs);
    }
    list += ">";
    list += s;
    list += "</li>\n";
  }
  return this.htmlTag(tag, ul_attrs, list);
}


// defineList(list, dl_attr=null, dt_attr=null, dd_attr=null)
//   機能: 定義(dlタグ)を作成する。
//   list: 定義の配列。定義は表題(title)と詳細(detail)からなる。(例) [{title:'その１', detail:'詳細その１'}, {title:'その２', detail:'詳細その２'}]
//   dl_attr: dlタグの属性(ハッシュ)　(例) {class:'defineList'}
//   dt_attr: dtタグの属性(ハッシュ)　(例) {class:'defineTitle'}
//   dd_attr: ddタグの属性(ハッシュ)　(例) {class:'defineDetail'}
//   戻り値：定義の完全なHTML文字列。
exports.defineList = (list, dl_attr=null, dt_attr=null, dd_attr=null) => {
  let htm = "<dl";
  if (dl_attr)
    htm += this.htmlAttr(JSON.parse(dl_attr));
  htm += ">\n";
  for (let item of list) {
    htm += this.htmlTag('dt', dt_attr, item.title);
    htm += this.htmlTag('dd', dd_attr, item.detail);
  }
  htm += "</dl>\n";
  return htm;
}


// htmlTable(dataset, table_attr=null, th_attr=null, td_attr=null)
//   機能: ２次元配列からHTMLテーブルを作成する。
//  dataset: データの２次元配列。
//   table_attr: tableタグの属性(ハッシュ)　(例) {class:'Table1'}
//   th_attr: thタグの属性(ハッシュ)　(例) {class:'Header1'}
//      このパラメータがnullでない場合、テーブルの最初の行はタイトル行とみなされる。
//   td_attr: tableタグの属性(ハッシュ)　(例) {class:'Td1'}
//   戻り値：テーブルの完全なHTML文字列。
exports.htmlTable = (dataset, table_attr=null, th_attr=null, td_attr=null) => {
  let first = true;
  let htm = "<table";
  if (table_attr) {
    htm += this.htmlAttr(table_attr);
  }
  htm += ">\n";
  for (let row of dataset) {
    htm += "<tr>";
    for (let col of row) {
      if (first && th_attr) {
        htm += "<th";
        if (th_attr) {
          htm += this.htmlAttr(th_attr);
        }
      }
      else {
        htm += "<td";
        if (td_attr) {
          htm += this.htmlAttr(td_attr);
        }
      }
      htm += ">";
      htm += col;
      if (first && th_attr) {
        htm += "</th>";
      }
      else {
        htm += "</td>";
      }
    }
    htm += "</tr>\n";
    first = false;
  }
  htm += "</table>\n";
  return htm;
}


// htmlForm(attrs, captions, controls)
//   機能: HTMLフォームを作成する。
//      フォームの中は２列ｎ行のテーブルで、第１列が表題、第２列がコントロールであるものとする。(例外があっても良い)。
//   attrs: formタグの属性(ハッシュ)　(例) {type:'text', method:'POST'}
//   captions: １列目の内容。文字列の配列とする。
//   controls: ２列目の内容。文字列の配列とする。(例) "<input type=\"button\" value=\"click\" />"
//   戻り値: フォームのHTML文字列。
exports.htmlForm = (attrs, captions, controls) => {
  let form = "<table>\n";
  for (let i of [...Array(controls.length-1).keys()]) {
    form += "<tr><td>";
    form += captions[i];
    form += "</td><td>";
    form += controls[i];
    form += "</td></tr>\n";
  }
  form += "</table>\n";
  let a = "";
  for (let key in attrs) {
    a += (key + "=\"" + attrs[key] + "\"");
  }
  return this.htmlTag('form', a, form);
}
