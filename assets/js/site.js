(function () {
  "use strict";

  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var bot = !!navigator.webdriver;
  var fine = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var wide = window.matchMedia && window.matchMedia("(min-width: 900px)").matches;

  var yr = document.getElementById("yr");
  if (yr) yr.textContent = String(new Date().getFullYear());

  /* ——— Loader: ring counts, then the mark folds into the nav logo ——— */
  var loader = document.getElementById("loader");
  var countEl = document.getElementById("loader-count");
  function ready() { root.classList.add("is-ready"); }

  if (reduce || bot || !loader) {
    ready();
  } else {
    var start = performance.now();
    var dur = 1200;
    function tick(now) {
      var t = Math.max(0, Math.min(1, (now - start) / dur));
      if (countEl) countEl.textContent = String(Math.round(t * 100));
      if (t < 1) requestAnimationFrame(tick);
      else fold();
    }
    requestAnimationFrame(tick);
  }

  function fold() {
    var core = document.getElementById("loader-core");
    var mark = document.querySelector(".nav .mark");
    loader.classList.add("is-fold");
    if (!core || !mark || typeof core.animate !== "function") {
      ready();
      return;
    }
    var a = core.getBoundingClientRect();
    var b = mark.getBoundingClientRect();
    var dx = (b.left + b.width / 2) - (a.left + a.width / 2);
    var dy = (b.top + b.height / 2) - (a.top + a.height / 2);
    var scale = Math.max(0.12, b.width / Math.max(1, a.width));
    try {
      var anim = core.animate(
        [
          { transform: "none", opacity: 1 },
          { transform: "translate(" + dx.toFixed(1) + "px," + dy.toFixed(1) + "px) scale(" + scale.toFixed(3) + ")", opacity: 0.2 }
        ],
        { duration: 720, easing: "cubic-bezier(0.65, 0, 0.35, 1)", fill: "forwards" }
      );
      anim.onfinish = ready;
      setTimeout(ready, 900);
    } catch (err) {
      ready();
    }
  }

  /* ——— One light stream the length of the page ——— */
  var canvas = document.getElementById("stream");
  if (canvas && canvas.getContext) {
    var ctx = canvas.getContext("2d", { alpha: true });
    var dpr = 1;
    var running = !reduce && !bot;
    function fit() {
      dpr = Math.min(window.innerWidth < 700 ? 1.15 : 1.5, window.devicePixelRatio || 1);
      canvas.width = Math.max(1, Math.floor(window.innerWidth * dpr));
      canvas.height = Math.max(1, Math.floor(window.innerHeight * dpr));
    }
    var colors = ["#2B7BFF", "#20E0C0", "#FF8A1F", "#FF2D8A", "#BF5AF2"];
    function ribbon(time, scrollP, index, alpha) {
      var w = canvas.width;
      var h = canvas.height;
      var steps = window.innerWidth < 700 ? 48 : 80;
      ctx.beginPath();
      for (var i = 0; i <= steps; i++) {
        var t = i / steps;
        var y = t * h;
        var wave = Math.sin(t * 5.1 + time * 0.00032 + scrollP * 7.2 + index * 0.9) * w * 0.16;
        var wave2 = Math.sin(t * 2.05 - time * 0.0002 + index) * w * 0.06;
        var x = w * (0.62 - scrollP * 0.12) + wave + wave2 + index * w * 0.012;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = colors[index % colors.length];
      ctx.globalAlpha = alpha;
      ctx.lineWidth = (index === 0 ? 2.4 : 1.15) * dpr;
      ctx.shadowColor = colors[index % colors.length];
      ctx.shadowBlur = (index === 0 ? 16 : 8) * dpr;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    function frame(time) {
      var max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      var p = (window.scrollY || 0) / max;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.globalCompositeOperation = "source-over";
      var n = window.innerWidth < 700 ? 2 : 4;
      for (var i = 0; i < n; i++) ribbon(time, p, i, i === 0 ? 0.85 : 0.45);
      ctx.shadowBlur = 0;
      var ky = (0.12 + p * 0.72) * canvas.height;
      var kx = canvas.width * (0.62 - p * 0.1);
      var g = ctx.createRadialGradient(kx, ky, 0, kx, ky, canvas.width * 0.22);
      g.addColorStop(0, "rgba(43,123,255,0.28)");
      g.addColorStop(0.45, "rgba(255,45,138,0.10)");
      g.addColorStop(1, "rgba(255,45,138,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      if (running) requestAnimationFrame(frame);
    }
    fit();
    window.addEventListener("resize", fit, { passive: true });
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) running = false;
      else if (!reduce && !running) { running = true; requestAnimationFrame(frame); }
    });
    requestAnimationFrame(frame);
  }

  /* ——— Focus-settle ——— */
  var settleNodes = [].slice.call(document.querySelectorAll(".settle"));
  if (reduce || !("IntersectionObserver" in window)) {
    settleNodes.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.22, rootMargin: "0px 0px -8% 0px" });
    settleNodes.forEach(function (el) { io.observe(el); });
  }

  /* ——— Logo plate opens from the nav mark and folds back ——— */
  var plate = document.querySelector(".plate-section");
  var plateCard = plate ? plate.querySelector(".plate-card") : null;
  var plateLogo = document.querySelector(".nav .mark");
  var plateAnim = null;
  var plateWAAPI = !!(plateCard && plateLogo && typeof plateCard.animate === "function");
  if (plate && !reduce) {
    var ticking = false;
    function plateFrame() {
      ticking = false;
      var rect = plate.getBoundingClientRect();
      var vh = window.innerHeight || 1;
      var center = rect.top + Math.min(rect.height * 0.45, vh * 0.45);
      var dist = Math.abs(center - vh * 0.48) / (vh * 0.58);
      var t = Math.max(0, Math.min(1, 1 - dist));
      var eased = t * t * (3 - 2 * t);
      if (plateWAAPI) {
        var box = plate.querySelector(".wrap").getBoundingClientRect();
        var l = plateLogo.getBoundingClientRect();
        var dx = (l.left + l.width / 2) - (box.left + box.width / 2);
        var dy = (l.top + l.height / 2) - (box.top + box.height / 2);
        var scale = 0.07 + eased * 0.93;
        var x = dx * (1 - eased);
        var y = dy * (1 - eased);
        var opacity = eased < 0.08 ? 0 : 1;
        plate.classList.toggle("is-live", eased > 0.82);
        try {
          if (plateAnim) plateAnim.cancel();
          plateAnim = plateCard.animate(
            [{
              transform: "translate(" + x.toFixed(1) + "px," + y.toFixed(1) + "px) scale(" + scale.toFixed(3) + ")",
              opacity: opacity
            }],
            { duration: 220, fill: "forwards", easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
          );
          return;
        } catch (err) {
          plateWAAPI = false;
        }
      }
      var step = String(Math.round(eased * 10));
      if (plate.getAttribute("data-open") !== step) plate.setAttribute("data-open", step);
    }
    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(plateFrame);
      }
    }
    plateFrame();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", plateFrame);
  } else if (plate) {
    plate.setAttribute("data-open", "10");
  }

  /* ——— Tilting glass ——— */
  var glass = document.getElementById("glass");
  if (glass && fine && wide && !reduce && typeof glass.animate === "function") {
    var stage = glass.parentElement;
    var tx = 6;
    var ty = -10;
    var curX = 6;
    var curY = -10;
    function apply() {
      curX += (tx - curX) * 0.12;
      curY += (ty - curY) * 0.12;
      try {
        glass.animate(
          [{ transform: "rotateX(" + curX.toFixed(2) + "deg) rotateY(" + curY.toFixed(2) + "deg)" }],
          { duration: 180, fill: "forwards", easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
        );
      } catch (err) { return; }
      if (Math.abs(tx - curX) > 0.05 || Math.abs(ty - curY) > 0.05) requestAnimationFrame(apply);
    }
    stage.addEventListener("pointermove", function (e) {
      if (e.pointerType && e.pointerType !== "mouse") return;
      var r = stage.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      ty = px * 16;
      tx = -py * 10 + 4;
      apply();
    });
    stage.addEventListener("pointerleave", function () {
      tx = 6; ty = -10; apply();
    });
  }

  /* ——— Live flow inside the glass ——— */
  var nodes = [].slice.call(document.querySelectorAll(".node"));
  if (nodes.length && !reduce) {
    var step = 0;
    setInterval(function () {
      nodes.forEach(function (n, i) { n.classList.toggle("is-on", i === step); });
      step = (step + 1) % nodes.length;
    }, 1200);
    nodes[0].classList.add("is-on");
  } else if (nodes[0]) {
    nodes[0].classList.add("is-on");
  }

  /* ——— Scope meter ——— */
  var scope = document.getElementById("scope");
  var meter = document.getElementById("meter");
  var T = window.__t || function (s) { return s; };
  var names = ["Redesign", "New website", "Online store"];
  var ctaLabels = ["Start a Redesign", "Start a new website", "Start an online store"];
  var cta = document.getElementById("scope-cta");
  var picks = document.querySelectorAll("input[name='scope-pick']");
  function setScope(index) {
    var i = Math.max(0, Math.min(2, index));
    if (scope) scope.setAttribute("data-scope", ["redesign", "new", "store"][i]);
    if (meter) {
      meter.value = String(i);
      meter.setAttribute("aria-valuenow", String(i));
      meter.setAttribute("aria-valuetext", T(names[i] + ". Quoted after a preview."));
    }
    for (var r = 0; r < picks.length; r++) {
      picks[r].checked = Number(picks[r].value) === i;
    }
    if (cta) cta.textContent = T(ctaLabels[i]);
  }
  if (meter) {
    setScope(Number(meter.value || 1));
    meter.addEventListener("input", function () { setScope(Number(meter.value)); });
  } else if (picks.length) {
    var start = 1;
    for (var r = 0; r < picks.length; r++) if (picks[r].checked) start = Number(picks[r].value);
    setScope(start);
  }
  for (var r = 0; r < picks.length; r++) {
    picks[r].addEventListener("change", function () { setScope(Number(this.value)); });
  }

  /* ——— Contact form opens the visitor's mail with the note ——— */
  var form = document.getElementById("contact-form");
  var err = document.getElementById("form-error");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (err) err.textContent = "";
      if (!form.checkValidity()) {
        if (err) err.textContent = T("Add a business name and an email so the note can be sent.");
        form.reportValidity();
        return;
      }
      var data = new FormData(form);
      var scopeName = "New website";
      if (scope) {
        var key = scope.getAttribute("data-scope");
        scopeName = key === "redesign" ? "Redesign" : key === "store" ? "Online store" : "New website";
      }
      scopeName = T(scopeName);
      var business = String(data.get("business") || "").trim();
      var email = String(data.get("email") || "").trim();
      var site = String(data.get("site") || "").trim();
      var body = [
        T("Business:") + " " + business,
        T("Email:") + " " + email,
        T("Current website:") + " " + (site || T("none yet")),
        T("Scope:") + " " + scopeName
      ].join("\n");
      var href = "mailto:pixelpopsite@gmail.com?subject=" +
        encodeURIComponent(T("Website for") + " " + business) +
        "&body=" + encodeURIComponent(body);
      window.location.href = href;
    });
  }

  /* ——— Mobile menu ——— */
  var btn = document.querySelector(".burger");
  var menu = document.getElementById("menu");
  if (btn && menu) {
    var behind = [document.getElementById("main"), document.querySelector(".foot")].filter(Boolean);
    function setOpen(open, restore) {
      var was = document.body.classList.contains("menu-open");
      document.body.classList.toggle("menu-open", open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      behind.forEach(function (el) {
        if (open) el.setAttribute("inert", "");
        else el.removeAttribute("inert");
      });
      if (open && !was) {
        var first = menu.querySelector("a");
        if (first) first.focus();
      } else if (!open && was && restore) btn.focus();
    }
    btn.addEventListener("click", function () {
      setOpen(!document.body.classList.contains("menu-open"), true);
    });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false, false);
    });
    document.addEventListener("keydown", function (e) {
      if (!document.body.classList.contains("menu-open")) return;
      if (e.key === "Escape") setOpen(false, true);
      if (e.key === "Tab") {
        var items = [btn].concat([].slice.call(menu.querySelectorAll("a, button")));
        var first = items[0];
        var last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    var mq = window.matchMedia("(min-width: 980px)");
    function onMq(e) { if (e.matches) setOpen(false, false); }
    if (mq.addEventListener) mq.addEventListener("change", onMq);
  }
})();
