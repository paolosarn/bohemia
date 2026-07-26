# BOHEMIA — PURITY GATE v2: THE LIBRARY SWEEP (7/16/26)

## The problem
`bohemia_purity_gate.py` v1 took ONE repo path and understood ONE file format.
The library is **33 banks in half a dozen shapes**. A law enforced on one file
out of 33 is not enforced. Nobody had run it on the seamless sets at all.

v2 walks every bank, finds every embedded PNG wherever it sits in the JSON
(`tiles[]`, `packs{}`, `houses[]`, `frames[]`, `stamp`), and checks it.
**5,930 images, one command.**

## THE FINDING: 101 purple pixels are sitting in the world's ground

| bank | purple tiles |
|---|---|
| GROUND_SEAMLESS_SET | **68** |
| PATH_SEAMLESS_SET | 7 |
| ROOF_SEAMLESS_SET | 7 |
| WATER_SEAMLESS_SET | 7 |
| BRIDGE_SET | 6 |
| WALL_SEAMLESS_SET | 6 |

I verified the flags instead of trusting them. The actual mean pixel colors:

```
(185, 49,136)  "Floor tiles (2)"          <- magenta
(157, 61,207)  "Furtniure and fixtures"   <- violet
(135, 52,112)  "Signs and holograms"      <- purple
(123, 83,164)  "1. Tower floor tiles"     <- purple
```

That is real purple, in the ground bank the render contract feeds. The 7/10 law
purged the **demo pools**. The **library banks were never purged.** The leak the
law was written about ("rune-style purple tiles had leaked in via the hazard
pool") is still in the library, one `TP_TILES` load away from the screen.

Purple is a story tell. The player learns wordlessly that purple = the
Amalgamation's threshold. **Scarcity is what gives it power**, so 68 purple
ground tiles do not dilute the law slightly, they delete it.

Whether these die or get quarantined is your call. I did not touch them.

## The lava detector was condemning Vegas
Same verification on the lava flags:

```
(232,180,121)  "2. Soil and dirt tiles"   <- desert sand
(186,126,73)   "2. Soil and dirt tiles"   <- soil
(194,117,68)   "Floor, walls"             <- warm rust
```

That is not lava. That is Vegas. v1's classifier condemns the exact desert
palette the TAN WALL LAW says 85% of the game is made of — which is why the
7/10 sweep produced 1,387 **suspects** and not 1,387 kills.

So the gate is now **two-tier**, and I did not quietly retune your threshold:
- **v1 classifier → `warm-suspect`.** Yours, unchanged, your eye finalizes.
- **strict emissive → `VIOLATION`.** Grounded in what molten rock actually does:
  it EMITS. Red near saturation, green far below red, blue nearly gone
  (`r>200, g<0.55r, b<0.35r`). Sand reflects; its green sits high, so it passes.
  **[The strict thresholds are mine, flagged for you.]**

Result: **156 violations, 637 warm-suspects** instead of one undifferentiated
scream of 1,450. A gate that cries wolf 1,450 times is a gate nobody reads.

## Scoping — your own LEARNED RULE #6
> "Purity applies to STRUCTURAL surfaces (walls/floors/roofs/doors); emissive
> PROPS (torches, fire barrels) are legal. Gate scoped accordingly."

NO VOLCANO is a law about **surfaces**, not about everything with a hot pixel.
Running the lava detector over the fire bank does not find a law violation, it
finds fire. Lava now checks structural banks only. **Purple checks everywhere**,
because purple is a story tell, not a material property.

## Allowlist — `bohemia_purity_allow.txt`
Only what the law itself blesses: `hatch`, `network_hatch`, `agent_iris`,
`neurolink`. Every line is a law citation, not a convenience. **REDMAG (325) is
deliberately NOT allowlisted** — it is a quarantine list, so if a REDMAG tile
turns up inside a world bank the law was broken by the placement and the gate
should say so.

## Files
- `bohemia_purity_gate.py` — sweep, `--file`, `--strict` (exit 1), `--csv`
- `bohemia_purity_allow.txt`
- `BOHEMIA_PURITY_VIOLATIONS_7_16_26.csv` — all 793 rows, every tile addressable
  as `bank.tiles[idx]` so a verdict pass can point straight at them

## Your call
The 101 purple tiles: kill, or quarantine into REDMAG?
