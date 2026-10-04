# work-E part 2 (text fidelity)

Comparer clean (only "15ft" vs "15 feet" token noise) for all 14 files. tsc errors in these fighter files (feat() missing advancement/activities, ScaleValueEntry faces) pre-exist, untouched.

## Fighter
- gadget-knight: all 6 features + intro restored. Spellcasting feature now holds table, tricks, preparing, ability text. War Mechanic = Kickback/Breakdown/Lockup (old fabricated armor/weapon augment removed). Creative Combatant, Recharging Surge, Improved CC, Master of War rewritten to book. Skipped nothing.
- gunslinger: all restored; all 14 trick shots text in Trick Shots description; book features Gunsmith (in Firearm Proficiency) and Hemorrhaging Critical (in Distinguished Shot) added to nearest ts feature (separate gunsmithDef/hemorrhagingDef live in class-content.ts, not touched). Bullet Time/Sharp-Sighted/Vicious Intent/Distinguished Shot were fabricated, replaced.
- master-of-none: Adapt and Overcome (in Improvised Weaponry, Improv Damage table 3/6/11/16), Breakdown, In and Out, Rush Rampage, Smash and Crash rewritten (fabricated). DISCREPANCY: createScaleValue "improvised-die" uses levels 3/7/11/17; book is 3/6/11/16.
- samurai: Bonus Proficiency (no ts feature, a trait advancement exists) + Fighting Stance text put in Fighting Stances; Elegant Courtier, Tireless Spirit, Stance Improvements, Undying Devotion rewritten (fabricated). Mechanics now differ from book wherever any activities/effects exist for stances (none in file).

## Barbarian
- berserker: already faithful, no change.
- blade-master, cannoneer, channeler: small phrase/intro fixes (chapter refs, Titan Monger, intros).
- shattered-mind: full Creativity text + level table, Monster Brain compulsion text, 2-paragraph intro.
- storm-herald: Raging Storm sensory text; all Firestorm/Thunderstorm/Snowstorm option texts completed.
- totem-warrior: flavor sentences in Primal Totem/Ancient Aspect, intro.
- forgemaster, pugilist, spirit-speaker: intro completions only (Spirit Speaker mechanics untouched).
Skipped: generic spellcasting boilerplate not applicable beyond what was included; no creation lists present in these book files.
