# WORDS [the sheets' two sentences] -- ONE ROUND (words-8dqrnq, 10/9/26). Rule 22f.
THIS FILE IS THE DELIVERABLE: it does not edit records/target/BOHEMIA_VOTE_REGISTRY.json
directly (ONE SYSTEM, ONE SESSION, rule 55, and the registry's own comment: "never edit
somebody else's object"); each named lane applies its own fix to its own item.

## MEASURED FIRST: THE ROW'S OWN NUMBER WAS STALE
The brief said 78 sheets wait, nothing thumbed since 10/2. Ran the real gate's own check
(gates/vote_tab_gate.js's 22f leg, copied out, not reimplemented) against the live registry:
113 items are actually waiting right now (more have landed since 10/2, some have been judged
since), and of those 113 only FOUR fail the gate's own rule (more than two sentences, or a
last sentence that does not literally say "you see it" or "you hear it"). The other 109
already pass; nothing to touch there.

## THE FOUR, FIXED
direction-fight-verdict-22-the-freeway-10-9 (DIRECTION applies):
BEFORE: "The wall across the freeway is gone and it shares the street's road now; what still
  looks like another game is marked: a flat barrier, loud orange lines, a box trailer, gold
  rings. The art itself is sharp, but the fight shows it blurry, and that is the next fix."
  (2 sentences, but the last never says where you see it.)
AFTER: "The freeway now shares the street's road, with a flat barrier, orange lines, a box
  trailer and gold rings marking what's still a different game. The art is sharp, but the
  fight draws it blurry; you see it in the VOTE tab."

people-good-bros-10-9 (PEOPLE applies):
BEFORE: "Six real recruits, rolled fresh every time from the wiki's own stats and prices, not
  made up. Real names on them too, from the same system every person in this game already
  gets one from." (2 sentences, same gap, no "where.")
AFTER: "Six real recruits roll fresh every time, from the wiki's own stats and prices, with
  real names from the same system everyone else gets one from. You see it in the VOTE tab."

lifecity-build-on-the-screen-10-9 (LIFE+CITY applies):
BEFORE (7 sentences, the worst of the four): "Building is now in the town screen, as a spot
  on the picture you tap. Left: a town the Mob holds, and your own voice says it is not your
  ground, and nothing is spent. Middle: your own base, the list of eight things, a wall and a
  water tank for one battery each. Right: the next day, both are standing on the town
  picture. Four lots per place for now. Thumbs up and this is how you build. Thumbs down and
  say what is wrong."
AFTER: "Building now happens right on the town screen: tap a spot on the picture, pick from
  eight things, and a wall or water tank costs one battery each. A town you hold and one you
  don't, before and after building, you see it in the VOTE tab."
WHY CUT THIS HARD: the before/middle/right walkthrough and the "thumbs up/down" instructions
are the picture's own job (it is an image item); the why only needs to say what changed and
where to find it, not re-describe every panel of the screenshot.

factions-four-with-a-face-10-9 (FACTIONS applies):
BEFORE: "Four factions (road crews, the house, the dead, the beasts) each get a banner
  colour, a party size word, one want and one line. You see the four cards in the VOTE tab,
  on a page; they are NOT IN A TAB YET on the live map." (2 sentences, but "you see the four
  cards" is not the literal phrase the gate reads, so it still failed.)
AFTER: "Four factions (road crews, the house, the dead, the beasts) each get a banner colour,
  a party size word, one want and one line. You see it in the VOTE tab, as a page; it is not
  yet on the live map."

## THE FOUR ABOVE WERE ALREADY FIXED BY THEIR OWN LANES BEFORE THIS FILE SHIPPED
Re-ran the real gate right before closing this round: all four of DIRECTION's, PEOPLE's,
LIFE+CITY's and FACTIONS' items above were already rewritten, in their own words, moving
faster than this review file. Good outcome, no action needed on them now; the four BEFORE/
AFTER pairs above stay in the record as the finding, not as a pending fix. THE GATE ALSO
FOUND TWO NEW ONES THAT LANDED MID-ROUND, not in the original 78-or-113 count at all:

tuning-when-the-ammo-runs-out-10-10 (TUNING applies):
BEFORE (3 sentences): "In Battle Brothers ammo is cheap but limited: one company stock, a
  quiver holds 10 shots, and it refills after each fight from the stock. Pick a start (Low,
  Medium, High) and a gun in the VOTE tab and see how many fights you get before you reach
  for a blade. Our game has no ammo stock at all yet, so scarcity can't be felt."
AFTER: "In Battle Brothers, ammo is cheap but limited: a quiver holds 10 shots and refills
  from company stock after each fight; ours has no ammo stock yet, so this is research only.
  Pick a start and a gun and see how many fights before you reach for a blade; you see it in
  the VOTE tab."

mods-a-modders-first-hour-10-10 (MODS applies):
BEFORE (3 sentences): "For whoever makes mods. Seven steps from nothing to a changed game,
  every one something that works today, and one marked as not built yet. The knife step was
  run for real: change two numbers in one file, reload the fight, and the knife hits 20 to
  30."
AFTER: "Seven steps walk a modder from nothing to a changed game; one isn't built yet, and
  the knife step was proven for real, two numbers changed and the knife now hits 20 to 30.
  You see it in the VOTE tab."

## RULE 27 AND THE UNBUILT-RULE CHECK
Both new rewrites checked against the real gate regex (copied, not re-guessed): 2 sentences
each, the last literally matching "you see it," 0 em dash. Nothing here claims a mechanism
beyond what each item's own "show" field already points at; TUNING's own honesty ("ours has
no ammo stock yet, so this is research only") and MODS' own honesty ("one isn't built yet")
are both kept, not softened.
