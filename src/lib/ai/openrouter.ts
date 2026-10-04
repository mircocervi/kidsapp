import "server-only";

/**
 * Unico punto di uscita verso i modelli. Ogni richiesta, per qualsiasi modello, è vincolata a:
 * - endpoint zero-data-retention (zdr) e senza raccolta dati per training (data_collection: deny);
 * - nessun fallback verso provider non conformi (OpenRouter rifiuta se non trova un endpoint ZDR);
 * - per i modelli Mistral, solo l'endpoint UE ("mistral/eu"; esistono anche endpoint "mistral/us").
 * Nessun identificativo del genitore o del bambino viene inviato al provider.
 *
 * BETA DI TEST: si usano prima i modelli gratuiti, con un modello Mistral UE economico come riserva
 * quando i free sono saturi (rispondono 429). Modelli configurabili da env senza toccare il codice:
 *   AI_CHAT_MODELS="qwen/qwen3.8-27b:free,mistralai/mistral-small-3.2-24b-instruct"
 *   AI_GUARD_MODELS="mistralai/ministral-8b-2512"
 * Cambiare modelli richiede di aggiornare docs/compliance/subprocessors.md e ai-act.md.
 */

const DEFAULT_CHAT = ["qwen/qwen3.8-27b:free", "mistralai/mistral-small-3.2-24b-instruct"];
const DEFAULT_GUARD = ["mistralai/ministral-8b-2512", "mistralai/mistral-small-3.2-24b-instruct"];

const fromEnv = (value: string | undefined, fallback: string[]) => {
  const list = value?.split(",").map((s) => s.trim()).filter(Boolean);
  return list?.length ? list : fallback;
};

export const MODELS = {
  /** Risposte ai bambini, in ordine di preferenza. */
  chat: fromEnv(process.env.AI_CHAT_MODELS, DEFAULT_CHAT),
  /** Classificatore di sicurezza su domanda e risposta, in ordine di preferenza. */
  guard: fromEnv(process.env.AI_GUARD_MODELS, DEFAULT_GUARD),
};

function routingFor(model: string) {
  return {
    zdr: true,
    data_collection: "deny",
    allow_fallbacks: false,
    ...(model.startsWith("mistralai/") ? { only: ["mistral/eu"] } : {}),
  };
}

export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

type Options = {
  models: string[];
  messages: ChatMessage[];
  maxTokens?: number;
  temperature?: number;
  json?: boolean;
  timeoutMs?: number;
};

async function callOnce(model: string, opts: Options) {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    signal: AbortSignal.timeout(opts.timeoutMs ?? 20_000),
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      provider: routingFor(model),
      messages: opts.messages,
      max_tokens: opts.maxTokens ?? 400,
      temperature: opts.temperature ?? 0.4,
      // Niente "ragionamento" nascosto: risposte brevi e veloci per bambini.
      reasoning: { enabled: false },
      ...(opts.json ? { response_format: { type: "json_object" } } : {}),
    }),
  });
  if (!res.ok) throw new Error(`OpenRouter ${model} ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const data = await res.json();
  const content: string | undefined = data.choices?.[0]?.message?.content;
  if (!content?.trim()) throw new Error(`OpenRouter ${model}: risposta vuota`);
  return { content: content.trim(), model: data.model as string, provider: data.provider as string };
}

/** Prova i modelli in ordine finché uno risponde (i free possono essere saturi o lenti). */
export async function complete(opts: Options) {
  let lastError: unknown;
  for (const model of opts.models) {
    try {
      return await callOnce(model, opts);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}
