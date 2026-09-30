import { fileURLToPath } from "node:url";
import type { PluginDescriptor } from "emdash";

export function themeSettings(): PluginDescriptor {
	return {
		id: "theme-settings",
		version: "1.0.0",
		format: "standard",
		entrypoint: fileURLToPath(
			new URL("./theme-settings.runtime.ts", import.meta.url),
		),
		capabilities: ["hooks.page-fragments:register"],
		settingsSchema: {
			brandLight: {
				type: "string",
				label: "Warna brand (mode terang)",
				description: "Hex, contoh #0066cc. Dipakai sebagai --color-brand.",
				default: "#0066cc",
			},
			brandDark: {
				type: "string",
				label: "Warna brand (mode gelap)",
				description: "Hex, contoh #4d9fff.",
				default: "#4d9fff",
			},
			headingFont: {
				type: "select",
				label: "Font heading",
				description: "Gaya font untuk h1-h6 (override --font-heading).",
				options: [
					{ value: "default", label: "Default (ikuti body)" },
					{ value: "serif", label: "Serif" },
					{ value: "mono", label: "Mono" },
				],
				default: "default",
			},
		},
	};
}
