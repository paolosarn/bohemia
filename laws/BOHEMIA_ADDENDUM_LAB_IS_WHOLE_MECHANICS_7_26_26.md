# BOHEMIA ADDENDUM — THE LAB EMULATES MECHANICS, NOT FEEL (Paolo 7/26/26, LOCKED)

AMENDS laws/BOHEMIA_ADDENDUM_THE_REFERENCE_LAB_7_26_26.md (same day, later ruling
wins). Point 1 of that law said "one system from one game". The lab read that as
"one FEEL study" and shipped a walk. That was wrong.

Paolo's words, verbatim: "who said I wanted to test the walking like why did you
just focus on like movement like it was supposed to be like the actual game and
all its mechanics I've seen countless YouTube videos where you can remake a game
in 30 minutes to an hour like why did you just do the walking bro? Sure feels
great like I don't know what you want me to do with that information... you need
to get the code online and implement it for the different game mechanics like
marriage and fishing in farming like or at least have a base understanding what's
wrong with you why did we do this?"

## THE LAW

1. **AN EMULATION IS THE GAME'S MECHANICS.** Not a feel study, not one
   subsystem's numbers. A lab emulation must implement **AT LEAST THREE NAMED
   MECHANICS** of its game, each PLAYABLE END TO END, in one page. "Named
   mechanic" means a thing a player of that game would name: fishing, farming,
   marriage, looting, crafting, combat, trading, building, reputation. NOT:
   walking, camera, collision, lighting, a transition. Those are plumbing inside
   a mechanic and are never the deliverable.

2. **GET THE CODE.** "You need to get the code online" is now the method, not an
   option. Every rule in an emulation comes from the master's own source, with
   the file:line recorded. Where the master keeps a number in CONTENT DATA rather
   than code (crop growth tables, fish difficulty tables, gift lists), that is
   declared as CONTENT and stands in as ours — the MECHANISM is what gets
   copied exactly, and MECHANISM-MINE / CONTENTS-PAOLO'S already governs the
   rest.

3. **PLAYABLE MEANS THE LOOP CLOSES.** A mechanic counts only if it can be
   completed and repeated: catch the fish, plant it and harvest it, get from
   stranger to married. A demo of a mechanic's first step is not the mechanic.

4. **MOVEMENT IS NOT A LAB TARGET, EVER.** Bohemia's movement is RULED (see
   laws/BOHEMIA_ADDENDUM_TIME_IS_SPENT_BY_ACTIONS_7_26_26.md). Nobody studies
   another game's walk for us again, and no lab page's headline is how it feels
   to move.

5. **SPEED IS THE POINT.** He named the bar himself: people remake a game in
   thirty minutes to an hour. A lab turn produces a whole set of mechanics, not
   a polished one. Breadth first, then depth, and only if he asks for depth.

6. WHAT SURVIVES from the original law: emulations still never touch the alpha,
   any engine module, any bank or Bohemia's art style; they still live under
   slices/lab/ labeled REFERENCE with placeholder art; they still ship a ledger
   (now a MECHANICS TEARDOWN) and a pattern note; the lab still ports nothing
   itself; Paolo playing it is still the verdict.

## GATE

gates/lab_gate.js. Each registry row DECLARES its mechanics; the gate fails if a
row declares fewer than three, if a declared mechanic has no live end-to-end
check, or if any constant loses its source citation. A row whose declared
mechanic is a movement/camera/lighting/collision word fails outright.
