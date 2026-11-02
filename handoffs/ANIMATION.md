# ANIMATION -- the handoff block (written only by ANIMATION; newest on top; the old blocks are handoffs/ANIMATION_ARCHIVE.md)

ANIMATION (session_01GKDyusavUZcodjCHmVnXRM): 11/2 (a) LATEST -- [they mend on the march] (ask line 314) SHIPPED (BUILD 11/3zj - THEY MEND ON THE MARCH),
NOT YET SEEN. TAB: VOTE (four items, each playing on his three walking) and the MAP itself (it happens by itself on the march).
WHAT IS IN THE GAME NOW:
- On the map, a man healing or mending on the march does one of his four as he walks, the walk going on under it: binds a bandage
  (under 60% hp), dry-swallows pills (an ache), duct-tapes his worn plate (armour down + tape in the cart), knocks the dent out of
  his worn helmet with a knife's butt (a real helmet, armour down + tape). One or two at a time, whole bars, a 6-12 bar rest, never
  in the first 2 bars, never facing away (S SE E SW W only), ends if he stops or turns away. Numbers: records/target/bb/march_acts.json.
- Pictures: slices/rig_march (his own model on his own six walk keys, laid on his map walk by the legs, his sheet's colours, a
  second sheet of only his arms drawn over his worn plate; the helmet in his fist via the wear player's new headAt).
- Code: engine/bohemia_march_acts.js (the picker/player), slices/BOHEMIA_CITY_WORLD.html __THEY_MEND_ON_THE_MARCH__ (the party's
  drawing only), engine/bohemia_wear.js o.headAt (additive, CHARACTER's file), tools/bohemia_animation_they_mend_on_the_march.py
  (render), tools/bohemia_animation_march_pack.py (pack, strips), tools/bohemia_animation_march_capture.js (the phone proof),
  the towns tool's WALK op, walk-key pose names and split_arms (records/target/animation/BOHEMIA_THEY_MEND_ON_THE_MARCH.json).
- Gate: gates/they_mend_on_the_march_gate.js. Record: records/BOHEMIA_ANIMATION_HEALING_AND_MENDING_ON_THE_MARCH_11_2_26.md.
WHAT IS LEFT (no Paolo needed):
- Render the other nine of his eleven (TINA, BOOKIE, OSO, MARISOL, CHEWY, LUPE, GRIZ, DEUCE, NENA): they walk without acts until
  then. A maker's main man and the post's hires the same way (their look). The record's WHAT IS LEFT has the commands.
- EYES on a real phone at the close end.
- Render cost: bpy 4.2 in a python3.11 venv (`python3.11 -m venv v && v/bin/pip install bpy==4.2.0 numpy pillow`); a man is
  ~35-45 min on one core (660 colour keys + 660 arm keys). Run each man as his own background job with a LONG time limit: a 30-min
  background cap killed three half-done men this round. Then `python3 tools/bohemia_animation_they_mend_on_the_march.py pack`.
