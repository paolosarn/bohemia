"""RUN TWO [the starred faces on your screens], 10/18/26 (rule 115(h), THE FIRST STAR).

His fourteenth votes on RUN TWO's screens: 'the portrait sucks' (who is wearing what), 'the portrait is ass, I
can't even stare at it' (scavenge). The face off the same clay model is every face's method now, so the crew
screen and the scavenge screen stop drawing the old flat 64 face from slices/fight_people.

This bakes ONE small bank, slices/rig_faces/, a 128 x 128 face per look the company wears (YOU and the twelve
cast looks), read by engine/bohemia_rig_faces.js. Nothing is painted: every pixel is a render through
DIRECTION's rig, cropped.
  * PORTRAIT's heads from the same model (records/target/portrait/rig/<who>/rig_portrait_S.png, 218 px, a
    head camera): squared on the head and box-filtered to 128.
  * Until PORTRAIT hands a man a head, his face is a rig body's head (rule 115(h)'s row: 'a man shows his rig
    body's head, never the old portrait'): the S still of a rig body, the head found as the alpha's widest
    run above the neck, cropped 32 px square and scaled x4 nearest, so the clay's own pixels show.
Re-run after PORTRAIT lands a head: change its row in BANK to kind 'portrait' and run this.
"""
import json, os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
T = os.path.join(ROOT, 'records', 'target')
OUT = os.path.join(ROOT, 'slices', 'rig_faces')
N = 128

# look -> (kind, source under records/target, who it is). One source per look, never two looks on one head.
BANK = {
    'you':            ('body',     'character/rig/body',   "CHARACTER's player body through the rig"),
    'cast_bedroll':   ('portrait', 'portrait/rig/poacher', "PORTRAIT's poacher head, the first star (LUPE the poacher wears it)"),
    'cast_pack':      ('portrait', 'portrait/rig/thug',    "PORTRAIT's thug head (RAUL the brawler wears it)"),
    'cast_apron':     ('body',     'character/rig/anarchists', "CHARACTER's anarchists body through the rig (COOK THREE's marksman is a box head with no face yet)"),
    'cast_longcoat':  ('body',     'character/rig/mob',      "CHARACTER's mob body through the rig"),
    'cast_barearms':  ('body',     'character/rig/reds',     "CHARACTER's reds body through the rig"),
    'cast_skirt':     ('body',     'character/rig/colorful', "CHARACTER's colorful body through the rig"),
    'cast_widebrim':  ('body',     'character/rig/caravans', "CHARACTER's caravans body through the rig"),
    'cast_cape':      ('body',     'character/rig/church',   "CHARACTER's church body through the rig"),
    'cast_poncho':    ('body',     'character/rig/homeless', "CHARACTER's homeless body through the rig"),
    'cast_shorts':    ('body',     'character/rig/volunteers', "CHARACTER's volunteers body through the rig"),
    'cast_satchel':   ('body',     'character/rig/network',  "CHARACTER's network body through the rig"),
    'cast_shortcoat': ('body',     'character/rig/trades',   "CHARACTER's trades body through the rig"),
}
BG = (11, 9, 7, 255)   # the roster's face well, #0b0907


def from_portrait(src):
    im = Image.open(os.path.join(T, src, 'rig_portrait_S.png')).convert('RGBA')
    l, t, r, b = im.getbbox()
    s = max(r - l, b - t)
    cx = (l + r) // 2
    sq = Image.new('RGBA', (s, s), (0, 0, 0, 0))
    sq.alpha_composite(im.crop((cx - s // 2, b - s, cx - s // 2 + s, b)))
    return sq.resize((N, N), Image.BOX)


def from_body(src):
    im = Image.open(os.path.join(T, src, 'rig_S.png')).convert('RGBA')
    a = im.split()[3]
    l, t, r, b = im.getbbox()
    # the crown is the first row ten pixels wide (a rifle's barrel over the shoulder is narrower)
    t = next(y for y in range(t, b) if sum(1 for x in range(im.width) if a.getpixel((x, y)) > 128) >= 10)
    best = None
    for y in range(t, t + int((b - t) * 0.25)):
        xs = [x for x in range(im.width) if a.getpixel((x, y)) > 128]
        if xs and (best is None or xs[-1] - xs[0] > best[1] - best[0]):
            best = (xs[0], xs[-1])
    cx = (best[0] + best[1] + 1) // 2
    k = 32
    box = Image.new('RGBA', (k, k), (0, 0, 0, 0))
    box.alpha_composite(im.crop((cx - k // 2, t - 2, cx - k // 2 + k, t - 2 + k)))
    return box.resize((N, N), Image.NEAREST)


def main():
    os.makedirs(OUT, exist_ok=True)
    rows = {}
    for look, (kind, src, who) in BANK.items():
        face = from_portrait(src) if kind == 'portrait' else from_body(src)
        bg = Image.new('RGBA', (N, N), BG)
        bg.alpha_composite(face)
        name = look + '.webp'
        bg.convert('RGB').save(os.path.join(OUT, name), 'WEBP', lossless=True)
        rows[look] = {'file': name, 'kind': kind, 'from': 'records/target/' + src, 'who': who}
    srcs = [r['from'] for r in rows.values()]
    assert len(set(srcs)) == len(srcs), 'two looks on one head'
    json.dump({'lane': 'RUN TWO', 'rule': '115(h)', 'size': N, 'faces': rows}, open(os.path.join(OUT, 'rig_faces.json'), 'w'), indent=1)
    print(len(rows), 'faces ->', OUT)


if __name__ == '__main__':
    main()
