#!/usr/bin/env python3
"""
BOHEMIA ONE SEED (7/28/26, RUN lane / integration) — THE CITY BUILDER HAS BEEN
SHOWING A DIFFERENT LAS VEGAS THAN THE GAME.

Paolo, 7/28:
  "for the run I still wanna start off in a suburb that you choose the location
   for in Vegas and I want that reflected when I'm in the city menu... I just
   want you to incorporate all of these things together like that's what the run
   is supposed to be and you're making it difficult"

He is not describing a UI preference. He is describing two worlds, and he is
right. MEASURED, three ways:

  the game's world model   BohemiaLoop.buildRealWorldMap('bohemia')
                           -> World.world(hashSeed('bohemia'))
                           -> OM.buildOvermap(2691674296)
  the city builder frame   let seed=2026, om=OM.buildOvermap(seed)

  and the consequence, read off both at once on the real surfaces:
      overmap cell 12,4 is SUBURB in the run  (it is where the run spawns him)
      overmap cell 12,4 is ARTERIAL in the city builder

Same coordinates, same generator, two different cities. Nothing can be
"reflected in the city menu" because the city menu is not the same place.

## THIS IS A LOCKED LAW BEING BROKEN, NOT A NICE-TO-HAVE

laws/BOHEMIA_ADDENDUM_ONE_MAP_7_27_26.md (Paolo 7/27, LOCKED):

    "There is ONE valley map. ... A player who opens the phone in the run and a
     player who opens the builder are looking at the SAME PLACE. If those two
     can drift - different seed, different district, different anything - the
     map is decoration, not information."

That law's own write-up names the previous instance of exactly this bug: "the
MAP tab sat on the literal seed 1337 for months while the game booted the text
seed 'bohemia'". The MAP tab was fixed. THE CITY BUILDER WAS NEVER CHECKED, and
it has been sitting on 2026 the whole time.

So this is the same defect, in a third place, after the law was written to kill
it. That is what an unenforced law costs.

## WHY CHANGING THE CITY'S SEED IS PLUMBING, NOT MAP DESIGN

MAP LAW: "Claude never designs map layouts. Plumbing only. Paolo places canon."
This does not design anything. The canonical valley is the one the game boots and
the one he has been playing and judging - 'bohemia'. The builder was rendering a
SECOND, private, non-canon valley that nothing else in the game agrees with.
Deleting a wrong second layout is not authoring a layout.

Nor does it invalidate the district art the other lanes have been building: that
work is per DISTRICT TYPE (park, farm, storage...), not per cell. Which cell
holds which district changes; what a park looks like does not.

## WHAT THIS PATCH DOES

ONE value, and it takes it from the shared engine instead of hardcoding a second
copy of the answer:

    let seed=2026                     ->   let seed=BOH_ONE_SEED()

where BOH_ONE_SEED() is the game's own hashSeed('bohemia'), computed with the
engine's own hash function inlined verbatim so the builder cannot drift from it
by a copy-paste. If the game's seed text ever changes, both move together.

Gate: gates/one_seed_gate.js — boots the real alpha, reads the RUN's world seed
and the CITY frame's overmap seed, and asserts they are the same number AND that
a sampled cell reports the same district on both surfaces. Coordinates agreeing
is the thing that actually matters; equal seeds is how it is achieved.

  python3 tools/bohemia_one_seed_patch.py
"""
import base64
import os
import re
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'

alpha = open(ALPHA, encoding='utf8').read()

KEY = "const CITY_B64='"
if KEY not in alpha:
    print('no CITY_B64 in the alpha; nothing to do.')
    sys.exit(1)

a0 = alpha.index(KEY) + len(KEY)
a1 = alpha.index("'", a0)
city = base64.b64decode(alpha[a0:a1]).decode('utf8')

if 'BOH_ONE_SEED' in city:
    print('one seed already applied. no-op.')
    sys.exit(0)

OLD = 'let seed=2026, om=OM.buildOvermap(seed);'
if city.count(OLD) != 1:
    print('FAILED: could not find the single city seed line (found %d)' % city.count(OLD))
    sys.exit(1)

NEW = (
    "/* ONE MAP (Paolo 7/27, LOCKED) + his 7/28 order to make the run and the city\n"
    "   the same place. This frame used to hardcode `seed=2026` while the GAME\n"
    "   boots the text seed 'bohemia' -> hashSeed -> 2691674296, so the builder\n"
    "   rendered a private second Las Vegas: cell 12,4 is the SUBURB the run\n"
    "   spawns you in, and was ARTERIAL here. The seed now comes from the game's\n"
    "   own hash of its own seed text, inlined verbatim from bohemia_engine.js so\n"
    "   a copy-paste cannot drift it. Gate: gates/one_seed_gate.js. */\n"
    "function BOH_HASH_SEED(str){ str=String(str);\n"
    "  let h=1779033703^str.length;\n"
    "  for(let i=0;i<str.length;i++){ h=Math.imul(h^str.charCodeAt(i),3432918353); h=(h<<13)|(h>>>19); }\n"
    "  h=Math.imul(h^(h>>>16),2246822507); h=Math.imul(h^(h>>>13),3266489909);\n"
    "  return (h^(h>>>16))>>>0; }\n"
    "const BOH_SEED_TEXT='bohemia';\n"
    "function BOH_ONE_SEED(){ return BOH_HASH_SEED(BOH_SEED_TEXT); }\n"
    "let seed=BOH_ONE_SEED(), om=OM.buildOvermap(seed);"
)

city = city.replace(OLD, NEW, 1)

alpha = alpha[:a0] + base64.b64encode(city.encode('utf8')).decode('ascii') + alpha[a1:]
open(ALPHA, 'w', encoding='utf8').write(alpha)
print('ONE SEED applied: the city builder now generates the GAME\'s valley')
print('  was: 2026 (a private second Las Vegas)')
print('  now: hashSeed("bohemia") = 2691674296 (the one the run and the phone map use)')
