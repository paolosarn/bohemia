#!/usr/bin/env python3
"""BOHEMIA WHAT YOU WEAR SAYS WHAT YOU DO (9/5/26, PEOPLE lane).
VAMILY [outfits nearby], row OUTFITS-AT-SPAWN.

THE ROW: "zero of 34 people within six cells wear one."

*** MEASURED ON THE REAL SURFACE BEFORE A LINE WAS WRITTEN, AND IT FOUND THREE
SEPARATE BREAKS, NOT ONE. ***

  1. THE BODY IS A HASH. ctBody picks CAST_CV[p.look % 6] -- six anonymous
     townsfolk fits, chosen by three bits of a seed. What somebody wears has
     never been a fact about them. Measured within six cells of the spawn: 52
     people, bodies spread 16/13/5/7/6/5 across the six, with no relation to who
     any of them is.

  2. THE TRADE WORD HAS NEVER FIRED. Every one of those 52 has `role` UNDEFINED.
     The population module calls the field `archetype` and it is populated --
     scav 20, worker 14, keeper 7, watch 11 -- and it holds THE SAME FOUR KEYS
     ROLE_WORDS holds. So every reader of ROLE_WORDS[person.role] has answered
     'SOMEBODY' for every stranger in the valley since the day it was written.
     Fixed at the root: BohemiaPeople.tradeOf owns the trade word now.

  3. NOBODY NEAR THE SPAWN RUNS WITH ANYBODY, AND THAT IS THE MAP. 0 of 61
     affiliated; nearest base 29 cells, a base's pull reaches 12. Both dials are
     [PENDING Paolo] and the map is MAP LAW. Not this lane's to move.

SO THE FACT A PERSON NEAR THE SPAWN ACTUALLY HAS IS THEIR TRADE, and that is
what their clothes say now. FACTION_LOOKS (13 canon outfits, gated at 13
distinguishable silhouettes) is still not on the street -- baking all thirteen
costs a MEASURED 4.6 SECONDS of frozen page (6.02ms x 40 bakes x 13) against
today's 1.45s, so it cannot be eager and it is the next round's work.

WHICH SHAPE BELONGS TO WHICH TRADE IS A DECISION AND IT IS GROUNDED IN THE
TABLE'S OWN WORDS, not invented: every reason below is quoted from the `why`
line CITY_CAST_LOOKS already carries. draft:true; he corrects it by playing.

  python3 tools/bohemia_city_trade_fit_patch.py

Gate: gates/trade_fit_gate.js
"""
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARK = '__CITY_TRADEFIT__'

RECEIVER_OLD = """  var out=[];
  for(var i=0;i<m.looks.length;i++){
    var L=m.looks[i], set={};"""
RECEIVER_NEW = """  var out=[], ids=[];
  for(var i=0;i<m.looks.length;i++){
    var L=m.looks[i], set={};
    /* __CITY_TRADEFIT__ -- KEEP THE NAME THE BAKE SENT. A position in an array
       is a guess; reorder the table upstairs and every binding below would
       quietly mean something else. */
    ids.push(L.id || null);"""

STORE_OLD = """  if(out.length){ CAST_CV=out; if(MODE==='human')render(); }"""
STORE_NEW = """  if(out.length){ CAST_CV=out; CAST_ID=ids; if(MODE==='human')render(); }"""

BODY_OLD = """function ctBody(p,dir){
  if(!CAST_CV||!CAST_CV.length) return null;
  var set=CAST_CV[(p.look>>>0)%CAST_CV.length];"""

BODY_NEW = r"""/* ==== __CITY_TRADEFIT__ : WHAT YOU WEAR SAYS WHAT YOU DO ===================
   Six fits, four trades, and until now the two had nothing to do with each
   other: ctBody picked CAST_CV[p.look % 6], so a Watch and a Scavenger were
   equally likely to be wearing the same coat and nobody's clothes said a word
   about them.

   EVERY BINDING BELOW IS QUOTED FROM THE FIT'S OWN `why` LINE, which the cast
   table has carried since 8/3. Nothing here is invented about the shapes; what
   is decided is which trade each shape belongs to, and that decision is
   draft:true because "which shape belongs to whom is taste" is the table's own
   sentence.

     longcoat  "tallest, narrowest column -- a floor-length duster"
               -> WATCH. A coat you stand outside in all night.
     barearms  "short and broad, bare arms, no coat to hide the shoulders",
               suspenders, cargos, ranch boots
               -> WORKER.
     pack      "a bulk on the back nobody else has"
               -> SCAV. You carry what you find.
     skirt     "the only one whose lower half is not two legs", tee, sneakers
               -> KEEPER. Somebody who holds a place rather than crosses one.
     widebrim  "a hat you can identify from across the street", scav tool belt,
               sandwalkers -> SCAV or WORKER, both outdoors all day.
     cape      "a hanging cape, the only trailing hem", road cape, scarf
               -> WATCH or KEEPER, the two trades that stand still in the wind.

   FOUR SHAPES ARE ONE TRADE'S ALONE and two are shared by two trades. That is
   deliberate: all-unique would put twenty scavengers near the spawn in one
   silhouette, which reads as a uniform, not a crowd. Every trade gets two, so
   the street varies and still tells you something.
   ========================================================================== */
var TRADE_FIT = {
  watch:  ['longcoat', 'cape'],       /* draft:true */
  worker: ['barearms', 'widebrim'],   /* draft:true */
  scav:   ['pack', 'widebrim'],       /* draft:true */
  keeper: ['skirt', 'cape']           /* draft:true */
};
/* WHICH BAKED BODY THIS PERSON WEARS. Their trade picks the pair; their own
   `look` picks within it, so a body still never flickers as you watch it.
   IT FALLS BACK TO WHAT IT DID BEFORE, on purpose: an unknown trade, a renamed
   fit, or a bake that sent no ids all land on CAST_CV[look % n] rather than on
   nothing. A person with no clothes is worse than a person in the wrong ones,
   and this table is his to rename. */
function ctFitIndex(p){
  var n = CAST_CV ? CAST_CV.length : 0;
  var fallback = n ? ((p.look >>> 0) % n) : 0;
  if (!n || !CAST_ID || !CAST_ID.length) return fallback;
  var trade = null;
  try { trade = p.role || p.archetype || null; } catch (_e) {}
  var want = trade ? TRADE_FIT[String(trade)] : null;
  if (!want || !want.length) return fallback;
  /* the fits this bake actually delivered, in the order the table names them */
  var have = [];
  for (var w = 0; w < want.length; w++) {
    var at = CAST_ID.indexOf(want[w]);
    if (at >= 0 && at < n) have.push(at);
  }
  if (!have.length) return fallback;
  return have[(p.look >>> 0) % have.length];
}
function ctBody(p,dir){
  if(!CAST_CV||!CAST_CV.length) return null;
  var set=CAST_CV[ctFitIndex(p)];"""

CASTID_OLD = """var CAST_CV = null;"""
CASTID_NEW = """var CAST_CV = null;
/* __CITY_TRADEFIT__ -- the NAME of each baked body, parallel to CAST_CV. Null
   until a bake that sends ids lands; an older bake leaves it null and the fit
   picker falls straight back to the hash it used before. */
var CAST_ID = null;"""

STEPS = [
    ('the cast id array', CASTID_OLD, CASTID_NEW),
    ('the receiver', RECEIVER_OLD, RECEIVER_NEW),
    ('the store', STORE_OLD, STORE_NEW),
    ('the fit picker', BODY_OLD, BODY_NEW),
]


def main():
    html = open(CITY, encoding='utf-8').read()
    if MARK in html:
        print('  already applied  ' + CITY)
        return
    for name, anchor, _rep in STEPS:
        if html.count(anchor) != 1:
            sys.exit('FAILED: %s resolves %d times in %s, expected 1.'
                     % (name, html.count(anchor), CITY))
    for _name, anchor, rep in STEPS:
        html = html.replace(anchor, rep, 1)
    open(CITY, 'w', encoding='utf-8').write(html)
    print('  patched  ' + CITY + '  [what you wear says what you do]')


if __name__ == '__main__':
    main()
