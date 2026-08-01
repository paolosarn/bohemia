#!/usr/bin/env python3
"""
CITY FOOTSTEP PATCH (7/31/26) -- his approved footsteps finally play.

Paolo 7/31: "I don't hear sound at all. What's wrong with you even when I take
steps I don't hear no sound for the steps that I'm making."

APPROVED-BUT-UNUSED, FOR THE THIRD TIME IN TWO DAYS, and this one he could hear.
He judged footsteps on 7/30. banks/BOHEMIA_SFX_APPROVED_7_30_26.json holds
step_dirt, step_asphalt and step_gravel with all five candidates approved for
each. The engine that renders them (BOH_SFX) is inlined in the alpha. And the
surface he actually walks -- the CITY frame -- never asked for one. Measured:
'step_asphalt' appears ZERO times in the city renderer.

ONE AUDIOCONTEXT, THE PARENT'S. The city is an iframe. It must never build a
second audio graph -- the same law the run's music obeys, and the reason music
already routes through the shell. So the frame POSTS the footfall and the alpha
renders it on MUS's context through MUS's limiter. This patch adds no audio code
to the city at all; it adds one postMessage.

SURFACE COMES FROM THE WORLD, NOT A GUESS. cellAt(x,y) already carries the
dossier for the tile being stepped on, so the sound is chosen by what the tile
actually IS -- asphalt on the road, gravel on gravel, dirt everywhere else --
rather than by position or by a coin flip. If the world ever gains a new surface,
the mapping is one line in surfaceOf() and it is here, not scattered.

ONE SOUND PER FOOTFALL. The bike moves 4 cells per beat (the vehicle ladder), so
the post fires on the COMMITTED cell change, and the alpha side additionally
refuses to retrigger inside 0.12s. Without that a ride is a machine-gun.

REUSE CHECK: cooks no graphic pixels and no audio. It plays sounds Paolo already
judged, from banks/BOHEMIA_SFX_APPROVED_7_30_26.json, through the engine already
in the build. Nothing is synthesised here.

Idempotent: re-running finds the marker and reports NOOP. Refuses to write if the
expected source text is missing.
"""
import base64
import re
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARKER = '__STEP_SFX__'

OLD = "      hx=nx; hy=ny; moved++; advance(0.084);        // time per CELL, distance-honest"

NEW = ("      /* " + MARKER + " -- FOOTSTEPS (Paolo 7/31: \"I don't hear no sound for the\n"
       "         steps that I'm making\"). He judged these on 7/30 and nothing ever played\n"
       "         one, because this frame never asked. The surface comes from the tile's own\n"
       "         dossier, so the road sounds like asphalt and the yard sounds like dirt.\n"
       "         ONE AUDIOCONTEXT, THE PARENT'S: this posts, the shell renders. */\n"
       "      try{ if(window.parent&&window.parent!==window)\n"
       "        window.parent.postMessage({type:'BOHEMIA_STEP',surface:__surfaceOf(c)},'*'); }catch(_e){}\n"
       + OLD)

SURFACE_FN = """
/* WHAT AM I STANDING ON? Read off the tile's OWN dossier name, so a new surface
   is one line here rather than a guess at the call site. Falls back to dirt,
   which is the dead-world default everywhere that is not paved. */
function __surfaceOf(c){
  var n = (c && (c.name || c.tile || '') + '').toLowerCase();
  if(/asphalt|road|street|lane|driveway|apron|concrete|sidewalk|walk|pavement|parking|slab/.test(n)) {
    return /gravel/.test(n) ? 'gravel' : 'asphalt';
  }
  if(/gravel|ballast|rock|caliche|hardpan|lag/.test(n)) return 'gravel';
  return 'dirt';
}
"""


def main():
    alpha = open(ALPHA, encoding='utf8', errors='ignore').read()
    m = re.search(r"CITY_B64\s*=\s*['\"`]([A-Za-z0-9+/=]{5000,})", alpha)
    if not m:
        print('FAIL: CITY_B64 not found'); return 1
    b64 = m.group(1)
    city = base64.b64decode(b64).decode('utf8', errors='ignore')

    if MARKER in city:
        print('NOOP: the city already posts footsteps')
        return 0
    if OLD not in city:
        print('FAIL: the human step line is not where this tool expects it.\n'
              '      Another lane may have rewritten movement; refusing to half-patch.')
        return 1

    city = city.replace(OLD, NEW, 1)

    # the helper goes just before the function that contains the step
    anchor = 'function animate(kind){'
    if anchor not in city:
        print('FAIL: could not find a place to put the surface helper'); return 1
    city = city.replace(anchor, SURFACE_FN + anchor, 1)

    if city.count('__surfaceOf') != 2:
        print('FAIL: expected exactly one definition and one call of __surfaceOf')
        return 1

    out = base64.b64encode(city.encode('utf8')).decode('ascii')
    alpha = alpha[:m.start(1)] + out + alpha[m.end(1):]
    open(ALPHA, 'w', encoding='utf8').write(alpha)
    print('wrote %s (city blob %d -> %d bytes)' % (ALPHA, len(b64), len(out)))
    print('  the city now posts a footfall with the surface it happened on')
    return 0


if __name__ == '__main__':
    sys.exit(main())
