// Builds reports/review-sheet.html: for every feature, feat, racial feature, item and creation that has automation, the sourcebook text next
// to what the automation actually does (activities, dice, saves, uses, effects), riskiest first. Tick boxes are remembered in the browser.
// Usage: node scripts/review-sheet.mjs   (needs a build: packs-src)
import { readdirSync, readFileSync, writeFileSync } from "node:fs";

const PACKS = ["class-features", "feats", "racial-features", "items", "creations", "backgrounds", "devil-fruits", "ship-weapons"];
const esc = (s) => String(s ?? "").replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]);
const text = (h) => String(h ?? "").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
const dmg = (parts = []) => parts.map((p) => `${p.number ?? ""}${p.denomination ? "d" + p.denomination : ""}${p.bonus ? "+" + p.bonus : ""}${p.custom?.enabled ? p.custom.formula : ""} ${[...(p.types ?? [])].join("/")}`.trim()).filter(Boolean).join(" + ");

const rows = [];
for (const pack of PACKS) for (const f of readdirSync(`packs-src/${pack}`)) {
  const d = JSON.parse(readFileSync(`packs-src/${pack}/${f}`, "utf8"));
  const acts = Object.values(d.system?.activities ?? {});
  const fx = d.effects ?? [];
  if (!acts.length && !fx.length) continue;
  const lines = acts.map((a) => {
    const bits = [`<b>${esc(a.type)}</b> ${esc(a.name)}`];
    if (a.activation?.type) bits.push(`${esc(a.activation.type)}${a.activation.condition ? " (" + esc(a.activation.condition) + ")" : ""}`);
    if (a.duration?.units && a.duration.units !== "inst") bits.push(`lasts ${esc(a.duration.value || "")} ${esc(a.duration.units)}`);
    if (a.save?.ability?.length) bits.push(`save ${esc([...a.save.ability].join("/"))} DC ${esc(a.save.dc?.formula || a.save.dc?.calculation || "")}`);
    if (a.attack?.type?.value) bits.push(`${esc(a.attack.type.value)} attack`);
    const dm = dmg(a.damage?.parts); if (dm) bits.push(`damage ${esc(dm)}`);
    if (a.healing?.custom?.enabled || a.healing?.number) bits.push(`${esc(a.healing.types?.join("/") ?? "heal")} ${esc(a.healing.custom?.enabled ? a.healing.custom.formula : a.healing.number + "d" + a.healing.denomination)}`);
    if (a.roll?.formula) bits.push(`roll ${esc(a.roll.formula)}`);
    const c = (a.consumption?.targets ?? []).map((t) => `${t.type} ${t.target || "self"} x${t.value}`); if (c.length) bits.push(`spends ${esc(c.join(", "))}`);
    return bits.join(" &middot; ");
  });
  const u = d.system?.uses;
  if (u?.max) lines.push(`<b>uses</b> ${esc(u.max)} per ${esc(Array.isArray(u.recovery) ? u.recovery.map((r) => r.period).join(",") || "?" : u.per || u.recovery || "?")}`);
  for (const e of fx) lines.push(`<b>effect</b> ${esc(e.name)}${e.disabled ? " (off by default)" : ""}${e.transfer ? " (passive)" : ""}: ${esc((e.changes ?? []).map((c) => `${c.key} ${c.value}`).join("; ").slice(0, 160))}`);
  // riskier = spends resources, deals damage, forces saves, applies effects
  const risk = (acts.some((a) => a.consumption?.targets?.length) ? 3 : 0) + (acts.some((a) => a.damage?.parts?.length) ? 3 : 0) + (acts.some((a) => a.type === "save") ? 2 : 0) + (fx.length ? 1 : 0) + (u?.max ? 1 : 0);
  rows.push({ id: `${pack}/${d._id}`, pack, name: d.name, risk, src: text(d.system?.description?.value).slice(0, 900), lines });
}
rows.sort((a, b) => b.risk - a.risk || a.pack.localeCompare(b.pack) || a.name.localeCompare(b.name));
const cards = rows.map((r) => `<section data-id="${esc(r.id)}"><label><input type=checkbox> <b>${esc(r.name)}</b> <small>${esc(r.pack)} &middot; risk ${r.risk}</small></label><div class=cols><div class=src>${esc(r.src)}</div><ul>${r.lines.map((l) => `<li>${l}</li>`).join("")}</ul></div></section>`).join("");
writeFileSync("reports/review-sheet.html", `<!doctype html><meta charset=utf-8><title>OP5e review sheet</title>
<style>body{font:14px system-ui;margin:20px;background:#111;color:#ddd}section{border-bottom:1px solid #333;padding:8px 0}.cols{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:4px 0 0 22px}.src{color:#aaa}ul{margin:0;padding-left:18px}small{color:#888}#bar{position:sticky;top:0;background:#111;padding:8px 0}input[type=search]{width:260px}.done{opacity:.35}</style>
<div id=bar><b>${rows.length} items</b>, riskiest first. Left: sourcebook text. Right: what the automation does. Tick when it matches. <span id=count></span> <input type=search id=q placeholder="filter by name"></div>${cards}
<script>const K="op5e-review";let s={};try{s=JSON.parse(localStorage.getItem(K)||"{}")}catch{}
const all=[...document.querySelectorAll("section")],upd=()=>{count.textContent=Object.values(s).filter(Boolean).length+" ticked"};
all.forEach(e=>{const c=e.querySelector("input");c.checked=!!s[e.dataset.id];e.classList.toggle("done",c.checked);c.onchange=()=>{s[e.dataset.id]=c.checked;e.classList.toggle("done",c.checked);try{localStorage.setItem(K,JSON.stringify(s))}catch{}upd()}});upd();
q.oninput=()=>{const v=q.value.toLowerCase();all.forEach(e=>e.hidden=v&&!e.textContent.toLowerCase().includes(v))}</script>`);
console.log(`review sheet: ${rows.length} items -> reports/review-sheet.html`);
