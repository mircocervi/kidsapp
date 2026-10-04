@AGENTS.md

# Wondimo — note per Claude

- Porta app **5600**; Supabase locale 5610 (API), 5611 (DB), 5612 (Studio), 5613 (Mailpit). Avvio: `npx supabase start` + `npm run dev` (o preview "kidsapp" in `.claude/launch.json`).
- Repo **pubblico**: mai committare `.env` o chiavi. Lavoro su `dev`, mai push su `main` senza richiesta esplicita.
- Ogni chiamata AI passa da `src/lib/ai/openrouter.ts` (routing ZDR + `mistral/eu`). Non inviare mai al modello identificativi del genitore o del bambino (neanche il soprannome).
- Cambiare modelli, provider, dati raccolti o retention richiede di aggiornare `docs/compliance/` (subprocessors, ropa, dpia, ai-act) e i testi pubblici in `docs/compliance/public/`.
- I livelli dei giochi sono **suggerimenti al genitore**: niente voti automatici o decisioni sul livello scolastico (vincolo AI Act, vedi `docs/compliance/ai-act.md`).
- Account di test locale: email `genitore.test@example.com`, PIN `2468` (solo DB locale).
- Dopo modifiche allo schema: nuova migrazione in `supabase/migrations/`, poi `npx supabase migration up` e `npx supabase gen types typescript --local > src/lib/supabase/database.types.ts`.
- Repo GitHub `mircocervi/wondimo` (ex kidsapp); cartella locale ancora `~/projects/prv/kidsapp`. GCP: progetto `wondimo`, account `mirco@mircocervi.it`.
- Beta su invito: per invitare qualcuno `insert into public.beta_invites (email) values ('...')` (hook Supabase `before_user_created`).
- Seconda famiglia di test locale (amici): `genitore.due@example.com`, PIN `2468`, figlia "Giulia" (2ª elementare).
