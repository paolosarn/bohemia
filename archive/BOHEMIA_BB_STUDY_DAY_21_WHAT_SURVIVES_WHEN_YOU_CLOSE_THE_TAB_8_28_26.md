# BB STUDY -- DAY 21: WHAT SURVIVES WHEN YOU CLOSE THE TAB
# (coordinator, on his trigger. Days 1-20: records/BOHEMIA_BB_STUDY_DAY_*.md)
# A HUNDRED-HOUR GAME, IN A BROWSER TAB, ON A PHONE. NOBODY ASKED IF IT
# REMEMBERS YOU.

## 0. THE QUESTION
THERE ARE NO RUNS. ~100 hours. Three generations that INHERIT everything.
Twenty days of this study have designed for that world and **not one of
them asked the question the whole thing rests on: when he locks his
phone, what is still there tomorrow?**

## 1. *** THE GOOD NEWS FIRST, BECAUSE IT IS RARE IN THIS STUDY: THE SAVE
## IS THE SECOND-BEST-BUILT THING I HAVE FOUND IN TWENTY-ONE DAYS. ***
`engine/bohemia_save.js` (8/11) is 330 lines written against a hostile
iPhone, and its header lists the four ways v1 lost people's runs and kills
each one:
- **THE PROBE LIED.** v1 test-wrote one byte, which succeeds in exactly
  the case where a real 200 KB save throws quota. v2 **probes with a blob
  the size of the real save and reads it back.**
- **THE TIME MACHINE.** v1 fell back to memory and left the OLD save on
  disk, so the next launch silently sent you backwards. v2 **poisons the
  disk slot and writes a tombstone** the instant a write fails.
- **ONE SLOT.** v2 keeps **two slots and a generation counter and always
  writes to the OLDER one**, so a torn write costs the newest state, never
  everything.
- **NO INTEGRITY.** Every envelope carries a byte length and an FNV-1a
  checksum; load takes **the highest generation that VERIFIES**, so a
  corrupt newest slot falls back to the intact older one by itself.
Plus a **version chain with migrations** (an exact-equality `v!==1` would
have wiped every save on the first bump), a refusal that is REPORTED
rather than looking like an empty save, and **the phone path**: `pagehide`,
`freeze`, `blur` and `visibilitychange` all flush. `gates/save_iphone_gate.js`
drives all of it against a fake hostile browser: **44 passed, 0 failed.**
### AND WHAT RIDES IN IT IS THE RIGHT LIST
`citySnapshot()` carries seed, day, minute, **where you are standing**,
the city cell, mode, riding, zoom, **the whole day loop**, **the whole
quest runtime**, the day's cast, vistaSeen, installAsked, **the purse**,
and the market ledger. Its own comments are some of the best design
writing in this repo:
> *"a day loop that does not survive a reload is a session toy, not a
> loop."*
> *"a day's pay that dies with the tab is not pay."*
> *"the person you walked an hour toward becomes somebody else because you
> closed the tab."*
**I expected a hole here and there is not one. Say that plainly.**

## 2. *** THE FINDING: THE WORLD IS INSIDE THE WALLS AND THE PEOPLE ARE
## OUTSIDE THEM. ***
Measured: the walked city makes **ten** `localStorage` writes. Four are
dev tools. **The other five are the game's memory of PEOPLE, and every one
of them goes to raw `localStorage` directly, around the hardened save:**
```
boh.city.minds       what each person's mind holds (sightings, familiarity)
boh.city.known       what you have learned by overhearing
boh.city.met         who you have met and whose name you know
boh.city.belong      whether an outfit counts you, and what you owe them
boh.city.deedweight  what a deed is worth
```
Against the four failure modes the save module exists to kill:
| | hardened save | the five people keys |
|---|---|---|
| slots | **two** + generation | **one** |
| checksum | FNV-1a, verified | **none** |
| version / migration | yes | 1 of 5 (`belong`) |
| write failure | poisons, reports | **`catch(_e){}`, silent** |
**AND THEY ARE NOT IN `citySnapshot`. Measured: `met`, `minds`, `known`,
`belong`, `deedweight` all appear ZERO times in it.** So:
- **EXPORT SAVE DOES NOT CARRY THE PEOPLE.** The module's own escape hatch
  for a memory-only run hands you your day, your position, your job and
  your money, and a valley where nobody has met you.
- **A RESTORE DOES NOT RESTORE THEM.** Load a save and you get yesterday's
  world with today's population.
- **THE TWO-SLOT ROLLBACK DESYNCS THEM.** The whole point of two slots is
  that a torn write costs one autosave. The people keys have no
  generations, so the world rolls back and the people do not. **A TORN
  SAVE ACROSS TWO SYSTEMS IS WORSE THAN A LOST ONE, BECAUSE YOU CANNOT SEE
  THAT IT IS WRONG.**
- **THE GATE CANNOT SEE THEM.** 44 checks, and `met`, `minds`, `known`,
  `belong` and `deedweight` appear **zero times** in the gate file.
- **A CLEAN SLATE ONLY CLEANS TWO OF FIVE.** `__CT.wipe` removes `met` and
  `belong`. `minds`, `known` and `deedweight` survive it -- and the wipe's
  own comment reads **"A WIPE THAT LEAVES HALF THE SAVE IS NOT A WIPE"**,
  written when it was fixed from one key to two.
### WHY THIS IS THE WORST PLACE TO HAVE THE GAP
Day 4: attachment is built from marks that persist. Day 7: the motor is
obligations to people. Day 16: because we never reset, **every
relationship in Bohemia is a repeated game.** Day 20: with no paper and no
courts, the contract IS repeat business. **Four separate days concluded
that the people are the point, and the people are the one thing not inside
the save.** The belonging code says it itself, one function above the
break: *"A partially restored standing is worse than a fresh one because
you cannot see that it is wrong."* **The principle was written down and
then broken one screen later, at a bigger scale** -- the same
half-finished-fix-under-a-correct-comment class already named on 8/27.

## 3. THE OTHER AISLE -- *** THE PLATFORM PUT A RUN TIMER ON A GAME WHOSE
## FIRST LAW IS THAT THERE ARE NO RUNS. ***
Checked against the real rule, not assumed. Since iOS 13.4 / Safari 13.1,
WebKit's tracking prevention **deletes ALL of a site's script-writable
storage after seven days of browser use without interaction on that site**
-- localStorage, sessionStorage, IndexedDB, service worker registrations,
the lot. **No amount of code survives it. There is no version of our save
that beats it.**
> **THE FIRST LINE OF CLAUDE.md SAYS THERE ARE NO RUNS. SAFARI SCHEDULES
> ONE, ON A ONE-WEEK CLOCK, AND WE DO NOT GET A VOTE.**
### AND THERE IS EXACTLY ONE EXEMPTION, AND WE ALREADY BUILT THE DOOR
A web app **added to the Home Screen is not part of Safari and keeps its
own counter of days of use, which resets every time you use it.** So:
> **ADD TO HOME SCREEN IS NOT A CONVENIENCE FEATURE. IT IS THE SAVE.**
The code already knows: `status()` computes `evictionRisk` from
`navigator.standalone` and says the true sentence -- *"Saved to this
device. Safari erases it after 7 days without a visit -- add Bohemia to
your Home Screen, or EXPORT SAVE."* And `__KEEP_THIS_RUN__` puts the ask
on the reckoning card he is already reading, **once**, with its own
comment *"a prompt that comes back every night is an ad"*, and
`installAsked` rides in the save so it stays once across reloads.
**That is all correct and it is one line, asked one time, on the one night
he happens to read the card -- defending a hundred hours.** It is the
right shape and it may be the wrong weight, and that is a judgement call
worth making deliberately rather than by default.

## 4. WHAT THE GAME HE NAMED DOES
- **IT AUTOSAVES BEFORE EVERY BATTLE**, and again when you leave a town.
  The fight is the moment worth protecting, and it protects it on purpose.
- You can also **save freely at any time**; ironman removes that and is a
  CHOICE, never the default (day 16 already refused ironman for us).
- Save times of forty seconds are a real player complaint on big
  campaigns, which is the cost of saving a whole living world.
### OURS, MEASURED: THE FIGHT IS COVERED BY ACCIDENT
`CITYSAVE.save` is called only when the city posts state, and **nothing
fires it at the moment combat opens.** Opening the fight blurs the city
iframe, which fires `flushState`, so in practice it is probably saved --
**by a side effect, not by intent.** A protection nobody wrote down is a
protection nobody is maintaining.

## 5. THE NEAR-MISS, RECORDED BECAUSE IT IS THE THIRD OF ITS KIND
I measured the five people keys against `slices/BOHEMIA_DEMO.html` and got
**zero for all five**, which reads as "the demo does not save the people at
all" -- a big, wrong, demo-critical finding. **The positive control killed
it:** `applyRestore` and `__DAY_LOOP__` are also zero in the demo AND zero
in the alpha, because **both load the walked city by `src`, as a separate
file.** The demo carries the save exactly as the workshop does.
**Same lesson as the base64 fight (day 4) and the muzzle heat (day 15): a
negative result is a claim about your instrument until you have shown the
instrument could have seen a positive one.**

## 6. WHAT WE TAKE, AND WHAT WE REFUSE
**TAKE:** the people inside the walls -- one save, one integrity story.
A deliberate save before the bell rather than an accidental one. And a
harder look at the home-screen ask, because it is the only thing standing
between a hundred hours and a platform rule.
**REFUSE:** a second storage system to "fix" this -- the whole finding is
that we already have two. Also refused: IndexedDB as a mirror, which the
module already refused with a reason (ITP evicts it on the same seven-day
schedule, so it buys nothing for the failure that matters and costs an
async path in a save that must be synchronous at page-hide). And refused:
manual save slots, which is a spreadsheet-simulator answer to a phone
game -- the autosave is right, it just has to cover everything.

## 7. ROUTED
- **SHARED -- BB-THE-PEOPLE-RIDE-THE-SAVE.** Fold `minds`, `known`, `met`,
  `belong` and `deedweight` into `citySnapshot` (or route them through
  `BohemiaSave`) so export, import, restore, rollback and wipe all cover
  them. **ENGINE SYNC LAW in its purest form: one canonical body.** The
  five are small and already serialise themselves; this is wiring, not
  invention.
- **SHARED -- BB-THE-GATE-WALKS-THE-PEOPLE.** 44 checks that touch none of
  the five. Extend the hostile-browser harness over whatever the previous
  row lands, including the desync case: roll the world back one generation
  and assert the people came with it.
- **RUN / UI -- BB-HOME-SCREEN-IS-THE-SAVE.** The platform deletes a
  hundred-hour game after seven quiet days and the home screen is the only
  exemption. Today that is one line, asked once. Decide deliberately what
  it should be -- it is the highest-stakes single sentence in the build,
  and `evictionRisk` already computes when it is true.
- **COMBAT / SHARED -- BB-SAVE-BEFORE-THE-BELL.** Save on purpose when the
  fight opens, the way the game he named does. It is probably already
  happening through `blur`; make it deliberate so it cannot quietly stop.
**RUNNING ORDER:** all four queue behind the demo, but
BB-THE-PEOPLE-RIDE-THE-SAVE is the one to take first in its lane -- every
day of this study that talked about attachment, obligation or repeat
business was talking about data that is currently outside the save.

## 8. CONFIDENCE
- The ten `localStorage` writes, the five people keys, their absence from
  `citySnapshot`, the wipe covering 2 of 5, and the gate's zero mentions
  of all five: **MEASURED** in the repo today.
- The save module's four fixes, the two-slot generation scheme, the FNV
  checksum, the migration chain and the phone path: **READ IN FULL**, and
  `save_iphone_gate.js` **RUN TODAY: 44 passed, 0 failed.**
- The demo carrying the save: **MEASURED WITH A POSITIVE CONTROL** after
  the first measurement was wrong (section 5).
- WebKit's seven-day deletion of all script-writable storage, and the
  Home Screen exemption keeping its own use counter: **HIGH** -- it is
  WebKit's own published behaviour from iOS 13.4 / Safari 13.1 and it is
  what the module's header already claimed. I did **NOT** find a 2025-2026
  source confirming the policy is unchanged, so treat "still true today"
  as **MEDIUM-HIGH** and worth one re-check before the demo ships wide.
- BB autosaving before every battle and on leaving a town, free saving,
  and the forty-second save complaint: wiki and Steam discussion.
  **MEDIUM-HIGH.**
- Section 2's desync argument, section 3's "add to home screen is the
  save", and section 7: **MY ARGUMENT AND MY ROUTING.**

## SOURCES
WebKit's tracking-prevention announcement of the seven-day cap on all
script-writable storage (Indexed DB, LocalStorage, SessionStorage, media
keys and service worker registrations) from iOS 13.4 / Safari 13.1, and
the accompanying note that web applications added to the Home Screen are
not part of Safari and keep their own counter of days of use. Battle
Brothers wiki and Steam discussions on autosaving before every battle and
on leaving a town, on free saving, and on save times in long campaigns.
IN-REPO: engine/bohemia_save.js in full; gates/save_iphone_gate.js (run,
44/0); slices/BOHEMIA_CITY_WORLD.html (`citySnapshot`, `applyRestore`,
`migrateCity`, `flushState`, `__KEEP_THIS_RUN__`, and the five
`boh.city.*` writes); slices/BOHEMIA_ALPHA_0_9.html (`CITYSAVE`);
slices/BOHEMIA_DEMO.html (the positive control); and days 4, 7, 15, 16 and
20 of this study.
