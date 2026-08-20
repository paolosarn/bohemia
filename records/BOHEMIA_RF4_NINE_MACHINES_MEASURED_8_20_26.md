# THE NINE MACHINES, MEASURED AGAINST THE CODE (8/20/26, coordinator, on
# Paolo: "i want this to be done right... you should understand and
# synthesize all the game mechanics from rogue fable 4 cant you?")

## WHAT ALREADY EXISTS, SO NOBODY BUILDS IT TWICE
The synthesis is done, three times over, and each layer is better than
the last:
1. HIS CAPTURE — records/rf4/BOHEMIA_RF4_DANGER_SCHOOL_MASTER.md, 83
   tutorial screens, verbatim, declared closed by him 8/17.
2. HIS SYNTHESIS — records/rf4/BOHEMIA_RF4_COMBAT_SYSTEMS_SYNTHESIS_
   8_17_26.pdf: fifteen sections, the nine machines, and the sentence the
   whole recreation turns on — "RF4 is not a damage game. It is a
   POSITION game with a damage readout."
3. LAB'S SPEC — records/BOHEMIA_RF4_TEARDOWN_SPEC.md, 68 numbered items,
   sourced, with a gate (rf4_teardown_gate.js, 94 checks) and an honest
   ledger of what it could not reach.
THIS FILE ADDS THE ONE THING NONE OF THEM HAS: **what is actually in the
running code today, measured, machine by machine.**

## WHY IT WAS NEEDED — THE STATUS COLUMN AND THE PROSE DISAGREED
The spec's own table marks several machines BUILT while its prose beside
them says ABSENT. Both readings are defensible because BUILT is being
used two ways — "the substrate exists" and "the machine exists" — and a
ledger that means two things sends a lane past work nobody did.

## THE MEASUREMENT
| # | MACHINE | MEASURED TODAY | HONEST STATUS |
|---|---|---|---|
| 1 | FREE-MOVEMENT BUDGET | in the combat blob at **V163**, tagged RF4-08, quoting his own global-clock rule | **BUILT** |
| 2 | THE KITE LOOP | deliberately NOT copied — with guns, breaking LOS is the kite verb; the retreat guarantee is a level-generator job | **DIFFERS ON PURPOSE (WORLD)** |
| 3 | MOVEMENT ASYMMETRY | in the blob at **V164**: the heavy moves orthogonally only, you move diagonally | **BUILT** |
| 4 | VISION AS THE MASTER SWITCH | **half**. SMOKE landed 8/20 (31 refs) and LOS/cover were always the centre of the read. But **no enemy support behaviour is gated on sight** — no healer, summoner or totem exists to gate | **HALF — and the other half needs enemy types that do not exist yet** |
| 5 | THREE-LAYER AWARENESS | nothing but a `shout` count. No detection rings, no awareness states | **NOT STARTED (phase two by the law)** |
| 6 | TERRAIN THAT KILLS | **built, in the WORLD half**: engine/bohemia_hazard.js + hazard_gate.js, pits present. What is unproven is whether COMBAT READS it | **BUILT IN THE WORLD, WIRE UNVERIFIED** |
| 7 | PUBLISHED ATTACK ORDER | **zero hits repo-wide** for a fixed resolution order. The spec's BUILT refers to the substrate (deterministic dice, armor 0), not the machine | **NOT STARTED — and the ledger says otherwise** |
| 8 | BOUNDED DAMAGE VARIANCE (50-100%) | not decidable by grep; the shape is architecture, the numbers are his | **COMBAT MUST STATE IT** |
| 9 | STATUS AS TURN DENIAL | knockback exists in **hazard/world**, not as a combat verb. No turn-denial, no board editing | **NOT STARTED IN COMBAT** |
PLUS THE DOOR (not one of the nine): **BUILT 8/17**, commit 8c2004ce —
the city posts `BOHEMIA_CITY_ENCOUNTER` from `inEnter()`, the alpha
listens, `gates/combat_entry_gate.js` is registered.

## SO: THREE BUILT, ONE HALF, ONE IN THE WORLD, FOUR NOT STARTED
And the four not started are the four that make a fight a PUZZLE rather
than a shootout: the awareness layer, the published order, the damage
floor, and turn denial. That is the honest answer to "it does not feel
like RF4 yet" — the movement is in, the geometry is arriving, and the
enemy-side machinery is the half still missing.

## THE COORDINATOR'S OWN ERROR, TWICE IN TWO DAYS, AND THE FIX
8/20 morning: called the front door OPEN by reading static markup; a lane
tapped the splash and proved it lands on the game.
8/20 afternoon: called the combat door MISSING by grepping for names I
invented ("cityFight", "combat") instead of the name the code uses
(`BOHEMIA_CITY_ENCOUNTER`), and routed a lane to build a thing it had
already shipped and gated three days earlier.
**THE RULE, EFFECTIVE NOW: TO ASK WHETHER A SYSTEM EXISTS, FIND ITS GATE
FIRST.** `ls gates/ | grep -i <system>` names the system, proves it, and
cannot be defeated by guessing vocabulary. Grep for behaviour only after
the gate index comes back empty. A gate is the repo's own index of what
is real, and this session has been ignoring it while telling every other
lane to verify on the real surface.
