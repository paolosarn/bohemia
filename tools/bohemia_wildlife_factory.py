#!/usr/bin/env python3
"""BOHEMIA WILDLIFE FACTORY (8/28/26, PEOPLE lane) -- the first animals this
valley has ever had.

REUSE CHECK: opened slices/BOHEMIA_CITY_PROPS.js and read every prop id it
carries -- bag, barrel, barricade, bench, bin, bollard, car, cone, dumpster,
firebarrel, lamp, lighttower, mailbox, pallet, pole, rubble, tyre. Also swept
banks/ for raven / coyote / pigeon / rat. THERE IS NOT ONE ANIMAL IN THE REPO.
Nothing to reuse, so these are cooked, and that sentence is the whole reason
they are cooked.

FACTORY LAW: a typed spec, a generator, a batch, and its own gate.
Spec: SPEC below, one entry per species, and each one is a row of
records/BOHEMIA_RESEARCH_WHAT_LIVES_IN_A_CITY_OF_CORPSES_8_25_26.md section 2.
Output: banks/BOHEMIA_WILDLIFE_SPRITES.js  (palette-indexed, three frames each)
Gate:   gates/wildlife_gate.js

45 DEGREE ART LAW (7/17), AND WHY THIS BANK IS NOT REGISTERED IN art_45_gate.
The law is that everything is seen from the world's three-quarter 45 view. The
existing gate holds that with PROP-SHAPED proxies -- an ellipse stack at the
base, a lit top face over darker wall rows -- because everything registered in
it so far is hardware standing on the ground. A RAVEN HAS NO BASE. Running an
ellipse-stack-base test on a bird is a broken ruler pointed at the wrong
subject, and this repo has spent a month learning to fix the ruler instead of
the target. So the law is held here in the shape a creature has:
  - YOU ARE ABOVE IT. The BACK is the biggest surface in the sprite, which is
    only true from above; a flat side-on animal shows a flank instead.
  - THE TOP IS SKY-LIT. The back rows are lighter than the rows beneath them.
  - IT IS NOT A SILHOUETTE. Every animal carries at least three tones.
  - AND IT IS NOT SYMMETRICAL LEFT TO RIGHT, because a three-quarter view never
    is, and a mirrored blob is the tell that somebody drew it flat.
Every one of those is a claim in gates/wildlife_gate.js.

  python3 tools/bohemia_wildlife_factory.py
"""
import json
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
OUT = 'banks/BOHEMIA_WILDLIFE_SPRITES.js'
W = H = 16

# ---- THE PALETTE -------------------------------------------------------------
# Index 0 is empty. Every animal gets THREE tones plus its details, because a
# two-tone animal is a silhouette with a highlight and reads as a sticker.
PAL = [
    None,        # 0 transparent
    '#0a0a0c',   # 1 raven shadow (under-wing, the parts facing away)
    '#1d1f26',   # 2 raven body
    '#343a4a',   # 3 raven back, sky-lit
    '#5b6478',   # 4 raven sheen, the blue in the black
    '#26301f',   # 5 grackle body (the iridescent dark green-black)
    '#3d4d31',   # 6 grackle back
    '#6f8257',   # 7 grackle sheen
    '#3f4147',   # 8 pigeon shadow
    '#63666e',   # 9 pigeon body
    '#8d9099',   # 10 pigeon back, sky-lit
    '#c9ccd2',   # 11 pigeon wing bar / rump
    '#3a2f26',   # 12 rat shadow
    '#584838',   # 13 rat body
    '#7a6650',   # 14 rat back, sky-lit
    '#a08a6e',   # 15 rat tail / ear
    '#5b4a33',   # 16 coyote shadow
    '#8a7050',   # 17 coyote body
    '#ac9068',   # 18 coyote back, sky-lit
    '#d8c9a8',   # 19 coyote throat + underside
    '#d7c04a',   # 20 an eye
    '#2a2a2a',   # 21 a beak / a leg
]

# ---- THE SPEC ----------------------------------------------------------------
# tones: (shadow, body, back, detail) indexes into PAL
SPEC = [
    {'id': 'raven',   'tones': (1, 2, 3, 4),      'len': 9,  'wide': 6, 'tail': 4,
     'legs': 2, 'beak': 3, 'source': 'common raven, first to a body, a documented '
     'beneficiary of human landscapes'},
    {'id': 'grackle', 'tones': (1, 5, 6, 7),      'len': 7,  'wide': 4, 'tail': 5,
     'legs': 2, 'beak': 2, 'source': 'great-tailed grackle, documented sifting Las '
     'Vegas trash for scraps'},
    {'id': 'pigeon',  'tones': (8, 9, 10, 11),    'len': 7,  'wide': 5, 'tail': 3,
     'legs': 2, 'beak': 1, 'source': 'pigeon, the same urban roster'},
    {'id': 'rat',     'tones': (12, 13, 14, 15),  'len': 8,  'wide': 4, 'tail': 7,
     'legs': 0, 'beak': 0, 'source': 'the urban constant: unlimited food, no '
     'sanitation'},
    {'id': 'coyote',  'tones': (16, 17, 18, 19),  'len': 12, 'wide': 6, 'tail': 5,
     'legs': 4, 'beak': 0, 'source': 'thrived in Las Vegas despite rapid urban '
     'development; the washes are its highway'},
]


def blank():
    return [[0] * W for _ in range(H)]


def ell(px, cx, cy, rx, ry, v):
    """A filled ellipse. THE CROSS-SECTION OF EVERYTHING IS AN ELLIPSE at 45,
    which is the law's own first sentence."""
    for y in range(H):
        for x in range(W):
            dx = (x - cx) / max(0.5, rx)
            dy = (y - cy) / max(0.5, ry)
            if dx * dx + dy * dy <= 1.0:
                px[y][x] = v


def draw_bird(sp, frame):
    """*** THIRD DRAWING, AND EACH REDRAW CAME FROM LOOKING, NOT FROM A NUMBER. ***
    Cut one: a tall oval with the head stacked on top, reasoned from "you are
    above it, so the long axis runs away". Rendered: THREE BOWLING PINS WITH A
    YELLOW EYE.
    Cut two: laid the body down on a diagonal. Better, and still not a bird --
    the body was so big it SWALLOWED the head, the beak and the tail, so all
    three birds read as a lumpy horizontal mass with an eye stuck on the front.
    Cut three, which is this one: SHRINK THE BODY AND LET THE HEAD, THE BEAK AND
    THE TAIL STICK OUT OF IT. At sixteen pixels a bird is not a rendering, it is
    four marks in the right relationship -- a compact back, a head bump above and
    forward of it, a beak spike leaving the silhouette, and a tail spike leaving
    it the other way. Everything that does not leave the silhouette is invisible.
    VERIFY ON THE REAL SURFACE, applied to a cook: a contact sheet, looked at,
    three times. Not one of these three problems is visible in any number."""
    sh, body, back, det = sp['tones']
    px = blank()
    scale = sp['len'] / 9.0
    bx, by = 8.6, 9.4                                  # the body sits back and low
    rx, ry = 3.4 * scale, 2.1 * scale
    ell(px, bx, by, rx, ry, body)
    for y in range(H):                                  # THE BACK IS SKY-LIT
        for x in range(W):
            if px[y][x] == body and y < by - 0.3:
                px[y][x] = back
    for x in range(W):                                  # the far underside falls away
        for y in range(H - 1, -1, -1):
            if px[y][x] == body:
                px[y][x] = sh
                break
    # THE FOLDED WING: one solid stroke along the flank, not a dotted arc.
    for i in range(int(rx * 1.5)):
        x, y = int(bx - rx * 0.6 + i), int(by + 0.2 + i * 0.22)
        if 0 <= x < W and 0 <= y < H and px[y][x]:
            px[y][x] = det
    # THE TAIL: a wedge that LEAVES the body, back and down.
    tl = max(3, int(sp['tail'] * scale))
    for i in range(tl):
        x, y = int(bx + rx - 0.2 + i), int(by + 0.6 + i * 0.6)
        for k in range(2 if i < tl - 1 else 1):
            if 0 <= x < W and 0 <= y + k < H:
                px[y + k][x] = back if (i + k) % 2 == 0 else sh
    # THE HEAD: above and FORWARD of the body, and it must protrude.
    lift = 2.2 if frame == 'look' else 0.0
    hx, hy = bx - rx - 0.9, by - ry - 1.0 - lift
    for i in range(4):                                  # the neck first, so the
        x, y = int(hx + 0.6 + i * 0.6), int(hy + 0.9 + i * 0.55)   # head is joined
        if 0 <= x < W and 0 <= y < H:
            px[y][x] = back
    ell(px, hx, hy, 1.6, 1.5, back)
    ell(px, hx + 0.2, hy - 0.5, 1.0, 0.9, det)          # the lit crown
    # THE BEAK: three pixels OUTSIDE the head, and it is the mark that makes the
    # whole silhouette read as a bird rather than as a stone.
    for i in range(max(2, sp['beak'])):
        x, y = int(hx - 1.4 - i), int(hy + 0.2 + i * 0.5)
        if 0 <= x < W and 0 <= y < H:
            px[y][x] = 21
    ex, ey = int(hx + 0.4), int(hy - 0.4)
    if 0 <= ex < W and 0 <= ey < H:
        px[ey][ex] = 20
    if frame == 'go':
        # FLIGHT INITIATION, the frame this whole feature exists for. Two SOLID
        # wing bars in a V over the back, and the body lifted off the ground.
        up = blank()
        for y in range(H):
            for x in range(W):
                if px[y][x]:
                    ny = y - 3
                    if 0 <= ny < H:
                        up[ny][x] = px[y][x]
        px = up
        for i in range(6):
            for sgn, tone in ((-1, back), (1, det)):
                for th in range(2):
                    x = int(bx + sgn * (1.0 + i * 1.0)) + th
                    y = int(by - 5.0 - i * 0.9)
                    if 0 <= x < W and 0 <= y < H:
                        px[y][x] = tone if th == 0 else sh
    else:
        for i in range(sp['legs']):                     # two legs under the breast
            x = int(bx - 1.2 + i * 2.0)
            for k in range(2):
                y = int(by + ry + k)
                if 0 <= x < W and 0 <= y < H and not px[y][x]:
                    px[y][x] = 21
    return px


def draw_beast(sp, frame):
    """A four-legged animal at three-quarter: the SPINE is the lit top, the
    flank falls away, and the far legs are shorter because they are further."""
    sh, body, back, det = sp['tones']
    px = blank()
    cx, cy = 7.5, 8.5
    L, Wd = sp['len'], sp['wide']
    # the barrel of it, long axis across and slightly down-right (walking away)
    ell(px, cx, cy, L / 2.0, Wd / 2.0, body)
    ell(px, cx - 0.3, cy - 1.0, L / 2.0 * 0.9, Wd / 2.0 * 0.6, back)   # the lit spine
    for y in range(H):
        for x in range(W):
            if px[y][x] == body and y > cy + Wd * 0.18:
                px[y][x] = sh                                          # the flank in shade
    # the pale underside, which every desert canid has and which stops it
    # reading as a silhouette
    for x in range(W):
        for y in range(H - 1, -1, -1):
            if px[y][x] == sh:
                px[y][x] = det
                break
    # THE HEAD, low and forward: it is going somewhere and not looking at you
    hx = cx - L / 2.0 - 1.0
    hy = cy + (0.6 if frame != 'look' else -1.4)
    ell(px, hx, hy, 2.0, 1.7, back)
    ell(px, hx - 0.4, hy - 0.5, 1.3, 1.0, det)
    # THE MUZZLE. Looking at the first batch, the coyote was a blob with legs
    # because its head had no snout: a canid IS its muzzle at this size.
    for i in range(3):
        x, y = int(hx - 1.6 - i), int(hy + 0.4 + i * 0.25)
        if 0 <= x < W and 0 <= y < H:
            px[y][x] = body if i < 2 else sh
        if 0 <= x < W and 0 <= y - 1 < H and i < 2:
            px[y - 1][x] = back
    for i in range(2):                                                  # ears
        x, y = int(hx + 0.4 + i * 1.2), int(hy - 1.9)
        if 0 <= x < W and 0 <= y < H:
            px[y][x] = back
        if 0 <= x < W and 0 <= y + 1 < H and not px[y + 1][x]:
            px[y + 1][x] = det
    ex, ey = int(hx - 0.4), int(hy - 0.3)
    if 0 <= ex < W and 0 <= ey < H:
        px[ey][ex] = 20
    # THE TAIL, down and behind
    for i in range(sp['tail']):
        x = int(cx + L / 2.0 + i * 0.7)
        y = int(cy + 0.6 + i * 0.5)
        if 0 <= x < W and 0 <= y < H:
            px[y][x] = body if i % 2 else sh
    # LEGS: near pair long and dark, far pair SHORTER, which is the whole
    # signature of standing above something rather than beside it
    step = 1 if frame == 'go' else 0
    for i in range(4):
        near = i < 2
        x = int(cx - L / 4.0 + (i % 2) * (L / 2.0) + (step if near else 0))
        y0 = int(cy + Wd / 2.0 - 1)
        span = 4 if near else 2
        for k in range(span):
            y = y0 + k
            if 0 <= x < W and 0 <= y < H:
                px[y][x] = 21 if near else sh
    return px


def draw_rat(sp, frame):
    """Low, long, and the TAIL is most of it. Same rules: you are above it."""
    sh, body, back, det = sp['tones']
    px = blank()
    cx, cy = 7.0, 9.0
    ell(px, cx, cy, sp['len'] / 2.0, sp['wide'] / 2.0, body)
    ell(px, cx - 0.3, cy - 0.7, sp['len'] / 2.0 * 0.9, sp['wide'] / 2.0 * 0.55, back)
    for y in range(H):
        for x in range(W):
            if px[y][x] == body and y > cy + sp['wide'] * 0.2:
                px[y][x] = sh
    hx = cx - sp['len'] / 2.0 - 0.8
    ell(px, hx, cy + (0.3 if frame != 'look' else -1.2), 1.5, 1.2, back)
    for i in range(2):
        x, y = int(hx + 0.3 + i), int(cy - 0.9 + (0 if frame != 'look' else -1.3))
        if 0 <= x < W and 0 <= y < H:
            px[y][x] = det
    ex, ey = int(hx - 0.5), int(cy + (0.1 if frame != 'look' else -1.4))
    if 0 <= ex < W and 0 <= ey < H:
        px[ey][ex] = 20
    # THE TAIL IS NOT THE LIT PART. The first cook painted it in the animal's
    # LIGHTEST tone, and since a rat's tail trails BELOW the body that put the
    # brightest paint in the bottom half: the gate correctly read the whole
    # sprite as lit from underneath. A rat's tail is also not pale in life.
    for i in range(sp['tail']):
        x = int(cx + sp['len'] / 2.0 + i * 0.85)
        y = int(cy + 0.4 + i * 0.55 * (1 if frame != 'go' else -0.6))
        if 0 <= x < W and 0 <= y < H:
            px[y][x] = body if i % 2 else sh
    return px


DRAW = {'raven': draw_bird, 'grackle': draw_bird, 'pigeon': draw_bird,
        'rat': draw_rat, 'coyote': draw_beast}


def rle(px):
    """flat run-length: [value, count, value, count, ...]. Small, and a human
    can read it in a diff."""
    flat = [v for row in px for v in row]
    out, cur, n = [], flat[0], 0
    for v in flat:
        if v == cur:
            n += 1
        else:
            out += [cur, n]; cur, n = v, 1
    out += [cur, n]
    return out


def main():
    frames = ['rest', 'look', 'go']
    bank = {'perspective': 'the 45 DEGREE ART LAW, held in the shape a creature has: '
            'you are ABOVE it, so the back is the biggest lit surface, the far side '
            'falls into shadow, and nothing here is left-right symmetrical',
            'w': W, 'h': H, 'palette': PAL, 'frames': frames, 'animals': []}
    for sp in SPEC:
        row = {'id': sp['id'], 'source': sp['source'], 'frames': {}}
        for f in frames:
            row['frames'][f] = rle(DRAW[sp['id']](sp, f))
        bank['animals'].append(row)
    body = ('/* GENERATED by tools/bohemia_wildlife_factory.py -- do not hand edit.\n'
            '   The first animals in this valley. Roster sourced to\n'
            '   records/BOHEMIA_RESEARCH_WHAT_LIVES_IN_A_CITY_OF_CORPSES_8_25_26.md\n'
            '   section 2 (Nevada and Clark County material), never invented. */\n'
            '(function(r){var B=' + json.dumps(bank, separators=(',', ':')) + ';\n'
            'if(typeof module==="object"&&module.exports)module.exports=B;'
            'else r.BOHEMIA_WILDLIFE_SPRITES=B;'
            '})(typeof self!=="undefined"?self:this);\n')
    open(OUT, 'w', encoding='utf-8').write(body)
    print('=== WILDLIFE FACTORY ===')
    print('  %d animals x %d frames at %dx%d' % (len(SPEC), len(frames), W, H))
    for sp in SPEC:
        print('  %-9s %s' % (sp['id'], sp['source'][:62]))
    print('  wrote %s (%d bytes)' % (OUT, len(body)))


if __name__ == '__main__':
    main()
