# BOHEMIA QUESTBOOK #236 — "THE HALL AND THE HAGGLE (THE BATTLE BROTHERS CONTRACT SYSTEM)"
**Game:** Battle Brothers (2017, with the Beasts and Exploration, Warriors of the North and Blazing Deserts expansions)
**Studio:** Overhype Studios
**Quest:** not one quest but the CONTRACT CLASS: the settlement screen, the hall, the offer, the haggle, the job on the map, the twist, the hand-in, and the world state the whole loop feeds.
**Type:** SYSTEM DEEP DIVE (queue row [bb contract study], filed by the QUESTS lane, research only, rule 35)
**FORMAT:** v2: cast + conversation node trees + branch map.
**Filed:** 9/28/26
**Why pulled:** Paolo 9/28, LOCKED: quests in Bohemia ARE "this settlement menu contract pop-up screen" (records/BOHEMIA_PAOLO_QUESTS_ARE_THE_SETTLEMENT_CONTRACT_SCREEN_9_28_26.md). The library held 152 studies and none was Battle Brothers. Every contract page (QR-A, QR-C, QR-E, QR-L) argued toward Battle Brothers from other games. This file puts the source itself on the shelf so the next pages cite it by id.

**SOURCE HONESTY (read first).** Every fact below is tagged. [V] = verified this round by web search (Battle Brothers Wiki "Contracts" and "Game Guide" pages as summarised by search, and the Steam "Negotiation Mechanics" thread); the wiki and the developer blog were blocked by the network proxy for full fetch, so [V] means the search-returned text, not a page read end to end. [R] = recall, from reference/library/battle_brothers/ (itself marked recall) and from memory of play; treat every [R] number as approximate until UI [bb interface] or ECONOMY [bb money] verifies it.

---

## 0 CORE IDEA

**A contract is a stranger's problem, priced by a face that gets angrier every time you ask for more, and the only promise you make is the one you make when you press accept.**

The machine runs: the party marker reaches a settlement; the settlement screen opens (the town as one painted view, buildings as icons) [R]; one of those buildings holds the contracts, and each contract is a small screen with a client portrait, a few lines of text about a problem that exists in the world right now, a difficulty shown in skulls (one to three) [V], and a fee [R]. Before you accept, you may NEGOTIATE: ask for more, change the payment mode (all on completion, part up front, per head for kill jobs) [V]. Every ask raises the client's hidden annoyance by a random 3 to 6; each ask fails with a chance of annoyance times 0.1; at 9 or more you are thrown out and relations with that client drop hard [V]. A Negotiator follower halves the annoyance and removes the relation cost of haggling [V]. Then accept or walk away. One active contract at a time [V].

After accept, the contract is a destination on the map and a fight, or several, on the ground, usually with one mid-job turn (the camp is bigger, the caravan carries contraband, another company wants the pay, the client will not pay) [R]. Hand-in returns to the client: crowns, renown and relations with that settlement or noble house [V]. Failing lowers local relations and company renown [V]. And the outcome writes back to the map: an escorted caravan can leave a castle freshly supplied (better goods), a failed defence can leave granaries raided or burned (food scarce and dear) [V]. The board is not a list of quests; it is the world's current problems with a price on them.

**The life lesson underneath, never spoken:** you are paid for the problem you agreed to, not the one you found, and the person paying you is watching how greedy you are before they know whether you are any good.

---

## 1 CAST + WHAT EACH ONE WANTS

### THE CLIENT (the village elder, the magistrate, a noble's steward, a merchant) [R]
- **What he wants (stated):** a problem gone: brigands off the road, a caravan to arrive, a beast dead.
- **What he wants (real):** to pay as little as the problem allows, and to keep a company in the region that will come back.
- **What he will trade:** crowns, a share up front if you ask, a price per head for kill jobs [V]; his settlement's goodwill.
- **What he will never say out loud:** how bad it really is (the camp is bigger than said) or what is in the cart [R].
- **Function:** THE PURSE and THE FACE. His portrait and his mood are the whole negotiation UI.

### THE CLIENT'S PATIENCE (the hidden annoyance number) [V]
- Cast as a character because the system treats it as one: 3 to 6 per ask, a fail chance of annoyance x 0.1, thrown out at 9.
- **Function:** THE CLOCK ON GREED. It turns "ask for more" from a free button into a gamble with a visible face.

### THE COMPANY (the player's men) [R]
- **What they want:** wages every day, food, and to survive. A 12-man company burns 150 to 300 crowns a day [R].
- **Function:** THE PRESSURE. The treadmill of wages is why the player cannot refuse forever; contracts are needed, never forced.

### THE THIRD PARTY (a rival company, the deserters, the ambushers) [R]
- **Function:** THE TWIST'S MOUTH. The mid-job turn usually arrives as a new group with its own offer or its own claim.

### THE SETTLEMENT (the place itself) [V]
- **What it wants:** to stop being in its current SITUATION (raided, besieged, short of food).
- **Function:** THE BOARD'S AUTHOR. Its situations generate the contracts and its prices show the result.

---

## 2 FULL EVENT FLOW (STAGE BY STAGE)

### STAGE 1: ARRIVAL [MANDATORY]
The marker enters a settlement. The settlement screen replaces the map: buildings as icons (market, recruits, tavern, temple, the hall) [R]. The tavern sells one-line rumours that can point at problems elsewhere [R]. Nothing is offered until the player taps the building.

### STAGE 2: THE BOARD [OPTIONAL]
The hall lists the open contracts: typically one to three, each with a client face and skulls [R]. Renown gates what appears: noble house contracts need a certain renown [V]. The player can already be on a contract, in which case new ones are visible but not takeable (one at a time) [V].

### STAGE 3: THE OFFER AND THE HAGGLE [OPTIONAL, MISSABLE BY CHOICE]
The contract screen: a few lines from the client, the fee, the payment mode, the skulls. Negotiation options (node tree in section 3). Walk-away leaves the offer on the board [R]; negotiating to the throw-out costs relations [V].

### STAGE 4: THE JOB [MANDATORY after accept]
A target on the map (a camp, a route, a village to defend at night, a beast's lair) [R]. Travel time passes; wages burn. Often one twist mid-job [R]. Many contracts have a time limit or a moving target (a caravan that must be walked, a raid that arrives on a day) [R].

### STAGE 5: THE HAND-IN [MANDATORY]
Return to the client (or the job completes on the spot for some). Pay, renown, relations [V]. Per-head contracts count the kills [V]. Some hand-ins twist: the client refuses to pay and the player chooses to take it by force [R].

### STAGE 6: THE WORLD WRITES BACK [AUTOMATIC]
Settlement situations change: freshly supplied, or raided and burned [V]. Prices follow [R]. Failure lowers relations and renown [V]. The next board in that settlement reflects it.

**Skipping silently changes nothing:** a contract never taken writes nothing the player can see (see the flaws for the one exception BB players report).

---

## 3 THE CONVERSATIONS (THE ACTUAL MACHINE)

### NODE BB-1: the hall. Entry: stage 2, the player taps the hall.
A list of faces, each with a one-line problem and skulls.
> tap a contract [gate: none] -> BB-2
> tap one while another contract is active [gate: flag active_contract] -> readable, not takeable. THE ONE-AT-A-TIME rule as a greyed button, not a speech [V]
> leave [gate: none] -> the settlement screen. Nothing written
NOVERB "ask around the room for work" beyond the list: the board IS the town's need. No hidden jobs behind charm.

### NODE BB-2: the offer screen. Entry: a contract tapped.
The client states the problem in a few lines, the pay, the mode. Paraphrased shape: brigands took the road; the elder will pay so much when their heads are brought back.
> "Accept." [gate: no active contract] -> the job starts; the target appears on the map. THE ONE LINE DOING THE WORK is the accept button: it is the only promise in the system
> "Negotiate." [gate: none] -> BB-3
> "Decline / leave." [gate: none] -> back to the hall; the offer stays [R]; nothing written [R]
WHAT THIS NODE COSTS: nothing until accept.

### NODE BB-3: the haggle. Entry: negotiate chosen. Each ask adds 3 to 6 annoyance; fail chance = annoyance x 0.1 [V].
> "More pay." [gate: none] -> on success the fee rises; the client's portrait and line shift (pleased, annoyed, angry) [R]; a slight relations cost, about 0.5 percent [V]
> "More up front." [gate: an advance is offered] -> moves 25 percent of completion and per-head pay into the advance; rounding usually loses money overall [V]. TRAP-shaped: it reads as a gain and is mostly a loan
> "More per head." [gate: kill contract] -> raises the per-kill rate [V]
> "Deal." [gate: none] -> BB-2 with the new terms
> push once too often [gate: annoyance >= 9] -> THROWN OUT: the contract is gone and relations with the client drop substantially [V]. LOCKS OUT BB-2 for this contract
WHAT THIS NODE COSTS: a little standing per ask, and the risk of losing the whole offer. The Negotiator follower halves annoyance and removes the relation cost [V].
NOVERB "tell me more about the job before I price it": there is no investigation before the fee. You price at ignorance, as in `Q148.W1`.

### NODE BB-4: the twist. Entry: mid-job flag.
Examples [R]: the caravan guards turn on you; a rival company demands the pay; the kidnapped daughter left willingly.
> fight [gate: none] -> the job continues through the fight
> take the other side's offer [gate: twist offers one] -> the original client is betrayed; relations drop
> walk away [gate: none] -> contract failed; relations and renown drop [V]

### NODE BB-5: the hand-in. Entry: target done.
> "Pay." [gate: job done] -> crowns, renown, relations [V]
> the client refuses [gate: twist] -> > take it by force (relations collapse, the pay is yours) > leave unpaid [R]
WHAT THIS NODE COSTS: nothing when clean; the refusal twist makes the player price his own honour.

---

## 4 THE BRANCH MAP

**COUNT: per contract, 4 terminal states (paid clean; paid after a twist; failed/abandoned; thrown out at the haggle) plus the continuous fee axis and the payment-mode axis.** Declined is not a state.

- **PAID:** crowns, renown, relations up; the settlement's situation may improve (freshly supplied) [V]. Cashes out on the next board and in local prices.
- **PAID AFTER TWIST:** as above, sometimes with a relations hit to one side.
- **FAILED / DROPPED:** local relations down, renown down [V]; the situation may worsen (raided granaries) [V].
- **THROWN OUT:** substantial relations drop with that client; no job [V].
- **DECLINED:** nothing recorded [R]; the offer eventually expires off the board when the situation passes [R].

---

## 5 HONEST FLAWS (BANKED)

**F1 — THE HAGGLE IS SOLVED MATH.** Players publish the numbers (the Steam "Negotiation Mechanics" thread) and conclude only one option is a net gain; the advance loses money to rounding [V]. Once solved, the face stops being a person and becomes a slot machine.
**LAW FOR BOHEMIA:** the ask for more must be readable on the face, not solvable from a forum: a visible ceiling the face shows, one or two asks, never a hidden random walk (QR-L P8).

**F2 — THE TWIST IS A TEMPLATE.** Veteran players describe the contraband caravan and the bigger camp as expected beats; the turn stops being news after the tenth time [R].
**LAW FOR BOHEMIA:** ration the twist to a minority on an unpredictable schedule (QR-C rule 2, the same law `Q148.X3` gave).

**F3 — THE CLIENT IS A VENDING MACHINE.** The elder has a portrait and a mood, but no want beyond the fee, no memory beyond a relations number, and no life on the map [R].
**LAW FOR BOHEMIA:** the client is a person in a place with a want the player can see (QR-E), whose place changes where the player can see it after the hand-in.

**F4 — THE CRUNCH FORCES THE YES.** The daily wage burn makes refusing expensive in practice; the decline is free in the ledger but not on the treasury [R].
**LAW FOR BOHEMIA:** keep the pressure but keep a second income (scavenge in the settlement screen, third votes) so a no is never a slow death.

---

## 6 WHY IT WORKS (W1-W10, EXACTLY 10)

W1. THE BOARD IS THE WORLD'S CURRENT PROBLEMS. Contracts are generated by settlement situations and write situations back; the hall is a readout of the map, not a quest list.
W2. ONE CONTRACT AT A TIME. A single active job keeps the player's promise legible and the map uncluttered; the greyed button teaches it without a speech.
W3. THE SKULLS ARE A READING. Danger is stated before the yes in one glyph, so "too strong for me" is the player's informed call.
W4. THE FACE IS THE NEGOTIATION UI. A portrait whose mood shifts per ask makes a number feel like a person's patience.
W5. GREED HAS A CLOCK. Annoyance 3 to 6 per ask, a failure chance that grows, thrown out at 9: asking for more is a gamble with a visible cost.
W6. THE PAYMENT MODE IS A CHOICE ABOUT RISK. Up front, on completion, or per head lets the player bet on his own company.
W7. THE ACCEPT BUTTON IS THE ONLY PROMISE. Browsing, reading and haggling are free of commitment; failing after accept is what costs.
W8. THE OUTCOME CHANGES THE MAP. Supplied castles and burned granaries turn a finished job into prices and boards the player meets later.
W9. RENOWN GATES THE TIERS. Bigger clients appear as the company grows, so the board is its own progression without a quest log.
W10. THE WAGE TREADMILL MAKES CONTRACTS MATTER. Money out every day means every offer is weighed, not skimmed.

---

## 7 BOHEMIA PORTS

### PORT 1 — THE HALL IN THE SETTLEMENT SCREEN [W1, W2]
**System:** the fourteen home bases (third votes), the settlement screen, WORLD's situations. Each home base has one building that holds the asks; its offers are generated from that base's current situation (short of water, a raid coming, a roaming party on the dam road). One active contract. Cross-ref QR-E (the ask in a place), #148 PORT 1.
```
@TALK hall_offer speaker=client entry=hall_tapped
  @SAY The pump on the east road quit talking. Somebody's sitting on it.
  @SAY Two skulls. Four batteries when the water runs. One now if you want it.
  @OPT "Deal."                         [gate: no active contract] -> contract_on
  @OPT "Make it five."                 [gate: none] -> haggle_1
  @OPT "Not for me."                   [gate: none] -> hall   ; writes nothing
  @NOVERB "Tell me more before we talk price"
@END
```

### PORT 2 — THE FACE WITH A CEILING, NOT A DICE ROLL [W4, W5, F1]
The client's portrait shows mood; the first "more" lands, the second shows the ceiling in a line ("That's the top. Take it or don't."), a third ends the offer. Deterministic, readable, never solvable only from a forum. Draft lines:
```
@TALK haggle_1 speaker=client
  @SAY Five. Fine. Don't make it six.
  @OPT "Deal."        [gate: none] -> contract_on
  @OPT "Six."         [gate: none] -> thrown_out   ; the offer is gone, a small standing cost, no speech about it
@END
```
[PENDING, Paolo's call: whether a thrown-out haggle counts as a deed at all, given DECLINING IS FREE. QR-E OPEN 1 asks the same.]

### PORT 3 — DECLINE WRITES NOTHING [W7]
Walking away writes no ledger byte; only accept, finish, fail and drop are deeds. Matches QR-A.

### PORT 4 — THE RESULT IS THE BASE'S NEW SITUATION [W8]
A finished pump job flips the base from "dry" to "running" and its price for water drops; a failed one lets the roaming party take the pump. Cross-ref the future goes both ways (third votes).

### PORT 5 — ADVANCE AS AN HONEST LOAN [W6, F1]
An advance is shown as what it is: one battery now, one less at the end, no rounding loss. QR-L owns the numbers; TUNING owns the values.

---

## SOURCES
- reference/library/battle_brothers/08_CONTRACTS_EVENTS.md, 07_ECONOMY.md, 10_UI_AND_FEEL.md (recall files). FUTURE DEEPER PULL: verify every [R] line against play.
- Battle Brothers Wiki, "Contracts" and "Game Guide" (Fandom), via search summary; full fetch blocked by the proxy this round: `https://battlebrothers.fandom.com/wiki/Contracts`. FUTURE DEEPER PULL: the contract type list with base pay by skull.
- Steam discussion "Negotiation Mechanics" (annoyance 3 to 6, fail = annoyance x 0.1, thrown out at 9, advance 25 percent, Negotiator halves): `https://steamcommunity.com/app/365360/discussions/0/2922228082015480977/`. FUTURE DEEPER PULL: confirm against the game's scripts.
- Overhype, Dev Blog #95 "Contract Changes" (listed by search, fetch blocked): `https://battlebrothersgame.com/dev-blog-95-contract-changes/`. FUTURE DEEPER PULL: the designers' own reasons.
- Steam "Is there a reason to not ask for a bigger pay every time?" and "negotiation: lower reputation?" threads (criticism for F1).

---
*END #236*
