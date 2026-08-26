# ON A LAPTOP THE WHOLE GAME IS A 640-PIXEL COLUMN
# (8/26/26, coordinator, on his ruling: "I'm sick and tired of the run
# and the combat not being full screen and still being like phone screen
# while I'm on my laptop... you gotta be able to adapt to the software.
# I can't believe this hasn't been fixed yet.")

## 1. HE IS RIGHT AND IT IS ONE LINE OF CSS
    slices/BOHEMIA_CITY_WORLD.html:22
        .wrap{ max-width:640px; margin:0 auto; height:100% ... }
That is the whole walked game. **On any screen wider than 640 pixels,
everything he plays sits in a 640-pixel column in the middle and the rest
of the monitor is background.** The alpha has its own caps at 420 and 460
for cards, and the viewport meta is locked to `maximum-scale=1,
user-scalable=no`, which is correct for a phone and does nothing for him.
NOBODY DECIDED THIS. It is what a number becomes when it is typed once
for a phone and never revisited, which is the third time this month the
same shape of bug has turned up (the map seed, the browser engine, this).

## 2. BUT "FULL SCREEN" IS TWO DIFFERENT THINGS AND ONLY ONE OF THEM IS
## SAFE
This is not only plumbing, so it is worth being straight about it.
**OPTION A — SHOW MORE WORLD.** Widen the view so a laptop sees more of
the city. **THIS WOULD BREAK THE GAME AND EVERY GATE WE OWN.** A tactical
grid where you can see further is a different game: more enemies visible,
more warning, different fights. And all 379 gates open a 390x844 window,
so a wider layout is a surface nothing has ever tested. REJECTED.
**OPTION B — SAME GAME, BIGGER.** Keep the portrait shape, scale it up to
fill the height. Safe, and it is what mobile-first games do on desktop.
**BUT IT DOES NOT ACTUALLY SOLVE HIS COMPLAINT**, and the arithmetic says
why: the stage is already 844 tall, and a laptop screen is roughly 800 to
1080 tall. So it is ALREADY close to full height. Scaling gains him
almost nothing, and pixel art must scale by WHOLE NUMBERS or it goes
soft and uneven — 2x would be 1688 tall, taller than his screen, so the
only legal integer scale on a laptop is 1x. **THE MATH FORBIDS THE
OBVIOUS FIX.**
**OPTION C — THE COLUMN IS THE WORLD, NOT THE GAME.** *** THIS IS THE
ANSWER. *** The portrait column has to stay portrait because that is the
design and the gates. What does NOT have to stay inside it is everything
that is not the world: the HUD, the phone, the day chips, the objective
line, the buttons. On a phone those sit ON TOP of the world because there
is nowhere else. On a laptop there are hundreds of empty pixels on both
sides doing nothing.
**MOVE THE FURNITURE OUT OF THE ROOM.** The world stays a phone-shaped
window, untouched and still gated at 390x844. The interface breathes into
the space beside it. He gets a screen that is USED instead of a column
floating in the dark, the game is not altered by one tile, and every
existing gate stays valid because the world's viewport never changed.

## 3. WHY THIS IS THE NEW UI LANE'S FIRST REAL JOB
The lane opened yesterday and its charter is exactly this: **it owns
every pixel the player touches that is not the world; RUN owns what the
buttons do.** This is that seam, on its first day, handed to it by him.
It also stacks with two things already on its desk: the thumb-reach
finding (on a phone the top strip is the worst real estate and our whole
tab bar lives there — on a laptop that constraint evaporates and the
layout should know the difference) and the dead feed art's empty slot.

## 4. THE HONEST COST, STATED
A desktop layout is a SECOND LAYOUT, and right now nothing in the
apparatus has ever opened a window wider than 390. **A layout nothing
tests is a layout that rots**, so this ships with its own gate or it will
be broken again in a week and nobody will know. And there is a real risk
of doing too much: the temptation will be to redesign the interface
because there is suddenly room. THE WORLD DOES NOT CHANGE. Only where
the furniture sits.

## 5. THE DECISION (mine, EVERYTHING IS A THUMB)
1. **THE WORLD STAYS PORTRAIT, ALWAYS, ON EVERY DEVICE.** iPhone portrait
   is line one of this project and it is not up for renegotiation by a
   window size.
2. **THE INTERFACE IS RESPONSIVE.** Below a threshold it is the phone
   layout we have. Above it, the furniture moves outboard.
3. **PIXEL SCALING IS INTEGER OR IT DOES NOT HAPPEN.** No half-scales, no
   smoothing. Blurry pixel art would be a worse insult than a small
   window.
4. **NOTHING ABOUT THE GAME CHANGES.** Same tiles visible, same fights,
   same everything. If a laptop player can see one cell further than a
   phone player, the fix went wrong.
5. **IT GETS A GATE THAT OPENS A LAPTOP-SIZED WINDOW**, because we have
   never once done that.

## 6. ROUTED
- **UI — WIDE-1: THE FURNITURE MOVES OUTBOARD ON A BIG SCREEN.** Own the
  layout. Do not touch the world's viewport, the tile size, or how far
  the camera sees.
- **RUN — WIDE-2: THE GATE THAT OPENS A LAPTOP WINDOW.** One gate,
  desktop-sized, asserting the world's visible cell count is IDENTICAL to
  the 390x844 case, that no control lands off-screen or under another,
  and that nothing is scaled by a fraction. Mutation test: widen the
  world's view by one cell -> red.
- **NOT ROUTED:** any change to the viewport meta's phone behaviour, or
  to the world camera. Those are the two things that look like the fix
  and are not.

## 7. CONFIDENCE
- The 640-pixel cap and the 420/460 card caps: read in place. **CERTAIN.**
- That it is the cause of what he sees: **HIGH**, and he is the witness.
- The integer-scaling constraint and the arithmetic that kills Option B:
  practitioner consensus on pixel-art scaling plus the stage's own
  numbers. **HIGH.**
- That Option C satisfies him: a **PREDICTION.** He is the test, and it
  is cheap to be wrong about because nothing in the world moves.

## SOURCES
In-repo: slices/BOHEMIA_CITY_WORLD.html:22 and the alpha's card caps, the
viewport meta, and the 390x844 constant every gate opens with.
Outside: practitioner writing on pixel-art scaling (enlargement must use
integer multipliers with nearest-neighbour or rendering goes smeared and
unstable; integer letterbox scaling as the standard fix), and mobile
multi-resolution guidance on scaling a fixed logical canvas rather than
revealing more scene. Prior: BOHEMIA_BACKLOG.md SHARED -5 (the thumb),
laws/BOHEMIA_SESSION_BRIEF_UI_8_25_26.md.
