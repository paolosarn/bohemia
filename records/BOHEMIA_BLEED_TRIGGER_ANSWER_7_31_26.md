# WHEN DOES A CHARACTER START BLEEDING? (answering Paolo, 7/31/26)

> "How do we define when a charactwr takes blood loss."

Direct question, direct answer. I went and read how the best-engineered game in
this space actually defines it, because guessing at this one produces exactly the
fiddly medical simulator you do not want.

**THE ANSWER, ONE LINE: BLEEDING IS A PROPERTY OF THE WEAPON THAT HIT YOU, NOT
OF HOW MUCH HEALTH YOU LOST.**

That is the whole idea, and it is the opposite of how most people would build it.
Bleeding is not "you dropped below 50%" and it is not "you took a big hit." It is
"the thing that hit you was sharp, or it was a bullet." A baseball bat can take
you to the edge of death and you will not bleed a drop. A knife can barely scratch
you and you will.

---

## WHERE THAT COMES FROM (real code, cited)

Cataclysm: DDA, `src/monster.cpp:2445-2447`, verbatim:

```cpp
if( du.type == damage_bullet || du.type->edged ) {
    make_bleed( source, 1_minutes * rng( 0, adjusted_damage ) );
}
```

Four things are settled by those three lines:

1. **THE TRIGGER IS THE DAMAGE TYPE.** `bullet`, or anything flagged `edged`.
   Their `data/json/damage_types.json` flags exactly two types edged — `cut` and
   `stab` — and pointedly does NOT flag `bash`. So blunt force never bleeds you.
2. **THE SEVERITY IS THE DAMAGE THAT GOT THROUGH.** `adjusted_damage` is the
   damage AFTER armour and after the crit/graze multiplier
   (`creature.cpp:1552`). Armour that stops the hit stops the bleed with it.
3. **A GRAZE CAN ROLL ZERO.** `rng( 0, adjusted_damage )` starts at zero, so a
   light hit from a sharp thing often does not bleed at all. Bleeding is not
   guaranteed by the weapon, only made possible by it.
4. **IT IS PER BODY PART, AND ONLY THE REAL ONES.** Their bleed effect declares
   `"main_parts_only": true` (`data/json/effects.json`) — you bleed from a limb,
   not from a fingertip.

Their severity ladder, from the same effect definition: `max_intensity: 40`
across five named bands — Minor Bleeding / Bleeding / Bad Bleeding / Heavy
Bleeding / **Heavy Arterial Bleeding** ("Blood is gushing from you like a
fountain!"). `int_dur_factor: 60`, so intensity and remaining time are the same
number in different units, and `max_duration: 2400` turns = 40 minutes.

HONEST LIMIT: `monster.cpp:2445` is the MONSTER side of the hit, which is the
path I read end to end in the C++. The player side routes through their JSON
on-hit effects, which I did not fully trace. The trigger rule is the same in both
directions in play, but I am telling you which one I actually read.

## THE REAL-WORLD HALF (because everything in Bohemia is grounded)

This is not just a game convention, it is roughly how trauma actually works.
Blunt trauma kills by breaking things inside you; penetrating trauma —
knives, bullets — kills by opening vessels. That is why battlefield medicine's
first letter is M for Massive haemorrhage, why a tourniquet is for a limb with a
hole in it and useless for a crush injury, and why "was it sharp" is the first
question that matters. The five-band ladder above maps onto the real distinction
between a venous ooze you can pack and an arterial bleed that will kill you in
minutes.

---

## WHAT I RECOMMEND FOR BOHEMIA

Three rules. All three are the shape, not numbers.

**RULE 1 — SHARP OR SHOT, NEVER BLUNT.** A fist, a bat, a fall, a car: no
bleeding, ever. A knife, a blade, a bullet: bleeding is possible. This gives
every weapon in the game a second personality for free, with no extra system:
blunt weapons are safe and slow, sharp ones are fast and cost you afterwards.

**RULE 2 — ONLY WHAT GOT PAST YOUR CLOTHES.** Severity comes from the damage
that actually landed, not the damage that was thrown. This makes a jacket a real
medical decision, which is worth a lot in a game whose whole progression is
clothing.

**RULE 3 — MOST HITS DON'T.** The roll starts at zero, so a graze usually costs
nothing. This is the rule that keeps it from becoming a chore, and it is the one
that satisfies clause 6 of your own camp law: a player who does not want to care
about this must still be able to play. If every knife nick meant stopping to
bandage, the camp stops being a choice and becomes a tax.

That third rule is also my answer to the older question you asked on 7/27 —
whether you always have to prevent blood loss after every fight. **No.** Most
fights leave you nothing to do. The ones that opened you up properly leave you
with something that will genuinely hurt if you ignore it. Recorded before as
option 2, ONLY SERIOUS, in `records/BOHEMIA_BLOOD_LOSS_OPTIONS_7_27_26.md`; this
is the same recommendation with a real mechanism under it instead of a preference.

## WHAT I AM NOT DECIDING

- The actual numbers: how long a bleed lasts, how much it costs you per tick,
  how many severity bands we have, the odds on the roll. Yours.
- Whether the companion pulling a bullet out (clause 8 of the camp law) is what
  STOPS a bullet bleed or is a separate thing that happens after. Yours, and it
  is the one place this touches content you reserved.
- Anything to do with damage numbers. NO DAMAGE BEFORE THE DIAL.

Nothing is built. This is paper, and it is paper on purpose.
