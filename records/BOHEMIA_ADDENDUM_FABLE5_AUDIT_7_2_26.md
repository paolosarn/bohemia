# BOHEMIA — ADDENDUM: FABLE 5 FRESH-EYES AUDIT
### By Paolo Alexandre Sarnataro (Babypunk / Punk4Prez)
### Living document — updated every working session. The file IS the memory.
### 7.2.26 — first pass with the new model. Full-project audit: what to clean, what to fix, what the tech demo actually needs. Findings are FACTS verified against the live files this session, not vibes. Nothing here changes canon. Execution happens next chat with full runway.

---

## 0. THE ONE CRITICAL FINDING — BUILD SOURCES ARE BEHIND THE SHIPPED FILES

`_build23.py` is the real build pipeline: it composes the alpha from source files (`_skinner.js`, `scale2x.js`, `bohemia_retarget.js`, the rig HTML, `_baked.json`, wardrobe data). That is the RIGHT architecture. But today's session patched the SHIPPED files directly, not the sources:

- Seam cleanup + bind coherence went into the alpha's inline Skinner and the engine bundle's Skinner, NOT into `_skinner.js`
- Hole fill law, nsGait v2, elbow mirror, FrameCache, Persist went into `BOHEMIA_ALPHA_0_9.html` directly

**If `_build23.py` runs again from the old sources, it regenerates the alpha WITHOUT everything built today.** The source files were not in this session's zip so they could not be updated.

**NEXT CHAT, FIRST ACTION:** Paolo uploads the build source files (`_skinner.js`, `_baked.json`, `_bones.json`, `_ref.json`, `_wordmark.js`, `bohemia_retarget.js`, `scale2x.js`, plus `_build23.py` and the current alpha). Claude backports every 7/2 patch into the sources, runs the build, diffs the output against the shipped alpha, and from then on ALL patches go into sources first. This is the single highest-priority item in this file.

## 1. THE E-RUN BUG HAS A PRIME SUSPECT — THE FAR-ARM LAW WAS NEVER WIRED

Locked canon (character pipeline addendum): **far-arm copy = darkened clone of the near arm placed behind the body for profile views.** The alpha's DEPTH table declares `farArm:true` for E and W, and that flag is DEAD, referenced nowhere. E and W currently render BOTH arms at full brightness with shoulders 2px apart, scissoring through each other during run. Two same-brightness arms overlapping in pure profile with no depth separation is exactly "buggy looking as hell."

**This is plumbing of already-locked canon, not a new call.** Next chat: wire the far-arm render for E/W (far arm = darkened, behind body per the locked law), re-render the E strip, hand it to Paolo. High confidence this kills the E complaint. W gets the same treatment for free.

## 2. CODE CLEANUPS (verified, ranked)

1. **Engine header stale:** bundle comment says "All 10 engine modules"; there are 19 (Core, Save, Inventory, Combat, Economy, Factions, Entities, Heartbeat, Skinner, WorldGen, FactionCanon, Generations, RigData, Wardrobe, Retarget, Scale2x, FrameCache, Persist, CombatBridge). One-line fix, matters for the porting-engineer ten-minute checklist the header exists for.
2. **Rig tool on raw localStorage:** 6 raw calls under its own SAVEKEY. Migrate to the `bohemia:` Persist namespace + versioned envelope so rig saves ride the same migration chain and export/import blob as everything else. Careful: preserve existing saves (read old key, migrate, write new, delete old).
3. **No permanent test file:** 53 tests written today live in scratch files that die with the container. The referenced 167-test suite is also not in the bundle. Ship `bohemia_tests.js` alongside the engine: one file, `node bohemia_tests.js`, every suite. Tests ARE canon enforcement; they should survive sessions like everything else.
4. **FrameCache stores pre-Scale2x pixels:** drawChar re-runs Scale2x every frame even on cache hits. Caching post-HD ImageData directly would skip both Scale2x and the px-to-ImageData conversion per frame. On iPhone this is the difference between warm frames costing ~0 and costing a full 112x112 reprocess. Straight perf plumbing.
5. **Scratch render harness worth keeping:** the node DOM-stub harness built today (runs the full alpha headless, renders any dir/clip/phase to image) is the fastest verification loop the project has ever had. File it as `_alpha_harness.js` in the build kit instead of rebuilding it every session.

## 3. TECH DEMO PATH — WHAT IS ACTUALLY MISSING

Paolo's stated goal: playable tech demo for friends once combat feels 100 percent. Inventory of what exists vs what the demo needs:

**Have:** walkable character with 19 clips all 8 dirs, skin/face/outfit editors with persistence, Dead Eye Dial with 52 patterns + package system (separate file), engine with map passability + spawns + corpse-delta permadeath + scheduler + heartbeat, CombatBridge contract.

**Missing for a minimal demo loop:**
- Dial-side bridge hookup (combat_v9 file needed in a session)
- A playfield: character walking on an actual WorldGen map slice instead of the editor stage (engine has passability; alpha has no map view)
- Enemy on the map that triggers a dial fight through the bridge, dies through corpse-delta
- One session boot-to-play flow on iPhone

That is four items. Nothing else blocks a friends demo. **[PENDING, Paolo's call]:** demo scope. Smallest honest cut = one district slice, N enemies, dial fights, death is death. Says what the game is in sixty seconds.

## 4. DOC HYGIENE (no action without Paolo)

- 20+ addenda now orbit GDD v2/v3/v4. Navigable for Claude, but a GDD v5 consolidation (fold all locked 6/30 through 7/2 laws into the spine doc) is due when Paolo wants a reading copy. Fresh-chat-sized job.
- Handoff memory said "perks system STILL undocumented" for a fork that closed 7/1 (the consolidation addendum exists). Stale flags in handoffs cost attention; wrap blocks should be checked against the project file list before shipping.

## 5. RESEARCH NOTES (grounded, for when relevant)

- **iPhone canvas perf:** current path (putImageData of composed frames) is correct; the win is caching post-scale ImageData (finding 2.4). OffscreenCanvas is Safari 16.4+, viable if the master loop ever wants a worker, not needed for the demo.
- **Persist quota:** localStorage is ~5MB on iOS Safari and can be evicted in low-storage; the export/import blob (built today) is the real safety line. For the shipped game later, IndexedDB backend slots into Persist with zero call-site changes by design.
- **Statistical LOD combat** (headless resolver): odds table flagged [PENDING Paolo's numbers]; research-wise the standard is to fit headless odds to measured player outcomes per package once the dial is instrumented, not to hand-tune blind. The bridge's patMeta field already carries what instrumentation needs.

## EXECUTION ORDER PROPOSED FOR NEXT CHAT

1. Backport 7/2 patches into build sources, rebuild, diff-verify (finding 0)
2. Wire far-arm law for E/W, render proof, Paolo verdict on E (finding 1)
3. Dial-side CombatBridge hookup if combat_v9 is uploaded
4. Cleanups 2.1 through 2.5 as one pass with tests
5. Demo playfield scoping with Paolo (finding 3)
