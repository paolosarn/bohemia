# [bb legacy] — THE COMPANY ACROSS TIME
DYNASTY lane · rule 33(f) · THE-COMPANY-ACROSS-TIME · 9/27/26
Read first per rule 33(j): reference/library/battle_brothers/README.md and
reference/library/battle_brothers/01_WORLDMAP.md, cited below. Every number in
that volume is tagged `(recall)` — written from memory because the wiki cannot
be fetched from this fleet's machines. Nothing in it read as wrong against
anything this lane could check, so nothing is corrected this round.

## THE ONE LINE
**Battle Brothers has no generations because it never needs one — the company
is a name and a ledger, not a body, and the world changes by CRISIS, not by
years passing. Our three acts are the crisis Battle Brothers never had to
build, because our men never die and our map is the same one throughout.**

Nothing here touches the demo or the alpha's play tabs (rule 18b). Record only.

## WHY THIS ROW MATTERS NOW
Rule 31 asked how a hundred-hour game stays one continuous thing across three
lives. This lane's own two school rounds answered the MACHINERY (the layout is
shared, the fill is derived, standings are a floor his deeds move from). This
row asks the older question underneath that: what does "the company outlives
its men" actually feel like at the table, in a game that has been doing exactly
that for a decade, and does anything in our shape resemble it by accident.

## HOW BATTLE BROTHERS DOES IT (reference/library/battle_brothers/01_WORLDMAP.md)
**There are no generations. There is one company, forever, and it is made of
replaceable parts.**

- **The persistent unit is never a person.** A brother is hired, fights, and
  dies or is dismissed; the company's name, its banner, its crowns, its
  RENOWN and its RELATIONS with each noble house are what carry. The library:
  "renown grows with fights won and contracts done... relations per noble
  house... rise with contracts done for them and fall with failed or refused
  contracts." None of that is attached to any one man. A company that has lost
  every brother it started with can still be famous.
- **Loss is routine, not a fold.** Men die mid-campaign, constantly, and the
  answer is never "the game ends" or "time skips ten years" — it is "hire
  another one at the tavern." There is no ceremony for it because there does
  not need to be one: the company is the character, and the roster is its
  clothes.
- **The world does not age. It gets INTERRUPTED.** The library names the
  mechanism directly: "CRISES (late-game arcs): THE WAR OF THE NOBLE HOUSES...
  THE GREENSKIN INVASION... THE UNDEAD SCOURGE... A crisis changes what every
  town needs and what contracts appear." A crisis is not a new map and not a
  time skip. It is the SAME map, with what every settlement needs, fears, and
  offers rewritten. Settlements visibly change hands during a crisis; the
  landscape (roads, rivers, settlement sites) never moves.
- **Settlement situations are the small version of the same idea,
  continuously**: "well supplied," "raided," "plague," "festival" — temporary,
  local, and player-visible without a menu. The crisis is just this same
  mechanism turned up to the scale of the whole map.

**The lesson under all of it: Battle Brothers never had to solve "how does a
world change over a long game," because it solved a smaller problem first —
"how does a world change AT ALL" — and then let that mechanism run longer.**
Three acts are not a bigger version of a crisis. A crisis IS what our three
acts are, run on a map that already knows how to hold state per period,
because FACTIONS built exactly that shape last round (see below).

## WHAT WE ALREADY HAVE, MEASURED, NOT RECALLED
Battle Brothers never needed a "the past changes the future" mechanism because
its men are disposable and its crises are player-witnessed as they happen —
there is no earlier era to derive FROM. We do not have that luxury (rule 31 is
the whole reason this lane exists), but the pieces this lane and its neighbours
already built turn out to be the crisis machinery Battle Brothers runs, wearing
different names:

| Battle Brothers has | we have | where |
|---|---|---|
| one map, never redrawn, across every crisis | one seed, one layout (4,459 bytes), shared by all three acts, never rewritten by the derive | `engine/bohemia_acts.js`, school round two |
| renown & relations that outlive any one brother | standings that decay ~0.79/act and are a FLOOR, not a reset — his own deeds move them from there | `engine/bohemia_fold.js` CARRY table |
| a crisis that changes who holds what, map-wide | a territory ledger keyed on seed + act, built and waiting, currently zero rows because nothing yet calls `took()` | `engine/bohemia_turfledger.js`, FACTIONS 9/24 |
| a crisis rewriting what a town needs/offers | the century ledger — the law's own words, since 7/26: "dynasty building choices COMPOUND across the three acts... the city is the game's long memory" — MECHANISM UNBUILT until this lane's derive gave it something to attach to | `engine/bohemia_century.js` |
| settlements visibly redraw during a crisis, live | measured this month by WORLD, on the real map camera, at night, across all three acts: **6,899 ground pixels compared, zero moved** — the roads and lots are identical; only the lit/dark fill differs | vote item `world-the-valley-three-acts-9-27`, sha `fdec3fa` |

**Every load-bearing piece of "a crisis changes the map without moving the
map" already exists in this repo, split across four lanes that were not
talking to Battle Brothers when they built it.** That is the real finding: we
did not need this study to invent the shape. We needed it to notice we already
had it, and to borrow BB's vocabulary for naming it to him.

## THE SHAPE FOR US
**Stop calling them three generations. Call them three crises on one map, the
same way Battle Brothers would, because that is structurally what they are.**

A "generation" implies a body that ages and dies and a fold that happens once,
off-screen, at a cutscene. That is not our design and it never was — rule 31
made all three PLAYABLE AT ONCE, which is a crisis system's shape (interrupt
and resume, never a hard cut) wearing a family tree's clothes. The reframe:

- **ACT 1 (Animal / the anarchy decade) is the map before any crisis has been
  answered** — Battle Brothers' opening state, nobody's claimed anything yet,
  the floor rule 32(b) already names.
- **ACT 2 and ACT 3 are not new eras. They are the SAME crisis map, read at a
  later checkpoint of the SAME unresolved crisis**, exactly the way a Battle
  Brothers noble war keeps being the noble war for as long as it takes houses
  to actually win or lose ground. What changes between them is not time — it
  is how much of the crisis the company (the player, across all three faces)
  has answered.
- **The "company" that outlives the men is not a roster here — it is the
  PLAYER's own standing and territory**, the fields this lane's derive already
  marked as floors, not resets. Three bodies, one continuous account, exactly
  like one company and many dead brothers.
- **The heir mechanic this lane inherited from its retired [heir keeps]
  research is the wrong metaphor and should stop being reached for.** A fold
  is a death. Nothing in rule 31 dies. Every future school or build round on
  this lane should reach for "crisis checkpoint," not "generation," when it
  needs a word for act 2 or act 3.

## WHAT MOVES THAT BATTLE BROTHERS' PICTURE DOES NOT (rule 5b)
Battle Brothers announces a crisis with a title card and a paragraph, then
redraws the map's colours between one campaign day and the next — a still
picture replaced by another still picture. Ours does not get a card:

- **The flip is not a screen change, it is a tap that redraws the same live
  map you are already standing on** — built last round, measured with a real
  finger: the lit tile moves, the ground underneath does not cut away.
- **A crisis here is never announced. It is walked into.** The block that
  changed hands is a block with a new mark on the wall the next time he is
  near it, the way `ctPublishMark` already posts a deed onto a place rather
  than a log. Battle Brothers tells you a house lost a town in a letter; ours
  should show you the light going out on a street you can walk up to.
- **The company's continuity is not a summary screen either.** Standings and
  territory are already things people IN the world hold opinions about and
  say out loud when you are near them (QUESTS' ask wire, PEOPLE's vouching) —
  so "the crisis moved" is something a stranger mentions in passing, not a
  paragraph on a card rule 19(a) already killed.

## WHAT THIS ROW DOES NOT DO
No code, no gate, no VOTE tile with a picture — SCHOOL mode, rule 22's own
sentence: "in SCHOOL the record is the round's thing and it goes to VOTE as
one line." Registered as a text line below, not a page or an image, because
there is nothing built yet to photograph.

## ROUTED
- **FACTIONS**: `bohemia_turfledger.js`'s `took()` is the crisis lever. The
  moment any lane ships a taking mechanic, three acts start reading as three
  crisis-checkpoints for real, not just in language.
- **LIFE+CITY / WORLD**: the century ledger (7/26, still unbuilt as a
  mechanism) is BB's "what every town needs changes" half of a crisis. This
  lane's derive gave it a caller; it does not yet have one.
- **DYNASTY, next**: retire "generation," "fold," and "heir" from this lane's
  own vocabulary going forward in favour of "crisis checkpoint" — a note to
  future rounds of this same chat, not a rule for anyone else.
