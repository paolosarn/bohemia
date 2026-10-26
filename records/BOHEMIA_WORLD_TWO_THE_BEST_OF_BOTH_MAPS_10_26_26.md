# WORLD TWO [the best of both maps] (rule 243, Paolo 10/26) -- THE RESEARCH, THE PICKS CHECKED, AND WHAT WAS BUILT

HIS WORDS (verbatim, voice to text; 'Walheim' is Valheim): "I just want you to think about Walheim's map and I want you to
think about how battle Brothers map is bro like let's do the best of both worlds. I know they're supposed to be bosses in this
game where you're able to alter the map and shit going on in the world around you so that's gonna be super important bro."
Ruling record: records/BOHEMIA_PAOLO_THE_MAP_IS_VALHEIM_AND_BATTLE_BROTHERS_THE_BEST_OF_BOTH_10_26_26.md. Row: WORLD's board,
[the best of both maps], CLAIMED for WORLD TWO (session_01U8FWMSoy).

HOW THIS WAS RESEARCHED, HONESTLY: this box can search the web but cannot open a page (WebFetch: DNS refused for every host;
the same egress wall the Battle Brothers library has said since 9/27). So every web citation below is a SEARCH RESULT (title and
URL, and the snippet the search returned), never a page read in full. Battle Brothers is also cited from the repo's own library
(reference/library/battle_brothers/01_WORLDMAP.md) and the wiki pages already pulled into the repo
(reference/library/grok/wiki/pages/). Anything from memory is marked (recall).

---------------------------------------------------------------------------------------------------------------------------
## 1. VALHEIM'S MAP AND PROGRESSION

1. THE MAP STARTS BLANK AND FILLS IN WHERE YOU WALK. "A new world starts with a blank map under fog of war, and walking uncovers
   the ground you cross and what's immediately visible. The map records everywhere you've been by revealing the biome tiles of
   the areas you have covered." (Corrosion Hour, "The Valheim Map: Markers, Biomes & Points of Interest",
   https://www.corrosionhour.com/valheim-how-to-use-the-map/). The reveal is a constant circle round the player: one mod author
   reports the game's files say 100 m and the visible clear is about 128 m because the fog is stored in 64 m cells (search
   snippet, nexusmods.com/valheim/mods/1810, unverified; a single third-party account). Weather, night and boats change how much
   is revealed in mods (nexusmods 329, 1810), not in the base game.
   WHAT THE UNSEEN SHOWS: NOTHING. Valheim's unexplored map carries no terrain, no coast, no biome: it is blank under the fog
   (Corrosion Hour, above). Nobody sees the shape of a place before going there.
2. POINTS OF INTEREST appear as white icons once you are within 300 m (Corrosion Hour). Your bed is a marker.
3. HIS OWN PINS. Double-click the map drops a pin; a right-click on your own pin removes it; a left-click crosses it out, "ideal
   if you have already explored a location like a cave" (Game8, https://game8.co/games/Valheim/archives/320737). The vanilla icon
   set could NOT be confirmed by search (every hit was a mod: WebMap's 'dot, fire, mine, house, cave', github.com/kylepaulsen/
   ValheimWebMap; AutoPinSigns' 'fire, base, hammer, dot, portal', github.com/shudnal/AutoPinSigns). (recall: vanilla has five
   icons, a fire, a house, a hammer, a dot and a portal, and a name typed under the pin.)
4. THE DEATH MARKER. "The player's death marker is the only other automatically deployed marker, showing your gravestone until
   you return to loot the items you dropped" (Corrosion Hour). It GOES AWAY when you recover your things.
5. THE BOSS IS FOUND BY A STONE. Vegvisir runestones mark boss altars on your map: "A glowing red Vegvisir sits beside the
   Sacrificial Stone where you spawn. Interacting with it adds the nearest Eikthyr altar to your map" (search summary of
   allthings.how, https://allthings.how/every-valheim-boss-in-1-0-locations-summons-and-rewards/, and the Steam threads
   https://steamcommunity.com/app/892970/discussions/0/3102389184721411895). Each biome has its own (the smaller stones in the
   swamp lead to Bonemass; the Plains' stonehenges to Yagluth). Players report it marks the nearest altar, not always (Steam,
   https://steamcommunity.com/app/892970/discussions/0/4206993639695655881). THE FIRST ONE IS AT YOUR FEET when the world starts.
6. THE ORDER IS A LADDER OF BIOMES: Meadows, Black Forest, Swamp, Mountains, Plains, Mistlands, Ashlands, the Deep North, each
   gated by its boss: Eikthyr, the Elder, Bonemass, Moder, Yagluth, the Queen, Fader, Kall Fimbulbringer (allthings.how,
   https://allthings.how/valheim-progression-guide-every-biome-boss-and-key-drop/; xgamingserver.com/blog/valheim-progression-guide).
   Biome map colours could not be confirmed by search. (recall: each biome has its own colour on the map, and the colour is the
   danger.)
7. WHEN A BOSS FALLS, THE MAP DOES NOT CHANGE. THE WORLD DOES. A boss kill sets a world-wide flag (a 'global key':
   defeated_eikthyr, defeated_gdking, defeated_bonemass...) and the keys decide the raids, the world's spawns, the dreams and the
   trader's stock: the Boars and Necks raid stops once Eikthyr dies and the Greydwarf raid starts and runs until the Elder falls
   (gamever.io, "Global Keys in Valheim: Why One Player's Kill Makes the World Harder for Everyone",
   https://gamever.io/knowledge-base/global-keys-in-valheim-why-one-players-kill-makes-the-world-harder-for-everyone; Prima,
   https://primagames.com/gaming/valheim-what-are-raids-and-how-to-survive-them-guide). (recall: the boss's trophy and drop are
   the key to the next tier: Eikthyr's antler makes the pickaxe that opens copper and tin.)

## 2. BATTLE BROTHERS' MAP

1. THE WHOLE MAP IS SHOWN BY DEFAULT. The fog is an OPTION: "A new and entirely optional way to play your campaign is with a map
   that is unexplored in the beginning, save for your immediate surroundings. You'll have to discover the lay of the land and
   uncover every settlement yourself", recommended only for experienced players "since contracts may send you to settlements
   that you've never been to and that you have to find first" (Developer Blog #144, mirrored at gamebanshee.com/3dfpa; earlier,
   Dev Blog #55 "Region Labels and Worldmap Exploration": "a hidden worldmap that the player gradually uncovers, to add to the
   sense of exploration", https://www.moddb.com/news/adding-region-labels-and-an-explorable-worldmap). A mod (Partially
   Explored Map, github.com/jcsato/partially_explored_map) reveals the nearest faction's settlements and nothing else.
2. SIGHT clears the fog: a radius never printed, multiplied by terrain (hills 1.25, mountains 2), the Lookout follower +25%,
   night shorter (the library, 01_WORLDMAP.md, sourced by FACTIONS 10/18). Vision is also what a man sees in a fight: "Vision, or
   view range, determines how far a character can see to uncover the fog of war, discover threats" (the wiki's Attributes page,
   reference/library/grok/wiki/pages/0160_Attributes.txt).
3. A PLACE THAT CLEARS THE FOG: the legendary Ancient Spire: "Well, at least we got a lay of the land. The fog of war gets
   cleared in a large circle around the tower" (reference/library/grok/wiki/pages/0108_Ancient Spire.txt).
4. TRACKS, SCOUTING, PATROLS, CARAVANS, ROADS FASTER (the library, 01_WORLDMAP.md, recall, with FACTIONS' sources).
5. THE MAP CHANGES BY WAR, NOT BY BOSSES: the late crises change it (the noble war: settlements change hands; the greenskin
   invasion: settlements burn), a cleared camp leaves the map and its situation ends ("clear the camp, the ambush situation ends
   and prices fall", 01_WORLDMAP.md), and a conquered town is "Conquered for 3 days" after (FACTIONS 10/18, the wiki tarball).
   No source says clearing a camp thins the roaming parties of a REGION (search: Steam threads only, anecdote both ways).
6. NO PINS. Battle Brothers has no player markers (recall); the contract's target is marked by the game.

---------------------------------------------------------------------------------------------------------------------------
## 3. THE COORDINATOR'S FIVE PICKS, CHECKED (rule 205: his to change; rule 243(d): fix any that are wrong)

(a) KEEP ALL OF BATTLE BROTHERS' MAP. RIGHT, ONE CORRECTION OF FACT: Battle Brothers' default is the WHOLE MAP SHOWN; the fog is
    its optional Exploration Mode. Ours is fog on, by HIS ruling (rule 155, 10/24: 'most of the map is hidden... it gives you the
    option to reveal all settlement locations'), so nothing changes; the record now says whose choice it was. Battle Brothers'
    own warning (a contract sends you to a town you never found) is the exact defect EYES found on 10/25 ([eyes: the place in
    the dark]) and WORLD already answered (a job names its place on the map).
(b)1 THE MAP FILLS IN WHERE YOU HAVE BEEN, THE UNSEEN FAINT, ITS SHAPE THERE. HALF RIGHT, AND THE HALF THAT IS NOT VALHEIM IS
    KEPT ON PURPOSE: Valheim's unseen is BLANK (1.1 above), it shows no shape. The pick's 'shape there, detail not' is OURS, and
    it is the better reading for this game: REALISM FIRST (the 8/4 law): a crew born in Las Vegas knows the grid, the Strip's
    towers and the freeway; what nobody knows ten years after the dollar is WHO IS THERE NOW and WHAT IS OPEN. The shape is
    memory, the detail is news. It also keeps 'never a black void' and Pocket City 2's whole-city-on-one-screen (rule 6) true.
    So: built as picked, sourced to us, not to Valheim.
(b)2 HIS OWN PINS, A CROSS WHERE A MAN DIED. RIGHT, TWO FIXES: (i) Valheim's death marker LEAVES when you loot it; ours STAYS,
    because a Battle Brothers man is dead for good (CAMP's dead list, rule 226) and he can take it off by hand (Valheim's
    right-click, our hold); (ii) Valheim's left-click CROSS-OUT (a cave done) is a third thing a pin does: not built this round,
    on the NEXT line. The five icons are a translation, not Valheim's set: CAMP (its fire), DANGER, LOOT, SHOP, A WORD (its name).
(b)3 THE BOSS IS FOUND BY A SIGN. RIGHT. One fix of shape: Valheim has a stone for every boss in every biome; ours CHAINS, one
    sign at a time, for the NEXT boss on his ladder, and the next sign turns up where the last one fell. The ladder is HIS ORDER
    (records/BOHEMIA_THE_BOSS_LADDER_v7_8_7_26.md) and Valheim's first stone sits at your feet, so ours does too: the first
    sign is inside the circle he sees when the game starts.
(b)4 THE BOSS CHANGES THE MAP. WRONG AS ATTRIBUTED: Valheim's map does not change when a boss falls (1.7); its WORLD does (the
    raids, the spawns, the trader). Changing the MAP is HIS OWN IDEA, in his words above, and Battle Brothers' nearest is its war
    (2.5). So the pick is kept and cited to him, and Valheim's real lesson is ADDED, routed: when a boss falls the world answers
    everywhere (what roams, what raids, what the stall sells), not only in his district. That half is WORLD's and FACTIONS'
    (who roams) and ECONOMY's (what sells); NOTE on WORLD's board.
(b)5 DANGER READS AT A GLANCE. RIGHT AS VALHEIM'S SHAPE (an ordered ladder of biomes, the boss the gate), colours unconfirmed.
    Not in this round's steps; on the NEXT line; the look is RUN's painting and DIRECTION's.

---------------------------------------------------------------------------------------------------------------------------
## 4. WHAT WAS BUILT (slices/bohemia_his_map.js, records/target/bb/boss_map.json, five marked __HIS_MAP__ hooks in RUN's map)

THE RULE OF THE FILES: RUN's map paints, travels, fogs and fights; this file is drawn OVER it through five marked one-line
hooks (fogDraw, the draw after the fog, fogNewGame, cityWalkable, the script tag), each a no-op if the file is missing. RUN's
fog keeps WHAT he has seen (rule 155) and its dark stays as the fall-back. The bench (bohemia.fog.off, every gate before rule
155) gets none of the stranger's layer, so RUN's checkers measure what they always measured; his pins draw everywhere.

(1) THE UNSEEN CITY, FAINT UNDER STATIC. RUN's fog mask (what he has not seen) is drawn at the map's own pixels into one small
    canvas (CVW x CVH: 1.1 MB on the phone, never the glass's 10 MB), filled with tape snow (scanlines every other line, a
    tracking line every 64, re-rolled on the beat), and laid over the painting three times: SATURATION (the colour goes: who is
    there, what is open, a town's paint), MULTIPLY (the shape stays, dark, through the snow), and a 16% veil of the snow (a dark
    street is never a hole). The towns, their names and every walker under it were already off (RUN's fogHides). The seen city
    is untouched. At the far stop the whole valley reads as a grey ghost on one screen.
(2) HIS PINS AND THE CROSS. Hold a finger 0.55 s (or the right button) on the map: a small tin box over his finger: CAMP,
    DANGER, LOOT, SHOP, WORD (a word of his, 14 letters). A held finger never travels (RUN's tap is cancelled at the hold). The
    pins are drawn in the game's own inks (bone, the danger red, the warm shop yellow), one pixel outline, one size at every
    zoom, kept in bohemia.hismap.v1 with the game and cleared by NEW GAME (its hook in fogNewGame). Hold a pin or a cross:
    TAKE IT OFF. When a fight ends and CAMP's dead list (engine/bohemia_condition.js) has a new name, a bone cross stands where
    the fight was handed over, his name under it when the map is close.
(3) THE BOSS IS FOUND. The next boss on the table (his ladder's order) gets a sign 2 to 5 blocks from him, inside what he sees,
    on a street against a wall, drawn by kind (a tag, a flyer, a radio, a man at a bar) and breathing on the beat. Walk within a
    block of it and his place is marked: the row's words said on the map's line, a red stencilled skull and his name on a plate
    at his place, the static cleared round it (the Ancient Spire's circle), his name waiting at the glass's edge when he is off
    it (the jobs' way). His place: the nearest block of the row's district kinds 8 to 30 blocks from the sign, reachable by the
    map's own walk, never within 3 of a town; the street block at its door.
(4) THE BOSS CHANGES THE MAP. Stop on his place: the fight comes through RUN's one door (cityHandOver, 'boss:<name>', the
    biggest job's band at three skulls, the meet card first: ENGAGE or FALL BACK). Won with every one of theirs down, he falls:
    the row's changes, kept, drawn the next time the map is drawn: LIGHTS (warm windows over his district's buildings, one in
    eleven flickering on the beat), PLACE (a doorway and its name), WALL (the nearest block between two streets opens; RUN's
    cityWalkable reads it, so the walk goes through; rubble drawn on it), REVEAL (every town shows through the static: THE
    SURVEYOR holds the last complete map), HOLDS (the nearest home base changes hands 'by boss' in WORLD's ledger,
    BohemiaHomeBases.took, one of his four ways). The static clears round what changed, the feed's radio says it (draft), and
    the next boss's sign turns up near where he fell. A FALL BACK or a lost fight leaves him standing; step off and come back.
    THE MIDWIFE is 'meet', not a fight (a person to reach; the row says so).

THE TABLE IS HIS. Every row of records/target/bb/boss_map.json is draft:true: the district kinds, the sign's words, the
changes, the feed's line. Nineteen rows, act one's nineteen, in his ladder's order. DYNASTY owns the order (the coordinator's
NOTE) and a row it moves is moved there. A modder edits the file; no boss is named in code.

DEFAULTS OF MINE (rule 205, each his to kill, named in the reply): a boss is the three-skull band; the cross stays until he
takes it off; the boss's place is 8 to 30 blocks from its sign; THE TAP and THE MIDWIFE hand the nearest base to the company.

---------------------------------------------------------------------------------------------------------------------------
## 5. THE GATE (rule 243(c), on the live demo, phone and computer)
gates/his_map_gate.js (registered as HIS MAP): the stranger's game (fog on), NEW GAME through the title, then the same game
opened again in a new tab (CONTINUE) the way he reopens the link. 21 checks a profile: F1 to F6 the faint city, P1 to P6 his
pins and the cross, B1 to B7 the bosses, C1 the cost, C2 nothing threw. HIS_MAP_SHOTS=<dir> saves the pictures.

## 6. RESULTS (HIS MAP 42 passed, 0 failed: 21/0 phone, 21/0 computer; on main after RUN THREE's start in a town, which the gate
## leaves the way a player does, a real tap on LEAVE)
THE FAINT CITY (phone | computer):
  F1 the shape on the glass (the part of the unseen light that follows the painting, in steps of 0 to 255): 12.2 at the default
     stop and 4.8 with the whole valley on the glass | 7.5 and 7.9; the unseen light 40 to 42, never black, never bright. Across
     eight seeds the far stop on the phone ran 4.4 to 11.4: there a block is two or three pixels, the region's mountains and roads
     carry the shape and his crew stands over the valley, so its line is 3 steps and twice RUN's dark (F2).
  F2 the mutation, RUN's dark put back: 2.1 and 1.5 steps | 1.8 and 1.5: the dark shows no shape, the tape does.
  F3 colour where the painting has it: saturation 0.25 painted, 0.02 under the tape | 0.27 and 0.02.
  F4 the seen city: 90% | 100% of the patches two and three blocks from him are the painting's own pixels.
  F5 the whole valley fits the glass at zoom 0.14 (the zoom runs 0.11 to 4.74) | 0.60 (0.40 to 14.2).
  F6 after a trip 98% | 100% of the newly seen patches are painted at once; at the closest stop (a block 85 | 256 px) unseen
     ground is light 42 | 31, saturation 0.01 | 0.02 (rule 258's close end).
  C1 the frame, the middle of six rounds: 82.5 ms against RUN's dark 87.7 | 48.3 against 53.9 (the gate's software glass): the
     tape is CHEAPER than the dark it replaces; the canvases 1.34 | 0.76 MB.
     THE FIRST CUT FAILED THIS: two blend passes over the whole glass cost 12 ms more on the phone and 20 on the computer;
     doing the work in one canvas a third of the glass each way (one pixel of tape for three of the glass, the phone's own map
     pixel, on every device) made it cheaper than the dark.
HIS PINS: P1 a held finger and a held button open the box, over two corner things (the phone, the bar) by 0 px, no travel;
  P2 CAMP at the held block, drawn at the near, default and whole-valley stops; P3 'WATER HERE' typed and pinned; P4 a man written
  dead through CAMP's own door (afterFight) and the fight's end: a cross at the block the fight was handed over at, with his name;
  P5 all of it back after the reopen; P6 TAKE IT OFF, and it stays off.
THE BOSSES: B1 THE POT's flyer 3 | 5 blocks from him at the first frame; B2 walked to, THE POT marked on commercial ground, the
  static cleared round him; B3 'boss:THE POT' through the one door, the fight stands; B4 every one of theirs down, LEAVE: THE POT
  fell, his lights and THE KITCHEN drawn the next frame; B5 a wall down that the map's own walk goes through, the map opened (14
  of 14 towns seen, from 6 | 5), a base handed over 'by boss' in WORLD's ledger; B6 THE CHARGE's sign 4 | 4 blocks from where THE
  POT fell; B7 all of it after the reopen (4 fallen, 3 blocks of wall down and walkable, 2 lit districts).
RUN'S STRANGER GATES ON THIS TREE: THE GAME STARTS IN A TOWN 15/0, DEMO BUILD 25/0, A FRESH START AND A FOG OF WAR 8/0, SIGHT DOWN THE STREET 6/0, ONLY THE
  FINAL LOOK 10/0 (the first frame after GO is the scene 3 s later: mean difference 0.61 computer, 4.11 phone, so the tape's band
  does not move the scene); THE PLACE IN THE DARK 19/1: D5b, a job's name at the glass's edge under the phone, is RUN's and WORLD's
  label and red the same on main (9/1 on the phone in a clean worktree of 989debd3's successor). Also ATTEMPT 15/0, DIALOGUE CATALOGUE 63/0, NO BROWSER DEFAULTS 9/0, NO CASH 10/0; LANGUAGE
  103/1 the same on main (the fight's veteran and the dial).

## 7. ROUTED
RUN: the five hooks (one line each, marked __HIS_MAP__); your painting may take the faint layer into the bake later (the
  saturation and multiply passes are three draws a frame); the opened block is still painted as a building under the rubble.
WORLD: who holds what calls BohemiaHomeBases.took(rec, { base, to, by: 'boss', why }); the world's answer to a fallen boss
  (Valheim's global keys: what roams and raids changes) is yours and FACTIONS'.
DYNASTY: the bosses' order and each one's district live in records/target/bb/boss_map.json, draft, yours to move.
COMBAT: a boss fight arrives as why 'boss:<NAME>' with the label his name; dress the man himself.
EYES: the four pieces on the live demo.

[bb maps] Battle Brothers shows the whole map unless you pick its Exploration Mode, clears the fog by sight and by a tower that
  lights a circle, and changes the map only by war; Valheim fills in where you walked, lets you pin your own, marks the boss
  when you read his stone, and changes the WORLD, not the map, when he dies.
[analog horror] the city you have not seen is on the tape, grey, under snow and scanlines, the shape of it there and the people
  gone; the city you have walked is in colour.
