# THERE IS NO MONEY IN THIS GAME — AUDIT AND ENFORCEMENT (8/15/26,
# coordinator, on Paolo's correction: "how many steps I gotta tell you
# bro, read the lore, there's no money in this game. You don't win money,
# you get resources, you get energy, or you get clout... you get some
# batteries or some medicine or some food or some duct tape and wood,
# it all just piles back up into the same resource number.")

## 1. HE IS RIGHT, AND HE ALREADY RULED THIS THREE WEEKS AGO
This is NOT a new ruling. laws/BOHEMIA_ADDENDUM_THREE_CURRENCIES_CENTURY_
7_26_26.md (Paolo 7/26, LOCKED) says it, and engine/bohemia_purse.js
implements it correctly today:
    RESOURCES    physical goods (apple = food, duct tape = materials;
                 a third icon is [PENDING Paolo])
    ELECTRICITY  batteries, tech
    CLOUT        producible by buildings, spendable in many ways
And the anti-reference is part of that law in his words: "games like that
are called spreadsheet simulators and I'm not a fan" — Civ-5 /
Surviving-the-Aftermath multi-currency feel is BANNED.
SO THE AGGREGATION HE JUST DESCRIBED IS ALREADY THE LAW: individual goods
are FICTION — what the world hands you and what a line of dialogue names
— and they pile into ONE counter. There is no food inventory beside a
wood inventory beside a duct-tape inventory. Three balances, one ledger.
ONE TAXONOMY NOTE SO NOBODY "FIXES" IT THE WRONG WAY: his 7/26 law puts
BATTERIES AND TECH under ELECTRICITY, not resources. His sentence today
listed batteries in the pile, but his point was aggregation, not
taxonomy, and the locked law already answers the taxonomy. Leave
batteries where his own law put them unless he says otherwise.
THE DRIFT IS OURS, NOT A MISSING RULING. That is the honest answer to
"how many steps I gotta tell you": zero more steps. He told us on 7/26.

## 2. THE AUDIT — IT LEAKED INTO SHIPPED PLAYER-FACING DIALOGUE
Money vocabulary in quests/bq/*.bq: **16 "money", 6 "currency", 1
"Coins"**, and several are lines a player READS, not comments:
- S02 `@SAY Smart. Quiet money spends the same as loud money and lives
  longer.`
- S02 `@OPT (take the money, say nothing)`
- S02 `@LOG Doubled it to the blues. Quiet money.`
- S05 `@SAY ... Bottom name is easy money, medicine on the barrel ...`
- S15 `@SAY ... Everybody keeps saying the money is coming ...`,
  `@SAY I do not care about the money. I have the money.`,
  `@LOG Took his money to keep the lights on ...`
A post-economic-apocalypse whose characters talk about money as a thing
they hold is the single most identity-breaking error available to us.

## 3. THE RULE, WITH THE DISTINCTION THAT KEEPS THE WRITING GOOD
A blanket word-ban would flatten good dialogue, so the test is what the
word REFERS TO:
- BANNED — money as a LITERAL THING in the world: taking it, having it,
  owing it, it arriving, paying in it. "Take the money" is wrong because
  there is nothing to take. Same for cash, dollars, coins, a wallet,
  "currency" spoken aloud.
- LEGAL — money as DEAD IDIOM in a person's mouth. Language outlives the
  thing it named: an older character saying "easy money" about a bounty
  that pays in medicine is CHARACTER, and arguably good character (the
  habits of a dead economy are exactly the texture this world wants).
  Use it deliberately, sparingly, and never where a literal reading is
  possible.
- THE REPLACEMENT IS NOT A WORD, IT IS THE GOOD: people say what they
  are actually being handed — medicine on the barrel, a case of batteries,
  half a tank, a roll of tape. That is also the dialogue craft card's
  SPECIFICITY rule (never the generic noun), so the fix makes the writing
  BETTER, not more careful.

## 4. THE ROT THIS AUDIT ALSO FOUND (a live contradiction, fixed same turn)
BOHEMIA_BACKLOG.md's WORLD EC item names the three currencies as
"medicine/electricity/resources" — WRONG TWICE (medicine is a GOOD, not a
currency, and CLOUT is missing entirely) and in direct contradiction with
his locked 7/26 law and the working code. A contradiction between two
live files is a BUG, not an interpretation choice. Corrected in place.

## 5. ROUTED
- QUESTS: sweep the 23 authored .bq for money-as-a-thing and rewrite
  those lines to name the actual good (§3). Drafted words, his to edit
  later as always — this is a correction to OUR drift, not a request for
  his time.
- SHARED / whoever ships first: THE NO-MONEY GATE. A word sweep over
  player-facing text (.bq @SAY/@OPT/@LOG, UI copy, item and quest names,
  the WORDS corpus) that fails on money/cash/dollar/coin/wallet used as a
  thing. The idiom exception is legal only with an inline citation of
  this record on the line, so an exception is a decision somebody made on
  purpose rather than a leak. New law, new gate, same turn.
- ALL DRAFT-WRITING LANES: this joins the dialogue craft card. You are
  never writing about money. You are writing about batteries, medicine,
  food, tape and wood — and they all land in one number.
- COORDINATOR: my own last reply said "money", "get paid", "spend money".
  That is the same drift, from the session whose whole job is catching
  drift. Corrected here and in the vocabulary the sweep now enforces.
