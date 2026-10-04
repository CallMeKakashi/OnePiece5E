# work-G: mechanic fixes vs the Sourcebook
Build: 2515 items, 0 errors. New spec file: data/src/automation/work-g.ts (registered in automation/index.ts). helpers/spec.ts gained `consumeAmount`.

## Fixed
- Brute Force scale -> 3/5/11/17 (d4/d6/d8/d10) (fighter-brute.ts).
- Master of None improvised die -> 3/6/11/16 (fighter-master-of-none.ts).
- Arms Dealer: Advanced Arsenal uses 1 + Int mod, sr (spec) + "Expend Use" activity (ammo defs referenced it but it did not exist).
- Battlemaster: Superior Combatant uses = superiority-dice scale (sr) + "Expend Superiority Die" activity (also did not exist); Relentless Combatant 1/lr activity. Gunslinger Trick Shots: grit uses 1 + Wis + "Expend Grit" (same gap).
- Bruiser Tough Customer: uses removed. Fencer En Garde: reaction condition per book. Technique Thief: bonus action.
- Assassin: Cloak-and-Dagger no activation; Deadly Strike is a Con save DC 8 + Dex + prof (damage part removed).
- Swashbuckler Master Duelist 1 + Cha mod sr; Elegant Maneuver is now a passive effect (advantage Acrobatics/Athletics), no bonus action.
- Inquisitive Astute Eye: action, max(1, Wis mod)/lr. Sawbones Patchwork: 1 + rogue level pool, sr, heal and remove-disease activities consuming dice; Miracle Worker prof/lr, 1-minute activation.
- Ringmaster Master Director and Denouement: prof/sr, activities for each option.
- Fencer Agile Reflexes (AC effect), Martial Metre (Dex DC 15 save), Weapon Weave (+prof melee attack effect).
- Devious Strike (class), Duplicitious Strike (class; text also rewritten to the book) and every subclass option (Cutthroat Tactics, Street Rules, Bully Blitz, Master Bladework, Crafty One, Interrogation Tactics, Circus Tricks, Twisted Surgery, Keen Combatant, Seek Vulnerability, Slippery Devil, Out Of Sight, Willy-Nilly) are real activities named with their dice cost and a DC of 8 + Dex + prof.
- Experimental Ooze: summon actors carry per-type "<Type> Bonus" and "(Enhanced Formula, 10th level)" traits; Lightning ooze speed 40. Enhanced Formula text now matches Actions.md. The book text for Chemical Reactions, Enhanced Formula and Perfected Mixture does exist in Experimental Ooze/Actions.md.

## Verified already correct
Battlemaster dice 4/5/6 and d8/d10/d12, maneuvers 3/5/7/9; Arms Dealer option counts 2/1/1/1/1; Cavalier Make Your Mark (no Str cap in data); Assassinate prof/lr.

## Left, and why
- Banneret and Blitzkrieg: features are text only (no invented mechanics present); no activities added.
- Fire-retaliation, acid-heal and the other ooze riders are passive trait text (the actor builder only parses attack and "DC n" prose into activities).
- Not automated: Fencer's second reaction, Constant Shots regain (cannot touch another item's uses), Advanced Combat Tactics, Perfected Mixture's two types.
- scripts/check-class-tables.mjs reports MISSING for Bard, Brawler, Rogue (Blind Sense vs Blindsense) and Barbarian. These are table-parse mismatches in files I did not touch, so likely pre-existing.
