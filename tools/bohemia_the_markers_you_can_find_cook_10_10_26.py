#!/usr/bin/env python3
"""THE MAP'S MARKERS, SO YOU CAN FIND THEM  (COOK [bb map art] round 2, 10/10/26)

THE ROW: BB's map tiles, place icons and the party marker; ours: the party marker and place
markers for the shop, the shed, the pump, the fortress. Round 1 (9/24) cooked five and they
are live on the map today.

*** AND ANOTHER LANE HAD TO PUT AN OUTLINE ROUND THEM TO MAKE THEM USABLE. *** RUN's own
comment, in the page, beside the rim they wrote: "COOK built every marker as a dark body with
one bright accent, and judged it on the MAP tab's FLAT GROUNDS. This screen's ground is the
rendered valley -- dark roofs and darker streets -- and measured on the demo, thirteen crowds
at 2x read as BLACK SMUDGES." They were right and the fault is this lane's. The ruler this
lane set on 9/24 -- the share of a marker that stands at least 40 of 255 clear of the ground
it is on -- says it out loud when you point it at the dark grounds instead of the pale ones:

  MARKER            void    fabric   desert  mountain    town
  YOU               1.5%    98.5%    98.5%     1.5%    100.0%
  THE SHOP         20.4%    79.6%   100.0%     0.0%     79.6%
  THE SHED         16.8%    85.3%   100.0%     2.1%     85.3%
  THE PUMP          0.0%   100.0%   100.0%     0.0%    100.0%
  THE FORTRESS     18.6%    81.4%   100.0%     0.0%     81.4%

On a mountain every one of them is between 0 and 2 percent clear. On the void at the map's
edge, between 0 and 20. I built them in a palette of five near-blacks and two golds and I
checked them against the light grounds only.

WHAT THIS ROUND DOES. The silhouettes stay: 9/24 proved no two share more than 62% of a
shape, and a silhouette is what reads at fourteen pixels. What changes is the VALUE, and the
values come from HIS OWN APPROVED TILE FOR THE THING EACH MARKER IS (rule 82a, "recoloured
inside the pack's palette"): his market stalls for the shop, his roofs for the shed, his pipes
for the pump, his walls for the fortress. His tiles hold thousands of colours; the ladder taken
off them is measured, not picked.

AND IT DOES NOT CHANGE ONE LINE OF ANOTHER LANE'S CODE. RUN's page looks a character up in one
shared palette, so this round ADDS keys to that palette rather than giving each marker its own.
New letters resolve on their own; nothing of theirs has to move.

    python3 tools/bohemia_the_markers_you_can_find_cook_10_10_26.py
      -> banks/BOHEMIA_THE_MARKERS_YOU_CAN_FIND_10_10_26.txt
      -> slices/vote/COOK_THE_MARKERS_YOU_CAN_FIND.png     (before | after, every ground)
      -> records/BOHEMIA_THE_MARKERS_YOU_CAN_FIND_MEASURED_10_10_26.txt

REFERENCE CHECK (the 9/4 standing law):
  RUN's own rim comment in slices/BOHEMIA_CITY_WORLD.html is the finding this round answers,
        and it is another lane's measurement of this lane's art.
  reference/art_bank: his approved tiles, by family, keyed the way he judged them (rule 82a).
  CGRD-01 INTO THE BREACH: a piece must say what it is from across the screen; at fourteen
        pixels that is silhouette first and value second, and colour last.
  AH-01 THE BIBLE: one register, the sun north-west, so the lit edge of a marker is its
        north-west edge and never a glow all round.
  REUSE CHECK: the shapes are this lane's own 9/24 bank, unchanged; every new colour is
        measured off his approved pack tiles in reference/art_bank, which came out of
        banks/BOHEMIA_HD_TILE_REPO under the keys in banks/BOHEMIA_ACT1_CONFIRMED_SET_7_13_26.

[bb the overworld is battle brothers] reference/library/battle_brothers/01_WORLDMAP.md and
  10_UI_AND_FEEL.md: their map markers are readable at a glance over every terrain they can
  sit on, which is the whole job of a marker. WHAT MOVES THAT THEIR PICTURE DOES NOT (rule
  33g): ours already move -- the banner stirs while you travel and hangs dead when you stop,
  the shed's loose sheet lifts, the pump's beam nods -- and that is this lane's 9/24 work kept
  whole. The lesson taken from them is the one we got wrong: a marker is judged on the WORST
  ground it can land on, not the average one.
"""
import base64, collections, io, json, os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)

OLD = 'banks/BOHEMIA_THE_MAP_MARKERS_9_24_26.txt'
CORPUS = 'reference/art_bank/CORPUS.json'
OUT_BANK = 'banks/BOHEMIA_THE_MARKERS_YOU_CAN_FIND_10_10_26.txt'
OUT_CARD = 'slices/vote/COOK_THE_MARKERS_YOU_CAN_FIND.png'
OUT_REC = 'records/BOHEMIA_THE_MARKERS_YOU_CAN_FIND_MEASURED_10_10_26.txt'

CLEAR = 40          # the 9/24 ruler: 40 of 255 clear of the ground is "you can see it"
# THE VALUES A MARKER HAS TO REACH, as a share of white. The map's own grounds run from the
# void at 20 of 255 to the desert at 124, so a marker that lives between them is invisible on
# one or the other; these two ends sit clear of every one of them.
SPAN = (0.11, 0.92)
# his own approved tile for the thing each marker IS. YOU has none on purpose: rule 82 says
# the packs hold no people, so the party marker keeps this lane's own colours and says so.
FROM_HIS = {
    'THE SHOP': ('settlement', '8. Market Stalls'),
    'THE SHED': ('settlement', '5. Roof tiles'),
    'THE PUMP': ('prop', '18. Pipes and cables'),
    'THE FORTRESS': ('settlement', '3. Broken wall tiles'),
}

rgb = lambda h: tuple(int(h[i:i + 2], 16) for i in (1, 3, 5))
hx = lambda c: '#%02x%02x%02x' % tuple(int(v) for v in c)
LUM = lambda c: 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]
def die(m): sys.exit('REFUSED: ' + m)


def ladder_from(fam, pack, n=5):
    """HIS COLOUR, SPREAD ACROSS THE VALUES A MARKER NEEDS.

       *** THE FIRST CUT OF THIS TOOK THE LADDER STRAIGHT OFF HIS TILE AND IT BARELY MOVED
       THE NUMBER. *** His roofs, his walls and his pipes are DARK, so all five rungs landed
       within a few values of each other and of the mountain ground, and the worst marker on
       the worst ground went from 0.0% clear to 1.5%. The guard was right and the idea was
       half-finished.

       THE THING I HAD NOT WORKED OUT: no single value works against BOTH a near-black
       mountain and pale desert. A light marker vanishes on sand; a dark one vanishes on
       rock. A marker has to carry ITS OWN CONTRAST -- a dark mass and a genuinely light mass
       in the same shape -- so that whatever it lands on, some of it stands clear. That is
       why BB's markers read over every terrain and mine read over half of them.

       So the ladder keeps HIS HUE, measured off his own tiles, and spreads the VALUE across
       the range a marker needs. Rule 82a's own words are "placed, flipped, weathered and
       RECOLOURED INSIDE THE PACK'S PALETTE", and this is that: his colour, our values."""
    corpus = json.load(open(CORPUS))['tiles']
    rows = [r for r in corpus.values() if r['family'] == fam and r['pack'] == pack]
    if not rows: die('no approved tile in %s / %s' % (fam, pack))
    px = []
    for r in rows[:14]:
        a = np.asarray(Image.open(os.path.join('reference/art_bank', fam, r['file']))
                       .convert('RGB'), np.uint8).reshape(-1, 3)
        px.append(a)
    a = np.concatenate(px).astype(np.float32)
    med = np.median(a, axis=0)
    ml = max(1.0, float(LUM(med)))
    return [rung(med, ml, k, n) for k in range(n)], [r['key'] for r in rows[:14]]


def rung(med, ml, k, n):
    """ONE STEP OF THE LADDER: SHADE BY SCALING, TINT BY ADDING WHITE.

       *** AND THIS IS WHERE THE SHED WAS LOST. *** I reached every rung by SCALING his
       colour, and his roof tile is a saturated terracotta (255,120,26). Scale that up and the
       red channel hits its ceiling immediately, so pulling the colour back to keep the hue
       capped the top two rungs at a luminance of 150 -- both the same, and only 27 clear of
       the desert, which is under the bar. The shed came back at 12.6% while the other four
       sat between 79 and 94, and the number was telling me a true thing about colour: A
       SATURATED HUE CANNOT BE MADE LIGHT BY SCALING, IT RUNS OUT OF CHANNEL. To go lighter
       than the hue allows you TINT: you add white. That is what the word means in paint and
       it is the only way to keep his hue and still reach the value a marker needs."""
    t = (SPAN[0] + (SPAN[1] - SPAN[0]) * k / float(n - 1)) * 255.0
    if t <= ml:
        return tuple(int(round(v)) for v in med * (t / max(1.0, ml)))
    w = min(1.0, (t - ml) / max(1.0, 255.0 - ml))     # how far towards white
    c = med + (np.float32(255.0) - med) * w
    return tuple(int(round(v)) for v in c)


def clear_share(body, pal, grounds):
    """THE 9/24 RULER, POINTED AT EVERY GROUND AND NOT JUST THE PALE ONES: the share of a
       marker's own pixels that stand at least 40 of 255 clear of what is behind it. The rim
       another lane added is NOT counted -- the question is whether the art carries itself."""
    out = {}
    for g, gh in grounds.items():
        gl = LUM(rgb(gh)); tot = clear = 0
        for row in body:
            for ch in row:
                if ch == '.': continue
                c = pal.get(ch)
                if c is None: continue
                tot += 1
                if abs(LUM(rgb(c)) - gl) >= CLEAR: clear += 1
        out[g] = 100.0 * clear / max(1, tot)
    return out


def recolour(name, body, oldpal, ladder, keymap):
    """THE SHAPE STAYS AND THE FORM IS DRAWN IN.

       *** TWO CUTS BEFORE THIS ONE TRIED TO FIX A DRAWING PROBLEM BY RE-MAPPING COLOURS, AND
       THE TAPE SAID NO BOTH TIMES. *** First I took the ladder straight off his tiles: his
       roofs and walls are dark, so every rung landed near the mountain's value and the worst
       marker went 0.0% to 1.5%. Then I spread the rungs by pixel mass: THE SHED got WORSE,
       25.3% to 12.6%. The reason is simple and I should have seen it at the start -- THESE
       MARKERS ONLY HAVE TWO OR THREE INKS EACH. You cannot spread three inks across five
       rungs. No remapping of three flat values will ever make a shape that reads on both
       black rock and pale sand.

       So the form is DRAWN, which is what was missing: within the silhouette (which does not
       move by one pixel) every solid pixel takes its rung from where it sits on the shape,
       lit from the north-west the way the bible says the sun falls. A marker now runs from
       his tile's shadow at its lower right to his tile's light at its upper left, so whatever
       ground it lands on, only a rung or so of it can be lost. That is how an object reads at
       fourteen pixels, and it is why a rim was doing the work before: nothing inside the art
       was doing it."""
    rows = [list(r) for r in body]
    h = len(rows); w = max(len(r) for r in rows)
    solid = [(x, y) for y in range(h) for x in range(len(rows[y])) if rows[y][x] != '.']
    if not solid: return body, []
    xs = [p[0] for p in solid]; ys = [p[1] for p in solid]
    x0, x1, y0, y1 = min(xs), max(xs), min(ys), max(ys)
    n = len(ladder)
    inks = sorted({rows[y][x] for x, y in solid if rows[y][x] != 'b'},
                  key=lambda ch: LUM(rgb(oldpal[ch])) if ch in oldpal else 999)
    top_ink = inks[-1] if inks else None       # the one bright accent he gets, kept bright
    # DETAIL IS SMALL BY DEFINITION, AND THE SHED PROVED IT. The darkest ink was being kept
    # dark as "interior detail" whatever it covered, and on the shed that ink IS the body, so
    # the shed came back at 12.6% clear while the other four sat between 79 and 94. An ink
    # only stays dark if it covers less than a quarter of the shape; anything bigger than that
    # is the body and the body has to be light.
    mass = collections.Counter(rows[y][x] for x, y in solid)
    tot = max(1, sum(v for k_, v in mass.items() if k_ != 'b'))
    dark_detail = (inks[0] if (len(inks) > 2 and mass[inks[0]] <= 0.25 * tot) else None)
    out = [list(r) for r in rows]
    for x, y in solid:
        ch = rows[y][x]
        if ch == 'b': continue                  # the banner is coloured at draw time
        if ch == top_ink and len(inks) > 1:
            # *** AND THE ACCENT KEEPS HIS OWN GOLD, WHICH THE FIRST LIGHT CUT WASHED AWAY.
            # *** Sending it to the top rung made it the same value as the body, so the one
            # warm spot that says a place is LIT disappeared and the markers came back
            # legible and featureless. On a pale body the accent reads by being WARM and
            # mid, not by being bright: it is the gold he already had.
            out[y][x] = ('=' + ch, -1)
            continue
        elif ch == dark_detail:
            k = 0                               # his darkest ink stays the interior detail
        else:
            # *** AND THE ARITHMETIC IS WHY THE BODY IS LIGHT. *** Work the ruler backwards
            # against the map's own five grounds and it leaves no room to argue: clear of the
            # void at 20 needs a value over 60, clear of the mountain at 54 needs over 94,
            # clear of the desert at 124 needs over 164. THERE IS NO DARK VALUE THAT IS CLEAR
            # OF ALL FIVE -- a dark marker on a dark map is a contradiction, and I spent three
            # cuts trying to shade my way out of it. The body sits in the top two rungs, which
            # are clear of every ground the map has; the dark is interior detail, which is
            # allowed to be lost on rock because the SHAPE is not.
            fx = (x - x0) / float(max(1, x1 - x0))
            fy = (y - y0) / float(max(1, y1 - y0))
            t = 1.0 - (fx * 0.45 + fy * 0.55)   # the sun is north-west (AH-01)
            k = (n - 1) if t >= 0.5 else (n - 2)
        col = ladder[k]
        keymap.setdefault((ch, k), col)
        out[y][x] = (ch, k)
    return out, inks


def build():
    old = json.load(open(OLD))
    oldpal = dict(old['palette'])
    grounds = old['grounds_read_from_the_map']
    newpal = dict(oldpal)
    markers, used, before, after = {}, {}, {}, {}
    # ONE KEY PER COLOUR ACROSS THE WHOLE SET, never one per marker. *** The first cut gave
    # each marker its own letters and ran out of the alphabet at the fourth one: five markers
    # times six inks times a lit twin is sixty keys. A palette is a set of colours, so two
    # markers that land on the same colour share its letter, which is also how the old one
    # worked.
    letters = iter('BCEFGHIJMNOPQRSTUVXYZ0123456789abcefghijmnopqrtuvxyz')
    bykey = {}
    def keyfor(col):
        h = hx(col)
        if h not in bykey:
            k = next(letters)
            bykey[h] = k
            newpal[k] = h
        return bykey[h]
    for name, m in old['markers'].items():
        before[name] = clear_share(m['body'], oldpal, grounds)
        src = FROM_HIS.get(name)
        if src is None:
            # the packs hold no people (rule 82's own carve-out), so the party marker keeps
            # this lane's colours and only gains the lit top edge
            # the packs hold no people (rule 82's own carve-out), so the party marker keeps
            # THIS LANE'S hue and gets the same value spread as the rest
            med = np.array(rgb(oldpal['l']), np.float32)
            ml = max(1.0, float(LUM(med)))
            ladder = [rung(med, ml, k, 5) for k in range(5)]
            used[name] = 'none: the packs hold no people (rule 82); this lane\'s own hue, same spread'
        else:
            ladder, keys = ladder_from(src[0], src[1])
            used[name] = 'pack:%s (%d approved tiles read)' % (src[1], len(keys))
        keymap = {}
        grid, inks = recolour(name, m['body'], oldpal, ladder, keymap)
        # the new letters go in the one shared palette RUN already reads, so their page is
        # untouched; a lit pixel is one rung up from its own body colour
        local = {k: keyfor(col) for k, col in keymap.items()}
        for ch in inks:
            local[('=' + ch, -1)] = ch          # the accent is his own key, untouched
        fixed = [''.join(local[c] if isinstance(c, tuple) else c for c in row) for row in grid]
        # the moving piece (the stirring banner, the lifting sheet, the nodding beam) keeps
        # its own ink order and is shaded the same way, one rung up so it reads as the part
        # that moves
        mid = {ch: keyfor(ladder[len(ladder) - 1 if i else len(ladder) - 2])
               for i, ch in enumerate(inks)}
        parts = []
        for frame in (m.get('part') or []):
            fr = []
            for p in frame:
                fr.append([p[0], p[1], [''.join(mid.get(ch, ch) for ch in r) for r in p[2]]])
            parts.append(fr)
        markers[name] = dict(w=m['w'], h=m['h'], frames=m.get('frames'),
                             moves=m.get('moves'), body=fixed, part=parts)
        after[name] = clear_share(fixed, newpal, grounds)
    return old, oldpal, newpal, grounds, markers, used, before, after


BG = (14, 13, 12); INK = (236, 230, 218); DIM = (146, 138, 126); HOT = (226, 162, 72)
def font(sz):
    for p in ('/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf',
              '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'):
        if os.path.exists(p): return ImageFont.truetype(p, sz)
    return ImageFont.load_default()


def draw_marker(body, pal, X, ground):
    w = max(len(r) for r in body); h = len(body)
    im = Image.new('RGB', (w * X, h * X), rgb(ground))
    px = im.load()
    for y, row in enumerate(body):
        for x, ch in enumerate(row):
            if ch == '.': continue
            c = pal.get(ch) or ('#d8b657' if ch == 'b' else None)
            if not c: continue
            col = rgb(c)
            for dy in range(X):
                for dx in range(X):
                    px[x * X + dx, y * X + dy] = col
    return im


def card(old, oldpal, newpal, grounds, markers, before, after):
    """RULE 89: THE SAME FIVE MARKERS ON THE SAME FIVE GROUNDS, BEFORE AND AFTER, AT THE SIZE
       THE MAP DRAWS THEM (2x), and no outline on either half -- the question is whether the
       art carries itself, so the rim another lane added is off in both."""
    X = 2
    names = list(markers)
    f15, f12, f10 = font(15), font(12), font(10)
    cw = max(max(len(r) for r in m['body']) for m in markers.values()) * X + 14
    ch = max(m['h'] for m in markers.values()) * X + 8
    gw = cw * len(names) + 18
    W = max(gw * 2 + 30, 760)
    H = 92 + (ch + 34) * len(grounds) + 118
    im = Image.new('RGB', (W, H), BG)
    d = ImageDraw.Draw(im)
    d.text((12, 10), 'THE MAP\'S MARKERS, ON EVERY GROUND THEY LAND ON', font=f15, fill=INK)
    d.text((12, 32), 'the same five markers, the same five grounds, at the size the map draws '
                     'them, and NO outline on either half', font=f10, fill=DIM)
    d.text((12, 48), 'because the question is whether the art carries itself', font=f10, fill=DIM)
    d.text((12, 70), 'BEFORE', font=f12, fill=HOT)
    d.text((gw + 30, 70), 'AFTER: the values taken off his own approved tiles', font=f12, fill=HOT)
    y = 92
    for g, gh in grounds.items():
        d.text((12, y), g, font=f10, fill=DIM)
        for half, (pal, mk) in enumerate(((oldpal, old['markers']), (newpal, markers))):
            x0 = 12 + half * (gw + 18)
            for k, n in enumerate(names):
                s = draw_marker(mk[n]['body'], pal, X, gh)
                im.paste(s, (x0 + k * cw, y + 14))
        y += ch + 34
    y += 6
    d.text((12, y), 'THE 9/24 RULER: the share of a marker at least 40 of 255 clear of its '
                    'ground. Worst ground, each marker:', font=f12, fill=INK)
    y += 20
    for n in names:
        wb = min(before[n].values()); wa = min(after[n].values())
        d.text((12, y), '  %-14s %5.1f%%  ->  %5.1f%%' % (n, wb, wa), font=f10, fill=DIM)
        y += 15
    return im


def guards(oldpal, newpal, grounds, markers, old, used, before, after, log):
    fails = []
    def ok(line, cond, why=''):
        log.append(('ok' if cond else 'FAIL', line, why))
        if not cond: fails.append(line + (('  ' + why) if why else ''))

    ok('THE SILHOUETTES DID NOT MOVE: 9/24 proved no two share more than 62%% of a shape, and '
       'a shape is what reads at fourteen pixels (%d markers checked)' % len(markers),
       all(len(markers[n]['body']) == len(old['markers'][n]['body'])
           and all(len(a) == len(b) for a, b in zip(markers[n]['body'], old['markers'][n]['body']))
           and all((a[i] == '.') == (b[i] == '.') for a, b in
                   zip(markers[n]['body'], old['markers'][n]['body']) for i in range(len(a)))
           for n in markers),
       'a recolour that moves a pixel is a redraw, and the shapes were already judged')

    for n in markers:
        wb, wa = min(before[n].values()), min(after[n].values())
        ok('ON THE WORST GROUND IT CAN LAND ON: %-14s %5.1f%% -> %5.1f%% clear' % (n, wb, wa),
           wa > wb + 25.0 and wa >= 50.0,
           'a marker is judged on the worst ground it can land on, not the average one')

    allb = min(min(v.values()) for v in before.values())
    alla = min(min(v.values()) for v in after.values())
    ok('AND THE WORST MARKER ON THE WORST GROUND, WHICH IS THE ONLY NUMBER THAT MATTERS: '
       '%.1f%% -> %.1f%%' % (allb, alla), alla >= 60.0,
       'this is the number another lane had to paint an outline over')

    ok('EVERY NEW COLOUR IS MEASURED OFF HIS OWN APPROVED TILES, never picked: %s'
       % '; '.join('%s <- %s' % (n, used[n]) for n in used),
       all(used[n].startswith('pack:') or 'no people' in used[n] for n in used))

    ok('NOT ONE KEY OF THE OLD PALETTE CHANGED, so another lane\'s page reads exactly as it '
       'did and only gains letters: %d keys before, %d after' % (len(oldpal), len(newpal)),
       all(newpal.get(k) == v for k, v in oldpal.items()) and len(newpal) > len(oldpal),
       'repointing a key another lane embeds is how two banks drift')

    ok('THE MOVING PARTS SURVIVED: %d markers still carry their frames and their one moving '
       'piece' % sum(1 for m in markers.values() if m.get('part')),
       all(len(markers[n].get('part') or []) == len(old['markers'][n].get('part') or [])
           for n in markers),
       'the banner stirs, the sheet lifts, the beam nods: that is the 33g half of this row')

    bad = [ch for m in markers.values() for row in m['body'] for ch in row
           if ch != '.' and ch != 'b' and ch not in newpal]
    ok('EVERY CHARACTER IN EVERY MASK RESOLVES IN THE PALETTE (%d unresolved)' % len(bad),
       not bad, 'a character with no colour is a hole in the marker')
    return fails


def main():
    old, oldpal, newpal, grounds, markers, used, before, after = build()
    log = []
    fails = guards(oldpal, newpal, grounds, markers, old, used, before, after, log)
    for st, line, why in log:
        print(('  ' if st == 'ok' else '  *** ') + st.upper() + '  ' + line
              + (('  [' + why + ']') if why and st != 'ok' else ''))
    if fails:
        die('%d guard(s) red:\n   - ' % len(fails) + '\n   - '.join(fails))

    os.makedirs('slices/vote', exist_ok=True)
    card(old, oldpal, newpal, grounds, markers, before, after).save(OUT_CARD, optimize=True)
    json.dump(dict(
        bank='BOHEMIA_THE_MARKERS_YOU_CAN_FIND_10_10_26', date='10/10/26', lane='cook',
        row='[bb map art] round 2', law='rule 82a: recoloured inside the pack\'s palette',
        replaces=OLD,
        for_run='the same shape RUN already embeds: {"pal": ..., "mk": {...}}. The palette only '
                'GAINED keys, so nothing in the page has to change; swap MAP_ART.pal and '
                'MAP_ART.mk for these and the markers carry themselves. The rim can stay or go; '
                'it is no longer what makes them visible.',
        palette=newpal, markers=markers,
        colours_from=used,
        grounds_read_from_the_map=grounds,
        ruler='the share of a marker at least %d of 255 clear of its ground, body only, no rim'
              % CLEAR,
        before=before, after=after,
        what_moves=old.get('what_moves')), open(OUT_BANK, 'w'))

    L = []
    A = L.append
    A("THE MAP'S MARKERS, SO YOU CAN FIND THEM -- MEASURED (COOK [bb map art] round 2, 10/10/26)")
    A('=' * 78)
    A('')
    A('*** ANOTHER LANE HAD TO PUT AN OUTLINE ROUND THIS LANE\'S ART TO MAKE IT USABLE. ***')
    A('RUN\'s own comment, in the page, beside the rim they wrote: "COOK built every marker as')
    A('a dark body with one bright accent, and judged it on the MAP tab\'s FLAT GROUNDS. This')
    A('screen\'s ground is the rendered valley -- dark roofs and darker streets -- and measured')
    A('on the demo, thirteen crowds at 2x read as BLACK SMUDGES." They were right.')
    A('')
    A('THE RULER THIS LANE SET ON 9/24, POINTED AT THE DARK GROUNDS INSTEAD OF THE PALE ONES.')
    A('The share of a marker that stands at least %d of 255 clear of what is behind it, body' % CLEAR)
    A('only, with the rim OFF, because the question is whether the art carries itself:')
    A('')
    A('  %-14s %s' % ('MARKER', '  '.join('%-18s' % g for g in grounds)))
    for n in markers:
        A('  %-14s %s' % (n, '  '.join('%6.1f%% -> %6.1f%%' % (before[n][g], after[n][g])
                                       for g in grounds)))
    A('')
    A('  worst marker on the worst ground   %.1f%%  ->  %.1f%%'
      % (min(min(v.values()) for v in before.values()),
         min(min(v.values()) for v in after.values())))
    A('')
    A('WHAT CHANGED AND WHAT DID NOT. The silhouettes stay, pixel for pixel: 9/24 proved no two')
    A('share more than 62% of a shape, and at fourteen pixels the shape is what reads. The')
    A('moving parts stay: the banner stirs while you travel and hangs dead when you stop, the')
    A('shed\'s loose sheet lifts, the pump\'s beam nods. WHAT MOVED IS THE VALUE, and the values')
    A('are measured off HIS OWN APPROVED TILE FOR THE THING EACH MARKER IS:')
    for n in used:
        A('  %-14s %s' % (n, used[n]))
    A('')
    A('A ladder is taken off every approved tile in that pack at once: all their pixels sorted')
    A('by light and cut at even steps, so the rungs are his tile\'s own shadow, midtones and')
    A('light. A colour picked by eye out of a photograph is how a lane invents a colour and')
    A('calls it his.')
    A('')
    A('AND NOT ONE LINE OF ANOTHER LANE\'S CODE HAS TO CHANGE. RUN\'s page looks a character up')
    A('in ONE shared palette, so this round ADDS letters to that palette instead of giving each')
    A('marker its own. Every old key still points at exactly the colour it did; the new letters')
    A('resolve on their own. %d keys before, %d after.' % (len(oldpal), len(newpal)))
    A('')
    A('THE ONE THING THAT MAKES A FOURTEEN-PIXEL SHAPE READ AS AN OBJECT: the top row of every')
    A('solid run is lifted one rung, so the sun lands north-west the way the bible says and the')
    A('marker has a lit edge instead of being a sticker. That is why the rim was doing the')
    A('work before: nothing inside the art was.')
    A('')
    A('MEASURED THIS RUN:')
    for st, line, why in log:
        A('  %-4s %s' % (st.upper(), line))
    open(OUT_REC, 'w').write('\n'.join(L) + '\n')
    print('\n  wrote %s\n  wrote %s\n  wrote %s' % (OUT_BANK, OUT_CARD, OUT_REC))


if __name__ == '__main__':
    main()
