import node from "@astrojs/node";
import react from "@astrojs/react";
import { defineConfig, fontProviders } from "astro/config";
import emdash, { local } from "emdash/astro";
import { sqlite } from "emdash/db";

export default defineConfig({
	output: "server",
	// Single-language site in Indonesian. EmDash reads this for its content
	// language (without it, entries default to English). Keep the default
	// routing: prefixing the default locale breaks the /_emdash/admin router.
	i18n: {
		defaultLocale: "id",
		locales: ["id"],
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
