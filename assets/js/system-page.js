(function () {
  var btn = document.getElementById("replay");
  var demo = document.getElementById("settle-demo");
  if (btn && demo) {
    btn.addEventListener("click", function () {
      demo.classList.remove("in");
      void demo.offsetWidth;
      demo.classList.add("in");
    });
  }
  var sample = document.getElementById("sample-form");
  if (sample) sample.addEventListener("submit", function (e) { e.preventDefault(); });
})();
