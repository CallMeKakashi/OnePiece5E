# Final report

## Sourcebook coverage (name-level)
- MISSING: 202
- NOT_APPLICABLE: 99
- AMBIGUOUS: 2
- EXACT: 457
- NEEDS_AUTOMATION: 13

## Foundry validation (static)
- Documents: 2047, internal links checked: 1957
- Errors: 0, warnings: 179 (mostly attack activities without an explicit attack block, and same-name features across classes)

## Automation (executed in the Foundry test world, dnd5e 5.1.10)
- Baseline activity-bearing items executed: 836 (870 activities); 13 first timed out on measured-template placement (harness limitation); all re-ran PASS once the harness skipped templates
- Monsters: 29/29 pass (HP/AC/CR vs stat block, attack roll bonus, damage)
- Ships and cannons: 16/16 pass
- Stable activity ids after embed: 844/844
- Limits: smoke-level for baseline content (activity runs without error); value assertions exist only for monsters, ships and cannons

## Regression vs baseline
- Baseline documents: 1973; preserved identical: 1971; changed: 2 (Manipulate Earth, Flaming Duality); regressed: 0; added: 74

## Remaining issues (9)
- **28 items** (devil-fruits): source gives prose powers with no dice/DCs/durations; no mechanics invented [blocked]
- **8 items** (ships): AC/HP/slots aligned to ship by table row order (source table has no row names) [blocked]
- **Ship stat rows** (ships): AC/HP/slots table in Cannons.md has no row names; aligned to ship table by order (8 rows = 8 ships, values plausible) [generated, needs confirmation]
- **Cannon availability rows** (ship-weapons): Clean and Reload / Ship Availability table has no row names; aligned to cannon table by order [generated, needs confirmation]
- **Ship speed units** (ships): Speeds are mph; stored as movement.swim with units mi. Foundry has no native mph unit [generated]
- **Lute** (items): Named in Bard starting equipment but absent from the Tools table; price/weight taken from 5e SRD (35 gp x10000) [generated, needs confirmation]
- **Ship Rooms / Upgrades** (-): Source text is column-scrambled (PDF extraction); room effects cannot be reconstructed reliably [blocked]
- **Creation creature sheets (Appendix A Actions)** (-): Stat lines scale with the creator's level and creation attack/save DC; need a scaling design decision [not generated]
- **midi-qol / chris-premades** (-): Installed versions require dnd5e >= 5.2 but the world runs 5.1.10, so Midi/CPR behaviour could not be tested [untested]
