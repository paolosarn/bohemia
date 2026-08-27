#!/usr/bin/env python3
"""BOHEMIA CITY CASTING (8/26/26, PEOPLE lane) -- the quest wants a lineman, and
now the lineman is somebody you can walk up to.

Paolo 8/25, THE PLAYTEST DISPATCH item 2:
    "THE QUESTS ARE SO BAD AND NOT WIRED TO ANY LOCATIONS OR PEOPLE IN THE CITY."
His dispatch makes it demand-side: "A QUEST THAT IS NOT ATTACHED TO A PLACE AND
A PERSON IS NOT A QUEST."

WHAT WAS TRUE BEFORE THIS, IN THE CITY'S OWN WORDS (it says so in a comment):
    "SCAFFOLD -- the casting. The real system casts @ROLE against people who
     actually exist in the world and places the quest where they are. This binds
     stages to WORLD EVENTS instead."
So a quest's cast was a WORD. `@ROLE lineman REQ faction=TRADES` resolved to the
string "lineman" and nobody in the valley was ever the lineman.

MEASURED ON THE WALKED CITY BEFORE THIS WAS WRITTEN:
    people swept                    2,661
    people who run with an outfit     204   (7.7%)
    outfits with real people           11 of 13
    quest factions with nobody          2   (REDS, BLUES)
So the demand is answerable for nine of the eleven outfits the nine canon quests
ask for, and NULL is the honest answer for the other two.

WHAT THIS DOES: on the person card, if the active quest wants a role and THIS
person is who that role resolves to on this block, the card says so.

AND IT SAYS IT TRUTHFULLY. The row reads "on this block" because that is exactly
what it is: casting runs against the people standing here. THE OTHER HALF -- WHICH
BLOCK THE QUEST LIVES ON -- IS ALREADY BUILT AND IS NOT WIRED HERE:
bohemia_loop.js castTarget() has picked a real district cell out of the quest's
own faction demand since 7/26, and the demo day loop binds to world events
instead. Wiring that is the demo loop's own job, and pretending this row is the
whole of item 2 would be worse than the row not existing.

  python3 tools/bohemia_city_casting_patch.py

Gate: gates/casting_gate.js
"""
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARK = '__CITY_CASTING__'

# ---- 1. the caster: who the active quest's roles resolve to on this block ----
FN_ANCHOR = "function ctFactionOf(p){"
FN = """/* __CITY_CASTING__ -- WHO THE ACTIVE QUEST ACTUALLY WANTS, ON THIS BLOCK.
   Paolo 8/25: "THE QUESTS ARE SO BAD AND NOT WIRED TO ANY LOCATIONS OR PEOPLE
   IN THE CITY." A role resolved to the WORD "lineman" and nobody was ever it.
   The casting itself is BohemiaPeople.castAddresses -- one implementation, in the
   identity module, because who somebody IS in a story is identity. This gives it
   the two things only the city can: the people standing here, and the bridge
   that says which outfit each of them runs with (ctFactionOf, which the card
   already prints as RUNS WITH, so a cast and a card can never disagree).
   CACHED PER BLOCK AND PER STAGE, not per draw: the card redraws constantly and
   re-sorting every person on the block for every redraw is work nobody sees. */
var CT_CAST = null, CT_CAST_KEY = '';
function ctCast(){
  try {
    if (typeof DQ === 'undefined' || !DQ || !DQ.Q || !DQ.Q.roles) return null;
    if (DQ.rt && DQ.rt.state && DQ.rt.state.done) return null;
    var people = ctEveryone();
    if (!people || !people.length) return null;
    /* *** KEYED ON THE BLOCK, NOT ON WHERE YOU ARE STANDING IN IT, AND A
       MUTATION TAUGHT ME THAT. *** The first cut keyed on hx,hy and the roster
       LENGTH, so taking one step re-cast the quest -- harmless while the pool is
       two or three affiliated people (the answer is deterministic, so it came
       out the same), and NOT harmless the moment the roster shifts under you:
       the person the card was opened on stopped being the person the quest
       wanted, mid-conversation. A CAST THAT MOVES WHILE YOU WALK TOWARD IT IS
       NOT A CAST. The block is what the roster belongs to, so the block is the
       key, and BohemiaPopulation.NB is the cell size the spawn itself uses. */
    var cell = ctCell ? ctCell() : [0, 0];
    var nb = (typeof BohemiaPopulation !== 'undefined' && BohemiaPopulation.NB) || 1;
    var k = String(DQ.spec && DQ.spec.id) + '|'
          + Math.floor(cell[0] / nb) + ',' + Math.floor(cell[1] / nb);
    if (CT_CAST_KEY === k) return CT_CAST;
    var keyed = people.map(function(p){ return { key: 'P:city:' + p.id, __p: p }; });
    CT_CAST = BohemiaPeople.castQuest(DQ.Q.roles, keyed, {
      questId: (DQ.Q && DQ.Q.id) || '',
      factionOf: function(w){ return ctFactionOf(w.__p); }
    });
    CT_CAST_KEY = k;
    return CT_CAST;
  } catch(_e){ return null; }
}
/* WHAT THIS PERSON IS WANTED FOR, or null. Plain English on purpose: it is the
   game telling you what to do next, which is required information, which under
   THEY SPEAK SPANGLISH's hard rule is always English. */
function ctCastRow(who){
  try {
    var cast = ctCast(); if (!cast) return null;
    for (var name in cast) {
      if (!cast.hasOwnProperty(name)) continue;
      if (cast[name].key !== who.key) continue;
      var title = (DQ.Q && DQ.Q.title) || 'the job';
      return title + ' wants the ' + String(name).replace(/_/g, ' ')
             + '. On this block, that is them.';
    }
  } catch(_e){}
  return null;
}
""" + FN_ANCHOR

# ---- 2. the row, right under SPEAKS: who they are, then what they are for ----
ROW_ANCHOR = """  /* __CITY_MEMORY__ -- WHERE THEY LIVE, IN WORDS HE CAN ACT ON."""
ROW = """  /* __CITY_CASTING__ -- AND WHAT THE JOB WANTS THEM FOR (8/26). It sits with
     the identity rows because being the one the quest needs is a fact about WHO
     THEY ARE today, not about where they sleep. Absent for everybody else, which
     is the point: on a block of thirty people this row is the one that tells you
     which door to knock on. */
  var ctJob = (typeof ctCastRow === 'function') ? ctCastRow(who) : null;
  if (ctJob) body += ctRow('THE JOB', ctJob);
"""


def main():
    html = open(CITY, encoding='utf-8').read()
    if MARK in html:
        print('  already applied  ' + CITY)
        return
    for name, anchor in (('ctFactionOf', FN_ANCHOR), ('the LIVES row', ROW_ANCHOR)):
        if html.count(anchor) != 1:
            sys.exit('FAILED: %s resolves %d times in %s, expected 1.'
                     % (name, html.count(anchor), CITY))
    html = html.replace(FN_ANCHOR, FN, 1)
    html = html.replace(ROW_ANCHOR, ROW + ROW_ANCHOR, 1)
    open(CITY, 'w', encoding='utf-8').write(html)
    print('  patched  ' + CITY + '  (ctCast + the THE JOB row)')


if __name__ == '__main__':
    main()
