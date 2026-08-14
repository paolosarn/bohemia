# RESEARCH — THE PHANTOM SHELF: WHY THE FLEET KEEPS BUILDING THINGS
# NOBODY CAN REACH (8/14/26, coordinator sweep 9 catch; doctrine §4b —
# both aisles, anti-yes-man, measured before routed)

## THE FALSIFIABLE QUESTION
Lanes keep discovering, by accident, that finished work was never
reachable by the player. Is that a discipline problem in a few lanes —
or a structural property of how this fleet is built, and therefore
something only a machine can hold?

## THE MEASUREMENT (ours, this repo, one week: 8/7-8/14, 237 commits)
At least EIGHT commits are the same discovery, from FIVE different lanes:
- "AND THEN I FOUND THE BARKS HAD NEVER BEEN AUDIBLE: three wires, all cut"
- "THE DAY PAYS: the bridge that was built and never called" — payday's
  entire exported surface referenced ZERO times outside its own module
  since 8/11, and its own commit says "Sixth time this week."
- "THE RANGE WAS NEVER WIRED TO HIS GUN, AND THE FIGHT MUSIC PLAYED
  WITHOUT A FIGHT"
- "THEY SAW YOU DO IT — AND MY OWN ALLEGIANCE LINE HAD BEEN INVISIBLE
  SINCE IT SHIPPED"
- "YOU CAN SEE WHO CAN REACH YOU: THE RANGE SYSTEM WAS INVISIBLE UNTIL NOW"
- "WHAT THEY WANT FROM YOU: I BUILT A DOOR AND A LOCK AND LEFT THE ROOM EMPTY"
- "THE PERIPHERAL ACT: THE BARGAIN WAS LEGIBLE AND YOU COULD NOT ACT ON IT"
- THE SIXTEEN INTRODUCTIONS: his own approved dossiers sat unread 10 days.
Plus the coordinator's own 8/13 catch (the moon zoom was wheel-only, so
it did not exist on a phone) and the 8/13 save finding (the home-screen
exemption was known IN A COMMENT and unbuilt).
EVERY ONE WAS FOUND BY ACCIDENT. Not one was found by a gate.

## WHY OUR OWN ARCHITECTURE HIDES IT (the thing I got wrong first)
I tried to measure dead wiring mechanically: for every engine/*.js
exported symbol, count references outside the module. It reported whole
modules dead (brownout 5/5, voice 4/6) — and IT WAS WRONG. Under the
ENGINE SYNC LAW each canonical module is INLINED into the slices, so a
grep sees the inlined copy's own definition and cannot tell a CALL from
a COPY. Verified: brownout is referenced in people.js, three slices, and
has its own gate.
THAT FAILURE IS THE FINDING. The law that keeps one canonical body —
correct, and it stays — also makes "is anything actually calling this?"
mechanically unanswerable by ordinary means, for humans and greps alike.
This is why the disease is invisible: nobody can see a dead wire in an
inlined architecture without a purpose-built tool. The good news is the
tool is CHEAP, because the inlined regions are DELIMITED: every slice
carries `/* ===== bohemia_X.js ===== */` banners (85 in the run slice),
which is exactly how the resync scanner already finds them.

## THE CORRECTION THAT MAKES THIS WORSE, NOT BETTER (found while routing)
We ALREADY BUILT THE INSTRUMENT AND IT IS ALREADY SCREAMING.
records/BOHEMIA_REACHABILITY_CENSUS.json (8/6) + gates/reachability_gate.js
count exactly this disease. The gate's own header says SEVENTEEN finished
things ship only into slices/BOHEMIA_RUN_CURRENT.html, "which the alpha
loads and never displays," and calls it "what six separate incidents in
three days were each a symptom of, finally counted."
TODAY THE CENSUS SAYS **THIRTY** LOADED-ONLY ROWS, and 273.6 MB of 276.6
MB unreached. Seventeen became thirty in eight days. The biggest ones are
not obscure: banks/BOHEMIA_HD_TILE_REPO_part1 (45 MB), the door animation
bank (12.6 MB), the interior pool, the exterior pool, Paolo's own approved
PERIMETER walls, and the HARMONIZED STREET POOLS that a standing law
orders every lane to source from.
WHY IT KEPT GROWING: the gate deliberately does NOT demand the number go
down — correctly, because which item gets wired first is Paolo's and the
owning lane's call, and a gate that forced it would outrank a ruling. But
the consequence is that NOTHING EVER FORCES THE CONVERSATION. We built a
smoke detector and wired it to a notebook.
So the fix is not a new census. It is (a) making a NAMELESS phantom
illegal — every LOADED ONLY row carries an owner lane and a backlog id or
the gate reds on that row alone, which keeps the ordering ruling with him
while killing the anonymity, and (b) the call-site half the census cannot
see (payday was PRESENT in the displayed slice and still dormant, because
every caller was inside its own inlined body).

## AISLE 1 — THE REAL WORLD: THIS IS PHANTOM INVENTORY
Retail operations research has studied our exact disease for 20 years.
- DeHoratius & Raman (Management Science): 65% of ~370,000 inventory
  records across 37 stores were inaccurate; the value tied to badly
  wrong records was 28% of expected on-hand inventory.
- PHANTOM STOCKOUT (Ton & Raman): the goods ARE IN THE BACK ROOM and do
  not reach the SHELF. The record says the customer can buy it. The
  customer cannot. Estimated ~4% of annual sales lost to phantom stock
  breaks alone.
- THE CHALLENGE FINDING, and it is aimed at us: Ton & Raman found
  phantom stockouts RISE WITH VARIETY AND INVENTORY. More SKUs and more
  stock in the back = MORE things the customer cannot reach. Translated:
  our disease is not sloppiness, it is the PRICE OF OUR OWN VOLUME LAW.
  Nine parallel lanes each told to SHIP A LOT PER TURN is the maximum-
  variety, maximum-back-room configuration in the study. We should
  expect this to get WORSE as we get faster, and green gates will keep
  saying everything is fine, because a gate tests the back room.
- The retail fix is not "try harder": it is CYCLE COUNTING AND SHELF
  AUDITS — a scheduled machine that walks the shelf and compares it to
  the record. Audits are targeted where inaccuracy concentrates.

## AISLE 2 — GAMES: INSTRUMENT WHAT IS ACTUALLY REACHED
- Valve, from Half-Life onward, instrumented playtests automatically —
  recording position, health, weapons, deaths, puzzle solves — rather
  than trusting that built content was experienced; Left 4 Dead's tuning
  ran on data auto-gathered from every internal playtest.
- The practice generalizes to our case: a studio's answer to "did the
  player ever meet this?" is telemetry over a real session, not a code
  review. We already have the hook — RUN 0i's time-to-first-play
  telemetry (sweep 5) is the same instrument pointed at a different
  question, so this is an extension, not a new system.
- Postmortem consensus (Game Developer's survey of two years of
  postmortems): 71% report scope problems and partially-built features
  cut for time. Our variant is worse and cheaper to fix: the feature is
  DONE and simply unreached — the most wasteful possible state, because
  it is paid for and delivers nothing.

## THE DECISION (routed work order — SHARED, do it once, all lanes benefit)
THE SHELF AUDIT. A machine that answers "can the player reach this?"
1. STATIC HALF — tools/bohemia_shelf_audit.js: parse each slice's
   `/* ===== module.js ===== */` banner regions; for every symbol a
   canonical module exports, count call sites OUTSIDE that module's own
   inlined region. Zero external call sites = A PHANTOM: on the record,
   not on the shelf. Output a ranked report; the count of phantoms is
   the fleet's health number.
2. THE GATE — shelf_gate.js: a phantom is legal ONLY if it is declared,
   with a backlog id, in a registry file (gates/bohemia_shelf_pending.txt)
   saying which item will wire it and when. Undeclared phantom = RED.
   This is the cycle count, and it makes "built but not called" a state
   the machine can name instead of a thing a lane trips over.
3. DYNAMIC HALF (extends RUN 0i, cheap): during the headless demo-day
   run, log which systems FIRED at least once. A system that never fires
   in a full played day is a phantom the static half cannot see (wired,
   but unreachable in practice — the moon-zoom class of bug: called from
   a code path no phone can take).
4. TARGETED AUDIT, per the retail finding: run the audit on the DEMO
   PATH first, where a phantom costs the most.
WHY SHARED AND NOT ONE LANE: five lanes hit this in one week and each
fixed only its own instance. The disease is fleet-level; the detector
must be too. Estimated cost is small (banner regions already parsed by
existing resync tooling — REUSE-FIRST).

## CONFIDENCE
Our 8-incident count: measured in this repo's git log, high. The inlining
blindness: verified by my own failed measurement plus the banner check,
high. Retail figures: peer-reviewed primary (Management Science /
DeHoratius & Raman; Ton & Raman), high — the TRANSFER to software
wiring is my analogy, flagged as such, though the mechanism (record vs
shelf) is structurally identical. Valve instrumentation: practitioner-
documented, medium-high. The volume-causes-phantoms claim is the
strongest challenge here and rests on the retail study, not on us.

Sources: pubsonline.informs.org/doi/10.1287/mnsc.1070.0789 +
faculty.wharton.upenn.edu (Fisher/Krishnan/Netessine retail execution) +
en.wikipedia.org/wiki/Phantom_inventory (phantom stockouts, variety
effect); steamcdn-a.akamaihd.net (Booth, The AI Systems of Left 4 Dead)
+ gamedeveloper.com/design/the-cabal-valve-s-design-process (Half-Life
instrumentation) + gamedeveloper.com "What Went Wrong? Learning From
Past Postmortems" (the 71% scope figure).
