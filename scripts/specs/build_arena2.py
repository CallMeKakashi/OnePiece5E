"""Builds specs/crowe-arena.json (circular seaprism arena) from polar geometry. Run: python scripts/specs/build_arena2.py
Angles are degrees clockwise from north, radii in squares from the pit centre. All vertices sit on 7.5 degree steps so shared edges match exactly."""
import json, math
from pathlib import Path
C = (30, 29)
def P(r, a): t = math.radians(a); return [round(C[0] + r * math.sin(t), 4), round(C[1] - r * math.cos(t), 4)]
def arc(r, a0, a1, step=7.5):
    n = round(abs(a1 - a0) / step); return [P(r, a0 + i * (a1 - a0) / n) for i in range(n + 1)]
def sector(a0, a1):
    return [P(r, a0) for r in (13, 17.5, 18.5, 22)] + arc(22, a0, a1)[1:] + [P(r, a1) for r in (18.5, 17.5, 13)] + arc(13, a1, a0)[1:-1]
def door(r0, a0, r1, a1, **kw): return {"a": P(r0, a0), "b": P(r1, a1), **kw}

reg, doors = [], []
# three stand sections A (east/south-east), B (south-west/west), C (north); the south gap between A and B is the main tunnel
for a, b in ((60, 172.5), (187.5, 300), (300, 420)): reg.append({"shape": "poly", "floor": "stone", "pts": sector(a, b)})
doors += [door(17.5, a, 18.5, a) for a in (60, 300)]                                                                # doors between sections
reg.append({"shape": "poly", "floor": "wood", "pts": arc(13, -22.5, 22.5) + arc(20, 22.5, -22.5)})                    # VIP box (sealed from the stands)
reg.append({"shape": "poly", "floor": "stone", "pts": arc(20, -7.5, 7.5) + arc(22, 7.5, -7.5)})                      # VIP private antechamber
doors += [door(20, 0, 20, 7.5), door(22, -7.5, 22, 0)]                                                              # VIP back door; antechamber to concourse
reg.append({"shape": "poly", "floor": "sand", "pts": arc(13, 0, 360)[:-1]})                                           # pit
# pit edges: seaprism gates and VIP bars are doors; every other pit edge is a low parapet (blocks movement, not sight)
gate_edges = {172.5, 180, 82.5, 90, 262.5, 270}
bars_edges = {337.5, 345, 352.5, 0, 7.5, 15}
for i in range(48):
    a = 7.5 * i
    if a in gate_edges: doors.append(door(13, a, 13, a + 7.5, seaprism=True, ang=a))
    elif a in bars_edges: doors.append(door(13, a, 13, a + 7.5, kind="bars", seaprism=True, ang=a))
    else: doors.append(door(13, a, 13, a + 7.5, kind="low", ang=a))
reg.append({"shape": "poly", "floor": "stone", "pts": [P(13, 172.5), P(13, 180), P(13, 187.5), P(17.5, 187.5), P(18.5, 187.5), P(22, 187.5), P(22, 180), P(22, 172.5), P(18.5, 172.5), P(17.5, 172.5)]})  # main tunnel
doors += [door(22, 172.5, 22, 180), door(22, 180, 22, 187.5)]                                                       # tunnel doors to the concourse
for g in (90, 270):                                                                                                   # side gates down to the holding level
    reg.append({"shape": "poly", "floor": "stone", "pts": [P(13, g - 7.5), P(13, g), P(13, g + 7.5), P(15, g + 7.5), P(15, g), P(15, g - 7.5)]})
# concourse: a full ring outside the stands (south half + north half), joined by open edges
reg.append({"shape": "poly", "floor": "stone", "pts": arc(25.5, 112.5, 247.5) + arc(22, 247.5, 112.5)})
reg.append({"shape": "poly", "floor": "stone", "pts": arc(25.5, 247.5, 472.5) + arc(22, 472.5, 247.5)})
doors += [{"a": P(22, 112.5), "b": P(25.5, 112.5), "kind": "open"}, {"a": P(22, 247.5), "b": P(25.5, 247.5), "kind": "open"}]
doors += [door(22, 120, 22, 127.5), door(22, 232.5, 22, 240), door(22, 322.5, 22, 330), door(22, 397.5, 22, 405)]    # stands doors: A, B, C west, C east
doors += [door(25.5, 262.5, 25.5, 270), door(25.5, 442.5, 25.5, 450), door(25.5, 360, 25.5, 367.5)]                  # street exits west, east, north
a165, a195 = P(25.5, 165), P(25.5, 195)
reg.append({"shape": "poly", "floor": "stone", "pts": [P(25.5, a) for a in (165, 172.5, 180, 187.5, 195)] + [[a195[0], 61], [28.5, 61], [31.5, 61], [a165[0], 61]]})  # entrance lobby
doors += [door(25.5, 172.5, 25.5, 180), door(25.5, 180, 25.5, 187.5), {"a": [28.5, 61], "b": [31.5, 61]}]            # lobby doors; main street door

decals = []
for lo, hi in ((65, 168), (192, 295), (305, 333), (387, 415)):
    for r in (14.4, 15.6, 16.8, 20.2, 21.2): decals.append({"kind": "seats", "x": C[0], "y": C[1], "r": r, "a0": lo, "a1": hi})
decals += [{"kind": "ring", "x": C[0], "y": C[1], "r": 8}, {"kind": "stain", "x": 26, "y": 27, "r": 1.6}, {"kind": "stain", "x": 34, "y": 32, "r": 1.2}]
decals += [{"kind": "stairs", "x": 43.1, "y": 27.5, "w": 1.8, "h": 3, "dir": "x"}, {"kind": "stairs", "x": 15.1, "y": 27.5, "w": 1.8, "h": 3, "dir": "x"},
           {"kind": "label", "x": 48, "y": 29, "text": "To holding", "size": int(26 * 2.4)}, {"kind": "label", "x": 12, "y": 29, "text": "To holding", "size": int(26 * 2.4)},
           {"kind": "label", "x": 30, "y": 58, "text": "ENTRANCE", "size": int(34 * 2.4)}, {"kind": "label", "x": 30, "y": 46, "text": "Main tunnel", "size": int(22 * 2.4)},
           {"kind": "ghost", "pts": arc(14.4, -15, 15) + arc(19, 15, -15), "label": ""}, {"kind": "label", "x": P(15.8, 0)[0], "y": P(15.8, 0)[1], "text": "Crawlspace (above)", "size": int(22 * 2.4)},
           {"kind": "label", "x": P(21, 0)[0], "y": P(21, 0)[1] + 0.2, "text": "VIP private", "size": int(18 * 2.4)}]
props = [{"kind": "statue", "x": P(17, 0)[0], "y": P(17, 0)[1] + 1.3, "r": 0.9}, {"kind": "brazier", "x": P(15, -12)[0], "y": P(15, -12)[1], "r": 0.45}, {"kind": "brazier", "x": P(15, 12)[0], "y": P(15, 12)[1], "r": 0.45}]
lights = [{"x": P(21.4, a)[0], "y": P(21.4, a)[1], "dim": 30, "bright": 12, "flicker": True} for a in range(30, 360, 60)]
lights += [{"x": P(15, -12)[0], "y": P(15, -12)[1], "dim": 18, "bright": 8, "flicker": True}, {"x": P(15, 12)[0], "y": P(15, 12)[1], "dim": 18, "bright": 8, "flicker": True},
           {"x": 30, "y": 58, "dim": 25, "bright": 10, "color": "#ffd080"}, {"x": 30, "y": 29, "dim": 60, "bright": 30, "color": "#cfeaf0"}]
base = {"cols": 60, "rows": 62, "px": 70, "entrance": [30, 58], "regions": reg, "doors": doors, "lights": lights,
        "overlays": [{"kind": "glass", "x": C[0], "y": C[1], "r": 22, "color": [120, 205, 210, 34], "struts": 24, "rings": [13, 17.5, 22]}]}
HOLE = (30, 35, 5.2)  # Kanto's breakout: radius 5.2 squares (~52 ft across) for a Gargantuan dragon
after_props = [{"kind": "rubble", "x": HOLE[0], "y": HOLE[1], "r": HOLE[2] + 2, "n": 60}, {"kind": "rubble", "x": 21, "y": 24, "r": 2, "n": 14}, {"kind": "rubble", "x": 39, "y": 27, "r": 2, "n": 14},
               {"kind": "rubble", "x": 24, "y": 40, "r": 1.6, "n": 10}, {"kind": "rubble", "x": 18.5, "y": 18, "r": 1.6, "n": 8}, {"kind": "rubble", "x": 41, "y": 36, "r": 1.6, "n": 8}]
import random
def solid(x, y, r, seed):  # an irregular boulder: drawn prop + a closed "block" wall so it stops movement and sight (real cover)
    rnd = random.Random(seed); pts = []
    for i in range(8): t = 2 * math.pi * i / 8 + rnd.uniform(-.2, .2); k = r * rnd.uniform(.72, 1.1); pts.append([round(x + k * math.cos(t), 3), round(y + k * math.sin(t), 3)])
    return {"kind": "boulder", "pts": pts}, {"pts": pts, "closed": True, "type": "block"}
def at(r, a): return P(r, a)
BROKEN = {22.5, 30, 105, 112.5, 142.5, 150, 202.5, 210, 217.5, 232.5, 292.5, 300}
plugs = [(*at(14.6, 180), 1.9), (*at(14.2, 174), 1.1), (*at(14.2, 186), 1.1), (*at(14, 90), 1.5), (*at(14, 270), 1.5),                              # pit gates
         (*at(20.5, 176), 1.6), (*at(20.5, 184), 1.6), (*at(21.2, 180), 1.4),                                                                      # main tunnel
         (*at(21, 123.75), 1.3), (*at(21, 236.25), 1.3), (*at(21, 326.25), 1.3), (*at(21, 41.25), 1.3),                                            # stand doors to the concourse
         (*at(24.3, 266.25), 1.5), (*at(24.3, 86.25), 1.5), (*at(24.3, 3.75), 1.5), (30, 59.6, 1.9), (*at(24.4, 180), 1.6), (*at(19.2, 3.75), 1.2)]  # street exits, lobby, VIP back door
cover = [(21, 22, 1.3), (27, 17, 1.0), (34, 19, 1.5), (40, 24, 1.1), (19, 29, 1.2), (41, 32, 1.4), (23, 38, 1.1), (36, 39, 1.2), (30, 24, 1.0), (25, 28, 0.9),  # pit cover
         (*at(16.5, 50), 1.1), (*at(18, 140), 1.0), (*at(16, 210), 1.1), (*at(17, 330), 1.1), (*at(18, 30), 1.0), (*at(16, -12), 1.0), (*at(17, 10), 1.2), (28.3, 12.2, 1.3)]  # stands + VIP
bld, blk = [], []
for n, (x, y, r) in enumerate(plugs + cover): pr, w = solid(x, y, r, n); bld.append(pr); blk.append(w)
rnd = random.Random(7); piles = []
while len(piles) < 16:
    x, y = rnd.uniform(18, 42), rnd.uniform(17, 41)
    if math.hypot(x - C[0], y - C[1]) < 11.5 and math.hypot(x - HOLE[0], y - HOLE[1]) > HOLE[2] + 1: piles.append({"kind": "rubble", "x": round(x, 2), "y": round(y, 2), "r": round(rnd.uniform(1.1, 2.2), 2), "n": rnd.randint(10, 16)})
piles += [{"kind": "rubble", "x": at(r, a)[0], "y": at(r, a)[1], "r": 1.4, "n": 10} for r, a in ((16, 80), (18.5, 160), (15, 250), (19, 285), (17, 345), (18, 20), (21, 110), (21, 250))]
shards = [{"kind": "shards", "x": x, "y": y, "r": r, "n": 40} for x, y, r in ((25, 23, 6), (36, 30, 6), (30, 18, 5), (21, 34, 5), (30, 13.5, 4), *[(*at(18, a), 3.5) for a in (60, 120, 240, 330)])]
doors_after = []
for d in doors:
    d = dict(d)
    if d.get("kind") == "bars" or (d.get("seaprism") and "kind" not in d and "ang" in d) or (d.get("kind") == "low" and d.get("ang") in BROKEN): d["kind"] = "open"  # bars and gates shattered, rim cracked open
    doors_after.append(d)
after = {**base, "doors": doors_after, "sealed": True, "walls": blk, "decals": decals + [{"kind": "hole", "x": HOLE[0], "y": HOLE[1], "r": HOLE[2]}] + shards,
         "props": props + after_props + piles + bld, "overlays": [{"kind": "glass", "x": C[0], "y": C[1], "r": 22, "color": [120, 205, 210, 18], "struts": 10, "rings": []}]}
after.pop("entrance")
variants = {"Before": {**base, "decals": decals, "props": props}, "After": after}
for tag, sp in variants.items():
    Path(__file__).with_name(f"crowe-arena-{tag.lower()}.json").write_text(json.dumps({"name": f"Crowe's Arena (Seaprism) - {tag}", **sp}))
print(len(reg), "regions", len(doors), "doors; wrote before and after")
