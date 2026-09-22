# THE FACE ON THE MAP IS HIS, AND THE PEACH DOTS ARE THE POWER
# LIFE + CITY, 9/22/26, row [see me], un-held under rule 18f (his own ask)
# plus his VOTE on this lane's two cooks, answered

> PAOLO 9/22, playing CITY mode at 20:15: **"Why do I not see my person on this
> map? ... what are the peach colored dots that are in different parts of the map
> what are they supposed to be?"**

---

## 1. HE COULD ALREADY FIND THE MARK. HE COULD NOT READ IT AS HIMSELF.

The obvious reading of "I do not see my person" is that the mark is too small or too
quiet. **It is not**, and the numbers were already on file from [white rings] on
9/11: at the zoom his frame was taken at, his mark puts **86 bright pixels** on the
glass against a town's **74**. He is the loudest thing on that screen.

**WHAT THE MARK CARRIED IN THE MIDDLE WAS A FLAT DISC OF SKIN COLOUR.** A brown dot
is not a person. He can find it and still not recognise it, which is exactly the
sentence he said.

## 2. THE ROW ASKED FOR THE WRONG FACE, AND IT WOULD HAVE BEEN A STRANGER

The row says: *"his own face (the same head the pad already wears, faceFor on his
id)"*. Those are two different things:

    faceFor(id)     ROLLS a face out of a hash of the id
    buildSpec()     the face he BUILT in the face maker, which is what the pad wears

Measured in the shell, both baked through the same path:

    his own face   10,584 bytes
    faceFor('you')  8,944 bytes
    identical      NO

So drawing `faceFor` on his pin would have put **a stranger on his map wearing his
own mark**, which is the ONE ID, ONE WHOLE PERSON defect this lane has caught in its
own work four rounds running. The player is now the one id the city bridge does not
roll: he gets his own spec, through the same ramp, the same `renderFace`, the same
64x64 `packIdx`, the same decoder. **One branch, not a second path. Nothing new draws
a face.**

## 3. AND THE SIZE IS ARITHMETIC, NOT TASTE

[white rings] holds one rule on this mark: **he is never fainter than a town**. What
makes him bright is the WHITE ANNULUS, and putting a face in the middle eats it.

**MY FIRST CUT PASSED FOR A REASON THAT WAS NOT A REASON.** Measured before and
after at the three zooms the gate samples:

    TW=48   684 bright pixels  ->  533        a fifth of him gone
    and the gate stayed GREEN, because at TW=48 no town happens to be on screen

**A PASS THAT DEPENDS ON WHAT HAPPENS TO BE ON SCREEN IS NOT A PASS.** At TW=30,
where a town IS on screen, the same loss would have put him at about 100 against a
town's 236.

So the head grows by exactly what the face takes: a face of radius `f·r` leaves an
annulus of `π·r²·(1−f²)`, so scaling `r` by **1/√(1−f²)** puts the white area back
where it was. Nothing is picked; change the face fraction and the growth follows it.

Measured after:

                     before      after
    TW=18  you          86          86     (a face this small is not a face: he
           town         74          74      stays a clean disc under 14 px)
    TW=30  you         260         375
           town        236         236
    TW=48  you         684         935

**HE GOT LOUDER, NOT QUIETER**, and inside his head there are now **30 and 53
colours** where a flat disc is one.

## 4. THE PEACH DOTS ARE THE BEST INFORMATION ON THAT SCREEN AND NOTHING SAID SO

**2,434 lamp cells on his map, 264 of them live.** LIGHT IS TERRITORY (7/20): a
street lamp is queued only where the circuit under it is live, so the peach dots are
a map of **which parts of the valley still have power, and whose wire it is**. He was
looking at the one picture that answers "who runs what" and nothing told him.

It goes in the readout the panel already has — *"(15,41) ARTERIAL · protected"* —
never a popup (rule 19). Tapping one now says:

    a street lamp, lit after dark, on MOB's wire
    a street lamp, out: MOB's wire went dark here
    a street lamp with no wire under it: this stretch never lights

**And it is the only line in that panel that speaks on protected ground.** Every
other note there is about what you may DO with a plot, and on skeleton the answer is
nothing, so the panel has always gone quiet on arterial — which is exactly the ground
he was asking about. A lamp is not a thing you may do, it is a thing that is true.

A doused circuit still names its holder: **the light went out, the claim did not.**

## 5. THE GATE

`gates/the_face_on_the_map_is_his_gate.js`, in the suite as **THE FACE ON THE MAP IS
HIS**. 18 pass / 0 fail. `THE ONE THAT IS YOU` (the [white rings] gate this change
could have broken) re-run: **7 pass / 0 fail, with better margins than before**.

Leg C asks the identity question of the bridge itself, in bytes, because identity is
bytes and not pixels. Leg B asks the glass.

**AND THE FIRST MUTATION RUN EXPOSED A WEAKNESS IN MY OWN GATE.** Rolling his face
the way the row said reddened **A2 only** -- and A2 READS THE FILE. This lane's own
[white rings] gate says it in as many words: *"a gate that computes from its own copy
of the rule cannot fail when the game changes."* A source check is not a measurement.

So C4 was added: twelve fixed points read off BOTH candidate bakes in the shell and
off the face the CITY actually holds, and the city's face must match the one he
built. Run both ways:

    CLEAN      0 away from the face he BUILT, 3,082 away from the ROLLED one   18/0
    MUTATED    2,032 away from the built one, 1,262 from the rolled one        16/2

**A stranger on his map is now caught on the pixels, not only in the source.**

## 6. AND HIS VOTES ON THIS LANE'S TWO COOKS, ANSWERED THE SAME ROUND

    THE BATTERY SHED      UP    "More analog horror good idea get direction"
    THE SHOP IS STILL LIT DOWN  "Not analog horror enough"

Both notes say the same thing and both name the same chat, so I went and read
DIRECTION's ten rules. **I broke two of them, and one of them inside my own
docstring.**

**RULE 1, THE ORDINARY FRAME, ONE WRONG THING.** The dead file says *"the frame is
completely ordinary"* and then lists a cracked lot, three faded awnings one of them
torn, a blank sign, dead trees and stall paint mostly gone. **Six wrong things, then
the one that was meant to be the wrong thing.** Six is not six times the dread, it is
a ruin, and a ruin is a picture of a ruin.

**RULE 7, DRAWN FROM WORLD DATA, NEVER FAKED.** I painted seven empty shelf runs
because seven looked right. They traced to nothing, and the game has had a real stock
ledger the whole time.

The replacement, `lifecity-the-shop-that-is-open-9-22`, is built the other way round:
everything ordinary, and **one** wrong thing — *the shop is open, the lights are on,
and there is nothing on any shelf* — read out of the ledger by running it:

    food on the block 287, eaten 34.0 a day, decay 0.397 -> 113.9 left
    3.35 DAYS OF SUPPLY  ->  5 of 7 runs bare, 2 still hold something

The factory **refuses to run** rather than fall back to a number I liked the look of.
Post-mortem: `records/BOHEMIA_GRAVEYARD_THE_SHOP_IS_STILL_LIT_9_22_26.md`.

**THE LESSON: WRITING THE RULE AT THE TOP OF THE FILE IS NOT OBEYING IT.** That
factory quotes rule 1 correctly and breaks it in the next sentence, and every gate it
had was green. The gate that does not exist yet is rule 1's own test: name the one
wrong thing in one sentence, and prove the frame has no others.
