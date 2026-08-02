# SOMEBODY TO ACTUALLY TALK TO — 8/2/26, PEOPLE lane

Paolo, in these words:

> "can you just have one extra NPC chilling outside the spawn in the suburb that
> I can just talk to and test out your mechanics?"

Done. Walk out your front door and he is **two tiles away**.

---

## WHY HE HAD TO ASK, WHICH IS A MEASUREMENT AND NOT AN EXCUSE

The sim's `roam()` sends every idle body to a **random tile anywhere on a 128x128
block**. So the nearest person standing outdoors was routinely **99 tiles** from
his front door, and often there was nobody in sight at all. Everything this lane
has built — the one button, the identity card, asking a name, and the name over
their head — was reachable only after a long walk and a lot of luck.

Measured, both ways: with the fixture removed the nearest body is **99 tiles**;
with it, **2**.

---

## HE IS A REAL RESIDENT, NOT A PROP

A prop would test nothing. He takes a real seat in a real house, is built by the
agents module's own `makeAgent`, and resolves to an ordinary person: a real trade
(the run calls him **TALK TO THE KEEPER**), a real household seat, a real card, a
name you have to ask for, and a name that appears over him once you have.

**One flag** is special: `porch:true`, which means he walks to one spot and stays
there instead of roaming.

---

## THREE OF PAOLO'S OWN LOCKED RULINGS SAID NO TO MY FIRST VERSION

Each one was caught by a gate, and each one was a real break, not a technicality.

### 1. He became a fifth family
The first version gave him a free seat in the nearest **empty** house, which made
him a household of one. The starting block then held **five families instead of
the four he ruled on 8/1**, and one of them was a man living alone, which is not
what "four families" means in English.

**Fixed:** he joins an **existing** household — the nearest occupied house that is
not yours. Four families stay four (`3/3/3/2`), each still a family.

### 2. He survived the dial at zero
Added unconditionally, he was still standing there at dial 0, so the ghost valley
was not a ghost valley and the bottom of Paolo's slider was a lie.

**Fixed:** he is only added if the block already has residents. Dial 0 → **0
bodies**.

### 3. He plugged a walkway
This is the interesting one. A body that never moves **permanently removes a
cell** (OCCUPANCY LAW: one body per cell), so parking him on a driveway is not a
decoration, it is a wall. At 15:00 three bodies sat stacked at (4,28) (4,29)
(4,30), all wanting home — **two of them ordinary residents queued behind him** —
and `run_people_gate` went red on "every body is indoors after the edit". Not
because the bulk edit missed anybody, but because they could not walk.

**Fixed:** he stands on **open ground**. The candidate with the most walkable
neighbours wins, nearest breaks the tie, and a cell with fewer than four open
sides is a corridor, not a place to loiter.

### And a fourth thing the surface said no to
Placed adjacent to your own door, the one contextual button prefers **the door you
are standing at** over the person next to you — so it read GO INSIDE and the
conversation was unreachable. He stands 2 to 5 tiles out: past the doorway, still
right there.

---

## HE IS INSIDE MASS EDITS LIKE EVERYBODY ELSE

He joins the roster **before** the person-facts pass, so Paolo's 7/29 law holds on
him: add a rule and it reaches him. Verified on the real surface — with the rule
that sends everyone indoors, he goes indoors.

## THE GATE

- **C4c** nearest body on the street is 2 tiles away, not across the block
- **C4d** and he is standing on open ground, not plugging a walkway
- plus the whole existing chain now runs against him: C6 reads
  **TALK TO THE KEEPER**, the card opens, asking names him, the name appears over
  his head

| mutation | result |
|---|---|
| no porch NPC at all | C4c red — nearest body 99 tiles |
| the porch flag ignored, so he roams | C4c red — nearest body 99 tiles |

Gates: PEOPLE 150 -> **152**, RUN PEOPLE 45 (recovered from 43/2), FOUR FAMILIES
holds at 4, dial-to-zero holds at 0.

## WHERE PAOLO CAN SEE IT

**RUN tab.** Walk out the front door. He is two tiles away. The button says TALK
TO THE KEEPER. Tap it, tap "Ask their name", leave, and his name is over his head.
