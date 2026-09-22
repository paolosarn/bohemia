# QUESTS [strike ask] — THE PICKET IS AN ASK, AND IT IS ONE HE ALREADY NAMED
9/22/26 · lane 19 QUESTS · board row `[strike ask]` /
SOMEBODY-ON-THE-BLOCK-ASKS-YOU-TO-HOLD-THE-DOOR

## THE ROW'S OWN PREMISE, MEASURED FIRST (rule 12)
The row says the ask exists "when WORLD [block strikes] lands". It landed on
9/21: `engine/bohemia_strike.js`, THE BLOCK HOLDS THE DOOR, with `held()` and
`cutSticks()` and three answers rather than two. The named blocker is real and
it is gone, so the row was buildable this round.

## AND THE CHANGE IT MAKES IS NOT A NEW ONE
This lane's first law is that an ask which changes nothing visible is not an ask,
and the six visible changes are HIS. Two of the six shipped carrying `proof:null`
with an honest note. `person_moves_house` carried:

    system: 'nothing owns this yet'
    unwired: 'nothing in the repo moves a person from one home to another'

That is exactly the system WORLD shipped. Glasgow 1915 was never won on money,
it was won on THE VACANCY: a landlord's cut only works if he can replace you,
and he cannot replace a door the block is holding. `held()` answers whether
anybody moves into that flat.

**So the list is still six long.** Nothing was invented to make the row ship.
It goes 4 wired / 2 unwired -> **5 wired / 1 unwired**, and the one left over
(`rumour_turns`) still says out loud that it is unwired.

    person_moves_house:
      says:   'Somebody moves house, or the flat stays empty.'
      system: 'the block holding the door'
      proof:  { file: 'engine/bohemia_strike.js', symbol: 'held' }
      does:   'set_flag'

## THE READER
`readDoor(snap)` reads `snap.doors` and keeps only a door that is BOTH cut and
empty. A cut that is not live, or a flat nobody is coming for, produces nothing
rather than a picket over an eviction that is not happening. It hands the want
over and never re-derives whether the block holds — that answer is WORLD's and
there is exactly one of it.

## THE MOUTH (rule 19: text comes from a mouth, never a card)
The picket's words went in `engine/bohemia_ask_spoken.js` beside the other five,
so the ask is spoken by a named neighbour with a portrait:

    open: "They cut the light in that flat and the family is still in it."
    ask:  "Stand at the door tonight so nobody new moves in."
    yes:  "Then he cannot replace them. That is the whole thing."
    no:   "Somebody will have the keys by Friday."

All `draft:true`. The refusal, the no-bare-cell rule and the closing promise that
quotes the visible change byte for byte are the module's existing ones; nothing
about the mouth was loosened to fit a sixth row in.

## THE GATE — `gates/strike_ask_gate.js`, 20 passed / 0 failed
Registered as **STRIKE ASK**. Proved by planting the bug three ways:
1. `proof` pointed back at null -> RED.
2. the reader accepting a door that is cut but NOT empty -> RED.
3. **a seventh visible change added to his six** -> RED. That leg exists because
   the cheap way to ship this row was to invent a change, and a gate that cannot
   catch its own author taking the cheap way is decoration.

## PRE-PUSH PASS (rule 13)
STRIKE ASK 20/0 · ASK HAS A MOUTH 29/0 · WIRE THE DOOR 15/0 ·
ASKS VISIBLE 38/0 (now reporting 5 of 6 wired) · ALPHA LOADS 20/0 ·
ATTEMPT 15/0 · INLINED-FRESH 3/0 (139 modules, every one byte-identical to its
engine canon after the resync).

ASKS VISIBLE earned its keep mid-round: it caught the city running 4-of-6 while
the engine file already had 5-of-6, because an engine edit is not a game edit
until it is inlined. Three modules were re-synced.

RED AND NOT MINE, WITH THE COMMIT NAMED: **HAGGLE LIKE BB 18/2**. See
`BOHEMIA_QUESTS_THE_BLOCK_STOPPED_SEEING_YOU_9_22_26.md` — the walked city stopped
recording witnesses, so a reputation mark reaches nobody. Identical 18/2 on a
clean `origin/main` worktree. The gate is not loosened.

## HELD (rule 18)
Nothing here is in the alpha's play surface. The row's work is the ask
generator, the mouth and the gate, which are engine and checker. `[main quest
live]` stays held on `claude/dynasty-vamily-w4yxiz` and is not on main.

## TAB
NOT IN A TAB YET. The picket is an ask the generator can produce; it becomes
something he can see when the ask surfaces on a neighbour's mouth in the CITY.
