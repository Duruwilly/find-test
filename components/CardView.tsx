import type { Card } from "@/lib/api";
import MapPin from "./MapPin";
import CorrectionForm from "./CorrectionForm";

export default function CardView({ card }: { card: Card }) {
  const gmaps = `https://www.google.com/maps/dir/?api=1&destination=${card.lat},${card.lng}`;
  const geo = `geo:${card.lat},${card.lng}?q=${card.lat},${card.lng}`;

  return (
    <article className="space-y-4">
      <h1 className="text-2xl font-bold">{card.title ?? "Find me here"}</h1>

      <MapPin lat={card.lat} lng={card.lng} />

      <div className="grid grid-cols-2 gap-2">
        <a href={geo} className="rounded-xl bg-teal-700 px-3 py-3 text-center font-semibold text-white">
          Open in Maps
        </a>
        <a href={gmaps} className="rounded-xl border border-teal-700 px-3 py-3 text-center font-semibold text-teal-800">
          Directions
        </a>
      </div>

      {card.landmark_text && (
        <section className="rounded-xl bg-white p-4 shadow-sm">
          <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide text-neutral-500">Directions</h2>
          <p className="whitespace-pre-line text-lg">{card.landmark_text}</p>
        </section>
      )}

      {card.voice_note_url && (
        <section className="rounded-xl bg-white p-4 shadow-sm">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-neutral-500">Voice note</h2>
          {/* preload="none" so no data is spent until the rider taps play */}
          <audio controls preload="none" src={card.voice_note_url} className="w-full" />
        </section>
      )}

      {card.gate_photo_url && (
        <section>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-neutral-500">The gate</h2>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={card.gate_photo_url} alt="Gate or entrance" loading="lazy" className="w-full rounded-xl" />
        </section>
      )}

      <CorrectionForm code={card.short_code} />
    </article>
  );
}
