# 82 CONSEQUENCES HE WROTE THAT NOBODY IN LAS VEGAS EVER SAW
## 8/28/26, FACTIONS lane

TAB: **RUN**. Play a day's quest, then walk up to anybody who runs with the
outfit it touched and read their card, or open the ⚔ OUTFIT board.
Build 8/28y.

---

## 1. WHAT WAS ALREADY THERE, AND WHAT WAS MISSING

Paolo has written **82 faction consequences** into `quests/bq/*.bq` — lines like
`faction REDS +10`, `faction CARAVANS +12` — across **25 of his 27 quests**,
every one carrying the clout tag that says how loud the act was (notable 28,
reckless 23, quiet 16, risky 15).

The demo plays three of those quests with the real parser and the real runtime,
and the `faction` verb **is** handled: it adds the number to quest state and to
a shared ledger that survives the day.

That is the whole of it. The number moved valley-wide and instantly, and **not
one person in the city saw it happen.** No card changed. No outfit formed a
view. The people standing next to you when you did it remembered nothing.

`engine/bohemia_deeds.js` was built on 8/6 to close exactly this. Its own
comment calls `publishStage` "the convenience the run lane will actually call."
Nothing ever called it.

---

## 2. WHY THIS SHAPE, AND IT IS NOT MY OPINION

Fallout: New Vegas shipped **both** designs at once, which makes it an unusually
clean experiment:

- **Karma** is omniscient: it moves whether or not anybody saw, it is global,
  and it is invisible. The settled verdict is that it is "almost completely
  irrelevant... the score doesn't matter in any but a few isolated cases."
- **Reputation** is per-faction and moves when somebody **catches** you: "if
  someone catches you performing an action that causes negative Karma against
  their faction, you will often lose reputation with that faction." That is the
  half everybody remembers and the half the whole game is built on.

Bohemia's `s.faction[NAME] += delta` ledger is, precisely, **karma**. This turn
does not add a system. It moves his authored numbers off the karma path and
onto the reputation path that was already built, already gated, and already on
the card.

Sources: [Fallout: New Vegas reputations](https://fallout.fandom.com/wiki/Fallout:_New_Vegas_reputations),
[Karma (Fallout: New Vegas)](https://fallout.fandom.com/wiki/Karma_(Fallout:_New_Vegas))

---

## 3. FIVE BUGS, EACH OF WHICH ALONE KEPT THIS INVISIBLE

**A. The witness matcher was case-strict.** `publish()` picked witnesses with
`factionOfOwner(owner) === faction`, comparing the city's faction id to the
quest's spelling. Measured across the corpus:

```
82  authored deltas
23  matched
59  named a real faction IN A DIFFERENT CASE and matched nothing
 0  named a faction that does not exist
```

He writes `faction TRADES +8`; the canon id is `Trades`. Fifty-nine lines of his
writing would have gone into nobody's head, and `publish()` would have returned
`witnesses:0` — indistinguishable from "nobody was standing there." A matcher
that was too strict, never content that was wrong.

**B. `scanQuest` could never run on the walked surface.** It called
`LOOP.cloutTagFrom` directly, and the city loads `BohemiaClout`, not the 75 KB
`BohemiaLoop`. `LOOP` was null there, so it threw on its first line —
`loadCorpus` could not fill the table and `publishStage` could not publish, on
the one surface all of it was for. `cloutWeight` had been given exactly this
fallback on 8/21; `scanQuest` was missed. **The half-applied fix was the whole
bug.**

**C. `where` is a function, not a place.** `witness()` takes
`where(owner) -> {x,y}`. I passed the string `'@'`, which is truthy, so it was
called and threw — swallowed, reported as `witnesses:0`. The exact ambiguity
this bridge exists to remove, reintroduced one argument to the left.

**D. The DIRECT dial was wiping his quest corpus at boot.** This is why it read
as working standalone and broken in the alpha: boot table **82** on the city
page, **0** inside the alpha. `ctDialApply` deletes every row before writing the
dial's, and its comment is right about the four kinds the dial owns — a kind he
clears must really clear. It is wrong about the 82 `q:` rows, which come from
his files, which the dial cannot name and can never put back. **An empty dial
was erasing his whole quest corpus before he touched anything.** Now: clear,
reload the corpus, apply the dial on top. Clearing still clears, quest rows
survive, a hand-set weight still wins.

**E. The card could not say why.** `CT_DEED_WORDS` only ever held the four kinds
the city witnesses, so a `q:<quest>:<stage>@<FACTION>` deed fell through and
vanished — the view moved and nothing could explain it. `loadCorpus` already
stores each stage's `@LOG` line in `LABELS`, the sentence he wrote for exactly
this moment, and `labels()` was another function reported as reached by NOTHING
ANYWHERE. No words are invented: an authored deed is described by its author's
own sentence; only the eyewitness/hearsay split is mine.

---

## 4. TWO STRUCTURAL CORRECTIONS THE TOOLS CAUGHT

**The quest text was hiding inside a module body.** `const DEMO_BQ=` sat inside
the `==== engine/bohemia_demoquests.js ====` banner, which has no closing
banner, so a resync cuts from there to the next banner. At five quests nobody
noticed; at twenty-seven the resync refused outright — "278742 bytes against a
17216 byte module... NOTHING WAS WRITTEN." That refusal is the tool working as
designed, and the fix is to stop parking a 250 KB blob in a 17 KB module body,
never to loosen the check.

**And the hook was patched into the inlined copy.** The resync then reported
demoquests STALE against its own canon file — the exact drift ENGINE SYNC LAW
exists to kill, and the same drift that meant nobody in Las Vegas had a faction
for thirteen days in August with every gate green.
`engine/bohemia_demoquests.js` now carries a `witness` seam and the city passes
the world in. **The module owns WHEN a resolution counts** (once per
quest+stage, idempotent — a chosen `@OPT` carrying `@DO set_stage` runs the
stage before the UI asks, so both callers must be correct). **The city owns WHO
WAS THERE.** Neither knows the other's job.

---

## 5. THE SCALE, WHICH IS A CORRECTNESS MATTER

`loadCorpus` normalises every weight by the **largest deed in whatever it is
given** — his rule is that the biggest thing a quest can do, done in front of
the whole faction, moves you exactly one rung. The full 27 quests answer **20**;
the five that used to be inlined answer **12**. Loading only those five would
have inflated every weight in the game by 20/12 and moved every rung boundary
with it. So the whole corpus is inlined, and the **sources** are inlined rather
than a baked weight table, so the numbers are re-derived from his files at every
boot and cannot drift from what he wrote.

Three stale numbers in the module's own prose were corrected from the
measurement: it claimed 59 deltas and 69 clout tags (really 82, all tagged) and
a corpus maximum of 18 (really 20). The divisor is derived at load and was never
wrong; only the sentences describing it were.

---

## 6. MEASURED ON THE REAL SURFACE

At the Trades base: 26 Trades people, 3 of them drawn and holding minds. Day
one's quest (`bq_meter_reader`, stage 31) is `TRADES +8`, tagged `notable` —
reach 12 tiles, 3 hops.

```
before   {faction:"Trades", rung:null,      members:3, whoSaw:0}
publish  {kind:"q:bq_meter_reader:31@TRADES", clout:"notable", witnesses:3}
after    the outfit's view has moved, and the card says why in his own @LOG line
```

---

## 7. GATES

```
FACTION BETWEEN   137 passed, 0 failed   (was 122)
STANDING           35 / 0
COMMITMENT         72 / 0
FACTION MEMBERSHIP 60 / 0
DEMO BUILD         25 / 0
ALPHA LOADS        20 / 0
```

**Three mutations, all bite:**

| mutation | dies |
|---|---|
| revert the case fold to `===` | R11, R12, R13 — and R10 still passes, which is the point: publish "succeeds" with zero witnesses |
| let the dial wipe the corpus again | R6, alone |
| turn off idempotence | R14, alone |

`dayloop_gate` is 57/2, and **that predates this change** — verified by running
it against origin/main's own city, which gives the identical 57/2.

**One gate claim was rewritten rather than quietly loosened.** Q6 read "with his
table EMPTY it never prints a rung," enforcing MECHANISM-MINE /
CONTENTS-PAOLO'S. That principle is untouched; what moved is where his judgement
comes from, since his own authored lines now fill the table. The table being
empty was never the point — **nobody is judged for something nobody saw** is the
point. Q6 now asserts that an outfit whose people have witnessed nothing shows
no rung, however full the weight table is.

---

## 8. WHAT IS STILL DEAD, NAMED RATHER THAN QUIETLY LEFT

- `BohemiaStanding.inherit` / `legendOf` — reputation outliving the person who
  earned it, which is the dynasty premise. Needs the story's handoff moment,
  which does not exist in the demo yet.
- `BohemiaDeeds.sayWhy` — superseded in practice by the city reading `labels()`
  directly; worth collapsing to one path next time this is opened.
- `BohemiaPeople.peopleOf` — unchanged.

---

## 9. WHAT IS PENDING HIM

Nothing new. The STANDING dial in the **DIRECT** tab still overrides anything he
wants to override, and now it lands on top of his quest corpus instead of
erasing it. `AFFILIATED_RATE` (0.30) and `REACH_CELLS` (12) remain
[PENDING Paolo]. Spawn/base placement remains outside this lane: the nearest
base is 29 cells from the spawn, which is why the demo's quest deed is only
witnessed once you are somewhere its people actually stand.
