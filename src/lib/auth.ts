import { compare, hash } from "bcryptjs";
import { createHmac } from "crypto";

const SESSION_SECRET = process.env.SESSION_SECRET || "karto-dev-secret-change-in-production";
const COOKIE_NAME = "karto_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/** Hash a plaintext password using bcrypt. */
export async function hashPassword(password: string): Promise<string> {
  return hash(password, 10);
}

/** Verify a plaintext password against a bcrypt hash. */
export async function verifyPassword(password: string, hashStr: string): Promise<boolean> {
  return compare(password, hashStr);
}

/** Create a signed session token for a user id. */
export function createSessionToken(userId: string): string {
  const timestamp = Date.now();
  const payload = `${userId}.${timestamp}`;
  const sig = sign(payload);
  return `${payload}.${sig}`;
}

/** Verify a session token and return the user id, or null if invalid. */
export function verifySessionToken(token: string | undefined): string | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [userId, timestampStr, sig] = parts;
  const payload = `${userId}.${timestampStr}`;
  if (sign(payload) !== sig) return null;
  // check expiry
  const timestamp = Number(timestampStr);
  if (isNaN(timestamp)) return null;
  const age = Date.now() - timestamp;
  if (age > SESSION_MAX_AGE * 1000) return null;
  return userId;
}

function sign(payload: string): string {
  return createHmac("sha256", SESSION_SECRET).update(payload).digest("hex").slice(0, 32);
}

export { COOKIE_NAME, SESSION_MAX_AGE };
