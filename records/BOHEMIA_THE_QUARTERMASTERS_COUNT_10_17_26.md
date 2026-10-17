# THE QUARTERMASTER'S COUNT: ONE COMMAND OVER EVERYTHING HE OWNS, AND THE GATE THAT MAKES A COOK READ IT FIRST
PLUMBER, 10/17/26, VAMILY row [the quartermaster's count]. Rule 100c amended (the coordinator's school,
round twelve, records/BOHEMIA_COORDINATOR_SCHOOL_TWELFTH_ROUND_THE_QUARTERMASTERS_COUNT_10_11_26.md).
Paolo 10/10 (82a): "the cars is an asset we downloaded; a lot of the original street tiles and sidewalks
we downloaded; LOOK AGAIN."

## WHAT HAPPENED BEFORE THE MACHINE
294 packs bought, 8,674 tiles. 35 burnt-out wrecks at 45 degrees sat in the APPROVED bank since July
while [car recook] ran eight rounds on "every car looks like dogshit". The coordinator's own shopping
list of 10/11 asked him to buy two things he owned. The 7/27 shopping law said "check the index first"
and had no machine. COOK counted by hand (ab6da98f) and PORTRAIT counted its own family by hand
(16c80eb7) because nothing counted for them.

## THE COMMAND
    python3 tools/bohemia_quartermasters_count.py                 every family's line, and the JSON
    python3 tools/bohemia_quartermasters_count.py --family road   one line, for the top of a study page
    python3 tools/bohemia_quartermasters_count.py --packs prop    a family's packs with what opened each
    python3 tools/bohemia_quartermasters_count.py --check         is the committed count current (the gate)

Twenty seconds. It reads the four HD repo chunks (the source of truth, 180 MB), COOK's index for the
family of each pack, and the approved corpus for the 1,927. Output: records/target/BOHEMIA_QUARTERMASTERS_COUNT.json
(published, 100 KB), per family and per pack, with the evidence that opened each pack.

## THE COUNT, 10/17 (sha bb0e387)
    we own 3,507 pieces of prop in 115 packs, 69 never opened        784 approved
    we own 1,936 pieces of settlement in 67 packs, 27 never opened   318 approved
    we own 1,698 pieces of ground in 53 packs, 31 never opened       391 approved
    we own 600 pieces of road in 18 packs, 2 never opened            290 approved
    we own 394 pieces of door in 14 packs, 5 never opened             30 approved
    we own 265 pieces of lamp in 15 packs, 12 never opened            47 approved
    we own 188 pieces of marking in 8 packs, 3 never opened           67 approved
    we own 73 pieces of weapon in 3 packs, 2 never opened              0 approved
    we own 13 pieces of animal in 1 packs, 0 never opened              0 approved
    we own 8,674 pieces in 294 packs, 151 never opened (1,927 approved in the 7/13 sweep)

PEOPLE, FACES, EIGHT-DIRECTION BEASTS: zero packs. Those are the holes, the only real kind.

## WHAT "OPENED" MEANS, AND WHY THE FIRST CUT SAID ZERO
The first cut counted a pack as opened when any file on main named it. Result: 0 never opened, in
every family. One page (records/BOHEMIA_THE_WHOLE_BANK_10_13_26.md) names all 294, the four-holes page
names its 31, July's requirements matrix names 84. A list is not a look. So the rule, measured off the
file table (171 files name a pack; the lists sit at 22 names and above, the looks at 19 and below):

  (a) a tile of the pack is in the approved corpus (the 7/13 sweep), or
  (b) CODE names it (tools/, gates/, slices/, engine/; code that names a pack pulls its tiles), or a
      VOTE twin does (pack:<pack>#<idx>), or
  (c) a PAGE names it and names at most 20 packs. A page naming more is an inventory and is set aside;
      the JSON lists the six it set aside.

Everything else is NEVER OPENED. COOK's hand count said 210; the machine says 151, because tools that
pull from a pack by name count as opening it and COOK's count read only the approved bank. Both numbers
are on the record; the machine's is the one that re-runs.

## THE GATE: gates/quartermasters_count_gate.js, in the suite as QUARTERMASTER'S COUNT. 8/0.
  Q1 the committed count parses and names the sha it was counted at, on main.
  Q2 the count is CURRENT: the tool re-counts the packs on disk; pieces and packs per family must agree.
     (never opened only falls as chats open packs; a line true when written stays true; printed, not judged.)
  Q3 every HOW THE PACK DID IT page born since 10/17 opens with its family's line, numbers matching.
     The seven older pages are listed, not held.
  Q4 every tile, outfit or face a cook lane (COOK, COOK TWO, THREE, FOUR, COMBAT TWO) registers in VOTE
     since 10/17 names the pack piece it started from (twin.src pack:<pack>#<idx>, a pack the count has)
     or carries count: "we own 0 pieces of <family> in 0 packs, 0 never opened" for a family the count
     says is zero. Anything else is the [car recook] shape and is red with the family's line.
  S1 PROVEN ON THE CAR RECOOK SHAPE: a repainted car with no pack twin is refused with "we own 3,507
     pieces of prop in 115 packs"; the same card cut from "10. Abandoned cars" passes.
  S2 a people item with its hole passes; a claimed hole in prop is refused.
  S3 a page with the road line passes; stale numbers and a missing line are refused.

## WHAT THE COOKS DO FROM NOW (two sentences)
Before you draw, run `python3 tools/bohemia_quartermasters_count.py --family <yours>` and paste the line
as the first line under your study page's title. When you register the sheet, name the pack piece you
started from in twin.src as pack:<pack>#<idx>; if the count says zero for your family, say so in a
count field and that is your hole.

## WHAT THIS LANE DID NOT DO
It did not touch COOK's index, the corpus, or any cook tool (one system, one session). It did not
decide families (COOK's index does). It does not judge a never-opened number on a page, because that
number is allowed to be older than today. The gate takes about a minute (the recount plus one git log
per study page) and runs without a browser.
