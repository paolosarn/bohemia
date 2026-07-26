# BOHEMIA ADDENDUM — THE RESOLVE MOMENT IS ANY SPENT BLOCK, NOT JUST SLEEP (Paolo 7/26/26, LOCKED)

Paolo's words, verbatim: "I like it all tbh all 3 and sleep understand sleep can be
hangout or eat too u know".

EXTENDS laws/BOHEMIA_ADDENDUM_TIME_IS_SPENT_BY_ACTIONS_7_26_26.md and corrects how
the lab port framed its first mechanism. The port called the resolve point SLEEP.
Wrong: sleep is only the BIGGEST one.

## THE RULING

1. **THE WORLD RESOLVES AT ANY BLOCK OF TIME THE PLAYER SPENDS.** Sleeping a
   night. Hanging out with somebody. Sitting down to eat. Those are the same
   MECHANISM at different sizes, not three separate systems. A block is a block.

2. **A MOMENT HAS A SIZE.** How much time a block spends is what decides how much
   of the world moves through it. A night is not a lunch. That is why sleep can
   advance a crop and a meal probably cannot — but which system answers which
   moment is a per-system decision, made by that system, declared out loud.

3. **THE MOMENT NAMES AND THEIR SIZES ARE CANON, AND THEY ARE HIS.** SLEEP,
   HANGOUT, EAT are his three examples, not a closed list and not yet a table.
   No lane invents a moment, and no lane invents how long one lasts. Same rule as
   the action cost table: [PENDING Paolo] until he says the numbers.

4. **WHAT THIS BUYS, and it is the reason it matters:** a hangout that moves the
   world is a REASON TO HANG OUT. Eating becomes a decision instead of a menu.
   Every social act in a game about being watched becomes a way to spend time,
   which is the currency. Sleep stops being the only button that does anything.

5. Nothing here changes the beat. BEAT=0.5s stays the QUANTISER. A spent block is
   made of beats; it is not a second clock.

## MECHANISM (shipped the same turn)

engine/bohemia_resolve.js, gated by gates/resolve_gate.js:
- a resolver is built with a CALLER-DECLARED list of moments, each carrying
  whatever size unit that caller uses. The module ships none.
- a step may declare WHICH MOMENTS it answers. A step that declares nothing
  answers every moment, which is a real choice and is documented as one.
- resolving an undeclared moment is a build error, so a typo cannot silently
  create a fourth kind of night.
- the moment (its name and its size) is handed to each step as its own frozen
  argument. It never travels through the shared context, because a step still
  may not read anything another step wrote.

## VERDICT RECORDED THE SAME TURN

"I like it all tbh all 3" is an APPROVE on the three pattern picks from LAB-02/03:
ration by count not price, a ceiling that only moves on a commitment, and one
contextual verb with a declared reach. Recorded in
records/BOHEMIA_LAB_PORT_VERDICT_7_26_26.txt, with the adoption items filed into
the owning lanes' backlog sections. The lab still does not wire them in itself.
