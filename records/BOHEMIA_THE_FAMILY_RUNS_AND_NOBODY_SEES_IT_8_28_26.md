# THE FAMILY RUNS AND NOBODY SEES IT — 8/28/26 (CITY lane)

Paolo, one word: **"VAMILY"** — family. Read as the DYNASTY, because that is what family
means in this game's canon: *"Three generations, ~100 years. Gen 1 Animal, Gen 2 Human,
Gen 3 Angel. THE PLAYER LIVES ALL THREE"*, confirmed by him on 8/28 — *"YEAH THREE
GENERATIONS BRO CMON"* — and a handoff that *"INHERITS EVERYTHING the last life built
(compound, standings, territory, THE FAMILY TREE, and the unhealed wounds)"*.

## WHAT IS ACTUALLY THERE, MEASURED

I formed four hypotheses about what was missing and **every one of them was wrong.**
Each is recorded because the wrong turns are the useful part.

**1. "There is no family system."** Wrong. `engine/bohemia_engine.js` carries a real
dynasty: `runDynasty`, `foldGeneration`, `selectHeir`, `emptyInheritance`,
`amalgamationModel`, `GEN_COUNT`. Heir selection is **deterministic from (seed, gen,
candidate set)** so a mid-generation reload picks the same heir — child first, then a
sibling's child, then `null`, which the code itself calls *"dynasty in crisis — a real
fail/branch state"*. The tree takes `marry`, `child`, `sibling_child` and `death` events.

**2. "There is no family cast."** Wrong. `gates/family_cast_gate.js` (CHARACTER lane,
8/11) holds four demo-critical claims: father, mother, brother and sister all render in
**painted pixels**, they are four visibly different people, every garment is `st==='canon'`,
and shadows are a separate layer.

**3. "The dynasty never runs in the played game."** Wrong, and this one was nearly a loud
false claim. `runDynasty` appears **zero times** in `BOHEMIA_ALPHA_0_9.html`,
`BOHEMIA_CITY_WORLD.html` and `BOHEMIA_DEMO.html` — but those are **shells**. The RUN tab
iframes `BOHEMIA_RUN_CURRENT.html` (21.24 MB) in both the alpha and the demo, and that file
carries `runDynasty` ×4, `selectHeir` ×2, `family` ×128, `heir` ×7, `generation` ×31.

> **A file that does not contain the code is not a surface that does not run it.**
> Measure the frame the game is actually in.

**4. "So it is all fine."** Also wrong, and this is the finding.

## THE FINDING: IT RUNS AND THE PLAYER NEVER SEES IT

Booted the real run and asked the page:

```
runDynasty as a runtime global : undefined
an engine global exposing it   : none
fresh-boot family state        : none
what the player is shown       : "Get up. Walk out your front door. YOUR HOUSE"
```

And the **LIFE tab** — the one surface named for a life — mentions:

| word | times in the LIFE surface |
|---|---|
| `heir` | **0** |
| `tree` | **0** |
| `mother` / `father` / `brother` / `sister` | **0 / 0 / 0 / 0** |
| `family` | 2 |
| `generation` | 1 |

So: a deterministic three-generation dynasty with real inheritance, and four approved,
gated, pixel-verified family members — **and nowhere a player can look at their own
family.** You cannot lose what you were never shown you had, and the whole emotional
weight of the handoff (*a run resets you to nothing; a handoff inherits everything*)
depends on having met the people it is about.

This is the same failure shape this repo keeps finding, now on the biggest structure in
the game: **the seventeen invisible hats, the colours nobody wore, the floor pool nothing
loaded.** The material exists. It never reaches him.

## WHAT I DID NOT DO, AND WHY

I did not build the surface. `LIFE` and the tab chrome are not this lane's file, and
ONE SYSTEM / ONE SESSION is what stops two lanes writing the same panel. This is recorded
so it is not lost, and it is the largest single item I have found that nobody owns.

The pieces are all there: `selectHeir` already answers *who inherits*, the cast already
renders four people, and `faceFor(id)` has given every person in the valley a portrait
since 8/27.
