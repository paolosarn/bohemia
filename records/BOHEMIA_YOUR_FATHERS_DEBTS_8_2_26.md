# YOUR FATHER'S DEBTS (8/2/26, PEOPLE lane) — the question nobody had asked

Paolo, 8/2: *"Think outside the box... Do what you have to do next and know what comes
after."*

## THE QUESTION THAT WAS NOT ON ANY LIST

Bohemia is not a game about a hero. It is **a family across three generations and about a
hundred years** (story master), and the generational handoff happens **when the story says
so, never because somebody died** (DEATH IS A RELOAD, 7/26, locked).

So there is a moment, already canon, when the valley stops judging you and starts judging
your child.

**Nobody had ever asked what happens to your reputation at that moment.** It is the most
obvious question the game's own premise raises. It is not on the twelve-gap list, not in
THE BIG MISSING, not in the GDD, not in any backlog. It was invisible because it only
appears once you have a reputation system at all — which was three hours old.

## THE ORGAN ALREADY MODELLED IT AND NOBODY NOTICED

Thirty years pass. **Every person who watched you do anything is dead.** The only trace of
your life left in the valley is what got **repeated** — the deeds that travelled, hop by
hop, into somebody still alive.

So the rule writes itself, and it is the honest one:

> **A QUIET GOOD DEED DIES WITH THE WITNESS.**
> **A NOTORIOUS ONE BECOMES THE THING YOUR CHILD IS JUDGED FOR.**

That is why gossip had to exist before this could. **This is not a new system** — it is
what the witness organ was always going to do if you ran the clock forward.

## MEASURED

| | |
|---|---|
| a secret: one witness, never repeated | **0 carried, 1 died with the witness.** The child inherits **nothing** |
| a notorious deed that spread to three people | **2 carried.** The child starts owing **−0.767** they did not run up |
| the same thing one more generation on | grandchild **−0.345** — still faintly there |

**Three generations and only the loudest thing your grandfather did still registers** —
which is exactly the arc the story master already describes.

`legendOf()` reports what the valley still says about a family: the deed, how many people
still tell it, and how many generations back it goes.

## GROUNDED IN THE REAL, NOT IN A FANTASY TROPE

This is how reputation has worked for most of human history. In stateless societies a
family is treated as a **corporate entity** whose reputation carries its economic viability
and social standing; lineages run **ten and twelve generations deep**; and ostracism does
the work that fines and prisons do elsewhere. **You are born owing what your father owed.**
That is the correct register for a valley with no courts — and it is the same reasoning
that made the Mob the guarantor and the Caravans' name their armour.

## THE LIFE LESSON UNDERNEATH, AND THE GAME NEVER SAYS IT

**You inherit goodwill you did not earn and debts you did not run up, and neither one is
fair.**

A faction that loved your father gives you a head start you did nothing for. A faction he
wronged makes you pay for something you were not alive for. The player will feel that
before they can name it, which is the whole standard.

## WHAT IT COST

One function and a constant. `GEN_LOSS = 0.45` — less than half survives a handoff, so a
legend has to have been **loud** to cross even one.

## CONTENTS-PAOLO'S

`DEED_WEIGHT` still ships **EMPTY**, and the gate proves inheriting invents nothing: with
the table empty an heir still reads 0. **When the handoff happens in the story is his**,
and this does not touch it — `inherit()` is called by whoever runs that beat, never by
itself.

## THE GATE

`gates/standing_gate.js` grew 23 → **29 claims**, **10/10 self-test probes**. The two new
probes are the two ways this could quietly break: a secret crossing a generation anyway,
and an inherited reputation that never fades so a family is damned forever.

---

## WHAT COMES AFTER

1. **Nothing calls `witness()` yet** — the whole organ is inert until the run reports deeds
   into it. That needs a deed vocabulary, which is his. **The next non-blocked move is to
   inventory every action the run can already produce**, so his ruling is a thumb over a
   real list instead of a blank page.
2. **Gap 5** — wearing another faction's colours. Colours in, membership in, and now
   "somebody who knows your family sees you in it".
3. **Gaps 6, 8, 9** — agendas, membership, internal politics. All sit on this.

---
*BOHEMIA — your father's debts — 8/2/26 — PEOPLE lane*
*The dynasty was in the pitch for a year and nobody had asked what the valley remembers.*
