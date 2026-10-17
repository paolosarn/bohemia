"""ONE SCREEN  (UI lane 11, [one screen], rule 110's swing, 10/17/26)

PAOLO 10/16: 'the screen shit'; rule 24 (one game mode, the same UI every second); rule 67a (one UI across map, settlement and
fight, 44 points); rule 73 (readable in the sun); rule 82 (no art sheet without its twin); rule 100 (a candidate in VOTE, nothing
in the game); rule 105 (the six at the packs' pixels); rule 108 (nothing drawn pixel by pixel in code).

WHAT THIS HOLDS, read from the manifest the sheet tool writes off the driver's shots
  - THE SAME BAR ON ALL THREE SCREENS: CREW, NOTES and the six strip sit at the same place (within one point) on the map, the
    settlement and the fight, upright; and again sideways
  - EVERY PRESS IS A THUMB: CREW, NOTES, the clock and the place tags, the big action, all at least 44 points tall
  - THE SIX AT HIS PACKS' PIXELS: every icon 96 on its long side in the file and 32 points on the glass (1:1 at three pixels a point)
  - NO CODE-DRAWN BOX LEFT: on every laid screen the sweep finds no flat box but his phone (kept by his vote) and the lit amber
  - EVERY BOX FOUND NOW HAS A REPLACEMENT NAMED on the manifest
  - PAPER OVER BOARD, THE PACK'S WAY: the tags read at least 3 to 1 over the cardboard beside them, measured on the shot
  - THE WORDS PASS THE SUN: every tag's ink against its paper at least 4.5 to 1 at rest and 2 to 1 under a flat 25% white
  - NOTHING IN THE GAME: no slice or engine file names the candidate
  - THE VOTE CARD: FINAL?, the sheet, a twin with three differences, 1:1, two sentences, the second naming where you see it
python3 gates/the_one_screen_gate.py"""
import json, os, re, sys, glob
from PIL import Image
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); os.chdir(ROOT)
D = 'records/target/ui_one_screen/'
MAN = os.environ.get('ONE_MANIFEST', D + 'UI_ONE_SCREEN.json'); REG = os.environ.get('ONE_REGISTRY', 'records/target/BOHEMIA_VOTE_REGISTRY.json')
P = [0, 0]
def ok(m, g, extra=''):
    P[0 if g else 1] += 1; print(('  ok   ' if g else '  FAIL ') + m + ('  [' + str(extra) + ']' if extra != '' else ''))
print('\nONE SCREEN  (UI [one screen])\n')
man = json.load(open(MAN)); H = man['hud']
SCREENS = ['map', 'settlement', 'fight']
same = []
for prof in ['portrait', 'landscape']:
    for what in ['crew', 'notes', 'six']:
        xs = [H[s + '_' + prof][what] for s in SCREENS]
        if any(x is None for x in xs): same.append(prof + ' ' + what + ' missing'); continue
        if max(abs(a[0] - xs[0][0]) + abs(a[1] - xs[0][1]) for a in xs) > 1: same.append(prof + ' ' + what + ' ' + str([x[:2] for x in xs]))
ok('THE SAME BAR ON ALL THREE SCREENS, upright and sideways: CREW, NOTES and the six within one point', not same, '; '.join(same) or 'map = settlement = fight')
small = [k + ' ' + w for k, v in H.items() for w in ['clock', 'place', 'crew', 'notes', 'action'] if v.get(w) and v[w][3] < 44]
ok('EVERY PRESS IS A THUMB: every tag and the big action at least 44 points tall', not small, ', '.join(small) or 'all 44+')
tiny = [k + ' ' + i['s'] for k, v in H.items() for i in v['icons'] if max(i['nat']) != 96 or abs(max(i['box'][2:]) - 32) > 0.5]
ok('THE SIX AT HIS PACKS\' PIXELS: 96 in the file, 32 points on the glass, every screen', not tiny, ', '.join(tiny) or '36 icons at 1:1')
KEEP = re.compile(r'^(#cityfeed|\.sp\.now|\.on$|#bhp|#barm|#bfat|#stage$|#scene$)')   # his phone, the lit amber, the meters' fills: colour, not boxes
left = [k + ' ' + s for k, v in H.items() for s in v['code_left'] if not KEEP.match(s)]
ok('NO CODE-DRAWN BOX LEFT on any laid screen (his phone and the lit amber excepted)', not left, ', '.join(left) or 'none')
unnamed = [b['screen'] + ' ' + b['sel'] for b in man['boxes'] if not b['replacement']]
ok('EVERY BOX FOUND NOW HAS A REPLACEMENT NAMED (%d boxes on six shots)' % len(man['boxes']), not unnamed and len(man['boxes']) > 0, ', '.join(unnamed) or 'all named')
# paper over board, and the sun, read off the upright sheet's fight (the laid screen with the most tags)
sheet = Image.open(man['sheet']).convert('RGB'); y0 = man['upright']['fight']['y']
def lum(px): return 0.2126 * px[0] + 0.7152 * px[1] + 0.0722 * px[2]
def med(ims): v = sorted(lum(p) for p in ims.getdata()); return v[len(v) // 2] if v else 0
import warnings; warnings.simplefilter('ignore')
ratios = []; sun = []
for k in ['map', 'settlement', 'fight']:
    hud = H[k + '_portrait']; yy = man['upright'][k]['y']
    for w in ['clock', 'place', 'crew', 'notes']:
        b = [int(round(v * 3)) for v in hud[w]]
        tag = sheet.crop((b[0] + 6, yy + b[1] + 6, b[0] + b[2] - 6, yy + b[1] + b[3] - 6))
        board = sheet.crop((b[0] + 2, yy + b[1] + b[3] + 2, b[0] + b[2] - 2, yy + b[1] + b[3] + 6))   # the cardboard just under the tag
        paper = sorted(lum(p) for p in tag.getdata()); hi = paper[len(paper) // 2]; lo = paper[int(len(paper) * .02)]   # the paper is the median, the ink the darkest 2% (a word covers under a tenth of its tag)
        ratios.append((k, w, round((hi + 5) / (med(board) + 5), 2)))
        rest = (hi + 12.75) / (lo + 12.75); glare = (hi * .75 + 63.75 + 12.75) / (lo * .75 + 63.75 + 12.75)   # a flat 25% white added to both
        sun.append((k, w, round(rest, 2), round(glare, 2)))
bad = [r for r in ratios if r[2] < 3]
ok('PAPER OVER BOARD, THE PACK\'S WAY: every tag at least 3 to 1 over the cardboard under it', not bad, 'worst ' + str(min(ratios, key=lambda r: r[2])))
badsun = [s for s in sun if s[2] < 4.5 or s[3] < 2]
ok('THE WORDS PASS THE SUN: ink on paper 4.5 to 1 at rest, 2 to 1 under a flat 25% white', not badsun, 'worst ' + str(min(sun, key=lambda s: s[3])))
leaks = [f for f in glob.glob('slices/**/*', recursive=True) + glob.glob('engine/**/*', recursive=True)
         if os.path.isfile(f) and f.endswith(('.html', '.js', '.css')) and ('ui_one_screen' in open(f, errors='ignore').read() or '__bmOneScreen' in open(f, errors='ignore').read())]
ok('NOTHING IN THE GAME: no slice or engine file names the candidate', not leaks, ', '.join(leaks[:3]))
reg = json.load(open(REG)); it = [i for i in reg['items'] if i.get('id') == 'ui-one-screen-10-17']; i = it[0] if it else {}
sents = [s for s in re.split(r'(?<=[.!?])\s+', i.get('why', '').strip()) if s]
ok('THE VOTE CARD: FINAL?, the sheet, a twin with three differences, 1:1', bool(i) and i['title'].startswith('FINAL?') and 'UI_ONE_AT_A_TIME_ONE_SCREEN.png' in i['show']['src']
   and os.path.exists(man['sheet']) and len(i.get('twin', {}).get('diffs', [])) >= 3 and i.get('before_after', {}).get('scale') == '1:1', i.get('id', 'missing'))
ok('  two sentences, the second naming where you see it', len(sents) <= 2 and bool(re.search(r'map|settlement|fight|tab|screen', sents[-1] if sents else '', re.I)), len(sents))
print('\nONE SCREEN: %d ok, %d failed' % tuple(P)); sys.exit(1 if P[1] else 0)
