# THE DAY CLOSES — 8/11/26 (RUN lane, demo rows)

Paolo's instruction, verbatim:

> full steam on your demo rows — close the game day loop end to end (hardcode
> the demo quests, scaffolding is legal), make the save iPhone-proof, adopt the
> streaming engine so crossings are smooth, and stand ready to consume the cold
> open scene and the vista as they land.

Two rows shipped. What each one actually was, what it is now, and the two things
the gates found that reading the code did not.

---

## ROW: MAKE THE SAVE IPHONE-PROOF

The demo is played on a phone, in Safari. CITYSAVE v1 (7/7/26) lost the run to
four things Safari really does, and one of them it did under a comment promising
it never would.

**1. The probe lied.** `localStorage.setItem('__bp_probe','1')`. One byte. A
one-byte write succeeds in exactly the conditions where a 200KB save throws
QuotaExceededError, so the save reported "device storage (autosaves survive
reload)" and then dropped every autosave into memory in silence. v2 probes with a
blob the size of a real save and reads it back.

**2. The time machine.** v1's own comment said "Never a time machine" and then
built one. On a failed write it flipped to memory and LEFT THE OLD SAVE ON DISK.
Next launch, the one-byte probe passed, mode went back to disk, and the player
silently resumed an older run with no message. v2 kills the disk copy the moment
the live state can no longer be written to it.

**3. One slot.** A single key means the write that fails is the write that
destroys your only copy, and iOS reaps backgrounded tabs hard. v2 keeps two
slots with a generation counter and ALWAYS writes the OLDER one. The newest good
save is never the target of a write.

**4. No integrity.** `JSON.parse` in a try, `null` on throw: a truncated save was
indistinguishable from no save, and the game quietly started over. v2 stamps a
byte length and an FNV-1a checksum and loads the highest generation that
VERIFIES, so a torn newest slot falls back to the intact older one by itself.

### The two bugs the gate found that reading the code did not

Both were found by writing a hostile fake browser and letting it be hostile.

**A second door to the same time machine.** I fixed "poison the disk when a write
fails" and the gate still went red. A session that comes up in MEMORY mode
because the phone was ALREADY full plays on, never writes, and leaves the stale
save sitting there for the next launch to resurrect. Same rewind, different door.
The real rule is not "poison on write failure" — it is *the moment the live state
diverges from what is on disk and we cannot update disk, the disk copy is a time
machine and it dies*. That moment is the first memory-mode save.

**A kill that needs no space.** The worst real case is a device that is FULL and
whose `removeItem` throws. Nothing can be deleted and no tombstone fits, so the
stale save survives everything. The fix is to OVERWRITE each slot with a tiny
DEAD marker: replacing a big string with a small one can never exceed a quota, so
the kill works with no room and no delete.

### And the one that is not a code fix

iOS Safari's ITP wipes all script-writable storage after 7 quiet days. Nothing a
page can do survives it; a Home Screen install is exempt. Mirroring to IndexedDB
buys nothing (ITP evicts it on the same schedule) and costs an async path in an
autosave that must be synchronous at page-hide. So the player is TOLD instead:
the save line now names the 7-day wipe and points at Home Screen or EXPORT, while
it is still true rather than after the run is gone.

### Also fixed, same defect class

- **The flush iOS actually delivers.** The city flushed on `pagehide` alone. In
  an iframe on iOS that is the event least likely to fire — Safari reaps tabs
  through visibilitychange and freeze, and those go to the TOP document, not the
  frame. Switching apps mid-run ate up to 800ms of play and, on a reap, the whole
  unflushed delta. All four events now force the same idempotent flush.
- **Import dropped the prefabs it was importing.** `CITYSAVE.save(sv.data)` ran
  BEFORE `G._prefabApproved=sv.prefabs`, so the re-save captured the old ones.

**Gate:** `save_iphone_gate.js`, 44 assertions. Full device, silent write, torn
write, same-length byte flip, refused delete, ITP eviction, no localStorage at
all, a store that throws on access, v1 migration, and the A/B rule across twelve
autosaves — then the whole thing again on the real alpha in a real browser.

---

## ROW: CLOSE THE GAME DAY LOOP END TO END

### What was there

```js
const T={day:1, min:8*60};
function advance(mins){ T.min+=mins; while(T.min>=24*60){T.min-=24*60;T.day++;} }
```

A timer. Nothing woke you, nothing ended, nothing was reckoned, and day 2 was day
1 with a different number in the corner.

And the thing that makes this the same story as every other defect this lane has
chased: **a finished .bq parser, a full quest runtime, a loop engine and 21 canon
quests were sitting in `engine/` and in NEITHER file the player loads.** The work
existed. It was just not in the surface he taps.

### What ships

```
WAKE 06:00 --- 16 waking hours --- NIGHTFALL 22:00 --- THE RECKONING
  ^                                                          |
  +-------------- day + 1, everything carried ---------------+
```

- a WAKE card opens the day and states the day's quest in its own words
- the live objective sits on the HUD all day
- walking into the right place ADVANCES the quest: into an unlit building on day
  1 (the world's real 12% clustered power grid makes "a block that browns out" a
  thing you can actually go and find), into a house on day 2, across a district
  line on day 3
- a RESOLUTION card offers the quest's real branches
- the choice runs the real `@DO` verbs — bond, faction, faction_posture,
  objectives — and they ride the save
- **NIGHTFALL on an unresolved quest fires the quest's OWN FAIL STAGE**
- the RECKONING says what the day was; SLEEP starts the next one
- loop AND quest state persist, so a reload puts you back mid-job

### Every button is his words, and the machine checks it

A resolution option's label is the destination stage's `@LOG` line, **verbatim**,
not prose I wrote about it. Two reasons, and the second is the one that matters:
inventing choice text would be filling in canon he reserved, and it would be
unverifiable. Taking his line makes every button a claim the machine can check —
`dayloop_gate.js` diffs each one against `quests/bq/*.bq` byte for byte. If a
later hand writes a nicer-sounding button, the gate goes red.

### The teeth are his teeth

The day needed a consequence and I was not going to invent one. Every quest
already ships a FAIL stage its author wrote for exactly this case. So nightfall on
an unresolved job takes that branch and prints that line:

> Left it alone. The block goes dark again tonight, same hour.

Real stakes, zero invented numbers, and **NO DAMAGE BEFORE THE DIAL** still holds.

### What is scaffold, said plainly

**The casting.** The real system (`engine/bohemia_quest_placement.js`) casts
`@ROLE` against people who exist and places the quest where they are. This binds
stages to WORLD EVENTS instead — where you walked, what you walked into, whether
the block had power — one quest per day, fixed order. That is a demo, not a game,
and it is the honest way to have a playable day before casting is wired. It says
SCAFFOLDING in the filename, the banner, the marker in the city, and the gate.

### What is Paolo's and is left empty

**What a day COSTS to live.** Hunger, exhaustion, rent, a debt clock. The loop
carries a `STAKES` table built to take any of them and it is EMPTY ON PURPOSE.
MECHANISM-MINE / CONTENTS-PAOLO'S: I built the day, he sets the price of one. The
gate asserts the table is empty, so a later hand cannot quietly price a day
without him.

**Gate:** `dayloop_gate.js`, 53 assertions — including a full day played
wake → nightfall → next wake in a real browser, and then again **through the
alpha's RUN tab**, because clause 1b of MEASURE THE THING HE NAMED is that a
measurement not taken where he is standing is not a measurement of what he sees.

---

## MEASURED, AND IT BELONGS TO THE NEXT ROW

Driving the RUN tab exposed a number worth writing down: **the city frame's
script does not begin executing until ~15 seconds after the RUN tap** on a cold
local load — 1.35MB of inline world plus generation, on a desktop, off a local
file. My first attempt at that check used a fixed 6-second wait and reported the
day loop DEAD when it was merely not born yet. A gate that lies in the same
direction as a bug is worse than no gate, so it now waits on the CONDITION.

That 15 seconds is the streaming row's problem, and it is now a measured one
rather than a suspicion.

---

## THE PATTERN, FOR THE THIRD TIME THIS WEEK

The day loop was not missing. It was finished, tested, and unreachable. So was
the quest runtime. So were 21 quests. The defect was never "build the thing" — it
was "the thing is not in the surface he taps," which is exactly what
`shipped_truth_gate.js` exists to catch, and both features are registered in it
now.
