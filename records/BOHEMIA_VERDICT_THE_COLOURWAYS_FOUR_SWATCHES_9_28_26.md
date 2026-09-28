# THE COLOURWAYS — FOUR SWATCHES, NOT TWELVE GARMENTS (DIRECTION, 9/28/26)
# At the seam: CHARACTER [runway redo] 4f1611e (his approved thirteen wired,
# 17 colourways so no faction lost its colour). The style gate went to 13
# red when the bank caught up. Judged, and the card was wrong first.

## 1. THE CARD MOVED FIRST (card section 5C)
His 9/22 note on the runway: "vibrance turned down a little." The 0.55
accent floor made any accent turned down a little read as mud. Floor now
0.50 (accents median 0.58; a tenth down is 0.52). LEATHER #5c422c (sat
0.52, four garments) PASSES. The ratchet re-froze honestly at 91 under
the new band, without this round's bounced pieces.

## 2. WHAT STILL BREAKS IS FOUR SWATCHES (each shared across garments)
| swatch | garments | breaks | legal fix (same hue) |
| GOLD #ffd75c   | SHOULDER MANTLE, DROP TROUSER, STACK BOOT | val 1.00, a pure end - the opposite of "not so bright" | #d1b254 (sat .60 val .82) |
| OLIVE #4a5036  | ASYM COAT, WIDE TROUSER, STACK BOOT | sat 0.33, the muddy middle | #4b4f3e (sat .22, the register) |
| SAND #806e50   | COCOON COAT | sat 0.38, the muddy middle | #807563 (sat .22) |
| BONE #a29a86   | COCOON COAT (outer) | outer val 0.64 against runway black 0.15-0.38 | #575348 as the outer, or keep bone on a BASE layer |
Four hex edits clear eight garments and the ratchet. The silhouettes
are his (voted up 9/23) and untouched; this is colour only. Suggested
values are legal by construction; CHARACTER picks, the gate decides.

```json
{"card":"COLOURWAYS_FOUR_SWATCHES","date":"9/28/26","seam":"CHARACTER 4f1611e",
 "card_amended":"accent_sat_min 0.55 -> 0.50 (5C, his 9/22 note)",
 "passes_now":["LEATHER #5c422c x4"],
 "bounce":{"GOLD #ffd75c":{"n":3,"fix":"#d1b254"},"OLIVE #4a5036":{"n":3,"fix":"#4b4f3e"},"SAND #806e50":{"n":1,"fix":"#807563"},"BONE #a29a86 outer":{"n":1,"fix":"#575348 or base layer"}},
 "ratchet":{"muddy_frozen":91,"now":95,"clears_when":"OLIVE x3 + SAND re-snap"}}
```
