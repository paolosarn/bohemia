# THE STRANGER'S LIST, ROUND 5: A CLOSE IS NOT A YES

EYES AND EARS, lane 17, E26 [five minutes], STANDING. 9/15/26.
Law: laws/BOHEMIA_ADDENDUM_THE_FIVE_MINUTES_9_13_26.md (Paolo 9/13, LOCKED), rule 14(h).
Charter: laws/BOHEMIA_ADDENDUM_EYES_AND_EARS_9_4_26.md. Mode: SCHOOL THEN CHECK.

---

## THE RULE THAT LANDED ON THIS INSTRUMENT

Rule 14(h) went on the front page after my last push, from QUESTS:

> IN THIS GAME A DEAD BUTTON IS INDISTINGUISHABLE FROM A CLOSE BUTTON, because a card closes on
> any tap it does not recognise and a screen diff reads the vanished card as life. Any "does
> this control work" check must require THE PANEL TO STILL BE OPEN and its words to have moved,
> or it measures nothing.

My noise ledger from last round fixed FALSE DEATH: the world repainting on its own and getting
credited to a finger. **It does nothing at all about FALSE LIFE**, because a card vanishing is
novel movement by any measure you like. Both halves were needed and I had one.

So the verdict now reads the PANEL the control lives in, not the screen: the nearest ancestor
that behaves like a card, and that panel's own words. Three answers instead of two:

- **DID SOMETHING** the panel is still open AND its own words moved AND at least one moved word
  has never been seen moving with nobody touching the screen.
- **THE PANEL CLOSED** the panel it lived in is gone. This press proves nothing, in either
  direction, and it is never scored as working or as dead.
- **DID NOTHING** the panel stayed open and nothing new happened inside it, twice.

### THE 14(h) CONTROL CAUGHT A HOLE IN MY OWN 14(h) FIX, ON ITS FIRST RUN

A third button is planted now, in its own panel, that removes that panel. It must read THE
PANEL CLOSED. **On the first run it read "did nothing"**, which is the exact failure 14(h) is
about, one level deeper: once the panel is gone, the same screen point belongs to whatever is
underneath it, so press two measured a different element entirely and agreed with itself that
nothing happened. Two presses of two different things is not two presses. A press that closes
the panel now ends the pair immediately.

```
DEAD READS DEAD     a planted button with no handler        -> "did nothing"        GREEN
A CLOSE IS NOT A    a planted button that removes its panel -> "THE PANEL CLOSED"   GREEN
  WORKING BUTTON
ALIVE READS ALIVE   a planted button that writes one word
                    INSIDE its own panel                    -> "did something"      GREEN
                    all three with the world running and the clock ticking
```

---

## AND I HAVE TO CORRECT MY OWN ITEM 3 FROM LAST ROUND

Last round I wrote: *"GET UP works on the first press and does nothing on the second, which is
exactly right for a control that fires once."* **That was wrong, and it was wrong in the way
14(h) predicts.** GET UP closes the day card. My old test saw the card vanish, called that
movement, and credited the button. Under the panel test it reads THE PANEL CLOSED, twice
measured, panel `#daycardIn`.

To be fair to the game: a card closing when you tap GET UP is probably correct behaviour. The
honest statement is that **my instrument cannot confirm it either way**, and that is a limit of
the test, not a defect in the game. What I will not do again is print it as a pass.

---

## WHAT THE PANEL TEST FOUND, TWICE, ON THE DEMO HE PLAYS RIGHT NOW

THREE dead rows on the day card, not two. Each 320x44, each inside the card, panel still open,
nothing new inside it, both presses, on two independent walks:

```
Half of it now, before I go
I will go first, on something small
I'LL TAKE IT
```

**These are the deal shapes, and the words they are supposed to turn into are already written.**
The world file carries `say` and `agreed` for each one: "Half of it now, before I go" is meant
to become "Half now. And you are holding it if you walk"; "I will go first, on something small"
is meant to become "You go first. If they walk, it was cheap to find out". A word change inside
the panel is exactly what this test looks for, and it does not happen. The mechanism is there
(`n.said = sh.agreed`); the row does not reach it. I am not diagnosing further than that,
because this lane does not write game code and an unproven diagnosis is a guess.

**It is in the LIVE 87% of the bundle, not the frozen shell**, so whoever fixes it is in his
hands the moment they push, with no cut needed. Rule 14(d) in his words: a card that promises
something and does nothing is the worst bug in the game.

---

## THE STALENESS NUMBER MOVED THE WAY IT WAS SUPPOSED TO

Last round: 109 commits behind, the fight carrying a typeface a law bans by name. **This round:
9 commits behind, Space Grotesk 0, BohemiaMono in, and zero failed requests on the walk.** RUN
re-cut at BUILD 9/14p under the amended 14(a) that came out of round 3's measurement. The meter
exists so that number is on the board instead of in one lane's head, and it did its job.

Frozen share 13%, live share 87%, one live file changed since the cut.

---

## THE REST OF THE WALK

Still no fight surface in five minutes, on every walk of every round so far. First tappable
3.2 s. 0 page errors, 2 console errors (was 3), 0 failed requests (was 1).

**The world now writes 18 to 27 words by itself**, up from 12, because the re-cut brought in a
phone line and a "step back and see the city" prompt that come and go. The ledger absorbs them,
which is the point of a ledger over a fixed list: it grows with the game instead of going stale.

The build-panel control stays RED. Those two named buttons are still in the game and my route
still cannot reach them, so I say nothing about them rather than scoring them.

---

## BLIND SPOTS, STATED

This instrument does not judge pictures, so it cannot see the streets break or the freeway
break. The route never reaches PRETTY MAP or DROP IN, or the build panel. The watcher is not a
stranger, so the list never claims naivety. The named list only names what an earlier round
happened to press, so coverage is a floor and never a total. And the panel finder takes the
nearest card-shaped ancestor, so a control whose effect lands in a DIFFERENT panel will read as
dead here; that is a deliberate trade for killing false life, and it is the next thing to
measure.

## PROOF

- `tools/bohemia_eyes_five_minutes.js`: the panel test, three planted controls, a close ends
  the pair
- two independent walks of BUILD 9/14p, same three dead rows, same close on GET UP
- `gates/demo_staleness_meter.js` 109 -> 9 commits behind, fight font clean on both surfaces
- `records/BOHEMIA_EYES_E26_WALK_DEMO_9_14_26.json`, shots in `records/eyes_e26_walk_demo/`
