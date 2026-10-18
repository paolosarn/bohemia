# WORDS [the arrival's lines] -- ONE ROUND (words-8dqrnq). Rule 80b, THEY SPEAK SPANGLISH.
RUN TWO [the arrival] (the banner itself) is still OPEN, unclaimed, measured against the real
file not the board's wording: no arrival sequence exists anywhere in
slices/BOHEMIA_SETTLEMENT_SCREEN.html yet, so this is content ahead of the mechanism, said
plainly, not hidden. THIS FILE IS THE DELIVERABLE: it edits neither the settlement screen nor
any data file (ONE SYSTEM, ONE SESSION, rule 55); RUN TWO applies what it wants.

## THE TIER AND TRAIT LINES: 12 TOTAL, THREE TIERS x A BASELINE AND THE THREE REAL TRAITS
Checked the real tiers (camp, town, fortress, slices/BOHEMIA_SETTLEMENT_SCREEN.html's PLACES
table) and the real traits (raided, sickness, market_day, records/target/settlement_traits.json,
RUN TWO's own shipped file). These are the short banner line, not the longer in-building
dialogue each keeper already says when a building opens; this one is read in two seconds on
the torn tag before the picture, so it stays shorter than the already-shipped says.any lines.

NO TRAIT (the baseline, every arrival that rolls none):
  CAMP: "A camp. Small, and everyone here already knows everyone."
  TOWN: "A town. Enough people that nobody looks up when you walk in."
  FORTRESS: "A fortress. Walls first, then a town."

RAIDED (echoes the keepers' own shipped line, "burned the Ortega house," shorter for the banner):
  CAMP: "A camp, raided. Still smells like smoke."
  TOWN: "A town, raided. The stalls that are left charge for it."
  FORTRESS: "A fortress, raided. Even walls did not stop this one."

SICKNESS (echoes the keepers' own shipped line, "boarded up the clinic windows"):
  CAMP: "A camp, sick. Half of them are coughing."
  TOWN: "A town, sick. The clinic's windows are boarded."
  FORTRESS: "A fortress, sick. Even behind walls, the cough got in."

MARKET DAY (echoes the keepers' own shipped line, "everybody is out"):
  CAMP: "A camp, market day. Everyone's trading, even here."
  TOWN: "A town, market day. The whole street is out."
  FORTRESS: "A fortress, market day. The gate's wide open for it."

## THE OPINION BAR: NINE BANDS, SOURCED TO THE REAL RELATIONS.JSON, NOT GUESSED
FACTIONS' [beef] already ships the real bands (records/target/bb/relations.json, the wiki's
own Relations page) and a band() function that returns an id; nothing player-facing has ever
said what that id means. Wrote one plain phrase per band, checked each against what the data
actually does at that band, not just the name:
  HOSTILE (0-9): "They will draw on you here." (sourced: guards.draw_at_or_below is 9, the
    hostile band's own top; this is the one band where that is literally true, so the other
    eight do not borrow its menace)
  THREATENING (10-19): "One wrong move and this turns ugly."
  UNFRIENDLY (20-29): "They do not like you here."
  COLD (30-39): "They barely tolerate you."
  NEUTRAL (40-59): "They do not know you yet." (sourced: every settlement starts at 50,
    dead centre of this band, "all settlements start with the bar at Neutral")
  OPEN (60-69): "They will hear you out."
  FRIENDLY (70-79): "They like having you around."
  VERY_FRIENDLY (80-89): "They would vouch for you."
  ALLIED (90-100): "They would go to war for you."
ONE CAUGHT BEFORE WRITING: my first pass had THREATENING drawing a weapon too, which the
data does not support (guardsDraw's own cutoff is the hostile band's ceiling, not
threatening's); fixed before it went in the list above, not after.

## RULE 27 AND THE UNBUILT-RULE CHECK
Every line above is a banner caption or a status phrase, never something the player says.
No Spanglish in any of them: the arrival banner is the game's own voice narrating the place,
not a keeper's mouth, so this stays in the narrator's plain register (rule 45's too-calm
institutional voice fits a banner better than a keeper's accent, and nothing here claims to
be a person talking). Nothing above claims a mechanism beyond what the two source files
(settlement_traits.json, relations.json) already run; the hostile line's "draw on you" is the
one phrase actually checked against the number that triggers it. 0 em dash.
