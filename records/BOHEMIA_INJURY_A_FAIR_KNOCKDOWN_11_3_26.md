# A FAIR KNOCKDOWN (INJURY lane, 11/3/26, BUILD 11/3k)

VAMILY rules 303 and 304; asks 292, 293, 294. Paolo 11/2: "every time you get down it is always going to be an injury... a
debuff that could last 1 to 8 days... I'm not even a fan of the permanent debuff, that would make me want to start the game
all over... if you let it happen a couple times it can low-key be OK, after a couple times it's hitting the HP... a fair amount
that doesn't make you wanna cheat." And the card, voted NO: "ugly, cluttered, try again".

## THE RULE (rule 304)
- (a) THE FRESH WOUND, as before: every knockdown of a man (never YOU) gives the wiki's temporary row for 6 to 8 of our days, its
  penalty fading in a straight line (engine/bohemia_long_injury.js freshNow). Untouched. One fix: a man who already carries all
  eleven marks still gets a wound (the fight's pool falls back to every mark).
- (b) THE MARK IS A SCAR: engine/bohemia_long_injury.js penalties() lists the fresh wound only; scar(id) is a mark as the fight
  carries it (id and name, kind 'scar', no effects). slices/BOHEMIA_FIGHT.html hands carried marks in that shape, so they bite on
  no stat. OLD SAVES: a mark's penalty was always read from its id at use, so every mark already taken has none from the next
  read; nothing to migrate.
- (b) A CALL MADE, NAMED: the fight's death roll added 5 in 100 per mark (ours.struck_down_death_per_mark, the fifth votes 10/1,
  "a little more per debilitating trait or injury carried"). A scar is kind 'scar', so it no longer counts. Why: rule 304 is newer
  and says the first two knockdowns "cost nothing for good" and the mark is "a story with no penalty"; a mark that raises the
  death roll is a penalty for good from the first knockdown. The row stays in ours.json for traits; if the coordinator reads 304
  otherwise, giving scars back to the death roll is one word in deathChance (kind 'scar' counted).
- (c) THE WEIGHT, AS AMENDED ON MAIN WHILE THIS LANE WORKED (rule 304(c) 11/2, his corrections: 'my punishment will start on
  that first fall, not after three', 'maybe it's a roll whether it's one or two, maybe that's fair', 'there is no cap'; NOT FINAL,
  his numbers to settle): engine/bohemia_condition.js counts m.knocks (a new field: old saves start at 0, their past knockdowns not
  re-counted; m.struck stays as history) and EVERY knockdown rolls 1 or 2 max hitpoints for good, kept on him (m.cutHp the sum,
  m.cuts the rolls). records/target/bb/condition.json rows: knockdown_free 0, knockdown_hp_roll_min 1, knockdown_hp_roll_max 2,
  knockdown_hp_cap 0 (0 is no cap; a modder edits them there, the engine's DEF is the fallback). His max never goes under 1 (the
  fight's floor). YOU are never counted. The first cut of this lane (two free, then 1 each, to -5) shipped in commit 1 and is
  replaced by this in the commit after it. The fight takes hpCut off his max (condApply; u.hpWhole keeps the whole for the record); the
  crew screen's HP stat shows the same.

## THE SCREEN (asks 292, 293)
- slices/bohemia_injury_card.js redrawn as ONE TIN PLATE (Crashbox, rule 301: riveted tin lit from the top left, clay chips pressed
  in, a faint scan): line 1 the wound's name, a dried-blood bead per day lit for the days left, the clock; line 2 what it costs
  now (stat icons, red arrows, nothing else; with the clinic: now | CLINIC > | after); line 3 for good: SCARS FOR LIFE by name and
  the knockdown tally (bone beads free, red beads that cost) with what is gone or what the next one costs (rule 303: the risk seen
  before it is taken: NEXT ONE: -1 OR -2 MORE). Same card in the clinic and the crew screen.
- The crew screen's hurt box: one short head (HURT, STILL FIGHTING / HEALED, SCARRED) and the card. The old three "FOR GOOD: mark,
  penalties" lines are gone.
- His portrait in the crew line wears the tally in its corner (BohemiaInjuryCard.tally, with -N HP once it costs).
- The bars over a hurt man (BohemiaCondition.drawHeadBars): a dried-blood pip per wound day rides over them, and a wounded man
  always shows them.
- CAMP: the camp is his own settlement; the clinic and the crew door are its card; there is no third drawing.

## PROOF
- gates/struck_down_he_still_fights_gate.js, new legs K1 to K3, walking the cut demo at phone size: the same man struck down three
  times by the fight's own fall(), the wound each time; his marks come into the next fight as scars with no effects and the card's
  penalties are the wound's only; K3 each knockdown took its roll of 1 or 2 and the next board's max is his whole less the sum.
  S4 now reads the mark as a scar. PHONE RUN (the first cut's K3, two free then 1): K1, K2, K3 ok (3 knockdowns: broken_knee 8 days,
  missing_ear 6, weakened_heart 6; knocks 1, 2, 3; the board 56 of a whole 57), S1 to S8, S10, D1 to D3 ok. THE AMENDED RULE'S
  PHONE RUN: 18 passed, 0 failed (maimed_foot, missing_eye, brain_damage, 7 days each; rolls 2, 2, 1; the board 56 of a whole 61;
  S9 green this time). S9 (AN OLD SAVE WAKES) was RED on the two runs before, the same with the K legs
  before it or after it: the saved bench is emptied before BohemiaCondition.wake reads it (bench 0, the man never in the condition),
  a path this change does not touch (wake is unchanged); owed to whoever owns the save (rule 295's hire lock is the newest writer
  of bohemia.company.line.v1); so it is FLAKY, not broken by this. The K legs run before S9 because after S9's reload the fight frame detaches.
- gates/the_clinic_halves_both_gate.js reads the new head and the card's clock: 12 ok, 0 failed.
- gates/roster_hurt_gate.js reads the new head, the card's clock and the scars line, but it is RED BEFORE THE CARD: its standalone
  fight strikes down TINA and the crew screen calls that man TITO (engine/bohemia_roster.js MEN_FOR, RUN TWO 10/26), so the
  screen never selects him and its first leg ('he STAYS in the line... the card opens on him') fails with nothing of this change
  in the path (no page error; the selection is by name). Owed to the roster's owner: match the hurt man by
  BohemiaCondition.canon. The real-demo proof of the card is the struck-down gate's phone shot.
- Shots: records/target/injury_card_before_11_3.png (the card as it was, the same man), records/target/injury_card_after_11_3.png
  (as it is), records/target/injury_card_after_three_knockdowns_phone_11_3.png (the crew card in the real demo, phone, after the
  third). tools/bohemia_injury_card_shots.js draws the first two.

[bb] Battle Brothers' permanent injuries are permanent stat cuts; ours keep the story (the scar on the face) and move the weight
to max hitpoints, a small roll on every fall that the card says before the next one (rule 303: felt, fair, seen first).
[analog horror] the card is a dented tin plate under a scan, the wound counted in dried-blood beads, no clean UI chrome.
