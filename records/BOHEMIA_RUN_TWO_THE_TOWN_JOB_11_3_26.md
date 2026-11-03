# RUN TWO: THE TOWN JOB (11/3/26)

Brief: the coordinator's VAMILY, from FINISHER 2's open asks page section 2 (records/BOHEMIA_FINISHER_THE_OPEN_ASKS_11_3_26.md).
Rows: 226 ('the most important'), 219, 241, 106, 142, 253, 244, then 173, 174, 195, and confirm 248 ('TOP PRIORITY').
Rule 349 (research the settlement first) holds HOME's own planted settlement, not the town screens; this job is not held by it.

## WHAT WAS TRUE BEFORE (measured on the demo, 11/3, main 5a6b04d8)
FINISHER 2's page said the game still showed the old pictures. Measured, it did not, with one exception. The audit line
came from EYES R6 at BUILD 10/26zzi, before the coordinator's four layouts (10/27) were wired.
Fourteen towns x the phone upright (390 x 844, touch) and on its side (844 x 390) x the phone on the right and on the left = 56 views:
- 55 of 56 drew the town's own picture (upright the coordinator's tall_left / tall_right with the phone on its own ground;
  on its side COOK's re-laid wide). THE ONE: Reds on its side drew the old shared town_1, because its smith's door sat on
  the picture's bottom edge (1279, 1087 of 1092) and townOk() refuses a picture whose keeper cannot stand at his door.
- No building's tap sat under the phone in any view (the camps' hall touched the phone's edge by 6 px upright).
- A man you can tap stood under the phone in 9 of the 28 upright views: your own men in Caravans 90%, Church 87%,
  Network 100%, Mob 48% (phone right), Blues 52%, Church 84% (phone left); with the phone on the left the recruits at the
  post and a man of the crowd in all five fortresses, 33 to 66%. A finger on him landed on the phone.
- On its side Caravans' recruit rail stood on the bottom edge: the post's men stood with their feet off the glass and
  the post's tap was 36 points tall on the glass.
- Upright, the arrival card's WHAT THEY THINK OF YOU ran under the phone ('NEUTRAI').
- The shops (173, 174, 195): when a building opens, the phone slides away (rule 294) and the sheet takes the whole glass;
  measured on Blues' stall upright, 15 lines, the phone off the glass. The stall's lower lines and the shop's double taps
  are not under the phone. Nothing to fix there.

## 248, THE BROWN TOWN: THE CAUSE
Not seen in 56 openings, nor at 0, 0.4, 1.2 and 3 s after a tap (the town painted under the arrival card at once).
The code shows how it happens: while a town's picture is not in, draw() fills the glass #1a140f (dark brown) and returns,
and townIm() had no onerror, so a picture that failed ONCE (a dropped fetch on a phone, a deploy mid-load) was never
asked for again: that town stayed brown for the whole visit while hitAt() still answered taps on its shops and people.
That is his 10/27 note word for word ('nothing but brown... the town works under it, blind taps hit people and shops sell').

## WHAT CHANGED (slices/BOHEMIA_SETTLEMENT_SCREEN.html, block __NOTHING_TAPPABLE_UNDER_THE_PHONE__; the towns' data)
1. FIT.padPic, FIT.phonePic, FIT.glassPic: the phone's ground, the phone and the glass in the picture's own pixels, at the fit.
2. offThePhone(): every man who stands still (a keeper, the post, the crowd, your crew) whose body would be on the phone's
   ground or off the glass steps to the nearest open ground off it, on the glass, clear of everybody, of every building's
   tap and of door fronts and the post's rail; the walkers answer no tap and may pass behind the phone. Only in the game
   (the town on its own bench, no phone, keeps its own placing). crewGround() skips the phone's ground. The folk are
   stood again when the phone changes side, never while a sheet is open.
3. tapBox() stops at the phone (a whole finger kept first).
4. frameTargets(): the men at the post, head to feet, are a framing target, so on its side Caravans' rail comes up onto the glass.
5. The arrival card is padded into the open area (above the phone upright, beside it on its side).
6. townIm(): a failed picture is asked for again at 1 s and 2 s; after a third failure the town draws its tier's picture.
   No tap answers while no picture is drawn (picIn()).
7. Reds' wide (slices/settlement_ground_towns/settlement_ground.json): the smith's door from (1279, 1087), the bottom edge,
   to (1044, 1062), open ground beside its front. Reds now draws its own picture on its side. COOK's two town gates stay
   green (EVERY TOWN TALL AND WIDE 11/0, EVERY TOWN SCREEN ITS OWN 8/0).
No new art (rule 297): every picture was already built and published.

## AFTER (the same 56 views)
All 56 draw the town's own picture. No building's tap under the phone, every one with a finger on the glass. Nobody you
can tap under the phone or off the glass. The arrival card clear of the phone both ways.

## THE GATE
NOTHING TAPPABLE UNDER THE PHONE (gates/nothing_tappable_under_the_phone_gate.js, in the suite): N1 every town draws its
own picture, N2 no building's tap under the phone and a finger of each on the glass, N3 nobody you can tap under the phone
or off the glass, each for upright and on its side x the phone right and left over every town the map has; N4 the arrival
card's words clear of the phone; N5 the retry and the no-blind-tap guard (source); Z nothing threw. 17 passed, 0 failed,
6 min 23 s. It can fail: its first run went red on N2/N3 (the post off the glass on its side, a hall short of a finger),
and the same measure found 9 views with a man under the phone on main.

## OTHER GATES RUN (rule 13a, the ones that read what changed)
Green: THE TOWN FITS THE SCREEN 21/0, THE ARRIVAL 37/0, THE FLIP GLIDES 9/0, YOUR CREW LIVES IN THE TOWN 10/0 (main
9/1 on its K5 timing leg the same hour), EVERY TOWN TALL AND WIDE 11/0, EVERY TOWN SCREEN ITS OWN 8/0.
Red, not mine, measured on a clean main checkout the same hour: SETTLEMENT SIDEWAYS (main 6 red, 'the whole picture on the
glass, nothing cropped': the four layouts crop by design since 10/27, the gate predates them); THE SETTLEMENT'S PEOPLE
'every file loads' (records/target/portrait/wounds/person_woman_2.json is not in the repo).
Full suite unmeasured since this sha (rule 13b).

## THE ROWS
226, 219, 106, 142, 244, 253: BUILT, NOT YET SEEN. 241: the turn glides (THE FLIP GLIDES 9/0), the towns tall and wide;
the camp is CAMP TWO's. 173 (G2), 174, 195: met by the phone stepping aside (rule 294), measured. 248: the cause found
and fixed, not met in 56 openings.

## SHOW HIM
VOTE card run2-the-town-job-11-3: Church upright (your man under the phone, then by the church), Mob with the phone on the
left (recruits under the phone, then off it), Reds on its side (the old shared picture, then its own), from the game's
camera on his phone size. records/target/run2_town_job_11_3/.

## LEFT
- The camp: K14 / ask line 291 (the six- and twelve-man camps put the surgeon and the minstrel under the upright phone) is
  CAMP TWO's; this gate measures the towns only.
- The Church town's church is wider than its phone corner (the coordinator's render notes landmark_in_pad); it answers no
  tap, so nothing tappable is under the phone, but its roof runs under the phone's left edge upright.
- SETTLEMENT SIDEWAYS should be re-aimed to the four layouts (crop is the design now) by its owner.
