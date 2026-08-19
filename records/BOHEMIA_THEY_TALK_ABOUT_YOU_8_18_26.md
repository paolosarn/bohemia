# THEY TALK ABOUT YOU (8/18/26, PEOPLE lane)

## THE LOOP CLOSES ON ITSELF

Yesterday shipped three things in sequence: enough people on a street to hold a
conversation, two of them talking to each other, and the ability to **ask** them
about what you overheard.

Every one of those was the world talking *at* you. This is the world talking
**about** you, and it only happens because of what you did.

Measured on the real street:

    BEFORE he has asked anybody anything
      world: { asked: 0, known: 0, names: 0 }
      conversations overheard: rumor-quiet
      about him: NONE

    he goes round asking three people about three subjects
      world: { asked: 3, known: 0, names: 0 }

    AFTER
      about him: you-asking-heard

And what he walks in on:

    "Asking who?"
    "Anybody who will stand still. Not from here, whoever it is."
    "Then they will run out of people who stand still."

The opening line he never hears is *"Somebody has been going round asking about
the water"* — which is exactly what he had just been doing.

**Your investigation has a social cost, and you find out about it by
overhearing it.**

## THE WITNESS MAKES IT REAL

> **`Q062.P6 "W6 (external validation / the witness makes it real"`** — *"a
> Bohemia moment can be validated by a trusted WITNESS ... turning a possible
> delusion/rumor into shared TRUTH."*
>
> **`Q003.W8 THE WITNESS WHO KNOWS`** — *"side with the one who's SEEN it, or the
> one who PAYS you."*

So every exchange about you exists in **two versions**, and which one fires
depends on whether either speaker has actually met you.

**Nobody has met you** — they hedge:

    "They have been taking names."
    "Taking them where?"
    "Nowhere. Just taking them. That is the part I do not like."
    "A name is the one thing you cannot hand back after."

**One of them has met you** — they state it flat:

    "They asked me what I am called."
    "Did you tell them?"
    "I did. And they said it back to me, once, like they were putting it
     somewhere."
    "Then it is somewhere."

The research says the same thing from the other end: across open-world
reputation systems, **the times you are caught are what count**, and undetected
acts contribute nothing, because people react to what they witnessed.

## AN EXCHANGE ABOUT YOU THAT FIRES WHEN IT IS NOT TRUE IS THE WORLD LYING

Every about-you exchange names a **condition** and a **witness state**, and the
factory refuses to build one that names neither. The conditions are counters the
city really keeps:

    asked   how many subjects you have gone round asking about
    known   how many people you have met
    names   how many names you have taken

`Q007.W10 CROSS-SYSTEM CONSEQUENCE` — *"the deed echoes into the wider game"*.
**Going round asking questions is a deed.** It costs you the quiet you had.

## AND IT COMES UP WHILE IT IS STILL NEWS

When an about-you exchange is true and unspent, it is picked **before** the
ordinary ones — otherwise the moment would be buried under thirty conversations
about the water and never surface. Once a pair has spent theirs they go back to
the pressure and the shift, so it stays a moment rather than a state you are
stuck in.

## WHAT IS NOT HERE, AND IT IS MEASURED NOT ASSUMED

`engine/bohemia_deeds.js` and `engine/bohemia_standing.js` both exist and
**neither is in the city at all** — zero occurrences, measured. So what you were
*seen doing* is not yet a thing the street can discuss; only what you have been
*asking* is. Two whole modules that know what the player did, not present on the
surface he plays. That is a reach gap for somebody, and it is written down rather
than worked around.

## THE MACHINE

`gates/exchange_gate.js` — now **31 assertions**, six of them new for this axis.
Mutation tested:

    about-you fires whether it is true or not
      -> A13, A14, A15 FAIL, and B12 FAILS ON THE REAL STREET naming
         you-asking-heard as being discussed before he had done anything
    the witness split is ignored
      -> A14 + A15 FAIL (6 seen vs 2 heard instead of a clean split)

Two of my own gate assertions were wrong and were fixed at the ruler, not the
target:

- **A8** counted against `forPair` (the whole table) while `nextFor` draws from
  the **eligible** subset, so it demanded more unique draws than the pool holds.
- **B12** ran after B11, which sets the dial to 1 to prove the solo bark still
  works with nobody around — and left it there, emptying the street of the pairs
  a conversation needs. Caught by the section failing with one lonely exchange in
  sixty renders.

All 24 new lines are `draft:true` and editable in the WORDS tab.

Tool: `tools/bohemia_exchange_factory.py` (same table, same runtime, same bubble
— REUSE-FIRST: this is not a second system).
