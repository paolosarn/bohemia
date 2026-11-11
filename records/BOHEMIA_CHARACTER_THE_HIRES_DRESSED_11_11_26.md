# CHARACTER 11/11: THE HIRES DRESSED (rule 427(b)'s 'then the hires'; ask 238)

Paolo 11/7 ('More', rule 427(b)): 'the clothes look good: leather and layering, quality before count' (ask 238); the coordinator's
routine 11/11: 'ship the clothes: the company's eleven men's added layers ... then the hires; leather and layering, quality before
count'. The company shipped as BUILD 11/11i (records/BOHEMIA_CHARACTER_THE_COMPANY_DRESSED_11_10_26.md); this is the hires, the
first six. MADE FROM the nine enemies' recipe he passed (VOTE character-the-nine-enemies-their-own-clothes-11-7, YES 11/8).

## MEASURED FIRST
- THE POOL: the hall deals men with a fight sheet who are not in the company and not women (recruitLooks: the town's own men first,
  his company's left out, then every gang man in a seeded order per town and week): 40 gang men (the 14 rare men wear their own).
- LAYERS on the body (base, mid, outer and the kit's slots, off each man's build record): 6 wore 2 (anarchists_2, colorful_0,
  homeless_0, reds_0, reds_1, remnants_0), 12 wore 3, the rest 4 or more. These six first.
- BLUE (rule 159, measured on each man's four street stills: a pixel reads blue when its blue is 10 or more over its red and not
  under its green): reds_0 4.7 in 100 (his cutoff denim shorts), anarchists_2 0.2 (a storm grey tee and coal column pant-boots,
  the ramps that rendered navy on the company), the other four 0.
- WHERE A HIRE IS SEEN (measured on the phone, 11/11): the hall's card shows his FACE only (the card's whole-man figure,
  canvas.hfig, is drawn but hidden by UI 9's dense row, 11/7 rule 402: slices/bohemia_ui_no_scroll.js '#sheet.ns-d1 .hire
  canvas.hfig{display:none!important}', 'a held finger away', and the held finger opens his words, not his figure; the company's record
  said 'whole in the hall' and was wrong, corrected there in this ship; a NOTE to UI). Hired, he is on the crew screen (his body in the camp when picked) and in every fight, with the armour his
  trade brings drawn over his chest (engine/bohemia_wear.js, the company's rule). And all six already stand in the ROAD GANGS you
  fight (ours.json band: brigand_thug wears homeless_0, anarchists_2, reds_0 and reds_1; brigand_marksman colorful_0; the default
  band remnants_0; BESTIARY's roaming crews borrow them too), so the six read in fights before he ever hires one.

## WHAT CHANGED (the source: six entries in RUN TWO's roll, by text, nothing else in the file)
| man | before (his build record at 2658f42e0) | now (his build record: outside in) | layers |
|---|---|---|---|
| anarchists_2 | patina plaid flannel, storm grey tee, coal column | leather wrap coat, bone tank, hip sash, soot hand wraps, column pant-boot | 2 -> 4 |
| colorful_0 | patina plaid flannel, olive tank, grass drop trouser, olive boots | leather vest, bone tank, salvage satchel, oxblood bracers, grass drop trouser, olive boots | 2 -> 4 |
| homeless_0 | sage striped henley, shoulder mantle, dust brown trousers, bone stack boot | work jacket, bone henley, shoulder mantle, soot hand wraps, dust brown trousers, bone stack boot | 2 -> 4 |
| reds_0 | rust vest, moss green shirt, cutoff denim shorts, tall moto boots | bone vest, signal red shirt, leather gloves, shell bandolier, soot cargos, oxblood boots | 2 -> 4 |
| reds_1 | leather half apron, striped tee, brick crop trouser, leather stack boot | leather half apron, striped tee, leather gloves, oxblood bracers, brick crop trouser, leather stack boot | 2 -> 4 |
| remnants_0 | work coveralls, bone scarf, olive wide trouser, olive stack boot | quilted vest, work coveralls, bone scarf, scrap pauldron, olive wide trouser, olive stack boot | 2 -> 4 |

Every one now wears four layers on his body (all six wore two), leather on four (anarchists_2 a leather wrap coat; colorful_0 a
leather vest over oxblood bracers; reds_0 leather gloves and oxblood boots; reds_1 a leather half apron and leather gloves), the
other two a work jacket and a quilted vest under a scrap pauldron; 0 in 100 blue pixels on all six. His gang's colour kept (the
Reds' red shirt, the Colorful's grass trousers, the Remnants' olive). The same faces, haircuts, builds and heights (the roll's
face, hair and skin fields not touched; each build record's look, dials and height compared equal). No trench added. THE OUTFIT
made two swaps of its own (its contrast rule: a top that reads as one with the coat over it takes a lighter colour of the same cut):
anarchists_2's soot tank is a bone tank, reds_0's leather vest a bone vest; the table is what each man wears, not what was asked.
QUALITY BEFORE COUNT: colorful_0's first pass (a satchel and bracers over the flannel he already wore) changed too little to read on
the card; he was given a leather vest and made again (the vest took the flannel's place; he reads as a leather vest open over a
bone tank, the satchel strap across it). reds_1's change is small and honest: gloves and bracers on the leather apron he already wore.

## THE PIPE (each owner's own one-man command, unedited; the packers merge)
tools/bohemia_character_the_company_dressed_remake.sh per man, three at a time on this box's 4 cores (29 to 51 minutes a man):
RUN TWO make and fight-make, ANIMATION everybody_idles person_one, what_a_man_holds person_one, melee_in_hand person (only for a
man already in rig_melee: anarchists_2, homeless_0, reds_0, reds_1). None of the six is in rig_town or rig_march, so no town set and
no march (nobody is added anywhere). Then the packs on main's tip: RUN TWO fight-pack, walk-sheets, bake, index; everybody_idles
people_pack and work_sheets; what_a_man_holds pack; melee_in_hand pack; the fight's packed atlases. The melee pass also draws a
'b' sheet for anarchists_2, homeless_0 and reds_0 (the melee tool makes it today for any man it re-makes; reds_1 and the company
already had theirs). walk-sheets re-packs blues_4 off this box's cache: put back to main's bytes (he is not one of the six).
A THIRD TRAP (found by WHAT A MAN HOLDS P5, 'person_colorful_0 +60 colours'): the packs skip a man whose packed file is newer than his
renders (everybody_idles people_pack against his made.txt, with a map_cells.npz cache; what_a_man_holds pack against his newest
frame). The six were packed on the old base, then colorful_0 was made again, then every file was carried onto main's tip with git
checkout, which stamped the old packed files NOW: his idles, carry, work and held sheets stood in the flannel he no longer wears while
his fight sheet wore the vest. Fixed by touching his renders, dropping his map_cells.npz and packing again. Carrying packed files
between branches: touch the renders of any man made after the pack, or delete his packed files first.
AND A FOURTH, the same man: his second pass deleted made.txt, but his carry and work keep their own markers (carry.txt, work.txt in
idles/person_colorful_0_carry and _work), so they were not made again; packed, his walk sheet's hammer work did not match his new
still (everybody_idles work_sheets: NO MATCH, agreement 0.96) and fell out of it (main's sheet had it). Both folders deleted, his
carry and work made again in the vest, packed again: his hammer work is back. The remake script's header now names both traps.

## PROOF
- NOBODY DROPPED (every index a rolled man lives in, counted on main 578669a2a and on this tree after the last pack): the fight's looks by
  kind (crew 13, faction 13, tier 2, beast 22, person 69, enemy 47, robot 1, boss 9: the three bosses BOSSES added under this ship kept),
  its faces 154; the idles 256 (fight_person 54), the map's idle people 154; the town's activities 16 men; the held clips 100; the melee 62;
  the map's mix sheets 18 holding 156 men; the walk sheets 134; the fight's packed atlases 204. Identical.
- ONLY THE SIX MOVED (105 files under slices/ and engine/ against main): every one is one of the six's, the build stamp and the demo cut,
  or a shared file changed only in their entries: the fight's index (homeless_0's entry; the rest of the six keep theirs, their sheets
  re-drawn under the same names), its packed index (the six's six atlases), the people mix (six lines), the map's idle people (the six,
  and the Anarchists' sheet re-laid: anarchists_0's and anarchists_1's 80 cells each pixel-identical, moved on the sheet), the map's mix
  sheets of the five gangs the six walk in, the faces atlas. The holds, melee and idles indexes are main's to the byte. anarchists_2,
  homeless_0 and reds_0 gain the melee tool's 'b' sheet, as the company did. colorful_0's walk sheet keeps its hammer work (fourth trap).
- GATES on this tree: THE PACKERS MERGE 4/0, WHAT A MAN HOLDS 17/0 (P5 red once, colorful_0's stale held sheet: the third trap), THE
  THING IN HIS HAND 29/0, NO TWO PEOPLE ALIKE 23/0, THE SHEETS ARE PACKED 4/0, DEMO BUILD 25/0, TRENCHCOAT 12/0, THE HIRE SHOWS THE WHOLE
  MAN 10/0, THE TOWN'S ACTIVITIES 22/0. EVERYBODY IDLES --quick 35/3 (P1 enemies, bosses and beasts with no idles yet; C3 three beasts'
  colours; R5 anarchists_6, caravans_5 and caravans_6 a few pixels off their map stills) and THE FACE IS HIS OWN FACE 17/1 (person_trades_0
  at the Nellis board) are the reds clean main carries; none is one of the six. VOTE TAB 61/5 (the five reds clean main 578669a2a carries the same:
  other lanes' card whys and stage, the alpha's landing on VOTE, the gear's VOTE), HANDOFF 10/0, ATTEMPT 15/0, on the card's tree (BUILD 11/11y).
- ON HIS PHONE (tools/bohemia_character_the_hires_dressed_shots.js, THE BLOCK WATCH with the valley code HRS2DR so both runs start in the
  same town, upright 390 x 844 and on its side 844 x 390, before on main 578669a2a and after on this build): the start lands in Reds; its
  hall as he arrives (4 men, none of the six this week); the same hall in week 4 (1 of the six at the post: reds_0); reds_0 hired with the card's
  HIRE (the hire list reads him), on the crew screen picked (index 12: a red shirt, a shell bandolier and soot cargos where the green shirt and
  the denim shorts were, before and after side by side in CHARACTER_THE_HIRES_DRESSED_CREW.jpg), the map with the party, a road fight off the town with him on your side and the camera on
  him, the road gang across from him wearing homeless_0 (the brigands); 0 page errors, before and after, both ways (records/target/character/the_hires_dressed/
  before/ and after/, shots.json; the sheet CHARACTER_THE_HIRES_DRESSED_PHONE.jpg).

## NEXT
No man at the hall wears two layers now. Thirteen wear three (counted off every build record in the fight's person looks, the rare
men left out): anarchists_0, anarchists_1, blues_2, caravans_1, cartel_0, cartel_1, colorful_1, network_1, network_2, reds_2,
remnants_2, trades_1, volunteers_2. The same way, quality first. The NOTE to UI: the hall's whole-man figure is hidden by the
dense row (rule 402), so before he pays a man reads by his face; Battle Brothers shows the recruit whole. UI's call.
