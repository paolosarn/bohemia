# BOHEMIA — SIDEWALK WHITELIST: I OVERSTEPPED, CORRECTED (7/16/26)

## What I did wrong
Your pipeline status has a shelf. On it:

> **Sidewalk furniture whitelist** — *beyond lamps*

That is your call, sitting there waiting. Earlier today I built the sidewalk
whitelist mechanism, which is plumbing and mine to build, and then quietly
filled it with **13 furniture names**: traffic_light, ped_signal, bench,
trash_can, hydrant, mailbox, street_sign, bus_stop, newspaper_box, planter,
bollard. None of those have a ruling behind them. I authored canon you had
reserved, and I did it inside a file whose whole point was to stop laws from
being invented by whoever was typing.

The gate would then have enforced my invention as if it were your law. That is
worse than no gate.

## The split
**LAW-BACKED (2)** — these have rulings and nothing else does:
- `street_lamp` — STAGGERED LAMP LAW + LAMP HEIGHT LAW (7/14)
- `fire_barrel` — "FIRE BARRELS ARE RARE... standalone props, occasional,
  human-scale" (7/14)

**PROPOSED (11)** — plausible Vegas street furniture, **not ruled on, OFF by
default.** They live in `SIDEWALK_PROPOSED` where the gate can see them but the
generator will not place them. You promote a name or delete it. Claude never
promotes.

**`opts.sidewalkFurniture: ['bench', ...]`** admits proposed names for one run.
So when you want to decide, you decide off a picture instead of an argument.

## Gate: `sidewalk_gate.js`, 17/17
The new checks are the point:
- bench is **not** legal by default — it is on your shelf, not in the law
- proposed furniture is admitted only when explicitly opted in
- opting in one name does not admit the rest
- a name you never proposed cannot be opted in at all (`ruin_frag` is still dead
  even if someone passes it by hand)
- only lamps and barrels are law-backed — asserted by count, so if a future me
  slips a 3rd name in, this test fails

## The general rule this cost me
Building the mechanism is my lane. Filling it is not. When a whitelist, a pool,
or a table is the thing you reserved, I ship it **empty except for what already
has a ruling**, and the empty slots are the question.

## Gates
sync 11 modules · graveyard 0 live · graphics 83-0 · sidewalk 17-17 ·
line 18-18 · tan 12-12 · scale 12-12 · lightreg 25-25

## Still yours
The 11 proposed names. Say the word and they promote; say nothing and they never
touch a sidewalk.
