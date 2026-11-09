# EYES 11/9 -- THE SKIPPED MAN, FOUND ON THE PAGE HE PLAYS (rule 435(d), ask line 541)

Paolo 11/9, the third time, after 11/9g: 'the auto combat is not fixed... all my team must be doing shit... one of the guys, it
skips him or something'. Both fixes before this were proven headless. This round played the REAL PAGE: the alpha link and the
demo, phone upright (390 x 844, touch), served from disk at the real address, a new game's crew plus two hires, AUTO pressed with a
finger on the phone's own AUTO button, the phone's own speed button pressed to 1x, 2x or 4x. Every turn was logged FROM THE PAGE'S
OWN CALLS, hooked in the fight's document before its script runs (tools/bohemia_eyes_auto_on_the_page.js): who the page asked to
act and from which loop (the frame's tick, the think-ahead timer, a board-tap skip), what his act put in the fight's log, whether
he moved, what the page drew (startAnim), every page-forced end, every turn that threw, every round's order. Screen recorded
(Playwright's video) and, for the moments that matter, the browser's own screencast frames, each stamped with the wall clock the
fight's log uses, so the pictures line up with the log to the millisecond.

## WHAT IT IS, IN ONE LINE

THE PAGE DOES NOT SKIP ANYBODY. IT PLAYS SOME OF HIS MEN'S TURNS SO FAST AND SO QUIETLY THAT THEY LOOK SKIPPED. A turn that is only a
reload, a swap and a reload, a rest, or a strike the brain wanted and did not make has NO WALK AND NO BLOW, is drawn as one
quarter-beat note with an empty pop, and passes in 17 to 550 ms at 1x (24 to 89 ms at 4x), where a turn he can see lasts 1.3 s.
The phone's name panel says his name for about a third of a second, his body does not move, and the next man is up.

## THE COUNT (34 AUTO fights on the page, his men only)

- Fights: 34 on AUTO (demo 11 + 11, alpha 12; 11 at 1x, 11 at 2x, 12 at 4x), on 13 boards: yards, suburb + strip, the Strip
  (stripw + blvd + stripe), THE DECK (the freeway), fremont (downtown), desert, THE CASINO FLOOR (twice), rail, strip + main,
  trailer, wash, strip + lots + works, lots + strip + suburb. Crews of 1 to 5: YOU, DESI, RAUL as a new game gives them, and hires
  (HECTOR MAYFIELD, RAUL IBARRA, ARMANDO CORDOVA, HOANG TOLENTINO, JAMAL VANCE, TYRELL NOVAK, CLYDE DUONG, CYRUS PIKE).
- His turns: 545. The page asked EVERY man of his EVERY round he stood on the field (0 not asked, 0 turns that threw, 0 resolved by
  a tap, 0 ends forced by the page). 530 acted (moved or struck or reloaded), 15 did nothing (8 a rest, winded; 7 below).
- THE QUIET TURNS: 37 of his 545 turns had NO WALK AND NO BLOW, in 16 of the 34 fights (47 percent of fights).
- How long a turn of his lasts on the page, from the page asking him to the page asking the next man:
    a turn with a walk or a blow   1x median 1,268 ms (480 to 4,371) | 2x 636 ms | 4x 321 ms
    reload only                    1x 322 to 499 ms | 2x 154 to 551 | 4x 24
    swap and reload only           1x 82 to 334 ms  | 2x 68 to 427  | 4x 57 to 89
    rest (winded)                  1x 17 to 19 ms   | 2x 385
- What the page draws for it (NOTE_BEATS in slices/BOHEMIA_FIGHT.html): reload 0.25 beat (125 ms at 1x, 62 at 2x, 31 at 4x) with
  pop(u, '') -- an EMPTY word over him; a swap draws nothing at all; a rest draws nothing. The hands-on reload pose
  (holdReload, four keys over four thirds of a beat) only shows if the camera is on him and nothing else is drawing.

## WHO HE IS

The gun men, right after a shot: the new game's RAUL (light crossbow), every crossbow hire (HECTOR, RAUL IBARRA, ARMANDO, HOANG,
JAMAL, TYRELL, CLYDE), and the pistol men (YOU and DESI: their 'dagger' rides the javelin row as a pistol, ours.json pistol_shot,
so they reload too). Not wounded, not the main man in particular, any board, every speed. A crossbow is one round, then reload: so a
crossbowman whose target is out of reach after reloading, or who must first swap back to the crossbow, spends a whole turn that
nobody sees.

## THE MOMENT, FRAME BY FRAME (records/eyes_skipped_man_11_9/)

1. hector_reload_x2.png -- the alpha, the yards board, round 2, 2x, from the screencast (milliseconds from the page asking him):
   -355 RAUL IBARRA shoots; -43 the phone says HECTOR; +24 the page asks HECTOR, he reloads; +89 his reload note (62 ms); +151 his
   turn is over; +256 the phone says RAUL; +444 RAUL reloads; +656 RAUL walks. HECTOR's body did not move in any frame. Log:
   calls 'tick reload' at +0 and 'tick end' at +151; the only draw for him 'note reload' at +79.
2. 02_raul_ibarra_swap_and_reload_1x_the_strip.webp -- the alpha, the Strip, round 5, 1x, from the screencast: RAUL IBARRA (a crossbow
   hire) swap +0, reload +100, end +474; his only draw a reload note at +393; on the glass a small move of his arms; the phone shows
   his name from about +400 and still shows it at +720 while the THUG's blow lands; HECTOR's turn two men later the same (swap, reload,
   end in 297 ms).
3. The Strip at 1x (alpha fight 3 of the first alpha run, round 4): ARMANDO's turn swap +0, reload +95, end +323, drawn only as a reload note at +235;
   then DESI reload +334, end +823 (her brain's reason 'strike': she wanted to shoot and did not). TWO MEN IN A ROW with nothing
   to see, 0.8 s in all, between YOU's blow and HOANG's walk. (The video frames for this one are only aligned by the file's clock,
   a second either way, so they are not used as proof; the log is.)

## THE SMALLER ONE, BESIDE IT (the 7 that did nothing and were not resting)

- A man whose brain's reason was 'strike' ended his turn with nothing: RAUL (crossbow) twice on fremont at 4x (rounds 8 and 11),
  YOU once in the desert (round 15). Nothing in reach after the reload is the likely why; the brain should walk or take cover.
- The desert, 1 v 1 at 1x: YOU (pistol) and the thug both ended rounds 2 to 5 with no reason set, apart, out of reach, until the thug
  walked. Four rounds of a man of his standing. (One man each; the standoff rule did not cut it.)

## WHAT THIS IS NOT

- Not the page's turn loop skipping a man: 545 of 545 asked. Not the kill cam (0 ms of cut in every AUTO fight measured). Not a
  thrown turn (0). Not a board-tap skip (0). Not the camera: no man of his acted wholly off the glass or under the phone (0 of 371
  measured with boxes); 18 percent of acts were inside the page's own follow margin at the left edge, still on the glass.

## FOR COMBAT TWO (handed in handoffs/COMBAT_TWO.md; the fix is theirs, EYES did not touch the fight)

The root is what the page SHOWS for a quiet turn, plus the brain's choice that makes them. Proven only on the page (435(d)): every
turn of his on AUTO lasts long enough to see and shows what he did (a reload is seen as a reload, a swap as a swap, a rest as a
rest), and a man who reloads with nothing in reach also walks or takes cover; the page leg of the gate reads these same calls
(tools/bohemia_eyes_auto_on_the_page.js) and fails a quiet turn under, say, half a beat or a turn with no drawn act.

## HOW, SAID PLAINLY

- Fights started the way he starts one: the first try was a job off the board walked to and met on the road; on the demo the job
  could not be taken by the tool (the board's one offer), on the alpha the job taken (Tule Springs, the freezer) is a REGION place
  (real_places.json where: region) at cell (68, -1), past the valley's north edge; the tool's walk (travelTo) could not route there,
  and whether a finger can is NOT CHECKED, so nothing is filed. So the fights came from meetings on the road through the
  map's own encounter message (nfOpen, the door the freeway gate uses), ENGAGE by the same path, AUTO and speed by finger.
- One demo fight (casino, run 2) is left out: the AUTO tap missed and the tool watched it at deploy; it is not counted.
- Raw: the run directories are in the session's scratchpad (turns.json, summary.txt, video); the record's pictures are the proof.
