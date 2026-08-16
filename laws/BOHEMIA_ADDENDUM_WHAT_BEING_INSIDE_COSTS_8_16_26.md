# BOHEMIA ADDENDUM — WHAT BEING INSIDE COSTS YOU (8/16/26, FACTIONS lane, LOCKED)

## 1. THE HOLE: MEMBERSHIP WAS ALL UPSIDE

8/12 built the ladder (stranger → inside). 8/15 built the wall (turning up runs
out of road). **Both model what YOU do to THEM.** Nothing ever came back the
other way: you could be COUNTED by the Church and they would never once ask you
for anything. Membership was a wallet you drew on.

That is how essentially every faction system in every game works, and it is the
half of the sociology that is missing.

## 2. THE RESEARCH

**PORTES 1998, *Social Capital: Its Origins and Applications in Modern
Sociology*** (Annu. Rev. Sociol. 24:1–24) names four NEGATIVE consequences of
social capital. The second is the one nobody builds: **EXCESS CLAIMS ON GROUP
MEMBERS.** Being inside is not a resource you spend — it is a relationship that
can make demands of you, and the demands scale with how far in you are. Portes'
own cases are members bled dry by obligations they could not refuse without
losing the standing that made them worth asking.

**GOULDNER 1960, *The Norm of Reciprocity*** is why a claim has a CLOCK and not
a price: an obligation PERSISTS, and the interval between the asking and the
answering is where the relationship actually lives. An unanswered claim is not
neutral — it is a debt ageing in public.

## 3. THE MECHANISM

Once an outfit **COUNTS** you, it starts asking. What it asks for is the thing
it already wants (his 8/2 dossier canon, read out of `bohemia_belonging`, never
invented here). Then:

- **SAYING YES BUYS NOTHING.** `delta: 0`. Meeting an obligation is the RENT on
  being counted, not a way to climb. *That asymmetry is Portes' entire point and
  it is the first thing a well-meaning edit would "fix".*
- **SAYING NO COSTS THE RUNG THAT MADE YOU WORTH ASKING.** You fall to just
  below COUNTED. The number is DERIVED from the shipped ladder, never typed —
  and refusing from deeper in costs more, because you fall to the same floor.
- **THE DEBT AGES.** An unanswered claim reports how many days it has been.
- **THEY ASK WHEN YOU WALK INTO THEM.** No timer, no background tick, no roll,
  so an ask can never arrive somewhere you are not standing to answer it.

**ADOPTED, NOT REBUILT:** the limiter is `BOH_RESOLVE.makeRation` — approved by
Paolo 7/26 and unadopted until now (its sibling `makeCeiling` was adopted 8/15).
The gate proves the adoption by deleting the dependency and demanding a refusal.

**STILL [PENDING Paolo]:** how many times a week an outfit may lean on you is
item (c) of the 7/26 verdict, RATION LIMITS. Neither the organ nor the surface
invents it — the surface passes `{}`, which `makeRation` reads as unlimited, so
the pipe RUNS and simply never refuses yet. That is the shape EVERYTHING COSTS
ONE §4 asks for ("a cost that is skipped teaches us nothing"), not a bypass.

## 4. FIVE BUGS THE GATE FOUND, NOT A PERSON

- **THE RATION WAS ONE PER PROCESS, NOT ONE PER SAVE.** A module-level instance
  froze the limits at whatever the first caller passed and leaked spent counts
  across saves — a second game in the same session started with the week already
  used up. Surfaced as four separate failures with one cause. Now a WeakMap
  keyed on the save.
- **THE SAVE WAS LOOKED UP BY THE DISPLAY LABEL.** `rule.faction` is `"THE
  CHURCH"`; `rule.key` is `"CHURCH"`. The lookup found nothing, forever, and
  silently. **That is the three-spellings class, and this is the sixth time it
  has bitten this codebase.**
- **I HAND-EDITED A GENERATED FILE.** `bohemia_belonging.js` says "EDIT THE
  TOOL, NEVER THIS FILE" at the top, and I added `adjust()` straight to the `.js`.
  The belonging gate's own regeneration check silently wiped it, which is
  exactly what that check is for. Added to `tools/bohemia_belonging.py` instead.
- **TWO OF MY OWN GATE CLAIMS WERE THE BROKEN ONES**, and both got fixed at the
  ruler rather than the target (8/1: *fix the ruler, never the target*):
  - `E4` grepped the whole file for a faction name and hit the word "Church"
    inside the header comment explaining the hole. **A checker that cannot tell a
    mention from a use is the broken one** — it strips comments now and tests
    only CODE.
  - `F2` asserted the card shows no demand until something opens one. But the
    design is that they ask *when you walk into them*, so drawing the card IS the
    trigger. The claim was wrong, not the code; it now locks the guarantee that
    actually matters — **the uncounted are never asked**.

## 5. THE LAW

**1. A MEMBERSHIP THAT ONLY GIVES IS NOT A MEMBERSHIP.** Any system the player
climbs must be able to lean back on them, and refusing must cost the standing
that made them worth asking.

**2. MEETING AN OBLIGATION BUYS NOTHING.** It holds what you have. If doing what
they ask also advanced you, it would be a quest, not a claim.

**3. THE COUNT HAS ONE WRITER.** A refusal returns a DELTA; the count moves
through `bohemia_belonging.adjust()`. A second writer is how two ladders start
disagreeing — six times now.

**4. AN ASK ARRIVES WHERE IT CAN BE ANSWERED.** No timer may deliver a demand to
a place with no button on it.

## 6. THE MACHINE

`gates/claim_gate.js`, 36 claims — A adoption (dependency deleted, refusal
demanded), B who gets asked (trigger re-derived from the shipped ladder), C what
it costs (yes buys nothing, no is derived), D the ration bites and its limits are
the caller's, E every word is a tagged draft attempt and no outfit is named in
the code, F the real city in a real browser with **no stub**, G generated and the
anchors still refuse when stale.

## 7. WHAT IS STILL THIN, NAMED SO NOBODY CLAIMS IT

**THE PLAYER MAY NEVER MEET ANY OF THIS IN THE DEMO.** Measured this turn on the
walked surface: from the spawn cell (48,48), **the nearest 1,438 people include
zero who run with anybody**; the first affiliated person is **9 cells away**, and
the nearest faction base is 29. The demo's three quests are event-triggered
(`enter_building`, `enter_district`), not placed, so walking past an outfit is
luck rather than design.

That is **not this lane's to fix**: where the outfits sit is MAP LAW ("Claude
never designs map layouts"), and both `REACH_CELLS` (12) and `AFFILIATED_RATE`
(0.30) are [PENDING Paolo] dials. Routing the demo past an outfit is QUESTS/RUN.
Stated here rather than quietly tuned, because stretching a dial to force gang
members into the player's suburb would be fitting the world to a screenshot.
