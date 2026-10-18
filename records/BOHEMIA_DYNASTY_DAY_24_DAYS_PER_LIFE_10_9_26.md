# HOW MANY LIVED DAYS MAKE A GENERATION FEEL LIKE A LIFE
DYNASTY, row [days per life] (Q22). 10/9/26. MODE: SCHOOL (one record, no code). Real-world and craft numbers tagged (recall).

## 0. THE FINDING THAT PROVES THE ROW'S PREMISE WRONG
The row says '130 days a generation, a season each'. Measured on the repo: **there is no season in the game.** bohemia_dayloop.js has a 1,440-minute day and a night history capped at 30 ('a month of nights is plenty'); the economy and daycycle modules hold no calendar and no year; nothing counts a season. And the game keeps only 30 nights of history, so of an act's 130 days the ledger remembers the last 30 in detail (the century and deed ledgers keep totals, not days). So 'a season each' is a sentence, not a feature: a player lives 130 days and nothing tells him a season passed. (The 9/7 clock record's arithmetic of 400 days across 100 hours stands; it is the felt part that is missing.)

## 1. HOW THE BEST LONG GAMES MAKE A SHORT SPAN FEEL LIKE YEARS (recall)
- THE CALENDAR IS A CLOCK THE PLAYER READS: a year of four seasons in about 112 days (Stardew's 28-day seasons) is a game where players say they 'lived years'. The span is short; the markers (a season name, weather, what is in the shops) are what make it long.
- BATTLE BROTHERS: a campaign has no years at all. The day counter and the crisis around day 100 (rule 49, the Grok sheets) do the work, and the company changes (men die, gear improves) so the days feel like history.
- SKIP-AND-TELL: what is skipped is replaced by a report of change (what the town looks like now, who is gone). The skip is felt by the DIFFERENCE, not by the length.

## 2. REAL MEMORY (recall)
A person does not remember days, they remember events. Autobiographical memory is dense for the years 10 to 30 (the reminiscence bump) and holds a few hundred distinct episodes a decade, with a floating gap in the middle (the same Vansina gap as Q20). So **a life feels long when it has dozens of distinct, named moments**, not when it has many days.

## 3. THE DAY COUNT AND WHAT THE SKIP IS MADE OF (proposal, draft:true, TUNING's)
- DAYS A GENERATION: keep 130 lived days (about 15 real minutes a day, rule from 9/7) and give it a year: four SEASONS of about 32 days each (a compressed Mojave year: the heat of summer, the cold nights of winter), so an act is one felt year and the three acts are three years at 35 years apart. The season is what the player reads.
- AT LEAST ONE MEMORABLE EVENT IN EVERY FOUR DAYS (about 30 an act): a fight, a death, a base taken, a face, a quest ending, the flip. Each gets a name in the feed so it can be told later (the legend line from Q20 is chosen from these).
- THE SKIP BETWEEN ACTS (35 years, told not walked) IS MADE OF FOUR REPORTS, all derived, none authored: what the valley looks like now (the derive and the act-state table), who is left (heirs, the 42 percent), what the valley still says of you (one legend line, a little wrong), and what you left standing (the wall's names).
- THE LEDGER MUST KEEP THE NAMED EVENTS, not 30 nights: a record of at most about 30 named moments an act, a few kilobytes.

## 4. ROUTED
PLUMBER [clock math]: the season counter and the real-minutes-per-day measure; WORLD: season in the weather and the stalls; UI: the season name on the phone; PEOPLE/FEED: a named-event kind; TUNING: 130, 4 seasons, 1 event in 4.

[PENDING Paolo], not blocking: is one felt year per act, in four seasons, the right shape?
