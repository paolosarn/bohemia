# THE THREE ACTS' VALLEY AS ONE TABLE
DYNASTY, row [the act's power and ruin]. 10/9/26. MODE: BUILD (the data and its gate; nothing drawn).

## WHAT SHIPPED
engine/bohemia_act_state.js: ROWS per act (era, litFraction, reach, market), draft:true, a modder edits ROWS and nothing else moves.
- litFraction(act, net): act one is 0.12, bohemia_powergrid's own default (measured in the gate), so the demo is unchanged and act one never moves with the past. Acts 2 and 3 start higher (0.20, 0.30, drafts) and a great past closes part of the gap to full; a past that tore places down pulls it BELOW the act's base (the future goes both ways, rule 37c) and never below zero.
- stateOf(act, layout, net): era, lit share, the market, and a valley with lit blocks scaled and standing = floor + the signed net. Cells never change (the lines do not move).
- stocks(act, good): act one stocks lamp oil and not chips; act three the reverse; act two both a cell and iron tools.
`net` is bohemia_future.derive().went.standing, the signed number that already exists.

## MEASURED FIRST
bohemia_future says `lit: 0` ("what relights a circuit is a price and prices are his"), so nothing gave an act a lit share. The only lit number in the game is the powergrid default 0.12. Nothing in the city reads a per-act value yet.

## NOT DONE, SAID PLAINLY
Not wired: LIFE+CITY [the powered blocks] and WORLD must call stateOf. The demo is act one and is untouched. Every number is a draft for TUNING; the market lists are draft words for WORDS/ECONOMY. The 10/9 Grok crisis clock (first crisis near day 100) is a VIA GROK vote line, not built.

## ROUTED
LIFE+CITY/WORLD: call BohemiaActState.stateOf(act, layout, derive().went.standing) for the lit count and rule 73. ECONOMY: the market lists. TUNING: litFraction, reach, FULL_PAST (40).

GATE: gates/act_state_gate.js, ACT STATE, 17/0. Mutants: act one moving, and a ruin read as a boost; each went red.
