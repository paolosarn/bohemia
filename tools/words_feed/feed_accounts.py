# THE FEED'S ACCOUNTS (WORDS, 10/26/26, rows [the feed's words] and [the usernames tell the story],
# rules 215 and 217). Every post on the phone's FEED app is a HANDLE and its words (217a: no portrait
# for now, the face field stays empty so faces come later with no code).
#
# THE HANDLE SYSTEM, from the research (records/BOHEMIA_WORDS_THE_FEED_TALKS_AND_THE_HANDLES_10_26_26.md):
#   * A PERSON'S HANDLE IS OLD AND MESSY. The clean name was taken decades ago, so people carry the
#     digits they added as kids (a birth year, two or four digits: arXiv 1101.5578), the 702, the
#     block, and since the crash THE TRADE OR THE NEED tacked on the end ("_eggs4cells", "_welds").
#   * A PAGE'S HANDLE IS CLEAN AND HAS ITS FACTION'S WORD IN IT. A clean handle tells you it is an
#     outfit, not a neighbour: they took the name, or took it from whoever had it.
#   * A FOSSIL FROM BEFORE THE DOLLAR DIED: the ".eth" leftover, the "gm" bot, the brand bots.
#   * A BURNER is a number and a shrug ("throwaway_jean_7"): used three times or fewer, then gone.
#   * A BOT IS STILL POSTING AFTER ITS OWNER LEFT. The one place a machine talks, on purpose, and a
#     person always answers it.
#   * THEY EVOLVE WITH THE ACTS (217d): act two re-registers with real names, trades and co-ops (the
#     rebuilt era), act three is short and clean again and the old digits are the grandparents' tell.
#     The next generation inherits the account (the three generations inherit).
#
# lean: 'spanglish' = this mouth leans to it (engine/bohemia_spanglish.js LEAN_HIGH, 25 in 100);
#       None = the dial rolls the person (10 or 25); 'en' with player=True = never (the first votes).
# draft: every handle is an attempt (8/11), WORDS sharpens it.

def acct(id, handle, name, kind, home=None, trade=None, faction=None, lean=None, voice='', acts=None, player=False):
    a = {'id': id, 'handle': handle, 'name': name, 'kind': kind, 'home': home, 'trade': trade,
         'faction': faction, 'lean': lean, 'voice': voice,
         'face': {'id': 'face-feed-' + id, 'portrait': None},
         'acts': {'1': handle, '2': (acts or {}).get('2'), '3': (acts or {}).get('3')},
         'draft': True}
    if player:
        a['player'] = True
    if kind == 'bot':
        # a scheduler never code-switches: the dial is skipped, like the player's
        a['machine'] = True
        a['lean'] = 'en'
    return a

ACCOUNTS = [
    # ---- THE TOWN'S PEOPLE: one to three a place, the twelve places and the valley itself ----------
    acct('dolores', 'doloresy_eggs4cells', 'Dolores Ybarra', 'person', 'henderson', 'eggs', lean='spanglish',
         voice='a grandmother who sells eggs off her porch and knows every family on the street',
         acts={'2': 'ybarra.eggs', '3': 'ybarrafarms'}),
    acct('marcus', 'mbell2020_welds', 'Marcus Bell', 'person', 'henderson', 'welding',
         voice='a welder, forty, short sentences, fixes what the raids break',
         acts={'2': 'marcus.bell.welding', '3': 'bellmetal'}),
    acct('tran', 'tran.eth.radiofix', 'Tran Nguyen', 'person', 'henderson', 'radios',
         voice='held crypto before the dollar died, the .eth is a fossil he never dropped; fixes radios now, dry',
         acts={'2': 'tran.nguyen.radios', '3': 'nguyen.signal'}),
    acct('ruthann', 'ruthann_prayerline', 'Ruth Ann Kessler', 'person', 'boulder_city', 'the chapel',
         voice='runs the chapel prayer list, warm, writes full sentences, prays for everybody by name',
         acts={'2': 'bc.chapel.ruthann', '3': 'kessler.memorial'}),
    acct('leon', 'leonpratt_tow', 'Leon Pratt', 'person', 'boulder_city', 'tow truck',
         voice='drives the last running tow truck in Boulder City, sees every road first',
         acts={'2': 'pratt.towing', '3': 'pratt_haul'}),
    acct('wade', 'wade_dam_shift3', 'Wade Tolliver', 'person', 'hoover_dam', 'the dam',
         voice='works third shift at the dam, notices the water and the lights, says little',
         acts={'2': 'w.tolliver.hydro', '3': 'tolliver.grid'}),
    acct('inez', 'inez_marina_bait', 'Inez Carrillo', 'person', 'lake_mead_marina', 'bait and tackle', lean='spanglish',
         voice='ran the bait shop at the marina, lives next to the water people and does not love them',
         acts={'2': 'carrillo.marina', '3': 'inezc'}),
    acct('jimmy', 'ex_guard_jimmy_jean', 'Jimmy Ruiz', 'person', 'jean', 'prison guard',
         voice='a prison guard when there was a prison; knows who got out and when',
         acts={'2': 'jruiz.jean.watch', '3': 'ruiz.jean'}),
    acct('kayla', 'kayla_forklift_primm', 'Kayla Moss', 'person', 'primm', 'forklift',
         voice='twenty-six, drove a forklift at the warehouse, posts fast with no caps',
         acts={'2': 'kmoss.logistics', '3': 'kaylamoss'}),
    acct('bud', 'bud_searchlight_mine', 'Bud Haskins', 'person', 'searchlight', 'the mine',
         voice='an old miner, suspicious, plain, trusts rocks more than people',
         acts={'2': 'haskins.mineral', '3': None}),
    acct('corinne', 'corinne_old_dispatch', 'Corinne Watts', 'person', 'indian_springs', 'old police dispatch',
         voice='a police dispatcher before, still talks in codes and times, calm under anything',
         acts={'2': 'cwatts.dispatch', '3': 'watts.relay'}),
    acct('hal', 'hal_lodge_firewood', 'Hal Bjornstad', 'person', 'mt_charleston_lodge', 'firewood',
         voice='sells firewood up the mountain, the cold is his whole subject',
         acts={'2': 'bjornstad.wood', '3': 'hal.lodge'}),
    acct('shawna', 'shawna_pahrump_nails', 'Shawna Teller', 'person', 'pahrump', 'nails',
         voice='did nails at the resort, still does them for cells, the town gossip and its nurse',
         acts={'2': 'shawna.teller.salon', '3': 'tellerbeauty'}),
    acct('esteban', 'esteban_pahrump_goats', 'Esteban Mora', 'person', 'pahrump', 'goats', lean='spanglish',
         voice='keeps goats, counts them out loud, a joke for everything but the herd',
         acts={'2': 'mora.goats', '3': 'moraranch'}),
    acct('pilar', 'pilar_rn_moapa', 'Pilar Ocampo', 'person', 'moapa', 'nurse',
         voice='the nurse at the Moapa clinic, tired, exact, asks for supplies by name',
         acts={'2': 'p.ocampo.rn', '3': 'ocampo.clinic'}),
    acct('gary', 'gary_mesquite_carts', 'Gary Lindqvist', 'person', 'mesquite', 'golf carts',
         voice='turns golf carts into haulers, sixty, cheerful in a way that does not fit',
         acts={'2': 'lindqvist.carts', '3': None}),
    # the eight handles the stream already had (engine/bohemia_feedstream.js, 9/5): kept, given a person
    acct('marisol', 'marisol_v', 'Marisol Vega', 'person', 'valley', 'cooks', lean='spanglish',
         voice='made her account at twelve when short names were still free; cooks for half the block',
         acts={'2': 'marisol.vega.kitchen', '3': 'vegakitchen'}),
    acct('eve', 'eastwardEve', 'Eve Castaneda', 'person', 'valley', 'builds',
         voice='the east side, cheers every new roof, a builder\'s daughter',
         acts={'2': 'eve.castaneda.build', '3': 'eastward'}),
    acct('benny', 'thecircuit', 'Benny Ortiz', 'person', 'valley', 'the circuit, a lineman',
         voice='a power lineman, the grid is his and he takes it personally',
         acts={'2': 'ortiz.lineman', '3': 'thecircuit'}),
    acct('sal', 'nobodysgas', 'Sal Moretti', 'person', 'valley', 'the gas station',
         voice='runs the gas station that has had no gas for years; posts every price he hears',
         acts={'2': 'moretti.fuel', '3': 'nobodysgas'}),
    acct('terri', 'thevalley', 'Terri Vance', 'person', 'valley', 'the valley group',
         voice='runs the valley\'s group page, sees everything, a little tired of everybody',
         acts={'2': 'valley.group.terri', '3': 'thevalley'}),
    acct('chuy', 'nightcount', 'Chuy Arreola', 'person', 'valley', 'counts lights', lean='spanglish',
         voice='an old man who walks to the ridge every night and counts the lights',
         acts={'2': 'nightcount', '3': 'nightcount_jr'}),
    acct('yolanda', 'waterline', 'Yolanda Price', 'person', 'valley', 'the waterline, the standpipe',
         voice='at the standpipe every morning, knows everybody in the line',
         acts={'2': 'yprice.water', '3': 'waterline'}),
    acct('lyle', 'duststop', 'Lyle Danner', 'person', 'valley', 'truck stop',
         voice='owns the truck stop on the edge, reads the weather off the dry lake',
         acts={'2': 'danner.truckstop', '3': 'duststop'}),
    acct('dre', 'coachdre_northtown27', 'Andre Little', 'person', 'valley', 'basketball coach',
         voice='coached kids\' ball in North Town, still does on a cracked court, big heart',
         acts={'2': 'coach.dre.little', '3': 'coachdre'}),
    acct('lupe', 'lupe_s_sews', 'Lupe Sandoval', 'person', 'valley', 'seamstress', lean='spanglish',
         voice='sews and mends for cells, says what everybody is thinking',
         acts={'2': 'sandoval.sewing', '3': 'lupesews'}),
    acct('ken', 'bigken702_smoker', 'Ken Takahashi', 'person', 'valley', 'smokes meat',
         voice='smokes whatever meat there is in an oil drum, generous, loud',
         acts={'2': 'takahashi.bbq', '3': 'bigken'}),
    acct('yesi', 'yesi_cuts_31', 'Yesenia Flores', 'person', 'valley', 'barber, cuts hair',
         voice='a barber, born \'31, her chair is where the valley\'s news is told first',
         acts={'2': 'yesi.flores.barber', '3': 'yesicuts'}),
    acct('darnell', 'darnell_used2drive109', 'Darnell Price', 'person', 'valley', 'used to drive the 109 bus',
         voice='drove the 109 bus for twenty years; still knows every stop and who used to wait there',
         acts={'2': 'dprice.route109', '3': None}),
    # ---- THE SCANNER PAGE: a person relaying the radio (the scanner-page research: no names, no house
    #      numbers, people show up at scenes, a rumour once killed a man) -------------------------------
    acct('ray', 'valleyscanner702', 'Ray Delgado (admin)', 'scanner', 'valley', 'scanner page',
         voice='VALLEY SCANNER, run by Ray: the place in caps, then what the radio said, unconfirmed, no names',
         acts={'2': 'valleyscanner702', '3': 'valleyrelay'}),
    # ---- THE FACTIONS' PAGES: clean handles, the faction's word in the name (records/target/bb/factions.json) --
    acct('pg_road', 'roadcrew_toll15', 'THE ROAD CREWS', 'page', None, 'tolls', 'brigands', lean='spanglish',
         voice='toll notices and threats, bored, sure of themselves; the 15 is theirs',
         acts={'2': 'roadcrew_toll15', '3': 'i15.toll.authority'}),
    acct('pg_house', 'the.house.depot', 'THE HOUSE', 'page', None, 'the depot', 'noble_houses',
         voice='an old corporation that survived: polite, formal, never says who got hurt',
         acts={'2': 'the.house', '3': 'thehouse'}),
    acct('pg_keeper', 'the_unfinished', 'THE KEEPER', 'page', None, 'machines', 'zombies',
         voice='the man who brings his machines back: gentle, patient, never threatens, frightening anyway',
         acts={'2': 'the_unfinished', '3': 'the_unfinished'}),
    acct('pg_water', 'agua.por.baterias', 'THE WATER PEOPLE', 'page', None, 'water', 'nomads', lean='spanglish',
         voice='sellers of water by the jug: flat prices, no haggle, a little cruel',
         acts={'2': 'agua.coop', '3': 'aguacoop'}),
    acct('pg_guns', 'hiredguns_strip', 'THE HIRED GUNS', 'page', None, 'guns for hire', 'mercenaries',
         voice='a price list with a pulse: whoever pays more',
         acts={'2': 'strip.security', '3': 'stripsecurity'}),
    acct('pg_heads', 'headtakers_bounties', 'THE HEAD TAKERS', 'page', None, 'bounties', 'bounty_hunters',
         voice='bounty notices, courteous, with rules they keep',
         acts={'2': 'headtakers_bounties', '3': 'recovery.agents'}),
    acct('pg_flock', 'theflock_wecount', 'THE FLOCK', 'page', None, 'the count', 'cultists', lean='spanglish',
         voice='a church that counts everybody: kind, welcoming, and it keeps a list',
         acts={'2': 'theflock_wecount', '3': 'thecount'}),
    acct('pg_keepers', 'keepers_of_the_herd', 'THE KEEPERS', 'page', None, 'the herd', 'barbarians',
         voice='herders of the lab-made animals: plain, slow, they love the herd more than people',
         acts={'2': 'herd.keepers', '3': 'keepers_of_the_herd'}),
    acct('pg_eye', 'eyeinthesky_floor', 'THE EYE IN THE SKY', 'page', None, 'the casino floor', 'city_states',
         voice='casino security that became a government: polite, total, it has the tape',
         acts={'2': 'eyeinthesky', '3': 'eye'}),
    acct('pg_watch', 'blockwatch_702', 'THE BLOCK WATCH', 'page', None, 'the block', 'militia', lean='spanglish',
         voice='a neighbourhood watch with guns: rules, curfews, porch lights, first names',
         acts={'2': 'blockwatch_702', '3': 'neighborhood.safety'}),
    acct('pg_runners', 'runners_by_sundown', 'THE RUNNERS', 'page', None, 'deliveries', 'goblins',
         voice='kids on carts and bikes who move anything and hit the lots: fast, cocky, they lose people',
         acts={'2': 'runners_by_sundown', '3': 'sundown.delivery'}),
    # ---- HIS COMPANY'S PAGE: his, plain English always (the first votes: the player does not speak Spanglish).
    #      The handle is made from the name he types in FEED (rule 212): lower case, no spaces. ---------------
    acct('company', '{companyhandle}', '{company}', 'company', None, 'the company', lean='en', player=True,
         voice='his: plain, short, proud; names the man, the place, the fact; never a joke',
         acts={'2': '{companyhandle}', '3': '{companyhandle}'}),
    # ---- STRANGERS: burners and people passing through. Used three times or fewer, then gone. ----------------
    acct('burner_jean', 'throwaway_jean_7', 'throwaway_jean_7', 'stranger', 'jean', None,
         voice='a burner; says the thing nobody will put their name on', acts={'2': None, '3': None}),
    acct('burner_0442', 'burner0442', 'burner0442', 'stranger', None, None,
         voice='a number and a shrug', acts={'2': None, '3': None}),
    acct('passing_15', 'justpassing_15', 'just passing', 'stranger', None, 'driver',
         voice='a driver going through on the 15, sees the valley from outside', acts={'2': None, '3': None}),
    acct('dont_look', 'dont_look_me_up', 'dont_look_me_up', 'stranger', None, None,
         voice='a burner with a grudge and a good eye', acts={'2': None, '3': None}),
    acct('anon_hendo', 'anon_hendo_2', 'anon_hendo_2', 'stranger', 'henderson', None,
         voice='a Henderson burner, the second one; nobody knows what happened to the first', acts={'2': None, '3': None}),
    # ---- THE BOTS STILL POSTING AFTER THEIR OWNERS LEFT (217c). The one place a machine talks, on purpose.
    #      Rare on the feed, and a person always answers (reply_bot). ------------------------------------------
    acct('bot_happyhour', 'CoralLounge_HappyHour', 'Coral Lounge (scheduled)', 'bot', None, 'a dark casino bar',
         voice='a casino bar\'s scheduler, still announcing happy hour in a lounge dark for years',
         acts={'2': None, '3': None}),
    acct('bot_power', 'ValleyPowerAlerts', 'Valley Power Alerts', 'bot', None, 'the old utility',
         voice='the dead utility\'s alert feed, still scheduling maintenance every night',
         acts={'2': None, '3': None}),
    acct('bot_wx', 'wx_vegas_auto', 'wx vegas auto', 'bot', None, 'weather',
         voice='a weather bot that never stopped; the forecasts are for a place that no longer exists, and then sometimes they are right',
         acts={'2': 'wx_vegas_auto', '3': 'wx_vegas_auto'}),
    acct('bot_bus', 'Route109_Arrivals', 'Route 109 Arrivals', 'bot', None, 'the bus',
         voice='the bus line\'s arrival board, still counting down to a bus that does not come',
         acts={'2': None, '3': None}),
    acct('bot_gm', 'gm_sats_daily', 'gm sats daily', 'bot', None, 'crypto',
         voice='a crypto-era good-morning bot posting a price from the week the dollar died',
         acts={'2': None, '3': None}),
]
