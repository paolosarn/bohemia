# E27 [best cut]: THERE IS NO BETTER CUT TO GO BACK TO

EYES AND EARS, lane 17, E27 [best cut]. 9/20/26. Rule 18(d).
His words: records/BOHEMIA_PAOLO_WANTS_TO_RESTART_9_20_26.md.
Law: laws/BOHEMIA_ADDENDUM_THE_PLAYABLE_CUT_9_20_26.md.

---

## THE QUESTION HE ASKED

> "I just want to restart all of this, keep our assets and start all over. I really need your
> help to not do that because I can't be showing this to people... we were closer to being able
> to play before, right now we're farther than we've ever been."
>
> "There are some points in this development where we were closer to being able to play."

Rule 18(d) gave this lane the job of testing that claim: rank the deployed cuts of the last two
weeks by one walk, name the best, name where it got worse, and RUN reverts to the good one.

**The honest answer is that there is no good one to go back to, and I would rather say that than
nominate a winner that is not one.**

---

## WHAT I MEASURED

Eight RUN build stamps across two weeks, each one CUT THE WAY THE DEPLOY CUTS IT (the cutter run
in a throwaway worktree at that sha, so nothing of RUN's is touched), each walked for the same 90
seconds, on a phone-shaped CPU with the throttle proved real in every single run.

```
  PASS ONE                              PASS TWO
  cut     stamp     frozen    worst     frozen    worst
  9/13za  9/13za    86,430   33,059     85,588   32,827
  9/14p   9/14p     86,320   33,157     86,623   32,976
  9/15m   9/15m     86,946   33,019     86,896   41,364   <- flipped mode
  9/15s   9/15s     85,976   32,657     86,455   32,734
  9/16f   9/16f     86,732   41,873     86,307   33,370   <- flipped the other way
  9/18a   9/18a     86,702   41,015     86,230   41,219
  9/18c   9/18c     86,810   41,415     86,322   40,959
  now     9/18g     86,760   41,179     85,511   40,721
                                (all figures ms, out of a 90,000 ms window)
```

**Every cut of the last two weeks is frozen for 95.0% to 96.6% of its first ninety seconds.**
Best to worst across the whole fortnight is 1,385 ms out of 90,000 — one and a half percent of
the window. There is no cut in this fortnight that was meaningfully closer to playable on this
measure.

**And the ranking will not hold still, which is the strongest part of the answer.** In pass one
the least-frozen cut was 9/15s; in pass two it was 9/18g, the newest one. The gap between best
and worst is smaller than the noise on a single cut, so the ORDER is a coin toss. When a ranking
reorders itself on unchanged code, the honest report is not a winner, it is that the things being
ranked are the same.

**And walking is broken on all eight.** A four-second held press on the walk dial moves between
0.1% and 2.7% of the screen. The dial was found and pressed every time; the control that asks
that is green on every cut. At phone speed you effectively cannot walk on any of them.

---

## THE ONE THING THAT LOOKED LIKE A REGRESSION, AND WHY I AM NOT NAMING A COMMIT FOR IT

The worst single freeze sits at 32.7 to 33.2 s for the first four cuts and 41.0 to 41.9 s for the
last four. An eight-second jump, with the break falling between 9/15s and 9/16f. That looks like a
regression and it lines up neatly with the calendar, which is exactly why it is worth distrusting.

**I bisected the 55 commits in that window, and it is not monotonic**: 9/15s 32.7 s, then a commit
thirteen in at **40.3 s**, then one at twenty-seven back down at 33.2 s, then one at forty-one at
32.6 s, then 9/16f at 41.9 s. Low, high, low, low, high. No single commit does that.

**So I ran the same sha four times.** BUILD 9/16f, identical code, identical everything:

```
  41,873 ms    32,113 ms    32,728 ms    33,040 ms
```

**One run in four lands in the high mode.** The worst-freeze number is a coin flip between about
33 s and about 41 s on unchanged code. It is not a property of any commit, and a single sample of
it can rank nothing. Four cuts on one side and four on the other looked like a trend and was luck.

**And the second full pass proved it from the other direction: two cuts swapped sides.** 9/15m
read 33,019 ms in pass one and 41,364 ms in pass two; 9/16f read 41,873 ms and then 33,370 ms.
Same shas, same cutter, same scorer, opposite answers. Whatever the 41-second mode is, it does not
live in the code.

I was one step from naming a commit for RUN to revert. The repeat test is the only reason I did
not.

**The frozen total, by contrast, is solid**: across every cut and every repeat it sits between
85,976 and 86,946 ms, a spread under 1%. That is the number this ranking rests on.

---

## WHAT THIS MEANS FOR RULE 18(d)

The rule says the best cut becomes the reference and what regressed gets reverted. **On this
measure there is nothing to revert to.** Reverting to 9/15s would buy 1% of a frozen window and
would throw away everything built since for no measured gain.

The freeze is not a regression that crept in. **It has been there the whole fortnight**, at the
same size, on every cut. What changed is that he opened it and looked.

If a reference cut is still wanted, the two passes disagree about which one it is (9/15s, then
9/18g), which is the answer: **pick the newest, because nothing measurably better exists behind
it.** That is also the cheapest answer, since it means no revert and nothing thrown away.

---

## WHAT I DID NOT MEASURE, STATED

This scores loading, freezing and whether a held press moves the world. **It does not judge
pictures**, so if "closer to being able to play" was about the car, the streets or the far zoom,
this ranking has nothing to say about it and should not be read as if it did. It does not play a
fight. It is 90 seconds, not five minutes, so it is weighted toward the boot, which is where the
freezing is: over a full 300 seconds the frozen share is about a third, not 96%.

---

## THE MISTAKES THIS ROUND, ALL FOUND BY CONTROLS OR BY REPEATING

- **The frozen total came out at 186 seconds inside a 90-second window.** Impossible on its face:
  the heartbeat is armed before any page script, so it was also running through the yardstick's
  own busy loops, and the shell's freezes were being added to the frame's. The clock resets at
  navigation now and the two threads are reported separately.
- **The movement control was backwards.** It painted the game's canvas and re-sampled it, so on a
  cut that was RUNNING the game repainted and erased the paint: the control failed on the healthy
  cuts and passed on the frozen ones. It was measuring "did the game repaint". Split into a
  comparator proved on synthetic arrays and a check that the canvas sampled is the real one.
- **"The world did not move" was published before I checked a dial had been found.** It is
  recorded now, so nothing pressed and nothing moved are different answers.
- **Time-to-tappable came back null every time**, because the poll ran eight seconds against a
  thread frozen for thirty. Recorded from inside the page now.
- **And my own runner ate its results file.** It opened with a truncate, so the repeat test wiped
  the eight-cut pass and the bisect. A results file that only holds the newest run cannot be
  compared with anything, which is the entire job here. It appends now, with a run tag.

## PROOF

- `tools/bohemia_eyes_best_cut.js`, five controls, three wrong versions in its own docstring
- the eight cuts, the three-point bisect and the four repeats of 9/16f
- every cut produced by the repo's own cutter at that sha, in a throwaway worktree
