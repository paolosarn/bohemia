# SCAVENGE: THE DESIGN FOR HIS YES (11/7/26)
Lane: SCAVENGE (rule 421(a), one DESIGN round). Rules 326, 331 (with its correction), 334; ask lines 324, 330, 333, 482.
NOTHING IS BUILT IN THE GAME. This page, one stand-in picture and one VOTE card. Rule 331: "nothing is built until he says yes."

## FOR PAOLO (five lines)
1. One game, three ways in, on the same block you would fight on: tap a house, sweep open ground with the detector, or drain a car.
2. It is the old Dead Shot Dial. A house: tap when the needle hits the middle. The detector: no colours, you tap when the beeps turn into one long tone. A car: hold, and let go on the ONE.
3. Dead centre gets the best thing there, the edges get less, a miss gets nothing. One find per spot.
4. One spot takes 5 to 6 seconds; a whole block is under a minute. It is the fight's screen with the phone saying SCAVENGE: nothing scrolls, no new pages.
5. In the VOTE tab: YES builds it, NO stops it, or type what to change in the box.

**THE ONE QUESTION: what should each of the three give you?**
- **A (the real one, my lead):** what the place really holds. A house gives food, meds or tape. A metal detector only hears metal, so the ground gives batteries, rounds or tools. A car gives gas, which you sell for batteries. Dead centre gets the rarer one.
- **B:** all three give the same five things by luck; dead centre just makes batteries likelier.
- **C:** one thing each: houses give meds, the ground gives batteries, cars give gas.

---

## 1. WHAT HE SAID (the only source of this design)
- Rule 326 (Paolo 11/2): 'maybe even a mini game... it'll take place in the same map as the combat map but you're scavenging the block, the part of town... in the city there's a thing you can click, you can scavenge for a couple hours... the cutest funnest mini game possible... it has to work with the different parts of the world, the different maps... something that would not be a lot of tokens'.
- Rule 331 (Paolo 11/2): 'this is the perfect opportunity to bring back the Dead Shot Dial game'. CORRECTED, LOCKED: 'OK, so no. Search houses, the detector, the siphon: these are the only ones I liked... I can see them being things that happen in this singular game we're making, depending on the map, but somehow involving some rhythm-based game working in the Dead Shot Dial... This is a big deal, don't go gung ho wasting my tokens on unapproved ideas.'
- Rule 334 (Paolo 11/2, research, low priority): 'our crew, whoever is in it, you'll see them on the screen... a really fun mini game that makes you feel like you're scavenging on the rhythm... depending on the map... awesome and unique... but super fun'.
- Ask line 324, his pick: (1) search houses, (2) THE DETECTOR: 'walk the yards, the beep quickens near a cache, dig on the beat', (7) THE SIPHON: 'hold to draw gas from each car, let go before a mouthful'.

## 2. WHAT IS NOT IN IT (rule 331: not approved, so not designed)
No noise meter. Nobody comes. No hours per search. No chain. No greed. No district loot tables. No new places to start it from, no new currencies, no events, no story beats.
THE CLOCK IS UNTOUCHED: the SCAVENGE button that ships today (WORLD 9/29, RUN TWO 10/18) spends four hours for one try. This design adds no time and takes none away; whether an outing should cost time is the coordinator's to raise with him (his own 326 words say 'a couple hours'; rule 331 lists the hours as unapproved). Until he rules, a build keeps what the button does now.
KEPT FROM WHAT ALREADY SHIPPED, because removing it would itself be a change he did not ask for: ONE THING OR NOTHING per find (WORLD's call 1 in engine/bohemia_scavenge.js, from EVERYTHING COSTS ONE), and THE BLOCK'S COUNT (WORLD's call 3: a block holds a finite number of things, each find takes one, an empty block says picked clean).

## 3. RESEARCH: HOW THE BEST RHYTHM MINIGAMES INSIDE BIGGER GAMES FEEL (findings, not references; nothing is copied, no game becomes a reference)
- **Gears of War's active reload.** A marker runs along a bar with a thin perfect zone inside a wider ordinary zone; outside both the reload fails. A hit pays (faster, a damage bonus), a miss costs (a jam, a slower reload); you SEE the perfect land (the rounds flash). [Giant Bomb](https://giantbomb.com/wiki/Concepts/Active_Reload), [Gfinity](https://www.gfinityesports.com/article/more-games-should-build-on-gears-of-wars-active-reload-mechanic). OUR READING: the dial already IS this shape (ember inside amber inside blue); the lesson is the paid-off perfect and the visible flash, both of which the dial has.
- **Hi-Fi Rush.** 'Carrot more than stick': off-beat actions still work, on-beat actions earn more; the director put accessibility first. [Press Start](https://press-start.com.au/?p=142818), [Ungeek](https://ungeek.ph/2023/02/hi-fi-rushs-core-gameplay-mechanic-took-a-year-to-develop-explains-director), [Unreal Engine interview](https://www.unrealengine.com/en-US/developer-interviews/hi-fi-rush-was-inspired-by-shaun-of-the-dead-and-futurama). OUR READING: an off-beat tap still lands wherever the needle is (amber or blue, never a punishment); the beat only puts the middle on the ONE, so the rhythm is the help, not the gate.
- **Rhythm Heaven.** Sound over sight: timing told by audio cues, button alone was enough, and every press answered clearly; at its best you can play without watching. [Iwata Asks](https://iwataasks.nintendo.com/interviews/wii/rhythmheavenfever/0/0), [Rhythm Tengoku](https://en.Wikipedia.com/wiki/Rhythm_Tengoku), [VGC](https://www.videogameschronicle.com/features/2026-rhythm-heaven-groove/). OUR READING: the detector is the dial played by EAR (the bands hidden), and the press is one tap anywhere on the glass.
- **Yakuza's karaoke.** A short rhythm game inside a crime game, loved as a breather between fights, and it pays real money. [Inverse](https://www.inverse.com/article/26656-yakuza-0-minigames-karaoke), [PSU](https://www.psu.com/news/playstation-mini-games-players-cant-stop-playing/), [Game Rant](https://gamerant.com/sega-yakuza-series-best-worst-minigames/). OUR READING: scavenging is the breather on the same board as the fight, and it pays in the game's own goods; it stays short.
- **Phones lag.** Touch and audio delay differ per phone (a reported 165 ms on one), Bluetooth adds more; rhythm games on phones ship a calibration. [Deemo wiki](https://wiki.biligame.com/deemo/%E6%A0%A1%E5%87%86), [Rhythm Quest devlog](https://ddrkirby.com/rhythm-quest/devlog/10.html), [Godot forum](https://forum.godotengine.org/t/rhythm-game-has-a-165-ms-delay-running-on-mobile/133858). OUR READING: the old dial already carried a SYNC offset and an ear-lock (V25); a build keeps both, and the detector also SHOWS each beep (the needle tip flares), because many play on mute.
- **THE REAL WORLD, the detector.** Detectorists swing the coil at a steady pace, about two to four seconds a pass; the signal peaks over the target, and they slow down and cross it to pinpoint. [Minelab](https://www.minelab.com/treasure-talk/tracking-motion-and-sweep-speed-part-2), [Kellyco](https://support.kellycodetectors.com/en-US/how-do-i-pinpoint-a-target-215966), [Tesoro manual](https://www.manualslib.com/manual/1017133/Tesoro-Cibola.html?page=10). OUR READING: the needle IS the coil's swing; his 'the beep quickens near a cache' is our translation of the peaking signal onto the 120 grid (one beep a beat, then two, then four, then one held tone), honest about being a translation. A detector hears METAL: that is option A of the question.
- **THE REAL WORLD, the siphon (THE FINDING THAT PROVES US WRONG).** Most cars since the late 1990s have a mesh or a rollover ball valve in the filler neck that stops a hose ([Jalopnik](https://jalopnik.com/2060324/why-gas-cant-siphon-out-of-modern-cars/), [Preparedness Advice](https://preparednessadvice.beehiiv.com/p/siphoning-gasoline-newer-vehicles-without-damaging)), and untreated gasoline goes stale in months (the sources here are thin; general knowledge says three to six). So 'a full can from every car' is not real: an old wreck's tank is varnish, and a 2050 car is likely electric. NOT DECIDED HERE (it would be an extra): it is a lore and economy fact for the coordinator to route (DYNASTY: how long since the dollar died; ECONOMY: what gas is worth). The design's dial does not change either way.
- **[bb] HOW BATTLE BROTHERS DOES IT.** Battle Brothers has no scavenge minigame: loot comes after a fight and from its places, and a search inside a world event is settled by a hidden roll. OUR SWAG: the roll becomes his thumb on the beat. This is ours, not a copy.
- **[analog horror] THE LOOK AND THE SOUND AT THE SOURCE.** The house's needle is one torch beam in a dark room; the detector's beep is a real recorded detector, a little worn like tape; the gas is real liquid into a real can (NO SAND: real material). No horror events are added: they would be extras.

## 4. THE DESIGN

### 4.1 Where it is played
The SCAVENGE button that ships today opens THE BLOCK'S OWN BOARD (COMBAT TWO's: rule 407(g), slices/bohemia_street_board.js plan/lay, the same board a fight there would be laid on) with NO enemies, instead of rolling at once. The camera comes down the way it does for a fight (MOTION's zoom, rule 407(b)). The whole crew stands on the board (rule 334: 'whoever is in it, you'll see them').

### 4.2 The map picks the spots
Read from the board's own tiles (the plan's kind per tile), never a list:
| the board's tile | the spot | why |
|---|---|---|
| house, trailer | SEARCH | a house to search where there are houses |
| yard, lot, dirt, ruin, desert, plaza, apron | DETECTOR | the detector on open yards and lots |
| a road tile the map left a dead car on (the plan's car flag, drawn as car_kerb / car_lane) | SIPHON | the siphon where there are cars |
HOW MANY: as many as the block's count still holds (WORLD's stock), never more than SIX lit at once (six is what a phone reads at the fight's zoom), shared by what the board is made of, at least one of each kind the board has. A suburb block lights mostly houses; a desert lot mostly the detector; a street of wrecks the siphon.
**MEASURED (records/scavenge_design_11_7/cars_on_784_boards.json, count_cars.js):** the map's own plan for 784 blocks across the valley, 27 kinds of ground: every board has houses (783) and open ground (784), and ZERO carry a dead car. The street kit has the car pieces and the lay code puts one wherever the plan flags a car, but the plan's flag never fires. Until it does, THE SIPHON APPEARS ON NO BLOCK. Routed to COMBAT TWO (its file, not mine; a note, not a fix).

### 4.3 What he does with his thumb
| | SEARCH A HOUSE | THE DETECTOR | THE SIPHON |
|---|---|---|---|
| the thumb | ONE TAP, anywhere on the glass | ONE TAP, anywhere on the glass | HOLD, then LET GO |
| what he reads | the bands, like the fight's shot; the needle is his torch | NO bands; he hears the beeps fill in (and sees the needle tip flare on each beep) | the needle climbing from the edge a gulp a beat |
| the right moment | the needle in the middle, which lands on the ONE | one long tone, which lands on the ONE | let go on the ONE, the needle in the ember |
| too soon / too late | the needle off the middle: less | off the tone: less | early: a little; late, past the middle: 'a mouthful', nothing |
| the old dial's input it reuses | the shot (tap) | the shot, bands hidden | the press, hold and release (greed's input, WITHOUT greed: no speed-up, no x3) |

Tap a lit spot, the nearest free man walks there (a glide, a tile a beat), the dial opens over him on the next downbeat. One dial at a time; the others stand where they are, on screen. LEAVE any time.

### 4.4 What the dial does (the code in the alpha, read, not changed)
The motion engine is the ONE canonical BohemiaEngine block stamped into the frozen fight (inside the alpha as COMBAT_B64, "dead eye dial combat"): 52 patterns; PAT_DIFF 1 to 4; the five packages EASY, NORMAL, HARD, VERY HARD, BOHEMIAN (PKG_TIERS {1:[1,2], 2:[1,2,3], 3:[2,3,4], 4:[3,4]}, EASY a hand-picked nine at 19% slower); PHASE parks every pattern's middle on a DOWNBEAT and every cycle is a whole bar (V68), so a blind press on the ONE is a centre; 120 BPM fixed (BPM_MS 500); the needle swings LIM 60 degrees each side; the zones are hZ 0.05, vZ 0.12, hitZ 0.26 radians, all x ARC_MULT 1.11 (centre about 3.2 degrees each side, amber 7.6, blue 16.5). The press is graded PERFECT within 55 ms, GOOD within 110 (V69).
THE RESOLUTION CONTRACT (engine/bohemia_engine.js CombatBridge): beginShot(request) then resolve(id, {outcome: killshot | hit | miss, zone, greedMult, patMeta}), and resolveHeadless for an off-screen roll by package odds.
FOR SCAVENGING, the same engine and the same contract, three ways:
- THE HOUSE: unchanged. zone kill = DEAD CENTRE, vital = AMBER, hit = BLUE, miss = OUT.
- THE DETECTOR: unchanged motion and zones; the drawing hides the bands, and the sound is a function of the needle's distance from the middle: further than the blue edge one beep a beat, inside the blue two, inside the amber four, inside the ember one held tone. Every beep sits on the 120 grid (quarters, eighths, sixteenths), so the fill-in IS the rhythm.
- THE SIPHON: the needle is driven by the hold instead of a pattern. Press and hold: the draw starts on the next beat; the needle glides from the edge and reaches the middle on a downbeat; let go and the zone where it sits is the result. The package sets the gulps: EASY two bars, NORMAL one bar, HARD one bar with the pattern's shake, VERY HARD and BOHEMIAN half a bar with the shake. At NORMAL (60 degrees in 2.0 s) the base windows around the downbeat are DEAD CENTRE +-106 ms, AMBER +-254 ms, BLUE +-551 ms (before the dial's own forgiveness).
greedMult is always 1. The beat grade is shown (PERFECT / GOOD) and pays nothing extra (no chain).
THE DIFFICULTY: the package is the game's difficulty setting, the same one the fight would use. Nothing else changes it.

### 4.5 What he gets (the four results; WHAT THING is THE ONE QUESTION above)
| the dial | the find |
|---|---|
| DEAD CENTRE (ember) | the best thing that spot holds |
| AMBER | an ordinary thing |
| BLUE | scraps (the loot you sell, which already exists) |
| OUT | nothing; the thing stays in the block's count for the next time |
Always ONE thing or nothing (EVERYTHING COSTS ONE). The find flies from the man to the bar; no prose pops up (a quest is people, places and things).

### 4.6 How long, in real seconds
Walk 1 to 2 s (a tile a beat, 0.5 s). The dial 2 to 4 s (one or two bars; after four bars, 8 s, he gives up: OUT). The find 1 to 2 s. ONE SPOT: 5 to 8 s, about 6. SIX SPOTS: 35 to 50 s. A whole block under a minute.

### 4.7 How it fits the phone (rule 402 amended: smaller and denser, never pages, never a scroll)
No new screen: the fight's screen, the board filling the glass, the dial the fight's own size over the man. The phone's plate (the same frame) says SCAVENGE and holds three short rows (HOUSE xN, GROUND xN, CAR xN; the one being played lit), one row of small FOUND icons, and LEAVE. No sheet, no pager, nothing over half the glass. The press is anywhere on the glass, so a thumb never has to find a button on the beat. Upright and sideways the same as the fight.

### 4.8 What a yes would cost to build (honest, not a plan to start)
Reuses: the dial engine (lifted out of the stamped copy into one engine module, as rule 331 already planned, so the fight's important shot can use it later), COMBAT TWO's board, the crew's own rigs, the bar's icons, the SCAVENGE button and WORLD's count. New: three props in a man's hands (a torch, a detector, a hose and can), each a golden piece first (rule 408(b)); three real recorded sounds (a detector's beep, gas into a can, a drawer). The gates it would need: every lit spot's tile is its kind; the middle lands on a downbeat in all five packages for all three; one thing or nothing; nothing scrolls on the phone both ways and the laptop. A siphon also needs COMBAT TWO's cars on the boards (4.2).

## 5. THE LOOK (the one picture)
records/target/SCAVENGE_THE_DESIGN_FOR_HIS_YES_11_7.webp, four phone frames (1 the map picks the spots, 2 a house, 3 the detector, 4 a car), marked STAND-IN. HOW IT WAS MADE: the demo opened on a phone (390 x 844 at 3x), a fight started through the demo's own door on a real block (cell 80,60, its board laid from the map, 74 houses), the three enemies taken off and the fight's two cards hidden, three of our men set at a house, a road and a yard, photographed with the fight's own camera. Drawn over it as a stand-in: the lit spots, the old dial in its own proportions and colours, the phone's SCAVENGE plate, and a dead car (the fight's own cover_car_kerb piece, because no board carries one: 4.2). The sources are kept in records/scavenge_design_11_7/ (shoot_spots.js, mock.html, render.js, count_cars.js).
VOTE card: scavenge-the-design-for-his-yes-11-7 (stage stand_in; a stand-in carries no options, so YES is the tab's YES, NO its NO, and CHANGE is the note box).

## 6. ROUTED (notes, not jobs I took)
- COMBAT TWO: no board carries a dead car (0 of 784); the siphon has nowhere to stand until the plan's car flag fires.
- THE COORDINATOR: the one question (what each gives); the clock (an outing's time, untouched here); the stale-gas finding for DYNASTY and ECONOMY.

pre-push pass: vote_tab gate run on the registry with the new card (see the commit); full suite unmeasured since 0db6b989 (rule 13).
