/* ============================================================================
   I18N.JS — Traduction IA + Bouton dans la Nav Bar + Barre de chargement
   Portfolio de Théo Vigouroux
   ============================================================================ */

(function () {
  "use strict";

  var WORKER_URL = "https://theo-portfolio-ia.theovigouroux2007.workers.dev";

  var LANGS  = ["fr", "en", "es", "de", "it", "pt", "zh"];
  var FLAGS  = { fr:"🇫🇷", en:"🇬🇧", es:"🇪🇸", de:"🇩🇪", it:"🇮🇹", pt:"🇵🇹", zh:"🇨🇳" };
  var SHORT_NAMES = { fr:"FR", en:"EN", es:"ES", de:"DE", it:"IT", pt:"PT", zh:"ZH" };
  var FULL_NAMES  = { fr:"Français", en:"English", es:"Español", de:"Deutsch", it:"Italiano", pt:"Português", zh:"中文" };
  var LANG_FULL_NAMES = {
    fr: "français", en: "English", es: "Spanish", de: "German",
    it: "Italian", pt: "Portuguese", zh: "Simplified Chinese"
  };

  var STORAGE_LANG = "tva_lang";

  /* ════════════════════════════════════════════
     BARRE DE CHARGEMENT DE TRADUCTION
     ════════════════════════════════════════════ */

  function getProgressBar() {
    var pb = document.getElementById("i18nProgressBar");
    if (!pb) {
      pb = document.createElement("div");
      pb.id = "i18nProgressBar";
      var nav = document.querySelector("nav");
      if (nav && nav.parentNode) {
        nav.parentNode.insertBefore(pb, nav.nextSibling);
      } else {
        document.body.appendChild(pb);
      }
    }
    return pb;
  }

  function startProgress() {
    var pb = getProgressBar();
    pb.style.width = "0%";
    pb.classList.add("active");
    setTimeout(function () { pb.style.width = "35%"; }, 30);
  }

  function midProgress() {
    var pb = getProgressBar();
    pb.style.width = "75%";
  }

  function endProgress() {
    var pb = getProgressBar();
    pb.style.width = "100%";
    setTimeout(function () {
      pb.classList.remove("active");
      setTimeout(function () { pb.style.width = "0%"; }, 300);
    }, 350);
  }

  /* ════════════════════════════════════════════
     MENU MOBILE
     ════════════════════════════════════════════ */
  function initMobileMenu() {
    var toggle = document.getElementById("navToggle");
    var menu   = document.querySelector("nav ul");
    if (!toggle || !menu) return;

    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("nav-open");
      toggle.textContent = open ? "✕" : "☰";
      toggle.setAttribute("aria-expanded", String(open));
    });

    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        menu.classList.remove("nav-open");
        toggle.textContent = "☰";
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ════════════════════════════════════════════
     UTILITAIRES
     ════════════════════════════════════════════ */

  function getCurrentLang() {
    var saved = "";
    try { saved = localStorage.getItem(STORAGE_LANG) || ""; } catch (e) {}
    if (saved && LANGS.indexOf(saved) !== -1) return saved;
    var nav = ((navigator.language || "fr").split("-")[0]).toLowerCase();
    return LANGS.indexOf(nav) !== -1 ? nav : "fr";
  }

  function saveLang(lang) {
    try { localStorage.setItem(STORAGE_LANG, lang); } catch (e) {}
  }

  function hash(str) {
    var h = 5381;
    for (var i = 0; i < str.length; i++) {
      h = ((h << 5) + h) ^ str.charCodeAt(i);
    }
    return (h >>> 0).toString(36);
  }

  function escHtml(s) {
    return s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function getSource(el) {
    if (!el.dataset.i18nOrig) {
      el.dataset.i18nOrig = (el.innerText || el.textContent || "").trim();
    }
    return el.dataset.i18nOrig;
  }

  function applyText(el, text) {
    if (!text) return;
    if (text.indexOf("\n") !== -1) {
      el.innerHTML = text.split("\n").map(escHtml).join("<br>");
    } else {
      el.textContent = text;
    }
  }

  /* ════════════════════════════════════════════
     CACHE LOCAL
     ════════════════════════════════════════════ */

  function cacheKey(lang, sourceHash) {
    return "tva_t_" + lang + "_" + sourceHash;
  }

  function cacheGet(lang, sourceHash) {
    try {
      var raw = localStorage.getItem(cacheKey(lang, sourceHash));
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  function cacheSet(lang, sourceHash, data) {
    try {
      var prefix = "tva_t_" + lang + "_";
      Object.keys(localStorage).forEach(function (k) {
        if (k.indexOf(prefix) === 0 && k !== cacheKey(lang, sourceHash)) {
          localStorage.removeItem(k);
        }
      });
      localStorage.setItem(cacheKey(lang, sourceHash), JSON.stringify(data));
    } catch (e) {}
  }

  /* ════════════════════════════════════════════
     APPEL WORKER
     ════════════════════════════════════════════ */

  function callTranslate(lang, texts) {
    var cleanUrl = WORKER_URL.replace(/\/+$/, "");
    console.log("[i18n] Envoi de la demande de traduction à :", cleanUrl + "/translate");

    return fetch(cleanUrl + "/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lang: lang, langName: LANG_FULL_NAMES[lang], texts: texts })
    })
    .then(function (res) {
      if (!res.ok) {
        console.error("[i18n] Erreur HTTP du Worker :", res.status, res.statusText);
        return res.json().then(function(errData) {
          console.error("[i18n] Détails de l'erreur Worker :", errData);
          return null;
        }).catch(function() { return null; });
      }
      return res.json();
    })
    .then(function (data) {
      if (!data || !data.translations) {
        console.error("[i18n] La réponse du Worker ne contient pas de traductions valide :", data);
        return null;
      }
      return data.translations;
    })
    .catch(function (err) {
      console.error("[i18n] Erreur réseau lors de l'appel au Worker :", err);
      return null;
    });
  }

  /* ════════════════════════════════════════════
     APPLICATION DE LA TRADUCTION
     ════════════════════════════════════════════ */

  function applyLang(lang) {
    document.documentElement.setAttribute("lang", lang);

    var elements = Array.from(document.querySelectorAll("[data-i18n]"));
    if (!elements.length) {
      console.warn("[i18n] Aucun élément avec l'attribut [data-i18n] n'a été trouvé.");
      return Promise.resolve();
    }

    startProgress();

    if (lang === "fr") {
      elements.forEach(function (el) {
        var orig = getSource(el);
        if (orig) applyText(el, orig);
      });
      endProgress();
      return Promise.resolve();
    }

    var texts = {};
    elements.forEach(function (el, i) {
      texts[i] = getSource(el);
    });

    var sourceHash = hash(Object.values(texts).join("|"));

    var cached = cacheGet(lang, sourceHash);
    if (cached) {
      console.log("[i18n] Traduction chargée depuis le cache pour :", lang);
      elements.forEach(function (el, i) {
        if (cached[i]) applyText(el, cached[i]);
      });
      endProgress();
      return Promise.resolve();
    }

    elements.forEach(function (el) { el.style.opacity = "0.4"; });
    midProgress();

    return callTranslate(lang, texts).then(function (translations) {
      elements.forEach(function (el) { el.style.opacity = ""; });
      if (!translations) {
        console.error("[i18n] Échec de la traduction.");
        endProgress();
        return;
      }

      console.log("[i18n] Traduction reçue avec succès !");
      cacheSet(lang, sourceHash, translations);
      elements.forEach(function (el, i) {
        if (translations[i]) applyText(el, translations[i]);
      });
      endProgress();
    });
  }

  /* ════════════════════════════════════════════
     BOUTON DANS LA NAV BAR + STYLES
     ════════════════════════════════════════════ */

  var style = document.createElement("style");
  style.textContent =
    "#i18nProgressBar{position:fixed;top:60px;left:0;width:0%;height:3px;background:var(--blue,#2997ff);box-shadow:0 0 10px rgba(41,151,255,0.8);z-index:10000;opacity:0;transition:width .3s ease,opacity .3s ease;pointer-events:none;}" +
    "#i18nProgressBar.active{opacity:1;}" +
    ".tva-nav-lang{position:relative;display:inline-flex;align-items:center;list-style:none;margin-left:10px;}" +
    "#tvaNavBtn{background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);color:#f5f5f7;padding:6px 12px;border-radius:20px;font-size:13px;font-weight:500;cursor:pointer;display:inline-flex;align-items:center;gap:6px;transition:all 0.2s ease;backdrop-filter:blur(8px);}" +
    "#tvaNavBtn:hover{background:rgba(255,255,255,0.15);border-color:var(--blue,#2997ff);color:#fff;}" +
    ".tva-arrow{font-size:10px;opacity:0.7;}" +
    "#tvaNavMenu{position:absolute;top:calc(100% + 10px);right:0;background:rgba(12,12,14,0.95);backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,0.12);border-radius:12px;padding:6px;display:none;flex-direction:column;gap:2px;min-width:150px;box-shadow:0 10px 30px rgba(0,0,0,0.6);z-index:9999;}" +
    "#tvaNavMenu.open{display:flex;}" +
    ".tva-lang-item{background:none;border:none;color:#f5f5f7;font-size:13px;padding:8px 12px;border-radius:8px;text-align:left;cursor:pointer;transition:background 0.15s;white-space:nowrap;display:flex;align-items:center;gap:8px;}" +
    ".tva-lang-item:hover{background:rgba(255,255,255,0.1);}" +
    ".tva-lang-item.cur{color:var(--blue,#2997ff);font-weight:600;background:rgba(41,151,255,0.1);}" +
    /* ── CORRECTIF MOBILE : le bouton de langue etait masque par le menu hamburger ── */
    "@media(max-width:768px){" +
      "nav ul.nav-open{max-height:520px !important;}" +
      ".tva-nav-lang{width:100%;margin:10px 0 4px;padding:0 24px;box-sizing:border-box;justify-content:center;}" +
      "#tvaNavBtn{width:100%;justify-content:center;padding:12px;border-radius:10px;}" +
      "#tvaNavMenu{position:static;width:100%;margin-top:8px;box-shadow:none;box-sizing:border-box;}" +
    "}";
  document.head.appendChild(style);

  function buildNavSwitcher() {
    var navTarget = document.querySelector("nav ul") || document.querySelector("nav");
    if (!navTarget) return;

    if (document.getElementById("tvaNavLang")) return;

    var cur = getCurrentLang();

    var container = document.createElement(navTarget.tagName === "UL" ? "li" : "div");
    container.id = "tvaNavLang";
    container.className = "tva-nav-lang";

    var btn = document.createElement("button");
    btn.type = "button";
    btn.id = "tvaNavBtn";
    btn.innerHTML = (FLAGS[cur] || "🌐") + ' <span>' + (SHORT_NAMES[cur] || cur.toUpperCase()) + '</span> <span class="tva-arrow">▾</span>';

    var menu = document.createElement("div");
    menu.id = "tvaNavMenu";
    menu.innerHTML = LANGS.map(function (l) {
      return (
        '<button type="button" class="tva-lang-item' + (l === cur ? " cur" : "") + '" data-l="' + l + '">' +
          (FLAGS[l] || "") + " " + (FULL_NAMES[l] || l) +
        '</button>'
      );
    }).join("");

    container.appendChild(btn);
    container.appendChild(menu);
    navTarget.appendChild(container);

    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      menu.classList.toggle("open");
    });

    menu.querySelectorAll(".tva-lang-item").forEach(function (item) {
      item.addEventListener("click", function () {
        var selectedLang = item.getAttribute("data-l");
        menu.classList.remove("open");

        menu.querySelectorAll(".tva-lang-item").forEach(function (i) {
          i.classList.toggle("cur", i.getAttribute("data-l") === selectedLang);
        });

        btn.innerHTML = (FLAGS[selectedLang] || "🌐") + ' <span>' + (SHORT_NAMES[selectedLang] || selectedLang.toUpperCase()) + '</span> <span class="tva-arrow">▾</span>';
        saveLang(selectedLang);
        applyLang(selectedLang);
      });
    });
  }

  document.addEventListener("click", function () {
    var d = document.getElementById("tvaNavMenu");
    if (d) d.classList.remove("open");
  });

  /* ════════════════════════════════════════════
     INITIALISATION
     ════════════════════════════════════════════ */

  function init() {
    initMobileMenu();
    buildNavSwitcher();

    var lang = getCurrentLang();
    applyLang(lang).catch(function () {});

    var yr = document.getElementById("tvaYear");
    if (yr) yr.textContent = new Date().getFullYear();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
