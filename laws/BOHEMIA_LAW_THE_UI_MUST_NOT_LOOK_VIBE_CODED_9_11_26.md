# BOHEMIA LAW -- THE UI MUST NOT LOOK VIBE-CODED (Paolo 9/11/26, LOCKED)
# "I need the UI to run as far away as possible from the standard look of vibe-coding
# with Claude right now. People can look at it and be like, yep, that was coded. Do
# big brain research or whatever you need to do, even down to the font, whatever you
# gotta do, but it can't be looking like it's vibe-coded. You can tell when a UI is
# done with a vibe-coding app."

## 1. THE TELLS, FROM THE RESEARCH (what people say gives it away)
- **The fonts.** Inter, Poppins, Space Grotesk, Geist, and monospace for everything.
  A model reaches for them the way a tired writer reaches for "utilize".
- **Dark mode as the reflex.** Named as the single most common tell.
- **A grey one-pixel border on every card.** And a rounded card around every block,
  cards inside cards ("the cardocalypse").
- **Purple-to-blue gradients, glow, "dark plus glow equals premium."**
- **Small uppercase letter-spaced labels on everything.**
- **Exactly three feature cards in a row, by reflex.**
- **Emoji as icons inside buttons.**
- Why: a model produces the statistical average of what it was trained on instead of
  making a choice, so the output is instantly recognisable as nobody's decision.
Sources: [7 signs a UI has been vibe coded](https://www.thefountaininstitute.com/blog/signs-vibe-coded-ui),
[AI design slop: 16 patterns that out your app](https://www.developersdigest.tech/blog/ai-design-slop-and-how-to-spot-it),
[AI slop fonts and gradients: the tells](https://www.925studios.co/blog/ai-slop-design-tells),
[why your vibe-coded app looks like every other AI app](https://thecrit.co/resources/vibe-coding-design-guide),
[why your AI keeps building the same purple gradient website](https://prg.sh/ramblings/Why-Your-AI-Keeps-Building-the-Same-Purple-Gradient-Website).

## 2. OURS, COUNTED (the two files that draw his screen)
```
                              city file    alpha shell
Space Grotesk (a named tell)       10             0
monospace, for everything          28           150
one-pixel borders                  70            74
rounded corners (3 to 9 px)        63+           52+
gradients                          11            20
letter-spaced uppercase labels     91            97
emoji inside buttons               24             3
dark mode                       always        always
```
We carry every tell on the list except the purple gradient and the three cards. He
can tell, because it is true.

## 3. THE LAW
- **NONE OF THE TELLS SURVIVE.** No default font (the font is a decision made from
  research and from the act cards, and it is never Inter, Poppins, Space Grotesk,
  Geist, or monospace-for-everything). No one-pixel grey border as the way to draw an
  edge. No rounded card as the way to group things. No gradient-and-glow. No
  letter-spaced uppercase as the way to label. No emoji as an icon.
- **THE LOOK COMES FROM THE WORLD, NOT FROM A COMPONENT LIBRARY.** His three acts
  law already says act one's interface is an in-world OBJECT, 2050 rustic; the
  reference for that department is built as a thing that exists in the world,
  clunky, hand-repaired. An edge is a thing's edge. A label is painted, stamped,
  scratched or lit, the way a label is on an object. A panel has thickness (the
  phone already does). Dark is a choice per act, not the default.
- **THE FONT IS RESEARCHED.** What a worn 2050 device would actually display, what a
  stamped label on a casing looks like, what survives at phone size in pixels; then
  chosen, then compared to real objects, then judged by DIRECTION.
- **A GATE COUNTS THE TELLS** and fails on any of them in a shipped surface: named
  fonts, one-pixel borders as edges, rounded cards, gradients, letter-spaced
  uppercase, emoji in controls. The numbers above are the baseline; the target is
  zero.
- **THIS DOES NOT SLOW THE LANE.** Options every round, as ruled 9/6; every option
  sheet from now is judged against this list before he sees it, so he never picks
  from five things that all look coded.

## ROUTING
- UI: [no slop] as the standard every option is held to, and the tell count as the
  first measurement; the skin system carries the new look.
- DIRECTION: [the font] and the object language, into the act cards.
- EYES AND EARS: [slop count], school then check, the gate.
