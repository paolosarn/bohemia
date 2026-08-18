#!/usr/bin/env python3
"""
THE FLOOR CAN DO SOMETHING TO YOU -- ON THE SURFACE HE WALKS ON. (8/18, WORLD lane.)

Paolo 8/17, LOCKED: "THE WORLD HAS TO FEEL MORE ALIVE." laws/BOHEMIA_ADDENDUM_THE_RF4_
LIFT_8_17_26.md sec 5 routes that to WORLD and says why in one line: it is TILE TYPES with
combat-readable properties, not combat code. And its closing sentence is the whole brief --
A ROOM ONLY FEELS ALIVE IF THE FLOOR CAN DO SOMETHING TO YOU.

engine/bohemia_hazard.js does the reading. This puts it where he stands.

WHY THAT SENTENCE IS NOT DECORATION, AND WHY THIS TOOL EXISTS AT ALL: the valley has been
authoring lethal ground for weeks -- drained pools, talus aprons, leachate ponds, standing
pit water -- and NONE OF IT WAS DANGEROUS, because nothing ever asked. A hazard nobody can
perceive is not a hazard, it is a comment. VERIFY ON THE REAL SURFACE (7/18) says the same
thing from the other end: a module that classifies 25 tiles and never reaches the glass has
shipped nothing. So this tool is the half that makes the other half real.

THE READOUT IS DELIBERATELY SMALL, AND THAT IS THE TEACHING REGISTER, NOT LAZINESS.
Sec 2.6 of the same law binds every lane that writes player-facing text: tell them what they
could not derive, hint at what they could, SHOW them what the room can demonstrate -- "never
explain something the floor could have shown." The floor cannot show it yet, because the
hazard PIXELS are ART's job and ART cannot start until the types exist, which is what landed
today. So this ships the B register -- a short line in the floor's own words, naming the
tile and what it does -- and it is explicitly the placeholder for a picture:

    TALUS / SCREE
    loose underfoot. you cannot brace here.

Three lines of hint, retired the day the pit reads as a pit.

WHAT IT DOES NOT DO, ON PURPOSE:
  - it does not change what is walkable. Every hazard already IS ground he can stand on;
    turning a drained pool into a hole would rewrite occupancy across twenty districts as
    a side effect of adding a readout, and that is not what was asked for.
  - it does not deal damage or kill anything today. The kill is FORCED ENTRY ONLY (his
    corpus: "knocked or charging in") and nothing knocks a body around on this surface yet
    -- that is COMBAT's half of machine 6. NO DAMAGE BEFORE THE DIAL is untouched: an
    environmental kill is a separate channel and it still has nobody to kill.
  - it does not run per frame. It reads on the STEP, which is the only moment the answer
    can change, and the city view was just measured to death for exactly this kind of
    per-frame cost.

REUSE CHECK: cooks no pixels and opens no bank -- there is nothing to draw here yet, which
is precisely the ART ask this turn files. It reuses the page's OWN tile plumbing rather than
adding a second copy: tileMeta() for the cell, deadLegendFor() for the legend (the one
function that already knows the suburb is not in the kit registry), and BohemiaDistrictKit
for occupancy. Nothing about how a tile is resolved is re-implemented here.

  python3 tools/bohemia_city_hazard_patch.py
"""
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

WORLD = 'slices/BOHEMIA_CITY_WORLD.html'
MODULE = 'engine/bohemia_hazard.js'

MARK = '/* ==== THE FLOOR CAN DO SOMETHING TO YOU (inlined verbatim) ==== */'
ENDMARK = '/* ==== end THE FLOOR CAN DO SOMETHING TO YOU ==== */'
CSS_MARK = '/* ==== footing readout css ==== */'
CSS_END = '/* ==== end footing readout css ==== */'
FACE_MARK = '/* ==== __FLOOR_DOES_SOMETHING__ -- what is under his feet ==== */'
FACE_END = '/* ==== end __FLOOR_DOES_SOMETHING__ ==== */'

if not os.path.exists(WORLD):
    sys.exit('HAZARD PATCH: %s is not here.' % WORLD)
if not os.path.exists(MODULE):
    sys.exit('HAZARD PATCH: %s is missing.' % MODULE)
src = open(WORLD, encoding='utf-8').read()


def cut(text, a_mark, b_mark, what):
    """Delimited-block removal. A START WITH NO END IS NOT SOMETHING TO GUESS AT --
    the payday orphan (8/15) was a rename that left a stale block LATER in the file,
    where the browser ran it and the fresh copy was dead code."""
    n = 0
    while a_mark in text:
        a = text.find(a_mark)
        b = text.find(b_mark, a)
        if b < 0:
            sys.exit('HAZARD PATCH: the %s block has a start and no end. Refusing to guess '
                     'where it stops.' % what)
        text = text[:a] + text[b + len(b_mark):]
        n += 1
    return text, n


refreshed = 0
for a_m, b_m, what in ((MARK, ENDMARK, 'module'), (CSS_MARK, CSS_END, 'css'),
                       (FACE_MARK, FACE_END, 'face')):
    src, n = cut(src, a_m, b_m, what)
    refreshed += n

# ---------------------------------------------------------------- 1. the module
# THE BANNER IS THE SYNC SWEEP'S ONLY DOOR and it is written in the scanner's exact shape:
# '/* ==== engine/x.js ==== */' on ONE line. A wrapped banner is not a style choice, it is
# an OPT-OUT from the ENGINE SYNC LAW -- ten modules on this very page sat outside the sweep
# that way and one of them drifted a full week (8/15, banner_gate.js exists because of it).
ANCHOR = '  root.BohemiaDistrictKit=API;'
i = src.find(ANCHOR)
if i < 0:
    sys.exit('HAZARD PATCH: could not find the district kit export to inline after. The '
             'hazard reader asks the kit for occupancy, so it cannot land before it.')
j = src.find('\n', i) + 1
j = src.find('\n', j) + 1                     # past the kit IIFE's closing line

blob = [MARK,
        '/* ==== %s ==== */' % MODULE,
        '/* inlined verbatim by tools/bohemia_city_hazard_patch.py. The banner above is one '
        'line on purpose: see the note in that tool. */',
        open(MODULE, encoding='utf-8').read(),
        ENDMARK]
src = src[:j] + '\n' + '\n'.join(blob) + '\n' + src[j:]

# ---------------------------------------------------------------- 2. the css
CSS_ANCHOR = '#hud{'
k = src.find(CSS_ANCHOR)
if k < 0:
    sys.exit('HAZARD PATCH: could not find the hud css to sit beside.')
CSS = """%s
/* THE FOOTING READOUT, DIRECTLY UNDER THE TOP BAR, and that position is the whole
   reason this comment exists. It was at bottom-left first, and a screenshot of the real
   phone viewport standing in a drained pool showed it BURIED under three other things --
   the STANDING card, the note tooltip and the BIKE button all live down there, and the
   three of them overlapped it into mush. Every assertion in the gate was green while the
   thing he would actually look at was unreadable. THAT is what VERIFY ON THE REAL
   SURFACE (7/18) means and no amount of passing checks substitutes for opening the
   picture. Measured on the real stage: the top bar ends 39 px in and nothing else is up
   there until the d-pad at 617.
   Only visible when the ground under him is doing something -- an always-on chip reading
   "nothing" teaches him to stop looking at it. One border colour per class so the three
   read apart before a word is parsed. NO PURPLE: purple belongs to the Amalgamation
   alone (PURPLE RESERVATION). */
#footing{position:absolute;left:8px;top:46px;z-index:6;display:none;padding:5px 9px;
  background:rgba(12,10,8,.88);border-left:3px solid #8a7a58;border-radius:2px;
  font-size:11px;font-weight:700;letter-spacing:1.4px;color:#e8dfc8;
  text-shadow:0 1px 3px rgba(0,0,0,.8);max-width:80%%;pointer-events:none}
#footing .fdoes{display:block;font-weight:400;letter-spacing:.4px;font-size:10px;
  color:#c3b89c;margin-top:3px;text-transform:none}
#footing.kills{border-left-color:#b4452f}
#footing.amplifies{border-left-color:#c08a2e}
#footing.disables{border-left-color:#4d7f96}
%s
""" % (CSS_MARK, CSS_END)
src = src[:k] + CSS + src[k:]

# ---------------------------------------------------------------- 3. the element
EL_ANCHOR = '  <div id="note">'
e = src.find(EL_ANCHOR)
if e < 0:
    sys.exit('HAZARD PATCH: could not find the stage note div to place the readout beside.')
src = src[:e] + '  <div id="footing"></div><!-- __FLOOR_DOES_SOMETHING__ -->\n' + src[e:]

# ---------------------------------------------------------------- 4. the reader
FACE = FACE_MARK + r"""
/* WHAT IS UNDER HIS FEET, and it asks the page's OWN plumbing rather than growing a
   second copy of it. tileMeta() resolves the cell, deadLegendFor() resolves the legend
   -- that is the function that already knows THE SUBURB IS NOT IN THE KIT REGISTRY
   (recorded 8/3), which is the trap that would have made this work everywhere except
   the one district he spawns in. BohemiaDistrictKit answers occupancy. */
function hazardUnder(gx, gy){
  try{
    if(typeof BohemiaHazard==='undefined') return null;
    const tx=(gx/FN)|0, ty=(gy/FN)|0, lx=gx-tx*FN, ly=gy-ty*FN;
    const m=tileMeta(tx,ty);
    const grid=m.kit||m.sub;
    if(!grid) return null;                       /* roads and bare desert have no plot */
    const legend=deadLegendFor(m);
    if(!legend) return null;
    const entry=legend[grid[ly*FN+lx]];
    if(!entry) return null;
    const KIT=(typeof BohemiaDistrictKit!=='undefined')?BohemiaDistrictKit:null;
    const cls=BohemiaHazard.classOf(entry,KIT);
    return cls?{cls:cls,name:entry.name||'',district:m.d}:null;
  }catch(_e){ return null; }
}

/* WHAT THE FLOOR SAYS. In its own words, not the system's: no class name, no multiplier,
   no "+50% physical damage taken" -- a number he never asked to read. B REGISTER (sec 2.6):
   hint at what he could derive, and let the fight teach the rest. */
const FOOTING_SAYS={
  KILLS:     'a drop. anything knocked in does not come back out.',
  AMPLIFIES: 'loose underfoot. you cannot set your feet here.',
  DISABLES:  'standing water. no sprinting out of this.'
};
/* null, NOT '' -- and the difference is a real bug the gate caught. With '' the very first
   call on ordinary ground matches the cached key, returns early, and never writes the
   element's inline style at all, so it sits at '' rather than 'none'. It LOOKS right
   because the stylesheet hides it anyway, which is exactly the kind of state that reads
   as working right up until something asks. */
let FOOTING_AT=null;
function footingUpdate(){
  const el=document.getElementById('footing');
  if(!el) return;
  const h=(typeof MODE!=='undefined'&&MODE==='city')?null:hazardUnder(hx,hy);
  const key=h?(h.cls+'|'+h.name):'';
  if(key===FOOTING_AT) return;                   /* no DOM write when nothing changed */
  FOOTING_AT=key;
  if(!h){ el.style.display='none'; el.className=''; return; }
  el.className=h.cls.toLowerCase();
  el.innerHTML=String(h.name).toUpperCase().replace(/[<>&]/g,'')+
    '<span class="fdoes">'+FOOTING_SAYS[h.cls]+'</span>';
  el.style.display='block';
}
""" + FACE_END

FACE_ANCHOR = 'function animate(kind){'
f = src.find(FACE_ANCHOR)
if f < 0:
    sys.exit('HAZARD PATCH: could not find animate() to define the footing reader beside.')
src = src[:f] + FACE + '\n' + src[f:]

# ---------------------------------------------------------------- 5. the one call site
# ON THE STEP, NOT ON THE FRAME. The answer can only change when he moves, and the city
# view was measured down from 46,859 world lookups a frame this same week -- putting a
# tile resolve in render() would hand that back.
CALL_OLD = "  if(moved){ animate((running||RIDING)?'run':'walk'); reportState(); }"
CALL_NEW = ("  if(moved){ animate((running||RIDING)?'run':'walk'); reportState(); "
            "footingUpdate(); /* __FLOOR_DOES_SOMETHING__ */ }")
if CALL_NEW not in src:
    if CALL_OLD not in src:
        sys.exit('HAZARD PATCH: could not find the metronome step to read the footing on. '
                 'Refusing to guess -- a readout wired to the wrong beat is a readout that '
                 'lies about where he is standing.')
    src = src.replace(CALL_OLD, CALL_NEW, 1)

open(WORLD, 'w', encoding='utf-8').write(src)
print('HAZARD PATCH: %s %s' % (MODULE, 'REFRESHED in' if refreshed else 'inlined into'))
print('    the footing readout reads on the STEP, never on the frame')
print('    hazard PIXELS are the ART ask this files; the words are the placeholder')
