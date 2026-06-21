/* ============================================================================
   SITE.JS — comportements généraux du site (menu mobile, etc.)
   Portfolio de Théo Vigouroux
   ============================================================================ */

(function () {
  "use strict";
  var toggle = document.getElementById("navToggle");
  var menu = document.querySelector("nav ul");
  if (!toggle || !menu) return;

  toggle.addEventListener("click", function () {
    var open = menu.classList.toggle("nav-open");
    toggle.textContent = open ? "✕" : "☰";
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  menu.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      menu.classList.remove("nav-open");
      toggle.textContent = "☰";
      toggle.setAttribute("aria-expanded", "false");
    });
  });
})();
