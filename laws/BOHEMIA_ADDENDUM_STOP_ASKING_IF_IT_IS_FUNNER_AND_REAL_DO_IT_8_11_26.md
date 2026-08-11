# ADDENDUM: STOP ASKING. IF IT MAKES THE GAME FUNNER AND REALISTIC, DO IT.
**Paolo 8/11/26. LOCKED.**

> "BRO UR QUESTIONS ARE NOT ENGLISH I NEED YOU TO STOP ASKING ME BULLSHIT
> QUESTIONS
> IF IT MAKES THE GAME FUNNER AND REALISTIC DO IT PUSSY"

---

## WHAT HE IS ACTUALLY SAYING

Two things, and the second one is the bigger one.

**1. THE QUESTIONS WERE NOT IN ENGLISH.** They were menus. Lettered options,
A and B and C, made of words from inside the machine: threat multipliers,
packages, accuracy curves, hysteresis, arc-length. He is the creative director.
He decides what the game IS. He does not decide which of three implementations
of a thing he never asked for gets built, and he cannot decide it when the
question is written in a language he does not speak.

**2. THE PERMISSION IS STANDING.** "If it makes the game funner and realistic,
do it." That is not encouragement. It is a delegation, and it is permanent. Any
change that is BOTH more fun AND more true to how the real world works is
pre-approved and requires no question, no menu, and no check-in. Asking about
one of those is not caution, it is the work not getting done.

---

## THE LAW

### A. THE TWO-KEY TEST REPLACES THE QUESTION
Before writing a question, run the change through both keys:

* **FUNNER** — does it make a turn harder to play well, or make a decision
  matter that did not matter before?
* **REALISTIC** — would a real person in a real fight, a real street, a real
  building actually behave this way?

**Both keys turn: BUILD IT. Do not ask.** Ship it, name what you did in plain
English, and move on.

**Only one key turns, or neither: it is not pre-approved.** That is where a
question is legitimate, and it still has to obey section B.

### B. WHAT A LEGAL QUESTION LOOKS LIKE
Everything already in CLAUDE.md ("ONE question max, bolded, answerable in a
word") plus these, which are what he was actually complaining about:

* **NO LETTERED MENUS.** No "A) ... B) ... C)". A menu of implementations is
  the machine asking him to do the machine's job.
* **NO MACHINE WORDS.** If a term only exists because of how the code works, it
  cannot be in the question. Ask about the GAME, never about the build.
* **IT MUST BE A THING HE WOULD SAY OUT LOUD.** Read it back. If it is not
  something a person says to another person about a video game, it is not a
  question, it is a status report wearing a question mark.

### C. WHAT IS NEVER PRE-APPROVED, TWO-KEY TEST OR NOT
This delegation does not touch anything he has already reserved. It is a
permission to make the game better, not a permission to make his decisions.

* **MECHANISM-MINE / CONTENTS-PAOLO'S** stands untouched. Names, lore,
  factions, dialogue, who anyone is: still his, still empty until he fills them.
* **MAP LAW** stands. Claude never designs map layouts.
* **THE GRAVEYARD** stands. Dead is dead.
* **A REJECTION** stands. "Funner and realistic" never re-opens something he
  killed, and never justifies a third attempt at a thing he did not want twice.
* Anything with a **[PENDING, Paolo's call]** on it is pending, full stop.

### D. THE FAILURE THIS REPLACES
The turn before this ruling ended in a numbered list of lettered options about
enemy behaviour, written in build language. The correct turn was: enemies who
stand still in a gunfight are neither fun nor real, so make them move, and say
so in one sentence. Both keys turned. There was never a question there.

---

## THE GATE

`gates/no_bullshit_questions_gate.py`

A law without a machine gate is not enforced (7/16). This one machine-checks the
exact failure mode:

1. This addendum exists, is LOCKED, and carries his words verbatim.
2. **No lettered option menus** anywhere in `records/` or `laws/` files dated
   8/11/26 or later. `A) ... B)` in a question block fails the gate.
3. **No machine words inside a question.** Any line ending in `?` that carries a
   term from the build-language blocklist fails the gate. The blocklist is the
   vocabulary he has actually been handed and could not use.

The gate cannot read intent, and it does not try. It catches the two shapes he
named, which is what a gate is for.
