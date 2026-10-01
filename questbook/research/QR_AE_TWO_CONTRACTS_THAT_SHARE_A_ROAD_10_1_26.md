# QR-AE: TWO CONTRACTS THAT SHARE A ROAD. HOW JOBS OVERLAP ON ONE TRIP, WHICH ONES PAIR, AND WHAT THE PHONE SHOWS

QUESTION: rows [paired contracts] and [seventh shelf]. Rule 51 (Paolo 9/30, LOCKED) gives the company ONE main quest and
TWO contract slots, not Battle Brothers' one: "a caravan quest takes you to a city and near that city you can kill
something". The phone in the city view shows which settlement offers what, a board that ages, and cannot accept;
accepting is a mouth at the place, on the settlement screen's offer. From the 236-study library, by id: how the best
games let jobs overlap on one trip (chaining, a stop on the way, shared ground); the pairing rules (which contract kinds
pair well, how a twist or failure in one touches the other, a deadline in one against a detour for the other, never
forcing a pair, declining still free); what the read-only board must show so the player can plan a pair; and the flaws
(quest-log soup, conflicting objectives). Then twenty designs: five pairs (ten files) and ten contracts that advance a
named ambition from QR-Z.

STATUS: research only (rule 35, laws/BOHEMIA_ADDENDUM_QUESTS_IS_RESEARCH_ONLY_9_27_26.md). Nothing here is built. Every
contract below is an ATTEMPT, draft:true; names, lines and pay are Paolo's to change; every number is TUNING's (chat 21).

SOURCES: the library by id (records/BOHEMIA_QUESTBOOK_LAW_INDEX.json); records/BOHEMIA_PAOLO_ONE_MAIN_QUEST_TWO_CONTRACTS_THE_PHONE_ONLY_SHOWS_9_30_26.md
(his words, verbatim); reference/library/battle_brothers/08_CONTRACTS_EVENTS.md (the contract kinds and twists, recall);
QR-O (the fourteen boards), QR-S (situations that write a board), QR-Z (ambitions), QR-G (the checklist, now 30 lines
with QR-X's 29 and 30); VAMILY rules 41 to 51.

SOURCE HONESTY. Battle Brothers facts here are [R], recall from play and from the reference library (itself recall),
except where `Q236` carries a [V] in its own body. The library has NO study of a two-slot contract system: every
game in it either runs a quest log with no cap (and suffers for it) or one job at a time (`Q236.W2`). So this page is
built from what the library says about overlap, clocks, routes and logs, and the two-slot shape is ours.

[bb paired contracts] research line: Battle Brothers holds one active contract and greys the hall's button while it
runs (`Q236.N1`, `Q236.W2`). Rule 51 doubles it. This page is the translation: what breaks, what to keep, what to add.

---

## THE ANSWER IN ONE PARAGRAPH

Two slots are good only if the second contract makes the trip BETTER, not just fuller. The library's best overlap is
never two lists ticked in parallel; it is one road where one job puts you somewhere the other job needs you
(`Q062.W8`: the detour was the answer), where what one job taught you helps the other (`Q019.W6`, `Q015.W4`), and where
the world remembers both (`Q008.W5`). Its worst overlap is the quest log nobody can read (`Q037.X2`, `Q109.W7`) and the
world tour of errands (`Q079.X1`, `Q084.X2`, `Q113.X1`). So for Bohemia: a pair is TWO ORDINARY CONTRACTS FROM TWO
PLACES that happen to share a road on the map, never a bundle and never a single offer with two parts. Each stands
alone at full pay; taking both saves days, water and food on the road, which is the only "pair bonus", and it is real
because time and supplies are real (`Q146.W8`). The kinds that pair best are a MOVE (haul, escort, carry) into a place
plus a FIGHT (hunt, clear, hold) near that place, exactly Paolo's caravan-then-kill. A twist in one may touch the other
at most once per pair, and only through a face or a board within two map stops (`Q187.W1` with `Q187.X1`'s warning,
`Q128.X2`); two contracts whose goals collide are allowed only as an honest fork the player can see before the second
yes (`Q178.W3`, `Q226.X3`). Deadlines are counted in map days and said aloud; the phone shows how many days a detour
costs before the player leaves; a beast moves but never expires silently (`Q095.X1`, `Q119.X3`). The phone's board
shows the place, the client's face, the kind, the skulls, the pay in the six resources, the days the client says she
will wait, and how old the post is; it shows a faint line between two posts that share a road, and nothing else: no
accept button, no full offer text, no marker on the fight board (`Q236.W1`, `Q148.W2`, `Q023.X4`). Declining stays
free in every case: an untaken second offer writes nothing, and the first contract never gets worse because the
player said no to the second (`Q236.P3`, `Q236.W7`).

---

## 1. WHAT RULE 51 CHANGES

1. ONE SLOT WAS A LEGIBILITY TOOL. `Q236.W2`: a single active job keeps the promise legible and the map uncluttered;
   the greyed button teaches it without a speech (`Q236.N1`). Paolo calls the one slot "wack" because it wastes the
   road. Both are true. Two slots keep most of the legibility (two lines, two targets) and win back the road.
2. THE ACCEPT BUTTON IS STILL THE ONLY PROMISE (`Q236.W7`, `Q236.N2`). With two slots there are two promises, each made
   at a different place to a different face. Rule 35c holds for each: once taken you finish it; declining is free.
3. A THIRD OFFER WAITS. With both slots full, the hall still opens and the offer screen still reads (the client, the
   lines, the pay); the accept line is greyed with a line from the client, never a banner: "You're carrying two
   already. I'll be here till Thursday." (the greyed button of `Q236.N1`, with a mouth on it).
4. THE PHONE BECOMES THE PLANNER. Rule 51c: the cracked phone lists who offers what and cannot accept. That is the
   front door moving onto the map: the reason to travel (`Q148.W2`: the board as a dignified front door) without the
   deal (`Q236.W7`). The deal stays a face at a place.
5. TIME BECOMES THE PRICE OF GREED. With one slot, the price of a job was the job. With two, the price of the second is
   the days it adds to the first. `Q146.W8` (time is the only fee) and `Q041.W6` (the greed lever: more risk for more
   reward, chosen) are the two halves of the decision.

---

## 2. THE FINDINGS

### 2.1 The three shapes of overlap the library knows

A. THE STOP ON THE WAY (one road, two places). The richest case in the library is the side trip that turns out to be
the answer: "the 'waste of time' side-hunt turns out to be the case's SOLUTION" (`Q062.W8`). The route itself is a
choice with risk and reward on it (`Q052.W4`: choose the elite-for-loot path or the safe one, before combat). A route
used enough becomes a road (`Q089.W6`), and the city's real network can be a different one than the obvious streets
(`Q101.W5`). For us: the pair's shared road is drawn on the map and the player chooses the order of the two stops.

B. THE CHAIN (one job feeds the other). "Path 4's key needs Path 1's gloves" (`Q015.W4`); "most solutions need facts
from OTHER scenes... solving one unlocks three" (`Q019.W6`); unreachable subjects become reachable by chaining from
scenes where they appear (`Q019.W5`); the chain of objects as a rite (`Q071.W8`). The best emotional payoff in the
library sits at the end of an infrastructure chain where every link is diegetic (`Q138.W3`). For us: one contract in a
pair may carry a thing or a fact that HELPS the other (a name, a route, a key), but never one that is REQUIRED, because
the other was offered alone and must be finishable alone (`Q005.P10`: never gate a chain behind one check).

C. SHARED GROUND (two jobs, one world that remembers both). Infiltrating the bandits in a prior quest changes this
quest's difficulty (`Q008.W5`); a character from an unrelated errand turns out central (`Q023.W5`); a quest pauses and
threads through others so its resolution feels discovered (`Q001.W5`); stories are interconnected and failing one
shows in another (`Q065.W8`). For us: when both contracts are done, the two places are linked on the map (a trade
line, a road safer, a price) and the feed says so in one post.

### 2.2 Why most games fail at overlap

- THE LOG FLOODS. "Taking many quests at once floods the journal into confusion... a directions-based system needs
  FOCUS" (`Q037.X2`). The log grows tired of you ("SOMEHOW YOU ARE ONCE AGAIN HELPING ETHAN", `Q109.W7`). A refused
  offer that sits in the journal for two hundred hours is temptation as UI (`Q131.W4`): powerful once, soup at volume.
  QR-G already ranked journal soup a phone bite of 5 and left the cap open; rule 51 sets it at two.
- THE ERRAND WORLD TOUR. The fetch-chain law is confirmed in at least six teardowns: "a lot of back and forth"
  (`Q079.X1`), "a string of seemingly never-ending fetch quests" (`Q083.X1`), "escort missions across the whole map,
  generic board quests" (`Q084.X2`), the talk-to-A-who-sends-you-to-B middle (`Q071.X3`), seven factions of errands
  (`Q074.X1`), and "go all over town, often visiting the same place multiple times" (`Q113.X1`). Two slots make this
  worse unless the pair shares ONE road. A pair that sends the party east and west at once is a world tour wearing a
  feature.
- BACKTRACKING. Running across the map repeatedly is tedious even for fans; the traversal itself must stay engaging
  (`Q051.X3`). Our map is Battle Brothers': travel is time and road events, so a pair that shares the road turns the
  dead time between two jobs into the trip's middle.
- QUESTS THAT SHOULD TOUCH AND DO NOT. Two quests in the same game whose stakes collide and never register each other
  (`Q134.X8`: the Prince of Plots registers nothing). Characters who never touch each other make a hub with kiosks
  (`Q109.X4`). With two slots, two jobs in the same block that ignore each other read as a bug. The answer is not to
  write every pairing; it is to make the shared ground (the block, the road, the faction) carry the touch.

### 2.3 Which kinds pair well (the Battle Brothers kinds, translated)

Battle Brothers' kinds [R] (reference 08): escort a caravan, deliver a package, clear a camp, hunt a beast, patrol a
road, defend a settlement, recover a stolen thing, investigate a disappearance, a house's war contracts. Ours, in the
six-resource economy and the lab-beast bestiary (rules 42, 47): HAUL (escort a convoy), CARRY (deliver), CLEAR (a camp),
HUNT (a lab beast), PATROL (a road), HOLD (defend a place at a set time), RECOVER (a stolen thing), FIND (a person).

The pairing logic from the library:
1. A MOVE into a place plus a FIGHT near that place is the strongest pair (Paolo's own shape). The move gives the
   reason to be there; the fight uses the presence. The library's version: the delivery that puts you where the hunt
   is (`Q128.W9`: logistics and longing married; `Q062.W8`).
2. A MOVE plus a FIND at the destination pairs well when the cargo carries knowledge for the find, provenance mattering
   more than the object (`Q147.W3`: the deliverable is knowledge with provenance). Helpful, never required.
3. A FIGHT plus a FIGHT pairs badly unless they are on one board: two tough fights back to back with no rest is the
   loss sized for a long sitting (`Q093.X2`, QR-G line 10). Two routine fights (2 to 4 minutes each) on one road is fine.
4. A HOLD (a set time) plus anything is the riskiest pair: a hold is an appointment, and appointments are the clock as
   the dungeon (`Q128.W1`). It pairs only if the other job ends on the same road before the hold's day.
5. Two jobs for OPPOSITE clients against each other are not a pair; they are a fork. The library allows it once, and
   only if both sides are real (`Q016.W7`: the rival claimant raises the stakes; `Q081.W8`: schemes that wreck each
   other). See 2.5.

### 2.4 How a twist or failure in one touches the other

- RATION THE TOUCH. Battle Brothers' twist is a template after the tenth time (`Q236.X2`); generated contracts default
  to exactly what they say and the twist attaches to a strict minority (`Q148.P4`, `Q148.X3`). For pairs: most pairs
  never touch at all beyond sharing the road. At most one pair in five has a touch.
- THE TOUCH IS DISPLACED BUT SIGNALLED. The best delayed consequence detonates "hours later and miles away" (`Q187.W1`),
  but if the stakes are under-signalled it reads as a gotcha (`Q187.X1`). A consequence nobody discovers is trivia
  (`Q092.X6`). A chain that breaks silently is the library's most notorious flaw (`Q071.X1`), and ambient failure needs
  one diegetic tell per broken link (`Q128.X2`). Rule: the touch shows as a face or a board within two map stops
  (QR-S section 4 says the same for situations).
- THE TWIST'S VERBS ARE BATTLE BROTHERS' VERBS. Mid-job: fight, take the other side's offer, or walk away (`Q236.N4`);
  at hand-in: the client refuses and you take it by force or leave unpaid (`Q236.N5`). For a pair, the twist in job A
  may change the SITUATION at job B's place (the convoy's cargo was the thing B's client was robbed of), never B's terms:
  B's fee was locked at B's offer before anyone knew (`Q148.W1`: the fee locks before the truth).
- STACKED, NOT FLAT. One choice hitting three levels at once (`Q016.W4`) is the right size for the one touch a pair
  gets: the personal (a company member's line), the client's place, the road between.
- THE STORYTELLER EBBS. After a hard pair, send relief (`Q044.W7`): the second contract of a pair should not be drawn
  harder because the first went well. The board reads the world (`Q236.W1`), not the player's streak.

### 2.5 Conflicting objectives: when the two jobs want opposite things

- The library's honest version is the same clock for two goods: "revenge and rescue on the same clock... a specific,
  timed, either-or the player cannot dodge" (`Q178.W3`), and splitting the difference saves nobody (`Q206.W8`). But if
  the clock is the only thing forcing it, it reads as a gimmick (`Q226.X3`), and the cost side needs faces or it does
  not weigh (`Q178.X1`).
- So a collision is legal only when (a) the player can SEE it before the second yes: the second client's offer screen
  says the line that makes it plain, and the phone's board shows both posts on the same block; (b) the impossibility is
  structural (both clients want the same cart, the same man, the same water), never a timer added to make it hard; (c)
  both contracts have a stated way to finish that costs something real (QR-G line 12: the "I won't do this part" path
  with a price), so the collision ends in a choice, never a soft-lock (`Q005.P10`, `Q101.X1`).
- A taken contract dropped because of a collision is a deed, as rule 35c says. The library is clear that the refusal
  must be a path, not a deletion (`Q084.X5`), and must leave a line someone says (`Q131.X7`), never an empty stall
  (`Q134.X2`).
- FORCED PAIRS ARE BANNED. A cautious player who reads the warning and stops must be allowed to stop (`Q154.X2`); a
  forced binary at every beat shows the rails (`Q077.X3`). No contract is offered only on condition that another is
  taken, and no client says "only if you take hers too".

### 2.6 A deadline in one against a detour for the other

- A real deadline is teeth (`Q011.W2`), to be used sparingly and to REROUTE on failure, never softlock (`Q011.P3`). The
  hard clock alienates (`Q038.X1`); the generous one focuses without frustrating (`Q018.W8`); no timer at all respects
  the pace (`Q019.W8`). A timer nobody feels is not there (`Q119.X3`); a timer you cannot act on is homework (`Q119.X4`).
- A SILENT timer on good content is "a bug wearing a design costume" (`Q095.X1`); the fix is visible expiry (`Q095.P7`).
  A hidden timer that punishes the game's own taught behaviour is honest once and vicious after (`Q137.X3`), and when a
  timer makes players postpone the content, it fights the writing (`Q121.X6`). A pressure mechanic must never tax the
  player for engaging the talk (`Q142.X3`), and a body-count clock must compel a choice, not paralysis (`Q206.X2`).
- The world's clocks and yours ticking together make a living map (`Q065.W6`); the indifferent simulation is the clock
  (`Q146.W8`), and a world that runs without you is the frame (`Q061.W2`).
- FOR PAIRS: the first contract's deadline is stated aloud by its client in map days (QR-G line 3); the phone shows the
  second contract's detour in map days beside it ("+1 day"), so the player sees the squeeze before he leaves. A deadline
  missed because of a detour is the player's call, priced in the first contract's pay (late = a stated cut), never a
  fail with no warning. A beast that moves (rule 51's own example) moves on the map where the player can see its
  tracks; it never vanishes from the board while a slot holds it.

### 2.7 What the read-only board must show

- THE BOARD IS THE WORLD'S PROBLEMS, NOT A QUEST LIST. Contracts come from settlement situations and write them back
  (`Q236.W1`, `Q236.P1`, `Q236.P4`); a public posting is a job system that never begs (`Q148.W2`). The phone's list is
  this readout, in the feed's third kind of post ("what the world did").
- DANGER BEFORE THE YES. The skulls are a reading (`Q236.W3`); on the phone too, so "too strong for me" is decided at
  home. Renown thins or enriches what is offered (`Q236.W9`).
- THE LOG IS THE NOTEBOOK, NOT THE MARKER. The journal as a detective notebook (`Q037.W3`), the rumour web that always
  gives a thread to pull (`Q018.W3`), the quest log as the character's mind (`Q021.W7`). Bolted-on waypoints remove the
  thrill without fixing the scale (`Q023.X4`); over-marking ruins finding (`Q054.X3`); no marking at all makes guides
  mandatory (`Q114.X3`, `Q071.X2`). So the phone shows WHERE (the place on the map) and WHAT KIND, never a pin on the
  fight board.
- IT AGES. A clock that ticks while you do other things is a device to steal (`Q109.P6`), as long as it is visible.
  Each post shows its age and the day the client says she will ask someone else (QR-O open 4's default). When another
  company takes it, the post does not vanish silently: it reads "taken" for a day, with the company's mark (the Battle
  Brothers rival-company twist [R], as a board fact).
- FOCUS. Two taken, everything else is a list of places (`Q037.X2`). The phone's top lines are the two taken contracts,
  each one line: the client's face, the place, the days left. Below, the board.

### 2.8 What the pair pays, and what it must not pay

- No hidden pair multiplier. Battle Brothers' haggle is solved math the moment players publish it (`Q236.X1`); a pair
  bonus would be solved the same week and every single job would feel like a loss. The pair's gain is days, water and
  food saved, which the player can see and which is real (`Q236.W10`: the wage treadmill makes every day count).
- The pay buys the fix, not the method (QR-S 5); each contract's pay is its own, set at its own offer (`Q148.W1`).
- A crueller branch never pays more (QR-G line 30, QR-X), in either contract of a pair, and the two contracts' pay is
  never summed into a reward that sides with a cruelty (`Q150.P4`: the metagame recuses itself).
- Rewards that are things and doors, not a pile (`Q152.X1`: a title without verbs is a hat). A paired trip's best
  reward is a changed map: two places linked (`Q236.W8`, `Q050.W5` for the same link read by a later act).

### 2.9 The ten that advance an ambition

QR-Z rule 15 keeps the two tables apart: ambitions are never offered in the hall and contracts never at the fire. They
may still TOUCH: a contract's condition can be the step an open ambition counts (a held block, meds in the box, the
name at a gate). The library's lesson is that the heir's estate should be denominated in experiences and places, not
grind (`Q144.X2`, `Q144.W2`), and that what crosses generations best is what was learned. So an ambition-advancing
contract is shown on the offer screen by ONE spoken line from the company's senior member standing beside the player
("That's the pump house, jefe. The one you keep looking at."), never by a tick box, and the contract pays the same with
or without the ambition open. If no ambition is open, the line is not said.

---

## 3. THE PAIRING TABLE (draft:true; the builders' lookup)

| first \ second | HAUL | CARRY | CLEAR | HUNT | PATROL | HOLD | RECOVER | FIND |
|---|---|---|---|---|---|---|---|---|
| HAUL (escort) | never (two convoys) | fine | GOOD | GOOD | fine | risky | fine | GOOD |
| CARRY (deliver) | fine | never (soup) | GOOD | GOOD | fine | risky | fine | GOOD |
| CLEAR (a camp) | GOOD | GOOD | never (two tough) | fine (one routine) | fine | never | GOOD | fine |
| HUNT (a beast) | GOOD | GOOD | fine | never | fine | never | fine | fine |
| PATROL (a road) | fine | fine | fine | fine | never | risky | fine | fine |
| HOLD (a set day) | risky | risky | never | never | risky | never | risky | risky |
| RECOVER (stolen) | fine | fine | GOOD | fine | fine | risky | never | GOOD |
| FIND (a person) | GOOD | GOOD | fine | fine | fine | risky | GOOD | never |

GOOD: the move brings you to the fight or the find. fine: allowed, no special help. risky: allowed only if the phone
shows the days and the other job ends first on the same road. never: the board never draws both on one road at once
(the player may still take both from anywhere; the board just never presents them as a pair).

---

## 4. THE PHONE BOARD, SPEC (UI [phone contracts] builds; RUN [settlement screen] carries the slots)

1. TOP: the two taken contracts, one line each: client face (thumb), place, kind glyph, days left (if any). Nothing to
   tap but the place, which pans the map to it.
2. BELOW: the board, sorted by distance on the road from where the party stands. One line each: settlement name,
   client face, kind glyph, skulls, pay in the six resources (glyphs), age of the post, "waits N days".
3. A FAINT LINE joins two posts that share a road (the pairing table's GOOD cells only), and a small "+N days" sits on
   it: what doing both costs over doing the first alone. No line for "fine" pairs: the player finds those himself.
4. NO ACCEPT, NO OFFER TEXT, NO NEGOTIATION on the phone. The client's lines live on the offer screen at the place.
5. A TAKEN-BY-SOMEONE-ELSE post reads "taken" with the other company's mark for one day, then goes.
6. The phone exists in the city view only (rule 32c), so on the road the player plans from memory and the map; that is
   correct and Battle Brothers' own way.
7. THE ONE WRONG DETAIL (analog horror, for UI): one post on the board is always a day older than it can be.

---

## 5. THE RULE FOR THE BUILDERS (numbered, testable)

1. Two contract slots, one main quest. Test: a third accept is impossible; the offer screen still opens and the client
   says one line about the full slots.
2. Every contract is offered alone, at its own place, at full pay. Test: no contract row carries a "requires" field
   naming another contract; no pay field depends on another contract's state.
3. A pair is a property of the MAP (two posts on one road), never of the offer. Test: pairs are computed from the road
   graph and the pairing table at board time, not authored as bundles.
4. Declining the second never changes the first. Test: the save diff of declining (or not tapping) any offer is empty
   apart from the board's own age counters.
5. The only pair bonus is days and supplies saved. Test: no pay modifier keyed to "two contracts taken".
6. Deadlines are in map days, said aloud at the offer, shown on the phone; detours show "+N days". Test: every
   contract with a deadline has a spoken line naming the day count and a phone field showing it.
7. A deadline missed because of a detour costs a stated cut, never a silent fail. Test: every deadline row names its
   late price; no deadline row has a silent-expiry flag.
8. A beast or party target that moves is shown moving (tracks on the map) and never leaves the board while a slot
   holds it. Test: a held target's position is always drawable.
9. At most one pair in five has a touch (a twist in one changes the other's place). Test: count pairs with a touch
   flag across a long generated save.
10. A touch shows as a face or a board within two map stops. Test: every touch writes a situation at a place no more
    than two stops from where it fired.
11. A touch never changes the other contract's TERMS, only its situation. Test: no touch writes to another contract's
    fee, deadline or target.
12. Two contracts that want opposite things are a fork the player sees before the second yes. Test: the second
    client's offer lines include the collision line; the phone shows both on the same block.
13. Every contract has an "I won't do this part" finish with a stated price (QR-G line 12). Test: every row has it.
14. The board ages and shows age; a post taken by another company reads "taken" for a day. Test: posts carry
    age and a taken state.
15. The phone never accepts, never negotiates, never shows the full offer text. Test: no accept handler in the phone.
16. Ambition-advancing contracts are marked only by one spoken line from the company's senior member at the offer,
    and pay the same with or without the ambition. Test: no ambition field on any pay row; the line has a speaker.
17. Two tough fights are never paired on one road by the board. Test: the pairing table's "never" cells are never
    drawn as a line.
18. Every paired trip's completion links the two places once on the map and in one feed post. Test: completing both
    contracts of a GOOD pair writes one link (a trade line, a safer road, a price) and one post.
19. Fights stay inside time: routine 2 to 4 minutes, tough 8 to 15, never past 15. Test: every contract row names its
    fight size.
20. Pay and costs name the six resources (batteries, food, meds, rounds, tape, water). Test: every pay field is in
    those six or a held part of the city (rule 43).

---

## 6. WHAT TO AVOID (flaw ids)

- Quest-log soup: `Q037.X2`, `Q109.W7` (the log tired of you), `Q131.W4` (the immortal entry, at volume).
- The errand world tour and fetch chains: `Q079.X1`, `Q083.X1`, `Q084.X2`, `Q071.X3`, `Q074.X1`, `Q113.X1`.
- Backtracking: `Q051.X3`.
- Silent breaks and unseen consequences: `Q071.X1`, `Q128.X2`, `Q092.X6`, `Q187.X1`.
- Silent and hard clocks: `Q095.X1`, `Q119.X3`, `Q119.X4`, `Q137.X3`, `Q121.X6`, `Q038.X1`, `Q206.X2`, `Q142.X3`.
- Contrived collisions and faceless stakes: `Q226.X3`, `Q178.X1`.
- Two quests that should touch and do not: `Q134.X8`, `Q109.X4`.
- Solved maths and template twists: `Q236.X1`, `Q236.X2`, `Q148.X3`.
- Forced choices and punished refusals: `Q077.X3`, `Q154.X2`, `Q084.X5`, `Q131.X7`, `Q134.X2`.
- Markers bolted on, or no pointers at all: `Q023.X4`, `Q054.X3`, `Q114.X3`, `Q071.X2`.
- The crunch that forces the yes, now doubled: `Q236.X4`. With two slots the wage burn pushes the player to fill both
  every time; SCAVENGE in the settlement screen stays the second income so one slot can stay empty.
- A soft-lock on a consumable: `Q101.X1` (a pair where job B's exit needs a thing job A spends).

---

## 7. THE TWENTY DESIGNS ON THIS SHELF

FIVE PAIRS (ten files; each names its partner in a PAIRS WITH line and the shared road):
- QD-AE01 THE CHILLED TANKERS TO THE DRY LAKE + QD-AE02 THE HYENAS UNDER THE LAUNCH FENCE (act 3, the rocket; haul + hunt).
- QD-AE03 THE PAPER BACKUPS + QD-AE04 THE MAN WHO WALKED OUT OF BED FOUR (act 3, the Network crumbling; carry + find,
  the cargo helps the find).
- QD-AE05 THE SEED TRUCK UP THE TOWER ROAD + QD-AE06 THE CAMELOPS IN THE GLASS ROWS (act 3, boom; escort + clear,
  with a non-lethal finish).
- QD-AE07 THE COLLECTOR'S RIDE + QD-AE08 THE THIEF IN THE RATION LINE (act 2; escort + find, the one pair with a
  collision, visible before the second yes).
- QD-AE09 THE WATER CARTS TO THE WASH + QD-AE10 THE WOLVES THAT FOLLOW THE WATER (act 1; Paolo's own shape).

TEN THAT ADVANCE AN AMBITION (the QR-Z ambition each one counts toward, in brackets):
- QD-AE11 THE FIRST BATCH FROM FLOOR NINE [MEDS IN THE BOX] (act 3)
- QD-AE12 THE TRAM LINE OVER THE WASH [THE GRAVE WITH A NAME] (act 3)
- QD-AE13 THE DOOR THEY SAID TO SEAL [A ROOM THAT ISN'T RECORDED] (act 3)
- QD-AE14 THE KILN FIRING [FINISH WHAT ABUELA STARTED, the inherited wall] (act 3)
- QD-AE15 THE GROUND TRACK NORTH [THE MAMMOTH] (act 3)
- QD-AE16 THE TABLE ON THE THIRD FLOOR [THE NAME AT THE GATE] (act 2)
- QD-AE17 FOUR DRIVERS AT MILE NINETY [SIXTEEN AND A SERGEANT] (act 2)
- QD-AE18 ONE NIGHT AT THE PUMP HOUSE [PAY THE LOAN OFF] (act 2)
- QD-AE19 THE CATTLE IN THE INTAKE [A WEEK OF WATER] (act 1)
- QD-AE20 THE BOLT OF BLACK WOOL [THE COAT THAT OUTLIVES US] (across, 1 -> 3)
Each pays the same with or without its ambition open; the only mark is the senior member's one spoken line (rule 16).

Weight: eleven of twenty are act 3, the thinnest shelf.

---

## 8. THE ANALOG HORROR LINE

The pair is ordinary: two jobs, one road. The wrong detail lives on the phone and the road, never explained: one post
always a day older than it can be; the line between two paired posts sometimes drawn to a third place with no post;
a convoy's driver who already knows the second client's name.

## 9. OPEN (what the library could not answer)

1. THE SLOT COUNT'S FEEL. No study measures two against one or three on a phone. Rule 51 says two; TUNING holds it.
2. THE BOARD'S REFRESH. Still QR-O open 1. With two slots and a phone board, refresh matters more: a board that changes
   too fast makes planning a pair pointless; too slow makes the phone dead. Suggested start: one post changes per
   three map days per base (QR-O's number), posts wait five to ten days.
3. WHO TAKES THE POST. Battle Brothers' rival company [R] is a twist; whether other companies visibly take posts off
   the board is a WORLD question (roaming parties, rule 33) the library cannot settle.
4. THE PAIR LINE. Whether the phone should draw the faint pair line at all, or leave pairing to the player's eye
   (`Q037.W5`: discovery over direction), is a UI call; this page drafts the line for GOOD pairs only.
5. DROPPING ONE OF TWO. Rule 35c says a taken contract dropped is a deed. Whether dropping the second to save the
   first's deadline reads as a deed or as good sense is Paolo's (it is a values call, not a technical one); the
   default here: a deed, one line from the dropped client, nothing else.
