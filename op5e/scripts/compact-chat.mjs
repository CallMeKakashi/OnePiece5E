// Compact chat cards (issue #46): an opt-in, per-player style that tightens the spacing of dnd5e chat cards. Pure CSS (styles/module.css) behind a body class.
import { MODULE_ID } from "./constants.mjs";

export function registerCompactChat() {
  const apply = (on) => document.body.classList.toggle("op5e-compact-chat", !!on);
  game.settings.register(MODULE_ID, "compactChat", { name: `${MODULE_ID}.settings.compactChat.name`, hint: `${MODULE_ID}.settings.compactChat.hint`, scope: "client", config: true, type: Boolean, default: false, onChange: apply });
  Hooks.once("ready", () => apply(game.settings.get(MODULE_ID, "compactChat")));
}
