# MODS [read count] -- ROUND THREE, AND WHY THE ROW TURNED (10/10/26)

POST-MORTEM (rule 95, two lines). The row sat CLAIMED for three rounds because I reported its number in the handoff but never wrote a record or closed the row, so on the board it looked stalled while the number was actually moving. From now on each measurement is a dated record and the row is SHIPPED with its numbers; the next measurement is a new row line, never an open claim.

MEASURED on fresh main at 21eedd45 with tools/bohemia_mods_read_count.js (a modder greps for the number; files to touch = live files plus gates that pin it):

| change | files to touch | was (round two) | target |
|---|---|---|---|
| one weapon's damage, OLD fight (the pistol's lethal odds) | 3 (1 live in a blob, 2 gates) | 4 | 1 |
| one weapon's damage, NEW fight (the knife row) | 1 (records/target/bb/weapons.json) | 1 | 1 |
| one background | 3 | 3 | 1 |
| one sound (the gunshot) | 4 | 4 | 1 |

What moved: the old fight's count fell from 4 to 3 (one fewer file pins the number). The new fight is already at the target. Backgrounds and sounds are unchanged. A modder who edits only weapons.json (the new fight) touches one file; MODDING.md and the example mods show how.
