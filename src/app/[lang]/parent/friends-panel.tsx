import { avatarById } from "@/config/characters";
import type { Dictionary } from "@/i18n";
import { fmt } from "@/i18n/format";
import { friendsOf } from "@/lib/friends";
import { supabaseServer } from "@/lib/supabase/server";
import { createInvite, endFriendship, redeemInvite } from "./actions";

type Kid = { id: string; nickname: string; avatar: string };

const results: Record<string, keyof Dictionary["parent"]["friends"]> = {
  connected: "connected",
  invalid: "invalid",
  same: "sameFamily",
  already: "already",
};

export async function FriendsPanel({ lang, kids, t, result }: { lang: string; kids: Kid[]; t: Dictionary; result?: string }) {
  const f = t.parent.friends;
  const supabase = await supabaseServer();
  const { data: invites } = await supabase
    .from("friend_invites")
    .select("code, child_id, expires_at")
    .is("used_at", null)
    .gt("expires_at", new Date().toISOString());
  const perChild = await Promise.all(kids.map(async (k) => ({ kid: k, friends: await friendsOf(k.id) })));
  const message = result ? results[result] : undefined;

  return (
    <section id="friends" className="card flex flex-col gap-5 p-6">
      <h2 className="font-display text-2xl font-bold">🤝 {f.title}</h2>
      <p className="text-ink-soft">{f.intro}</p>
      {message && (
        <p className={`rounded-2xl p-3 font-bold ${result === "connected" ? "bg-mint/15 text-mint-dark" : "bg-danger/10 text-danger"}`}>
          {f[message]}
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <form action={createInvite.bind(null, lang)} className="flex flex-col gap-3 rounded-2xl bg-cream p-4">
          <label className="flex flex-col gap-2 font-bold">
            {f.create}
            <select name="childId" className="field" required>
              {kids.map((k) => (
                <option key={k.id} value={k.id}>{k.nickname}</option>
              ))}
            </select>
          </label>
          <button className="btn btn-primary w-fit !min-h-11 !text-base">🔑 {f.createButton}</button>
          {invites?.map((inv) => {
            const kid = kids.find((k) => k.id === inv.child_id);
            return (
              <div key={inv.code} className="rounded-2xl bg-paper p-4 text-center">
                <p className="text-sm text-ink-soft">{fmt(f.code, { name: kid?.nickname ?? "" })}</p>
                <p className="font-display text-4xl font-extrabold tracking-[0.2em] select-all">{inv.code}</p>
                <p className="mt-1 text-xs text-ink-soft">{f.codeHint}</p>
              </div>
            );
          })}
        </form>

        <form action={redeemInvite.bind(null, lang)} className="flex flex-col gap-3 rounded-2xl bg-cream p-4">
          <p className="font-bold">{f.redeem}</p>
          <input
            name="code"
            required
            maxLength={9}
            autoComplete="off"
            autoCapitalize="characters"
            placeholder={f.redeemPlaceholder}
            className="field text-center font-display text-2xl tracking-[0.2em] uppercase"
          />
          <label className="flex flex-col gap-2 font-bold">
            {f.redeemFor}
            <select name="childId" className="field" required>
              {kids.map((k) => (
                <option key={k.id} value={k.id}>{k.nickname}</option>
              ))}
            </select>
          </label>
          <button className="btn btn-coral w-fit !min-h-11 !text-base">🤝 {f.redeemButton}</button>
        </form>
      </div>

      <ul className="flex flex-col gap-3">
        {perChild.map(({ kid, friends }) => (
          <li key={kid.id} className="flex flex-col gap-2">
            <span className="font-bold">{avatarById(kid.avatar).emoji} {kid.nickname}</span>
            {friends.length === 0 ? (
              <span className="text-sm text-ink-soft">{f.none}</span>
            ) : (
              <div className="flex flex-wrap gap-2">
                {friends.map((fr) => {
                  const a = avatarById(fr.friend.avatar);
                  return (
                    <span key={fr.friendshipId} className="flex items-center gap-2 rounded-full py-1 pr-2 pl-1" style={{ background: a.color }}>
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/60">{a.emoji}</span>
                      <span className="font-bold">{fr.friend.nickname}</span>
                      {fr.status === "blocked" ? (
                        <span className="rounded-full bg-white/70 px-2 text-xs">{f.blocked}</span>
                      ) : (
                        <form action={endFriendship.bind(null, lang, fr.friendshipId)}>
                          <button className="rounded-full bg-white/70 px-2 text-xs font-bold text-danger" aria-label={f.remove}>✕ {f.remove}</button>
                        </form>
                      )}
                    </span>
                  );
                })}
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
