# ECONOMY -- ROUND 5: FIFTEEN NUMBERS ON THE SHOP CARD
# (ECONOMY lane, 9/5/26. MODE: RESEARCH -- nothing here is implemented.)
# Question Q5 [numberless economy], verbatim from VAMILY.md:
#   "An economy with no numbers on screen. How the best games show scarcity,
#    price and wealth without a spreadsheet. Against our one-number rule."
# NOTE ON THE WORD "DAY": this file is named DAY 5 for the machine's sake and
# because rounds 1-4 are named that way. A round is a VAMILY, not a calendar
# day, and it is never called a day to Paolo (NO CALENDAR TALK, 9/5, LOCKED).

## 0. THE HEADLINE

Day 17 of the BB study defended ONE NUMBER on the fight screen, and named the
threat precisely: *"The risk is not that we show too much today, it is that
somebody adds a SECOND number."*

Nobody was watching the shop door.

**THE MARKET CARD, RENDERED FROM THE REAL MODULES, CONTAINS FIFTEEN NUMBERS.**

```
SWAP MEET
08:00 · you have 3 batteries
WATER · 1 L      |  52.4 days of it left in the valley  |  1 battery
FOOD  · 1 ration |   8.6 days of it left in the valley  |  1 battery
MEDS  · 1 dose   |  33.3 days of it left in the valley  |  1 battery
FUEL  · 1 L      |  66.7 days of it left in the valley  |  1 battery
LEAVE
```
Fifteen: `08, 00, 3, 1, 52.4, 1, 1, 8.6, 1, 1, 33.3, 1, 1, 66.7, 1`. **Four of
them are decimals**, on a phone, in the shop of a game whose creator said
*"games like that are called spreadsheet simulators and I'm not a fan."*

And they are exactly backwards. **The four prices are all "1 battery"** --
identical, invariant, carrying no information at all, printed four times. **The
four days-left are decimals to one place**, which is the only varying data on the
card and the least readable form it could possibly take.

## 1. WHAT I MEASURED ON OUR OWN BUILD FIRST

### 1a. THE CARD, COMPOSED FROM THE REAL MODULES
Not read off the source and guessed at: I rebuilt the exact string
`showMarket()` composes, driving `bohemia_economy.js`, `bohemia_purse.js` and
`bohemia_payday.js` with a purse holding three batteries and the shipped ledger.
The block in section 0 is the output. Fifteen numbers, four decimals.

### 1b. THE GOOD NEWS FIRST, AND IT LANDED THIS ROUND
Another lane added `battWord()` while I was working:
```js
function battWord(n){ return n===1?'1 battery':(n+' batteries'); }
```
and rewrote the card so the tag and the till name the same money, with a comment
that says exactly why: *"A shop whose tag and till name different money is worse
than one with no prices at all."* That is right, and it is the first step of this
question already taken. **It names the unit. It still prints the digit.** Which is
the whole of section 3.

### 1c. THE SECOND SCREEN
`showReckoning()` adds roughly five more: the day count, hours lived, hours given
back where present, a step count, and the pay line. So the two screens a player
reads about the economy carry about **twenty numbers between them.**

### 1d. AND THE ONE-NUMBER RULE IS NOT BEING BROKEN, IT WAS NEVER POINTED HERE
BB-ONE-NUMBER is written entirely about the FIGHT readout: it defends
`"DARK / UNDER THE DECK / HE IS ABOVE YOU / ... / HE HITS YOU 62%"` as the world
in words with exactly one number, and it defines the number's job as **"how much
trouble am I in", a danger display rather than an efficiency display.** It is a
combat law. **The economy screens were never covered by it, and nobody noticed,
so the spreadsheet came in through the shop.**

### 1e. AN HONEST LIMIT ON WHAT I CAN PROPOSE
The market card is text-only HTML (`mrow` / `mgood` / `mprice`). **There is no
battery icon or item art anywhere in the build** -- `bohemia_battery.js` is a
district, and `battery` in `bohemia_utility.js` is a row of grain silos. So any
answer that says "draw the battery" is an art ask on COOK, not a free change, and
this record says so rather than pretending. The free answers are in section 5.

## 2. THE REAL AISLE: WHAT A HUMAN CAN ACTUALLY READ

### 2a. FOUR. THE ANSWER IS FOUR.
**Subitizing** is the rapid, accurate, effortless perception of small quantities:
**one to four items are judged instantly, precisely, and with high confidence,
with no counting and no arithmetic.** Above about four or five, that mechanism
stops, unless the items sit in a familiar pattern such as the dots on a die.

### 2b. AND ABOVE FOUR, YOU DO NOT PERCEIVE A QUANTITY AT ALL, ONLY A RATIO
Past the subitizing range the brain switches to a different system entirely:
estimation is approximate and error grows in proportion to the quantity, which is
Weber's law. The standard illustration is that anyone can feel that 3 is more than
2, or 12 more than 6, **but nobody can feel the difference between 12 and 15.**

Now read our card again. **"52.4 days" is not a feeling. It cannot be one.** No
perceptual system in the reader can distinguish it from 47.4, so the decimal is
not precision, it is noise wearing precision's clothes. Meanwhile "8.6 days"
against "52.4 days" IS readable, because that is a ratio of about six to one, and
ratios are exactly what the estimation system is for.

**THE RULE THIS GIVES US: a number below five can be shown as things and read
instantly. A number above five should be shown as a comparison, never as a digit.**

### 2c. AND HIS OWN LOCKED RULING IS ALREADY THE ANSWER TO HALF OF IT
EVERYTHING COSTS ONE (8/15). **One is inside the subitizing range.** A price of
one never needs a digit, because a single object is the fastest, most precise
thing a human visual system can read. His ruling is not just an anti-balance
device; **it is what makes a numberless price possible at all.** A game where
things cost 7 and 13 and 240 has no choice but to print digits. Ours does.

## 3. THE GAMES AISLE, IN PLAIN WORDS
(No game he has not named enters this record, the design, or the vocabulary.)
- The named category is **diegetic**: the information lives inside the fiction and
  has a physical presence, so the character can see it too, rather than floating
  over the screen for the player alone.
- The recurring mechanisms: **state shown on the object itself** rather than in a
  bar; **inventory as a physical space** you can see is full; **the body and the
  audio carrying the state** (breathing, a stumble, ambient noise) so attention
  stays in the world; and games that ship **no HUD at all**, moving nearly
  everything to sound.
- Measured, not asserted: studies of HUD versus no-HUD play report **a
  significant increase in immersion without the HUD.**
- The counter-lesson, which stops this becoming purity: the reason those
  interfaces work is not the absence of information, it is that the information
  moved to a channel the player was already looking at. **Removing a number and
  replacing it with nothing is not diegetic, it is just missing.**

## 4. *** THE FINDING THAT PROVES US WRONG ***

> **WE PRINT THE NUMBER THAT NEVER CHANGES AND WE PRINT A DECIMAL FOR THE ONE
> NOBODY CAN FEEL. THE FIFTEEN ARE NOT TOO MANY, THEY ARE BACKWARDS.**

The instinct on reading "fifteen numbers" is to cut to one. That is the wrong
correction and it would take the useful one out with the rest. Sorted by what
they do for a player:

```
"1 battery" x4   INVARIANT. Everything costs one, so this can never differ from
                 itself, and four copies of an unchanging fact is pure noise.
                 It is also ONE, which is subitizable, so it is the single
                 easiest number in the game to show without a digit.
"52.4 days" x4   THE ONLY REAL SIGNAL ON THE CARD, rendered in the least
                 readable form available: a decimal, above the subitizing range,
                 inside the part of perception that only handles ratios.
"3 batteries"    Your pocket. Subitizable while it is small, which it always is.
"08:00"          The clock, and it earns its place: the day is the pressure.
```
**So the correction is not fewer numbers. It is: the invariant one becomes an
object, the varying one becomes a comparison, and the clock stays.**

### 4b. AND THE SECOND FINDING, WHICH IS ABOUT THE LAW AND NOT THE CARD
BB-ONE-NUMBER is a **combat** law that reads like a **game-wide** one. Everybody
in this repo, including me until I read it this round, quotes it as "one number"
full stop. It is undefended outside the fight screen, and the measurement proves
what that costs: fifteen on the shop card, and not one person did anything wrong,
because no rule reached there. **A law that everyone quotes and only one screen
obeys is a law with a hole in it**, and the hole is exactly where the spreadsheet
he named walked in.

## 5. WHAT THIS ACTUALLY BUYS, IN ORDER OF CHEAPNESS
Mechanism only. Nothing here needs a ruling and the first two need no art.

1. **THE PRICE STOPS BEING A DIGIT.** "a battery" instead of "1 battery". One
   function, `battWord`, already exists and is already the only place this is
   composed. Removes four numbers and loses nothing, because the four were
   identical.
2. **DAYS BECOME A COMPARISON, NOT A DECIMAL.** The card already knows the number
   and already has a place for words: the note line under each good. Above five,
   people read ratios, so the honest form is the shape of the shelf, not its
   contents. **Removes four decimals and makes the only real signal readable.**
   Which words is WORDS' job, not this lane's.
3. **THE POCKET BECOMES THINGS, NOT A COUNT.** Subitizing means up to four
   batteries can be shown as batteries and read faster than "3 batteries" can be
   read as text. **This one costs art** (section 1e: there is no battery icon in
   the build) so it is a COOK ask, and it should follow 1 and 2, not lead them.
4. **THE CLOCK STAYS.** It is the pressure, it is one number, and day 17's rule
   is that one number is a reading.

That is fifteen down to two, with no information lost and no ruling asked for.

## 6. REFUSED
- **Cutting to zero numbers.** Section 3's counter-lesson: a removed number with
  nothing in its place is missing, not diegetic. The clock earns its place.
- **A bar, a meter, a gauge or a pie.** Day 7 and 7/26 both ban the meter, and a
  bar is a number wearing a costume.
- **Writing the replacement words.** WORDS owns the vocabulary; this lane
  measured the hole, it does not fill it.
- **Touching the fight readout.** BB-ONE-NUMBER is settled there and correct
  there. This record only observes that its scope is narrower than its reputation.
- **Deciding whether the reckoning card should stop saying "DAY N".** In-game
  fiction is not the same thing as talking to him, and that judgement belongs to
  UI and the coordinator, not to me.
- **Any implementation.** MODE: RESEARCH.

## 7. ROUTED
**UI**
- `ECON-THE-PRICE-IS-NOT-A-DIGIT` -- "a battery", not "1 battery". One function,
  four numbers gone, nothing lost. The cheapest item in five rounds of this lane.
- `ECON-DAYS-ARE-A-SHAPE-NOT-A-DECIMAL` -- the only real signal on the card is
  rendered in the one form no human can read. Above five, people read ratios.
- Feeds the existing `[one number]` BB-ONE-NUMBER row with the measurement: the
  law is undefended outside combat and the shop card has fifteen.

**COOK**
- `ECON-A-BATTERY-YOU-CAN-SEE` -- there is no battery icon anywhere in the build,
  and the money is batteries. Subitizing says up to four drawn batteries read
  faster than the text does. Follows the two UI rows, does not lead them.

**WORDS**
- `ECON-THE-WORDS-FOR-HOW-MUCH-IS-LEFT` -- the vocabulary that replaces four
  decimals. Their lane, their call, banked here as a need not a draft.

**SHARED**
- Rounds 1 to 4's row stands: a fixed price with no refusal is the restaurant
  that closed.

## 8. TEST MATERIAL
`banks/BOHEMIA_ECONOMY_TEST_LINES_9_5_26.md`, sections AA onward. All
`draft:true`, none of it in the game, and deliberately thin because the words
themselves are WORDS' job.

## 9. SOURCES
Number perception: Wikipedia, "Subitizing"; "Preattentive Processing of Numerical
Visual Information" (PMC); "Attentional Strategies and the Transition From
Subitizing to Estimation in Numerosity Perception", *Cognitive Science* (2023);
"Subitizing, unlike estimation, does not process sets in parallel" (PMC);
Neuroscience News on the two number systems and Weber-law scaling.
Interfaces: TV Tropes, "Diegetic Interface" (as a catalogue of mechanisms, not a
source of design); Game Developer, "User interface design in video games";
Wayline, "Beyond the HUD: The Power of Diegetic Interfaces in Game Design";
Ardeni, "Types of UI in Gaming: Diegetic, Non-Diegetic, Spatial and Meta";
IEEE study on HUD presence and player immersion.
Our own: BOHEMIA_BACKLOG.md BB-ONE-NUMBER (day 17) and
records/BOHEMIA_BB_STUDY_DAY_17_HOW_MUCH_DO_YOU_SHOW_8_28_26.md;
laws/BOHEMIA_ADDENDUM_EVERYTHING_COSTS_ONE_8_15_26.md;
laws/BOHEMIA_ADDENDUM_THREE_CURRENCIES_CENTURY_7_26_26.md.
