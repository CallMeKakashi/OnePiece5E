// Reports which names in the supplied class lists have no matching creation (so they can be added or renamed).
import { unmatchedNames, spellListData } from "../data/src/spell-lists/index.ts";
for (const l of spellListData) console.log(l.identifier, l.creationIds.length, l.clean ? "clean" : "extracted");
console.log(JSON.stringify(unmatchedNames, null, 1));
