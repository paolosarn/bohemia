# BESTIARY: THE FLOOR COUNTED, AND THE LAB SEVEN (five in the fight, two wait for room on the site) -- 11/9/26
# VAMILY rule 440(f), ask line 539 (PAOLO 11/9: 'More everything pls'). Rule 431(f): 'just another animal we can fight'.
# Law: laws/BOHEMIA_LAW_THE_BEASTS_ARE_LAB_MADE_AND_THE_BESTIARY_FLOOR_9_29_26.md (s1 lab-made, s2 the DNA limit, s3 the valley's
# own dead, s4 the floor and its OWED gate). BUILD 11/9k FIVE LAB BEASTS.

## 1. THE COUNT, MEASURED BEFORE (main 79516ffc)
- records/target/bb/roster.json said beasts: 17. It counted Battle Brothers' seventeen archetype NAMES (the Alp, the Hexe, the
  Kraken, the Ijirok...), 13 of them with no animal and nothing in the fight. Right number, wrong thing.
- The fight fielded 15 animals, each on its own sheet. 10 lab-made (dire wolf, cave hyena, short-faced bear, Shasta ground sloth,
  sabre-tooth, American lion, Camelops, ancient bison, Ice Age horse, teratorn); 5 living animals loose in the valley (coyote,
  mountain lion, feral hog, feral bull, feral dog), which law s3 lets walk the roads but s1 does not call lab-made.
- The other floor numbers: 12 factions in records/target/bb/factions.json (the fight fields a party for 8 of them); 152 enemy types
  in the roster, 42 the fight can field (UNDER his 75); 6 bosses staged (boss_act_one.json); 3 champion kinds dealt.

## 2. THE GATE THE LAW OWED: THE BESTIARY FLOOR (gates/the_bestiary_floor_gate.py, registered, 10/0)
F0 the floor is his; F1 factions; F2 types in the roster and the fight's own count (a ratchet, 47, never down); F3 the beasts: 17+
animals fielded (20 now) and the LAB-MADE count on a ratchet to 17 (15 now), every lab beast with its species, fossil (site, state,
paper), DNA read or readable, surrogate mother and Mojave reason, fielded on its own sheet and met (road, ground or giant), no beast of
unknown origin; F4 each BESTIARY beast reads as its animal (outline at least 0.20 from every other animal at the fight's size AND the
map's fifth; its lab plate in 4+ facings); F5 no special systems; F6 bosses; F7 champions; F8 the roster file fresh.
PLANTED, all caught: one beast removed (the llama's party gone: 14, under the ratchet), a beast of unknown origin, a beast with no
fossil, a new brain with a flies key, the stilt-legged horse drawn on the Ice Age horse's sheet.

## 3. THE SEVEN (records/target/bb/lab_beasts.json is the lab's book: every lab beast, its fossil, its DNA, its mother)
| beast | Nevada fossil | DNA | mother | fights like (brain, BB lesson) |
|---|---|---|---|---|
| American cheetah (Miracinonyx trumani) | Crypt Cave, Lake Winnemucca (Orr 1969, the type skull) | read (2005 mtDNA; 2026 nuclear genomes) | puma | pride: the Goblin Wolfrider's speed round the line |
| Harrington's goat (Oreamnos harringtoni) | Smith Creek Cave (Stock 1936, the type) | read (Campos et al. 2010) | mountain goat | charger + climbs: the Ijirok's gore off the roof |
| Stilt-legged horse (Haringtonhippus francisci) | Gypsum Cave (the most complete skull) | read from that skull (Heintzman et al. 2017) | burro | coward: the armed peasant who bolts past half |
| Ice Age jaguar (Panthera onca augusta) | Nevada's Ice Age record (Kurten 1973) | read (Ice Age jaguar mitogenomes) | jaguar | stalker + climbs: the Serpent's wait and grab, at the water |
| Large-headed llama (Hemiauchenia) | Tule Springs (the monument's forelimb bone) | readable (Ice Age; none published) | llama | kicker: the Unhold's Sweep |
| Shrub-ox (Euceratherium) WAITING | the Lake Winnemucca caves; a bovid its size at Tule Springs | readable (none published) | muskox | sounder: the Hyena's bleeding bite as the hook |
| Long-horned bison (Bison latifrons) WAITING | Tule Springs (cf.) | read (Froese et al. 2017) | plains bison | charger: the Ijirok's gore |
Giants (one animal, a rare hunt, never a pack; WORLD 9's rule): the cheetah and the jaguar. Herds on the grounds: goats (hills), stilt
horses (open desert, solar fields), llamas (open desert, golf, hills). Every one names its waters. The shrub-ox, when it lands: hills
and open desert, count_scale 0.35, road [0.1, 0.15, 0.2], 600 kg, brain sounder, attack size_1_headbutt_15 (its row is in this
round's first commit, b039de6f's tree).
Every number is a draft for TUNING (hitpoints scaled to the real animal against its kin's row).

## 4. THE ART (tools/bohemia_bestiary_the_lab_seven.py, reuse first)
The own-body tool's pipe (tools/bohemia_beasts_every_beast_its_own_body.py: a body grown in metres on the Khronos Fox's skeleton and
moves), seven animals added to its table, their coats painted the same way, the beard its one new part; the poses tool, DIRECTION's
master rig in 8 facings, the fight's sheet (18 columns, 64 colours, the lab plate's colour kept). Reference check, by eye on the
preview and by the gate: the goat first read as a sheep and the shrub-ox and the bison as blobs; horns, beard and humps were cut to the
real animals and re-rendered before the full render. Strips and the kin card: records/target/bestiary_lab_seven/.

## 5. WHY FIVE, NOT SEVEN: THE SITE IS AT ITS CAP
The published site (tools/bohemia_publish_list.js, gates/pages_publish_gate.js, cap 900 MB) was 895.4 MB on main 83dac485. Each
beast is published twice (its sheet and its packed atlas). The six cost 3.7 MB; the long-horned bison alone 2.1 MB (a 2.3 m animal
with 2 m of horns at the fight's pixels). All seven was 901.1 MB: red. Main then grew to 896.6 MB within the hour (other lanes' art),
and the six measured 900.3: red again. Forty colours instead of sixty-four would have left 0.03 MB (gone at the next push), so the
shrub-ox (1.1 MB, the one whose DNA nobody has read) is held too: five in, 899 MB, green. Both held animals are built and checked
(models committed, sheets one render away; lab_beasts.json 'waiting') and go in the moment there is room. ROUTED TO PLUMBER (the cap's owner),
with the room measured: records/target/COOK2_ONE_REAL_STREET.webp (7.6 MB) is published only because BOHEMIA_STYLE_GUIDE.json names it
as DIRECTION's reference twin ('twin_yes'), and the style guide is published only because every rig.json names it as provenance; no
page loads it. Old tab pages (BOHEMIA_TARGET_SCREEN_JUDGE_7_26_26.html 5 MB, the ART tab's TF-ART PNGs about 20 MB) are the gate's own
named remedy. Not this lane's files; nothing was deleted.

## 6. ROUTED
- PLUMBER: the room above (3.3 MB is enough for both); then BESTIARY lands the bison and the shrub-ox (lab-made 17; the ratchet to 17).
- TUNING: every new row's numbers are drafts (hp, initiative, the attack pages) beside their kin's.
- WORLD / WORLD 14: gates/the_teratorn_is_one_more_beast_gate.py T4 is red on main since 64380f14 (11/9c): slices/bohemia_place_visits.js's
  fallback regex names 'teratorns'; the file already reads the beast flag from bohemia_enemies.json, so the fallback can go or the gate
  can allow it. This round did not touch that file.
- COMBAT / FACTIONS: THE FIGHT FIELDS 47 enemy types against his 75 (the roster holds 157): the next gap of the floor.
- THE NEW ENEMIES gate is 8/4 on main and stays 8/4 (the same four reds, TUNING's handoff); every new party beats a crew of 3 and 6
  at 6 in 10 or better (the jaguar against 3: 6 in 10).
- DIRECTION: the five are a first cut; the golden check not run yet.
- WORDS: every name, lesson and feed line is a draft.
[bb bestiary] Battle Brothers counts 17 beasts including its variants and its non-animals (Alp, Hexe, Geist); ours counts animals, each
on its own sheet, and holds the lab-made ones to the law.
[analog horror] the lab's marks at the source: the hi-vis plate on the nape, the shaved and stitched sample patch, the numbered collar;
the feed lines are rumours, never a card.

## 7. PROOF
records/target/BESTIARY_FIVE_LAB_BEASTS.jpg (the VOTE card); records/target/bestiary_lab_seven/: each beast's strip (8 facings, then walk,
bite, blow, fall), the_lab_seven_beside_their_kin.png (each beside the roster animal it must not copy, at the fight's size and the map's
fifth), fight_<party>.jpg (the demo on a phone, the fight as it opens) and close_<party>.jpg (the same fight panned with a pointer drag and
zoomed with the fight's own wheel), shots.json (what each fight fielded, the sheet it drew, THEY_ARE's words, no page errors). The
stilt horses' close crop missed the band (three spread across the board); their fight fielded three on their own sheet.
