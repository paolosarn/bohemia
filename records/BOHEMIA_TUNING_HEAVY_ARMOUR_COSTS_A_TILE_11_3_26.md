# TUNING 2: HEAVY ARMOUR COSTS A TILE OF WALKING, NEVER A SWING (11/3/26; VAMILY rule 377, ask line 406; TUNING's half)

HIS WORDS (records/BOHEMIA_PAOLO_TAP_A_QUEST_TO_GO_THE_KILL_CAMS_AND_HEAVY_ARMOUR_11_3_26.md): "if you're wearing the heaviest [armour]...
maybe it's gonna be like -2 [AP]... you can only walk one time less please check the code... please make sure that this does not make it
impossible to do any sort of attack or abilities. If you didn't move that turn... you get one less tile... there's weights... categories
and genres of armor... maybe like an endgame light armor is better than most of the heavy armor"

COMBAT 7 built the fight's half first (a19b52b30, 12:19: wornWeight, weightClass, walkCap, walkLeft in slices/BOHEMIA_FIGHT.html; the shop
and the crew card in engine/bohemia_roster.js; gates/heavy_armour_costs_a_tile_gate.js) on a default in TUNING's table
(ours.armour_weight, tuned:false). This round puts TUNING's numbers there, sourced, and gates them.

## 0. THE ANSWER IN PLAIN WORDS
1. FOUR CLASSES, FROM BATTLE BROTHERS' OWN LABELS. A man's class is his body piece and his helmet added (their Battle Brothers weight):
   LIGHT under 15, MEDIUM under 30, HEAVY under 45, HEAVIEST 45 and up. 15 is Battle Brothers' own line for light armour (Nimble works
   in full under it). Battle Brothers labels its named armour Light, Medium and Heavy; 27 of its 30 labelled pieces land exactly one step
   up in our four: its Light is our MEDIUM, its Medium our HEAVY, its Heavy our HEAVIEST, and our LIGHT is the cloth, leather and padding
   under anything it names. Every one of the 174 body and head rows has a class.
2. THE WALK: the heaviest walks one flat tile less (2 AP of the 9: three flat tiles, not four), heavy a little (1 AP: the same four flat
   tiles, one rough tile less), light and medium free. It never touches a swing: a man who has not moved has all 9 for anything he owns
   (COMBAT 7's gate, 4 of 4 on these numbers).
3. WEIGHT IS NOT QUALITY: four ENDGAME LIGHT pieces, a champion's drop, never on the shelf: Battle Brothers' named MEDIUM protection at the
   weight of its lightest named piece. The best body piece (the Ceramic Plate Carrier: holds 231, weighs 8) beats 13 of the 15 heavy body
   pieces; the best helmet (the Visored Ballistic Helmet: 231, weighs 4) beats all 13 heavy helmets; the two together weigh 12, a LIGHT
   man who walks free. Battle Brothers' own named light pieces do not do it; the future does (realism, s4).
4. THE FIGHT STAYS CLOSE (s6): on today's fight with and without the cost, 15 of 54 measured cells move at all and no job's win moves more
   than 5 in 100; whole companies forced into the heaviest kit: s6b.
5. FOUND, NOT THIS RULE'S CODE: Battle Brothers' older cost of armour (its weight off a man's breath) can still make a swing impossible in
   the heaviest (a sellsword with a two-handed hammer: 13 breath for a 15-breath strike). TUNING's number for it is in the table
   (breath_floor: his breath always holds his dearest strike or ability once); the fight reading it is COMBAT 7's (s5).

## 1. THE MAN'S CLASS (ours.armour_weight.value.classes; the keys COMBAT 7 already reads, unchanged)
| class | his weight (body + helmet) | walk_ap | what it means on a 9 AP turn |
|---|---|---|---|
| LIGHT | under 15 | 0 | 9 to walk: four flat tiles (2 each), three rough (3 each) |
| MEDIUM | 15 to 29 | 0 | the same |
| HEAVY | 30 to 44 | 1 | 8 to walk: still four flat tiles, two rough not three ('a little under a tile', his 'a little') |
| HEAVIEST | 45 and up | 2 | 7 to walk: three flat tiles, not four (his number) |
WHY THESE LINES: 15 is Battle Brothers' own line for light armour: Nimble 'lowered exponentially by the total penalty to Maximum Fatigue
from body and head armor above 15' (bb_all/1424_Nimble.txt; perks.json nimble.numbers.fatigue_penalty_free_threshold, read by the tool,
not typed). 30 and 45 are its double and triple; the check below is what keeps them, not taste.
WHY HEAVY IS 1: a flat tile costs 2, so 1 is 'a little under a tile': on open ground a heavy man walks as far as a light one, on rough
ground and climbing he loses a tile. A step that costs Battle Brothers' medium armour something without costing it a tile on open ground.

## 2. ONE PIECE'S CLASS (ours.armour_weight.value.row_below; for the shop's card on a single piece)
The man's line cut by the slot's share: the body two thirds, the helmet one third (Battle Brothers' heaviest body weighs 42, its heaviest
helmet 23, about two to one). BODY: light under 10, medium under 20, heavy under 30, heaviest 30 and up. HELMET: light under 5, medium under
10, heavy under 15, heaviest 15 and up. Two pieces of one class always make a man of that class (10 + 5 = 15, 20 + 10 = 30, 30 + 15 = 45).
Computed from the table, never stored on the row: a modder who changes a weight changes its class. The wiki's blank weight on cloth reads
0, light.
COUNTS: body light 39, medium 18, heavy 15, heaviest 11; helmets light 34, medium 23, heavy 13, heaviest 21 (174 rows, every one).

THE CHECK FROM BATTLE BROTHERS (ours.armour_weight.value.bb_named, parsed from the library by the tool: the wiki's Named Armors and Named
Helmets tables, bb_all/1337 and 1359, every row's own Light/Medium/Heavy label; weight = its base Max. Fatigue, the heaviest roll plus the
least a named roll takes off, 3 on the body and 1 on the helmet):
| Battle Brothers' label | body pieces (base weight) | in ours | helmets (base weight) | in ours |
|---|---|---|---|---|
| Light | Hardened Leather 12, Plated Fur 14, Named Noble Mail 15, Studded Mail 16 | MEDIUM, all 4 | Norse 6, Wolf 8 | MEDIUM, both |
| Medium | Skull and Chain 24, Black and Gold 25, Heraldic Mail Hauberk 26, Lindwurm 26, Golden Scale 28; Named Sellsword's 32 | HEAVY 5, HEAVIEST 1 | Named Steppe 12, Skull 13; Golden Feathered 16, Red and Gold Band 17 | HEAVY 2, HEAVIEST 2 |
| Heavy | Alloy Plate 35, Leopard 35, Plated Mail Hauberk 36, Golden Lamellar 40, Enhanced Coat of Plates 42 | HEAVIEST, all 5 | Nose Horned 15 to Bull 22 (9 helmets) | HEAVIEST, all 9 |
27 of 30 one step up; the three that are not are Battle Brothers 'Medium' pieces on the heavy edge of its own medium (32, 16, 17).
So THE WALK IS FREE THROUGH BATTLE BROTHERS' LIGHT ARMOUR, a little slower in its medium and a flat tile slower in its heavy.

EVERY ROW BY CLASS (weight/durability; armor.json as it stands at this commit):
- BODY LIGHT (39 rows, weight 0 to 9): tattered_sackcloth 0/5, sackcloth 0/10, linen_tunic 0/20, cloth_sash 0/20, leather_wraps 0/20, monk_s_robe 0/20, noble_tunic 0/20, wizard_s_robe 0/20, apron 0/25, butcher_s_apron 0/25, undertaker_s_apron 0/30, leather_tunic 0/30, thick_furs 1/30, nomad_robe 2/30, dark_thick_tunic 2/35, thick_tunic 3/35, animal_hide_armor 3/45, gladiator_harness 4/40, padded_surcoat 4/50, dark_rugged_surcoat 4/60, thick_nomad_robe 5/50, football_pads 5/55, padded_vest 5/60, wanderer_s_coat 5/65, rugged_surcoat 6/55, gambeson 6/65, leather_nomad_robe 7/65, reinforced_animal_hide_armor 7/65, carpet_coat 7/70, linothorax 7/75, blotched_gambeson 8/70, scrap_metal_armor 8/75, padded_leather 8/80, stitched_nomad_armor 8/80, licence_plate_vest 9/85, cultist_leather_robe 9/88, reinforced_leather_armor 9/100, direwolf_hide_armor 9/100, assassin_s_robe 9/120
- BODY MEDIUM (18 rows, weight 10 to 18): patched_mail_shirt 10/90, leather_lamellar_armor 10/95, hide_and_bone_armor 10/95, plated_nomad_mail 11/105, southern_mail_shirt 11/110, worn_mail_shirt 12/110, basic_mail_shirt 12/115, direwolf_mail_armor 13/140, ancient_mail 14/100, mail_shirt 14/130, mail_with_lamellar_plating 15/135, noble_mail 15/160, ancient_double_layer_mail 16/120, leather_scale_armor 16/140, adorned_mail_shirt 16/150, rugged_scale_armor 18/140, mail_hauberk 18/150, riot_gear_jacket 18/150
- BODY HEAVY (15 rows, weight 20 to 28): ancient_scale_harness 20/125, light_scale_armor 21/170, ancient_breastplate 22/135, ancient_plated_mail_hauberk 22/180, adorned_warrior_s_armor 22/200, heavy_iron_armor 24/170, road_sign_cuirass 24/180, footman_s_armor 24/190, ancient_scale_coat 25/190, southern_long_mail_shirt_with_padding 25/200, decayed_reinforced_mail_hauberk 26/170, reinforced_mail_hauberk 26/210, heraldic_hauberk 26/250, ancient_plate_harness 28/200, scale_armor 28/240
- BODY HEAVIEST (11 rows, weight 30 to 42): ancient_plated_scale_hauberk 30/210, lamellar_harness 30/230, sellsword_s_armor 32/260, adorned_heavy_mail_hauberk 34/300, thick_plated_barbarian_armor 35/230, decayed_coat_of_scales 36/240, padded_mail_and_lamellar_hauberk 36/290, coat_of_scales 38/300, heavy_lamellar_armor 40/285, decayed_coat_of_plates 42/260, coat_of_plates 42/320
- HEAD LIGHT (34 rows, weight 0 to 4): mouthpiece 0/10, headscarf 0/20, hood 0/30, straw_hat 0/30, nomad_head_wrap 0/30, southern_head_wrap 0/30, hunter_s_hat 0/30, feathered_hat 0/30, leather_headband 0/30, engineer_s_hat 0/30, gunner_s_hat 0/30, jester_s_hat 0/30, cultist_hood 0/30, undertaker_s_hat 0/40, witchhunter_s_hat 0/40, dark_cowl 0/40, assassin_s_head_wrap 0/40, desert_stalker_s_head_wrap 0/45, aketon_cap 1/40, blade_dancer_s_head_wrap 1/60, open_leather_cap 2/40, leather_head_wrap 2/40, full_aketon_cap 2/50, nomad_leather_cap 2/50, full_leather_cap 3/45, bear_headpiece 3/50, cultist_leather_hood 3/60, goalie_mask 3/60, nomad_light_helmet 3/70, physician_s_mask 3/70, duelist_s_hat 3/70, rusty_mail_coif 4/70, mail_coif 4/80, closed_mail_coif 4/90
- HEAD MEDIUM (23 rows, weight 5 to 9): reinforced_mail_coif 5/100, nasal_helmet 5/105, wrapped_southern_helmet 5/105, heavy_mail_coif 5/110, sallet_helmet 5/120, leather_helmet 6/105, football_helmet 6/110, kettle_hat 6/115, masked_kettle_helmet 6/120, assassin_s_face_mask 6/140, padded_dented_nasal_helmet 7/110, flat_top_helmet 7/125, nordic_helmet 7/125, spiked_skull_cap_with_mail 7/125, padded_nasal_helmet 7/130, zweihander_s_helmet 7/160, ancient_household_helmet 8/95, nomad_reinforced_helmet 8/125, beastmaster_s_headpiece 8/130, padded_kettle_hat 8/140, nasal_helmet_with_rusty_mail 9/140, padded_flat_top_helmet 9/150, barbute_helmet 9/190
- HEAD HEAVY (13 rows, weight 10 to 14): ancient_legionary_helmet 10/130, closed_flat_top_helmet 10/170, welding_mask 11/140, crude_metal_helmet 11/145, closed_and_padded_flat_top 11/180, riot_gas_helmet 12/195, nasal_helmet_with_mail 12/200, steppe_helmet_with_mail 12/200, southern_helmet_with_coif 12/200, ancient_honor_guard_helmet 13/180, bascinet_with_mail 13/210, gladiator_helmet 13/225, kettle_hat_with_mail 14/215
- HEAD HEAVIEST (21 rows, weight 15 to 23): crude_faceguard_helmet 15/160, flat_top_with_mail 15/230, adorned_closed_flat_top 15/250, nasal_helmet_with_closed_mail 16/240, kettle_hat_with_closed_mail 17/250, heavy_lamellar_helmet 17/255, closed_scrap_metal_helmet 18/190, nordic_helmet_with_closed_mail 18/265, conic_helmet_with_closed_mail 18/265, flat_top_with_closed_mail 18/265, adorned_full_helm 18/300, decayed_closed_flat_top_with_mail 19/230, covered_decayed_closed_flat_top_with_mail 19/230, conic_helmet_with_faceguard 19/280, closed_flat_top_with_mail 19/280, decayed_full_helm 20/240, turban_helmet 20/290, full_helm 20/300, decorated_full_helm 21/320, decayed_great_helm 22/255, heavy_horned_plate_helmet 23/250

## 3. THE KITS HE MEETS (the whole grid's stages, tools/bohemia_tuning_the_whole_grid.js GEAR)
- The cheapest kit (370's 'gear for 21': padded surcoat 4 + aketon cap 1 = 5): LIGHT.
- The middle stage (mail hauberk 18 + padded flat top 9 = 27): MEDIUM, walks free.
- The late stage (reinforced mail hauberk 26 + bascinet with mail 13 = 39): HEAVY, 1 AP.
- The endgame stage (coat of scales 38 + full helm 20 = 58): HEAVIEST, 2 AP.
- COMBAT 7's gate kits: padded vest + leather headband LIGHT; reinforced mail hauberk + nasal helmet (31) HEAVY; coat of plates + full
  helm (62) HEAVIEST.

## 4. WEIGHT IS NOT QUALITY: THE ENDGAME LIGHT PIECES (ours.armour_weight.value.endgame_light)
THE RULE: Battle Brothers' named MEDIUM protection (its lowest roll) at the lightest a named piece of the slot rolls (8 on the body, 4 on
the helmet: the named roll's own floor, 'up to a maximum of -8 total Fatigue', '-4'). Names are attempts (draft:true; WORDS may rename).
| piece | slot | holds | weighs | class | protection from | value | beats heavy rows of its slot | beats heavy and heaviest |
|---|---|---|---|---|---|---|---|---|
| Aramid Vest | body | 209 | 8 | LIGHT | Skull and Chain Armor (209 to 237) | 5,500 | 12 of 15 | 12 of 26 |
| Ceramic Plate Carrier | body | 231 | 8 | LIGHT | Black and Gold Armor (231 to 262) | 9,000 | 13 of 15 | 16 of 26 |
| Ballistic Helmet | head | 220 | 4 | LIGHT | Named Steppe Helmet (220 to 250) | 5,000 | 12 of 13 | 14 of 34 |
| Visored Ballistic Helmet | head | 231 | 4 | LIGHT | Skull Helmet (231 to 262) | 5,000 | 13 of 13 | 18 of 34 |
A body and a helmet of them weigh 12: a LIGHT man who walks free and holds 429 to 462 (a HEAVY man in the late stage holds 420 at 39).
WHY NOT BATTLE BROTHERS' OWN LIGHT PIECES: its best named light body (Named Noble Mail) holds 176 to 200 at 8 to 12 and its best named light
helmet (Wolf Helmet) 154 to 175 at 4 to 7: they beat some common heavy pieces, not most (the heavy body median holds 190, the heavy helmet
median 195). His 'better than most of the heavy armor' needs more than Battle Brothers gives light armour.
WHY IT IS REAL (realism first): the future gets better (rule 32: the game starts in the ruin and gets reclaimed, techy, modern), and modern
armour beats steel by weight: an ultra-high-molecular-weight polyethylene rifle plate weighs about a third of a steel plate that stops the
same round (about 1.3 kg against 3.8 kg for a 10 by 12 inch plate); a modern helmet about 1.4 kg against 2 to 4 kg of a steel great helm.
WHERE THEY COME FROM: a champion's drop (Battle Brothers' champions 'always have a named item', bb_all/0363), costly (its named medium's
price), never on the shelf (shelf false, not in armor.json, so the shop's price-is-power and icon gates are untouched).
NOT IN THE FIGHT YET: no champion drops a named item in our code. The rows are shaped like armor.json rows (id, name, durability, fatigue,
vision, value, source) so the drop can hand one straight to bodyRow and headRow. ROUTED to COMBAT 7.

## 5. FOUND: THE BREATH CAN STILL STOP A SWING (ours.armour_weight.value.breath_floor; not read by the fight yet)
Battle Brothers takes armour weight off a man's breath too (its Max. Fatigue; the fight's gearFat), and that cost stays. MEASURED (the fight
headless, tools/bohemia_fight_headless.js, the same kits as COMBAT 7's gate; breath left / the strike's cost):
| man (breath) | light kit | heavy kit (31) | heaviest kit (62) |
|---|---|---|---|
| sellsword (93), two-handed hammer | 70 / 15 | 44 / 15 | 13 / 15: NEVER SWINGS |
| sellsword (93), the other two-handers (spiked mace, woodcutter's axe, wooden flail, mallet, pitchfork) | 74 / 15 | 48 / 15 | 17 / 15: one swing a turn |
| hedge knight (105), two-handed hammer | 82 / 11 | 56 / 11 | 25 / 11 |
| militia (102), two-handed hammer | 79 / 15 | 53 / 15 | 22 / 15 |
COMBAT 7's gate says the same (A2's note: on a sellsword's own breath 5 of 23 kinds of weapon swing in light and not in the heaviest) and
names it TUNING's. Rally and Indomitable cost 25 each (bb_all/1633, 1076): at 13 to 17 breath, never. His words were 'please make sure
this does not make it impossible to do any sort of attack or abilities'.
THE NUMBER: breath_floor.strikes = 1: whatever he wears, his breath pool holds his dearest strike or active ability at least once from
fresh. The heaviest still tires him fast (Battle Brothers' cost, kept); it never makes a swing impossible. FOR COMBAT 7: fatMax(u) takes
as its floor ours.armour_weight.breath_floor.strikes x the dearest skillFat among his weapon's skills and his active perks.

## 6. THE CLOSENESS SIM (rule 377(d); tools/bohemia_difficulty_the_curve.js --close, new flags --walk-free and --kit)
Today's fight (main 315764049 with this round's table), the three companies, days 10, 20 and 40, every level, both jobs, 20 fights a cell,
the same seeds, once with the walking cost (the cap) and once with every class's walk_ap at 0 in memory (--walk-free: the fight before
COMBAT 7's a19b52b30). Banks: banks/BOHEMIA_TUNING_HEAVY_ARMOUR_CAP_11_3_26.json and _WALK_FREE_11_3_26.json.
DAYS 10 and 20 (won / struck a fight / nobody under half in 100 / health left / rounds), WALK FREE -> CAP
| level | routine, walk free | routine, the cap | tough, walk free | tough, the cap |
|---|---|---|---|---|
| NEW HERE | 98 / 0.54 / 64 / 88% / 6.4r | **98 / 0.54 / 64 / 88% / 6.3r** | 91 / 1.27 / 47 / 74% / 8.9r | **91 / 1.22 / 48 / 75% / 8.8r** |
| SEEN IT | 99 / 0.63 / 65 / 88% / 6.7r | **99 / 0.63 / 64 / 88% / 6.7r** | 97 / 0.92 / 53 / 80% / 7.8r | **97 / 0.92 / 53 / 80% / 7.8r** |
| OUTLIVED IT | 89 / 1.65 / 45 / 72% / 8.5r | **89 / 1.68 / 45 / 72% / 8.5r** | 63 / 3.1 / 29 / 50% / 10.7r | **62 / 3.16 / 30 / 50% / 10.8r** |

DAYS 40 (won / struck a fight / nobody under half in 100 / health left / rounds), WALK FREE -> CAP
| level | routine, walk free | routine, the cap | tough, walk free | tough, the cap |
|---|---|---|---|---|
| NEW HERE | 97 / 1.3 / 57 / 85% / 8.6r | **97 / 1.3 / 57 / 85% / 8.6r** | 98 / 1.05 / 50 / 87% / 8r | **98 / 1.05 / 48 / 86% / 8r** |
| SEEN IT | 95 / 1.67 / 50 / 81% / 9.5r | **95 / 1.65 / 50 / 81% / 9.5r** | 97 / 1.17 / 55 / 86% / 8.2r | **97 / 1.18 / 55 / 86% / 8.2r** |
| OUTLIVED IT | 92 / 1.78 / 52 / 80% / 8.7r | **92 / 1.83 / 52 / 80% / 8.9r** | 92 / 1.92 / 53 / 79% / 9.3r | **90 / 2.05 / 52 / 78% / 9.6r** |

PER COMPANY, all levels, both jobs, by day (won / struck), walk free -> cap
wolf: d10 100/0->100/0 95/0.3->95/0.3 | 100/0->100/0 100/0.15->100/0.15 | 100/0.05->100/0.05 80/0.8->80/0.8  ||  d20 100/0.1->100/0.1 100/0.3->100/0.1 | 100/0.05->100/0.1 100/0.05->100/0.05 | 100/1.55->100/1.7 75/3->70/3.35  ||  d40 100/0.45->100/0.45 100/0.4->100/0.35 | 100/0.2->100/0.2 100/0.3->100/0.25 | 95/0.85->95/0.85 95/0.6->90/1.2
fresh: d10 100/0.3->100/0.3 95/0.95->95/0.95 | 100/0.3->100/0.3 100/0.65->100/0.65 | 95/1.15->95/1.15 55/3.5->55/3.5  ||  d20 100/0.45->100/0.45 95/1.2->95/1.2 | 95/0.9->95/0.9 90/1.45->90/1.45 | 90/1.35->90/1.35 65/3.6->65/3.6  ||  d40 100/0.3->100/0.3 100/0.35->100/0.4 | 95/1.1->95/1.05 100/0.55->100/0.65 | 95/0.95->95/1.05 100/0.9->100/0.7
mine: d10 95/0.45->95/0.45 80/1.45->80/1.45 | 100/0.25->100/0.25 95/0.85->95/0.85 | 90/0.9->90/0.9 55/1.65->55/1.65  ||  d20 95/1.95->95/1.95 80/3.4->80/3.3 | 100/2.25->100/2.25 95/2.35->95/2.35 | 60/4.9->60/4.95 45/6.05->45/6.05  ||  d40 90/3.15->90/3.15 95/2.4->95/2.4 | 90/3.7->90/3.7 90/2.65->90/2.65 | 85/3.55->85/3.6 80/4.25->80/4.25

cells that moved: 15 of 54; the biggest swing in won: 5 (wolf out d20 tough 75->70)
WHAT IT SAYS: the Lone Wolf's line wears MEDIUM at day 10 and HEAVY from day 20 (1 AP); A New Crew its door kit, then MEDIUM from day 20
and HEAVY at day 40; his way's rare men the cheapest kit, LIGHT. On 54 cells the cap moves 15 at all;
the biggest swing in a job's win is 5 in 100 (the Lone Wolf's line on OUTLIVED IT's hardest job at day 20, 75 to 70, 3.0 to 3.35 men down).
The gate's bands (party_math closeness_bands) hold with the cap. The enemy obeys the same cap (COMBAT 7's A4: theirs reach HEAVY and
HEAVIEST), so the cost cuts both ways.

## 6b. WHOLE COMPANIES IN THE HEAVIEST (--kit endgame: every man in a coat of scales and a full helm, 58)
The Lone Wolf's line and A New Crew, days 20 and 40, every level, both jobs, 20 fights a cell, cap against walk free. Banks:
banks/BOHEMIA_TUNING_HEAVY_ARMOUR_HEAVIEST_CAP_11_3_26.json and _HEAVIEST_WALK_FREE_11_3_26.json.
DAYS 20 (won / struck a fight / nobody under half in 100 / health left / rounds), WALK FREE -> CAP
| level | routine, walk free | routine, the cap | tough, walk free | tough, the cap |
|---|---|---|---|---|
| NEW HERE | 100 / 0.33 / 68 / 93% / 8.2r | **100 / 0.38 / 70 / 93% / 8.2r** | 98 / 0.8 / 70 / 87% / 11.5r | **98 / 0.72 / 73 / 88% / 11.4r** |
| SEEN IT | 98 / 0.33 / 83 / 94% / 9.3r | **98 / 0.38 / 80 / 93% / 9.5r** | 95 / 0.95 / 53 / 85% / 10.8r | **95 / 0.93 / 50 / 86% / 10.8r** |
| OUTLIVED IT | 85 / 2.1 / 53 / 75% / 14r | **85 / 1.9 / 58 / 76% / 14.4r** | 83 / 2.73 / 33 / 66% / 15.7r | **83 / 2.65 / 33 / 66% / 15.6r** |

DAYS 40 (won / struck a fight / nobody under half in 100 / health left / rounds), WALK FREE -> CAP
| level | routine, walk free | routine, the cap | tough, walk free | tough, the cap |
|---|---|---|---|---|
| NEW HERE | 100 / 0.4 / 73 / 93% / 9.4r | **98 / 0.6 / 70 / 92% / 10.1r** | 100 / 0.6 / 55 / 91% / 10.4r | **100 / 0.55 / 53 / 91% / 10.2r** |
| SEEN IT | 100 / 0.35 / 50 / 91% / 11r | **100 / 0.35 / 50 / 91% / 11.2r** | 100 / 0.33 / 63 / 93% / 10.4r | **100 / 0.23 / 65 / 94% / 10.7r** |
| OUTLIVED IT | 100 / 0.33 / 65 / 92% / 10r | **100 / 0.33 / 65 / 93% / 10.2r** | 95 / 1.1 / 60 / 86% / 11r | **95 / 1.13 / 58 / 87% / 11.4r** |

PER COMPANY, all levels, both jobs, by day (won / struck), walk free -> cap
wolf: d20 100/0.1->100/0.15 100/0.1->100/0.1 | 100/0->100/0.05 100/0.45->100/0.3 | 85/2.35->85/2.2 80/3->80/3  ||  d40 100/0.25->100/0.3 100/0.4->100/0.3 | 100/0.2->100/0.25 100/0.3->100/0.2 | 100/0.3->100/0.4 95/0.9->95/1.05
fresh: d20 100/0.55->100/0.6 95/1.5->95/1.35 | 95/0.65->95/0.7 90/1.45->90/1.55 | 85/1.85->85/1.6 85/2.45->85/2.3  ||  d40 100/0.55->95/0.9 100/0.8->100/0.8 | 100/0.5->100/0.45 100/0.35->100/0.25 | 100/0.35->100/0.25 95/1.3->95/1.2

cells that moved: 21 of 24; the biggest swing in won: 5 (fresh new d40 routine 100->95)
WHAT IT SAYS: in the heaviest the cap moves nearly every cell (21 of 24) and every move is small: no job's win more than 5 in 100, men
down within 0.35 a fight either way, fights about 0.2 rounds longer. On AUTO the enemy walks to the line, so the fourth tile is rarely the
one that decides a fight; what the heaviest pays is on the board where he plays it by hand (the lit reach one tile shorter, COMBAT 7's A3
and A5). NOT FIXED, SAID: a whole company in the heaviest still walks NEW HERE and SEEN IT (98 to 100 in 100, a man down every third fight
or less): that is the armour, not the walk (the 370 record's s7: the enemy spreads its blows so no plate breaks; COMBAT 7's target choice).
The walk was never meant to be the cure.

## 7. THE GATE: THE FIGHT IS CLOSE, legs W1 and W2 (gates/the_fight_is_close_gate.js, data only, a second)
- W1 EVERY ARMOUR ROW HAS A CLASS: every body and head row resolves to light, medium, heavy or heaviest by row_below; two pieces of a class
  make a man of it; light and medium walk free, heavy costs more than 0 and less than a flat tile (rules.json ap.move_cost.flat), the
  heaviest one flat tile less of ap.per_turn; at least 4 in 5 of Battle Brothers' named labels land one step up (27 of 30); tuned, sourced.
- W2 WEIGHT IS NOT QUALITY: of each slot, a light endgame piece (a champion's drop, shelf false, no more protection than its named
  medium's lowest roll, not on the shelf) beats more than half of that slot's heavy rows as armor.json stands NOW (recounted every run, not
  read from the stored count); a body and a helmet of them make a light man.
- BITES (each planted in a copy of ours.json, the gate run on it): heavy walk_ap 2 -> W1 FAILS; the body's light line 14 -> W1 FAILS (10 +
  5 no longer makes 15); the body endgame pieces removed -> W2 FAILS; every endgame piece holding 400 -> W2 FAILS (more than its named
  medium). The real table: W1 and W2 ok.
- COMBAT 7's own gate on these numbers (gates/heavy_armour_costs_a_tile_gate.js --headless-only): 4 passed, 0 failed (A1 the rule is data,
  A2 standing still everything he owns, A3 one tile shorter, A4 AUTO and the enemy obey the cap).

## 8. FOR COMBAT 7 (session_01GKDyuuNDooEjTDprXTHNiT): THE KEY NAMES
- ours.armour_weight.value.classes[] {id, name, below, walk_ap}: UNCHANGED KEYS AND VALUES (light <15 0, medium <30 0, heavy <45 1,
  heaviest 2); now tuned:true and sourced. Nothing to change in the fight.
- ours.armour_weight.value.row_below.body[] / .head[] {id, below}: one piece's class for the shop's card on a single piece.
- ours.armour_weight.value.endgame_light.pieces[] {id, name, draft, slot, durability, fatigue, vision, value, class, drop:'champion',
  shelf:false, source}: the champion's named drop, armor.json-shaped.
- ours.armour_weight.value.breath_floor.strikes (1): the floor under fatMax, s5.
- ours.armour_weight.value.bb_named[]: Battle Brothers' named rows with their labels (research; W1 reads it).

## ROUTED
- COMBAT 7: (1) fatMax reads breath_floor (s5), so the heaviest never makes a swing or an ability impossible; (2) a champion drops a named
  item, and the endgame light pieces are the light ones (s4).
- WORDS: the four endgame names are attempts (draft:true).
- ECONOMY: the endgame pieces' prices are Battle Brothers' named medium prices (5,000 to 9,000 crowns), off the shelf; when a drop sells,
  the stall reads them.
[bb the weight: Battle Brothers labels its own named armour light, medium and heavy and makes heavy cost breath; ours keeps its weights and
its labels, one step up in four, and puts the clear cost on the walk]
[analog horror: the heaviest man on the board is the slowest thing in it, and the lightest one in the plate carrier was somebody's champion
an hour ago]
