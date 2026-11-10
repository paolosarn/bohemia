#!/usr/bin/env python3
"""
BOHEMIA ZOOM-BUILD GATE (7/25/26) - the city builder IS a zoom of the one iso view.

Paolo 7/25 (LOCKED, laws/BOHEMIA_ADDENDUM_CITYBUILDER_TOP_DOWN_ONLY_7_25_26.md):
"as you zoom out on your character then at some point it organically becomes the
city builder... on this diamond isometric 45 degree angle view", and "the only
time I'll demolish and build shit is in the city builder [zoom]."

Locks, inside the alpha's CITY_B64 (the ONE iso app):
  1. zoom-build is wired at all (marker), and the build verbs are the CANON
     delta engine inlined BYTE-IDENTICAL (never a second, drifting copy)
  2. THE ONE SEAM: edits resolve through om.at, which every consumer reads (the
     city overview AND tileMeta -> the fine-grain walked streets), so an edit is
     true at EVERY zoom - and the seam is re-installed wherever om is rebuilt
     (reroll / save-restore), so it can never be silently dropped
  3. the tap picker is the EXACT inverse of the iso projection, and a drag or a
     pinch is never mistaken for a tap
  4. the verbs are actually reachable: demolish / build / build-big buttons
  5. an edit invalidates the caches, so the walked streets regenerate
  6. a REROLL (new valley) resets the edits - stale plot edits never leak
  7. building lives ONLY at the city zoom (the panel hides outside city mode)
  8. reproducible: re-running the patch tool changes nothing (idempotent)

  python3 gates/zoombuild_gate.py
"""
import base64
import os
import subprocess
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
EDIT_ENGINE = 'engine/bohemia_cityedit.js'

passed = 0
failed = []


def check(name, ok, detail=''):
    global passed
    if ok:
        passed += 1
    else:
        failed.append(name + (': ' + detail if detail else ''))
    print('  %s %s%s' % ('PASS' if ok else 'FAIL', name, ('  (' + detail + ')') if detail and not ok else ''))


print('=== ZOOM-BUILD GATE ===')

# WHERE the city app lives and WHAT SHAPE it is in are not this gate's business
# (8/4). The payload-wall pass moved it out of the alpha on 8/2 and stopped
# base64-ing it, and this gate went red about a city that was fine.
import sys as _sys
_sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bohemia_city_app as CITY_APP                                 # noqa: E402
_app = CITY_APP.read()
check('the iso city app is findable (%s)'
      % (_app.file if _app else 'none of ' + ', '.join(CITY_APP.searched())), _app is not None)
iso = _app.src if _app else ''

# 1. wired + the verbs are the canon engine, byte-identical
check('zoom-build is wired into the iso view', 'ZOOM-BUILD' in iso)
engine = open(EDIT_ENGINE, encoding='utf8').read()
check('the build verbs are the CANON delta engine, inlined byte-identical (no drifting fork)',
      engine in iso)
check('the delta is a delta over the generator (parse/serialize round-trip present)',
      'CE.parse(' in iso and 'CE.serialize(EDITS)' in iso)

# 2. THE ONE SEAM
check('edits resolve through om.at - the seam every zoom level reads',
      'function CBinstall(' in iso and 'o.at=function(x,y)' in iso and 'o.__cbRawAt=raw' in iso)
check('the seam is installed on the live overmap', 'CBinstall(om);' in iso)
check('the seam survives every om rebuild (reroll + save-restore)',
      iso.count('CBinstall(OM.buildOvermap(seed))') == 2,
      '%d of 2 rebuild sites wrapped' % iso.count('CBinstall(OM.buildOvermap(seed))'))
check('a raw (unwrapped) om rebuild never sneaks back in',
      'om=OM.buildOvermap(seed);POWER=' not in iso)

# 3. tap picking = the exact inverse of iso(), drags/pinches excluded
check('tap picker present', 'function CBcellAt(' in iso and 'function cityTapPlot(' in iso)
check('picker is the EXACT inverse of the iso projection',
      'const dx=sx-ox, dy=sy-oy-TH/2;' in iso
      and 'Math.round(dx/TW+dy/TH)' in iso and 'Math.round(dy/TH-dx/TW)' in iso)
check('a drag is never a tap (movement accumulated, 8px slop)',
      'CB._tapMoved+=' in iso and 'CB._tapMoved<8' in iso)
check('a pinch is never a tap (second finger clears the tap)',
      'lastMid=mid(a); CB._tapStart=null;' in iso)
check('taps only build at the CITY zoom (guarded by MODE)',
      "if(MODE==='city' && CB._tapStart" in iso)

# 4. the verbs are reachable
for vid, verb in [('cbdem', 'DEMOLISH'), ('cbbuild', 'BUILD'), ('cbbig', 'BUILD BIG')]:
    check('%s is reachable in the panel' % verb, "id=\"%s\"" % vid in iso or "'#%s'" % vid in iso)
check('demolish/build/buildBig call the canon verbs (not hand-rolled edits)',
      'CE.demolish(EDITS' in iso and 'CE.build(EDITS' in iso and 'CE.buildBig(EDITS' in iso)
check('the buildable menu is the canon district enum (nothing invented)',
      'CE.buildableTypes(OM.DISTRICT)' in iso)

# 5. an edit regenerates the walked streets
check('an edit clears the tile/chunk caches (the walk level regenerates)',
      'metaCache.clear()' in iso and 'chunkCache.clear()' in iso and 'function CBafterEdit(' in iso)

# 6. a reroll is a new valley
check('a REROLL resets the edits (stale plot edits never leak into a new valley)',
      'EDITS=CE.makeEdits(); CBpersist();' in iso)

# 7. building is a CITY-zoom thing only
check('the build panel hides outside the city zoom',
      "if(MODE!=='city'||!CB.sel){ el.style.display='none'; return; }" in iso)
check('the selected plot is drawn (whole footprint for a big building)',
      'CE.spanAt(EDITS,CB.sel[0],CB.sel[1])' in iso)

# 8. reproducible
p = subprocess.run([sys.executable, 'tools/bohemia_city_zoombuild_patch.py'],
                   capture_output=True, text=True, timeout=300)
check('the patch tool is idempotent (re-running changes nothing)',
      p.returncode == 0 and 'no-op' in (p.stdout or ''), (p.stdout or p.stderr or '')[-90:])
# compare THE FILE THE CITY ACTUALLY LIVES IN, not a file this gate guessed at (8/4)
_target = os.path.join(CITY_APP.ROOT, _app.file) if _app else None
_after = CITY_APP.read()
check('re-running the tool left the city app byte-identical',
      _after is not None and _app is not None and _after.src == _app.src)

print('=== %d passed / %d failed ===' % (passed, len(failed)))
if failed:
    for f in failed:
        print('  FAIL ' + f)
    sys.exit(1)
