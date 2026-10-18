"""Builds specs/crowe-arena.json (circular seaprism arena) from polar geometry. Run: python scripts/specs/build_arena2.py"""
import json, math
from pathlib import Path
C = (30, 29)
def P(r, a): t = math.radians(a); return [round(C[0] + r * math.sin(t), 4), round(C[1] - r * math.cos(t), 4)]
def arc(r, a0, a1, step=7.5):
    n = round(abs(a1 - a0) / step); return [P(r, a0 + i * (a1 - a0) / n) for i in range(n + 1)]
def sector(a0, a1):
    return [P(r, a0) for r in (13, 17.5, 18.5, 22)] + arc(22, a0, a1)[1:] + [P(r, a1) for r in (18.5, 17.5, 13)] + arc(13, a1, a0)[1:-1]
reg = [{"shape": "poly", "floor": "stone", "pts": sector(a, a + 120)} for a in (60, 180, 300)]
reg.append({"shape": "poly", "floor": "wood", "pts": arc(13, -22.5, 22.5) + arc(20, 22.5, -22.5)})                    # VIP box
reg.append({"shape": "poly", "floor": "sand", "pts": arc(13, 0, 360)[:-1]})                                           # pit
doors = [{"a": P(17.5, a), "b": P(18.5, a)} for a in (60, 180, 300)]                                                  # doors between sections
doors += [{"a": P(22, 120), "b": P(22, 127.5)}, {"a": P(22, 232.5), "b": P(22, 240)}]                                  # walkway -> stands
for g in (90, 270):                                                                                                   # seaprism gates + alcoves
    doors += [{"a": P(13, g - 7.5), "b": P(13, g), "seaprism": True}, {"a": P(13, g), "b": P(13, g + 7.5), "seaprism": True}]
    reg.append({"shape": "poly", "floor": "stone", "pts": [P(13, g - 7.5), P(13, g), P(13, g + 7.5), P(15, g + 7.5), P(15, g), P(15, g - 7.5)]})
v = arc(13, -22.5, 22.5); doors += [{"a": v[i], "b": v[i + 1], "kind": "bars", "seaprism": True} for i in range(6)]    # VIP seaprism bars
reg.append({"shape": "poly", "floor": "stone", "pts": arc(25.5, 112.5, 247.5) + arc(22, 247.5, 112.5)})              # two walkways (semicircle)
a165, a195 = P(25.5, 165), P(25.5, 195)
reg.append({"shape": "poly", "floor": "stone", "pts": [P(25.5, a) for a in (165, 172.5, 180, 187.5, 195)] + [[a195[0], 61], [28.5, 61], [31.5, 61], [a165[0], 61]]})  # entrance lobby
doors += [{"a": P(25.5, 172.5), "b": P(25.5, 180)}, {"a": P(25.5, 180), "b": P(25.5, 187.5)}, {"a": [28.5, 61], "b": [31.5, 61]}]
decals = []
for a0, a1 in ((65, 175), (185, 295), (305, 333), (27, 55 + 360 - 360 + 0)):
    pass
for lo, hi in ((65, 175), (185, 295), (305, 333), (387, 415)):
    for r in (14.4, 15.6, 16.8, 20.2, 21.2):
        decals.append({"kind": "seats", "x": C[0], "y": C[1], "r": r, "a0": lo, "a1": hi})
decals += [{"kind": "ring", "x": C[0], "y": C[1], "r": 8}, {"kind": "stain", "x": 26, "y": 27, "r": 1.6}, {"kind": "stain", "x": 34, "y": 32, "r": 1.2}, {"kind": "hole", "x": 30, "y": 36, "r": 1.9}]
props = [{"kind": "statue", "x": P(17, 0)[0], "y": P(17, 0)[1], "r": 0.9}, {"kind": "brazier", "x": P(15, -12)[0], "y": P(15, -12)[1], "r": 0.45}, {"kind": "brazier", "x": P(15, 12)[0], "y": P(15, 12)[1], "r": 0.45},
         {"kind": "rubble", "x": 30, "y": 36, "r": 2.4, "n": 18}]
lights = [{"x": P(21.4, a)[0], "y": P(21.4, a)[1], "dim": 30, "bright": 12, "flicker": True} for a in range(30, 360, 60)]
lights += [{"x": P(15, -12)[0], "y": P(15, -12)[1], "dim": 18, "bright": 8, "flicker": True}, {"x": P(15, 12)[0], "y": P(15, 12)[1], "dim": 18, "bright": 8, "flicker": True},
           {"x": 30, "y": 58, "dim": 25, "bright": 10, "color": "#ffd080"}, {"x": 30, "y": 29, "dim": 60, "bright": 30, "color": "#cfeaf0"}]
spec = {"name": "Crowe's Arena (Seaprism)", "cols": 60, "rows": 62, "px": 70, "entrance": [30, 58], "regions": reg, "doors": doors, "decals": decals, "props": props, "lights": lights,
        "overlays": [{"kind": "glass", "x": C[0], "y": C[1], "r": 22, "color": [120, 205, 210, 34], "struts": 24, "rings": [13, 17.5, 22]}]}
Path(__file__).with_name("crowe-arena.json").write_text(json.dumps(spec))
print(len(reg), "regions", len(doors), "doors")
