# BOHEMIA — ADDENDUM: THE DEMO CLIMAX IS A FLEE, NOT A FIGHT (LOCKED)
### 7.24.26 — Paolo: toward the end of the demo something happens, you take an L, and you have to RUN out of the wash/sewer in the dark, no gun, near-dead, hunted by cybernetic homeless. "You're doing awesome action, it's fun as fuck, something crazy happens, you take an L, and you have to run out. Creepy as fuck."

Read-before-build note: this is NOT new. It is the payoff of two things Paolo already
locked and we rediscovered by reading first:
- BOHEMIA_ADDENDUM_SEWER_DEMO_HOMELESS_7_10_26.md — the demo location (wash -> creepy
  procedural sewer -> hidden Network hatch that siphons stormwater power to the
  Amalgamation) and the enemy (CYBERNETIC HOMELESS: the Amalgamation disappears old
  NeuroLink members by CONVERTING them into homeless nobody counts — the horror is a
  real-world indifference, not sci-fi).
- BOHEMIA_ADDENDUM_PACIFIST_PATH_LAW_7_10_26.md — the RUN-AWAY button (run = two cells
  per beat) and the DODGE/EVADE mini-game (break line of sight, weather an assault until
  you escape) are already locked as required verbs, the peaceful counterpart to the Dead
  Eye Dial. The flee climax is what those verbs were built for.

## THE LOCK (what Paolo added 7/24)
The demo's CLIMAX is a forced ESCAPE, not a boss fight. It is the anti-power-fantasy:
you have no gun, you are one hit from dead, the dark belongs to THEM, and the only verb
that saves you is smart movement. Survival-horror FLIGHT (Outlast / Alien: Isolation /
Amnesia DNA), not a shootout. You do not win by killing. You win by getting OUT.

### THE SHAPE (grounded end to end, canon-consistent)
1. DESCEND (the haunting hook, TBD reason) — wash, then the creepy sewer. Act-1 rule
   holds: everything reads as a haunting, never as a machine (see ACT1_AMALGAMATION_IS_A_GHOST).
2. THE REVEAL / THE TRESPASS — you reach the hidden Network hatch (the 7/10 bottom-of-level
   reveal). You LOOK. Per the locked design spine, LOOKING is the one thing the deep will
   not allow (proximity-to-the-secret = threat, not player strength — it is why the homeless
   who never look live over it safely and you, who came to look, do not).
3. THE L — "something crazy happens" (the trigger is Paolo's call — options below). You are
   suddenly near-dead, weaponless or dry, and the deep wakes.
4. THE RUN — flee UP and OUT through the dark sewer to the light of the surface, hunted the
   whole way by the cybernetic homeless.

## THE MECHANICAL SPINE (built on the REAL systems, not invented)
- I-MOVE-YOU-MOVE on the 120 BPM grid (BEAT = 500ms). Movement is a REQUEST executed on the
  metronome tick. WALK = one cell/beat (quiet). RUN = two cells/beat (hold to run) — FASTER
  but LOUDER / more exposed (this cashes the open GDD PENDING: "whether running costs exposure/
  ledger-noise"; here it does). That is the whole strategy Paolo wants: you cannot just hold
  run the whole way — running outruns them but draws them; walking is slow but quiet. You
  ALTERNATE: sprint the straightaways, freeze or creep when one is near, break line of sight
  on the sewer's bends.
- LINE OF SIGHT (the existing RF4 LoS system): the cybernetic homeless hunt by sight, and
  here is the terror grounded in the 7/24 tech research — they have BLINDSIGHT-class cortical
  vision (a camera wired to the visual cortex), so THEY SEE IN THE PITCH DARK AND YOU DO NOT.
  The dark is their territory. Breaking LoS around corners and chokepoints is survival.
- LIGHT = TERRITORY, INVERTED. Normally nobody patrols the dark and light is safety. Down
  here the dark is THEIRS. Your safety is the light above. The whole flee is a race from
  their dark up to your light — the existing LIGHT=TERRITORY law turned into the level's engine.
- THE WHISPERS ARE YOUR ONLY SENSOR. You are blind; you navigate by SOUND. The whispers
  (temporal-lobe stimulation, per the tech research / reveal engine) swell as one closes in —
  your only proximity tell in the dark. Creepy as fuck by construction: the thing that means
  "you are about to die" is a voice in your head that should not be there.
- CONTACT = DEATH, not chip damage. Honors "10 HP left": you are already one hit from gone,
  so a single grab from a cybernetic homeless downs you. This keeps the climax as a DETECTION/
  EVASION beat (movement + line of sight + sound), which is buildable WITHOUT shipping the full
  damage system — so NO DAMAGE BEFORE THE DIAL still holds (you deal none; getting caught is a
  fail-state, not an HP-attrition fight).

## THE TONE ARC (why it lands)
Awesome-action-fun-as-fuck -> something crazy -> you take the L -> naked terror in the dark.
The demo flips from empowerment to helplessness in one beat. That whiplash (Yakuza/Hades DNA
already in the questbook) is the point: the game can take the gun out of your hand and make
you feel it.

## PENDING — PAOLO'S CALLS (do not invent)
- THE L / THE TRIGGER ("something crazy happens"). Strong grounded options:
  (a) YOUR LIGHT DIES — your salvaged lamp/headset battery cuts out at the reveal (battery
      scarcity is canon from the tech research), dropping you into their dark. Simple, terrifying,
      and it IS the mechanic (you go blind, they see).
  (b) FLASH FLOOD — it starts to rain above and the storm channel begins to fill (real Vegas
      washes are flash-flood channels, dry most of the year; the Network build siphons that very
      runoff, so disturbing it could even start the flow). Adds a rising-water TIMER on top of the
      hunt: get out before the water or the homeless take you.
  (c) YOU TRIP THE NEST — touching/seeing the hatch wakes the whole dark at once.
  (or a combination — e.g. light dies AND the water starts.)
- Enemy behavior in the flee: silent gropers-in-the-dark vs shamblers that rush vs a mix.
- Exact geography of the run (hand-bounded procedural per the 7/10 demo-scope note).

## BUILD DEPENDENCIES (honest — this is DESIGN; here is what it needs to be PLAYABLE)
- The RUN verb (2 cells/beat, hold-to-run) and the DODGE/EVADE mini-game — locked in the
  Pacifist Path Law, built AFTER the Dead Eye Dial in the standing build order.
- A LINE-OF-SIGHT / detection pass on the enemy AI (the RF4 LoS system exists for combat;
  the flee needs it driving pursuit) + a light/dark visibility model + a "downed/caught"
  fail-state + the whisper audio proximity tell.
- None of this is the damage/dial system, so it does not violate NO DAMAGE BEFORE THE DIAL.

---
*BOHEMIA — The Demo Climax Is a Flee, Not a Fight — 7.24.26*
*Take the gun out of their hand, put a voice in their head, and let the dark do the rest.*
