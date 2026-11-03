# FACTIONS: FIVE MORE BEASTS (11/3/26, ask line 343; rule 302's 'more content'; Paolo: 'keep building content please, all angles, every angle possible, let's be efficient with our tokens')

His 9/30 votes on the beasts (records/target/BOHEMIA_VOTE_REGISTRY.json): YES to the seventeen with "it has to be realistic: if they
could not survive in an economic apocalypse in the desert Mojave of Las Vegas, then they can't be around"; NO to beasts as bosses
("one shot and it's dead"); and the question whether a mammoth could survive the Mojave at all. The law under it:
laws/BOHEMIA_LAW_THE_BEASTS_ARE_LAB_MADE_AND_THE_BESTIARY_FLOOR_9_29_26.md (s2 the science limit: a living relative of the right size
must carry it; s3 the valley's own dead and Vegas's escapees, feral dogs and cattle, on the same roads; s6 mechanic first, skin second).

## 1. WHAT WAS IN THE GAME BEFORE THIS ROUND (measured)
- In the fight on the rig (slices/fight_rig/fight_rig.json, ours.beast_rig_looks): THREE beasts. The dire wolf (worn by direwolf,
  frenzied_direwolf, wolf, goblin_wolf), the cave hyena (hyena, frenzied_hyena), the feral shepherd (wardog, armored_wardog, warhound).
- On the map: the road's 'beasts' party (ours.enemy_tiers.mix.beasts): dire wolves and hyenas in every phase, and late a frenzied
  wolf and a schrat (the schrat has no beast model: a stand-in man). No beast had a district of its own.
- Only the dire wolf had a brain of its own (ai.json kinds: direwolf 'rusher'); the hyena fought as a plain line man.

## 2. THE MOJAVE TEST (what can live here now, and what cannot)
The valley today: about 10 cm (4 inches) of rain a year, summers past 45 C, freezing winter nights. After the crash: no irrigation,
so the lawns and golf courses die inside one summer; the water left is the Las Vegas Wash, the wetlands park, Lake Mead's shore,
the dam and a few springs. An animal passes if it can find water and food here with nobody feeding it, and if real DNA allows it.

PASS (built this round):
1. COYOTE (Canis latrans). Already lives in every part of the valley. Eats anything, drinks little, breeds fast. The realest beast
   in the game. Not lab-made: it rides the law's 'already here' line like the seventeen's feral horses and dogs.
2. MOUNTAIN LION (Puma concolor). Already lives in the Spring Mountains (Mount Charleston, Red Rock). Needs deer, bighorn, or the
   lab's loose horses and camels; it comes down to the city's edge at night. Native, not lab-made.
3. FERAL HOG (Sus scrofa). Passes ONLY at water. A pig cannot sweat; in the open desert in July it dies without a wallow. So it lives
   at the Wash, the wetlands, the lake shore and the dam, nowhere else. Origin: the real North Las Vegas pig farm (RC Farms, the
   Combs family) fed its pigs the Strip's buffet scraps for decades (3,500 pigs on 22 casinos' leftovers in 2006); farm pigs go
   wild in two generations.
4. CAMELOPS (Camelops hesternus). The valley's own Ice Age camel (Tule Springs bone). Its DNA was read in 2015 (Heintzman et al.,
   Yukon fossils): a sister of the living camels, so a dromedary carries it. Camels were built for this: the US Army's camels went
   feral in Arizona and Nevada after 1860, and Australia has about a million feral dromedaries today. The best desert animal on
   the list.
5. FERAL BULL (Bos taurus). Range cattle have run loose on Gold Butte (Clark County) without an owner for decades; the BLM's 2014
   roundup of the Bundy cattle failed and in 2024 they still roamed, many unbranded. They live at the springs. The seventeen's
   'feral cattle'; the law's s3 names cattle.

FAIL (skipped, and why):
- SHASTA GROUND SLOTH: the desert would feed it (its dung in Gypsum Cave and Rampart Cave is this desert's own plants: globemallow,
  Mormon tea), but nothing alive can carry its baby. Its nearest living cousins are tree sloths of 4 to 8 kg; it weighed 250 kg or
  more. Law s2 says no. Not before act three's machines, if ever.
- GOLDEN EAGLE: lives here, but a 4 to 6 kg bird takes a rabbit or a lamb, never a man in a crew. Not a fight.
- GILA MONSTER: lives here (southern Nevada is its northern edge, a protected animal), but it is slow, shy, underground most of the
  year and its bite almost never matters to an armed man. Not a fight. It is worth something alive: its spit gave medicine the first
  GLP-1 drug (exenatide). A trade good for ECONOMY, not a beast.
- (also checked) JAVELINA: its range stops south of here; the cold winters hold it in the Sonoran desert. BLACK BEAR: no resident
  bears in the Spring Mountains. SHORT-FACED BEAR: a 700 to 900 kg meat-eater; the desert cannot feed it.

THE MAMMOTH, PLAINLY: No, not in the open valley now. The Columbian mammoths at Tule Springs lived in a different valley: about
12,000 to 100,000 years ago groundwater springs made marshes, pools, streams and wet meadows across the floor (the National Park
Service's Tule Springs pages); mammoth bone is 22% of the fossils found there. Its living cousin, the elephant, drinks about 150 to
200 litres and eats about 150 kg of plants a day. In today's valley that is only the shore of Lake Mead and the dam's tail water,
and only while the lake holds; the golf courses die without the pumps. So: one herd at the lake, a landmark, act three at the
earliest (the seventeen already says this), and never a roaming beast.

## 3. WHAT SHIPPED
Each beast is a whole thing: a model through the rig, a row of numbers from its Battle Brothers twin, one rule it teaches, where it
roams, a line for the feed.

| beast | look (the rig, 8 facings) | BB twin (numbers) | the lesson (its own rule) | roams (map ground) | climbs |
|---|---|---|---|---|---|
| COYOTE | the fox's cousin, grizzled grey-buff, 1.2 m | Wolf (hp 50, half the nerve) + plain Bite 15-35 | THE FEED (Nachzehrer's Gruesome Feast): a hurt coyote beside a body eats (25 hp a bite, 2 a body); runs under a third | suburb_block, golf_and_park, trailer_park; x2 at night | no |
| MOUNTAIN LION | tawny cat, short face, long tail, 2.1 m | Serpent (hp 110, armour 10) + Serpent Bite 50-70 | THE AMBUSH AND THE PIN (Serpent's grab): unseen until 2 tiles; lies still up to 2 turns waiting to spring, then stalks; the man it lands on is pinned (the net's roll) until he gets up or it dies | hills (the mountain); x3 at night | YES |
| FERAL HOG | near-black barrel, big shoulders, long snout, 1.55 m | Hyena (hp 100, body armour 40: the shoulder shield) + Hyena Bite 20-35 | THE GASH (Hyena Bite's page, now built): a tusk that takes 6+ hp bleeds 5 a turn for 2 turns | wash_and_shore only; x1.5 at night | no |
| CAMELOPS | long legs, long face, hump, 3.3 m, 2.3 m tall | Unhold (hp 320, no regeneration, resolve 40) + Sweep 40-80 | THE KICK (Unhold's Sweep): one blow hits EVERY man beside it, each knocked a tile back; runs under half | open_desert (desert, gypsum, springs: the lab site); x0.5 at night | no |
| FERAL BULL | red-brown, the Hereford white face, horns, 2.9 m | Unhold (hp 420, no regeneration, resolve 90) + Sweep 40-80 | THE CHARGE (Ijirok's Gore): a man 2 to 4 tiles off in a straight free line is run at, +10 to hit; landed, he goes a tile back and loses his next turn; it cannot turn | open_desert, golf_and_park | no |

THE PIPELINE (tools/bohemia_factions_five_more_beasts.py): the Khronos Fox reshaped with its bones by the hyena tool's reshape plus
three moves of ours (the camel's NECK and HUMP, the bull's HORNS joined into the mesh on the head bone), the coat painted from the 3D
shape (the wolf tool's trace), the poses tool's Hit and Fall, DIRECTION's master rig (still, Walk 6, Bite 6, Hit 2, Fall 3; three
keys a beat at 120 BPM), packed into slices/fight_rig/beast_<x>.webp and merged into fight_rig.json with every other look kept.
Three passes by eye (rule 97): pass 1 the bull's horns were bone-parented and came back a metre off the head (fixed: joined to the
mesh); pass 2 good for four; pass 3 the camel's neck read as a pale plank from behind on the board (shorter and thicker).

THE DATA (one file a modder edits, records/target/bb/bohemia_enemies.json): 5 factions (coyotes, lions, hogs, camels, bulls), 5 rows
(each its wiki twin in 'from', its own stats with a why, its 'beast' block: rig look, attack page, climbs), 5 brains (scavenger,
stalker, sounder, kicker, charger), 4 numbers (gash, kick, charge, feed; lurk gains wait_rounds), the mix, count_scale (a lion is
one, a bull one, a camel herd a few, a hog sounder 3 to 6, coyotes as many as the crew), and the road: by_act weights, the ground
each lives in (each row's habitat: a beast holds no ground, it lives somewhere; x4 there), and the night. The fight folds it in (ownEnemies) and builds the rules (BOHEMIA_FIGHT.html: beastLanded,
kickAll, charge, feed; the lion's wait in the brain's tile score; cannotClimb reads ours.climbers.climbs).

## 4. PROOF (his phone upright, 390 x 844; four of his men, act one)
tools/bohemia_factions_five_more_beasts_shots.js -> records/target/factions_five_beasts/ (deal and fight shot per beast, shots.json):
coyotes 6: feeds 2, fled 5, round 4 | lion 1: pinned 1, got up 1, round 4 | hogs 4: bleeding 1, fled 3, round 5 |
camels 3: kicks 3, fled 4, round 5 | bull 1: charge 1, round 2 | page errors 0 in all five.
Strips: records/target/factions_five_beasts/<beast>_strip.png (eight stills, then walk, bite, blow, fall facing SE, the 98 px man
marked) and all_five_beside_the_wolf.png. A MEASURED BUG FIXED ON THE WAY: the lion first waited forever for a crew that could not
see it (248 rounds); it now waits two of its turns, then stalks in.

THE VOTE TAB: five items, each plays its beast from the fight's sheet beside the dire wolf (slices/vote/FACTIONS_FIVE_MORE_BEASTS.html#<beast>).

## 5. WHAT IS LEFT (no Paolo needed)
- The map's own 'beasts' party (ours.enemy_tiers.mix.beasts, COMBAT's) could take the five by act; today they come on the road roll
  by the ground (a party handed as brigands becomes the faction that holds that ground).
- The bite clip stands in for the camel's kick and the bull's gore (the same lunge); a kick and a horn-hook clip each are ANIMATION's.
- ECONOMY: hide, meat, camel milk and burden, a live Gila monster; WORDS: every line here is draft:true.
- TUNING: every number above is tuned:false.

Sources: NPS Tule Springs (nps.gov/tusk, the Columbian mammoth page); USGS paleohydrology of Tule Springs Fossil Beds; Heintzman et al.
2015 (Camelops genome, Molecular Phylogenetics and Evolution); Seattle Times 2006 and the Review-Journal on RC Farms; E&E News 2024
('A decade after Bunkerville standoff, Bundy cattle roam free'); Nevada Department of Wildlife (mountain lions, coyotes, Gila monster);
records/BOHEMIA_THE_BEASTS_OF_BOHEMIA_DE_EXTINCTION_ROUND_ZERO_9_29_26.md and ROUND_THREE (the seventeen).
