# THE FOUR PHONES: THE SAME PHONE, ACT BY ACT (DIRECTION 10/9/26, row [four phones])

From [flip look] (records/BOHEMIA_THE_FLIP_LOOK_CARD_10_9_26.md) and rule 37j (Paolo 9/27: the phone is cracked at the
start and gets "bougier and busier" with progress). The UI three-acts law (laws/BOHEMIA_LAW_THE_UI_HAS_THREE_ACTS_9_6_26.md:
act 1 salvage, "2050 rustic"; act 2 modern, working; act 3 futuristic, the shape open) and the skin architecture UI built
for exactly this (window.BOHEMIA_SKIN in slices/BOHEMIA_CITY_WORLD.html: "change these eight values and act two's phone
is a different object with the same words in it"; "ACT TWO and ACT THREE go here, as siblings").

## WHAT THIS ROUND MADE
The three sibling skins as REAL VALUES, in records/target/DIRECTION_FOUR_PHONES_SKINS.json, and the four phones
RENDERED LIVE: the game's own phone on the alpha's map reading the new values (tools/bohemia_direction_four_phones.js).
Nothing painted by hand. Picture in VOTE: slices/vote/DIRECTION_THE_FOUR_PHONES.png. UI pastes the three skins into
SKINS as siblings of 'salvage'; DYNASTY's act state calls wear(); the flip's beat 3 is when it switches.

## THE FOUR
1. **ACT 1, CRACKED (salvage, as shipped).** The worn two-tone rail, one hairline crack from the corner it landed on,
   the thumb smear, the chips. Unchanged.
2. **ACT 2, REPAIRED.** The same phone kept alive by its owner, the world working again: a matte black rubber BUMPER
   (bezel 5 px, rail #23211e..#4a463f), a screen protector over the old crack (crack alpha .30 -> .13), ONE STRIP OF
   CLEAR TAPE where the crack started (the one new element), the chips hidden under the bumper, a slightly newer panel
   (screen one step brighter).
3. **ACT 3 RICH, THE SLAB.** A new device: thin brushed light metal (bezel 2 px, rail #8a867f..#e2ded5, lit top .50),
   no crack, deep neutral black glass, 24 px corners. This is the AI-slop strand's pair 1 made an object: the machine's
   finish is smooth and too clean against the rough world around it.
4. **ACT 3 POOR, YELLOWED.** Act 1's phone forty years on: the rail yellowed and darker (#423c2e..#a89c74), the crack
   gone to the shattered second impact (the same fracture cloned, per the file's own rule), the screen gone yellow-green,
   the backlight dying (glow .09 -> .06, radius 9 -> 6).
Which act 3 he holds is the ledgers' call (the three eras card), never a menu.

## RULES THE FOUR KEEP
- The WORDS on the glass never change, only the object around them (the skin law).
- The glass shine is the only light on the object (R4); wear is authored per act, never a filter (R10).
- No glow rings, no pill chrome, no gradient chips added (AH-03 T2).
- FOUND WHILE SHOOTING: the phone sits in its gold 'ring' (the unread alarm) on the map the moment it opens, so the
  alarm reads as the phone's normal frame and hides the casing. An alarm that is always on is not an alarm; UI's call
  when it lights, flagged here.

```json
{"card":"FOUR_PHONES","date":"10/9/26","row":"[four phones]","skins_file":"records/target/DIRECTION_FOUR_PHONES_SKINS.json",
 "rendered":"live on the alpha's own phone (tools/bohemia_direction_four_phones.js)",
 "phones":{"act1":"salvage as shipped","act2":"repaired: black rubber bumper 5px, screen protector (crack .13), one clear tape strip, chips hidden","act3_rich":"the slab: thin light metal 2px, no crack, neutral black glass, 24px corners","act3_poor":"yellowed: yellowed rail, shattered (cloned) crack, yellow-green screen, dying glow"},
 "owners":{"UI":"paste the three skins as siblings in SKINS; the tape strip","DYNASTY":"call wear() with the act; the flip's beat 3 switches it"},
 "finding":"the phone's gold unread ring is on as the map opens, reading as its normal frame",
 "picture":"slices/vote/DIRECTION_THE_FOUR_PHONES.png"}
```
