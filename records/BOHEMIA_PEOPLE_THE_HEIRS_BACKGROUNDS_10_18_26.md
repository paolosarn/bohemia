# THE HEIRS' BACKGROUNDS: A KID IS TAUGHT OR TOLD (PEOPLE, 10/18/26, row [heirs backgrounds] A-KILLER'S-KID-COMES-PREPARED, with DYNASTY [heirs]; a page under the hold, rule 88)

Bank: banks/BOHEMIA_HEIRS_BACKGROUNDS_10_18_26.json (draft:true, nothing live reads it).
Gate: gates/heirs_backgrounds_gate.js, HEIRS BACKGROUNDS in the suite.
The row's words (coordinator 9/29): "the backgrounds an HEIR can carry (a veteran's kid, an apprentice, a widow's son), which of the parent's traits pass and how many, the name that remembers the parent, the family's gear; the rule for a dead man still leaving an heir (survived the act, 60 days, or a family background; TUNING's rows)."

## 0. WHAT THE QUESTION IS, AND WHOSE HALF THIS IS

DYNASTY built the machine on 10/1 (engine/bohemia_heirs.js, e9c96db4): each act opens with the heirs of the last act's company, derived from the ledger and never stored. It already answers four of the row's six asks: the rule for a dead man still leaving an heir (SURVIVED, LONG_ENOUGH at 60 days, FAMILY; the main man never), the name (the parent's surname when the company ever asked his name, a whole name from the city's bank when not), the family's gear (it stays, 37g), and the age (15 to 35). What it does not answer is this lane's half: WHAT THE HEIR IS (his background) and WHICH OF THE PARENT'S TRAITS PASS. It answers those with one coin: `traitShare: 0.5` for every trait, and the parent's former trade copied onto the kid. This page designs the half that is a person's fact and builds nothing: the hold stands, so the test material is a bank the game does not read. Every number is TUNING's to replace.

## 1. HOW BATTLE BROTHERS DOES IT, READ OFF THE PAGE AND NOT FROM MEMORY

Battle Brothers has no heirs. It does have the one thing an heir is made of, a trade passing from one man to another, and it is strict about it. Read out of the library's tarball by the gate, byte for byte:

- **Apprentice Learns** (bb_all/0124_Apprentice Learns.txt): an Apprentice brother is trained by a Retired Soldier, Sellsword, Hedge Knight or Swordmaster brother. "The Apprentice needs to be level 4 or higher", "The teacher needs to be level 6 or higher", "The Apprentice can be trained only once at all", cooldown 90 days. What he gets is a FIXED package the teacher's background decides (the Swordmaster: +2-4 Melee Skill and +2-4 Melee Defense), never a copy of the teacher's traits.
- **Master No Use Apprentice** (bb_all/1251_Master No Use Apprentice.txt): "You come across a fencing master chewing out a student for his impatience." The apprentice arrives through his teacher's hand.
- **The Apprentice background** (bb_all/0123): +10% experience. That is the whole of it: the taught kid learns faster.
- **The Squire background** (bb_all/1861): "May learn from a hedge knight for +1-4 Resolve". The kid who carried for a fighter learns nerve, not a trade.
- **Traits** (bb_all/2024_Traits.txt): "New recruits to your mercenary company may have 0 to 2 randomly selected traits", and "Occasionally, new traits (such as "Fat") can be suffered through events". Some traits you are born with, some a life gives you. Hate for Beasts: "This trait cant be gained afterwards", so a hate is a thing you ARRIVE with.

So Battle Brothers' rule is: a trade passes by teaching, from a living teacher, once, as a package. Nothing passes from a dead man, and nothing passes by blood.

## 2. THE FINDING THAT PROVES US WRONG: NO HEIR WAS ALIVE THE DAY THE MONEY DIED, AND A DEAD MAN TEACHES NOTHING

**Every heir carries the parent's pre-crash trade, and none of them can have one.** A person's `was` in this game is what they were THE DAY THE MONEY DIED (engine/bohemia_people.js WAS_WORDS: dealt cards, ran the water plant, worked a ward). The next act opens 35 years on (the phone strip's +35Y) and an heir is 15 to 35 then, so the oldest heir was born the day the money died and every other one after it. Not one of them dealt a card. heirOf copies the parent's trade id onto the kid anyway: measured, 6,000 of 6,000 heirs across all fifteen trades carry it, including the four casino trades that died with the money.

**A dead man's kid learns his trade as often as a living teacher's.** heirOf puts the trade's learned skill (`keeps`: CAN KEEP SOMEBODY ALIVE, KNOWS WHAT IS SAFE TO DRINK) into the same coin as the traits. A man who SURVIVED leaves an APPRENTICE and a man who died leaves a KID, but the coin is keyed on the heir's id and never on why: measured, the skill passes to 49.7 percent of both (1,094 of 2,200 each), and on the same parent the two never differ (0 of 2,200). The word APPRENTICE changes nothing. Battle Brothers says only a living teacher teaches; the real world says the same (section 3).

**An earned trait passes by blood.** The flat 0.5 hands a kid his father's Addict and his father's Fat as often as his father's Huge: measured, 1,000 heirs of a Huge, Brave, Addict, Fat father carry the Addict or the Fat 49 percent of the time each (980 of 2,000). Battle Brothers makes Fat at a dinner table, by an event. A kid does not get his father's belly from his father's dinners.

**What survives of the row.** "A veteran's kid, an apprentice, a widow's son": yes, all three, and the split between them is exactly the one heirOf already computes and throws away (did the parent live to teach). "The name that remembers the parent", "the family's gear", "the rule for a dead man still leaving an heir": already built by DYNASTY and right; this page leaves them alone.

## 3. THE REAL WORLD UNDER IT, WHICH IS WHERE THE NUMBERS COME FROM

- **How often a son takes his father's work.** The US Census Bureau's Lifetime Occupational Mobility of Adult Males, March 1962 (P23-11, 1964): 23 percent of men 25 to 64 worked in the same MAJOR GROUP as their father; about 41 percent of professionals' sons; 10 to 15 percent of the sons of clerical, sales, service and labouring fathers. Those are groups, so the same-trade number is lower, never higher. (Read through search text; the report did not open from this container. Said so in the bank.)
- **How often a trait passes.** Vukasovic and Bratko's 2015 meta-analysis (62 effect sizes, over 100,000 people): personality is about 40 percent heritable (twins .47, families and adoptions .22). A parent and child share half their genes, so for an additive trait the parent-child match is about half the heritability (the standard quantitative-genetics result, from memory, said so): a temperament passes at about .20, a strongly heritable body trait (height, about .8 heritable, from memory) at about .40. Drinking risk runs in families (alcohol use disorder about .5 heritable in twin studies, from memory), so Drunkard is a temperament here, not a habit.
- **A trade is taught by a living hand.** Apprenticeship is the oldest way a trade moved and it needs the master alive and present for years; Battle Brothers' own rule (level 6 teacher, level 4 apprentice, once) is that, in game shape.

## 4. THE DESIGN (the bank's rows)

**What an heir is: four backgrounds, picked by two facts heirOf already has (did the parent live, and did the trade survive the money).**

| background | when | carries |
|---|---|---|
| THE APPRENTICE | the parent SURVIVED, the trade keeps something, and the kid took it (the trade's share, below) | the trade and its skill, TAUGHT, always; +10% experience is Battle Brothers' word for it |
| THE CAMP KID | the parent SURVIVED and the kid did not take the trade | no trade; grew up in the carts carrying; the Squire's nerve |
| RAISED BY THE ONE LEFT | the parent DIED (60 days in, or a family background) | no trade, no skill: nobody was there to teach it; he knows his father from stories |
| THE KID OF A DEAD TRADE | the parent's trade kept nothing (dealer, valet, pit, floor) | the trade is a story, never a skill |

**How often the kid takes the trade.** The Census shares, mapped by this lane: the five skilled trades (boilers, high voltage, the water plant, the ward, the school) at 41 percent; the three crafts (concrete, the cab, engines) at the all-groups 23 percent because no craft figure was read; kitchen, laundry and docks at 12.5 percent; the four casino trades at 0, because there is no deck and no work. Weighted by the city's own mix of trades (29 percent hospitality, WAS_HOSPITALITY_SHARE), a survivor's kid takes the trade about 26 percent of the time, which lands next to the Census's 23. Today it is 100.

**Which traits pass.** Every one of Battle Brothers' 74 traits, read off its Traits page by the gate, in one of four classes: BODY (Huge, Strong, Iron Lungs, Eagle Eyes, Night Blind and fifteen more) passes at .40 each; MIND (Brave, Craven, Greedy, Loyal, Drunkard and twenty-two more) at .20; EARNED (Fat, Addict, Old, every Fear and Hate, every Davkul, the arena's, the gladiators' Glorious, Survivor, Mad, 26 in all) at 0; CHANCE (Lucky) at 0. A father with two body and two mind traits leaves a kid 1.2 of them on average where the flat coin leaves 2.0, and the 1.2 are the right ones.

**What a death leaves.** Battle Brothers' hates are arrived with, never gained after. So the one thing a dead man's death can hand his kid is a hate: a father killed by a beast leaves a kid with Hate for Beasts. One row only, until COMBAT names what killed a man (ctHeirDied carries no cause yet).

**What the heir's `was` is.** Null. Nobody born after the money died was anything the day it died. What he is lives in `grew_up` and `took`.

**What he says.** One line each, the heir's own mouth, draft, Spanglish where he is the kind: "Mi papá me enseñó con las manos. He made me do it till I did it without looking." / "I grew up holding his rifle while he slept. No sé hacer nada más." / "Lo conocí por las historias. They say I walk like him. I would not know." / "My mother dealt cards in a place with a ceiling painted like the sky. I have never seen a card table." Nothing fires in the first minute; an heir only exists after the flip.

## 5. WHAT THE BOOK AND THE RECORD CANNOT ANSWER FOR US, NAMED NOT FUDGED

- The Census is 1962 America and major groups; the valley after the money died is neither. The shares are a floor of realism, not a measurement of Bohemia, and TUNING may move them.
- The .40 and .20 are parent-child matches for continuous traits read as a yes/no chance; a binary trait with low prevalence passes less often than its correlation. Drafted as shares for TUNING, said so.
- No trait is live yet (engine/bohemia_goodbros.js says "no master Battle Brothers trait list exists" and ships recruits without traits). THE MASTER LIST EXISTS: bb_all/2024_Traits.txt lists 74 and the gate reads them. That comment is this lane's own (good bros, 10/9) and wrong; it is fixed when the hold lifts, with the post.

## 6. BETTER THAN BATTLE BROTHERS (rule 80, this page's line)

A KID IS TAUGHT OR TOLD. Battle Brothers has no children at all: a brother dies and his line is a name on a list. Ours: the man who lived to the end of the act taught his kid the trade (or the kid ran off to the carts), the man who died left a kid who knows him from stories and, if a beast killed him, hates beasts; a body passes, a temper half as often, a habit never; and the casino dealer's daughter has never seen a card table. Line 24 of records/BOHEMIA_BETTER_THAN_BATTLE_BROTHERS_10_9_26.md.

## 7. ROUTED

- DYNASTY [heirs]: heirOf's `was` should be null and its one 0.5 coin should read this bank's classes and the WHY it is already handed (a survived parent teaches, a dead one does not). This lane builds the person's half when the hold lifts; DYNASTY owns the file.
- TUNING [recruit odds]: the four shares (.40 / .20 / 0 / 0) and the fifteen trade shares are rows to replace.
- COMBAT: ctHeirDied needs a cause (what killed him) for death_leaves to fire.
- PEOPLE (this lane) when the hold lifts: the post's recruits get traits from the 74 (good bros' wrong comment), and the heirs read the same list.
- WORDS: the four heir lines are drafts.

## 8. [bb school] AND [analog horror]

[bb heirs]: Battle Brothers moves a trade only by a living teacher, once, as a fixed package (Apprentice Learns: level 6 teacher, level 4 apprentice, cooldown 90), and it lets nothing pass by blood. We keep the teacher rule and add the blood Battle Brothers never had, at the real rates, and the one thing a death hands down is the hate Battle Brothers says you can only arrive with.

[ah]: the horror is the dealer's daughter shuffling an empty hand at the fire because her mother did; a boy who knows his father's limp from stories and walks with it anyway; a man's tools handed to a kid who was never shown how to hold them, kept clean on a shelf for thirty-five years.

## 9. GATE

gates/heirs_backgrounds_gate.js, HEIRS BACKGROUNDS in the suite. A: a draft bank, four backgrounds, unique ids, tuned false, every heir's was null. B: every Battle Brothers quote found byte for byte on its own page read out of the tarball at gate time, with planted wrong text as the negative controls. C: every trait on the Traits page in exactly one class, no invented trait, EARNED and CHANCE pass nothing, a body above a temperament and both under half. D: all fifteen WAS_WORDS trades have a share, every dead trade 0, none over 41 percent. E: THE MEASURED GAP HOLDS (every heir carries the parent's pre-crash trade; a dead man's kid keeps the skill exactly as often as a living teacher's; an earned trait passes about half the time; the flat 0.5): the leg goes red the day the page is built, and then this page is rewritten. F: nothing live reads the bank. G: the page, its ROUTED section, its [bb heirs] and [ah] lines, the shared better-than line; no VOTE item. H: every line is the heir speaking; nothing in the first minute.
