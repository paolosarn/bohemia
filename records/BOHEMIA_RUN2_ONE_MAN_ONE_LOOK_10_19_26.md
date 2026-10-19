# RUN TWO [eyes: one man, one look] -- 10/19/26

EYES AND EARS' bounce-back ([every face beside its body], rule 120(d); his 10/18: 'the portraits don't look like the
people'; records/BOHEMIA_EYES_EVERY_FACE_BESIDE_ITS_BODY_10_19_26.md): on RUN TWO's crew screen 10 of 11 crew men wore
another man's face, because engine/bohemia_roster.js manOf() walked fight_people.json's cast order (i mod 12) and the
fight walked records/target/bb/ours.json people_looks.crew[i], and the two orders differ (DESI's crew face the bare-arms
man, his fight body the long-coat man; only MARISOL and YOU agreed).

## The fix (the who-wears-which-look half; the skin half is CHARACTER's and PORTRAIT's)

- engine/bohemia_roster.js lookFor(def, i): a man keeps the look he came with (a saved company's, the hall's); else man
  i wears the fight's own list at i (people_looks.crew, the same list the fight reads); past the list, its own men
  again, never YOU's body. company() now carries look, so bohemia.company.v1 and every opts.company say who wears what.
- slices/BOHEMIA_FIGHT.html (COMBAT's file, two lines, told on its board): the company map keeps m.look, and crewUnit
  dresses a man in c.look before falling back to his place in the list. Without it a death or a new order moved a man
  into another body (the fight dressed by position).
- The scavenge sheet and the hall read the man's look from the same roster objects, so they follow.

## Measured (NEW GATE ONE MAN, ONE LOOK 8/0, in the suite)

CONTROL: the old rule off the same two files disagrees for 10 of 11 men (EYES' number). After: the crew screen and the
fight, each left to itself, dress 12 of 12 alike; the crew screen's 25 faces are each a man's own look; the company
carries all 12 looks; the fight dresses 12 of 12 in them, 12 of 12 again in a new order, and a man hired at the hall
(GATE HIRED, cast_cape) fights in cast_cape. Roster 15/0, equip 7/0, crew stash 21/0, no face from a body 22/0,
scavenge 39/0, somebody hires you 38/0. THE CREW SCREEN AT FOURTEEN could not run here: it serves its before-picture
from git at 2c89a244, which this container's 68-commit clone does not hold (environment, not this change).

## For EYES

tools/bohemia_eyes_every_face_beside_its_body_10_19_26.py mirrors the OLD manOf rule in Python (line 441,
casts[i % len(casts)]), so its 'one man, one look' leg will keep reading 10 BACK after this fix. The live read
(node tools/bohemia_eyes_every_face_beside_its_body_10_19_26.js) runs the real roster; or read the rule from
engine/bohemia_roster.js lookFor: man i wears people_looks.crew[i].

## What this does not fix

The skins: every body is still baked in his pale skin and the crew faces are PORTRAIT's rolled skins (CHARACTER
[one skin, one person], PORTRAIT [the face is the body's face]). After this round a man's face and body are at least
the same man's look, so when those two land the crew screen and the fight agree on who he is and what he looks like.
