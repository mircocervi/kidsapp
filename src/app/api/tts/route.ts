import { z } from "zod";
import { currentParent } from "@/lib/supabase/server";
import { googleVoiceName, isVoiceId } from "@/config/voices";

// Lettura ad alta voce con Google Cloud Text-to-Speech, endpoint UE.
// Riceve solo il testo da leggere (risposte del bot già ripulite dai dati personali, frasi dei giochi):
// mai identificativi del bambino. Nessuna conservazione lato nostro.

const body = z.object({
  text: z.string().trim().min(1).max(1200),
  locale: z.string().max(5),
  voice: z.string().refine(isVoiceId),
});

export async function POST(request: Request) {
  if (!(await currentParent())) return new Response("unauthorized", { status: 401 });
  const parsed = body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return new Response("bad_request", { status: 400 });
  const { text, locale, voice } = parsed.data;

  const res = await fetch("https://eu-texttospeech.googleapis.com/v1/text:synthesize", {
    method: "POST",
    signal: AbortSignal.timeout(15_000),
    headers: { "x-goog-api-key": process.env.GOOGLE_TTS_API_KEY!, "Content-Type": "application/json" },
    body: JSON.stringify({
      input: { text },
      voice: googleVoiceName(locale, voice as Parameters<typeof googleVoiceName>[1]),
      audioConfig: { audioEncoding: "MP3" },
    }),
  }).catch(() => null);

  if (!res?.ok) return new Response("tts_unavailable", { status: 502 });
  const { audioContent } = (await res.json()) as { audioContent: string };
  return new Response(Buffer.from(audioContent, "base64"), {
    headers: { "Content-Type": "audio/mpeg", "Cache-Control": "private, max-age=86400" },
  });
}
