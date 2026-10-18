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
      a twin and its sprites is scored sprite by sprite against the twin; any RED sprite is red here, and its
      card (his twin and ours at his size, the verdict and why) is written to records/target/twin_cards/<id>.png.
      A new item whose pack twin the bank does not hold is red ('name a twin the bank holds'); a twin that is
      our own earlier sheet (a 'before', outside reference/art_bank) is not a pack twin and is not held (on
      10/18 COOK THREE's two rig enemies read RED against the old flat sheet they replace, which is the point
      of them). Proven both ways on a planted registry every run.
  T4  THE CRITIC LOOP: one pairwise question a pass, never a score; cap three; keep best and revert a worse
      retry; a RED piece never meets the critic. Proven on a planted maker and critic.

LOOK (DINOv2 ViT-S/14): Apache-2.0, read 10/18 from facebookresearch/dinov2 LICENSE and MODEL_CARD.md
('License: Apache License 2.0'). Its weights are not on this box (huggingface.co and dl.fbaipublicfiles.com
answer 403 from the container), so the leg prints UNMEASURED with the path it looks for and holds nothing;
PATTERN (local binary patterns) stands in as the third unrelated ruler until it lands.

RED CASE: T2's planted flat tile, fractional upscale and noise, and T3's planted registry row, every run.

  python3 gates/twin_gate.py
"""
import json, os, sys, tempfile, time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
import numpy as np  # noqa: E402
from PIL import Image  # noqa: E402
import bohemia_twin_gate as TG  # noqa: E402

REGISTRY = os.path.join(ROOT, 'records', 'target', 'BOHEMIA_VOTE_REGISTRY.json')
BASELINE = os.path.join(ROOT, 'gates', 'twin_gate_baseline.json')
CARDS = os.path.join(ROOT, 'records', 'target', 'twin_cards')
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
    rng = np.random.default_rng(82); reds = []; n = 0; t0 = time.time()
    for fam in ('ground', 'road'):
        fs = TG.pack_pieces(fam)
        for _ in range(40):
            i, j = rng.choice(len(fs), 2, replace=False)
            v = TG.score(fs[i], fs[j], fam, cal); n += 1
            if v['verdict'] == 'RED':
                reds.append('%s vs %s: %s' % (os.path.basename(fs[i]), os.path.basename(fs[j]), v['why'][:1]))
    each = (time.time() - t0) / n
    ok('T2 his own tiles against each other: %d of %d pairs RED (under 5 in 100)' % (len(reds), n),
       len(reds) * 100 < 5 * n, '; '.join(reds[:3]))
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


def held_items(reg, base):
    return [i for i in reg['items'] if i['id'] not in base and i.get('lane', '').lower() in ART_LANES
            and i.get('kind') not in NOT_ART and isinstance(i.get('twin'), dict) and i['twin'].get('src')]


def cull(reg, base, cal, cards=CARDS):
    probs, scored = [], 0
    for it in held_items(reg, base):
        src = it['twin']['src']
        twin = TG.resolve(src)
        if twin and not src.startswith('pack:') and not os.path.abspath(twin).startswith(TG.BANK + os.sep):
            continue   # a 'before' of our own (an old sheet), not a pack twin: the twin law holds pack twins only
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
    ok('T3 the cull: %d new art items name a twin (%d sprites scored), none RED against it' % (n, scored),
       not probs, '\n         '.join(probs[:10]))
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


def main():
    print('THE TWIN GATE (rule 108 round eight c, the twin law 82): a new picture against its pack twin')
    cal = t1()
    if cal is None:
        print('\nTHE TWIN GATE: %d passed, %d failed' % (passed, failed)); return 1
    d = tempfile.mkdtemp()
    t2(cal, d)
    t3(cal, d)
    t4(cal, d)
    look = TG.look_embed(np.zeros((8, 8, 4)))
    print('  --   LOOK (DINOv2 ViT-S/14, Apache-2.0 read): %s' % (
        'measured' if look is not None else 'UNMEASURED, no weights at %s (huggingface and fbaipublicfiles 403 here)'
        % os.path.relpath(TG.ONNX, ROOT)))
    print('\nTHE TWIN GATE: %d passed, %d failed' % (passed, failed))
    return 1 if failed else 0


if __name__ == '__main__':
    sys.exit(main())
