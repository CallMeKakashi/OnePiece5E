Chapter 2 Classes triage: 290 unmatched titles -> approx P=54, R=109, M=127 (counts by regex heuristic; M collapses to ~12 distinct gaps below). Subclasses: all 80 book subclasses exist in packs-src/subclasses and every subclass feature heading is granted by advancement (verified by script vs reports/execution-classes-subclasses.json). Class table feature rows match except as noted. Source root: C:\bb\Sourcebook\Chapter 2 Classes (abbrev. S2).

NOTE: class md files hold only the level table; starting equipment/proficiency prose is not in this section, so item (4) could not be checked against the book. Class pack advancement does grant weapon/armor/tool/save traits and equipment ItemChoice.

## M items (missing mechanical content)

### Fighter
- S2/Martial Archetypes/Battlemaster.md: 23 maneuvers absent everywhere (grep of packs-src + data/src finds none): Ambush, Bait and Switch, Brace, Commander's Strike, Commanding Presence, Disarming Attack, Distracting Strike, Evasive Footwork, Feinting Attack, Goading Attack, Grappling Strike, Lunging Attack, Maneuvering Attack, Pushing Attack, Parry, Menacing Attack, Precision Attack, Quick Toss, Rally, Riposte, Sweeping Attack, Tactical Assessment, Trip Attack. "Superior Combatant" (class-features) is a 851-char summary with no maneuver list, no activities, no superiority-dice scale (4 d8, +1 at 7, 15; maneuvers known 3/5/7/9).
- S2/Martial Archetypes/Gunslinger.md: Gunsmith plus 13 shots absent: Covering Fire, Dazing, Deadeye, Deflecting (7th), Disarming, Exhausting, Forceful, Piercing, Run and Gun, Violent, Warning, Wringing, Hemorrhaging Critical. Pack only has Distinguished Shot (text mismatch).
- S2/Martial Archetypes/Arms Dealer.md: Engineering + ammo options Stasis, Hypnotic, Elemental, Exploding, Feeble, Grasping, Piercing, Shadow, Warp (7th) absent (items pack has unrelated Ammo set incl. Homing Ammo only).
- LEVEL MISMATCHES in subclass grants (book vs pack): Blitzkrieg Rapid Action 3 vs 7, Blink of an Eye 7 vs 10, Supersonic 10 vs 15 (Flashpoint 15 ok). Master of None Jury-Rigging 3 vs 7, Wreck Resistance 7 vs 10. File: S2/Martial Archetypes/Blitzkrieg.md, Master of None.md.
- Cavalier.md and Samurai.md "Bonus Proficiency" (skill choice at 3: Cav Animal Handling/History/Insight/Performance/Persuasion; Samurai History/Insight/Performance/Persuasion) not granted; subclass advancement is ItemGrant only, no Trait choice.
- Master of None.md: "Adapt and Overcome" and "Improv Damage" absent by name; pack grants "Improvised Weaponry" with different text (doubtful R, see below).

### Gadgeteer
- S2/Class Features/Mods.md: List of Mods absent: Armor of Mechanical Strength, Burst Boots, Enhanced Creative Focus, Enhanced Defenses, Enhanced Weapon, Propulsion Armor, Awareness Visor. "Mods" feature has mods-known/active scales (4/6/8/10/12; 2..6) but nothing to pick.
- S2/Mechanical Servant/Actions.md: mastercraft mod items absent: Focusing Suit, Repeating Magazine, Glowing Weapon, Repulsion Shield, Resistant Armor, Loyal Weapon, Creation Refueling Ring, Replicate Mastercraft Item, Reinforced Steel, Extended Barrel, Heavy Artillery; servant specialisations Wrought Warden, Omega Operative, Chemistry Menagerie, Versatile Elements, Airborne Aegis absent. "Master Craft Adept" is granted as "Mastercraft Adept" (R), "Specialist Path" is the subclass (R).
- Spell progression: book table gives 2 first-level slots at L1 (artificer-style); class uses progression "half" (no slots at L1). Check packs-src/classes Gadgeteer.
- Iron Defender stat block (S2/Iron Defender/*.md: Iron Defender, Actions, Reactions) has no actor in summons/monsters; Gadgeteer Battle Smith feature only describes it.
- Gadgeteer subclass always-prepared creation tables (see "All creation-granting subclasses").

### Marksman
- Tricks Known column (3 at L2, 4 at L10, 5 at L14) has no ScaleValue; Medic and Gadgeteer have tricks-known, Marksman does not.
- S2/Marksman Archetype/Beastmaster.md: companion stat blocks Beast of the Air/Land/Sea (S2/Beast of the*/) absent as actors; only generic summons "Air/Land/Water Called Beast". "Beast of the Land" appears nowhere ("Beast of the Earth" in feature text).

### Bard
- Tricks Known column (3 at L1, 4 at L4, 5 at L10) has no ScaleValue. Slot table (full caster) matches. class-table-check Bard "missing" lines are parse noise.

### Medic
- S2/Experimental Ooze, Clone, Amalgamation, Flora: Clone/Amalgamation/Flora (Bio-Engineer Test Subject) stat blocks absent. summons has 5 Experimental Ooze types only (book Experimental Ooze Type table: verify).
- S2/Clone/Actions.md: 32 lineage augmentations; pack "Experimental Augmentations" lists only 18 as one-liners. Missing: Face-Stealing (Clone), Failsafe (Clone, 14th), Flaming, Frozen, Fungal (Flora), Invisible (7th), Omni-Lineage (7th), Sparking, Spiny (Flora), Subterranean, Thunderous, Venomous, Viney (Flora), Winged (7th). Present ones are truncated summaries.
- Subclass always-prepared creation tables: Amputator (levels 2,3,5,7,9 odd), Plaguewright, Chemist, Physician (see below).

### Savant
- Nothing structural missing at class level (ASI 4/8/12/16/19, Extra Attack, slots match). Ardent Soul creation tables (below).

### Barbarian
- Path of the Storm Herald: Firestorm/Thunderstorm/Snowstorm options only summarized; Blade Master hews present as summary in "Masterful Hew" (R, check numbers). Shattered Mind spellcasting progression "third" present.
- class-table-check Barbarian "missing" lines are false positives (Danger Sense, Primal Knowledge, Fast Movement are granted at L2,3,5,7).

### Brawler
- None structural. Table (brawling die, spirit points, unarmored movement +10/15/20/25/30) matches ScaleValues; check-class-tables "+10.." flags are column noise.

### Rogue
- Nothing missing; Sneak Attack scale matches (2d6 L1 ... 12d6 L20); "Blind Sense" granted as Blindsense L14. Gadget Trickster: Stupefying Creation book L3 vs pack L6.

### All creation-granting subclasses (all classes)
Book tables of always-prepared creations are NOT wired: no ItemGrant/Spell advancement and no class-feature named "<X> Creations". Creations exist in creations pack unless noted. Files and tables (S2/...):
- Ardent Soul/{Burning Passion, Caustic Spite, Cold Indifference, Fulminating Glee, Mindful Insight, Necrotic Mania, Radiant Superiority, Thundering Resolve, Venomous Duality}.md: "Ardent Creations" at savant L2,5,9,13,17 (2 each) - 45 creations.
- Iron Defender/{Alchemist, Elementalist, Safeguard}.md; Specialist Paths/{Armorer, Artillerist, Battle Smith}.md: L3,5,9,13,17.
- Experimental Ooze/{Amputator, Plaguewright}.md; Medical Specialization/{Chemist, Physician}.md: L2,3,5,7,9 (verify against each file).
- Not in creations pack by name: Augury, Divination, Gentle Repose, Identification, Legend Lore (standard 5e), Storm Sphere.

### Generic features
- Present: Ability Score Improvement via class advancement (4/8/12/16/19; Fighter also 6,14; Brawler also 10); Extra Attack via scale (Fighter 5/11/20 = 2/3/4 attacks); Indomitable and Action Surge scales. Haki "Color of Armament Novice" granted L8/10/12/14/16 for every class but not in any Chapter 2 class table (confirm source in Haki chapter).

## Doubtful R: pack text diverges from book (needs diff, not absent)
A word-overlap check against the book found rewritten/condensed descriptions in Martial and Roguish archetypes (overlap <0.3): Champion (Signature Fighting Style, Physical Superiority options Strength/Constitution/Dexterity differ: book Athletics expertise, +size, hold breath etc.; pack gives flat bonuses), Wildcard (Risky Gambit, Willy-Nilly, Double Down), Gadget Trickster (Technique Thief, Crafty One), Thief (Outfoxing Action, Out Of Sight), Ringmaster (Circus Tricks, Master Director, Opening Act), Banneret (Brave and Bold), Bruiser (Bully Blitz, Street Rules), Assassin (Opportunist, Cloak-and-Dagger), Gadget Knight (War Mechanic, Improved Creative Combatant, Master of War), Blitzkrieg (Infinitesimal Instant, Rapid Action, Flashpoint, Supersonic), Inquisitive (Astute Eye, Interrogation Tactics, Decipher Deceit absent by name), Sawbones (Miracle Worker, Twisted Surgery), Samurai (Undying Devotion, Stance Improvements; "Fighting Stances" has 4 element stances to verify), Seeker, Master of None (Jury-Rigging, Rush Rampage, In and Out), Arms Dealer (Mastercrafted Shots, Advanced Arsenal), Gunslinger (Distinguished Shot, Sharp-Sighted, Bullet Time). Re-run S2 vs pack diff for these.
Other R: Spirit (Flurry of Blows, Patient Defense, Deft Escape only as text in "Spirit"), Deft Explorer options (Canny/Roving/Tireless inside feature text), Chemical Cocktail table inside "Chemical Cocktail", Armor Models (Guardian/Infiltrator), Mechanical Cannon (Protector etc.).

## Extra in pack, not in book Chapter 2
Marksman subclasses Swarmkeeper, Olympian, Guru, Nighthawk (no S2 file).
