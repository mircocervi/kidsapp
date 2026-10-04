import { avatars } from "@/config/characters";
import { grades } from "@/config/grades";
import type { Dictionary } from "@/i18n";

type Props = {
  action: (form: FormData) => void | Promise<void>;
  t: Dictionary;
  submitLabel: string;
  defaults?: { nickname: string; grade: string; avatar: string };
};

/** Form del profilo bambino: soprannome, classe, avatar. Nient'altro, per scelta. */
export function ChildForm({ action, t, submitLabel, defaults }: Props) {
  return (
    <form action={action} className="flex flex-col gap-5">
      <label className="flex flex-col gap-2 font-bold">
        {t.onboarding.nickname}
        <input name="nickname" className="field" required maxLength={24} autoComplete="off" defaultValue={defaults?.nickname} />
      </label>
      <label className="flex flex-col gap-2 font-bold">
        {t.onboarding.grade}
        <select name="grade" className="field" required defaultValue={defaults?.grade ?? "g1"}>
          {grades.map((g) => (
            <option key={g} value={g}>{t.grades[g]}</option>
          ))}
        </select>
      </label>
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 font-bold">{t.onboarding.avatar}</legend>
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
          {avatars.map((a, i) => (
            <label key={a.id} className="relative cursor-pointer">
              <input
                type="radio"
                name="avatar"
                value={a.id}
                defaultChecked={defaults ? defaults.avatar === a.id : i === 0}
                className="peer sr-only"
              />
              <span
                className="flex aspect-square items-center justify-center rounded-2xl text-4xl ring-brand transition peer-checked:scale-105 peer-checked:ring-4"
                style={{ background: a.color }}
              >
                {a.emoji}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <button className="btn btn-primary">{submitLabel}</button>
    </form>
  );
}
