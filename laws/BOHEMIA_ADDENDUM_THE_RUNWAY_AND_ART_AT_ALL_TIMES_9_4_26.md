# BOHEMIA ADDENDUM -- THE RUNWAY, AND ART AT ALL TIMES (Paolo 9/4/26, LOCKED)
# "we should always be having art made at all times... we might have to
# remake the clothing... every piece of clothing and every hairstyle should
# be modeled after like fashion brands... Balenciaga, Rick Owens... no
# matter their faction no matter what's going on I want everyone to look
# like they could be in a Balenciaga or Rick Owens show... the art direction
# chat... its role is to provide aesthetic decisions and choices and then we
# need another chat that's just always cooking up art. End of story."

## 1. THE LOOK: EVERYONE COULD WALK A RUNWAY
- **EVERY GARMENT AND EVERY HAIRCUT IN BOHEMIA IS MODELLED ON HIGH FASHION.**
  His named references are BALENCIAGA and RICK OWENS, and as of 9/4 they are
  in the reference set (they are fashion houses, not games; the 8/28 ban on
  unnamed reference GAMES is untouched, and no third house gets added until
  he names it).
- **NO MATTER THE FACTION.** A Colorful camp kid and a Reds fortress boss
  both look like they could stand in that show. The register is the same
  for everyone; the faction is carried by colour and by what the clothes
  are made of, never by dropping the register.
- WHAT THAT REGISTER IS, in words a cook can use: monochrome and dust,
  drape and asymmetry, elongated and oversized proportion, layered jersey
  and leather, destroyed and distressed on purpose, heavy boots, a face
  that is bored and beautiful. It is already post-apocalyptic; it is the
  most natural look this setting could have chosen. THE STYLE CARD that
  turns those words into PIXEL RULES is the DIRECTION lane's first job
  (section 3), not this law's.
- **THIS IS AN AESTHETIC LAW, AND IT COMPOSES WITH THE THREE WARDROBE LAWS
  ALREADY IN FORCE, ALL OF WHICH STAND:**
  - COLOUR IS TERRITORY (8/26): the runway gives the CUT, the faction
    gives the COLOUR. Both are true at once. A runway black is his
    default; a faction's saturated colour is its uniform.
  - TRENCHCOATS ARE FOR BADASSES, 10% HARD CAP (8/27): stands, because the
    reason was the heat and the heat has not changed. The runway is reached
    by cut and proportion (cropped, asymmetric, wide shoulders, layered
    short pieces, long jersey UNDER a short outer) rather than by every
    body wearing a floor-length coat. If he wants the cap lifted for the
    look, that is one word from him and it is his to say.
  - STRUCTURE-NOT-COLOR (7/19): a remake counts as progress only where it
    brings a new SHAPE. Most of this remake will, because the register is
    about silhouette.
  - GRAVEYARD IS FINAL: a killed garment or haircut stays dead. A remake
    cooks NEW shapes to the card; it does not revive.
- WHO WEARS WHAT stays his where he has ruled it (named characters,
  factions, bosses). The crowd is dressed by the picker under the card.

## 2. ART IS MADE AT ALL TIMES
- **THE ART LANE NEVER IDLES.** Its VAMILY section carries a permanent last
  line: "cook the next thing the style card asks for." It is never empty
  by construction.
- The demand is real and it is his: the wardrobe remake, hair to the card,
  the ~20 map-only districts, the 19 unplaced codes, the fortress
  buildings the towns ruling needs, and every item request that arrives
  through the central chat.

## 3. TWO LANES WITH ONE SEAM: DIRECTION RULES, ART COOKS
- **DIRECTION** (first word "direction"; this is the look half of the 8/25
  UI chat, "he crafts the Bohemia look WITH me", given its own word so it
  cannot be missed): writes the STYLE CARD in pixel terms for our 45-degree
  three-quarter corpus (palette, value bands, silhouette rules, what a
  Balenciaga shoulder or a Rick Owens drape IS at 56 and 112 pixels), keeps
  it current, and judges ART's cooks against it before they reach him.
  It decides; it does not cook.
- **ART** (first word "art"): cooks. Garments, haircuts, districts, props,
  in batches, under the card, through the existing kill/approve pipeline
  and the existing gates (structure, trenchcoat, hair, leaf, 45-degree,
  reuse-first). It cooks; it does not decide the look.
- **CHARACTER** keeps the rig, the picker, the wardrobe data and the gates,
  and WIRES what ART cooks (the same seam ART already has with WORLD for
  districts). ONE SYSTEM, ONE SESSION holds: ART makes pixels, CHARACTER
  makes them worn.
- **UI** keeps the HUD, the phone, settings, onboarding, the one-number rule.
- His thumb: EVERY FACE COMES WITH A THUMB (8/28) still binds portraits and
  haircuts; DIRECTION's judgement goes BEFORE his, so what reaches VOTE has
  already passed the card.

## 4. WHAT HE SAID ABOUT VAMILY
"I'm kind of content a little bit with it. It could be a lot better, but
honestly, it's not terrible." Recorded as-is. It stands; the coordinator
keeps improving it without being asked.

## ROUTING
- DIRECTION: THE STYLE CARD, first. Then judge every ART batch.
- ART: WARDROBE-REMAKE under the card (new shapes only), HAIR-TO-THE-CARD,
  then the districts queue it already had; permanent last line.
- CHARACTER: WIRE-THE-REMAKE as batches pass DIRECTION.
- Gate: the existing structure/trenchcoat/hair/leaf/45 gates hold every
  cook; DIRECTION's card gets a gate of its own (style_card_gate) that
  fails a cook outside the card's palette and value bands, the same shape
  as target_match_gate.
