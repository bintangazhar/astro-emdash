import node from "@astrojs/node";
import react from "@astrojs/react";
import { defineConfig, fontProviders } from "astro/config";
import emdash, { local } from "emdash/astro";
import { sqlite } from "emdash/db";

export default defineConfig({
	output: "server",
	// Bilingual site (Indonesian default, English secondary). EmDash reads
	// this for its content language. Keep prefixDefaultLocale: false so
	// /_emdash/admin stays unprefixed and id URLs stay clean:
	// /posts (id), /en/posts (en).
	i18n: {
		defaultLocale: "id",
		locales: ["id", "en"],
		// No src/pages/en/ duplicates: /en/* rewrites to the id page with
		// Astro.currentLocale = "en". EmDash middleware picks that up and
		// returns English content automatically.
		fallback: {
			en: "id",
		},
		routing: {
			prefixDefaultLocale: false,
			fallbackType: "rewrite",
		},
	},
	adapter: node({
		mode: "standalone",
	}),
	image: {
		layout: "constrained",
		responsiveStyles: true,
	},
	integrations: [
		react(),
		emdash({
			database: sqlite({ url: "file:./data.db" }),
			storage: local({
				directory: "./uploads",
				baseUrl: "/_emdash/api/media/file",
			}),
			// White-label admin: custom logo in the admin header/login.
			// NOTE: `admin.siteName` is intentionally NOT set so the admin
			// brand stays dynamic: EmDash falls back to Settings > General >
			// Site Title at runtime (see manifest route). Setting it here
			// would hardcode the name and stop following Site Title changes.
			admin: {
				logo: "/admin-logo.png",
			},
		}),
	],
	devToolbar: { enabled: false },
	fonts: [
		{
			provider: fontProviders.google(),
			name: "Inter",
			cssVariable: "--font-body",
			weights: [400, 500, 600, 700],
			fallbacks: ["sans-serif"],
		},
		{
			provider: fontProviders.google(),
			name: "JetBrains Mono",
			cssVariable: "--font-mono",
			weights: [400, 500],
			fallbacks: ["monospace"],
		},
	],
});
