import type { PortableTextBlock } from "emdash";

interface PTSpan {
	_type: string;
	text?: string;
	marks?: string[];
}

interface PTMarkDef {
	_key: string;
	_type: string;
	href?: string;
}

interface PTBlock {
	_type: string;
	style?: string;
	children?: PTSpan[];
	markDefs?: PTMarkDef[];
	listItem?: string;
	level?: number;
	alt?: string;
	src?: string;
	url?: string;
}

function renderSpan(span: PTSpan, markDefs: PTMarkDef[]): string {
	let text = span.text ?? "";
	for (const mark of span.marks ?? []) {
		if (mark === "strong") text = `**${text}**`;
		else if (mark === "em") text = `_${text}_`;
		else if (mark === "code") text = "`" + text + "`";
		else if (mark === "strike-through") text = `~~${text}~~`;
		else if (mark === "underline") text = `__${text}__`;
		else {
			const def = markDefs.find((d) => d._key === mark);
			if (def?._type === "link" && def.href) text = `[${text}](${def.href})`;
		}
	}
	return text;
}

function renderBlock(block: PTBlock): string {
	if (block._type === "image") {
		const src = block.src ?? block.url ?? "";
		if (!src) return "";
		return `![${block.alt ?? ""}](${src})`;
	}
	if (block._type !== "block") return "";
	const inline = (block.children ?? [])
		.filter((c) => c._type === "span")
		.map((c) => renderSpan(c, block.markDefs ?? []))
		.join("");
	if (!inline.trim()) return "";

	if (block.listItem === "bullet" || block.listItem === "number") {
		const indent = "  ".repeat(Math.max(0, (block.level ?? 1) - 1));
		const marker = block.listItem === "number" ? "1." : "-";
		return `${indent}${marker} ${inline}`;
	}
	switch (block.style) {
		case "h1":
			return `# ${inline}`;
		case "h2":
			return `## ${inline}`;
		case "h3":
			return `### ${inline}`;
		case "h4":
			return `#### ${inline}`;
		case "blockquote":
			return `> ${inline}`;
		default:
			return inline;
	}
}

/**
 * Convert EmDash Portable Text to Markdown for llms.txt-style `.md` page
 * versions. Unknown block types fall back to their plain text.
 */
export function portableTextToMarkdown(
	blocks: PortableTextBlock[] | null | undefined,
): string {
	if (!blocks || blocks.length === 0) return "";
	const raw = blocks as unknown as PTBlock[];
	const out: string[] = [];
	for (const block of raw) {
		if (block._type === "block" || block._type === "image") {
			const md = renderBlock(block);
			if (md) out.push(md);
		} else {
			// Unknown block type: keep its plain text so nothing is lost.
			const text = (block.children ?? [])
				.filter((c) => c._type === "span")
				.map((c) => c.text ?? "")
				.join("");
			if (text.trim()) out.push(text);
		}
	}
	return out.join("\n\n");
}
