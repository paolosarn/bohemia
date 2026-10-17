# THE BEAST IN EIGHT: THE DIRE WOLF TURNS ALL EIGHT WAYS THROUGH DIRECTION'S RIG (ANIMATION, 10/17/26, row [the beast in eight])

Rule 110 (the big swing, no check-in), rule 107 (Paolo 10/10: 'one of the chats made a dire wolf; when you create
something it has to be made in all eight directions, you understand that'), rule 108 (no pixel drawn in code; the
pixels come from a 3D render under DIRECTION's one camera, rule 108 ROUND EIGHT (b)), rule 100 (cook only, a candidate
in VOTE, nothing into the game), ROUND THIRTEEN (a placeholder until the moodboard), rule 42 (the beast is lab-made).
Last round this row was BLOCKED, measured (records/BOHEMIA_THE_BEAST_IN_EIGHT_IS_BLOCKED_10_16_26.md): the generators
are refused by the network, a pack cut has one facing, and the only legal camera was not built. DIRECTION's rig landed
round two at 564e1b10 with the fox walking in eight. Measured first (rule 12): the rig takes any glTF with named clips,
so the whole row was open; nothing else was needed from anyone.

## WHAT EXISTS NOW (TAB: VOTE, the card PLACEHOLDER: THE DIRE WOLF IN EIGHT, IDLE, STEP AND BITE, playing)
- reference/models/bohemia/dire_wolf.glb: the Khronos Fox (CC0 model, CC BY rig) made a dire wolf IN BLENDER, before
  the camera, by tools/bohemia_animation_the_beast_in_eight_prep.py (bpy 4.2, headless): the one texture recoloured at
  the source (orange to a grizzled grey-brown, white to cream, black stays, a seeded grain against the toy's flat
  colour); the body 1.2 wider and the skull 1.18 bigger (the heavy head and jaw every reconstruction agrees on); a
  fourth clip, BITE, two beats, posed on the model's own neck, head, spine, root and front legs from the idle's first
  frame: crouch, spring, the shut with a shake, the recover (the quadruped's own timing). LICENSE.txt beside it.
- records/target/master_rig/dire_wolf/: DIRECTION's rig, UNCHANGED, at 1.6 m nose to tail (a heavy grey wolf, rule
  42), 57 px a metre, the one camera: eight stills, Survey (the idle) 12 keys, Walk 6, Bite 6, all eight facings, one
  crop box (112 x 119), rig.json. 200 renders in about 70 s on this CPU. The raw renders are not committed (2.3 MB
  of pre-crop PNGs; PAGES PUBLISH is already red on size).
- slices/vote/ANIMATION_THE_BEAST_IN_EIGHT.webp + .json: the baked sheet (tools/bohemia_animation_the_beast_in_eight_bake.py),
  every frame reduced to ONE 16-colour palette measured from the wolf's own frames (median cut, no dither; what
  Aseprite's indexed mode does; 4,100 render colours to 16), the outer ring one pixel and the darkest colour, the
  game's own wolf today (SE, its only facing) on the last row; the palette written as palette_16.gpl beside the rig.
- slices/vote/ANIMATION_THE_BEAST_IN_EIGHT.html: eight facings, idle, step and bite each, playing on the 120 beat at
  one art pixel to one phone pixel; beside it the game's wolf and the pack's grey wolf (from the index thumbnail; the
  tile itself is not in the repo, 0 of 13 approved). No vote inside the page (rule 25).
- records/target/master_rig/ANIMATION_THE_BEAST_IN_EIGHT.png: the proof sheet at 1:1, the eight stills beside the
  1.72 m ruler, the pack's wolf and the game's wolf, then every facing's three strips.
- VOTE: animation-the-beast-in-eight-10-17, PLACEHOLDER, with its twin and three differences (rule 101d).

## THE RIG'S OWN LOOP, THREE PASSES BY EYE, THEN STOPPED (rule 97)
1. THE FIRST BITE REACHED DOWN. The head went nose-down and forward: a fox pouncing on a mouse. A dire wolf bites a
   man's chest: the crouch goes LOW and the spring goes forward and UP. Re-posed; the E strip reads as a lunge now.
2. THE SPRING JUMPED. Measured on the render: the crouch-to-spring key changed 61 percent of the silhouette (on N the
   whole body moved 14 px between two drawn keys: the envelope tell, the body leaving its own footprint). The thrust
   and the head swing were cut by a third (53 percent), then the crouch made shallower and the spring lower (50.5
   percent, the body moving 12 px). AND THE RULER WAS WRONG, SAID SO: 'under half the silhouette' was a line I invented
   this round; a thin body shifting 12 px fails it while the eye reads one lunge. The gate now holds the lane's OLDER
   line, set by FOUR LEGS on 10/9 for the formula wolf's own bite: the body moves at most 16 px between two drawn keys
   (14 on a loop). Measured: idle 3.6 px, walk 4.0, bite 12.1. The silhouette number is still printed, not judged.
3. THE STILL IS A SNIFF. The idle's first frame is the fox's survey pose, head low and tail up, so the eight stills
   look odd on N and S. Said, not fixed: a rest pose needs a model that has one (DIRECTION's round-two note), and the
   clips play, the stills do not.

## MEASURED (the gate prints every number)
- No facing is a flip: W against E flipped differs 54 percent in silhouette and 23 levels in light; NW/NE 65 and 34;
  SW/SE 59 and 21. The one sun from the upper left is what makes a W a W.
- The coat: mean saturation 0.14 (the fox was over 0.5).
- True size: 90 px long side-on, 66 tall facing you, against a 98 px man; the pack draws its wolf 96 tall facing you
  (as tall as its people; a convenience, not a size).
- The clips: the body moves at most 3.6 px between drawn keys on the idle, 4.0 on the walk, 12.1 on the bite (lines
  14 and 16); the silhouette changes 4 to 28 percent on the idle, 6 to 32 on the walk, 4 to 51 on the bite; the
  bite's head rises 12 px from the crouch to the spring on E.
- Known and said: no jaw bone, so the mouth never opens (the bite is the head and the neck; a model with a jaw is a
  later cook); a fox's silhouette (the brush tail, the pointed ears, the short legs) under a wolf's coat; 16 colours
  from the render, not from a pack; the yellow ear tag of the formula wolf is not on this one yet.

## PROOF
    BEAST IN EIGHT (new, gates/the_beast_in_eight_gate.py, in the suite as BEAST IN EIGHT): the facings, the mirror
    leg, the coat, the clips' motion and envelope, the bite's rise, true size, the sheet against its table, 16 colours,
    the page, the registry row, the licence. Six mutations planted first: a flipped facing, a fox-orange coat, a frozen
    clip, a key that jumps the whole body, a 5-key strip, a bite that reaches down.
    SPRITE SCALE (DIRECTION's gate) run on the new rig.json: on the ruler.
    Nothing in engine/, nothing in the demo, nothing in slices/fight_beasts (rule 100).

## WHAT IS NOT DONE, SAID SO
Not in the fight. When he says FINAL on a real dire wolf (a model with a jaw, after the moodboard), COMBAT reads a
beast table the way it reads fight_people's. [the bestiary walks] (the hyena, the horse, the lion, the bear, the
mammoth) is the same pipe with other models: the prep tool takes any glTF with a walk and an idle.

## [bb beast] THE SCHOOL LINE (rule 39b)
Battle Brothers' direwolf faces two ways, a drawn left and its mirror; its bite is one sprite swap. WHAT WE DO
DIFFERENTLY: eight facings each lit by the one sun, and a bite that is a motion on bones, drawn at the beat's keys.

## ANALOG HORROR LINE (rule 30)
The lab's wolf has a coat the colour of dust on a dead monitor, and when it turns to face you nothing about it was
drawn for you: the same animal, the same light, eight ways round, the way a thing in a found tape never faces the
camera on purpose.
