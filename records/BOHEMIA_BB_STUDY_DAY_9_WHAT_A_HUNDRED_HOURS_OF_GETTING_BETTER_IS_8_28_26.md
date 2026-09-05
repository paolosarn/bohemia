# BB STUDY — DAY 9: WHAT A HUNDRED HOURS OF GETTING BETTER IS MADE OF
# (coordinator, on his trigger. Days 1-8: records/BOHEMIA_BB_STUDY_DAY_*.md)
# THE SUBJECT: PROGRESSION. And it lands on a LOCKED pillar, so read §3.

## 0. THE QUESTION
He has ruled a FULL GAME, ~100 HOURS TO COMPLETE, with a PERSISTENT
experience tree and 60 mini bosses. So: **what is a hundred hours of
getting better actually made of?** Bigger numbers, or more things you can
do? Nobody in nine days has asked, and his own two answers disagree.

## 1. BB'S ANSWER: PROGRESSION THAT DELIBERATELY STOPS
- **One perk point per level, and three attribute rolls.** That is the
  whole of it.
- **The soft cap is level 11.** Past it are "veteran levels" that cost
  4000 + 1000 per level of XP and award **NO perk point**, with attribute
  rolls cut to a maximum of +1.
- So a man's entire career is **ELEVEN CHOICES.** After that he is done.
- Its own players say what that feels like: *"Hitting the level cap
  currently feels so final. After that there is nowhere to go for your
  sellswords and they usually end up being sidelined until getting
  replaced by a new recruit with better starting talents."*
### AND THAT SENTENCE IS THE WHOLE PROBLEM FOR US
**BB SOLVES "NOTHING LEFT TO GROW" BY REPLACING THE PERSON.** The roster
turns over (day 8), so the campaign keeps producing new growth even
though no individual has any left.
**WE CANNOT DO THAT.** The player is one character, and across the fold
he is a dynasty that INHERITS everything rather than restarting. Nobody
gets sidelined and replaced by a better recruit. **So the thing BB leans
on to survive its own flat ceiling is the one thing our design forbids.**

## 2. THE SHELF, MEASURED — AND I ALMOST FILED A FALSE NEGATIVE AGAIN
`laws/BOHEMIA_ADDENDUM_PERKS_ABILITIES_7_1_26.md` is a real catalogue of
abilities and perks and it says, in its own header, **"NOTHING here is
built."** On the walked surface: standalone `xp` **0 hits**, and `perk`
**1 hit, inside a base64 image blob.**
**THAT WOULD HAVE BEEN THE FINDING, AND IT IS WRONG.** Decode the fight
(day 4's rule: a plain search of the alpha cannot see it) and:
- **A PERK TREE IS SHIPPED.** `const TREE={xp:0,spent:[]}`, `XP_PER_LEVEL
  =120`, `treeLevel()`, a spend UI reading **XP / LEVEL / POINTS**, saved
  to `localStorage['bohemia.tree']`, read back on load, applied at the top
  of every fight, wrapped in try/catch so an opaque origin forgets rather
  than throws. Every name `[draft:true]`, because what a perk is CALLED is
  his.
- **NINE PERKS, THREE BRANCHES** (BODY / EYE / HAND), three rungs each.
- **AND THE 7/1 LAW IS NOW STALE.** It says nothing is built; something
  is. That is exactly the class of rot the truth hierarchy exists to kill,
  and it is fixed at the source this turn rather than left for the next
  session to trip over.
### *** AND THE TREE'S OWN COMMENT SAYS WHAT SHAPE IT IS ***
> *"seven of these nine perks need no new mechanic at all. **They move a
> number a shipped system already reads.**"*
Written as a virtue, and as engineering it IS one: seven perks for free.
But read it as design and it is the diagnosis. Two of nine do something
new (men break and run from you; one kit item is armed at the bell). The
other seven are +1.
### AND THE SEVENTH INSTANCE OF THIS STUDY'S SHAPE, WHICH IS A BROADCAST
### INTO AN EMPTY ROOM
The boss keys — the whole point of A BOSS HANDS YOU A VERB — are
published **twice**, deliberately, with the reason written beside them:
> *"PUBLISHED to the parent window so CITY, RUN and QUESTS can read what
> you hold without knowing a thing about combat."*
`window.bohemiaKeys = ...` and `parent.postMessage({bohemiaKeys:...})`.
**NOTHING READS EITHER ONE.** `bohemiaKeys` is **0 hits in the walked
city and 0 in the alpha shell.** Positive control: the alpha handles
**twenty** message types (BOHEMIA_COMBAT_END, BOHEMIA_STEP,
BOHEMIA_STANDING_FACTS and seventeen more), so the listener is real and
works — and the keys message carries **no `type` field at all**, so no
type-based handler could ever pick it up.
**THE VERBS THE BOSSES HAND YOU DO NOT LEAVE THE FIGHT.**

## 3. *** THE FINDING THAT CHALLENGES WHAT WE BELIEVE: HIS TWO REFERENCE
## SETS DISAGREE ABOUT PROGRESSION, AND NOBODY HAS FLAGGED IT ***
Both of these are LOCKED, both are at the top of CLAUDE.md, and they are
opposite philosophies:
- **"A PERSISTENT experience tree (his reference: Cyberpunk / Elder
  Scrolls perks and bonuses)"**, across ~100 hours. Those are POWER
  trees. You end them meaningfully stronger than you started; that is
  what they are for.
- **BATTLE BROTHERS**, whose progression is eleven choices and a hard
  stop, and whose entire feel is that a veteran is still killable.
**A HUNDRED HOURS OF CYBERPUNK-STYLE BONUSES AND A FIGHT WHERE A GOOD MAN
STILL DIES CANNOT BOTH SURVIVE IF GROWTH IS VERTICAL.** Numbers that go
up for a hundred hours end the danger. That is not a taste claim, it is
arithmetic, and it collides with NO DAMAGE BEFORE THE DIAL from the other
side too: we are not allowed to tune the numbers that would hold it
together.
### AND THE RESOLUTION IS ALREADY HIS, IN THE SAME PARAGRAPH
> **"60 MINI BOSSES that each hand you A NEW WAY TO INTERACT WITH
> BOHEMIA."**
**THAT IS A HORIZONTAL TREE.** Not "+8% damage" sixty times: sixty new
VERBS. A verb tree grows for a hundred hours without ending the danger,
because a new option does not make a bullet hurt less. His ladder already
holds 53 written out, name and hold and lock and grant, and the game
already parses that file at build time.
**SO THE TWO REFERENCES WERE NEVER IN CONFLICT — THE TREE IS CYBERPUNK-
SIZED AND BATTLE-BROTHERS-FLAT AT THE SAME TIME, BECAUSE IT GROWS
SIDEWAYS.** Somebody just has to write that down, because the shipped
tree is drifting the other way at seven perks out of nine.

## 4. THE OTHER AISLE — WHAT GETTING BETTER ACTUALLY IS
The best-studied case of human expertise is chess, and the finding is not
what people assume.
- **Masters have ORDINARY working memory.** Their span is normal.
- What they have is **CHUNKS**: thousands of learned patterns, so a board
  arrives as a few meaningful groups instead of thirty-two pieces.
  Measured chunk sizes for masters run far larger than novices'.
- ***AND THE DETAIL THAT DECIDES OUR DESIGN: THE ADVANTAGE DISAPPEARS ON
  RANDOM BOARDS.*** Better players recall far more from a real position
  and no more than anyone else from a meaningless one. Their edge is not
  capacity. **It is recognition.**
**SO EXPERTISE IS NOT BEING MORE. IT IS SEEING MORE.** An expert does not
have faster hands; they have more situations they recognise and more
answers attached to them.
### THE TEST THAT FALLS OUT, AND IT IS CHEAP TO APPLY
**A PERK THAT GIVES YOU SOMETHING NEW TO SEE OR DO IS MASTERY. A PERK
THAT RAISES A NUMBER IS A STAT.** By its own comment, ours is seven stats
and two verbs. The ratio should be the other way around, and his boss
ladder is already sitting there full of the other kind.

## 5. THE ARITHMETIC NOBODY HAD DONE
- **100 hours** to complete. **60** boss verbs ruled, **53** written out.
- **9** perks shipped, **7** of them a number.
If growth is numbers: a hundred hours of +1 on one character, in a game
where nobody is allowed to set a damage dial, is unbuildable and
unbalanceable, and it kills the danger that makes the fight worth having.
If growth is verbs: **we are already most of the way there and it is
written in his own document.** The gap is not design, it is that the
verbs cannot leave the fight (§2) and the tree has been growing the wrong
kind of rung.

## 6. WHAT WE TAKE, AND WHAT WE REFUSE
**TAKE:** growth that is mostly SIDEWAYS — new verbs, new reads, new
options; a ceiling on the number half, so a veteran stays killable; and
the boss grant as the main engine of progression, because it is already
written and it is already the right shape.
**REFUSE:** a hundred hours of stat bonuses on one character; a tree that
needs a damage dial to be balanced, since we do not have one and will not
invent it; replacing the person when they stop growing, which is BB's
answer and is forbidden here; and a second progression list — the tree,
the 7/1 abilities catalogue and the boss grants are ONE system by his own
words and are three documents today.

## 7. ROUTED
- **COMBAT — BB-VERB-TREE.** The tree's next rungs are VERBS, not
  numbers. Its own comment measures the current ratio at seven of nine;
  invert it. A rung should give a new thing to do or a new thing to see.
  Names stay `draft:true`, numbers stay his.
- **SHARED — BB-KEYS-LAND.** Somebody has to READ `window.bohemiaKeys` /
  the `{bohemiaKeys}` message. It is published twice, on purpose, with a
  comment naming CITY, RUN and QUESTS as the intended readers, and it has
  **zero** readers. Note for whoever takes it: the message has no `type`
  field, so it will need one or a dedicated listener. Until this lands, a
  boss's grant does not exist outside the fight.
- **COMBAT / SHARED — BB-ONE-LADDER.** CLAUDE.md says the tree, the
  abilities and the bosses are ONE system, not three. Today they are three
  lists in three places, and the oldest one said nothing was built. Make
  the boss grant and the tree rung the same kind of object before either
  grows further, so we do not end up reconciling two progressions later.
- **DONE THIS TURN, NOT ROUTED:** the 7/1 perks-and-abilities law carried
  "NOTHING here is built" over a shipped tree. Corrected at the source
  with a dated note, per the truth hierarchy.
**RUNNING ORDER:** behind the demo, as always. BB-KEYS-LAND is the small
one and it is the one that makes the boss law true outside the arena.

## 8. CONFIDENCE
- The shipped tree, its nine perks, `XP_PER_LEVEL`, the storage, the
  "seven of nine" comment, and the unread keys: **MEASURED** in the
  decoded combat payload and the alpha shell, with the twenty-message-type
  positive control stated.
- **A CAUTION I NEARLY FELL FOR AND AM RECORDING:** `myLvl()` in the
  fight is a FLOOR, not a character level (it sits beside `deckSlabAt` and
  `underDeckMe`). Do not read it as progression.
- BB's one-perk-per-level, the level 11 soft cap, veteran levels awarding
  no perk point, and the player quote about the cap feeling final: wiki
  and the developers' own forum; the dev blog itself is proxy-blocked here
  and was NOT read. **MEDIUM-HIGH.**
- The chess expertise findings (ordinary working memory, chunking, the
  advantage vanishing on random boards): foundational, replicated, and
  still argued over at the edges. **HIGH** for the core result.
- §3's collision, §5's arithmetic, §6 and §7: **MY ARGUMENT AND MY
  ROUTING.** That the two references collide is a reading of two locked
  lines; the resolution is his own sentence, not mine.

## SOURCES
Battle Brothers wiki (Level and Experience, Perks, Attributes, Game
Mechanics) and the developers' own forum thread on a soft level cap, for
one perk point per level, three attribute rolls, the level 11 soft cap,
veteran levels costing 4000+1000 per level with no perk point and +1
rolls, and the player account of the cap feeling final. Chase & Simon,
"Perception in Chess" (1973) and de Groot's earlier work, plus Gobet &
Simon, "Expert Chess Memory: Revisiting the Chunking Hypothesis" (Memory,
1998), for ordinary working memory, chunk size, and the loss of advantage
on random boards. IN-REPO: the decoded `COMBAT_B64` payload inside
slices/BOHEMIA_ALPHA_0_9.html (TREE, PERKS, KEYS, keysPublish),
slices/BOHEMIA_ALPHA_0_9.html (the message handlers),
slices/BOHEMIA_CITY_WORLD.html, laws/BOHEMIA_ADDENDUM_PERKS_ABILITIES_
7_1_26.md, laws/BOHEMIA_LAW_A_BOSS_HANDS_YOU_A_VERB_8_27_26.md,
records/BOHEMIA_THE_BOSS_LADDER_v7_8_7_26.md, CLAUDE.md's top block, and
days 1-8 of this study.
