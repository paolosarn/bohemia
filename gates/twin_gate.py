#!/usr/bin/env python3
"""THE TWIN GATE (10/18/26, PLUMBER lane, VAMILY row [the twin gate]; rule 108 ROUND EIGHT (c); Paolo's twin
law (82): the packs he bought are the ruler; records/BOHEMIA_RESEARCH_UNLOCK_THE_LIMITS_03_GIVING_THE_CHATS_
EYES_10_11_26.md section 3).

The rulers live in tools/bohemia_twin_gate.py (COLOUR, PATTERN, PAINTER, GRID, SHAPE; LOOK when the DINOv2
weights are on the box; SSIM printed). This gate holds them and holds the art to them.

THE LEGS
  T1  THE LINES ARE CURRENT: records/target/BOHEMIA_TWIN_CALIBRATION.json carries every pack family and was
      measured over the pack pieces on disk now (drift under 2%).
  T2  IT BITES BOTH WAYS: a pack piece against itself is GREEN; 80 seeded pairs of his own ground and road
      tiles against each other are RED under 5 in 100; a flat six-step ramp tile (the 10/10 cook's shape),
      a 1.5x nearest upscale (a fractional grid) and noise are RED against a ground twin; the robot and the
      truck he voted up (his YES, the guide's tie-breaker 1) are never RED against a car; a piece is scored
      in under three seconds.
  T3  THE CULL: an art item registered in VOTE after this gate (its id not in the frozen baseline) that names
      a twin and its sprites, and that he has not voted on yet (once he has, his word is the verdict: 10/18 the
      street joins he said YES to read RED on PAINTER, a ruler wrong, printed every run, never held), is
      scored sprite by sprite against the twin; any RED sprite is red here, and its
      card (his twin and ours at his size, the verdict and why) is written to records/target/twin_cards/<id>.png.
      A new item whose pack twin the bank does not hold is red ('name a twin the bank holds'); a twin that is
      our own earlier sheet (a 'before', outside reference/art_bank) is not a pack twin and is not held (on
      10/18 COOK THREE's two rig enemies read RED against the old flat sheet they replace, which is the point
      of them). Proven both ways on a planted registry every run.
  T4  THE CRITIC LOOP: one pairwise question a pass, never a score; cap three; keep best and revert a worse
      retry; a RED piece never meets the critic. Proven on a planted maker and critic.

  L0  NO WEIGHTS IN THE REPO (every box): git tracks no model file (.onnx .pth .pt .safetensors .ckpt), and
      tools/models/ is ignored; a planted tracked export is red. The look workflow (.github/workflows/look.yml)
      exports with tools/bohemia_look_export.py at the pinned DINOv2 commit and the pinned weights' sha256,
      caches the export keyed on the three, calibrates and runs this gate, and asks for nothing but read access.

LOOK (DINOv2 ViT-S/14): Apache-2.0, read 10/18 from facebookresearch/dinov2 LICENSE and MODEL_CARD.md
('License: Apache License 2.0'). Its weights answer 403 from the container (huggingface.co and
dl.fbaipublicfiles.com), so here LOOK prints UNMEASURED and holds nothing; GitHub's free runner is the box
(VAMILY row [the look leg]): it exports and caches the ONNX, calibrates LOOK on the packs and runs this gate,
where LOOK joins the verdict like any ruler and these legs hold:
  L1  THE EXPORT IS THE VERIFIED ONE: the sidecar beside the ONNX names its sha256 and the export's check
      against torch (cosine at or over 0.9999 on every input).
  L2  THE LINES CARRY LOOK for every family (the packs' 10th percentile cosine, pair and centroid, IN/OUT;
      their 1st percentile, OUT/FAR).
  L3  IT BITES BOTH WAYS ON LOOK ALONE: his piece against itself reads cosine 1 and IN, his car turned the
      other way IN, his own tiles against each other FAR under 2 in 100; noise never IN (noise is COLOUR's
      and PATTERN's to fail: on the runner DINOv2 put it nearer one ground tile than his roughest 1 in 100
      ground pairs, run 39152693910). T2 and T3 then carry LOOK inside every verdict.
      PRINTED, NOT HELD, EVERY RUN (the finding, records/BOHEMIA_THE_LOOK_LEG_10_18_26.md): at the row's
      line LOOK reaches FAR on nothing we can plant: flat fill IN (his tile's own mean colour, cos 0.303
      against the line 0.200), his car cut into 8 px blocks and shuffled IN (0.423 against the props' 0.137),
      a lamp against his car IN. Each pack measuring itself (56 packs with 8+ pieces) is the line that sees:
      against his cars pack (20 pieces, 10th 0.760, 1st 0.712) the shuffled car, a lamp, a road tile and a
      door are FAR and his car mirrored IN, and the robot and the truck he voted up are FAR too (rig renders:
      rule 115, the rig is the look). Which line holds is the coordinator's to rule; the numbers print here.
  S0  THE SCRAMBLE IS HONEST (every box): a pixel scramble of his car keeps every pixel he drew (the same
      colours, the same count of each) and moves nearly all of them; an 8 px block scramble keeps every square
      whole and moves the squares. A scramble that changed a colour would be a different picture, not his.
  S1  THE MARGIN IS HIS YES (the runner): the lines carry THE SCRAMBLE, every YES item measured (the
      registry's newest verdict up, a pack twin the bank holds, its sprites; and T2's two maquettes), an
      item's gap the median of its sprites' (he voted on the card, not on each sprite), the weakest item per
      family the margin (tools/bohemia_twin_gate.py scramble_lines). At least five items.
  S2  EVERY YES ITEM PASSES IT through the score itself (the calibration and the verdict read the same); the
      YES sprites under the margin on their own are printed (a drum named against a car).
  S3  his car turned the other way passes the scramble. PRINTED, NOT HELD (run 39156939522, the finding): at his
      YES margin the twin scramble passed his car cut into 8 px squares and shuffled (gap +0.091 against +0.029)
      and failed 10 of 80 pairs of his own ground tiles, so it holds nothing; beside it STRUCTURE (each picture
      against itself scrambled at 1, 6, 8 and 16 px) prints for his cars, his YES items, the attacks and his
      tiles, with a road tile, a door and a lamp named as his car's twin, his cars pack's other pieces and his
      NO pieces.
  L4  THE LINES AGREE ACROSS BOXES: the runner's COLOUR, PATTERN, PAINTER, SHAPE and GRID lines equal the
      committed ones (only when $BOHEMIA_TWIN_COMMITTED_CAL names the committed copy; the workflow sets it).

RED CASE: T2's planted flat tile, fractional upscale and noise, T3's planted registry row and L0's planted
tracked export, every run; S0's planted colour change; on the runner L3's noise.

  python3 gates/twin_gate.py
"""
import hashlib, json, os, re, subprocess, sys, tempfile, time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
import numpy as np  # noqa: E402
from PIL import Image  # noqa: E402
import bohemia_twin_gate as TG  # noqa: E402

REGISTRY = os.path.join(ROOT, 'records', 'target', 'BOHEMIA_VOTE_REGISTRY.json')
BASELINE = os.path.join(ROOT, 'gates', 'twin_gate_baseline.json')
CARDS = os.path.join(ROOT, 'records', 'target', 'twin_cards')
WORKFLOW = os.path.join(ROOT, '.github', 'workflows', 'look.yml')
WEIGHT_FILE = re.compile(r'\.(onnx|pth|pt|safetensors|ckpt)$', re.I)
ART_LANES = {'cook', 'cook 2', 'cook 3', 'cook 4', 'cook two', 'cook three', 'cook four', 'direction',
             'character', 'portrait', 'animation', 'combat 2', 'combat two'}
NOT_ART = {'verdict', 'line', 'sound', 'text'}

passed = failed = 0


def ok(name, cond, why=''):
    global passed, failed
    if cond:
        passed += 1; print('  ok   ' + name)
    else:
        failed += 1; print('  FAIL ' + name + ('\n         ' + why if why else ''))


def t1():
    cal = TG.load_cal()
    if not cal:
        ok('T1 the lines exist', False, 'run: python3 tools/bohemia_twin_gate.py --calibrate'); return None
    disk = len(TG.pack_pieces('all'))
    miss = [f for f in TG.FAMILIES if TG.pack_pieces(f) and f not in cal['families']]
    drift = abs(disk - cal['pack_files']) / max(disk, 1)
    ok('T1 the lines are current (%d families, %d pack pieces on disk, measured over %d)' % (
        len(cal['families']) - 1, disk, cal['pack_files']), not miss and drift < 0.02,
       'families missing %s; drift %.1f%%. Run: python3 tools/bohemia_twin_gate.py --calibrate' % (miss, drift * 100))
    return cal


def planted(d):
    """the 10/10 cook's flat six-step ramp, a 1.5x nearest upscale of his tile, and noise."""
    tw = TG.pack_pieces('ground')[10]
    ramp = np.zeros((96, 96, 4), np.uint8); ramp[..., 3] = 255
    pal = [(60, 52, 40), (74, 64, 50), (88, 76, 60), (102, 88, 70), (116, 100, 80), (130, 112, 90)]
    blk = np.random.default_rng(2).integers(0, 6, (12, 12)).repeat(8, 0).repeat(8, 1)
    for k, c in enumerate(pal):
        ramp[blk == k, :3] = c
    out = {'flat': os.path.join(d, 'flat.png'), 'up15': os.path.join(d, 'up15.png'), 'noise': os.path.join(d, 'noise.png')}
    Image.fromarray(ramp).save(out['flat'])
    Image.open(tw).convert('RGBA').resize((144, 144), Image.NEAREST).save(out['up15'])
    n = np.random.default_rng(1).integers(0, 256, (96, 96, 4), dtype=np.uint8); n[..., 3] = 255
    Image.fromarray(n).save(out['noise'])
    return tw, out


def t2(cal, d):
    tw, p = planted(d)
    r = TG.score(tw, tw, cal=cal)
    ok('T2 a pack piece against itself is GREEN', r['verdict'] == 'GREEN', '%s %s' % (r['verdict'], r['why']))
    rng = np.random.default_rng(82); reds = []; n = 0; t0 = time.time(); lk = []
    for fam in ('ground', 'road'):
        fs = TG.pack_pieces(fam)
        for _ in range(40):
            i, j = rng.choice(len(fs), 2, replace=False)
            v = TG.score(fs[i], fs[j], fam, cal); n += 1
            if v['verdict'] == 'RED':
                reds.append('%s vs %s: %s' % (os.path.basename(fs[i]), os.path.basename(fs[j]), v['why'][:1]))
            if 'look' in v['rulers']:
                lk.append(v['rulers']['look']['level'])
    each = (time.time() - t0) / n
    ok('T2 his own tiles against each other: %d of %d pairs RED (under 5 in 100)' % (len(reds), n),
       len(reds) * 100 < 5 * n, '; '.join(reds[:3]))
    if lk:
        ok('L3 his own tiles against each other read FAR on LOOK alone in %d of %d pairs, OUT in %d (FAR under 2 in 100)'
           % (lk.count(2), len(lk), lk.count(1)), lk.count(2) * 100 < 2 * len(lk))
    for k, what in (('flat', 'a flat six-step ramp tile'), ('up15', 'a 1.5x nearest upscale (fractional grid)'), ('noise', 'noise')):
        v = TG.score(p[k], tw, cal=cal)
        ok('T2 %s is RED against his ground tile' % what, v['verdict'] == 'RED', '%s %s' % (v['verdict'], v['why']))
    car = TG.resolve('pack:10. Abandoned cars#0')
    for m, cls in (('robot', 'person'), ('truck', 'vehicle')):
        sp = os.path.join(ROOT, 'records', 'target', 'master_rig', m, 'rig_S.png')
        if not os.path.exists(sp) or not car:
            ok('T2 the maquette %s is on disk' % m, False); continue
        v = TG.score(sp, car, 'prop', cal, cls)
        ok('T2 the maquette %s (his YES) is not RED against a car (%s)' % (m, v['verdict']), v['verdict'] != 'RED', '; '.join(v['why']))
    ok('T2 a piece is scored in under three seconds (%.2f s)' % each, each < 3.0)


def held_items(reg, base, voted=False):
    """the new art items that name a twin. The cull is for candidates on their way to the tab; once he has voted
    on one his word is the verdict (the registry's verdicts are his words), so a voted item is not held, and
    voted=True lists those instead (a YES the rulers would RED is a ruler wrong, printed every run)."""
    last = TG.verdicts(reg)
    return [i for i in reg['items'] if i['id'] not in base and i.get('lane', '').lower() in ART_LANES
            and i.get('kind') not in NOT_ART and isinstance(i.get('twin'), dict) and i['twin'].get('src')
            and (i['id'] in last) == voted]


_TRACKED = None


def tracked():
    global _TRACKED
    if _TRACKED is None:
        _TRACKED = set(subprocess.run(['git', 'ls-files'], cwd=ROOT, capture_output=True, text=True).stdout.split('\n'))
    return _TRACKED


def own_before(src):
    """a twin that is one of our own sheets (outside reference/art_bank) that git tracks: the runner's sparse
    checkout leaves most of records/ and slices/ off disk, so the index answers, not the disk (run 39152693910)."""
    if src.startswith('pack:'):
        return False
    rels = {os.path.normpath(src), os.path.normpath(os.path.join('slices', src))}
    return any(r in tracked() and not r.startswith('reference' + os.sep + 'art_bank') for r in rels)


def cull(reg, base, cal, cards=CARDS, voted=False):
    probs, scored = [], 0
    for it in held_items(reg, base, voted):
        src = it['twin']['src']
        twin = TG.resolve(src)
        if twin and not src.startswith('pack:') and not os.path.abspath(twin).startswith(TG.BANK + os.sep):
            continue   # a 'before' of our own (an old sheet), not a pack twin: the twin law holds pack twins only
        if not twin and own_before(src):
            continue   # the same, on a box whose checkout does not carry it
        if not twin:
            probs.append('%s: its twin %r is not in the bank; name a twin the bank holds (reference/art_bank, '
                         'e.g. "pack:10. Abandoned cars#0")' % (it['id'], it['twin']['src'])); continue
        sprites = it.get('sprites') or []
        if not sprites:
            continue   # NOT VIBE CODED N3 already holds a picture that names no sprites (rule 114c)
        reds = []
        for sp in sprites[:8]:
            p = os.path.join(ROOT, sp)
            if not os.path.exists(p):
                reds.append('%s not on disk' % sp); continue
            v = TG.score(p, twin, None, cal, it.get('class')); scored += 1
            if v['verdict'] == 'RED':
                c = TG.card(p, twin, v, os.path.join(cards, '%s.png' % it['id']))
                reds.append('%s RED (%s); card %s' % (sp, '; '.join(v['why'][:2]), os.path.relpath(c, ROOT)))
        if reds:
            probs.append('%s: %s' % (it['id'], ' | '.join(reds)))
    return probs, scored


def t3(cal, d):
    reg = json.load(open(REGISTRY))
    base = set(json.load(open(BASELINE))['items'])
    probs, scored = cull(reg, base, cal)
    n = len(held_items(reg, base))
    ok('T3 the cull: %d new art items he has not voted on name a twin (%d sprites scored), none RED against it' % (n, scored),
       not probs, '\n         '.join(probs[:10]))
    last = TG.verdicts(reg)
    vp, vs = cull(reg, base, cal, cards=os.path.join(d, 'voted_cards'), voted=True)
    yes_red = [x.split(':')[0] for x in vp if last.get(x.split(':')[0]) == 'up']
    no_red = [x.split(':')[0] for x in vp if last.get(x.split(':')[0]) == 'down']
    print('  --   %d new items he already voted on, not held (his word is the verdict; %d sprites scored): the rulers '
          'would RED %d he said YES to (a ruler wrong: %s) and %d he said NO to (%s)' % (
              len(held_items(reg, base, True)), vs, len(yes_red), ', '.join(yes_red) or 'none', len(no_red),
              ', '.join(no_red) or 'none'))
    # both ways on a planted registry
    tw, p = planted(d)
    rel = lambda x: os.path.relpath(x, ROOT)
    good = os.path.join(d, 'good.png'); Image.open(TG.pack_pieces('ground')[11]).save(good)
    fake = {'items': [
        {'id': 'plant-good', 'lane': 'cook 2', 'kind': 'tile', 'twin': {'src': rel(tw)}, 'sprites': [rel(good)], 'class': 'tile'},
        {'id': 'plant-flat', 'lane': 'cook 2', 'kind': 'tile', 'twin': {'src': rel(tw)}, 'sprites': [rel(p['flat'])], 'class': 'tile'},
        {'id': 'plant-nowhere', 'lane': 'cook', 'kind': 'prop', 'twin': {'src': 'pack:99. A pack he never bought#0'}, 'sprites': [rel(good)]}]}
    pr, _ = cull(fake, set(), cal, cards=os.path.join(d, 'cards'))
    ids = {x.split(':')[0] for x in pr}
    ok('T3 the cull fails a flat tile and a twin the bank does not hold, and passes his own tile (planted)',
       ids == {'plant-flat', 'plant-nowhere'}, 'flagged %s' % sorted(ids))
    ok('T3 a RED writes its card (both crops at his size)', os.path.exists(os.path.join(d, 'cards', 'plant-flat.png')))
    # reported, never held: the registry rows from before this gate whose twin the bank does not hold
    old = [i for i in reg['items'] if i['id'] in base and isinstance(i.get('twin'), dict)
           and str(i['twin'].get('src', '')).startswith('pack:') and not TG.resolve(i['twin']['src'])]
    print('  --   %d rows from before this gate name a pack twin the bank does not hold (reported, not held): %s'
          % (len(old), ', '.join('%s (%s)' % (i['id'], i['twin']['src']) for i in old[:6])))


def t4(cal, d):
    tw, p = planted(d)
    good = TG.pack_pieces('ground')[11]
    seq = [p['noise'], good, p['flat']]
    asked = []
    make = lambda fb: seq.pop(0)
    critic = lambda ours, twin, q: (asked.append((ours, q)) or 'the left is a painted surface')
    best, rep, log = TG.critic_loop(make, critic, tw, cap=3, cal=cal)
    ok('T4 the critic loop keeps the best of three (%s) and reverts the worse retry' % os.path.basename(best),
       best == good and log[2].get('reverted') is True and len(log) == 3, json.dumps(log)[:300])
    ok('T4 one pairwise question a pass, and a RED piece never meets the critic',
       all(o != p['noise'] and o != p['flat'] for o, _ in asked) and len(asked) == 1
       and all(q in TG.QUESTIONS for _, q in asked), str(asked))


def weights_in(tracked):
    return [f for f in tracked if WEIGHT_FILE.search(f)]


def l0():
    git = lambda *a: subprocess.run(['git'] + list(a), cwd=ROOT, capture_output=True, text=True)
    tracked = git('ls-files').stdout.split('\n')
    w = weights_in(tracked)
    ok('L0 no model weights tracked in the repo (%d files read)' % len(tracked), tracked != [''] and not w, ', '.join(w[:5]))
    plant = weights_in(['tools/models/dinov2_vits14.onnx', 'tools/bohemia_look_export.py', 'records/target/x.png'])
    ok('L0 a planted tracked export is red', plant == ['tools/models/dinov2_vits14.onnx'], str(plant))
    ok('L0 tools/models/ is ignored (the export can never be added by accident)',
       git('check-ignore', '-q', 'tools/models/dinov2_vits14.onnx').returncode == 0, 'add tools/models/ to .gitignore')
    y = open(WORKFLOW).read() if os.path.isfile(WORKFLOW) else ''
    need = {'the export script': 'tools/bohemia_look_export.py', 'the cache': 'actions/cache/restore@',
            'the export kept the moment it is verified': 'actions/cache/save@',
            'the cache keyed on the export script': "hashFiles('tools/bohemia_look_export.py')",
            'the calibration': 'bohemia_twin_gate.py --calibrate', 'this gate': 'gates/twin_gate.py',
            'the committed lines to compare': 'BOHEMIA_TWIN_COMMITTED_CAL', 'read access only': 'contents: read'}
    miss = [k for k, v in need.items() if v not in y]
    if not re.search(r'DINOV2_COMMIT:\s*[0-9a-f]{40}\b', y):
        miss.append('the pinned DINOv2 commit')
    if not re.search(r'DINOV2_VITS14_SHA256:\s*[0-9a-f]{64}\b', y):
        miss.append('the pinned weights (sha256)')
    if 'contents: write' in y:
        miss.append('it asks to write')
    ok('L0 the look workflow exports, caches, calibrates and runs this gate on the free runner', bool(y) and not miss,
       'missing in .github/workflows/look.yml: %s' % ', '.join(miss or ['the file']))


def same(a, b, path=''):
    """every number equal within float noise; returns the first path that differs, or None."""
    if isinstance(a, dict):
        if not isinstance(b, dict) or set(a) != set(b):
            return path or '/'
        for k in a:
            r = same(a[k], b[k], path + '/' + k)
            if r:
                return r
        return None
    if isinstance(a, list):
        if not isinstance(b, list) or len(a) != len(b):
            return path
        for i, (x, y) in enumerate(zip(a, b)):
            r = same(x, y, '%s[%d]' % (path, i))
            if r:
                return r
        return None
    if isinstance(a, (int, float)) and isinstance(b, (int, float)):
        return None if abs(a - b) <= 1e-6 + 1e-4 * abs(a) else path
    return None if a == b else path


def s0():
    car = TG.rgba(TG.resolve('pack:10. Abandoned cars#0'))
    key = lambda a: np.sort(a.reshape(-1, a.shape[-1]).view([('', a.dtype)] * a.shape[-1]).ravel())
    px = TG.scramble(car, 1)
    moved = float((px != car).any(-1).mean())
    ok('S0 a pixel scramble of his car keeps every pixel he drew (%d) and moves %.0f%% of them' % (
        car.shape[0] * car.shape[1], moved * 100), np.array_equal(key(px), key(car)) and moved > 0.5)
    bad = px.copy(); bad[0, 0, :3] = (bad[0, 0, :3] + 37) % 256
    ok('S0 a scramble that changed one colour is caught (planted)', not np.array_equal(key(bad), key(car)))
    b = TG.SCRAMBLE_BLOCK
    bl = TG.scramble(car, 1, b)
    h, w = car.shape[0] // b * b, car.shape[1] // b * b
    sq = lambda a: {a[y:y + b, x:x + b].tobytes() for y in range(0, h, b) for x in range(0, w, b)}
    ok('S0 an %d px block scramble keeps every square whole (%d squares) and moves them' % (b, len(sq(car))),
       sq(bl) == sq(car) and not np.array_equal(bl, car) and np.array_equal(key(bl), key(car)))


def structure_lines(cal, d, car, paths):
    """PRINTED, NOT HELD: STRUCTURE, each picture against itself scrambled at 1, 6, 8 and 16 px (the cosine to the most
    alike of three scrambles of itself; high means it has no arrangement to lose). The numbers a held line would come
    from: his cars, his YES items, the attacks, a road tile, a door, a lamp and his ground tiles."""
    tw = TG.rgba(car)
    rd = lambda fs: TG.look_structure(TG.measured_cells(fs, tw))
    fmt = lambda r: '/'.join('%.3f' % r['self_%d' % k] for k in TG.STRUCTURE_SCALES)
    a = TG.rgba(car).astype(np.uint8)
    ys, xs = np.nonzero(a[..., 3] >= 128)
    a = a[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    for k in (6, 16):
        p = os.path.join(d, 'car_shuffled_%d.png' % k)
        Image.fromarray(TG.scramble(a, 7, k).astype(np.uint8), 'RGBA').save(p)
        paths['shuffle_%d' % k] = p
    print('  --   STRUCTURE (itself scrambled at %s px, the cosine to the most alike scramble; high = nothing to lose):' % '/'.join(map(str, TG.STRUCTURE_SCALES)))
    for what, f in (('his car cut into 8 px blocks and shuffled', paths['shuffle']), ('his car cut into 6 px blocks and shuffled', paths['shuffle_6']),
                    ('his car cut into 16 px blocks and shuffled', paths['shuffle_16']), ('his car', car),
                    ('a road tile', TG.pack_pieces('road')[0]), ('a door', TG.pack_pieces('door')[0]), ('a lamp', TG.pack_pieces('lamp')[0])):
        print('  --     %-44s %s' % (what, fmt(rd(f))))
    sib = [f for f in TG.pack_pieces('prop') if TG.pack_of(f) == TG.pack_of(car)]
    rs = [rd(f) for f in sib]
    print('  --     his cars pack, %d pieces: highest %s, median %s' % (len(rs), '/'.join('%.3f' % max(r['self_%d' % k] for r in rs) for k in TG.STRUCTURE_SCALES),
                                                                        '/'.join('%.3f' % float(np.median([r['self_%d' % k] for r in rs])) for k in TG.STRUCTURE_SCALES)))
    gs = [rd(f) for f in TG.pack_pieces('ground')[:12]]
    print('  --     his ground tiles, 12: lowest %s, median %s' % ('/'.join('%.3f' % min(r['self_%d' % k] for r in gs) for k in TG.STRUCTURE_SCALES),
                                                                   '/'.join('%.3f' % float(np.median([r['self_%d' % k] for r in gs])) for k in TG.STRUCTURE_SCALES)))
    for x in (cal.get('look') or {}).get('scramble', {}).get('items', []):
        if 'self_1' in x:
            print('  --     YES item %-40s %s' % (x['id'][:40], '/'.join('%.3f' % x['self_%d' % k] for k in TG.STRUCTURE_SCALES)))


def scramble_legs(cal, d, car, paths, rm):
    S = (cal.get('look') or {}).get('scramble') or {}
    yes = S.get('yes') or []
    ok('S1 the margin is his YES: %d sprites in %d YES items, the weakest item per family %s' % (
        len(yes), len(S.get('items', [])), S.get('margin', {}).get('pixel')),
       len(S.get('items', [])) >= 5 and 'all' in S.get('margin', {}).get('pixel', {}),
       'no SCRAMBLE in the lines: run python3 tools/bohemia_twin_gate.py --calibrate on this box')
    if not yes:
        return
    by, under = {}, []
    for y in TG.yes_pieces():
        r = TG.score(os.path.join(ROOT, y['sprite']), os.path.join(ROOT, y['twin']), None, cal, y['cls'])
        sc = r['rulers'].get('look', {}).get('scramble') or {}
        by.setdefault(y['id'], []).append(sc.get('gap_pixel'))
        if not sc.get('ok_pixel'):
            under.append('%s (%s, gap %+.3f)' % (os.path.relpath(y['sprite'], 'records/target'), y['id'], sc.get('gap_pixel')))
    m = S['margin']['pixel']
    fam = {x['id']: x['family'] for x in S.get('items', [])}
    fails = [i for i, g in by.items() if round(float(np.median(g)), 4) < m.get(fam.get(i), m['all']) - 1e-9]
    ok('S2 every YES item passes the scramble through the score itself, on the median of its sprites (%d of %d)' % (
        len(by) - len(fails), len(by)), by and not fails, ', '.join(fails))
    print('  --   YES sprites under the margin on their own (%d of %d; the item passed, the sprite would be RED as a new '
          'piece): %s' % (len(under), len(yes), '; '.join(under[:8]) or 'none'))
    rs = TG.score(paths['shuffle'], car, 'prop', cal)
    sc = rs['rulers']['look'].get('scramble') or {}
    # THE FINDING, run 39156939522: held at his YES margin the twin scramble PASSED the shuffled car (gap +0.091 against
    # the props' +0.029) and FAILED 10 of 80 pairs of his own ground tiles (a texture scrambled is still a texture to
    # DINOv2, nearer another tile than the tile itself); so it is printed, not held (SCRAMBLE_HELD), and STRUCTURE below
    # is measured beside it
    print('  --   S3 THE TWIN SCRAMBLE, PRINTED NOT HELD: his car cut into 8 px blocks and shuffled reads gap %+.3f against '
          'his YES margin %+.3f (%s; verdict %s)' % (sc.get('gap_pixel'), sc.get('margin_pixel'),
                                                    'it would pass' if sc.get('ok_pixel') else 'it would fail', rs['verdict']))
    sm = rm['rulers']['look'].get('scramble') or {}
    ok('S3 his car turned the other way passes the scramble (gap %s, margin %s)' % (sm.get('gap_pixel'), sm.get('margin_pixel')),
       sm.get('ok_pixel') is True, json.dumps(sm))
    fmt = lambda sc: 'gap %+.3f pixel (margin %+.3f) %s, %+.3f block (margin %+.3f) %s' % (
        sc['gap_pixel'], sc['margin_pixel'], 'ok' if sc['ok_pixel'] else 'FAILS', sc['gap_block'], sc['margin_block'],
        'ok' if sc['ok_block'] else 'FAILS')
    print('  --   SCRAMBLE on the shuffled car: %s' % fmt(sc))
    print('  --   SCRAMBLE on his car turned the other way: %s' % fmt(sm))
    for fam, what in (('lamp', 'a lamp'), ('road', 'a road tile'), ('door', 'a door')):
        r = TG.score(TG.pack_pieces(fam)[0], car, 'prop', cal)
        print('  --   SCRAMBLE on %s named as his car\'s twin: %s (verdict %s)' % (what, fmt(r['rulers']['look']['scramble']), r['verdict']))
    sib = [f for f in TG.pack_pieces('prop') if TG.pack_of(f) == TG.pack_of(car) and f != car]
    res = [TG.score(f, car, 'prop', cal)['rulers']['look']['scramble'] for f in sib]
    print('  --   SCRAMBLE on his cars pack\'s other %d pieces against his car: %d pass pixel, %d pass block; gaps pixel %s' % (
        len(res), sum(r['ok_pixel'] for r in res), sum(r['ok_block'] for r in res),
        ' '.join('%+.2f' % r['gap_pixel'] for r in sorted(res, key=lambda r: r['gap_pixel']))))
    reg = json.load(open(REGISTRY)); last = TG.verdicts(reg); nos = []
    for it in reg['items']:
        tw = it.get('twin') if isinstance(it.get('twin'), dict) else {}
        t = TG.resolve(tw.get('src')) if tw.get('src') else None
        if last.get(it['id']) == 'down' and t and os.path.abspath(t).startswith(TG.BANK + os.sep) and it.get('sprites'):
            for sp in it['sprites'][:8]:
                p = os.path.join(ROOT, sp)
                if os.path.isfile(p):
                    nos.append((it['id'], sp, TG.score(p, t, None, cal, it.get('class'))['rulers'].get('look', {}).get('scramble')))
    structure_lines(cal, d, car, paths)
    print('  --   SCRAMBLE on his NO pieces (%d sprites): %s' % (len(nos), '; '.join(
        '%s %s %s' % (i, os.path.basename(sp), fmt(sc)) for i, sp, sc in nos if sc) or 'none name a pack twin and sprites'))


def look_legs(cal, d):
    side = os.path.splitext(TG.ONNX)[0] + '.json'
    s = json.load(open(side)) if os.path.isfile(side) else {}
    h = hashlib.sha256(open(TG.ONNX, 'rb').read()).hexdigest()
    v = s.get('verify', {})
    ok('L1 the ONNX is the verified export (sha256 %s..., cos %s against torch on %s inputs, %s ms an image)' % (
        h[:12], v.get('cos_min'), v.get('inputs'), s.get('ms_per_image_cpu')),
       s.get('onnx_sha256') == h and (v.get('cos_min') or 0) >= 0.9999,
       'sidecar %s: %s' % (os.path.relpath(side, ROOT), 'missing' if not s else 'sha or check does not hold'))
    keys = ('pair', 'centroid', 'pair_far', 'centroid_far', 'centroid_emb')
    miss = [f for f in cal['families'] if not all(k in (cal['families'][f].get('look') or {}) for k in keys)]
    ok('L2 the lines carry LOOK for every family (%s)' % ', '.join(
        '%s %.3f/%.3f' % (f, x['look']['pair'], x['look']['centroid']) for f, x in cal['families'].items() if x.get('look')),
       not miss, 'no LOOK in %s: run python3 tools/bohemia_twin_gate.py --calibrate on this box' % miss)
    if miss:
        return
    tw, p = planted(d)
    me = TG.score(tw, tw, cal=cal)['rulers'].get('look', {})
    ok('L3 his piece against itself reads LOOK cosine %s, IN' % me.get('twin'),
       (me.get('twin') or 0) >= 0.9999 and me.get('level') == 0, str(me))
    lv = lambda r: {0: 'IN', 1: 'OUT', 2: 'FAR'}.get(r.get('level'), '?')
    r = TG.score(p['noise'], tw, cal=cal)['rulers'].get('look', {})
    ok('L3 noise against his ground tile is never IN on LOOK (%s: cos %s to the twin, %s to the family)' % (
        lv(r), r.get('twin'), r.get('family')), r.get('level') in (1, 2), str(r))
    for k, what in (('flat', 'the flat six-step ramp'), ('up15', 'the 1.5x upscale (GRID\'s to catch, not LOOK\'s)')):
        r = TG.score(p[k], tw, cal=cal)['rulers'].get('look', {})
        print('  --   LOOK on %s against his ground tile: %s (cos %s to the twin, %s to the family)' % (
            what, lv(r), r.get('twin'), r.get('family')))
    # what only LOOK can see: his own car with its colours and grain kept and its shape gone
    car = TG.resolve('pack:10. Abandoned cars#0')
    a = TG.rgba(car).astype(np.uint8)
    ys, xs = np.nonzero(a[..., 3] >= 128)
    a = a[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    h8, w8 = a.shape[0] // 8 * 8, a.shape[1] // 8 * 8
    a = a[:h8, :w8]
    blocks = [a[y:y + 8, x:x + 8] for y in range(0, h8, 8) for x in range(0, w8, 8)]
    order = np.random.default_rng(7).permutation(len(blocks))
    cols = w8 // 8
    sh = np.zeros_like(a)
    for n, i in enumerate(order):
        y, x = divmod(n, cols)
        sh[y * 8:y * 8 + 8, x * 8:x * 8 + 8] = blocks[i]
    paths = {'shuffle': os.path.join(d, 'car_shuffled.png'), 'mirror': os.path.join(d, 'car_mirror.png')}
    Image.fromarray(sh, 'RGBA').save(paths['shuffle'])
    Image.open(car).convert('RGBA').transpose(Image.FLIP_LEFT_RIGHT).save(paths['mirror'])
    rm = TG.score(paths['mirror'], car, 'prop', cal)
    ok('L3 his car turned the other way reads IN on LOOK (cos %s)' % rm['rulers']['look']['twin'],
       rm['rulers']['look']['level'] == 0, str(rm['rulers']['look']))
    # flat fill, the vibe-coded look itself (research tell: the same value everywhere, nobody painted it),
    # against his ground tile: his tile's own mean colour, a mid grey, a smooth ramp, an 8 px checker
    g = TG.rgba(tw).astype(np.uint8)
    fills = {'his tile\'s own mean colour, flat': np.broadcast_to(g[..., :3].reshape(-1, 3).mean(0).astype(np.uint8), g[..., :3].shape),
             'a flat mid grey': np.full(g[..., :3].shape, 128, np.uint8),
             'a smooth ramp': np.repeat(np.linspace(40, 200, g.shape[1]).astype(np.uint8)[None, :, None], g.shape[0], 0).repeat(3, 2),
             'an 8 px checker': ((np.indices(g.shape[:2]).sum(0) // 8 % 2) * 120 + 60).astype(np.uint8)[..., None].repeat(3, 2)}
    # PRINTED, NOT HELD (run 39153830493): at the family's line LOOK reads every flat fill IN or OUT, never
    # FAR (his tile's own mean colour 0.303 to the twin against the line 0.200); COLOUR and PAINTER catch them
    for what, rgb in fills.items():
        f = os.path.join(d, 'fill_%d.png' % len(what))
        Image.fromarray(np.dstack([rgb, np.full(rgb.shape[:2], 255, np.uint8)]), 'RGBA').save(f)
        v = TG.score(f, tw, cal=cal)
        r = v['rulers'].get('look', {})
        print('  --   LOOK on %s against his ground tile: %s (cos %s to the twin, %s to the family; the verdict %s)' % (
            what, lv(r), r.get('twin'), r.get('family'), v['verdict']))
    # PRINTED, NOT HELD: the shuffled car, at the family's line and at his cars pack's own line
    rs = TG.score(paths['shuffle'], car, 'prop', cal)
    lk = rs['rulers']['look']
    packs = (cal.get('look') or {}).get('packs') or {}
    pk = packs.get(TG.pack_of(car)) or {}
    at = lambda c: '?' if not pk else ('IN' if c >= pk['p10'] else 'OUT' if c >= pk['p1'] else 'FAR')
    print('  --   LOOK on his car cut into 8 px blocks and shuffled (his colours and grain, no car; COLOUR %s, PATTERN %s): '
          '%s at the props\' line (cos %s to the car, line %s); %s at his cars pack\'s own line (%s pieces, 10th %s, 1st %s)' % (
              {0: 'IN', 1: 'OUT', 2: 'FAR'}[rs['rulers']['colour']['level']], {0: 'IN', 1: 'OUT', 2: 'FAR'}[rs['rulers']['pattern']['level']],
              lv(lk), lk['twin'], lk['line']['pair'], at(lk['twin']), pk.get('pieces'), pk.get('p10'), pk.get('p1')))
    for m in ('robot', 'truck'):
        sp = os.path.join(ROOT, 'records', 'target', 'master_rig', m, 'rig_S.png')
        if os.path.exists(sp):
            r = TG.score(sp, car, 'prop', cal, 'vehicle' if m == 'truck' else 'person')['rulers'].get('look', {})
            print('  --   LOOK on the maquette %s (his YES) against his car: %s at the props\' line, %s at the cars pack\'s (cos %s)' % (
                m, lv(r), at(r.get('twin', 0)), r.get('twin')))
    print('  --   LOOK at the cars pack\'s line: his car turned the other way %s (cos %s)' % (at(rm['rulers']['look']['twin']), rm['rulers']['look']['twin']))
    scramble_legs(cal, d, car, paths, rm)
    for fam, what in (('lamp', 'a lamp'), ('road', 'a road tile'), ('door', 'a door')):
        q = TG.pack_pieces(fam)[0]
        r = TG.score(q, car, 'prop', cal)
        print('  --   LOOK on %s against his car: %s at the props\' line, %s at the cars pack\'s (cos %s; verdict %s)' % (
            what, lv(r['rulers']['look']), at(r['rulers']['look']['twin']), r['rulers']['look']['twin'], r['verdict']))
    print('  --   LOOK per pack, printed not held: %d packs; the five loosest: %s' % (len(packs), ', '.join(
        '%s %s/%s' % (k[5:], v['p10'], v['p1']) for k, v in sorted(packs.items(), key=lambda kv: kv[1]['p10'])[:5])))
    com = os.environ.get('BOHEMIA_TWIN_COMMITTED_CAL')
    if com:
        c = json.load(open(com))
        strip = lambda F: {f: {k: v for k, v in x.items() if k != 'look'} for f, x in F['families'].items()}
        diff = same(strip(c), strip(cal))
        ok('L4 the runner\'s COLOUR, PATTERN, PAINTER, SHAPE and GRID lines equal the committed ones', diff is None,
           'first difference at %s' % diff)


def main():
    print('THE TWIN GATE (rule 108 round eight c, the twin law 82): a new picture against its pack twin')
    l0()
    s0()
    cal = t1()
    if cal is None:
        print('\nTHE TWIN GATE: %d passed, %d failed' % (passed, failed)); return 1
    d = tempfile.mkdtemp()
    look = TG.look_on()
    print('  --   LOOK (DINOv2 ViT-S/14, Apache-2.0 read): %s' % (
        'MEASURED (%s), inside every verdict below' % os.path.relpath(TG.ONNX, ROOT) if look else
        'UNMEASURED, no weights at %s (huggingface and fbaipublicfiles 403 here); the free runner measures it '
        '(.github/workflows/look.yml)' % os.path.relpath(TG.ONNX, ROOT)))
    if look:
        look_legs(cal, d)
    t2(cal, d)
    t3(cal, d)
    t4(cal, d)
    print('\nTHE TWIN GATE: %d passed, %d failed' % (passed, failed))
    return 1 if failed else 0


if __name__ == '__main__':
    sys.exit(main())
