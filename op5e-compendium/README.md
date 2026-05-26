# One Piece 5e Compendium

A Foundry VTT compendium module for the **One Piece D&D 5e** homebrew system (Blood & Brine campaign). Provides classes, subclasses, and class features as native dnd5e compendium packs with full advancement automation, DAE effects, and Midi-QoL integration.

## What's Included

| Pack | Count | Contents |
|------|------:|---------|
| Classes | 2 | Fighter, Rogue |
| Subclasses | 23 | 11 Fighter + 12 Rogue archetypes |
| Class Features | 172 | All base class & subclass features |
| **Total** | **197** | |

### Fighter (96 items)

Class + 11 subclasses (Champion, Battlemaster, Brute, Gunslinger, Samurai, Banneret, Cavalier, Gadget Knight, Master of None, Arms Dealer, Blitzkrieg) + fighting styles + all features.

### Rogue (101 items)

Class + 12 subclasses (Assassin, Bruiser, Fencer, Gadget Trickster, Inquisitive, Ringmaster, Sawbones, Scout, Seeker, Swashbuckler, Thief, Wildcard) + all features.

## Requirements

- **Foundry VTT** v13+
- **dnd5e** system 5.1.10+
- **DAE** (Dynamic Active Effects) — for automated stat modifications
- **Midi-QoL** — for automated attack/damage workflows

## Installation

### Option A: Copy to modules folder

Copy or symlink the entire `op5e-compendium/` directory into your Foundry VTT `Data/modules/` folder:

```
FoundryVTT/Data/modules/op5e-compendium/
├── module.json
├── scripts/
├── packs/          ← LevelDB compendium databases
└── ...
```

### Option B: Symlink (development)

```bash
# Windows (run as admin)
mklink /D "C:\Users\<you>\AppData\Local\FoundryVTT\Data\modules\op5e-compendium" "D:\path\to\op5e-compendium"

# macOS / Linux
ln -s /path/to/op5e-compendium ~/foundrydata/Data/modules/op5e-compendium
```

Then enable the module in Foundry VTT under **Settings → Manage Modules**.

## Building from Source

### Prerequisites

- Node.js 20+
- npm

### Install dependencies

```bash
npm install
```

### Build JSON sources → LevelDB packs

```bash
# Step 1: Generate validated JSON into packs-src/
npx tsx data/build.ts

# Step 2: Compile JSON into LevelDB packs/
npx tsx data/compile.ts

# Or run both together:
npm run build
```

> **Windows path note:** If your project path contains special characters (like `&`), the `npx` shim may fail. Use `node node_modules/tsx/dist/cli.mjs data/build.ts` as a workaround.

### Clean build artifacts

```bash
npm run clean
```

## Project Structure

```
op5e-compendium/
├── module.json                 # Foundry VTT module manifest
├── scripts/module.mjs          # Module init script
├── data/
│   ├── build.ts                # JSON build pipeline (validates & emits packs-src/)
│   ├── compile.ts              # LevelDB compilation (packs-src/ → packs/)
│   ├── schemas/                # Zod validation schemas
│   │   ├── common.ts           # Base item fields
│   │   ├── class.ts            # Class item schema
│   │   ├── subclass.ts         # Subclass item schema
│   │   ├── feature.ts          # Feature item schema
│   │   └── race.ts             # Race item schema
│   ├── helpers/                # ID generation, UUID helpers, DAE effects
│   └── src/                    # Content definitions
│       ├── classes/            # Class items (fighter.ts, rogue.ts, index.ts)
│       ├── subclasses/         # Subclass items (fighter-*.ts, rogue-*.ts, index.ts)
│       └── class-features/     # Feature items (fighter.ts, rogue.ts, index.ts)
├── packs-src/                  # Generated JSON (git-ignored)
└── packs/                      # Generated LevelDB (git-ignored)
```

## Adding a New Class

Follow this workflow to add a new class (e.g., "Brawler"):

### 1. Read the source material

Study the class's markdown/PDF source for hit dice, proficiencies, advancement table, subclass features, etc.

### 2. Create the class definition

Create `data/src/classes/brawler.ts` following the pattern in `fighter.ts`:

```typescript
import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createHitPoints, createItemGrant /* ... */ } from "../../helpers/advancement.js";
import type { ClassItem } from "../../schemas/class.js";

export const brawler: ClassItem = {
  _id: generateId("brawler"),
  name: "Brawler",
  type: "class",
  img: "icons/skills/melee/unarmed-punch-fist.webp",
  system: {
    description: { value: "<p>...</p>", chat: "" },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "brawler",
    levels: 1,
    hitDice: "d10",
    hitDiceUsed: 0,
    advancement: {
      // HitPoints, ItemGrant, ScaleValue, etc.
    },
    // ...remaining fields
  },
  // ...effects, flags, etc.
};
```

### 3. Create class features

Create `data/src/class-features/brawler.ts` for base class features:

```typescript
import { generateId } from "../../helpers/id.js";
import type { FeatureItem } from "../../schemas/feature.js";

export const brawlerFeatures: FeatureItem[] = [
  // Each feature granted by the class advancement table
];
```

### 4. Create subclasses

For each subclass, create `data/src/subclasses/brawler-{subclass}.ts`:

```typescript
import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";

// Export features array and subclass item
export const features: FeatureItem[] = [ /* ... */ ];
export const subclass: SubclassItem = {
  _id: generateId("brawler-streetfighter"),
  name: "Street Fighter",
  type: "subclass",
  system: {
    identifier: "street-fighter",
    classIdentifier: "brawler",
    advancement: { /* ItemGrant entries for each feature */ },
    // ...
  },
};
```

### 5. Update barrel exports

Add imports to each index file:

- `data/src/classes/index.ts` — add the class
- `data/src/subclasses/index.ts` — add each subclass
- `data/src/class-features/index.ts` — add class features + subclass features

### 6. Build and verify

```bash
npx tsx data/build.ts    # Should show 0 errors
npx tsx data/compile.ts  # Compile to LevelDB
```

## Content Roadmap

- [x] Fighter (11 subclasses, 96 items)
- [x] Rogue (12 subclasses, 101 items)
- [ ] Remaining OP5e classes
- [ ] Races & racial features
- [ ] Feats
- [ ] Items & equipment
- [ ] Devil Fruit creations

## License

This module contains homebrew content for the Blood & Brine One Piece 5e campaign. Not affiliated with or endorsed by Wizards of the Coast or Eiichiro Oda.
