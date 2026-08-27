# NINETY NEW SOUNDS (8/28/26, SOUND lane)

**Paolo, verbatim:** *"i dont need youi implementing shit thats not done we need
way more sounds bro!!!!"*

Taken exactly as written. Ninety sounds, eighteen pools, no plumbing. It is the
biggest SFX batch this lane has ever cooked — SFX-01 was 60 across brand-new
moments and every batch since has been 30 or fewer.

## WHY THESE EIGHTEEN, MEASURED OFF THE SHIPPED BANK

Read out of `var APPROVED=` in the alpha and combined with the SIBLINGS map in
`bohemia_sfx_wire_patch.py`, which is what actually decides how many samples a
moment can draw in play. 55 moments carry an approved sound. **Twelve have an
effective pool of one** — the game plays a byte-identical sample every time:

    casing  door_drag  dry_fire  eat  hit_more  lungs_burn  mag_home
    sign_alive  stone_bite  went_down  will_goes  wood_more

`hit_more` and `wood_more` are themselves siblings feeding `hit` and `step_wood`
(pools of 3 and 7), so they never play alone and are not a defect. `casing` is
excluded — see below. That leaves **nine moments that repeat identically**.

**Wave 2** takes every remaining moment with a pool of **two**: `swing_air`,
`wind_gust`, `phone_buzz`, `cloth_on`, `tape_pull`, `power_on`, `boots_go`,
`cover_more`, `set_down`. Two samples under a repeated action is a two-beat
pattern, and in an engine where everything quantises to 120 BPM an even pool
locks to the meter hard.

### THE RESEARCH

The **machine gun effect** is the oldest known failure in game audio: the same
sample fired repeatedly stops reading as an event and starts reading as a
machine. The fix is round-robin — several takes cycled so the same one never
plays twice running. The non-obvious refinement, and the reason every pool here
is five: **an odd pool beats an even one**, because an even pool falls into step
with the action and becomes its own audible pattern. The engine's shuffle
already refuses an immediate repeat. The mechanism was built. It was starving.

## WHAT IS DELIBERATELY NOT IN THIS BATCH

**Casing is not cooked, and he did ask for more sounds.** `brass_more` sits on
the engine's own `onceDeadWhole` list with this note: *"brass_more is its first
rejection: casing stays at one variant and does not get another cook unless he
asks."* He asked for MORE SOUNDS. That is not the same as asking for THIS sound
again. A general call for volume is not a request to reopen the one moment he
threw out whole, and reading it that way would let any broad ask reopen every
grave in the file — which is exactly what GRAVEYARD IS FINAL exists to stop.

Also excluded: the eight `twiceDead` moments, plus `clear_still`, `turn_to_you`,
`cross_in`, `done_ring`, `panel_tick`.

## THE METHOD SPLIT IS HIS DATA, NOT MY TASTE

From the engine's ENVELOPE ledger, off 460 judged candidates:

    instrument  0.48   his own rack, the best source in the game
    friction    0.46   the best raw method
    modal       0.35
    fm          0.13
    particle    0.00   BARRED
    air         0.00   BARRED

Nine friction, four instrument, five modal. No barred method. No `mat: 'metal'`
anywhere — 3 UP / 22 DOWN is the only stable material finding he has produced.
Every `space` at or under 0.2, because DO NOT ANNOUNCE THE ROOM is the reading
his four whole-batch deaths gave on 8/15: the only two 5/5 sweeps this lane has
ever had sat at 0.14 and 0.16, and the three roomiest recipes in that batch all
died whole.

**Physics picks the method inside that split.** A door hauling in a gritty sill,
a blade opening air, wind over a dead valley, fabric, tape peeling, a contactor,
lungs burning and a man's will going are all *sustained rubbing* — friction. A
magazine seating, a trigger closing on nothing, a boot on a hard floor and a
thing set down are *struck* — modal. A sign working in the wind, stone coming
off cover and a device buzzing are objects with a grain — his rack.

## MEASURED, ON THE REAL SURFACE

    SFX RENDER    7475 passed, 0 FAILED    600 candidates rendered, measured,
                                           silent on time, identical twice
    SFX SHUFFLE   GREEN      SFX WIRED     GREEN
    INSTRUMENTS   GREEN      SFX ENVELOPE  GREEN     ALPHA LOADS  GREEN

**SFX DIVERSITY is still red, and this batch moved it a long way:**

    before   instrument 105 of 155 living = 67.7%   needs ~11 more moments
    after    instrument 125 of 215 living = 58.1%   needs ~7 more moments

Not closed. It is not closed by padding either — the gate says so itself, 30 of
the 32 silent moments are spent, and particle and air are barred. What moved it
was cooking non-instrument candidates for moments the game actually wanted.

## FOUR MISTAKES, ALL MINE, ALL FOUND BY RUNNING IT

**1. I built the whole first version on a stale checkout.** The container came
back rolled back to an 8/19 snapshot with `origin/main` pointing at 8/2. I
measured thin moments, wrote twelve recipes and cooked a batch against it — and
named it *batch 10*, which **already exists**: this lane's own SFX-10 from 8/20,
"SAND STOPPED MACHINE-GUNNING". A full fetch put main at its real head and the
analysis was redone from scratch. `git fetch origin <branch>` had been quietly
returning a stale ref; `git fetch origin --prune` did not.

**2. A comma after a comment is a hole, not a trailing comma.** The injector
walked back from the table's closing bracket stripping commas and prepending
one. Both tables end in *comment lines*, so it produced `}, /* end */,` — an
elision. The engine parsed fine, the file read fine, and the judge board died on
`Cannot read properties of undefined (reading 'ev')`. A trailing comma is legal
and a hole is not, and nothing but running it tells them apart.

**3. The same hole, by the opposite route.** The fix anchored on the last real
element's brace — but the text after that brace *begins with the separator comma
that used to follow it*, so the splice produced `},\n,\n`. Twice in one turn, so
it is written down: the fix is not a cleverer anchor, it is **owning every
separator the splice touches**.

**4. `width` is a spec value; stereo width is an outcome.** `seton_more.4`
rendered dead mono. I raised the `width` field and **the failure moved to
variant 3** — which is the tell that the field I changed was not the one that
mattered. The three modal recipes in this batch that pass all carry `refl: 1`
and this one carried `refl: 0`. Early reflections are where the stereo comes
from.

**And a fifth that is about the instrument, not the game:** a probe measuring
all 71 proven voices through `synthV` reported 57 of them silent. They are in
shipped instSets that `instrument_gate` re-renders green every run. The probe
was rendering at a flat operating point; `bodyInstrument` uses `instStep(v)` and
`semiOf(v.hz)`. The voices were fine and my ruler was wrong — the sixth time
this session that has been the answer.

## WHAT HE DOES WITH IT

**Tab: MUSIC.** Ninety new sounds are on the judge board, five per moment, tap
to hear, thumb up or down. **None of them is canon and none plays in the game
until he says yes to it** — the moment he approves one, the sibling wiring
widens that moment by itself.
