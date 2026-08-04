#!/usr/bin/env python3
"""
NO CANOPIES GATE (8/2/26, WORLD lane).

    "New rule no more canopies I only see canopies at parks and shit. What's wrong with
     you?"                                                          -- Paolo, 8/2/26

He had already told me once, that same day, that the canopies were "trying so hard to have
some shade shit", and I answered by making them SMALLER instead of removing them. That is
the failure the STOP PRODUCING law calls out by name: finding a legal way to keep shipping
the rejected thing. The second note is not a refinement of the first, it is a RULING, and a
ruling is not a design conversation.

THE LAW
    A CANOPY IS A PARK THING. No shelter-canopy outside a park.
    Where a canopy stood, the building gets what a real entrance has instead: STEPS, PIERS,
    a porch cut into the mass, a recessed doorway. Shade is not the point of a doorway.

WHAT COUNTS, AND WHAT DOES NOT, and this distinction is the whole gate:
    A CANOPY is a roof you stand under that is not part of a building's own volume --
    an entry canopy, a boarding canopy, a fuel canopy, a stall tent, a carport.
    A SPAN is a piece of infrastructure that carries something ACROSS a gap -- a skybridge,
    a freeway overpass deck, a sign gantry, a jet bridge, a substation busbar. Those are not
    shade and nobody built them to stand under. They are named below and they stay.

THE RATCHET. Every shelter canopy still standing in the valley is listed in CANOPY_DEBT.
The list may only SHRINK. Nothing new joins it, and a district drops off it the moment its
canopy is gone. Districts he has already APPROVED are on it and are NOT to be reopened for
this (8/1: "approved for now" is an approval) -- they come off when they are next touched
for another reason.

  python3 gates/no_canopies_gate.py
"""
import json
import os
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(ROOT)

PASS = FAIL = 0
def ok(n, c):
    global PASS, FAIL
    if c:
        PASS += 1
    else:
        FAIL += 1
        print('  FAIL: ' + n)


# A SPAN carries something across a gap. It is not shade and nobody stands under it to get
# out of the sun. These are infrastructure and they are not what he ruled on.
SPANS = {
    ('downtown', 'skybridge'), ('freeway', 'overpass deck'), ('freeway', 'sign gantry'),
    ('interchange', 'deck'), ('interchange', 'sign gantry'), ('airport', 'jet bridge'),
    ('airbase', 'jet bridge'), ('substation', 'busbar / conductor'),
}

# SHELTER CANOPIES still standing. RATCHET: this list may only shrink, and nothing new
# joins it. The approved districts on it are not to be reopened for this alone.
CANOPY_DEBT = {
    # APPROVED districts (8/1, 85%) -- on the list, NOT to be reopened for this alone
    ('commercial', 'awning (red)'), ('commercial', 'awning (teal)'),
    ('commercial', 'awning (gold)'), ('commercial', 'fuel canopy'),
    ('downtown', 'storefront awning'), ('downtown', 'blade sign'),
    # unjudged districts -- these come off as each is next rebuilt
    ('town', 'fuel canopy'),
    ('swapmeet', 'stall canopy / tent'),
    ('swapmeet', 'stall canopy / tent (red)'),
    ('swapmeet', 'stall canopy / tent (teal)'),
    ('truckstop', 'fuel canopy roof'),
    ('medical', 'canopy'),
    ('trailer', 'carport'),
    ('apartment', 'carport'),
}

# PARK is where a canopy belongs, and it may have as many as it likes.
FREE = {'park'}

js = """
const K = require('./engine/bohemia_district_kit.js');
require('./engine/bohemia_world.js');
const out = [];
for (const t of K.types()) {
  const sp = K.get(t); if (!sp || !sp.legend) continue;
  for (const c of Object.keys(sp.legend)) {
    const e = sp.legend[c];
    if (K.tileLayer(e).layer === 'overhead') out.push([t, e.name]);
  }
}
process.stdout.write(JSON.stringify(out));
"""
r = subprocess.run(['node', '-e', js], capture_output=True, text=True)
if r.returncode != 0:
    print('  FAIL: could not read the district registry (%s)' % r.stderr.strip()[:160])
    print('NO CANOPIES GATE: 0 passed, 1 failed')
    sys.exit(1)

overheads = [tuple(x) for x in json.loads(r.stdout)]
ok('the district registry is readable (%d overhead tiles in the valley)' % len(overheads),
   len(overheads) > 0)

unaccounted = [o for o in overheads
               if o not in SPANS and o not in CANOPY_DEBT and o[0] not in FREE]
ok('NO NEW CANOPY: every overhead tile in the valley is either a SPAN (a skybridge, a deck, '
   'a gantry, a jet bridge — infrastructure that carries something across a gap, not shade), '
   'a PARK canopy, or a named debt. A canopy is a park thing (Paolo 8/2)%s'
   % (('  -- unaccounted: ' + '; '.join('%s/%s' % o for o in unaccounted[:8]))
      if unaccounted else ''), not unaccounted)

stale = sorted(CANOPY_DEBT - set(overheads))
ok('THE CANOPY DEBT ONLY SHRINKS: nothing is still listed that has already come down%s'
   % (('  -- stale: ' + '; '.join('%s/%s' % o for o in stale[:8])) if stale else ''),
   not stale)

# the four he was looking at when he made the rule: they carry NOTHING overhead
CLEARED = ('cityhall', 'courthouse', 'terminal', 'chapel')
still = sorted({o[0] for o in overheads} & set(CLEARED))
ok('THE FOUR HE WAS LOOKING AT CARRY NOTHING OVERHEAD — city hall, courthouse, terminal and '
   'chapel. He said it twice; the first time I made the canopies SMALLER, which is the '
   'STOP PRODUCING failure (finding a legal way to ship the rejected thing) and not an '
   'answer%s' % (('  -- still overhead: ' + ', '.join(still)) if still else ''), not still)

LAW = 'laws/BOHEMIA_ADDENDUM_NO_CANOPIES_8_2_26.md'
ok('the law is filed with his words in it', os.path.exists(LAW)
   and 'no more canopies' in open(LAW, encoding='utf8').read())

print('  CANOPY DEBT: %d declared, %d shelter canopies still standing (parks exempt)'
      % (len(CANOPY_DEBT), len([o for o in overheads if o in CANOPY_DEBT])))
print('NO CANOPIES GATE: %d passed, %d failed' % (PASS, FAIL))
sys.exit(1 if FAIL else 0)
