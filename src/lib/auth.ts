import * as jose from "jose";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "adil-hukuk-danismanlik-super-secret-key-2026-very-long-secret-key-to-meet-entropy";
const secretKey = new TextEncoder().encode(JWT_SECRET);

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

export function comparePassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

export async function signJWT(payload: { username: string }): Promise<string> {
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secretKey);
}

export async function verifyJWT(token: string): Promise<{ username: string } | null> {
  try {
    const { payload } = await jose.jwtVerify(token, secretKey);
    return payload as { username: string };
  } catch (error) {
    return null;
  }
}
