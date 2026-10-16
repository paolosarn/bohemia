"""THE PHONE'S CRACK  (UI lane 11, [the phone's crack], 10/16/26)

PAOLO: 'these cracks look like a seventh grader coded it' (eighth votes) and 'the cracks look like shit, they're literally
just straight lines' (eleventh votes). Rule 108: cut, laid or recoloured from his packs, never drawn in code. Rule 100: a
candidate in VOTE, nothing in the game.

WHAT THIS HOLDS
  - EVERY CANDIDATE PIECE IS HIS TILE RECOLOURED: re-made from the pack tile in the bank (with its stated quarter turn), every
    pixel's place and alpha identical, and its colour exactly the glass ramp at the source pixel's brightness
  - AT 1:1 ON HIS PHONE: each piece laid at its own size (CSS width x 3 = its pixel width)
  - THE WORDS STAY READ: no piece of F or G lies on more than 5% of any line of words
  - NOTHING IN THE GAME: no file in slices/ or engine/ names the cuts
  - THE VOTE CARD: FINAL?, the sheet, a twin with three differences, 1:1, two sentences, the second naming where you see it
python3 gates/the_phones_crack_gate.py"""
import json, os, re, sys, glob, io, base64
from PIL import Image
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); os.chdir(ROOT)
D = 'records/target/ui_the_phones_crack/'
CUTS = os.environ.get('CRACK_CUTS', D + 'cuts.json'); SHOTS = os.environ.get('CRACK_SHOTS', D + 'phone_shots.json')
REG = os.environ.get('CRACK_REGISTRY', 'records/target/BOHEMIA_VOTE_REGISTRY.json')
P = [0, 0]
def ok(m, g, extra=''):
    P[0 if g else 1] += 1; print(('  ok   ' if g else '  FAIL ') + m + ('  [' + str(extra) + ']' if extra != '' else ''))
print("\nTHE PHONE'S CRACK  (UI [the phone's crack])\n")
cuts = json.load(open(CUTS)); SETS = {'F': ['F1', 'F2'], 'G': ['G1', 'G2', 'G3']}
pack = None
for f in sorted(glob.glob('banks/BOHEMIA_HD_TILE_REPO_part*.txt')):
    pk = json.load(open(f))['packs']
    if '15. Cracked floor details' in pk: pack = pk['15. Cracked floor details']; break
DARK, LIGHT = (12, 10, 8), (246, 240, 224)
bad = []
for k in sum(SETS.values(), []):
    c = cuts[k]; i = int(c['src'].split('#')[1])
    src = Image.open(io.BytesIO(base64.b64decode(pack[i]['b64'].split(',', 1)[-1]))).convert('RGBA')
    if c.get('turn'): src = src.transpose(Image.Transpose.ROTATE_90)
    got = Image.open(c['out']).convert('RGBA')
    if got.size != src.size: bad.append(k + ' size'); continue
    quads = lambda im: zip(*[iter(im.tobytes())] * 4)
    for (r, g, b, a), q in zip(quads(src), quads(got)):
        if q[3] != a: bad.append(k + ' moved'); break
        if a:
            t = min(1.0, (.3 * r + .59 * g + .11 * b) / 235.0)
            if tuple(q[:3]) != tuple(int(DARK[j] + (LIGHT[j] - DARK[j]) * t) for j in range(3)): bad.append(k + ' not the ramp'); break
ok('EVERY PIECE IS HIS TILE RECOLOURED: places, edges and the glass ramp exact', not bad and pack is not None, ', '.join(bad) or '5 pieces from pack 15')
sh = json.load(open(SHOTS)); off = []
for s, ks in SETS.items():
    for part, k in zip(sh[s], ks):
        if abs(part['box'][2] * sh['dpr'] - cuts[k]['w']) > 0.5 or abs(part['box'][3] * sh['dpr'] - cuts[k]['h']) > 0.5: off.append(k)
ok('AT 1:1 ON HIS PHONE: each piece at its own size', not off, ', '.join(off) or 'all 1:1')
worst = max([h['share'] for s in SETS for part in sh[s] for h in part['hits']] or [0])
ok('THE WORDS STAY READ: no piece lies on more than 5% of a line of words', worst <= 0.05, 'worst ' + str(worst))
leaks = [f for f in glob.glob('slices/**/*', recursive=True) + glob.glob('engine/**/*', recursive=True)
         if os.path.isfile(f) and f.endswith(('.html', '.js', '.css')) and 'ui_the_phones_crack' in open(f, errors='ignore').read()]
ok('NOTHING IN THE GAME: no slice or engine file names the cuts', not leaks, ', '.join(leaks[:3]))
reg = json.load(open(REG)); it = [i for i in reg['items'] if i.get('id') == 'ui-the-phones-crack-10-16']; i = it[0] if it else {}
sents = [s for s in re.split(r'(?<=[.!?])\s+', i.get('why', '').strip()) if s]
ok('THE VOTE CARD: FINAL?, the sheet, a twin with three differences, 1:1', bool(i) and i['title'].startswith('FINAL?') and 'UI_ONE_AT_A_TIME_THE_PHONES_CRACK.png' in i['show']['src']
   and os.path.exists(D + 'UI_ONE_AT_A_TIME_THE_PHONES_CRACK.png') and len(i.get('twin', {}).get('diffs', [])) >= 3 and i.get('before_after', {}).get('scale') == '1:1', i.get('id', 'missing'))
ok('  two sentences, the second naming where you see it', len(sents) <= 2 and bool(re.search(r'map|phone|tab|screen', sents[-1] if sents else '', re.I)), len(sents))
print("\nTHE PHONE'S CRACK: %d ok, %d failed" % tuple(P)); sys.exit(1 if P[1] else 0)
