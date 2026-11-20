# THE TYPED COPIES (exec'd by tools/bohemia_economy_two_write_the_table.py; C, copy, T, BB, RT are its own).
# A number of batteries typed into code. find: a regular expression, its one group the number; then where the number's
# home is: is_ (this table), row (a row of the table), leaf (a worth in a crowns catalog), rule (the table's own rule).
H, CW, RS, AL = 'slices/BOHEMIA_SETTLEMENT_SCREEN.html', 'slices/BOHEMIA_CITY_WORLD.html', 'slices/BOHEMIA_ROSTER_SCREEN.html', 'slices/BOHEMIA_ALPHA_0_9.html'
E = 'engine/'
NB, SP, JP, OR, RET, INJ = BB + 'nightly_bill.json', BB + 'stall_prices.json', BB + 'job_pay.json', BB + 'origins.json', BB + 'retinue.json', BB + 'injuries.json'
CPB, FLOOR = 'catalogs.crowns_per_battery', 'catalogs.floor'

# ---- one AA: the things the game charges or pays one for (EVERYTHING COSTS ONE, 8/15, where nobody has tuned it since)
for f in (E + 'bohemia_lotbuild.js', CW):
    copy(f, r"var COST = \{ currency: 'electricity', amount: (\d+) \}", 'a build on a lot costs one AA and a day (HOME BASE\'s; its tape is home_base.json)', is_=1)
copy(CW, r"var AMOUNT = (\d+);", 'a power building puts by one AA a day (GAMIFIED 9/5; who holds the sun is not decided)', is_=1)
copy(E + 'bohemia_powerbuild.js', r"var AMOUNT = (\d+);", 'a power building puts by one AA a day', is_=1)
copy(E + 'bohemia_barber.js', r"var COST = \{ currency: 'electricity', amount: (\d+) \}", 'the barber\'s chair costs one AA', is_=1)
for f in (E + 'bohemia_purse.js', CW):
    copy(f, r"COMPLETE: \{ electricity: (\d+)", 'a day\'s work pays one AA (the walked city\'s WORK, hidden in the demo)', is_=1)
    copy(f, r"out\[id\] = \{ currency: 'electricity', amount: (\d+)", 'every good at the walked city\'s market costs one AA (hidden in the demo)', is_=1)
copy(CW, r"var COST_AMOUNT = (\d+)", 'a builder plot costs one AA (the builder, hidden in the demo)', is_=1)
copy(CW, r"'electricity',\s*(\d+),\s*'rent on '", 'RENT: one AA for a billed block of a faction\'s ground crossed that day', is_=1)
copy(H, r"'electricity', (\d+), 'build:'", 'his own place (yard, forge, lookout) costs one AA and its tape', is_=1)
copy(H, r"'electricity',(\d+),'yard:swap'", 'swapping a veteran\'s mastery at a fortress yard costs one AA', is_=1)
copy(H, r"'electricity', (\d+), 'scavenge:battery'", 'a battery found scavenging is one AA', is_=1, n=2)
copy(H, r"short:'(\d+) battery'\}", 'the barber\'s door says its price', is_=1)
copy(H, r"'(\d+) battery, 1 day'", 'the BUILD door says its price', is_=1, n=2)
copy(H, r"'(\d+) battery\s+' \+ buildDoes", 'a build row says its price', is_=1)
copy(H, r"'(\d+) BATTERY' \+ \(", 'a build row at his place says its price', is_=1, n=4)
copy(H, r"act\('Sit in the chair', '(\d+) battery'", 'the barber\'s button says its price', is_=1)
copy(H, r"mastery', '(\d+) battery'", 'the yard\'s swap button says its price', is_=1)
copy(H, r'id="bat">0 BATTERIES<', 'the town bar\'s empty text before the purse lands (not a price)')
copy(H, r"function roundPrice\(\)\{ return Math\.max\(1, S\.crewSize \|\| 3\); \}", 'a round at the bar is one AA a head: the crew\'s size (not typed as a number)')
copy(CW, r"function battWord\(n\)\{ return n===1\?'1 battery'", 'the word for one (not a price)')
# ---- a man's night
copy(CW, r"var BILL = \{ per_man: (\d+)", 'the map\'s copy of a man\'s night until nightly_bill.json lands', row=NB + '#per_man_per_night.value')
copy(RS, r"var NIGHT = \{per:(\d+)", 'the crew screen\'s copy of a man\'s night', row=NB + '#per_man_per_night.value')
copy(H, r"good:'food'[^}]*price:(\d+)\}", 'the stall\'s copy of a night of food and water until stall_prices.json lands', row=SP + '#goods.food.buy.value')
copy(E + 'bohemia_stall_prices.js', r"buy_floor, (\d+)\)", 'the stall engine\'s copy of the floor', row=SP + '#buy_floor.value', n=2)
# ---- the catalog rule's copies (ten crowns to one AA, never under one)
copy(H, r"function priceOf\(v\)\{ return Math\.max\((\d+), Math\.round\(\(v\|\|0\)/10\)\)", 'the shops: never under one', rule=FLOOR)
copy(H, r"function priceOf\(v\)\{ return Math\.max\(1, Math\.round\(\(v\|\|0\)/(\d+)\)\)", 'the shops: ten crowns to one', rule=CPB)
copy(E + 'bohemia_roster.js', r"function priceOf\(v\) \{ return Math\.max\(1, Math\.round\(\(v \|\| 0\) / (\d+)\)\)", 'the roster: ten crowns to one', rule=CPB)
copy(E + 'bohemia_roster.js', r"daily_wage \|\| 10\) / (\d+)", 'the roster\'s wage: ten crowns to one', rule=CPB)
copy(E + 'bohemia_arena.js', r"value \|\| 0\) / (\d+)", 'the pit\'s prizes: ten crowns to one', rule=CPB)
copy(E + 'bohemia_wages.js', r"w / (\d+) \* Math\.pow", 'a wage: ten crowns to one', rule=CPB)
copy(E + 'bohemia_goodbros.js', r"priceCrowns / (\d+)", 'the post\'s fallback hire price: ten crowns to one', rule=CPB)
copy('slices/bohemia_road_events.js', r"value \|\| 30\) / (\d+)\)", 'a weapon found on the road: ten crowns to one', rule=CPB)
copy(H, r"Math\.round\(crowns / (\d+)\)", 'the clinic: ten crowns to one', rule=CPB)
copy(H, r"var crowns = (\d+) \* 1 \* traitMult", 'the clinic\'s copy of the wiki\'s wound treatment base', leaf=INJ + '#rules.temporary_healing.base_wound_treatment_price')
copy(RS, r"Math\.round\((\d+) \* m\.hurt\.days", 'the crew screen\'s copy of the same base', leaf=INJ + '#rules.temporary_healing.base_wound_treatment_price')
copy(RS, r"\(1 \+ \(m\.level - 1\) \* 0\.2\) / (\d+)\)", 'the crew screen\'s clinic price: ten crowns to one', rule=CPB)
# ---- jobs
copy(E + 'bohemia_job_pay.js', r"v\('per_fight', (\d+)\)", 'the job engine\'s copy of a fight\'s pay', row=JP + '#per_fight.value')
copy(E + 'bohemia_job_pay.js', r"v\('floor_per_skull', (\d+)\)", 'the job engine\'s copy of the floor a skull', row=JP + '#floor_per_skull.value')
copy(E + 'bohemia_job_pay.js', r"VI\.quiet_floor_per_skull : (\d+)\)", 'the job engine\'s copy of the quiet floor', row=JP + '#violence.value.quiet_floor_per_skull')
copy(E + 'bohemia_job_pay.js', r"v\('crew_cost_per_map_hour', ([\d.]+)\)", 'the job engine\'s copy of what twelve men burn an hour', row=JP + '#crew_cost_per_map_hour.value')
for oid, sk in (('ct-escort-water', 1), ('ct-road-crew', 2), ('ct-find-the-kid', 2), ('ct-dogs', 3)):
    copy(H, r"id:'" + oid + r"'[^}]*?pay:(\d+)", 'the board\'s four fallback jobs (shown only if the shelf has not loaded): the floor a skull', row=JP + '#floor_per_skull.value', times=sk)
copy(E + 'bohemia_renown.js', r"pay: \{ from: ([\d.]+), to: [\d.]+, at: \d+ \}", 'CLOUT\'s copy until renown.json lands', row=BB + 'renown.json#pay_mult.value.from')
copy(E + 'bohemia_renown.js', r"pay: \{ from: [\d.]+, to: ([\d.]+), at: \d+ \}", 'CLOUT\'s copy until renown.json lands', row=BB + 'renown.json#pay_mult.value.to')
copy(E + 'bohemia_renown.js', r"pay: \{ from: [\d.]+, to: [\d.]+, at: (\d+) \}", 'CLOUT\'s copy until renown.json lands', row=BB + 'renown.json#pay_mult.value.at')
# ---- the shelves (the start screen's pick): typed in the shell, no data file
for k in ('full', 'thin', 'bare'):
    copy(AL, r"id:'" + k + r"', name:'[A-Z ]+', sub:'[^']*',\s*mult:([\d.]+)", 'THE SHELVES: what the start screen\'s pick multiplies every job by', rule='ratios.shelves.' + k)
# ---- the start: the door's typed fallback before origins.json lands is the file's THIN purse (it was 3 to 7: an old number)
import json as _j
_org = _j.load(open(os.path.join(R, OR)))['origins']
for o in _org:
    copy(AL, r"\{ id:'" + o['id'] + r"',\s+bb:'[^']*',\s+name:'[^']*',\s+d:\d, start:(\d+),", 'the door\'s copy of the start purse until origins.json lands: the THIN purse (the pick multiplies it)', row=OR + '#origins[id=' + o['id'] + '].batteries.thin')
# ---- the camp: the cart's four steps (typed, no data file) and the eighteen who join (a copy of retinue.json)
for cid, v in (('handcart', 100), ('pickup', 200), ('boxtruck', 350), ('trailer', 500)):
    copy(E + 'bohemia_camp.js', r"id: '" + cid + r"', word: '[^']*', slots: \d+, price: (\d+)", 'THE CART: its four steps, bought once each (five tool packs, ten, a car battery and five, two car batteries)', is_=v)
for f in _j.load(open(os.path.join(R, RET)))['followers']['value']:
    copy(E + 'bohemia_camp.js', r'"id":"' + f['id'] + r'","bb":"[^"]*","name":"[^"]*","look":"[^"]*","price":(\d+)', 'the camp engine\'s copy of a follower\'s price until retinue.json lands', row=RET + '#followers.value[id=' + f['id'] + '].price')
copy(E + 'bohemia_camp.js', r"he pays (\d+) to \d+ batteries a head", 'the camp engine\'s copy of the bounty hunter\'s line', row=RET + '#followers.value[id=bounty_hunter].nums.champPayLo')
copy(E + 'bohemia_camp.js', r"he pays \d+ to (\d+) batteries a head", 'the camp engine\'s copy of the bounty hunter\'s line', row=RET + '#followers.value[id=bounty_hunter].nums.champPayHi')
copy(E + 'bohemia_camp.js', r"He pays you (\d+) to \d+ batteries", 'the camp engine\'s copy of the cartographer\'s line', row=RET + '#followers.value[id=cartographer].nums.placePayLo')
copy(E + 'bohemia_camp.js', r"He pays you \d+ to (\d+) batteries", 'the camp engine\'s copy of the cartographer\'s line', row=RET + '#followers.value[id=cartographer].nums.placePayHi')
for f in (E + 'bohemia_followers.js', CW):
    for fid in ('cook', 'scout', 'lookout', 'paymaster', 'blacksmith', 'surgeon'):
        copy(f, r"\{ id: '" + fid + r"', bb: '[^']*', price: (\d+)", 'the old camp staff\'s copy of a follower\'s price (the walked city; the camp reads retinue.json)', row=RET + '#followers.value[id=' + fid + '].price')
        copy(f, r"A " + fid + r", for (\d+) batteries, once", 'the old camp staff\'s line names the same price', row=RET + '#followers.value[id=' + fid + '].price')
# ---- the hall: the wiki's level cost (crowns)
copy(H, r"(\d+) \* Math\.pow\(Math\.max\(0, \(r\.level \|\| 1\) - 1\), 1\.5\)", 'the hall: the wiki\'s level cost, 500 crowns x (level - 1) ^ 1.5', is_=500, n=3)
# ---- his place
copy(E + 'bohemia_home.js', r"Y\.min \| 0 \|\| (\d+),", 'the home engine\'s copy of the yard\'s least', row=BB + 'home_base.json#places.yard.min')
copy(E + 'bohemia_home.js', r"\(Y\.per_level \|\| (\d+)\)", 'the home engine\'s copy of the yard\'s AA a level', row=BB + 'home_base.json#places.yard.per_level')
# ---- the bosses' fallbacks
copy('slices/bohemia_bosses.js', r"cost = V\.cost \| 0 \|\| (\d+)", 'the fade\'s copy of its price until boss_act_one.json lands', row=BB + 'boss_act_one.json#bosses[id=the_barber].verb.cost')

# ---- ECONOMY THREE 11/20 (rule 461 'dont forget nothing'; rule 459(b)): the money typed as a FIELD ('pay:1', 'wage: 10'), which
# the words-only sweep never saw. Each one measured against its home before it was held.
for o in _org:   # the door's copy of each origin's bonus on every job, until origins.json lands (four origins: one AA)
    copy(AL, r"\{ id:'" + o['id'] + r"',\s+bb:'[^']*',\s+name:'[^']*',\s+d:\d, start:\d+, crew:\s*-?\d+,\s*pay:(\d+),", 'the door\'s copy of the origin\'s bonus on every job until origins.json lands', row=OR + '#origins[id=' + o['id'] + '].pay')
BG = BB + 'backgrounds.json'
_post = (('farmhand', 115, 409), ('messenger', 117, 217), ('butcher', 187, 287), ('brawler', 120, 170), ('thief', 195, 452), ('militia', 254, 2248))
for bid, lo, hi in _post:   # the six at the post: the wiki's wage a day (crowns) and the Game Guide's observed hire range (crowns)
    copy(E + 'bohemia_goodbros.js', r"\{ id: '" + bid + r"', name: '[^']*', wage: (\d+),", 'the post\'s copy of the trade\'s wage a day, in the wiki\'s crowns (ten to one AA)', leaf=BG + '#rows[id=' + bid + '].daily_wage')
    copy(E + 'bohemia_goodbros.js', r"\{ id: '" + bid + r"', name: '[^']*', wage: \d+, hireMin: (\d+),", 'the post\'s low end of the Game Guide\'s observed hire range (crowns; backgrounds.json hiring_cost_game_guide_observed, a sentence there): only WHERE in the hall\'s range a man stands, and his price before price_table.json lands', is_=lo)
    copy(E + 'bohemia_goodbros.js', r"\{ id: '" + bid + r"', name: '[^']*', wage: \d+, hireMin: \d+, hireMax: (\d+),", 'the post\'s high end of the same observed range (crowns)', is_=hi)
copy(E + 'bohemia_roster.js', r"stats: D\.backgrounds\.base_stats\.stats, daily_wage: (\d+) \}", 'the roster\'s wage for a trade the file does not know: ten crowns a day, the commonest wage in backgrounds.json (one AA a night)', is_=10)
copy('slices/bohemia_road_events.js', r"cls: 'dagger', name: String\(id\), price: (\d+),", 'a weapon off the road whose row is gone: the same 30-crown fallback as above, at ten to one', is_=3)
copy(CW, r"title: 'Get your men back from ' \+ by, pay: (\d+),", 'a rescue pays nothing: the job is getting your own men back', is_=0)
for f in (CW, E + 'bohemia_ambitions.js'):
    copy(f, r"var REWARD = \{ currency: 'electricity', amount: (\d+), tuned: false \}", 'an ambition kept pays two AA (the walked city\'s company goals; its bark needs a man walking with you, which died with the walk 9/28)', is_=2)
copy(H, r"W = \(INTO && INTO\.worth && INTO\.worth\.value\) \|\| \{ battery: (\d+), per_tape: \d+ \}", 'the town\'s copy of what a build is worth when a job pays it into his place, until job_into_place.json lands', row=BB + 'job_into_place.json#worth.value.battery')
copy(H, r"W = \(INTO && INTO\.worth && INTO\.worth\.value\) \|\| \{ battery: \d+, per_tape: (\d+) \}", 'the same: an AA a roll of tape', row=BB + 'job_into_place.json#worth.value.per_tape')
copy(H, r"var crowns = 20 \* (\d+) \* traitMult", 'the clinic: the wiki\'s treatment price multiplier', leaf=INJ + '#rules.temporary_healing.treatment_price_multiplier')
copy(H, r"var crowns = 20 \* 1 \* traitMult\(\)\.buy \* w\.days \* \(1 \+ \(w\.level - 1\) \* ([\d.]+)\)", 'the clinic: a fifth more a level, the wiki\'s', leaf=INJ + '#rules.temporary_healing.per_level_price_factor')
copy(RS, r"\(1 \+ \(m\.level - 1\) \* ([\d.]+)\) / \d+\)", 'the crew screen\'s clinic: a fifth more a level', leaf=INJ + '#rules.temporary_healing.per_level_price_factor')
copy(H, r"baseCrowns:\+spec\.base_crowns \|\| (\d+),", 'a rare man with no base in rare_recruits.json is priced from the top of the wiki\'s base range', leaf=BB + 'price_table.json#wageAndHire.hiringBaseRange.maxApprox')
copy(H, r"var mult = \(HIREPT && HIREPT\.equipmentCostMultiplier\) \|\| ([\d.]+);", 'the hall\'s kit multiplier before price_table.json lands', leaf=BB + 'price_table.json#wageAndHire.equipmentCostMultiplier')
T['code_not_money'] = [
    {'file': CW, 'find': r"opts: \[ \{ a:'pay',\s+t:'(?:GIVE HIM SOMETHING|PAY THE CUT)', pay:\d+", 'why': 'the walked road\'s choices are paid in SALVAGE, not batteries (BohemiaPockets.hand(... \'resources\', o.pay)); the road on the map is BOHEMIA_ROAD_EVENTS.json'},
    {'file': CW, 'find': r"key\[r\] = \{ reason:r, currency:e\.currency, amount:0,", 'why': 'a running total that starts at nothing'},
    {'file': AL, 'find': r"o = \{ id: d\.id, start: 0, crew: 0, pay: 0 \}", 'why': 'a modder\'s origin, empty until the line under it fills it from origins.json'},
]

# ---- THE NUMBER INSIDE A SENTENCE (a data file's own words). nums: every run of digits in the sentence, in order: a row
# (the sentence must say that row's number; `stamp` moves the digits, never a word, rule 454(a)) or a plain number that is
# not batteries. A boss is named by its place in the ladder (the file gives a boss no id).
BOSS, JK = BB + 'boss_act_one.json', RT + 'BOHEMIA_JOB_KINDS.json'
def prose(file, path, nums): T['prose'].append({'file': file, 'path': path, 'nums': nums})
for b, k in ((1, 'verb.pay_batteries'), (5, 'verb.pay_batteries'), (6, 'verb.pay_batteries')):
    for p in ('verb.tip', 'verb.hand.line', 'after.says'):
        prose(BOSS, 'bosses[%d].%s' % (b, p), [BOSS + '#bosses[%d].%s' % (b, k)])
prose(BOSS, 'bosses[12].verb.hand.line', [BOSS + '#bosses[12].verb.cost', 25])
prose(OR, 'origins[id=pit].personal.rule.says', [OR + '#origins[id=pit].door.wage_per_man_per_night', 12])
prose(RET, 'followers.value[id=bounty_hunter].does', [RET + '#followers.value[id=bounty_hunter].nums.champPayLo', RET + '#followers.value[id=bounty_hunter].nums.champPayHi'])
prose(RET, 'followers.value[id=cartographer].does', [RET + '#followers.value[id=cartographer].nums.placePayLo', RET + '#followers.value[id=cartographer].nums.placePayHi'])
prose(JK, 'kinds.collect.legs[0].talk.opts[2].t', [JK + '#kinds.collect.legs[0].talk.opts[2].fx.bats'])
for o in ('tito', 'rent', 'chips'):
    prose(JK, 'offers.jb-collect-%s.legs[0].talk.opts[2].t' % o, [JK + '#offers.jb-collect-%s.legs[0].talk.opts[2].fx.bats' % o])
# words in a data file that say a number of batteries and are never on the glass: a file's own notes
T['prose_not_shown'] = [{'file': '*', 'path': p} for p in ('**.source', '**.why', '**.worked', '**.note', '**.about', '**._about', '_about', '**.wage_about', 'fills.*', '**.quote', '**._source', '**._corrected')]
# the fade's copy in the boss script names the barber by his place too
for c in C:
    if c.get('row', '').endswith('bosses[id=the_barber].verb.cost'): c['row'] = BOSS + '#bosses[12].verb.cost'
