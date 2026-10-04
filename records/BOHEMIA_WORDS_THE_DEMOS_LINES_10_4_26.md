# WORDS [the demo's lines] -- ONE ROUND (words-8dqrnq, 10/4/26). Rule 54b, MODE: DEMO ONLY.
Every line a stranger meets in the demo, read aloud in the order of meeting. draft:true stays
on everything until he plays. THIS FILE IS THE DELIVERABLE: it does not edit RUN's or
COMBAT's own files (ONE SYSTEM, ONE SESSION, rule 55); RUN reads this and applies what it
wants.

## WHAT I READ, AND WHERE
- slices/BOHEMIA_DEMO.html: the front door (ONE MOMENT / BEGIN / CONTINUE DAY N), the boot
  log (READING THE VALLEY...), the front door's three cards (THE FIGHTS, THE SHELVES, WHO YOU
  WERE x15, YOUR CREW'S NAME).
- slices/BOHEMIA_SETTLEMENT_SCREEN.html: every building's mouth (the hall, the board, the
  stall, the barber, the bar, the clinic, the yard, the lot) and their short labels.
- slices/BOHEMIA_FIGHT.html: the recap screen (THE ROAD CREW BROKE / YOUR CREW IS DOWN, the
  stats table, LAID UP Nd), the in-fight prompts (say()), the feed (never shown, see below).

## THE SIX REAL FIXES
Each is a before/after. Nothing else in the demo needed a change; the rest already reads
plain, short, in the game's own voice, and Spanglish stays with the people who speak it
(the barber, the stall, the bar, the clinic, the hall, the board all speak it; the player's
own buttons never do, checked line by line).

1. SETTLEMENT, THE CLINIC's short label (B.clinic.short).
   BEFORE: "cuts wound days"
   AFTER:  "heals faster"
   WHY: "cuts wound days" reads as a typo or a threat before it reads as a mechanic. "heals
   faster" says the same true thing (half the days, per the clinic's own line) in words a
   stranger gets on the first pass.

2. SETTLEMENT, THE CLINIC's action button label.
   BEFORE: "Pay to cut the wound days"
   AFTER:  "Heal faster"
   WHY: same fix, and it drops the redundant "Pay to" -- every other button in this screen
   shows its price separately ("1 battery" to the right of the label); this was the only one
   that said "pay" twice.

3. START SCREEN, origin THE WATER TRUCK's line.
   BEFORE: "Two drivers and a tank. People pay more to the truck."
   AFTER:  "Two drivers and a tank. The water gets more respect than you do."
   WHY: "pay more to the truck" does not parse on a first read (pay who? more than what?).
   The new line keeps the same idea, a stranger values the water over the person carrying it,
   in a sentence that resolves on one pass.

4. START SCREEN, origin THE BLOCK WATCH's line.
   BEFORE: "Ten neighbours with pipes. Nobody brings a small crew at you."
   AFTER:  "Ten neighbours with pipes. Nobody brings a small crew against you."
   WHY: plain grammar fix; "at you" where English wants "against you" reads as a typo, not a
   voice choice.

5. FIGHT RECAP, the laid-up state (showOver's state string).
   BEFORE: "LAID UP 14D" (a number jammed against a bare letter)
   AFTER:  "LAID UP 14 DAYS"
   WHY: a number touching one unspaced letter reads as a typo before it reads as a unit. The
   word costs four characters and removes all doubt.

6. FIGHT RECAP, the win header (showOver's result title).
   BEFORE: "THE ROAD CREW BROKE"
   AFTER:  "THE ROAD CREW RAN"
   WHY: this is the ONE line in the whole sweep where cutting it plain costs something, so
   it is flagged rather than just changed quietly. "Broke" is Battle Brothers' own word for a
   routed enemy (rule 63: recreate their rules exactly), but a stranger who just won a fight
   and sees "THE ROAD CREW BROKE" can read it as HIS crew breaking, which is the opposite of
   what happened, on the one screen where that misread costs the most (the end of the fight).
   "Ran" keeps the same fact (the enemy fled, not died) and the same voice, and cannot be
   misread as the player's own crew failing.

## WHAT I CHECKED AND FOUND NOTHING TO REWRITE, SO IT IS SAID ONCE, NOT INVENTED
- "THE MAP'S PHONE POSTS": no phone-post surface is wired into this demo cut. The city feed
  law (THE FEED ON THE CITY SCREEN) has no renderer in slices/BOHEMIA_DEMO.html or the
  settlement screen; the only on-phone text that exists is the settlement's own heard() line
  ("On your phone: {title}.", "The face maker opens.", etc.), already checked above and
  already plain. NOT IN A TAB YET; nothing here for me to rewrite until it is built.
- "THE FIGHT'S THREE-LINE FEED": exists in code (UI.feedLines, the last 50 events) but its
  own comment says it plainly: "the fight's words are kept, never shown on the screen (rule
  67: no combat log); the recap is where they land." It is not visible to a stranger right
  now, so there is nothing to read back. If it is ever drawn on screen, the attack-line
  template ("{name} hits {name} in the head, -{n} health ({pct}%)") is already plain and
  needs no change when that day comes.
- "THE END SCREEN'S THANKS": no end-of-demo thanks screen exists yet in either file. Not
  built; nothing to review.

## EVERYTHING ELSE I READ AND LEFT ALONE (so the record shows the sweep happened)
The front door: ONE MOMENT, BEGIN, CONTINUE . DAY N -- already the fewest possible words. The
boot log (READING THE VALLEY, COUNTING WHAT STILL STANDS, WINDING THE CLOCK, CHECKING STREETS
FOR LIGHT, PUTTING PEOPLE ON IT) -- already plain and already this lane's own established
voice (reused, not touched). THE FIGHTS (NEW HERE / SEEN IT / OUTLIVED IT) and THE SHELVES
(FULL / THIN / BARE SHELVES) -- short, clear, genre-standard difficulty pickers. The other 13
of 15 origin lines -- each one sentence, plain, no jargon. YOUR CREW'S NAME (ten names) --
short, evocative, no fix needed. Every other building's mouth at the settlement (the hall,
the board including its two contract offers shown, the stall's four goods, the barber, the
bar's four rumours, the yard) -- read individually above, none needed a change. The fight's
in-combat prompts (say()): "Put away.", "Tap the friend to swap places with.", "Tap the man
to call over.", "Tap the tile to step to. No free swing.", "Not there." -- already short and
already clear.

## ADDED MID-ROUND: THE THREE FOOD LINES (coordinator sweep P, GROK_69/GROK_76, his picks)
Read back the same way as everything else above:
- SpaghettiOh: "The Os fused into one ring." Clear, short, no fix.
- Hardtack: "This hardtack will give you a heart attack." Clear, rhymes on purpose, no fix.
- Truffle: "It says truffle so it has to be good." Clear, dry joke lands on one read, no fix.
All three already pass the same test the rest of this file used: plain, short, in the
game's own voice. Not wired into either demo file yet (they are in reference/library/grok/,
unverified-source food flavour text); when they land in a real screen, nothing here needs to
change.

## RULE 27 SWEEP
Every player-facing button and label across all three files is English. Spanglish appears
only in NPC mouths (mijo, gracias, pues, ya sabes, compa, bueno), consistent with the people
who speak it, never the player. No line found that the player speaks in Spanglish.

## NOTHING THAT PROMISES AN UNBUILT RULE
Checked each contract, building and origin line against what the game actually does right
now (the board's two-slot cap, the clinic's real debit, the yard's real debit, the barber's
real visit() call, the lot's real scavenge()) -- nothing promises a mechanic that is not
wired. The one soft spot, "swap a mastery" (THE YARD), posts an event and debits a battery
but the actual respec is TUNING's [respec] row, not yet built; the LINE itself never claims
more than "Done. Three days on the yard and it sticks," which is true of what this screen
does today, so it is left as is -- flagged here for whoever wires the real respec, not a
words problem.
