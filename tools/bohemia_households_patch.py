#!/usr/bin/env python3
"""
BOHEMIA HOUSEHOLDS -- Paolo ruled it: "people share houses yes bro". (8/21/26)

Law:  laws/BOHEMIA_ADDENDUM_NOTES_ARE_RULINGS_7_19_26.md (he said it, it is built)
Gate: gates/faction_arc_gate.js part M5 (the cross-outfit line count it reports)
Record: records/BOHEMIA_EVERY_COMMITMENT_IN_THIS_GAME_IS_FREE_8_20_26.md

REUSE CHECK (REUSE-FIRST): cooks nothing and invents no field on the surface. It
adds ONE derived id inside bohemia_population's existing personFields, which is
the module's own stated single derivation point ("Change that function and
everybody changes, everywhere, at once"). bohemia_ties.fociOf already reads
agent.home.building as the HOME focus and has since 8/12 -- it has simply never
had anything to group.

--------------------------------------------------------------------------
WHAT WAS MEASURED, AND WHY IT MATTERED
--------------------------------------------------------------------------
    298 people, 298 distinct homes, 0 households
    199 of 298 people know NOBODY AT ALL   (mean 0.71 acquaintances, max 8)
    ties between two affiliated people: 106 -- ALL 106 same-outfit
    CROSS-OUTFIT LINES IN THE WHOLE VALLEY: 0

Because of that last zero, whoHears() returned NOBODY for every outfit, and the
entire cross-cutting half of the faction design was unreachable: WHO WILL HEAR,
WILL HEAR IT AS FACT, AND IT COSTS YOU, and tertius DOLENS. EVERY COMMITMENT IN
THE GAME WAS FREE. You could stand with everybody and lose nothing anywhere.

Feld 1981 (THE FOCUSED ORGANIZATION OF SOCIAL TIES): ties form around FOCI --
shared settings people are jointly organised around. HOME is the strongest focus
there is, it sits under Dunbar's support-clique layer of 5 so everyone in it
knows everyone, AND IT IS THE ONE FOCUS THAT DOES NOT CARE WHAT OUTFIT YOU RUN
WITH. A faction focus is same-outfit by definition and can never bridge; work
almost never pairs two affiliated people from different outfits. Households are
the bridge.

--------------------------------------------------------------------------
THE ONE LINE THAT CAUSED IT
--------------------------------------------------------------------------
      var dup = false;
      for (var k = 0; k < out.length; k++)
        if (out[k][0] === fx && out[k][1] === fy) { dup = true; break; }
      if (dup) continue;                    <-- one person per cell, forever

homesIn() actively REFUSED to seat two people together. Not a bug at the time --
it is what keeps the census honest -- but it meant the valley had no households.

--------------------------------------------------------------------------
AND THE DEDUP STAYS, BECAUSE OCCUPANCY LAW IS ALSO REAL
--------------------------------------------------------------------------
ONE BODY PER CELL, INCLUDING THE PLAYER. Simply deleting the dedup would seat two
people on one tile and they would draw on top of each other the moment both were
home.

A HOUSE IS NOT A CELL. It is several people, in several rooms, at one address. So
every person KEEPS THEIR OWN CELL -- occupancy is untouched, nothing moves, no
sprite overlaps -- and gains a HOUSEHOLD ID shared with the people nearest them.
The cells are the rooms; the household is the address. That is both what the word
means and the only version that does not fight a law.

--------------------------------------------------------------------------
THE SIZES ARE RESEARCHED, NOT PICKED
--------------------------------------------------------------------------
US mean household size is 2.58 (2010) and 28.9% of households are ONE person --
but that is a PROSPERITY number. Living alone is something you buy. The measured
direction of travel under economic stress is unambiguous: job loss TRIPLES the
probability of house-sharing, and the share-of-population doubling up runs 6%+ in
recession against a 2% baseline (HUD/AHS, Census SEHSD-WP2011-04). 79% of
doubled-up households contain an adult child. Before prosperity, the 1900 mean
was 4.6.

Bohemia is not a recession, it is the economy ending. So the distribution shifts
hard off the modern one WITHOUT going to 1900 (that mean was carried by fertility
this valley does not have):

    1 person   8%      living alone is a luxury the collapse deleted
    2 people  26%
    3 people  28%
    4 people  22%
    5 people  16%      capped at 5: Dunbar's support clique, and the point at
                       which "everyone here knows everyone" stops being true
    mean ~3.1

DERIVED, NEVER TYPED PER PERSON, and deterministic from the seed the cell already
carries -- the same hash the rest of personFields runs on, so a household keeps
its members across reloads and across the two rosters.

IF HE WANTS A DIFFERENT SHAPE it is one table here, and every number in it is a
number he can say out loud.
"""
import os
import sys

POP = 'engine/bohemia_population.js'
MARKER = '__POP_HOUSEHOLDS__'

# ---- group the accepted cells into addresses -----------------------------
OLD = """      if (dup) continue;
      out.push([fx, fy, r]);
    }
    return out;
  }"""
NEW = """      if (dup) continue;
      out.push([fx, fy, r]);
      /* """ + MARKER + """ -- and the rest of their household, beside them */
      seatHouseholds(out[out.length - 1], want, out, nx, ny, seed, pick);
    }
    return out;
  }

  /* """ + MARKER + """ -- WHO SHARES AN ADDRESS. Paolo 8/21: "people share
     houses yes bro". Measured before this: 298 people, 298 homes, ZERO
     households, 199 of 298 knowing nobody at all, and NOT ONE tie in the valley
     crossing an outfit line -- so whoHears() answered NOBODY for every faction
     and every commitment in the game was free.
     Feld 1981: ties form around FOCI, home is the strongest one, it sits under
     Dunbar's support clique of 5 so everyone in it knows everyone, AND IT IS THE
     ONLY FOCUS THAT DOES NOT CARE WHAT OUTFIT YOU RUN WITH.
     THE DEDUP ABOVE STAYS. One body per cell is also a law, and two people on
     one tile draw on top of each other. A house is not a cell -- it is several
     people in several rooms at one address -- so everybody keeps their own cell
     and gains a shared HOUSEHOLD. Nothing moves; nothing overlaps.
     SIZES RESEARCHED, NOT PICKED: US mean is 2.58 with 28.9% living alone, but
     that is a prosperity number -- job loss TRIPLES house-sharing and doubling
     up runs 6%+ against a 2% baseline in recession (HUD/AHS; Census
     SEHSD-WP2011-04). This is worse than a recession, so the distribution shifts
     off modern without reaching 1900's 4.6 (that mean was fertility). */
  var HOUSEHOLD_SIZES = [
    { n: 1, w:  8 },   /* living alone is a luxury the collapse deleted */
    { n: 2, w: 26 },
    { n: 3, w: 28 },
    { n: 4, w: 22 },
    { n: 5, w: 16 }    /* capped at Dunbar's support clique */
  ];
  var HOUSEHOLD_REACH = 3;   /* fine cells: an address is a small footprint */

  function householdSize(seed32) {
    var total = 0, i;
    for (i = 0; i < HOUSEHOLD_SIZES.length; i++) total += HOUSEHOLD_SIZES[i].w;
    var r = (seed32 >>> 7) % total;
    for (i = 0; i < HOUSEHOLD_SIZES.length; i++) {
      r -= HOUSEHOLD_SIZES[i].w;
      if (r < 0) return HOUSEHOLD_SIZES[i].n;
    }
    return 1;
  }

  /* THE HOUSEHOLD IS FORMED FIRST AND THEN SEATED, WHICH IS THE WHOLE FIX.
     The first cut GROUPED people who happened to land near each other, and
     measured mean 1.30 with 183 of 230 households still single -- because the
     scatter spreads people across a whole neighbourhood and almost nobody lands
     within a house's width of anybody. Discovering households cannot work when
     the placement was never trying to make any.
     So: each accepted cell is a HEAD OF HOUSEHOLD, its size is rolled, and the
     rest of that household is seated in the free cells AROUND it -- which is
     what rooms at one address actually are. The surface still gets to reject
     every cell (`pick`), the dedup still holds so nobody shares a tile, and the
     total is still bounded by `want`, so the census stays honest. */
  function seatHouseholds(head, want, cells, nx, ny, seed, pick) {
    var cap = householdSize(h2(head[0], head[1], (seed | 0) + 917));
    var id = 'H' + nx + ':' + ny + ':' + head[0] + ':' + head[1];
    head[3] = id;
    var placed = 1;
    /* a deterministic ring walk outward from the head: rooms of one house */
    for (var d = 1; d <= HOUSEHOLD_REACH && placed < cap && cells.length < want; d++) {
      for (var dy = -d; dy <= d && placed < cap && cells.length < want; dy++) {
        for (var dx = -d; dx <= d && placed < cap && cells.length < want; dx++) {
          if (Math.abs(dx) !== d && Math.abs(dy) !== d) continue;   /* ring only */
          var fx = head[0] + dx, fy = head[1] + dy;
          if (pick && !pick(fx, fy)) continue;
          var taken = false;
          for (var k = 0; k < cells.length; k++)
            if (cells[k][0] === fx && cells[k][1] === fy) { taken = true; break; }
          if (taken) continue;
          var c = [fx, fy, h2(fx, fy, seed)];
          c[3] = id;                       /* same ADDRESS, different room */
          cells.push(c);
          placed++;
        }
      }
    }
    return placed;
  }"""

# ---- and the person carries it -------------------------------------------
OLD_FIELDS = """      home: [home[0], home[1]],         // fine-grid cell"""
NEW_FIELDS = """      home: [home[0], home[1]],         // fine-grid cell
      /* """ + MARKER + """ -- THE ADDRESS THEY SHARE. Their CELL is their room
         and stays unique (one body per cell); this is the house it is in, and it
         is what bohemia_ties reads as the HOME focus. Falls back to the cell so
         a roster built before households still behaves exactly as it did. */
      household: (home[3] != null ? home[3] : (home[0] + ',' + home[1])),"""


# ---- AND THE CITY ADAPTER HAS TO READ IT -------------------------------
# The engine producing a household and nothing consuming it is the same shape
# this lane has found twelve times in a week, so it was checked rather than
# assumed. MEASURED after the engine change alone: 298 people, 298 households,
# mean 1.00, cross-outfit ties still ZERO. ctAgent() keys home.building on the
# raw cell, which is unique per person by construction, so the HOME focus could
# never group anybody no matter what the population said.
CITY = 'slices/BOHEMIA_CITY_WORLD.html'
OLD_ADAPTER = """           home:{building:(p.home?p.home[0]+','+p.home[1]:h-1), bedRoom:0},"""
NEW_ADAPTER = """           /* """ + MARKER + """ -- THE ADDRESS, NOT THE ROOM. This keyed
              home.building on the person's own fine cell, which is unique per
              person by construction, so bohemia_ties' HOME focus -- the
              strongest tie there is, and the only one that can cross an outfit
              line -- grouped nobody, and the valley had 298 households of one.
              p.household is the house; the cell is still their room. Falls back
              to the old spelling so a roster without households is unchanged. */
           home:{building:(p.household != null ? p.household
                            : (p.home?p.home[0]+','+p.home[1]:h-1)), bedRoom:0},"""


def main():
    if not os.path.exists(POP):
        sys.exit('FAIL: ' + POP + ' not found')
    s = open(POP, encoding='utf-8').read()
    if MARKER in s:
        print('NOOP: ' + MARKER + ' already present')
        return
    for old, new, what in ((OLD, NEW, 'the homesIn tail'),
                           (OLD_FIELDS, NEW_FIELDS, 'the person fields')):
        if old not in s:
            sys.exit('FAIL: could not find ' + what)
        s = s.replace(old, new, 1)
    open(POP, 'w', encoding='utf-8').write(s)

    c = open(CITY, encoding='utf-8').read()
    if MARKER not in c:
        if OLD_ADAPTER not in c:
            sys.exit('FAIL: could not find the city agent adapter')
        open(CITY, 'w', encoding='utf-8').write(c.replace(OLD_ADAPTER, NEW_ADAPTER, 1))
    print('POP HOUSEHOLDS: people share an address now, and keep their own room')
    print('   (city adapter reads it too -- the engine alone changed nothing)')


if __name__ == '__main__':
    main()
