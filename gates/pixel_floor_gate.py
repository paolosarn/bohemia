#!/usr/bin/env python3
"""THE PIXEL FLOOR (PLUMBER 10/19/26, VAMILY row [the pixel floor]; rule 105, Paolo 10/10: 'look at the graphics and
art that we downloaded and see how many pixels they are. That is the floor, the minimum; nothing we make should be
tinier than the assets we downloaded').

Every picture the site publishes (slices/, engine/, records/target/, and the pictures inlined in their pages) has a
kind (gates/pixel_floor_kinds.json); a judged kind's PAINTED size (the box of its half-opaque pixels, never the canvas,
never the camera's zoom) is held to the floor re-measured from his packs (records/target/BOHEMIA_PIXEL_FLOOR.json).
The tool is tools/bohemia_pixel_floor.py; the record records/BOHEMIA_THE_PIXEL_FLOOR_10_19_26.md.

  F1  THE FLOOR IS HIS PACKS: the floor file is what a fresh measurement of reference/art_bank gives today.
  F2  EVERY PICTURE HAS A KIND: none falls through the rules (a new folder gets a line, with its why).
  F3  NOTHING NEW UNDER THE FLOOR: a judged picture under its kind's floor that is not on the baseline is red, with
      the kind, the floor and the size.
  F4  NOTHING CHANGED UNDER THE FLOOR: a placeholder on the baseline whose bytes changed and is still under is red
      (re-drawn and still tiny is a new tiny thing).
  F5  THE LIST IS THE BASELINE: records/BOHEMIA_PLACEHOLDERS.md's UNDER THE PIXEL FLOOR section is exactly the
      baseline, every entry routed to a lane; a placeholder that reached its floor or left the site is printed so
      --write drops it (a fix never turns this red).
  S1-S7  SELF-TEST FIRST on a planted tree: a 20 px prop is caught and a 60 px one passes; a folder with no rule is
      caught; a rig person whose stills are 60 tall is caught and one 100 tall passes; a car narrow head-on but long
      from the side passes (the broadest facing); a re-drawn placeholder still under is caught; an inlined picture in
      a live page with no rule is caught; the sheet's frame is read from its JSON.

    python3 gates/pixel_floor_gate.py
"""
import base64
import io
import json
import os
import shutil
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
sys.path.insert(0, os.path.join(ROOT, 'tools'))
import bohemia_pixel_floor as P  # noqa: E402

passed = 0
fails = []


def ok(name, cond, why=''):
    global passed
    if cond:
        passed += 1
        print('  ok    ' + name)
    else:
        fails.append(name)
        print('  FAIL  ' + name + ('\n        ' + why if why else ''))


def plant(root, rel, size, box=None):
    """a picture of `size` whose opaque box is `box` (w, h), pasted from nothing but a fill of the canvas' own
    corner: the gate measures boxes, not colours."""
    from PIL import Image
    p = os.path.join(root, rel)
    os.makedirs(os.path.dirname(p), exist_ok=True)
    im = Image.new('RGBA', size, (0, 0, 0, 0))
    if box:
        im.paste(Image.new('RGBA', box, (90, 80, 70, 255)), (0, 0))
    im.save(p)
    return rel


def selftest(floors, kinds):
    tmp = tempfile.mkdtemp(prefix='pixel_floor_selftest_')
    try:
        files = [
            plant(tmp, 'slices/fight_ground/kit_cover/cover_tiny.webp'.replace('.webp', '.png'), (40, 40), (20, 18)),
            plant(tmp, 'slices/fight_ground/kit_cover/cover_fine.png', (80, 80), (60, 40)),
            plant(tmp, 'slices/brand_new_folder/thing.png', (100, 100), (100, 100)),
            plant(tmp, 'records/target/character/rig/short/rig_S.png', (80, 130), (40, 60)),
            plant(tmp, 'records/target/character/rig/tall/rig_S.png', (80, 130), (40, 100)),
            plant(tmp, 'records/target/master_rig/cook_wreck2/rig_S.png', (130, 130), (60, 50)),
            plant(tmp, 'records/target/master_rig/cook_wreck2/rig_E.png', (130, 130), (120, 50)),
            plant(tmp, 'slices/fight_people/people.png', (448, 112), (448, 112)),
        ]
        for d in ('records/target/character/rig/short', 'records/target/character/rig/tall', 'records/target/master_rig/cook_wreck2'):
            open(os.path.join(tmp, d, 'rig.json'), 'w').write('{}')
            files.append(d + '/rig.json')
        json.dump({'frame': 112}, open(os.path.join(tmp, 'slices/fight_people/people.json'), 'w'))
        files.append('slices/fight_people/people.json')
        buf = io.BytesIO()
        from PIL import Image
        Image.new('RGBA', (10, 10), (1, 2, 3, 255)).save(buf, 'PNG')
        os.makedirs(os.path.join(tmp, 'slices'), exist_ok=True)
        open(os.path.join(tmp, 'slices/BOHEMIA_CITY_WORLD.html'), 'w').write(
            '<script>var a="data:image/png;base64,%s";</script>' % base64.b64encode(buf.getvalue()).decode())
        files.append('slices/BOHEMIA_CITY_WORLD.html')
        rows = {r['path']: r for r in P.sweep(root=tmp, kinds=kinds, floors=floors, files=sorted(files))}
        g = lambda p: rows.get(p, {})
        ok('S1 a 20 px prop is caught under the thing floor (%s), a 60 px one passes' % floors['thing']['px'],
           g('slices/fight_ground/kit_cover/cover_tiny.png').get('ok') is False and g('slices/fight_ground/kit_cover/cover_fine.png').get('ok') is True)
        ok('S2 a folder with no rule has no kind', g('slices/brand_new_folder/thing.png').get('kind') is None)
        ok('S3 a rig person 60 tall is caught, 100 tall passes (floor %d)' % floors['person']['px'],
           g('records/target/character/rig/short/rig_S.png').get('ok') is False and g('records/target/character/rig/tall/rig_S.png').get('ok') is True)
        ok('S4 a wreck narrow head-on (60) but long from the side (120) passes by its broadest facing',
           g('records/target/master_rig/cook_wreck2/rig_S.png').get('ok') is True)
        ok('S5 the sheet\'s cell is read from its JSON (frame 112)', g('slices/fight_people/people.png').get('value') == 112
           and g('slices/fight_people/people.png').get('ok') is True)
        ok('S6 an inlined picture in a live page with no rule has no kind',
           g('slices/BOHEMIA_CITY_WORLD.html#inline0').get('kind') is None)
        tiny = g('slices/fight_ground/kit_cover/cover_tiny.png')
        base = {tiny['path']: dict(kind='thing', value=20, floor=56, sha='0' * 40, lane='COOK TWO')}
        changed = [r for r in rows.values() if r.get('ok') is False and r['path'] in base and r['sha'] != base[r['path']]['sha']]
        ok('S7 a placeholder re-drawn and still under is caught (its bytes changed)', len(changed) == 1)
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


def main():
    kinds = P.load_kinds()
    have = json.load(open(P.FLOOR))
    floors = have['floors']
    print('THE PIXEL FLOOR -- nothing we make is tinier than what he bought (rule 105)\n')
    selftest(floors, kinds)

    fresh = P.measure_bank()['floors']
    drift = ['%s %s -> %s' % (k, floors.get(k, {}).get('px'), v['px']) for k, v in fresh.items() if floors.get(k, {}).get('px') != v['px']]
    ok('F1 the floor file is his packs measured today (tile %d, building %d, lamp %d, thing %d, vehicle %d, portrait %d)'
       % tuple(floors[k]['px'] for k in ('tile', 'building', 'lamp', 'thing', 'vehicle', 'portrait')), not drift,
       'the bank changed: ' + '; '.join(drift) + '\n        python3 tools/bohemia_pixel_floor.py --measure')

    rows = P.sweep(kinds=kinds, floors=floors)
    nokind = [r['path'] for r in rows if r['kind'] is None]
    ok('F2 every published picture has a kind (%d pictures)' % len(rows), not nokind,
       '%d with no rule:\n          ' % len(nokind) + '\n          '.join(nokind[:20]) +
       '\n        add a line to gates/pixel_floor_kinds.json: its kind (a judged kind gets a floor) and why')

    base = json.load(open(P.BASELINE))['under']
    under = [r for r in rows if r.get('judged') and r.get('ok') is False]
    new = [r for r in under if r['path'] not in base]
    ok('F3 nothing new under the floor (%d judged, %d placeholders on the baseline)' % (sum(1 for r in rows if r.get('judged')), len(base)),
       not new, '\n          '.join('%s: a %s painted %d, the floor %d (%s)' % (r['path'], r['kind'], r['value'], r['floor'], r['measure'])
                                    for r in new[:20]) + '\n        draw it at its kind\'s floor or more (the packs are the floor)')
    changed = [r for r in under if r['path'] in base and r['sha'] != base[r['path']]['sha']]
    ok('F4 no placeholder was re-drawn and left under the floor', not changed,
       '\n          '.join('%s: changed, still %d against %d' % (r['path'], r['value'], r['floor']) for r in changed))

    text = open(P.PLACEHOLDERS).read()
    sec = text[text.index(P.START):text.index(P.END) + len(P.END)] if P.START in text and P.END in text else ''
    want = P.placeholders_section([dict(path=p, **v) for p, v in base.items()])
    ok('F5 records/BOHEMIA_PLACEHOLDERS.md lists exactly the baseline under UNDER THE PIXEL FLOOR', sec == want,
       'python3 tools/bohemia_pixel_floor.py --write')
    lanes = sorted({v['lane'] for v in base.values()})
    ok('F5 every placeholder is routed to a lane (%s)' % ', '.join(lanes), 'NO OWNER LINE' not in lanes and '?' not in lanes)
    still = {r['path'] for r in under}
    gone = [p for p in base if p not in still]
    if gone:
        print('\n  REACHED THE FLOOR OR LEFT THE SITE (%d): python3 tools/bohemia_pixel_floor.py --write drops them' % len(gone))
        for p in gone[:20]:
            print('    ' + p)

    print('\nTHE PIXEL FLOOR: %d passed, %d failed' % (passed, len(fails)))
    return 1 if fails else 0


if __name__ == '__main__':
    sys.exit(main())
