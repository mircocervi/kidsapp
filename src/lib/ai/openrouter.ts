import "server-only";

/**
 * Unico punto di uscita verso i modelli. Ogni richiesta è vincolata a:
 * - endpoint zero-data-retention (zdr) e senza raccolta dati per training (data_collection: deny);
 * - solo il provider Mistral AI (UE), senza fallback verso altri provider.
 * Nessun identificativo del genitore o del bambino viene inviato al provider.
 */
export const EU_ZDR_ROUTING = {
  zdr: true,
  data_collection: "deny",
  only: ["mistral"],
  allow_fallbacks: false,
} as const;

// Modelli ammessi in produzione: open-weight, serviti da Mistral in UE con ZDR.
// Cambiarli richiede di aggiornare docs/compliance/subprocessors.md e ai-act.md.
export const ALLOWED_MODELS = [
  "mistralai/mistral-small-2603",
  "mistralai/mistral-small-3.2-24b-instruct",
  "mistralai/ministral-14b-2512",
  "mistralai/ministral-8b-2512",
  "mistralai/ministral-3b-2512",
] as const;

function pick(envValue: string | undefined, fallback: (typeof ALLOWED_MODELS)[number]) {
  return envValue && (ALLOWED_MODELS as readonly string[]).includes(envValue) ? envValue : fallback;
}

export const MODELS = {
  /** Risposte ai bambini. */
  chat: pick(process.env.AI_CHAT_MODEL, "mistralai/mistral-small-2603"),
  /** Classificatore di sicurezza su domanda e risposta. */
  guard: pick(process.env.AI_GUARD_MODEL, "mistralai/ministral-8b-2512"),
};

export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export async function complete(opts: {
  model: string;
  messages: ChatMessage[];
  maxTokens?: number;
  temperature?: number;
  json?: boolean;
  timeoutMs?: number;
}) {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    signal: AbortSignal.timeout(opts.timeoutMs ?? 20_000),
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: opts.model,
      provider: EU_ZDR_ROUTING,
      messages: opts.messages,
      max_tokens: opts.maxTokens ?? 400,
      temperature: opts.temperature ?? 0.4,
      ...(opts.json ? { response_format: { type: "json_object" } } : {}),
    }),
  });
  if (!res.ok) throw new Error(`OpenRouter ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const data = await res.json();
  const content: string | undefined = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("OpenRouter: risposta vuota");
  return { content: content.trim(), model: data.model as string, provider: data.provider as string };
}
