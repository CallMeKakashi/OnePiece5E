import { MODULE_ID, getAllDrafts, setAllDrafts } from "../settings.mjs";
import {
  applyStartingBeri,
  importFromPackWithAdvancements,
} from "./apply-advancements.mjs";
import { isBackgroundEntry, isRoleEntry } from "./background-role.mjs";
import { isValidPointBuy, totalCost } from "./pointBuy.mjs";

const { HandlebarsApplicationMixin, ApplicationV2 } = foundry.applications.api;

const OP5E_COMPENDIUM_ID = "op5e";

const PACKS = {
  species: `${OP5E_COMPENDIUM_ID}.races`,
  racialFeatures: `${OP5E_COMPENDIUM_ID}.racial-features`,
  backgroundsAndRoles: `${OP5E_COMPENDIUM_ID}.backgrounds`,
  classes: `${OP5E_COMPENDIUM_ID}.classes`,
  classFeatures: `${OP5E_COMPENDIUM_ID}.class-features`,
  feats: `${OP5E_COMPENDIUM_ID}.feats`
};

const STEPS = [
  "name",
  "images",
  "species",
  "background",
  "role",
  "class",
  "abilities",
  "fork",
  "finish"
];

function nowIso() {
  return new Date().toISOString();
}

function randomId() {
  return foundry.utils.randomID();
}

function defaultAbilities() {
  return { str: 8, dex: 8, con: 8, int: 8, wis: 8, cha: 8 };
}

function normalizeAbilityKey(k) {
  const key = String(k ?? "").toLowerCase();
  if (["str", "dex", "con", "int", "wis", "cha"].includes(key)) return key;
  return null;
}

async function indexPack(packCollection, fields = ["type", "name", "img", "system.identifier"]) {
  const pack = game.packs.get(packCollection);
  if (!pack) throw new Error(`Missing compendium pack: ${packCollection}`);
  return pack.getIndex({ fields });
}

function mapIndexEntry(e) {
  return { _id: e._id, name: e.name, img: e.img };
}

function filterIndexByType(index, type) {
  return index.filter((e) => e.type === type).map(mapIndexEntry);
}

function filterAdditionalPowerRoots(index) {
  return index
    .filter((e) => e.type === "feat" && e.flags?.op5e?.additionalPowerRoot === true)
    .map(mapIndexEntry);
}

async function importAdditionalPowerTree(actor, rootFeatId) {
  const pack = game.packs.get(PACKS.classFeatures);
  if (!pack || !rootFeatId) return [];

  const rootDoc = await pack.getDocument(rootFeatId);
  if (!rootDoc) return [];

  const imported = [];
  await importFromPackWithAdvancements(actor, PACKS.classFeatures, rootFeatId);
  imported.push(rootDoc);

  const index = await indexPack(PACKS.classFeatures, [
    "type",
    "name",
    "system.requirements",
    "flags.op5e"
  ]);
  const rootName = rootDoc.name;
  for (const entry of index) {
    if (entry._id === rootFeatId) continue;
    if (entry.type !== "feat") continue;
    if (String(entry.system?.requirements ?? "").trim() !== rootName) continue;
    const subDoc = await importFromPackWithAdvancements(actor, PACKS.classFeatures, entry._id);
    if (subDoc) imported.push(subDoc);
  }

  return imported;
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

  for (const adv of doc.system?.advancement ?? []) {
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
      useArray: OP5eCharacterCreatorWizard.#onUseArray,
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
      data: {
        name: "",
        portraitImg: "",
        tokenImg: "",
        speciesId: "",
        backgroundId: "",
        roleFeatId: "",
        classId: "",
        abilities: defaultAbilities(),
        abilityMethod: "pointBuy", // roll|array|pointBuy
        fork: {
          kind: "additionalPower", // devilFruitLater|additionalPower
          additionalPowerFeatId: ""
        }
      },
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
    this.#cached = draft;
    return draft;
  }

  async #saveDraft(mutator) {
    const drafts = getAllDrafts();
    const draft = drafts[this.draftId];
    if (!canActOnDraft(draft, game.user)) throw new Error("Draft not accessible.");
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
    const [speciesIndex, bgRoleIndex, classIndex, classFeatureIndex, racialFeatIndex] = await Promise.all([
      indexPack(PACKS.species),
      indexPack(PACKS.backgroundsAndRoles),
      indexPack(PACKS.classes),
      indexPack(PACKS.classFeatures, ["type", "name", "img", "flags.op5e"]),
      indexPack(PACKS.racialFeatures).catch(() => [])
    ]);

    const speciesChoices = filterIndexByType(speciesIndex, "race");
    const backgroundChoices = bgRoleIndex.filter(isBackgroundEntry).map(mapIndexEntry);
    const roleChoices = bgRoleIndex.filter(isRoleEntry).map(mapIndexEntry);
    const classChoices = filterIndexByType(classIndex, "class");
    const additionalPowerChoices = filterAdditionalPowerRoots(classFeatureIndex);

    const speciesRacialFeats =
      draft.step === "species" && draft.data.speciesId
        ? await racialFeatsForSpecies(draft.data.speciesId, racialFeatIndex)
        : [];

    const stepIndex = Math.max(0, STEPS.indexOf(draft.step));
    const step = STEPS[stepIndex] ?? STEPS[0];

    const abilities = draft.data.abilities ?? defaultAbilities();
    const pbSpent = totalCost(abilities);
    const pbValid = isValidPointBuy(abilities);

    const isOwner = draft.ownerUserId === game.user?.id;
    const canReset = isOwner && Object.keys(draft.touched ?? {}).length > 0;

    return {
      draft,
      step,
      stepIndex,
      steps: STEPS,
      isGM: !!game.user?.isGM,
      inferredPcLocked: !game.user?.isGM,
      choices: {
        species: speciesChoices,
        backgrounds: backgroundChoices,
        roles: roleChoices,
        classes: classChoices,
        additionalPowers: additionalPowerChoices
      },
      speciesRacialFeats,
      pointBuy: {
        spent: pbSpent,
        total: 27,
        valid: pbValid
      },
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

    for (const name of ["speciesId", "roleFeatId"]) {
      const radios = form.querySelectorAll(`input[type="radio"][name="${name}"]`);
      for (const radio of radios) {
        if (radio.dataset.op5eChoiceBound) continue;
        radio.dataset.op5eChoiceBound = "1";
        radio.addEventListener("change", async () => {
          await this.#commitStepForm();
          this.render(false);
        });
      }
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
      }

      if (step === "background") {
        draft.data.backgroundId = String(data.backgroundId ?? "").trim();
        draft.touched["data.backgroundId"] = true;
      }

      if (step === "role") {
        draft.data.roleFeatId = String(data.roleFeatId ?? "").trim();
        draft.touched["data.roleFeatId"] = true;
      }

      if (step === "class") {
        draft.data.classId = String(data.classId ?? "").trim();
        draft.touched["data.classId"] = true;
      }

      if (step === "abilities") {
        const method = String(data.abilityMethod ?? "").trim();
        if (["roll", "array", "pointBuy"].includes(method)) {
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

      if (step === "fork") {
        const kind = String(data.forkKind ?? "").trim();
        if (["devilFruitLater", "additionalPower"].includes(kind)) {
          draft.data.fork.kind = kind;
          draft.touched["data.fork.kind"] = true;
        }
        draft.data.fork.additionalPowerFeatId = String(data.additionalPowerFeatId ?? "").trim();
        draft.touched["data.fork.additionalPowerFeatId"] = true;
      }
    });
  }

  static async #onBack(_event, _target) {
    const app = this;
    const draft = await app.#getDraft();
    const idx = Math.max(0, STEPS.indexOf(draft.step));
    const prev = STEPS[Math.max(0, idx - 1)] ?? STEPS[0];
    await app.#saveDraft((d) => (d.step = prev));
    app.render(true);
  }

  static async #onNext(_event, _target) {
    const app = this;
    await app.#commitStepForm();
    const draft = await app.#getDraft();
    const idx = Math.max(0, STEPS.indexOf(draft.step));
    const next = STEPS[Math.min(STEPS.length - 1, idx + 1)] ?? STEPS[0];
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
          d.data = {
            name: "",
            portraitImg: "",
            tokenImg: "",
            speciesId: "",
            backgroundId: "",
            roleFeatId: "",
            classId: "",
            abilities: defaultAbilities(),
            abilityMethod: "pointBuy",
            fork: { kind: "additionalPower", additionalPowerFeatId: "" }
          };
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

    // Validate minimum required fields
    if (!draft.data.name) {
      ui.notifications?.error("Name is required.");
      return;
    }

    if (draft.data.abilityMethod === "pointBuy" && !isValidPointBuy(draft.data.abilities)) {
      ui.notifications?.error("Point-buy must spend exactly 27 points.");
      return;
    }

    const actorType = draft.actorKind === "npc" ? "npc" : "character";
    const actorName = draft.data.name;

    const actorData = {
      name: actorName,
      type: actorType,
      img: draft.data.portraitImg || undefined,
      system: {
        abilities: {
          str: { value: Number(draft.data.abilities?.str ?? 8) },
          dex: { value: Number(draft.data.abilities?.dex ?? 8) },
          con: { value: Number(draft.data.abilities?.con ?? 8) },
          int: { value: Number(draft.data.abilities?.int ?? 8) },
          wis: { value: Number(draft.data.abilities?.wis ?? 8) },
          cha: { value: Number(draft.data.abilities?.cha ?? 8) }
        }
      }
    };

    // Token texture (best-effort; schema differs slightly across dnd5e versions)
    if (draft.data.tokenImg) {
      actorData.prototypeToken = {
        texture: { src: draft.data.tokenImg }
      };
    }

    const actor = await Actor.create(actorData, { renderSheet: true });
    if (!actor) return;

    const importedItems = [];
    const importOrder = [
      [PACKS.species, draft.data.speciesId],
      [PACKS.backgroundsAndRoles, draft.data.backgroundId],
      [PACKS.backgroundsAndRoles, draft.data.roleFeatId],
      [PACKS.classes, draft.data.classId],
    ];

    for (const [packKey, docId] of importOrder) {
      const doc = await importFromPackWithAdvancements(actor, packKey, docId);
      if (doc) importedItems.push(doc);
    }

    if (draft.data.fork?.kind === "additionalPower" && draft.data.fork.additionalPowerFeatId) {
      const powerItems = await importAdditionalPowerTree(
        actor,
        draft.data.fork.additionalPowerFeatId
      );
      importedItems.push(...powerItems);
    }

    await applyStartingBeri(actor, importedItems);

    // Clear draft after successful creation (owner only)
    const isOwner = draft.ownerUserId === game.user?.id;
    if (isOwner) {
      const drafts = getAllDrafts();
      delete drafts[draft.id];
      await setAllDrafts(drafts);
    }

    ui.notifications?.info(
      "Actor created with species, background, role, and class advancements applied."
    );
    app.close();
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

