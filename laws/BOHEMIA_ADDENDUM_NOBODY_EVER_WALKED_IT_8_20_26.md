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

## 5. IT FAILS RATHER THAN SKIPS

If the valley has nobody who runs with anybody, this gate **fails**. It does not
skip. *"Nobody in Las Vegas runs with anybody"* is the exact state the game was
silently in for thirteen days, and **a gate that shrugs at it is how that
happened.**

Gate: `gates/faction_arc_gate.js` (13 claims) · Tool: `tools/bohemia_city_stalecard_patch.py`
Tab: **CITY** — walk up to somebody who runs with an outfit and go the whole way with them.
