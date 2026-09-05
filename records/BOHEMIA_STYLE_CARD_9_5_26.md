# THE BOHEMIA STYLE CARD (DIRECTION, 9/5/26 — VAMILY [style card])
# The runway in pixel terms, for the 45-degree corpus. COOK cooks to this;
# DIRECTION judges against it; STYLE-CARD-GATE (its own VAMILY line) will
# hold it by machine. Kept current by DIRECTION and nobody else.
# Law: laws/BOHEMIA_ADDENDUM_THE_RUNWAY_AND_ART_AT_ALL_TIMES_9_4_26.md
# Shapes: reference/library/runway/INDEX.md (RNWY-01..13) — cite them.

## 0. THE CORPUS, MEASURED (not assumed)
- The paperdoll body is 24 px wide x 50 px tall per facing (PD_DATA
  body/male-mid, E facing, engine/bohemia_engine.js module 13).
- Art composes at the 112 grid (HAIR AT FOUR TIMES THE PIXELS, 8/25);
  the old grid was 56. Every pixel rule below is written at 112 with
  the 56 value in parentheses — a generator that thinks in 56 can only
  make marks the old grid could (the 8/25 law's own warning).
- Approved ramps run 3 to 7 steps (measured: shades 3, body 6, the
  japanese-fuzz jacket 7). The card's band for NEW cloth is 4-6.
- The canon wardrobe today: 280 garments, 256 non-hair; only 32% sit
  at cloth saturation <= 0.25. THE REMAKE'S JOB IS THAT NUMBER: the
  runway register is monochrome and dust, so new cooks land inside the
  palette below and the wardrobe drifts dark as batches replace.

## 1. THE PALETTE (monochrome and dust; colour is territory)
- CLOTH BASE: the garment's cloth ramp mid tone holds saturation
  <= 0.25. Runway black is the default outer: mid-tone value 0.15-0.38.
  Base layers may rise to bone (value up to 0.85). Dust, ash, bone,
  lead, oxblood-grey: all legal; candy is not.
- NO PURE ENDS: every ramp stays inside value 0.08-0.92. Pure black
  flattens the 45-degree read; pure white is the sun's job.
- THE ONE ACCENT: at most ONE piece per body carries the faction's
  saturated colour (saturation >= 0.55) — COLOUR IS TERRITORY (8/26):
  the cut belongs to the register, the colour belongs to the faction,
  and wearing it is a choice with a cost. A second saturated piece is
  a violation, not an outfit.
- RAMPS: 4-6 steps, hue-shifted (shadows cool or warm, never the same
  hue darker) — the 7/27 pixel craft laws hold under this card.
- PURPLE RESERVATION stands. No purple on any garment.

## 2. THE TWO POLES (RNWY-13: commit to one, or it reads as neither)
Every dressed body is ONE of these, chosen at cook time and named in
the cook's REFERENCE CHECK:

### POLE A — WIDE AT THE TOP (the Balenciaga figure)
- SHOULDER: span >= hip span + 4 px at 112 (+2 at 56), and EITHER cut
  square (corner rounding <= 1 px — RNWY-01) OR a full cocoon arc,
  one curve neck to elbow with NO shoulder point (RNWY-02).
- WAIST/LEG: the figure narrows under the shoulder; the leg is a
  single column, ankle break-free (pant-boot, RNWY-10), total leg
  width <= hip span - 4 px at 112.
- PROFILE: the cocoon hem falls in an arc, longer behind than in
  front — the profile reads as a comma, not a rectangle (RNWY-09).

### POLE B — TALL AND STACKED (the Rick Owens figure)
- SHOULDER: soft and narrow, span <= hip span (RNWY-03). Height is
  the statement, never breadth.
- LAYERS: at least 2 visible hem lines stacked, each >= 3 px apart at
  112 (>= 2 at 56), lower layer longer (RNWY-05, RNWY-08). The stack
  stays readable at the collar or it is a blob (RNWY-06).
- ASYMMETRY: a garment that declares an asymmetric hem crosses >= 6
  px of height across the body's width at 112 (RNWY-07) — a diagonal
  event, not a wobble.
- LEG: drop-crotch legal — the leg mass is widest between hip and
  knee and tapers to <= 3 px per leg at the ankle at 112 (RNWY-11).
- BASE: the boot is a pedestal — a dark platform mass >= 4 px tall at
  112 (>= 2 at 56) that visibly widens the figure's base (RNWY-12).
  The paperdoll already carries the proof ramp: shoes/balenciaga,
  five dark steps.

## 3. WHAT STANDS UNDER THIS CARD (nothing here overrides a law)
- TRENCHCOATS ARE FOR BADASSES, 10% hard cap (8/27): pole B is
  reached by stagger and taper, not by every body in a floor coat.
- STRUCTURE-NOT-COLOR (7/19): a cook counts as progress only with a
  new SHAPE. A recolour inside this palette is maintenance.
- GRAVEYARD IS FINAL: a killed shape stays dead; the remake cooks new
  shapes to this card.
- EVERY FACE COMES WITH A THUMB (8/28): the card feeds VOTE, it never
  bypasses it. The register's face is bored and beautiful; the face
  laws own the rest.
- 45 DEGREE ART LAW: every garment reads on the three-quarter corpus
  from all eight facings; a pole judged only from the front is not
  judged (the haircut lesson, 8/28).

## 4. THE MACHINE BLOCK (STYLE-CARD-GATE parses this, nothing else)
```json
{
  "card": "BOHEMIA_STYLE_CARD_9_5_26",
  "grid": {"body_w": 24, "body_h": 50, "compose": 112, "legacy": 56},
  "cloth_sat_max": 0.25,
  "outer_val_mid": [0.15, 0.38],
  "base_val_max": 0.85,
  "val_floor": 0.08,
  "val_ceil": 0.92,
  "accent_sat_min": 0.55,
  "accent_max_pieces": 1,
  "ramp_steps": [4, 6],
  "poles": {
    "A": {"shoulder_minus_hip_px112": 4, "corner_round_max_px": 1,
          "leg_max_vs_hip_px112": -4},
    "B": {"shoulder_max_vs_hip_px112": 0, "hem_lines_min": 2,
          "hem_gap_px112": 3, "asym_hem_drop_px112": 6,
          "ankle_taper_max_px112": 3, "boot_base_px112": 4}
  },
  "banned": ["purple", "second saturated piece", "pure black", "pure white"],
  "coat_cap": 0.10
}
```

## 5. HOW A COOK USES IT (three sentences)
Pick the pole, name it and the RNWY entries in your REFERENCE CHECK,
and cook inside the palette block. One faction accent, four-to-six
step hue-shifted ramps, no purple, no pure ends. If the silhouette
does not read as its pole at arm's length on a phone, it is not done
— the card is the bar, VOTE is still the verdict.
