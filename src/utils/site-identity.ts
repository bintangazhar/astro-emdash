/** Resolved media reference from getSiteSettings() */
export interface MediaReference {
  mediaId: string;
  alt?: string;
  url?: string;
}

export interface StarterSiteIdentitySettings {
  title?: string;
  tagline?: string;
  logo?: MediaReference;
  favicon?: MediaReference;
}

export interface BlogSiteIdentitySettings {
  title?: string;
  tagline?: string;
  logo?: MediaReference;
  favicon?: MediaReference;
}

const DEFAULT_SITE_TITLE = "Situs Berita Saya";
const DEFAULT_SITE_TAGLINE = "Kabar terkini dan liputan lokal, diperbarui setiap hari";

export function resolveBlogSiteIdentity(settings?: BlogSiteIdentitySettings) {
  return {
    siteTitle: settings?.title ?? DEFAULT_SITE_TITLE,
    siteTagline: settings?.tagline ?? DEFAULT_SITE_TAGLINE,
    siteLogo: settings?.logo?.url ? settings.logo : null,
  };
}

// Alias lama — dipertahankan agar halaman lama tidak rusak.
export const resolveStarterSiteIdentity = resolveBlogSiteIdentity;
