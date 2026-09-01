#!/usr/bin/env python3
"""BOHEMIA THE APPROVED ENCOUNTERS FINALLY FIRE ON FOOT (8/31/26, PEOPLE lane).
Backlog row ALIVE-3. Follows ALIVE-2 (the packs, 8/30).

*** HE APPROVED TWELVE STREET ENCOUNTERS ON 7/26 WITH A PLAIN "Approve all" AND
NOT ONE OF THEM HAS EVER FIRED FOR A PLAYER ON FOOT. *** engine/bohemia_encounters.js
holds them. The director that owns them is built by roadDirector() and pulled by
roadInterrupt(), and roadInterrupt is called from EXACTLY ONE PLACE: stepOnce's
`MODE==='city'` branch, which is overmap travel at ten minutes a cell. Every
reference was checked. The walked surface -- the surface he actually plays --
has never called it.

That is approved material that never reached the player, which is the same shape
as the seventeen invisible hats, the four bright garments nobody wore, and the
face maker with no route into it. Third time this month, and this one is the
biggest: it is his OWN APPROVED CONTENT.

*** AND ITEM ONE IS `feral_dog_pack` AND ITEM TWO IS `coyote_shadow`. *** Which
are the two animals ALIVE-2 shipped yesterday. So this is not "add encounters":
it is ENGINE SYNC AT THE DESIGN LEVEL. If the director announced a dog pack
while this tier's dogs stood somewhere else, there would be two mechanisms that
both mean "dogs" -- exactly the mistake ONE ID ONE WHOLE PERSON was written
about, where two pickers made two different people out of one id.

SO THE DIRECTOR NEVER INVENTS AN ANIMAL. IT POINTS AT THE ONE THAT IS THERE.
The hook is `tableFor(district, phase)`, which is MINE and which the module asks
"what can happen here". So the table answers what can happen here RIGHT NOW:
`feral_dog_pack` is only offered while a dog pack is actually drawn on the glass,
and `coyote_shadow` only while a coyote is. When it fires, it hands the player
the pack that is standing in front of them, with its own nerve, its own den and
its own coats -- and the BACK OFF button already works on it.

AND WHERE ROAD_TABLE ALREADY HAS AN OPINION, THIS DEFERS TO IT. A road class the
road table already authored keeps its row rather than getting a second, quietly
different one. ONE OPINION PER PLACE.

NO GLOBAL SPAWNS EVER, which is the module's own rule and is kept: a district
with no row spawns nothing, and there is deliberately nothing to fall back on.

  python3 tools/bohemia_city_walk_encounters_patch.py

Gate: gates/walk_encounter_gate.js
"""
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARK = '__WALK_ENCOUNTERS__'

ANCHOR = """function roadDirector(){"""

NEW = r"""/* ==== __WALK_ENCOUNTERS__ : THE APPROVED TWELVE, ON FOOT ====================
   His 7/26 "Approve all" roster has never fired for anybody walking. It fires
   here now, and where it names an animal it points at the animal that is
   actually on the glass rather than inventing a second one.
   ========================================================================== */
var WALK_DIR = null, WALK_LOG = [], WALK_LAST = null;

/* WHAT CAN HAPPEN WHERE YOU CAN WALK. Only ids out of his approved roster; a
   district with no row spawns NOTHING, which is the module's own rule and the
   reason there is no global fallback. Road classes are deliberately absent:
   ROAD_TABLE already has an opinion about those and one place gets one opinion. */
var WALK_TABLE = {
  suburb:     { day:   ['coyote_shadow', 'ghost_robotaxi', 'feral_dog_pack', 'scavenger_shakedown'],
                night: ['ghost_robotaxi', 'feral_dog_pack', 'the_snatcher', 'crazed_wanderer', 'coyote_shadow'] },
  town:       { day:   ['ghost_robotaxi', 'scavenger_shakedown', 'feral_dog_pack'],
                night: ['ghost_robotaxi', 'the_snatcher', 'crazed_wanderer', 'feral_dog_pack'] },
  desert:     { day:   ['coyote_shadow', 'rattlesnake'],
                night: ['coyote_shadow', 'rattlesnake'] },
  park:       { day:   ['coyote_shadow', 'feral_dog_pack'],
                night: ['coyote_shadow', 'crazed_wanderer'] },
  downtown:   { day:   ['ghost_robotaxi', 'scavenger_shakedown', 'spotter_drone', 'casino_security_bot'],
                night: ['ghost_robotaxi', 'the_snatcher', 'spotter_drone', 'crazed_wanderer'] },
  industrial: { day:   ['ghost_robotaxi', 'feral_dog_pack', 'spotter_drone', 'casino_security_bot'],
                night: ['ghost_robotaxi', 'crazed_wanderer', 'the_snatcher', 'feral_dog_pack'] },
  commercial: { day:   ['ghost_robotaxi', 'scavenger_shakedown', 'spotter_drone'],
                night: ['ghost_robotaxi', 'the_snatcher', 'crazed_wanderer'] },
  gated:      { day:   ['spotter_drone', 'bounty_squad'],
                night: ['ghost_robotaxi', 'spotter_drone', 'the_snatcher'] },
  estate:     { day:   ['spotter_drone'],
                night: ['ghost_robotaxi', 'the_snatcher'] }
};

/* *** AND THE ROSTER'S OWN SHAPE IS WHY THAT CAR IS IN NINE ROWS. *** The mix is
   70% AMBIENT, and of his twelve approved encounters only THREE are ambient:
   coyote_shadow, ghost_robotaxi, and patrols_collide, which needs a seam. So off
   the road the coyote was the ONLY ambient beat in the game -- and because this
   table will not offer an animal that is not on the glass, a district with no
   coyote in it had no ambient token at all and went silent for seven beats in
   ten. The module is right to refuse a substitute (a forced fight standing in
   for an ambient beat breaks the promise 70/20/10 makes), so the fix is supply:
   a driverless car rolling through a dead suburb is his approved ghost_robotaxi
   doing exactly what it says, and it is in every row that has a street in it.
   WHERE an approved thing happens is mine to decide; a THIRTEENTH encounter
   would be his, and there is not one here. The thin ambient bench is written
   down as a finding rather than fixed by invention. */

/* IS THE ANIMAL ACTUALLY THERE? Reads PACK_DREW, which records only what landed
   inside the canvas -- never what was drawn into the cull margin. */
function walkAnimalHere(kind) {
  try {
    for (var i = 0; i < PACK_DREW.length; i++) if (PACK_DREW[i].kind === kind) return PACK_DREW[i];
  } catch (_e) {}
  return null;
}

function walkDirector() {
  if (WALK_DIR) return WALK_DIR;
  if (typeof BohemiaEncounters === 'undefined') return null;
  WALK_DIR = BohemiaEncounters.makeDirector({
    seed: (typeof seed !== 'undefined' ? seed : 0) ^ 0x5ea1,
    /* A token may come round again after an hour of WALKING. The road's own
       number is two hours of travel; walking spends about five seconds a cell,
       so an hour here is roughly seven hundred cells, which is a long way on
       foot. Mine, and the gate prints it. */
    repeatAfterS: 3600,
    tableFor: function (district, phase) {
      /* ONE OPINION PER PLACE: a road class keeps the row the road table already
         authored, rather than getting a second one that quietly disagrees. */
      var row = (typeof ROAD_TABLE !== 'undefined' && ROAD_TABLE[district])
                  ? ROAD_TABLE[district] : WALK_TABLE[district];
      if (!row) return null;                    /* NO GLOBAL SPAWNS EVER */
      var ids = row[phase] || null;
      if (!ids) return null;
      /* *** AND THE DIRECTOR NEVER INVENTS AN ANIMAL. *** The two animal tokens
         are offered only while that animal is actually drawn on the glass, so
         when one fires it hands the player the pack standing in front of them
         instead of announcing dogs that are somewhere else. That is ENGINE SYNC
         at the design level: two mechanisms that both mean "dogs" do not make
         variety, they make two different sets of dogs. */
      return ids.filter(function (id) {
        if (id === 'feral_dog_pack') return !!walkAnimalHere('dogs');
        if (id === 'coyote_shadow') return !!walkAnimalHere('coyotes');
        return true;
      });
    }
  });
  return WALK_DIR;
}

/* THE PULL. Called from the walked step with the seconds that step cost, which
   is the same clock everything else in this game spends. */
function walkInterrupt(spentSeconds) {
  var dir = walkDirector();
  if (!dir) return { fired: false, reason: 'NO_DIRECTOR' };
  var world = {
    district: (typeof dayWhere === 'function') ? dayWhere() : null,
    phase: (typeof isNight === 'function' && isNight()) ? 'night' : 'day',
    health: 1, heat: 0,
    can: function (need) { return (typeof roadCan === 'function') ? roadCan(need) : false; }
  };
  var got = dir.consider(world, spentSeconds);
  if (got && got.fired) {
    WALK_LOG.push(got);
    WALK_LAST = got;
    /* IT POINTS AT THE ONE THAT IS THERE. */
    if (got.id === 'feral_dog_pack') got.pack = walkAnimalHere('dogs');
    if (got.id === 'coyote_shadow') got.pack = walkAnimalHere('coyotes');
    try { walkSay(got); } catch (_e) {}
  }
  return got;
}

/* WHAT HE READS. Reuses the pack line rather than opening a card, because most
   of these are AMBIENT and a modal card for "a coyote is following you" turns
   set dressing into homework. draft:true on every word, per the 8/11 rule.
   Nobody in Bohemia is wise, so none of these is a lesson. */
var WALK_LINES = {
  feral_dog_pack:      'they get up when you get close.',            /* draft:true */
  coyote_shadow:       'it has been behind you a block.',            /* draft:true */
  rattlesnake:         'something moves in the gravel. not far.',    /* draft:true */
  scavenger_shakedown: 'somebody steps out. they want something.',   /* draft:true */
  the_snatcher:        'you hear it after it is already behind you.', /* draft:true */
  crazed_wanderer:     'he is talking. not to you.',                 /* draft:true */
  bounty_squad:        'three of them, and they are looking.',       /* draft:true */
  casino_security_bot: 'it still works. that is the problem.',       /* draft:true */
  spotter_drone:       'it holds over you, then moves on.',          /* draft:true */
  patrols_collide:     'two of theirs, and they found each other.',  /* draft:true */
  toll_crew:           'the road is closed and somebody owns it.',   /* draft:true */
  ghost_robotaxi:      'headlights. nobody in it.'                   /* draft:true */
};

function walkSay(got) {
  var l = document.getElementById('packline');
  if (!l) return;
  var txt = WALK_LINES[got.id];
  if (!txt) return;
  l.textContent = txt;
  l.style.display = 'block';
  try { PACK_SAID = 1; } catch (_e) {}
}

function roadDirector(){"""

CALL_ANCHOR = """      advance(0.084); /* __CITY_FACTIONS__ */ ctSawCell();        // time per CELL, distance-honest"""
CALL_NEW = """      advance(0.084); /* __CITY_FACTIONS__ */ ctSawCell();        // time per CELL, distance-honest
      /* __WALK_ENCOUNTERS__ -- FIVE SECONDS OF HIS DAY JUST WENT BY ON FOOT, and
         until today that bought nothing: his twelve approved encounters were
         wired to overmap travel only and had never once fired for somebody
         walking. 0.084 minutes is 5.04 seconds, the same clock the rest of this
         line spends, so this cannot double-charge him. */
      try { walkInterrupt(5.04); } catch(_e){}"""


def main():
    html = open(CITY, encoding='utf-8').read()
    if MARK in html:
        print('  already applied  ' + CITY)
        return
    steps = [('the road director', ANCHOR, NEW),
             ('the walked step', CALL_ANCHOR, CALL_NEW)]
    for name, anchor, _rep in steps:
        if html.count(anchor) != 1:
            sys.exit('FAILED: %s resolves %d times in %s, expected 1.'
                     % (name, html.count(anchor), CITY))
    for _name, anchor, rep in steps:
        html = html.replace(anchor, rep, 1)
    open(CITY, 'w', encoding='utf-8').write(html)
    print('  patched  ' + CITY + '  (the approved encounters fire on foot)')


if __name__ == '__main__':
    main()
