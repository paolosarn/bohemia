# THE CITY FROM ABOVE — THE LOOK CARD (DIRECTION, 9/11/26)
# [city look] WHAT-A-REALISTIC-CITY-FROM-ABOVE-IS-IN-OUR-PIXELS
# The 7/1 lock ("same pixel style, reading as a REALISTIC CITY FROM ABOVE,
# not chibi") in pixel terms, so COOK [city from above] cooks to a card and
# LIFE+CITY [tiles not slabs] renders to one. The kill frame this card
# replaces: records/target/PAOLO_WHY_DOES_THE_CITY_LOOK_LIKE_THIS_9_8_26.png
# (19 filled rectangles against 9 image draws — a block chart, and he said so).

## 0. WHAT WAS MEASURED, AND HOW
The aerial's colours are not a taste choice: they are what the street's own
approved art AVERAGES TO when a whole tile collapses toward one coarse pixel.
Method: every act-1 APPROVED tile (Paolo's Great Sweep verdicts, 7/13) in the
roof, road, ground and burned families, box-filtered to its mean colour, the
distribution read off (median and 10th-90th band). Approved counts: 36 roofs,
76 roads, 70 grounds, 36 burned. These ARE the numbers below. A real Las Vegas
aerial separates the same way (TG-02, the satellite anchor: roof planes first;
TG-01: a lot is mostly roof): bright desert ground, dark road ribbons, warm
roof grids between.

## 1. THE THREE SURFACES (value first, saturation second, hue almost never)
Everything below is the DAY read; night multiplies value and touches nothing
else (the cloud rule's discipline, one mechanism one card).
- THE GROUND IS THE BRIGHT THING. Hardpan / lot ground: value 0.47-0.74,
  median 0.52, warm tan (hue 29-45), sat around 0.55. The valley floor is the
  lightest large surface in frame. If the ground reads darker than the roofs,
  the frame is upside down.
- A ROAD IS A DARK RIBBON, NOT A COLOURED LINE. Value 0.22-0.43, median 0.36,
  saturation AT OR UNDER 0.31 (median 0.20). Roads read by being darker and
  greyer than everything they cut through. The diagram's green and yellow
  street lines are DEAD in the player view: no road ever wears an edge colour.
- A ROOF IS WARM AND SITS BETWEEN. Value 0.22-0.51, median 0.35, hue 20-45
  (terracotta, tar, sun-bleached shingle), saturation free up to 0.88 —
  saturation is what separates a roof from the asphalt beside it at equal
  value. Roof, not walls: from above a house is its roof planes and a one-two
  pixel shadow edge on the sun-away side (TG-02).
- BURNED GROUND is the darkest family: 0.19-0.28. Scars read at every distance.

## 2. WHAT A LOT READS AS
- A SUBURB BLOCK is rows of warm roof rectangles almost touching, split by
  thin bright hardpan seams: the house nearly fills its lot (TG-01), the yard
  is its own tile behind it (the 1x2 ruling). A fat green or grey margin
  around a house is a scale lie, and lawn does not exist in act 1.
- A COMMERCIAL LOT is one big pale striped slab (seal-coat grey, brighter than
  the road, stall stripes surviving as a faint comb) with a single large flat
  roof beside it (TG-05).
- THE DIAGRAM IS A LAYER, NOT THE CITY. The plots, the skeleton, "protected":
  a builder overlay the mayor toggles ON, off by default. The player sees
  roofs and roads, never filled district rectangles.

## 3. WHAT MOVES AT THAT DISTANCE
- THE CROWD IS DARK SPECKS THAT MOVE. A body collapses to a 2-3 px dot at the
  runway outer-garment value (0.15-0.38), read against bright ground or mid
  road — the contrast rule (card 2B) still binds at dot size: at least 0.15
  value from what it stands on. A crowd is many dots with different headings;
  a plaza full of them reads as grain that drifts. No dot ever gets a label.
- A WRECK STAYS A WRECK. The 20 approved cars keep their silhouette at coarse
  scale (a dark 2x4-cell speck with a rust fleck), because the coarse art is
  the fine art resampled — the burned car reads as a burned car (his 9/8
  ruling, word for word).

## 4. WHERE THE FACTION COLOUR SITS (COLOUR IS TERRITORY, aerial form)
- Colour rides the BORDER and the MARKS, never the ground: a held block wears
  a ONE-PIXEL rim on the holder's side at the coarse cell edge (the territory
  card rule, unchanged by distance), marked walls keep their under-2% colour
  share, and the slab NEVER fills. The kill frame's brick-red and blue
  district fills are exactly the violation.
- PURPLE RESERVATION holds from orbit: purple is the Amalgamation's alone.
- GREYSCALE TEST: drop the frame to grey and it must still read as a city —
  ground light, roads dark, roofs mid. If territory disappears in grey,
  the territory is drawn right (colour was carrying nothing structural).

## 5. DERIVED, NEVER REDRAWN
- The coarse tiles are RESAMPLED FROM THE FINE TILES by machine (box filter),
  never a second hand-drawn set — NOTHING IS BAKED ONCE, and drift between
  the two scales is the bug this rule exists to kill.
- ONE HOUSE, BOTH SIDES OF THE SWITCH: at the shared zoom stop (his 9/7
  ruling: the street's farthest zoom-out IS the city's closest zoom-in, one
  number, owned by that fix) a house is the same house — same footprint, same
  roof colour, same orientation. Tiers may simplify only below 4 px per house
  tile (the half-size card's swap floor).
- 45 DEGREE LAW: the aerial keeps the world's three-quarter lean exactly as
  far as the fine tiles carry it; it is the same camera further away, not a
  new top-down projection.

## 6. HOW A COOK IS JUDGED (the compare law, aerial form)
COOK [city from above]'s first batch is judged SIDE BY SIDE against:
(a) a real Las Vegas aerial (TG-02's satellite anchor, any suburb block), and
(b) the walked street the coarse tiles derive from, at the shared stop.
The three questions: does the ground read brightest / the roads darkest /
the roofs warm-between (section 1)? does a suburb block read as roof rows
with hardpan seams, not slabs (section 2)? does the greyscale frame still
read as a city with no coloured fills doing structural work (section 4)?
Any NO kills the batch with a post-mortem. Nothing from any reference game
enters the vocabulary (8/28); Pocket City 2 stays drop-in-transition only.

## 7. MACHINE BLOCK
```json
{
  "card": "CITY_FROM_ABOVE_LOOK",
  "date": "9/11/26",
  "measured_from": "act1 approved tiles (Great Sweep 7/13), box-filtered means",
  "surfaces": {
    "ground": {"value": [0.47, 0.74], "hue": [29, 45], "role": "brightest large surface"},
    "road":   {"value": [0.22, 0.43], "sat_max": 0.31, "role": "dark ribbon, no edge colour"},
    "roof":   {"value": [0.22, 0.51], "hue": [20, 45], "role": "warm, separated from road by saturation"},
    "burned": {"value": [0.19, 0.28], "role": "darkest family"}
  },
  "crowd_dot": {"px": [2, 3], "value_band": [0.15, 0.38], "min_value_delta_vs_ground": 0.15},
  "faction_colour": {"border_rim_px": 1, "marks_share_max": 0.02, "filled_slabs": "never", "purple": "amalgamation only"},
  "derivation": {"coarse_from_fine": "box filter, machine, never hand-redrawn", "tier_swap_below_px_per_house": 4, "shared_stop": "one number, owned by the 9/7 zoom ruling"},
  "diagram_layer": {"player_default": "off", "toggle": "builder only"},
  "judge": "side by side: real LV aerial (TG-02) AND the walked street at the shared stop; greyscale must still read city"
}
```

Proof: measurements in this file's section 0 run off
banks/BOHEMIA_ACT1_CONFIRMED_SET_7_13_26.txt x banks/BOHEMIA_HD_TILE_REPO_part*;
the kill frame and the 9/8 ruling record are cited at the top.
