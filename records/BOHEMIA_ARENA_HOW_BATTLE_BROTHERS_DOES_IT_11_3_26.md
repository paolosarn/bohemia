# THE ARENA: HOW BATTLE BROTHERS DOES IT (ARENA, step 1, research; VAMILY rule 375, ask line 402; Paolo 11/3)
# Source: the library only, reference/library/grok/wiki/PAGES_ALL.tar.gz (bb_all/0131_Arena, 0620_Dev Blog 142: The Arena,
# 0132_Arena Fighter, 0133_Arena Tournament, 0134_Arena Veteran, 2016_Tournament (Settlement Situation), 2216_Win Arena Fights,
# 0840 to 0848 the Gladiator pages, 0844 Gladiator Harness, 0845 Gladiator Helmet, 1689_Retired Gladiator, 0849/0850 the
# Gladiators origin's events). TITLES.txt names a "Pit Fighter" page; it is NOT in the tarball (0131 transcludes {{:Pit Fighter}}
# but no file carries it), so Pit Fighter's numbers below are marked NOT IN THE LIBRARY, never guessed as fact.
# Our version (the second half) is draft:true, his to change; Battle Brothers is the floor, a little easier (his words).

## 1. WHAT IT IS
- A building in the desert city states (Blazing Deserts DLC). Entering it starts an ARENA CONTRACT: a small fight for a large sum
  of crowns with no contract, no travel, no ambush on the road (0620, 0131).
- "Southerners [duel] for the entertainment of the masses, and not always willingly. Arena fights are to the death, or at the very
  least incapacitation" (0620).
- Up to THREE MEN of your choice. On accepting you are handed ARENA COLLARS to equip; a collar sits in the ACCESSORY slot, so no war
  dog can come in: "you'll have to do the fighting yourself" (0620).
- The contract is timed: you must enter the same day you accept, or it counts as a failed contract; you may cancel before it starts,
  like any contract (0131).

## 2. THE CARD: WHO YOU FACE, BY DAY AND BY TIER
- You KNOW EXACTLY what you face before you accept: "a certain number of beasts, slaves, captured desert raiders or professional
  gladiators" (0620). Don't like it? Wait for the next day's match (0620, 0131).
- ONE FIGHT PER DAY. The day turns at Morning, Dawn belongs to the day before, so arriving at night you can fight at Dawn AND again
  at Morning (0131).
- The opponent is drawn from a WEIGHTED POOL of everything your arena wins have unlocked (up to 15 wins). Weaker opponents and
  Gladiators are the most common. The table (Expert difficulty counts; Beginner x0.85, Veteran x1.0, Expert x1.15):

  | opponent                  | unlocked at wins | weight | count min-max | allies          |
  |---------------------------|------------------|--------|---------------|-----------------|
  | Webknecht (spiders)       | 5 or fewer       | 10     | 3-13          | -               |
  | Hyena                     | 3 or fewer       | 10     | 2-11          | -               |
  | Serpent                   | 0                | 10     | 2-8           | -               |
  | Nachzehrer (ghouls)       | 0                | 10     | 1-10          | -               |
  | Nomad Outlaw              | 0                | 15     | 2-6           | -               |
  | Ifrit                     | 3+               | 5      | 3-13          | -               |
  | Gladiator                 | 3+               | 15     | 2-4           | -               |
  | Frenzied Hyena            | 4+               | 10     | 2-8           | -               |
  | Mercenary                 | 5+               | 5      | 2-5           | -               |
  | Swordmaster               | 5+               | 5      | 1             | Brigand Raider 0-6 |
  | Hedge Knight              | 5+               | 5      | 1             | Brigand Raider 0-6 |
  | Blade Dancer              | 5+               | 5      | 1             | Nomad Outlaw 0-5 |
  | Unhold (giant)            | 6+               | 5      | 1-3           | -               |
  | Lindwurm                  | 10+              | 5      | 1             | -               |
  | Gladiator Champion        | 15+              | 5      | 1             | Gladiator 2     |
  | Swordmaster Champion      | 15+              | 2      | 1             | Mercenary 2-3   |
  | Blade Dancer Champion     | 15+              | 2      | 1             | Nomad Outlaw 2-3 |
  | Nomad Executioner Champion| 15+              | 2      | 1             | Gladiator 2     |

  Note the shape: the CHEAP beasts (hyenas, serpents, spiders) leave the pool as you win, the HUMANS and the big ones come in.
- SCALING (0131): count = the opponent's range scaled by roster strength (the sum of 10 + 2 x (level - 1) over your 12 highest men,
  times 12 / roster size), plus a minor factor of days passed + arena wins capped at 50; clamped 0.75 to 5. Hard minimums mean the
  champions are near max even at the lowest scaling. The early game CAN roll two Gladiators or a Hedge Knight: the wiki's advice is
  to skip those ("unless you're feeling lucky (suicidal)").

## 3. THE PAY
- Crowns, reputation and the rank traits, ONLY ON A WIN (0620, 0131). "Paid well for quick battles - but only if you win."
- The pay "only scales up by a very modest amount for the harder opponents"; the champion fights pay "very poor rewards considering
  the extreme danger" (0131). So the skill of the arena is SAYING NO: "an experienced arena fighter should know when a fight is not
  worth it, at the cost of having to wait until the next day". THE LIBRARY GIVES NO CROWN FIGURE for a regular match (it says "a
  large sum"); our purse is set against our own contract pay, not a guessed number.
- NO LOOT: "you won't be able to loot your victims after the battle has ended" (0620). The gladiators' harness and helmet "can't be
  looted" (0844, 0845).

## 4. THE FIGHT
- A SMALLER MAP than a regular battle, in front of cheering spectators (0620).
- THE CROWD: "Your every move is commented with cheers and boos; missed that attack with a 95% chance to hit? People will gasp
  alongside you. Killed that beast with one swift stroke? People will cheer and applaud. Flee from your opponents? People will boo,
  because they paid for a match to the death and expect you to die proper bloody" (0620).
- NO RETREAT once it starts (0620).
- To the death or incapacitation: your struck-down men can survive (the dev blog recommends a Surgeon follower so "your men survive
  after a lost bout to entertain the crowd another day").
- The professional GLADIATOR (0843) is an elite: 110 health, 90 resolve, 125 initiative, 75 melee skill, 9 action points, all
  weapon masteries, Dodge, Nimble, Overwhelm, Footwork, Underdog; a Gladiator Harness (40) with padded (60) or metal (115) pieces,
  50% a Gladiator Helmet (225); a shield or a net with a one-handed weapon; a throwing weapon half the time. He WAITS on his turn and
  footworks to the weakest man. The Champion (0842) adds Nine Lives and up to 362 head and 400 body armour.

## 5. THE RANKS AND THEIR TRAITS (they help "both inside and outside of the arena", 0620)
  | rank          | earned at          | effect                                                                 |
  |---------------|--------------------|------------------------------------------------------------------------|
  | Pit Fighter   | first rank (0131)  | NOT IN THE LIBRARY (the page is missing from the tarball)              |
  | Arena Fighter | 5 arena wins       | +5 Resolve; shows the man's arena fights and wins (0132)               |
  | Arena Veteran | 12 arena wins      | +10 Resolve; +50% chance to survive when struck down (not by a fatality); replaces Arena Fighter (0134) |
- The Gladiators ORIGIN (0848) starts with three level-3 gladiators who already have Arena Fighter, very high wages, a 12-man cap,
  and the campaign ends if all three die. The AMBITION "Win Arena Fights" (2216): win 5, worth 100 renown.

## 6. EVERY FIFTH MATCH
- Harder (difficulty x 4/3, so about a third more enemies; a fifth-win fight can bring two lindwurms where the cap is one), in front
  of "particularly important spectators", and it pays a piece of GLADIATOR GEAR found nowhere else (0620, 0131):
  * 5 wins: Gladiator Harness with Padded Armor Pieces (100 durability, -8 max fatigue)
  * 10 wins: Gladiator Helmet (225 durability, -13 max fatigue, -3 vision; worth 2,200)
  * 15 wins: Gladiator Harness with Metal Armor Pieces (155 durability, -14 max fatigue)
  * every 5 after: a random one of the three
- You can tell it is the special one because the card OFFERS the gear. The prize WAITS for your next win, so you can and should
  skip a bad fifth fight and take the gear another day (0131).
- The RETIRED GLADIATOR event (1689) sells the metal harness for 1,000 crowns or joins you as a level-3 Gladiator with Old.

## 7. THE TOURNAMENT
- An EVENT tells you a town is hosting one ("Interesting."): that settlement gets the TOURNAMENT situation for 5 DAYS (0133, 2016:
  "A large tournament is to be held at the arena. Enter it to win marvelous prizes!"; Gladiators are likelier for hire there).
- FIVE MEN, not three. THREE ROUNDS with no rest and no change of men or gear between them, but you may QUIT after each round; the
  earlier you quit, the lower the prize; each round is tougher. WIN IT and you get a NAMED ITEM (0131).
- (1104 Jousting Tournament is a northern noble event, not the arena; it is not part of this.)

## 8. WHAT IT TEACHES (the lesson under it)
The arena is the one place you see the whole fight before you sign, so its skill is judgement: read the card, say no to the bad
match, come back tomorrow. It pays only winners, takes nothing off the dead, and it builds a man's name in front of people.

## 9. OURS (draft:true, his to change; Battle Brothers first, our swag second; numbers to TUNING's table)
- WHERE: the Mob's arena, a building on the Strip's settlement screen: a dead casino showroom whose stage was cut into a pit, the
  old seats full, flashlights and lighters for light, the dead scoreboard still running on solar, the MC on a cracked PA. Tap it.
- THE CARD: tap and see the next match plainly (who, how many, the purse in batteries); a new card each in-game day; walk away and
  the card waits until the day turns. EASIER (his words): NO COLLAR to equip; the pick screen is ONE screen of big faces, tap three
  (five in a tournament) and FIGHT; each picked man's ACCESSORY SLOT shows CROSSED OUT and does not apply inside.
- THE ROSTER OF THE PIT: the clones from the Mob's farm (rule 359(g)): the hyena pack at the bottom (Battle Brothers' hyenas), the
  camel and the bull, the bear and the lion, the sloth at the top (his Lindwurm); below and between them the humans: captured
  raiders (his Nomad Outlaws), the Mob's own pit gladiators, and at the top a Mob champion with his two seconds. Unlocked by wins,
  weighted, the cheap beasts drop out as you climb (the Battle Brothers shape).
- THE FIGHT: the fight we have, on a small pit board; no retreat button; no loot after; the crowd reacts (a clean kill cheered, a
  miss gasped at, running booed).
- THE PAY: batteries only on a win; scales a little with danger (Battle Brothers' modest scaling, so saying no stays the skill).
- THE RANKS: Pit Fighter (first win), Arena Fighter (5 wins), Arena Veteran (12 wins), Battle Brothers' resolve numbers as the floor
  with a small mark on the man; Veteran's struck-down survival is the one that matters (rule 38's 20% death roll).
- EVERY FIFTH MATCH: a third harder, the Mob's bosses in the box, and a piece of PIT GEAR found nowhere else (a harness, a helmet, a
  heavier harness, then a random one), the prize waits for your next win.
- THE TOURNAMENT: a feed post says the Strip hosts one for five days; five men, three rounds, quit after any round for a smaller
  prize, a big prize for all three.
- EASIER THAN THE FLOOR (his "make it easier"): counts at Battle Brothers' Beginner factor (0.85) rather than Expert (1.15), no
  collar step, one-tap pick; the danger of the top cards stays (rule 370: it must bite).
