#!/usr/bin/env python3
"""BOHEMIA -- ECONOMY TWO [the battery is real] (VAMILY rule 459, ask line 645; 11/18/26). THE TABLE'S OWN PAGE.

Writes the hand-written half of records/target/bb/battery_table.json: the unit, the ladder, the bands, the catalog rule,
the ratios, WHERE every number of batteries lives (data files), the typed COPIES in code, and the numbers inside sentences.
It never writes a price: the rows are read from the game by `node tools/bohemia_economy_two_the_battery_table.js seed`
and written back by `stamp`. Run this, then seed, whenever a place is added here.

    python3 tools/bohemia_economy_two_write_the_table.py && node tools/bohemia_economy_two_the_battery_table.js seed
"""
import json, os
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(R, 'records/target/bb/battery_table.json')
BB = 'records/target/bb/'
RT = 'records/target/'
old = json.load(open(OUT)) if os.path.exists(OUT) else {}

T = {}
T['_about'] = ("THE BATTERY IS REAL (ECONOMY TWO, 11/18/26; VAMILY rule 459, ask line 645). THE ONE TABLE for every number of "
    "batteries the game shows, pays or takes. Paolo 9/4: 'for one AA battery a bag of rice.' Paolo 11/17: 'some of the quests, "
    "it's like 3000 or like 1000 batteries to complete a quest and I'm like bro that's a lot... I want people to really feel "
    "like they can look at their battery right now and relate it from the game to real life.' THE AA IS THE UNIT. A sum is "
    "paid in the fewest kinds of battery, the biggest first: a car's battery, a tool pack, a phone's battery, AA's "
    "(the research, records/BOHEMIA_RESEARCH_HOW_MANY_BATTERIES_ARE_IN_THE_UNITED_STATES_11_17_26.md). HOW TO MOVE A PRICE: "
    "edit the number under 'rows', run `node tools/bohemia_economy_two_the_battery_table.js stamp`, then `check`. HOW TO ADD "
    "ONE: add its place to 'where' (a data file) or 'copies' (typed in code) in tools/bohemia_economy_two_write_the_table.py, "
    "run it, then `seed`. gates/the_battery_is_real_gate.js fails a number of batteries that is not here. MECHANISM-MINE / "
    "CONTENTS-PAOLO'S: every number carries where it came from; the words (the four names) are draft:true.")
T['draft'] = True
T['rule'] = 'VAMILY.md rule 459; laws/BOHEMIA_ADDENDUM_BATTERIES_ARE_THE_MONEY_AND_A_TILE_IS_A_HOUSE_9_4_26.md s1 and s4; laws/BOHEMIA_LAW_THE_FIGHT_GETS_DEEP_TUNING_AND_MODS_9_27_26.md s4'
T['unit'] = {
    'id': 'aa', 'worth': 1, 'buys': 'a bag of rice',
    'his_words': 'for one AA battery a bag of rice',
    'source': 'Paolo 9/4 (laws/BOHEMIA_ADDENDUM_BATTERIES_ARE_THE_MONEY_AND_A_TILE_IS_A_HOUSE_9_4_26.md); the research: a rechargeable AA holds about 2.4 Wh and weighs about 27 g',
    'in_the_old_numbers': 'one AA is ten crowns of the wiki\'s worth (his 10/1 ten to one, reference/library/grok/GROK_31_TEN_TO_ONE_2026_10_01.md), never under one (GROK_33)'
}
SRC = 'records/BOHEMIA_RESEARCH_HOW_MANY_BATTERIES_ARE_IN_THE_UNITED_STATES_11_17_26.md'
T['ladder'] = {
    'value': [
        {'id': 'aa', 'worth': 1, 'name': 'AA', 'many': 'AA', 'wh': 2.4, 'kg': 0.027, 'real': 'one rechargeable AA cell, 14.5 x 50.5 mm',
         'icon': 'battery_ladder/aa.png', 'small': 'battery_ladder/small/aa.png', 'buys': 'a bag of rice', 'draft': True},
        {'id': 'phone_battery', 'worth': 6, 'name': 'PHONE BATTERY', 'many': 'PHONE BATTERIES', 'wh': 15, 'kg': 0.045, 'only_whole': True,
         'real': 'the pack out of a phone: one full phone charge, about 15 Wh',
         'icon': 'battery_ladder/phone_battery.png', 'small': 'battery_ladder/small/phone_battery.png', 'buys': 'six bags of rice', 'draft': True},
        {'id': 'tool_pack', 'worth': 20, 'name': 'TOOL PACK', 'many': 'TOOL PACKS', 'wh': 50, 'kg': 0.6,
         'real': 'an 18 V cordless tool pack, about 50 Wh',
         'icon': 'battery_ladder/tool_pack.png', 'small': 'battery_ladder/small/tool_pack.png', 'buys': 'twenty bags of rice', 'draft': True},
        {'id': 'car_battery', 'worth': 250, 'name': 'CAR BATTERY', 'many': 'CAR BATTERIES', 'wh': 600, 'kg': 18,
         'real': 'a car\'s 12-volt starter battery, about 600 Wh',
         'icon': 'battery_ladder/car_battery.png', 'small': 'battery_ladder/small/car_battery.png', 'buys': 'two hundred and fifty bags of rice', 'draft': True},
    ],
    'source': SRC + ' ("IN AA\'S (2.4 Wh each): a phone charge is about 6; a tool pack (50 Wh) about 20; a car\'s starter battery (600 Wh) about 250"); the weights of the three big ones are general knowledge, not from the lookups',
    'paid': 'fewest kinds, biggest first: car batteries, then tool packs; what is left under a tool pack is phone batteries when they make it exactly (6, 12, 18), else AA\'s',
    'why_paid_so': 'every count on the glass is small (never more than 12 tool packs, 3 phone batteries, 19 AA\'s) and a sum is never more than three kinds; the prices were written in tens, and ten is ten AA\'s, not a phone battery and four',
    'most_kinds': 3,
    'never': 'an electric car\'s pack (about 31,000 AA\'s) is not a thing a crew carries: nothing is priced in it. Who holds the working solar is NOT DECIDED (rule 459(e)): nothing here is built on it.'
}
T['bands'] = {
    'everyday': {'min': 1, 'max': 10, 'say': 'everyday things cost 1 to 10', 'zero_ok': True},
    'a_mans_night': {'min': 1, 'max': 9, 'say': 'a man\'s day costs a few: fed for 2, paid 1 to 9 on top', 'zero_ok': True},
    'trade_good': {'min': 1, 'max': 99, 'say': 'a trade good is tens'},
    'the_road': {'min': 1, 'max': 60, 'say': 'what the road gives or takes at one stop is 1 to 60, three tool packs at the most', 'zero_ok': True},
    'job': {'min': 10, 'max': 300, 'say': 'a job on a board pays 10 to 300 before anybody knows your name: a car battery and change at the most'},
    'job_part': {'min': 1, 'max': 60, 'say': 'the parts a job\'s pay is built from'},
    'purse': {'min': 20, 'max': 400, 'say': 'what a crew starts with: tool packs to a car battery and change'},
    'big': {'min': 100, 'max': 500, 'say': 'the big standing buys (a man who joins the camp) are a car battery or two'},
    'prize': {'min': 5, 'max': 250, 'say': 'a purse in the pit is tool packs, never over a car battery'},
    'gear_piece': {'min': 1, 'max': 300, 'say': 'a made thing with its own price is tens to a few hundred'},
    'one_job': {'min': 1, 'max': 2500, 'say': 'the most one job ever pays is ten car batteries: a crew can carry it'},
}
T['catalogs'] = {
    '_about': 'the things with a worth in the wiki\'s crowns (every weapon, armour, helmet, shield, a man\'s daily wage, a rare man\'s base, a wound\'s treatment): one rule turns each into batteries, so nobody types 600 prices twice',
    'crowns_per_battery': 10, 'floor': 1, 'rounding': 'to the nearest, a half up',
    'source': 'reference/library/grok/GROK_31_TEN_TO_ONE_2026_10_01.md and GROK_33_PRICE_FLOOR_2026_10_01.md (his, 10/1); records/target/bb/price_table.json conversion',
    'band': {'min': 1, 'max': 1000, 'say': 'gear costs tens to a few hundred (the dearest piece in the game is three car batteries and change)'},
    'files': [
        {'file': BB + 'weapons.json', 'paths': ['rows[*].value'], 'what': 'a weapon\'s worth'},
        {'file': BB + 'armor.json', 'paths': ['body[*].value', 'head[*].value', 'shields[*].value', 'body[*].wiki_value', 'head[*].wiki_value'], 'what': 'a body armour\'s, a helmet\'s, a shield\'s worth'},
        {'file': BB + 'backgrounds.json', 'paths': ['rows[*].daily_wage', 'hiring_and_wage_rules.**'], 'what': 'a hired man\'s wage a day and the wiki\'s hiring rules'},
        {'file': BB + 'rare_recruits.json', 'paths': ['men[*].base_crowns', 'men[*].bb.base_wage'], 'what': 'a rare man\'s base hire price and wage'},
        {'file': BB + 'arena.json', 'paths': ['pit_gear.value.*.value'], 'what': 'the pit\'s two prizes'},
        {'file': BB + 'injuries.json', 'paths': ['rules.temporary_healing.**'], 'what': 'a wound\'s treatment (the clinic)'},
        {'file': BB + 'price_table.json', 'paths': ['wageAndHire.**'], 'what': 'the hall\'s base hire range and kit multiplier'},
        {'file': BB + 'ours.json', 'paths': ['armour_weight.**', 'cell_vest.**'], 'what': 'named armour rows carried for the fight (their worth is not a price on a shelf)'},
        {'file': BB + 'origins.json', 'paths': ['origins[*].crowns.*'], 'what': 'the wiki\'s own start purse, kept beside ours'},
        {'file': BB + 'contract_terms.json', 'paths': ['**'], 'what': 'the wiki\'s worked contract, in its crowns: read by no page'},
    ]
}
T['ratios'] = {
    '_about': 'what MULTIPLIES a number of batteries into the sum he sees. None of these is a price; each is why a price grows.',
    'shelves': {'full': 1.5, 'thin': 1, 'bare': 0.75, 'what': 'the start screen\'s pick: every job pays half again on FULL SHELVES (the pick the door opens on), as posted on THIN, a quarter less on BARE',
                'where': 'typed in the shell (slices/BOHEMIA_ALPHA_0_9.html ECON; the demo is cut from it): no data file holds it'},
    'kept': [
        'A JOB AGAINST A CREW\'S KEEP (records/target/bb/job_pay.json): an hour on a job pays double what twelve men burn in it, and a fight pays 26 a skull. KEPT.',
        'CLOUT (records/target/bb/renown.json pay_mult): x1 for a crew nobody knows to x4.5 at 4,000. KEPT: a man\'s wage grows x2.6 by level 11 and the crew grows from 3 to 12, so the keep grows about as fast as the pay; cut the one without the other and the late game cannot pay its men.',
        'TEN CROWNS TO ONE (catalogs): KEPT. It is what makes an everyday thing cost 1 to 10 and a gun cost tens.',
        'THE STALL PAYS HALF, A SHOP A SEVENTH (stall_prices.json sell_share; the settlement screen\'s SELL_CUT): KEPT.'
    ],
    'changed': [
        'THE SEVEN WHO JOIN THE CAMP AT 300 AND 400 (the blacksmith, the negotiator, the quartermaster, the recruiter, the scavenger; the agent, the bounty hunter) ARE 290 AND 390: a car battery and two tool packs, a car battery and seven. WHY: a standing price over a car battery is whole tool packs, so it is two kinds of battery on a small button, never three (300 was a car battery, two tool packs and ten AA\'s). Ten AA\'s cheaper, 3 in 100: nothing a crew\'s keep rests on (rule 117: start easier than Battle Brothers).',
        'THE DOOR\'S TYPED START PURSE (the shell\'s copy until origins.json lands) WAS 3 TO 7, a number from EVERYTHING COSTS ONE; it is each origin\'s THIN purse now (70 to 270), so a phone that never gets the file starts a real game. No ratio: origins.json is unchanged.'
    ]
}
T['live_data'] = [BB + f for f in ['nightly_bill.json', 'stall_prices.json', 'job_pay.json', 'job_into_place.json', 'origins.json', 'retinue.json', 'arena.json', 'home_base.json',
    'loot.json', 'boss_act_one.json', 'real_places.json', 'renown.json', 'relations.json', 'price_table.json', 'weapons.json', 'armor.json', 'backgrounds.json', 'rare_recruits.json',
    'injuries.json', 'ours.json', 'tape_income.json', 'carcass.json', 'arrival_traits.json', 'feed_kinds.json', 'feed_world.json', 'radio_lines.json', 'contract_terms.json',
    'party_math.json', 'condition.json']] + [RT + f for f in ['BOHEMIA_BOARD_SHELF.json', 'BOHEMIA_JOB_KINDS.json', 'BOHEMIA_ROAD_EVENTS.json', 'BOHEMIA_SIDE_QUESTS.json',
    'BOHEMIA_HALL_PRICE.json', 'settlement_traits.json']]
T['live_code'] = ['slices/' + f for f in ['BOHEMIA_CITY_WORLD.html', 'BOHEMIA_SETTLEMENT_SCREEN.html', 'BOHEMIA_ROSTER_SCREEN.html', 'BOHEMIA_FIGHT.html', 'BOHEMIA_ALPHA_0_9.html',
    'bohemia_job_kinds.js', 'bohemia_bosses.js', 'bohemia_road_events.js', 'bohemia_road_more.js', 'bohemia_place_visits.js', 'bohemia_phone_board.js', 'bohemia_carcass.js',
    'bohemia_his_map.js', 'bohemia_scavenge_game.js', 'bohemia_arena_town.js', 'bohemia_board_shelf.js', 'bohemia_bar_news.js', 'bohemia_busy_heard.js', 'bohemia_injury_card.js',
    'bohemia_ui_three_items.js', 'bohemia_ui_materials.js', 'bohemia_aftermath.js', 'bohemia_camp_map.js', 'bohemia_the_battery.js']] + ['engine/' + f for f in [
    'bohemia_stall_prices.js', 'bohemia_wages.js', 'bohemia_job_pay.js', 'bohemia_renown.js', 'bohemia_purse.js', 'bohemia_lotbuild.js', 'bohemia_powerbuild.js',
    'bohemia_scavenge.js', 'bohemia_followers.js', 'bohemia_goodbros.js', 'bohemia_camp.js', 'bohemia_home.js', 'bohemia_arena.js', 'bohemia_barber.js', 'bohemia_roster.js',
    'bohemia_origin_start.js', 'bohemia_origin_ways.js']]
# ECONOMY THREE 11/20 (rule 461): every <script src> these pages load is swept as live code too (the tool adds them on load, never
# baked), so a lane's new script is held the day a page loads it, the way every data file in records/target/bb already is
T['live_pages'] = ['slices/' + f for f in ['BOHEMIA_CITY_WORLD.html', 'BOHEMIA_SETTLEMENT_SCREEN.html', 'BOHEMIA_ROSTER_SCREEN.html', 'BOHEMIA_FIGHT.html', 'BOHEMIA_ALPHA_0_9.html']]
# a number in live code that reads like money and is not: file, find (a regular expression over the whole field), why
T['code_not_money'] = []

W = []
def where(file, paths, what, band=None, unit='aa', owner=None, note=None):
    d = {'file': file, 'paths': paths if isinstance(paths, list) else [paths], 'what': what}
    if band: d['band'] = band
    if unit != 'aa': d['unit'] = unit
    if owner: d['owner'] = owner
    if note: d['note'] = note
    W.append(d)
# ---- a man's day
where(BB + 'nightly_bill.json', 'per_man_per_night.value', 'food and water for one man for one night: the bill at nightfall (two bags of rice\'s worth: a can and a bottle)', 'a_mans_night')
where(BB + 'origins.json', ['origins[*].door.wage_per_man_per_night', 'origins[*].personal.rule.does.wage'], 'the fight pit\'s founding men are paid, each a night', 'a_mans_night')
# ---- everyday
where(BB + 'stall_prices.json', ['goods.*.buy.value'], 'the stall, one unit: a night of food and water, a dose of meds, six rounds, a roll of tape', 'everyday')
where(BB + 'stall_prices.json', ['buy_floor.value', 'trade.sold_floor.value'], 'nothing at a stall costs or pays under one AA', 'everyday')
where(BB + 'stall_prices.json', ['trade.goods[*].worth'], 'a trade good\'s price where it is made (twelve goods)', 'trade_good')
where(BB + 'loot.json', ['counts.batteries.pocket', 'counts.batteries.machine_cell'], 'what one beaten man had in his pocket (55 in 100) and the cell out of a machine', 'everyday')
where(BB + 'job_into_place.json', ['worth.value.battery', 'worth.value.per_tape'], 'what a build is worth when a job pays it into his place: its AA and an AA a roll of tape', 'everyday', owner='JOBS')
where(BB + 'home_base.json', ['bill.keep', 'bill.power_cost_by_mark.*'], 'his place\'s keep a night and what the dark costs it', 'everyday', owner='HOME BASE')
where(BB + 'home_base.json', ['builds.solar.worked.batteries'], 'what one worked solar panel at his place puts by a morning (GAMIFIED, 9/5 s4; who holds the sun is not decided)', 'everyday', owner='HOME BASE')
where(BB + 'home_base.json', ['places.yard.per_level', 'places.yard.min'], 'his training yard: an AA a level of the man, never under two', 'everyday', owner='HOME BASE')
# ---- the road, the quests, the places
where(RT + 'BOHEMIA_ROAD_EVENTS.json', ['events[*].opts[*].**.bats'], 'what a stop on the road gives, takes or asks (81 stops)', 'the_road')
where(RT + 'BOHEMIA_SIDE_QUESTS.json', ['quests.*.stages.*.fx.bats', 'quests.*.stages.*.fx.**.bats', 'quests.*.stages.*.fx.pay_why.win'], 'what a side quest\'s end pays (and the worked line beside it)', 'the_road')
where(RT + 'BOHEMIA_SIDE_QUESTS.json', ['quests.*.stages.*.fx.pay_why.quiet_rate'], 'the quiet rate a side quest\'s pay was worked from', 'job_part')
where(BB + 'real_places.json', ['places[*].visit.opts[*].**.bats'], 'what a real place gives, takes or asks on a visit', 'the_road')
where(RT + 'BOHEMIA_JOB_KINDS.json', ['kinds.*.legs[*].talk.opts[*].fx.bats', 'offers.*.legs[*].talk.opts[*].fx.bats'], 'a talk inside a job: paying a man\'s debt yourself, what a deal puts in your hand', 'the_road', owner='JOBS')
# ---- jobs
where(BB + 'job_pay.json', ['pays.*.pay'], 'THE BOARD: what each of the 102 jobs pays before fame, shelves and standing', 'job', owner='JOBS')
where(RT + 'BOHEMIA_BOARD_SHELF.json', ['offers[*].pay'], 'the board\'s own copy of those pays (39 people)', 'job', owner='JOBS')
where(RT + 'BOHEMIA_JOB_KINDS.json', ['board_people.rows[*].pay'], 'the job kinds\' own copy of those pays (63 people)', 'job', owner='JOBS')
where(BB + 'job_pay.json', ['per_fight.value', 'floor_per_skull.value', 'violence.value.quiet_floor_per_skull'], 'what a job\'s pay is built from: a fight at one skull, the least a killing job pays a skull, the least a quiet one pays', 'job_part', owner='JOBS')
where(RT + 'BOHEMIA_BOARD_SHELF.json', ['pay_per_skull'], 'the old floor a skull, kept on the shelf', 'job_part', owner='JOBS')
where(BB + 'origins.json', ['origins[*].pay'], 'an origin\'s bonus on every job (four origins: one AA)', 'everyday')
where(BB + 'boss_act_one.json', ['bosses[*].verb.pay_batteries', 'bosses[*].ground.till', 'bosses[*].tooth.tax', 'bosses[*].verb.cost'], 'the bosses: what a verb pays a time, THE POT\'s till, THE TOOTH\'s tax a town a day, a fade', 'the_road', owner='BOSSES')
where(BB + 'boss_act_one.json', ['bosses[*].verb.item.price'], 'the two things a boss\'s verb makes (a pipe gun, a pressed plate)', 'gear_piece', owner='BOSSES')
# ---- the big standing buys
where(BB + 'retinue.json', ['followers.value[*].price'], 'the eighteen who join the camp, once each', 'big', owner='RETINUE')
where(BB + 'retinue.json', ['followers.value[*].nums.champPayLo', 'followers.value[*].nums.champPayHi', 'followers.value[*].nums.placePayLo', 'followers.value[*].nums.placePayHi'], 'what two of them bring in: a champion\'s head, a place found', 'prize', owner='RETINUE')
where(BB + 'arena.json', ['opponents.value[*].purse', 'tournament.value.purse[*]'], 'the pit: a night\'s purse and the tournament\'s three rounds', 'prize', owner='ARENA')
where(BB + 'arena.json', ['purse_per_extra.value'], 'the pit: more a head when they send extra', 'everyday', owner='ARENA')
where(BB + 'origins.json', ['origins[*].batteries.*'], 'THE START: what each of the fifteen origins has on full, thin and bare shelves', 'purse')
where(BB + 'origins.json', ['origins[*].door.wagon_goods_batteries'], 'the water truck\'s goods, counted in AA\'s (read by a tool, not the game)', 'purse')
# ---- what multiplies (ratios: in the table so nobody types them twice; no band)
where(BB + 'renown.json', ['pay_mult.value.from', 'pay_mult.value.to', 'pay_mult.value.at'], 'CLOUT: every job pays from x1 to x4.5, full at 4,000', unit='ratio')
where(BB + 'job_pay.json', ['standing.value.*.mult'], 'the client town\'s standing bends the pay: 0.85 to 1.15', unit='ratio', owner='JOBS')
where(BB + 'job_pay.json', ['crew_cost_per_map_hour.value', 'margin.value', 'violence.value.quiet_margin'], 'what twelve men burn an hour, and how much over it an hour of a job pays', unit='ratio', owner='JOBS')
where(BB + 'job_into_place.json', ['share.value'], 'the most of a job\'s pay that can be a build', unit='ratio', owner='JOBS')
where(BB + 'stall_prices.json', ['sell_share.value', 'sell_share_max.value', 'sell_floor_share.value', 'size_mult.value.*', 'trade.made_here.value.*', 'trade.not_made.value.*'], 'the stall: what it pays back, what a place\'s size does, a good made here or not', unit='ratio')
where(RT + 'BOHEMIA_HALL_PRICE.json', ['easier'], 'the hall: a hire costs four fifths of the wiki\'s formula', unit='ratio')
where(BB + 'price_table.json', ['conversion.crownsPerBattery', 'conversion.floorBatteries'], 'the catalog rule\'s copy the old price engine reads', unit='ratio')
where(BB + 'origins.json', ['defaults.crowns_per_battery.value'], 'the catalog rule\'s copy beside the origins', unit='ratio')
where(RT + 'BOHEMIA_JOB_KINDS.json', ['kinds.*.legs[*].talk.opts[*].pay', 'offers.*.legs[*].talk.opts[*].pay'], 'a talk inside a job: the share of the pay a choice leaves (0 to 1.2)', unit='ratio', owner='JOBS')
where(BB + 'retinue.json', ['followers.value[*].nums.wage', 'followers.value[*].nums.hire', 'followers.value[*].nums.food'], 'the paymaster, the recruiter and the cook: what each takes off the wages, a hire, the food', unit='ratio', owner='RETINUE')
where(BB + 'home_base.json', ['bill.water_cost_by_mark.*'], 'his place: far water makes a man\'s night dearer (x1 to x1.5)', unit='ratio', owner='HOME BASE')
T['where'] = W

# ---- the typed copies in code. find: a regular expression; its one group is the number. is: the number (the table is its home).
C = []
def copy(file, find, what, is_=None, row=None, ladder=None, rule=None, n=None, times=None, comments=False, leaf=None):
    d = {'file': file, 'find': find, 'what': what}
    if is_ is not None: d['is'] = is_
    if row: d['row'] = row
    if ladder: d['ladder'] = ladder
    if rule: d['rule'] = rule
    if leaf: d['leaf'] = leaf
    if n is not None: d['n'] = n
    if times is not None: d['times'] = times
    if comments: d['comments'] = True
    C.append(d)
T['copies'] = C
T['prose'] = []
T['prose_not_shown'] = []
T['sweep'] = {
    'keys': r'^(bats|batteries|pay|price|purse|wage|tax|till|worth|bounty|bribe|toll|fee|prize|cost)$|batter|_bats$|^pay_|_pay$|_price$|^price_|crowns',
    'not_batteries': [
        {'file': RT + 'BOHEMIA_JOB_KINDS.json', 'path': 'kinds.*.blocks[*]', 'why': 'blocks of road, the bounty kind'},
        {'file': RT + 'BOHEMIA_JOB_KINDS.json', 'path': 'kinds.*.legs[*].blocks[*]', 'why': 'blocks of road, the bounty kind'},
        {'file': RT + 'BOHEMIA_JOB_KINDS.json', 'path': 'offers.*.legs[*].blocks[*]', 'why': 'blocks of road'},
        {'file': BB + 'price_table.json', 'path': 'dailyRates.**', 'why': 'the wiki\'s food stacks and tools worked at ten to one for the old price engine (engine/bohemia_pricetable.js, loaded by no page); the stall\'s live prices are stall_prices.json'},
        {'file': BB + 'price_table.json', 'path': 'contractPay.**', 'why': 'the wiki\'s one worked contract at ten to one, for the same unloaded engine; a job\'s live pay is job_pay.json'},
        {'file': BB + 'party_math.json', 'path': 'closeness_bands.**', 'why': 'TUNING\'s closeness bands: a rung on a ladder of gear, not a price shown'},
        {'file': BB + 'ours.json', 'path': 'road_network.**', 'why': 'what a board\'s road costs to lay, in the layer\'s own points'},
        {'file': BB + 'ours.json', 'path': 'range_bands_step_in.**', 'why': 'what a step closer is worth to the auto brain'},
        {'file': BB + 'ours.json', 'path': 'chase_calc.**', 'why': 'what a chase is worth to the auto brain'},
        {'file': BB + 'loot.json', 'path': 'counts.batteries.pocket_chance_pct', 'why': 'a chance in a hundred'},
        {'file': '*', 'path': '**.kinds.battery', 'why': 'a district kind called the battery yard (grid storage), not money'},
        {'file': '*', 'path': 'districts.battery.**', 'why': 'the same district kind'},
        {'file': RT + 'BOHEMIA_SIDE_QUESTS.json', 'path': 'quests.*.stages.*.fx.pay_why.hours', 'why': 'hours of his clock'},
        {'file': RT + 'BOHEMIA_SIDE_QUESTS.json', 'path': 'quests.*.stages.*.fx.pay_why.food', 'why': 'nights of food'},
        {'file': BB + 'home_base.json', 'path': '**.cost.tape', 'why': 'rolls of tape (HOME BASE\'s builds cost tape, and one AA each: the lot build\'s typed copy below)'},
    ]
}
for k in ('rows', 'sums', 'count'):
    if k in old: T[k] = old[k]
T.setdefault('rows', {})
exec(open(os.path.join(R, 'tools/bohemia_economy_two_the_table_copies.py')).read()) if os.path.exists(os.path.join(R, 'tools/bohemia_economy_two_the_table_copies.py')) else None
json.dump(T, open(OUT, 'w'), indent=1); open(OUT, 'a').write('\n')
print('wrote', os.path.relpath(OUT, R), len(W), 'places,', len(C), 'copies,', len(T['prose']), 'sentences')
