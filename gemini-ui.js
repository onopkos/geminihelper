(function() {
  // Evita duplicati
  if (document.getElementById('gemini-visual-root')) {
    const existing = document.getElementById('gemini-visual-root');
    existing.style.display = existing.style.display === 'none' ? 'block' : 'none';
    if(existing.style.display === 'block') initGemini();
    return;
  }

  // --- STILI CSS ---
  const style = document.createElement('style');
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    #gemini-visual-root { position: fixed; z-index: 2147483647; font-family: 'Inter', sans-serif; }
    
    .gemini-panel {
      position: fixed; top: 30px; right: 30px; width: 380px;
      background: rgba(20, 20, 25, 0.85);
      backdrop-filter: blur(20px) saturate(180%);
      -webkit-backdrop-filter: blur(20px) saturate(180%);
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 20px 60px rgba(0,0,0,0.7);
      border-radius: 20px; padding: 24px; color: #f1f5f9;
      animation: geminiFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      display: flex; flex-direction: column; gap: 16px;
    }
    @keyframes geminiFadeIn { from{opacity:0; transform:translateY(15px) scale(0.98)} to{opacity:1; transform:translateY(0) scale(1)} }

    /* Header */
    .g-header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 16px; border-bottom: 1px solid rgba(255,255,255,0.08); cursor: move; user-select: none; }
    .g-title { font-weight: 700; font-size: 18px; background: linear-gradient(135deg, #fff, #93c5fd); -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: -0.5px; }
    .g-badge { font-size: 10px; font-weight: 800; color: #1e293b; background: #93c5fd; padding: 2px 6px; border-radius: 6px; margin-left: 8px; }
    .g-close { cursor: pointer; opacity: 0.6; transition: 0.2s; } 
    .g-close:hover { opacity: 1; color: #fff; transform: scale(1.1); }

    /* Inputs */
    input[type="text"], textarea { 
      width: 100%; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); 
      border-radius: 12px; color: white; padding: 12px; font-family: inherit; outline: none; box-sizing: border-box;
      font-size: 14px; transition: border-color 0.2s; margin-bottom: 10px;
    }
    input[type="text"]:focus, textarea:focus { border-color: #60a5fa; background: rgba(0,0,0,0.5); }
    textarea { height: 100px; resize: none; line-height: 1.5; }

    /* Modelli */
    #model-list-container { max-height: 300px; overflow-y: auto; padding-right: 5px; }
    #model-list-container::-webkit-scrollbar { width: 4px; }
    #model-list-container::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }

    .model-option {
      background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
      padding: 14px; border-radius: 12px; cursor: pointer; transition: 0.2s; margin-bottom: 8px; position: relative;
    }
    .model-option:hover { background: rgba(96, 165, 250, 0.15); border-color: #60a5fa; transform: translateY(-1px); }
    
    .model-custom { background: rgba(255, 215, 0, 0.05); border-color: rgba(255, 215, 0, 0.3); }
    .model-custom:hover { background: rgba(255, 215, 0, 0.1); border-color: #FFD700; }

    .model-title { font-weight: 600; color: #f8fafc; display: block; font-size: 14px; margin-bottom: 3px; }
    .model-desc { font-size: 12px; color: #94a3b8; line-height: 1.3; }
    
    /* Tag Modelli */
    .tag-md { position: absolute; top:12px; right:12px; font-size:9px; color:white; padding:2px 6px; border-radius:4px; font-weight:700;}
    .tag-new { background: #8b5cf6; } /* Viola per Gemini 3 */
    .tag-pro { background: #3b82f6; } /* Blu per Pro */
    .tag-fast { background: #f59e0b; } /* Arancio per Flash */
    .tag-lite { background: #10b981; } /* Verde per Lite */

    .btn-delete { 
        background: rgba(255,255,255,0.1); border: none; color:#cbd5e1; 
        width: 24px; height: 24px; border-radius: 6px; display: flex; align-items: center; justify-content: center;
        cursor: pointer; transition: 0.2s;
    }
    .btn-delete:hover { background: #ef4444; color: white; }

    /* Buttons Liquid Glass */
    .g-btn { 
        background: rgba(255, 255, 255, 0.15); 
        border: 1px solid rgba(255, 255, 255, 0.3);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        padding: 10px 20px; border-radius: 10px; 
        color: white; font-weight: 600; cursor: pointer; transition: 0.2s; width: 100%; 
        font-size: 13px; letter-spacing: 0.3px;
        text-shadow: 0 1px 3px rgba(0,0,0,0.5);
    }
    .g-btn:hover { 
        background: rgba(96, 165, 250, 0.25); border-color: rgba(255, 255, 255, 0.6); 
        transform: translateY(-1px); 
    }
    
    .g-btn-outline { background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.1); box-shadow: none; }
    .g-btn-outline:hover { background: rgba(255,255,255,0.15); border-color: rgba(255,255,255,0.3); }

    #g-copy-btn { 
      background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.1); 
      display: none; align-items: center; gap: 6px; justify-content: center; color: #cbd5e1;
    }
    #g-copy-btn:hover { background: rgba(255,255,255,0.15); border-color: rgba(255,255,255,0.3); color: white; }

    /* Output */
    #g-response { 
        font-size: 14px; line-height: 1.6; max-height: 350px; overflow-y: auto; 
        padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.1); 
        display: none; margin-top: 8px; color: #e2e8f0; 
    }
    #g-response b { color: #93c5fd; font-weight: 600; }
    
    .history-entry { padding: 12px; border-bottom: 1px solid rgba(255,255,255,0.08); transition: background 0.2s; cursor: pointer; }
    .history-entry:hover { background: rgba(255,255,255,0.05); }
    .history-meta { font-size: 11px; color: #60a5fa; margin-bottom: 4px; display: flex; justify-content: space-between; }
    .history-prompt { font-size: 13px; color: #e2e8f0; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
  `;
  document.head.appendChild(style);

  const root = document.createElement('div');
  root.id = 'gemini-visual-root';
  document.body.appendChild(root);

  initGemini();

  function bindClose() {
    const closeBtn = root.querySelector('.g-close');
    if(closeBtn) closeBtn.onclick = () => root.style.display = 'none';
  }
  
  async function saveHistoryEntry(data) {
      const timestamp = new Date().toLocaleString();
      const entry = { 
          timestamp, model: data.modelId, type: data.type, 
          prompt: data.prompt.substring(0, 100) + '...', answer: data.answer 
      };
      let { history = [] } = await chrome.storage.local.get('history');
      history.unshift(entry); 
      if (history.length > 20) history = history.slice(0, 20);
      await chrome.storage.local.set({ history });
  }
  
  async function saveCustomModel(name, code) {
      let { customModels = [] } = await chrome.storage.local.get('customModels');
      if (customModels.some(m => m.code === code)) return "Questo codice modello esiste già.";
      customModels.push({ name, code, type: 'custom' });
      await chrome.storage.local.set({ customModels });
      return null;
  }

  async function deleteCustomModel(code) {
      let { customModels = [] } = await chrome.storage.local.get('customModels');
      customModels = customModels.filter(m => m.code !== code);
      await chrome.storage.local.set({ customModels });
  }

  function initGemini() {
    chrome.storage.local.get(['userApiKey'], (result) => {
      if (result.userApiKey) renderSetupUI();
      else renderApiKeyUI();
    });
  }

  function renderApiKeyUI() {
    root.innerHTML = `
      <div class="gemini-panel">
        <div class="g-header">
          <div><span class="g-title">Gemini Visual</span><span class="g-badge">AI</span></div>
          <span class="g-close">✕</span>
        </div>
        <div style="font-size:13px; color:#cbd5e1; margin-bottom:10px; line-height:1.4;">
          Inserisci la tua API Key (Google AI Studio) per iniziare.<br>
          <a href="https://aistudio.google.com/app/apikey" target="_blank" style="color:#60a5fa;">Ottieni Key ↗</a>
        </div>
        <input type="text" id="g-apikey-input" placeholder="Incolla qui la chiave (AIza...)" autocomplete="off">
        <div id="g-key-error" style="color:#f87171; font-size:12px; display:none; margin-bottom:10px;"></div>
        <button id="g-save-key-btn" class="g-btn">Salva e Continua</button>
      </div>
    `;
    bindClose();
    
    const saveBtn = root.querySelector('#g-save-key-btn');
    const input = root.querySelector('#g-apikey-input');
    const err = root.querySelector('#g-key-error');

    saveBtn.onclick = () => {
      const key = input.value.trim();
      if (key.length < 20 || !key.startsWith("AIza")) {
        err.innerText = "Chiave non valida."; err.style.display = "block"; return;
      }
      chrome.runtime.sendMessage({ action: "saveApiKey", key }, () => renderSetupUI());
    };
  }
  
  // --- LISTA MODELLI AGGIORNATA (2.5 / 3.0) ---
  async function renderSetupUI() {
    const { customModels = [] } = await chrome.storage.local.get('customModels');
    
    // MODELLI PREDEFINITI AGGIORNATI SECONDO IL TUO PDF
    const fixedModels = [
        { code: "gemini-3-pro-preview", name: "💎 Gemini 3 Pro (Preview)", desc: "Intelligenza multimodale suprema.", tag: 'NEW', tagClass: 'tag-new' },
        { code: "gemini-2.5-pro", name: "🧠 Gemini 2.5 Pro", desc: "Ragionamento avanzato e STEM.", tag: 'PRO', tagClass: 'tag-pro' },
        { code: "gemini-2.5-flash", name: "⚡ Gemini 2.5 Flash", desc: "Miglior rapporto prezzo/prestazioni.", tag: 'FAST', tagClass: 'tag-fast' },
        { code: "gemini-2.5-flash-lite", name: "🚀 Gemini 2.5 Flash-Lite", desc: "Ultra veloce ed economico.", tag: 'LITE', tagClass: 'tag-lite' }
    ];

    const allModels = [...fixedModels, ...customModels];
    
    root.innerHTML = `
      <div class="gemini-panel">
        <div class="g-header">
          <div><span class="g-title">Gemini Visual</span><span class="g-badge">AI</span></div>
          <div style="display:flex; gap:10px; align-items:center;">
             <span id="g-history-link" style="font-size:10px; cursor:pointer; opacity:0.7; text-transform:uppercase;">Cronologia</span>
             <span id="g-reset-key" style="font-size:10px; cursor:pointer; opacity:0.5; text-transform:uppercase;">Reset Key</span>
             <span class="g-close">✕</span>
          </div>
        </div>
        <div style="font-size:13px; color:#cbd5e1; margin-bottom:10px;">Seleziona un modello:</div>
        
        <div id="model-list-container">
        ${allModels.map(m => `
            <div class="model-option ${m.type === 'custom' ? 'model-custom' : ''}" data-model="${m.code}">
                ${m.tag ? `<span class="tag-md ${m.tagClass}">${m.tag}</span>` : ''}
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <span class="model-title">${m.name}</span>
                        <span class="model-desc">${m.type === 'custom' ? 'ID: ' + m.code : m.desc}</span>
                    </div>
                    ${m.type === 'custom' ? `<button class="btn-delete" title="Elimina" data-code="${m.code}">✕</button>` : ''}
                </div>
            </div>
        `).join('')}
        </div>

        <span id="g-add-model" style="color: #60a5fa; cursor: pointer; font-size: 13px; text-decoration: underline; display:block; margin-top:15px; text-align:center;">
            ➕ Aggiungi Modello Personalizzato
        </span>
      </div>
    `;
    
    root.querySelectorAll('.model-option').forEach(opt => {
        if (!opt.querySelector('.btn-delete')) { 
            opt.onclick = () => renderChatUI(opt.getAttribute('data-model'));
        }
    });
    
    // Fix: Se clicchi su un modello custom (non sul tasto delete) deve aprirsi
    root.querySelectorAll('.model-custom').forEach(opt => {
        opt.onclick = (e) => {
            if(!e.target.classList.contains('btn-delete')) {
                renderChatUI(opt.getAttribute('data-model'));
            }
        };
    });

    root.querySelectorAll('.btn-delete').forEach(btn => {
        btn.onclick = async (e) => {
            e.stopPropagation(); 
            if (confirm("Rimuovere questo modello?")) {
                await deleteCustomModel(btn.getAttribute('data-code'));
                renderSetupUI();
            }
        };
    });
    
    root.querySelector('#g-add-model').onclick = renderAddModelUI;
    root.querySelector('#g-reset-key').onclick = () => chrome.storage.local.remove(['userApiKey', 'customModels', 'history'], renderApiKeyUI);
    root.querySelector('#g-history-link').onclick = renderHistoryUI;
    bindClose();
  }

  function renderAddModelUI() {
      root.innerHTML = `
        <div class="gemini-panel">
          <div class="g-header">
            <span class="g-title">Aggiungi Modello</span>
            <span class="g-close">✕</span>
          </div>
          <div style="font-size:13px; color:#cbd5e1; margin-bottom:10px;">
             Aggiungi un modello futuro o sperimentale.
          </div>
          <input type="text" id="g-model-name" placeholder="Nome (es: Gemini 2.0 Ultra)">
          <input type="text" id="g-model-code" placeholder="Codice API (es: gemini-2.0-ultra-exp)">
          <div id="g-add-error" style="color:#f87171; font-size:12px; display:none; margin-bottom:10px;"></div>
          <button id="g-save-new-model" class="g-btn">Salva Modello</button>
          <div id="g-back-setup" style="text-align:center; margin-top:10px; font-size:13px; color:#60a5fa; cursor:pointer;">Indietro</div>
        </div>
      `;
      bindClose();
      root.querySelector('#g-back-setup').onclick = renderSetupUI;
      
      const saveBtn = root.querySelector('#g-save-new-model');
      const errDiv = root.querySelector('#g-add-error');

      saveBtn.onclick = async () => {
          const name = root.querySelector('#g-model-name').value.trim();
          const code = root.querySelector('#g-model-code').value.trim();
          if (!name || code.length < 5) {
              errDiv.innerText = "Dati mancanti o codice invalido."; err.style.display = "block"; return;
          }
          const error = await saveCustomModel(name, code);
          if (error) { errDiv.innerText = error; errDiv.style.display = "block"; } 
          else { renderSetupUI(); }
      };
  }

  async function renderHistoryUI() {
      const { history = [] } = await chrome.storage.local.get('history');
      root.innerHTML = `
        <div class="gemini-panel">
          <div class="g-header">
            <span class="g-title">Cronologia</span>
            <span class="g-close">✕</span>
          </div>
          <div id="model-list-container">
            ${history.length === 0 ? '<div style="color: #94a3b8; font-size: 13px; text-align:center; padding:20px;">Nessuna attività.</div>' : ''}
            ${history.map(entry => `
              <div class="history-entry">
                <div class="history-meta"><span>${entry.model} (${entry.type})</span><span>${entry.timestamp.split(',')[0]}</span></div>
                <div class="history-prompt">${entry.prompt}</div>
              </div>
            `).join('')}
          </div>
          <div style="display:flex; justify-content:space-between; margin-top:15px; align-items:center;">
              <span id="g-back-setup" style="color:#60a5fa; cursor:pointer; font-size:13px;">← Indietro</span>
              <span id="g-clear-history" style="color:#f87173; cursor:pointer; font-size:13px;">Cancella Tutto</span>
          </div>
        </div>
      `;
      bindClose();
      root.querySelector('#g-back-setup').onclick = renderSetupUI;
      root.querySelector('#g-clear-history').onclick = () => {
          if (confirm("Cancellare la cronologia?")) chrome.storage.local.remove('history', renderHistoryUI);
      };
  }

  function renderChatUI(modelId) {
    const modelName = modelId.replace("gemini-", "").replace("-preview", "").toUpperCase();
    root.innerHTML = `
      <div class="gemini-panel" id="g-panel">
        <div class="g-header" id="g-header">
          <div><span class="g-title">Gemini Visual</span><span class="g-badge">AI</span>
             <span style="font-size:10px; opacity:0.5; margin-left:8px; border-left:1px solid rgba(255,255,255,0.2); padding-left:8px;">${modelName}</span>
          </div>
          <span class="g-close">✕</span>
        </div>
        <textarea id="g-input" placeholder="Chiedi qualcosa..."></textarea>
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <label style="font-size:12px; display:flex; align-items:center; gap:6px; cursor:pointer; color:#cbd5e1; opacity:0.9;">
            <input type="checkbox" id="g-screenshot"> Analisi Visiva
          </label>
          <div style="display:flex; gap:8px; width:60%;">
             <button id="g-copy-btn" class="g-btn g-btn-outline" style="display:none; width:40%;">Copia</button>
             <button id="g-btn" class="g-btn" style="width:100%;">Genera</button>
          </div>
        </div>
        <div id="g-response"></div>
      </div>
    `;
    bindClose();
    setupLogic(modelId);
  }

  function setupLogic(modelId) {
    const btn = root.querySelector('#g-btn');
    const input = root.querySelector('#g-input');
    const responseDiv = root.querySelector('#g-response');
    const screenshotCheck = root.querySelector('#g-screenshot');
    const copyBtn = root.querySelector('#g-copy-btn');
    const header = root.querySelector('#g-header');
    const panel = root.querySelector('#g-panel');
    let lastText = "";

    // Drag
    let isDrag = false, startX, startY, initX, initY;
    header.onmousedown = (e) => {
      isDrag = true; startX = e.clientX; startY = e.clientY;
      const rect = panel.getBoundingClientRect();
      initX = rect.left; initY = rect.top;
      panel.style.transform = 'none'; 
      document.onmouseup = () => { isDrag = false; document.onmouseup = null; document.onmousemove = null; };
      document.onmousemove = (ev) => {
        if(!isDrag) return;
        panel.style.left = (initX + (ev.clientX - startX)) + 'px';
        panel.style.top = (initY + (ev.clientY - startY)) + 'px';
      };
    };

    btn.onclick = () => {
      const q = input.value;
      if(!q) return;
      btn.disabled = true; btn.innerText = "Analisi...";
      copyBtn.style.display = 'none';
      responseDiv.style.display = 'block';
      responseDiv.innerHTML = "<i style='opacity:0.6'>Elaborazione...</i>";

      const useScreen = screenshotCheck.checked;
      let context = "";
      if(!useScreen) {
        const clone = document.body.cloneNode(true);
        const myUI = clone.querySelector('#gemini-visual-root');
        if(myUI) myUI.remove();
        ['script','style','svg','img','video'].forEach(t => clone.querySelectorAll(t).forEach(e => e.remove()));
        context = clone.innerText.replace(/\s+/g,' ').substring(0,30000);
      }

      chrome.runtime.sendMessage({
        action: "callGemini", model: modelId, type: useScreen ? "image" : "text", context: context, prompt: q
      }, (res) => {
        btn.disabled = false; btn.innerText = "Genera";
        if(res && res.success) {
          lastText = res.answer;
          copyBtn.style.display = 'block';
          responseDiv.innerHTML = res.answer.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>');
          saveHistoryEntry({ modelId, type: useScreen ? 'Vision' : 'Text', prompt: q, answer: res.answer });
        } else {
          if (res.error && res.error.includes("API Key")) {
              alert("Errore Chiave: " + res.error);
              chrome.storage.local.remove(['userApiKey'], renderApiKeyUI);
          } else {
              responseDiv.innerHTML = `<span style="color:#f87171">Errore: ${res.error}</span>`;
          }
        }
      });
    };

    copyBtn.onclick = () => {
      if(!lastText) return;
      navigator.clipboard.writeText(lastText).then(() => {
          copyBtn.innerText = "Fatto!";
          setTimeout(() => copyBtn.innerText = "Copia", 1500);
      });
    };
  }
})();