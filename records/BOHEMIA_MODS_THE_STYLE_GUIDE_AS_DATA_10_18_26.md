# MODS [the style guide as data] -- THE ART RULES A MODDER CAN READ (10/18/26)

Lane 22 MODS, session mods-59jyd6. Row: THE-ART-RULES-A-MODDER-CAN-READ. RESEARCH ONLY (rules 22, 108, 38g):
nothing implemented, no VOTE sheet (rule 88). Purpose, from the board: rule 114a makes the pixel-art style guide a
data file DIRECTION writes; a modder who adds a sprite needs the same file. This page: how five moddable pixel games
publish their art rules to modders, what shape DIRECTION's file should take so a mod can declare "this sprite follows
the guide" and the gates run on it, and the measurement of where our repo stands today.

Instrument: `node tools/bohemia_mods_style_fields_audit.js` (reads only, one second). Draft shape, nothing reads it:
banks/BOHEMIA_MODS_SPRITE_DECLARATION_DRAFT_10_18_26.json (draft:true).

Network note (same as every MODS round): the wikis themselves do not resolve from this container (minecraft.wiki,
stardewvalleywiki.com, rimworldwiki.com, terraria.wiki.gg, lua-api.factorio.com all refused), so every citation below
came through search-result text, two searches per game. Where a claim rests on one community page, it says so.

## 0. THE FINDING IN FOUR SENTENCES

Every moddable pixel game publishes its art rules as GEOMETRY (a frame size, a sheet width, a facing suffix, a canvas
that must match vanilla) and a MANIFEST (a format number), and not one of the five publishes palette, light or outline
rules as data; style is taught by unpacking vanilla and enforced by the community's eye. Our repo already has the
geometry half the way Battle Brothers does it: the fight's sheet declaration (frame 112, facings as rows, clips as
columns, a file per look) is this game's metadata.xml. For the style half, 12 of the 20 fields of the research page's
Section C have a number a program can read today, but five of those twelve are BANDS MEASURED FROM HIS PACKS (floors
and medians), not caps: the card says a prop holds at least 2,330 colours, where Section C's illustrative example says
at most 6. So DIRECTION's file cannot copy the research page's example numbers, and a modder handed Section C as-is
would build the wrong sprite by a factor of a few hundred.

## 1. HOW FIVE MODDABLE PIXEL GAMES PUBLISH THEIR ART RULES

| game | where the rule lives | what it fixes | what it does NOT fix | source |
|---|---|---|---|---|
| **Battle Brothers** | no official kit; the community kit (Adam Milazzo, bbrusher, 2019) unpacks a packed atlas PNG in gfx/ plus a .brush descriptor into a metadata.xml: a brush name and version, then one entry per sprite with id, offsetY, colour, width, height, image path and left/right/top/bottom | the sheet's geometry and every sprite's id and offset; a new sheet must be listed in preload/on_running.txt or it never loads; code calls sprites by id, so two mods with one id collide | nothing about palette, light or outline; the modder learns the look by unpacking vanilla and matching the canvas | [Fandom: Mods and Modding](https://battlebrothers.fandom.com/wiki/Mods_and_Modding), [Enduriel's bbbuilder docs: Brushes](https://bbmodding.enduriel.com/docs/concepts/brushes/), [Adam Milazzo's mod kit](https://www.adammil.net/blog/v133_Battle_Brothers_mod_kit.html), [BattleBrushes (brush format: a binary descriptor, version 17 in vanilla)](https://github.com/p0ss/BattleBrushes/) |
| **Stardew Valley** | the wiki, per asset kind: tiles 16x16, an NPC overworld sprite 16x32 on a sheet of fixed width, a portrait frame 64x64, two across (128 wide), the game counting frames from the sheet's height; the farmer 16 wide by 32 tall | frame size and sheet width per kind; a sheet may grow DOWNWARD (Content Patcher: an area past the bottom edge resizes the image to fit) but not sideways (SMAPI: extending horizontally may cause errors); a portrait not 64x64 needs a framework mod | style: the community says higher-res art "tends to stick out a lot next to vanilla", which is the eye, not a check | [forum: sprite sheets, size](https://forums.stardewvalley.net/threads/sprite-sheets-size-and-how-to-edit-make.7254), [wiki: Farmer sprite](https://stardewvalleywiki.com/Modding:Farmer_sprite), [Nexus: adapting a portrait mod](https://www.nexusmods.com/stardewvalley/articles/1459), [Content Patcher EditImage docs](https://github.com/Pathoschild/StardewMods/blob/develop/ContentPatcher/docs/author-guide/action-editimage.md), [SMAPI IAssetDataForImage](https://git.nea.moe/github/SMAPI.git/tree/src/SMAPI/IAssetDataForImage.cs) |
| **RimWorld** | the wiki's Textures tutorial: a Textures folder of PNGs, the file's PATH is its id (same path overrides vanilla), Graphic_Multi wants _north, _east, _south (west is mirrored by the game), outlines about 2 px per 64 px of tile resolution, textures of 256 px or more "generally excessive" | naming, facings, a density rule stated as a number (2 per 64) | palette and light; a missing texture shows pink and the game runs | [wiki: Mod Textures](https://rimworldwiki.com/wiki/Modding_Tutorials/Textures), [wiki: folder structure](https://rimworldwiki.com/wiki/Modding_Tutorials/Folder_structure), [Ludeon: multitexture retexturing](https://ludeon.com/forums/index.php?topic=52816.0), [Steam: hair mod guide (west is flipped)](https://steamcommunity.com/sharedfiles/filedetails/?id=2860925280) |
| **Terraria** | the wiki's Resource Pack page: pack.json required (Name, Author, Description, a Version object) or the pack is not recognised; icon.png optional; replacements under Content/Images keep the vanilla FILE NAME and CANVAS SIZE; the higher pack in the enabled list wins | name and canvas; load order | everything about style; the canvas rule itself is stated by the older wiki page and by a third-party guide, not the current wiki page | [wiki: Resource Pack](https://terraria.wiki.gg/wiki/Resource_Pack), [older wiki: Texture Pack](https://terraria.gamepedia.com/Texture_Pack), [Steam: creating texture packs](https://steamcommunity.com/sharedfiles/filedetails/?id=2120051264) |
| **Minecraft (Java)** | pack.mcmeta carries pack_format (it changes nearly every update; a mismatch warns "incompatible" but the pack loads; supported_formats gives a range); an animated texture is frames stacked below the first, each frame assumed square from the smaller dimension, with a .mcmeta beside the PNG named exactly like it | the manifest number; animation geometry; a wrong frame count shows the missing texture; a misnamed .mcmeta is ignored silently | palette, light, outline | [Minecraft Wiki: Resource pack](https://minecraft.wiki/w/Resource_pack), [Fandom: creating a resource pack](https://minecraft.fandom.com/wiki/Tutorials/Creating_a_resource_pack), [PacksMC: animated textures](https://packsmc.com/articles/animated-textures-mcmeta-guide), [minevinyl: pack format explained](https://www.minevinyl.com/guides/pack-format-explained) |

The one game whose rules are closest to a data file is Factorio (page two of this round): every sprite declares
filename, width and height (0 to 4096 each) in the prototype data, and the engine checks the rectangle against the PNG
at load. Still geometry.

**The pattern, in one line:** a SIDE FILE beside the sheet (metadata.xml, .mcmeta, pack.json, the prototype table)
declares the geometry; the style is a wiki page and the eye. Nobody ships palette-as-data to modders. That is the gap
rule 114a closes for us, and it is also why there is no precedent to copy for the style half; the geometry half we copy
from Battle Brothers, because we already have it.

## 2. WHAT OUR REPO HOLDS TODAY, FIELD BY FIELD (measured)

`node tools/bohemia_mods_style_fields_audit.js`, 10/18:

| # | field (Section C) | today | where |
|---|---|---|---|
| 1 | identity statement | prose | records/BOHEMIA_ANALOG_HORROR_BIBLE_9_20_26.md |
| 2 | pixel size | DATA | the rig's rig.json: 57 px a metre; the fight sheet's frame 112 |
| 3 | camera | DATA | rig.json camera: tilt 45, turn 0, orthographic |
| 4 | master palette | DATA, half | records/target/BOHEMIA_MASTER_PALETTE.json: 64 hexes, no roles, no ramps, its own status line says NOT YET ENFORCED; plus seven family palettes of 64 (.gpl), which the skill file says are a reading aid, not a snap |
| 5 | colour budget per class | DATA, inverted | the card of numbers: a FLOOR per family (prop 2,330 to 5,194 colours), no class for people, beasts or UI |
| 6 | light direction | DATA, half | the card's top-minus-bottom band; the rig's sun is a sentence ("upper left, above"), not an angle |
| 7 | shading steps | DATA, half | a value-span band; no step count, no "never black" |
| 8 | outline rule | DATA, half | an edge-minus-inside band per pack family; nothing for people or UI |
| 9 | AA and dither | code | banding must be 0 in check.py; no file |
| 10 | proportions | DATA, half | rig.json real_dims_m; no silhouette feature per class |
| 11 | detail budget | DATA, half | a grain band; no rest-region share |
| 12 | variation | NONE | no variant count or run limit anywhere |
| 13 | ground contact | DATA, half | rig.json contact_shadow is a flag, not a size |
| 14 | UI rules | NONE | no font file named, no radius or gradient rule in data |
| 15 | animation timing | DATA | rig.json: 120 BPM, 3 keys a beat |
| 16 | do and don't | picture | one PNG of three lessons, not one per field |
| 17 | named mistakes | prose | the skill's faults page |
| 18 | tie-breaker | NONE | |
| 19 | review procedure | code | check.py and look.py |
| 20 | reference board | DATA, half | reference/art_bank/CORPUS.json: 1,927 tiles by family; no anti-reference list |

**12 of 20 have a number a program can read; 5 are prose, a picture or code; 3 exist nowhere.** Of the 12, only
three are RULES (pixel size, camera, animation timing); the rest are measurements of his packs (bands) or flags.

**The finding that proves the premise wrong.** The board's row assumes the modder needs "the same file" DIRECTION
writes from Section C. Section C's illustrative numbers (a 48-colour master palette, 12 colours a character, 6 a prop,
5 a 16x16 tile) describe limited-palette pixel art. His packs are not that: the card of numbers measures 3,000 to 4,500
colours a tile and the skill file says in so many words "his tiles are not limited-palette art: a cut from them keeps
all its colours", and the rig round three found that snapping a render to 64 colours sent it BACK 3 of 8. So the
field list of Section C is right and its example values are wrong for this game by two to three orders of magnitude.
DIRECTION's file has to carry our measured bands where Section C has caps, or the gate family and the modder both
chase the wrong number. (Section C said its values were illustrative; the point is that nobody should copy them, and a
modder reading a style guide copies what it says.)

## 3. THE SHAPE DIRECTION'S FILE SHOULD TAKE (so a mod can declare it follows the guide)

Three decisions, each with the game that taught it:

1. **One JSON with a schema number, a `classes` table keyed by asset class, and a `tests` list** (the full draft is
   banks/BOHEMIA_MODS_SPRITE_DECLARATION_DRAFT_10_18_26.json, draft:true). A sprite names its class; the checker looks
   up the class's limits. The measured bands stay in the card of numbers and are REFERENCED by path and key, never
   copied (two copies drift; the data line page already lists three kinds that drift today). The `tests` list names the
   ten checks and the KEY each reads, so PLUMBER's gate family and the mod check read one set of thresholds (rule
   114b's "thresholds read from DIRECTION's style guide file when it exists"). Minecraft's lesson: a format number
   that WARNS on mismatch and loads; the data folder's own schema policy (MODS [base changes]) applies unchanged.
2. **The sprite declaration is a side file in the mod folder, in the fight sheet's own row shape** (Battle Brothers'
   metadata.xml, Minecraft's .mcmeta). The fight already declares its sheets in slices/fight_people/fight_people.json:
   frame 112, figure_bbox, rows of facings, cols of clip@phase, a `looks` table keyed by id with a file each. A mod's
   `sprites.json` carries rows keyed `<modid>:<name>` (the id policy, MODS [ids never change]) with file, class, family,
   facing, frame, anchor and `guide: "bohemia-style-guide@1"`. That last word is the declaration "this sprite follows
   the guide"; the schema number tells the checker which thresholds it was drawn to.
3. **Geometry blocks, style reports.** Frame, facings and anchor are checked the way all five games check them: wrong
   geometry skips the row by name (Factorio's error names the file and the rectangle; Terraria and Minecraft fall back
   to vanilla or the missing texture). The ten style tests print OK/OUT per test and the sprite loads anyway. Reasons:
   his 9/30 (this chat helps people mod, it writes no limits), his 10/9 NO on "how big is too big", and the fact that no
   shipped game blocks on style, so blocking would be a first with no evidence it helps.

What this costs DIRECTION: nothing it was not already writing. The twenty fields become keys; the five "half" rows in
section 2 need the missing half (an angle for the light, a size for the contact line, a cap or a band per class
including people and UI, a variant count, a font file). What it costs a modder: three words in a row (class, family,
guide).

## 4. WHERE THE FILE LIVES, AND ONE WARNING

Rule 114a says "inside the analog horror bible's folder". The bible is a record (records/BOHEMIA_ANALOG_HORROR_BIBLE_9_20_26.md),
not a folder, and Pages publishes records/target/ and nothing else under records/ (_config.yml). The card of numbers
and the master palette already sit in records/target/, so a style guide file beside them is read by the alpha's pages
and by a modder's browser alike, and by the gates from disk. A file anywhere else under records/ works for the gates
and 404s for a page. One line for DIRECTION; the choice is its.

## 5. ROUTED

- **DIRECTION** [the style guide]: section 2's table is the floor; section 3's shape (classes keyed, tests keyed, bands
  referenced not copied); the Section C example numbers are not this game's; records/target/ for the file.
- **PLUMBER** [the not vibe coded gates]: read thresholds by the `tests[].reads` keys of the draft, so the same ten
  functions serve a VOTE sheet and a mod's sprites.json (page two of this round, the hook line).
- **COMBAT / ANIMATION**: the fight sheet declaration is the only sprite table a modder could patch and it lives under
  slices/, outside the data folder the merge reads; the data line page already lists it as "a file no screen reads
  live" for beasts. Nothing to do until he says mods build; named so nobody designs a second sprite table.
- **RUN**: nothing. Nothing touches the demo.
