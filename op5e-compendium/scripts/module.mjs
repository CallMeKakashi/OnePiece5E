const MODULE_ID = "op5e-compendium";

Hooks.once("init", () => {
  console.log(`${MODULE_ID} | Initializing One Piece 5e Compendium`);

  CONFIG.DND5E.sourceBooks ??= {};
  CONFIG.DND5E.sourceBooks.OP5e = {
    label: "One Piece 5e",
    abbreviation: "OP5e",
  };
});
