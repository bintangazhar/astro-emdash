import type { APIRoute } from "astro";
import { decodeSlug, getEmDashEntry } from "emdash";
import { portableTextToMarkdown } from "../../utils/portable-text-to-markdown";

/**
 * Markdown version of an article, per the llms.txt convention
 * (`rel="alternate" type="text/markdown"`). Rebuilt live on each request.
 */
export const GET: APIRoute = async ({ params, url }) => {
	const slug = decodeSlug(params.slug);
	if (!slug) return new Response("Tidak ditemukan", { status: 404 });

	const { entry: post } = await getEmDashEntry("posts", slug);
	if (!post) return new Response("Tidak ditemukan", { status: 404 });

	const origin = url.origin;
	const categories = post.data.terms?.category ?? [];
	const date = post.data.publishedAt?.toLocaleDateString("id-ID", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	const lines = [
		`# ${post.data.title}`,
		"",
		date ? `Dipublikasikan ${date}.` : "",
		categories.length > 0
			? `Rubrik: ${categories.map((c) => c.label).join(", ")}.`
			: "",
		post.data.excerpt ? `> ${post.data.excerpt.replace(/\s+/g, " ").trim()}` : "",
		"",
		"---",
		"",
		portableTextToMarkdown(post.data.content),
		"",
		"---",
		"",
		`Versi HTML: ${origin}/posts/${post.id}`,
		"",
	];

	return new Response(lines.filter((l) => l !== "").join("\n"), {
		headers: {
			"Content-Type": "text/markdown; charset=utf-8",
			"Cache-Control": "public, max-age=3600",
		},
	});
};
