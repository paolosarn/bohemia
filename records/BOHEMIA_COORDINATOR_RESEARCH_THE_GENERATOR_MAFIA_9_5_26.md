# THE GENERATOR MAFIA: WHAT A FACTION THAT OWNS THE POWER ACTUALLY DOES (coordinator research round, 9/5/26)
# Paolo, this round: "are you doing big brain online research and own insight to make new jobs, or are you just reporting?" Both, from now on, every round. This is the swing.

## THE QUESTION
Batteries are the money (9/4) and buildings make them (9/5). Each part of Vegas is owned by a faction, fortress to camp (9/4). So what does a faction that owns the electricity in a neighbourhood actually DO with that, in the real world, when the state has collapsed? Not a guess: two countries have lived it for thirty years.

## AISLE ONE: THE REAL WORLD
**Lebanon.** Since the civil war, and totally since the state went bankrupt in 2019-20, neighbourhood electricity comes from private diesel generators. One 500 kVA generator feeds about 300 homes. The rules on the ground:
- Territory is divided among generator owners. You cannot subscribe outside your neighbourhood's owner, even if you are in a dispute with him.
- You pay by the AMPERE you are allowed to draw, monthly, unmetered for years (the owner says how many hours he ran).
- The owner sets the price, decides who gets a line, and can cut you off without warning.
- The bill was about 44% of an average household's monthly income in 2023, and about 88% for the poorest.
- Residents who wanted out organised rooftop solar together; the owners fought it, the press calls them the "generator mafia," and where solar won, the mafia's grip broke.
**Iraq.** 55,000 to 80,000 neighbourhood generators, 100 to 500 kVA each, on small isolated wires. A breaker at the generator caps each house at the amperes it pays for. The owners are tied into parties, ministries, tribes and militias; people fear a dispute with the owner because a militia may answer it.
Sources: [Raseef22: how private generator owners own Lebanon's electricity](https://raseef22.net/english/article/1092975-no-power-to-the-people-how-private-generator-owners-own-lebanons-electricity), [Raseef22: killer generators](https://raseef22.net/english/article/1101444-killer-generators-lebanons-unchecked-electricity-mafia-acts-above-the-law), [L'Orient Today: the residents who said no to the generator mafia](https://today.lorientlejour.com/article/1318136/the-residents-who-said-no-to-the-generator-mafia.html), [TCF: solar killed dirty energy in rural Lebanon](https://tcf.org/content/report/solar-killed-dirty-energy-in-rural-lebanon-heres-what-other-countries-can-learn/), [IntechOpen: neighbourhood diesel generators in Iraq](https://www.intechopen.com/chapters/74439), [Shafaq: private generator owners strangle Baghdad](https://shafaq.com/en/Report/With-a-complex-network-of-powerful-ties-private-generator-owners-strangle-the-citizens-of-Baghdad).

## AISLE TWO: THE BEST GAMES
Territory games pay the holder a recurring income from the land, and the attacker invades for exactly that income; the design tension is that defending the land must not cost more than the land pays. Taking a point does two things at once: it removes the enemy's income and adds to yours. Sources: [Game Developer: the balance of power in RTS](https://www.gamedeveloper.com/design/the-balance-of-power-progression-and-equilibrium-in-real-time-strategy-games), [Wayward Strategy: multiple means of generating resources](https://waywardstrategy.com/2022/01/23/food-gold-and-beyond/).

## THE FINDING THAT CHALLENGES WHAT WE BELIEVE
We had the power flowing one way: a faction's buildings make batteries for the faction. Reality says the bigger money is the other way: the faction that owns the block's generator CHARGES EVERY HOUSEHOLD ON THE BLOCK, monthly, by the ampere, and it is the single largest bill a family pays, and it can be cut without warning. That is the crash simulator's drain, and nobody has built it. It also gives Paolo's "set up your own buildings and auto-mine batteries" its real-world meaning: the residents who built their own solar were buying their way OUT of the block's owner. Your own power building is not just income. It is independence from the faction, and the faction knows it.

## MEASURED AGAINST OUR REPO
- The four verbs and three currencies (day 23) name PAY as a verb; nothing in the build charges a resident for living on a block. `PRICES = {}` still ships empty with everything at one.
- The production tick shipped this round (c9504be); it pays owners, it charges nobody.
- Factions carry act1_power/act3_power (towns law); no faction has an income line.

## ROUTED (the jobs this makes)
- FACTIONS [block rent]: the faction that owns a block charges everyone on it, monthly, in batteries; it can cut a block off; a fortress charges more than a camp.
- WORLD [own power]: your own power building takes you off the block's line; the faction notices.
- ECONOMY Q14 [rent share]: what share of income the local power boss takes in real collapses, and what number makes it hurt but stay fun.
- WORDS Q16 [cut off]: how the collector talks, how the cut-off is said, from real testimony.
