#!/usr/bin/env python3
"""TF-ART-004 cook — CHAIN-LINK FENCE family (three-way merge: TF-ART-004 + TF-RUN-003 + TF-WORLD-003).

ONE cook, three consumers (board collision C1). Surviving clauses honoured here:
  ART-004: mesh solution + DECLARED POST PITCH (posts every 4 cells = 176 px, on rhythm).
  RUN-003: SEE-THROUGH RENDERING CAPABILITY — structure layer with REAL ALPHA holes
           (the run's first transparent structure; WANG-16 contract documented below,
           agreed BEFORE pixels: see WANG CONTRACT), gate animation 9 frames / 2 beats
           @120BPM under the LEAF-PIXEL law (posts + mesh frozen, leaf only — machine-
           asserted in cook_gate_anim).
  WORLD-003: slats/topper variants + the two-background transparency proof.
HEIGHT — THE ONE OPEN MERGE CALL, NEVER SILENTLY PICKED: cooked at 2 cells (88 px,
door-law parity per RUN-003). ART-004's own measure says 6 ft = ~2.5 cells and 8 ft
storage/jail = ~3.5. FLAGGED [PENDING Paolo] in the bank JSON (key "pending_paolo").

REUSE CHECK:
  banks/BOHEMIA_HD_TILE_REPO_part3/4.txt x banks/BOHEMIA_ACT1_CONFIRMED_SET_7_13_26.txt
    — OPENED IN CODE below, UP tiles only. DIRECT HIT — BOUGHT BEATS PAINTED:
    pack "6. Chain link fences" (10 UP) and pack "13. Fences and wire" (19 UP) are
    Paolo's own bought fence art WITH GENUINE ALPHA HOLES (28-42%% fully transparent,
    measured). A VERDICT IS ABOUT THE OBJECT, NEVER THE PLACEMENT: these UP fences ARE
    the chain-link family. This cook HARVESTS, at native 1:1 pixels (no resampling —
    and the ACT1 sweep flags this family SMALL = render bigger, so native-on-44-grid
    is the sanctioned direction):
      6. Chain link fences #01 — mesh fabric (8 px diamond period, real holes), line
        posts with ball caps, dark top rail;  #00 — the cut-open breach hole;
        #07 — rust spatter (fittings/cut ends only);  #10 — plain run cross-check.
      13. Fences and wire #00 — pale galvanised top rail + barbed-wire top strip +
        bottom rail;  #10 — the hinged gate leaf (hinges, latch, frame — verbatim).
    Painted ONLY where his art has no coverage (mode MIXED): razor-coil topper
    (no concertina anywhere in the UP corpus), privacy slats (tan/bone PVC, colours
    sampled from APPROVED starter/stucco corpus), dead-thistle wind-trash line
    (straw colours sampled from approved starter yard/dirt), NS edge-on runs, and the
    lean/sag/breach-peel TRANSFORMS of harvested pixels.
  banks/BOHEMIA_TEXTURE_MATCH_8_1_26.txt — OPENED IN CODE. 38 materials, none is a
    fence/mesh/gate ("weathered wood fence plank" is a wood plank wall, opposite
    object: opaque). Used ONLY as approved colour source (stucco_tan / stucco_bone)
    for the painted slat colourways.
  banks/BOHEMIA_EXTERIOR_POOL_8_5_26.txt — OPENED IN CODE. Its own "barrier" bucket
    already lists chain link fences / fences and wire idx 0-3 (flag SMALL) as the
    eligible fence props — independent confirmation this harvest is the blessed pool.
    Pool entries are the same bought pixels; harvest goes to the HD masters directly.
  banks/BOHEMIA_PERIMETER_8_2_26.txt — OPENED IN CODE. 330 tiles, ALL status PENDING
    PAOLO, and they are the SOLID masonry suburb boundary (the opposite object). Not
    harvested. The DO-NOT-COOK boundary they own is recorded in the bank JSON.
  banks/BOHEMIA_CIVIC_OPENINGS_8_3_26.txt + BOHEMIA_OPENINGS_8_2_26.txt — OPENED IN
    CODE. Building door/window openings, no fence gate. Not harvested.
  banks/BOHEMIA_PERIMETER_WALL_POOL_7_14_26.txt (26 approved) — OPENED IN CODE as the
    ANCHOR ONLY (the boundary-value ruler this family is the see-through counterpart
    of). Solid masonry, never harvested into a fence.
  banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt (42 approved) — OPENED IN
    CODE for the judge-scene grounds (yard_0 bright / road_0 dark) and the approved
    straw/tan colour samples. No fence in it (its own index says so).

TASTE CHECK:
  DEAD VALLEY: galvanised dull chalky grey, rust ONLY at rail/fittings/ground/cut ends
    (Vegas chalks, never rust-belt orange — harvested art already obeys). Slats are
    sun-bleached tan/bone PVC, gap-toothed. Thistle line is STRAW, never green.
  SEE-THROUGH IS THE ASSET: genuine alpha holes everywhere; a dense mesh = banned
    noise, a solid plane = a wall we already own. The bought 8 px diamond IS the
    sparse legible weave (spec asks ~4-6 px; 8 px is what Paolo's own art uses at this
    scale and it holds genuine holes — bought beats painted on the pitch call too).
  STAMP BUG / 44-DIVISOR LAW: 8 does NOT divide 44, so the SEAMLESS UNIT here is the
    DECLARED POST BAY = 4 cells = 176 px (8 | 176, 22 diamonds exactly). Bay strips
    wrap pixel-perfect because the line post itself is split across the wrap edge —
    the seam hides UNDER the post, on the declared rhythm, never wherever a tile edge
    falls. 44 px slices of one strip rejoin exactly by construction. Variety = 3+
    variants per family, never one hero tile.
  45 LAW: ball post caps read as spheres (sky-lit top-left), razor coil is drawn as
    overlapping ELLIPSE rings (coil cross-section at the world's 3/4 view), rails are
    brightest on top. NO keyline, NO baked diamond shadow (runtime pass gift), light
    upper-left, STRUCTURE band, LOW CONTRAST on purpose — the yard behind carries it.
  REGULAR DIAMOND DECLARED to the dither check up front: the mesh is a periodic
    lattice, not stipple; declared in the bank JSON (key "declared_periodic").
  WIND: trash/thistle line sits in the bottom courses of the NE face (global SSW wind).
  VERIFY ON THE REAL SURFACE: every proof is rendered composited over the APPROVED
    grounds and eyeballed before shipping; numbers lie, pictures do not.

Deterministic: SEED fixed, rerunnable, byte-identical output.
Writes ONLY:
  banks/tileforms/TF-ART-004_CANDIDATES_8_8_26.json
  records/tileforms_proofs/TF-ART-004/*.png

WANG CONTRACT (agreed before pixels, for the wiring session — RUN-003's clause):
  The fence is a CONNECTED LINE on the cell grid. Renderer needs a 4-bit neighbour
  mask (N,E,S,W). Pieces this bank ships and how the 16 cases compose:
    EW face   : any 44px slice of a bay strip (bay = P R R R, post every 4th cell on
                the declared pitch; slice k of bay uses column window k*44..k*44+44).
    NS run    : ns_run_* tile (edge-on strip, x-centred), stacks vertically.
    post_hub  : line post tile; REQUIRED at corners, T, X, and ends (no floating end
                posts — an end cell always renders post_hub on top of its arm).
    gate      : gate_* is SINGLE PLACEMENT in an EW run (2 cells), leaf animates.
  Case table (bit = neighbour present): 0000 lone post_hub; 1010/0101 straight NS/EW;
  single-bit = end (arm + post_hub); two adjacent bits = corner (both arms + post_hub);
  three bits = T; 1111 = X. Draw order N-arm, EW, S-arm, hub (lower = in front).
  Proof: proof_wang16.png renders ALL 16 composed cases over approved ground.
"""

import base64
import colorsys
import io
import json
import math
import os
import random

import numpy as np
from PIL import Image

SEED = 80426
R = random.Random(SEED)

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
BANKS = os.path.join(ROOT, "banks")
OUT_BANK = os.path.join(BANKS, "tileforms", "TF-ART-004_CANDIDATES_8_8_26.json")
OUT_PROOF = os.path.join(ROOT, "records", "tileforms_proofs", "TF-ART-004")
os.makedirs(OUT_PROOF, exist_ok=True)
os.makedirs(os.path.dirname(OUT_BANK), exist_ok=True)

CELL = 44          # the art cell
H = 88             # 2 cells tall (door parity) — the OPEN height call, flagged PENDING
BAY = 176          # DECLARED POST PITCH: 10 ft = 4 cells; the seamless unit
MESH_P = 8         # measured diamond period of the harvested fabric; 8 | 176 exactly

# ---------------------------------------------------------------- bank openers
def _load(path):
    with open(path) as f:
        return json.load(f)

def open_reuse_banks():
    """Every bank the REUSE CHECK names is genuinely opened here."""
    banks = {}
    banks["texture_match"] = _load(os.path.join(BANKS, "BOHEMIA_TEXTURE_MATCH_8_1_26.txt"))
    banks["exterior_pool"] = _load(os.path.join(BANKS, "BOHEMIA_EXTERIOR_POOL_8_5_26.txt"))
    banks["perimeter_82"] = _load(os.path.join(BANKS, "BOHEMIA_PERIMETER_8_2_26.txt"))
    banks["openings"] = _load(os.path.join(BANKS, "BOHEMIA_OPENINGS_8_2_26.txt"))
    banks["civic_openings"] = _load(os.path.join(BANKS, "BOHEMIA_CIVIC_OPENINGS_8_3_26.txt"))
    banks["perim_pool_714"] = _load(os.path.join(BANKS, "BOHEMIA_PERIMETER_WALL_POOL_7_14_26.txt"))
    banks["starter"] = _load(os.path.join(BANKS, "BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt"))
    banks["confirmed"] = _load(os.path.join(BANKS, "BOHEMIA_ACT1_CONFIRMED_SET_7_13_26.txt"))
    banks["hd3"] = _load(os.path.join(BANKS, "BOHEMIA_HD_TILE_REPO_part3.txt"))
    banks["hd4"] = _load(os.path.join(BANKS, "BOHEMIA_HD_TILE_REPO_part4.txt"))
    # documented non-fits, verified live so the claim can never rot:
    tm_names = " ".join(t["name"] for t in banks["texture_match"]["tiles"]).lower()
    assert "chain" not in tm_names and "mesh" not in tm_names, "texture-match grew a mesh: re-shop"
    assert banks["perimeter_82"]["status"] == "PENDING PAOLO", "perimeter 8/2 status moved: re-shop"
    barrier_packs = {e["pack"] for e in banks["exterior_pool"]["buckets"]["barrier"]}
    assert "chain link fences" in barrier_packs, "exterior pool no longer blesses the fence packs"
    return banks

def verdict_map(confirmed):
    return {(v["pack"], v["idx"]): v["v"] for v in confirmed["verdicts"]}

def hd_tile(banks, part, pack, idx):
    """Decode one bought master, asserting its Great-Sweep verdict is UP."""
    v = verdict_map(banks["confirmed"]).get((pack, idx))
    assert v == "UP", f"{pack}#{idx} is not UP (got {v}) — harvest refused"
    e = banks[part]["packs"][pack][idx]
    im = Image.open(io.BytesIO(base64.b64decode(e["b64"]))).convert("RGBA")
    return np.array(im)

def starter_tile(banks, tid):
    for t in banks["starter"]["tiles"]:
        if t["id"] == tid:
            return np.array(Image.open(io.BytesIO(base64.b64decode(t["b64"]))).convert("RGBA"))
    raise KeyError(tid)

# ---------------------------------------------------------------- pixel helpers
def blank(w=BAY, h=H):
    return np.zeros((h, w, 4), dtype=np.uint8)

def paste(dst, src, x, y):
    """Alpha-over paste of src onto dst at (x,y), clipped."""
    h, w = src.shape[:2]
    x0, y0 = max(0, x), max(0, y)
    x1, y1 = min(dst.shape[1], x + w), min(dst.shape[0], y + h)
    if x1 <= x0 or y1 <= y0:
        return
    s = src[y0 - y : y1 - y, x0 - x : x1 - x].astype(np.float32)
    d = dst[y0:y1, x0:x1].astype(np.float32)
    sa = s[..., 3:4] / 255.0
    da = d[..., 3:4] / 255.0
    oa = sa + da * (1 - sa)
    safe = np.where(oa == 0, 1, oa)
    rgb = (s[..., :3] * sa + d[..., :3] * da * (1 - sa)) / safe
    out = np.concatenate([rgb, oa * 255], axis=-1)
    dst[y0:y1, x0:x1] = np.clip(out + 0.5, 0, 255).astype(np.uint8)

def tile_band(band, out_w, out_h):
    """Repeat a period-cropped band to fill out_w x out_h (phase 0 at 0,0)."""
    reps_x = -(-out_w // band.shape[1])
    reps_y = -(-out_h // band.shape[0])
    big = np.tile(band, (reps_y, reps_x, 1))
    return big[:out_h, :out_w].copy()

def crop(a, x0, y0, x1, y1):
    return a[y0:y1, x0:x1].copy()

def to_png_b64(arr):
    buf = io.BytesIO()
    Image.fromarray(arr, "RGBA").save(buf, "PNG", optimize=True)
    return base64.b64encode(buf.getvalue()).decode()

def save_png(arr, name, scale=1):
    im = Image.fromarray(arr, "RGBA")
    if scale > 1:
        im = im.resize((im.width * scale, im.height * scale), Image.NEAREST)
    im.save(os.path.join(OUT_PROOF, name))

def lum(rgb):
    return 0.299 * rgb[..., 0] + 0.587 * rgb[..., 1] + 0.114 * rgb[..., 2]

# ---------------------------------------------------------------- harvest
class Harvest:
    """Named component cuts off the UP bought masters, native 1:1 pixels."""

    def __init__(self, banks):
        self.cl01 = hd_tile(banks, "hd4", "6. Chain link fences", 1)    # 96x67 big-diamond run
        self.cl00 = hd_tile(banks, "hd4", "6. Chain link fences", 0)    # 96x73 breach hole
        self.cl07 = hd_tile(banks, "hd4", "6. Chain link fences", 7)    # 96x72 rust patch
        self.cl10 = hd_tile(banks, "hd4", "6. Chain link fences", 10)   # 96x53 plain run
        self.fw00 = hd_tile(banks, "hd3", "13. Fences and wire", 0)     # 96x70 pale rail + barbs
        self.fw10 = hd_tile(banks, "hd3", "13. Fences and wire", 10)    # 96x94 hinged gate
        # mesh fabric: POST-FREE interior of cl01's right panel, period-cropped to
        # 8 px (posts at x3..8 / ~44..52 / x87..92 — the first cut at 16..80 dragged
        # the CENTRE post along and it tiled into ghost bars every 64 px; seen on the
        # proof, fixed here: the crop starts east of the centre post)
        self.mesh = crop(self.cl01, 54, 24, 86, 56)          # 32x32 = 4x4 periods
        # line post: full column with ball cap (x2..11), cl01
        self.post = crop(self.cl01, 1, 4, 12, 67)            # 11 wide, cap to footing
        # dark top rail from cl01 (rows 16..21 across fabric width)
        self.rail_dark = crop(self.cl01, 16, 16, 80, 22)     # 64x6
        # pale galvanised rail + barbed strip from fw00 (posts x2..6/x89..93)
        self.rail_pale = crop(self.fw00, 8, 12, 88, 19)      # 80x7
        self.barbs = crop(self.fw00, 8, 0, 88, 12)           # 80x12 two-strand barb run
        self.bottom_rail = crop(self.fw00, 8, 59, 88, 66)    # 80x7
        # breach: the cut-open hole zone of cl00 (hole reads against ground)
        self.breach = crop(self.cl00, 24, 26, 82, 70)        # 58x44
        # rust spatter donor pixels from cl07's patch
        self.rust_src = crop(self.cl07, 52, 20, 84, 44)

    def post_col(self, height):
        """Extend the harvested post to `height` by repeating its mid rows."""
        p = self.post
        cap, mid, foot = p[:14], p[14:-8], p[-8:]
        need = height - cap.shape[0] - foot.shape[0]
        reps = -(-need // mid.shape[0])
        body = np.tile(mid, (reps, 1, 1))[:need]
        return np.concatenate([cap, body, foot], axis=0)

# palette pulled once for painting: harvested greys + approved straw/tan
def build_palettes(hv, banks):
    def opaque_colors(arr):
        m = arr[..., 3] > 200
        return arr[..., :3][m]
    grey = np.concatenate([opaque_colors(hv.cl01), opaque_colors(hv.fw00)])
    # unique-ish subsample, deterministic
    grey = grey[:: max(1, len(grey) // 512)]
    yard = starter_tile(banks, "yard_0")[..., :3].reshape(-1, 3)
    dirt = starter_tile(banks, "dirt")[..., :3].reshape(-1, 3)
    straw = np.concatenate([yard[:: 37], dirt[:: 41]])
    # approved slat colours: stucco_tan / stucco_bone fields from texture-match.
    # PVC slats must survive the semi-transparent wire laid over them, so take the
    # SUN-LIT quartile of the approved stucco (sun-bleached PVC reads bright).
    tm = banks["texture_match"]
    slat = {}
    for t in tm["tiles"]:
        for want, key in (("stucco_tan", "tan"), ("stucco_bone", "bone")):
            if t.get("id", "").startswith(want) and key not in slat:
                arr = np.array(Image.open(io.BytesIO(base64.b64decode(t["b64"]))).convert("RGB"))
                px = arr.reshape(-1, 3)
                L = lum(px.astype(np.float32))
                slat[key] = px[L >= np.percentile(L, 72)]
    return grey, straw, slat

def snap(pal, rgb):
    """Snap one RGB to the nearest palette colour (keeps painted pixels in-corpus)."""
    d = pal.astype(np.int32) - np.array(rgb, dtype=np.int32)
    return tuple(int(c) for c in pal[np.argmin((d * d).sum(axis=1))])

# ---------------------------------------------------------------- fabric builders
FABRIC_TOP = 30      # top of mesh fabric on the 88-tall canvas
FABRIC_BOT = 86      # bottom (2 px footing air)
RAIL_Y = 24          # rail band sits on the fabric top
POST_TOP = 18

def mesh_field(hv, w, h, sag=0, x0=0):
    """Tiled harvested fabric, optional catenary sag (max `sag` px, bellied centre)."""
    f = tile_band(hv.mesh, w, h)
    if sag > 0:
        out = np.zeros_like(f)
        for x in range(w):
            dy = int(round(sag * math.sin(math.pi * (x + 0.5) / w)))
            out[dy:, x] = f[: h - dy, x] if dy else f[:, x]
        f = out
    return f

def base_bay(hv, rail="dark", sag=2, rustiness=1.0, rng=None):
    """A 176x88 post-to-post bay: split post at wrap edge, fabric bellied between."""
    rng = rng or random.Random(SEED)
    t = blank()
    fab = mesh_field(hv, BAY - 12, FABRIC_BOT - FABRIC_TOP, sag=sag)
    paste(t, fab, 6, FABRIC_TOP)
    band = hv.rail_dark if rail == "dark" else hv.rail_pale
    rail_img = tile_band(band, BAY - 8, band.shape[0])
    paste(t, rail_img, 4, RAIL_Y)
    if rail == "pale":
        bot = tile_band(hv.bottom_rail, BAY - 8, hv.bottom_rail.shape[0])
        paste(t, bot, 4, FABRIC_BOT - 5)
    # the split line post: right half at x=0.., left half ending at x=175
    post = hv.post_col(H - POST_TOP)
    half = post.shape[1] // 2
    paste(t, post[:, half:], 0, POST_TOP)
    paste(t, post[:, :half], BAY - half, POST_TOP)
    # rust ONLY at rail level + fittings: a few harvested rust pixels
    src = hv.rust_src
    m = (src[..., 3] > 200) & (src[..., 0].astype(int) > src[..., 1].astype(int) + 24)
    ys, xs = np.nonzero(m)
    n = int(14 * rustiness)
    for _ in range(n):
        i = rng.randrange(len(xs))
        px = src[ys[i], xs[i]].copy()
        tx = rng.randrange(6, BAY - 6)
        ty = rng.choice([RAIL_Y + rng.randrange(0, 6), FABRIC_BOT - rng.randrange(1, 4)])
        t[ty, tx] = px
    return t

def slat_bay(hv, slat_pix, missing=0.28, rng=None):
    """Privacy slats woven BEHIND the mesh, gap-toothed; then fabric over."""
    rng = rng or random.Random(SEED + 7)
    t = blank()
    inner_w = BAY - 12
    slats = blank(inner_w, FABRIC_BOT - FABRIC_TOP)
    for sx in range(0, inner_w - 6, MESH_P):
        if rng.random() < missing:
            continue  # snapped-out slat: the gap-toothed read
        c = slat_pix[rng.randrange(len(slat_pix))]
        shade = 1.02 + 0.16 * rng.random()      # sun-bleached PVC: bright, narrow range
        col = tuple(min(255, int(v * shade)) for v in c)
        hgt = slats.shape[0] - rng.randrange(0, 5)
        slats[0:hgt, sx + 1 : sx + 7, :3] = col
        slats[0:hgt, sx + 1 : sx + 7, 3] = 255
        # slat top edge catches the sky (45 law: brightest on top)
        slats[0:1, sx + 1 : sx + 7, :3] = tuple(min(255, int(v * 1.15)) for v in col)
        # right edge falls to shade (light upper-left)
        slats[0:hgt, sx + 6 : sx + 7, :3] = tuple(int(v * 0.82) for v in col)
    paste(t, slats, 6, FABRIC_TOP)
    fab = mesh_field(hv, inner_w, FABRIC_BOT - FABRIC_TOP, sag=1)
    paste(t, fab, 6, FABRIC_TOP)
    rail_img = tile_band(hv.rail_pale, BAY - 8, hv.rail_pale.shape[0])
    paste(t, rail_img, 4, RAIL_Y)
    post = hv.post_col(H - POST_TOP)
    half = post.shape[1] // 2
    paste(t, post[:, half:], 0, POST_TOP)
    paste(t, post[:, :half], BAY - half, POST_TOP)
    return t

def thistle_line(t, straw, rng, y_base=FABRIC_BOT, n=26):
    """Wind trash + dead-thistle drift in the bottom courses (NE face, SSW wind)."""
    for _ in range(n):
        cx = rng.randrange(8, BAY - 8)
        cy = y_base - rng.randrange(0, 9)
        c = snap(straw, straw[rng.randrange(len(straw))])
        # tiny dead-thistle wisp: 2-4 px arc, one pixel wide (56px-law: ONE pixel)
        for k in range(rng.randrange(2, 5)):
            x = cx + k
            y = cy - (k % 2) - rng.randrange(0, 2)
            if 0 <= x < BAY and 0 <= y < H:
                t[y, x, :3] = c
                t[y, x, 3] = 255
    # one tumbleweed half-ball: ellipse cluster bowed toward the viewer (45 law)
    cx = rng.randrange(30, BAY - 30)
    for a in range(0, 360, 18):
        x = cx + int(7 * math.cos(math.radians(a)))
        y = y_base - 3 + int(4 * math.sin(math.radians(a)))
        c = snap(straw, straw[rng.randrange(len(straw))])
        if 0 <= x < BAY and 0 <= y < H:
            t[y, x, :3] = c
            t[y, x, 3] = 255
    return t

def breach_bay(hv, rng):
    """ONE cut-and-peeled bottom corner per long run: harvested hole, moved to the
    ground line (people crawl UNDER), cut ends lit + rusted."""
    t = base_bay(hv, rail="dark", sag=2, rustiness=0.8, rng=rng)
    hole = hv.breach
    hx, hy = 96, FABRIC_BOT - hole.shape[0] + 2
    # clear the fabric where the hole zone goes, then paste the harvested cut mesh
    t[hy : hy + hole.shape[0], hx : hx + hole.shape[1]] = 0
    paste(t, hole, hx, hy)
    # re-hang the rail over it (the rail survives a bottom cut)
    rail_img = tile_band(hv.rail_dark, BAY - 8, hv.rail_dark.shape[0])
    paste(t, rail_img, 4, RAIL_Y)
    # cut ends catch light + rust: brighten then warm a few rim pixels
    a = t[..., 3].astype(int)
    rim = np.zeros_like(a, dtype=bool)
    zone = np.zeros_like(a, dtype=bool)
    zone[hy : hy + hole.shape[0], hx : hx + hole.shape[1]] = True
    hole_open = (a < 30) & zone
    for dy, dx in ((0, 1), (0, -1), (1, 0), (-1, 0)):
        rim |= np.roll(hole_open, (dy, dx), (0, 1)) & (a > 150) & zone
    ys, xs = np.nonzero(rim)
    for i in range(len(ys)):
        if i % 3 == 0:
            t[ys[i], xs[i], :3] = np.clip(t[ys[i], xs[i], :3].astype(int) + 46, 0, 255)
        elif i % 7 == 1:
            px = t[ys[i], xs[i], :3].astype(int)
            t[ys[i], xs[i], :3] = np.clip([px[0] + 38, px[1] + 6, px[2] - 18], 0, 255)
    return t

def lean_bay(hv, rng):
    """A leaning panel: second half of the bay shears down-right, post going with it."""
    t = base_bay(hv, rail="dark", sag=1, rustiness=1.2, rng=rng)
    x0, x1 = 92, BAY
    seg = t[:, x0:x1].copy()
    t[:, x0:x1] = 0
    out = np.zeros_like(seg)
    w = x1 - x0
    for x in range(w):
        dy = int(round(6 * (x / max(1, w - 1))))
        if dy == 0:
            out[:, x] = seg[:, x]
        else:
            out[dy:, x] = seg[:-dy, x]
    t[:, x0:x1] = out
    return t

def topper_barb(hv):
    """3-strand barbed top course (bought strip is 2-strand; third strand is the same
    harvested strand repeated one course lower — still his pixels)."""
    strip = blank(BAY, 20)
    band = tile_band(hv.barbs, BAY - 8, hv.barbs.shape[0])
    paste(strip, band, 4, 0)
    third = tile_band(hv.barbs[6:11], BAY - 8, 5)
    paste(strip, third, 4, 13)
    return strip

def topper_razor(grey_pal, rng):
    """PAINTED razor coil (no concertina in the bought corpus): heavily OVERLAPPING
    ellipse rings at 8 px pitch (8 | 176) so it reads as one tangled coil, not a row
    of hoops. Dull galvanised greys off the harvested palette (never white), genuine
    alpha holes, top arc catches the sky. Jail / substation / police ONLY."""
    hgt = 22
    strip = blank(BAY, hgt)
    lite = snap(grey_pal, (172, 174, 178))
    mid = snap(grey_pal, (120, 122, 128))
    dark = snap(grey_pal, (72, 74, 80))
    cy, rx, ry = 11, 7, 9
    for cx in range(0, BAY, MESH_P):
        tilt = rng.choice((-1, 0, 0, 1))
        for a in range(0, 360, 6):
            x = int(round(cx + rx * math.cos(math.radians(a + 14)))) % BAY
            y = int(round(cy + tilt * 0.5 + ry * math.sin(math.radians(a + 14))))
            if not (0 <= y < hgt):
                continue
            c = lite if y < cy - 3 else (mid if y < cy + 4 else dark)
            strip[y, x, :3] = c
            strip[y, x, 3] = 255
        # a razor barb tick per ring, upper flank (catching sky)
        bx, by = (cx + 3) % BAY, 2 + (cx // MESH_P) % 2
        strip[by, bx, :3] = mid
        strip[by, bx, 3] = 255
    return strip

def mount_topper(bay, strip):
    out = bay.copy()
    paste(out, strip, 0, 2)
    return out

def post_hub(hv):
    """Line post tile 44x88 (the wang hub: corners, T, X, ends)."""
    t = blank(CELL, H)
    post = hv.post_col(H - POST_TOP)
    paste(t, post, (CELL - post.shape[1]) // 2, POST_TOP)
    return t

def ns_run(hv, with_post, rng):
    """Edge-on NS strip: the fence plane running away from camera. A readable band,
    not a hairline: west edge is the top rail catching the sky (upper-left light),
    then harvested mesh seen at a slant, holes knocked through so ground reads."""
    t = blank(CELL, H)
    band_w = 9
    col = tile_band(crop(hv.mesh if hasattr(hv, "mesh") else hv.cl01, 2, 2, 2 + band_w, 26), band_w, H)
    x = CELL // 2 - band_w // 2 - 1
    paste(t, col, x, 0)
    # top-rail edge: 2 px light line along the run's west edge (the sky-lit rail)
    rail_c = hv.rail_pale[3, 8, :3]
    t[:, x, :3] = rail_c
    t[:, x, 3] = 255
    t[:, x + 1, :3] = (rail_c * 0.82).astype(np.uint8)
    t[:, x + 1, 3] = 255
    # east edge falls to shade
    t[:, x + band_w - 1, :3] = (t[:, x + band_w - 1, :3] * 0.6).astype(np.uint8)
    # knock holes so the ground reads through the edge-on band too
    for y in range(0, H, 2):
        for k in range(2):
            dx = 2 + (y * 5 + k * 3) % (band_w - 3)
            t[y, x + dx, 3] = 0
    if with_post:
        post = hv.post_col(34)
        paste(t, post, CELL // 2 - post.shape[1] // 2, H // 2 - 10)
    return t

# ---------------------------------------------------------------- the gate
def cook_gate(hv):
    """FW10 hinged gate harvested near-verbatim onto a 2-cell tile; leaf-pixel anim."""
    g = hv.fw10
    base = blank(2 * CELL, H)
    body = crop(g, 4, 4, 92, 92)                     # 88x88 native cut
    paste(base, body, 0, 0)
    # leaf sprite = the framed mesh leaf between the outer posts
    LX0, LY0, LX1, LY1 = 9, 4, 80, 86                # in `body` coords
    leaf = body[LY0:LY1, LX0:LX1].copy()
    frame_only = base.copy()
    frame_only[LY0:LY1, LX0:LX1] = 0                 # the opening: genuinely open
    shut = base
    frames = []
    n = 9                                            # 9 frames over 2 beats @120BPM
    for k in range(n):
        u = k / (n - 1)
        e = 0.5 - 0.5 * math.cos(math.pi * u)        # ease in-out on the beat
        w = max(7, int(round((LX1 - LX0) * (1 - 0.9 * e))))
        f = frame_only.copy()
        sq = np.array(
            Image.fromarray(leaf, "RGBA").resize((w, LY1 - LY0), Image.NEAREST)
        )
        if e > 0.05:                                 # swinging toward us: face shades
            sq = sq.copy()
            sq[..., :3] = np.clip(sq[..., :3].astype(int) * (1 - 0.28 * e), 0, 255).astype(np.uint8)
        paste(f, sq, LX0, LY0)
        frames.append(f)
    gate_open = frames[-1]
    # sagging-open: leaf at 70%, dropped and sheared (bottom hinge gone)
    sag = frame_only.copy()
    w = int((LX1 - LX0) * 0.7)
    sq = np.array(Image.fromarray(leaf, "RGBA").resize((w, LY1 - LY0), Image.NEAREST))
    sheared = np.zeros_like(sq)
    for x in range(w):
        dy = int(round(5 * x / max(1, w - 1)))
        sheared[dy:, x] = sq[: sq.shape[0] - dy, x] if dy else sq[:, x]
    paste(sag, sheared, LX0, LY0 + 2)
    # LEAF-PIXEL LAW, machine-asserted: outside the leaf box all frames identical
    mask = np.ones((H, 2 * CELL), dtype=bool)
    mask[LY0:LY1, LX0:LX1] = False
    for f in frames:
        assert np.array_equal(f[mask], shut[mask]), "leaf-pixel law violated: structure moved"
    return shut, gate_open, sag, frames

# ---------------------------------------------------------------- metrics
def measure(arr):
    a = arr[..., 3]
    op = a >= 128
    n = arr.shape[0] * arr.shape[1]
    out = {"w": arr.shape[1], "h": arr.shape[0]}
    out["alpha_clear_pct"] = round(100.0 * float((a < 32).sum()) / n, 1)
    out["alpha_partial_pct"] = round(100.0 * float(((a >= 32) & (a < 224)).sum()) / n, 1)
    if op.sum() == 0:
        return out
    rgb = arr[..., :3][op].astype(np.float32)
    out["colours"] = int(len(np.unique(arr[..., :3][op].reshape(-1, 3), axis=0)))
    L = lum(arr[..., :3].astype(np.float32))
    out["lum_mean"] = round(float(L[op].mean()), 1)
    out["lum_sd"] = round(float(L[op].std()), 1)
    # edge/grain over horizontally adjacent BOTH-OPAQUE pairs
    both = op[:, :-1] & op[:, 1:]
    if both.sum():
        d = np.abs(L[:, :-1] - L[:, 1:])[both]
        out["edge"] = round(float(d.mean()), 2)
        out["grain_pct"] = round(100.0 * float((d > 8).sum()) / len(d), 1)
    mx = rgb.max(axis=1)
    mn = rgb.min(axis=1)
    s = np.where(mx == 0, 0, (mx - mn) / np.where(mx == 0, 1, mx))
    out["sat"] = round(float(s.mean()), 3)
    hsv = np.array([colorsys.rgb_to_hsv(*(p / 255.0)) for p in rgb[:: max(1, len(rgb) // 4000)]])
    hue = hsv[:, 0] * 360
    svv = hsv[:, 1]
    out["purple_pct"] = round(100.0 * float(((hue >= 265) & (hue <= 335) & (svv > 0.25)).sum()) / len(hsv), 2)
    out["green_pct"] = round(100.0 * float(((hue >= 70) & (hue <= 170) & (svv > 0.25)).sum()) / len(hsv), 2)
    out["near_black_pct"] = round(100.0 * float((L[op] < 16).sum()) / int(op.sum()), 2)
    return out

def wrap_error(arr):
    """Wrap contract: the bay wraps THROUGH the split line post, so the honest ruler
    is the post's own internal column step, not the mostly-transparent mesh field.
    Returns (wrap_delta, post_internal_step) — wrap must sit within the post step."""
    L = lum(arr[..., :3].astype(np.float32))
    a = arr[..., 3].astype(np.float32) / 255.0
    l0, l1 = L[:, 0] * a[:, 0], L[:, -1] * a[:, -1]
    wrap = float(np.abs(l0 - l1).mean())
    # post occupies the outer ~6 columns each side: measure its own adjacent steps
    post_cols = np.concatenate([np.abs(L[:, i] * a[:, i] - L[:, i + 1] * a[:, i + 1])
                                for i in (0, 1, 2, arr.shape[1] - 3, arr.shape[1] - 2)])
    return round(wrap, 2), round(float(post_cols.mean()), 2)

# ---------------------------------------------------------------- proofs
def ground_sheet(banks, tid, w, h, dark_mult=None):
    g = starter_tile(banks, tid)
    reps = (-(-h // 44), -(-w // 44), 1)
    sheet = np.tile(g, reps)[:h, :w].copy()
    if dark_mult is not None:
        sheet[..., :3] = np.clip(sheet[..., :3].astype(np.float32) * np.array(dark_mult), 0, 255).astype(np.uint8)
    return sheet

def night(arr):
    out = arr.copy()
    out[..., :3] = np.clip(out[..., :3].astype(np.float32) * np.array([0.30, 0.33, 0.46]), 0, 255).astype(np.uint8)
    return out

def compose_over(bg, fence, x, y):
    out = bg.copy()
    paste(out, fence, x, y)
    return out

# ---------------------------------------------------------------- main
def main():
    banks = open_reuse_banks()
    hv = Harvest(banks)
    grey_pal, straw, slat = build_palettes(hv, banks)
    tiles = []          # bank entries
    def add(name, arr, family, role, harvested_from, extra=None):
        m = measure(arr)
        if extra:
            m.update(extra)
        tiles.append({
            "name": name,
            "px": [arr.shape[1], arr.shape[0]],
            "b64": to_png_b64(arr),
            "family": family,
            "role": role,
            "harvested_from": harvested_from,
            "metrics": m,
        })
        return arr

    # ---- run bays (the seamless unit = the declared 4-cell post bay)
    bays = {}
    for i in range(3):
        rng = random.Random(SEED + 100 + i)
        b = base_bay(hv, rail="dark", sag=1 + i % 3, rustiness=0.8 + 0.4 * i, rng=rng)
        we, ie = wrap_error(b)
        bays[f"run_plain_{i}"] = add(f"run_plain_{i}", b, "run_plain", "EW face bay, tension-wire top",
                                     "6. Chain link fences #01 (UP)", {"wrap_err": we, "post_step": ie})
    for i in range(3):
        rng = random.Random(SEED + 200 + i)
        b = base_bay(hv, rail="pale", sag=1 + i, rustiness=0.6 + 0.5 * i, rng=rng)
        we, ie = wrap_error(b)
        bays[f"run_rail_{i}"] = add(f"run_rail_{i}", b, "run_rail", "EW face bay, galvanised top rail",
                                    "6. Chain link fences #01 + 13. Fences and wire #00 (UP)",
                                    {"wrap_err": we, "post_step": ie})
    for i, key in enumerate(["tan", "bone"]):
        rng = random.Random(SEED + 300 + i)
        b = slat_bay(hv, slat[key], missing=0.26 + 0.06 * i, rng=rng)
        we, ie = wrap_error(b)
        bays[f"run_slat_{key}"] = add(f"run_slat_{key}", b, "run_slat",
                                      f"privacy-slat bay, gap-toothed, {key} PVC",
                                      "mesh/posts UP harvest; slats painted in APPROVED "
                                      f"stucco_{key} colours", {"wrap_err": we, "post_step": ie})
    for i in range(2):
        rng = random.Random(SEED + 400 + i)
        b = base_bay(hv, rail="dark" if i == 0 else "pale", sag=2, rustiness=0.9, rng=rng)
        b = thistle_line(b, straw, rng)
        we, ie = wrap_error(b)
        bays[f"run_trash_{i}"] = add(f"run_trash_{i}", b, "run_trash",
                                     "bay with wind-trash + dead-thistle bottom line (NE face, SSW wind)",
                                     "UP harvest; thistle painted in APPROVED starter straw colours",
                                     {"wrap_err": we, "post_step": ie})
    rng = random.Random(SEED + 500)
    b = breach_bay(hv, rng)
    we, ie = wrap_error(b)
    bays["run_breach"] = add("run_breach", b, "special",
                             "ONE cut-and-peeled bottom corner per long run (how people get in)",
                             "6. Chain link fences #00 hole (UP), moved to the ground line",
                             {"wrap_err": we, "post_step": ie, "single_placement": True})
    rng = random.Random(SEED + 600)
    b = lean_bay(hv, rng)
    bays["run_lean"] = add("run_lean", b, "special", "leaning/collapsed panel",
                           "UP harvest, sheared", {"single_placement": True})

    # ---- toppers (switchable top course, colorway-grade)
    tb = topper_barb(hv)
    add("topper_barb", tb, "topper", "3-strand barbed top course (any secured yard)",
        "13. Fences and wire #00 barb strip (UP), third strand re-laid")
    tr = topper_razor(grey_pal, random.Random(SEED + 700))
    add("topper_razor", tr, "topper", "razor-coil top (jail/substation/police ONLY)",
        "PAINTED (no concertina in the UP corpus); greys snapped to harvested palette")
    bays["run_barbed"] = add("run_barbed", mount_topper(bays["run_rail_0"], tb), "run_topped",
                             "rail bay wearing the barbed course", "composite of the two above")
    bays["run_razor"] = add("run_razor", mount_topper(bays["run_rail_1"], tr), "run_topped",
                            "rail bay wearing the razor coil (jail/substation/police ONLY)",
                            "composite of the two above")

    # ---- wang pieces
    hub = post_hub(hv)
    add("post_hub", hub, "wang", "line post / corner / T / X / end hub (no floating ends)",
        "6. Chain link fences #01 post (UP), height-extended")
    ns0 = ns_run(hv, False, random.Random(SEED + 800))
    ns1 = ns_run(hv, True, random.Random(SEED + 801))
    add("ns_run_0", ns0, "wang", "NS edge-on run", "assembled from UP harvest columns")
    add("ns_run_1", ns1, "wang", "NS edge-on run with line post", "assembled from UP harvest columns")

    # ---- the gate
    shut, gopen, gsag, frames = cook_gate(hv)
    add("gate_shut", shut, "gate", "gate leaf SHUT (single placement, 2 cells)",
        "13. Fences and wire #10 hinged gate (UP), near-verbatim")
    add("gate_open", gopen, "gate", "gate leaf OPEN (the portal)", "same, leaf swung")
    add("gate_sag", gsag, "gate", "gate sagging open (bottom hinge gone)", "same, leaf sheared")
    for k, f in enumerate(frames):
        add(f"gate_anim_f{k}", f, "gate_anim",
            "gate swing frame (9 over 2 beats @120BPM, leaf-pixel law: posts+mesh frozen)",
            "13. Fences and wire #10 (UP)", {"frame": k, "frames": 9, "beats": 2, "bpm": 120})

    # ================================================================ proofs
    yard = lambda w, h: ground_sheet(banks, "yard_0", w, h)
    road = lambda w, h: ground_sheet(banks, "road_0", w, h)
    dirt = lambda w, h: ground_sheet(banks, "dirt", w, h)

    # (a) 3x3 tiled proof per seamless family (bay tiled 3 across, 3 rows)
    for fam, key in [("run_plain", "run_plain_0"), ("run_rail", "run_rail_0"),
                     ("run_slat", "run_slat_tan"), ("run_trash", "run_trash_0")]:
        b = bays[key]
        W = 3 * BAY
        sheet = yard(W, 3 * H + 44)
        for row in range(3):
            for cx in range(3):
                paste(sheet, b, cx * BAY, 12 + row * H)
        save_png(sheet, f"proof_3x3_{fam}.png")

    # (b) transparency BOTH directions, day AND night, holes must not fill in
    W = 2 * BAY
    strip = bays["run_rail_0"]
    panels = []
    for gfn in (yard, road):
        bg = gfn(W, H + 30)
        day = compose_over(bg, np.concatenate([strip, strip], axis=1)[:, :W], 0, 10)
        panels.append(day)
        panels.append(night(day))
    gap = 6
    ph = panels[0].shape[0]
    sheet = np.zeros((ph * 4 + gap * 3, W, 4), dtype=np.uint8)
    for i, p in enumerate(panels):
        sheet[i * (ph + gap) : i * (ph + gap) + ph] = p
    save_png(sheet, "proof_transparency_bright_dark_day_night.png", scale=2)

    # (c) WANG-16: all 16 neighbour cases composed over ground
    case_px = 3 * CELL
    sheet = np.zeros((4 * (case_px + 26), 4 * (case_px + 10), 4), dtype=np.uint8)
    for case in range(16):
        n, e, s, w = case & 1, case & 2, case & 4, case & 8
        scene = dirt(case_px, case_px)
        def draw_cell(art, cx, cy):
            paste(scene, art, cx * CELL, cy * CELL - CELL + (CELL - art.shape[0] % CELL) % 1)
        def put(art, cx, cy):
            paste(scene, art, cx * CELL, (cy + 1) * CELL - art.shape[0])
        if n:
            put(ns0, 1, 0)
            put(ns0, 1, 1)
        ew_slice = lambda k: bays["run_rail_0"][:, k * CELL : (k + 1) * CELL]
        if w:
            put(ew_slice(1), 0, 1)
        if e:
            put(ew_slice(2), 2, 1)
        if e or w:
            put(ew_slice(1) if w else ew_slice(2), 1, 1)
        if s:
            put(ns0, 1, 1)
            put(ns0, 1, 2)
        bits = sum(1 for b in (n, e, s, w) if b)
        corner = (bits == 2) and not ((n and s) or (e and w))
        if bits == 0 or bits == 1 or corner or bits >= 3:
            put(hub, 1, 1)
        gx = (case % 4) * (case_px + 10)
        gy = (case // 4) * (case_px + 26)
        sheet[gy + 20 : gy + 20 + case_px, gx : gx + case_px] = scene
        label = np.full((10, case_px, 4), 255, dtype=np.uint8)
        label[..., :3] = 30
        sheet[gy + 6 : gy + 16, gx : gx + case_px] = label
    save_png(sheet, "proof_wang16.png", scale=2)

    # (d) gate contact sheet: shut, 9 frames, open, sag — over yard
    per = 2 * CELL + 8
    sheet = np.zeros((H + 40, per * 12, 4), dtype=np.uint8)
    seq = [shut] + frames + [gsag]
    for i, f in enumerate(seq):
        bg = yard(2 * CELL, H + 20)
        paste(bg, f, 0, 10)
        sheet[10 : 10 + H + 20, i * per : i * per + 2 * CELL] = bg
    save_png(sheet, "proof_gate_anim_contact.png", scale=2)

    # (e) ANCHOR COMPOSITE: fence beside the approved perimeter pool + starter,
    #     yard_0 visible THROUGH the mesh, bright + dark ground
    pool = {}
    for e in banks["perim_pool_714"]["pool"]:
        if e["key"] not in pool and e["key"] != "WB4":
            pool[e["key"]] = np.array(Image.open(io.BytesIO(base64.b64decode(e["b64"]))).convert("RGBA"))
    wallrow = np.concatenate([pool[k] for k in sorted(pool)], axis=1)  # 12 x 44
    W = max(3 * BAY, wallrow.shape[1] + 88)
    rows = []
    cap = np.zeros((14, W, 4), dtype=np.uint8)
    # row 1: my rail bay over bright yard
    bg = yard(W, H + 26)
    run3 = np.concatenate([bays["run_rail_0"], bays["run_barbed"], bays["run_razor"]], axis=1)
    paste(bg, run3[:, :W], 0, 8)
    rows += [cap, bg]
    # row 2: my plain bay over dark road at night (light=territory silhouette)
    bg = night(compose_over(road(W, H + 26), np.concatenate([bays["run_plain_0"], bays["run_plain_1"], bays["run_plain_2"]], axis=1)[:, :W], 0, 8))
    rows += [cap, bg]
    # row 3: the approved perimeter wall pool (the ruler) + starter wall/yard
    bg = dirt(W, 64)
    paste(bg, wallrow, 8, 10)
    st = np.concatenate([starter_tile(banks, "wall_0"), starter_tile(banks, "yard_0")], axis=1)
    paste(bg, st, wallrow.shape[1] + 20, 10)
    rows += [cap, bg]
    save_png(np.concatenate(rows, axis=0), "proof_anchor_composite.png", scale=2)

    # (f) contact sheet of every bank tile
    pad = 6
    max_w = max(t["px"][0] for t in tiles) + pad
    row_h = H + 22
    cols = 6
    n_rows = -(-len(tiles) // cols)
    sheet = np.zeros((n_rows * row_h, cols * max_w, 4), dtype=np.uint8)
    sheet[..., :3] = 46
    sheet[..., 3] = 255
    for i, t in enumerate(tiles):
        arr = np.array(Image.open(io.BytesIO(base64.b64decode(t["b64"]))).convert("RGBA"))
        x = (i % cols) * max_w
        y = (i // cols) * row_h + 16
        bg = yard(arr.shape[1], arr.shape[0])
        merged = compose_over(bg, arr, 0, 0)
        sheet[y : y + arr.shape[0], x : x + arr.shape[1]] = merged
    save_png(sheet, "proof_contact_sheet_all.png")

    # ---------------------------------------------------------------- bank
    fam_means = {}
    for t in tiles:
        if "lum_mean" in t["metrics"]:
            fam_means.setdefault(t["family"], []).append(t["metrics"]["lum_mean"])
    bank = {
        "form": "TF-ART-004",
        "merged_with": ["TF-RUN-003 (duplicate, see-through capability + gate anim clauses kept)",
                        "TF-WORLD-003 (slats/topper + two-background proof clauses kept)"],
        "consumers": ["TF-ART-004", "TF-RUN-003", "TF-WORLD-003"],
        "cooked": "2026-08-08",
        "cook": "tools/tfcook/TF-ART-004_cook.py (deterministic, SEED %d)" % SEED,
        "mode": "MIXED — bought UP fence art HARVESTED at native 1:1 (packs '6. Chain link fences', "
                "'13. Fences and wire'); painted only the gaps: razor coil, PVC slats, thistle line, "
                "NS edge-on runs, lean/sag/breach transforms",
        "law": "UNJUDGED. Nothing here is canon until Paolo sweeps it.",
        "geometry": {
            "cell_px": CELL,
            "height_cells": 2,
            "declared_post_pitch_cells": 4,
            "seamless_unit": "the 4-cell post bay (176 px): mesh period 8 | 176, the line post is "
                             "split across the wrap edge so the seam hides UNDER the post, on the "
                             "declared rhythm. 44 px cell slices of one bay rejoin exactly.",
            "wang_contract": "see cook docstring: EW slices + ns_run_* + post_hub compose all 16 "
                             "cases; end cells always render post_hub (no floating end posts); "
                             "gate_* single placement.",
        },
        "declared_periodic": "the diamond mesh is a REGULAR LATTICE (period 8 px), declared to the "
                             "dither check up front; NO keyline on diamonds, NO baked diamond shadow.",
        "pending_paolo": [
            "HEIGHT: cooked at 2 cells (door parity, RUN-003). ART-004 measures 6 ft = ~2.5 cells "
            "and 8 ft storage/jail = ~3.5. The delta is HIS call, never silently picked.",
            "MESH PITCH: spec suggested a painted 4-6 px lattice; his own bought UP fences use an "
            "8 px diamond with genuine holes, so the cook harvested his instead of painting a "
            "substitute. If he wants the finer painted lattice, that is a fresh cook.",
        ],
        "do_not_cook": "NEVER around a suburb house lot — the approved masonry perimeter pool owns "
                       "that boundary (Paolo-approved distinction). Razor topper is jail/substation/"
                       "police ONLY.",
        "coordination": "TF-ART-015's litter drift draws NO fence fabric; judge the two in ONE "
                        "screenshot when both banks exist (this bank's trash line is fence-side only).",
        "anim": {"gate": {"frames": 9, "beats": 2, "bpm": 120,
                          "law": "LEAF-PIXEL: posts and mesh frozen (machine-asserted in cook), leaf only"}},
        "tiles": tiles,
    }
    with open(OUT_BANK, "w") as f:
        json.dump(bank, f)
    print("bank tiles:", len(tiles))
    for t in tiles:
        m = t["metrics"]
        print(" %-16s %3dx%-3d clear%%=%s part%%=%s cols=%s lum=%s sat=%s purple%%=%s wrap=%s" % (
            t["name"], t["px"][0], t["px"][1], m.get("alpha_clear_pct"), m.get("alpha_partial_pct"),
            m.get("colours"), m.get("lum_mean"), m.get("sat"), m.get("purple_pct"), m.get("wrap_err", "-")))

if __name__ == "__main__":
    main()
