"use client";

import { useEffect } from "react";
import { useStore } from "@/components/karto/store";
import { detectLocation } from "@/lib/geo";
import { toast } from "sonner";

/**
 * On first app load (client-side, after hydration), automatically attempts to
 * detect the user's location. If permission hasn't been granted, the browser
 * will prompt for it. Silently falls back to the default location on any error.
 */
export function AutoLocationDetect() {
  const locationDetected = useStore((s) => s.locationDetected);
  const setLocation = useStore((s) => s.setLocation);
  const setLocationDetected = useStore((s) => s.setLocationDetected);

  useEffect(() => {
    // Only run once per session, and only after hydration
    if (locationDetected) return;
    if (typeof navigator === "undefined" || !navigator.geolocation) return;

    let cancelled = false;
    // Small delay so it doesn't fight with initial render / hydration
    const timer = setTimeout(async () => {
      try {
        const result = await detectLocation();
        if (cancelled) return;
        setLocation(result.short);
        setLocationDetected(true);
      } catch (err) {
        if (cancelled) return;
        // Don't spam the user — only toast if it was an explicit denial
        const msg = err instanceof Error ? err.message : "";
        if (msg.toLowerCase().includes("denied") || msg.toLowerCase().includes("permission")) {
          toast.info("Location permission needed", {
            description: "Click the location icon in the header to detect your address.",
            duration: 4000,
          });
        }
        // Silently keep default location
      }
    }, 1200);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [locationDetected, setLocation, setLocationDetected]);

  return null;
}
