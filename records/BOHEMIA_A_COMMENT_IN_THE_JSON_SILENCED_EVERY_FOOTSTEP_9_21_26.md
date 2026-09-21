# A COMMENT IN THE JSON SILENCED EVERY FOOTSTEP (9/21/26, SOUNDS lane)
## Walking has made no sound since 9/15, and a gate was saying so the whole time

> **PAOLO 7/31, quoted in the function's own comment: "I don't hear no sound for the steps
> that I'm making."** That was fixed. It broke again on 9/15 and the break was a comment.

**WALKING is rule 18 item two, so this is allowed to ship while the lane is held.**
Tab: **RUN**, the walked street. Gate: the suite's own `FOOTSTEP`, **11 passed / 3 failed
before this, 14 passed / 0 failed after.**

---

## 1. THE BUG, IN ONE SENTENCE

The approved footstep bank is embedded in the alpha as
`<script type="application/json" id="sfxApproved">`. On 9/15 a round added a nine-line
`/* ... */` explanation **inside that tag**. JSON has no comments. So `JSON.parse` threw,
the loader's `catch` was **empty**, `STEP_BANK` stayed null forever, and `stepSfx` returned
at its first line every single time it was called.

**The irony is exact: the 9/15 round's comment explains the 9/15 round's fix, and the
comment broke the fix it was explaining.** That round widened the bank from three surfaces
to five so concrete and sand would stop coming out as dirt. The widening was right. The
note about it made all five silent.

---

## 2. HOW IT WAS FOUND, AND THE HONEST PART FIRST

**A GATE WAS ALREADY REPORTING THIS AND NOBODY READ IT.** The suite's `FOOTSTEP` gate was
red, in these words:

    [ 35/675] FOOTSTEP        FAIL     Paolo 7/31: walking MAKES A SO
    FOOTSTEP GATE: 11 passed, 3 failed
    > FAIL: the embedded bank parses and carries every judged step
    > FAIL: the embedded variants are exactly the ones he approved
    > FAIL: WALKING MAKES A SOUND: audio nodes started (15 -> 15)

The first line names the cause outright. **I found this with six hand-built instruments and
the checker had the answer the whole time.**

> **A RED GATE NOBODY READS IS THE SAME AS NO GATE, AND THAT IS A BIGGER FINDING THAN THE
> COMMENT.** The fleet's suite line carries 107 reds. This one was mine, it was named, it
> was specific, and it sat there while the lane shipped four other rounds.

### AND THE SIX INSTRUMENTS, BECAUSE FOUR OF THEM WERE WRONG AND THE WRONGNESS IS THE LESSON
    1. arrow keys at the parent page ...... 0 moves, 0 footsteps. FALSE DEATH.
    2. the one driver, proving movement ... HUNG, no output at all.
    3. arrow keys, with a watchdog ........ 0 moves, 0 footsteps, ran to the end.
       *** AND IT FOUND THE CAUSE OF 1 AND 3: THIS GAME HAS NO ARROW-KEY WALK. The city's
       only keydown handlers are Escape, verified in its source. Two instruments were
       pressing a control that does not exist. ANY LANE DRIVING THIS GAME WITH ARROW KEYS
       IS MEASURING NOTHING. ***
    4. 24 canvas presses, four directions .. 0 moves, 0 footsteps. Still unexplained, and
       recorded as unexplained rather than guessed at.
    5. the city's OWN step function ....... HE MOVED: hx 6218 -> 6255, hy 6268 -> 6251.
       0 footsteps, 0 renders of any kind. Narrowed it to two lanes.
    6. BOTH SIDES OF THE WIRE, one run .... settled it:
           BOHEMIA_STEP messages the city POSTED ....... 39  (of 44 postMessages)
           the surfaces it sent ........................ dirt, and only dirt
           the shell's stepSfx() was CALLED ........... 117 times
           BOH_SFX.render calls of any kind ............ 0
           __STEPBUS ever created ...................... no

Then asked directly, which is what named the line:

    the #sfxApproved tag exists ................. yes, 832 characters
    STEP_BANK ................................... null
    window.__SFX_APPROVED step keys ............. all six, step_dirt = [0,1,2,3,4]

**The data was present in two places and the one the footsteps read had never parsed.**

---

## 3. WHAT CHANGED, TWO THINGS, AND THE SECOND MATTERS MORE

**ONE: THE NOTE MOVES OUT OF THE JSON, WORD FOR WORD.** Not deleted. It explains a real
decision (wood is left out on purpose because no wooden ground exists in the valley,
measured across 18 districts) and **deleting a reason is how the reason gets undone again.**
It is now an HTML comment immediately above the tag, exactly as readable, impossible to
parse. The JSON payload is byte for byte what it was; none of his approved indices were
touched.

**TWO: THE LOADER STOPS FAILING SILENTLY, WHICH IS WHAT ACTUALLY COST THE SIX ROUNDS.**
An empty catch turned a syntax error into a game with no footsteps and no symptom. Now:

- a parse failure is **recorded on `window.__STEP_BANK_WHY`**, with the parser's own
  message, so a checker and a human both see what happened instead of guessing;
- and it **falls back to `window.__SFX_APPROVED`**, the table the rest of the game already
  consults, which was measured holding all six step surfaces.

That second half is REUSE-FIRST doing real work. **Two copies of one truth is what let one
of them rot unnoticed.** The feet can no longer be silenced by the formatting of a
duplicate.

### AND THE FALLBACK DOES NOT QUIETLY UNDO A DECISION
The embedded bank leaves `step_wood` out on purpose; `__SFX_APPROVED` has it. The fallback
is a **last resort for a broken build, not a merge**: it runs only when the embedded bank
fails, and it copies only `step_*` keys so nothing else in the approved table reaches the
footstep path. With the JSON valid it never runs at all, so wood stays out exactly as
ruled. If it ever does fire, a sound missing on purpose is a far smaller problem than a
game with no footsteps, and `__STEP_BANK_WHY` says out loud that it happened.

---

## 4. THE PROOF, AND IT IS SOMEBODY ELSE'S GATE ON PURPOSE

    FOOTSTEP gate, before .......... 11 passed, 3 failed
    FOOTSTEP gate, after ........... 14 passed, 0 failed
    surfaces parsing now ........... 5: asphalt, concrete, dirt, gravel, sand

**The gate that proves this is the one that was already red, not one I wrote this round.**
That is deliberate. A fix verified only by its author's new checker is a fix verified by
nobody, and this particular bug existed because an existing red went unread. The honest
close is to make that same red go green.

The tool also refuses to claim more than it fixed: it parses the payload after removing the
comment and **fails loudly if it still does not parse**, so "the comment was the whole bug"
is a checked statement rather than an assumption.

---

## 5. WHAT THIS DID NOT TOUCH

    his approved indices ............. untouched, byte for byte
    the 65 approved sounds ........... untouched
    the 142 songs .................... untouched
    the footstep LEVEL and limiter ... untouched (0.12 s limiter, 0.12 step gain)
    rule 16's one-step-per-beat ...... NOT DONE, and not this row. See below.
    cooked ........................... nothing

**THE ORIGINAL QUESTION IS STILL OPEN AND IS NOW ANSWERABLE FOR THE FIRST TIME.** The row
`[footsteps on the beat]` asks whether the 0.12 s limiter or the 0.5 s beat governs the
walk. That could never be measured while the count was zero. Now that footsteps happen, the
spacing can be read, and that is the next round's work.

Build stamp: **BUILD 9/21b - THE FEET AND THE ROOM**.
