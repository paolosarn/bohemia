#!/usr/bin/env python3
"""
THE VALLEY HAS ANIMALS IN IT
(8/26/26, RUN lane. His words today, and PLAYTEST DISPATCH item 8, LOCKED 8/25.)

    "maybe I wanna fuck around and start putting, you know, dogs and and swarms
     of flies as, like, low tier, you know, biome level one enemies or something"

and from the dispatch, his complaint that started it:

    (5) the city is dead and DEAD IS NOT THE DEFAULT (a slider is not an answer)

*** THE RESEARCH ALREADY SAID THIS WAS THE CHEAPEST FIX FOR THE LOUDEST
COMPLAINT, AND NOBODY BUILT IT. *** records/BOHEMIA_RESEARCH_WHAT_LIVES_IN_A_
CITY_OF_CORPSES_8_25_26.md, delivered the same day he asked:

    the reason the city feels dead is not that we lack enemies. It is that we
    lack ANIMALS. Ravens on a roofline, rats at a bin, a coyote crossing the wash
    three blocks away and not caring about you -- none of those are combat and
    all of them are life. Tier 1 is mostly not an enemy system at all. It is set
    dressing that moves, and it is the cheapest fix on this list for the loudest
    complaint on his list.

=== WHAT SHIPS, AND WHAT DELIBERATELY DOES NOT ==============================

SHIPPED: FLIES, RATS, RAVENS. Every one of them is a small dark moving mark --
a fly swarm is specks orbiting a point, a rat is a dash at the foot of a wall, a
raven is a silhouette on a roofline. NONE OF THEM NEEDS A CHARACTER SPRITE, which
is why they can ship from this lane today without inventing creature art.

NOT SHIPPED, ON PURPOSE: THE DOG. He named dogs first and the research agrees
they are the headline ("somebody's pets, in a pack, ten years on ... the most
Bohemia enemy imaginable"), but a dog is a BODY and a body is character art. The
45 DEGREE ART LAW and REUSE-FIRST both say a lane does not invent creature pixels
because it is in a hurry. The slot is built and empty, the density table has its
row, and an ART REQUEST is filed. When the art lands it is one line.

*** THIS IS NOT AN ENEMY SYSTEM AND THAT IS THE RESEARCH'S POINT, NOT A DODGE. ***
He said "low tier enemies"; the ecology answer is that Tier 1 barely fights. These
do not attack, have no health, and cost nothing to walk past. NO DAMAGE BEFORE THE
DIAL is untouched. What they do is make a block look inhabited, and one of them
carries a real READ: a fly swarm means SOMETHING DIED HERE, which is information
the player can use before we ever build a corpse system.

=== HOW IT WORKS ============================================================

DETERMINISTIC, LIKE EVERYTHING ELSE IN THE VALLEY. Life is hashed from (seed,
cell), so the same block has the same animals every time you walk it and on every
device. A valley that reshuffles its rats when you turn around reads as noise --
the same argument the star field already makes in skyStars().

DENSITY IS BY PLACE, WHICH IS THE VALHEIM HALF OF HIS RULING. The table below is
keyed on the district the cell is in and ships with REAL NUMBERS as a first
attempt, tagged draft, because ALWAYS MAKE AN ATTEMPT (8/11) governs numbers I can
defend and DIALS he has not ruled stay dialable. Nothing here decides which
faction holds anything -- that is reserved and is not touched.

THEY MOVE ON THE BEAT. 120 BPM LAW: the drift, the hop and the wing-flick are all
phases of the same clock everything else in this game moves on, so a rat crossing
a doorway is on the beat with his own footsteps.

IT ONLY DRAWS WHAT IS ON SCREEN, and it is capped. His item 7 is PERFORMANCE and
a lane that answers "the city is dead" by making it stutter has answered nothing.
Window-culled like peoplePass, hard cap per frame, and the whole pass is skipped
at city zoom where a 2px mark is invisible anyway.

REUSE CHECK: banks/ holds no animal art and none was cooked -- these are
procedural marks (specks, a dash, a silhouette), drawn with the world's own
palette variables, not sprites. The one thing that WOULD need a bank, the dog,
is deliberately not built for exactly that reason and is filed as an art request.

WORDS: none -- nothing here says anything.

Idempotent (marker __THE_VALLEY_HAS_ANIMALS__).
"""
import os
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARK = '__THE_VALLEY_HAS_ANIMALS__'

ANCHOR = """function peoplePass(ox, oy, C) {"""

BLOCK = """/* ======================= """ + MARK + """ (8/26) =========================
   Paolo: "maybe I wanna fuck around and start putting dogs and swarms of flies as
   low tier biome level one enemies", and from the 8/25 dispatch, "the city is dead
   and DEAD IS NOT THE DEFAULT".
   THE RESEARCH DELIVERED THAT DAY ALREADY ANSWERED IT and nobody built it: "the
   reason the city feels dead is not that we lack enemies. It is that we lack
   ANIMALS ... Tier 1 is mostly not an enemy system at all. It is set dressing that
   moves, and it is the cheapest fix on this list for the loudest complaint."
   So these do not fight, have no health, and cost nothing to walk past. NO DAMAGE
   BEFORE THE DIAL is untouched. One of them carries a real READ: flies mean
   SOMETHING DIED HERE, which is information before we own a corpse system.
   THE DOG IS NOT HERE AND THAT IS DELIBERATE. He named it first and the research
   calls it the headline, but a dog is a BODY and a body is character art; a lane
   does not invent creature pixels because it is in a hurry (45 DEGREE ART LAW,
   REUSE-FIRST). Its row is below with count 0 and an art request is filed. */

/* HOW MANY LIVE ON A BLOCK LIKE THIS. [DIAL, draft:true] -- real first attempts I
   can defend from the ecology, not canon. DENSITY IS BY PLACE, which is the
   Valheim half of his ruling: difficulty and life live in THE GROUND, never in a
   level number on the player. Nothing here says who HOLDS the ground; that is
   reserved and is not touched. */
var ANIMAL_DENSITY = {
  /* flies want bodies and bins; rats want walls and food; ravens want a roofline
     and a reason. A default is given so a district nobody has tuned still breathes. */
  _default:    { flies: 0.06, rats: 0.05, ravens: 0.03, dogs: 0 },
  downtown:    { flies: 0.11, rats: 0.13, ravens: 0.07, dogs: 0 },
  commercial:  { flies: 0.10, rats: 0.11, ravens: 0.06, dogs: 0 },
  industrial:  { flies: 0.08, rats: 0.10, ravens: 0.05, dogs: 0 },
  suburb:      { flies: 0.04, rats: 0.04, ravens: 0.04, dogs: 0 },
  park:        { flies: 0.05, rats: 0.03, ravens: 0.08, dogs: 0 },
  wash:        { flies: 0.05, rats: 0.05, ravens: 0.05, dogs: 0 },  /* the coyote highway */
  desert:      { flies: 0.01, rats: 0.01, ravens: 0.02, dogs: 0 }
};
var ANIMAL_CAP = 90;            /* [DIAL, draft:true] per frame, his item 7 is PERFORMANCE */

/* DETERMINISTIC LIFE. Hashed from (seed, cell) so the same block holds the same
   animals every time it is walked and on every device -- a valley that reshuffles
   its rats when you turn around reads as noise, which is the same argument
   skyStars() already makes about the sky. */
function animalHash(x, y, salt) {
  var h = (x * 374761393 + y * 668265263 + (seed | 0) * 2246822519 + salt * 3266489917) >>> 0;
  h = (h ^ (h >>> 13)) >>> 0; h = (h * 1274126177) >>> 0;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
function animalKindAt(x, y) {
  var d = null;
  try { var t = om.at((x / FN) | 0, (y / FN) | 0); d = t ? t.district : null; } catch (_e) { }
  var tab = ANIMAL_DENSITY[d] || ANIMAL_DENSITY._default;
  var r = animalHash(x, y, 7);
  var a = tab.flies;
  if (r < a) return 'flies';
  a += tab.rats;   if (r < a) return 'rats';
  a += tab.ravens; if (r < a) return 'ravens';
  return null;
}

/* WHAT THEY ARE DRAWN AS. Procedural marks in the world's own palette, never
   sprites -- a fly swarm IS specks, a rat IS a dash, a raven IS a silhouette.
   Nothing is invented that would have needed a bank. */
function animalPass(ox, oy, C) {
  /* SKIPPED WHERE IT WOULD BE A LIE: at city zoom a 2px mark is not an animal,
     it is a dirty screen. And his item 7 is PERFORMANCE, so this pass simply does
     not exist up there. */
  if (typeof MODE === 'undefined' || MODE !== 'human' || C < 17) { window.__ANIMALS_DRAWN = 0; return 0; }
  var g = cv.getContext('2d');
  var t = (typeof performance !== 'undefined') ? performance.now() : 0;
  /* 120 BPM LAW: everything moves on the one clock, so a rat crossing a doorway is
     on the beat with his own footsteps. */
  var beat = t / 500;
  var x0 = Math.floor(-ox / C) - 1, x1 = Math.ceil((cv.width - ox) / C) + 1;
  var y0 = Math.floor(-oy / C) - 1, y1 = Math.ceil((cv.height - oy) / C) + 1;
  var drawn = 0, kinds = { flies: 0, rats: 0, ravens: 0 };
  g.save();
  for (var y = y0; y <= y1; y++) {
    for (var x = x0; x <= x1; x++) {
      if (drawn >= ANIMAL_CAP) break;
      var kind = animalKindAt(x, y);
      if (!kind) continue;
      var c = null; try { c = cellAt(x, y); } catch (_e) { continue; }
      if (!c) continue;
      var sx = ox + x * C, sy = oy + y * C;
      var ph = animalHash(x, y, 31) * 6.283;
      if (kind === 'flies') {
        /* A SWARM OVER SOMETHING. Flies want a body or a bin, so they sit over a
           cell you can WALK ON -- the thing they are on is at your feet. */
        if (!c.walk) continue;
        g.fillStyle = '#0b0906'; g.globalAlpha = 0.72;
        var n = 5 + ((animalHash(x, y, 5) * 4) | 0);
        for (var i = 0; i < n; i++) {
          var a = beat * (1.6 + i * 0.21) + ph + i * 1.7;
          var rr = C * (0.10 + 0.05 * Math.sin(beat * 0.9 + i));
          var fx = sx + C / 2 + Math.cos(a) * rr;
          var fy = sy + C * 0.42 + Math.sin(a * 1.3) * rr * 0.6;
          g.fillRect(Math.round(fx), Math.round(fy), Math.max(1, (C / 44) | 0) || 1,
                                                      Math.max(1, (C / 44) | 0) || 1);
        }
        kinds.flies++;
      } else if (kind === 'rats') {
        /* AT THE FOOT OF A WALL, which is where a rat actually runs. It needs
           something solid beside it or it is a rat standing in a road. */
        if (!c.walk) continue;
        var wall = null; try { wall = cellAt(x, y + 1); } catch (_e2) { }
        if (!(wall && !wall.walk)) continue;
        var run = (beat * 0.5 + ph) % 6.283;
        if (run > 2.4) continue;                      /* mostly they are not out */
        var rx = sx + C * (0.15 + (run / 2.4) * 0.7);
        var ry = sy + C * 0.86;
        g.globalAlpha = 0.85; g.fillStyle = '#1a150f';
        g.fillRect(Math.round(rx), Math.round(ry), Math.max(2, (C / 14) | 0), Math.max(1, (C / 22) | 0));
        kinds.rats++;
      } else {
        /* A SILHOUETTE ON A ROOFLINE. A raven needs a roof, so it wants a solid
           cell -- and it flicks rather than walks, which is what they do. */
        if (c.walk) continue;
        var flick = Math.sin(beat * 1.1 + ph) > 0.86 ? 1 : 0;
        var bx = sx + C * 0.42, by = sy - C * 0.12 - flick * Math.max(1, (C / 22) | 0);
        g.globalAlpha = 0.9; g.fillStyle = '#100d09';
        var s = Math.max(2, (C / 12) | 0);
        g.fillRect(Math.round(bx), Math.round(by), s, s);
        g.fillRect(Math.round(bx - s * 0.6), Math.round(by + s * 0.25), Math.max(1, (s * 0.6) | 0), Math.max(1, (s * 0.4) | 0));
        kinds.ravens++;
      }
      drawn++;
    }
  }
  g.restore(); g.globalAlpha = 1;
  window.__ANIMALS_DRAWN = drawn;
  window.__ANIMALS_BY_KIND = kinds;
  return drawn;
}

function peoplePass(ox, oy, C) {"""

CALL_OLD = """  window.__PPL_OUT = out;"""
CALL_NEW = """  window.__PPL_OUT = out;
  /* """ + MARK + """: the valley is not empty. Drawn after the people and before
     the facades, so a rat is in front of the road and behind the wall it runs
     along -- the same layering rule the 7/27 see-through pass works to. */
  try { animalPass(ox, oy, C); } catch (_e) { }"""


def main():
    if not os.path.exists(CITY):
        sys.exit('FAIL: ' + CITY + ' not found')
    s = open(CITY, encoding='utf8').read()
    if MARK in s:
        print('NOOP: the valley already has animals in it')
        return
    for needle, why in (('function peoplePass(', 'the pass these draw alongside'),
                        ('om.at(', 'the district a cell is in'),
                        ('function cellAt(', 'what is on the ground')):
        if needle not in s:
            sys.exit('FAIL: %s is missing (%s)' % (needle, why))
    for old, new, what in ((ANCHOR, BLOCK, 'the animal layer'),
                           (CALL_OLD, CALL_NEW, 'and the renderer draws it')):
        n = s.count(old)
        if n != 1:
            sys.exit('FAIL: anchor for "%s" matched %d times, expected 1' % (what, n))
        s = s.replace(old, new, 1)
    open(CITY, 'w', encoding='utf8').write(s)
    print('PATCHED %s -- flies, rats and ravens. The dog slot is built and empty.' % CITY)


if __name__ == '__main__':
    main()
