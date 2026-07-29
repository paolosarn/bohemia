# TILE FORM TF-RUN-010 — THE CLOUT ICON (a crowd + a speech bubble, ONE mark)

## A. IDENTITY
- NAME (plain words a person would say): The clout icon — a crowd of people with
  a speech bubble, drawn as one thing
- FAMILY/SET: THE THREE CURRENCY MARKS (TF-RUN-008/009/010). Judged together;
  they must not be confusable.
- THE JOB, ONE SENTENCE: this tile exists so the player can see at thumb size
  how many people are talking about them — which in Bohemia is a currency you
  spend, not a score you admire.

## B. WHY (the need — no ruling, no tile)
- DEMANDED BY: `laws/BOHEMIA_ADDENDUM_COMBINED_CURRENCY_ICONS_7_28_26.md`
  (Paolo 7/28, LOCKED — his pick and his one-mark rule), implementing the CLOUT
  currency of `THREE_CURRENCIES_CENTURY_7_26_26`.
- WHAT LOOKS BROKEN TODAY WITHOUT IT: CLOUT is the currency with the most
  machinery already built and the least visibility. `bohemia_loop`'s clout math,
  the feed's follower-scaled comment volume, `socialProfile`, the reckless-beats-
  quiet weighting — all live, all invisible. The ME tab shows followers and
  posts as bare numbers with no mark.
- SHOPPING CHECK (`records/BOHEMIA_APPROVED_ASSET_INDEX_7_27_26.md`): walked.
  **No UI icons in the approved corpus** — it is entirely world art. The
  WARDROBE bank (195 canon items) contains human figures but as dressed bodies
  at world scale, not as a crowd silhouette. Genuine hole.

## C. WHERE (place — the game code reads this)
- SURFACE + TAB: the PHONE (Wallet; the ME tab beside followers; anywhere clout
  is a cost), and the city builder's build costs (buildings can produce clout).
- DISTRICT FAMILIES: n/a — UI layer.
- LAYER: prop (UI overlay; never on the world grid)
- SOLID? no — ENTERABLE? no
- MUST SIT BESIDE: a number; the other two currency marks.
- NEVER BESIDE: **a feed post.** This is a hard rule, not a preference — see the
  anti-reference. Also never repeated as a count, never on world tiles.
- EDGE CONTRACT: SINGLE PLACEMENT — never repeats, never tiles.

## D. WHEN (time & state — the invisible-caption inputs)
- ACT: 1, and unchanged across all three acts — though note the feed itself
  EVOLVES per act (GDD v2 §18: in late Act 3 "the feed becomes the battlefield").
  The MARK stays constant; the app around it changes.
- BEST TIME: any.
- WEATHER STATES: n/a.
- LIT/UNLIT variant needed? A dimmed/insufficient colorway, same as the others.
- ANIMATION: static. (A notification pulse belongs to the banner system that
  already exists, not to this mark.)

## E. HOW (build spec — the art lane's one-shot recipe)
- EXACT SIZE in px: reads at **32px**, holds at 2x/3x. Square.
- VIEW: UI layer, drawn in the same attitude as the world art.
- PALETTE: constitution ceiling; must read on dark phone chrome and pale HUD.
- LIGHT: one direction. NO black keyline. NO dither.
- SHADOWS: none baked.
- SCALE ANCHORS: the bubble and the crowd are the only two parts, so their
  relative size IS the composition. See the rule below.
- WEAR LEVEL: this one is different from the other two — a crowd and a bubble
  are not scavenged objects, so "wear" here means the world's ATTITUDE, not
  scratches: these are ordinary people in a hard decade, not a cheerful
  social-app crowd.
- VARIANTS: the mark, plus a dimmed/can't-afford colorway.

### THE COMPOSITION RULE (the part that decides whether this works)
- **ONE SILHOUETTE.** Two parts is easier than three — this is the most likely
  of the three marks to succeed, and it should be used to SET the standard the
  other two are held to.
- **RECOMMENDED DOMINANCE:** the **crowd** is the mass (a huddle of 3-5
  overlapping head-and-shoulder shapes, merged into one blob outline — NOT
  countable individuals), with the **speech bubble** rising from it as the
  resolving accent. One organic mass, one hard-edged rounded shape with a tail.
- **THE CROWD MUST NOT BE COUNTABLE.** The research is explicit that repeated
  small shapes turn to noise at icon size. Three heads drawn separately is the
  classic failure. It must read as *a crowd*, i.e. one mass with a bumpy top
  edge, not as *three people*.
- **THE BUBBLE'S TAIL IS THE TELL.** A rounded rectangle alone is a box; the
  tail is what makes it unmistakably speech, and it is the first thing lost at
  32px. Draw the tail decisively.
- **COLLISION CHECK vs the other two marks:** resources = a cluster of hand
  objects; energy = a container with a charge; clout = people with a bubble.
  Three different SUBJECTS (goods / power / people), which is the strongest
  possible separation. Keep it that way.

## F. THE CAPTION (ships with the tile — machine-readable)
```json
{
  "id": "TF-RUN-010",
  "name": "clout currency mark",
  "layer": "prop",
  "solid": false,
  "enter": false,
  "district_families": [],
  "best_time": "any",
  "best_location": "UI only — the Wallet app, the ME tab beside followers, clout costs; never on the world grid and NEVER on a feed post",
  "place_next_to": ["a quantity number", "the resources mark", "the energy mark"],
  "never_next_to": ["a feed post", "itself repeated as a count", "world ground tiles"],
  "weather_ok": ["sunny", "cloudy", "rain"],
  "acts": [1],
  "edge_contract": "single placement",
  "anim": null,
  "tags": ["ui", "icon", "currency", "clout", "social", "composite-mark", "crowd", "speech-bubble", "never-on-a-post"]
}
```

## G. REFERENCES (all three required)
- APPROVED ANCHOR: none exists (first UI art in the game) — the anchor is the
  frozen visual constitution.
- NAMED OUTSIDE REFERENCE: the research finding that games represent status with
  **stars, gems, coins and guild marks**, and that the strongest social symbols
  mean *belonging* rather than score — which is why his pick (people, not a
  star) is the better instinct. **Cyberpunk 2077**'s street cred for the idea
  that reputation is a resource a city reacts to, not a trophy shelf.
- REAL-WORLD GROUNDING: in a valley where the telecom industry collapsed and the
  phone network is a patched-together relic, reputation does not travel as a
  verified follower count — it travels as **people talking**. The feed in
  Bohemia is explicitly a survivor's platform where even the homeless have
  phones (his 7/20 ruling: *"fuck it, give them phones"*), and the mechanic that
  actually scales with clout is COMMENT VOLUME — more followers means more
  people commenting on what you did. So a crowd with a speech bubble is not a
  metaphor for the system; it is a literal picture of the mechanic.

## H. DON'T WANT (the anti-reference)
- **NEVER ON A FEED POST.** The visible CLOUT badge was KILLED on 7/21 — Paolo
  rejected showing a QUIET/NOTABLE/RISKY/RECKLESS label on posts: *"the whole
  point of this game is that it's hardcore but for normies to enjoy too."* The
  clout DATA drives engagement invisibly. This mark is a WALLET readout only.
  Putting it on a post revives a killed feature.
- NOT a countable set of people. Three separate heads is the classic icon
  failure and it dies at 32px.
- NOT a heart, a like, a thumbs-up, or any borrowed platform glyph — those
  belong to companies that died with the economy.
- NOT a star or a crown (status-trophy read; his pick deliberately avoids it).
- NOT cheerful. This is a hard decade; the crowd is people, not an audience at a
  concert.
- NOT a black keyline. NOT purple. NOT glowing.

## I. ACCEPTANCE (what the machine proves BEFORE Paolo ever sees it)
- [ ] **THE SOLID-BLACK TEST:** filled solid black, still recognisably CLOUT and
      not confusable with the other two marks. The gate that decides this form.
- [ ] The crowd reads as ONE MASS, not as countable individuals, at 32px
- [ ] The bubble's TAIL survives at 32px (the first casualty)
- [ ] Readable at 32px, verified by rendering at 32/64/96 and looking
- [ ] Palette ceiling + one-light + NO-KEYLINE + no-dither + purity + glow
      checks green
- [ ] Shown ON THE REAL SURFACE: in the Wallet app and beside the ME tab's
      follower count, at true phone size
- [ ] THE ROW TEST: three marks side by side at 32px, nameable without labels
- [ ] Dimmed/can't-afford colorway rendered beside the normal one
- [ ] Caption JSON parses and matches sections C/D

## NOTE (WORLD lane, 7/29): the caption said acts [1,2,3] while section D of this same
form says "ACT: 1". The caption is the machine-readable half and tileform_gate reads it,
so main went red on all three currency-icon forms. Set to [1] to AGREE WITH YOUR OWN
SECTION D -- your design note that the currency survives all three acts unchanged is
untouched and still in D. If you want the caption to span acts, that needs a cited Paolo
ruling, because ACT ONE ONLY is locked (laws/BOHEMIA_ADDENDUM_EVERY_DISTRICT_IS_A_LANDMARK_7_28_26.md).

## J. ADMIN
- STATUS: OPEN | REQUESTED BY: Paolo direct (7/28 pick + composition ruling)
  | DATE: 7/28/26 | PRIORITY: HIGH
- BOARD ROW #: 101 | VERDICT: —
