# TUNING -- [origin renown and relations] ORIGINS.JSON CARRIES NONE OF THE THREE STARTING STANDINGS (10/10/26)
# Row: VAMILY TUNING [origin renown and relations], MODE RESEARCH. Source: the Resources table on each of the fifteen origin pages (bb_all/, Category:Origins). Table: records/BOHEMIA_TUNING_ORIGIN_RENOWN_TABLE_10_10_26.json (draft).

## 1. THE WIKI GIVES THREE STARTING STANDINGS FOR EVERY ORIGIN
Renown (the company's fame), reputation (moral standing), relations (with the nearest noble houses). All fifteen pages carry all three.
- Renown: -100 (Peasant Militia) to 200 (Lone Wolf, Beast Slayers). Six start at 0; Northern Raiders -50.
- Reputation: Neutral for twelve. Oathtakers +60, Davkul Cultists -10, Northern Raiders -30.
- Relations: Neutral for eleven. Deserters -100 to the closest noble house; Northern Raiders -100 to the two closest; Band of Poachers -20; Peasant Militia +40 in the starting village.
- Trading Caravan also gains 34% less renown from every source (page line 58). origins.json already has this as a rule line.

## 2. WHAT WE HAVE
origins.json has NO renown, reputation or relations field on any of the fifteen (its keys: id, bb, name, line, difficulty, d, men, crowns, batteries, roster_cap, field_cap, pay, rules, source). So the demo cannot start any company with its fame or enemies. The table in records fills it, every row cited to its page.

## 3. FINDINGS
A. Three origins start with a debt of standing: Northern Raiders (renown -50, reputation -30, two houses -100), Deserters (-100 with one house), Peasant Militia (renown -100, but +40 in its village). These are the same rule-based hardness the earlier rows found, now with numbers. A difficulty tier does not need to touch them.
B. Start power from earlier rows ignores all of this; a company at -100 renown pays more for contracts it can reach less. The wiki gives no formula linking renown to prices, only to which contracts appear.
C. Faction mapping is OURS: "noble house" becomes a faction (rule: factions, COLOUR IS TERRITORY). PEOPLE and FACTIONS decide which of ours each -100 hits. TUNING only names the number.

## ROUTED
- PEOPLE [origins]: add renown, reputation, relations to origins.json from the table (data, not code).
- FACTIONS: which faction each noble-house standing lands on.
- Test material: VOTE page is draft:true.
