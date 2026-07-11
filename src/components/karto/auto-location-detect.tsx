"use client";

import { useEffect } from "react";
import { useStore } from "@/components/karto/store";
import { detectLocation } from "@/lib/geo";
import { toast } from "sonner";

const ASKED_KEY = "karto_location_asked";

/**
 * On first EVER app load, asks for location permission ONCE.
 * - If the user grants it, the location is detected and saved.
 * - If the user denies it, we never auto-ask again (tracked via sessionStorage).
 *   The user can still manually set their location from the header.
 *
 * The browser's permission prompt only appears if the permission state is "prompt"
 * (i.e., the user hasn't been asked before in this browser).
 */
export function AutoLocationDetect() {
  const setLocation = useStore((s) => s.setLocation);
  const setLocationDetected = useStore((s) => s.setLocationDetected);

  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) return;

    // Only auto-ask once per browser session
    if (sessionStorage.getItem(ASKED_KEY)) return;
    sessionStorage.setItem(ASKED_KEY, "1");

    const askOnce = async () => {
      // Small delay so it doesn't fight with initial render / hydration
      await new Promise((r) => setTimeout(r, 1500));
      try {
        const result = await detectLocation();
        setLocation(result.short);
        setLocationDetected(true);
      } catch (err) {
        // User denied or it failed — do NOT set a default location, do NOT auto-retry.
        const msg = err instanceof Error ? err.message.toLowerCase() : "";
        if (msg.includes("denied") || msg.includes("permission")) {
          toast.info("Location permission denied", {
            description: "Click the location icon in the header to set your delivery address.",
            duration: 5000,
          });
        }
      }
    };

    // Check the current permission state — only prompt if it's "prompt" (not granted/denied)
    if (navigator.permissions) {
      navigator.permissions
        .query({ name: "geolocation" as PermissionName })
        .then((result) => {
          if (result.state === "prompt") askOnce();
        })
        .catch(() => askOnce());
    } else {
      askOnce();
    }
  }, [setLocation, setLocationDetected]);

  return null;
}
