# POST-MORTEM — LAB-08 "THE CRASH", KILLED THE DAY IT SHIPPED (7/31/26)

> "IM CONFUSED BY YOUR QUESTION THE WHOLE POINT OF THE GAME IS THAT IT STARTS TEN
> YEARS AFTER THE ECONOMIC CRASH BRO WTF LIKE I DONT WANT IN THE GAME U GOTTA BE
> DEALING WITH SOME WEIRD ECONOMIC GAMEPLAY THE WHOLE WORLD IS BASED ON THE
> UTILITY DYING EVERYWHERE WHAT DO YOU MEANN"

DEAD: `slices/lab/BOHEMIA_LAB_THE_CRASH_7_31_26.html`, deleted and graveyarded.
LAW: `laws/BOHEMIA_ADDENDUM_TEN_YEARS_COLD_7_31_26.md`
REPLACED BY A DIFFERENT QUESTION, same turn:
`slices/lab/BOHEMIA_LAB_TEN_YEARS_COLD_7_31_26.html`

---

## WHAT DIED

Five mechanics. **Three were banned outright the moment the law landed:**

| mechanic | why it died |
|---|---|
| the money dies | a devaluation curve the player watches fall — clause 1 and 2 |
| the freeze | withdrawal caps, deposits, banks — clause 2 |
| the grid dies | a shutoff **timer**, when clause 3 says the utility is already dead everywhere and is not an event |

The other two (the cartel, comfort) were fine, and keeping the page for them
would have been salvaging — which the STOP PRODUCING law names as the violation.

## ROOT CAUSE 1 — I BUILT THE PREQUEL

The game opens **ten years after** the crash. I built the crash.

Every number in it was real and sourced — Lebanon's peg, the corralito, Greece's
€60 — and none of that mattered, because **the player was not there.** Accuracy
about 2019 is not relevance to a game set in year ten. I researched the wrong
decade and never once asked whether the player would be present for it.

**The tell I ignored:** the repo's own name for the setting is
"post-economic-apocalypse". *Post.* It is in CLAUDE.md's first paragraph. I read
"economic apocalypse" and built the apocalypse instead of the post.

## ROOT CAUSE 2 — I ASKED A QUESTION CANON HAD ALREADY ANSWERED

I ended the turn asking whether a dead utility should **disappear or get an
owner**, and presented that as the prize.

It was already ruled, twice, in laws I had read:
- **CLUSTERED POWER** — only ~12% is lit, that 12% is **OWNED**, and the network
  carrying it is eerily perfect.
- **LIGHT = TERRITORY**, and nobody patrols the dark.

I had those in front of me and filed them as *atmosphere*. They are the
infrastructure ruling and they were complete. Asking him to re-decide a settled
thing is a tax on the one person whose time this whole machine exists to save,
and "IM CONFUSED BY YOUR QUESTION" is what that tax sounds like.

**This is the same failure class as the 7/19 NOTES ARE RULINGS law** (never ask
him to re-confirm his own words), one step earlier: never ask him to re-confirm
his own *laws*.

## ROOT CAUSE 3 — GREEN GATES SAID NOTHING ABOUT THIS

491 checks, zero failures, eight mutations caught, a forbidden-feature check I was
pleased with. All of it verified that the page did what its record said. **None of
it could ask whether the page should exist.**

That is the STOP PRODUCING law's exact warning — "green gates are never an
argument" — and it held. The gate now added (`ten_years_cold_gate.js`) closes the
specific hole: it sweeps for economic mechanics as a **category**, so the next
session cannot rebuild this by accident.

---

## WHAT SURVIVED, AND WHY

**The records survive, marked DEAD at the top** — same precedent as the Zomboid
loot teardown (7/26). Facts about Lebanon and about Zomboid's Lua do not stop
being facts because the page built on them was wrong.

**One finding was CONFIRMED rather than killed:** *a dead utility has an owner.*
He said the world is built on the utility dying everywhere; canon says the lit 12%
is owned. Those agree, and that finding is now load-bearing in the law that killed
the page — it is why LAB-09's access to light is a **standing**, not a purchase.

**The forbidden-feature check survives and is the most reusable thing the dead row
produced.** `crashDidNotReopenLoot` proves a page did not resurrect a killed
mechanic, matched as a structure rather than a mention. Every lane's gate should
have one. It is the only machine that can enforce STOP PRODUCING, and it was
written for a page that then got killed for a different reason entirely.

## THE RULE I TAKE OUT OF THIS

**Before researching a system, name the year the player is standing in.**

Two of the three root causes above would have been caught by one sentence at the
top of the work: *"the player is standing in year ten, ten years after this."* I
did the research, the fetching, the citation discipline, the mutation testing — all
of the rigour, pointed at the wrong decade, and no amount of rigour downstream
fixes that.

**NO V2.** Not of the money curve, not of the freeze, not of the timer. The answer
was a different question and it shipped the same turn.
