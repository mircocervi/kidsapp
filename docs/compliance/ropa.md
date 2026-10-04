# Registro delle attività di trattamento (art. 30(1) GDPR) — Wondimo

> Stato: BOZZA v0.1 — 04/10/2026. Da validare prima del go-live e da aggiornare a ogni modifica del servizio o dei fornitori.
> Formato: una scheda per trattamento. Le basi giuridiche sono **proposte**: vanno confermate dal titolare (⚠️ DA VERIFICARE).

## 0. Dati generali

| Voce | Valore |
|---|---|
| Titolare | Mirco Cervi, persona fisica, [INDIRIZZO], Italia — ⚠️ DA VERIFICARE: se si costituisce una società, aggiornare titolare, sede, P.IVA |
| Contatto privacy | [EMAIL PRIVACY] |
| DPO | ⚠️ DA VERIFICARE. La nomina potrebbe essere obbligatoria ex art. 37(1)(b): il monitoraggio di sicurezza delle chat dei minori potrebbe configurare un "monitoraggio regolare e sistematico su larga scala" se il servizio cresce. Il titolare non può essere DPO di se stesso (conflitto di interessi, art. 38(6)) |
| Rappresentante UE (art. 27 GDPR) | Non necessario: il titolare è stabilito in UE |
| Rappresentante UK (art. 27 UK GDPR) | ⚠️ DA VERIFICARE: probabilmente necessario per offrire il servizio a residenti UK, salvo esenzione per trattamento occasionale (non applicabile ai minori) |
| Rappresentante Svizzera (art. 14 nLPD) | ⚠️ DA VERIFICARE: necessario se il trattamento verso persone in CH è regolare, su larga scala e comporta un rischio elevato. I dati di minori + IA vanno in quella direzione |
| Interessati | (G) genitori/titolari della responsabilità genitoriale con account; (B) bambini 3-13 anni, profili senza account |

## 1. Schede di trattamento

### T1 — Gestione dell'account del genitore e autenticazione
| Voce | Contenuto |
|---|---|
| Finalità | Creare e gestire l'account del genitore, autenticarlo (magic link via email, Sign in with Google/Apple), proteggere l'area genitore con PIN |
| Base giuridica | Art. 6(1)(b) — esecuzione del contratto (termini di servizio accettati dal genitore) |
| Interessati | G |
| Categorie di dati | Email, identificativo dell'account Google/Apple (sub), nome visualizzato se fornito dall'IdP (⚠️ minimizzare: chiedere solo lo scope `email`), lingua, paese dichiarato, hash del PIN (mai in chiaro), data di creazione, ultimo accesso |
| Destinatari | Supabase (Auth), Vercel, fornitore email ⚠️, Google/Apple come titolari autonomi del login |
| Trasferimenti | Vedi `subprocessors.md` (SCC; DPF per Vercel) |
| Conservazione | Per la durata dell'account. Alla cancellazione: eliminazione immediata dai sistemi attivi, poi dai backup entro la rotazione (⚠️ DA VERIFICARE la durata PITR/backup Supabase). Account inattivo: avviso a 23 mesi, cancellazione a 24 mesi |
| Misure | TLS, cifratura a riposo, RLS Postgres, PIN con hash forte (argon2/bcrypt), rate limiting, lockout, magic link monouso con scadenza breve |

### T2 — Consenso del genitore e gestione dei profili dei bambini
| Voce | Contenuto |
|---|---|
| Finalità | Raccogliere il consenso del genitore al trattamento dei dati del figlio e all'accesso all'IA; creare i profili figlio |
| Base giuridica | Art. 6(1)(a) + art. 8 GDPR (consenso del titolare della responsabilità genitoriale) e art. 2-quinquies Codice privacy; **art. 4, c. 4, L. 132/2025** (accesso dei minori di 14 anni a tecnologie di IA solo con il consenso di chi esercita la responsabilità genitoriale); art. 6(1)(b) per la parte contrattuale. ⚠️ DA VERIFICARE: impianto consenso vs contratto per i dati del bambino (il bambino non è parte del contratto) |
| Interessati | G, B |
| Categorie di dati | Nickname (non il nome reale: va consigliato all'inserimento), avatar scelto da una libreria predefinita (nessuna foto), fascia d'età/classe, lingua, mascotte scelta, impostazioni del genitore (modalità socratica/diretta, voce sì/no, limiti di tempo), registro dei consensi (timestamp, versione dell'informativa, metodo) |
| Destinatari | Supabase, Vercel |
| Trasferimenti | Come T1 |
| Conservazione | Profilo: per la durata dell'account o fino alla cancellazione da parte del genitore. Registro dei consensi: durata dell'account + 5 anni come prova (⚠️ DA VERIFICARE la proporzionalità; alternativa: 10 anni civilistici, oppure solo hash + timestamp) |
| Misure | Nessun campo per data di nascita, cognome, foto, email del bambino. Validazione per scoraggiare nomi reali nel nickname (avviso, non blocco) |

### T3 — Erogazione dei giochi educativi e tracciamento dei progressi
| Voce | Contenuto |
|---|---|
| Finalità | Erogare giochi adatti alla fascia d'età, salvare i progressi, mostrare al genitore i progressi e i **livelli suggeriti** |
| Base giuridica | Art. 6(1)(b) (servizio richiesto dal genitore) |
| Interessati | B (e G come destinatario delle informazioni) |
| Categorie di dati | Giochi giocati, punteggi, livelli completati, tempo di gioco, timestamp |
| Destinatari | Supabase, Vercel |
| Trasferimenti | Come T1 |
| Conservazione | Durata dell'account. Dettaglio degli eventi: 13 mesi, poi aggregato per profilo (⚠️ DA DECIDERE) |
| Misure | **Nessuna decisione automatizzata ex art. 22**: i livelli sono solo suggerimenti al genitore, nessun blocco automatico dei contenuti (vedi `ai-act.md` §3). Nessuna profilazione a fini di marketing |

### T4 — Chatbot IA (testo)
| Voce | Contenuto |
|---|---|
| Finalità | Rispondere alle domande del bambino (curiosità, compiti, ricerche) in modo adatto all'età, con approccio socratico o diretto secondo le impostazioni del genitore |
| Base giuridica | Art. 6(1)(b) + consenso del genitore ex art. 8 GDPR e art. 4 c. 4 L. 132/2025 (T2). **Categorie particolari (art. 9)**: il bambino potrebbe rivelare spontaneamente dati sulla salute, sulla religione, ecc. Proposta: consenso esplicito del genitore (art. 9(2)(a)) raccolto in T2 e minimizzazione. ⚠️ DA VERIFICARE |
| Interessati | B (ed eventuali terzi citati dal bambino nelle chat, es. compagni, familiari) |
| Categorie di dati | Testo dei messaggi, risposte dell'IA, fascia d'età, lingua, modalità (socratica/diretta), timestamp, esito della moderazione |
| Destinatari | OpenRouter (gateway), Mistral AI (inferenza e moderazione) — in ZDR; Supabase (salvataggio delle trascrizioni); il genitore (lettura delle trascrizioni) |
| Trasferimenti | Con l'endpoint UE di OpenRouter o l'API Mistral diretta: nessun trasferimento dei contenuti. Endpoint OpenRouter globale: trasferimento USA con SCC (da evitare). ⚠️ DA VERIFICARE |
| Conservazione | Presso i fornitori LLM: nessuna (ZDR). Trascrizioni nel DB: **90 giorni**, poi cancellazione automatica. Il genitore può cancellare prima (singola conversazione, profilo, account) |
| Misure | Prompt di sistema per fascia d'età, moderazione dell'input e dell'output, nessun identificativo inviato al modello (solo fascia d'età e lingua), filtro PII prima dell'invio (⚠️ DA DECIDERE: redazione di nomi, indirizzi, numeri di telefono), nessun addestramento sui dati, rate limit, limiti di sessione |

### T5 — Chat vocale (trascrizione)
| Voce | Contenuto |
|---|---|
| Finalità | Permettere ai bambini 3-7 anni (e 8+ se attivato) di parlare con la mascotte |
| Base giuridica | Come T4. La voce **non** è trattata come dato biometrico: nessuna identificazione o verifica del parlante, nessun riconoscimento delle emozioni. Va comunque spiegato chiaramente |
| Interessati | B (ed eventuali voci di terzi in sottofondo) |
| Categorie di dati | Registrazione audio (transitoria), testo trascritto |
| Destinatari | OpenRouter/Mistral (Voxtral) in ZDR |
| Trasferimenti | Come T4 |
| Conservazione | **Audio: mai salvato.** Esiste solo in memoria sul dispositivo e nella richiesta di trascrizione; eliminato subito dopo la trascrizione. Il testo trascritto segue T4 (90 gg) |
| Misure | Push-to-talk (nessun ascolto continuo), indicatore visivo del microfono, permesso del browser, nessun uso della Web Speech API di Chrome (invia audio a Google). TTS: Google Cloud Text-to-Speech UE per il solo testo da leggere (risposte del bot, frasi dei giochi); riserva con voci locali (`localService === true`) |

### T6 — Sicurezza del bambino: rilevazione dei temi sensibili e avvisi al genitore
| Voce | Contenuto |
|---|---|
| Finalità | Rilevare messaggi su bullismo, abusi, autolesionismo, pericoli; dare al bambino una risposta protettiva; avvisare subito il genitore |
| Base giuridica | Art. 6(1)(b) (funzione essenziale del servizio richiesta dal genitore) e art. 6(1)(f) (interesse legittimo alla tutela del minore). Nei casi estremi, art. 6(1)(d) (interessi vitali). Art. 9: consenso esplicito del genitore (T2) e, per i casi gravi, art. 9(2)(c). ⚠️ DA VERIFICARE |
| Interessati | B, terzi citati |
| Categorie di dati | Categoria del rischio, gravità, estratto del messaggio, timestamp, stato dell'avviso (letto/non letto) |
| Destinatari | Il genitore (notifica in app + email **senza contenuto sensibile** nel corpo dell'email: "C'è un avviso importante, apri l'area genitore"). Mistral (classificazione, ZDR). ⚠️ DA VERIFICARE: nessuna segnalazione automatica ad autorità o terzi |
| Trasferimenti | Come T4 |
| Conservazione | Avvisi: 90 giorni come le chat, cancellabili dal genitore. ⚠️ DA DECIDERE se conservare più a lungo (es. 12 mesi) solo i metadati (categoria, data, senza testo) per mostrare l'andamento al genitore |
| Misure | Vedi `safety-policy.md`. Si tiene conto del rischio che il genitore sia la causa del problema (abuso intrafamiliare): vedi DPIA R7 |

### T7 — Statistiche d'uso e miglioramento del servizio
| Voce | Contenuto |
|---|---|
| Finalità | Capire l'uso aggregato (giochi più usati, durata delle sessioni, tassi di errore, efficacia della moderazione) |
| Base giuridica | Art. 6(1)(f) — interesse legittimo, con bilanciamento documentato (LIA) che tenga conto della maggiore tutela dei minori. ⚠️ DA VERIFICARE: in alternativa, rendere tutte le statistiche anonime alla fonte |
| Interessati | G, B (pseudonimizzati) |
| Categorie di dati | Eventi d'uso con ID pseudonimo del profilo, fascia d'età, paese, lingua, tipo di dispositivo (categoria), NON il contenuto delle chat |
| Destinatari | Supabase (tabelle analitiche interne). **Nessun tool di analytics di terze parti** |
| Trasferimenti | Come T1 |
| Conservazione | Eventi pseudonimi: 13 mesi. Aggregati anonimi (soglia minima k ≥ 10): senza limite |
| Misure | Nessun cookie di profilazione, nessun fingerprinting, nessuno scambio con terzi |

### T8 — Revisione umana della sicurezza e miglioramento della moderazione
| Voce | Contenuto |
|---|---|
| Finalità | Analizzare falsi positivi e negativi della moderazione, gestire le segnalazioni dei genitori |
| Base giuridica | Art. 6(1)(f). Per l'accesso alle trascrizioni: **solo su segnalazione/consenso del genitore** per la specifica conversazione. ⚠️ DA DECIDERE |
| Interessati | B, G |
| Categorie di dati | Conversazione segnalata, esito della moderazione |
| Destinatari | Titolare (e in futuro personale autorizzato ex art. 29 e art. 2-quaterdecies Codice) |
| Conservazione | Durata della gestione della segnalazione, al massimo 90 gg, poi anonimizzazione |
| Misure | Accesso con log, nessun accesso di routine alle chat. Le chat non si usano per addestrare modelli |

### T9 — Sicurezza informatica e log tecnici
| Voce | Contenuto |
|---|---|
| Finalità | Garantire la sicurezza, prevenire gli abusi, fare debugging |
| Base giuridica | Art. 6(1)(f) e art. 32 |
| Interessati | G, B |
| Categorie di dati | IP (troncato dove possibile), user agent, ID richiesta, errori, eventi di autenticazione. **Mai il contenuto delle chat nei log** |
| Destinatari | Vercel, Supabase |
| Conservazione | 30 giorni (⚠️ DA VERIFICARE con le impostazioni del piano Vercel/Supabase) |
| Misure | Scrubbing dei log, accesso limitato, MFA sugli account dei fornitori |

### T10 — Gestione delle richieste degli interessati, delle comunicazioni e dei reclami
| Voce | Contenuto |
|---|---|
| Finalità | Rispondere alle richieste ex artt. 15-22, al supporto, ai reclami |
| Base giuridica | Art. 6(1)(c) (obbligo legale) |
| Interessati | G (anche per conto di B) |
| Categorie di dati | Email, contenuto della richiesta, esito |
| Conservazione | 2 anni dalla chiusura (⚠️ DA VERIFICARE) |

### T11 — Gestione delle violazioni dei dati e degli incidenti IA
| Voce | Contenuto |
|---|---|
| Finalità | Registro delle violazioni (art. 33(5)) e degli incidenti di sicurezza IA |
| Base giuridica | Art. 6(1)(c) |
| Conservazione | 5 anni (⚠️ DA VERIFICARE) |

## 2. Cookie e archiviazione locale
Solo strumenti tecnici: cookie di sessione Supabase (auth), preferenza della lingua, stato del profilo attivo (localStorage). Nessun cookie analitico o di profilazione, quindi niente banner di consenso (art. 122 Codice privacy; Linee guida cookie del Garante 10/06/2021). ⚠️ DA VERIFICARE prima del go-live con un'analisi delle richieste di rete (nessun font o CDN di terze parti, es. Google Fonts da self-hostare).
