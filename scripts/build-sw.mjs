// Generates the offline service worker AFTER the full build (client + Nitro + prerender), because
// vite-plugin-pwa runs before Nitro writes the deployable static folder and so precaches nothing.
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { generateSW } from "workbox-build";

const candidates = [".vercel/output/static", ".output/public"];
const staticDir = candidates.map((dir) => resolve(dir)).find((dir) => existsSync(dir));

if (!staticDir) {
  console.error(`[build-sw] No static output found in ${candidates.join(" or ")}.`);
  process.exit(1);
}

for (const required of ["index.html", "manifest.webmanifest"]) {
  if (!existsSync(resolve(staticDir, required))) {
    console.error(`[build-sw] Missing ${required} in ${staticDir}. Is prerendering enabled?`);
    process.exit(1);
  }
}

// Prerendered pages land at "<route>/index.html"; precache them under the clean route URL
// ("/alerts") so a navigation to that screen is answered from the cache.
const cleanPageUrls = (entries) => ({
  manifest: entries.map((entry) => {
    const match = entry.url.match(/^(.+)\/index\.html$/);
    return match ? { ...entry, url: `/${match[1]}` } : entry;
  }),
  warnings: [],
});

const { count, size, warnings } = await generateSW({
  globDirectory: staticDir,
  globPatterns: ["**/*.{js,css,html,svg,png,ico,webmanifest,json,woff,woff2}"],
  globIgnores: ["**/node_modules/**", "sw.js", "workbox-*.js", "_headers"],
  swDest: resolve(staticDir, "sw.js"),
  manifestTransforms: [cleanPageUrls],
  navigateFallback: "/index.html",
  navigateFallbackDenylist: [/^\/_serverFn/, /^\/api\//, /^\/~oauth/, /^\/_vercel/],
  cleanupOutdatedCaches: true,
  clientsClaim: true,
  skipWaiting: true,
  maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
  inlineWorkboxRuntime: false,
  sourcemap: false,
  mode: "production",
});

for (const warning of warnings) console.warn(`[build-sw] ${warning}`);
console.log(
  `[build-sw] ${staticDir}/sw.js precaches ${count} files (${(size / 1024).toFixed(1)} KiB).`,
);
