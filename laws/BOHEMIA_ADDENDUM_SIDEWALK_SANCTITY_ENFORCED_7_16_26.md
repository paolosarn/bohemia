# BOHEMIA — SIDEWALK SANCTITY: ENFORCED (7/16/26)

## The law had a body count and no gate
RF0 went DOWN on 7/14 and took RUIN FLANKS to the graveyard with it:

> "SIDEWALK SANCTITY: nothing on sidewalks except lamp posts and street
> furniture; buildings/ruins live PAST the sidewalk (zone not yet designed);
> buildings do not go on streets"

The response was to delete the ruin-flank function and leave a comment above
its corpse. That is not enforcement. Any future recipe, any future prop pass,
any future me could walk a building right back onto a sidewalk and nothing in
the engine would object. The law was one careless line from dying again.

## Now it is a whitelist and a choke point

```js
SIDEWALK_LEGAL = street_lamp, fire_barrel, traffic_light, ped_signal, bench,
                 trash_can, hydrant, mailbox, street_sign, bus_stop,
                 newspaper_box, planter, bollard
placeProp(cell, prop)   // every placement goes through here
auditSidewalks(block)   // post-gen audit, returns every violation
```

`placeProp` is the only way a prop reaches a cell. A prop that is not street
furniture **cannot land on a sidewalk by accident, in any recipe, ever.** The
car-wreck placer now goes through it too, and only counts a wreck as placed if
it actually landed — so if a lane row ever resolves onto a sidewalk cell, the
count tells the truth instead of the grid lying.

The whitelist is furniture that belongs on a real Vegas sidewalk. It is a list,
so it is one line to extend when you name something.

## Gate: `sidewalk_gate.js`, 13/13
Swept **1,200 blocks** (400 seeds x street/freeway/residential):
**0 violations, 3,600 lamps, 1,780 barrels.** The law is a whitelist, not a
ban — the gate proves the furniture still shows up, because a law that empties
the sidewalk is just as wrong as one that lets buildings onto it.

Also checked: the choke refuses a ruin, a wreck, and a building stamp on a
sidewalk; allows a lamp and a bench; never blocks a lane cell; `ruin_flank`
stays out of the whitelist so the graveyard stays final; and street gen is
still deterministic through the choke.

## Sync
BOH_BLOCKGEN re-inlined into all 6 carriers. Sync gate green, 11 modules.
Graphics 83/0, sidewalk 13/13, tan 12/12, scale 12/12, lightreg 25/25.

## The pattern, three for three now
ENGINE SYNC LAW, TAN WALL LAW, SIDEWALK SANCTITY. Every one was locked, filed,
and enforced by nothing but memory and a comment. Each one was already violated
or one edit away from it. A law that only exists in a document is a law the
engine does not know about.
