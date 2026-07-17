# BOHEMIA QUESTBOOK — DEEP DIVE 60: PERFECT INFORMATION / TELEGRAPHED FAIR CHALLENGE (Into the Breach)
Full teardown, the whole enchilada: fully-telegraphed enemy attacks (perfect information), the puzzle-not-
tactics feel, no hit-percentages, the collateral-damage-priority twist, the small 8x8 grid, the once-per-
battle rewind, survive-not-eliminate objectives, the every-death-is-your-fault fairness, the honest flaws,
and Bohemia ports. This is the medium's MASTERCLASS in TRANSPARENT, TELEGRAPHED, FAIR CHALLENGE + elegant
minimalism + a themed objective twist. DIRECTLY relevant to our Dead-Eye dial readability + combat
fairness + mobile. Subset Games (Justin Ma + Matthew Davis; writing Chris Avellone, music Ben Prunty).
Reference only; Paolo does not read it. No Bohemia quest written here.

Game: Into the Breach (Subset Games, 2018; iOS/Android 2022). A turn-based tactics roguelike. You command
3 mechs on a tiny 8x8 grid defending civilian buildings from the Vek (giant bugs). The hook: EVERY enemy
attack is fully TELEGRAPHED in advance — turning each fight into a solvable PUZZLE. Metacritic 90 (best-
reviewed PC game of 2018); a design-elegance landmark. ON MOBILE (fits our platform).

===============================================================================
## 0. THE CORE IDEA (why it's in the canon)
===============================================================================
- PERFECT INFORMATION / FULLY-TELEGRAPHED ATTACKS (the defining hook): at the start of each round, ALL
  enemy movements + attacks are SHOWN in advance — you see exactly where + how every Vek will strike, how
  much damage, and their health. Combat becomes a SOLVABLE PUZZLE you study + complete, not a gamble. The
  design goal, stated plainly: "we wanted a game where every death felt like YOUR OWN FAULT" — so they
  removed the fog + the dice (cf. Slay the Spire intent-telegraphing Q52; ItB is the PUREST perfect-
  information design — the fairness ceiling).
- NO RANDOM CHANCE IN YOUR ACTIONS (you hit what you aim at): like Advance Wars, there are NO hit-
  percentages — no missing a 95% shot; you SEE the exact damage before you commit. With telegraphed
  enemies AND deterministic player actions, "the game starts to feel like a puzzle." Every mistake is
  PREVENTABLE, so every failure is EARNED + instructive (cf. our combat-dial determinism/readability;
  fairness through transparency, not RNG).
- THE THEMED OBJECTIVE TWIST — PROTECT, DON'T KILL (the design masterstroke): the priority isn't
  eliminating enemies — it's PROTECTING CIVILIAN BUILDINGS (the power grid). Born as a rebuttal to films
  (Man of Steel, Pacific Rim) "where the whole city gets demolished but no one cares." This flips tactics:
  you often SURVIVE + mitigate rather than win, sometimes SACRIFICE a mech to save the city, sometimes let
  a building fall to kill a threat. A varied-goals objective creates far richer choices than "kill
  everything" (cf. This War of Mine's protect-not-conquer Q30, our survival/protect objectives; theme
  drives the mechanic).

===============================================================================
## 1. THE ARCHITECTURE (how transparent, fair, deep challenge works)
===============================================================================

### THE SMALL GRID = A DENSE 3D PUZZLE (minimalism breeds depth — key craft)
- Battles are TINY (8x8) + SHORT (~5 turns, a fixed turn-limit, not fight-to-the-death). But they're
  "less like 3D chess than a 3D puzzle where changing one part shifts others." Small + bounded = you can
  hold the WHOLE puzzle in your head + every piece interacts. Constraint CONCENTRATES the design (cf.
  Slay the Spire small-board Q52, our combat-dial focus + single-district scope; small = legible = deep).

### PUSH/POSITIONING OVER DAMAGE (the environment is the weapon)
- The best plays aren't damage — they're MANIPULATION: push a Vek off its attack line, shove it INTO
  another Vek's attack (friendly fire), into water/a chasm, or block a spawn. Weapons' SIDE EFFECTS
  (knockback) matter more than their damage. You turn the enemies' own attacks + the terrain against them —
  emergent, spatial solutions (cf. immersive-sim systemic solutions Q08/Q15, our systemic/positioning
  combat potential; the board is the weapon).

### THE REWIND + AI-PILOT FAILURE (softening without removing stakes)
- A once-per-battle REWIND lets you undo a turn (easing the sting of a misread). And death isn't a hard
  reset: a killed PILOT is replaced by a weaker AI pilot (who can't gain XP) — a consequence that HURTS
  but doesn't end the run. Failure has graduated costs, not just game-over (cf. our regression-gate/no-
  brick-wall, kind-failure Q59; consequence without cruelty).

### FORCED ADAPTATION (no single winning strategy)
- Dynamic weapons + varied objectives + fresh enemy layouts mean "a single tactic isn't viable in every
  situation" — you must ADAPT each fight. Upgrade paths are all viable but you CAN'T max everything, so
  builds diverge. Replayability from forced creativity, not grind (cf. Slay the Spire adapt Q52, our
  systemic depth).

### RADICAL LEGIBILITY + LESS-IS-MORE (clarity as a pillar)
- "Elementary pixel graphics clearly communicate the layout of any battle"; minimal text, no cutscenes
  (brief governor intros only), a somber Ben Prunty score. The minimalism REINFORCES the theme (scarcity,
  hopelessness) AND makes the puzzle perfectly READABLE. Immediately understandable, hard to master (cf.
  Celeste clarity Q59, Slay the Spire Q52, our SUN-MODE/legibility; less-is-more).

### THE ROGUELITE FRAME + TIME-LOOP FICTION (mechanics = story)
- It's a roguelite: fail + travel back in time to another threatened timeline, carrying a pilot forward
  (Edge of Tomorrow-style iterative failure). The time-loop FICTION justifies the roguelite structure —
  mechanics wed to narrative (cf. Hades death-as-progress Q47, our roguelite/fold justification).

===============================================================================
## 2. THE HONEST FLAWS (banked)
===============================================================================
- CONTAINED SCOPE -> LIMITED LONG-TERM VARIETY (the main critique): Eurogamer + others note the tight,
  curated scope can limit long-term variety for some — it's a perfect small box, not an endlessly
  expanding one (the 2022 Advanced Edition added squads/pilots to address staleness). LESSON: elegant
  minimalism trades breadth for depth; plan enough content variety (squads/objectives) so the perfect
  small box doesn't exhaust (our content-variety + FACTORY-generated texture).
- DELIBERATE PLANNING ISN'T FOR EVERYONE: the slow, deliberate per-turn analysis (staring for minutes for
  the "aha") suits some + frustrates others who want pace. LESSON: a purely cerebral pace self-selects an
  audience; offer a faster flow or lower-stakes option for those who want it (our difficulty packages/
  accessibility Q59).
- "PAINFUL SACRIFICES FROM RANDOM PLACEMENT" AT HIGH DIFFICULTY: some balk that higher difficulties force
  no-win sacrifices arising from random initial unit placement — the fairness can feel strained. LESSON:
  even a fair-information game can feel unfair if the STARTING conditions are punishing-random; keep the
  randomness in the SETUP fair + the SOLUTION always reachable (our odds-must-feel-fair, no-brick-wall).
- MOBILE TOUCH CONTROLS WERE INITIALLY CLUNKY: the 2022 mobile port drew early complaints about imprecise
  touch controls (later patched). LESSON (DIRECT for us): a precise grid/positioning game needs TOUCH
  controls designed for mobile from the start — precise input on a phone is HARD + must be first-class
  (our iPhone-first design, combat-dial touch-precision; a direct warning).
- MINIMAL NARRATIVE / LESS-IS-MORE CAN READ AS THIN: the story is deliberately sparse (you "read into
  minimal text"); some want more. LESSON: less-is-more suits a pure-tactics game, but WE want narrative
  depth (our Amalgamation spine) — pair ItB's mechanical elegance WITH our authored story (our edge).

===============================================================================
## 3. WHY IT WORKS (craft, itemized for stealing)
===============================================================================
W1. PERFECT INFORMATION / FULLY-TELEGRAPHED ATTACKS: all enemy moves shown in advance -> a solvable puzzle;
    "every death is your own fault" — the fairness ceiling (cf. Slay the Spire Q52; the purest form).
W2. NO RANDOM CHANCE IN YOUR ACTIONS: you hit what you aim at, see exact damage first -> every mistake is
    PREVENTABLE + instructive — fairness through transparency, not RNG (cf. our combat-dial determinism).
W3. THE THEMED OBJECTIVE TWIST (protect, don't kill): the goal is protecting the CITY, not eliminating
    enemies -> varied goals = richer choices (survive/mitigate/sacrifice) (cf. This War of Mine Q30, theme
    drives mechanic).
W4. SMALL GRID = DENSE 3D PUZZLE: tiny (8x8) + short (~5 turns) so you hold the WHOLE puzzle in your head +
    every piece interacts — constraint concentrates design (cf. Slay the Spire Q52, our combat/scope).
W5. PUSH/POSITIONING OVER DAMAGE (the board is the weapon): manipulate enemies (shove into each other/
    water/off-line) + terrain — emergent spatial solutions over raw damage (cf. immersive-sim Q08/Q15).
W6. REWIND + GRADUATED FAILURE: once-per-battle rewind + killed-pilot-becomes-weaker-AI — consequence that
    HURTS but doesn't end the run; softening without removing stakes (cf. our no-brick-wall, Celeste Q59).
W7. FORCED ADAPTATION (no single winning strategy): dynamic weapons + varied objectives + can't-max-
    everything -> adapt each fight; replayability from creativity not grind (cf. Slay the Spire Q52).
W8. RADICAL LEGIBILITY / LESS-IS-MORE: elementary-but-clear graphics + minimal text reinforce the theme
    AND make the puzzle perfectly readable — immediately understandable, hard to master (cf. Celeste Q59,
    our SUN-MODE).
W9. ROGUELITE + TIME-LOOP FICTION (mechanics = story): fail -> another timeline, carry a pilot forward —
    the fiction justifies the roguelite structure (cf. Hades Q47, our roguelite/fold justification).
W10. ELEGANT MINIMALISM (a near-solo pair): a 2-person core made a Metacritic-90 landmark by PERFECTING a
     small, clear idea — depth from focus, not scope (cf. our solo scale + single-file discipline).

===============================================================================
## 4. BOHEMIA PORTS (directions, not built) — the fair-telegraphed-challenge model for our Dead-Eye dial + combat
===============================================================================
Into the Breach is the MASTERCLASS in transparent, telegraphed, FAIR challenge + elegant minimalism —
directly useful for our Dead-Eye dial + combat readability + fairness, and it's ON MOBILE (a direct
platform precedent AND a touch-controls warning). Its themed protect-not-kill objective fits our survival/
Pacifist ethos.
- W1/W2 (perfect information + no-RNG actions — the fairness model for our combat): bank ItB as the
  fairness ceiling for our COMBAT (Dead-Eye dial) — TELEGRAPH threats clearly + make player actions
  READABLE/deterministic so every loss feels EARNED ("your own fault"), not cheated by hidden info or RNG.
  We already flagged telegraphing (Slay the Spire Q52); ItB is the purest model. Our dial's timing +
  patterns should be learnable + fair — the challenge is execution, not guessing (ties our combat dial +
  difficulty packages, the fairness/no-brick-wall principle; core combat-design mandate).
- W3 (the themed objective twist — protect, don't kill — fits our ethos): bank ItB's masterstroke for
  Bohemia combat/survival objectives — the goal isn't always "kill the enemies"; it's PROTECT (the
  district, survivors, the power/water infrastructure), SURVIVE, or MITIGATE. Varied goals create richer
  choices (sacrifice vs save) + fit our PACIFIST LAW + survival theme + This War of Mine (Q30) — combat
  where NOT killing + protecting is the point (ties our Pacifist Law, survival objectives, life-support
  buildings, This War of Mine Q30; a strong on-theme port).
- W4/W8 (small grid = dense puzzle + radical legibility — for mobile): bank ItB's minimalism-breeds-depth +
  legibility lessons for our MOBILE combat — a small, bounded, perfectly-READABLE encounter space (our
  combat dial + single-district) where the player can hold the whole situation in their head. Clarity is
  BOTH accessibility AND depth (ties Celeste Q59, Slay the Spire Q52, our SUN-MODE/mobile legibility +
  combat-dial focus; essential for iPhone).
- W5 (push/positioning over damage — the board is the weapon): consider SYSTEMIC/positioning combat where
  manipulating enemies + terrain (not just damage) is the skill — emergent spatial solutions, which also
  serves our PACIFIST paths (disable/reposition over kill) (ties immersive-sim Q08/Q15, Caves of Qud
  systemic Q56, our Pacifist Law + systemic combat).
- W6 (rewind + graduated failure): bank graduated failure — consequences that HURT but don't hard-end
  (a once-per-encounter mitigation; a loss that weakens but doesn't reset) — softening our hardcore combat
  without removing stakes (ties our regression-gate/no-brick-wall, Celeste kind-failure Q59, our fold).
- W7 (forced adaptation): our combat/systems should force ADAPTATION (no single tactic wins everything;
  can't-max-everything builds) — replayability from creativity, not grind (ties Slay the Spire Q52, our
  difficulty packages + systemic depth).
- W9/W10 (roguelite+fiction justification + elegant minimalism from a pair): ItB's time-loop-justifies-
  roguelite = our fold/Amalgamation-justifies-our-structure (mechanics wed to fiction, Hades Q47); and a
  2-person team perfecting a small clear idea to a 90-Metacritic landmark is direct encouragement for our
  solo/single-file discipline — depth from FOCUS (ties our roguelite/fold justification, solo scale).
- FLAWS (bank HARD): (a) MOBILE TOUCH CONTROLS must be first-class from the START — a precise positioning/
  timing game on a phone is HARD (ItB's mobile port was initially clunky) — DIRECT warning for our iPhone
  combat-dial touch-precision; (b) plan enough CONTENT VARIETY (squads/objectives-equivalent) so an
  elegant small box doesn't exhaust (our FACTORY-generated texture + variety); (c) keep randomness in the
  SETUP fair + the SOLUTION always reachable (no no-win-from-random-placement — our odds-must-feel-fair/
  no-brick-wall); (d) offer pace/accessibility options for those who don't want pure-cerebral (our
  difficulty packages Q59); and (e) pair ItB's mechanical elegance WITH our authored narrative (our edge
  over its deliberately-thin story).

## SOURCES
Wikipedia + Grokipedia (3 mechs on 8x8 grid vs the Vek, ALL enemy moves+attacks fully telegraphed at round
start incl. damage+health, no-RNG/protect-civilian-power-grid priority, killed-pilot->AI-pilot-no-XP,
fixed turn-limit ~5 turns survive-not-eliminate, Man-of-Steel/Pacific-Rim collateral-damage rebuttal,
Advance-Wars/Frozen-Synapse/chess/Edge-of-Tomorrow influences, roguelite time-loop, Chris Avellone writing/
Ben Prunty music, Metacritic 90 best-PC-2018, 2022 Netflix mobile + Advanced Edition + "Unfair" difficulty,
Eurogamer contained-scope-limits-variety, mobile touch-controls-clunky-then-patched); Game Developer/IGF
Ma interview ("every death felt like your own fault"->telegraphed attacks, care-about-collateral-damage/
varied-goals, no-single-tactic-viable/adapt, dynamic-weapons-side-effects push>damage, clear-why-you-
failed); Engadget (no-hit-percentages/hit-what-you-aim-at, every-mistake-preventable/humbling, once-per-
battle rewind, 8x8 "3D puzzle changing one part shifts others," ~5-turn-limit survive-not-win, less-is-
more minimal-text/no-cutscenes, the wonky-code origin of telegraphing, 2-person team); Game Informer
(telegraph-everything devilish-dilemmas, push-boss-into-water-last-turn, "aha" puzzle staring, façade-of-
simplicity, painful-sacrifices-from-random-placement critique, thoughtful-difficulty-curve understandable-
to-master); Atomic Bob-Omb (tactics-not-puzzle-no-always-perfect-solution, reading-intents mitigate-damage/
planned-vs-unexpected-loss, great-for-those-bad-at-XCOM/Fire-Emblem, every-decision-has-weight). Cross-ref
Questbook 52 (Slay the Spire — intent-telegraphing/small-board/adapt/easy-learn-deep), 59 (Celeste — kind-
failure/legibility/accessibility), 30 (This War of Mine — protect-not-conquer/survival-objective), 08/15/56
(immersive-sim/Qud — systemic/positioning solutions), 47 (Hades — roguelite-fiction-justification), our
COMBAT (Dead-Eye dial) + difficulty packages + Pacifist Law + survival/protect objectives + life-support
buildings + regression-gate/no-brick-wall + odds-must-feel-fair + SUN-MODE/mobile legibility + single-
district + FACTORY-generated variety + roguelite/fold + Amalgamation spine + solo/single-file scale.
FUTURE: the Subset Games / Matthew Davis GDC design talk on telegraphing + perfect-information tactics
(the definitive fair-challenge blueprint for our dial); an Advance Wars / Fire Emblem cross-study (grid-
tactics readability lineage); a Frozen Synapse deep-dive (simultaneous-turn prediction sibling).
