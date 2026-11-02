# BOSSES 11/2/26: ACT ONE'S FIRST THREE BOSSES, END TO END (rule 302, ask line 287)

PAOLO 11/2: "Battle Brothers has unique locations and bosses with themes, I want that too... we talked about this a long time
ago: each time you kill a boss you get something that helps you interact with the city... with a Pocket City 2 design kind of
vibe, that's why we made the city how we made it, in grids."

Read in spirit (the reference law): Pocket City 2 is only the zoom and the drop-in, so 'its vibe' here means the verb lets him DO
something on the city's grid. Battle Brothers' legendary locations are the model for the place: a thing you see from the road,
one fight that teaches one lesson, and the map is different after.

## MEASURED FIRST (before this round, origin/main 30736411)

- THE LADDER: 53 bosses on paper (records/BOHEMIA_THE_BOSS_LADDER_v7_8_7_26.md). The V190 "mini bosses" patch that once put
  all 53 in a fight is NOT in the game: 0 mentions of it in the alpha, the demo, the map or the fight.
- ON THE MAP: WORLD TWO's his-map (slices/bohemia_his_map.js, records/target/bb/boss_map.json) holds act one's 19 in order: a sign
  near him (flyer, tag, radio), his place marked when the sign is read, a fight through the one door when he stands there, and
  his part of the city changed when he falls (13 rows open a place, 8 bring lights back, 2 change who holds, 2 bring a wall
  down, 1 reveals the towns).
- BUT HIS FIGHT WAS NOT HIM: the hand-over was a 3-skull band of plain humans (`{arch:'human'}` x count) with his name on the
  card. No boss man on the board, no crew of his own, no board of his own, no lesson.
- UNIQUE PLACES STANDING ON THE MAP: 0. His place was the same red skull glyph and a name plate on a street block for all 19.
- VERBS WIRED: 0 of 53. Beating him changed the map and handed you nothing to DO.

## WHAT SHIPPED (BUILD 11/2zzg)

New: slices/bohemia_bosses.js (the BOSSES lane's file), records/target/bb/boss_act_one.json (a modder's file: one row per boss,
matched to boss_map.json by name; every word draft:true, every number a shape TUNING owns), gates/bosses_act_one_gate.js.
Hooks, one line or one block each, all marked:
- slices/bohemia_his_map.js startFight: asks `BohemiaBosses.dress(msg, r)` before the one door (__THE_BOSSES__).
- slices/BOHEMIA_CITY_WORLD.html: `BohemiaBosses.draw(ox, oy)` before the his-map draw, and the script tag after his-map's.
- slices/BOHEMIA_ALPHA_0_9.html nfOpts: `o.boss = d.boss`, and his board kind wins (__THE_BOSSES__).
- slices/BOHEMIA_FIGHT.html: __THE_BOSS_IS_A_MAN__ right after the band becomes units.
- slices/bohemia_phone.js: __THE_BOSS_VERB_ON_THE_PHONE__, a button in the band under the two big buttons (where LEAVE shows in a
  town), lit on the map wherever a verb he holds works; his own place always works for his verb, right where he fell (WORLD TWO
  can stand him on a plain street when none of his kinds is in reach). Where two work (a main beside the water) the first in the
  file's order shows: OPEN, then PURIFY the main you opened. COOK used shows 'THE POT IS COOLING', greyed.
- gates/bohemia_gates.py: THE FIRST THREE BOSSES registered beside HIS MAP.

### THE THREE

| | THE POT | THE TAP | THE FILTER |
|---|---|---|---|
| ladder | #1, the first boss, played absolutely straight | #2 | #3 |
| his place | THE KITCHEN: a casino kitchen, a copper pot on the roof, a black smoke stack | THE PUMP HOUSE: a water tower on stilts, a red valve wheel, a red lamp blinking on the beat | THE SETTLING TANKS: two round tanks glowing sick green, a little stack |
| how you find him | his flyer (WORLD TWO's sign) and @tia_carmen's post on the feed | his tag on a pipe and @el_chino_702's post | the radio and @doc_reyes's post |
| the man | militia captain, 2.0x blood, Butcher's Cleaver, a Wooden Shield (the lid) | brigand leader, 1.4x blood, Warhammer (the valve wrench) | the mechanic (BB's necromancer), 2.0x blood, Butcher's Cleaver |
| his crew | 3 militia (the line cooks) | 2 lower marksmen (the pipe watchers), a raider, a thug | 3 plant robots + 1 armoured robot (the fight's machines: the ROBOT lane's crew) |
| his board | strip | landfill (the works) | shore |
| the lesson | his cooks hold while he holds: drop the man with the lid | his shooters hold the pipes: close the distance | kill the keeper and every machine drops (the fight's own rule) |
| the map after | the kitchen lit, white smoke; WORLD TWO's THE KITCHEN place and lights (its plate names it, ours steps aside) | the tower running, water on the beat; the main is yours | the tanks clean and pale; WORLD TWO's CLEAN WATER place |
| HIS VERB (the phone) | COOK HERE: anywhere off a town, once a day; the crew heals like a night's sleep (blood only, the clock does not move); your cookfire stays on that block | OPEN THE MAIN: a street block beside the water works; the main runs for good (drawn), the block pays 6 batteries; once THE TAP is down every shut main he has seen is drawn | PURIFY THE WATER: beside open water or on a main you opened; a clean-water block for good (drawn); every fresh wound in the crew closes 2 days sooner |

Every use posts on the phone's feed: the company's own line (what it did, with the number) and a valley voice in Spanglish
(the player never speaks it). Nothing pops up; the words are on the phone.

## DONE, ON THE REAL SURFACE

gates/bosses_act_one_gate.js on the demo at phone size (phone_portrait, the one driver, the stranger's game with the fog, real
taps on LEAVE, ENGAGE, AUTO and the phone's band): **19 passed, 0 failed** on the final code. Pictures (nine kept, half size: his place with the card, each
fight, each place after, the verb on the phone, the verb used): records/target/bosses_act_one/.

| | sign and rumour | his place | his fight (measured on the board) | won by | his verb, one real tap |
|---|---|---|---|---|---|
| THE POT | flyer, @tia_carmen | THE KITCHEN drawn 39x48 px on his block | THE POT 140 blood, Butcher's Cleaver, Wooden Shield; 3 militia; strip | AUTO | COOK HERE: blood lost 65 -> 21 (44 back across 2 men) |
| THE TAP | tag, @el_chino_702 | THE PUMP HOUSE 39x54 px | THE TAP 140 blood, Warhammer; 2 marksmen, a raider, a thug; landfill | the checker (AUTO lost) | OPEN THE MAIN: batteries 290 -> 296 |
| THE FILTER | radio, @doc_reyes | THE SETTLING TANKS 45x30 px | THE FILTER 100 blood, Butcher's Cleaver; 3 robots + 1 armoured; shore | the checker (AUTO lost) | OPEN first (his place is a main too), then PURIFY THE WATER: wound days 15.0 -> 11.0 (2 men) |

THE HONEST PART ABOUT WINNING: across three full runs AUTO beat THE POT 3 of 3, THE FILTER 2 of 3 and THE TAP 0 of 3 (once with
the crew at 1.6x and the harder marksmen, twice softened to 1.4x and the lower marksmen). The gate walks boss to boss with no rest
and no cooking between, so the crew meets THE TAP already hurt (65 to 168 blood lost); when AUTO loses, the checker ends the
fight (every one of theirs down, the his-map gate's own way) and the line says so. Whether a boss should be beaten by AUTO at all
is TUNING's question; the lesson (close the distance on the shooters) is one AUTO does not play.

Also run once: DEMO BUILD 25/0. HIS MAP (phone_portrait) 9 passed then CRASHED at P1, the pin box (a held finger), before its
boss steps: `held.menu` undefined at gates/his_map_gate.js:216. The pin box is not touched by this round (the hooks here are a
draw call before his-map's and the hand-over in startFight, after that step); not re-run on main to prove it was there before.
Its boss steps (B3, B4) are covered end to end by this round's gate, which goes further (the man, the crew, the verb).

## WHAT IS NOT DONE / NEXT

- ROBOT shipped DIRECTION's master-rig robot as THE MECHANIC's robot in the fight (cb67a80d) while this round ran; THE FILTER's
  crew is that fight's machines, so it should now wear it. NOT SEEN: this round's pictures were taken before it merged.

- The other 16 of act one have no place art, no man and no verb yet; the file takes a row each and the code is general (a new
  verb needs its rule in applies() and its effect in use()).
- The landmarks are drawn from pixel rows on the map's canvas (the his-map glyph way), not COOK's painted art; DIRECTION may
  want them redrawn. They are dark shapes through the static before he is known: that is on purpose (seen from the road).
- The boss man wears his kind's looks from the fight's pool; his own look (the chef's whites, the vest, the respirator) is
  written in the file for COOK 3 to paint.
- TUNING: hp_x, the band sizes, 6 batteries, 8 hours, 2 days, once a day are shapes, in the file.
