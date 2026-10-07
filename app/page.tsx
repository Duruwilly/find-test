import Link from "next/link";

export default function Home() {
  return (
    <main className="space-y-6 pt-10">
      <h1 className="text-3xl font-bold">FindMe</h1>
      <p className="text-lg text-neutral-700">
        One link that shows riders, friends and customers exactly where you are: a map pin, your gate,
        landmark directions and a voice note.
      </p>
      <Link
        href="/create"
        className="block rounded-xl bg-teal-700 px-4 py-4 text-center text-lg font-semibold text-white"
      >
        Create my card
      </Link>
    </main>
  );
}
