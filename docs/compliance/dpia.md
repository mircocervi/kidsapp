# Valutazione d'impatto sulla protezione dei dati (DPIA, art. 35 GDPR) — Wondimo

> Stato: BOZZA v0.1 — 04/10/2026 — redatta prima dello sviluppo (privacy by design). Va rivista: (1) prima del go-live, (2) a ogni modifica sostanziale (nuovo fornitore, nuovo modello, nuovo mercato, ingresso delle scuole come clienti), (3) almeno una volta l'anno.
> Metodologia: Linee guida WP248 rev.01 (EDPB), elenco dei trattamenti soggetti a DPIA del Garante (provv. 467/2018), ICO Age Appropriate Design Code (standard 2). Scala di rischio: probabilità (1-4) × gravità (1-4).

## 1. Necessità della DPIA

La DPIA è **obbligatoria**. Ricorrono più criteri WP248:
- interessati vulnerabili (minori 3-13 anni);
- uso innovativo di tecnologie (IA generativa conversazionale);
- monitoraggio sistematico (moderazione automatica e avvisi al genitore su ogni messaggio);
- possibili categorie particolari di dati (confidenze su salute, abusi, religione);
- trasferimenti/fornitori extra-UE.

L'elenco del Garante (provv. 11/10/2018, n. 467) include trattamenti su larga scala di dati di interessati vulnerabili, in particolare i minori, e l'uso di tecnologie innovative. Il Garante ha sanzionato Character.AI (provv. 03/07/2026) anche per la DPIA non completata in tempo. Per il Regno Unito il Children's Code (standard 2) richiede la DPIA per qualunque servizio ISS che possa essere usato da minori.

## 2. Descrizione sistematica del trattamento

### 2.1 Natura e contesto
PWA web (nessuno store) con:
1. giochi educativi per fasce d'età (scuola dell'infanzia → 5ª primaria);
2. chatbot IA che risponde a domande, compiti e ricerche scolastiche, con approccio socratico di default e risposte più dirette se il genitore lo sceglie; mascotte scelta dal bambino; voce per 3-7 anni, testo+voce da 8 anni;
3. area genitore protetta da PIN: statistiche, progressi, trascrizioni complete delle chat, avvisi di sicurezza, impostazioni.

Solo il genitore ha un account (magic link, Google, Apple; nessuna password). I figli sono profili con nickname, avatar, fascia d'età. Freemium, nessun pagamento, nessuna pubblicità, nessun tracker di terze parti. Mercati: UE + Svizzera + UK (mercato di test: Italia), USA in seguito.

### 2.2 Flussi di dati
```
[Dispositivo]  --TLS-->  [Vercel fra1: Next.js/API]  --TLS-->  [Supabase eu-central-1: Postgres/Auth]
     |  audio (push-to-talk)          |
     |                                +--TLS--> [OpenRouter (EU endpoint)] --> [Mistral AI, UE, ZDR]
     |                                            (chat, moderazione input/output, trascrizione Voxtral)
     +-- TTS locale (speechSynthesis, solo voci localService) - nessun dato esce dal dispositivo
[Email provider ⚠️] <-- notifiche/magic link al genitore
```
Elenco completo dei trattamenti: `ropa.md`. Fornitori: `subprocessors.md`.

### 2.3 Dati trattati (sintesi)
- **Genitore:** email, ID dell'IdP, hash del PIN, impostazioni, registro dei consensi.
- **Bambino:** nickname, avatar, fascia d'età, progressi, testo delle chat, audio transitorio, avvisi di sicurezza, eventi d'uso pseudonimi.
- **Non raccolti (per scelta):** data di nascita, nome reale (scoraggiato), cognome, foto, email/telefono del bambino, geolocalizzazione precisa, contatti, identificativi pubblicitari.

### 2.4 Asset di supporto
Codice applicativo (repo privato), Vercel, Supabase, OpenRouter, Mistral, fornitore email, dispositivi del titolare (amministrazione).

## 3. Necessità e proporzionalità

| Principio | Come è rispettato | Rischio residuo / note |
|---|---|---|
| Liceità (art. 6, 8, 9) | Contratto con il genitore + consenso del genitore per il minore (art. 8 GDPR, art. 2-quinquies Codice, art. 4 c. 4 L. 132/2025). Interesse legittimo per sicurezza e statistiche, con LIA | ⚠️ DA VERIFICARE: base per i dati art. 9 rivelati spontaneamente. Proposta: consenso esplicito del genitore + minimizzazione |
| Limitazione della finalità | Nessun uso per marketing, profilazione commerciale, addestramento di modelli, vendita | Va scritto nei ToS e nei DPA (no training: ZDR) |
| Minimizzazione | Nessun dato anagrafico del bambino; fascia d'età invece della data di nascita; audio non conservato; al modello si inviano solo testo, fascia d'età e lingua | Il testo libero può contenere PII: valutare un filtro di redazione (⚠️ DA DECIDERE) |
| Esattezza | Il genitore può correggere fascia d'età e impostazioni | Le risposte dell'IA possono essere errate: avviso e impostazione socratica (vedi R5) |
| Limitazione della conservazione | Chat 90 gg con cancellazione automatica, audio 0, log 30 gg | Backup: le cancellazioni raggiungono i backup solo a fine rotazione (⚠️ DA VERIFICARE) |
| Integrità e riservatezza | Cifratura in transito e a riposo, RLS, PIN, MFA amministrativa, ZDR | Vedi R1, R2 |
| Trasparenza | Informativa per i genitori, informativa per i bambini, Trust Center, avviso IA in ogni chat | |
| Diritti | Esercitabili dal genitore dall'area genitore (export, cancellazione) o via email | Vedi `data-retention.md` |
| Necessità del monitoraggio parentale | Il genitore vede tutto: proporzionato per i bambini 3-13, in linea con l'aspettativa sociale e con la funzione di sicurezza | Children's Code std 11: il bambino deve sapere di essere "osservato" (indicatore visibile + informativa per bambini). Per i più grandi (11-13) valutare un "diario privato" non previsto: decisione ⚠️ DA DECIDERE |

## 4. Valutazione dei rischi per i diritti e le libertà

Legenda: P = probabilità, G = gravità (1 bassa → 4 massima). Rischio = P×G (1-4 basso, 5-8 medio, 9-16 alto).

| ID | Rischio | Fonte/scenario | P | G | Rischio iniziale | Misure (vedi §5) | P' | G' | Rischio residuo |
|---|---|---|---|---|---|---|---|---|---|
| R1 | Accesso non autorizzato alle trascrizioni delle chat dei bambini | Violazione Supabase, errore RLS, account del genitore compromesso, dispositivo condiviso | 3 | 4 | 12 alto | M1, M2, M3, M4 | 2 | 4 | 8 medio |
| R2 | Conservazione o riuso dei prompt dei bambini da parte del fornitore LLM (training, log) | Configurazione errata del routing, fallback a provider non ZDR, ZDR non attivata da Mistral, logging di OpenRouter | 3 | 3 | 9 alto | M5, M6, M7 | 1 | 3 | 3 basso |
| R3 | Trasferimento dei contenuti verso gli USA (accesso da parte di autorità pubbliche USA) | Endpoint globale di OpenRouter, endpoint `mistral/us`, supporto/backup di Supabase/Vercel | 3 | 3 | 9 alto | M6, M8 | 1 | 3 | 3 basso (con endpoint UE o Mistral diretto); 6 medio altrimenti |
| R4 | Contenuti dannosi o inappropriati generati dall'IA (sessuali, violenti, pericolosi, autolesionismo) | Allucinazioni, jailbreak da parte del bambino o di fratelli più grandi | 3 | 4 | 12 alto | M9, M10, M11, M12 | 2 | 3 | 6 medio |
| R5 | Informazioni errate o fuorvianti (compiti, salute, fatti) | Limiti dei modelli piccoli | 4 | 2 | 8 medio | M9, M13 | 3 | 2 | 6 medio |
| R6 | Dipendenza emotiva / antropomorfizzazione della mascotte, manipolazione | Design "companion", engagement | 2 | 4 | 8 medio | M14, M15 | 1 | 3 | 3 basso |
| R7 | Mancata protezione del bambino in caso di rivelazione di abusi, oppure avviso al genitore che è l'abusante | Avviso automatico al genitore | 2 | 4 | 8 medio | M16 | 2 | 3 | 6 medio — ⚠️ rischio intrinseco, va accettato consapevolmente |
| R8 | Falsi negativi della moderazione (mancata segnalazione di autolesionismo) | Linguaggio infantile, errori di ortografia, lingue diverse | 3 | 4 | 12 alto | M10, M11, M17 | 2 | 4 | 8 medio |
| R9 | Falsi positivi (avvisi ingiustificati che allarmano il genitore o portano a sorveglianza eccessiva) | Classificatore troppo sensibile | 3 | 2 | 6 medio | M17, M18 | 2 | 2 | 4 basso |
| R10 | Consenso non valido (chi crea l'account non è il genitore, oppure è un minore) | Autodichiarazione | 3 | 3 | 9 alto | M19 | 2 | 3 | 6 medio |
| R11 | Raccolta di PII del bambino o di terzi nel testo libero (nome, scuola, indirizzo) | Il bambino scrive dati personali | 4 | 2 | 8 medio | M20, M5 | 3 | 1 | 3 basso |
| R12 | Profilazione/valutazione automatizzata del bambino con effetti sul percorso scolastico | Livelli e progressi usati come valutazione | 2 | 3 | 6 medio | M21 | 1 | 2 | 2 basso |
| R13 | Fuga di dati verso Google tramite le API vocali del browser | Web Speech Recognition / voci TTS di rete | 3 | 2 | 6 medio | M22 | 1 | 2 | 2 basso |
| R14 | Mancato esercizio dei diritti / cancellazione incompleta | Backup, log, fornitori | 2 | 2 | 4 basso | M23 | 1 | 2 | 2 basso |
| R15 | Violazione dei termini dei fornitori (clausole "no dati di minori"), con interruzione improvvisa del servizio o responsabilità contrattuale | Mistral Commercial Terms §2.2(c), ToS OpenRouter 18+, DPA OpenRouter "Sensitive Data" | 4 | 3 | 12 alto | M24 | ⚠️ | ⚠️ | **non accettabile finché non è risolto** |
| R16 | Titolare persona fisica: continuità, capacità di risposta (breach h24, avvisi) | Struttura minima | 3 | 3 | 9 alto | M25 | 2 | 3 | 6 medio |
| R17 | Uso del servizio da parte di bambini fuori fascia o di adolescenti per aggirare i limiti | Account condiviso | 2 | 2 | 4 basso | M9, M12 | 2 | 2 | 4 basso |

## 5. Misure

| ID | Misura | Tipo | Stato |
|---|---|---|---|
| M1 | Row Level Security su tutte le tabelle; test automatici di isolamento tra account | Tecnica | Da implementare |
| M2 | Cifratura a riposo (Supabase/AWS) e in transito (TLS 1.2+), HSTS | Tecnica | Default dei fornitori, da verificare |
| M3 | Parental gate: PIN obbligatorio per l'area genitore (hash, tentativi limitati, reset solo via magic link); timeout della sessione | Tecnica | Da implementare |
| M4 | MFA su tutti gli account amministrativi dei fornitori; principio del minimo privilegio; chiavi in secret manager, rotazione | Organizzativa | Da fare |
| M5 | ZDR end-to-end: OpenRouter con `zdr: true`, `data_collection: "deny"`, `allow_fallbacks: false`, `only: ["mistral"]`; prompt logging disattivato; ZDR Mistral approvata per iscritto | Tecnica/contrattuale | ⚠️ DA VERIFICARE |
| M6 | Endpoint UE (`eu.openrouter.ai`, piano Business) **oppure** API Mistral diretta; esclusione di `mistral/us`; test di CI che verifica il provider effettivo | Tecnica | ⚠️ DA DECIDERE |
| M7 | Nessun identificativo inviato al modello (né `user` né ID profilo): solo fascia d'età e lingua | Tecnica | Da implementare |
| M8 | TIA per Supabase e OpenRouter (SCC); preferire fornitori certificati DPF o UE | Organizzativa | ⚠️ DA FARE |
| M9 | Prompt di sistema per fascia d'età (vedi `safety-policy.md`), modelli di risposta socratici, rifiuto dei temi fuori perimetro | Tecnica | Da implementare |
| M10 | Moderazione dell'input **e** dell'output con classificatore (Mistral moderation, in ZDR), con soglie più severe per le fasce più giovani | Tecnica | Da implementare |
| M11 | Red-teaming prima del go-live e periodico (piano in `safety-policy.md` §8), multilingue | Organizzativa | Da fare |
| M12 | Limiti di sessione (lunghezza del contesto, messaggi/giorno, tempo d'uso impostabile dal genitore) | Tecnica | Da implementare |
| M13 | Avviso "l'IA può sbagliare, controlla con un adulto"; per salute, medicina e sicurezza: mai consigli, rinvio a un adulto | Tecnica/UX | Da implementare |
| M14 | Mascotte esplicitamente "un programma/robot" e non un amico umano; niente "ti voglio bene", niente gelosia, niente richieste di tornare; niente streak o notifiche push al bambino | Design | Da implementare |
| M15 | Nessuna dark pattern / nudge (Children's Code std 13), nessuna ricompensa per il tempo trascorso in chat | Design | Da implementare |
| M16 | Protocollo di rivelazione: il bambino riceve sempre i numeri di aiuto (es. Telefono Azzurro 19696) e l'invito a parlare con un adulto di fiducia **anche diverso dal genitore** (maestra, altro familiare); l'avviso al genitore è neutro. ⚠️ DA DECIDERE: escalation interna per i casi gravi (vedi `safety-policy.md` §6) | Organizzativa | ⚠️ |
| M17 | Valutazione periodica di precision/recall del classificatore su dataset di test per lingua e fascia d'età; revisione umana solo su segnalazione | Organizzativa | Da fare |
| M18 | Livelli di avviso (informativo/importante/urgente) e il genitore vede il contesto | Design | Da implementare |
| M19 | Verifica del genitore: conferma via email + dichiarazione di essere maggiorenne e titolare della responsabilità genitoriale + parental gate (domanda per adulti) prima del consenso. ⚠️ DA DECIDERE se aggiungere un metodo più forte (es. micro-transazione con carta, solo per gli USA, vedi `coppa.md`) | Tecnica | ⚠️ |
| M20 | Avvisi al bambino ("non scrivere il tuo nome, la scuola, l'indirizzo"); eventuale redazione automatica delle PII prima dell'invio al modello | Tecnica/UX | ⚠️ DA DECIDERE |
| M21 | Livelli come **suggerimenti** al genitore; nessun blocco automatico; nessun voto o certificato; nessuna condivisione con scuole (vedi `ai-act.md`) | Design | Vincolo di progetto |
| M22 | Nessuna Web Speech Recognition; TTS solo con voci `localService`; Voxtral in ZDR per la trascrizione | Tecnica | Da implementare + test |
| M23 | Cancellazione a cascata (DB, storage), job di retention giornaliero con log di esecuzione, procedura per i backup | Tecnica | Da implementare |
| M24 | Addendum scritti con Mistral (deroga a §2.2(c)) e con OpenRouter (Sensitive Data e minori); in alternativa cambio di fornitore | Contrattuale | **⚠️ BLOCCANTE** |
| M25 | Procedura di incident response con contatti, reperibilità, registro (vedi `incident-response.md`); valutare un sostituto/delegato | Organizzativa | Da fare |

## 5-bis. Diritti dei minori (oltre alla privacy)
Riferimento: Convenzione ONU sui diritti dell'infanzia (UNCRC) e General Comment n. 25 (2021) sull'ambiente digitale, richiamati dal Children's Code.
- **Diritto all'informazione e all'educazione (art. 17, 28 UNCRC):** il servizio lo favorisce. Rischio: risposte errate (R5).
- **Diritto alla privacy (art. 16), anche nei confronti dei genitori, in base all'età:** il monitoraggio totale è giustificato per 3-10 anni. Per 11-13 anni il bilanciamento è più delicato. ⚠️ DA DECIDERE: informare chiaramente il bambino che il genitore legge le chat (scelta minima obbligatoria).
- **Protezione da violenza e sfruttamento (art. 19, 34):** protocollo di rivelazione (M16).
- **Ascolto e partecipazione (art. 12):** valutare test di usabilità con bambini e genitori (con consenso) prima del lancio. ⚠️ DA DECIDERE.

## 6. Consultazione delle parti interessate
⚠️ DA FARE: raccogliere il parere di genitori e insegnanti (beta chiusa), eventualmente di un esperto di tutela dell'infanzia o psicologo dell'età evolutiva per la safety policy. Documentare gli esiti qui.

## 7. Conclusione e consultazione preventiva (art. 36)
- Con le misure M1-M25 attuate, i rischi residui sono **medi o bassi**, **tranne R15** (vincoli contrattuali dei fornitori sui dati dei minori), che resta **non accettabile** finché non è risolto.
- Se R15 non si risolve, o se il rischio residuo complessivo resta alto, il titolare deve **consultare il Garante prima del trattamento** (art. 36).
- Decisione del titolare: ⚠️ DA COMPILARE (data, firma, eventuale parere del DPO).

## 8. Piano di riesame
| Evento | Azione |
|---|---|
| Prima del go-live | Verifica di tutte le ⚠️, test di red-teaming, firma della DPIA |
| Ogni 12 mesi | Riesame completo |
| Nuovo modello LLM o nuovo fornitore | Riesame di R2-R5, R8, R15 + nuovo red-teaming |
| Lancio USA | Integrazione con `coppa.md` |
| Vendita/uso da parte di scuole | Riesame AI Act (Annex III) + ruoli (la scuola diventa titolare?) |
