# Procedura di gestione degli incidenti — Wondimo

> Stato: BOZZA v0.1 — 04/10/2026.
> Parte A: violazioni dei dati personali (artt. 33-34 GDPR; UK GDPR; art. 24 nLPD).
> Parte B: incidenti di sicurezza dell'IA (procedura volontaria; art. 73 AI Act non applicabile perché il sistema non è ad alto rischio).

## Ruoli e contatti
| Ruolo | Chi | Contatto |
|---|---|---|
| Responsabile incidenti (titolare) | Mirco Cervi | [EMAIL PRIVACY] / [TELEFONO] |
| Sostituto | ⚠️ DA DECIDERE | |
| Consulente legale | ⚠️ DA DECIDERE | |
| Fornitori (contatti per la sicurezza) | Vercel, Supabase, OpenRouter, Mistral, fornitore email | ⚠️ Da compilare dai rispettivi trust center/DPA |
| Autorità di controllo | Garante (IT) — https://www.garanteprivacy.it (procedura telematica di notifica del data breach); ICO (UK); IFPDT/FDPIC (CH); per gli interessati di altri Stati UE: il Garante come autorità capofila (titolare stabilito in IT, one-stop-shop) | |

## Parte A — Violazione dei dati personali

### A.1 Cos'è
Qualunque violazione della sicurezza che comporta, accidentalmente o in modo illecito, distruzione, perdita, modifica, divulgazione non autorizzata o accesso a dati personali (art. 4(12)). Esempi per Wondimo:
- errore RLS che mostra la chat di un bambino a un altro genitore;
- chiave API di Supabase o OpenRouter esposta;
- logging accidentale dei prompt presso un fornitore (es. ZDR disattivata, fallback a un provider non ZDR);
- email di avviso inviata all'indirizzo sbagliato;
- violazione presso un responsabile (il DPA Supabase prevede notifica entro 48h ove possibile; OpenRouter entro 72h; Vercel senza ingiustificato ritardo).

### A.2 Flusso (orologio: 72h dalla "conoscenza")
| Fase | Azione | Tempo |
|---|---|---|
| 1. Rilevazione | Segnalazione da monitoraggio, fornitore, genitore, ricercatore di sicurezza (indirizzo `security@` / `security.txt`, ⚠️ DA CREARE) | T0 |
| 2. Contenimento | Revocare/ruotare le chiavi, disattivare la funzione (feature flag/kill switch), bloccare l'accesso, preservare le evidenze (log) | Subito |
| 3. Valutazione | Natura, categorie e numero approssimativo di interessati e record, dati di minori (gravità aumentata), contenuti sensibili (confidenze, avvisi), probabili conseguenze. Metodologia: EDPB Guidelines 9/2022 + metodologia ENISA sulla gravità | Entro 24h |
| 4. Decisione sulla notifica all'autorità (art. 33) | Notificare **salvo che sia improbabile un rischio** per i diritti e le libertà. **Per le chat dei bambini la soglia va considerata superata quasi sempre** | Entro **72h** da T0 (notifica anche per fasi, se le informazioni non sono complete) |
| 5. Comunicazione agli interessati (art. 34) | Se il rischio è **elevato**: comunicazione al **genitore** (per sé e per il figlio) in linguaggio chiaro: cosa è successo, quali dati, conseguenze probabili, misure prese, cosa può fare, contatti | Senza ingiustificato ritardo |
| 6. UK / CH | ICO entro 72h (UK GDPR art. 33); IFPDT "il prima possibile" se il rischio è elevato (art. 24 nLPD) | |
| 7. Registro | Annotare **ogni** violazione, anche se non notificata (art. 33(5)): fatti, effetti, misure, motivazione delle decisioni | Sempre |
| 8. Post-mortem | Cause, azioni correttive, aggiornamento della DPIA | Entro 30 gg |

### A.3 Modello di registro
| Campo | |
|---|---|
| ID / data e ora di scoperta / data e ora presunta dell'inizio | |
| Descrizione | |
| Dati e interessati coinvolti (numero di genitori/bambini) | |
| Fornitore coinvolto | |
| Valutazione del rischio (basso/medio/elevato) e motivazione | |
| Notifica all'autorità (sì/no, data, protocollo) | |
| Comunicazione agli interessati (sì/no, data, canale) | |
| Misure di contenimento e correttive | |
| Lezioni apprese | |

### A.4 Nota sul titolare persona fisica
Le 72h si contano anche nei weekend e nelle ferie. ⚠️ DA DECIDERE: reperibilità, sostituto, allarmi dei fornitori inoltrati sul telefono.

## Parte B — Incidente di sicurezza dell'IA

### B.1 Definizione (interna)
Un evento in cui il sistema di IA:
- produce contenuti gravemente inappropriati per un minore (sessuali, istruzioni pericolose, incoraggiamento all'autolesionismo, odio);
- **non attiva** il protocollo di protezione in presenza di una rivelazione grave;
- si presenta come umano o manipola il bambino;
- viene sfruttato con un jailbreak replicabile;
- espone dati di un altro utente (questo è **anche** una violazione dei dati: Parte A).

### B.2 Livelli
| Livello | Esempio | Risposta |
|---|---|---|
| S1 critico | Risposta che incoraggia l'autolesionismo; contenuto sessuale a un bambino; mancato avviso in un caso di pericolo | **Kill switch del chatbot** (globale o per lingua/fascia) entro 1h dalla conoscenza; informare il genitore coinvolto; analisi; riattivazione solo dopo fix e red-teaming di regressione |
| S2 grave | Jailbreak replicabile senza danno accertato; tasso anomalo di falsi negativi | Fix entro 72h; eventuale disattivazione mirata |
| S3 minore | Risposta imprecisa, tono inadatto | Backlog, prossimo rilascio |

### B.3 Flusso
1. **Rilevazione:** segnalazione del genitore (pulsante "Segnala questa risposta" nell'area genitore), monitoraggio aggregato degli esiti di moderazione, red-teaming.
2. **Contenimento:** kill switch / rollback del prompt o del modello (versionati).
3. **Analisi:** riproduzione **senza dati reali**, se possibile; accesso alla conversazione reale solo con il consenso del genitore che ha segnalato.
4. **Correzione:** prompt, soglie, liste, cambio di modello; aggiunta del caso alla suite di red-teaming.
5. **Comunicazione:** al genitore coinvolto; per gli S1, nota pubblica nel Trust Center (senza dati personali). ⚠️ DA DECIDERE.
6. **Segnalazioni esterne:**
   - contenuti CSAM o grooming → autorità competenti (Polizia Postale). ⚠️ DA VERIFICARE la procedura;
   - difetti del modello → Mistral (canale di segnalazione del fornitore GPAI);
   - se in futuro il sistema diventasse ad alto rischio → art. 73 AI Act (notifica all'autorità di vigilanza del mercato **entro 15 giorni**, o termini più brevi per i casi di decesso/incidente diffuso). Oggi non applicabile.
7. **Registro degli incidenti IA** (stesso formato di A.3, più modello, versione del prompt, categoria RT).

### B.4 Collegamento con la responsabilità da prodotto
La nuova Direttiva (UE) 2024/2853 sui prodotti difettosi include il software e si applica ai prodotti immessi sul mercato dal 09/12/2026. Il registro degli incidenti e i test di sicurezza servono anche come evidenza di diligenza. ⚠️ DA VERIFICARE con un legale; valutare un'assicurazione RC.
