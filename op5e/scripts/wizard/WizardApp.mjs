import { advancementList } from "../advancement-list.mjs";
import { MODULE_ID, getAllDrafts, setAllDrafts } from "../settings.mjs";
import { isBackgroundEntry } from "./background-role.mjs";
import { extraEntries } from "../extra-sources.mjs";
import {
  ABILITY_METHODS,
  PACKS,
  URSA_ARRAY,
  abilitiesValid,
  classInfo,
  createFromDraft,
  defaultAbilities,
  defaultData,
  indexPack,
  totalLevels,
  withDefaults
} from "./create.mjs";
import { isValidPointBuy, totalCost } from "./pointBuy.mjs";

const { HandlebarsApplicationMixin, ApplicationV2 } = foundry.applications.api;

const STEPS = ["name", "images", "species", "background", "dream", "class", "abilities", "finish"];

let dreamsCache = null;
/** Suggested dreams per role, from data/generated/dreams.json (hand-verified from the Sourcebook role pages). */
async function loadDreams() {
  if (dreamsCache) return dreamsCache;
  try {
    const json = await foundry.utils.fetchJsonWithTimeout(`modules/${MODULE_ID}/data/generated/dreams.json`);
    dreamsCache = Object.entries(json)
      .filter(([k, v]) => !k.startsWith("_") && Array.isArray(v))
      .map(([role, dreams]) => ({ role, dreams }));
  } catch (e) {
    console.warn("op5e | dreams.json unavailable", e);
    dreamsCache = [];
  }
  return dreamsCache;
}

/** Role, devil fruit and Haki are class advancement choices now, so there are no extra steps. */
function stepsFor() {
  return STEPS;
}

function nowIso() {
  return new Date().toISOString();
}

function randomId() {
  return foundry.utils.randomID();
}

function normalizeAbilityKey(k) {
  const key = String(k ?? "").toLowerCase();
  if (["str", "dex", "con", "int", "wis", "cha"].includes(key)) return key;
  return null;
}

function mapIndexEntry(e) {
  return { _id: e._id, name: e.name, img: e.img };
}

function filterIndexByType(index, type) {
  return index.filter((e) => e.type === type).map(mapIndexEntry);
}

function compendiumIdFromUuid(uuid) {
  const parts = String(uuid ?? "").split(".");
  return parts[parts.length - 1] ?? "";
}

async function racialFeatsForSpecies(speciesId, racialFeatIndex) {
  if (!speciesId) return [];
  const pack = game.packs.get(PACKS.species);
  if (!pack) return [];
  const doc = await pack.getDocument(speciesId);
  if (!doc) return [];

  const byId = new Map(racialFeatIndex.map((e) => [e._id, e]));
  const seen = new Set();
  const feats = [];

  for (const adv of advancementList(doc.system?.advancement)) {
    if (adv.type !== "ItemGrant") continue;
    for (const item of adv.configuration?.items ?? []) {
      const id = compendiumIdFromUuid(item.uuid);
      if (!id || seen.has(id)) continue;
      seen.add(id);
      const entry = byId.get(id);
      if (entry) feats.push(mapIndexEntry(entry));
    }
  }

  return feats;
}

function getFilePickerClass() {
  return foundry.applications?.apps?.FilePicker ?? globalThis.FilePicker;
}

/** Party Diversity ruling: species and classes already used by characters that other (non-GM) users own. Non-blocking. */
function partyUsage() {
  const others = (game.users ?? []).filter((u) => !u.isGM && u.id !== game.user?.id);
  const species = new Set(), classes = new Set();
  for (const a of game.actors ?? []) {
    if (a.type !== "character" || !others.some((u) => a.testUserPermission(u, "OWNER"))) continue;
    for (const i of a.items) {
      if (i.type === "race") species.add(i.name);
      else if (i.type === "class") classes.add(i.name);
    }
  }
  return { species: [...species].sort(), classes: [...classes].sort() };
}

function canActOnDraft(draft, user) {
  if (!draft) return false;
  if (user?.isGM) return true;
  return draft.ownerUserId === user?.id;
}

export class OP5eCharacterCreatorWizard extends HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS = {
    id: "op5e-character-creator",
    classes: ["op5e-character-creator"],
    form: {
      handler: OP5eCharacterCreatorWizard.#onSubmitForm,
      submitOnChange: false,
      closeOnSubmit: false
    },
    window: {
      title: "OP5e Character Creator",
      resizable: true,
      minimizable: true,
      contentTag: "form",
      contentClasses: ["op5e-cc-form"]
    },
    position: {
      width: 520,
      height: 640
    },
    actions: {
      next: OP5eCharacterCreatorWizard.#onNext,
      back: OP5eCharacterCreatorWizard.#onBack,
      reset: OP5eCharacterCreatorWizard.#onReset,
      finish: OP5eCharacterCreatorWizard.#onFinish,
      useDream: OP5eCharacterCreatorWizard.#onUseDream,
      useArray: OP5eCharacterCreatorWizard.#onUseArray,
      useUrsa: OP5eCharacterCreatorWizard.#onUseUrsa,
      rollScores: OP5eCharacterCreatorWizard.#onRollScores,
      browseImage: OP5eCharacterCreatorWizard.#onBrowseImage
    }
  };

  static PARTS = {
    main: {
      template: `modules/${MODULE_ID}/templates/wizard.hbs`
    }
  };

  static async launch() {
    const draft = await OP5eCharacterCreatorWizard.loadOrCreateDraft();
    const app = new OP5eCharacterCreatorWizard({ draftId: draft.id });
    app.render(true);
    return app;
  }

  static async loadOrCreateDraft() {
    const user = game.user;
    if (!user) throw new Error("No active user.");

    const drafts = getAllDrafts();
    const existing = Object.values(drafts).find((d) => d?.ownerUserId === user.id);
    if (existing) return existing;

    const inferredKind = user.isGM ? "npc" : "pc";

    const draft = {
      id: randomId(),
      ownerUserId: user.id,
      createdAt: nowIso(),
      updatedAt: nowIso(),
      actorKind: inferredKind,
      step: STEPS[0],
      data: defaultData(),
      touched: {}
    };

    drafts[draft.id] = draft;
    await setAllDrafts(drafts);
    return draft;
  }

  constructor(options = {}) {
    super(options);
    this.draftId = options.draftId;
    this.#cached = null;
  }

  draftId;
  #cached;

  async #getDraft() {
    const drafts = getAllDrafts();
    const draft = drafts[this.draftId];
    if (!canActOnDraft(draft, game.user)) throw new Error("Draft not accessible.");
    draft.data = withDefaults(draft.data);
    this.#cached = draft;
    return draft;
  }

  async #saveDraft(mutator) {
    const drafts = getAllDrafts();
    const draft = drafts[this.draftId];
    if (!canActOnDraft(draft, game.user)) throw new Error("Draft not accessible.");
    draft.data = withDefaults(draft.data);
    mutator(draft);
    draft.updatedAt = nowIso();
    drafts[this.draftId] = draft;
    await setAllDrafts(drafts);
    this.#cached = draft;
    return draft;
  }

  async _prepareContext(_options) {
    const draft = await this.#getDraft();

    // Sources
    const [speciesIndex, bgRoleIndex, classIndex, racialFeatIndex] = await Promise.all([
      indexPack(PACKS.species),
      indexPack(PACKS.backgroundsAndRoles),
      indexPack(PACKS.classes),
      indexPack(PACKS.racialFeatures, ["type", "name", "img", "system.requirements"]).catch(() => [])
    ]);

    const speciesChoices = filterIndexByType(speciesIndex, "race");
    const backgroundChoices = bgRoleIndex.filter(isBackgroundEntry).map(mapIndexEntry);
    const classChoices = filterIndexByType(classIndex, "class");

    const speciesRacialFeats =
      draft.step === "species" && draft.data.speciesId
        ? await racialFeatsForSpecies(draft.data.speciesId, racialFeatIndex)
        : [];

    // Hybrid races: features of the second species are racial-feature docs whose requirements name that race or a sub-race.
    const hybridSpecies = speciesChoices.filter((s) => s._id !== draft.data.speciesId);
    const second = hybridSpecies.find((s) => s._id === draft.data.hybridSpeciesId);
    const picked = new Set(draft.data.hybridFeatIds);
    const hybridFeats =
      draft.step === "species" && draft.data.hybridMode === "traits" && second
        ? racialFeatIndex
            .filter((e) => String(e.system?.requirements ?? "").toLowerCase().startsWith(second.name.toLowerCase()))
            .map((e) => ({ ...mapIndexEntry(e), requirements: e.system.requirements, checked: picked.has(e._id) }))
            .sort((a, b) => a.requirements.localeCompare(b.requirements) || a.name.localeCompare(b.name))
        : [];
    const dreams = draft.step === "dream" ? await loadDreams() : [];

    const visible = stepsFor(draft);
    const stepIndex = Math.max(0, visible.indexOf(draft.step));
    const step = visible[stepIndex] ?? visible[0];

    // Class step: subclass options and the level at which the class asks for one.
    const classBlocks = [];
    for (const [n, idKey, lvKey, subKey] of [
      [1, "classId", "level", "subclassId"],
      [2, "classId2", "level2", "subclassId2"]
    ]) {
      const info = await classInfo(draft.data[idKey]);
      const level = Math.min(20, Math.max(1, Number(draft.data[lvKey]) || 1));
      classBlocks.push({
        n,
        idKey,
        lvKey,
        subKey,
        level,
        subclassLevel: info?.subclassLevel ?? null,
        subclasses: (info?.subclasses ?? []).map((s) => ({ ...s, selected: s._id === draft.data[subKey] })),
        subclassEnabled: !!info?.subclassLevel && level >= info.subclassLevel
      });
    }

    // Starting Rules: free starting feat (general feats only, requirements shown)
    let feats = [];
    if (step === "class") {
      const idx = await indexPack(PACKS.feats, ["type", "name", "img", "system.type.value", "system.requirements"]).catch(() => []);
      feats = idx
        .filter((e) => e.type === "feat" && e.system?.type?.value === "feat")
        .map((e) => ({ ...mapIndexEntry(e), requirements: e.system?.requirements ?? "", selected: e._id === draft.data.freeFeatId }))
        .sort((a, b) => a.name.localeCompare(b.name));
      // feats from the GM's extra compendium sources (for example a D&D Beyond import), labelled with their source
      const extra = await extraEntries(["type", "name", "img", "system.type.value", "system.requirements"], (e) => e.type === "feat" && e.system?.type?.value === "feat").catch(() => []);
      feats.push(...extra.map((e) => ({ ...mapIndexEntry(e), name: `${e.name} — ${e.source}`, requirements: e.system?.requirements ?? "", selected: e._id === draft.data.freeFeatId })).sort((a, b) => a.name.localeCompare(b.name)));
    }
    const party = step === "class" || step === "species" ? partyUsage() : { species: [], classes: [] };

    const abilities = draft.data.abilities ?? defaultAbilities();
    const pbSpent = totalCost(abilities);
    const pbValid = isValidPointBuy(abilities);

    const isOwner = draft.ownerUserId === game.user?.id;
    const canReset = isOwner && Object.keys(draft.touched ?? {}).length > 0;

    return {
      draft,
      step,
      stepIndex,
      steps: visible,
      classBlocks,
      freeFeats: feats,
      partySpecies: party.species,
      partyClasses: party.classes,
      totalLevel: totalLevels(draft.data),
      abilityMax: draft.data.abilityMethod === "pointBuy" ? 15 : 20,
      abilityMin: draft.data.abilityMethod === "pointBuy" ? 8 : 3,
      isGM: !!game.user?.isGM,
      inferredPcLocked: !game.user?.isGM,
      choices: {
        species: speciesChoices,
        backgrounds: backgroundChoices,
        classes: classChoices
      },
      speciesRacialFeats,
      hybridSpecies: hybridSpecies.map((s) => ({ ...s, selected: s._id === draft.data.hybridSpeciesId })),
      hybridFeats,
      hybridIsTraits: draft.data.hybridMode === "traits",
      hybridIsAppearance: draft.data.hybridMode === "appearance",
      dreams,
      pointBuy: {
        spent: pbSpent,
        total: 27,
        valid: pbValid
      },
      abilitiesOk: abilitiesValid(draft.data.abilityMethod, abilities),
      canReset
    };
  }

  _onRender(_context, _options) {
    this.#bindImagePathPickers();
    this.#bindChoiceRadios();
  }

  #bindChoiceRadios() {
    const form = this.form;
    if (!form) return;

    // Radios and the class/level/method selects change what the step shows, so re-render after saving.
    const selector = [
      'input[type="radio"][name="speciesId"]',
      'select[name="hybridMode"]',
      'select[name="hybridSpeciesId"]',
      'select[name="classId"]',
      'select[name="classId2"]',
      'input[name="level"]',
      'input[name="level2"]',
      'select[name="abilityMethod"]'
    ].join(",");
    for (const el of form.querySelectorAll(selector)) {
      if (el.dataset.op5eChoiceBound) continue;
      el.dataset.op5eChoiceBound = "1";
      el.addEventListener("change", async () => {
        await this.#commitStepForm();
        this.render(false);
      });
    }
  }

  #bindImagePathPickers() {
    const form = this.form;
    if (!form) return;

    for (const field of ["portraitImg", "tokenImg"]) {
      const input = form.querySelector(`input[name="${field}"]`);
      if (!input || input.dataset.op5ePickerBound) continue;
      input.dataset.op5ePickerBound = "1";
      input.addEventListener("click", (event) => {
        event.preventDefault();
        OP5eCharacterCreatorWizard.#openImagePicker.call(this, field);
      });
    }
  }

  static #openImagePicker(field) {
    const app = this;
    const form = app.form;
    const input = form?.querySelector(`input[name="${field}"]`);
    const current = String(input?.value ?? "").trim();

    const FilePickerClass = getFilePickerClass();
    if (!FilePickerClass) {
      ui.notifications?.error("File picker is unavailable in this Foundry version.");
      return;
    }

    const picker = new FilePickerClass({
      type: "image",
      current: current || "icons/",
      callback: async (path) => {
        if (input) input.value = path;
        await app.#saveDraft((draft) => {
          if (field === "portraitImg") draft.data.portraitImg = path;
          else if (field === "tokenImg") draft.data.tokenImg = path;
          draft.touched[`data.${field}`] = true;
        });
        app.render(false);
      }
    });
    picker.render(true);
  }

  static #onBrowseImage(_event, target) {
    const field = target?.dataset?.field;
    if (!field) return;
    OP5eCharacterCreatorWizard.#openImagePicker.call(this, field);
  }

  #readFormData(form) {
    const FormDataExtended =
      foundry.applications?.data?.forms?.FormDataExtended ?? globalThis.FormDataExtended;
    return new FormDataExtended(form);
  }

  async #commitStepForm() {
    const form = this.form;
    if (!form) {
      throw new Error(
        "Character Creator form element is missing. Framed ApplicationV2 apps must use window.contentTag: \"form\"."
      );
    }
    const formData = this.#readFormData(form);
    await OP5eCharacterCreatorWizard.#onSubmitForm.call(this, null, form, formData);
  }

  static async #onSubmitForm(event, _form, formData) {
    event?.preventDefault?.();
    const app = this;
    const data = formData?.object ?? {};

    await app.#saveDraft((draft) => {
      const step = draft.step;

      // Actor kind (GM can select; non-GM forced PC)
      if (game.user?.isGM) {
        const ak = String(data.actorKind ?? "").toLowerCase();
        if (ak === "pc" || ak === "npc") {
          draft.data.actorKind = ak;
          draft.actorKind = ak;
          draft.touched["actorKind"] = true;
        }
      } else {
        draft.data.actorKind = "pc";
        draft.actorKind = "pc";
      }

      if (step === "name") {
        draft.data.name = String(data.name ?? "").trim();
        draft.touched["data.name"] = true;
      }

      if (step === "images") {
        draft.data.portraitImg = String(data.portraitImg ?? "").trim();
        draft.data.tokenImg = String(data.tokenImg ?? "").trim();
        draft.touched["data.portraitImg"] = true;
        draft.touched["data.tokenImg"] = true;
      }

      if (step === "species") {
        draft.data.speciesId = String(data.speciesId ?? "").trim();
        draft.touched["data.speciesId"] = true;
        const mode = String(data.hybridMode ?? "");
        draft.data.hybridMode = mode === "appearance" || mode === "traits" ? mode : "";
        draft.data.hybridNote = String(data.hybridNote ?? "").trim();
        const second = String(data.hybridSpeciesId ?? "").trim();
        const sameSecond = second === draft.data.hybridSpeciesId;
        draft.data.hybridSpeciesId = second === draft.data.speciesId ? "" : second;
        // ticked features survive only while the same second species stays selected
        const ticked = Object.entries(data)
          .filter(([k, v]) => k.startsWith("hybridFeat.") && (v === true || v === "on" || v === "true"))
          .map(([k]) => k.slice("hybridFeat.".length));
        draft.data.hybridFeatIds =
          draft.data.hybridMode === "traits" && sameSecond && draft.data.hybridSpeciesId ? ticked : [];
        if (draft.data.hybridMode !== "traits") draft.data.hybridSpeciesId = "";
      }

      if (step === "dream") {
        draft.data.dream = String(data.dream ?? "").trim();
        draft.touched["data.dream"] = true;
      }

      if (step === "background") {
        draft.data.backgroundId = String(data.backgroundId ?? "").trim();
        draft.touched["data.backgroundId"] = true;
      }

      if (step === "class") {
        const clamp = (v) => Math.min(20, Math.max(1, Math.floor(Number(v)) || 1));
        draft.data.classId = String(data.classId ?? "").trim();
        draft.data.level = clamp(data.level);
        draft.data.subclassId = String(data.subclassId ?? "").trim();
        draft.data.classId2 = String(data.classId2 ?? "").trim();
        draft.data.level2 = draft.data.classId2 ? clamp(data.level2) : 1;
        draft.data.subclassId2 = String(data.subclassId2 ?? "").trim();
        // total level <= 20; the optional class gives way
        if (draft.data.classId2) draft.data.level2 = Math.min(draft.data.level2, Math.max(1, 20 - draft.data.level));
        if (draft.data.classId2 && draft.data.classId2 === draft.data.classId) draft.data.classId2 = "";
        draft.data.freeFeatId = String(data.freeFeatId ?? "").trim();
        draft.data.hpMode = data.hpMode === "roll" ? "roll" : "avg";
        draft.data.autoApply = data.autoApply === true || data.autoApply === "true" || data.autoApply === "on";
        draft.touched["data.classId"] = true;
      }

      if (step === "abilities") {
        const method = String(data.abilityMethod ?? "").trim();
        if (ABILITY_METHODS.includes(method)) {
          draft.data.abilityMethod = method;
          draft.touched["data.abilityMethod"] = true;
        }

        const next = { ...(draft.data.abilities ?? defaultAbilities()) };
        for (const [k, v] of Object.entries(data)) {
          if (!k.startsWith("ability.")) continue;
          const ab = normalizeAbilityKey(k.split(".")[1]);
          if (!ab) continue;
          next[ab] = Number(v);
        }
        draft.data.abilities = next;
        draft.touched["data.abilities"] = true;
      }
    });
  }

  static async #onBack(_event, _target) {
    const app = this;
    const draft = await app.#getDraft();
    const visible = stepsFor(draft);
    const idx = Math.max(0, visible.indexOf(draft.step));
    const prev = visible[Math.max(0, idx - 1)] ?? visible[0];
    await app.#saveDraft((d) => (d.step = prev));
    app.render(true);
  }

  static async #onNext(_event, _target) {
    const app = this;
    await app.#commitStepForm();
    const draft = await app.#getDraft();
    const visible = stepsFor(draft);
    const idx = Math.max(0, visible.indexOf(draft.step));
    const next = visible[Math.min(visible.length - 1, idx + 1)] ?? visible[0];
    await app.#saveDraft((d) => (d.step = next));
    app.render(true);
  }

  static async #onReset(_event, _target) {
    const app = this;
    const draft = await app.#getDraft();
    const isOwner = draft.ownerUserId === game.user?.id;
    if (!isOwner) {
      ui.notifications?.warn("Only the wizard owner can reset & restart this draft.");
      return;
    }

    await Dialog.confirm({
      title: "Reset & Restart",
      content: "<p>This will clear your in-progress draft and restart the wizard.</p>",
      yes: async () => {
        await app.#saveDraft((d) => {
          d.step = STEPS[0];
          d.data = defaultData();
          d.touched = {};
        });
        app.render(true);
      }
    });
  }

  static async #onFinish(_event, _target) {
    const app = this;
    await app.#commitStepForm();
    const draft = await app.#getDraft();

    // Validation, creation, level-up live in createFromDraft.
    const notes = [];
    try {
      await createFromDraft(draft, { auto: draft.data.autoApply, hpMode: draft.data.hpMode, notes });
    } catch (e) {
      console.error("op5e | character creation failed", e);
      if (!e?.notified) ui.notifications?.error(`Character creation failed: ${e?.message ?? e}`);
      return;
    }
    if (notes.length) console.warn("op5e | character creator notes", notes);

    // Clear draft after successful creation (owner only)
    const isOwner = draft.ownerUserId === game.user?.id;
    if (isOwner) {
      const drafts = getAllDrafts();
      delete drafts[draft.id];
      await setAllDrafts(drafts);
    }

    ui.notifications?.info(
      "Actor created with species, background and class advancements applied (levelled to target)."
    );
    app.close();
  }

  static async #onUseDream(_event, target) {
    const text = String(target?.dataset?.dream ?? "");
    if (!text) return;
    await this.#saveDraft((d) => {
      d.data.dream = text;
      d.touched["data.dream"] = true;
    });
    this.render(false);
  }

  static async #onUseUrsa(_event, _target) {
    const app = this;
    const [str, dex, con, int, wis, cha] = URSA_ARRAY; // 16,16,14,12,12,8; the player reassigns freely
    await app.#saveDraft((d) => {
      d.step = "abilities";
      d.data.abilityMethod = "ursa";
      d.data.abilities = { str, dex, con, int, wis, cha };
      d.touched["data.abilityMethod"] = true;
      d.touched["data.abilities"] = true;
    });
    app.render(true);
  }

  static async #onUseArray(_event, _target) {
    const app = this;
    const standard = { str: 15, dex: 14, con: 13, int: 12, wis: 10, cha: 8 };
    await app.#saveDraft((d) => {
      d.step = "abilities";
      d.data.abilityMethod = "array";
      d.data.abilities = standard;
      d.touched["data.abilityMethod"] = true;
      d.touched["data.abilities"] = true;
    });
    app.render(true);
  }

  static async #onRollScores(_event, _target) {
    const app = this;
    const rollOne = () => {
      const dice = [1, 1, 1, 1].map(() => Math.ceil(Math.random() * 6));
      dice.sort((a, b) => a - b);
      return dice.slice(1).reduce((s, v) => s + v, 0);
    };
    const rolled = { str: rollOne(), dex: rollOne(), con: rollOne(), int: rollOne(), wis: rollOne(), cha: rollOne() };
    await app.#saveDraft((d) => {
      d.step = "abilities";
      d.data.abilityMethod = "roll";
      d.data.abilities = rolled;
      d.touched["data.abilityMethod"] = true;
      d.touched["data.abilities"] = true;
    });
    app.render(true);
  }
}

