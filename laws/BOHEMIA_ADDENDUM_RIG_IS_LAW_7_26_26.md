# BOHEMIA ADDENDUM — THE RIG IS LAW (Paolo 7/26/26, LOCKED)

## THE RULING, HIS WORDS

> "Bro, it's crazy to me. You were fucking around this whole time. The rig is
> law right this wherever you need to, the rig is the body law like for any
> animations or customization like no wonder you're having an issue making the
> female body, like the rig is law."

**THE RIG TOOL'S BODY IS THE CHARACTER.** Not a source, not a reference, not one
input among several. Whatever is painted in the rig IS the body, everywhere, for
animation, for customization, for combat, for the city, for anything that ever
draws a person. No other copy of the body may exist and nothing gets to
reconcile, merge, adapt or "fix up" what he painted.

## WHAT THIS WAS RULING ON

The alpha was carrying TWO painted bodies:
- `BAKED` — what the CHARACTER and ANIMATION tabs drew
- the `BAKED` inside `RIG_B64` — what the RIG tab, his authoring surface, drew

They differed in **20 painted parts, 65 pixels, and the pose**. The neck was
smaller in the game in all eight directions (S 8px→4, N 12px→8, E/W 9px→6,
SE/SW 10px→6); the head was smaller (S 24→20, N 92→80); the torso differed in
every direction; the face differed on E and W.

So he opened his rig, saw the body he painted, opened ANIMATION, and watched a
different body move — while being told the renderer was the problem. **Every
character-motion verdict he was asked for was taken against art he never made.**
Full finding: `records/BOHEMIA_RIG_NOT_REFERENCED_7_26_26.txt`.

## HIS SECOND POINT, WHICH IS THE BIGGER ONE

> "no wonder you're having an issue making the female body"

He is right, and it reframes the dead woman-rig arc
(`laws/BOHEMIA_ADDENDUM_ONE_RIG_VARIATIONS_7_25_26.md`). Four versions were
derived, judged and killed — all of them transformed from the alpha's drifted
copy, not from the body in the rig. A derivation is only ever as good as what it
derives FROM, and nobody checked what it was deriving from. The same applies to
the body variation sliders and to anything else built on top of the body: they
were all standing on the wrong art.

**This does not resurrect the female rig** — that stays graveyard-final, and one
rig with sliders is still the answer. It does mean every future derivation
starts from the rig, and says which body it read.

## THE LAW

1. **THE RIG'S BAKED IS THE BODY.** One painted body in the repo. The alpha's
   `BAKED` is byte-identical to the rig tool's `BAKED`, always.
2. **THE RIG IS UPSTREAM, ALWAYS.** Edits flow rig → game. Nothing writes back.
   No session "improves" the painted body outside the rig, ever — that is RIG
   LAW's sacrosanct-regions clause, now with a machine behind it.
3. **NO SECOND BODY, ANYWHERE.** No embedded surface, no bake, no cache may
   carry its own copy. Downstream surfaces get sprites baked from the one body
   at runtime. (Verified: COMBAT_B64, CITY_B64 and PREFAB_B64 carry none.)
4. **ANYTHING DERIVED FROM THE BODY NAMES ITS SOURCE.** Sliders, transforms,
   candidates: the docstring says which body it read, the way REUSE-FIRST makes
   a cook name its bank.

## WHY NOTHING CAUGHT IT FOR WEEKS

ENGINE SYNC LAW guarantees one canonical body per `BOH_*` module and sweeps the
whole tree for drift. `BAKED` is not a `BOH_*` module, so it was never covered.
The one law that exists precisely to stop "two copies of the same thing" had a
hole exactly the shape of the character. That is the lesson worth more than the
fix: **a sync law that only covers what is conveniently named is not a sync law.**

## THE MACHINE

- `tools/bohemia_rig_is_law_patch.py` — installs the rig's body into the alpha,
  verbatim, refusing any partial or mismatched export. Idempotent.
- `tools/bohemia_rig_sync_audit.js` — diffs the two bodies part by part.
- `gates/rig_is_law_gate.js` — byte-identity, exactly one body in the alpha, no
  body inside any other embedded surface, rig-to-game flow intact.

## DONE THIS TURN

The alpha now draws the rig tool's body verbatim: 20 painted parts replaced, 65
pixels closed, pose replaced. Nothing was reconciled or hand-adjusted — his file
was copied over the drifted one.
