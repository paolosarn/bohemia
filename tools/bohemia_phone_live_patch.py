#!/usr/bin/env python3
"""
THE PHONE KNOWS WHERE YOU ARE (8/11/26).

Paolo: "the Phone app that we worked so hard for isn't even implemented yet."

The phone was finished. It was behind the alpha's SLICE tab, which is a developer
tab, so in the game he plays there was no phone. The city half of the fix opens
the REAL slice from a button in the run (tools/bohemia_city_home_phone_patch.py).
This is the phone's half: it has to KNOW SOMETHING when it opens, or it is a
static demo sitting on top of a live world.

The 7/27 backlog entry said exactly this and named both halves:

    0D. "the phone system isn't in here, DOESN'T PROGRESS AS I WALK"

"Isn't in here" is reachability. "Doesn't progress as I walk" is this file.

WHAT IT LEARNS, pushed by the city on open and on every change:
  * the cell he is standing in            -> the map's "you" blip is really him
  * the district he is standing in        -> named on the home screen
  * the day and the clock                 -> the day loop's real clock, not a demo
  * the live objective                    -> today's job, in the quest's own words
  * where HOME is                          -> drawn on the map as a marker

THE MAP NEEDED NO NEW CODE TO SHOW HIM. It already drew "you" from player.tile;
it was drawing a demo actor parked at a start cell. Feeding it the real cell makes
the existing blip correct, which is the cheapest possible version of this and the
one least likely to drift from the map the MAP tab draws. The only thing genuinely
added to the canvas is a HOME marker, in the same glyph-plus-label helper the map
already uses for the DAM and the SOLAR field.

NO SIGNAL IS NOT A BUG. The phone already has an `online` state and says "NO
SIGNAL - last known" when it is off. Nothing here forces it on: if he is somewhere
with no coverage the map keeps showing the last position it was given, which is
the correct behaviour for a phone and is already what the UI promises.

REUSE CHECK: cooks no graphic pixels of any kind. The HOME marker reuses the map's
own `land()` glyph/label helper; the live strip reuses the existing .home-hd type.
No bank is opened because nothing is drawn.

Edits the SOURCE (slices/BOHEMIA_SOCIAL_PHONE_DEMO_7_20_26.html) and then the
built slice is regenerated with `node tools/build_current_slice.js` -- editing the
built artefact directly would be undone by the next build, and current_slice_gate
would catch it.

Idempotent: re-running finds the marker and reports NOOP.
"""
import os
import sys

SRC = 'slices/BOHEMIA_SOCIAL_PHONE_DEMO_7_20_26.html'
MARK = '__PHONE_LIVE__'

# ---- 1. the live strip on the home screen -----------------------------------
OLD_HOME = """  el('home').innerHTML =
    '<div class="home-hd"><b>the phone</b>@founder_gen1 · '+pr.reach+' followers on the Network</div>'+"""
NEW_HOME = """  el('home').innerHTML =
    liveStrip()+
    '<div class="home-hd"><b>the phone</b>@founder_gen1 · '+pr.reach+' followers on the Network</div>'+"""

# ---- 2. the HOME marker on the map ------------------------------------------
OLD_MAP = """  // you. Clamped into the valley: the demo player starts at tile 128,128 on a
  // 96-cell map, which drew the blip permanently off the edge of the canvas."""
NEW_MAP = """  /* """ + MARK + """ -- HOME, if the run has told us where it is. Same glyph+label
     helper the DAM and the SOLAR field already use, so it reads as one map. */
  if(LIVE&&LIVE.home&&LIVE.home.cell) land([LIVE.home.cell.x,LIVE.home.cell.y],'\\u2302','#e8b84a','HOME',12);
  // you. Clamped into the valley: the demo player starts at tile 128,128 on a
  // 96-cell map, which drew the blip permanently off the edge of the canvas."""

# ---- 3. the receiver --------------------------------------------------------
RECEIVER = """
/* """ + MARK + """ -- THE PHONE KNOWS WHERE YOU ARE (8/11/26, Paolo: "the Phone app
   that we worked so hard for isn't even implemented yet"). The phone was finished and
   sitting behind a developer tab; the run opens it now, and this is the half that makes
   it a phone rather than a demo pinned on top of a live world. The city posts its state
   on open and on every change -- the 7/27 backlog entry's second clause, "doesn't
   progress as I walk", is this. */
var LIVE = null;
function liveStrip(){
  if(!LIVE) return '';
  var where = LIVE.district ? String(LIVE.district).toUpperCase() : 'THE VALLEY';
  var h = '<div class="live-strip"><div class="lv-top">'+esc(where)+
          ' \\u00b7 DAY '+LIVE.day+' \\u00b7 '+esc(LIVE.clock)+(LIVE.night?' \\u00b7 dark':'')+'</div>';
  if(LIVE.objective) h += '<div class="lv-obj">'+esc(LIVE.objective)+'</div>';
  return h+'</div>';
}
window.addEventListener('message', function(ev){
  var d = ev && ev.data;
  if(!d || !d.bohemiaPhoneWhere) return;
  LIVE = d.bohemiaPhoneWhere;
  /* THE MAP NEEDED NO NEW CODE TO SHOW HIM: it already drew "you" from
     player.tile and was drawing a demo actor parked at a start cell. */
  try{
    if(LIVE.cell && player && player.tile){
      player.tile.x = LIVE.cell.x; player.tile.y = LIVE.cell.y;
    }
  }catch(e){}
  try{ rerender(); }catch(e){}
});
"""

CSS_ANCHOR = '</style>'
CSS_ADD = """/* """ + MARK + """ -- the live strip. Sits above the phone's own header and
   uses its type, so it reads as part of the phone and not as a HUD bolted on. */
.live-strip{margin:0 0 8px;padding:8px 10px;border-radius:8px;background:#161310;
  border:1px solid #2a2418}
.lv-top{font-size:10px;font-weight:700;letter-spacing:2px;color:#b89a6a}
.lv-obj{margin-top:4px;font-size:12px;line-height:1.4;color:#e7d8bb}
</style>"""


def main():
    if not os.path.exists(SRC):
        sys.exit('FAIL: ' + SRC + ' not found')
    s = open(SRC, encoding='utf-8').read()
    if MARK in s:
        print('NOOP: ' + MARK + ' already present')
        return

    for name, old, new in [('home strip', OLD_HOME, NEW_HOME),
                           ('map home marker', OLD_MAP, NEW_MAP)]:
        if old not in s:
            sys.exit('FAIL: anchor not found -- ' + name)
        s = s.replace(old, new, 1)

    i = s.find(CSS_ANCHOR)
    if i < 0:
        sys.exit('FAIL: no </style> to extend')
    s = s[:i] + CSS_ADD + s[i + len(CSS_ANCHOR):]

    tail = s.rfind('</script>')
    if tail < 0:
        sys.exit('FAIL: no closing script tag')
    s = s[:tail] + RECEIVER + '\n' + s[tail:]

    open(SRC, 'w', encoding='utf-8').write(s)
    print('PATCHED ' + SRC + ' (' + str(len(s)) + ' bytes)')
    print('NEXT: node tools/build_current_slice.js')


if __name__ == '__main__':
    main()
