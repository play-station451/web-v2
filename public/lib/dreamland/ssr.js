var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/ssr/main.js
var main_exports = {};
__export(main_exports, {
  hSSR: () => hSSR,
  renderToString: () => renderToString
});
module.exports = __toCommonJS(main_exports);
var import_jsdom = require("jsdom");
function renderToString(component, props, children) {
  globalThis.h = hSSR;
  globalThis.use = (p) => p;
  return hSSR(component, props, children).outerHTML;
}
function hSSR(type, props, ...children) {
  const { document, HTMLElement } = new import_jsdom.JSDOM().window;
  if (typeof type == "function") {
    const newthis = {};
    for (let key in props) {
      if (key.startsWith("bind:")) {
        const attr = key.slice(5);
        newthis[attr] = props[key];
        continue;
      }
      newthis[key] = props[key];
    }
    const elm = type.apply(newthis);
    elm.setAttribute("data-component", type.name);
    elm.setAttribute("ssr-data-component", type.name);
    return elm;
  }
  let el = document.createElement(type);
  for (let child of children) {
    if (typeof child == "object" && child != null && "remove" in child) {
      el.appendChild(child);
    } else {
      el.appendChild(document.createTextNode(child));
    }
  }
  for (let key in props) {
    let val = props[key];
    if (key == "class") {
      el.className = val;
      continue;
    }
    if (key == "style" && typeof val == "object") {
      for (let skey in val) {
        el.style[skey] = val[skey];
      }
      continue;
    }
    if (key.startsWith("on:")) {
      continue;
    }
    if (key.startsWith("bind:")) {
      let attr = key.slice(5);
      el.setAttribute(attr, val);
    }
    el.setAttribute(key, props[key]);
  }
  return el;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  hSSR,
  renderToString
});
