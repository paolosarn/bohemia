# BOHEMIA — ENGINE SYNC GATE (7/16/26)

## The problem
ENGINE SYNC LAW said: after any engine edit, sync the inlined engine across all
HTML files. It was enforced by memory. Memory is not a gate. Alpha absorption is
about to inline six modules into a 29MB single file — the exact moment where a
stale copy becomes permanent canon and nobody notices for a month.

## The gate
`bohemia_sync_gate.py` walks a tree, rips every `BOH_*` module out of every
.html and .js, normalizes it (comments and whitespace stripped — a comment edit
is not drift), hashes the body, and fails hard if any module has more than one
distinct body anywhere.

- Balanced-delimiter extraction that skips strings, template literals, comments
  and regexes, so base64 tile blobs and `//` inside URLs can't throw the count.
- `bohemia_sync_ignore.txt` lists SUPERSEDED carriers (shipped slices V5–V10).
  Historical artifacts are not re-inlined. Rewriting a shipped slice is
  rewriting history.
- It reports, it does NOT auto-fix. Auto-fixing engine code with nobody looking
  is how drift becomes canon.
- Exit 1 on drift, so it drops into any build step.

## First run caught a real violation
BOH_SLICE had 4 distinct bodies across 14 carriers. The V11 occupancy edit
(`mover.id` + `passable(nx,ny,who)` so an actor is never blocked by its own
cell) lived only in V11 and the extracted engine. The graphics engine master,
slice core, and the 7/14 engine bundle were all still on the old body — the
version the alpha absorption would have inlined.

Propagated to every live carrier: `bohemia_slice_core.js`,
`engine/bohemia_slice_core.js`, `bohemia_engine_graphics_7_14_26.js`,
`engine/bohemia_engine_graphics_7_14_26.js`, and both inlined copies inside
`BOHEMIA_GRAPHICS_ENGINE_MASTER_7_16_26.js`.

## Status now
- 11 modules, zero drift, gate green.
- Graphics test suite: 83 pass / 0 fail after propagation.
- Absorption preflight's namespace-clean verdict still holds; the bodies it
  would have inlined are now the correct ones.

## Law text (add to the laws master)
ENGINE SYNC LAW is now machine-enforced. Run `python3 bohemia_sync_gate.py .`
before any absorption, any wrap, and after any engine edit. Green or it does
not ship.
