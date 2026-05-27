import { generateId } from "./id.js";
import { DAE_MODES } from "../schemas/common.js";

// --- Types ---

export interface EffectChangeInput {
  key: string;
  mode: number;
  value: string;
  priority?: number;
}

export interface CreateEffectOptions {
  disabled?: boolean;
  transfer?: boolean;
  origin?: string;
  durationSeconds?: number;
  durationRounds?: number;
  durationTurns?: number;
  flags?: Record<string, unknown>;
  statuses?: string[];
  img?: string;
}

// --- DAE Active Effect builder ---

/**
 * Build a complete Active Effect document suitable for the `effects` array
 * on a Foundry Item.  The `idPath` is fed to `generateId` so the effect
 * `_id` is deterministic across rebuilds.
 */
export function createDAEEffect(
  idPath: string,
  name: string,
  changes: EffectChangeInput[],
  options: CreateEffectOptions = {},
) {
  const id = generateId(`effect/${idPath}`);
  return {
    _id: id,
    name,
    img: options.img ?? "",
    changes: changes.map((c) => ({
      key: c.key,
      mode: c.mode,
      value: c.value,
      priority: c.priority ?? 20,
    })),
    disabled: options.disabled ?? false,
    duration: {
      startTime: null,
      seconds: options.durationSeconds ?? null,
      rounds: options.durationRounds ?? null,
      turns: options.durationTurns ?? null,
      combat: null,
    },
    origin: options.origin ?? null,
    transfer: options.transfer ?? true,
    flags: {
      dae: {
        transfer: options.transfer ?? true,
        stackable: "noneName",
      },
      ...(options.flags ?? {}),
    },
    statuses: options.statuses ?? [],
    tint: null,
  };
}

// --- Convenience change builders ---

export function addBonus(key: string, value: string | number): EffectChangeInput {
  return { key, mode: DAE_MODES.ADD, value: String(value) };
}

export function overrideValue(key: string, value: string | number): EffectChangeInput {
  return { key, mode: DAE_MODES.OVERRIDE, value: String(value) };
}

export function upgradeValue(key: string, value: string | number): EffectChangeInput {
  return { key, mode: DAE_MODES.UPGRADE, value: String(value) };
}

export function multiplyValue(key: string, value: string | number): EffectChangeInput {
  return { key, mode: DAE_MODES.MULTIPLY, value: String(value) };
}

export function downgradeValue(key: string, value: string | number): EffectChangeInput {
  return { key, mode: DAE_MODES.DOWNGRADE, value: String(value) };
}

export function customChange(key: string, value: string): EffectChangeInput {
  return { key, mode: DAE_MODES.CUSTOM, value };
}
