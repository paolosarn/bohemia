# BOHEMIA — ACT-1 LIGHTING WIRING (7/13/26)
File: BOHEMIA_ACT1_LIGHT_SOURCES_7_13_26.txt (registry of every act-1 emitter)

## Engine consumption (render contract layer 8, validated lighting model)
- On block load: place emitters from prop instances; lightmap = flood-fill
  per channel, max-not-sum, 16 levels; corner-averaged quad per cell.
- FIRE sources: light level wobbles ±flicker_amp on beat subdivisions,
  synced to their 8-frame flame loop (same clock — 120 BPM LAW).
- ELECTRIC: steady with rare stutter (amp 0.03) — post-collapse grid mood.
- Door state feeds occlusion: closed door blocks, open doesn't (door bank
  collision threshold frame 5) -> re-flood on door events.
- emit_color per source; falloff curve + radii = [PENDING PaolO] one knob
  session, defaults shipped (fire 4 cells, electric 6).
- Street recipe consumes emitter_spacing as the darkness-rhythm knob.


## METER-GROUNDED LAMP RADII (research, 7/14/26)
Rule confirmed across sources: illuminated width ~ pole height; useful
radius ~1-1.5x height. Vegas classes -> game (1 cell ~ 1m):
| class | pole | game radius |
|---|---|---|
| residential lamp | 6-9m | 8 cells |
| arterial/commercial | 8-12m | 12 cells |
| highway mast | 12-15m | 15 cells |
| fire barrel | open flame | 4 cells |
| lantern/flashlight | handheld | 3 cells |
NIGHT AMBIENT: raised 10 pct per Paolo (2.2/2.4/3.2 -> 2.42/2.64/3.52 of 16),
"not too dark, just right".
