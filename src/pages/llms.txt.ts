import type { APIRoute } from "astro";
import {
	getEmDashCollection,
	getSiteSettings,
	getTaxonomyTerms,
} from "emdash";

/**
 * Live-generated llms.txt: rebuilt from published EmDash content on every
 * request, so it stays in sync automatically as stories are published.
 */
export const GET: APIRoute = async ({ url }) => {
	const origin = url.origin;
	const [settings, sections, pagesResult, postsResult] = await Promise.all([
		getSiteSettings(),
		getTaxonomyTerms("category"),
		getEmDashCollection("pages", {
			limit: 100,
			orderBy: { published_at: "desc" },
		}),
		getEmDashCollection("posts", {
			limit: 50,
			orderBy: { published_at: "desc" },
		}),
	]);

	const oneLine = (s: string | null | undefined) =>
		(s ?? "").replace(/\s+/g, " ").trim();

	const lines: string[] = [
		`# ${settings.title}`,
		"",
		settings.tagline ? `> ${oneLine(settings.tagline)}` : "",
		"",
		"Situs berita berbahasa Indonesia. Tautan artikel dan halaman mengarah ke versi Markdown (.md) yang ringkas dan ramah LLM; hapus akhiran .md dari URL untuk membaca versi HTML.",
		"",
		"## Rubrik",
		"",
		...sections.map((s) => `- [${s.label}](${origin}/category/${s.slug})`),
		"",
		"## Berita terkini",
		"",
		...postsResult.entries.map((post) => {
			const excerpt = oneLine(post.data.excerpt);
			return `- [${oneLine(post.data.title)}](${origin}/posts/${post.id}.md)${excerpt ? `: ${excerpt}` : ""}`;
		}),
		"",
		"## Halaman",
		"",
		...pagesResult.entries.map(
			(page) => `- [${oneLine(page.data.title)}](${origin}/${page.id}.md)`,
		),
		"",
		"## Opsional",
		"",
		`- [Peta situs](${origin}/sitemap.xml): Daftar lengkap URL versi HTML untuk perayap.`,
		"",
		`Terakhir diperbarui: ${new Date().toISOString()}`,
		"",
	];

	return new Response(lines.filter((l) => l !== "").join("\n"), {
		headers: {
			"Content-Type": "text/markdown; charset=utf-8",
			"Cache-Control": "public, max-age=3600",
		},
	});
};
