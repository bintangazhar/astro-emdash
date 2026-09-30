import type { SandboxedPlugin } from "emdash/plugin";

const HEX_COLOR = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

const DEFAULTS = {
	brandLight: "#0066cc",
	brandDark: "#4d9fff",
	headingFont: "default",
} as const;

const HEADING_FONTS: Record<string, string> = {
	default: "var(--font-body)",
	serif: '"Iowan Old Style", Georgia, "Times New Roman", serif',
	mono: "var(--font-mono, ui-monospace, monospace)",
};

function sanitizeHex(value: unknown, fallback: string): string {
	if (typeof value === "string" && HEX_COLOR.test(value.trim())) {
		return value.trim();
	}
	return fallback;
}

const plugin = {
	hooks: {
		"page:fragments": async (_event, ctx) => {
			const [brandLightRaw, brandDarkRaw, headingFontRaw] =
				await Promise.all([
					ctx.settings.get("brandLight"),
					ctx.settings.get("brandDark"),
					ctx.settings.get("headingFont"),
				]);

			const brandLight = sanitizeHex(brandLightRaw, DEFAULTS.brandLight);
			const brandDark = sanitizeHex(brandDarkRaw, DEFAULTS.brandDark);
			const headingFontKey =
				typeof headingFontRaw === "string" &&
				Object.hasOwn(HEADING_FONTS, headingFontRaw)
					? headingFontRaw
					: DEFAULTS.headingFont;

			const css =
				`:root{` +
				`--color-brand:light-dark(${brandLight},${brandDark});` +
				`--color-brand-hover:light-dark(` +
				`color-mix(in srgb,${brandLight} 80%,black),` +
				`color-mix(in srgb,${brandDark} 80%,white));` +
				`--font-heading:${HEADING_FONTS[headingFontKey]};}`;

			return {
				kind: "html",
				placement: "head",
				html: `<style data-theme-settings>${css}</style>`,
				key: "theme-settings",
			};
		},
	},
} satisfies SandboxedPlugin;

export default plugin;
