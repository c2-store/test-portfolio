/* ============================================================================
   I18N.JS — Traducteur automatique IA + menu mobile (avec Logs Debug)
   Portfolio de Théo Vigouroux
   ============================================================================ */

(function () {
  "use strict";

  var WORKER_URL = "https://theo-portfolio-ia.theovigouroux2007.workers.dev";

  var LANGS  = ["fr", "en", "es", "de", "it", "pt", "zh"];
  var FLAGS  = { fr:"🇫🇷", en:"🇬🇧", es:"🇪🇸", de:"🇩🇪", it:"🇮🇹", pt:"🇵🇹", zh:"🇨🇳" };
  var NAMES  = { fr:"Français", en:"English", es:"Español", de:"Deutsch", it:"Italiano", pt:"Português", zh:"中文" };
  var LANG_FULL_NAMES = {
    fr: "français", en: "English", es: "Spanish", de: "German",
    it: "Italian", pt: "Portuguese", zh: "Simplified Chinese"
  };

  var STORAGE_LANG = "tva_lang";

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
     CACHE
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
      console.warn("[i18n] Aucun élément avec l'attribut [data-i18n] n'a été trouvé dans le HTML.");
      return Promise.resolve();
    }

    if (lang === "fr") {
      elements.forEach(function (el) {
        var orig = getSource(el);
        if (orig) applyText(el, orig);
      });
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
      return Promise.resolve();
    }

    elements.forEach(function (el) { el.style.opacity = "0.4"; });

    return callTranslate(lang, texts).then(function (translations) {
      elements.forEach(function (el) { el.style.opacity = ""; });
      if (!translations) {
        console.error("[i18n] Échec de la traduction.");
        return;
      }

      console.log("[i18n] Traduction reçue avec succès !");
      cacheSet(lang, sourceHash, translations);
      elements.forEach(function (el, i) {
        if (translations[i]) applyText(el, translations[i]);
      });
    });
  }

  /* ════════════════════════════════════════════
     SÉLECTEUR DE LANGUE FLOTTANT
     ════════════════════════════════════════════ */

  var style = document.createElement("style");
  style.textContent =
    "#tvaFloat{position:fixed;bottom:20px;left:20px;z-index:9998;display:flex;align-items:center;gap:0;}" +
    "#tvaFloatBtn{width:50px;height:50px;border-radius:50%;border:1px solid rgba(255,255,255,.15);background:rgba(12,12,14,.92);backdrop-filter:blur(12px);color:#f5f5f7;font-size:22px;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 18px rgba(0,0,0,.45);transition:transform .2s,border-color .2s;}" +
    "#tvaFloatBtn:hover{transform:scale(1.07);border-color:var(--blue,#2997ff)}" +
    "#tvaFloatMenu{position:absolute;bottom:calc(100% + 10px);left:0;background:#0c0c0e;border:1px solid rgba(255,255,255,.10);border-radius:14px;padding:6px;display:none;flex-direction:column;min-width:160px;box-shadow:0 12px 40px rgba(0,0,0,.6);z-index:9999;}" +
    "#tvaFloatMenu.open{display:flex}" +
    ".tva-lang-item{background:none;border:none;color:#f5f5f7;font-size:13px;padding:9px 12px;border-radius:8px;text-align:left;cursor:pointer;transition:background .15s;white-space:nowrap;}" +
    ".tva-lang-item:hover{background:rgba(255,255,255,.08)}" +
    ".tva-lang-item.cur{color:var(--blue,#2997ff);font-weight:600}";
  document.head.appendChild(style);

  function buildSwitcher() {
    if (document.getElementById("tvaFloat")) return;
    var cur = getCurrentLang();

    var wrap = document.createElement("div");
    wrap.id = "tvaFloat";

    var menu = document.createElement("div");
    menu.id = "tvaFloatMenu";
    menu.innerHTML = LANGS.map(function (l) {
      return (
        '<button type="button" class="tva-lang-item' + (l === cur ? " cur" : "") + '" data-l="' + l + '">' +
          (FLAGS[l] || "") + " " + (NAMES[l] || l) +
        "</button>"
      );
    }).join("");

    var btn = document.createElement("button");
    btn.type = "button";
    btn.id = "tvaFloatBtn";
    btn.setAttribute("aria-label", "Changer de langue");
    btn.setAttribute("aria-haspopup", "true");
    btn.textContent = FLAGS[cur] || "🌐";

    wrap.appendChild(menu);
    wrap.appendChild(btn);
    document.body.appendChild(wrap);

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
        
        btn.textContent = FLAGS[selectedLang] || "🌐";
        saveLang(selectedLang);
        applyLang(selectedLang);
      });
    });
  }

  document.addEventListener("click", function () {
    var d = document.getElementById("tvaFloatMenu");
    if (d) d.classList.remove("open");
  });

  /* ════════════════════════════════════════════
     INITIALISATION
     ════════════════════════════════════════════ */

  function init() {
    initMobileMenu();
    buildSwitcher();

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
