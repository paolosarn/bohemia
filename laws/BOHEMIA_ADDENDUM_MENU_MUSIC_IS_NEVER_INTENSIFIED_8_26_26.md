# ADDENDUM — MENU MUSIC IS NEVER INTENSIFIED, AND INTENSITY IS THREE LEVELS
# (Paolo 8/26/26, LOCKED)

## HIS WORDS, VERBATIM
> "okay keep in mind when it comes to music for the menu i want it to be calmer
> and it wont be able to progress with how many kills are on screen and shit.
> and im thinking about changing the intensity maybe. overworld calmness lvl 1
> then an enemy trying to hurt you or someone is talking to you is lvl 2 then you
> either kill 2 enemies or theresa whole bunch of people close together talking
> type shit for lvl 3. for example i liked the power still on somewhere when it
> was calm but it was really bad on intensity 2 you know. so keep that in mind.
> menu music doesnt get impacted by intensity type shit. we need more voices and
> different instruments sounds and shit. so yeah keep cooking"

## THE LAW, PART ONE: A MENU IS NOT A PLACE WHERE ANYTHING IS HAPPENING
**MENU MUSIC IS NEVER RAISED BY INTENSITY.** Not by kills, not by threat, not by
anything. A menu song plays at its calm arrangement on every surface it can be
heard on — the game, the MUSIC tab's KILL LAYERS control, and anything built
later.

He named a casualty: MENU — THE POWER STILL ON SOMEWHERE is CANON and he liked
it calm. It was not a bad song. It was a menu song being played at a fight's
arrangement.

### WHAT WAS ACTUALLY HAPPENING, MEASURED
One full bar of each menu song, rendered offline through the real `playStep`,
counting zero crossings (an integer count of how much is playing):

| song | intensity 0 | 2 | 4 |
|---|---|---|---|
| MENU — THE POWER STILL ON SOMEWHERE | 479 | 1539 | 2063 |
| MENU — LIGHTS ACROSS THE VALLEY | 1374 | **7084** | **9732** |
| MENU — DEAD VALLEY DAWN | 926 | 1568 | 2076 |
| MENU — EMBER VIGIL | 3264 | 3600 | 4268 |
| MENU — FIRST MORNING | 3636 | 3870 | 3936 |
| MENU — PURPLE DAWN | 775 | 869 | 995 |

**It was hitting all eight menu songs, not the one he noticed**, and the worst
was a SEVENFOLD increase, not the threefold he heard. He reported the one he
happened to be auditioning.

### WHERE IT IS FIXED AND WHY EXACTLY THERE
`const sk = f.menu ? 0 : this.layers` inside `MUS.playStep`.

`sk` is the single place the intensity NUMBER becomes an ARRANGEMENT, and every
surface funnels through it. Fixing it at the `KILLMUS` end would have left the
judge page still able to audition a menu song at 2 — **which is the exact surface
he heard it on.** THE BORDER IS ONE PIXEL (8/16) again: a pass can be
individually right and still be wrong because of where it sits in the pipeline.

No new data was invented. All eight menu songs already carried `menu:true`.

Gate: `gates/menu_music_gate.py`.

## THE LAW, PART TWO: INTENSITY IS THREE LEVELS AND KILLS ARE NOT THE ONLY INPUT
He redefined the ladder:

| level | what puts you there |
|---|---|
| **1** | overworld calm |
| **2** | an enemy trying to hurt you, **or** someone is talking to you |
| **3** | you kill 2 enemies, **or** a whole bunch of people close together talking |

Two things change from what shipped. **The top of the ladder moves from 4 kills
to 2**, and **kills stop being the only input** — being threatened, and being
talked to, now raise the music, which means the music responds to the social half
of the game and not only the shooting half.

MECHANISM IS MINE, THE TRIGGERS ARE HIS. The levels and what fires them are
quoted above and are not to be re-derived. How the signals reach the music is
engineering.

**AND THE MENU IS EXEMPT FROM ALL OF IT**, by part one. Whatever level the game
computes, a menu song ignores it.

## THE STANDING ORDER IN THE SAME BREATH
> "we need more voices and different instruments sounds and shit. so yeah keep
> cooking"

More VOICES and more INSTRUMENTS, as an ongoing instruction, not a one-off.

## WHAT THIS DOES NOT LICENSE
It does not reopen `particle` and `air`, which the 8/14 post-mortem barred from
new cooks ("no third cook for these slots, in this session or any other, unless
he asks for one"). He asked for more voices and instruments here, in the MUSIC
verdict, about music synthesis. Reading a music instruction as permission to
re-cook two barred SFX methods would be finding a legal way to ship something he
killed twice, which is the STOP PRODUCING violation by name.

## THE THREE HE KILLED IN THE SAME SITTING
GRAVEYARD IS FINAL; fresh cooks answer the slots.
- MENU — WHAT THE VALLEY KEPT
- MENU — NOBODY IS COMING
- THE NOTE THAT WOULD NOT STAY ONE

Buried the same turn (MLOOPS 131 → 128, tags pruned, tombstones written).
**Two of the three are MENU songs**, from the same audition that produced the
ruling above — he was hearing them at intensity when he judged them. They stay
dead regardless; that is his call and the law is final either way.
