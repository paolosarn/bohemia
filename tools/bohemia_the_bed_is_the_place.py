#!/usr/bin/env python3
"""
THE BED IS THE PLACE (9/5/26, SOUNDS lane) - BB-THE-BED-IS-THE-PLACE. A district
that sounds different is different, at zero art cost.

IT RODE BEHIND BB-THE-CITY-SENDS-WHERE AND THAT LANDED THIS MORNING. Until the
walked surface reported where you are, the ambience bed knew three facts about
the world -- day, night, indoors -- and picked from the same weighted list
wherever you stood. Now it can be told the ground you are on.

THE REAL AISLE, from the row: Schafer's KEYNOTE SOUNDS are the background bed,
named for the key of a piece of music, and they are NOT LISTENED TO CONSCIOUSLY
BUT DEEPLY IMPRINT A SENSE OF PLACE. We ship only signals. This is the first
keynote in the game.

TWO LEVERS, AND THE SECOND IS THE ONE HE WOULD ACTUALLY NOTICE.

  1. WHICH rare sound. A working machine belongs to a substation, a lit sign
     belongs to the strip, and a gust belongs to open ground.
  2. HOW OFTEN THE BED SPEAKS AT ALL. This is the perceptible one and the first
     draft of this feature did not have it. The bed ticks on a 40-to-95 second
     gap, so a player crossing three districts in ninety seconds hears ONE
     sound: shifting the odds of that one sound is a change no human can hear.
     Changing the GAP is a change anybody can hear. A dense lit block speaks
     every twenty-five to sixty seconds. Open desert speaks every sixty to a
     hundred and thirty. THE STRIP FEELS BUSY AND THE DESERT FEELS EMPTY, which
     is the whole claim of the row.

GROUNDED IN TWO THINGS ALREADY IN THIS REPO, NOT IN TASTE:
  * LIGHT=TERRITORY -- 12% of the valley has power, clustered, owned. A lit
     block is rare, and a rare thing that is audible from the next street is
     what makes it territory.
  * THE LOCKDOWN FINDING, quoted in BB-A-LIT-BLOCK-HUMS: the 2020 shutdowns cut
     human high-frequency ground noise by up to 50%, the largest drop ever
     recorded and largest in the DENSEST cities, and signals previously buried
     BECAME CLEARLY AUDIBLE. DEAD IS NOT SILENT, DEAD IS A DIFFERENT BED. A
     working generator four blocks away in a dead valley is loud.

FOUR GROUPS, AND EVERY ONE OF THE 79 DISTRICTS LANDS IN EXACTLY ONE, counted
against the enum rather than assumed: machine 25, lit 19, open 18, lived 17.
Seventy-nine rules is not a mechanism, it is a table nobody can hold in their
head:

    MACHINE  something here still runs, or ran   generator leads
    LIT      the 12% with power, and the strip   a sign leads
    OPEN     desert, wash, freeway, water        the wind leads
    LIVED    people sleep here, and it is quiet   mostly just the air

*** MECHANISM-MINE / CONTENTS-PAOLO'S, AND THE ROW SAYS SO IN AS MANY WORDS:
"WHICH place sounds like WHAT is canon and is his." *** The four groups and the
numbers below are MY ATTEMPT, not his ruling, and EVERYTHING IS A THUMB (8/9) is
why they ship rather than wait: he meets them while playing and corrects what he
hates. The whole mapping is one table, published as window.__ambPlaces, and
moving a district from one group to another is one word.

AND AN UNKNOWN PLACE IS EXACTLY WHAT IT IS TODAY. If the report carries no
district -- the run slice's own report does not, and a district nobody has
grouped does not -- the bed uses the odds and the gap he has already been
hearing, untouched. A new field must never change the thing it did not describe.

REUSE CHECK: cooks nothing. No bank, no candidate, no pixel, no new sound. It
uses air_day / air_night / air_inside (5 of 5 thumbs up each, fifteen of
fifteen), generator (4 of 5) and sign_alive -- all already approved, all already
in the bed's own pick list. wind_gust rides its approved sibling pool. Every
name still passes the bed's existing guard, so an unapproved name is skipped and
the air plays.

  python3 tools/bohemia_the_bed_is_the_place.py
"""
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARK = '__THE_BED_IS_THE_PLACE__'

# ---- the city says which district you are standing in --------------------
CITY_ANCHOR = """    window.parent.postMessage({type:'BOHEMIA_WHERE', from:'city',
      inside:inside, night:night, min:min, space:space},'*');"""
CITY_REPLACE = """    /* __THE_BED_IS_THE_PLACE__ -- WHICH GROUND YOU ARE STANDING ON. The
       overmap tile's own district, read the same way every other system in
       this file reads it. Indoors it is not reported: a room is a room. */
    var dist=null;
    try{ if(!inside){ var _t=om.at(Math.floor(hx/FN),Math.floor(hy/FN));
                      dist=_t?_t.district:null; } }catch(_d){}
    window.parent.postMessage({type:'BOHEMIA_WHERE', from:'city',
      inside:inside, night:night, min:min, space:space, district:dist},'*');"""

# ---- the shell turns a district into a KIND of place ----------------------
SHELL_TABLE_ANCHOR = "  var AMB={\n    kind:null, next:0, bus:null, seen:0,"
SHELL_TABLE_REPLACE = r"""  /* === THE BED IS THE PLACE (9/5) ======================================
     BB-THE-BED-IS-THE-PLACE. Schafer's KEYNOTE SOUNDS are the background bed
     -- not listened to consciously, but they imprint a sense of place -- and
     this game shipped only signals. Now that the walked surface reports where
     you stand, the bed can be a keynote.
     FOUR GROUPS, NOT SEVENTY-NINE RULES. Seventy-nine rules is a table
     nobody can hold in their head; four is a thing you can hear. Counted:
     machine 25, lit 19, open 18, lived 17, and nothing left over.
     *** WHICH PLACE SOUNDS LIKE WHAT IS HIS (the row says so). This table is
     an ATTEMPT and it ships instead of waiting because EVERYTHING IS A THUMB
     -- he meets it while playing and moves whatever he wants. One word per
     district, published below so it can be read and changed in one place. */
  var PLACE_OF = {
    /* MACHINE -- something here still runs, or ran until recently. A working
       generator in a dead valley is loud: the 2020 lockdowns cut human ground
       noise by up to half and buried signals became clearly audible. */
    industrial:'machine', substation:'machine', battery:'machine',
    watertreat:'machine', pumpstation:'machine', robofactory:'machine',
    fueldepot:'machine', dam:'machine', solar:'machine', intake:'machine',
    reclaim:'machine', datafort:'machine', radio:'machine', terminal:'machine',
    airport:'machine', airbase:'machine', railyard:'machine', rail:'machine',
    quarry:'machine', gypsum:'machine', landfill:'machine', warehouse:'machine',
    truckstop:'machine', storage:'machine', arsenal:'machine',
    /* LIT -- the 12% with power, clustered and owned. LIGHT=TERRITORY through
       the ear: a sign you can hear from the next street is whose block it is. */
    strip:'lit', casino:'lit', resort:'lit', highroller:'lit', luxor:'lit',
    sign:'lit', strat:'lit', downtown:'lit', mall:'lit', commercial:'lit',
    convention:'lit', drivein:'lit', sphere:'lit', waterpark:'lit',
    minigp:'lit', speedway:'lit', stadium:'lit', ballpark:'lit', swapmeet:'lit',
    /* OPEN -- the desert moves the air and nothing else does. */
    desert:'open', mountain:'open', wash:'open', basin:'open', boneyard:'open',
    cemetery:'open', farm:'open', granary:'open', golf:'open', park:'open',
    reservoir:'open', springs:'open', water:'open', freeway:'open',
    beltway:'open', arterial:'open', interchange:'open', fort:'open',
    /* LIVED -- people sleep here, and the point is that it is quiet. */
    suburb:'lived', gated:'lived', estate:'lived', trailer:'lived',
    apartment:'lived', town:'lived', campus:'lived', school:'lived',
    medical:'lived', chapel:'lived', library:'lived', cityhall:'lived',
    courthouse:'lived', jail:'lived', prison:'lived', policestation:'lived',
    firestation:'lived'
  };
  /* WHAT EACH KIND OF PLACE SOUNDS LIKE. `gap` is the seconds between one bed
     sound and the next and it is the lever a person can actually hear: the
     bed speaks every 40-95 seconds, so a player crossing three districts in
     ninety seconds hears ONE sound, and re-weighting that one sound is a
     change nobody can perceive. The strip speaks often; the desert almost
     never. The weights are cumulative thresholds on one roll, the same shape
     pick() already used.
     UNKNOWN IS UNTOUCHED: no district, or a district nobody grouped, keeps the
     odds and the gap he has been hearing since 8/12. */
  var PLACE = {
    machine: {gen:0.34, wind:0.44, sign:0.50, dog:0.52, metal:0.60, gap:[30,70]},
    lit:     {gen:0.16, wind:0.22, sign:0.52, dog:0.55, metal:0.58, gap:[25,60]},
    open:    {gen:0.02, wind:0.42, sign:0.42, dog:0.46, metal:0.54, gap:[60,130]},
    lived:   {gen:0.06, wind:0.20, sign:0.24, dog:0.34, metal:0.38, gap:[45,100]}
  };
  try{ window.__ambPlaces=function(){ return {of:PLACE_OF, is:PLACE}; }; }catch(_e){}

  var AMB={
    kind:null, next:0, bus:null, seen:0, place:null,"""

SHELL_WHERE_ANCHOR = """      this.kind = d.inside ? 'air_inside' : (d.night ? 'air_night' : 'air_day');"""
SHELL_WHERE_REPLACE = """      this.kind = d.inside ? 'air_inside' : (d.night ? 'air_night' : 'air_day');
      /* __THE_BED_IS_THE_PLACE__ -- which KIND of ground you are standing on.
         Indoors has no place: a room is a room whatever block it is on. */
      this.place = d.inside ? null : (PLACE_OF[d.district] || null);"""

SHELL_PICK_ANCHOR = """    pick:function(){
      if(this.inside) return this.kind;
      var A=(window.__SFX_APPROVED||{});
      var r=Math.random();
      if(r<0.125 && (A.generator||[]).length) return 'generator';
      if(r<0.375 && (A.wind_gust||[]).length) return 'wind_gust';"""
SHELL_PICK_REPLACE = """    pick:function(){
      if(this.inside) return this.kind;
      var A=(window.__SFX_APPROVED||{});
      var r=Math.random();
      /* __THE_BED_IS_THE_PLACE__ -- THE PLACE ANSWERS FIRST. Same three
         approved names the list below already draws from, same guard (an
         unapproved name is skipped and the air plays), different odds by where
         you are standing. Falls straight through when the place is unknown, so
         the run slice's report and any ungrouped district hear exactly what
         they heard yesterday. */
      var _p = this.place && PLACE[this.place];
      if(_p){
        if(r < _p.gen  && (A.generator  ||[]).length) return 'generator';
        if(r < _p.wind && (A.wind_gust  ||[]).length) return 'wind_gust';
        if(r < _p.sign && (A.sign_alive ||[]).length) return 'sign_alive';
        /* AND THE FOUR THAT ARE NOT APPROVED YET GET THEIR ROW ANYWAY. The
           list below this branch carries dog_far, dog_cry, dog_calls,
           neon_buzz, neon_hum and metal_ticks, none of them in the bank, all
           of them guarded so an unapproved name is skipped and the air plays.
           Without these two lines a place-aware bed would SKIP that list, so
           the day he approves a dog it would be silent everywhere -- a new
           feature quietly deleting an old wire, which is the exact shape this
           repo keeps finding. A dog belongs where people are; sheet metal
           cooling belongs where there is metal to cool. */
        if(r < _p.dog){
          if((A.dog_far  ||[]).length) return 'dog_far';
          if((A.dog_cry  ||[]).length) return 'dog_cry';
          if((A.dog_calls||[]).length) return 'dog_calls';
        }
        if(r < _p.metal && (A.metal_ticks||[]).length) return 'metal_ticks';
        return this.kind;
      }
      if(r<0.125 && (A.generator||[]).length) return 'generator';
      if(r<0.375 && (A.wind_gust||[]).length) return 'wind_gust';"""

SHELL_GAP_ANCHOR = "    gap:function(){ return 40 + Math.random()*55; },"
SHELL_GAP_REPLACE = """    /* __THE_BED_IS_THE_PLACE__ -- HOW OFTEN THE VALLEY SPEAKS TO YOU. This is
       the lever a person can hear. A lit block is busy; open desert is not. An
       unknown place keeps his 40-to-95. */
    gap:function(){
      var p = this.place && PLACE[this.place];
      var lo = p ? p.gap[0] : 40, hi = p ? p.gap[1] : 95;
      return lo + Math.random()*(hi-lo);
    },"""


def main():
    print('=== THE BED IS THE PLACE ===')
    city = open(CITY, encoding='utf8').read()
    alpha = open(ALPHA, encoding='utf8').read()

    if MARK in city and MARK in alpha:
        print('  already installed (idempotent, nothing to do)')
        return 0

    steps = [(CITY, city, [('the city reports which district you stand in',
                            CITY_ANCHOR, CITY_REPLACE)]),
             (ALPHA, alpha, [('the shell learns what kinds of place exist',
                              SHELL_TABLE_ANCHOR, SHELL_TABLE_REPLACE),
                             ('and which kind you are in right now',
                              SHELL_WHERE_ANCHOR, SHELL_WHERE_REPLACE),
                             ('the place picks what you hear',
                              SHELL_PICK_ANCHOR, SHELL_PICK_REPLACE),
                             ('and how often you hear anything at all',
                              SHELL_GAP_ANCHOR, SHELL_GAP_REPLACE)])]

    for path, src, wires in steps:
        for what, anchor, rep in wires:
            if src.count(anchor) != 1:
                print('FAIL: anchor for %s is not unique in %s (%d)'
                      % (what, path, src.count(anchor)))
                return 1
            src = src.replace(anchor, rep, 1)
            print('  WIRED  %s' % what)
        open(path, 'w', encoding='utf8').write(src)

    print('  79 districts, 4 kinds of place, 0 new sounds.')
    print('  WHICH PLACE SOUNDS LIKE WHAT IS HIS -- this table is an attempt, '
          'published as window.__ambPlaces, one word per district to move.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
