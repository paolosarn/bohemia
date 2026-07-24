# BOHEMIA — ADDENDUM: THE SHOPPING CART + THE DEPLOYABLE CAMP (LOCKED)
### 7.24.26 — Paolo (long-held idea): like FFXV's crew driving the Regalia and camping anywhere — but if you have no car (cars are a rare luxury, already canon), your COMPANION follows you pushing a SHOPPING CART. The pseudo-economic-apocalypse mobile-storage-and-camp system. Plus the realism gripe: games let you roam a whole world but never honestly answer HOW you carry your stuff — if it can't fit in your backpack or pockets, what are we doing.

## CORRECTION / EVOLUTION (7/24, same day, Paolo — supersedes the framing below where it conflicts)
1. IT IS A SMART CART. By 2060 it is a salvaged AUTONOMOUS cargo cart that FOLLOWS YOU on
   its own — no one has to push it (a companion walking with it is optional flavor, not the
   mechanism). Grounded in real, shipping-today following-cargo robots (Piaggio Gita, Amazon
   Scout-class autonomous followers) — 35 years on, a jury-rigged self-driving cart is easy
   canon and it is COOL, not pitiful. It rolls itself behind you, deploys into your camp,
   and can be upgraded/kitted (light rig, bigger bed, a mounted whatever — Paolo's call).
2. THE CART DOES NOT EXIST TO DISARM YOU. Scrap the earlier "the cart can't come into the
   wash so you'll be weaponless/helpless" framing — it was a weak contrivance to strip the
   player, and that is not the game. You go into the wash ARMED AND DANGEROUS. The demo's
   flee is scary because of the SITUATION (a flood, their dark, their numbers), not because
   anything nerfed you. The cart is a cool base-building flex, full stop; it is not a leash.

Read-before-build: this EXTENDS three things already locked, it does not reinvent them:
- BohemiaEngine.Inventory (BUILT, 25 tests) — micro/ephemeral player stuff with a real
  `maxWeight` / `canCarry` / `currentWeight` carry-limit already in code.
- The VEHICLE LADDER (GDD v5, LOCKED) — start man-powered (bikes/scooters), cars unlock
  late, gated on the rebuild (grounded in Cuba's bicycle-first Special Period).
- The rare-car SCARCITY note (7/19) — working cars are a super-luxury in the anarchy decade.

## THE PHYSICAL-CARRY LAW (Paolo's realism gripe, now stated law)
You carry ONLY what physically fits on your body — backpack, pockets, belt, a slung
weapon (the existing Inventory `maxWeight`/`canCarry`). Everything beyond that lives in
your MOBILE STORAGE — the CART, or later the CAR. If it doesn't fit on you or in your
cart, you do not have it. No magic bottomless backpack, ever. This is the honest answer
to the thing that has always been done wrong.
- Grounded in the games that DO handle carry honestly: Death Stranding (cargo IS the
  game; bulk rides a vehicle/frame), Kenshi (backpacks + carried bodies), Tarkov / Project
  Zomboid (real weight + space), Resident Evil (space you actually manage). And grounded in
  the realest thing of all: a shopping cart is how a person with no car and no home actually
  moves everything they own. It is the true image of this world.
- ANTI-TEDIUM: the cart is the RELEASE VALVE so physical realism never becomes inventory-
  tetris fatigue. You micromanage only what's ON YOU for the moment; the bulk just lives in
  the cart. You get the FEEL of realism without the chore (the Death Stranding model).

## THE CART IS A THREE-ACT COMPANION — HEIRLOOM-LIKE (LOCKED 7/24, Paolo)
The smart cart is a LIGHT COMBO of three real/known things: today's LA autonomous SIDEWALK
DELIVERY CARTS (Serve Robotics / Coco / Starship — real, on the streets now), WAYMO's
self-driving autonomy, and Fallout: New Vegas's ED-E — the loyal little eyebot that follows
you, beeps instead of talks, and that people genuinely LOVE. You FIND it as salvaged tech
through a QUEST; before that you (or a companion) haul a dumb cart by hand, and the salvage
UPGRADES it into the autonomous companion. Progression: hand-hauled cart -> smart companion
cart -> (rare, late) the car.

### WHY THIS IS BIG: IT SURVIVES ALL THREE ACTS (the fold anchor)
Almost NOTHING lasts the whole game — the generational fold kills dynasts, the family
changes, people you love die and pass on. The cart is one of the very FEW constants that
rides with the dynasty across 100 years. That makes it heirloom-LIKE: a treasured, loyal
machine passed down like the Family Box, patched and scarred across generations, quietly
becoming a physical record of the whole family's history (it literally hauled their lives).
Mechanically it is a MACRO/fold-persistent object (survives the fold like faction standing /
deltas / the Box), while its CONTENTS stay micro — same clean line as everything else.
- ED-E VOICE: it speaks in beeps and lights, no words — fits the squiggle-voice / no-real-
  dialogue direction and is cheap to produce.
- THE BRIGHT MIRROR (theme gold): a machine that becomes FAMILY by loyal service is the
  good twin of the Amalgamation — the machine that COUNTERFEITS family by absorbing people.
  Same question ("can a machine be family?"), opposite answers: the cart earns love over a
  century; the demon demands it by force. Your beloved little robot also makes the thing in
  the deep scarier by contrast — you have a framework for friendly tech, and the Amalgamation
  is nothing like it.

## THE THREE-TIER BASE (this is the base-building system, mobile included)
1. THE COMPOUND (fixed home base): Marco's merged backyards -> your buildable home (the
   founding, already canon). Where the dynasty lives and grows.
2. THE SMART CART (mobile base + storage): the pseudo-apocalypse Regalia — a salvaged 2060
   autonomous cart that FOLLOWS YOU on its own (see the correction up top). It holds your
   bulk AND deploys your CAMP, kits out with upgrades, and is how you take base-building ON
   THE ROAD — the show-off mechanic. Cool tech, not a sad prop.
3. THE CAR (luxury mobile base, late + rare): the dream upgrade to the cart — faster (top of
   the Vehicle Ladder), more storage, but fuel/battery-gated and hard to earn. Same role as
   the cart, leveled up. The cart is the have-not version of the car; earning the car is a
   real milestone.
The cart is the STORAGE branch of the ladder (mobility of your STUFF), distinct from the
SPEED branch (bike -> car). A have-not pushes a cart; a have drives a Regalia.

## THE DEPLOYABLE CAMP (FFXV haven + time-skip, grounded)
You set up a PRE-DESIGNED camp — a layout you've built/customized — anywhere you can make
it safe, and ADVANCE TIME to however long you want (rest, heal, craft, cook, pass to
daylight). Straight FFXV-camp DNA.
- "Anywhere" is really "anywhere you can make SAFE" (keeps it grounded + strategic, not a
  free pause button). Ties to laws already locked: LIGHT = TERRITORY / nobody patrols the
  dark (camping in the unlit dark is asking to be found), faction standing (you can't safely
  camp in hostile lit turf), occupancy. Finding or making a safe spot IS the mini-decision.
- TIME-SKIP HAS A COST (grounded): while you sleep, the WORLD MOVES — the fold clock ticks,
  factions act, night is dangerous, a wound left too long festers. Rest is never free; it
  trades safety-now for whatever the world does while your eyes are closed.

## THE TRADEOFFS (the cart is a real decision every trip, not a free convenience)
- Bring the cart into a dangerous zone: your stuff is with you, but the cart makes you SLOWER
  and LOUDER (a rattling cart in the dark is a death sentence — ties straight to the flee's
  run-loud-vs-walk-quiet), and it's a second body to protect in a fight.
- Stash the cart and go light: quiet and nimble, but now you're limited to body-carry only.
- Leave the cart unguarded: it can be RAIDED/jacked while you're away (real). Your mobile
  base is a thing you can LOSE.
- OCCUPANCY (I-move-you-move): the companion + cart is a WIDE second body that paths behind
  you on the beat grid and physically can't fit everywhere — tight alleys, stairs, rubble,
  and especially the sewer.

## THE DEMO TIE-IN (base-building flex, NOT a leash)
The smart cart is how the demo shows off base-building on the road: roll into a spot, deploy
your kitted-out camp, advance time. When you head down into the wash it waits at the mouth
(it is a cart, not a diver) — but you go down ARMED AND DANGEROUS. The flee's danger comes
from the SITUATION (the flood, their dark, their numbers), never from being stripped of gear.
One real, non-weak stake does survive: a smart cart left topside can still be JACKED while
you're under — you might climb back into the light to find your rolling base gone. That's a
gut-punch about loss, not about being made helpless.

## MACRO/MICRO placement (keeps the save architecture clean)
The cart's CONTENTS are MICRO (ephemeral bulk storage — a second container beyond body
`maxWeight`, extends the built Inventory blob, NOT the fold/choice-log). What's macro is
CAPACITY/OWNERSHIP as a rebuild achievement ("the dynasty has a cart / earned a car") — that
can ride the fold like other permanent capacity. Same one-seam discipline as ammo.

## PENDING — PAOLO'S CALLS (do not invent)
- Smart-cart specifics: how autonomous, how it navigates, what upgrades/kit it takes, and
  whether a companion ALSO walks with it in the demo (optional flavor now, not the mechanism).
- THE BIG FORK — RESOLVED 7/24 (Paolo): the cart is NOT the key to the Amalgamation. "It is
  what the game makes it. It'll be fun and cute, it doesn't have to be the key to humanity."
  So: heirloom-LIKE in SENTIMENT only (a beloved three-act companion the family treasures),
  fully SEPARATE from the Family Box / the anti-Amalgamation key. It's a good boy, not a savior.
- Its name, what it looks like (rolling cart vs floating drone vs both), personality, the
  acquisition quest (and whether it's in the demo), and whether it can be damaged/destroyed/
  lost (ED-E-style permadeath stakes across the fold).
- Cart capacity + the car-acquisition chain + whether the cart itself upgrades (bigger cart,
  a jogger, a wagon, a trailer bike) before the car.
- The pre-designed camp layouts / what you can build into a camp, and the craft/cook/heal menu.
- Cart occupancy footprint (1x2? wider?) and exactly where it can/can't path.
- How strict the body-carry limit reads (hardcore Death-Stranding-tight vs grounded-forgiving).

---
*BOHEMIA — The Shopping Cart + The Deployable Camp — 7.24.26*
*A car is a dream out here. A cart is the truth. Either way, a companion walks beside you and everything you own rides between you.*
