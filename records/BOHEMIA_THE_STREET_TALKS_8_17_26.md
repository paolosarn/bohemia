# THE STREET TALKS TO ITSELF (8/17/26, PEOPLE lane)

## THE HALF OF THE CORPUS'S OWN INSTRUCTION THAT NEVER SHIPPED

`tools/bohemia_bark_factory.py` (8/12) cites the finding it was built on and
quotes it in its own header:

> **Q043.W4 AMBIENT BANTER AS CHARACTERIZATION** — "the cast comes alive through
> OVERHEARD RELATIONSHIPS, not just quests — cheap, high-impact life (a
> solo-dev-friendly technique)."

It then shipped **244 lines in which every single person is talking to nobody.**
A person alone saying a thing is not a relationship. The catalogue asked for the
relationship and got a monologue.

**It was not neglect. It was physically impossible.** Measured 8/16 on the real
surface at every hour of a full day: ONE person was drawn on the street at 07,
09, 11, 13, 15, 17, 19 and 21 hundred hours, and never once two people close
enough to be talking to each other. You cannot write a conversation for a valley
that cannot put two bodies on one screen.

The population dial shipped 8/16. A settlement now draws up to 88. **The pairs
exist, so the conversations can.**

## WHERE IT IS

**The RUN tab.** Walk into a settlement. Two people standing together talk to
each other and you catch it as you pass. Nothing to open, nothing to tap.

## YOU WALK IN ON THE MIDDLE

The one craft rule every source agrees on: an overheard line works because it is
an **excerpt**, not a scene. You catch the middle or the end of something already
running, exactly as you do walking past two people in the street.

So every exchange is authored as a **full four-turn conversation** and `join` is
never 0. The opening line is written and **deliberately never heard.** That is
not waste, it is the whole trick: turn 2 only sounds like it has a turn 1 behind
it because a turn 1 really exists.

Measured on the real street:

    [15:6:0]  You could put one out.
    [15:6:42] I could. I put two out. Leave it.
    [15:6:42] Asking what.
    [15:6:0]  Asking which one you were. Not where you live, which one you were.
    [15:6:42] Then they already knew where I live.

Two different people, alternating, two different conversations, zero page errors.
Neither one was entered at its opening line. The first is `grief-chair`, whose
written and unheard opener is *"You are still putting the second chair out."*

## WHAT IT IS BUILT ON, AND EVERY CITATION IS MACHINE-CHECKED

Not name-drops: the id must resolve in the questbook index and the title must
match the corpus **verbatim**, or the factory refuses to write.

- **Q043.W4 AMBIENT BANTER AS CHARACTERIZATION** (craft) — the catalogue names
  this the best return on effort a one-person team has. He is one human.
- **Q001.P8 "W8 (reward the listener"** (ports) — "gate a solution behind a
  detail only an attentive player caught." **11 of the 31 exchanges carry a fact
  about this valley that is said nowhere else.** Walking past is a real loss.
- **Q018.W3 THE RUMOR WEB (curiosity as the quest log)** (craft) — "a thread to
  pull, with NO waypoints." What leaks points somewhere without ever placing a
  marker.
- **Q056.W8 ATMOSPHERE OVER EXPOSITION** (craft) — nobody explains the collapse.
  They argue about the water pressure and who has the lights on.
- **Q014.W3 SOCIAL DEDUCTION VIA DIEGETIC MEANS** (craft) — what you learn about
  this valley you learn through its social fabric, not a quest log.
- **Q008.W6 DENSITY AS OBSTACLE** (craft) — the world's texture is the challenge.
- **Q030.X3 REPETITION** (flaws) — enforced by machine, not hoped for: a pair
  spends its **whole pool** before anything repeats, and the gate fails on a
  repeat.
- **Q043.X4 CONTENT FRONT-LOADED / UNEVEN** (flaws) — enforced by machine: every
  kind ships at least four exchanges or the factory refuses to write. It caught
  `social` at three on the first run.

## THE NUMBERS

    31 conversations · 124 lines · 11 leak a real thread
    kinds: work 7 · grief 6 · rumor 5 · trade 5 · atmos 4 · social 4
    masters spanned: craft, ports

Every line is `draft:true` and **editable in the WORDS tab**, including the
opening lines nobody hears — he cannot edit what the second line is answering if
he cannot see it.

## A CONVERSATION IS NOT TWO BARKS FOUR SECONDS APART

The ambient bark cooldown is 1.5s of breath plus 4s before anybody else speaks.
That is right for two unrelated people on a street and completely wrong inside
one exchange: a four second gap between a question and its answer reads as two
strangers who happen to be near each other. So a turn inside an exchange hands to
the next speaker after **one beat** (120 BPM LAW), and only when the exchange
runs out does the ordinary cooldown come back.

## IT IS ADDITIVE, NEVER A REGRESSION

The dial ships at 1, where a pair on one screen is rare. If `xchPick` finds
nobody, the frame falls through to the solo bark exactly as before. A street that
could not hold a conversation still sounds the way it did. Gate B11 holds that.

## IT DRAWS NOTHING OF ITS OWN

REUSE-FIRST: `barkPass` already renders a bubble over a person's head, clamped on
screen, in the surface's palette. Every turn here is handed to that same drawer.
One bubble, one lesson learned (8/14), one place to fix it if it is ever wrong.

## TWO CHECKERS FIXED AT THE RULER

Both said the right thing in a comment and did the wrong thing in code.

- **`tools/bohemia_words_book.py`** — its `sources()` docstring reads *"EVERY
  dialogue-bearing artifact, DISCOVERED not listed. A hardcoded list is the thing
  that lets a lane invent a new dialogue file the machine never looks at."* It
  then hardcoded two filenames. **The next lane to invent a dialogue file was
  this one**, and 124 drafted lines would have been invisible in the WORDS tab,
  which under the 8/11 law means 124 lines Paolo cannot edit. Discovery is now by
  CONTENT: any `records/BOHEMIA_*.json` holding a container of lines.
- **`gates/dialogue_catalogue_gate.js`** had the same hardcoded list, stated
  independently. Now the same content rule, and in the **same order** — the first
  cut pinned BARKS and REACTIONS at the front while the harvester sorted all
  three together, and the two fingerprints disagreed over nothing but
  alphabetical position, reporting a stale WORDS tab that was not stale.
- Also: `engine/bohemia_people.js` had `REACTIONS: REACTIONS` **five times** in
  one object literal from a botched edit. Harmless in JS, last one wins, and it
  is exactly the kind of thing nobody reads twice. Deduped.

## THE MACHINE

`gates/exchange_gate.js` — 22 assertions, registered as STREET EXCHANGE. It
drives the real street through the one link and demands two different people
speak, nobody answers themselves inside one exchange, no opening line is ever
heard, and **the bubble reaches pixels** (same frame with a line and without it
must differ by more than 400 pixels), because `var g = ctx` once threw on the
first line of every bark inside a try/catch that ate it and everything upstream
measured perfect.

Mutation tested:

    exchanges never start          -> B7  FAIL (1 speaker, a monologue)
    join set to 0 (hear the opener)-> B9  FAIL (grief-chair)
    the bubble stops drawing       -> B10 FAIL (0 pixels differ)

Tools: `tools/bohemia_exchange_factory.py` (the words),
`tools/bohemia_city_exchange_patch.py` (the wiring, idempotent by md5).
