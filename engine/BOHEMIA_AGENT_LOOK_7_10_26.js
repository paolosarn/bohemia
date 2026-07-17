// BOHEMIA — CYBERNETIC HOMELESS AGENT LOOK (7/10/26)
// extends BOHEMIA_SKIN_PALETTES_WORLD_7_10_26.js (SKIN_TONES_WORLD).
// SKIN_TONES_HOMELESS is DEAD (7/10 verdict) — it does not live there or anywhere.

// purple iris — same [r,g,b] format as the alpha's IRIS array.
// APPEND to IRIS (do not replace); agents index it, civilians never do.
const AGENT_IRIS=[168,96,200];

// REVEAL VISUAL: v1+v2 renders KILLED (Paolo 7/10/26). Colors kept as palette refs ONLY;
// the reveal look redesigns inside the Universal Reveal System w/ fiber-optic glow direction.
const NEUROLINK_GLOW={core:[196,84,160],halo:[122,42,96]};

// agent visual state machine
const AGENT_STATE={INTACT:0,REVEALED:1,DEAD:2};
// transition: INTACT -> REVEALED on first surviving hit; any -> DEAD on death.
// REVEALED persists for the rest of the fight. glow dies with the agent.
