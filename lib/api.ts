export const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8002";
export const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001";

export type Card = {
  short_code: string;
  title: string | null;
  lat: number;
  lng: number;
  landmark_text: string | null;
  gate_photo_url: string | null;
  voice_note_url: string | null;
  is_public: boolean;
  created_at: string;
};

export type Created = {
  id: string;
  short_code: string;
  share_url: string;
  edit_token: string;
  created_at: string;
};

export async function getCard(code: string): Promise<Card | null> {
  const res = await fetch(`${API}/api/cards/${encodeURIComponent(code)}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function uploadMedia(kind: "photo" | "voice", file: Blob): Promise<string> {
  const fd = new FormData();
  fd.append("file", file, kind === "photo" ? "photo.jpg" : "voice.webm");
  const res = await fetch(`${API}/api/media/upload?kind=${kind}`, { method: "POST", body: fd });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).detail ?? "Upload failed");
  return (await res.json()).url;
}

export async function createCard(body: Record<string, unknown>): Promise<Created> {
  const res = await fetch(`${API}/api/cards`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).detail ?? "Could not create card");
  return res.json();
}

export async function sendCorrection(code: string, note: string): Promise<void> {
  const res = await fetch(`${API}/api/cards/${encodeURIComponent(code)}/corrections`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ note }),
  });
  if (!res.ok) throw new Error("Could not send correction");
}
