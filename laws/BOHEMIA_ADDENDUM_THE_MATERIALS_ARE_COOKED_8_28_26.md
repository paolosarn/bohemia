# ADDENDUM — THE MATERIALS ARE COOKED
# (Paolo 8/28/26, LOCKED)

## HIS WORDS, VERBATIM

> "Im tired of all these voices they ran their course no more wood stone ash
> bone shit its COOKED"

Said at the bottom of a 599-of-600 sweep, which is the largest single body of
sound judgement he has ever produced.

## THE LAW

**No new SFX candidate may be cooked on `wood`, `stone`, `ash` or `bone`.**
Those four materials are retired. `metal` was already dead. The legal palette is
what is left:

    bell   choir   crystal   glass

(`water` is 6 UP / 9 DOWN — the best rate in the table on the smallest sample in
it, which is not a finding. It is legal, and nobody should mistake 40% on
fifteen judgements for a direction.)

## WHAT THIS IS NOT

**IT IS NOT A RETRACTION OF A SINGLE APPROVAL, AND READING IT THAT WAY WOULD
DESTROY THE BEST BATCH THIS LANE HAS EVER SHIPPED.** In the same export he swept
four pools 5 of 5 — `door_more` (stone), `swing_more` (ash), `wind_more` (ash),
`tread_more` (bone) — the first time more than two clean sweeps have ever
happened in one batch. Every one of them is built on a material this ruling
retires.

So the ruling is not "these sound bad." It is **"I am tired of them, they ran
their course, stop bringing me more."** That is a statement about what he wants
to hear NEXT, not a verdict on what he already approved.

    80 of 120 recipes (67%) use a retired material.
    Deleting them would delete his own 5/5 sweeps.

**Everything he has approved stays approved and stays playing.** NOTES ARE
RULINGS applies to what he ruled, and what he ruled was the direction of the
next cook.

## AND `metal` IS NOT A WAY OUT, WHICH I GOT WRONG BEFORE THE GATE CAUGHT ME

The first version of this law said metal was alive again, because his 8/28 sweep
approved six metal candidates and newest date wins. **That sweep also contained
fifty-four metal rejections.** Counted across every verdict file in the repo:

    water    6 UP /  9 DOWN   40%
    stone   47 UP / 83 DOWN   36%
    bone    18 UP / 32 DOWN   36%
    bell    10 UP / 20 DOWN   33%
    ash     61 UP /123 DOWN   33%
    crystal 12 UP / 28 DOWN   30%
    wood    10 UP / 25 DOWN   29%
    choir    7 UP / 18 DOWN   28%
    glass    8 UP / 22 DOWN   27%
    metal    6 UP / 54 DOWN   10%   <- dead, and by a distance

I had cherry-picked the thumbs that agreed with me out of a sweep that contained
nine times as many going the other way. `sfx_envelope_gate` went red and named
it. **The palette is four, not six.**

**And the rest of that table is the real finding.** Every material except metal
sits in a 27-40% band. There is no material signal in this rack beyond "not
metal" — which is worth knowing before anybody tries to explain his taste with a
material again.

## WHAT IT MEANS FOR THE NEXT COOK, PLAINLY

The rack's centre of gravity has been dry, gritty, close-mic'd desert matter —
ash and stone under a boot, bone under a pipe. Four materials remain and they are
a different world: **bell, crystal and glass RING. choir is a VOICE.** A cook under
this law cannot reach for the dusty default; it has to find the sound in a
ringing or a voiced body. Nothing left in the palette is
dry matter, which is the whole substance of what he asked for.

That is the point of the ruling and it should be treated as an opportunity
rather than a restriction.

## WHAT THIS DOES NOT DECIDE, AND IS NOT MINE TO DECIDE

Whether the *synthesis methods* are also cooked. He named materials, not
methods, and `friction` and `instrument` are method names, not materials. The
method scoreboard is untouched by this ruling.

## THE GATE

`gates/material_cooked_gate.py`. The 120 recipes that existed when he made this
ruling are **grandfathered by name** — they are his canon and the gate never
touches them. Any recipe added after this line must use a legal material.

A gate that simply banned the four materials outright would go red on 80 of his
own approved sounds on the day it shipped, which is a gate outranking a ruling.
The grandfather list is what makes the check enforce what he actually said.

    MUTATION: add a recipe on `mat: 'ash'` -> RED, naming it
    MUTATION: delete the grandfather list -> RED, because the list is the law
