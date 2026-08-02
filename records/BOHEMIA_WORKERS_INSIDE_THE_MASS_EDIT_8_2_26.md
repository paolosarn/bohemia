# WORKERS ARE INSIDE THE MASS EDIT — 8/2/26, PEOPLE lane

Paolo, 7/29, LOCKED: **editing the people means ADDING A RULE**, and a rule
reaches everybody. This lane put commuting workers on the surface on 8/1 and
they were the one set of bodies that law could not touch. This is the fix, the
second bug the fix caused, and the two gates that now stand where both happened.

---

## WHAT WAS WRONG (three things, found in this order)

### 1. A worker at a job site had no person record at all
The run built its agent list, ran the person-facts pass over it, and THEN
concatenated the commuters. Every body added after that pass is a body with no
entry in `RUN_PEOPLE`, and a body with no entry is a body no rule can reach. Add
a rule that says "everyone stays in past 15:00" and the 22 people standing in the
clinic walk straight through it. Measured on the real surface: **0 records for 22
bodies.**

### 2. The same person had two different characters
`peopleForAgents` derived every record from `(the cell you are standing on,
your index in this cell's roster)`. A commuter is standing somewhere they do not
live, so the neighbour whose name you asked in your own street was a different
human being at the clinic — different archetype, different heat tolerance,
different day. Same class of bug as keying identity to the world seed instead of
the block seed, which this lane already made once on 7/31.

### 3. THE FIX'S OWN BUG: the concat ran twice
Moving the concat up meant the old `PEOPLE:JOIN` fence was no longer emitted by
the patch tool. **A fence the tool stops emitting is not a fence that goes away.**
Its text stays applied in the file forever, and the tool no longer knows how to
undo it, so both copies of the concat ran: every workplace carried **44 bodies for
22 identities** — everyone standing next to a copy of himself — and on a
non-residential cell the leftover clamp threw away the very bodies that had just
been given records. That shipped for one commit. It is the more interesting bug of
the three, because every gate was green while it was live.

---

## THE FIX

| Where | What |
|---|---|
| `engine/bohemia_agents.js` | `workersForPlot` stamps `v.homeIndex = i` — a visitor's seat in their OWN block's roster travels with them, alongside `fromCell` |
| `engine/bohemia_population.js` | `peopleForAgents` derives a visitor from `(fromCell, homeIndex)`, not from the cell they are standing on |
| `tools/bohemia_people_identity_patch.py` | the concat moved into `PEOPLE:WORKERS`, which closes BEFORE the other lane's person-facts block; `PEOPLE:JOIN` kept as a **strip-only row** whose anchor and insert are the same line, so the tool still knows how to delete the corpse |

A block is only really deleted when the tool still knows how to undo it. That is
the durable lesson and it is written into the tool at the JOIN row.

---

## THE GATES (mutation-tested, not just green)

Green on the first try means nothing. Every claim below was proved by breaking
the code and watching it go red.

**people_gate.js — new part J (7 claims, code side)**
- J3 one person record per body, workers included
- J4 the same character at work and at home
- J5 a bulk edit reaches the worker at the job site
- J7 removing the rule puts them back exactly

**people_gate.js — new D11a/D11b (the real surface, at the workplace)**
The old surface check only ever looked at the cell the game opens on. That cell is
residential and has no commuters, so it was structurally incapable of seeing any
of this. D11a/D11b `gotoCell` the clinic and count bodies against records.

**people_gate.js — F5 rewritten**
It asserted the OLD arrangement (`JOIN opens after their block`), which was the
bug. It now asserts what is actually true: the workers join **exactly once**,
before the person-facts pass, and the dead fence is gone.

**F4 rewritten — a checker that cannot tell a mention from a use is the broken one**
F4 flagged any fence containing the words "RUN PERSON FACTS". Writing a *comment*
saying where the other lane's block begins turned the gate red while nothing was
wrong. It now looks for the banner syntax and the actual `conditionAgents` call.
Paolo's own 8/1 law: fix the ruler, never the target.

### The mutation runs

| mutation | result |
|---|---|
| visitor derived from the cell they stand on | J4 red |
| visitor gets no record | J3, J4 red |
| concat after the person-facts pass (bug 1) | **D11a red: 0/22 records**, F5 red |
| concat twice (bug 3) | **D11a red: 22/44**, D11b red: 22 identities / 44 bodies, F5 red |

---

## AND THE CLASS OF BUG IS NOW GATED FLEET-WIDE

Bug 3 is not a PEOPLE bug. Half a dozen lanes edit each other's surfaces through
marker-fenced patch tools, because under the parallel-sessions law that is the
safe way to touch a file you do not own — and every one of them has this failure
available to it. So it is gated for everybody, not patched for me:
**`gates/fence_orphan_gate.py`** (suite name `FENCE ORPHAN`, 9 claims).

It sweeps every marker block in `slices/` and `engine/` and asserts three things:

1. **No orphan.** A tool that writes a fence necessarily contains its marker
   text, so a marker no tool source anywhere mentions is a block nothing can
   remove. Measured today: **24 fences, 0 orphans** — mine was the only one, and
   it is gone.
2. **Every fence is a pair.** `restore()` matches open..close non-greedily, so a
   missing or doubled closer makes it eat past its own end. That is the 8/1 bug
   where a fence came to span 29 lines of another lane's code and a re-run
   deleted them silently.
3. **No block is applied twice.**

It also **self-tests**: three synthetic probes prove the checker sees each shape,
rather than proving that the repo happens to be clean today. And it holds the
worked example down — the strip-only JOIN row and the sentence explaining it have
to stay in the tool where the next lane will meet them.

Mutation runs, on the real tree, all caught: recreating the exact orphan that
shipped, applying a fence twice, and deleting a closer.

## WHERE PAOLO CAN SEE IT

**RUN tab.** Walk to a workplace next door. The people in it are your own
neighbours, one each, and asking one their name in the street still knows you at
the clinic tomorrow. Before this, half the bodies in there were duplicates.

Gates: PEOPLE 130 -> **139**, RUN PEOPLE 45 (held).

---

## AND WHILE SHIPPING THIS, THE ONE LINK WAS DEAD

Found by the full suite, not by looking for it. **THE RUN** went red, so I checked
whether it was mine: it fails identically on clean `origin/main` with none of my
changes, and it passes on the commit before. So it arrived with `5a42b42`.

**One `</div>` was dropped** — the one that closes the front splash. `<div id="app">`
then parsed as a **child** of `<div id="front">`. The splash handler does exactly
what it always did:

```js
front.style.display = 'none';  app.style.display = 'flex';
```

but a child of a `display:none` parent is not rendered no matter what its own
display says. Measured on the real surface at 390x844:

| | before the tap | after the tap |
|---|---|---|
| `#app` parent | `front` | `front` |
| `#app` box | — | **0 x 0, zero client rects** |
| tabs visible | — | **0** |

**Paolo taps the link, taps the screen, and gets a black rectangle.** Every lane's
work for the last few hours was shipping into a build that could not be opened.

FIXED: the `</div>` is restored. `#app` parent is BODY, 390x844, tabs on screen,
`run_gate` back to **126/0**.

### AND IT IS GATED NOW: `gates/front_door_gate.js` (suite name `FRONT DOOR`)

The ONE-LINK LAW is one of the oldest locked laws in the repo and **nothing gated
the door itself**. run_gate did catch this, but as a 30-second Playwright timeout
reading "element is not visible" — a symptom three screens deep in a 126-claim
browser test, saying nothing about a missing tag. 8 claims:

- **S2** the splash closes before the app opens, reported as `4 <div> open vs 3
  </div> close` — the cause, in one line, in about a millisecond
- **S3/S4** self-test: the exact 8/2 edit applied to an in-memory copy, and the
  checker catches it
- **R1** `#app` is not inside `#front`, on the real surface
- **R2** tapping the splash opens the game rather than a black screen, measured as
  a real box at 390x844
- **R3** the tabs he navigates by are on screen
- **R4** nothing throws walking through the front door

Mutation: reintroducing the real break on disk fails 5 of the 8.
