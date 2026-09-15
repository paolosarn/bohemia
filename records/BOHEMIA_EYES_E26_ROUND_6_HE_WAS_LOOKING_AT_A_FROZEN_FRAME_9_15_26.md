# THE STRANGER'S LIST, ROUND 6: HE WAS LOOKING AT A FROZEN FRAME

EYES AND EARS, lane 17, E26 [five minutes], STANDING. 9/15/26.
Law: laws/BOHEMIA_ADDENDUM_THE_FIVE_MINUTES_9_13_26.md (Paolo 9/13, LOCKED).
His play: records/BOHEMIA_PAOLO_PLAYED_THE_DEMO_AGAIN_9_15_26.md (9/15, on the 9/14p cut).
Charter: laws/BOHEMIA_ADDENDUM_EYES_AND_EARS_9_4_26.md. Mode: SCHOOL THEN CHECK.

---

## HE PLAYED THE CUT THIS LANE WALKED, AND TWO OF HIS SENTENCES ARE MEASURABLE HERE

> "I didn't see a single human being. Very strange."
> "I don't even know how to engage in combat and when that shit starts."

The routing note left the first one as an open premise and said so: *"LIFE+CITY [more people]
shipped 13 of 16 walks meet a crowd; his walk was one of the three, or the crowd loads after he
has already looked."* Nobody had measured which. **A gate is green and the man playing it saw
nobody, so one of those two numbers is measuring something he cannot see.** Saying which is
this lane's whole job. The fix is PEOPLE's and COMBAT's; the number is mine.

---

## ANSWER ONE: THE PEOPLE ARE THERE, AND HE WAS LOOKING AT A FROZEN FRAME

Everything below is timestamped **by the page itself**, not by when I looked, and all six
controls are green.

```
  0.5 s   the shell draws its first thing
  5.6 s   the city draws its first thing
  9.4 s   THE GAME FREEZES FOR 6.0 SECONDS
 13.8 s   the first human body is painted (off the edge of the screen)
 17.2 s   THE FIRST HUMAN BODY LANDS INSIDE THE SCREEN
 20.5 s   THE GAME FREEZES FOR 11.1 SECONDS
```

**His bar, from the routing note, is a person on screen within ten seconds. It is 17.2 s. Not
met.** And the first person arrives three seconds before an eleven-second freeze. In a second
run the freeze was 13.7 s and started at 17.2 s, the same second the first body landed. Either
way the first appearance of people in this game happens inside, or on the lip of, a freeze
long enough that a player reads it as broken.

**Total frozen: 28.9 seconds out of the first 300, across 42 separate freezes.** That is the
measured form of his other sentence, *"it's kinda not running as smoothly as I was I would
like maybe it's cause things are loading in real time."* It is not a feeling. The thread stops.

**And the existing gate is not lying.** Once the build is done, people are painted on EVERY
sample, 135 of 135, up to 20 bodies at once, and every single one of the 1,130 body draws lands
INSIDE the screen rectangle, not beyond the cull. The engine's own list agrees, up to 11 near.
So the premise in the routing note resolves to its second branch: **the crowd loads after he
has already looked, and the game is frozen when it arrives.** Nothing needs to be added to the
population. Something needs to happen earlier, and the freeze needs to not be there.

### Why nobody could have seen this from outside before

There is one main thread. While the city build holds it, no outside observer can read anything
and the game cannot paint either. My first look could not land before 22 s no matter what I
did. So the instrument stopped trying to look from outside during that window and instead
**armed a heartbeat and a draw-timestamp inside the page before any page script ran**, and the
page reports the moment itself.

---

## ANSWER TWO: 55 FIGHT WORDS EXIST IN THE DEMO AND A PLAYER CAN READ ZERO OF THEM

In five minutes, nothing a player could read ever mentions a fight, an enemy, an attack, or a
hostile. Not once.

It is not that the words were never written. **Fifty-five of them are in the page right now.**
"THE FIGHT IS OVER". "YOU SWING AND MISS". "STREAK 0 - ENEMIES 3". Every one of them is inside
a hidden panel: the sound factory, the fight's own dev controls, zero-sized and display-none.

So his sentence is exactly right, and it is not a missing-words problem. The words are written
and they are behind a door he never opens.

---

## THE MISTAKES THIS ROUND, ALL THREE, AND THEY ARE WHY THE NUMBERS ABOVE CAN BE TRUSTED

**v1 reported its own start-up as the game's number.** It polled for the people pass after
clicking the front screen, the click blocks for about twelve seconds while the city builds, so
the wrap landed at 21.3 s and it announced "first body painted at 23.7 s, his ten-second bar
not met". 23.7 s was simply the first time I looked. **That is the same defect as round 4's
false zero, two rounds running**, and the only reason it did not reach his page is that a
control asked whether my first look came before the bar I was judging.

**v2 tried to fix it with a property trap armed before the page ran, and the trap did not
take.** Controls said so immediately: the people pass ran zero times. The cause is a plain fact
about JavaScript I should have known, that a global `function` declaration redefines the
property outright instead of calling an accessor's setter. v2 also still first looked at 20.9 s,
which is what taught me the real limit above.

**And the word sweep read hidden text.** It reported "something says FIGHT at 21.9 s", which
would have answered his complaint with words he cannot see. That is the same error as calling a
hidden control a working button. The sweep keeps only visible, sized, in-viewport leaf text now,
and it reports both numbers so the gap is the finding.

### The controls, all green

```
C1  the real people pass is the thing being counted
C2  a planted draw inside the pass is counted (so a zero body count is not a blind counter)
C3  draws outside the pass are not attributed to people (54,911 of them, none in the body count)
C4  a planted fight word is found by the same sweep that reports none (so the zero is real)
C5  the first-body moment is timestamped inside the page, earlier than my first look
C5b the blind window is stated as a number, not filled with a guess
```

---

## BLIND SPOTS, STATED

This does not judge pictures, so his three sentences about the car and the far zoom are not
mine to answer and I have not tried. I cannot see the first 22 seconds from outside and I say
so rather than estimating it. "A body painted inside the screen rectangle" is not the same as
"a body a person notices" -- at the far zoom a body is a few pixels, and this instrument counts
it the same as one filling a quarter of the screen. That is the next thing to measure, and the
way to measure it is the body's drawn size against the screen.

## PROOF

- `tools/bohemia_eyes_a_human_being.js` (new), six controls green, three wrong versions written
  into its own docstring
- `records/BOHEMIA_EYES_E26_A_HUMAN_BEING_9_15_26.json`, two independent runs agreeing
- the hidden-word hand check: 28 fight elements enumerated with their visibility and rectangles
