# TUNING -- [start power] HARD ORIGINS START RICHER THAN EASY ONES, SO HARD IS A RULE (10/10/26)
# Row: VAMILY TUNING [start power], MODE RESEARCH. Method: engine/bohemia_pricetable.js hireCostRange (the wiki's level cost 500 x (level-1)^1.5 plus the Game Guide's base hiring range), origins.json purse (crowns, medium) at 10 crowns to 1 battery. All in batteries.

## 1. THE NUMBER (derived, DRAFT: not a wiki figure)
start_power = purse in batteries + each starting man's hire price (low-high). Men whose level the wiki page does not state count as level 1 (the cheapest case). GEAR IS NOT COUNTED: the wiki prices gear by item and origins.json lists backgrounds, not kits. So this is a floor.
  raid     Medium men  4  purse 100  men worth 435-483  START POWER 535-583 (mid 559)
  pit      Hard   men  3  purse  70  men worth 432-468  START POWER 502-538 (mid 520)
  wolf     Hard   men  1  purse 100  men worth 262-274  START POWER 362-374 (mid 368)
  hunt     Hard   men  3  purse 150  men worth 159-195  START POWER 309-345 (mid 327)
  lab      Medium men  3  purse 270  men worth   9- 45  START POWER 279-315 (mid 297)
  faith    Medium men  4  purse 240  men worth  12- 60  START POWER 252-300 (mid 276)
  newcrew  Easy   men  3  purse 240  men worth   9- 45  START POWER 249-285 (mid 267)
  south    Easy   men  3  purse 240  men worth   9- 45  START POWER 249-285 (mid 267)
  promise  Medium men  2  purse 100  men worth 147-171  START POWER 247-271 (mid 259)
  debt     Hard   men  6  purse 200  men worth  18- 90  START POWER 218-290 (mid 254)
  rebuild  Easy   men  3  purse 200  men worth   9- 45  START POWER 209-245 (mid 227)
  scav     Medium men  3  purse 200  men worth   9- 45  START POWER 209-245 (mid 227)
  desert   Medium men  3  purse 100  men worth 109-145  START POWER 209-245 (mid 227)
  watch    Easy   men 12  purse 100  men worth  36-180  START POWER 136-280 (mid 208)
  truck    Easy   men  2  purse 140  men worth   6- 30  START POWER 146-170 (mid 158)

## 2. FINDINGS
A. The labels do not order by start power. Easy mids run 158-267. Medium 227-559. Hard 254-520. The ranges overlap, and the two richest per man-and-level, raid (Medium) and pit (Hard), are the ones that start with leveled veterans.
B. HARD ORIGINS ARE NOT POORER. Pit, wolf and hunt start with more worth than every Easy origin. They are Hard because of a RULE (pit: lose when all 3 gladiators die; wolf: one man, campaign ends if he falls; hunt and debt: penalties). A start-power slider cannot make them harder or easier.
C. THE DIAL THAT COULD SCALE A RULE ORIGIN: the existing death rule (struck-down chance, 20%/10% veteran) is the only felt number each rule origin leans on. Wolf and pit are "every death counts" origins, so their hardness is exactly the struck-down roll; a difficulty tier multiplies that, not the purse. Draft proposal: leave the labels as the wiki's, add start_power as a read-only display on the origin card, and let the tier dial scale the rule's trigger (pit: lose at all-3-dead, no number).
D. The rows with level null undercount: promise, desert, raid, pit, hunt, wolf already carry levels from the page; the rest sit at level 1 (hire 3-15 each).
E. Gear is the missing half. OPEN FOR NEXT ROW: [origin gear value].

## ROUTED
- PEOPLE [origins]: show start_power on the origin card (display only).
- TUNING table: origin.start_power as a derived row; no slider on rule origins.
- Test material: VOTE page is draft:true.
