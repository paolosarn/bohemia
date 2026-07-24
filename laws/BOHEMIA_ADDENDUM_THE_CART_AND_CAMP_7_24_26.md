# BOHEMIA — ADDENDUM: THE SHOPPING CART + THE DEPLOYABLE CAMP (LOCKED)
### 7.24.26 — Paolo (long-held idea): like FFXV's crew driving the Regalia and camping anywhere — but if you have no car (cars are a rare luxury, already canon), your COMPANION follows you pushing a SHOPPING CART. The pseudo-economic-apocalypse mobile-storage-and-camp system. Plus the realism gripe: games let you roam a whole world but never honestly answer HOW you carry your stuff — if it can't fit in your backpack or pockets, what are we doing.

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

## THE THREE-TIER BASE (this is the base-building system, mobile included)
1. THE COMPOUND (fixed home base): Marco's merged backyards -> your buildable home (the
   founding, already canon). Where the dynasty lives and grows.
2. THE CART (mobile base + storage): the pseudo-apocalypse Regalia. Your COMPANION pushes
   it and it follows you through the city. It holds your bulk AND deploys your CAMP. This is
   how you take base-building ON THE ROAD — the show-off mechanic.
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

## THE DEMO TIE-IN (this is the gold — the system EARNS the climax)
The cart and the companion pushing it CANNOT follow you down into the wash/sewer — too
tight, stairs, and then it floods. So when you descend for the climax, you LEAVE the cart,
the companion, and all your bulk gear topside and go down with ONLY what's on your body.
That is the mechanical, honest reason you are under-equipped, near-weaponless, and one hit
from dead in the flee. The cozy base-building system the demo shows off in Movement 1 is the
exact reason you are stripped and terrified in Movement 4 — the bait-and-switch made
mechanical, not scripted. (And you might climb back out to find your unguarded cart raided —
a second gut-punch waiting in the light.)

## MACRO/MICRO placement (keeps the save architecture clean)
The cart's CONTENTS are MICRO (ephemeral bulk storage — a second container beyond body
`maxWeight`, extends the built Inventory blob, NOT the fold/choice-log). What's macro is
CAPACITY/OWNERSHIP as a rebuild achievement ("the dynasty has a cart / earned a car") — that
can ride the fold like other permanent capacity. Same one-seam discipline as ammo.

## PENDING — PAOLO'S CALLS (do not invent)
- WHO pushes the cart in the demo (a dedicated companion? Marco? a family member?).
- Cart capacity + the car-acquisition chain + whether the cart itself upgrades (bigger cart,
  a jogger, a wagon, a trailer bike) before the car.
- The pre-designed camp layouts / what you can build into a camp, and the craft/cook/heal menu.
- Cart occupancy footprint (1x2? wider?) and exactly where it can/can't path.
- How strict the body-carry limit reads (hardcore Death-Stranding-tight vs grounded-forgiving).

---
*BOHEMIA — The Shopping Cart + The Deployable Camp — 7.24.26*
*A car is a dream out here. A cart is the truth. Either way, a companion walks beside you and everything you own rides between you.*
