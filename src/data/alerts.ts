export type Severity = "red" | "orange" | "yellow";

export const NE_STATES = [
  "Assam",
  "Arunachal Pradesh",
  "Nagaland",
  "Meghalaya",
  "Manipur",
  "Mizoram",
  "Tripura",
  "Sikkim",
] as const;
export type NEState = (typeof NE_STATES)[number];

export interface Alert {
  id: string;
  state: NEState;
  area: string;
  severity: Severity;
  hazard: "flood" | "landslide" | "earthquake" | "cloudburst" | "cold" | "storm";
  title: string;
  detail: string;
  advice: string;
  issuedAt: string;
}

/** When this bundled alert set was published. Shown as "Alerts last updated" until a refresh. */
export const ALERTS_BUNDLED_AT = "2026-11-20T09:00:00+05:30";

export const SEVERITY_ORDER: Record<Severity, number> = { red: 0, orange: 1, yellow: 2 };

export const ALERTS: Alert[] = [
  {
    id: "sk-glof-1120",
    state: "Sikkim",
    area: "Mangan district — Lachen, Chungthang, Teesta valley",
    severity: "red",
    hazard: "flood",
    title: "Glacial lake flood watch on the Teesta",
    detail: "Rising water level reported at South Lhonak outflow. Sudden flash flood possible downstream within hours.",
    advice: "Move away from the riverbank now. Do not cross bridges over the Teesta. Go to higher ground.",
    issuedAt: "2026-11-20T08:15:00+05:30",
  },
  {
    id: "ar-sela-1120",
    state: "Arunachal Pradesh",
    area: "Tawang & West Kameng — Sela Pass, NH-13 Baisakhi to Jang",
    severity: "red",
    hazard: "landslide",
    title: "Road closed: landslide and heavy snow near Sela Pass",
    detail: "Debris on the road at two points and snowfall of 30–40 cm. Vehicles stranded near Baisakhi.",
    advice: "Do not travel. If stranded, stay inside your vehicle, run the engine 10 minutes per hour with a window slightly open.",
    issuedAt: "2026-11-20T07:40:00+05:30",
  },
  {
    id: "nl-nh29-1120",
    state: "Nagaland",
    area: "Chümoukedima — NH-29 at Pagla Pahar",
    severity: "orange",
    hazard: "landslide",
    title: "Landslide risk on Dimapur–Kohima highway",
    detail: "Cracks seen on the hill slope after rain. One-way traffic with police control.",
    advice: "Travel only in daylight. Do not stop under steep slopes. Watch for falling stones.",
    issuedAt: "2026-11-20T06:30:00+05:30",
  },
  {
    id: "mn-eq-1119",
    state: "Manipur",
    area: "Ukhrul and Kamjong districts",
    severity: "orange",
    hazard: "earthquake",
    title: "Earthquake M4.6 felt — aftershocks possible",
    detail: "Moderate shaking felt at 11:42 pm. Minor cracks reported in some old buildings.",
    advice: "Stay out of damaged buildings. Keep a torch and shoes near your bed. Drop, cover and hold on if it shakes.",
    issuedAt: "2026-11-19T23:58:00+05:30",
  },
  {
    id: "as-haflong-1120",
    state: "Assam",
    area: "Dima Hasao — Haflong, Jatinga, Mahur",
    severity: "orange",
    hazard: "cloudburst",
    title: "Very heavy rain may cause flash floods and mudslides",
    detail: "More than 120 mm rain expected in 24 hours over hill areas.",
    advice: "Avoid streams and low roads. Keep your emergency kit ready to leave quickly.",
    issuedAt: "2026-11-20T05:00:00+05:30",
  },
  {
    id: "as-jiabharali-1120",
    state: "Assam",
    area: "Sonitpur — Jia Bharali river near Bhalukpong to Tezpur",
    severity: "yellow",
    hazard: "flood",
    title: "River level rising after rain in the hills",
    detail: "Water level rising slowly. Below danger mark for now.",
    advice: "Keep children and cattle away from the river. Listen to local announcements.",
    issuedAt: "2026-11-20T04:30:00+05:30",
  },
  {
    id: "ar-cold-1120",
    state: "Arunachal Pradesh",
    area: "Tawang, Dirang, Mechuka, Anini",
    severity: "yellow",
    hazard: "cold",
    title: "Cold wave: night temperature may drop to −6 °C",
    detail: "Very cold nights for the next 3 days at high altitude.",
    advice: "Wear layers and cover head and hands. Never use a charcoal heater in a closed room.",
    issuedAt: "2026-11-20T06:00:00+05:30",
  },
  {
    id: "ml-rain-1120",
    state: "Meghalaya",
    area: "East Khasi Hills — Sohra, Mawsynram, Pynursla",
    severity: "yellow",
    hazard: "cloudburst",
    title: "Heavy rain likely with low visibility",
    detail: "Fog and heavy showers on hill roads in the afternoon.",
    advice: "Drive slowly with headlights on. Avoid waterfalls and stream crossings.",
    issuedAt: "2026-11-20T05:45:00+05:30",
  },
  {
    id: "mz-ls-1120",
    state: "Mizoram",
    area: "Aizawl — Ramhlun, Zemabawk, Bawngkawn slopes",
    severity: "yellow",
    hazard: "landslide",
    title: "Landslide watch on steep residential slopes",
    detail: "Soil is saturated after three days of rain.",
    advice: "Check for new cracks in walls and ground. Leave at once if you hear rumbling or see tilting trees.",
    issuedAt: "2026-11-20T07:00:00+05:30",
  },
  {
    id: "tr-storm-1120",
    state: "Tripura",
    area: "West Tripura and Sepahijala",
    severity: "yellow",
    hazard: "storm",
    title: "Thunderstorm with gusty winds up to 50 km/h",
    detail: "Storms likely in the evening with lightning.",
    advice: "Stay indoors during lightning. Keep away from trees and electric poles.",
    issuedAt: "2026-11-20T08:30:00+05:30",
  },
];
