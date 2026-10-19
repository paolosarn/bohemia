# MODS [the screen's word] -- EVERY WORD YOU SEE FINDS ITS LINE (10/19/26)

Lane 22 MODS, session mods-opus-10-19 (opened by the coordinator, rule 112; Opus 5.5 at Extra, rule 116), resuming the
row CLAIMED by mods-opus-10-18d, which the five-hour cap stopped after its instrument landed. Row:
EVERY-WORD-YOU-SEE-FINDS-ITS-LINE, from [a modder's first hour]'s finding (10/18): easy is the word on the screen finding
its line, not the file type. RESEARCH ONLY (rule 38g): nothing in the game changed. Every edit below was made in a copy
served under the file's real address and thrown away.

## THE ANSWER IN ONE LINE

**A stranger's whole-word search finds a line for 215 of the 230 names a player reads in the demo's first ten minutes,
and a tag read back off the glass proves the right line for 148 (140 of them one single line). But the kinds a modder
wants most are the hardest to follow: a weapon's word comes from a different table on each of three screens and none of
them is the row with its numbers (one hop on the fight's card, two on the crew screen; Battle Brothers has zero), armour
is named by durability band in three copies of one function, and a town's name is also its key, so renaming Church turns
it into a camp.** The 15 names the search misses are 12 people (both halves of each name are in one pool file, put
together by a dice roll keyed by the place), two feed handles built from a place name, and one shop line glued from two
files. Every building in the town was proved to one line of one table, which makes buildings the easiest kind in the
game to find, though the data line page calls them code.

## HOW IT WAS MEASURED

1. **The walk: the demo's first ten minutes, as a stranger meets them.** One driver (tools/bohemia_drive_the_demo.js,
   a 390x844 phone with touch) opens the baked demo and plays: NEW GAME with a real touch; the crew picker swiped card by
   card through all 15 origins and ANOTHER pressed through all ten company names; the first view and its phone for 45
   seconds; pinched out to the map for 20; the nearest town (Church, two blocks away) opened by the map's own arrival
   door, all ten of its buildings held (the name tag) and tapped (the keeper and the wares); CREW, all 12 men's rows
   tapped; then the first road fight (A FEW brigands: 3 against the company's 3) opened by the road's own door, every man
   tapped (his drawer) and held (his weapon card). Where a door is called rather than tapped, the instrument says so,
   because the WORDS are what this measures, not the route. A hook in every frame, armed before any page script, records
   every string drawn with fillText and every text node on the glass: 435 strings in 428 seconds. **The dice are seeded**
   in every frame. The fight's enemies and their weapons are rolled, and an unseeded second walk met other men.
2. **The names.** Every string is cut at the game's separators (' · ', '|', and a keeper's "NAME, TITLE") and kept when
   it reads as a name: one to six words, no sentence, no digit. **230 names.** A piece with a digit in it (HP 67, START 6
   BATTERIES, holds 24 weight 10, 20 to 35) is a READOUT: a number from a row inside a sentence from code. There are
   **74**, counted apart and not searched (where a number lives is the data line's question, not this one). Each name
   gets the KIND its screen gives it, read off the element or the canvas call that drew it.
3. **The search a stranger runs**: whole word, any letter case (an editor's default), over the clone (ripgrep, which
   skips what .gitignore skips, as a clone does). A name is FOUND when a hit is on a line of a file the walk actually
   loaded (81 text files: the demo, the map, the settlement, crew and fight screens, the engine files they pull, the data
   files they fetch). What his search box shows him is every matching line in the repo, noise included.
4. **The proof: a tag on the line, read back off the same screen.** Found is not the RIGHT line: THE BAR is on 124
   loaded lines in 11 files (1,825 lines in the whole repo). So each candidate occurrence gets its own tag (~Q and a
   number) in a copy of its file served under the real address. The walk runs again with the same dice, and a tag that
   shows on the SAME screen the word was read on proves that occurrence sets it. Never tagged: a word in code, a JSON key,
   or a value the code looks things up by (after id:, key:, class:, job:, weapon:, kind:, type:, slot:), because a tag
   there breaks a lookup and measures the breakage. **PASS A** tagged every in-string occurrence of every name with 15
   loaded lines or fewer (291 tags in 25 files; 127 came back). **PASS C** tagged only the places the hand trace named for
   weapons and armour (88 tags in 4 files; 26 came back). **PASS D** tagged the settlement's building table and its
   keepers (35 tags; 25 came back). A **PASS B** (every whole-string occurrence of the row's kinds with more than 15
   lines) ran once, unseeded, and broke the screens it meant to measure. It is kept for one finding (THE NAME IS THE KEY,
   below), not for its numbers.
5. **The hops, by hand, for every name the search misses or lands wrong.** A hop is one more file a stranger has to open,
   following a name the last one showed him. The yardstick is Battle Brothers' item file: zero hops, because the word and
   the numbers are on neighbouring lines (the school, below).

Instrument: `node tools/bohemia_mods_screen_word.js --prove --passes A,C,D --bank FILE` (reads only; one walk is about
7 minutes, the search about 80 seconds, each pass one more walk; `--from walk.json` reuses a walk).

## THE TABLE: THE ROW'S KINDS

| kind | names on the glass | search finds a line | tag proves the line | the line a stranger lands on | hops to what he wants |
|---|---|---|---|---|---|
| **buildings** (name and short line) | 18 | 17 | 17 (14 to one line) | slices/BOHEMIA_SETTLEMENT_SCREEN.html table B, lines 181 to 191 | 0. The best kind in the game. |
| **keepers' titles** | 8 | 8 | 8 (all one line) | the same file, table KEEPERS, lines 462 to 472 | 0, but a copy of the building's name (below) |
| **origins and the door** | 38 | 38 | 32 (all one line) | records/target/bb/origins.json (15 of 15 origins); company names and settings in the DEMO's copy | 0 for origins; the demo's copy is undone by the next cut |
| **people** | 28 | 18 | 16 | crew: records/target/bb/ours.json (11 of 11); job givers: records/target/BOHEMIA_BOARD_SHELF.json; THUG: records/target/bb/enemies.json | 0 for the crew; the hire post and the keepers: no line names one (below) |
| **armour** | 11 | 11 | 11 (all one line) | a durability band inside a function, a different copy per screen | 2 to the row, and the word never leads there |
| **weapons** (word, row, class, skill) | 30 | 30 | 18 (16 one line) | a different table per screen; none is the row with the numbers | 1 on the fight's card, 2 on the crew screen |
| **places** | 7 | 7 | 1 | the town's name is a faction name in a baked block; renaming it renames the town's KEY | the name cannot be changed alone |
| **perks** | 0 | | | none reach the glass in ten minutes ("PERKS: none yet. Level 2 picks the first one.") | not measured |

The other 90 names are the interface (buttons, labels, the feed, the wares, the stats' names): 86 found, 45 proved, 42 to
one line. Of the 148 proved names (a name counted once per kind of place), 40 are proved in a data file, 68 in a screen's own
code, 13 in an engine file, and 28 in the demo's own copy (the door: its headings, the company names, the shelf and
crew settings, the loading lines). An edit there works for a
stranger today and is erased the next time RUN cuts the demo from the alpha.

## WHERE EACH KIND'S WORD LIVES

### Weapons: one word, three tables, none of them the numbers

Proved by pass C (seeded), read off each screen:

| screen | what it shows | the line that sets the word (proved) | from the word to the numbers |
|---|---|---|---|
| fight, weapon card (hold a man) | PIPE · YOU, SLEDGE · RAUL, AXE · THUG, CAR DOOR | records/target/bb/weapon_lines.json, the class row's "name" (PIPE line 30, SLEDGE 38, CAR DOOR 54, AXE 80) | 1 hop: the card's small print names the Battle Brothers row ("Battle Brothers: Bludgeon, a mace"); search Bludgeon, land on weapons.json |
| fight, drawer (tap a man) | THUG · LEVEL 1 · MACE (AXE, SPEAR) | the Battle Brothers CLASS, `job: w.class` in slices/BOHEMIA_FIGHT.html line 495, upper-cased (hand trace; a class key is never tagged) | the same man's card says PIPE · THUG: one weapon, two words on one screen (the unseeded walk had DAGGER on the drawer and PISTOL on the card) |
| crew screen | pipe, sledge, rifle, shotgun, bottles, pistol | engine/bohemia_roster.js `CLASSNAME`, line 23 (6 of 6 proved) | 2 hops: ours.json `weapon_rows` (pipe is bludgeon), then weapons.json |
| town shop shelf | axe, chain, hook, pistol, cleaver | slices/BOHEMIA_SETTLEMENT_SCREEN.html `CLASSNAME`, lines 314 to 316 (5 of 5 proved) | the shelf shows only the LAST word (`fire axe` reads axe, `pole hook` reads hook; line 405); the full name is only in the button's spoken label |
| the item icons | (a picture) | slices/bohemia_ui_materials.js `OBJ_CLASS`, line 417: 0 of 24 tags reached the glass | it picks the picture, not a word, and must agree with the other three or the icon is wrong |

So a stranger who renames PIPE in the data file (the place the data line page and MODDING.md send him) changes the fight's
card and nothing else: the crew screen still says pipe, the shop still says pipe, and the fight's drawer says MACE for the
very enemy whose card says PIPE. The search for "pipe" returns 102 loaded lines in 13 files (1,659 in the repo).

### Armour: ten words for 184 rows, chosen by durability, in three copies

All 11 armour words were proved to one line each. **The crew screen** takes them from engine/bohemia_roster.js lines 50
and 52, and line 81 for "a car door" when the man's jobs include car_door. **The town shop** takes them from
slices/BOHEMIA_SETTLEMENT_SCREEN.html lines 325 to 327, and its shelf again shows only the last word (vest, hat, door).
**The icons** take them from slices/bohemia_ui_materials.js lines 422 to 424, which drew no word. The three copies are the
same function: `dur < 40 ? 'a work jacket' : dur < 100 ? 'a padded vest' : dur < 180 ? 'a plate carrier' : 'full riot
armour'`. So "a padded vest" is not a piece of armour. It is every body armour with durability 40 to 99. Renaming it
renames a band; to change what a man wears, the stranger has to find his crew row (ours.json, `"body": "gambeson"`) and
then the armor.json row. That is 2 hops, and the word on the screen never leads him there. "door" on the shelf returns 888
loaded lines.

### Buildings: one line each, in the screen's own file (proved by pass D)

All ten buildings this town has were proved to one line of table B (THE HALL 181, THE BOARD 182, THE CLINIC 183, THE
STALL 184, THE BARBER 185, THE BAR 187, THE SMITH 189, THE ARMOURER 190, SCAVENGE 191, BUILD 622). Two walls:

- **The short line under a building comes from the table for 6 of the town's 10 buildings and from code for the other 4.**
  `sub(k)` (line 986) replaces THE BOARD's "contracts" with "0 of 2 held", BUILD's "1 battery, 1 day" with "not your
  ground" here, SCAVENGE's "one thing or nothing" with "picked clean", and THE HALL's "who wants work" with "cook for
  hire" (line 990, glued to engine/bohemia_followers.js). A stranger who edits those four lines in table B sees nothing
  change. Pass D proved it: none of the four tags reached the glass.
- **The building's name has a second copy in the keeper's title.** THE SMITH is line 189 (the building) AND line 470 (the
  keeper, "AMBROSE HATCHER, THE SMITH"); the same for THE ARMOURER (190 and 471) and THE BARBER (185 and 465). Rename
  the building and its keeper still says the old name. The first-hour page found BEHIND THE BAR; this is three more.

### People

- **The crew** (DESI, RAUL, TINA, BOOKIE, OSO, CHEWY, MARISOL, LUPE, GRIZ, DEUCE, NENA): records/target/bb/ours.json,
  11 of 11 proved, one line each. Zero hops, a data file. The best case in the game.
- **An enemy** (THUG): records/target/bb/enemies.json line 2784, "Brigand Thug", with "Brigand " cut off by the fight
  (line 495). The search finds it; the file says a longer name than the screen.
- **The job givers** (YESENIA OCHOA, THE WELDER; ABUELA TONA, WHO RUNS THE COUNT): records/target/BOHEMIA_BOARD_SHELF.json,
  proved, zero hops.
- **The hire post and the keepers** (12 names, 0 found whole): each half is in engine/bohemia_names.js (the county's mix,
  PEOPLE 10/18), and the pair is rolled per place and building (`keeperName`, settlement line 1091; the hire post, line
  1007). Hops: the whole name finds nothing; one half finds the pool (1); the pool says nothing about Church, so the
  settlement's `keeperName` (2) leads back to the roll. **No line names one keeper, so a modder can change the pool and
  never the man.** Battle Brothers works the same way for a hire (a background picks from its own name list), and names no
  keepers at all.
- **A hire's background** (FARMHAND, MESSENGER): engine/bohemia_goodbros.js lines 56 and 58, proved; not
  records/target/bb/backgrounds.json, where a stranger looks first.

### Places: THE NAME IS THE KEY

THE WASH, NORTH LAS VEGAS (the town's district line) is one line of the settlement screen, proved. The town's own name is
not: "Church" on the town bar and "CHURCH" on the map are a FACTION's name, from the baked faction graph inside
slices/BOHEMIA_CITY_WORLD.html (line 32657, whose own comment says "nothing here may be edited in place"; the source,
engine/BOHEMIA_faction_graph.json, is not loaded) and the bases at line 75819. Pass B tagged that name once and measured
what a rename does: the town fell from a town to a camp (`mapTierOf` looks the tier up by the name and falls back to
camp), its buildings changed (GUNS AND PLATE where THE SMITH and THE ARMOURER stood), and the first fight never came up.
**A stranger who renames Church gets a different town.** Battle Brothers keeps `m.ID` beside `m.Name` for exactly this.

## THE MISSES, HOP BY HOP (15)

| on the glass | why the search misses | hops |
|---|---|---|
| 12 people (WADE KESSLER, Heather Brennan ...) | each name is two pool words, rolled together per place (above) | 2, and no line names the man |
| @church, @colorful (the phone's board) | `'@' + place name, lower case, spaces out` (slices/BOHEMIA_CITY_WORLD.html line 35114) | 1: search church, then the handle line |
| @thenightshift (the feed) | `'@' + the company name, lower case` (the same file, line 43915) | 1: from THE NIGHT SHIFT |
| cook for hire (THE HALL's short line) | `o + ' for hire'` (settlement line 990), o from engine/bohemia_followers.js | 1 |

One more wall, found by the same search: the door's heading YOUR CREW'S NAME is written `YOUR CREW\'S NAME` in the code
(an escaped apostrophe), so a search for the heading as a player reads it finds nothing in the file that draws it.

## SCHOOL: HOW TWO GAMES AND ONE PLATFORM ANSWER "WHERE IS IT" (both angles)

The first-hour page (10/18) has how each game is first opened (Stardew's first Content Patcher tutorial, Battle Brothers'
decompile kit). This round asks the next question: once a modder can read the files, does the word on the screen lead to
the line that sets it?

- **Stardew Valley: one folder, every asset a file named by its path, every word in a strings file.** The game ships its
  data, maps and pictures as `.xnb` containers in one `Content` folder; one tool (StardewXnbHack) unpacks all of it into a
  `Content (unpacked)` folder beside it. Content Patcher names every asset by that same path, with no folder prefix, no
  language code and no extension: `Content/Maps/spring_beach.xnb` is the asset `Maps/spring_beach`, and a patch's
  `Target` is that name. Its author guide says it in one line: "You can unpack the game's content files to see what they
  contain." **The name a player reads is one hop away, and the hop is written down:** in 1.6 an item row carries a token
  like `[LocalizedText Strings\Objects:<key>]` and the English words live in `Strings/Objects`. A whole-word search of the
  unpacked folder lands on the strings file, and the key leads to the row. The item's ID and its display name are two
  fields, so renaming the parsnip never renames the thing. (Content Patcher's author guide, github.com/Pathoschild/
  StardewMods; the wiki's "Modding:Editing XNB files" and "Modding:Tokenizable strings" pages and a 1.6 forum report on
  names moving to Strings/Objects, read through search results because stardewvalleywiki.com does not resolve from this
  sandbox. The 1.6 key form comes from those snippets, not from a page we opened.)
- **Battle Brothers: one script per thing, the word beside the numbers, the ID beside the word.** The scripts ship
  compiled inside `data_001.dat`, a plain zip; the community kit (Adam Milazzo's tools, DamianXVI's nutcracker
  decompiler, TaroEld's mass-decompile script that keeps the folder tree under `scripts/`) turns them back into `.nut`
  files. Every item is one file under `scripts/items/<class>/`, and its `create()` sets the ID, the name and the numbers
  together. A real mod's helmet, fetched for this page (jcsato's Additional Equipment,
  `scripts/items/helmets/decorated_great_helm.nut`): `m.ID = "armor.head.decorated_great_helm"; m.Name = "Decorated Great
  Helm"; ... m.Value = 3850; m.Condition = 325; m.StaminaModifier = -23;`. **The word on the screen, the numbers a modder
  wants and the key the code uses sit on neighbouring lines of one file named after the thing.** A search for the word
  lands on the numbers: zero hops. And because the code keys on `m.ID`, renaming `m.Name` renames nothing else.
  (raw.githubusercontent.com/jcsato/sato_additional_equipment_mod; github.com/Enduriel/bbkit for the kit's parts; a Steam
  guide on unzipping data_001.dat.)
- **The real world: words live in one resource file, never in the code.** Android's own guide: "don't hardcode any
  strings. Instead, declare all your strings as resources in a default strings.xml file, which makes it easy to update and
  localize them." Every word a user reads sits in one file under a key, the code asks for the key, and a translator (or a
  modder) changes words without touching code. It is the same reason every translated game keeps a strings table: the
  translator's "where is this word" has one answer. (developer.android.com/guide/topics/resources/localization.)

**What all three share, and we lack.** Each keeps the WORD (what the player reads) and the KEY (what the code looks up)
apart, and puts the word where a search for it lands. Stardew and Android put every word in one strings file under a
key; Battle Brothers puts the word next to the numbers and next to its ID. Ours does well where one table holds the word
(buildings, the crew, origins), and badly exactly where a fight is decided: the weapon's word is in three tables and none
is the row with the numbers, the armour's word is a band, and a town's word IS its key.

## THE FINDING THAT PROVES US WRONG

The data line page (10/17) sorted the game's content by file type and put weapons and armour at the top, as DATA ("edit
records/target/bb/weapons.json, reload the fight"), and buildings near the bottom, as code. **Measured from the screen,
the order is upside down.** Every building in the town is one line of one table in the screen's own file, proved; the
weapon a player reads is in no row of weapons.json on any of three screens, and armour is in no row of armor.json at
all. The first-hour page said the word is what makes a change easy and showed it on two changes; this page shows it for
all 230 names, and it shows one more thing the file-type sort could never see: a name that is also a key (Church) cannot
be renamed at all without changing the game. The data line page now starts from the word (a pointer at its top), carries
the two kinds the strangers looked for (building names, the haircut's two words), adds "what a weapon or armour is called
on the screen" with its four tables, and lists the live name pool under names.

## WHAT THE MEASUREMENT CAN AND CANNOT SAY

- **One town, one fight, one company.** Church (a town with a smith and an armourer, no yard), A FEW brigands with seeded
  dice, the door's default company. Another town shows GUNS AND PLATE or THE YARD (both in table B; neither was on this
  glass). The words of the first ten minutes are measured, not every word in the game.
- **A tag that does not show proves nothing either way.** The line may set a word on a screen the walk did not reach, or
  the code may key on the word. Not proved is not wrong.
- **Tags change where the dice go.** The dice are seeded per page, but a tagged string can send the code down another
  branch that spends them differently: pass A lost 13 names walk one had read (the keepers' names, whose faces are rolled
  and whose names read the face; the feed's Cyrus; @thenightshift; the axe man), pass C lost 5 (the spear man), pass D 7.
  Those names are reported as not proved, never as wrong.
- **Pass B's numbers are not used.** It renamed the town and broke the screens it meant to measure; its one use is the
  measured rename.
- **Hops are files, not minutes.** The first-hour page timed a stranger; this page counts the files between the word and
  the line, the way a stranger follows a name.
- **Loaded means fetched by this walk.** A file a screen fetches only later in a game (a second town, a level-up) is not
  in the 81.

## ROUTED (pages only, rule 38g; the building lanes own their files)

- **COMBAT** (the fight): (1) an enemy's drawer names his weapon by its Battle Brothers class (`job: w.class`, line 495:
  THUG · LEVEL 1 · MACE) while his weapon card names it from weapon_lines.json (PIPE · THUG): two words for one weapon on
  one screen;
  (2) the card's small print ("Battle Brothers: Bludgeon") is the only bridge from the word to the numbers, the one hop
  rule 120b's "say what is weak" also leans on. No ask beyond reading it.
- **RUN TWO** (the settlement screen and the crew screen): (1) the shop's `CLASSNAME` (line 314) and its armour bands
  (325 to 327) are copies of engine/bohemia_roster.js lines 23 and 50 to 52; one table both screens read would make a
  rename one edit; (2) the shelf shows only the last word of a name (line 405: fire axe reads axe, a car door reads door);
  (3) `sub(k)` (line 986) overrides four of the town's ten short lines, so table B lies for those four; (4) the keeper's
  title repeats the building's name in a second table (KEEPERS 465, 470, 471); (5) the hire post's backgrounds come from
  engine/bohemia_goodbros.js, not backgrounds.json.
- **UI**: slices/bohemia_ui_materials.js keeps a fourth copy of the class table and the armour bands (lines 417 to 424)
  for the icons; it must agree with the other three or the picture is wrong.
- **WORLD / FACTIONS**: the town's name is its key (`mapTierOf` reads the tier by the name; a rename falls to camp). An id
  beside the name, the way Battle Brothers keeps `m.ID` beside `m.Name`, is what lets a modder rename a town.
- **RUN** (the build lead; MODS reports here): the door's company names and shelf settings are proved in the demo's own
  copy (BOHEMIA_DEMO.html line 13469 and 13439 to 13441), so a stranger's edit there is erased by the next cut; the same
  lines are in the alpha. Lead line: MODS COOKING, a page, NOT IN A TAB.
- **PEOPLE**: engine/bohemia_names.js is now on the data line page under names.
- **MODS** (this lane, next): new OPEN row [the name is the key]: every place a word on the glass is also what the code
  looks up (town names, the class words used as keys of PLAIN, the job words), measured by renaming each in a served copy,
  against Battle Brothers' ID-and-Name split.

## WHAT CHANGED IN THE REPO THIS ROUND

- this page; `banks/BOHEMIA_MODS_WHERE_EACH_WORD_ON_THE_SCREEN_LIVES_DRAFT_10_19_26.json` (draft:true, written by the
  instrument: every name, its screen, its search counts and its proved line; nothing in the game reads it);
- `tools/bohemia_mods_screen_word.js`: the search moved to ripgrep one name at a time (the one git grep over every name
  printed whole lines, some megabytes long, and never finished in ten minutes), readouts counted apart, a keeper's
  "NAME, TITLE" cut at the comma, a missed name split into its words, seeded dice, and the proof (passes A, C, D; B kept
  and off by default), `--bank`;
- `tools/bohemia_mods_data_line.js` and its page records/BOHEMIA_MODS_THE_DATA_LINE_EVERY_CONTENT_KIND_10_17_26.md,
  re-measured: 50 kinds (the two the strangers missed, "what a weapon or armour is called on the screen", the live name
  pool under names, a measured "how you see it" for the haircut, the names and the weapon tables, and a pointer at this
  page). Two kinds moved to DATA on their own since 10/17: relations and what an arriving party does to a place (the
  settlement screen reads relations.json and arrival_traits.json live now, measured by the walk's own loads);
- MODDING.md: one bullet under "See your change in the game today" (each screen names a weapon from its own table; armour
  by band; a town's name is its key; this page). Help, not a rule; it makes no mod.

## PROOF

`node tools/bohemia_mods_screen_word.js --prove --passes A,C --bank ...` on 77f3e5f4 plus this round's tool, exit 0: the
seeded walk 435 strings in 428,486 ms (door: 15 origins swiped, ANOTHER 10 times; town Church at 47,50, two blocks, tier
town, buildings hall, board, stall, bar, smith, armourer, barber, clinic, lot, build; crew 12 men; fight suburb, A FEW
brigands, 6 men each tapped and held); 230 names, 215 found, 15 missed, 74 readouts; pass A 291 tags in 25 files, 127
shown, 13 names gone (433,205 ms); pass C 88 tags in 4 files, 26 shown, 5 gone (440,880 ms). Then `--from` that walk
`--prove --passes D`: 35 tags in 1 file, 25 shown, 7 gone (431,995 ms). Merged: 148 names proved, 140 to one line. The
unseeded first run (A and B): A 327 tags, 133 shown, 20 gone; B 279 tags, 12 shown, 80 gone, the town renamed
"Church~Q17" at tier camp, buildings hall, board, stall, bar, arms, barber, clinic, lot, build, and "fight: the board did
not come up". `node tools/bohemia_mods_data_line.js --write`: 50 kinds; 16 data, 4 data with a code copy, 10 a file not
read live, 17 in code, 2 built by functions, 1 baked, 0 not found.
