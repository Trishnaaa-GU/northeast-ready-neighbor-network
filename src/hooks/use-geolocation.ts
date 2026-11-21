import { useCallback, useState } from "react";
import type { GeoPoint } from "@/lib/queue";

type GeoState =
  | { status: "idle" }
  | { status: "locating" }
  | { status: "ok"; point: GeoPoint }
  | { status: "error"; message: string };

/** GPS works without internet; it can take a while under heavy cloud or in valleys. */
export function useGeolocation() {
  const [state, setState] = useState<GeoState>({ status: "idle" });

  const locate = useCallback((): Promise<GeoPoint | undefined> => {
    if (!("geolocation" in navigator)) {
      setState({ status: "error", message: "This phone does not support location." });
      return Promise.resolve(undefined);
    }
    setState({ status: "locating" });
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const point = { lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy };
          setState({ status: "ok", point });
          resolve(point);
        },
        (err) => {
          const message =
            err.code === err.PERMISSION_DENIED
              ? "Location permission is off. Turn it on in your phone settings."
              : err.code === err.TIMEOUT
                ? "Could not get a GPS fix in time. Move to open sky and try again."
                : "Location is not available right now.";
          setState({ status: "error", message });
          resolve(undefined);
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 120000 },
      );
    });
  }, []);

  return { state, locate, point: state.status === "ok" ? state.point : undefined };
}
