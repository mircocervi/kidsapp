import { notFound } from "next/navigation";
import { isLocale } from "@/config/app";
import { mascotById, mascots } from "@/config/characters";
import { isVoiceFirst } from "@/config/grades";
import { getDictionary } from "@/i18n";
import { fmt } from "@/i18n/format";
import { requireChild } from "@/lib/kid";
import { KidGate } from "@/components/kid-gate";
import { ChatView } from "./chat-view";

export default async function ChatPage({ params }: PageProps<"/[lang]/play/[childId]/chat">) {
  const { lang, childId } = await params;
  if (!isLocale(lang)) notFound();
  const t = await getDictionary(lang);
  const { child, parent, supabase } = await requireChild(lang, childId);
  const mascot = mascotById(child.mascot) ?? mascots[0];

  // Ultimi messaggi di oggi, per riprendere il filo.
  const since = new Date();
  since.setHours(0, 0, 0, 0);
  const { data: history } = await supabase
    .from("chat_messages")
    .select("id, role, content")
    .eq("child_id", childId)
    .gte("created_at", since.toISOString())
    .order("created_at", { ascending: true })
    .limit(30);

  const texts = {
    intro: fmt(t.kid.mascotIntro, { mascot: mascot.name }),
    disclosure: fmt(t.kid.aiDisclosure, { mascot: mascot.name }),
    placeholder: t.kid.placeholder,
    send: t.kid.send,
    thinking: fmt(t.kid.thinking, { mascot: mascot.name }),
    listen: t.kid.listen,
    chatDisabled: t.kid.chatDisabled,
    rateLimited: t.kid.rateLimited,
    error: t.common.error,
    back: t.common.back,
  };

  return (
    <KidGate
      childId={childId}
      lang={lang}
      dailyLimitMinutes={parent.daily_limit_minutes}
      quietStart={parent.quiet_hours_start}
      quietEnd={parent.quiet_hours_end}
      texts={{ timeUp: t.kid.timeUp, quietHours: t.kid.quietHours, parentArea: t.kid.parentArea }}
    >
      <ChatView
        lang={lang}
        childId={childId}
        mascot={{ id: mascot.id, name: mascot.name, emoji: mascot.emoji, color: mascot.color }}
        readAloud={isVoiceFirst(child.grade)}
        enabled={child.chat_enabled}
        initial={(history ?? []).map((m) => ({ id: m.id, role: m.role, content: m.content }))}
        t={texts}
      />
    </KidGate>
  );
}
