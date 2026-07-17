# BOHEMIA — ADDENDUM: FRAME CACHE + APP-OWNED PERSISTENCE + COMBAT BRIDGE
### By Paolo Alexandre Sarnataro (Babypunk / Punk4Prez)
### Living document — updated every working session. The file IS the memory.
### 7.2.26 — big plumbing session. Three engine systems built, tested, wired. All PLUMBING under existing locked laws; zero new creative direction taken. Everything here is BUILT and GREEN unless tagged otherwise.

---

## WHY THIS FILE EXISTS

The handoff's three named next actions were frame caching, combat-native integration, and app-owned persistence. All three shipped this session as engine modules with test suites, and two of the three are already wired live into Alpha 0.9. Each was built with forward hooks so the systems on the horizon (gloves, female/child rigs, city-view walker crowds, perks/abilities difficulty mods, cloud saves) drop in without rework.

---

## 1. FRAME CACHE — [BUILT, wired into Alpha 0.9]

**What it is.** Animation frames are deterministic: the same (direction, clip, phase bucket, look) always composes the same pixels. So each frame is built once and replayed forever.

**Engine module:** `BohemiaEngine.FrameCache` — generic LRU frame cache. `FrameCache({buckets, max})`, `.get(dir, clip, ph, lookHash, buildFn)`, `.stats()`, plus a standalone `lookHash(parts)` FNV-1a helper.

**Alpha wiring:** `buildFrameCached()` wraps `buildFrame()` inside the app; `drawChar` now goes through the cache.

**The laws it obeys:**
- **120 BPM LAW:** clips are beat-locked, so a cycle quantizes cleanly. 24 buckets per cycle; with the PIXEL SNAP LAW a 56px sprite at 24 steps/cycle is visually identical to continuous phase. A full clip tops out at 24 cached frames per direction.
- **Frames build at bucket CENTER** so the cached representative is stable, never an edge case.
- **LOOK HASH:** outfit + tints + swing + body rig + skin tone + hair + face params + skin-detail brush work fold into one hash. Any edit anywhere naturally busts the key and rebuilds. Future look systems (gloves, female/child rigs, mirrored-logo garments) just feed the hash — zero cache rewrites.
- **LRU BUDGET:** 768 frames in-app (512 default engine-side). City view with dozens of walkers stays memory-flat.

**Measured:** 7.3x faster on cycle replay in the harness; steady-state cached frames are near-free. Cached output verified pixel-identical to direct builds.

**Foresight hooks:** payload-agnostic (stores whatever buildFn returns — px arrays today, ImageData or GPU textures later); `stats()` exposes hit rate for tuning; buckets/max are constructor options when city-view LOD wants coarser walkers.

## 2. APP-OWNED PERSISTENCE — [BUILT, wired into Alpha 0.9]

**The problem it kills:** Alpha 0.9 persisted NOTHING. Every skin edit, face ramp, outfit, tint, and skin-detail brushstroke vanished on reload.

**Engine module:** `BohemiaEngine.Persist` — namespaced (`bohemia:` prefix), versioned, migratable slot store.
- **SLOTS:** named saves — `save/saveNow/load/remove/slots`.
- **SCHEMA VERSION + MIGRATION CHAIN:** every slot carries `v`. `register(fromV, fn)` chains upgrades so a save from any old build loads in any new build. Same fold-forward philosophy as the generational fold: old state is never invalid, only older.
- **DIRTY + THROTTLE:** `save()` marks dirty, `flush(now)` writes only changes, at most once per interval — heartbeat-friendly.
- **BACKENDS pluggable:** localStorage in-app, MemoryBackend for node tests, anything with getItem/setItem later (cloud sync = new backend, zero call-site changes).
- **QUOTA-SAFE:** every failure surfaces as `{ok:false, reason}` — never throws mid-game.
- **EXPORT/IMPORT:** one JSON blob of every slot, with overwrite flag, for the download-and-carry workflow between devices and chats.

**Alpha wiring:** `PERSIST` object in-app. Autosaves the full look (equipped, tints, swing, dir, pface, hairColor, skin tone by name, SKIN_DETAIL) every 1.5s max, only on change, riding the existing draw loop. `PERSIST.restore()` at boot brings the last look back before the first frame. Corrupt saves boot clean defaults, no crash — tested.

**NOTE ON SEC 17 (skin detail exports baking into build defaults):** persistence now carries brush work across reloads on the SAME device. Baking exports into the next build's shipped defaults is still the separate `_build23.py` bake step — unchanged, still the DO-NOT-LOSE item when Paolo sends exports.

## 3. COMBAT BRIDGE — [BUILT engine-side; dial-side hookup pending the combat file]

**What it is.** The contract that makes combat native: the engine owns the encounter, the Dead Eye Dial owns the shot. One boundary, both sides testable alone.

**Engine module:** `BohemiaEngine.CombatBridge`.
- **SHOT CONTRACT (data only):** `beginShot({shooter, target, weapon, packageId, difficultyMods, greedAllowed})` → token with shotId. The dial never touches sim state; the sim never touches canvas state.
- **RESOLUTION CONTRACT:** `resolve(shotId, {outcome: killshot|hit|miss, zone, greedMult, patMeta})` → fires the sim callback. Feeds Combat.resolveShot, corpse-delta permadeath, and the two Amalgamation ledgers without the dial knowing those systems exist. Unknown outcomes coerce to miss; double-resolution rejected.
- **PACKAGE HOOK:** difficulty package (EASY 0 → BOHEMIAN 4, clamped) is decided sim-side per the locked package laws; perks/abilities bend difficulty through `difficultyMods` without touching pattern code.
- **ASYNC-SAFE:** shots correlate by shotId so the "I move you move" scheduler can freeze grid time during the dial and resume on resolution. `pending()` + `voidPending()` — dangling shots (app closed mid-dial) auto-void on next boot.
- **HEADLESS RESOLVER:** `resolveHeadless(shotId)` — statistical resolution for LOD crowds, tests, and autoresolve. Same contract, no dial. Deterministic under the injected seeded RNG (Core's sfc32 in-game). Killshot/hit odds ordered by package tier.

**[PENDING — next session]:** wire the dial side. `bohemia_combat_v9.html` was not in this session's zip; when it's back in hand, its FIRE resolution path calls `bridge.resolve(...)` with the real zone/greed/pattern data, and the shared motion engine receives the resolved pattern pool + speed factor from the package hook.

**[PENDING, Paolo's call]:** headless odds table (killshot 45/30/20/12/7 percent by package, hit 92/85/75/62/50) is a placeholder for statistical LOD only — the real dial is always the authority when on-screen. Numbers need Paolo's eye when LOD battles become visible in city view.

---

## TEST LEDGER (this session)

- 29/29 new-module tests (FrameCache 7, Persist 13, CombatBridge 9)
- 4/4 cache-wiring tests in the alpha (pixel-identity, hit, bust, speed)
- 7/7 persistence-wiring tests (two simulated app sessions + corrupt-save boot)
- 13/13 run-clip verify suite still green post-wiring (hole fill, nsGait v2, elbow mirror, mirror symmetry)
- Engine bundle loads clean in node with all modules exported

## EARLIER THIS SAME SESSION (filed here so the day is one record)

- **BIND COHERENCE + SEAM CLEANUP** ported into rig + both Skinner copies (alpha + engine): flyaway pixels killed, joint pinholes closed while posed, per-pixel source guard so thin intentional art can never be eaten. Rest pose renders regions byte-exact.
- **INTERIOR HOLE FILL LAW [LOCKED]:** any empty cell fully enclosed inside the composed body silhouette gets color-matched from neighbors and filled. Flood-from-border first: armpits, crotch gaps, every intentional concavity untouched. Run + walk now zero enclosed holes all 8 dirs. This was the real cause of the NE "jacket bleeding into right arm" (instrumented: all garment claims on that arm were correctly sleeve-bound; the bleed was under-layers showing through holes).
- **N/S CRUNCH LAW v2 [LOCKED]:** S and N arms swing inward toward the midline, alternating contralateral with the legs, hands pivoted inward, per-side signs correct on both facings.
- **ELBOW MIRROR [LOCKED]:** run forearms bend travel-forward — W/SW/NW bend WEST at the elbow, exact mirror family of E/SE/NE. Walk already had it; run was missing the mirror factor.
- **Perks fork CLOSED:** BOHEMIA_ADDENDUM_PERKS_ABILITIES_7_1_26.md already exists in the project and is the consolidation doc. The "perks still undocumented" flag was stale.
- **E run [PENDING, Paolo's eyes]:** zero holes, zero detached chunks, one solid silhouette — whatever reads buggy on E is motion feel, needs Paolo pointing at it on the new build before touching motion.
