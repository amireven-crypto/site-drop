(function () {
  "use strict";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var yr = document.getElementById("yr");
  if (yr) yr.textContent = String(new Date().getFullYear());

  /* Hero word: one calm cycle (fresh → modern → live → fresh.) using the motion-anything
     rotating-text classes (.rot / .rot-w / .swap). The vendored recipe loops forever, so we
     claim the element before it initialises (it skips elements with __rot set).
     Reduced motion: static "fresh.". The h1 keeps a stable accessible name via .sr-only. */
  [].forEach.call(document.querySelectorAll(".rot[data-rot-once]"), function (el) {
    if (el.__rot) return;
    el.__rot = 1;
    var words = (el.getAttribute("data-words") || el.textContent).split("|").map(function (w) { return w.trim(); });
    el.textContent = "";
    var w = document.createElement("span");
    w.className = "rot-w";
    w.textContent = words[0];
    el.appendChild(w);
    if (reduce || words.length < 2) return;
    var seq = words.slice(1).concat(words[0]);
    var i = 0;
    function step() {
      if (i >= seq.length) return;
      el.classList.add("swap");
      setTimeout(function () {
        w.textContent = seq[i++];
        el.classList.remove("swap");
        if (i < seq.length) setTimeout(step, 1800);
      }, 460);
    }
    setTimeout(step, 1600);
  });

  /* Pause the floating candies while the hero is off-screen (saves GPU on long scrolls). */
  var hero = document.querySelector(".hero");
  if (hero && "IntersectionObserver" in window) {
    new IntersectionObserver(function (es) {
      es.forEach(function (e) { hero.classList.toggle("is-offscreen", !e.isIntersecting); });
    }).observe(hero);
  }

  /* Mobile menu: focus moves in, the page behind is inert, focus returns to the burger. */
  var btn = document.querySelector(".burger");
  var nav = document.getElementById("navlinks");
  if (!btn || !nav) return;
  var behind = [document.getElementById("main"), document.querySelector(".foot")].filter(Boolean);

  function setOpen(open, restoreFocus) {
    var was = document.body.classList.contains("menu-open");
    document.body.classList.toggle("menu-open", open);
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    behind.forEach(function (el) { if (open) el.setAttribute("inert", ""); else el.removeAttribute("inert"); });
    if (open && !was) {
      var first = nav.querySelector("a");
      if (first) first.focus();
    } else if (!open && was && restoreFocus) {
      btn.focus();
    }
  }

  btn.addEventListener("click", function () {
    setOpen(!document.body.classList.contains("menu-open"), true);
  });

  nav.addEventListener("click", function (e) {
    if (e.target.closest("a")) setOpen(false, false);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && document.body.classList.contains("menu-open")) setOpen(false, true);
    if (e.key === "Tab" && document.body.classList.contains("menu-open")) {
      var items = [btn].concat([].slice.call(nav.querySelectorAll("a")));
      var first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  var mq = window.matchMedia("(min-width: 734px)");
  function onMq(e) { if (e.matches) setOpen(false, false); }
  if (mq.addEventListener) mq.addEventListener("change", onMq);
  else if (mq.addListener) mq.addListener(onMq);
})();
