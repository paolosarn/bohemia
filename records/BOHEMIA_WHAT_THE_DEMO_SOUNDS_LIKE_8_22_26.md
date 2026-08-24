# WHAT THE DEMO SOUNDS LIKE, BEAT BY BEAT (8/22/26, SOUND lane)

## THIS LANE HAD BEEN COUNTING THE WRONG THING

Every instrument in the sound lane measures the **catalogue**: 102 moments, 155
approved candidates, which ids have callers, which pools have siblings. All of
that is a claim about the BANK.

What Paolo experiences is a **walk**. Splash, decline the cold open, get up,
phone, take the job, six steps, sleep, day two, the valley. A moment that is
perfectly wired but never *reached* during that walk is, to him, silent — and
nothing in this lane could see the difference. That is the same shape as the
defect this lane already has a law about: an approved candidate was never the
same thing as a wired one, and now a wired one turns out not to be the same
thing as a **heard** one.

`gates/demo_sound_gate.js` walks the same beats as the RUN lane's WHOLE DEMO
gate and records every sound the game asks for, on three surfaces: `playSFX`,
the `BOHEMIA_SFX` / `BOHEMIA_STEP` posts, and `STING.play` (which is not
`playSFX` at all and no other instrument was watching).

## WHAT IT FOUND, FIRST RUN

    the splash, before he touches anything    -- silent --
  ♪ ONE TAP ON THE SPLASH                     ui_tap
  ♪ he declines the cold open                 ui_tap, phone_buzz
    GET UP -- the first morning               -- silent --
    he opens the PHONE                        -- silent --
    he TAKES THE JOB                          -- silent --
  ♪ HE WALKS SIX STEPS                        step:dirt
  ♪ SLEEP -- the day ends                     sting:LOSS        <-- wrong
    DAY 2 arrives                             phone_buzz
    *** THE VALLEY OPENS ***                  -- silent --

**Five of ten beats silent, and one of the five that made a sound made the
wrong one.**

## 1. THE GAME MOVED HOUSE AND THE SOUNDS DID NOT

`come_up` (approved 4 of 5) and `sleep_sink` (approved 5 of 5, the cleanest
sweep this lane has been given) were both wired — **in
`slices/BOHEMIA_RUN_SLICE`, the panel nobody opens any more.** On 8/21 the RUN
tab started showing the CITY, so the demo runs in the city and the wake and
sleep sounds sit finished, approved, and in a room the player never walks into.

Seven approved moments are in that position: `come_up`, `door_drag`, `eat`,
`phone_buzz`, `save_chime`, `sleep_sink`, `went_down`. Two are fixed here. **The
other five are the next session's list**, and the same question applies to each:
does this moment still exist in the city, and if so, where.

This is APPROVED-BUT-UNUSED wearing a new coat. The wire exists. It is attached
to the old building. **A static caller-check cannot see this** — it finds the
caller and reports the moment covered. Only walking finds it.

## 2. GOING TO BED SOUNDED LIKE BEING BEATEN, AND THAT ONE WAS MINE

`QUESTSTING`, which I shipped on 8/20, played the `loss` figure when the player
slept with the day-one job unfinished. `loss` is authored for **losing a fight** —
"falling, and it lands heavy". The demo's ordinary go-to-bed beat was being
scored as a defeat.

The reasoning in my own commit was *"failing a job and losing a fight are the
same shape of moment; there is no reason to author a second way to say it."*
Walking it proved that wrong in one listen. It is the mistake the `paid` figure's
own note warns about, pointed the other way: *"a water run in a dead valley is not
a boss kill, and if it were scored like one then neither would mean anything."*

`missed` now carries it: two notes, falling, the exact inverse of `paid`, on the
same voice so a job you missed and a job you got paid for read as the same size
of life event pointing opposite ways. Small on purpose — the day is not over and
tomorrow exists.

**Nothing static could have caught this.** Every gate was green. `STING.play`
was called, with a real figure, that renders audibly, from a real caller. Every
check this lane owns said yes. The defect was that it was the *wrong feeling in
the right place*, and the only instrument that can see that is one that plays
the game and listens.

## AFTER

    7 of 10 beats make a sound
  ♪ GET UP                    come_up
  ♪ SLEEP                     sleep_sink        (no defeat cue)
  ♪ DAY 2                     phone_buzz, sting:missed
  ♪ THE VALLEY OPENS          come_up

## WHAT IS STILL SILENT, AND WHY IT IS LEFT THAT WAY

**The splash before he touches anything** — correct and unavoidable. No gesture
has happened, so no audio context may start. Nothing to fix.

**Opening the phone, and taking the job.** Both are taps inside the city, and
*every* tap inside the city is silent while taps in the shell tick. That
inconsistency is real, but blanket-wiring the city's UI runs straight into
Paolo's 8/4 ruling — *"I CANT HEAR THE SOUNDS IF THE UI THAT PLAYS SOUNDS
EVERYTIME I CLICK A BUTTON"* — so it is NOT being done as a sweep. Taking the
job is the one that deserves its own sound on merit, because it is a commitment
rather than a navigation tap, and there is no approved candidate for it yet.
Reported, not papered over.

## THE RULE THIS BUYS

Before claiming a moment is covered, ask **where in the walk he hears it**, not
whether something calls it. A caller in a panel nobody opens is not a sound, and
a correct sound in the wrong emotional place is worse than silence.


---

# THE STRANDED LIST, RESOLVED (8/23)

The 8/22 entry said **seven** approved moments were reachable only from the run
slice and named five as "the next list". **That number was wrong, and it was
wrong the same way three earlier numbers this week were wrong: a static matcher
that only knew some of the shapes a call can take.** It looked for
`sfx('x')` / `playSFX('x')` and did not know about
`postMessage({bohemiaCitySfx:{ev:'x'}})`, which is the channel the city actually
uses. Re-run with that shape included, the same matcher then claimed
`step_dirt`, `air_day` and 26 others were "reachable from nowhere" — while I had
MEASURED `step:dirt` and the ambience beds firing minutes earlier.

**Static call-shape matching has now misled me three times in this lane.** The
walk is the instrument that tells the truth. The list below is resolved by
walking and by reading the city, not by grepping for call shapes.

| moment | resolution |
|---|---|
| `come_up` | **WIRED 8/22.** GET UP posts it. Measured. |
| `sleep_sink` | **WIRED 8/22.** SLEEP posts it. Measured. |
| `door_drag` | **WIRED 8/23.** `inEnter` posts it. Measured. |
| `went_down` | already posted by the city; the matcher missed the shape |
| `phone_buzz` | already works; measured firing twice on the walk |
| `eat` | **NO TRIGGER. Leave it.** |
| `save_chime` | **DELIBERATELY SILENT. Leave it.** |

## door_drag, and the ruling it does NOT break

Entering a building was silent — the commonest action in the game and the way
every fight starts. `door_drag` is approved from his 8/9 sweep and was wired only
in the run slice.

He killed all ten `door_open` / `door_shut` candidates and the game owes those
silence; `sfx_wired_gate` asserts neither is ever banked. `door_drag` is the
separate, later, approved one, and his ruling is already written in this lane's
wire tool: *"the door DRAGS open (his 8/9 thumb); the SHUT stays silent, also
his."* Opening is the half he said yes to. The gate now asserts both halves —
the drag fires, and neither dead id comes back with it.

## eat — the moment does not exist

`eat` appears in the city only as a **need**: `ADVERTS={kitchen:['eat'],
dining:['eat']}` and a schedule that returns `'eat'` for the morning ration and
supper. That is a thing an NPC schedule wants, not an action the player takes.
There is nothing to hang a sound on. Same answer as the glass and metal
footsteps: **question one, does a trigger exist, and it does not.**

## save_chime — silent on purpose

The city saves constantly and invisibly: `localStorage.setItem` fires from a
dozen places on ordinary play. A chime on saving would not be a moment, it would
be a metronome over the whole game, and it lands exactly on his 8/4 ruling —
*"I CANT HEAR THE SOUNDS IF THE UI THAT PLAYS SOUNDS EVERYTIME I CLICK A
BUTTON."* An autosave the player never asked for should not announce itself.
If a MANUAL save button ever ships, that is a moment and this is its sound.

## WHERE THE WALK STANDS

    8 of 11 beats make a sound.

Still silent, all three on purpose and all three explained above: the splash
before he touches anything (no gesture, no audio context), opening the phone,
and taking the job.
