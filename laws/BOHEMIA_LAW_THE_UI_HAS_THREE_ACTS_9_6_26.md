# BOHEMIA LAW -- THE UI HAS THREE ACTS, AND EVERY ROUND SHOWS HIM SOMETHING
# (Paolo 9/6/26, LOCKED)
# "Every time I say VAMILY to the UI chat I need to be seeing some sort of creation
# directly within the UI chat... by no means... we're not even like 10% there bro,
# so it should not be implementing so much, focusing on code-wise where things go...
# everything I said when I start changing the UI has to be interchangeable with the
# new look. Remember there's gonna be three different acts of UI. Maybe one's more
# like Fallout 1 inspired, potentially, I don't know, like rustic or something, but
# like 2050 rustic you know. So we gotta do some big research. The middle is gonna
# be kind of like modern and the third act is gonna be futuristic shit. So we just
# need options for all three and I need to keep seeing options."

## 1. EVERY UI ROUND ENDS WITH SOMETHING HE CAN LOOK AT
The UI lane's round is not finished by a commit. It is finished by A PICTURE HE CAN
OPEN: options, side by side, of a thing that could be in the game. Not a plan, not
a refactor, not a note about where code should live. If a VAMILY to that chat ends
without something to look at, the round did not happen.
- **OPTIONS, PLURAL, EVERY TIME.** He said "I need to keep seeing options". One
  candidate is not options. Three to five, different from each other, on one sheet.
- **THIS DOES NOT SUSPEND HIS ORDERS.** The 50% shrink, killing the city and map
  buttons, the tutorial ask and the opening order are instructions, and they get
  built. This law governs what the lane does with the REST of its round.

## 2. STOP PLUMBING. WE ARE NOT TEN PERCENT THERE.
"It should not be implementing so much, focusing on code-wise where things go."
The look is nowhere near settled, so architecture work aimed at today's look is
work aimed at something that is going to be replaced. The lane's weight moves to
DESIGNING AND SHOWING. The one exception is section 3, because without it none of
this can happen.

## 3. THE ONE PIECE OF PLUMBING THAT IS REQUIRED: IT MUST BE INTERCHANGEABLE
"Everything has to be interchangeable with the new look." Every UI element is
drawn from a SKIN -- one named set of shapes, colours, type and sound -- and
swapping the skin swaps the whole interface without touching a single thing about
what the game does. This is the only architecture the lane owes right now, and it
is what makes three acts possible instead of three rewrites.

## 4. THREE ACTS, THREE LOOKS
The interface changes across the game's three acts. His directions, recorded as he
gave them, including how firm each one is:
- **ACT ONE: "maybe Fallout 1 inspired, potentially, I don't know, like rustic,
  but 2050 rustic."** Marked as a DIRECTION TO RESEARCH, not a locked choice; he
  said maybe and potentially. FALLOUT 1 enters the reference set as of 9/6, named
  by him, and it belongs to the INTERFACE department only (the 9/5 one-department
  law; FINAL FANTASY X, the 8/26 interface study, is the other one there).
  What the research says that reference actually is, so nobody copies a green
  screen and calls it done: its interface was built as an IN-WORLD OBJECT rather
  than an overlay, deliberately clunky, "kind of hacked together" and "not all
  that dependable", because the world was not quite working. Monochrome screens,
  physical controls, industrial casing, oversized proportions, analogue graphics:
  advanced enough to do the job, mechanical enough to belong to an older idea of
  the future. THAT is what makes it read, not the colour.
  Sources: [designing for survival: the Pip-Boy as dystopian interface](https://medium.com/@ilke.sanli/designing-for-survival-interface-design-in-dystopian-worlds-through-fallouts-pip-boy-d35dfac21c71),
  [Pip-Boy, and Boyarsky on old clunky technology](https://en.wikipedia.org/wiki/Pip-Boy),
  [retro-futurism in the series](https://fallout.fandom.com/f/p/4400000000003698342).
  "2050 RUSTIC" IS HIS PHRASE AND IT IS THE HARDER HALF: not 1950s retro-future,
  but a 2050 that has gone rustic -- our own era's technology worn down, repaired
  by hand, and kept alive past its life. Nobody has drawn that. That is the
  research.
- **ACT TWO: modern.** The interface of the world as it is now, working.
- **ACT THREE: futuristic.** Recorded as he said it; the shape is open.
Every act's look is judged by DIRECTION against the world before it reaches him,
and all three must run on the same skin system from section 3.

## ROUTING
- UI: [show options] as a standing duty; [skin swap]; [three acts] research.
- DIRECTION: a look card per act, so COOK and UI cook to something.
- The reference list in CLAUDE.md gains FALLOUT 1 = interface, 9/6, Paolo.
