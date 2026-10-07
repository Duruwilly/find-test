"use client";
import { useState } from "react";
import { createCard, uploadMedia } from "@/lib/api";
import { compressImage } from "@/lib/compress";
import { saveToken } from "@/lib/tokens";
import MapPin from "@/components/MapPin";
import VoiceRecorder from "@/components/VoiceRecorder";

export default function CreatePage() {
  const [title, setTitle] = useState("Home");
  const [pos, setPos] = useState<{ lat: number; lng: number; acc?: number } | null>(null);
  const [landmark, setLandmark] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [voice, setVoice] = useState<Blob | null>(null);
  const [isPublic, setIsPublic] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ url: string; code: string } | null>(null);

  function locate() {
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (p) => setPos({ lat: p.coords.latitude, lng: p.coords.longitude, acc: p.coords.accuracy }),
      () => setError("Could not get your location. Stand at your gate and allow location access."),
      { enableHighAccuracy: true, timeout: 15000 }
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!pos) return setError("Tap “Use my location” first, standing at your gate.");
    setBusy(true);
    setError(null);
    try {
      const gate_photo_url = photo ? await uploadMedia("photo", await compressImage(photo)) : null;
      const voice_note_url = voice ? await uploadMedia("voice", voice) : null;
      const card = await createCard({
        title,
        lat: pos.lat,
        lng: pos.lng,
        landmark_text: landmark || null,
        gate_photo_url,
        voice_note_url,
        is_public: isPublic,
      });
      saveToken(card.short_code, card.edit_token);
      setResult({ url: card.share_url, code: card.short_code });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  if (result) {
    const wa = `https://wa.me/?text=${encodeURIComponent(`Find me here: ${result.url}`)}`;
    return (
      <main className="space-y-4 pt-8">
        <h1 className="text-2xl font-bold">Your card is ready 🎉</h1>
        <p className="break-all rounded-lg bg-white p-3 font-mono">{result.url}</p>
        <a href={wa} className="block rounded-xl bg-green-600 px-4 py-4 text-center text-lg font-semibold text-white">
          Share on WhatsApp
        </a>
        <button
          onClick={() => navigator.clipboard.writeText(result.url)}
          className="w-full rounded-xl border border-neutral-300 px-4 py-3"
        >
          Copy link
        </button>
        <a href={`/c/${result.code}`} className="block text-center text-teal-800 underline">
          Preview my card
        </a>
      </main>
    );
  }

  return (
    <main>
      <form onSubmit={submit} className="space-y-5">
        <h1 className="text-2xl font-bold">Create your card</h1>

        <label className="block space-y-1">
          <span className="font-semibold">Name</span>
          <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={80}
            className="w-full rounded-lg border border-neutral-300 p-3" placeholder="Home, Shop, Office" />
        </label>

        <section className="space-y-2">
          <span className="font-semibold">1. Pin your location</span>
          <button type="button" onClick={locate} className="w-full rounded-xl bg-teal-700 px-4 py-3 font-semibold text-white">
            📍 Use my location (stand at your gate)
          </button>
          {pos && (
            <>
              <MapPin lat={pos.lat} lng={pos.lng} />
              {pos.acc !== undefined && (
                <p className="text-sm text-neutral-600">
                  Accuracy about {Math.round(pos.acc)}m.
                  {pos.acc > 50 && " That’s rough. Step outside or wait a moment, then tap again."}
                </p>
              )}
            </>
          )}
        </section>

        <label className="block space-y-1">
          <span className="font-semibold">2. Directions in your words</span>
          <textarea value={landmark} onChange={(e) => setLandmark(e.target.value)} maxLength={1000} rows={3}
            className="w-full rounded-lg border border-neutral-300 p-3"
            placeholder="Opposite the pharmacy, yellow gate, call me at the junction" />
        </label>

        <section className="space-y-2">
          <span className="font-semibold">3. Voice note (optional)</span>
          <VoiceRecorder onChange={setVoice} />
        </section>

        <label className="block space-y-1">
          <span className="font-semibold">4. Photo of your gate (optional)</span>
          <input type="file" accept="image/*" capture="environment"
            onChange={(e) => setPhoto(e.target.files?.[0] ?? null)} className="w-full" />
        </label>

        <label className="flex items-start gap-3 rounded-lg bg-white p-3">
          <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} className="mt-1 h-5 w-5" />
          <span>
            <span className="font-semibold">Public business card</span>
            <span className="block text-sm text-neutral-600">
              Lets search engines list this card. Leave off for your home.
            </span>
          </span>
        </label>

        {error && <p className="rounded-lg bg-red-50 p-3 text-red-700">{error}</p>}

        <button disabled={busy} className="w-full rounded-xl bg-neutral-900 px-4 py-4 text-lg font-semibold text-white disabled:opacity-60">
          {busy ? "Creating…" : "Create card"}
        </button>
      </form>
    </main>
  );
}
