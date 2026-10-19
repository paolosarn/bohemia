# PEOPLE [ask the crowd] WHO-ARE-YOU-ON-THE-STREET (10/19/26, people-ask-crowd)

Row (written by the lane from its own jump list, rule 74): every person you tap in a place's crowd spoke as
SOMEBODY ON THE STREET, for ever, and there was no way to ask, while the people engine's own ruling is A NAME IS
EARNED, NEVER GIVEN (nameOf returns null for a stranger until he is asked). PURPOSE: the people of a place become
people you can come back to. Constraint: the player never speaks Spanglish; ONE ID, ONE WHOLE PERSON; Battle
Brothers first, then ours. And the coordinator's line this round, rule 120(d) (Paolo 10/18, LOCKED: 'the portraits
don't even look alike, Black people looking like white people'): a name, a face and a body are one person, so hand
PORTRAIT and CHARACTER any person whose name, face and skin disagree.

WHERE HE SEES IT: the demo, any town, tap somebody standing in the crowd by the stall. VOTE tab, card
`people-ask-the-crowd-10-19` (four phone shots of one person in HENDERSON: a stranger, you ask, the next visit at
night, and a new face on market day still a stranger), slices/vote/PEOPLE_ASK_THE_CROWD_10_19.webp.

## WHAT WAS BUILT

1. **The street person is a person.** slices/BOHEMIA_SETTLEMENT_SCREEN.html (RUN TWO's screen; four small changes,
   told in the handoff): a crowd person carries their spot in the crowd (`slot`), and the sheet keys them by place and
   spot (`crowdKey`), never by the draw order. Before, the key was the person's index in the y-sorted list of keepers
   and crowd together, so night (the crowd halves) or market day (six more) handed the same key to somebody else.
   Each spot draws its own six dice, so the person at a spot wears the same look at every visit: 144 of 144 measured.
2. **'Who are you?'** under every stranger, in English (the player's words, his first votes). The answer is the one
   roll (engine/bohemia_names.js) at `crowd:<place>:<spot>` with the face's reading, said in their own mouth: five
   English lines that say the whole name ("Name's Kyle Wexler. Been on this corner since the lights went out."), and
   one Spanish line ("Soy Lupe. Lupe Zamora, pa' que sepas.") only from somebody of a Hispanic background, a third
   of the time. draft:true.
3. **The place remembers.** `bohemia.met.v1` (the screen's own save, the same way the bag and the relations bar
   save), the game is told (`post('met', {who, name, look, heritage, skin})`) and can hand it back (`open({met})`).
   The next visit the bubble over the mouth says the name and the question is gone. A person never asked is still
   SOMEBODY ON THE STREET.
4. **The names roll reads the street's faces.** The crowd wears any of 25 looks, and 13 of them (the faction looks)
   had no reading, so a man's face could get a woman's name. Twelve are now read off the face the speaker shows (the
   sheet's 64 until PORTRAIT's fresh one); faction_anarchists stays unread on purpose (a hood on the face, long hair
   on the body, nothing honest to read).
5. **The skin travels with the name, both ways.** Every roll now carries `skin`, a band of the ITA scale
   dermatology reads skin by, dealt from the person's own key inside their background's range (MIX.skin, draft:true,
   PORTRAIT's and TUNING's to move); its own dice stream, so no name moved (the twelve on the 10/18 sheet still roll
   the same). And a caller that already knows a person's skin passes it (`roll(key, {sex, skin})`): the background is
   then the census weighted by how often that band falls in each background's range (Bayes), so the name always fits
   the skin, and over a valley whose skins are dealt the county's way the backgrounds still come out the county's
   (20,000 drawn: white 36.0, Hispanic 32.5, Black 13.2, Asian 12.1, mixed 6.3; 20,000 of 20,000 fit). No caller passes
   a skin yet, so nothing on screen changed; it is waiting for CHARACTER's [one skin, one person].
6. A small bug fixed on the way: a face handed by the game while a street person was talking reopened a building
   called 'person' (`openB('person')`); it now reopens the person.

## MEASURED ON THE REAL SCREEN (tools/bohemia_people_ask_the_crowd.js, 26 places, a phone at 390x844)

| | |
|---|---|
| crowd people at the 26 places (day, no situation) | 93 |
| reachable by a finger | **80** (13 covered by a nearer person, see ROUTED) |
| a stranger with 'Who are you?' on first tap | 80 of 80 |
| asked (all but the last at each place) | 54 |
| answered with the roll, the name in their own line | 54 of 54 |
| the name reads as the face (man or woman) | 54 of 54 |
| later visits, night and market day | 232 of 232 right (named if asked, a stranger if not) |
| the same spot wore the same look | 144 of 144 |
| a new session (page reloaded) | 80 of 80 right |
| different names among the 54 | 53 (two Casimir Hargroves, in different towns) |
| backgrounds of the 54 | Hispanic 19, white 17, Asian 10, Black 6, mixed 2 (county 33/36/13/12/6) |
| page errors | 0 |

## PROVES US WRONG

**The skin belongs to the outfit, so no face can be right.** Rule 120(d) reads like a portrait problem. It is not.
Measured (tools/bohemia_people_skin_measure.py, records/people/THE_FACE_IS_THE_BODYS.json, sheet
records/people/THE_FACE_IS_THE_BODYS.png):

- **All 26 bodies wear ONE skin**, rgb 191,175,166, ITA 73.5, "very light". The body rig paints every person, every
  look, the same pale grey-beige.
- **The 12 fresh cast portraits are 6 dark and 6 brown; none is light.** YOU's is light.
- So **25 of 26 looks wear a face 2 to 5 bands off their own body.** That is his sentence exactly: a Black face on a
  white body. The one that agrees is YOU (one band apart).
- And it cannot be fixed per look: each look is worn by about 20 different named people of every background
  (cast_satchel: 15 white, 7 Hispanic, 2 Black, 1 Asian). **The name fits the face's skin for 39 of 98 men at the
  posts, 69 of 146 keepers and 22 of 54 street people asked.** Bending the names to the faces would leave **no white name
  at any post or keeper's door at all** (no cast face is lighter than brown, and a white background's range stops at
  tan) in a county that is 36% white, undoing his 9/21 ruling ('a little more percentage of white people
  names... keep it natural'). Bending the faces to the names is impossible while a face
  belongs to a coat.

**DECIDED (rule 113f, the reason with the ruling):** the names stay the county's (his 9/21 ruling stands, no name
moved). The skin moves to the person, not the coat: CHARACTER's [one skin, one person] (claimed this round, 'the body's
skin is the truth') gives each person one skin value; the body and PORTRAIT's face paint from it, and the name reads
it (`roll(key, {sex, skin})`, Bayes over the census), so a name, a face and a body are one person and the valley stays
the county. Where CHARACTER has no value yet, the roll's own `skin` band is a draw of the county's mix it can start
from. That is how Battle Brothers does it: a background picks a man's head and body from its
own set and his name from its own list (Blazing Deserts' southern backgrounds draw names, bodies and heads from one
southern set; recall, not in our library, marked), and the armour is gear on top. The outfit is clothes; the skin is
the person.

## HAND-OFF (rule 120(d)): every look whose face and body disagree

Body band is the one shared body skin; face is what the speaker shows (PORTRAIT's fresh portrait, else the sheet
face). "Bands apart" counts on the six-band ITA scale.

| look | body | sheet face | fresh portrait | bands apart | also |
|---|---|---|---|---|---|
| cast_longcoat | very light | dark | dark | 5 | |
| cast_barearms | very light | dark | dark | 5 | body long black hair; portrait a short coil |
| cast_pack | very light | dark | dark | 5 | |
| cast_skirt | very light | brown | brown | 4 | |
| cast_widebrim | very light | dark | dark | 5 | |
| cast_cape | very light | intermediate | brown | 4 | sheet face and portrait disagree too |
| cast_apron | very light | tan | brown | 4 | |
| cast_poncho | very light | tan | brown | 4 | |
| cast_bedroll | very light | dark | dark | 5 | |
| cast_shorts | very light | brown | brown | 4 | |
| cast_satchel | very light | dark | dark | 5 | |
| cast_shortcoat | very light | dark | brown | 4 | |
| faction_caravans | very light | dark | none yet | 5 | face a cap, grey at the sides; body a bucket hat over long black hair |
| faction_colorful | very light | tan | none yet | 3 | face long hair under a black cap; body red beanie, short hair |
| faction_anarchists | very light | dark | none yet | 5 | face a hood; body long blonde hair (left unread) |
| faction_blues | very light | dark | none yet | 5 | |
| faction_homeless | very light | tan | none yet | 3 | face beanie and stubble; body long blonde hair |
| faction_church | very light | intermediate | none yet | 2 | face blonde bob; body grey cap over long black hair |
| faction_reds | very light | dark | none yet | 5 | |
| faction_cartel | very light | brown | none yet | 4 | |
| faction_trades | very light | dark | none yet | 5 | face long white hair; body cap |
| faction_mob | very light | tan | none yet | 3 | |
| faction_network | very light | dark | none yet | 5 | face curls; body short black hair |
| faction_volunteers | very light | dark | none yet | 5 | face magenta hair; body black |
| faction_remnants | very light | dark | none yet | 5 | |

**What each lane does with it:**
- **CHARACTER (the bodies; [one skin, one person] is yours and running):** the skin is one constant across the rig's
  26 bodies. Your per-person value is the truth; hand its ITA band to the names (`BohemiaNames.roll(key, {sex, skin})`)
  and the name fits it with the county's mix intact. If you want a county-true starting value per person,
  `BohemiaNames.roll(key).skin` is one (the five backgrounds' ranges in MIX.skin). Until the bodies change, the gate
  below holds the count where it is.
- **PORTRAIT (the faces):** the 12 cast heads hold no light skin, and the county is 36% white. Render each head in the
  person's band, not the look's (the head is the person's, the hat and hair are the look's); the thirteen faction
  heads next on your board come in all six bands. A face is a person's, never a coat's.
- **ANIMATION** draws slices/settlement_people (the bodies on the settlement screen): the same skin ramp when
  CHARACTER lands it.

Gate: gates/ask_the_crowd_gate.js leg D re-measures the skin from the files every run; the committed record must be
today's, no look may newly disagree with its body, and the count may never grow past 25 of 26. It can only shrink.

## THE SCHOOL LINES

[bb people] Battle Brothers names a place's few leading people (its elder, its council, a noble's relative), keeps
them across contracts, and leaves everybody else nameless: an event's 'old man' never has a name (dev blog,
'Progress Update: Map, Faction Leaders'). Ours goes one better and stays honest to the engine's ruling: anybody in the
crowd is nameless until you ask, and once you ask, they are somebody for ever. And BB's background ties name, head and
body to one set; ours now ties name and skin to one roll.

[ah] Analog horror: the stranger's 'Who are you?' is the most ordinary question in the valley, asked on a street
where nobody has papers since the dollar died. The name comes back in their own voice on the beat, and the next time
the bubble remembers them when nothing else in the valley keeps a record. A name you had to ask for is the one human
thing on a street of static.

## GATES

- ASK THE CROWD (gates/ask_the_crowd_gate.js), registered: A the screen is wired, B the roll (1,000 crowd keys:
  backgrounds within 4.5 points, Hispanic reading within 5 of 33.4%, name reads as face 1,000 of 1,000, the skin inside
  its range, no name moved), C the real screen measured (the record's numbers and that it is today's roll), D rule
  120(d) the debt can only shrink, E the page and the VOTE item. Six planted defects each red (keyed by draw order, a
  name given before asking, the met not saved, a white range that takes dark, a face read wrong, a roll that ignores
  the skin it is handed); the control green.
- THE NAMES WIRED IN 66/0 (one new leg: the street's read faces are real street looks read m or f), THE NAMES MIX
  38/0, WHO THE FACE IS 46/0.

## ROUTED

- **RUN TWO** ([each man his own skin] is yours, the coordinator's sweep BB: the crowd's keys are `crowd:<place>:<spot>`,
  the keepers' `keeper:<place>:<building>`, the post's `post:<place>:<week>:<slot>`; pass the man's skin into the same
  roll and his name stays his face's). And (the screen is yours; four changes told: `slot` on a crowd person, the met save and `open({met})`, the
  'Who are you?' sheet, the face handler reopening a person): **13 of 93 crowd people can never be tapped**; the crowd
  stands 46 picture pixels apart (16 screen pixels at a town's 0.35), and `personAt` gives the nearest the eye, so a
  person a nearer one covers has no point on the glass (THE STRIP #1, THE TRUCK STOP #2, THE CHAPEL #3, DOWNTOWN #1,
  THE PARK #3, THE BLOCK PARTY #1 and #3, HENDERSON #3, BOULDER CITY #2, HOOVER DAM #1, PRIMM #1, PAHRUMP #3,
  MESQUITE #2). A wider spacing or a tap that cycles through the people under the finger reaches them all.
- **CHARACTER** and **PORTRAIT** and **ANIMATION**: the hand-off above.
- **DYNASTY**: the heir's skin can follow the parents' bands now that a person carries one.
- **TUNING**: MIX.skin's weights are a draft.
- **MODS**: MIX.skin and MIX.faces are content, in the one block.
- **The coordinator**: rule 120(d)'s gate for the face against the body now exists as leg D (a debt that can only
  shrink, 25 of 26); PORTRAIT's face-against-body gate can read records/people/THE_FACE_IS_THE_BODYS.json.
