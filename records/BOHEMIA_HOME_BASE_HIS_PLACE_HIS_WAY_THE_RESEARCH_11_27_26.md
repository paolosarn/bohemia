# HOME BASE 5 -- HIS PLACE, HIS WAY: THE RESEARCH (11/27/26)

VAMILY rule 347(c) (PAOLO 11/3, LOCKED): "literally every thing in our custom settlement can be customized... super easy to
customize... that pseudo mayor vibe... not Valheim tile by tile, a Stardew Valley vibe". Rule 343(d): STARDEW VALLEY is named for
the place that is yours and changes because of you. Rule "how did Battle Brothers do it" first for the company. His list:
ITS NAME, WHAT EACH BUILDING IS MADE OF AND PAINTED, ITS SIGNS, WHERE THINGS STAND, WHO LIVES THERE AND THEIR JOBS; upright and
sideways, never choppy (480(c)). Research first (handoffs/HOME_BASE.md, HOME BASE 4's next job). Nothing here is built; the build
record is records/BOHEMIA_HOME_BASE_HIS_PLACE_HIS_WAY_11_27_26.md.

## 1. STARDEW VALLEY (named for this, rules 133, 343(d))

| What | How Stardew does it | Source |
|---|---|---|
| WHERE THINGS STAND | Robin's shop, "Move Buildings": pick the building, then tap where it goes. Green tiles say the spot is good, red that something is in the way. A move costs nothing and takes no days. | [Dot Esports, how to move buildings](https://dotesports.com/general/news/how-to-move-buildings-in-stardew-valley); [Stardew wiki, Modding: migrate to 1.5](https://wiki.stardewvalley.net/Modding:Migrate_to_Stardew_Valley_1.5) |
| PAINTED | Since 1.5, Robin's menu has a paintbrush: tap a building, then paint its ROOF, WALLS and TRIM, three regions, each its own colour; recolouring one part recolours every part in its group; a dotted swatch puts it back as it was. Only a finished building can be painted. | [Stardew wiki, Modding: migrate to 1.5](https://wiki.stardewvalley.net/Modding:Migrate_to_Stardew_Valley_1.5); [Steam discussion at the 1.5 launch](https://steamcommunity.com/app/413150/discussions/0/2998799976083760764) |
| SIGNS | 1.6 added the Text Sign (25 wood, a starter recipe): you place it and type your own words on it. | [Stardew wiki, Text Sign](https://www.stardewvalleywiki.com/Text_Sign); [PC Gamer, 1.6 patch notes](https://www.pcgamer.com/life-sim/stardew-valley-16-update-live-patch-notes/) |
| ITS NAME | The farm is named once, on the character screen at the start, and in the base game never again. | (the game's own new-game screen; no source found that it can be renamed without a mod) |
| WHO LIVES THERE | An animal is named the moment you buy it; it lives in the building you put it in. | (the game's own shop; general knowledge, not re-sourced this round) |

## 2. BATTLE BROTHERS (the company, rule "how did Battle Brothers do it")

| What | How Battle Brothers does it | Source |
|---|---|---|
| A MAN'S NAME AND TITLE | Click the name on the roster screen and type a new one; it carries no game effect. | [Steam discussion: "Click the name at the roster screen"](https://steamcommunity.com/app/365360/discussions/0/135510194250427957) |
| THE COMPANY'S NAME AND BANNER | Picked on the new-campaign screen; a banner generator was planned for new games. No base-game way found to change them later. | [ModDB progress update, custom banners](https://www.moddb.com/news/new-armor-helmet-rework-and-custom-banners-progress-update) |
| WHO DOES WHAT | The retinue: a follower is hired into one slot and does one job (the cook, the surgeon); a man's job is who he is, not a menu. | (the game's own retinue screen; built here already as CAMP TWO's staff, rule 471) |
| ITS OWN PLACE | Battle Brothers has none (rule 343(e)): this whole system is our twist. | rule 343(e) |

## 3. WHAT KEEPS BOTH EASY (the finding we build on)
1. ONE TAP ON THE THING ITSELF. Stardew: tap the building, then the paint or the spot. Battle Brothers: tap the name you want to
   change. Never a separate editor screen.
2. FEW CHOICES. Stardew paints three regions; Battle Brothers changes a name and a title. Not a colour wheel per pixel.
3. YOU SEE IT AT ONCE, ON THE THING. Green and red tiles before the move; the colour on the barn while you pick it.
4. UNDOABLE AND FREE. A move costs nothing; the dotted swatch undoes paint; a name types over.

## 4. THE FINDING THAT PROVES US WRONG (measured against our repo, main 08d726092)
His place is ALREADY customizable in one way only: NAME IT, a button on the BUILD desk (slices/BOHEMIA_SETTLEMENT_SCREEN.html homeDesk)
that types a name. Everything else is decided FOR him:
- WHERE THINGS STAND: the footage puts each piece on the first free lot of its row by the order he built it (homeFeedSlots). He
  cannot move anything. Stardew's first customizing tool is the move.
- WHO WORKS WHAT: the people who live there go to the worked builds in the order they came (the map's homeWorkers). He cannot put
  a person on a job. And on the footage nobody who lives there stands at the build they work: they all stand along the front row.
- SIGNS, PAINT: none exist. His name shows only in the camera's small text, and a tap on it does nothing.
So the round is not "add a menu": it is the Stardew rule, one tap on the thing on his cameras, a few choices, seen at once.

## 5. WHAT THE FOOTAGE CAN SHOW (decided, said plainly)
His place is the 11/3 security footage: pre-rendered pieces per camera, way and lot, at night under sodium, in the IR grey-green.
- WHERE THINGS STAND: every piece has a picture for every lot of its row (and the rows behind for most): a move is a choice among
  those lots, honest on all three cameras. BUILT.
- ITS NAME AND ITS SIGNS: drawn on the footage at the footage's own pixel, a plate on the lot's front in a 3 by 5 pixel letter, like
  the camera's own text (the OSD). Readable when the camera zooms in on it (the station, up to 3x). BUILT.
- PAINTED: night CCTV shows no colour. In near-infrared, real paints DO read different: lime whitewash and red-oxide primer reflect
  near-IR and glow pale, carbon-black tar soaks it up and goes black, olive drab sits between. So a paint is kept on the record and
  shown on the footage as its IR value (each piece's picture re-graded once per paint and cached), and its real colour is the swatch
  he taps. Whole piece, not roof/walls/trim: the pieces have no region masks yet. BUILT.
- MADE OF (tin, block, wood): a material is shape and texture, which a value cannot fake at 180 x 320. It needs the 11/3 pipeline
  to render each piece in each material (tools/bohemia_home_settlement_pipeline_11_3_26.py; Blender is not on this box,
  `pip install bpy` is the way). NOT BUILT THIS ROUND; the next job, with roof/walls/trim regions for the paint in the same render.
- WHO LIVES THERE AND THEIR JOBS: a tap on a person on the footage opens that person; a person who lives there gets WORKS AT:
  each standing build that takes a worker, or REST. He stands at the build he works, on the footage. BUILT.

## 6. NUMBERS (TUNING's to move; mine as defaults, draft)
- A move costs nothing and takes no time (Stardew). A paint costs nothing (Stardew charges nothing for the paint menu).
- A sign holds 12 letters; a name 22 (the engine's existing cap).
- Paints: BARE (as built), LIME, PRIMER, DRAB, TAR: five, one row of swatches (Stardew's few choices).

## ROUTED
- COOK SIX / the 11/3 pipeline's owner: material variants (tin, block, wood) and roof/walls/trim region masks per piece, when bpy
  is on a box. HOME BASE asks, does not render, this round.
- WORDS: the sign's and the name's placeholder words are draft:true.

[bb Battle Brothers: a name is changed by tapping it; a follower is hired into one job. Ours: a person who lives there is put on a job by tapping him.]
[analog horror: his own words painted on a plate, read back to him by a security camera at 3 am]
