# BOHEMIA ADDENDUM — EVERY DURATION IS A NOTE (7/27/26, LOCKED)

Extends the 120 BPM LAW from the simulation to the SCREEN.

> The 120 BPM LAW already said everything quantizes to the beat. v81 applied it to
> the hit-stop and found that counting FRAMES had been running every impact at half
> weight on Paolo's 120Hz phone. Nobody then checked whether anything ELSE on
> screen had a duration. Four things did. Three of them were wrong.

---

## 1. THE LAW

**A VISUAL EFFECT'S DURATION IS A NOTE VALUE, IN SECONDS, FROM ONE NAMED TABLE.**

Three things are banned outright, because all three shipped and all three were
invisible until measured:

1. **A PER-FRAME DECREMENT.** `flash-=0.08` is not a duration, it is a refresh
   rate. 208ms at 60Hz, 104ms at 120Hz. The number in the source describes
   nothing.
2. **A FRACTION OF SOMETHING ELSE'S LENGTH.** `1-p*3` against `ks.dur` meant the
   same white punch ran 0.167s behind one kill and 0.375s behind another. Same
   event, same meaning, double the duration, decided by a die roll.
3. **A NUMBER NEAR A NOTE.** `0.12` where a sixteenth is `0.125`. Off the grid by
   4%, in the one system whose entire premise is landing on it.

Legal denominators are the freeze core's: 1, 2, 4, 8, 16, 32. `BohemiaFreeze.isNote`
is the arbiter, and it exists precisely so that "some integer fraction" — which is
how 1/60 of a bar got in — cannot pass.

**A DURATION THAT IS NOT IN THE TABLE IS A DURATION NOBODY IS CHECKING.**

---

## 2. THE CLOCK YOU MEASURE AGAINST IS PART OF THE DURATION

Getting the number right is half the job. This turn got the number right three
times in a row and still shipped nothing, because the ZERO was wrong twice:

| clock | what happened | measured |
|---|---|---|
| `ks.t` | the hit-stop pins it, so the flash froze mid-decay | **633ms** of white behind a sharp kill |
| `G._ksAt` | the HELD BREATH runs first and the camera early-returns through all of it, so the effect expired before its own code ran | **NONE** — never drew at all |
| `G._ksGo` | stamped on the first frame the cinematic actually draws | **91ms / 115ms** across two styles |

**RULE: pick the clock by asking what the effect is a reaction TO, then check that
nothing pauses, precedes or rescales that clock between the event and the draw.**

A frozen clock does not stop an effect, it welds it (7/27's other law). A clock
stamped before a preamble expires during it. Neither is visible in the source.

---

## 3. WHY THE MEASURING IS NOT OPTIONAL

Both wrong clocks READ CORRECTLY. Both were defensible one-liners. Both would have
passed any review that did not put a stopwatch on the real canvas.

**A DURATION IS VERIFIED BY WATCHING IT, ON THE REAL SURFACE, WITH A CLOCK.** The
probe hooks `fillRect`, filters to the full-screen fill at that effect's own alpha
coefficient (0.22 for the shot flash, 0.45/0.40 for the punch — which is what keeps
the two from being mistaken for each other), and records first-frame to last-frame.

Yesterday's law says reproduce before you fix. This one says: **measure before you
call it fixed.** They are the same discipline pointed at the two ends of a change.

---

## 4. WHAT LANDED

`JUICEMS` — one table, four durations, all `note(16)` = 0.125s:

| | was | now |
|---|---|---|
| shot flash | `flash-=0.08`/frame (208ms @60Hz, 104ms @120Hz) | 0.125s in seconds |
| killshot punch | `1-p*3` / `1-p*4` of `ks.dur` (0.167s / 0.375s) | 0.125s off `G._ksGo` |
| recoil | `dt*4.5` = 0.222s, between two notes | home ON the next sixteenth |
| held breath | 0.12s | 0.125s |

The sixteenth for the shot flash is chosen deliberately: 104ms is what HIS DEVICE
has been showing him, so the feel he has been approving is the phone's, not the
desk's. Quantizing to the 60Hz number would have changed the game under him.

Two more from the same pick-list, not durations:

- **PERMANENCE.** Brass is FLOOR STATE (AF v3), except the cap was 14, so the
  fifteenth casing silently deleted the first and the ground stopped accumulating
  within seconds of a real firefight. Now 96 — still bounded, still cleared on a
  fresh fight.
- **THE IMPACT THROWS ALONG THE SHOT.** Twelve particles at `k/12*6.28` is a
  perfect circle, the one shape a real impact never makes, and it threw away the
  only thing a burst exists to say: where it came from. Now x1.30 down-range
  against x0.45 behind.

**NOT SHIPPED, ON PURPOSE:** the CAMERA THAT LEADS the shot. Everything above is a
defect with a right answer. Camera lead is a FEEL decision with a dozen right
answers, and picking one while Paolo is asleep is exactly what STOP PRODUCING
forbids. It stays on his pick-list.

---

## 5. THE MACHINE GATE

`gates/combat_lab_gate.js` section 21, 13 checks. It EXECUTES the freeze core plus
the JUICEMS block and asserts every value passes `BohemiaFreeze.isNote`, that all
four effects are covered, that the banned forms (`flash-=0.08`, `1-p*3`, `1-p*4`,
`dt*4.5`, `0.12`, `>14`) are gone by exact source, that `G._ksGo` is stamped AFTER
the breath's early return and cleared in `startKillshot`, and it runs the lean
formula to prove down-range throws materially further than behind.

A law without a machine gate is not enforced.
