# THE WRONGNESS (DIRECTION 2, Paolo 11/2, VAMILY rule 306, ask line 298)

HIS WORDS: "I'm always looking to find ways where everything that we do is this crazy, not even gory, but just like... this
AI slop amalgamation creepypasta horror Crashbox HBO series vibe... make some really good elements or direction for art
for shit like that, for real."

Read inside: the analog horror law (rule 20, the bible records/BOHEMIA_ANALOG_HORROR_BIBLE_9_20_26.md, its AI-slop strand),
the act-one ghost law (laws/BOHEMIA_ADDENDUM_ACT1_AMALGAMATION_IS_A_GHOST_7_24_26.md), the purple law (7/10) and rule 301
(Crashbox: clay and puppets inside a broken handmade computer, rusty tin robots). Made: 15 elements, 20 pictures, in
slices/wrongness/ with slices/wrongness/wrongness.json. VOTE card: direction-the-wrongness-11-2. Tool:
tools/bohemia_direction_the_wrongness_11_2_26.py.

## WHAT THE WRONGNESS IS
- The uncanny, never the gore. An ordinary thing in an ordinary place with ONE detail that is off (the bible's rule 1). A
  sign with a letter turned round. A poster smiling too wide. Mannequins that turned round since you last came.
- In act one the player calls it a ghost. It is the machine. Every piece LOOKS like the mistakes a machine makes when it
  copies people (one arm too many, a face smeared sideways, writing that almost reads, a face that is everybody) but
  nothing ever says machine, data or computer. At the end of act one the player lines the pieces up and gets it.
- THE ONE FACE. Every haunted face in act one is the same face: the average of 15 of the valley's own faces (the rig's
  faces, 15 bare heads, measured, listed in the data file). Nobody and everybody. It is on the smiling poster, the test
  card, the tin robot, the glass in a fight and the poster that changed. The reveal at the end of act one is the player
  seeing it was one face the whole time, and that a face which is everyone's average is what a machine makes.
- Crashbox (rule 301) lives in the materials: clay-looking heads, a rusty tin robot, a dead screen showing a test card.

## WHAT IT IS NOT
- Never gore. No blood, no wounds, no bodies in this set. The old red poster's red is faded to old ink on purpose.
- Never a jump scare. Nothing pops, flashes, stings or zooms. No sound marks it. The camera never looks at it (rule 2).
- Never cheap AI slop in OUR art. The wrongness is made on purpose, by hand, inside the world, one thing at a time, from
  his own packs and our own people. The machine's mistakes are DRAWN; the drawing is never a machine's mistake.
- Never red text, zalgo letters, colour splits, glitch filters or "!!!" (the bible's rules 5 and 8). Static only lives
  inside a screen that is in the world (the test card).
- Never explained in act one. Nobody says what it is. Anyone who knows is dead, gone or not talking.

## THE RULES
1. ONE AT A TIME. Never two wrongness pieces on one screen. Never in the first minute. Never on a fight's first turn.
2. RARE, THEN LESS RARE. It grows through act one in five beats (each piece carries its beat and its rarity in the data):
   - B0 THE FIRST HOURS: nothing at all until the first town is done.
   - B1 A DETAIL (things you could miss): about one in five days. The sign that almost reads, the man with three arms,
     the light that is red three times, the shadow that falls the wrong way.
   - B2 IT CHANGED (you notice because you came back): about one in three days. The poster that shows someone else, one
     more flyer than last time, the man who left his sign, the mannequins that turned round.
   - B3 IT KNOWS YOU (your company is in it): about one a day. The flyer whose face slid, the smile on the wall, one too
     many in your feed photo, the loading picture that gets closer.
   - B4 IT IS IN THE CAMP (where you sleep and fight): up to two a day. The test card at camp, the tin robot with a
     face, a face in the fight's glass.
   - THE THRESHOLD (the end of act one): purple appears for the first time, on the hatch only. The faces line up.
3. CHANGES HAPPEN OFF SCREEN. A two-state piece changes between two visits, never while you look at it.
4. PURPLE ONLY AT THE THRESHOLD. Not one piece in this set carries purple (measured: 0 pixels on all 20 pictures, by the
   purity gate's own check and at full size). The test card's magenta bar is BLACK: the one colour missing is the one the
   machine owns, and the player only learns that when the hatch glows. Purple stays the Amalgamation's alone and scarce.
5. THE LIGHT WAS IN THE ROOM. The night picture is the day picture times the measured night (0.30, 0.33, 0.43 a channel,
   from the camp's own day and night plates). The only glow is a screen, and a screen is its own light.
6. DIRECTION PLACES NOTHING. The data file says where each piece goes; the coordinator hands the placements out.

## WHERE EACH PIECE GOES (draft:true, every number his to change)
| piece | where | beat |
|---|---|---|
| the flyer whose face slid | a town wall | B3 |
| the poster shows someone else now (2 visits) | a town wall | B2 |
| the smile on the wall | a town wall, casino towns | B3 |
| the sign that almost reads (DO ИOT ENETR) | a road event, a town street | B1 |
| one more flyer than last time (2 visits) | a home town's wall | B2 |
| the man on the sign has three arms | a town street, a fight-board blocker | B1 |
| the man left the sign (2 passes) | a road event, a town street | B2 |
| the mannequins turned round (2 visits) | a shop on the settlement screen | B2 |
| the test card at camp | the camp | B4 |
| the tin robot with a face | the camp | B4 |
| a face in the glass | the fight's glass, one beat | B4 |
| one too many in the photo | the feed | B3 |
| it gets closer every time it loads (3 loads) | the loading screen | B3 |
| the light that is red three times | a road event | B1 |
| the shadow that falls the wrong way | a town street | B1 |

## HOW IT WAS MADE AND CHECKED
- Cut from his packs (reference/art_bank: the WANTED flyer, the torn poster, four warning signs, the monitor, the robot,
  the traffic light, the street lamp, the tan wall tile) and our own people and ground (settlement_people, camp_two). No
  new renderer: pixels moved, mirrored, swapped, erased with the sign's own paint, recoloured; the faces printed in the
  poster's own ink (every face pixel takes a pixel of the twin whose light-and-dark rank matches).
- Compared to the world (the 9/4 law): records/target/direction_wrongness/compare.png lays each piece at one art pixel to
  one phone pixel beside its pack twin and a man of the 112 box on the camp's own ground.
- The art card (skills/bohemia-pixel-art/scripts/check.py) on each piece AND its twin: 9 pieces to DIRECTION's eye; 2
  BACK (the three-armed sign, the red light) whose untouched twins are BACK on the same card, so it is the family's band,
  not the edit; 4 have no card (people, a glass overlay, a photo, a loading picture). All in wrongness.json.

## THE FEEL, FROM REAL THINGS (to feel, never to copy; no video game)
1. ANALOG HORROR SERIES: LOCAL 58 (Kris Straub, YouTube, from 2015). A dead TV station's calm emergency broadcasts and
   test cards. The lesson: the institution's calm voice is the horror. Our test card and our signs speak that calm.
2. CREEPYPASTA: CANDLE COVE (Kris Straub, 2009; Channel Zero: Candle Cove, Syfy 2016). Adults remember a puppet show from
   childhood; it turns out the broadcast was only static and the kids saw something else. The lesson: a children's show
   remembered wrong, which is exactly Crashbox's clay, puppets and tin. And for the machine face itself: LOAB (2022), the
   woman who kept coming back in AI pictures nobody asked for. One face that persists is the AI-slop creepypasta.
3. FOUND FOOTAGE: MARBLE HORNETS (YouTube, 2009 to 2014). A tall figure stands in the background of ordinary footage,
   closer each time, and the camera never notices. The lesson: the extra one in the feed photo and the figure on the
   loading screen; it is never pointed at.

## WHAT IS LEFT
- Placements: the coordinator hands each piece to the lane that owns its screen (town wall and street: the settlement and
  world lanes; road events: the map lane; feed and loading screen: UI; fight's glass: COMBAT; camp: CAMP).
- The in-fiction names the people use for the haunting stay his (the ghost law's pending line).
- Sounds for any of it: none on purpose. If one is ever added it is a room tone that stops, never a sting.
