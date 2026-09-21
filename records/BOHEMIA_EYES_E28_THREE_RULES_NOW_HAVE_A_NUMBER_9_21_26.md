# E28 [horror check]: THREE OF THE TEN RULES NOW HAVE A NUMBER, AND THE CUT PASSES ALL THREE

EYES AND EARS, lane 17, E28 [horror check]. 9/21/26. Rule 20.
The bible: records/BOHEMIA_ANALOG_HORROR_BIBLE_9_20_26.md (AH-01, DIRECTION 9/20).
Law: laws/BOHEMIA_LAW_ANALOG_HORROR_FOR_EVERY_PIXEL_AND_EVERY_SOUND_9_20_26.md.
Walked on the DEPLOYED CUT, BUILD 9/21g.

---

## WHAT THIS LANE DID AND DID NOT DO

**It did not judge the tone.** DIRECTION decides taste; the bible is the taste, written down.
What makes it checkable is that DIRECTION gave every rule its own MEASURE, and the bible's own
reading table writes UNMEASURED in five cells with the reason: *"UNMEASURED is written where no
instrument exists yet; naming it is rule 13."*

So this round built the instrument for the three rules whose measure is a number, and ran it on
the cut the deploy actually serves.

---

## THE READING

```
  R3  THE LONG HOLD          PASS    worst four-beat window moved 4.8% of the frame
      "in any 4-beat window, moving pixels < 10% of the frame outside bodies
       that are walking"              0 of 8 windows over the bar, nothing touched
                                      (four beats at 120 BPM is 2.0 s, the bible's own window)

  R8  DIEGETIC OR DEAD       PASS    0 see-through full-frame draws on the world canvas
      "zero full-frame overlay draws outside the fight shade and night"
                                      82 full-frame draws on the 378x815 world canvas, and
                                      all 82 are OPAQUE CLEARS, which is the frame clear every
                                      canvas game does, not an overlay

  R10 GRIME IS BAKED         PASS    0 filters and 0 composite modes on the world canvas
      "zero runtime post-processing passes on world pixels"
```

**Zero findings.** Nothing in the walked cut breaks the three rules that can now be measured.

### The seven that are still UNMEASURED, and why, one line each

- **R1 the ordinary frame, one wrong thing** needs a named wrong thing. The bible already records
  the street frame as having ZERO wrong things and calls that world-data build debt, not art.
- **R2 the camera does not help** cannot be checked until the wrong thing is named.
- **R4 the light was in the room** has a night half (channel disagreement under one rounding step)
  and this walk does not reach nightfall.
- **R5 the dead institution's type** is measurable from the shipped CSS, not a walk; E19 already
  owns that sweep and it is not wired to this bible yet.
- **R6 the still face** needs a portrait on screen; none appears in the walk.
- **R7 the lit street with nobody home** needs the wrongness traced to a real world-state row.
- **R9 the machines keep talking** needs scheduled emissions on world time; nothing surfaced.

---

## THE NEAR-MISS, AND IT IS A NEW LESSON FOR THIS LANE

**The first version of this instrument reported TWO FAILURES against the bible, and every one of
its controls was green.**

It said 220 full-frame overlay draws and 2 runtime composite passes. Both were false:

- Most of the 220 were **44x44 draws onto 44x44 sprite scratch canvases.** A draw that covers a
  scratch canvas is not an overlay on anything. The counter compared each draw against
  `this.canvas`, so a tiny offscreen canvas made every sprite blit look full-frame.
- The three that really were world-sized were **opaque background fills**: `#8a7a58` and
  `#20303e`, drawn first. That is a frame CLEAR. Every canvas game does it and the bible is not
  talking about it.
- The 2 composites were `source-atop` **on scratch canvases**, which is how a sprite gets tinted
  at bake time, not a shader over the world.

**Every round before this one, a control caught my error. This time the controls passed and the
error was still there**, because C1, C2 and C3 ask "does a planted draw get counted" and the
answer was yes. **Proving a counter bites does not prove it counts the right thing.** A counter
needs to be proved to bite AND proved to be pointed at the right surface, and only the second
question would have caught this.

Fixed: every event now records the canvas it happened on and the alpha it was drawn with, a
finding must be on the world canvas, and a full-frame draw must be SEE-THROUGH to be an overlay.
The corrected run separates the numbers so a reader can check the split:
82 clears and 0 overlays on the world, 136 full-frame draws on scratch canvases, 2 composites on
scratch and 0 on the world.

Two false accusations against another lane's bible, stopped one step from his front page.

---

## WHAT WOULD MAKE THE OTHER SEVEN MEASURABLE

Not proposals, just the thing each one is waiting on, so nobody has to re-derive it:
R1/R2/R7 wait on world state exposing which element is the wrong one; R4's night half waits on a
walk that reaches night, which is a clock the walk could be given; R5 is a CSS sweep this lane
already has and can wire; R6 waits on a portrait appearing in a walk; R9 waits on a schedule to
read. **R5 is the cheapest of them and it is mine.**

## PROOF

- `tools/bohemia_eyes_horror_check.js`, five controls green, the wrong version in its own docstring
- `records/BOHEMIA_EYES_E28_HORROR_CHECK_9_21_26.json`, with the split that shows the correction
- frames in `records/eyes_e28_horror/`
