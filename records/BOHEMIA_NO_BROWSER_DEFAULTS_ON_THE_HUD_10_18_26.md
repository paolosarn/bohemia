# NO BROWSER DEFAULTS ON THE HUD: SIX SCREENS READ, STRIPPED, PHOTOGRAPHED (UI [no browser defaults on the HUD], 10/18/26)

MODE: cook only (rules 100, 108). A candidate in VOTE. Nothing in the game: the strip is laid over the real screens in the browser
by a tool and photographed; no slice or engine file changed.

## WHAT HE SAID
Rule 114 (Paolo 10/16, 'it can't look like it's vibe coded... it has to look like it was not made by... a freaking AI guy'), tell D10:
gradients, blur, glow, corners over 2, hue 250-290 panels and system fonts on a game screen are the loudest AI tell on a phone. ALL
THE UI LOOKS 3-D (Paolo 9/20): light and form delivered as pixels. THE FIRST VOTES: the alpha's UI is frozen at his picks, so only
the surface changes. The style guide's UI field (records/target/BOHEMIA_STYLE_GUIDE.json, field 14): gradients 0, blur 0, glow 0,
radius max 1, the game's faces only.

## HOW THE PACK DID IT
His packs' UI pieces (the gauges, the receipts, the props the phone's apps are cut from) carry their light as drawn pixels: a lit
top edge and a dark bottom edge in the piece's own ramp, never a fade. The strip copies that rule, not a picture.

## WHAT THE SCREENS RESOLVE TODAY (measured on his phone, the browser's computed style, every visible element and its ::before/::after)
| screen | gradients | glow | corners >1 | hue 250-290 | phone fonts |
|---|---|---|---|---|---|
| map (upright; sideways the same) | 8 | 4 | 14 | 0 | 0 |
| the cracked phone, opened | 16 | 16 | 30 | 1 | 44 |
| the fight | 1 | 2 | 1 | 0 | 0 |
| the settlement | 0 | 0 | 2 | 0 | 5 |
| the VOTE tab | 0 | 0 | 10 | 0 | 18 |
Blur: 0 everywhere. The source count (tools/bohemia_not_vibe_coded.py --ui, PLUMBER's N4) reads files; this reads the screen, and
it finds what the source count cannot: 67 lines of words in the phone's own faces (the opened phone 22 ui-monospace + 22
-apple-system, the VOTE tab 18 ui-sans-serif, the settlement 5 ui-monospace) that the source regex misses because they arrive
through font variables and the ui-* family names.

## THE STRIP (tools/bohemia_ui_no_defaults_strip.js)
- A gradient becomes its middle stop, flat; the light is drawn back as a 1 px line of its OWN lightest stop on top and its OWN darkest
  on the bottom (colours the author already chose, nothing darkened by formula, rule 114c). A see-through gradient (a vignette or a
  sheen, every stop under 0.6 alpha) is dropped with no lines.
- A shadow keeps its offset at 0 blur (a hard pixel drop); a pure glow is dropped. Blur filters dropped.
- Corners over 1 px go to 0. The one purple panel (the Neighbor's tile on the phone) takes the receipt's hue at the same lightness.
- Words: a monospace face, a running sentence over 40 letters and a text box take BohemiaROM (typewriter width, his frozen LETTERS A,
  upper and lower case); short labels take BohemiaCasing.
- Written inline with !important on the element (it beats the demo's id rules), into one stylesheet for ::before/::after; two passes
  a beat apart because the phone fades its inside in.

## AFTER
Zero of every tell on all six screens. The layout: 0 of 24 boxes moved on the map, 0 of 21 on the fight, 0 of 11 on the settlement.
The phone moved 7 of 36 (its inner page is 29 px shorter because its bar's words changed face; the status row's spans shift by 8 px)
and the VOTE tab 4 of 4 (the narrower letters shrink the NIGHT and EXPORT buttons; the intro line wraps once more, so the list
starts 21 px lower). Those are word-width moves, not layout changes; RUN TWO decides at the wiring whether to hold the buttons' width.

## SHIPPED
- tools/bohemia_ui_no_defaults_strip.js (read + strip + boxes), tools/bohemia_ui_no_defaults_shots.js (the driver, six screens),
  tools/bohemia_ui_no_defaults_sheet.py (the sheet, 256 colours, 3 MB), tools/bohemia_ui_no_defaults_register.py (the card).
- Sheet: records/target/ui_no_defaults/UI_NO_BROWSER_DEFAULTS.png, manifest UI_NO_BROWSER_DEFAULTS.json.
- Gate: gates/no_browser_defaults_gate.py 9/0, in the suite as NO BROWSER DEFAULTS; four planted breaks caught (a phone font left on
  the VOTE tab, a map box moved, the fight screen missing, a corner left on the phone).
- VOTE: ui-no-browser-defaults-10-18 (YES / NO).

## FOR RUN, RUN TWO AND PLUMBER AFTER HIS YES
The strip is the spec, rule by rule: fold it into the source (the look factory's output in the alpha and demo, the city file, the
phone's inside, the VOTE tab's CSS), never ship the script itself. Then PLUMBER's N4 baseline (frozen at 266 in the source) drops to
what is left, and this gate's 'after' leg can read the real screens instead of the strip.
