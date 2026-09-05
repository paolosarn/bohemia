# EYES AND EARS -- ROUND 1: WHAT THE MACHINE SAW
## E0 [first pictures], 9/5/26, lane 17 (eyes-5vql33)

Paolo 9/4: "a double checking set of eyes and a double checking set of ears for any
visual and audio work... I need another free pair of eyeballs and another free pair
of ears." E0's order was blunt and correct: before any research, take a real
screenshot of every tab of the alpha and the demo at iPhone size, write one line
under each saying what looks wrong, commit it, and tell him where to look.

**HE OPENS ONE PAGE:** `slices/BOHEMIA_EYES_ROUND_1_9_5_26.html` (published, so it
opens on his phone from the same site as the game). The pictures are in
`slices/eyes/`.

---

## THE METHOD, AND WHY IT IS THE REAL SURFACE

- The two slices are served over http and loaded in Chromium at **390x844, device
  scale 2, mobile, touch** -- iPhone portrait, the only shape this game is built for.
- **The splash is TAPPED, with a real click on `#front`.** The 8/30 become-law
  post-mortem records a probe that hid the splash with `display:none` and
  screenshotted a black rectangle while every report said success. A finger taps.
- Tabs are read off the live DOM (`#tabs .tab`), never from a list in this file, so
  a renamed or cut tab cannot be silently missed.
- The workshop's own build stamp is read out of the page.
- **THE ROUND WAS SHOT TWICE, ON PURPOSE.** The first pass ran at 06:00 on **BUILD 8/31d**
  (demo on disk: **8/31b**, a build behind). While the round was being written up, the
  SOUND lane shipped THE CITY SENDS WHERE and main moved to **9/5k**, re-cutting the demo.
  A picture of a build nobody is on is exactly the fault this round reports about the LOOK
  tab, so the pass was re-run and **every picture published here is 9/5k**. The 8/31d set
  is not lost -- it is in this round's first commit, and it is what the build-to-build
  comparison below is measured against.
- Slow panels (the game, the city, the fight, the map) get 6-9 seconds before the
  shutter; flat panels get 3.5.

## WHAT WAS BUILT (instruments only -- this lane never writes game code)

- `tools/bohemia_eyes_shots.js` -- the pass. 27 pictures, `shots.json` beside them
  with what the browser said while each was taken. A surface whose tab bar is
  hidden (the demo, on purpose) is walked in TIME instead of in tabs.
- `tools/bohemia_eyes_diff.py` -- two pictures in, one number out: what share of the
  pixels moved, and where. The smallest half of E3's golden-image machine, and
  useful on its own, because **a still frame is a measurement**.
- `tools/bohemia_eyes_sheet.py` -- the pass plus the notes, as one page for him.
- **THE WEIGHT, said out loud:** the 27 pictures are 5.1 MB and they sit in `slices/`
  because that is the only folder the site publishes, and a picture he cannot open is
  not a deliverable. A round is prunable: if the repo budget matters more than the
  history, round two can replace round one's folder -- the findings live in this record,
  which is text.

## THE INVENTORY

- **THE WORKSHOP: 21 pictures**, all on build 9/5k. The front door, the first screen after one tap, all
  **18 tabs** (VOTE UI 3D LOOK WORDS CUTSCENE DIRECT RUN CHARACTER CLOTHES ANIMATION
  RIG COMBAT MUSIC MAP SLICE LIFE ART), and the game again after the whole sweep.
- **THE DEMO: 6 pictures.** The front door, the first screen after one tap, and the
  game at 15s, 21s, 29s and 39s. The demo has **no tab bar by design**
  (`#tabs{display:none !important}`), which is correct and is not reported as a fault.

---

## THE MEASUREMENTS (numbers, not adjectives)

| what | measured |
|---|---|
| standing still in the demo, 21s vs 39s after the tap | **0.0000% of pixels moved** (byte-identical files) -- measured on 8/31d, reproduced exactly on 9/5k |
| the workshop, first screen vs the same screen after all 18 tabs (~4 min) | 0.68% moved on 9/5k (1.66% on 8/31d), and the moving part was a speech bubble |
| the only two things that changed in the demo's first 39 seconds | the music button growing to hold the song title (pushing OUTFIT off the right edge), then the toolbar breaking onto two rows and shoving everything below it down |
| character/clothes bench ground | rgb(52,50,65) cool blue-violet, against the game's own rgb(10,9,8) warm black |
| CHARACTER body sliders | rgb(0,117,255) -- the stock browser accent blue |
| COMBAT title strike-through | rgb(203,34,144) hot magenta |
| MUSIC play buttons | rgb(138,106,208) violet |
| SLICE neighbour avatar | rgb(192,143,209) lilac, 4,897 pixels |
| LIFE status pills | rgb(110,192,110), 33,847 pixels |
| ANIMATION two button borders | rgb(102,255,102) pure lime |
| build stamps | 8/31d and 8/31b at 06:00 (five days stale, and the demo a build behind the workshop); **both 9/5k after the SOUND lane's ship**, which fixed both mid-round |
| surfaces that fetch a font from the internet | **one**: the fight, inside `COMBAT_B64`, asks fonts.googleapis for VT323 + Space Grotesk. Nothing else in slices/ or engine/ does. |

---

## WHAT LOOKS WRONG. SIX THAT MATTER FIRST.

1. ~~**THE DEMO'S CONTROLS RUN OFF THE BOTTOM OF AN IPHONE.**~~ **WITHDRAWN 9/5, AND IT
   WAS THIS ROUND'S LOUDEST CLAIM. IT IS FALSE.** Measured with the E3 probe an hour
   later, in both surfaces, in parent coordinates: the demo's game frame is top 0 height
   844 (the whole glass) and SLEEP's box is 788-832, **twelve pixels clear of the edge**;
   the workshop's frame is top 42 height 802 and SLEEP lands at 801-832 in the phone's
   own coordinates, also clear. The ring's bottom arrow is complete in both. Brightening
   the same screenshot 3x shows the chip's cut corner fully drawn above a black band.
   **What happened:** dark chips on a dark ground above a black letterbox, read at page
   scale, called clipped without measuring. A checker that cries wolf is worse than no
   checker, so this stays at the top of the list rather than being deleted, and it is the
   first thing on the page he opens. What replaced it as the sixth finding is the map's
   repetition (below).
2. **THE OPENING SCENE IS ART FROM ANOTHER KIND OF GAME.** `alpha-07-cutscene`: a
   glossy stone floor with heavy grout, ornate wooden chairs, a plated steak, a bright
   green cake; a visible seam straight down the middle of the table; the same crack
   pattern repeated in every floor tile; the wall brick at a different scale from the
   floor. It is the first thing anybody sees and it does not read as our valley.
3. **TWO BOHEMIA LOGOS, TWO TAPS APART.** The front door is the gold blocky wordmark;
   the fight (`alpha-14-combat`) opens on a white broken wordmark struck through with a
   hot magenta bar, and asks for a second TAP TO START.
4. **STANDING STILL, THE GAME IS A PHOTOGRAPH.** 0.00% between two frames eighteen
   seconds apart. His "the city seems dead asf" now has a number on it. (Honest
   caveat: a card is open in those frames, and the world may be held on purpose. It is
   still what a stranger who does nothing sees.)
5. **THE FIRST SCREEN ASKS FOR TWO THINGS AT ONCE.** The WATCH offer and the GET UP
   card are both up, with a bark underneath both, and the bark's speaker is hidden
   behind the card, so a voice comes out of nothing.
6. **THE MAP PASTES THE SAME BLOCK EIGHT TIMES** straight down one column, with black
   voids between districts that read as missing tiles rather than empty desert.
7. **EVERY BENCH JUDGES ART ON THE WRONG COLOUR.** The character and clothes stages are
   rgb(52,50,65), a cool blue-violet grey; the game's own ground is rgb(10,9,8), warm
   black. Colour is judged relative to what surrounds it, so a wardrobe approved on a
   cool stage is approved against a background the game never shows.
   *(The sixth finding at 06:00 was the build line: 8/31d on 9/5, edge to edge with no
   side margin. The SOUND lane's ship fixed the staleness mid-round -- it reads 9/5k now
   and it fits. The missing side margin is still there, waiting for a longer headline.)*

## THE REST, BY TAB

- **VOTE** -- a button's label is cut ("MATCHED TO"); each haircut's name is printed on
  top of the portrait it names; several back views carry long straight strand lines.
- **UI** -- a button says **FF10** and a study built on **FFX**. See the pending below.
- **3D** -- the tab says 3D, the page says THE THIRD ONE, ROUND 7. The door and the room
  have different names.
- **LOOK** -- titled WHAT IS NEW, dated **8/8** (4 weeks). Labels under the tiles are
  ~4px and unreadable on a phone; a large empty black area sits inside the sheet.
- **WORDS** -- the cleanest page in the build. One fault: a file path is printed beside
  the quest name, on a screen he reads.
- **CUTSCENE** -- see finding 2; also an empty bordered caption box under the picture
  that reads as a broken panel before you press PLAY.
- **DIRECT** -- two buttons both say HOUSE with arrows pointing opposite ways and the
  seed number wedged between them; the panel has no title of its own.
- **RUN** -- see findings 1, 4, 5.
- **CHARACTER** -- **opens on a random facing**: NE (the back of the head, no face in it)
  on the first pass, E (profile) on the second. In profile the face is a flat vertical
  wall with no nose projecting, under a portrait carrying a full mane. Sliders are browser
  blue; the CANON button is clipped by the bottom edge; the SHOULDER label collides with
  its slider.
- **CLOTHES** -- the thumbnail row runs off the right edge with no scroll cue; the judging
  stage is cool blue-grey while the game is warm black (you cannot judge a colour on the
  wrong ground); the buttons are a different type and shape from the rest of the build.
- **ANIMATION** -- the right way to show a character (all eight facings in one frame), and
  what it shows is: the three back views are a **flat cream block with one straight black
  bar on it**, no strand marks, no nape, a band of bare skin between the hair and the
  collar. The front view draws a face correctly. The two feet read as one slab in every
  facing; a straight seam runs down the middle of the coat.
- **RIG** -- the autosave status line prints straight through the GHOST OTHERS button;
  the whole tab is a different visual language (grey pills, blue-grey ground, no cut
  corners, a different typeface).
- **COMBAT** -- see finding 3; and it is the one surface that asks the internet for its
  letters.
- **MUSIC** -- the description column wraps to five short lines and NEEDS YOU lands in the
  middle of it; PLAY buttons are violet; a button is labelled "EXPORT SFX (to Claude)"
  on his own bench; the copy says "FFX-style".
- **MAP** -- the same apartment block repeats **eight times** straight down one column and
  the grid block repeats beside it; black voids sit between districts and read as missing
  tiles rather than empty desert; the caption is cut off at the right edge; nothing marks
  where you are.
- **SLICE** -- a lilac avatar (purple is reserved); its clock reads 07:14 while the game
  reads 06:00; two thirds of the screen is empty.
- **THE DEMO'S FRONT DOOR** -- at 06:00 the demo on disk was a build behind the workshop
  (8/31b against 8/31d); the re-cut that came with the 9/5k ship caught it up. Fixed
  mid-round, and recorded because the next drift will look exactly the same.
- **LIFE** -- four long paragraphs before anything you can look at; mint-green pills;
  rounded corners and a sans typeface against the shell's cut corners and typewriter.
- **ART** -- dated 8/5; the right-hand render sits in its frame with a black band under it;
  a before/after pair with nothing saying which is which.

---

---

## THE FIRST REGRESSION RUN, BY ACCIDENT (this is what E3 is for)

Main moved mid-round, so the same 27 frames exist on two builds and the diff tool could
be pointed at them. **This is the machine E3 is meant to build, running for the first
time**, and the result is worth keeping:

| screen | moved between 8/31d and 9/5k |
|---|---|
| the character bench | 6.09% |
| the demo, standing still | 2.25% - 3.23% |
| the walked game (RUN) | 1.18% |
| after the sweep | 0.96% |
| all eight facings (ANIMATION) | 0.53% |
| both front doors | 0.30% / 0.46% (the build line) |
| the fight's title | 0.07% |
| **the other twelve tabs** | **0.00%, pixel for pixel** |

Twelve of the workshop's screens did not move by a single pixel across five days of
shipping. Most of those are judge pages that nobody claimed to have changed, so this is
not a fault by itself -- **it is a baseline**, and it is the whole trick: once a screen
has a known picture, the only screens worth a human's eyes on the next ship are the ones
whose number is not zero. The character bench's 6% is the shuffle, not a change: it opens
on a random facing and a random fit.

## TWO FALSE FINDINGS THIS ROUND KILLED BEFORE THEY REACHED HIM

Both are the same lesson this repo keeps paying for, and they are written down so the
next round does not pay it again.

1. **"THE CHARACTER HAS NO HEAD."** The CHARACTER bench showed a featureless cream egg
   where a face should be, and it looked like a serious render fault. It is a **BACK
   VIEW**: the bench opens facing NE, and N/NE/NW are the back of the head. The
   ANIMATION tab, which draws all eight facings at once, settled it in one picture --
   S, SE and SW draw a full face. **What survives is the smaller true finding** (a blank
   back of the head with one straight bar on it, and a bench that opens on it).
2. **"EVERY LETTER IN THESE PICTURES IS A FALLBACK FONT."** The browser's log showed a
   failed Google Fonts request, and the obvious conclusion was that no type in the
   capture is real. Wrong: the shell embeds BohemiaMono as base64 and needs no network.
   The request comes from **inside `COMBAT_B64`**, the fight, which is the only surface
   that fetches VT323 and Space Grotesk at runtime. A plain search of the alpha cannot
   see the fight (it is base64), so the file had to be decoded to find it -- exactly the
   measurement note the BB study left behind. **The false finding was global; the true
   finding is one surface, and it is a real fragility: on a phone with no signal the
   fight changes typeface and nothing else does.**

## WHAT THIS ROUND COULD NOT SEE (so nobody reads it as a clean bill)

- **Nothing was heard.** There is no audio instrument yet; that is E4. A screenshot has
  no ears.
- **Nothing behind a tap.** The pass taps the splash and the tabs, nothing else, so the
  fight past its title screen, the market, the phone, the reckoning card and every quest
  screen are unphotographed.
- **Motion between frames.** Four still frames of the demo is not a video; a stutter or
  a popping frame would not show.
- **Real colour on real glass.** Chromium on a server is not his phone at 40C in the sun.

---

## FOR THE COORDINATOR (this lane adds no job lines: no lane has a SHIPPED line yet,
## and the 9/4 law only lets EYES write into a lane's section on a shipped defect)

- demo controls clipped at 844 -> **UI / RUN**, demo-critical.
- the opening scene's art -> **DIRECTION** (does it stay?) then **COOK**.
- two logos -> **DIRECTION**.
- back of the head, one straight bar, feet as one slab -> **CHARACTER / COOK**.
- map repetition and black voids -> **CITY / WORLD**.
- off-palette colours (browser blue, violet, lilac, mint, lime, magenta) -> **UI**.
- benches judging art on a blue-grey ground -> **UI / DIRECTION**.
- stale stamps and stale tabs (LOOK 8/8, ART 8/5) -> whoever ships next; the stamp law
  says every ship updates it.

---

## THE GATES, SINCE THIS ROUND HAD TO RUN THEM

The suite was run on this tree and **not one failure in it belongs to this round**;
the only changes here are new files (three instruments, the pictures, this record, the
page and one status word in the board). Verified the honest way rather than asserted:
every failing gate was re-run on a clean checkout of origin/main and compared.

- 325 of 479 gates ran inside the half-hour cap: **296 green, 29 red.**
- **27 of the 29 fail identically on origin/main**, before anything in this round
  existed. They are other lanes' standing reds, not this lane's to touch.
- **The other 2 are gates measuring the clock instead of the art**, and they deserve a
  line because this lane's whole job is noticing when an instrument lies:
  `look_gate` ("no picture is more than six hours behind the surface it photographs")
  and `face_thumb_gate` ("the candidates are not older than the build they photograph")
  both compare FILE MODIFICATION TIMES. **Git does not store mtimes.** In this container
  the alpha was written to disk 7.8 hours after the picture banks were, so both gates go
  red with no content changed by anybody; on a fresh worktree of the very same commit,
  both are green. A check that can flip on a `git clone` is measuring the checkout, not
  the work. Reported, not fixed: gates that belong to other lanes are not this lane's.

## ANSWERED THE SAME ROUND (9/5): A REFERENCE GAME BELONGS TO ONE DEPARTMENT

The question this round raised -- the UI tab ships a button called FF10 and a study of
Final Fantasy X, while CLAUDE.md's index line read as though the reference set were three
games with FINAL FANTASY XII among them -- went to him and came back locked:

> "Ff12 is combat only"

FF12 is the COMBAT reference (the gambits) and nothing else. FF10 is the INTERFACE
reference, which he named on 8/26, so the UI tab was legal all along. ROGUE FABLE 4 is
combat on the beat, BATTLE BROTHERS is the campaign layer, Las Vegas is the city. Citing
a reference outside its department is the same violation as citing a game he never named.
The 8/28 law was already scoped correctly ("combat and campaign"); the rot was in the
one-line index in CLAUDE.md, which dropped the scope. That line now carries the split, and
the ruling is written down in
`laws/BOHEMIA_ADDENDUM_A_REFERENCE_GAME_BELONGS_TO_ONE_DEPARTMENT_9_5_26.md`.

**The lane's own lesson: the finding was half right and that was still worth raising.**
Nothing in the build had to change, one line of the index did, and the cost of asking was
one sentence from him.

