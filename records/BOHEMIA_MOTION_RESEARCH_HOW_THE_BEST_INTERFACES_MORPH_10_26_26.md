# MOTION RESEARCH: HOW THE BEST INTERFACE SYSTEMS MOVE BETWEEN STATES (MOTION, lane 25, 10/26/26)

Row: MOTION [the UI morphs], step (1). Rule 229(d): research first, cited; never a game he has not named (rule 6).
Every source below is an interface system, an accessibility standard or a film craft. No game is cited and none is a
reference. His words: records/BOHEMIA_PAOLO_THE_UI_MORPHS_MOTION_GETS_ITS_OWN_CHAT_10_26_26.md.

## 1. WHAT THE BEST SYSTEMS DO, AND WHAT WE TAKE

### 1a. The container transform (Google Material motion)
- Material names four transition patterns: container transform, shared axis, fade through and fade. The container
  transform is for "a container stays in place through the transition": a button opening into a sheet, a list row
  expanding into its detail screen. It "draws a visible link between two separate elements by morphing one into the
  other", and "using a container transform to animate between views can help reinforce their relationship and maintain
  a user's navigational context". While the container morphs, its contents are swapped. Going back plays the same
  transform reversed. Material's own study: most participants preferred it and said the change felt continuous rather
  than like navigating away.
  Sources: material.io/design/motion/the-motion-system.html; developer.android.com/codelabs/material-motion-android;
  github.com/material-components/material-components-android/blob/master/docs/theming/Motion.md;
  material.io/blog/android-material-motion.
- WE TAKE: the town IS a container transform: its spot on the map is the container, it grows into the settlement screen,
  and LEAVE plays it reversed back into the spot. The CREW button grows into the crew screen and shrinks back into the
  button. Shared axis and fade through are for screens with no persistent piece; in Bohemia every change has one (rule
  229(a): what is new grows out of something on screen), so we never use them, except the fade as reduced motion.

### 1b. The shared element: two nodes, one name (the web's View Transitions; Android shared elements)
- The web's View Transitions API gives an element a `view-transition-name`; "even though they're conceptually (and
  literally) different elements, the transition API treats them as the same thing because they shared the same
  view-transition-name". The old and new need not be the same node, only the same visual object. Names must be unique
  among what is on screen, or the transition is skipped. Android's shared elements do the same per id; Compose keeps an
  in-flight shared element animating to its end even if it is disabled mid-way, so nothing is pulled out mid-flight.
  Sources: developer.chrome.com/docs/web-platform/view-transitions/same-document;
  developer.mozilla.org/docs/Web/API/View_Transition_API/Using;
  developer.android.com/develop/ui/compose/animation/shared-elements/customize.
- WE TAKE: ONE ID ON BOTH SIDES. A piece that lives on two screens carries `data-morph="<id>"` on both (the bar, the job
  card, the town, the crew door). The layer matches by id and morphs the one into the other. An id is unique on the glass.
- WE DO NOT TAKE the browser API itself: the View Transitions snapshot is per document and our screens are nested
  iframes (the map frame, the town frame inside it, the fight frame beside it), so a page-level snapshot cannot carry a
  piece from one frame into another, and it is not on every phone browser he may use. The layer does the same job by
  hand, in the top document, across the frames.

### 1c. FLIP: First, Last, Invert, Play (Paul Lewis, aerotwist.com/blog/flip-your-animations)
- Measure the first box, apply the change, measure the last box, put a transform on the element that holds it where it
  was, then play the transform away. Only transform and opacity animate, so the browser never re-lays the page out per
  frame. It suits "cases where the precise location of the starting or ending position will not be known until the
  animation is triggered". Sources: aerotwist.com/blog/flip-your-animations; css-tricks.com (FLIP write-up);
  gsap.com/docs/v3/Plugins/Flip.
- WE TAKE: the layer measures the first box, lets the screen switch at once (the real end state is laid out from the
  first frame), measures the last box, and flies a stand-in between them with transforms only. Because the real end
  state is already there, under the stand-in, A TAP DURING THE MORPH LANDS ON THE END STATE: the stand-in never takes
  pointer events. This is the whole of rule 229(b)'s "input is live through it".

### 1d. Fluid, interruptible, redirectable (Apple, WWDC 2018 session 803, "Designing Fluid Interfaces")
- Apple's gesture-driven interface is described as responsive, interruptible and redirectable: a motion in flight can
  be caught and sent somewhere else, never waited out. Sources: developer.apple.com/videos/play/wwdc2018/803;
  github.com/nathangitter/fluid-interfaces; medium.com/@nathangitter/building-fluid-interfaces-ios-swift-9732bb934bf5.
- WE TAKE: (i) a tap anywhere during a morph SKIPS it: every stand-in jumps to its last frame and is gone in the same
  frame, and the tap itself goes through to what is under the finger in the end state (it is never eaten); (ii) a new
  morph started while one is flying finishes the old one first (it lands, it never vanishes) and starts from where the
  pieces now are.

### 1e. How long (Nielsen Norman Group; Material's duration tokens)
- NN/g: simple feedback (a checkbox, a toggle) about 100 ms; "when animation involves substantial screen changes, such
  as when a modal window moves into view, a duration of 200 to 300 ms can be appropriate"; 100 ms reads as instant and
  1 second is the upper limit of a person's flow of thought. Material's duration scale runs from 50 ms (short1) to
  600 ms (long4); its container transform sits at 300 to 450 ms with the emphasized easing
  (emphasized-decelerate cubic-bezier(0.05, 0.7, 0.1, 1.0)). Sources: nngroup.com/articles/animation-duration (quoted
  via lists.w3.org/Archives/Public/public-css-archive/2025Apr/0702.html and valhead.com); material.io/design/motion/
  customization.html; github.com/material-components/material-components-android/blob/master/docs/theming/Motion.md.
- AT 120 BPM: a sixteenth is 125 ms, an eighth 250 ms, a beat 500 ms, two beats 1,000 ms.
- THE FINDING THAT PROVES US WRONG (measured against our repo): rule 229(b) says "a mode change a beat or two at 120".
  Two beats is 1,000 ms, which is exactly NN/g's upper limit of a person's flow of thought and more than twice
  Material's longest container transform. A two-beat morph is the ceiling, never the target. THE BUDGETS (the gate holds
  them): a piece's flight (the card, the bought item, a button into a screen) lands on the first eighth at least 250 ms
  after the tap, so 250 to 500 ms; a mode change (the map into a town, into a fight, and back) lands on the first eighth
  at least one beat after the tap, so 500 to 750 ms; nothing ever runs past 1,000 ms. Input is live from the first
  frame either way, so the length never costs him a tap.
- ALSO MEASURED against the repo before building: the screens cut today. The town frame is put up whole in one frame
  and taken down in one; the fight frame is created full screen; the crew screen opens over the glass in one frame. The
  bar and the phone already hold one rectangle on the map, in the town and in the fight (rule 190, ONE HUD EVERYWHERE),
  so the bar never needs to fly; it is the one piece that already does not cut.

### 1f. Reduced motion (W3C WCAG 2.3.3; Apple)
- WCAG 2.3.3 Animation from Interactions (AAA): "motion animation triggered by interaction can be disabled, unless the
  animation is essential"; the sufficient techniques are the prefers-reduced-motion query (CSS C39, script SCR40) and
  "allowing users to set a preference that prevents animation". People with vestibular disorders get nausea and
  dizziness from motion that starts on a click. Apple: make motion optional or give an alternative "such as a dissolve,
  highlight fade, or color shift"; with Reduce Motion on, macOS replaces full-screen slides with crossfades; "never
  disable functionality, only the motion". Sources: w3.org/WAI/WCAG21/Understanding/animation-from-interactions;
  w3c.github.io/wcag/understanding/animation-from-interactions.html;
  developer.apple.com/help/app-store-connect/manage-app-accessibility/reduced-motion-evaluation-criteria;
  useyourloaf.com/blog/reducing-motion-of-animations.
- WE TAKE: REDUCED MOTION in the game's settings (its default is the phone's own prefers-reduced-motion), and when it is
  on every morph becomes a quick fade in place: the stand-in never travels and never grows, it dissolves out over 150 ms
  while the end state is already there. Same taps, same end state, only the motion goes.

### 1g. The look: stop-motion holds (film craft; rule 115(d) and rule 130, CRASHBOX)
- Stop-motion is shot "on twos": each pose held for two frames of 24, 12 poses a second; productions mix ones, twos and
  threes, threes for fast action. Sources: stopmotionstudio.com/en/manual/Shooting_on_Twos;
  learn.adafruit.com/stop-motion-animation/stop-motion-animation-basics; filmdaft.com (stop-motion definition).
- AT 120 BPM, TWELVE A SECOND IS SIX HOLDS A BEAT, EXACTLY (500 / 6 = 83.3 ms): the stop-motion grid and the music's grid
  are the same grid. WE TAKE: a morph is drawn on twos, a held pose every 83.3 ms on the beat's own clock, never a smooth
  60 fps glide (rule 229(c): never a glossy app slide). The tin bends: on the held frames the plate overshoots and
  leans (a small skew and squash, settling over the last two holds). A rivet pops in: when a piece lands, its corners
  get rivets that appear on the last hold with a one-frame pop. The grain boils: the stand-in wears the analog grain,
  re-rolled every hold, the way clay boils between frames.

## 2. THE MOTION LAYER, AS BUILT FROM THE ABOVE (slices/bohemia_motion.js)
- ONE layer, in the top document, over every frame: `BohemiaMotion`. A screen hands it a piece by id
  (`data-morph`), or a box and a picture when the piece lives in a canvas (the town on the map).
- `morph(id, from, to, opts)`: from and to are elements (in any same-origin frame) or boxes in the glass's points. It
  measures both, makes a stand-in (a copy of the from piece, or the tin plate when there is no piece to copy), and flies
  it from the first box to the last on twos, the end on the beat's eighth.
- `grow(el, fromBox)` and `shrink(el, toBox)`: the container transform on the real element (the town frame, the fight
  frame, the crew door), from a point or box on screen; the screen underneath stays; shrink removes it only after it
  has landed.
- Every stand-in: pointer-events none (the tap goes through to the end state); a tap during a morph skips every morph
  to its end and the tap is delivered; REDUCED MOTION makes every call a 150 ms fade in place.
- The beat: the layer reads the one audio clock when SOUNDS' clock is present (rule 221(b)) and its own 120 BPM grid
  from the page's clock when it is not; a morph's end lands on the eighth either way.
- The record of every morph (id, start, end, frames, whether a shared piece was ever missing from a frame) is kept in
  `BohemiaMotion.log` so the gate reads what happened, not what was meant.

## 3. ROUTED
- UI, UI TWO: hand the bar's pieces, the phone's apps and its job column by id (the NOTEs on their boards).
- RUN: the map's town spot as a box for the town's grow; RUN TWO: the town frame, the shop's BUY, the board's TAKE.
- COMBAT: the fight frame and its bar; CAMP: the HEAL bar; SOUNDS: the audio clock's name when it lands.
- EYES: line 151, every change watched on the live demo, phone and computer.
