// Foundry SCRIPT MACRO: imports an op5e bundle (made by dev/harness/export-bundle.mjs) into the CURRENT world.
// Run as GM in blood-and-brine: create a Script macro, paste this, execute, pick the bundle JSON.
// Safe by default: actors whose name already exists are SKIPPED (never replaced or deleted). Tick "Replace" only to overwrite on purpose.
// Keeps actor ids so transform and summon targets stay linked. Art paths (one-piece-5e/npcs/...) are shared Data files, nothing is copied.
(async () => {
  if (!game.user.isGM) return ui.notifications.error("GM only");
  const pick = await new Promise((res) => {
    const input = Object.assign(document.createElement("input"), { type: "file", accept: ".json" });
    input.onchange = () => res(input.files[0]); input.click();
  });
  if (!pick) return;
  const bundle = JSON.parse(await pick.text());
  if (bundle.version !== 1 || !Array.isArray(bundle.actors)) return ui.notifications.error("Not an op5e bundle");
  const replace = await foundry.applications.api.DialogV2.confirm({
    window: { title: `Import ${bundle.actors.length} actors into ${game.world.id}` },
    content: `<p>From <b>${bundle.source}</b>. Existing actors with the same name are skipped.</p><p>Replace instead of skip? This DELETES the existing actor.</p>`,
    yes: { label: "Replace existing", default: false }, no: { label: "Skip existing", default: true },
  });
  if (replace === null) return;
  const folder = async (names) => {
    let parent = null;
    for (const name of names) parent = game.folders.find((f) => f.type === "Actor" && f.name === name && (f.folder?.id ?? null) === (parent?.id ?? null)) ?? await Folder.create({ name, type: "Actor", folder: parent?.id ?? null });
    return parent;
  };
  const log = { created: [], skipped: [], replaced: [], failed: [] };
  for (const { folderPath, data } of bundle.actors) {
    const same = game.actors.filter((a) => a.name === data.name);
    if (same.length && !replace) { log.skipped.push(data.name); continue; }
    try {
      for (const x of same) await x.delete();
      const idTaken = game.actors.has(data._id);
      const d = { ...data, folder: (await folder(folderPath)).id };
      if (idTaken) delete d._id;
      await Actor.create(d, { keepId: !idTaken });
      (same.length ? log.replaced : log.created).push(data.name);
    } catch (e) { log.failed.push(`${data.name}: ${e.message}`); }
  }
  console.log("op5e bundle import", log);
  ui.notifications.info(`Created ${log.created.length}, replaced ${log.replaced.length}, skipped ${log.skipped.length}, failed ${log.failed.length} (details in console)`);
})();
