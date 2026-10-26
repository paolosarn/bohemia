# PORTRAIT [the face shows the wound] (rule 234(c)) and [every face breathes] (rule 246), Paolo 10/26
Session portrait-session_012D8EUX. Tool: tools/bohemia_portrait_the_face_shows_the_wound.py. Runner:
.github/workflows/portrait_wounds.yml. Engine: engine/bohemia_wound_faces.js (+ one hook in engine/bohemia_crew_faces.js).
Gates: gates/the_face_shows_the_wound_gate.js, gates/every_face_breathes_gate.js. VOTE: slices/vote/PORTRAIT_THE_FACE_SHOWS_THE_WOUND.webp
(card portrait-the-face-shows-the-wound-10-26), slices/vote/PORTRAIT_EVERY_FACE_BREATHES.webp (card portrait-every-face-breathes-10-26: an
animated before and after recorded off the live page slices/vote/PORTRAIT_EVERY_FACE_BREATHES.html by
tools/bohemia_portrait_every_face_breathes_clip.js, so the card plays the thing, rule 89 and the first votes).

## HIS WORDS
- 234: 'let's get creative with how it's gonna affect their portrait. You know to be able to visually tell that like either like a
  iPad [eye patch] or a serious brain shit or like blood somewhere like a Band-Aid there like the ear cut off there like the nose'
  (records/BOHEMIA_PAOLO_STRUCK_DOWN_HE_STILL_FIGHTS_AND_HIS_FACE_SHOWS_IT_10_26_26.md).
- 246: 'I wanna see my crew, anytime they're on the screen, or anytime anyone's on the screen with a portrait, just slightly moving,
  like breathing... if they have a serious wound maybe they could be reacting to it... I'm proud of the way you've been animating
  things so far, so just keep going' (records/BOHEMIA_PAOLO_OPTIMIZE_LOOT_AND_THE_AFTERMATH_BEHIND_THE_LOOT_AND_THE_FACES_BREATHE_10_26_26.md).

## HOW BATTLE BROTHERS DID IT (rule 33; the library first)
- bb_all/0626_Developer Posts.txt: 'Most of these injuries will be visible on your Battle Brothers (so you can see that a guy
  really has an eye missing)'.
- bb_all/1415_News and Dev Blogs.txt (the temple): 'The bandages shown on your characters are even visibly replaced by clean ones.'
- RECALL, marked as recall (their sprites are not in the library): a brother's bust is LAYERS, the head and an injury layer drawn
  over it; a temporary injury a dirty bandage while it heals, gone when it heals; a few permanent ones change the head for life.
- OURS, THE SAME SHAPE: each mark is a LAYER (a patch: what it adds, what it cuts away) over the face he already wears, stacking
  in one order; the fresh wound's blood and band-aid come off as it heals; a mark for life stays.

## THE MARKS (records/target/portrait/wounds/BOHEMIA_WOUND_MARKS.json: all 59 rows of records/target/bb/injuries.json name one)
His own list first: lost eye -> EYE PATCH (a domed oval of black cloth on the eye, a strap round the skull above the ears);
brain damage -> STITCHES (a stapled horseshoe scar from over the brow back over the skull, the hair shaved along it); lost ear ->
THE EAR GONE (the ear's own island shrunk to a raw dark stump with the hole, a crust forward of it, the hair hacked away); lost nose
-> THE NOSE GONE (the nose's own vertices smoothed flat on the welds, a gaping dark hole in a ring of healed scar); a fresh wound
-> BLOOD (dried, run from a cut over the brow down past the eye) and a BAND-AID over the cut; a broken arm -> SLING.
The rest, my call, in the same spirit: traumatized -> THE STARE (sockets sunk in dark rings, the eyes held too wide, a lock gone
white: canities subita, hair said to whiten overnight from shock); weakened heart -> THE SURGEON'S SCAR (up out of the collar, the
lips a dead grey-blue); partly collapsed lung -> THE BREATHING HOLE (a tracheostomy's scar, the mouth hanging open for air); skull
and concussion -> HEAD BANDAGE; the eye socket -> EYE PAD; the nose -> NOSE TAPED (dried blood under the nostrils); the torn ear ->
EAR BANDAGED; a face cut or pierced cheek -> STITCHED CHEEK; burns -> BURN (soot in the nostrils); the neck -> NECK WRAPPED (and a
strip up both sides of the face over the crown holding it); every arm, shoulder and hand -> SLING; and every wound the head-and-
collar picture cannot see (the knee, the foot, a finger, the ribs, the guts, sickness) -> THE SURGEON'S TAG: a yellow cattle tag
punched through his ear with the surgeon's marker on it. A man tagged like livestock and still standing is the analog horror of it.
THE STAGES (CAMP's own reading, engine/bohemia_long_injury.js look() on its branch): struck down today, his mark for life plus the
blood and the band-aid; under half his fresh days left, the band-aid alone; healed, the mark alone, for good.

## HOW THEY ARE MADE (rule 115(a), 121(e); nothing drawn, rule 108a)
1. THE MAN IS REBUILT with the builder his face came from (RUN TWO's person builder for the 152 rolled people, PORTRAIT's crew and
   faction builds for YOU and the 25 speakers), the same model the face he wears was rendered from.
2. THE MARKS ARE MESHES ON HIS OWN HEAD, added by a patch in memory of DIRECTION's master rig right after it imports him: left out
   of the ruler (the camera never moves), hidden from every base frame, the same source pass (wear by material), the same sun.
   Taking away is shape keys on his own mesh (the nose, the ear, the sockets, the hair round a wound); recolouring is a material
   swap for that shot (the lips, the lids, the white lock).
3. THE PIPE NEEDS BLENDER AND THE CHATS' BOX INSTALLS NOTHING (the session's brief): GitHub's free runner is the box. A push of
   records/portrait/wounds/REQUEST.json to the branch portrait-wounds starts it; sixteen shards build, mark, render and pack; the
   result comes back on portrait-wounds-renders. Nothing is pushed to main from the runner.
4. THE PATCHES: each mark kept only where it changes his face, an ADD and a CUT, through his own portrait's crop box and hand-off
   window, box-resampled to 128 and 64 exactly as RUN TWO's faces() made his face; one atlas and one index a man
   (records/target/portrait/wounds/<look>.png and .json); the runner's logs in records/portrait/wounds/logs (not published).

## WHAT THE PILOTS FOUND (eight, each measured, each named in its commit)
- p1 the clothes builders read the alpha (slices/BOHEMIA_ALPHA_0_9.html): the runner's checkout carries it.
- p2 glTF splits a mesh at every hard edge: the skull came back as one island a face, so every measurement is on welded vertices.
- p3 bpy's collections take no slice step. THE BASE MATCHES: the runner's rebuild of each face against the face he wears today,
  mean difference 0.0 to 1.3 levels at 128 (YOU 0.0).
- p4 the eye's pieces flew off in shards. NOT the NaN normal off the lids' poles (fixed anyway).
- p5 the posed-size log found it: the eye patch was 0.43 m wide AT REST. Blender's solidify throws vertices by its shell factor at
  every cliff in the surface (the socket's rim, a collar). Nothing is solidified now; every piece DRAPES (each depth pulled toward
  its neighbours' and never behind the skin, the way cloth lies over a dent), and the head's pieces ride the head bone whole.
- p6 to p8 a front-on portrait sees an ear as three pixels and ends about 0.045 m under the chin: the ear's wound reaches forward
  onto the face's edge, the ear bandage over the temple, the neck wrap gets its strip over the crown, the sling's strap rides the
  sides of the neck, and the surgeon's tag (a manila card at the throat, under the frame) became the cattle tag in the ear.

## EVERY FACE BREATHES (rule 246), BUILT IN THE SAME PASS
The same runner pass renders four more frames of every face (nothing marked): the blink (the lids' own Blink key), the eyes to each
side (each eyeball turned 11 degrees on its own centre), and the wince (his face's own Angry key at 0.7, the lids narrowed).
engine/bohemia_wound_faces.js runs ONE clock for every face on the page on the game's grid (three keys a beat at 120 BPM): a
breath every eight beats (15 a minute), the face rising a pixel at 128 and settling; a blink every 3 to 6 seconds; a glance now
and then; and a hurt man winces with the breath catching, every 5 s fresh, 8 s mending, 14 s for a mark for life. A talking face
is the talker's. still(true) holds every face still (the gates compare pixels with it).

## MEASURED (the full batch, run 40276121746, sixteen shards, about forty minutes; the blink again, run 40282129106, ten)
- 178 faces: YOU and all 152 rolled people with every mark and the four life frames, the 25 speakers (the cast and the gangs'
  keepers) the life frames only. 14,856 patches in 178 atlases, 16.7 MB (records/target/portrait/wounds). Nothing failed to build.
- THE MARKS: 153 marked faces x 18 marks x 2 sizes = 5,508. 5,478 show on his face. 25 are under his own gear (a high collar over
  the surgeon's scar and the breathing hole, a mask over the stitched cheek, goggles over the eye pad): the engine draws the
  surgeon's tag in his ear instead (COVERED), so a hurt man never reads whole; on the company only person_town_8's collar (the
  heart and the throat). 5 show nothing at all: person_homeless_4's hood hides both ears (the ear gone and the tag), and
  person_anarchists_5's hair hides the tag at 64.
- THE BASE MATCHES: 147 of 153 men's rebuilt faces are within 2 levels of the face they wear (the company's worst 1.26,
  person_town_5); 6 drift (person_town_33 14.1, person_town_19 12.8, person_church_5 10.8, person_reds_0 8.0, person_reds_3 7.7,
  person_town_43 2.4). A patch is the mark plus a 1-pixel ring, so the drift can show only in that ring: looked at by eye on all
  six, the marks sit right.
- THE BLINK, THE NINTH FINDING: the full batch's blink moved no pixel on 28 faces, 24 of them with their eyes in plain sight (heavy
  brows: their lids close under the skin of the brow). The blink now also sinks each eyeball three quarters of its radius under his
  own skin; the re-render gave all 24 a blink at 128 and 64. 4 men never blink because nothing of their eyes shows (person_blues_4,
  person_network_2, person_remnants_2 and person_town_2: visors and blindfolds), and the gate's only excuse is exactly that: eyes
  that turned and moved no pixel either way.
- THE TENTH FINDING, THE PIPE: the full batch's push from the shards' sparse, shallow, blob-less checkout died twice with 'RPC
  failed; HTTP 500' after four minutes. The renders were whole in the run's artifacts, and this box cannot reach the artifact store
  (the proxy refuses it), so .github/workflows/portrait_wounds_collect.yml fetched them and pushed them from a fresh repository, a
  shard a commit; the render workflow's own push now goes the same way, and each shard's artifact carries only what it made (the
  branch's old pilot logs had ridden every artifact over the new ones: shard_0 to shard_2's text logs and you, person_town_5 and
  person_town_14's render logs are the pilot's; the text logs stay on portrait-wounds, never on main).
- THE GATES: THE FACE SHOWS THE WOUND 29 passed, 0 failed; EVERY FACE BREATHES 15 passed, 0 failed (15 breaths a minute counted on
  the crew screen at 128 and 64; twelve faces breathing p95 16.7 ms a frame against 16.8 with none).

## WHAT IS NOT DONE, SAID
- THE EAR GONE and THE SLING read at 128 only, small: a front-on head portrait sees an ear as about three pixels and the neck's
  sides as a sliver. The three-quarter renders (SE, SW) would show the ear; that is the next swing, not hidden.
- THE SURGEON'S TAG covers 24 rows (the legs, the trunk, a finger, sickness): honest (the picture cannot see them) but one look for
  many wounds; the crew card's icons say which (rule 234(d), UI and CAMP).
- slices/bohemia_ui_materials.js line 866 shows YOU's face as an <img> src: no marks or breath there (UI's file).
- person_homeless_4 (hooded) shows nothing for a lost ear or a leg wound; 4 men behind visors never blink (above). Named, not hidden.
- CAMP's [struck down] landed on main while this lane rendered (ff94590b): the faces read BohemiaCondition.injuryOf(name).look,
  the gate's stages run through its own look(), and the crew screen's climb book (mark, hurt) stays a second source by name.

## ROUTED
- CAMP: injuryOf(name).look ({marks, fresh}) is what the faces read (live: ff94590b); the men in your book carry look, marks and wound.
- RUN TWO: one additive hook in engine/bohemia_crew_faces.js paint() (the marks and the breath over every face it paints) and the
  module fetched beside it; nothing else of yours touched.
- UI: line 866 of slices/bohemia_ui_materials.js; the crew card's icons (234(d)).
- EYES: lines 156 and 170 to 171 to walk.
