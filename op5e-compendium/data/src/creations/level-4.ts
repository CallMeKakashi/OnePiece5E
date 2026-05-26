import type { FoundryItem } from "../../../schemas/common.js";

export const level4: FoundryItem[] = [
  {
    "_id": "314bcecb1d8e04c1",
    "name": "Ardent Shield",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>Elements wreathe your body for the duration. You can end the creation early as a free action. Select a damage type: acid, radiant, cold, fire, lightning, necrotic, poison, or thunder. You gain resistance to that type of damage.\nIn addition, whenever a creature hits you with a melee attack, the elements erupt to damage the attacker. The attacker takes 2d8 damage of the chosen type.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 4,
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
    "_id": "892a417f7e9a9e53",
    "name": "Aura of Life",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>Life-preserving energy radiates from you in an aura with a 30-foot radius. Until the creation ends, the aura moves with you, centered on you. Each non-hostile creature in the aura (including you) has resistance to radiant and necrotic damage, and its hit point maximum can’t be reduced. In addition, a non-hostile, living creature regains 1 hit point when it starts its turn in the aura with 0 hit points.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 4,
      "school": "abj",
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
    "_id": "701de2c75e37d4c8",
    "name": "Blight",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>Necrotic energy washes over a creature of your choice that you can see within range, draining moisture and vitality from it. The target must make a Constitution saving throw. The target takes 9d8 necrotic damage on a failed save, or half as much damage on a successful one. This creation has no effect on undead or constructs. If you target a special plant (such as one made by a creation, devil fruit, or even a plant creature), it makes the saving throw with disadvantage, and the creation deals maximum damage to it. If you target a mundane plant that isn’t a creature, such as a tree or shrub, it doesn’t make a saving throw; it simply withers and dies.\n<strong>At Higher Levels:</strong> When you use this creation with a creation slot of 5th level or higher, the damage increases by 1d8 for each slot level above 4th.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 4,
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
        "parts": [
          [
            "9d8",
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
    "_id": "a1b53824f76626e5",
    "name": "Charm Monster",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You attempt to charm a creature you can see within range. It must make a Wisdom saving throw, and it does so with advantage if you or your companions are fighting it. If it fails the saving throw, it is charmed by you until the creation ends or until you or your companions do anything harmful to it. The charmed creature is friendly to you. When the creation ends, the creature knows it was charmed by you.</p><p><strong>At Higher Levels.</strong> When you use this creation with a creation slot of 5th level or higher, you can target one additional creature for each slot level above 4th. The creatures must be within 30 feet of each other when you target them.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 4,
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
    "_id": "4225fdaabd1ec6c8",
    "name": "Confusion",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>This creation assaults and twists creatures’ minds, spawning delusions and provoking uncontrolled actions. Each creature in a 10-foot-radius sphere centered on a point you choose within range must succeed on a Wisdom saving throw when you use this creation or be affected by it.\nAn affected target can’t take reactions and must roll a d10 at the start of each of its turns to determine its behavior for that turn.\n##### Confusion Behavior Table\n| d10 | Behavior |\n|:----:|:-------------|\n| 1  | The creature uses all its movement to move in a random direction. To determine the direction, roll a d8 and assign a direction to each die face. The creature doesn’t take an action this turn. |\n| 2-6  | The creature doesn’t move or take actions this turn. |\n| 7-8 | The creature uses its action to make an attack against a randomly determined creature within its reach. If there is no creature within its reach, the creature does nothing this turn. |\n| 9-10 | The creature can act and move normally. |\nAt the end of its turns, an affected target can make a Wisdom saving throw. If it succeeds, this effect ends for that target.</p><p><strong>At Higher Levels.</strong> When you this creation with a creation slot of 5th level or higher, the radius of the sphere increases by 5 feet for each slot level above 4th.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 4,
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
        "value": "a peanut",
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
    "_id": "bb3ecfb74e7184ac",
    "name": "Control Water",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>Until the creation ends, you control any freestanding water inside an area you choose that is a cube up to 100 feet on a side. You can choose from any of the following effects when you used this creation. As an action on your turn, you can repeat the same effect or choose a different one.\n<strong>Flood.</strong> You cause the water level of all standing water in the area to rise by as much as 20 feet. If the area includes a shore, the flooding water spills over onto dry land.\nIf you choose an area in a large body of water, you instead create a 20-foot tall wave that travels from one side of the area to the other and then crashes down. Any Huge or smaller vehicles in the wave’s path are carried with it to the other side. Any Huge or smaller vehicles struck by the wave have a 25 percent chance of capsizing.\nThe water level remains elevated until the creation ends or you choose a different effect. If this effect produced a wave, the wave repeats on the start of your next turn while the flood effect lasts.\n<strong>Part Water.</strong> You cause water in the area to move apart and create a trench. The trench extends across the spell’s area, and the separated water forms a wall to either side. The trench remains until the creation ends or you choose a different effect. The water then slowly fills in the trench over the course of the next round until the normal water level is restored.\n<strong>Redirect Flow.</strong> You cause flowing water in the area to move in a direction you choose, even if the water has to flow over obstacles, up walls, or in other unlikely directions. The water in the area moves as you direct it, but once it moves beyond the creation’s area, it resumes its flow based on the terrain conditions. The water continues to move in the direction you chose until the creation ends or you choose a different effect.\n<strong>Whirlpool.</strong> This effect requires a body of water at least 50 feet square and 25 feet deep. You cause a whirlpool to form in the center of the area. The whirlpool forms a vortex that is 5 feet wide at the base, up to 50 feet wide at the top, and 25 feet tall. Any creature or object in the water and within 25 feet of the vortex is pulled 10 feet toward it. A creature can swim away from the vortex by making a Strength (Athletics) check against your creation save DC.\nWhen a creature enters the vortex for the first time on a turn or starts its turn there, it must make a Strength saving throw. On a failed save, the creature takes 2d8 bludgeoning damage and is caught in the vortex until the creation ends. On a successful save, the creature takes half damage, and isn’t caught in the vortex. A creature caught in the vortex can use its action to try to swim away from the vortex as described above, but has disadvantage on the Strength (Athletics) check to do so.\nThe first time each turn that an object enters the vortex, the object takes 2d8 bludgeoning damage; this damage occurs each round it remains in the vortex.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 4,
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
        "value": "A drop of water",
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
            "2d8",
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
  },
  {
    "_id": "56a280bb02210b2f",
    "name": "Create Object",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You temporarily create a nonliving object of vegetable matter within range: soft goods, rope, wood, or something similar. You can also use this creation to create mineral objects such as stone, crystal, or metal. The object created must be no larger than a 5-foot cube, and the object must be of a form and material that you have seen before.\nThe duration depends on the object’s material. If the object is composed of multiple materials, use the shortest duration.\n##### Create Object Table\n| Material | Duration |\n|:----:|:-------------|\n| Vegetable matter  | 24 hours |\n| Stone, crystal  | 12 hours |\n| Precious metals | 1 hour |\n| Gems | 10 minutes |</p><p><strong>At Higher Levels.</strong> When you use this creation using a creation slot of 5th level or higher, the cube increases by 5 feet for each slot level above 4th.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 4,
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
    "_id": "3b8883a046cfd1fe",
    "name": "Dark Tendrils",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>Squirming tendrils fill a 20-foot square on ground that you can see within range. For the duration, these tentacles turn the ground in the area into difficult terrain.\nWhen a creature enters the affected area for the first time on a turn or starts its turn there, the creature must succeed on a Dexterity saving throw or take 5d6 bludgeoning damage and be restrained by the tentacles until the creation ends. A creature that starts its turn in the area and is already restrained by the tentacles takes 5d6 bludgeoning damage.\nA creature restrained by the tentacles can use its action to make a Strength or Dexterity check (its choice) against your creation save DC. On a success, it frees itself.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 4,
      "school": "con",
      "components": {
        "value": "",
        "vocal": true,
        "somatic": true,
        "material": true,
        "ritual": false,
        "concentration": true
      },
      "materials": {
        "value": "a piece of tentacle",
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
        "parts": [
          [
            "5d6",
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
    "_id": "8a979bc2f8437163",
    "name": "Death Ward",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You touch a creature and grant it a measure of protection from death. The first time the target would drop to 0 hit points as a result of taking damage, the target instead drops to 1 hit point, and the creation ends. If the creation is still in effect when the target is subjected to an effect that would kill it instantaneously without dealing damage, that effect is instead negated against the target, and the creation ends.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 4,
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
    "_id": "ad6b50d86c26d93d",
    "name": "Dimension Door",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You teleport yourself from your current location to any other spot within range. You arrive at exactly the spot desired. It can be a place you can see, one you can visualize, or one you can describe by stating distance and direction, such as \"200 feet straight downward\" or \"upward to the northwest at a 45-degree angle, 300 feet\".\nYou can bring along objects as long as their weight doesn’t exceed what you can carry. You can also bring one willing creature of your size or smaller who is carrying gear up to its carrying capacity. The creature must be within 5 feet of you when you use this creation.\nIf you would arrive in a place already occupied by an object or a creature, you and any creature traveling with you each take 4d6 force damage, and the creation fails to teleport you.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 4,
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
      "actionType": "",
      "attack": {
        "bonus": "",
        "flat": false
      },
      "damage": {
        "parts": [
          [
            "4d6",
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
    "_id": "c86abe09dc7f0ca8",
    "name": "Divination (R)",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You attempt to find the truth. You ask a single question concerning a specific goal, event, or activity to occur within 7 days. The DM offers a truthful reply. The reply might be a short phrase, a cryptic rhyme, or an omen.\nThe creation doesn’t take into account any possible circumstances that might change the outcome, such as the use of other creations or the loss or gain of a companion.\nIf you use this creation two or more times before finishing your next long rest, there is a cumulative 25 percent chance for each casting after the first that you get a random reading. The GM makes this roll in secret.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 4,
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
    "_id": "aea3f506fb743290",
    "name": "Dominate Beast",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You attempt to beguile a beast that you can see within range. It must succeed on a Wisdom saving throw or be charmed by you for the duration. If you or creatures that are friendly to you are fighting it, it has advantage on the saving throw.\nWhile the beast is charmed, you have a telepathic link with it as long as the two of you are on the same plane of existence. You can use this telepathic link to issue commands to the creature while you are conscious (no action required), which it does its best to obey.\nYou can specify a simple and general course of action, such as “Attack that creature,” “Run over there,” or “Fetch that object.” If the creature completes the order and doesn’t receive further direction from you, it defends and preserves itself to the best of its ability.\nYou can use your action to take total and precise control of the target. Until the end of your next turn, the creature takes only the actions you choose, and doesn’t do anything that you don’t allow it to do. During this time, you can also cause the creature to use a reaction, but this requires you to use your own reaction as well.\nEach time the target takes damage, it makes a new Wisdom saving throw against the creation. If the saving throw succeeds, the creation ends.</p><p><strong>At Higher Levels.</strong> When you use this creation with a 5th-level creation slot, the duration is concentration, up to 10 minutes. When you use a 6th-level creation slot, the duration is concentration, up to 1 hour. When you use a creation slot of 7th level or higher, the duration is concentration, up to 8 hours.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 4,
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
    "_id": "38c8d5131e849d0c",
    "name": "Ego Whip",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You lash the mind of one creature you can see within range, filling it with despair. The target must succeed on an Intelligence saving throw or suffer disadvantage on attack rolls, ability checks, and saving throws, can’t use creations, and cannot active mastercraft items. At the end of each of its turns, the target can make another Intelligence saving throw. On a success, the creation ends on the target.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 4,
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
    "_id": "6845c3b59499f220",
    "name": "Elemental Bane",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>Choose one creature you can see within range, and choose one of the following damage types: acid, cold, fire, lightning, or thunder. The target must succeed on a Constitution saving throw or be affected by the creationn for its duration. The first time each turn the affected target takes damage of the chosen type, the target takes an extra 2d8 damage of that type. Moreover, the target loses any resistance to that damage type until the creation ends.</p><p><strong>At Higher Levels.</strong> When you use this creation with a creation slot of 5th level or higher, you can target one additional creature for each slot level above 4th. The creatures must be within 30 feet of each other when you target them.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 4,
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
    "_id": "3b56945c6313a802",
    "name": "Freedom of Movement",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You touch a willing creature. For the duration, the target’s movement is unaffected by difficult terrain, is increased by 10ft, and creation and other effects can neither reduce the target’s speed nor cause the target to be stunned, paralyzed, or restrained.\nThe target can also spend 5 feet of movement to automatically escape from non-mastercraft restraints, such as normal manacles or a creature that has it grappled. Finally, being underwater imposes no penalties on the target’s movement or attacks (except for devil fruit users).</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 4,
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
        "value": "a leather strap",
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
    "_id": "43f0041465dddedb",
    "name": "Faithful Conviction",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>A Large spectral guardian appears and hovers for the duration in an unoccupied space of your choice that you can see within range. The guardian occupies that space, its appearence is under your discretion.\nAny creature hostile to you that moves to a space within 10 feet of the guardian for the first time on a turn must succeed on a Constitution saving throw. The creature takes 20 radiant damage on a failed save, or half as much damage on a successful one. The guardian vanishes when it has dealt a total of 60 damage.</p><p><strong>At Higher Levels.</strong> When you use this creation with a creation slot of 5th level or higher, the total damage the spectral guardian can deal increases by 20 for each slot level above 4th. For example, when used at 5th level, it can disappears after dealing 80 total damage.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 4,
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
    "_id": "3557c8749a1bebfc",
    "name": "Gravity Collapse",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>A 20-foot-radius sphere of crushing force forms at a point you can see within range and tugs at the creatures there. Each creature in the sphere must make a Constitution saving throw. On a failed save, the creature takes 6d10 force damage, and is pulled in a straight line toward the center of the sphere, ending in an unoccupied space as close to the center as possible (even if that space is in the air). On a successful save, the creature takes half as much damage and isn't pulled.</p><p><strong>At Higher Levels.</strong> When you use this creation with a creation slot of 5th level or higher, the damage increases by 1d10 for each slot level above 4th.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 4,
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
        "value": "a marble",
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
        "parts": [
          [
            "6d10",
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
    "_id": "008b6223f3e1ec6c",
    "name": "Greater Invisibility",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You or a creature you touch becomes invisible until the creation ends. Anything the target is wearing or carrying is invisible as long as it is on the target’s person.</p><p><strong>At Higher Levels.</strong> When you use this creation with a creation slot of 6th level or higher, the duration increases to 10 minutes. When you use this creation with a creation slot of 8th level or higher, the duration increases to 1 hour.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 4,
      "school": "ill",
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
    "_id": "1b56139d14a6af5f",
    "name": "Hideout",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You make an area within range secure. The area is a cube that can be as small as 5 feet to as large as 100 feet on each side. The creation lasts for the duration or until you use an action to dismiss it.\nWhen you use this creation, you decide what sort of security the creation provides, choosing any or all of the following properties:\n<em> Sound can’t pass through the barrier at the edge of the protected area.\n</em> The barrier of the protected area appears dark and foggy, preventing vision (including darkvision) through it.\n<em> Everything in the area, objects and creatures, in the area can’t be targeted by divination creations.\n</em> Nothing can teleport into or out of the protected area.\nUsing this creation on the same spot every day for a year makes this effect permanent.</p><p><strong>At Higher Levels.</strong> When you use this creation with a creation slot of 5th level or higher, you can increase the size of the cube by 100 feet for each slot level beyond 4th. Thus you could protect a cube that can be up to 200 feet on one side by using a creation slot of 5th level.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 4,
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
        "value": "a piece of glass",
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
    "_id": "160ef2a94b659356",
    "name": "Hold Monster",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>Choose a creature that you can see within range. The target must succeed on a Wisdom saving throw or be paralyzed for the duration. This creation has no effect on undead. At the end of each of its turns, the target can make another Wisdom saving throw. On a success, the creation ends on the target.</p><p><strong>At Higher Levels.</strong> When you use this creation with a creation slot of 6th level or higher, you can target one additional creature for each slot level above 5th. The creatures must be within 30 feet of each other when you target them.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 4,
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
        "value": "a small piece of iron",
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
    "_id": "74faf8d02738ee83",
    "name": "Kill Radius",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>Choose a 60-foot-radius sphere from a point within range. Each creature in that area must make a Constitution saving throw. A target takes 8d6 necrotic damage on a failed save, or half as much damage on a successful one.</p><p><strong>At Higher Levels.</strong> When you use this creation with a creation slot of 5th level or higher, the damage increases by 1d6 for each slot level above 4th.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 4,
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
            "8d6",
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
    "_id": "c6c347a0b3bc907c",
    "name": "Lunacy",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You attempt to drive a creature within range mad. The target must make an Intelligence saving throw. On a failed save, the target is driven insane for the duration, repeating the save at the end of each of their turns, ending the effect on a success. An insane creature can't take actions, can't understand what other creatures say, can't read, and speaks only in gibberish. The DM controls its movement, which is erratic.</p><p><strong>At Higher Levels.</strong> When you use this creation with a creation slot of 5th level or higher, you can target an additional creature for each slot level above 4th. Each target must be within 30 feet of each other.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 4,
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
    "_id": "7d7035c618e53176",
    "name": "Phantasmal Killer",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You tap into the nightmares of a creature you can see within range and create an illusory manifestation of its deepest fears, visible only to that creature.\nThe target must make a Wisdom saving throw. On a failed save, the target becomes frightened for the duration. At the end of each of the target’s turns before the creation ends, the target must succeed on a Wisdom saving throw or take 4d10 psychic damage. On a successful save, the creation ends.</p><p><strong>At Higher Levels.</strong> When you use this creation with a creation slot of 5th level or higher, the damage increases by 1d10 for each slot level above 4th.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 4,
      "school": "ill",
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
            "4d10",
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
    "_id": "812238ac0245cd99",
    "name": "Polymorph",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>This creation transforms a creature that you can see within range into a new form. An unwilling creature must make a Wisdom saving throw to avoid the effect.\nThe transformation lasts for the duration, or until the target drops to 0 hit points or dies. The new form can be any beast whose proficiency bonus is the same or lesser than the target's and if the beast you transform them into is gargantuan or smaller. The target’s game statistics, excluding mental ability scores, are replaced by the statistics of the chosen beast. It retains its alignment and personality.\nThe target assumes the hit points of its new form. When it reverts to its normal form, the creature returns to the number of hit points it had before it transformed. If it reverts as a result of dropping to 0 hit points, any excess damage carries over to its normal form. As long as the excess damage doesn’t reduce the creature’s normal form to 0 hit points, it isn’t knocked unconscious.\nThe creature is limited in the actions it can perform by the nature of its new form, use creations, can't activate mastercraft items, cannot access their devil fruit abilities if they have them as they temporarily don't count as a devil fruit user, or take any other action that requires hands. You can choose whether or not to allow the target to be capable of speech.\nThe target’s gear melds into the new form. The creature can’t activate, use, wield, or otherwise benefit from any of its equipment. This creation can’t affect a target that has 0 hit points.</p><p><strong>At Higher Levels.</strong> When you use this creation with a creation slot of 5th level or higher, the duration increases to 8 hours. When you use this creation with a slot of 6th level, the duration becomes 24 hours. When you use this creation with a slot of 7th level, the duration becomes 1 week. When you use this creation with a slot of 8th level, it lasts until concentration is broken or if the beast form is reduced to 0 hit points. When you use this creation at 9th level, it lasts until deactivated with no concentration, and the beast the target is transformed into can be colossal in size, but not titanic.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 4,
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
        "value": "a caterpillar cocoon",
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
    "_id": "6df0b8fb62a232ab",
    "name": "Prime Ward",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You have resistance to acid, cold, fire, lightning, and thunder damage for the creation’s duration.\nWhen you take damage of one of those types, you can use your reaction to gain immunity to that type of damage, including against the triggering damage. If you do so, the resistances temporarily end, and you have the immunity until the end of your next turn. After the end of your next turn, you lose the immunity, but regain the resistances if the creation is still active.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 4,
      "school": "abj",
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
    "_id": "78c3e88fe2c5a35a",
    "name": "Psychic Lance",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You metaphorically jam a giant lance into the brain a creature that you can see within range, making it feel like they physically got stabbed in the head with a giant lance. Alternatively, you can utter a creature’s name. If the named target is within range, it becomes the creation’s target even if you can’t see it. If the named target isn’t within range, the creation has no effect.\nThe target must make an Intelligence saving throw. On a failed save, the target takes 7d6 psychic damage and is incapacitated until the start of your next turn. On a successful save, the creature takes half as much damage and isn’t incapacitated.</p><p><strong>At Higher Levels.</strong> When you use this creation with a creation slot of 5th level or higher, the damage increases by 1d6 for each slot level above 4th.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 4,
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
        "parts": [
          [
            "7d6",
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
    "_id": "c0d63022d6d47969",
    "name": "Resilient Sphere",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>A sphere of force encloses a creature or object of Large size or smaller within range. An unwilling creature must make a Dexterity saving throw. On a failed save, the creature is enclosed for the duration.\nNothing – not physical objects, energy, or other creation effects – can pass through the barrier, in or out, though a creature in the sphere can breathe there. The sphere is immune to all damage, and a creature or object inside can’t be damaged by attacks or effects originating from outside, nor can a creature inside the sphere damage anything outside it.\nThe sphere is weightless and just large enough to contain the creature or object inside. An enclosed creature can use its action to push against the sphere’s walls and thus roll the sphere at up to half the creature’s speed. Similarly, the globe can be picked up and moved by other creatures.\nA Disintegrate creation targeting the globe destroys it without harming anything inside it.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 4,
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
        "value": "a glass sphere",
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
    "_id": "6b2822b075026c08",
    "name": "Secret Passage",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>A passage appears at a point of your choice that you can see on a wooden, plaster, or stone surface (such as a wall, a ceiling, or a floor) within range, and lasts for the duration. You choose the opening’s dimensions: up to 5 feet wide, 8 feet tall, and 20 feet deep. The passage creates no instability in a structure surrounding it.\nWhen the opening disappears, any creatures or objects still in the passage created by the creation are safely ejected to an unoccupied space nearest to the surface on which you use the creation.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 4,
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
        "value": "a hinge",
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
    "_id": "7cb1a0835eca8294",
    "name": "Sickening Radiance",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>Dim, greenish light spreads within a 30-foot-radius sphere centered on a point you choose within range. The light spreads around corners, and it lasts until the creation ends.\nWhen a creature moves into the creation’s area for the first time on a turn or starts its turn there, that creature must succeed on a Constitution saving throw or take 4d10 radiant damage, and it suffers one level of exhaustion and emits a dim, greenish light in a 5-foot radius. This light makes it impossible for the creature to benefit from being invisible. The light and any levels of exhaustion caused by this spell go away when the creation ends.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 4,
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
            "4d10",
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
    "_id": "2d85288f324815a7",
    "name": "Stoneskin",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>This creation turns the flesh of a willing creature you touch as hard as stone. Until the spell ends, the target has resistance to bludgeoning, piercing, and slashing damage.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 4,
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
    "_id": "29d6ba09cba084d1",
    "name": "Stormy Sphere",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>A 20-foot-radius sphere of whirling air springs into existence centered on a point you choose within range. The sphere remains for the creation’s duration. Each creature in the sphere when it appears or that ends its turn there must succeed on a Strength saving throw or take 2d6 bludgeoning damage. The sphere’s space is difficult terrain.\nUntil the creation ends, you can use a bonus action on each of your turns to cause a bolt of lightning to leap from the center of the sphere toward one creature you choose within 60 feet of the center. Make a ranged creation attack. You have advantage on the attack roll if the target is in the sphere. On a hit, the target takes 4d10 lightning damage.\nCreatures within 30 feet of the sphere have disadvantage on Wisdom (Perception) checks made to listen.</p><p><strong>At Higher Levels.</strong> When you use this creation with a creation slot of 5th level or higher, the bludgeoning damage increase by 1d6 and the lightning damage increases by 1d10 for each slot level above 4th.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 4,
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
      "actionType": "rsak",
      "attack": {
        "bonus": "",
        "flat": false
      },
      "damage": {
        "parts": [
          [
            "2d6",
            "bludgeoning"
          ],
          [
            "4d10",
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
    "_id": "35c9e7ad37494663",
    "name": "Sunburn",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>The deadly, blazing light shines down on a location you specify within range. Until the spell ends, a 30-foot-radius, 40-foot-high cylinder of bright light glimmers there. This light is sunlight.\nWhen the cylinder appears, each creature in it must make a Constitution saving throw, taking 4d10 radiant damage on a failed save, or half as much damage on a successful one. A creature must also make this saving throw whenever it ends its turn in the cylinder. If you’re within 60 feet of the cylinder, you can move it up to 60 feet as a bonus action on your turn.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 4,
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
            "4d10",
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
    "_id": "a3590856b3fe7c00",
    "name": "Telekinesis",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You gain the ability to move or manipulate creatures or objects by thought. When you use this creation, and as your action each round for the duration, you can exert your will on one creature or object that you can see within range, causing the appropriate effect below. You can affect the same target round after round, or choose a new one at any time. If you switch targets, the prior target is no longer affected by the creation.\n<strong>Creature.</strong>\nYou can try to move a Huge or smaller creature. Make an ability check with your creativity ability contested by the creature’s Strength check. If you win the contest, you move the creature up to 30 feet in any direction, including upward but not beyond the range of this creation. Until the end of your next turn, the creature is restrained in your telekinetic grip. A creature lifted upward is suspended in mid-air.\nOn subsequent rounds, you can use your action to attempt to maintain your telekinetic grip on the creature by repeating the contest.\n<strong>Object.</strong>\nYou can try to move an object that weighs up to 1,000 pounds. If the object isn’t being worn or carried, you automatically move it up to 30 feet in any direction, but not beyond the range of this creation.\nIf the object is worn or carried by a creature, you must make an ability check with your creativity ability contested by that creature’s Strength check. If you succeed, you pull the object away from that creature and can move it up to 30 feet in any direction but not beyond the range of this creation.\nYou can exert fine control on objects with your telekinetic grip, such as manipulating a simple tool, opening a door or a container, stowing or retrieving an item from an open container, or pouring the contents from a vial.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 4,
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
    "_id": "45113c27fbfd8851",
    "name": "Vanquish",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>For the creation’s duration, you gain the ability to completely overwhelm your enemies. One creature of your choice within 60 feet of you that you can see must succeed on a Wisdom saving throw or be affected by one of the following effects of your choice for the duration. On each of your turns until the creation ends, you can use your action to target another creature but can’t target a creature again if it has succeeded on a saving throw against this use of Vanquish.\n<strong>Asleep.</strong> The target falls unconscious. It wakes up if it takes any damage or if another creature uses its action to shake the sleeper awake.\n<strong>Panicked.</strong> The target is frightened of you. On each of its turns, the frightened creature must take the Dash action and move away from you by the safest and shortest available route, unless there is nowhere to move. If the target moves to a place at least 60 feet away from you where it can no longer see you, this effect ends.\n<strong>Sickened.</strong> The target has disadvantage on attack rolls and ability checks. At the end of each of its turns, it can make another Wisdom saving throw. If it succeeds, the effect ends.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 4,
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
    "_id": "f9e48193522c38e2",
    "name": "Vitrolic Sphere",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You point at a place within range, and a ball of acid streaks there and explodes in a 20-foot radius. Each creature in that area must make a Dexterity saving throw. On a failed save, a creature takes 10d4 acid damage and 5d4 acid damage at the end of each of its turns for the duration, or until a creature uses their action to scrape off the acid. On a successful save, a creature takes half the initial damage and no damage at the end of its next turn.</p><p><strong>At Higher Levels.</strong> When you use this creation with a creation slot of 5th level or higher, the initial damage increases by 2d4 for each slot level above 4th.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 4,
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
        "value": "a slug",
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
            "10d4",
            "acid"
          ],
          [
            "5d4",
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
    "_id": "fbc514a8ba7194ae",
    "name": "Wall of Acid",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You create a wall of dense, sticky acid on a surface within range. The wall can be up to 60 ft long, 10 ft high, and 1 ft thick, or a 10 ft radius ringed wall with the same height and thickness. The wall is opaque. The wall vanishes when the creation ends. The wall’s space is difficult terrain.\nWhen a creature enters the wall's area for the first time on a turn or starts its turn there, the creature within its area must make a Dexterity saving throw saving throw. On a failed save, a creature becomes restrained for the duration and takes 8d4 acid damage, and 4d4 acid at the end of each of their turns they remain in the acid. On a successful save, they take half the initial damage and are shunted to the opposite end of the wall from you. A restrained creature, or a creature within reach of a restrained creature, can use their action to attempt to pull the restrained creature out, making an Athletics (Strength) check against your creativity DC, pulling them out on a success.</p><p><strong>At Higher Levels.</strong> When you use this using a creation slot of 5th level or higher, the initial damage increases by 2d4, and the damage at the end of each of their turns increases by 1d4 for each level above 4th.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 4,
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
            "8d4",
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
    "_id": "a9b26a627facd786",
    "name": "Wall of Fire",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You create a wall of fire on a solid surface within range. You can make the wall up to 60 feet long, 20 feet high, and 1 foot thick, or a ringed wall up to 20 feet in diameter, 20 feet high, and 1 foot thick. The wall is opaque and lasts for the duration.\nWhen the wall appears, each creature within its area must make a Dexterity saving throw. On a failed save, a creature takes 5d8 fire damage. On a successful save, they take half as much damage and are shunted to the opposite side of the wall from you.\nOne side of the wall, selected by you when you cast this spell, deals 5d8 fire damage to each creature that ends its turn within 10 feet of that side or inside the wall. A creature takes the same damage when it enters the wall for the first time on a turn or ends its turn there. The other side of the wall deals no damage.</p><p><strong>At Higher Levels.</strong> When you use this creation with a creation slot of 5th level or higher, the damage increases by 1d8 for each slot level above 4th.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 4,
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
        "value": "A small piece of phosphorus",
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
            "5d8",
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
    "_id": "91d3d054ebb1f1cf",
    "name": "Wall of Stone",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>A wall of solid stone springs into existence at a point you choose within range. The wall is 6 inches thick and is composed of ten 10-foot-by-10-foot panels. Each panel must be contiguous with at least on other panel. Alternatively, you can create 10-foot-by-20-foot panels that are only 3 inches thick.\nIf the wall cuts through a creature’s space when it appears, the creature is shunted to one side of the wall (your choice). If a creature would be surrounded on all sides by the wall (or the wall and another solid surface), that creature can make a Dexterity saving throw. On a success, it can use its reaction to move up to its speed so that it is no longer enclosed by the wall.\nThe wall can have any shape you desire, though it can’t occupy the same space as a creature or object. the wall doesn’t need to be vertical or resting on any firm foundation. It must, however, merge with and be solidly supported by existing stone. Thus you can use this spell to bridge a chasm or create a ramp.\nIf you create a span greater than 20 feet in length, you must halve the size of each panel to create supports. You can crudely shape the wall to create crenelations, battlements, and so on.\nThe wall is an object made of stone that can be damaged and thus breached. Each panel has AC 15 and 30 hit points per inch of thickness. Reducing a panel to 0 hit points destroys it and might cause connected panels to collapse at the DM’s discretion.\nIf you maintain your concentration on this creation for its whole duration, the wall becomes permanent and can’t be dispelled. Otherwise, the wall disappears when the creation ends.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 4,
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
        "value": "a small block of granite",
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
    "_id": "f133fb74a5869078",
    "name": "Wall of Thorns",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You create a wall of tough, pliable, tangled brush bristling with needle-sharp thorns. The wall appears within range on a solid surface and lasts for the duration. You choose to make the wall up to 60 feet long, 10 feet high, and 5 feet thick or a circle that has a 20-foot diameter and is up to 20 feet high and 5 feet thick. The wall blocks line of sight.\nWhen the wall appears, each creature within its area must make a Dexterity saving throw. On a failed save, a creature takes 7d8 piercing damage, or half as much damage on a successful save.\nA creature can move through the wall, albeit slowly and painfully. For every 1 foot a creature moves through the wall, it must spend 4 feet of movement. Furthermore, the first time a creature enters the wall on a turn or ends its turn there, the creature must make a Dexterity saving throw. It takes 7d8 slashing damage on a failed save, or half as much on a successful save.</p><p><strong>At Higher Levels.</strong> When you use this creation with a creation slot of 5th level or higher, both types of damage increase by 1d8 for each slot level above 4th.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 4,
      "school": "con",
      "components": {
        "value": "",
        "vocal": true,
        "somatic": true,
        "material": true,
        "ritual": false,
        "concentration": true
      },
      "materials": {
        "value": "a handful of thorns",
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
            "7d8",
            "piercing"
          ],
          [
            "7d8",
            "slashing"
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
    "_id": "49a68a131a7c3c5b",
    "name": "Watery Sphere",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You conjure up a sphere of water with a 5-foot radius on a point you can see within range. The sphere can hover in the air, but no more than 10 feet off the ground. The sphere remains for the creation’s duration.\nAny creature in the sphere’s space must make a Strength saving throw. On a successful save, a creature is ejected from that space to the nearest unoccupied space outside it. A Huge or larger creature succeeds on the saving throw automatically. On a failed save, a creature is restrained by the sphere and is engulfed by the water. At the end of each of its turns, a restrained target can repeat the saving throw.\nThe sphere can restrain a maximum of four Medium or smaller creatures or one Large creature. If the sphere restrains a creature in excess of these numbers, a random creature that was already restrained by the sphere falls out of it and lands prone in a space within 5 feet of it.\nAs an action, you can move the sphere up to 30 feet in a straight line. If it moves over a pit, cliff, or other drop, it safely descends until it is hovering 10 feet over ground. Any creature restrained by the sphere moves with it. You can ram the sphere into creatures, forcing them to make the saving throw, but no more than once per turn.\nWhen the spell ends, the sphere falls to the ground and extinguishes all normal flames within 30 feet of it. Any creature restrained by the sphere is knocked prone in the space where it falls.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 4,
      "school": "con",
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
    "_id": "09a0e973f18b65a9",
    "name": "Wall of Venom",
    "type": "spell",
    "img": "icons/svg/item-bag.svg",
    "system": {
      "description": {
        "value": "<p>You conjure up a wall of poison on the ground at a point you can see within range. You can make the wall up to 30 feet long, 10 feet high, and 1 foot thick, or you can make a ringed wall up to 20 feet in diameter, 20 feet high, and 1 foot thick. The wall vanishes when the creation ends. The wall’s space is difficult terrain.\nWhen a creature enters the wall's area for the first time on a turn or starts its turn there, the creature within its area must make a Constitution saving throw saving throw. On a failed save, a creature becomes poisoned for the duration and takes 4d10 poison damage. On a successful save, they take half damage and are shunted to the opposite end of the wall from you. At the end of each of a poisoned creature’s turns, they must remake the Constitution saving throw, ending the effect on a success, and taking 4d10 poison damage again on a failure.\nAny ranged weapon attack that enters the wall’s space has disadvantage on the attack roll, and fire damage is halved if the fire effect passes through the wall to reach its target. Attacks and creations that deal cold damage that pass through the wall cause the area of the wall they pass through to freeze solid (at least a 5-foot square section is frozen). Each 5-foot-square frozen section has AC 5 and 15 hit points. Reducing a frozen section to 0 hit points destroys it. When a section is destroyed, the wall’s water doesn’t fill it.</p><p><strong>At Higher Levels.</strong> When you use this using a creation slot of 5th level or higher, the creation deals an extra 1d10 damage for each level above 4th.</p>",
        "chat": ""
      },
      "source": {
        "book": "OP5e",
        "page": "",
        "custom": "",
        "license": ""
      },
      "level": 4,
      "school": "con",
      "components": {
        "value": "",
        "vocal": true,
        "somatic": true,
        "material": true,
        "ritual": false,
        "concentration": true
      },
      "materials": {
        "value": "a drop of venom",
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
      "actionType": "rsak",
      "attack": {
        "bonus": "",
        "flat": false
      },
      "damage": {
        "parts": [
          [
            "4d10",
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
  }
];
