# BOHEMIA ADDENDUM — A HAIRCUT IS A LUXURY (Paolo 8/1/26, LOCKED)

> "getting haircuts and getting bleach and hair color to dye your hair in this
> economic apocalypse probably sounds like it would be pretty difficult or a
> luxury so I think a lot of people would have either longer hair or like trimmed
> hair, but I don't know if there will be a lot of basically having like a fade
> like a modern day fade of hair like that's a luxury reserved for Rich people so
> maybe we can lock that behind some gameplay mechanics or something. **I want you
> to mark it down in the system, whatever happens**"
> — Paolo, 8/1/26, in the wave-1 hair verdicts

## WHY THIS IS CANON AND NOT A CONTENT NOTE

He did not say "make fewer fades." He said grooming is an ECONOMY, and told me to
mark it down in the system. That makes it a rule about the world, and it lands
here rather than in a comment because it will outlive the 26 shapes that provoked
it.

It is also grounded, which is the standing requirement for everything in Bohemia:
a fade needs clippers, clippers need power or a charged battery, and it needs
somebody with the skill and the time to cut it and to re-cut it every two or three
weeks. Bleach and dye need manufactured chemistry that nobody in the valley is
making any more — the existing stock is finite and it is being spent, never
replaced. **A sharp fade is not a look. It is a receipt.** It says this person has
reliable power, a barber, and the standing to spend both on their appearance.

Long hair and roughly-trimmed hair are the honest default, because they are what
happens when nobody is maintaining anything. Hair grows for free.

## THE RULE

1. **UNMAINTAINED IS THE DEFAULT.** Across a population, long and roughly-trimmed
   shapes dominate. This is a distribution law, not a ban.
2. **A FADE IS A LUXURY SIGNAL.** Any shape whose defining feature is a machine
   taper — a fade, a sharp lineup, a flattop — reads as wealth, standing, or
   access to power. It is not a neutral option.
3. **SO IS COLOUR.** Bleach and dye are finite manufactured stock. A vivid,
   maintained colour carries the same signal as a fade.
4. **IT WILL BE GATED, MECHANISM [PENDING PAOLO].** He said "maybe we can lock
   that behind some gameplay mechanics or something." The intent is locked; the
   mechanism is HIS and is not to be invented here. What is forbidden meanwhile is
   handing every citizen a fresh fade for free.
5. **A FADE MUST ACTUALLY FADE.** His separate technical note, recorded here
   because it is the same subject: *"try to fade in a natural skin color that's
   customizable obviously to the hair."* A fade blends hair into that person's
   SKIN TONE, and the blend is customizable per hair colour. A shape that just
   stops is not a fade — which is exactly why SHAVED FADE was killed.

## WHAT THIS IMMEDIATELY MEANS

- SHAVED FADE and FLATTOP are dead (his verdict), and this is why they will not be
  quietly reintroduced as "just another shape."
- The population's hair distribution is not uniform-random over approved shapes.
  It leans unmaintained.
- The wear/pick odds in `engine/bohemia_personlook.js` will need to express this
  once there are enough approved shapes in each class to express it with. Not
  invented now: there are 13 approved shapes and no wealth signal to key on yet.

## WHAT IS **NOT** DECIDED

- The gameplay mechanism that unlocks a fade. **[PENDING, Paolo's call.]**
- Whether the player can cut their own hair, and at what quality.
- Whether hair length grows over time in-game.
- Any faction, class, or district association with a particular shape.

MECHANISM-MINE / CONTENTS-PAOLO'S: the distribution machinery is mine to build
when there is something to distribute. Which shapes signal what, and what it costs
to buy one, are his.

## GATE

`hair_gate.js` holds clause 5's consequence that a machine can check today — that
no approved shape claims to be a fade without blending into skin tone — plus the
graveyard registry keeps SHAVED FADE and FLATTOP dead. The distribution clause
gets its gate the turn the distribution is built, per A LAW WITHOUT A MACHINE GATE
IS NOT ENFORCED.
