# THE MENU WAS PLAYING A FIGHT'S ARRANGEMENT (8/26/26, SOUND lane)

His verdict export came in with a comment on the end, and the comment is the
whole turn. Law recorded the same turn:
`laws/BOHEMIA_ADDENDUM_MENU_MUSIC_IS_NEVER_INTENSIFIED_8_26_26.md`.

## HE REPORTED ONE SONG. IT WAS HITTING ALL EIGHT.

> "i liked the power still on somewhere when it was calm but it was really bad
> on intensity 2 you know... menu music doesnt get impacted by intensity type
> shit."

Rendering one full bar of every menu song offline through the real `playStep`
and counting zero crossings (an integer count of how much is playing, which
unlike level does not drift between renders):

| song | 0 | 2 | 4 |
|---|---|---|---|
| MENU — THE POWER STILL ON SOMEWHERE | 479 | 1539 | 2063 |
| MENU — LIGHTS ACROSS THE VALLEY | 1374 | **7084** | **9732** |
| MENU — DEAD VALLEY DAWN | 926 | 1568 | 2076 |
| MENU — EMBER VIGIL | 3264 | 3600 | 4268 |
| MENU — FIRST MORNING | 3636 | 3870 | 3936 |
| MENU — PURPLE DAWN | 775 | 869 | 995 |

He named the one he happened to be auditioning. **The worst was a sevenfold
increase, not the threefold he heard.**

**Fixed in the one place it can be fixed**: `const sk = f.menu ? 0 : this.layers`
inside `MUS.playStep`. `sk` is where the intensity NUMBER becomes an
ARRANGEMENT, and every surface funnels through it — the game, the MUSIC tab's
KILL LAYERS button, anything built later. Fixing it at the `KILLMUS` end would
have left the judge page still able to audition a menu song at 2, **which is
exactly the surface he heard it on.** THE BORDER IS ONE PIXEL, again.

No new data invented: all eight menu songs already carried `menu:true`.
After: 479 / 479 / 479, and DUST CRAWL still goes 2140 → 2814.

## PART TWO: HE RE-CUT THE INTENSITY LADDER

> "overworld calmness lvl 1 then an enemy trying to hurt you or someone is
> talking to you is lvl 2 then you either kill 2 enemies or theresa whole bunch
> of people close together talking type shit for lvl 3"

Two real changes. **The top moves from four kills to two**, and **kills stop
being the only input** — the music now answers the social half of the game.
`window.INTENSITY` is the front door; `KILLMUS` is the same object under its old
name so callers keep working and there is no second copy of the state.

**WHICH TRIGGERS ACTUALLY FIRE, stated rather than implied:**

| trigger | state |
|---|---|
| kills | **WIRED** — combat posts a killshot outcome |
| threat | **WIRED** — `BOHEMIA_COMBAT_STARTED` on, `BOHEMIA_COMBAT_END` off, and `BOHEMIA_PLAYER_HIT` |
| talking | **UNWIRED** — a conversation begins inside the city frame and no message crosses to the shell |
| crowd | **UNWIRED** — nothing counts people talking near you |

The two unwired ones are a one-line call each (`INTENSITY.talking(true)`,
`INTENSITY.crowd(true)`) from the surface that owns them. This lane does not edit
that surface — ONE SYSTEM, ONE SESSION. They are **reported as unwired rather
than counted as shipped**, because half-claiming a trigger is how
built-but-not-triggered hides.

## A GATE HELD THE OLD LADDER, AND THE RULING OUTRANKS IT

`fight_music_gate` asserted "two kills lift to layer 2, four to layer 4" — right
on 8/20, superseded on 8/26. A GATE MUST NEVER OUTRANK A RULING. Updated to his
new numbers, with the old ones written down as a replaced spec rather than a
regression to defend. 47/0.

## THE THREE HE KILLED, AND A REGISTRY THAT LIED

MENU — WHAT THE VALLEY KEPT, MENU — NOBODY IS COMING, THE NOTE THAT WOULD NOT
STAY ONE. Buried the same turn: MLOOPS 131 → 128, tags pruned, song lock
regenerated.

**And the burial wrote a false record.** `bohemia_music_bury_the_dead.py` had the
8/19 batch's own story hardcoded into the line it writes, so three songs he
killed on 8/26 were filed as *"7/8/26 | DOWN (batch 6/7 horror)... Buried in code
8/19/26"*. Every future burial by any lane would have inherited somebody else's
date and somebody else's reason. **GIT IS THE MEMORY, and a registry that lies is
worse than no registry.** Fixed at the tool — the date now comes from each song's
own death notice — and the three rows corrected.

## THE ONE THAT MATTERS MOST: A GENERATOR CAN RESURRECT THE DEAD

Burying a song takes it out of MLOOPS. **The batch tool that cooked it still
holds its full text, so re-running that tool puts it straight back.** The
graveyard gate saw it immediately: live references jumped 10 → 16 the moment the
three were buried, and a live reference is precisely the pointer that survives
the kill.

GRAVEYARD IS FINAL binds the machine, not just the person. Both batch tools now
refuse:

    $ python3 tools/bohemia_menu_songs_batch21.py
      REFUSED (graveyard is final, he killed it): MENU — WHAT THE VALLEY KEPT
      REFUSED (graveyard is final, he killed it): MENU — NOBODY IS COMING
      already installed (idempotent, nothing to do)

    batch24 would refuse to inject: ['THE NOTE THAT WOULD NOT STAY ONE']

Verified the way that matters: after re-running batch21, MLOOPS is still **128**.
`batch24` holds its songs as one text blob and cannot filter entry by entry, so
it refuses the whole run loudly instead — a tool that cannot be precise about a
corpse should stop, not guess. Live references are back to the pre-existing 10,
all of which are the character lane's hair verdict.

## FOUR RULER MISTAKES OF MY OWN, ALL CAUGHT BY MEASURING

Worth listing because they are the same shape as the twelve before them:

1. **The probe set `MUS.idx`, which is not a thing.** `fac()` reads `this.cur`
   indexed into `MFACTIONS.concat(MLOOPS)`. It happily measured the same song
   twice while reporting two different names — identical numbers to eleven
   decimal places were the tell. The gate now proves the selector selected.
2. **A 1e-9 equality tolerance called Web Audio's own float noise a difference.**
3. **Then a purely relative tolerance failed the quietest song in the game for
   being quiet** (rms ~1e-8 asked for agreement to 1e-14).
4. **And the real answer was that `playStep` is not deterministic at all.** One
   song, one intensity, three renders: zc 122 / 120 / 122. No fixed tolerance
   could ever have separated "intensity changed it" from "it renders differently
   every time". The gate now measures **each song against its own spread**, and
   judges the ordinary songs by the same instrument so the band cannot be hiding
   a real intensification.

Plus two shape assumptions inside the guard itself — a registry regex that
matched nothing (a checker that silently sees an empty world reads exactly like
one that passed), and a `SONGS` list that turned out to hold tuples.

## MUTATIONS

    menu, the bug put back      -> all 8 menu songs RED, his named at [479,1539,2063]
    intensity killed for all    -> "the fix is not turn it all off" RED
    two kills back to four      -> ladder RED at [0,2,0]
    threat removed from level 2 -> "an enemy trying to hurt you" RED
    COMBAT_STARTED unwired      -> "ACTUALLY TRIGGERED" RED while the API stayed
                                   green, which is the whole point of that leg

## WHAT IS NOT DONE

> "we need more voices and different instruments sounds and shit. so yeah keep
> cooking"

A standing order, not a one-off, and it is the next thing. It does **not**
reopen `particle` and `air` — the 8/14 post-mortem barred those from new cooks
"unless he asks for one", and he asked for music voices in a music verdict.
Reading that as permission to re-cook two barred SFX methods would be finding a
legal way to ship something he killed twice.
