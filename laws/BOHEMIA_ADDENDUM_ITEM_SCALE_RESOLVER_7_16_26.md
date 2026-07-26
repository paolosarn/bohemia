# BOHEMIA — ITEM SCALE LAW: THE RESOLVER (7/16/26)

## The gap
The ITEM SCALE LAW (7/13) came out of Paolo's 848 scale flags in the Great
Sweep. The law was filed. The code was not honoring it.

`BOH_SCALE` v1 needed the CALLER to already know the family, and the only
family it knew what to do with was `vehicle`. Nothing mapped a pack to a
family. So of Paolo's 306 SMALL flags, the ones that resolved to an actual
footprint change were the cars and nothing else. Roofs, broken walls, ruined
building parts, scrap panels, fences, chain link, market stalls, dead trees and
shipping containers all still rendered as 1-cell props: the exact thing he
flagged.

## The fix — v2 is the missing middle: pack -> family -> policy

Nothing here invents a verdict. The flags are his. The policies are his law
text. The classifier only reads his own pack names.

| family | policy | source |
|---|---|---|
| vehicle | footprint 3x2 | **PAOLO LOCKED** — "2x3 i told you" |
| wall | SURFACE layer `wall` | law text: walls render as surface cells |
| roof | SURFACE layer `roof` | law text: roofs render as surface cells |
| fence | RUN piece | law text: fences as run pieces (+ FENCE != WALL) |
| stall | footprint 3x3 | RESEARCHED ~3x3m [PENDING Paolo] |
| tree | footprint 2x2 | RESEARCHED mature canopy ~2m [PENDING Paolo] |
| container | footprint 6x2 | RESEARCHED ISO 6.06 x 2.44m [PENDING Paolo] |
| item | drawScale 0.55 | **PAOLO LOCKED** — ITEM_SCALE |

**LAW ORDER** (his rule 3): a per-tile flag overrides any family default.
Otherwise family policy rules whether or not that specific tile got flagged,
because "structure families never render as 1-cell props" is a property of the
family, not of whether his eye happened to land on that tile.

`SURFACE` and `RUN` are not sizes. They tell the renderer the thing is not a
prop at all: it belongs to a surface layer or a fence run.

## Coverage — all 848, zero unmapped

```
  538  item      -> ITEM        (sub-cell 0.55)
   58  wall      -> SURFACE
   58  tree      -> FOOTPRINT
   55  vehicle   -> FOOTPRINT   (2x3, locked)
   37  fence     -> RUN
   32  roof      -> SURFACE
   27  stall     -> FOOTPRINT
   18  container -> FOOTPRINT
   12  tree      -> ITEM        (his per-tile BIG flag overriding the family)
   11  stall     -> ITEM        (same)
    2  fence     -> ITEM        (same)
```

`familyOf()` returns null on anything it does not recognize and the report
counts it as UNMAPPED. It never guesses. Right now nothing is unmapped.

Fire barrels land at 0.55 and that is correct rather than convenient: a
55-gallon drum is ~0.6m across and a cell is ~1m.

**Gate: `scale_gate.js`, 12/12.** Graphics suite still 83/0. Sync gate green.

## The sync gate earned its keep again
This turn's upload drop replaced `bohemia_slice_core.js` and
`bohemia_engine_graphics_7_14_26.js` with their pre-occupancy bodies. The gate
caught it immediately.

It also exposed a flaw in the gate itself: canon was picked by mtime, so the
freshly-dropped OLD file was labelled canon. Fixed. Canon is now **declared**
in `bohemia_sync_canon.txt`, never inferred. mtime is not authority — re-dropping
an old copy of a file makes it the newest file on disk and the most wrong file
on disk at the same time.

## Still Paolo's
- The three RESEARCHED footprints above (stall 3x3, tree 2x2, container 6x2).
- ITEM SCALE LAW itself is still filed as DRAFT pending his confirm. The code
  now honors it; the knob is one constant.
