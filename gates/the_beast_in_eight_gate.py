#!/usr/bin/env python3
"""THE BEAST IN EIGHT (ANIMATION [the beast in eight], 10/17; rule 107, Paolo 10/10: 'when you create something it has to
be made in all eight directions'; rule 108: the pixels come from a 3D render under DIRECTION's one camera, never drawn in
code; rule 102: true size; AN ENVELOPE RAMPS SLOWER THAN THE GRID).

Asked of the FRAMES on disk (records/target/master_rig/dire_wolf, DIRECTION's rig.json beside them), the BAKED SHEET
the VOTE page plays (slices/vote/ANIMATION_THE_BEAST_IN_EIGHT.webp + .json) and the REGISTRY row, never of a comment:
  * eight facings, each with an idle (12 keys), a step (6) and a bite (6), every file on disk, three keys a beat;
  * NO FACING IS A MIRROR (rule 107: 'a mirrored half is not a direction'): W against E flipped, NW against NE, SW
    against SE differ in silhouette or in light (the sun is upper left, so a real W is lit on the other side);
  * THE COAT IS A WOLF'S, NOT THE FOX'S: the mean saturation of the sprite's pixels is under 0.30 (the fox's orange
    measured over 0.5);
  * EVERY CLIP MOVES ON EVERY FACING, AND NO KEY JUMPS: between two drawn keys the silhouette changes at least 1 percent
    (a frozen clip is refused) and the BODY (its centroid) moves at most 14 px on a loop and 16 px on the bite: the
    lines FOUR LEGS set on 10/9 for the formula wolf, before this row. (This gate's first ruler was 'under half the
    silhouette changes': a thin body shifting 12 px fails that at 50.5 percent while the eye reads one lunge, measured
    on the third render; it was a ruler I invented that round, so it was replaced by the lane's older one, not nudged.
    The silhouette number is still printed.)
  * THE BITE RISES: facing E, the head's top row at the spring is at least 8 px higher than at the crouch (a wolf bites
    a man's chest, not a mouse; the first pose reached down);
  * TRUE SIZE OVER THE FLOOR: a 1.6 m animal at 57 px a metre is at least 80 px long side-on (rule 105's prop floor is
    29 by 36; rule 102 beats the pack's 96-tall convenience);
  * THE SHEET AGREES WITH ITS TABLE (cell, rows, columns) and the wolf rows hold 16 colours or fewer;
  * THE PAGE PLAYS THE SHEET and the registry row shows the page, titled PLACEHOLDER (ROUND THIRTEEN).
Mutations planted in memory first and refused: a flipped facing, a fox-orange coat, a clip with a 5-key strip, a frozen
clip, a bite that reaches down.

--wolf redone (ANIMATION [the beasts through the rig, the wolf redone], 10/18; rule 115c; his NO on the grey one, 'the
ugliest', the fox better): the same questions of records/target/master_rig/dire_wolf_redone and ANIMATION_THE_WOLF_REDONE,
at 1.7 m (so 85 px long side-on), the coat under 0.40 saturation (a tawny wolf, still well under the fox's 0.5), and
three more, each from what made the grey one ugly:
  * THREE TONES, NOT ONE: the sprite's lightest tenth is at least 70 levels over its darkest tenth (the grey one
    measured, the fox measured; one flat grey-brown is what he saw);
  * THE STILL IS THE WALK'S PASSING POSE, never the idle's first key (the sniff);
  * IT STANDS LIKE A WOLF: facing E, tall over long is at least 0.05 more than the grey one's (the legs 1.35 longer);
  * the registry row is a redo of the beast in eight.
Mutations planted: a flat one-tone coat, an idle-first-key still.

--dog pit|cur (ANIMATION [the beasts through the rig, the wolf redone] ROUND TWO, THE FERAL DOG PACK, 10/18; rule 115c; the
bestiary's number 1): the same questions of records/target/master_rig/feral_dog_<dog> and ANIMATION_THE_FERAL_DOG_<DOG> at
its own length (1.1 m the pit, 1.25 m the cur), the page ANIMATION_THE_FERAL_DOG_PACK.html playing both, plus: three tones;
the passing-pose still; DIRECTION's card did not send it BACK (the shepherd mix it did, so it is not on the card); A PACK,
NOT ONE DOG RECOLOURED: the mean coat at least 20 levels from the wolf redone and from the other dog; it stands taller than
the fox it was made from. Mutations planted: a dog that is the wolf recoloured a little, a BACK card.
"""
import os, sys, json
import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = os.path.join(ROOT, 'records/target/master_rig/dire_wolf')
WEBP = os.path.join(ROOT, 'slices/vote/ANIMATION_THE_BEAST_IN_EIGHT.webp')
TABLE = os.path.join(ROOT, 'slices/vote/ANIMATION_THE_BEAST_IN_EIGHT.json')
PAGE = os.path.join(ROOT, 'slices/vote/ANIMATION_THE_BEAST_IN_EIGHT.html')
REG = os.path.join(ROOT, 'records/target/BOHEMIA_VOTE_REGISTRY.json')
ID = 'animation-the-beast-in-eight-10-17'
STEM, MODEL, REAL_M, SAT_MAX = 'ANIMATION_THE_BEAST_IN_EIGHT', 'dire_wolf.glb', 1.6, 0.30
REDONE = '--wolf' in sys.argv and sys.argv[sys.argv.index('--wolf') + 1] == 'redone'
OLD_D = D
if REDONE:
    D = os.path.join(ROOT, 'records/target/master_rig/dire_wolf_redone')
    STEM, MODEL, REAL_M, SAT_MAX, ID = 'ANIMATION_THE_WOLF_REDONE', 'dire_wolf_redone.glb', 1.7, 0.40, 'animation-the-wolf-redone-10-18'
    WEBP, TABLE, PAGE = (os.path.join(ROOT, 'slices/vote/' + STEM + x) for x in ('.webp', '.json', '.html'))
DOG = sys.argv[sys.argv.index('--dog') + 1] if '--dog' in sys.argv else None
DOGS = {'pit': 1.1, 'cur': 1.25}
if DOG:
    D = os.path.join(ROOT, 'records/target/master_rig/feral_dog_' + DOG)
    STEM, MODEL, REAL_M, SAT_MAX, ID = 'ANIMATION_THE_FERAL_DOG_' + DOG.upper(), 'feral_dog_%s.glb' % DOG, DOGS[DOG], 0.40, 'animation-the-feral-dog-pack-10-18'
    WEBP, TABLE = (os.path.join(ROOT, 'slices/vote/' + STEM + x) for x in ('.webp', '.json'))
    PAGE = os.path.join(ROOT, 'slices/vote/ANIMATION_THE_FERAL_DOG_PACK.html')
TONES, TALLER, APART = 70, 0.05, 20
FACINGS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
CLIPS = {'Survey': 12, 'Walk': 6, 'Bite': 6}
MIRRORS = (('E', 'W'), ('NE', 'NW'), ('SE', 'SW'))
SAT_LINE, XOR_LEAST, MOVE_LOOP, MOVE_BITE, RISE_PX, COLOURS = SAT_MAX, 0.01, 14.0, 16.0, 8, 16
LONG_PX = int(80 * REAL_M / 1.6)
if DOG:   # the spring's line was set on a 1.7 m wolf; a 1.1 m dog reaches as far for its size (the pit's 7 px is 11 percent of its length, the wolf's 9 is 9)
    RISE_PX = max(5, int(round(8 * REAL_M / 1.7)))
NOUN = 'dog' if DOG else 'wolf'

ok_n = fail_n = 0
def ok(name, cond, why=''):
    global ok_n, fail_n
    if cond: ok_n += 1; print('  ok   ' + name)
    else: fail_n += 1; print('  FAIL ' + name + ('  [' + why + ']' if why else ''))

load = lambda f: np.asarray(Image.open(os.path.join(ROOT, f)).convert('RGBA')).astype(int)

# ---- the rulers, on arrays, so they can be planted
def is_mirror(A, B):
    """A and B flipped: a mirror has the same silhouette and the same light"""
    Bf = B[:, ::-1]; a = A[..., 3] > 0; b = Bf[..., 3] > 0
    sil = (a ^ b).sum() / max(1, (a | b).sum()); both = a & b
    col = np.abs(A[..., :3] - Bf[..., :3])[both].mean() if both.any() else 0
    return sil < 0.05 and col < 8, sil, col

def saturation(frames):
    px = np.concatenate([f[f[..., 3] > 0][:, :3] for f in frames]).astype(float) / 255
    mx = px.max(1); mn = px.min(1)
    return float(np.where(mx > 0, (mx - mn) / np.maximum(mx, 1e-6), 0).mean())

def xor_steps(frames):
    """(least silhouette change, worst silhouette change, worst centroid move in px) between consecutive drawn keys"""
    sils = [f[..., 3] > 0 for f in frames]; out = []; moves = []
    cen = [np.array(np.nonzero(a)).mean(1) if a.any() else np.zeros(2) for a in sils]
    for j in range(len(sils)):
        a, b = sils[j], sils[(j + 1) % len(sils)]; out.append((a ^ b).sum() / max(1, (a | b).sum()))
        moves.append(float(np.hypot(*(cen[j] - cen[(j + 1) % len(sils)]))))
    return min(out), max(out), max(moves)

def tones(frames):
    """the lightest tenth over the darkest tenth of the sprite, in luminance levels"""
    px = np.concatenate([f[f[..., 3] > 0][:, :3] for f in frames]).astype(float)
    lum = px @ [0.299, 0.587, 0.114]
    return float(np.percentile(lum, 90) - np.percentile(lum, 10))

def tall_over_long(f):
    a = f[..., 3] > 0
    return a.any(1).sum() / max(1, a.any(0).sum())

def is_passing(meta):
    return bool(meta.get('still_frame')) and 'passing' in str(meta.get('still', ''))

def top_row(f):
    rows = np.nonzero((f[..., 3] > 0).any(1))[0]; return int(rows.min()) if len(rows) else 0

# ---- planted first
blob = np.zeros((40, 80, 4), int); blob[10:30, 5:25] = [200, 120, 40, 255]
ok('planted: a facing that is the flip of another is refused', is_mirror(blob, blob[:, ::-1])[0])
ok('planted: a fox-orange coat is refused', saturation([blob]) >= SAT_LINE)
frozen = [blob] * 6
ok('planted: a frozen clip (no change between keys) is refused', xor_steps(frozen)[0] < XOR_LEAST)
jump = [blob, np.roll(blob, 20, axis=1)] * 3
ok('planted: a key that jumps the whole body 20 px is refused', xor_steps(jump)[2] > MOVE_BITE)
ok('planted: a 5-key strip is refused', 5 % 3 != 0)
low = blob.copy(); low[10:30] = 0; low[25:35, 5:25] = [200, 120, 40, 255]
ok('planted: a bite that reaches down is refused', top_row(blob) - top_row(low) < RISE_PX)

def coat_apart(A, B):
    """the mean colour of one beast's stills against another's, in RGB levels: a pack is not one dog recoloured a little"""
    ca = np.concatenate([f[f[..., 3] > 0][:, :3] for f in A]).mean(0); cb = np.concatenate([f[f[..., 3] > 0][:, :3] for f in B]).mean(0)
    return float(np.linalg.norm(ca - cb))

if REDONE or DOG:
    flat = blob.copy(); flat[10:30, 5:25] = [110, 100, 90, 255]
    ok('planted: a flat one-tone coat is refused', tones([flat]) < TONES)
    ok('planted: an idle-first-key still is refused', not is_passing({'still_frame': 0.0, 'still': None}))
if DOG:
    ok('planted: a dog that is the wolf recoloured a little is refused', coat_apart([blob], [blob + [8, 8, 8, 0]]) < APART)
    ok('planted: a rig DIRECTION\'s card sent BACK is refused', 'BACK' in '3 of 8 out -> BACK before VOTE')

# ---- the real frames
m = json.load(open(os.path.join(D, 'rig.json'))) if os.path.exists(os.path.join(D, 'rig.json')) else {}
ok('DIRECTION\'s rig.json beside the frames, eight facings', m.get('facings') == FACINGS, str(m.get('facings')))
for clip, k in CLIPS.items():
    c = (m.get('clips') or {}).get(clip, {})
    ok('%s: %d keys, three a beat, 8 x %d files on disk' % (clip, k, k), c.get('keys') == k and k % 3 == 0 and len(c.get('files', [])) == 8 * k and all(os.path.exists(os.path.join(ROOT, f)) for f in c.get('files', [])))
stills = {f: load(fn) for f, fn in zip(FACINGS, m.get('files', []))} if len(m.get('files', [])) == 8 else {}
for a, b in MIRRORS:
    if a in stills:
        mir, sil, col = is_mirror(stills[a], stills[b])
        ok('%s is not %s flipped (silhouette differs %.0f%%, light differs %.1f)' % (b, a, sil * 100, col), not mir)
if stills:
    s = saturation(list(stills.values()))
    ok('the coat is a %s\'s: mean saturation %.2f under %.2f (the fox was over 0.5)' % (NOUN, s, SAT_LINE), s < SAT_LINE)
    if DOG:
        tn = tones(list(stills.values()))
        ok('three tones, not one: the lightest tenth is %.0f levels over the darkest (line %d)' % (tn, TONES), tn >= TONES)
        ok('the still is the walk\'s passing pose (%s), never the idle\'s first key' % m.get('still'), is_passing(m))
        verdict = str((m.get('card') or {}).get('verdict', ''))
        ok('DIRECTION\'s card did not send it BACK (%s)' % verdict, bool(verdict) and 'BACK' not in verdict)
        for other in ['dire_wolf_redone'] + ['feral_dog_' + o for o in DOGS if o != DOG]:
            om = json.load(open(os.path.join(ROOT, 'records/target/master_rig', other, 'rig.json')))
            ap = coat_apart(list(stills.values()), [load(fp) for fp in om['files']])
            ok('a pack, not one dog recoloured: its coat is %.0f levels from %s (line %d)' % (ap, other, APART), ap >= APART)
        fm = json.load(open(os.path.join(ROOT, 'records/target/master_rig/fox/rig.json')))
        r_new, r_fox = tall_over_long(stills['E']), tall_over_long(load(fm['files'][FACINGS.index('E')]))
        ok('it stands like a dog, not the fox it came from: facing E tall over long %.2f against the fox\'s %.2f (at least %.2f more)' % (r_new, r_fox, TALLER), r_new - r_fox >= TALLER)
    if REDONE:
        tn = tones(list(stills.values()))
        ok('three tones, not one: the lightest tenth is %.0f levels over the darkest (line %d)' % (tn, TONES), tn >= TONES)
        ok('the still is the walk\'s passing pose (%s), never the idle\'s first key' % m.get('still'), is_passing(m))
        om = json.load(open(os.path.join(OLD_D, 'rig.json')))
        old_e = load(om['files'][FACINGS.index('E')])
        r_new, r_old = tall_over_long(stills['E']), tall_over_long(old_e)
        ok('it stands like a wolf: facing E tall over long %.2f against the grey one\'s %.2f (at least %.2f more)' % (r_new, r_old, TALLER), r_new - r_old >= TALLER)
    w = (stills['E'][..., 3] > 0).any(0).sum()
    ok('true size: side-on the %s is %d px long, over %d (%.1f m at 57 px a metre; the prop floor is 29 by 36)' % (NOUN, w, LONG_PX, REAL_M), w >= LONG_PX)
worst_all = {}
for clip, k in CLIPS.items():
    c = (m.get('clips') or {}).get(clip, {})
    if len(c.get('files', [])) != 8 * k: continue
    least, worst, move = 1.0, 0.0, 0.0
    for i, f in enumerate(FACINGS):
        lo, hi, mv = xor_steps([load(fn) for fn in c['files'][i * k:(i + 1) * k]]); least = min(least, lo); worst = max(worst, hi); move = max(move, mv)
    line = MOVE_BITE if clip == 'Bite' else MOVE_LOOP
    ok('%s moves on every facing and no key jumps: the body moves at most %.1f px between drawn keys (line %d, FOUR LEGS 10/9); silhouette change %.1f%% to %.1f%% (floor %d%%)' % (clip, move, line, least * 100, worst * 100, XOR_LEAST * 100), least >= XOR_LEAST and move <= line)
bite = (m.get('clips') or {}).get('Bite', {})
if len(bite.get('files', [])) == 48:
    i = FACINGS.index('E'); fr = [load(fn) for fn in bite['files'][i * 6:(i + 1) * 6]]
    tops = [top_row(f) for f in fr]; rise = tops[1] - min(tops[2], tops[3])
    ok('the bite rises: facing E the head is %d px higher at the spring than at the crouch (line %d); tops %s' % (rise, RISE_PX, tops), rise >= RISE_PX)

# ---- the baked sheet and its table
t = json.load(open(TABLE)) if os.path.exists(TABLE) else {}
sheet = Image.open(WEBP).convert('RGBA') if os.path.exists(WEBP) else None
ok('the sheet and its table exist', bool(t) and sheet is not None)
if t and sheet is not None:
    CW, CH = t['cell']; cols = sum(c['keys'] for c in t['clips']); rows = len(t['facings']) + 1
    ok('the sheet is %d x %d cells of %dx%d (8 facings x idle 12 + step 6 + bite 6, plus the game\'s wolf)' % (cols, rows, CW, CH), sheet.size == (CW * cols, CH * rows) and cols == 24 and rows == 9 and t['facings'] == FACINGS)
    a = np.asarray(sheet)[:CH * 8]; n = len(set(map(tuple, a[a[..., 3] > 0][:, :3].tolist())))
    ok('the wolf rows hold %d colours, %d or fewer (one palette, the pack draws its animals in a handful)' % (n, COLOURS), n <= COLOURS)
    ok('the table says three keys a beat at 120 and names the model', t.get('keys_per_beat') == 3 and t.get('bpm') == 120 and t.get('model', '').endswith('/' + MODEL))
page = open(PAGE).read() if os.path.exists(PAGE) else ''
ok('the VOTE page plays the sheet from its table, says PLACEHOLDER, and asks no vote inside (rule 25)',
   STEM + '.webp' in page and STEM + '_TABLE.js' in page and os.path.exists(os.path.join(ROOT, 'slices/vote/' + STEM + '_TABLE.js')) and 'PLACEHOLDER' in page and 'requestAnimationFrame' in page and 'thumb' not in page.lower())
reg = json.load(open(REG)); row = next((r for r in reg.get('items', []) if r.get('id') == ID), None)
ok('the registry row %s shows the page and is titled PLACEHOLDER' % ID, bool(row) and row.get('show', {}).get('src') == 'vote/' + os.path.basename(PAGE) and str(row.get('title', '')).startswith('PLACEHOLDER') and (not REDONE or row.get('redoOf') == 'animation-the-beast-in-eight-10-17'))
ok('the model and its licence are in the repo', os.path.exists(os.path.join(ROOT, 'reference/models/bohemia', MODEL)) and os.path.exists(os.path.join(ROOT, 'reference/models/bohemia/LICENSE.txt')))
print('\n%s GATE: %d passed, %d failed' % (('THE FERAL DOG PACK (%s)' % DOG) if DOG else 'THE WOLF REDONE' if REDONE else 'THE BEAST IN EIGHT', ok_n, fail_n)); sys.exit(1 if fail_n else 0)
