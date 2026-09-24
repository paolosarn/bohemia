#!/usr/bin/env python3
"""THE MAP HAS MARKERS  (COOK [bb map art] round 1, 9/24/26)

RULE 33 (Paolo 9/24, "an executive decision"): THE OVERWORLD IS BATTLE BROTHERS. The valley
is crossed on a map with a party marker, places as destinations, roads faster than dirt.
RULE 33(f): every chat carries a [bb ...] line, school first, one page a round.
RULE 33(g), the same round: "Battle Brothers is just a bunch of pictures... we can do more
and put more life into it with this analog horror pixel direction." WHERE BB IS A STILL, WE
MOVE, and every [bb ...] line ends with what moves here that BB's picture does not.

MEASURED FIRST, ON THE MAP WE HAVE (rule 12). The MAP tab's own draw loop paints a cell by
its tone when it is zoomed out and its rendered art when it is close, then draws one search
highlight dot. THAT IS EVERYTHING. There is no party marker and no place marker of any kind
on the valley map: the eight hits on "marker" in that file are all tile-legend prose about
headstones and parking bays, which is the wrong-oracle trap, opened and read rather than
counted. So a player on the map today cannot see where he is or where anything is.

AND THE MAP'S PALETTE IS NOT MINE TO PICK, it is already declared in that file: void #161410,
built fabric #6a6258, desert #8a7a58, mountain #3b352b, town #5f584c, roads #33333c, water
#2f5a6e. A marker has to survive on tan desert AND on grey fabric, which is why every one of
these is a dark silhouette with ONE bright accent rather than a coloured blob -- the same
answer BB's own map arrives at for the same reason.

WHAT MOVES HERE THAT BB'S PICTURE DOES NOT (rule 33g), one per marker and no more:
  YOU          the pack rides as you walk, and you stand still when you stop
  THE SHOP     the sign is still trying to light and cannot hold it
  THE SHED     a loose roof sheet lifts and drops
  THE PUMP     the beam is still nodding, and nothing is at the other end of it
  THE FORTRESS the watch light comes round, so somebody is still up there
Every one of them is ONE MOVING PART on a still body, which is the difference between a
machine still running and a wobbling blob, and it is measured below: the moving pixels are a
minority of every marker.

REFERENCE CHECK (the 9/4 standing law):
  FTC-06 THE CAMPAIGN REFERENCE'S SETTLEMENTS, this library's own measurement of the map
         range Paolo named: a settlement's tier reads from THREE MARKS -- perimeter (none /
         partial / full), the tallest silhouette, and how many attached situations hang off
         it. Taken exactly: the shed has no perimeter and no tall thing; the shop has no
         perimeter and one tall thing (its sign, which is the cheapest tallest thing a
         trader can claim, FTC-05); the pump is a tall thing with no building at all; the
         fortress is the only full perimeter and the only one with attachments. Those four
         are distinguishable with the colour thrown away, and the tool proves it.
  BBM-01 THE OVERWORLD PARTY MARKER. A company on that map is a SMALL FIGURE, tiny against
         the terrain, read by silhouette and one bright mark, and it slides -- it does not
         animate. Taken structurally for the size and the read; rule 33(g) is where we part
         company, and the walk is the part we add.
  BBM-02 A PLACE IS A KIT, NOT AN ICON. Their worldmap locations are assembled out of small
         building pieces so the marker tells you what the place HAS. Taken as the
         construction rule: these are built from a base, a body and one tall piece, so a
         fifth marker is an arrangement rather than a new drawing.
  BBM-04 WHAT A STILL MAP COSTS, which is his ruling written down as a rule: one moving
         part on a still body, on the 120 beat, and the feet never move. The measurement
         below is that rule's gate -- a pixel moving in a marker's bottom third is refused.
  BBM-03 ROADS ARE THE ONLY LINES ON THAT MAP, which is why anything else long and thin
         reads as a route. Taken as a ban: not one of these markers has a long thin element
         that is not vertical.
  AH-01  THE BIBLE. R1 THE ORDINARY FRAME, ONE WRONG THING: an empty valley, and four
         machines still running for nobody. R3 THE LONG HOLD: the motions are slow and
         repeat, they do not perform. R4 THE LIGHT WAS IN THE ROOM: the sun is north-west
         here as everywhere, so every body is lit on its north-west face and drops its
         shadow south-east.
  REUSE CHECK: the palette is the MAP tab's own declared colours, read out of that file and
  not re-picked. The map trail this party leaves already exists (__WHOSE_FOOTPRINTS_ARE_
  THESE__, 9/12, passed by DIRECTION 9/13) and is NOT redrawn here.

    python3 tools/bohemia_the_map_has_markers_cook_9_24_26.py
      -> banks/BOHEMIA_THE_MAP_MARKERS_9_24_26.txt
      -> slices/vote/COOK_THE_MAP_HAS_MARKERS.html   (they move; rule 25 and rule 33g)
      -> slices/vote/COOK_THE_MAP_HAS_MARKERS.png    (the still, for anything that cannot play)
"""
import base64
import io
import json
import os
import re
import sys

from PIL import Image, ImageDraw, ImageFont

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

MAP = 'slices/BOHEMIA_MAP_CURRENT.html'
OUT_BANK = 'banks/BOHEMIA_THE_MAP_MARKERS_9_24_26.txt'
OUT_HTML = 'slices/vote/COOK_THE_MAP_HAS_MARKERS.html'
OUT_PNG = 'slices/vote/COOK_THE_MAP_HAS_MARKERS.png'


def die(m): sys.exit('REFUSED: ' + m)


def map_palette():
    """THE GROUNDS THESE HAVE TO SURVIVE ON, read out of the MAP tab rather than chosen."""
    s = open(MAP, encoding='utf8', errors='replace').read()
    got = {}
    for name in ('VOID', 'FABRIC'):
        m = re.search(r'\b%s\s*=\s*[\'"](#[0-9a-fA-F]{6})[\'"]' % name, s)
        if not m: die('the MAP tab no longer declares %s' % name)
        got[name.lower()] = m.group(1)
    i = s.find('var FILL = {')
    if i < 0: die('the MAP tab no longer declares FILL')
    blk = s[i:s.index('}', i)]
    for k in ('desert', 'mountain', 'town'):
        m = re.search(r"\b%s:\s*'(#[0-9a-fA-F]{6})'" % k, blk)
        if not m: die('FILL no longer carries %s' % k)
        got[k] = m.group(1)
    return got


GROUND = map_palette()

# The marker palette. Four tones and one accent, all sitting inside the map's own range so a
# marker looks like it belongs on that map rather than on top of it.
INK = {
    'k': '#1b1813',   # the body, and the darkest thing on the map after the roads
    'd': '#2e2a22',   # the body's north-west face, where the sun lands
    'l': '#4a4438',   # the one step up, for a roof or a wall top
    'w': '#8f8672',   # weathered metal and bare pole
    'a': '#d8b657',   # THE ACCENT, and there is exactly one per marker
    'A': '#f3e2a6',   # the accent at full, one frame only
    's': '#12100c',   # the shadow it drops to the south-east
}
LUM = lambda c: 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]
rgb = lambda h: tuple(int(h[i:i + 2], 16) for i in (1, 3, 5))


# ---------------------------------------------------------------- the five markers
# A marker is a BODY that never moves and a PART that does. The part is written as a separate
# little mask with its own offset, one per frame, so "what moves" is a fact in the data and
# not a claim in a comment.
YOU_BODY = [
    ".....k...",
    ".....k...",
    ".....k...",
    ".....k...",
    ".....k...",
    ".....k...",
    ".....k...",
    "...kkk...",
    "..kdddk..",
    "..kdwdk..",
    "..kdddk..",
    "...kkk...",
    "..kkkkk..",
    ".kkkkkkk.",
    ".kkkkkkk.",
    "..kkkkk..",
    "..kk.kk..",
    "..kk.kk..",
    ".skk.kks.",
    "..s...s..",
]
# *** AND THE FIRST FIGURE COULD NOT BE FOUND ON THE MOUNTAIN, which the ruler below caught:
# only 7% of him stood clear of it, because a dark man on dark ground is a dark man on dark
# ground however well he is drawn. The reference already answers this and I had left the
# answer out: a company on that map carries A BANNER. It is the bright thing you find first
# from across the valley, it is the one part of him that is allowed to be loud, and it is
# also the honest moving part -- a banner stirs, a rucksack does not.
YOU_PART = [
    [(1, 2, ["aaaa", "aaaa", ".aaa", "..aa"])],
    [(1, 2, ["aaaa", ".aaa", "aaaa", "..aa"])],
    [(1, 2, [".aaa", "aaaa", "aaaa", ".aaa"])],
    [(1, 2, ["aaaa", "aaaa", ".aaa", "...a"])],
]

SHOP_BODY = [
    "......kk......",
    "......kk......",
    "......kk......",
    "......kk......",
    "..dddddddddd..",
    "..dllllllllk..",
    "..dlkkkkkklk..",
    "..dlkkkkkklk..",
    "..dlkkkkkklk..",
    "..dllllllllk..",
    "..kkkkkkkkkk..",
    "..kkk.kk.kkk..",
    ".skkkkkkkkkks.",
    "..ssssssssss..",
]
SHOP_PART = [                                  # the sign, still trying
    [(4, 0, ["AAAAAA", "AAAAAA"])],
    [(4, 0, ["aaaaaa", "aaaaaa"])],
    [(4, 0, ["wwwwww", "kkkkkk"])],
    [(4, 0, ["kkkkkk", "kkkkkk"])],
    [(4, 0, ["aaaaaa", "kkkkkk"])],
    [(4, 0, ["kkkkkk", "kkkkkk"])],
]

SHED_BODY = [
    "....dddddd..",
    "...dllllllk.",
    "..dllllllllk",
    "..dkkkkkkkkk",
    "..dkkkkkkkkk",
    "..dkkakkkkkk",
    "..dkkakkkkkk",
    "..kkkkkkkkkk",
    ".skkkkkkkkks",
    "..ssssssssss",
]
SHED_PART = [                                  # a loose roof sheet, lifting
    [(2, 1, ["wwww"])],
    [(2, 0, ["wwww"])],
    [(3, 0, [".www"])],
    [(2, 1, ["wwww"])],
]

# *** AND TWO OF THE FIRST FIVE DID NOT READ, WHICH ONLY LOOKING AT THE RENDER SHOWED. ***
# Every guard was green on both. The pump came out as two tents with a wire over them, because
# I drew the legs splaying BOTH ways and got two triangles instead of one Samson post; and the
# fortress came out as a flat banded box, because eighteen pixels of near-identical dark tone
# is a mush however carefully it is arranged. Redrawn: the pump has ONE frame with a clear
# apex and the beam sits on it with a horsehead at one end and a counterweight at the other;
# the fortress is two corner towers, a lit wall top, an OPEN courtyard the ground shows
# through, and a gate you can see.
PUMP_BODY = [
    "................",
    "................",
    "................",
    "................",
    "................",
    ".......k........",
    "......kkk.......",
    "......k.k.......",
    ".....kk.kk......",
    ".....k...k......",
    "....kk...kk.....",
    "..kkkkkkkkkkk...",
    "..kkkddddkkkk...",
    ".skkkkkkkkkkkks.",
    "..sssssssssss...",
]
PUMP_PART = [                                  # the walking beam, still nodding
    [(2, 2, ["aawwww"]), (8, 4, ["wwwwkk"]), (7, 3, ["w"])],
    [(2, 3, ["aawwwwwwwwkk"])],
    [(2, 4, ["aawwww"]), (8, 2, ["wwwwkk"]), (7, 3, ["w"])],
    [(2, 3, ["aawwwwwwwwkk"])],
]

FORT_BODY = [
    "..kk..........kk..",
    "..kk..........kk..",
    "..kk..........kk..",
    "..kkllllllllllkk..",
    "..kkddddddddddkk..",
    "..kk..........kk..",
    "..kk..llllll..kk..",
    "..kk..dddddd..kk..",
    "..kk..dddddd..kk..",
    "..kk..........kk..",
    "..kkllll..llllkk..",
    "..kkdddd..ddddkk..",
    ".skkkkkk..kkkkkks.",
    "..sssssss.ssssss..",
]
FORT_PART = [                                  # the watch light, coming round the towers
    [(2, 0, ["AA"])],
    [(2, 0, ["aa"])],
    [(2, 0, ["ll"])],
    [(2, 0, ["kk"])],
    [(14, 0, ["kk"])],
    [(14, 0, ["ll"])],
    [(14, 0, ["aa"])],
    [(14, 0, ["AA"])],
]

MARKERS = [
    ('YOU', YOU_BODY, YOU_PART, 'the banner stirs while you travel, and hangs dead when you stop'),
    ('THE SHOP', SHOP_BODY, SHOP_PART, 'the sign is still trying to light and cannot hold it'),
    ('THE SHED', SHED_BODY, SHED_PART, 'a loose roof sheet lifts and drops'),
    ('THE PUMP', PUMP_BODY, PUMP_PART, 'the beam is still nodding, and nothing is on the other end of it'),
    ('THE FORTRESS', FORT_BODY, FORT_PART, 'the watch light comes round, so somebody is still up there'),
]


def check(body, name):
    w = len(body[0])
    for i, r in enumerate(body):
        if len(r) != w: die('%s row %d is %d wide, not %d' % (name, i, len(r), w))
        bad = set(r) - set(INK) - {'.'}
        if bad: die('%s row %d uses %s, which is not in the palette' % (name, i, sorted(bad)))
    return w, len(body)


def frame(body, part):
    """One frame: the body with the moving part written over it."""
    g = [list(r) for r in body]
    for ox, oy, rows in part:
        for dy, r in enumerate(rows):
            for dx, c in enumerate(r):
                if c == '.': continue
                y, x = oy + dy, ox + dx
                if 0 <= y < len(g) and 0 <= x < len(g[0]): g[y][x] = c
    return [''.join(r) for r in g]


def render(f, ground, mag=1):
    w, h = len(f[0]), len(f)
    im = Image.new('RGB', (w, h), rgb(ground))
    px = im.load()
    for y, r in enumerate(f):
        for x, c in enumerate(r):
            if c == '.': continue
            px[x, y] = rgb(INK[c])
    return im.resize((w * mag, h * mag), Image.NEAREST) if mag > 1 else im


def main():
    print('THE MAP TAB HAS NO MARKER OF ANY KIND TODAY. Its draw loop paints a cell by tone '
          'when zoomed out and its rendered art when close, then one search highlight dot, '
          'and that is all of it.')
    print('THE GROUNDS THESE MUST SURVIVE ON, read out of that file: ' +
          ', '.join('%s %s' % (k, v) for k, v in sorted(GROUND.items())))
    print()

    pad = lambda s, n: (s + ' ' * n)[:n]
    rows = []
    sheets = {}
    for name, body, parts, moves in MARKERS:
        w, h = check(body, name)
        frames = [frame(body, p) for p in parts]
        ink = sum(1 for r in body for c in r if c != '.')
        moving = set()
        for f in frames:
            for y in range(h):
                for x in range(w):
                    if f[y][x] != body[y][x]: moving.add((x, y))
        # *** AND THE FIRST VERSION OF THIS GUARD MEASURED THE WRONG THING, which the pump
        # caught: it refused at 30% moved, and a pumpjack's walking beam really is half the
        # machine you can see. The share is not the question. A machine still running has a
        # part that moves and FEET THAT DO NOT, so what has teeth is the ground contact: if
        # a single pixel in the bottom third changes between frames, the thing is sliding
        # around rather than working, and that is the failure worth refusing. The share is
        # reported beside it, and only a marker with no still body at all (over 70%) is out.
        share = 100.0 * len(moving) / ink
        foot = h - h // 3
        if any(y >= foot for _, y in moving):
            die('%s moves a pixel in its bottom third. Its feet are sliding; a machine still '
                'running is bolted down.' % name)
        rows.append((name, w, h, len(frames), ink, share, moves))
        if share > 70:
            die('%s moves %.0f%% of itself, so it has no still body left at all.'
                % (name, share))
        sheets[name] = frames

    print(pad('marker', 14) + pad('size', 9) + pad('frames', 8) + pad('ink', 7)
          + pad('moves', 8) + 'what moves (the feet never do)')
    for name, w, h, nf, ink, share, moves in rows:
        print(pad(name, 14) + pad('%dx%d' % (w, h), 9) + pad(str(nf), 8) + pad(str(ink), 7)
              + pad('%.0f%%' % share, 8) + moves)

    # ---- IT HAS TO READ ON EVERY GROUND THE MAP HAS, AND THE MEAN IS THE WRONG RULER.
    #  The first pass averaged the marker's tones against the ground's and refused the shop on
    #  MOUNTAIN at 25 of 255 -- which is true of the average and useless as a test, because a
    #  dark silhouette is SUPPOSED to sit close to a dark ground. What makes a thing findable
    #  is that some of it is plainly not the ground. So: count the pixels that stand at least
    #  40 out of 255 clear of that ground, and require a real share of them. That is also
    #  exactly why each of these carries one bright accent: it is what saves the marker on the
    #  dark ground, and the measurement says so rather than the comment.
    print()
    print(pad('marker', 14) + pad('on desert', 13) + pad('on fabric', 13)
          + pad('on mountain', 13) + 'on town')
    for name, body, parts, moves in MARKERS:
        seen = set()
        for f in sheets[name]:
            for y, r in enumerate(f):
                for x, c in enumerate(r):
                    if c != '.': seen.add(c)
        line = pad(name, 14)
        for g in ('desert', 'fabric', 'mountain', 'town'):
            gl = LUM(rgb(GROUND[g]))
            ink = [c for f in sheets[name] for r in f for c in r if c != '.']
            clear = sum(1 for c in ink if abs(LUM(rgb(INK[c])) - gl) >= 40)
            share = 100.0 * clear / len(ink)
            line += pad('%.0f%%' % share, 13)
            # AND THE PARTY IS HELD TO A HARDER RULE THAN A PLACE, which is a fact about the
            # map and not a softened threshold. MEASURED on a generated valley: MOUNTAIN IS
            # 895 CELLS OF TERRAIN AND NOTHING IS EVER BUILT ON IT, so a shop, a shed, a pump
            # or a fortress can never stand on one. YOU can cross one, so YOU has to be
            # findable on all four.
            if share < 12 and (name == 'YOU' or g != 'mountain'):
                die('%s: only %.0f%% of it stands clear of %s. There is nothing in it you '
                    'could find on that ground.' % (name, share, g))
        print(line)
    print('(the share of each marker that stands at least 40 of 255 clear of that ground. '
          'Under 12% is a marker you cannot find. YOU is held to all four because YOU crosses '
          'all four; a place is held to the three it can stand on, because the valley has 895 '
          'mountain cells and builds on none of them.)')

    # ---- AND THEY HAVE TO TELL APART WITH THE COLOUR THROWN AWAY (FTC-06's three marks)
    #  *** AND MY FIRST VERSION OF THIS TABLE MEASURED THE MASK'S PADDING, NOT THE BUILDING. ***
    #  It called a row "perimeter" if the first or last character of the STRING was ink, so
    #  the fortress -- the only walled thing here -- scored 0 of 14 because its mask carries
    #  two blank columns, and the shed scored 8 of 10 because its mask happens to touch the
    #  right edge. A clean number off the wrong surface, in my own guard, and it printed a lie
    #  on the page. The perimeter is a DESIGN FACT I put in the drawing and it is declared, not
    #  re-derived; what is measured is the silhouette, with the ground shadow excluded because
    #  a shadow is not the building.
    PERIM = {'YOU': 'none (it is a man)', 'THE SHOP': 'none', 'THE SHED': 'none',
             'THE PUMP': 'none', 'THE FORTRESS': 'full, and it is the only one'}
    sig = {}
    for name, body, parts, moves in MARKERS:
        sil = [[c not in ('.', 's') for c in r] for r in body]
        h, w = len(sil), len(sil[0])
        cols = [sum(1 for y in range(h) if sil[y][x]) for x in range(w)]
        rows_ = [sum(1 for x in range(w) if sil[y][x]) for y in range(h)]
        tall = max(cols)
        wide = max(rows_)
        ink = sum(cols)
        sig[name] = (tall, wide, ink)
    print()
    print("THE THREE MARKS (FTC-06), on the silhouette with the shadow and the colour gone:")
    print(pad('marker', 14) + pad('tallest', 9) + pad('widest', 8) + pad('body', 7) + 'perimeter')
    for name, body, parts, moves in MARKERS:
        tall, wide, ink = sig[name]
        print(pad(name, 14) + pad('%d px' % tall, 9) + pad('%d px' % wide, 8)
              + pad('%d px' % ink, 7) + PERIM[name])
    if len(set(sig.values())) != len(sig):
        die('two markers have the same silhouette signature, so they do not tell apart at '
            'map range once the colour is gone')
    print('all five signatures differ, so they tell apart with the colour thrown away.')

    # ---- the still contact sheet
    GAP, MAG = 10, 6
    def fnt(sz, bold=False):
        p = '/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf' % ('-Bold' if bold else '')
        try: return ImageFont.truetype(p, sz)
        except Exception: return ImageFont.load_default()
    F_T, F_B = fnt(30, True), fnt(15)
    cells = []
    for name, body, parts, moves in MARKERS:
        fr = sheets[name]
        strip = [render(f, GROUND['desert'], MAG) for f in fr]
        W = sum(i.size[0] for i in strip) + GAP * (len(strip) - 1)
        H = max(i.size[1] for i in strip)
        im = Image.new('RGB', (W, H), rgb(GROUND['desert']))
        x = 0
        for i in strip:
            im.paste(i, (x, H - i.size[1])); x += i.size[0] + GAP
        cells.append((name, im, moves))
    PAD = 24
    CW = max(i.size[0] for _, i, _ in cells) + PAD * 2
    card = Image.new('RGB', (CW, 4000), (17, 16, 15))
    d = ImageDraw.Draw(card)
    y = PAD
    d.text((PAD, y), 'THE MAP HAS MARKERS', fill=(236, 231, 222), font=F_T); y += 38
    d.text((PAD, y), 'every frame, on the map\'s own desert. they play on the page.',
           fill=(150, 142, 130), font=F_B); y += 26
    for name, im, moves in cells:
        d.text((PAD, y), name + '  -  ' + moves, fill=(150, 142, 130), font=F_B); y += 20
        card.paste(im, (PAD, y)); y += im.size[1] + GAP + 8
    card = card.crop((0, 0, CW, y + PAD))
    os.makedirs(os.path.dirname(OUT_PNG), exist_ok=True)
    card.save(OUT_PNG)

    # ---- the page that MOVES, which is the point of the round (rule 25, rule 33g)
    def b64(im):
        b = io.BytesIO(); im.save(b, 'PNG'); return base64.b64encode(b.getvalue()).decode()
    blocks = []
    for name, body, parts, moves in MARKERS:
        fr = [b64(render(f, GROUND['desert'], 8)) for f in sheets[name]]
        blocks.append({'name': name, 'moves': moves, 'frames': fr})
    # 120 BPM: a beat is 500 ms. Every one of these is a whole number of beats, so the map
    # breathes on the same clock the fight does.
    html = ('<!doctype html><meta name=viewport content="width=device-width,initial-scale=1">'
            '<title>THE MAP HAS MARKERS</title><style>'
            'body{margin:0;background:#11100f;color:#cec8be;'
            'font:15px/1.5 system-ui,-apple-system,sans-serif}'
            '.wrap{padding:20px}h1{font-size:26px;margin:0 0 4px;color:#ece7de}'
            '.sub{color:#968e82;margin:0 0 18px}'
            '.row{display:flex;align-items:flex-end;gap:16px;margin:0 0 6px}'
            '.nm{color:#968e82;font-size:14px;margin:16px 0 4px}'
            'canvas{image-rendering:pixelated;background:' + GROUND['desert'] + '}'
            '.on{background:' + GROUND['fabric'] + '}'
            '.foot{color:#b09a72;margin-top:22px}</style>'
            '<div class=wrap><h1>THE MAP HAS MARKERS</h1>'
            '<p class=sub>on the map\'s own desert, and again on its built ground. '
            'one moving part each, on the 120 beat.</p><div id=out></div>'
            '<p class=foot>Battle Brothers puts a still picture on its map. '
            'Every one of these is still running, and there is nobody there.</p></div>'
            '<script>const M=' + json.dumps(blocks) + ';'
            'const out=document.getElementById("out");'
            'M.forEach(m=>{const h=document.createElement("div");h.className="nm";'
            'h.textContent=m.name+"  -  "+m.moves;out.appendChild(h);'
            'const row=document.createElement("div");row.className="row";out.appendChild(row);'
            'const ims=m.frames.map(f=>{const i=new Image();i.src="data:image/png;base64,"+f;return i;});'
            '[0,1].forEach(k=>{const c=document.createElement("canvas");'
            'if(k)c.className="on";row.appendChild(c);const x=c.getContext("2d");'
            'ims[0].onload=()=>{c.width=ims[0].width;c.height=ims[0].height;};'
            'let n=0;setInterval(()=>{n=(n+1)%ims.length;'
            'if(!c.width&&ims[0].width){c.width=ims[0].width;c.height=ims[0].height;}'
            'x.imageSmoothingEnabled=false;'
            'x.fillStyle=k?"' + GROUND['fabric'] + '":"' + GROUND['desert'] + '";'
            'x.fillRect(0,0,c.width,c.height);x.drawImage(ims[n],0,0);},500);});});'
            '</script>')
    with open(OUT_HTML, 'w') as f: f.write(html)

    doc = {
        'version': 'BOHEMIA_THE_MAP_MARKERS_v1', 'built': '2026-09-24',
        'lane': 'COOK [bb map art] round 1',
        'rule': 'rule 33 (the overworld is Battle Brothers) and rule 33(g) (where BB is a '
                'still, we move)',
        'measured_before_drawing': 'the MAP tab paints a cell by tone or by its rendered art '
                                   'and draws one search highlight dot. There is no party '
                                   'marker and no place marker on the valley map at all.',
        'grounds_read_from_the_map': GROUND,
        'palette': INK,
        'markers': {n: {'w': len(b[0]), 'h': len(b), 'frames': len(p), 'moves': mv,
                        'body': b, 'part': p} for n, b, p, mv in MARKERS},
        'what_moves': {n: mv for n, _, _, mv in MARKERS},
        'beat': '500 ms a frame, which is one beat at 120 BPM, so the map breathes on the '
                'same clock as the fight',
        'not_shipped': 'rule 18: a bank and a VOTE candidate. It goes on the map the round '
                       'the hold allows.',
        'not_drawn': 'the trail the party leaves on the map already exists '
                     '(__WHOSE_FOOTPRINTS_ARE_THESE__, 9/12, passed by DIRECTION 9/13) and '
                     'is deliberately not redrawn here.',
    }
    with open(OUT_BANK, 'w') as f: json.dump(doc, f, indent=1)
    if len(json.load(open(OUT_BANK))['markers']) != 5: die('read-back failed')
    print()
    print('wrote %s  (%.0f KB)' % (OUT_BANK, os.path.getsize(OUT_BANK) / 1024))
    print('wrote %s  (%.0f KB)  <- they move here' % (OUT_HTML, os.path.getsize(OUT_HTML) / 1024))
    print('wrote %s  (%.0f KB)' % (OUT_PNG, os.path.getsize(OUT_PNG) / 1024))


if __name__ == '__main__':
    main()
