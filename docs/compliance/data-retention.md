# Conservazione, cancellazione e diritti degli interessati — [NOME APP]

> Stato: BOZZA v0.1 — 04/10/2026. I tempi marcati ⚠️ sono proposte da confermare.

## 1. Schema di conservazione

| Dato | Dove | Durata | Meccanismo di cancellazione | Note |
|---|---|---|---|---|
| Audio vocale del bambino | Memoria del dispositivo → richiesta a Voxtral (ZDR) | **0**: mai salvato | Buffer liberato dopo la trascrizione; nessun upload su storage | Coerente con l'eccezione audio della COPPA (vedi `coppa.md`) |
| Prompt/risposte presso OpenRouter e Mistral | Fornitori | **0** (ZDR); la cache in memoria non conta come conservazione | Contrattuale (ZDR) | ⚠️ DA VERIFICARE l'approvazione ZDR di Mistral |
| Trascrizioni delle chat | Supabase | **90 giorni** dal messaggio | Job giornaliero (`pg_cron` o cron Vercel) che fa `DELETE` dei messaggi più vecchi di 90 gg; log di esecuzione | Il genitore può cancellare prima: singola conversazione, tutte le conversazioni del profilo, profilo, account |
| Avvisi di sicurezza (con estratto) | Supabase | 90 giorni | Come sopra | ⚠️ DA DECIDERE: metadati senza testo per 12 mesi |
| Metadati di moderazione/tecnici delle chat (senza contenuto) | Supabase | 13 mesi ⚠️ | Job | Per AI Act §6 e per le statistiche |
| Progressi dei giochi (dettaglio) | Supabase | 13 mesi, poi aggregato per profilo ⚠️ | Job | |
| Progressi aggregati del profilo | Supabase | Durata del profilo | Cancellazione del profilo | |
| Profilo del bambino | Supabase | Fino alla cancellazione da parte del genitore o alla chiusura dell'account | Cascade | |
| Account del genitore | Supabase Auth + DB | Durata dell'account; inattività di 24 mesi → avviso a 23 mesi → cancellazione ⚠️ | Procedura di account deletion | |
| Registro dei consensi | Supabase | Durata dell'account + 5 anni ⚠️ | Job | Serve come prova del consenso (art. 7(1)); valutare di conservare solo hash, versione e timestamp |
| Eventi d'uso pseudonimi (statistiche) | Supabase | 13 mesi | Job | |
| Aggregati anonimi | Supabase | Illimitata | — | k-anonimity ≥ 10 |
| Log tecnici (Vercel, Supabase) | Fornitori | 30 gg ⚠️ (dipende dal piano) | Rotazione automatica | Mai contenuti delle chat nei log |
| Email transazionali (log di invio) | Fornitore email ⚠️ | ~30 gg ⚠️ | Rotazione | |
| Backup DB | Supabase | Rotazione 7 gg / PITR ⚠️ DA VERIFICARE per il piano | Rotazione automatica | I dati cancellati restano nei backup fino a fine rotazione; vanno indicati nell'informativa. In caso di restore si riapplicano le cancellazioni (tabella "tombstone" delle cancellazioni) |
| Richieste di esercizio dei diritti | Supabase/email | 2 anni dalla chiusura ⚠️ | Manuale/job | |
| Registro delle violazioni e degli incidenti | Documento interno | 5 anni ⚠️ | Manuale | |

## 2. Procedure di cancellazione

### 2.1 Cancellazione di una conversazione (dal genitore)
1. Area genitore → profilo → conversazione → "Elimina" (conferma).
2. `DELETE` dei messaggi e degli avvisi collegati; i metadati tecnici restano pseudonimi (senza contenuto).
3. Effetto immediato nei sistemi attivi; nei backup a fine rotazione.

### 2.2 Cancellazione di un profilo del bambino
1. Area genitore (PIN) → profilo → "Elimina profilo" (conferma con PIN).
2. Cascade: profilo, conversazioni, avvisi, progressi, eventi pseudonimi collegati.
3. Gli aggregati anonimi restano (non sono dati personali).

### 2.3 Cancellazione dell'account
1. Area genitore → "Elimina account" (PIN + conferma via magic link).
2. Cancellazione di tutti i profili (2.2), delle impostazioni e dell'utente Supabase Auth; revoca delle sessioni.
3. Il registro dei consensi si conserva per il periodo indicato (prova), ridotto al minimo.
4. Email di conferma al genitore.
5. Tempo massimo: immediato nei sistemi attivi, ≤ 30 gg complessivi compresi backup e log ⚠️ DA VERIFICARE.

### 2.4 Retention automatica
- Job giornaliero idempotente con log di esecuzione (righe cancellate per tabella) e allarme se fallisce per 2 giorni consecutivi.
- Test automatico: inserire un dato con timestamp "vecchio" e verificare che venga cancellato.

## 3. Diritti degli interessati (artt. 12-22 GDPR; UK GDPR; nLPD)

### 3.1 Chi esercita i diritti
- **Genitore:** per sé e, in qualità di titolare della responsabilità genitoriale, per il figlio.
- **Bambino:** può esercitarli in proprio quando ne ha la capacità. In Italia, per i servizi della società dell'informazione, dai 14 anni (art. 2-quinquies Codice), che è fuori dal target. In Svizzera, in base alla capacità di discernimento. Una richiesta diretta di un bambino va gestita con attenzione e coinvolgendo il genitore, salvo che il coinvolgimento sia contrario all'interesse del minore (⚠️ caso raro da valutare caso per caso).
- **Altro genitore** (genitori separati, responsabilità genitoriale congiunta): ⚠️ DA DECIDERE. Proposta: l'account è di un genitore; l'altro genitore può chiedere accesso, rettifica o cancellazione dimostrando la responsabilità genitoriale. Il servizio non arbitra conflitti familiari: in caso di disaccordo sulla cancellazione si sospende il trattamento (limitazione, art. 18) e si chiede l'accordo dei genitori o un provvedimento. Va citato nei ToS.

### 3.2 Canali
- **Self-service** nell'area genitore: visualizzazione di tutti i dati (accesso), export JSON/PDF (portabilità), modifica (rettifica), cancellazione, disattivazione del chatbot o della voce (opposizione/limitazione), revoca del consenso (= disattivazione del chatbot e cancellazione dei dati della chat).
- **Email:** [EMAIL PRIVACY].

### 3.3 Procedura per le richieste via email
| Passo | Azione | Tempo |
|---|---|---|
| 1 | Registrazione della richiesta (data, tipo, richiedente) | Giorno 0 |
| 2 | Verifica dell'identità: la richiesta deve arrivare dall'email dell'account o va confermata con un magic link. Non chiedere documenti se non strettamente necessari | ≤ 3 gg |
| 3 | Evasione | **Entro 1 mese** (art. 12(3)); proroga di 2 mesi se la richiesta è complessa, comunicata entro il primo mese |
| 4 | Risposta in linguaggio chiaro, con informazione sul diritto di reclamo all'autorità di controllo (Garante IT; ICO UK; IFPDT/FDPIC CH; autorità dello Stato di residenza nell'UE) | |
| 5 | Chiusura e registrazione | |

### 3.4 Diritti specifici
- **Revoca del consenso:** in qualunque momento, senza pregiudizio per la liceità del trattamento precedente. Effetto: chatbot disattivato per quel profilo; i giochi restano disponibili se basati sul contratto.
- **Opposizione** (trattamenti basati su interesse legittimo, es. statistiche): accolta per default per i minori, salvo motivi cogenti; in pratica si esclude il profilo dalle statistiche pseudonime.
- **Decisioni automatizzate (art. 22):** non ce ne sono (vedi `ai-act.md` §3.2).
- **Portabilità:** export JSON (profili, progressi, trascrizioni disponibili).

## 4. Responsabile operativo
Mirco Cervi (titolare). ⚠️ DA DECIDERE un sostituto per le assenze, per rispettare i tempi.
