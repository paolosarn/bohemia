#!/usr/bin/env python3
"""BOHEMIA THE VALLEY IS NOT EMPTY, IT IS INDOORS AND ROUND THE BACK
(8/28/26, PEOPLE lane). Backlog row ALIVE-1, the loudest complaint on his
8/25 playtest dispatch.

HIS WORDS: "I THINK I SAW ONE WATCH PERSON ON ACCIDENT ... THE CITY SEEMS DEAD
ASF AND I DONT LIKE THIS BEING THE DEFAULT I KNOW WE HAVE A SLIDER AND SHIT BUT
YEAH MAN."

MEASURED ON THE REAL DEMO BEFORE ANY OF THIS WAS WRITTEN. Thirty-two walks:
eight starting points around the spawn, four directions each, up to 800 steps
per walk, at 08:00, 13:00 and 18:00, counting every body the surface actually
blitted and excluding the one authored neighbour who is pinned to the spawn:

    dial  1 (what ships)     0 of 32 walks met a single stranger
    dial  8                  2 of 32
    dial 20                  6 of 32
    dial 28                  9 of 32
    frame cost, dial 1 -> 28     0.5 ms -> 0.7 ms

TWENTY-FIVE THOUSAND STEPS AT THE SHIPPED DEFAULT AND NOBODY IS THERE. And the
one body he did see is id 12:12:900, archetype WATCH. He said he saw one watch
person. It is the same body.

AND IT IS NOT THE THINGS IT LOOKED LIKE. Checked one at a time:
  - not the DRAW PATH: stand two cells from any resident and they are drawn,
    three or four at a time.
  - not the CENSUS: the dial scales it exactly, 1 / 9 / 21 / 29 per block.
  - not the HOUR: same result at 08:00, 13:00 and 18:00.
  - not the DRAW BUDGET: it is 24 per neighbourhood at dial 1 and the census
    at dial 1 is 1.
  - and not PERFORMANCE, which is the reason people usually give: 0.2 ms.

WHAT IT IS, IN ONE SENTENCE: PEOPLE ARE WHERE THEY LIVE, AND YOU WALK WHERE THE
ROADS ARE. pplOutSpot walks 4 to 10 cells from the doorstep in one fixed
compass direction and takes THE FIRST STANDABLE CELL it finds, which is
routinely the side of the house, the gap between two walls, or the back yard.
A person who "goes out" is standing behind their own building.

SO THIS CHANGES WHERE OUT IS, AND NOT WHOSE IT IS. The 7/31 address book is the
thing that made these people individuals -- "two people on identical schedules
walk opposite directions at the same hour, which is the whole of Ultima VII's
trick" -- so the DIRECTION stays theirs, untouched. What changes is that along
their own ray they now stop at the most OPEN cell rather than the first legal
one. Openness is counted, not guessed: how many of the 24 cells around a
candidate are walkable. A street scores high. A gap between two houses scores
low. Nobody is teleported, nobody shares a spot, and it is deterministic, so
the neighbour you saw yesterday is standing where you remember.

  python3 tools/bohemia_city_alive_patch.py

Gate: gates/alive_gate.js
"""
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARK = '__CITY_ALIVE__'

ANCHOR = """function pplSpotToward(p, dir, near, far, taken) {
  const d = PPL_DIRV[dir] || PPL_DIRV.S;
  for (let step = near; step <= far; step++) {
    const fx = p.home[0] + d[0] * step, fy = p.home[1] + d[1] * step;
    if (!pplStandable(fx, fy)) continue;
    if (taken && taken.has(fx + ',' + fy)) continue;
    return [fx, fy];
  }
  return null;
}"""

NEW = """/* __CITY_ALIVE__ -- HOW OPEN IS IT HERE. Counted, never guessed: of the 24
   cells around a candidate, how many can be walked on. A street or a forecourt
   scores near 24. The gap between two houses scores 3 or 4. This is the whole
   difference between a person who is OUT and a person who is out of sight.
   Cheap because it runs ONCE per person, when their spot is first chosen, and
   the answer is cached with them for the life of the block. */
function pplOpenness(fx, fy) {
  var n = 0;
  for (var dy = -2; dy <= 2; dy++) for (var dx = -2; dx <= 2; dx++) {
    if (!dx && !dy) continue;
    var c = cellAt(fx + dx, fy + dy);
    if (c && c.walk && !c.enter) n++;
  }
  return n;
}
function pplSpotToward(p, dir, near, far, taken) {
  const d = PPL_DIRV[dir] || PPL_DIRV.S;
  /* __CITY_ALIVE__ -- THE FIRST LEGAL CELL WAS THE WRONG CELL. It was routinely
     the side of the house: standable, legal, and behind the building from every
     angle a player ever walks. MEASURED before this changed: thirty-two walks of
     up to eight hundred steps met ZERO strangers at the shipped default.
     THE DIRECTION IS STILL THEIRS. The 7/31 address book is what made these
     people individuals ("two people on identical schedules walk opposite
     directions at the same hour, which is the whole of Ultima VII's trick"), so
     the ray is untouched and only the stopping point moves: the most open cell
     ALONG THEIR OWN RAY instead of the first one that is merely legal.
     TIES GO TO THE NEAREST, which keeps the old behaviour wherever the old
     behaviour was already the open one, and keeps it deterministic. */
  var best = null, bestScore = -1;
  for (let step = near; step <= far; step++) {
    const fx = p.home[0] + d[0] * step, fy = p.home[1] + d[1] * step;
    if (!pplStandable(fx, fy)) continue;
    if (taken && taken.has(fx + ',' + fy)) continue;
    var score = pplOpenness(fx, fy);
    if (score > bestScore) { bestScore = score; best = [fx, fy]; }
  }
  return best;
}"""

# ---- AND THE RAY IS LONGER, because a house is wider than six cells ----------
OUT_ANCHOR = """function pplOutSpot(p, taken) {
  return pplSpotToward(p, p.workDir, 4 + p.workDist * 2, 6 + p.workDist * 4, taken)
      || pplSpotToward(p, p.favDir, 3, 8, taken)
      || [p.home[0], p.home[1]];               /* nowhere to go: stay in */
}"""
OUT_NEW = """function pplOutSpot(p, taken) {
  /* __CITY_ALIVE__ -- AND THE RAY REACHES THE STREET NOW. The old window was 4
     to 10 cells from the doorstep, which on this world's scale does not clear
     the plot: a suburban lot plus its yard is wider than that, so every ray
     ended inside the property no matter which way it pointed. The window is
     their own distance again, just measured far enough out to leave the block.
     Their DIRECTION and their DISTANCE RANK are unchanged, so a person who
     worked far away still walks further than one who did not. */
  return pplSpotToward(p, p.workDir, 4 + p.workDist * 2, 22 + p.workDist * 10, taken)
      || pplSpotToward(p, p.favDir, 3, 20, taken)
      || [p.home[0], p.home[1]];               /* nowhere to go: stay in */
}"""

FAV_ANCHOR = """function pplFavSpot(p, taken) {
  return pplSpotToward(p, p.favDir, 3, 9, taken) || null;
}"""
FAV_NEW = """function pplFavSpot(p, taken) {
  /* __CITY_ALIVE__ -- same reach, same reason. A favourite spot nobody can see
     is a favourite spot nobody has. */
  return pplSpotToward(p, p.favDir, 3, 20, taken) || null;
}"""


def main():
    html = open(CITY, encoding='utf-8').read()
    if MARK in html:
        print('  already applied  ' + CITY)
        return
    steps = [('the spot finder', ANCHOR, NEW),
             ('the out spot', OUT_ANCHOR, OUT_NEW),
             ('the favourite spot', FAV_ANCHOR, FAV_NEW)]
    for name, anchor, _rep in steps:
        if html.count(anchor) != 1:
            sys.exit('FAILED: %s resolves %d times in %s, expected 1.'
                     % (name, html.count(anchor), CITY))
    for _name, anchor, rep in steps:
        html = html.replace(anchor, rep, 1)
    open(CITY, 'w', encoding='utf-8').write(html)
    print('  patched  ' + CITY + '  (out is somewhere you can see now)')


if __name__ == '__main__':
    main()
