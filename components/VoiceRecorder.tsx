"use client";
import { useRef, useState } from "react";

export default function VoiceRecorder({ onChange }: { onChange: (b: Blob | null) => void }) {
  const [recording, setRecording] = useState(false);
  const [url, setUrl] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const rec = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  async function start() {
    setErr(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mime = MediaRecorder.isTypeSupported("audio/webm;codecs=opus") ? "audio/webm;codecs=opus" : "";
      // Low bitrate keeps a 30s note around 50–100KB.
      const r = new MediaRecorder(stream, mime ? { mimeType: mime, audioBitsPerSecond: 24000 } : undefined);
      chunks.current = [];
      r.ondataavailable = (e) => e.data.size && chunks.current.push(e.data);
      r.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunks.current, { type: r.mimeType || "audio/webm" });
        setUrl(URL.createObjectURL(blob));
        onChange(blob);
      };
      r.start();
      rec.current = r;
      setRecording(true);
      setTimeout(() => {
        if (r.state === "recording") {
          r.stop();
          setRecording(false);
        }
      }, 45000); // hard cap
    } catch {
      setErr("Could not access the microphone. Check browser permission.");
    }
  }

  function stop() {
    rec.current?.stop();
    setRecording(false);
  }

  function clear() {
    setUrl(null);
    onChange(null);
  }

  return (
    <div className="space-y-2">
      {!url && (
        <button
          type="button"
          onClick={recording ? stop : start}
          className={`w-full rounded-xl px-4 py-3 font-semibold ${recording ? "bg-red-600 text-white" : "border border-neutral-300"}`}
        >
          {recording ? "■ Stop recording" : "🎙 Record directions"}
        </button>
      )}
      {url && (
        <div className="space-y-2">
          <audio controls src={url} className="w-full" />
          <button type="button" onClick={clear} className="text-sm text-neutral-600 underline">
            Record again
          </button>
        </div>
      )}
      {err && <p className="text-red-600">{err}</p>}
    </div>
  );
}
