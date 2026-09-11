# THE PHONE — THE 2050 RUSTIC PHONE LOOK CARD (DIRECTION, 9/11/26)
# [phone card] WHAT-A-2050-RUSTIC-PHONE-LOOKS-LIKE
# With UI [phone object]: the first concrete piece of the act-one interface
# card. The kill frame this answers: records/target/PAOLO_THE_FEED_IS_NOT_A_
# PHONE_9_8_26.jpg (a bare black rounded panel of monospace text — the words
# were right and the OBJECT was missing). His law: the feed lives on a phone
# and the phone is a phone (FEED-05); the act is rustic 2050 (act cards, 9/6).

## 0. WHAT THE OBJECT IS
A phone that SURVIVED, not a phone that shipped. 2050 hardware kept alive for
years past the crash: the last thing everyone owns and nobody can replace.
Real reference (the compare law): worn phones people actually carry where
nothing gets replaced — corner-taped, one cracked pane, shell polish gone
matte, screen dimmed to save a battery that no longer holds. Structure from
that reference, style from us; the object is PIXEL-NATIVE by style card 2C
(a photo phone beside pixel art is the same sin as the photo car).

## 1. THE SHELL (PROP-02 discipline: one material, two or three readable parts)
- THREE PARTS, NO MORE: the slab (matte shell, warm dark, value 0.10-0.18),
  the taped repair (ONE tape band at a corner or seam, 3-4 px wide, matte,
  value 0.35-0.45, with a 1 px shadow line where it lifts), and the glass.
  A fourth part (charms, stickers, a second tape) is decorating, not
  observing.
- THE BEZEL IS ASYMMETRIC: wear is not uniform. One long edge keeps a 1 px
  brighter rub line (the hand side); the other stays dead. Perfectly even
  wear reads as a texture, not a life.
- PROPORTION IS SACRED: the real phone ratio, about 9:19.5 (FEED-05), and it
  sits where the thumb lives. If the object cannot afford 11 px body text at
  that proportion it is a widget wearing a phone costume — shrink the world
  view, never the type.
- EDGES: act-1 grit, rough by ONE pixel (a chipped corner, one nick). One
  pixel reads as hand-kept; two reads as rubble.

## 2. THE GLASS (what a dim, low-battery screen does)
- THE GROUND IS NEVER TRUE BLACK. A dying screen at minimum brightness glows,
  it does not void: glass ground value 0.06-0.12, warm (the same dust family
  as the act-1 splash), no pure #000 anywhere on the pane.
- ONE CRACK, DRAWN ONCE: a single 1 px light fork (value 0.30-0.40) running
  from ONE impact point at an edge, two or three branches, and it NEVER
  crosses the text column — a crack over the words is noise cosplaying as
  character. No spider-web fills, no second impact.
- LOW BATTERY IS A PALETTE, NOT A FILTER: at most FOUR inks on the glass —
  the gold accent (0.55-0.65, the only saturation on the pane), the bone
  body ink (0.70-0.85), one dim ink for meta lines (0.35-0.45), the ground.
  No filter layer, no vignette, no scanlines, no moving glare. The single
  static concession to glass: one 1 px highlight along one bezel edge.
- NO FADES: things arrive like objects (act-1 motion rule). The scroll moves;
  the glass never glints, pulses or breathes.

## 3. THE WORDS STAY (the ruling: the words were right)
- FEED-01 through FEED-05 hold unchanged INSIDE the glass: four-part post
  anatomy, varying heights under one skeleton, avatar = 3 body lines, gutter
  = half a line, 1 px divider with one visible break (act-1 rule), one mark
  per post kind on the identity line.
- 11 px body is the floor, always, in the ROM register (fixed-cell,
  because a character-cell display is fixed-pitch - the 9/11 font ruling
  names the reason; monospace-as-default is dead) (the eighth-grade law is a type
  law). On the dim ground the body ink must sit at least 0.58 value above
  it — dimness is paid by the GROUND, never by the text.
- SPANGLISH survives verbatim: the feed's voice is content, not chrome, and
  this card touches chrome only.

## 4. THE THREE ACTS OF THE SAME PHONE (the act cards, applied)
- ACT 1 (this card): the taped survivor above.
- ACT 2: the same slab printed again — tape gone, crack gone, bezel even,
  laminate sheen 1 px, same layout to the pixel.
- ACT 3: a hairline glass slab; fades become legal there and nowhere else;
  purple appears ONLY if the pane is an Amalgamation surface (PURPLE
  RESERVATION). Layout never changes across acts: hands never relearn.

## 5. HOW UI'S OPTIONS ARE JUDGED (before he sees them)
UI ships 3-5 phone options per its 9/6 mode; DIRECTION judges them side by
side against (a) a real worn-phone reference image named in the option
sheet, and (b) the act-1 splash plate (the register anchor). The four
questions: does it read as a PHONE at arm's length in one second (ratio,
thumb seat)? does it read as SURVIVED 2050, not new (tape, crack, matte —
each present once, only once)? does the feed inside still pass FEED-03
ratios at 11 px? does the pane hold four inks with the gold as the only
saturation? Any NO kills the option with a post-mortem. Only options that
pass reach him.

## 6. MACHINE BLOCK
```json
{
  "card": "PHONE_2050_RUSTIC_LOOK",
  "date": "9/11/26",
  "object": {
    "ratio": "9:19.5",
    "parts": ["slab", "tape_band", "glass"],
    "shell_value": [0.10, 0.18],
    "tape": {"width_px": [3, 4], "value": [0.35, 0.45], "count": 1},
    "grit_px": 1
  },
  "glass": {
    "ground_value": [0.06, 0.12],
    "true_black": "never",
    "inks_max": 4,
    "gold_value": [0.55, 0.65],
    "body_ink_value": [0.70, 0.85],
    "min_text_ground_delta": 0.58,
    "crack": {"count_max": 1, "width_px": 1, "value": [0.30, 0.40], "over_text": "never"},
    "filters": "none", "fades": "none", "moving_glare": "none"
  },
  "type": {"body_px_min": 11, "family": "ROM register (fixed-cell), per the 9/11 font ruling"},
  "feed_rules": "FEED-01..05 unchanged inside the glass",
  "acts": {"act1": "taped survivor", "act2": "printed, damage gone", "act3": "hairline glass, fades legal, purple only on amalgamation surfaces"},
  "judge": "3-5 UI options beside a named real worn-phone reference AND the act-1 splash plate; four questions in section 5, any NO kills"
}
```

Proof: the kill frame and the 9/8 routing at the top; act bands from
records/BOHEMIA_ACT_LOOK_CARDS_9_6_26.md; feed ratios from
reference/library/feed/INDEX.md; object discipline from
reference/library/prop/INDEX.md (PROP-02) and style card 2C.
