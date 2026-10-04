# Responsabili e sub-responsabili del trattamento — [NOME APP]

> Stato: BOZZA v0.1 — 04/10/2026 — da rivedere a cura del titolare (Mirco Cervi, DPO di professione) prima del go-live.
> Le verifiche documentali sono state fatte il 04/10/2026 sulle pagine pubbliche dei fornitori (vedi `sources.md`). Le condizioni contrattuali cambiano spesso: ogni riga va ri-verificata alla firma e poi almeno ogni 6 mesi.

## 1. Quadro dei ruoli

| Soggetto | Ruolo GDPR | Note |
|---|---|---|
| Mirco Cervi (persona fisica, Italia) | Titolare (art. 4(7)) | ⚠️ DA VERIFICARE: se l'attività passa a una società, vanno aggiornati: tutti i documenti pubblici, il RoPA, la DPIA, i DPA con i fornitori (cessione/novazione), gli account dei fornitori, l'email di contatto. |
| Vercel Inc. | Responsabile (art. 28) | Hosting Next.js, funzioni server. |
| Supabase Inc. | Responsabile (art. 28) | Database Postgres, autenticazione genitore. |
| OpenRouter Inc. | Responsabile (art. 28) | Gateway verso i modelli LLM. |
| Mistral AI SAS | Sub-responsabile (di OpenRouter) oppure responsabile diretto, se si passa all'API Mistral senza gateway | Inferenza LLM, trascrizione vocale (Voxtral), moderazione. |
| Fornitore email transazionale (magic link) | Responsabile (art. 28) | ⚠️ DA VERIFICARE / DA DECIDERE: non ancora scelto. Il server SMTP predefinito di Supabase non è adatto alla produzione. Va scelto un fornitore UE o con DPA + SCC. |
| Google LLC / Google Ireland, Apple Inc. / Apple Distribution International | **Titolari autonomi** del login social del genitore | Non sono responsabili: il genitore usa il proprio account Google/Apple. Riceviamo solo gli identificativi minimi (email, ID dell'account). Va citato nell'informativa. |
| Browser/sistema operativo del dispositivo | Nessuno (trattamento locale) | Sintesi vocale `speechSynthesis` sul dispositivo. Vedi la nota tecnica al §4. |

## 2. Tabella dei sub-responsabili

| # | Fornitore | Funzione | Dati trattati | Sede / località del trattamento | Meccanismo di trasferimento | DPA | ZDR / conservazione | Stato verifica |
|---|---|---|---|---|---|---|---|---|
| 1 | **Vercel Inc.** (USA) | Hosting app, funzioni server (pinnate su `fra1` Francoforte), CDN | Richieste HTTP, indirizzi IP, log tecnici. Transito di tutti i dati applicativi (cifrati in transito) | Funzioni in `fra1` (UE). La CDN edge è globale. Nel DPA Vercel dichiara che le sue *"primary processing facilities are in the United States"* | **Certificata EU-U.S. DPF** (anche estensione UK e Swiss-U.S.) + SCC 2021 (moduli 1-2-3) + UK Addendum nel DPA | https://vercel.com/legal/dpa (agg. 17/03/2026) — sub-responsabili: https://security.vercel.com | Log di runtime: conservazione secondo il piano. ⚠️ DA VERIFICARE: durata dei log del piano scelto. Disattivare log applicativi che contengano il testo delle chat | ⚠️ DA VERIFICARE: certificazione DPF attiva sul registro ufficiale https://www.dataprivacyframework.gov/list alla data di firma |
| 2 | **Supabase Inc.** (USA) | Postgres (profili, chat, alert, statistiche), Auth del genitore (magic link, OAuth) | Tutti i dati applicativi a riposo | Progetto in **AWS eu-central-1 (Francoforte)**. Attenzione: backup, log, supporto ed Edge Functions possono avere località diverse (lo ammette la stessa documentazione Supabase) | SCC 2021 modulo 2 (C→P) e modulo 3, integrate nel DPA. **Iscrizione DPF non trovata** nelle fonti consultate | https://supabase.com/legal/customer-resources/data-processing-addendum (v. 01/08/2026) — sub-responsabili: https://supabase.com/legal/customer-resources/subprocessor-list | Notifica breach "entro 48h ove possibile". Cancellazione 30 gg dopo la cessazione | ⚠️ DA VERIFICARE: status DPF; TIA (Transfer Impact Assessment) per l'accesso remoto dagli USA (supporto, operazioni); località dei backup e dei log |
| 3 | **OpenRouter Inc.** (USA, legge di New York) | Gateway/instradamento delle richieste LLM verso Mistral | Prompt (testo del bambino, istruzioni di sistema), risposte, metadati della richiesta (token, orari, costi) | Endpoint globale: elaborazione anche negli USA. **Endpoint UE `https://eu.openrouter.ai/api/v1`**: payload decifrati ed elaborati solo in UE/SEE (Exhibit A del DPA). Disponibile sui piani **Business ed Enterprise** | SCC modulo 2 + UK Addendum + adattamenti svizzeri (DPA). **Iscrizione DPF non trovata.** Con l'endpoint UE niente trasferimento dei payload; restano negli USA i dati dell'account e i metadati di fatturazione | https://openrouter.ai/data-processing-agreement (agg. 26/08/2026) — sub-responsabili: https://trust.openrouter.ai (Cloudflare, ClickHouse, Clerk, Customer.io, Coinbase) | OpenRouter non conserva i prompt se non si attiva il logging (opt-in). Con `zdr: true` instrada solo verso endpoint ZDR. La cache in memoria non è considerata "conservazione". SOC 2 Type 2 dichiarato | ⚠️ DA VERIFICARE (BLOCCANTE): (a) i ToS richiedono "18+ to use the Service": riguarda il titolare dell'account, ma va confermato per iscritto che è ammesso un servizio per minori; (b) clausola "Sensitive Data" (DPA §1.15 e §2.6): include dati sanitari e "sensitive data" secondo la legge applicabile. Le chat possono contenere confidenze su salute o abusi, quindi serve un addendum; (c) attivare il piano Business per l'endpoint UE |
| 4 | **Mistral AI SAS** (Francia) | Modelli open-weight (Mistral Small 4 `mistral-small-2603`, Ministral 3 `ministral-*-2512`), trascrizione vocale Voxtral, moderazione dei contenuti | Prompt, risposte, **audio vocale del bambino** (solo per la trascrizione) | UE ("hosted in the EU by default"). Esiste però anche un endpoint `mistral/us` per alcuni modelli: va escluso | Nessun trasferimento extra-SEE se si usano solo gli endpoint UE | https://legal.mistral.ai/terms/data-processing-addendum | Default API: conservazione di 30 gg per il monitoraggio degli abusi. **ZDR solo su richiesta approvata da Mistral** (piani a pagamento). Copre chat completions, moderazione, classificazione, trascrizione. Via OpenRouter compaiono endpoint Mistral nell'elenco ZDR (`mistral/eu`, `mistral/zdr`) | ⚠️ DA VERIFICARE (**BLOCCANTE**): i Commercial Terms Mistral (in vigore dal 25/09/2026), §2.2(c), vietano di *"include any personal information of children under 13 or the applicable age of digital consent as Customer Data"*. È in conflitto diretto con il prodotto. Serve una deroga/addendum scritto di Mistral, valido anche quando l'accesso passa da OpenRouter |
| 5 | Fornitore email (da scegliere) | Invio dei magic link e delle notifiche di sicurezza al genitore | Email del genitore, contenuto della notifica (senza il testo della chat) | ⚠️ DA DECIDERE (preferibile UE) | ⚠️ | ⚠️ | Log di invio di solito 30 gg | ⚠️ DA DECIDERE |
| 6 | Amazon Web Services (sub-sub-responsabile di Supabase e, probabilmente, di Vercel) | Infrastruttura | Come sopra | eu-central-1 | DPF + SCC (AWS) | Tramite i DPA di Supabase e Vercel | — | Informativo |

## 3. Configurazione obbligatoria del gateway LLM (vincolo di progetto)

Se si resta su OpenRouter, ogni chiamata **deve** avere la configurazione qui sotto. Va verificata con test automatici in CI e con il log degli header di risposta (provider effettivo):

```jsonc
// base URL: https://eu.openrouter.ai/api/v1   (richiede il piano Business/Enterprise)
{
  "model": "mistralai/mistral-small-2603",          // o ministral-8b/14b-2512
  "provider": {
    "only": ["mistral"],          // ⚠️ DA VERIFICARE: se si può restringere al tag "mistral/eu" o "mistral/zdr"
    "allow_fallbacks": false,     // nessun fallback verso altri provider (DeepInfra, Parasail... sono USA)
    "zdr": true,
    "data_collection": "deny"
  }
  // NON inviare il campo "user" né identificativi del bambino o del genitore
}
```

Inoltre: impostazioni dell'account OpenRouter → "ZDR obbligatoria" a livello di organizzazione, prompt logging **disattivato**, chiavi API separate per prod e dev.

Il 04/10/2026, interrogando l'API pubblica `GET /api/v1/endpoints/zdr` di OpenRouter, l'elenco ZDR comprendeva per Mistral Small 4 sia gli endpoint `mistral/eu` e `mistral/zdr` sia **`mistral/us`**. Senza l'endpoint UE o un filtro sul tag, una richiesta ZDR "solo Mistral" potrebbe quindi essere servita negli USA. ⚠️ DA VERIFICARE con un test.

## 4. Nota tecnica sul trattamento sul dispositivo (TTS)

`window.speechSynthesis` usa voci **locali** e voci **di rete**. In Chrome desktop, per esempio, le voci "Google …" sono remote: il testo da leggere viene inviato a Google. Requisito di progetto: **usare solo voci con `SpeechSynthesisVoice.localService === true`**. Se non ce ne sono, si disattiva la lettura ad alta voce e non si fa fallback su voci di rete. Lo stesso principio vale per `SpeechRecognition` (Web Speech API), già escluso. ⚠️ DA VERIFICARE con test su Chrome, Edge, Safari (iOS/macOS), Firefox e Android.

## 5. Alternative architetturali da valutare

| Opzione | Pro | Contro |
|---|---|---|
| **A. API Mistral diretta** (senza OpenRouter) | Un responsabile UE in meno nella catena, nessun trasferimento USA dei payload, ZDR contrattualizzata direttamente, un solo DPA da negoziare (anche per la clausola minori) | Si perde il multi-provider (non serve, visto che si usa solo Mistral). Moderazione e trascrizione sono comunque già su Mistral |
| B. OpenRouter con endpoint UE (piano Business) | Flessibilità sul modello | Due DPA, due clausole restrittive (OpenRouter "Sensitive Data" e Mistral "children"), dati dell'account negli USA, costo del piano |
| C. Vercel AI Gateway (ZDR) | Già fornitore (Vercel), certificato DPF | Altro intermediario USA; località dell'inferenza da verificare |
| D. Self-hosting di modelli open-weight in UE (es. GPU su un cloud UE) | Massimo controllo | Costi e oneri operativi e di sicurezza a carico del titolare |

**Raccomandazione preliminare (⚠️ DA DECIDERE):** opzione A. Il gateway non porta benefici funzionali, visto che si usa un solo provider, e aggiunge un responsabile USA, un trasferimento e un contratto con clausole in conflitto.

## 6. Procedura di gestione dei sub-responsabili

1. Prima di aggiungere un fornitore: verifica di DPA, località, trasferimenti, certificazioni, condizioni sui minori; aggiornamento di questa tabella, del RoPA e della pagina pubblica Trust Center.
2. Iscriversi alle notifiche di modifica dei sub-responsabili (Vercel: preavviso 5 gg; OpenRouter: 30 gg; Supabase: notifica via sottoscrizione).
3. Revisione semestrale e dopo ogni modifica dei termini dei fornitori.
4. Per i trasferimenti USA basati solo su SCC (Supabase, OpenRouter): TIA documentata. ⚠️ DA VERIFICARE.
