# MODS [a modder's first hour] -- CHANGE ONE THING IN TEN MINUTES (10/18/26)

Lane 22 MODS, session mods-opus-10-18c (opened by the coordinator, rule 112; Opus 5.5 at Extra, rule 116). Row:
CHANGE-ONE-THING-IN-TEN-MINUTES, his 9/30 and 10/9 notes: "the point of the mods chat is to make mods easy to make, not
to make mods or laws." PURPOSE on the row: easy is measured by a stranger, not by us. RESEARCH ONLY (rule 38g): nothing in
the game changed, no mod was made, no rule for modders was written. Every edit below was made in a throwaway copy or a
temporary file served under the real URL, and thrown away.

## THE ANSWER IN ONE LINE

**Two of the three fit in ten minutes and one does not.** A stranger who takes no wrong turn changes the pistol in about
4 minutes and the bar's name in about 3. The haircut takes about 11 minutes of reading and a 4-minute bake before the body
changes. The face cannot change on a stranger's machine at all, because it is rendered in Blender. Three strangers (fresh
agents, given only MODDING.md) did the pistol in 1.9, 1.9 and 6.2 minutes and the bar in 1.2, 1.3 and 5.3. They did the
haircut's body in 7.3, 7.3 and 10.3 minutes, and none of them changed the face.

## HOW IT WAS TIMED

1. **Three strangers.** Each one was a fresh agent that had never seen this project. Each worked in its own throwaway
   copy of the repo and was told only this: "you cloned a phone game, there is a MODDING.md, make these three changes and
   see them in the game." Each got the three tasks in a different order, so no task always came first or last
   (stranger A: pistol, hair, bar; B: bar, pistol, hair; C: hair, bar, pistol). Two strangers ran on one model and one on
   a smaller model. Each logged every step with the clock, counted its wrong turns, and listed every wall with the one fix
   that would have removed it. A machine reads far faster than a person, so their minutes are a machine's minutes. What
   they give us is the PATH: the steps, the wrong turns and the walls. Confound: the team's own instructions file was in
   their context, and they were told to ignore it. Nielsen and Landauer's rule says three testers find about two thirds
   of a design's problems (1 - 0.69^3 = 67 percent), so a wall that all three hit is a real wall.
2. **Human minutes come from published rates, never from our own clock.** Reading is timed at 238 words a minute, the
   average silent rate for English non-fiction (Brysbaert 2019, a meta-analysis of 190 studies with 18,573 readers; most
   adults fall between 175 and 300). The edit is timed with the Keystroke-Level Model (Card, Moran and Newell 1980): 1.1 s
   to point, 0.4 s to move a hand, 1.35 s to decide, and 0.28 s a key for an average non-secretary typist. (A skilled
   typist is 0.20 s; on edits of 6 to 10 keys the difference is under a second.) The path is the SHORTEST one: a stranger
   who never takes a wrong turn. That is the floor, not the average.
3. **The SEE step is measured on the real screens**, at the phone profile (390x844, CPU slowed 4x). The edited copy was
   served under the real address, so the fight and the settlement screen read it as if it were the game's own file. The
   result was read back off the screen: the fight's own weapon card, and every word the settlement's canvas drew while a
   finger was held on the bar.

Instrument: `node tools/bohemia_mods_ten_minutes.js` (reads only; about 3 minutes with the live part, 3 s with --no-live).

## CHANGE 1: THE PISTOL HITS HARDER (+5 on both ends)

| step | what the stranger does | best case | measured |
|---|---|---|---|
| 1 | read MODDING.md (470 words) | 2.0 min | its only change is the KNIFE |
| 2 | look for PISTOL in the weapons file | | **0 hits**: the screen's word is not in the file |
| 3 | find the link: ours.json `weapon_rows.pistol = dagger`; the card's small print says "Battle Brothers: Dagger" | 0.7 min | all three strangers hit step 2 and found step 3 by searching the other files |
| 4 | edit `records/target/bb/weapons.json` line 81, the dagger row: 15 to 35 becomes 20 to 40 | 8.7 s | one file, two numbers |
| 5 | serve the repo, open `slices/BOHEMIA_FIGHT.html`, hold a finger on the pistol man | about 30 s | board ready in 2.3 to 3.1 s over four runs at CPU 4x; the card reads "Damage 20 to 40" (it read "15 to 35" before) |
| | **total** | **about 4 min** | strangers: 1.9, 1.9 and 6.2 minutes |

**The walls, each with the fix that removes it:**

- **None of the 7 crew weapon names on the screen is in the data files.** PIPE, CAR DOOR, PISTOL, SHOTGUN, RIFLE, SLEDGE
  and BOTTLES appear 0 times in weapons.json and 0 times in armor.json. Each one is a nickname for a Battle Brothers row:
  the pistol is `dagger`, the shotgun `handgonne`, the rifle `light_crossbow`, the pipe `bludgeon`, the sledge
  `two_handed_mallet`, the bottles `bundle_of_throwing_axes`, and the car door `wooden_shield`. The only link is
  `weapon_rows` in ours.json. The card's big word does not narrow it either. PISTOL is the CLASS's line
  (weapon_lines.json is keyed by class), so the same title goes on 6 rows: knife, dagger, notched_blade, rondel_dagger,
  qatal_dagger and estoc. Only the small print ("Battle Brothers: Dagger") names the row. FIX: the seven pairs, on
  MODDING.md (MODS, done this round).
- **MODDING.md's only change is a weapon nobody in your company carries.** Over 10 first-road fights (the map's own first
  party, rule 75b), the knife was held by 0 of 120 crew and 0 of 30 enemies. The dagger, which is the pistol, was held by
  10 crew and 1 enemy. A stranger who follows the guide changes a number he can never see in his own fight. FIX: the page
  says which row the pistol is, so the first change can be one he sees (MODS, done this round; the example mods stay as
  they are, because this row makes no mods).
- **THE CACHE WALL: the guide's own server keeps showing the old number.** MODDING.md and the first-hour page tell a
  stranger to run `python3 -m http.server`. That server sends a Last-Modified date and no caching rule, so the browser may
  keep the file for a tenth of its age (RFC 9111 4.2.2 allows this guess; Chromium uses 10 percent). A clone's files are as
  old as the clone. Measured with the dagger edit, in the same browser:

  | cloned before the first load | plain reload | type the address again | reload later | shift-reload | a fresh private window |
  |---|---|---|---|---|---|
  | 10 minutes (keeps it 60 s) | old number | old number | at 75 s: new number | new number | new number |
  | 1 day (keeps it 2.4 hours) | old number | old number | | new number | new number |

  The three strangers never hit this wall, because each of their checks opened a brand-new browser. A person keeps one
  browser open and presses reload. FIX for the stranger: "after an edit, shift-reload or open a private window" (MODDING.md,
  done this round). FIX in the game (COMBAT, routed): the fight's loader fetches its data files with `cache: 'no-cache'`.
  That is one option on one call. The browser then asks the server every time, and a file that has not changed costs one
  short "not modified" reply on GitHub Pages.
- **The demo's own crew carries no pistol.** The door's default origin (A NEW CREW, 3 men) gets the first three kits of the
  twelve: PIPE, PIPE and SLEDGE (measured on 3 seeds: 6 pipes and 3 sledges). The pistol is the fifth man's kit, so only 2
  of the 15 origins field it (THE BLOCK WATCH, 12 men, and THE DEBT COLLECTORS, 6). The slow stranger saw the new number on
  the fight bench at 2.5 minutes and needed 3.7 more to find a way to it inside the demo. FIX: one line on MODDING.md
  saying where the pistol fights (MODS, done).
- **The pistol's row is also an enemy's dagger.** On 1 of the 10 first roads, a foe's dagger hit 5 harder too. FIX: one
  line on MODDING.md saying that a row is shared by everyone who holds it (MODS, done).
- **Nothing says where the number shows.** The weapon card comes up only while a finger is held on a man. The crew screen's
  MAIN HAND line also shows "dmg 15-35" (stranger C found it there). FIX: one line on MODDING.md (MODS, done).

## CHANGE 2: THE BAR IS CALLED THE SALOON

| step | what the stranger does | best case | measured |
|---|---|---|---|
| 1 | read MODDING.md | 2.0 min | it says nothing about buildings or places |
| 1b | (guided) MODDING.md sends him to the data line page "for where the game's data lives" | +15.6 min | 3,701 words, and it lists no building names. **A wrong turn for 2 of the 3 strangers**; the third searched first. Two decoys cost the slow one more: "saloon" is a district-kit word and "tavern" lives in comments |
| 2 | search the whole words THE BAR | 0.1 min | 14 game files; the one named SETTLEMENT_SCREEN is it |
| 3 | edit `slices/BOHEMIA_SETTLEMENT_SCREEN.html` line 184 (183 when the strangers ran), table B: `name:'THE BAR'` becomes `name:'THE SALOON'` | 7.4 s | one file, one word |
| 4 | open `slices/BOHEMIA_SETTLEMENT_SCREEN.html` and hold a finger on the bar | about 20 s | ready in 0.8 to 2.5 s over five runs at CPU 4x; the tag reads THE SALOON (it read THE BAR before) |
| | **total** | **about 3 min; about 19 min if he trusts the guide** | strangers: 1.2, 1.3 and 5.3 minutes |

**The walls:**

- **The guide's map of the game has no buildings.** The data line page has 47 kinds and no building names. FIX: a
  "building names" kind on the data line page (MODS, the next row), and the B table moved into a data file that the
  settlement screen fetches (RUN TWO, routed).
- **The name is drawn only while a finger is on the building.** No page text holds it, so a search of the page finds
  nothing (stranger C first got a false "not changed"). FIX: one line on MODDING.md (MODS, done).
- **A second name for the same building, inside a sentence.** The keeper is "MANNY, BEHIND THE BAR" (line 434 of the
  same file), so after the rename he still stands behind a bar. FIX: the keeper's title reads the building's name (RUN TWO,
  routed).
- **It is code, so it cannot travel in a mod.** The reference merge patches only records/target/bb. A friend who wants
  THE SALOON has to edit the same line himself.
- Good news, measured: the demo's map opens this same file in a frame (`f.src = 'BOHEMIA_SETTLEMENT_SCREEN.html'`), so the
  rename reaches the demo with no re-cut.

## CHANGE 3: A CREW MEMBER WITH LONG HAIR GETS SHORT HAIR

| step | what the stranger does | best case | measured |
|---|---|---|---|
| 1 | read MODDING.md: "A sprite in a mod: Not yet" | 2.0 min | |
| 2 | the data line's "clothes and hair" row names 5 files | 0.4 min | **0 of the 5 hold a crew member's haircut**, and the row says "no table to edit": a wrong turn for 2 of the 3 strangers |
| 3 | find the body's word: CITY_CAST_LOOKS in `slices/BOHEMIA_ALPHA_0_9.html` (39,571 lines), `worn:{hair:'LAYERED FALL'}` for the shortcoat look, line 11412 | 3.0 min | 715 words of table |
| 4 | pick a short cut from the hair bank | 4.8 min | 45 named cuts, and nothing says which ones are short; both strangers read each cut's `side` number |
| 5 | learn the fight's sheets are baked (the bake tool's header) | 0.8 min | |
| 6 | edit one word | 7 s | |
| 7 | bake: `node tools/bohemia_fight_people_bake.js` | **230 s** (two strangers; the third's took 205 s) | it rewrites the edited sheet AND 3 sheets nobody touched (below) |
| 8 | the settlement's sheets: a second bake (`tools/bohemia_settlement_people_bake.js`) | not run by either | |
| 9 | the face: a second word in a second vocabulary (`hair='long'`, PORTRAIT's tool, line 138), then a Blender 4.2 render | **cannot be done here** | `import bpy` fails; the head model is not committed (7 MB, rebuilt by the tool) |
| | **total, body only** | **about 15 min** (11 reading, 4 baking) | strangers: 7.3, 7.3 and 10.3 minutes; the face kept the old hair every time |

**The walls:**

- **Two words name one man's hair, in two vocabularies.** The body's word is one of 45 named cuts in the alpha (LAYERED
  FALL). The face's word is one of 4 classes in PORTRAIT's tool (long, taper, coil, shag). They agree today on 12 of 12
  looks. But a stranger who changes one gets a man with two haircuts: short hair in the fight, long hair on the crew
  screen and at the settlement. That breaks ONE ID, ONE WHOLE PERSON. FIX: one haircut word per look in one data file. The
  body bake and the portrait tool both read it (CHARACTER and PORTRAIT, routed).
- **Six places say it, and only two of them matter.** For the shortcoat look:

  | place | it says | what it is |
  |---|---|---|
  | slices/BOHEMIA_ALPHA_0_9.html line 11412 | LAYERED FALL | the body's word: the sheets are baked from it |
  | slices/BOHEMIA_DEMO.html line 11426 | LAYERED FALL | the demo's copy: only a re-cut changes it |
  | tools/bohemia_portrait_the_head_from_the_model.py line 138 | long | the face's word: rendered in Blender |
  | slices/fight_people/fight_people.json | LAYERED FALL | a label the bake writes |
  | records/target/portrait/crew/BOHEMIA_CREW_FACES.json | long | a label the render writes; **no screen reads it** (a trap: it looks like the setting) |
  | slices/settlement_people/settlement_people.json | (no label) | |

- **18 pictures (275,379 bytes) carry this one man's hair**: 16 portrait PNGs (8 faces at 2 sizes) and 2 body sheets. None
  of them can ride in a mod, because a mod is JSON only (the [a png in the bundle] row is the open question).
- **The bake rewrites 4 sheets you did not touch.** The three strangers' bakes changed cast_skirt, faction_network and
  faction_trades by 148, 159 and 212 pixels, and cast_shortcoat by 311 for the one who edited another look. The three
  copies came out byte for byte the same, so the bake is steady. It is the committed sheets that have fallen behind the
  alpha. A modder's first bake therefore shows 4 changes that are not his. FIX: re-bake those four (COMBAT, who owns the
  bake, routed).
- **Nothing says which man wears which look, and the two screens disagree.** No crew row names its look. The fight
  gives man i `ours.people_looks.crew[i % 12]`; the crew screen (engine/bohemia_roster.js, `manOf`) gives him the i-th
  cast_ key of fight_people.json. The two lists are in different orders, so **10 of the 12 men wear a different look in the
  fight than on the crew screen** (only YOU and MARISOL match). The shortcoat is OSO in the fight and NENA on the crew
  screen, which is why two strangers named different men for the same look. This breaks ONE ID, ONE WHOLE PERSON on its
  own, haircut or not. FIX: each crew row carries its look, and both screens read it (COMBAT and RUN TWO, routed).

## THE FINDING THAT PROVES US WRONG

**The data line (10/17) sorted the game by file type. It said 14 kinds are "a data file you edit and reload", and it
named the rest as tables in code. The strangers sorted it another way.** For every stranger, the bar was faster than the
pistol (1.2 against 1.9, 1.3 against 1.9, 5.3 against 6.2 minutes), even though the bar is a table inside code
and the pistol is a data file. The reason is the word on the screen. "THE BAR" on the screen is "THE BAR" in the file. "PISTOL" on the screen appears 0 times in the
weapons file, and so do the other 6 crew weapon names. **Easy is the word you see finding its line, not the kind of file
the line is in.** The guide made it worse. MODDING.md's one example is a weapon nobody in your company carries, and its
"where the data lives" page lists neither the building names nor where a crew member's haircut is. Two of our own pages
were the wrong turns.

## SCHOOL (both angles)

- **Stardew Valley.** Content Patcher's first tutorial is a text change: a crop's description (the hazelnut). The pack is
  a folder with manifest.json and content.json. The wiki says to unpack the Content folder first "to see what each asset
  contains", so finding where a thing lives is a TOOL, not a search. Content Patcher's EditImage puts a picture inside the
  pack, so a haircut can travel in a mod. (stardewmodding.wiki.gg, "Tutorial: Your First Content Patcher Pack";
  stardewvalleywiki.com, "Modding:Content Patcher".)
- **Battle Brothers.** The scripts ship compiled and encrypted (.cnut), so the first wall was reading them at all. A
  community kit (Adam Milazzo, January 2019) decrypts and decompiles every script in one go. data_001.dat is an ordinary
  zip, and a banner is changed by dropping in a PNG with the same name. The lesson: the community built the "where is it"
  tool because the game did not ship one. (Steam discussions for app 365360; PCGamesN on the Warhammer mod.)
- **The real world: "time to first hello world".** Developer tools time the minutes from a stranger arriving to his first
  thing working. Twilio aims for 5 minutes. Zuplo flags anything over 15. Ably's top tier is under 30. Axway calls 30 a
  hard target worth chasing. Ten minutes sits inside that band. The pistol and the bar make it; the haircut misses it on
  reading alone. (Nordic APIs; Axway; Fern, July 2026.)
- **The real world: usability testing.** Nielsen and Landauer: n testers find N(1-(1-L)^n) of the problems, with L about
  31 percent, so 5 testers find about 85 percent and 3 find about 67. Their rule is for FINDING problems, not for exact
  task times, which is why the minutes here come from the published rates. (nngroup.com, "Why You Only Need to Test with
  5 Users"; MeasuringU.)
- **Rates.** Brysbaert 2019, J. Memory and Language 109: 238 words a minute for non-fiction. Card, Moran and Newell 1980,
  CACM 23(7): the Keystroke-Level Model. RFC 9111 section 4.2.2 for a guessed cache lifetime, and Chromium's 10 percent
  (Calvano 2018).

## ROUTED (pages only, rule 38g; the building lanes own their files)

- **RUN** (the build lead; MODS reports here): the repo has no README. GitHub shows a README first, and the root has 40
  entries, 12 of them .md files. A README.md with two lines (the play link, and "to mod it, read MODDING.md") is the front
  door all three strangers looked for. Lead line: MODS COOKING, a page, NOT IN A TAB.
- **COMBAT**: (1) the fight's loader fetches its 13 data files with `cache: 'no-cache'` (the cache wall; one option on one
  fetch call); (2) each crew row in ours.json names its look, and the fight reads it instead of `people_looks.crew[i % 12]`
  (10 of 12 men wear another look on the crew screen); (3) re-bake cast_shortcoat, cast_skirt, faction_network and
  faction_trades (148 to 311 pixels behind the alpha).
- **RUN TWO**: the settlement's B table (the building names and their short lines) becomes a data file the screen fetches;
  the keeper's "BEHIND THE BAR" reads the building's name; the crew screen's `manOf` reads the crew row's look (the same
  one the fight reads); the same `cache: 'no-cache'` on the screen's 10 fetches and on engine/bohemia_roster.js.
- **CHARACTER**: CITY_CAST_LOOKS's haircut, one word per look, in a data file the two bakes read.
- **PORTRAIT**: the portrait tool's hair class read from that same file, so the face and the body cannot disagree.
- **MODS** (this lane, next): the data line page gains the kinds the strangers looked for and did not find (building
  names; the crew's haircut with its two words). The new row [the screen's word] measures the gap for every word a player
  can read.

## WHAT CHANGED IN THE REPO THIS ROUND

- this page; `tools/bohemia_mods_ten_minutes.js` (the instrument);
- MODDING.md: one section, "See your change in the game today", with the seven weapon pairs, the cache line, where each
  change shows, and where the two non-data changes live. It is help, not a rule, and it makes no mod.
- records/BOHEMIA_MODS_A_MODDERS_FIRST_HOUR_10_10_26.md: a correction line. Its "the demo's older fight ignores these
  files" has been false since the demo opened the new fight (RUN 10/2): the demo's fight IS slices/BOHEMIA_FIGHT.html and
  reads them (the slow stranger caught it).

## PROOF

Two runs of `node tools/bohemia_mods_ten_minutes.js`, both exit 0.

(1) On 357604a3, with the MODDING.md the strangers had (470 words), for the tables above. FRONT DOOR: 40 entries, 12
.md, no README. W: PISTOL is dagger, line 81, 15 to 35; 0 hits for pistol in weapons.json; 0 of 7 crew weapon names
found; best case 633 words, 2.7 min, plus 8.7 s to edit. H: cast_shortcoat is LAYERED FALL on the body and long on the
face; the two words agree on 12 of 12 looks; 45 named cuts against 4 classes; 18 pictures, 275,379 bytes; the same look
on both screens 2 of 12; best case 2,609 words, 11 min (14.2 with the face); the data line's files naming the look, 0 of
5. B: THE BAR, line 184; 14 game files; the data line names it: no; a mod can patch it: no; best case 628 words, 2.6 min;
guided 4,329 words, 18.2 min. LIVE: fight 2,275 and 2,745 ms; the bar 2,021 and 2,492 ms, drew THE BAR, then THE
SALOON. CACHE, cloned 10 min before: reload old, typed again old, reload at 75 s new, shift-reload new, fresh browser new.
Cloned 1 day before: reload old, typed again old, shift-reload new, fresh browser new. FIRST ROADS: the crew held a
dagger 10 of 120 times and the knife 0; foes held a dagger 1 of 30 times and the knife 0. THE DOOR'S COMPANY: bludgeon 6,
two_handed_mallet 3.

(2) On a4664ef0, with this round's MODDING.md section in the working tree (745 words). W: MODDING.md now names the
pistol; best case 908 words, 3.8 min. B: best case 903 words, 3.8 min; guided 4,604 words, 19.3 min. The new section
adds 275 words (1.2 min) to every path, and in return it removes the wrong turns it names. LIVE: the fight's card read
"PISTOL · BOOKIE ... Damage 15 to 35" before and "Damage 20 to 40" after (2,508 and 2,345 ms); the bar drew THE BAR,
then THE SALOON (2,480 and 2,405 ms). CACHE and FIRST ROADS came out as in (1).
The three strangers' reports are summarised above. Their throwaway copies were deleted after the measurement (nothing from
them is committed).
