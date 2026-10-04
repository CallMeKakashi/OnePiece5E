# Work D: verification and fixes

## (1) Subclass feature levels, all 80 subclasses
Method: parsed packs-src/subclasses ItemGrant/ItemChoice levels (names resolved from all packs) against every `#####` feature heading in the book subclass md (first "Nth level" mention in the body); then compared the set of book levels with the set of pack levels; then read all headings with no level in the first 500 chars.
Result: no new mismatches. W2's fixes (Blitzkrieg, Master of None, Gadget Trickster) are all that exist. Remaining diffs are noise, verified by reading the files:
- Pack-only levels (2,3,5,7,9,13,17...) are always-prepared creation grants (Ardent Soul, Specialist Paths, Medical/Experimental Ooze), correct per tables.
- Blade Master / Storm Herald: "10th level" / "5th" are in-text improvements of options granted at 3 (no separate grant needed).
- Six Powers Master (pack L6 = remaining techniques, per book), Bounty Hunter (pack L11 = improvements text, per book).
- Samurai/Cavalier Bonus Proficiency exist as Trait choices at 3. Gadget Knight/Trickster/Shattered Mind/Expressionist spellcasting headings are noise (book "and Casting Spells)" parse).
- Battle Smith: book file is truncated after United Front (L5); pack has Power Jolt L9 and Improved Defender L15 from the standard 5e Battle Smith (not in the vault book, left in place).
- Book typos: "Legendary Floursih", "Depcipher Deceit".
Fixed: none needed.

## (2) Class tables (all 9 classes vs Sourcebook/Chapter 2 Classes/<Class>/<Class>.md)
Re-read every table and compared against packs-src/classes: ASI levels (all classes 4/8/12/16/19; Fighter +6,14; Brawler and Rogue +10 as in book), subclass level (Savant 1, Medic 2, others 3), subclass-feature levels, scale values (Rage count, Brutal Critical 1/2/3 at 9/13/17, Sneak Attack 2d6..12d6 incl. L16/L18/L20, Brawling die d6/d8/d10/d12 at 1/6/11/16, Spirit points 2..20, Unarmored Movement +10/15/20/25/30, Bardic Inspiration and Harmonic Vitality dice, Favored Mark dice, tricks known, Mods known/active 4/6/8/10/12 and 2..6, Fighter Extra Attack/Indomitable/Action Surge), spell slots (Bard/Medic full, Marksman/Savant half, Gadgeteer artificer; each of the 20 rows checked vs the book columns), feature levels (granted-list per level).
Claim "Bard/Brawler/Barbarian/Rogue missing lines are parse noise": CONFIRMED. Bard L20 = slot-column spill; Brawler "+10..+30" = Unarmored column; Barbarian "Danger 2 Sense / Primal 3 Knowledge / Fast 3 Movement / Primal 4 Knowledge" = wrapped names + Rages column (features are granted at 2/3/5/7); Rogue "Blind Sense" = Blindsense L14.
Real gaps: none. Notes: Gadgeteer High-Tech Development is one feature (L11) whose text covers L13/15/17 grants; Color of Armament Novice at 8/10/12/14/16 is on every class but is not in any class table (Haki chapter, unchanged).
Fixed (text): Ardent Smite now carries the Ardent Soul Element table (damage type per subclass) which was referenced but missing (data/src/class-features/savant.ts). Improved Ardent Smite refers to it.

## (3) Class creation lists (spell-lists/class-lists.txt)
- `check-spell-lists` (run with tsx): all 5 lists (bard 211, savant 88, medic 195, gadgeteer 270, marksman 164) match compendium creations with zero unmatched names.
- Level counts of class-lists.txt equal the compendium creation levels for every list, except Gadgeteer "Wall of Lightning": list puts it at 5th, compendium and the description file (6th level) say 6th. The book's own Gadgeteer list (Creations.md) also prints it under 5th, so left as printed.
- The book fragments (Creation Lists/*.md) are scrambled two-column text with page spill-over between classes (e.g. Medic file starts with Marksman 3rd-level Barrage/Blooming Jam/Blazing Stride/Clairvoyance; Creations.md = Gadgeteer list with Bard 5th-9th spill). Pooled check: every creation name found in any Creation Lists file appears in at least one class list; per-class: bard, savant, marksman have nothing in-book-missing-from-list; medic and gadgeteer only page-spill names. Gadgeteer and Marksman lists exist in the vault only as fragments, so they rest on the owner's paste.
- No additions needed. Creations in no class list (subclass-only or never listed): Trap Sense (L0), Augury (R), Sending, Divination (R), Secret Passage, Sickening Radiance, Awaken, Legend Lore (R), Scrying, and a typo duplicate "Vitrolic Sphere" (L4) next to "Vitriolic Sphere" (data/src/creations/level-4.ts, not my file: merge or delete).
- Edited data/src/spell-lists/index.ts: the five clean lists no longer say "Auto-extracted, may be incomplete" (description and flag note now say DM-supplied and cross-checked); automation flag value left NEEDS_REVIEW.

## (4) Garbled rulings Cri / Par / Sta
No PDF of the sourcebook exists anywhere in C:\bb (only character sheets/backstories). The md files are 1-6 character line stubs, unrecoverable. Wrote best-guess identification in reports/garbled-rulings.md (Cri = critical hits?, Par = party/race diversity?, Sta = starting powers/level?). Owner must supply the PDF page (printed p. 388) or retype.

## (5) Completeness audit rerun
`node scripts/audit-sourcebook-completeness.mjs`: 706 files, 2636 titles, 1692 matched, 890 unmatched (unchanged in character; Appendix B 81 unmatched because the reference pack pages are named per file, so headings inside them do not match by name; they are present as page text).
Triaged against triage A-D and work-W1..W5/C. Everything mechanical is claimed (W1 origins/races, W2 subclass/creation grants, W3 maneuvers/shots/ammo/mods/summons/augmentations, W4 ship rooms/upgrades/provisions/ranked gear, W5 reference journals, Ch6 rules feats, fruits, great beasts, C wizard). No NEW mechanical title found.
Leftovers (not claimed by any work report):
1. Subclass text divergence (triage A "Doubtful R"): condensed/rewritten text vs book in Wildcard (Risky Gambit d100 table of ~100 effects is absent, Volatile Damage d6 table absent; pack says effects last to end of next turn and uses PB/long rest, book says once per turn, DC 8+Dex+PB, concentration), Champion (Physical Superiority options), Thief, Ringmaster, Banneret, Bruiser, Assassin, Gadget Knight, Blitzkrieg, Inquisitive, Sawbones, Samurai stances, Seeker, Master of None (Adapt and Overcome, Improv Damage d6/d8/d10/d12 at 3/6/11/16), Arms Dealer, Gunslinger. Needs a text-level re-sync of data/src/subclasses/*.ts (out of my "levels only" scope).
2. Experimental Ooze Type table (Acid/Cold/Fire/Poison/Lightning bonuses) in Chemist/Bio-Engineer: only the Acid line verified in feature "Experimental Ooze"; verify the rest (and Experimental Ooze Type list in Medical Specialization/Chemist.md).
3. Ch2 per-class `Hit Points/Proficiencies/Equipment` prose is not in the vault (class md hold only tables).
4. Class feature option lists "Canny/Roving/Tireless" and Spirit options (Flurry of Blows, Patient Defense, Deft Escape) exist as feature text only (no activities).
5. Pre-existing tsc errors in data/src/subclasses/* and class-features/savant-styles.ts (missing advancement/activities, ScaleValueEntry.faces) come from concurrent work by other agents; my two edited files compile clean.
