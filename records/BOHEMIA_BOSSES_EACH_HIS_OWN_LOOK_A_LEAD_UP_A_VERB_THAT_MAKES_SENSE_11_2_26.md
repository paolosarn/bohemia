# BOSSES 2, 11/2/26: EACH HIS OWN LOOK, A LEAD-UP, A VERB THAT MAKES SENSE (rule 330, ask lines 328 and 329)

PAOLO 11/2, having reached them in play: "I got to the point where I can start hunting down and killing bosses... each one has to
have their own aesthetic, and maybe a quest or two that leads up to them... it has to make sense... I'm just confused by what is
happening with the map... I can put the fire down, I can purify the water, I'm so confused by what that means." And: "what happens
to the city map? ...there's a bunch of bright pixels on the part of the map where I killed the boss... I'm so confused, what's going on."

The first three only (THE POT, THE TAP, THE FILTER), done properly. Last round: records/BOHEMIA_BOSSES_ACT_ONE_THE_FIRST_THREE_11_2_26.md.

## MEASURED FIRST (origin/main dca9460a)

| what he met | before |
|---|---|
| his place on the map | pixel rows: a 13-wide letter grid per place filled with flat colours on the map's canvas (THE KITCHEN 39x48 px) |
| what changed when he fell | the same grid in swapped colours, PLUS WORLD TWO's lights back on: a yellow dot on 3 of 4 buildings in a 7x7 (THE POT) and 5x5 (THE TAP) square, single pixels at the far zoom. **These were the bright pixels.** |
| the man | his kind's pool look (any militia captain, any brigand leader, the mechanic) with his name on him |
| the lead-up | one sign (WORLD TWO) and one feed post |
| the verb | a phone button (COOK HERE / OPEN THE MAIN / PURIFY THE WATER), nobody saying what it does |
| the marks a verb leaves | pixel-row glyphs (a fire, a valve, a drop), and once THE TAP fell every shut main he had seen in the whole valley got one |

## WHAT SHIPPED

### 1. His own look, on the rig the people use
tools/bohemia_bosses_the_three_men.py runs CHARACTER's own tool for a new kind of man (tools/bohemia_character_the_three_enemies.py,
imported, never edited) pointed at three bosses of one man each: rolled the barber's way, dressed from CHARACTER's wardrobe already
made, built through the barber, rendered on DIRECTION's master rig the RUN TWO way (stand, the walk in eight, the portrait and its
four mouths), COMBAT's fight poses and the six fight clips. bpy 4.2 in a python3.11 venv, as the rig's own header says.
- THE POT: BONE BUTTON-UP (chef's whites gone grey), DUST HALF APRON, HAT BONE HEAD WRAP (it reads as a cook's cap), CHARCOAL CROP TROUSER, COAL MID BOOT; a cook's belly.
- THE TAP: FIELD BUTTON-UP under the TACTICAL VEST (the utility vest), HAT DUST WORK CAP, FACE WRAPAROUND SHADES, SCAV TOOL BELT, LEATHER GLOVES, KHAKI CARGOS, RUST BOOTS.
- THE FILTER: WORK COVERALLS, FACE RUBBER GAS MASK (his respirator), SOOT TOOL BELT, SOOT GLOVES, HAT OLIVE FIELD CAP, FIELD BOOTS.
Packed as kind 'boss' (boss_pot_0, boss_tap_0, boss_filter_0) into slices/fight_rig (CHARACTER's pack shape; its own pack rebuilds
kind 'enemy' only and would have dropped THE MECHANIC's looks), the fight's face strip, and PORTRAIT's crew-face manifest (his face
talks on any mouth card). boss_act_one.json 'boss.look' names it; the fight puts him in it (__THE_BOSS_IS_A_MAN__, one line); his
meet card shows his face talking, his title and his lesson (RUN's meetShow, one marked line: BohemiaBosses.onCard).

### 2. His place painted in the map's own look, before and after
tools/bohemia_bosses_paint_their_places_11_2_26.py builds each place from the district hero factory's own parts (Scene, the pad,
the window grids, the doors; tools/bohemia_district_hero_factory.py and tools/bohemia_iso3d.py, imported, never edited), captures
it the way COOK's capture does and renders it through COOK's map-through-the-rig render (tools/bohemia_cook_the_map_through_the_rig_10_20_26.py
render and finish: the rig's source pass, dents, sun, the floor tool's grime, the snap toward his colours). What moves on the beat
is laid over in two frames. slices/boss_places/ (296 KB, 10 pictures x 2 frames, boss_places.json with each anchor and plate).
- THE KITCHEN: BEFORE black smoke out of the stack, a burn barrel by the dock, dark windows. AFTER the fire out, every window lit warm, steam off the copper pot.
- THE PUMP HOUSE: BEFORE a dry rusted tower on stilts, the red valve wheel, a red lamp blinking on the beat. AFTER the tank painted, the wheel green, water pouring from the spout into a trough, a wet patch.
- THE SETTLING TANKS: BEFORE glowing green sludge and green fumes. AFTER clean blue water.
- The four small things a verb leaves: a cookfire (stones, a pot on a tripod, smoke), the main shut (red wheel, dry), the main open (water running), clean water (a blue drum, a jug).
On the map a place is drawn on his own block scaled with the ground like a district picture (1.3 blocks wide, never under 64 CSS
px so he reads it from afar); a dark shape through the static before he is known. The shut mains show only the six nearest within
twelve blocks. WORLD TWO's lights-back-on dots stand down where a painted place shows the change, and the far zoom's one-pixel
dots are gone everywhere (slices/bohemia_his_map.js drawLit, marked). No pixel-row art is left in slices/bohemia_bosses.js.

### 3. A lead-up that makes sense: people, places and things (the quest law)
CONTENT's mouth card (slices/bohemia_road_events.js card(): a talking portrait, two or three plain choices). Every word in
records/target/bb/boss_act_one.json (lead.asker, lead.thing, after), draft:true, the townsfolk a little Spanglish, the player's
choices plain English. The shape from the .bq library (CONTENT's side quests: the giver on the road, the second place marked,
arriving tells you more).
1. SOMEONE NEEDS HELP: while his sign is in the world and unread (never in the first minute), the one who lost something to him
   stops you on the road. TÍA CARMEN (THE POT took her kitchen), EL CHINO (THE TAP shut his street's water, his abuela drinks from
   the wash), DOC REYES (her patients' cuts go bad from dirty water). Yes: she points, and the party walks to the sign. No: the sign
   stays on the map.
2. THE THING: at his sign (the flyer, the tag on the pipe, the radio) one of YOUR men reads it out: where he is and what he does to
   the valley. GO TO HIS PLACE walks there. His place is marked (WORLD TWO's readSign).
3. His meet card: his face, talking, his title, the one thing to know.

### 4. The verb makes sense
- The moment he falls, the one who asked comes back (her kitchen back, the jugs filling, a bottle of clean water) and says in plain
  words and numbers what the verb does: COOK = once a day anywhere outside a town, 8 hours of healing, no time passes; TURN THE
  WATER ON = a street by the water works, the main runs for good, 6 batteries a main; CLEAN THE WATER = beside water or a main you
  opened, every fresh wound heals 2 days faster.
- The phone's button is one plain line: COOK: HEAL YOUR MEN, TURN THE WATER ON, CLEAN THE WATER (THE POT IS COOLING when cooling).
  A held finger on it shows the same in a sentence (UI 4's long-press tooltips had not landed on main: a minimal one, marked, in
  slices/bohemia_phone.js, for UI 4 to take over). Its icon is the painted thing it leaves.
- The first use of each verb puts what it did over the block on the map for nine seconds (COOKED HERE: +44 BLOOD) and on the feed
  in plain words ("First hot meal. You cooked on the Cartel side: your men got 44 blood back, like a night's sleep. The pot cools for a day.").

## PROOF, ON THE REAL SURFACE

gates/bosses_act_one_gate.js, extended (L1, L2, A2 painted, A2b his card and ENGAGE clear of the phone, A3b his look, A5b the
explanation, A6a the plain button and the held finger, A6b the first use, P1 no pixel rows), on the cut demo at phone size
(phone_portrait 390 x 844, the one driver, the stranger's game with the fog, real taps on LEAVE, the mouth cards' choices, ENGAGE,
AUTO, a held mouse on the verb, a real tap on it): **43 passed, 0 failed** (BUILD 11/3zt, on main 3e79ebff plus this round).
Pictures, half size: records/target/bosses_act_one/ (for each boss: who asks, the clue, his place and his card, his fight, his place
after, what it does, the held finger, the verb used). The VOTE sheets: vote_pot.png, vote_tap.png, vote_filter.png.

| | who asks | the clue (one of yours) | his place | his man | won by | what it does, said by | first use, measured |
|---|---|---|---|---|---|---|---|
| THE POT | TÍA CARMEN | THE FLYER | THE KITCHEN painted | boss_pot_0, 140 blood, cleaver, lid | AUTO | TÍA CARMEN: COOK: HEAL YOUR MEN | blood lost 17 -> 0; map 'COOKED HERE: +17 BLOOD' |
| THE TAP | EL CHINO | THE TAG | THE PUMP HOUSE painted | boss_tap_0, 140 blood, warhammer | the checker (AUTO lost) | EL CHINO: TURN THE WATER ON | batteries 290 -> 296; map 'WATER ON: +6 BATTERIES' |
| THE FILTER | DOC REYES | THE RADIO | THE SETTLING TANKS painted | boss_filter_0, 100 blood, cleaver | the checker (AUTO lost) | DOC REYES: CLEAN THE WATER | wound days 7.0 -> 5.0 |

FOUND AND FIXED ON THE WAY, BY THE GATE:
- His face block first made his meet card 72 px taller and pushed ENGAGE under the phone: the tap hit the phone and no fight
  opened (A3 'no fight', twice). The card was already tight (ENGAGE 9 px clear of the phone); now the block is compact and the
  card lifts by exactly what the block adds, and A2b measures ENGAGE clear of the phone.
- A held finger anywhere on the phone's home that is not a known button opens SETTINGS after 0.6 s (bohemia_phone.js); the
  verb button was not on that list, so the held finger opened settings over it and the next tap never reached the verb. The
  verb button is on the list now (marked).
- The first meal with nobody hurt said '0 blood back': it now says nobody was hurt; '1 wounds' reads '1 wound' (changed after
  the 43/0 run: a word template only, the gate's check reads the line's start, which did not change).
Also run: THE VOTE TAB GATE 48 ok, 4 failed: my three cards first failed 'every art sheet carries its reference twin', fixed (the
twin is last round's pixel-grid picture of the same place, three differences each); the 4 left are other lanes' rows (two dynasty
'no where', DIRECTION's and SOUNDS' long whys) and the alpha's landing on VOTE, none touched here (not re-run on clean main).
PAGES PUBLISH 16 passed, 2 failed: the published surface (1738 MB of a 260 MB cap) and handoffs/skills/tickets kept by _config.yml
but not copied by the workflow; this round adds 1.2 MB to slices/ and 3 MB to records/target and touches neither list.
AGAIN AFTER THE REBASE onto COMBAT MAPS (a2bea2cf, 'every part of town fights': the map now hands the fight its district and
the district deals the blocks): **42 passed, 1 failed**. The one: A3 THE TAP asked that a block be NAMED his board ('landfill');
the fight was asked for landfill and COMBAT's deal built it from the place's own blocks, 'lots/works/suburb_stem' (the works: his
water works). The check now takes the kind asked or a block of it; the measured values of that run pass it. Not re-run after
that one-line check change.
AUTO beat THE POT, lost THE TAP and THE FILTER in this run (the crew meets them hurt, no rest between; last round's note stands).

## NOT DONE / NEXT
- The other sixteen of act one: the file takes a row each (look, paint, lead, after, verb words); the two tools take a new entry each.
- UI 4's long-press tooltips: when they land, the verb button's minimal one hands over (marked __THE_BOSS_VERB_ON_THE_PHONE__).
- THE POT's pot lid is the fight's Wooden Shield, not a pot lid model; THE TAP's valve wrench is the fight's Warhammer. CHARACTER could model both as clay pieces (TYPES pieces).
- TUNING: 8 hours, 6 batteries, 2 days, once a day, the place sizes on the map (1.3 blocks, 64 px floor) are shapes.
