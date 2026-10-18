#!/usr/bin/env python3
"""THE NOT VIBE CODED GATE (10/18/26, PLUMBER lane, VAMILY row [the not vibe coded gates]; rule 114b;
Paolo 10/16: "it can't look like it's vibe coded ... it has to look like it was not made by you like a
freaking AI guy").

The ten checks live in tools/bohemia_not_vibe_coded.py (Section D of the round one research page, in its
order). This gate holds them and holds the art to them.

WHAT THIS ROUND MEASURED FIRST (and why the blocking ruler is the packs): the research page's own numbers
(Section C: a character holds 12 colours, a prop 6, a tile 5) FAIL HIS OWN PACKS. Over 25 pieces a family
across seven families, D2 failed 175 of 175 (a pack prop holds about 3,000 colours), D5 172 of 175, D8 175
of 175. MODS measured the same wall the same round (a prop holds at least 2,330 colours). So a gate on
Section C's numbers would block the look he approved as the floor (rule 82). The blocking ruler is THE PACK
BAND: per family, the 90th percentile of every pack piece on each number (records/target/
BOHEMIA_NOT_VIBE_CODED_BANDS.json); a candidate worse than nine in ten of the pieces he bought fails. The
research numbers are printed beside it so DIRECTION sees the gap when it writes the style guide (rule 114a);
its file replaces gates/not_vibe_coded_thresholds.json key by key when it lands.

THE LEGS
  N1  EVERY CHECK BITES, BOTH WAYS: a planted made sprite (one light, a hue-shifted ramp in flat clusters,
      a 1 px outline, one busy focal patch) passes D1 to D9, and each check fails its planted vibe-coded
      twin (mixels, a smooth gradient, lit from below, straight darkening, noise everywhere, a box, one
      value, salted orphans); D6 across a set (two identical sprites fail, two different pass); D9 on a
      sheet (one tile repeated fails, eight mixed pass); D10 on planted CSS (a gradient and Arial fail,
      flat panels with the pixel font pass).
  N2  THE BAND IS CURRENT: the band file exists, carries every pack family, and was built over the number
      of pack pieces on disk now (a band over last week's packs is a ruler nobody owns).
  N3  THE CULL (rule 114b, c): an art item registered in VOTE after this gate (its id not in the frozen
      baseline) that shows an image names its sprites ("sprites": [png paths]) and its look ("look":
      {"px", "palette", "light"}); every sprite exists and passes D1 to D5, D2 and D5 against its family's
      pack band, D1, D3 (its own declared light) and D4 against the research line (RULER below says why).
      A sheet that fails the first five never reaches the tab. The 614 items registered before this gate
      are reported, never held (a frozen baseline that never grows).
  N5  THE MAQUETTES PASS (DIRECTION's style guide, tie-breaker 1: his YES wins over every number): the robot and
      the truck pass the held first five on all eight facings, and the guide's G2 and light row bite both ways
      on the plants. When the guide is on disk it holds the rendered classes (RULER below).
  N6  THE GROUND RULER (10/18, COOK TWO [the ground ruler]): class tile is judged a pack tile at a time
      (cut to the family's median pack size, 96 px), D2 and D5 every cell against the ground packs, D3 not
      held (a top-down slab has no light; the packs' own 90th percentile is 180 degrees), D4 to the pack
      band; his road tiles pass 228 of 278 and his ground 335 of 391 (were 9 and 24), COOK TWO's kit 21 of
      21 (was 0); a sheet with one noise cell is red.
  N4  NO NEW UI DEFAULT (D10): gradients, blur, glow, radius over 2 px, panel hues 250 to 290 and system
      fonts in the shipped demo and alpha may only go down from the frozen counts.

  (N1 also holds round two's rendered-sprite set, records/BOHEMIA_RESEARCH_HOW_NOT_TO_LOOK_VIBE_CODED_ROUND_TWO_
  THE_RIG_10_18_26.md Section D 2, 7, 8, 10: a binary alpha with no boundary-only colour; eight facings on one
  foot row and one height within 1 px, one light in every facing, the area within 25%, the front not its own
  mirror. The rig is printed through it every run; Section D 1 reads the .blend and is DIRECTION's.)

RED CASE: N1's fifteen planted vibe-coded sprites, sheets and CSS, every run; and on 10/18 the master rig's
robot and truck (the two things he loved) fail D2 against the research numbers with 5,126 and 14,170
colours, printed every run as the gap DIRECTION's rig has to close (round two, Section C: Constant ramps).

  python3 gates/not_vibe_coded_gate.py
"""
import json, os, sys, tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
sys.path.insert(0, os.path.join(ROOT, 'gates'))
import bohemia_not_vibe_coded as N  # noqa: E402
import not_vibe_coded_plants as P   # noqa: E402

REGISTRY = os.path.join(ROOT, 'records', 'target', 'BOHEMIA_VOTE_REGISTRY.json')
BASELINE = os.path.join(ROOT, 'gates', 'not_vibe_coded_baseline.json')
UI_FILES = ['slices/BOHEMIA_DEMO.html', 'slices/BOHEMIA_ALPHA_0_9.html']
ART_LANES = {'cook', 'cook 2', 'cook 3', 'cook 4', 'cook two', 'cook three', 'cook four', 'direction',
             'character', 'portrait', 'animation', 'combat 2', 'combat two'}
NOT_ART = {'verdict', 'line', 'sound', 'text'}
KIND_FAMILY = {'tile': 'ground', 'outfit': 'all', 'face': 'all', 'animation': 'all', 'prop': 'prop',
               'building': 'settlement', 'vehicle': 'prop', 'beast': 'all', 'door': 'door', 'lamp': 'lamp'}
RIG = os.path.join(ROOT, 'records', 'target', 'master_rig')
RIG_CLASS = {'man': 'person', 'robot': 'person', 'truck': 'vehicle', 'fox': 'beast',
             'dire_wolf': 'beast', 'game_wolf': 'beast'}
FACINGS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']

passed = failed = 0


def ok(name, cond, why=''):
    global passed, failed
    if cond:
        passed += 1
        print('  ok   ' + name)
    else:
        failed += 1
        print('  FAIL ' + name + ('\n         ' + why if why else ''))


def verdicts(rep):
    return {d: rep[d]['ok'] for d in ('D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9')}


def n1(T):
    made = N.sprite_report(P.made(), 'character', 'upper-left', None, T)
    bad = [d for d, v in verdicts(made).items() if v is not True and d != 'D9']
    ok('N1 the planted made sprite passes D1 to D8', not bad,
       'fails or unmeasured: ' + ', '.join('%s (%s)' % (d, made[d]['why']) for d in bad))
    plants = [('D1', P.mixels, 'two pixel sizes'), ('D2', P.smooth, 'a smooth gradient'),
              ('D3', P.lit_from_below, 'lit from below'), ('D4', P.straight_dark, 'straight darkening'),
              ('D5', P.noise_everywhere, 'noise everywhere'), ('D6', P.box, 'a box'),
              ('D7', P.one_value, 'one value'), ('D8', P.salted, 'salted orphans')]
    for d, fn, what in plants:
        r = N.sprite_report(fn(), 'character', 'upper-left', None, T)
        ok('N1 %s fails %s' % (d, what), r[d]['ok'] is False, '%s said %s %s' % (d, r[d]['ok'], r[d]['value']))
    wide = P.box()  # a box is its own mirror: D9's mirror leg
    ok('N1 D9 fails a sprite that is its own mirror', N.sprite_report(wide, 'prop', 'upper-left', None, T)['D9']['ok'] is False)
    import numpy as np
    a1 = N.load(P.made())[1]; a2 = N.load(P.box())[1]
    ok('N1 D6 fails two sprites with one silhouette', N.d6_set([a1, a1], ['a', 'b'], T)['ok'] is False)
    ok('N1 D6 passes two different silhouettes', N.d6_set([a1, a2], ['a', 'b'], T)['ok'] is True)
    for vary, want in ((False, False), (True, True)):
        rgb, a = N.load(P.tiled_sheet(vary))
        ok('N1 D9 %s a sheet of %s' % ('passes' if want else 'fails', 'eight mixed tiles' if vary else 'one tile'),
           N.d9_sheet(rgb, a, T)['ok'] is want)
    with tempfile.TemporaryDirectory() as d:
        bad_css = os.path.join(d, 'bad.html'); good_css = os.path.join(d, 'good.html')
        open(bad_css, 'w').write('<style>.p{background:linear-gradient(#000,#fff);font-family: Arial;'
                                 'border-radius: 12px;box-shadow: 0 0 8px #0ff}</style>')
        open(good_css, 'w').write('<style>.p{background:#1a1410;font-family:"BohemiaPixel";border-radius:0}</style>')
        b = N.d10([bad_css]); g = N.d10([good_css])
        hits = list(b.values())[0] if b else {}
        ok('N1 D10 fails a gradient, Arial, a 12 px radius and a glow',
           all(k in hits for k in ('gradient', 'system font', 'radius', 'glow')), 'found %s' % hits)
        ok('N1 D10 passes flat panels with the pixel font', not g, 'found %s' % g)
        # round two, the rendered-sprite set
        import numpy as np
        from PIL import Image
        m = np.asarray(P.made()).copy()
        rgb, a = N.load(P.made())
        ok('N1 R2 passes a binary alpha with no boundary-only colour', N.r2_alpha(rgb, a, T)['ok'] is True,
           str(N.r2_alpha(rgb, a, T)))
        soft = m.copy(); edge = (soft[..., 3] > 0) & (np.roll(soft[..., 3], 1, 0) == 0); soft[edge, 3] = 128
        ok('N1 R2 fails a soft (filtered) edge', N.r2_alpha(*N.load(Image.fromarray(soft, 'RGBA')), T)['ok'] is False)
        fs = []
        for i in range(8):
            q = os.path.join(d, 'f%d_%s.png' % (i, ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][i]))
            P.made().save(q); fs.append(q)
        ok('N1 R8 passes eight facings that stand on one foot row with one light', N.r8_facings(fs, T)['ok'] is True,
           str(N.r8_facings(fs, T)))
        sunk = np.roll(m, 6, 0); Image.fromarray(sunk, 'RGBA').save(fs[3])
        ok('N1 R8 fails a facing that sinks 6 px', N.r8_facings(fs, T)['ok'] is False)


def n2():
    if not os.path.exists(N.BANDS):
        ok('N2 the pack band exists', False, 'run: python3 tools/bohemia_not_vibe_coded.py --bands')
        return None
    b = json.load(open(N.BANDS))
    fams = sorted(d for d in os.listdir(N.BANK) if N.pack_pieces(d))
    now = sum(len(N.pack_pieces(f)) for f in fams)
    missing = [f for f in fams if f not in b['families']]
    drift = abs(now - (b.get('pack_files') or 0)) / float(max(now, 1))
    ok('N2 the pack band is current (%d families, %d pieces on disk, band over %s; drift under 2%%)' % (
        len(fams), now, b.get('pack_files')),
       not missing and drift <= 0.02,
       'band built over %s pieces, %d on disk; families missing %s. Run: python3 tools/bohemia_not_vibe_coded.py --bands'
       % (b.get('pack_files'), now, missing))
    return b


# WHICH RULER HOLDS WHICH CHECK.
# A RENDERED CLASS (person, beast, vehicle, prop) is held to DIRECTION's style guide where it sets the number
# (rule 114a; records/target/BOHEMIA_STYLE_GUIDE.json, tests G1 to G10): D2 is G2 (the class's colour FLOOR and
# the top-eight share, not a cap: the guide decided against the research's caps with his YES on the robot at
# 5,871 colours), D3 is the guide's card row (top half at least as bright as the bottom), D4 is G4 on the
# SOURCE palette (the guide put the hue shift there, not in a stepped ramp), D5 is the pack band of the
# guide's judge family. Everything else, and every class when no guide is on disk, holds to the research line
# where the packs pass it (D1, D3 against the item's own declared light, D4) and to the pack band where the
# research numbers fail every piece he bought (D2, D5); on D3 and D4 the packs' 90th percentile is the worst
# possible value (180 degrees, every ramp straight), so a band there would pass anything.
RENDERED = {'person', 'beast', 'vehicle', 'prop'}
CLASS_ALIAS = {'character': 'person', 'enemy': 'person', 'boss': 'person'}


def tile_verdict(rep, fam, bands, src, T):
    """CLASS TILE, THE GROUND RULER (10/18, COOK TWO's measurement, records/target/COOK2_THE_GROUND_AGAINST_
    THE_CULL.json): his own bought tiles fail the research line on D3 (256 of 278 road, 355 of 391 ground) and
    D4 (122 of 278, 119 of 391), and a kit piece of sixteen pack tiles was held to the band of ONE pack tile.
    So a tile is judged A PACK TILE AT A TIME (cut to the family's own median size): D1 on the research line,
    D2 and D5 every cell against the family's pack band. D3 is not held: a top-down slab carries no light
    direction, and the ground packs' own 90th percentile is 180 degrees, the worst value there is. D4 holds
    to the pack band, which on the ground is every ramp straight (1.0); both say so in the card rather than
    printing a pass a ruler did not earn."""
    tfam = fam if fam in N.TILE_FAMILIES else 'ground'
    cell = N.pack_cell(tfam)
    out = {'D1': (rep['D1']['ok'], rep['D1']['why'])}
    bad = {'D2': [], 'D5': []}
    cells = N.tile_cells(src, cell)
    for i, c in enumerate(cells):
        r = N.sprite_report(c, 'tile', 'upper-left', None, T)
        bv = N.band_verdict(r, tfam, bands) if bands else {d: {'ok': r[d]['ok'], 'why': r[d]['why']} for d in ('D2', 'D5')}
        for d in ('D2', 'D5'):
            if bv.get(d, {}).get('ok') is False:
                bad[d].append('cell %d: %s' % (i, bv[d]['why']))
    for d in ('D2', 'D5'):
        out[d] = (not bad[d], 'against the %s packs a %d px cell at a time (%d cells): %s' % (
            tfam, cell, len(cells), '; '.join(bad[d][:3])))
    lim3 = (bands or {}).get('families', {}).get(tfam, {}).get('band', {}).get('D3', {}).get('angle_off')
    out['D3'] = (None, 'not held on a tile: a top-down slab has no light direction (the %s packs\' 90th '
                       'percentile is %s degrees)' % (tfam, lim3))
    bv = N.band_verdict(rep, tfam, bands) if bands else {}
    lim4 = (bands or {}).get('families', {}).get(tfam, {}).get('band', {}).get('D4', {}).get('straight_share')
    d4ok = bv.get('D4', {}).get('ok')
    out['D4'] = (d4ok, 'against the %s packs (their 90th percentile: %s of ramps straight) %s' % (
        tfam, lim4, bv.get('D4', {}).get('why', '')))
    return out


def held_verdict(rep, fam, bands, cls=None, src=None, g=None, T=None):
    cls = CLASS_ALIAS.get(cls, cls)
    if cls == 'tile' and src is not None:
        return tile_verdict(rep, fam, bands, src, T or N.thresholds())
    bv = N.band_verdict(rep, fam, bands) if bands else {}
    out = {'D1': (rep['D1']['ok'], rep['D1']['why'])}
    if g is not None and cls in RENDERED and src is not None:
        rgb, a = N.load(src)
        fam = g['classes'][cls].get('judge_family', fam)
        bv = N.band_verdict(rep, fam, bands) if bands else {}
        r2, r3, r4 = N.g2(rgb, a, g, cls), N.g3(rgb, a, g), N.g4_palette(g)
        out['D2'] = (r2['ok'], 'the guide\'s G2: ' + r2['why'])
        out['D3'] = (r3['ok'], 'the guide\'s light row: ' + r3['why'])
        out['D4'] = (r4['ok'], 'the guide\'s G4 on the source palette: ' + r4['why'])
        out['D5'] = (bv.get('D5', {}).get('ok'), 'against the %s packs: %s' % (fam, bv.get('D5', {}).get('why', '')))
        return out
    for d in ('D2', 'D5'):
        if bands:
            out[d] = (bv.get(d, {}).get('ok'), 'against the %s packs: %s' % (fam, bv.get(d, {}).get('why', '')))
        else:
            out[d] = (rep[d]['ok'], rep[d]['why'])
    for d in ('D3', 'D4'):
        out[d] = (rep[d]['ok'], rep[d]['why'])
    return out


def n3(T, bands):
    reg = json.load(open(REGISTRY))
    base = set(json.load(open(BASELINE))['items'])
    new = [i for i in reg['items'] if i['id'] not in base and i.get('lane', '').lower() in ART_LANES
           and i.get('kind') not in NOT_ART]
    probs = []
    held = 0
    for it in new:
        shows_image = it.get('show', {}).get('how') == 'image' or it.get('sprites')
        if not shows_image:
            continue
        held += 1
        look = it.get('look') or {}
        if not it.get('sprites'):
            probs.append('%s: names no sprites. Add to its registry row: "sprites": ["<each png the sheet shows, '
                         'e.g. the eight rig_<facing>.png>"], "class": "person|beast|vehicle|prop|tile", "look": '
                         '{"px": 1, "palette": "records/target/BOHEMIA_STYLE_PALETTE.json", "light": "guide"} '
                         '(rule 114c)' % it['id']); continue
        if not all(k in look for k in ('px', 'palette', 'light')):
            probs.append('%s: its look does not name px, palette and light (rule 114c): "look": {"px": 1, '
                         '"palette": "<file>", "light": "guide"}' % it['id']); continue
        fam = it.get('family') or KIND_FAMILY.get(it.get('kind'), 'all')
        for sp in it['sprites']:
            p = os.path.join(ROOT, sp)
            if not os.path.exists(p):
                probs.append('%s: sprite %s is not on disk' % (it['id'], sp)); continue
            rep = N.sprite_report(p, it.get('class', 'character'), look.get('light', 'upper-left'), None, T)
            v = held_verdict(rep, fam, bands, it.get('class'), p, N.guide(), T)
            bad = [d for d in ('D1', 'D2', 'D3', 'D4', 'D5') if v[d][0] is False]
            if bad:
                probs.append('%s: %s fails %s (%s)' % (it['id'], sp, ','.join(bad), '; '.join(v[d][1] for d in bad)))
    ok('N3 the cull: %d new art items with a picture, every one names its sprites and look and passes '
       'the first five' % held, not probs, '\n         '.join(probs[:12]))


def n4():
    base = json.load(open(BASELINE))['ui']
    now = N.d10([os.path.join(ROOT, f) for f in UI_FILES])
    grew = []
    for f in UI_FILES:
        for k, v in now.get(f, {}).items():
            if v > base.get(f, {}).get(k, 0):
                grew.append('%s %s %d (frozen %d)' % (f, k, v, base.get(f, {}).get(k, 0)))
    total = sum(sum(c.values()) for c in now.values())
    ok('N4 no new UI default in the demo or the alpha (%d today, frozen %d)' % (
        total, sum(sum(c.values()) for c in base.values())), not grew, '; '.join(grew))


def n5(T, bands):
    """THE MAQUETTES PASS (the guide's tie-breaker 1: his YES wins over every number; a number that would
    have failed the robot or the truck is the wrong number). Every facing of both, through the held five."""
    g = N.guide()
    if g is None:
        print('  --   N5 no style guide on disk: the maquette leg waits for it')
        return
    for subj, cls in (('robot', 'person'), ('truck', 'vehicle')):
        bad = []
        for f in FACINGS:
            p = os.path.join(RIG, subj, 'rig_%s.png' % f)
            if not os.path.exists(p):
                bad.append('%s missing' % f); continue
            rep = N.sprite_report(p, 'character', 'upper-left', None, T)
            v = held_verdict(rep, 'prop', bands, cls, p, g)
            bad += ['%s %s (%s)' % (f, d, v[d][1]) for d in ('D1', 'D2', 'D3', 'D4', 'D5') if v[d][0] is False]
        ok('N5 the maquette %s passes the held first five in all eight facings (his YES is the ruler)' % subj,
           not bad, '; '.join(bad[:6]))
    # and the guide's checks bite, both ways, on the plants
    made = N.load(P.made()); smooth = N.load(P.smooth()); below = N.load(P.lit_from_below())
    ok('N5 G2 fails a four-colour clean surface and passes a many-colour one',
       N.g2(*made, g, 'person')['ok'] is False and N.g2(*smooth, g, 'person')['ok'] is True)
    ok('N5 the guide\'s light row fails a sprite lit from below and passes one lit from above',
       N.g3(*below, g)['ok'] is False and N.g3(*made, g)['ok'] is True)


def n6(T, bands):
    """THE GROUND RULER (10/18, COOK TWO's ask): a tile is judged a pack tile at a time against the ground
    packs, both ways on four of his own tiles."""
    if not bands:
        return
    d = tempfile.mkdtemp()
    for name, kw, want in (('four of his ground tiles', {}, True), ('three of his and one noise cell', {'bad_cell': True}, False),
                           ('four noise cells', {'noise': True}, False)):
        p = os.path.join(d, name.replace(' ', '_') + '.png'); P.ground_sheet(**kw).save(p)
        rep = N.sprite_report(p, 'tile', 'upper-left', None, T)
        v = held_verdict(rep, 'ground', bands, 'tile', p, N.guide(), T)
        bad = [x for x in ('D1', 'D2', 'D3', 'D4', 'D5') if v[x][0] is False]
        ok('N6 the ground ruler %s a sheet of %s (a 96 px cell at a time; D3 not held on a slab)' % (
            'passes' if want else 'fails', name), (not bad) == want, 'failed %s: %s' % (bad, '; '.join(v[x][1] for x in bad)))


def rig_report(T, bands):
    """printed, never held: the master rig through the ten checks, the research numbers and the packs'."""
    if not os.path.isdir(RIG):
        return
    print('\n  THE MASTER RIG THROUGH THE TEN (reported, not held; S facing; research | packs):')
    alphas, names = [], []
    for subj in sorted(os.listdir(RIG)):
        p = os.path.join(RIG, subj, 'rig_S.png')
        if not os.path.exists(p):
            continue
        cls = RIG_CLASS.get(subj, 'character')
        rep = N.sprite_report(p, CLASS_ALIAS.get(cls, cls) if cls not in ('person',) else 'character', 'upper-left', None, T)
        fam = 'prop' if cls == 'vehicle' else 'all'
        bv = N.band_verdict(rep, fam, bands) if bands else {}
        if not subj.startswith('round2_'):   # one subject, two rounds: one silhouette on purpose
            alphas.append(N.load(p)[1]); names.append(subj)
        mark = lambda v: {True: 'ok', False: 'F', None: '-'}[v]
        hv = held_verdict(rep, fam, bands, cls, p, N.guide())
        print('    %-12s %s' % (subj, ' '.join('%s %s|%s' % (d, mark(rep[d]['ok']), mark(bv.get(d, {}).get('ok')))
                                              for d in ('D1', 'D2', 'D3', 'D4', 'D5', 'D7', 'D8'))) +
              '   colours %d   HELD (first five): %s' % (rep['D2']['value']['colours'],
              ' '.join('%s %s' % (d, mark(hv[d][0])) for d in ('D1', 'D2', 'D3', 'D4', 'D5'))))
    print('  ROUND TWO, THE RENDERED-SPRITE SET (reported, not held):')
    for subj in sorted(os.listdir(RIG)):
        fs = [os.path.join(RIG, subj, 'rig_%s.png' % f) for f in FACINGS]
        if not all(os.path.exists(f) for f in fs):
            continue
        r8 = N.r8_facings(fs, T); r2 = N.r2_alpha(*N.load(fs[4]), T)
        print('    %-11s R2 %s  R8 %s  %s' % (subj, {True: 'ok', False: 'F'}[r2['ok']], {True: 'ok', False: 'F'}[r8['ok']],
                                            '; '.join(x for x in (r2['why'], r8['why']) if x)))
    if len(alphas) > 1:
        s = N.d6_set(alphas, names, T)
        print('    D6 across the subjects: worst 8x8 IoU %.2f %s' % (s['value']['worst_iou'], s['value']['worst_pair']))


def main():
    T = N.thresholds()
    print('THE NOT VIBE CODED GATE (rule 114b): the ten checks, held')
    n1(T)
    bands = n2()
    n3(T, bands)
    n4()
    n5(T, bands)
    n6(T, bands)
    rig_report(T, bands)
    print('\nTHE NOT VIBE CODED GATE: %d passed, %d failed' % (passed, failed))
    return 1 if failed else 0


if __name__ == '__main__':
    sys.exit(main())
