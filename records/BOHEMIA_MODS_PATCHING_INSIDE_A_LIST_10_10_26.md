# MODS [lists in rows] -- PATCHING INSIDE A LIST (10/10/26)

Lane 22 MODS, session mods-59jyd6. Row: PATCHING-INSIDE-A-LIST. His rule for this chat, in his own words (voted 10/9): "the only point is to help people
mod the game if they want." So this page makes something POSSIBLE, and adds no rule. MODE: research. Nothing in the game changed.
Instrument: `node tools/bohemia_mods_lists_audit.js`. Proof: `node tools/bohemia_mods_merge_proof.js` (27 of 27 now).

## 0. THE ANSWER IN ONE LINE

**Until now a mod could not change one thing inside a list, only replace the whole list, so giving the knife a cheaper Stab meant
rewriting every skill of the knife. Now a patch can name the one element it changes.**

## 1. WHAT LISTS THE DATA HOLDS (measured, 22 files)

32 list fields. **Only 3 hold objects** (weapons' skills, shields' skills, origins' men); **29 hold plain words** (an enemy's perks,
gear, immunities, a background's excluded traits). The weapon skills are all named (258 of 258); an origin's men have no name.

## 2. THE THREE WAYS TO PATCH A LIST (all optional; the old whole-array way still works)

| list holds | write | what happens |
|---|---|---|
| objects with a name | `"skills": { "Stab": { "ap": 3 } }` | the skill named Stab changes; the other skills stay; a name the list lacks is added |
| objects with no name | `"men": { "0": { "level": 3 } }` | the man in position 0 changes |
| plain words | `"perks": { "add": ["Nimble"], "remove": ["Rotation"] }` | words added and removed, nothing else moves |
| anything | an array | replaces the whole list, as before |

Two example mods run it: `quicker-stab` (the knife's Stab 4 to 3 action points) and `armed-brigand` (a perk added, a perk removed).

## 3. WHAT RAN

Five new proof legs (10a to 10e), all pass: one skill changes and the count and the other skill stay; a words list takes add and
remove; a whole array still replaces; a wrong type inside an element skips the whole row change and says so; an unkeyed list
is patched by position. **Every leg bites:** with the list branch disabled, four of the five go red (23 of 27), restored 27 of 27.

## 4. LIMITS, STATED

- Not seen in the fight: the game does not load a mods folder, so these are proved on the data, like every example here.
- A list of lists, or objects inside the elements of a list, is not patched deeper than one level.
- A skill a weapon lists but the fight never plays (27 of them) can now be edited and still does nothing; that is the weapon-file
  page's finding, not this one's.

## 5. WHAT I TOOK OUT THIS ROUND

His verdict on "how big is too big" was down, and the reason applies to this whole chat: a check that tells a mod what it may be is a law.
The range tool and its warning are removed and moved to graveyard/ with a post-mortem (graveyard/POSTMORTEM_MODS_HOW_BIG_IS_TOO_BIG_10_10_26.txt).
The id policy and the schema-number policy (earlier pages) are recommendations with no enforcement and now sit under the same question;
they wait for his word and follow the ranges into the graveyard if he says so.
