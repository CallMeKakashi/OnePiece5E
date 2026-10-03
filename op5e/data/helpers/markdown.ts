/** Minimal vault-markdown -> HTML for item descriptions: headings, bullets, tables dropped, bold/italic, wikilinks flattened. */
export function mdToHtml(md: string): string {
  const inline = (t: string) =>
    t.replace(/!\[\[[^\]]*\]\]/g, "").replace(/\[\[([^\]|]*\|)?([^\]]+)\]\]/g, "$2")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/\*([^*]+)\*/g, "<em>$1</em>");
  const out: string[] = []; let list = false;
  for (const line of md.split(/\r?\n/)) {
    const l = line.trim();
    if (l.startsWith("- ")) { if (!list) { out.push("<ul>"); list = true; } out.push(`<li>${inline(l.slice(2))}</li>`); continue; }
    if (list) { out.push("</ul>"); list = false; }
    const h = l.match(/^(#{2,6})\s+(.+)$/);
    if (h) out.push(`<h${h[1].length}>${inline(h[2])}</h${h[1].length}>`);
    else if (l && !l.startsWith("|") && !l.startsWith("# ")) out.push(`<p>${inline(l)}</p>`);
  }
  if (list) out.push("</ul>");
  return out.join("\n");
}
