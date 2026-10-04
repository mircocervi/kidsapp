// Avatar dei profili e mascotte del chatbot. Solo emoji: niente foto, niente asset di terzi.

export const avatars = [
  { id: "fox", emoji: "🦊", color: "#FFB27A" },
  { id: "panda", emoji: "🐼", color: "#C9D6E8" },
  { id: "tiger", emoji: "🐯", color: "#FFD66B" },
  { id: "frog", emoji: "🐸", color: "#A8E6A1" },
  { id: "unicorn", emoji: "🦄", color: "#F5B8E6" },
  { id: "octopus", emoji: "🐙", color: "#FF9EAA" },
  { id: "koala", emoji: "🐨", color: "#D3D3E8" },
  { id: "lion", emoji: "🦁", color: "#FFC872" },
  { id: "monkey", emoji: "🐵", color: "#E8C39E" },
  { id: "penguin", emoji: "🐧", color: "#A9DDF5" },
  { id: "turtle", emoji: "🐢", color: "#B8E0A0" },
  { id: "butterfly", emoji: "🦋", color: "#B9C8FF" },
] as const;

export type AvatarId = (typeof avatars)[number]["id"];
export const avatarById = (id: string) => avatars.find((a) => a.id === id) ?? avatars[0];

// Nomi pensati per suonare bene in tutte le lingue. La personalità entra nel prompt di sistema.
export const mascots = [
  { id: "pip", name: "Pip", emoji: "🦉", color: "#FFD66B", trait: "a wise and gentle little owl who loves books and stars" },
  { id: "zuri", name: "Zuri", emoji: "🐲", color: "#A8E6A1", trait: "a cheerful little dragon who loves science experiments and nature" },
  { id: "bo", name: "Bo", emoji: "🤖", color: "#A9DDF5", trait: "a friendly little robot who loves numbers, puzzles and inventions" },
  { id: "luna", name: "Luna", emoji: "🐱", color: "#F5B8E6", trait: "a curious cat explorer who loves stories, art and faraway places" },
] as const;

export type MascotId = (typeof mascots)[number]["id"];
export const mascotById = (id: string | null | undefined) => mascots.find((m) => m.id === id) ?? null;
