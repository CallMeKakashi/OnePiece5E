// "Update OP5e" from inside a world (GM only). Talks to the local helper (scripts/update-helper.mjs, run on the Foundry host).
// game.op5eUpdate.check() -> {installed, latest}; game.op5eUpdate.run({ tag? }) stages the release, syncs the compendium documents through
// Foundry's API (so the locked pack files are never touched), then asks the helper to copy the module files (Foundry hot-reloads them).
import { MODULE_ID } from "./constants.mjs";

const helper = async (path, opts = {}) => {
  const base = game.settings.get(MODULE_ID, "updateHelperUrl").replace(/\/$/, "");
  const r = await fetch(base + path, { ...opts, headers: { "x-op5e-token": game.settings.get(MODULE_ID, "updateToken") } });
  const j = await r.json();
  if (!r.ok) throw new Error(j.error ?? `helper answered ${r.status}`);
  return j;
};
const hashDoc = async (d) => {
  const bytes = new TextEncoder().encode(JSON.stringify(d));
  return [...new Uint8Array(await crypto.subtle.digest("SHA-1", bytes))].map((x) => x.toString(16).padStart(2, "0")).join("");
};

export async function checkForUpdate() {
  if (!game.user.isGM) throw new Error("GM only");
  try { return await helper("/status"); }
  catch (e) { throw new Error(`Update helper not reachable (${e.message}). Run "node scripts/update-helper.mjs" on the Foundry host and paste its token into the op5e settings.`); }
}

export async function runUpdate({ tag } = {}) {
  if (!game.user.isGM) throw new Error("GM only");
  const info = await helper(`/stage${tag ? `?tag=${encodeURIComponent(tag)}` : ""}`, { method: "POST" });
  const known = foundry.utils.deepClone(game.settings.get(MODULE_ID, "packHashes") ?? {});
  const report = { version: info.version, packs: {}, newPacks: [] };
  for (const name of info.packs) {
    const pack = game.packs.get(`${MODULE_ID}.${name}`);
    if (!pack) { report.newPacks.push(name); continue; }   // a new pack needs one Foundry restart (module.json)
    const docs = await helper(`/packs/${name}`), old = known[name] ?? {}, now = {}, upsert = [];
    for (const d of docs) { now[d._id] = await hashDoc(d); if (old[d._id] !== now[d._id]) upsert.push(d); }
    const have = new Set((await pack.getIndex()).map((e) => e._id)), remove = [...have].filter((id) => !now[id]);
    if (!upsert.length && !remove.length) continue;
    const wasLocked = pack.locked;
    if (wasLocked) await pack.configure({ locked: false });
    try {
      const opts = { pack: pack.collection, keepId: true, diff: false, recursive: false };
      if (remove.length) await pack.documentClass.deleteDocuments(remove, { pack: pack.collection });
      const exist = upsert.filter((d) => have.has(d._id)), fresh = upsert.filter((d) => !have.has(d._id));
      if (exist.length) await pack.documentClass.updateDocuments(exist, opts);
      if (fresh.length) await pack.documentClass.createDocuments(fresh, opts);
    } finally { if (wasLocked) await pack.configure({ locked: true }); }
    known[name] = now;
    report.packs[name] = { changed: upsert.length, removed: remove.length };
  }
  await game.settings.set(MODULE_ID, "packHashes", known);
  // the files go last: copying scripts makes Foundry reload every connected browser
  report.files = await helper("/commit", { method: "POST" });
  return report;
}

async function announceUpdate() {
  const r = await fetch("https://api.github.com/repos/CallMeKakashi/OnePiece5E/releases/latest");
  if (!r.ok) return;
  const latest = (await r.json()).tag_name?.replace(/^v/, ""), installed = game.modules.get(MODULE_ID).version;
  const newer = (a, b) => a.split(".").map(Number).some((n, i, arr) => n !== (b.split(".").map(Number)[i] ?? 0) && (n > (b.split(".").map(Number)[i] ?? 0)) && arr.slice(0, i).every((m, j) => m === (b.split(".").map(Number)[j] ?? 0)));
  if (latest && newer(latest, installed)) ui.notifications.info(`OP5e ${latest} is available (you have ${installed}). Open Game Settings and press "Update OP5e" (the update helper must be running on the Foundry host).`, { permanent: true });
}

export function registerSelfUpdate() {
  game.settings.register(MODULE_ID, "updateHelperUrl", { name: "Update helper URL", hint: "Where scripts/update-helper.mjs listens (on the Foundry host).", scope: "world", config: true, type: String, default: "http://localhost:30111", restricted: true });
  game.settings.register(MODULE_ID, "updateToken", { name: "Update helper token", hint: "The token that node scripts/update-helper.mjs prints.", scope: "world", config: true, type: String, default: "", restricted: true });
  game.settings.register(MODULE_ID, "packHashes", { scope: "world", config: false, type: Object, default: {} });
  Hooks.once("ready", () => {
    game.op5eUpdate = { check: checkForUpdate, run: runUpdate };
    // on world open the GM is told when a newer release exists (GitHub's public API, no helper needed for the check)
    if (game.user.isGM) announceUpdate().catch(() => {});
  });
  Hooks.on("renderSettings", (_app, html) => {
    if (!game.user.isGM) return;
    const root = html instanceof HTMLElement ? html : html[0];
    if (root.querySelector(".op5e-update")) return;
    const b = document.createElement("button");
    b.type = "button"; b.className = "op5e-update"; b.innerHTML = '<i class="fa-solid fa-cloud-arrow-down"></i> Update OP5e';
    b.addEventListener("click", async () => {
      try {
        const s = await checkForUpdate();
        if (s.latest.replace(/^v/, "") === s.installed) return ui.notifications.info(`OP5e ${s.installed} is the latest release.`);
        const go = await foundry.applications.api.DialogV2.confirm({ window: { title: "Update OP5e" }, content: `<p>Installed ${s.installed}, latest ${s.latest}. Update now? The page reloads when the files are replaced.</p>` });
        if (!go) return;
        ui.notifications.info("Updating OP5e, do not close the tab...");
        const r = await runUpdate();
        ui.notifications.info(`OP5e ${r.version}: ${Object.keys(r.packs).length} packs synced, ${r.files.copied} files copied.${r.newPacks.length ? " New packs need one Foundry restart: " + r.newPacks.join(", ") : ""}`);
      } catch (e) { ui.notifications.error(e.message); }
    });
    (root.querySelector("section.info") ?? root.querySelector(".settings-sidebar") ?? root).append(b);
  });
}
