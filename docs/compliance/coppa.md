# Prontezza per gli USA — COPPA e normative statali — [NOME APP]

> Stato: BOZZA v0.1 — 04/10/2026. Il lancio USA è **successivo** a UE/CH/UK. Questo documento esiste per non dimenticare cosa va cambiato **prima** di aprire il servizio a utenti USA.
> **Fino ad allora: geo-blocco o esclusione esplicita degli utenti USA** (paese dichiarato all'iscrizione + controllo IP soft). ⚠️ DA DECIDERE.
> Non è consulenza legale USA: serve un avvocato statunitense (privacy/FTC) prima del lancio. ⚠️ DA VERIFICARE.

## 1. Applicabilità
- **COPPA** (15 U.S.C. §§ 6501-6506) e **COPPA Rule** (16 C.F.R. Part 312) si applicano agli operatori di siti/servizi online **diretti ai minori di 13 anni** che raccolgono informazioni personali da bambini negli USA, anche se l'operatore è straniero.
- [NOME APP] è **"directed to children"** per contenuto, target e mascotte: COPPA si applica pienamente. Non può usare il modello "mixed audience" né l'age-screening per escludere i bambini.
- **Cos'è "personal information"** per COPPA (come modificata nel 2025): comprende identificativi persistenti (cookie, ID dispositivo, ID profilo), **file audio con la voce del bambino**, foto/video, dati biometrici (anche voiceprint), testo libero che contiene dati identificativi. Anche nickname + ID persistente rientrano.

## 2. Regola modificata del 2025 — date
- Pubblicata nel Federal Register il **22/04/2025**, in vigore dal **23/06/2025**.
- **Conformità obbligatoria dal 22/04/2026** (alcune disposizioni sui programmi Safe Harbor hanno date diverse). Al 04/10/2026 la regola modificata è pienamente applicabile.

## 3. Requisiti e gap rispetto all'impianto UE

| # | Requisito COPPA (16 CFR 312) | Impianto UE attuale | Gap / azione prima del lancio USA |
|---|---|---|---|
| C1 | **Online notice** (§312.4(d)): informativa pubblica completa, con elenco dei terzi (per nome o categoria), finalità, **politica di conservazione scritta**, diritti del genitore | Informativa per genitori GDPR | Versione USA dell'informativa con le sezioni COPPA (operatore, contatti, categorie di terzi, retention, diritti) |
| C2 | **Direct notice al genitore** prima della raccolta (§312.4(b)-(c)) | Flusso di consenso nell'onboarding | Email di "direct notice" con i contenuti richiesti e link all'informativa |
| C3 | **Consenso verificabile del genitore (VPC)** prima di qualunque raccolta (§312.5) | Email + magic link + dichiarazione (insufficiente per COPPA) | **Gap principale.** Metodi ammessi (§312.5(b)(2)), tra cui: modulo firmato; **transazione con carta/sistema di pagamento** che notifica ogni transazione; numero verde/videochiamata con personale addestrato; documento d'identità verificato e poi cancellato; **domande knowledge-based**; **confronto facciale** tra documento e selfie (aggiunto nel 2025); **"text plus"** via SMS (aggiunto nel 2025, ammesso solo senza divulgazione a terzi). "**Email plus**" ammesso solo se i dati sono usati internamente e non divulgati. ⚠️ DA DECIDERE: la trasmissione dei prompt a OpenRouter/Mistral si può qualificare come "support for internal operations" / fornitori di servizi? Se no, serve un metodo forte. **Raccomandazione:** fornitore VPC specializzato (es. programmi Safe Harbor come PRIVO, kidSAFE, oppure una micro-transazione con carta rimborsata), ⚠️ DA VERIFICARE |
| C4 | **Consenso separato per la divulgazione a terzi** non essenziale al servizio (novità 2025) | Nessuna divulgazione a terzi oltre ai responsabili | Confermare che l'unica condivisione è con fornitori "integrali" al servizio; dichiararli. Nessuna pubblicità: niente consenso per targeted ads |
| C5 | **Diritti del genitore** (§312.6): rivedere i dati, cancellarli, revocare il consenso a ulteriore raccolta | Già nell'area genitore | Allineare i testi e la verifica dell'identità |
| C6 | **Non condizionare** la partecipazione a più dati del necessario (§312.7) | Minimizzazione | OK, da documentare |
| C7 | **Programma di sicurezza scritto** (§312.8, rafforzato nel 2025): responsabile designato, valutazione annuale dei rischi, salvaguardie, test, verifica dei fornitori | Misure tecniche, ma niente programma formale | Redigere un *Written Information Security Program* (WISP) |
| C8 | **Conservazione** (§312.10, 2025): solo per il tempo ragionevolmente necessario; **politica scritta** pubblicata nell'informativa, con finalità, necessità e tempi; vietata la conservazione indefinita | Chat 90 gg, audio 0 | Pubblicare la politica (estratto di `data-retention.md`) |
| C9 | **Eccezione audio** | L'audio non viene mai salvato | Si può collegare all'eccezione per i file audio usati solo per rispondere alla richiesta del bambino e cancellati subito (prassi FTC 2017, codificata nella regola 2025 secondo le fonti consultate, ⚠️ DA VERIFICARE nel testo del CFR). **La trascrizione testuale resta PI se contiene identificativi**, quindi serve comunque il VPC per la chat |
| C10 | **Identificativi persistenti** per "support for internal operations" | ID di profilo interni | OK senza VPC solo per supporto interno; ma la chat raccoglie altro PI, quindi VPC comunque |
| C11 | **Safe Harbor** (opzionale) | — | Valutare l'adesione (PRIVO, kidSAFE, CARU, iKeepSafe…): dà certezza e aiuta anche con il VPC |
| C12 | Sanzioni civili | — | Fino a ~US$ 53.088 per violazione (importo 2025, rivalutato ogni anno, ⚠️ DA VERIFICARE) |

## 4. Normative statali e federali correlate (⚠️ DA VERIFICARE con un legale USA al momento del lancio)
- **California SB 243** (in vigore dal 01/01/2026): obblighi per i "companion chatbot" verso i minori, tra cui disclosure IA, promemoria di pausa, protocollo per suicidio e autolesionismo con rinvio a servizi di crisi, blocco dei contenuti sessuali, report annuali. ⚠️ DA VERIFICARE se una mascotte educativa rientra nella definizione di "companion chatbot". Le esclusioni riguardano bot per assistenza clienti o funzioni limitate. Le misure di `safety-policy.md` coprono già buona parte dei requisiti.
- **FTC 6(b) (settembre 2025)**: indagine conoscitiva sui chatbot "companion" e i minori. Segnale di priorità di enforcement.
- **Leggi statali sulla privacy dei consumatori** che trattano i dati dei minori di 13 anni come "sensitive data" (es. Virginia, Colorado, Connecticut…) e **Kids Codes / AADC** statali (Maryland; California AADC con contenzioso aperto). ⚠️ DA VERIFICARE lo stato.
- **California Digital Age Assurance Act (AB 1043)** e simili leggi sui segnali d'età dai sistemi operativi: possibile impatto su una PWA. ⚠️ DA VERIFICARE.
- **COPPA 2.0 / KOSA** (proposte federali): monitorare.
- **Accessibilità** (ADA): buona pratica WCAG 2.2 AA (vale anche per la European Accessibility Act in UE: ⚠️ DA VERIFICARE l'applicabilità, perché le microimprese che forniscono servizi sono esenti).

## 5. Questioni contrattuali per gli USA
- **Mistral Commercial Terms §2.2(c):** vieta di inserire PI di **minori di 13 anni** come Customer Data. Per gli USA il conflitto è identico a quello UE. Serve un addendum.
- **OpenRouter:** ToS 18+ (vale per il titolare dell'account), clausola "Sensitive Data" del DPA. Le leggi statali che definiscono "sensitive" i dati dei minori di 13 anni rientrano nella lettera (f) della definizione.
- **Fornitore VPC:** DPA e verifica che i documenti d'identità e i selfie vengano cancellati subito.

## 6. Checklist pre-lancio USA
- [ ] Parere di un legale USA (COPPA + Stati chiave)
- [ ] Metodo VPC scelto e implementato (+ fornitore e DPA)
- [ ] Direct notice e online notice versione USA
- [ ] WISP scritto e responsabile della sicurezza designato
- [ ] Politica di conservazione pubblicata
- [ ] Verifica SB 243 e altre leggi statali sui chatbot
- [ ] Addendum Mistral/OpenRouter valido anche per gli USA
- [ ] Helpline USA configurate (988 ecc.) e verificate
- [ ] Decisione sul Safe Harbor
- [ ] Rimozione del geo-blocco
