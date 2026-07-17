# BOHEMIA — ADDENDUM: COMBAT DNA — STEAL ROGUE FABLE IV, BEAT IT WITH GUNS + 120 BPM
*6.30.26 — the north-star combat philosophy doc. Names the RF4 lineage explicitly, maps what Bohemia already inherits, and pinpoints where guns and the 120 BPM dial let Bohemia go past it. Extends GDD v3 Part One and BOHEMIA_ADDENDUM_COMBAT_6_27_26.md. Nothing here overrides a [LOCKED] in that combat addendum; it frames why those locks are right.*

---

## THE GOAL (Paolo, 6.30.26)

Steal everything good from Rogue Fable IV. Do it better, with guns, on the 120 BPM Dead Eye Dial. RF4 is the reference feel already named in GDD v3 (§Lethality & Feel: "Rogue Fable 4 — fast/slow oscillation, skill over stats, near-constant motion"). This doc makes that reference concrete so every combat decision has a yardstick.

---

## WHAT RF4 ACTUALLY IS (from its designer's own words)

RF4 is a decade-refined traditional roguelike whose designer, Justin Wang, wrote his philosophy down. The core, in his framing:

**The foundational design tension:** the game deliberately maximizes two things most designers treat as opposites, at the same time. Highly tactical, reward-clever-planning roguelike depth, AND fast, crunchy, high-mobility "boomer shooter" mayhem. The goal is explicitly NOT a middle ground between slow-thoughtful and fast-crunchy. It's both at full volume.

The pillars that fall out of that:

1. **Skill over stats.** Your skill as a player matters vastly more than character numbers. People have won with zero in six stats, no items, no levels, no hits taken. Every run winnable, every build viable.
2. **Movement is the identity.** Near-constant motion. You run from some enemies while running toward others. Move to dodge projectiles, sidestep melee, escape clouds, circle slow brutes, dive the back line. Movement is the most unique mechanic the series evolved and he leans hard into it.
3. **Small fights, deep enemies.** 3-6 enemies, not swarms. Bigger swarms devolve into messy kiting and choke-point abuse. He wants even 3-4 enemies to be a real challenge and a wandering extra to be a serious problem. Enemies designed to synergize so each group is a unique puzzle.
4. **No fights won before they begin.** You should not one-shot a whole unaware group with one fireball. Resources tuned so you can't dump everything in two turns, win, and rest to refill. Individual fights run a bit longer so advanced tactics can play out, while still feeling snappy.
5. **Elegance breeds depth.** His recurring move is MERGING mechanics (four defensive stats into one "Block Points," then Protection into a deterministic system). Tight, streamlined, few edge cases, and the depth comes from interaction, not from stat bloat.
6. **Determinism where it counts.** He actively removed random damage mitigation to make outcomes predictable. Randomness in layout and drops, not in whether your plan works.
7. **Information on the field, not in menus.** Most critical info presented in the world and on the battlefield itself, not buried in formulas.
8. **Environment as a combatant.** Terrain effects, clouds, auras, cover, choke points, open spaces. The environment is a constant factor, and emergent interactions between abilities, items, and terrain are the point.
9. **Juice sells the gameplay.** Late in dev he devotes a whole phase to making every action POP with its own effect, on the belief that visuals and feel are inseparable from how the game actually plays.

---

## WHAT BOHEMIA ALREADY INHERITS (the DNA is already in the locks)

Cross-referenced against BOHEMIA_ADDENDUM_COMBAT_6_27_26.md. Bohemia already lives most of RF4's philosophy. Naming it so it's deliberate, not accidental:

- **Skill over stats → already locked harder than RF4.** "Perfect play = zero damage at any enemy count." "A hit always means you could have done something different." Damage is the price of a slip, never a tax. That IS RF4's zero-hit-run ethos made the baseline expectation.
- **No fights won before they begin → already locked, better.** RF4 nerfs alpha-strikes so you can't end a fight turn one. Bohemia INVERTS it into a reward without a punishment: a full clean-kill chain is ONE turn (8 perfect kills = 1 turn), but only if your execution is perfect on the dial. The skill ceiling gives the one-turn clear; sloppy play doesn't. Same anti-alpha-strike goal, reached by skill gating instead of nerfing.
- **Small fights, deep enemies → the positioning axis is already the plan.** The difficulty packages touch ONLY minigame execution; enemy count, flanking, and coordination live on the separate overworld positioning layer. That's RF4's "3-4 enemies should be hard, a wandering extra is a serious problem" as an explicit design axis.
- **Determinism → already a combat law.** No random-per-frame jitter; patterns are deterministic and learnable. When wounded, the aim shakes but the dial never speeds up against you. This is exactly RF4 removing random mitigation, applied to the aim mechanic.
- **Information on the field → already the dial's whole premise.** The dial IS the readout. Watching/reading windows costs nothing and no turn; you commit only when you choose. The tell is on the battlefield (the sweep, the cover states, the wound shake), not in a menu.
- **Environment as combatant → cover and positioning already locked.** Per-enemy cover states, line-of-sight gating (only enemies with an angle on you are in the fight), the sprint-to-cover ability. Terrain/positioning is the next system after the cover rewrite.
- **Juice → already a value.** The killshot camera system (SHARP/HAMMER/CINE-FOLLOW/ORBIT/X-RAY, plus HELD BREATH / CHAIN / LAST STAND) is RF4's "make every action POP" applied to the gun kill.

The takeaway: Bohemia is not copying RF4's surface (dungeon, spells, fantasy). It already shares RF4's SKELETON (skill-over-stats, deterministic, movement-and-position, small deep fights, juice) and puts a completely different body on it.

---

## WHERE GUNS + 120 BPM BEAT IT (the actual thesis)

RF4 is turn-based and grid-discrete. Its "near-constant motion" is a feeling produced by tight turns, but under the hood every action is a discrete step you take in your own time. Bohemia's guns and the 120 BPM dial let it do things RF4 structurally cannot. These are the places to push.

### 1. The dial makes EXECUTION a live skill, not just decision-making
RF4's skill is almost entirely decision skill: pick the right ability, the right tile, the right target. Execution is trivial (you click, it happens). Bohemia adds a second skill axis RF4 doesn't have: **can you actually land the shot** on a moving 120 BPM pattern. So Bohemia rewards decision skill (who/where, the RF4 layer) AND execution skill (the dial). Two skill ceilings stacked. A player can be tactically brilliant and still miss; a player can have twitch aim and still get flanked to death. Beating RF4 means honoring BOTH and never letting one trivialize the other.

### 2. Rhythm is a skill dimension that doesn't exist in RF4
The 120 BPM spine means timing is musical, not just turn-ordinal. Patterns phase against the beat; landing on-beat is its own learnable feel. RF4 has timing only in the abstract turn sense. Bohemia can make the player FEEL the pocket, the way a rhythm game does, layered on top of tactics. This is a genuinely novel fusion (tactical roguelike + rhythm-timed execution) that RF4 never attempts. It's the single biggest "better," and it's already the spine, so protect it: no mechanic should break the 120 grid.

### 3. Guns change the geometry of the fight
RF4 movement is melee-and-spell ranged: you close, you kite, you circle. Guns mean **line of sight and cover are the whole battlefield**, instantly and at any range. This is why Bohemia's cover system (per-enemy tucked/peeking/firing, LOS gating) is the right RF4-analog: it's the gun-native version of RF4's terrain-and-positioning game. Where RF4 asks "what's my path around this brute," Bohemia asks "what angle do I have, who can see me, when do they pop." Same positioning depth, gun-shaped.

### 4. The "no punishment for time" rule out-elegances RF4's resource tax
RF4 stops rest-refill-cheese by tuning mana and cooldowns (a resource tax). Bohemia's rule is cleaner and more Wang-than-Wang on his own elegance principle: **the game never punishes taking your time; every reward is pure upside for being sharp.** You can read the dial forever for free. There's no resource clock forcing haste. The tension comes purely from the skill of execution and the danger of position, not from a depleting bar. That's a more elegant solution to the same "don't let players stall-cheese" problem, because it removes a system (the tax) instead of tuning one.

### 5. Difficulty from shape and speed, never cheap tricks
RF4 gets difficulty from enemy synergy and ranked modifiers. Bohemia's dial gets it from pattern SHAPE and SPEED with zero random jitter, and the two absolute rules (never punish slowness; difficulty from shake not speed when wounded). This is arguably a purer expression of RF4's own "deterministic, skill-over-stats" value than RF4 fully achieves, because even the difficulty knob stays fair and learnable.

---

## THE ONE THING RF4 DOES THAT BOHEMIA MUST NOT LOSE

RF4's fights run *a bit longer* on purpose so advanced tactics can play out, while staying snappy. The risk in Bohemia: the one-turn perfect chain plus twitch execution could collapse fights into instant clears that skip the tactical layer entirely. The counterweight is already in the design (positioning axis, cover pop timing, multi-enemy making the chain hard to sustain), but it must be actively protected. **The chain clear is the master-player reward, not the default path.** If the median fight becomes a one-turn wipe, the RF4 tactical depth is gone and it's just an aim trainer. Multi-enemy positioning and cover timing are what keep the fight a fight. Guard that balance the way Wang guards his 3-6 enemy count.

---

## DESIGN YARDSTICK (use on every combat decision)

Before adding or changing a combat mechanic, check it against the stolen RF4 pillars plus the Bohemia advantages:

- Does it reward player skill over character stats? (RF4 pillar 1)
- Does it keep the player thinking about position and angle? (pillar 2/3, gun-shaped)
- Is it deterministic and learnable, or does it add cheap randomness? (pillar 6)
- Is the tell ON the battlefield, readable for free? (pillar 7)
- Does it stay on the 120 BPM grid? (Bohemia advantage 2)
- Does it MERGE/simplify, or add stat bloat? (pillar 5)
- Does it preserve "no punishment for taking time"? (Bohemia advantage 4)
- Does it protect the tactical layer from being trivialized by execution alone? (the must-not-lose)

If a mechanic fails these, it's not RF4-caliber and it doesn't ship.

---

## OPEN QUESTIONS THIS FRAMING RAISES [PENDING]

- **Build variety.** RF4's depth leans hard on many viable class/talent builds (7+ classes, cross-classing, "every build viable"). Bohemia's equivalent is the perk/ability system (catalogued but not built, per the combat addendum) plus weapon types. Does Bohemia want RF4-level build diversity, or is the dial execution the primary variety axis with builds as a lighter layer? Decides how big the perk tree needs to be.
- **Environment interactions.** RF4's terrain/cloud/aura emergent interactions are a whole pillar. Bohemia has cover and positioning; how much environmental interaction (fire spreads, blackouts kill LOS, weather changes cover) does the gun-native version want? The blackout-as-escape is already canon and is exactly this kind of interaction.
- **Enemy synergy design.** RF4's "each group is a unique puzzle because enemies complement each other." Bohemia's enemy roster (GDD v2 §19: human/animal/tech) needs synergy design so groups are puzzles, not just HP stacks. Not yet specced.
- **The rhythm ceiling.** How hard does the 120 BPM timing layer push? Pure tactical players vs rhythm-skilled players should both have a path. The "fair-shot slowdown" and EASY package are the accessibility floor; the ceiling (BOHEMIAN package + greed) is where rhythm mastery lives. Where exactly the median player sits on that curve is a tuning question.

---

*BOHEMIA — Combat DNA — 6.30.26*
*Steal the skeleton (skill over stats, deterministic, position-and-movement, small deep fights, juice). Put a gun in its hand and a heartbeat under it. Two skill ceilings stacked: decide right AND execute on the beat.*
