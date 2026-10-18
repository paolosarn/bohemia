# QD-C04: THE DOOR ON ORCHARD STREET
ACT: 2
KIND: contract
CRISIS: none
ECONOMY: either
PLACE: a housing office in a reclaimed casino lobby, and a single-storey house on a residential grid street
STATUS: draft:true, research only, nothing built (rule 35)
CHECKLIST: passes 31 of 32 (QR-AM 10/10: line 32 failed (C cost nothing and paid the most) and is fixed in place: C no longer saves the family and its contract waits a refresh) (QR-AC line-by-line run, 10/1); bends 30 on purpose, as QR-X set it: the test twist (T04) rewards the kind doors with a standing contract, but the fee is locked at the offer and the reward cannot be known before the choice, so the fork is not bought; the refund of the 6 stays cut. Lines 1 to 28 pass as written. Fixed in place: 28 (flags and saves named).
TWIST: T04 THE JOB WAS A TEST, AND THE PASS WAS NO (bank: questbook/research/QR_C_THE_TWIST_BANK_9_27_26.md). Costs NOTHING. Lands AT HAND-IN.

## THE SITUATION
A housing office is recruiting crews to keep order as the city rebuilds. The contract: collect three months of rent from a family on Orchard Street, or put them out. Fee: 8 batteries. The family cannot pay: the father's hands were crushed at the recycling yard. Whatever the company does, it must come back and report. At the report, the officer reveals it: the office sends every new crew to this door. It is how they hire.

## THE PERSON AND THE FIRST LINE
Officer Mireya Duarte, thirties, a white uniform cut like a ball gown, sitting at a baccarat table used as a desk. She speaks when the player taps the housing office on the settlement screen.
First line: "One house. Rent or keys. Ocho baterías when you come back. Most crews don't come back the same."

## THE SETTLEMENT AND THE OFFER SCREEN
(Added 9/28, Paolo's ruling: contracts are the Battle Brothers settlement contract screen. records/BOHEMIA_PAOLO_QUESTS_ARE_THE_SETTLEMENT_CONTRACT_SCREEN_9_28_26.md. The job after the yes is unchanged; only the front door moved. Research: questbook/research/QR_P_THE_FRONT_DOOR_MOVED_9_28_26.md.)
- SETTLEMENT: a reclaimed casino home base that has become the district's housing office.
- BUILDING: the housing office in the lobby (the hall).
- CLIENT PORTRAIT: Officer Mireya Duarte, white uniform cut like a ball gown, at a baccarat table.
- THE SCREEN'S LINES:
  - "One house. Rent or keys."
  - "Ocho baterías when you come back."
  - "Most crews don't come back the same."
- PAY, SHOWN BEFORE ACCEPT: 8 batteries at the report, locked whatever the company does.
- NEGOTIATION: ASK FOR MORE: "Ocho for everybody." (true: every new crew gets this door). ADVANCE: none.
- ACCEPT / DECLINE: ACCEPT puts Orchard Street on the map; the house is the job's place (the fight board if it comes to a fight). DECLINE, or closing the screen, or never tapping the building, writes nothing: no row, no line, no look, and the offer sits in the same building on the next visit while the job is still real.

## THE CHOICES
At the door:
- A. PUT THEM OUT. Cost: nothing in batteries; the family leaves the street (they appear later at a camp on the map).
- B. PAY THE RENT YOURSELF. Cost: 6 batteries of the company's own.
- C. COME BACK WITH NOTHING AND SAY WHY. Cost: nothing, yet.
At the hand-in, Duarte pays all three the 8 batteries (the fee was locked). Then the twist: on C, she offers the company a standing contract with the office (steady work, act 2). On B, she offers it too, and does not return the 6 ("That was yours to spend."). On A, she pays and says, plainly, "We have enough of those."

C IS NOT FREE (QR-AM, line 32; `Q226.X2`, `Q231.X3`, `Q161.X3`, `Q157.X1`): coming back with nothing protects nobody. Duarte sends the next crew within the week and the family is put out anyway, unless the player also pays (B). So C keeps the company's hands clean and leaves the family on the street; B keeps them in the house and costs 6. On C the standing contract waits one refresh ("Come back when you've done one"), so the cleanest hands are not also the best paid (QR-G line 30).

## WHAT THE LEDGERS REMEMBER
The office's opinion of the company (a standing contract or not). The family's fate on the map. The contract is FINISHED on every branch: the hand-in is the finish. DECLINING LEAVES NOTHING: nobody remembers the no, and the office does not treat a declined offer as a failed test.

FLAGS AND SAVES (QR-AC, line 28; `Q123.X1`, `Q116.X1`, `Q040.X3`): writes orchard_door = put_out | paid_rent | came_back; office_standing_contract = yes | no. A play-forward test sets each value and walks to every place that reads it (the office's next offers, the family's camp on the map); the save lands only at clean states: the offer screen closed, the hand-in, and the map between legs; never mid-fight and never mid-screen.

## THE SIGN (the world testifies first)
The rent ledger Duarte hands over has the Orchard Street address already written out, in several different crews' handwriting, each crossed out.

## THE ONE WRONG DETAIL
The family's front door has no lock; it has never had one.

## CITED FROM
- `Q104.W1`: the door was never locked; refusing was the pass.
- `Q104.W10`: the reward for refusing is recognition, not loot.
- `Q075.W2`: the induction test is the job.
- `Q010.W3`: a moral test with no mechanical stake on the fee; the fee is identical on every branch.
- `Q004.W4`: zero reward difference makes the choice purely about who the company is.

## FLAWS IT AVOIDS
- `Q075.X2`: not a fake puzzle; the choice changes the office's answer and the family's fate.
- `Q106.X6`: the player who refuses is not punished; he gets the better door.
- `Q058.X3`: no bluff; Duarte's line at the offer is true.
