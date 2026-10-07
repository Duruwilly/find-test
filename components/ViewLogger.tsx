"use client";
import { useEffect } from "react";

export default function ViewLogger({ code, api }: { code: string; api: string }) {
  useEffect(() => {
    fetch(`${api}/api/cards/${code}/view`, { method: "POST", keepalive: true }).catch(() => {});
  }, [code, api]);
  return null;
}
