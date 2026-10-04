# Wondimo

**wondimo.com** — PWA educativa per bambini da 3 a 13 anni: giochi per livello (infanzia → quinta elementare) e un amico AI che risponde alle domande con guardrail per età. Il genitore crea la famiglia, sceglie le impostazioni e vede tutto. Si installa dalla schermata Home di iPad, iPhone e Android: niente app store.

Privacy e AI Act fin dal progetto: vedi [docs/compliance](docs/compliance/README.md).

## Stack

- **Next.js 16** (App Router, TypeScript, Tailwind 4), porta **5600**
- **Supabase** (Postgres + auth via codice OTP, RLS per famiglia); in locale porte 5610–5619
- **AI** via OpenRouter, solo endpoint **Mistral UE zero-data-retention** (`src/lib/ai/openrouter.ts`)
- Hosting previsto: Vercel (funzioni in UE) + Supabase UE

## Avvio in locale

Prerequisiti: Node 22+, Docker Desktop acceso.

```bash
npm install
cp .env.example .env    # compila OPENROUTER_API_KEY; le chiavi Supabase le stampa il comando sotto
npx supabase start      # Postgres, auth, Studio (5612) e Mailpit (5613) in Docker
npm run dev             # http://localhost:5600
```

Il codice di accesso arriva nella casella di test **Mailpit**: http://127.0.0.1:5613

## Struttura

| Percorso | Cosa c'è |
|---|---|
| `src/app/[lang]/` | landing, login, onboarding, area bambini (`play`), area genitore (`parent`), pagine `trust` |
| `src/app/api/chat` | pipeline della chat: filtro dati personali → classificatore → modello → controllo risposta → log per il genitore |
| `src/lib/ai/` | client OpenRouter con routing vincolato, prompt per età, classificatore, risposte fisse per i casi delicati |
| `src/games/` | motore dei giochi: ogni gioco genera le domande per livello e lingua |
| `src/config/` | lingue, classi, avatar e mascotte, paesi di lancio, numeri di aiuto |
| `supabase/migrations/` | schema, RLS, cancellazione automatica (chat 90 giorni) |
| `docs/compliance/` | RoPA, DPIA, AI Act, sub-responsabili, safety policy, retention, COPPA, incidenti, testi pubblici |
| `docs/research/` | concorrenti, nomi e domini, confronto modelli |
| `scripts/compare-models.mjs` | confronto dei modelli open su domande di prova: `node --env-file=.env scripts/compare-models.mjs` |

## Aggiungere un gioco

Definire un `GameDef` in `src/games/` (con `generate(level, locale)`), registrarlo in `src/games/registry.ts`.

## Aggiungere una lingua

Aggiungere il codice in `src/config/app.ts`, il dizionario in `src/i18n/dictionaries/`, le traduzioni dei giochi e i testi in `docs/compliance/public/`.
