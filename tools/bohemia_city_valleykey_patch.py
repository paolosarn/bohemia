#!/usr/bin/env python3
"""
BOHEMIA CITY VALLEY-KEY PATCH -- 298 people in the valley shared 17 names.
(8/19/26, FACTIONS lane)

Law:  laws/BOHEMIA_ADDENDUM_TWO_HUNDRED_PEOPLE_SEVENTEEN_NAMES_8_19_26.md
Gate: gates/commitment_gate.js (part H, new)

REUSE CHECK (REUSE-FIRST): cooks nothing and adds no mechanism. whoHears and
tiesOf have BOTH accepted an `opts.keyOf` since the day they were written; this
supplies one. Nothing in engine/ changes.

--------------------------------------------------------------------------
WHAT WAS WRONG, AND EVERY GATE IN THIS LANE WAS GREEN OVER IT
--------------------------------------------------------------------------
ctValleyRoster walks every neighbourhood in a 96x96 valley and concatenates the
people. bohemia_population numbers people PER NEIGHBOURHOOD -- H1-1, H2-1, H6-1 --
so those names repeat in every single neighbourhood. Measured on the real page:

    298 people in the valley roster
     17 distinct ids
     16 of those ids are used by more than one person
     11 of them are used by people IN DIFFERENT OUTFITS
    "H1-1" alone covers ~140 people spanning Cartel, Caravans, Colorful,
    Network, Homeless, Reds, Trades, Volunteers and Remnants.

whoHears keys EVERYTHING on that id: `byKey[keyOf(a)] = a` keeps whichever
person came last, `seen[k]=true` marks one name as visited and silently skips
the other sixteen real people wearing it, and tiesOf buckets them together.

SO THE SOCIAL GRAPH OF THE VALLEY WAS LARGELY FICTION. The symptom that exposed
it: the card reported TRADES hearing about a Reds commitment through a FACTION
focus at one hop -- which is impossible, because a faction focus cannot bridge
two factions (their focus keys are F:REDS and F:TRADES, and they do not match).
The tie was real; the person on the end of it was not the person we looked up.

THE FOCI THEMSELVES WERE NEVER WRONG. home.building and j.site are real valley
coordinates (H:8,65:B4488,10798 / W:35,81), unique across the map. Only the KEYS
collided. That is why this is a four-line fix and not a redesign.

--------------------------------------------------------------------------
WHY NOTHING CAUGHT IT
--------------------------------------------------------------------------
Every claim about who-hears asserted SHAPE -- that somebody hears, that a rumour
lands further away than a fact, that the bridge is cross-cutting. All of those
are true of a graph built on colliding keys, because collisions ADD edges rather
than remove them: you get MORE people hearing, not fewer, so nothing ever looked
empty. NOBODY EVER ASKED WHETHER TWO PEOPLE WITH THE SAME NAME WERE THE SAME
PERSON. The gate now counts distinct keys against distinct people, which is the
one question a shape assertion structurally cannot ask.

--------------------------------------------------------------------------
THE FIX
--------------------------------------------------------------------------
Stamp each person with a valley-unique key at roster time (the neighbourhood is
already in scope: it is the loop variable) and hand it to whoHears through the
`keyOf` it has always accepted. `a.id` is NOT mutated -- ctAgent's objects are
read elsewhere and fociOf falls back to parsing `id` when a home seat is missing,
so rewriting it would change a second thing quietly. A new field, one reader.
"""
import os
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARKER = '__CITY_VALLEYKEY__'

# ---- stamp a valley-unique key at roster time -----------------------------
OLD_STAMP = """      a.__id = list[i].id;
      out.push(a);"""
NEW_STAMP = """      a.__id = list[i].id;
      /* """ + MARKER + """ -- 298 PEOPLE IN THIS VALLEY SHARED 17 NAMES.
         bohemia_population numbers people PER NEIGHBOURHOOD (H1-1, H2-1...), so
         every neighbourhood re-uses the same names and this roster concatenates
         all of them. whoHears keys byKey/seen/tiesOf on that id, so one "H1-1"
         stood in for ~140 real people across nine different outfits and the rest
         were silently skipped as already-visited. The neighbourhood is right
         here in the loop; prefixing it makes the name a name again.
         a.id is deliberately NOT touched: fociOf falls back to parsing it when a
         home seat is missing, and other readers hold these objects. */
      a.__vid = nx + ',' + ny + ':' + list[i].id;
      out.push(a);"""

# ---- one keyOf, and every caller uses it ---------------------------------
HELPERS_ANCHOR = 'function ctHearRows(body, fid){'
HELPERS = '''/* ''' + MARKER + ''' -- THE VALLEY-UNIQUE KEY, IN ONE PLACE.
   Falls back to a.id so a roster built by anything else still works, but on the
   valley roster this is what makes two people with the same name two people. */
function ctVKey(a){ return String((a && a.__vid) || (a && a.id)); }
''' + HELPERS_ANCHOR

# every whoHears call has to be told, or it keeps using the colliding default
OLD_HEAR = """  try { heard = BohemiaCommitment.whoHears(fid, ctValleyRoster(), ctCell(), {ties:BohemiaTies}); }
  catch(_e){ return body; }"""
NEW_HEAR = """  try { heard = BohemiaCommitment.whoHears(fid, ctValleyRoster(), ctCell(),
                  /* """ + MARKER + """ */ {ties:BohemiaTies, keyOf:ctVKey}); }
  catch(_e){ return body; }"""

OLD_COST = """    var heard = BohemiaCommitment.whoHears(fid, ctValleyRoster(), ctCell(), {ties:BohemiaTies});"""
NEW_COST = """    /* """ + MARKER + """ */
    var heard = BohemiaCommitment.whoHears(fid, ctValleyRoster(), ctCell(),
                  {ties:BohemiaTies, keyOf:ctVKey});"""


def main():
    if not os.path.exists(CITY):
        sys.exit('FAIL: ' + CITY + ' not found')
    s = open(CITY, encoding='utf-8').read()
    if MARKER in s:
        print('NOOP: ' + MARKER + ' already present')
        return
    for old, new, what in ((OLD_STAMP, NEW_STAMP, 'the roster stamp'),
                           (HELPERS_ANCHOR, HELPERS, 'the keyOf helper'),
                           (OLD_HEAR, NEW_HEAR, 'the card\'s whoHears call'),
                           (OLD_COST, NEW_COST, 'the cost\'s whoHears call')):
        if old not in s:
            sys.exit('FAIL: could not find ' + what)
        s = s.replace(old, new, 1)
    if 'whoHears(' in s:
        n = s.count('whoHears(')
        keyed = s.count('keyOf:ctVKey')
        # one definition inside the inlined engine module + the two call sites
        if keyed < 2:
            sys.exit('FAIL: %d whoHears call(s) but only %d keyed' % (n, keyed))
    open(CITY, 'w', encoding='utf-8').write(s)
    print('CITY VALLEYKEY: two people with the same name are two people again')


if __name__ == '__main__':
    main()
