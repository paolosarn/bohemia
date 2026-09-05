# A STRANGER OPENS IT (RUN, 9/5/26)

VAMILY job `[hands now]` / HANDS-NOW, the row the coordinator put at the top of
this lane when RELEASE was folded in.

Paolo 9/5: *"I do want to get a demo into people's hands immediately though but
there's so much to do."* The lane rule that came with it: **the demo is never
held for more content. What exists today is the demo.**

## THE COLD WALK, MEASURED

The demo opened on a phone-sized screen, touch only, no saved game, no dev
knowledge, pressing only what the screen offered.

| | |
|---|---|
| the demo loads in | **572 ms** |
| one tap puts a walked world up in | **1,669 ms** |
| page errors on the way in | **0** |
| what the front door says | **"TAP TO ENTER"**, and nothing else |
| ground reachable on foot from the spawn | **200,914+ cells** (the flood hit its cap) |
| the demo on disk against a fresh cut | **byte-identical** |

That last line is the one that could have ruined a handoff and did not: the demo
was re-cut and compared byte for byte, so **the link a friend opens is today's
game**, not a stale build. The demo's shell is cut from the alpha and the walked
city is LOADED at runtime rather than embedded, so the city half is current by
construction.

**The opening is healthy.** There is no blocker between a stranger and the demo.

## THREE THINGS I FOUND AND DID NOT CALL BUGS

Each of these looked like a finding and was not. Writing down why is the point.

**1. There is no fight in the demo.** THE DEMO IS SCOPED (Paolo 8/4) to the
origin, the vista and one good day. The row's phrase "the first fight" is
inherited wording; failing on the absence of a fight would be enforcing a scope
he never set.

**2. The walk pad is 42x42 px against a platform minimum of 44.** The map-move
pad is already 46, so the layout would carry it. But all 160 taps in the walk
registered, so there is no evidence it stops anybody, and growing an approved
circle is an art call rather than a gate's. The number is now **reported every
run and floored so it cannot get worse**, with the 2px gap named in the message
so the next reader sees it. That is the honest handling: measure it, hold it,
don't manufacture a blocker out of it.

**3. The clock read zero minutes over 160 presses.** That looks exactly like a
stopped clock. It is not: a human step costs **0.084 minutes** because it is one
small cell, distance-honest, on purpose. City mode's 10 minutes is a different
scale, not the same thing broken.

## AND TWO BROKEN RULERS OF MY OWN, BOTH CAUGHT BEFORE THEY WERE REPORTED

The first cold walk **pressed all eight directions in turn**, measured a net
displacement of three cells over two hundred taps, and very nearly got written
up as "the player cannot move." It was walking a circle. **The harness was
measuring itself.**

The second read **`city.x`, which human mode does not use at all** -- the walked
position is `hx`/`hy`. That one would have reported a completely frozen player.

Fifth and sixth time in two weeks on this lane. The rule that keeps paying:
**check the ruler before you report the reading.** The gate presses one
direction, for that reason, and says so in its own header.

## WHAT SHIPPED

`gates/a_stranger_opens_it_gate.js`, 15 checks, registered as STRANGER OPENS.

It is deliberately not THE WHOLE DEMO. That gate walks the demo end to end **as
somebody who knows the way** -- it presses the right thing because it was told
which thing is right, which is the correct test for "does the day work" and the
wrong test for "can a person who has never seen this get in." A stranger spends
their first thirty seconds on questions a walkthrough already knows the answers
to: what is this, where do I press, did anything happen when I pressed it.

It holds: the demo opens under a ceiling; the front door fills the phone and
tells him what to do in words; the tab is named so a shared link is not
"untitled"; one tap puts a walked world up; the cutscene can be declined; he
stands on ground he can walk off; the valley opens rather than boxing him in;
all eight directions are on screen; **nothing is sitting on top of them**; the
pad has not shrunk; and pressing a direction actually moves him.

It **reports every number** rather than only asserting it, because a stranger's
patience is a real budget and the only way to know it is being spent is to see
it every run.

### Mutation proof

- A transparent scrim over the walk pad -- the exact bug this lane shipped and
  caught once before, when a card's own backdrop sat on the controls -> **2 red,
  and it names the culprit by id** ("covered by MUTSCRIM") rather than only
  reporting that the game stopped working.
- Deleting the words "TAP TO ENTER" from the front door -> **1 red**, printing
  what the screen said instead.

## RESULT

    STRANGER OPENS 15/0 (new) · WHOLE DEMO 23/0 · DEMO BUILD 25/0
    the demo cut re-run and byte-identical

No game code changed. No approved pixel moved.

## THE ROW IS DONE, AND A RULING LANDED WHILE IT WAS BEING DONE

The row originally ended with "hand the link to ONE friend this round and write
down what they did." **Paolo killed that half on 9/5, LOCKED:** the
friend-watching idea -- telemetry, friend rounds, notes on what a friend did --
is dead, *"I don't give a fuck about that"*, and it is never to be proposed
again. The row now reads: take the demo as it is today, walk it once end to end,
fix only what stops a stranger, and **the link is ready to hand to anyone.**

So the ship test is the one that was met. The demo is current, it opens on a
phone in half a second, one tap puts you in the world, nothing errors, and there
is no blocker between a stranger and the game. Nothing was "fixed" to invent a
first fight, because his own 8/4 scope says there isn't one.

The link is the same one it has always been.
