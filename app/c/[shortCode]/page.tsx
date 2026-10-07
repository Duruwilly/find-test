import type { Metadata } from "next";
import { getCard, API, SITE } from "@/lib/api";
import CardView from "@/components/CardView";
import ViewLogger from "@/components/ViewLogger";

type Props = { params: Promise<{ shortCode: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { shortCode } = await params;
  const card = await getCard(shortCode);
  if (!card) return { title: "Card not found" };
  const title = card.title ?? "Find me here";
  const description = card.landmark_text?.slice(0, 140) ?? "Tap for the map, gate photo and voice note.";
  return {
    title: `${title} · FindMe`,
    description,
    // The OG image makes WhatsApp show the gate photo in the link preview.
    openGraph: {
      title,
      description,
      url: `${SITE}/c/${shortCode}`,
      images: card.gate_photo_url ? [card.gate_photo_url] : [],
    },
    // Private cards must never be indexed by search engines.
    robots: card.is_public ? undefined : { index: false, follow: false },
  };
}

export default async function CardPage({ params }: Props) {
  const { shortCode } = await params;
  const card = await getCard(shortCode);

  if (!card)
    return (
      <main className="space-y-3 pt-10">
        <h1 className="text-2xl font-bold">Card not found</h1>
        <p className="text-neutral-700">This link may have been removed by its owner.</p>
      </main>
    );

  return (
    <main>
      <CardView card={card} />
      <ViewLogger code={shortCode} api={API} />
    </main>
  );
}
