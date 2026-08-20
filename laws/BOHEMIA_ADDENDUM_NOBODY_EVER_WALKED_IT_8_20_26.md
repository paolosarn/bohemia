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

## 5. IT FAILS RATHER THAN SKIPS

If the valley has nobody who runs with anybody, this gate **fails**. It does not
skip. *"Nobody in Las Vegas runs with anybody"* is the exact state the game was
silently in for thirteen days, and **a gate that shrugs at it is how that
happened.**

Gate: `gates/faction_arc_gate.js` (13 claims) · Tool: `tools/bohemia_city_stalecard_patch.py`
Tab: **CITY** — walk up to somebody who runs with an outfit and go the whole way with them.
