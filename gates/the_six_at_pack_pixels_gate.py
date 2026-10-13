"""THE SIX AT PACK PIXELS  (UI lane 11, [icons at full pixels] + [the crew button], 10/13/26)

PAOLO: 'all the icons look like dogshit, five pixels by five pixels' (rule 104c); his eleventh votes: 'a fabric icon looks
like someone is getting hung by a noose'. Rule 105: nothing we make is tinier than what we downloaded. Rule 108: an icon is
cut from his packs, never drawn rectangle by rectangle in code. Rule 100: a candidate in VOTE, nothing in the game.

WHAT THIS HOLDS
  - THE NOOSE IS DEAD: the materials' tape case draws nothing
  - THE SHEET'S TWELVE CUTS ARE HIS TILES, NOT ONE PIXEL CHANGED: each re-cropped from the sheet equals its pack file laid
    on the sheet's ground, pixel for pixel; six supplies in his order, twice (A and B), twelve different files
  - EVERY CUT AT THE PACK'S FLOOR AND AT 1:1 ON THE PHONE: long side 96, the candidate's icon box 32 points at 3 phone pixels
  - CREW'S WORD PASSES 4.5 TO 1 PLAIN AND IN THE SUN in both candidates, read off the sheet's own shots
  - THE VOTE CARD: titled FINAL?, the sheet, a twin with its differences, before and after at 1:1, two sentences, the second
    naming where you see it
python3 gates/the_six_at_pack_pixels_gate.py"""
import json, os, re, sys
from PIL import Image
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MAN = os.environ.get('SIX_MANIFEST', os.path.join(ROOT, 'records/target/UI_THE_SIX_AT_PACK_PIXELS.json'))
MAT = os.environ.get('SIX_MATERIALS', os.path.join(ROOT, 'slices/bohemia_ui_materials.js'))
REG = os.environ.get('SIX_REGISTRY', os.path.join(ROOT, 'records/target/BOHEMIA_VOTE_REGISTRY.json'))
P = [0, 0]
def ok(m, g, extra=''):
    P[0 if g else 1] += 1; print(('  ok   ' if g else '  FAIL ') + m + ('  [' + str(extra) + ']' if extra != '' else ''))
print('\nTHE SIX AT PACK PIXELS  (UI [icons at full pixels] + [the crew button])\n')

mat = open(MAT).read()
m = re.search(r"case 'tape':(.*?)(?=case '|\n    \})", mat, re.S)
ok('THE NOOSE IS DEAD: the materials\' tape case draws nothing', bool(m) and m.group(1).strip() == 'break;', (m.group(1).strip()[:60] if m else 'no tape case'))

man = json.load(open(MAN)); sheet = Image.open(os.path.join(ROOT, man['sheet'])).convert('RGBA'); bg = tuple(man['bg'])
cuts = man['cuts']; bad = []
for c in cuts:
    src = Image.open(os.path.join(ROOT, c['src'])).convert('RGBA')
    want = Image.new('RGBA', src.size, bg); want.alpha_composite(src)
    got = sheet.crop((c['x'], c['y'], c['x'] + src.width, c['y'] + src.height))
    if (c['w'], c['h']) != src.size or got.tobytes() != want.tobytes(): bad.append(c['set'] + ' ' + c['supply'])
ok('THE TWELVE CUTS ARE HIS TILES, NOT ONE PIXEL CHANGED', len(cuts) == 12 and not bad, ', '.join(bad) or '12 identical')
ORDER = ['batteries', 'food', 'meds', 'rounds', 'tape', 'water']
ok('  six supplies in his order, A and B, twelve different files', [c['supply'] for c in cuts if c['set'] == 'A'] == ORDER and [c['supply'] for c in cuts if c['set'] == 'B'] == ORDER
   and len(set(c['src'] for c in cuts)) == 12 and all('/reference/art_bank/' in '/' + c['src'] for c in cuts))
ok('EVERY CUT AT THE PACK\'S FLOOR (96 on the long side) AND 1:1 ON THE PHONE', all(max(c['w'], c['h']) == 96 for c in cuts) and man['icon_box_pt'] * man['dpr'] == 96,
   'long sides ' + ' '.join(str(max(c['w'], c['h'])) for c in cuts) + '; box ' + str(man['icon_box_pt']) + ' pt x ' + str(man['dpr']))

def L(p):
    f = lambda v: (v / 255) / 12.92 if v / 255 <= 0.03928 else (((v / 255) + 0.055) / 1.055) ** 2.4
    return 0.2126 * f(p[0]) + 0.7152 * f(p[1]) + 0.0722 * f(p[2])
CR = lambda a, b: (max(a, b) + .05) / (min(a, b) + .05)
SUN = lambda p: tuple(v + (255 - v) * .25 for v in p[:3])
res = []
for k in ['A', 'B']:
    x, y, w, h = [v * man['dpr'] for v in man['crew_pt']]; y += man['shots'][k]['y']
    px = sorted(list(zip(*[iter(sheet.crop((x + 12, y + 30, x + w - 12, y + h - 30)).tobytes())]*4)), key=L)
    lo, hi = px[int(len(px) * .03)], px[int(len(px) * .97)]
    mid = px[len(px) // 2]; ink, ground = (hi, mid) if L(mid) < .2 else (lo, mid)
    res.append((k, round(CR(L(ink), L(ground)), 2), round(CR(L(SUN(ink)), L(SUN(ground))), 2)))
ok('CREW\'S WORD PASSES 4.5 TO 1 PLAIN AND IN THE SUN, both candidates', all(a >= 4.5 and b >= 4.5 for _, a, b in res), ', '.join('%s %s/%s' % r for r in res))

reg = json.load(open(REG)); it = [i for i in reg['items'] if i.get('id') == 'ui-the-six-at-pack-pixels-10-13']
i = it[0] if it else {}
why = i.get('why', ''); sents = [s for s in re.split(r'(?<=[.!?])\s+', why.strip()) if s]
ok('THE VOTE CARD: FINAL?, the sheet, a twin with three differences, before and after at 1:1', bool(i) and i['title'].startswith('FINAL?') and man['sheet'].split('/')[-1] in i['show']['src']
   and len(i.get('twin', {}).get('diffs', [])) >= 3 and i.get('before_after', {}).get('scale') == '1:1', i.get('id', 'missing'))
ok('  two sentences, the second naming where you see it', len(sents) <= 2 and bool(re.search(r'map|bar|tab|screen', sents[-1] if sents else '', re.I)), len(sents))
print('\nTHE SIX AT PACK PIXELS: %d ok, %d failed' % tuple(P)); sys.exit(1 if P[1] else 0)
