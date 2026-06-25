// API key generation and hashing — Web Crypto, works in browser + workers.
// The plaintext key is shown to the user ONCE; only the SHA-256 hash is stored.

const PREFIX = "nak_live_";

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function generateApiKey(): { plaintext: string; prefix: string } {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  const body = toHex(bytes);
  const plaintext = `${PREFIX}${body}`;
  // Stored/displayed prefix: enough to identify the key without revealing it.
  const prefix = `${PREFIX}${body.slice(0, 4)}`;
  return { plaintext, prefix };
}

export async function hashApiKey(plaintext: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(plaintext));
  return toHex(new Uint8Array(buf));
}
