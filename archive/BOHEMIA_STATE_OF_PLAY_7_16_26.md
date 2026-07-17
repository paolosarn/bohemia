# BOHEMIA — STATE OF PLAY (7/16/26)

Nothing was lost when the chat exploded. The transcripts are all on disk, the
working dir is intact (376 files), and every gate is green. The chat log you
uploaded came through empty — that is the known plain-text attachment failure,
and it does not matter, because the record was never in the chat. It is in the
files.

---

## WHAT TODAY WAS

Nine machine gates. **Six of the laws they enforce were already broken.**

| gate | law | what it found |
|---|---|---|
| **ENGINE SYNC** | after any engine edit, sync all carriers | `BOH_SLICE` had **4 distinct bodies across 14 carriers** |
| **GRAVEYARD** | dead things stay dead | **29 live references** to killed assets, incl. the laws master |
| **SIDEWALK** | nothing on sidewalks but furniture | law lived in a comment above the corpse it killed |
| **LINE COLOR** | yellow=direction, white=lane | broken 2 ways while the header claimed compliance |
| **TAN WALL** | 85% tan / 15% original | filed 7/14, never wired at all |
| **ITEM SCALE** | 848 flags | only the cars ever resolved. 251 flags did nothing |
| **LIGHT REGISTRY** | dark is the default | 16 rows contradicted laws they quoted |
| **PURITY** | purple is the Amalgamation's alone | **101 purple tiles in the world's ground** |
| **LEAF PIXEL** | structure frozen | **held. 95/95.** First time anything checked |

Run them all: `python3 bohemia_gates.py` (23s) or `--fast` (20s, skips pixels).

---

## THE THING THAT KEPT HAPPENING

Your upload drops reverted my work **three times** in one session.

1. engine carriers → protected carriers
2. five corrected docs → protected them by hand
3. `bohemia_purity_gate.py` went back to v1 and crashed → **that one broke the
   pattern open**

Every hand-maintained list of what matters is a list that will be incomplete at
the exact moment it counts. So the intake stopped using a list. Protection is
now **derived from the outputs directory**: a file only lands there because I
authored or corrected it, and present_files runs every ship turn, so the manifest
maintains itself. Nothing I have ever shipped can be silently overwritten again.

---

## ON YOUR DESK (nothing moves until you rule)

1. **101 purple tiles in the ground/path/roof/water/bridge/wall banks.** Verified
   real: `(185,49,136)` magenta in "Floor tiles (2)", `(157,61,207)` violet.
   The 7/10 law purged the demo pools; the library was never purged.
   **Kill, or quarantine into REDMAG?**
2. **`i_survival_flashlight_36`** is typed fire, campfire orange, 0.22 flame
   flicker. A battery torch is not combustion. **Cool-white cone, or stays orange?**
3. **`p_light_siren_blue_01` emits orange** — one placeholder colour smeared
   across red siren / blue siren / floodlight / strobe.
4. **11 proposed sidewalk furniture names**, off by default, waiting on you.
   (I filled that list once without asking. Corrected.)
5. **fire_23 / fire_32 / fire_40** bake flicker glow into the barrel's own
   pixels. Lit twice: once in art, once by the engine. **Repaint flat, or is a
   barrel lit by its own fire what you want?**
6. **Reveal system layer vocab** — coat/armor/skin/under enough? Gates the other
   two reveal questions.
7. **stall 3x3 / tree 2x2 / container 6x2** — my research numbers, not your call.
8. **ASPHALT_BASE rgb** — `[62,60,58]` is a placeholder standing in for act-1.

---

## READY BUT NOT FIRED
- **Alpha absorption.** Preflight is GO: anchors OK, namespaces clean, +0.11%
  size. Blocked only by ONE-ALPHA law — it is a with-you session in the main
  project. The bodies it would inline are now the correct ones, which was **not**
  true this morning: the sync gate caught the old `BOH_SLICE` an hour before it
  would have been welded into 29MB.
- **Retarget export fix** in `bohemia_engine.js` (80/80) — same absorption session.

---

## LIVE FILES
**Engine:** `BOHEMIA_GRAPHICS_ENGINE_MASTER_7_16_26.js` (14 modules, 14/14 md5
exact, splits clean) · `bohemia_engine.js` (80/80) · `bohemia_slice_engine.js`
**Slice:** `BOHEMIA_LIVE_SLICE_V11_7_16_26.html`
**Gates:** `bohemia_gates.py` runs all 11
**Registries:** `bohemia_sync_canon.txt` · `bohemia_sync_ignore.txt` ·
`bohemia_graveyard.txt` · `bohemia_purity_allow.txt`
**Records:** `BOHEMIA_PURITY_VIOLATIONS_7_16_26.csv` (793) ·
`BOHEMIA_LEAF_RECORD_7_16_26.csv` (95) · `BOHEMIA_ACT1_LIGHT_SOURCES_v5_7_16_26.txt`

---

## THE LESSON UNDER TODAY
A law in a document is a law the engine does not know about. Six for nine were
already violated, and not one of them was violated on purpose — they broke
because a person edited something six days later and the law was somewhere else.
Every law you lock from here gets a gate the same turn, or it is not locked, it
is just written down.
