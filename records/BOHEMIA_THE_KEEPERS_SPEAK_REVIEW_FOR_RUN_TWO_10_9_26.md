# THE KEEPERS SPEAK -- a review file for RUN TWO (PEOPLE lane, 10/9/26)

ONE SYSTEM, ONE SESSION (rule 55): `slices/BOHEMIA_SETTLEMENT_SCREEN.html` is
RUN TWO's own file. This lane did not touch it. Everything below is a review,
not a diff -- apply it whenever it's convenient, in your own hand.

## What's already live and needs nothing

- **The trait line mechanism** already fires for every keeper, generically, in
  `openB()` (`traitLine(k)` falls back to `says.any` when no keeper-specific
  key exists). Nothing to add to the mechanism.
- **The rumour mechanism** already exists (`nextRumour()`, fed by
  `records/target/settlement_rumours.json`, which already carries WORLD's
  god-gear rumours as `kind:"gear"`). Today it's only called at the bar.

## The trait reactions and the rumour hooks are now CONTENT, not just mechanism

WORDS' own round ([the keepers' lines],
`records/BOHEMIA_WORDS_THE_KEEPERS_LINES_10_10_26.md`) measured the same row
and wrote the actual 15 trait-reaction lines (3 traits x 5 keepers) and 5
keeper-scoped rumour hooks, explicitly left as a review file for PEOPLE/RUN
TWO to apply. This lane applied them, as plain additive data, into:

- `records/target/settlement_traits.json` -- each trait's `says{}` object now
  carries a `smith`/`armourer`/`barber`/`clinic`/`board` key alongside the
  existing `any`/`hall` keys. `traitLine(k)` already reads `says[k]`, so
  **nothing in the lookup code needs to change** -- these keepers will speak
  their own reaction the moment the live screen asks for it.
- `records/target/settlement_rumours.json` -- 5 new entries, each
  `{"kind":"keeper","keeper":"<k>", ...}`. The bar's `nextRumour()` already
  pulls uniformly from this array; wiring a keeper-scoped pick is a one-line
  filter (`list.filter(r => !r.keeper || r.keeper === k)`) before the same
  `R3`/`fresh`/`S.heardIds` logic the bar already runs.

## What's missing: a spoken price line for five keepers

WORDS measured the price question too and found three of five keepers have
no single flat number to say (every weapon, every wound, every job prices
itself) and left it alone rather than invent one. This lane's own read: a
REAL RANGE or REAL FORMULA is not an invented flat number, so
`engine/bohemia_keeper_lines.js` (new, pure, gated) fills that gap instead of
leaving it empty. It exports `BohemiaKeeperLines.priceLine(kind, ctx)` for
`smith`, `armourer`, `barber`, `clinic`, `board`. Every number in it is read
off this file's own real constants (`OFFERS`'s pay, `clinicPrice()`'s 20-crowns
floor, `engine/bohemia_barber.js`'s `COST.amount`), checked byte-for-byte by
`gates/keeper_lines_gate.js`. Nothing invented.

Suggested wiring, each a one- or two-line addition inside `openB()`:

```js
// smith / armourer, inside shopSheet(), once per visit (track with a flag
// the same shape S.traitSaid already uses, e.g. S.priceSaid[k]):
var ps = items.length && window.BohemiaKeeperLines
  ? window.BohemiaKeeperLines.priceLine(k, {
      min: Math.min.apply(null, items.map(function(i){ return i.price; })),
      max: Math.max.apply(null, items.map(function(i){ return i.price; }))
    })
  : null;

// barber / clinic / board, same shape, no ctx needed:
var ps = window.BohemiaKeeperLines ? window.BohemiaKeeperLines.priceLine('barber', {}) : null;
```

Append `ps` after the trait line (or in place of the static `hello`/greeting
text, your call on the exact phrasing/placement) the first time that keeper
opens on a visit. Then, for the rumour, filter `nextRumour()`'s source list
to that keeper's own hook before picking (`list.filter(r => !r.keeper || r.keeper === k)`),
the same `R3`/`S.heardIds` logic the bar already runs, once per visit, for
these same five keepers.

## The ship test this row names

"In VOTE: the smith's three lines spoken." The cook
`slices/BOHEMIA_THE_KEEPERS_SPEAK_10_9_26.html` demonstrates it standalone
(trait line + `priceLine('smith', ...)` + a real rumour, in the same
mouth-and-portrait look your file already uses). Wiring it into the live
settlement screen is yours whenever you next touch that file.
