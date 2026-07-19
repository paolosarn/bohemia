# BOHEMIA TILE SPEC — INDEX (the district "note sections" for the tiling phase)

One sheet per built district: every tile code -> name, kind, ACT-1 dead-world material, color. GENERATED from each module's LEGEND — run `node tools/bohemia_tilespec.js` after a district changes. The tiling phase reads these so every code maps to known art.

| district | category | tile codes | drivable |
|---|---|---|---|
| [suburb](tilespec/BOHEMIA_TILESPEC_suburb.md) | residential | 8 | yes |
| [commercial](tilespec/BOHEMIA_TILESPEC_commercial.md) | commercial | 12 | yes |
| [industrial](tilespec/BOHEMIA_TILESPEC_industrial.md) | industrial | 12 | yes |
| [medical](tilespec/BOHEMIA_TILESPEC_medical.md) | civic | 12 | yes |
| [solar](tilespec/BOHEMIA_TILESPEC_solar.md) | infrastructure | 8 | yes |
| [park](tilespec/BOHEMIA_TILESPEC_park.md) | leisure | 14 | yes |

WHEN A DISTRICT IS APPROVED: it exposes a LEGEND (code -> {name, kind, act1}); this generator writes its sheet; `gates/tilespec_gate.js` fails if any tile code ships undocumented. That is the standing "record everything you built" flow.
