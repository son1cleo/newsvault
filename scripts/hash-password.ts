import { hashPassword } from "../src/lib/password";

const password = process.argv[2];
if (!password) {
  console.error("Usage: npx tsx scripts/hash-password.ts <password>");
  process.exit(1);
}

hashPassword(password).then((hash) => {
  // Base64-encoded so the literal $ delimiters in an argon2 hash never
  // collide with Next.js's env-file $VAR expansion.
  const encoded = Buffer.from(hash, "utf8").toString("base64");
  console.log("\nADMIN_PASSWORD_HASH=" + JSON.stringify(encoded) + "\n");
});
