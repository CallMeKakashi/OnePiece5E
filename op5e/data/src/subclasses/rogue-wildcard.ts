import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";
import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";

const SC_ID = "subclass/rogue/wildcard";

function feat(idPath: string, name: string, level: number, description: string, extra: any = {}): FeatureItem {
  return {
    _id: generateId(idPath),
    name,
    type: "feat",
    img: "icons/svg/item-bag.svg",
    system: {
      description: { value: description, chat: "" },
      source: { book: "OP5e", page: "", custom: "", license: "" },
      type: { value: "class", subtype: "" },
      requirements: `Rogue (Wildcard) ${level}`,
      activation: { type: "", cost: null, condition: "" },
      duration: { value: null, units: "" },
      target: { value: null, width: null, units: "", type: "" },
      range: { value: null, long: null, units: "" },
      uses: { value: null, max: "", per: null, recovery: "", prompt: true },
      actionType: "",
      damage: { parts: [], versatile: "" },
      save: { ability: "", dc: null, scaling: "spell" },
      chatFlavor: "",
      recharge: { value: null, charged: false },
      ...extra,
    },
    effects: [],
    flags: {},
    folder: null,
    sort: 0,
    ownership: { default: 0 },
    _stats: { compendiumSource: null, duplicateSource: null, coreVersion: "13", systemId: "dnd5e", systemVersion: "5.1.10", createdTime: null, modifiedTime: null, lastModifiedBy: null },
  } as unknown as FeatureItem;
}

export const masterDealer = feat(
  "feature/rogue/wildcard/master-dealer", "Master Dealer", 3,
  `<p>Starting at 3rd level, you have been trained in many types of games. You gain proficiency in 3 types of gaming sets of your choice, one of which you can have expertise in.</p><p>In addition, you gain proficiency with improvised weapons and can utilize parts of gaming sets you are proficient in as improvised weapons, such as using cards.</p><p>Improvised weapons you wield have the finesse and thrown (30/120) properties. They deal 1d6 damage, which increases to 1d8 at 6th, 1d10 at 11th, and 1d12 at 16th level. Their damage type is your choice of bludgeoning, piercing, or slashing.</p>`,
);

export const riskyGambit = feat(
  "feature/rogue/wildcard/risky-gambit", "Risky Gambit", 3,
  `<p>When you choose this archetype at 3rd level, you begin to notice that chaos seems to follow you everywhere you go, typically forming as an unexpected surge of events that you can take full advantage of whenever an opportunity presents itself.</p><p>Once per turn, as a bonus action, you can roll a 1d100, the result of which determines an effect that will occur as described on the Risky Gambit table. If that effect is a creation, or requires a saving throw, the DC = 8 + your Dexterity modifier + your proficiency bonus. If it requires concentration, you must maintain concentration on it.</p>
<table><thead><tr><th>d100</th><th>Effect</th></tr></thead><tbody>
<tr><td>1</td><td>Roll on this table at the start of each of your turns for the next minute, ignoring this result on subsequent rolls.</td></tr>
<tr><td>2</td><td>For the next minute, at the start of each of your turns, you gain a number of temporary hit points equal to your Dexterity modifier.</td></tr>
<tr><td>3</td><td>Until the start of your next turn, you are charmed by a random creature within 30ft of you, be they ally or enemy.</td></tr>
<tr><td>4</td><td>Until the start of your next turn, your movement speed is 0.</td></tr>
<tr><td>5</td><td>If you have at least 1 Hit Dice remaining, you lose one. If not, you take 1d6 necrotic damage.</td></tr>
<tr><td>6</td><td>You use the Bless creation.</td></tr>
<tr><td>7</td><td>For the next minute, you have a +2 bonus to your AC.</td></tr>
<tr><td>8</td><td>For the next minute, you and any ally within 10ft of you become immune to effects that would leave you frightened.</td></tr>
<tr><td>9</td><td>You use the Mirror Image creation.</td></tr>
<tr><td>10</td><td>You become invisible for the next minute. The invisibility ends early if you make an attack.</td></tr>
<tr><td>11</td><td>You become frightened by the creature closest to you, even if they are an ally, for 1 minute. At the end of each of your turns, you can make a Wisdom saving throw to end the effect on a success.</td></tr>
<tr><td>12</td><td>A random wanted poster lands in a space within 30ft of you.</td></tr>
<tr><td>13</td><td>Your next attack has advantage, but all attacks against you will also have advantage until the start of your next turn.</td></tr>
<tr><td>14</td><td>Until the end of your next turn, you have disadvantage on all Strength checks and saving throws.</td></tr>
<tr><td>15</td><td>Until the end of your next turn, you gain an extra action.</td></tr>
<tr><td>16</td><td>For the next minute, the next time you hit a creature with an attack, and deal sneak attack, you deal the maximum damage instead of rolling.</td></tr>
<tr><td>17</td><td>You use the Fireball creation.</td></tr>
<tr><td>18</td><td>You regain an expended hit die. If you have no expended hit die, you instead regain 1d10 hit points.</td></tr>
<tr><td>19</td><td>You use the Entangle creation.</td></tr>
<tr><td>20</td><td>You use the Fireball, but it is centered on yourself.</td></tr>
<tr><td>21</td><td>You gain resistance to all damage for the next minute.</td></tr>
<tr><td>22</td><td>You use the Missiles creation at 3rd level.</td></tr>
<tr><td>23</td><td>You use the Blur creation.</td></tr>
<tr><td>24</td><td>You use the Blindness/Deafness creation.</td></tr>
<tr><td>25</td><td>You use the Warding Wind creation.</td></tr>
<tr><td>26</td><td>If your hit points were to be reduced to 0 in the next minute, you instead fall to 1 hit point, after which the effect ends.</td></tr>
<tr><td>27</td><td>The next time you deal sneak attack damage, that damage is halved.</td></tr>
<tr><td>28</td><td>A randomly chosen enemy within 60ft of you falls prone.</td></tr>
<tr><td>29</td><td>The next d20 roll that you fail, you can choose to reroll it. You must take the new roll.</td></tr>
<tr><td>30</td><td>For the next minute, you cannot be charmed. If you are already charmed, the effect is suspended for the duration.</td></tr>
<tr><td>31</td><td>A cloud of hundreds of oversized butterflies fills a 30-foot radius centered on yourself. The area becomes heavily obscured for 10 minutes, the butterflies disperse afterwards.</td></tr>
<tr><td>32</td><td>The next time you are hit with a melee weapon attack, the target takes half the damage they dealt to you.</td></tr>
<tr><td>33</td><td>You spontaneously burst into flames for one minute, or until a creature uses their action to extinguish the flames. At the end of each of your turns, you take 1d10 fire damage while you are on fire.</td></tr>
<tr><td>34</td><td>You use the Fear Factor creation.</td></tr>
<tr><td>35</td><td>You add 5 to your next initiative roll. If you are already in combat, this increases your initiative result by 5 when the next round begins.</td></tr>
<tr><td>36</td><td>Any creature within a 30ft radius of yourself has disadvantage on all attack rolls, except against you.</td></tr>
<tr><td>37</td><td>For the next minute, you have a -2 penalty to your AC.</td></tr>
<tr><td>38</td><td>You forget everything that happened in the last 10 minutes.</td></tr>
<tr><td>39</td><td>You automatically fail the next death save you make within the next 24 hours.</td></tr>
<tr><td>40</td><td>You immediately take 2d10 psychic damage.</td></tr>
<tr><td>41</td><td>You lose the ability to speak for the next hour.</td></tr>
<tr><td>42</td><td>You cast Enlarge/Reduce, reducing yourself.</td></tr>
<tr><td>43</td><td>You use Spike Growth creation, but it is centered on yourself.</td></tr>
<tr><td>44</td><td>For the next minute, your movement speed is reduced by 10.</td></tr>
<tr><td>45</td><td>A randomly determined (DM's discretion), non-mastercraft, object of small or lesser size appears in an open space within 30ft of you.</td></tr>
<tr><td>46</td><td>You use the Spider Climb creation.</td></tr>
<tr><td>47</td><td>A random type of hat, that is not mastercraft or special in any other way, appears on a random creature within 30ft of yourself.</td></tr>
<tr><td>48</td><td>You use the Stinking Cloud creation.</td></tr>
<tr><td>49</td><td>You use the Heat Metal creation.</td></tr>
<tr><td>50</td><td>You drop an item you are holding. If you aren't holding anything, you instead fall prone.</td></tr>
<tr><td>51</td><td>You are launched 2d4 x 10 feet into the air, and then fall.</td></tr>
<tr><td>52</td><td>For the next minute, you can use your bonus action to teleport to a location you can see within a 30ft range.</td></tr>
<tr><td>53</td><td>You regain a number of hit points equal to 2d10 + your Dexterity modifier.</td></tr>
<tr><td>54</td><td>You are stunned until the start of your next turn, believing something awesome just happened.</td></tr>
<tr><td>55</td><td>You use the Fog Cloud creation, but it is centered on yourself.</td></tr>
<tr><td>56</td><td>A randomly chosen creature within 60ft of you falls prone.</td></tr>
<tr><td>57</td><td>You use the Fairy Lights creation.</td></tr>
<tr><td>58</td><td>You use the Grease creation.</td></tr>
<tr><td>59</td><td>A randomly chosen enemy within 60ft of you drops an item they are holding.</td></tr>
<tr><td>60</td><td>For the next minute, you have advantage on Dexterity checks and saving throws.</td></tr>
<tr><td>61</td><td>The ground within a 30ft radius around yourself becomes difficult terrain.</td></tr>
<tr><td>62</td><td>You become poisoned for 1 minute, but you can make a Constitution saving throw, DC 16 at the end of each of your turns, ending it on a success.</td></tr>
<tr><td>63</td><td>An animal of the DM's choice appears in the unoccupied space nearest to you. The animal isn't under your control and acts as it normally would.</td></tr>
<tr><td>64</td><td>The next time you take damage, that damage is halved.</td></tr>
<tr><td>65</td><td>For the next minute, you have advantage on Strength checks and saving throws.</td></tr>
<tr><td>66</td><td>You use the Lesser Restoration creation on yourself, or a willing creature within 30ft of you.</td></tr>
<tr><td>67</td><td>For the next minute, you don't provoke opportunity attacks.</td></tr>
<tr><td>68</td><td>The next time you hit a creature with a weapon attack, it must make a Constitution saving throw, becoming stunned until the end of your next turn on a failure.</td></tr>
<tr><td>69</td><td>A creature of your choice within 10ft of you, you can move them 20ft in a direction of your choice. Unwilling creatures are moved if they fail a Strength saving throw.</td></tr>
<tr><td>70</td><td>You use the Levitate creation.</td></tr>
<tr><td>71</td><td>You use the Tremor creation.</td></tr>
<tr><td>72</td><td>You cannot take reactions until the start of your next turn.</td></tr>
<tr><td>73</td><td>The next time you hit a creature and successfully sneak attack, you take half of the damage you dealt.</td></tr>
<tr><td>74</td><td>On your next turn, you can only take an action, bonus action, or movement.</td></tr>
<tr><td>75</td><td>You cast Enlarge/Reduce, enlarging yourself.</td></tr>
<tr><td>76</td><td>You cast the Slow creation.</td></tr>
<tr><td>77</td><td>A stream of 1d4 x 10 game pieces (such as dice, cards, or poker chips), shoots out from your space in a line 30 feet long and 5 feet wide. Each piece deals 1 bludgeoning damage, and the total damage of the piece is divided equally among all creatures in the line.</td></tr>
<tr><td>78</td><td>You use the Lightning Bolt creation.</td></tr>
<tr><td>79</td><td>For 1 minute, you and every creature within 30ft of you cannot see farther than 30ft.</td></tr>
<tr><td>80</td><td>Mysteriously, you lose 100,000 berries that you have on you.</td></tr>
<tr><td>81</td><td>For the next minute, you have advantage on Constitution saving throws.</td></tr>
<tr><td>82</td><td>You glow bright red as if the Light trick was used on you, for 1 hour.</td></tr>
<tr><td>83</td><td>You gain 1 level of exhaustion.</td></tr>
<tr><td>84</td><td>You use the Wall of Sand creation centered on yourself.</td></tr>
<tr><td>85</td><td>A loud and annoying sound blares out from around you. You and each creature within 10ft of you takes 2d10 thunder damage. If a creature is concentrating on a creation, or ability that requires concentration, they make a concentration save with disadvantage.</td></tr>
<tr><td>86</td><td>For the next minute, you have advantage on Wisdom checks and saving throws.</td></tr>
<tr><td>87</td><td>Until the start of your next turn, you can't regain hit points.</td></tr>
<tr><td>88</td><td>You subtract 5 from your next initiative roll. If you are already in combat, this decreases your initiative result by 5 when the next round begins.</td></tr>
<tr><td>89</td><td>Appearing in every square that is 5ft adjacent to you, caltrops suddenly appear.</td></tr>
<tr><td>90</td><td>The weather unexpectedly shifts, causing a heavy rain to occur outside for the next hour.</td></tr>
<tr><td>91</td><td>All allies within 10 feet of you get a -2 penalty on attack and damage rolls for any attack they make for the next minute.</td></tr>
<tr><td>92</td><td>For the next minute, you have advantage on Intelligence checks and saving throws.</td></tr>
<tr><td>93</td><td>A random humanoid appears within 100ft of you and loudly declares you as their enemy.</td></tr>
<tr><td>94</td><td>For the next minute, you have advantage on Charisma checks and saving throws.</td></tr>
<tr><td>95</td><td>You gain a number of temporary hit points equal to twice your level.</td></tr>
<tr><td>96</td><td>For the next minute, your speed increases by 10.</td></tr>
<tr><td>97</td><td>The next time you successfully hit a creature and deal sneak attack damage to them, you deal an extra 3d6 damage.</td></tr>
<tr><td>98</td><td>All of your hair falls out, but will grow back by the end of the day.</td></tr>
<tr><td>99</td><td>The DM chooses one of the effects on this table.</td></tr>
<tr><td>100</td><td>You get to choose which effect on this table takes effect.</td></tr>
</tbody></table>`,
  {
    activation: { type: "bonus", cost: 1, condition: "" },
  },
);

export const willyNilly = feat(
  "feature/rogue/wildcard/willy-nilly", "Willy-Nilly", 6,
  `<p>Starting at 6th level, chaos continues to follow you as lady luck looms overhead; it is time for you to throw out any and all random abilities you got. The following effects are added to your Devious Strike options.</p><p><strong>Volatile (Cost: 1d6).</strong> Your attack suddenly is infused with a dangerous element. Roll 1d6. The result determines the damage type of your sneak attack, as shown on the Volatile Damage table below.</p><table><thead><tr><th>Number</th><th>Damage Type</th></tr></thead><tbody><tr><td>1</td><td>Acid</td></tr><tr><td>2</td><td>Cold</td></tr><tr><td>3</td><td>Fire</td></tr><tr><td>4</td><td>Lightning</td></tr><tr><td>5</td><td>Poison</td></tr><tr><td>6</td><td>Thunder</td></tr></tbody></table><p><strong>Quick Draw (Cost: 1d6).</strong> Like drawing a card, you quickly influence the odds with a mere gesture. As part of the attack, you can use your Risky Gambit feature. You can still only activate Risky Gambit once per turn.</p>`,
);

export const pokerface = feat(
  "feature/rogue/wildcard/pokerface", "Pokerface", 9,
  `<p>At 9th level, you can keep calm even while under pressure. You gain advantage on any Charisma (Deception) or Dexterity (Sleight of Hand) checks if you move no more than half your speed on the same turn.</p>`,
);

export const doubleDown = feat(
  "feature/rogue/wildcard/double-down", "Double Down", 13,
  `<p>Starting at 13th level, you can choose to double down on your risky gambit, becoming well prepared for what comes your way. Whenever you roll on the Risky Gambit table, you can roll twice and you choose which one takes effect. Alternatively, you can choose to take both of the results at the same time. You can do this a number of times equal to your proficiency bonus, regaining all uses on a short or long rest.</p>`,
  { uses: { value: null, max: "@prof", per: "sr", recovery: "", prompt: true } },
);

export const fatesDesign = feat(
  "feature/rogue/wildcard/fates-design", "Fate's Design", 17,
  `<p>Starting at 17th level, either through sheer preparation or dumb luck, you find yourself able to avoid nearly any deadly scenario.</p><p>When you are subjected to an effect that allows you to make any saving throw to take only half damage, you instead take no damage if you succeed on the saving throw, and only half damage if you fail.</p>`,
);

export const features: FeatureItem[] = [
  masterDealer, riskyGambit, willyNilly, pokerface, doubleDown, fatesDesign,
];

function fUuid(f: FeatureItem): string {
  return compendiumUuid("class-features", f._id);
}

export const subclass: SubclassItem = {
  _id: generateId(SC_ID),
  name: "Wildcard",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: { value: `<p>Lady Luck is a strange mistress, willing to give and take as she pleases, making even the most unlikely events a stark possibility. Rogues that fall under this archetype are masters of treading the lines of fortune and misery.</p><p>These masters of gambling are able to utilize their skills in combat, and stay calm under pressure as the world around them succumbs to pandemonium. As they continue, they may even be able to influence the chaos to a noticeable degree.</p>`, chat: "" },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "wildcard",
    classIdentifier: "rogue",
    advancement: mergeAdvancements(
      createItemGrant(SC_ID, 3, [{ uuid: fUuid(masterDealer) }, { uuid: fUuid(riskyGambit) }]),
      createItemGrant(SC_ID, 6, [{ uuid: fUuid(willyNilly) }]),
      createItemGrant(SC_ID, 9, [{ uuid: fUuid(pokerface) }]),
      createItemGrant(SC_ID, 13, [{ uuid: fUuid(doubleDown) }]),
      createItemGrant(SC_ID, 17, [{ uuid: fUuid(fatesDesign) }]),
    ) as any,
    spellcasting: { progression: "none", ability: "" },
  },
  effects: [],
  flags: {},
  folder: null,
  sort: 0,
  ownership: { default: 0 },
  _stats: { compendiumSource: null, duplicateSource: null, coreVersion: "13", systemId: "dnd5e", systemVersion: "5.1.10", createdTime: null, modifiedTime: null, lastModifiedBy: null },
} as unknown as SubclassItem;
