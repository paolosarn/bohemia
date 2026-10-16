# FAMILY IS THE CORE THEME AND THERE WAS NO FAMILY IN THE GAME
### 9/4/26, RUN lane. He said one word: FAMILY.

## THE LAW HE WAS POINTING AT

`laws/BOHEMIA_ADDENDUM_FAMILY_CORE_THEME_7_19_26.md`, LOCKED:

> "STRONG FAMILY CAN CONQUER ALL. NOBODY IS ANYTHING WITHOUT FAMILY ... This is
> the life lesson under the whole game."

And 8/28, when a summary tried to delete the dynasty: **"YEAH THREE GENERATIONS
BRO CMON."**

---

## WHAT I MEASURED BEFORE WRITING A LINE

```
slices/BOHEMIA_ALPHA_0_9.html     runDynasty 0   selectHeir 0   family.tree 0
slices/BOHEMIA_CITY_WORLD.html    runDynasty 0   selectHeir 0   family.tree 0
```

**Those two files ARE the game. Zero, every term, both files.**

A complete dynasty engine has existed since 7/2 — `runDynasty`, `foldGeneration`,
`selectHeir` with a real family tree, deterministic heir selection, district
texture, the monument. It lives in `engine/bohemia_engine.js` and in
`BOHEMIA_CURRENT_SLICE.html` and `BOHEMIA_RUN_CURRENT.html` — **two old slices
nobody opens.**

**And the walked world's only mention of his sibling was a comment quoting him
asking for it:** *"I want that main quest origin in it when ur sibling dies."*
Every other `sibling` in that file is a SIBLING ROAD CELL.

---

## IT IS A WIRE, NOT AN INVENTION

Third time this exact shape has turned up, and the third time nothing was
missing except the connection:

| | |
|---|---|
| the encounter director | 258 approved lines, **zero callers**, wired 8/27 |
| the build stamp | a fact the shell held, **the city could not read**, 8/27 |
| **the family** | named, drafted, rendering, **never told to the run**, 9/4 |

Everything needed already existed:

- **`FAMILY_CAST`** — RAY, DENISE, MARCO, NINA. Named, `draft:true`, dialled,
  dressed in approved garments, rendering. `family_cast_gate`: **26 passed, 0
  failed.**
- **`survivesIf`** — his 7/19 ruling, already implemented: *"the surviving
  sibling is the SAME GENDER as the player."*
- **the boot handshake** — the city already asks `bohemiaWhoAmI`; the shell
  already answers with the demo flag and the build stamp.

**THE SHELL KNEW WHO HE LOST AND THE WALKED WORLD HAD NEVER BEEN TOLD.** No new
channel was added. The reply that already answers "which surface am I on" and
"which build am I" now also answers "who is my family".

---

## WHAT IS MINE AND WHAT IS EMPHATICALLY HIS

**MINE:** that the run holds a family at all, that it survives a reload, and
that he can reach it. Mechanism.

**HIS, AND UNTOUCHED:**

- **Who they are.** Every name comes from `FAMILY_CAST`, which is his and
  drafted. **Not one name is typed in the new code.** Two places holding one name
  is how the mother came back as DENISE from a table the scene module had never
  heard of — the alpha's own `fillNames` note is that post-mortem, and it is why
  this reads the table instead of copying it.
- **Which sibling dies.** Read off `survivesIf` against the player's gender.
  Decided nowhere else.
- **`KNOWN_AT_START` stays empty** and `people_gate` still fails if it gains a
  row. Nothing was added to it.

---

## WHERE HE MEETS IT

The **STANDING** card, above the factions, because in this game family comes
before factions and the card is already called WHERE YOU STAND. He never digs, so
it goes on a card he already opens rather than behind a new button.

**And it names who he lost, not only who is left.** The law: *"Grief is the proof
it was real."* A family card listing only survivors is the counterfeit family the
whole story is against — the Amalgamation's own pitch is "a family that never
ends", and a survivors-only list is that pitch, shipped by accident.

```
YOUR PEOPLE     RAY · DENISE · MARCO
WHO YOU LOST    NINA
```

---

## THE GATE

**THE FAMILY IS IN THE GAME: 14 passed, 0 failed**

Reachability is proved **by pressing the real STANDING button**, never by reading
a variable — the whole defect being fixed is a thing that existed and could not
be reached, so reading a variable would be that same mistake wearing a gate's
clothes.

```
MUTATION, the shell stops sending the family     14/0 -> 5/9
MUTATION, nobody is lost (grief deleted)         14/0 -> 10/4
family_cast_gate 26/0 · the_whole_demo_gate 23/0, both unchanged
```

---

## WHAT THIS IS NOT

It is not the dynasty. Three generations, the folds, succession, the heir and the
monument are still not in the game — that is a real build and it wants its own
run. What shipped is the thing all of it stands on: **the game knows he has a
family, knows who he lost, and does not forget either.**
