import type { FoundryItem } from "../../../schemas/common.js";

export const level6: FoundryItem[] = [
  {
    "_id": "3785218ea9cfcfe8",
    "name": "Chain Lightning",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You create a bolt of lightning that arcs toward a target of your choice that you can see within range. Three bolts then leap from that target to as many as three other targets, each of which must be within 30 feet of the first target. A target can be a creature or an object and can be targeted by only one of the bolts.\nA target must make a Constitution saving throw. The target takes 10d8 lightning damage on a failed save, or half as much on a successful one.</p><p><strong>At Higher Levels.</strong> When you use this creation with a creation slot of 7th level or higher, one additional bolt leaps from the first target to another target for each slot level above 6th.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 6,
      "school": "evo",
      "components": {
        "value": "",
        "vocal": true,
        "somatic": true,
        "material": true,
        "ritual": false,
        "concentration": false
      },
      "materials": {
        "value": "a silver pin",
        "consumed": false,
        "cost": 0,
        "supply": 0
      },
      "preparation": {
        "mode": "prepared",
        "prepared": false
      },
      "scaling": {
        "mode": "level",
        "formula": ""
      },
      "activation": {
        "type": "action",
        "cost": 1,
        "condition": ""
      },
      "duration": {
        "value": null,
        "units": "inst"
      },
      "target": {
        "value": null,
        "width": null,
        "units": "",
        "type": ""
      },
      "range": {
        "value": 150,
        "long": null,
        "units": "ft"
      },
      "uses": {
        "value": null,
        "max": "",
        "per": null,
        "recovery": "",
        "prompt": true
      },
      "actionType": "save",
      "attack": {
        "bonus": "",
        "flat": false
      },
      "damage": {
        "parts": [
          [
            "10d8",
            "lightning"
          ]
        ],
        "versatile": ""
      },
      "save": {
        "ability": "con",
        "dc": null,
        "scaling": "spell"
      },
      "chatFlavor": "",
      "formula": ""
    },
    "effects": [],
    "flags": {},
    "folder": null,
    "sort": 0,
    "ownership": {
      "default": 0
    },
    "_stats": {
      "compendiumSource": null,
      "duplicateSource": null,
      "coreVersion": "13",
      "systemId": "dnd5e",
      "systemVersion": "5.1.10",
      "createdTime": null,
      "modifiedTime": null,
      "lastModifiedBy": null
    }
  },
  {
    "_id": "21a5400531e4ed48",
    "name": "Disintegrate",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>A thin ray springs from you to a target that you can see within range. The target can be a creature, an object, or a creation of force, such as the wall created by the Wall of Force creation.\nA creature targeted by this creation must make a Dexterity saving throw. On a failed save, the target takes 10d6 + 40 force damage. The target is disintegrated if this damage leaves it with 0 hit points.\nA disintegrated creature and everything it is wearing and carrying, except mastercraft items, are reduced to a pile of fine gray dust. The creature can be restored to life only by means beyond Raise Dead, meaning via powerful items or other means.\nThis creation automatically disintegrates a Large or smaller non-mastercraft object or a creation of force. If the target is a Huge or larger object or creation of force, this creation disintegrates a 10-foot-cube portion of it. A mastercraft item is unaffected by this creation.</p><p><strong>At Higher Levels.</strong> When you use this creation using a creation slot of 7th level or higher, the damage increases by 3d6 for each slot level above 6th.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 6,
      "school": "trs",
      "components": {
        "value": "",
        "vocal": true,
        "somatic": true,
        "material": true,
        "ritual": false,
        "concentration": false
      },
      "materials": {
        "value": "a pinch of dust",
        "consumed": false,
        "cost": 0,
        "supply": 0
      },
      "preparation": {
        "mode": "prepared",
        "prepared": false
      },
      "scaling": {
        "mode": "level",
        "formula": ""
      },
      "activation": {
        "type": "action",
        "cost": 1,
        "condition": ""
      },
      "duration": {
        "value": null,
        "units": "inst"
      },
      "target": {
        "value": null,
        "width": null,
        "units": "",
        "type": ""
      },
      "range": {
        "value": 60,
        "long": null,
        "units": "ft"
      },
      "uses": {
        "value": null,
        "max": "",
        "per": null,
        "recovery": "",
        "prompt": true
      },
      "actionType": "save",
      "attack": {
        "bonus": "",
        "flat": false
      },
      "damage": {
        "parts": [
          [
            "10d6 + 40",
            "force"
          ]
        ],
        "versatile": ""
      },
      "save": {
        "ability": "dex",
        "dc": null,
        "scaling": "spell"
      },
      "chatFlavor": "",
      "formula": ""
    },
    "effects": [],
    "flags": {},
    "folder": null,
    "sort": 0,
    "ownership": {
      "default": 0
    },
    "_stats": {
      "compendiumSource": null,
      "duplicateSource": null,
      "coreVersion": "13",
      "systemId": "dnd5e",
      "systemVersion": "5.1.10",
      "createdTime": null,
      "modifiedTime": null,
      "lastModifiedBy": null
    }
  },
  {
    "_id": "6e29f6fe4000864c",
    "name": "Dominate Monster",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You attempt to beguile a creature that you can see within range. It must succeed on a Wisdom saving throw or be charmed by you for the duration. If you or creatures that are friendly to you are fighting it, it has advantage on the saving throw.\nWhile the creature is charmed, you have a telepathic link with it as long as the two of you are on the same plane of existence. You can use this telepathic link to issue commands to the creature while you are conscious (no action required), which it does its best to obey. You can specify a simple and general course of action, such as \"Attack that creature,\" \"Run over there,\" or \"Fetch that object.\" If the creature completes the order and doesn’t receive further direction from you, it defends and preserves itself to the best of its ability.\nYou can use your action to take total and precise control of the target. Until the end of your next turn, the creature takes only the actions you choose, and doesn’t do anything that you don’t allow it to do. During this time, you can also cause the creature to use a reaction, but this requires you to use your own reaction as well.\nEach time the target takes damage, it makes a new Wisdom saving throw against the creation. If the saving throw succeeds, the creation ends.</p><p><strong>At Higher Levels.</strong> When you use this creation with a 7th-level creation slot, the duration is concentration, up to 8 hours. When you use this creation with a 8th-level creation slot, the duration is concentration, up to 24 hours. When you use this creation with a 9th-level creation slot, the duration lasts as long as you want without concentration, or until you use this creation again on another creature.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 6,
      "school": "enc",
      "components": {
        "value": "",
        "vocal": true,
        "somatic": true,
        "material": false,
        "ritual": false,
        "concentration": true
      },
      "materials": {
        "value": "",
        "consumed": false,
        "cost": 0,
        "supply": 0
      },
      "preparation": {
        "mode": "prepared",
        "prepared": false
      },
      "scaling": {
        "mode": "level",
        "formula": ""
      },
      "activation": {
        "type": "action",
        "cost": 1,
        "condition": ""
      },
      "duration": {
        "value": "1",
        "units": "hour"
      },
      "target": {
        "value": null,
        "width": null,
        "units": "",
        "type": ""
      },
      "range": {
        "value": 60,
        "long": null,
        "units": "ft"
      },
      "uses": {
        "value": null,
        "max": "",
        "per": null,
        "recovery": "",
        "prompt": true
      },
      "actionType": "save",
      "attack": {
        "bonus": "",
        "flat": false
      },
      "damage": {
        "parts": [],
        "versatile": ""
      },
      "save": {
        "ability": "wis",
        "dc": null,
        "scaling": "spell"
      },
      "chatFlavor": "",
      "formula": ""
    },
    "effects": [],
    "flags": {},
    "folder": null,
    "sort": 0,
    "ownership": {
      "default": 0
    },
    "_stats": {
      "compendiumSource": null,
      "duplicateSource": null,
      "coreVersion": "13",
      "systemId": "dnd5e",
      "systemVersion": "5.1.10",
      "createdTime": null,
      "modifiedTime": null,
      "lastModifiedBy": null
    }
  },
  {
    "_id": "afd635a83dabaf3d",
    "name": "Draconic Transformation",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You take on physical attributes that cause you to resemble a dragon. Select a damage type from acid, cold, fire, poison, thunder, or lightning. You gain 60 temporary hits points and the following benefits until the creation ends:\n<em> <strong>Blindsight.</strong> You have blindsight with a range of 30 feet. Within that range, you can effectively see anything that isn’t behind total cover, even if you’re blinded or in darkness. Moreover, you can see an invisible creature, unless the creature successfully hides from you.\n</em> <strong>Wings.</strong> Wings sprout from your back. You have a flying speed of 60 feet.\n<em> <strong>Dragon’s Breath.</strong> When you use this creation, and as a bonus action on subsequent turns for the duration, you can exhale destructive energy in a 60-foot cone. Each creature in that area must make a Dexterity saving throw, taking 6d8 of the damage you chose on a failed save, or half as much damage on a successful one.\n</em> <strong>Dragon’s Resilience.</strong> You gain a +1 bonus to your armor class. Additionally, you gain immunity to the damage type you chose.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 6,
      "school": "trs",
      "components": {
        "value": "",
        "vocal": true,
        "somatic": true,
        "material": true,
        "ritual": false,
        "concentration": true
      },
      "materials": {
        "value": "a handful of lizard bones",
        "consumed": false,
        "cost": 0,
        "supply": 0
      },
      "preparation": {
        "mode": "prepared",
        "prepared": false
      },
      "scaling": {
        "mode": "none",
        "formula": ""
      },
      "activation": {
        "type": "bonus",
        "cost": 1,
        "condition": ""
      },
      "duration": {
        "value": "10",
        "units": "minute"
      },
      "target": {
        "value": null,
        "width": null,
        "units": "",
        "type": "self"
      },
      "range": {
        "value": null,
        "long": null,
        "units": "self"
      },
      "uses": {
        "value": null,
        "max": "",
        "per": null,
        "recovery": "",
        "prompt": true
      },
      "actionType": "save",
      "attack": {
        "bonus": "",
        "flat": false
      },
      "damage": {
        "parts": [],
        "versatile": ""
      },
      "save": {
        "ability": "dex",
        "dc": null,
        "scaling": "spell"
      },
      "chatFlavor": "",
      "formula": ""
    },
    "effects": [],
    "flags": {},
    "folder": null,
    "sort": 0,
    "ownership": {
      "default": 0
    },
    "_stats": {
      "compendiumSource": null,
      "duplicateSource": null,
      "coreVersion": "13",
      "systemId": "dnd5e",
      "systemVersion": "5.1.10",
      "createdTime": null,
      "modifiedTime": null,
      "lastModifiedBy": null
    }
  },
  {
    "_id": "f0e0967867dab07b",
    "name": "Embody Flames",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p><ul>Flames race across your body, shedding bright light in a 30-foot radius and dim light for an additional 30 feet for the creations’s duration. The flames don’t harm you. Until the creation ends, you gain the following benefits:\n<em> You are immune to fire damage and have resistance to cold damage.\n</em> Any creature that moves within 10 feet of you for the first time on a turn or ends its turn there takes 2d10 fire damage.</p><p><li>You can use your bonus action to create a line of fire 30 feet long and 5 feet wide extending from you in a direction you choose. Each creature in the line must make a Dexterity saving throw. A creature takes 4d8 fire damage on a failed save, or half as much damage on a successful one.</li></ul></p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 6,
      "school": "trs",
      "components": {
        "value": "",
        "vocal": true,
        "somatic": true,
        "material": false,
        "ritual": false,
        "concentration": false
      },
      "materials": {
        "value": "",
        "consumed": false,
        "cost": 0,
        "supply": 0
      },
      "preparation": {
        "mode": "prepared",
        "prepared": false
      },
      "scaling": {
        "mode": "none",
        "formula": ""
      },
      "activation": {
        "type": "action",
        "cost": 1,
        "condition": ""
      },
      "duration": {
        "value": "10",
        "units": "minute"
      },
      "target": {
        "value": null,
        "width": null,
        "units": "",
        "type": "self"
      },
      "range": {
        "value": null,
        "long": null,
        "units": "self"
      },
      "uses": {
        "value": null,
        "max": "",
        "per": null,
        "recovery": "",
        "prompt": true
      },
      "actionType": "save",
      "attack": {
        "bonus": "",
        "flat": false
      },
      "damage": {
        "parts": [
          [
            "2d10",
            "fire"
          ],
          [
            "4d8",
            "fire"
          ]
        ],
        "versatile": ""
      },
      "save": {
        "ability": "dex",
        "dc": null,
        "scaling": "spell"
      },
      "chatFlavor": "",
      "formula": ""
    },
    "effects": [],
    "flags": {},
    "folder": null,
    "sort": 0,
    "ownership": {
      "default": 0
    },
    "_stats": {
      "compendiumSource": null,
      "duplicateSource": null,
      "coreVersion": "13",
      "systemId": "dnd5e",
      "systemVersion": "5.1.10",
      "createdTime": null,
      "modifiedTime": null,
      "lastModifiedBy": null
    }
  },
  {
    "_id": "65b04a28ef516acc",
    "name": "Embody Frost",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>Until the creation ends, ice rimes your body, and you gain the following benefits:\n<em> You are immune to cold damage and have resistance to fire damage.\n</em> You can move across difficult terrain created by ice or snow without spending extra movement.\n<em> The ground in a 15-foot radius around you is icy and is difficult terrain for creatures other than you. The radius moves with you.\n</em> You can use your bonus action to create a 20-foot cone of freezing wind extending from your outstretched hand in a direction you choose. Each creature in the cone must make a Constitution saving throw. A creature takes 4d6 cold damage on a failed save, or half as much damage on a successful one. A creature that fails its save against this effect has its speed halved until the start of your next turn.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 6,
      "school": "trs",
      "components": {
        "value": "",
        "vocal": true,
        "somatic": true,
        "material": false,
        "ritual": false,
        "concentration": false
      },
      "materials": {
        "value": "",
        "consumed": false,
        "cost": 0,
        "supply": 0
      },
      "preparation": {
        "mode": "prepared",
        "prepared": false
      },
      "scaling": {
        "mode": "none",
        "formula": ""
      },
      "activation": {
        "type": "action",
        "cost": 1,
        "condition": ""
      },
      "duration": {
        "value": "10",
        "units": "minute"
      },
      "target": {
        "value": null,
        "width": null,
        "units": "",
        "type": "self"
      },
      "range": {
        "value": null,
        "long": null,
        "units": "self"
      },
      "uses": {
        "value": null,
        "max": "",
        "per": null,
        "recovery": "",
        "prompt": true
      },
      "actionType": "save",
      "attack": {
        "bonus": "",
        "flat": false
      },
      "damage": {
        "parts": [
          [
            "4d6",
            "cold"
          ]
        ],
        "versatile": ""
      },
      "save": {
        "ability": "con",
        "dc": null,
        "scaling": "spell"
      },
      "chatFlavor": "",
      "formula": ""
    },
    "effects": [],
    "flags": {},
    "folder": null,
    "sort": 0,
    "ownership": {
      "default": 0
    },
    "_stats": {
      "compendiumSource": null,
      "duplicateSource": null,
      "coreVersion": "13",
      "systemId": "dnd5e",
      "systemVersion": "5.1.10",
      "createdTime": null,
      "modifiedTime": null,
      "lastModifiedBy": null
    }
  },
  {
    "_id": "71ed540361d97b29",
    "name": "Embody Stone",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p><ul>Until the creation ends, bits of rock spread across your body, and you gain the following benefits:\n<em> You have resistance to bludgeoning, piercing, and slashing damage.\n</em> You can use your bonus action to create a small earthquake on the ground in a 20-foot radius centered on you. Other creatures on that ground must succeed on a Dexterity saving throw or be knocked prone and take 4d6 bludgeoning damage. On a success, they only take half damage.</p><p><li>You can move across difficult terrain made of earth or stone without spending extra movement. You can move through solid earth or stone as if it was air and without destabilizing it.</li></ul></p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 6,
      "school": "trs",
      "components": {
        "value": "",
        "vocal": true,
        "somatic": true,
        "material": false,
        "ritual": false,
        "concentration": false
      },
      "materials": {
        "value": "",
        "consumed": false,
        "cost": 0,
        "supply": 0
      },
      "preparation": {
        "mode": "prepared",
        "prepared": false
      },
      "scaling": {
        "mode": "none",
        "formula": ""
      },
      "activation": {
        "type": "action",
        "cost": 1,
        "condition": ""
      },
      "duration": {
        "value": "10",
        "units": "minute"
      },
      "target": {
        "value": null,
        "width": null,
        "units": "",
        "type": "self"
      },
      "range": {
        "value": null,
        "long": null,
        "units": "self"
      },
      "uses": {
        "value": null,
        "max": "",
        "per": null,
        "recovery": "",
        "prompt": true
      },
      "actionType": "save",
      "attack": {
        "bonus": "",
        "flat": false
      },
      "damage": {
        "parts": [
          [
            "4d6",
            "bludgeoning"
          ]
        ],
        "versatile": ""
      },
      "save": {
        "ability": "dex",
        "dc": null,
        "scaling": "spell"
      },
      "chatFlavor": "",
      "formula": ""
    },
    "effects": [],
    "flags": {},
    "folder": null,
    "sort": 0,
    "ownership": {
      "default": 0
    },
    "_stats": {
      "compendiumSource": null,
      "duplicateSource": null,
      "coreVersion": "13",
      "systemId": "dnd5e",
      "systemVersion": "5.1.10",
      "createdTime": null,
      "modifiedTime": null,
      "lastModifiedBy": null
    }
  },
  {
    "_id": "d24ae6dae53cd2d2",
    "name": "Embody Winds",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p><ul>Until the creation ends, wind whirls around you, and you gain the following benefits:\n<em> Ranged weapon attacks made against you have disadvantage on the attack roll.\n</em> You gain a flying speed of 60 feet.</p><p><li>You can use your bonus action to create a 20-foot cube of swirling wind centered on a point you can see within 60 feet of you. Each creature in that area must make a Constitution saving throw. A creature takes 3d10 bludgeoning damage on a failed save, or half as much damage on a successful one. If a Large or smaller creature fails the save, that creature is also pushed up to 10 feet away from the center of the cube.</li></ul></p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 6,
      "school": "trs",
      "components": {
        "value": "",
        "vocal": true,
        "somatic": true,
        "material": false,
        "ritual": false,
        "concentration": false
      },
      "materials": {
        "value": "",
        "consumed": false,
        "cost": 0,
        "supply": 0
      },
      "preparation": {
        "mode": "prepared",
        "prepared": false
      },
      "scaling": {
        "mode": "none",
        "formula": ""
      },
      "activation": {
        "type": "action",
        "cost": 1,
        "condition": ""
      },
      "duration": {
        "value": "10",
        "units": "minute"
      },
      "target": {
        "value": null,
        "width": null,
        "units": "",
        "type": "self"
      },
      "range": {
        "value": null,
        "long": null,
        "units": "self"
      },
      "uses": {
        "value": null,
        "max": "",
        "per": null,
        "recovery": "",
        "prompt": true
      },
      "actionType": "rsak",
      "attack": {
        "bonus": "",
        "flat": false
      },
      "damage": {
        "parts": [
          [
            "3d10",
            "bludgeoning"
          ]
        ],
        "versatile": ""
      },
      "save": {
        "ability": "",
        "dc": null,
        "scaling": "spell"
      },
      "chatFlavor": "",
      "formula": ""
    },
    "effects": [],
    "flags": {},
    "folder": null,
    "sort": 0,
    "ownership": {
      "default": 0
    },
    "_stats": {
      "compendiumSource": null,
      "duplicateSource": null,
      "coreVersion": "13",
      "systemId": "dnd5e",
      "systemVersion": "5.1.10",
      "createdTime": null,
      "modifiedTime": null,
      "lastModifiedBy": null
    }
  },
  {
    "_id": "13b5a8cf5c450039",
    "name": "Fantasy Mirage (R)",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You make terrain in an area up to 1 mile square look, sound, smell, and even feel like some other sort of terrain. The terrain’s general shape remains the same, however. Open fields or a road could be made to resemble a swamp, hill, crevasse, or some other difficult or impassable terrain. A pond can be made to seem like a grassy meadow, a precipice like a gentle slope, or a rock-strewn gully like a wide and smooth road.\nSimilarly, you can alter the appearance of structures, or add them where none are present. The creation doesn’t disguise, conceal, or add creatures.\nThe illusion includes audible, visual, tactile, and olfactory elements, so it can turn clear ground into difficult terrain (or vice versa) or otherwise impede movement through the area. Any piece of the illusory terrain (such as a rock or stick) that is removed from the creation’s area disappears immediately.\nCreatures with truesight can see through the illusion to the terrain’s true form; however, all other elements of the illusion remain, so while the creature is aware of the illusion’s presence, the creature can still physically interact with the illusion.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 6,
      "school": "ill",
      "components": {
        "value": "",
        "vocal": true,
        "somatic": true,
        "material": false,
        "ritual": true,
        "concentration": false
      },
      "materials": {
        "value": "",
        "consumed": false,
        "cost": 0,
        "supply": 0
      },
      "preparation": {
        "mode": "prepared",
        "prepared": false
      },
      "scaling": {
        "mode": "none",
        "formula": ""
      },
      "activation": {
        "type": "minute",
        "cost": 10,
        "condition": ""
      },
      "duration": {
        "value": "10",
        "units": "day"
      },
      "target": {
        "value": null,
        "width": null,
        "units": "",
        "type": ""
      },
      "range": {
        "value": 30,
        "long": null,
        "units": "ft"
      },
      "uses": {
        "value": null,
        "max": "",
        "per": null,
        "recovery": "",
        "prompt": true
      },
      "actionType": "",
      "attack": {
        "bonus": "",
        "flat": false
      },
      "damage": {
        "parts": [],
        "versatile": ""
      },
      "save": {
        "ability": "",
        "dc": null,
        "scaling": "spell"
      },
      "chatFlavor": "",
      "formula": ""
    },
    "effects": [],
    "flags": {},
    "folder": null,
    "sort": 0,
    "ownership": {
      "default": 0
    },
    "_stats": {
      "compendiumSource": null,
      "duplicateSource": null,
      "coreVersion": "13",
      "systemId": "dnd5e",
      "systemVersion": "5.1.10",
      "createdTime": null,
      "modifiedTime": null,
      "lastModifiedBy": null
    }
  },
  {
    "_id": "4ad2e21d680b2001",
    "name": "Feeble Body",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You blast the body of a creature that you can see within range, attempting to reduce its physical power. The target takes 4d12 necrotic damage and must make a Constitution saving throw.\nOn a failed save, choose Strength, Dexterity, or Constitution. The creature’s ability score for the chosen score becomes 6 for the duration. If you choose Strength, the creature attacks with disadvantage with all melee weapon attacks. If you choose Dexterity, the creature’s movement speeds become 10, if they weren’t already lower, and they cannot take the dash or disengage action. If you choose Constitution, the target cannot maintain concentration, and any resistances to bludgeoning, piercing, and slashing are suppressed.\nAt the end of every hour, the creature can repeat its saving throw against this creation. If it succeeds on its saving throw, the creation ends.\nThe creation can also be ended by the following creations: Greater Restoration, Heal, or Ultimate Heal.</p><p><strong>At Higher Levels.</strong> When you use this using a creation slot of 7th level, the creation deals an extra 1d12 damage for a total of 5d12, and the duration increases to 1 week and the saving throws are made at the end of every day. When you use this using a creation slot of 8th level, the creation deals an extra 2d12 damage for a total of 6d12, and the duration increases to 1 month. When you use this using a creation slot of 9th level, the creation deals an extra 3d12 damage for a total of 7d12, and the duration increases to 1 year, and the saving throws are instead remade at the end of every month.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 6,
      "school": "nec",
      "components": {
        "value": "",
        "vocal": true,
        "somatic": true,
        "material": true,
        "ritual": false,
        "concentration": false
      },
      "materials": {
        "value": "a rotting fruit",
        "consumed": false,
        "cost": 0,
        "supply": 0
      },
      "preparation": {
        "mode": "prepared",
        "prepared": false
      },
      "scaling": {
        "mode": "level",
        "formula": ""
      },
      "activation": {
        "type": "action",
        "cost": 1,
        "condition": ""
      },
      "duration": {
        "value": "24",
        "units": "hour"
      },
      "target": {
        "value": null,
        "width": null,
        "units": "",
        "type": "space"
      },
      "range": {
        "value": 120,
        "long": null,
        "units": "ft"
      },
      "uses": {
        "value": null,
        "max": "",
        "per": null,
        "recovery": "",
        "prompt": true
      },
      "actionType": "msak",
      "attack": {
        "bonus": "",
        "flat": false
      },
      "damage": {
        "parts": [
          [
            "4d12",
            "necrotic"
          ]
        ],
        "versatile": ""
      },
      "save": {
        "ability": "",
        "dc": null,
        "scaling": "spell"
      },
      "chatFlavor": "",
      "formula": ""
    },
    "effects": [],
    "flags": {},
    "folder": null,
    "sort": 0,
    "ownership": {
      "default": 0
    },
    "_stats": {
      "compendiumSource": null,
      "duplicateSource": null,
      "coreVersion": "13",
      "systemId": "dnd5e",
      "systemVersion": "5.1.10",
      "createdTime": null,
      "modifiedTime": null,
      "lastModifiedBy": null
    }
  },
  {
    "_id": "018e03508c86328e",
    "name": "Freezing Sphere",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>A frigid globe of cold energy streaks from you to a point of your choice within range, where it explodes in a 60-foot-radius sphere. Each creature within the area must make a Constitution saving throw. On a failed save, a creature takes 12d6 cold damage. On a successful save, it takes half as much damage.\nIf the globe strikes a body of water or a liquid that is principally water (not including water-based creatures), it freezes the liquid to a depth of 6 inches over an area 30 feet square. This ice lasts for 1 minute. Creatures that were swimming on the surface of frozen water are trapped in the ice. A trapped creature can use an action to make a Strength check against your creation save DC to break free.\nYou can refrain from firing the globe after completing the spell, if you wish. A small globe about the size of a sling stone, cool to the touch, appears in your hand. At any time, you or a creature you give the globe to can throw the globe (to a range of 40 feet) or hurl it with a sling (to the sling’s normal range). It shatters on impact, with the same effect as the normal casting of the creation. You can also set the globe down without shattering it. After 1 minute, if the globe hasn’t already shattered, it explodes.</p><p><strong>At Higher Levels.</strong> When you use this creation with a creation slot of 7th level or higher, the damage increases by 1d6 for each slot level above 6th.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 6,
      "school": "evo",
      "components": {
        "value": "",
        "vocal": true,
        "somatic": true,
        "material": true,
        "ritual": false,
        "concentration": false
      },
      "materials": {
        "value": "a small crystal sphere",
        "consumed": false,
        "cost": 0,
        "supply": 0
      },
      "preparation": {
        "mode": "prepared",
        "prepared": false
      },
      "scaling": {
        "mode": "level",
        "formula": ""
      },
      "activation": {
        "type": "action",
        "cost": 1,
        "condition": ""
      },
      "duration": {
        "value": null,
        "units": "inst"
      },
      "target": {
        "value": null,
        "width": null,
        "units": "",
        "type": ""
      },
      "range": {
        "value": 300,
        "long": null,
        "units": "ft"
      },
      "uses": {
        "value": null,
        "max": "",
        "per": null,
        "recovery": "",
        "prompt": true
      },
      "actionType": "save",
      "attack": {
        "bonus": "",
        "flat": false
      },
      "damage": {
        "parts": [
          [
            "12d6",
            "cold"
          ]
        ],
        "versatile": ""
      },
      "save": {
        "ability": "con",
        "dc": null,
        "scaling": "spell"
      },
      "chatFlavor": "",
      "formula": ""
    },
    "effects": [],
    "flags": {},
    "folder": null,
    "sort": 0,
    "ownership": {
      "default": 0
    },
    "_stats": {
      "compendiumSource": null,
      "duplicateSource": null,
      "coreVersion": "13",
      "systemId": "dnd5e",
      "systemVersion": "5.1.10",
      "createdTime": null,
      "modifiedTime": null,
      "lastModifiedBy": null
    }
  },
  {
    "_id": "b4f1063becb8e340",
    "name": "Gravity Fissure",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You manifest a ravine of gravitational energy in a line originating from you that is 100 feet long and 5 feet wide. Each creature in that line must make a Constitution saving throw, taking 8d8 force damage on a failed save, or half as much damage on a successful one.\nEach creature within 10 feet of the line but not in it must succeed on a Constitution saving throw or take 8d8 force damage and be pulled toward the line until the creature is in its area.</p><p><strong>At Higher Levels.</strong> When you use this creation with a creation slot of 7th level or higher, the damage increases by 1d8 for each slot level above 6th.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 6,
      "school": "evo",
      "components": {
        "value": "",
        "vocal": true,
        "somatic": true,
        "material": true,
        "ritual": false,
        "concentration": false
      },
      "materials": {
        "value": "a fistful of iron filings",
        "consumed": false,
        "cost": 0,
        "supply": 0
      },
      "preparation": {
        "mode": "prepared",
        "prepared": false
      },
      "scaling": {
        "mode": "level",
        "formula": ""
      },
      "activation": {
        "type": "action",
        "cost": 1,
        "condition": ""
      },
      "duration": {
        "value": null,
        "units": "inst"
      },
      "target": {
        "value": null,
        "width": null,
        "units": "",
        "type": ""
      },
      "range": {
        "value": null,
        "long": null,
        "units": ""
      },
      "uses": {
        "value": null,
        "max": "",
        "per": null,
        "recovery": "",
        "prompt": true
      },
      "actionType": "save",
      "attack": {
        "bonus": "",
        "flat": false
      },
      "damage": {
        "parts": [
          [
            "8d8",
            "force"
          ]
        ],
        "versatile": ""
      },
      "save": {
        "ability": "con",
        "dc": null,
        "scaling": "spell"
      },
      "chatFlavor": "",
      "formula": ""
    },
    "effects": [],
    "flags": {},
    "folder": null,
    "sort": 0,
    "ownership": {
      "default": 0
    },
    "_stats": {
      "compendiumSource": null,
      "duplicateSource": null,
      "coreVersion": "13",
      "systemId": "dnd5e",
      "systemVersion": "5.1.10",
      "createdTime": null,
      "modifiedTime": null,
      "lastModifiedBy": null
    }
  },
  {
    "_id": "6af08e2e3eabe670",
    "name": "Greater Floating Shield",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You create a protective field of that surrounds a creature of your choice within range (you can choose yourself). The field sheds dim light out to 5 feet. While surrounded by the field, a creature gains the following benefits:\n<strong>Cover.</strong> The creature has half cover.\n<strong>Damage Resistance.</strong> The creature has resistance to all damage except psychic, force, radiant, and necrotic.\n<strong>Evasion.</strong> If the creature is subjected to an effect that allows it to make a Dexterity saving throw to take only half damage, the creature instead takes no damage if it succeeds on the saving throw, and only half damage if it fails.\nAs a bonus action on subsequent turns, you can move the field to another creature within 60 feet of the field.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 6,
      "school": "abj",
      "components": {
        "value": "",
        "vocal": true,
        "somatic": true,
        "material": true,
        "ritual": false,
        "concentration": true
      },
      "materials": {
        "value": "a piece of metal worth at least 5,000,000 Berries",
        "consumed": false,
        "cost": 0,
        "supply": 0
      },
      "preparation": {
        "mode": "prepared",
        "prepared": false
      },
      "scaling": {
        "mode": "none",
        "formula": ""
      },
      "activation": {
        "type": "bonus",
        "cost": 1,
        "condition": ""
      },
      "duration": {
        "value": "1",
        "units": "minute"
      },
      "target": {
        "value": null,
        "width": null,
        "units": "",
        "type": ""
      },
      "range": {
        "value": 60,
        "long": null,
        "units": "ft"
      },
      "uses": {
        "value": null,
        "max": "",
        "per": null,
        "recovery": "",
        "prompt": true
      },
      "actionType": "save",
      "attack": {
        "bonus": "",
        "flat": false
      },
      "damage": {
        "parts": [],
        "versatile": ""
      },
      "save": {
        "ability": "",
        "dc": null,
        "scaling": "spell"
      },
      "chatFlavor": "",
      "formula": ""
    },
    "effects": [],
    "flags": {},
    "folder": null,
    "sort": 0,
    "ownership": {
      "default": 0
    },
    "_stats": {
      "compendiumSource": null,
      "duplicateSource": null,
      "coreVersion": "13",
      "systemId": "dnd5e",
      "systemVersion": "5.1.10",
      "createdTime": null,
      "modifiedTime": null,
      "lastModifiedBy": null
    }
  },
  {
    "_id": "10755b4214e7d7c0",
    "name": "Guardian Globe",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>An immobile, barrier springs into existence in a 10-foot radius around you and remains for the duration.\nAny creation of 5th level or lower activated from outside the barrier can’t affect creatures or objects within it, even if the creation is used with a higher level creation slot. Such a creation can target creatures and objects within the barrier, but the creation has no effect on them. Similarly, the area within the barrier is excluded from the areas affected by such creation.\nAt Higher Levels. When you use this creation with a creation slot of 7th level or higher, the barrier blocks creations of one level higher for each slot level above 6th.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 6,
      "school": "abj",
      "components": {
        "value": "",
        "vocal": true,
        "somatic": true,
        "material": true,
        "ritual": false,
        "concentration": true
      },
      "materials": {
        "value": "a glass bead",
        "consumed": false,
        "cost": 0,
        "supply": 0
      },
      "preparation": {
        "mode": "prepared",
        "prepared": false
      },
      "scaling": {
        "mode": "none",
        "formula": ""
      },
      "activation": {
        "type": "action",
        "cost": 1,
        "condition": ""
      },
      "duration": {
        "value": "1",
        "units": "minute"
      },
      "target": {
        "value": null,
        "width": null,
        "units": "",
        "type": ""
      },
      "range": {
        "value": null,
        "long": null,
        "units": ""
      },
      "uses": {
        "value": null,
        "max": "",
        "per": null,
        "recovery": "",
        "prompt": true
      },
      "actionType": "",
      "attack": {
        "bonus": "",
        "flat": false
      },
      "damage": {
        "parts": [],
        "versatile": ""
      },
      "save": {
        "ability": "",
        "dc": null,
        "scaling": "spell"
      },
      "chatFlavor": "",
      "formula": ""
    },
    "effects": [],
    "flags": {},
    "folder": null,
    "sort": 0,
    "ownership": {
      "default": 0
    },
    "_stats": {
      "compendiumSource": null,
      "duplicateSource": null,
      "coreVersion": "13",
      "systemId": "dnd5e",
      "systemVersion": "5.1.10",
      "createdTime": null,
      "modifiedTime": null,
      "lastModifiedBy": null
    }
  },
  {
    "_id": "132d86f448885754",
    "name": "Harm",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You unleash a virulent disease on a creature that you can see within range. The target must make a Constitution saving throw. On a failed save, it takes 14d8 necrotic damage, or half as much damage on a successful save. The damage can’t reduce the target’s hit points below 1. If the target fails the saving throw, its hit point maximum is reduced for 1 hour by an amount equal to the necrotic damage it took. Any effect that removes a disease allows a creature’s hit point maximum to return to normal before that time passes.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 6,
      "school": "nec",
      "components": {
        "value": "",
        "vocal": true,
        "somatic": true,
        "material": false,
        "ritual": false,
        "concentration": false
      },
      "materials": {
        "value": "",
        "consumed": false,
        "cost": 0,
        "supply": 0
      },
      "preparation": {
        "mode": "prepared",
        "prepared": false
      },
      "scaling": {
        "mode": "none",
        "formula": ""
      },
      "activation": {
        "type": "action",
        "cost": 1,
        "condition": ""
      },
      "duration": {
        "value": null,
        "units": "inst"
      },
      "target": {
        "value": null,
        "width": null,
        "units": "",
        "type": ""
      },
      "range": {
        "value": 60,
        "long": null,
        "units": "ft"
      },
      "uses": {
        "value": null,
        "max": "",
        "per": null,
        "recovery": "",
        "prompt": true
      },
      "actionType": "save",
      "attack": {
        "bonus": "",
        "flat": false
      },
      "damage": {
        "parts": [
          [
            "14d8",
            "necrotic"
          ]
        ],
        "versatile": ""
      },
      "save": {
        "ability": "con",
        "dc": null,
        "scaling": "spell"
      },
      "chatFlavor": "",
      "formula": ""
    },
    "effects": [],
    "flags": {},
    "folder": null,
    "sort": 0,
    "ownership": {
      "default": 0
    },
    "_stats": {
      "compendiumSource": null,
      "duplicateSource": null,
      "coreVersion": "13",
      "systemId": "dnd5e",
      "systemVersion": "5.1.10",
      "createdTime": null,
      "modifiedTime": null,
      "lastModifiedBy": null
    }
  },
  {
    "_id": "53e63c27e476d3fd",
    "name": "Heal",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>Choose a creature that you can see within range. A surge of positive energy washes through the creature, causing it to regain 70 hit points. The creation also ends blindness, deafness, and any diseases affecting the target. This creation has no effect on constructs or undead.</p><p><strong>At Higher Levels.</strong> When you use this creation with a creation slot of 7th level or higher, the amount of healing increases by 15 for each slot level above 6th.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 6,
      "school": "evo",
      "components": {
        "value": "",
        "vocal": true,
        "somatic": true,
        "material": false,
        "ritual": false,
        "concentration": false
      },
      "materials": {
        "value": "",
        "consumed": false,
        "cost": 0,
        "supply": 0
      },
      "preparation": {
        "mode": "prepared",
        "prepared": false
      },
      "scaling": {
        "mode": "level",
        "formula": ""
      },
      "activation": {
        "type": "action",
        "cost": 1,
        "condition": ""
      },
      "duration": {
        "value": null,
        "units": "inst"
      },
      "target": {
        "value": null,
        "width": null,
        "units": "",
        "type": ""
      },
      "range": {
        "value": 60,
        "long": null,
        "units": "ft"
      },
      "uses": {
        "value": null,
        "max": "",
        "per": null,
        "recovery": "",
        "prompt": true
      },
      "actionType": "",
      "attack": {
        "bonus": "",
        "flat": false
      },
      "damage": {
        "parts": [],
        "versatile": ""
      },
      "save": {
        "ability": "",
        "dc": null,
        "scaling": "spell"
      },
      "chatFlavor": "",
      "formula": ""
    },
    "effects": [],
    "flags": {},
    "folder": null,
    "sort": 0,
    "ownership": {
      "default": 0
    },
    "_stats": {
      "compendiumSource": null,
      "duplicateSource": null,
      "coreVersion": "13",
      "systemId": "dnd5e",
      "systemVersion": "5.1.10",
      "createdTime": null,
      "modifiedTime": null,
      "lastModifiedBy": null
    }
  },
  {
    "_id": "0b62b0da4014f2e9",
    "name": "Hero's Feast",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You bring forth a great feast, including magnificent food and drink. The feast takes 1 hour to consume and disappears at the end of that time, and the beneficial effects don’t set in until this hour is over. Up to twelve creatures can partake of the feast.\nA creature that partakes of the feast gains several benefits. The creature is cured of all diseases and poison, becomes immune to poison and being frightened, and makes all Wisdom saving throws with advantage. Its hit point maximum also increases by 2d10 + your creativity ability modifier, and it gains the same number of hit points. These benefits last for 24 hours.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 6,
      "school": "con",
      "components": {
        "value": "",
        "vocal": true,
        "somatic": true,
        "material": true,
        "ritual": false,
        "concentration": false
      },
      "materials": {
        "value": "a gem-encrusted bowl worth at least 10,000,000 Berries, which the creation consumes",
        "consumed": false,
        "cost": 0,
        "supply": 0
      },
      "preparation": {
        "mode": "prepared",
        "prepared": false
      },
      "scaling": {
        "mode": "none",
        "formula": ""
      },
      "activation": {
        "type": "minute",
        "cost": 10,
        "condition": ""
      },
      "duration": {
        "value": null,
        "units": "inst"
      },
      "target": {
        "value": null,
        "width": null,
        "units": "",
        "type": ""
      },
      "range": {
        "value": 30,
        "long": null,
        "units": "ft"
      },
      "uses": {
        "value": null,
        "max": "",
        "per": null,
        "recovery": "",
        "prompt": true
      },
      "actionType": "save",
      "attack": {
        "bonus": "",
        "flat": false
      },
      "damage": {
        "parts": [],
        "versatile": ""
      },
      "save": {
        "ability": "",
        "dc": null,
        "scaling": "spell"
      },
      "chatFlavor": "",
      "formula": ""
    },
    "effects": [],
    "flags": {},
    "folder": null,
    "sort": 0,
    "ownership": {
      "default": 0
    },
    "_stats": {
      "compendiumSource": null,
      "duplicateSource": null,
      "coreVersion": "13",
      "systemId": "dnd5e",
      "systemVersion": "5.1.10",
      "createdTime": null,
      "modifiedTime": null,
      "lastModifiedBy": null
    }
  },
  {
    "_id": "e525530475f32c85",
    "name": "Irresistible Dance",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>Choose one creature that you can see within range. The target begins a comic dance in place: shuffling, tapping its feet, and capering for the duration. Creatures that can’t be charmed are immune to this creation.\nA dancing creature must use all its movement to dance without leaving its space and has disadvantage on Dexterity saving throws and attack rolls. While the target is affected by this creation, other creatures have advantage on attack rolls against it.\nAs an action, a dancing creature makes a Wisdom saving throw to regain control of itself. On a successful save, the creation ends.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 6,
      "school": "enc",
      "components": {
        "value": "",
        "vocal": true,
        "somatic": false,
        "material": false,
        "ritual": false,
        "concentration": true
      },
      "materials": {
        "value": "",
        "consumed": false,
        "cost": 0,
        "supply": 0
      },
      "preparation": {
        "mode": "prepared",
        "prepared": false
      },
      "scaling": {
        "mode": "none",
        "formula": ""
      },
      "activation": {
        "type": "action",
        "cost": 1,
        "condition": ""
      },
      "duration": {
        "value": "1",
        "units": "minute"
      },
      "target": {
        "value": null,
        "width": null,
        "units": "",
        "type": ""
      },
      "range": {
        "value": 30,
        "long": null,
        "units": "ft"
      },
      "uses": {
        "value": null,
        "max": "",
        "per": null,
        "recovery": "",
        "prompt": true
      },
      "actionType": "save",
      "attack": {
        "bonus": "",
        "flat": false
      },
      "damage": {
        "parts": [],
        "versatile": ""
      },
      "save": {
        "ability": "",
        "dc": null,
        "scaling": "spell"
      },
      "chatFlavor": "",
      "formula": ""
    },
    "effects": [],
    "flags": {},
    "folder": null,
    "sort": 0,
    "ownership": {
      "default": 0
    },
    "_stats": {
      "compendiumSource": null,
      "duplicateSource": null,
      "coreVersion": "13",
      "systemId": "dnd5e",
      "systemVersion": "5.1.10",
      "createdTime": null,
      "modifiedTime": null,
      "lastModifiedBy": null
    }
  },
  {
    "_id": "08d08b36343f67a8",
    "name": "Mass Suggestion",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You suggest a course of activity (limited to a sentence or two) and influence up to twelve creatures of your choice that you can see within range and that can hear and understand you. Creatures that can’t be charmed are immune to this effect. The suggestion must be worded in such a manner as to make the course of action sound reasonable. Obviously harmful activities such as asking the creature to stab itself, or outlandish and out of character behavior for the target such as forcing intercourse with someone they have never met ends the creation.\nEach target must make a Wisdom saving throw. On a failed save, it pursues the course of action you described to the best of its ability. The suggested course of action can continue for the entire duration. If the suggested activity can be completed in a shorter time, the creation ends when the subject finishes what it was asked to do.\nYou can also specify conditions that will trigger a special activity during the duration. For example, you might suggest that a group of soldiers give all their money to the first beggar they meet. If the condition isn’t met before the creation ends, the activity isn’t performed.\nIf you or any of your companions damage a creature affected by this creation, the creation ends for that creature.</p><p><strong>At Higher Levels.</strong> When you cuse this creation with a 7th-level creation slot, the duration is 10 days. When you use an 8th-level creation slot, the duration is 30 days. When you use a 9th-level creation slot, the duration is a year and a day.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 6,
      "school": "enc",
      "components": {
        "value": "",
        "vocal": true,
        "somatic": false,
        "material": true,
        "ritual": false,
        "concentration": false
      },
      "materials": {
        "value": "a snake's tongue",
        "consumed": false,
        "cost": 0,
        "supply": 0
      },
      "preparation": {
        "mode": "prepared",
        "prepared": false
      },
      "scaling": {
        "mode": "level",
        "formula": ""
      },
      "activation": {
        "type": "action",
        "cost": 1,
        "condition": ""
      },
      "duration": {
        "value": "24",
        "units": "hour"
      },
      "target": {
        "value": null,
        "width": null,
        "units": "",
        "type": ""
      },
      "range": {
        "value": 60,
        "long": null,
        "units": "ft"
      },
      "uses": {
        "value": null,
        "max": "",
        "per": null,
        "recovery": "",
        "prompt": true
      },
      "actionType": "save",
      "attack": {
        "bonus": "",
        "flat": false
      },
      "damage": {
        "parts": [],
        "versatile": ""
      },
      "save": {
        "ability": "wis",
        "dc": null,
        "scaling": "spell"
      },
      "chatFlavor": "",
      "formula": ""
    },
    "effects": [],
    "flags": {},
    "folder": null,
    "sort": 0,
    "ownership": {
      "default": 0
    },
    "_stats": {
      "compendiumSource": null,
      "duplicateSource": null,
      "coreVersion": "13",
      "systemId": "dnd5e",
      "systemVersion": "5.1.10",
      "createdTime": null,
      "modifiedTime": null,
      "lastModifiedBy": null
    }
  },
  {
    "_id": "7dac141c58df8f1b",
    "name": "Mental Prison",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You attempt to bind a creature within an illusory cell that only it perceives. One creature you can see within range must make an Intelligence saving throw. The target succeeds automatically if it is immune to being charmed.\nOn a successful save, the target takes 5d10 psychic damage, and the creation ends. On a failed save, the target takes 5d10 psychic damage, and you make the area immediately around the target’s space appear dangerous to it in some way. You might cause the target to perceive itself as being surrounded by fire, floating razors, or hideous maws filled with dripping teeth.\nWhatever form the illusion takes, the target can’t see or hear anything beyond it and is restrained for the creation’s duration. If the target is moved out of the illusion, makes a melee attack through it, or reaches any part of its body through it, the target takes 10d10 psychic damage, and the creation ends.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 6,
      "school": "ill",
      "components": {
        "value": "",
        "vocal": false,
        "somatic": true,
        "material": false,
        "ritual": false,
        "concentration": true
      },
      "materials": {
        "value": "",
        "consumed": false,
        "cost": 0,
        "supply": 0
      },
      "preparation": {
        "mode": "prepared",
        "prepared": false
      },
      "scaling": {
        "mode": "none",
        "formula": ""
      },
      "activation": {
        "type": "action",
        "cost": 1,
        "condition": ""
      },
      "duration": {
        "value": "1",
        "units": "minute"
      },
      "target": {
        "value": null,
        "width": null,
        "units": "",
        "type": ""
      },
      "range": {
        "value": 60,
        "long": null,
        "units": "ft"
      },
      "uses": {
        "value": null,
        "max": "",
        "per": null,
        "recovery": "",
        "prompt": true
      },
      "actionType": "msak",
      "attack": {
        "bonus": "",
        "flat": false
      },
      "damage": {
        "parts": [
          [
            "5d10",
            "psychic"
          ],
          [
            "10d10",
            "psychic"
          ]
        ],
        "versatile": ""
      },
      "save": {
        "ability": "",
        "dc": null,
        "scaling": "spell"
      },
      "chatFlavor": "",
      "formula": ""
    },
    "effects": [],
    "flags": {},
    "folder": null,
    "sort": 0,
    "ownership": {
      "default": 0
    },
    "_stats": {
      "compendiumSource": null,
      "duplicateSource": null,
      "coreVersion": "13",
      "systemId": "dnd5e",
      "systemVersion": "5.1.10",
      "createdTime": null,
      "modifiedTime": null,
      "lastModifiedBy": null
    }
  },
  {
    "_id": "387b86f237ac4b4f",
    "name": "Mighty Fortress",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>A fortress of stone erupts from a square area of ground of your choice that you can see within range. The area is 120 feet on each side, and it must not have any buildings or other structures on it. Any creatures in the area are harmlessly lifted up as the fortress rises.\nThe fortress has four towers with square bases, each one 20 feet on a side and 30 feet tall, with one tower on each corner. The towers are connected to each other by stone walls that are each 80 feet long, creating an enclosed area. Each wall is 1 foot thick and is composed of panels that are 10 feet wide and 20 feet tall. Each panel is contiguous with two other panels or one other panel and a tower. You can place up to four stone doors in the fortress’s outer wall.\nA small keep stands inside the enclosed area. The keep has a square base that is 50 feet on each side, and it has three floors with 10-foot-high ceilings. Each of the floors can be divided into as many rooms as you like, provided each room is at least 5 feet on each side. The floors of the keep are connected by stone staircases, its walls are 6 inches thick, and interior rooms can have stone doors or open archways as you choose. The keep is furnished and decorated however you like, and when it it initially used, it contains sufficient food to serve a nine-course banquet for up to 100 people.\nThe walls, towers, and keep are all made of stone that can be damaged. Each 10-foot by 10-foot section of stone has AC 15 and 30 hit points per inch of thickness. It is immune to poison and psychic damage. Reducing a section of stone to 0 hit points destroys it and might cause connected sections to buckle and collapse at the DM’s discretion.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 6,
      "school": "con",
      "components": {
        "value": "",
        "vocal": true,
        "somatic": true,
        "material": true,
        "ritual": false,
        "concentration": false
      },
      "materials": {
        "value": "special construction tools worth at least 5,000,000 Berries, which the creation consumes",
        "consumed": false,
        "cost": 0,
        "supply": 0
      },
      "preparation": {
        "mode": "prepared",
        "prepared": false
      },
      "scaling": {
        "mode": "none",
        "formula": ""
      },
      "activation": {
        "type": "minute",
        "cost": 1,
        "condition": ""
      },
      "duration": {
        "value": null,
        "units": "inst"
      },
      "target": {
        "value": null,
        "width": null,
        "units": "",
        "type": ""
      },
      "range": {
        "value": 5280,
        "long": null,
        "units": "ft"
      },
      "uses": {
        "value": null,
        "max": "",
        "per": null,
        "recovery": "",
        "prompt": true
      },
      "actionType": "",
      "attack": {
        "bonus": "",
        "flat": false
      },
      "damage": {
        "parts": [],
        "versatile": ""
      },
      "save": {
        "ability": "",
        "dc": null,
        "scaling": "spell"
      },
      "chatFlavor": "",
      "formula": ""
    },
    "effects": [],
    "flags": {},
    "folder": null,
    "sort": 0,
    "ownership": {
      "default": 0
    },
    "_stats": {
      "compendiumSource": null,
      "duplicateSource": null,
      "coreVersion": "13",
      "systemId": "dnd5e",
      "systemVersion": "5.1.10",
      "createdTime": null,
      "modifiedTime": null,
      "lastModifiedBy": null
    }
  },
  {
    "_id": "dcb50135a300b82a",
    "name": "Mind Blank",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>Until the creation ends, one willing creature you touch is immune to psychic damage, any effect that would sense its emotions or read its thoughts, divination creations, and the charmed condition.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 6,
      "school": "abj",
      "components": {
        "value": "",
        "vocal": true,
        "somatic": true,
        "material": false,
        "ritual": false,
        "concentration": false
      },
      "materials": {
        "value": "",
        "consumed": false,
        "cost": 0,
        "supply": 0
      },
      "preparation": {
        "mode": "prepared",
        "prepared": false
      },
      "scaling": {
        "mode": "none",
        "formula": ""
      },
      "activation": {
        "type": "action",
        "cost": 1,
        "condition": ""
      },
      "duration": {
        "value": "24",
        "units": "hour"
      },
      "target": {
        "value": null,
        "width": null,
        "units": "",
        "type": ""
      },
      "range": {
        "value": null,
        "long": null,
        "units": "touch"
      },
      "uses": {
        "value": null,
        "max": "",
        "per": null,
        "recovery": "",
        "prompt": true
      },
      "actionType": "",
      "attack": {
        "bonus": "",
        "flat": false
      },
      "damage": {
        "parts": [],
        "versatile": ""
      },
      "save": {
        "ability": "",
        "dc": null,
        "scaling": "spell"
      },
      "chatFlavor": "",
      "formula": ""
    },
    "effects": [],
    "flags": {},
    "folder": null,
    "sort": 0,
    "ownership": {
      "default": 0
    },
    "_stats": {
      "compendiumSource": null,
      "duplicateSource": null,
      "coreVersion": "13",
      "systemId": "dnd5e",
      "systemVersion": "5.1.10",
      "createdTime": null,
      "modifiedTime": null,
      "lastModifiedBy": null
    }
  },
  {
    "_id": "3e9be27426bc6c61",
    "name": "Petrify",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You attempt to turn one creature that you can see within range into stone. If the target's body is made of flesh, the creature must make a Constitution saving throw. On a failed save, it is restrained as its flesh begins to harden. On a successful save, the creature isn’t affected.\nA creature restrained by this creation must make another Constitution saving throw at the end of each of its turns. If it successfully saves against this creation three times, the creation ends. If it fails saves three times, it is turned to stone and subjected to the petrified condition for the duration. The successes and failures don’t need to be consecutive; keep track of both until the target collects three of a kind.\nIf the creature is physically broken while petrified, it suffers from similar deformities if it reverts to its original state. If you maintain your concentration on this creation for the entire possible duration, the creature is turned to stone until the effect is removed.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 6,
      "school": "trs",
      "components": {
        "value": "",
        "vocal": true,
        "somatic": true,
        "material": true,
        "ritual": false,
        "concentration": true
      },
      "materials": {
        "value": "a lime",
        "consumed": false,
        "cost": 0,
        "supply": 0
      },
      "preparation": {
        "mode": "prepared",
        "prepared": false
      },
      "scaling": {
        "mode": "none",
        "formula": ""
      },
      "activation": {
        "type": "action",
        "cost": 1,
        "condition": ""
      },
      "duration": {
        "value": "1",
        "units": "minute"
      },
      "target": {
        "value": null,
        "width": null,
        "units": "",
        "type": ""
      },
      "range": {
        "value": 60,
        "long": null,
        "units": "ft"
      },
      "uses": {
        "value": null,
        "max": "",
        "per": null,
        "recovery": "",
        "prompt": true
      },
      "actionType": "save",
      "attack": {
        "bonus": "",
        "flat": false
      },
      "damage": {
        "parts": [],
        "versatile": ""
      },
      "save": {
        "ability": "con",
        "dc": null,
        "scaling": "spell"
      },
      "chatFlavor": "",
      "formula": ""
    },
    "effects": [],
    "flags": {},
    "folder": null,
    "sort": 0,
    "ownership": {
      "default": 0
    },
    "_stats": {
      "compendiumSource": null,
      "duplicateSource": null,
      "coreVersion": "13",
      "systemId": "dnd5e",
      "systemVersion": "5.1.10",
      "createdTime": null,
      "modifiedTime": null,
      "lastModifiedBy": null
    }
  },
  {
    "_id": "a8dba292e2df30df",
    "name": "Project Image",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You create an illusory copy of yourself that lasts for the duration. The copy can appear at any location within range that you have seen before, regardless of intervening obstacles. The illusion looks and sounds like you but is intangible. If the illusion takes any damage, it disappears, and the creation ends.\nYou can use your action to move this illusion up to twice your speed, and make it gesture, speak, and behave in whatever way you choose. It mimics your mannerisms perfectly.\nYou can see through its eyes and hear through its ears as if you were in its space. On your turn as a bonus action, you can switch from using its senses to using your own, or back again. While you are using its senses, you are blinded and deafened in regard to your own surroundings.\nPhysical interaction with the image reveals it to be an illusion, because things can pass through it. A creature that uses its action to examine the image can determine that it is an illusion with a successful Intelligence (Investigation) check against your creation save DC. If a creature discerns the illusion for what it is, the creature can see through the image, and any noise it makes sounds hollow to the creature.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 6,
      "school": "ill",
      "components": {
        "value": "",
        "vocal": true,
        "somatic": true,
        "material": true,
        "ritual": false,
        "concentration": true
      },
      "materials": {
        "value": "a picture of yourself",
        "consumed": false,
        "cost": 0,
        "supply": 0
      },
      "preparation": {
        "mode": "prepared",
        "prepared": false
      },
      "scaling": {
        "mode": "none",
        "formula": ""
      },
      "activation": {
        "type": "action",
        "cost": 1,
        "condition": ""
      },
      "duration": {
        "value": "1",
        "units": "day"
      },
      "target": {
        "value": null,
        "width": null,
        "units": "",
        "type": ""
      },
      "range": {
        "value": 2640000,
        "long": null,
        "units": "ft"
      },
      "uses": {
        "value": null,
        "max": "",
        "per": null,
        "recovery": "",
        "prompt": true
      },
      "actionType": "",
      "attack": {
        "bonus": "",
        "flat": false
      },
      "damage": {
        "parts": [],
        "versatile": ""
      },
      "save": {
        "ability": "",
        "dc": null,
        "scaling": "spell"
      },
      "chatFlavor": "",
      "formula": ""
    },
    "effects": [],
    "flags": {},
    "folder": null,
    "sort": 0,
    "ownership": {
      "default": 0
    },
    "_stats": {
      "compendiumSource": null,
      "duplicateSource": null,
      "coreVersion": "13",
      "systemId": "dnd5e",
      "systemVersion": "5.1.10",
      "createdTime": null,
      "modifiedTime": null,
      "lastModifiedBy": null
    }
  },
  {
    "_id": "aa7fcf324780d93e",
    "name": "Psychic Crush",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You overload the mind of one creature you can see within range, filling its psyche with discordant emotions. The target must make an Intelligence saving throw. On a failed save, the target takes 12d6 psychic damage and is stunned for 1 minute. On a successful save, the target takes half as much damage and isn’t stunned.\nThe stunned target can make an Intelligence saving throw at the end of each of its turns. On a successful save, the creation ends on the target.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 6,
      "school": "enc",
      "components": {
        "value": "",
        "vocal": true,
        "somatic": true,
        "material": false,
        "ritual": false,
        "concentration": false
      },
      "materials": {
        "value": "",
        "consumed": false,
        "cost": 0,
        "supply": 0
      },
      "preparation": {
        "mode": "prepared",
        "prepared": false
      },
      "scaling": {
        "mode": "none",
        "formula": ""
      },
      "activation": {
        "type": "action",
        "cost": 1,
        "condition": ""
      },
      "duration": {
        "value": "1",
        "units": "minute"
      },
      "target": {
        "value": null,
        "width": null,
        "units": "",
        "type": ""
      },
      "range": {
        "value": 60,
        "long": null,
        "units": "ft"
      },
      "uses": {
        "value": null,
        "max": "",
        "per": null,
        "recovery": "",
        "prompt": true
      },
      "actionType": "save",
      "attack": {
        "bonus": "",
        "flat": false
      },
      "damage": {
        "parts": [
          [
            "12d6",
            "psychic"
          ]
        ],
        "versatile": ""
      },
      "save": {
        "ability": "int",
        "dc": null,
        "scaling": "spell"
      },
      "chatFlavor": "",
      "formula": ""
    },
    "effects": [],
    "flags": {},
    "folder": null,
    "sort": 0,
    "ownership": {
      "default": 0
    },
    "_stats": {
      "compendiumSource": null,
      "duplicateSource": null,
      "coreVersion": "13",
      "systemId": "dnd5e",
      "systemVersion": "5.1.10",
      "createdTime": null,
      "modifiedTime": null,
      "lastModifiedBy": null
    }
  },
  {
    "_id": "57fb3881a3f8b45a",
    "name": "Radical Beam",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>A beam of brilliant light flashes out from you in a 5-foot-wide, 60-foot-line. Each creature in the line must make a Constitution saving throw. On a failed save, a creature takes 6d10 radiant damage and is blinded until your next turn. On a successful save, it takes half as much damage and isn’t blinded by this creation.\nYou can create a new beam as your action on any turn until the creation ends.\nFor the duration, brilliant radiance shines from you. It sheds bright light in a 30-foot radius and dim light for an additional 30 feet. The light is sunlight.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 6,
      "school": "evo",
      "components": {
        "value": "",
        "vocal": true,
        "somatic": true,
        "material": true,
        "ritual": false,
        "concentration": true
      },
      "materials": {
        "value": "a magnifying glass",
        "consumed": false,
        "cost": 0,
        "supply": 0
      },
      "preparation": {
        "mode": "prepared",
        "prepared": false
      },
      "scaling": {
        "mode": "none",
        "formula": ""
      },
      "activation": {
        "type": "action",
        "cost": 1,
        "condition": ""
      },
      "duration": {
        "value": "1",
        "units": "minute"
      },
      "target": {
        "value": 60,
        "width": null,
        "units": "ft",
        "type": "line"
      },
      "range": {
        "value": null,
        "long": null,
        "units": "self"
      },
      "uses": {
        "value": null,
        "max": "",
        "per": null,
        "recovery": "",
        "prompt": true
      },
      "actionType": "save",
      "attack": {
        "bonus": "",
        "flat": false
      },
      "damage": {
        "parts": [
          [
            "6d10",
            "radiant"
          ]
        ],
        "versatile": ""
      },
      "save": {
        "ability": "con",
        "dc": null,
        "scaling": "spell"
      },
      "chatFlavor": "",
      "formula": ""
    },
    "effects": [],
    "flags": {},
    "folder": null,
    "sort": 0,
    "ownership": {
      "default": 0
    },
    "_stats": {
      "compendiumSource": null,
      "duplicateSource": null,
      "coreVersion": "13",
      "systemId": "dnd5e",
      "systemVersion": "5.1.10",
      "createdTime": null,
      "modifiedTime": null,
      "lastModifiedBy": null
    }
  },
  {
    "_id": "f9911fd7935f5273",
    "name": "Rending Sword",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You create a sword-shaped plane of force that hovers within range. It lasts for the duration.\nWhen the sword appears, you make a melee creation attack against a target of your choice within 5 feet of the sword. On a hit. the target takes 4d10 force damage. Until the creation ends, you can use a bonus action on each of your turns to move the sword up to 20 feet to a spot you can see and repeat this attack against the same target or a different one.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 6,
      "school": "evo",
      "components": {
        "value": "",
        "vocal": true,
        "somatic": true,
        "material": true,
        "ritual": false,
        "concentration": false
      },
      "materials": {
        "value": "a miniature sword",
        "consumed": false,
        "cost": 0,
        "supply": 0
      },
      "preparation": {
        "mode": "prepared",
        "prepared": false
      },
      "scaling": {
        "mode": "none",
        "formula": ""
      },
      "activation": {
        "type": "action",
        "cost": 1,
        "condition": ""
      },
      "duration": {
        "value": "1",
        "units": "minute"
      },
      "target": {
        "value": null,
        "width": null,
        "units": "",
        "type": ""
      },
      "range": {
        "value": 60,
        "long": null,
        "units": "ft"
      },
      "uses": {
        "value": null,
        "max": "",
        "per": null,
        "recovery": "",
        "prompt": true
      },
      "actionType": "msak",
      "attack": {
        "bonus": "",
        "flat": false
      },
      "damage": {
        "parts": [
          [
            "4d10",
            "force"
          ]
        ],
        "versatile": ""
      },
      "save": {
        "ability": "",
        "dc": null,
        "scaling": "spell"
      },
      "chatFlavor": "",
      "formula": ""
    },
    "effects": [],
    "flags": {},
    "folder": null,
    "sort": 0,
    "ownership": {
      "default": 0
    },
    "_stats": {
      "compendiumSource": null,
      "duplicateSource": null,
      "coreVersion": "13",
      "systemId": "dnd5e",
      "systemVersion": "5.1.10",
      "createdTime": null,
      "modifiedTime": null,
      "lastModifiedBy": null
    }
  },
  {
    "_id": "f81c6ddd960e508d",
    "name": "Regenerate",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You touch a creature and stimulate its natural healing ability. The target regains 4d8 + 15 Hit Points. For the Duration of the creation, the target regains 1 hit point at the start of each of its turns (10 Hit Points each minute).\nThe target's severed body parts (fingers, legs, and so on), if any, are restored after 2 minutes. If you have the severed part and hold it to the stump, the creation instantaneously causes the limb heal.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 6,
      "school": "trs",
      "components": {
        "value": "",
        "vocal": true,
        "somatic": true,
        "material": true,
        "ritual": false,
        "concentration": false
      },
      "materials": {
        "value": "A prayer wheel and holy water",
        "consumed": false,
        "cost": 0,
        "supply": 0
      },
      "preparation": {
        "mode": "prepared",
        "prepared": false
      },
      "scaling": {
        "mode": "none",
        "formula": ""
      },
      "activation": {
        "type": "minute",
        "cost": 1,
        "condition": ""
      },
      "duration": {
        "value": "1",
        "units": "hour"
      },
      "target": {
        "value": null,
        "width": null,
        "units": "",
        "type": ""
      },
      "range": {
        "value": null,
        "long": null,
        "units": "touch"
      },
      "uses": {
        "value": null,
        "max": "",
        "per": null,
        "recovery": "",
        "prompt": true
      },
      "actionType": "heal",
      "attack": {
        "bonus": "",
        "flat": false
      },
      "damage": {
        "parts": [],
        "versatile": ""
      },
      "save": {
        "ability": "",
        "dc": null,
        "scaling": "spell"
      },
      "chatFlavor": "",
      "formula": ""
    },
    "effects": [],
    "flags": {},
    "folder": null,
    "sort": 0,
    "ownership": {
      "default": 0
    },
    "_stats": {
      "compendiumSource": null,
      "duplicateSource": null,
      "coreVersion": "13",
      "systemId": "dnd5e",
      "systemVersion": "5.1.10",
      "createdTime": null,
      "modifiedTime": null,
      "lastModifiedBy": null
    }
  },
  {
    "_id": "c80ca4f16549874d",
    "name": "Reverse Gravity",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>This creation reverses gravity in a 50-foot-radius, 100-foot high cylinder centered on a point within range. All creatures and objects that aren’t somehow anchored to the ground in the area fall upward and reach the top of the area when you use this creation. A creature can make a Dexterity saving throw to grab onto a fixed object it can reach, thus avoiding the fall.\nIf some solid object (such as a ceiling) is encountered in this fall, falling objects and creatures strike it just as they would during a normal downward fall. If an object or creature reaches the top of the area without striking anything, it remains there, oscillating slightly, for the duration.\nAt the end of the duration, affected objects and creatures fall back down.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 6,
      "school": "trs",
      "components": {
        "value": "",
        "vocal": true,
        "somatic": true,
        "material": true,
        "ritual": false,
        "concentration": true
      },
      "materials": {
        "value": "a block of iron",
        "consumed": false,
        "cost": 0,
        "supply": 0
      },
      "preparation": {
        "mode": "prepared",
        "prepared": false
      },
      "scaling": {
        "mode": "none",
        "formula": ""
      },
      "activation": {
        "type": "action",
        "cost": 1,
        "condition": ""
      },
      "duration": {
        "value": "1",
        "units": "minute"
      },
      "target": {
        "value": null,
        "width": null,
        "units": "",
        "type": ""
      },
      "range": {
        "value": 100,
        "long": null,
        "units": "ft"
      },
      "uses": {
        "value": null,
        "max": "",
        "per": null,
        "recovery": "",
        "prompt": true
      },
      "actionType": "save",
      "attack": {
        "bonus": "",
        "flat": false
      },
      "damage": {
        "parts": [],
        "versatile": ""
      },
      "save": {
        "ability": "",
        "dc": null,
        "scaling": "spell"
      },
      "chatFlavor": "",
      "formula": ""
    },
    "effects": [],
    "flags": {},
    "folder": null,
    "sort": 0,
    "ownership": {
      "default": 0
    },
    "_stats": {
      "compendiumSource": null,
      "duplicateSource": null,
      "coreVersion": "13",
      "systemId": "dnd5e",
      "systemVersion": "5.1.10",
      "createdTime": null,
      "modifiedTime": null,
      "lastModifiedBy": null
    }
  },
  {
    "_id": "511feffa144ffda3",
    "name": "Scatter",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>The air quivers around up to five creatures of your choice that you can see within range. An unwilling creature must succeed on a Wisdom saving throw to resist this creation. You teleport each affected target to an unoccupied space that you can see within 300 feet of you. That space must be on the ground or on a floor.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 6,
      "school": "con",
      "components": {
        "value": "",
        "vocal": true,
        "somatic": false,
        "material": false,
        "ritual": false,
        "concentration": false
      },
      "materials": {
        "value": "",
        "consumed": false,
        "cost": 0,
        "supply": 0
      },
      "preparation": {
        "mode": "prepared",
        "prepared": false
      },
      "scaling": {
        "mode": "none",
        "formula": ""
      },
      "activation": {
        "type": "action",
        "cost": 1,
        "condition": ""
      },
      "duration": {
        "value": null,
        "units": "inst"
      },
      "target": {
        "value": null,
        "width": null,
        "units": "",
        "type": ""
      },
      "range": {
        "value": 30,
        "long": null,
        "units": "ft"
      },
      "uses": {
        "value": null,
        "max": "",
        "per": null,
        "recovery": "",
        "prompt": true
      },
      "actionType": "save",
      "attack": {
        "bonus": "",
        "flat": false
      },
      "damage": {
        "parts": [],
        "versatile": ""
      },
      "save": {
        "ability": "wis",
        "dc": null,
        "scaling": "spell"
      },
      "chatFlavor": "",
      "formula": ""
    },
    "effects": [],
    "flags": {},
    "folder": null,
    "sort": 0,
    "ownership": {
      "default": 0
    },
    "_stats": {
      "compendiumSource": null,
      "duplicateSource": null,
      "coreVersion": "13",
      "systemId": "dnd5e",
      "systemVersion": "5.1.10",
      "createdTime": null,
      "modifiedTime": null,
      "lastModifiedBy": null
    }
  },
  {
    "_id": "409dc614ed734fc3",
    "name": "Shooting Stars",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>Seven star-like motes of light appear and orbit your head until the creation ends. You can use an action or bonus action to send one of the motes streaking toward one creature or object within 120 feet of you. When you do so, make a ranged creation attack. On a hit, the target takes 4d12 radiant damage. Whether you hit or miss, the mote is expended. The creation ends early if you expend the last mote. If you have four or more motes remaining, they shed bright light in a 30-foot radius and dim light for an additional 30 feet. If you have one to three motes remaining, they shed dim light in a 30-foot radius.</p><p><strong>At Higher Levels.</strong> When you use this creation with a creation slot of 7th level or higher, the number of motes created increases by two for each slot level above 6th.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 6,
      "school": "evo",
      "components": {
        "value": "",
        "vocal": true,
        "somatic": true,
        "material": false,
        "ritual": false,
        "concentration": false
      },
      "materials": {
        "value": "",
        "consumed": false,
        "cost": 0,
        "supply": 0
      },
      "preparation": {
        "mode": "prepared",
        "prepared": false
      },
      "scaling": {
        "mode": "level",
        "formula": ""
      },
      "activation": {
        "type": "action",
        "cost": 1,
        "condition": ""
      },
      "duration": {
        "value": "1",
        "units": "hour"
      },
      "target": {
        "value": null,
        "width": null,
        "units": "",
        "type": "self"
      },
      "range": {
        "value": null,
        "long": null,
        "units": "self"
      },
      "uses": {
        "value": null,
        "max": "",
        "per": null,
        "recovery": "",
        "prompt": true
      },
      "actionType": "rsak",
      "attack": {
        "bonus": "",
        "flat": false
      },
      "damage": {
        "parts": [
          [
            "4d12",
            "radiant"
          ]
        ],
        "versatile": ""
      },
      "save": {
        "ability": "",
        "dc": null,
        "scaling": "spell"
      },
      "chatFlavor": "",
      "formula": ""
    },
    "effects": [],
    "flags": {},
    "folder": null,
    "sort": 0,
    "ownership": {
      "default": 0
    },
    "_stats": {
      "compendiumSource": null,
      "duplicateSource": null,
      "coreVersion": "13",
      "systemId": "dnd5e",
      "systemVersion": "5.1.10",
      "createdTime": null,
      "modifiedTime": null,
      "lastModifiedBy": null
    }
  },
  {
    "_id": "8ecec1746c4f8df7",
    "name": "Tornado",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>A tornado howls down to a point on the ground you specify. The tornado is a 10-foot-radius, 30-foot-high cylinder centered on that point. Until the creation ends, you can use your action to move the tornado up to 30 feet in any direction along the ground. The tornado sucks up any Medium or smaller objects that aren’t secured to anything and that aren’t worn or carried by anyone.\nA creature must make a Dexterity saving throw the first time on a turn that it enters the tornado or that the tornado enters its space, including when the tornado first appears. A creature takes 10d6 bludgeoning damage on a failed save, or half as much damage on a successful one. In addition, a Large or smaller creature that fails the save must succeed on a Strength saving throw or become restrained in the tornado until the creation ends.\nWhen a creature starts its turn restrained by the tornado, the creature is pulled 5 feet higher inside it, unless the creature is at the top. A restrained creature moves with the tornado and falls when the creation ends, unless the creature has some means to stay aloft.\nA restrained creature can use an action to make a Strength or Dexterity check against your creation save DC. If successful, the creature is no longer restrained by the tornado and is hurled 3d6 × 10 feet away from it in a random direction.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 6,
      "school": "evo",
      "components": {
        "value": "",
        "vocal": true,
        "somatic": false,
        "material": true,
        "ritual": false,
        "concentration": true
      },
      "materials": {
        "value": "a piece of straw",
        "consumed": false,
        "cost": 0,
        "supply": 0
      },
      "preparation": {
        "mode": "prepared",
        "prepared": false
      },
      "scaling": {
        "mode": "none",
        "formula": ""
      },
      "activation": {
        "type": "action",
        "cost": 1,
        "condition": ""
      },
      "duration": {
        "value": "1",
        "units": "minute"
      },
      "target": {
        "value": null,
        "width": null,
        "units": "",
        "type": ""
      },
      "range": {
        "value": 300,
        "long": null,
        "units": "ft"
      },
      "uses": {
        "value": null,
        "max": "",
        "per": null,
        "recovery": "",
        "prompt": true
      },
      "actionType": "save",
      "attack": {
        "bonus": "",
        "flat": false
      },
      "damage": {
        "parts": [
          [
            "10d6",
            "bludgeoning"
          ]
        ],
        "versatile": ""
      },
      "save": {
        "ability": "dex",
        "dc": null,
        "scaling": "spell"
      },
      "chatFlavor": "",
      "formula": ""
    },
    "effects": [],
    "flags": {},
    "folder": null,
    "sort": 0,
    "ownership": {
      "default": 0
    },
    "_stats": {
      "compendiumSource": null,
      "duplicateSource": null,
      "coreVersion": "13",
      "systemId": "dnd5e",
      "systemVersion": "5.1.10",
      "createdTime": null,
      "modifiedTime": null,
      "lastModifiedBy": null
    }
  },
  {
    "_id": "35ec7f34ae1dd20e",
    "name": "Trueseeing",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>This creation gives the willing creature you touch the ability to see things as they actually are. For the duration, the creature has truesight, notices secret doors hidden by magic, and can see into the Ethereal Plane, all out to a range of 120 feet.</p><p><strong>At Higher Levels.</strong> When you use this creation with a creation slot of 7th level or higher, you can target an additional, willing creature for each level above 6th.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 6,
      "school": "div",
      "components": {
        "value": "",
        "vocal": true,
        "somatic": true,
        "material": true,
        "ritual": false,
        "concentration": false
      },
      "materials": {
        "value": "ointment",
        "consumed": false,
        "cost": 0,
        "supply": 0
      },
      "preparation": {
        "mode": "prepared",
        "prepared": false
      },
      "scaling": {
        "mode": "level",
        "formula": ""
      },
      "activation": {
        "type": "action",
        "cost": 1,
        "condition": ""
      },
      "duration": {
        "value": "1",
        "units": "hour"
      },
      "target": {
        "value": null,
        "width": null,
        "units": "",
        "type": ""
      },
      "range": {
        "value": null,
        "long": null,
        "units": "touch"
      },
      "uses": {
        "value": null,
        "max": "",
        "per": null,
        "recovery": "",
        "prompt": true
      },
      "actionType": "",
      "attack": {
        "bonus": "",
        "flat": false
      },
      "damage": {
        "parts": [],
        "versatile": ""
      },
      "save": {
        "ability": "",
        "dc": null,
        "scaling": "spell"
      },
      "chatFlavor": "",
      "formula": ""
    },
    "effects": [],
    "flags": {},
    "folder": null,
    "sort": 0,
    "ownership": {
      "default": 0
    },
    "_stats": {
      "compendiumSource": null,
      "duplicateSource": null,
      "coreVersion": "13",
      "systemId": "dnd5e",
      "systemVersion": "5.1.10",
      "createdTime": null,
      "modifiedTime": null,
      "lastModifiedBy": null
    }
  },
  {
    "_id": "829289e57c9a5d43",
    "name": "Wall of Lightning",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>A sparking wall of lightning bursts into existence at a point you choose within range. The wall appears in any orientation you choose: horizontally, vertically, or diagonally. It can be free floating, or it can rest on a solid surface. The wall can be up to 90 feet long, 10 feet high, and 5 feet thick. The wall blocks line of sight, but creatures and objects can pass through it. It emits bright light out to 30 feet and dim light for an additional 60 feet.\nWhen the wall appears, each creature in its area must make a Constitution saving throw. On a failed save, a creature takes 8d8 lightning damage. On a successful save, it takes half as much damage.\nA creature that enters the wall for the first time on their turn, or starts its turn in the wall’s area takes 4d8 lightning damage.\nUntil the creation ends, you can use a bonus action to cause the wall to fire a bolt of lightning at a target you can see that is within 60 feet of the wall but not in the wall’s space. The creature must make a Constitution saving throw, taking 4d8 lighting damage on a failed save, or half as much damage on a success.</p><p><strong>At Higher Levels.</strong> When you use this using a creation slot of 7th level or higher, the initial damage and the bolt of lightning of the creation deals an extra 1d8 damage for each level above 6th.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 6,
      "school": "evo",
      "components": {
        "value": "",
        "vocal": true,
        "somatic": true,
        "material": true,
        "ritual": false,
        "concentration": true
      },
      "materials": {
        "value": "a drop of acid",
        "consumed": false,
        "cost": 0,
        "supply": 0
      },
      "preparation": {
        "mode": "prepared",
        "prepared": false
      },
      "scaling": {
        "mode": "level",
        "formula": ""
      },
      "activation": {
        "type": "action",
        "cost": 1,
        "condition": ""
      },
      "duration": {
        "value": "10",
        "units": "minute"
      },
      "target": {
        "value": null,
        "width": null,
        "units": "",
        "type": ""
      },
      "range": {
        "value": 120,
        "long": null,
        "units": "ft"
      },
      "uses": {
        "value": null,
        "max": "",
        "per": null,
        "recovery": "",
        "prompt": true
      },
      "actionType": "save",
      "attack": {
        "bonus": "",
        "flat": false
      },
      "damage": {
        "parts": [
          [
            "8d8",
            "lightning"
          ],
          [
            "4d8",
            "lightning"
          ]
        ],
        "versatile": ""
      },
      "save": {
        "ability": "con",
        "dc": null,
        "scaling": "spell"
      },
      "chatFlavor": "",
      "formula": ""
    },
    "effects": [],
    "flags": {},
    "folder": null,
    "sort": 0,
    "ownership": {
      "default": 0
    },
    "_stats": {
      "compendiumSource": null,
      "duplicateSource": null,
      "coreVersion": "13",
      "systemId": "dnd5e",
      "systemVersion": "5.1.10",
      "createdTime": null,
      "modifiedTime": null,
      "lastModifiedBy": null
    }
  },
  {
    "_id": "c159f0688b828378",
    "name": "Ward",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You protect up to 2,500 square feet of floor space (an area 50 feet square, or one hundred 5-foot squares or twenty-five 10-foot squares). The protected area can be up to 20 feet tall, and shaped as you desire. You can protect several stories of a stronghold by dividing the area among them, as long as you can walk into each contiguous area while you are activating this creation.\nWhen you activate this creation, you can specify individuals that are unaffected by any or all of the effects that you choose. You can also specify a password that, when spoken aloud, makes the speaker immune to these effects.\nWard creates the following effects within the protected area.\n<strong>Corridors</strong>. Fog fills all the protected corridors, making them heavily obscured. In addition, at each intersection or branching passage offering a choice of direction, there is a 50 percent chance that a creature other than you will believe it is going in the opposite direction from the one it chooses.\n<strong>Doors.</strong> All doors in the protected area are creatively locked, as if sealed by the Lock creation. In addition, you can cover up to ten doors with an illusion (equivalent to the illusory object function of the Temporary Trick trick) to make them appear as plain sections of wall.\n<strong>Stairs.</strong> Webs fill all stairs in the protected area from top to bottom, as the Web spell. These strands regrow in 10 minutes if they are burned or torn away while Ward lasts.\n<strong>Other Creation Effect.</strong> You can place your choice of one of the following magical effects within the warded area of the stronghold.\n<em> Place Shimmering Lights in four corridors. You can designate a simple program that the lights repeat as long as Ward lasts.\n</em> Place Stinking Cloud in two locations. The vapors appear in the places you designate; they return within 10 minutes if dispersed by wind while Ward lasts.\n<em> Place a constant Gust of Wind in one corridor or room.\n</em> Place a Suggestion in one location. You select an area of up to 5 feet square, and any creature that enters or passes through the area receives the Suggestion mentally.\nA Deactivate Creation creation used on a specific effect, if successful, removes only that effect. You can create a structure permanently under the Ward creation by using this creation there every day for one year.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 6,
      "school": "abj",
      "components": {
        "value": "",
        "vocal": true,
        "somatic": true,
        "material": true,
        "ritual": false,
        "concentration": false
      },
      "materials": {
        "value": "a mirror and a puff of smoke",
        "consumed": false,
        "cost": 0,
        "supply": 0
      },
      "preparation": {
        "mode": "prepared",
        "prepared": false
      },
      "scaling": {
        "mode": "none",
        "formula": ""
      },
      "activation": {
        "type": "minute",
        "cost": 10,
        "condition": ""
      },
      "duration": {
        "value": "24",
        "units": "hour"
      },
      "target": {
        "value": null,
        "width": null,
        "units": "",
        "type": ""
      },
      "range": {
        "value": null,
        "long": null,
        "units": "touch"
      },
      "uses": {
        "value": null,
        "max": "",
        "per": null,
        "recovery": "",
        "prompt": true
      },
      "actionType": "",
      "attack": {
        "bonus": "",
        "flat": false
      },
      "damage": {
        "parts": [],
        "versatile": ""
      },
      "save": {
        "ability": "",
        "dc": null,
        "scaling": "spell"
      },
      "chatFlavor": "",
      "formula": ""
    },
    "effects": [],
    "flags": {},
    "folder": null,
    "sort": 0,
    "ownership": {
      "default": 0
    },
    "_stats": {
      "compendiumSource": null,
      "duplicateSource": null,
      "coreVersion": "13",
      "systemId": "dnd5e",
      "systemVersion": "5.1.10",
      "createdTime": null,
      "modifiedTime": null,
      "lastModifiedBy": null
    }
  },
  {
    "_id": "e30f05c6799fa22b",
    "name": "Weather Forecast",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You take control of the weather within 5 miles of you for the duration. You must be outdoors to use this creation. Moving to a place where you don’t have a clear path to the sky ends the creation early.\nWhen you use this creation, you change the current weather conditions, which are determined by the DM based on the climate and season. You can change precipitation, temperature, and wind. It takes 1d4 x 10 minutes for the new conditions to take effect. Once they do so, you can change the conditions again. When the creation ends, the weather gradually returns to normal.\nWhen you change the weather conditions, find a current condition on the following tables and change its stage by one, up or down. When changing the wind, you can change its direction.\n##### Precipitation\n| Stage | Effect |\n|:----:|:-------------|\n| 1  | Clear |\n| 2  | Light clouds |\n| 3 | Overcast or ground fog |\n| 4 | Rain, hail or snow |\n| 5 | Torrential rain, driving hail or blizzard |\n##### Temperature\n| Stage | Effect |\n|:----:|:-------------|\n| 1  | Unbearable Heat |\n| 2  | Hot |\n| 3 | Warm |\n| 4 | Cool |\n| 5 | Cold |\n| 6 | Artic cold |\n##### Wind\n| Stage | Effect |\n|:----:|:-------------|\n| 1  | Calm |\n| 2  | Moderate wind |\n| 3 | Strong wind |\n| 4 | Gale |\n| 5 | Storm |</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 6,
      "school": "trs",
      "components": {
        "value": "",
        "vocal": true,
        "somatic": true,
        "material": true,
        "ritual": false,
        "concentration": true
      },
      "materials": {
        "value": "a cup of water",
        "consumed": false,
        "cost": 0,
        "supply": 0
      },
      "preparation": {
        "mode": "prepared",
        "prepared": false
      },
      "scaling": {
        "mode": "none",
        "formula": ""
      },
      "activation": {
        "type": "minute",
        "cost": 10,
        "condition": ""
      },
      "duration": {
        "value": "8",
        "units": "hour"
      },
      "target": {
        "value": null,
        "width": null,
        "units": "",
        "type": ""
      },
      "range": {
        "value": null,
        "long": null,
        "units": ""
      },
      "uses": {
        "value": null,
        "max": "",
        "per": null,
        "recovery": "",
        "prompt": true
      },
      "actionType": "",
      "attack": {
        "bonus": "",
        "flat": false
      },
      "damage": {
        "parts": [],
        "versatile": ""
      },
      "save": {
        "ability": "",
        "dc": null,
        "scaling": "spell"
      },
      "chatFlavor": "",
      "formula": ""
    },
    "effects": [],
    "flags": {},
    "folder": null,
    "sort": 0,
    "ownership": {
      "default": 0
    },
    "_stats": {
      "compendiumSource": null,
      "duplicateSource": null,
      "coreVersion": "13",
      "systemId": "dnd5e",
      "systemVersion": "5.1.10",
      "createdTime": null,
      "modifiedTime": null,
      "lastModifiedBy": null
    }
  }
];
