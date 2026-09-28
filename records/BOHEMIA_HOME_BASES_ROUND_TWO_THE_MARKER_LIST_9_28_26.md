# FOURTEEN PARTS OF VEGAS YOU CAN RAID: ROUND TWO, THE MARKER LIST
FACTIONS lane, VAMILY rows `[home bases]` (second half: "then the map's marker list with WORLD and COOK")
and `[territory ledger]` (RE-AIMED 9/28, rule 37e: "the ledger records who holds which HOME BASE").
9/28/26. MODE: BUILD, engine only. Nothing on the play surface (rule 18 hold untouched).
Paolo, rule 37e (laws/BOHEMIA_ADDENDUM_THE_THIRD_VOTES_9_28_26.md s5): "FOURTEEN HOME BASES ... and MANY
ROAMING PARTIES ... A home base can be attacked: taken or ruined; the hard ones late in an act; a SIEGE is
a research question. No building portraits; no text on screen he did not ask for."

## 1. A CORRECTION TO ROUND ONE, AND IT WAS MINE
Round one (records/BOHEMIA_HOME_BASES_NOT_TERRITORY_SCHOOL_9_28_26.md) wrote: "28 parties already roam,
already 'way more than fourteen', his own bar." That compared our number to HIS GUESS and never measured
Battle Brothers. His row said: "look into how many groups move around at a time in BB." Our library
(reference/library/battle_brothers/01_WORLDMAP.md) has no such number, so I never had it.
Round two went and looked. What is publicly known, all from search snippets because the dev blog, the wiki
and the Steam pages are egress-blocked here (so none of it was read in full; DIRECTION [bb density] hit the
same wall):

- BB publishes NO fixed count of parties at once. It is emergent: every location, settlements and hostile
  camps alike, "buys" parties out of its own resources, each with its own agenda, and sends them out;
  "smaller locations do so less and in fewer numbers" (the developer blog, #52 and #66).
- A camp is weaker until its party returns; players report a camp sending a group every one to two days.
- A typical map has 17 settlements split among three noble houses (6/6/5 up to 10/5/2), plus the hostile
  locations, each of which also sends parties.
- The "24 and 40" cap a mod mentions is a warband's SIZE (men in a roaming party vs in a camp), NOT a count of
  parties. I nearly read it as a count. It is not one.

SO THE HONEST STATEMENT IS: there is no BB number for us to beat, and our 28 is not "already enough". The
finding that proves us wrong is different and it is in our own code, measured:

**OUR 28 PARTIES ARE A FIXED ROSTER.** bohemia_parties.all() runs once; sendFrom() gives each seat REACH
parties (fortress 3, town 2, camp 1) only if it has a hostile, a border or a friend; every party then walks
to its destination and back FOR EVER (advance() turns it round: "home again, and out once more"). Nothing
buys one, loses one, replaces one, or costs its base anything. WORLD's own header quotes the row, "Places BUY
and SEND parties out of what they have", and the code ships only the SEND half, once, at boot. So a home
base that fell would keep sending its patrols for ever. That contradicts his "taken or ruined" on its face.

Also measured, both on the live alpha: day one has every party still standing ON its own base (nothing has
been advanced), so all 28 hide under the 14 markers until the game's clock has run; after two waking days 24
of 28 are away, at most 10 cells out. And `ctBases()` (what the map draws) equals `BohemiaTowns.derive()`
cell for cell, 14 for 14: there is ONE definition of the fourteen, no drift.

## 2. WHAT WAS BUILT
`engine/bohemia_homebases.js`, gate `gates/homebases_gate.js` (59 checks, red twenty ways by mutation,
registered as HOME BASES after TURF LEDGER).

- **Fourteen whole entities, the seats.** One base per `BohemiaTowns.derive()` row; nothing is placed here.
  A base is HELD (its own people), YOURS, TAKEN (by another crew) or RUINED. Taken or ruined as a whole.
- **A small per-act ledger** (shape taken from bohemia_century: `{V, act, entries[]}`, an act that never runs
  backwards, an entry stamped with act, day and sequence). `took(rec,{base,to,day,why})`, `ruined(rec,{base})`.
  `from` is READ off the ledger, never taken on the caller's word. A ruin cannot fall twice and cannot be
  moved into in the act it fell in; a generation later it can be reclaimed (the future goes both ways, 37c).
  `netFor(rec,act)` is the signed arithmetic the derive reads (raided falls: -1 to the holder, +1 to nobody).
  `heldBy(rec,base,act)` reads at an act, so act 1 has not seen act 2. An older save loads as act 1, nothing in it.
- **The hard ones late in an act, off his own DEPTH thirds.** `openAt(tier) = DEPTH[tier] - DEPTH.camp`, so a
  camp is open from the start, a town a third in, a fortress two thirds in, and the cut moves with the table it
  comes from (the gate mutates T.DEPTH to prove nothing is typed). How far through an act the game is,
  `progress`, is the CALLER's; without it the answer is null, never a guess. Nobody raids a ruin.
- **A party exists because its home base still holds it.** `partiesLeft(parties, bases)`: a base that is
  ruined, yours, or taken sends nobody. With an empty ledger it returns the parties it was given, unchanged.
- **The marker list.** `markers(seats, parties, rec, act, {progress})`: 14 base markers (where, whose,
  glyph = the district kind, tier, state, raidable) plus one marker per party still out (where it is now,
  whose, agenda, strength = the game's own power rank). IDS, CLASSES AND NUMBERS, NEVER A SENTENCE: the gate
  refuses any key that could hold prose and any string that is not an id or class (37e, "no text").
- **Not the dead shape.** The gate strips comments and refuses `turf`, `holderOf`, `grid`, `cell(s)`, `9216`
  in the logic, refuses a require of the superseded ledger, and refuses any file other than the named few
  touching that ledger. Fourteen wholes; nothing to paint.

## 3. MEASURED (real valley, seed 12345 in node; the live alpha for the picture)
14 bases (5 fortress, 4 town, 5 camp). 28 parties (14 patrol, 10 caravan, 4 crew). Open to attack: 5 at the
start of an act (the camps), 9 a third in, 14 two thirds in. A raid of Mob ruined + Cartel yours + Blues taken
by Church: 28 parties become 20. **At the map's current whole-valley zoom 6 of the 14 markers overlap another**
(Cartel/Custom 8.4 px; the north pile Mob, Network, Reds, Volunteers at 6.3 to 13.4 px): that is the map's
pixel count, not the list, and it is rule 38a's whole point.

## 4. WHAT PAOLO SEES
Tab: VOTE, "THE FOURTEEN HOME BASES ON THE MAP" (slices/vote/FACTIONS_THE_FOURTEEN_HOME_BASES_9_28.html, id
factions-the-fourteen-home-bases-9-28). Real frames of the game's own map, same camera: the map as it is (the
14 crews are faint gold outlines), the list drawn on it, a raid, the north pile close up before and after, and
early / a third in / two thirds in. The markers themselves are NOT IN A TAB YET: the play surface is on hold.
The picture is drawn by putting the list's x,y through the game's own `iso()` after the game's own `render()`,
in a throwaway session; nothing in the alpha changed. Two things about the frame worth knowing: `toMap()` lands
on the SKY rung ('REGION'), where the horizon clips half the valley, so the cook steps off it with the game's
own `skyExit()` and centres the camera; and the map redraws only on demand (no continuous loop), so the overlay
wraps `render()` rather than drawing once.

## 5. RETIRED WITH THIS
- `factions-two-ladders-neither-reads-ground-9-27` (VOTE): its ask, "thumbs up and I wire territory into
  standing", died with rule 37e. It was waiting unjudged. Removed from the registry; nothing referenced it.
- `factions-home-bases-not-territory-school-9-28` (VOTE): round one's card said "already way more than
  fourteen like you wanted". Replaced by the card above, which carries the correction. Unjudged.
- `[track leg]` (VAMILY): the words a footprint says on the walked street. The walk it spoke on is removed
  (rule 38b). The direction a party is heading is now carried by the map trail's fade and by the marker
  list's party `at` and `agenda`. WORDS' Q23 lines stay in banks/ untouched.

## 5b. WHAT WE DO DIFFERENTLY FROM BATTLE BROTHERS (rule 39b: so nobody can call it a rip-off)
- BB's settlements burn in a late crisis and stay a scenery of the campaign. OURS ARE A LEDGER THE FUTURE IS COMPUTED
  FROM: a base taken or ruined is a signed mark, and act 2 and act 3 are derived from it (raided falls, reclaimed
  rises), so the same map can be drawn at three dates (rule 31, 37c). BB has no derive across acts.
- BB's three houses hold a third of the map each. OURS ARE FOURTEEN CREWS WITH THEIR OWN COLOURS, and a base's job is
  what the valley runs on, power and water and lights, not gold and food: Homeless powers the valley from a camp,
  Anarchists hold all the live water, and a crew that cannot pay goes dark a block at a time (lights, not a flag).
- BB labels its map. OURS CARRIES NO TEXT: a marker is an id and a class, and the world says it with lights, people and
  trails, never a label (37e).
- BB's parties are bought and lost by an economy we do not have yet. Ours are a fixed roster today, which is the honest
  gap in section 1, not a difference to be proud of.

## 6. ROUTED
- **WORLD [future city]** (bohemia_future.js, not mine): the report card's `territory` field reads the
  superseded ledger's `netFor`. Point a `bases` field at `BohemiaHomeBases.netFor(rec, act)` and `ruinsThrough`;
  that is the "raided falls" number WORLD named as unreadable ("a raid on somebody else's block has nothing to
  subtract from"): a fallen base is a signed -1 in whole bases, no per-block count needed.
- **WORLD [parties move]** (bohemia_parties.js, not mine): the SEND half exists once, at boot. The BUY half
  (a base pays for a party out of what it has, is weaker until it returns, replaces a lost one) is the fixed-
  roster gap above. `partiesLeft` is the seam: WORLD can call it, or own the fuller answer.
- **COMBAT [bb fight]**: `took()` and `ruined()` are what a raid's ending calls. `raidable(tier, progress)`
  says which bases may be attacked yet. How a fight ends and what it costs is theirs and his.
- **RUN [bb map] / COOK [bb map art]**: draw from `markers()`. Sizes by tier, colour by holder, a ruin on top.
  The map's own pixel count is DIRECTION [bb density]'s floor and RUN's build; this list cannot fix 6 of 14
  overlapping at 3.75 px a cell.
- **UI [settlement screen]**: a base's `state` and `raidable` are what the screen needs to say "yours", "ruined",
  "not yet". No text lives in the list; the screen's speaker says it.
- **QUESTS [the siege]** (research, running): a siege is a base under attack over time. The list is one
  state per base, so a siege is a state the ledger does not have yet; their page is what would add it.
- **When the hold lifts (FACTIONS, my own code):** the map still paints the per-lot territory ink and a border
  (rows [who holds], [colours fixed], SHIPPED 9/6). Rule 37e says nothing on the map is drawn as territory
  colour. That paint is mine and it leaves the play surface when the coordinator lifts rule 18.
- **[PENDING coordinator]:** CLAUDE.md's pillars paragraph still says "the house-sized fight tile is dead for
  good" and "never a fight where one tile is one sidewalk". VAMILY rule 38's own correction, the same hour,
  says A COMBAT TILE IS A HOUSE stands in full and the sidewalk cell was the walk. Two live files disagree.
- **Next round, this lane:** each base "doing a different thing": power and water as facts on the marker
  (Homeless holds 254 of the 308 generating cells, Anarchists all the live water: two bases already differ,
  measured by WORLD [bb places] and ECONOMY Q47), read off minesFor and the pumps and handed in, never typed.

## Sources (search snippets; the primary pages are egress-blocked here and were not read in full)
- [Dev Blog #66: Progress Update, Putting the Pieces Together](https://battlebrothersgame.com/dev-blog-66-progress-update-putting-the-pieces-together/) and [Dev Blog #52: Worldmap Rework](https://battlebrothersgame.com/dev-blog-52-worldmap-rework/), every location sends parties, smaller ones fewer; each buys parties from its resources (both came back for the search; the snippet did not say which page carries which sentence)
- [What determines what the roaming parties are like? (Steam)](https://steamcommunity.com/app/365360/discussions/0/4634861089657502146/), parties spawn from camps; nearby camp type decides them
- [Camps spawn (Steam)](https://steamcommunity.com/app/365360/discussions/0/2381701715726892596/), players report a group from a camp every one to two days
- [Global Map, Battle Brothers Wiki](https://battlebrothers.fandom.com/wiki/Global_Map) and [Settlements and attached locations](https://battlebrothers.fandom.com/wiki/Settlements_and_attached_locations), a typical map is 17 settlements across three houses
- [Better Enemy, Battle Brothers Nexus](https://www.nexusmods.com/battlebrothers/mods/1137), the 24-and-40 warband SIZE caps, which are not party counts
