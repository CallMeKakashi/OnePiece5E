import { summon, type SummonVariant } from "./make.js";
import { undeadAndBeasts } from "./undead-beasts.js";
import { families as a } from "./group-a.js";
import { families as b } from "./group-b.js";
import { families as c } from "./group-c.js";
import { families as d } from "./group-d.js";

const families: [string, SummonVariant[]][] = [...undeadAndBeasts, ...a, ...b, ...c, ...d];
export default families.flatMap(([file, vs]) => vs.map((v) => summon(v, file)));
