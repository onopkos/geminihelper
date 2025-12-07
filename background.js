// --- GESTORE MESSAGGI ---
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  
  // 1. Salva la API Key dell'utente
  if (request.action === "saveApiKey") {
    chrome.storage.local.set({ userApiKey: request.key }, () => {
      sendResponse({ success: true });
    });
    return true;
  }

  // 2. Chiamata a Gemini
  if (request.action === "callGemini") {
    handleGeminiRequest(request, sendResponse);
    return true; 
  }
});

// --- GEMINI API ---
async function handleGeminiRequest(request, sendResponse) {
  const storage = await chrome.storage.local.get(['userApiKey']);
  const apiKey = storage.userApiKey;

  if (!apiKey) {
    sendResponse({ success: false, error: "API Key mancante. Configurala nel menu principale." });
    return;
  }

  // Usa il modello passato dalla UI (standard o personalizzato)
  const model = request.model || "gemini-1.5-pro";
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  
  let parts = [];
  
  // Costruzione Prompt
  if (request.type === "text") {
    parts = [{ text: `Analizza il seguente contenuto web:\n\nCONTESTO:\n${request.context}\n\nRICHIESTA UTENTE:\n${request.prompt}` }];
  } else if (request.type === "image") {
    try {
      const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
      // Alta qualità per l'analisi visiva
      const dataUrl = await chrome.tabs.captureVisibleTab(tab.windowId, {format: "jpeg", quality: 95});
      const base64Image = dataUrl.split(",")[1];
      parts = [{ text: request.prompt }, { inlineData: { mimeType: "image/jpeg", data: base64Image } }];
    } catch (e) {
      sendResponse({ success: false, error: "Errore Screenshot: " + e.message });
      return;
    }
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: parts }] })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
       // Gestione errori specifici
       if(data.error && data.error.status === "INVALID_ARGUMENT") {
         throw new Error(`API Key non valida o Modello "${model}" inesistente.`);
       }
       if(data.error && data.error.status === "NOT_FOUND") {
         throw new Error(`Il modello "${model}" non esiste o non è accessibile con questa chiave.`);
       }
       throw new Error(data.error?.message || "Errore di connessione API");
    }
    
    if (!data.candidates || !data.candidates[0].content) {
        throw new Error("Nessuna risposta generata. (Possibile blocco sicurezza)");
    }

    sendResponse({ success: true, answer: data.candidates[0].content.parts[0].text });

  } catch (error) {
    sendResponse({ success: false, error: error.message });
  }
}

// --- INIEZIONE UI ---
async function injectScripts(tab) {
  if (!tab?.id) return;
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['gemini-ui.js']
  });
}

chrome.action.onClicked.addListener(injectScripts);
chrome.commands.onCommand.addListener(async (cmd) => {
  if (cmd === "toggle-gemini-ui") {
    const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    injectScripts(tab);
  }
});