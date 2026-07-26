# BOHEMIA — COMBAT ADDENDUM
## Cover, Turn Economy, Vital/Stun, Difficulty Scaling
### By Paolo Alexandre Sarnataro (Babypunk / Punk4Prez)
### Living document — updated every working session. The file IS the memory.

---

## HOW TO READ THIS

This extends GDD v3 Part One (the Dead Eye Dial) and answers its combat open
questions. Nothing here replaces v2 or v3, it builds on them.

**[LOCKED — shooting sprite, 6.28.26]** No separate "shooting pose." When you fire,
the world sprite hides its arm(s) and the **combat arm becomes part of the dial** —
a rotatable arm+weapon piece pinned at the shoulder, swinging to the dial angle.
**Pistol / light SMG = 1 arm (right). Shotgun / rifle = 2 arms.** Torso + legs stay
in their current pose (idle or crouch). Full detail in the character-art addendum;
noted here because it's the visual half of the Dead Eye Dial.

**[LOCKED — enemy fire visual, 6.28.26]** The swing is the PLAYER's dial only; **enemies never swing.**
Their hit/miss is resolved by range + cover (distAccuracy). Visual: reuse the same detached combat-arm
asset, **AIMED at the player, ~90% static with a tiny lazy sway** (a few degrees, slow) so it reads as
them trying to line you up — which is exactly why they miss a lot — plus muzzle flash + recoil. Zero
new art. The arm coming up also telegraphs incoming fire (fits the cover/exposure read). Confirmed by
Paolo: aimed, with the small sway.

Tags, read them strictly:
- **[LOCKED]** — Paolo confirmed it. Build on it. Do not revisit unless he raises it.
- **[OPEN]** — a real fork still on the table. Options listed. Needs his call.
- **[ABILITY — not built]** — a power he named for later. Slots into the action
  economy + the second/mana bar. Catalogued so it is never lost, NOT a current mechanic.
- **[PERK — not built]** — same, but a perk. Catalogued, not built.

Rule for this file: anything Paolo says gets written here the same session. His
ideas do not live in Claude's memory. They live here.

---

## THE OPEN FORKS (resume here)

These are the decisions still needed before the cover + turn rewrite is fully spec'd:

1. **Stun refreshability — RESOLVED (Paolo, 6.27.26): NO stun-lock.** Vital hits do a
   lot of damage, so usually a vital leaves even a tough enemy low and you finish him.
   In the rare case he survives stunned with real HP (armored goon / AI bot), an enemy
   must get ONE full regular turn back before he can be stunned again. So you can't
   chain-vital a tanky enemy into a permanent coma; he gets a turn (where he can act /
   shoot) before another stun can land. Re-vitaling during the existing stun still
   chips HP, it just can't extend the freeze. **Locked.**

2. **Vital chain-continuation across tiers.** Does a vital advance the chain to the
   next target at ALL difficulties, or only on easier tiers (clean-kill-only to
   advance at the top)? Paolo is leaning: vital stuns AND continues everywhere,
   pushed back on stripping it at Bohemian because the dial patterns are already
   savage at that speed. Likely resolving toward "vital advances at all tiers,"
   balanced instead by the stun-clock rule in #1. **Confirm.**

3. **Difficulty blend — RESOLVED (Paolo, 6.27.26).** The 5 packages touch ONLY the
   MINIGAME execution: the dial (pattern speed/shape) and the cover pop-timing (faster
   cycles, thinner windows). That's it. How many enemies, where they stand, whether
   you're flanked, how coordinated they are = the OVERWORLD POSITIONING layer, a
   completely separate difficulty axis NOT driven by the package. Two separate dials;
   they multiply when you're deep in both. So for cover, harder package = pure timing
   (faster cycles, thinner windows), nothing about enemy count or coordination.

4. **Targeting model.** Auto-target (v9 picks the lowest-HP peeker for you) vs manual
   rotate-to-face (you swing your aim to the target you choose, and reading the
   windows yourself becomes the skill). Claude proposed manual rotate-to-face as the
   multi-enemy dial model. Leaning that way, not formally locked. **Confirm.**

---

## TURN ECONOMY (the spine — built as groundwork for positioning)

- **[LOCKED] A turn is one action.** Shooting is an action. Moving one tile is an
  action. Waiting is an action. Future abilities are actions. Built as an ACTION
  LAYER, not a hardcoded shoot-then-they-shoot, so new action types slot in clean.
- **[LOCKED] Watching/reading costs nothing. Only committing an action spends the
  turn.** You can sit and read windows forever for free. The turn is spent the
  moment you commit.
- **[LOCKED] A full clean-kill chain is ONE shooting action.** Perfect string of
  killshots clears the whole room in a single turn. 8 perfect kills = 1 turn.
- **[LOCKED] Waiting is a valid action.** Spend a turn doing nothing, the world
  advances one step, enemies move, you get a better jump next turn. Example Paolo
  gave: everyone's tucked this turn but you see a guy drifting left, so you wait one
  turn to set up a better angle.
- **[LOCKED] You always get your shooting turn first.** Nobody shoots you mid-turn.
  Survivors who still have a line on you return fire only AFTER your turn resolves.
  You always get the chance to kill an enemy before they get the chance to kill you.
  No NPC sneak-attacks-you-first mechanic.
- **[LOCKED] Perfect play = zero damage at any enemy count.** One enemy or eight.
  Taking any damage is meant to be a terrible experience (hardcore health). Damage
  is the price of a slip or a bad position, never a tax you just pay. A hit always
  means you could have done something different.

### Action-cost examples Paolo specified (write the code to honor these now)
- Get perfect killshots on 8 people → 1 turn (the chain).
- Crouch/move 1 tile to a new position → 1 turn.
- **[ABILITY — not built]** Move 2 tiles AND shoot exposed enemies → 1 turn.
- **[ABILITY — not built]** Auto-killshot → 1 turn.

Code must allow these turn-costs to exist even before the abilities are built. The
action layer is the groundwork for the positioning/tiles game that comes after this.

---

## PER-ENEMY COVER & LINE OF SIGHT

- **[LOCKED] Only enemies with a line on you are IN the fight.** Bodies in another
  room, around a corner, with no angle on you, do not exist as combat state. They
  enter the fight the instant they get an angle (later: when you walk into their
  sightline on the tiles). No "can't see me" flag to track — no line means not in the
  encounter. This is how v9 already implicitly works.
- **[LOCKED] Per-enemy cover state, hand-authorable now, tile-geometry-driven later.**
  v9 already stores `inCover` per enemy; today only a global toggle flips them all.
  The fix is to author each enemy individually. Same flag, hand-set now, set by real
  geometry later. Nothing thrown away.
- **[LOCKED] Two cover states per enemy, relative to you:**
  - **Covered-from-him:** something's between you. The pop-from-cover window dance —
    he leans out, you trade in the gaps. (What v9 does.)
  - **Exposed-to-him:** clean line, no cover between you. He can just shoot you; the
    only reason you live is you might drop him first or he might miss.
- **[LOCKED] Cover authoring tool = the 3x3 around you.** Picture your character in
  the center of a 3x3 grid of the 8 squares surrounding you. You click each square to
  set whether it provides cover or not. One square = one human. That's how you
  hand-build the flank picture (covered from these sides, exposed on these) before tile
  geometry drives it automatically. This is the immediate-surroundings authoring layer
  for the upgraded combat module.
- **[LOCKED] An exposed line is effectively a duel, player-first.** You get your shot
  first (turn-order rule above); if you don't drop him, he answers after. Fastest
  perfect killshot wins.
- **[LOCKED] Cover lowers enemy accuracy.** If you have cover and they don't, their
  shots are less accurate (you're a smaller target). Return fire only ever rolls the
  enemies who actually have a line on you — position subtracts guns from the math.

### Structural note (the lump problem this fixes)
v9 lumps every living enemy into one return-fire roll scaled by a multiplier
hardcoded up to 3 (doesn't scale past it). Kills subtract one, incoming adds N, so
past a handful it's a math problem you lose by default. Per-LOS return fire (only
enemies with an angle roll) is the structural fix: where you stand decides how many
guns can touch you, not the body count.

---

## VITAL HITS & STUN

- **[LOCKED] A vital hit always stuns the target and kills his return fire that turn.**
  Every difficulty, no exceptions, including Bohemian. A vital is NEVER a wasted shot.
  This is the fix for v9's rude vital (where a near-perfect chest shot just dropped
  HP and the guy shot you back anyway).
- **[LOCKED] Standard stun = 2 turns.** Paolo's pocket. Reasoning: stun length sets
  the fight's RHYTHM, not your safety. Short stun = always juggling, constant simmer.
  Long stun = big quiet stretch but everyone you froze wakes at once (a wall). 2 keeps
  you honest, there's always something coming back online. 3 hands you too much peace
  as the default.
- **[PERK — not built] Vital stun lasts 3 turns instead of 2.** A rhythm-control perk
  — buys cleanup time before the wall, not a raw stat boost. Worth chasing because it
  controls tempo, not power.
- **[OPEN] Stun refreshability** — see Open Fork #1. Claude's strong rec:
  non-refreshable cleanup clock. You vital him, he's frozen 2 turns, those 2 turns are
  your window to land the clean kill. Re-vitaling chips HP, does NOT reset the clock.
  Miss the window, he wakes up low and furious and back in the return fire. Keeps the
- **[LOCKED] No stun-lock.** An enemy must get one full regular turn back before he
  can be stunned again. Re-vitaling during an existing stun chips HP but cannot extend
  the freeze. Kills/burn-down stay the goal; the stun is a one-time safety beat, not a
  lock you abuse. (See Open Fork #1, resolved.)
- **[OPEN] Chain-continuation** — see Open Fork #2.

### Why Paolo overrode the "go easy on Bohemian" caution
Claude flagged that vital-stuns-and-continues at all tiers could make zero-damage
turns too easy (vital window is ~2.5x wider than the kill window). Paolo's answer:
the dial patterns at Bohemian speed are already brutal, landing a vital on a very
hard pattern is its own knife fight, so the reward can stay fat. Conceded. The
balance lever is the stun-clock (#1), not stripping the stun.

---

## ARMOR & ENEMY HP (new canon — 6.27.26)

The current cover/vital math has been built as if everyone is a bare human. They're
not. This is the layer that was missing.

- **[LOCKED intent] Armor exists — on enemies AND on the player's own character.**
  The mechanics built so far don't account for it yet; they need to.
- **[LOCKED] Two vital hits for sure kill a human.** A bare human survives one vital
  (left near-death + stunned) but not two. This is why, for humans, the stun-clock
  fork is a non-issue: you vital, he's nearly dead, you finish him.
- **[LOCKED intent] AI security bots (and armored goons) have more HP than humans.**
  A vital on a tanky/armored enemy does NOT leave them near death — they're stunned
  but still carrying real HP. This is the ONLY case where stun refreshability matters
  (Open Fork #1).
- **[TODO] How armor modifies the shot model:** does armor shrink/shift the kill &
  vital zones, add a flat HP pool, or gate certain calibers? Not specced yet. Flag
  when we build the armor pass.

---

- **[LOCKED] The cover/pop minigame must ride the same 5 difficulty packages as the
  Dead Eye Dial** (EASY, NORMAL, HARD, VERY HARD, BOHEMIAN). Today it's static —
  EASY and BOHEMIAN play the identical cover game. That's the hole. We built a whole
  difficulty system for the dial; cover has to plug into it.
- **[LOCKED] Cover difficulty is TWO dials stacked:** the encounter (how many guns
  have a line on you, the 1-to-8 axis) times the package (EASY through BOHEMIAN).
  Separate axes. One enemy on EASY is a nap; eight on BOHEMIAN should make your hands
  sweat.
- **[LOCKED — Paolo, 6.27.26] The package touches MINIGAME EXECUTION ONLY.** What a
  harder package does to cover is pure timing:
  - Cycles run faster → every clean window is shorter, you react quicker. Mirrors the
    dial's speed convergence.
  - The danger sliver widens → more of each cycle is "pop now and eat it." Easy has
    lots of safe air; Bohemian's safe gaps get precious.
- **The package does NOT change enemy count, positioning, or coordination.** Those
  live on the separate overworld/positioning axis. The package makes a GIVEN pop
  harder to execute; it does not put more guns on you.

### Squad coordination (overworld behavior, NOT a package lever)
- **[LOCKED direction] Enemies fight as a coordinated squad, not independent randos.**
  They take turns leaning out (bounding/covering fire) — a couple suppress while the
  rest stay tucked, then rotate. More based (no trained group all randomly stands up
  at once) and it keeps high enemy counts READABLE instead of noise.
- IMPORTANT: how many lean out at once is an OVERWORLD/encounter property (tied to
  enemy count and positioning), NOT something the difficulty package dials. Earlier
  draft wrongly tied "discipline breaks down" to the package; corrected per Paolo.

---

## VISUALIZER & SOUND

- **[LOCKED] Scrap "read eight waveforms."** The per-enemy cards were built for 3 and
  fall apart at 8. Nobody can read 8 rhythms at once.
- **[LOCKED direction] The pop visualizer becomes ONE threat-horizon gap-finder.**
  Instead of "show me each guy," it shows "show me the gap." One combined readout:
  the next safe window sliding in, going GREEN the instant it opens, slamming RED when
  it shuts. You read one threat horizon, not eight rhythms. Per-enemy cards can stay
  underneath as texture, but the eyes lock onto the gap-finder.
- **[LOCKED] Add a perfect-pop sound.** A noise fires exactly when the window goes
  green. On the hard packages where windows are tiny, your ear catches what your eye
  misses. (v9 currently has no perfect-pop audio cue — Paolo flagged this directly.)

---

## ABILITIES & PERKS CATALOGUE (not built — preserved)

Everything here slots into the action economy + the second/mana bar (the
time-dilation bar from GDD v2 §14-15 / v3). The mana/ability system itself is part
of the POSITIONING/TILES game, which comes AFTER the cover rewrite. Catalogued so
none of it is ever lost.

**[ABILITY — not built] Invincible run to cover.** Makes you bullet-immune while you
sprint to the nearest cover. Mana cost scales with how far the cover is AND how many
guns have a line on you AND how much was in your pool. The get-out-of-the-open card —
being caught exposed is not an automatic game over IF you have the mana. If you don't
have it and can't land the perfect shots, you'd better pray they miss.

**[ABILITY — not built] Move 2 tiles and shoot exposed enemies, in 1 turn.**

**[ABILITY — not built] Auto-killshot.** Lands a guaranteed killshot as one action.

**[ABILITY — not built] See the enemy's next move / future enemy movement.** A
read-ahead power layered on top of waiting — turns "wait and guess" into "wait and
know." Visualizing the enemies' projected movement (ties to the Ghost Time Layer,
GDD v2 §20).

**[PERK — not built] Vital stun = 3 turns** (see Vital section).

---

## VERIFIED FACTS FROM v9 (for whoever builds the rewrite)

- v9 COVERED cover rhythm: peek window = 42% of the cycle; fire sliver = 7% sitting
  inside the peek. Cycle lengths 1.5–3.5s, pulled from a 20-entry RHYTHMS table,
  independent and drifting (effectively uncoordinated).
- Phase offsets are hand-set for 3 enemies only (`ct = 0, half, third`). Nothing
  defined past N=3.
- `returnFire` hardMult is hardcoded: 3→1.7x, 2→1.39x, else 1.0x. Does not scale past 3.
- Simulation (120s, 8 trials) of clean-pop-window availability under the current
  independent model:
  - N=3: clean window exists ~60% of the time, ~1.3 enemies peeking at once, someone
    firing ~20%.
  - N=5: ~61% clean, ~2.1 peeking, ~31% firing.
  - N=8: ~54% clean, ~3.4 peeking at once, ~45% firing, gaps every ~180ms.
- Conclusion: at N=8 SURVIVAL math is fine (clean windows still exist over half the
  time; clean kill = no return fire). The wall at 8 is READABILITY (3-4 peeking at
  once), not survival. That's why the visualizer + coordination fixes matter more than
  any damage number.

---

## SCALE & SCOPE (grounded, 6.27.26)

Anchor: **1 tile = 1 meter** (a person stands in ~1m square; "one square = one human").

Real-world reference (researched, sources confirmed):
- Longest sniper kills in human history: ~3,540m (2017 Canadian JTF-2, cleanest
  confirmed), ~3,800m (2023 Ukraine, Kovalskyi), ~4,000m (2025 Ukraine, drone+AI
  assisted, two men one round). The all-time ceiling is ~3,500-4,000 tiles.
- Reliable elite-pro ceiling (.50 anti-materiel rifle): ~1,500-2,000m. Most real
  combat sniping is under 1,000m. Standard firefights: tens of meters.
- Grounding facts that justify our combat design: at 1.5km the bullet's spread is
  already a ~1m circle; "one shot one kill" is a video-game myth (pros fire multiple
  shots and miss first); the 4,000m rifle was rated for 2,000m and got doubled with
  tech + luck.

Object sizes in tiles:
| thing | tiles |
|---|---|
| human | 1 |
| car | ~2 x 5 |
| single-family house footprint | ~12 x 12 (≈120-225) |
| big building / big-box / casino floor | 100 to 300+ across |
| city block | ~100 across |
| room-to-street firefight (the Dead Eye Dial's home) | 5 to 50 |
| reliable elite sniper shot | ~1,000, pushing 1,500-2,000 |
| longest in human history | 3,540-4,000 |

**[LOCKED direction] The scope decision the numbers force:**
- Street-level combat grid stays TIGHT on purpose: a few dozen tiles max (a room, a
  courtyard, a stretch of street). This keeps the dial readable and keeps one-shot
  lethality honest (clean one-shot kills are a close-range truth).
- Long-range sniping is NOT a street-grid mechanic. At a true 1m grid it outranges any
  single tactical screen by 1,000+ tiles. It lives on the CITY-ZOOM layer as overwatch
  across blocks. This maps onto the existing camera system (GDD v2 §21): street level
  (animal) = close Dead Eye Dial fights; city zoom (human) = long sightline / sniper
  overwatch.
- The dial should get harder (narrower window) as distance climbs, mirroring the real
  fact that even pros miss and re-fire at range.

---

## SNIPING (FUTURE SYSTEM — not part of the street combat module)

Paolo wants this built later; the game deserves it. Logged so nothing is lost.

- **[LOCKED direction] Past a certain range, sniping is NOT a combat-module mechanic.**
  It lives on the city-zoom / overworld layer, separate from the street Dead Eye Dial
  fights. The combat module (v10) does not need to handle it.
- **[LOCKED] You still play the Dead Eye Dial for the shot, and it's incredibly hard,
  scaling with distance.** A long shot = a savage pattern with a sliver of a window.
  Grounded: at 1.5km even pros sit inside a ~1m spread and miss/re-fire.
- **[LOCKED] ~2 shots max before the situation turns.** After a shot or two everyone's
  running for cover, your location gets tracked, and you have to move to a new
  position. You can't sit safe and farm the map.
- **[LOCKED] Get caught sniping and damn near the Remnants will be after you.** Firing
  brings a law/military response (Remnants = the floor of civilization, GDD v2 §9).
  Overwatch is powerful but never free or safe.
- Four natural gates (all grounded): you must have line of sight; the dial shot is
  brutal at range; the rifle (.50 anti-materiel) + ammo is rare in a post-crash
  economy; firing exposes your position and draws heat.

## KILL ANYONE / THE WORLD ROUTES AROUND IT (FUTURE — core philosophy)

- **[LOCKED] You can kill anyone in the game, including main quest NPCs.** Nobody is
  plot-armored. A core promise of Bohemia: the world lets you burn it down and deals
  with you honestly.
- **[LOCKED principle] The world ROUTES AROUND the body instead of freezing.** Kill a
  quest giver and the thread reshapes — someone else picks it up, or that path closes
  and consequence ripples. The killing is the cheap half; the world reacting like it
  mattered is the expensive half.
- **[LOCKED] Kill-everything endpoint.** Kill enough that nobody's left to carry the
  world and it stops rerouting and just stops. Not a fail screen — the world being
  honest. Should be insanely hard (the whole valley fights to survive you). Writes its
  own monument. Far end of the same dial as the democratic-liberation ending (GDD v2
  §23), which already dies if you burn too many bridges.
- **[LOCKED build order] Bones now, reactions later.** Build the ability to kill anyone
  into the bones early so nothing's plot-armored from the start. Layer world-reaction
  logic (fallback quest paths, factions filling vacuums, story bending not breaking) on
  over time, after the core loop is real.

### Deferred questions (answer later, per Paolo)
- Is "kill anyone incl. quest NPCs" sniper-specific or whole-game (any weapon, any
  range)? Leaning whole-game; sniper is just the most dramatic delivery. **Confirm.**
- When a killed quest NPC's thread reroutes, is the fallback AUTHORED by hand per quest
  or EMERGENT from systems (NPCs/factions dynamically grab loose threads)? **Open.**

---

## CONNECTIONS TO THE MAIN GDD

- Supersedes/extends GDD v3 Part One combat open questions (multi-enemy dial, cover +
  dial connection, 2v1+ pop-spam).
- The mana/ability layer = the second bar / time-dilation bar already in GDD v2 §14
  and §15. Do not design it here; it's part of the positioning system.
- Positioning / movement on tiles is the NEXT system after cover. The turn/action
  economy in this doc is deliberately the groundwork for it.

---

## SESSION 6.27.26 — PART 2 (combat demo direction + art/audio)

### Encounter flow
- **[LOCKED] NEW ENCOUNTER button on the MAIN screen** (not the menu). Spawns the next
  fight and does NOT heal — HP carries between encounters (attrition). If you're dead,
  NEW ENCOUNTER restarts the run (fresh full HP).
- **[LOCKED] Default difficulty = EASY on load** (playtesting).

### Spatial / cover model (on-screen authoring, the 3x3 he asked for)
- **[LOCKED] Top-down field replaces the black background.** Player = 1 tile, centered.
  The 3x3 of tiles around the player = MY cover-from-the-world toggles: tap a
  surrounding tile to place/remove my cover on that side (cardinal + diagonal).
- **[LOCKED] Enemies 1-8 spawn shuffled around me, any 360° direction.** Closest = 6
  tiles away. Max range = Claude's call (proposing ~14).
- **[LOCKED] Tap an enemy token to toggle whether THEY have cover in front of them**
  (relative to their facing toward me).
- **[LOCKED] Cover settings (mine + each enemy's) PERSIST across NEW ENCOUNTER.**
  Wherever enemies re-spawn they keep their cover state, rendered as cover in front.
- **[LOCKED] Cover art = Claude's call.** Mine = barriers around my ring by direction;
  theirs = cover in front of them facing me. Design it, not a plain box.
- Hand-authoring layer for the flank picture now; tile geometry drives it later.

### Auto-aim when exposed (priority rule)
- **[LOCKED] Exposed = shoot without popping, automatically, FIRST priority.** If I'm
  exposed to an enemy ready to fire (flanked / no cover between us), the code goes
  straight to the shot — no pop step. This is the top-priority path each turn.

### UI simplification
- **[LOCKED] The FIRE button is the only button that matters, and it lives bottom-RIGHT.**
  The cover/pop state merges INTO the fire button: GREEN at a good moment, RED at a bad
  one. No separate gap bar.
- **[LOCKED] The red/green BAR is dead.** The pop-from-cover minigame needs a real
  visualizer experience like the dial got, not a bar. **[OPEN: cover-pop visualizer
  concept — brainstorm + build together.]**

### BPM / rhythm (the spine)
- **[LOCKED vision] Music holds a constant BPM across the whole module** as one
  continuous audio experience. (Engine already carries BPM_MS.)
- **[OPEN] Beat-quantized inputs** — POP/WAIT/FIRE only fire on the beat so play stays
  in time with the song. **CONFIRM: build beat-gated inputs now, or keep constant-BPM
  as an audio vibe first?**
- **[LOCKED] Killshot slow-mo / time-dilation also slows the BACKGROUND SONG** — tempo
  follows game time.

### Faction floor-panels (background)
- **[LOCKED] ~20 factions each get a ROUGH top-down floor panel** as the encounter
  background (replaces black). No walls, no collision — pure background texture/vibe
  (inside or outside). Rough rough draft.
- **[LOCKED] Selectable / randomized-shuffle in settings** as a playtest tool. NEW
  ENCOUNTER on a faction map spawns THAT faction's enemies (names themed to the
  faction; don't customize enemies beyond names yet).

### Audio — faction songs
- **[LOCKED ask] ~30-second loop per faction at the shared BPM.** Claude can do this
  PROCEDURALLY (Web Audio synth: drones, arps, percussion locked to the BPM), distinct
  per faction, slowing with killshot time-dilation. NOT produced/recorded tracks —
  synthesized in-browser. Start with a few, expand toward all ~20.

### Dial arcs visual
- **[LOCKED] The kill/vital/hit ARC bands on the dial look bad — glow them up, give
  them life.** Do NOT touch the reticle, player character, wedge, or ghost fan. Don't
  overspend time.

### Logo (standing request)
- **[LOCKED] EVERY build, Claude takes a stab at a Bohemia logo** — pixel/Stardew
  post-apocalyptic Vegas or any fitting direction, high quality, iterating toward the
  perfect one. Variations welcome.

### RHYTHM MODEL — LOCKED (grounded in Crypt of the NecroDancer)
Bohemia combat is a turn-based rhythm game. Reference: Crypt of the NecroDancer
(turn-based roguelike rhythm game). Proven design lessons we are copying:
- **No punishment for missing the beat.** Off-beat does NOT damage you. NecroDancer's
  creator found strict timing too stressful; he widened the window and made misses cost
  only the score MULTIPLIER, not health. We do the same.
- **The greed meter IS the groove multiplier.** (Already built.) On-beat shots build the
  greed/XP multiplier; off-beat shots still fire but break the groove. Reward, not wall.
- **Beat window rides the 5 packages.** Fat window on EASY, sliver on BOHEMIAN. No
  separate strictness setting — difficulty already owns it.
- **Player acts first, always.** (Already locked.) NecroDancer: all characters act on
  the beat, player action has priority. Same as ours.
- **Killshot slow-mo bends the song tempo** (our addition beyond NecroDancer).
- Dial sweep, cover blooms, and inputs all answer to one master BPM clock.

### Playtest target
- Test everyone-in-cover including the player, **8 enemies, BOHEMIAN → EASY** (needs the
  self-cover toggle above).

### SILENT-PLAY LAW + EAR/EYE TRUTH (LOCKED — hard rule)
- **The beat NEVER gates input. Silent play is first-class.** Audio off, loud bus,
  Bluetooth lag — none of it can make you play worse or miss a window. The game is fully
  winnable, readable, and fair with sound completely dead. The SCREEN is the source of
  truth (zero latency); audio is a second channel that rides along, never required.
- **Two channels, same truth.** Eyes open: read the needle, catch exact center. Eyes
  closed: ride the beat. Both land the kill; neither is required; they can't desync
  because they're the same event rendered twice.
- **This forces the phase-lock:** the dial's center pass (kill window) must land ON the
  beat, predictably, every pattern. So holding greed and releasing on the beat with eyes
  shut = releasing at center = a KILL. Same for cover: the pop window opens on the beat
  so you feel the gap by ear. Implemented via a per-pattern phase offset that lands the
  primary center pass on an accented beat.
- **Ear vs eye edge (LOCKED default):** releasing on the beat reliably lands a KILL
  (you're in the kill zone). The dead-center FLAWLESS killshot (max XP + fattest greed
  multiplier) still rewards the eye that caught exact center — a hair tighter than the ear
  alone. Blind play fully winnable; eyes-open play still better. Greed rewards sharpness,
  not which sense you used.
- **Killshot slow-mo bends the song** because the picture slowed and the music follows
  the picture, never the reverse.

### Playtest tuning notes (not changes yet)
- Paolo may later make BOHEMIAN more forgiving after playtesting. EASY stays as-is even
  though some easy patterns are "low-key bullshit" (acceptable / funny for now).

### PATTERN RE-RANK (v12, Paolo's playtest call — ground truth)
Post sync+glow, Paolo re-ranked. New `PAT_DIFF` tiers (EASY=1 NORMAL=2 HARD=3 BOHEMIAN=4):
- **flutter2, pendulum: 4 → 2 (NORMAL).** swing, skip, ricochet, heave: **3 → 2 (NORMAL).**
- **spiral: 4 → 3 (HARD).**
- New counts: EASY 22 · NORMAL 14 · HARD 7 · BOHEMIAN 9.
- **flutter2/pendulum behavior (as Paolo asked):** at tier 2 they are NOT in the BOHEMIAN pool
  (tiers [3,4]); BUT the point-blank rule DOES apply — on a BOHEMIAN-selected fight a point-blank
  enemy pulls an easier effective package (NORMAL), so they can still surface up close. Verified.
- Re-tiering changes a pattern's speed → its cycle length → its on-beat phase, so all 7 were
  re-verified; **heave needed a phase recalibration (→ 0.0)**, the other 6 stayed locked. Result:
  clean play **100% on-beat on every package**; greed 89–94% (inherent tighter window).

### DIFFICULTY NAMING UNIFIED (v12) — ONE vocabulary
Killed the two-name-set confusion. Everything now uses the package vocabulary:
- **Packages (5, what you select):** EASY · NORMAL · HARD · V.HARD · BOHEMIAN.
- **Pattern natural tiers (4, intrinsic hardness):** renamed EASY · NORMAL · HARD · BOHEMIAN
  (was EASY/MEDIUM/HARD/VERY HARD). The tier names are now a clean subset of the package names;
  V.HARD is package-only (it's the blend that spans tiers). No more "MEDIUM" or "VERY HARD"
  anywhere in the build (verified: 0 stray instances). Engine comments aligned to V.HARD too.

### RANGE READOUT + PATTERN TEST DROPDOWN + LOGO RECOLOR (v12)
- **Range is now visible.** Each enemy chip shows its range tier + distance (PB/MID/FAR ~Xm,
  color-coded amber/green/blue). In the dial, the readout leads with the target's range tier and
  **the effective dial package this shot is actually using** (e.g. "POINT BLANK ~7m · EASY DIAL ·
  SNAP") — so when an easy pattern shows up on a hard fight, you can see it's because the target
  is point-blank pulling an easier dial, not a bug.
- **Pattern test dropdown** lives in the combat HUD next to the enemy info (not in settings).
  Locks the dial to any one of the 52 patterns (grouped EASY/MEDIUM/HARD/VERY HARD) for fast
  back-to-back testing; "PATTERN: AUTO" returns to normal package rolling. `G.forcePat`.
- **Logo recolor (stab #6):** dropped the bone/ember entirely — cold steel-white letters, deep
  indigo shadow, hot MAGENTA fault seam (the Amalgamation bleeding through the crack). Same
  italic-slip-fault form, new color story.

### DIFFICULTY REBALANCE OWED [OPEN — Paolo flagged]
The package felt-difficulty targets (`PKG_FELT` → speed convergence) were tuned BEFORE the beat
sync + leading green UI existed. Those two made landing kills meaningfully easier across the
board, so the whole curve now reads easier than when the patterns/packages were first ranked.
**The difficulty packages need re-ranking against the synced+glowing build.** How it works today
(confirmed for Paolo): difficulty = pattern SHAPE × SPEED; an easy-shaped pattern dropped into a
harder package is SPED UP so its felt difficulty matches the package target — so yes, the same
easy pattern has tighter timing on HARD than on NORMAL. Re-balance approach TBD: likely bump
`PKG_FELT` speeds up now that the floor is easier, and/or Paolo re-playtests and re-ranks with the
new pattern-lock dropdown making A/B testing fast.

### DISTANCE / POINT-BLANK SYSTEM (explained + spread fixed, v12)
**What it is (Claude built this; flagging it so it's canon now):** every enemy has a distance
`e.edist` in tiles (~1.5m each). Distance drives THREE things:
1. **Which dial package the shot pulls.** `distPkg = round(distT × your selected package)`. Point
   blank → easier dial (even on BOHEMIAN a point-blank shot draws EASY); long range → your full
   selected difficulty. So the SAME fight gives an easy big-window dial up close and a fast tight
   dial across the lot. This is the distance↔dial-arc tie: range sets how hard the shot is.
2. **How accurately the enemy hits YOU.** `distAccuracy = 0.97 − distT×0.60` → ~95% point blank,
   ~37% long range. Close enemies are deadly; far ones rarely tag you.
3. **Target priority.** Shoot/chain picks the closest exposed enemy first.

**Envelope (locked):** `PT_BLANK=4` (~6m, point blank), `FAR_TILE=26` (~40m, where difficulty
maxes), `MAX_RANGE=42` (~63m, back of an open lot). Reasoned from real CQB/urban gunfights:
most fighting in the 15–50m band, point blank a few meters, hard ceiling where a pistol/SMG/
shotgun fight stops being realistic.

**The fix:** enemies used to all spawn 5–20 tiles = everyone near point blank, so the range
mechanic never showed. Now **at most ONE enemy is point-blank** (none-or-one for 1–2 enemy
fights); the rest fan across the mid-to-far band with a clear gap. 8-enemy BOHEMIAN example: one
at ~7m pulling an EASY dial, the rest stepping out to ~63m pulling HARD→V.HARD→BOHEMIAN. The
render maps the full envelope to screen radius, so far enemies sit visibly farther back.
[OPEN] later: kill-zone width could also shrink with range on top of the package pull if the
distance pressure needs to read even harder — not done, package pull carries it for now.

### CORE PHILOSOPHY (LOCKED, applies to the WHOLE game) — RHYTHM IS PRIMARY
Above input, above what the player wants in the instant, above everything: deliver a 100%
on-the-grid rhythmic experience. If something has to lag or slow-mo for a beat to stay locked
to the BPM, it lags. This is not marketed as a rhythm shooter — it's just the standard.

### GREEN CUE + GREED TRANSITION + BUTTON LIFE (v12)
- **Green felt late → now LED.** The green fire-button flare was driven by the metronome accent
  (once per cycle), so it lagged the needle and only lit every cycle. Rewrote it to read the
  ACTUAL dial center every frame and **lead ~85ms** (predicts where the needle is going), so it
  flares as the needle arrives at center and on-time stops reading as late.
- **Green every center pass, not every other.** It now flares on every approach to center (ramps
  up as it nears, full in the kill zone), per Paolo — not gated to one beat per cycle.
- **Greed transition fixed.** Greed used to halve the cycle the instant you pressed, mid-bar,
  which jumped the needle out of phase. Now greed is "wanted" on press but only **engages/
  disengages on a beat boundary** (`greedWant` vs `greedHeld`, flipped in `beatTick`), so the 2x
  speed-up lands on the grid. Release still fires immediately.
- **Button does more visual action.** Aim button now **scales up to ~1.17x** with the green
  proximity plus a beat pulse. Cover button **breathes on every song beat** and sizes by danger
  (pop-now green biggest, dead lulls smallest).
- **cascade + quake banned from the top brackets.** They're tier 1 (easy) and were already out
  of the V.HARD/BOHEMIAN pools, but the point-blank "close range pulls an easier dial" rule could
  still surface them while playing V.HARD. Now when V.HARD or BOHEMIAN is the SELECTED package,
  `rollPattern` re-rolls past cascade/quake so they never appear there, even point-blank.
- **Transitions verified:** one continuous song clock drives every phase (cover/aim/freeze), the
  dial reads it, greed flips only on beats, freeze keeps the clock steady — so re-pop, enemy→
  enemy chain, and killshot slow-mo→next target all stay phase-locked by construction.

### DIAL ARMED TO THE SONG BEAT (v12) — the sync that makes it a rhythm game
**Architecture (the real fix):** the dial no longer runs its own free clock that could drift
from the song. Every aim frame the demo sets `G.beatClock = beatNow()` and the engine's
`tickPat` reads it (`if(G.beatClock!=null){ G.patT=G.musicT=G.beatClock; }`). The dial is the
song clock. **Locked by construction, not by a reset** — so re-popping from cover, chaining to
the next enemy, and waiting all read the same one clock and physically cannot drift apart.
- **Even cycles + greed:** `beatsForCycle` forces an EVEN beat count; greed halves it
  (`n/2`, twice as fast) instead of 2x-ing the clock, so greed kills still land on whole beats.
- **Song is dead-steady:** `stepDur` no longer bends during the killshot freeze, so the beat
  never wobbles.
- **PHASE re-calibrated from scratch** (brute-force, 360 steps/pattern, scored only over the
  packages each pattern actually appears in, greed on+off, against the real slaved needle).
**Verified by simulation (fire within ~30ms of the beat = kill):**
  - Clean play (no greed): **EASY/NORMAL/HARD 100%, VHARD 97%, BOHEMIAN 91% → 97.7% overall.**
  - Greed held (2x): ~88% overall — the window is real but tighter because doubling speed
    naturally narrows it (the risk side of the greed bargain).
  - Chain (kill→next enemy) and re-pop both hold because they read the same clock.
**Still loose / owed:** dart (worst), skip, flutter2 under greed, and avalanche (already flagged
for cutting). Options on the table: hand-tune those few by reshaping their center pass, or pull
them; and if greed should be fully locked too, widen the kill zone during greed or stop halving
cyc on the top tiers. NOT 100% on the absolute hardest patterns under greed yet — honest.
Implemented Paolo's two: **green chime = arpeggio in the faction key**; **killshot slow-mo
snapped to whole beats.** **Logo stab #5:** bold poster, bone face + hard ember drop-shadow.

### NEXT SUGGESTION (depth/addiction) — "YOUR STREAK BUILDS THE SONG"
Pitched, awaiting greenlight. Make the faction loop ADAPTIVE to how well you're playing the beat:
each on-beat kill in a chain adds a music layer (a lead line enters, percussion thickens, the
bass opens up); a miss or a broken chain strips layers back down. The music stops being an
overlay and becomes a live readout of your performance — you literally play the song with your
kills, which is the addictive hook and directly answers "it doesn't feel like a rhythm game."
Natural next stage: a full chain fills the GDD's **time-dilation bar** → a brief bullet-time
spree where the world slows but the beat keeps pumping (the fifth-dimension mechanic, made
playable). Rhythm mastery → builds the song → earns the flow state.
**Audit (what was on/off the beat):** ON 120 = the dial needle (`patT`), the music loop
(`_seq` @ stepDur 120), the metronome (`musicT`), the kill-window accent. OFF 120 = the
ENEMIES — cover cycles ran on raw wall-clock ms (`e.ct += dt*1000`) with random per-enemy
periods + per-turn chunks, so peeks/fires and therefore the green pop window + chime drifted
free of the song. (Also off-grid but cosmetic: killshot camera lengths, a few setTimeout
pauses.)
**Fix:** enemy cover cycles now ride `_bpmClock` (the continuous beat clock the music plays
on). `beatNow()=_bpmClock/BPM_MS`; cycle length = whole beats by package `cycBeats()` =
{EASY/NORMAL 8, HARD/VHARD 6, BOHEMIAN 4}; `efrac(e)` = phase from `beatNow()` minus a
per-enemy whole-beat `beatOffset` (set in setupEnemies = `round(i/N * cycBeats)`), so enemies
stagger across the bar and their windows INTERLEAVE on the grid. Grid-friendly window phases:
PEEK_S=0.50, FIRE_S=0.75. Removed all manual `e.ct` advances (real-time + per-turn);
turn-end/wait now only decay stun. Result (verified): guns-up pattern is periodic on the bar —
same every cycle — so the green/red pop windows and the chime recur in time with the music, for
any enemy count and any package (harder package = shorter cycle = windows on faster beats, never
off-grid). Dial center already lands on the downbeat, so now BOTH halves (read + aim) ride one
clock. STILL TODO for full feel: make the green chime a musical note in the faction key; quantize
killshot camera lengths to beats.
Before, the button only went red when forced to SHOOT; covered-from-everyone left it green even
with 8 guns up. Now, in POP mode the button color warns how dangerous popping is THIS instant
(popping breaks cover → all out enemies shoot back): **green** = clean lull, no guns up, best
moment; **amber** = one gun up, or 4+ peeking that could snap-fire — risky; **red** = 2+ muzzles
up, popping now eats several shots; **grey** = nobody out. SHOOT (forced, you're exposed) stays
deep red. In an 8v1 with everyone cycling cover, the button now flickers amber/red and flashes
green on the gaps you should pop into — the window-read he wanted.

### RED-LINE LOS RULE (v12) — confirmed + visualized
**Locked rule:** only enemies with a red line on you (currently popped out / exposed) can
participate in the dial. **Tucked enemies have no red line — they can't shoot you and can't be
shot by you.** Verified the build already enforces this: every pool (shoot=`exposedToMe`,
pop=out enemies, return fire=out enemies, pop-hot=out enemies) excludes tucked enemies; tucked
never counts in any direction. Display now shows three line states so the pool is legible:
**RED** = live threat (enemy out + you're uncovered) and a valid target; **AMBER** = out but
you're covered (a target only if you pop/lean out); **faint** = tucked, no line, not in play.

### RHYTHM FEEL — OPEN PROBLEM (Paolo unsatisfied, 6.28)
Paolo: the dial doesn't feel like a real rhythm game right now, especially once the faction
music overlay is on. Diagnosis on the table: the kill window is phase-locked to the downbeat
in code, but nothing makes the player FEEL the dial center land on the beat — the music reads
as background wallpaper, not as instruction. Direction to explore (not yet built): make the
dial visibly + audibly SNAP to the beat (center-cross lands on the kick, zones/dial pulse on
each beat, a satisfying on-beat fire sound that fits the loop) so you could play it with your
eyes closed by listening. The "on-beat kills buy tempo" suggestion only pays off once the beat
itself feels real. **PENDING Paolo's call on whether next build = rebuild the beat feel.**
The whole pop/shoot/chain/return-fire model now keys off **how you entered the engagement**,
so it's flexible for any enemy count and every LOS×cover combination.
- **`G.engageMode`** set when you press the button: `'shoot'` if anyone is exposed to you
  (forced), else `'pop'` (voluntary). `modePool()` is the set you may shoot this engagement:
  shoot → `exposedToMe()` only; pop → anyone peeking.
- **Chain stays inside the pool.** `nextChainTarget()` draws from `modePool()`; when it's
  empty the turn ends. So: exposed to 1, kill it → turn ends (no free shots on the covered 7).
  Exposed to 2 → kill first, chain to the 2nd exposed, then end. **Fixes the bug where a
  killshot on an exposed enemy rolled onto an unavailable peeker.**
- **No POP while exposed** — button is SHOOT, target pool is the exposed enemies, you must
  clear them first. (Already enforced; now the chain respects it too.)
- **Return fire has two pools (`endTurnReturn(engaged)`):**
  - **engaged=true** (you popped/shot — you broke cover): EVERY enemy who's out with a line
    shoots back; your cover toward a shooter only softens them to 0.4×, doesn't erase them.
    → **Fixes "covered from all 8, miss on purpose, take no damage."** Now ~24 dmg/turn vs 8.
  - **engaged=false** (WAIT — you stayed tucked): only `exposedToMe()` (enemies you have no
    cover toward) can tag you. Waiting while fully covered = safe; waiting while exposed costs.
- **Distance still drives accuracy** in both pools (firing 1×, peeking 0.6×, point-blank ~.97).

### MUSIC START — real fix
AudioContext resumes async; the loop was scheduling before the context was running. `startGame`
now resumes then (re)starts the faction loop in the resume callback (+180ms fallback,
`stopFactionLoop` first so the restart isn't blocked). MAST gain 0.95.

### LOGO stab #4 — "dead neon"
Bone tube-letters with an ember glow bleeding out behind (additive halos) + ember underglow
baseline. Stabs: #1 flat emboss, #2 carved extrude, #3 outlined two-tone, #4 dead-neon glow.

### SUGGESTION on the table (cover degradation REJECTED — too complex). New one:
**ON-BEAT KILLS BUY TEMPO (rhythm → suppression).** Land a killshot tight on the downbeat and
every enemy's peek/fire cycle briefly slows (you seize the fight's tempo). Rewards the rhythm
mastery the game is already built on, makes a clean kill-cascade feel like flow state, scales
with crowd size (more enemies = more value), and ties the music directly to tactics. **No new
UI** — you just see/feel them peek slower for a beat. Awaiting greenlight/customization.
- **Multi-shooter return fire confirmed correct:** `endTurnReturn` rolls each enemy in
  `exposedToMe()` independently. Exposed to 3 → 3 roll; covered from 1, exposed to 2 → 2 roll.
- **VITAL RULE LOCKED:** a vital that doesn't kill → **stun 2 turns + advance to the NEXT
  target** (chain continues on a different enemy). Fixed the double-shoot bug: `pickTarget`
  now skips stunned enemies, so a vital no longer re-targets the same guy. (Supersedes the
  early "non-kill gives a re-shoot on the same target" idea.)
- **Popping now has real, scaling risk.** Popping breaks your cover, so every enemy who's
  OUT gets a crack at you; risk scales ~linearly with how many are up (1 enemy ≈ 1/8 of 8),
  by distance, with your cover toward a shooter cutting their chance to 0.4×. No more
  free/safe popping when everyone's in cover. (Verified ~8× from 1→8.)
- **Music start FIXED:** AudioContext was created suspended; now `AC.resume()` on the start
  tap so the faction loop actually plays.
- **POINT BLANK = 5 tiles** (was 3). Enemy `edist` now spreads 5–20 so they don't all spawn
  on top of you; accuracy + dial difficulty both keyed to that wider range (point blank
  enemyAcc ~.97 & EASY dial; 20 tiles ~.37 & full package).
- **Logo stab #3:** dark knockout outline + hard bone/ember two-tone split + heavy ember
  baseline (stamped-emblem look). Stabs so far: #1 flat emboss, #2 carved extrude, #3 outlined
  two-tone.

### WORKING CADENCE — AGREED
Every playtest: Claude does exactly what Paolo asked, **then** proposes ONE new suggestion
(no new UI) that Paolo greenlights or customizes for the FOLLOWING build. Suggestions get
built only after his go-ahead.
- **Suggestion on the table (awaiting greenlight): COVER DEGRADATION.** Cover wears down
  under fire — each hit that lands against a raised cover cell chips it; after enough hits
  that cell cracks and fails, exposing that direction until you reposition. Punishes turtling
  in one spot, scales with enemy count (8 guns chip you fast), reinforces "popping/cover has
  risk," uses only the existing 3×3 cells (cells visibly crack → break). No new UI.
- **Point blank defined in code:** `PT_BLANK=3` tiles, `FAR_TILE=13`. Distance drives
  everything. Enemy accuracy `distAccuracy`: ~0.97 at point blank → ~0.37 far (up close they
  rarely miss). Your dial difficulty `distPkg`: point blank pulls EASY patterns, far pulls
  your selected package — **so a point-blank shot on BOHEMIAN still draws from EASY.** Close
  range = you rarely miss them and they rarely miss you. (Enemy `edist` now 2–13 tiles so
  some spawn point blank.) `G.userPkg` holds the selected package; `G.pkgDiff` is set per
  shot from target distance, restored to `userPkg` in cover.
- **Return fire is now per-enemy & independent.** Each EXPOSED enemy rolls its own
  distance-based accuracy → realistic mixes (1 of 3 hits, 2 of 3 hit, etc.), reported as
  "X of N hit you." No more all-or-nothing.
- **POP vs SHOOT fixed (the big logic bug).** The button is **SHOOT** (red) whenever ≥1
  enemy has a line on you that you have no cover toward — you must engage the exposed enemy,
  you can't safely pop. It's only **POP** (green) when you're covered from everyone who's out.
  Targeting prefers the closest exposed enemy. Scales to any count (3, 8, whatever): as long
  as one enemy is exposed to you, you're in SHOOT mode. Popping from safety can still catch a
  muzzle as you break cover; shooting while already exposed doesn't double-charge you.

### SPRITES ARE 2 TILES TALL — cover HEIGHT + crouch (LOCKED design answer)
Every human sprite is 2 grid tiles tall (feet on the lower tile, torso/head on the tile
above) so people read as people, not squished. **This does NOT change the horizontal angles
or line-of-fire** — bearings and LOS are computed from where the FEET stand on the 2D ground
grid; the 2-tall sprite is a rendering/perspective thing (Stardew-style), the footprint is
still one tile. What 2-tall ADDS is a height axis, and that's where partial cover comes from:
- **Full cover** = a 2-tall barrier → blocks the whole sprite.
- **Low/partial cover** = a 1-tall barrier → blocks the lower half; a STANDING 2-tall sprite
  still has head/torso exposed (a headshot lane). This is the RF4 low-cover type we locked.
- **Crouch** = when you have cover up in combat, your sprite crouches to a ~1-tall profile,
  so low cover that only guarded your legs now guards all of you. Stand behind low cover =
  head exposed (partial); crouch = fully hidden until you pop. Crouch is the visual state of
  "in cover" and a real tactical toggle, not just an animation.
So: angles stay 2D/feet-grid; height introduces full vs partial(low) cover and crouch. The
hittable point is the upper tile (torso/head) when standing, lower tile when crouched.
[BUILD LATER: render 2-tall sprites + crouch; wire low/partial cover as a half-block that
exposes the head of standing targets.]
**Music/beat drift FIXED.** The faction loop runs on the AudioContext hardware clock while
the dial was advancing on the requestAnimationFrame clock; those two diverge over time =
the drift Paolo felt. Now the dial reads its dt from `AC.currentTime` whenever audio is
live, so dial + music share ONE clock and can't drift. (Start screen gives them a shared
origin too.)

**Spatial field built (fixes "enemies stacked in front" + enables self-cover).**
- Enemies now spawn at distinct shuffled angles around 360° at 6–14 tiles out (verified: 3
  enemies seed ~60/180/300°), not all dead-ahead. `e.ea`/`e.edist`.
- Cover phase now renders a TOP-DOWN FIELD on the canvas (was the lone dial): YOU in the
  centre, the 8-cell 3×3 self-cover ring, enemies around you with threat colour (red firing
  / green peeking / grey tucked), their cover shield arc facing you, HP bars, and lines of
  fire (red when they have a line you're not covered from).
- **Tap a ring cell = toggle MY cover there. Tap an enemy = toggle THEIR cover** (persists
  across NEW ENCOUNTER). Hit-testing uses stored positions.
- **Dial now turns to face whoever you're shooting** (`G.faceAng = target.ea`) — pop drops
  you into the dial pointed at that enemy, instead of always dead-ahead.
- **My cover blocks return fire:** an enemy whose bearing maps to a raised cell can't hit me
  (`myCoverAgainst` via `dirIndex`, RF4 line-of-fire model). Diagonal corner = full block,
  as locked.
- Still rough/first-pass: threat-ring "wind-up" pop visualizer, low/partial cover, and
  move-a-tile-as-a-turn are the next polish on this field.
- **POP auto-fire BUG fixed.** Combining the buttons made the same press that popped also
  fire on release (it entered aim then fired instantly). Added `_fromPop` so a pop opens the
  dial and that release does NOT fire; the next press aims/greeds/fires. Pop now properly
  drops you into the Dead Eye Dial.
- **Dial arcs rebuilt as a graduated GAUGE** (was fat blurry bands / "fat circles"). Now: a
  dark instrument track, 24 graduated tick marks (major every 6) reading inward, crisp thin
  butt-capped zone segments (blue hit / amber vital / ember kill with a slight beat glow),
  and a bright center kill line. Wedge / reticle / ghost fan untouched per Paolo.
- **Killshot camera default = SHUFFLE.**
- **Faction SHUFFLE option added + default on.** Picks a random faction (floor + music) at
  start and on every NEW ENCOUNTER. Explicit faction pick turns shuffle off.
- **START SCREEN added** hosting the BOHEMIA logo + TAP TO START. One tap unlocks audio and
  gives the music + dial a single shared start moment (addresses the music/BPM not starting
  together). (Deeper phase-align of the loop to the metronome clock = follow-up.)
- **Logo refactored** to render both the small header mark and a big start-screen mark from
  one function (stab #2 style: condensed, carved extrude, bone→blood-ember).
- **Enemy cover now fully clickable** (whole box, not just the label) and **persists across
  NEW ENCOUNTER** (coverLocked carried by slot).

### STILL OWED (next, the spatial field)
- **Player 3×3 self-cover** (click the cells around you) — not in yet; lands with the
  top-down spatial field. This + the threat-ring pop visualizer are the v13 centerpiece.
- Music loop ↔ metronome deeper phase-lock; migrate audio to the shared module.
The clear/under-fire bar is GONE; its signal moved into the bottom-right button. In cover
phase the circle goes GREEN (clear — pop now), RED (a gun's up — risky), or neutral grey
(no one peeking). Reads FIRE + beat-glow while aiming. One button, all the info.

### LOGO STAB #2 (done, v12)
Second pass: condensed (taller-than-wide) letterforms, carved 3D extrude, bone→blood-ember
fade with a left rim-light, ember baseline. Screenshot it against stab #1 (flat bone→ember
emboss). Still in-screen, judge letterforms.

### ALL-FACTION SYSTEM — procedural floors + 120-locked music (done, v12)
Answer to "what stops you doing all factions": nothing, it's procedural. Built a generator,
seeded all 14 GDD factions (Custom, Reds, Blues, Anarchists, Colorful, Church, Network,
Trades, Caravans, Volunteers, Remnants, Cartel, Mob, Homeless).
- **Floor-grid background** (`drawFloor`): each faction = palette (base/line/accent) + a
  motif (stripe, grid, shard, confetti, circuit, hazard, check, cracked, stencil, plate,
  aisle, cross, dust). Replaces the black void; vignetted so the dial reads on top. Picker
  in settings.
- **120-locked music** (`startFactionLoop`): a 16th-note step sequencer at the fixed 120
  (bar = 2000ms = one 4-beat bar, verified). Each faction = kick/bass/hat step patterns +
  root + scale + waveform, synthesized in-browser (no recorded tracks). Bends with killshot
  slow-mo (stepDur ×2.4 while frozen). MUSIC ON/OFF toggle in settings.
- **NOTE — permanence:** this currently lives in the demo file. Per the sound-permanence
  rule it should migrate into the shared stamped audio module so it never gets scrapped on a
  rebase. Functionally complete now; module-migration is a structural follow-up.

### STILL OWED — the "awesome" pop-out visualizer (next, with the spatial field)
The duck/pop-out minigame still needs its hero visual (the threat-ring: enemies' directions
blooming red as they wind up, green gaps to pop). That's the centerpiece of the spatial
field (v13) and gets the focused build, not a rushed bolt-on.
POP/SHOOT bar and the FIRE circle merged into ONE button pinned bottom-right. Reads "POP"
in the cover phase (triggers doPop), "FIRE" while aiming (greed-hold + release). Beat glow
still rides it during aim. Old separate POP button removed.

### LINE-OF-SIGHT / COVER MODEL — LOCKED (grounded in Rogue Fable IV)
The game operates on line of sight + line of fire like RF4: cover is whether a SOLID BLOCKER
sits on the line between an enemy and you, not a stat. Each of the player's 8 cover cells
blocks the enemy lines that pass through it. Getting flanked = an enemy whose line passes
through no raised cell.
- **Diagonal answer (locked):** a corner cover cell FULLY blocks an enemy on that exact
  diagonal, because the corner sits directly on their line of fire. Full cover regardless of
  wall facing.
- **Low cover = separate category (future):** RF4-style half/low cover (bushes) where shots
  still get through at reduced odds. Built later as a distinct partial-cover type, NOT a
  consequence of diagonal geometry.
- RF4 also confirms our spine: skill over stats, movement-focused, fast/slow oscillation,
  fights kept to ~5-6 enemies (our 8 = the hard ceiling), archers fire on a telegraphed
  cadence (our peek/fire cover cycle).

### BACKGROUND + FACTION MUSIC — sequencing (answer to Paolo)
Both ship in v13 (the spatial rebuild). The faction floor-panel IS the background. Faction
music rides the finished 120 lock; only blocker is standing up the shared audio module
(permanence). Plan: build v13 with ONE faction end-to-end first — its floor-panel
background, its enemies around the player, its own 120-locked procedural loop — a vertical
slice to stand in and hear. Then other factions are just more art + loops on the same rails.
Scrolled the full session transcript. Status of everything Paolo asked for:

DONE & in v12: shared engine/stamp; v11 convergence (v9 polish + dial-aim + v10 model);
settings drawer; NEW ENCOUNTER on main screen (HP carries, death=restart); per-enemy cover
states; shoot-first + per-LOS return fire; 8-perfect-kills = 1 turn; WAIT a turn; vital
stuns + chain-on-kill-or-vital + no stun-lock (one regular turn before re-stun); difficulty
packages; 120 rhythm lock; in-screen pixel logo. **Three new asks just shipped:** logo a bit
bigger (44px); default weapon = SHOTGUN; killshot camera SHUFFLE option (random style each
kill).

NOT done yet — **THE SPATIAL REBUILD (v13, building next), full locked scope from transcript:**
- Top-down field replaces the black void. Player = 1 tile, dead center. 1 tile = 1 metre.
- The 3×3 ring around the player: each of the 8 cells is CLICK-toggle = MY cover (art =
  cardinal barrier facing outward). Cover from a cell blocks enemies in that direction.
- Enemies 1–8 placed shuffled around the player in any 360° direction; closest = 6 tiles,
  max range Claude's call (~14). Click an enemy's health/status box = toggle THEIR cover
  (art = cover facing me). **Both my cover and theirs PERSIST across NEW ENCOUNTER**, and
  enemies keep their cover wherever they respawn.
- Only enemies with a line on me are in the fight; my 3×3 cover decides who's blocked.
- AUTO-FIRE when I'm caught exposed (no pop needed) — first priority.
- Move 1 tile = 1 turn (crouch to an adjacent tile). Abilities reserve turns too:
  move-2-and-shoot = 1 turn, auto-killshot, see-enemy-next-move (all future, code leaves room).
- Cover-pop visualizer must SCALE WITH DIFFICULTY (v9's was static). Lead idea: a threat-ring
  around the player where each enemy's direction blooms red as they wind up to fire; pop in
  the gaps. Replace the flat gap bar.
- Faction floor-panels per ~20 factions + procedural faction songs at the fixed 120 (later).
- Weapon zones (shotgun close = more forgiving kill window) not yet modeled — future.
Holding fire (greed) double-times the DIAL for the XP risk but does NOT touch the song.
Verified: metronome stays 120 BPM while greeding, and the kill windows still land on the
120 grid (on quarter/8th positions). So holding fire = riding faster subdivisions against
the same steady pulse. It matches; nothing drifts.

### LOGO — now a real hand-built pixel wordmark (not a font)
Replaced the Courier-New-with-a-shadow placeholder. `BOHEMIA` is drawn pixel by pixel from
a hand-authored 7-row glyph map onto `#logo` canvas (pixelated scaling): bone→ember
gradient down each letter, emboss drop-shadow, top hilite pips, ember baseline, a few
weathered/chipped pixels (M/B/A corners) for post-apocalyptic grit. First real stab at the
logo — judge letterforms + spacing, iterate from here. Still in-screen, no standalone file.

### MASTER TEMPO / BPM — LOCKED AT 120, IMPLEMENTED (v12)
Paolo's call: **everything is 120 BPM from now on.** Implemented without changing how any
difficulty feels to play.
- **Dual clock.** `G.musicT` advances at a fixed 2 beats/sec = **120 BPM always** (song +
  metronome ride this). `G.patT` drives the dial and still runs at each pattern's own
  real-time speed (greed double-times patT only, not the song).
- **Feel preserved.** Each pattern's cycle is expressed as `N = round(2 × old-cycle-seconds)`
  whole 120-beats (`beatsForCycle`), so the dial keeps its current real-time speed on every
  package. Verified: new/old dial cycle-time ratio = EASY 1.005 · NORMAL 1.003 · HARD 1.018
  · VERY HARD 1.008 · BOHEMIAN 1.021 (≈identical). EASY still crawls, BOHEMIAN still flies;
  only the song grid is fixed.
- **Kill window lands on a 120 grid beat.** PHASE re-baked for the new clock; verified
  blind-on-beat: EASY 52/52 KILL · NORMAL 52/52 KILL · BOHEMIAN 51 KILL + 1 vital · zero
  misses. Eyes-closed test still true.
- **Producer spec is final: 120 BPM, 4/4.** One loop rides every difficulty. Difficulty
  scales by shape + window + subdivision density, never tempo. Killshot freeze pauses
  `musicT` → the loop time-bends down for slow-mo.
- `beatsForCycle(G)` + `K.BPM` (120) + `K.BEAT_RATE` (2) exposed in the engine API.

### MASTER TEMPO / BPM — (superseded; kept for history)
Measured the real-time tempo: it is NOT fixed. The metronome rides engine `patT`, which
advances at the per-pattern/per-package speed, so BPM swings wildly:
EASY 22–49 · NORMAL 27–60 · HARD 44–96 · VERY HARD 60–132 · BOHEMIAN 79–174.
A fixed-BPM loop would lurch out of sync on every pattern roll. As-is it can't carry songs.
- **Recommendation (Claude's call): lock ONE master BPM = 120** (500ms/beat, 4/4). Song
  always plays at 120. Dial cycles snap to whole beats of the 120 grid so the killshot
  always lands on a real beat. **Difficulty scales by pattern SHAPE + kill-window WIDTH +
  SUBDIVISION DENSITY (busier motion inside the bar), NOT by tempo.** One loop at 120 fits
  EASY→BOHEMIAN. This is how NecroDancer-style games scale hard without changing tempo.
- **Tradeoff:** BOHEMIAN can't literally move the dial faster in real time anymore; its
  speed feel comes from density, not tempo. This reframes the tuned "speed" knob.
- **[PENDING Paolo] fixed-120 (one loop fits all, my rec) vs tempo-climbs-with-difficulty
  (song speeds up, needs per-tier loop versions / DSP).** Not built until he calls it.
- Producer-friend spec if fixed-120: 120 BPM, 4/4, loop length = whole bars; killshot
  slow-mo will time-bend the loop down and back.

### SOUND DESIGN PERMANENCE — LOCKED (fixing the v9 scrap)
Why v9 audio was lost: it lived INSIDE the v9 file, demo-local. When combat rebased onto
the dial-aim base for v11/v12, demo-local sound didn't travel (same as hand-editing a
stamped engine block gets blown away). **Fix = same principle as the engine: sound moves
into a shared, stamped audio module** (`bohemia_audio.master.js`) injected into every
build. Design sound ONCE, it lives in the permanent shared layer, carries into every demo
and the final game. The procedural faction loops get built there from the start. **Rule:
sound work always goes in the permanent shared layer, never in a single demo file.**

### 10% TIMING FORGIVENESS — DONE (v12)
NORMAL and up get the kill/vital/hit windows widened ×1.10 (symmetric: covers an early
click OR a late release). EASY untouched (already fat + 19% slower). `fg` factor in
`fire()`. Paolo may push this further per playtest.

### BUILD STATUS — v12 (rhythm-truth build, SHIPPED this session)
File: `bohemia_combat_v12.html`. Engine: phase-lock baked into `bohemia_engine.master.js`
(PHASE table, 52 entries, re-stamped into v12).
- **Phase-lock done + verified.** Each pattern shifted by a baked per-pattern PHASE so its
  kill window lands on the downbeat (`patT%cyc≈0`). Computed by offline 1D phase search
  optimizing |needle| at the downbeat; no page-load cost.
- **Blind-play proof (release on the accent beat, eyes closed):**
  EASY 52/52 KILL · NORMAL 52/52 KILL · BOHEMIAN 51 KILL + 1 vital · zero misses anywhere.
  The one Bohemian holdout drops to a stun, not a whiff — exactly the intended ceiling.
- **Beat system in demo:** clock rides engine `patT` (screen = truth; audio follows, so
  Bluetooth lag can't desync it). Soft tick on every beat (`floor(patT)`), accent cue on
  the kill-window downbeat (`floor(patT/cyc)`). FIRE button glows amber on beat, flares
  GREEN on the accent = center is live, release now. Killshot freeze pauses `patT` →
  pauses the clicks → slow-mo (song-bend hook ready for the faction loops).
- **Also in v12:** default package = EASY; dial arcs glowed up (blue hit / amber vital /
  ember kill that flares on the beat, with shadow-glow); BOHEMIA pixel wordmark rendered
  in-screen (header, embossed); NEW ENCOUNTER button on the play screen (alive/won →
  respawn enemies, HP carries; dead → full restart).
- **Deferred to the spatial rebuild (next):** top-down faction field, 3×3 self-cover ring,
  enemies-around-me, auto-fire-when-exposed, cover persistence across NEW ENCOUNTER,
  cover-pop visualizer, faction floor panels, procedural faction songs at the shared BPM.

---

*Combat Addendum — started 6.27.26. Updated every working session.*
*Anything Paolo says gets written here the same turn. The file is the memory.*
