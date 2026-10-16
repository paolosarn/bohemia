# FINDING — THE SIDEWALK HE BOUGHT (7/31/26)

> "We had a sidewalk that i approved as an asset i bought did u just throw all of
> them away because i told u to make some ??"

## THE SHORT ANSWER

**Nothing was thrown away, and nothing new was cooked.** No bank was deleted,
edited, or graveyarded in the sidewalk work. Zero new graphic pixels were drawn.

**But his instinct is right anyway: I did not use his bought sidewalk either.**

## WHAT THE SIDEWALK ACTUALLY WEARS

The run's walk cell renders `walk_kerb` from
`banks/BOHEMIA_STARTER_TILESET_ACT1_7_26_26.txt` — the FROZEN 42-tile set, which
is byte-locked by his own CBB verdict on the target screen (7/26).

Where did those pixels come from? Measured, not assumed: the exact b64 of
`walk_0/1/2`, `walk_kerb`, `concrete_0/1` was searched across every bank in the
repo. **All six appear NOWHERE ELSE.** They are unique to the starter set,
because that set was CUT FROM THE PAINTED MOCKUP (the set's own `law` field: "the
picked mockup is CUT into a real starter tileset"). They are painted art, not
anything from his purchased library.

## WHAT HE OWNS THAT HAS NEVER DRAWN A PIXEL

`banks/BOHEMIA_GROUND_SEAMLESS_SET_7_10_26.txt` — his purchased library, already
seam-processed and tiered:

| pack | tiles |
|---|---|
| 1. Cracked contrete tiles | 44 |
| 1. Cracked street tiles | 33 |
| 3. Stone paths | 21 |
| **total** | **98** |

- **71 of the 98 are seam tier S or A** (31 S, 40 A) on the authoritative `tier`
  field. (First pass I read `tier4`, which does not exist on this bank, and got a
  false "0 usable". Checked the real field before reporting.)
- **50 of them ship real pixels inline at exactly 44x44** — the corpus cell. They
  would blit 1:1 with NO resampling, which is what the 7/26 no-resample law
  requires. They are drop-in legal today.
- The other 21 are `crop` method: rebuilt from the HD master by stored window.

## THE MACHINE GAP, WHICH IS THE REAL DEFECT

`gates/banks_used_gate.js` exists for exactly this — "APPROVED-BUT-UNUSED IS A
DEFECT" (the NEVER DRIFT law, 7/28, written after he caught the same class of
miss). It watches the banks the RUN loads. **It does not watch the ground
library at all.** So 98 bought pavement tiles can sit unused forever and no gate
says a word. That is why this could only be caught by him noticing.

I am NOT wiring the gate to those banks unilaterally: doing so turns main red
immediately across every lane, and the fix depends on a decision only he makes.

## THE DECISION THAT IS HIS, NOT MINE

Two of his own rulings point opposite ways here and only he can break the tie:

- **The frozen starter set is CBB-locked** (7/26 target verdict). The run is
  supposed to be laid from those 42 tiles, byte-identical, and `walk_kerb` is one
  of them.
- **REUSE-FIRST / NEVER DRIFT** says approved-and-bought art must actually be
  used before anything else is.

So: does the sidewalk keep the frozen painted `walk_kerb`, or swap to his bought
cracked-concrete/street tiles? [PENDING Paolo]

The swap itself is cheap — the walk is now a real world cell (code 10), so
changing what it wears is one line in the renderer plus a bank read. What is not
cheap is guessing which of his two laws wins.
