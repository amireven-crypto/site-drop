/* Site language switcher (DE / EN / HE / RU).
   The page is written in English; this swaps every visible string, alt text,
   aria label, title and meta tag for the chosen language. Layout is untouched.
   The choice is kept only in this browser (localStorage), no cookies. */
(function () {
  "use strict";
  var KEY = "site-lang", LANGS = ["de", "en", "he", "ru"];
  var doc = document, root = doc.documentElement;
  var me = doc.currentScript;
  var SRC = "en";
  var srcAttr = me && me.getAttribute("data-src-lang");
  if (srcAttr && LANGS.indexOf(srcAttr) > -1) SRC = srcAttr;
  var lang = SRC;
  try {
    var q = new URLSearchParams(location.search).get("lang");
    if (q && LANGS.indexOf(q) > -1) { lang = q; localStorage.setItem(KEY, q); }
    else lang = localStorage.getItem(KEY) || SRC;
  } catch (e) {}
  if (LANGS.indexOf(lang) < 0) lang = SRC;
  root.setAttribute("lang", lang);
  root.setAttribute("dir", lang === "he" ? "rtl" : "ltr");
  root.classList.add("lang-" + lang);
  /* Hold the first paint until the text is swapped, so no English flashes. */
  function reveal() { root.style.removeProperty("visibility"); }
  if (lang !== SRC) { root.style.visibility = "hidden"; setTimeout(reveal, 2500); }

  var dict = null;
  /* Load this page's strings for the chosen language before the body is parsed. */
  if (lang !== SRC && me && me.getAttribute("data-page")) {
    var base = me.getAttribute("src").replace(/i18n\.js(\?.*)?$/, "");
    var v = (me.getAttribute("src").match(/\?.*$/) || [""])[0];
    doc.write('<script src="' + base + "p/" + me.getAttribute("data-page") + "." + lang + ".js" + v + '"><\/script>');
  }
  var ATTRS = ["alt", "title", "aria-label", "placeholder", "aria-valuetext", "aria-description", "aria-roledescription", "data-label", "data-tip"];
  var META = /^(description|og:title|og:description|og:image:alt|twitter:title|twitter:description|twitter:image:alt|apple-mobile-web-app-title)$/;
  var SKIP = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, TEMPLATE: 1, CODE: 1, PRE: 1, SVG: 0 };
  var INLINE = /^(EM|STRONG|B|I|A|SPAN|BR|SMALL|SUP|SUB|ABBR|MARK|U|S|KBD|Q|CITE|TIME|WBR|CODE)$/;
  var busy = false;

  function norm(s) { return s.replace(/\s+/g, " ").trim(); }
  function look(s) {
    if (!dict) return null;
    var k = norm(s);
    if (!k) return null;
    return Object.prototype.hasOwnProperty.call(dict, k) ? dict[k] : null;
  }
  function t(s) { var v = look(String(s)); return v == null ? s : v; }
  function noTr(el) {
    for (var n = el; n && n.nodeType === 1; n = n.parentNode) {
      if (n.getAttribute("translate") === "no" || (n.classList && n.classList.contains("notranslate"))) return true;
    }
    return false;
  }
  /* A block of text with only inline markup (e.g. "Text <em>word</em>.") is
     translated as one sentence so the grammar works in every language. */
  function mixedKey(el) {
    if (!el.firstChild || el.children.length === 0) return null;
    var hasText = false, ok = true;
    (function walk(n) {
      for (var c = n.firstChild; c && ok; c = c.nextSibling) {
        if (c.nodeType === 3) { if (/\S/.test(c.nodeValue)) hasText = true; }
        else if (c.nodeType === 1) {
          if (!INLINE.test(c.tagName) || c.id || c.hasAttribute("data-i18n-keep")) ok = false;
          else walk(c);
        }
      }
    })(el);
    if (!ok || !hasText) return null;
    var direct = false;
    for (var c = el.firstChild; c; c = c.nextSibling) if (c.nodeType === 3 && /\S/.test(c.nodeValue)) direct = true;
    if (!direct) return null;
    return norm(el.innerHTML);
  }
  function trAttrs(el) {
    for (var i = 0; i < ATTRS.length; i++) {
      var a = ATTRS[i];
      if (el.hasAttribute(a)) { var v = look(el.getAttribute(a)); if (v != null && v !== el.getAttribute(a)) el.setAttribute(a, v); }
    }
    if (el.tagName === "INPUT" && /^(button|submit|reset)$/i.test(el.type) && el.value) {
      var v2 = look(el.value); if (v2 != null && v2 !== el.value) el.value = v2;
    }
    if (el.tagName === "META") {
      var nm = el.getAttribute("name") || el.getAttribute("property") || "";
      if (META.test(nm)) { var v3 = look(el.getAttribute("content") || ""); if (v3 != null && v3 !== el.getAttribute("content")) el.setAttribute("content", v3); }
      var loc = { de: "de_AT", en: "en_US", he: "he_IL", ru: "ru_RU" }[lang];
      if (nm === "og:locale" && el.getAttribute("content") !== loc) el.setAttribute("content", loc);
    }
  }
  function trText(n) {
    var raw = n.nodeValue, v = look(raw);
    if (v == null) return;
    var lead = raw.match(/^\s*/)[0], tail = raw.match(/\s*$/)[0];
    var out = lead + v + tail;
    if (out !== raw) n.nodeValue = out;
  }
  function walk(node) {
    if (!dict) return;
    if (node.nodeType === 3) {
      var p = node.parentNode;
      if (p && p.nodeType === 1 && !SKIP[p.tagName] && !noTr(p)) {
        var mk = mixedKey(p), mv = mk && look(mk);
        if (mv != null) { if (mv !== norm(p.innerHTML)) p.innerHTML = mv; }
        else trText(node);
      }
      return;
    }
    if (node.nodeType !== 1 || SKIP[node.tagName]) return;
    if (noTr(node)) return;
    trAttrs(node);
    if (node.tagName === "TITLE") { var tv = look(node.textContent); if (tv != null) node.textContent = tv; return; }
    var k = mixedKey(node);
    if (k) { var v = look(k); if (v != null) { if (v !== norm(node.innerHTML)) node.innerHTML = v; return; } }
    var kids = [];
    for (var c = node.firstChild; c; c = c.nextSibling) kids.push(c);
    for (var i = 0; i < kids.length; i++) {
      if (kids[i].nodeType === 3) trText(kids[i]); else walk(kids[i]);
    }
  }
  function apply(scope) {
    if (!dict) return;
    busy = true;
    try { walk(scope || root); if (doc.title) { var tv = look(doc.title); if (tv != null) doc.title = tv; } }
    finally { busy = false; }
  }

  var mo = null;
  function observe() {
    if (mo || !dict || !window.MutationObserver) return;
    var burst = 0, since = Date.now();
    mo = new MutationObserver(function (list) {
      if (busy) return;
      /* Safety valve: never let a translation feed back into itself. */
      var now = Date.now();
      if (now - since > 1000) { since = now; burst = 0; }
      if (++burst > 400) { mo.disconnect(); return; }
      busy = true;
      try {
        for (var i = 0; i < list.length; i++) {
          var m = list[i];
          if (m.type === "childList") for (var j = 0; j < m.addedNodes.length; j++) walk(m.addedNodes[j]);
          else if (m.type === "characterData") walk(m.target);
          else if (m.type === "attributes") trAttrs(m.target);
        }
      } finally { busy = false; }
    });
    mo.observe(root, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS.concat(["content", "value"]) });
  }

  function bindSwitch() {
    var btns = doc.querySelectorAll("[data-set-lang]");
    for (var i = 0; i < btns.length; i++) {
      var b = btns[i], l = b.getAttribute("data-set-lang");
      b.setAttribute("aria-pressed", l === lang ? "true" : "false");
      if (l === lang) b.setAttribute("aria-current", "true");
      if (b.__i18n) continue;
      b.__i18n = 1;
      b.addEventListener("click", function (e) {
        var to = this.getAttribute("data-set-lang");
        e.preventDefault();
        if (to === lang) return;
        try { localStorage.setItem(KEY, to); } catch (err) {}
        var u = new URL(location.href);
        u.searchParams.set("lang", to);
        location.replace(u.toString());
      });
    }
  }

  window.I18N = {
    lang: lang,
    src: SRC,
    langs: LANGS,
    t: t,
    add: function (all) {
      if (lang === SRC || !all || !all[lang]) return;
      dict = dict || {};
      var d = all[lang];
      for (var k in d) if (Object.prototype.hasOwnProperty.call(d, k)) dict[k] = d[k];
      apply(root);
      observe();
    },
    apply: function () { apply(root); bindSwitch(); }
  };
  window.__t = t;
  doc.addEventListener("DOMContentLoaded", function () { apply(root); bindSwitch(); reveal(); });
})();
