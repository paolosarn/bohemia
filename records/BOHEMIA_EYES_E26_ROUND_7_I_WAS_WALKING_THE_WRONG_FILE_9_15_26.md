# THE STRANGER'S LIST, ROUND 7: I WAS WALKING THE WRONG FILE

EYES AND EARS, lane 17, E26 [five minutes], STANDING. 9/15/26.
Law: laws/BOHEMIA_ADDENDUM_THE_FIVE_MINUTES_9_13_26.md, rule 14(a) as amended 9/15.
Charter: laws/BOHEMIA_ADDENDUM_EYES_AND_EARS_9_4_26.md. Mode: SCHOOL THEN CHECK.

---

## THE HEADLINE: SIX ROUNDS OF THIS LIST WERE WALKED ON A FILE NOBODY IS EVER SERVED

UI corrected its own claim (5bed08dd) and the deploy workflow says it in a comment dated 8/26:
`.github/workflows/pages.yml` runs `tools/bohemia_cut_the_demo.js` **as a build step**, so the
demo at the one link is re-cut from the alpha on every push. What he taps is always the alpha's
tip. The only thing that can lag is the **committed** `slices/BOHEMIA_DEMO.html` on disk.

**That committed file is exactly what every stranger-list walk of mine has been opening.**

I did not take it on trust. Rule 12: a dependency on a line is a premise, so measure it.

```
the cutter, run in an isolated git worktree so nothing of RUN's was touched:
  what the deploy serves    BUILD 9/15o    5,227,003 bytes    (matches the alpha exactly)
  the committed file        BUILD 9/15m    5,224,906 bytes
  and the cutter's own --check: "NOT a cut of the current workshop", 2,097 bytes apart
```

So the surface was wrong, and two things follow.

### CORRECTION ONE: A FIGHT IS REACHABLE IN ABOUT TWO MINUTES, AND I SAID OTHERWISE SIX TIMES

"No fight surface in five minutes" has been on his front page every round since this job
started. **On the surface he actually plays, the walk reaches a fight at about 02:05, twice,
photographed.** The screenshot is `records/eyes_e26_walk_deploy/04_04_cards.png`: a board, two
figures, "desperate scavenger shakedown", ENGAGE, a compass ring, RUN, GREN 2, RIFLE, 100/100.

COMBAT's number was right and mine was wrong, and the reason was never the game. It was the file.

### CORRECTION TWO: THE STALENESS METER WAS AIMED AT THAT SAME FILE

It printed "109 commits behind" and the sentence *"the five minutes he judges by is this old"*.
The count was true of the committed file; **the sentence was false**, because the demo at the
link cannot be stale. That sentence is deleted. The meter now says what the number is: how far
the committed file lags the alpha it is generated from, which is bookkeeping a gate already
watches and which is the file every lane's local walk opens. Not a number about what he plays.

---

## AND THE NEW FINDING, PHOTOGRAPHED AND REPRODUCED TWICE

**THE FIGHT SHOWS THE DEVELOPER'S CONTROL STRIP TO THE PLAYER.** Across the top of the fight
board, above the health bar:

```
WAIT      SUPPRESS      HAND-PEEK: OFF      NEW ENCOUNTER      WAY OUT 13T
```

Four of those five do nothing when pressed, measured under rule 14(h) with the panel test:
the panel stayed open and nothing inside it changed, both presses, in both walks, at the same
timestamps to within a second. "NEW ENCOUNTER" is the one whose own name says developer. And
the strip pushes the gear's settings panel off the top-left corner, where it reads as the
clipped fragment "TTINGS".

**Why it ships:** the cutter removes dev TABS. It never touches the fight's insides, and says so
in its own docstring: the demo NEEDS the fight, so `COMBAT_B64` goes across whole. The strip is
inside that blob (`peekbtn` = "HAND-PEEK: OFF" and the rest, six to ten hits each), so it ships
to every player. Nothing is broken about the cutter; nobody ever asked it to do this.

This is a candidate for the thing he described as *"this glitchy buggy AI experience where
nothing's complete"*: the first fight in the game, with the tools used to build it left on
screen. Routed to COMBAT as `[eyes: dev strip]`, which is this round's one bounce-back.

---

## THE LIST ON THE RIGHT SURFACE, TWO WALKS AGREEING

```
first tappable                       3.4 s
a fight is met                       about 02:05      (it was "never" on the wrong file)
dead controls                        6                (it was 3 on the wrong file)
  Half of it now, before I go        320x44, the day card, dead for the fourth round running
  WAIT / SUPPRESS / HAND-PEEK: OFF / NEW ENCOUNTER    the fight's dev strip
  E                                  one compass direction of eight
closed the panel, so proves nothing  2 to 3           GET UP, "I will go first...", DONE
page errors                          0
console errors                       2
failed requests                      0
```

"I will go first, on something small" was DEAD on the committed file and CLOSES THE PANEL on the
real one. That is the surface mattering again, on a row I published.

---

## BLIND SPOTS, STATED

A walk of the deploy cut is a walk of a cut made *on this tree*, not a fetch of the live site --
the site is not reachable from here, so this is the closest honest thing and I say which it is.
This does not judge pictures. The two named build-panel buttons are still off my route and the
control that asks stays red. And one thing I could not establish: a second, targeted script
tapped the card rows and walked the dial for two minutes and did **not** reach a fight, so the
exact trigger is not pinned down. The fight is real and photographed; how it arrives is not
mine to claim.

## PROOF

- the cutter in an isolated worktree, RUN's file untouched and verified untouched
- `tools/bohemia_eyes_five_minutes.js` takes a third surface, `deploy`, with the cut's path
- two deploy walks agreeing, `records/BOHEMIA_EYES_E26_WALK_DEPLOY_9_14_26.json`
- `records/eyes_e26_walk_deploy/04_04_cards.png`, the fight with the dev strip on it
- `gates/demo_staleness_meter.js` re-aimed, its wrong sentence deleted and the reason written in
