/* ============================================================================
   ASSISTANT IA — Widget de chat (front-end)
   Portfolio de Théo Vigouroux
   ============================================================================
   À faire : remplace WORKER_URL ci-dessous par l'URL de ton Worker Cloudflare
   (voir GUIDE_INSTALLATION.md, étape 2). C'est la SEULE chose à modifier ici.
   ============================================================================ */

const TVA_CONFIG = {
  workerUrl: "https://theo-portfolio-ia.theovigouroux2007.workers.dev",
};

(function () {
  "use strict";

  if (document.getElementById("tva-root")) return; // évite les doublons

  const SUGGESTIONS = [
    "Présente-toi",
    "Explique le métronome NE555 en détail",
    "Quel est ton objectif professionnel ?",
    "Quels projets as-tu réalisés en BUT GEII ?",
  ];

  /* ---------- styles ---------- */
  const style = document.createElement("style");
  style.textContent = `
#tva-root{position:fixed;z-index:9999;right:20px;bottom:20px;font-family:-apple-system,'Helvetica Neue',sans-serif}
#tva-toggle{
  width:58px;height:58px;border-radius:50%;border:none;cursor:pointer;
  background:var(--blue,#2997ff);color:#fff;display:flex;align-items:center;justify-content:center;
  box-shadow:0 8px 28px rgba(41,151,255,.45);transition:transform .2s,box-shadow .2s;
}
#tva-toggle:hover{transform:scale(1.06);box-shadow:0 10px 34px rgba(41,151,255,.55)}
#tva-toggle svg{width:26px;height:26px}
#tva-panel{
  position:fixed;right:20px;bottom:90px;width:380px;max-width:calc(100vw - 32px);
  height:min(560px, calc(100vh - 130px));background:#0c0c0e;border:1px solid var(--border,rgba(255,255,255,.08));
  border-radius:20px;box-shadow:0 24px 70px rgba(0,0,0,.55);display:flex;flex-direction:column;overflow:hidden;
  opacity:0;transform:translateY(16px) scale(.97);pointer-events:none;transition:opacity .22s,transform .22s;
}
#tva-panel.tva-open{opacity:1;transform:translateY(0) scale(1);pointer-events:auto}
.tva-header{
  display:flex;align-items:center;justify-content:space-between;padding:16px 18px;
  border-bottom:1px solid var(--border,rgba(255,255,255,.08));background:rgba(255,255,255,.02);
}
.tva-header-title{display:flex;align-items:center;gap:9px;font-size:14px;font-weight:600;color:var(--white,#f5f5f7)}
.tva-dot{width:8px;height:8px;border-radius:50%;background:#34d399;box-shadow:0 0 8px rgba(52,211,153,.8);flex-shrink:0}
.tva-sub{font-size:11px;color:var(--gray,#86868b);font-weight:400;margin-top:1px}
#tva-close{background:none;border:none;color:var(--gray,#86868b);font-size:20px;cursor:pointer;line-height:1;padding:4px}
#tva-close:hover{color:var(--white,#f5f5f7)}
#tva-messages{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px}
.tva-msg{font-size:13.5px;line-height:1.55;max-width:86%;padding:10px 13px;border-radius:14px;white-space:pre-wrap;word-wrap:break-word}
.tva-msg.user{align-self:flex-end;background:var(--blue,#2997ff);color:#fff;border-bottom-right-radius:4px}
.tva-msg.bot{align-self:flex-start;background:rgba(255,255,255,.06);color:var(--white,#f5f5f7);border:1px solid var(--border,rgba(255,255,255,.08));border-bottom-left-radius:4px}
.tva-msg.error{background:rgba(255,59,48,.1);border:1px solid rgba(255,59,48,.3);color:#ff8a80}
.tva-typing{align-self:flex-start;display:flex;gap:4px;padding:12px 14px}
.tva-typing span{width:6px;height:6px;border-radius:50%;background:var(--gray,#86868b);animation:tvaBlink 1.2s infinite}
.tva-typing span:nth-child(2){animation-delay:.2s}
.tva-typing span:nth-child(3){animation-delay:.4s}
@keyframes tvaBlink{0%,80%,100%{opacity:.25}40%{opacity:1}}
.tva-suggestions{display:flex;flex-wrap:wrap;gap:7px;padding:0 16px 14px}
.tva-chip{
  font-size:12px;padding:7px 12px;border-radius:980px;border:1px solid var(--border,rgba(255,255,255,.08));
  background:rgba(255,255,255,.04);color:var(--white,#f5f5f7);cursor:pointer;transition:border-color .2s,background .2s;
}
.tva-chip:hover{border-color:var(--blue,#2997ff);background:rgba(41,151,255,.1)}
.tva-inputrow{display:flex;gap:8px;padding:12px;border-top:1px solid var(--border,rgba(255,255,255,.08))}
#tva-input{
  flex:1;background:rgba(255,255,255,.05);border:1px solid var(--border,rgba(255,255,255,.08));
  border-radius:980px;padding:10px 16px;color:var(--white,#f5f5f7);font-size:13.5px;outline:none;
}
#tva-input:focus{border-color:var(--blue,#2997ff)}
#tva-send{
  width:38px;height:38px;border-radius:50%;border:none;background:var(--blue,#2997ff);color:#fff;
  cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:opacity .2s;
}
#tva-send:disabled{opacity:.4;cursor:default}
.tva-footer{text-align:center;font-size:10px;color:var(--gray,#86868b);padding:0 0 10px}
@media(max-width:480px){
  #tva-panel{right:12px;left:12px;width:auto;bottom:84px;height:min(70vh, calc(100vh - 110px))}
  #tva-toggle{right:8px;bottom:14px}
}
`;
  document.head.appendChild(style);

  /* ---------- markup ---------- */
  const root = document.createElement("div");
  root.id = "tva-root";
  root.innerHTML = `
    <div id="tva-panel" role="dialog" aria-label="Assistant IA de Théo">
      <div class="tva-header">
        <div>
          <div class="tva-header-title"><span class="tva-dot"></span>Assistant de Théo</div>
          <div class="tva-sub">Pose une question sur son parcours ou ses projets</div>
        </div>
        <button id="tva-close" aria-label="Fermer">&times;</button>
      </div>
      <div id="tva-messages"></div>
      <div class="tva-suggestions" id="tva-suggestions"></div>
      <div class="tva-inputrow">
        <input id="tva-input" type="text" placeholder="Écris ta question..." autocomplete="off" />
        <button id="tva-send" aria-label="Envoyer">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </button>
      </div>
      <div class="tva-footer">Réponses générées par IA — peut se tromper</div>
    </div>
    <button id="tva-toggle" aria-label="Ouvrir l'assistant IA">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
    </button>
  `;
  document.body.appendChild(root);

  const panel = document.getElementById("tva-panel");
  const toggleBtn = document.getElementById("tva-toggle");
  const closeBtn = document.getElementById("tva-close");
  const messagesEl = document.getElementById("tva-messages");
  const inputEl = document.getElementById("tva-input");
  const sendBtn = document.getElementById("tva-send");
  const suggestionsEl = document.getElementById("tva-suggestions");

  /* ---------- conversation persistée pendant la visite (entre les pages) ---------- */
  const STORAGE_KEY = "tva_history_v1";
  let history = [];
  try {
    history = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    history = [];
  }

  function saveHistory() {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(-20)));
    } catch {}
  }

  function addBubble(text, role) {
    const div = document.createElement("div");
    div.className = "tva-msg " + (role === "user" ? "user" : role === "error" ? "error" : "bot");
    div.textContent = text;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return div;
  }

  function renderSuggestions() {
    suggestionsEl.innerHTML = "";
    if (history.length > 0) return;
    SUGGESTIONS.forEach((s) => {
      const chip = document.createElement("button");
      chip.className = "tva-chip";
      chip.type = "button";
      chip.textContent = s;
      chip.addEventListener("click", () => sendMessage(s));
      suggestionsEl.appendChild(chip);
    });
  }

  function renderHistory() {
    messagesEl.innerHTML = "";
    if (history.length === 0) {
      addBubble(
        "👋 Salut ! Je suis l'assistant IA du portfolio de Théo. Je peux te le présenter, expliquer ses projets en détail, ou répondre à tes questions. Que veux-tu savoir ?",
        "bot"
      );
    } else {
      history.forEach((h) => addBubble(h.text, h.role === "user" ? "user" : "bot"));
    }
    renderSuggestions();
  }

  function showTyping() {
    const div = document.createElement("div");
    div.className = "tva-typing";
    div.id = "tva-typing-indicator";
    div.innerHTML = "<span></span><span></span><span></span>";
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }
  function hideTyping() {
    const el = document.getElementById("tva-typing-indicator");
    if (el) el.remove();
  }

  async function sendMessage(text) {
    const msg = (text !== undefined ? text : inputEl.value).trim();
    if (!msg) return;

    inputEl.value = "";
    inputEl.disabled = true;
    sendBtn.disabled = true;

    suggestionsEl.innerHTML = "";
    addBubble(msg, "user");
    history.push({ role: "user", text: msg });
    saveHistory();
    showTyping();

    try {
      const res = await fetch(TVA_CONFIG.workerUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, history: history.slice(0, -1) }),
      });

      hideTyping();

      const data = await res.json().catch(() => null);

      if (!res.ok || !data || data.error) {
        addBubble(
          "Oups, l'assistant n'a pas pu répondre (problème de connexion au serveur). Réessaie dans un instant.",
          "error"
        );
      } else {
        addBubble(data.reply, "bot");
        history.push({ role: "model", text: data.reply });
        saveHistory();
      }
    } catch (e) {
      hideTyping();
      addBubble("Oups, impossible de contacter l'assistant pour le moment. Vérifie ta connexion et réessaie.", "error");
    } finally {
      inputEl.disabled = false;
      sendBtn.disabled = false;
      inputEl.focus();
    }
  }

  function openPanel() {
    panel.classList.add("tva-open");
    renderHistory();
    setTimeout(() => inputEl.focus(), 150);
  }
  function closePanel() {
    panel.classList.remove("tva-open");
  }

  toggleBtn.addEventListener("click", () => {
    panel.classList.contains("tva-open") ? closePanel() : openPanel();
  });
  closeBtn.addEventListener("click", closePanel);
  sendBtn.addEventListener("click", () => sendMessage());
  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
  });
})();
