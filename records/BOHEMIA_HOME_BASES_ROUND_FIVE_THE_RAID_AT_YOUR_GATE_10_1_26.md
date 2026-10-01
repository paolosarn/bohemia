# A CREW AT YOUR GATE: ROUND FIVE, THE RAID CHAIN'S LEDGER HALF
FACTIONS lane, VAMILY rows `[home bases]` (CLAIMED) and `[territory ledger]` (CLAIMED).
10/1/26. MODE: BUILD, engine only, plus one cook in VOTE. Rule 39a: build the default, do not ask.
Rule 40f: the hold is lifted for the map by his ask; RUN [bb map] owns the map's code, so nothing here touches the
map's renderer. Nothing in the alpha changed.

## 1. THE ROW'S NEW LINE, AND THE PREMISE MEASURED FIRST (rule 12)
The coordinator's 9/30 sweep wrote into this row: "'nothing happens when they arrive' is the next row: a crew
arriving at a base you hold is a RAID (LIFE+CITY [where a raid is fought] is in VOTE; COMBAT's board is cut from that
block)." Rule 43 (Paolo 9/29): taking a part is how the base grows, losing one is how it shrinks.
Measured before building:
- Nothing in the game reads an arrival. The live game's `partiesAdvance` already notes a leg change into its card
  line ("a crew reaching the ground it was sent at"), but nothing keeps it, so nothing can open a raid.
- A snapshot cannot see an arrival reliably. The parties module sets `arrived` in the step that arrives and turns
  the crew round on the next step, and a crew's whole trip is 25 to 40 cells against 89 cells a waking day, so a
  clock call that walks many steps at once (a night's sleep) sees a crew arrive AND leave inside one call and never
  knows it came. A gate leg builds exactly that case and shows a before-and-after look at the flag reading nothing.
- The research exists: QUESTS QR-R (questbook/research/QR_R_WHAT_A_SIEGE_IS_9_28_26.md) found a siege is no mode but a
  short chain on one base, WARNING, OFFER, PREPARATION DAYS, ONE FIGHT, OUTCOME. Its answer on what happens when
  nobody comes is the opposite of my round-three default: "the world may take a base whether the player engages or
  not (Q087.W9), but only after a warning in two channels and in stated map days (Q011.P12)", and "a no to a defend
  offer writes nothing; the base's fate is then the world's, not a punishment for the no".

## 2. WHAT WAS BUILT (engine only; engine/bohemia_homebases.js, commit 756a2a94; gate HOME BASES 142 checks, red 69 ways)
The ledger half of the chain. The offer, the preparation and the fight are RUN's, LIFE+CITY's and COMBAT's.
- `advanceWatching(parties, cellsPerDay, days)`: the parties module's `advance`, taken one step at a time, ending in
  EXACTLY the state `advance` would (the gate compares the two byte for byte) and returning every arrival once, in
  the order it happened, even a crew that arrives and leaves inside one call. A drop-in for the clock's own call.
- `raidsFrom(events, seats, rec, who, opts)`: which arrivals are raids. A CREW (not a caravan, not a patrol),
  reaching a base `who` holds, that is not a ruin, whose own home still stands (the rule that silences its party),
  that can be attacked yet (the hard ones late in an act, off his DEPTH thirds; no `progress` given means the start
  of an act, camps only, never a guess open), and that has not already had its raid this act.
- `openRaid(rec, {base, by, power, party, day})`: the raid opens, due `prepDays` after the day, against whoever held
  the base. Refused by name: NO_BASE, NO_RAIDER, NO_DAY, RUIN, NOT_A_CHANGE, ALREADY_RAIDED.
- `closeRaid(rec, {base, outcome, day, how})`: HELD writes nothing to the bases and closes the raid; TAKEN writes the
  base to the crew and RUINED writes the fall, both through the same two writes the rest of the game uses, by 'raid'.
  The fight calls it with how it ended.
- `settle(rec, seats, day, opts)`: the world's answer on the due day, when nobody came. A base at least as strong as
  the crew holds (a tie holds); a weaker one is taken by the crew; the world NEVER ruins a base nobody came to (QR-R:
  ruin is the player's own choice on a take contract); no number on either side means nothing falls; a raid whose
  base changed hands or fell in the meantime is moot and closes as held. Idempotent.
- The base marker carries `raid`: `{by, due}` or null. Ids and a number, never a sentence (a gate leg checks every key).
- The save carries the raids (a few hundred bytes); a save from before them loads as no raid ever came; junk is dropped.
- THE NUMBERS ARE DEFAULTS, NOT RULINGS: `RAID_DEFAULTS = {prepDays: 4, perAct: 1}` (QR-R rule 2 suggests four map
  days; its NOT A FARM finding says at most one siege a base an act) and the one comparison (strength is the act
  power column the game already ranks every faction by, handed out unchanged by the parties module). Every function
  takes an `opts` that replaces them, so TUNING's table can feed them without a code change. `opts.holds(seat, raid)`
  is the seam for anything that should make a base stronger.
- The gate grew from 94 to 142 checks and from 37 to 69 mutations; every mutation is red. Two first-draft mutations
  were silent and each told me something: one showed a check that counted an arrival's step but not its repeats
  (fixed: an arrival is news once), the other showed three `isRuin` tests that `heldBy` already made redundant (a
  ruin answers null), so the module lost the dead lines instead of keeping a test for them.
- The dead shape stays dead: no cell, no grid, no per-lot read in the logic (the gate leg still passes).

## 3. THE FINDINGS (measured on twelve valleys, node seeds, and the live alpha)
- THE FOUR CREWS ARE THE SAME FOUR ON EVERY VALLEY, AND ALL FOUR ARE SENT AT A FORTRESS: Caravans (power 10) at the
  Cartel (12), Cartel (12) at the Remnants (14), Cartel (12) at the Caravans (10), Remnants (14) at the Cartel (12).
  No crew is ever sent at a camp or a town. The powers are authored, not rolled, so the table does not move per seed.
  So today a player who holds only camps and towns can never be raided, and the three raidable fortresses are only
  open two thirds into an act. That is a roster fact, not a rule, and it is WORLD's to change (routed).
- WHAT THE WORLD ANSWERS IF NOBODY COMES: exactly half hold. Caravans' crew at the Cartel base holds, the Cartel's at
  the Remnants holds, the Cartel's at the Caravans falls, the Remnants' at the Cartel falls (24 of 48 over twelve valleys).
- A CREW ARRIVES AT ITS TARGET 4 TO 18 TIMES A WAKING DAY across the four crews (median 6): the valley is 96 cells and
  a trip is 25 to 40, so they shuttle. Without the once-an-act rule a held fortress would be raided every few hours.
  That is why `perAct` is in the ledger and not a polish item.
- ON THE LIVE VALLEY (the alpha's own, a different roll from the node seeds) the trips are 10 and 29 cells and both
  raids open within 29 steps; powers 10, 12, 14 are the same. Camera frames are in the card.

## 4. THE DEFAULT I CHANGED, AND WHY (rule 39a; a real fork, so it is a thumb in VOTE, never a block)
Round three's default was "a base falls only from what the player does until he says otherwise; a siege waits for
the company." I am reversing it, and it should be said plainly because that card is still waiting on him.
Why: (1) his own words are "taken or ruined" (37e) and "losing one is how [your base] shrinks" (43), and a base that
nothing can ever take cannot shrink; (2) QUESTS' QR-R, written after my round three, found the world may take a base
nobody came to, but only after a warning with days on the clock, and that the loss must be legible and survivable;
(3) the coordinator's note on this row says an arrival at a base you hold IS a raid, which needs an end; (4) my
round-three fear was "a valley that rewrites itself while he looks away", and four days of warning in two channels
(the ring on the map, the camp, the days counted in pips) is exactly the answer to that fear.
The new default: four map days, then the world answers; a stronger base holds, a weaker one is taken, never burned.
Thumbs up keeps it; thumbs down puts round three's back (a crew at your gate does nothing until you fight). The round
three card (factions-crews-are-heading-at-bases-9-29) carries a one-line pointer to this one so a thumb on the old
question is not read as a thumb on the new one.

## 5. WHAT WE DO DIFFERENTLY FROM BATTLE BROTHERS (rule 39b)
- Battle Brothers' "raided" is a temporary situation on a town the player does not own, and its siege-shaped contracts
  are jobs somebody else posts. Ours is a clock on a base that is YOURS, and what you stand to lose is hours you spent
  there (LIFE+CITY's lots stand and pay the crew that took them).
- Battle Brothers' crises burn settlements whether you watch or not. Ours takes a base only after four days, only the
  weak ones, and never burns it unattended: ruin stays the player's own choice.
- Where Battle Brothers draws a raid as a still on a banner, ours MOVES: a dashed line and an arrow while the crew
  walks, a camp at the gate, four squares that go down by day, a ring that changes colour when it falls (rule 33g).

## 6. WHAT PAOLO SEES
Tab: VOTE, "A CREW AT YOUR GATE" (slices/vote/FACTIONS_A_CREW_AT_YOUR_GATE_10_1.html, id
factions-a-crew-at-your-gate-10-1). Three real frames of the game's own map with RUN's new building art, rings drawn
over it: (1) two bases you would hold with two Cartel crews walking at them, red dashed rings and dashed lines; (2) a
crew arrived at each, solid red rings, a pink camp and four red squares (four days); (3) four days later with nobody
there: the Remnants base stays gold (14 against 12), the Caravans base is ringed in the Cartel's pink (10 against 12).
Under it a table of all four crews and what the world answers, the thumb, and a line that the fight is not built and
that nothing in the live game starts a raid yet, so the rings are NOT IN A TAB YET on the live map. How it was made:
the driver's `toMap()` lands on the SKY rung so `skyExit()` first; the camera is set so the player's own body is off
the glass and the three seats are centred; the overlay wraps `render()`; every position goes through the game's own
`iso()`; the arrivals, the raids, the four days and the answers all come out of the module run in the page, with the
game's own `BohemiaParties` and `BohemiaTowns` on the live valley.

## 7. ROUTED
- **RUN [bb map] / the clock**: in `partiesAdvance`, call `BohemiaHomeBases.advanceWatching(ps, 1, whole)` instead of
  `BohemiaParties.advance(ps, 1, whole)` (same final state, and it hands back the arrivals), then
  `raidsFrom(events, seats, rec, 'you', {progress})` and `openRaid` for each, and `settle(rec, seats, day)` once a map
  day. The `leg` bookkeeping that feeds the card line can stay. The marker's `raid` is what the map draws (a camp and
  the days left).
- **WORLD [parties move], the BUY half**: today every crew is sent at one of three fortresses, so camps and towns are
  never raided and the player's holdings are never a target. A place should send crews at what is worth taking; the
  player's bases (`ownedBy`) belong in the list `hostilesOf` chooses from. Until then the raid only ever happens to a
  fortress, and only two thirds into an act.
- **COMBAT / LIFE+CITY [where a raid is fought]**: when the company comes, the fight on the base's own block calls
  `closeRaid(rec, {base, outcome: 'held'|'taken'|'ruined', day, how: 'fought'})`. `markers()` says which bases have a
  raid open and who, so the offer can be a mouth at the place.
- **LIFE+CITY [build a lot]**: a base's strength could be the one number a player raises by building. `settle`'s
  `opts.holds(seat, raid)` is the seam: a wall or a lidded tank on your lot can add to the base's power. Not wired; the
  default compares the base's own faction power with the crew's.
- **TUNING**: `RAID_DEFAULTS.prepDays` (4), `perAct` (1) and the stronger-holds comparison are the three numbers.
- **WORLD (the feed)**: `settle()` returns events (`base`, `by`, `outcome`, `how`, `day`): "what the world did" posts.
- **PEOPLE / WORDS**: one person at the gate with one line about the night (QR-R, THE SETTLEMENT TESTIFIES); no text
  was written here.
- **[PENDING coordinator]**: COLOUR IS TERRITORY (8/26) versus rule 37e, my default unchanged from round three.

## Sources
No web search this round. The siege design is QUESTS' own research (questbook/research/QR_R_WHAT_A_SIEGE_IS_9_28_26.md,
which cites the library's findings by id), and the Battle Brothers statements are the library's and round one's:
reference/library/battle_brothers/01_WORLDMAP.md and records/BOHEMIA_HOME_BASES_NOT_TERRITORY_SCHOOL_9_28_26.md.
