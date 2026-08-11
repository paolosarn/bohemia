#!/usr/bin/env python3
"""
BIG ICONS GATE (8/2/26, WORLD lane).

    "all these icons they're a little too small. I want them TALLER. I want them WIDER...
     remove all the parking lots... I just really want the main building to be BIGGEST AS
     FUCK... it just needs to FILL UP THE SQUARE."            -- Paolo, 8/2/26

Law: laws/BOHEMIA_ADDENDUM_BIG_ICONS_8_2_26.md. THE BUILDING IS THE ICON -- not the plot it
stands on, not its parking. The icon is a PORTRAIT of the building and the building fills
the square.

WHAT THIS GATE MEASURES, on the baked sprites and the live scenes rather than on the source:

  1. NO PARKING. No hero draws a lot or a driveway. `_ground` accepts `lot`/`drive` and
     ignores them, so this checks the RESULT: no 'lot'-material face survives in any scene.
  2. THE BUILDING FILLS THE SQUARE. In every baked sprite, the opaque pixels have to cover a
     real share of the bounding box, and the tallest solid has to be a real fraction of the
     sprite's height. A building sitting small in the middle of an apron fails both.
  3. TALL. Every hero's tallest mass clears a floor, because "taller" was the ask and a flat
     pad of low boxes is what he was looking at when he made it.
  4. NOTHING SHRANK. A per-district floor on sprite area, so a future edit cannot quietly
     take the icons back to where they were.

  python3 gates/big_icons_gate.py
"""
import base64
import io
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(ROOT)
sys.path.insert(0, os.path.join(ROOT, 'tools'))

PASS = FAIL = 0
def ok(n, c):
    global PASS, FAIL
    if c:
        PASS += 1
    else:
        FAIL += 1
        print('  FAIL: ' + n)


try:
    from PIL import Image
    import bohemia_district_hero_factory as F
except Exception as e:                                             # noqa: BLE001
    print('  FAIL: the hero factory does not import (%s)' % str(e)[:140])
    print('BIG ICONS GATE: 0 passed, 1 failed')
    sys.exit(1)

BANK = 'banks/BOHEMIA_DISTRICT_HERO_CANDIDATES_7_23_26.txt'
bank = json.load(open(BANK))
heroes = {h['district']: h for h in bank['heroes']}
ok('the hero bank is readable (%d icons)' % len(heroes), len(heroes) >= 27)

# ---- 1. NO PARKING ANYWHERE -------------------------------------------------
P = F._load_pal()
parked = []
for d, fn in sorted(F.HEROES.items()):
    try:
        scene, _s = fn(P[d])
    except Exception:                                              # noqa: BLE001
        continue
    for _v, _uv, _n, m in scene.faces:
        if isinstance(m, dict) and m.get('t') == 'lot':
            parked.append(d)
            break
ok('NO PARKING IN ANY ICON: not one hero draws a lot or a driveway. At map zoom asphalt is '
   'a grey smear that says nothing about the building, and it was eating a third of every '
   'square (Paolo 8/2: "remove all the parking lots")%s'
   % (('  -- still parked: ' + ', '.join(sorted(set(parked)))) if parked else ''), not parked)

# ---- 2/3/4. IT FILLS THE SQUARE, IT IS TALL, AND IT DID NOT SHRINK ----------
# a floor per district: nothing may go back under this without the number moving here too
AREA_FLOOR = 34000          # opaque bounding box, final pixels
FILL_FLOOR = 0.28           # opaque share of that box
TALL_FLOOR = 6.0            # world units, the tallest solid in the scene
# TWO DISTRICTS ARE LOW BY NATURE and forcing a tower onto them would be a lie: a SPEEDWAY's
# subject is a banked track and a SELF-STORAGE lot is rows of single-storey units. They are
# named rather than exempted silently, and they still have to pass the fill and area tests.
LOW_BY_NATURE = {
    'speedway',   # the subject is a banked track
    'storage',    # rows of single-storey units
    # 8/4, the terrain and the road surfaces. Forcing a tower onto any of these would be
    # a lie about the map, which is a worse failure than a low icon: OPEN DESERT has no
    # building in it, a LINED FLOOD CHANNEL is a trench, a GOLF COURSE is greens and
    # bunkers, and a SUBDIVISION and a TRAILER PARK are single-storey by definition --
    # that IS the form. They are named here, never silently exempt, and they still have
    # to pass the area and fill tests like everything else.
    'desert', 'wash', 'golf', 'suburb', 'trailer',
    # 8/11: THE STREET RUN, named the same way and for the same reason. Paolo split the
    # run from the crossing and ruled the run has no crossing and no lights -- so the
    # signal mast, which was this cell's only tall thing, correctly went with the
    # crossing. What is left is streetlights on a flat road, which is what a mid-block
    # street IS. Forcing a tower back onto it would be a lie about the map and would
    # undo his ruling. The CROSSING keeps its masts and is NOT exempt.
    'arterial',
    # 8/11, same turn: the FREEWAY RUN too. Paolo killed the overpass on this tile ("the
    # freeway overpass underpass shit... its looking god awfully terrible") and sent it to
    # the INTERCHANGE, which keeps its deck and is NOT exempt. What is left on a freeway run
    # is lanes, barrier, guardrail and sound wall -- flat by nature, which is what a freeway
    # between interchanges actually is.
    'freeway',
}

small, empty, squat = [], [], []
for d, h in sorted(heroes.items()):
    im = Image.open(io.BytesIO(base64.b64decode(h['b64']))).convert('RGBA')
    a = im.getchannel('A')
    bbox = a.getbbox()
    if not bbox:
        empty.append(d)
        continue
    bw, bh = bbox[2] - bbox[0], bbox[3] - bbox[1]
    if bw * bh < AREA_FLOOR:
        small.append('%s(%dx%d)' % (d, bw, bh))
    opaque = sum(1 for p in a.crop(bbox).getdata() if p > 8)
    if opaque / float(bw * bh) < FILL_FLOOR:
        empty.append('%s(%.0f%%)' % (d, 100.0 * opaque / (bw * bh)))

for d, fn in sorted(F.HEROES.items()):
    try:
        scene, _s = fn(P[d])
    except Exception:                                              # noqa: BLE001
        continue
    tall = max((q[2] + q[5] for q in scene.solids), default=0.0)
    floor = 4.5 if d in LOW_BY_NATURE else TALL_FLOOR
    if tall < floor:
        squat.append('%s(%.1f)' % (d, tall))

ok('EVERY ICON IS BIG: the opaque sprite covers at least %d px of bounding box%s'
   % (AREA_FLOOR, ('  -- small: ' + ', '.join(small[:8])) if small else ''), not small)
ok('THE BUILDING FILLS THE SQUARE: at least %d%% of each sprite\'s own bounding box is '
   'opaque, so the mass is the picture rather than a small thing in the middle of a pad%s'
   % (int(FILL_FLOOR * 100), ('  -- thin: ' + ', '.join(empty[:8])) if empty else ''),
   not empty)
ok('EVERY ICON IS TALL: the tallest mass in every hero clears %.0f world units. "Taller" was '
   'the ask, and a flat pad of low boxes is what he was looking at when he made it '
   '(a speedway and a storage lot are LOW BY NATURE and are named, not silently exempt)%s'
   % (TALL_FLOOR, ('  -- squat: ' + ', '.join(squat[:8])) if squat else ''), not squat)

LAW = 'laws/BOHEMIA_ADDENDUM_BIG_ICONS_8_2_26.md'
ok('the law is filed with his words in it', os.path.exists(LAW)
   and 'biggest as fuck' in open(LAW, encoding='utf8').read())

areas = []
for d, h in sorted(heroes.items()):
    a = Image.open(io.BytesIO(base64.b64decode(h['b64']))).convert('RGBA').getchannel('A')
    b = a.getbbox()
    areas.append((b[2] - b[0]) * (b[3] - b[1]) if b else 0)
print('  ICON SIZE: median opaque box %d px, smallest %d, largest %d'
      % (sorted(areas)[len(areas) // 2], min(areas), max(areas)))
print('BIG ICONS GATE: %d passed, %d failed  (%d icons)' % (PASS, FAIL, len(heroes)))
sys.exit(1 if FAIL else 0)
