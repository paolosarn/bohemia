# LAB 08 PATTERN NOTE — THE MODERN ECONOMIC CRASH, FUSED (7/31/26)

Page: `slices/lab/BOHEMIA_LAB_THE_CRASH_7_31_26.html`
Numbers: `records/lab/BOHEMIA_LAB_THE_CRASH_TEARDOWN_7_31_26.txt`
Mechanics played end to end: **the money dies**, **the freeze**,
**the grid dies**, **the cartel**, **comfort**.

Commissioned in four words. Paolo 7/31: *"modern economic crash valheim project
zomboid cook it up"*.

**This is a MODEL, not a measurement.** The Zomboid half is real Lua with
file:line. The Valheim half is one sourced line and the rest documented. The
real-world half can never be source code — history is cited by case and date, and
pretending otherwise would be exactly the lie clause 7 exists to prevent.

---

## THE THING I DID NOT BUILD, FIRST

He said "project zomboid." The lazy reading is to go back to the containers.
**Loot is a closed subject in this lane** — two loot emulations died in two days,
and `laws/BOHEMIA_ADDENDUM_LOOT_IS_RESOURCES_FAST_7_26_26.md` makes Zomboid a
permanent *anti*-reference for loot pace. Under the STOP PRODUCING law a second
rejection ends a feature, and finding a legal way to ship it anyway **is** the
violation.

So this row took the one thing Zomboid has that isn't loot and is genuinely
world-class: **the utility shutoff timer.**

And the Valheim numbers were not re-researched — they were read out of our own
LAB-05 teardown, including which are sourced and which are documented.
REUSE-FIRST applies to findings, not just pixels.

---

## THE FINDING

> **BOTH GAMES MODEL A UTILITY *VANISHING* ON A TIMER. REALITY MODELS IT GETTING
> AN *OWNER*.**

Zomboid flips the power off on day 14 and that's the end of the story — the grid
is a boolean that flips once and never flips back.

What actually happened in Lebanon: the state grid fell to about **four hours a
day**, and private generator cartels sold you the other **six and a half**, by
the **ampere**, for **over $100 a month** — priced in hard currency while wages
were in the money that was busy dying. The utility wasn't deleted. It was
privatised at gunpoint.

That is strictly the better mechanic, because **a boolean is not a decision and
an owner is.**

### And we already half-have it

CLUSTERED POWER: 12% lit, **owned**, the network eerily perfect. LIGHT=TERRITORY.
Nobody patrols the dark.

Those were written as atmosphere. Lebanon is the evidence that they are
**economics**. The claim this row makes, and the one worth arguing with:
**Bohemia's power law and Bohemia's economic collapse are one law, and we've been
treating them as two.**

---

## THE OTHER TWO FINDINGS

### Every curve falls on somebody else's clock. One rises on yours.

The money, the withdrawal cap, the state's hours of power, the price of an
ampere — all move without asking you. Comfort is the only number on the page that
moves *only* when the player moves it.

**That gap is the game.** It's also why the fusion he named actually fuses: the
crash supplies the falling curves, Valheim supplies the only rising one.

### The freeze is crueller than poverty, and no game models it

Games model being broke as an empty wallet. Reality's version is worse: the money
is **right there**, it's yours, it's on a screen with your name on it — and you
may have sixty euros of it today.

Three separate countries made this law: Greece 2015 (€60/day per card, banks
shut), Argentina 2001 (250 pesos/week, the *corralito*), Lebanon 2019– (~$400/
month, deposits still frozen).

And the arithmetic is the finding: under Lebanon's cap, a 20,000 balance takes
**50 months** to extract, during which the money loses ~97% of its value. **You
cannot win the race.** That's not a balance bug — that is what "essentially
frozen" means, in a sentence a player can feel.

---

## THE SMALLER PATTERNS WORTH HAVING

- **A tier picks the range; a modifier picks the date.** Zomboid's designer sets
  a *shape* ("somewhere in the first month") and the world picks the day. Perfect
  for a roguelite: the player learns the shape across runs and never memorises
  the date.
- **You buy amperes, not electricity.** A *capacity*, on a *subscription* — not a
  resource you stockpile. That's a fundamentally different economic object, and
  it's exactly what a faction that owns the light would actually sell.
- **Show doubling time, not percentages.** "13.6 quadrillion percent" means
  nothing to a human. "Prices double every fifteen hours" is immediately
  horrifying. Hungary 1946 vs Zimbabwe 2008 vs Weimar 1923 only became legible
  when I converted all three to the same unit — that's a lesson about HUD design,
  not economics.
- **Two prices for the same currency.** Lebanon's "lollars" — a dollar in a bank
  worth a fraction of a dollar in your hand. Not modelled, and the best remaining
  idea on the list: it makes *where money sits* matter as much as how much of it
  you have.

---

## WHAT NOT TO PORT

- **Zomboid's loot. Ever.** Named again here so a reader of only this file cannot
  mistake the row for permission.
- **A fourth currency.** The THREE CURRENCIES law is locked — resources,
  electricity, clout, and no fourth thing, with Civ-5 spreadsheet feel explicitly
  banned. Nothing on this page adds one, and an "exchange rate" would be a fourth
  currency wearing a hat.
- **The 7% monthly figure.** It is *fitted*, not historical: it's the constant
  rate that takes 1,507.5 to 89,500 over five years. Lebanon's real path was
  jagged with a black-market rate running far ahead of every official one. Honest
  as a shape, dishonest as a history. Do not quote it as a Lebanese number.
- **Day 14.** Zomboid's clock and history's clock are **three orders of magnitude
  apart** — a game needs the collapse legible inside one run, reality took half a
  decade. Whatever Bohemia picks it is picking a *compression ratio*, and it
  should pick it on purpose rather than inherit 14 from another game's preset.
- **Water as a separate need.** It would collide with the mobile-camp law's ONE
  CLUMPED POOL (clause 3), which Paolo already ruled. The page tracks the day the
  taps die and models no thirst, deliberately.

---

## HONEST LIMITS

- **Eight sourced numbers, and they're all from one file.** The Zomboid seven come
  from a single `apocalypse_SandboxVars.lua`; the Valheim one is reused from our
  own record. Everything else is `[DOC]`. A config preset tells you a game's
  defaults, not its code.
- **The devaluation curve is the one derived number on the page** and it is
  flagged as such in the page's own comments, in the teardown, and here.
- **The starting balance and the comfort cost ladder are mine**, and exist only
  so the page can be pressed. They are not proposals.
- **Nine failed source probes are listed by URL** in the teardown, so "no source"
  is checkable rather than asserted.
- **This does not duplicate the 7/28 macro research.**
  `records/BOHEMIA_ECONOMIC_APOCALYPSE_SCOPE_RESEARCH_7_28_26.md` already covers
  the supply side — the 72-hour shelf, letters of credit, trade routes. That one
  is the MACRO half; this is the DAILY-LIFE half. I checked before writing so the
  two don't rot against each other.
- **I have not seen him play it.**

---

## WHAT THIS DOES NOT DECIDE

**Not one number here is Bohemia's.** No price, no currency, no purse. The economy
belongs to the WORLD lane, which is building the player's purse right now — this
page touches no economy code and claims nothing, and the findings are **flagged
for that lane**, not handed to it.

**Two questions, and the second one is the real prize:**

1. Should the collapse be a set of **falling curves you cannot touch**, with
   exactly **one rising curve** that is whatever you built?
2. When a utility dies in Bohemia, does it **disappear** — or does it get an
   **owner you have to deal with**?
