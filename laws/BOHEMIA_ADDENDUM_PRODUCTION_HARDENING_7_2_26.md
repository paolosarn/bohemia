# BOHEMIA — ADDENDUM: PRODUCTION HARDENING PLAN (less buggy, built to last, mass-produce faster)
### By Paolo Alexandre Sarnataro (Babypunk / Punk4Prez)
### Living document — updated every working session. The file IS the memory.
### 7.2.26 — the answer to "can the code be better, less buggy, stand the test of time, mass-produce quicker" given today's research. Four moves, ordered by payoff. All plumbing of locked systems, zero new creative direction. Execution next chat with build sources in hand.

---

## MOVE 1 — SOURCES-FIRST BUILD DISCIPLINE (the anti-bug move)
Already flagged as the audit's critical finding, restated here because it IS the "less buggy" answer: bugs breed where the same code lives in two places. Right now the Skinner exists in `_skinner.js` (build source), the alpha (shipped), and the engine bundle, and today's fixes only reached two of three. One-way flow forever: patch SOURCES, run `_build23.py`, ship the OUTPUT, diff-verify. Every future fix lands once and propagates everywhere. This single discipline change removes the whole class of "fixed it here, still broken there" bugs.

## MOVE 2 — PRE-BAKE THE HOT CLIPS (the Factorio lesson, the mass-production speed move)
The node harness runs the REAL alpha headless and renders any frame. So at BUILD time: bake idle + walk + run x 8 directions x 24 buckets through the real Skinner into a baked frame atlas shipped inside the alpha. Runtime blits baked frames for common motion and only runs live deformation for rare clips and fresh looks. Effects:
- Per-frame CPU for 90 percent of on-screen motion drops to a blit, city-view crowds get cheap
- First-lap cache misses disappear, FrameCache becomes the fallback path not the hot path
- The baked atlas is kilobytes at 56x56, not Factorio's gigabytes, because we bake only the hot set
FrameCache was built payload-agnostic for exactly this. [PENDING, Paolo's call: none needed, pure plumbing]

## MOVE 3 — GOLDEN-FRAME REGRESSION TESTS (the stand-the-test-of-time move)
Hash every baked frame from Move 2 and check the hashes into `bohemia_tests.js`. From then on, ANY code change that alters a single pixel of any clip in any direction FAILS the test suite unless the change is intentional and the goldens are re-blessed. Every law stops being prose and becomes enforced pixels: width law, hole fill, elbow mirror, hand law, N/S crunch v2, all of it. A regression six months from now gets caught by `node bohemia_tests.js` in seconds instead of by Paolo's eyes on his phone. This is how the code survives its own future.

## MOVE 4 — THE NPC FACTORY (the mass-produce-quicker move)
The research's Diablo II warning showed why outfits explode sprite counts, and why Bohemia structurally dodges it: garments are rest-space paintings deformed by the same bones, a new look costs one painting, not 8 directions x 19 clips. Formalize that dodge into a generator:
`npcFrom(seed)` -> deterministic (Core RNG) pick of skin tone + face params + hair + outfit combo from Paolo's EXISTING painted libraries -> a full animated 8-direction character with zero new art.
Every garment Paolo paints multiplies the crowd combinatorially. Ten shirts x ten pants x ten hair x nine skin tones x face ramps is already tens of thousands of distinct citizens for the city view, all riding the one rig, all cached by look hash. The creative direction stays 100 percent his (the libraries ARE his paintings); the factory is pure plumbing that multiplies his hours. This is the demo's population button.

## EXECUTION ORDER (folds into the existing next-chat plan)
1. Backport 7/2 patches to sources, rebuild, diff (Move 1, already queued first)
2. Far-arm law E/W + Paolo's E verdict (queued)
3. Bake hot clips via harness at build (Move 2)
4. Golden hashes into bohemia_tests.js (Move 3)
5. npcFrom(seed) generator module + tests (Move 4)
6. Dial-side CombatBridge hookup when combat_v9 is up

## WHAT THIS BUYS, PLAINLY
Less buggy: one source of truth (1), pixel-level regression alarms (3). Stands the test of time: goldens make every locked law self-enforcing forever (3), migration-chained saves already in. Mass-produce quicker: hot-path baking (2) plus the NPC factory (4) turn every painting Paolo finishes into population and every clip into free replay. All four are plumbing on systems already locked; nothing waits on a creative call.
