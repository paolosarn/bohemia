# MFS CHARGE BATTERIES (9/22/26, WORLD lane)

Board row **[people charge] / MFS-CHARGE-BATTERIES**, plus rule 22 and rule 29.
**Nothing shipped to a play surface** — rule 18 holds; the cook went to the VOTE
tab, and this round it is a **drawn thing**, not a page.

---

## 1. HE VOTED AND ALL SIX OF THIS LANE'S ITEMS WENT DOWN

```
THE FIRST NOTICE            down   "So boring"
WHO SENDS THE NOTICE        down   "Boring asfff"
YOU PAID IT                 down
THE BLOCK HOLDS THE DOOR    down
THE RULES RUN WITH THE DIRT down   "Mfs charge batteries bro 🤣🤣🤣..."
THE DAY THE MONEY DIES      down
```

Six for six. The post-mortem is
`records/POSTMORTEM_WORLD_SIX_TEXT_ITEMS_9_22_26.txt` and the short version is:
rule 22 said WORLD makes "a thing on the phone", I read that as **a document**,
and shipped five rounds of them. **STOP PRODUCING says writing a fourth version
of anything means you already failed. I wrote six.**

Rule 29 came back the same round and says it plainly: *make the pixels, make the
sound; the thing is the item.*

## 2. AND ONE OF HIS COMMENTS WAS A RULING, NOT A VERDICT

> "Mfs charge batteries bro. i know buildings can help in our game but jesus
> christ mfs can charge batteries"

He is right, and it is the sharpest thing said to this lane in a week.

**Measured in the walked city before touching anything:**

```
cellsNightlyCharge() is the ONLY maker of batteries in this game.
It walks the lit circuits, finds the FACTION holding that ground, and
credits THAT FACTION one cell. Reason string: 'a day on a live wire'.

A person never makes one. The player never makes one.
```

The entire money supply of Las Vegas is minted by fourteen outfits holding wire,
and every human being in the valley is locked out of the one act that creates
money. **That is not an economy, it is a faucet with a guest list.**

## 3. THE PHYSICS IS MINE AND NOT TUNABLE; THE RIGS ARE HIS

`engine/bohemia_charge.js`. Every number is a real measurement or arithmetic on
one, so none of it is a dial he has to set:

```
a cell holds           3.75 Wh   a AA at 1.2 V, 2500 mAh -- the number this lane
                                 already measured for [battery worth]
charger efficiency     0.70      a cheap trickle charger, wall to cell
Mojave peak sun        5 h/day   Las Vegas is among the sunniest places in the US
```

Three sources, and **all three already exist in this game**: a lit circuit you can
reach, a power building you placed (`[own power]`, 9/12), or a panel. A source
that is not one of those is refused, because *"I charged it somehow"* is how a
faucet gets into an economy by accident.

**The rig table ships empty.** Who owns a charger is content, his ruling was "mfs
can charge batteries" and not "a rig makes four a day", so asking whose rig it is
answers `NO_RULING` rather than handing somebody a charger the game never gave
them.

## 4. *** A NUMBER I AM FLAGGING RATHER THAN BURYING ***

Run that arithmetic on an ordinary 10 W folding panel:

```
10 W x 5 h x 0.70 = 35 Wh a day = 9.33 CELLS
a day's work pays ONE
```

**Nine a day from a panel would end EVERYTHING COSTS ONE inside a week.**

So I looked at what the real limit actually is, and **the sun was never it.** The
limit on charging AA cells has always been **the charger**: a bay holds one cell,
a cheap four-bay charger does four at a time, and a slow charge takes most of a
day. The sun only decides whether the bays run at all.

**So a rig's output is its BAYS**, and the gate proves the cap bites: pour forty
times the power into four bays and you still get four. When the power genuinely
is short the module says `limitedBy: POWER` instead, so the honest case is still
reachable.

That is both the true physics and the answer that keeps his pillar, and it is a
manager's call under correct-after rather than a question in his queue.

## 5. A BUILDING HELPS. IT DOES NOT OWN THE ACT.

His sentence, written as a test:

```
a person, a 4-bay rig, the sun, NO BUILDING ANYWHERE ....  4 cells a day
the same rig with a charging shed .....................   16 cells a day
take the building away again ..........................    still charges
```

A building adds **bays**, because bays are the ceiling — a charging shed is a room
full of bays, which is what a building is *for* here. Take every building in the
valley away and a person with a rig and a source still charges.

And the module names no faction anywhere, because the act is a person's. The gate
checks that too.

## 6. THE COOK, AND IT IS DRAWN

**THE RIG ON THE ROOF.** `slices/vote/WORLD_THE_RIG_ON_THE_ROOF.png`.

A scavenged charging rig on a flat roof: a salvaged PV panel propped on angle
iron, a cable drooping to a charge controller on a block, a car battery as the
buffer, and a four-bay charger with cells in it.

Compared to the world before calling it done (PROP-01 silhouette first, PROP-02
real object typology, PROP-03 the 45 degree law, AH-01 the analog horror bible):

- **Silhouette first.** The panel is the biggest built shape, 578 px against 428
  for everything else, and the tool refuses to write the bank if that flips.
- **Real shapes.** A PV module is a dark cell field in a light aluminium frame
  with the busbar grid showing; a car battery is a squat box with two posts; a
  four-bay charger is a shallow slab with four slots. Drawn as those.
- **One thing wrong in an ordinary frame.** The rig is competent, tidy, cared
  for. **The four cells in the bays are the only lit pixels on the tile**, 1.17%
  of it, and the tool refuses if that goes over 3%.

**The first cut was worse and it is worth saying how.** The space under the panel
was just roof showing through and it read as a **hole**, something a player would
try to walk into. It is a cast shadow now, falling down and to the right, which is
the cheapest true statement about where the sun is and the thing that makes the
tilt read. Every lit face on the tile agrees with it.

## 7. AND THE CORRECTION I OWED FROM LAST ROUND

`[full shelves]` shipped THE DAY THE MONEY DIES on the premise that the valley
stays dead once spent, *because only a building can put a battery back.* **His
ruling makes that false**, and leaving it would have been a module quietly
contradicting him.

Corrected in that file's own head this round. **The beat survives and gets
better:** the money does not die when the cells run out, it dies when **the
charge** does — no sun on the panels, no lit wire anybody can reach, no rig left
working. That is a thing a player can watch coming and act on, which a fixed
supply quietly draining never was. No code changed, because `state()` always read
the supply and never claimed to know why it was low; the wrong claim was in the
comment.

## 8. THE GATES

```
PEOPLE CHARGE   30 / 0   new, red two ways
FULL SHELVES    34 / 0   after the correction
```

Red proved: let the sun be the ceiling, which would break EVERYTHING COSTS ONE
(3 red); make a building required, which is the thing he said it is not (3 red).

**Two reds on this tree and neither is mine**, measured with this round's work
stashed: the reference check gate names `bohemia_cook_the_portrait_wears_the_shades.js`
and a baseline count, both PORTRAIT's. My own tool is counted among the ones
carrying a reference check (24 → 25).

## 9. WHERE HE FINDS IT

**Tab: VOTE, in the alpha.** One row, and it is a picture: **THE RIG ON THE ROOF**.

## 10. ROUTED

**TO WHOEVER LIFTS THE HOLD:** `bohemia_charge` has no caller on a play surface.
The thing that should ask it is `cellsNightlyCharge()` on the walked city, which
today asks only who holds the wire.
