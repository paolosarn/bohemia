# SOUND LANE — DEMO BLOCKERS (8/9/26)

Per the demo dispatch: everything already in flight in THIS lane that needs
Paolo to finish it. Numbered, one line each, thumbable. Nothing here is a thing
a lane can decide for itself.

## THE BLOCKERS

1. **SQUIGGLE VOICES — 8 candidates, judge by ear.** MUSIC tab. Eight voices all
   saying the same line so the voice is what varies. Which are people in this
   game? *(thumbs, per voice)*
2. **THE FRESH DOORS — 10 candidates, judge by ear.** MUSIC tab. Ash drag + stone
   clack, cooked from the materials that beat the ten you killed. *(thumbs)*
3. **THE 4 ACOUSTIC SPACES.** Open desert / street / room / big hall. Shipped and
   live since 8/4, never thumbed. *(thumbs, or "leave it")*
4. **THE 9 BATCH-20 SONGS.** Cooked, shown, never ruled. *(thumbs)*
5. **MENU MUSIC: does the front splash play?** Two canon MENU songs exist and no
   menu player does. Building one is a design decision, not a wiring fix.
   *(yes / no)*

## NOT BLOCKERS, ON PURPOSE

Things this lane can and did decide for itself, listed so nobody re-asks him:

- Which sound each footstep is, per ground — the tile already knows.
- Whether hit/kill quantise — combat already places them on the beat and
  re-quantising would push them OFF it.
- The strike count for time passing — his "amount of time that goes by" ruling
  settled it, and his 10 min / 1 hr / 6-12 hr numbers confirmed it unchanged.
- Whether voices get their own volume bus — no, the EFFECTS slider already owns
  them.

## WHAT IS ALREADY DONE IN THE MINIMUM DEMO SOUND SET

The dispatch names five. Four are live and one was blocked until his 8/9 message
reopened it:

| | status |
|---|---|
| footsteps by ground | **LIVE** — asphalt/gravel/dirt chosen by the tile |
| hit + kill on the beat | **LIVE** — combat places them on the beat itself |
| UI tap | **LIVE** |
| save chime | **LIVE** |
| doors | **COOKED 8/9, WAITING ON HIS EAR** — blocker #2 |

## THINGS THAT NEED A LANE THAT IS NOT THIS ONE

Recorded here because they came out of sound work and would otherwise sit:

- **EAT and SLEEP costs do not reach the game.** His 8/7 numbers (snack 10 min,
  meal 1 hr, sleep 6-12 hr) versus the run's live table (`EAT: spends:null`,
  `SLEEP: spends:8`). Blocked on structure that does not exist: eating has no
  food types and sleep has no way to choose a length.
  Full writeup: `records/BOHEMIA_FLAG_TIME_COSTS_NOT_WIRED_8_9_26.md`
- **Squiggle voices need a dialogue runtime to speak through.** The engine and
  the judge exist; the demo row says "speaks per dialogue line through the
  dialogue runtime", which is the PEOPLE lane's scripted-scene work. Once a line
  is delivered with a speaker id, one call makes it talk.
