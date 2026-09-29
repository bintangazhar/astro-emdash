import type { APIRoute } from "astro";
import { decodeSlug, getEmDashEntry } from "emdash";
import { portableTextToMarkdown } from "../utils/portable-text-to-markdown";

/**
 * Markdown version of a static page, per the llms.txt convention
 * (`rel="alternate" type="text/markdown"`). Rebuilt live on each request.
 */
export const GET: APIRoute = async ({ params, url }) => {
	const slug = decodeSlug(params.slug);
	if (!slug) return new Response("Tidak ditemukan", { status: 404 });

	const { entry: page } = await getEmDashEntry("pages", slug);
	if (!page) return new Response("Tidak ditemukan", { status: 404 });

	const lines = [
		`# ${page.data.title}`,
		"",
		portableTextToMarkdown(page.data.content),
		"",
		"---",
		"",
		`Versi HTML: ${url.origin}/${page.id}`,
		"",
	];

	return new Response(lines.filter((l) => l !== "").join("\n"), {
		headers: {
			"Content-Type": "text/markdown; charset=utf-8",
			"Cache-Control": "public, max-age=3600",
		},
	});
};
