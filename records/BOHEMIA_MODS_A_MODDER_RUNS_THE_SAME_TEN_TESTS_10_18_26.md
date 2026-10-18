# MODS [the ten gates as a mod check] -- A MODDER RUNS THE SAME TEN TESTS (10/18/26)

Lane 22 MODS, session mods-59jyd6. Row: A-MODDER-RUNS-THE-SAME-TEN-TESTS. RESEARCH ONLY (rule 22, 38g): nothing
implemented, no VOTE sheet (rule 88). Purpose, from the board: rule 114b's ten image tests should run on a modder's
sprites too, or a mod reintroduces the AI look. This page: how four moddable games validate mod assets before load,
the one line in the mods folder design where the ten tests hook, and the measurement of what a sprite mod meets in our
reference merge today.

Instrument: `node tools/bohemia_mods_style_fields_audit.js` (reads only). Companion: the style guide page of the same
round, records/BOHEMIA_MODS_THE_STYLE_GUIDE_AS_DATA_10_18_26.md. Network: the wikis do not resolve from here; every
citation came through search-result text.

## 0. THE FINDING IN THREE SENTENCES

All four games validate a mod's assets at load for GEOMETRY and a MANIFEST NUMBER, and the strict one (Factorio)
switches the mod off by name while the lenient three (Minecraft, RimWorld, SMAPI) substitute a loud placeholder or
warn and keep running; none of the four tests style, so rule 114b's ten tests on a mod's sprite would be the first
style check at mod load in any of them. Our reference merge today ignores a PNG in a mod folder WITHOUT A WORD (its
file filter reads .json only) and names a sheet declaration "no such data file" because the fight's sheet table lives
under slices/, not in the data folder. The hook is one rule in the folder design's section 2, and the check that would
run already exists and takes 0.67 s a sprite.

## 1. HOW FOUR MODDABLE GAMES VALIDATE MOD ASSETS BEFORE LOAD

| game | when | what is checked | what happens when it fails | what is never checked | source |
|---|---|---|---|---|---|
| **Factorio** | the data stage, at startup, before any game | info.json (name, version, title, author, factorio_version as "number.number", dependencies; a mod targeting 1.x does not load on 2.0 until the field is updated); every sprite's declared filename and width/height or size (each 0 to 4096; a spritesheet wider than 8192 is refused); the rectangle must lie inside the PNG | a startup error naming the prototype, the file and the rectangle ("The given sprite rectangle (left_top=..., right_bottom=...) is outside the actual sprite size"), and the log lists the mod under "Mods to disable"; an off-by-one pixel in the art is enough; shrinking the sprite to pass draws it invisible | palette, light, outline, detail | [Factorio prototype docs: SpriteSource (0 to 4096)](https://lua-api.factorio.com/latest/types/SpriteSource.html), [Sprite](https://lua-api.factorio.com/latest/types/Sprite.html), [forum: sprite rectangle outside the sprite](https://forums.factorio.com/viewtopic.php?p=674738), [forum: maximum spritesheet width is 8192](https://forums.factorio.com/viewtopic.php?p=579123), [mod page: off by one pixel](https://mods.factorio.com/mod/pre-heated_exchanger/discussion/6a5c02368437c5b8c268da42), [forum: factorio_version error](https://forums.factorio.com/viewtopic.php?p=683564) |
| **Minecraft (Java)** | when the pack is selected and on resource reload | pack.mcmeta's pack_format against the game's; an animated texture's frames (stacked below the first, square frames assumed from the smaller side, height a multiple of the frame) | a format mismatch shows the pack as incompatible and loads it anyway; wrong frames show the missing texture (the magenta and black checker); a .mcmeta whose name does not match the PNG is ignored silently | style | [Minecraft Wiki: Resource pack](https://minecraft.wiki/w/Resource_pack), [PacksMC: animated textures](https://packsmc.com/articles/animated-textures-mcmeta-guide), [minevinyl: pack format](https://www.minevinyl.com/guides/pack-format-explained) |
| **RimWorld** | at startup, when Defs resolve their graphics | that the texture path a Def names exists under some loaded mod's Textures folder; Graphic_Multi wants the _north, _east, _south files (west is flipped by the game); folder names are case-sensitive | a missing or misnamed texture draws pink and writes a red line in the log; the game runs; renamed suffixes (_back, _side, _front were the old names) are the classic break after an update | size, palette, outline (the wiki's "about 2 px per 64 px" and "256 px is excessive" are advice, not checks) | [wiki: Mod Textures](https://rimworldwiki.com/wiki/Modding_Tutorials/Textures), [Steam: headgear missing north textures](https://steamcommunity.com/app/294100/discussions/0/1744480967032566187), [Steam: _back to _north](https://steamcommunity.com/app/294100/discussions/0/1749021736842846460), [RWModdingResources](https://github.com/spdskatr/RWModdingResources/blob/master/index.md) |
| **Stardew (SMAPI + Content Patcher)** | when the mod loads and when each asset is requested | content.json's Format version (the docs say always use the latest); an EditImage patch's FromArea must lie inside the source and ToArea inside the target, except that an area past the bottom edge grows the sheet; a replacement of the wrong type is refused | SMAPI prints the error per patch with the mod's name ("Failed loading asset", an invalid cast on replacement) and skips that patch, the game runs; a folder with wrong extensions is skipped as empty | style ("higher-res tends to stick out next to vanilla" is the community's eye) | [Content Patcher EditImage docs](https://github.com/Pathoschild/StardewMods/blob/develop/ContentPatcher/docs/author-guide/action-editimage.md), [SMAPI IAssetDataForImage](https://git.nea.moe/github/SMAPI.git/tree/src/SMAPI/IAssetDataForImage.cs), [forum: SMAPI skips a mod as empty](https://forums.stardewvalley.net/threads/smapi-skips-mod-because-it-says-that-its-empty-when-it-isnt.17622/latest), [forum: EditImage invalid cast](https://forums.stardewvalley.net/threads/formatexception-input-string-was-not-in-a-correct-format-error.17326/latest) |

Battle Brothers (one line, from the style guide page): no validation at all; a sheet not listed in preload/on_running.txt
never loads, a wrong brush is a missing sprite at runtime, two mods with one sprite id collide.

**Two patterns, both ours already.** (a) GEOMETRY BLOCKS, BY NAME: the four games refuse a sprite whose declared frame
does not match its PNG, and the good ones name the file and the numbers. Our reference merge does the same for a row
(a wrong type skips the whole row and names it, M01 to M20). (b) A WRONG VERSION WARNS AND LOADS: Minecraft's
"incompatible" pack and Content Patcher's Format both load; our merge's old-schema rule (M16) is the same. The ten
style tests belong under (b), not (a): a report, never a refusal (his 9/30: help only; his 10/9 NO on limits).

## 2. WHAT A SPRITE MOD MEETS IN OUR REFERENCE MERGE TODAY (measured)

A mod folder holding manifest.json, robot_S.png (the rig's robot, S facing), robot_S.json, fight_people.json and
sprites.json, through the merge's own file filter (`readdirSync(mdir).filter(f => f.endsWith('.json') && f !== 'manifest.json')`):

| file in the mod | what happens today |
|---|---|
| manifest.json | read as the manifest |
| robot_S.png | IGNORED WITHOUT A WORD: the filter reads .json only, so a PNG is neither loaded nor named |
| robot_S.json | M19, no such data file, ignored: no sprite table exists in records/target/bb |
| fight_people.json | M19, no such data file: the real one lives under slices/fight_people/, outside the data folder the merge reads |
| sprites.json | M19, no such data file |

Run live with tools/bohemia_mods_check.js on a scratch folder: "1 mod read. Nothing changed in the game data. 0 parts
skipped, 1 note" and the PNG never appears in the output. So a modder who adds a sprite today gets silence, which is
the one thing the error-messages page (M01 to M20) was written to end.

The check that would run: skills/bohemia-pixel-art/scripts/check.py <png> <family>. On the robot's S render as a prop:
the card 7 of 8 OK (grain 2.25 against 2.22 out), the craft 4 of 4 OK (stray pixels 3.0%, one pixel size, no banding,
light from above at 262.8 degrees), in 0.67 s. It takes the family from the command line; nothing in or beside the
PNG declares one. Its four craft rows are already four of rule 114b's ten (T01 pixel size, T03 light, T08 banding and
orphans); the card's eight rows cover T02 and T07 as bands. Six of the ten have a function in the repo today; the four
that do not (hue shift, detail distribution, silhouette separation, UI defaults) are PLUMBER's to build for the VOTE
sheets anyway, and the mod check calls the same functions.

## 3. THE ONE LINE WHERE THE TEN TESTS HOOK

The mods folder design (records/BOHEMIA_MODS_THE_MODS_FOLDER_DESIGN_10_10_26.md) section 2, rule 4 reads: "A value of
the wrong type skips the WHOLE row change (never half a row); an unknown field is ignored and named; an old `schema`
number warns and loads." The hook is one added sentence, in the same voice:

> **4b. A sprite row** (a row of a proposed sprites.json that names a file) is skipped by name when its file is missing
> (M21), its frame does not match its class (M22) or a facing its class requires is missing (M23), the way a wrong type
> skips a row; an unknown class warns and takes prop's band (M24); then the ten style tests of the style guide file run
> on the file with its class's thresholds and print OK or OUT per test (M25), and the sprite loads either way.

That is the whole change to the design: geometry joins the skip rules, style joins the warn rules, five new codes
continue the error-messages table. The proof legs follow the folder design's own pattern: a mod with a wrong frame
gives the same data hash as no mod (leg 2a of the design's gate), a mod with a bad-style sprite gives a changed hash
plus five OUT lines, and a mod with no sprites.json is byte-for-byte what it is today. The full draft of the sprite row
and the style file is banks/BOHEMIA_MODS_SPRITE_DECLARATION_DRAFT_10_18_26.json (draft:true).

Why warn and not block on style, said once more with the evidence: no shipped moddable game blocks on style; his 9/30
and 10/9 words put limits off this chat's table; and a blocked sprite teaches nothing, while five OUT lines with the
numbers teach the modder exactly what a cook learns from check.py. A mod that reintroduces the AI look is then a mod
whose report says so in five lines, which is what the row asked for.

## 4. WHAT THIS DOES NOT COVER

- Sheets, not single PNGs: the fight reads a packed sheet per look (frame 112, cols by clip and phase). The ten tests
  run per frame; a sheet check is the same loop over the cols the declaration lists. Not measured this round.
- Where a mod's PNG is served from on a phone: the 9/28 page found a phone mod is a picked JSON file; a PNG rides as a
  data URL inside it, which the pack tool already round-trips for JSON. Size is TUNING's (his NO on limits).
- The thresholds themselves: DIRECTION's, per the style guide page of this round.

## 5. ROUTED

- **PLUMBER** [the not vibe coded gates]: build the ten as functions that take (png, class, thresholds), not as a gate
  that takes a VOTE sheet, so the mod check can call them; the four craft rows of check.py are the first four.
- **DIRECTION** [the style guide]: the `tests[].reads` keys in the draft are the thresholds the ten read; a class table
  that includes people, beasts and UI, which the card of numbers has no family for.
- **RUN / COMBAT**: nothing until he says mods build; the demo is untouched.
