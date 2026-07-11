"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Navigation, Loader2, Search, Home, Briefcase, MapPinned } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/components/karto/store";
import { detectLocation } from "@/lib/geo";
import { validatePincode } from "@/lib/format";

export function LocationModal() {
  const open = useStore((s) => s.locationModalOpen);
  const setOpen = useStore((s) => s.setLocationModalOpen);
  const setLocation = useStore((s) => s.setLocation);
  const setLocationDetected = useStore((s) => s.setLocationDetected);
  const location = useStore((s) => s.location);

  const [detecting, setDetecting] = useState(false);
  const [manual, setManual] = useState({ area: "", city: "", pincode: "" });
  const [addrType, setAddrType] = useState<"Home" | "Work" | "Other">("Home");

  const handleDetect = async () => {
    setDetecting(true);
    try {
      const result = await detectLocation();
      setLocation(result.short);
      setLocationDetected(true);
      toast.success("Location detected", { description: result.short, duration: 2500 });
      setOpen(false);
    } catch (err) {
      toast.error("Couldn't detect location", {
        description: err instanceof Error ? err.message : "Please enable location permission.",
      });
    } finally {
      setDetecting(false);
    }
  };

  const handleManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manual.area.trim() || !manual.city.trim()) {
      toast.error("Please fill area and city");
      return;
    }
    if (manual.pincode && !validatePincode(manual.pincode)) {
      toast.error("Enter a valid 6-digit pincode");
      return;
    }
    const loc = `${manual.area.trim()}, ${manual.city.trim()}${manual.pincode ? ` ${manual.pincode.trim()}` : ""}`;
    setLocation(loc);
    setLocationDetected(false);
    toast.success("Location set", { description: loc });
    setOpen(false);
    setManual({ area: "", city: "", pincode: "" });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[95] flex items-start justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm sm:items-center"
        >
          <motion.div
            initial={{ y: 24, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md overflow-hidden rounded-2xl bg-background shadow-2xl"
          >
            {/* header */}
            <div className="relative bg-gradient-to-br from-karto-green to-emerald-600 p-5 text-white">
              <button onClick={() => setOpen(false)} className="absolute right-3 top-3 rounded-lg p-2 text-white/80 hover:bg-white/15" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-2">
                <MapPin className="h-6 w-6" />
                <h2 className="text-xl font-black">Choose your location</h2>
              </div>
              <p className="mt-1 text-sm text-white/90">Current: {location}</p>
            </div>

            <div className="p-5">
              {/* detect live */}
              <button
                onClick={handleDetect}
                disabled={detecting}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-karto-green bg-karto-green/5 py-3.5 text-sm font-bold text-karto-green transition hover:bg-karto-green/10 disabled:opacity-60"
              >
                {detecting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Navigation className="h-5 w-5" />}
                {detecting ? "Detecting..." : "Detect my live location"}
              </button>

              <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="h-px flex-1 bg-border" /> OR enter manually <span className="h-px flex-1 bg-border" />
              </div>

              {/* manual entry */}
              <form onSubmit={handleManual} className="space-y-3">
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-muted-foreground">Area / Locality *</span>
                  <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5 focus-within:border-karto-green">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <input
                      value={manual.area}
                      onChange={(e) => setManual({ ...manual, area: e.target.value })}
                      placeholder="e.g. Bandra West"
                      className="w-full bg-transparent text-sm outline-none"
                    />
                  </div>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="mb-1 block text-xs font-semibold text-muted-foreground">City *</span>
                    <input
                      value={manual.city}
                      onChange={(e) => setManual({ ...manual, city: e.target.value })}
                      placeholder="Mumbai"
                      className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-karto-green"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs font-semibold text-muted-foreground">Pincode</span>
                    <input
                      value={manual.pincode}
                      onChange={(e) => setManual({ ...manual, pincode: e.target.value })}
                      placeholder="400050"
                      maxLength={6}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-karto-green"
                    />
                  </label>
                </div>
                <div>
                  <span className="mb-1.5 block text-xs font-semibold text-muted-foreground">Address type</span>
                  <div className="flex gap-2">
                    {([["Home", Home], ["Work", Briefcase], ["Other", MapPinned]] as const).map(([t, Icon]) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setAddrType(t)}
                        className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition ${addrType === t ? "border-karto-green bg-karto-green/10 text-karto-green" : "border-border"}`}
                      >
                        <Icon className="h-3.5 w-3.5" /> {t}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full rounded-xl bg-karto-green py-3 text-sm font-bold text-white transition hover:bg-karto-green/90"
                >
                  Set location
                </button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
