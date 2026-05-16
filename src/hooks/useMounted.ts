"use client";

import { useEffect, useState } from "react";

/** Avoid SSR/client mismatch for browser-only state (auth, localStorage, dates). */
export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
