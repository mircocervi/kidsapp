# Valutazione AI Act (Reg. UE 2024/1689, come modificato dal Reg. UE 2026/1744 "AI Omnibus") — [NOME APP]

> Stato: BOZZA v0.1 — 04/10/2026. Base normativa verificata alla data: l'AI Omnibus (Reg. 2026/1744) è stato pubblicato in GUUE il 24/07/2026 ed è in vigore dal 27/07/2026. Le linee guida della Commissione sulla classificazione dei sistemi ad alto rischio (art. 6) erano ancora **in bozza** (pubblicate il 19/05/2026, consultazione chiusa il 23/06/2026). ⚠️ DA VERIFICARE: la versione finale al momento del go-live.

## 1. Calendario applicabile (stato al 04/10/2026)

| Obbligo | Applicabile dal | Note |
|---|---|---|
| Art. 5 (pratiche vietate) | 02/02/2025 | Non toccato dall'Omnibus |
| Art. 4 (alfabetizzazione IA) | 02/02/2025 | Riformulato dall'Omnibus: obbligo di "adottare misure per sostenere" l'alfabetizzazione, non più di "garantire un livello sufficiente". ⚠️ DA VERIFICARE nel testo consolidato |
| Obblighi per i modelli GPAI (artt. 53-55) | 02/08/2025 (poteri di enforcement dal 02/08/2026) | Ricadono su Mistral, non su [NOME APP] |
| Art. 50 (trasparenza) | 02/08/2026 | Proroga solo per l'art. 50(2) (marcatura leggibile da macchina) al **02/12/2026**, e solo per i sistemi immessi sul mercato **prima** del 02/08/2026. [NOME APP] sarà immessa dopo, quindi niente proroga: art. 50(2) applicabile da subito |
| Alto rischio Annex III (incl. istruzione) | **02/12/2027** (era 02/08/2026) | Rinviato dall'Omnibus |
| Alto rischio Annex I (prodotti) | 02/08/2028 | Non pertinente |

Normativa italiana collegata: **L. 23/09/2025 n. 132** (legge sull'IA), in vigore dal 10/10/2025. Art. 4, c. 4: l'accesso dei **minori di 14 anni** alle tecnologie di IA e il conseguente trattamento dei dati richiedono il consenso di chi esercita la responsabilità genitoriale. Il prodotto è compatibile per costruzione: account solo del genitore, consenso esplicito all'uso del chatbot.

## 2. Ruolo di Mirco Cervi (operatore)

| Ruolo AI Act | Applicabile? | Motivazione |
|---|---|---|
| **Fornitore (provider) di un sistema di IA** (art. 3(3)) | **Sì** | Sviluppa un sistema di IA (chatbot con prompt di sistema, moderazione, logica d'età, integrazione vocale) basato su un modello GPAI di terzi e lo immette sul mercato / mette in servizio con il proprio nome ([NOME APP]). È un "downstream provider" (art. 3(68)) |
| **Deployer** (art. 3(4)) | Sì, in via accessoria | Usa il sistema sotto la propria autorità per erogare il servizio. I genitori e i bambini **non** sono deployer: uso personale non professionale |
| Fornitore di modello GPAI | **No** | Non addestra né modifica in modo sostanziale il modello (solo prompting, nessun fine-tuning). ⚠️ DA VERIFICARE se in futuro si fa fine-tuning: le linee guida GPAI della Commissione (luglio 2025) fissano una soglia di compute per la "modifica sostanziale" |
| Importatore/distributore | No | |

Se l'attività passa a una società, il provider diventa la società: vanno aggiornati la dichiarazione di trasparenza e la documentazione. ⚠️

## 3. Classificazione del rischio

### 3.1 Non è una pratica vietata (art. 5)

| Divieto | Analisi | Vincoli di progetto per restarne fuori |
|---|---|---|
| 5(1)(a) tecniche subliminali, manipolative o ingannevoli che distorcono materialmente il comportamento causando danno significativo | Il sistema non persegue né produce questi effetti | Nessuna tecnica di engagement manipolativa; nessun messaggio che spinge a restare ("non andare via"); niente gamification della chat |
| **5(1)(b) sfruttamento delle vulnerabilità legate all'età** | È il divieto più rilevante: utenti di 3-13 anni. Le linee guida della Commissione sulle pratiche vietate (febbraio 2025) indicano i chatbot che simulano interazione umana come particolarmente rischiosi per i minori, per la dipendenza emotiva. **Non è richiesto l'intento: basta l'effetto** | (1) La mascotte dichiara di essere un programma; (2) nessuna relazione "affettiva" simulata, nessuna espressione di bisogno o gelosia; (3) nessuna sollecitazione commerciale (né freemium upsell rivolto al bambino: **gli inviti all'upgrade vanno solo nell'area genitore**); (4) limiti di tempo impostabili; (5) niente notifiche push al bambino; (6) red-teaming specifico su manipolazione e dipendenza |
| 5(1)(c) social scoring | Non applicabile | Nessun punteggio usato fuori contesto |
| 5(1)(f) riconoscimento delle emozioni **in istituti di istruzione** | Non applicabile se usato a casa. Il riconoscimento delle emozioni nell'AI Act si basa su **dati biometrici**: la classificazione del *testo* per temi di rischio non lo è | **Vietato inferire emozioni dalla voce** (tono, pianto, stress). La voce si usa solo per la trascrizione. Se il servizio entra nelle scuole, nessuna funzione di questo tipo |
| 5(1)(g) categorizzazione biometrica | Non applicabile | Nessun dato biometrico, nessuna identificazione del parlante |
| Altri (polizia predittiva, scraping facciale, identificazione biometrica remota, nudificazione/CSAM dal 02/12/2026) | Non applicabili | Moderazione dell'output per contenuti sessuali; nessuna generazione di immagini |

### 3.2 Non è un sistema ad alto rischio (art. 6 + Allegato III, punto 3)

L'Allegato III, punto 3 (istruzione e formazione professionale) elenca:
- (a) sistemi per determinare l'**accesso o l'ammissione** o per assegnare persone a istituti di istruzione;
- (b) sistemi per **valutare i risultati dell'apprendimento**, anche quando servono a orientare il processo di apprendimento delle persone **in istituti di istruzione e formazione professionale a tutti i livelli**;
- (c) sistemi per valutare il **livello di istruzione adeguato** che una persona riceverà o a cui potrà accedere, nel contesto/all'interno di istituti di istruzione;
- (d) sistemi per **monitorare e rilevare comportamenti vietati durante le prove**.

**Analisi.** Il punto 3 si riferisce a sistemi usati da o per istituti di istruzione, con effetti sul percorso educativo della persona (ammissione, voto, livello di istruzione, sorveglianza degli esami). [NOME APP] è un servizio consumer usato a casa per scelta del genitore. I livelli dei giochi e i progressi:
- non determinano l'accesso a un percorso di istruzione formale;
- non producono valutazioni che entrano nel percorso scolastico;
- non assegnano un livello di istruzione;
- servono a scegliere il gioco successivo.

Le bozze delle linee guida della Commissione (maggio 2026) portano un esempio utile: un correttore automatico di temi usato **solo per feedback formativo** durante un corso è **fuori** dall'Allegato III(3); lo stesso strumento usato per decisioni di ammissione o per voti pass/fail è dentro.

**Rischio di "scivolamento" nell'alto rischio.** I casi che cambierebbero la classificazione sono:
1. offerta a **scuole** che usano i progressi/livelli per valutare gli alunni o per assegnarli a gruppi o classi;
2. adattività che **decide automaticamente** il livello di istruzione del bambino o **blocca** contenuti in base a una valutazione;
3. report "ufficiali" o certificati di competenza.

**Vincoli di progetto (da riportare nei requisiti di prodotto e da verificare a ogni release):**

| # | Vincolo |
|---|---|
| V1 | I livelli e la "difficoltà adatta" sono **suggerimenti al genitore**, che può sempre cambiarli. Il bambino può giocare a ogni livello della propria fascia (e di quelle vicine, se il genitore lo consente) |
| V2 | Nessun voto, giudizio sintetico, certificato o "pagella". I progressi sono descrittivi (es. "ha completato 12 giochi di addizione") |
| V3 | Nessuna funzione di condivisione dei progressi con insegnanti o scuole, nessuna integrazione con registri elettronici, nessuna licenza B2B per scuole **senza una nuova valutazione AI Act** |
| V4 | Il chatbot non valuta né corregge i compiti con un voto. Aiuta a ragionare (socratico) e può segnalare errori in modo formativo |
| V5 | Nessuna funzione di sorveglianza durante verifiche o compiti in classe |
| V6 | Le scelte adattive sono deterministiche/regolabili e documentate (es. "dopo 3 successi suggerisci il livello successivo") |

**Art. 6(3) (deroga).** Se in futuro una funzione ricadesse formalmente in un caso dell'Allegato III ma svolgesse solo un compito procedurale limitato o preparatorio, si potrebbe valutare la deroga dell'art. 6(3). Servirebbero però la documentazione della valutazione (art. 6(4)) e la **registrazione nella banca dati UE** (art. 49(2)). Oggi non serve: il sistema non rientra nell'Allegato III.

**Conclusione:** sistema di IA a **rischio limitato**, con obblighi di trasparenza (art. 50), più alfabetizzazione IA (art. 4) e i divieti dell'art. 5 da rispettare in modo continuativo. ⚠️ DA VERIFICARE alla pubblicazione delle linee guida definitive sull'art. 6.

## 4. Obblighi di trasparenza (art. 50)

| Obbligo | Applicazione in [NOME APP] |
|---|---|
| 50(1): informare le persone fisiche che interagiscono con un sistema di IA (salvo che sia ovvio) | Per i bambini **non è mai "ovvio"**. Misure: (a) all'inizio di ogni chat la mascotte dice in linguaggio adatto all'età: "Sono [mascotte], un programma per computer (un'intelligenza artificiale). Non sono una persona."; (b) icona/etichetta "IA" sempre visibile nell'interfaccia della chat; (c) in modalità vocale l'annuncio è anche parlato; (d) informativa per i bambini e per i genitori. Il messaggio va ripetuto periodicamente (es. a ogni nuova sessione) |
| 50(2): marcatura in formato leggibile da macchina dei contenuti sintetici (testo, audio, immagini, video) generati | Si applica ai fornitori di sistemi che generano contenuti sintetici, testo compreso. Misure proposte: metadati per ogni messaggio (`generator: "ai"`, modello, versione) nel DB e nell'HTML (es. attributo `data-ai-generated="true"` + meta tag della pagina), nell'export delle trascrizioni e nelle copie/condivisioni. ⚠️ DA VERIFICARE: soluzioni tecniche indicate dal **Codice di condotta della Commissione sulla marcatura e l'etichettatura** dei contenuti IA e dalle linee guida sull'art. 50 (stato da controllare al go-live). TTS on-device: l'audio è generato dal browser a partire da testo IA, quindi va etichettato nell'interfaccia |
| 50(3): sistemi di riconoscimento delle emozioni o categorizzazione biometrica | Non applicabile (vietato per scelta di progetto) |
| 50(4): deep fake / testi pubblicati per informare il pubblico | Non applicabile (nessuna pubblicazione) |
| 50(5): informazioni chiare e accessibili al più tardi alla prima interazione | Messaggio di benvenuto + informativa per i bambini |

## 5. Sorveglianza umana (volontaria, buona pratica)
Non è obbligatoria ex art. 14 (non è alto rischio), ma va adottata per la natura del servizio:
- **genitore come supervisore umano:** accesso completo alle trascrizioni, avvisi immediati, possibilità di disattivare il chatbot o la voce, di passare da socratico a diretto, di cancellare;
- **titolare:** revisione delle segnalazioni dei genitori, monitoraggio aggregato delle metriche di moderazione, kill switch globale del chatbot (feature flag) attivabile in pochi minuti;
- nessuna decisione con effetti giuridici o simili sul bambino viene presa dall'IA.

## 6. Logging e tracciabilità
- Per ogni messaggio: timestamp, ID del profilo pseudonimo, modello e versione, versione del prompt di sistema, provider effettivo (dalla risposta OpenRouter), esito della moderazione di input e output (categoria/punteggio), latenza. **Il contenuto resta solo nella tabella delle trascrizioni (90 gg).** I metadati tecnici si possono tenere più a lungo in forma pseudonima (⚠️ DA DECIDERE: 13 mesi).
- Versionamento dei prompt di sistema e delle safety policy nel repo (git), con changelog.
- Registro dei red-teaming e delle valutazioni (vedi `safety-policy.md`).

## 7. Documentazione del modello e dei fornitori (catena del valore)
| Voce | Contenuto | Stato |
|---|---|---|
| Modelli usati | Mistral Small 4 (`mistralai/mistral-small-2603`), Ministral 3 (`mistralai/ministral-8b-2512` / `ministral-14b-2512`), Voxtral Mini Transcribe, moderazione Mistral | ⚠️ DA DECIDERE quale per fascia d'età |
| Fornitore GPAI | Mistral AI SAS (Francia). Modelli open-weight (parziale esenzione ex art. 53(2) per gli obblighi documentali verso i downstream provider, salvo rischio sistemico) | ⚠️ DA VERIFICARE: adesione di Mistral al Codice di condotta GPAI (luglio 2025) e disponibilità della documentazione per i downstream provider (art. 53(1)(b)), compresa la sintesi dei dati di addestramento |
| Model card / limiti noti | Raccogliere le model card ufficiali e annotare i limiti (lingue, allucinazioni, sicurezza) | Da fare |
| Gateway | OpenRouter Inc. (non è fornitore di IA: intermediario tecnico) | |
| Valutazioni interne | Benchmark di sicurezza per lingua e fascia d'età prima di ogni cambio di modello | Da fare |

## 8. Alfabetizzazione IA (art. 4, come modificato)
- Il titolare (e in futuro personale e collaboratori) segue una formazione documentata su: funzionamento e limiti degli LLM, rischi per i minori, procedure di sicurezza. Registro della formazione.
- Per gli utenti (non obbligatorio, ma coerente con la missione): una sezione "Come funziona l'IA" per genitori e una versione per bambini (vedi `public/children-notice.*.md`), oltre a microcopy nel chatbot ("Posso sbagliare! Controlliamo insieme?").

## 9. Gestione degli incidenti IA
- L'obbligo di notifica degli **incidenti gravi** (art. 73) vale per i sistemi ad alto rischio: **non si applica oggi**. Si adotta comunque la procedura volontaria in `incident-response.md` §B (es. risposta che incoraggia l'autolesionismo, contenuto sessuale a un minore, mancato avviso in un caso grave).
- Possibili concorrenze: GDPR (se l'incidente è anche una violazione dei dati), responsabilità da prodotto (la nuova Direttiva (UE) 2024/2853 si applica ai prodotti immessi dal 09/12/2026 e comprende il software, ⚠️ DA VERIFICARE la trasposizione italiana), segnalazione di CSAM alle autorità (Polizia Postale).

## 10. Altre normative da tenere d'occhio
| Norma | Rilevanza | Valutazione |
|---|---|---|
| DSA (Reg. 2022/2065) art. 28 + linee guida della Commissione sulla protezione dei minori (luglio 2025) | Si applica alle "piattaforme online" (diffusione al pubblico di contenuti degli utenti) | Probabilmente **non applicabile** (nessuna condivisione pubblica). [NOME APP] è un "servizio della società dell'informazione" / hosting minimo. Adottare comunque le linee guida come buona pratica. ⚠️ DA VERIFICARE |
| UK Online Safety Act 2023 | Si applica ai chatbot che permettono di condividere contenuti tra utenti (user-to-user) o che cercano su più siti o database (search services), secondo la lettera aperta Ofcom dell'08/11/2024 | **Fuori ambito** se il chatbot non condivide contenuti tra utenti e non fa ricerche web live. Vincolo: niente ricerca web live senza una nuova valutazione OSA. ⚠️ DA VERIFICARE |
| Cyber Resilience Act (Reg. 2024/2847) | Prodotti con elementi digitali | Un SaaS puro tende a esserne fuori, ma una PWA installabile potrebbe rientrarvi. ⚠️ DA VERIFICARE (obblighi principali dall'11/12/2027, segnalazione delle vulnerabilità dall'11/09/2026) |
| Direttiva 2005/29 (pratiche commerciali sleali) / Codice del consumo | Freemium verso famiglie | Nessun invito all'acquisto rivolto ai bambini (vedi art. 5(1)(b)) |
