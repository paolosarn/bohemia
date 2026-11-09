# NO MAN IS SKIPPED ON THE PAGE (COMBAT TWO, 11/9/26)

VAMILY rule 435(d), ask lines 541 and 542. Paolo 11/9, a third time, after 11/9g: "the auto combat is not fixed... all my team
must be doing shit... one of the guys, it skips him or something." The coordinator: both fixes were proven headless, never on the
page he plays; from now a fix is proven only on the real page (the alpha and the demo, phone upright, a fight started the way he
starts one, AUTO at 1x, 2x and 4x, ten fights at least, every man's turn logged from the page's own events, a recording). EYES
reproduces, COMBAT TWO fixes; the gate gets a PAGE leg.
BUILD 11/9n - NO MAN IS SKIPPED ON THE PAGE. BUILT, NOT YET SEEN. VOTE combat2-no-man-is-skipped-on-the-page-11-9 (stand_in).

## WHAT THE PAGE SHOWED (before, main 8a62befa7 and 403e823ef)
- COMBAT TWO's page probe (the demo opened as a stranger opens it: the title, NEW GAME, THE RAIDERS, BEGIN, the barber; a fight
  started by the map's own handover message; AUTO and the speed pressed with a finger on the phone's own buttons; the fight's
  startAnim, skipTurn and turnBroke hooked before its script): the first fight, the yards at 1x. RAUL, a handgonne, had his turn in
  rounds 1, 2 and 3 and did nothing: the rules gave him the turn and ended it in the same frame, the turn strip jumped over him.
- EYES (records/BOHEMIA_EYES_THE_SKIPPED_MAN_ON_THE_PAGE_11_9_26.md, 34 fights, alpha and demo): the page asks every man (545 of
  545); what he sees as a skip is a QUIET TURN: a reload only, a swap and a reload, a rest, a wanted strike not made: no walk, no
  blow, a quarter-beat note with an empty word (a swap and a rest draw nothing), 17 to 550 ms at 1x. 37 of 545 turns, 16 of 34
  fights.

## THE ROOT
1. THE BRAIN (headless, 120 fights, both sides AUTO, every kind of crew): 135 of 2,918 of his turns ended with nothing; with the
   broken men (morale Fleeing, cornered) set aside, 27: a gunman in cover with nothing to shoot held (the walk-anyway helper's
   'a shooter in cover holds his shot'), a gunman held for 'a shot next turn from here' (vantage's 'stay': a shot that needs them
   to walk in, while their outmatched line digs in, rule 428(d)), a shooter posting up on a roof, a man pinned, rests.
2. THE PAGE: a turn with no walk and no blow had nothing of its own to draw, or a quarter beat with no word, so it passed in a blink.

## THE FIX (slices/BOHEMIA_FIGHT.html)
- vantage: on AUTO a man of his who has done nothing this turn and could shoot only next turn from where he stands steps up to a
  tile NEARER the nearest of them that gives that shot (the vantage's own worth: their clubs, his storeys, his cover, the walk);
  on a roof only along the roof (AUTO HOLDS THE ROOF); with no such tile, on a roof he posts up, on the ground he walks on.
- neverIdle: a shooter in cover with nothing to shoot no longer holds; he steps nearer like the rest, onto the tile the fewest of
  their clubs can reach next turn, never into a man's reach.
- Every exit of the AUTO brain that ends a turn with nothing says why (u.btWhy: winded, rest, posts_up, ring, unable_near,
  in_reach_spent, no_tile_nearer, fleeing).
- endTurn: a turn of his on AUTO with no walk and no blow emits 'idle' with what it was (reload, swap, swap_reload, else the
  reason); the page shows it over him (a word for a beat and a half: RELOADS, SWAPS, RESTS, WINDED, POSTS UP, PINNED, HOLDS), the
  ripple on his tile, the line in the feed, three quarters of a beat on the clock (NOTE_BEATS.idle). By hand nothing changes.

## THE PROOF, ON THE REAL PAGE (the shipped code, rebased on 764f15711)
EYES' own tool (tools/bohemia_eyes_auto_on_the_page.js: a new game, a job walked to on the map, ENGAGE, hires, road meetings;
AUTO and speed pressed on the phone; every call logged in the fight's document), read turn by turn by the probe's reader
(a quiet turn counts as shown when the page drew its word for him, matched by time: the tool stamps a drawing with the round on
the clock when it is drawn, so the last turn of a round lands under the next):
- THE ALPHA, 12 fights (the yards, the Strip twice, the deck, Fremont, the desert, the casino floor twice, the rail yard, the
  trailers, the wash; 1x/2x/4x): 178 turns of his; 171 a walk or a blow; 7 quiet (a swap and a reload 2, a reload 3, a hold 2),
  7 of 7 shown with their word.
- THE DEMO, 10 fights: 143 turns of his; 138 a walk or a blow; 5 quiet (a reload 3, a hold 2), 5 of 5 shown with their word.
- One edit earlier (the same fix but a ground gunman who could only stand still for a next-turn shot): the alpha 185 turns, 9 quiet,
  9 shown; the demo 201 turns, 8 quiet, 8 shown.
- Quiet turns: 12 of 321 (3.7%) against EYES' 37 of 545 (6.8%) before; shown: 12 of 12 against none.
- COMBAT TWO's page probe on the way (16 fights, the demo and the alpha, six boards named: the Strip, Fremont, the casino floor,
  the freeway's deck, the rail yard, the wash): RAUL's gun acted in every round; 0 turns of his passed with nothing shown.
- THE RECORDING: records/target/combat2_435d/auto_on_the_page_alpha_2x.mp4 (20 s of the alpha's first fight at 2x, three quiet
  turns shown); the whole sessions (19 min, 100 MB each) stay off the repo.
- The headless second witness: empty turns 27 to 13 of 2,919 on the hunt; the gate's M6 below.

## GATE
gates/every_man_acts_on_auto_gate.js (EVERY MAN ACTS ON AUTO, registered) 13/0 (463 s with the page leg):
M6 EVERY TURN OF HIS DOES SOMETHING OR SAYS WHY (4,693 of 4,726 of his turns he moved, struck, shot, reloaded or swapped; 33,
0.70%, held, every one shown with its reason: posts_up 19, no_tile_nearer 4, winded 3, rest 3, ring 2, unable_near 2; 0 unsaid;
0 waiting for a shot next turn) and its plant (a turn ending with nothing said, caught); M7 ON THE PAGE (three fights on the
fight's page, phone upright, AUTO at 1x, 2x, 4x: every turn of his the rules gave must have motions of his played that round, half a
beat at least; 65 of 65) and its plant (the page's runner drops one man's motions, caught). M1 to M5 as before. --no-page skips M7.
ALSO RUN, ONE AT A TIME (the AUTO brain's gates): AUTO PLAYS SMART 7/0, AUTO PLAYS THE BEST TURN 7/0, CLIMB OR ATTACK, AUTO KNOWS
ITS MAN 11/0, EVERY FIGHT ENDS 10/0, THE ENEMY WANTS TO LIVE 4/0, THE FORMATION IS KEPT 23/0, AUTO AT 4X NEVER CRASHES 7/0, THE OLD
LAYOUT THE NEW HOUSES 25/0 (the two page gates run alone: with four browsers at once they missed their frame budgets). Red here AND on main, the same:
AUTO HOLDS THE ROOF R3 (the same counts: raiders one left while posting, one up and down; the boss one left with a shot), AUTO
NEVER LEAVES A MAN N1 (5 of 25 on both), AUTO NEVER WASTES A TURN G2 (4 dances in 100 fights on both), EVERY MAN HAS A JOB EACH
TURN J3 (40 of 2,956 here, 38 of 2,927 on main, the same leading cases), AUTO KILLS ONE AT A TIME F5 (data rows).

## FOUND, NOT THIS CHANGE (for MOTION and ANIMATION)
Inside the alpha's and the demo's shell, at night, the board's drawing throws "Failed to execute 'drawImage'... The provided value is
not of type" every two seconds (136 in one demo run, 12 in one alpha run, 0 in others). The stack: blitMan (BOHEMIA_FIGHT.html, the
plain cell draw after idleDraw declines: a rolled man of the valley, `c.person`) <- drawMan <- draw <- frame, with the NATIVE
drawImage on top: the fight patches CanvasRenderingContext2D.prototype.drawImage to draw its NightSheet and PackedSheet, so a draw
that reaches the native call is a context from another document (the shell's), which never got the patch. The fight's page alone at
night on AUTO, the same seeds on main and here: 0 and 0 errors (four fights each, the new note among them). Not traced further.

## WEAK, SAID OUT LOUD
- A shooter on a roof still posts up a turn or two (rule 328's AUTO HOLDS THE ROOF); it is shown as POSTS UP, never a blink.
- At 4x three quarters of a beat is about 94 ms: as quick as everything else at 4x, but quick.
- The word over him is small on a phone at the far stop; the feed line says it in full.
- The probe started its fights with the map's own handover message (the shape a party chase sends), not by walking the party
  into a crew; EYES' tool walks to them.

[bb] Battle Brothers' AI ends a ranged brother's turn in place when nothing is in range, and the screen still pauses on him with his
name; ours moves him up, and when he truly holds, says why over his head.
[analog horror] a gunman at the back of the line who never fires and never moves, and the turn strip that never stops on his face.
