import type { FoundryItem } from "../../../schemas/common.js";

export const level8: FoundryItem[] = [
  {
    "_id": "64997851eb3ceb3f",
    "name": "Anti-Creation Field",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>A 10-foot-radius invisible sphere of EMP surrounds you. This area is divorced from the creation that suffuses the abilities of other creations and creation like effects. Within the sphere, creations can’t be used, summoned creatures disappear, and even certain creation/mastercraft items become disfunctional, lacking their main special properties.\nUntil the creation ends, the sphere moves with you, centered on you.\nCreations and similar effects, are suppressed in the sphere and can’t protrude into it. A slot expended to use a suppressed creation is consumed. While an effect is suppressed, it doesn’t function, but the time it spends suppressed counts against its duration.\n<strong>Targeted Effects:</strong> Creations and similar Effects, such as Missiles and Charm Person, that target a creature or an object in the Sphere have no Effect on that target.\n<strong>Areas of Effect:</strong> The area of another creation or similar Effect, such as Fireball, can't extend into the Sphere. If the Sphere overlaps an area of creativity, the part of the area that is covered by the Sphere is suppressed. For example, the flames created by a Wall of Fire are suppressed within the Sphere, creating a gap in the wall if the overlap is large enough.\n<strong>Creations:</strong> Any active creation or similar Effect on a creature or an object in the Sphere is suppressed while the creature or object is in it.\n<strong>Mastercraft Items:</strong> The Properties and powers of certain items are suppressed in the Sphere. A weapon's Properties and powers are suppressed if it is used against a target in the Sphere or wielded by an attacker in the Sphere. If a weapon or piece of ammunition fully leaves the Sphere (For example, if you fire a Mastercraft Arrow or throw a mastercraft spear at a target outside the sphere), the creative bonus of the item ceases to be suppressed as soon as it exits.\n<strong>Deactivate Creation.</strong> Creations and similar effects such as Deactivate Creation have no effect on the sphere. Likewise, the spheres created by different antimagic field creations don’t nullify each other.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 8,
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
        "value": "A pinch of powdered iron or iron fillings",
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
        "units": "self"
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
    "_id": "5c119e858b5079e2",
    "name": "Clone",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>This creation grows an inert duplicate of a living creature as a safeguard against death. This clone forms inside the vessel used in the creation's activation and grows to full size and maturity after 120 days; you can also choose to have the clone be a younger version of the same creature. It remains inert and endures indefinitely, as long as its vessel remains undisturbed.\nAt any time after the clone matures, if the original creature dies, its soul transfers to the clone, provided that the soul is free and willing to return. The clone is physically identical to the original and has the same personality, memories, and abilities, but none of the original’s equipment (this includes devil fruits). The original creature’s physical remains, if they still exist, become inert and can’t thereafter be restored to life, since the creature’s soul is elsewhere.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 8,
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
        "value": "Medical supplies worth at least 10,000,000 Berries and at least 1 cubic inch of flesh of the creature that is to be cloned, which the creation consumes. A vessel worth at least 20,000,000 Berries that has a sealable lid and is large enough to hold the creature being cloned",
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
        "type": "hour",
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
    "_id": "72dac498360cf88c",
    "name": "Dark Star",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>This creation creates a sphere centered on a point you choose within range. The sphere can have a radius of up to 40 feet. The area within this sphere is filled with darkness and crushing gravitational force.\nFor the duration, the creation's area is difficult terrain. A creature with darkvision can't see through the darkness, and light can't illuminate it. No sound can be created within or pass through the area. Any creature or object entirely inside the sphere is immune to thunder damage, and creatures are deafened while entirely inside it. Using a creation that includes a verbal component is impossible there.\nAny creature that enters the creation's area for the first time on a turn or starts its turn there must make a Constitution saving throw. The creature takes 10d10 force damage on a failed save or half as much damage on a successful save. A creature reduced to 0 hit points by this damage is disintegrated. A disintegrated creature and everything it is wearing and carrying, except mastercraft items, are reduced to a pile of fine gray dust.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 8,
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
        "value": "a shard of onyx",
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
            "10d10",
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
    "_id": "aa1d43d3f043311a",
    "name": "Earthquake",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You create a seismic disturbance at a point on the ground that you can see within range. For the duration, an intense tremor rips through the ground in a 100-foot-radius circle centered on that point and shakes creatures and structures in contact with the ground in that area.\nThe ground in the area becomes difficult terrain. Each creature on the ground that is concentrating must make a Constitution saving throw. On a failed save, the creature’s concentration is broken.\nWhen you activate this creation and at the end of each turn you spend concentrating on it, each creature on the ground in the area must make a Dexterity saving throw. On a failed save, the creature is knocked prone.\nThis creation can have additional effects depending on the terrain in the area, as determined by the DM.\n<strong>Fissures.</strong> Fissures open throughout the creation’s area at the start of your next turn after you cast the spell. A total of 1d6 such fissures open in locations chosen by the DM. Each is 1d10 x 10 feet deep, 10 feet wide, and extends from one edge of the spell’s area to the opposite side. A creature standing on a spot where a fissure opens must succeed on a Dexterity saving throw or fall in. A creature that successfully saves moves with the fissure’s edge as it opens.\nA fissure that opens beneath a structure causes it to automatically collapse (see below).\n<strong>Structures.</strong> The tremor deals 50 bludgeoning damage to any structure in contact with the ground in the area when you active this creation and at the start of each of your turns until the spell ends. If a structure drops to 0 hit points, it collapses and potentially damages nearby creatures. A creature within half the distance of a structure’s height must make a Dexterity saving throw. On a failed save, the creature takes 5d6 bludgeoning damage, is knocked prone, and is buried in the rubble, requiring a DC 20 Strength (Athletics) check as an action to escape. The DM can adjust the DC higher or lower, depending on the nature of the rubble. On a successful save, the creature takes half as much damage and doesn’t fall prone or become buried.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 8,
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
        "value": "a pinch of dirt",
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
        "value": 500,
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
            "5d6",
            "bludgeoning"
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
    "_id": "f01e5e59930c5876",
    "name": "Feeblemind",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You shatter the mind of a creature that you can see within range. The target takes 4d6 psychic damage and must make an Intelligence saving throw.\nOn a failed save, the creature’s Intelligence and Charisma scores become 1. The creature can’t use creations, activate mastercraft items, understand language, or communicate in any intelligible way. The creature can, however, identify its friends, follow them, and even protect them.\nAt the end of every 30 days, the creature can repeat its saving throw against this creation. If it succeeds on its saving throw, the creation ends.\nThe creation can also be ended by greater restoration, heal, greater heal, etc.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 8,
      "school": "enc",
      "components": {
        "value": "",
        "vocal": true,
        "somatic": true,
        "material": true,
        "ritual": false,
        "concentration": false
      },
      "materials": {
        "value": "an egg",
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
        "type": "creature"
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
            "4d6",
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
    "_id": "88eb006a92e49013",
    "name": "Glibness",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>Until the creation ends, when you make a Charisma check, you can replace the number you roll with a 15.\nAdditionally, no matter what you say, any effect, ability, or item that would determine if you are telling the truth indicates that you are being truthful.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 8,
      "school": "trs",
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
    "_id": "c728d77d8644f335",
    "name": "Incendiary Cloud",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>A swirling cloud of smoke shot through with white-hot embers appears in a 20-foot-radius sphere centered on a point within range. The cloud spreads around corners and is heavily obscured. It lasts for the duration or until a wind of moderate or greater speed (at least 10 miles per hour) disperses it.\nWhen the cloud appears, each creature in it must make a Dexterity saving throw. A creature takes 10d8 fire damage on a failed save, or half as much damage on a successful one. A creature must also make this saving throw when it enters the creation’s area for the first time on a turn or ends its turn there.\nThe cloud moves 10 feet directly away from you in a direction that you choose at the start of each of your turns.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 8,
      "school": "trs",
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
    "_id": "144b9b270e57449d",
    "name": "Maddening Darkness",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>Darkness spreads from a point you choose within range to fill a 60-foot-radius sphere until the spell ends. The darkness spreads around corners. A creature with darkvision can’t see through this darkness. Normal lights, as well as light created by creations of 8th level or lower, can't illuminate the area. Shrieks, gibbering, and mad laughter can be heard within the sphere. Whenever a creature starts its turn in the sphere, it must make a Wisdom saving throw, taking 10d8 psychic damage on a failed save, or half as much damage on a successful one.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 8,
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
        "value": "a drop of mercury",
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
            "psychic"
          ]
        ],
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
    "_id": "15a8c4ab53e1a867",
    "name": "Stun",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You overwhelm the mind of one creature you can see within range, leaving it dumbfounded. That creature must succeed a Constitution saving throw, getting stunned on a failure. The stunned target must make a Constitution saving throw at the end of each of its turns. On a successful save, this stunning effect ends.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 8,
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
    "_id": "c3380540868a7294",
    "name": "Sunburst",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>Brilliant sunlight flashes in a 60-foot radius centered on a point you choose within range. Each creature in that light must make a Constitution saving throw. On a failed save, a creature takes 12d8 radiant damage and is blinded for 1 minute. On a successful save, it takes half as much damage and isn’t blinded by this creation.\nA creature blinded by this creation makes another Constitution saving throw at the end of each of its turns. On a successful save, it is no longer blinded.\nThis creation deactivates any darkness in its area that was created by a creation.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 8,
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
        "value": "fire",
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
            "12d8",
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
    "_id": "c8ca60ceab6f8515",
    "name": "Tsunami",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>A wall of water springs into existence at a point you choose within range. You can make the wall up to 300 feet long, 300 feet high, and 50 feet thick. The wall lasts for the duration.\nWhen the wall appears, each creature within its area must make a Strength saving throw. On a failed save, a creature takes 10d12 bludgeoning damage, or half as much damage on a successful save. The bludgeoning damage from this creation deals double damage to objects and structures.\nAt the start of each of your turns after the wall appears, the wall, along with any creatures in it, moves 50 feet away from you. Any Huge or smaller creature inside the wall or whose space the wall enters when it moves must succeed on a Strength saving throw or take 5d12 bludgeoning damage. A creature can take this damage only once per round. At the end of the turn, the wall’s height is reduced by 50 feet, and the damage creatures take from the spell on subsequent rounds is reduced by 1d10. When the wall reaches 0 feet in height, the creation ends.\nA creature caught in the wall can move by swimming. Because of the force of the wave, though, the creature must make a successful Strength (Athletics) check against your creation save DC in order to move at all. If it fails the check, it can’t move. A creature that moves out of the area falls to the ground.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 8,
      "school": "con",
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
        "mode": "none",
        "formula": ""
      },
      "activation": {
        "type": "minute",
        "cost": 1,
        "condition": ""
      },
      "duration": {
        "value": "6",
        "units": "round"
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
        "units": "spec"
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
            "10d12",
            "bludgeoning"
          ],
          [
            "5d12",
            "bludgeoning"
          ]
        ],
        "versatile": ""
      },
      "save": {
        "ability": "str",
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
