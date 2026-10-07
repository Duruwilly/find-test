// Keep a creator's edit tokens in this browser so they can revoke cards later (no accounts in MVP).
export function saveToken(code: string, token: string) {
  try {
    const all = JSON.parse(localStorage.getItem("findme_tokens") ?? "{}");
    all[code] = token;
    localStorage.setItem("findme_tokens", JSON.stringify(all));
  } catch {}
}

export function getToken(code: string): string | null {
  try {
    return JSON.parse(localStorage.getItem("findme_tokens") ?? "{}")[code] ?? null;
  } catch {
    return null;
  }
}
