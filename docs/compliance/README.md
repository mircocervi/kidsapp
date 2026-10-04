# Documentazione di compliance — [NOME APP]

> Stato: BOZZA v0.1 — 04/10/2026 — redatta in fase di progettazione (privacy & safety by design). **Nessun documento è definitivo** finché il titolare (Mirco Cervi) non lo rivede e risolve tutti i punti marcati **⚠️ DA VERIFICARE / DA DECIDERE**.
> Ricerca normativa aggiornata al 04/10/2026 (AI Omnibus in vigore dal 27/07/2026; COPPA modificata applicabile dal 22/04/2026; L. 132/2025 in vigore dal 10/10/2025). Fonti in `sources.md`.

## 1. Indice

| File | Contenuto | Lingua |
|---|---|---|
| `README.md` | Indice, sintesi, mappa del Children's Code, checklist go-live | IT |
| `ropa.md` | Registro dei trattamenti (art. 30) | IT |
| `dpia.md` | Valutazione d'impatto (art. 35) | IT |
| `ai-act.md` | Classificazione e obblighi AI Act | IT |
| `subprocessors.md` | Fornitori, località, trasferimenti, ZDR, configurazione del gateway | IT |
| `safety-policy.md` | Policy di sicurezza del chatbot, protocollo per le rivelazioni, helpline, red-teaming | IT |
| `data-retention.md` | Conservazione, cancellazione, diritti degli interessati | IT |
| `coppa.md` | Prontezza USA (COPPA 2025, leggi statali) | IT |
| `incident-response.md` | Data breach (72h) e incidenti IA | IT |
| `public/privacy-policy.{en,it}.md` | Informativa per i genitori | EN / IT |
| `public/children-notice.{en,it}.md` | Informativa per i bambini (6-10 anni) | EN / IT |
| `public/trust-center.{en,it}.md` | Pagina pubblica "Trust & Safety" | EN / IT |
| `sources.md` | Fonti consultate | IT |

## 2. Sintesi di compliance

| Area | Esito | Note principali |
|---|---|---|
| **GDPR / Codice privacy** | Fattibile, con DPIA obbligatoria | Tutti gli utenti sono sotto la soglia del consenso digitale in **ogni** Stato UE (13-16 anni), in UK (13) e in pratica in CH: serve **sempre** il consenso del genitore. L'architettura "solo account del genitore" va nella direzione giusta. Punto aperto: base art. 9 per le confidenze spontanee. |
| **L. 132/2025 art. 4 c. 4** | Conforme per costruzione | Accesso all'IA dei minori di 14 anni solo con il consenso del genitore: va reso esplicito e separato nell'onboarding ("attiva l'assistente IA per [nickname]"). |
| **AI Act** | Rischio **limitato** (art. 50) | Non vietato (vincoli contro l'art. 5(1)(b)). **Non** alto rischio Annex III(3) se restano veri i vincoli V1-V6 (livelli = suggerimenti, niente voti, niente scuole come clienti senza una nuova valutazione). L'art. 50(2) (marcatura dell'output) si applica **da subito**, senza la proroga di dicembre. Mirco = **fornitore** del sistema di IA (+ deployer). |
| **UK GDPR + Children's Code** | Fattibile | Mappa dei 15 standard al §3. Rappresentante UK da valutare. Online Safety Act probabilmente fuori ambito (niente user-to-user, niente ricerca web). |
| **Svizzera (nLPD)** | Fattibile | Rappresentante CH da valutare (art. 14 nLPD). |
| **COPPA (USA)** | **Non pronto**: lancio USA bloccato | Serve un metodo VPC forte, un WISP, informative USA, verifica di SB 243. Vedi `coppa.md`. |
| **Fornitori** | **🔴 Bloccante** | **Mistral Commercial Terms §2.2(c)** vieta i dati personali di minori di 13 anni come Customer Data. **OpenRouter**: ToS 18+ e clausola "Sensitive Data". Endpoint `mistral/us` presente nell'elenco ZDR. Vedi §4. |

## 3. Mappa ICO Children's Code (15 standard)

| # | Standard | Implementazione | Doc |
|---|---|---|---|
| 1 | Best interests of the child | Principio n. 1 della safety policy; DPIA §5-bis | safety-policy, dpia |
| 2 | DPIA | Svolta (bozza) | dpia |
| 3 | Age-appropriate application | Fasce F1-F5, impostazione dal genitore | safety-policy §2 |
| 4 | Transparency | Informativa per i bambini + messaggi "just-in-time" della mascotte | public/children-notice |
| 5 | Detrimental use of data | Niente dark pattern, niente engagement manipolativo | ai-act §3.1, safety-policy §7 |
| 6 | Policies and community standards | Safety policy pubblicata (sintesi nel Trust Center) | safety-policy |
| 7 | Default settings | Privacy massima di default: niente statistiche oltre lo stretto necessario, voce solo push-to-talk | ropa |
| 8 | Data minimisation | Nessun dato anagrafico; audio non conservato | ropa, dpia |
| 9 | Data sharing | Solo responsabili; nessuna condivisione | subprocessors |
| 10 | Geolocation | Nessuna geolocalizzazione (solo il paese dichiarato dal genitore) | ropa |
| 11 | Parental controls | Il genitore vede tutto. **Indicatore visibile al bambino** che il genitore può leggere + spiegazione nell'informativa per i bambini | children-notice |
| 12 | Profiling | Off di default; livelli = suggerimenti deterministici, non profilazione per finalità di terzi | ai-act §3.2 |
| 13 | Nudge techniques | Niente streak o push al bambino, nessun upsell al bambino | safety-policy §7 |
| 14 | Connected toys and devices | Non applicabile (⚠️ rivalutare se si fanno integrazioni hardware) | — |
| 15 | Online tools | Self-service nell'area genitore per accesso, export, cancellazione | data-retention |

## 4. Principali punti aperti e rischi (in ordine di priorità)

1. 🔴 **Mistral, divieto contrattuale sui dati dei minori** (Commercial Terms §2.2(c), dal 25/09/2026). Senza una deroga scritta il servizio viola i termini del fornitore principale, anche via OpenRouter. → Negoziare un addendum (Mistral è UE e ha prodotti education/enterprise) **oppure** cambiare fornitore o modello self-hosted.
2. 🔴 **OpenRouter**: società USA, **non trovata nel DPF** (solo SCC). ToS "18+", DPA che esclude i "Sensitive Data" (dati sanitari e "sensitive data" secondo la legge applicabile) salvo accordo. L'endpoint UE richiede il piano Business. → **Raccomandazione: API Mistral diretta** (un fornitore UE, nessun trasferimento, un solo contratto da negoziare). Se si resta su OpenRouter: endpoint UE + addendum + TIA.
3. 🟠 **Instradamento**: nell'elenco ZDR pubblico di OpenRouter Mistral Small 4 ha anche l'endpoint `mistral/us`. `zdr: true` + `only: ["mistral"]` **non garantisce** la località UE. Servono l'endpoint UE o un filtro sul tag, con test in CI.
4. 🟠 **ZDR Mistral**: non è self-service. Richiede una domanda motivata e l'approvazione di Mistral (paid plan). Senza ZDR vale la conservazione di 30 gg per abuse monitoring.
5. 🟠 **Supabase**: DPF non trovato, solo SCC: serve una TIA. Verificare la località di backup e log.
6. 🟠 **Verifica del genitore** (art. 8(2) GDPR "sforzi ragionevoli"): oggi email + autodichiarazione. Accettabile in UE in proporzione al rischio (EDPB Statement 1/2025), ma il Garante ha sanzionato Replika e Character.AI per carenze nella verifica dell'età. Qui però il rischio è opposto (un adulto deve dimostrare di essere adulto/genitore). Per gli USA serve VPC forte. → Decidere se adottare subito un metodo più forte e uniforme.
7. 🟠 **Art. 9**: confidenze su salute/abusi nelle chat → base giuridica (consenso esplicito del genitore) e notifica al genitore nei casi di abuso intrafamiliare (DPIA R7).
8. 🟠 **Art. 50(2) AI Act**: marcatura machine-readable dell'output testuale, da implementare prima del lancio (nessuna proroga per i sistemi nuovi).
9. 🟡 **Titolare persona fisica**: responsabilità personale illimitata, reperibilità 72h, DPO (non può nominarsi da solo), rappresentanti UK/CH. → Valutare una società prima del go-live; aggiornare tutti i documenti.
10. 🟡 **TTS `speechSynthesis`**: in Chrome alcune voci sono di rete (testo inviato a Google). → Solo voci con `localService === true`.
11. 🟡 **Fornitore email** per i magic link: da scegliere (preferibilmente UE).
12. 🟡 **Fascia 12-13 anni**: il brief dice "fino a ~13", il prodotto "fino alla 5ª primaria". Decidere: incide su safety policy, privacy del bambino verso il genitore e (USA) COPPA.

## 5. Checklist go-live (tutto deve essere ✅ prima che un bambino reale usi il servizio)

### Contratti e fornitori
- [ ] Deroga/addendum scritto di **Mistral** sui dati dei minori (o cambio fornitore)
- [ ] Decisione **OpenRouter vs API Mistral diretta**. Se OpenRouter: piano Business, endpoint UE, addendum minori/Sensitive Data, TIA
- [ ] **ZDR Mistral approvata** per iscritto (chat, moderazione, trascrizione)
- [ ] DPA accettati e archiviati: Vercel, Supabase, OpenRouter (se usato), Mistral, fornitore email
- [ ] Stato DPF verificato sul registro ufficiale per i fornitori USA; TIA per i fornitori solo-SCC
- [ ] Iscrizione alle notifiche di modifica dei sub-responsabili

### Configurazione tecnica
- [ ] Vercel: funzioni pinnate su `fra1`; nessun log con il contenuto delle chat; Vercel Analytics/Speed Insights **disattivati** (o valutati)
- [ ] Supabase: progetto in `eu-central-1`; RLS su tutte le tabelle con test di isolamento; backup/PITR documentati
- [ ] Gateway LLM: `zdr`, `data_collection: deny`, nessun fallback, nessun campo `user`, provider/regione verificati da un test automatico
- [ ] Moderazione dell'input e dell'output attiva per tutte le lingue supportate
- [ ] Nessuna Web Speech Recognition; TTS solo con voci locali; audio mai salvato (verificato)
- [ ] Job di retention a 90 gg attivo, testato, con allarme
- [ ] Cancellazione di conversazione, profilo e account funzionante; export JSON
- [ ] PIN dell'area genitore con hash e lockout; MFA su tutti gli account dei fornitori
- [ ] Marcatura dell'output IA (art. 50(2)) + etichetta "IA" visibile + messaggio di benvenuto della mascotte (art. 50(1))
- [ ] Analisi delle richieste di rete: nessuna chiamata a terze parti (font, CDN, analytics)
- [ ] Kill switch del chatbot (feature flag) testato
- [ ] `security.txt` + indirizzo per la sicurezza
- [ ] Utenti USA esclusi (geo/autodichiarazione) fino al completamento di `coppa.md`

### Sicurezza dei minori
- [ ] Red-teaming completo (safety-policy §8) superato, report archiviato; nessun fallimento critico RT1-RT3, RT5
- [ ] Helpline di ogni paese di lancio verificate alla fonte, data di verifica registrata
- [ ] Protocollo per le rivelazioni rivisto da un esperto di tutela dell'infanzia
- [ ] Decisioni su R7 (abuso intrafamiliare) e sulla revisione umana dei casi urgenti
- [ ] Procedura di segnalazione CSAM/grooming alle autorità definita

### Documentazione e trasparenza
- [ ] Tutte le ⚠️ risolte in questi documenti
- [ ] DPIA firmata (ed eventuale consultazione preventiva ex art. 36, se R15 resta aperto)
- [ ] RoPA completo, compresi i dati del titolare (eventuale società)
- [ ] Informative per genitori e bambini pubblicate (IT + EN + lingue di lancio), testate per comprensibilità
- [ ] Trust Center pubblicato: **ogni affermazione verificata come vera**
- [ ] Flusso di consenso: consenso del genitore + consenso separato all'assistente IA (L. 132/2025) + consenso esplicito art. 9; registro dei consensi
- [ ] Termini di servizio (separati da questa cartella, ⚠️ DA REDIGERE): genitore maggiorenne, responsabilità genitoriale, genitori separati, limitazioni
- [ ] Rappresentante UK / CH: deciso e nominato, se dovuto
- [ ] DPO: valutata l'obbligatorietà ed eventualmente nominato (non il titolare stesso)
- [ ] Registro della formazione sull'alfabetizzazione IA (art. 4)
- [ ] Procedura per gli incidenti con contatti e sostituto

## 6. Quando aggiornare questi documenti
Nuovo fornitore o modello · nuova lingua o mercato · ingresso delle scuole come clienti · introduzione di pagamenti (nuovo trattamento + fornitore) · passaggio a una società · nuove linee guida (Commissione su art. 6/50, EDPB, Garante, ICO) · ogni 12 mesi.
