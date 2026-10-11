// Foundry SCRIPT MACRO: imports the op5e music playlists (compendium "OP5e Music Playlists") into the CURRENT world, filed in Music/Moods, Music/Themes and Music/Vocal.
// Run as GM after updating op5e (0.2.15 or later). Safe by default: a playlist whose name already exists in the world is SKIPPED, never replaced.
// The songs stay in the shared Data/music folder; the pack only stores their paths. Old playlists (for example the Session folder) are not touched.
(async () => {
  if (!game.user.isGM) return ui.notifications.error("GM only");
  const pack = game.packs.get("op5e.playlists");
  if (!pack) return ui.notifications.error("Compendium op5e.playlists not found: update OP5e first");
  const index = await pack.getIndex();
  const folderFor = async (name) => {
    const group = name.startsWith("Mood:") ? "Moods" : name.startsWith("Theme:") ? "Themes" : "Vocal";
    let parent = game.folders.find((f) => f.type === "Playlist" && f.name === "Music" && !f.folder) ?? await Folder.create({ name: "Music", type: "Playlist" });
    return game.folders.find((f) => f.type === "Playlist" && f.name === group && f.folder?.id === parent.id) ?? await Folder.create({ name: group, type: "Playlist", folder: parent.id });
  };
  const log = { created: [], skipped: [], failed: [] };
  for (const e of index) {
    if (game.playlists.getName(e.name)) { log.skipped.push(e.name); continue; }
    try { const folder = await folderFor(e.name); await game.playlists.importFromCompendium(pack, e._id, { folder: folder.id }); log.created.push(e.name); }
    catch (err) { log.failed.push(`${e.name}: ${err.message}`); }
  }
  console.log("op5e playlist import", log);
  ui.notifications.info(`Created ${log.created.length}, skipped ${log.skipped.length}, failed ${log.failed.length}`);
})();
