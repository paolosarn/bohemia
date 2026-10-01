# YOUR PEOPLE HAVE KIDS, AND THEY ARE THE NEXT ACT'S COMPANY
# DYNASTY lane, board row [heirs] / THE-COMPANY-INHERITS
# 10/1/26 - MODE: BUILD - rule 39d, laws/BOHEMIA_LAW_THE_THREE_ACTS_AT_ONCE_9_23_26.md s11(c) and s12

## THE ONE LINE
**Each act starts with the heirs of the last act's company, worked out from the ledger every time and
never stored.** On the phone, standing in act 2 or 3, one row says HEIRS and lists them (a first name and
an age each). A man who falls early in act 1 and left no kid has no heir in act 2 or 3. A fall in act 2 or 3
changes nothing in the past. A change in the past re-works who is there and never deletes what the future did.

His question (9/28): "do the people you hire also belong to the dynasty each act? 36 instead of 12?" Yes.
His hole (9/28): "what if they die earlier in an earlier act... I just have to do some extra recruiting in
the future". The five rules of s12 are the spec, and each one is a leg of the gate.

## WHY THIS ROW AND NOT THE ONE ABOVE IT (said, not hidden)
Rule 5 says the first OPEN line. The first line in DYNASTY's section this round was [grok lore]. It is a
standing trigger: "when a ruling arrives that came out of a Grok talk, marked 'via Grok' in the record, run the
lore-yap test on it". Measured: 0 records or laws carry that mark. The one Grok page that exists (on the branch
named grok, not yet on main) is Grok's own list of findings, not a ruling, and has not been through EYES'
filter, so no lane may cite it. There is nothing to test, so the row stays OPEN and waits for its trigger. The
claim on [heirs] was committed and pushed as its own commit before any work, and says this in its message.

## WHAT SHIPPED
**engine/bohemia_heirs.js** (new, pure, no clock, no dice; inlined verbatim in the city).
- `heirs(ledger, act)` -> the next act's people, from the act before and nothing else: `{heirs, gone, crowded}`.
- `roster(ledger, act)` -> everyone in the company in that act: act 1 is handed in live, act n is the heirs of
  act n-1 plus the act's own recruits, each with the act's own events laid on top. The fallen stay on the list,
  marked, because a roster that hides the fallen looks the same as one that forgot them.
- `line(man)` -> does a line continue, and why: SURVIVED, LONG_ENOUGH (died after 60 days with the company),
  FAMILY (came with one), or DIED_TOO_SOON (it ends). The main character is never an heir (37g).
- `heirOf` -> one heir: key `H<act>:<parent>`, a name that remembers the parent (their surname, a given name from
  the city's own bank), age 15 to 35, about half the parent's traits (a coin the key decides, so a reload never
  changes it), the family's gear, the parent's look to descend from (PORTRAIT's heredity), half the strength.
- The writers: `died` (a death is an event of the act it happened in; a man cannot die twice), `note` (cannot
  write a death behind `died`'s back), `recruit`. The save (`save`/`load`) keeps what HAPPENED and never the heirs.
- `orphans(ledger, act)` -> what stays done: events keyed by somebody the past no longer has. Never deleted.
- Every number is a row in `ROWS` and draft:true, TUNING [recruit odds]'s to replace: 60 days, 15 to 35,
  35 years between acts, half the traits, 12 an act.

**The city** carries the module, an adapter, one phone row and the save.
- `ctHeirMembers()` is act 1's company, LIVE, from `ctYours()` (bonds and witnesses; still no roster).
  A name is carried only if you earned it (asked); a stranger's kid says "the kid of a cab driver" by trade.
- `ctHeirs(act)`, `ctHeirRoster(act)`, `ctHeirDied(act, key, day)`, `ctHeirLedger()` on the page.
- The phone row `#actheirs`: only in an act that has heirs, a readout and not a button, above the offer row,
  in the phone's own face, chips that wrap instead of ellipsize. Flipping to act 1 takes it away.
- The city's own save carries `heirs` (the events). Restore brings the cut line back.
- Build stamp: BUILD 10/1a - THE COMPANY INHERITS.

## FIVE THINGS MEASURED BEFORE BUILDING (rule 12: a premise, not a gate)
1. **THE COMPANY HAS NO ROSTER, AND THIS ROW HAD TO NOT BUILD ONE.** engine/bohemia_company.js and bohemia_down.js
   both say it: membership is computed from bonds and witnesses, and deleting the record deletes the member in
   the same instant. A stored heirs list would be exactly the second list that disagrees with the world. So the
   heirs are a function and what is kept is the act's event ledger, keyed by person.
2. **NOBODY CAN DIE IN THE WALKED GAME.** bohemia_down.js (9/11): "fall() has exactly one outcome". His 9/27
   "struck down = 20% dead" is the newer word and nothing has built it. So the death, day and family clauses are
   proved on the ledger's input shape, and the street shows the survivors' line. `ctHeirDied` is the door
   COMBAT and TUNING open the day somebody can fall for good. The glass leg uses it, and says so.
3. **A PERSON HAS NO AGE, NO HIRE DAY, NO GEAR AND NO FAMILY FLAG.** What a person has: a key, a trade, a looks
   seed, a former trade (wasOf: 15 backgrounds, and the four "front of house" ones keep nothing) and a name once
   asked. So `since`, `family` and `gear` are accepted on the input and nothing writes them yet.
   The 60-day clause needs somebody to stamp the day a bond starts, and "no roster" forbids a list, so it
   belongs on the bond record itself (QUESTS / PEOPLE).
4. **THE GROUND DOES NOT MOVE ON A FLIP YET** (the city's own comment in ctActFlipTo). So the heirs have nowhere
   to stand: no house, no street, no body in act 2's city. They exist as names, ages, traits and a look, on the
   phone, and in `ctHeirRoster` for the company screen UI owes ([roster], with "the heir line" already in its brief).
5. **A PERSON YOU BONDED WITH IS USUALLY NOT NEXT TO YOU, AND THE FIRST CUT HANDED THE DERIVE NOBODY.** The meter
   reader's lineman is P:city:18:14:2 and he stands six neighbourhoods away; `ctEveryone()` is the 3x3 around the
   player and does not have them. The gate caught it (the adapter returned a company with no looks seed and no
   former trade). The key is "nx:ny:i", and `pplPeople(nx, ny)` answers for any neighbourhood, so `ctPersonByKey`
   asks the one the key names. **`ctPersonName` has the same blind spot** (it returns nothing for that same man),
   which is QUESTS' and PEOPLE's seam, routed below.

## DEFAULTS I DECIDED (draft, his to correct in the VOTE tab)
- An heir of a man who survived is an APPRENTICE; an heir of a man who fell is a KID (flavour only).
- An heir starts with half of what the parent had earned, so a legend's kid is a name and not a legend.
- When more than 12 lines qualify, the strongest 12 get the room and the rest are CROWDED_OUT (they have no
  heir this flip; if they get stronger the next derive can let them in). A line that ended is "gone", not crowded.
- A parent you never asked leaves no name to carry. The heir gets a whole name from the bank. Their own heir,
  one act on, carries the name the first was given, because a name once made is kept.
- The heirs row names and ages only. Faces are PORTRAIT's (the look to descend from is on every heir) and the
  full screen is UI's.

## THE GATE - gates/heirs_gate.js, registered as HEIRS (83 legs)
Headless against the real module and the real name bank (59 legs): the five rules, one leg each, plus the
number rows (change a row and the answer changes), the cap (15 lines, 12 heirs, strongest kept, order does not
matter, 36 across three acts), three generations carrying the first surname, the derive writes nothing (a
deep-frozen ledger derives all three acts), the save carries events and never heirs, garbage loads as fresh, and
the city's copy is the engine's file byte for byte. On the glass with a real finger (24 legs): a fresh game has
no company and so no heirs row (nobody is invented); a REAL company the game wrote itself (a real job taken and
finished, its own bond fired); the adapter hands the derive a person, not a role; the page's answer is the
engine's answer; the row shows with the right chips, sits above the strip, no chip overlaps another, nothing in
the shell covers it, no chip leaves the glass; flipping to act 1 takes it away; a fall in act 1 cuts the line and
the chip goes; the city's own save carries what happened and not the heirs, and restoring it cuts the line again;
act 3 shows the heirs of the heirs.
**NEGATIVE CONTROLS, RUN:** the engine sabotaged seven ways (deaths ignored; no threshold; the derive writes to
the ledger; orphaned deeds deleted on a re-derive; a death in act 2 reaching into act 1; no cap; heirs saved into
the ledger). Each one turned a leg about THAT rule red, and the derive-writes-the-ledger one also crashed the
gate, which is red too. The engine-copy leg trips on any change to the engine file, so it is not counted as
proof of anything. `--headless` skips the browser so the controls run in a second; the suite never passes it.

## WHAT I FOUND AND DID NOT FIX, SAID PLAINLY
- **Nothing in the game calls `ctHeirDied`, and nothing stamps the day a bond starts.** Today every one of his
  people carries a line forward. The three clauses that can end a line are proved and idle.
- **The heirs have no body.** See 4 above. A flip changes the face on the phone and the heirs row, and nothing else.
- **The first Grok page** (branch grok, not on main, not filtered) says "the company across three acts is still
  an open question". It is not any more as of this commit. I did not use the page as a source.

## ROUTED
- **COMBAT / TUNING** - when the 20% death lands, call `ctHeirDied(act, key, day)`; replace `BohemiaHeirs.ROWS`
  with [recruit odds]' table (the rows are named so it is one object).
- **QUESTS / PEOPLE** - stamp the day a bond starts on the bond record (the 60-day clause reads `since`); and
  `ctPersonName` cannot name a person you bonded with who is away from you (use `ctPersonByKey`).
- **UI [roster]** - the heir line column reads `ctHeirRoster(act)` (heirs and recruits, the fallen marked).
- **PORTRAIT** - every heir carries `lookFrom` (the parent's look) and `lookSeed` (its own) for heredity.
- **WORLD [the derive's ground]** - the heirs need houses in act 2 and 3's city; the keys are `H2:<parent>`
  and `H3:H2:<parent>`.
- **FACTIONS / RUN** - still owed from [one then heirs]: call `ctActUnlock(2)` when the first base is his.
- **[the frame] (next row)** - an heir is the same two ledgers as the ending: the recorded line the machine can
  model, and what the parent did that no record holds.

## PRE-PUSH PASS
See the handoff block for the exact gates run and the reds that are not mine.

*DYNASTY round, BUILD. The company's line is derived, never stored; the walked game cannot yet end a line.*
