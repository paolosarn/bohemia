# TUNING ROUND 1 -- [bb numbers] HOW BATTLE BROTHERS MAKES FIVE POINTS FELT (9/28/26)
# Row: VAMILY TUNING [bb numbers], MODE SCHOOL. Law: laws/BOHEMIA_LAW_THE_FIGHT_GETS_DEEP_TUNING_AND_MODS_9_27_26.md s4.
# His words: "the smallest changes in numbers mean the biggest difference... a slightly better armour makes a huge difference."
# Sources: reference/library/battle_brothers/02,03,04,05 (recall-grade, marked so there) + the build itself,
# decoded from COMBAT_B64 in slices/BOHEMIA_ALPHA_0_9.html on 9/28 main (line numbers below are in that decoded page).

## 1. WHY A SLIGHTLY BETTER ARMOUR IS FELT IN BATTLE BROTHERS (the school)
Five mechanisms, and they stack. None of them is "bigger number = better"; each one turns a small number into
a THRESHOLD the player crosses or does not.

1. HITS-TO-KILL IS A SMALL WHOLE NUMBER. A man dies in about 2 to 5 hits. Any change that moves him from
   "dies in 3" to "dies in 4" is a 33% change in survival time from a few points. The player never reads the
   points; he reads "he survived one more swing". This is THE mechanism. The rest feed it.
2. ARMOUR IS A SECOND POOL, NOT A DISCOUNT (02). A hit splits: the ARMOUR PENETRATION share goes to hitpoints
   now, the rest is spent on the armour pool at the weapon's ARMOUR DAMAGE rate. So armour buys HITS, and
   armour 95 vs 105 is the difference between a mail shirt that breaks on the third axe or the fourth.
3. THE WEAPON IS THE KEY TO THE ARMOUR (03). Sword ~25% pen / 70% armour damage; axe ~30% / 115%; hammer
   20-30% / 150%; dagger PUNCTURE ignores all. The same armour is great against one enemy kind and bad
   against another, so KNOWING what you face is the skill he paid 450 hours for. The number is felt because
   it is RELATIVE.
4. FATIGUE IS THE PRICE TAG (02, 04). Every point of armour weight comes off max fatigue; 15 recovers a turn;
   at the cap he cannot act. Heavier armour = fewer swings. "Slightly better" always costs "slightly fewer
   actions", so a choice exists and a stat is never a pure upgrade.
5. HIT CHANCE IS SKILL MINUS DEFENCE, LINEAR, NEAR THE MIDDLE (02). 60% vs 55% is felt because the curve is
   linear and lives around 40-70%, where every 5 points is a visible share of swings, and SURROUNDED +5 per
   extra man (Backstabber +10) makes formation a number.
   Plus the tail: head hits 25% base at 150% damage, injuries past an HP threshold, permanent marks. The
   rare big outcome is what makes the ordinary numbers matter.

WHAT MODS CHANGED AND KEPT (recall, library-grade; to verify online in round 2): Legends kept the two-pool
split and added MORE thresholds (armour layers, attachments, more injury kinds), never flatter curves. What
players kept is the same shape: a small number that flips a whole-number breakpoint. HOW THE STUDIO TESTED
FEEL (recall): Overhype's patch notes move numbers by 5-10% and describe it as "hits needed", not percent.

## 2. OUR FIGHT, MEASURED (the build, not the design docs)
- The player's armour is PLATE, 0 to 3 pips (PP_MAX=3, PLATE_START=1). ppAbsorb (decoded ~l.9500): ONE PLATE
  EATS ONE WHOLE HIT, HOWEVER BIG. Then the hit goes to HP (enemy dmg 14-26 a goon, 32-48 a sniper).
- Enemy armour is flat subtraction: applyDamage = hp -= max(0, raw - armor) (l.13486). Every archetype ships
  armor 0; only the boss has 9 (BOSS_ARMOR). The kill shot is KILL_DMG=100 (l.13706, "demo = always fatal").
- Enemy hit chance: distAccuracy = 0.97 - distance * 0.60 (l.6515), x0.6 if not firing, x0.8 if wounded,
  MOVING_MISS 0.35. Linear, like BB. Good.
- Stamina: STAM_MAX=3 pips; stairs and cover moves cost one. This is BB fatigue, already shrunk to fit the beat.

## 3. THE FINDING THAT PROVES US WRONG
*** WE HAVE NO "SLIGHTLY". *** Our armour is a count of whole hits (0, 1, 2, 3) and nothing in between. A
plate stops a 14 and a 48 the same. There is no number to be "slightly better", so the thing he asked for
(a slightly better armour makes a huge difference) is IMPOSSIBLE in the current build, not just untuned.
And on the enemy side the one smooth number (flat armour) is 0 on every enemy but one, against a kill shot
of 100 that makes it meaningless. His ask needs a SMALL number that FLIPS A WHOLE-NUMBER BREAKPOINT; we have
whole numbers with no small number feeding them.

THE CHEAPEST FIX THAT KEEPS "EVERYTHING COSTS ONE" (a proposal for [numbers table], not built this round;
TUNING does not edit system code): keep the plate pips (the whole-number layer he sees), and give each plate
a small HOLD value (e.g. a scrap plate holds hits up to 20, a road plate up to 30, a riot plate up to 45).
A hit under the hold is eaten; a hit over it cracks the plate AND spills the rest. Now "slightly better"
exists: a 30 plate against goons (14-26) never spills, against a sniper (32-48) always does. That is BB's
mechanism 3 (the weapon is the key) and mechanism 1 (hits-to-kill) in one number per plate, read in one
glance. The toy in VOTE shows it with the build's own enemy damage ranges.

## 4. OUR FELT NUMBERS (the list the [numbers table] starts from; all live in the decoded fight today)
DAMAGE: KILL_DMG 100; enemy dmg ranges goon 14-26, sec-bot 18-30, shiv 14-20, bat 26-38, spear 18-26,
  sniper 32-48, medic/breacher 14-26; vital shot 55% of max +0-9; BOSS_HP x2.2 cap 200.
HP: goon 60, bot 160, shiv 60, bat 85, spear 70, sniper 45; PATCH_HP 25.
ARMOUR: PP_MAX 3, PLATE_START 1, PLATE_CHANCE 0.22 (drop), BOSS_ARMOR 9, all others 0.
HIT CHANCE: distAccuracy 0.97 - 0.60 x dist; not-firing x0.6; wounded x0.8; MOVING_MISS 0.35; enemy acc
  goon 0.55, bot 0.62, sniper 0.72; COVER_BITE 1; high ground NEAR_HG 5 / FAR_HG 12 tiles (to re-derive in cells).
FATIGUE: STAM_MAX 3; RUN_COVER_COST 2.
THE DIAL AND THE BEAT: PERFECT_MS 55, GOOD_MS 110, BEAT_GRACE 0.24, groove tiers 0/2/5/9 (+10% window a tier),
  HOLD-STEADY +5% a wait cap 15%, CHAIN_RAMP 3/+1, POWER_STEP 0.08.
MORALE: NERVE_AT 0.5 base 0.10 step 0.05; known 0.34/0.16/0.07.
ECONOMY IN THE FIGHT: LOOT_CHANCE 0.55, KILL_XP_PCT 0.25, XP_PER_LEVEL 120, BOSS_CHANCE 0.14.
NOT YET IN THE BUILD (rows exist): the death rule (20%/10% veteran, 30-40 days), difficulty sliders,
  origins' difficulty, battery prices per place, lifespans.

## ROUTED
- TUNING [numbers table]: section 4 is the first fill list; section 3's plate HOLD is its first proposed row.
- COMBAT: section 3 is a finding against the fight's armour, named not fixed; a hold value per plate is a
  number TUNING will own, the spill rule is COMBAT's code.
- MODS [data line]: every name in section 4 is a constant inside a base64 blob; none is in a data file yet.
- Test material: the toy page is draft:true, a bank of example plates, never in the game.

## STALE FOR THE DEMO 10/10: the fight numbers on this page were measured on the old fight tab (COMBAT_B64). The demo fights in BOHEMIA_FIGHT.html on the wiki rows. See section 3 of records/BOHEMIA_TUNING_THE_FELT_NUMBERS_TABLE_IS_REAL_AND_MY_FIGHT_FINDINGS_ARE_STALE_10_10_26.md.
