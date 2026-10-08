// "Update OP5e" from inside a world (GM only). Talks to the local helper (scripts/update-helper.mjs, run on the Foundry host).
// game.op5eUpdate.check() -> {installed, latest}; game.op5eUpdate.run({ tag?, dryRun?, ui? }) opens a progress window, stages the release, syncs the compendium documents through
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

const SOCKET = `module.${MODULE_ID}`;
const STEPS = ["Check the version", "Download the release", "Update the compendiums", "Warn the players", "Replace the module files", "Done"];

/** The progress window: steps, a real progress bar for the compendium sync, and a clear done / error state. */
class UpdateProgress extends foundry.applications.api.ApplicationV2 {
  static DEFAULT_OPTIONS = { id: "op5e-update-progress", classes: ["op5e-update-progress"], window: { title: "Updating OP5e", icon: "fa-solid fa-cloud-arrow-down", minimizable: false, resizable: false }, position: { width: 480 } };
  state = { step: 0, label: "", done: 0, total: 0, error: null, finished: false, notes: [] };
  set(patch) { Object.assign(this.state, patch); if (this.rendered) this.render(); }
  async _renderHTML() { return this.state; }
  _replaceHTML(st, content) {
    const esc = (t) => foundry.utils.escapeHTML(String(t ?? ""));
    const pct = st.total ? Math.round((100 * st.done) / st.total) : st.finished ? 100 : 0;
    const rows = STEPS.map((n, i) => {
      const fail = st.error && i === st.step, ok = !st.error && (i < st.step || st.finished), now = !st.error && !ok && i === st.step;
      return `<li class="${fail ? "fail" : ok ? "done" : now ? "now" : ""}"><i class="fa-solid ${fail ? "fa-circle-xmark" : ok ? "fa-circle-check" : now ? "fa-spinner fa-spin" : "fa-circle"}"></i> ${n}</li>`;
    }).join("");
    content.innerHTML = `<section class="op5e-update-body">
      <ol>${rows}</ol>
      <progress max="100" value="${pct}"></progress>
      <p class="op5e-update-label">${st.error ? `<b>${esc(st.error)}</b>` : esc(st.label)}${st.total && !st.error ? ` (${st.done}/${st.total} documents)` : ""}</p>
      ${st.notes.map((n) => `<p class="op5e-update-note">${esc(n)}</p>`).join("")}
      <p class="op5e-update-hint">${st.finished ? "You can close this window." : st.error ? "Nothing is lost: press Update OP5e again and it carries on from where it stopped." : "Keep this tab open until it says Done. If it is interrupted, press Update OP5e again: it resumes."}</p>
      ${st.finished || st.error ? `<button type="button" data-close>Close</button>` : ""}
    </section>`;
    content.querySelector("[data-close]")?.addEventListener("click", () => this.close());
  }
}

/** A world flag that survives a closed tab: if an update never finished, the next GM load says so. */
const startedFlag = (v) => game.settings.set(MODULE_ID, "updateState", v);

export async function runUpdate({ tag, dryRun = false, ui: win } = {}) {
  if (!game.user.isGM) throw new Error("GM only");
  const view = win ?? { set() {} };
  const guard = (e) => { e.preventDefault(); e.returnValue = ""; };
  window.addEventListener("beforeunload", guard);   // the browser asks before the GM closes the tab mid-update
  let unlock = [];
  try {
    view.set({ step: 1, label: "Downloading the release from GitHub..." });
    const info = await helper(`/stage${tag ? `?tag=${encodeURIComponent(tag)}` : ""}`, { method: "POST" });
    const known = foundry.utils.deepClone(game.settings.get(MODULE_ID, "packHashes") ?? {});
    const report = { version: info.version, packs: {}, newPacks: [] };

    // plan first, so the bar has a real total
    view.set({ step: 2, label: "Comparing the compendiums with the release..." });
    const plans = [];
    for (const name of info.packs) {
      const pack = game.packs.get(`${MODULE_ID}.${name}`);
      if (!pack) { report.newPacks.push(name); continue; }   // a new pack needs one Foundry restart (module.json)
      const docs = await helper(`/packs/${name}`), old = known[name] ?? {}, now = {}, upsert = [];
      for (const d of docs) { now[d._id] = await hashDoc(d); if (old[d._id] !== now[d._id]) upsert.push(d); }
      const have = new Set((await pack.getIndex()).map((e) => e._id)), remove = [...have].filter((id) => !now[id]);
      if (upsert.length || remove.length) plans.push({ name, pack, now, upsert, remove, have });
      else known[name] = now;
    }
    const total = plans.reduce((n, p) => n + p.upsert.length + p.remove.length, 0);
    let done = 0;
    if (!dryRun) await startedFlag({ to: info.version, at: Date.now() });

    const batches = (list, size = 25) => Array.from({ length: Math.ceil(list.length / size) }, (_, i) => list.slice(i * size, (i + 1) * size));
    for (const p of plans) {
      view.set({ label: `Updating ${p.name}`, done, total });
      const wasLocked = p.pack.locked; unlock.push(p.pack);
      if (wasLocked) await p.pack.configure({ locked: false });
      try {
        const opts = { pack: p.pack.collection, keepId: true, diff: false, recursive: false };
        if (!dryRun) {
          for (const ids of batches(p.remove)) { await p.pack.documentClass.deleteDocuments(ids, { pack: p.pack.collection }); done += ids.length; view.set({ done }); }
          const exist = p.upsert.filter((d) => p.have.has(d._id)), fresh = p.upsert.filter((d) => !p.have.has(d._id));
          for (const docs of batches(exist)) { await p.pack.documentClass.updateDocuments(docs, opts); done += docs.length; view.set({ done }); }
          for (const docs of batches(fresh)) { await p.pack.documentClass.createDocuments(docs, opts); done += docs.length; view.set({ done }); }
        } else done += p.upsert.length + p.remove.length;
      } finally { if (wasLocked) await p.pack.configure({ locked: true }); unlock = unlock.filter((x) => x !== p.pack); }
      known[p.name] = p.now;
      report.packs[p.name] = { changed: p.upsert.length, removed: p.remove.length };
      if (!dryRun) await game.settings.set(MODULE_ID, "packHashes", known);   // saved per compendium, so an interrupted update resumes here
    }
    view.set({ done: total, total });

    if (dryRun) { report.files = { copied: 0, dryRun: true }; view.set({ step: 5, finished: true, label: "Dry run finished: nothing was changed.", notes: [`Would update ${total} documents in ${plans.length} compendiums.`] }); return report; }

    // the files go last: copying scripts makes Foundry reload every connected browser, so the players are told first
    view.set({ step: 3, label: "Telling the players the page is about to reload..." });
    game.socket.emit(SOCKET, { op5eUpdate: "start", version: info.version });
    await new Promise((r) => setTimeout(r, 4000));
    view.set({ step: 4, label: "Replacing the module files. The page reloads in a moment." });
    report.files = await helper("/commit", { method: "POST" });
    await startedFlag(null);
    view.set({ step: 5, finished: true, label: `OP5e ${info.version} is installed.`, notes: [`${Object.keys(report.packs).length} compendiums synced, ${report.files.copied} files copied.`, ...(report.newPacks.length ? [`New compendiums need one Foundry restart: ${report.newPacks.join(", ")}`] : [])] });
    return report;
  } catch (e) {
    view.set({ error: e.message });
    throw e;
  } finally {
    for (const pack of unlock) await pack.configure({ locked: true }).catch(() => {});   // never leave a compendium unlocked
    window.removeEventListener("beforeunload", guard);
  }
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
  game.settings.register(MODULE_ID, "updateState", { scope: "world", config: false, type: Object, default: null });
  Hooks.once("ready", () => {
    game.op5eUpdate = { check: checkForUpdate, run: runUpdate, UpdateProgress };
    // on world open the GM is told when a newer release exists (GitHub's public API, no helper needed for the check)
    if (game.user.isGM) announceUpdate().catch(() => {});
    // players: the GM is about to replace the module files, which reloads every browser
    game.socket.on(SOCKET, (msg) => { if (msg?.op5eUpdate === "start") ui.notifications.warn(`The GM is updating OP5e to ${msg.version}. The page reloads in a few seconds.`, { permanent: true }); });
    // GM: a previous update was closed before it finished: put the compendiums back to locked and say so
    if (game.user.isGM && game.settings.get(MODULE_ID, "updateState")) {
      for (const pack of game.packs) if (pack.metadata.packageName === MODULE_ID && !pack.locked) pack.configure({ locked: true }).catch(() => {});
      ui.notifications.warn("An OP5e update was interrupted before it finished. Open Game Settings and press Update OP5e: it carries on from where it stopped.", { permanent: true });
    }
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
        const win = new UpdateProgress(); await win.render({ force: true });
        win.set({ step: 0, label: `Updating ${s.installed} to ${s.latest}...` });
        await runUpdate({ ui: win });
      } catch (e) { ui.notifications.error(e.message); }
    });
    (root.querySelector("section.info") ?? root.querySelector(".settings-sidebar") ?? root).append(b);
  });
}
