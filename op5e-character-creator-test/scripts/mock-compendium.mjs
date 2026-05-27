const OP5E_COMPENDIUM_ID = "op5e-compendium";

const PACK_ENTRIES = {
  [`${OP5E_COMPENDIUM_ID}.races`]: [
    {
      _id: "mock-race-human",
      type: "race",
      name: "Human (mock)",
      img: "icons/svg/mystery-man.svg",
      system: {
        advancement: [
          {
            type: "ItemGrant",
            level: 0,
            configuration: {
              items: [{ uuid: `Compendium.${OP5E_COMPENDIUM_ID}.racial-features.mock-rf-swift` }]
            }
          }
        ]
      }
    },
    { _id: "mock-race-fishman", type: "race", name: "Fish-Man (mock)", img: "icons/svg/mystery-man.svg" }
  ],
  [`${OP5E_COMPENDIUM_ID}.backgrounds`]: [
    { _id: "mock-bg-sailor", type: "background", name: "Sailor (mock)", img: "icons/svg/book.svg" },
    { _id: "mock-role-captain", type: "background", name: "Role: Captain (mock)", img: "icons/svg/sword.svg" }
  ],
  [`${OP5E_COMPENDIUM_ID}.racial-features`]: [
    { _id: "mock-rf-swift", type: "feat", name: "Swift (mock)", img: "icons/svg/upgrade.svg" }
  ],
  [`${OP5E_COMPENDIUM_ID}.classes`]: [
    { _id: "mock-class-fighter", type: "class", name: "Fighter (mock)", img: "icons/svg/sword.svg" },
    { _id: "mock-class-medic", type: "class", name: "Medic (mock)", img: "icons/svg/heal.svg" }
  ],
  [`${OP5E_COMPENDIUM_ID}.feats`]: [
    { _id: "mock-feat-haki", type: "feat", name: "Haki Burst (mock)", img: "icons/svg/aura.svg" },
    { _id: "mock-feat-dash", type: "feat", name: "Quick Dash (mock)", img: "icons/svg/run.svg" }
  ]
};

class MockCompendiumPack {
  constructor(collection, entries) {
    this.collection = collection;
    this.metadata = { id: collection.split(".")[1] ?? collection, label: collection };
    this.#entries = entries;
  }

  #entries;

  async getIndex({ fields: _fields } = {}) {
    return this.#entries.map((e) => ({ ...e }));
  }

  async getDocument(docId) {
    const entry = this.#entries.find((e) => e._id === docId);
    if (!entry) return null;
    const system = entry.system ?? {};
    const flags = entry.flags ?? {};
    return {
      ...entry,
      system,
      flags,
      toObject() {
        return { name: entry.name, type: entry.type, img: entry.img, system, flags };
      }
    };
  }
}

let installed = false;

export function installMockCompendiumPacks() {
  if (installed) return;
  installed = true;

  const mocks = new Map();
  for (const [collection, entries] of Object.entries(PACK_ENTRIES)) {
    mocks.set(collection, new MockCompendiumPack(collection, entries));
  }

  const originalGet = game.packs.get.bind(game.packs);
  game.packs.get = (id) => mocks.get(id) ?? originalGet(id);

  console.log("op5e-character-creator-test | Installed mock compendium packs:", [...mocks.keys()]);
}

export function getMockPackIds() {
  return Object.keys(PACK_ENTRIES);
}
