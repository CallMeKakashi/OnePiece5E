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
    if a in gate_edges: doors.append(door(13, a, 13, a + 7.5, seaprism=True))
    elif a in bars_edges: doors.append(door(13, a, 13, a + 7.5, kind="bars", seaprism=True))
    else: doors.append(door(13, a, 13, a + 7.5, kind="low"))
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
decals += [{"kind": "ring", "x": C[0], "y": C[1], "r": 8}, {"kind": "stain", "x": 26, "y": 27, "r": 1.6}, {"kind": "stain", "x": 34, "y": 32, "r": 1.2}, {"kind": "hole", "x": 30, "y": 36, "r": 1.9}]
decals += [{"kind": "stairs", "x": 43.1, "y": 27.5, "w": 1.8, "h": 3, "dir": "x"}, {"kind": "stairs", "x": 15.1, "y": 27.5, "w": 1.8, "h": 3, "dir": "x"},
           {"kind": "label", "x": 48, "y": 29, "text": "To holding", "size": int(26 * 2.4)}, {"kind": "label", "x": 12, "y": 29, "text": "To holding", "size": int(26 * 2.4)},
           {"kind": "label", "x": 30, "y": 58, "text": "ENTRANCE", "size": int(34 * 2.4)}, {"kind": "label", "x": 30, "y": 46, "text": "Main tunnel", "size": int(22 * 2.4)},
           {"kind": "ghost", "pts": arc(14.4, -15, 15) + arc(19, 15, -15), "label": ""}, {"kind": "label", "x": P(15.8, 0)[0], "y": P(15.8, 0)[1], "text": "Crawlspace (above)", "size": int(22 * 2.4)},
           {"kind": "label", "x": P(21, 0)[0], "y": P(21, 0)[1] + 0.2, "text": "VIP private", "size": int(18 * 2.4)}]
props = [{"kind": "statue", "x": P(17, 0)[0], "y": P(17, 0)[1] + 1.3, "r": 0.9}, {"kind": "brazier", "x": P(15, -12)[0], "y": P(15, -12)[1], "r": 0.45}, {"kind": "brazier", "x": P(15, 12)[0], "y": P(15, 12)[1], "r": 0.45},
         {"kind": "rubble", "x": 30, "y": 36, "r": 2.4, "n": 18}]
lights = [{"x": P(21.4, a)[0], "y": P(21.4, a)[1], "dim": 30, "bright": 12, "flicker": True} for a in range(30, 360, 60)]
lights += [{"x": P(15, -12)[0], "y": P(15, -12)[1], "dim": 18, "bright": 8, "flicker": True}, {"x": P(15, 12)[0], "y": P(15, 12)[1], "dim": 18, "bright": 8, "flicker": True},
           {"x": 30, "y": 58, "dim": 25, "bright": 10, "color": "#ffd080"}, {"x": 30, "y": 29, "dim": 60, "bright": 30, "color": "#cfeaf0"}]
spec = {"name": "Crowe's Arena (Seaprism)", "cols": 60, "rows": 62, "px": 70, "entrance": [30, 58], "regions": reg, "doors": doors, "decals": decals, "props": props, "lights": lights,
        "overlays": [{"kind": "glass", "x": C[0], "y": C[1], "r": 22, "color": [120, 205, 210, 34], "struts": 24, "rings": [13, 17.5, 22]}]}
Path(__file__).with_name("crowe-arena.json").write_text(json.dumps(spec))
print(len(reg), "regions", len(doors), "doors")
