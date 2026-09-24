# EVERY DIAL A SLIDER -- the face maker finished, and three fields that were lying
# PORTRAIT (chat 20), [customizations first] + [dead dials], 9/24/26.
# PAOLO 9/23 IN THE TAB, voting portrait-eight-dials-9-22 UP: "Fantastic progress it
# should all come with a slider." Rule 32(g) writes it as EVERY FACE DIAL A SLIDER.
# NOTES ARE RULINGS: an UP with a sentence on it is the next job, not a compliment.

## WHERE IT STARTED
9/22 took his panel from 14 sliders to 22 after measuring that 13 of 27 dials were not
reachable. He voted that up AND asked for the rest in the same breath. So: all of them.

## THE SWEEP SAID THE WHOLE FACE WAS DEAD, AND THE SWEEP WAS THE THING THAT WAS BROKEN
The first run came back with every one of 34 numeric fields at 0 px -- INCLUDING
face.top, which is 1,315 px and the biggest dial on the face.

    faceClamp() TAKES NO ARGUMENTS. It works on the maker's own `pface`.

Passing it a spec returned undefined, renderFace threw on all 1,568 renders, and my catch
block recorded every throw as "moves zero pixels". A silent throw reading as a dead dial
is the shape of wrong answer this lane keeps paying for -- the same family as the 9/24
PEOPLE probe that called a working module dead by reading `.hair` instead of `.worn.hair`.
THE INSTRUMENT NOW COUNTS THROWS AND CARRIES face.top AS A POSITIVE CONTROL, and so does
the gate leg built from it. Before believing a negative, prove the instrument can produce
a positive.

## THE HONEST SECOND READING
NINE LIVE DIALS WERE OFF HIS PANEL, worth about 1,900 pixels of face:

    hair.front       440 px   how far the hair comes down the forehead
    face.jawCornerY  378      the corner of the jaw
    face.cheekY      360      the cheekbone
    hair.side        348      how far it falls past the ear
    hair.flare       158      how wide it kicks at the bottom
    hair.vol         100      how much of it there is
    hair.braid        91      a braid, left, right or none
    eyes.gaze         26      where he is looking
    eyes.hood          4      the fold over the lid

AND THREE FIELDS WERE LYING: nose.len, hair.scalp, details.stubble, all 0 px, none read
by the renderer.

    22 sliders -> 32.  0 live dials off the panel.  0 dead fields in the spec.

## THE TWO I HAD WRITTEN OFF LAST ROUND, AND WHY THAT WAS WRONG
Last round I wrote in the panel's own source that face.cheekY and face.jawCornerY were
"not a dial, by design", because faceClamp re-derives both from top and len, so a slider
would snap back the instant he let go.

THE CLAMP WAS THE DECISION, NOT THE FACT. They move 360 and 378 pixels in the renderer --
more than all but five dials on his whole panel. They were never dead; they were being
overwritten two lines into a function.

They BAND now instead of being assigned, the same mechanism the four row heights already
used: a default derived from top and len when he has not touched them, his value honoured
inside a range that keeps the skull coherent, plus ordering (the cheekbone under the eye,
the jaw corner under the cheekbone, the chin under that). Both bands contain the old
derived value, SO EVERY FACE ALREADY SAVED LOADS BYTE-IDENTICAL and nothing moves until
he drags. Measured after: both hold, 27 px and 47 px on his own face, 0 snap-back.

## ASKED IN ADVANCE INSTEAD OF FOUND AFTERWARDS: DO THE HAIR DIALS HOLD?
The crowd's portraits DERIVE side/front/vol/flare from the haircut the body wears
(THE PORTRAIT WEARS THE HAIRCUT THE BODY IS WEARING, 8/28), so a slider on a stranger
would snap back exactly like cheekY did. buildSpec() is a straight copy of his own pface
with no such derivation, so on HIS face they stand. Checked before building them, which
is the cheekY lesson applied one step earlier.

## FIVE SLIDERS POINTED AT KEYS HIS FACE DID NOT HAVE
Driving the panel found hair.front / side / vol / flare and eyes.gaze reading undefined on
pface: five dead controls, alive in the crowd's generator and absent from his own face.
Caught before shipping by driving every slider rather than trusting the table.
THE DEFAULTS WERE SOLVED FOR, NOT PICKED. Adding anything to approved art is only safe if
the pixels do not move, so each value was swept until it rendered BYTE-IDENTICAL to the
key being absent: side 0.90, front 0.20, vol 0, flare 0, gaze 0. (0.90 is (33-3)/33, which
is the renderer's own fallback for a 'jaw'-length cut written as a number.)

## STUBBLE: WIRED, AND IT CHANGED HIS FACE UNTIL I STOPPED IT
details.stubble has been in the spec since 8/28 and nothing ever drew it. Rule 14d says
deliver it or remove it, and a day's growth is a real thing on a face, so it got delivered.
IT READS THE FINISHED PIXELS instead of guessing a shape: only pixels that are already
this face's skin get darkened, so growth cannot spill off the jaw, over the lips or into
the hair whatever the skull dials are set to. No silhouette maths to go wrong.

IT TOOK THREE TRIES AND ALL THREE WERE CAUGHT BY LOOKING, NEVER BY A NUMBER, because 151
pixels of mesh and 151 pixels of stubble are the same number:
  1. every other column      -> a BARCODE down the chin.
  2. a 4x4 ordered dither    -> at half density an ordered dither IS a regular lattice by
                                construction, so three days' growth read as FISHNET.
  3. a hash of the pixel's own coordinates -> scatter with no lattice to see, fixed per
                                pixel, so the same face renders identically every frame
                                and NO DICE ANYWHERE IN THE FACE (8/27) still holds.
The beard line also ran FLAT across the cheekbones and read as the edge of a mask; it
starts at the nose line now and rides high at the sides where the sideburn is, dipping
toward the middle, which is the shape a jaw actually grows.

*** AND THEN IT GREW A BEARD ON THE FACE HE APPROVED. *** PUNK carried stubble:1, a
number that had never drawn a pixel, so wiring it moved his own face: hash 68caec4f ->
f30d40e6. Caught by hashing his face against a CLEAN origin/main WORKTREE rather than
trusting that a new feature only touches new things. The default is 0 now, which is what
his face has actually looked like all along, and STUBBLE is a slider so it is his to turn
on. Re-verified: 68caec4f both sides.

ON THE CROWD, where it is new and wanted: 47 of 200 adults show growth (23.5%), 22 to 56
pixels each, 0 dead. 0 of 116 children and teens, because the generator already gated it
by age and that gate holds.

## THE TWO THAT ARE GONE
    nose.len     REMOVED. It was computed on every face and read NOWHERE: the nose is
                 drawn from the eye line down to f.noseY, so its length is already NOSE
                 HEIGHT, a slider he has had all along. A second field claiming to set it
                 was a promise the face could not keep.
    hair.scalp   REMOVED. It claimed to say whether a cut shows bare scalp; renderFace
                 never read it. The BODY's hair generator has a real scalp opening, the
                 portrait does not, and carrying the word here implied it did. When the
                 portrait grows one it comes back wired, not as a name.

## GATES
face_maker 16/0, with SLIDERS_MIN ratcheted 12 -> 22 -> 32 and THREE NEW LEGS:
  - the dial sweep can see a dial at all (positive control face.top 1,237 px over 1,536
    renders, 0 threw) -- the sweep is only worth reading if it could have failed
  - EVERY FACE DIAL IS A SLIDER: nothing live is off his panel (0, there were 9)
  - and nothing on the face promises something it does not do (0 dead fields)
MUTATION-PROVED: remove one slider and restore one dead field -> 13/3 RED naming
"hair.front 317px off the panel" and "dead fields in the spec: nose.len"; green on restore.

portrait_haircut 15/0, and ONE LEG WAS REPAIRED TO ITS SUBSTANCE rather than deleted.
"The face Paolo approved did not move" was checking that his hair spec carried no
side/front/vol/flare -- reading "he takes the default path" as "those keys are absent".
They are present now because he asked for those dials. THE KEYS WERE NEVER THE CLAIM; THE
PIXELS NOT MOVING IS. Pinned to the rendered hash 68caec4f instead, measured equal on a
clean origin/main worktree. MUTATION-PROVED: give his face stubble:2 -> RED at 1212f3e6.
(Same repair PEOPLE made to their own A NAME gate on 9/24: repoint at a write, not a
mention.)

## WHERE HE SEES IT
TAB: CHARACTER, tap your own face. The VOTE item is portrait-every-dial-a-slider-9-24.
RULE 32(f), SHOW IT FROM THE GAME'S CAMERA: the card is not a drawing of the panel. The
cook boots the REAL alpha on a 390-wide phone, waits for the loading screen to go READY
and taps it (Paolo's ruling: it ends in one tap, not a timer -- CHARACTER's sequence from
become_gate, not a fourth invention), walks into CHARACTER, taps the portrait, scrolls to
the panel and photographs it. The faces beside each dial are 132 px, which is MEASURED:
the size the portrait canvas actually occupies on that phone.
THE COOK REFUSES TO WRITE rather than ship a picture that does not show what it says, and
it fired twice on me: once photographing RUN's loading screen at "5 OF 5", once showing
the CHARACTER tab with the sliders below the fold. Both under a caption reading "this is a
photo of the real panel".
