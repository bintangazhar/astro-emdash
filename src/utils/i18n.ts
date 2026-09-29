export const DEFAULT_LOCALE = "id";
export const SUPPORTED_LOCALES = ["id", "en"] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

/** Normalize unknown input to a supported locale, falling back to default. */
export function normalizeLocale(locale: string | null | undefined): SupportedLocale {
	if (locale === "en") return "en";
	return "id";
}

/** Strip the /en prefix (if any) to get the locale-agnostic path. */
export function stripLocalePrefix(pathname: string): string {
	if (pathname === "/en") return "/";
	if (pathname.startsWith("/en/")) return pathname.slice(3);
	return pathname;
}

/**
 * Build the URL for the same page in another locale.
 * Default locale (id) is unprefixed, en is prefixed with /en.
 */
export function localizePath(pathname: string, locale: SupportedLocale): string {
	const bare = stripLocalePrefix(pathname);
	if (locale === "en") return bare === "/" ? "/en/" : `/en${bare}`;
	return bare;
}

/** <html lang> value + date-fns/Intl locale tag per app locale. */
export function intlLocale(locale: SupportedLocale): string {
	return locale === "en" ? "en-US" : "id-ID";
}
