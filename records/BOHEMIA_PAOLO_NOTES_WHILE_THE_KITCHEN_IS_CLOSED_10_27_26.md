# HIS NOTES WHILE THE KITCHEN IS CLOSED (rule 296: no cooking until 10/31, the coordinator only listens and records)

Every note he gives while nothing is built lands here, in his words, with what it means, in order. When the chats cook again
these go out FIRST, in this order, before anything else on any lane's list.

## 1. TOP PRIORITY: A TOWN OPENS ON NOTHING BUT BROWN (playing build 10/27e, his day 3)
His words: "Bro, it's a big issue... I'm on day three... I pull up to the... I've tried to get into two settlements and refused
to show me the map other than like Brown type shit so yeah, super important."
What it means: he arrived at two different towns; the settlement screen opened but showed only brown, no town picture (no
buildings, no people). The game cannot be played past the first town like this.
Suspects to measure first (nothing was looked at; the hold stands): the coordinator's settlement-screen changes in builds
10/27b, c and d (slices/BOHEMIA_SETTLEMENT_SCREEN.html: the phone's own ground pad, padGround()'s ground pattern now drawn as the
backdrop, frameFit's new fit, townComp() picking towns[name].tall_left / tall_right, the four towns redrawn in 10/27d). Brown
everywhere is what the screen paints when the ground pattern is drawn and the town picture never lands (a picture that did
not load, a fit that puts it off the glass, or a scale of zero). Check which two towns, on his phone size, from a day-3 save.
Owner when the kitchen opens: COORDINATOR (it broke on his changes), EYES to confirm on the phone. Ask line 248.

## 2. NOTE 1 AGAIN, WITH MORE: THREE TOWNS NOW, AND THE TOWN IS THERE UNDER THE BROWN
His words: "Yeah bro, I tried to enter three cities now and it's just showing like a brown screen. It's annoying. Like if I click
around randomly like I can accidentally click the characters that are on the map, but I can't see them. It's just all brown like
I could I could buy equipment and shit. It's weird."
What it means: every town he enters (three of three) is all brown, BUT the town works under it: a blind tap still finds a
keeper or a person, and the shops sell. So the town and its taps are fine and SOMETHING BROWN IS DRAWN OVER ALL OF IT, people
included; this is not a picture that failed to load (the people are drawn on their own and they are hidden too).
First suspect, from that: the phone's own ground pad (padOf / padDraw in slices/BOHEMIA_SETTLEMENT_SCREEN.html, builds 10/27b-c)
drawn the size of the whole glass instead of the phone's corner (a phone rect that is missing, zero or 'away' read as the whole
screen; the wide column mode taken when it should not be; a pad that runs to the glass edges on every side), or the ground
pattern drawn after the town instead of under it. Measure padOf's rect on his phone size in a real town before changing
anything. Still TOP PRIORITY, still the coordinator's own break. Ask line 248.

## 3. THE WEEK OF PLAYTESTING, IN ONE MESSAGE (Paolo, back with credits; 'don't do anything yet')
His words, the parts that are jobs (full message kept in the session transcript):
- "https://www.instagram.com/halfbraindev ... a good example of an Instagram account going viral, making reels talking about the
  progress of their game... I would really like that too"
- "I'm so impressed... everything just needs to look graphically better... even just everything itself could go famous like viral
  like just from the UI... the demo is damn near like right around the corner. I just would want it to be cleaner have a little
  more quest to do everything's pretty buggy"
- "on the map... our player character... if they're coming up to a four-way intersection for them to go all the way to the right
  they'll go to the north street and then go to the east street... they won't go through the intersection when they walk"
- "a graphic system where it recognizes the overlays... if I'm in the street during combat mode and there's a house one tile
  beneath me south of me... if that house is a one or two or three story house then it would cover up like the legs of my
  character... the layers of this 45 degree combat model"
- "more maps... it got pretty boring... we need way more maps, way more combat maps"
- "some settlements... when you add the phone system... I wanted it to look organic... There's nothing really clickable
  underneath the phone but still like I just wanted the city or the settlement to look more organic. It feels just like you kinda
  just didn't give a fuck... I'm not a big fan"
- "last Sunday when I was testing for the whole day, I used a week worth of usage in one day... I need your support... I don't
  want more bugs... cheaper less quality code is gonna start fucking with everything... I want our usage this week to be very
  efficient, if it's powerful but it just takes longer... efficient token wise"
- "more enemy types... a lot of the graphic stuff are placeholders and that's OK"
- "I pull up on the remnant and they just have like better gear and better recruits to buy and I like a lot of it" (KEEP)
- "the perks have more like eighth grade level reading translation... they needed icons like logos for some time now"
- "the UI to be consistent and transform into each other whenever things happen... not a big fan of like things just disappearing
  and looking ugly"
- "all our balls rolling down the hill... I don't think we're missing any if you wanna think about any blind spots"
- "Do you have any questions for me before you get started again? I want this to be a very efficient week."
What each is, and who owns it when the kitchen opens (ask lines 249 to 258):
249 REELS: a tool that records clean vertical clips from the game's own camera (no debug, no stamp) for progress reels; we make
    them, he posts. RUN + DIRECTION.
250 THE MAP WALK GOES THROUGH AN INTERSECTION: the party marker's road path turns up one street and over the next instead of going
    straight across a four-way; the route must take the straight line through the crossing. WORLD.
251 THE FIGHT'S LAYERS: on the 45-degree fight board a house one tile south of a man covers his legs (one, two or three storeys by
    the house's height); every person and roof drawn in depth order. COMBAT [fight looks].
252 WAY MORE FIGHT MAPS: many more boards, seeded from the map cell (rule 'no two combat boards are the same'). COMBAT + COOK.
253 THE TOWN AROUND THE PHONE LOOKS ORGANIC: the plain pad behind the phone reads as careless; the phone's corner must be part of the
    town (a real empty lot, a cracked parking lot, a plaza edge), drawn into the picture, still nothing tappable under it. AMENDS
    rule 292's 'plain ground'. COORDINATOR (it is his own work) + COOK; the ten held towns (held_ten_towns_10_27_26.json) are
    re-judged against this before they ship.
254 THE EFFICIENT WEEK (rule 297): powerful but slower, never cheaper code; few chats at once; his playtest notes batched, not one
    job per sentence. COORDINATOR.
255 MORE ENEMY TYPES (the bestiary floor, ~75 types). FACTIONS + COMBAT. Placeholders stay OK.
256 PERKS IN EIGHTH-GRADE WORDS, AND PERK ICONS (owed a long time). WORDS + UI.
257 THE UI MORPHS: every screen change transforms, nothing just disappears (rule 229, MOTION). UI + MOTION.
258 MORE QUESTS, AND CLEANER (fewer bugs) before the demo. RUN + EYES.

## 4. SOCIAL MEDIA IS PLANNED TOGETHER; EVERYTHING FROM BEFORE GETS ATTEMPTED; MORE OF EVERYTHING, AND PUNCHY
His words: "chill out anytime when it comes to social media shit we form a plan together you don't just jump at a hat and say what
you're gonna help me do... I know we had more jobs than that... around last Sunday bro I talked to you for like three days... make
sure you have attempted to implement everything I even talked about from before... more cleanup more polish more of pretty much
everything... the demo is pretty much ready to be live. I think it's very not polished a little glitchy buggy kind of vibes more
graphic assets... the startup screen kind of sucks of choosing like your own adventure... there's not really a tutorial system...
we haven't even implemented any main quest yet which is gonna be important too. I'm not super happy with the feel of combat yet.
I'm not super happy with the phone buttons. I feel like there should be more buttons on the phone, especially during combat... the
phone's not fully folded up and you still have the bottom left of the screen for the characters... why can't they just go on the
phone... all the real estate has to be justified... for people that like look at awesome visuals that look punchy... Nothing feels
punchy yet, satisfying punchy, not from the music to the combat to the walking around the city to the camp shit... Don't do
anything yet just reply to me. Ask me questions if you want."
Jobs (ask lines 259 to 267):
259 SOCIAL MEDIA IS PLANNED WITH HIM FIRST (rule 298): no reel, post or account work is offered or made until he and the coordinator
    form the plan together. AMENDS line 249 (the reels tool waits on that plan).
260 EVERY ASK FROM BEFORE GETS ATTEMPTED: the 258-line ask list measured 11/2: 139 seen working by EYES, 28 half, 7 seen with a hole,
    24 not shipped, 8 not seen, 11 new, the rest not checked or queued. Every line not SEEN gets a real attempt this week. COORDINATOR.
261 THE START SCREEN (choosing the origin, the 'choose your own adventure') is redone: it sucks. UI + RUN.
262 A TUTORIAL: the game teaches itself in play (rule 32a: nothing pops up, a face says it). RUN + WORDS.
263 THE MAIN QUEST, implemented: none exists in the game yet. DYNASTY (story) + RUN (in the game); QUESTS stays research only.
264 THE FIGHT FEELS GOOD: the feel of combat, not yet. COMBAT [fight feel] + TUNING (research).
265 THE PHONE IS THE CONTROLLER IN THE FIGHT: more buttons on the phone; the crew portraits in the bottom-left move ONTO the phone;
    the phone folds fully; every pixel of the screen earns its place (rule 293). UI + COMBAT.
266 PUNCHY EVERYWHERE: hits, music, the walk through the city, the camp: satisfying feedback (impact, sound, shake, timing). COMBAT,
    SOUNDS, MOTION, CAMP.
267 MORE GRAPHIC ASSETS across the board, cleanup and polish, fewer bugs before the demo goes live (placeholders OK meanwhile). COOK
    lanes, EYES, PLUMBER.
