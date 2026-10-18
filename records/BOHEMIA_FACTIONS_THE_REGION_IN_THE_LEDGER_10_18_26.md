# THE REGION'S TWELVE PLACES CAN CHANGE HANDS (FACTIONS [region in the ledger], 10/18/26)

Row: VAMILY FACTIONS `[region in the ledger]` THE-REGION'S-TWELVE-PLACES-CAN-CHANGE-HANDS, from
`[take a town]`'s first gap (records/BOHEMIA_FACTIONS_TAKING_A_TOWN_THE_BATTLE_BROTHERS_WAY_10_18_26.md).
Paolo 10/1 (rule 56): "owning the other settlements... is some endgame shit". Paolo 9/30: owning another
settlement is a big deal, endgame, never cheap. Opened by the coordinator (rules 112 to 117), no check-in.
Built under the rule-88 hold: engine, data and gates; nothing drawn, nothing in VOTE, NOT IN A TAB.

## THE GAP, MEASURED

The home base ledger (engine/bohemia_homebases.js) keyed a base by its name and, with no entry, answered
that the base was held by ITS OWN NAME. For the valley's fourteen that is right: a valley seat is keyed
by its faction. For the region's twelve it was wrong:

| asked of an empty ledger | before | after |
|---|---|---|
| heldBy('henderson') | 'henderson' | 'Trades' |
| heldBy('jean') | 'jean' | 'Cartel' |
| heldBy('railroad_pass_crew') | 'railroad_pass_crew' | 'brigands' |
| took henderson -> you, by contract: entry.from | 'henderson' | 'Trades' |
| netFor(act 1) after that take | {you:+1, henderson:-1} | {you:+1, Trades:-1} |
| take.offer at Jean, Remnants at Open | NO_DOOR (the Remnants' war is with the Cartel, not 'jean') | the HIRED door, by the Remnants |

So twelve real places sat on the map that nobody held, and a take there would have written a loss to
a faction that does not exist; rule 31's derive would have read the act as costing the Trades nothing.

## BATTLE BROTHERS (the [bb] line; both quotes re-read off the wiki tarball by REGION BASES)

- Factions and Relations: "As of the full release version 1.1, all human settlements are now aligned
  with a noble house. Independent, unaligned settlements which were present in Early Access builds, no
  longer exist." (region_bases.json school.every_settlement_has_a_house)
- The same page: "Fortified settlements ... belong to different noble houses, and the house which
  controls one can be identified by the flag they wear." (school.the_flag_says_who)

**PROVED US WRONG:** our twelve region places were exactly the unaligned settlements Battle Brothers
cut in 1.1. A town with no owner has nobody to lose it, so taking it means nothing. Fixed.

## WHAT WAS BUILT

1. **engine/bohemia_homebases.js** (and its copy in slices/BOHEMIA_CITY_WORLD.html, byte for byte):
   - `seedOf(base)`: who holds a base nobody has taken. A valley key is its own faction (unchanged); a
     region place is the holder `records/target/bb/region_bases.json` names; a wild location its faction.
     READ FROM THE FILE BY THE MODULE, NEVER HANDED IN BY A CALLER. Under node the file is read on the
     first ask; a page fetches it and calls `setRegion(json)` (the arrival traits' load/set pattern).
     Until a page does, a region place reads as its own id: the old answer, never a wrong faction.
   - `heldBy` and the write (`took`, `ruined`, so raids and takes) read the seed: `from` is the Trades.
   - A seat may carry `base` (its ledger key): the region rows do, the valley's do not. `bases`,
     `ownedBy`, `raidsFrom`, `settle`, `markers` key by it; a base row's `faction` is the seed, never the
     caller's word. `partiesLeft` finds a region base by its people AND the cell its parties left from,
     because the Trades hold a valley seat and Henderson both: taking Henderson silences Henderson's two
     parties and none of the Trades' valley ones.
2. **engine/bohemia_take.js**: the holder is the ledger's answer alone; `t.seed` is gone (a caller's
   word for the holder is never asked). Old saves with a seed on a chain restore and run unchanged.
3. **records/target/bb/region_bases.json**: the two quotes, the rule `a_place_is_held_from_the_first_day`
   (ours: false, Battle Brothers' own), RUN's route now says `base: id` and `setRegion`.
4. **records/target/bb/take.json**: the region gap rewritten as what is still open.

## THE GATES (the ship test)

- **HOME BASES** (gates/homebases_gate.js) section 12, 24 checks: the file carries 12 places and the wild
  rows, no id collides with a valley or graph faction; every place reads its holder on an empty ledger;
  **THE FOURTEEN VALLEY SEATS ANSWER BYTE FOR BYTE** what they answered before (bases, markers, parties
  left, ownedBy, heldBy, netFor, entries; empty and busy ledgers, with the seeds and with none); a caller
  that says Henderson is the Mob's is not believed; change the file and the ledger follows; Henderson
  taken writes from the Trades; Boulder City's fall is the Church's; a raid at Pahrump is against the
  Mob; Henderson's parties silenced and the Trades' valley parties kept; a raid at your Henderson opens
  on base henderson and settles on Henderson's own power; the marker carries the raid. Each of the eight
  fixes was undone one at a time and each turned at least one check red.
  165 ok, 1 failed: the one red is on main before this diff and not mine (BOHEMIA_CITY_WORLD.html reads
  the superseded cell ledger).
- **TAKE A TOWN** (gates/take_a_town_gate.js) leg G, 10 checks plus a seventh mutation: Henderson is the
  Trades' with nobody saying so (the BEEF door); a caller's seed is ignored; Jean is the Cartel's, so the
  Remnants HIRE you (the canon permanent war); the late third binds the region; **HENDERSON TAKEN FROM
  THE TRADES BY CONTRACT**: cut the roads, the siege, the gate surrenders, the Trades send the last force
  from their valley seat, the hold is won, ONE entry {base henderson, from Trades, to you, by contract},
  Trades -1 in the act, Conquered for the wiki's 3 days; Boulder City burned is a ruin from the Church;
  the world taking Henderson mid-chain makes the take moot. 185 passed, 0 failed (was 172). The old
  ledger turns ten of them red.
- **REGION BASES** 247/0 (was 244: the two quotes found on their page, the rule names its wiki line).

## ROUTED

- **RUN**: build the region rows with `base: id` beside `faction` and hand them to the ledger with the
  valley's seats; the map marker wears its holder's banner (the flag says who).
- **RUN TWO**: the settlement screen fetches region_bases.json and calls `BohemiaHomeBases.setRegion`
  before it asks who holds a region place (the same line it already runs for arrival_traits.json).
- **COMBAT** (my lead): nothing new; the take's assault and last force still call `step()`.
- **TUNING**: no new number. The seed is a holder, not a number.

## WHAT IS NOT DONE

Nothing live hands a region place to the ledger yet (the map's region rows are RUN's). The timeline in
VOTE is still owed the round the rule-88 hold lifts. NOT IN A TAB.
