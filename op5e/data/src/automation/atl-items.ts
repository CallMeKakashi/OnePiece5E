import type { Spec, EffectSpec } from "../../helpers/spec.js";

// Token-effect items (issue #40): light sources, night vision and a disguise change the token itself through Active Token Effects (ATL).
// Each is a passive effect that starts switched off: the player turns it on when the torch is lit, the goggles are worn or the disguise is on.
// ATL keys: light.bright / light.dim (radius in ft; dim is the total radius), light.color, sight.visionMode / sight.range, texture.src (token image).
const OVERRIDE = 5, UPGRADE = 4;
const ch = (key: string, value: string, mode = OVERRIDE) => ({ key, mode, value });
const toggle = (name: string, ...changes: ReturnType<typeof ch>[]): EffectSpec => ({ name, transfer: true, disabled: true, changes });
const light = (name: string, bright: number, dim: number, color = "#ffa24d") =>
  ({ activities: [], extraEffects: [toggle(name, ch("ATL.light.bright", String(bright)), ch("ATL.light.dim", String(dim)), ch("ATL.light.color", color))] }) as Spec;

export const atlItemSpecs: Record<string, Spec> = {
  "items/Torch": light("Torch (lit): bright light 20 ft, dim light 20 ft more", 20, 40),
  "items/Candle": light("Candle (lit): bright light 5 ft, dim light 5 ft more", 5, 10),
  "items/Lantern": light("Lantern (lit): bright light 30 ft, dim light 30 ft more", 30, 60),
  "items/Lamp": light("Lamp (lit): bright light 15 ft, dim light 15 ft more", 15, 30),
  "items/Night Vision Goggles (Goggles of Night)": {
    activities: [],
    extraEffects: [toggle("Goggles worn: darkvision 60 ft", ch("ATL.sight.visionMode", "darkvision"), ch("ATL.sight.range", "60", UPGRADE))],
  },
  "items/Disguise Kit": {
    activities: [],
    extraEffects: [toggle("Disguised: token shows the disguise (set the image to the disguise)", ch("ATL.texture.src", "icons/svg/mystery-man.svg"))],
  },
};
