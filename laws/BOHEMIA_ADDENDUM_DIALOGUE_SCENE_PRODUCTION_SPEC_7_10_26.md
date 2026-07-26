# BOHEMIA — DIALOGUE & SCENE PRODUCTION SPEC (filed 7/10/26)
How a seed becomes a PLAYABLE scene: the data layer, the presentation layer, and
exactly how both wire into the engine Paolo already built. This is the missing
"job 2" (production), distinct from the Quest Vault's "job 1" (collection). When we
mass-produce quests, EVERY quest ships all these layers, not just a plot sentence.

Grounded in how Bethesda/Obsidian/BioWare/CDPR actually build conversations, then
mapped onto Bohemia's existing systems (face system, micro-expressions, skinner,
scheduler, 120 BPM clock, music pools, faction graph, ledger).

===============================================================================
## PART A — THE DATA LAYER (what a conversation IS, as data)
===============================================================================
Industry standard: a conversation is a DATA TREE (JSON), separate from game logic,
run as a STATE MACHINE. Never hard-coded if/else (breaks past ~100 nodes). Editor
builds + verifies it; engine just interprets the JSON. This is Factory Law applied
to dialogue: typed spec -> generator -> batch -> gate.

### The five branching PATTERNS (pick per scene; Bohemia uses all):
1. BRANCH-AND-BOTTLENECK — branches reconverge at fixed beats. (Mass Effect,
   Witcher, Dragon Age.) Bohemia default for story/pillar scenes.
2. HUB-AND-SPOKE — a central node, optional topics in any order. (Disco Elysium.)
   Bohemia use: investigation/deduction scenes (the Reconstruction, contracts).
3. PARALLEL TRACKS — independent relationship meters that cross. (Companions.)
   Bohemia use: LOYALTY quests (Batch 05), Liberate/Respect/Become standing.
4. NODE GRAPH — any node to any node, most flexible/complex. (Inkle.) Sparingly.
5. LINEAR w/ CHECKS — one path, skill-checks gate lines. Bohemia use: T3 tail.

### BOHEMIA DIALOGUE NODE SCHEMA (the typed unit — one JSON object):
{
  "id": "pitboss_03",
  "speaker": "mar>>Marlow",           // who talks (or PLAYER for a choice hub)
  "line": "The old boss is cold. Someone has to sit that chair.",
  "conditions": [                       // ALL must pass for this node to show
     {"ledger": "killed_pitboss", "eq": false},
     {"standing": {"faction": "MOB", "gte": 20}},
     {"skill": {"read": "gte", "val": 3}},   // gates a [READ] line
     {"fold": {"gen": "gte", "1"}}
  ],
  "emotion": "guarded",                 // drives face system (Part B)
  "gesture": "arms_cross",              // drives skinner anim (Part B)
  "camera": "over_shoulder_npc",        // staging (Part B)
  "music": {"pool": "TENSION", "cue": "swap"},   // 120 BPM clock (Part B)
  "choices": [                          // player options -> next nodes
     {"text": "Back your claim. (MOB +)", "goto": "pitboss_04a",
        "effects": [{"standing": {"MOB": "+10"}}, {"ledger": "backed_marlow"}]},
     {"text": "[READ] You're scared of him too.", "goto": "pitboss_04b",
        "require": {"skill": {"read": 3}}},
     {"text": "Walk away.", "goto": "END", "effects": [{"ledger": "declined_pitboss"}]}
  ],
  "onEnter": [],                        // fire scene events (spawn, move actor)
  "onExit": []
}

### WHAT THE CONDITIONS READ (Bohemia's cross-systems — the reactivity):
- ledger (recorded + UNRECORDED): what this/prior generations did. THE reactivity
  spine. A node can check a boolean the player never saw flip (Whispering Hillock).
- standing: faction graph values (per-faction, and TRAVELS via graph edges —
  Alpha Protocol reputation). Antagonism can be positive for Cartel/Mob/Remnants.
- skill/upbringing: who raised the heir gates lines (Pentiment) — [READ], [BARTER],
  [INTIMIDATE], [MEDICINE] tags, deterministic (DA Coercion) not dice.
- fold: which generation, what's inherited (Family Box, laws, world-state).
- knowledge: mindmap nodes solved (Obra-Dinn) — gates truth-assembly lines.
This is why "data-aware" matters: the writer can SEE which assertions unlock each
branch, and the engine stays a dumb, portable interpreter.

===============================================================================
## PART B — THE PRESENTATION LAYER (how it PLAYS on screen)
===============================================================================
Every spoken node carries presentation tags. The engine reads them and drives four
already-built Bohemia systems in parallel. This is the "Bethesda-style: animation
+ face portrait while they talk" Paolo asked about.

### B1. THE FACE (portrait + expression) — uses Bohemia's FACE SYSTEM + micro-expr
- Each node has an `emotion` tag (FACS-style ACTION UNITS, industry standard: ~26
  units cover speech+emotion). Bohemia already has a face system + micro-expression
  system — the emotion tag selects the expression blend; micro-expressions add the
  involuntary flickers (the tell before a lie, the flinch).
- PORTRAIT: a framed face view (Bethesda dialogue-cam / classic portrait). Bohemia
  renders it from the SAME baked rig (RIG LAW: pose is the base), so the portrait is
  the actor's real face, not a separate asset. Emotion tag -> expression -> portrait.
- LIP-SYNC: procedural, phoneme-driven (industry standard). Engine extracts phonemes
  from the line's audio/text and blends jaw+lip action units on the beat. NO hand-
  animated mouths. Missing-phoneme = flapping jaw (the Fallout 4 bug) — so the
  phoneme table must be complete. [If lines are text-only at first, drive lip-sync
  from text-to-phoneme; swap to audio-driven when/if VO exists.]

### B2. THE BODY (talking animation + gesture) — uses the SKINNER + SCHEDULER
- Idle-to-talking BLEND (industry standard): actor plays a talk-idle loop while
  speaking, natural micro-motion (weight shift, blink, breath) so they're never a
  frozen mannequin. Bohemia's heartbeat already runs anims continuously on the 120
  BPM clock — a talking actor just runs its talk loop in place (treadmill), exactly
  like the walker-walks-in-place law. NEVER gated.
- `gesture` tag fires a RETURN one-shot over the talk loop (arms_cross, point, spit,
  look_away, draw_weapon) then falls back to the loop — this is the scheduler's
  existing RETURN anim behavior (bohemia_scheduler.js ANIM.RETURN). No new system.
- Terminal beats (a scripted death mid-scene) use the TERMINAL anim + ragdoll
  exemption already locked. A conversation that turns to violence hands off to the
  Dead Eye Dial (or the pacifist dodge/run per the Pacifist Path Law).

### B3. THE CAMERA (staging) — a thin presentation layer over the grid
- `camera` tag per node: over_shoulder_npc, over_shoulder_player, two_shot, closeup,
  wide. Bethesda-style dialogue cam. It's PRESENTATION only — actors stay on their
  grid tiles (scheduler owns position); the camera just frames them. Default cut
  cadence on the beat (120 BPM) so staging feels scored, not random.
- onEnter/onExit can move actors a tile, turn them to face (8 compass facings the
  rig already supports), or spawn/despawn — all through the scheduler, deterministic.

### B4. THE MUSIC (scored dialogue) — uses MUS.pool() / pickFromPool on the 120 clock
- `music` tag swaps/ducks the pool on a node (TENSION/COMBAT/TRIUMPH already tagged).
  Swaps quantize to the beat (120 BPM LAW). A gut-punch line can drop to one
  instrument; a reveal can swap pools. The catalog's vibe tags already support this.
- Ties the Spec-Ops "UI furniture as weapon" + RDR2 "register" shapes: the SCORE is
  how a scene's emotional register is authored, cheap and huge.

===============================================================================
## PART C — THE SCENE SCRIPT (beat-by-beat, the whole unit)
===============================================================================
A SCENE = an ordered list of dialogue nodes + staging events, driven by the state
machine. The scene doc for each quest (the flesh-out) contains:
1. HEADER: quest id, tier, faction wires, ledger reads/writes, music pool, entry
   conditions (fold gen, standing, prior seeds), which SEED it grows from.
2. CAST: each actor's id, baked rig, default emotion, faction, upbringing/skills.
3. THE NODE TREE: every node per the schema (Part A), branch pattern named.
4. PRESENTATION PASS: emotion/gesture/camera/music tags on every spoken node (B).
5. ROUTES: lethal route (Dead Eye handoff) AND pacifist route (talk/flee/dodge/
   economy) per the Pacifist Path Law — every confrontation has both.
6. CONSEQUENCE: ledger writes (recorded + unrecorded), standing shifts, world-state
   changes, fold echoes (what an heir sees later), mindmap nodes revealed.
7. GATE: a test that the tree has no dead ends, all conditions are reachable, both
   routes resolve, and every referenced ledger/standing/skill key exists.

===============================================================================
## PART D — HOW THIS PLUGS INTO THE ENGINE (no new tech, mostly)
===============================================================================
- Dialogue runtime = a small STATE MACHINE module (reads JSON, evaluates conditions
  against Core/Save/ledger/faction/mindmap, emits the current node + its presentation
  tags). Headless + node-testable like every Bohemia module. Add to the engine bundle.
- Presentation tags are consumed by systems that ALREADY EXIST: face system + micro-
  expressions (emotion), skinner + scheduler (gesture/idle-talk/terminal), a thin
  camera framer (staging), MUS pools (music). The dialogue module DRIVES them; it
  doesn't reimplement them.
- Everything deterministic + save-through (fold determinism law): the same choices +
  seed replay identically, so scenes survive the fold and the roguelite.
- Content is DATA (JSON scene files), so quests are batch-produced (Factory Law) and
  gated (a dialogue-tree gate joins the 8 permanent gates).

===============================================================================
## PART E — WHY THIS ANSWERS PAOLO'S WORRY
===============================================================================
- The Quest Vault (seeds) is the WHAT. THIS is the HOW. A seed is one sentence; a
  playable quest is a scene doc with a node tree, condition logic, and four parallel
  presentation channels (face/body/camera/music) wired to systems Bohemia already has.
- So the plan is sound: gather seeds wide (fast), THEN flesh each into a scene doc
  using this spec (deep). The face portraits, talking animations, and staging are
  NOT missing — they're presentation tags on nodes, driven by the face/skinner/
  scheduler/music systems already built. The 1-minute research turns were job 1;
  fleshing a scene is job 2 and is deliberately slower and heavier.
- NEXT PRODUCTION STEP (when Paolo says go): pick ONE seed, write its full scene doc
  to this spec as the reference template, then batch the rest against it.
