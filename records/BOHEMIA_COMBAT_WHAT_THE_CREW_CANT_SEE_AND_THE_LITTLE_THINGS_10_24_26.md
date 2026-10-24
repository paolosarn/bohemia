# COMBAT [what the crew can't see reads dark] and EYES' little things on the board (rules 157, 150; 10/24/26)

## HIS WORDS
Rule 157 (Paolo 10/24): 'during combat I see you trying to implement a vision system; some enemies behind the line don't get
shown; if you want a vision system in combat you have to do a lot better: if there are tiles that our team, with their vision
all together, can't see, you've gotta be able to tell; a different opacity, maybe a grey darkness to it... it's gotta be done a
lot better'.
Rule 150 (Paolo 10/24): 'there's a lot that's not really correct and right... this is the shit you have to stay on top of, all
these little things; I can't be explaining all these little things to you; you have to build these things'.

## MEASURED BEFORE
- The fight already hid a man of theirs no man of his could see (FIGHT.shown = sideSees), and drew nothing else: the board
  looked fully seen while men vanished from it. Sight was 7 tiles flat, the night's -2 unless lit; no trait, helmet, perk or
  height ever touched it (traits.json marked vision 'an effect the fight does not read yet').
- EYES [the playtest] 10/24 filed six rows here; five are in this round's reach (below).

## WHAT IS BUILT (slices/BOHEMIA_FIGHT.html)
- THE LIBRARY'S SIGHT, in the rules' vision(): 7 (rules.json board.vision_default, bb_all/0160_Attributes); the man's traits'
  vision (traits.json, now one of the fight's data files: Eagle Eyes +1, Short Sighted -1, Old -1; Night Owl +1 and Night
  Blind -1 only at night); his helmet's vision (armor.json head rows: -1 on 55 of 87 helmets); Bow Mastery's vision_bonus;
  the night -2 unless the tile looked at is lit; never under 1; then the height, after the cap, toward lower ground only
  ('Elevation is taken into account after the cap... applied only vs lower positioned opponents'), one tile a level
  (ours.sight.per_level, tuned:false: the library names no number). Crew men carry the company's traits; enemies their rows'.
- ONE SIGHT FOR THE CREW, drawFog(): every tile FIGHT.sideSees('you', tile) says none of his men sees wears a grey dark by
  opacity with a static over it (four 64-px frames of light specks, stepping on the song's sixteenths: a dead channel, never
  flat black), under the chalk so the marks still read; lifts or falls over a quarter beat. Nothing while he sets his line.
  The dark is one path a frame (a run of dark tiles along a row is one rectangle) and one fill of the combined pattern.
- THE LAST SEEN: a man of theirs lost from sight leaves a rust ring where he stood when last seen, fading to faint over
  ours.sight.lost_beats, gone when he is seen again or falls.
- [eyes: the reason is AP]: FIGHT.strikeWhy() returns the real refusal (range, AP with what the blow or shot costs and what he
  has, fatigue); the tap says 'Not enough AP: the shot costs N, NAME has M.' and plays the deny.
- [eyes: the stale line]: an aim or a refusal (say(..., true)) belongs to the turn it was said in; the director clears it
  when the turn passes (AUTO's rounds included).
- [eyes: the man up stays]: retreat() no longer ends the turn of the man up; the director plays it as every retreating man's
  (retreatStep: to the edge with his AP, out on it).
- [eyes: retreat recap]: a retreat in which any man got out is never a wipe (isWipe); the recap says YOU PULLED OUT, how many
  got out, and 'Left behind: NAME (down)'; the message home says retreat:true, wipe:false.
- [eyes: hitpoints drift]: a man the company hands without his card's numbers rolls them once from who he is (name, look,
  background, place), inside his background's ranges: the same health and skills every fight; the fight's die is still drawn.

## PROVED
- gates/what_the_crew_cant_see_gate.js (WHAT THE CREW CAN'T SEE, 7/0): the dark set equals the tiles no man of his sees by the
  rules' own test (107 of 300 on the bench board, 0 disagree, no man's own tile dark); a dark tile 47% darker with 50 shades
  in it, darkest 64 (not black); a dark tile lights in 81 ms after a man steps to see it (half a beat 250); a hidden man not
  drawn, his ring at his last-seen tile, gone when seen again; the library's numbers (7, 8, 6, 6, 8, 5, 6, 4; height 8 down,
  7 up); nothing dark while the line is set.
- gates/the_little_things_in_the_fight_gate.js (THE LITTLE THINGS IN THE FIGHT): the five rows above, each on the page.
- Cost: the far stop 30.5 fps with the dark against 33.0 without on this box (headless, software), the near stop 59.5 / 60.5.

## NOT DONE, NAMED
- [what each hand holds shows]: needs a shield in his off hand on the rig model. No shield model exists (reference/models has
  COOK's guns only) and this container has no Blender for the guns-in-their-hands render
  (tools/bohemia_combat_the_guns_in_their_hands.py needs a venv with bpy); and the pistol is rendered in BOTH hands (his 10/19
  'never swinging loose'), so a pistol-and-door man needs a one-handed pose. NOTEs to COOK (the door, the riot shield, the
  sign as glbs) and to whichever lane renders next.
- [eyes: men on men] (the line drawn as one heap) and the chalk showing what a walk will leave (the second half of
  [eyes: the reason is AP]) are open.
- The fog is drawn over the tile footprint: a tall house's roof on a hidden tile stands above its dark.
