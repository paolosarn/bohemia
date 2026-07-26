# BOHEMIA ADDENDUM: ENEMY ARCHETYPE + KNOCKDOWN/STUN RESEARCH (7/19/26)

Research pass 2, ordered by Paolo the same day ("good research, provide some
more") after his first lab verdict. Serves his two rulings directly: melee
enemies move differently BY WEAPON, and the shove (guaranteed stun + chance
to topple + perk). Web-verified July 2026, sources inline. Every adoption
[PENDING Paolo].

## 1. HOW THE GREATS BUILD ENEMY MOVEMENT IDENTITY (for the weapon ruling)

NECRODANCER'S TAXONOMY (the gold standard for beat-grid readability): every
monster is one of THREE movement classes, and that classification is the
whole design:
- FIXED LOOPS that ignore you (slimes bouncing/square-tracing, zombies
  walking lines): the "furniture" you route around — pure metronomes.
- SEEKERS with a rule (skeletons chase every 2 beats, minotaur every beat
  and through walls): the pressure bodies.
- RANDOM movers (bats): the deliberate anti-read — you beat them by
  controlling the cells around them, not by predicting.
Identity = clock rate x targeting rule x a ONE-BEAT SPRITE TELEGRAPH
(skeletons raise their arms the beat before moving — no UI, the body IS the
telegraph). Damage numbers are nearly irrelevant to identity. Palette swaps
= same rule at a faster clock (blue bat 2 beats -> red bat 1) — variant
families multiply content without new reads. (necrodancer.miraheze.org
Monsters/Skeleton; Wikrypt Steam guide; sullla.com/cotnd.)
Specialists worth stealing the SHAPE of (mechanics only, contents Paolo's):
armadillo/minotaur = charger with a stunned-on-wall-impact punish window;
monkey = zero-damage GRABBER (control enemy); harpy = 3-tile leaper that
punishes open lines; blademaster = parry enemy whose attack triggers when
YOU hit it; warlock = kill-placement puzzle (on-death effect).

HOPLITE'S KIT (range + cooldown + firing constraints): footman adjacent;
archer range 2-5 but CANNOT shoot adjacent (the dead zone is the
counterplay — stand next to the gun); wizard beam that never fires twice
in a row (a rhythm you dance with); demolitionist lobs bombs on a 2-turn
cooldown and won't throw near its own (exploitable friendly-fire AI).
Demons never move AND attack the same turn. Four enemies = four different
"safe cell" maps; the game is computing their union. (github ychalier/
hoplite RULES.md.)

INTO THE BREACH: differentiation lives in the SHAPE of the declared attack
(line projectile / adjacent web-root / charge-with-push / arcing artillery
/ burrower whose attack CANCELS if you chip it / blobber whose summons are
telegraphed bombs). Davis's manipulation rule: "You need to always be able
to manipulate them... if the enemy is in a position where you can't move
it, it's not fun" — unpushable "Stable" is a rare, visibly flagged elite
status. (intothebreach fandom; gamedeveloper.com Road to the IGF.)

SHOGUN SHOWDOWN'S LANE KIT: every enemy visibly QUEUES its attack exactly
like the player; swordsman retreats after striking (exploitable as a
moving wall); SPEARMAN hits TWO cells (breaks stand-2-away safety — our
spear is this); shieldbearer is a no-attack support puzzle; "Heavy" elites
are immune to push/swap. (shogunshowdown.wiki.gg.)

MELEE REACH AS IDENTITY: Battle Brothers polearms hit at 2 from the second
rank; Tangledeep spears hit range 2 at 66% damage (reach is a discount,
not free); Stoneshard spear reach is an active skill, not the basic
attack. Grid Sage doctrine: identity via windup length / telegraph degree
/ movement response, never damage numbers; "anything that changes the
status quo should be telegraphed." (battlebrothers fandom; tangledeep
fandom; gridsagegames.com.)

-> LAB v2 BUILT: shiv (every beat) / bat (every 2nd, knockback hit) /
spear (keeps 2 distance, telegraphed 2-tile lance). The taxonomy above is
the menu for the next archetypes: charger, grabber, leaper, parry-man,
on-death caster, no-attack support. [PENDING Paolo: which join the roster;
names/flavor his.]

## 2. KNOCKDOWN / STUN — WHAT KEEPS PAOLO'S GUARANTEED STUN FUN

THE DEGENERATE CASE, documented: Divinity OS2 made CC 100% reliable once
armor stripped -> fights collapse into infinite knockdown chains; the
community verdict is that guaranteed + re-applicable every turn + full
turn denial is the degenerate TRIPLE. Any two are fine. (steamcommunity
DOS2 threads; pcgamer.)
-> Bohemia already breaks the triple: the NO-STUN-LOCK law (one full turn
back before re-stun). The lab applies it to shoves (a braced enemy gets
pushed, not re-frozen). The research says this is exactly right.

KNOCKDOWN IS A DIFFERENT VERB FROM STUN: BG3 Prone does not skip the turn
— standing up costs MOVEMENT and melee gets advantage while they are
down (a vulnerability window, softer and more interactive than turn-skip).
Divinity Knocked Down: the get-up IS the cost. XCOM runs a graduated
ladder (disoriented -> stun 1 action -> stun all -> dazed -> unconscious)
instead of one binary. Gloomhaven's family of precise verbs each denies
exactly ONE resource (stun/disarm/immobilize/muddle). (bg3.wiki Prone;
xcom fandom; gloomhaven rules.)
-> Lab: shove-stun (turn denial, 1) and TOPPLE/prone (helpless = easier
dial) are already two distinct verbs. Matches the graduated-ladder
doctrine.

CHANCE WITHOUT DICE BETRAYAL: players never accept a failed 90% roll
(XCOM literally fudges displayed odds upward because of it) but INSTANTLY
accept "this thing is too heavy to knock down." The genre's escape
routes: no rolls at all (ITB); visible immunity classes (ITB Stable,
Shogun Heavy, Battle Brothers orcs who cannot be stunned — and mace
MASTERY that upgrades a 65% stun to 100%: chance early, guaranteed after
perk commitment); or keep the roll but SHOW odds + trajectory before
commit (BG3 shove, with deterministic weight classes underneath).
(gamedeveloper.com Solomon on randomness; battlebrothers fandom; bg3.wiki
Shove.)
-> ANSWERS PAOLO'S GARBLED LINE ("or a different enemy character"): the
industry answer to guaranteed stuns is ENEMY CLASSES VISIBLY IMMUNE OR
RESISTANT (an armored goon who only staggers, a heavy who cannot fall),
never a dice roll on the stun itself. Fits his armor/AI-bot canon from
6/27 perfectly. [PENDING Paolo: which enemy classes resist.]
-> BUILT: the shove choice now previews odds + destination BEFORE commit
(BG3 lesson): "SHOVE (stun 1 · 65% topple · wall)".

## 3. CONTEXTUAL ACTION UI (one-thumb, for his loved shove flow)

Hoplite is the canonical mobile answer: no attack buttons at all — the
move IS the attack, disambiguated by geometry; Bash is the one explicit
contextual verb with cooldown pips on the button. Auro: face + step =
bump, zero menus. Shogun Showdown: ~5 fixed verbs, visible queue.
Thumb-zone research: primary actions live in the bottom 40-50% of a
portrait screen, 48px+ targets, action sheets slide from the bottom.
The shared pattern: ONE context-morphing button beats a menu; preview-
before-commit ON THE GRID; cooldowns as pips not text. (toucharcade
Hoplite review; parachutedesign thumb-zone.)
-> Lab v2: SHOVE button lights on adjacency and just works when the
target is unambiguous; tapping an adjacent enemy opens SHOVE-or-DIAL.

## 4. INFORMATION-GRANTING PERKS (for the foresight ruling)

Slay the Spire PRICES intent visibility: Runic Dome pays +1 energy per
turn to REMOVE it — intent info is worth about one energy per turn as a
tradable currency. Into the Breach's purest info-perk is the extra turn
RESET (undo = a free peek at consequences). Darkest Dungeon scouting
converts info directly into initiative and is the strongest anti-RNG
investment in the game. Wildfrost's complaint thread proves timing-info
without target-info still frustrates (their counters show WHEN, not
WHAT). Forestrike (2025) sells rehearsal-as-power (simulate the fight
before playing it). The doctrine: an info perk must change decisions THE
SAME TURN, and should reveal the next layer up from what is free — if
attack telegraphs are free (ours are), the perk sells MOVEMENT intent;
above that, order; above that, rehearsal. Full foreknowledge is
puzzle-mode, which is why foresight always feels premium. (slay-the-spire
fandom Runic Dome; intothebreach fandom Pilots; darkestdungeon fandom
Scouting; wildfrostwiki.)
-> Confirms Paolo's instinct exactly: attack telegraphs always-on
(fairness), movement foresight behind the FORESIGHT perk (power). The
ladder above it (see attack ORDER; see one turn further; rehearse the
fight) is the future perk tree for this axis. [PENDING Paolo.]

## GATE

Folded into gates/combat_lab_gate.js (44 checks) same turn: weapon spawn
+ sig split, spear-telegraphs-before-damage, shove rulings incl. braced
resist + deterministic topple roll + prone-eases-the-dial, perk UI, and
the always-on-attack-telegraph invariant rides the intent system.
