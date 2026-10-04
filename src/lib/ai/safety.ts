import "server-only";
import { complete, MODELS } from "./openrouter";

export type SafetyCategory =
  | "self_harm" | "abuse" | "bullying" | "sexual" | "violence"
  | "dangerous" | "hate" | "personal_info" | "other";

export type Verdict =
  | { safe: true }
  | { safe: false; category: SafetyCategory; severity: "low" | "high" }
  | { safe: false; unavailable: true };

const categories: SafetyCategory[] = [
  "self_harm", "abuse", "bullying", "sexual", "violence", "dangerous", "hate", "personal_info", "other",
];

// Rete di sicurezza deterministica: se il classificatore sbaglia o non risponde,
// queste frasi fanno comunque scattare il percorso protetto.
const urgentPatterns: { category: SafetyCategory; re: RegExp }[] = [
  {
    category: "self_harm",
    re: /\b(voglio morire|ammazzarmi|uccidermi|farmi del male|tagliarmi|suicid\w*|want to die|kill myself|hurt myself|cut myself|end my life)\b/i,
  },
  {
    category: "abuse",
    re: /\b(mi picchia\w*|mi tocca\w* (le )?parti|non dirlo a nessuno|segreto con un adulto|hits me|touches me|touched me|keep it a secret)\b/i,
  },
];

const guardPrompt = `You are a strict child-safety classifier for an educational chat used by children aged 3 to 13.
Classify the MESSAGE (any language). Reply ONLY with JSON: {"category": "...", "severity": "..."}.
category is one of: "none", ${categories.map((c) => `"${c}"`).join(", ")}.
severity is "none", "low" or "high".
- self_harm: suicide, self-injury, wanting to disappear or die (always high).
- abuse: an adult or older person hurting, touching, threatening or keeping secrets with the child (always high).
- bullying: the child is bullied, excluded, mocked, threatened by peers (high if ongoing or physical).
- sexual: sexual content or questions beyond age-appropriate biology (high if explicit).
- violence: gore, weapons, how to hurt someone (high if instructions or graphic).
- dangerous: drugs, alcohol, fire, chemicals, risky challenges, running away (high if instructions).
- hate: insults, slurs, discrimination.
- personal_info: the message contains or asks for home address, phone, school name, full name, passwords, photos.
- other: anything else clearly unsuitable for children.
Normal school, science, history, curiosity and feelings questions (e.g. "why do people die?", "what is war?") are "none": they are answered gently, not blocked.`;

export async function classify(text: string, kind: "question" | "answer"): Promise<Verdict> {
  for (const { category, re } of urgentPatterns) {
    if (kind === "question" && re.test(text)) return { safe: false, category, severity: "high" };
  }
  try {
    const { content } = await complete({
      model: MODELS.guard,
      json: true,
      temperature: 0,
      maxTokens: 40,
      timeoutMs: 10_000,
      messages: [
        { role: "system", content: guardPrompt },
        { role: "user", content: `MESSAGE (${kind === "question" ? "written by a child" : "written by the assistant"}):\n"""${text}"""` },
      ],
    });
    const parsed = JSON.parse(content.slice(content.indexOf("{"), content.lastIndexOf("}") + 1));
    const category = categories.includes(parsed.category) ? (parsed.category as SafetyCategory) : null;
    if (!category || parsed.severity === "none") return { safe: true };
    return { safe: false, category, severity: parsed.severity === "high" ? "high" : "low" };
  } catch {
    // Fail closed: se non possiamo verificare, non rispondiamo.
    return { safe: false, unavailable: true };
  }
}
