# MODS [more worked mods] -- FIVE MORE MODS A STRANGER CAN COPY (10/10/26)

Lane 22 MODS, session mods-59jyd6. Row: FIVE-MORE-MODS-A-STRANGER-CAN-COPY. Rule 22 (Paolo 9/30: make mods easy for other
people to make). MODE: research. Nothing in the game changed. The mods are folders under `tools/mods_reference/example_mods/`
(with a README); the game does not load a mods folder, so they are checked against the design
(records/BOHEMIA_MODS_THE_MODS_FOLDER_DESIGN_10_10_26.md) by `node tools/bohemia_mods_merge_reference.js <folder> --ranges --namespace`.
Proof: `node tools/bohemia_mods_merge_proof.js`, now **27 of 27**.

## 0. THE ANSWER IN ONE LINE

**Eight example mods now exist (three older, five new), each a real folder that runs clean through the merge, the
ranges check and the id rule, and each teaches the one mistake a stranger is most likely to make next.**

## 1. THE FIVE NEW MODS, EACH ONE BUILT FROM A REAL ROW

| mod | change | the lesson | checked |
|---|---|---|---|
| enemy-pack | adds `enemy-pack:swamp_thug`, a copy of the brigand poacher with 10 more hit points | copy a WHOLE row (it carries ~30 fields) and name the new id with your mod and a colon | 9b: one more enemy, hp 65 against the poacher's 55 |
| poorer-start | the rebuild origin starts with 200 batteries, not 250 | a number inside a row's own object merges one level: only `full` changes | 9c: `thin` and `bare` are untouched |
| fair-wages | a background's daily wage 25 to 20 | a wage of 99 warns: outside every background (0 to 35) | 9d, and 9g: 99 warns and still loads |
| sharper-mastery | Mace Mastery's fatigue cut 25 to 30 percent | write only the number you change inside `numbers` | 9e: the stun numbers stay |
| new-helm | adds `new-helm:salvage_helm`, a copy of a real head piece | armour has three tables (body, head, shields): the key is `head`, not `rows` | 9f: one more head piece |

All five load with **no fault and no warning** (9a). The three older mods are knife-harder (the smallest), new-sword
(a new row must carry every field) and broken (every fault named, nothing crashes).

## 2. A CHANGE TO THE REFERENCE MERGE THIS NEEDED, AND WHY

**The first draft of the perk mod would have erased the other numbers.** A row's `numbers` is an object
(`fatigue_reduction_pct`, `stun_chance_pct`, `stun_chance_increase_pct`). A patch that wrote
`"numbers": { "fatigue_reduction_pct": 30 }` replaced the whole object, so the stun numbers vanished. The merge now
merges an object inside a row **one level**, the same rule it already had at the top of a file, and checks each key's
type. A wrong type inside the object skips the whole row change. **It bites:** with the one-level merge replaced by a plain
overwrite, legs 9c and 9e go red (25 of 27); restored, 27 of 27. The 20 earlier legs are unchanged.

## 3. WHAT THE EXAMPLES DO NOT SHOW

- **A change to a list inside a row** (a weapon's `skills`, an origin's `men`). The merge replaces a list whole; it does not
  patch inside it. A modder who wants a second skill writes the whole list. (A real hole, not yet fixed; the weapon-file
  page proposes `offers` for skills.)
- **Deleting a row.** A mod cannot; it can only change and add (design page, section 4).
- **Playing the result.** The game does not load a mods folder, so none of these has been seen in the fight. Editing a data
  file in place (the first-hour page, step 3) is how to see a change today.

## 4. ROUTED

- **PLUMBER**: the 27 legs are the reference for the loader's tests when he says build.
- **MODS next**: [base changes] is the top OPEN row (how a modder learns the data changed), then [grok sources].
