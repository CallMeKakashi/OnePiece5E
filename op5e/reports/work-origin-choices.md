# Origin choices in class data

Changed:
- data/helpers/origin-choices.ts (new): createOriginChoices(classId) -> ItemChoice "Role" (10 role docs, backgrounds pack) and "Devil Fruit" (4 templates, devil-fruits pack, itemType loot, restriction type ""), both level 1, count 1.
- data/src/classes/*.ts (all 9): import + `...createOriginChoices(ID)` after Haki choices.
- data/src/devil-fruits/templates.ts (new) + index.ts: Paramecia/Zoan/Logia Devil Fruit (Template), No Devil Fruit (yet); level tables reused from feats/sourcebook-rules.ts.
- data/src/backgrounds/roles.ts: role advancements (Trait/ItemGrant/ItemChoice) moved from level 0 to 1 (ItemChoice choices key 0->1).
- data/src/class-features/haki.ts: 15 tiers set system.identifier = slug and system.prerequisites {level 8/10/12/14/16, items [previous tier], repeatable false}.
- data/schemas/feature.ts: zod schema stripped unknown keys; added optional identifier + prerequisites.
- data/helpers/haki-advancement.ts: Haki ItemChoice restriction.type "" (was "feat"; Haki feats are type.value "class", dnd5e _validateItemType would have rejected them).

Verified (build: 0 errors, 2301 items): each class has Role pool 10, Devil Fruit pool 4 (uuids resolve to real docs), 5 Haki ItemChoices (8/10/12/14/16, pool 15 each); 15 Haki feats carry identifier + prerequisites; flags.op5e.prereq level agrees, manual texts kept (Conqueror "Special").

Notes/unresolved:
- Role nested flows: non-class items run flows from level 0..character level, so level 1 fires inside the class level-1 flow (read from dnd5e.mjs; not run in Foundry).
- Role "bonus feat" ItemChoice nested inside a role, itself granted by a ItemChoice: dnd5e nested-grant depth not tested live.
- Scripts that still import roles separately (W-scripts side) must stop, or the role is granted twice.
- Conqueror's "Special" requirement is DM-approved, not enforced.
