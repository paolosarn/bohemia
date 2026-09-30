# MODS [read count] ROUND ONE AND [keep list into defaults] KEEP 1 OF 11 (9/30/26)

Lane 22 MODS, session mods-59jyd6. Rows: HOW-MANY-FILES-TO-CHANGE-ONE-WEAPON, THE-KEEPS-BECOME-VOTE-ITEMS.
Rules: 40e (Paolo 9/29, "instead of needing to use mods in Battle Brothers"), 47a (MODS owns the file),
the coordinator's row text ("the number is the readability score the data line has to beat; report it every
round"). MODE: RESEARCH. Nothing in the game changed; no gate added.

## 1. THE READ COUNT, ON CLEAN MAIN (ca7655c)

Instrument: `node tools/bohemia_mods_read_count.js` (about a minute; `--write` refreshes
records/BOHEMIA_MODS_READ_COUNT_LATEST.json). FOUND is what a plain text search finds; HIDDEN is a live copy
inside a base64 blob that a search cannot see. TOUCH is the live copies plus the gates that pin the literal.

| change | found by a search (live / gates / tools / docs) | HIDDEN in a blob | FILES TO TOUCH | target |
|---|---|---|---|---|
| one weapon's damage (pistol lethal odds) | 0 / 2 / 3 / 5 | 2 (alpha and demo, COMBAT_B64) | **4** | 1 |
| one background (the kitchen hand) | 3 / 0 / 0 / 1 | 0 | **3** | 1 |
| one sound (the gunshot) | 3 / 1 / 0 / 0 | 0 | **4** | 1 |

**The finding: a search for the weapon's damage number finds NO live file at all.** Every live copy is inside
the fight's blob, so a modder who greps the repo finds two gates that pin the number, three tools that
regenerate the blob, and five documents, and never the code that runs. Those three tools are a second trap:
a hand edit to the blob is overwritten the next time one of them is re-run. The background and the sound are
plain files a search finds, but each lives in one engine file PLUS derived copies (the background in two
slices, the sound in the alpha and the demo), so "change it in the engine" is not enough either; the derived
slices have to be rebuilt, or the change ships in one surface and not the other.

The number the data line has to beat is **4, 3, 4**. Its target is **1, 1, 1**: one data file, edited once,
read by the alpha and the demo at boot. The gates count too: a gate that pins the number as a literal
(2 of the 4 on the weapon row) is one more file to edit, which is why the pins have to become reads of the file.

Method notes, so nobody trusts the number blindly: a probe is one literal that defines the thing, so a thing
defined by two literals would count once; pages a lane registered in VOTE are counted as documents, not live
code (otherwise my own census page read as a live copy on the first run); the background probe first used
`id: 'kitchen'` and found no alpha copy only because the spacing differs, so it now uses the trade's own
words. The instrument was run twice before this table was written and the second run corrected the first.

## 2. KEEP 1 OF 11: A SIGHTED PARTY STOPS THE MARCH

From records/BOHEMIA_MODS_SCHOOL_WHAT_BATTLE_BROTHERS_MODS_FIX_9_29_26.md rows 2, 3 and 4 (three Battle
Brothers mods, one want: "Pause Without Conflicts", "Mount n Blade Pause", "Autopause when view Enemy").
The default, in one sentence: **on the map, the march stops by itself the moment an enemy party comes into
view, before they see you, and you choose WAIT or GO ON.** The owning lane is RUN (the map's travel and events,
rule 33); the row is written on RUN as [sighting stops], next to [road events], which it must not duplicate:
[road events] is a face with choices that STOPS the party; this is the trigger that stops it before a face
ever shows.

What WE do differently (rule 39b): Battle Brothers' pause stops the clock. Ours stops the march and keeps the
beat, because the 120 BPM law is not a clock you pause. WAIT costs time and never a fight you did not choose;
GO ON is allowed and is the player's own choice with open eyes.

The thing he can see, VOTE tab, item THE MARCH STOPS: a road, a green marker stepping one cell a beat, a red
party ahead; a dashed box shows the sight range. STOPS ON SIGHT halts the march when the red one enters the
box; KEEPS WALKING is the base game without the mod and walks into them. Verified with real clicks at phone
width: stops after 8 beats, WAIT clears the road, KEEPS WALKING ends in "You never saw them coming."

## 3. THE REST OF THE LIST (10 KEEPS LEFT, ONE PER ROUND)

Next: Plan Your Perks (a build preview at the training ground), Effective Hitpoints (one honest number beside
armour), Settlement Tooltips (as a person or a thing, never a popup), Backgrounds and Attribute Ranges,
Named Item Stat Viewer, Numbers, Autopilot (already COMBAT's gambits, needs only a row check), End's
Inventory Management (sell-all and repair-all on the settlement screen). The six MAYBEs carry the one-line
reasons already on the 9/29 page.

## 4. ROUTED

- **RUN**: [sighting stops] is a new row on you (written this round).
- **PLUMBER**: the read count belongs on your numbers; it is not a gate. A gate on it is a build (rule 38g).
- **Coordinator**: nothing new. The row [one weapon file] stays open for the next round.
