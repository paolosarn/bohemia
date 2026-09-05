# ECONOMY -- DAY 4: THE FIRST BUILDING A PLAYER PLACES IS AN AIRBASE
# (ECONOMY lane, 9/5/26. MODE: RESEARCH -- nothing here is implemented.)
# Question Q4 [first building], verbatim from VAMILY.md:
#   "Placing a building that feels good in the first hour. What the best
#    builder games ever made do in the first ten minutes of building, and what
#    makes a placed building feel like it did something."
# Day 1 [money dies] / Day 2 [money returns] / Day 3 [rebuild order] precede this.

## 0. THE HEADLINE

Tap an empty plot in the CITY tab. You get a dropdown of **59 district types in
alphabetical order**, with no default, no grouping and no placeholder. The
browser selects the first one for you. Press BUILD.

**THE FIRST BUILDING A PLAYER PLACES IN BOHEMIA IS AN AIRBASE.**

It costs nothing, it makes no sound, it takes no time, and the only thing that
changes is the colour of one tile.

And the research says the instant part is the worst part, which is the opposite
of what anybody would guess: **the measured value of a thing you build comes from
COMPLETING it, and an instant build has no completion to feel.**

## 1. WHAT I MEASURED ON OUR OWN BUILD FIRST

### 1a. THE ENTIRE CONSEQUENCE OF PLACING A BUILDING
```js
function CBafterEdit(){
  CBpersist();                        // write the delta to localStorage
  try{metaCache.clear();}catch(e){}   // drop two caches
  try{chunkCache.clear();}catch(e){}
  CBpanel(); render();                // redraw
}
```
That is all of it. Measured across the whole build path:
```
purse touched .................... 0   it is free
sound fired ...................... 0   it is silent
time advanced .................... 0   it is instant
people who react ................. 0
```
**INSTRUMENT NOTE, because this one nearly became a false finding:** my first
sweep for a sound in the build path returned 3 hits and I nearly wrote "it plays
something". All three were the word **`display`**, which contains "play". A grep
for `play` matches `display`. I looked at the three lines instead of trusting the
count.

### 1b. THE FIRST CHOICE IS A 59-ITEM ALPHABETICAL DROPDOWN
```js
html += '<select id="cbtype"></select><button id="cbbuild">BUILD</button>...'
CE.buildableTypes(OM.DISTRICT).forEach(function(t){
  const o=document.createElement('option'); o.value=t; o.textContent=t.toUpperCase();
  ty.appendChild(o); });
```
`buildableTypes` returns `.sort()`, so the list is alphabetical and the first
entry is **`airbase`**. There is no placeholder option, no "pick one", no
category, and no default. A player who taps BUILD without opening the dropdown
builds an airbase, and the next four in the list are `airport`, `apartment`,
`arsenal`, `ballpark`.

Day 3 measured that there is no ORDER to the 59. Day 4 measures the sharper
version: **there is no FIRST.**

### 1c. WE COOKED THE SOUND FOR THE PAINFUL VERB AND NOT THE GOOD ONE
```
approved sound ids in the banks ......................... 65
named as an event by the walked city .................... 5
   come_up, door_drag, phone_buzz, sleep_sink, went_down
   (footsteps ride a separate channel, BOHEMIA_STEP, six surfaces)

demolish     approved: YES   reachable from the walked city: NO
power_on     approved: YES   reachable: NO
sign_alive   approved: YES   reachable: NO
set_down     approved: YES   reachable: NO
generator    approved: YES   reachable: NO
```
**There is an approved DEMOLISH sound and there is no build sound at all.** And
`power_on` and `sign_alive` are approved, unused, and are literally the sound of
a thing coming to life. Section 2b explains why having the destructive sound and
not the constructive one is worse than having neither.

### 1d. WHO IS ALREADY WORKING ON THIS
LIFE + CITY holds `[buildings produce]` PRODUCTION-TICK as a CLAIMED job right
now, and shipped `[builder works]` BUILDER-ON-A-PHONE earlier today. **This
record is written to feed that lane, not to duplicate it.** Everything below is
about what a placement FEELS like, not about what it yields.

## 2. THE REAL AISLE

### 2a. LABOUR LEADS TO LOVE, AND ONLY IF YOU FINISH
Across four studies where people assembled flat-pack boxes, folded origami and
built Lego, self-assembly raised what people would pay by about **63%** over the
same object pre-assembled. Builders valued their own amateur results as highly as
experts' work, and expected everyone else to agree.

**The boundary condition is the finding for us, and it is unambiguous: the effect
appears only when the labour ENDS IN COMPLETION.** Participants who built and
then destroyed their creation, or who did not finish, showed no effect at all.
It also holds for novices, not just people who enjoy DIY.

**So value is not created by choosing. It is created by finishing.** Our build is
instant, which means there is nothing to finish, which means by this measure it
generates no attachment at all. **The convenience is the bug.**

### 2b. SMALL WINS ARE THE MOTOR, AND SETBACKS HIT TWO TO THREE TIMES HARDER
Nearly **12,000 daily diary entries from 238 people across 7 companies**. Of
everything that happens on a good day, one thing beat all the rest: **making
progress on meaningful work.** Small wins turned out nearly as powerful as
breakthroughs. And the asymmetry: **the negative effect of setbacks is two to
three times stronger than the positive effect of progress.**

Now read 1c again. We have an approved sound for the setback (`demolish`) and
none for the win. If both were reachable tomorrow, the losses in this game would
be two to three times louder than the gains **and** the only one with a sound
would be the loss. That is not a balance problem, it is an accident, and it is
the cheapest thing in this record to get right.

### 2c. WHAT DAY 3 ALREADY ESTABLISHED, AND IT CONSTRAINS THE ANSWER
The real order of rebuilding puts permission, a market day and an anchor before
production. So the first satisfying placement cannot be justified by output,
because in the real record output comes fourth. **The first building has to feel
like something for a reason that is not a yield.**

## 3. THE GAMES AISLE, IN PLAIN WORDS
(No game he has not named enters this record, the design, or the vocabulary. His
set is Rogue Fable 4, Battle Brothers and Final Fantasy XII.)

- **Feedback is deliberately exaggerated.** The standing practice is bold colour,
  over-the-top animation and obvious cues, because feedback that is proportionate
  reads as no feedback at all.
- **Responsiveness plus readability, and the polish layer is what makes both
  land.** The named goal is to shorten the distance from intent, to input, to
  action, to feedback, and then to over-serve the last step.
- **Sound is described as half the experience**, with every hover, selection and
  confirmation carrying its own tactile sound. We fire five named sounds on the
  whole walked surface.
- **The satisfying placement is a chain the player can see**: the thing you put
  down changes the thing next to it, and you find out within a second or two.
- **Gentler openings win.** The reliable onboarding move is fewer needs and
  clearer chains at the start, not more options.

**Against a 59-item alphabetical dropdown, every one of those is a gap.**

## 4. *** THE FINDING THAT PROVES US WRONG ***

> **WE MADE BUILDING INSTANT TO BE KIND, AND INSTANT IS WHY IT FEELS LIKE
> NOTHING. THE FEELING IS MANUFACTURED BY THE FINISHING, NOT BY THE CHOOSING.**

Every instinct says a builder on a phone should place immediately with no
waiting. The measured psychology says the opposite: the 63% premium exists
**only** where the labour completed, and vanishes entirely where it did not. An
instant placement is a purchase, not a build. **You did not make anything; you
picked item one of fifty-nine and it appeared.**

This does not mean adding a timer, which would be a chore. It means the placement
needs **a beginning, a visible middle, and an end that arrives** -- and at 120 BPM
we already own the clock to hang it on. A build that starts on a tap, shows a
frame or two of becoming, and **lands its completion on a downbeat** is finishing,
in about a second and a half at 120 BPM, without ever being a wait.

### 4b. AND THE SECOND, SMALLER ONE
A dropdown sorted alphabetically is not a neutral presentation. **It is a
recommendation**, and ours recommends an airbase to a man standing in a dead
suburb. Day 3's routed row said the order should come from need, not from a
lock. This is the same row's cheapest half: **the list should not open on `A`.**

## 5. SO WHAT MAKES A PLACED BUILDING FEEL LIKE IT DID SOMETHING
Both aisles agree on four things, and Bohemia already owns all four:

1. **IT FINISHES.** A visible beginning and an end that lands on the beat. The
   completion is where the value is made.
2. **IT MAKES A NOISE WHEN IT DOES.** `power_on` and `sign_alive` are approved,
   cooked, and unreachable. They are the sound of a thing coming to life.
3. **SOMETHING NEARBY CHANGES WITHIN A SECOND.** Not a number. The block it sits
   on.
4. **IT IS A SMALL WIN, NOT A BIG ONE.** Small wins measured nearly as strong as
   breakthroughs, so the first building does not need to be important. It needs
   to be finished, audible, and visible.

**AND THE BOHEMIA-SPECIFIC ANSWER, WHICH COSTS NOTHING AND IS ALREADY CANON: THE
FIRST BUILDING TURNS A LIGHT ON.** LIGHT IS TERRITORY. The valley is 12% lit. Day
2 established that charge is the money and that a dark block is the reason
anybody wants a battery, in his writers' own words: *"My block's been dark since
the weekend."* A placed building that lights its lot is:
- visible instantly, at night, from a distance, in the game's existing language,
- audible with an approved sound nobody has ever heard,
- legible with no number, no panel and no tutorial (day 17's rule holds),
- and it is **territory**, which means the first building is also the first claim.

No new art. No new sound. No new number. No ruling from him.

## 6. REFUSED
- **A build timer you wait out.** The finding is completion, not duration. A wait
  is a chore and day 7 already ruled against chores.
- **A tutorial, a tooltip or an arrow.** Day 14's cold hand says the loudest
  control must work; the fix is the control, not a label on it.
- **Numbers, meters, or a satisfaction score on a building.** Banned by 7/26 and
  by day 17.
- **Cooking a new build sound.** Fifty-one of sixty-five approved sounds are
  already unreachable. Recording more while the approved ones cannot play is the
  shape day 22 refused, and it was right.
- **Choosing which building is the good first one.** Mechanism is mine, contents
  are his.
- **Any implementation.** MODE: RESEARCH.

## 7. ROUTED

**LIFE + CITY** (holds the builder; this is their lane)
- `ECON-A-BUILD-FINISHES` -- the placement gets a beginning, a visible middle and
  a completion that lands on a downbeat. About a second and a half at 120 BPM,
  never a wait. This is the day's finding.
- `ECON-THE-FIRST-BUILDING-TURNS-A-LIGHT-ON` -- the cheapest "it did something" in
  the build, in the game's own territory language, with zero new assets.
- `ECON-THE-LIST-DOES-NOT-OPEN-ON-A` -- 59 alphabetical options with no default
  recommend an airbase. Half of day 3's need-not-a-lock row.

**SOUNDS**
- `ECON-THE-GOOD-VERB-GETS-THE-SOUND` -- `power_on`, `sign_alive`, `set_down`,
  `generator` and `demolish` are all approved and all unreachable from the walked
  city. Setbacks already hit two to three times harder than wins; shipping the
  loss sound first would make that worse. Rides with the existing THE-OTHER-51.

**WORLD**
- Feeds `ECON-A-SCHOOL-MAKES-PEOPLE-STAY` from day 3: the reason a first building
  feels good cannot be its yield, because in the real record yield comes fourth.

**SHARED**
- Day 1, 2 and 3's row stands: a fixed price with no refusal is the restaurant
  that closed.

## 8. TEST MATERIAL
`banks/BOHEMIA_ECONOMY_TEST_LINES_9_5_26.md`, sections V onward. All
`draft:true`, none of it in the game.

## 9. SOURCES
IKEA effect: Norton, Mochon and Ariely, "The IKEA effect: When labor leads to
love", *Journal of Consumer Psychology* (2012); Harvard DASH and SSRN copies;
Wikipedia, "IKEA effect".
Progress principle: Amabile and Kramer, *The Progress Principle: Using Small Wins
to Ignite Joy, Engagement, and Creativity at Work*; Amabile and Kramer, "The
Power of Small Wins", *Harvard Business Review* (May 2011); Harvard Business
School Working Knowledge, "How Small Wins Unleash Creativity".
Game feel: Steve Swink, *Game Feel*; gamedesignskills.com, "Game Feel: A
Beginner's Guide"; GameAnalytics, "Squeezing more juice out of your game design";
"Designing Game Feel: A Survey" (arXiv); "What Features Influence Impact Feel? A
Study of Impact Feedback in Action Games" (arXiv).
City builders: Game Foundry on production chains and on builder onboarding;
Radical Elements, "The Future of City-Building Games".
