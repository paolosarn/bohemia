# V206 — WHAT YOU TOOK LEAVES THE FIGHT WITH YOU (COMBAT lane)

VAMILY job: **[loot kept]** = `BB-LOOT-LEAVES`, with `BB-KEYS-LAND`. One pipe,
claimed together because both rows describe the same message from opposite ends.

> **PAOLO 8/25**, asked what a fight is worth: *"YOU GET EXPERIENCE AND LOOT OFF
> THEIR BODIES."*

Tab: **COMBAT** for the picking up, and it is what **CITY** reads to know what you
hold.

---

## HIS RULING SHIPPED INSIDE THE ARENA AND NEVER LEFT IT

Loot is real and has been since 9/2. On every death a body drops rounds,
experience worth a quarter of what it took to put him down, an item at 55%, a
plate at 22%, and a boss key if he was a boss — all lying where he fell, so you
have to cross ground under fire to get it. The code even caught its own first
mistake in its own words: *"nobody walks into a firing line for half a pack of
smokes."*

**AND THE FIGHT'S ONE MESSAGE OUT CARRIED NONE OF IT.**

```
  before:  victory result reason kills dead spared fled alive fates
           playerHP turns encounterId questId stepId
  after:   ... and took:{ loot, xp, plates, keys, rounds }
```

**THE NUMBERS WERE ALREADY THERE.** `cleanSlate` builds `G.rc` fresh at the top of
every fight and the pickup has been pushing `G.rc.xp` and `G.rc.loot` into it the
whole time. So this is a **read, not a new mechanic**, and it cannot disagree with
what the readout told him when he walked onto the body. Two things genuinely had
no per-fight counter at all and now do: **a plate** (there was a local for the
readout line that died with the function) and **a key**.

## AND THE KEYS ROW STOPPED BEING TIDYING WHILE NOBODY WAS LOOKING

`BB-KEYS-LAND` was written 8/28, when nothing outside the fight read the keys.
**Somebody built the reader on 9/6** — `ctLadderHeld()` in the walked city, whose
own comment says *"MEASURED 9/6: nothing outside the fight had ever read it."*

So the row became a live bug, and the break is in the middle:

| | |
|---|---|
| the fight sets `window.bohemiaKeys` | on the **combat frame's own** window |
| the fight posts `{bohemiaKeys:[...]}` | **untyped** — and the shell routes all twenty of its message types by `d.type`, so nothing catches it |
| the city reads `window.parent.bohemiaKeys` | the **shell's** global, which nothing ever set |

**THE BOSS LADDER IN THE CITY HAS BEEN ANSWERING "EMPTY HAND" NO MATTER HOW MANY
KEYS YOU ARE CARRYING.** The fix is one word: the message gets a `type`, the shell
keeps what arrives, and the old untyped field rides along so a reader written
against the old shape keeps working.

## WHAT SHIPPED

| | |
|---|---|
| the takings | `took:{loot, xp, plates, keys, rounds}` on the one message out |
| the pocket | what you took is kept, in the fight's own storage |
| the type | the keys message can be routed now, like the other twenty |
| the keeper | the shell holds both, which is the hole the city fell through |
| tools/bohemia_loot_kept_patch.py | replayable, MARK `__LOOT_KEPT__` |
| gates/loot_kept_gate.js | **9 pass / 0 fail**, suite-registered as **LOOT KEPT** |

**THE POCKET IS THE FIGHT'S OWN STORAGE, NOT THE RUN'S SAVE.** `bohemia.tree` and
`bohemia.keys` are already written from inside the fight and this is the third of
exactly the same kind. `bohemia.save.v1` is **RUN's file and is not touched** —
ONE SYSTEM, ONE SESSION.

**AND IT IS A CONTAINER AND A WIRE, DELIBERATELY NOT A GAME YET.** What a looted
item *does* is `BB-LOOT-IS-ACCESS` — *"loot opens doors, it does not add
numbers"* — which is a separate row and his call. This keeps and publishes; it
spends nothing.

## THE GATE SERVES THE GAME OVER HTTP, AND THAT IS THE FINDING IN THE HARNESS

The last link in this chain is one frame reading another frame's global. **On a
`file://` page every frame has a null origin and they are cross-origin to each
other, so that read throws however correct the build is.** The first run of this
gate said *the city sees nothing* on a build where the city sees everything.

The deployed game is **one origin over https**, where the read is legal. So the
harness now matches the site: a static server on localhost, which is the
same-origin condition production runs in.

**A `file://` harness would have reported this row as impossible to finish.**

```
  the pickup        3 rounds off the ground, +12 XP, 1 plate, 1 item, key "pot"
  the message out   took:{loot:1 item, xp:12, plates:1, keys:["pot"], rounds:3}
  the pocket        kept: 1 item, 12 xp, 1 plate, 1 key, 1 fight
  the shell holds   keys ["pot"], pocket 1 item
  the city holds    ctLadderHeld() -> ["pot"]      (it answered [] before this row)
```

**MUTATION-PROVED:** take the `type` off the keys message and strip `took` from
the payload → **4 arms red**, naming the message, the pocket, the shell and the
city. The pickup itself stays green, which is the point: the thing that was
already working is not what this row changed.

## AND ONE OF THIS LANE'S OWN CHECKERS WAS PINNED TO A SPELLING

`combat_lab_gate` went from 929/3 to **928/4** on this patch, and the new red was
its V66 arm — *"the demo delegates the whole bus to HANDOFF CORE, win AND loss
both route through the one send."* Every word of that claim is still true. The arm
demanded the **whole line verbatim**, and this row captures the return value of
that call, because crediting the pocket from the very payload that just went out is
the only way the message and the pocket cannot disagree.

The pin now holds the **delegation** and the function, which is what the arm is
about, and the win/loss routing checks are untouched. 929/3 again, the same three
pre-existing reds this lane already proved are not its own. *A checker that fails a
change preserving everything it claims is pinned to the wrong thing.*

## `NO DAMAGE BEFORE THE DIAL`

Nothing here authors a damage number, a hit, a roll or a price. It carries numbers
that already existed across a boundary they already failed to cross.

## WHAT IS LEFT ON THIS ROW

`BB-THE-FIGHT-KNOWS-THE-DAY`, the **inbound** half of the same pipe, is not built
yet. Measured and confirmed this round: `enter(G,d,env)` receives the player's HP,
a roster, a package id and a stamina max — **no hour, no temperature, no weather,
no shade** — while the walked city organises its whole day around the heat and
every person in it carries a `heatTol`. The desert is the setting of the game and
the fight takes place in a climate-controlled room. The row stays **CLAIMED**.
