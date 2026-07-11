/**
 * Browser geolocation + reverse geocoding (using OpenStreetMap Nominatim).
 * Free, no API key required. Falls back gracefully on any error.
 */

export type GeoResult = {
  address: string;
  short: string;
  lat: number;
  lng: number;
};

/** Reverse-geocode lat/lng to a human-readable address via Nominatim. */
export async function reverseGeocode(lat: number, lng: number): Promise<GeoResult> {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16&addressdetails=1`;
  const res = await fetch(url, {
    headers: { "Accept-Language": "en" },
  });
  if (!res.ok) throw new Error("Geocoding request failed");
  const data = await res.json();
  const a = data.address || {};
  const area = a.suburb || a.neighbourhood || a.city_district || a.residential || a.town || a.village || "";
  const city = a.city || a.town || a.county || a.state_district || "";
  const pincode = a.postcode || "";
  const state = a.state || "";

  // Compose a concise short address like "Bandra West, Mumbai 400050"
  const short = [area, city].filter(Boolean).join(", ") + (pincode ? ` ${pincode}` : "") || data.display_name?.split(",").slice(0, 2).join(",") || "Your location";
  const address = data.display_name || short;

  return { address, short: short || address, lat, lng };
}

/** Get the user's current position via the browser Geolocation API. */
export function getCurrentPosition(): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => reject(new Error(err.message || "Unable to get your location")),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  });
}

/** One-shot helper: detect location and reverse geocode. */
export async function detectLocation(): Promise<GeoResult> {
  const { lat, lng } = await getCurrentPosition();
  return reverseGeocode(lat, lng);
}
