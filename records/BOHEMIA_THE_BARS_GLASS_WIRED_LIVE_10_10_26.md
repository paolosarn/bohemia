# THE BAR'S GLASS, WIRED LIVE (SOUNDS, 10/10)

Row [the soundscape], round four. His eighth votes: `sounds-the-bars-glass-10-10`
APPROVED, same batch `sounds-a-block-is-two-things-touching-10-10` was killed
(post-mortem: `records/BOHEMIA_A_BLOCK_IS_TWO_THINGS_TOUCHING_POST_MORTEM_10_10_26.md`).
This closes the gap the keep/redo list has carried since round three (10/10):
"the bar's own glass is approved and the bar still plays nothing when you buy a
round."

## What it is

The settlement screen's bar flow (`slices/BOHEMIA_SETTLEMENT_SCREEN.html`,
`k==='bar'`, "Buy the crew a round") already debits batteries, posts morale,
relation and a rumour, and never once called `sfx()`. Same precedent as the
stall's pickup, the clinic's door, the roster's equip and the valley's own
broadcast: an already-judged candidate with no live caller, zero new content,
no new vote.

## Simpler than ROOM/BROADCAST, and that is a real finding, not a shortcut

`barGlassDown` (`engine/bohemia_horror_sounds.js`) is pure buffer math:
`objectSetDown` (a boards contact, the slab's own plate modes, grit) summed
with `struckMetal`'s single-partial `'glass'` mode. Neither calls a Web Audio
filter node anywhere -- checked directly, `grep -n "createBiquadFilter"` on the
whole module returns nothing. ROOM and BROADCAST needed a live filter chain
duplicated because their module recipes build one; this one does not, so the
live copy duplicates the SAME MATH instead of a filter chain. There is no chain
length to keep in sync, which is the one part of ROOM's own 9/24 lesson that
genuinely does not apply here -- but the other part does: **a comment
promising two copies match is not a check**, so the gate reads this object's
own source text against the module's constants, same technique, same
discipline.

## Built

The alpha's new `BARGLASS` object (`slices/BOHEMIA_ALPHA_0_9.html`, right after
`BROADCAST`):

- `renderWood(AC)`: the boards contact (GROUND.boards' own E/rho/v/loss/h/a,
  duplicated), the slab's plate modes (the same formula, computed fresh, never
  a hardcoded result), and grit (the same fixed integer sequence, 5 grains).
- `renderGlass(AC)`: struckMetal's single-partial glass mode, f0 650 Hz, damp
  0.05%, the lowest loss already in the table.
- `render(AC)`: sums them 0.65/0.6, normalises to 0.85 -- the module's own
  mix, read off `barGlassDown`'s own two lines.
- `play(bus, AC)`: one shot, a plain `AudioBufferSourceNode`, no filter --
  the honest live copy of a recipe that has none either.

## Checked by a machine, the same way ROOM and BROADCAST already are

`H.BARGLASS_CONST` carries the wood and glass constants read straight off
`GROUND.boards` and `STRIKE.glass`, never retyped. `gates/cooked_sounds_gate.js`
reads the alpha's own `BARGLASS` object by its source text, scoped to its own
block so a pattern cannot match the wrong thing, and asserts every constant
matches. 240/0 (was 238/0).

## Wired through the one existing dispatcher, not a second entry point

`sfx('bar_glass', view.night ? NIGHT_TRIM : null)` posts across the iframe
boundary the same way every other settlement sound does. `window.playSFX`
(the single entry point the postMessage bridge and every UI tap already call
into) special-cases `'bar_glass'` before it ever reaches the sample-bank
lookup -- the same shape `AMB.tick()` already uses for `'valley_broadcast'`,
because this is a synthesized live object, not an APPROVED sample-bank entry,
and the game has exactly one way to ask for a sound, never two.

## Proved on the real page, not assumed from the source

`gates/settlement_screen_gate.js`: buying four rounds at the bar posts
`{ev:'bar_glass', mul:null}` four times, nothing else -- 60/0 (was 59/0), run
twice clean (the suite flaked once on an unrelated posts-count timing race,
confirmed by reverting this round's changes and re-running: the same flake
happened with nothing of this round's touching it).

A standalone Playwright check (and `gates/one_engine_gate.js`'s new E11 claim)
calls `window.playSFX('bar_glass')` directly on the real page and confirms it
reaches `window.__BARGLASS.play`, renders a real buffer, and throws nothing --
`{"before":0,"after":1,"threw":null,"hasBuf":true}`, zero page errors. E11
could not be run inside its own gate file (confirmed again this round, 40 s
timeout): this gate's own boot is still the pre-existing, unrelated break
every round of this row has named (PLUMBER territory).

## What this did not do

    sounds-something-here-still-works   NAMED, NOT WIRED, and the reason is
    -10-10 (legendaryFind), the other    honest rather than a shortcut: the
    eighth-votes approval                moment is "finding something
                                         genuinely RARE in a dead valley", and
                                         the live game has no rare tier to
                                         hang it on. BohemiaScavenge.search()
                                         (engine/bohemia_scavenge.js) returns
                                         a plain found:true/null with no
                                         rarity anywhere in it -- "WHICH thing
                                         is content, and content is his" is
                                         the function's own comment. WORLD's
                                         [where the god gear is] row names six
                                         legendary locations but none is wired
                                         into a live UI event yet either.
                                         Playing this ambitious sound on every
                                         ordinary scavenge hit would
                                         misrepresent it as common when the
                                         whole point of the construction is
                                         that it is not. Waits on a rare tier
                                         existing somewhere live, WORLD's or
                                         TUNING's call, not mine to invent
                                         under the wire.
    the graveyarded block                UNTOUCHED, GRAVEYARD IS FINAL. Its
                                         post-mortem is its own record.
