# BB STUDY, DAY 1 — THE CONTRACT ECONOMY
# (8/28/26, coordinator. Question: how does Battle Brothers decide what
# work exists, who offers it, what it pays, and why it escalates? And
# what of that lands on our phone feed?)

## 1. WHAT BATTLE BROTHERS ACTUALLY DOES — AND ONE DISTINCTION IS THE
## WHOLE DAY
- **CONTRACT DIFFICULTY** scales on: time elapsed, the strength of your
  roster, the contract's own skull rating, the contract TYPE, and factors
  specific to the type (an escort gets harder the further you travel,
  because distance is more chances to meet something).
- **RENOWN DOES NOT FACTOR INTO DIFFICULTY AT ALL.** It factors heavily
  into REWARD, and into WHICH CONTRACTS YOU ARE OFFERED.
- Contract types carry an inherent value: "return item" sits at 400,
  "find artifact" at 2,000.
- **AMBITIONS** are the early-game renown engine, and their stated purpose
  is to unlock a tier — reaching 'Professional' renown is what opens
  NOBLE contracts.
- **MORAL REPUTATION IS A SEPARATE AXIS FROM FACTION RELATIONS.** How
  people know you to ACT (bloodthirsty, or kind and merciful) is tracked
  apart from whether a given faction likes you.
### *** THE FINDING: RENOWN GATES THE OFFER, NOT THE DIFFICULTY. ***
This is the design choice most games get wrong and it is worth stating in
one line: **the world's opinion of you changes WHAT YOU ARE ALLOWED TO
ATTEMPT, and what it pays. It does not change how hard the world hits
you.**
Compare the usual approach, where reputation quietly scales enemy power —
which players experience as being PUNISHED for succeeding, and which makes
progress feel like running on a treadmill. BB separates the two cleanly.
Difficulty comes from time and from the roster you actually built.
Reputation comes from who trusts you.
**FOR US THIS IS FREE AND IT COMPOSES WITH TWO LAWS WE ALREADY HAVE:**
NO DAMAGE BEFORE THE DIAL means we are not scaling enemy numbers on
reputation anyway, and EVERYTHING COSTS ONE means the reward side is a
number he sets later. **What we can build NOW, with no numbers at all, is
the OFFER GATE.**

## 2. THE MEASUREMENT — WHAT WE HAVE, AND THE HOLE
Checked with a positive control before claiming anything absent.
- **THE FACTION GRAPH IS REAL AND RICH.** engine/BOHEMIA_faction_graph.json
  is his own GDD §9 data; FactionCanon encodes it into initial standings
  plus PERMANENT CONSTRAINTS, and every write goes through a wrapped
  `shiftStanding` so no raw call can break canon. 14 selectable factions
  are placed on real generated districts.
- **THE PLAYER IS NOT IN IT.** `shiftStanding(aId, bId, ...)` is
  faction-to-faction. Zero hits for a player node in the graph.
  (Positive control: the graph's keys ARE readable and the ids ARE there,
  so the instrument works — the player is genuinely absent, not hidden.)
- **THE FEED DOES NOT GATE ON REPUTATION.** The one thing that decides a
  quest's channel is PHONELESS — whether the person owns a phone. That is
  a good rule and it is his. It is not an opinion about the player.
**SO: FACTIONS HAVE OPINIONS ABOUT EACH OTHER, AND NOBODY IN THE VALLEY
HAS AN OPINION ABOUT YOU.** That is the hole, and it is exactly the hole
he described as "missing a little bit of this, like, city soul."

## 3. THE OTHER AISLE — REPUTATION WHERE THERE IS NO LAW
This is our world precisely: no money, no courts, work passed hand to
hand. The foundational study is Avner Greif's "Reputation and Coalitions
in Medieval Trade: Evidence on the Maghribi Traders" (Journal of Economic
History, 1989), which reads eleventh-century Geniza documents and argues
that traders with **no effective legal contract enforcement** solved it
with a COALITION: an economic institution built on reputation, where
cheating an agent got you collectively ostracised by everybody.
### *** AND HERE IS THE FINDING THAT CHALLENGES WHAT WE BELIEVE, BECAUSE
### THE TIDY VERSION HAS BEEN ATTACKED AND IT DID NOT SURVIVE INTACT ***
Later scholarship went back to the same documents and found the coalition
story does not hold up: **"not a single empirical example adduced as
evidence of the putative coalition shows that a coalition actually
existed,"** and the traders **did use the formal legal system** to enforce
agency agreements.
What DID survive the attack is smaller and, for us, better:
> "A subset of the traders did form a **web of trusted business
> associates** that contributed to informal contract enforcement, but this
> was very different from the hypothesised coalition, in **neither being
> exclusive nor having a clearly defined membership.**"
**SO THE OBVIOUS DESIGN IS THE WRONG SHAPE.** The obvious design is a
RENOWN BAR — one number, everybody reads it, it goes up. That is the
coalition story, and the coalition story is the part that failed peer
review.
**WHAT THE EVIDENCE ACTUALLY SUPPORTS IS A WEB OF WHO VOUCHES FOR YOU:
not exclusive, no clear membership, and different people know different
things about you.** Which is also just true of how work gets passed
around in the real world today, and it is far more interesting to play.

## 4. WHAT THAT MEANS FOR BOHEMIA, IN PLAIN TERMS
- **NOT ONE NUMBER. WHO KNOWS YOU.** A job comes from a PERSON, and that
  person heard about you from someone. The question a fight or a favour
  answers is not "did my bar go up" but "who will vouch for me now."
- **AND WE ALREADY HAVE THE MACHINERY, UNUSED.** The faction graph with
  its canon constraints is a web. The people module already names anybody
  from an identity key. Households shipped this week, so people already
  share roofs. The feed already knows who is reachable and who is not.
  **NONE OF IT POINTS AT THE PLAYER YET.**
- **TWO AXES, NOT ONE**, because BB separates them and the separation is
  what makes it readable: WHO TRUSTS YOU (a web, per person and per
  faction) and WHAT PEOPLE KNOW YOU TO DO (the moral axis — are you the
  one who finishes, or the one who takes the money and runs, except there
  is no money here).
- **THE OFFER IS THE LEVER, NOT THE DIFFICULTY.** BB's cleanest idea.
  Reputation changes what appears on the phone and what a person is
  willing to hand you. It never changes how hard a fight is. That keeps
  NO DAMAGE BEFORE THE DIAL untouched and it means this whole system can
  be built with zero balance numbers.

## 5. WHAT I WOULD ROUTE ON DAY 5 (not routed today, per his order)
- The player becomes a node in the standing graph.
- The feed gates its offers on who vouches for you, not only on who owns
  a phone.
- A second axis for what you are known to DO, kept separate from who
  likes you.
- Every one of those is mechanism, and every number in them is his.

## 6. CONFIDENCE
- BB's renown/difficulty split and the contract type values: community
  wiki and player-verified discussion, consistent across sources.
  **MEDIUM-HIGH.** The developer blog itself is proxy-blocked from this
  environment (battlebrothersgame.com refused), which is worth saying out
  loud rather than pretending I read it.
- The faction graph being real and the player being absent from it: read
  in the source, with a positive control. **HIGH.**
- Greif 1989 and the later challenge to it: published and citable, and I
  have given the challenge more room than the original because it is the
  part that changes our design. **HIGH.**
- That a web plays better than a bar: my argument, not a finding.

## SOURCES
Avner Greif, "Reputation and Coalitions in Medieval Trade: Evidence on the
Maghribi Traders," Journal of Economic History 49:4 (1989); "Enforcing
Cooperation Among Medieval Merchants: The Maghribi Traders Revisited" for
the empirical challenge. Battle Brothers wiki (Game Mechanics, Game
Guide) and Steam discussion threads on difficulty scaling and ambitions.
In-repo: engine/BOHEMIA_faction_graph.json, engine/bohemia_loop.js
(bootFactions, the wrapped shiftStanding, the PHONELESS channel rule),
laws/BOHEMIA_ADDENDUM_YOU_ARE_THE_LEAD_8_28_26.md.
