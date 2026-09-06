# HE CAN MOVE A TOWN
FACTIONS lane · VAMILY row `[town sizes]` TOWN-TIERS-ARE-HIS · 9/6/26

## THE ONE LINE
The row is one sentence with two halves — *"the draft tiers off act1_power ship;
**he moves any faction he likes**"* — and only the first half existed. Moving one
meant editing a source file. There is a door now, in the DIRECT tab, and pressing
it changes what that faction's market sells and how far its town reaches.

## WHAT WAS ALREADY DONE
FACTION-TOWNS (9/5) ranks the fourteen by his own `act1_power` column, cuts them
in thirds, and tags every answer `draft:true`. `TIER` ships empty. Measured, the
mechanism is complete and correct:

    fortress  11 of 11 goods   7 blocks across
    town       8 of 11 goods   5 blocks across
    camp       4 of 11 goods   3 blocks across

**A tier is not a label.** It decides how deep that faction's market is and how
far its town spreads on the ground, and both numbers are read live off the
shipped modules.

## WHAT WAS MISSING
His door. `BohemiaTowns.TIER['Colorful'] = 'town'` in a source file was the only
way to move one, and HE MUST BE ABLE TO DIRECT IT (8/12) says that in as many
words: *"where does he change this himself"* must not be *"he tells me and I edit
a file."*

**Tab: DIRECT.** A fourth mode beside CUTSCENES, QUESTS and STANDING — the same
reason STANDING is the third: it is a **value he sets**, not an order he
rearranges. Fourteen rows, one per faction, showing its strength number and four
chips: FORTRESS / TOWN / CAMP / WORK IT OUT.

**He is choosing a consequence, not a label.** Every row prints what the tier
buys, read off the real modules: *"worked out from strength: CAMP · sells 4 of 11
things · covers 3 blocks across."* A dial whose effect you cannot see is a dial
nobody trusts — the lesson the VOTE tab paid for on 8/28.

**WORK IT OUT is a real choice and it is the default.** It puts the faction back
to derived rather than freezing today's answer, so the day he re-ranks somebody in
the graph the tier follows instead of quietly disagreeing with it.

## THREE THINGS THAT WOULD HAVE SHIPPED BROKEN, AND ONLY CLICKING FOUND THEM
Every one of these passed a source check while the button did nothing.

1. **`window.BohemiaTowns` is not in the alpha at all.** It is inlined in the
   walked city and nowhere else, so the first version of the panel fell straight
   to its "module is not loaded here" branch and rendered nothing. The repair was
   already written one screenful above it, in the STANDING dial's own comment:
   *"the REAL module computes the answer here and posts it... that is the same
   second-copy drift this lane spent yesterday deleting."* Retyping the tier
   thirds, the goods fraction and the reach table into the alpha would have been
   exactly that, done knowingly. **So the panel asks the city and renders the
   reply.**
2. **`dirRender` returns.** Its shared branch for dial modes calls `dirDial()` and
   returns — and `dirDial()` sets the host to `display:none` when the mode is not
   `'standing'`. My towns call had gone in beside the one in the *message
   listener*, so the panel was blank however many times the chip was pressed.
3. **Every button measured 0×0** — with the splash still up, `#app` is
   `display:none`. This is the **third time this session** that ruler has lied:
   the same false reading made a 44×174 fold button look like a law violation on
   8/30. Tap the splash first and the chips are 56 buttons, **every one exactly
   44px, none under**.

## THE SHIP TEST, DRIVEN ON A REAL CANVAS
Colorful is `act1_power` 1 — the bottom of his own graph, and a camp by
derivation.

    tap TOWN SIZES     14 factions drawn
    Colorful reads     "worked out from strength: CAMP · sells 4 of 11"
    press FORTRESS     "YOURS: FORTRESS · sells 11 of 11"
    the walked city    asked with its own copy of the module: fortress/11
    saved              {"Colorful":"fortress"}
    press WORK IT OUT  back to "CAMP · sells 4 of 11", saved cleared to {}

**The walked city agrees the same second.** It carries its own inlined copy of the
towns module, so a dial that only wrote `localStorage` would be one he has to
reload to feel — the same reason the deed weights post across. The city persists
its own copy too, so a cold demo never quietly disagrees with what he set.

## GATES
`faction_towns_gate` 48/0, up from 33/0 — extended, not duplicated. The source
checks are still there and are still worth having, but the claims that matter
drive the real panel: the fourteen rows draw, the press moves the goods count, the
city agrees, the undo really undoes, and every chip is a thumb.

## [PENDING Paolo] — NOTHING NEW
The row said "needs Paolo" and it did not. The tiers ship as drafts off canon he
already wrote, and the thing that was missing was his ability to overrule them.
Now he can, one tap per faction, and nothing waits on him.
