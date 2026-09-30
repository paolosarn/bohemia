# YOUR BASE IS EVERY PART YOU HOLD: ROUND FOUR, THE HELD-PARTS LEDGER
FACTIONS lane, VAMILY rows `[home bases]` (CLAIMED) and `[territory ledger]` (CLAIMED).
9/30/26. MODE: BUILD, engine only, plus one cook in VOTE. Rule 39a: build the default, do not ask.
Rule 40f: the hold is lifted for the map by his ask; RUN [bb map] owns the map's code, so nothing here touches
the map's renderer.

## 1. WHAT RULE 43 ASKED, AND WHAT WAS ALREADY TRUE (rule 12, the premise first)
Rule 43 (Paolo 9/29, "can you only build on your base... is the base not a base anymore but a settlement that
will be blocks and blocks of Las Vegas"): taking a part (raid, contract, boss verb, deal) is how the player's base
grows, losing one is how it shrinks, "you own the held-parts ledger LIFE+CITY builds on", and the base "can be
half the city by act 3".
Measured before building: the ledger from round 47 already writes `took` and `ruined` and reads `heldBy`, so the
whole-part half existed. Three things did not:
- the four ways he named were nowhere: a taking carried no way;
- nobody could ask "who holds THIS BLOCK", which is exactly the question LIFE+CITY's lot builder needs
  (engine/bohemia_lotbuild.js has a site per home base and lots keyed "x,y", and no holding check yet);
- nothing counted "a base is every block you hold".

## 2. WHAT WAS BUILT (engine only; engine/bohemia_homebases.js, commit 73aad0e8; gate HOME BASES 94 checks, red 37 ways)
- `WAYS`, frozen: raid, contract, boss, deal. A write may carry `by`; any other value is refused by name
  (`UNKNOWN_WAY`); a write with none records `null`; the save keeps `by` and a load drops one that is not on the list.
  An undeclared fifth way is a design change and design changes are his.
- `blockHolder(partAt, rec, bx, by, act)`: who holds a block, DERIVED, NEVER STORED. The part a block lies in (the
  caller hands in `partAt(bx, by)` returning `{faction}`: the city's turfAt, or the node gate's turf grid, so the
  module takes data and not another module) laid against the ledger: `{part, holder, state}`. A ruin has no holder.
- `heldBlocks(partAt, rec, who, n, act)`: how many blocks a holder holds over the n-by-n valley. Nothing is kept.
- The gate grew from 75 to 94 checks and from 29 to 37 mutations. New legs: 10d the ways (frozen, refused by name,
  null when none, saved, loaded, a bad one dropped on load) and 10e blockHolder/heldBlocks on the real valley
  (seed 12345): with an empty ledger every one of the 9,216 blocks is held by its own part's crew and each crew's
  heldBlocks is its part's size; a taking flips the WHOLE part and not one block more; `you` holding a part holds
  exactly its blocks; a ruin holds nothing; a taking written in act 2 is not there in act 1.
- THE DEAD SHAPE STAYS DEAD. No per-block storage, no grid, no cell in the module's logic: a gate leg
  comment-strips the code and refuses `turf`, `holderOf`, `grid`, `cell(s)`, `9216` and any require of the
  superseded per-cell ledger. The fought-over painted lot cannot come back through this door.
- Parse-checked the runner after editing (I broke it once this round with a mixed-quote description and caught it
  with `ast.parse`; the runner and the gate are green).

## 3. THE FINDING: HOW A BASE GROWS
Measured off the running game's own map (seed 12345, with the game's own `ctBases()` equal to the module's seats
cell for cell), and the fortress share on five other valleys:
- Every block of the valley belongs to exactly one of the fourteen parts. The smallest part is 331 blocks
  (Volunteers, a camp) and the largest 1,490 (Mob, a fortress). So taking a part hands over ALL its blocks in one
  step: the base grows in at most fourteen jumps.
- The five camps together are 1,949 blocks, **21.1%** of Vegas. Add the four towns (2,108) and it is 4,057, **44.0%**.
  The five fortresses are the other 5,159, **56.0%**, and each one is 5.9% (Caravans, 545) to 16.2% (Mob, 1,490).
- Which parts are open when is my round-47 rule (DEPTH thirds, rule 37e "the hard ones late in an act"): camps at
  the start of an act, towns a third in, fortresses two thirds in. So the most a player could hold is 21% at the
  start, 44% a third in, then 100% once the fortresses open: the base does not creep, it STEPS, and the last step
  is more than half of Vegas.
- "Half the city by act 3" (his words) is reachable WITHOUT the biggest fortress: all camps, all towns and the
  smallest fortress is 4,602 blocks, **49.9%**. Nobody has to take the Mob to get there.
- On five other valleys the fortresses were 47 to 53% of the valley, so the shape is not one lucky seed: the tiers
  make the fortress half about half.
This is an upper bound, "everything that is open, taken". The ledger starts empty and nothing in the game can take
a part yet, so a player at boot holds 0 blocks. That is correct until a way exists (COMBAT for the raid).

## 4. THE DEFAULT I PICKED (rule 39a; a real fork, so it is a thumb in VOTE, never a block)
A base is WHOLE PARTS, never a piece of one. A part is taken or it is not; nobody fights over a lot inside a part.
Why: the piece-by-piece version is the dead 9,216-cell painted territory ledger under a new name (Paolo killed it,
9/28, and the law "a dead shape does not come back under a new name" binds), and a fight for a whole part is the
BB shape he asked for (37e: "taken or ruined"; 43: "raid, contract, boss verb, deal"). What it costs: the base
jumps by the size of the part, 4 to 16 points at a time. Thumbs up keeps whole parts. Thumbs down means split a
part into holdings, and that is his to say in words, because it reopens the door the dead shape used.

## 5. WHAT WE DO DIFFERENTLY FROM BATTLE BROTHERS (rule 39b)
- In Battle Brothers a settlement is never the player's: houses hold them and crises burn them, and the company
  has no home. Ours parts pass to the player whole, by four ways, and a base IS what you hold.
- Battle Brothers has no such thing as "half the map is yours". Our count of what you hold is the growth of the
  base itself, DERIVED from the ledger on every ask, so no save file ever carries a per-block table.
- Battle Brothers shows a settlement's holder by the house colours on its banner. Ours shows "yours" as a gold
  ring on the base and never as ground colour (37e: nothing on the map is territory colour).

## 6. WHAT PAOLO SEES
Tab: VOTE, "YOUR BASE GROWS PART BY PART" (slices/vote/FACTIONS_YOUR_BASE_GROWS_PART_BY_PART_9_30.html, id
factions-your-base-grows-part-by-part-9-30). Three real frames of the game's own map, the same camera each time,
with gold rings on the parts a player would hold: only the five camps (start of an act), camps and towns (a third
in), all fourteen (two thirds in); a bar under each (21, 44 and 100 percent); and the table of the fourteen parts by
size. The rings are NOT IN A TAB YET on the live map: RUN puts the map's markers in. How it was made: the driver's
`toMap()` lands on the SKY rung so `skyExit()` first; city at (70,68), TW 8; the overlay wraps `render()` and every
position goes through the game's own `iso()`; only base markers are drawn, no ground colour. Nothing in the alpha
changed.

## 7. THE COORDINATOR'S 9/30 NOTE ON MY ROW, AND WHAT COMES NEXT
The sweep wrote into `[home bases]`: "'nothing happens when they arrive' is the next row: a crew arriving at a base
you hold is a RAID (LIFE+CITY [where a raid is fought] is in VOTE; COMBAT's board is cut from that block)."
That agrees with round three's default (a base falls only from what the player does): an arrival at a base YOU hold
is an offer and ONE fight the player answers (QUESTS QR-R: a warning on the map, offers, one fight, HELD / TAKEN /
RUINED written to the base), never an automatic loss, and a crew arriving at a base you do NOT hold still does
nothing. What it needs from this lane, DERIVED and NOT built this round: an arrival is an edge (the parties
module's `arrived` going false to true, at the base's own cell), so the read is `arrivals(before, after)` over two
party lists rather than a stored flag, and the base marker can carry `at`. Nothing calls it yet, and the SHAPE of the
offer is LIFE+CITY's and COMBAT's (the raid picture, b202b0e7), so this lane builds the read when that row is on
the board rather than guess the offer. Next round if it is.

## 8. ROUTED
- **LIFE+CITY [build a lot]**: `blockHolder(partAt, rec, bx, by)` is "a lot of a part you hold" (rules 40b and 43);
  hand it the city's turfAt as `partAt`. `heldBlocks(partAt, rec, 'you', n)` is the size of the base.
- **COMBAT (the raid)**: when a fight is won or lost call `took(rec, {base, to, by: 'raid', ...})` or `ruined`;
  `by` must be one of raid, contract, boss, deal or the write is refused.
- **DYNASTY [one then heirs]**: `ownedBy(rec, seats, 'you', act)` (round three) is "the first home base" (39c).
- **WORLD [future city]**: still reads the old per-cell ledger's `netFor`; point it at
  `BohemiaHomebases.netFor` / `ruinsThrough` (routed round 47, still open), then the old ledger can go.
- **WORLD / ECONOMY**: a base's job (power, water, lit wire) is a data gap, six pump stations dark at boot
  (round three, unchanged).
- **RUN [bb map] / COOK [bb map art]**: the ring for "yours" is gold, on the base, drawn from `ownedBy`; the ground
  stays unpainted (37e).
- **PLUMBER**: BATTLE BROS H5 ("LAB's diff touches NO engine module") is red for any lane with an unpushed engine
  diff and green after the push; the census gate rewrites records/BOHEMIA_ENGINE_CENSUS.json on every run.
- **[PENDING coordinator]**: COLOUR IS TERRITORY (8/26) versus rule 37e, my default unchanged from round three.

## Sources
No web search this round. The Battle Brothers statements in section 5 are the library's and round one's:
reference/library/battle_brothers/01_WORLDMAP.md and records/BOHEMIA_HOME_BASES_NOT_TERRITORY_SCHOOL_9_28_26.md.
