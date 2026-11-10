# EYES 11/10 -- THE NEW BUILD WALKED ON A PHONE (rule 441(b), the coordinator's routine 'walk the new build')

WHAT WAS PLAYED: the demo, BUILD 11/9o NO MAN IS SKIPPED ON THE PAGE (main d97cecd3d), served from disk at the real address
(tools/bohemia_eyes_live_session.js, service worker off). Upright 390 x 844: a new game (valley XBN-5WD), Network, THE POT's flyer,
the Mob Museum, the museum's debt fight, THE POT met and killed, the camp, day 2 and planting, El Chino (THE TAP) and the radio
(THE FILTER), a save and a reload. Sideways 844 x 390: the start screen, the barber, Homeless, the hall, a road fight on AUTO and its
end screen. And AUTO on the page with EYES' own tool (tools/bohemia_eyes_auto_on_the_page.js), ten fights on the demo and ten on the
alpha, 1x/2x/4x, a new game's crew and hires. Pictures: records/eyes_walk_11_10/ (12 webp).

A SCRIPTED BROWSER HIDES THREE THINGS HIS PHONE SHOWS (said plainly): the road's events, the boss askers and the places' own cards
switch off when navigator.webdriver is set (slices/bohemia_road_events.js, bohemia_bosses.js, bohemia_place_visits.js; 'on a phone
it always talks'). This walk turned all three on (__ROADEV_ON, __BOSSES_TALK, __PLACE_VISITS_ON) from the Mob Museum on, so it saw
what he sees. Every earlier EYES walk and the AUTO tool met the game without them.

## BROKEN, TO HAND OUT (worst first; rows 548 to 555 FOUND BY EYES)

548. A DEAD MAN'S BODY THROWS EVERY FRAME (COMBAT TWO; big). Once a man falls whose sheet is PACKED, the fight throws 'drawImage: the
   provided value is not of type' about every 2 s for the rest of the fight and on its end screen (THE POT's fight: 12+ throws; the
   demo's ten AUTO fights: 65 throws in 4 of the 10, from THE DECK on). Stack: blitMan (BOHEMIA_FIGHT.html 'if (!idled)
   cx.drawImage(img ...)') from drawBody from draw. WHY: the fight's canvas #cv answers to the SHELL's classes (its element's
   prototype is the top window's HTMLCanvasElement, its context the top window's CanvasRenderingContext2D), so the fight's own
   PackedSheet drawImage wrapper (patched on the fight window's prototype) never runs for it and the raw drawImage gets a
   PackedSheet. Measured in the frame: Object.getPrototypeOf(cv) !== HTMLCanvasElement.prototype; the context's constructor ===
   window.parent.CanvasRenderingContext2D; a fresh canvas made in the fight document is the fight's own. Everything draw() paints
   after the bodies is skipped on every such frame. THE DEMO ONLY: the alpha's 9 AUTO fights threw 0 (its shell does not hand the
   fight its canvas class); not found on 403e823ef's walk (0 errors in 34 fights).
549. THE HOME BASE POINTS AT GROUND HE CAN NEVER STAND ON (HOME BASE). 1,139 of 9,216 blocks grade as plantable; only 199 of them
   (all desert) can be walked onto; the other 940 (692 suburb, 96 commercial, ...) are blocks the phone's BETTER / GO THERE can point
   at, and GO THERE parks the party on the road beside it: tapped three times at (27,41), 'BETTER: 1 BLOCK EAST' every time, PLANT
   HERE refused ('NOT HERE'). And with no plantable block within 6, the page points nowhere (the nearest was 10 away).
550. BEGIN IGNORES A THUMB WHILE THE PICTURE DEVELOPS (RUN, the start screen; small). A tap on BEGIN while it reads '5 OF 6' does
   nothing and says nothing; the button already says BEGIN at full colour. Upright: the first tap 2.5 s after NEW GAME dropped; on
   its side: two taps dropped (0.8 s and ~4 s after NEW GAME), the next one 14 s in went through.
551. A PLACE'S FIGHT COMES HOME AS RAIDERS (FIXES; small). The Mob Museum's COLLECT A DEBT FOR THE FAMILY (three thugs) ended 'THE
   RAIDERS ARE DOWN': the visit's fight hands the spoils screen no foe (theyWere falls to brigands). The same end screen's top line
   has the face and no name.
552. AN EMPTY NAME TAG ON THE MAP'S SPEAKER BOX (FIXES; small). After the boss, 'We're whole. Say the word and we move.' under a blank
   white name tag; the same on 11/8 ('Last of the tape's on...').
553. 'NOTHING STANDS HERE' ON A ROAD (FIXES, words; small). The YOUR PLACE page on an arterial says 'NOT HERE. Nothing stands here.
   Find open ground.' The block is refused because it IS a road (home_base.json never_on), so the words say the opposite.
554. THE HALL ON ITS SIDE CUTS AND SPILLS (FIXES, UI; small). BEST no longer covers the words (535 holds), but the keeper's sentence
   is cut ('Some of...'), two trades are cut ('BRAW...', 'BUTCH...'), and under the retinue man shown open, the next rows and their
   TAKE ON (350, 250) sit below the glass (y 356 and 406 on 390).
555. THE BOSS FIGHT'S QUIET TURNS SAY NOTHING (COMBAT TWO). THE POT at 4x: 8 of his 24 turns were quiet (YOU and DESI, the pistol:
   'reload/end' or 'end' only) and the fight's log holds no 'idle' for any of them; on the same build's road fights the word fired
   for 2 of 3 quiet turns. endTurn's 'idle' is not reached in that fight (another exit, or walkOrBlow reading from the log's start).

## SEEN WORKING

- AUTO ON THE PAGE (rule 435(d)): the demo, 10 fights (a job met on the road, the yards, suburb + strip, the Strip, THE DECK,
  fremont, desert, the casino floor, rail, ...), 230 turns of his: 229 acted; 3 quiet, 2 showed their word. The alpha, 9 fights on 8 boards (yards, suburb + strip, the Strip, THE DECK, fremont, desert, the casino floor twice, rail), 146 turns of his: 138 acted, every quiet turn showed its word (11 of 11), 0 page errors.
  THE POT on AUTO at 4x: won in 32 s, every man acting.
- SCAVENGE in Network (a substation town, one of the seven greyed on 11/8): the lot by finger, Search the lot, the game open in
  1.6 s with 6 spots, LEAVE, 'Four hours. Nothing.' (e12).
- THE FIRST BOSS END TO END: the flyer read by RAUL ('HOT FOOD. ASK FOR THE POT...', GO TO HIS PLACE), his meet card (THE POT AND HIS
  LINE COOKS, KILL HIM FIRST: HIS COOKS BREAK), ENGAGE, the fight, 'THE POT IS DOWN', TIA CARMEN's card (COOK: HEAL YOUR MEN on the
  phone), +26 batteries; the second boss's asker (EL CHINO, THE TAP) and the third's sign (a radio on a pole) after it.
- THE MOB MUSEUM talks (with the flag on): THE DOCENT, TAKE THE TOUR / COLLECT A DEBT FOR THE FAMILY / WALK IN; the debt fight paid
  10 batteries and is remembered.
- THE HOME BASE: PLANT on the phone from day 2, the page grades the ground (WATER, POWER, ROAD, DANGER), 'Are you sure? This is
  permanent.' PLANT HERE / NOT YET, planted on desert at (26,43), GO HOME after.
- THE CAMP: HEAL makes camp, the ring breaks it; the camp keeps running while everyone is whole (a world clock running on PLAY, Battle
  Brothers' way; not filed).
- SAVE AND RELOAD (the tab killed, the link opened, CONTINUE): the block, 312 batteries, THE POT dead, the place planted, the
  museum's debt, the clock, all the same.
- FIXES 11/9n seen on the phone: the end screen whole upright and sideways (525), the barber whole sideways with every row (528),
  BEST off the keeper's words (535).

## HOW, SAID PLAINLY

- Far places by the map's travelTo (the call a tap makes); the sideways fight by the map's encounter message (nfOpen). A plantable
  block was found with the game's own grader (homeProbe and BohemiaHome.grade) after GO THERE looped. My tool tapped the wrong choice
  once (a container's middle: the debt fight instead of the tour); fixed in the walk's helper (it taps the smallest match now).
- The AUTO tool counts COMBAT TWO's 'idle' word as a drawn act from this round (tools/bohemia_eyes_auto_on_the_page.js).
- NOT WALKED: the alpha by hand (the alpha's AUTO run only), night, the flood tunnels and the garage (not shipped), sound.
