import "server-only";
import { createHmac, randomBytes, scrypt as scryptCb, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";

// L'area genitore è protetta da un PIN anche sul dispositivo del bambino, dove la sessione
// del genitore resta aperta. Lo sblocco dura 15 minuti ed è un cookie httpOnly firmato.

const scrypt = promisify(scryptCb) as (pwd: string, salt: Buffer, len: number) => Promise<Buffer>;
const COOKIE = "parent_unlock";
const TTL_SECONDS = 15 * 60;

export async function hashPin(pin: string) {
  const salt = randomBytes(16);
  const key = await scrypt(pin, salt, 32);
  return `scrypt$${salt.toString("hex")}$${key.toString("hex")}`;
}

export async function verifyPin(pin: string, stored: string | null) {
  if (!stored) return false;
  const [, saltHex, keyHex] = stored.split("$");
  const key = await scrypt(pin, Buffer.from(saltHex, "hex"), 32);
  return timingSafeEqual(key, Buffer.from(keyHex, "hex"));
}

export const isValidPin = (pin: string) => /^\d{4}$/.test(pin);

function sign(payload: string) {
  return createHmac("sha256", process.env.PARENT_UNLOCK_SECRET!).update(payload).digest("hex");
}

export async function setUnlocked(userId: string) {
  const exp = Math.floor(Date.now() / 1000) + TTL_SECONDS;
  const payload = `${userId}.${exp}`;
  (await cookies()).set(COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: TTL_SECONDS,
  });
}

export async function isUnlocked(userId: string) {
  const value = (await cookies()).get(COOKIE)?.value;
  if (!value) return false;
  const [id, exp, sig] = value.split(".");
  if (id !== userId || Number(exp) < Date.now() / 1000) return false;
  const expected = sign(`${id}.${exp}`);
  return sig.length === expected.length && timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
}

export async function lock() {
  (await cookies()).delete(COOKIE);
}
