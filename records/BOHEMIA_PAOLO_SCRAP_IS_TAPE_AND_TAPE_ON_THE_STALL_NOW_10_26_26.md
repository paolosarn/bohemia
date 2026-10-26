# PAOLO 10/26: SCRAP IS TAPE, AND TAPE ON THE STALL NOW (LOCKED, rule 276; the run-killer)

## HIS WORDS (verbatim, voice to text)
"Also, I'm so confused like at the end of fight it says I won scrap but like what the fuck is scrap and like why am I not getting more
duct tape like for healing and shit bro like for my armor like I'm so fucking confused I made it to day four and I couldn't find
anywhere to get repair items like duct tape, bro so this runs over my shit's not repairing and I don't know where I'm supposed to get
duct tape and repair my shit up bro or whatever"

## WHY (coordinator, measured on main at 06:50)
- TAPE ON THE STALL: ECONOMY wrote the stack into the data at 05:48 (ede463a0: every stall at least 20 rolls, 1 battery a roll), but
  the town's stall screen (slices/BOHEMIA_SETTLEMENT_SCREEN.html, RUN TWO's) never got the line that puts tape on its shelf. RUN TWO
  was told at 05:37 to ship it first and stayed inside [buy and wear]. So the live game still has nowhere to buy tape.
- SCRAP: the end-of-fight screen (slices/BOHEMIA_SPOILS_SCREEN.html, RUN FOUR's) gives batteries, rounds and SCRAP ('what was left of
  it'); scrap is posted as part of an old 'resources' count that nothing he uses reads. It never becomes tape, never repairs anything,
  and nothing tells him what it is.

## THE RULING (rule 276)
(a) SCRAP IS TAPE: the word 'scrap' goes. What a fight leaves (the 'what was left of it') is TAPE: the loot screen counts it as tape
    with the tape icon, and it goes straight into the company's tape (bohemia.supplies.v1 .tape), the same tape that mends armour.
    Old saves' scrap converts to tape.
(b) TAPE ON THE STALL NOW: every stall shows tape from ECONOMY's stack (ede463a0) on every visit; this ships ALONE and FIRST, before any
    other row of RUN TWO's.
(c) HE IS TOLD: the first time he is low on tape (rule 261's bars red on armour), the phone says where tape comes from in one line
    (the stall in any town, the fight's loot).
(d) THE GATE: on the live demo, phone and computer: day 1 to day 5 of a new game, every town's stall sells tape; a won fight's loot
    shows TAPE and the company's tape rises by it; the word 'scrap' appears on no screen.
(e) RUN TWO [tape at every stall] NOW (interrupted for it); RUN FOUR [scrap is tape]; UI TWO NOTE (the one line on the phone); line
    216; EYES checks it the moment it is live.
