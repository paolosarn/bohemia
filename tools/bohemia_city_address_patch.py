#!/usr/bin/env python3
"""BOHEMIA CITY ADDRESS (8/26/26, PEOPLE lane) -- the day's job happens in ONE
place, with ONE person, and the game tells you which way it is.

MEASURED ON THE WALKED CITY BEFORE A LINE OF THIS WAS WRITTEN, counting outward
from the block the player actually wakes up on (a block is 384 m):
    within 3 blocks     23 people, and ZERO of them run with anybody
    nearest TRADES       5 blocks   (~1.9 km)
    nearest NETWORK      6 blocks   (~2.3 km)
    the TRADES base      7 blocks   (~2.7 km)
    of 115 people swept out to 6 blocks, 6 are affiliated (5.2%)
Day one's quest demands `faction=TRADES` for its one REQUIRED role. So the person
that quest is about stood a two-kilometre walk from the front door, in an unnamed
direction, and NOTHING ON SCREEN SAID SO. That is Paolo's dispatch item 2 as a
number: "THE QUESTS ARE SO BAD AND NOT WIRED TO ANY LOCATIONS OR PEOPLE IN THE
CITY", and his own line under it, "A QUEST THAT IS NOT ATTACHED TO A PLACE AND A
PERSON IS NOT A QUEST."

AND THE FIRST CUT OF CASTING MADE IT WORSE WITHOUT EVER LOOKING WRONG. It cast
against whatever block you were standing on, so "the fixer" was a DIFFERENT
PERSON ON EVERY BLOCK and the row said so honestly: "on this block, that is
them." A quest whose cast changes when you cross the street is not a quest, it is
a mood. That row was true and the thing it described was not a story.

WHAT THIS DOES:
  1. AT DAY OPEN, the quest is cast ONCE. BohemiaPeople.castNear rings outward
     from the waking block and takes the nearest block that can fill every
     REQUIRED role. Nothing is relaxed to force a hit: no block in range means
     NULL, and null still means the outfit is not here rather than a stranger
     being handed an insider's part.
  2. THE CAST IS THE DAY'S, not the block's. THE JOB row and the conversation
     now appear on exactly ONE person in the whole valley.
  3. IT RIDES THE SAVE, so closing the phone does not re-roll who the job is
     about.
  4. THE OBJECTIVE LINE CARRIES AN ADDRESS: "5 blocks south west, out by the
     workshops", recomputed as you walk.

AND IT IS WORDS, NOT AN ARROW, AND THAT IS A RESEARCHED DECISION. Morrowind put
directions in dialogue and no marker on the map, and the thing players remember
about it is the valley itself; the marker games trade that memory for
convenience, and the writing gets shorter to match ("once developers know players
can rely on markers, directions become shorter and environmental clues become
less important"). The half we take is the half that fits: a bearing, a rough
distance, and what the ground is called. Bohemia is a city whose phones do not
work. A compass that always knows where everybody is would be the strangest
object in it.

  python3 tools/bohemia_city_address_patch.py

Gate: gates/address_gate.js
"""
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARK = '__CITY_ADDRESS__'

# ---- 1. THE DAY CAST replaces the per-block cast -----------------------------
# The whole body the casting patch inserted is swapped: ctCast() stops asking
# "who fits here" and starts asking "am I where the job is".
OLD_CAST_HEAD = """var CT_CAST = null, CT_CAST_KEY = '';
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
}"""

NEW_CAST = """/* __CITY_ADDRESS__ -- THE DAY'S CAST, FOUND ONCE, IN ONE PLACE.
   MEASURED FROM THE WAKING BLOCK before this was written (a block is 384 m):
   23 people within 3 blocks and NOT ONE of them runs with anybody; the nearest
   TRADES is 5 blocks and the nearest NETWORK is 6, while day one's quest demands
   faction=TRADES. The person the quest was about was a two-kilometre walk away
   in an unnamed direction, and the row on the card said "on this block" because
   the cast was recomputed wherever you stood -- a different fixer on every
   block. A QUEST WHOSE CAST CHANGES WHEN YOU CROSS THE STREET IS NOT A QUEST.
   RADIUS IS BOUNDED AND THAT IS DELIBERATE. Ringing the whole 24x24-block valley
   would always find somebody and would sometimes put the day's work an hour's
   walk away; a bounded ring says "not near you" honestly instead. */
var CT_DAYCAST = null;               /* {q, day, cast:{role->{key, block, rings}}} */
var CT_DAYCAST_R = 3;                /* blocks to search AROUND EACH ROLE'S OWN GROUND */
function ctBlockOf(fx, fy){
  var nb = (typeof BohemiaPopulation !== 'undefined' && BohemiaPopulation.NB) || 1;
  var span = nb * FN;
  return [Math.floor(fx / span), Math.floor(fy / span)];
}
/* everyone who really lives on one block, keyed the way the caster wants them.
   pplPeople takes coordinates, so this asks about a block WITHOUT moving the
   player -- the alternative (teleporting hx,hy to sample) would be a probe that
   changes the thing it measures. */
function ctPeopleAt(bx, by){
  var list = [];
  try { list = pplPeople(bx, by) || []; } catch(_e){ return []; }
  var out = [];
  for (var i = 0; i < list.length; i++)
    out.push({ key: 'P:city:' + list[i].id, __p: list[i] });
  return out;
}
/* WHERE TO GO LOOKING FOR A ROLE: ITS OUTFIT'S OWN GROUND.
   MEASURED: 11 of the valley's 14 outfits have a real member within TWO BLOCKS
   of their own base, and searching outward from the PLAYER instead finds nobody
   at all -- 23 people within 3 blocks of the waking block and not one of them
   runs with anybody. A role with no outfit is looked for where you are, because
   a neighbour is a neighbour. */
function ctOriginFor(role){
  try {
    var want = BohemiaPeople.roleFaction(role);
    var s = ctSpawn() || [hx, hy];
    if (!want) return ctBlockOf(s[0], s[1]);
    var bases = ctBases(); if (!bases) return null;
    var nb = BohemiaPopulation.NB;
    for (var k in bases) {
      if (String(k).toUpperCase().replace(/[\\s_]/g,'') !== String(want).toUpperCase().replace(/[\\s_]/g,'')) continue;
      return [Math.floor(bases[k].x / nb), Math.floor(bases[k].y / nb)];
    }
    return null;                     /* an outfit with no ground has no address */
  } catch(_e){ return null; }
}
function ctDayCast(){
  try {
    if (typeof DQ === 'undefined' || !DQ || !DQ.Q || !DQ.Q.roles) return null;
    if (DQ.rt && DQ.rt.state && DQ.rt.state.done) return null;
    var qid = String(DQ.spec && DQ.spec.id), day = (T && T.day) || 1;
    if (CT_DAYCAST && CT_DAYCAST.q === qid && CT_DAYCAST.day === day) return CT_DAYCAST;
    var found = BohemiaPeople.castAddresses(DQ.Q.roles, {
      peopleAt: ctPeopleAt, originFor: ctOriginFor, radius: CT_DAYCAST_R,
      questId: (DQ.Q && DQ.Q.id) || '',
      factionOf: function(w){ return ctFactionOf(w.__p); } });
    var slim = {};
    for (var r in (found || {})) if (found.hasOwnProperty(r))
      slim[r] = { key: found[r].key, role: r, faction: found[r].faction,
                  traits: found[r].traits, block: found[r].block, rings: found[r].rings };
    CT_DAYCAST = { q: qid, day: day, cast: slim };
    return CT_DAYCAST;
  } catch(_e){ return null; }
}
/* WHICH PART THE QUEST IS READY FOR RIGHT NOW. The runtime already answers
   "which conversations can be started", so the HUD points at the person behind
   the next one rather than at a role picked by this file. */
function ctJobRole(){
  var d = ctDayCast(); if (!d || !d.cast) return null;
  try {
    var ids = DQ.rt.available() || [], by = {};
    (DQ.Q.talks || []).forEach(function(t){ by[t.id] = t; });
    for (var i = 0; i < ids.length; i++) {
      var t = by[ids[i]];
      if (t && t.speaker && d.cast[t.speaker]) return t.speaker;
    }
  } catch(_e){}
  /* no node is open yet: point at a REQUIRED part, in the quest's own order. */
  try {
    var rs = DQ.Q.roles || [];
    for (var j = 0; j < rs.length; j++)
      if (rs[j].req && d.cast[rs[j].name]) return rs[j].name;
  } catch(_e){}
  return null;
}
/* WHAT THE GROUND OUT THERE IS CALLED, off the overmap, never invented here. */
function ctGroundAt(block){
  try {
    var nb = BohemiaPopulation.NB;
    var t = om.at(block[0] * nb + ((nb / 2) | 0), block[1] * nb + ((nb / 2) | 0));
    return t ? t.district : null;
  } catch(_e){ return null; }
}
/* THE SENTENCE, FROM WHERE HE IS STANDING RIGHT NOW, TO WHOEVER IS NEXT. */
function ctAddress(){
  var d = ctDayCast(); if (!d || !d.cast) return null;
  var role = ctJobRole(); if (!role) return null;
  var c = d.cast[role]; if (!c || !c.block) return null;
  return BohemiaPeople.addressLine(ctBlockOf(hx, hy), c.block, ctGroundAt(c.block));
}
function ctOnJobBlock(){
  var d = ctDayCast(); if (!d || !d.cast) return false;
  var here = ctBlockOf(hx, hy);
  for (var r in d.cast) if (d.cast.hasOwnProperty(r)) {
    var b = d.cast[r].block;
    if (b && b[0] === here[0] && b[1] === here[1]) return true;
  }
  return false;
}
/* THE CAST, WHERE THE JOB IS AND NOWHERE ELSE. The old body cast against
   whoever stood on the block under your feet and cached on that block; it is
   gone rather than kept beside this, because two ideas of who the quest is about
   is exactly the bug this replaces.
   ONLY THE PARTS WHOSE GROUND THIS IS: on TRADES ground the card knows about the
   lineman and nothing else, which is the whole point of a quest having more than
   one address. */
function ctCast(){
  try {
    if (typeof DQ === 'undefined' || !DQ || !DQ.Q || !DQ.Q.roles) return null;
    if (DQ.rt && DQ.rt.state && DQ.rt.state.done) return null;
    var d = ctDayCast(); if (!d || !d.cast) return null;
    var here = ctBlockOf(hx, hy), out = null;
    for (var r in d.cast) if (d.cast.hasOwnProperty(r)) {
      var b = d.cast[r].block;
      if (!b || b[0] !== here[0] || b[1] !== here[1]) continue;
      (out || (out = {}))[r] = d.cast[r];
    }
    return out;
  } catch(_e){ return null; }
}"""

# ---- 2. the row stops saying "on this block" ---------------------------------
OLD_ROW = """      var title = (DQ.Q && DQ.Q.title) || 'the job';
      return title + ' wants the ' + String(name).replace(/_/g, ' ')
             + '. On this block, that is them.';"""
NEW_ROW = """      var title = (DQ.Q && DQ.Q.title) || 'the job';
      /* __CITY_ADDRESS__ -- IT USED TO SAY "on this block, that is them", and
         that was the honest sentence for a cast that was recomputed wherever you
         happened to stand. The cast is the DAY'S now: one person, one block, all
         day. So the sentence stops hedging. draft:true. */
      return title + ' wants the ' + String(name).replace(/_/g, ' ')
             + '. That is them.';"""

# ---- 3. the objective line carries the address -------------------------------
OLD_QLINE = """function updQline(){
  const el=document.getElementById('qline'); if(!el)return;
  el.textContent=DQ.hudLine()||'';
}"""
NEW_QLINE = """function updQline(){
  const el=document.getElementById('qline'); if(!el)return;
  let s=DQ.hudLine()||'';
  /* __CITY_ADDRESS__ -- AND WHICH WAY IT IS. Composed HERE and not in
     DQ.hudLine(), because where somebody is standing is the city's fact and the
     day-loop module has no business learning a second idea of the map.
     WORDS, NOT AN ARROW, and that is researched rather than preferred: the games
     that put a marker on it trade the player's memory of the place for the
     convenience, and their directions get shorter to match. This is a bearing, a
     rough distance and what the ground is called. Recomputed every time the line
     is drawn, so it counts down as he walks. */
  try {
    if (s && !(DQ.rt && DQ.rt.state && DQ.rt.state.done)) {
      const a = ctAddress();
      if (a) s += ' \\u00b7 ' + a;
    }
  } catch(_e){}
  el.textContent=s;
}"""

# ---- 4. it rides the save ----------------------------------------------------
OLD_SAVE = """    loop:DAY.serialize(),quest:DQ.serialize(),      /* __DAY_LOOP__ */"""
NEW_SAVE = """    loop:DAY.serialize(),quest:DQ.serialize(),      /* __DAY_LOOP__ */
    daycast:(function(){ try{ return ctDayCast(); }catch(_e){ return null; } })(),  /* __CITY_ADDRESS__ */"""

# ---- 5. and the distance counts down as he walks -----------------------------
OLD_TICK = """let _lastDistrict=null;
function dayDistrictCheck(){
  const d=dayWhere();
  if(!d||d===_lastDistrict)return;
  _lastDistrict=d;"""
NEW_TICK = """let _lastDistrict=null;
/* __CITY_ADDRESS__ -- THE NUMBER HAS TO COME DOWN OR IT IS NOT A DIRECTION.
   updQline() only ran when the QUEST moved, so an address written at day open
   would have said "5 blocks south west" for the whole walk, including while
   standing on top of the man. This is the one hook that already runs on
   movement and already refuses to do work unless something changed, so the
   countdown costs one string compare per block crossed and nothing per frame. */
let _lastJobBlock='';
function dayAddressTick(){
  try{
    var b=ctBlockOf(hx,hy), k=b[0]+','+b[1];
    if(k===_lastJobBlock) return;
    _lastJobBlock=k; updQline();
  }catch(_e){}
}
function dayDistrictCheck(){
  dayAddressTick();
  const d=dayWhere();
  if(!d||d===_lastDistrict)return;
  _lastDistrict=d;"""

OLD_RESTORE = """    if(st.quest)DQ.restore(st.quest,DAY.day); else DQ.openDay(DAY.day);
    try{ updQline(); }catch(_e){}"""
NEW_RESTORE = """    if(st.quest)DQ.restore(st.quest,DAY.day); else DQ.openDay(DAY.day);
    /* __CITY_ADDRESS__ -- WHO THE JOB IS ABOUT SURVIVES A RELOAD. Restored
       BEFORE the line is drawn, and only for the same quest on the same day, so
       a saved cast can never be handed to tomorrow's quest. Without this the
       ring search runs again on load and can land on a different block as the
       roster caches rebuild -- the person you walked an hour toward becomes
       somebody else because you closed the tab. */
    try{ if(st.daycast && st.daycast.q === String(DQ.spec&&DQ.spec.id)
             && st.daycast.day === DAY.day) CT_DAYCAST = st.daycast; }catch(_e){}
    try{ updQline(); }catch(_e){}"""


def main():
    html = open(CITY, encoding='utf-8').read()
    if MARK in html:
        print('  already applied  ' + CITY)
        return
    steps = [('ctCast', OLD_CAST_HEAD, NEW_CAST),
             ('the THE JOB sentence', OLD_ROW, NEW_ROW),
             ('updQline', OLD_QLINE, NEW_QLINE),
             ('the city snapshot', OLD_SAVE, NEW_SAVE),
             ('the city restore', OLD_RESTORE, NEW_RESTORE),
             ('the movement tick', OLD_TICK, NEW_TICK)]
    for name, anchor, _rep in steps:
        if html.count(anchor) != 1:
            sys.exit('FAILED: %s resolves %d times in %s, expected 1.'
                     % (name, html.count(anchor), CITY))
    for _name, anchor, rep in steps:
        html = html.replace(anchor, rep, 1)
    open(CITY, 'w', encoding='utf-8').write(html)
    print('  patched  ' + CITY + '  (one job, one block, and which way it is)')


if __name__ == '__main__':
    main()
