# 💎 Gemini Visual - GitHub Edition

**Gemini Visual** è un'estensione per **Google Chrome** che integra la potenza dei modelli **Google Gemini (2.5 e 3.0)** direttamente nel tuo browser.

Permette di analizzare il contenuto delle pagine web, effettuare analisi visive tramite **screenshot automatici** e gestire cronologia e modelli personalizzati, tutto tramite un'interfaccia moderna e fluttuante.

---

## ✨ Funzionalità Principali

* **🧠 Analisi Multimodale:** Chatta con l'AI riguardo al testo della pagina o attiva l'**Analisi Visiva** per inviare automaticamente uno screenshot della scheda corrente.
* **🚀 Supporto Ultimi Modelli:** Include pre-configurazioni per **Gemini 3 Pro (Preview)**, **Gemini 2.5 Pro, Flash** e **Flash-Lite**.
* **🛠️ Modelli Personalizzati:** Se hai accesso a un nuovo modello sperimentale, puoi aggiungere manualmente il suo ID (es. `gemini-2.0-ultra-exp`) direttamente dalla UI.
* **🎨 Interfaccia Moderna:** Pannello "**Glassmorphism**" trascinabile, con supporto per Markdown (**grassetto, a capo**) e copia rapida delle risposte.
* **🔒 Privacy-First:**
    * La tua **API Key** viene salvata solo in locale (`chrome.storage.local`).
    * Nessun server intermediario: le chiamate partono direttamente dal tuo browser verso le **API di Google**.
* **📜 Cronologia Locale:** Salva automaticamente le ultime conversazioni per una rapida consultazione.

---

## 📦 Installazione

Poiché questa è un'estensione "**unpacked**" (non ancora sul Chrome Web Store), segui questi passaggi:

1.  **Scarica** i file del progetto in una cartella sul tuo computer.
2.  Apri **Google Chrome** e vai all'indirizzo `chrome://extensions/`.
3.  Attiva la "**Modalità sviluppatore**" (interruttore in alto a destra).
4.  Clicca su "**Carica estensione non pacchettizzata**" (*Load unpacked*).
5.  Seleziona la cartella dove hai salvato i file (`manifest.json`, `background.js`, ecc.).

---

## ⚙️ Configurazione

1.  Ottieni la tua **API Key gratuita** da [Google AI Studio](https://ai.google.dev/).
2.  Apri l'estensione (vedi sezione "Utilizzo").
3.  Al primo avvio, ti verrà chiesto di inserire la chiave (deve iniziare con `AIza...`).
4.  La chiave verrà salvata in modo sicuro nel browser.

---

## 🚀 Utilizzo

Ci sono due modi per aprire il pannello di Gemini Visual:

* Clicca sull'**icona dell'estensione** nella barra degli strumenti di Chrome.
* Usa la **scorciatoia da tastiera**:
    * **Windows/Linux:** `Ctrl + Shift + G`
    * **Mac:** `Command + Shift + G`

### Analisi Visiva

Per chiedere all'AI cosa sta succedendo sullo schermo:

1.  Apri il pannello.
2.  Spunta la casella **☑ Analisi Visiva** (o "Screenshot").
3.  Scrivi il tuo prompt (es: "Spiega questo grafico" o "Dammi il codice CSS di questo elemento").

> **Risultato:** Gemini riceverà uno **screenshot ad alta qualità** della scheda attiva.

---

## 📂 Struttura del Progetto

| File | Funzione / Permessi |
| :--- | :--- |
| `manifest.json` | Configurazione dell'estensione (**Permessi:** `activeTab`, `scripting`, `storage`). |
| `background.js` | Service worker che gestisce le chiamate API sicure verso Google e la gestione della clipboard/screenshot. |
| `gemini-ui.js` | Contiene tutta la logica dell'interfaccia utente, stili CSS (iniettati dinamicamente) e gestione del DOM. |

---

## 🛡️ Privacy e Sicurezza

* **Dati:** Nessun dato viene inviato allo sviluppatore o a terze parti. Le richieste vanno direttamente ed esclusivamente ai server di **Google Generative AI**.
* **Permessi:** L'estensione ha accesso alla pagina web solo quando viene attivata volontariamente dall'utente (permesso `activeTab`).
* **API Key:** La chiave risiede esclusivamente nel **localStorage** del tuo browser.

***

*Versione 7.0 - Gemini Visual GitHub Edition*
