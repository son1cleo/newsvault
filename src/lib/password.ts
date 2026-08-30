import argon2 from "argon2";

// Node-only (native bindings). Never import this from middleware or edge routes.
export function hashPassword(password: string) {
  return argon2.hash(password, { type: argon2.argon2id });
}

export function verifyPassword(hash: string, password: string) {
  return argon2.verify(hash, password);
}
