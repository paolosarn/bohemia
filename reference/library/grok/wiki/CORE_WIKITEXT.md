source: battlebrothers.fandom.com wikitext, 2026-09-30

# WIKI FULL TEXT, CORE PAGES


# PAGE Combat_Mechanics

{{Outdated|Some weapons' parameters, skills, perks have not been updated since 'Blazing Deserts' (2020) and 'Of Flesh and Faith' (2022) DLCs.}}

'''Tactical turn based combat is the heart of Battle Brothers.''' The battlefield is a hex-tiled grid, with elevation, obstacles/terrain considerations and zone of control mechanics. An Action Point (AP) system limits the number of actions (movement, skill use) a unit can take each round and an initiative-based system determines the order in which combatants act out their turns.<ref name="Official dev blog1">[http://battlebrothersgame.com/tactical-combat-mechanics/ Overhype Dev Blog #4]</ref>

The character with the highest initiative will start first in a battle round, followed by characters with lower initiative. As initiative is lowered when a character builds up fatigue or has a penalty to max. fatigue (due to armor/weapons or other effects), his turn may move from first to last very quickly, if he gets fatigued too fast and the enemies do not.

__TOC__

==Action Points (AP)==
AP is spent by actions (moving, striking, using special skills/consumables, etc) and refreshed at the start of the every round. All brothers and most enemy units have 9AP. A few have less (ie Wiedergangers) and some have more (ie Direwolves, Goblin Wolfriders).

Movement on flat ground (Grass/Plains/Roads) costs 2AP. Rough terrain such as Forest/Snow have tiles that typically cost 3AP (there are tiles that still cost 2AP though (ie Light Snow)). Swamp costs 4AP for tiles with Murky Water. Changing elevation adds a further +1 to AP cost per tile.
Most strikes from 1-handed weapons use 4AP (exception: Dagger (with Mastery) uses only 3AP) and strikes from 2-handed weapons use 6AP (exception: Warbrand, Rhomphaia and 2-Handed Cleavers use 4AP on regular strikes; Jagged Pike uses 5AP).

A typical battle starts with both parties in a line formation (1-2 lines deep for your forces, may be deeper for the enemy), with at least 5 hexes between parties. Human forces cannot close to melee distance within 1 round as traversing a hex takes a minimum of 2AP. Direwolves and Goblin Wolfriders on the other hand can definitely close the gap in 1 round. As bows have a range of 7 tiles on the flat (8 with mastery) and crossbows have a range of 6 tiles, both sides start the 1st round within firing distance of ranged combatants.

==Fatigue==
: ''For more information, see [[Attributes#Fatigue|Fatigue (attribute)]]
Apart from AP, all weapon strikes and movement on the battlefield also cost fatigue to execute, therefore a fully fatigued character can neither strike nor move. Every character recovers 15 fatigue at the start of his turn. As per full release version 1.1, dodging/blocking blows also increases Fatigue by 2 and getting struck by a blow increases Fatigue by 5.

==Zone of Control (ZoC)==
Melee units - units with a melee weapon, bare fists, or beasts (except for alps and hexes) - exert a Zone of Control on tiles directly adjacent to them. Any unit trying to leave a tile under Zone of Control will suffer automatic strikes from the hostiles controlling the ZoC (at no fatigue cost for the controlling unit). If all strikes miss, the unit leaves the tile. If any strike hits, the attempt to leave the tile fails and the unit has to try again.

A unit using any kind of ranged weapon (i.e. bow, javelins), a fleeing or stunned unit does not exert a Zone of Control. A smoke pot removes the ZoC from affected tiles for 1 turn. Footwork skill allows to move through ZoC safely. Rotation skill allows a unit to leave the ZoC by swapping positions with another non-hostile unit. Entangled, horrified, and sleeping units lose their ability to exert their ZoC.
<!-- @todo: test if Footwork ignores Spearwall. -->

==To-Hit Chance==
: ''See also: [[Hit Chance]]''
Base chance to hit (shown after selecting a skill and mousing over a target) is essentially: melee skill of brother subtracted against base melee defense of target. <ref name="RPG Codex BB thread post1">[http://www.rpgcodex.net/forums/index.php?threads/battle-brothers-a-board-game-like-turn-based-strategy-rpg-now-available-on-early-access.89524/page-7#post-3247596 RPG Codex Battle Brothers Thread]</ref>

This is further modified by various factors listed below.
*Gear, elevation and surround bonuses are factored in additively. (ie an attacker with Melee Skill of 70 striking a defender with Melee Defense of 0 will have 70% hit chance. If said attacker had another friendly unit adjacent/surrounding the defender, he would get +5% or in other words his hit chance would be 75% instead)
*Morale bonuses/penalties and injury penalties are factored in multiplicatively (ie an archer with 86 Ranged Skill at Steady will have effectively 94 Ranged Skill at Confident (+10%))

Defense is improved by shields (mentioned below), various perks like Dodge, Shield Expert, Reach Advantage, etc. However, it is also subject to diminishing returns stat-wise at values beyond 50: each Melee Defense attribute point over 50 is halved.<ref name="Steam BB bug thread">[https://steamcommunity.com/app/365360/discussions/1/1500126447399758535/#c1618346571420431903 Rap's post on DR]</ref> <ref name="In-Depth Perks Guide">[https://steamcommunity.com/sharedfiles/filedetails/?id=2001196860 In-Depth Perks Guide: Game Mechanics, Defense section]</ref>

When an attack is made, a regular d100 roll happens (a procedure to get a random number in the range of 1 to 100). If the number is lower than the to-hit % chance, then this is a hit. At this point, a second d100 roll is made to see if it the attack hits the head. <ref name="Steam forums thread1">[http://steamcommunity.com/app/365360/discussions/0/364040961433130448/ Steam Forums Thread]</ref>

===<span style="font-size: large;">Gear</span>===
*Weapons with hit bonuses include, for example, [[pitchfork]]s, [[pike]]s and the [[Battle Standard]] with a +10% chance when using the "[[Melee Weapons#Polearms|Impale]]" skill.
*Weapon skills like [https://battlebrothers.fandom.com/wiki/Skills#Weapon_Skills Slash] (+10% hit chance, available for [[swords]]) or [https://battlebrothers.fandom.com/wiki/Skills#Weapon_Skills Thrust] (+20% hit chance, available for [[spears]])
*[[Armor#Shields|Shields]] confer strong defense bonuses which significantly lower the hit chance of anyone attacking someone who has a shield equipped. Examples of standard shields:

{| class="fandom-table" align="center" style="text-align: center;" cellpadding="0" cellspacing="0" border="1"
|-
! width="120" |Buckler
! width="130" |Wooden Shield
! width="125" |Adarga Shield
! width="125" |Kite Shield
! width="125" |Sipar Shield
! width="125" |Heater Shield
|-
|[[File:Icon buckler shield 01.png|60px|link=Buckler]]
|[[File:Icon faction shield round 00.png|70px|link=Wooden Shield]]
|[[File:Inventory_adarga_shield_02.png|65px|link=Adarga Shield]]
|[[File:Inventory faction shield kite 08 01.png|60px|link=Kite Shield]]
|[[File:Inventory_metal_round_shield_01.png|60px|link=Sipar Shield]]
|[[File:Inventory faction shield heater 08 01.png|50px|link=Heater Shield]]
|-
| +10 [[File:Melee_defense.png|25px|Melee Defense]]<br />+ 5 [[File:Ranged_defense.png|25px|Ranged Defense]]
| +15 [[File:Melee_defense.png|25px|Melee Defense]]<br />+15 [[File:Ranged_defense.png|25px|Ranged Defense]]
| +15 [[File:Melee_defense.png|25px|Melee Defense]]<br />+20 [[File:Ranged_defense.png|25px|Ranged Defense]]
| +15 [[File:Melee_defense.png|25px|Melee Defense]]<br />+25 [[File:Ranged_defense.png|25px|Ranged Defense]]
| +18 [[File:Melee_defense.png|25px|Melee Defense]]<br />+18 [[File:Ranged_defense.png|25px|Ranged Defense]]
| +20 [[File:Melee_defense.png|25px|Melee Defense]]<br />+15 [[File:Ranged_defense.png|25px|Ranged Defense]]
|}<br />

The [https://battlebrothers.fandom.com/wiki/Skills#Shield_Skills Shieldwall] skill (not available to mercenaries using a [[Buckler]] as it is not a "normal" shield) can be used in combat to double shield defense (inclusive of Shield Expert bonus) with a additional +5 bonus for each adjacent ally also using the [https://battlebrothers.fandom.com/wiki/Skills#Shield_Skills Shieldwall] skill. This tactic can be used to give your front rank mercenaries a big boost to defense when taking a large amount of damage is otherwise inevitable (e.g. needing to advance while under fire from enemy ranged troops).

The [https://battlebrothers.fandom.com/wiki/Skills#Shield_Skills Knock Back] skill knocks the target away by 1 tile, costs 4AP, 20 Fatigue, and has a flat +25 to hit bonus. Terrain and surround bonuses apply as usual. However unlike regular strikes, Knock Back does no direct damage and its roll is not displayed in the combat log. If the game will allow you to use an ability against an enemy that is immune, it will then simply miss. This is relevant because one might assume that a pike's repel ability which both knockbacks and staggers would still apply the stagger effect to an immune enemy, it does not.

===<span style="font-size: large;">Height Level</span>===
Height levels are used as ground elevations (hills) on the battle map. When standing on them, you gain a bonus to hit chance while enemies suffer a penalty to their chance to hit you.

Changing height level costs more action points and costs more fatigue than walking on the same height layer. The [https://battlebrothers.fandom.com/wiki/Perks#pathfinder Pathfinder] perk eliminates the action point penalty. The [https://battlebrothers.fandom.com/wiki/Perks#pathfinder Pathfinder] perk is especially useful for polearm or 2H weapon users, as it allows them to change height level and still attack. It is also extremely useful for ranged mercenaries as they gain significant bonuses from having a higher elevation than their targets and the [https://battlebrothers.fandom.com/wiki/Perks#pathfinder Pathfinder] perk facilitates easy repositioning.

There are the following types of height level in-game:
* Flat Ground (0 Height Level) [[File:Height 0.png]]
* 1. Height Level [[File:Height 1.png]]
* 2. Height Level [[File:Height 2.png]]
* 3. Height Level [[File:Height 3.png]]

When standing on a higher height level than your opponent, you gain a +10% chance to hit and they suffer a -10% penalty to hit. It is always advantageous to have the high ground in any battle and the AI will try to occupy the high ground whenever possible, especially their ranged units.

Ranged weapons gain an additional hex of range for each level of height and improved hit chance versus targets at a lower height level.

You only count as being in melee attack range if there is a one level difference of height between opposing characters standing in adjacent hexes. If there are two or more levels of height difference between the hex a character is standing on and an enemy in an adjacent hex, you do not count as being in melee attack range or being in each other's Zone of Control.

===<span style="font-size: large;">Surrounding</span>===
Surrounding occurs when two or more units are adjacent to another one they fight against. For each unit after the first surrounding, a bonus of +5% melee hit chance is given to allies attacking the surrounded target. Both allies and enemies are affected by surrounding.<ref name=dev_blog_81>[http://battlebrothersgame.com/dev-blog-81-progress-update-improvements/ ''Dev Blog #81: Progress Update – Other Improvements'']</ref> [[Stunned (Status Effect)|Stunned]] brothers or brothers with [[Ranged Weapons]] will not contribute to surround bonus.<ref name="Update 1.4">[https://battlebrothers.fandom.com/wiki/Update_1.4 Update 1.4]</ref> Non-hostile parties, be it Peasants, Mercenaries, Noble House Forces or alike, don't provide surround bonus for your party.

Some [[Perks]] can affect surrounding:
*[https://battlebrothers.fandom.com/wiki/Perks#backstabber Backstabber] doubles the surrounding bonus to melee hit chance to +10%.
*[https://battlebrothers.fandom.com/wiki/Perks#underdog Underdog] negates the surrounding bonus to melee hit chance unless completely surrounded - in that case, the bonus is +5% in total. If an attacker has the Backstabber perk, its effect is negated and the normal surrounding bonus is applied instead.

Let's study a case. A [[Humans#Brigands|Raider]] is surrounded by your mercenaries Diethelm, Tostig and Erik.<br />
It is Diethelm's turn. Attacking the [[Humans#Brigands|Raider]] with his [[Handaxe]], Diethelm benefits from a bonus of +10% hit chance. That is +5% for each ally adjacent to the target after the first. With [https://battlebrothers.fandom.com/wiki/Perks#underdog Backstabber], Diethelm would have benefited from a total bonus of +20% hit chance.<br />
It is now the turn of Gunther, another of your mercenary. Gunther is not adjacent to the surrounded [[Humans#Brigands|Raider]] and attacks him with a [[Longaxe]]. He will also benefit from a bonus of +10% hit chance, doubled with [https://battlebrothers.fandom.com/wiki/Perks#underdog Backstabber] for the same reasons.<br />
Finally, your archer Bernhard acts. He attacks the same [[Humans#Brigands|Raider]] with a [[Hunting Bow]]. Bernhard will not benefit from any bonus because he is using a [[Ranged Weapons|Ranged Weapon]].

Another case in picture:

<div class="res-img">[[File:Over.jpg]]NOTE: In case of friendly melee fire such as the two handed axe round swing, the enemy surround modifier works AGAINST you, which is particularly devastating against Weidergangers as they have backstabber. Meaning in the example above if the blue circled brother was to use his two tile pierce attack against the raider below, and thereby also target the brother circled in green. The chance to hit the green brother with friendly fire would likely be higher than that of hitting the enemy bandit, as the surround multiplier of nearby raiders would apply to the friendly fire attack. This is likely an oversight by the devs.</div>

===<span style="font-size: large;">Perks</span>===
* [https://battlebrothers.fandom.com/wiki/Perks#dodge Dodge] gives a bonus equal to 15% of ''current'' Initiative to both Melee Defense and Ranged Defense. Note that Dodge loses effectiveness due to certain [[injuries|''injuries'']] which affect Initiative and as a mercenary builds up fatigue during battle (accumulated fatigue lowers Initiative). Dodge is also less effective on characters that are wearing heavier types of armor and using heavy weapons (e.g. Fighting Axe) and even shields as your Initiative is lowered based on the fatigue penalty of equipped weapons, shields, armor and by what is being carried in your bags if it has a fatigue penalty (although this penalty is reduced by 50% while said items are in your bags).
* Shield bonuses to Melee Defense and Ranged Defense can be increased further by using the [https://battlebrothers.fandom.com/wiki/Perks#shield_expert Shield Expert] perk which increases the base defense bonuses of the currently equipped shield by 25%. Unique shields with higher bonuses to defense values make this perk even more potent.
* Some weapon masteries increase the to-hit chance of particular attacks of the related weapon (e.g. [https://battlebrothers.fandom.com/wiki/Perks#sword_mastery Sword Mastery] gives the [https://battlebrothers.fandom.com/wiki/Skills#Weapon_Skills Split] and [https://battlebrothers.fandom.com/wiki/Skills#Weapon_Skills Swing] attacks available when using a [[Greatsword]] or [[Warbrand]] a +5% chance to hit).
* Some other perks give bonuses/maluses to hit chances under specific conditions. They are described in more detail on the [[Perks]] page.

===<span style="font-size: large;">Day/Night Cycle</span>===
Battle Brothers uses a day/night cycle, going through the following phases
:'''Dawn - Morning - Midday - Afternoon - Evening - Dusk - Night'''

Battles fought during the night give combatants the [[Nighttime (Status Effect)|'''''Nighttime''''']] debuff which gives them penalties of -2 Vision, -30% Ranged Skill and -30% Ranged Defense (if not immune to the effects - e.g. having [[The Fangshire]] helmet equipped). As Ranged Skill for both AI ranged troops and human-controlled mercenaries generally tends to be significantly higher than Ranged Defense in most cases, this usually works out in favor of the defender. Thus it is advantageous to attack enemies which have ranged superiority during Nighttime.

==Ranged To-Hit Chance==
Ranged to-hit rolls operate in the same manner as melee to-hit rolls, where to-hit = Ranged Skill of brother subtracted by base Ranged Defense of target. A few additional factors come into play though, besides the usual gear and perk considerations, namely:

:1. '''Distance''' and base accuracy bonus of strike
:*Regular [[bows]] suffer -4% accuracy per hex with [https://battlebrothers.fandom.com/wiki/Skills#Weapon_Skills Quickshot] (no base accuracy bonus)<br /> 
:*Regular [[bows]] suffer -2% accuracy per hex with [https://battlebrothers.fandom.com/wiki/Skills#Weapon_Skills Aimed Shot] (offset by a +10% base accuracy bonus)<br /> 
:*[[Crossbows]] suffer -3% accuracy per hex when using the [https://battlebrothers.fandom.com/wiki/Skills#Weapon_Skills Shoot Bolt] skill (offset by +15% base accuracy bonus for the Shoot Bolt skill (only +10% base accuracy bonus if using a [[Spiked Impaler]]))<br /> 
:*The first hex from the bowman is NOT counted and does not give penalties for the purposes of to-hit chance calculations.<br /> 
:* Examples:<br />(a.) [https://battlebrothers.fandom.com/wiki/Skills#Weapon_Skills Aimed Shot] by a Ranged Skill 50 bowman on a [[Humans|Bandit Thug]] with a Ranged Defense skill of 0 who is 7 hexes away, will have 50% + 10% (Aimed Shot) - 12% (accuracy degradation of 2 for 6 hexes of distance) = 48% to-hit chance.<br />(b.) [https://battlebrothers.fandom.com/wiki/Skills#Weapon_Skills Shoot Bolt] by a Ranged Skill 50 crossbowman on a [[Humans|Bandit Thug]] with a Ranged Defense skill of 0 who is 6 hexes away using a [[Light Crossbow]], will have 50% + 15% chance for [https://battlebrothers.fandom.com/wiki/Skills#Weapon_Skills Shoot Bolt] - 15% (accuracy degradation of 3 for 5 hexes of distance) = 50% to-hit chance.
:*Thrown weapons (e.g. [[Bundle of Javelins]]) suffer a penalty of -10% accuracy per hex (offset by a +30% base accuracy bonus). Note that, unlike bows and crossbows, thrown weapons DO count the first hex from the attacker for distance effects on accuracy.

:2. '''Cover''' (shown as "Line of fire blocked" with it's own unique icon of a shield with an arrow) reduces overall to-hit chance by 75%. This penalty can be reduced to 50% by the [https://battlebrothers.fandom.com/wiki/Perks#bullseye Bullseye] perk. In the above example (a.), the bowman would only have a 12% to-hit chance on the [[Humans|Bandit Thug]] if he had cover (e.g he was standing behind another enemy unit or was behind one of your own units. This chance would be improved to 24% with the [https://battlebrothers.fandom.com/wiki/Perks#bullseye Bullseye] perk making it a core pick for ranged mercenaries.

*The initial roll on whether the shot hits the intended target or its 'Cover' (which could be another unit or an inanimate obstacle) is NOT shown on the battle log though as of release 1.1. The battle log ONLY displays the to-hit roll for the intended or unintended target, without factoring in Cover a second time.<ref name="Steam forum post1">[http://steamcommunity.com/app/365360/discussions/0/2333276539613356073/#c2333276539613340505 Explanation by Rap]</ref> 

*Ranged attacks confer the debuff granted by the [https://battlebrothers.fandom.com/wiki/Perks#overwhelm Overwhelm] perk to any target struck even if it is not the intended target (e.g. hit on another target due to the scatter mechanic for ranged attacks) or even by a miss on the intended target.

*As with Melee Defense, the [https://battlebrothers.fandom.com/wiki/Perks#dodge Dodge] perk and shields also affect Ranged Defense, as does height advantage/disadvantage. The [https://battlebrothers.fandom.com/wiki/Perks#anticipation Anticipation] perk confers a bonus to Ranged Defense based on the distance from the attacker and on the base Ranged Defense of the defender. The farther the distance from the attacker, the bigger of a bonus [https://battlebrothers.fandom.com/wiki/Perks#anticipation Anticipation] provides to Ranged Defense. Some enemy units have access to these perks as well (e.g. [[Goblins|Goblin Ambushers]] have the [https://battlebrothers.fandom.com/wiki/Perks#anticipation Anticipation] perk).

:3. Scatter is a mechanic whereby a missed ranged attack has a chance to strike an adjacent target, friendly or enemy. Because of scatter, it can be effective to fire into a block of enemy units even if your hit chance on your intended target is low for whatever reason (e.g. due to the line of fire being blocked, due to low ranged skill or due to distance). In this circumstance, you have a reasonable chance to hit ''something'' (hopefully an enemy!).<br /> 

*Ranged attacks via the scatter mechanic can actually strike unintended targets one hex beyond the normal maximum range of the attack in question.

==Damage==
: ''Main article: [[Damage]]''
When the target of a skill is hit (intentionally or not) it will receive damage. There are two main types of damage:
* Armor damage
* Hitpoints damage
Each type is rolled separately.
Damage dealt and received depends on several factors including the weapon and skill used as well as perks, traits and other modifiers. Armor absorbs and reduces damage taken. This is a simplified formula for calculating armor and hitpoints damage:
 armor damage = base damage * modifiers * effectiveness against armor %

 1. HP damage = base damage * modifiers * ignoring armor damage % - armor * 0.1
 2. if armor = 0 (destroyed), more damage is added (cannot be negative):
    + base damage * modifiers * (1 - ignoring armor damage %) - armor damage you already did
 3. if critical hit, everything is multiplied by 1.5:
    HP damage = HP damage * 1.5

For example, using a [[Billhook]] to attack an [[Orcs|Orc Warrior]] wearing a Looted Kettle Hat (300) and a Looted Scale Armor (280). The weapon base damage is 60-90, 30% of it ignores armor for 18-27 hp damage and it has 150% effectiveness against armor for 90-135 armor damage
* Orc Warrior is hit in the head (critical hit), resulting in +50% HP damage
* 120 is rolled on armor damage, 27 on hp damage
* Looted Kettle Hat takes 120 damage. 180 armor remains.
* Orc Warrior takes 27 - 18 (10% of remaining armor) = 9 * 1.5 = 13 damage to hitpoints

Secondary damage (bleeding, miasma, etc.) usually bypasses armor and deals a constant amount of damage which can be mitigated with skills like Indomitable.

===<span style="font-size: large;">Split Man</span>===
[[Axes#Two-Handed_Axes|Two-Handed Axes']] '''[[Split_Man_(15_fatigue)|Split Man]]''' skill has specific mechanics. The fact that it hits the head on a successful attack has mislead many players into thinking that it always does critical damage.

In fact, Split Man has a standard chance to land a critical hit. If it does, the first strike will hit the head and deal critical damage. If not, the second strike will hit the head for half damage (armor and hitpoints). The second strike always deals half damage whether it hits the body or the head. The second strike can never be a critical hit, do critical damage or benefit from skills that increase critical damage like [[Chop (13 fatigue)|Chop]] or [[Brute|Brute trait]].

==Weapon Durability==
Weapon durability is important, as when a weapon's or [[shields|shield's]] durability reaches zero, the weapon or shield will break.
* Melee weapon durability is lowered by 3 when it strikes armor that has at least 50 durability remaining; weapons are never damaged when they hit flesh (Hitpoints). Durability loss for AoE strikes is calculated separately for each individual hit (ie a Warscythe can lose 9 durability on using Reap, if 3 targets are successfully struck and all 3 hits connect with armor).
* Shield durability is lowered if it is hit by Ranged weapon projectile (bolt/arrow, throwing weapon), by being hit with the Split Shield skill of a weapon (the shield damage will vary based on the weapon doing the splitting) or by randomly being hit with any melee weapon or beast attack when the attempted attack fails but doesn't miss and hits the shield instead (-1 durability for each hit, regardless of weapon).<br />The [[Shield Expert]] Perk reduces the incoming shield damage by half (50%) to a minimum of one, while the [[Axe Mastery]] increases axes' Split Shield damage to shields by 50%.
* [[Bows|Bow]] or [[Crossbows|Crossbow]] durability is lowered by 2 with each shot.

==Morale==
:''See full article: [[Morale]]''
{{:Morale}}

==References==
{{reflist}}

[[Category:Game Mechanics]]


# PAGE Game_mechanics

#REDIRECT [[Game Mechanics]]


# PAGE Settlement_buildings

Here you can see a list of the buildings which can appear in a settlement.

==Alchemist==
Alchemy is an important part of the medieval ages' science, and rulers of the magnificent city states have always been patrons of it.

[[File:Alchemist.png]]

The [[Alchemist|alchemist]] is always ready to offer a variety of exotic and dangerous alchemical contraptions at a reasonable price.

==Arena==
[[Arena]] fights is a deadly entertainment for the masses, and while some southerners fight for the prestige and cheer of the crowd, others do so unwillingly. Once a battle starts and you won’t be able to retreat.

[[File:Arena.png]]

Arena battles are fought on a smaller map than regularly, and you’re limited to fight with just three men of your choice against various opponents. You’ll know exactly which and how many opponents you’re about to face. And if the upcoming arena match is not to your liking, you can simply wait until the next day and the next arena match.

Every fifth arena match is a special one; you’ll face harder opposition than usual. If you manage to win, you will earn a piece of rare gladiator equipment not otherwise available in the game.

Hiring a [[The_Surgeon_(Follower)|Surgeon]] for your [[Retinue|retinue]] of non-combat followers may be a good investment to ensure that your men survive after a lost battle to entertain the crowd for another day.

==Armorer==
Offer high quality armor and a variety of shield types at full durability. Not cheap. Typical prices here are about 25% higher than a similar item in the Market. Can instantly repair items (Hold Alt and click an item), without using the party's tool supply, but at a costly price (heavily depends on the item's worth value).

{|style="margin:auto; text-align:center;"
|style="width: 33.3%"|<div class="res-img">[[File:Building_01.png]]</div>
|style="width: 33.3%"|<div class="res-img">[[File:Armorer_southern.png]]</div>
|-
|<span style="font-variant:small-caps">Northern variant</span>
|<span style="font-variant:small-caps">Southern variant</span>
|}

==Barber==
Cuts hair and beards. Here you can change the appearance of your brothers, even their scars.

[[File:Building_12.png]]

==Fletcher==
Produces all sorts of ranged weapons: [[Bows|bows]], [[Crossbows|crossbows]], [[Bundle of Javelins|javelins]], [[Bundle of Throwing Axes|throwing axes]]. Also offers a variety of [[Ammunition|ammunition]] and quivers. Price modifiers for items here are about 25% higher than the corresponding settlement [[Settlement_buildings#Marketplace|Market]]

[[File:Building_11.png]]

==Harbor==
From the docks here, you can instantly travel to the ports of other settlements. Not for free of course. There is a base price for each port (determined by distance), which is multiplied by the number of men in the party (and likely truncated to nearest 10) to give the final price. Prices of a few hundred crowns are typical.

[[File:Building_09.png|300px]]

==Kennel==
[[Hounds|Dogs]] in all variety. Want to adopt a nice puppy? Not here. Only bloodthirsty and savage battle dogs that chew goblins for breakfast.

[[File:Building_10.png]]

==Marketplace==
The Market square. Buy all sorts of things including [[Tools_and_Supplies|tools]], [[Medical_Supplies|medicine]], [[Provisions|food]], [[Weapons|weapons]] and [[Armor|armor]]. Weapons and armor below full durability are sold here as well (at reduced prices, proportional to remaining durability). Barring caravans and special [[Settlement_Situations|settlement  situations]], the selection of market items usually refreshes every 3 days. Completing some contracts refreshes the assortment as well.

{|style="margin:auto; text-align:center;"
|style="width: 33%"|<div class="res-img">[[File:Building_06_b.png]]</div>
|style="width: 33%"|<div class="res-img">[[File:Market_southern.png]]</div>
|-
|<span style="font-variant:small-caps">Northern variant</span>
|<span style="font-variant:small-caps">Southern variant</span>
|}

==Recruits==
This is where you [[Character Backgrounds|hire]] men who have decided to work as mercenaries. Is it because they lost their home, family or something else. You can offer them the opportunity to travel to far away places, to meet new people and other "[[Monsters|things]]".

{|style="margin:auto; text-align:center;"
|style="width:40%"|<div class="res-img">[[File:Crowd_03.png]]</div>
|style="width:40%"|<div class="res-img">[[File:Crowd_southern.png]]</div>
|-
|<span style="font-variant:small-caps">Northern variant</span>
|<span style="font-variant:small-caps">Southern variant</span>
|}

==Tavern==
The Tavern. Buy drinks to your soldiers to boost their [[Combat_Mechanics#Morale|morale]]. But beware getting them [[Drunk (Status Effect)|drunk]], because that can get them easily killed in a battle - in addition to suffering a [[Hangover_(Status_Effect)|hangover]] effect afterwards. Prices scale proportionally depending on the number of men, and are influenced by [[Settlement_Situations|settlement situations]] and [[Relations|relations]].

Also, you can get [[Tavern Rumors|tavern rumors]] here. Paying drinks for patrons can be repeated 4 times a visit for new rumors.

[[File:Building_02.png|400px]]

==Taxidermist==
[[Taxidermist]] allows the player to [[Crafting|craft new items]] out of [[Trophies|trophies]].

{|style="margin:auto; text-align:center;"
|style="width: 33.3%"|<div class="res-img">[[File:Building 13 b.png]]</div>
|style="width: 33.3%"|<div class="res-img">[[File:Taxidermist_southern.png]]</div>
|-
|<span style="font-variant:small-caps">Northern variant</span>
|<span style="font-variant:small-caps">Southern variant</span>
|}

==Temple==
Priests apply fresh bandages and pray for your wounded brothers to speed up their healing time for injuries, for a price of course. (Healing time reduced after paying, i.e.: 2-4 days to 1-2 days, 1-3 days to 1 day)

{|style="margin:auto; text-align:center;"
|style="width: 33.3%"|<div class="res-img">[[File:Building_03.png]]</div>
|style="width: 33.3%"|<div class="res-img">[[File:Temple_southern.png|300px]]</div>
|-
|<span style="font-variant:small-caps">Northern variant</span>
|<span style="font-variant:small-caps">Southern variant</span>
|}

==Training Hall==
Veterans here help train your mercenaries in exchange for money, giving them a boost in experience gain over a few battles. Training price is mainly influenced by level of the trainee, increasing proportionally with added levels (e.g. Veteran's Lessons costs 253G for a L1 recruit and 1106G for a L10 fighter).

{|style="margin:auto; text-align:center;"
|style="width:40%"|[[File:Building_07.png]]
|
{| class="article-table" style="text-align:center;" border="0" cellpadding="1" cellspacing="1"
! scope="row"|
! scope="col" style="text-align:center"|XP bonus
! scope="col" style="text-align:center"|Buff duration
|-
! scope="row"|Sparring Fight
| +50%
|Next battle
|-
! scope="row"|Veteran's Lessons
| +35%
|Next 3 battles
|-
! scope="row"|Rigorous Schooling
| +20%
|Next 5 battles
|}
|}

==Weaponsmith==
Offers weapons of high quality at full durability. Sometimes unique ones, which will then have a special name. Not cheap. Price modifiers for items here are about 25% higher than the corresponding settlement Market. Can instantly repair items (Hold Alt and click an item), without using the party's tool supply, but at a costly price (heavily depends on the item's worth value).

{|style="margin:auto; text-align:center;"
|style="width: 33.3%"|<div class="res-img">[[File:Building_04.png]]</div>
|style="width: 33.3%"|<div class="res-img">[[File:Weaponsmith_southern.png]]</div>
|-
|<span style="font-variant:small-caps">Northern variant</span>
|<span style="font-variant:small-caps">Southern variant</span>
|}

==See also==
*[[User:Outryder/Settlement_Buildings|Buildings in Settlements (% chance)]] (unfinished draft)
[[Category:Settlement Buildings]]


# PAGE Origins

<div class="res-img">[[File:Company_origins.jpg]]</div>
The 'Warriors of the North' DLC adds a number of company origins to pick from when starting a new campaign. Each of those comes with a flavor introduction, different starting characters, equipment, resources, and special rules for your campaign. Some origins change the game more than others, but most of them impact it from beginning to end. If the 'Beasts & Exploration' DLC is also installed, the Beast Slayers origin can be selected.<ref name="dev_blog_113">[http://battlebrothersgame.com/dev-blog-113-company-origins-part-i/ Dev Blog #113: Company Origins, Part I]</ref>
__TOC__
==Rebuilding a Company==
{{:Rebuilding a Company}}

==A New Company==
{{:A New Company}}

==Southern Mercenaries==
{{:Southern Mercenaries}}

==Trading Caravan==
{{:Trading Caravan}}

==Peasant Militia==
{{:Peasant Militia}}

==Band of Poachers==
{{:Band of Poachers}}

==Oathtakers==
{{:Oathtakers}}

==Deserters==
{{:Deserters}}

==Northern Raiders==
{{:Northern Raiders}}

==Anatomists==
{{:Anatomists}}

==Davkul Cultists==
{{:Davkul Cultists}}

==Manhunters==
{{:Manhunters}}

==Beast Slayers==
{{:Beast Slayers}}

==Gladiators==
{{:Gladiators}}

==Lone Wolf==
{{:Lone Wolf}}

==References==
{{Reflist}}
[[Category:Game Mechanics]]


# PAGE Contracts

__TOC__
==Contracts==
[[File:Contract.png|thumb|right]]Contracts are missions that can be accepted in [[Settlements and attached locations|Settlements]]. Completing a contract will reward your company with crowns, [[Renown]], and better [[Relations]] with the settlement or the noble house that offered the contract. However, failing to fulfill a contract lowers your company's local [[Relations]] and the company's [[Renown]].

You may only have one active contract at a time. The crowns reward increases with your company's [[Renown]]. Some contracts, such as the noble houses contracts, are only available with a certain level of [[Renown]].

{| style="margin-top:-30px; margin-bottom:-30px;"
|<br />[[File:Gold_coin.png|thumb]]||Contract targets can be identified with a golden coin on the [[Global Map]].
|}

==Haggling==
NOTE: the information provided in this section is primarily based on Negotiation Mechanics [https://steamcommunity.com/app/365360/discussions/0/2922228082015480977/ Steam post].

=== Relations Penalty ===
Before taking a contract, it is possible to haggle for better pay. However, each haggling attempt will worsen [[Relations]] by 0.5 points with the settlement if you don't have the [[The Negotiator (Follower)|Negotiator]] follower.

=== Annoyance ===
When you start negotiating, a hidden variable called Annoyance determines how things will go. Every time you haggle, you gain a random amount of Annoyance between 3 and 6. This number is a float so that you can draw fractional numbers like 4.5. If your Annoyance hits 9 or higher, you are kicked out and take a substantial reputation penalty with the person trying to hire you. You accumulate Annoyance whether the haggle attempt succeeds or fails. Having the [[The Negotiator (Follower)|Negotiator]] cuts the annoyance gain in half, i.e., to 1.5 - 3 per haggle.

=== Success Chance ===
The odds of a haggle failing are equal to your Annoyance * 0.1. You collect Annoyance for haggling BEFORE rolling. Thus, your first haggle attempt will have a failure rate of somewhere between 30-60%, with an average failure rate of 45%.

=== Consequences of Success ===
If you ask for more pay, the value of the contract increases between 4-11%. The game tries to increase all forms of compensation by this amount (e.g., completion pay, advance pay, pay per head), but because of rounding issues, you sometimes get less.

If you ask for payment in advance, the game subtracts 25% from your completion and per-head pay and adds it to the advance pay. Because of rounding issues, you usually lose money overall. The [[The Negotiator (Follower)|Negotiator]] increases the proportion of your pay that can be asked for in advance.

If you ask for more pay per head, the game subtracts 25% from completion and advance pay and adds it to the per-head pay. You might lose money due to rounding. You could lose even more if you don't collect the maximum number of heads.

You can increase your pay more than once if you risk it. Some real game examples:
{| class="fandom-table"
!'''''Pay Increase Type'''''
!'''Advance'''
!'''After Completion'''
!'''Per Head'''
!'''Max Heads'''
!'''Total'''
|-
|Nothing
|$0
|$610
|$10
|15
|$760
|-
|Total
|$0
|$640
|$11
|15
|$805
|-
|Per Head
|$0
|$410
|$20
|15
|$710
|-
|Advance
|$150
|$510
|$5
|15
|$735
|}

==Contract Types==
{| align="right" style="border: 2px solid #3d3d3d; margin-left:15px;"
! style='background: #3d3d3d' width='60' |'''Easy'''
! style='background: #3d3d3d' width='60' |'''Medium'''
|-
|[[File:Difficulty_easy.png|thumb|center|85px]]
|[[File:Difficulty_medium.png|thumb|center|85px]]
|-
! colspan='2' style='background: #3d3d3d' |'''Hard'''
|-
| colspan='2' |[[File:Difficulty_hard.png|thumb|center|85px]]
|}
Contracts will ask for more or less the same tasks to be completed. However when, where and who you fight may vary widely. Contract difficultly is measured with skulls. More skulls means more danger, but a better pay.

Contract types that involve destroying a location replace existing enemy forces for the new one scaled to the contract difficulty. For example, a coven full of [[Necrosavant]]s can have them replaced by [[Ancient Auxiliary]] if the contract difficulty is low. One or two skull contracts can overwrite [[Named and Legendary Items|Named Items]] that a location may be holding.

{| class="article-table" width="100%"
! align="center"| [[File:Banner_11.png|left|50px]] [[File:Banner_11sb.png|right|50px]]
===Civilian Contracts===
|-
{{:Defend Settlement Bandits}}
|-
{{:Defend Settlement Greenskins}}
|-
{{:Deliver Item}}
|-
{{:Discover Location}}
|-
{{:Drive Away Bandits}}
|-
{{:Drive Away Barbarians}}
|-
{{:Escort Caravan}}
|-
{{:Hunting Alps}}
|-
{{:Hunting Hexen}}
|-
{{:Hunting Lindwurms}}
|-
{{:Hunting Schrats}}
|-
{{:Hunting Unholds}}
|-
{{:Hunting Webknechts}}
|-
{{:Investigate Cemetery}}
|-
{{:Obtain Item}}
|-
{{:Restore Location}}
|-
{{:Return Item}}
|-
{{:Roaming Beasts}}
|}

{| class="article-table" width="100%"
! align="center" |[[File:4Banner.png|left|200px]] [[File:4banner2.png|right|200px]]
===Noble Contracts===
|-
{{:Big Game Hunt}}
|-
{{:Break Greenskin Siege}}
|-
{{:Confront Warlord}}
|-
{{:Decisive Battle}}
|-
{{:Conquer Holy Site Northern}}
|-
{{:Defend Holy Site Northern}}
|-
{{:Destroy Goblin Camp}}
|-
{{:Destroy Orc Camp}}
|-
{{:Escort Envoy}}
|-
{{:Find Artifact}}
|-
{{:Free Greenskin Prisoners}}
|-
{{:Intercept Raiding Parties}}
|-
{{:Last Stand}}
|-
{{:Marauding Greenskins}}
|-
{{:Patrol}}
|-
{{:Privateering}}
|-
{{:Raid Caravan}}
|-
{{:Raze Attached Location}}
|-
{{:Root Out Undead}}
|-
{{:Siege Fortification}}
|-
{{:The Barbarian King}}
|}
{| class="article-table" width="100%"
! align="center" |<!-- Southern Cities Flag banner should be here-->
===Southern Contracts===
|-
{{:Conquer Holy Site Southern}}
|-
{{:Defend Holy Site Southern}}
|-
{{:Deliver Item}}
|-
{{:Drive Off Nomads}}
|-
{{:Escort Caravan}}
|-
{{:Hold Fortress}}
|-
{{:Hunting Ifrits}}
|-
{{:Hunting Serpents}}
|-
{{:Roaming Beasts (Desert)}}
|-
{{:Slave Uprising}}
|}

[[Category:Contracts]]
[[Category:Game Mechanics]]


# PAGE Character_Backgrounds

<div class="res-img">[[File:Background_assets.jpg]]</div>
Character backgrounds define a character's story, his starting [[attributes]] and equipment.<ref name="dev_blog_18">[http://battlebrothersgame.com/dev-blog-18-character-traits-and-backgrounds/ ''Dev Blog #18: Character Traits and Backgrounds'']</ref> Backgrounds also determine what kind of [[traits]] a character can get and they open up specific [[events]] and dialog choices as well as their final fate should you retire successfully or not.<ref name="dev_blog_49">[http://battlebrothersgame.com/dev-blog-49-progress-update-character-backgrounds-visual-makeover-continued/ ''Dev Blog #49: Progress Update – Character Backgrounds, Goblin Preview, Visual Makeover Continued'']</ref> [[Talents]] are random in nature and strength but some backgrounds are limited to certain types. Mercenaries can be hired in settlements or sometimes found while traveling and always require payment, mostly in the form of wages (see the [[Game Guide#How_is_a_recruit_daily_wages_calculated.3F|game guide]] for details).

== Character Backgrounds Data ==

<tabber>Background Details={{:Character Backgrounds/Attributes, Special Effects and Events}}
|-|Attribute Ranges={{:Character Backgrounds/Attribute Ranges}}
|-|Attribute Averages={{:Character Backgrounds/Attribute Averages}}
|-|Sources={{:Character Backgrounds/Sources}}
|-|Affiliations={{:Affiliations}}
</tabber>

==References==
{{reflist}}
[[Category:Backgrounds]]


# PAGE Perks


[[File:PerksConcept.jpg|thumb|300px|Perk concept drawings.]]
'''Perks''' is a gameplay mechanic associated with the level up system of player's mercenaries. With each new character level reached by your mercenary he will gain 1 Perk point in addition to [[Attributes]] stats points.

There is a total of 7 Perk rows. To unlock the second perk row, you need to spend one perk point. To unlock the third row you need to spend two perk points. These points can be allocated in any of the unlocked perk rows. So, a player is somewhat forced to pick several perks in the early level up rows till all seven perk rows are unlocked. If a player decides to make some adjustment to perks already chosen, he can reset selected character's perks with a [[File:Potion_08.png|25px|bottom]] [[Potion of Oblivion]].

Upon reaching the veteran character level a regular mercenary brother will gain 10 perk points. An extra perk point can only be gained upon using a [[File:Jug_01.png|25px|bottom]] [[Mysterious Jug]].

__TOC__

Every player, who would like to broaden and deepen their knowledge of Perks, is recommended to read the [https://steamcommunity.com/sharedfiles/filedetails/?id=2001196860 '''In-Depth Perks Guide'''] by '''turtle225''' and '''Abel'''. It provides "an up to date guide that deep dives into each perk to help you make educated decisions when building your bros".

After you read about what each perk does, you can use the [http://tumult.cc/bb-calc.html '''Battle Brothers Perk Calculator'''] tool made by '''EveryCrime''' or the [http://www.bbplanner.xyz/ '''Battle Brothers Planner'''] tool made by '''Unislash'''. They let you visually calculate how you can spend your perk points on a character with a certain level or how you have to progress in order to achieve the perk combinations you want.

==Tier 1==
[[File:Bb t1.png|centre|thumb|667x667px]]
{| class="article-table" width="100%"
!style="width:27%; text-align:center;"|'''Perk'''
!style="width:73%; text-align:center;"|'''Description'''
|-
{{:Fast Adaptation}}
|-
{{:Crippling Strikes}}
|-
{{:Colossus}}
|-
{{:Nine Lives}}
|-
{{:Bags and Belts}}
|-
{{:Pathfinder}}
|-
{{:Adrenaline (Perk)}}
|-
{{:Recover (Perk)}}
|-
{{:Student}}
|}

==Tier 2==
[[File:Bb t2.png|centre|thumb|667x667px]]
{| class="article-table" width="100%"
!style="width:27%; text-align:center;"|'''Perk'''
!style="width:73%; text-align:center;"|'''Description'''
|-
{{:Executioner (Perk)}}
|-
{{:Bullseye}}
|-
{{:Dodge}}
|-
{{:Fortified Mind}}
|-
{{:Resilient}}
|-
{{:Steel Brow}}
|-
{{:Quick Hands}}
|-
{{:Gifted}}
|}

==Tier 3==
[[File:Perks_Tier_3_(2019).png|centre|thumb|667x667px]]
{| class="article-table" width="100%"
! style="width:27%; text-align:center;" |'''Perk'''
! style="width:73%; text-align:center;" |'''Description'''
|-
{{:Backstabber}}
|-
{{:Anticipation}}
|-
{{:Shield Expert}}
|-
{{:Brawny}}
|-
{{:Relentless}}
|-
{{:Rotation (Perk)}}
|-
{{:Rally the Troops}}
|-
{{:Taunt (Perk)}}
|}

==Tier 4==
[[File:Bb t4.png|centre|thumb|667x667px]]
{| class="article-table" width="100%"
!style="width:28%; text-align:center;"|'''Perk'''
!style="width:72%; text-align:center;"|'''Description'''
|-
{{:Mace Mastery}}
|-
{{:Flail Mastery}}
|-
{{:Hammer Mastery (Perk)}}
|-
{{:Axe Mastery}}
|-
{{:Cleaver Mastery}}
|-
{{:Sword Mastery}}
|-
{{:Dagger Mastery}}
|-
{{:Polearm Mastery}}
|-
{{:Spear Mastery}}
|-
{{:Crossbow Mastery}}
|-
{{:Bow Mastery}}
|-
{{:Throwing Mastery}}
|}

==Tier 5==
[[File:Bb t5.png|centre|thumb|667x667px]]
{| class="article-table" width="100%"
!style="width:27%; text-align:center;"|'''Perk'''
!style="width:73%; text-align:center;"|'''Description'''
|-
{{:Reach Advantage}}
|-
{{:Overwhelm}}
|-
{{:Lone Wolf (Perk)}}
|-
{{:Underdog}}
|-
{{:Footwork (Perk)}}
|}

==Tier 6==
[[File:Bb t6.png|centre|thumb|667x667px]]
{| class="article-table" width="100%"
!style="width:27%; text-align:center;"|'''Perk'''
!style="width:73%; text-align:center;"|'''Description'''
|-
{{:Berserk}}
|-
{{:Head Hunter}}
|-
{{:Nimble}}
|-
{{:Battle Forged}}
|}

==Tier 7==
[[File:Bb t7.png|centre|thumb|667x667px]]
{| class="article-table" width="100%"
!style="width:27%; text-align:center;"|'''Perk'''
!style="width:73%; text-align:center;"|'''Description'''
|-
{{:Fearsome}}
|-
{{:Duelist}}
|-
{{:Killing Frenzy}}
|-
{{:Indomitable (Perk)}}
|}

==References==
{{reflist}}
[[Category:Game Mechanics]]


# PAGE Traits

== Character Traits ==
[[File:TraitsConcept.jpg|thumb|290px|Trait concept drawings.]]
New recruits to your mercenary company may have 0 to 2 randomly selected traits that affect their stats in positive and/or negative ways. Some backgrounds will disallow certain traits, as will some traits disallow others.<br />
For example, a character can not be both physically strong and weak, or eagle-eyed and short-sighted.

Also, traits can allow certain events to trigger or certain new options for other events. Occasionally, new traits (such as "Fat") can be suffered through events or certain event choices.

For a list of events associated with one or more specific Trait(s), look [[Global_map_events#Events_by_Trait|here]].

{|class="article-table sortable"
! align="center" |Trait
! class="unsortable" align="center" |Effects
! class="unsortable" align="center" |Notes & Events
|-
{{:Acolyte of Davkul}}
|-
{{:Addict}}
|-
{{:Ailing}}
|-
{{:Arena Fighter}}
|-
{{:Arena Veteran}}
|-
{{:Asthmatic}}
|-
{{:Athletic}}
|-
{{:Bleeder}}
|-
{{:Bloodthirsty}}
|-
{{:Brave}}
|-
{{:Bright}}
|-
{{:Brute}}
|-
{{:Chosen of Davkul}}
|-
{{:Clubfooted}}
|-
{{:Clumsy}}
|-
{{:Cocky}}
|-
{{:Craven}}
|-
{{:Dastard}}
|-
{{:Deathwish}}
|-
{{:Determined}}
|-
{{:Dexterous}}
|-
{{:Disciple of Davkul}}
|-
{{:Disloyal}}
|-
{{:Drunkard}}
|-
{{:Dumb}}
|-
{{:Eagle Eyes}}
|-
{{:Fainthearted}}
|-
{{:Fanatic of Davkul}}
|-
{{:Fat}}
|-
{{:Fear of Beasts}}
|-
{{:Fear of Greenskins}}
|-
{{:Fear of Undead}}
|-
{{:Fearless}}
|-
{{:Fragile}}
|-
{{:Glorious Endurance}}
|-
{{:Glorious Quickness}}
|-
{{:Glorious Resolve}}
|-
{{:Gluttonous}}
|-
{{:Greedy}}
|-
{{:Hate for Beasts}}
|-
{{:Hate for Greenskins}}
|-
{{:Hate for Undead}}
|-
{{:Hesitant}}
|-
{{:Huge}}
|-
{{:Impatient}}
|-
{{:Insecure}}
|-
{{:Iron Lungs}}
|-
{{:Iron Jaw}}
|-
{{:Irrational}}
|-
{{:Loyal}}
|-
{{:Lucky}}
|-
{{:Mad}}
|-
{{:Night Blind}}
|-
{{:Night Owl}}
|-
{{:Old}}
|-
{{:Optimist}}
|-
{{:Paranoid}}
|-
{{:Pessimist}}
|-
{{:Pit Fighter}}
|-
{{:Player Character}}
|-
{{:Prophet of Davkul}}
|-
{{:Quick}}
|-
{{:Short Sighted}}
|-
{{:Spartan}}
|-
{{:Strong}}
|-
{{:Superstitious}}
|-
{{:Sure Footing}}
|-
{{:Survivor}}
|-
{{:Swift}}
|-
{{:Team Player}}
|-
{{:Tiny}}
|-
{{:Tough}}
|-
{{:Weasel}}
|-
{{:Zealot of Davkul}}
|}

[[Category:Traits]]
[[Category:Game Mechanics]]


# PAGE Injuries

[[File:InjuriesConceptDrawing.jpg|thumb|350px]]
Injuries are (mostly) negative status effects inflicted upon getting [[Hit Chance|hit]] for a certain amount of [[damage]] by regular attacks or sustained after some [[events]]. Injuries can be temporary or permanent.<ref name="dev_blog_79">[http://battlebrothersgame.com/dev-blog-79-progress-update-injury-mechanics/ ''Dev Blog #79: Progress Update – Injury Mechanics'']</ref>

==Temporary injuries==
:''Main article: [[Temporary Injuries]]''
===Effects===
{|class="sortable" style="width: 100%; text-align: center; font-size: small"
!style="background: black"|Name
!style="background: black"|[[File:Health.png|Hitpoints]]
!style="background: black"|[[File:Damage_received.png|Bleeding]]
!style="background: black"|[[File:Action_points.png|Action Points]]
!style="background: black"|[[File:Action_points_tile.png|Additional Action Points per tile]]
!style="background: black"|[[File:Fatigue.png|Fatigue]]
!style="background: black"|[[File:Fatigue_recovery.png|Fatigue recovery]]
!style="background: black"|[[File:Resolve.png|Resolve]]
!style="background: black"|[[File:Initiative.png|Initiative]]
!style="background: black"|[[File:Melee_skill.png|Melee Skill]]
!style="background: black"|[[File:Ranged_skill.png|Ranged Skill]]
!style="background: black"|[[File:Melee_defense.png|Melee Defense]]
!style="background: black"|[[File:Ranged_defense.png|Ranged Defense]]
!style="background: black"|[[File:Damage_dealt.png|Damage inflicted]]
!style="background: black"|[[File:Vision.png|Vision]]
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Broken Arm</span><span>[[File:injury_icon_18.png|35px]]</span></div>
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|−50%
|style="background: #141414"|−50%
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|−50%
|style="background: #141414"|
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Broken Leg</span><span>[[File:injury_icon_04.png|35px]]</span></div>
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|2
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|−40%
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Broken Nose</span><span>[[File:injury_icon_22.png|35px]]</span></div>
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|−5
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Broken Ribs</span><span>[[File:injury_icon_20.png|35px]]</span></div>
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|−40%
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Bruised Leg</span><span>[[File:injury_icon_26.png|35px]]</span></div>
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|1
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|−20%
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Burnt Face</span><span>[[File:injury_icon_48.png|35px]]</span></div>
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|−25%
|style="background: #141414"|−25%
|style="background: #141414"|−25%
|style="background: #141414"|−25%
|style="background: #141414"|
|style="background: #141414"|-2
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Burnt Hands</span><span>[[File:injury_icon_47.png|35px]]</span></div>
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|−25%
|style="background: #141414"|−25%
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Burnt Leg</span><span>[[File:injury_icon_46.png|35px]]</span></div>
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|1
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|−20%
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Crushed Finger</span><span>[[File:injury_icon_21.png|35px]]</span></div>
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|−5%
|style="background: #141414"|−5%
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Crushed Windpipe</span><span>[[File:injury_icon_38.png|35px]]</span></div>
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|−50%
|style="background: #141414"|−10
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Cut Achilles Tendon</span><span>[[File:injury_icon_28.png|35px]]</span></div>
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|2
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|−30%
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Cut Arm</span><span>[[File:injury_icon_07.png|35px]]</span></div>
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|−15%
|style="background: #141414"|−15%
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Cut Arm Sinew</span><span>[[File:injury_icon_33.png|35px]]</span></div>
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|−40%
|style="background: #141414"|
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Cut Artery</span><span>[[File:injury_icon_31.png|35px]]</span></div>
|style="background: #141414"|−35%
|style="background: #141414"|3
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Cut Leg Muscles</span><span>[[File:injury_icon_06.png|35px]]</span></div>
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|−40%
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|−40%
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Cut Neck Vein</span><span>[[File:injury_icon_30.png|35px]]</span></div>
|style="background: #141414"|−50%
|style="background: #141414"|6
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Deep Abdominal Cut</span><span>[[File:injury_icon_32.png|35px]]</span></div>
|style="background: #141414"|−25%
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|−25%
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Deep Chest Cut</span><span>[[File:injury_icon_09.png|35px]]</span></div>
|style="background: #141414"|−35%
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|−35%
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|−35%
|style="background: #141414"|−35%
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Deep Face Cut</span><span>[[File:injury_icon_10.png|35px]]</span></div>
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|−25%
|style="background: #141414"|−25%
|style="background: #141414"|−25%
|style="background: #141414"|−25%
|style="background: #141414"|
|style="background: #141414"|−2
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Dislocated Shoulder</span><span>[[File:injury_icon_03.png|35px]]</span></div>
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|−3
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Exposed Ribs</span><span>[[File:injury_icon_27.png|35px]]</span></div>
|style="background: #141414"|−35%
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Fractured Elbow</span><span>[[File:injury_icon_23.png|35px]]</span></div>
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|−25%
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Fractured Hand</span><span>[[File:injury_icon_01.png|35px]]</span></div>
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|−20%
|style="background: #141414"|−20%
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Fractured Ribs</span><span>[[File:injury_icon_02.png|35px]]</span></div>
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|−30%
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Fractured Skull</span><span>[[File:injury_icon_05.png|35px]]</span></div>
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|−50%
|style="background: #141414"|−50%
|style="background: #141414"|−50%
|style="background: #141414"|−50%
|style="background: #141414"|−50%
|style="background: #141414"|
|style="background: #141414"|−2
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Grazed Eye Socket</span><span>[[File:injury_icon_43.png|35px]]</span></div>
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|−50%
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|−2
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Grazed Kidney</span><span>[[File:injury_icon_37.png|35px]]</span></div>
|style="background: #141414"|−60%
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Grazed Neck</span><span>[[File:injury_icon_44.png|35px]]</span></div>
|style="background: #141414"|−15%
|style="background: #141414"|1
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Infected Wound</span><span>[[File:injury_icon_16.png|35px]]</span></div>
|style="background: #141414"|−25%
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|−25%
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Inhaled Flames</span><span>[[File:injury_icon_49.png|35px]]</span></div>
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|−2
|style="background: #141414"|
|style="background: #141414"|−40%
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Injured Knee Cap</span><span>[[File:injury_icon_40.png|35px]]</span></div>
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|2
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|−40%
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Injured Shoulder</span><span>[[File:injury_icon_12.png|35px]]</span></div>
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|−25%
|style="background: #141414"|
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Pierced Arm Muscles</span><span>[[File:injury_icon_13.png|35px]]</span></div>
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|−25%
|style="background: #141414"|−25%
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Pierced Cheek</span><span>[[File:injury_icon_45.png|35px]]</span></div>
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|−3
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Pierced Chest</span><span>[[File:injury_icon_35.png|35px]]</span></div>
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|−20%
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Pierced Hand</span><span>[[File:injury_icon_41.png|35px]]</span></div>
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|−20%
|style="background: #141414"|−20%
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Pierced Leg Muscles</span><span>[[File:injury_icon_11.png|35px]]</span></div>
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|−30%
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|−30%
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Pierced Lung</span><span>[[File:injury_icon_36.png|35px]]</span></div>
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|−60%
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Pierced Side</span><span>[[File:injury_icon_14.png|35px]]</span></div>
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|−20%
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Ripped Ear</span><span>[[File:injury_icon_42.png|35px]]</span></div>
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|−15%
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Severe Concussion</span><span>[[File:injury_icon_17.png|35px]]</span></div>
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|−50%
|style="background: #141414"|−50%
|style="background: #141414"|−50%
|style="background: #141414"|−50%
|style="background: #141414"|−50%
|style="background: #141414"|
|style="background: #141414"|−2
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Sickness</span><span>[[File:injury_icon_25.png|35px]]</span></div>
|style="background: #141414"|−25%
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|−25%
|style="background: #141414"|
|style="background: #141414"|−25%
|style="background: #141414"|−25%
|style="background: #141414"|−25%
|style="background: #141414"|−25%
|style="background: #141414"|−25%
|style="background: #141414"|−25%
|style="background: #141414"|
|style="background: #141414"|−2
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Smashed Hand</span><span>[[File:injury_icon_19.png|35px]]</span></div>
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|−40%
|style="background: #141414"|−40%
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Split Hand</span><span>[[File:injury_icon_08.png|35px]]</span></div>
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|−50%
|style="background: #141414"|−50%
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Split Nose</span><span>[[File:injury_icon_34.png|35px]]</span></div>
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|−5
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Split Shoulder</span><span>[[File:injury_icon_29.png|35px]]</span></div>
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|−50%
|style="background: #141414"|
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Sprained Ankle</span><span>[[File:injury_icon_24.png|35px]]</span></div>
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|1
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|-20%
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Stabbed Guts</span><span>[[File:injury_icon_39.png|35px]]</span></div>
|style="background: #141414"|−40%
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|−40%
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|}

===Parameters===
{|class="sortable" style="text-align: center"
!style="background: black"|Name
!style="background: black; vertical-align: bottom"|Type<br />
!style="background: black; vertical-align: bottom"|Part<br />
!style="background: black; vertical-align: bottom"|[[File:Hitpoints %.png|Threshold in % of max Hitpoints]]<br />
!style="background: black; vertical-align: bottom"|[[File:Days_wounded_min.png|Min days wounded]]<br />
!style="background: black; vertical-align: bottom"|[[File:Days_wounded_max.png|Max days wounded]]<br />
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Broken Arm</span><span>[[File:injury_icon_18.png|35px]]</span></div>
|style="background: #141414; padding: 6px"|Blunt
|style="background: #141414; padding: 6px"|Body
|style="background: #141414; padding: 6px"|50%
|style="background: #141414; padding: 6px"|5
|style="background: #141414; padding: 6px"|7
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Broken Leg</span><span>[[File:injury_icon_04.png|35px]]</span></div>
|style="background: #141414; padding: 6px"|Blunt
|style="background: #141414; padding: 6px"|Body
|style="background: #141414; padding: 6px"|50%
|style="background: #141414; padding: 6px"|5
|style="background: #141414; padding: 6px"|7
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Broken Nose</span><span>[[File:injury_icon_22.png|35px]]</span></div>
|style="background: #141414; padding: 6px"|Blunt
|style="background: #141414; padding: 6px"|Head
|style="background: #141414; padding: 6px"|25%
|style="background: #141414; padding: 6px"|3
|style="background: #141414; padding: 6px"|5
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Broken Ribs</span><span>[[File:injury_icon_20.png|35px]]</span></div>
|style="background: #141414; padding: 6px"|Blunt
|style="background: #141414; padding: 6px"|Body
|style="background: #141414; padding: 6px"|50%
|style="background: #141414; padding: 6px"|5
|style="background: #141414; padding: 6px"|7
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Bruised Leg</span><span>[[File:injury_icon_26.png|35px]]</span></div>
|style="background: #141414; padding: 6px"|Blunt
|style="background: #141414; padding: 6px"|Body
|style="background: #141414; padding: 6px"|25%
|style="background: #141414; padding: 6px"|2
|style="background: #141414; padding: 6px"|3
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Burnt Face</span><span>[[File:injury_icon_48.png|35px]]</span></div>
|style="background: #141414; padding: 6px"|Burning
|style="background: #141414; padding: 6px"|Head
|style="background: #141414; padding: 6px"|25%
|style="background: #141414; padding: 6px"|3
|style="background: #141414; padding: 6px"|4
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Burnt Hands</span><span>[[File:injury_icon_47.png|35px]]</span></div>
|style="background: #141414; padding: 6px"|Burning
|style="background: #141414; padding: 6px"|Body
|style="background: #141414; padding: 6px"|50%
|style="background: #141414; padding: 6px"|4
|style="background: #141414; padding: 6px"|5
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Burnt Leg</span><span>[[File:injury_icon_46.png|35px]]</span></div>
|style="background: #141414; padding: 6px"|Burning
|style="background: #141414; padding: 6px"|Body
|style="background: #141414; padding: 6px"|25%
|style="background: #141414; padding: 6px"|2
|style="background: #141414; padding: 6px"|3
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Crushed Finger</span><span>[[File:injury_icon_21.png|35px]]</span></div>
|style="background: #141414; padding: 6px"|Blunt
|style="background: #141414; padding: 6px"|Body
|style="background: #141414; padding: 6px"|25%
|style="background: #141414; padding: 6px"|2
|style="background: #141414; padding: 6px"|3
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Crushed Windpipe</span><span>[[File:injury_icon_38.png|35px]]</span></div>
|style="background: #141414; padding: 6px"|Blunt
|style="background: #141414; padding: 6px"|Head
|style="background: #141414; padding: 6px"|50%
|style="background: #141414; padding: 6px"|3
|style="background: #141414; padding: 6px"|5
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Crushed Windpipe</span><span>[[File:injury_icon_38.png|35px]]</span></div>
|style="background: #141414; padding: 6px"|Piercing
|style="background: #141414; padding: 6px"|Head
|style="background: #141414; padding: 6px"|50%
|style="background: #141414; padding: 6px"|3
|style="background: #141414; padding: 6px"|5
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Cut Achilles Tendon</span><span>[[File:injury_icon_28.png|35px]]</span></div>
|style="background: #141414; padding: 6px"|Cutting
|style="background: #141414; padding: 6px"|Body
|style="background: #141414; padding: 6px"|50%
|style="background: #141414; padding: 6px"|3
|style="background: #141414; padding: 6px"|5
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Cut Arm</span><span>[[File:injury_icon_07.png|35px]]</span></div>
|style="background: #141414; padding: 6px"|Cutting
|style="background: #141414; padding: 6px"|Body
|style="background: #141414; padding: 6px"|25%
|style="background: #141414; padding: 6px"|2
|style="background: #141414; padding: 6px"|4
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Cut Arm Sinew</span><span>[[File:injury_icon_33.png|35px]]</span></div>
|style="background: #141414; padding: 6px"|Cutting
|style="background: #141414; padding: 6px"|Body
|style="background: #141414; padding: 6px"|25%
|style="background: #141414; padding: 6px"|4
|style="background: #141414; padding: 6px"|6
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Cut Artery</span><span>[[File:injury_icon_31.png|35px]]</span></div>
|style="background: #141414; padding: 6px"|Cutting
|style="background: #141414; padding: 6px"|Body
|style="background: #141414; padding: 6px"|25%
|style="background: #141414; padding: 6px"|1
|style="background: #141414; padding: 6px"|3
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Cut Leg Muscles</span><span>[[File:injury_icon_06.png|35px]]</span></div>
|style="background: #141414; padding: 6px"|Cutting
|style="background: #141414; padding: 6px"|Body
|style="background: #141414; padding: 6px"|25%
|style="background: #141414; padding: 6px"|3
|style="background: #141414; padding: 6px"|5
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Cut Neck Vein</span><span>[[File:injury_icon_30.png|35px]]</span></div>
|style="background: #141414; padding: 6px"|Cutting
|style="background: #141414; padding: 6px"|Head
|style="background: #141414; padding: 6px"|50%
|style="background: #141414; padding: 6px"|1
|style="background: #141414; padding: 6px"|4
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Deep Abdominal Cut</span><span>[[File:injury_icon_32.png|35px]]</span></div>
|style="background: #141414; padding: 6px"|Cutting
|style="background: #141414; padding: 6px"|Body
|style="background: #141414; padding: 6px"|25%
|style="background: #141414; padding: 6px"|3
|style="background: #141414; padding: 6px"|4
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Deep Chest Cut</span><span>[[File:injury_icon_09.png|35px]]</span></div>
|style="background: #141414; padding: 6px"|Cutting
|style="background: #141414; padding: 6px"|Body
|style="background: #141414; padding: 6px"|50%
|style="background: #141414; padding: 6px"|5
|style="background: #141414; padding: 6px"|6
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Deep Face Cut</span><span>[[File:injury_icon_10.png|35px]]</span></div>
|style="background: #141414; padding: 6px"|Cutting
|style="background: #141414; padding: 6px"|Head
|style="background: #141414; padding: 6px"|50%
|style="background: #141414; padding: 6px"|2
|style="background: #141414; padding: 6px"|3
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Dislocated Shoulder</span><span>[[File:injury_icon_03.png|35px]]</span></div>
|style="background: #141414; padding: 6px"|Blunt
|style="background: #141414; padding: 6px"|Body
|style="background: #141414; padding: 6px"|50%
|style="background: #141414; padding: 6px"|5
|style="background: #141414; padding: 6px"|7
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Exposed Ribs</span><span>[[File:injury_icon_27.png|35px]]</span></div>
|style="background: #141414; padding: 6px"|Cutting
|style="background: #141414; padding: 6px"|Body
|style="background: #141414; padding: 6px"|35%
|style="background: #141414; padding: 6px"|3
|style="background: #141414; padding: 6px"|6
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Fractured Elbow</span><span>[[File:injury_icon_23.png|35px]]</span></div>
|style="background: #141414; padding: 6px"|Blunt
|style="background: #141414; padding: 6px"|Body
|style="background: #141414; padding: 6px"|25%
|style="background: #141414; padding: 6px"|3
|style="background: #141414; padding: 6px"|5
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Fractured Hand</span><span>[[File:injury_icon_01.png|35px]]</span></div>
|style="background: #141414; padding: 6px"|Blunt
|style="background: #141414; padding: 6px"|Body
|style="background: #141414; padding: 6px"|25%
|style="background: #141414; padding: 6px"|3
|style="background: #141414; padding: 6px"|4
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Fractured Ribs</span><span>[[File:injury_icon_02.png|35px]]</span></div>
|style="background: #141414; padding: 6px"|Blunt
|style="background: #141414; padding: 6px"|Body
|style="background: #141414; padding: 6px"|25%
|style="background: #141414; padding: 6px"|3
|style="background: #141414; padding: 6px"|4
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Fractured Skull</span><span>[[File:injury_icon_05.png|35px]]</span></div>
|style="background: #141414; padding: 6px"|Blunt
|style="background: #141414; padding: 6px"|Head
|style="background: #141414; padding: 6px"|60%
|style="background: #141414; padding: 6px"|6
|style="background: #141414; padding: 6px"|9
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Grazed Eye Socket</span><span>[[File:injury_icon_43.png|35px]]</span></div>
|style="background: #141414; padding: 6px"|Piercing
|style="background: #141414; padding: 6px"|Head
|style="background: #141414; padding: 6px"|50%
|style="background: #141414; padding: 6px"|2
|style="background: #141414; padding: 6px"|4
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Grazed Kidney</span><span>[[File:injury_icon_37.png|35px]]</span></div>
|style="background: #141414; padding: 6px"|Piercing
|style="background: #141414; padding: 6px"|Body
|style="background: #141414; padding: 6px"|50%
|style="background: #141414; padding: 6px"|3
|style="background: #141414; padding: 6px"|6
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Grazed Neck</span><span>[[File:injury_icon_44.png|35px]]</span></div>
|style="background: #141414; padding: 6px"|Cutting
|style="background: #141414; padding: 6px"|Head
|style="background: #141414; padding: 6px"|25%
|style="background: #141414; padding: 6px"|1
|style="background: #141414; padding: 6px"|2
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Grazed Neck</span><span>[[File:injury_icon_44.png|35px]]</span></div>
|style="background: #141414; padding: 6px"|Piercing
|style="background: #141414; padding: 6px"|Head
|style="background: #141414; padding: 6px"|25%
|style="background: #141414; padding: 6px"|1
|style="background: #141414; padding: 6px"|2
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Infected Wound</span><span>[[File:injury_icon_16.png|35px]]</span></div>
|style="background: #141414; padding: 6px"|
|style="background: #141414; padding: 6px"|
|style="background: #141414; padding: 6px"|
|style="background: #141414; padding: 6px"|3
|style="background: #141414; padding: 6px"|4
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Inhaled Flames</span><span>[[File:injury_icon_49.png|35px]]</span></div>
|style="background: #141414; padding: 6px"|Burning
|style="background: #141414; padding: 6px"|Head
|style="background: #141414; padding: 6px"|50%
|style="background: #141414; padding: 6px"|4
|style="background: #141414; padding: 6px"|6
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Injured Knee Cap</span><span>[[File:injury_icon_40.png|35px]]</span></div>
|style="background: #141414; padding: 6px"|Piercing
|style="background: #141414; padding: 6px"|Body
|style="background: #141414; padding: 6px"|50%
|style="background: #141414; padding: 6px"|5
|style="background: #141414; padding: 6px"|8
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Injured Shoulder</span><span>[[File:injury_icon_12.png|35px]]</span></div>
|style="background: #141414; padding: 6px"|Piercing
|style="background: #141414; padding: 6px"|Body
|style="background: #141414; padding: 6px"|25%
|style="background: #141414; padding: 6px"|3
|style="background: #141414; padding: 6px"|4
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Pierced Arm Muscles</span><span>[[File:injury_icon_13.png|35px]]</span></div>
|style="background: #141414; padding: 6px"|Piercing
|style="background: #141414; padding: 6px"|Body
|style="background: #141414; padding: 6px"|25%
|style="background: #141414; padding: 6px"|3
|style="background: #141414; padding: 6px"|4
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Pierced Cheek</span><span>[[File:injury_icon_45.png|35px]]</span></div>
|style="background: #141414; padding: 6px"|Cutting
|style="background: #141414; padding: 6px"|Head
|style="background: #141414; padding: 6px"|25%
|style="background: #141414; padding: 6px"|1
|style="background: #141414; padding: 6px"|2
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Pierced Cheek</span><span>[[File:injury_icon_45.png|35px]]</span></div>
|style="background: #141414; padding: 6px"|Piercing
|style="background: #141414; padding: 6px"|Head
|style="background: #141414; padding: 6px"|25%
|style="background: #141414; padding: 6px"|1
|style="background: #141414; padding: 6px"|2
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Pierced Chest</span><span>[[File:injury_icon_35.png|35px]]</span></div>
|style="background: #141414; padding: 6px"|Piercing
|style="background: #141414; padding: 6px"|Body
|style="background: #141414; padding: 6px"|25%
|style="background: #141414; padding: 6px"|3
|style="background: #141414; padding: 6px"|4
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Pierced Hand</span><span>[[File:injury_icon_41.png|35px]]</span></div>
|style="background: #141414; padding: 6px"|Piercing
|style="background: #141414; padding: 6px"|Body
|style="background: #141414; padding: 6px"|25%
|style="background: #141414; padding: 6px"|3
|style="background: #141414; padding: 6px"|4
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Pierced Leg Muscles</span><span>[[File:injury_icon_11.png|35px]]</span></div>
|style="background: #141414; padding: 6px"|Piercing
|style="background: #141414; padding: 6px"|Body
|style="background: #141414; padding: 6px"|25%
|style="background: #141414; padding: 6px"|3
|style="background: #141414; padding: 6px"|5
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Pierced Lung</span><span>[[File:injury_icon_36.png|35px]]</span></div>
|style="background: #141414; padding: 6px"|Piercing
|style="background: #141414; padding: 6px"|Body
|style="background: #141414; padding: 6px"|50%
|style="background: #141414; padding: 6px"|5
|style="background: #141414; padding: 6px"|7
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Pierced Side</span><span>[[File:injury_icon_14.png|35px]]</span></div>
|style="background: #141414; padding: 6px"|Piercing
|style="background: #141414; padding: 6px"|Body
|style="background: #141414; padding: 6px"|25%
|style="background: #141414; padding: 6px"|3
|style="background: #141414; padding: 6px"|4
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Ripped Ear</span><span>[[File:injury_icon_42.png|35px]]</span></div>
|style="background: #141414; padding: 6px"|Cutting
|style="background: #141414; padding: 6px"|Head
|style="background: #141414; padding: 6px"|25%
|style="background: #141414; padding: 6px"|2
|style="background: #141414; padding: 6px"|3
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Ripped Ear</span><span>[[File:injury_icon_42.png|35px]]</span></div>
|style="background: #141414; padding: 6px"|Piercing
|style="background: #141414; padding: 6px"|Head
|style="background: #141414; padding: 6px"|25%
|style="background: #141414; padding: 6px"|2
|style="background: #141414; padding: 6px"|3
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Severe Concussion</span><span>[[File:injury_icon_17.png|35px]]</span></div>
|style="background: #141414; padding: 6px"|Blunt
|style="background: #141414; padding: 6px"|Head
|style="background: #141414; padding: 6px"|50%
|style="background: #141414; padding: 6px"|3
|style="background: #141414; padding: 6px"|5
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Sickness</span><span>[[File:injury_icon_25.png|35px]]</span></div>
|style="background: #141414; padding: 6px"|
|style="background: #141414; padding: 6px"|
|style="background: #141414; padding: 6px"|
|style="background: #141414; padding: 6px"|1
|style="background: #141414; padding: 6px"|3
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Smashed Hand</span><span>[[File:injury_icon_19.png|35px]]</span></div>
|style="background: #141414; padding: 6px"|Blunt
|style="background: #141414; padding: 6px"|Body
|style="background: #141414; padding: 6px"|50%
|style="background: #141414; padding: 6px"|4
|style="background: #141414; padding: 6px"|6
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Split Hand</span><span>[[File:injury_icon_08.png|35px]]</span></div>
|style="background: #141414; padding: 6px"|Cutting
|style="background: #141414; padding: 6px"|Body
|style="background: #141414; padding: 6px"|50%
|style="background: #141414; padding: 6px"|5
|style="background: #141414; padding: 6px"|7
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Split Nose</span><span>[[File:injury_icon_34.png|35px]]</span></div>
|style="background: #141414; padding: 6px"|Cutting
|style="background: #141414; padding: 6px"|Head
|style="background: #141414; padding: 6px"|25%
|style="background: #141414; padding: 6px"|2
|style="background: #141414; padding: 6px"|4
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Split Shoulder</span><span>[[File:injury_icon_29.png|35px]]</span></div>
|style="background: #141414; padding: 6px"|Cutting
|style="background: #141414; padding: 6px"|Body
|style="background: #141414; padding: 6px"|50%
|style="background: #141414; padding: 6px"|4
|style="background: #141414; padding: 6px"|6
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Sprained Ankle</span><span>[[File:injury_icon_24.png|35px]]</span></div>
|style="background: #141414; padding: 6px"|Blunt
|style="background: #141414; padding: 6px"|Body
|style="background: #141414; padding: 6px"|25%
|style="background: #141414; padding: 6px"|2
|style="background: #141414; padding: 6px"|3
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Stabbed Guts</span><span>[[File:injury_icon_39.png|35px]]</span></div>
|style="background: #141414; padding: 6px"|Piercing
|style="background: #141414; padding: 6px"|Body
|style="background: #141414; padding: 6px"|50%
|style="background: #141414; padding: 6px"|3
|style="background: #141414; padding: 6px"|5
|}

==Permanent injuries==
:''Main article: [[Permanent Injuries]]''
{|class="sortable" style="width: 100%; text-align: center; font-size: small"
!style="background: black"|Name
!style="background: black"|[[File:Health.png|Hitpoints]]
!style="background: black"|[[File:Action_points_tile.png|Additional Action Points per tile]]
!style="background: black"|[[File:Fatigue.png|Fatigue]]
!style="background: black"|[[File:Resolve.png|Resolve]]
!style="background: black"|[[File:Initiative.png|Initiative]]
!style="background: black"|[[File:Melee_skill.png|Melee Skill]]
!style="background: black"|[[File:Ranged_skill.png|Ranged Skill]]
!style="background: black"|[[File:Melee_defense.png|Melee Defense]]
!style="background: black"|[[File:Ranged_defense.png|Ranged Defense]]
!style="background: black"|[[File:Vision.png|Vision]]
!style="background: black"|[[File:Xp_received.png|Experience gain]]
!style="background: black"|Content in reserve
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Brain Damage</span><span style="margin-right: 3px">[[File:injury_permanent_icon_12.png|35px]]</span></div>
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|<span style="color: green">+15%</span>
|style="background: #141414"|−25%
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|−25%
|style="background: #141414"|
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Broken Elbow Joint</span><span style="margin-right: 3px">[[File:injury_permanent_icon_08.png|35px]]</span></div>
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|−20%
|style="background: #141414"|−20%
|style="background: #141414"|−30%
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|✓
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Broken Knee</span><span style="margin-right: 3px">[[File:injury_permanent_icon_11.png|35px]]</span></div>
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|−40%
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|−40%
|style="background: #141414"|−40%
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|✓
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Partly Collapsed Lung</span><span style="margin-right: 3px">[[File:injury_permanent_icon_05.png|35px]]</span></div>
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|−40%
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|✓
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Maimed Foot</span><span style="margin-right: 3px">[[File:injury_permanent_icon_06.png|35px]]</span></div>
|style="background: #141414"|
|style="background: #141414"|1
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|−20%
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|✓
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Missing Ear</span><span style="margin-right: 3px">[[File:injury_permanent_icon_01.png|35px]]</span></div>
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|−10%
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Missing Eye</span><span style="margin-right: 3px">[[File:injury_permanent_icon_03.png|35px]]</span></div>
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|−50%
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|−2
|style="background: #141414"|
|style="background: #141414"|
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Missing Finger</span><span style="margin-right: 3px">[[File:injury_permanent_icon_02.png|35px]]</span></div>
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|−5%
|style="background: #141414"|−5%
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Missing Nose</span><span style="margin-right: 3px">[[File:injury_permanent_icon_04.png|35px]]</span></div>
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|−10%
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Traumatized</span><span style="margin-right: 3px">[[File:injury_permanent_icon_13.png|35px]]</span></div>
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|−40%
|style="background: #141414"|−30%
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|✓
|-
!style="white-space: nowrap; text-align: left; background: black"|<div style="display: flex; align-items: center"><span style="flex-grow: 1; text-align: right; margin: 6px">Weakened Heart</span><span style="margin-right: 3px">[[File:injury_permanent_icon_14.png|35px]]</span></div>
|style="background: #141414"|−30%
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|
|style="background: #141414"|✓
|}

==References==
{{reflist}}
[[Category:Injuries]]
[[Category:Game Mechanics]]


# PAGE Mood

__FORCETOC__
== Mood  ==
Moods affect starting morale of men in combat and are influenced by various events. The common positive ones being winning battles, gaining confidence in leadership (completed an ambition) and the common negative ones being lost a brother in battle, dismissed men without compensation. Every day, in the absence of other factors/events, mood slowly trends towards 50% or Content.

== Mood State ==

[[File:Good_mood.png|24px]] <span style="font-size:larger;">Euphoric (86% to 100%)</span><br />
&#8226; Recent events have left this character in a state of euphoria, happy to spend his time in the service of the company and sure of victory against any foe. Its bordering on the annoying really.<br />
&#8226; Has a 75% chance of starting at confident morale.

[[File:Mood_06.png|24px]] <span style="font-size:larger;">Eager (73% to 85%)</span><br />
&#8226; Recent events have left this character eager to fight with the company, pleased with how things are going and motivating to those around him.<br />
&#8226; Has a 50% chance of starting at confident morale.

[[File:Mood_05.png|24px]] <span style="font-size:larger;">In Good Spirits (58% to 72%)</span><br />
&#8226; Recent events have left this character in good spirit. It will probably pass as reality takes a grip again, but for now, things are looking well.<br />
&#8226; Has a 25% chance of starting at confident morale.

[[File:Mood_04.png|24px]] <span style="font-size:larger;">Content (43% to 57%)</span><br />
&#8226; The character is content with how things are going. Could be better, could be worse.<br /> 
&#8226; Mood will always trend to this state over time.

[[File:Mood_03.png|24px]] <span style="font-size:larger;">Dissatisfied (31% to 42%)</span><br />
&#8226; Not uncommon for someone living the hardships of mercenary life, this character isn't quite satisfied and is hoping for things to improve.<br />
&#8226; Can only have steady morale or worse.

[[File:Mood_02.png|24px]] <span style="font-size:larger;">Disgruntled (16% to 30%)</span><br />
&#8226; Recent events have left his character disgruntled and disappointed how things are going. It may fade, or it may get a lot worse if other events tip him over the edge.<br />
&#8226; Can only have wavering morale or worse.

[[File:Bad_mood.png|24px]] <span style="font-size:larger;">Angry (0% to 15%)</span><br />
&#8226; Recent events have left this character angry and vengeful towards around him. If things don't improve very quickly, this character may decide to desert the company.<br />
&#8226; Can only have breaking morale or worse.

== Mood Changes ==
Below is a List of common actions that can change a brothers mood. There are also [[Events]] that change the mood, but the change is different for each [[Events|Event]]. Too many to list them here anyway.

{| class="table"
| valign="top" width="39%" |{{Mood Change (negative)}}
| valign="top" width="22%" |{{Mood Level, Mood Score}}
| valign="top" width="39%" |{{Mood Change (positive)}}
|}

[[Category:Game Mechanics]]


# PAGE Weapons

Weapons are divided into two categories: [[Melee Weapons]] and [[Ranged Weapons]].
__TOC__
='''[[Melee Weapons]]'''=
{{:Melee Weapons}}

='''[[Ranged Weapons]]'''=
{{:Ranged Weapons}}
[[Category:Weapons]]


# PAGE Armor

[[File:ArmorConceptDrawings.jpg|thumb|right|300px|<center>Concept drawings of ingame armor</center>]] See also: [[Named and Legendary Items]].

__TOC__

{{:Headgear}}

{{:Body Armor}}

{{:Shields}}

[[ru:Защита]]
[[Category:Armor]]
[[Category:Headgear]]
[[Category:Body Armor]]
[[Category:Shield]]
[[Category:Items]]


# PAGE Brigands

<onlyinclude>Brigands are one of many Human factions in Battle Brothers.</onlyinclude>

== Units ==
<onlyinclude>
{| class="article-table" style="text-align:center"
! style="text-align:center" |Icon
! style="text-align:center" |Name
! style="text-align:center" |[[File:Health.png|25px|Health]]
! style="text-align:center" |[[File:Armor head.png|25px|Head armor]]
! style="text-align:center" |[[File:Armor body.png|25px|Body armor]]
! style="text-align:center" |[[File:Melee skill.png|25px|Melee skill]]
! style="text-align:center" |[[File:Ranged skill.png|25px|Ranged skill]]
! style="text-align:center" |[[File:Melee defense.png|25px|Melee defense]]
! style="text-align:center" |[[File:Ranged defense.png|25px|Ranged defense]]
! style="text-align:center" |[[File:Resolve.png|25px|Resolve]]
! style="text-align:center" |[[File:Initiative.png|25px|Initiative]]
! style="text-align:center" |[[File:Fatigue.png|25px|Fatigue]]
! style="text-align:center" |[[File:Fatigue recovery.png|25px|Fatigue recovery]]
! style="text-align:center" |[[File:Action points.png|25px|Action points]]
! style="text-align:center" |[[File:Miniboss.png|25px|Champion probability]]
! style="text-align:center" |[[File:XP.png|25px|XP]]
|-
|[[File:Bandit thug orientation.png]]||[[Brigand Thug]]
|55||0-45||0-70||55||45||0||0||40||95||95||15||9||-||150
|-
|[[File:Bandit raider orientation.png]]||[[Lower Brigand Raider]]
|75||0-110||55-110||60||55||5||5||55||115||125||15||9||-||250
|-
|[[File:Bandit raider orientation.png]]||[[Brigand Raider]]
|75||0-140||55-110||65-70||55-60||10||10||55||115||125||20||9||-||250
|-
|[[File:Bandit poacher orientation.png]]||[[Brigand Poacher]]
|55||0-20||20||50||50||0||5||40||95||95||15||9||-||175
|-
|[[File:Bandit marksman orientation.png]]||[[Lower Brigand Marksman]]
|60||0-20||20||50||50||5||10-15||50||100||115||20||9||-||225
|-
|[[File:Bandit marksman orientation.png]]||[[Brigand Marksman]]
|60||0-45||20-70||50||60||5||10-15||50||110||115||20||9||-||225
|-
|[[File:Bandit marauder orientation.png]]||[[Brigand Marauder]]
|115||20-245||140-255||75||65||15||10||70||115||130||20||9||-||300
|-
|[[File:Bandit leader orientation.png]]||[[Brigand Leader]]
|100||90-250||90-210||75||65||15||10||70||125||130||20||9||1%||375
|-
|[[File:Swordmaster orientation.png]]||[[Swordmaster (Enemy)|Swordmaster]]
|70||0-200||115-190||100||50||80||15||90||115||115||20||9||2%||450
|-
|[[File:Hedge knight orientation.png]]||[[Hedge Knight (Enemy)|Hedge Knight]]
|150||280-300||210-320||85||50||25||15||90||105||160||25||9||2%||450
|-
|[[File:Mercenary orientation.png]]||[[Master Archer]]
|80||0-30||35-115||65||85||15||25||70||140||135||20||9||2%||450
|-
|[[File:Bandit raider orientation.png]]||[[Disguised Bandit]]
|75||0-140||70-130||65-70||55-60||10||10||55||115||125||20||9||-||250
|-
|[[File:Dog 01 orientation.png]]||[[Wardog]]
|50||0||0||50||-||20||25||40||130||130||15||12||-||75
|}
</onlyinclude>
== Tactics ==
In the early game Brigand groups usually consist of [[Brigand Thug|Thugs]] and sometimes [[Brigand Raider|Raiders]]. Later, Raiders become more common, ranged attackers appear and their numbers increase, and armored [[Brigand Marauder|Marauders]] can spawn. In the late game you will usually see a [[Brigand Leader]] and other elite enemies among them.

Their backline usually consists of [[Brigand Marksman|Marksmen]] who give Brigands ranged superiority, and if they think they have it, they will stand their ground and shoot at you. It is especially true when you attack their fortified camps. [[Crossbows|Crossbow]]<nowiki/>men are especially deadly in the middle game. However, Brigands are often too undisciplined to maintain formation. Some of them can run towards you even when they have ranged superiority.

They have [[Throwing Weapons|throwing weapons]] and try to use them, but lack of [[Quick Hands]] makes them not suited for this strategy.

{{Navbox Enemies}}

[[Category:Factions]]
[[Category:Enemies]]


# PAGE Goblins

Goblins are one of two Greenskin factions. [[Orcs]] are the other, and they unite during the Greenskin Invasion.

==Units==
{| class="article-table" style="text-align:center"
! style="text-align:center" |Icon
! style="text-align:center" |Name
! style="text-align:center" |[[File:Health.png|25px|Health]]
! style="text-align:center" |[[File:Armor head.png|25px|Head armor]]
! style="text-align:center" |[[File:Armor body.png|25px|Body armor]]
! style="text-align:center" |[[File:Melee skill.png|25px|Melee skill]]
! style="text-align:center" |[[File:Ranged skill.png|25px|Ranged skill]]
! style="text-align:center" |[[File:Melee defense.png|25px|Melee defense]]
! style="text-align:center" |[[File:Ranged defense.png|25px|Ranged defense]]
! style="text-align:center" |[[File:Resolve.png|25px|Resolve]]
! style="text-align:center" |[[File:Initiative.png|25px|Initiative]]
! style="text-align:center" |[[File:Fatigue.png|25px|Fatigue]]
! style="text-align:center" |[[File:Fatigue recovery.png|25px|Fatigue recovery]]
! style="text-align:center" |[[File:Action points.png|25px|Action points]]
! style="text-align:center" |[[File:Miniboss.png|25px|Champion probability]]
! style="text-align:center" |[[File:XP.png|25px|XP]]
|-
|[[File:Goblin 01 orientation.png]]||[[Goblin Skirmisher|Lower Goblin Skirmisher]]
|40||0-40||45-55||70||60||15||5||55||130||100||20||9||-||200
|-
|[[File:Goblin 01 orientation.png]]||[[Goblin Skirmisher]]
|40||40-90||45-90||75||65-70||20-25||10-15||55||130||100||20||9||1%||200
|-
|[[File:Goblin 04 orientation.png]]||[[Goblin Ambusher|Lower Goblin Ambusher]]
|40||25||35||55||70||5||15||45||140||100||15||9||-||250
|-
|[[File:Goblin 04 orientation.png]]||[[Goblin Ambusher]]
|40||25||35||60||75||10||20||45||140||100||15||9||1%||250
|-
|[[File:Goblin 05 orientation.png]]||[[Goblin Wolfrider]]
|60||40-90||55-90||75||50||15||15||60||130||150||20||13||-||150
|-
|[[File:Goblin 06 orientation.png]]||[[Goblin Wolf]]
|40||-||-||65||-||15||10||40||140||150||20||12||-||100
|-
|[[File:Goblin 02 orientation.png]]||[[Goblin Shaman]]
|70||35||45||60||60||10||20||70||110||90||15||9||-||350
|-
|[[File:Goblin 03 orientation.png]]||[[Goblin Overseer]]
|70||120||180||75||80||15||20||70||120||130||15||9||-||400
|-
|[[File:Catapult siege engine.png]]||[[Greenskin Catapult]]
|250||-||-||-||-||-30||-20||-||-||200||-||-||-||50
|}

==Tactics==
Goblins are weak but evasive, like ranged combat and deal extra direct damage. Even their melee fighters use [[Throwing Weapons|throwing weapons]] a lot, and [[Goblin Shaman|Shamans]] have a [[Grant Night Vision (5 fatigue)|spell]] to remove a ranged attackers' weakness, nighttime debuffs.

Their strategy in general has one main goal: preventing you from starting a proper melee fight. [[Goblin Skirmisher|Skirmishers]] throw [[Throwing Net|nets]], [[Goblin Ambusher|Ambushers]] reduce your AP with their poison, and Shamans use their magic to [[Root (15 fatigue)|grow vines]] that entangle you. Melee skill is very useful both for hitting evasive Goblins and breaking free from nets and vines.

[[Goblin Wolfrider|Wolfriders]] are their cavalry. Avoiding direct combat, they try to encircle your squad and strike from behind.

Goblins' weapons are light and can not penetrate heavy armor, but [[Notched Blade|Notched Blades]] can [[Puncture (20 fatigue)|puncture]] right through it. [[Goblin Overseer|Overseers]] have [[Spiked Impaler|heavy crossbows]] for penetrating it.

All goblins have [[Footwork (Perk)|Footwork]] with fatigue cost halved.

==Description==
[[File:GoblinsConcept.jpg|thumb|400px|Goblins concept drawings]]
Many [[Goblins]] and [[Orcs]] are known as "Greenskins". Goblins are smaller than humans and appear to be weaker. Instead of brute force they usually ambush their enemies. (Hit-and-run attacks). They use [[Goblin_Poison|poisoned]] [[Ranged_Weapons#Bows|arrows]] and [[Melee_Weapons#One-Handed_Swords|weapons]].

=== Political and Social Structure ===
Goblins live in the lands beyond the reach of human civilization, in small states of their own, often encompassing only a single but heavily populated city. Distant relatives to the Orcs, they don’t have much in common apart from the colour of their skin and hatred for humans. Goblin camps and armor are often adorned with their victims' remains, and prisoners are frequently fed to their wolves.

Goblins have a complex social structure of different castes, the two most important of which are the lower caste and the political caste. The lower caste is the most populated by far, and members are born into servitude to their state or city, with very little rights other than to work for the benefit of the great Goblin state. They can be drafted into service at any time or otherwise assigned tasks with no say of their own. Although they make up the backbone of any Goblin state, they’re considered somewhat expendable, and their individual lives don’t matter all that much in the pursuit of power for members of the political caste.

Unlike most humans, Goblins are not ruled by a single individual, but a council drawn from the political caste. The council decides on any action the Goblin state should or should not take and may mandate the drafting of Goblins from the lower caste led by a Goblin Overseer to perform any task, such as to attack rival Goblin states. Members of the council often change as individuals bribe, scheme or even assassinate to get rid of their rivals and attempt to secure more power for themselves. Although the council will proclaim that any action is for the betterment of the state, in reality, many decisions are the result of political backstabbing, such as sending a rival council member to oversee an attack knowing full well that he’ll get killed along with all the other Goblins sent there. A political victory, sure, but also an example of Goblin states repeatedly weakening themselves.

Goblins do not share a language with Orcs and otherwise have little in common, but they are nevertheless able to communicate with them on some level. To avoid roaming Orc tribes raiding their city states they often pay tribute until they’ve passed, and sometimes fight them if they seem weak enough in numbers. Orcs have also been used in political machinations and sent against rival Goblin states – which backfired more than once. Goblins consider roaming tribes of Orcs almost a force of nature outside of their other rivalries. They’re considered primitive, stupid even. They can be avoided at times, used at other times. But there is no stopping nature in the long run. At times the two Greenskin races have united into great hordes, fighting side by side as they invade human lands to pillage and destroy.

=== Military Structure ===
The vast majority of goblins seen in Battle Brothers are low-caste footsoldiers, either armed in light armor and equipped with simple melee weapons or given homemade bows and improvised ghillie suits made of local vegetation. These soldiers are often sent on raids or to garrison forward-operating camps by themselves; however, in some cases, members of the overseer caste or priestly order step up and lead attacks themselves. These are the highest priorities in battle; the priests are able to entangle up to seven mercenaries per turn, as opposed to net-wielding infantry that have one opportunity to entangle one soldier, where as the overseers can motivate their charges, bringing them either to confident morale or baseline morale if the goblin is fleeing, and also have stake-launchers that, while slightly less accurate than human crossbows, can knock back their targets and hit just as hard as an arbalest. Though no indications exist in-game, it can be safely assumed, given the traditional status of cavalry, that Wolfriders occupy a social status below the leadership but above the troops walking on their own feet.

=== Military Tactics ===
Cruel, cunning, and cowardly, Goblins rely on dirty tricks, debilitating poisons, and overwhelming numbers to defeat their foes, but will quickly flee if a battle turns against them.

An average Goblin is physically weaker than a human and about the size of a large child. Due to their small size they’re unable to wear heavy armor or wield heavy weaponry, and they can’t take a lot of physical punishment before going down. They don’t have the most stamina and they’re also not the bravest, though the latter may be in part due to being essentially forced into arms.

On the other hand, Goblins are dexterous little creatures. They use their small weapons with astounding accuracy to go for weak spots in their opponent’s armor, and because of their size and general skittishness are harder to hit reliably than many other opponents. Goblins are also quite cunning and intelligent. They make up for their lack of physical strength by relying on their wits, ambushes, dirty tricks, poisons, and superior numbers to wear their opponents down. Because they’re at an inherent disadvantage in open battle, most of their tactics revolve around the use of ranged weaponry; keeping their opponents pinned-down while flanking them using their Wolf riders.

Goblins are quite crafty and intelligent creatures, they have a whole arsenal of deadly tools available to them. Neither their armour nor weapons are particularly sturdy, given the Goblins’ physical limitations, but they’re well made and balanced. Their equipment emphasizes mobility; their armor is predominantly of leather as well as mail and a variety of scale armour. All of their weapons and tools can be looted and used by the player, although they aren’t the most damaging ones. Their armour can’t be looted as it would only fit a child.

A popular weapon with Goblin infantry is the ‘Spiked Bola’ – small iron balls with metal spikes bound together with rope, to be hurled at a target from a distance. Another specialized tool is the ‘Throwing Net’ – thrown at an opponent, it leaves them unable to move and lowers their ability to defend themselves. The ‘Jagged Pike’ can keep opponents at bay with its long range while inflicting terrible bleeding wounds.

{{Navbox Enemies}}

[[Category:Factions]]
[[Category:Enemies]]


# PAGE Orcs

Orcs are one of two Greenskin factions. [[Goblins]] are the other, and they unite during the Greenskin Invasion.

==Units==
{| class="article-table" style="text-align:center"
! style="text-align:center" |Icon
! style="text-align:center" |Name
! style="text-align:center" |[[File:Health.png|25px|Health]]
! style="text-align:center" |[[File:Armor head.png|25px|Head armor]]
! style="text-align:center" |[[File:Armor body.png|25px|Body armor]]
! style="text-align:center" |[[File:Melee skill.png|25px|Melee skill]]
! style="text-align:center" |[[File:Ranged skill.png|25px|Ranged skill]]
! style="text-align:center" |[[File:Melee defense.png|25px|Melee defense]]
! style="text-align:center" |[[File:Ranged defense.png|25px|Ranged defense]]
! style="text-align:center" |[[File:Resolve.png|25px|Resolve]]
! style="text-align:center" |[[File:Initiative.png|25px|Initiative]]
! style="text-align:center" |[[File:Fatigue.png|25px|Fatigue]]
! style="text-align:center" |[[File:Fatigue recovery.png|25px|Fatigue recovery]]
! style="text-align:center" |[[File:Action points.png|25px|Action points]]
! style="text-align:center" |[[File:Miniboss.png|25px|Champion probability]]
! style="text-align:center" |[[File:XP.png|25px|XP]]
|-
|[[File:Orc 04 orientation.png]]||[[Orc Young|Lower Orc Young]]
|125||0-60||0-80||60||50-55||-5||-5||65||120||150||25||9||-||250
|-
|[[File:Orc 04 orientation.png]]||[[Orc Young]]
|125||0-120||0-120||60||50-55||-5||-5||65||120||150||25||9||-||250
|-
|[[File:Orc 02 orientation.png]]||[[Orc Warrior|Lower Orc Warrior]]
|200||0-300||280-340||70-75||40||-10||-10||75||120||200||30||8||-||400
|-
|[[File:Orc 02 orientation.png]]||[[Orc Warrior]]
|200||240-360||280-400||70-75||40||-10||-10||75||120||200||30||8||1%||400
|-
|[[File:Orc 03 orientation.png]]||[[Orc Berserker]]
|250||0-120||0-110||70-75||30||5||5||90-95||125||200||35||9||-||350
|-
|[[File:Orc 01 orientation.png]]||[[Orc Warlord]]
|300||500||500||80-85||40||-10||-10||90||125||250||30||8||10%||500
|-
|[[File:Catapult siege engine.png]]||[[Greenskin Catapult]]
|250||-||-||-||-||-30||-20||-||-||200||-||-||-||50
|}

==Tactics==
Orcs are all very tough and strong. Their weapons are crude but very heavy, and Orcs also have damage modifiers, dealing even more damage with them. Stronger Orcs are immune to [[Stunned (Status Effect)|stun]] and pushback. All Orcs are easy to hit, having low or negative defense values, and their resolve also isn't very high.

Orc units either are glass cannons, like [[Orc Young|Young]] and [[Orc Berserker|Berserkers]], or wear heavy armor, like [[Orc Warrior|Warriors]] and [[Orc Warlord|Warlords]]. All their weapons are melee with the exception of [[Bundle of Crude Javelins|Crude Javelins]] sometimes used by Orc Young.

Orcs use their brute force to gain advantage: Young and sometimes Berserkers will [[Charge (25 fatigue)|jump onto you and stun]], and Warriors will [[Line Breaker (30 fatigue)|push]] your frontline fighters to reach usually more vulnerable backline.

== Description ==

[[File:OrcsConcept.jpg|thumb|400px|Orcs concept drawings]]
Orcs are large, bulky greenskins with great strength and vitality. Their culture revolves around violence and martial prowess, and their society is structured around the strong taking from the weak. Unlike the closely-related [[Goblins]], they are brutes which see little purpose in blacksmithing or agriculture, preferring to raid and pillage to get what they need. 

===Political and Social Structure===
Most Orcs live in nomadic clans, moving and setting up new camps to pillage other civilizations or clans. A typical clan is commanded by a Warlord - the strongest and biggest Orc in the clan. The rest of the Orcs obey him without question - unless someone feels strong enough to challenge him to a fight. Successions are usually in the form of armed combat and are often bloody. Constant small scale skirmishes and clan infighting are seen as the norm. Young Orcs often raid civilized settlements as Orc Marauders to prove themselves and to bring back weapons or tools for their clan.
{|
|-
|[[File:Orc_01.png|thumb|center]]||''The Orcish War Camp is where the Warlord resides. He often has many Warriors under his command. Beware his wrath.''
|-
|[[File:Orc_02.png|thumb|center]]||''Typical Orc Camp. Even in small numbers Orcs are a dangerous enemy.''
|-
| colspan="2" |Some really powerful Orcs who gain experience fighting human kingdoms or goblin cities start erecting permanent strongholds. Usually they are made from wood and earth. It's not a rare sight to see slaves grow food or tend to livestock nearby. Sometimes - more often than not - the slaves are livestock themselves as Orcs eat everything.
|-
|[[File:Orc_03.png|thumb|center]]||''Orcish Stronghold. The crude markings show the signs of subdued clans.''
|-
|[[File:Orc_04.png|thumb|center]]||''Fortified Orc Camp made by an aspiring Warlord. ''
|-
| colspan="2" |Orcs are not easy neighbors. The state of constant fighting sometimes pushes defeated ones into civilized nations territory. Sometimes they are small band of raiders, sometimes they are a bunch of exiles, sometimes the entire clan moves to slaughter and pillage.
|-
|[[File:Orc_05.png|thumb|center]]||''Orc Camp, erected in the ruins of a human castle.''
|}

===Military Structure===
The military structure of Orcs is rather simple: the strong rule and the weak obey. On top resides the Warlord, which is the strongest and most cunning Orc in the clan. Their status permits them to use the best weapons and armor. As war leaders, they can easily intimidate enemies and boost the morale of their forces by the use of their warcry.

Orc Warriors are older Orcs that were forged into mighty fighters over their lifespan. They are larger, stronger and more skilled than Orc Young, using better weapons and armor. Able to use both their natural strength and crude yet heavy armor, they are extremely dangerous opponents for an unprepared force. They are the foot soldiers of a clan and make up the main bulk of their forces.

Berserkers are Orcs who aspire to achieve great status or improve their martial skills. Often excluded from normal orc structure, they form bonds outside their clans with other similar individuals. As they lack resources and status to become Warriors, they concentrate on improving their skills by any means necessary. Their fighting skills are unmatched and they are cunning enemies that are not afraid of death. They often fight with no armor showing off their bodies' scars and marks of defeated enemies.

The rest are called Orc Young - no matter of their true age. The Young ones are the Orcs with the lowest status but there is a big difference within their ranks; the most crafty and skilled often have a good set of armor and weapons while the lowest often have only a tree branch as their equipment (big and heavy tree branches).

Sometimes a Warlord appears who unites a few clans under his command. These legendary leaders take a title of Khan. There are many anecdotes about them pillaging civilized lands. All of them are about the past.

===Military Tactics===
Orcs are all offense.

A battle usually starts with a strong charge of many Orc Young. As they lack discipline they rely on their impetuousness and physical superiority to stun and throw an enemy into disarray. As prolonged melee is often deadly for light armored Orc Young, some smarter Young use Javelins to provide support. They lack other means to fight at range which a smart commander can utilize at his advantage.

The Berserkers are often used as flanking troops, trying to attack the enemy's rear or flank. As they are dangerous in melee so they should be countered by mass use of ranged weapons. If not killed quickly, they could inflict heavy casualties. Luckily, they are rarely armored.

Orc Warriors enter a battle as the last. They lack the impetuousness of young orcs but they have tremendous staying power. Their armor and bulky bodies grant them resistance from many attacks. They also use their big stature to easily push lesser enemies around by breaking enemy defensive formations. The best counter against them are heavy anti-armor weapons like heavy axes, hammers, and billhooks. Beware, however, Orc Warriors can easily kill given their immense strength. Additionally, they are immune to being stunned.

The Warlord often supports his forces from the rear, using his voice to terrify the enemy and bolster his subordinates. But make no mistake - in melee he is even more heavily armored and dangerous than Orc Warriors.

{{Navbox Enemies}}

[[Category:Factions]]
[[Category:Enemies]]


# PAGE Undead

There are two undead factions: [[Zombies]] and [[Ancient Dead]], and they unite during the Undead Scourge. Flesh Golems from two certain [[legendary locations]] also Undead.

Undead are not affected by morale and accumulate no fatigue. Poisons have no effect, but [[Flask of Blessed Water|Flasks of Blessed Water]] can harm them. Some units like [[Necromancer|Necromancers]] are the exception, because they only belong to Undead faction and aren't true undead.

{{Navbox Enemies}}

[[Category:Factions]]
[[Category:Enemies]]


# PAGE Ancient_Dead

Ancient Dead are one of two [[Undead]] factions. [[Zombies]] are the other, and they unite during the Undead Scourge.

== Units ==
{| class="article-table" style="text-align:center"
! style="text-align:center" |Icon
! style="text-align:center" |Name
! style="text-align:center" |[[File:Health.png|25px|Health]]
! style="text-align:center" |[[File:Armor head.png|25px|Head armor]]
! style="text-align:center" |[[File:Armor body.png|25px|Body armor]]
! style="text-align:center" |[[File:Melee skill.png|25px|Melee skill]]
! style="text-align:center" |[[File:Ranged skill.png|25px|Ranged skill]]
! style="text-align:center" |[[File:Melee defense.png|25px|Melee defense]]
! style="text-align:center" |[[File:Ranged defense.png|25px|Ranged defense]]
! style="text-align:center" |[[File:Resolve.png|25px|Resolve]]
! style="text-align:center" |[[File:Initiative.png|25px|Initiative]]
! style="text-align:center" |[[File:Fatigue.png|25px|Fatigue]]
! style="text-align:center" |[[File:Fatigue recovery.png|25px|Fatigue recovery]]
! style="text-align:center" |[[File:Action points.png|25px|Action points]]
! style="text-align:center" |[[File:Miniboss.png|25px|Champion probability]]
! style="text-align:center" |[[File:XP.png|25px|XP]]
|-
|[[File:Skeleton 01 orientation.png]]||[[Ancient Auxiliary]]
|45||0-95||0-25||55||-||0||0||80||65||-||-||9||-||150
|-
|[[File:Skeleton 02 orientation.png]]||[[Ancient Legionary]]
|55||130||100-135||65||-||0||0||100||65||-||-||9||-||250
|-
|[[File:Skeleton 02 orientation.png]]||[[Ancient Legionary with Polearm]]
|55||130||100-125||65||-||0||0||100||45||-||-||9||-||250
|-
|[[File:Skeleton 03 orientation.png]]||[[Ancient Honor Guard]]
|65||180||180-210||75||-||5||5||130||70||-||-||9||1%||350
|-
|[[File:Skeleton 03 orientation.png]]||[[Ancient Honor Guard with Polearm]]
|65||180||180-210||75||-||5||5||130||50||-||-||9||-||350
|-
|[[File:Skeleton 04 orientation.png]]||[[Ancient Priest]]
|65||50||40||40||-||0||5||130||5||-||-||9||-||450
|-
|[[File:Vampire 01 orientation.png]]||[[Necrosavant|Lower Necrosavant]]
|56-146||0||20||85||-||25||25||-||130||-||-||8||-||400
|-
|[[File:Vampire 01 orientation.png]]||[[Necrosavant]]
|225||0||20||85||-||25||25||-||130||-||-||8||-||400
|-
|[[File:Skeleton orientation.png]]||[[The Lorekeeper]]
|240||80||60||-||-||15||15||130||50||-||-||12||-||750
|-
|[[File:Phylactery orientation.png]]||[[Phylactery]]
|25||-||-||-||-||-50||0||-||-||-||-||-||-||0
|-
|[[File:Skeleton 08 orientation.png]]||[[Screaming Skull]]
|25||-||-||-||-||10||10||-||80||-||-||6||-||1
|-
|[[File:Skeleton 07 orientation.png]]||[[Lorekeeper's Apparition]]
|1||-||-||75||-||20||20||-||70||-||-||5||-||1
|-
|[[File:Skeleton conqueror.png]]||[[The Conqueror]]
|350||50||380||90||-||20||10||140||70||-||-||9||-||600
|}

== Tactics ==
Ancient Dead fight in a tight formation, which they try to not break. Their main strength is the [[Shieldwall (20 fatigue)|shieldwall]] that they can maintain indefinitely. In the early game you will only see weak unarmored [[Ancient Auxiliary|Auxiliaries]], but later you will face [[Ancient Legionary|Legionaries]] with their medium armor and backline full of [[Ancient Legionary with Polearm|pikemen]]. Their [[Ancient Priest|Priests]] summon [[Miasma (0 fatigue)|harmful gas clouds]] that damage HP directly without missing, and their [[Horror (0 fatigue)|other spell]] can lower your [[morale]] and even [[Horrified (Status Effect)|stun]].

Being skeletons, they [[Resistant to Ranged Attacks|resist piercing damage]], especially ranged. But skeletons are also very fragile, and non-piercing weapons with high enough direct damage quickly destroy them.

They use rusty slashing and piercing weaponry, that isn't good against heavy [[armor]].

If the spacing is right, they will approach without shieldwall, and you will have two turns of attacks before they activate it. Waiting and then walking two steps back does the trick.

[[Necrosavant|Necrosavants]] are vampires. They are healed by damage they deal and can teleport. They can be extremely dangerous in the middle game.

== Description ==
[[File:AncientDeadConcept.jpg|thumb|400px|Ancient Dead concept drawings]]The world wasn’t always like it is now. Ruins dot the map, mass graves, sunken castles. But where did they come from?

Many hundred years ago, in a different era, an empire of man spanned much of the known world. What has fallen into ruin now, what was abandoned to nature and beast, what has long been forgotten, all this was that of man once. An empire, not of petty noble houses, but one of a dozen provinces, from the frozen tundra of the north to the blistering sands of the south, of a dozen peoples under one banner.

So many peoples, so many cultures and ideas under one roof, all vying to pull the empire into a direction of their own. Could those not be reconciled? Did they, in the end, just pull the empire apart? As remote lands became provinces of the empire, so could local cults become religions that swept across its entirety. Was the authority of the emperor lost to religion? Was it the gods that punished man for worshipping spirits that promised to give what they would not?

Does it matter now what brought it down? The ancient dead are rising again, not living and yet not dead. Long lost legions heed the call of their emperor. They march once more, tirelessly and without emotion, to claim again what was once theirs. What brought down the empire in the end, and what is bringing it back to unlife, is for you to piece together based on clues hidden within the world, if you want to learn more.

=== Military Tactics ===
The bulk of the ancient dead is made up of the ancient legions. They are what conquered most of the known world once, and they may well do so again. Legions that never tire, legionaries that know no fear, a cold machine that ever marches forward. What could stop them?

The legions fight like they did hundreds of years ago – in tight formation two ranks deep, with shields in front and polearms in the back. They rely quite heavily on the front row providing protection with their shields and locking down the enemy, while the second row uses polearms to inflict heavy damage on their opponents. A formation like this doesn’t charge like undisciplined rabble, but advances slowly and makes heavy use of shields to protect against arrow fire. They don’t possess any ranged weaponry and don’t do flanking maneuvers, preferring to simply walk through any enemy. Because much of their strength is in their formation, they’re at a disadvantage when fighting in difficult terrain, such as forests. They are also the missing piece of the puzzle that makes resolve an important attribute, as fighting them continually puts a test to the morale of the men.

The ancient legions come with a whole lot of unique armor, helmets and weapons. It’s old, it’s brittle and sometimes broken, but it can still be deadly.

{{Navbox Enemies}}

[[Category:Factions]]
[[Category:Enemies]]


# PAGE Barbarians

<onlyinclude>Barbarians are one of many Human factions in Battle Brothers. They inhabit northern part of the world.</onlyinclude>

== Units ==
<onlyinclude>
{| class="article-table" style="text-align:center"
! style="text-align:center" |Icon
! style="text-align:center" |Name
! style="text-align:center" |[[File:Health.png|25px|Health]]
! style="text-align:center" |[[File:Armor head.png|25px|Head armor]]
! style="text-align:center" |[[File:Armor body.png|25px|Body armor]]
! style="text-align:center" |[[File:Melee skill.png|25px|Melee skill]]
! style="text-align:center" |[[File:Ranged skill.png|25px|Ranged skill]]
! style="text-align:center" |[[File:Melee defense.png|25px|Melee defense]]
! style="text-align:center" |[[File:Ranged defense.png|25px|Ranged defense]]
! style="text-align:center" |[[File:Resolve.png|25px|Resolve]]
! style="text-align:center" |[[File:Initiative.png|25px|Initiative]]
! style="text-align:center" |[[File:Fatigue.png|25px|Fatigue]]
! style="text-align:center" |[[File:Fatigue recovery.png|25px|Fatigue recovery]]
! style="text-align:center" |[[File:Action points.png|25px|Action points]]
! style="text-align:center" |[[File:Miniboss.png|25px|Champion probability]]
! style="text-align:center" |[[File:XP.png|25px|XP]]
|-
|[[File:Wildman 01 orientation.png]]||[[Barbarian Thrall]]
|70||0-50||0-45||55||50||0||0||70||115||120||15||9||-||175
|-
|[[File:Wildman 02 orientation.png]]||[[Barbarian Reaver]]
|120||0-145||65-95||65||60||10||10||80||115||130||20||9||-||250
|-
|[[File:Wildman 03 orientation.png]]||[[Barbarian Chosen]]
|130||145-190||140-230||75||60||15||10||90||115||140||20||9||1%||350
|-
|[[File:Wildman 06 orientation.png]]||[[Barbarian King]]
|150||250||270||80||65||15||10||110||115||150||25||9||10%||500
|-
|[[File:Wildman 05 orientation.png]]||[[Barbarian Drummer]]
|90||30-50||30-65||65||40||15||5||80||90||150||15||9||-||250
|-
|[[File:Wildman 04 orientation.png]]||[[Barbarian Beastmaster]]
|70||130||95||65||55||10||10||90||110||120||15||9||-||250
|-
|[[File:Unhold 01 orientation.png]]||[[Armored Unhold]]
|500||35||35||70||-||10||0||130||75||400||30||9||-||400
|-
|[[File:Unhold 02 orientation.png]]||[[Armored Frost Unhold]]
|600||490||490||75||-||10||0||150||85||400||30||9||-||550
|-
|[[File:Wildman 07 orientation.png]]||[[Barbarian Madman]]
|160||300||300||80||-||10||10||-||115||200||25||9||-||500
|-
|[[File:Dog 02 orientation.png]]||[[Warhound]]
|70||0||0||55||-||20||20||40||50||110||140||15||-||100
|}
</onlyinclude>
== Tactics ==
Barbarians' strategy is simply running towards their enemy and attacking with everything they have. Even their weakest units, [[Barbarian Thrall|Thralls]], often have [[Throwing Weapons|throwing weapons]]. [[Barbarian Reaver|Reavers]] bring many two-handed weapons that can hit hard. In the late game you will encounter armored [[Barbarian Chosen|Chosen]], and entire warbands consisting only of them. Also their [[Armored Unhold|Armored Unholds]] will appear, and [[Barbarian Beastmaster|Beastmasters]] to control them.

Don't believe the tip on the loading screen that says they quickly become fatigued. It only happens if they use [[Adrenaline (20 fatigue)|Adrenaline]] every turn to outspeed you, and it's not going to happen quickly. Barbarians have high max fatigue and are often supported by hard to reach [[Barbarian Drummer|Drummers]], who reduce fatigue they accumulate. Their [[Barbarian Fury (5 fatigue)|Barbarian Fury]] is a variant of [[Rotation (Skill)|Rotation]], but costs much less fatigue.

== Description ==
In combat, a barbarian warband doesn’t bother with formations, and they have no backline with polearms or dedicated archers. They are a horde of ferocious warriors in a constant shuffle of everyone trying to bring their weapons to bear against the enemy. They’ll shower you with throwing weapons, they run towards your line, and they make ample use of the ‘Adrenaline’ perk to overwhelm you before you can even strike back. They don’t fear death the same as other humans do, so they are not easy to break. They populate the far northen part of the map.

{{Navbox Enemies}}

[[Category:Factions]]
[[Category:Enemies]]


# PAGE Beasts

Various wild beasts roam the lands. Different beasts are allied with each other, because they belong to the same faction. However, in some events beasts can be hostile to each other.

== Units ==
{| class="article-table" style="text-align:center"
! style="text-align:center" |Icon
! style="text-align:center" |Name
! style="text-align:center" |[[File:Health.png|25px|Health]]
! style="text-align:center" |[[File:Armor head.png|25px|Head armor]]
! style="text-align:center" |[[File:Armor body.png|25px|Body armor]]
! style="text-align:center" |[[File:Melee skill.png|25px|Melee skill]]
! style="text-align:center" |[[File:Ranged skill.png|25px|Ranged skill]]
! style="text-align:center" |[[File:Melee defense.png|25px|Melee defense]]
! style="text-align:center" |[[File:Ranged defense.png|25px|Ranged defense]]
! style="text-align:center" |[[File:Resolve.png|25px|Resolve]]
! style="text-align:center" |[[File:Initiative.png|25px|Initiative]]
! style="text-align:center" |[[File:Fatigue.png|25px|Fatigue]]
! style="text-align:center" |[[File:Fatigue recovery.png|25px|Fatigue recovery]]
! style="text-align:center" |[[File:Action points.png|25px|Action points]]
! style="text-align:center" |[[File:Miniboss.png|25px|Champion probability]]
! style="text-align:center" |[[File:XP.png|25px|XP]]
|-
|[[File:Spider 01 orientation.png]]||[[Webknecht]]
|60||20||20||60||-||10-15||20-25||45||150||130||20||11||-||100
|-
|[[File:Spider 02 orientation.png]]||[[Webknecht Eggs]]
|20||-||-||-||-||-50||0||-||-||-||-||-||-||0
|-
|[[File:Direwolf 01 orientation.png]]||[[Direwolf]]
|130||30||30||60||-||10||10||50||150||180||20||12||-||200
|-
|[[File:Direwolf 01 orientation.png]]||[[Frenzied Direwolf]]
|150||30||30||65||-||10||10||70||150||180||20||12||-||250
|-
|[[File:Hyena orientation.png]]||[[Hyena]]
|120||20||20||60||-||10||10||50||90||180||20||14||-||200
|-
|[[File:Hyena orientation.png]]||[[Frenzied Hyena]]
|140||20||20||65||-||10||10||70||130||180||20||14||-||250
|-
|[[File:Ghoul 01 orientation.png]]||[[Nachzehrer]]
|80-380||-||-||60-80||-||10-20||5-15||50-110||95-125||130||15||9||-||125-375
|-
|[[File:Serpent orientation.png]]||[[Serpent]]
|130||40||40||65||-||10-15||25||100||50-100||110||15||9||-||175
|-
|[[File:Alp 01 orientation.png]]||[[Alp]]
|100||-||-||-||-||10||10||100||60-115||100||15||10||-||300
|-
|[[File:Unhold 01 orientation.png]]||[[Unhold]]
|500||-||-||70||-||10||0||130||75||400||30||9||-||400
|-
|[[File:Unhold 03 orientation.png]]||[[Bog Unhold]]
|500||-||-||70||-||10||5||130||75||400||30||9||-||400
|-
|[[File:Unhold 02 orientation.png]]||[[Frost Unhold]]
|600||90||90||75||-||10||0||150||85||400||30||9||-||450
|-
|[[File:Unhold 01 orientation.png]]||[[Armored Unhold]]
|500||35||35||70||-||10||0||130||75||400||30||9||-||400
|-
|[[File:Unhold 02 orientation.png]]||[[Armored Frost Unhold]]
|600||490||490||75||-||10||0||150||85||400||30||9||-||550
|-
|[[File:Hexe 01 orientation.png]]||[[Hexe]]
|80||0||25||-||-||5||5||160||100||80||15||9||-||450
|-
|[[File:Sand golem orientation.png]]||[[Ifrit]]
|110-440||110||110||65-80||70-80||-5-5||-15 - -5||-||40-60||400||25||8||-||150
|-
|[[File:Schrat 01 orientation.png]]||[[Schrat]]
|600||-||-||70-75||-||-5||-5||200||60||400||25||7||-||600
|-
|[[File:Schrat 02 orientation.png]]||[[Sapling]]
|75||-||-||80||-||15||15||150||80||400||15||7||-||50
|-
|[[File:Lindwurm orientation.png]]||[[Lindwurm]]
|1100||200||400||75-85||-||10||-10||180||80||400||30||7||-||800
|-
|[[File:Thing orientation.png]]||[[Ijirok]]
|2200||140||140||95||-||20||15||-||95||400||30||9||-||1500
|-
|[[File:Kraken 01 orientation.png]]||[[Kraken]]
|3800||1600||1600||-||-||-15||-15||-||-300||999||25||9||-||2500
|-
|[[File:Kraken 02 orientation.png]]||[[Kraken|Irrlicht]]
|300||-||-||80||-||25||25||60||100||999||25||9||-||200
|}
Note: Armored Unholds are here only for convenience. They are from the [[Barbarians]] faction actually.

== Description ==

=== Alps ===
[[File:Alp1.png|bottom]][[File:Alp2.png|bottom]][[File:Alp3.png|bottom]]

The '''Alp''' is a pale and haggard creature. It encroaches on settlements in the cover of night, invading the sleep of its helpless inhabitants with ghastly visions, and feeding on the fear and anguish of its victims like a parasite. Scholars speculate that Alps didn’t always look and behave like they do now; most Alps have eye sockets, but no eyes, and mouths with teeth, but only a rudimentary digestive system. Their pale skin peels like old parchment, their bones are frail, and their insides are dark and show signs of decay. Perhaps the Alp is the victim of an ancient curse, or perhaps it simply evolved from a different creature to the nocturnal predator it is now. Whatever it is, don’t fall asleep!

Fun-fact: In german, nightmares are called "Alptraum" = Alp-dream (Which congruents to Nightmare)

=== Direwolves ===
[[File:Wolf1.png|100px|bottom]][[File:Wolf3.png|100px|bottom]][[File:Wolf2.png|100px|bottom]]

'''Direwolves''' are a type of enemy in ''Battle Brothers''. They are fast and dangerous, as they will quickly charge, flank, and overwhelm a target in numbers. Can attack 3 times if they don't move.

=== Hexen ===
[[File:Hexe_2.png|bottom]][[File:Hexe_3.png|bottom]][[File:Hexe_4.png|bottom]][[File:Hexe_5.png|bottom]][[File:Hexe_1.png|bottom]][[File:Hexe_6.png|bottom]]

The '''Hexe''' is a witch inspired by Grimm’s fairy tales, a malevolent old crone living in swamps and forests outside of villages alone or in a coven with other Hexen. They’re human, but have long sacrificed their humanity for otherworldly powers. They’re feared, but also worshiped by some. They’re burned at the stake, and yet people seek them out to plead for miracles. They lure and abduct little children to make broth and concoctions out of, they strike terrible pacts with villagers to receive their firstborn, they weave curses and cast hexes. Their huts may or may not be made of candy. With her sorcery, a Hexe can enthrall wild beasts, and even warp the mind of humans, and so will often be found in the company of creatures that serve her.

=== Hyena ===
[[File:Hyena_8.png|100px|bottom]][[File:Hyena_9.png|100px|bottom]][[File:Hyena_10.png|100px|bottom]]

Prowling the southern deserts and steppe is the Hyena, a carnivorous mammal that resembles a poorly groomed cross between feline and canine. Prey can be few and far between in the endless sea of sand, and so the Hyena is both scavenger and nocturnal hunter. Many a traveler lost in the desert ended up a feast for a pack of Hyenas – but whether they tore him apart as he was still alive, or he died of thirst long before the pack came upon him, is another matter.

In the barren wastes of the south, no scrap of flesh can go to waste, and the Hyena has a jaw strong enough to crush bone so that it can get to every last shred. As it turns out, a jaw that can crush bone can crush armor quite well, too, making the Hyena a threat also to men in armor that would protect them against lesser wildlife. Although a Hyena is smaller than a northern Direwolf, and not always able to kill an unarmored man in a single turn, the way it rips flesh from its victims can leave terrible bleeding wounds and inflict the ‘Bleeding’ status effect. A battle against starved Hyenas is not lost as quickly as against a pack of Direwolves, but it may well be over before you even realize it when your men live on borrowed time as they slowly bleed out while the hyenas circle you in anticipation of a feast.

Hyenas roam and attack in packs that swarm and often surround their prey, attacking from multiple angles. They’re faster in combat than most other opponents, faster even than a Direwolf. A single Hyena can attack three times a turn, often overwhelming their victims and leaving them fatigued as they try to dodge every attack. However, their morale isn’t particularly good, and like most beasts they’re especially afraid of firearms spewing smoke and fire with a loud bang, unreliable as they otherwise may be. Naturally, Hyenas drop unique loot which can either be sold or used to craft new items, including a new armor attachment, if you own the ‘Beasts & Exploration’ DLC.

=== Ifrit ===
[[File:Ifrit_1.png]][[File:Ifrit_3.png]][[File:Ifrit_5.png]][[File:Ifrit_6.png]][[File:Ifrit_4.png]][[File:Ifrit_2.png]]

=== Lindwurm ===
[[File:Tail.png|81px]][[File:Lindwurm1.png]]

'''Lindwurms''' are a type of enemy in ''Battle Brothers''. They are very dangerous beasts. The upper body will move first, followed by the tail. The upper body and the tail share the same health and armor, but attack differently. Acidic blood courses through its veins, and any attacker wounding (beyond a certain threshold) a Lindwurm in melee combat will suffer the blood's corrosive effects, which melts down the attacker's armor.

=== Nachzehrer ===
[[File:Nachzehrer concept drawings.jpg|212px|Nachzehrer concept drawings]] [[File:Nachzehrer devours a brother.jpg|400px|Nachzehrer devours a brother]]

'''Nachzehrers''' (German for "eater of remains," literally "after-eater") are a type of enemy in ''Battle Brothers''. They count as beasts, but because they feast on corpses, they are often seen in company with the [[Zombies]] or [[Ancient Dead]].

The peasantry tells stories of men and women coming back to life after the sin of committing suicide as horribly shaped monstrosities, turned into a Nachzehrer. They’re said to resemble grey-skinned devils that dig up graves with their claws and devour fresh corpses, even devour parts of themselves and their funeral shrouds, and to grow in strength as they do so until they inevitably prey on the living. Others may claim that they are but wild beasts, merely scavengers drawn to fresh graves like seagulls to fishing nets. Whatever their true nature, they bring misery and disease upon any village they bedevil.

The creature known as Nachzehrer can grow up to two times as it gorges itself on a corpse, and it’s not shy of cannibalizing its own kind. Each time it does so, it increases in size and strength significantly. At its largest, when it’s become a hulking behemoth of grey flesh, it gains the ability to swallow a man whole. Anyone devoured like this isn’t dead, but in the belly of the beast and removed from the map. Slaying the Nachzehrer will free that character again, albeit covered in goo, but retreating while a character is devoured in this way will spell certain death for him.

A Nachzehrer has long claws that they use to dig through the earth in search of food, and which can tear grievous wounds in combat. The larger the Nachzehrer, the more dangerous the claws become. On the bright side, a Nachzehrer doesn’t have any armor, which favors swords and cleavers, and it gets easier to hit with ranged weapons, the larger and less nimble it becomes.

=== Schrat ===
[[File:Bigschrat.png|100px|bottom]][[File:Sapling.png|bottom]][[File:Bigschrat2.png|100px|bottom]]

The Waldschrat, or '''Schrat''' for short, is a fabled living tree found in the most remote forests of the world. A creature of bark and wood, it resembles no other, and its mind is truly alien. It blends between trees and shambles slowly, its roots digging through the soil. A frightening night time story tells of how trees watered with the blood of the unjustly killed turn into twisted living trees, out to strangle and choke the life out of children that don’t behave.

=== Serpent ===
[[File:Snake.png|bottom]]

While much of the south is made up of barren wasteland, the seas of sand are dotted with green islands that promise a treasure most sparse in these parts: water. Water means life in the great deserts, and so any caravans seeking to travel them will hop from one oasis to the next. They are lush refuges teeming with life, but also with danger, for they are home to a slithery predator: The Serpent.

The Serpent is a large non-venomous snake that preys on animals and humans alike in and around oases. Well-camouflaged on the ground, they are not always easily spotted from afar, but they are also slower on the world map than other beasts. Using their forked tongue to sample the air, they have a directional sense of smell and can hunt equally well in the darkness of night as they can in the bright of day.

In battle, a Serpent will seek to wind itself around their prey, to constrict their movement and breath, and to drag them away from allies where they can be more easily killed in isolation. Similar to human opponents using the ‘Hook’ skill of Billhooks, Serpents can pull apart a formation, drag your men into being surrounded by several opponents, and expose your backline. Although Serpents are not venomous, they will attack using their fangs until their victim is either dead or limp enough to be devoured whole.

Serpents can be dangerous for anyone traveling the south, but they also offer an opportunity for earning crowns. The body of a Serpent is covered with overlapping scales of different colors, and some serpent skin, particularly rainbow colored scales, is worth a lot to the upper class of the city states that seek to flaunt their wealth. A mercenary captain will often find contracts to hunt down Serpents, whether to turn them into expensive-looking slippers or simply because too many a caravan hand lost their live along a trade route so that business begins to suffer. The shimmering scales are quite resistant to heat and fire, and a taxidermist can also craft an armor attachment out of these for use with your own men.

=== Unhold ===
[[File:Unhold_1.png|100px]][[File:Unhold_2.png|100px]][[File:Unhold_3.png|100px]][[File:Armored_unhold.png|100px]][[File:Armored_unhold3.png|100px]]

The '''Unhold''' is a lumbering giant, easily the size of three men, and dwarfing even the tallest orc. It eats whole sheep for a snack and empties a pond to wash it down. There’s tales of enraged Unholds leveling remote farms and plucking the limbs off of unlucky farmers like wings from insects, but closer examination will reveal that Unholds aren’t malicious creatures. They’re fiercely territorial, but may often be content to persuade with ear-deafening bellowing and threatening gestures any invaders to run for their lives. The Unhold is a somewhat solitary creature and can be found either alone or in small groups only.

There are 3 variants of Unholds. The most common variant is found in the hills and tundra. Another variant is said to be found in swamps and sometimes forests, where they inhabit caves. The fiercest is the northern variant found in the snowy wastes, with white fur that protects equally against cold and steel. Then there are also armored Unholds that are tamed by barbarians.

=== Webknecht ===
[[File:Spider_1.png|100px]][[File:Spider_2.png|100px]][[File:Spider_3.png|100px]][[File:Spider4.png|100px]][[File:Eggs.png|100px]]

The '''Webknecht''' is a large arachnid that lives in sizable colonies in the dark areas of forests throughout the world of Battle Brothers. It’s there that they spin their webs between trees to trap anything from bird to deer and between. Unlike most other beasts, Webknechts don’t usually roam a lot, preferring instead to sit in their territory and wait until something unfortunate gets itself caught in one of their nets. Still, they’re known to choose the vicinity of settlements for their home on occasion and threaten the lives of villagers and their livestock.

=== Ijirok ===
[[File:Ijirok.png]]

=== Kraken ===
[[File:Noteeth.png|100px]][[File:Krakenhead.png|100px]][[File:Hasteeth.png|100px]]

{{Navbox Enemies}}

[[Category:Factions]]
[[Category:Enemies]]


# PAGE Noble_Houses

<onlyinclude>Noble Houses are a type of Human factions in Battle Brothers. They are hostile to each other during the War of the Noble Houses, and hostile to southern [[City States]] during the Holy War. They send Supply Caravans, guarded by their troops.</onlyinclude>

== Units ==
<onlyinclude>
{| class="article-table" style="text-align:center"
|+Squads
! style="text-align:center" |Icon
! style="text-align:center" |Name
! style="text-align:center" |[[File:Health.png|25px|Health]]
! style="text-align:center" |[[File:Armor head.png|25px|Head armor]]
! style="text-align:center" |[[File:Armor body.png|25px|Body armor]]
! style="text-align:center" |[[File:Melee skill.png|25px|Melee skill]]
! style="text-align:center" |[[File:Ranged skill.png|25px|Ranged skill]]
! style="text-align:center" |[[File:Melee defense.png|25px|Melee defense]]
! style="text-align:center" |[[File:Ranged defense.png|25px|Ranged defense]]
! style="text-align:center" |[[File:Resolve.png|25px|Resolve]]
! style="text-align:center" |[[File:Initiative.png|25px|Initiative]]
! style="text-align:center" |[[File:Fatigue.png|25px|Fatigue]]
! style="text-align:center" |[[File:Fatigue recovery.png|25px|Fatigue recovery]]
! style="text-align:center" |[[File:Action points.png|25px|Action points]]
! style="text-align:center" |[[File:Miniboss.png|25px|Champion probability]]
! style="text-align:center" |[[File:XP.png|25px|XP]]
|-
|[[File:Footman veteran_orientation.png]]||[[Footman]]
|70||80-230||115-150||70||50||10||5||60||110||120||15||9||-||250
|-
|[[File:Billman orientation.png]]||[[Billman]]
|70||20-230||50-130||70||50||10||5||60||80||120||15||9||-||250
|-
|[[File:Arbalester orientation.png]]||[[Arbalester]]
|60||0-80||50-65||55||60||5||5||60||110||100||15||9||-||250
|-
|[[File:Manatarms_orientation.png]]||[[Man at Arms]]
|70||170-280||115-240||70||50||10||5||70||110||120||15||9||-||250
|-
|[[File:Standard bearer orientation2.png]]||[[Standard Bearer]]
|80||0-230||115-150||65||50||10||10||90||105||130||20||9||-||250
|-
|[[File:Sergeant orientation.png]]||[[Sergeant]]
|100||0||150-210||80||60||25||15||80||110||130||20||9||-||350
|-
|[[File:Greatsword orientation.png]]||[[Zweihander]]
|90||70-160||150-240||75||50||20||10||70||115||130||20||9||-||350
|-
|[[File:Knight orientation.png]]||[[Knight]]
|135||300-320||210-320||90||60||20||10||90||115||140||20||9||2%||450
|-
|[[File:Dog 01 orientation.png]]||[[Wardog|Armored Wardog]]
|50||0||55||50||-||20||25||40||130||130||15||12||-||75
|}

{| class="article-table" style="text-align:center"
|+Supply Caravans
! style="text-align:center" |Icon
! style="text-align:center" | Name
! style="text-align:center" |[[File:Health.png|25px|Health]] 
! style="text-align:center" | [[File:Armor head.png|25px|Head armor]]
! style="text-align:center" |[[File:Armor body.png|25px|Body armor]] 
! style="text-align:center" |[[File:Melee skill.png|25px|Melee skill]] 
! style="text-align:center" |[[File:Ranged skill.png|25px|Ranged skill]]
! style="text-align:center" |[[File:Melee defense.png|25px|Melee defense]]
! style="text-align:center" |[[File:Ranged defense.png|25px|Ranged defense]]
! style="text-align:center" |[[File:Resolve.png|25px|Resolve]]
! style="text-align:center" | [[File:Initiative.png|25px|Initiative]]
! style="text-align:center" |[[File:Fatigue.png|25px|Fatigue]]
! style="text-align:center" |[[File:Fatigue recovery.png|25px|Fatigue recovery]]
! style="text-align:center" |[[File:Action points.png|25px|Action points]]
! style="text-align:center" |[[File:Miniboss.png|25px|Champion probability]]
! style="text-align:center" |[[File:XP.png|25px|XP]]
|-
|[[File:Footman veteran_orientation.png]]||[[Footman]]
|70||80-230||115-150||70||50||10||5||60||110||120||15||9||-||250
|-
|[[File:Billman orientation.png]]||[[Billman]]
|70||20-230||50-130||70||50||10||5||60||80||120||15||9||-||250
|-
|[[File:Arbalester orientation.png]]||[[Arbalester]]
|60||0-80||50-65||55||60||5||5||60||110||100||15||9||-||250
|-
|[[File:Sergeant orientation.png]]||[[Sergeant]]
|100||0||150-210||80||60||25||15||80||110||130||20||9||-||350
|-
|[[File:Greatsword orientation.png]]||[[Zweihander]]
|90||70-160||150-240||75||50||20||10||70||115||130||20||9||-||350
|-
|[[File:Donkey orientation.png]]||[[Donkey]]
|180||-||-||-||-||-30||-10||-||-||200||-||-||-||50
|}
</onlyinclude>
==Tactics==
Noble Houses have dedicated frontline, polearms and ranged units. [[Standard Bearer|Standard Bearers]] help to maintain high [[morale]] among soldiers. Elite units try to make a breakthrough where they are fighting. Some squads use [[Wardog|Wardogs]], which usually pointlessly die at the beginning of a fight.

The weakness of Noble squads is their suboptimal use of the [[Battle Forged]] perk. Medium armor is too light to work well with it, and [[Billman|Billmen]] wear even lighter armor like [[Gambeson|Gambesons]] and [[Aketon Cap|Aketon Caps]], becoming very vulnerable for those who can attack them.

==Description==
Professional soldiers working on the payroll of one of the three Northern noble houses. Their patrols are a common sight and they protect supply caravans and the more well fortified towns and castles. Can be encountered through the Noble War, Holy War or by just being hostile to one of the houses through one of several ways.

{{Navbox Enemies}}

[[Category:Factions]]
[[Category:Enemies]]


# PAGE City_States

<onlyinclude>City States are a type of Human factions in Battle Brothers. Southern city states send regiments to patrol surroundings, and caravans to trade with other settlements. Caravans are guarded by their melee units, usually [[Conscript|Conscripts]]. Southerners are hostile to [[Noble Houses]] during the Holy War.</onlyinclude>

== Units ==
<onlyinclude>
{| class="article-table" style="text-align:center"
|+Squads
! style="text-align:center" |Icon
! style="text-align:center" |Name
! style="text-align:center" |[[File:Health.png|25px|Health]]
! style="text-align:center" |[[File:Armor head.png|25px|Head armor]]
! style="text-align:center" |[[File:Armor body.png|25px|Body armor]]
! style="text-align:center" |[[File:Melee skill.png|25px|Melee skill]]
! style="text-align:center" |[[File:Ranged skill.png|25px|Ranged skill]]
! style="text-align:center" |[[File:Melee defense.png|25px|Melee defense]]
! style="text-align:center" |[[File:Ranged defense.png|25px|Ranged defense]]
! style="text-align:center" |[[File:Resolve.png|25px|Resolve]]
! style="text-align:center" |[[File:Initiative.png|25px|Initiative]]
! style="text-align:center" |[[File:Fatigue.png|25px|Fatigue]]
! style="text-align:center" |[[File:Fatigue recovery.png|25px|Fatigue recovery]]
! style="text-align:center" |[[File:Action points.png|25px|Action points]]
! style="text-align:center" |[[File:Miniboss.png|25px|Champion probability]]
! style="text-align:center" |[[File:XP.png|25px|XP]]
|-
|[[File:Slave orientation.png]]||[[Indebted (Enemy)|Indebted]]
|55||0-30||0-10||45||35||5||5||40||90||100||15||9||-||50
|-
|[[File:Conscript orientation.png]]||[[Conscript]]
|55||30-125||75-110||70||50||10||5||70||110||120||15||9||-||250
|-
|[[File:Conscript orientation.png]]||[[Conscript with Polearm]]
|55||30-125||75-110||70||50||10||5||70||110||120||15||9||-||250
|-
|[[File:Gunner orientation.png]]||[[Gunner]]
|70||30||60||65||75||5||10||70||120||120||15||9||-||250
|-
|[[File:Orientation engineer.png]]||[[Engineer]]
|70||30||60||60||50||0||5||70||100||120||15||9||-||150
|-
|[[File:Assassin orientation.png]]||[[Assassin (Enemy)|Assassin]]
|80||40-140||120||80||70||20||20||85||130||125||20||9||-||350
|-
|[[File:Officer orientation.png]]||[[Officer]]
|110||200-290||135-290||85||60||25||15||80||110||130||20||9||1%||350
|-
|[[File:Mortar orientation.png]]||[[Mortar]]
| -||-||-||-||-||-50||-50||-||50||-||-||6||-||0
|}

{| class="article-table" style="text-align:center"
|+Trading Caravans
! style="text-align:center" |Icon
! style="text-align:center" |Name
! style="text-align:center" |[[File:Health.png|25px|Health]]
! style="text-align:center" |[[File:Armor head.png|25px|Head armor]]
! style="text-align:center" |[[File:Armor body.png|25px|Body armor]]
! style="text-align:center" |[[File:Melee skill.png|25px|Melee skill]]
! style="text-align:center" |[[File:Ranged skill.png|25px|Ranged skill]]
! style="text-align:center" |[[File:Melee defense.png|25px|Melee defense]]
! style="text-align:center" |[[File:Ranged defense.png|25px|Ranged defense]]
! style="text-align:center" |[[File:Resolve.png|25px|Resolve]]
! style="text-align:center" |[[File:Initiative.png|25px|Initiative]]
! style="text-align:center" |[[File:Fatigue.png|25px|Fatigue]]
! style="text-align:center" |[[File:Fatigue recovery.png|25px|Fatigue recovery]]
! style="text-align:center" |[[File:Action points.png|25px|Action points]]
! style="text-align:center" |[[File:Miniboss.png|25px|Champion probability]]
! style="text-align:center" |[[File:XP.png|25px|XP]]
|-
|[[File:Slave orientation.png]]||[[Indebted (Enemy)|Indebted]]
|55||0-30||0-10||45||35||5||5||40||90||100||15||9||-||50
|-
|[[File:Conscript orientation.png]]||[[Conscript]]
|55||30-125||75-110||70||50||10||5||70||110||120||15||9||-||250
|-
|[[File:Conscript orientation.png]]||[[Conscript with Polearm]]
|55||30-125||75-110||70||50||10||5||70||110||120||15||9||-||250
|-
|[[File:Officer orientation.png]]||[[Officer]]
|110||200-290||135-290||85||60||25||15||80||110||130||20||9||1%||350
|-
|[[File:Donkey orientation.png]]||[[Donkey]]
|180||-||-||-||-||-30||-10||-||-||200||-||-||-||50
|}

{| class="article-table" style="text-align:center"
|+Civilians
! style="text-align:center" |Icon
! style="text-align:center" |Name
! style="text-align:center" |[[File:Health.png|25px|Health]]
! style="text-align:center" |[[File:Armor head.png|25px|Head armor]]
! style="text-align:center" |[[File:Armor body.png|25px|Body armor]]
! style="text-align:center" |[[File:Melee skill.png|25px|Melee skill]]
! style="text-align:center" |[[File:Ranged skill.png|25px|Ranged skill]]
! style="text-align:center" |[[File:Melee defense.png|25px|Melee defense]]
! style="text-align:center" |[[File:Ranged defense.png|25px|Ranged defense]]
! style="text-align:center" |[[File:Resolve.png|25px|Resolve]]
! style="text-align:center" |[[File:Initiative.png|25px|Initiative]]
! style="text-align:center" |[[File:Fatigue.png|25px|Fatigue]]
! style="text-align:center" |[[File:Fatigue recovery.png|25px|Fatigue recovery]]
! style="text-align:center" |[[File:Action points.png|25px|Action points]]
! style="text-align:center" |[[File:Miniboss.png|25px|Champion probability]]
! style="text-align:center" |[[File:XP.png|25px|XP]]
|-
|[[File:Peasant orientation.png]]||[[Citizen]]
|50||0-30||5-25||40||30||0||0||35||90||100||15||9||-||50
|}
</onlyinclude>
== Tactics ==
Southern faction is among the strongest in the game. Their infantry has [[Nimble]], including polearm users. Their [[Gunner|Gunners]] lower your accuracy with [[Overwhelm]], making you less likely to hit their frontline, and they also hit your backline without penalty. Weapons like [[Swordlance]] and [[Handgonne]] do more damage to tight formations, while [[Backstabber]] works against sparse formations. And there are also deadly [[Assassin|Assassins]] with their contraptions and [[Mortar|Mortars]] bombarding you.

Southerners seem to not care about friendly fire, and will often hit their own troops with area attacks.

== Description ==
Gilders are the denizens of the southern city states. Like the Northen Noble houses, their combat style is somewhat reminiscent of the legions of the [[Ancient Dead|Ancient Empire]]. Gilder forces can be encountered through contracts during the Holy War, or by angering one of the city states and engaging them straight on the world map.

=== Indebted ===
Life is cheap in the south, as the saying goes, and nothing makes this harsh reality sink in better than how the city states treat their slaves. In battle, they’re usually send first against the enemy to tire out their lines before the real battle begins. They’re poorly armed, many just carrying tools used as improvised weapons, and rely on swarming, flanking and overwhelming the enemy. They have poor morale and flee easily, but killing or breaking them does not affect the morale of any city state troops that aren’t slaves themselves. In fact, the city state troops have no qualms about friendly fire when it comes to slaves, and they may seize the opportunity that slaves provide by locking down the enemy and fire their ranged weapons into the thick of battle.

=== Conscripts ===
Citizens of the great city states enjoy privileges that neither slaves nor outsiders do. For example, they have the opportunity to conduct business with the legal certainty of a codified law and can even hire legal council. In turn, they also have certain obligations to their state. Having to pay taxes is one such obligation, but another one for every adult male citizen is either mandatory military service or paying a hefty sum into the state’s coffers to be exempt. The council of Viziers may decide to conscript the citizens for the defense of the city state or for otherwise protecting and furthering the interests of the state. In practise, this can mean anything between border skirmishes with other states, doomed punitive expeditions deep into the deserts to hunt down raiders, and crushing slave rebellions.

Conscripts make up the bulk of the military force of the city states. They have received some military drill and are most often dressed in a distinct southern armor made of several layers of linen, called a Linothorax, that is relatively cheap to produce. If they don’t have access to helmets, they choose to wrap cloth around their heads to protect against the sun. The color and patterns of these head wraps are often linked to a particular region of the south, and one familiar would know what place a southern conscript calls home by his headwear alone. Just before battle lines clash, Conscripts employ a unique weapon of the city states. It’s one reason why they are a military power to be reckoned with.

=== Officers ===
Officers of the city states are mostly made up of the wealthy who would have enough funds to buy themselves free of conscription, but seek a career commanding troops in the military by their own volition. A victorious commander will accrue influence and gravitas, and some Officers may consider the army but a stepping stone in a fledgling political career.

Considerably better armed than Conscripts, Officers carry finely crafted mail and lamellar armor with intricate southern ornaments into battle. Naturally, all armors can also be bought, looted and worn by your own men in the game!

=== Assassins ===
Members of a secretive ritualistic cult, Assassins deal in death and provide murder as a service. They have no political ambition beyond the continued survival of their cult and that of their warped philosophy, and so act only in service to other parties, like individual city states. They’re not encountered roaming on the world map, but exclusively as part of contracts and events.

In battle, Assassins wear traditional black robes over finely crafted mail. Many also choose to exchange their own face for that of their master and founder of their cult, the old man on the mountain, by wearing metal face masks. Assassins have a nimble combat style and employ a variety of alchemical contraptions like Flash Pots and Smoke Pots to daze their opponents and move freely between them, only to then use a Qatal Dagger for greater impact on their debilitated victims.

{{Navbox Enemies}}

[[Category:Factions]]
[[Category:Enemies]]


# PAGE Ambitions

<div class="res-img">[[File:Ambitions.jpg|center]]</div>

==Basic Information==

All ambitions give at least 100 [[Renown|renown]] (which boosts contract payout) and lift the mood of the entire company. Some offer other rewards. An ambition can be cancelled at any time but it comes at the cost of a morale hit for the company. Abandoned ambitions will not be available the next time an ambition is chosen, though subsequently can appear again.

After the [[Make Nobles Aware]] ambition has been completed, an option to select "No Ambition" will begin appearing. Selecting "No Ambition" means waiting 3 days before you get to choose again. Cancelling an ambition only results in waiting a day or two before getting to choose again.

Ambition unavailability is often temporary. For example: if you have 3 helms with 230+ durability when choosing an ambition, the [[Armor Mastery]] ambition will never be an option, but if you sell one of the helms, you can once again receive the ambition as a choice. The [[Have 50000 Crowns]] ambition can even be completed prior to the [[Have 10000 Crowns]] ambition.

However, there are a fair number of ambitions that can end up unobtainable. Some just have requirements, like a maximum number of contracts completed, that can never be reduced in campaign once exceeded. Others, the game will <span style="color:red">permanently</span> mark as already completed if certain conditions are met. This check is only ever carried out immediately prior to the display of the ambition selection screen. No rewards are received for auto-completing an ambition this way, but it will unlock any other ambitions that have this ambition as a prerequisite.

Care should be taken with the requirements for the {{tooltip|'''following ambitions'''|press Expand on the right}}:
<div style="text-align: left" class="mw-collapsible mw-collapsed toggle-center">
<ul class="arrow">
<li>[[Allied Civilians]]</li>
<li>[[Defeat Kraken]]</li>
<li>[[Discover All Unique Locations]]/[[Discover Unique Locations]]</li>
<li>[[Fulfill Southern Contracts]]</li>
<li>[[Have Armor Upgrades]]</li>
<li>[[Have 2750 Renown]]/[[Have 8000 Renown]]</li>
<li>[[Hire Follower]]</li>
<li>[[Make Nobles Aware]]</li>
<li>[[More Contracts]]</li>
<li>[[Named Item]]</li>
<li>[[Roster of 12]]/[[Roster of 16]]/[[Roster of 20]]</li>
<li>[[Taxidermist Crafting]]</li>
<li>[[Visit Settlements]]</li>
<li>[[Win Arena Fights]]</li>
</ul>
</div>
<br />

==List of Ambitions==
{{:Allied Civilians}}
{{:Allied Nobles}}
{{:Armor Mastery}}
{{:Cart}}
{{:Defeat Civil War}}
{{:Defeat Beasts}}
{{:Defeat Goblin Location}}
{{:Defeat Greenskins}}
{{:Defeat Holy War}}
{{:Defeat Kraken}}
{{:Defeat Mercenaries}}
{{:Defeat Orc Location}}
{{:Defeat Undead}}
{{:Defeat Undead Location}}
{{:Discover All Unique Locations}}
{{:Discover Locations}}
{{:Discover Unique Locations}}
{{:Find and Destroy Location}}
{{:Fulfill Southern Contracts}}
{{:Hammer Mastery}}
{{:Have All Provisions}}
{{:Have Armor Upgrades}}
{{:Have 10000 Crowns}}
{{:Have 50000 Crowns}}
{{:Have 2750 Renown}}
{{:Have 8000 Renown}}
{{:Have Talent}}
{{:Hire Follower}}
{{:Make Nobles Aware}}
{{:More Contracts}}
{{:Named Item}}
{{:Named Item Set}}
{{:Player Banner}}
{{:Raid Caravans}}
{{:Ranged Mastery}}
{{:Roster of 12}}
{{:Roster of 16}}
{{:Roster of 20}}
{{:Sergeant Sash}}
{{:Taxidermist Crafting}}
{{:Trade Goods}}
{{:Visit Settlements}}
{{:Wagon}}
{{:Weapon Mastery}}
{{:Win Against 12}}
{{:Win Against 24}}
{{:Win Arena Fights}}

[[Category:Game Mechanics]]


# PAGE Retinue

Retinue is a gameplay mechanic introduced with the [[Blazing Deserts Release|Blazing Deserts DLC]].<br />
[[File:Campfire_tents_01.png|400px|thumb|right]] Here you can see your retinue of non-combat followers that grant various advantages outside combat and upgrade your cart for more inventory space.

==Followers==

{{:The Agent (Follower)}}

{{:The Alchemist (Follower)}}

{{:The Blacksmith (Follower)}}

{{:The Bounty Hunter (Follower)}}

{{:The Brigand (Follower)}}

{{:The Cartographer (Follower)}}

{{:The Cook (Follower)}}

{{:The Drill Sergeant (Follower)}}

{{:The Lookout (Follower)}}

{{:The Minstrel (Follower)}}

{{:The Negotiator (Follower)}}

{{:The Paymaster (Follower)}}

{{:The Quartermaster (Follower)}}

{{:The Recruiter (Follower)}}

{{:The Scavenger (Follower)}}

{{:The Scout (Follower)}}

{{:The Surgeon (Follower)}}

{{:The Trader (Follower)}}

==Cart Upgrades==
Free inventory slots - sometimes one is enough - are required to complete some [[Ambitions|ambitions]] or trigger certain [[Events|events]].

{{:Donkey (Upgrade)}}

{{:Cart (Upgrade)}}

{{:Wagon (Upgrade)}}

{{:Big Wagon (Upgrade)}}

==Unlocking Follower Slots==

Follower slots are unlocked when you reach a certain [[Renown]] level.

[[File:Locked_slot_smal.png|50px|bottom]][[File:Arrow_right2.png|50px|bottom]][[File:Free_slot_smal.png|50px|bottom]]

{| class="article-table" align='left'
!Renown Level
!Renown Score
!Number of Slots
|-
|Treacherous||<span style="color:red">-500</span>||0
|-
|Incompetent||<span style="color:red">-250</span>||0
|-
|Unreliable||<span style="color:red">-100</span>||0
|-
|Unknown||0||0
|-
|Recognized||250||1
|-
|Reliable||500||1
|-
|Competent||750||2
|-
|Professional||1050||2
|-
|Reputable||1400||3
|-
|Famed||1800||3
|-
|Great||2250||4
|-
|Glorious||2750||4
|-
|Fabled||3350||5
|-
|Legendary||4000||5
|-
|Invincible||8000||5
|-
|Immortal||14000||5
|}

__FORCETOC__
[[Category:Followers]]
[[Category:Upgrades]]
[[Category:Game Mechanics]]


# PAGE Named_and_Legendary_Items

{{Notice|Most of the individual named weapons pages have not been updated (primarily the shield damage stat is lower rather than being x1.5-2).}}
[[File:Armor_09.jpg|thumb|700px|Concept drawings of unique armor and helmets|center]]<br />
'''Named Items''' (also known as Famed Items in [[Ambitions]]) are rare items with unique looks, randomized stats and names (oftentimes their former owner).<ref name="dev_blog_45">[http://battlebrothersgame.com/dev-blog-45-named-items/ ''Dev Blog #45 - Named Items'']</ref> They have a red glow.<ref name="dev_post_01">[http://battlebrothersgame.com/forums/topic/fangshire-has-no-reddish-glow/#post-19211w/ Developer post on ''Fangshire Has No Reddish Glow'']</ref>

'''Legendary Items''' are unique items with extremely powerful and sometimes almost magic-like abilities.<ref name="dev_post_02">[https://steamcommunity.com/app/365360/discussions/0/537405286661071152/#c528398719791441155 Developer post on ''Unique named magical equipment'']</ref> They have a blue glow.<ref name="dev_post_01">[http://battlebrothersgame.com/forums/topic/fangshire-has-no-reddish-glow/#post-19211w/ Developer post on ''Fangshire Has No Reddish Glow'']</ref>

==Named Items==
The item tables contain in-game possible values (minima and maxima if applicable) extrapolated from the game scripts. Hovering over icons will show what they represent. Clicking on the items icons will open up specific pages. The weapons name could not fit into the tables (inherent width limitations) but was added over their durability values as an invisible overlay so they can be searched (Ctrl + F shortcut); when searching for a named weapon simply input the weapon type and omit the "named" word, e.g.: to successfully find the Named Battle Whip, the search query input needs to start from the word "battle". Sorting triggers for columns with weapon/armor parameters are placed in the corresponding column cells in a row below (with a golden arrow). <span style=color:grey;>(NOTICE: most of the individual named weapons pages have not been updated (primarily the shield damage stat is lower rather than being x1.5-2))</span>

===Weapons===
{{:Named Weapons}}

===Shields===
{{:Named Shields}}

===Armors===
{{:Named Armors}}

===Helmets===
{{:Named Helmets}}

==Legendary Items==
===Weapons===
{|class="sortable" style="margin: auto; text-align: center; width: 100%; font-size: small"
|-style="background: black"
! class="unsortable"|
!Name
![[File:Supplies_icon.png|20px|Durability]]
![[File:Regular_damage.png|20px|Regular damage]]
![[File:Direct_damage.png|20px|Direct damage]]
![[File:Armor_damage.png|20px|Armor damage]]
![[File:Fatigue.png|20px|Maximum Fatigue]]
![[File:Special.png|20px|Special]]
![[File:Gold_coin.png|15px|Worth]]
<!-- Obsidian Dagger -->
|-style="background-color: #141414"
|style="background: black" data-sort-value="Obsidian Dagger"|[[File:obsidian_dagger_70x70.png|30px|link=Obsidian Dagger|center|Obsidian Dagger]]
|style="padding: 5px 10px"|Obsidian Dagger
|style="white-space: nowrap; padding: 5px 10px"|<span style="font-size: 165%;>&infin;</span>
|style="white-space: nowrap; padding: 5px 10px"|25 - 45
|style="white-space: nowrap; padding: 5px 10px"|20%
|style="white-space: nowrap; padding: 5px 10px"|70%
|
|style="padding: 5px 10px"|Resurrects any human killed with it as a Wiederganger fighting for you
|style="white-space: nowrap; padding: 5px 10px"|5000
<!-- Reproach of the Old Gods -->
|-style="background-color: #141414"
|style="background: black" data-sort-value="Reproach of the Old Gods"|[[File:Sword_legendary_01_70x70.png|30px|link=Reproach of the Old Gods|center|Reproach of the Old Gods]]
|style="padding: 5px 10px"|Reproach of the Old Gods
|style="white-space: nowrap; padding: 5px 10px"|90
|style="white-space: nowrap; padding: 5px 10px"|50 - 55
|style="white-space: nowrap; padding: 5px 10px"|20%
|style="white-space: nowrap; padding: 5px 10px"|90%
|style="white-space: nowrap; padding: 5px 10px"|−8
|style="padding: 5px 10px"|Inflicts an additional <span style="color: red">10</span> - <span style="color: red">20</span> damage that ignores armor to up to three targets
|style="white-space: nowrap; padding: 5px 10px"|20000
<!-- Censer of the Diviner -->
|-style="background-color: #141414"
|style="background: black" data-sort-value="Censer of the Diviner"|[[File:Miasma flail 01 70x70.png|30px|center]]
|style="white-space: nowrap; padding: 5px 10px"|Censer of the Diviner
|style="white-space: nowrap; padding: 5px 10px"|120
|style="white-space: nowrap; padding: 5px 10px"|60 - 110
|style="white-space: nowrap; padding: 5px 10px"|30%
|style="white-space: nowrap; padding: 5px 10px"|110%
|style="white-space: nowrap; padding: 5px 10px"| -16
|style="padding: 5px 10px"|Leaves Miasma in any tile where the weapon is swung, hit or miss
|style="white-space: nowrap; padding: 5px 10px"|14000
<!-- Bloodletter's Reach -->
|-style="background-color: #141414"
|style="background: black" data-sort-value="Bloodletter's Reach"|[[File:Quiver 05.png|30px|center]]
|Bloodletter's Reach
|style="white-space: nowrap; padding: 5px 10px"|
|style="white-space: nowrap; padding: 5px 10px"|
|style="white-space: nowrap; padding: 5px 10px"|
|style="white-space: nowrap; padding: 5px 10px"|
|style="white-space: nowrap; padding: 5px 10px"|
|style="padding: 5px 10px"|Inflicts additional stacking <span style="color: red">10</span> bleeding damage per turn, for 2 turns
|style="white-space: nowrap; padding: 5px 10px"|700
|}

===Armors===
{|class="sortable" style="margin: auto; text-align: center; width: 100%; font-size: small"
|-style="background: black"
! class="unsortable"|
!Name
![[File:Supplies_icon.png|20px|Durability]]
![[File:Fatigue.png|20px|Maximum Fatigue]]
![[File:Special.png|20px|Special]]
![[File:Gold_coin.png|15px|Worth]]
<!-- ARMOR OF DAVKUL -->
|-style="background-color: #141414"
|style="background: black" data-sort-value="Davkul"|[[File:Icon_body_armor_81.png|35px|link=Aspect_of_Davkul|center|Aspect of Davkul]]
|style="padding: 5px 10px"|Aspect of Davkul
|style="white-space: nowrap; padding: 5px 10px"|270
|style="white-space: nowrap; padding: 5px 10px"|−18
|style="padding: 5px 10px"|Regenerates itself by <span style="color: green">90</span> points of durability each turn
|style="white-space: nowrap; padding: 5px 10px"|20000
<!-- IJIROK ARMOR -->
|-style="background-color: #141414"
|style="background: black" data-sort-value="Ijirok"|[[File:Icon_body_armor_98.png|35px|link=Armor_of_the_Ijirok|center|Armor of the Ijirok]]
|style="padding: 5px 10px"|Armor of the Ijirok
|style="white-space: nowrap; padding: 5px 10px"|320
|style="white-space: nowrap; padding: 5px 10px"|−32
|style="padding: 5px 10px"|Heals <span style="color: green">10</span> hitpoints of the wearer each turn
|style="white-space: nowrap; padding: 5px 10px"|12000
<!-- EMPERORS ARMOR -->
|-style="background-color: #141414"
|style="background: black" data-sort-value="Emperor"|[[File:Icon_body_armor_80.png|35px|link=The_Emperors_Armor|center|The Emperor's Armor]]
|style="padding: 5px 10px"|The Emperor's Armor
|style="white-space: nowrap; padding: 5px 10px"|400
|style="white-space: nowrap; padding: 5px 10px"|−30
|style="padding: 5px 10px"|Reflects <span style="color: green">25%</span> of damage taken in melee back to the attacker
|style="white-space: nowrap; padding: 5px 10px"|20000
|}

===Helmets===
{|class="sortable" style="margin: auto; text-align: center; width: 100%; font-size: small"
|-style="background: black"
! class="unsortable"|
!Name
![[File:Supplies_icon.png|20px|Durability]]
![[File:Fatigue.png|20px|Maximum Fatigue]]
![[File:Special.png|20px|Special]]
![[File:Gold_coin.png|15px|Worth]]
<!-- FANGSHIRE -->
|-style="background-color: #141414"
|style="background: black" data-sort-value="Fangshire"|[[File:Inventory_helmet_24.png|35px|link=The_Fangshire|center|The Fangshire]]
|The Fangshire
|style="white-space: nowrap; padding: 5px 10px"|60
|style="white-space: nowrap; padding: 5px 10px"|−5
|padding: 5px 10px"|Allows the wearer to see at night and negates any penalties due to nighttime
|style="white-space: nowrap; padding: 5px 10px"|300
<!-- MASK OF DAVKUL -->
|-style="background-color: #141414"
|style="background: black" data-sort-value="Davkul"|[[File:Inventory_helmet_85.png|35px|link=Glimpse_of_Davkul|center|Glimpse of Davkul]]
|Glimpse of Davkul
|style="white-space: nowrap; padding: 5px 10px"|270
|style="white-space: nowrap; padding: 5px 10px"|−10
|style="padding: 5px 10px"|Regenerates itself by <span style="color: green">90</span> points of durability each turn
|style="white-space: nowrap; padding: 5px 10px"|20000
<!-- IJIROK HELMET -->
|-style="background-color: #141414"
|style="background: black" data-sort-value="Ijirok"|[[File:Inventory_helmet_198.png|35px|link=Helmet_of_the_Ijirok|center|Helmet of the Ijirok]]
|Helmet of the Ijirok
|style="white-space: nowrap; padding: 5px 10px"|310
|style="white-space: nowrap; padding: 5px 10px"|−20
|style="padding: 5px 10px"|Heals <span style="color: green">10</span> hitpoints of the wearer each turn
|style="white-space: nowrap; padding: 5px 10px"|13000
<!-- EMPERORS COUNTENANCE -->
|-style="background-color: #141414"
|style="background: black" data-sort-value="Emperor"|[[File:Inventory_helmet_84.png|35px|link=The_Emperors_Countenance|center|The Emperor's Countenance]]
|The Emperor's Countenance
|style="white-space: nowrap; padding: 5px 10px"|400
|style="white-space: nowrap; padding: 5px 10px"|−20
|style="padding: 5px 10px"|Reflects <span style="color: green">25%</span> of damage taken in melee back to the attacker
|style="white-space: nowrap; padding: 5px 10px"|20000
|}

===Shields===
{|class="sortable" style="margin: auto; text-align: center; width: 100%; font-size: small"
|-style="background: black"
! class="unsortable"|
!Name
![[File:Supplies_icon.png|20px|Durability]]
![[File:Melee_defense.png|20px|Melee Defense]]
![[File:Ranged_defense.png|25px|Ranged Defense]]
![[File:Fatigue.png|20px|Maximum Fatigue]]
![[File:Special.png|20px|Special]]
![[File:Gold_coin.png|15px|Worth]]
<!-- GILDER'S EMBRACE -->
|-style="background-color: #141414"
|style="background: black" data-sort-value="Gilder's Embrace"|[[File:Icon_legendary_shield_01.png|30px|link=Gilder's Embrace|center|Gilder's Embrace]]
|Gilder's Embrace
|style="white-space: nowrap; padding: 5px 10px"|786
|style="white-space: nowrap; padding: 5px 10px"|+25
|style="white-space: nowrap; padding: 5px 10px"|+25
|style="white-space: nowrap; padding: 5px 10px"|−16
|style="padding: 5px 10px"|Everyone striking this shield receives the [[File:Dazed.png|20px|bottom]] [[Dazed (Status Effect)|Dazed]] effect
|style="white-space: nowrap; padding: 5px 10px"|20000
|}

== Locations ==
Non-legendary attackable locations can contain one or two named items (in addition to the items worn by the [[champions]]). The chance for a named item to appear is <math>\tfrac{\mathit{Resources} + 4 \cdot \mathit{Distance}}{5} - 37</math>. <math>\mathit{Resources}</math> are determined by the location type and <math>\mathit{Distance}</math> is the distance to the nearest settlement.<ref>scripts\entity\world\location.nut: onSpawned</ref>

The chance for a second named item is further reduced by the result of the first roll (1–100). On average that halves the chance if it was under 100%,<ref group=note>More precisely, <math>\tfrac{\mathit{FirstItemChance} - 1}{2}</math>.</ref> or subtracts 50.5% from it if it was higher than 100%.

Item has an almost<ref group=note>Likely an error:  <math>\tfrac{21}{81}</math> for weapons, <math>\tfrac{20}{81}</math> for every other type.</ref> equal chance to be a weapon, shield, helmet or armor. After the type has been determined, each item specific to a location is twice more likely to be chosen than any generic one. 

The following table shows the base percentage chance of a location to contain a named item: <math>\tfrac{\mathit{Resources}}{5} - 37</math>, without the <math>0.8 \cdot \mathit{Distance}</math> bonus.

{|class="article-table sortable" style="width: 100%"
! Name !! % !! World map description
|-
| Bandit Camp || style="text-align: right" | −1 || A fortified wooden encampment used by outlaws to stash their loot, rest in between raids and play drinking games.
|-
| Bandit Hideout || style="text-align: right" | −23 || An abandoned homestead with a collapsed roof.
|-
| Bandit Ruins || style="text-align: right" | −7 || A once proud fortress now lying in ruins.<br /> (southern) These ancient ruins cast their shadows far over the surrounding sands.
|-
| Barbarian Camp || style="text-align: right" | −1 || A set of fur jurts typical for the barbarians of the northern regions.
|-
| Barbarian Sanctuary || style="text-align: right" | 28 || Barbarians have flocked to this place and set up camp around a site of worship. A lot of fierce northern warriors are likely to be found nearby.
|-
| Barbarian Shelter || style="text-align: right" | −22 || A couple of simple barbarian fur huts huddled down in a circle.
|-
| Goblin Camp || style="text-align: right" | −13 || A makeshift encampment erected by goblins for shelter and stashing supplies.
|-
| Goblin Hideout || style="text-align: right" | −23 || An abandoned homestead with a collapsed roof.
|-
| Goblin Outpost || style="text-align: right" | 3 || A defensible outpost erected by goblins.
|-
| Goblin Ruins || style="text-align: right" | −7 || A once proud fortress now lying in ruins.<br /> (southern) These ancient ruins cast their shadows far over the surrounding sands.
|-
| Goblin Settlement || style="text-align: right" | 33 || The gates to a great underground Goblin city, its maze-like tunnels teeming with vicious greenskins.
|-
| Nomad Hidden Camp || style="text-align: right" | −1 || Nomads hide their camps well to avoid unwanted visitors or pursuing soldiers of the city states.
|-
| Nomad Ruins || style="text-align: right" | −7 || These ancient ruins cast their shadows far over the surrounding sands.
|-
| Nomad Tent City || style="text-align: right" | 23 || A large collection of colorful nomad huts and tents huddled together in the desert.
|-
| Nomad Tents || style="text-align: right" | −23 || A small camp of nomad tents that can be packed up and moved quickly.
|-
| Orc Camp || style="text-align: right" | −9 || A small camp erected by Orcs, either as part of a large horde in the vicinity or a small tribes of its own. They'll eventually move on to hunt and pillage elsewhere.
|-
| Orc Cave || style="text-align: right" | −17 || This cave has been occupied by greenskins and turned into a foul-smelling camp.
|-
| Orc Hideout || style="text-align: right" | −23 || An abandoned homestead with a collapsed roof.
|-
| Orc Ruins || style="text-align: right" | −7 || A once proud fortress now lying in ruins.<br /> (southern) These ancient ruins cast their shadows far over the surrounding sands.
|-
| Orc Settlement || style="text-align: right" | 33 || A large and foul-smelling sea of tents, with a warlord's tent and throne-room in the middle, the largest of all. It's home to a whole tribe until they move on to hunt and raid elsewhere.
|-
| Undead Buried Castle || style="text-align: right" | 33 || Sunken into the ground, this castle has been long abandoned, only to give refuge to much darker creatures.
|-
| Undead Crypt || style="text-align: right" | −1 || A long forgotten crypt haunted by the ghosts of the past. The dead won't find sleep here.
|-
| Undead Graveyard || style="text-align: right" | −11 || A place where people have buried their dead, placing them down for their last rest. Or at least they hoped so.
|-
| Undead Hideout || style="text-align: right" | −21 || An abandoned homestead with a collapsed roof.
|-
| Undead Mass Grave || style="text-align: right" | 3 || The sad remains of a merciless battle, an epidemic or other catastrophe. The survivors dug a large hole and piled all the corpses into it to get rid of them quickly.
|-
| style="white-space: nowrap" | Undead Necromancers Lair || style="text-align: right" | −7 || A necromancer has made this lair his refuge for practicing dark rituals undisturbed.
|-
| Undead Necropolis || style="text-align: right" | 33 || Once a thriving human settlement, this place has been defiled and fallen into ruin, turned into a necropolis of the undead. Waves of walking corpses pour forth to spread terror and fear in the surrounding lands.
|-
| Undead Ruins || style="text-align: right" | −1 || A once proud fortress now lying in ruins.<br /> (southern) These ancient ruins cast their shadows far over the surrounding sands.
|-
| Undead Vampire Coven || style="text-align: right" | 13 || Hidden for centuries, this ancient place became a safe haven for a coven of hemovores.
|}

==Notes==
<references group="note"/>

==References==
{{Reflist}}
[[Category:Named Items]]
[[Category:Legendary Items]]
[[Category:Items]]


# PAGE Wiederganger

{{Combatant3
|title           =Wiederganger

|image           =token-zombie.png
|health          =100
|head-armor      =0-50
|body-armor      =2-30
|initiative      =45
|melee-skill     =45
|melee-defense   =-5
|ranged-defense  =-5
|action-points   =6
|xp              =100
|immune=[[File:Night.png|23px|Nighttime]][[File:Perk_57.png|23px|Injuries]][[File:Bleeding.png|23px|Bleeding]][[File:Goblin_poison.png|23px|Poison]][[File:Morale.png|23px|Morale]][[File:Fatigue.png|23px|Fatigue]]
|not-immune=[[File:Stunned.png|23px|Stun]][[File:Status_effect_111.png|23px|Disarm]][[File:Net2.png|23px|Nets]][[File:Knock_Back.png|23px|Forced movement]][[File:Status_effect_116.png|23px|Fire]]
|stats=
{{SkillInfo|Damage dealt.png|1.1x damage dealt after day 90}}
|skills=
[[File:Perk 59.png|25px]] [[Backstabber]]<br/>
[[File:Perk 03.png|25px]] [[Battle Forged]]<br/>
[[File:Zombie bite.png|25px]] [[Bite (0 fatigue)|Bite]]
}}Wiederganger is a weak enemy from the [[Zombies]] faction.

== Equipment ==

*50% chance of a [[Bludgeon]], [[Militia Spear]], [[Butcher's Cleaver]], [[Pickaxe]], [[Wooden Stick]], [[Knife]] or [[Pitchfork]].
*A [[Leather Tunic]] (30), [[Apron]] (25), [[Butcher's Apron]] (25), [[Linen Tunic]] (20) (double chance), [[Monk's Robe]] (20), [[Leather Wraps]] (20), [[Sackcloth]] (10) or [[Tattered Sackcloth]] (5).
*33% chance of a [[Full Aketon Cap]] (50), [[Full Leather Cap]] (45), [[Aketon Cap]] (40), [[Open Leather Cap]] (40) or [[Hood]] (30).
*50% chance of body armor and headgear having only 50% durability, rolled separately.

==Skills==

{| class="article-table" style="font-size:85%;" |
! align="center" |'''''Icon'''''
! align="center" |'''''Name'''''
! align="center" |'''''AP'''''
! align="center" |'''''Fatigue'''''
! align="left" |'''''Description'''''
|-
{{:Bite (0 fatigue)}}
|}

==Behavior==
Wiedergangers come in large numbers. They don't have any idea about careful approach and instead slowly walk towards you, getting hit by [[Spears|spearwalls]].

They have a 66% chance to raise from the dead on their own once with 50% HP. When they do so, it causes a morale check similar to coming into melee. They can reanimate if someone stands on their corpse, and will push that unit one tile away. If there is nowhere to push, they stay dead. They can not revive if their head has been [[Fatality|decapitated or smashed]], but can if disemboweled.

If they kill a human, he can rise as a Wiederganger too. He uses stats of [[Wiederganger Brother]] and "Wiederganger" is added before his name.

They can pick up weapons from the ground.

They are unable to use [[Ranged Weapons|ranged weapons]], and they can only use basic and area weapon attacks. They don't spawn with weapons with area attacks though.

==Tips== 

*Early game enemies and often unarmed.
* They are tough, numerous and can rise again. Brothers will accumulate much fatigue and likely hit its limit. A single hit of their [[Maces|mace]] will inflict 30 fatigue. [[Recover (Perk)|Recover]] allows you to regain combat efficiency.
*The most dangerous weapons they wield are [[Militia Spear]] and [[Pickaxe]]. Spear gives them accuracy they lack, and Pickaxe can destroy your armor quickly.
*The most dangerous positions in your squad are flanks, where brothers are attacked by multiple enemies with [[Backstabber]]. Plan your defense accordingly.
*Graveyards, where you often fight them, have walls around them. You can use it to prevent being surrounded.
*Control them with [[Spears|spearwall]].
*If you lose your armor, even unarmed Wiedergangers can do serious damage with their bites.
*The sheer number of them coming close triggers many [[morale]] checks that can break morale if your resolve is low.

{{Navbox Enemies}}

[[Category:Enemies]]
[[Category:Undead]]
[[Category:Zombies]]


# PAGE Lone_Wolf

{| class="article-table"
!colspan=1 align="center" id="lone_wolf"|[[File:Lone_w.png|30px]] [[Lone Wolf]]
!colspan=1 align="center"|[[File:Difficulty_hard.png|80px]]
|-
!colspan=1 align="left" |[[File:Event_35.png|200px|center]]
!colspan=1 align="left" |<span style="color:grey">You've been traveling alone for a long time, taking part in tourneys and sparring with young nobles. A hedge knight tall as a tree, you never needed anybody for long. Is it true still?</span><br /><br />[[File:Special.png|25px|bottom]] <span style="color:gold">Lone Wolf</span>: Start with a single experienced hedge knight and great equipment, but low funds.<br />[[File:Special.png|25px|bottom]] <span style="color:gold">Elite Few</span>: Can never have more than 12 men in your roster.<br />[[File:Special.png|25px|bottom]] <span style="color:gold">Avatar</span>: If your hedge knight dies, the campaign ends.
|-
!colspan=2 align="left"|<div class="mw-collapsible mw-collapsed toggle-center">

'''Backgrounds'''

[[File:Hedge_knight.png|40px]] [[Character_Backgrounds#hedge_knight|Hedge Knight]] (lvl.4)

'''Resources'''

{| class='article-table' width='60%' |
! width='30%' |Starting Funds
! align='left' width='20%' |[[File:Crowns.png|40px|center|Crowns]]
! align='center' width='10%' |[[File:Supplies_icon.png|40px|center|Tools]]
! align='center' width='10%' |[[File:Ammo_icon.png|40px|center|Ammunition]]
! align='center' width='10%' |[[File:Medicine_icon.png|40px|center|Medicine]]
|-
| High:
|align='center'|1250<br /><span style="color:red">-100</span> on expert
|align='center'|20
|align='center'|0
|align='center'|10
|-
| Medium:
|align='center'|1000<br /><span style="color:red">-100</span> on expert
|align='center'|10
|align='center'|0
|align='center'|6
|-
| Low:
|align='center'|750<br /><span style="color:red">-100</span> on expert
|align='center'|5
|align='center'|0
|align='center'|3
|}

{| class='article-table' width='70%' |
! align='center' width='10%' |[[File:Asset_business_reputation.png|40px|Renown]]
! align='center' width='10%' |[[File:Asset_moral_reputation.png|40px|Reputation]]
! align='center' width='10%' |[[File:Relations.png|40px|Relations]]
! align='center' width='10%' |[[File:Food.png|40px|center|Provisions]]
|-
|align='center'|200
|align='center'|Neutral
|align='center'|Neutral
|align='center'|1x [[File:Smoked_Ham.png|bottom|25px|Smoked Ham]]
|}

'''Special'''

*Has a roster of <span style="color:red">12</span> brothers at most
*Has only <span style="color:red">90</span> instead of the usual 99 inventory slots
*When the hedge knight dies the campaign ends as a result of the [[File:Player_Character.png|25px|bottom]] [[Player Character]] trait
*The hedge knight can't start with [[File:Trait_icon_43.png|25px|bottom|link=Survivor]] [[Survivor]], [[File:Trait_icon_06.png|25px|bottom|link=Greedy]] [[Greedy]] or [[File:Trait_icon_35.png|25px|bottom|link=Disloyal]] [[Disloyal]] trait
*The hedge knight avatar is excluded from any events that could kill or sacrifice him as a brother
*The hedge knight you start with has his [[File:Melee_defense.png|25px|Melee Defense]] modified by <span style="color:red">-2</span> so he has a range of 4-8
*Has access to the [[Lone Wolf Origin Another Squire]], [[Lone Wolf Origin Depressing Lady]] and [[Lone Wolf Origin Squire]] event
</div>
|}
[[Category:Origins]]


# PAGE Provisions

[[File:Food.png|right|100px]]
:''The total amount of provisions you carry. The average man requires 2 provisions per day and more on difficult terrain. Running out of provisions will lower morale and will eventually lead to your people deserting you before dying of starvation.''
__TOC__
Provisions are food items in ''Battle Brothers''. By default, hired characters require two units of provisions per day. The [[Gluttonous]] and [[Spartan]] traits affect this amount. Each type of provision will spoil after a specific amount of time. More expensive provisions usually take longer to spoil than cheaper provisions. Your mercenaries will always consume  provisions with the least spoil time.

If you fail to feed your mercenaries, their [[mood]] will decrease and after a while and if angered enough they may decide to desert your company.

Food variety may affect your company's mood in different ways. The [[Good Food Variety]] event will boost the mood of your men; the [[No Food Variety]] event, on the contrary, can result in the mood penalty for the mercenaries; [[Fat]] and [[Gluttonous]] are affected stronger than others, while [[Spartan]] brothers are indifferent to provisions variety in any way. [[Gladiator (Background)|Gladiator]]s require high priced provisions to [[Gladiators Food|maintain]] their adequate mood, while [[Lowborn_(Affiliation)|lowborn]] mercenaries are well used to the most basic food around (ground grains). A wide variety of provision types is required to be able to hire the [[The_Cook_(Follower)|follower cook]], while all provision types are necessary for one of the company's [[Have All Provisions|ambition]] completion.

==Purchasable Provisions==
{| style="margin:auto;" width="100%"
| align="center" |[[File:Inventory_provisions_03.png]]<br />Ground Grains<br />Base worth: 50[[File:Crowns.png|23px]]<br />Spoil time: 7 days
| align="center" |[[File:inventory_provisions_21.png]]<br />Rice<br />Base worth: 60[[File:Crowns.png|23px]]<br />Spoil time: 8 days
| align="center" |[[File:Inventory_provisions_04.png]]<br />Roots and Berries<br />Base worth: 60[[File:Crowns.png|23px]]<br />Spoil time: 8 days
| align="center" |[[File:Inventory_provisions_05.png]]<br />Bread<br />Base worth: 65[[File:Crowns.png|23px]]<br />Spoil time: 8 days
| align="center" |[[File:Inventory_provisions_06.png]]<br />Dried Fish<br />Base worth: 70[[File:Crowns.png|23px]]<br />Spoil time: 8 days
| align="center" |[[File:Inventory_provisions_07.png]]<br />Mushrooms<br />Base worth: 70[[File:Crowns.png|23px]]<br />Spoil time: 9 days
| align="center" |[[File:Inventory_provisions_14.png]]<br />Beer<br />Base worth: 75[[File:Crowns.png|23px]]<br />Spoil time: 10 days
|-
|&nbsp;
|-
| align="center" |[[File:Inventory_provisions_08.png]]<br />Dried Fruits<br />Base worth: 80[[File:Crowns.png|23px]]<br />Spoil time: 10 days
| align="center" |[[File:inventory_provisions_20.png]]<br />Dates<br />Base worth: 80[[File:Crowns.png|23px]]<br />Spoil time: 10 days
| align="center" |[[File:Inventory_provisions_09.png]]<br />Goat Cheese<br />Base worth: 85[[File:Crowns.png|23px]]<br />Spoil time: 11 days
| align="center" |[[File:Inventory_provisions_12.png]]<br />Mead<br />Base worth: 90[[File:Crowns.png|23px]]<br />Spoil time: 11 days
| align="center" |[[File:Inventory_provisions_11.png]]<br />Smoked Ham<br />Base worth: 95[[File:Crowns.png|23px]]<br />Spoil time: 12 days
| align="center" |[[File:Inventory_provisions_10.png]]<br />Cured Venison<br />Base worth: 95[[File:Crowns.png|23px]]<br />Spoil time: 12 days
| align="center" |[[File:inventory_provisions_22.png]]<br />Dried Lamb<br />Base worth: 105[[File:Crowns.png|23px]]<br />Spoil time: 13 days
|-
|&nbsp;
|-
|
|
| align="center" |[[File:Inventory_provisions_13.png]]<br />Wine<br />Base worth: 110[[File:Crowns.png|23px]]<br />Spoil time: 14 days
| align="center" colspan="2" |[[File:Inventory_provisions_16.png]]<br />Masterfully Cured Rations<br />Base worth: 150[[File:Crowns.png|23px]]<br />Spoil time: 16 days
|
|}

==Other Provisions==
{| width="100%" cellpadding="5"
| align="center" |[[File:Inventory_provisions_15.png]]<br />{{tooltip|Strange Meat|Can be looted from some beasts and encampments, found and crafted in some events}}<br />Base worth: 50[[File:Crowns.png|23px]]<br />Spoil time: 4 days
| align="center" |[[File:Inventory_provisions_17.png]]<br />{{tooltip|Black Marsh Stew|Can be looted from a Hexe}}<br />Base worth: 85[[File:Crowns.png|23px]]<br />Spoil time: 12 days
| align="center" |[[File:Inventory_provisions_19.png]]<br />{{tooltip|Fermented Unhold Heart|Craftable provision}}<br />Base worth: 150[[File:Crowns.png|23px]]<br />Spoil time: 20 days
|}

==Notes==
* Base worth is indicated for a provision of 25 units at their highest spoil time value.
* Spoil time is the best value provided for provisions bought at the [[Settlement_buildings#Marketplace|Marketplace]] or looted from greenskins and beasts in the case of Strange Meat.
* Provisions looted from defeated enemies vary dramatically in their remaining spoil time. This is especially true for Strange Meat which most commonly will have only a day or two before spoiling.
* [[The Cook (Follower)|The follower Cook]] makes all provisions last 3 extra days.

==Food consumption and terrain types==
<center>{{Terrain types and food consumption}}</center>
To see some of the world terrain tiles images, see: [[Global Map]].
[[Category:Global Map resources]]
[[Category:Items]]


# PAGE Medical_Supplies

{{Infobox accessory
|title={{PAGENAME}}
|image=[[File:medicine.png|thumb]]
|worth=200
}}[[File:Medical_Supplies_(item).png|thumb|270px]]

== Description ==
''Medical supplies consist of bandages, herbs, salves and the like, and are used to heal the more severe injuries sustained by your men in battle.''

== Where Can They Be Found? ==
* Can be bought at a [[Settlement_buildings#Market|Marketplace]]. 
** [[Settlements_and_attached_locations#Supplies|Herbalist's Grove]] substantially increases availability. 
** [[Settlements_and_attached_locations#Provisions|Mushroom Grove]] and [[Settlements_and_attached_locations#Provisions|Gatherer's Hut]] increase availability (to a lesser extent).
* Can be looted after battle.
* Can be gained in the [[Broken Cart]], [[Herbs Along the Way]], [[March Wear and Tear]] events.

== Notes ==
* One point of [[Medical Supplies]] is required each day for every injury to improve and ultimately heal. Lost hitpoints heal on their own.
* Running out of [[Medical Supplies]] will leave your men unable to recover from [[Temporary Injuries]], with the exception of injuries healed in events.
* Maximum carrying capacity is determined by Economic Difficulty of the game: 100 - for Veteran, Expert; 150 - for Beginner.
* [[The Quartermaster (Follower)|The Quartermaster]] will increase carrying capacity by 50.
* [[The Scout (Follower)|The Scout]] will prevent [[Sickness]] and other [[Temporary Injuries]] caused by traversing terrain.
* Some amount can be lost or used in the [[Deserter Origin Volunteer]], [[Greenskins Pet Goblin]], [[March Wear and Tear]], [[Thief Caught]] events.

[[Category:Global Map resources]]
[[Category:Items]]


# PAGE Indebted_(Background)

{| class="article-table" style="text-align:center"
!colspan=5 id="indebted"|[[File:Background_60.png|40px]]<span style="font-variant: small-caps; font-size: 120%"> [[Indebted (Background)|Indebted]]</span>
!colspan=2|[[File:Level.png|25px|Starting Level]] 1
!colspan=2|[[File:Asset_daily_money.png|25px|Base Wage]] 0
|-
!
!align='center'|[[File:Health.png|25px|Hitpoints|bottom]]
!align='center'|[[File:Melee_skill.png|25px|Melee Skill|bottom]]
!align='center'|[[File:Ranged_skill.png|25px|Ranged Skill|bottom]]
!align='center'|[[File:Melee_defense.png|25px|Melee Defense|bottom]]
!align='center'|[[File:Ranged_defense.png|25px|Ranged Defense|bottom]]
!align='center'|[[File:Fatigue.png|25px|Fatigue|bottom]]
!align='center'|[[File:Resolve.png|25px|Resolve|bottom]]
!align='center'|[[File:Initiative.png|25px|Initiative|bottom]]
|-
!Attribute<br />Range
|align='center'|40<br />50
|align='center'|47<br />57
|align='center'|32<br />42
|align='center'|0<br />5
|align='center'|0<br />5
|align='center'|90<br />100
|align='center'|25<br />40
|align='center'|95<br />105
|-
!Attribute<br />Averages
|align='center'|45
|align='center'|52
|align='center'|37
|align='center'|2,5
|align='center'|2,5
|align='center'|95
|align='center'|32,5
|align='center'|100
|-
!Attribute<br />min./max.
|align='center'| <span style="color:red">-10</span><br /><span style="color:red">-10</span>
|align='center'| <br />
|align='center'| <br />
|align='center'| <br />
|align='center'| <br />
|align='center'| <br />
|align='center'| <span style="color:red">-5</span><br />-
|align='center'| <span style="color:red">-5</span><br /><span style="color:red">-5</span>
|-
|colspan=9|<div style="text-align: left" class="mw-collapsible mw-collapsed toggle-center">
'''Special'''
*Is always content with being in reserve
*No morale check triggered for non-indebted allies upon dying
*If you are playing the [[Manhunters]] origin:
**Limited to character level 7
**<span style="color:green">10%</span> more [[File:Xp_received.png|25px|Experience recieved|bottom]] experience received
**Is permanently dead if struck down and will not survive with a permanent injury
'''Affiliations'''
* [[Lowborn (Affiliation)|Lowborn]]
'''Events'''
*Unable to desert because of [[File:Bad_mood.png|21px]] bad mood. ([[Desertion]])

*You can gain free [[Indebted (Background)|Indebted]] brothers. ([[Manhunters Origin Capture Prisoner]]) ([[Pirates]])

*[[Indebted (Background)|Indebted]] brothers can't be converted. ([[Cultist vs Uneducated]]) ([[Cultist Origin vs Uneducated]])

*Will never demand a pay raise. ([[Player Is Rich]])

*Can never become a drunkard. ([[Oldguard Becomes Drunkard]])

*Is excluded from certain events. ([[Rookie Gets Hurt]]) ([[Wound Heals]])
<!--
*Retirement 1: You purchased %name as an indebted for almost no gold and continued t pay him a slave's wage  for his stay as a sellsword. He did made himself an effective fighter, no doubt believing it was better to be paid nothing and fight to stay alive than be paid nothing an give up and rot. After you departed, you heard that the battle Brothers traveled south on a campaign and the indebted got a good chance to exact a good bit of revenge on a number of enemies in his past. Thankfully, he does not consider you one such person despite you having kept him enslaved.-->

'''Excluded Talents'''
*[[File:Resolve.png|25px|Resolve|bottom]] [[File:Health.png|25px|Hitpoints|bottom]]
'''Excluded Traits'''
*[[File:Trait_icon_21.png|25px|bottom|link=Athletic]][[File:Trait_icon_37.png|25px|bottom|link=Brave]][[File:Trait_icon_24.png|25px|bottom|link=Cocky]][[File:Trait_icon_31.png|25px|bottom|link=Determined]][[File:Trait_icon_29.png|25px|bottom|link=Drunkard]][[File:Trait_icon_10.png|25px|bottom|link=Fat]][[File:Trait_icon_30.png|25px|bottom|link=Fearless]][[File:Trait_icon_07.png|25px|bottom|link=Gluttonous]][[File:Trait_icon_06.png|25px|bottom|link=Greedy]][[File:Trait_icon_51.png|25px|bottom|link=Hate for Beasts]][[File:Trait_icon_52.png|25px|bottom|link=Hate for Greenskins]][[File:Trait_icon_50.png|25px|bottom|link=Hate for Undead]][[File:Trait_icon_44.png|25px|bottom|link=Iron Jaw]][[File:Loyal.png|25px|bottom|link=Loyal]][[File:lucky.png|25px|bottom|link=Lucky]][[File:Trait_icon_08.png|25px|bottom|link=Spartan]][[File:Trait_icon_15.png|25px|bottom|link=Strong]][[File:Trait_icon_43.png|25px|bottom|link=Survivor]][[File:Trait_icon_14.png|25px|bottom|link=Tough]]
</div>
|}

{| class="article-table" style="text-align:center"
!colspan=5|[[File:Background_60.png|40px]]<span style="font-variant: small-caps; font-size: 120%"> Barbarian [[Indebted (Background)|Indebted]]</span>
!colspan=2|[[File:Level.png|25px|Starting Level]] 1
!colspan=2|[[File:Asset_daily_money.png|25px|Base Wage]] 0
|-
!
!align='center'|[[File:Health.png|25px|Hitpoints|bottom]]
!align='center'|[[File:Melee_skill.png|25px|Melee Skill|bottom]]
!align='center'|[[File:Ranged_skill.png|25px|Ranged Skill|bottom]]
!align='center'|[[File:Melee_defense.png|25px|Melee Defense|bottom]]
!align='center'|[[File:Ranged_defense.png|25px|Ranged Defense|bottom]]
!align='center'|[[File:Fatigue.png|25px|Fatigue|bottom]]
!align='center'|[[File:Resolve.png|25px|Resolve|bottom]]
!align='center'|[[File:Initiative.png|25px|Initiative|bottom]]
|-
!Attribute<br />Range
|align='center'|50<br />60
|align='center'|47<br />57
|align='center'|32<br />42
|align='center'|<span style="color:red">-2</span><br />4
|align='center'|<span style="color:red">-2</span><br />4
|align='center'|95<br />105
|align='center'|20<br />35
|align='center'|95<br />105
|-
!Attribute<br />Averages
|align='center'|55
|align='center'|52
|align='center'|37
|align='center'|1
|align='center'|1
|align='center'|100
|align='center'|27,5
|align='center'|100
|-
!Attribute<br />min./max.
|align='center'| <br />
|align='center'| <br />
|align='center'| <br />
|align='center'| <span style="color:red">-2</span><br /><span style="color:red">-1</span>
|align='center'| <span style="color:red">-2</span><br /><span style="color:red">-1</span>
|align='center'| +5<br />+5
|align='center'| <span style="color:red">-10</span><br /><span style="color:red">-5</span>
|align='center'| <span style="color:red">-5</span><br /><span style="color:red">-5</span>
|-
|colspan=9|<div style="text-align: left" class="mw-collapsible mw-collapsed toggle-center">
'''Special'''
*Is always content with being in reserve
*No morale check triggered for non-indebted allies upon dying
*If you are playing the [[Manhunters]] origin:
**Limited to character level 7
**<span style="color:green">10%</span> more [[File:Xp_received.png|25px|Experience recieved|bottom]] experience received
**Is permanently dead if struck down and will not survive with a permanent injury
'''Affiliations'''
* [[Lowborn (Affiliation)|Lowborn]]
'''Events'''
*Unable to desert because of [[File:Bad_mood.png|21px]] bad mood. ([[Desertion]])

*You can gain free [[Indebted (Background)|Indebted]] brothers. ([[Manhunters Origin Capture Prisoner]]) ([[Pirates]])

*[[Indebted (Background)|Indebted]] brothers can't be converted. ([[Cultist vs Uneducated]]) ([[Cultist Origin vs Uneducated]])

*Will never demand a pay raise. ([[Player Is Rich]])

*Can never become a drunkard. ([[Oldguard Becomes Drunkard]])

*Is excluded from certain events. ([[Rookie Gets Hurt]]) ([[Wound Heals]])
'''Excluded Talents'''
*[[File:Resolve.png|25px|Resolve|bottom]] [[File:Health.png|25px|Hitpoints|bottom]]
'''Excluded Traits'''
*[[File:Trait_icon_21.png|25px|bottom|link=Athletic]][[File:Trait_icon_37.png|25px|bottom|link=Brave]][[File:Trait_icon_24.png|25px|bottom|link=Cocky]][[File:Trait_icon_31.png|25px|bottom|link=Determined]][[File:Trait_icon_29.png|25px|bottom|link=Drunkard]][[File:Trait_icon_10.png|25px|bottom|link=Fat]][[File:Trait_icon_30.png|25px|bottom|link=Fearless]][[File:Trait_icon_07.png|25px|bottom|link=Gluttonous]][[File:Trait_icon_06.png|25px|bottom|link=Greedy]][[File:Trait_icon_51.png|25px|bottom|link=Hate for Beasts]][[File:Trait_icon_52.png|25px|bottom|link=Hate for Greenskins]][[File:Trait_icon_50.png|25px|bottom|link=Hate for Undead]][[File:Trait_icon_44.png|25px|bottom|link=Iron Jaw]][[File:Loyal.png|25px|bottom|link=Loyal]][[File:lucky.png|25px|bottom|link=Lucky]][[File:Trait_icon_08.png|25px|bottom|link=Spartan]][[File:Trait_icon_15.png|25px|bottom|link=Strong]][[File:Trait_icon_43.png|25px|bottom|link=Survivor]][[File:Trait_icon_14.png|25px|bottom|link=Tough]]
</div>
|}

{| class="article-table" style="text-align:center"
!colspan=5|[[File:Background_60.png|40px]]<span style="font-variant: small-caps; font-size: 120%"> Southern [[Indebted (Background)|Indebted]]</span>
!colspan=2|[[File:Level.png|25px|Starting Level]] 1
!colspan=2|[[File:Asset_daily_money.png|25px|Base Wage]] 0
|-
!
!align='center'|[[File:Health.png|25px|Hitpoints|bottom]]
!align='center'|[[File:Melee_skill.png|25px|Melee Skill|bottom]]
!align='center'|[[File:Ranged_skill.png|25px|Ranged Skill|bottom]]
!align='center'|[[File:Melee_defense.png|25px|Melee Defense|bottom]]
!align='center'|[[File:Ranged_defense.png|25px|Ranged Defense|bottom]]
!align='center'|[[File:Fatigue.png|25px|Fatigue|bottom]]
!align='center'|[[File:Resolve.png|25px|Resolve|bottom]]
!align='center'|[[File:Initiative.png|25px|Initiative|bottom]]
|-
!Attribute<br />Range
|align='center'|40<br />50
|align='center'|47<br />57
|align='center'|32<br />42
|align='center'|0<br />5
|align='center'|0<br />5
|align='center'|95<br />105
|align='center'|20<br />35
|align='center'|95<br />105
|-
!Attribute<br />Averages
|align='center'|45
|align='center'|52
|align='center'|37
|align='center'|2,5
|align='center'|2,5
|align='center'|100
|align='center'|27,5
|align='center'|100
|-
!Attribute<br />min./max.
|align='center'| <span style="color:red">-10</span><br /><span style="color:red">-10</span>
|align='center'| <br />
|align='center'| <br />
|align='center'| <br />
|align='center'| <br />
|align='center'| +5<br />+5
|align='center'| <span style="color:red">-10</span><br /><span style="color:red">-5</span>
|align='center'| <span style="color:red">-5</span><br /><span style="color:red">-5</span>
|-
|colspan=9|<div style="text-align: left" class="mw-collapsible mw-collapsed toggle-center">
'''Special'''
*Is always content with being in reserve
*No morale check triggered for non-indebted allies upon dying
*If you are playing the [[Manhunters]] origin:
**Limited to character level 7
**<span style="color:green">10%</span> more [[File:Xp_received.png|25px|Experience recieved|bottom]] experience received
**Is permanently dead if struck down and will not survive with a permanent injury
'''Affiliations'''
* [[Lowborn (Affiliation)|Lowborn]]
'''Events'''
*Unable to desert because of [[File:Bad_mood.png|21px]] bad mood. ([[Desertion]])

*You can gain free [[Indebted (Background)|Indebted]] brothers. ([[Manhunters Origin Capture Prisoner]]) ([[Pirates]])

*[[Indebted (Background)|Indebted]] brothers can't be converted. ([[Cultist vs Uneducated]]) ([[Cultist Origin vs Uneducated]])

*Will never demand a pay raise. ([[Player Is Rich]])

*Can never become a drunkard. ([[Oldguard Becomes Drunkard]])

*Is excluded from certain events. ([[Rookie Gets Hurt]]) ([[Wound Heals]])
'''Excluded Talents'''
*[[File:Resolve.png|25px|Resolve|bottom]] [[File:Health.png|25px|Hitpoints|bottom]]
'''Excluded Traits'''
*[[File:Trait_icon_21.png|25px|bottom|link=Athletic]][[File:Trait_icon_37.png|25px|bottom|link=Brave]][[File:Trait_icon_24.png|25px|bottom|link=Cocky]][[File:Trait_icon_31.png|25px|bottom|link=Determined]][[File:Trait_icon_29.png|25px|bottom|link=Drunkard]][[File:Trait_icon_10.png|25px|bottom|link=Fat]][[File:Trait_icon_30.png|25px|bottom|link=Fearless]][[File:Trait_icon_07.png|25px|bottom|link=Gluttonous]][[File:Trait_icon_06.png|25px|bottom|link=Greedy]][[File:Trait_icon_51.png|25px|bottom|link=Hate for Beasts]][[File:Trait_icon_52.png|25px|bottom|link=Hate for Greenskins]][[File:Trait_icon_50.png|25px|bottom|link=Hate for Undead]][[File:Trait_icon_44.png|25px|bottom|link=Iron Jaw]][[File:Loyal.png|25px|bottom|link=Loyal]][[File:lucky.png|25px|bottom|link=Lucky]][[File:Trait_icon_08.png|25px|bottom|link=Spartan]][[File:Trait_icon_15.png|25px|bottom|link=Strong]][[File:Trait_icon_43.png|25px|bottom|link=Survivor]][[File:Trait_icon_14.png|25px|bottom|link=Tough]]
</div>
|}
<noinclude>{{Navbox Backgrounds}}</noinclude>
[[Category:Backgrounds]]
