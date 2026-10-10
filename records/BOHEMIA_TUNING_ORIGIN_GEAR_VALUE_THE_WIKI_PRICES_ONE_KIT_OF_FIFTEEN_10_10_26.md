# TUNING -- [origin gear value] THE WIKI PRICES ONE KIT OUT OF FIFTEEN, AND IT MAKES THE DESERTERS THE RICHEST START (10/10/26)
# Row: VAMILY TUNING [origin gear value], MODE RESEARCH. Sources: the fifteen origin pages (bb_all/, Category:Origins), weapons.json and armor.json value fields (crowns), 10 crowns to 1 battery.

## 1. WHAT THE WIKI ACTUALLY LISTS
- ONLY ONE ORIGIN NAMES A KIT. Deserters (0571_Deserters, line 56): "You can start with pretty decent equipment (For example, three Mail Hauberks, two Heater Shields, Aketon Caps, one Light Crossbow, one Shortsword and one Hatchet)". The word is "for example", so it is a ceiling, not a rule.
- The Lone Wolf page says "great equipment" (hedge knight, level 4) and lists no items. Promise names two items (Young Anselm's Skull, a Battle Standard) with no value. The other twelve pages list NO weapons or armour. Every page's Resources table lists only crowns, renown, relations and a few provisions.
- So "price each origin's starting kit" has nothing to price for 13 of 15. That is the wiki, not a gap in our data.

## 2. THE ONE KIT THAT CAN BE PRICED (value fields, crowns)
3 Mail Hauberk 3 x 1000 = 3000; 2 Heater Shield 2 x 250 = 500; Aketon Caps (count not stated, 3 assumed, DRAFT) 3 x 70 = 210; Light Crossbow 300; Shortsword 350; Hatchet 210. Total 4570 crowns = 457 batteries.
Start power for the Deserters becomes purse 100 + men 109-145 + kit 457 = 666 to 702 batteries, against 227 before. It jumps from the middle of the table to the TOP: the richest start of all fifteen, and it is a Medium. The previous finding (hard origins start richer than easy) still holds, but gear shows the label is even looser.

## 3. FINDINGS
A. A start-power number cannot be whole from the wiki. Only one origin states a kit; the rest would need our own ruling. That is a creative/numbers fork, not a research gap: PEOPLE decides each origin's kit, TUNING prices it.
B. The Deserters' kit is "first to act" plus injuries on every man ("each brother is heavily or lightly injured, damaged equipment", page line 58), which is a cost that offsets the money. Not priced (the wiki gives no number).
C. Draft proposal: if the kit is ruled for the other origins, price it with the same table (value x 1.25 per the price table's equipment multiplier for a hire price, plain value for start power).
D. Already checked and correct in origins.json: roster 25 and field 16 for the Peasant Militia and Manhunters, 12 roster for Gladiators and Lone Wolf, 18 for the Oathtakers (origins.json promise = 18, matches page line 60).

## ROUTED
- PEOPLE [origins]: rule each origin's starting kit if wanted; the wiki gives only the Deserters'.
- TUNING table: origin.start_power gets a gear term, Deserters only, draft.
- Next row added: [origin renown and relations] (the Resources tables carry renown and relations numbers).
