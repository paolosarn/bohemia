# BOHEMIA — THE UI LANE BRIEF (Paolo 8/25/26)
# Read this FIRST, before CLAUDE.md's laws list, if your first word is "ui".
# Created because he asked for it: "IDK IF ITS TIME TO MAKE A UI CHAT? I
# REALLY CARE ABOUT THE UNIQUNESS OF MY GAME AND I NEED TO START WORKING
# ON HOW ALL THE BUTTON AND EVERYTHING IN THE WORLD WILL LOOK AND CRAFT
# THIS BOHEMIA LOOK BY MYSELF WITH YOU. ITS UNIQUENESS AND SAY. YEAH
# THATS BOHEMIA VIBES."

## 1. WHAT THIS LANE IS
**YOU OWN EVERY PIXEL THE PLAYER TOUCHES THAT IS NOT THE WORLD.**
Buttons. Cards. Panels. The phone's chrome. Type. The HUD. The feed. The
splash. Icons. What a thing looks like PRESSED, DISABLED, LOADING, and
WRONG.
**YOU ARE A LOOK LANE, NOT A PLUMBING LANE.** RUN keeps owning what a
button DOES. You own what it IS. If you find yourself changing what
happens when it is tapped, you have crossed a lane boundary — hand it to
RUN and keep the look.

## 2. THE ONE THING THAT MAKES THIS LANE DIFFERENT FROM EVERY OTHER LANE
He said **"BY MYSELF WITH YOU."** Every other lane produces and he
corrects afterward (EVERYTHING IS A THUMB, 8/9). **THIS LANE IS A
CONVERSATION.** He is the art director of his own game's look and he
asked to sit in the chair.
So: you do not disappear for a turn and return with a finished design
system. **YOU PUT ONE PAGE IN FRONT OF HIM AND ASK HIM TO TEAR IT UP.**
That is the exception EVERYTHING IS A THUMB explicitly leaves open —
"anything he asked to see."

## 3. YOUR FIRST JOB, AND IT IS NOT A COMPONENT LIBRARY
**ONE PAGE OF VOCABULARY.** Not twelve screens. Not a button set. The
small number of decisions that everything else is downstream of:
  - **SHAPE.** Square? Cut corner? Rounded, and by how many pixels?
  - **WEIGHT.** Hairline, or heavy? What is the line width, in pixels, at
    the size he actually sees?
  - **CORNER.** How a panel meets a panel.
  - **COLOUR.** Working from the approved palettes, not new hues.
  - **TYPE.** One face, or two? All caps or not? At what size on a phone?
  - **TEXTURE.** Flat, or does it have grain / wear / dust? A
    post-collapse city's interface is a real design question.
  - **PRESSED.** What a thing does when a thumb lands on it. This is the
    single most-felt pixel in the whole game and nobody has ruled it.
Ship it as ONE screen he can look at on his phone, with 2 or 3 options
side by side where a real fork exists, and HE PICKS WITH ONE LETTER.

## 4. THE LAWS THAT ALREADY BIND YOU (do not re-litigate these)
- **PURPLE RESERVATION.** Purple belongs to the Amalgamation alone.
  Never a UI colour.
- **LINE COLOR LAW** and the approved palettes. REUSE-FIRST: open the
  banks before you invent a colour.
- **LIGHT = TERRITORY**, and it is LUMINANCE, not hue. Do not undo that
  by making UI state depend on colour.
- **NO ESSENTIAL INFORMATION BY COLOUR ALONE** (Game Accessibility
  Guidelines, basic tier; SHARED -6). Red/green deficiency is about 1 in
  12 men.
- **THE SAME RULE FOR SOUND** (SHARED SILENT-2): a sound may be the best
  copy of a message, never the only copy. Three cues need a visual twin
  — save_chime, ui_deny, STING:missed. **ui_deny IS YOURS**: a refusal
  with no feedback looks exactly like a broken button, and that does not
  just lose information, it teaches the wrong thing.
- **THE THUMB** (SHARED -5): iPhone portrait, one-handed. ~49% of people
  hold a phone one-handed and only about a third of the screen is
  effortless. The top corners are the worst real estate on the device and
  our navigation lives there.
- **NAME THE TAB** (7/28) and **eighth-grade reading** (8/24) apply to
  every word you put on screen, not just replies to him.
- **HE MUST BE ABLE TO DIRECT IT** (8/12): if the answer to "where does
  he change this himself" is "he tells me and I edit a file", it is not
  shipped.

## 5. WHAT IS ALREADY WAITING FOR YOU
- **THE FEED ART IS DEAD AND ITS SLOT IS EMPTY.** He killed the ASCII
  "text-cam" pictures on the phone feed twice — "I CANT TELL WHAT THOSE
  SHITS ARE." Graveyard, no remakes. **What goes in that hole is your
  first real design problem** and it is a good one: what does a
  post-collapse social feed post look like when it is not a photograph?
- **THE ACTION BUTTON IS NOT THE CITY BUTTON** (UI-2). Zoom is the way in
  and out of the city; the action button does actions and never changes
  meaning. You own the control's meaning, RUN owns the plumbing.
- **THE DEMO IS ITS OWN BUILD** (8/25 law) and it is being cut now. Its
  front door, its splash and its ending are all UI surface.

## 6. HOW YOU SHIP
Same as every lane: **a law without a machine gate is not enforced.**
Your gates check PIXELS ON THE REAL SURFACE (7/18), never that a function
was called — this repo has spent a month finding finished code with no
caller. Commit straight to main, never a pull request. One system, one
session: stay out of the world, the rig and the audio rack.

## 7. WHAT IS HIS AND STAYS EMPTY
The look itself. You bring options and the reasoning; **he says which one
is Bohemia.** That is the entire point of the lane existing.
