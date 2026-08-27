# ADDENDUM — THE PLAYTEST DISPATCH (Paolo 8/25/26, LOCKED)
# He played the run and filed ten things at once. Every one is a ruling.
# This is the second big dispatch (the first was 7/29's BIG MISSING) and
# it is treated the same way: recorded verbatim, routed by owner, nothing
# put back to him as a question.

## HIS FRAME, AND IT IS THE MOST IMPORTANT LINE IN THE FILE
> "I KNOW WE MADE EVERYTHING REALISTIC AS FUCK EVEN THE TIMING OF THE
> CITY BUT I REALLY DO BELIEVE I MAY BE AT A TURNING POINT BECAUSE WE
> NEED TO MAKE THIS GAME FUCKING FUN."
> "NOT A SINGLE LOOT IDEA OR ENEMY AROUND LIKE IM JUST WALKING RN THROUGH
> AN INCOMPLETE PIXEL CITY. WEVE COME A LONG WAY BUT THERES SO MUCH
> FARTHER WE NEED TO GO."
**REALISM FIRST (8/4) SAYS THE REALISTIC OPTION WINS BY DEFAULT AND THAT
REALISM IS SACRIFICED ONLY FOR FUN, AND THAT THE TRADE IS HIS. HE JUST
MADE THE TRADE.** From here, when realism and fun collide, FUN CARRIES
THE TIE unless he says otherwise on a specific item. That is not a
loosening of the realism law; it is the clause inside it firing for the
first time, by the only person allowed to fire it.

## 1. THE WALL CHANGED UNDER HIM, AND THE FEATURE HE THINKS WE HAVE DOES
## NOT EXIST
> "IN THE RUN WTF IS GOING ON HERE WITH THE SOUTH PART OF THE BUILDING
> THE WALL CHANGES I HOPE THATS NOT FOR ME WHEN IM SUPPOSED TO BE BEHIND
> A WALL FACING THE CAMERA AND ITS SUPPOSED TO BE THE WALL OPCAICITY"
TWO SEPARATE THINGS, AND THE SECOND ONE IS THE FINDING:
(a) **A BUG.** Two frames of the same spot, and the south building's wall
    tiles are a different pattern in each. In the second frame HIS FACE
    IS ALSO A BLANK WHITE BLOCK. Reproduce before touching anything.
(b) **THERE IS NO WALL-OPACITY SYSTEM IN THIS BUILD.** I checked: nothing
    fades, ghosts or cuts away a wall when the player is behind it. He
    believes we have it. WE DO NOT. That is a feature to build, and it is
    a real one for a ¾ view game where the camera is on the south side.
**BOTH ARE RULED IN: fix the flicker, and BUILD the wall fade.**

> ### CORRECTION, 8/26 (WORLD lane) — (b) WAS WRONG, AND HIS WORDS SAID SO
> **THE WALL-OPACITY SYSTEM EXISTS.** `__XRAY_WHOLE_BUILDING__` has been on the
> walked surface since **8/3**, on his own ruling that day ("the building should
> become see through", "Building should be absolutely transparent"). MEASURED on
> the real page: it fires on **60 of 60** trials standing behind a wall in the
> district he spawns in. The line above — "I checked: nothing fades, ghosts or
> cuts away a wall" — checked the wrong thing and then routed a lane to build
> something that already existed.
> **HIS SENTENCE ALREADY SAID IT**: *"I HOPE THAT'S NOT FOR ME ... AND IT'S
> SUPPOSED TO BE THE WALL OPCAICITY."* He is not reporting a missing feature. He
> is asking whether the thing he just watched change was the wall opacity, because
> it looked like a bug. **(a) and (b) were never two items. They were one.**
> WHAT WAS ACTUALLY WRONG: all three fade rules were BINARY — 1, or WALL_SEE, or
> XRAY_A, decided fresh every frame with nothing between — so **a wall crossed
> 0.65 of alpha in a single footstep**. A hard step in opacity as you walk IS a
> flicker; there is no other way for it to read. Fixed 8/26 with a ramp in space
> and an ease in time: worst single-frame change 0.11, and it is gated.
> THE LESSON IS THE ONE THIS REPO KEEPS RE-LEARNING: **a negative result is a
> claim about your instrument until you have shown the instrument could have seen
> a positive one.** "I checked and it is not there" needed a positive control.
> Gate: `gates/wall_fade_gate.js`

## 2. THE QUESTS ARE NOT IN THE WORLD, AND THE FEED ART IS UNREADABLE
> "THE QUESTS ARE SO BAD AND NOT WIRED TO ANY LOCATIONS OR PEOPLE IN THE
> CITY. AND THE ART FOR THE QUEST LOGS IS SO FUCKING BAD WHEN ITS ON MY
> FEED... I CANT TELL WHAT THOSE SHITS ARE!"
(a) **A QUEST THAT IS NOT ATTACHED TO A PLACE AND A PERSON IS NOT A
    QUEST.** Wiring quests to real locations and real named people is
    now demand-side, not [PENDING].
(b) **THE TEXT-CAM ASCII PICTURES ARE DEAD.** The little line-drawing
    "community art" blocks on the phone feed are unreadable and he has
    said so twice. They go to the graveyard. What replaces them is his
    call on look, but NOT ASCII.

## 3. HAIR: GO LOOK AT REFERENCE, IN ALL EIGHT DIRECTIONS
> "THESE HAIRSTYLES ARE NOT FUCKING CUTTING IT WHY CANT U JUST TELL THE
> ART CHAT OR WHATEVER OR THE CHARACTER CHAT TO FUCKING LOOK ONLINE FOR
> PIXEL HAIRSTYLES IN ALL 8 DIRECTIONS AND WE CAN GO FROM FUCKING THERE"
**REFERENCE FIRST, FOR HAIR, IN ALL EIGHT FACINGS, BEFORE ANY MORE
COOKING.** This is the same instruction that made the districts good
(research-first) applied to the one system that has been cooked blind for
weeks. Gather real pixel-art hair reference across all 8 directions,
study what those artists actually do at the back and the three-quarter,
put the reference beside our styles, THEN cook. No more variants off the
top of anybody's head.

## 4. STREETS MUST CONNECT LIKE LEGO — A STANDARD, NOT A CASE-BY-CASE FIX
> "IM SICK OF PLAYING THIS RUN AND NONE OF THE STREETS CONNECT EVER! YOU
> NEED A FUCKING STANDARD AWESOME WAY TO MAKE SURE IF ITS A STREET. IT
> WILL CONNECT ART WISE AND PATHWISE TO OTHER STREETS WE NEED A
> STANDARDIZED WAY YOU PLACE STREETS IN PERFECT MATCHING COORDINATE LIKE
> CONSISTENT PUZZLE PIECES AND LEGO BLOCKS SO FUCKING BE IT BUT THAT
> NEEDS TO HAPPPEN"
**THE STREET CONTRACT IS NOW LAW.** Every street piece declares its
connectors on all four edges — lane count, lane centre offset, sidewalk
width, kerb line — and a piece may only be placed where every touching
edge AGREES. Art and walkable path are the SAME contract, not two
systems that happen to line up. This is the socket-and-stud rule he
asked for in his own words, and it is machine-checkable, which means it
gets a gate that sweeps every placed street in the valley and fails on a
single mismatched edge.

## 5. THE CITY IS DEAD AND DEAD IS NOT THE DEFAULT
> "IM WALKING THROUGH THE CITY I THINK I SAW ONE WATCH PERSON ON ACCIDENT
> ... THE CITY SEEMS DEAD ASF AND I DONT LIKE THIS BEING THE DEFAULT I
> KNOW WE HAVE A SLIDER AND SHIT BUT YEAH MAN"
**THE DEFAULT POPULATION GOES UP.** A slider existing is not an answer; a
default is a design decision and ours is wrong. He should meet people
without trying.

## 6. THE ACTION BUTTON IS NOT THE CITY BUTTON
> "I HATE THAT THE ACTION BUTTON IS THE CITY BUTTON I WANT TO CHANGE
> THAT I SCROLL OUT AND SCROLL INTO THE CITY NOT BY CLICKING THE ACTION
> BUTTON"
**ZOOM IS THE WAY IN AND OUT OF THE CITY VIEW. THE ACTION BUTTON DOES
ACTIONS.** One gesture, continuous: pinch/scroll out far enough and you
are in the city view; scroll back in and you are on the street. The
action button never changes what it means. Also ruled by implication: it
must not FORCE him into the city at a zoom step he did not ask for.

## 7. PERFORMANCE
> "THE GAME KINDA RUNS LIKE SHIT I KNOW ITS NOT REALLY OPTIMIZED"
Already measured by RUN at 24.2 seconds to first play on throttled 4G,
already demo-blocking. His report is the second witness. Frame rate while
walking zoomed out is now on the same row.

## 8. ENEMIES, BIOMES, AND LOOT — THE TURNING POINT
> "WE NEED MORE ENEMIES IN THE GAMES I NEED YOU TO DO RESEARCH ON ALL THE
> TYPES OF ANIMALS THAT LIVE IN THE DESSERT AND WOULD THRIVE IN A CITY
> WITH MILLIONS OF CORPSES AND SHIT... WE HAVE THIS VALHEIM IDEA OF
> BIOMES AND LEVELED BIOMES IN THE CITY AND SHIT WITH DIFFERENT DEGREES
> OF DIFFICULTY OF ENEMIES WITHIN AND SHIT AND THE SEED GENERATION KINDA
> LIKE VALHEIM HAS THAT"
Three rulings in one:
(a) **THE VALLEY GETS A BESTIARY**, and it is built from real Mojave and
    real carrion ecology. Research delivered the same turn:
    records/BOHEMIA_RESEARCH_WHAT_LIVES_IN_A_CITY_OF_CORPSES_8_25_26.md
(b) **DISTRICTS ARE DANGER TIERS, VALHEIM-STYLE.** Difficulty lives in
    THE PLACE, not in a level number on the player.
(c) **LOOT EXISTS.** Right now there is not one loot idea in the build.
NOTE THIS COMPOSES WITH SEED-1 (sweep 20): his Valheim seed law and this
are the same engine.

## 9. THE UI LANE — HE ASKED, AND THE ANSWER IS YES
> "SINCE WE ARE MAKING THE DEMO SOON IDK IF ITS TIME TO MAKE A UI CHAT? I
> REALLY CARE ABOUT THE UNIQUNESS OF MY GAME AND I NEED TO START WORKING
> ON HOW ALL THE BUTTON AND EVERYTHING IN THE WORLD WILL LOOK AND CRAFT
> THIS BOHEMIA LOOK BY MYSELF WITH YOU. ITS UNIQUENESS AND SAY. YEAH
> THATS BOHEMIA VIBES."
**YES. THE UI LANE EXISTS AS OF NOW.** First word "ui". It owns every
pixel the player touches that is not the world: buttons, cards, panels,
the phone chrome, type, the HUD, the feed. It is a LOOK lane, not a
plumbing lane — the run lane keeps owning what buttons DO. Its first job
is not a component library, it is THE BOHEMIA LOOK: one page of the
vocabulary (shape, weight, corner, colour, type, texture, how a thing
looks pressed) that he reacts to and edits, because he said he wants to
craft it WITH me, not receive it.

## 10. ANIMATIONS AND FACES
> "I KNOW WE NEED TO WORK ON FIXING THE ANIMATIONS AND SHIT, ALOT OF THEM
> ARE KINDA FUCKED. WE NEED NEW ONES. AND SINCE THE BEGINNING WE HAVE
> NEVER TOUCHED THE FACE CUSTOMIZATION FOR THE CUSTOMIZED PORTRAITS OF
> PEOPLE. WE NEED TO GET BACK ON THAT."
**BOTH REOPENED.** Animations get an audit-and-recook pass. FACE
CUSTOMISATION has never been built and is now on the board.

## WHAT THIS DISPATCH DOES NOT DO
It does not reorder the demo. The demo build, the front door, the ending
and the instrument (laws/BOHEMIA_ADDENDUM_THE_DEMO_IS_ITS_OWN_LINK_
8_25_26.md) still come first — because most of the ten above are exactly
what a demo is judged on, and shipping them into a build with no front
door helps nobody. Where an item IS demo-critical it is marked so in the
backlog rows.
