# MODS [the face apart] -- WHAT THE FACE COSTS INSIDE THE SHEET AND OUT (10/18/26)

RESEARCH ONLY (rule 22, 38g). Nothing implemented, nothing in the game reads anything here, no VOTE sheet (rule 88).
Instruments (read only): tools/bohemia_mods_face_apart.py (the bytes and the readers, about three minutes; `--json`;
`--split DIR` writes the split WebPs OUTSIDE the repo) and tools/bohemia_mods_face_apart_fetch.js DIR (the phone, about
fifteen minutes at seven runs). Draft shape: banks/BOHEMIA_MODS_SPRITE_DECLARATION_DRAFT_10_18_26.json, new key
`a_mods_sprite_declaration.a_face_apart`. From [a sheet's class] section 5b
(records/BOHEMIA_MODS_WHERE_A_SHEET_NAMES_ITS_CLASS_10_18_26.md).

## 0. THE FINDING IN FOUR SENTENCES

Taking the 64 px face out of the packed fight sheet costs NO bytes: with the bake's own encoder (re-encode
byte-identical on 26 of 26) the 26 faces alone weigh 15,036 bytes and inside the sheets they weigh 21,142, so the split
pair is 6,106 bytes LIGHTER than the packed sheet on every one of the 26 looks (36 to 534 bytes each). The only price
is the second fetch, and on the phone profile (CPU 4x, the fleet's LTE) it is under the noise on HTTP/2 (bare fetch of
all 52 files 745 ms against 790 packed) and about 0.1 s on HTTP/1.1 in the real first fight (board baked at 5,079 ms
against 4,983, median of 7, the runs' own spread about 0.2 s). Three live screens read the face today and each finds
it a different way (the manifest's columns, the image width minus 64, and a roster constant whose x, 1,568, is the
14-column sheet's and is read by nobody), and 13 of the 26 looks already ship a SECOND face as its own file (the clay
rig's, 128 px), which every screen but the fight already prefers. The row's premise was wrong twice, which is the
finding: the pack (rule 69, one fetch per look) buys nothing a phone can feel and costs bytes, and the bigger lever
on the first fight is not the face at all but the 8 of 26 sheets (256,042 bytes, 31 percent) the fight fetches for
looks that are not on its board.

## 1. THE BYTES (26 looks, the bake's settings: PIL lossless WebP, quality 100, method 6)

| | bytes | note |
|---|---|---|
| the 26 packed sheets as committed | 820,114 | 3,872 x 224 each: 34 columns of 112, then the 64 x 224 face column (the face 64 x 64 at its top, the 160 px under it empty on 26 of 26) |
| the same 26 without the face column | 798,972 | 3,808 x 224 |
| the 26 faces alone | 15,036 | 466 to 712 each, mean 578 |
| split total | **814,008** | **6,106 lighter (0.7 percent); lighter on 26 of 26** |
| what the face costs inside a sheet | 21,142 | 518 to 1,060 each, mean 813: about 1.4 times its own file |
| the smallest lossless WebP | 28 | the container's floor, so a file's own overhead is not where the cost is |
| an HTTP/1.1 response's headers, served like Pages | about 306 | measured on the wire: 26 sheets 828,096, 52 files 829,920 (the driver's Pages headers; GitHub's own could not be read, its host is refused here) |

So on HTTP/1.1 the split is +1,824 bytes on the wire (26 more header blocks eat the 6,106), and on HTTP/2, whose
header compression sends a repeated header set in a few bytes, it is lighter. Measured, not explained: the lossless
encoder spends more on the face beside the last body column than on the face alone.

## 2. THE FETCH (measured; median of 7, the three variants taken in turn inside each run)

(A) THE REAL FIRST FIGHT, slices/BOHEMIA_FIGHT.html through the one driver (390 x 844 at 3x, CPU 4x, LTE 12 Mbit/s
down, 3 up, 70 ms; served like Pages over HTTP/1.1), clock stopped when the board is baked (every sheet in). The split
copies live in the scratch folder and reach the browser through the driver's serve map; slices/ is untouched.

| variant | requests (people) | people bytes on the wire | people in | board baked | spread of the 7 |
|---|---|---|---|---|---|
| packed, as shipped | 26 | 828,096 | 3,593 ms | **4,983 ms** | 4,770 to 5,803 (the 5,803 is the first, cold) |
| a face file for every look | 52 | 829,920 | 3,876 ms | **5,079 ms (+96)** | 4,902 to 5,130 |
| a face file for the looks on the board only (18) | 44 | 823,106 | 3,710 ms | **4,944 ms (-39)** | 4,828 to 5,001 |

The people arrive up to 283 ms later with every face apart, but the board waits on the ground and the data files too,
so the first fight moves by 96 ms at worst (1.9 percent), inside the packed runs' own spread.

(B) THE BARE FETCH, the same images and nothing else (cache off, the same phone and CPU), from an HTTP/1.1 server and
from an HTTP/2 server (the browser confirmed `h2`), because the driver's server is HTTP/1.1 with six connections a host:

| | packed (26) | every face apart (52) | board faces only (44) |
|---|---|---|---|
| HTTP/1.1, LTE | 779 ms | 1,075 (+296) | 955 (+176) |
| HTTP/1.1, slow 4G (1.6 Mbit/s, 150 ms; Lighthouse's mobile profile) | 4,399 | 4,848 (+449) | 4,636 (+237) |
| HTTP/2, LTE | 790 | **745 (-45)** | 783 (-7) |
| HTTP/2, slow 4G | 4,368 | 4,635 (+267) | 4,444 (+76) |

The extra fetch costs only where requests queue: HTTP/1.1, or a slow line. On HTTP/2 and LTE it is free. Whether
github.io answers the phone in HTTP/2 could not be read from this box (every github.io host refused by the proxy);
Fastly fronts Pages (fastly.com's GitHub page) and speaks HTTP/2, so both columns are written and the answer above does
not hang on it: even the HTTP/1.1 worst case is 0.1 s on the real fight. A face file is also one more revalidation
(a 304) per look once the 10-minute cache runs out, which rides the same multiplexing.

## 3. WHO READS THE FACE TODAY (the instrument re-finds each line; a reader that moves prints GONE)

| place | what it shows | how it finds the face | reads it for |
|---|---|---|---|
| slices/BOHEMIA_FIGHT.html:2229, drawPortrait (two callers: the turn strip at 36 and 42 points, the bar's face) | his face, every look | frame x cols.length and face.size from fight_people.json | **all 26 looks, every fight**: the fight never uses the rig face |
| slices/BOHEMIA_SETTLEMENT_SCREEN.html:1006, flatFace (a hire card; a speaker with no portrait yet) | the old flat 64 | the image's width minus 64, no manifest | only a look with no rig face (the 13 factions), or when the rig face fails to load |
| slices/BOHEMIA_ROSTER_SCREEN.html:214, faceCanvas (the crew screen) | the old flat 64 | the image's width minus 64, y from the roster constant | only a look with no rig face |
| engine/bohemia_roster.js:148, `FACE: { x: 1568, y: 0, s: 64 }` | nothing | x 1,568 = 14 x 112, the sheet when it had 14 columns; it has 34 | y only; the stale x is read by nobody, so it is a trap, not a bug |

Read from elsewhere, so NOT readers of the block: engine/bohemia_rig_faces.js (the rig face file, one per look, 128 px,
13 looks) and the demo's talking portrait (keeperFaceSrc, slices/BOHEMIA_DEMO.html:6818: renderFace draws the face at
64 px, it reads no sheet). In the toolchain: tools/bohemia_fight_people_bake.js writes the block;
tools/bohemia_mods_sheet_cost.py and tools/bohemia_mods_sheet_class.py read its rectangle; one gate pins the bar to the
sheet by its text (gates/the_rebuilt_fight_plays_gate.js:118, `faceFromBank: /atlasOf/.test(drawPortrait.toString())`),
so a face file in the fight goes red there unless the leg moves with it. tools/bohemia_portrait_the_head_from_the_model.py
sets `twin_face=True` on its crew rows and nothing in the tool reads that flag.

So: three screens, three ways to find one face, none of them the same, and only one of them (the fight) reads the
manifest. The face's `at` ("right of the last column, top row") is read by no code at all.

## 4. THE SECOND FACE IS ALREADY APART

RUN TWO's rig faces (10/18, rule 115(h), THE FIRST STAR: the face from the same model is every face) are their own
files: 13 looks (YOU and the twelve cast), 43,940 bytes, 128 px. The crew and scavenge screens wear them; the fight's
bar and turn strip still wear the flat 64 from the sheet for those same 13 looks. For them the sheet's face (10,704
bytes) is a second, older face that only the fight shows. Two of the 13 rig faces weigh 11 to 12 KB (cast_pack 12,048,
cast_bedroll 11,310) against about 1.8 KB for the other eleven: those two are PORTRAIT's heads from the model (the
thug's and the poacher's, the first star), the rest a rig body's head (slices/rig_faces/rig_faces.json, `kind`), so the
real face is six times the bytes of the stand-in: about 40 percent of one sheet, 1.5 percent of the 26.

## 5. THE SCHOOL

| | the face | the body | how the game finds the face |
|---|---|---|---|
| **Stardew Valley** | its own asset, Portraits/<name>: cells of 64 x 64 (our size exactly), two across, as many rows as it has expressions | Characters/<name>, frames of 16 x 32 | the cell index; the game counts the portraits from the sheet's height, never from a list (stardewmodding.wiki.gg, the portraits tutorial); a replacement swaps both files "as a matched pair" or "the sprites will glitch out" (a Nexus replacement's own note) |
| **Battle Brothers** | not verified from here: the wiki is still refused, Grok's ask 19 (PASSED FILTER) says the wiki gives no turn-order portrait size, and the community kit's .brush atlases group sprites by kind (records/BOHEMIA_MODS_WHERE_A_SHEET_NAMES_ITS_CLASS_10_18_26.md) | layered brushes on one entity | (recall, unverified) the turn strip draws the same layers small; nothing here cites a number from it |
| **the web on sprites** | HTTP/2 multiplexing makes the request count "no longer the thing to optimise for" (specification.website, HTTP/1 workarounds) | the counterpoint is bytes: an HTTP/2-era benchmark found one sprite sheet 71 kB against 106 kB of separate icons (blog.octo.com) | ours is the counterpoint turned over: this face is SMALLER apart |

So the school agrees with the bytes: a face is its own file and its own class (Stardew; the rig already does it), and
the pack's old reason (fewer requests) is the one HTTP/2 removed.

## 6. WHAT IT MEANS FOR A MODDER (the draft; nothing reads it)

Two shapes, both in the draft bank:
- **(a) the face as its own file** (the school's way): a look names `face: {file, size, class: portrait}`; the sheet
  holds only frames, one class, one pixel size, and the ten tests need no exception for it (G1's mixel question from
  [a sheet's class] goes away). A modder adding a drifter ships `drifter.webp` and `drifter_face.webp` and never
  computes a rectangle. Cost measured above: -6,106 bytes, 0 to +0.1 s on the first fight.
- **(b) the face as a declared block** ([a sheet's class]'s `blocks`): one file per look, and every check and every
  screen computes the same rectangle; today three screens compute it three ways, so (b) only holds if the manifest's
  rect is the one thing they all read.

The measurement favours (a) on every axis it can measure (bytes, fetch on HTTP/2, readers, school, the check). The one
cost of (a) is the change itself: the bake writes two files, the fight's bar reads a second image, the gate leg above
moves with it. Choosing is not this lane's (research only): it is COMBAT's file and DIRECTION's G1.

## 7. THE FINDING THAT PROVES US WRONG

Two premises fell. (1) The row, and rule 69's "one fetch per look", assumed the pack saves something a phone feels:
measured, it costs 6,106 bytes and saves 26 requests worth -45 to +96 ms. (2) The row asked what splitting costs the
first fight; the first fight's real cost is elsewhere: it fetches all 26 sheets (820,114 bytes) to show 18 looks on
all three boards measured (strip 31, suburb 5, scrub 9, the standalone fight's default company and enemies), so 8
sheets, 256,042 bytes (31 percent of the people bytes, 12 times the faces' whole weight inside the sheets), arrive for
nobody: cast_bedroll and the factions blues, cartel, church, colorful, network, volunteers, remnants. In the demo the
company and enemies come in the fight's opts and can differ, but the loader still asks for every look
(slices/BOHEMIA_FIGHT.html:1567). Not measured: what fetching only the board's looks saves on the clock (named, routed).

[bb school]: Battle Brothers' face could not be verified from this box (wiki refused); the Stardew row is the cited one.
Analog horror line: a data question, no pixel or sound changes; the face being its own file is what lets the clay
rig's face (the look he starred) replace the flat 64 in the fight without repacking 26 sheets.

## 8. ROUTED (research only; the owners decide)

- **COMBAT** (owner of fight_people.json and the fight's bar): (a) the bar and the turn strip are the one place still
  showing the flat 64 for the 13 looks that have the starred rig face (rule 115(h)); (b) if the face leaves the sheet,
  gates/the_rebuilt_fight_plays_gate.js:118's `atlasOf` leg moves with it; (c) the loader asks for all 26 sheets and the
  boards measured use 18 (256,042 bytes for nobody); `face.at` in words is read by no code.
- **RUN TWO** (the roster and settlement screens): engine/bohemia_roster.js:148's `FACE.x` 1,568 is the 14-column sheet's;
  nothing reads it today, the next reader will be wrong by 2,240 px. Both screens find the face by the image width.
- **DIRECTION** [the style guide] G1: if the face ships as its own file, the portrait-inside-a-person-sheet exception
  from [a sheet's class] is not needed.
- **PLUMBER** [the not vibe coded gates]: the sheet check reads either a face file or a declared block; (a) means no
  block parsing for the fight's sheets.
- **PORTRAIT**: the two heads from the model weigh 11 to 12 KB against 1.8 KB for the stand-ins; 26 of them would be
  about 300 KB, a third of today's people bytes, so the starred method's weight is worth one number on its row.
- **RUN** (MODS' lead, rule 113a): one line for the scorecard: the face apart is free on the phone and 6 KB lighter;
  the first fight's lever is the 8 unused sheets.

Sources: stardewmodding.wiki.gg/wiki/Tutorial:_Changing/Adding_Portraits (64 x 64 cells, two across, counted from the
height; through search text, the wiki host refused a fetch); nexusmods.com/stardewvalley (the Sandy replacement's matched
pair note, through search text); specification.website/spec/performance/http1-workarounds; blog.octo.com/http2-arrives-but-sprite-sets-aint-no-dead;
fastly.com/customers/github (Fastly fronts Pages); Lighthouse's mobile throttling (150 ms, 1.6 Mbit/s, recall);
reference/library/grok/GROK_98_ASK_19_COMBAT_UI_2026_10_04.md (source: Grok, unverified). Every number in sections 1 to 4
and 7 is this lane's own measurement on main at the commit this record lands in.
