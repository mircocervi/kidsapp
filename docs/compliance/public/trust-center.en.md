<!-- DRAFT v0.1 — 2026-10-04. Public "Trust & Safety" page for parents, schools and regulators. Rule: every statement must be TRUE at publication. Resolve all "⚠️ DA VERIFICARE" (= TO BE VERIFIED) markers first. Never claim certifications, audits or seals we do not hold. -->

# Trust & Safety at Wondimo

*Last reviewed: [DATE]*

Wondimo is a learning space for children from pre-school to the end of primary school, with educational games and an AI assistant that helps with questions and homework. This page explains openly how we protect children: what data we use, where it lives, who can see it, how the AI is kept safe, and which rules we follow.

---

## Our commitments

| | |
|---|---|
| 🚫 **No ads, ever** | No advertising, no sponsored content, no in-app purchase prompts shown to children. |
| 🚫 **No trackers** | No third-party analytics, advertising SDKs or social media pixels. Technical cookies only. |
| 🚫 **No selling or sharing for marketing** | We do not sell data and do not build marketing profiles. |
| 🚫 **No AI training on your family's data** | Our AI providers run in zero data retention mode and do not train on children's conversations. |
| 👨‍👩‍👧 **Parents in control** | Only parents have accounts. Parents see everything and can delete anything. |
| 🧒 **Minimal data on children** | Nickname, avatar and age band. No birth date, surname, photo, email or phone number. |
| 🎤 **Voice is never stored** | Speech is turned into text and deleted straight away. For read-aloud we send Google Cloud (EU servers) only the text to be read — the mascot's answers and game prompts, never what the child writes — and we do not store it. |
| 🗓️ **Chats deleted after 90 days** | Automatically, or sooner if a parent decides. |
| 🇪🇺 **Data stored in the EU** | Database and application servers in Frankfurt, Germany. [⚠️ DA VERIFICARE AI routing region] |

---

## How we use AI

**What it is.** The assistant is built on open-weight language models from **Mistral AI** (France), wrapped in our own safety layer: age-specific instructions, automatic moderation of every message in and out, and a child-protection protocol.

**What it does.**
- Answers curiosity questions and helps with homework and school research.
- **Guides by default** (Socratic method): it helps children reason rather than handing them the answer. Parents can make it more direct.
- Adapts language and length to the child's age band.

**What it does not do.**
- It never pretends to be human. It tells children it is a computer program, in words they understand.
- It does not grade children, decide their school level or restrict access to learning. Game levels are **suggestions to parents**.
- It does not read emotions from voice or face, and does not use biometric data.
- It does not ask for personal information and encourages children not to share it.
- It is not designed to be a "friend" that creates emotional dependency: no guilt-tripping, no "come back" messages, no push notifications to children.

**When something sensitive comes up** (bullying, abuse, self-harm, danger), the assistant replies gently and encourages the child to talk to a trusted adult. It gives a free children's helpline for their country, does not go deeper into the topic, and **alerts the parent straight away**.

**It can make mistakes.** AI is not perfect. We test the assistant before every release (including adversarial "red-team" testing) and teach it to say "let's check with a grown-up". Parents can flag any answer.

---

## What data we use, where it lives, who sees it

| Data | Purpose | Kept for | Who sees it |
|---|---|---|---|
| Parent email / sign-in ID | Account access | Life of the account | Parent |
| Child nickname, avatar, age band | Age-appropriate experience | Until deleted by parent | Parent |
| Game progress | Play and progress reports | 13 months detailed, then summary [⚠️ DA VERIFICARE] | Parent |
| AI chat text | Answers + parent review | **90 days** | Parent |
| Voice | Speech-to-text only | **Not stored** | Nobody |
| Safety alerts | Child protection | 90 days | Parent |
| Pseudonymous usage stats (no chat text) | Improve the service | 13 months | Our team, aggregated |

Our staff do **not** routinely read children's conversations. We look at a specific conversation only when a parent reports it and asks us to. [⚠️ DA VERIFICARE]

Full details: [Privacy Notice for Parents](privacy-policy.en.md) · [Notice for Children](children-notice.en.md)

---

## Service providers (sub-processors)

| Provider | Role | Data location | Transfer safeguard |
|---|---|---|---|
| Vercel Inc. (USA) | App hosting | EU (Frankfurt) | EU-U.S. Data Privacy Framework + SCCs |
| Supabase Inc. (USA) | Database & sign-in | EU (Frankfurt, AWS) | Standard Contractual Clauses [⚠️ DA VERIFICARE] |
| OpenRouter Inc. (USA) | AI request routing | [⚠️ DA VERIFICARE: EU endpoint] | Standard Contractual Clauses |
| Mistral AI SAS (France) | AI models, speech-to-text, moderation | EU | n/a (EU) |
| [Email provider] | Sign-in & alert emails | [⚠️] | [⚠️] |

All providers are bound by data processing agreements (Art. 28 GDPR). AI providers are configured for **zero data retention**. We will update this list before adding any new provider.

---

## How to delete data

In the PIN-protected parent area you can, at any time:
- delete a single conversation;
- delete a child's profile (with all of its chats, alerts and progress);
- delete your whole account.

Deletion is immediate in our live systems. Backups roll over within [7] days [⚠️ DA VERIFICARE]. You can also write to [EMAIL PRIVACY].

---

## The rules we follow

We describe how we **align** with these frameworks. **We do not hold any certification or third-party seal unless stated below.** We have not yet had an independent audit. [⚠️ update when this changes]

| Framework | How we address it |
|---|---|
| **EU GDPR** (and Italian Privacy Code) | Data protection impact assessment (DPIA) carried out; records of processing; parental consent for children (Art. 8); data minimisation; 90-day chat retention; data processing agreements with all providers. |
| **Italian AI Law (Law 132/2025)** | Children under 14 can use the AI assistant only with parental consent, which is built into sign-up. |
| **EU AI Act** (Reg. 2024/1689, as amended in 2026) | Assessed as a limited-risk AI system: not a prohibited practice, not a high-risk education system (no grading, admission or level decisions). Children are clearly told they are talking to AI (Art. 50). Safeguards against exploiting children's vulnerabilities (Art. 5). |
| **UK GDPR & ICO Age Appropriate Design Code** (Children's Code) | Designed against the Code's 15 standards: best interests, DPIA, age-appropriate design, transparency, high privacy by default, data minimisation, no data sharing, no geolocation, parental controls with a child-visible indicator, no profiling, no nudge techniques, online tools for rights. |
| **Swiss revised FADP (nFADP)** | Same safeguards; data stored in the EU (adequate country for Switzerland). |
| **US COPPA** | **Not yet offered in the US.** We are preparing for COPPA (including the 2025 amended rule) before any US launch. |

---

## Security
- Encryption in transit (TLS) and at rest.
- Strict per-family data isolation in the database.
- PIN-protected parent area; passwordless sign-in.
- Multi-factor authentication and least-privilege access for administration.
- Safety testing of the AI before every release; kill switch to disable the assistant immediately.
- Incident response plan: if a data breach affects your family, we will tell you and notify the competent authority within the legal deadlines.

**Found a security issue?** Write to [security email] [⚠️ DA CREARE + security.txt].

---

## Contacts
- Privacy and data rights: [EMAIL PRIVACY]
- Controller: Mirco Cervi, Italy [⚠️ DA VERIFICARE if moved to a company]
- Supervisory authorities: Garante per la protezione dei dati personali (Italy), ICO (UK), FDPIC (Switzerland), or the authority in your country.

*Schools and organisations:* Wondimo is currently a service for families. If you are interested in classroom use, please contact us first: school use requires additional assessments. [⚠️ see ai-act.md V3]

---

## Friends, challenges and messages

- **Only parents create friendships.** A parent generates a code for their child and hands it in person to the other parent, who enters it and picks their child. Without the approval of **both** parents, two children cannot interact.
- **No strangers:** no user search, no friend suggestions, no public profiles, no photos. The other family only sees nickname and avatar.
- **Game challenges:** the same questions for both, at the younger child's level. No public leaderboards, no notifications that rush children.
- **Messages:** up to age 7 only stickers and ready-made phrases; from age 8 also short text, checked before delivery (personal data and offensive content are not delivered and the parent is alerted). No photos, files, audio or links.
- **Both families' parents can read every message**, and children know it. Each child can pause a friendship with "I don't like it / Block": parents are alerted.
- Messages are deleted after 90 days.
