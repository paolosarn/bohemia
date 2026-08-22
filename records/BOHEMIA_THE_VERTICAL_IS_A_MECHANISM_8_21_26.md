# THE VERTICAL IS A MECHANISM, NOT A LAMP

8/21/26 — WORLD lane. Tab: **RUN** (the street you spawn on) and **CITY** (everywhere else).

---

## WHERE THIS STARTED

This morning's fix stood one object up: the streetlight, 0 draws → 46, `c.lamp` → `LAMP_IMG`.
It left a measured list behind — 18 declarations / 1,773 tiles of props that are *standing
objects* in their legend and draw as one flat coloured square — and the obvious next move
looked like "give those props art."

**It wasn't.** The census said why:

```
prop families the WHOLE valley authors, one plot of each district:
  bin 3 districts · sign 2 · pallet 2 · mailbox 1 · barricade 1 · pole 1 · bench 1 · cart 1
```

Eight families. The lamp was a **wiring** problem — forty-two districts had already authored
the tile and nothing drew it. This is the opposite: there is almost nothing to draw. A dead
American suburb with no bin at the kerb, no bag in the gutter, no tyre in the wash is not
under-rendered. It is **unfurnished**.

## WHAT SHIPPED

### 1. The flag became a family

`c.lamp` was a lamp-shaped path from flag to sprite. The next prop would have meant `c.bin`
→ `BIN_IMG`, then `c.cone` → `CONE_IMG`, and a fourth copy of the same eight lines every
time. FACTORY LAW: a thing you will need many of gets a mechanism.

Now `c.post = {p:'bin', v:2}`, one collector, one draw, and **one legend-name → family
table**. The lamp is mapped onto it so every lamp shipped this morning draws byte-for-byte
the same.

```
46 draws  ->  603 draws    across 36 districts
```

Everything the valley had **already authored** stood up for free, without a line of content
being written:

```
mall        2 dumpsters          warehouse   2 dumpsters + 9 pallets
campus     12 benches            commercial 12 pallets
arsenal   113 barricades         apartment   2 mailbox kiosks + 6 dumpsters
```

### 2. The bank is shopped, not cooked

REUSE-FIRST, in its strongest form: **not one pixel was drawn.**
`banks/BOHEMIA_STANDING_SET_7_10_26.txt` is 575 corpus objects already typed as STANDING
(block + occlude) since 7/10, and its street packs are exactly what a dead kerb needs. The
pixels resolve out of the HD tile repo. Twenty objects across eleven families:
**bin ×4 · bag ×2 · barrel ×2 · barricade ×3 · bollard ×2 · cone ×2 · bench · dumpster ·
mailbox · pallet · tyre.**

**And the kill pipeline is the law, in code, not my eye.** Six candidates were killed by
measuring their pixels:

```
bin      #12  PURPLE RESERVATION 2.6%   (a purple recycling logo)
cabinet  #29  PURPLE RESERVATION 7.4%
bench    #17  PURPLE RESERVATION 0.4%
signpost #10  ACT ONE ONLY, neon 8.2%
mailbox  #15  ACT ONE ONLY, neon 2.4%
cabinet  #28  ACT ONE ONLY, neon 3.1%
```

### 3. The suburb got its bins

The district he spawns in is the one district **not on the kit path** (`m.sub`, hand-written),
so it carries its own code and its own case — the same split the streetlight hit. Code 14 is
a wheeled collection cart.

**Where a bin stands is when this street stopped.** Vegas residential collection is wheeled
carts: they live beside the garage and get rolled to the kerb the night before. So the ones
at the kerb were put out for a collection that never came. That is the valley's whole premise
said in one prop, and it costs nothing to say it that way instead of scattering them at random.

Never in the walk and never on the apron: a bin is solid, Paolo's walk is one grid wide
(7/31, LOCKED), and a solid cell in a one-wide walk does not narrow it — it **severs** it.

## THREE THINGS I GOT WRONG, AND HOW EACH WAS CAUGHT

**1. I nearly published an alarm about the lamps.** Seen on a 2× contact sheet, the approved
"dark" lamps read as glowing amber lanterns — which in a 12%-lit dead world would have been a
serious problem I had shipped hours earlier. Measured against the lit originals before saying
anything: **100% of the very-bright pixels are killed in all seven.** The amber is brass frame
and dead glass. The alarm was wrong and the sheet was the liar.

**2. My own kill filter killed a green dumpster.** It carried a third law, "no vegetation",
implemented as *how many green pixels* — and a green dumpster is 14.3% green painted steel.
No tuning fixes that: **a colour histogram cannot tell a leaf from paint.** That is the 8/1
lesson in a new costume (a checker that cannot tell a mention from a use is the broken one;
fix the ruler, never the target). The pipeline is now honestly split — purple and emissive are
*colour* facts and get colour tests forever; "is this a plant" is a *semantic* question and is
answered by not listing planters as candidates, with the reason recorded.

**3. I almost wrote a fabricated measurement into the code.** A 22-house block stood 28 bins,
I assumed the hash, "fixed" it with `Math.imul` and started writing *"MEASURED: a gate written
to pass 38% passed about 82%"* — a number I never took. Measured properly: the coin was clean
(95, 11, 95, 77, 16, 30, 35, 7, 49…) and the cause was **my own inverted condition** —
`>=62 continue` passes sixty-two percent, not thirty-eight. The `imul` change is still correct
(a real latent precision bug) but it was not the cause, and the comment now says so.

## THE GATE

`gates/props_gate.js`, 32 checks, suite entry **PROPS**. Proved red by drifting the lamp
footprint. It re-measures the bank with **its own PNG reader** — a gate that imports the tool
it checks is asking the accused to testify — binds the script tag to the sibling art file
(the 8/6 repo-budget precedent: two lists that must not drift), pins the lamp's footprint so
the now-shared draw cannot regress something Paolo already has, and refuses any suburb bin in
the walk or on an apron.

**And the LAMP gate went red, correctly, and was re-aimed rather than weakened.** Folding the
lamp onto the shared draw invalidated two of its regexes. They now assert the lamp's *branch*
of the shared draw — that the lamp family still resolves to the approved `LAMP_IMG` pool, and
that the glow is asked **only** of the lamp and **only** of a live POWER circuit. Re-proved
red by deleting the `_fam==='lamp'` guard.

## HOUSEKEEPING

**This container came up on a foreign branch.** `claude/world-9lfjtf` had been rewritten by
another session using the same reused branch name, and its working tree was *older than main*
— 41 modified files that looked like mid-flight work and were actually reversions. Verified
before touching anything: my streetlight ship is an ancestor of `origin/main`, the other
session's commits are all on `origin/main`, and the tree was missing content main has. Reset
to main, nothing lost. Same trap the CHARACTER lane hit on 8/21: **if a container looks like
it has uncommitted work, diff it against origin/main before believing it.**
