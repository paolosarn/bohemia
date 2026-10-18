# WHO THE FACE IS: A FACE IS A PERSON, NOT A COSTUME (PEOPLE, 10/18/26)

Row: PEOPLE [a name for every starred face] WHO-THE-FACE-IS (rule 115(h)). Under the hold
(rule 88): a page is the ship. NOT IN A TAB (a page).
Bank: banks/BOHEMIA_WHO_THE_FACE_IS_10_18_26.json, draft:true, nothing live reads it; written by
tools/bohemia_people_who_the_face_is.js, the lines kept apart in tools/bohemia_people_who_the_face_is_lines.js.
Gate: gates/who_the_face_is_gate.js (WHO THE FACE IS).
Pictures: records/people/WHO_THE_FACE_IS.png (the fifteen at 1:1, each with the person behind it) and
records/people/WHO_THE_FACE_IS_TALKING.gif (all fifteen saying their lines on PORTRAIT's own mouth keys).

His words. The first star, on PORTRAIT's poacher face built as a 3D head on his own body (10/18): "You
might change the game with this one big star event... this is the first star I've handed out." The names
(9/21): "a little more percentage of white people names and we're good. Try to keep it natural." The
Spanish (8/26): "proportional to vegas demographics and maybe slightly less"; (9/22) "Chill with the
Spanglish. Some characters might speak Spanglish to you, doesn't mean you will."

## 1. WHICH FACES (measured, not guessed)

PORTRAIT has shipped fifteen faces the starred way: the thirteen in its crew manifest
(records/target/portrait/crew/BOHEMIA_CREW_FACES.json: YOU and the twelve cast looks the crew and scavenge
screens show) and the two enemy heads under records/target/portrait/rig/ (COOK THREE's thug and poacher).
In the manifest, twelve of the thirteen carry `"name": null`. RUN TWO already draws them on the crew
screen and at the hire post (engine/bohemia_rig_faces.js), so the faces are live. The people were not.

## 2. WHAT THE SCREENS DO WITH A FACE TODAY (measured on the live code)

THE CREW SCREEN. engine/bohemia_roster.js manOf hands the crew their faces in turn: crew member i wears
cast look i mod 12. So DESI wears the bare-arms face, RAUL the pack, TINA the skirt, BOOKIE the wide brim,
OSO the cape, MARISOL the apron, CHEWY the poncho, LUPE the bedroll, GRIZ the shorts, DEUCE the satchel,
NENA the short coat. Eleven of the twelve cast faces are taken by the starting crew. Only the long coat is
free. MARISOL's face is an old man's grey taper over a smith's apron; CHEWY the butcher wears the poncho
while the apron goes to the hunter.

THE HIRE POST. slices/BOHEMIA_SETTLEMENT_SCREEN.html recruitsHere rolls a recruit's name and his face with
two different hashes of the same key. Replayed with the post's own code over the 26 places and 13 weeks:

- **1162 of 1274** men at a post (**91.2%**) wear the face of somebody already in your crew. Hire one and
  you own DESI's twin.
- **Every face meets exactly four names, always the same four.** Both rolls hash the same key with one
  word changed, both counts (16 names, 12 faces) are multiples of 4, and the low two bits of the post's
  hash come out tied. The bare-arms face is only ever Lalo, Memo, Ofelia or Yesenia; the apron only
  Marisol, Neto, Pancho or Rocco.
- **The three faces that read as women (the skirt, the poncho, the short coat) only ever meet Beto, Dani,
  Nacho or Rudy.** Not one woman's name in 13 weeks across the whole valley. The five women's names on
  the list (Lupe, Yesenia, Marisol, Kiki, Ofelia) land 413 times, every time on a face that reads as a man.

## 3. THE FINDING. PROVES US WRONG

The row assumed a starred face was missing a name, so the job was to add one. Measured, it is the other
way round: **the face already had too many.** On the crew screen it is one person, at the post it is four
others, and a man you hire can be a crewmate's twin. A face in this game was never a person. It was a
costume, handed out by index on one screen and by a hash on another. Adding a fifteenth name to a costume
gives it a fifth name, not a person.

So the bank keys the PERSON to the FACE, once: one face, one name, one home, one past, one voice. That is
ONE ID, ONE WHOLE PERSON (8/27) applied to the new heads, and the rule for the post that follows from it is
ONE KEY DRAWS THE MAN (section 6).

Three more things the round found, each fixed in the bank:

1. **The names mix has three Hispanic men.** Its Hispanic given pool is 25 women and 3 men (Ignacio, Amaury,
   Ruben), so under its own rule a Hispanic man is one of three names 65% of the time, while every face
   PORTRAIT made reads as a man but three. The bank adds ten of the commonest given names of Hispanic men in
   the US (Hector, Javier, Armando, Octavio, Efrain, Rogelio, Sergio, Jorge, Raul, Esteban; no joke names)
   and tags every given name in the mix as a man's, a woman's or either.
2. **Two peoples in one list.** The mix's "rest" surnames hold five West African names beside the English
   and European ones, and its "asian" lists hold five peoples in one. Its own rule drew "Wendell Amadi" (a
   white man with a Nigerian surname) and "Arnel Duong" (a Filipino first name on a Vietnamese surname). The
   bank's origin rule: a white, Hispanic or Asian person's crossover surname is never West African; an Asian
   person's Asian given name comes from the same people as the surname, else a common one.
3. **The mouth runs at a third of speaking speed.** The game's mouth (visemesOf in the alpha, 8/26) plays one
   shape per letter-sound for 250 ms, so these fifteen lines average **10.4 s** each. People read English at
   about 6.2 syllables a second and Spanish at 7.8 (Pellegrino, Coupe and Marsico 2011, Language 87(3)). The
   bank keeps the game's own shape for each vowel and clocks it per syllable instead: one syllable per eighth
   note at 120 BPM, 4 a second; the lips close first on m, b and p. The same lines average **4.7 s**, 2.2
   times quicker, still slower than a person reads, which is the stiff clay cadence of the rig's look.

## 4. THE FIFTEEN (draft:true; the words are attempts, the names are draws)

| face | the person | who | the line | voice | says it in |
|---|---|---|---|---|---|
| you | Minh Duong | a security contractor, from Nellis Gate | "Pay me in batteries. I stopped taking promises." | English, always (the player) | 4.3 s |
| cast_longcoat | Amaury Carrasco | a highway crew's man, from Hoover Dam | "I used to stop trucks on the dam road. Now I ride in one." | English | 4.8 s |
| cast_barearms | Amos Ferris | a block watch man, from Pahrump | "I watched one block in Pahrump for six years. Nobody left to watch." | English | 5.3 s |
| cast_pack | Otis Wexler | a bouncer, from The Tunnels | "Nine years on a casino door. The door is still standing." | English | 4.3 s |
| cast_skirt | Tasha Hargrove | a retired airman, from The Yards | "Twenty years Air Force. My pension is in dollars. Go ahead, laugh." | English | 5.5 s |
| cast_widebrim | Wendell Lund | a thief, from Jean | "I never steal from the crew. I steal for the crew." | English | 3.8 s |
| cast_cape | Cyrus Truong | a hard-rock miner, from Searchlight | "Forty years underground. The quiet down there talks back." | English | 3.8 s |
| cast_apron | Wyatt Hatcher | a desert hunter, bighorn and jackrabbit, from Primm | "Bighorn quit coming down to Primm. Something up top eats first." | English | 4.5 s |
| cast_poncho | Xiomara Delgado | a buffet butcher who still has her knives, from The Park | "Thirty years cutting meat at the buffet, mijo, y mi mano no olvida nada." | English and Spanish | 6.3 s |
| cast_bedroll | Kai Galvan | a poacher the game warden knows by name, from The Chapel | "The warden knew my name. Now there is no warden, just my name." | English | 4.8 s |
| cast_shorts | Hoang Serrano | a trucker's loader, from Nellis Gate | "I loaded trucks that never came back. I quit asking where." | English | 4.3 s |
| cast_satchel | Javier Escobar | a gambler, from The Datafort | "The house always won. Then the house went dark. Now I deal." | English | 4.5 s |
| cast_shortcoat | Corinne Emery | a day labourer off the hardware-store lot, from The Shops | "Every morning I stood on the hardware lot. Somebody always picked me." | English | 6.0 s |
| thug (enemy) | Rogelio Kessler | a highway crew's man, from The Datafort | "Batteries on the ground, carnal. Ahorita, or we take the truck too." | English and Spanish | 5.8 s |
| poacher (enemy) | Odell Kaminski | a poacher the game warden knows by name, from The Chapel | "Hold still. I never miss twice." | English | 2.5 s |

Xiomara's Spanish: "y mi mano no olvida nada", and my hand forgets nothing. Rogelio's: "carnal", brother;
"ahorita", right now. The meaning a player needs ("batteries on the ground") is in English.

## 5. THE DESIGN (draft; how each person was made, so the next face gets one the same way)

- **Heritage.** The census shares the names mix cites (33 / 36 / 13 / 12 / 6), counted over the fifteen faces
  by largest remainder: 5 Hispanic, 5 white, 2 Black, 2 Asian, 1 of two or more. Dealt to the faces in an
  order a hash sets. **Never by skin**: the 8/27 law keeps the valley's complexions uniform until he rules,
  so a name may not be read off a face's colour.
- **The name.** The names mix's own rule (heritage, then the given pool and the surname pool by its shares),
  a given name that reads as the face reads, the origin rule above, no name twice.
- **What the face reads as.** Read off the hair and the clothes the look was built from, never the skin:
  the skirt, the poncho (white curtain cut to the jaw) and the short coat (layered fall) read as women; the
  cape, the apron and the poncho read old. PORTRAIT's thirteen share one skull, so the dials (its next round)
  make these read.
- **What they do.** The background the crew screen already gave the man on that face (so his stats and gear
  stay his), Battle Brothers' tier for the two enemy heads, and for the one free face (the long coat) a draw
  off the hire roll of his home.
- **Where they live.** Weighted by the chance Battle Brothers' own book gives that background at each of the 26
  places (who lives where): Cyrus the miner comes from Searchlight, the one place that hires miners.
- **The voice.** The valley's mix (85 / 11.8 / 3.2 per hundred, his 8/26 ceiling) over the fourteen faces that
  are not the player: 12 English, 2 English and Spanish, both of Hispanic heritage. The row asked for a
  Spanglish line from every face; fifteen of fifteen would be all of them against his ceiling of about one in
  seven, and his 9/22 "chill with the Spanglish". His ruling wins over the row. The player speaks English.
- **The mouth.** PORTRAIT's own keys (rest, A, E, O, M), one key a sixteenth at 120 BPM, two keys a syllable;
  every line under nine seconds, because a bark longer than that is a speech.

## 6. THE RULE FOR THE POST (draft, for RUN TWO when the hold lifts)

ONE KEY DRAWS THE MAN. A recruit's face and name come from one person, never two rolls. A starred face at a
post is the person this bank says it is, with his name, his home and his past. A face already on your roster
never stands at a post. Past the free starred faces, a stranger is drawn whole: his name by the names mix with
the sex reading, his face by PORTRAIT's dials when they land, the old sheet face until then. Today that means
one starred stranger in the whole valley (the long coat), which is the honest size of the problem: twelve faces
cannot staff 26 posts, and the dials are the fix.

## 7. THE SCHOOL LINES

[bb faces] Battle Brothers draws a recruit once, as one man: when a hiring slot fills, the game makes one
character, and that one object carries his background, his name, his face (built from his background's own
head, hair and beard pieces, so a beggar looks ragged and a noble groomed), his stats and a short life story.
Two men rarely share a face because the pieces multiply into thousands. This is recall: the library's 06
backgrounds study has no page on it and two web searches this round found no script source, so it stands as
recall, not a citation. BETTER THAN BATTLE BROTHERS: our faces are modelled heads, few and fine, so until the
dials a face IS one person, a rule Battle Brothers never needed; and our man's home is a real place with a real
hire roll, where theirs is the town he stood in.

[ah] A face with a name and a hometown is a missing-person poster; a face that answers to four names is the
uncanny one, the neighbour who is somebody else at every door. The lines carry the genre: the quiet down there
talks back, the trucks that never came back, something up top eats first. The mouth at four syllables a second,
slower than people read, is the stiff stop-motion cadence of the rig's look (rule 115); the game's one and a
half is a tape running slow. Pixels: the talking sheet is PORTRAIT's renders, unedited.

## 8. ROUTED

- RUN TWO: (1) the post (recruitsHere): ONE KEY DRAWS THE MAN, section 6; a face on the roster never stands at a
  post. (2) The crew screen: the crew's names and lines from this bank by face. (3) The talking portrait plays
  the bank's mouth keys at 125 ms. The bank is keyed by the same id as PORTRAIT's manifest.
- COMBAT (ours.json crew, rule 63b): the starting crew's names follow their faces when it is wired (DESI on the
  bare-arms face becomes Amos Ferris); the backgrounds do not move.
- PORTRAIT: the three faces that read as women and the three that read old, for the face spec's dials.
- CHARACTER (the alpha's facePerform and visemesOf, 8/26): one shape per letter-sound at 250 ms is 2.2 times
  slower than the syllable clock; one rule, the old clock deleted, not two (ENGINE SYNC).
- TUNING [recruit odds]: the ten added Hispanic men's names, the sex reading of every given name, the origin
  rule, for the names mix and the one table.
- WORDS: the fifteen lines are attempts; rewrite any of them in tools/bohemia_people_who_the_face_is_lines.js and
  re-run the tool; the gate holds the Spanish and the length.
- DYNASTY [three names]: Minh Duong is a prepared name for the player's slot, reshuffle-able as ruled 9/23.

## 9. PROOF

WHO THE FACE IS 44/0 (gates/who_the_face_is_gate.js), registered; six mutations each red (a face with nobody
behind it, a white man named Amadi, a Spanish word outside the lexicon, Spanish in the player's line, a line over
nine seconds, a man's name on a woman's face). THE NAMES MIX 37/0, WHO LIVES WHERE 27/0, language_gate 85/0, attempt_gate 15/0, REFERENCE CHECK 490/0 (this
bank is not in the language gate's sweep; it reuses its tests). Seen red, not this lane's: no_orphan_script (slices'
bohemia_loading_screen.js), fence_orphan (the alpha's LOOK fences), reusefirst (72 old patch tools). Under the hold: no VOTE item, no demo, nothing live reads the bank.
