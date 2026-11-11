(function () {
  "use strict";
  var yr = document.getElementById("yr");
  if (yr) yr.textContent = String(new Date().getFullYear());

  var btn = document.querySelector(".burger");
  var nav = document.getElementById("navlinks");
  if (!btn || !nav) return;

  function setOpen(open) {
    document.body.classList.toggle("menu-open", open);
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  btn.addEventListener("click", function () {
    setOpen(!document.body.classList.contains("menu-open"));
  });

  nav.addEventListener("click", function (e) {
    if (e.target.closest("a")) setOpen(false);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setOpen(false);
  });

  var mq = window.matchMedia("(min-width: 734px)");
  function onMq(e) { if (e.matches) setOpen(false); }
  if (mq.addEventListener) mq.addEventListener("change", onMq);
  else if (mq.addListener) mq.addListener(onMq);
})();
