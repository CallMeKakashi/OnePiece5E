import type { FoundryItem } from "../../../schemas/common.js";

export const level1: FoundryItem[] = [
  {
    "_id": "95f40b4a04626891",
    "name": "Absorption",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You capture some of the incoming energy, lessening its effect on you and storing it for your next melee attack. You have resistance to the triggering damage type until the start of your next turn. Also, the first time you hit with a melee attack on your next turn, the target takes an extra 1d8 damage of the triggering type, and the creation ends.</p><p><strong>At Higher Levels.</strong> When you use this creation with a creation slot of 2nd level or higher, the extra damage increases by 1d8 for each slot level above 1st.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
      "school": "abj",
      "components": {
        "value": "",
        "vocal": false,
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
        "type": "reaction",
        "cost": 1,
        "condition": "which you take when you take acid, cold, fire, lightning, or thunder damage"
      },
      "duration": {
        "value": "1",
        "units": "round"
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
      "actionType": "msak",
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
    "_id": "c0c553d885ae4e7a",
    "name": "Acid Reflex",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You point your finger, and the creature that damaged you is momentarily splashed with highly corrosive acid. The creature must make a Constitution saving throw. On a failure, the target takes 5d4 acid damage, and an additional 3d4 at the end of their next turn. On a success, they take only half of the initial damage.</p><p><strong>At Higher Levels.</strong> When you use this creation with a creation slot of 2nd level or higher, both the initial and additional damage increases by 1d4 for each slot level above 1st.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
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
        "type": "reaction",
        "cost": 1,
        "condition": "which you take in response to being damaged by a creature within 60 feet of you that you can see"
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
            "5d4",
            "acid"
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
    "_id": "490bb271029d12a8",
    "name": "Advanced Weapon",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You channel energy into one simple or martial weapon you’re holding, and choose one damage type: acid, cold, fire, lightning, poison, or thunder. Until the creation ends, you deal an extra 1d6 damage of the chosen type to any target you hit with the weapon.\nAs a bonus action, you can change the damage type, choosing from the options above.</p><p><strong>At Higher Levels.</strong> When you use this creation with a creation slot of 3rd level or higher, you can maintain your concentration on the creation for up to 8 hours. When you use this creation with a creation slot of 5th level or higher, you no longer need to maintain your concentration, and the creation lasts for 24 hours.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
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
        "mode": "level",
        "formula": ""
      },
      "activation": {
        "type": "bonus",
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
    "_id": "1eb3919edcf45764",
    "name": "Alacrity",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You touch a willing creature. For the duration, the target can add 1d8 to its initiative rolls.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
      "school": "div",
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
        "type": "minute",
        "cost": 1,
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
    "_id": "c1360fbcc44bdd7c",
    "name": "Alarm (R)",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You set an alarm against unwanted intrusion. Choose a door, a window, or an area within range that is no larger than a 20-foot cube. Until the creation ends, an alarm alerts you whenever a tiny or larger creature touches or enters the designated area. When you use this creation, you can designate creatures that won’t set off the alarm. You also choose whether the alarm is mental or audible.\nA mental alarm alerts you with a ping in your mind if you are within 1 mile of the warded area. This ping awakens you if you are sleeping. An audible alarm produces the sound of a hand bell for 10 seconds within 60 feet.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
      "school": "abj",
      "components": {
        "value": "",
        "vocal": true,
        "somatic": true,
        "material": true,
        "ritual": true,
        "concentration": false
      },
      "materials": {
        "value": "a tiny bell and a piece of wire",
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
    "_id": "6f4b24d65c1aaf59",
    "name": "Animal Friend",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>Through experience with wildlife, you convince a beast that you mean it no harm. Choose a beast that you can see within range. The beast must succeed on a Wisdom saving throw or be charmed by you for the creation’s duration. If you or one of your companions harms the target, the creation ends.\n<strong>At Higher Levels:</strong> When you use this creation with a creation slot of 2nd level or higher, you can affect one additional beast for each slot level above 1st.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
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
        "value": "a morsel of food",
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
    "_id": "6b16765d8e2c6071",
    "name": "Attract Metal",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You harness magnetic forces to bring metal towards yourself. Choose a metal object that you can see within range, that is of small size and weighs 10 lbs or less. That object flies towards you safely into your hand or at your feet (your choice), though physical barriers may stop the object depending on the size. If the object is being carried or held by a creature, the target must make a Strength saving throw, dropping the item as it flies towards you on a failure. On a success, the creature successfully holds onto the object. If the object is being worn, the target makes a Strength saving throw, being dragged towards you on a failure. On a success, the creature and object are unmoved.</p><p><strong>At Higher Levels.</strong> If you use this creation with a creation slot of 2nd level, the metal object can be of medium size and weigh up to 100 lbs or less. If you use this creation with a creation slot of 3rd level, the metal object can be of large size and weigh up to 1,000 lbs or less. If you use this creation with a creation slot of 4th level, the metal object can be of huge size and weigh up to 10,000 lbs or less. If you use this creation with a creation slot of 5th level, the metal object can be of gargantuan size and weigh up to 100,000 lbs or less.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
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
        "value": "a copper wire",
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
        "type": "object"
      },
      "range": {
        "value": 90,
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
  },
  {
    "_id": "7d3454a77702745c",
    "name": "Bane",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>Up to three creatures of your choice that you can see within range must make Charisma saving throws. Whenever a target that fails this saving throw makes an attack roll or a saving throw before the creation ends, the target must roll a d4 and subtract the number rolled from the attack roll or saving throw.</p><p><strong>At Higher Levels.</strong> When you use this creation with a creation slot of 2nd level or higher, you can target one additional creature for each slot level above 1st.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
      "school": "enc",
      "components": {
        "value": "",
        "vocal": true,
        "somatic": true,
        "material": true,
        "ritual": false,
        "concentration": true
      },
      "materials": {
        "value": "a drop of blood",
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
    "_id": "37bfd2687fedd4e6",
    "name": "Beacon",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>A 60-foot-radius sphere of light spreads out from a point you choose within range. The sphere is bright light and sheds dim light for an additional 60 feet.\nIf you chose a point on an object you are holding or one that isn’t being worn or carried, the light shines from the object and moves with it. Completely covering the affected object with an opaque object, such as a bowl or a helm, blocks the light.\nIf any of this creation’s area overlaps with an area of darkness created by a creation of 3rd level or lower, the creation that created the darkness is deactivated.</p><p><strong>At Higher Levels.</strong> When you use this creation with a creation slot of 3rd level or higher, It lasts 8 hours. When you use this creation with a creation slot of 5th level or higher, it lasts 24 hours. When you use this creation with a creation slot of 7th level or higher, it lasts 7 days. When you use this creation with a creation slot of 9th level or higher, it lasts until it is deactivated.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
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
        "type": "space"
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
    "_id": "4aa48135f3293d59",
    "name": "Blazing Bullet",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>When you hit a creature with a ranged weapon attack, you can activate this creation as a bonus action. Your projectile burns bright with brilliant flames dealing an extra 1d6 fire damage, and causes the target to be ignited in flames.\nAt the start of each of its turns until the creation ends, the target must make a Constitution saving throw. On a failed save, it takes 1d6 fire damage. On a successful save, the creation ends. If the target or a creature within 5 feet of it uses an action to put out the flames, or if some other effect douses the flames (such as the target being submerged in water), the creation ends.</p><p><strong>At Higher Levels.</strong> When you use this using a creation slot of 2nd level or higher, the initial extra damage dealt by the attack increases by 1d6 for each slot.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
      "school": "evo",
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
        "mode": "level",
        "formula": ""
      },
      "activation": {
        "type": "bonus",
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
            "1d6",
            "fire"
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
    "_id": "ccb9dfbc7ed63dd4",
    "name": "Bless",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You give aid to three creatures of your choice within range. Whenever a target makes an attack roll or a saving throw before the spell ends, the target can roll a d4 and add the number rolled to the attack roll or saving throw.</p><p><strong>At Higher Levels.</strong> When you use this creation with a creation slot of 2nd level or higher, you can target one additional creature for each slot level above 1st.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
      "school": "enc",
      "components": {
        "value": "",
        "vocal": true,
        "somatic": true,
        "material": true,
        "ritual": false,
        "concentration": true
      },
      "materials": {
        "value": "a drop of water",
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
    "_id": "97817bf5f659fe6d",
    "name": "Boost",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You touch a creature to give it a boost in speed. The target's speed increases by 10 feet until the creation ends.</p><p><strong>At Higher Levels.</strong> When you use this creation with a creation slot of 2nd level or higher, you can target one additional creature for each slot level above 1st.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
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
        "value": "a piece of rubber",
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
        "type": "creature"
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
    "_id": "04cdcab2577326eb",
    "name": "Cause Strife",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You cause complaining and minor aggression to spring to life. Choose a creature within range, forcing them to make a Wisdom saving throw. On a failed save, a target bickers and argues with other creatures for the duration. During this time, it is incapable of meaningful communication and has disadvantage on attack rolls and ability checks. At the end of each of an affected creature's turns, it can repeat the saving throw, ending the effect on a success.</p><p><strong>At Higher Levels.</strong> When you use this creation with a creation slot of 2nd level or higher, you can target one additional creature for each slot level above 1st.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
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
    "_id": "7df5f0f70c39d4b1",
    "name": "Caustic Brew",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You unleash a stream of acid that shoots out in a line 30 feet long and 5 feet wide in a direction you choose. Each creature in the line must succeed on a Dexterity saving throw or be covered in acid for the spell’s duration or until a creature uses its action to scrape or wash the acid off itself or another creature. A creature covered in the acid takes 2d4 acid damage at start of each of its turns.</p><p><strong>At Higher Levels.</strong> When you use this creation with a creation slot 2nd level or higher, the damage increases by 2d4 for each slot level above 1st.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
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
        "value": "a bit of rotten food",
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
        "units": "minute"
      },
      "target": {
        "value": 30,
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
            "2d4",
            "acid"
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
    "_id": "deb5e130a35c3b5c",
    "name": "Charm Person",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You attempt to charm a humanoid you can see within range. It must make a Wisdom saving throw, and does so with advantage if you or your companions are fighting it. If it fails the saving throw, it is charmed by you until the creation ends or until you or your companions do anything harmful to it. The charmed creature regards you as a friendly acquaintance. When the creation ends, the creature knows it was charmed by you.</p><p><strong>At Higher Levels.</strong> When you use this creation with a creation slot of 2nd level or higher, you can target one additional creature for each slot level above 1st. The creatures must be within 30 feet of each other when you target them.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
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
    "_id": "572b2a91e7a5296b",
    "name": "Color Spray",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>This creation sprays various, vibrant colors into the eyes of creatures around it. Three creatures of your choice within a 15ft cone originating from your space, must make a Constitution saving throw. On a sucessful save, the creature is unaffected. On a failure, the target becomes blinded for the duraction.</p><p><strong>At Higher Levels.</strong> When you use this creation with a creation slot of 2nd level or higher, you can choose to affect an addition creature for each slot level above 1st.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
      "school": "ill",
      "components": {
        "value": "",
        "vocal": true,
        "somatic": true,
        "material": true,
        "ritual": false,
        "concentration": false
      },
      "materials": {
        "value": "a pinch of sand",
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
        "units": "round"
      },
      "target": {
        "value": 15,
        "width": null,
        "units": "ft",
        "type": "cone"
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
    "_id": "ec0a0c05b0daafb9",
    "name": "Command",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p><ul>You speak a one-word command to a creature you can see within range. The target must succeed on a Wisdom saving throw or follow the command on its next turn. The creation has no effect if the target is undead, if it doesn’t understand your language, or if your command is directly harmful to it.\nSome typical commands and their effects follow. You might issue a command other than one described here. If you do so, the GM determines how the target behaves. If the target can’t follow your command, the creation ends.\n<em> Approach. The target moves toward you by the shortest and most direct route, ending its turn if it moves within 5 feet of you.\n</em> Drop. The target drops whatever it is holding and then ends its turn.\n<em> Flee. The target spends its turn moving away from you by the fastest available means.\n</em> Grovel. The target falls prone and then ends its turn.</p><p><li>Halt. The target doesn’t move and takes no actions. A flying creature stays aloft, provided that it is able to do so. If it must move to stay aloft, it flies the minimum distance needed to remain in the air.</li></ul></p><p><strong>At Higher Levels.</strong> When you use this creation with a creation slot of 2nd level or higher, you can affect one additional creature for each slot level above 1st. The creatures must be within 30 feet of each other when you target them.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
      "school": "enc",
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
        "units": "round"
      },
      "target": {
        "value": null,
        "width": null,
        "units": "",
        "type": "creature"
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
    "_id": "0b16a9adf1e31a79",
    "name": "Construct Cannon",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You quickly construct a cannon in an unoccupied space within range. For the duration, the cannon creates its own ammunition, but still requires Clean and Reload. Rules for cannons are shown in the Mounts and Vehicles section of Chapter 4: Equipment and Items. The cannon's damage spread DC uses your creation save DC. When you use the cannon, you can make an ranged creation attack roll instead of using the cannon normally.\nWhile the cannon is within 30 feet of you, you can use the cannon as if you were next to it, either to fire or clean and reload it. The cannon constructed is an 8-pounder (2d10).\nThe cannon counts as a Large Object with an AC equal to 13 + the level of the creation used, and a number of hit points equal to 30 + 10 for each creation level above 2nd. When the cannon's hit points reach 0, or when the creation ends, the cannon is destroyed.</p><p><strong>At Higher Levels.</strong> When you use this creation with a creation slot of 2nd level the cannon you construct is now a 12-pounder (3d10). When you use this creation with a creation slot of 3rd level the cannon you construct is now a 18-pounder (4d10). When you use this creation with a creation slot of 4th level the cannon you construct is now a 24-pounder (6d10). When you use this creation with a creation slot of 5th level the cannon you construct is now a 36-pounder (8d10).</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
      "school": "con",
      "components": {
        "value": "",
        "vocal": false,
        "somatic": true,
        "material": true,
        "ritual": false,
        "concentration": false
      },
      "materials": {
        "value": "a pinch of gun powder",
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
      "actionType": "rsak",
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
    "_id": "e6c54839ce29dd46",
    "name": "Countershock",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You point your finger, and the creature that damaged you is momentarily overloaded with electrical energy. The creature must make a Constitution saving throw. On a failure, the target takes 2d10 lightning damage and cannot take reactions until the end of their next turn. On a success, they only take half damage.</p><p><strong>At Higher Levels.</strong> When you use this creation with a creation slot of 2nd level or higher, the damage increases by 1d10 for each slot level above 1st.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
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
        "type": "reaction",
        "cost": 1,
        "condition": "which you take in response to being damaged by a creature within 60 feet of you that you can see"
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
            "2d10",
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
    "_id": "3d5871c7bb0984b3",
    "name": "Create or Destroy Water",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You either create or destroy water.\n<strong>Create Water.</strong> You create up to 10 gallons of clean water within range in an open container. Alternatively, the water falls as rain in a 30-foot cube within range, extinguishing exposed flames in the area.\n<strong>Destroy Water.</strong> You destroy up to 10 gallons of water in an open container within range. Alternatively, you destroy fog in a 30-foot cube within range.</p><p><strong>At Higher Levels.</strong> When you use this creation with a creation slot of 2nd level or higher, you create or destroy 10 additional gallons of water, or the size of the cube increases by 5 feet, for each slot level above 1st.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
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
        "value": "A drop of water or grain of sand",
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
    "_id": "5b4cb114b7e05ec2",
    "name": "Create Servant (R)",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You create a tiny mechanical servant to aid you. It appears in an unoccupied space within range. This creation uses the Created Servant stat block, which uses your proficiency bonus (PB) in several places. The appearance of the servant can be that of any non-humanoid creature, or toy. For example, its appearance could be a cat or a racing car. You can't have more than one Created Servant at a time, and using this creation again destroys the current Created Servant.\nThe Created Servant is friendly to you and your companions. In combat, it shares your initiative. It obeys your verbal commands (no action required by you), otherwise it will take the Dodge action and use its movement to avoid danger.\nWhen the Created Servant drops to 0 hit points, it becomes inactive until you can spend 10 minutes with your material components, after which it is restored with all its hit points, which can also be restored when you finish a long rest. A creature using the Mend trick on the Created Servant will also restore 2d6 of its hit points.\nAs an action, you can temporarily deactivate your Servant, rendering it inactive. When temporarily deactivated, you can use an action to reactivate the Servant, becoming active again. While it is deactivated this way, you can spend an action to change its appearance, as long as the Created Servant is within range. This can be done while repairing it with your tinker's tools. Whenever the Created Servant is rendered inactive, its speed becomes 0, it'll ignore any verbal commands and it drops in its space anything it was wearing or carrying, but can still perceive the world around it.</p><p><strong>At Higher Levels.</strong> When you use this creation with a creation slot of 2nd level or higher, use the higher level where the creation’s level appears in the stat block. > ## Created Servant >*Tiny construct* > > - **Armor Class** 13 + PB (natural armor) > - **Hit Points** 1 + creativity ability modifier + (4 x your level) > - **Speed** 40 ft., climb 40 ft. > >|STR|DEX|CON|INT|WIS|CHA| >|:---:|:---:|:---:|:---:|:---:|:---:| >|8 (-1)|16 (+3)|12 (+1)|14 (+2)|12 (+1)|10 (0)| > > > - **Skills** Perception +1 plus PB x 2, Proficiency in 3 skills of your choice, in which you are proficient in (chosen when you use this creation) > - **Damage Immunities** poison > - **Condition Immunities** charmed, exhaustion, frightened, poisoned > - **Senses** darkvision 120 ft., passive Perception 11 + (PB x 2) > - **Languages** Understands the languages you speak > > > **Construct Nature.** The Created Servant doesn't require air, food, water or sleep, creations cannot put it to sleep, and is immune to diseases. > > **Channel Creations.** When you use a creation that has a range other than self, the Created Servant can deliver the creation as if it had used the creation while it is within 120 feet of you. If the creation requires an attack roll, you use your attack modifier for the roll. > > **Evasive.** When the Created Servant is forced to make a saving throw to take only half damage from an effect, it instead takes no damage on a successful save, and only takes half damage on a failed save. > > **Tracking.** The Created Servant knows the general direction of your position and will immediately seek you out to the best of its ability if the two of you are separated. Likewise, you know the general direction of the Created Servant's position, however you don't know the distance or obstacles that might be in the way. > ### Actions > ***Bash.*** *Melee Weapon Attack:* your creation attack modifier to hit, reach 5ft., one target. *Hit* (1d4 + PB) Force damage.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
      "school": "con",
      "components": {
        "value": "",
        "vocal": true,
        "somatic": true,
        "material": true,
        "ritual": true,
        "concentration": false
      },
      "materials": {
        "value": "a set of Tinker’s tools",
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
        "value": 10,
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
    "_id": "22c6f718cbfa9a76",
    "name": "Cure Wounds",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>A creature you touch regains a number of hit points equal to 2d10 + your creativity ability modifier. This creation has no effect on undead or constructs.</p><p><strong>At Higher Levels.</strong> When you use this creation using a creation slot of 2nd level or higher, the healing increases by 2d10 for each slot level above 1st.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
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
        "type": "creature"
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
    "_id": "fcae98c3ef342dc2",
    "name": "Detect Poison and Disease (R)",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>For the duration, you can sense the presence and location of poisons, poisonous creatures, and diseases within 30 feet of you. You also identify the kind of poison, poisonous creature, or disease in each case.\nThe creation can penetrate most barriers, but it is blocked by 1 foot of stone, 1 inch of common metal, a thin sheet of lead, or 3 feet of wood or dirt.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
      "school": "div",
      "components": {
        "value": "",
        "vocal": true,
        "somatic": true,
        "material": true,
        "ritual": true,
        "concentration": true
      },
      "materials": {
        "value": "a leaf",
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
    "_id": "76d38e56279d9c22",
    "name": "Disguise",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You make yourself – including your clothing, armor, weapons, and other belongings on your person – look different until the creation ends or until you dismiss it, no action required. You can seem 1 foot shorter or taller and can appear thin, fat, or in between. You can’t change your body type, so you must adopt a form that has the same basic arrangement of limbs. Otherwise, the extent of the disguise is up to you.\nTo discern that you are disguised, a creature can use its action to inspect your appearance and must succeed on an Intelligence (Investigation) check against your creation save DC.\nIf a creature fails the Intelligence (Investigation check to discern that you are disguised, they cannot make that check again until 1 hour has passed.</p><p><strong>At Higher Levels.</strong> When you use this creation using a creation slot of 3rd level or higher, it instead lasts up to 24 hours. When you use this creation using a creation slot of 5th level or higher, it instead lasts up to 7 days. When you use this creation using a creation slot of 7th level or higher, it instead lasts up to 30 days. When you use this creation using a creation slot of 9th level, it lasts indefinitely, until you choose to dismiss it.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
      "school": "ill",
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
        "value": "8",
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
    "_id": "16eff3c6317d3aac",
    "name": "Distort Value",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You use this creation on an object no more than 1 foot on a side, doubling the object's perceived value by adding illusionary flourish or reducing its perceived value by half with the help of illusionary dents and scratches. Anyone examining the object must roll an Investigation check against your creation DC.</p><p><strong>At Higher Levels.</strong> When you use this creation with a higher creation slot, you increase the size of the object by 1 foot per creation slot over 1st.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
      "school": "ill",
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
        "mode": "level",
        "formula": ""
      },
      "activation": {
        "type": "minute",
        "cost": 1,
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
    "_id": "4f3720af98d6c5e9",
    "name": "Discordant Tune",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You play discordant melody that only one creature of your choice within range can hear, wracking it with immense pain. The target must make a Wisdom saving throw. On a failed save, it takes 3d8 psychic damage and must immediately use its reaction, if available, to move as far as its speed allows away from you. The creature doesn’t move into obviously dangerous ground, such as a fire or a pit. On a successful save, the target takes half as much damage and doesn’t have to move away. A deafened creature automatically succeeds on the save.</p><p><strong>At Higher Levels.</strong> When you use this creation with a creation slot of 2nd level or higher, the damage increases by 1d8 for each slot level above 1st.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
      "school": "enc",
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
            "3d8",
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
    "_id": "193d738602cc863d",
    "name": "Elemental Armor",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>A protective shield of elementals surrounds you, covering you and your gear like armor. You gain 10 temporary hit points for the duration. If a creature hits you with a melee attack while you have these hit points, the creature takes damage equal to the amount of temporary hit points you gained from this creation. The damage type is your choice of acid, fire, cold, lightning, poison, or thunder, which you choose when you activate this creation.</p><p><strong>At Higher Levels.</strong> When you use this creation with a creation slot of 3rd level, the temporary hit points increases to 20. When you use this creation with a creation slot of 5th level, the temporary hit points increases to 30. When you use this creation with a creation slot of 7th level, the temporary hit points increases to 40. When you use this creation with a creation slot of 9th level, the temporary hit points increases to 50.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
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
      "actionType": "msak",
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
    "_id": "15ff0bf5db3b1993",
    "name": "Elemental Blast",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You unleash a wave of destructive elements. Choose acid, fire, cold, lightning, poison, or thunder damage. Each creature in a 15-foot cone must make a Dexterity saving throw. A creature takes 3d8 of the chosen damage type on a failed save, or half as much damage on a successful one. The elements spread objects in the area that aren’t being worn or carried.\n<strong>At Higher Levels:</strong> When you use this creation with a creation slot of 2nd level or higher, the damage increases by 1d8 for each slot level above 1st.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
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
        "value": 15,
        "width": null,
        "units": "ft",
        "type": "cone"
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
    "_id": "9cfd3ff24368e2eb",
    "name": "Elemental Orb",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You launch of sphere of elements at a creature that you can see within range. You choose acid, cold, fire, lightning, poison, or thunder for the type of orb you create, and then make a ranged creation attack against the target. If the attack hits, the creature takes 3d10 damage of the type you chose.</p><p><strong>At Higher Levels.</strong> When you use this creation with a creation slot of 2nd level or higher, the damage increases by 1d10 for each slot level above 1st.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
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
      "actionType": "rsak",
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
    "_id": "f7223f8e50caa15b",
    "name": "Elemental Trap",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>While you use this creation, you use the ball of twine to create a circle with a 5-foot radius on a flat surface within your reach. When you finish, the twine disappears to become a trap that will release destructive elements when triggered.\nThe trap is nearly invisible and requires a successful Intelligence (Investigation) check against your creative save DC to be found.\nThe trap triggers when a Small creature or larger moves into the designated area. Select a damage type from the following table.\n##### Elemental Trap Effects\n| Damage Type | Saving Throw | Effect |\n|:----:|:------|:------|\n| Acid  | Constitution | The target's AC is reduced by 2 until the end of its next turn. |\n| Cold  | Strength | Target's movement speed becomes 0 until the end of its next turn. |\n| Fire | Dexterity | The d8s of the damage instead are d10s. |\n| Lightning | Dexterity | An additional creature within 30ft of the target must also make the saving throw against only the damage. |\n| Poison | Constitution | Target is poisoned until the end of its next turn. |\n| Thunder | Strength | Target is knocked prone. |\nThe triggering creature must succeed on a saving throw depending on the damage type chosen, taking 3d8 of the damage type as well as any additional effect on a failure. On a success, a creature only takes half damage.</p><p><strong>At Higher Levels.</strong> When you use this creation with a creation slot of 2nd or higher, the creation deals an additional 1d8 damage for each slot level above 1st.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
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
        "value": "a ball of twine, which is consumed by the creation",
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
        "type": "minute",
        "cost": 1,
        "condition": ""
      },
      "duration": {
        "value": null,
        "units": "spec"
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
    "_id": "5f86ebca29ed80e1",
    "name": "Enduring Spirit",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You bolster yourself to shrug off damage, you gain 10 temporary hit points for the duration.</p><p><strong>At Higher Levels.</strong> When you use this creation with a creation slot of 3rd, you instead gain 20 temporary hit points. With a 5th level slot, 30 temporary hit points. With a 7th level slot, 40 temporary hit points. With a 9th level slot, 50 temporary hit points.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
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
        "value": "a small amount of alcohol",
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
        "type": "bonus",
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
    "_id": "369cad477ff10a49",
    "name": "Ensnare (R)",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>While you use this creation, you use the cord or rope to create a circle with a 5-foot radius on a flat surface within your reach. When you finish, the cord or rope disappears to become a trap.\nThe trap is nearly invisible and requires a successful Intelligence (Investigation) check against your creative save DC to be found.\nThe trap triggers when a Small creature or larger moves into the designated area. The triggering creature must succeed on a Dexterity saving throw or fall prone and be hoisted into the air until it hangs upside down 3 feet above the protected surface, where it is restrained.\nThe restrained creature can make a Dexterity saving throw with disadvantage at the end of each of its turns and ends the restrained effect on a success. Alternatively, another creature that can reach the restrained creature can use an action to make an Intelligence (Engineering) check against your creation save DC. On a success, the restrained effect also ends.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
      "school": "abj",
      "components": {
        "value": "",
        "vocal": true,
        "somatic": true,
        "material": true,
        "ritual": true,
        "concentration": false
      },
      "materials": {
        "value": "30 feet of cord or rope, which is consumed by the creation",
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
        "units": "spec"
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
    "_id": "0fcd225341952c29",
    "name": "Ensnaring Smite",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>When you hit a creature with a melee weapon attack, you can activate this creation as a bonus action.\nThe target must succeed on a Strength saving throw or be restrained by tendrils until the creation ends. A Large or larger creature has advantage on this saving throw. If the target succeeds on the save, the tendrils break away.\nWhile restrained by this creation, the target takes 1d6 piercing damage at the start of each of its turns. A creature restrained by the tendril or one that can touch the creature can use its action to make a Strength check against your creation save DC. On a success, the target is freed.</p><p><strong>At Higher Levels.</strong> If you use this creation with a creation slot of 2nd level or higher, the damage increases by 1d6 for each slot level above 1st. In addition Large or larger creatures don't have advantage when trying to break out.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
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
        "mode": "level",
        "formula": ""
      },
      "activation": {
        "type": "bonus",
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
      "actionType": "msak",
      "attack": {
        "bonus": "",
        "flat": false
      },
      "damage": {
        "parts": [
          [
            "1d6",
            "piercing"
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
    "_id": "553b623a621fdef3",
    "name": "Entangle",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>Grasping weeds and vines sprout from the ground in a 20-foot square starting from a point within range. For the duration, these plants turn the ground in the area into difficult terrain.\nA creature in the area when you use the creation must succeed on a Strength saving throw or be restrained by the entangling plants until the creation ends. A creature restrained by the plants can use its action to make a Strength check against your creation save DC. On a success, it frees itself.\nWhen the creation ends, the plants receed and release any restrained creatures.</p><p><strong>At Higher Levels.</strong> If you use this creation with a creation slot of 2nd level or higher, you can increase the range of the area by 10ft for each level above 1st.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
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
        "units": "minute"
      },
      "target": {
        "value": null,
        "width": null,
        "units": "",
        "type": "space"
      },
      "range": {
        "value": 90,
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
  },
  {
    "_id": "518016caaad3c47c",
    "name": "Fairy Lights",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>Each object in a 20-foot cube within range is outlined in colorful light (your choice). Any creature in the area when the creation is cast is also outlined in light if it fails a Dexterity saving throw. For the duration, objects and affected creatures shed dim light in a 10-foot radius.\nAny attack roll against an affected creature or object has advantage if the attacker can see it, and the affected creature or object can’t benefit from being invisible.</p><p><strong>At Higher Levels.</strong> If you use this creation with a creation slot of 3rd level, the duration increases to 10 minutes with concentration. If you use this creation with a creation slot of 5th level, the duration increases to 1 hour with concentration. If you use this creation with a creation slot of 7th level, the duration increases to 10 minutes with concentration. If you use this creation with a creation slot of 9th level, the duration increases to 24 hours.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
      "school": "evo",
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
        "units": "minute"
      },
      "target": {
        "value": null,
        "width": null,
        "units": "",
        "type": "object"
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
    "_id": "6b34bb9fc096d967",
    "name": "Fear Factor",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You awaken the sense of mortality in one creature you can see within range. A construct or an undead is immune to this effect. The target must succeed on a Wisdom saving throw or become frightened of you until the creation ends. The frightened target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success.</p><p><strong>At Higher Levels.</strong> When you use this creation with a creation slot of 2nd level or higher, you can target one additional creature for each slot level above 1st. The creatures must be within 30 feet of each other when you target them.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
      "school": "nec",
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
    "_id": "13496731d5e2e1f6",
    "name": "Feather Fall",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>Choose up to five falling creatures within range. A falling creature’s rate of descent slows to 60 feet per round until the creation ends. If the creature lands before the creation ends, it takes no falling damage and can land on its feet, and the creation ends for that creature.</p><p><strong>At Higher Levels.</strong> When you use this creation with a creation slot of 2nd level or higher, you can target one additional creature for each slot level above 1st. The creatures must be within 60 feet of each other when you target them.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
      "school": "trs",
      "components": {
        "value": "",
        "vocal": true,
        "somatic": false,
        "material": true,
        "ritual": false,
        "concentration": false
      },
      "materials": {
        "value": "a feather",
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
        "type": "reaction",
        "cost": 1,
        "condition": "which you take when you or a creature within 60 feet of you falls"
      },
      "duration": {
        "value": "1",
        "units": "minute"
      },
      "target": {
        "value": null,
        "width": null,
        "units": "",
        "type": "creature"
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
    "_id": "42ed4857d271a4a6",
    "name": "Flashbang",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You point your finger, and the creature that damaged you is momentarily enveloped in a radiant burst of blinding light. The creature must make a Constitution saving throw. On a failure, the target takes 2d10 radiant damage and becomes blinded until the end of its next turn. On a success, they only take half damage.</p><p><strong>At Higher Levels.</strong> When you use this creation with a creation slot of 2nd level or higher, the damage increases by 1d10 for each slot level above 1st.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
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
        "type": "reaction",
        "cost": 1,
        "condition": "which you take in response to being damaged by a creature within 60 feet of you that you can see"
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
            "2d10",
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
    "_id": "7be58b7c8feaa947",
    "name": "Floating Shield",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>A floating barrier appears and surrounds a creature of your choice within range, granting it a +2 bonus to AC for the duration.</p><p><strong>At Higher Levels.</strong> If you use this creation with a creation slot of 3rd level, the duration increases to 1 hour with concentration. If you use this creation with a creation slot of 5th level, the duration increases to 8 hours with concentration. If you use this creation with a creation slot of 7th level, the duration increases to 24 hours with concentration. If you use this creation with a creation slot of 9th level, the duration increases to 7 days without concentration.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
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
        "value": "a locket",
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
        "type": "creature"
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
    "_id": "676ce00f18850593",
    "name": "Fog Cloud",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You create a 20-foot-radius sphere of fog centered on a point within range. The sphere spreads around corners, and its area is heavily obscured. It lasts for the duration or until a wind of moderate or greater speed (at least 10 miles per hour) disperses it.</p><p><strong>At Higher Levels.</strong> When you use this creation with a creation slot of 2nd level or higher, the radius of the fog increases by 20 feet for each slot level above 1st.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
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
    "_id": "ba63972d91327092",
    "name": "Forced Empathy",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You point your finger, and the creature that damaged you is momentarily forced to feel immense empathy for the damage it inflicted. The creature must make an Intelligence saving throw. On a failure, the target takes 2d10 psychic damage and cannot willingly target you with a harmful effect or attack until the end of its next turn. On a success, they only take half damage.</p><p><strong>At Higher Levels.</strong> When you use this creation with a creation slot of 2nd level or higher, the damage increases by 1d10 for each slot level above 1st.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
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
        "type": "reaction",
        "cost": 1,
        "condition": "which you take in response to being damaged by a creature within 60 feet of you that you can see"
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
            "2d10",
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
    "_id": "ed21d3e954e23387",
    "name": "Frigid Bullet",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>When you hit a creature with a ranged weapon attack, you can activate this creation as a bonus action. Your projectile begins to grow ice cold spikes around it, dealing an extra 1d6 cold damage and flash freezing your target\nThe target makes a Constitution saving throw. On a failure, the target becomes restrained for the duration. While restrained in this way, the target cannot take reactions.</p><p><strong>At Higher Levels.</strong> If you use this creation with a creation slot of 2nd level or higher, the damage increases by 1d6 for each slot level above 1st.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
      "school": "evo",
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
        "mode": "level",
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
            "1d6",
            "cold"
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
    "_id": "e22c7a85893a513b",
    "name": "Frozen Over",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You point your finger, and the creature that damaged you is momentarily covered in piercing frost. The creature must make a Constitution saving throw. On a failure, the target takes 2d10 cold damage and their movement speed is halved until the end of their next turn. On a successful save, the only take half damage.</p><p><strong>At Higher Levels.</strong> When you use this creation with a creation slot of 2nd level or higher, the damage increases by 1d10 for each slot level above 1st.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
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
        "type": "reaction",
        "cost": 1,
        "condition": "which you take in response to being damaged by a creature within 60 feet of you that you can see"
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
            "2d10",
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
    "_id": "c683302dba130c97",
    "name": "Gadget Armor",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You touch a willing creature who isn't wearing armor, and a protect it for the duration. The target's base AC becomes 13 + its Dexterity modifier. The creation ends if the target dons armor or if you dismiss the creation, no action required.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
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
        "value": "a piece of leather",
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
        "type": "creature"
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
    "_id": "009987cde609e6d3",
    "name": "Grease",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>Slick grease covers the ground in a 10-foot square centered on a point within range and turns it into difficult terrain for the duration.\nWhen the grease appears, each creature standing in its area must succeed on a Dexterity saving throw or fall prone. A creature that enters the area or ends its turn there must also succeed on a Dexterity saving throw or fall prone.</p><p><strong>At Higher Levels.</strong> When you use this creation using a creation slot of 2nd level or higher, you can create an additional 10-foot square within range for each level above 1st.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
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
        "value": "a bit of butter",
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
        "units": "minute"
      },
      "target": {
        "value": null,
        "width": null,
        "units": "",
        "type": "space"
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
    "_id": "203a9bc703919ebe",
    "name": "Grow Tree",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You instantaneously cause a Large tree to grow in a chosen space within range. If a creature is within the space, it is shunted to the closest, safest place. The tree has 16 AC and 40 hit points.</p><p><strong>At Higher Levels.</strong> When you use this creation using a creation slot of 3rd or 4th level, the tree's size increases by becomes Huge, its AC becomes 18, and its HP becomes 80. When you use this creation with a creation slot of 5th level or higher, the tree's size becomes Gargantuan, its AC becomes 20, and its HP becomes 120.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
      "school": "abj",
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
        "type": "space"
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
    "_id": "61e4678b7fc4b51d",
    "name": "Healing Word",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>A creature of your choice that you can see within range regains hit points equal to 2d6 + your creativity ability modifier. This creation has no effect on undead or constructs.</p><p><strong>At Higher Levels.</strong> When you use this creation using a creation slot of 2nd level or higher, the healing increases by 2d6 for each slot level above 1st.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
      "school": "evo",
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
        "mode": "level",
        "formula": ""
      },
      "activation": {
        "type": "bonus",
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
    "_id": "42e7434ee3158ffb",
    "name": "Heroism",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You instill bravery into a willing creature you touch. Until the creation ends, the creature is immune to being frightened and gains 5 temporary hit points at the start of each of its turns. When the creation ends, the target loses any remaining temporary hit points from this creation.</p><p><strong>At Higher Levels.</strong> When you use this creation with a creation slot of 2nd level or higher, you can target one additional creature for each slot level above 1st. Additionally, when you use this creation at 3rd, 5th, 7th, and 9th level, you increase the temporary hit points by 5.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
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
        "units": "minute"
      },
      "target": {
        "value": null,
        "width": null,
        "units": "",
        "type": "creature"
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
    "_id": "d824d623b3308d4b",
    "name": "Hex",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You place a curse on a creature that you can see within range. Until the creation ends, you deal an extra 1d6 necrotic damage to the target whenever you hit it with an attack. Also, choose one ability when you use this creation. The target has disadvantage on ability checks made with the chosen ability.\nIf the target drops to 0 hit points before this creation ends, you can use a bonus action on a subsequent turn of yours to curse a new creature.\nA Remove Curse creation on the target ends this creation early.</p><p><strong>At Higher Levels.</strong> When you use this creation with a creation slot of 3rd or 4th level, you can maintain your concentration on the creation for up to 8 hours. When you use a creation slot of 5th level or higher, you don't need maintain your concentration on the creation and it lasts 24 hours.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
      "school": "enc",
      "components": {
        "value": "",
        "vocal": true,
        "somatic": true,
        "material": true,
        "ritual": false,
        "concentration": true
      },
      "materials": {
        "value": "a newt's eye",
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
        "type": "bonus",
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
        "value": 90,
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
        "parts": [
          [
            "1d6",
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
    "_id": "a054e39d4b1f631a",
    "name": "Hideous Laughter",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>A creature of your choice that you can see within range falls into fits of laughter if this creation affects it. The target must succeed on a Wisdom saving throw or fall prone, becoming incapacitated and unable to stand up for the duration. A creature with an Intelligence score of 4 or less isn’t affected.\nAt the end of each of its turns, and each time it takes damage, the target can make another Wisdom saving throw. The target has advantage on the saving throw if it’s triggered by damage. On a success, the creation ends.</p><p><strong>At Higher Levels.</strong> When you use this creation with a creation slot of 2nd level or higher, you can target one additional creature for each slot level above 1st. The creatures must be within 30 feet of each other when you target them.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
      "school": "enc",
      "components": {
        "value": "",
        "vocal": true,
        "somatic": true,
        "material": true,
        "ritual": false,
        "concentration": true
      },
      "materials": {
        "value": "a feather",
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
    "_id": "4f5914ba3bf4c05a",
    "name": "Hunter's Mark",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You choose a creature you can see within range and mark it as your target. Until the creation ends, you deal an extra 1d6 damage to the target whenever you hit it with a weapon attack, and you have advantage on any Wisdom (Perception) or Wisdom (Survival) check you make to find it. If the target drops to 0 hit points before this creation ends, you can use a bonus action on a subsequent turn of yours to mark a new creature.</p><p><strong>At Higher Levels.</strong> When you use this creation with a creation slot of 3rd or 4th level, you can maintain your concentration on the creation for up to 8 hours. When you use a creation slot of 5th level or higher, you don't need maintain your concentration on the creation and it lasts 24 hours.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
      "school": "div",
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
        "mode": "level",
        "formula": ""
      },
      "activation": {
        "type": "bonus",
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
        "type": "creature"
      },
      "range": {
        "value": 90,
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
    "_id": "18a7fa4443aae0c1",
    "name": "Ice Dagger",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You launch a shard of ice at one creature within range. Make a ranged creation attack against the target. On a hit, the target takes 1d10 piercing damage. Hit or miss, the shard then explodes. The target and each creature within 5 feet of the point where the ice exploded must succeed on a Dexterity saving throw or take 2d6 cold damage.</p><p><strong>At Higher Levels.</strong> When you use this creation with a creation slot of 2nd level or higher, the cold damage increases by 2d6 for each slot level above 1st.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
      "school": "con",
      "components": {
        "value": "",
        "vocal": false,
        "somatic": true,
        "material": true,
        "ritual": false,
        "concentration": false
      },
      "materials": {
        "value": "a drop of water",
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
      "actionType": "rsak",
      "attack": {
        "bonus": "",
        "flat": false
      },
      "damage": {
        "parts": [
          [
            "1d10",
            "piercing"
          ],
          [
            "2d6",
            "cold"
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
    "_id": "a917e2113823fb54",
    "name": "Identification (R)",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You choose one object that you must touch throughout the usage of this creation. If it is a mastercraft item or some other similar object, you learn its properties and how to use them, and how many charges it has, if any. You learn whether any creations are affecting the item and what they are. If the item was created by a creation, you learn which creation created it.\nIf you instead touch a creature throughout the usage, you learn what creations or similar effects, if any, are currently affecting it.\nThis creation doesn't give you insight of the nature on supernatural aspects such as curses or devil fruits, only merely their existence.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
      "school": "div",
      "components": {
        "value": "",
        "vocal": true,
        "somatic": true,
        "material": true,
        "ritual": true,
        "concentration": false
      },
      "materials": {
        "value": "any artisan's tools",
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
    "_id": "28883bf7bcb36c33",
    "name": "Incidental Chorus",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>Music of a style you choose fills the air around you in a 30-foot radius. The music spreads around corners and can be heard from up to 100 feet away. The music moves with you, centered on you for the duration.\nUntil the creation ends, you make Charisma (Performance) checks with advantage. In addition, you can use a bonus action on each of your turns to beguile one creature you choose within 30 feet of you that can see you and hear the music. The creature must make a Charisma saving throw. If you or your companions are attacking it, the creature automatically succeeds on the saving throw. On a failure, the creature becomes friendly to you for as long as it can hear the music and for 1 hour thereafter. You make Charisma (Deception) checks and Charisma (Persuasion) checks against creatures made friendly by this creation with advantage.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
      "school": "ill",
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
        "value": "10",
        "units": "minute"
      },
      "target": {
        "value": 30,
        "width": null,
        "units": "ft",
        "type": "sphere"
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
        "ability": "cha",
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
    "_id": "9aaa74a579fe5771",
    "name": "Infectious Ray",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>A ray of sickening energy lashes out toward a creature within range. Make a ranged creation attack against the target. On a hit, the target takes 2d8 poison damage and must make a Constitution saving throw. On a failed save, it is also poisoned for up to 1 minute, with concentration. At the end of each of the target's turns, they can remake the Constitution saving throw, ending the effect on a successful save.</p><p><strong>At Higher Levels.</strong> When you use this creation with a creation slot of 2nd level or higher, the damage increases by 1d8 for each slot level above 1st.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
      "school": "nec",
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
      "actionType": "rsak",
      "attack": {
        "bonus": "",
        "flat": false
      },
      "damage": {
        "parts": [
          [
            "2d8",
            "poison"
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
    "_id": "1b4d05546cb01a1a",
    "name": "Inflict Wounds",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You cause a creature to become grieviously wounded. Make a melee creation attack against a creature you can reach. On a hit, the target takes 3d12 necrotic damage.</p><p><strong>At Higher Levels.</strong> When you use this creation using a creation slot of 2nd level or higher, the damage increases by 1d12 for each slot level above 1st.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
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
        "units": "touch"
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
            "3d12",
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
    "_id": "d9195b01295e041c",
    "name": "Invisible Ink (R)",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You write on parchment, paper, or some other suitable writing material using special ink that lasts for the duration.\nTo you and any creatures you designate when you use this creation, the writing appears normal, written in your hand, and conveys whatever meaning you intended when you wrote the text. To all others, the writing appears as if it were written in an unknown and unintelligible script.\nAlternatively, you can cause the writing to appear to be an entirely different message, written in a different hand and language, though the language must be one you know.\nAfter the creation ends the invisible texts disappears. A creature with truesight can read the hidden message.</p><p><strong>At Higher Levels.</strong> When you use this creation with a creation slot of 2nd level or higher, the duration increases by an additional 10 days for each slot above 2nd level. When you use a 5th level or higher creation slot, the text becomes permanent.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
      "school": "ill",
      "components": {
        "value": "",
        "vocal": true,
        "somatic": true,
        "material": true,
        "ritual": true,
        "concentration": false
      },
      "materials": {
        "value": "Special ink that costs at least 10 GP, or 100,000 berries",
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
        "type": "minute",
        "cost": 1,
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
    "_id": "631f80507361a31d",
    "name": "Jump",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You touch a creature. The creature’s jump distance is tripled until the creation ends.</p><p><strong>At Higher Levels.</strong> When you use this creation with a creation slot of 2nd level or higher, you can target one additional creature for each slot level above 1st.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
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
        "value": "a grasshopper's leg",
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
    "_id": "6ddfeefae4da6e83",
    "name": "Karma",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You point your finger, and the creature that damaged you is momentarily forced to suffer the consequences of harming you. The creature must make a Constitution saving throw. On a failure, the target takes 2d10 necrotic damage and cannot regain hit points until the end of its next turn. On a success, they only take half damage.</p><p><strong>At Higher Levels.</strong> When you use this creation with a creation slot of 2nd level or higher, the damage increases by 1d10 for each slot level above 1st.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
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
        "type": "reaction",
        "cost": 1,
        "condition": "which you take in response to being damaged by a creature within 60 feet of you that you can see"
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
            "2d10",
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
    "_id": "018f4fe70b06fb33",
    "name": "Levitate",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>One creature or loose object of your choice that you can see within range rises vertically, up to 20 feet, and remains suspended there for the duration. The creation can levitate a target that weighs up to 500 pounds. An unwilling creature that succeeds on a Constitution saving throw is unaffected.\nThe target can move only by pushing or pulling against a fixed object or surface within reach (such as a wall or a ceiling), which allows it to move as if it were climbing. You can change the target’s altitude by up to 20 feet in either direction on your turn. If you are the target, you can move up or down as part of your move. Otherwise, you can use your action to move the target, which must remain within the creation’s range.\nWhen the creation ends, the target floats gently to the ground if it is still aloft.</p><p><strong>At Higher Levels.</strong> When you use this creation with a creation slot of 2nd level or higher, you can target one additional creature or loose object for each slot level above 1st. The creatures or objects must be within 30 feet of each other when you target them.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
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
        "value": "a piece of leather",
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
    "_id": "7c4abdef5c5c657b",
    "name": "Missiles",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You create three homing projectiles. Each projectile hits a creature of your choice that you can see within range. A projectile deals 1d4 + 2 force damage to its target. The darts all strike simultaneously, and you can direct them to hit one creature or several.</p><p><strong>At Higher Levels.</strong> When you use this creation with a creation slot of 2nd level or higher, the creation creates one more dart for each slot above 1st.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
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
        "type": "creature"
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
      "actionType": "",
      "attack": {
        "bonus": "",
        "flat": false
      },
      "damage": {
        "parts": [
          [
            "1d4 + 2",
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
    "_id": "5a7dd326675643fb",
    "name": "Puppet",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>Your gesture forces one humanoid you can see within range to make a Constitution saving throw. On a failed save, the target must move up to its speed in a direction you choose. In addition, you can cause the target to drop whatever it is holding. This creation has no effect on a humanoid that is immune to being charmed.</p><p><strong>At Higher Levels.</strong> When you use this creation with a creation slot of 2nd level or higher, you can target one additional humanoid for each slot above 1st.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
      "school": "enc",
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
    "_id": "b47a10acfe34d792",
    "name": "Purify Food and Drink (R)",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>All food and drink within a 5-foot-radius sphere centered on a point of your choice within range is purified and rendered free of poison and disease.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
      "school": "trs",
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
        "value": 10,
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
    "_id": "a3e3ad986290dbe7",
    "name": "Radiant Blast",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You unleash a flash of light toward a creature of your choice within range. Make a ranged creation attack against the target. On a hit, the target takes 4d6 radiant damage, and the next attack roll made against this target before the end of your next turn has advantage, thanks to the dim light glittering on the target until then.</p><p><strong>At Higher Levels.</strong> When you use this creation with a creation slot of 2nd level or higher, the damage increases by 1d6 for each slot level above 1st.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
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
        "units": "round"
      },
      "target": {
        "value": null,
        "width": null,
        "units": "",
        "type": "creature"
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
      "actionType": "rsak",
      "attack": {
        "bonus": "",
        "flat": false
      },
      "damage": {
        "parts": [
          [
            "4d6",
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
    "_id": "ae3d605002d8efc5",
    "name": "Retreat",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>This creation allows you to move at an incredible pace. When you use this creation, and then as a bonus action on each of your turns until the creation ends, you can take the Dash action.</p><p><strong>At Higher Levels.</strong> When you use this creation with. a creation slot of 2nd level, you increase the duration to 1 hour with concentration. When you use this creation with. a creation slot of 3rd level, you increase the duration to 8 hours with concentration. When you use this creation with a creation slot of 4th level, you increase the duration to 24 hours with concentration. When you use this creation with a creation slot of 5th level, you increase the duration to 24 hours.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
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
        "mode": "level",
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
    "_id": "7e88567b5dd4ed4a",
    "name": "Reverb",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You point your finger, and the creature that damaged you is momentarily assaulted by immense vibrations. The creature must make a Strength saving throw. On a failure, the target takes 2d10 thunder damage and is either knocked 10ft backwards or knocked prone (your choice). On a success, they only take half damage.</p><p><strong>At Higher Levels.</strong> When you use this creation with a creation slot of 2nd level or higher, the damage increases by 1d10 for each slot level above 1st.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
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
        "type": "reaction",
        "cost": 1,
        "condition": "which you take in response to being damaged by a creature within 60 feet of you that you can see"
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
            "2d10",
            "thunder"
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
  },
  {
    "_id": "28bff060f1a56f90",
    "name": "Sanctuary",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You protect a creature within range against all attacks. Until the creation ends, any creature who targets the protected creature with an attack, harmful creation, or effect must first make a Wisdom saving throw. On a failed save, the creature must choose a new target or lose the attack, creation, or other effect. This creation doesn’t protect the creature from area effects, such as the explosion of a fireball.\nIf the protected creature makes an attack, creation, or other effect that affects an enemy creature, this creation ends.</p><p><strong>At Higher Levels.</strong> When you use this creation with a creation slot of 2nd level or higher, you can target one creature to protect within range for each slot above 1st.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
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
        "value": "a small mirror",
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
        "type": "creature"
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
    "_id": "c123fc8b014241f9",
    "name": "Searing Smite",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>When you hit a creature with a melee weapon attack, you can activate this creation as a bonus action. Your weapon flares with white-hot intensity, and the attack deals an extra 1d6 fire damage to the target and causes the target to ignite in flames.\nAt the start of each of its turns until the creation ends, the target must make a Constitution saving throw. On a failed save, it takes 1d6 fire damage. On a successful save, the creation ends. If the target or a creature within 5 feet of it uses an action to put out the flames, or if some other effect douses the flames (such as the target being submerged in water), the creation ends.</p><p><strong>At Higher Levels.</strong> When you use this using a creation slot of 2nd level or higher, the initial extra damage dealt by the attack increases by 1d6 for each slot.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
      "school": "evo",
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
        "mode": "level",
        "formula": ""
      },
      "activation": {
        "type": "bonus",
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
      "actionType": "msak",
      "attack": {
        "bonus": "",
        "flat": false
      },
      "damage": {
        "parts": [
          [
            "1d6",
            "fire"
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
    "_id": "2a4f8f44648da00a",
    "name": "Shield",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>A barrier appears in your defense. Until the start of your next turn, you have a +5 bonus to AC, including against the triggering attack, and you take no damage from the missiles creation.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
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
        "type": "reaction",
        "cost": 1,
        "condition": "which you take when you are hit by an attack or targeted by the missiles creation"
      },
      "duration": {
        "value": "1",
        "units": "round"
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
    "_id": "705ee3e0e35efd3e",
    "name": "Shrapnel Shot",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>When you hit a creature with a ranged weapon attack, you can use your bonus action to use this creation. This creation launches several sharp projectiles from your ranged weapon or ammunition. In addition to the normal effect of the attack, the target of the attack and each creature within 5 feet of it must make a Dexterity saving throw. A creature takes 2d6 piercing damage on a failed save, or half as much damage on a successful one.</p><p><strong>At Higher Levels.</strong> If you cast this creation with a creation slot of 2nd level or higher, the damage increases by 2d6 for each slot level above 1st.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
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
        "mode": "level",
        "formula": ""
      },
      "activation": {
        "type": "bonus",
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
            "2d6",
            "piercing"
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
    "_id": "c7dc189d778032bb",
    "name": "Silent Image",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You create the image of an object, a creature, or some other visible phenomenon that is no larger than a 15-foot cube. The image appears at a spot within range and lasts for the duration. The image is purely visual; it isn’t accompanied by sound, smell, or other sensory effects.\nYou can use your action to cause the image to move to any spot within range. As the image changes location, you can alter its appearance so that its movements appear natural for the image. For example, if you create an image of a creature and move it, you can alter the image so that it appears to be walking.\nPhysical interaction with the image reveals it to be an illusion, because things can pass through it. A creature that uses its action to examine the image can determine that it is an illusion with a successful Intelligence (Investigation) check against your creation save DC. If a creature discerns the illusion for what it is, the creature can see through the image.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
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
        "value": "a bit of fleece",
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
    "_id": "b39ad13bac292c76",
    "name": "Skill Support",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>Your words deepen a creature’s understanding of its own talent. You touch one willing creature and give it expertise in one skill of your choice; until the creation ends, the creature doubles its proficiency bonus for ability checks it makes that use the chosen skill.\nYou must choose a skill in which the target is proficient and that isn’t already benefiting from an effect, such as Expertise, that doubles its proficiency bonus.</p><p><strong>At Higher Levels.</strong> When you use this creation with a creation slot of 2nd level or higher, you can target one additional creature for each slot above 1st.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
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
    "_id": "69a9594aee40b00f",
    "name": "Sleep",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>This creation sends creatures into slumber. Choose a point within the creation's range. Three creatures of your choice within a 20ft radius sphere of the point you choice, must make a Constitution saving throw. On a sucessful save, the creature is unaffected. On a failure, the target falls asleep for the duration, rendering them unconsious. This effect ends early if one of the asleep targets takes damage, or if a creature uses their action to shake them awake.\nUndead and creatures immune to being charmed aren’t affected by this creation.</p><p><strong>At Higher Levels.</strong> When you use this creation with a creation slot of 2nd level or higher, you can choose to affect an addition creature for each slot level above 1st.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
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
        "value": "a pinch of sand",
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
        "units": "minute"
      },
      "target": {
        "value": null,
        "width": null,
        "units": "",
        "type": ""
      },
      "range": {
        "value": 90,
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
    "_id": "36b97f7037440b56",
    "name": "Speak with Animals (R)",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You gain the ability to comprehend and verbally communicate with beasts for the duration. The knowledge and awareness of many beasts is limited by their intelligence, but at minimum, beasts can give you information about nearby locations and creatures, including whatever they can perceive or have perceived within the past day. You might be able to persuade a beast to perform a small favor for you, at the GM’s discretion.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
      "school": "div",
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
    "_id": "762d863bd581ef6b",
    "name": "Spiritual Servant (R)",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You influence the spirits around you, creating an invisible, mindless, shapeless, Medium force that performs simple tasks at your command until the creation ends. The servant springs into existence in an unoccupied space on the ground within range. It has AC 10, 1 hit point, and a Strength of 10, and it can’t attack. If it drops to 0 hit points, the creation ends.\nOnce on each of your turns as a bonus action, you can mentally command the servant to move up to 15 feet and interact with an object. The servant can perform simple tasks that a human servant could do, such as fetching things, cleaning, mending, folding clothes, lighting fires, serving food, and pouring wine. Once you give the command, the servant performs the task to the best of its ability until it completes the task, then waits for your next command.\nIf you command the servant to perform a task that would move it more than 60 feet away from you, the creation ends.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
      "school": "con",
      "components": {
        "value": "",
        "vocal": true,
        "somatic": true,
        "material": true,
        "ritual": true,
        "concentration": false
      },
      "materials": {
        "value": "a piece of string",
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
    "_id": "eefa45cca76e8f52",
    "name": "Stonesculpt",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You touch a stone object of Medium size or smaller or a section of stone no more than 5 feet in any dimension and form it into any shape that suits your purpose. So, for example, you could shape a large rock into a weapon, idol, or coffer, or make a small passage through a wall. You could also shape a stone door or its frame to seal the door shut. The object you create can have up to two hinges and a latch, but finer mechanical detail isn’t possible.</p><p><strong>At Higher Levels.</strong> When you use this creation with a creation slot of 2nd level or higher, the stone you can sculpt increases by one size or an additional 5ft in each dimension if it is an area of a larger piece of stone. You can use this creation with at most a 5th level slot, Colassal size or 25ft in each dimension.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
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
        "value": "a piece of clay",
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
    "_id": "b6c9ce9518004c51",
    "name": "Superfood",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You create up to ten pellets appear in your hand and are infused with vitamins, protiens, and minerals for the duration. A creature can use its action to eat one pellet. Eating a pellet restores 1 hit point, and the pellet provides enough nourishment to sustain a creature for one day.\nThe pellets lose their potency if they have not been consumed within 24 hours of the use of this creation.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
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
        "value": "a seed",
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
    "_id": "52227bd5a8d149c9",
    "name": "Thunderous Smite",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>When you hit a creature with a melee weapon attack, you can activate this creation as a bonus action.\nYour weapon rings with thunder that is audible within 300 feet of you, and the attack deals an extra 2d6 thunder damage to the target. Additionally, if the target is a creature, it must succeed on a Strength saving throw or be pushed 10 feet away from you and knocked prone.</p><p><strong>At Higher Levels.</strong> When you use this creation with a creation slot of 2nd level or higher, the creation deals an extra 1d6 thunder damage for each slot above 1st.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
      "school": "evo",
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
        "mode": "level",
        "formula": ""
      },
      "activation": {
        "type": "bonus",
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
      "actionType": "msak",
      "attack": {
        "bonus": "",
        "flat": false
      },
      "damage": {
        "parts": [
          [
            "2d6",
            "thunder"
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
    "_id": "1f2fe8baf6843f08",
    "name": "Thunderwave",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You unleash a wave of thunderous force. Each creature in a 15-foot cube originating from you must make a Constitution saving throw. On a failed save, a creature takes 3d8 thunder damage and is pushed 10 feet away from you. On a successful save, the creature takes half as much damage and isn’t pushed. In addition, unsecured objects that are completely within the area of effect are automatically pushed 10 feet away from you by the creation’s effect, and the spell emits a thunderous boom audible out to 300 feet.</p><p><strong>At Higher Levels.</strong> When you use this creation with a creation slot of 2nd level or higher, the damage increases by 1d8 for each slot level above 1st.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
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
        "value": 15,
        "width": null,
        "units": "ft",
        "type": "cube"
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
            "3d8",
            "thunder"
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
    "_id": "eaf9858d78f2a00f",
    "name": "Toxic Trigger",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>When you hit a creature with a ranged weapon attack, you can activate this creation as a bonus action. Your projectile drips with a virulent and deadly poison, dealing an extra 1d10 poison damage.\nThe target makes a Constitution saving throw. On a failure, the poison infects the target’s mind, forcing them on their next turn to use their full movement speed to move towards the closest creature within range, and use their action to attack that creature.</p><p><strong>At Higher Levels.</strong> If you use this creation with a creation slot of 2nd level or higher, the damage increases by 1d10 for each slot level above 1st.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
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
        "mode": "level",
        "formula": ""
      },
      "activation": {
        "type": "bonus",
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
            "1d10",
            "poison"
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
    "_id": "ed45f1ae8cef1908",
    "name": "Tremor",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You cause a tremor in the ground in a 15-foot radius. Each creature other than you in that area must make a Dexterity saving throw. On a failed save, a creature takes 2d8 bludgeoning damage and is knocked prone. If you choose to, you can cause the surrounding area to become difficult terrain until cleared.</p><p><strong>At Higher Levels.</strong> When you use this creation with a creation slot of 2nd level or higher, the damage increases by 1d8 for each slot level above 1st.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
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
        "value": 15,
        "width": null,
        "units": "ft",
        "type": "sphere"
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
            "2d8",
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
    "_id": "20c88990c23db106",
    "name": "Twist Fate",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You cause a momentary distract the triggering creature and turn its uncertainty into encouragement for another creature. The triggering creature must reroll the d20 and use the lower roll.\nYou can then choose a different creature you can see within range (you can choose yourself). The chosen creature has advantage on the next attack roll, ability check, or saving throw it makes within 1 minute. A creature can be empowered by only one use of this creation at a time.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
      "school": "enc",
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
        "type": "reaction",
        "cost": 1,
        "condition": "which you take when a creature you can see within 60 feet of yourself succeeds on an attack roll, an ability check, or a saving throw"
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
    "_id": "7f5ee2bdf43550cc",
    "name": "Vengeful Flames",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You point your finger, and the creature that damaged you is momentarily surrounded by vengeful flames. The creature takes 2d10 fire damage.</p><p><strong>At Higher Levels.</strong> When you use this creation with a creation slot of 2nd level or higher, the damage increases by 1d10 for each slot level above 1st.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
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
        "type": "reaction",
        "cost": 1,
        "condition": "which you take in response to being damaged by a creature within 60 feet of you that you can see"
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
        "parts": [
          [
            "2d10",
            "fire"
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
    "_id": "ac7e22ef10f97247",
    "name": "Vile Verdict",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You point your finger, and the creature that damaged you is momentarily splashed with a virulent poison. The creature must make a Constitution saving throw. On a failure, the target takes 2d10 poison damage and is poisoned until the end of their next turn. On a success, they only take half damage.</p><p><strong>At Higher Levels.</strong> When you use this creation with a creation slot of 2nd level or higher, the damage increases by 1d10 for each slot level above 1st.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
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
        "type": "reaction",
        "cost": 1,
        "condition": "which you take in response to being damaged by a creature within 60 feet of you that you can see"
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
            "2d10",
            "poison"
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
    "_id": "d854d12897a52479",
    "name": "Wrathful Smite",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>When you hit a creature with a melee weapon attack, you can activate this creation as a bonus action.\nYour attack deals an extra 1d8 psychic damage. Additionally, if the target is a creature, it must make a Wisdom saving throw or be frightened of you for 1 minute. At the end of each of the creature's turns, the creature can make a Wisdom saving throw against your creation save DC to steel its resolve and end this effect.</p><p><strong>At Higher Levels.</strong> When you use this creation with a creation slot of 2nd level or higher, the damage increases by 1d8 for each slot level above 1st.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
      "school": "evo",
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
        "mode": "level",
        "formula": ""
      },
      "activation": {
        "type": "bonus",
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
      "actionType": "msak",
      "attack": {
        "bonus": "",
        "flat": false
      },
      "damage": {
        "parts": [
          [
            "1d8",
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
    "_id": "392871ae6b41fb0c",
    "name": "Zapping Arc",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>A beam of crackling, blue energy lances out toward a creature within range, forming a sustained arc of lightning between you and the target. Make a ranged creation attack against that creature. On a hit, the target takes 1d12 lightning damage, and on each of your turns for the duration, you can use your action to deal 1d12 lightning damage to the target automatically. The creation ends if you use your action to do anything else. The creation also ends if the target is ever outside the creations’s range or if it has total cover from you.</p><p><strong>At Higher Levels.</strong> When you use this creation with a creation slot of 2nd level or higher, the damage each increases by 1d12 for each slot level above 1st.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
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
        "value": "twig from a tree that was struck by lightning",
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
      "actionType": "rsak",
      "attack": {
        "bonus": "",
        "flat": false
      },
      "damage": {
        "parts": [
          [
            "1d12",
            "lightning"
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
    "_id": "a0c1555e53d5a4df",
    "name": "Zephyr Strike",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You move like the wind. For the duration, your movement doesn’t provoke opportunity attacks.\nOnce before the creation ends, you can give yourself advantage on one weapon attack roll on your turn. That attack deals an extra 1d8 force damage on a hit. Whether you hit or miss, your walking speed increases by 30 feet until the end of that turn.</p><p><strong>At Higher Levels.</strong> When you use this creation with a creation slot of 2nd level or higher, the damage each increases by 1d8 for each slot level above 1st.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 1,
      "school": "trs",
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
        "mode": "level",
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
        "parts": [
          [
            "1d8",
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
  }
];
