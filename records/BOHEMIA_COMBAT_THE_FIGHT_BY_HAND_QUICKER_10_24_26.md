# COMBAT 10/24: THE FIGHT BY HAND, QUICKER; OUR GRAVEYARD; THE HAUNTING AS ACT ONE SEES IT

Rows: [the ten changes: the fight's part] (rule 133, Paolo 10/23: "the whole point of this project was to be like Battle
Brothers but quicker and funner for normies... like someone who plays Stardew Valley would play it"; TUNING's page
records/BOHEMIA_TUNING_QUICKER_AND_FUNNER_FOR_NORMIES_THE_TEN_CHANGES_10_23_26.md, changes 1, 8, 10) and [ghosts and
apparitions] (rule 134(a) and (e), Paolo 10/23: "like in Battle Brothers, one of the enemies are ghosts and apparitions; I
think we can put that in, it fits our world too good"). Opened by the coordinator (rule 112), no check-in, no card (rule 127).

## 1. THE FIGHT TIMED BY HAND (the number TUNING's page could not take)

Tool: tools/bohemia_combat_the_fight_by_hand_timed.js. The real fight page on his phone's profile (390 x 844 at 3x, touch)
through the fleet's one driver, played by real taps the way a newcomer plays (the best odds in reach, else the walk that puts
a man of theirs in reach with the AP for the blow, else as close as the AP allows, else END TURN). A frame sampler in the page
books every frame to what the screen was doing. THE FINGER IS A RULER: the Keystroke-Level Model (Card, Moran and Newell,
CACM 23(7), 1980): a decision M + P + K = 2.65 s, the second tap on the same spot K = 0.2 s. THE CREW THAT IS LEFT (the door's
default origin, three men), day one, three seeds a fight (11, 12, 13), the suburb. Files: records/target/combat_by_hand/*.json.

| how he plays | the road, 3 v 3 (won fights) | the first job, 3 v 2 (won) | a tough one, 3 v 5 (all lost) | their turns (road) |
|---|---|---|---|---|
| BEFORE, by hand, watching their turns | 87.8 s (2 of 3 won) | 74.1 s (2 of 3) | 166.3 s | 14.6 s |
| BEFORE, by hand, tapping to skip them | 78.2 s | 69.4 s | 128.7 s | 0.7 s |
| BEFORE, AUTO | 25.4 s (3 of 3) | 23.4 s (3 of 3) | 48.1 s (1 of 3) | 6.9 s |
| AFTER, by hand, watching | 82.3 s | 70.8 s | 148.9 s | 7.2 s |
| AFTER, by hand, speed pane at 2x | 69.8 s | 63.8 s | 126.0 s | 3.8 s |
| AFTER, taking the glowing AUTO | 22.5 s (3 of 3) | 15.2 s (3 of 3) | 145.3 s (never glows) | 3.3 s |
| AFTER, 2x and taking the glow | 14.6 s | 10.9 s | 124.4 s | 1.7 s |
| AFTER, AUTO | 22.3 s | 20.4 s | 35.1 s (1 of 3) | 3.7 s |

THE FINDING: by hand the finger is two thirds of every fight (27 decisions in a routine fight, 72 s of the 88); the machine's
own time was 20 to 36 s, their turns 15 s of it. A routine fight by hand was already inside TUNING's 2 minutes; a tough one
(2.4 to 3.5 minutes) inside rule 40's 15. What makes a routine fight quick for a newcomer is not a faster board, it is not having
to make 27 decisions: AUTO lit at the moment the fight is his (change 10(a)) takes 88 s to 23 s, and wins 3 of 3 where the
newcomer's own hand won 2 of 3.

## 2. CHANGE 1: THE FALLBACK SIZED BY THE COMPANY

A company handed with no party and no band met ours.first_band, nine brigands. RUN's door (10/23) already turns any roster
into a party of its length and caps day one at the company plus one; this is the fight's half, the net under every hand-over.
bandFor(n) (slices/BOHEMIA_FIGHT.html) deals the company's own size on ours.fallback_band_by_company, a resample of first_band's
own kinds. TUNING's 10/19 points (1 1, 3 3, 6 7, 12 13) were the 70-in-100 line on the fight of 10/19; MEASURED ON TODAY'S FIGHT
(AUTO, 80 seeds a cell, seeds 5000-5079):

| company | band and win |
|---|---|
| 1 (wolf) | 1: 75%, 2: 36% |
| 2 (truck) | 1: 98%, 2: 70%, 3: 25% |
| 3 (newcrew) | 2: 94%, 3: 84%, 4: 55% |
| 4 (raid) | 3: 96%, 4: 83%, 5: 56% |
| 6 (debt) | 5: 85%, 6: 80%, 7: 55% |
| 12 (watch) | 11: 68%, 12: 57%, 13: 54% |

So the row's line is 1 1, 6 6, 12 11 (TUNING's kept beside it as tuning_line_10_23). Before against after on the fallback, 60
seeds: 3 men 0 -> 52 won, 2 men 0 -> 40, 4 men 0 -> 49, 1 man 0 -> 46, 6 men 7 -> 33; the twelve of the watch 53 -> 26 against
13 on TUNING's line, which is why the line is today's. Nothing handed at all (the bench's twelve) still meets first_band, so the
fleet's 150-odd fight checks measure the same fight.

## 3. CHANGE 10: THE FIGHT BY HAND, QUICKER (all five parts and the speed)

(a) THE FIGHT READS ITS ODDS. A second copy of the same rules (new Function over the page's own fight-rules script) is fed the
board as it stands (FIGHT.freeze / thaw) and plays the rest out on AUTO, 6 ms of a frame at a time on his turn (a rollout is 9
to 24 ms in the page for a 3 v 3): 24 rollouts, read from 12. The real die (SEED) is put back after every slice: every seeded
fight ends exactly as it did before the odds existed (the hand timer's seed 11 fights won in the same rounds and turns, and
the gate proves the die untouched). At 80 in 100 or better AUTO lights on the beat (its own layer over UI's tin, the tin
untouched) with WIN N% printed under the word; one tap finishes the fight: AUTO at the top pace (FINISH_PACE 3) to the recap.
Nothing is rolled twice: AUTO plays his men as they are, an injury on AUTO is still an injury.
(b) THEIR TURNS AT DOUBLE PACE: beatMs() carries the turn's pace (THEIRS_PACE 2 when the man acting is theirs), so every walk,
blow and breath of theirs plays on the half beat (still the 120 grid). A tap on the board while his man walks puts him at the
walk's end inside a quarter beat (their turns already skipped whole on a tap).
(c) TAKE BACK THE LAST STEP, once a turn, never a blow: the walk keeps the state before it (freeze); while no die has rolled
since (the die's place and the log's length unchanged: a free swing or a morale check ends it), BACK (a pocket of the skill row,
UI's kit) puts every man back in place, AP and all, the same objects (thaw in place). Once used, no BACK that turn.
(d) the turn ends itself: rule 125, shipped 10/20.
(e) THE FIGHT SAVES EVERY TURN: the rules' whole state (22 KB for a 3 v 3: every fighter's own numbers, the board, the die) at
the start of every turn of his (each round on AUTO) in localStorage bohemia.fight.kept.v1, keyed by the hand-over; a fresh
page opened with the same hand-over goes on from it ("Back where you left it. Round 2."), AGAIN starts clean, the end clears it.
The shell hears BOHEMIA_FIGHT_KEPT {key, round} and BOHEMIA_FIGHT_RESUMED. The door is RUN's (section 7).
THE SPEED: one pane of the map's own speed pad (#speedpad .sp, UI's tin; amber when fast), beside AUTO in the turn row, 1x / 2x
/ 3x, kept on the phone (bohemia.fight.speed).

## 4. CHANGE 8: ONE VOICE TEACHES, ONE RULE AT A TIME

The paper strip printed its how-to from nobody ("Drag a man inside the chalk", "Tap inside the chalk to walk. Tap a marked
man to hit."). Now his own veteran's face says each rule once on the phone, in the order the fight meets them: the line set,
the walk, the aim, cover, the empty gun (the three of [the first fight teaches]), their move, BACK, the AUTO that can finish.
Lines queue (never two at once), one whose moment has passed is dropped or put away (the line set when FIGHT is tapped, the skip
when their turn ends), a tap puts a line away and still does its job (it never stops the march). The strip keeps no how-to
when a face can say it: on the formation screen it names the moment ("Your line, before the fight."), on their turn "Their
move."; YOU alone, the strip keeps one rule ("Tap a chalk tile to walk."). Lines draft:true for WORDS, English with one
flavour word, under twelve words (THE FIRST FIGHT TEACHES' own check).

## 5. THE BULLET'S FACTS, FOR SOUNDS

SOUNDS shipped [the bullet lands] the same hour (engine/bohemia_bullet_lands.js): its player hears the fight's BOHEMIA_SFX and
reads optional fields, "the whole difference between a good guess and the truth". Every gun's shot, hit, vital, hurt and miss
now carries them on the moment the screen shows it: gun (pistol, rifle, shotgun), side (who fired), hp and armour (armour and no
hp: the plate stopped it), head, cover (the piece the man stood in), lands (man, armour, cover, dirt, past_ear), the ground, the
tiles; a fall says whose man fell; the shotgun's cone tells every man it caught; a melee blow carries nothing. One message, no
second. BULLET LANDS 14/0.

## 6. OUR GRAVEYARD AND THE HAUNTING (rule 134(a), 134(e))

THE PLACE: a city cemetery after the water stopped (the lawn died with the sprinklers the month the dollar died; the creosote
came back between the rows). The cemetery (WORLD's district 'cemetery', or FIGHT_OPTS.place 'graveyard') is dealt on the
valley's open scrub (COMBAT TWO's scrub.0-2, laid (x + 2y + seed) mod 3 so no block stands beside its twin), never fitted to the
park's envelope, and dressed by its field (ours.graveyard): a row of headstones on every field tile (162 on the board: one piece
of cover each, +5 against a blow and +10 against a shot, the sixth votes' count), an aisle every fourth column, a path across
row 7, the crypt near the path (it blocks a step), two obelisks, three fresh graves along the bottom two rows; each line's own
two columns stay open to stand in.
THE PIECES, through the rig: tools/bohemia_combat_the_graveyard_through_the_rig_10_24_26.py models eight in Blender (bpy 4.2
in a venv, the floor tool's own line) and renders them through DIRECTION's master rig with COOK's grime pass at the fight's 42.9
px a metre, the S facing (the side every stone, the crypt's door and the photographs face): four rows of seven stones (granite,
marble, cast stone; round, square and gabled tablets, a Latin cross, a slant marker, a flat one; each leaning as the dry ground
let it) with one odd thing a row (a laminated photograph bleached to a blank oval, a stone fallen face down, a coffee can of faded
plastic flowers, a stone snapped at its foot); two fresh graves (a heaped mound of dark turned earth with clods, a cross of two
scrap boards and wire, a photo zip-tied to it, a water bottle left for them, a burnt-down candle in a jar); the crypt (granite
courses, a pediment on two columns, an empty name band, the bronze door standing open on the dark); the obelisk. The rig's
contact shadow is one oval for one thing; on a 9 m row it fell under one stone or swallowed the row, so the cut lays the rig's
same oval (its own formula, the guide's shadow_alpha_max 0.42) under each stone. slices/fight_ghosts/ (156 KB) and its table
graveyard.json; the models in reference/models/bohemia/graveyard_*.glb; the renders regenerate (records/target/combat_graveyard_rig).
THE BAND IS THE PLACE'S OWN: ghosts only, the crew's own line (or the handed party) times crowd, times the Geist's act weight
over act one's: against three men 3 in act one, 1 in act two, 1 in act three. MEASURED (AUTO, 40 seeds a cell, on the
graveyard): 3 men beat 2 ghosts 90%, 3 ghosts 40%, 5 never; 6 men beat 5 ghosts 50%, 6 ghosts 35%, 9 never; 12 men beat 11
ghosts 78%, 12 ghosts 83%, 18 never. A crowd of 2 is a graveyard no company leaves: crowd 1 is the draft (TUNING's row), the
hardest fight on the line (rule 133(b): hardcore if you mess around), and the lesson is the way through.
THE HAUNTING AS ACT ONE SEES IT (134(e)): in act one every ghost wears a name of the valley's dead (RAMÓN, MARISOL, TÍO BETO,
LUPE, KENNY, DOÑA ESPERANZA, HOLLIS, LA FLACA, JOEY, MRS. PARK, CHUY, DANA; draft:true), or, when the shell hands the
company's own dead as FIGHT_OPTS.dead [{name, look}], his: their name and their body under the tape (the data-portrait,
never said). The first one he sees: his veteran's face, "Ay. That is La Flaca. We buried them in March.", then the lesson,
"Walk up and hit it, compa. They break like smoke."; a whisper posted for SOUNDS (BOHEMIA_SFX 'ghost_whisper', nothing plays
from here yet); the recap "THE DEAD WENT BACK DOWN" (lost: "THE DEAD KEPT THE FIELD"). No act-one word on the glass says machine,
signal, broadcast, data, network, program, code, AI or the Amalgamation (the gate holds the lexicon). From act two a ghost is
GHOST and nobody is recognised. Purple stays the wordless tell (the tape's copy).

## 7. ROUTED

- RUN (the door): (1) nfOpts hands the cell: o.district = d.district; o.cell = d.at (row [the map hands the board], still open);
  with the district a fight at the cemetery IS the graveyard. (2) A ghost party at the cemetery: party.faction 'ghosts' weighted
  by ours.act_weights for the act the map is in (party.act). (3) THE FIGHT KEPT: when the shell boots and the last thing it
  heard was BOHEMIA_FIGHT_KEPT with no BOHEMIA_FIGHT_OVER after it, it reopens the fight with the same hand-over and the fight
  goes on from the kept turn (the fight's half is done and gated). (4) FIGHT_OPTS.dead: the company's dead, so the graveyard's
  ghosts are his.
- RUN TWO / the roster: the company's dead with their looks, for FIGHT_OPTS.dead.
- UI: the AUTO glow (#bauto.glow, a beat-timed amber light layered over the tin), the speed pane (the map's #speedpad .sp) and
  BACK (a #skills pocket) use the kit's pieces as they are; if the kit wants its own glow or a BACK piece, the selectors are
  #bauto.glow and #bback.
- SOUNDS: 'ghost_whisper' (a real recording, never a faked voice); the bullet's facts are on every gun message.
- TUNING: ours.fallback_band_by_company (today's line, yours beside it), ours.graveyard (crowd, act scaling), THEIRS_PACE 2,
  FINISH_PACE 3, ODDS_GLOW 80 (the draw script's constants: the odds are the screen's read, not a rule).
- WORDS: TEACH deploy / walk / skip / back / auto / ghost / ghost_hit, DEPLOY_STATUS, THE_DEAD, HAUNT_RECAP: all draft:true.
- ANIMATION / COOK: the ghost is still a person's rig picture under the tape; a ghost of its own through the rig goes under the
  same tape (ghostBlit).

## 8. GATES

New: THE FIGHT BY HAND, QUICKER 18/0 (gates/the_fight_by_hand_quicker_gate.js, registered). GHOSTS AND APPARITIONS 18/0 (six new
legs: the graveyard deals itself, every piece the rig's, the band by the act, the dead who came back, never a machine in act one,
the recap). Green on the final tree: THE FIGHT READS ONLY SOURCED NUMBERS 10/0 (fight_ghosts/ on its list), THE FIRST FIGHT
TEACHES 10/0, ONE TAP 16/0, TURN ENDS 8/0, RELOAD 17/0, THE FIGHT DRIVES THE MUSIC 10/0, GUNS FROM THE FIRST FIGHT 12/0, SAYS
WHAT IS WEAK 10/0, HOLDS THE WHOLE GRID 17/0, MAP HANDS THE BOARD 8/0, WEAPON SHAPES 9/0, EVERY FLOOR TILE 19/0, PERKS 47/0,
FORMATION KEPT 23/0, AURA 29/0, EVERY FIGHT HANDS HIM BACK 9/0, ONE FIGHT 4/0, GUNS HEARD 33/0, BULLET LANDS 14/0, THE FIGHT'S BAR
IS STUDIO MADE 15/0, DEMO BUILD 25/0. Re-aimed at what changed (each says why in place): THE FORMATION IS KEPT (a first-time
player has no lesson learned; the face's line counts), THE FIGHT HOLDS THE WHOLE GRID (beasts counted at the blit: since the idles
the sheets reach the glass as addressless canvases, red on main since 10/23), THE REBUILT FIGHT PLAYS (the wide-screen strip leg
opens with teach:false; their acts read at their own pace; the skip tapped mid-act). THE REBUILT FIGHT PLAYS run whole under
six browsers at once: its pike-raider leg red under the load, green alone on the old file and the new; turnPace 4/0 alone after
the re-aim. RED ON MAIN, NOT THIS ROUND'S: 'a man stands off his ground at night' (COOK's floor pictures, last round's note);
FIGHT FLOOR CACHE 0/1 (drives the frozen fight's #combatFrame in the alpha); FIGHT STEPS 33/1 (SOUNDS' floor table against COOK's
new shore and works pictures); PAGES PUBLISH 16/2 (size and the folder list, PLUMBER's). Full suite unmeasured (rule 13).

## 9. WEAK

- The odds are AUTO's odds (both sides on the brains): a fight AUTO would lose can still be won by a good hand.
- The kept fight resumes only when the shell reopens the fight (RUN's door); today a tab that dies mid-fight comes back to the map.
- The graveyard is reached only when the door hands the district; until then it is the fight's, gated, not his.
- Ghosts are the hardest fight on the line; a crew of three that walks into the graveyard in act one wins 4 in 10 on AUTO.
- The fresh grave's mound is a sphere knocked about; a shovelled grave has edges.

[bb Battle Brothers has no speed control, no take-back and no save inside a fight, and its players install Swifter and
Autopilot for exactly that; its Geists haunt graveyards and battlefields, fight nerve not armour, and the answer is a man who
walks up and hits one.]
[analog horror: a laminated photograph on a headstone bleached to a blank pale oval, the dead's face gone, and a veteran who
knows the name anyway; AUTO lit on the beat like a VCR's OSD saying it can take it from here.]
