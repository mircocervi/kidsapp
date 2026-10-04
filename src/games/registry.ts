import type { GameDef } from "./types";
import { count, sums, times } from "./math";
import { colorsShapes, letters, oddOne, vocabulary } from "./words";
import { science } from "./science";

// Per aggiungere un gioco: definirlo con generate(level, locale) e registrarlo qui.
export const games: GameDef[] = [count, colorsShapes, letters, oddOne, sums, vocabulary, science, times];

export const gameById = (id: string) => games.find((g) => g.id === id);

export const gamesForLevel = (level: number) => games.filter((g) => level >= g.minLevel && level <= g.maxLevel);

/** Livello effettivo: quello della classe, limitato all'intervallo del gioco. */
export const clampLevel = (g: GameDef, level: number) => Math.min(g.maxLevel, Math.max(g.minLevel, level));
