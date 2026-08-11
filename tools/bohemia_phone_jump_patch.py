#!/usr/bin/env python3
"""
THE PHONE'S MAP IS A DOOR, NOT A PICTURE (8/12/26).

Paolo: "in the run how do we combine the city builder map with the map in the
phone."

THE ANSWER IS NOT TO MERGE THE TWO RENDERERS, and it took a minute to see that.
The obvious reading of "combine" is "make them one drawing". That would be wrong,
and it would break something he already locked: a phone's map SHOULD look like a
phone's map. It is a device in the world, held in a hand, with a screen. Making it
render the isometric city builder would make the phone stop being a phone.

They are combined by being THE SAME WORLD AND THE SAME CAMERA. Tap a cell on the
phone's map and the run's camera goes there. The phone stops being a picture OF the
valley and becomes a way INTO it. That is the only kind of "one map" that means
anything, and it is what the ONE MAP law (7/27) was already reaching for when it
made both surfaces read the same renderer:

    "THE ONE MAP, my order at the top of your queue: the phone's map app becomes
     the real city-builder valley map with quest locations pinned on top."

They already share the DATA. This makes them share the CAMERA.

WHAT IT DOES: the map app's cell readout -- which already tells you what is really
there, straight off the world model -- gains GO. Tapping it posts the cell to the
run, which moves the city marker there and drops the camera on it. Closing the
phone leaves you looking at the place you tapped.

WHY IT IS SAFE: it moves the CITY MARKER (city.x/city.y), which is the same thing
tapping a plot in the city builder does. It does not teleport your body. Your feet
stay where they are, and dropping in from there is the same drop-in as always --
which matters, because moving the player away from where the world put him is
exactly how I turned CITY TALK red on 8/11.

REUSE CHECK: cooks no graphic pixels of any kind. It adds one button to a readout
the map app already draws, in the app's own type. No bank is opened because
nothing is drawn.

Edits the SOURCE (slices/BOHEMIA_SOCIAL_PHONE_DEMO_7_20_26.html); the built slice
is regenerated with `node tools/build_current_slice.js`.

Idempotent: re-running finds the marker and reports NOOP.
"""
import os
import sys

SRC = 'slices/BOHEMIA_SOCIAL_PHONE_DEMO_7_20_26.html'
MARK = '__PHONE_JUMP__'

OLD = """    var box=document.getElementById('mapcell'); if(!box) return;
    box.innerHTML = d ? ('<b>X'+d.x+' Y'+d.y+'</b> · '+esc(String(d.district).toUpperCase())+
      (d.category?(' · '+esc(d.category)):'')+(d.surface?' · surface':'')+(d.built?'':' · reserved'))
      : 'off the map';"""

NEW = """    var box=document.getElementById('mapcell'); if(!box) return;
    /* """ + MARK + """ -- THE MAP IS A DOOR. Paolo 8/12: "how do we combine the city
       builder map with the map in the phone". Not by merging two renderers -- a
       phone's map should look like a phone's map -- but by sharing the CAMERA. The
       ONE MAP law (7/27) already made both surfaces read the same world; this makes
       the phone a way INTO it instead of a picture of it. GO moves the city marker,
       exactly as tapping a plot in the builder does. It never moves your body. */
    box.innerHTML = d ? ('<b>X'+d.x+' Y'+d.y+'</b> · '+esc(String(d.district).toUpperCase())+
      (d.category?(' · '+esc(d.category)):'')+(d.surface?' · surface':'')+(d.built?'':' · reserved')+
      (LIVE?('<span class="mapgo" onclick="phoneGo('+d.x+','+d.y+')">GO \\u2192</span>'):''))
      : 'off the map';"""

GO = """
/* """ + MARK + """ -- hand the cell to the run. The phone only ASKS; the world
   decides what to do with it, which is why this posts a message rather than
   reaching into another document. */
function phoneGo(x,y){
  try{ if(window.parent&&window.parent!==window)
    window.parent.postMessage({bohemiaPhoneGo:{x:x,y:y}},'*'); }catch(e){}
  var box=document.getElementById('mapcell');
  if(box) box.innerHTML='<b>X'+x+' Y'+y+'</b> · the run is looking at it \\u00b7 close the phone';
}
"""

CSS_ADD = """/* """ + MARK + """ -- GO sits in the cell readout, in the app's own type. */
.mapgo{display:inline-block;margin-left:8px;padding:2px 7px;border-radius:5px;
  background:#2a2418;border:1px solid #b89a6a;color:#e8b84a;font-weight:700;
  font-size:10px;letter-spacing:1px}
</style>"""


def main():
    if not os.path.exists(SRC):
        sys.exit('FAIL: ' + SRC + ' not found')
    s = open(SRC, encoding='utf-8').read()
    if MARK in s:
        print('NOOP: ' + MARK + ' already present')
        return
    if OLD not in s:
        sys.exit('FAIL: the map cell readout was not found')
    s = s.replace(OLD, NEW, 1)

    i = s.find('</style>')
    if i < 0:
        sys.exit('FAIL: no </style> to extend')
    s = s[:i] + CSS_ADD + s[i + len('</style>'):]

    tail = s.rfind('</script>')
    if tail < 0:
        sys.exit('FAIL: no closing script tag')
    s = s[:tail] + GO + '\n' + s[tail:]

    open(SRC, 'w', encoding='utf-8').write(s)
    print('PATCHED ' + SRC + ' (' + str(len(s)) + ' bytes)')
    print('NEXT: node tools/build_current_slice.js')


if __name__ == '__main__':
    main()
