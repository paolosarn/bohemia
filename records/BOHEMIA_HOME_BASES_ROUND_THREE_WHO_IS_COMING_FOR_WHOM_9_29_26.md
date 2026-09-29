# FOURTEEN PARTS OF VEGAS YOU CAN RAID: ROUND THREE, WHO IS COMING FOR WHOM
FACTIONS lane, VAMILY rows `[home bases]` (CLAIMED) and `[crews exist]` (closed by measurement).
9/29/26. MODE: BUILD, engine only, plus one measured close. Rule 39a: build the default, do not ask.
Rule 40f: the hold is lifted for the map by his ask; RUN [bb map] owns the map's code this round, so nothing
here touches the map's renderer.

## 1. `[crews exist]` WAS ALREADY TRUE, AND THE BOARD SAID OTHERWISE
The row (coordinator 9/16, FIRST LINE OF THIS LANE): "no crew has ever been on the map ... measure why the third
agenda never spawns ... prove with the one driver that a crew is on the map on day one and its track reads."
Measured on the live alpha, fresh boot (rule 12, the premise first): **4 crews on day one** out of 28 parties
(14 patrol, 10 caravan, 4 crew): Caravans at the Cartel, Cartel at the Remnants, Cartel at the Caravans, Remnants
at the Cartel. **Their tracks read**: `tracksAt` answers at all 4 crews' own cells. Also 4 crews, the same four,
on three node valleys (seeds 12345, 1337, 7). Nothing to build; whoever fixed the third agenda (WORLD's later
`[parties move]` and `[enemies unite]` work) did it after the row was written. The row's "parties gate is 38/1 on
exactly this" is stale too: PARTIES MOVE is red on a clean main for a different reason, its browser leg waits for
`#daycardIn .dcgo`, the wake card that rule 19a removed. WORLD's gate, PLUMBER's list; named, not fixed.

## 2. THE FINDING THAT HAS TEETH: THE WORLD ALREADY WANTS TO RAID, AND NOTHING ANSWERS
A crew's agenda is "going to take something", and what `sendFrom` gives it is a hostile seat: the destination of
all four crews is a RIVAL'S HOME BASE. They walk there, `advance()` flips `arrived`, and they turn round. Nothing
else happens. So the fourteen bases already have intended raids pointed at them and no state to receive one.
Battle Brothers shows this on its map: a party's banner and its destination line, so you read the danger before it
lands (reference/library/battle_brothers/01_WORLDMAP.md, SCOUTING). Ours showed nothing: the bases are thin gold
outlines (the frame in the VOTE card) and a crew is a few coloured pixels of trail.

## 3. WHAT WAS BUILT (engine only; `engine/bohemia_homebases.js`, gate HOME BASES 75 checks, red 29 ways by mutation)
- A PARTY MARKER now says where it is walking (`to`, the cell it is heading for right now: out to its destination,
  or home) and which leg it is on (`leg`, the parties module's own `legOf`, so the patrol says "holding").
- A BASE MARKER now says who is coming for it (`threat`, an array of faction ids): a crew that is OUT (not on its
  way home), whose destination is that base's own cell, and that does not belong to whoever holds the base. Derived
  from the parties that still exist, never stored, sorted, ids only. A crew going home threatens nobody; a base the
  hunter now holds is not threatened by the hunter's own crew; a ruin is not threatened; a crew whose own base fell
  is gone and threatens nobody. The order the parties are handed in changes nothing.
- `ownedBy(rec, seats, who, act)`: which bases a holder has right now, read at an act. Two rules need it and named
  it: rule 39c (the first home base is the default unlock of the second generation) and rule 40b (building only
  inside a settlement you own).
- Measured with it: the same threats on every valley I tried: Caravans threatened by the Cartel, the Cartel by the
  Caravans and the Remnants, the Remnants by the Cartel. 3 of 14 bases, 4 crews.

## 4. THE DEFAULT I PICKED (rule 39a; a real fork, so it is a thumb in VOTE, never a block)
When a crew reaches a base, NOTHING HAPPENS, and that stays true. **A base falls only from what the player does**,
until he says otherwise. Why: a valley that rewrites itself while he is looking away changes the economy under his
feet (bases feed rent, lights and shelves) and the future is meant to be COMPUTED FROM HIS PAST (rule 31, 37c), not
from a background simulation he cannot see. This also answers QUESTS QR-R's flag "how a siege resolves when the
company is absent": it does not; a siege waits for the company. The other way is one line (a crew that arrives calls
`took` or `ruined` by strength), and the warning above is exactly how that siege would begin (QR-R: warning on the
map, offers, preparation days, ONE fight, HELD / TAKEN / RUINED written to the base). Thumbs up keeps the default,
thumbs down turns the world loose.

## 5. WHAT WE DO DIFFERENTLY FROM BATTLE BROTHERS (rule 39b)
- BB's destination line is for parties within sight of you. Ours is derived for every party and a base can read who
  is coming; the warning belongs to the BASE, which is what lets the future carry it across acts.
- BB's raids and sieges resolve in the world whether you watch or not, through its crises. Ours wait for you by
  default (section 4), which is our own way of keeping the future readable.
- BB writes the state on the settlement's screen. Ours writes no words at all: a ring, a line and an arrow, and the
  people carry the sentence (37e, rule 19).

## 6. MEASURED, AND WHAT IT SAYS ABOUT "EACH DOING A DIFFERENT THING" (live alpha, one seed; the pump and lit-wire
reads need the city, so the node seeds were not measured for these)
- POWER MADE (`minesFor`, sites, one battery each per day): Network 2 (solar), Cartel 1 (the dam), Trades 1 (solar),
  Volunteers 1 (battery). **4 of 14 bases make anything; 10 make nothing.**
- LIT WIRE HELD BY NAME (cells, `POWER.at().faction`): Network 67, Mob 18, Volunteers 15, Reds 8, Colorful 8, Trades 7,
  Cartel 4, Church 3, Remnants 3, Custom 2, Blues 1, Caravans 1; **Anarchists 0, Homeless 0**.
- WATER (`pumpStations()`): 6 pump stations, held Anarchists 2 and Network, Mob, Remnants, Homeless 1 each. **All six
  are DARK at boot.** ECONOMY Q47's "Anarchists hold all the live water" (9/22) is not what this valley reads now:
  nobody has live water. The likely cause is WORLD's 9/27 ruling that the light is in clusters, which moved the lit
  cells off the pumps' streets; I did not prove the cause. It is WORLD's and ECONOMY's to re-measure.
- SO THE LAW'S SENTENCE, "each powering and watering its own blocks", IS TRUE OF A FEW AND FALSE OF MOST on the data
  we have: bases differ in kind (12 kinds), tier (5/4/5) and wire held (0 to 67), but 10 of 14 make no power and none
  has live water. A base's JOB is not yet a fact the game holds. Routed below; I did not invent one.

## 7. WHAT PAOLO SEES
Tab: VOTE, "FOUR CREWS ARE ALREADY WALKING AT SOMEBODY'S BASE" (slices/vote/FACTIONS_WHO_IS_COMING_FOR_WHOM_9_29.html,
id factions-crews-are-heading-at-bases-9-29). Real frames of the game's own map, same camera: the south-east as it is,
the same frame drawn from the list (every crew's line, the four going-to-take-something crews thick and dashed with
an arrow, red rings on the three bases a crew is heading at), and the whole valley the same way. The markers are NOT
IN A TAB YET on the live map: RUN puts the map's markers in this round. How it was made: the driver's toMap() lands
on the SKY rung, so skyExit() first; city at (70,68), TW 8; parties advanced 0.06 of a waking day through the game's
own partiesAdvance so all four crews are out and none has arrived (at 0.15 two had already turned home and the
threat correctly vanished); the overlay wraps render() and every position goes through the game's own iso().
Nothing in the alpha changed.

## 8. ROUTED
- **RUN [bb map] / COOK [bb map art]**: draw from `markers()`. A party's `to` is the destination line, `leg` says
  out or back, a base's `threat` is the warning ring. The four cooked party shapes map to agenda (caravan, patrol,
  crew). To get the module into the city the way WORLD's riders do, follow tools/bohemia_city_work_patch.py's RIDERS
  pattern with a small patch of your own and keep ENGINE SYNC green; FACTIONS does not touch the map's renderer while
  RUN is rebuilding it.
- **DYNASTY [one then heirs]**: `ownedBy(rec, seats, 'you', act)` is the read for "the first home base" (39c).
- **LIFE+CITY [build a lot] / RUN [settlement screen]**: `ownedBy` is "a home base you own" (40b).
- **WORLD / ECONOMY**: six pump stations, all dark at boot; Q47's "all the live water" needs a re-measure; the base's
  job (power, water, lit wire) is a data gap, not a picture gap. PARTIES MOVE's browser leg is stale (the wake card).
- **PLUMBER**: BATTLE BROS H5 ("LAB's diff touches NO engine module") goes red for ANY lane with an unpushed engine
  diff; the lab it guards was retired 9/4; it is green again after the push. And the engine census gate rewrites
  records/BOHEMIA_ENGINE_CENSUS.json on every run, so a lane that runs it dirties the tree with other lanes' modules.
- **[PENDING coordinator]**: COLOUR IS TERRITORY (8/26, gate faction_colour_gate.js) still says a faction's colour is
  its ground; rule 37e says nothing on the map is drawn as territory colour. My default for both: the colour lives on
  the base's banner, the party's banner and the light, and the ground stays unpainted; the border, the ground ink and
  their gates would be re-aimed, not deleted blind. I did not touch them while RUN is in that code.
- **QUESTS QR-R**: section 4 is the default for its absent-company flag.

## Sources
No web search this round. The banner-and-destination-line fact is the library's own recall, which its header marks
as recall unless a source is cited: reference/library/battle_brothers/01_WORLDMAP.md, SCOUTING. Round two's sourced
notes on how many parties Battle Brothers runs are in records/BOHEMIA_HOME_BASES_ROUND_TWO_THE_MARKER_LIST_9_28_26.md.
