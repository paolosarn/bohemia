# MODS [first hour] -- A MODDER'S FIRST HOUR (10/10/26)

Lane 22 MODS, session mods-59jyd6. Row: A-MODDERS-FIRST-HOUR. Rule 22 (Paolo 9/30: "the point of the mods chat is
to make it easy for people to make mods"). MODE: research. Nothing in the game changed. **Every step below is a
command or a file that exists today; the one thing that does not exist yet is marked NOT BUILT.** Step 3 was run
end to end on this machine (see the proof at the bottom).

## The hour, in order

**0. What you need.** The repo, Node 18 or newer, and Python 3 (only to serve the files). Nothing to install.

**1. Look at what you can change (5 minutes).** Open `records/BOHEMIA_MODS_THE_DATA_SCHEMA_10_9_26.md`. It lists
the 15 data files in `records/target/bb/`, every field, and who reads each. Read the five rules at the top: rows
have an id and a source; damage is hit points; `_pct` is percent; `ap` is action points; money is crowns, ten to
the battery.

**2. Serve the game (2 minutes).** The fight fetches its data files, so it needs a web server, not a double-click:

    cd <the repo>
    python3 -m http.server 8000

Open `http://localhost:8000/slices/BOHEMIA_FIGHT.html` in a browser. That is the new fight; it reads 11 of the
18 data files.

**3. Make one change (5 minutes).** Open `records/target/bb/weapons.json`, find the row with `"id": "knife"`, and
change `damage_min` from 15 to 20 and `damage_max` from 25 to 30. Reload the fight page. The knife now rolls 20
to 30. (Run on this machine: before 15 and 25, after 20 and 30, no page errors, file restored afterward.)
To undo: `git checkout records/target/bb/weapons.json`.

**4. Check your change against the rules (5 minutes).** Put the same change in a mod folder and ask the reference
merge what it would do:

    mkdir -p mymods/knife-harder
    # mymods/knife-harder/manifest.json : { "id": "knife-harder", "name": "Knife Harder", "version": "1.0.0", "schema": 1 }
    # mymods/knife-harder/weapons.json  : { "rows": { "knife": { "damage_min": 20, "damage_max": 30 } } }
    node tools/bohemia_mods_merge_reference.js mymods

It prints `CHANGED` and a line `OK weapons.rows.knife: changed damage_min, damage_max.` The same folder shape is
in `tools/mods_reference/example_mods/`. **NOT BUILT: the game does not load a mods folder.** This step checks
your patch against the design (records/BOHEMIA_MODS_THE_MODS_FOLDER_DESIGN_10_10_26.md); to see a change in the
game today you edit the data file in place, as in step 3.

**5. The three mistakes the merge names (10 minutes).** Put each in a patch and read the line it prints:

| you wrote | it says |
|---|---|
| `"damage_min": "a lot"` | `wants number, got string. The whole row change is skipped.` |
| `"magic": 1` on a weapon | `no row in the base has this field. Ignored.` |
| a new weapon with only a name | `a NEW row needs ... Row skipped.` (it lists the missing fields) |

A bad patch never changes the data and never crashes; it says which line.

**6. Add something new (15 minutes).** Copy a whole row of the same kind, give it a new `id` and `name`, change
what you want, and add it. Edit the data file in place (step 3) or put it in a patch (step 4). A new row has to
carry every field most rows carry; the merge tells you which are missing. `tools/mods_reference/example_mods/new-sword`
is a worked example (a Moon Blade, a copy of a sword with new numbers).

**7. Refresh the schema page.** After you change a data file's shape (a new field, a new file):

    node tools/bohemia_mods_schema_page.js --write

so the one page a modder reads stays true.

## Three things to know before you trust a change

- **The demo's older fight ignores these files.** The sealed old fight inside the demo has its own numbers, so a
  change you see in step 3 is the new fight's. (records/BOHEMIA_MODS_WHAT_IS_DATA_AND_WHAT_IS_NOT_10_9_26.md.)
- **A weapon plays one skill.** Only the first strike skill and the reload are offered, so editing a second
  skill changes nothing today. (records/BOHEMIA_MODS_THE_WEAPON_FILE_10_10_26.md.)
- **Nothing checks how big a number is.** A knife that hits for minus 5 loads. A range column is a row of its own.

## Proof

Step 3 was run, not described: a local web server on the repo, a real browser at phone size, the knife read from
the fight's own `DB.weapons` before (15, 25) and after (20, 30), no page errors, the file restored (clean `git
diff`). Step 4's output was run on the example mods. Steps 5 and 6 are what the design page already proved
(11 of 11 on `node tools/bohemia_mods_merge_proof.js`). I did NOT run the fight's own 5-minute test with the
changed row.
