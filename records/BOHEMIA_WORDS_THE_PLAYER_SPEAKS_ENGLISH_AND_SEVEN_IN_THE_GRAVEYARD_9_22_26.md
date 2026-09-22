# WORDS -- THE PLAYER SPEAKS ENGLISH, AND SEVEN OF MINE GO IN THE GRAVEYARD
# VAMILY round, 9/22/26, lane WORDS (words-8dqrnq). Row [player speaks english].
# He voted. This round obeys the verdicts and builds the machine that keeps one of them.

## HE KILLED SEVEN OF THIS LANE'S NINE, AND HE WAS RIGHT ABOUT THE FORM
    words-the-twelve-get-an-end-9-24   DOWN  "Idk what i was reading wtf"
    words-the-loading-screen-9-23      DOWN  (no comment)
    words-a-mouth-not-a-narrator-9-22  DOWN  "The UI of this is all buggy. I can't even
                                              like understand what's going on. Reshow me better"
    words-the-first-ask-spoken-9-21    DOWN  "Boring asf"
    words-the-phone-notice-9-21        DOWN  "Boring asf"
    words-what-the-tracks-say-9-15     DOWN  "What makes you think writing a storytime about
                                              this would be a good idea rather than actually
                                              making pixel art of footsteps"
    words-the-night-card-9-15          DOWN  "I don't wanna fucking card at the end of the day
                                              I never ever ever fucking told you that bro"
    words-saying-yes-to-a-job-9-15     UP    "Chill with the spanglish bro"
    words-who-you-owe-headings-9-15    UP

**THE POST-MORTEM IS ONE SENTENCE AND IT IS NOT ABOUT THE WORDS. IT IS THE FORM.**
Seven items in a row were WALLS OF TEXT IN A VOTING TAB. No picture, no sound, nothing
moving. He said "boring asf" twice, "idk what I was reading" once, and about the eighth
one he said he could not even see what he was looking at. **A lane whose job is words
kept handing him homework and calling it a thing to judge.** His rule 29 says it back to
me in his own words: text items are boring, make the pixels, make the sound, the thing
is the item.

**THIS IS A STOP PRODUCING MOMENT AND I AM TREATING IT AS ONE.** The law says a second
rejection ends the feature for the session and green gates are never an argument. This
is seven rejections in one sitting. So this round registers NO new text item, writes no
new set of lines for the tab, and does the two things the verdicts actually ask for.

**WHAT DOES NOT DIE:** the writing itself. He approved the register out loud on 9/22
("impressed with the speech and how people are writing, it's come a long way") and the
lines are still in the bank. What died is showing them to him as text on a card. The
mouth-not-a-narrator set comes back inside a real speech bubble on the glass, under a
new id, which is the coordinator's row and PEOPLE's surface.

## WHAT GOT BUILT: RULE 27 NOW HAS A MACHINE
"Some characters might speak Spanglish to you, doesn't mean you will."

**I MEASURED BEFORE I WROTE ANYTHING, and half the row's premise was already true.**
913 choice and asking lines in the words book carry ZERO Spanish, and the gate's
existing sweep already holds every quest choice to English. Stripping Spanish from the
player's quest lines was work that was already done.

**THE REAL GAP IS THE PLAYER'S LINES THAT ARE NOT QUEST CHOICES**, and nothing swept
them: the terms he proposes when he argues a price, and the buttons he taps. The
Spanglish that earned this ruling was in a set this lane proposed for exactly that slot,
"YO VOY" as a way to take a job, and he corrected that row by name while voting it up.

So the language gate gains the leg:

    ok  the terms the player proposes were found to sweep    7 strings
    ok  the buttons the player taps were found to sweep      6 labels
    ok  *** NOT ONE STRING CARRYING REQUIRED INFORMATION IS NON-ENGLISH ***
        982 strings swept, 0 Spanish
    GREEN  85 passed, 0 failed

**MUTATION-TESTED, because a check that cannot fail is decoration.** I put "YO VOY
ahora" on the take-the-job button and ran it:

    FAIL  *** NOT ONE STRING CARRYING REQUIRED INFORMATION IS NON-ENGLISH ***
          city: a button he taps  "YO VOY ahora"  <- YO,VOY
    RED  84 passed, 1 failed

It names the offending words. Restored after.

**REUSE-FIRST, AND THIS LANE HAS LEARNED IT THE HARD WAY THREE TIMES.** The leg calls
the engine's own `esWordsIn` through the same list the rest of the check already walks.
No fourth hand-rolled Spanish regex. The three earlier ones all produced false numbers.

**AND MY FIRST CUT OF THE LEG WAS WRONG AND THE GATE CAUGHT IT IN ONE RUN.** My button
pattern was `>([^<]{2,60})<`, which matches across JavaScript because `>` and `<` are
operators, so it pulled `0 && BohemiaHaggle.say(t)) || o.paysSay;` out of a source line
and called it a button. A label is not any text between two angle brackets. Fixed to
require the capture to look like words, and the comment in the gate says why so the next
person does not repeat it.

## AND THE ONE LINE HE CORRECTED IS DEAD BY NAME
`YO VOY` is out of the bank, replaced with `COUNT ME IN`. The note beside it carries his
words so nobody puts it back.

## ROUTED
- **PEOPLE and whoever owns the speech bubble** "reshow me better" is not a kill of the
  twelve lines, it is a kill of showing them as text. They come back inside the bubble
  on the glass under a new id, which is the coordinator's row.
- **COOK** his ruling on the tracks item is yours: "pixel art of footsteps that lead you
  to the conclusion, not a storytime." That was this lane writing prose where a picture
  was the answer. Nothing of mine is waiting on it.
- **RUN** the night card is dead by his words ("I don't wanna a card at the end of the
  day, I never ever told you that"). The words for it are in the bank and should stay
  there until something that is not a card wants them.
- **WORDS, standing, and it is the lesson of the round** this lane registers no text-only
  item again. Words ride inside a thing he can see or hear. If there is no such thing
  yet, the round's cook is a machine, like this one, and not a page of lines.

## SOURCES
- `records/target/BOHEMIA_VOTE_REGISTRY.json`, 83 verdicts, read this round; the nine
  that are this lane's are quoted above verbatim.
- `laws/BOHEMIA_ADDENDUM_THE_FIRST_VOTES_9_22_26.md` s4 and s6, rules 27 and 29.
- `gates/language_gate.js`, the new leg and the mutation run.
- `records/BOHEMIA_WORDS_BOOK.json`: 913 choice and asking lines, swept with the
  engine's own detector.
