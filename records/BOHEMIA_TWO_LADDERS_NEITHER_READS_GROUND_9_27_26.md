# TWO LADDERS, NEITHER READS GROUND
FACTIONS lane · round 45, [bb houses] school continued · 9/27/26

## THE ONE LINE
**This valley already tracks two separate rankings of crew trust, and neither one has ever
heard of the ground you hold.**

Nothing went to the demo or the alpha's play tabs. Rule 18(b) holds.

## WHY THIS ROUND
`[bb houses]` round one measured that standing per crew *exists* and is shown on a real
card. This round asked the next honest question: **does anything a player does with
territory ever move it?** Battle Brothers' whole houses idea is standing and land tied
together — you are trusted by a house partly because you hold or defend its ground. Checked
whether ours already does that, rather than assuming.

## TWO SYSTEMS, NOT ONE, AND I HAD THE WRONG ONE AT FIRST
The first screenshot I pulled this round opened a richer card than expected. Rather than
guess what its fields meant — the exact mistake that cost three rounds this session already
— I read the source before writing anything about it.

**Ladder one — the favour count.** `BohemiaBelonging.gaveOf(save, faction)`. Its own comment
names both writers: *"the world bridge, when an authored quest resolves in a faction's
favour, and the run, when you do the peripheral act on somebody's card."* Confirmed by
reading `record()` and every caller: **exactly two writers, both quest-driven** (plus a
decay for neglect, which only ever subtracts).

**Ladder two — the rung.** `rungRead()`, shown on the "WHERE YOU STAND" card as YOUR RUNG
(TERRITORY → MANDATE → MAYOR, a build-permission ladder) and THE VALLEY (how many of 16
crews are with you). It reads `DQ.shared.faction`, and that object has exactly one writer in
the whole codebase: **a quest script's own `@DO faction NAME +n` line.** Grepped for every
other write path — none exists.

## THE MEASURED ANSWER
| does this move either ladder | measured |
|---|---|
| holding a crew's fortress, town or camp | **no** |
| losing that ground | **no** |
| paying their rent on time | **no** |
| refusing their rent, taking the cut lights | **no** |
| the territory ledger recording a block changing hands | **no** — nothing reads it |

Both ladders are real, both are on-screen, and **both are wired to exactly one input: a
quest resolving.**

## WHY THIS IS MORE THAN A CURIOSITY TODAY
Rule 35 landed this round: **QUESTS is research only, ships no game code, ever, from now.**
That is the right call and not this lane's to second-guess. But it means both standing
ladders just lost their only future source of new inputs. Nothing about that call breaks
either ladder — they work exactly as before — but it does mean **the door they walked
through is now closed**, and the door that could replace it (something a player does in the
world) sits right next to it, unopened.

This lane's own ledger (`[territory ledger]`, shipped 9/24) already knows every block that
changes hands, keyed per act, with who held it before and who holds it now. It has never
been asked a single question by either ladder.

## THE COOK
`slices/vote/FACTIONS_TWO_LADDERS_NEITHER_READS_GROUND_9_27.html`, registered
`factions-two-ladders-neither-reads-ground-9-27`. A real screenshot of the actual "WHERE YOU
STAND" card (rule 32f), a small diagram of the three wires (one connected, two crossed out),
and the measured table.

## WHAT THIS ROUND DID NOT DO
Did not touch either ladder's code, did not propose a formula for how territory should move
standing (that trade — how much a block is worth in trust — is a ruling, not a measurement,
and MECHANISM-MINE / CONTENTS-PAOLO'S keeps it his). Did not touch the walked-surface file,
which stays off-limits while WORLD, LIFE+CITY, RUN and COMBAT rebuild it under rule 34.

## RULE 18 AND RULE 22, OBSERVED
No demo cut, no build stamp, no game file touched.

## [PENDING Paolo] — NOTHING NEW

## THE THING TO CARRY FORWARD
**A guessed label is still a guess even when the screenshot is real.** The first frame this
round opened a card with fields I had not read the source of, and it would have been easy to
narrate "YOUR RUNG: TERRITORY" as if it obviously meant something it did not. Reading
`rungRead()` before writing a word about it is what separated a wrong write-up from a right
one, and it took two minutes.
