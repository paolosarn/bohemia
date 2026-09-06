# THE HALF-SIZE LOOK CARD (DIRECTION, 9/6/26 — VAMILY [small and clear])
# Paolo ordered every UI element on the walked surface HALVED and the city
# and map buttons KILLED in favour of a zoom. This card rules what survives
# the shrink and what the zoom must look like, so UI builds to a bar and
# the shrink is judged against numbers, not vibes.

## 1. WHAT "HALF" MEANS (chrome halves, floors do not)
Halving is a CHROME order, not a type order. An element halves by
dropping padding, borders and WORDS — never by shrinking letters through
the floor. The floors that do not halve, ever:
- TOUCH: 44 pt minimum target (UI-03). A halved button keeps its full
  hit area even when its visible face is smaller — the face may shrink,
  the finger's target may not.
- TYPE: body text never below 11 px on the phone (the feed card's rule,
  FEED-03: the eighth-grade law is also a type-size law). If an element
  cannot afford 11 px at half size, it loses its WORDS, not its point
  size.
- THE BORDER IS ONE PIXEL where he sees it (8/16) — at half size it is
  STILL one pixel, not half a pixel smeared.

## 2. WHICH THINGS MAY LOSE THEIR LABEL
- A button may go GLYPH-ONLY (glyph >= 12 px) when its glyph is either
  universal (the music note, the phone, the bed) or already learned —
  the label shows on first use each session, then collapses; and a HOLD
  always names the button in words (NAME THE TAB survives at half size
  through the hold, not the paint).
- WHAT NEVER LOSES ITS WORDS: the bark bubbles (that is the world
  talking, not chrome), the day/status line, any button whose action
  spends something (SLEEP ends the day — an unlabelled spend is a trap,
  FH-05's rule).

## 3. THE ZOOM (street, city, valley: one place at three distances)
The city and map BUTTONS die; the ZOOM replaces them. The rule that
makes three distances one place:
- ANCHOR INVARIANCE: the cell under the player stays under the thumb
  through the whole zoom. You never travel by zooming; you only see
  more. A zoom that re-centers is a teleport wearing a lens.
- SCALE-ONLY TRANSITION: no fades, no crossdissolves, no palette shift
  between distances — the same ban as the fight turn's hard cut. The
  picture may swap detail tiers (street art -> district tiles -> map
  icons) only at the moment the outgoing tier is <= 4 px per cell,
  where the swap is invisible by size.
- WHAT MUST READ AT EACH DISTANCE, and it is already ruled elsewhere:
  STREET = faces, worn accents, territory marks (the contrast rule and
  territory card). CITY = the held-block value statement, border rims
  on landmarks, the phone feed (its own card). VALLEY = district
  identity, every map square its own place (the closed icon board).
  A distance at which NONE of its layer's reads work is a dead zoom
  level and must not be a resting stop.
- THREE RESTING STOPS, FREE TRAVEL BETWEEN: the zoom rests at street,
  city, valley (a flick settles to the nearest), but the finger can
  hold any point between — the settle is comfort, not a mode.

## 4. THE JUDGE'S TEST (how the shrink gets judged when it lands)
Four screenshots: the three resting stops plus one mid-zoom frame. The
mid frame must be obviously BETWEEN its neighbours (scale continuity,
no tier pop above 4 px per cell); every retained element passes the
floors (44 pt, 11 px, one-pixel border); and a stranger shown the three
stops must say "closer and further", never "three different screens".

## THE MACHINE BLOCK
```json
{
  "card": "BOHEMIA_HALF_SIZE_LOOK_CARD_9_6_26",
  "floors": {"touch_pt": 44, "body_px_min": 11, "border_px_display": 1,
             "glyph_px_min": 12},
  "labels": {"collapse_after_first_use": true, "hold_names_in_words": true,
             "never_wordless": ["barks", "day line", "anything that spends"]},
  "zoom": {"resting_stops": ["street", "city", "valley"],
           "anchor_invariant": true, "transition": "scale only",
           "tier_swap_max_px_per_cell": 4,
           "reads": {"street": "faces, accents, territory marks",
                      "city": "held value, border rims, the feed",
                      "valley": "district icons"}},
  "judge": {"shots": 4, "mid_frame_between": true, "stranger_says": "closer and further"}
}
```
ROUTED: UI [half size] builds to this; DIRECTION judges the built shrink
against section 4 — this line ships on that judgment.
