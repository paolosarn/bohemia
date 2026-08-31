# THE CUT ASKS WHO YOU BECAME (8/30/26, CHARACTER lane)

**The face maker shipped on 8/28. A player could not reach it.**

It answers item 10 of Paolo's own 8/25 playtest dispatch — *"FACE CUSTOMISATION, never
built, is on the board"* — with fourteen shape sliders, every haircut the city wears, and a
live portrait at the size it pops up when somebody talks. It shipped into the **CHARACTER
tab**, which is a dev tab, and `tools/bohemia_cut_the_demo.js` strips every dev tab out of
the demo build.

So in the thing an actual player opens, the panel is still in the file and **there is no
door to it**.

That is the same failure as the seventeen invisible hats, the four bright garments nobody
wore, and the VOTE tab that never held a face: *the material existed and never reached the
player.* Three weeks, three lanes, one shape.

---

## WHERE IT GOES, AND IT IS HIS, FROM JULY

`laws/BOHEMIA_ADDENDUM_ACT1_OPENING_VISION_7_19_26.md` locks the opening as three beats,
and beat 1 turns on a match-cut:

> *"Then a blink / match-cut: the SAME table, ~10 years later, now in a dingy
> post-apocalypse house, **you are 20-something**. The single cut shows the entire
> apocalypse without a word."*

You are a child before the cut and an adult after it. **The one thing the cut cannot show
is what ten years did to YOU** — and that is exactly the question a character creator asks.

So the creator is not a menu bolted to the front of the game. It is the beat the opening
already needed. The scene **holds** on the first frame of the adult, asks *TEN YEARS LATER
— who did you become?*, and resumes when you answer.

**RESEARCHED, NOT GUESSED.** Diegetic character creation is the standing answer in games
that care about immersion: *The Outer Worlds* picks you off a cryo-manifest, *Shadows Over
Loathing* sets your appearance at a mirror during its prologue. The common shape is that
creation happens inside the fiction at a moment the fiction already needed. Ours had one
written down five weeks before anybody looked for it.

**AND HE CAN MOVE IT.** The hook reads a `become` flag off whatever beat carries it, not
off a beat id or a hard-coded index. Dragging the moment in the **DIRECT** tab moves it with
no code change — HE MUST BE ABLE TO DIRECT IT (8/12).

---

## ONE SET OF CONTROLS, NOT TWO

`faceControlsUI` is the workbench's own body, minus the calibration pad and the export
button, which are about *making* the game rather than *playing* it. The creator and the
CHARACTER tab call the same function.

A second face editor is precisely how the portrait and the body ended up being different
people on 8/27 (ONE ID, ONE WHOLE PERSON). It is not happening twice.

`FACE_REBUILD` names whichever surface is currently showing the controls. Before this, every
refresh inside them called `buildFaceEditor()` by name, which hard-wired them to the dev
panel's own div — so a second surface would have *had* to be a second implementation.

---

## PURPLE RESERVATION APPLIES TO A SCREEN THE PLAYER SEES

The workbench's sliders are lilac (`#b39ddb`) and that is fine on a dev bench. Purple belongs
to the Amalgamation alone, so the creator sets `--faceAcc` to the game's gold. **A variable,
not an override** — the first cut matched on the inline style *text* and missed, because
`cssText` re-serialises `#b39ddb` as `rgb(179, 157, 219)`. Not one dev panel changed.

---

## THREE THINGS THIS COST, WRITTEN DOWN BECAUSE THEY GENERALISE

### 1. ANYTHING A PATCH TOOL OWNS MUST BE EDITED AT ITS SOURCE

`Story.prototype.hold`/`resume` were written straight into the alpha. They worked. Then
`tools/bohemia_cutscene_tab_patch.py` — which owns that script block and inlines
`engine/bohemia_story_surface.js` **verbatim** — ran, and wiped them.

The failure was silent and it was *flattering*: the creator still appeared, the DONE button
still worked, and the scene played on happily **behind** the creator while every other check
stayed green. Fixed in `engine/bohemia_story_surface.js`, where it belongs. The gate now
asserts the capability is in the engine file, not in the build.

### 2. THE SCENE THE GAME OPENS WITH HAS THREE COPIES AND ONLY ONE IS PLAYED

- `records/BOHEMIA_SCENE_ACT1_COLD_OPEN.json` — the canon source
- `var BOHEMIA_COLD_OPEN` in the alpha — read by **`gates/coldopen_gate.js` only**
- `BOHEMIA_CUTSCENES[…].scene`, inlined — **the only one `openScene()` ever reads**

I edited the middle one. Everything reported success and the game did not change by one
pixel. `tools/bohemia_cutscene_tab_patch.py` writes all three from the record, which is the
correct pipeline; the trap is that hand-editing any single copy looks exactly like working.
**A duplicate that nothing reads is worse than no duplicate, because it is where your fix
goes to die.**

### 3. A GUARD BELONGS INSIDE THE THING IT GUARDS

"Ask once per device" was written into the beat hook — a property of *one caller* rather
than of the function. The gate called `openBecome()` directly and it re-opened over somebody
who had already answered. Moved inside. A guard outside the function it guards holds only
until somebody else calls in.

---

## WHAT A PLAYER GETS

Tap the demo link. Watch the family at the table. The blink. The ruined room, ten years on.
Then: **TEN YEARS LATER — who did you become?**, a live portrait, eleven skin tones, seven
hair colours, six eye colours, twenty-four haircuts, four hair textures and fourteen shape
sliders. Press **THIS IS ME** and the scene picks up exactly where it stopped, wearing your
face for the rest of the game.

Tab: **RUN** (the opening) / **CHARACTER** (the same controls, on the bench) / **DIRECT**
(move the moment).
Gate: `gates/become_gate.js` — it drives the **demo**, because the workshop was never the
problem.
Record: `records/BOHEMIA_THE_CUT_ASKS_WHO_YOU_BECAME_8_30_26.txt`
