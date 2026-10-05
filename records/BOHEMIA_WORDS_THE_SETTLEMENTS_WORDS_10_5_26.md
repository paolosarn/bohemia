# WORDS [the settlement's words] -- ONE ROUND (words-8dqrnq, 10/5/26). Rule 54b.
Every word on RUN TWO's settlement screen, read aloud. THIS FILE IS THE DELIVERABLE: it does
not edit RUN TWO's own file (ONE SYSTEM, ONE SESSION, rule 55); RUN TWO reads this and
applies what it wants.

## THE BIGGEST FIND IS NOT A WORDING PROBLEM, IT IS A WRONG NUMBER
slices/BOHEMIA_SETTLEMENT_SCREEN.html line 491: a contract's pay prints as
`o.pay + ' batt'`. The comment two lines above it (line 252) says the pay numbers (30, 60,
90) are CROWNS, priced at ten crowns to one battery, same as the market. So a one-skull job
that actually pays 3 batteries shows the player "30 batt" on the board, ten times the real
number. This is not a plain-language fix, it is a missing `/10`; flagged here because
reading every line is how it surfaced, but it is COMBAT's/RUN TWO's own conversion to fix,
not a words change. The same fix that already exists in this file, `priceOf()`, is the one
to call.

## ONE REAL WORDS FIX: A LINE THAT PROMISES A RULE THAT IS NOT BUILT
The sledge's (hammer class) one-line card says "Breaks armour and doors." Checked
records/target/bb/weapons.json's own hammer skills (Batter, Destroy Armor, Demolish Armor,
Smite, Shatter, Split Shield): not one of them touches a door, and nothing in
slices/BOHEMIA_FIGHT.html destroys cover or doors at all. "And doors" promises a mechanic
that does not exist, which rule 54b's own brief says not to do.
BEFORE: "Breaks armour and doors."
AFTER:  "Breaks armour like nothing else."
WHY: keeps the one thing that IS true and sourced (hammers average 184% armour damage, the
highest of any class, measured two rounds ago for the perk sweep), drops the claim the game
cannot back up.

## THE GROK FOOD LINES: STILL NOT IN, TWO ROUNDS RUNNING
Checked again: the STALL array (line 267) still sells "A ration of food," "Water, four
litres," "A dose of meds," "Six rounds" -- the same generic placeholders from before Grok's
three food lines were ever reviewed (reference/library/grok/GROK_69_INVENTORY_2026_10_02.md,
GROK_76_SPAGHETTIO_2026_10_02.md, both passed filter). Those three lines were checked for
plainness twice now and found clean both times; what was missing both times was somewhere
for them to go. PROPOSED, reusing a pattern already in this same file rather than inventing a
new one: the bar's RUMOURS array rotates one line per visit (`RUMOURS[S.rumour++ %
RUMOURS.length]`); the stall's food label can do the same thing with its own counter, so one
visit gets SpaghettiOh and the next gets hardtack, instead of forcing a single line to carry
all three or losing two of them:

    var FOOD_FLAVOR = [
      'SpaghettiOh. The Os fused into one ring.',
      'Hardtack. This will give you a heart attack.',
      'Truffle. It says truffle so it has to be good.'
    ];
    // label: FOOD_FLAVOR[S.food++ % FOOD_FLAVOR.length]  -- same shape as S.rumour

This is a one-line mechanism change (a counter, same as S.rumour already is), not a rewrite
of the shop; named here because it is the only way the three already-approved lines ever
reach the player, and two rounds of "already clean, no fix" would otherwise sit unused a
third time.

## TWO THINGS THE BRIEF NAMED THAT ARE NOT BUILT YET, SAID ONCE NOT INVENTED
- "THE DISTANCE AS A WALK, NOT A NUMBER": the OFFERS array (contracts) has no distance field
  at all right now, walked or numeric. Nothing to rewrite until a distance exists to word.
- "THE KEEPER'S TRAIT LINE": grep for "trait" in the settlement file finds nothing; rule 71's
  [settlement traits] row is still open on COMBAT TWO's/RUN TWO's own board. Nothing to
  rewrite until a trait exists to carry a line.

## EVERYTHING ELSE, READ AND LEFT ALONE
The three new market keepers' hello lines (Toño: "Guns and plate, whatever made it through.
Everything has a price, mijo." / the smith: "Fixed, sharpened, loaded. Pick one." / the
armourer: "If it stops a pipe, I sell it.") are already short, clear, and in voice. The buy
and sell lines ("Yours. It goes on whoever you hand it to." / "I give you {n} for it. That is
fair." / "You are short. {price}, and you have {bats}.") are already clear. The other six
buildings' mouths (hall, board's offer lines, stall's own speak lines, barber, bar, clinic,
yard), all checked last round and unchanged since, still read plain. The other twelve weapon
one-liners (pistol, pipe, rifle, shotgun, bottles, machete, rebar spear, cleaver, chain, pole
hook, compound bow) were checked against their real Battle Brothers skill data (Split Shield
for the fire axe, Shatter/Overwhelm-style reach for the pole hook, the flail's real
shield-ignoring mechanic for the chain) and all of them are accurate and plain; only the
sledge's line overclaimed.

## RULE 27 AND THE UNBUILT-RULE CHECK
Every player-facing button and label (buy, sell, not this one, sell your X) is English; every
NPC mouth that speaks Spanglish is a person, never the player, unchanged from the last two
sweeps of this file. Besides the sledge line above, nothing else promises a rule that is not
built.
