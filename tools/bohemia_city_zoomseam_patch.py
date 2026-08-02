#!/usr/bin/env python3
"""
ZOOM OUT INTO THE CITY BUILDER (8/2/26).

Paolo: "i should be able to ZOOM OUT UNTIL I GET INTO THE CITY BUILDER MODE BRO."

WHAT IT WAS. Two modes with no seam between them. The walked world snapped HC to
HLEVELS [11,22,44,88] and setHZoom() CLAMPED the request to that range on its very
first line:
    _zacc=Math.max(HLEVELS[0],Math.min(HLEVELS[HLEVELS.length-1],z));
so pinching out at the widest stop threw the intent away before anything could
read it. The only way across was the round mode button. He does not want a button,
he wants the zoom to keep going.

WHAT IT IS NOW. The clamp still happens -- the ZOOM LEVEL LAW is untouched, HC
still snaps to the same four pixel-true stops and no fractional art scaling is
introduced anywhere. But the request is INSPECTED BEFORE it is clamped:

  ZOOM OUT  already at the widest walked stop and still pinching out
            -> swapMode() into the city-builder overview
  ZOOM IN   already at the city overview's own zmax and still pinching in
            -> swapMode() back down into the walked world

It reuses swapMode(), which already owns the transition (the scale-punch and
crossfade, the DROP IN camera landing, the spiral to the nearest walkable cell).
This adds a way to REACH it, not a second way to do it -- so the two surfaces can
never drift apart, and the mode button keeps working exactly as it does today.

REUSE CHECK: cooks no graphic pixels and opens no bank. Pure input plumbing over
functions the renderer already has.

Idempotent: re-running finds the marker and reports NOOP.
"""
import base64
import re
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARKER = '__ZOOM_SEAM__'

OUT_OLD = """function setHZoom(z){
  _zacc=Math.max(HLEVELS[0],Math.min(HLEVELS[HLEVELS.length-1],z));"""
OUT_NEW = """function setHZoom(z){
  /* """ + MARKER + """ (Paolo 8/2: "i should be able to ZOOM OUT UNTIL I GET INTO
     THE CITY BUILDER MODE BRO"). The clamp on the next line used to eat the
     intent: pinching out at the widest stop was silently pinned to that stop, so
     the only way across the seam was the round mode button. Read the request
     BEFORE clamping it -- already at the widest walked stop and still going out
     means he is asking to leave the walked world. swapMode() already owns the
     transition, the drop-in camera and the walkable-cell spiral; this only adds a
     way to REACH it, so the two surfaces can never drift apart. The ZOOM LEVEL LAW
     is untouched: HC still snaps to the same four pixel-true stops below. */
  if(MODE==='human'&&!transing&&z<HLEVELS[0]&&HZOOM===HLEVELS[0]&&typeof swapMode==='function'){
    swapMode(); return;
  }
  _zacc=Math.max(HLEVELS[0],Math.min(HLEVELS[HLEVELS.length-1],z));"""

IN_OLD = """function setZoomAt(z,pvx,pvy){
  if(MODE!=='city'||transing)return;
  const [zmin,zmax]=zoomBounds(); z=Math.max(zmin,Math.min(zmax,z));"""
IN_NEW = """function setZoomAt(z,pvx,pvy){
  if(MODE!=='city'||transing)return;
  const [zmin,zmax]=zoomBounds();
  /* """ + MARKER + """ -- the seam runs BOTH ways. Already at the overview's own
     closest zoom and still pinching in means he is asking to walk. Same swapMode(),
     same transition, so the round button and the pinch always agree. */
  if(z>zmax&&Math.abs(CZOOM-zmax)<1e-4&&typeof swapMode==='function'){ swapMode(); return; }
  z=Math.max(zmin,Math.min(zmax,z));"""


def main():
    alpha = open(ALPHA, encoding='utf8', errors='ignore').read()
    m = re.search(r"CITY_B64\s*=\s*['\"`]([A-Za-z0-9+/=]{5000,})", alpha)
    if not m:
        print('FAIL: CITY_B64 not found'); return 1
    city = base64.b64decode(m.group(1)).decode('utf8', errors='ignore')
    if MARKER in city:
        print('NOOP: the zoom already crosses into the city builder'); return 0

    for name, old in (('setHZoom', OUT_OLD), ('setZoomAt', IN_OLD)):
        n = city.count(old)
        if n != 1:
            print('FAIL: %s anchor found %d times, expected 1' % (name, n)); return 1
    if 'function swapMode(' not in city:
        print('FAIL: swapMode (the transition this reuses) is missing'); return 1

    city = city.replace(OUT_OLD, OUT_NEW, 1).replace(IN_OLD, IN_NEW, 1)
    if city.count(MARKER) != 2:
        print('FAIL: expected both directions patched'); return 1

    out = base64.b64encode(city.encode('utf8')).decode('ascii')
    open(ALPHA, 'w', encoding='utf8').write(alpha[:m.start(1)] + out + alpha[m.end(1):])
    print('wrote %s' % ALPHA)
    print('  zoom OUT past the widest walked stop -> the city builder')
    print('  zoom IN past the overview closest    -> back on your feet')
    return 0


if __name__ == '__main__':
    sys.exit(main())
