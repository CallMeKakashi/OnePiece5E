// Carries an old campaign sheet's gear, spells, berries and loose feats onto a rebuilt actor (test world only, GM session).
// Load: window.__carry = (0, eval)(await (await fetch("/modules/op5e/assets/dev/pane-carry.js")).text());  Run: await __carry("Baptiste", "Baptiste (OPC)", { art: ["IMG_2905.webp", "token_1.png"] })
// Needs assets/dev/payload-<key>.json (node dev/make-carry-payloads.mjs, then a sync). Returns a report.
(async (key, actorName, opts = {}) => {
  const payload = await (await fetch(`/modules/op5e/assets/dev/payload-${key}.json`)).json();
  const a = game.actors.getName(actorName); if (!a) throw new Error("actor not found: " + actorName);
  const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
  const normLoose = (s) => norm(s.replace(/\(.*?\)/g, ""));
  const have = new Set(a.items.map((i) => norm(i.name)));
  const indexes = {};
  const idx = async (id) => (indexes[id] ??= (async () => { const p = game.packs.get(id); const ix = await p.getIndex(); return { p, byName: new Map(ix.map((e) => [norm(e.name), e])), byLoose: new Map(ix.map((e) => [normLoose(e.name), e])) }; })());
  const find = async (packs, name) => { for (const id of packs) { const x = await idx(id); const e = x.byName.get(norm(name)) ?? x.byLoose.get(normLoose(name)); if (e) return { pack: id, doc: await x.p.getDocument(e._id) }; } return null; };
  const GEAR = ["op5e.campaign-items", "op5e.items", "dnd5e.items", "dnd5e.equipment24", "dnd5e.tradegoods"], SPELLS = ["op5e.creations", "dnd5e.spells", "dnd5e.spells24"];
  // old-module scale references -> the equivalent OP5e expressions (the Boxer die is the Brawler die plus one step; Unarmed Master/Spirit Adept raise the step)
  const DIE = "(@scale.brawler.brawling-die.faces + 2 * @flags.op5e.unarmedDieStep)";
  // one pass, so a replacement is never re-processed by the next one
  const translate = (data) => JSON.parse(JSON.stringify(data).replace(/@scale\.(boxer\.die(?:\.die)?|brawler\.brawling(?:\.die)?)(?![\w-])/g, (m, which) => which.startsWith("boxer") ? "1d(min(12, " + DIE + "))" : "@scale.brawler.brawling-die"));
  const dmgSig = (sys) => { const d = sys?.damage ?? {}, out = []; const b = d.base;
    if (b) out.push((b.custom?.enabled ? b.custom.formula : (b.number ? `${b.number}d${b.denomination}` : "")) + (b.bonus ? "+" + String(b.bonus).replace(/^\+/, "") : "") + "|" + [...(b.types ?? [])].join(","));
    for (const p of d.parts ?? []) out.push(String(p[0]) + "|" + p[1]); return out.join(";").replace(/\s/g, ""); };
  const differs = (oldData, doc) => oldData.type === "weapon" ? dmgSig(oldData.system) !== dmgSig(doc.toObject().system) : oldData.type === "equipment" && (oldData.system?.armor?.value ?? null) !== (doc.system?.armor?.value ?? null);
  const hasBrawler = a.items.some((i) => i.name === "Brawler Unarmed Strike");
  const skipByRule = (name) => (/^Unarmed Strike/i.test(name) && hasBrawler) || /Arms of the Astral Self|Unarmed Strike \(Astral\)/i.test(name);
  const ALIAS = { commonclothes: "clothescommon" };
  const report = { fromCampaign: [], fromOp5e: [], fromDnd5e: [], copiedFromOld: [], skippedHave: [], failed: [] };
  for (const it of payload.items) {
    if (have.has(norm(it.name)) || have.has(ALIAS[norm(it.name)]) || skipByRule(it.name)) { report.skippedHave.push(it.name); continue; }
    try {
      const hit = await find(it.type === "spell" ? SPELLS : GEAR, it.name);
      let data, bucket;
      const keepOld = hit && differs(it.data, hit.doc);   // the old sheet's version has other numbers than the compendium item: keep the old one
      if (hit && !keepOld) { data = hit.doc.toObject(); delete data._id; bucket = hit.pack.startsWith("op5e.campaign") ? "fromCampaign" : hit.pack.startsWith("op5e") ? "fromOp5e" : "fromDnd5e"; data.name = data.name; }
      else { data = translate(it.data); bucket = "copiedFromOld"; if (keepOld) report.keptOldVersion = [...(report.keptOldVersion ?? []), it.name]; }
      if (data.system && "quantity" in data.system) data.system.quantity = it.qty;
      if (data.system && "equipped" in data.system) data.system.equipped = it.equipped;
      const made = (await a.createEmbeddedDocuments("Item", [data], { keepId: false }))[0];
      if (!made) throw new Error("Foundry created nothing (the item data was rejected)");
      have.add(norm(made.name)); report[bucket].push(`${it.name}${hit && !keepOld ? ` -> ${hit.pack.split(".")[1]}` : ""}`);
    } catch (e) { report.failed.push(`${it.name}: ${String(e.message).slice(0, 90)}`); }
  }
  // loose feats that have an equivalent general feat (or Six Powers Adept) in the OP5e packs; everything else is a class/race feature of the old module
  const grantedFeats = [], noEquivalent = [];
  for (const f of payload.feats) {
    if (have.has(norm(f))) continue;
    const hit = await find(["op5e.feats"], f) ?? (/six powers adept/i.test(f) ? await find(["op5e.class-features"], "Six Powers Adept") : null);
    if (hit && hit.doc.type === "feat" && !(await Promise.resolve(false))) { const [m] = await a.createEmbeddedDocuments("Item", [(() => { const d = hit.doc.toObject(); delete d._id; return d; })()]); have.add(norm(m.name)); grantedFeats.push(m.name); } else noEquivalent.push(f);
  }
  const upd = { "system.currency.gp": payload.berries, "system.traits.size": opts.size ?? "med" };
  if (opts.art) { upd.img = "modules/op5e/assets/players/" + opts.art[0]; upd["prototypeToken.texture.src"] = "modules/op5e/assets/players/" + opts.art[1]; }
  upd["system.details.biography.value"] = `${a.system.details.biography.value ?? ""}<h3>Carried over from the old campaign sheet</h3><p>Features of the old sheet with no equivalent in the rebuilt class, species or background: ${[...new Set(noEquivalent)].sort().join(", ") || "none"}.</p>`;
  // old sheet's exact saves, skills and tool proficiencies (the rebuilt Role/Background picks differ; the DM granted these at the table)
  if (payload.profs) {
    for (const k of Object.keys(a.system.abilities)) upd[`system.abilities.${k}.proficient`] = payload.profs.saves.includes(k) ? 1 : 0;
    for (const k of Object.keys(a.system.skills)) upd[`system.skills.${k}.value`] = payload.profs.skills[k] ?? 0;
    for (const [k, v] of Object.entries(payload.profs.tools)) upd[`system.tools.${k}.value`] = v;
  }
  await a.update(upd);
  return { ...report, grantedFeats, noEquivalent, berries: payload.berries, counts: Object.fromEntries(Object.entries(report).map(([k, v]) => [k, v.length])) };
})
