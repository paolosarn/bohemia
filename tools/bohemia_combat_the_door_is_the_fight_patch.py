#!/usr/bin/env python3
"""V161 THE DOOR IS THE FIGHT: the combat entry point the walked surface never had.

RF4-C, spec item: NONE YET -- and that is deliberate and legal. The 8/16 law
(laws/BOHEMIA_ADDENDUM_RECREATE_RF4_FIRST_8_16_26.md) splits the work: LAB owns
the RF4 teardown spec, COMBAT owns the implementation and builds FROM it. THE
SPEC DOES NOT EXIST YET (records/BOHEMIA_RF4_TEARDOWN_SPEC.md is absent), so every
RF4 MECHANIC is blocked and this session invents none of them.

What is NOT blocked is the thing the law names as the FIRST thing to ship, in its
own section 3 and again in section 6:

  "WHAT IS MISSING IS THE SAME WIRE THE DEMO BOARD ALREADY FLAGGED: on the walked
   surface there is NO COMBAT ENTRY POINT... INDOOR COMBAT AND THAT MISSING WIRE
   ARE THE SAME JOB: walk in a door, fight in the room."
  "the FIRST thing this effort ships -- walk through a door, fight in the room --
   pays the demo immediately."

That is plumbing between two surfaces Bohemia already has. It is not an RF4
mechanic and it needs no spec item.

--------------------------------------------------------------------------
THE CLAIM, VERIFIED BEFORE BUILDING ON IT
--------------------------------------------------------------------------
Demo row 1 says every "combat" occurrence in the city world is a comment or CSS.
CHECKED: five occurrences, all five are comments or a CSS selector. Nothing on the
walked surface has ever been able to start a fight.

AND THE BRIDGE WAS ALREADY FINISHED. The combat frame has accepted
BOHEMIA_ENCOUNTER (roster, package, playerHP, quest context, defend contract)
since V66, answers with BOHEMIA_COMBAT_END, and the RUN slice has driven that
exact path for weeks. THE CITY SIMPLY NEVER CALLED IT. This is not new combat
code; it is the call that was missing.

--------------------------------------------------------------------------
WHAT SHIPS
--------------------------------------------------------------------------
1. THE CITY POSTS. inEnter() is the ONE place a body goes through a door -- the
   8/2 doorway ruling funnels every entry through it -- so that is where this
   hooks, and nothing else in the walk is touched.
2. THE SHELL DRIVES IT, by mirroring runEncounterIn byte for byte in shape:
   bring the combat frame up, start a real encounter, and on BOHEMIA_COMBAT_END
   put him straight back on the block where he was standing. A SECOND handoff
   path would be the duplicate-system mistake; this is the same bus.
3. HE COMES BACK WHERE HE STOOD. INSIDE.exit already holds the exterior cell he
   walked in from, because the interior entrance IS the exterior entrance.

--------------------------------------------------------------------------
WHO IS IN THE ROOM IS NOT MINE (MECHANISM-MINE / CONTENTS-PAOLO'S)
--------------------------------------------------------------------------
The city has factions, bases and reach. IT HAS NO HOSTILITY MODEL, and who hates
whom is canon -- his, not mine. So no hostility table is authored here.

But an empty predicate means the wire never fires, which is invisible work and
the exact failure ALWAYS MAKE AN ATTEMPT (8/11) exists to stop: "FOR ANY TEXT
JUST HAVE PLACEHOLDING GOOD ESTIMATES OF SPEECH I WILL EDIT IT LIVE." So it ships
a REAL, PLAYABLE attempt, marked draft, that he can move with one word:

  FIGHT_ODDS -- how often a building has somebody in it who does not want you
  there. ONE DIAL, and it is DETERMINISTIC off the footprint, never a coin flip
  per entry: the same building behaves the same way every time you walk in, so
  the world is a place rather than a slot machine. Re-rolling on each entry
  would read as broken, and it would let him farm a door.

The faction is READ from the city's own lookup when it answers, never invented.

--------------------------------------------------------------------------
WHAT IS DELIBERATELY NOT HERE
--------------------------------------------------------------------------
THE ROOM'S GEOMETRY INSIDE THE FIGHT -- walls as cover, doorways as chokepoints,
"wide open" as exposure. That is the RF4 half ("abilities READ THE ROOM"), it is
exactly what the teardown spec is for, and inventing it is what the law forbids.
The room's real dimensions ride along on the message so the spec'd version has
them waiting; combat does not consume them yet. FLAGGED FOR A SPEC ITEM.

REUSE CHECK: cooks NO graphic pixels. Reuses the V66 BOHEMIA_ENCOUNTER bridge,
runEncounterIn's shape, INSIDE.exit, and inEnter's existing floorplan. Nothing
authored, no bank opened, no second handoff path.

TASTE CHECK: authors no art. The taste rule is his demo board's row 1: a fight
you cannot start from the surface you play is not in the game. The restraint is
that the trigger announces nothing and adds no UI -- you walk in a door and
someone is there.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): authors no rig geometry, touches no clip,
  no joint and no painted region.
  built on: the BAKED package
  joints: none
  parts: none
"""
import re, sys, pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1]
CITY = ROOT / 'slices' / 'BOHEMIA_CITY_WORLD.html'
ALPHA = ROOT / 'slices' / 'BOHEMIA_ALPHA_0_9.html'
MARK = 'V161 THE DOOR IS THE FIGHT'


def subN(src, old, new, n=1):
    c = src.count(old)
    if c != n:
        sys.exit('ANCHOR COUNT %d (want %d) for: %s' % (c, n, old[:90]))
    return src.replace(old, new)


def do_city():
    s = CITY.read_text()
    if MARK in s:
        print('  city: already wired')
        return
    old = """  try{ dayEnteredBuilding(INSIDE&&INSIDE.label); }catch(_e){}   /* __DAY_LOOP__ */
  advance(0.5); return true;
}"""
    new = """  try{ dayEnteredBuilding(INSIDE&&INSIDE.label); }catch(_e){}   /* __DAY_LOOP__ */
  /* __CITY_FIGHT__ -- V161 THE DOOR IS THE FIGHT.
     Demo row 1: there was NO COMBAT ENTRY POINT on the walked surface -- every
     "combat" occurrence in this file was a comment or CSS, checked. The combat
     bridge itself has been finished since V66 and the RUN slice has driven it
     for weeks; THE CITY SIMPLY NEVER CALLED IT.
     inEnter is the ONE place a body goes through a door (the 8/2 doorway ruling
     funnels every entry through here), so this is the only hook needed and
     nothing else in the walk is touched. */
  try{ cityFightOnEnter(); }catch(_e){}
  advance(0.5); return true;
}
/* WHO IS IN THE ROOM IS NOT MINE. This city has factions, bases and reach and NO
   hostility model, and who hates whom is canon -- Paolo's, not this lane's. So no
   hostility table is authored here.
   But an empty predicate means the wire never fires, which is invisible work and
   exactly what ALWAYS MAKE AN ATTEMPT (8/11) exists to stop. So: a real playable
   attempt, marked draft, movable in one word.
   DETERMINISTIC OFF THE FOOTPRINT, never a coin flip per entry -- the same
   building behaves the same way every time, so the world is a place rather than a
   slot machine, and he cannot farm a door by walking in and out. */
var FIGHT_ODDS=0.35;   /* [DIAL, draft:true] how often somebody is in there who does not want you in there */
var FIGHT_MIN=2, FIGHT_MAX=5;   /* [DIALS, draft:true] how many of them, and the ROOM decides */
function cityFightRoll(){
  if(!INSIDE||!INSIDE.foot)return false;
  var f=INSIDE.foot;
  var h=(Math.imul(f.x,2246822519)^Math.imul(f.y,3266489917)^Math.imul(f.w*31+f.h,668265263))>>>0;
  return ((h%1000)/1000)<FIGHT_ODDS; }
/* HOW MANY OF THEM, DERIVED FROM THE ROOM RATHER THAN PICKED. A bigger room
   holds more people -- that is the floor plate doing the work, not a table I
   invented, and it means the fight scales with the building he chose to walk
   into. Sending NO roster is not an option: startEncounter maps (spec.roster||[])
   and an empty fight throws in the frame -- measured, "Cannot read properties of
   undefined" on the first end-to-end run. A fight with nobody in it is not a
   restrained fight, it is a broken one. */
function cityFightCount(){
  if(!INSIDE||!INSIDE.foot)return FIGHT_MIN;
  var f=INSIDE.foot, area=Math.max(1,(f.w|0)*(f.h|0));
  var n=Math.round(FIGHT_MIN+(FIGHT_MAX-FIGHT_MIN)*Math.min(1,area/144));
  return Math.max(FIGHT_MIN,Math.min(FIGHT_MAX,n)); }
function cityFightOnEnter(){
  if(!INSIDE||!cityFightRoll())return false;
  if(!(window.parent&&window.parent!==window))return false;
  var f=INSIDE.foot, fp=INSIDE.fp;
  /* THE NAMES ARE NOT MINE. Only the ARCHETYPE rides -- who these people are,
     what they are called and which outfit they run with is canon. startEncounter
     already fills a neutral placeholder name, and that stays a placeholder until
     he rules. */
  var roster=[]; var n=cityFightCount();
  for(var i=0;i<n;i++)roster.push({arch:(i%4===3)?'bot':'human'});
  var fac=null; try{ fac=(typeof cityFactionHere==='function')?cityFactionHere():null; }catch(_e){}
  /* the ROOM rides along -- real dimensions, because INTERIOR-MATCHES-EXTERIOR
     means fp.W x fp.H IS the footprint. Combat does not consume it yet: walls as
     cover and doorways as chokepoints are the RF4 half and belong to the teardown
     spec, which does not exist. Sending it costs nothing and means the spec'd
     version has it waiting instead of needing another wire. */
  try{ window.parent.postMessage({type:'BOHEMIA_CITY_ENCOUNTER',
    label:(INSIDE.label||'interior'), faction:fac, draft:true, roster:roster,
    room:{w:(fp&&fp.W)||f.w, h:(fp&&fp.H)||f.h, zone:INSIDE.zone||null},
    at:{gx:(INSIDE.exit&&INSIDE.exit.gx)|0, gy:(INSIDE.exit&&INSIDE.exit.gy)|0}},'*'); }catch(_e){ return false; }
  return true;
}"""
    s = subN(s, old, new)
    CITY.write_text(s)
    print('  city: inEnter now offers the fight')


def do_alpha():
    s = ALPHA.read_text()
    if MARK in s:
        print('  alpha: already wired')
        return

    # 1) the handler, mirroring runEncounterIn rather than inventing a second path
    old = """function runEncounterIn(d){"""
    new = """/* ===== V161 THE DOOR IS THE FIGHT ==============================
   The walked surface had no combat entry point (demo row 1, verified: all five
   "combat" occurrences in the city world were comments or CSS). The bridge was
   already finished -- BOHEMIA_ENCOUNTER in, BOHEMIA_COMBAT_END out, driven by
   the RUN slice for weeks. The city just never called it.
   THIS MIRRORS runEncounterIn ON PURPOSE, shape for shape. A second handoff path
   is the duplicate-system mistake this repo keeps paying for; the fight the city
   asks for rides the same bus the dial already speaks. */
var CITYFIGHT=false, CITYFIGHT_AT=null;
function cityEncounterIn(d){
  CITYFIGHT=true; CITYFIGHT_AT=(d&&d.at)||null;
  const go=()=>{ const enc=startEncounter({
      packageId:(d&&d.packageId!=null)?d.packageId:1,
      roster:(d&&d.roster)||null,
      objective:(d&&d.label)?('inside the '+d.label):null,
      faction:(d&&d.faction)||null, reason:'walked in on them'});
    if(enc){ enc.fromCity=true; enc.cityRoom=(d&&d.room)||null; }
    return !!enc; };
  if(document.getElementById('combatFrame')){showTabPanel('combat');go();return;}
  const tab=document.querySelector('.tab[data-p=combat]');
  if(tab)tab.click();                                   /* creates the frame + shows it */
  const fr=document.getElementById('combatFrame');
  if(!fr){go();return;}
  if(fr.contentDocument&&fr.contentDocument.readyState==='complete')setTimeout(go,250);
  else fr.addEventListener('load',()=>setTimeout(go,250));
}
/* and home again, to the block he was standing on. INSIDE.exit already holds the
   exterior cell he walked in from, because the interior entrance IS the exterior
   entrance -- that is the 7/19 law doing the work, not a second bookkeeping. */
function cityFightHome(outcome){
  if(!CITYFIGHT)return false;
  CITYFIGHT=false;
  /* THE WALKED SURFACE IS BEHIND THE **RUN** TAB. There is no data-p="city"
     tab at all -- the shell maps the RUN tab to the p-city panel
     (`var PANEL = (t.dataset.p==='run') ? 'city' : t.dataset.p`). Clicking the
     real tab is what rebuilds/refreshes the frame, so this clicks what his
     thumb clicks instead of hand-toggling classes and leaving the tab strip
     lying about where he is. */
  try{ const t=document.querySelector('.tab[data-p=run]');
    if(t)t.click(); else showTabPanel('city'); }catch(_e){}
  try{ const cf=document.getElementById('cityFrame');
    if(cf&&cf.contentWindow)cf.contentWindow.postMessage({type:'BOHEMIA_CITY_COMBAT_END',
      outcome:outcome||null, at:CITYFIGHT_AT},'*'); }catch(_e){}
  CITYFIGHT_AT=null; return true;
}
function runEncounterIn(d){"""
    s = subN(s, old, new)

    # 2) route the message in
    old = """  if(d.type==='BOHEMIA_RUN_ENCOUNTER'){runEncounterIn(d);return true;}"""
    new = """  if(d.type==='BOHEMIA_RUN_ENCOUNTER'){runEncounterIn(d);return true;}
  if(d.type==='BOHEMIA_CITY_ENCOUNTER'){cityEncounterIn(d);return true;}   /* V161 THE DOOR IS THE FIGHT */"""
    s = subN(s, old, new)

    # 3) and send him home when it settles
    old = """    if(RUNFIGHT){
      RUNFIGHT=false;"""
    new = """    try{ if(CITYFIGHT)cityFightHome(G.lastEncounter||null); }catch(_e){}   /* V161: back to the block he was standing on */
    if(RUNFIGHT){
      RUNFIGHT=false;"""
    s = subN(s, old, new)

    ALPHA.write_text(s)
    print('  alpha: the shell drives it and brings him home')


def main():
    do_city()
    do_alpha()
    print('v161: the door is the fight')


if __name__ == '__main__':
    main()
