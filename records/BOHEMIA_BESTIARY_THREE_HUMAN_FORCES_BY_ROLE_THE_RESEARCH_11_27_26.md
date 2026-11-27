# How Battle Brothers builds its enemy factions out of ROLES and TIERS (BESTIARY 3 11/27, VAMILY rule 489(c), RESEARCH FIRST: the wiki dump reference/library/grok/wiki/PAGES_ALL.tar.gz, every row cited by its page file)

Source: the Battle Brothers wiki dump, reference/library/grok/wiki/PAGES_ALL.tar.gz, extracted to
scratchpad/wiki/bb_all/. Every row cites the page file under bb_all/. Stats are as the wiki prints
them (HP, armour head/body, melee skill MSk, ranged skill RSk, melee defence MDf, resolve Res).

Role key: FL front line | SH shield line | PA polearm second rank (reach 2) | RG ranged |
SK skirmisher/thrower | LD leader/morale | SP specialist. Tier key: L lower | R regular |
V veteran/mid game | E elite/late | C champion chance.

Two shared mechanics sit under every table:
- Captain (perk) = aura, +15% Resolve to allies within 5 tiles (bb_all/0343_Captain.txt,
  bb_all/1087_Inspired by Nearby Leader (Status Effect).txt).
- Rally (5 AP, 25 fatigue) = morale check for every ally at Wavering or worse within 4 tiles, bonus
  of 40% of the user's Resolve, -10 per tile of distance; also rallies fleeing men
  (bb_all/1633_Rally (25 fatigue).txt, bb_all/1634_Rally the Troops.txt).

## 1. Brigands (northern bandits)

| Unit | Role | Tier | Main weapon / bag / sidearm | Defining stat or perk | Page |
|---|---|---|---|---|---|
| Brigand Thug | FL fodder | L, "probably the first one you face" | junk 1H (shortsword, hatchet, militia spear, pickaxe...); 33% wooden shield/buckler; no bag | 55 HP, MDf 0, Res 40, only Recover | bb_all/0298_Brigand Thug.txt |
| Brigand Raider (Lower) | FL (66% shield); 25% get 2H or pike = PA | L/R | 75% 1H, 25% 2H/pike; if weapon range 1: 25% Bundle of Throwing Axes or Javelins | Brawny, Bullseye, Executioner, Rotation | bb_all/0297_Brigand Raider.txt |
| Brigand Raider | FL + SK | R, "most common" | 80% 1H, 20% 2H/pike; if range 1: 35% throwing axes, javelins or Throwing Spear; 75% shield | MSk 65, 70 after day 40; all masteries | bb_all/0297_Brigand Raider.txt |
| Brigand Poacher | RG weak | L | Short Bow or Staff Sling + Wooden Stick or Knife | RSk 50, "little threat" | bb_all/0295_Brigand Poacher.txt |
| Brigand Marksman (Lower) | RG | L | Short Bow (x2) or Light Crossbow + Knife | Bullseye after day 20; RDf 10, 15 after day 40 | bb_all/0294_Brigand Marksman.txt |
| Brigand Marksman | RG | R, crossbowmen "especially deadly in the middle game" | Short/Hunting Bow, Light Crossbow/Crossbow + Dagger, Knife, Hatchet or Bludgeon | RSk 60, Bow+Crossbow masteries; prefers shieldless targets and rookies | bb_all/0294_Brigand Marksman.txt, bb_all/0299_Brigands.txt |
| Brigand Marauder | FL heavy shock, no shield | V (mid game), late parties "entirely Marauders"; best armour only after day 60 | 55% 2H (Longaxe, Pike, Executioner's Sword...), 45% 1H; 50% throwing axes, javelins or Throwing Spear | 115 HP, armour 140-255, +20% armour damage, Head Hunter, Quick Hands | bb_all/0293_Brigand Marauder.txt |
| Brigand Leader | LD + FL | E, from mid game; late parties "usually have a Leader", rarely two; spawns at the very back | Noble Sword, Greatsword, Warhammer...; 35% throwing axes/javelins; shield if 1H | Captain, Nine Lives, Shield Expert; C 1% | bb_all/0290_Brigand Leader.txt |
| Swordmaster | SP duelist | E (also mercenaries) | Arming Sword, Shamshir or Noble Sword | MSk 100, MDf 80, Footwork, Riposte; C 2% | bb_all/1918_Swordmaster (Enemy).txt |
| Hedge Knight | FL heavy shock | E | 2H, or 1H + kite/heater | 150 HP, armour 280-320, 1.2x damage, Fearsome; C 2% | bb_all/0975_Hedge Knight (Enemy).txt |
| Master Archer | RG marksman | E | War Bow 66% / Heavy Crossbow 34% + Dagger, Scramasax or Hatchet | RSk 85, 1.25x direct damage, Head Hunter, Quick Hands; C 2% | bb_all/1248_Master Archer.txt |
| Wardog | animal fodder | any | bite | 50 HP, 12 AP | bb_all/0299_Brigands.txt |
| Disguised Bandit | FL + SK, event only | R | Raider pool; 33% throwing axes/javelins; wolf-pelt mantle | squad is ONLY this type, no marksmen | bb_all/0644_Disguised Bandit.txt |

Tactic line: marksmen give brigands "ranged superiority" and they stand and shoot when they have it,
but they are "too undisciplined to maintain formation" (bb_all/0299_Brigands.txt).

## 2. Noble Houses (professional soldiers)

| Unit | Role | Tier | Main weapon / bag / sidearm | Defining stat or perk | Page |
|---|---|---|---|---|---|
| Footman | SH front | R | Falchion, Arming Sword, Morning Star or Military Pick + Kite or Heater shield | "frontline units, dedicated to defending more vulnerable Billmen and Arbalesters"; Shieldwall, Shield Expert, Rotation to save allies | bb_all/0801_Footman.txt |
| Billman | PA | R | Billhook, Pike or Polehammer; light armour (gambeson up to mail shirt) | Reach Advantage; "spend a whole turn to take a position two tiles away" | bb_all/0238_Billman.txt |
| Arbalester | RG | R | Heavy Crossbow 34% / Crossbow 66% + Dagger or Knife | RSk 60, Crossbow Mastery, Bullseye; armour-piercing bolts | bb_all/0128_Arbalester.txt |
| Man at Arms | FL or PA by kit | V | 60% Pollaxe/Billhook/Pike/Polehammer/Longsword, 40% 1H + shield | head armour 170-280; role "similar to Footmen or Billmen" by equipment | bb_all/1236_Man at Arms.txt |
| Standard Bearer | LD morale | R support | Battle Standard (reach 1-2) | Captain + Rally the Troops, Res 90; rallies when morale below steady; several bearers rally each other | bb_all/1869_Standard Bearer.txt |
| Sergeant | FL elite duelist | E | Arming Sword, Fighting Axe, Military Cleaver, Winged Mace or Warhammer; no shield, head armour 0 | Duelist, Nimble, MDf 25 | bb_all/1754_Sergeant.txt |
| Zweihander | FL 2H shock | E | Greatsword | Split hits the backline, Berserk, Lone Wolf | bb_all/2250_Zweihander.txt |
| Knight | FL heavy + LD | E (top) | Noble Sword, Warhammer, Winged Mace or Fighting Axe + Kite/Heater | armour 300-320 head, MSk 90, Captain; uses Knock Back to take high ground; C 2% | bb_all/1127_Knight.txt |
| Armored Wardog | fodder | any | bite | "usually pointlessly die at the beginning of a fight" | bb_all/1430_Noble Houses.txt |

Tactic line: "dedicated frontline, polearms and ranged units. Standard Bearers help to maintain high
morale. Elite units try to make a breakthrough" (bb_all/1430_Noble Houses.txt).

## 3. Militia and caravans (Civilian factions)

| Unit | Role | Tier | Main weapon / bag / sidearm | Defining stat or perk | Page |
|---|---|---|---|---|---|
| Militia | FL fodder | L | junk 1H, 25% buckler | 50 HP, Res 40, "rely on outnumbering" | bb_all/1284_Militia.txt |
| Militia Veteran | FL / PA | L+ | Pike, spear, axe, Warfork...; 50% wooden shield | Shield Expert | bb_all/1289_Militia Veteran.txt |
| Militia Marksman | RG | L | Short Bow + Knife, Dagger, Hatchet or Bludgeon | Bullseye, RSk 50 | bb_all/1287_Militia Marksman.txt |
| Militia Captain | LD | L+, "Only one Captain per squad" | Boar Spear, Billhook, Arming Sword...; 75% shield | Captain + Rally the Troops; "often fails to raise it" | bb_all/1286_Militia Captain.txt |
| Caravan Guard | SH | L | 1H + Wooden Shield; 35% throwing axes/javelins | all masteries | bb_all/0345_Caravan Guard.txt |
| Caravan Hand | fodder | L | junk 1H, 33% buckler | erratic behaviour | bb_all/0349_Caravan Hand (Enemy).txt |

"Its units are weak and can only rely on their numbers" (bb_all/0383_Civilian.txt).

## 4. Barbarians (northern horde)

| Unit | Role | Tier | Main weapon / bag / sidearm | Defining stat or perk | Page |
|---|---|---|---|---|---|
| Barbarian Thrall | FL horde + SK | L | Antler Cleaver, Claw Club or Militia Spear; 40% throwing axes, javelins or crude javelins; 20% old shield | Res 70, Adrenaline, Quick Hands, Barbarian Fury (cheap swap places); Relentless after day 20 | bb_all/0193_Barbarian Thrall.txt |
| Barbarian Reaver | FL 2H shock + SK | R | 2H Spiked Mace, Skull Hammer, Crude Axe, Axehammer; 40% heavy javelins, heavy throwing axes or Throwing Spear | 120 HP, Underdog; Relentless after day 60; "only source of heavy throwing weapons" | bb_all/0189_Barbarian Reaver.txt |
| Barbarian Chosen | FL heavy elite, no shield, no bag | V/E, late "entire warbands consisting only of them" | Rusty Warblade, Heavy Rusty Axe, 2H mace/hammer | 130 HP, armour 140-230, Berserk, Battle Forged; C 1% | bb_all/0179_Barbarian Chosen.txt, bb_all/0195_Barbarians.txt |
| Barbarian Drummer | SP support | any | Drum + Antler Cleaver or Claw Club (draws it when engaged) | Drums of War, see Q4 | bb_all/0182_Barbarian Drummer.txt |
| Barbarian Beastmaster | SP handler | late, with Armored Unholds | Thorned Whip | Crack the Whip, see Q4/Q5; "difficult to hit with ranged weapons" | bb_all/0178_Barbarian Beastmaster.txt |
| Barbarian King | boss FL | contract only, one per band | Heavy Rusty Axe or Rusty Warblade | 150 HP, 1.2x damage, Killing Frenzy; NO Captain perk; C 10% | bb_all/0185_Barbarian King.txt |
| Armored Unhold | SP beast | late | fists | 500 HP, Regeneration | bb_all/0195_Barbarians.txt |
| Warhound | animal | any | bite | 70 HP | bb_all/0195_Barbarians.txt |

"No backline with polearms or dedicated archers... they'll shower you with throwing weapons, they
run towards your line" (bb_all/0195_Barbarians.txt).

## 5. Nomads (southern raiders, "basically southern Brigands")

| Unit | Role | Tier | Main weapon / bag / sidearm | Defining stat or perk | Page |
|---|---|---|---|---|---|
| Nomad Cutthroat | FL fodder | L | Saif, Nomad Mace, Militia Spear...; 33% Adarga shield | Throw Dirt (3 AP): Distracted = -35% damage and -35% initiative, 1 turn; Dodge after day 35 | bb_all/1438_Nomad Cutthroat.txt, bb_all/1993_Throw Dirt (5 fatigue).txt, bb_all/0651_Distracted (Status Effect).txt |
| Nomad Outlaw | FL (Polemace = PA, waits for allies) | R | Scimitar, Polemace, 2H Saif, Battle Whip, Three-Headed Flail (after day 10); 66% shield | MSk 65, 70 after day 40; Dodge after day 40; Quick Hands | bb_all/1449_Nomad Outlaw.txt |
| Nomad Slinger | RG | L | Nomad Sling (range 2-6) + Wooden Stick or Knife | Head Hunter after day 30 | bb_all/1453_Nomad Slinger.txt |
| Nomad Archer | RG | R | Composite Bow + Stick, Knife, Nomad Mace or Saif | RSk 65, 70 after day 30; Head Hunter after day 60; stands behind advancing melee | bb_all/1437_Nomad Archer.txt |
| Nomad Leader | LD | E, from mid game, back of the line | Shamshir, Heavy Southern Mace, Fighting Spear, 2H Scimitar; 35% Throwing Spear or javelins | Captain, Dodge, Nine Lives; Nimble after day 40; C 1% | bb_all/1443_Nomad Leader.txt |
| Blade Dancer | SP evasive duelist | E | Swordlance (x2) or Shamshir | MDf 50, Duelist, Footwork; C 2% | bb_all/0246_Blade Dancer.txt |
| Nomad Executioner | FL heavy elite | E | 2H Scimitar, Bardiche, 2H Flail... | 170 HP, armour 230-285, 1.2x damage; C 2% | bb_all/1439_Nomad Executioner.txt |
| Desert Stalker | RG elite marksman | E | War Bow + Dagger, Nomad Mace or Qatal Dagger | RSk 85, 1.25x direct damage; C 2% | bb_all/0562_Desert Stalker.txt |

Note: the faction page says "Nomads don't use throwing weapons, instead they throw sand"
(bb_all/1455_Nomads.txt), but the Leader's own page gives him a 35% javelin/spear bag.

## 6. Southern City States (the professional gunpowder army)

| Unit | Role | Tier | Main weapon / bag / sidearm | Defining stat or perk | Page |
|---|---|---|---|---|---|
| Indebted (slave) | fodder screen | lowest | Pitchfork, Militia Spear, Pickaxe, Knife...; body armour 0-10 | their death or flight costs non-slaves NO morale; soldiers rotate them into melee and shoot into the melee | bb_all/1074_Indebted (Enemy).txt, bb_all/0382_City States.txt |
| Conscript | SH front | R, "bulk of the military" | Light Southern Mace, Saif, Scimitar or Fire Lance; 90% Adarga shield | Nimble, Backstabber, Quick Hands; "dedicated to defending polearm Conscripts and Gunners"; Shieldwall | bb_all/0439_Conscript.txt |
| Conscript with Polearm | PA | R | Polemace or Swordlance | Nimble; takes the 2-tile position; Swordlance can hit an ally | bb_all/0440_Conscript with Polearm.txt |
| Gunner | RG area (cone) | R | Handgonne + Saif or Light Southern Mace | RSk 75, Overwhelm, Fearsome; Crossbow, Mace and Sword masteries | bb_all/0926_Gunner.txt |
| Engineer | SP operator | R, large armies | 50% Wooden Stick or Knife; Padded Vest | Load Mortar; MDf 0; "often left unguarded" | bb_all/0691_Engineer.txt |
| Mortar | SP crew-served weapon | large armies, "most likely" the Holy War crisis | Fire Mortar | not targetable; 6 AP; see Q5 | bb_all/1321_Mortar.txt, bb_all/0611_Dev Blog 133: City States, Part III.txt |
| Assassin | SP infiltrator | E, contracts/events only | Qatal Dagger (x2) or Shamshir; up to 2 Fire/Flash Pots, made on demand | Nimble, Dodge, Footwork, Overwhelm, Adrenaline, Quick Hands | bb_all/0155_Assassin (Enemy).txt |
| Officer | LD + FL heavy | E | Heavy Southern Mace, Shamshir or 2H Scimitar; Sipar shield if 1H | Captain only (no Rally), MSk 85, armour 135-290; C 1% | bb_all/1480_Officer.txt |

"Southern faction is among the strongest in the game... Southerners seem to not care about friendly
fire" (bb_all/0382_City States.txt). Conscripts "have no rallying units" (bb_all/0439_Conscript.txt).

## 7. Mercenaries and Bounty Hunters

| Unit | Role | Tier | Main weapon / bag / sidearm | Defining stat or perk | Page |
|---|---|---|---|---|---|
| Lower Mercenary | FL (25% polearm) | L | 75% 1H; if range 1: 50% throwing axes/javelins; 1H men carry a shield OR a Throwing Net | Quick Hands, Battle Forged, Anticipation | bb_all/1258_Mercenary.txt |
| Mercenary | FL | R | wide 1H/2H/polearm pool; if range 1: 60% throwing axes, javelins or Throwing Spear; shield or net | Overwhelm, Backstabber, Quick Hands; armour up to 260 | bb_all/1258_Mercenary.txt |
| Mercenary Marksman | RG | R | Hunting Bow, Crossbow or War Bow + Dagger, Scramasax, Hatchet or Bludgeon | RSk 75, Nimble, Footwork, Quick Hands; "allies also don't guard them" | bb_all/1261_Mercenary Marksman.txt |
| Swordmaster / Hedge Knight / Master Archer | elites | E | as in Brigands | C 2% each | bb_all/1257_Mercenaries.txt |
| Bounty Hunter | FL / PA | event (Drive Away Bandits), "in big numbers" | Billhook, Pike, Spetum, 1H or Dagger; 50% throwing axes/javelins; shield or net if 1H | MSk 75, Dodge, Nimble, Footwork, Overwhelm; Duelist with a dagger | bb_all/0270_Bounty Hunter.txt |
| Bounty Hunter Marksman | RG | event | Hunting Bow or Crossbow + Scramasax, Dagger, Hatchet or Bludgeon | RSk 70, Footwork, Quick Hands | bb_all/0271_Bounty Hunter Marksman.txt |

"They attack and hope their Overwhelm will work and their armor will save them. They bring different
weapons, sometimes nets and throwing weapons" (bb_all/1257_Mercenaries.txt).

## 8. Cultists

| Unit | Role | Tier | Main weapon / bag / sidearm | Defining stat or perk | Page |
|---|---|---|---|---|---|
| Cultist | FL swarm, the only type | event only, "exactly 25 of them" | Reinforced Wooden Flail, Scramasax or Dagger | Res 80, Nimble, Dodge, Berserk, Overwhelm, Backstabber | bb_all/0477_Cultist (Enemy).txt, bb_all/1676_Religious Peasants.txt |

There is NO enemy cultist leader. Prophet/Disciple/Chosen of Davkul are traits for the player's own
Davkul Cultists origin only (bb_all/1606_Prophet of Davkul.txt, bb_all/0639_Disciple of Davkul.txt).

## 9. Orcs (non-human, role-based)

| Unit | Role | Tier | Main weapon / bag / sidearm | Defining stat or perk | Page |
|---|---|---|---|---|---|
| Orc Young (Lower) | FL charge shock | L | 75% Tree Limb/Cudgel, 25% Cruel Falchion/Hatchet/Morning Star; 25% Bundle of Crude Javelins; 33% shield | 125 HP, 1.15x damage, Charge; Throwing Mastery after day 70 | bb_all/1504_Orc Young.txt |
| Orc Young | FL charge shock + SK | R | adds Head Splitter/Head Chopper; 25% crude javelins; 50% shield | "the first to attack"; RSk 55 after day 150 | bb_all/1504_Orc Young.txt |
| Orc Warrior (Lower) | SH heavy / breacher | R | Head Splitter or Chopper + 66% Heavy Metal Shield | 200 HP, armour 280-340, 8 AP, Line Breaker; 1.05x damage, 1.15x after day 200 | bb_all/1501_Orc Warrior.txt |
| Orc Warrior | SH heavy / breacher | V | same + always the shield, armour to 400 | MSk 75 and 1.25x damage after day 200; "enter a battle as the last"; C 1% | bb_all/1501_Orc Warrior.txt, bb_all/1505_Orcs.txt |
| Orc Berserker | flanker shock | V | Head Splitter, Man Splitter or Berserk Chain; mostly unarmoured | 250 HP, Rage, Charge; 1.2x, 1.3x damage after day 190 | bb_all/1492_Orc Berserker.txt |
| Orc Warlord | LD + FL heavy | E, one per group | Man Splitter (x2), Head Splitter/Chopper; 500/500 armour | Captain, Fearsome, Warcry; C 10% | bb_all/1498_Orc Warlord.txt |
| Greenskin Catapult | siege prop | Greenskin Invasion | none | stationary, no skills, not in turn order | bb_all/0912_Greenskin Catapult.txt |

Skills: Charge (4 AP) moves up to 3 tiles next to a man and stuns, 100% minus shield defence
(bb_all/0371_Charge (25 fatigue).txt). Line Breaker (4 AP) knocks a target 1 tile back, never
misses, removes Shieldwall and Spearwall (bb_all/1182_Line Breaker (30 fatigue).txt).

## 10. Goblins (non-human, role-based)

| Unit | Role | Tier | Main weapon / bag / sidearm | Defining stat or perk | Page |
|---|---|---|---|---|---|
| Goblin Skirmisher (Lower) | SK / FL | L | Skewer, Notched Blade or Cruel Falchion; if not a spear, 66% Bundle of Spiked Bolas; 66% Throwing Net or skirmisher shield | 40 HP, MSk 70, Quick Hands, Footwork at half cost | bb_all/0872_Goblin Skirmisher.txt |
| Goblin Skirmisher | SK / FL (Jagged Pike = PA) | R | bolas guaranteed if not a spear; 1H: 50% net | MDf 20, 25 after day 50; RSk 70 after day 90; 1.25x direct damage; Backstabber after day 50; C 1% | bb_all/0872_Goblin Skirmisher.txt |
| Goblin Ambusher | RG | L/R | Boondock Bow (Reinforced from day 60) + Notched Blade; 10% Goblin Poison | Poison, see below; 1.25x, 1.35x direct after day 180; C 1% | bb_all/0864_Goblin Ambusher.txt |
| Goblin Wolfrider | cavalry flanker | R | Skewer or Cruel Falchion | 13 AP, weapon skills +1 AP; on death leaves a Skirmisher (body hit) or a Wolf (head hit) at 45% HP | bb_all/0877_Goblin Wolfrider.txt |
| Goblin Shaman | SP caster | sometimes | Gnarly Staff | Root, Swarm of Insects, Grant Night Vision (Q4) | bb_all/0870_Goblin Shaman.txt |
| Goblin Overseer | LD + RG heavy | E, sometimes | Spiked Impaler (heavy crossbow, range 6) + Cruel Falchion | Captain + Whip; RSk 80; "most of the time he is busy whipping goblins" | bb_all/0868_Goblin Overseer.txt |

Poison: losing 6+ HP to an Ambusher = 3 turns of -1 AP, -10 initiative, -1 vision per turn left
(bb_all/1574_Poison.txt, bb_all/1576_Poisoned (Goblin) (Status Effect).txt). Goblins' "strategy...
has one main goal: preventing you from starting a proper melee fight" (bb_all/0878_Goblins.txt).

---

## Q1. Do melee men carry throwing weapons in the bag, throw while closing, then switch?

YES, and it is a probability per unit, not a fixed kit. Who carries what:
- Brigand Raider: Lower 25%, normal 35%, only "if the weapon's range is 1" (bb_all/0297_Brigand Raider.txt).
  Marauder 50% (bb_all/0293_Brigand Marauder.txt). Leader 35% (bb_all/0290_Brigand Leader.txt).
  Disguised Bandit 33% (bb_all/0644_Disguised Bandit.txt).
- Barbarian Thrall 40%, Reaver 40% heavy versions (bb_all/0193_Barbarian Thrall.txt, bb_all/0189_Barbarian Reaver.txt).
- Mercenary: Lower 50%, normal 60% if range-1 weapon (bb_all/1258_Mercenary.txt). Bounty Hunter 50%
  (bb_all/0270_Bounty Hunter.txt). Caravan Guard 35% (bb_all/0345_Caravan Guard.txt).
- Nomad Leader 35% (bb_all/1443_Nomad Leader.txt); rank-and-file nomads throw dirt instead (bb_all/1455_Nomads.txt).
- Orc Young 25% crude javelins (bb_all/1504_Orc Young.txt). Goblin Skirmisher 66% (Lower) or always
  (normal) spiked bolas when not holding a spear (bb_all/0872_Goblin Skirmisher.txt).
- Conscript: the Fire Lance, a one-charge flame shot "before battle lines clash"
  (bb_all/0610_Dev Blog 132: Gunpowder Weapons.txt, bb_all/0768_Fire Lance.txt): Ignite hits up to 2
  targets for 40-60 (bb_all/1059_Ignite (5 fatigue).txt).

AMMO: every bundle (throwing axes, javelins, crude, heavy) is "For 5 uses" (bb_all/0330_Bundle of
Throwing Axes.txt, bb_all/0328_Bundle of Javelins.txt, bb_all/0325_Bundle of Crude Javelins.txt,
bb_all/0326_Bundle of Heavy Javelins.txt, bb_all/0327_Bundle of Heavy Throwing Axes.txt); spiked bolas
6 (bb_all/0329_Bundle of Spiked Bolas.txt); a Throwing Spear is one throw and "destroyed after use"
(bb_all/2006_Throwing Weapons.txt), always hits a shield for 26 (bb_all/2001_Throw Spear (15 fatigue).txt).
Range 4; +20% to hit, -10% per tile past 2 (bb_all/1997_Throw Javelin (15 fatigue).txt).

THE BEHAVIOUR: barbarians "move forward and switch to throwing weapons if they have them"
(bb_all/0193_Barbarian Thrall.txt). Brigands "have throwing weapons and try to use them, but lack of
Quick Hands makes them not suited" (bb_all/0299_Brigands.txt), because the swap costs AP: base swap
was 4 AP (bb_all/1415_News and Dev Blogs.txt) and Quick Hands makes one swap a turn free
(bb_all/1613_Quick Hands.txt). Marauders, Thralls, Reavers and Mercenaries all have Quick Hands.
Side effect worth stealing: throwers "won't charge into Spearwall" and make it "ineffective"
(bb_all/0193_Barbarian Thrall.txt, bb_all/0297_Brigand Raider.txt). Thrown weapons left in the bag
do not drop as loot (bb_all/0827_Game Guide.txt, bb_all/0189_Barbarian Reaver.txt).

## Q2. Do ranged enemies carry a melee weapon to swap to?

YES, every human ranged unit lists a sidearm: Poacher (stick/knife, bb_all/0295_Brigand Poacher.txt),
Marksman (bb_all/0294_Brigand Marksman.txt), Arbalester (dagger/knife, bb_all/0128_Arbalester.txt),
Militia Marksman (bb_all/1287_Militia Marksman.txt), Nomad Slinger and Archer (bb_all/1453_Nomad
Slinger.txt, bb_all/1437_Nomad Archer.txt), Desert Stalker (bb_all/0562_Desert Stalker.txt), Gunner
(Saif or Light Southern Mace AND Mace and Sword masteries, bb_all/0926_Gunner.txt), Mercenary Marksman
(Dagger Mastery, bb_all/1261_Mercenary Marksman.txt), Bounty Hunter Marksman (bb_all/0271_Bounty Hunter
Marksman.txt), Master Archer (bb_all/1248_Master Archer.txt). Greenskins too: Ambusher Notched Blade
(bb_all/0864_Goblin Ambusher.txt), Overseer Cruel Falchion with Sword Mastery (bb_all/0868_Goblin
Overseer.txt). Even the Barbarian Drummer "draw[s] weapons and tr[ies] to fight" when engaged
(bb_all/0182_Barbarian Drummer.txt). Why they need it: crossbows cannot reload in melee
(bb_all/0461_Crossbows.txt); the Handgonne cannot fire in melee (bb_all/0935_Handgonne.txt). Their
other escape is Rotation out of melee (bb_all/0294_Brigand Marksman.txt). Ranged-armed men project no
zone of control (bb_all/0424_Combat Mechanics.txt).

## Q3. How do party compositions scale over the campaign?

The wiki has NO party-template tables. What it does say:
- Combat difficulty "increases both numbers and tier (more higher tier mobs like Brigand Leaders)"
  and "harder enemy groups appear sooner" (bb_all/0828_Game Mechanics.txt).
- Contracts scale with roster strength = sum of [10 + 2*(level-1)] over your 12 strongest men, with the
  skull rating and the contract type; gear does not count. Roaming parties and camps scale "mostly
  with distance to civilization and time", roaming parties "slightly" with player strength
  (bb_all/0828_Game Mechanics.txt).
- The replacement order is written per faction: Brigands early = Thugs + some Raiders; later Raiders
  common, marksmen appear, Marauders spawn; late = a Leader and elites (bb_all/0299_Brigands.txt);
  Marauders "one or more among weaker brigands", later whole parties of them (bb_all/0293_Brigand
  Marauder.txt). Nomads gain Dodge mid game, Leaders and elites late (bb_all/1455_Nomads.txt).
  Barbarians late = Chosen, Chosen-only warbands, Armored Unholds with Beastmasters (bb_all/0195_Barbarians.txt).
- Inside one unit, stats and perks switch on by DAY: Raider MSk +5 at day 40; Marksman Bullseye day 20,
  RDf day 40; Marauder best armour day 60; Thrall Relentless day 20, Reaver day 60; Cutthroat Dodge day
  35; Outlaw day 40; Nomad Leader Nimble day 40; Orc Young Throwing Mastery day 70; Orc Warrior day 200;
  Berserker day 190; Goblin Skirmisher day 50 and 90; Ambusher day 60 and 180 (pages in the tables).
- "Lower" twins exist for Raider, Marksman, Mercenary, Orc Young, Orc Warrior, Goblin Skirmisher and
  Ambusher (bb_all/1211_Lower Brigand Raider.txt, bb_all/1210_Lower Brigand Marksman.txt,
  bb_all/1214_Lower Mercenary.txt, bb_all/1215_Lower Orc Warrior.txt, bb_all/1216_Lower Orc Young.txt,
  bb_all/1212_Lower Goblin Ambusher.txt, bb_all/1213_Lower Goblin Skirmisher.txt all redirect to the
  unit page with a Lower section).
- Champions: each type has a base chance (1%, 2%, 10% for kings and warlords); +5% on a 3-skull
  contract, -99% on 1-skull, -1% before day 90 (bb_all/0363_Champions.txt); "the further along your
  campaign, the more likely that you'll find champions" (bb_all/0599_Dev Blog 121: Champions.txt).
- Crises are foretold day 50-70, start day 80-100, need a minimum roster (bb_all/1146_Late Game Crises.txt).

## Q4. Support units: who heals, buffs or raises, and exactly how

| Unit | Skill | Exact effect | Page |
|---|---|---|---|
| Brigand Leader, Militia Captain, Knight, Standard Bearer, Goblin Overseer, Nomad Leader, Officer, Orc Warlord | Captain (passive) | +15% Resolve to allies within 5 tiles | bb_all/1087_Inspired by Nearby Leader (Status Effect).txt, bb_all/1443_Nomad Leader.txt, bb_all/1480_Officer.txt, bb_all/1498_Orc Warlord.txt |
| Standard Bearer, Militia Captain | Rally (5 AP, 25 fatigue) | morale check for all Wavering-or-worse allies within 4 tiles, +40% of user's Resolve, -10 per tile; rallies fleeing | bb_all/1633_Rally (25 fatigue).txt, bb_all/1869_Standard Bearer.txt, bb_all/1286_Militia Captain.txt |
| Orc Warlord | Warcry (3 AP, 15 fatigue) | bolsters morale AND reduces accumulated fatigue of nearby allies, weakens your morale, stronger the closer you are; warlords rally each other | bb_all/2173_Warcry (15 fatigue).txt, bb_all/1498_Orc Warlord.txt |
| Goblin Overseer | Whip (3 AP, 5 fatigue, range 5) | one goblin to Confident; a fleeing one only to Steady | bb_all/2201_Whip (5 fatigue).txt |
| Barbarian Drummer | Drums of War (6 AP, 15 fatigue) | "reduce the Fatigue of his mates by 10"; the wiki says ignore him | bb_all/0673_Drums of War (15 fatigue).txt, bb_all/0182_Barbarian Drummer.txt |
| Barbarian Beastmaster | Crack the Whip (4 AP, 10 fatigue) | keeps ALL Armored Unholds under control, no range limit; unwhipped Unhold 33% to turn wild; cannot whip in melee | bb_all/0448_Crack the Whip (Barbarian Beastmaster).txt, bb_all/0178_Barbarian Beastmaster.txt |
| Goblin Shaman | Grant Night Vision (3 AP, 5 fatigue) | up to 7 allies within 7 tiles lose the night penalty for the battle | bb_all/0894_Grant Night Vision (5 fatigue).txt |
| Goblin Shaman | Root (6 AP) / Swarm of Insects (6 AP) | Root up to 7 targets: cannot move, -35% initiative and defences; Swarm one target -50% skills, defences, initiative for 3 turns | bb_all/1703_Root (15 fatigue).txt, bb_all/1904_Swarm of Insects (15 fatigue).txt |
| Necromancer (undead) | Raise Undead (3 AP, 10 fatigue, twice a turn, unlimited range) | raises any undead or dead human; skill page says 50% HP, unit page says full HP (the wiki disagrees); not on decapitated or occupied corpses | bb_all/1631_Raise Undead (10 fatigue).txt, bb_all/1409_Necromancer.txt |
| Necromancer | Possess Undead (3 AP, 10 fatigue) | one undead for 1 turn: 12 AP, +15 MSk, +50 initiative, +10 defences, -25% damage taken; ends if the Necromancer takes a 10+ HP hit | bb_all/1587_Possess Undead (10 fatigue).txt, bb_all/1588_Possessed (Status Effect).txt |

NOT support, despite the guess: Barbarian Chosen has no aura (bb_all/0179_Barbarian Chosen.txt); the
Barbarian King has no Captain (bb_all/0185_Barbarian King.txt); there is no cultist leader
(bb_all/0477_Cultist (Enemy).txt); the southern Officer has Captain but nobody in the south can Rally
(bb_all/0439_Conscript.txt). The Standard Bearer's data files list Inspiring Presence but "it seems to
not work in the actual game" (bb_all/1869_Standard Bearer.txt).

## Q5. Engineer + Mortar, Gunner + Handgonne: the crew-served and area weapons

- MORTAR: a war machine on the board, "Not targetable", 6 AP, blocks your movement, destroyed
  automatically when the battle ends (bb_all/1321_Mortar.txt). Fire Mortar (6 AP): first marks a
  7-tile area, ONE TURN LATER the shell lands; 20-40 damage, 70% vs armour, 20% direct, never misses,
  ignores Nimble, range 3-999, fires every 2 turns "if reloaded by an Engineer"
  (bb_all/0769_Fire Mortar (0 fatigue).txt). Hit = Shellshocked: -15% damage, skills, defences,
  resolve and initiative for 3 turns, fading 5% a turn (bb_all/1773_Shellshocked (Status Effect).txt),
  plus two morale checks and a third on big HP damage (bb_all/1321_Mortar.txt).
- ENGINEER = the operator: Load Mortar (7 AP, 10 fatigue) enables a mortar "right next to the
  Engineer"; "can't be used when engaged in melee" (bb_all/1190_Load Mortar (10 fatigue).txt). He does
  not always spawn next to it and walks over; MDf 0, often unguarded (bb_all/0691_Engineer.txt).
- DOES KILLING THE OPERATOR STOP THE WEAPON? YES. "Mortars only fire if loaded by an Engineer";
  "Kill or engage Engineers in melee, and Mortars will stop firing" (bb_all/1321_Mortar.txt); "Snipe
  them if you don't want Mortars to fire" (bb_all/0691_Engineer.txt). The machine is immune; the man
  is the target. The dev blog frames it: immobile, "highly inaccurate", the howl does as much as the
  blast, uncommon and "used only with large armies" (bb_all/0611_Dev Blog 133: City States, Part III.txt).
- GUNNER + HANDGONNE: the Gunner IS the weapon, no crew. Fire (3 AP): cone, +10% to hit, -10% per
  tile, "unaffected by objects or characters in the line of fire", can hit 5 tiles behind the target
  (bb_all/0766_Fire Handgonne (5 fatigue).txt); Reload costs 9 AP (bb_all/1678_Reload Handgonne
  (20 fatigue).txt), so "can not fire, reload and move in the same turn"; skill and defence decide
  how MUCH damage, not whether it hits; a shield cuts it (bb_all/0610_Dev Blog 132: Gunpowder
  Weapons.txt). Cannot fire in melee (bb_all/0935_Handgonne.txt); one shot costs 2 ammo points
  (bb_all/0055_Ammunition.txt). Weakness: short range forces him "right behind their own frontline,
  leaving them vulnerable to polearms" (bb_all/0611_Dev Blog 133: City States, Part III.txt); he shoots through allies and
  "can even shoot if there are more allies than enemies" (bb_all/0926_Gunner.txt).
- Greenskin Catapult for contrast: stationary, no skills, not in turn order, destroyed if no
  greenskins remain (bb_all/0912_Greenskin Catapult.txt), a set piece, not a weapon.

## Q6. Is there a Medic or healer enemy?

NO. No enemy page in the dump has a unit that heals another unit's hit points. The only HP recovery is
self-only: Unhold Regeneration (bb_all/2071_Unhold.txt), Nachzehrers eating corpses
(bb_all/1333_Nachzehrer.txt), Necrosavants healing on damage (bb_all/1412_Necrosavant.txt). The nearest
things to a medic are morale and fatigue restorers (Rally, Warcry, Whip, Drums, see Q4) and the
Necromancer's Raise Undead, which brings a corpse back rather than healing a living man.

---

## WHAT BOHEMIA SHOULD TAKE

- THE SHAPE OF EVERY ARMY IS: fodder, a shield line that protects named roles, a reach second rank,
  ranged at the back, one leader at the very back, elites on top. Nobles and the South say it out
  loud: Footmen and Conscripts are "dedicated to defending" the polearms and the gunners
  (bb_all/0801_Footman.txt, bb_all/0439_Conscript.txt). Our human squads should be built the same
  way, and the AI line should be "guard the role behind you".
- SHIELD (nearest: Footman / Conscript): Shieldwall doubles the shield's defence and gives +5 per
  adjacent wall (bb_all/1780_Shieldwall (20 fatigue).txt), and Rotation swaps a hurt friend out. The
  shield man's job is not damage, it is keeping the marksman and machine gunner alive.
- MARKSMAN (nearest: Arbalester, then Master Archer / Desert Stalker as the elite): armour-piercing
  bolts, Bullseye to shoot past cover, prefers "shieldless units or rookies" (bb_all/0294_Brigand
  Marksman.txt), always carries a knife, Quick Hands at elite tier. Tier ladder by day: Poacher,
  Marksman, Master Archer.
- MACHINE GUNNER (nearest: Gunner): an area weapon that hits through allies, rewards a tight enemy
  formation, and pays for it with a 9-AP reload and no firing in melee. Keep both costs: the burst
  is huge, the next turn is reloading, and he needs a shield in front because his range puts him
  "right behind their own frontline" (bb_all/0611_Dev Blog 133: City States, Part III.txt). Friendly fire is part of the
  role (bb_all/0382_City States.txt).
- ROCKET MAN (nearest: the Conscript's Fire Lance, plus the Throwing Spear): one charge per battle,
  refilled after it (bb_all/0768_Fire Lance.txt), fired "before battle lines clash"
  (bb_all/0610_Dev Blog 132: Gunpowder Weapons.txt); the throwing spear is one shot that wrecks a shield
  (bb_all/2001_Throw Spear (15 fatigue).txt). A rocket is a once-a-fight event, not a weapon you
  spam, and "ammo" is a bag count like the 5-use bundles.
- DRONE OPERATOR (nearest: Engineer + Mortar, with the Barbarian Beastmaster and the Necromancer as
  backups): the machine is immune or untargetable and the operator is soft, must stand next to it,
  and cannot work while engaged (bb_all/1190_Load Mortar (10 fatigue).txt). Kill or tie up the man and the machine
  stops (bb_all/1321_Mortar.txt). The Beastmaster adds the scary twist: an unwhipped Unhold has a
  33% chance a turn to go wild and turn on everyone (bb_all/0178_Barbarian Beastmaster.txt), so a
  drone whose operator dies could go rogue. The Necromancer adds bodyguards: two shield men knock
  back anyone who reaches him (bb_all/1409_Necromancer.txt). Telegraph the drone strike one turn
  ahead like the mortar's marked area.
- MEDIC (no BB model; nearest: Militia Captain / Standard Bearer with Rally): BB never heals HP in a
  fight, so a medic is our addition. Build him on BB's support rules: one per squad ("Only one
  Captain per squad", bb_all/1286_Militia Captain.txt), stays at the back, cannot act while engaged
  (like Load Mortar and the Necromancer's spells), spends his turn instead of attacking (the bearer
  "skips turns", bb_all/1869_Standard Bearer.txt), and his effect has a range and a distance falloff
  like Rally's -10 per tile. Killing him first should be the obvious play, the way the wiki says to
  snipe Engineers.
- BREACHER (nearest: Orc Warrior's Line Breaker, with the Knight's Knock Back and Orc Young's Charge):
  a never-miss shove that knocks a man 1 tile and strips Shieldwall and Spearwall
  (bb_all/1182_Line Breaker (30 fatigue).txt), used "to get close to vulnerable backliners or to
  claim the high ground" (bb_all/1501_Orc Warrior.txt); the Charge stuns on arrival unless a shield
  stops it (bb_all/0371_Charge (25 fatigue).txt). The breacher's job is opening the hole the shock
  troops walk through, and he "often end[s] up surrounded" doing it.
- EVERY MAN CARRIES A FALLBACK, AND SWAPPING COSTS: melee men roll a chance at a 5-use throwing bag
  (25-60% by tier), ranged men always carry a sidearm, and the swap is not free unless the unit has
  Quick Hands (bb_all/0299_Brigands.txt, bb_all/1613_Quick Hands.txt). That is a clean way to make
  "everything costs one" bite on a weapon change, and a way to make higher tiers feel smarter
  without new rules.
- TIERS ARE DATA, NOT NEW UNITS: the same name gets better numbers and perks at day thresholds and has
  a "Lower" twin; parties swap fodder for armoured shock troops over time; champions are a small
  per-type chance (1-2%, 10% for bosses) carrying a named item (bb_all/0363_Champions.txt). Contract
  fights scale to the player's roster, roaming parties to time and distance (bb_all/0828_Game
  Mechanics.txt). One roster file per faction with role, tier gates and bag chances would match this.
- EXPENDABLES CHANGE THE MORALE MATH: the South's Indebted cost their own side no morale when they
  die and get shot into on purpose (bb_all/1074_Indebted (Enemy).txt). A faction that treats people
  as cheap is a mechanic, not only flavour, and it fits an economic-collapse world.
