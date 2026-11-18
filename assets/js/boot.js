document.documentElement.classList.add("js");
/* If site.js is slow or fails, do not leave the intro overlay up. */
setTimeout(function () { document.documentElement.classList.add("is-ready"); }, 2500);
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then(function (regs) {
    for (var i = 0; i < regs.length; i++) regs[i].unregister();
  }).catch(function () {});
}
