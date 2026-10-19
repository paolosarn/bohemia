# EYES AND EARS: EVERY FACE BESIDE ITS BODY (10/19/26, rule 120(d))

Row: [every face beside its body] (VAMILY, EYES AND EARS), claimed eyes-opus-10-19.
His words, 10/18 23:45: "the portraits don't look like the people... Black people looking like white people"
(records/BOHEMIA_PAOLO_THE_COMBAT_IS_STILL_ASS_GUNS_FIRST_THE_AURA_AND_THE_FACE_IS_THE_BODYS_10_18_26.md).
EYES reports; PORTRAIT and CHARACTER fix (the row's constraint).

## THE ANSWER, IN ONE LINE
He is right, and it is not one bad portrait: EVERY BODY IN THE DEMO IS PAINTED THE PLAYER'S OWN SKIN. The fight,
the map's street and the settlement all draw their people from bakes that ran with the player's default palette row
(porcelain, #bfafa6), while every face is rolled per person. 118 faces in the demo read beside the body the game
draws for the same person: 3 PASS (all YOU), 115 BACK; 103 of the 115 are 3 to 5 skin shades apart (the case he saw:
a dark face on a pale body), 12 are 2 apart. The alpha's CHARACTER tab: 13 of 13 PASS, because its crowd panel picks
body and face from one roll: the fix already exists in our own code.

## WHAT WAS READ (off the pictures, never a manifest)
| where he meets it | the face | the body | read | PASS | BACK | 3+ shades off |
|---|---|---|---|---|---|---|
| THE CREW SCREEN, man by man (RUN TWO's roster) | PORTRAIT's new portrait of the look the crew screen gives him | the fight body of the look the fight gives him | 12 | 0 | 12 | 11 |
| THE FIGHT (turn strip and HUD), our 12 cast looks + YOU | the fight sheet's own 64 face | the same sheet's body | 13 | 1 (YOU) | 12 | 11 |
| THE FIGHT, the 13 gangs | the fight sheet's own 64 face | the same sheet's body | 13 | 0 | 13 | 12 |
| THE CREW AND SCAVENGE SCREENS, the 13 new portraits | PORTRAIT's new portrait | the fight body of that look | 13 | 0 | 13 | 12 |
| THE SETTLEMENT (keepers, men on the street) | its talking face (new portrait, else the fight face) | slices/settlement_people/<look>.webp | 25 | 0 | 25 | 24 |
| THE MAP'S STREET (his speech bubble), 40 people round the start | faceFor via ctFaceAsk, answered by the demo shell | ctBody(p,'S'), the body the street draws | 40 | 0 | 40 | 33 |
| THE MAP PAD (YOU) | #modeFace | PLAYER_CV.S | 1 | 1 | 0 | 0 |
| THE PHONE STRIP | act one, two, three faces | act one: his map body; acts two and three: no body anywhere | 1 + 2 | 1 | 0 | 0 |
(The shade counts are ITA bands. The demo was the committed tree, BUILD 10/18c, at 390 x 844 at 3x, BEGIN tapped, 0 page errors.)

THE ALPHA (CHARACTER tab, read off its own canvases by the same live tool): YOU's body and face are the same skin
(#bfafa6 both, PASS). THE CROWD BOARD: its 12 bodies are painted in 7 different skins, and each one's talking face
(faceFor of the same id, its own ramp) is THE SAME SKIN, 12 of 12, colour for colour (#31261f, #76604e, #41332a,
#5e4a3b, #937357, #9a7b5e, #251c18, the same seven the street's faces use). THE ALPHA ALREADY DOES IT RIGHT, there:
alpha ~line 20961, the crowd panel sets skinTone from NPC_FACTORY.npcFrom(id) and G.faceAs from faceFor(id) before it
paints, so one id picks the skin for the body and the face. The 17 family bodies are all porcelain; their faces are
not drawn on that tab and were not read.

## THE CAUSE (three skins for one man)
1. THE BODIES: tools/bohemia_fight_people_bake.js (COMBAT, rule 69, 10/4) and tools/bohemia_settlement_people_bake.js
   (ANIMATION, 10/9) paint with famPaintBody, which reads the alpha's global skinTone; the bake never sets it per look,
   so all 26 fight bodies and all 25 settlement bodies are SKIN_TONES[1] porcelain, #bfafa6, pixel for pixel (read off
   the cheeks of every sheet; the one colour of 32 to 95 of the window's pixels each). The city's street cast
   (citySendCast / withLook) does the same: withLook never sets skinTone.
2. THE FACES: faceFor(id) rolls a tone from the person (NPC_FACTORY skinToneName, families blended), and faceRampFor
   draws it; its own comment says "a face and its skin must come from the same roll or a person changes race between
   the body and the portrait". The face side kept that promise; the body side never asked.
3. THE NEW PORTRAITS: PORTRAIT sampled each look's skin from the fight sheet's 64 face (records/portrait/rig/crew/
   *_head.json, portrait_*_skin), so 11 of 13 land within one shade of that face, which was never the body's. The rig
   BODIES those heads sit on carry ONE skin for all 13 (crew_*_skin = linear 0.305 0.162 0.098, a mid brown), so on the
   rig a head and its own neck and hands disagree too (data, not on any screen).
4. YOU: his pale face and body agree on the fight, the map pad and the phone strip; his new portrait reads 2 shades
   darker (L 59 on the lit cheek against 73): the one face whose body is known goes BACK to PORTRAIT.

## AND A SECOND DEFECT: THE CREW SCREEN GIVES A MAN ANOTHER MAN'S FACE
engine/bohemia_roster.js manOf() gives crew man i the look fight_people.json's cast order picks (i mod 12); the fight
gives the same man ours.json people_looks.crew[i]. The two orders differ, so 10 of 11 crew men show one look's face on
the crew screen and fight in another look's body (DESI: the bare-arms man's face, the long-coat man's body; RAUL: pack
and bare-arms; TINA: skirt and wide-brim; BOOKIE: wide-brim and poncho; OSO: cape and short-coat; CHEWY: poncho and
cape; LUPE: bedroll and pack; GRIZ: shorts and satchel; DEUCE: satchel and skirt; NENA: short-coat and shorts).
Only MARISOL (apron) and YOU agree. Even after the skins are fixed, these ten would still be two people.

## HOW THE SKIN IS READ (tools/bohemia_eyes_every_face_beside_its_body_10_19_26.py)
- CIELAB (D65) and the ITA angle, the dermatologists' skin-tone measure: ITA = atan((L* - 50) / b*) (Chardon,
  Cretois and Hourseau 1991; six bands, Del Bino et al. 2006: very light > 55, light 41-55, intermediate 28-41,
  tan 10-28, brown -30-10, dark < -30). PASS: the same or the next band, and 12 L* or less apart.
- A body: all looks are baked on the same 112 rig, so its face is the window 8 to 17 rows under the top of the head,
  5 columns either side of the head's middle; the skin is that window's one most common colour, with every colour the
  hat or hair is painted in (3 or more times in the top 4 rows) left out.
- A flat face (the 64s): the mouth is the reddest run in the lower head; the skin is the most common colour on the
  cheeks between the eyes and the mouth; the painted gradient behind the face is dropped row by row.
- A 3D portrait: the eyes and jaw from the face's own moving shots (THE STAR IS THE BAR's landmarks, imported); the
  skin the median of the LIT HALF of the cheeks.
- CIEDE2000 (Sharma, Wu and Dalal 2005) for the hair or hat, PRINTED, NOT JUDGED: the read can not tell a hat from
  hair (a capped body beside a rolled face, which never draws a hat, reads 20 to 33 apart on the alpha's own matched
  crowd), so it is a number in the JSON for PORTRAIT. The new portraits' hat is judged from the worn list against
  PORTRAIT's manifest: 13 of 13 agree.
- ONE MAN, ONE LOOK (the crew rows): judged.
- BUILD is not read: a portrait is head only (his 9/27 vote), so the body's build is not in it. Named, not invented.

## CONTROLS (--selftest, 11/0)
A body passes itself; a dark face on a pale body and a pale face on a planted dark body (Monk-dark #3a2a22 painted
over the exact skin pixels) both go BACK, 5 shades and 54 L* apart; one shade step darker (14 levels) still PASSES;
the body window reads #bfafa6, the palette row the bake painted; ITA bands at L 70 / L 30; CIEDE2000 equals Sharma's
published pairs 1 (2.0425) and 17 (27.1492) to four places; the new portrait's cheeks are found.

## MY OWN MISTAKES, CAUGHT BEFORE THE SHEET
1. The first head finder took the hair's crown for the neck (the 64 faces widen fast at the top), so 9 faces read
   near-black (L 3): the neck is now the narrowest row BELOW the widest row.
2. The mouth finder on bodies found a red hat (Colorful) and a skirt (the skirt look) and lost five capped heads to the
   shoulders: bodies now use the fixed face window, proven on the zoomed heads of all 26 looks.
3. A plain median of a 3D cheek is mostly shadow under the rig's one hard light (YOU's cheek runs L 32 to 67): the read
   is the lit half, which is how an eye reads skin.
None of the three changed a verdict's direction: with the first reads, 38 of 39 already went BACK.

## ROUTED
- CHARACTER [one skin, one person] (OPEN, first on its board): the bodies are the cause. One skin per person in the
  data, read by famPaintBody in all three bakes (fight people, settlement people, the city cast); the pattern already
  exists in the alpha's crowd panel. Then COMBAT and ANIMATION re-run their bakes (their tools, their sheets).
- PORTRAIT [the face is the body's face] (OPEN, first): YOU's new portrait 2 shades darker than his body; the 12 cast
  portraits copied the fight faces' rolled skin. Once CHARACTER's skin file lands, the faces follow it.
- RUN TWO: [eyes: one man, one look] bounce-back on its board: the crew screen and the fight must give a man the same look.
- COORDINATOR: the card eyes-every-face-beside-its-body-10-19 is in the registry, untagged; the honest sentence for
  him is that every body is painted his skin.
- Re-read after any fix: python3 tools/bohemia_eyes_every_face_beside_its_body_10_19_26.py (files) and
  node tools/bohemia_eyes_every_face_beside_its_body_10_19_26.js (the live demo) first.

## WHAT THIS ROUND DID NOT READ (round two, on this row)
The alpha's CUTSCENE (openFace), COMBAT (the old duel portraits) and RUN (the run's portrait bakes) tabs, and the
family cards' faces; the hall's hire cards and the board's clients (no body in the settlement for them); the fight's
rig-made people if a later cut puts them in (none in BUILD 10/18c's fight sheets). And the re-read after CHARACTER's
and PORTRAIT's fixes land.

[bb Battle Brothers paints a brother's head, face and hands from one skin pick on one sprite, so this never happens there.]
[analog horror: a face that is not its body is the uncanny kind nobody chose; the wrong kind of wrong.]
