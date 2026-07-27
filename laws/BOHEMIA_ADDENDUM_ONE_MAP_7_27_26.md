# ADDENDUM — THE ONE MAP, AND THE NARROW UNPARKING OF QUESTS (Paolo 7/27/26, LOCKED)

## HIS WORDS, VERBATIM

> "Two jobs. First, THE ONE MAP, my order at the top of your queue: the phone's
> map app becomes the real city-builder valley map with quest locations pinned
> on top."

## THE LAW

**There is ONE valley map.** The phone's map app and the city builder show the
same valley from the same source of truth, the way zoom-build already works: one
world, rendered at different magnifications, never two drawings that can disagree.

A player who opens the phone in the run and a player who opens the builder are
looking at the SAME PLACE. If those two can drift — different seed, different
district, different anything — the map is decoration, not information, and a
quest pin on it means nothing.

## THIS NARROWLY UNPARKS QUESTS FOR THE WORLD LANE

laws/BOHEMIA_ADDENDUM_WORLD_BEFORE_QUESTS_7_26_26.md parked every quest item in
this lane: *"We are not ready to worry about quest right now we need to actually
build a fucking world."* That ruling stands and it is why the last several ships
were ground and nothing else.

Today he ordered quest locations pinned on the map, and named it top of the
queue. Newest date wins (TRUTH HIERARCHY), so quests are unparked **for exactly
this and nothing else**:

- ALLOWED: reading where a quest already resolves to, and drawing a pin there.
- STILL PARKED: quest placement candidates, casting, the placement judge, the
  bridge, authoring quests, changing how a quest gets a location.

The pin is a READER. It does not decide where anything goes. If a quest has no
location, the map shows no pin for it and says how many are unplaced, rather than
inventing one — which is the same MECHANISM-MINE / CONTENTS-PAOLO'S line
everything else in this lane holds.

## WHY ONE MAP IS THE RIGHT CALL AND NOT JUST TIDINESS

The valley is 96x96 cells and the overmap is generated from a seed. Two
independent renderers means two chances to render a different seed, and that has
already happened once in this repo: the MAP tab sat on the literal seed 1337 for
months while the game booted the text seed 'bohemia', so the map Paolo explored
and the world his quests were cast into were two different valleys. That was
caught on 7/26 and pinned by a gate. A second renderer is a second chance to make
exactly that mistake, and the fix is not vigilance, it is a shared source.

## THE GATE

A law without a machine gate is not enforced. `one_map_gate.js`: both surfaces
resolve the same seed, the same cell answers the same way through the shared
model, and a pin only ever appears where a quest really resolves.

## RELATED

- laws/BOHEMIA_ADDENDUM_WORLD_BEFORE_QUESTS_7_26_26.md — the park this narrows
- laws/BOHEMIA_ONE_LINK_LAW (CLAUDE.md) — one alpha, one link; same instinct
- BOHEMIA_BACKLOG.md WORLD item 0 — where this order was already filed
