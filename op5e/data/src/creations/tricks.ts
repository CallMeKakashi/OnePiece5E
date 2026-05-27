import type { FoundryItem } from "../../../schemas/common.js";

export const tricks: FoundryItem[] = [
  {
    "_id": "474cd8bd2fad9412",
    "name": "Acid Bolt",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You hurl a blast of purely destructive acid at a creature or object within range. Make a ranged creation attack against the target. On a hit, the target takes 1d10 acid damage. Small, inanimate plants within 5ft of the target are destroyed.\nAdditionally, you can manipulate the acid to create tiny sensory effects as an action. You cause simple shapes—such as the vague form of a creature, an inanimate object, or a location—to appear and animate as you like. The shapes last for 1 hour, and you can have up to three of them active at a time, and you can dismiss some or all as an action.</p><p><strong>At Higher Levels.</strong> At higher levels you can choose to either make one big blast, or multiple smaller blasts. For the single blast, this trick's damage increases by 1d10 when you reach 5th level (2d10), 11th level (3d10), and 17th level (4d10). For the multiple blasts, two blasts at 5th level, three blasts at 11th level, and four beams at 17th level. You can direct the beams at the same target or at different ones. Make a separate attack roll for each beam.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 0,
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
        "mode": "cantrip",
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
      "actionType": "rsak",
      "attack": {
        "bonus": "",
        "flat": false
      },
      "damage": {
        "parts": [
          [
            "1d10",
            "acid"
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
    "_id": "5588b1ae6290d179",
    "name": "Acid Spray",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You launch a small wave of acidic liquid. Choose one creature you can see within range, or choose two creatures you can see within range that are within 5 feet of each other. A target must succeed on a Dexterity saving throw or take 1d10 acid damage.</p><p><strong>At Higher Levels.</strong> This trick’s damage increases by 1d10 when you reach 5th level (2d10), 11th level (3d10), and 17th level (4d10).</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 0,
      "school": "con",
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
        "mode": "cantrip",
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
            "1d10",
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
    "_id": "92d959b709d34824",
    "name": "Allure",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You are able to put your best foot forwards with charm and a bit of make up. For the duration, you have a 1d6 bonus to all persuasion checks against creatures that are not hostile towards you.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 0,
      "school": "enc",
      "components": {
        "value": "",
        "vocal": false,
        "somatic": true,
        "material": true,
        "ritual": false,
        "concentration": true
      },
      "materials": {
        "value": "a bit of make up",
        "consumed": false,
        "cost": 0,
        "supply": 0
      },
      "preparation": {
        "mode": "prepared",
        "prepared": false
      },
      "scaling": {
        "mode": "cantrip",
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
    "_id": "ee3294160faee6d1",
    "name": "Animal Eyes",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You establish a link with one beast you touch that is friendly to you or charmed by you. Until the creation ends, the link is active between you an your beast. Through the link, the beast can understand your telepathic messages to it, it can telepathically communicate simple emotions and concepts back to you, and you can sense through both yourself and your beast for the duration.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 0,
      "school": "div",
      "components": {
        "value": "",
        "vocal": true,
        "somatic": true,
        "material": true,
        "ritual": false,
        "concentration": true
      },
      "materials": {
        "value": "a bit of fur",
        "consumed": false,
        "cost": 0,
        "supply": 0
      },
      "preparation": {
        "mode": "prepared",
        "prepared": false
      },
      "scaling": {
        "mode": "cantrip",
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
    "_id": "8ee653427c9d3b49",
    "name": "Bitter Blade",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You make a melee attack with a melee weapon or unarmed strike against one creature within melee range. On a hit, the target suffers the weapon attack’s normal effects, and you can cause the target to become covered in acid until the start of your next turn. While covered in acid, the creature will take 1d8 acid damage at the end of their next turn, ending the creation, if they don't use either their action or bonus action to clean off the acid.</p><p><strong>At Higher Levels.</strong> At 5th level, the melee attack deals an extra 1d8 acid damage to the target on a hit, and the damage the target takes for not cleaning the acid increases to 2d8. Both damage rolls increase by 1d8 at 11th level (2d8 and 3d8) and again at 17th level (3d8 and 4d8).</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 0,
      "school": "evo",
      "components": {
        "value": "",
        "vocal": false,
        "somatic": true,
        "material": true,
        "ritual": false,
        "concentration": false
      },
      "materials": {
        "value": "melee weapon or unarmed strike",
        "consumed": false,
        "cost": 0,
        "supply": 0
      },
      "preparation": {
        "mode": "prepared",
        "prepared": false
      },
      "scaling": {
        "mode": "cantrip",
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
            "acid"
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
    "_id": "3e5e6f47fbf64fc6",
    "name": "Blaring Blade",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You make a melee attack with a melee weapon or unarmed strike against one creature within melee range. On a hit, the target suffers the weapon attack’s normal effects and then becomes surrounded with sonic energy until the start of your next turn. If the target willingly moves 5 feet or more before then, the target takes 1d8 thunder damage, and the creation ends.</p><p><strong>At Higher Levels.</strong> At 5th level, the melee attack deals an extra 1d8 thunder damage to the target on a hit, and the damage the target takes for moving increases to 2d8. Both damage rolls increase by 1d8 at 11th level (2d8 and 3d8) and again at 17th level (3d8 and 4d8).</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 0,
      "school": "evo",
      "components": {
        "value": "",
        "vocal": false,
        "somatic": true,
        "material": true,
        "ritual": false,
        "concentration": false
      },
      "materials": {
        "value": "melee weapon or unarmed strike",
        "consumed": false,
        "cost": 0,
        "supply": 0
      },
      "preparation": {
        "mode": "prepared",
        "prepared": false
      },
      "scaling": {
        "mode": "cantrip",
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
    "_id": "f1ac943b4f211f44",
    "name": "Burning Blade",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You make a melee attack with a melee weapon or unarmed strike against one creature within melee range. On a hit, the target suffers the weapon attack’s normal effects, and you can blast fire from the target to a different creature of your choice that you can see within 5 feet of it. The second creature takes fire damage equal to your creativity ability modifier.</p><p><strong>At Higher Levels.</strong> At 5th level, the melee attack deals an extra 1d8 fire damage to the target on a hit, and the fire damage to the second creature increases to 1d8 + your creativity ability modifier. Both damage rolls increase by 1d8 at 11th level (2d8 and 2d8) and 17th level (3d8 and 3d8).</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 0,
      "school": "evo",
      "components": {
        "value": "",
        "vocal": false,
        "somatic": true,
        "material": true,
        "ritual": false,
        "concentration": false
      },
      "materials": {
        "value": "melee weapon or unarmed strike",
        "consumed": false,
        "cost": 0,
        "supply": 0
      },
      "preparation": {
        "mode": "prepared",
        "prepared": false
      },
      "scaling": {
        "mode": "cantrip",
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
    "_id": "51d0d418bc7f0ecb",
    "name": "Combustion",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You cause flames to spontaneously combust on the ground in an area that you can see within range. Until the creation ends, the combusted area fills a 5-foot cube. Any creature in the affected space when you must succeed on a Dexterity saving throw or take 1d8 fire damage. A creature must also make the saving throw when it enters the combusted space for the first time on a turn or ends its turn there.</p><p><strong>At Higher Levels.</strong> The trick’s damage increases by 1d8 when you reach 5th level (2d8), 11th level (3d8), and 17th level (4d8).</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 0,
      "school": "evo",
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
        "mode": "cantrip",
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
            "1d8",
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
    "_id": "78e5343bb6a21e3d",
    "name": "Chilling Necrosis",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You cause grievous wounds on a target within range. Make a ranged creation attack against the creature to assail it. On a hit, the target takes 1d8 necrotic damage, and it can’t regain hit points until the start of your next turn.</p><p><strong>At Higher Levels.</strong> This trick’s damage increases by 1d8 when you reach 5th level (2d8), 11th level (3d8), and 17th level (4d8).</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 0,
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
        "mode": "cantrip",
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
        "parts": [
          [
            "1d8",
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
    "_id": "ec16816e4e90cc66",
    "name": "Death Wish",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You point at one creature you can see within range, and cause it to fear death. The target must succeed on a Wisdom saving throw or take 1d12 necrotic damage.</p><p><strong>At Higher Levels.</strong> This trick’s damage increases by 1d12 when you reach 5th level (2d12), 11th level (3d12), and 17th level (4d12).</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 0,
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
        "mode": "cantrip",
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
            "1d12",
            "necrotic"
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
    "_id": "59cf46db7e96029f",
    "name": "Defending Ward",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You defend yourself against physical attacks. Until the end of your next turn, you have resistance against bludgeoning, piercing, and slashing damage.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 0,
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
        "mode": "cantrip",
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
    "_id": "b00ee7d07fad1991",
    "name": "Detect Creation",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You sense the presence of creations and creation-like effects within 30 feet of you. If you sense a creation/effect in this way, you see a faint aura around any visible creature or object in the area that bears the effect, and you learn its school of creativity, if any. The creation can penetrate most barriers, but it is blocked by 1 foot of stone, 1 inch of common metal, a thin sheet of lead, or 3 feet of wood or dirt.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 0,
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
        "mode": "cantrip",
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
    "_id": "bfeb3800d65cecd7",
    "name": "Drag",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You attempt to pull a creature or object of medium or smaller size in a direction of your choice that you can see within range. It must succeed on a Strength saving throw or be moved 10ft in a direction of your choice.</p><p><strong>At Higher Levels.</strong> This trick becomes more powerful, allowing you to move medium or smaller objects and creatures 15ft at 5th level, large or smaller objects and creatures by 15ft at 11th level, and able to move large and smaller objects and creatures by 20ft 17th level.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 0,
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
        "mode": "cantrip",
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
    "_id": "cd3710a0290f8c19",
    "name": "Draw",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You harmlessly place a small picture, the appearance of which is to your discretion, as long as it fits, on a 1 square foot surface on the targeted creature or object. The picture can be scrubbed or scraped off with 5 minutes of work on an object, otherwise it doesn’t fade. If it's on a creature, it fades naturally over the course of a week.</p><p><strong>At Higher Levels.</strong> The trick’s coverage increases to a 5 square foot surface at 5th level, 10 square feet at 11th level, and 15 square feet at 17th level.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 0,
      "school": "trs",
      "components": {
        "value": "",
        "vocal": false,
        "somatic": true,
        "material": true,
        "ritual": false,
        "concentration": false
      },
      "materials": {
        "value": "a bit of ink",
        "consumed": false,
        "cost": 0,
        "supply": 0
      },
      "preparation": {
        "mode": "prepared",
        "prepared": false
      },
      "scaling": {
        "mode": "cantrip",
        "formula": ""
      },
      "activation": {
        "type": "action",
        "cost": 1,
        "condition": ""
      },
      "duration": {
        "value": null,
        "units": "perm"
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
    "_id": "5cacc12aeee99c81",
    "name": "Electric Surge",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>A surge of electricity expands to affect one creature that you can see within range. The target must make a Dexterity saving throw. On a failed save, the target takes 1d8 lightning damage. Choose a 2nd creature within 30ft of the first target. That creature must also make a Dexterity saving throw, taking 1d6 lightning damage on a failure.</p><p><strong>At Higher Levels.</strong> The trick’s damage increases by 1d8 for the initial target and 1d6 for the secondary target when you reach 5th level (2d8 and 2d6), 11th level (3d8 and 3d6), and 17th level (4d8 and 4d6).</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 0,
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
        "mode": "cantrip",
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
            "1d8",
            "lightning"
          ],
          [
            "1d6",
            "lightning"
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
    "_id": "551fecdcb6675995",
    "name": "Fire Bolt",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You hurl a blast of purely destructive flames at a creature or object within range. Make a ranged creation attack against the target. On a hit, the target takes 1d10 fire damage. A flammable object hit by this trick ignites if it isn’t being worn or carried.\nAdditionally, you can manipulate flames to create tiny sensory effects as an action. You cause simple shapes—such as the vague form of a creature, an inanimate object, or a location—to appear and animate as you like. The shapes last for 1 hour, and you can have up to three of them active at a time, and you can dismiss some or all as an action.</p><p><strong>At Higher Levels.</strong> At higher levels you can choose to either make one big blast, or multiple smaller blasts. For the single blast, this trick's damage increases by 1d10 when you reach 5th level (2d10), 11th level (3d10), and 17th level (4d10). For the multiple blasts, two blasts at 5th level, three blasts at 11th level, and four beams at 17th level. You can direct the beams at the same target or at different ones. Make a separate attack roll for each beam.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 0,
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
        "mode": "cantrip",
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
      "actionType": "rsak",
      "attack": {
        "bonus": "",
        "flat": false
      },
      "damage": {
        "parts": [
          [
            "1d10",
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
    "_id": "c980a6799d8bd862",
    "name": "Flashpoint",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>A flash of destructive radiance bursts right on one creature that you can see within range. The target must make a Dexterity saving throw. On a failed save, the target takes 1d8 radiant damage, and it becomes highlighted until the end of their next turn. While highlighted, the target cannot be hidden due to being lightly or heavily obscured.</p><p><strong>At Higher Levels.</strong> The trick’s damage increases by 1d8 when you reach 5th level (2d8), 11th level (3d8), and 17th level (4d8).</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 0,
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
        "mode": "cantrip",
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
            "1d8",
            "radiant"
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
    "_id": "387195c46f51f23d",
    "name": "Frost Ray",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>A frigid blast of ice flies toward a creature within range. Make a ranged creation attack against the target. On a hit, it takes 1d8 cold damage, and its speed is reduced by 10 feet until the start of your next turn.\nThe trick's damage increases by 1d8 when you reach 5th level (2d8), 11th level (3d8), and 17th level (4d8).</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 0,
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
        "mode": "cantrip",
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
            "1d8",
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
    "_id": "372e3bfb0da1ea1f",
    "name": "Galvanic Blade",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You make a melee attack with a melee weapon or unarmed strike against one creature within melee range. On a hit, the target suffers the weapon attack’s normal effects and then becomes encased in electrical energy until the start of your next turn. If the target willingly hits you with a melee attack before the creation ends, the target takes 1d8 lightning damage, and the creation ends.</p><p><strong>At Higher Levels.</strong> At 5th level, the melee attack deals an extra 1d8 lightning damage to the target on a hit, and the damage the target takes for striking you increases to 2d8. Both damage rolls increase by 1d8 at 11th level (2d8 and 3d8) and again at 17th level (3d8 and 4d8).</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 0,
      "school": "evo",
      "components": {
        "value": "",
        "vocal": false,
        "somatic": true,
        "material": true,
        "ritual": false,
        "concentration": false
      },
      "materials": {
        "value": "melee weapon or unarmed strike",
        "consumed": false,
        "cost": 0,
        "supply": 0
      },
      "preparation": {
        "mode": "prepared",
        "prepared": false
      },
      "scaling": {
        "mode": "cantrip",
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
    "_id": "cb2d0e22dcce9cdd",
    "name": "Guidance",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You touch one willing creature. Once before the creation ends, the target can roll a d4 and add the number rolled to one ability check or saving throw, of its choice. It can roll the die before or after making the ability check. The trick then ends.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 0,
      "school": "div",
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
        "mode": "cantrip",
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
    "_id": "95829b77f385db58",
    "name": "Ice Bolt",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You hurl a blast of purely destructive ice at a creature or object within range. Make a ranged creation attack against the target. On a hit, the target takes 1d10 cold damage. Water within 5ft of the target is frozen for 1 minute. This frozen water cannot support any creature standing on it and immediately shatters.\nAdditionally, you can manipulate the frost to create tiny sensory effects as an action. You cause simple shapes—such as the vague form of a creature, an inanimate object, or a location—to appear and animate as you like. The shapes last for 1 hour, and you can have up to three of them active at a time, and you can dismiss some or all as an action.</p><p><strong>At Higher Levels.</strong> At higher levels you can choose to either make one big blast, or multiple smaller blasts. For the single blast, this trick's damage increases by 1d10 when you reach 5th level (2d10), 11th level (3d10), and 17th level (4d10). For the multiple blasts, two blasts at 5th level, three blasts at 11th level, and four beams at 17th level. You can direct the beams at the same target or at different ones. Make a separate attack roll for each beam.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 0,
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
        "mode": "cantrip",
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
      "actionType": "rsak",
      "attack": {
        "bonus": "",
        "flat": false
      },
      "damage": {
        "parts": [
          [
            "1d10",
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
    "_id": "6d10e74e649305eb",
    "name": "Light",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You touch one object or creature that is medium or smaller. Until the trick ends, the target sheds bright light in a 20-foot radius and dim light for an additional 20 feet. The light can be colored as you like. Completely covering the target with something opaque blocks the light. The trick ends if you use it again or dismiss, no action required.\nIf your target is an object held or worn by a hostile creature, or unwilling, that creature must succeed on a Dexterity saving throw to avoid the trick.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 0,
      "school": "evo",
      "components": {
        "value": "",
        "vocal": true,
        "somatic": false,
        "material": true,
        "ritual": false,
        "concentration": false
      },
      "materials": {
        "value": "a bit of phosphorus",
        "consumed": false,
        "cost": 0,
        "supply": 0
      },
      "preparation": {
        "mode": "prepared",
        "prepared": false
      },
      "scaling": {
        "mode": "cantrip",
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
    "_id": "a336f20441c0433f",
    "name": "Manipulate Earth",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You choose a portion of dirt or stone that you can see within range and that fits within a 5-foot cube. You manipulate it in one of the following ways:\n<em> If you target an area of loose earth, you can instantaneously excavate it, move it along the ground, and deposit it up to 5 feet away. This movement doesn’t have enough force to cause damage.\n</em> You cause shapes, colors, or both to appear on the dirt or stone, spelling out words, creating images, or shaping patterns. The changes last for 1 hour.\n<em> If the dirt or stone you target is on the ground, you cause it to become difficult terrain. Alternatively, you can cause the ground to become normal terrain if it is already difficult terrain. This change lasts for 1 hour.\n</em> You can fling a chunk of earth at a creature within range. Make a ranged creation attack against that creature. On a hit, it deals 1d8 of your choice bludgeoning, piercing, or slashing damage.\nIf you use this trick multiple times, you can have no more than two of its non-instantaneous effects active at a time, and you can dismiss each effect, no action required.</p><p><strong>At Higher Levels.</strong> This trick’s damage increases by 1d8 when you reach certain levels: 5th level (2d8), 11th level (3d8), and 17th level (4d8).</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 0,
      "school": "trs",
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
        "mode": "cantrip",
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
    "_id": "5583cae71b12e05e",
    "name": "Mend",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>This trick repairs a single break or tear in an object you touch, such as a broken chain link, two halves of a broken key, a torn cloak, etc. As long as the break or tear is no larger than 1 foot in any dimension, you mend it, leaving no trace of the former damage.\nThis trick can physically repair a mastercraft item or construct, but the trick can’t restore any special effects to such an object.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 0,
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
        "value": "A tiny piece of metal",
        "consumed": false,
        "cost": 0,
        "supply": 0
      },
      "preparation": {
        "mode": "prepared",
        "prepared": false
      },
      "scaling": {
        "mode": "cantrip",
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
        "type": "object"
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
    "_id": "7667e4418d95897a",
    "name": "Mind Slash",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You metaphorically stab a knife into the mind of one creature you can see within range. The target must succeed on an Intelligence saving throw or take 1d6 psychic damage and subtract 1d4 from the next saving throw it makes before the end of your next turn.</p><p><strong>At Higher Levels.</strong> This trick’s damage increases by 1d6 when you reach certain levels: 5th level (2d6), 11th level (3d6), and 17th level (4d6).</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 0,
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
        "mode": "cantrip",
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
            "1d6",
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
    "_id": "7779f1674642ab12",
    "name": "Mirrored Hand",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>A floating hand appears at a point you choose within range. The hand lasts for the duration or until you dismiss it, no action required. The hand vanishes if it is ever more than 30 feet away from you or if you use this creation again.\nYou can use your action to control the hand. You can use the hand to manipulate an object, open an unlocked door or container, stow or retrieve an item from an open container, or pour the contents out of a vial. You can move the hand up to 30 feet each time you use it.\nThe hand can’t attack, activate complex items and apparatuses, or carry more than 10 pounds.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 0,
      "school": "con",
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
        "mode": "cantrip",
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
    "_id": "be9ddd676ef70e7d",
    "name": "Natural Arts",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>Using your knowledge of natural processes, you create one of the following effects within range:\n<em> You create a tiny, harmless sensory effect that predicts what the weather will be at your location for the next 24 hours. The effect might manifest as a golden orb for clear skies, a cloud for rain, falling snowflakes for snow, and so on. This effect persists for 1 round.\n</em> You instantly make a flower blossom, a seed pod open, or a leaf bud bloom.\n<em> You create an instantaneous, harmless sensory effect, such as falling leaves, a puff of wind, the sound of a small animal, or the faint odor of skunk. The effect must fit in a 5-foot cube.\n</em> You instantly light or snuff out a candle, a torch, or a small campfire.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 0,
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
        "mode": "cantrip",
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
    "_id": "c59ced41ad068765",
    "name": "Necrotic Bolt",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You hurl a blast of purely destructive necrotic energy at a creature or object within range. Make a ranged creation attack against the target. On a hit, the target takes 1d10 necrotic damage. Small, inanimate plants within 5ft of the target are destroyed.\nAdditionally, you can manipulate the necrotic energy to create tiny sensory effects as an action. You cause simple shapes—such as the vague form of a creature, an inanimate object, or a location—to appear and animate as you like. The shapes last for 1 hour, and you can have up to three of them active at a time, and you can dismiss some or all as an action.</p><p><strong>At Higher Levels.</strong> At higher levels you can choose to either make one big blast, or multiple smaller blasts. For the single blast, this trick's damage increases by 1d10 when you reach 5th level (2d10), 11th level (3d10), and 17th level (4d10). For the multiple blasts, two blasts at 5th level, three blasts at 11th level, and four beams at 17th level. You can direct the beams at the same target or at different ones. Make a separate attack roll for each beam.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 0,
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
        "mode": "cantrip",
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
      "actionType": "rsak",
      "attack": {
        "bonus": "",
        "flat": false
      },
      "damage": {
        "parts": [
          [
            "1d10",
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
    "_id": "ccf735268d2fb6e8",
    "name": "Piercing Frost",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You cause piercing and debilitating frost to form on one creature that you can see within range. The target must make a Constitution saving throw. On a failed save, the target takes 1d8 cold damage, and it has disadvantage on the next weapon attack roll it makes before the end of its next turn.</p><p><strong>At Higher Levels.</strong> The trick’s damage increases by 1d8 when you reach 5th level (2d8), 11th level (3d8), and 17th level (4d8).</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 0,
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
        "mode": "cantrip",
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
            "1d8",
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
    "_id": "74d3737d05412651",
    "name": "Poisonous Puff",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You project a puff of poisonous gas against a creature within range. The creature must succeed on a Constitution saving throw or take 1d12 poison damage and becomes poisoned until the end of your next turn.</p><p><strong>At Higher Levels.</strong> This trick’s damage increases by 1d12 when you reach 5th level (2d12), 11th level (3d12), and 17th level (4d12).</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 0,
      "school": "con",
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
        "mode": "cantrip",
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
      "actionType": "save",
      "attack": {
        "bonus": "",
        "flat": false
      },
      "damage": {
        "parts": [
          [
            "1d12",
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
    "_id": "4ae4704f75cdc914",
    "name": "Polar Blade",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You make a melee attack with a melee weapon or unarmed strike against one creature within melee range. On a hit, the target suffers the weapon attack’s normal effects and then becomes covered in piercing frost until the start of your next turn. If the target makes a successful melee attack before the creation ends, the damage target's attack is reduced by 1d8, and the creation ends.</p><p><strong>At Higher Levels.</strong> At 5th level, the melee attack deals an extra 1d8 cold damage to the target on a hit, and the damage reduced increases to 2d8. Both rolls increase by 1d8 at 11th level (2d8 and 3d8) and again at 17th level (3d8 and 4d8).</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 0,
      "school": "evo",
      "components": {
        "value": "",
        "vocal": false,
        "somatic": true,
        "material": true,
        "ritual": false,
        "concentration": false
      },
      "materials": {
        "value": "melee weapon or unarmed strike",
        "consumed": false,
        "cost": 0,
        "supply": 0
      },
      "preparation": {
        "mode": "prepared",
        "prepared": false
      },
      "scaling": {
        "mode": "cantrip",
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
    "_id": "c02da6fc020d3fc0",
    "name": "Prestidigitation",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You make a minor trick that novice tricksters use for practice. You create one of the following creative effects within range:\n<em> You create an instantaneous, harmless sensory effect, such as a shower of sparks, a puff of wind, faint musical notes, or an odd odor.\n</em> You instantaneously light or snuff out a candle, a torch, or a small campfire.\n<em> You instantaneously clean or soil an object no larger than 1 cubic foot.\n</em> You chill, warm, or flavor up to 1 cubic foot of nonliving material for 1 hour.\n<em> You make a color, a small mark, or a symbol appear on an object or a surface for 1 hour.\n</em> You create a trinket or an illusory image that can fit in your hand and that lasts until the end of your next turn.\nIf you use this trick multiple times, you can have up to three of its non-instantaneous effects active at a time, and you can dismiss such an effect, no action required.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 0,
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
        "mode": "cantrip",
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
    "_id": "b1b4a1110a733c01",
    "name": "Propel",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You cause an item within touch range to be propelled in a direction of your choice. Choose a tiny item in your possession that weights less than or equal to 5 lbs. That item then flies straight to a point you can see within the range of this trick.\nIf that point is on a creature, you can choose to make a creation attack roll against the that creature's AC if you wish to damage them with the propelled item. The target takes 1d8 damage of the most appropriate type. For example, launching a stone would deal bludgeoning damage, whereas a vial of acid launched would instead deal acid.</p><p><strong>At Higher Levels.</strong> At higher levels, this trick is able to launch larger and heavier items. At 5th, it can launch  small objects of 10 lbs or lighter. At 11th level, it can launch medium objects of 20lbs or lighter. At 17th, it can launch large objects that are 40lbs or lighter. This trick’s damage increases by 1d8 when you reach certain levels: 5th level (2d8), 11th level (3d8), and 17th level (4d8).</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 0,
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
        "value": "the item you will launch",
        "consumed": false,
        "cost": 0,
        "supply": 0
      },
      "preparation": {
        "mode": "prepared",
        "prepared": false
      },
      "scaling": {
        "mode": "cantrip",
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
    "_id": "a4379388fd262121",
    "name": "Radiant Bolt",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You hurl a blast of purely destructive light at a creature or object within range. Make a ranged creation attack against the target. On a hit, the target takes 1d10 radiant damage. A flammable object hit by this trick ignites if it isn’t being worn or carried.\nAdditionally, you can manipulate light to create tiny sensory effects as an action. You cause simple shapes—such as the vague form of a creature, an inanimate object, or a location—to appear and animate as you like. The shapes last for 1 hour, and you can have up to three of them active at a time, and you can dismiss some or all as an action.</p><p><strong>At Higher Levels.</strong> At higher levels you can choose to either make one big blast, or multiple smaller blasts. For the single blast, this trick's damage increases by 1d10 when you reach 5th level (2d10), 11th level (3d10), and 17th level (4d10). For the multiple blasts, two blasts at 5th level, three blasts at 11th level, and four beams at 17th level. You can direct the beams at the same target or at different ones. Make a separate attack roll for each beam.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 0,
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
        "mode": "cantrip",
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
      "actionType": "rsak",
      "attack": {
        "bonus": "",
        "flat": false
      },
      "damage": {
        "parts": [
          [
            "1d10",
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
    "_id": "ed7c401a74a1ee3d",
    "name": "Sapping Stinger",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You drain the strength of one creature you can see in range, causing them to fall. The target must succeed on a Constitution saving throw or take 1d6 necrotic damage and fall prone.</p><p><strong>At Higher Levels.</strong> This trick's damage increases by 1d6 when you reach 5th level (2d6), 11th level (3d6), and 17th level (4d6).</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 0,
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
        "mode": "cantrip",
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
            "1d6",
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
    "_id": "56b63b00447c3f22",
    "name": "Shimmering Lights",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You create up to four torch-sized lights within range that hover in the air for the duration. You can also combine the four lights into one glowing vaguely humanoid form of Medium size. Whichever form you choose, each light sheds dim light in a 10-foot radius.\nAs a bonus action on your turn, you can move the lights up to 60 feet to a new spot within range. A light must be within 20 feet of another light created by this creation, and a light winks out if it exceeds the creation’s range.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 0,
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
        "value": "a bit of phosporus",
        "consumed": false,
        "cost": 0,
        "supply": 0
      },
      "preparation": {
        "mode": "prepared",
        "prepared": false
      },
      "scaling": {
        "mode": "cantrip",
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
    "_id": "158c5f28719656a6",
    "name": "Shocking Grasp",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>Lightning springs from your hand to deliver a shock to a creature you try to touch. Make a melee creation attack against the target. You have advantage on the attack roll if the target is wearing armor made of metal. On a hit, the target takes 1d10 lightning damage, and it can’t take reactions until the start of its next turn.</p><p><strong>At Higher Levels.</strong> This trick’s damage increases by 1d10 when you reach 5th level (2d10), 11th level (3d10), and 17th level (4d10).</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 0,
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
        "mode": "cantrip",
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
      "actionType": "msak",
      "attack": {
        "bonus": "",
        "flat": false
      },
      "damage": {
        "parts": [
          [
            "1d10",
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
    "_id": "030d1803c8113de7",
    "name": "Show Off",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>Through showmanship, you create a minor wonder within range. You create one of the following effects within range:\n<em> Your voice booms up to three times as loud as normal for up to 1 hour.\n</em> You cause flames to flicker, brighten, dim, or change color for up to.\n<em> You cause harmless tremors in the ground within range for up to 1 hour.\n</em> You create an instantaneous sound that originates from a point of your choice within range, such as a rumble of thunder, the cry of a raven, or ominous whispers.\n<em> You instantaneously cause an unlocked door or window to fly open or slam shut.\n</em> You alter the appearance of your eyes for up to 1 hour.\nIf you use this trick multiple times, you can have up to three of its 1-minute effects active at a time, and you can dismiss such an effect, no action required.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 0,
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
        "mode": "cantrip",
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
    "_id": "daac6463913b9dee",
    "name": "Sonic Boom",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You create an explosive sound burst, which can be heard 100 feet away. Each creature other than you within 5 feet of you must make a Constitution saving throw. On a failed save, the creature takes 1d10 thunder damage.</p><p><strong>At Higher Levels.</strong> This trick’s damage increases by 1d10 when you reach 5th level (2d10), 11th level (3d10), and 17th level (4d10).</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 0,
      "school": "trs",
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
        "mode": "cantrip",
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
        "value": 5,
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
            "1d10",
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
    "_id": "3c3936988ccd9f3d",
    "name": "Spark Bolt",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You hurl a blast of purely destructive electricity at a creature or object within range. Make a ranged creation attack against the target. On a hit, the target takes 1d10 lightning damage. A flammable object hit by this trick ignites if it isn’t being worn or carried.\nAdditionally, you can manipulate electricity to create tiny sensory effects as an action. You cause simple shapes—such as the vague form of a creature, an inanimate object, or a location—to appear and animate as you like. The shapes last for 1 hour, and you can have up to three of them active at a time, and you can dismiss some or all as an action.</p><p><strong>At Higher Levels.</strong> At higher levels you can choose to either make one big blast, or multiple smaller blasts. For the single blast, this trick's damage increases by 1d10 when you reach 5th level (2d10), 11th level (3d10), and 17th level (4d10). For the multiple blasts, two blasts at 5th level, three blasts at 11th level, and four beams at 17th level. You can direct the beams at the same target or at different ones. Make a separate attack roll for each beam.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 0,
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
        "mode": "cantrip",
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
      "actionType": "rsak",
      "attack": {
        "bonus": "",
        "flat": false
      },
      "damage": {
        "parts": [
          [
            "1d10",
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
    "_id": "e000d1d406d1b34c",
    "name": "Spiritual Blast",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You unleash a beam that streaks toward a creature within range, harming both body and spirit. Make a ranged creation attack against the target. On a hit, the target takes 1d10 force damage.</p><p><strong>At Higher Levels.</strong> The creation creates more than one beam when you reach higher levels: two beams at 5th level, three beams at 11th level, and four beams at 17th level. You can direct the beams at the same target or at different ones. Make a separate attack roll for each beam.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 0,
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
        "mode": "cantrip",
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
        "parts": [
          [
            "1d10",
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
    "_id": "ce6e6df242c560ee",
    "name": "Stabilize",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You touch a living creature that has 0 hit points. The creature becomes stable. This trick has no effect on undead or constructs.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 0,
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
        "mode": "cantrip",
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
    "_id": "5915eb71fc34501e",
    "name": "Sword Circle",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You make a sweep of blades that circle around you. All other creatures within 5 feet of you must succeed on a Dexterity saving throw or take 1d10 force damage.</p><p><strong>At Higher Levels.</strong> This spell's damage increases by 1d10 when you reach 5th level (2d10), 11th level (3d10), and 17th level (4d10).</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 0,
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
        "mode": "cantrip",
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
        "value": 5,
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
            "1d10",
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
    "_id": "d13f785f325fa059",
    "name": "Temporary Trick",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You create a sound or an image of an object within range that lasts for the duration. The illusion also ends if you dismiss it (no action required) or use this trick again.\nIf you create a sound, its volume can range from a whisper to a scream. It can be your voice, someone else’s voice, a lion’s roar, a beating of drums, or any other sound you choose. The sound continues unabated throughout the duration, or you can make discrete sounds at different times before the creation ends. The sound cannot be loud enough to deafen or deal damage.\nIf you create an image of an object—such as a chair, muddy footprints, or a small chest—it must be no larger than a 5-foot cube. The image can’t create sound, light, smell, or any other sensory effect. Physical interaction with the image reveals it to be an illusion, because things can pass through it. The image cannot obscure a creature's vision to the point of blinding them.\nIf a creature uses its action to examine the sound or image, the creature can determine that it is an illusion with a successful Intelligence (Investigation) check against your creation save DC. If a creature discerns the illusion for what it is, the illusion becomes faint to the creature.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 0,
      "school": "enc",
      "components": {
        "value": "",
        "vocal": false,
        "somatic": true,
        "material": true,
        "ritual": false,
        "concentration": false
      },
      "materials": {
        "value": "a tiny piece of cloth",
        "consumed": false,
        "cost": 0,
        "supply": 0
      },
      "preparation": {
        "mode": "prepared",
        "prepared": false
      },
      "scaling": {
        "mode": "cantrip",
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
    "_id": "048cd7458f2df45c",
    "name": "Thorn Lash",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You throw out a vine-like whip covered in sharp thorns toward a creature in range. Make a melee creation attack against the target. If the attack hits, the creature takes 1d10 piercing damage, and if the creature is Large or smaller, you can choose to pull the creature up to 10 feet closer to you.</p><p><strong>At Higher Levels.</strong> This trick’s damage increases by 1d10 when you reach 5th level (2d10), 11th level (3d10), and 17th level (4d10).</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 0,
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
        "value": "a plant stem",
        "consumed": false,
        "cost": 0,
        "supply": 0
      },
      "preparation": {
        "mode": "prepared",
        "prepared": false
      },
      "scaling": {
        "mode": "cantrip",
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
      "actionType": "msak",
      "attack": {
        "bonus": "",
        "flat": false
      },
      "damage": {
        "parts": [
          [
            "1d10",
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
    "_id": "83d89e07dfa10409",
    "name": "Thunder Bolt",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You hurl a blast of purely destructive sound at a creature or object within range. Make a ranged creation attack against the target. On a hit, the target takes 1d10 thunder damage. A loud noise that can be heard within 100 ft is accompanied by the attack.\nAdditionally, you can manipulate sound to create tiny sensory effects as an action.</p><p><strong>At Higher Levels.</strong> At higher levels you can choose to either make one big blast, or multiple smaller blasts. For the single blast, this trick's damage increases by 1d10 when you reach 5th level (2d10), 11th level (3d10), and 17th level (4d10). For the multiple blasts, two blasts at 5th level, three blasts at 11th level, and four beams at 17th level. You can direct the beams at the same target or at different ones. Make a separate attack roll for each beam.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 0,
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
        "mode": "cantrip",
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
      "actionType": "rsak",
      "attack": {
        "bonus": "",
        "flat": false
      },
      "damage": {
        "parts": [
          [
            "1d10",
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
    "_id": "bb9f4125177dfa11",
    "name": "Trap Sense",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You sense the presence of any trap within range. A trap, for the purpose of this creation, includes anything that would inflict a sudden or unexpected effect you consider harmful or undesirable, which was specifically intended as such by its creator. Thus, the creation would sense an area affected by the alarm creation or a mechanical pit trap, but it would not reveal a natural weakness in the floor, an unstable ceiling, or a hidden sinkhole.\nThis creation merely reveals that a trap is present. You don’t learn the location of each trap, but you do learn the general nature of the danger posed by a trap you sense.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 0,
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
        "mode": "cantrip",
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
    "_id": "de61354eb04f25de",
    "name": "Upper Brass",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>The matierial of an instrument you are holding is imbued with the spiritual power of music and weaponize it. For the duration, you can use your creative ability to make attack and damage rolls of melee attacks using that instrument as a weapon.\nThe weapon’s damage die is 1d6 bludgeoning damage and has special effects depending on the type of instrument it is.\n<em> Brass: When you hit a creature with this weapon, once per turn, you can force the target to make a Strength saving throw, falling prone on a failure.\n</em> String: This weapon has the reach property.\n<em> Woodwind: This weapon can also be used to make ranged attacks, dealing piercing damage, range (60/180), and it ignores half and three-quarters cover.\n</em> Keyboard: When you deal damage with this weapon, you can roll the damage twice and take the highest result.\n<em> Percussion: When you hit a creature with this weapon, once per turn, you can deal damage equal to your creativity modifier, to each other creature other than yourself within 5ft of that creature.\n</em> Electric: When you hit a creature with this weapon, once per turn, you can force the target to make a Strength saving throw, getting pushed back 10ft from you.\nThe trick ends if you use it again or if you let go of the instrument.</p><p><strong>At Higher Levels.</strong> This weapon’s damage die increases to 1d8 when you reach 5th level, 1d10 at 11th level, and 1d12 at 17th level.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 0,
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
        "value": "an instrument you are holding",
        "consumed": false,
        "cost": 0,
        "supply": 0
      },
      "preparation": {
        "mode": "prepared",
        "prepared": false
      },
      "scaling": {
        "mode": "cantrip",
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
            "1d6",
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
    "_id": "acb36b18efc2463f",
    "name": "Venom Bolt",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You hurl a blast of purely destructive poison at a creature or object within range. Make a ranged creation attack against the target. On a hit, the target takes 1d10 poison damage. Small, inanimate plants within 5ft of the target are destroyed.\nAdditionally, you can manipulate poison to create tiny sensory effects as an action. You cause simple shapes—such as the vague form of a creature, an inanimate object, or a location—to appear and animate as you like. The shapes last for 1 hour, and you can have up to three of them active at a time, and you can dismiss some or all as an action.</p><p><strong>At Higher Levels.</strong> At higher levels you can choose to either make one big blast, or multiple smaller blasts. For the single blast, this trick's damage increases by 1d10 when you reach 5th level (2d10), 11th level (3d10), and 17th level (4d10). For the multiple blasts, two blasts at 5th level, three blasts at 11th level, and four beams at 17th level. You can direct the beams at the same target or at different ones. Make a separate attack roll for each beam.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 0,
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
        "mode": "cantrip",
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
    "_id": "45f41fa773008cf0",
    "name": "Vicious Mockery",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You unleash a string of insults at a creature you can see within range. If the target can hear you (though it need not understand you), it must succeed on a Wisdom saving throw or take 1d6 psychic damage and have disadvantage on the next attack roll it makes before the end of its next turn.</p><p><strong>At Higher Levels.</strong> This trick’s damage increases by 1d6 when you reach 5th level (2d6), 11th level (3d6), and 17th level (4d6).</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 0,
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
        "mode": "cantrip",
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
            "1d6",
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
    "_id": "aba6134e18c15f53",
    "name": "Water Flow",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p><ul>You choose an area of water that you can see within range and that fits within a 5-foot cube. You manipulate it in one of the following ways:\n<em> You instantaneously move or otherwise change the flow of the water as you direct, up to 5 feet in any direction. This movement doesn’t have enough force to cause damage. The water is still affected by gravity and will fall at the end of your turn, so it cannot be used to weaken or paralyze devil fruit users, unless that user is also in a large enough container.\n</em> You cause the water to form into tiny simple shapes and animate at your direction. This change lasts for 1 hour.\n<em> You change the water’s color or opacity. The water must be changed in the same way throughout. This change lasts for 1 hour.\n</em> You freeze the water, provided that there are no creatures in it. The water unfreezes in 1 hour.</p><p><li>You can launch a concentrated blast of water against a creature you can see within range. You make a ranged creation attack against that creature. On a hit, the creature takes 1d8 bludgeoning, piercing, or slashing damage.</li>\nIf you use this trick multiple times, you can have no more than two of its non-instantaneous effects active at a time, and you can dismiss each effect, no action required.</ul></p><p><strong>At Higher Levels.</strong> This trick’s damage increases by 1d8 when you reach 5th level (2d8), 11th level (3d8), and 17th level (4d8).</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 0,
      "school": "evo",
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
        "mode": "cantrip",
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
    "_id": "9d581b7745e7c4a3",
    "name": "Whisper",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You whisper a message towards a creature within range. The target (and only the target) hears the message and can reply in a whisper that only you can hear.\nYou can use this trick through solid objects if you are familiar with the target and know it is beyond the barrier. Creative silence, 1 foot of stone, 1 inch of common metal, a thin sheet of lead, or 3 feet of wood blocks the trick. The trick doesn’t have to follow a straight line and can travel freely around corners or through openings.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 0,
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
        "value": "a piece of wire",
        "consumed": false,
        "cost": 0,
        "supply": 0
      },
      "preparation": {
        "mode": "prepared",
        "prepared": false
      },
      "scaling": {
        "mode": "cantrip",
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
    "_id": "c0339c1435bed52c",
    "name": "Windblast",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You produce and manipulate a blast of air to create one of the following effects at a point you can see within range:\n<em> One Medium or smaller creature that you choose must succeed on a Strength saving throw or be pushed up to 10 feet away from you.\n</em> You create a small blast of air capable of moving one object that is neither held nor carried and that weighs no more than 5 pounds. The object is pushed up to 10 feet away from you. It isn’t pushed with enough force to cause damage.\n<em> You create a harmless sensory affect using air, such as causing leaves to rustle, wind to slam shutters shut, or your clothing to ripple in a breeze.\n</em> You can make a harmful blast of wind. Make a ranged creation attack against a creature you can see within range. On a hit, you deal 1d8 of your choice of bludgeoning, piercing, or slashing.</p><p><strong>At Higher Levels.</strong> This trick’s damage increases by 1d8 when you reach 5th level (2d8), 11th level (3d8), and 17th level (4d8).</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 0,
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
        "mode": "cantrip",
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
