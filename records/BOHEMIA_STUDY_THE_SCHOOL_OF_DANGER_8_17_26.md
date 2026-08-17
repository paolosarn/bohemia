# THE SCHOOL OF DANGER STUDY (8/17/26) — how Rogue Fable teaches itself

Paolo dropped the full custom-course layer of Rogue Fable III's school system
(12 courses, 81 lessons, .js lesson scripts + Tiled .json maps) into the ART
session: "heres this ... are you seeing the tutorial and the danger school
anywhere?" This file is the study, done to the questbook standard: the corpus
is indexed, the architecture is torn down, and the craft laws are extracted as
citable findings. Corpus lives at reference/rogue_fable_school/ (reference
ONLY: third-party code and third-party maps; no pixel and no line of it ships
into Bohemia - what ships is what it TEACHES).

## THE DIRECT ANSWER TO HIS QUESTION
- THE TUTORIAL: YES - Tutorial.js + Tutorial.json are here (10 lessons, by
  Justin Wang, the game's own developer: move/attack, auto-attack, sprint,
  abilities, resting - the controls layer).
- "THE DANGER SCHOOL": NO FILE by that name is in the upload. What he sent is
  the CUSTOM COURSE layer - mods that load INTO the base game's school. The
  built-in School of Danger lives in the game's own source, not in these
  files. If the built-in school's lessons are wanted for the study, that is a
  separate upload (or the study stands on the 81 custom lessons, which
  include the developer's own Tutorial and AdvancedTactics - the built-in
  school's content by the same author, shipped as custom courses).

## THE CORPUS (12 courses, 81 lessons)
| course | author | lessons | teaches |
|---|---|---|---|
| Tutorial | Justin Wang | 10 | controls: move, attack, auto-attack, sprint, abilities |
| AdvancedTactics | Justin Wang | 10 | kiting, cooldown kiting, LOS, choke points, diagonal kiting, trap kiting, pit knockback, agro range, split pulling, target priority |
| AsymmetricAssault | Random595 | 7 | hitting without being hit: AOE edges, arcing shots, through-wall targeting, knockback spacing, charge cycles |
| Echoes_In_The_Dark | Random595 | 7 | agro/stealth: shout radius, awareness states, vanishing, alarm chance |
| ShadowsAndSightlines | Random595 | 5 | fog of war, smoke, sightline denial |
| Laws_Of_The_Labyrinth | Random595 | 10 | hidden dungeon rules: RNG damage, speed rhythm, terrain classes, knockback physics |
| TacticalRedirection | Random595 | 8 | turning enemy abilities against them: charm, fury, funneling |
| MasteringSleepBomb | Random595 | 8 | one talent studied to the bone (8 lessons on ONE ability) |
| WitsAndWarfare | Random595 | 7 | reach edges, turning points, source-severing |
| ImpossibleDifficultyPuzzles | Random595 | 1 | a single authored puzzle: "every puzzle has a solution" |
| TestLevels | Justin Wang | 7 | the dev's own test harness (bosses, new content) |
| ExampleCourse | Justin Wang | 1 | the modding template itself |

## THE ARCHITECTURE (what a lesson IS, mechanically)
One lesson = one tiny authored arena (a Tiled map region) + a script object:
- `text` - two or three lines, each ONE fact, shown before play.
- `hintText` - the solution in plain words, held back until asked for.
- `playerClass` - the lesson picks your kit; you never bring your own.
- `onStartGame` - authored setup: grant exact equipment/talents, set exact
  enemy HP (`setEnemyHp(1, 15)`), strip abilities off enemies
  (`removeEnemyAbility`), aggro everything.
- `updateStats` - THE CLAMP, the whole genius: `maxHp = 1; maxSp = 1;
  maxMp = 0`. One hit kills you, so the lesson's mechanic is not a nice-to-
  know, it is the ONLY way through. The clamp IS the teacher.
- `isComplete` - a predicate on live game state ("everything else is dead"),
  never a scripted cutscene.
- `hasFailed` - optional, and sharper than death: SplitPulling FAILS the
  moment two enemies are aggroed at once - the lesson fails you for doing
  the thing it exists to unteach, even if you would have survived it.

## THE CRAFT LAWS EXTRACTED (citable, S1..S8)
- S1 THE CLAMP IS THE TEACHER: don't explain the mechanic, make it the only
  survival path. 1 HP with one speed point teaches kiting better than any
  text. (Every course, uniformly.)
- S2 ONE MECHANIC PER ROOM: a lesson isolates ONE verb. Eight lessons on one
  talent (MasteringSleepBomb) beats one lesson on eight talents.
- S3 EXACT NUMBERS, NOT VIBES: enemy HP is set to the precise value that
  makes the intended solution count-perfect (HP 15 = exactly the fireball
  arithmetic the lesson wants you to discover).
- S4 THE HINT IS SEPARATE FROM THE TEXT: the text states facts; the hint
  states the solution; you only read the second if you ask. Dignity is part
  of the pedagogy. ("Aim at the enemies :P" - even the joke hint is a hint.)
- S5 FAILURE PREDICATES TEACH MORE THAN DEATH: failing SplitPulling for
  aggroing two enemies teaches the radius rule forever.
- S6 THE SUBTRACTIVE SETUP: lessons REMOVE enemy abilities to isolate the
  variable, the same way our board forms strike scope. Teaching is mostly
  deletion.
- S7 PLAYERS TEACH THE DEEP GAME: 9 of 12 courses are by a player
  (Random595), possible because the course format is a TEMPLATE
  (ExampleCourse.js: "Copy this file"). The dev built the school; the
  community built the curriculum. MECHANISM-MINE / CONTENTS-COMMUNITY.
- S8 FLAVOUR RIDES ON TOP: every Random595 lesson has a one-line fiction
  ("A storm can reach beyond the horizon") - the mechanic named poetically,
  never explained poetically.

## WHAT THIS MAPS TO IN BOHEMIA (the honest translation, not a feature list)
Bohemia's combat has verbs nobody is taught: the 120 BPM beat (I-MOVE-YOU-
MOVE), cover and cross-level cover, the two-storey deck fights, doors that
swing on beats, light-as-territory stealth (nobody patrols the dark), the
action clock with condition as divisor, knockback, the phone. A SCHOOL in
this shape - tiny authored rooms, stat clamps, one verb each, exact numbers,
hints held back, failure predicates - is how "the most realistic economic
crash simulator, but fun" teaches its depth without a single tutorial popup
in the real game. The 8/15 demo-critical law ("the fight has to move you")
lands here too: a school room is where movement-forcing is taught.
OWNERSHIP: the school is a COMBAT-lane surface (their renderer, their fight
field, their demo gate). This study is the reference brief for whoever
builds it; the map format (one Tiled json per course, ~100x100, lesson
regions) is exactly the shape our slices already speak.

## WHAT DOES NOT SHIP
The corpus itself: third-party code (c) their authors, third-party maps,
and the two sprite sheets he pasted in chat (another game's pixels). They
are reference under reference/, cited by this study, and no pixel or line
crosses into engine/, slices/, tools/, or banks/. REUSE-FIRST governs what
we learn, not what we copy.
