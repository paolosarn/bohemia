# THE ACT LOOK CARDS (DIRECTION, 9/6/26 — VAMILY [act cards])
# Paolo ruled three acts of UI: rustic 2050, modern, futuristic. Each card
# says what that act's chrome IS in pixel terms for our corpus, the way the
# style card did for clothes. UI cooks options against these; nothing
# reaches him unjudged (the batch-judging seam holds here too).

## THE SPINE THAT CARRIES ACROSS ALL THREE (or it stops being one game)
- LAYOUT NEVER CHANGES. Same panels, same positions, same order across
  all three acts — the acts re-skin the MATERIAL, never the grammar, so
  the player's hands never relearn a screen while the world's decades
  pass visibly in the chrome. The century is told by what the buttons
  are MADE OF.
- THE FLOORS RIDE THROUGH: 44 pt touch, 11 px body, the one-pixel
  border, glyphs >= 12 px (the half-size card), the beat at 120.
- THE WORDMARK GOLD is the one colour that appears in every act — the
  game's own signature, small, never as a wash.
- PURPLE BELONGS TO THE AMALGAMATION ALONE (the reservation, canon):
  in ANY act, purple appears only on surfaces the Amalgamation itself
  owns (their feed posts, their signage, their glow). The player's own
  chrome never wears it — seeing purple on your screen should mean
  THEY are on your screen.

## ACT 1 — RUSTIC 2050 (the crash decade: chrome made by hand)
- MADE OF: paint on salvaged board, stencil, chalk, tape, punched
  metal. Every element looks like somebody CUT it.
- VALUE BANDS: warm dark grounds 0.08-0.20; bone paint marks 0.70-0.85;
  the gold 0.55-0.65. Saturation cap 0.25 outside the gold (the dust
  register — the current splash plate is already this act done right).
- EDGES: rough by ONE pixel — a stencil bleed, a chipped corner; never
  more (one pixel of grit reads as hand-made, two reads as damage).
- TYPE: stencilled monospace, letter-spaced; labels look painted, not
  printed. Rules and dividers are single painted strokes with one
  visible break somewhere along their run.
- MOTION: things ARRIVE like objects — a panel slides as a board would,
  no fades (a fade is light behaving, and act 1 has no light to spare).

## ACT 2 — MODERN (recovery: chrome that is printed again)
- MADE OF: silk-screen on laminate, moulded plastic, brushed metal.
  Manufacturing is back; the hand disappears from the chrome.
- VALUE BANDS: neutral grounds 0.15-0.30 gone COOL (the warmth of act 1
  drains as the dust settles); print white at 0.85; the gold stays.
  Saturation cap rises to 0.35 — inks exist again — but the one-accent
  rule still governs anything brighter.
- EDGES: clean and square, radius <= 2 px at 112; the one-pixel grit is
  GONE — its absence is the act change the player feels first.
- TYPE: the same monospace family, tighter tracking, true-printed
  weight; dividers are unbroken hairlines. Labels sit in cases/chips.
- MOTION: mechanical ease — panels snap to rest in 2 frames; still no
  fades. Precision is the act's voice.

## ACT 3 — FUTURISTIC (the Amalgamation's decade: chrome made of light)
- MADE OF: glass, glow and hairlines. Elements are lit from within,
  backgrounds go near-black (0.05-0.12, the one act allowed below the
  0.08 floor for GROUNDS ONLY — the floor still binds every mark).
- VALUE BANDS: grounds 0.05-0.12; hairline strokes 0.60-0.75 in cool
  white/cyan; content white 0.85-0.92. Saturation cap 0.35, cyan-cold.
- EDGES: exact, radius <= 1 px, hairline weight everywhere; the glow
  is a ONE-pixel halo at 30% alpha, never a bloom (a bloom is the fog
  ban's UI cousin).
- TYPE: the same monospace, thin weight, wide tracking; light through
  glass, not ink on board.
- MOTION: fades become LEGAL here for the first time — light is what
  this chrome is made of — 2 beats maximum, and the arrival of act 3's
  first fade should feel like the future switching on.
- AND THE RESERVATION PAYS OFF: the Amalgamation's own surfaces glow
  PURPLE in a cyan world — the only purple in the game, arriving in
  the act the Amalgamation owns. The player learns the enemy's colour
  by seeing their light take over screens that used to be theirs.

## THE JUDGE'S TEST
One panel (the DAY panel) mocked in all three acts, side by side: same
layout to the pixel, three materials. A stranger must order them in
time without being told, and the floors must pass in all three.

## THE MACHINE BLOCK
```json
{
  "card": "BOHEMIA_ACT_LOOK_CARDS_9_6_26",
  "spine": {"layout_constant": true, "touch_pt": 44, "body_px_min": 11,
            "border_px": 1, "gold_in_every_act": true,
            "purple": "Amalgamation surfaces only, any act"},
  "act1": {"ground_val": [0.08, 0.20], "mark_val": [0.70, 0.85], "sat_cap": 0.25,
           "edge_grit_px": 1, "radius_px112_max": 0, "fades": false},
  "act2": {"ground_val": [0.15, 0.30], "mark_val": [0.80, 0.90], "sat_cap": 0.35,
           "edge_grit_px": 0, "radius_px112_max": 2, "fades": false},
  "act3": {"ground_val": [0.05, 0.12], "mark_val": [0.60, 0.92], "sat_cap": 0.35,
           "edge_grit_px": 0, "radius_px112_max": 1, "glow_halo_px": 1,
           "glow_alpha_max": 0.3, "fades_max_beats": 2},
  "judge": {"same_panel_three_acts": true, "stranger_orders_them_in_time": true}
}
```
ROUTED: UI cooks act options against these; DIRECTION judges before
VOTE (the standing seam); this line ships when the three-act mock of
one panel passes the judge's test.
