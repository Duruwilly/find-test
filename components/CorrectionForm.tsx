"use client";
import { useState } from "react";
import { sendCorrection } from "@/lib/api";

export default function CorrectionForm({ code }: { code: string }) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    try {
      await sendCorrection(code, note);
      setState("done");
    } catch {
      setState("error");
    }
  }

  if (state === "done")
    return <p className="rounded-lg bg-teal-50 p-3 text-teal-900">Thanks! Your correction will help the next rider.</p>;

  if (!open)
    return (
      <button onClick={() => setOpen(true)} className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-neutral-700">
        Something wrong? Add a correction
      </button>
    );

  return (
    <form onSubmit={submit} className="space-y-2">
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        minLength={3}
        maxLength={500}
        required
        rows={3}
        placeholder="e.g. Gate is now blue. Call when you reach the pharmacy."
        className="w-full rounded-lg border border-neutral-300 p-3"
      />
      <button
        disabled={state === "sending"}
        className="w-full rounded-xl bg-neutral-900 px-4 py-3 font-semibold text-white disabled:opacity-60"
      >
        {state === "sending" ? "Sending…" : "Send correction"}
      </button>
      {state === "error" && <p className="text-red-600">Could not send. Check your network and retry.</p>}
    </form>
  );
}
