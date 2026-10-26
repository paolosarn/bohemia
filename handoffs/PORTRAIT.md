PORTRAIT (portrait-wounds): 10/26 LATEST -- [the face shows the wound] and [every face breathes] SHIPPED 0154fd59,
BUILT, NOT YET SEEN (rules 234(c), 246; BUILD 10/26zi - YOUR MEN WEAR THEIR WOUNDS AND EVERY FACE BREATHES).
Record: records/BOHEMIA_PORTRAIT_THE_FACE_SHOWS_THE_WOUND_10_26_26.md (his words, Battle Brothers first, every pilot's finding, the numbers).

WHAT SHIPPED
- 18 marks for the 59 injury rows (records/target/portrait/wounds/BOHEMIA_WOUND_MARKS.json), each geometry on the man's own model
  through DIRECTION's master rig (patched in memory, the file untouched), YOU and all 152 people at 128 and the 64 thumb: 14,856
  patches in 178 atlases (16.7 MB, records/target/portrait/wounds/<look>.png + .json). His list: eye patch, stapled skull with the
  hair shaved along it, the ear gone, the nose gone, blood and a band-aid, the sling. Mine: the stare (a lock gone white), the
  surgeon's scar, the breathing hole, head bandage, eye pad, nose taped, ear bandaged, stitched cheek, burn, neck wrapped, and a
  yellow cattle tag through the ear for every wound a head picture cannot see. Struck down: mark + blood + band-aid; past half his
  days: the band-aid; healed: the mark alone. A mark his own gear covers (25 of 5,508) is the tag instead (engine COVERED).
- Every face breathes: one clock on the 120 grid (engine/bohemia_wound_faces.js): a breath every eight beats (15 a minute), a blink
  every 3 to 6 s, a glance each side, a hurt man's wince with the breath catching (5 s fresh, 8 s mending, 14 s for life); the four
  frames are renders of his own face (178 faces, the 25 speakers too); a talking face is the talker's; still(true) for pixel gates.
- One additive hook in RUN TWO's engine/bohemia_crew_faces.js (paint() takes look, key, dy, life; draw() registers the face on the
  clock; the module loads bohemia_wound_faces.js beside itself). Every screen that draws a face through it wears both: the crew
  screen, the town, the spoils, the squad up close, the talking portrait.
- Gates in the suite: THE FACE SHOWS THE WOUND 29/0, EVERY FACE BREATHES 15/0. VOTE cards: portrait-the-face-shows-the-wound-10-26
  (the sheet, the stages first, twin his face today), portrait-every-face-breathes-10-26 (an animated before and after
  recorded off the live page by tools/bohemia_portrait_every_face_breathes_clip.js).

THE PIPE (for whoever renders next)
- Blender runs on GitHub's free runner: push records/portrait/wounds/REQUEST.json to the branch portrait-wounds (never main) and
  .github/workflows/portrait_wounds.yml builds, marks, renders and packs in shards; the result lands on portrait-wounds-renders.
- If a commit job's push dies (it did twice, HTTP 500, from the sparse shallow checkout), the renders sit in the run's artifacts:
  put the run id in records/portrait/wounds/COLLECT.json on portrait-wounds and portrait_wounds_collect.yml pushes them a shard a
  commit from a fresh repository. This box cannot reach the artifact store itself (the proxy refuses it).
- The blink needs the eyeball sunk under the skin for heavy brows (the lids close behind the brow); built in.

NOT DONE, SAID
- The ear gone and the sling are small from the front (an ear is three pixels in a front portrait): the three-quarter renders
  (SE, SW) are the next swing. person_homeless_4's hood hides his ear marks; 4 men behind visors never blink (honest: no eye shows).
- No hand to the hurt (the portrait is the head; no hand in frame).
- slices/bohemia_ui_materials.js line 866 draws YOU's face as an <img>: no marks or breath there (UI's file).

NOTES SENT (on the board rows)
- CAMP: the faces read injuryOf(name).look ({marks, fresh}) and your book's men {look, marks, wound}; [struck down] is on main
  (ff94590b) and read live; the crew screen's own climb book (mark, hurt) stays the second source by name.
- RUN TWO: the hook above in your file; nothing else of yours touched.

GATES ON THE SHIP TREE: THE FACE SHOWS THE WOUND 29/0; EVERY FACE BREATHES 15/0; DEMO BUILD green; VOTE TAB 47/4 (DYNASTY's two
whys and the alpha landing on the run after BEGIN, both not this lane's: the stamp is the only alpha byte this ship changes);
DERIVED FRESH 9/1 (the tile bank's drift on the alpha, CITY WORLD, RUN CURRENT and the canon index, none of them touched here);
PAGES PUBLISH 16/2 (the published surface 1536 MB over its 260 cap and the handoffs/skills/tickets copy list, both on main before
this); GATE REGISTRY 6/1 (19 other lanes' orphans; these two gates are in the suite now).
[bb Battle Brothers draws a brother's injuries on his head as layers (an eye gone, a bandage replaced by a clean one as it heals);
ours is the same shape, each mark a layer of his own render.]
[analog horror: a man tagged through the ear like livestock, still standing in the line, still breathing on the beat.]
