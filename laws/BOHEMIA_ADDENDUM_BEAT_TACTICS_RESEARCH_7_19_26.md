# BOHEMIA ADDENDUM: BEAT TACTICS RESEARCH (COMBAT session, 7/19/26)

Paolo's mandate opening the COMBAT session: make combat "the most interesting
and fun that it could be," starting with "a real research pass on the best
beat/tactics combat ever made," options brought as interactives, not
decisions. This file is the research pass. It EXTENDS the 7/3 turn-based
research (BOHEMIA_ADDENDUM_TURNBASED_COMBAT_RESEARCH_7_3_26.md) with a fresh
web sweep (verified July 2026, sources inline). Every adoption below is
[PENDING Paolo]. The playable half of this file is the BEAT TACTICS LAB in
the alpha's COMBAT tab (DIAL / LAB switcher).

## THE HEADLINE FINDINGS

1. THE FORGIVENESS DISCOVERY (NecroDancer, Ryan Clark's own postmortem).
   Dev builds required ~100ms beat accuracy; players were LEAST accurate
   exactly when MOST stressed, so strict timing punished panic, not skill.
   Clark kept widening the window and found it felt best at 100% leeway:
   the whole beat is valid. "A rhythm game that goes to great lengths to
   require as little rhythm as possible." Missing a beat only resets the
   Groove Chain multiplier (1x -> 2x at 1 kill -> 3x at 5). Instadeath-on-
   miss exists ONLY as prestige opt-in characters (Aria/Coda).
   (gamedeveloper.com Game Design Deep Dive: NecroDancer; necrodancer
   miraheze wiki Groove_Chain.)
   -> WE ALREADY LIVE THIS as the SILENT-PLAY LAW + greed-as-multiplier.
   The research says our instincts are the shipped consensus. The groove
   window (lab uses +-120ms) is a Paolo tuning knob, never a wall.

2. QUANTIZE THE RESULT, NEVER GATE THE INPUT (Hi-Fi Rush). Pressing attack
   ALWAYS works; the HIT snaps to land on the next beat. On-beat presses
   earn bonuses; off-beat is never a whiff. The beat lives in the WORLD:
   everything (walk cycles, props, UI, rumble) pulses on the beat, so the
   player entrains without reading HUD. Authored at 120 BPM. The games
   that hard-gated actions behind timing (BPM: Bullets Per Minute,
   Keylocker) were hammered for exactly that; the games that made rhythm
   a reward multiplier are loved: Metal Hellsinger's Fury 1x->16x layers
   the MUSIC itself (at 16x the vocals kick in) so players chase the
   multiplier to HEAR the song. (gameanim.com Hi-Fi Rush music-synced
   animation; gamedeveloper.com Hellsinger FPS harmonies; pcgamer BPM
   review.)
   -> Bohemia's version of "chase the multiplier to hear the song" is the
   7/17 pitched YOUR-STREAK-BUILDS-THE-SONG (still awaiting greenlight).
   The lab quantizes action RESOLUTION to the next beat tick while input
   is never gated: I-MOVE-YOU-MOVE, played on the 120 grid.

3. THE TELEGRAPH CONSENSUS: DECLARE-THEN-ANSWER. Every great in the class
   commits enemy intent BEFORE the player moves. Into the Breach shows
   exact tiles, damage AND resolution order; the failstate is the power
   grid, not units, so the turn is a prevention puzzle ("a puzzle game
   wrapped up in a strategy game" -- Matthew Davis's own words). Shogun
   Showdown makes BOTH sides telegraph (queued attacks). Slice & Dice
   rolls enemy dice face-up before you answer. The strategic boundary is
   exact: perfect information about NOW, none about NEXT turn (Tom
   Francis states this explicitly for Tactical Breach Wizards).
   (gdcvault Into the Breach Design Postmortem; pcgamer Davis interview;
   shogunshowdown.wiki.gg; pentadact.com TBW pitch.)
   -> Extends the 7/3 finding ("the turn is a promise") with the order
   rule and the both-sides-telegraph variant.

4. MOVEMENT-AS-ATTACK (Hoplite, verified grammar): passing between two
   tiles both adjacent to a demon = STAB; stepping directly toward an
   adjacent demon = LUNGE; bash = knockback into walls/lava/bombs; the
   thrown spear is LOST until you walk back over it. One action per
   turn makes offense, defense and positioning the same decision. Auro's
   entire kill verb is bumping enemies into water. (github ychalier/
   hoplite RULES.md; magmafortress.com.)

5. DISPLACEMENT BEATS DAMAGE NUMBERS. ITB: push into mountains (bonus),
   water (instakill), other Vek (both hurt), onto spawn holes (denial).
   Fights in Tight Spaces prices it: wall = 4 damage, enemy-into-enemy
   hurts both; momentum is a combo meter on grid tactics. Tactical
   Breach Wizards makes shove-out-window the signature verb, with free
   undo moving all challenge into plan quality. Spatial outcomes are
   readable pre-commit; dice are not. (grokipedia Fights in Tight
   Spaces; wikipedia ITB; gamedeveloper TBW.)

6. THE ENEMY CEILING IS COGNITIVE. Nothing shipped in the class exceeds
   ~6-8 simultaneous live threats; the best stay lower (ITB 3-6, Hoplite
   3-6, broughlikes single digits on 16-36 cells). The cap is what a
   player can audit in one look -- the moment they can't hold every
   declared action in their head, perfect information stops FEELING
   perfect. Confirms our locked 8-cap and the 6/27 readability finding.

7. SMALL GRIDS ARE A DOCTRINE, NOT A COMPROMISE (Michael Brough): "You
   should never need a larger possibility space than Go." 868-HACK is
   6x6; Imbroglio 4x4 makes the BOARD the deck. Tiny boards kill dead
   corridor-walking turns; every step is contested. Grid size is chosen
   per-mechanic (Cinco Paus needed 5x5 for rays to read). Supports our
   locked "street combat stays tight on purpose."

8. THE QUEUE IS THE STANDOUT POST-2023 INVENTION (Shogun Showdown):
   spend a turn LOADING an attack tile into a queue (max 3), UNLEASH
   later; queuing telegraphs YOU to the enemies, so wind-up is risk.
   It is greed, spatialized. Parked as a future option -- it would sit
   beautifully on the 120 grid (load on beats, unleash on the downbeat)
   but it is a fifth grammar and the lab tests four.

9. FAILURE MODES BANKED: Soundfall (rhythm as flat damage bonus, nothing
   else changes -- tempo alone is not variety; GRAMMAR must vary);
   Keylocker (gate-everything timing with poor feedback); Ratatan 2025
   (rhythm commands + 100-body melee = legibility collapse, EA delayed
   after demo backlash); Rift of the NecroDancer late-game (enemy-as-
   notation density collapses back into memorization stress). High
   difficulty must escalate by new PERIODS and rule-remixing, never by
   tempo/strictness alone -- which is exactly our locked "difficulty
   scales by shape + window + subdivision, never tempo."

## THE FOUR OPTIONS BUILT PLAYABLE (the lab, COMBAT tab -> BEAT TACTICS LAB)

All four run the locked spine unchanged: one action per turn, I-MOVE-YOU-
MOVE, occupancy law, every kill through the stamped canon dial engine,
canon tiers (vital 60 + 2-beat stun, no stun-lock, two vitals kill, kill
chains, vital chains to a different target), wound = the price of a slip.

- A THE CONDUCTOR (NecroDancer lesson): enemies are beat signatures --
  sig-1 acts every player turn, sig-2 every other, sig-3 syncopates.
  Adjacent enemies wind up one beat before striking (the telegraph IS
  the off-beat). Tests: do enemy rhythms make the 120 grid FELT?
- B THE PROMISE (Into the Breach lesson): enemies alternate AIM (commit
  attack tiles, drawn red) and LAND (damage hits those exact tiles, no
  dice). Prevention: step off, stun to cancel, kill to remove. Tests:
  is declare-then-answer the right pressure for Bohemia?
- C THE DANCE (Hoplite lesson): sidestepping past a guard (move between
  two cells both adjacent to him) OPENS him for 2 turns; backing
  straight out of an un-opened guard's reach costs a swipe. Tests:
  movement-as-attack, translated to a gunfight (footwork does not kill
  -- it manufactures easy dials).
- D THE SHOVE (Tight Spaces / ITB / TBW lesson): shove adjacent bodies.
  Into a wall = stagger + opened; into another body = both stagger
  (occupancy-honest: the shoved body STOPS, nothing stacks); into a
  burn barrel = cooked (stagger + opened). Tests: displacement as the
  off-dial verb.

## THE CURRENCY THESIS (the finding underneath all four) [PENDING Paolo]

In Bohemia the tactical currency is not damage. It is WHICH DIAL YOU EARN.
Locked canon already prices distance this way (point blank pulls an EASY
dial even on BOHEMIAN). The lab extends the same axis: an opened /
staggered / stunned target eases the effective package one step; being
surrounded (3+ live lines on you) hardens it one step. Clamped 0..4.
Damage numbers never move -- only odds. Position is the bet, the dial is
the payout. No other game can run this economy because no other game has
the dial. If Paolo thumbs this UP, it becomes the design spine that unifies
cover, range, footwork, shove and any future ability: everything tactical
is a bid on the next dial's difficulty.

## WHAT THE LAB DELIBERATELY LEAVES OUT (not re-judged, lives in canon)

Greed, ammo scarcity, cover pop-timing, faction music, wagers, the 3x3
self-cover ring. The lab isolates ONE question: which turn-shell grammar
is the most fun to stand in. Everything above composes with the canon
cover/pop ranged model later; the modes are grammars, not replacements.

## MACHINE GATE (Factory Law, same turn)

gates/combat_lab_gate.js (33 checks, wired into bohemia_gates.py as
COMBAT LAB): engine stamp byte-identical to the alpha's canon dial engine;
NO DAMAGE BEFORE THE DIAL static + simulated; occupancy across 4x300-step
seeded sims; whole-beat advancement; world frozen while the dial is open;
canon tier/stun/chain rules; package currency clamps + distance pull;
verdict workflow (SUN MODE, thumbs, comments, .txt export); alpha wiring.
Generator: tools/bohemia_combat_lab_gen.py (re-stamps the engine from the
alpha's COMBAT_B64 every run -- the stamp can never drift).

## SOURCES (key)

gamedeveloper.com "Finding the beat in Crypt of the NecroDancer";
necrodancer.miraheze.org (Groove_Chain, Bosses, Sub-beat); wikipedia +
metacritic Rift of the NecroDancer; gameanim.com "Hi-Fi Rush music-synced
animation"; access-ability.uk Hi-Fi Rush feedback; gamedeveloper.com
"Shredding for Satan" (Hellsinger); pcgamer.com BPM review; thesixthaxis
Robobeat review; gdcvault.com 1025772 "Into the Breach Design Postmortem";
pcgamer.com Davis/Ma interview; intothebreach fandom tips;
magmafortress.com/p/hoplite + github ychalier/hoplite RULES.md;
gamedeveloper.com Imbroglio + 868-HACK design pieces;
mightyvision.blogspot.com Cinco Paus dev notes; aftermath.site 868-BACK
review; wikipedia + thexboxhub Fights in Tight Spaces; pcgamer Knights in
Tight Spaces review; pentadact.com TBW pitch + gamedeveloper TBW;
shogunshowdown.wiki.gg (Tiles, Enemies) + pcgamer review; thinkygames
Slice & Dice; toucharcade Auro review; keithburgun.net; wikipedia Desktop
Dungeons; gamingonlinux + metacritic StarVaders; pcgamer Ratatan EA delay;
rpgamer Keylocker + Everhood reviews; gamespot Soundfall review;
goombastomp Cadence of Hyrule Fixed Beat Mode.
