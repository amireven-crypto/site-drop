/* Clickjacking guard: GitHub Pages cannot send X-Frame-Options or CSP frame-ancestors, so refuse to render inside a frame. */
(function () { if (window.top === window.self) return; document.documentElement.style.setProperty("display", "none", "important"); try { window.top.location.replace(window.self.location.href); } catch (e) {} })();
document.documentElement.classList.add("js");
/* If site.js is slow or fails, do not leave the intro overlay up. */
setTimeout(function () { document.documentElement.classList.add("is-ready"); }, 2500);
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then(function (regs) {
    for (var i = 0; i < regs.length; i++) regs[i].unregister();
  }).catch(function () {});
}
