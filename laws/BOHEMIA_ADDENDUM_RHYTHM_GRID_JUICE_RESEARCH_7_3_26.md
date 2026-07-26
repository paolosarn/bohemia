# BOHEMIA ADDENDUM: RHYTHM + GRID GAME RESEARCH, STANDSTILL JUICE, DISPLAY SCALING
7/3/26. Paolo's ask: big research on how rhythm games and grid games make
themselves addicting, what applies to Bohemia RIGHT NOW (pre-movement,
standing still in a gunfight), what goes to the GDD later. Plus the
display-scaling question. Everything buildable is listed as a VERDICT
MENU per the new workflow: thumbs up what you want, it gets built.

## PART 1: WHAT THE RHYTHM GREATS ACTUALLY DO
1. CRYPT OF THE NECRODANCER: the beat IS the turn clock. You do not
   watch the rhythm, you LIVE on it: acting on-beat is the only way to
   act, and the whole dungeon (monsters, shopkeeper singing, torches)
   bounces on the same grid. LESSON: one clock, everything obeys it,
   the player's body learns it. Bohemia already HAS this law (120 BPM)
   but the dial scene barely SHOWS it yet.
2. HI-FI RUSH: everything in the world animates on the beat even when
   the player ignores rhythm entirely; playing on-beat is rewarded, not
   required. LESSON: ambient beat-sync is free addictiveness with zero
   difficulty cost. Directly applicable to standing-still combat.
3. BPM: BULLETS PER MINUTE: shooting and reloading only land on the
   beat; the gun is the drum. LESSON: the FIRE action snapping to the
   grid makes every trigger pull feel musical. The dial already
   quantizes; the FEEDBACK (muzzle, casing, sound) can hit the grid
   harder.
4. PATAPON / RHYTHM HEAVEN: call and response, the game answers your
   input in rhythm. LESSON: enemy return fire arriving ON the offbeat
   after your shot turns a firefight into a conversation.

## PART 2: WHAT THE GRID/TURN GREATS DO (pre-movement relevance)
1. INTO THE BREACH: perfect information, the enemy telegraphs
   everything. Standing still is a CHOICE you can evaluate. Already
   researched, already half-adopted (posture tells, washes).
2. SLAY THE SPIRE: intent icons over every enemy head. The read is
   instant. Bohemia's posture system IS this but embodied; the missing
   piece is NEXT-turn intent, not just current state.
3. DARKEST DUNGEON: atmosphere as pressure: the torch, the stress bar,
   the narrator. Standing still FEELS dangerous. Bohemia's equivalents
   (heartbeat, vignette, the floor) are unbuilt.
4. XCOM: the overwatch trade: not moving is itself a tactical stance.
   When the grid lands, HOLDING position should grant something (aim
   steadiness, a tighter dial) so standing still is a decision, not a
   default. [GDD candidate, PENDING Paolo.]

## PART 3: THE VERDICT MENU, standstill juice buildable NOW
Each is presentation-only, no mechanics change, thumbs up to build:
- A. BEAT-BREATHING WORLD: every idle/cover body on the field bobs on
  the 120 grid (the clips already loop on beats; sync their phase to
  the global beat so the whole street breathes together).
- B. FLOOR PULSE: the faction floor grid glows subtly on each beat,
  harder on kill streaks. The ground is the metronome.
- C. MUZZLE + CASING ON THE GRID: your shot spawns a muzzle flash and
  an ejected casing that lands on the next beat tick.
- D. RETURN-FIRE CRACKS: when enemies shoot and miss, visible bullet
  cracks whip past your body (near-miss lines + tiny impact puffs
  behind you). Standing exposed LOOKS survived, not ignored.
- E. LOW-HP HEARTBEAT: under 40% HP the screen vignettes and thumps on
  the beat, syncing your danger to the music.
- F. HIT-STOP: 2-3 frames of total freeze at bullet contact on kills.
  The oldest juice trick in games and still the best.
- G. GREED DESATURATION: holding greed drains the scene toward grey so
  the gold ghost trail becomes the only warm thing alive.
- H. KILL ECHO: on a kill, the victim's silhouette flashes once in the
  faction accent color before the fall.

## PART 4: DISPLAY SCALING, the 4x question
Current pipeline: 56px art, Scale2x to 112, drawn 1:1. The law says
Scale2x/EPX only, and EPX composes: Scale2x applied twice = clean 4x
(224px humans) with zero new art. So the answer to "do we need a 4x
system" is: the pipeline already contains it, it is one more pass, flip
it on per display class. The real work is LAYOUT, not pixels:
- Phone upright (now): field above, controls below. Working.
- Phone horizontal / TV / PC: same world, wider field, controls migrate
  to corners; the fire button + move ring anchor bottom-right, board
  data stays dead, HUD stays minimal.
- Integer scale ONLY per the grid law: pick 2x or 4x per device from
  screen height (roughly: under ~900px tall = 2x, over = 4x), never
  fractional. Canvas stays pixel-perfect at any window size by letterbox
  or by showing MORE WORLD, never by stretching.
[PENDING Paolo: nothing here needs a call until we target the second
display class; filed so the answer is waiting.]

## PART 5: WHAT MOVES TO THE GDD
- The one-clock law made visible: the world breathes on the beat (Part
  3A/B are the demo of a GDD-level aesthetic commitment).
- Standing still as a stance (XCOM lesson) once the grid lands.
- Call-and-response fire rhythm as a combat identity piece.
