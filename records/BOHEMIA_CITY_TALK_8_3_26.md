# YOU CAN TALK TO SOMEBODY NOW, ON THE SURFACE HE ACTUALLY PLAYS — 8/3/26

Paolo, 8/2: *"can you just have one extra NPC chilling outside the spawn in the
suburb that I can just talk to and test out your mechanics?"*

I built one. He came back with **"I couldn't find them."**

He was right, and the reason was worse than a missing NPC.

---

## WHAT WAS ACTUALLY TRUE, MEASURED ON HIS SURFACE

The alpha routes the RUN tab to the CITY panel:

    PANEL = (t.dataset.p === 'run') ? 'city' : t.dataset.p

`#p-run` — `BOHEMIA_RUN_CURRENT.html` — is `display:none` the entire time. And
that file is where **everything this lane had ever built** lived: the identity
card, the one contextual button, asking a name, the name over their head, and
the neighbour I put outside his door.

Standing where the RUN tab drops him:

| | |
|---|---|
| bodies drawn on screen | **0** |
| nearest person in the valley | **192 tiles** |
| occurrences of `TALK TO` | **0** |
| identity card / ask a name | **0** |

Not "nobody to talk to". **Nobody at all**, and no way to speak if there had
been.

---

## WHAT IS THERE NOW

Tap RUN. You land on your feet in the suburb. **Somebody is standing two tiles
away.** Take one step and the button says **TALK TO THE WATCH**. Tap it and the
card opens: their trade, where they live, what they are doing right now, and
`NAME: YOU HAVE NOT ASKED`. Tap **Ask their name** and she is **Marisela
Escobar** — the button now reads **TALK TO MARISELA**, and **Marisela** is over
her head. Close the game and come back and she is still Marisela.

That is the whole mechanic, end to end, on the tab he taps.

### Every piece is the shared module, not a second implementation

`engine/bohemia_people.js` is inlined verbatim — exactly the way
`bohemia_city_people_patch.py` already inlines population and agents. The name,
the trade, the card and the three tiers are **that module's** answers. This frame
decides nothing about who anybody is. ENGINE SYNC LAW: one canonical body per
module, and the alternative is a second idea of who somebody is — the exact bug
this lane spent 8/2 removing.

The neighbour is a **real person record** from `BohemiaPopulation.personFields`,
the same derivation as all 300 people in the valley: real trade, real look, real
schedule asked from `BohemiaAgents`. A prop would test nothing. He is pinned to
the **spawn**, computed once, not to the player — a body that followed you around
would be a cursor, not a neighbour.

Everything I learned placing the last one carried over: **out of the doorway**
(the button prefers a door you are standing on over a person beside you) and **on
open ground** (a body that never moves permanently removes a cell, so parking one
in a one-wide path is a wall — on the run surface that put three people in a
queue behind a fixture).

---

## THE GATE, AND WHY IT LOOKS DIFFERENT FROM EVERY OTHER ONE I OWN

`gates/city_talk_gate.js`, 18 claims. **It opens the alpha and taps the tab.**

That is the correction. Every gate in this lane opens
`BOHEMIA_RUN_CURRENT.html` **directly, as a file**. All 152 of them are green
about a page the game never shows. They were not lying about the code — they were
answering a question about the wrong door. VERIFY ON THE REAL SURFACE (7/18)
means the surface he sees, and a side-door probe is a lie. My own law, and it
took him saying "I couldn't find them" for me to check.

Claims: somebody is by the spawn and really painted; you can walk up to them; the
button names their trade; the card says YOU HAVE NOT ASKED; **no timetable on the
card** (A ROUTINE IS INVISIBLE INFORMATION still holds here); asking names them;
the TRADE row still says the trade; the button calls them by name; the name is
over their head; and it survives a reload, because *"if you see them again"* is a
claim about memory.

| mutation | result |
|---|---|
| no neighbour at the spawn | **13 of 18 red** |
| strangers get names without asking | **6 of 18 red** |

Two bugs it caught in my own work while I built it: the neighbour was counted
**twice** (the wrapped people-list already added him, and I added him again), and
the card read **`TRADE: MARISELA`** because `headingOf()` correctly returns the
name once you have asked — right for a heading, wrong for that row.

Neighbouring gates held: CITY PEOPLE 18, ONE WORLD TAB 120, ZOOM SEAM 7,
HUMAN START 9, THE ONE LINK 8.

## WHERE PAOLO CAN SEE IT

**RUN tab.** Land, take one step toward the person standing there, tap the
button, tap Ask their name.
