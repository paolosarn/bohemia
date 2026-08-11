# BOHEMIA ADDENDUM — THE SIXTEEN INTRODUCTIONS (8/12/26, PEOPLE lane, LOCKED)

> **Paolo, 8/12: "lets do more than faction memeory please."**

Fair. Six turns of this lane went into what a faction REMEMBERS about you —
witness, gossip, decay, the rung, the generation after. This is the other half,
and it is the half **he already wrote and nobody read.**

## WHAT WAS SITTING THERE

`records/factions/` holds sixteen faction dossiers, thumbed UP on 8/2/26. Every
one of them carries a section called **WHEN YOU ASK THEIR NAME**, and every one
of them describes a **different mechanic**. Not flavour. Mechanic — half of them
say the word out loud:

| | his canon, verbatim |
|---|---|
| TRADES | "HIRE THEM TWICE AND THE REAL NAME ARRIVES UNPROMPTED, which makes the Trades the one faction where the **earned-name mechanic** is earned with WORK instead of words." |
| MOB | "YOU ARE INTRODUCED, YOU DO NOT ASK... Ask directly and you get a polite non-answer plus a small permanent mark against you for not knowing how this works." |
| CARTEL | "THEY KNOW YOUR NAME BEFORE YOU ASK THEIRS... The one faction where the **name mechanic runs backwards** — being KNOWN is the threat." |
| BLUES | "YOU GET THE GROUP'S NAME FIRST AND THEIRS LAST... the **earned-name mechanic** is gated by REPUTATION rather than by conversation." |
| CHURCH | "THEY ASK YOUR NAME FIRST, BEFORE YOU CAN ASK THEIRS, AND THEN THEY NEVER FORGET IT." |
| HOMELESS | "THEY DO NOT ASK YOUR NAME, THEY ASK WHERE YOU SLEEP." |
| VOLUNTEERS | "THEY DO NOT ASK YOUR NAME. THEY ASK WHAT HURTS." |
| REMNANTS | "A SURNAME ON THE FIRST ASK AND A FIRST NAME ALMOST NEVER... it usually arrives from somebody ELSE." |
| AMALGAMATION | "IT KNOWS EVERY NAME AND IT IS NEVER THE ONE SPEAKING... in act one that must land as a HAUNTING and **nothing on screen may explain it**." |

Ten days on disk. The **only two files in the whole repo that had ever opened
them** were `tools/bohemia_faction_dossiers.py`, which wrote them, and
`gates/faction_dossier_gate.py`, which checks they exist. Meanwhile the game did
one thing for all sixteen: press *Ask their name*, receive a full name, everybody,
forever.

That is the **authored-but-unread disease** (`gates/authored_unread_gate.py`,
this lane, 8/9) at the largest scale it has reached in this repo — 1,089 lines of
approved canon that the running game had never read a word of.

## THIS IS THE PHILOSOPHICAL CLOTHES, MADE MECHANICAL

Paolo, 8/12, correcting a too-small reading of his own entrance ruling:

> "when I said different clothes, I meant it kind of in a philosophical way as
> well like it's just dressed differently. I didn't of course they will wear a
> different clothes but it's bigger than that."

Meeting a stranger is the single most repeated act in the game. Sixteen sets of
clothes on that one act is not a costume change — it is sixteen different games
of the same scene:

- The **Church** takes your name before you can ask for theirs, and greets you by
  it a year later in front of people.
- The **Trades** hand you a trade, not a name, and you buy the name with two jobs.
- The **Mob** will not be asked at all. Somebody vouches or you stay a stranger,
  and asking marks you permanently.
- The **Cartel** greets you by a name you never gave anyone, and you never get
  theirs. Not once. Ever.
- The **Amalgamation** does the same thing, and **nothing on screen may explain it.**

## THE LAW

**1. HIS CANON IS THE SPEC, AND THE MACHINE HOLDS THEM TOGETHER.**
`engine/bohemia_introductions.js` is GENERATED from `records/factions/*.md` by
`tools/bohemia_introductions.py`. Every rule declares an **ANCHOR** — a verbatim
fragment of the dossier sentence the mechanic was read out of — and **the
generator refuses to run if the anchor is no longer in that dossier.** Reword the
canon and the build dies until a human re-reads it. The mechanic can never
quietly drift off the words.

**2. MECHANISM MINE, CONTENTS HIS.** The four-axis vocabulary is mine:
`opener` (who moves first) / `first` (what the first contact leaves you holding) /
`earn` (what turns a handle into a name) / `cost` (what getting it wrong costs,
and *which* wrong move is charged). WHICH faction does WHICH is entirely his.

**3. NO WORDS ARE INVENTED.** Every label the organ shows is a slice of something
the engine already owned — the generated name, the engine's own role word, the
faction's own name, the person's work line. There is **no dialogue table here and
there must never be**; `LINES` stays empty and stays Paolo's.

**4. A BUTTON THAT DOES NOTHING IS A LIE.** The one button only appears when
asking either *moves* something or is a mistake his canon deliberately lets the
player make ("the game should let the player make that mistake once" —
ANARCHISTS). **Three of the sixteen end up with no button at all**, and in all
three the canon is that the name was never the transaction. That silence is the
feature, not a gap.

**5. THE ~85% WHO RUN WITH NOBODY DO NOT REGRESS.** The DEFAULT rule is
byte-for-byte Paolo's 7/31 ruling (YOU HAVE TO ASK): no name until you ask, then
the name. A faction layer that changed *that* would be a regression wearing a
feature's clothes.

**6. THE CARD NEVER SAYS TWO THINGS.** `bohemia_people.js` hands over the full
name the moment the ledger says you asked. Once the organ can answer *SURNAME* or
*TRADE*, the run's NAME row is **rewritten from the organ**, never printed beside
it. (The 8/11 bug in this lane was two numbers, both right, on one card.)

## THE MACHINE

`gates/introductions_gate.js`, 44 claims, built against the five ways this
actually breaks:

- **A** — every dossier has a rule, every rule has a dossier, every anchor is
  verbatim, and the generator is **re-run and diffed** so a hand-edit or a
  reworded dossier fails here.
- **B** — the sixteen are **behaviourally distinct** (measured, 15 distinct
  signatures; NETWORK = REDS are canon twins and are named in the output), each
  named-in-canon mechanic is **driven**, no `earn:never` faction ever leaks the
  name under any state, and DEFAULT is pinned.
- **C** — the **real built run, in a real browser**: the organ is live, every
  person on the block resolves through it, the real card is opened and the real
  button is pressed, and a forced Trades member's card is checked row by row for
  a leak of the name they have not earned. A grep for the filename proves nothing
  (8/9: `advance_territory` was "wired" by name and dead in fact).
- **D** — no dialogue table, no name pool, no quoted speech, every label traceable
  to what the engine handed in, and the judge page runs the REAL module inlined.

## WHERE HE LOOKS

**LIFE tab → THE SIXTEEN INTRODUCTIONS.** All sixteen, his canon paragraph at the
top of each card, the mechanic underneath in machine terms, and the meeting
played out in three steps by the real module. Nothing to judge, nothing to tap,
and **he is never sent into the RUN app to find it**
(`BOHEMIA_ADDENDUM_NEVER_MAKE_HIM_HUNT_8_11_26.md`).

## WHAT IS STILL UNBUILT, NAMED SO NOBODY CLAIMS IT

Five of the eight earning conditions answer today: `none-needed`, `ask`,
`honesty` (the ledger gained a second bit so the Homeless answer survives a save),
`never`, and `standing`.

**`standing` was wired the same turn**, because it was the one unbuilt condition
whose system already existed: the Blues gate the name on REPUTATION, and the real
`FactionWorld` already carries the player's standing. `groupHasAnOpinion()` reads
it off the same world the quest-consequence line already reads, and an OPINION
means **off neutral in either direction** — his sentence does not say they have to
like you. Gated behaviourally: move the standing, and a Blues member's card turns
from THE BLUES into a person by itself (C13/C14).

Three remain, and the organ treats every unanswered one as **false** rather than
assuming it met:

- `work` (hire count) — needs the jobs/economy loop
- `vouch` (a third party introduces you) — needs the companion/social layer
- `overheard` (you hear somebody else use it) — needs ambient speech

Until those land, a Trades member stays SCAVENGER. **That is the correct answer,
not a gap** — the mechanic is right and the door is simply still shut.
