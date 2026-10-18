"""Battlemap generator: spec JSON -> <out>/<slug>.png + <slug>.scene.json (walls, doors, lights in Foundry scene format).

Usage: python scripts/mapgen.py specs/arena.json <out-dir>

Spec (units are grid squares, 1 square = 5 ft):
  name, cols, rows, px (pixels per square, default 100)
  regions: [{shape: rect|ellipse|poly, ...coords, floor: stone|wood|dirt|sand|water|metal, wall: bool}]
           rect: x,y,w,h   ellipse: cx,cy,rx,ry   poly: pts [[x,y],...]
  walls:   [{pts: [[x,y],...], closed: bool, type: wall|window|invisible}]   extra wall lines
  doors:   [{a:[x,y], b:[x,y], secret: bool, kind: door|bars}]   a/b must be an edge of a region (add the vertices)
  decals:  [{kind: stain|ring|hole, x,y,r}]                      painted on the floor, under props
  props:   [{kind: pillar|statue|barrel|crate|brazier|rubble|circle|rect|bars, x,y,w,h,r,n}]
  lights:  [{x,y, dim, bright, color, flicker: bool}]
"""
import json, math, random, sys
from pathlib import Path
from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageOps

FLOORS = {"stone": (104, 98, 92), "wood": (118, 82, 50), "dirt": (112, 86, 60), "sand": (200, 172, 122), "water": (46, 92, 124), "metal": (88, 96, 104)}
INK = (14, 12, 14)


def vnoise(W, H, cell, rnd):
    w, h = W // cell + 2, H // cell + 2
    return Image.frombytes("L", (w, h), rnd.randbytes(w * h)).resize((w * cell, h * cell), Image.BICUBIC).crop((0, 0, W, H)).filter(ImageFilter.GaussianBlur(cell * .35))  # blur hides the cell grid


def colorize(lum, base, lo=0.66, hi=1.24):
    return ImageOps.colorize(lum, tuple(int(c * lo) for c in base), tuple(min(255, int(c * hi)) for c in base), mid=base).convert("RGBA")


def floor_texture(kind, W, H, px, rnd):
    lum = ImageOps.autocontrast(Image.blend(Image.blend(vnoise(W, H, px * 2, rnd), vnoise(W, H, px // 2, rnd), 0.45), vnoise(W, H, max(4, px // 8), rnd), 0.35), cutoff=2)
    img = colorize(lum, FLOORS[kind])
    ov = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(ov)
    if kind in ("stone", "metal"):
        s = px if kind == "stone" else px // 2
        for row, y in enumerate(range(0, H, s)):
            x = -(s // 2) * (row % 2)
            while x < W:
                w = s + rnd.randint(-s // 8, s // 5)
                d.rectangle([x, y, x + w, y + s], fill=(255, 255, 255, rnd.randint(0, 26)) if rnd.random() < .5 else (0, 0, 0, rnd.randint(0, 34)))
                d.rectangle([x, y, x + w, y + s], outline=(24, 22, 22, 150), width=3)
                d.line([(x + 3, y + 3), (x + w - 3, y + 3)], fill=(255, 255, 255, 38), width=2)
                if kind == "metal": d.ellipse([x + 6, y + 6, x + 12, y + 12], fill=(30, 30, 34, 200))
                x += w
    elif kind == "wood":
        pw = px // 4
        for row, y in enumerate(range(0, H, pw)):
            x = -rnd.randint(0, px)
            while x < W:
                w = rnd.randint(px, px * 3)
                d.rectangle([x, y, x + w, y + pw], fill=(0, 0, 0, rnd.randint(0, 46)) if rnd.random() < .6 else (255, 220, 160, rnd.randint(0, 24)))
                d.rectangle([x, y, x + w, y + pw], outline=(30, 18, 8, 190), width=2)
                for _ in range(2):
                    gy = y + rnd.randint(4, pw - 4); d.line([(x + 4, gy), (x + w - 4, gy + rnd.randint(-2, 2))], fill=(40, 24, 10, 70), width=1)
                for nx in (x + 8, x + w - 8): d.ellipse([nx, y + pw // 2 - 2, nx + 4, y + pw // 2 + 2], fill=(20, 14, 8, 180))
                x += w
    else:  # sand / dirt / water: soft blotches and drag marks
        for _ in range(W * H // 40000):
            cx, cy, r = rnd.randrange(W), rnd.randrange(H), rnd.randint(px // 3, px * 2)
            d.ellipse([cx - r, cy - r // 2, cx + r, cy + r // 2], fill=(0, 0, 0, rnd.randint(8, 22)) if rnd.random() < .6 else (255, 240, 200, rnd.randint(8, 20)))
        for _ in range(W * H // 120000):
            cx, cy = rnd.randrange(W), rnd.randrange(H); dx = rnd.randint(px, px * 3)
            d.line([(cx, cy), (cx + dx, cy + rnd.randint(-12, 12))], fill=(0, 0, 0, 22), width=rnd.randint(2, 5))
        ov = ov.filter(ImageFilter.GaussianBlur(3))
    return Image.alpha_composite(img, ov)


def region_pts(r):
    s = r["shape"]
    if s == "rect": x, y, w, h = r["x"], r["y"], r["w"], r["h"]; return [(x, y), (x + w, y), (x + w, y + h), (x, y + h)]
    if s == "ellipse":
        n = max(16, int(max(r["rx"], r["ry"]) * 4))
        return [(r["cx"] + r["rx"] * math.cos(2 * math.pi * i / n), r["cy"] + r["ry"] * math.sin(2 * math.pi * i / n)) for i in range(n)]
    return [tuple(p) for p in r["pts"]]


def sphere(d, x, y, r, dark, light, steps=14):
    for i in range(steps):
        t = i / (steps - 1); rr = r * (1 - t * .85); o = r * .3 * t
        d.ellipse([x - rr - o, y - rr - o, x + rr - o, y + rr - o], fill=tuple(int(a + (b - a) * t) for a, b in zip(dark, light)))


def silhouette(d, p, px):  # white shape for the cast shadow
    k, x, y = p["kind"], p.get("x", 0) * px, p.get("y", 0) * px; r = p.get("r", .5) * px; w, h = p.get("w", 1) * px, p.get("h", 1) * px
    if k in ("rect", "crate"): d.rectangle([x, y, x + w, y + h], fill=255)
    elif k == "statue": d.rectangle([x - r, y - r, x + r, y + r], fill=255)
    elif k == "rubble":
        rnd = random.Random(int(x * 7 + y))
        for _ in range(int(p.get("n", 9))): a, b, s = x + rnd.uniform(-r, r), y + rnd.uniform(-r, r), rnd.uniform(.12, .32) * px; d.ellipse([a - s, b - s, a + s, b + s], fill=255)
    elif k != "bars": d.ellipse([x - r, y - r, x + r, y + r], fill=255)


def draw_prop(d, p, px):
    k, x, y = p["kind"], p.get("x", 0) * px, p.get("y", 0) * px; r = p.get("r", .5) * px; w, h = p.get("w", 1) * px, p.get("h", 1) * px
    if k == "pillar":
        sphere(d, x, y, r, (70, 66, 64), (150, 144, 138)); d.ellipse([x - r, y - r, x + r, y + r], outline=INK, width=4)
    elif k == "statue":
        d.rectangle([x - r, y - r, x + r, y + r], fill=(112, 108, 104), outline=INK, width=4); d.rectangle([x - r + 8, y - r + 8, x + r - 8, y + r - 8], outline=(150, 146, 140), width=2)
        sphere(d, x, y + r * .1, r * .62, (96, 96, 102), (190, 188, 184)); sphere(d, x, y - r * .1, r * .3, (110, 110, 116), (214, 212, 208))
        d.line([(x - r * .3, y - r * .6), (x - r * .05, y), (x + r * .25, y + r * .35)], fill=(40, 38, 40), width=3)  # crack
    elif k == "barrel":
        sphere(d, x, y, r, (70, 44, 22), (156, 108, 62)); d.ellipse([x - r, y - r, x + r, y + r], outline=INK, width=3)
        for f in (.62, .34): d.ellipse([x - r * f, y - r * f, x + r * f, y + r * f], outline=(46, 40, 38), width=3)
    elif k == "brazier":
        d.ellipse([x - r, y - r, x + r, y + r], fill=(46, 44, 46), outline=INK, width=4); sphere(d, x, y, r * .72, (150, 40, 10), (255, 190, 70))
    elif k == "crate":
        d.rectangle([x, y, x + w, y + h], fill=(124, 88, 50), outline=INK, width=4)
        for f in (.33, .66): d.line([(x + 4, y + h * f), (x + w - 4, y + h * f)], fill=(70, 46, 24), width=3)
        d.line([(x + 6, y + 6), (x + w - 6, y + h - 6)], fill=(82, 54, 28), width=4); d.line([(x + w - 6, y + 6), (x + 6, y + h - 6)], fill=(82, 54, 28), width=4)
        d.rectangle([x + 3, y + 3, x + w - 3, y + h - 3], outline=(160, 120, 74), width=2)
    elif k == "rubble":
        rnd = random.Random(int(x * 7 + y))
        for _ in range(int(p.get("n", 9))):
            a, b, s = x + rnd.uniform(-r, r), y + rnd.uniform(-r, r), rnd.uniform(.1, .3) * px; g = rnd.randint(86, 132)
            pts = [(a + s * math.cos(t) * rnd.uniform(.6, 1.1), b + s * math.sin(t) * rnd.uniform(.6, 1.1)) for t in [i * 2 * math.pi / 6 + rnd.uniform(-.3, .3) for i in range(6)]]
            d.polygon(pts, fill=(g, g - 4, g - 8), outline=(30, 28, 28)); d.line([pts[0], pts[1], pts[2]], fill=(min(255, g + 50),) * 3, width=2)
    elif k == "bars":
        n = int(w / (.2 * px)) if w >= h else int(h / (.2 * px))
        for i in range(n + 1):
            a = (x + i * w / n, y, x + i * w / n, y + h) if w >= h else (x, y + i * h / n, x + w, y + i * h / n)
            d.line(a, fill=(24, 24, 28), width=8); d.line(a, fill=(120, 124, 132), width=3)
    elif k == "rect":
        d.rectangle([x, y, x + w, y + h], fill=(130, 96, 56), outline=INK, width=4)
    else:
        sphere(d, x, y, r, (110, 88, 54), (176, 146, 96)); d.ellipse([x - r, y - r, x + r, y + r], outline=INK, width=3)


def draw_decal(layer, dc, px):
    d = ImageDraw.Draw(layer); x, y, r = dc["x"] * px, dc["y"] * px, dc.get("r", 1) * px; k = dc["kind"]
    if k == "stain":
        rnd = random.Random(int(x + y))
        for _ in range(7): a, b, s = x + rnd.uniform(-r, r) * .6, y + rnd.uniform(-r, r) * .6, rnd.uniform(.25, .7) * r; d.ellipse([a - s, b - s, a + s, b + s], fill=(80, 22, 20, 90))
    elif k == "ring":
        d.ellipse([x - r, y - r, x + r, y + r], outline=(120, 92, 56, 150), width=14); d.ellipse([x - r + 14, y - r + 14, x + r - 14, y + r - 14], outline=(236, 210, 160, 90), width=4)
    elif k == "hole":
        for i in range(12): t = i / 11; rr = r * (1 - t * .8); d.ellipse([x - rr, y - rr, x + rr, y + rr], fill=(int(70 * (1 - t) + 6), int(52 * (1 - t) + 4), int(36 * (1 - t) + 6), 255))


def main(spec_path, out_dir):
    spec = json.loads(Path(spec_path).read_text(encoding="utf-8"))
    px, cols, rows = spec.get("px", 100), spec["cols"], spec["rows"]
    W, H = cols * px, rows * px
    rnd = random.Random(spec["name"]); doors = spec.get("doors", [])
    P = lambda pts: [(x * px, y * px) for x, y in pts]
    img = colorize(ImageOps.autocontrast(Image.blend(vnoise(W, H, px, rnd), vnoise(W, H, px // 3, rnd), .5)), (34, 32, 38), .55, 1.35)  # solid rock
    textures, floormask, segs = {}, Image.new("L", (W, H), 0), []
    for r in spec["regions"]:
        pts = region_pts(r); kind = r.get("floor", "stone")
        textures.setdefault(kind, floor_texture(kind, W, H, px, rnd))
        m = Image.new("L", (W, H), 0); ImageDraw.Draw(m).polygon(P(pts), fill=255)
        img.paste(textures[kind], (0, 0), m); floormask = ImageChops.lighter(floormask, m)
        if r.get("wall", True): segs.append({"pts": pts, "closed": True, "type": "wall"})
    segs += [dict(w) for w in spec.get("walls", [])]
    blocked = lambda a, b: any({tuple(d["a"]), tuple(d["b"])} == {a, b} for d in doors)
    lines = []  # (a, b, type) after removing door edges
    for w in segs:
        pts = [tuple(p) for p in w["pts"]] + ([tuple(w["pts"][0])] if w.get("closed") else [])
        lines += [(a, b, w.get("type", "wall")) for a, b in zip(pts, pts[1:]) if not blocked(a, b)]
    # ambient occlusion near walls + soft wall drop shadow on the floor
    occ = ImageChops.multiply(ImageOps.invert(floormask).filter(ImageFilter.GaussianBlur(px * .45)), floormask).point(lambda v: int(v * .9))
    wm = Image.new("L", (W, H), 0); wd = ImageDraw.Draw(wm)
    for a, b, t in lines:
        if t == "wall": wd.line(P([a, b]), fill=255, width=24)
    sh = ImageChops.offset(wm, 8, 10).filter(ImageFilter.GaussianBlur(px * .16))
    dark = ImageChops.lighter(occ, sh.point(lambda v: int(v * .65)))
    img = Image.composite(Image.new("RGBA", (W, H), (0, 0, 0, 255)), img, ImageChops.multiply(dark, floormask))
    # walls: dark outline, stone body, highlight
    d = ImageDraw.Draw(img)
    for a, b, t in lines:
        if t == "wall": d.line(P([a, b]), fill=INK, width=26)
    stone = colorize(ImageOps.autocontrast(vnoise(W, H, max(4, px // 6), rnd)), (84, 80, 78), .7, 1.3)
    wmask = Image.new("L", (W, H), 0); wd = ImageDraw.Draw(wmask)
    for a, b, t in lines:
        if t == "wall":
            wd.line(P([a, b]), fill=255, width=18)
            for pt in P([a, b]): wd.ellipse([pt[0] - 9, pt[1] - 9, pt[0] + 9, pt[1] + 9], fill=255)
    img.paste(stone, (0, 0), wmask); d = ImageDraw.Draw(img)
    for a, b, t in lines:
        if t == "wall": d.line(P([a, b]), fill=(150, 144, 138), width=2)
    # decals
    dl = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    for dc in spec.get("decals", []): draw_decal(dl, dc, px)
    img = Image.alpha_composite(img, dl.filter(ImageFilter.GaussianBlur(2)))
    # prop shadows then props
    pm = Image.new("L", (W, H), 0); pd = ImageDraw.Draw(pm)
    for p in spec.get("props", []): silhouette(pd, p, px)
    img = Image.composite(Image.new("RGBA", (W, H), (0, 0, 0, 255)), img, ImageChops.offset(pm, 9, 12).filter(ImageFilter.GaussianBlur(px * .08)).point(lambda v: int(v * .6)))
    d = ImageDraw.Draw(img)
    for p in spec.get("props", []): draw_prop(d, p, px)
    scene_walls = [{"c": [round(a[0] * px), round(a[1] * px), round(b[0] * px), round(b[1] * px)], "move": 0 if t == "invisible" else 20, "sense": 20 if t == "wall" else 0,
                    "light": 20 if t == "wall" else 0, "sound": 20, "door": 0, "ds": 0} for a, b, t in lines]
    for dr in doors:
        (ax, ay), (bx, by) = dr["a"], dr["b"]; bars = dr.get("kind") == "bars"
        if bars: draw_prop(d, {"kind": "bars", "x": min(ax, bx) - .05, "y": min(ay, by) - .05, "w": abs(bx - ax) + .1, "h": abs(by - ay) + .1}, px)
        else:
            d.line(P([(ax, ay), (bx, by)]), fill=INK, width=24); col = INK if dr.get("secret") else (128, 86, 40)
            d.line(P([(ax, ay), (bx, by)]), fill=col, width=16); d.line(P([(ax, ay), (bx, by)]), fill=tuple(min(255, c + 40) for c in col), width=3)
        scene_walls.append({"c": [round(ax * px), round(ay * px), round(bx * px), round(by * px)], "move": 20, "sense": 0 if bars else 20, "light": 0 if bars else 20, "sound": 20,
                            "door": 0 if bars else (2 if dr.get("secret") else 1), "ds": 0})
    lights = []
    gl = Image.new("RGBA", (W, H), (0, 0, 0, 0)); gd = ImageDraw.Draw(gl)
    for l in spec.get("lights", []):
        lights.append({"x": round(l["x"] * px), "y": round(l["y"] * px), "config": {"dim": l.get("dim", 20), "bright": l.get("bright", 10), "color": l.get("color", "#ff9a3c"), "alpha": 0.4,
                       "animation": {"type": "torch" if l.get("flicker") else None, "speed": 3, "intensity": 3}}})
        rad = max(l.get("bright", 10), 5) / 5 * px; gd.ellipse([l["x"] * px - rad, l["y"] * px - rad, l["x"] * px + rad, l["y"] * px + rad], fill=(255, 190, 90, 46))
    img = Image.alpha_composite(img, gl.filter(ImageFilter.GaussianBlur(px * .7)))
    vig = ImageOps.invert(Image.new("L", (W, H), 255).point(lambda v: v)); vm = Image.new("L", (W, H), 0)
    ImageDraw.Draw(vm).rectangle([px * 3, px * 3, W - px * 3, H - px * 3], fill=255); vm = ImageOps.invert(vm.filter(ImageFilter.GaussianBlur(px * 4))).point(lambda v: int(v * .8))
    img = Image.composite(Image.new("RGBA", (W, H), (0, 0, 0, 255)), img, vm).convert("RGB")
    out = Path(out_dir); out.mkdir(parents=True, exist_ok=True)
    slug = "".join(c if c.isalnum() else "-" for c in spec["name"].lower()).strip("-")
    img.save(out / f"{slug}.png")
    (out / f"{slug}.scene.json").write_text(json.dumps({"name": spec["name"], "width": W, "height": H, "grid": {"size": px, "distance": 5, "units": "ft"}, "walls": scene_walls, "lights": lights}, indent=1))
    print(f"{slug}: {W}x{H}px, {len(scene_walls)} walls, {len(lights)} lights -> {out}")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
