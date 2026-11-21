import type { GeoPoint } from "./queue";

export function formatCoords(loc: GeoPoint): string {
  return `${loc.lat.toFixed(5)}, ${loc.lng.toFixed(5)}`;
}

export function mapsLink(loc: GeoPoint): string {
  return `https://maps.google.com/?q=${loc.lat.toFixed(5)},${loc.lng.toFixed(5)}`;
}

function locationLines(loc?: GeoPoint): string[] {
  if (!loc) return ["Location: not available"];
  const acc = loc.accuracy ? ` (±${Math.round(loc.accuracy)} m)` : "";
  return [`Location: ${formatCoords(loc)}${acc}`, mapsLink(loc)];
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function buildIncidentMessage(input: {
  typeLabel: string;
  severityLabel: string;
  description: string;
  createdAt: string;
  location?: GeoPoint | undefined;
}): string {
  return [
    `INCIDENT REPORT: ${input.typeLabel} (${input.severityLabel})`,
    input.description.trim() || "No description",
    `Time: ${formatTime(input.createdAt)}`,
    ...locationLines(input.location),
    "Sent via Northeast Connect",
  ].join("\n");
}

export function buildCheckinMessage(input: { name?: string | undefined; createdAt: string; location?: GeoPoint | undefined }): string {
  const who = input.name?.trim() ? `${input.name.trim()} is SAFE.` : "I am SAFE.";
  return [who, `Time: ${formatTime(input.createdAt)}`, ...locationLines(input.location), "Sent via Northeast Connect"].join(
    "\n",
  );
}

export function buildSosMessage(createdAt: string, location?: GeoPoint): string {
  return ["SOS! I need help urgently.", `Time: ${formatTime(createdAt)}`, ...locationLines(location)].join("\n");
}

/** `sms:?&body=` opens the SMS app with the text filled in on both Android and iOS. */
export function smsHref(body: string, to = ""): string {
  return `sms:${to}?&body=${encodeURIComponent(body)}`;
}

export function whatsappHref(body: string): string {
  return `https://wa.me/?text=${encodeURIComponent(body)}`;
}
