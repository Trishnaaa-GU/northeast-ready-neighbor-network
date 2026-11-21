# Northeast Ready Neighbor Network

Build "Northeast Connect", an offline-first Progressive Web App (PWA) for community emergency assistance in North East India (floods, landslides, earthquakes). It must be fully usable with NO internet, for people in remote high-altitude areas of Arunachal Pradesh and Nagaland.

STACK: React + Vite + Tailwind, no backend. All data bundled locally. Store user data in localStorage/IndexedDB.

OFFLINE REQUIREMENTS (most important):
- Add a web app manifest and a service worker (vite-plugin-pwa) that precaches the whole app so it loads with zero connection.
- Show a small status badge: "Online" or "Offline mode: all guides available".
- Show "Alerts last updated: [date/time]" with a warning if older than 24 hours.
- Incident reports and check-ins are saved locally in a queue and show "Pending sync". When the connection returns, mark them "Synced" (simulate sync).
- An "Install app" prompt button.

SCREENS (mobile-first, big touch targets, high contrast, readable outdoors):
1. Home: large red SOS section, alert banner, 6 big icon tiles (Safety Guides, Helplines, Shelters, Report Incident, I'm Safe, First Aid).
2. Alerts: preloaded demo alerts for Assam, Arunachal, Nagaland, Meghalaya, Manipur, Mizoram, Tripura, Sikkim with severity badges (Red/Orange/Yellow) and a state filter.
3. Safety Guides: step-by-step guides with icons for Flood, Landslide, Earthquake, Cloudburst. Sections: Before, During, After. Short, simple language.
4. Helplines: tap-to-call (tel: links) starting with 112 (national emergency). Add placeholder rows for state disaster control rooms marked "Verify number locally".
5. Shelters: district-wise list with demo data and capacity.
6. Report Incident: a form (type, severity, description, optional photo). Capture GPS with the Geolocation API. Save offline. Also add a "Send via SMS" button that opens sms: with the message and coordinates pre-filled.
7. "I'm Safe": one tap creates a check-in message with time and location that can be shared by SMS/WhatsApp.
8. First Aid: offline quick guides (bleeding, fractures, hypothermia, drowning).
9. Emergency Kit: a checklist that saves its state locally.

EXTRAS:
- Language toggle: English, Hindi, Assamese. Translate main UI labels and the guide headings.
- Large-text toggle and a low-data, light design with no heavy images (use icons and inline SVG only).
- Warm, calm, trustworthy design: deep blue and white with an orange/red accent for alerts. Smooth but minimal animation.

QUALITY: preload realistic demo data, handle empty states, no placeholder text, responsive, accessible. Output complete working code.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://northeast-ready-neighbor-network.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/3045caf7-c1cf-4f04-8d75-a720855236b1).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
