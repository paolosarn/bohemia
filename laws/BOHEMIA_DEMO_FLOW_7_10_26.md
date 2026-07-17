# BOHEMIA — SEWER DEMO FLOW PACKAGE (7/10/26)

## What this is
The demo's encounter data, pacing curve, and music mapping — all derived from
LOCKED canon (combat resolution, map data, music vibe system). No new mechanics
invented. Behavior details stay [PENDING Paolo] where he hasn't ruled.

## 1. AGENT ENCOUNTER DATA (from locked combat resolution)
Combat law: KILL zone = exactly 100 dmg through armor; MISS draws return fire;
HIT damages + clean turn; VITAL damages + stuns 2 turns.

Demo agent stat block (data, ready for entity config):
```
const DEMO_AGENT={
  hp:100, armor:0,            // one-shots on a KILL, per locked demo-enemy law
  revealState:0,               // AGENT_STATE.INTACT (see agent look files)
  skin:'SKIN_TONES_WORLD', iris:'AGENT_IRIS',   // grime skins DEAD 7/10 — rags carry the read
  behavior:'PENDING_PAOLO',    // rush vs throw rocks/sticks vs mix — his call
};
const HATCH_GUARD={...DEMO_AGENT, hp:140};  // survives one KILL-zone shot =
// GUARANTEED reveal moment before death. The demo's horror beat is unmissable
// at the hatch even if the player one-shots everything else.
```
Note: hp:140 on guards is a PROPOSAL — it weaponizes the locked reveal system
so every player sees the NeuroLink glow at least once. [Paolo approves/kills]

## 2. PACING CURVE (tension over the descent — Sasko sticky-note method)
- WASH (rows 0-6): CALM. Bright, open, no enemies. Player learns movement free.
- TRANSITION (7-9): UNEASE. Light drops, walls close in. Still no contact.
- SEWER RUN (10-13): TENSION. Dark, water channel, nothing attacks yet.
- LEFT CHAMBER (14-17): SPIKE — first ambush, 2 agents. First reveal chance.
- CORRIDOR (18): breath.
- RIGHT CHAMBER (19-22): SPIKE — second ambush, 2 agents, player now knows.
- APPROACH (23-24): DREAD. Quietest stretch, longest dark.
- HATCH ROOM (25-29): CLIMAX — 2 guards (reveal guaranteed), then the purple
  hatch. Demo ends at the threshold. Truth found, door unopened.
Shape: calm -> slow build -> spike -> breath -> spike -> dread -> climax.

## 3. MUSIC MAPPING (existing MUS.pool() vibe system, no new songs needed)
- WASH: no music or lowest-key ambient — silence is the calm
- TRANSITION+SEWER: pool('TENSION')
- CHAMBER FIGHTS: pool('COMBAT') on aggro, back to TENSION on clear
- APPROACH: TENSION, lowest-energy pick (or thin the mix if supported)
- HATCH ROOM fight: COMBAT; on clear + hatch approach: single sting, then
  silence over the purple. The quiet IS the reveal. [sting choice PENDING —
  Paolo may want a dedicated cook for the hatch moment]

## 4. MERGE DRY-RUN RECORD (run this session, alpha untouched)
Bake merged against a COPY of the alpha repo: zero category collisions,
14 categories / 899 tiles post-merge, all 44px RGBA, all types legal.
Main session merge is proven safe.

## PENDING PAOLO
- Agent behavior (rush / throw / mix)
- Guard hp:140 reveal-guarantee proposal
- Hatch sting: pick from existing catalog or dedicated cook
- Hatch prop pick (variants 0-3 shipped earlier)

## COVER PROPS (added 7/10/26)
Cover family exists (13 Paolo-confirmed barricade props). Tunnel encounters can use real cover geometry: agent and guards take cover states from props per BOHEMIA_COVER_INTEGRATION_7_10_26.md. Placement = Paolo/map.
