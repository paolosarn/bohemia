# BOHEMIA — ADDENDUM: BABYPUNK (player character #1) sprite sheet
**6.28.26 — Paolo / Babypunk.** Reference photo `IMG_1778.jpeg`. Style ref `IMG_3617.PNG`
(Stardew portraits + walk sprites, used for STYLE only — Bohemia runs taller, see proportions).
First-pass renders: `bohemia_babypunk_mid_hoods.png` (MID, hood-down vs fuzzy-hood-up A/B).
Proportion **LOCKED = MID (~4.5 heads).** Tag **[FIRST PASS]** = rough, will iterate; not final.

---

## THE LOOK (Paolo's words) — "most baby-punk outfit I've ever worn"
All black, the only two bright values are the **pale face** and the **platinum hair**. That contrast
is the entire silhouette read and the reason it works as a sprite.

## OUTFIT → SLOTS (this is how he decomposes into the paper-doll)
- **shirt** — light-material black hoodie **worn BACKWARDS**, hood pulled to the front so it reads as a
  **cowl** at the neck. It's a **full long sleeve** (covers shoulders + both arms); jacket goes on top.
- **jacket** — black designer Japanese piece with a **black fuzzy hood**. Two variants:
  **hoodDown** (bunched at shoulders, hair shows) and **hoodUp** (fuzzy hood over the head, hides hair).
- **pants** — tight black **leather** jeans WITH the black **fuzzy legwarmer bottom** baked in as one
  pants item (legwarmers are NOT a separate slot). Leather needs a specular highlight to read.
- **shoes** — black **Balenciaga**.
- **hair** — **platinum all over, shaggy, jaw-length, parted, falls both sides.** NOT black on top
  (that was a beanie mistake). See selfie ref `IMG_4872.jpeg`.
- **hat** — tight black beanie (optional; he sometimes wears it, e.g. the fur-hood fit).
- **face/portrait** — pale skin, strong dark brows, light eyes, **septum ring**. Portrait v1 built
  (`bohemia_punk_portrait.png`).

## PALETTE (hand-authored, daylight-readable so the all-black fit isn't a mud blob)
- outline `#060608`
- skin `#E9D2C0` / shadow `#C2A48E` / line `#8A6B58`
- platinum hair `#EDE8DC` / shadow `#C3BCAC` / highlight `#F6F2E8`  ·  faint root shade `#A8A088` (NOT black)
- beanie `#16161B` / `#0C0C10`
- cowl (backwards hoodie, softest black) `#2A2A30` / `#1A1A1F`
- jacket `#121216` / `#0A0A0D`  ·  fuzzy hood `#2E2E34`
- leather pants base `#14141A` · **sheen** `#4A4A56` / edge `#6A6A78` · shadow `#08080C`
- fuzzy legwarmers `#1F1F24` / hi `#34343C`
- shoes `#0C0C0E` · sole `#2A2A30`

## NOTES FOR THE CLEAN PASS
- Value-separate the black mass: jacket darkest, hoodie/cowl softest, leather carries the only sheen,
  fuzzy hood + legwarmers carry texture noise. Without that the body blurs into one shape.
- Face + platinum are the focal points — keep them the brightest pixels on the sprite.
- Pose: this is **upright/idle**. Photo has a hand-on-hip cock; the drawn idle can keep arms down,
  save the attitude pose for a portrait or a victory anim.

## BLOCKERS / NEXT
- **BUILT as real layers:** 45 PNGs across 5 directions in `characters/<slot>/` (body, pants
  leather+legwarmer, shoes balenciaga, shirt cowl-hoodie, jacket hoodDown+hoodUp, hair platinum-fall,
  hat beanie). Exploded + dressed + hood A/B rendered. Shirt hem sits over the leather waist.
- **Iconic hood state** (hoodDown vs hoodUp) = Paolo to pick; hoodUp buries the platinum pop.
- **Next:** facial layer from the portrait creator (the blank head); author clothing onto
  crouch/sit/downed; mount the combat arm on the dial. Then char #2 = **Keira** (photo pending).
- Polish: crouch/sit FRONT poses are rough (read better from the side); side/back body depth can
  still improve. Functional, not final.
- Draw clean across the **5 drawn angles** (S, N, E, NE, SE) → mirror to 8. Then crouch / sit / downed.
- **Detachable combat arm** (pistol = 1 arm, shotgun = 2) authored to swing on the dial.
- Then the **portrait** (64x64) via the portrait paper-doll layers.
- Player character #2 = **Keira** (girlfriend), photo pending, built after Babypunk is final.
