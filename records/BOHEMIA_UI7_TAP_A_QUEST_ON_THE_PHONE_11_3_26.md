# UI 7: TAP A QUEST ON THE PHONE, YOUR PEOPLE GO (rule 376, the phone's half; Paolo 11/3; ask line 404)

## HIS WORDS
"I should be able to click the quest on my phone and my people auto move towards it... Auto zooms in as much as I can too just so
it looks cooler as you walk through the city... when you get to quest you hop on the settlement... if multiple markers... it will just
take me to the closest one." (records/BOHEMIA_PAOLO_TAP_A_QUEST_TO_GO_THE_KILL_CAMS_AND_HEAVY_ARMOUR_11_3_26.md)

## THE SPLIT (rule 376(6))
WORLD 8 built the map's half as ONE CALL, window.BOH_TRAVEL_TO_QUEST(questId) in the map's frame (slices/bohemia_quest_travel.js,
gate gates/tap_a_quest_your_people_go_gate.js): the road, the nearest marker by the road's minutes, the close camera, the settlement on
arrival. UI 7 made the phone's quests the button that calls it. Neither file was touched by the other lane; the map's travel code is
unchanged.

## MEASURED BEFORE (the demo at e0151f96b)
- The phone shows a quest in three places: the job's card in the column under the screen (a held job), the feed's strip when it shows
  the post of a job he took ('the Night Shift took the job off the board at Church'), and that post on the feed's page.
- A tap on the card only made it PLAY's job (the amber bar on its left). Nothing moved until PLAY. The strip and the page's posts
  only opened the feed.
- The offers board of the old phone (two best-paid jobs) is still in the page but hidden (rule 227: the phone shows the jobs he is
  on, never the offers), so it is not a place a quest shows.

## WHAT CHANGED (slices/bohemia_phone.js, __TAP_A_QUEST_YOUR_PEOPLE_GO__)
- EVERY QUEST ON THE PHONE IS A BUTTON. The job's card (a finger or Enter; its X keeps its own tap); the strip while it shows the
  post of a job he holds (its go-mark at the corner; otherwise the strip still opens the feed); the post of a job he holds on the
  feed's page (its go-mark at the right).
- A TAP CLOSES THE PHONE TO THE MAP: an open page closes; in a town the town's own LEAVE (one handler, P.leave); at a camp the map's
  own BREAK CAMP (a camp in a town, then its LEAVE). Then the map's one call: WORLD 8's BOH_TRAVEL_TO_QUEST(id). Before that call is
  on a page, the map's own way to a job (P.jobGo: mapPlayToJob, else a tap's travelTo), so the tap works either way.
- OUT OF A TOWN, ONE CAMERA AT A TIME: the map fits his jobs in view a moment after LEAVE (650 ms, 350 ms after it); the call waits
  for that fit to finish, so WORLD 8's close camera never pulls against it. Measured upright: 1.36 s from the tap in a town to the
  call, the party's first block about 2.7 s after the tap. On the map the call is at once.
- THE MARK: the quest he is going to wears it from the tap until that road ends: the card's arrow (or its dot, when he stands on it)
  turns the PLAY bar's amber and beats on the 120 BPM beat; the strip's and the page's go-mark beats. The road ending takes it off
  (there, a road's card, a fight, his own tap elsewhere on the map: no journey, or a journey to somewhere else). A hunt's pack moves
  and the map re-aims the walk at it: the mark holds while the road still leads to one of the quest's own places
  (BohemiaQuestTravel.places). Measured on the demo: a road's card (raiders on the carts, the wolves coming to meet him) often stops
  a trip inside its first two blocks; the mark comes off with it, as it should.
- A NO SAYS SO: a call the map refuses (no road, nowhere to go) or a road's card up (ENGAGE or FALL BACK first) shakes the card twice;
  nothing moves.
- NOTES stays gone (rule 357(a)); nothing of it came back.

## GATE
gates/tap_a_quest_on_the_phone_gate.js (new), on the demo, a new game, upright and on its side, WITH A FINGER: T1 a finger on the
job's card in the start town closes the town and WORLD 8's call is what sent him; T2 THE PARTY MARKER STARTS MOVING (his block
changes inside 5 s); T3 the tapped card and only it wears the amber mark while he is on that road; T4 the mark comes off when the road
ends; M on the map the same; S the strip showing his job's post is that job's button; F on the feed's page his job's post is a button,
the page closes and he goes; B without WORLD 8's call the tap still sends him; N no NOTES; C1 nothing threw. PLANTED: a map that
answers no road (T2 catches it), a plain mark (T3 catches it).
Re-aimed: gates/the_phone_gate.js (a tap on a card now also sets off; the leg stops him and still sees PLAY go to the picked job).

## THE SCHOOL LINE
[bb Battle Brothers: a contract's scroll on the world map's corner is the button; click its destination and the company walks there
on its own with the clock running. Ours: the job's card on the phone in your hand is that scroll, and one tap is the walk.]
[analog horror: the card you sent them to pulses amber on the beat like a tracker's dot on a handheld, and goes dark the moment the
road ends.]
