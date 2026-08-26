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

## 1b. *** HE OVERRULED SECTION 2 THE SAME DAY. READ THIS BEFORE IT. ***
His words, minutes after the first version of this record: "I'm not too
concerned with the gameplay advantages of having full screen compared to
it not being full screen. But WHEN I ZOOM OUT, IT'S PRETTY FAR OUT, BRO.
LIKE, SO IT'S ALREADY GOOD. So yeah, DO WHAT YOU WANT, BRO... I'm not
concerned with the gameplay advantages right now. We'll worry about that
later."
**SO THE CONSTRAINT I PUT ON THIS IS LIFTED, BY THE ONLY PERSON WHO CAN
LIFT IT.** Section 2 below rejected "show more world" on balance grounds.
THAT REJECTION IS DEAD. Option A and Option C are both legal now, and
whichever falls out of a clean layout is fine.
AND HIS REASON IS A GOOD ONE, NOT A SHRUG. The zoom already pulls way
back, so the player's view distance is ALREADY generous by design. A
wider window is a small change against a range the game already grants
on purpose. He is right and my caution was priced against a tighter game
than the one we actually built.
### WHAT I AM KEEPING, AND WHY IT IS NOT DISOBEDIENCE
The gate stays, but it **MEASURES INSTEAD OF BLOCKING.** It reports how
many more cells a wide screen shows than a phone. It does not fail on the
number. **"WE'LL WORRY ABOUT THAT LATER" NEEDS THE NUMBER TO EXIST WHEN
LATER ARRIVES**, and a number nobody recorded is a question nobody can
answer. That costs one line in a gate and it is the difference between
deferring a decision and losing it.
### AND ONE THING HE DID NOT OVERRULE, SO IT STANDS
**INTEGER SCALING.** That was never a balance argument, it is craft: pixel
art scaled by a fraction goes soft and uneven. Blurry pixels would be a
real regression on the thing he cares most about. Whole numbers or none.

## 2. [SUPERSEDED BY 1b ON THE BALANCE POINT] "FULL SCREEN" IS TWO
## DIFFERENT THINGS AND ONLY ONE OF THEM IS
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

## 5. THE DECISION (AMENDED BY HIM, 8/26)
1. **FILL THE SCREEN. HE SAID DO WHAT YOU WANT AND HE MEANT IT.** The
   phone layout stays exactly as it is on a phone; on a big screen the
   game uses the screen. Whether that lands as furniture-outboard, more
   world, or both is the lane's call now, not a constraint from me.
2. **THE INTERFACE IS RESPONSIVE.** Below a threshold it is the phone
   layout we have. Above it, the furniture moves outboard.
3. **PIXEL SCALING IS INTEGER OR IT DOES NOT HAPPEN.** No half-scales, no
   smoothing. Blurry pixel art would be a worse insult than a small
   window.
4. **[LIFTED BY HIM]** This used to say nothing about the game may
   change and that one extra visible cell meant the fix went wrong. HE
   SAID HE IS NOT CONCERNED WITH THAT RIGHT NOW. It is lifted.
5. **IT GETS A GATE THAT OPENS A LAPTOP-SIZED WINDOW**, because we have
   never once done that -- and that gate REPORTS the view difference
   rather than failing on it, so the number exists when he does want it.

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
