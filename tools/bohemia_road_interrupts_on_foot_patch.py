#!/usr/bin/env python3
"""
ROAD INTERRUPTS ON FOOT (9/5/26, RUN lane)

VAMILY row: RUN [street encounters] ROAD-INTERRUPTS-ON-FOOT.
"roadInterrupt has one caller inside MODE==='city'; it never fires on the walked
street."

THE ROAD INTERRUPTS shipped 8/27: twelve approved road moments, the encounter
director wired to the clock, 70/20/10 held, the card, the leavings, the choices.
ALL OF IT FIRES ONLY WHEN YOU ARE LOOKING AT THE MAP. The surface Paolo actually
walks -- the one he plays, the one the demo opens on -- has never produced a
single one of them.

WHAT THIS PATCH DOES, and it is three small things:

1. roadWhere(). The interrupt read `city.x, city.y` for BOTH the district lookup
   and the power grid, and those are OVERMAP cells that only move in city mode.
   On foot the position is hx/hy in FINE cells, so the district it was reading
   was wherever the map cursor happened to be left, not where the player is
   standing. One function answers "which overmap cell is the player in", per
   mode, and both readers use it -- so the two can never come to mean different
   places, which is the bug this repo has now fixed five times.

2. THE HUMAN BRANCH HANDS ITS TIME TO THE SAME DIRECTOR. A walked cell already
   spends 0.084 minutes (distance-honest, 5.04 seconds). That time was always
   being spent, it just never bought anything -- word for word the sentence the
   city branch's own comment used on 8/27. No new pacing, no second director:
   the approved MIN_GAP_S of 90 seconds now means about eighteen walked cells
   between moments, against one map press.

3. NOTHING ELSE. Same twelve tokens, same 70/20/10, same costs, same card, same
   leavings, same choices. NO DAMAGE BEFORE THE DIAL is untouched because the
   director cannot return damage.

MEASURED BEFORE BUILDING, because a feature that cannot reach the player is the
trap this lane fell into twice this round:
  * 39.4% of the valley (3,633 of 9,216 overmap cells) is one of the seven road
    districts the table covers; arterial alone is 2,434.
  * The nearest road-district cell to the spawn is ONE cell away, at (49,47),
    arterial. He will be on road ground within a minute of walking.
So this is visible, and a suburb correctly stays quiet: NO GLOBAL SPAWNS EVER is
the director's own rule and a district with no table produces nothing.

IDEMPOTENT: the mark is checked first, anchors asserted to match exactly once.
"""
import sys, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CITY = os.path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html')
MARK = '__ROAD_INTERRUPTS_ON_FOOT__'


def main():
    src = open(CITY, encoding='utf8').read()
    if MARK in src:
        print('  already applied (%s present) -- nothing to do' % MARK)
        return 0

    # ---- 1. one answer to "which cell is the player in" --------------------
    anchor_can = 'function roadCan(need){'
    assert src.count(anchor_can) == 1, 'roadCan anchor %d' % src.count(anchor_can)
    where = '''/* ==== ''' + MARK + r''' (9/5) : WHERE THE PLAYER ACTUALLY IS =============
   The road interrupt read city.x / city.y for the district AND for the power
   grid. Those are OVERMAP cells and they only move in city mode, so on foot it
   was reading whatever cell the map cursor was last left on -- not the ground
   under the player. One function answers this now, per mode, and every reader
   uses it, because two places both claiming to be "where you are" is the bug
   this file has already fixed five times under five different names.
   ========================================================================== */
function roadWhere(){
  try{
    if(typeof MODE!=='undefined' && MODE!=='city' && typeof hx!=='undefined')
      return [Math.floor(hx/FN), Math.floor(hy/FN)];
  }catch(_e){}
  try{ return [city.x, city.y]; }catch(_e){ return [0,0]; }
}

''' + anchor_can
    src = src.replace(anchor_can, where, 1)

    # roadCan asks the grid about the player's cell, whichever mode he is in
    old_lit = "    if(need==='lit') return !!(POWER.at(city.x,city.y)||{}).live;"
    new_lit = ("    var _w = roadWhere();   /* " + MARK + " */\n"
               "    if(need==='lit') return !!(POWER.at(_w[0],_w[1])||{}).live;")
    assert src.count(old_lit) == 1, 'lit anchor %d' % src.count(old_lit)
    src = src.replace(old_lit, new_lit, 1)

    old_me = "      var me=POWER.at(city.x,city.y)||{};"
    new_me = "      var me=POWER.at(_w[0],_w[1])||{};"
    assert src.count(old_me) == 1, 'me anchor %d' % src.count(old_me)
    src = src.replace(old_me, new_me, 1)

    old_n = "        var n=POWER.at(city.x+d[i][0],city.y+d[i][1])||{};"
    new_n = "        var n=POWER.at(_w[0]+d[i][0],_w[1]+d[i][1])||{};"
    assert src.count(old_n) == 1, 'neighbour anchor %d' % src.count(old_n)
    src = src.replace(old_n, new_n, 1)

    old_cell = "  try{ cell = om.at(city.x, city.y); }catch(_e){}"
    new_cell = ("  /* " + MARK + ": the district under the PLAYER, in either mode. */\n"
                "  var _w = roadWhere();\n"
                "  try{ cell = om.at(_w[0], _w[1]); }catch(_e){}")
    assert src.count(old_cell) == 1, 'cell anchor %d' % src.count(old_cell)
    src = src.replace(old_cell, new_cell, 1)

    # ---- 2. the walked street spends time too ------------------------------
    anchor_foot = "    if(moved){ HFACE=dirOf(dx,dy); return true; }"
    assert src.count(anchor_foot) == 1, 'foot anchor %d' % src.count(anchor_foot)
    foot = r'''    if(moved){ HFACE=dirOf(dx,dy);
      /* ''' + MARK + r''' -- AND THE WALKED STREET GETS THE SAME SAY.
         A walked cell already spends 0.084 minutes, distance-honest: 5.04
         seconds, and moved is how many cells this beat actually covered (a bike
         covers four). THE TIME WAS ALWAYS BEING SPENT, IT JUST NEVER BOUGHT
         ANYTHING -- the city branch's own sentence from 8/27, and it was just as
         true one branch down.
         No new pacing and no second director: the approved 90-second gap now
         means about eighteen walked cells between moments. A district with no
         table still produces nothing, because NO GLOBAL SPAWNS EVER. */
      ROAD_LASTDIR = di;
      try{ roadInterrupt(moved * 5.04); }catch(_e){}
      return true; }'''
    src = src.replace(anchor_foot, foot, 1)

    open(CITY, 'w', encoding='utf8').write(src)
    print('  added    : roadWhere() -- one answer to which cell the player is in')
    print('  repointed: roadCan and roadInterrupt read the PLAYER cell, not the map cursor')
    print('  hooked   : the human branch of stepOnce hands its 5.04s per cell to the director')
    print('  wrote    : slices/BOHEMIA_CITY_WORLD.html')
    return 0


if __name__ == '__main__':
    sys.exit(main())
