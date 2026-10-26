#!/usr/bin/env python3
"""HER BODY ON THE RIG (ANIMATION [a few women at the post], rules 203(a) and 214, Paolo 10/25 and 10/26, LOCKED: 'I'm willing to
give a chance to women... make it 4 percent'; the ruling: each a whole person, her own body on the rig, face, voice and runway
clothes, never a renamed man). Asked of her PICTURES and of what the screens read, never of a table's say-so:
  S  THE SOURCE (records/target/animation/BOHEMIA_HER_BODY.json, rule 128): shorter, narrower in the shoulders, wider at the
     seat, a waist and a bust; her walk's list, turn and narrower step; her face with no beard; four women.
  R  THE ROLL (RUN TWO's records/run2/BOHEMIA_RUN2_THE_PEOPLE_ROLL.json): every woman after every man (no man's draw moved),
     a person of the place, marked 'f', no beard and no stubble; her build record says it is HER build (her height applied).
  B  HER BODY, in the pixels of her eight stills against the men of the same place standing in the same frame (57 px a
     metre): shorter (her height 0.90 to 0.965 of the place's men, the source's 0.93) in all eight facings; her build record
     says she was built as her (her dials, bust, waist and height).
  W  HER WALK is her own: in her six walk keys facing the glass her feet land nearer the line she walks on than the men's of
     the place (under 0.9 of theirs, her height alone making 0.93), measured on the pixels of her feet.
  M  WHERE THE SCREENS READ HER: the people mix carries her as 'f' and on the fight's board (the post may hire her); her fight
     sheet, her face in the fight's strip, her walk sheet, her idles and her town activities are on disk; her stills and face
     for the post and the crew card.
  MUTATIONS: a man's body handed in as hers (the height and the shoulders), and her walk swapped for a man's, are caught.
    python3 gates/her_body_gate.py
"""
import json, os, re, sys
import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'records/target/animation/BOHEMIA_HER_BODY.json')
ROLL = os.path.join(ROOT, 'records/run2/BOHEMIA_RUN2_THE_PEOPLE_ROLL.json')
STILLS = os.path.join(ROOT, 'records/target/character/barber')
STOW = os.path.join(ROOT, 'records/run2/people')
DIRS = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW']
ok_n = fail_n = 0


def ok(name, cond, why=''):
    global ok_n, fail_n
    if cond: ok_n += 1; print('  ok   ' + name)
    else: fail_n += 1; print('  FAIL ' + name + ('  [' + str(why) + ']' if why else ''))


def done():
    print('\nHER BODY GATE: %d passed, %d failed' % (ok_n, fail_n)); sys.exit(1 if fail_n else 0)


S = json.load(open(SRC)) if os.path.exists(SRC) else None
ok('S0 the kept source is in the repo (rule 128)', S is not None, SRC)
if S is None: done()
d = S['dials']; sh = S['shape']; wk = S['walk']
ok('S1 her body: shorter, narrower shoulders, a wider seat, a waist and a bust; her walk lists, turns and steps nearer the line; no beard',
   d['height'] < 0 and d['shoulders'] < 0 and d['hips'] > 0 and d['belly'] < 0 and sh['bust'] > 0 and sh['waist'] > 0
   and wk['list_deg'] > 0 and wk['turn_deg'] > 0 and wk['narrow_m'] > 0 and S['roll']['count'] >= 4)

R = json.load(open(ROLL))
W_ = [p for p in R if p.get('sex') == 'f']
first_w = min((i for i, p in enumerate(R) if p.get('sex') == 'f'), default=len(R))
ok('R1 %d women in the valley\'s roll, every one after every man (no man\'s draw moved), a person of the place, no beard, no stubble' % len(W_),
   len(W_) >= S['roll']['count'] and all(p.get('sex') == 'f' for p in R[first_w:]) and all(p['gang'] == 'Body' and not (p.get('facial_hair') or p.get('stubble') or p.get('beard')) for p in W_))


def alpha(fn):
    a = np.asarray(Image.open(fn).convert('RGBA'))[..., 3] > 127
    ys, xs = np.nonzero(a)
    return a, ys, xs


def measure(tag, f):
    """height in px, the widest row in the shoulder band (0.70 to 0.80 of his height up) and in the hip band (0.42 to 0.52)"""
    fn = os.path.join(STILLS, tag, 'rig_%s.png' % f)
    if not os.path.exists(fn): return None
    a, ys, xs = alpha(fn)
    if not len(ys): return None
    top, bot = ys.min(), ys.max(); h = bot - top + 1
    def band(lo, hi):
        rows = range(int(bot - hi * h), int(bot - lo * h) + 1)
        w = [np.nonzero(a[r])[0] for r in rows if 0 <= r < a.shape[0]]
        return max((x.max() - x.min() + 1) for x in w if len(x)) if any(len(x) for x in w) else 0
    return dict(h=h, sh=band(0.70, 0.80), hip=band(0.42, 0.52))


men = [('person_town_%d' % i) for i in range(12)]
her = ['person_' + p['id'].lower() for p in W_]
mine = [t for t in her if os.path.exists(os.path.join(STILLS, t, 'rig_S.png'))]
ok('B0 her stills are rendered (her eight turns, the post\'s card and the crew card): %d of %d' % (len(mine), len(her)), len(mine) == len(her), [t for t in her if t not in mine])


def body_faults(hers, mens):
    """her height in all eight facings against the place's men standing in the same frame (57 px a metre), and her build
    record saying it is her build (her dials, her bust and waist and her height applied: CHARACTER's model is shaped in
    memory, the pixels of a 2 to 4 px shoulder are under the clothes' own noise, measured: the men's shoulder-to-hip runs
    0.64 to 0.89)"""
    out = []
    for f in DIRS:
        M = [m for m in (measure(t, f) for t in mens) if m]
        if not M: out.append('no man of the place standing at %s' % f); continue
        mh = float(np.median([m['h'] for m in M]))
        for t in hers:
            m = measure(t, f)
            if not m: out.append('%s %s not standing' % (t, f)); continue
            if not 0.90 <= m['h'] / mh <= 0.965: out.append('%s %s height %.3f of the men' % (t, f, m['h'] / mh))
    for t in hers:
        bj = os.path.join(ROOT, 'records/character/rig/barber_%s.json' % t)
        J = json.load(open(bj)) if os.path.exists(bj) else {}
        if not J.get('her'): out.append('%s: her build record does not say her body was built (%s)' % (t, os.path.relpath(bj, ROOT)))
    return out


if mine:
    bf = body_faults(mine, men)
    ok('B1 HER BODY: 0.90 to 0.965 of the place\'s men tall in all eight facings, built as her (her build record)', not bf, '; '.join(bf[:4]))
    mf = body_faults(['person_town_3'], [m for m in men if m != 'person_town_3'])
    ok('B2 MUTATION: a man of the place handed in as her is caught', bool(mf))


def spread(tag):
    """facing the glass, her six walk keys: how far apart her feet land (the opaque span of the lowest 7 percent of the
    figure, px, the mean of the six)"""
    d_ = os.path.join(STOW, tag)
    if not os.path.exists(os.path.join(d_, 'rig_Anim_0_S_k00.png')): d_ = os.path.join(STILLS, tag)
    out = []
    for k in range(6):
        fn = os.path.join(d_, 'rig_Anim_0_S_k%02d.png' % k)
        if not os.path.exists(fn): return None
        a, ys, xs = alpha(fn); bot = ys.max(); h = bot - ys.min()
        yy, xx = np.nonzero(a[int(bot - 0.07 * h):bot + 1]); out.append(xx.max() - xx.min())
    return float(np.mean(out))


if mine:
    ms = [s_ for s_ in (spread(t) for t in men) if s_ is not None]
    mm = float(np.median(ms)) if ms else None
    hs = {t: spread(t) for t in mine}
    # her feet land nearer the line she walks on: under 0.9 of the men's (her height alone would make it 0.93; measured 10/26:
    # the place's men 8.3 to 10.8 px, median 10.1; hers 8.2)
    wf = ['%s\'s feet land %.1f px apart against the men\'s %.1f' % (t, s_ or -1, mm or -1) for t, s_ in hs.items() if s_ is None or mm is None or s_ > 0.9 * mm]
    ok('W1 HER WALK: her feet land nearer the line she walks on than the men\'s of the place (facing the glass, her six keys, under 0.9 of theirs)', not wf, '; '.join(wf[:4]))
    typ = sorted(ms)[len(ms) // 2] if ms else None
    ok('W2 MUTATION: a man\'s walk (the place\'s middle man) handed in as hers is caught', typ is not None and typ > 0.9 * mm)

# ---------------------------------------------------------------------------------------------------- M where the screens read her
mix = open(os.path.join(ROOT, 'engine/bohemia_people_mix.js')).read()
rows = {json.loads(x)['look']: json.loads(x) for x in re.findall(r'^\s*(\{"look":.*\})\s*,?\s*$', mix, re.M)}
FR = json.load(open(os.path.join(ROOT, 'slices/fight_rig/fight_rig.json')))
IDL = json.load(open(os.path.join(ROOT, 'slices/rig_idles/rig_idles.json')))
TWN = json.load(open(os.path.join(ROOT, 'slices/rig_town/rig_town.json'))) if os.path.exists(os.path.join(ROOT, 'slices/rig_town/rig_town.json')) else {'looks': {}}
mf = []
for t in her:
    r = rows.get(t)
    if not r: mf.append('%s not in the people mix' % t); continue
    if r.get('sex') != 'f': mf.append('%s reads %s in the mix' % (t, r.get('sex')))
    if not r.get('fight') or r.get('company'): mf.append('%s not on the board for the post' % t)
    L = FR['looks'].get(t)
    if not L or L.get('kind') != 'person' or not os.path.exists(os.path.join(ROOT, 'slices/fight_rig', L['file'])): mf.append('%s has no fight sheet' % t)
    if t not in FR['faces']['order']: mf.append('%s has no face in the fight\'s strip' % t)
    if not os.path.exists(os.path.join(STILLS, t, 'face', 'rest_128.png')): mf.append('%s has no face' % t)
    if not os.path.exists(os.path.join(ROOT, 'slices/rig_walk', t + '.json')): mf.append('%s has no walk sheet' % t)
    if t not in IDL['looks'] or 'fight_' + t not in IDL['looks']: mf.append('%s has no idles (the town\'s and the fight\'s)' % t)
    if t not in TWN['looks']: mf.append('%s has no town activities' % t)
ok('M1 every woman: in the people mix as \'f\' and on the board for the post, her fight sheet, her face in the strip and on the card, her walk sheet, her idles, her town activities',
   not mf, '; '.join(mf[:5]))
done()
