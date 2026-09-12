# COOK — THE ANARCHISTS' MAGENTA IS INSIDE HIS OWN RESERVED BAND
9/13/26 · lane 16 COOK · `[magenta piece]` round 1 · **nothing cooked, and that is the finding**

## THE ROW

> he chose magenta `#c026a0` for the Anarchists and the wardrobe has ZERO garments in that
> family, 317 canon garments and none within 30 degrees at usable saturation. Cook a magenta
> family (shirt first, then one leg or foot piece so the outfit agrees with itself at 38%).

**Rule 12 landed this round** — a dependency on a line is a premise, not a gate; measure
first. I measured the row's own colour before cooking a pixel, and the cook cannot be done.

## HIS MAGENTA IS PURPLE BY THE PURPLE RESERVATION'S OWN TEST

    #c026a0   hue 312.5°   lightness 0.451   saturation 0.670
    the reserved band is hue 265–330, saturation > 0.45, lightness 0.25–0.75
    INSIDE IT.

And not on the allowlist, which carries four entries: `hatch`, `network_hatch`, `agent_iris`,
`neurolink`. The law, quoted in the allowlist's own header:

> **(7/10, LOCKED)** "purple/magenta/violet is RESERVED. ONLY the door/hatch from the tunnel
> into the Network build may carry that purple."

Magenta is named in the law by word. This is not a reading; it is the sentence.

## AND THIS WAS REPORTED SIX WEEKS AGO AND NEVER RESOLVED

`records/BOHEMIA_FACTION_GAPS_RESEARCH_8_2_26.md`, under "three things in his own table he
should see, **reported and not touched**":

> "THE ANARCHISTS' MAGENTA `#c026a0` READS PURPLE on the purple-reservation test — red and
> blue both clear green by more than 25. So does the Colorful's pink `#e85aa0`. Both have
> been live in the alpha for weeks and the purity sweep never caught either, **because that
> sweep only ever looked at art pixels and never at a colour written in code.** That is a
> real hole in the machine regardless of what he decides about the colours."

Two separate things in one paragraph. One is his to decide. **One was mine, and I missed it.**

## I PASSED OVER THIS EXACT GATE LAST ROUND AND DID NOT CLOSE THE HOLE

On 9/12 I fixed `bohemia_purity_gate.py` — it was finding 2,232 violations and exiting 0 —
and I added a second scope for the **shipped tile pools**, because the gate had only ever
swept `banks/`. I was pleased with that. **It still only counted pixels.** A hex literal in a
source file is not a pixel, so three sweeps in a row walked straight past the one magenta that
ends up on a walking NPC.

Closed now. The gate sweeps colours written in code:

    1,983 hex literals across the alpha and engine/*.js
    11 in the reserved band, 5 unique:
      #c848a0  NEON NECROPOLIS (a song accent)
      #b83a8a  RAVE IN THE RUINS (a song accent)
      #c81e8c  a fillStyle in the alpha
      #c026a0  the Anarchists — in the alpha AND in engine/bohemia_dress.js

Ratcheted at 11, may only fall. **Mutation-tested with the exact cook this row asked for:**
adding a three-tone magenta garment ramp to `bohemia_dress.js` takes it 11 → 14 and the gate
goes RED. The row cannot be built as written, and that is a machine saying so, not me.

The 8/2 note is worth keeping in view: magenta in a music-tab gradient matters far less than
magenta on a body. Two of the five are song accents on his own song names. **The one that
matters is the one this row would put on people.**

## WHY THIS IS HIS CALL AND NOT MINE

Two of his own rulings collide, and I cannot resolve it by date: PURPLE RESERVATION is 7/10,
and the fourteen faction colours were already live in the alpha "for weeks" by 8/2 — the same
July. NEWEST DATE WINS decides nothing here.

CLAUDE.md: *"A contradiction between two live files is a BUG, not an interpretation choice:
fix it if mechanical, flag it [PENDING Paolo] if canon-level."* This is canon-level. And it is
both categories EVERYTHING IS A THUMB still sends to him: **identity he reserved** (he picked
all fourteen colours himself) and **a fork with no defensible default** — either answer
overrides one of his own locked rulings.

Cooking it anyway would be finding a legal way to ship something the law forbids, which
STOP PRODUCING names as the violation itself.

## → [PENDING Paolo], ONE QUESTION

Purple means the Amalgamation. The Anarchists' colour is a purple. Which gives way?

**A.** The Anarchists get a new colour outside the reserved band — hot red-pink at ~345°
   still reads as their colour to a person and clears the law. Their identity survives, the
   purple signal stays clean. *(The realistic default: one faction's hex moves, a pillar law
   holds.)*
**B.** The Anarchists keep `#c026a0`, and the allowlist blesses faction colour as a third
   exception beside the hatch and the agents. Purple then means Amalgamation **or**
   Anarchists, and the signal is split.
**C.** The Colorful's `#e85aa0` is in the same band and has the same problem, so rule both at
   once rather than twice.

## WHAT IS NOT BLOCKED

CHARACTER is waiting to wire this, and the wiring is not blocked — only the ramp's hue is.
The moment a colour is ruled, the cook is one tool run: same generator, new ramp, shirt first
then one leg or foot piece so the outfit agrees with itself at 38%.
