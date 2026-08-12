# THE PHONE RINGS — 8/12/26 (RUN lane)

The last three turns put a phone in his pocket, made it know where he is, and made
its map a door into the world. It was still a **viewer**. Nothing ever arrived on
it, and nothing he did on it changed the day.

**Every phone feature so far could have been deleted and the game would have played
identically.** That is the test a feature has to pass to be real, and the phone was
failing it.

---

## THE SHAPE WAS ALREADY IN THE ENGINE

`engine/bohemia_loop.js`, in its own comment, since it was written:

> **THE FEED OFFERS**: the quests you can pick up **OVER THE PHONE** right now — the
> 'feed' channel, live, not done. In-person quests (the phoneless: homeless) are
> deliberately EXCLUDED; the only way to get those is to pull up on them. This is
> "you can't get their quest over the phone."

So a job arriving on your phone is not a mechanic I invented — it is the shape the
loop engine was built around, including the *counter*-case (some people you have to
go and stand in front of). The demo had been skipping the channel entirely by
handing him the day's job on the wake card, done deal, before he touched anything.

Fourth time this lane has found the same thing: **the work exists and is not in the
surface he taps.**

---

## WHAT CHANGES: THE DAY NO LONGER STARTS WITH A JOB

```
06:00   you wake. the card says something came in overnight. NO objective.
tap     PHONE  (badge: 1)
        the offer is there in the quest's OWN words, with TAKE IT
take    the objective goes live on the HUD. now it's a working day.
ignore  it stays on the phone. the day is yours.
```

## AND NOT TAKING A JOB IS NOT FAILING IT

This is the distinction the old code **could not express**. A quest that started
itself could only ever end up resolved or FAILED at nightfall — there was no state
for "he never took it," because taking it was never a thing that happened.

| what he did | what the day does |
|---|---|
| took it, resolved it | the quest's own COMPLETE stage, with its tag |
| took it, ran out of light | the quest's own FAIL stage — **the teeth stay** |
| never took it | nothing runs. The reckoning says *"never taken."* Not a failure, because it isn't one. |

Every word on the offer is the quest's own `@LOG` line, verbatim out of the `.bq`,
under the same law as the resolution buttons: **I show his prose, I don't write
prose about it.** The gate diffs it against the file.

---

## TWO BUGS THIS TURNED UP, BOTH MINE, BOTH SILENT

### 1. The day loop was throwing away the consequence of the day

Nightfall fires the quest's FAIL stage — but nightfall happens *after* `endDay()`
has already set `phase = 'ended'`, and my ledger only accepted entries while
`'awake'`. So the one line the reckoning card exists to show was being **dropped on
the floor**, every time. The FAIL fired, the outcome was right, and the words never
reached the screen.

The consequence of a day belongs to that day. The ledger now accepts a stage while
the day is closing, and that is not a loophole: after `nextDay()` the ledger is
fresh, so a late stage can only ever belong to the day that just ended.

### 2. Four modules were never in the ENGINE SYNC sweep, and I said they were

On 8/11 I gave the four modules I inlined the resync banner and wrote in the commit
message that they had "joined the ENGINE SYNC sweep." They had not. The resync's
scanner is:

```py
if s.startswith('/* ==== engine/') and s.endswith('==== */')
```

and my banner was:

```
/* ==== engine/bohemia_dayloop.js ==== */   /* __DAY_LOOP__ */
```

The trailing marker comment meant `endswith` was false, so all four were **outside
the sweep** — and I only found it because the resync cheerfully reported "43
embedded, 43 already fresh" about a module I had just changed and it had not
touched. **A claimed reuse the machine does not actually perform is worse than no
claim**, because it buys false confidence: I had a green sweep telling me these four
could never drift, while they were the only four that could.

Fixed at the source and in the tool. **42 → 47 modules actually swept**, and I
proved the sweep now bites by drifting one on purpose and watching it come back
`STALE`.

While I was in there: two of the WORLD lane's banners (`bohemia_agents.js`,
`bohemia_population.js`) fail the same test because their banner lines wrap onto a
second line. Not mine to fix, and written down here and in the handoff.

---

## GATES UPDATED, NOT WEAKENED

`dayloop_gate` and `home_phone_gate` both encoded the old auto-start. They now
assert the **new, stricter** shape:

- the day starts with **no objective** — and the gate checks the HUD line is
  literally empty, which the old design could never have passed
- taking the job is what makes it live
- day 2's brief is on the **phone**, and the gate reads the offer the run built
  rather than the card that no longer carries it

## PROOF

`gates/phone_rings_gate.js`, 21 assertions, tapping the real buttons in a real
browser, **both scenarios end to end**:

- he takes it and runs out of light → the author's own FAIL line lands in the
  reckoning
- he never takes it → nothing runs, and the reckoning says *"never taken"*

Plus DAY LOOP 54/54, HOME + PHONE 24/24, ONE ZOOM 16/16, SHIPPED TRUTH 37/37.

---

## WHAT THIS BUYS, AND WHAT IS STILL MISSING

The phone is now **load-bearing**: it is how work reaches him. Delete it and the
day has no job.

Still missing, and it is the next thing: the phone does not **buzz**. The badge
appears silently. There is a `phone_buzz` in the sound lane's world already, and
the SFX bus is live in the alpha, so this is a wiring job rather than a cook.
