<!-- BOZZA v0.1 — 04/10/2026. Pagina pubblica "Fiducia e sicurezza" per genitori, scuole e autorità. Regola: ogni affermazione deve essere VERA al momento della pubblicazione. Risolvere prima tutti i marcatori "⚠️ DA VERIFICARE". Mai dichiarare certificazioni, audit o bollini che non abbiamo. -->

# Fiducia e sicurezza in Wondimo

*Ultima revisione: [DATA]*

Wondimo è uno spazio di apprendimento per bambini dalla scuola dell'infanzia alla 5ª primaria, con giochi educativi e un assistente IA che aiuta con domande e compiti. In questa pagina spieghiamo in modo trasparente come proteggiamo i bambini: quali dati usiamo, dove sono, chi li vede, come rendiamo sicura l'IA e quali regole seguiamo.

---

## I nostri impegni

| | |
|---|---|
| 🚫 **Mai pubblicità** | Niente annunci, contenuti sponsorizzati o inviti all'acquisto mostrati ai bambini. |
| 🚫 **Niente tracker** | Niente analytics di terze parti, SDK pubblicitari o pixel dei social. Solo cookie tecnici. |
| 🚫 **Niente vendita o condivisione per marketing** | Non vendiamo dati e non creiamo profili commerciali. |
| 🚫 **Niente addestramento dell'IA con i dati della tua famiglia** | I fornitori di IA lavorano in modalità "zero data retention" e non si addestrano sulle conversazioni dei bambini. |
| 👨‍👩‍👧 **Controllo ai genitori** | Solo i genitori hanno un account. Vedono tutto e possono cancellare tutto. |
| 🧒 **Pochissimi dati sui bambini** | Soprannome, avatar e fascia d'età. Niente data di nascita, cognome, foto, email o telefono. |
| 🎤 **La voce non viene mai conservata** | Il parlato diventa testo e viene subito eliminato. Per la lettura ad alta voce inviamo a Google Cloud (server in UE) solo il testo da leggere — le risposte della mascotte e le frasi dei giochi, mai quello che scrive il bambino — e non lo conserviamo. |
| 🗓️ **Chat cancellate dopo 90 giorni** | In automatico, o prima se lo decide il genitore. |
| 🇪🇺 **Dati conservati nell'UE** | Database e server applicativi a Francoforte, Germania. [⚠️ DA VERIFICARE la regione di instradamento dell'IA] |

---

## Come usiamo l'IA

**Cos'è.** L'assistente si basa su modelli linguistici open-weight di **Mistral AI** (Francia), con un nostro livello di sicurezza: istruzioni specifiche per età, moderazione automatica di ogni messaggio in entrata e in uscita, protocollo di protezione dei minori.

**Cosa fa.**
- Risponde a curiosità e aiuta con compiti e ricerche scolastiche.
- **Di default guida il ragionamento** (metodo socratico) invece di dare la soluzione. I genitori possono renderlo più diretto.
- Adatta linguaggio e lunghezza delle risposte all'età.

**Cosa non fa.**
- Non finge mai di essere umano. Dice ai bambini, con parole adatte a loro, che è un programma.
- Non dà voti, non decide il livello scolastico, non limita l'accesso all'apprendimento. I livelli dei giochi sono **suggerimenti ai genitori**.
- Non riconosce emozioni dalla voce o dal volto e non usa dati biometrici.
- Non chiede informazioni personali e invita i bambini a non condividerle.
- Non è progettato per creare dipendenza emotiva: niente sensi di colpa, niente messaggi "torna da me", niente notifiche push ai bambini.

**Quando emerge qualcosa di delicato** (bullismo, abusi, autolesionismo, pericolo), l'assistente risponde con gentilezza e invita il bambino a parlare con un adulto di fiducia. Indica una linea d'ascolto gratuita per bambini (in Italia **Telefono Azzurro 19696**), non approfondisce l'argomento e **avvisa subito il genitore**.

**Può sbagliare.** L'IA non è perfetta. Testiamo l'assistente prima di ogni rilascio, anche con test avversariali ("red team"), e gli insegniamo a dire "controlliamo con un adulto". I genitori possono segnalare qualunque risposta.

---

## Quali dati, dove sono, chi li vede

| Dato | Finalità | Conservazione | Chi lo vede |
|---|---|---|---|
| Email del genitore / ID di accesso | Accesso all'account | Durata dell'account | Genitore |
| Soprannome, avatar, fascia d'età del bambino | Esperienza adatta all'età | Fino alla cancellazione | Genitore |
| Progressi nei giochi | Gioco e resoconti | 13 mesi in dettaglio, poi riepilogo [⚠️ DA VERIFICARE] | Genitore |
| Testo delle chat con l'IA | Risposte + revisione del genitore | **90 giorni** | Genitore |
| Voce | Solo trascrizione | **Non conservata** | Nessuno |
| Avvisi di sicurezza | Protezione del minore | 90 giorni | Genitore |
| Statistiche d'uso pseudonime (senza testo delle chat) | Migliorare il servizio | 13 mesi | Il nostro team, in forma aggregata |

Il nostro personale **non** legge di routine le conversazioni dei bambini. Guardiamo una conversazione specifica solo quando un genitore la segnala e ce lo chiede. [⚠️ DA VERIFICARE]

Dettagli completi: [Informativa per i genitori](privacy-policy.it.md) · [Informativa per i bambini](children-notice.it.md)

---

## Fornitori (sub-responsabili)

| Fornitore | Ruolo | Dove sono i dati | Garanzia per i trasferimenti |
|---|---|---|---|
| Vercel Inc. (USA) | Hosting dell'app | UE (Francoforte) | EU-U.S. Data Privacy Framework + SCC |
| Supabase Inc. (USA) | Database e accesso | UE (Francoforte, AWS) | Clausole Contrattuali Standard [⚠️ DA VERIFICARE] |
| OpenRouter Inc. (USA) | Instradamento delle richieste IA | [⚠️ DA VERIFICARE: endpoint UE] | Clausole Contrattuali Standard |
| Mistral AI SAS (Francia) | Modelli IA, trascrizione vocale, moderazione | UE | Non necessaria (UE) |
| [Fornitore email] | Email di accesso e avvisi | [⚠️] | [⚠️] |

Tutti i fornitori sono vincolati da accordi sul trattamento dei dati (art. 28 GDPR). I fornitori di IA sono configurati in **zero data retention**. Aggiorneremo questo elenco prima di aggiungere qualsiasi nuovo fornitore.

---

## Come cancellare i dati

Nell'area genitore protetta da PIN puoi, in qualunque momento:
- cancellare una singola conversazione;
- cancellare il profilo di un bambino (con chat, avvisi e progressi);
- cancellare l'intero account.

La cancellazione è immediata nei sistemi attivi. I backup si rinnovano entro [7] giorni [⚠️ DA VERIFICARE]. Puoi anche scrivere a [EMAIL PRIVACY].

---

## Le regole che seguiamo

Descriviamo come ci **allineiamo** a queste normative. **Non abbiamo certificazioni né bollini di terze parti, salvo quanto indicato qui sotto.** Non abbiamo ancora svolto un audit indipendente. [⚠️ aggiornare quando cambia]

| Normativa | Come la affrontiamo |
|---|---|
| **GDPR** e **Codice privacy** | Valutazione d'impatto (DPIA) svolta; registro dei trattamenti; consenso dei genitori per i minori (art. 8 GDPR, art. 2-quinquies Codice); minimizzazione; chat conservate 90 giorni; accordi sul trattamento con tutti i fornitori. |
| **Legge italiana sull'IA (L. 132/2025)** | I minori di 14 anni possono usare l'assistente IA solo con il consenso del genitore, che è parte dell'iscrizione. |
| **AI Act UE** (Reg. 2024/1689, come modificato nel 2026) | Valutato come sistema di IA a rischio limitato: non è una pratica vietata e non è un sistema ad alto rischio per l'istruzione (niente voti, ammissioni o decisioni sul livello). I bambini sanno sempre che parlano con un'IA (art. 50). Misure contro lo sfruttamento delle vulnerabilità dei minori (art. 5). |
| **UK GDPR e ICO Children's Code** | Progettato sui 15 standard del Codice: interesse superiore del minore, DPIA, design adatto all'età, trasparenza, privacy elevata per impostazione predefinita, minimizzazione, nessuna condivisione, nessuna geolocalizzazione, controllo parentale con indicatore visibile al bambino, nessuna profilazione, nessuna tecnica di "nudge", strumenti online per i diritti. |
| **nLPD svizzera** | Stesse tutele; dati conservati nell'UE (paese adeguato per la Svizzera). |
| **COPPA (USA)** | **Il servizio non è ancora offerto negli USA.** Ci stiamo preparando alla COPPA (compresa la regola modificata del 2025) prima di un eventuale lancio. |

---

## Sicurezza
- Cifratura in transito (TLS) e a riposo.
- Isolamento rigoroso dei dati di ogni famiglia nel database.
- Area genitore protetta da PIN; accesso senza password.
- Autenticazione a più fattori e accesso minimo indispensabile per l'amministrazione.
- Test di sicurezza dell'IA prima di ogni rilascio; "interruttore" per disattivare subito l'assistente.
- Piano di risposta agli incidenti: se una violazione dei dati riguarda la tua famiglia, te lo diremo e la notificheremo all'autorità nei termini di legge.

**Hai trovato un problema di sicurezza?** Scrivi a [email sicurezza] [⚠️ DA CREARE + security.txt].

---

## Contatti
- Privacy ed esercizio dei diritti: [EMAIL PRIVACY]
- Titolare: Mirco Cervi, Italia [⚠️ DA VERIFICARE se si passa a una società]
- Autorità di controllo: Garante per la protezione dei dati personali, oppure l'autorità del tuo paese (ICO nel Regno Unito, IFPDT in Svizzera).

*Scuole e organizzazioni:* oggi Wondimo è un servizio per le famiglie. Se vi interessa usarlo in classe, contattateci prima: l'uso scolastico richiede valutazioni aggiuntive. [⚠️ vedi ai-act.md V3]

---

## Amici, sfide e messaggi

- **Solo i genitori creano le amicizie.** Un genitore genera un codice per il proprio figlio e lo consegna di persona all'altro genitore, che lo inserisce e sceglie il proprio figlio. Senza l'approvazione di **entrambi** i genitori, due bambini non possono interagire.
- **Niente sconosciuti:** nessuna ricerca di utenti, nessun suggerimento di amici, nessun profilo pubblico, nessuna foto. L'altra famiglia vede solo soprannome e avatar.
- **Sfide nei giochi:** stesse domande per entrambi, al livello del più piccolo. Nessuna classifica pubblica, nessuna notifica che mette fretta.
- **Messaggi:** fino a 7 anni solo sticker e frasi pronte; dagli 8 anni anche testo breve, controllato prima della consegna (dati personali e contenuti offensivi non vengono consegnati e il genitore è avvisato). Niente foto, file, audio o link.
- **I genitori di entrambi vedono tutti i messaggi**, e i bambini lo sanno. Ogni bambino può mettere in pausa un'amicizia con "Non mi piace / Blocca": i genitori vengono avvisati.
- I messaggi si cancellano dopo 90 giorni.
