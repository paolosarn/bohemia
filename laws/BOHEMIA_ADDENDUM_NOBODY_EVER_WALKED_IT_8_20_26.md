# BOHEMIA ADDENDUM — NOBODY EVER WALKED IT (8/20/26, FACTIONS lane, LOCKED)

## 1. NINE GATES, EVERY ONE GREEN, FOUR TIMES BROKEN

The faction stack has nine gates. Every one of them verifies a **layer**: the
organ clamps, the card displays, the rule derives, the save round-trips. Every one
was green while the stack was broken:

| when | what was broken | what the gates said |
|---|---|---|
| 8/15 | `factionOf` was not a function on the city's stale snapshot — **zero of 166 people ran with anybody, for thirteen days** | all green |
| 8/18 | `BohemiaCommitment.give()` — the wall — was called **zero times** on the walked surface; nine presses reached 9 against a ceiling of 5 | all green |
| 8/18 | the favour opened an account and **nothing ever collected it** | all green |
| 8/19 | `burned` said *"you cost yourself somewhere else to be here"* and **nothing anywhere cost you anything anywhere else** | all green |

**THE ORGAN WAS VERIFIED AND THE WIRING WAS NOT, four times.** And each time, the
thing that found it was a person driving the real card by hand.

> **NO CLAIM ANYWHERE PLAYED THE ARC.**

Every gate asked *"is my layer right?"*. Not one asked *"can somebody actually
walk from meeting a stranger to being inside an outfit?"*

## 2. THE LAW

**A STACK OF VERIFIED LAYERS IS NOT A VERIFIED JOURNEY.** Any system a player
moves *through* — a sequence of states, not a single answer — needs one claim that
travels the whole distance, in order, through the controls the player actually
presses, asserting that **every step moves something**.

A step that leaves the save untouched is the whole disease. That is what all four
failures above were, and a walk finds them all.

## 3. AND WALKING IT FOUND TWO THINGS ON THE FIRST TRY

**ONE — THE CARD STAYED OPEN ON SOMEBODY WHO WAS NO LONGER THERE.**

`ctVerb()` runs on **every render** and early-returns the moment a card is open,
so it manages the TALK button and never once asks whether the person whose card is
up is still next to you. The card was opened by TALK and closed **only** by GO.

So you could **walk the entire valley with somebody's card up and their buttons
live.** And it is worse on a day rollover, because waking up moves the *player*:

```
day 1   me [10246,2268]   them [10245,2268]   adjacent TRUE
day 2   me [10293,2248]   them [10245,2268]   adjacent FALSE   card still VISIBLE
```

They stay where they live. You wake up somewhere else. The card stays.

**Same family as the 8/18 wall: a control on screen that does not do what the
screen says it does.** There the button could not move anything. Here it moved
**the wrong person's standing.**

Fixed in the one place that already runs on movement — no new hook, no new
listener — and in `ctOpen()`, which used to `return` where it should have closed.

**TWO — TURNING UP IS ONCE A DAY, AND THAT IS THE DESIGN.** *"YOU ALREADY DID
TODAY. COME BACK TOMORROW."* You cannot buy your way in by pressing a button. So
the walk **sleeps, and goes back to find them** — because that is what playing is.
A gate that hammers a single day is testing a game nobody plays.

## 4. TWO THINGS THE GATE ADMITS ABOUT ITSELF

**IT CANNOT TELL THE CLAMP FROM THE BUTTON.** B5 asserts the climb stops at the
ceiling, and **two** independent mechanisms enforce that — the clamp in
`ctGiveCapped`, and the act button being withdrawn at the wall. Remove either one
alone and the climb still stops in the right place. So the mutation that was
actually run removes **both** (the exact 8/18 bug), and it reds B5 and B8.

The clamp on its own is proved by `commitment_gate` **Ez6**, which presses the
writer with no button in the way. **An arc gate tests the journey; it is not a
substitute for the mechanism gates**, and writing that down is cheaper than
somebody rediscovering it.

**AND ITS OWN FIRST DRAFT HAD THE THREE-SPELLINGS BUG.** The probe read
`sv.meta.owed[fid]` directly and reported **0** while the real debt was **6**.
Seventh time in this lane, written by the person who fixed the other six.
Accessors exist because the key has one spelling and it is not the display name.

## 4b. AND THEN WALKING THE OTHER ECONOMIES FOUND A THIRD ONE

The arc first walked with the **Cartel** — `they-give-first`, `wants:debt`. That
is **4 of 16** outfits. The other twelve had never been driven at all.

Walking a `you-give-first` outfit found this, on a real Colorful member:

```
RUNS WITH   COLORFUL
THEY WANT   WHAT YOU ARE
YOU ARE     A STRANGER · 1 MORE TO SOMEBODY WHO SHOWED UP
THE WALL    5 MORE AND TURNING UP STOPS WORKING
            NOTHING TO PRESS. THEY ARE STILL DECIDING WHAT YOU ARE.
buttons     NONE AT ALL
```

**One more WHAT? Five more of WHAT?** There is no button on that card.

**Third time this week, the same disease: A SURFACE THAT DESCRIBES A MECHANISM
THE PLAYER CANNOT REACH.** 8/18 it was a wall that was a sign. 8/20 it was a card
open on somebody who had walked away. Here it is a progress bar for a ladder with
no rungs.

### AND THE MISSING ACT IS NOT THE BUG — HIS OWN DOSSIERS SAY SO

Two outfits want `character` and `ACTS` has no entry for it. That looked like a
hole until I read what he wrote:

> **THE COLORFUL** — *"To know whether you are safe to be around. That is the
> whole assessment and **it never stops running**, and passing it is worth more
> than any faction's standing."*
>
> **THE SOCIAL FORCES** — *"Recruits, and specifically recruits who are
> frightened. They approach **after** something bad has happened to you, **never
> before**."*

**CHARACTER IS NOT SOMETHING YOU DO. IT IS SOMETHING THEY READ OFF YOU.** Neither
dossier describes a task; both describe an assessment run on you, on their
schedule. A "prove your character" button would be inventing canon in the two
places he was most careful, so **the missing entry is correct** and stays missing.

What was wrong was the card. An outfit with **no act at any state** now prints no
rung and no wall, and says the real rule instead. The distinction is the whole
patch: `noActBecause` already separates a **permanent** absence from a
**temporary** block, and only the permanent one silences the ladder — an outfit
you simply have not visited today still has a climb and still says so. Both
mutations bite: restoring the false ladder reds C1–C3, and over-correcting by
silencing everybody reds B6.

## 4c. EVERY ACT A PLAYER CAN PRESS, PRESSED — AND THE ONE NOBODY CAN

There are **five** distinct acts across the sixteen outfits, and until this part
existed **exactly one** had ever been pressed on the walked surface. An act nobody
has pressed is the shape of every bug this week: the wall that was a sign, the
favour nobody collected, the cost that cost nothing, the ladder with no rungs —
all four were live code no claim had ever driven.

Pressed, each on a real member, each moving the count:

| act | outfit | button |
|---|---|---|
| debt | Cartel | "Take what they are offering" |
| information | Homeless | "Tell them what you have seen" |
| labour | Trades | "Give them an hour of it" |
| legibility | Network | "Let them write you down" |

**And the fifth cannot be reached by anybody.** Measured across the whole valley:

```
acts with members: debt 10 · information 3 · character 2 · legibility 7 · labour 7
NOT REACHABLE:     presence — bases with nobody: Anarchists, Blues, Church
```

**Three bases stand in the valley with zero members, and they are precisely the
three `presence` outfits.** So one of the five acts — *"Show up for them"* —
cannot be pressed by any player anywhere. That is a placement and density fact
(MAP LAW, and the `REACH_CELLS` / `AFFILIATED_RATE` dials that are already
[PENDING Paolo]), not a defect in the act, so **the gate names it rather than
failing on it** — the same rule the suite learned about unrun gates on 8/19.

### AND MY FIRST VERSION OF THAT CHECK HAD AN ESCAPE HATCH

Deleting `labour` from the ACTS table made its claim **vanish rather than fail**:
22 passed, 0 failed, one fewer claim, no red. **That is silence reading as
coverage — the exact disease this gate and the 8/19 suite work both exist to
kill — in my own gate, one turn after writing the law about it.**

The data alone cannot separate *"`character` has no act by design"* from
*"`labour` lost its act by regression"*, so **the set of five is pinned by name**.
It is small and has been stable since 8/12. Mutation-proven: remove one from the
table the page actually uses and two claims go red.

## 4d. AND NOBODY HAD EVER ANSWERED THEM

The walk went as far as *"THEY ARE ASKING YOU"* and stopped. **Nobody had ever
pressed either answer.** And the answer is the entire point of the claim
(Portes 1998, excess claims on group members):

> **Saying YES buys you NOTHING** — meeting an obligation is the **rent** on
> being counted, not a rung.
> **Saying NO costs you the standing that made you worth asking** in the first
> place.

**That asymmetry is the first thing a kind edit would break**, and it had never
once been driven through the two buttons on the card.

Both answers are now walked **from the same state, on a fresh page each**, so
*yes buys nothing* and *no costs you* are compared against **each other** rather
than against two different histories. Both mutations bite: pay the player for
saying yes and E2 goes red; make refusal free and E3 and E4 do.

## 4e. THE SIXTEEN NAME MECHANICS, PRESSED — AND A FALSE FINDING I ALMOST SHIPPED

Every outfit does something different when you ask its members their name. That
organ has **46 gated claims**, and every one is **structural** — the rule
resolves, the anchor holds, the signatures are distinct. **Not one pressed the
button on a real member of a real outfit and read what came back.**

Pressed now, and the card matches the organ on all eight outfits reachable:

| outfit | asking gives you | how you get the rest |
|---|---|---|
| CARTEL | nothing, and the card already says *"THEY USED YOURS. YOU NEVER GAVE IT."* | **NOTHING. EVER.** |
| TRADES | **"WATCH"** — a trade, not a name | HIRE THEM TWICE |
| VOLUNTEERS | the name, instantly | ASK. IT ARRIVES INSTANTLY AND WITHOUT CEREMONY. |
| HOMELESS | no button at all | ANSWER WHERE YOU SLEEP, HONESTLY |
| NETWORK / REDS / COLORFUL | already known — they offer it | *nothing to earn* |

### AND I ALMOST SHIPPED A FALSE FINDING ABOUT THE MOB

The first pass picked a person, moved next to them, opened the card, and labelled
the result with **that person's** faction. But `ctOpen()` shows whoever is
actually **nearest**, which is not always who you picked.

It reported that **the Mob hands over a full name to a direct ask** — flatly
against its own anchor, *"YOU ARE INTRODUCED, YOU DO NOT ASK."* I had the organ's
answer in front of me (`buttonFor` → **"Ask anyway"**, `askOutcome` → *nothing*,
plus *"A SMALL PERMANENT MARK AGAINST YOU"*) and was one step from writing up the
wiring as broken.

**It is not. The card was somebody else's.**

> **A PROBE THAT DECIDES WHO IT IS LOOKING AT CAN BE WRONG ABOUT WHAT IT SAW.**
> The card's own `RUNS WITH` row is the subject now, never my pick.

That is the same class as the three-spellings bug earlier in this same gate:
**read the answer from the thing under test, not from the notes you kept beside
it.** Mutation-proven: make the card ignore the organ and use one uniform button,
and five claims go red.

## 4f. THE FIFTH TIME, AND THIS ONE I WROTE MYSELF

```
grep neglectFor  ->  a definition, a re-export, and NOTHING ELSE.
```

**Zero callers on the walked surface.** Same as `give()` (the wall, 8/18), the
favour nobody collected (8/18), the cost that cost nothing (8/19), the ladder
with no rungs (8/20). **The organ computes it and nothing applies it** — five
times now, in a system this lane built.

**NEGLECT IS THE ONLY THING IN THE WHOLE STACK THAT MOVES WHILE HE IS DOING
SOMETHING ELSE.** Everything else waits for a button. This is the upkeep on a
commitment, charged for a day you did not turn up, and the amount is the stage
index: nothing said out loud costs nothing, taking a side costs one a day,
burning a bridge costs two. Derived, never typed.

It fires at the **one** place a day turns over — the sleep card's callback — and
charges for the day that **just ended**, because a day cannot be neglected until
it is over. Once per outfit, stamped, because a hook that runs off a card callback
can fire twice and a double charge is invisible. Through `adjust`, the single
writer, which clamps at zero: **twelve quiet days and the floor holds.**

And **he can see it coming** — the consequence is printed before the button, never
after (8/15). A cost that only ever arrives overnight, unannounced, is a
punishment.

### AND I BROKE MY OWN FOUR-DAY-OLD LAW ON THE FIRST TRY

The first cut gave it **its own row**, and the busiest card went to **767px of
844 — 91%**, straight through the 90% bar `cardfold_gate` holds.

> **EVERY LANE THAT ADDS A ROW TO A SHARED SURFACE OWNS THE TOTAL, NOT JUST THE
> ROW** — this lane's own law, written 8/18, broken by me on 8/20.

It lives on the commitment row now, which is where it belonged anyway: the upkeep
is a **property of the commitment**, meaningless without it and changing when it
changes. One row, one thought:

```
HOW FAR IN    YOU TOOK A SIDE · A QUIET DAY COSTS 1
```

Three mutations bite: never charge it and H2/H4/H5 go red; charge it on a day he
turned up and H3 does; drop the once-a-day stamp and H4 does.

## 4g. THE DEEPEST STATE, AND WHAT A COUNT CANNOT REMEMBER

`burned` — *"you cost yourself somewhere else to be here, this is the one that
cannot be walked back"* — **had never been reached by anybody.** It is now walked
by playing, no `setState` anywhere:

```
none   gave 5 at ceiling 5    card offers  "Say you are with them"   -> sided
sided  gave 9 at ceiling 9    card offers  "Burn a bridge for them"  -> burned
burned no ceiling             card offers  nothing further           -> INSIDE
```

The third commitment is the only thing that reaches **INSIDE**, and there is
nothing after it — the end of the road, not a fourth thing to grind toward.

### AND REACHING IT EXPOSED SOMETHING I BROKE THE DAY BEFORE

Until neglect existed, `gave` only ever went **up**. So `gave > 0` was a perfectly
safe proxy for *"you have dealt with these people"*, and two things leaned on it:
the terms fold (8/18), and `RUNGS[0]` — **"A STRANGER"**, whose own note reads
*"They have no reason to think about you."*

**Neglect made the count fall, and both proxies broke the same day.** Measured —
commit all the way to `burned`, then stay away twenty days:

```
gave=0  state=burned
YOU ARE      A STRANGER · 1 MORE TO SOMEBODY WHO SHOWED UP
HOW FAR IN   YOU BURNED A BRIDGE · A QUIET DAY COSTS 2
THEY WANT / THEY HOLD / PAID IN / CAREFUL      (the full terms, again)
```

**You burned a bridge for these people and the game calls you a stranger**, and
hands you their terms as though you had never met. Each half is individually
correct and together they are nonsense.

> **A COUNT IS NOT A MEMORY.** *"How much are you worth to them right now"* and
> *"have you ever dealt with them"* are different questions, and the second one
> already had its own answers in the save — `gaveDayOf` and the commitment state —
> **both of which survive neglect, because `adjust` only ever touches the count.**

The **number is untouched**: their standing really has decayed and the rest of the
card still says so. It was the **word** that was lying. It reads now:

```
YOU ARE      NOT A STRANGER, AND NOT MUCH ELSE. THEY KNOW WHAT YOU DID
             AND THEY KNOW YOU STOPPED.
HOW FAR IN   YOU BURNED A BRIDGE · A QUIET DAY COSTS 2
THEIR TERMS  YOU, OWING · tap to read
```

**And the first version of the claim was wrong in the funniest possible way:** it
forbade the string *"A STRANGER"* anywhere on the card, so it failed on the very
line that fixes it — *"**NOT** A STRANGER"*. It asserts the rung **row** now, not
a substring. Both mutations bite: make history a count again and J4/J5 go red;
restore the bare stranger word and J4 does.

## 4h. THE SEVENTH TIME — AND THE FIRST ONE FOUND BY SWEEPING FOR IT

Six times this week, the same shape: **an organ computes something and nothing on
the walked surface calls it.** `give()`, the uncollected favour, the cost that
cost nothing, the ladder with no rungs, `neglectFor`, and the count that was
asked to remember. Every one of them was found by tripping over it.

So instead of waiting for the seventh, I counted the call sites of every function
this lane exports.

```
BohemiaIntros.askOutcome     0 CALLERS
```

It is the function that says **what asking costs you**, and three of the sixteen
charge a real price for it — his words, from the COSTS table:

```
CARTEL      refused          A SMILE AND A REDIRECT. EVERY TIME. FOREVER.
MOB         permanent-mark   A SMALL PERMANENT MARK AGAINST YOU.
ANARCHISTS  insult-once      AN INSULT. YOU GET TO MAKE IT ONCE.
```

The other thirteen cost nothing, **which is exactly why it stayed invisible: the
common case is free, so the button looked fine.**

> **THE CONSEQUENCE IS PRINTED BEFORE THE BUTTON, NEVER AFTER** (this lane, 8/15).
> A price you discover by paying it is a punishment; a price you read first is a
> decision — and with the Mob it is **the** decision, because the whole mechanic
> is that you are supposed to wait to be introduced.

**And the row for it already existed, answering the wrong question.** `ctIntroRows`
has printed `if(m.cost) ctRow('AND', m.cost)` all along — but that is
`meeting().cost`, which is **empty before you ask and filled in afterwards.** So
the card could always say what asking **did** cost and never what it **would**.
The row for the consequence existed; the row for the decision did not.

Nothing is invented: *"a small permanent mark against you"* is not a stat this
repo has, and minting one would be writing canon in the exact place his dossier is
most specific. The card says what he wrote.

## 4i. FIVE OF HIS SIXTEEN COULD NEVER HAND OVER A NAME

The sweep did not stop at one. `BohemiaIntros.earned()` switches on **eight**
conditions. The city filled exactly **one**:

```js
var iSt = { asked: CT_MET.asked(who.key) };
```

That is the whole state. So `vouched`, `overheard`, `standing`, `honest` and
`hires` were **permanently false**, and five outfits could never get past the
first rung of their own mechanic — the mechanic being the most specific thing in
each of their dossiers:

```
MOB       vouch      "YOU ARE INTRODUCED, YOU DO NOT ASK"
REMNANTS  overheard  "...A FIRST NAME ALMOST NEVER"
BLUES     standing   "YOU GET THE GROUP'S NAME FIRST AND THEIRS LAST"
HOMELESS  honesty    "THEY DO NOT ASK YOUR NAME, THEY ASK WHERE YOU SLEEP"
TRADES    work       "YOU GET A TRADE, NOT A NAME"
```

### AND FOUR OF THE FIVE WIRES WERE ALREADY WRITTEN, ON A SURFACE THAT IS NOT THE GAME

This is the part worth remembering. `engine/bohemia_ties.js` was built on 8/12
**specifically** to make three of these reachable — grounded in Feld 1981 (foci)
and Dunbar's layers, with `vouchFor` / `overheardFrom` / `onwardFrom` named after
the three dossiers they answer. `answerFor()` shipped 8/11. The ledger grew its
`honest` / `answered` / `lied` bits on 8/13.

**All of it was wired — to `BOHEMIA_RUN_SLICE_7_26_26.html`.** The CITY, which is
the surface Paolo walks, never got any of it. Two of the ties functions
(`overheardFrom`, `onwardFrom`) had **no caller anywhere in the repo** — not the
city, not another module, not a gate, not a tool. A definition and nothing else.

> **A WIRE TO THE WRONG SURFACE IS NOT A WIRE.** "It works" and "it works where he
> plays" are different claims, and only the second one is the game. This is the
> VERIFY-ON-THE-REAL-SURFACE law (7/18) in its systems form.

So the fix **ports** rather than rewrites: the city's own vocabulary
(`ctValleyRoster` / `ctVKey` / `ctCell` / `CT_MET` / `ctEverDealt`) handed to the
same organs. Nothing new was cooked.

### THE KEYS RECONCILE, AND THAT WAS MEASURED RATHER THAN ASSUMED

Two key spaces meet here and a wrong guess would have shipped a wire dead in
exactly the way this whole law exists to catch. Measured on the real page:

```
card person   who.key   'P:city:20:4:0'
valley roster a.__id    '20:4:0'         <- matches exactly one row
              a.__vid   '20,4:20:4:0'    <- what the tie graph is keyed on
```

And the mechanic answers: **all three Mob members in the valley are vouchable.**
The card now reads

```
MALACHI BETANCOURT
WHO PUT YOU ON   PERLA BONILLA · YOU RUN WITH THE SAME OUTFIT
```

— a name that arrived **without being asked for**, which is his anchor verbatim.

### ONE IS STILL UNREACHABLE AND IT IS NAMED, NOT FAKED

**TRADES** earns its name with `hires >= 2`, and the city has no hiring. Minting
one would be inventing an economy in the exact place his dossier is most specific
(*"HIRE THEM TWICE AND THE REAL NAME ARRIVES UNPROMPTED"*), and a fake hire button
is worse than the gap. `st.hires` stays 0, the card keeps saying **HIRE THEM
TWICE** in his words, and **L8 names it** rather than passing over it.
**MECHANISM-MINE / CONTENTS-PAOLO'S.**

Two more cannot fire for a **population** reason, not a wiring one: there is
**one Remnant** in the whole valley, so there is no second soldier to overhear a
first name from, and **zero Blues**. L9 states that as a falsifiable claim — if
the graph ever produces a third party out of a one-member outfit, it goes red.

### AND I WAS WRONG ABOUT THE PIXELS, IN WRITING, BEFORE MEASURING

I argued the vouch row was **height-neutral**: `meeting().next` empties once the
name is earned, so HOW YOU GET THE REST disappears exactly when WHO PUT YOU ON
appears. One row out, one row in. It sounded airtight.

**Measured: 833px of 844. Ninety-nine percent.** Earning the name also turns the
quirk row (**THEY SAID**) on, so the card gains two and loses one.

> **MEASURE, DO NOT REASON, ABOUT PIXELS.** Third time this lane has added a row
> to this card and gone red, and the first time the argument for why it was safe
> was any good. A good argument about a measurable thing is still not a
> measurement.

The tempting fix was to trim three unrelated rows until the number went green.
**That is fitting the content to the ruler in a different coat.** The card did not
need three trims, it needed the two rules it was already halfway to having:

1. **A DUPLICATE IS NOT DISCLOSURE.** The heading *becomes* the name once you know
   it, so the NAME row underneath repeats it verbatim — on precisely the cards that
   are fullest. That is the identical defect the TRADE row was fixed for on 8/18,
   on the identical card, and it takes the identical test. `833 -> 810`.
2. **THE HEADLINE IS LIVE, THE EXPLANATION IS THE OUTFIT'S.** `ctRow('', ...)` — an
   empty label — has been this card's mark for *"the sentence explaining the row
   above"* in four different systems. Every one of those sentences is identical on
   every member of that outfit forever, which is word for word the test the 8/18
   fold already applies. They were simply outside the fold. The headline never
   moves (cardfold A5: the live question always stays); only the explanation folds,
   and one tap brings it back. `810 -> 734` (87%).

A trim has to be re-argued every time somebody adds a row. **A rule generalises.**

### AND THE FIFTH MUTATION CAUGHT ME, NOT THE CODE

Five mutations, and I wrote down what each one would do before running them. Four
were right. The fifth — **restore the duplicate NAME row** — I predicted would red
A12, and it did not: **15 passed, 0 failed, with the duplicate back in.** The
explainer fold had already bought so much headroom that ~23px no longer crosses
the bar.

> **A RULE DESERVES ITS OWN CLAIM, NOT A SIDE-EFFECT OF A PIXEL BUDGET.** A height
> check catches a duplicate only by accident, and only until the next row lands.
> A16 asserts it directly now, the way A8 already does for the TRADE row one row
> lower down — same defect, same card, same test.

**Report the mutation that did not bite.** A mutation suite where every mutant
conveniently dies is a suite nobody learned anything from, and the one that
survives is the only one that told me something I did not already believe.

And the bar itself was wrong: A1 stands next to whoever is affiliated and nearest,
which is almost never somebody who can be vouched for, so **the worst case was
outside the measurement that exists to hold the card to the phone.** A12 now
constructs it deliberately. *A bar that does not measure the worst case is not a
bar.*

## 4j. THE NINTH, AND IT IS THE PAYOFF OF THE WHOLE SYSTEM

```
node tools/bohemia_organ_reach.js  ->  BohemiaCommitment.tertius   0 CALLERS
```

The sweep, run again after the eighth fix, immediately produced a ninth — and
this one is not a detail. It is the moment the faction system stops being a set
of separate ladders and becomes **a map of where you stand.**

**TERTIUS GAUDENS** — *the third who benefits* (Simmel; Burt's structural holes).
If the two outfits you stand with have **no line to each other**, you span a
structural hole: you are the only route between them, neither side can see the
other half of what you are doing, and the position is worth more than either
standing on its own.

**TERTIUS DOLENS** — *the third who suffers* (2024). If they **are** connected,
the identical position **costs** you. Same behaviour, same two standings,
opposite sign, decided entirely by a fact about the graph rather than about you.

Until this wire, standing with the Cartel and standing with the Mob were two
numbers on two different cards and the game never once had an opinion about
holding both.

### AND MY FIRST PLACEMENT WAS DEAD ON EXACTLY THE HALF THAT MATTERS

`ctHearRows` early-returns when nobody has a line:

```js
if(!heard.length){
  body += ctRow('WHO WILL HEAR', 'NOBODY. NO OUTFIT ... HAS A LINE TO THEM.');
  return body;                       // <-- I appended my row after this
}
```

**An empty `heard` IS the structural hole.** It is the literal definition of
tertius gaudens. So the row printed only when you were **exposed** and stayed
silent when you were **the only route** — the worst available way to be wrong,
because the game would warn you about the bad half and hide the good half.

Measured on the real card: organ said *YOU ARE THE ONLY ROUTE BETWEEN THEM*, card
said nothing at all.

> **A ROW ADDED AFTER AN EARLY RETURN IS NOT ADDED.** Same family as the border
> pass that was individually correct and sat in the wrong place in the pipeline
> (8/16): reading the function does not find it, running it does.

M3 proves the fix by asserting **both rows on one card** — the NOBODY row is
emitted by the early return itself, so seeing the position row beside it is proof
the position row ran first.

### AND MEASURING IT FOUND SOMETHING MUCH BIGGER, WHICH IS NOT MINE

The dolens branch never fired. Not for one pair — **for none of the 110 pairs in
the valley.** So I counted the graph instead of guessing:

```
affiliated                                    32 of 298
ties between two affiliated people           106
   same outfit                               106
   CROSSING AN OUTFIT LINE                     0
whoHears lines in the entire valley            0

foci shared by two or more people:  home 0   work 34   faction 8
```

**Every outfit hears about every other outfit from nobody.** Which means the whole
cross-cutting-cleavage half of the design — *WHO WILL HEAR*, *WILL HEAR IT AS
FACT*, *AND IT COSTS YOU*, and tertius **dolens** — is structurally unreachable.
**Every commitment in this game is currently free.**

The cause is precise, and it is three facts stacked:

1. **THE VALLEY HAS NO HOUSEHOLDS.** `homesIn()` walks a scatter and takes one
   fine cell per person, so 298 people have 298 homes. The home focus — the
   strongest tie in Feld's scheme and the one that most naturally crosses an
   outfit line — can never group anybody. *This is not a keying bug in
   `bohemia_ties`; the adapter reports the world faithfully and the world has one
   person per roof.*
2. **A FACTION TIE IS SAME-OUTFIT BY DEFINITION**, so it can never bridge.
3. **WORK IS THE ONLY POSSIBLE BRIDGE**, and with 32 affiliated of 298 a shared
   workplace never happens to hold two affiliated people from *different* outfits.

**NOT THIS LANE'S TO FIX.** Households are the population/world model; the
affiliation rate is a dial that is already `[PENDING Paolo]`. Inventing either
would be writing world canon he reserved. So it is **named**, with its numbers, in
gate **M5** — and M5 is falsifiable rather than decorative: if cross-outfit ties
ever exist while `whoHears` still returns zero lines, the two disagree and it goes
red.

## 5. IT FAILS RATHER THAN SKIPS

If the valley has nobody who runs with anybody, this gate **fails**. It does not
skip. *"Nobody in Las Vegas runs with anybody"* is the exact state the game was
silently in for thirteen days, and **a gate that shrugs at it is how that
happened.**

Gate: `gates/faction_arc_gate.js` (13 claims) · Tool: `tools/bohemia_city_stalecard_patch.py`
Tab: **CITY** — walk up to somebody who runs with an outfit and go the whole way with them.
