# BOHEMIA TILE SPEC — INDEX (the district "note sections" for the tiling phase)

**START HERE when tiling:** read `laws/BOHEMIA_TILING_PHASE_INSTRUCTIONS.md` — the full brief (scale, act-1-dead, 45-degree, layering->render/occupancy, interior===exterior, order of operations). Then tile each district from its sheet below.

One sheet per built district: every tile code -> name, kind, ACT-1 dead-world material, color. GENERATED from each module's LEGEND — run `node tools/bohemia_tilespec.js` after a district changes. The tiling phase reads these so every code maps to known art.

| district | category | tile codes | drivable |
|---|---|---|---|
| [suburb](tilespec/BOHEMIA_TILESPEC_suburb.md) | residential | 8 | yes |
| [commercial](tilespec/BOHEMIA_TILESPEC_commercial.md) | commercial | 14 | yes |
| [industrial](tilespec/BOHEMIA_TILESPEC_industrial.md) | industrial | 12 | yes |
| [medical](tilespec/BOHEMIA_TILESPEC_medical.md) | civic | 12 | yes |
| [solar](tilespec/BOHEMIA_TILESPEC_solar.md) | infrastructure | 8 | yes |
| [park](tilespec/BOHEMIA_TILESPEC_park.md) | leisure | 14 | yes |
| [wash](tilespec/BOHEMIA_TILESPEC_wash.md) | terrain | 12 | yes |
| [cemetery](tilespec/BOHEMIA_TILESPEC_cemetery.md) | civic | 14 | yes |
| [drivein](tilespec/BOHEMIA_TILESPEC_drivein.md) | leisure | 12 | yes |
| [golf](tilespec/BOHEMIA_TILESPEC_golf.md) | leisure | 14 | yes |
| [stadium](tilespec/BOHEMIA_TILESPEC_stadium.md) | leisure | 12 | yes |
| [truckstop](tilespec/BOHEMIA_TILESPEC_truckstop.md) | commercial | 14 | yes |
| [school](tilespec/BOHEMIA_TILESPEC_school.md) | civic | 14 | yes |
| [firestation](tilespec/BOHEMIA_TILESPEC_firestation.md) | civic | 14 | yes |
| [swapmeet](tilespec/BOHEMIA_TILESPEC_swapmeet.md) | commercial | 15 | yes |
| [storage](tilespec/BOHEMIA_TILESPEC_storage.md) | industrial | 13 | yes |
| [watertreat](tilespec/BOHEMIA_TILESPEC_watertreat.md) | infrastructure | 13 | yes |
| [boneyard](tilespec/BOHEMIA_TILESPEC_boneyard.md) | industrial | 15 | yes |
| [policestation](tilespec/BOHEMIA_TILESPEC_policestation.md) | civic | 14 | yes |
| [library](tilespec/BOHEMIA_TILESPEC_library.md) | civic | 14 | yes |

WHEN A DISTRICT IS APPROVED: it exposes a LEGEND (code -> {name, kind, act1}); this generator writes its sheet; `gates/tilespec_gate.js` fails if any tile code ships undocumented. That is the standing "record everything you built" flow.
