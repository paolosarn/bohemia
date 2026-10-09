# MODS [the mods folder design] -- HOW A MODS FOLDER WOULD LOAD WITHOUT TOUCHING THE DEMO (10/10/26)

Lane 22 MODS, session mods-59jyd6. Row: HOW-A-MODS-FOLDER-WOULD-LOAD-AT-BOOT-WITHOUT-BREAKING-THE-DEMO.
Rules: 22 (mod-friendly and readable), his sixth vote ("NAH": mods at boot are not for the demo), his 9/30
verdicts (the point of this chat is to make mods easy for other people to make). MODE: design only. Nothing
is built into the game. The design is proved on the real data by tools/bohemia_mods_merge_reference.js and
tools/bohemia_mods_merge_proof.js (11 of 11 pass); neither is loaded by any play surface.
Builds on records/BOHEMIA_MODS_THE_DATA_SCHEMA_10_9_26.md (the 15 files a mod patches).

## 0. THE DESIGN IN FIVE SENTENCES

A mod is a folder with a `manifest.json` and one patch file per data file it changes, **named like the file it
patches** (`weapons.json` patches `weapons.json`). A patch has the same top-level keys as the base file and
changes a row **by its id**. Mods apply on top of the base in the order an index lists them, with `loadAfter`
respected, and a later mod wins and says so. **Anything wrong is skipped by name and never crashes or
half-applies a row.** The demo has no mods code path at all.

## 1. THE FOLDER

    records/target/mods/             one place, because Pages publishes records/target (_config.yml)
      index.json                     ["knife-harder", "new-sword"]   the ONLY list; see 2a
      knife-harder/
        manifest.json                { "id", "name", "version", "schema", "loadAfter": [] }
        weapons.json                 { "rows": { "knife": { "damage_min": 20, "damage_max": 30 } } }
      new-sword/
        manifest.json
        weapons.json                 { "rows": { "moon-blade": { ...every field a sword row carries... } } }

This folder does **not exist yet** and is not created by this page. The example mods live under
tools/mods_reference/example_mods/ and run through the reference merge.

**2a. Why an index file.** A static host cannot list a directory, so a loader cannot find folders by looking.
The index is also the on/off switch: remove an id and the mod is off. On a phone the same mod can arrive as one
picked JSON bundle `{ "manifest": {...}, "patches": { "weapons.json": {...} } }`; it feeds the same merge.

## 2. THE RULES THE MERGE FOLLOWS (each is a test that ran)

1. **Order.** Base, then each mod in index order; `loadAfter` is respected; a `loadAfter` loop skips every mod in
   the loop and says so. (Proof 5.)
2. **Patch by id.** A table (a list of rows with ids, or a map of rows) is patched by id; only the fields a mod
   names change. A number or a string at the top level is replaced; an object is merged one level. (Proof 3.)
3. **Adding a row.** An id the base lacks adds a row, and that row must carry every field that at least nine
   rows in ten carry, or it is skipped by name. (Proof 4 and 2b.)
4. **Wrong types, unknown fields.** A value of the wrong type skips the WHOLE row change (never half a row); an
   unknown field is ignored and named; an old `schema` number warns and loads. (Proof 2.)
5. **Conflicts.** Two mods changing the same field: the later one wins and a CONFLICT line names both. (Proof 5.)

## 3. THE DEMO STAYS UNTOUCHED, AND HOW TO PROVE IT

His sixth vote was NAH for mods at boot in the demo, and rule 52's target is a stranger's first five minutes. So:

- **No code path.** The demo, the alpha, the fight and the map never fetch `mods/`. Proof 6 reads those four files
  and finds no such fetch (4 checked). The code that loads mods, when it exists, lives in a separate workshop
  page, never in a play surface, and the demo does not import it.
- **The gate, when he says build** (three legs, all already running in the proof): (a) no play surface fetches
  a mods folder; (b) an empty or absent mods folder gives the data byte for byte the same (a hash of all 15
  files, proof 1); (c) a mod that is wrong in every way gives the same hash (proof 2a). A gate that only checked
  (a) would not prove the demo is the same game; (b) and (c) do. **The proof bites:** with the "skip the whole
  row on a wrong type" line deleted, leg 2a goes red (10 of 11), and restoring it returns to green.

## 4. WHAT THIS DESIGN CHANGES FROM MY 9/28 PAGES, AND WHAT IT STILL CANNOT DO

- 9/28 said the folder could be `mods/` at the repo root, with a fallback of `slices/`. That is wrong in one
  way: Pages publishes only slices/, engine/ and records/target. It is `records/target/mods/`, next to the data
  it patches.
- 9/28 had one flat patch format on a page. This one mirrors the data files, so a modder edits what they
  already saw on the schema page, not a second language (the Content Patcher and Minecraft data-pack lesson).
- **It checks type, not range.** A mod that sets `damage_min` to -5 passes. The data files carry no min and max
  per field, so there is nothing to check against. A range column is the same table TUNING's numbers file
  needs; until it exists a mod can be nonsense and valid.
- **No size or count limit is built.** The 9/28 first guess (20,000 bytes a mod, 12 mods) is still TUNING's to set.
- **No removal.** A mod can change and add rows; it cannot delete one. Deleting a weapon is a decision for the
  day a modder asks.

## 5. ROUTED

- **PLUMBER**: the three-leg gate in section 3 is yours to wire when he flips MODS to build. The proof is the
  reference; nothing here is in the suite.
- **TUNING**: the range column and the size and count limits (section 4).
- **RUN**: nothing. The demo is untouched on purpose.
- **MODS next**: [one weapon file] (largely answered by weapons.json and the schema page) is the top OPEN row;
  [grok sources] waits on EYES's stamp.
