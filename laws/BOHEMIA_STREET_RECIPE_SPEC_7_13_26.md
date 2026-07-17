# BOHEMIA — STREET BLOCK RECIPE v1 (spec, 7/13/26)
The priority block recipe (most blocks are streets — Block Canon). Plumbing
spec only; every knob is data, every aesthetic default is Paolo's to set.

## Recipe layers (consumes render contract + act placement + confirmed set)
1. BED: street/asphalt grounds from act-pool (act1 confirmed cracked street/
   concrete), gutters via transitions to sidewalk concrete.
2. ROADWAY FEATURES: manhole covers (Paolo-identified), grenade scorch,
   crack overlays, gore layer where history says so.
3. FLANKS: building facades (wall runs + windows WALL-MOUNTED + doors per
   footprint law) OR fence runs OR open lots (yard materials).
4. STREET FURNITURE: signs (warning/freeway classes), street lamps
   (emitters), fire barrels (emit+loop), wrecked cars (2x3, cover), crates,
   barricade cover lines.
5. LIFE LAYER: camps/tents, item piles (useless pickups law), remains
   (usable subset), trash (all-usable pack).
6. ENTRANCES: sewer manholes/hatch cells, underpass mouths, block exits.

## Density knobs (data, defaults pending Paolo)
props_per_cell_pct, cover_line_freq, camp_freq, wreck_freq, emitter_spacing
(darkness rhythm!), loot_density (ties survival accounting).

## Special street types (same recipe, different knob presets + pools)
FREEWAY (wide bed, freeway signs, wreck density high), UNDERPASS (dark,
emitters sparse, camp density high — canon homeless system), WASH (channel
bed, water transitions, tunnel mouths).

## Gate
Generator output galleries -> Paolo verdicts -> knob tuning. Map Law intact:
recipes generate, Paolo judges and tunes, Claude never hand-places a canon map.
