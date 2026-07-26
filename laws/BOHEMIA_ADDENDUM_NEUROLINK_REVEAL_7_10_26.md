# BOHEMIA — NEUROLINK REVEAL + AGENT PURPLE EXCEPTION (7/10/26, Paolo, LOCKED)

## The ruling (extends the Purple Reservation Law)
Purple belongs to the Amalgamation — the hatch AND inside its agents.
Cybernetic homeless (Amalgamation agents) may carry purple in exactly two ways:

1. **PURPLE EYES** — agent iris color. Subtle at distance, wrong up close.
2. **DAMAGE REVEAL** — shoot an agent once and if it does NOT die, a purple
   glow/glare in the head exposes the NeuroLink implant. Undamaged agents look
   like ordinary homeless. The tech is revealed BY VIOLENCE, mid-combat.

No other purple anywhere in the world. (Hatch + agents only.)

## Why the damage reveal is strong
- The player discovers what these people are by hurting them. The horror lands
  as a consequence of the player's own action — you shot a homeless person and
  the purple light told you why they attacked. Guilt and revelation in one beat.
- Mechanically it telegraphs "this one is an agent, not a bystander" only after
  first blood — supports the social-reveal storyline ("why do homeless attack me").
- Ties directly to the locked combat resolution: a HIT that doesn't kill ends
  turn clean — the reveal fires on that beat.

## Implementation states (agent visual state machine)
- INTACT: world skin (SKIN_TONES_WORLD) + rags, purple iris (only tell).
  [grime ramps DEAD 7/10 — the RAGS carry the homeless read]
- REVEALED (took >=1 hit, still alive): purple NeuroLink glow at head/temple,
  persists for the rest of the fight.
- DEAD: glow dies with them (the Amalgamation withdraws).

## Data shipped this turn
- BOHEMIA_AGENT_LOOK_7_10_26.js — AGENT_IRIS, NEUROLINK_GLOW colors, state enum
- BOHEMIA_AGENT_REVEAL_INTEGRATION_7_10_26.md — how the code accepts it
- Preview PNG — agent in all 3 states over real sewer tiles

## Still Paolo's
- Exact glow shape/placement on the sprite (temple vs crown vs behind the eyes)
- Whether ALL agents share one purple or it varies by conversion age
