#!/usr/bin/env python3
"""TWELVE MORE THINGS ON THE ROAD (WORLD 14, 11/10; VAMILY rule 443(b); the overworld law: a face, two or three choices, never in
the first minute, nothing pops up without a mouth).

Appends WORLD 14's events to records/target/BOHEMIA_ROAD_EVENTS.json (the one file a modder edits; CONTENT's 45 stay byte for byte).
Battle Brothers' event kinds first (reference/library/battle_brothers/08_CONTRACTS_EVENTS.md): the COMPANY's own events (a man steals
from the box, the food spoils, two men fight, a man is called home), the INJURY events, and location events of the collapse. Each is of
the economic collapse in the valley, realism first, each with a real consequence; plain English (the player never speaks Spanglish, and
from 11/10 no new Spanglish lines at all). Words draft:true. The new vocabulary (needs.crew, needs.place, fx.wound, fx.leaves, fx.open) is
read by slices/bohemia_road_more.js through the marked seam in slices/bohemia_road_events.js.

    python3 tools/bohemia_world14_road_events_data.py          write
    python3 tools/bohemia_world14_road_events_data.py --check  exit 1 if the file would change
"""
import json, os, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FILE = os.path.join(ROOT, 'records/target/BOHEMIA_ROAD_EVENTS.json')
FIRST = 'ev_the_short_box'

def ev(id_, kind, who, says, opts, where=('any',), when='any', weight=2, needs=None, once=None, head=None):
    e = {'id': id_, 'lane': 'WORLD 14', 'kind': kind, 'who': who, 'where': list(where), 'when': when, 'weight': weight}
    if head: e['head'] = head
    if once is not None: e['once'] = once
    if needs: e['needs'] = needs
    e['says'] = says
    e['opts'] = opts
    e['draft'] = True
    return e

MAN = {'name': '{man}', 'look': '{man_look}'}
EVENTS = [
  # ---- THE COMPANY'S OWN (Battle Brothers: a man takes the crowns, the food spoils, two men fight, a man is called away) ----
  ev('ev_the_short_box', 'company', dict(MAN, **{'from': 'at the battery box, at the night stop'}),
     "Boss, the battery box is light. Six short. I counted twice. It was me. My sister in Henderson has a boy on an oxygen machine, "
     "and the machine eats batteries. I was going to tell you.",
     [{'t': 'Let the batteries go. It is a kid.', 'fx': {'bats': -6, 'say': "{man} sends them south with the next cart. No thank you. None needed."}},
      {'t': "Take it out of {man}'s share.", 'fx': {'chance': {'p': 0.5,
          'yes': {'say': "{man} pays it back over a week and never says another word about it."},
          'no': {'bats': -6, 'leaves': {'name': '{man}'}, 'say': "In the morning {man}'s bedroll is gone, and six more batteries with it."}}}},
      {'t': 'Throw {man} out of the company.', 'fx': {'leaves': {'name': '{man}'}, 'bats': 4, 'say': "{man} goes with nothing but the clothes on. Four of the six are still in the bedroll."}}],
     needs={'crew': {'n': 1}, 'min_day': 2}, head='IN THE COMPANY'),
  ev('ev_the_swollen_cans', 'company', dict(MAN, **{'from': 'at the wagon, in the morning'}),
     "Six of the cans from the last town are swelling at the ends. My grandmother said a can that swells will kill you, and she lived "
     "through the last time the money went bad.",
     [{'t': 'Throw out every swollen can.', 'fx': {'food': -3, 'say': "Three nights of food into a ditch. Nobody gets sick."}},
      {'t': 'Boil them hard for ten minutes and eat them.', 'fx': {'mins': 60, 'chance': {'p': 0.8,
          'yes': {'say': "Boiled long and eaten fast. Boiling kills the poison, the cook says. Nobody gets sick, and the food is kept."},
          'no': {'wound': {'name': '{man}', 'hp': 18}, 'say': "{man} is sick all night: the cramps, then the double vision. {man} will be weak for days."}}}},
      {'t': 'Eat them as they are.', 'fx': {'chance': {'p': 0.5,
          'yes': {'say': "They taste like tin. Nobody gets sick, this time."},
          'no': {'wound': {'name': '{man}', 'hp': 30}, 'say': "By morning {man} cannot stand up straight. It will be days before {man} can fight."}}}}],
     needs={'crew': {'n': 1}}, head='IN THE COMPANY'),
  ev('ev_the_old_job', 'company', dict(MAN, **{'from': 'looking down a dead road'}),
     "See that road? I drove it every day, to {place}. Nobody has been in there since the lights went. I know the side door and where "
     "they kept the keys. It is about {blocks} blocks from here.",
     [{'t': 'Mark it on the map. We will go there.', 'fx': {'open': {'id': '{place_id}'}, 'say': "{man} draws it in the dirt for everybody: the side door, the loading dock, the bend in the road. {place} is on your map now."}},
      {'t': 'Forget it. We have work.', 'fx': {'say': "{man} looks down the road a while longer, then picks up the pack."}}],
     needs={'crew': {'n': 1}, 'place': {'hidden': True}}, head='IN THE COMPANY'),
  ev('ev_the_last_canteen', 'company', dict(MAN, **{'from': 'at the water cans, before dawn'}),
     "{other} drank the last of the water in the night, boss, my share too. I am going to break {other}'s face unless you tell me "
     "why I should not.",
     [{'t': 'Split two nights of water between everybody.', 'fx': {'food': -2, 'say': "Everybody drinks. Nobody fights. The cans stay full another day."}},
      {'t': 'Let them settle it.', 'fx': {'wound': {'name': '{other}', 'hp': 14}, 'say': "It is over in a minute. {other} has a split lip and a rib that hurts to breathe on for a few days."}}],
     needs={'crew': {'n': 2}}, head='IN THE COMPANY'),
  ev('ev_the_word_from_home', 'company', dict(MAN, **{'from': 'at the fire, with a letter'}),
     "A man came through from Pahrump. My mother and my two sisters are still out there. He says the wells went dry on their street and "
     "the ranch stopped selling to them. I have to go to them, boss. Or I have to send them something.",
     [{'t': 'Go. Take two nights of food for the road.', 'fx': {'leaves': {'name': '{man}'}, 'food': -2, 'say': "{man} shakes every hand in the company and walks west at first light."}},
      {'t': 'Send them five batteries with the next cart.', 'fx': {'bats': -5, 'say': "Five batteries go west with a cart driver {man} trusts. {man} stays."}},
      {'t': 'Say the company needs every hand.', 'fx': {'chance': {'p': 0.5,
          'yes': {'say': "{man} stays, and does not sleep much."},
          'no': {'leaves': {'name': '{man}'}, 'bats': -5, 'say': "In the morning {man}'s bedroll is gone, and five batteries with it."}}}}],
     needs={'crew': {'n': 1}, 'min_day': 3}, once=True, head='IN THE COMPANY'),
  ev('ev_the_plasma_van', 'injury', {'name': 'THE PLASMA VAN', 'look': 'cast_shortcoat', 'from': 'a van with a generator, by the road'},
     "Four batteries a pint, paid on the cot. We test you first. The hospitals on the Strip buy everything we take. {man} there "
     "looks healthy. Up and walking again by tomorrow.",
     [{'t': '{man} sells a pint.', 'fx': {'mins': 60, 'bats': 4, 'wound': {'name': '{man}', 'hp': 10}, 'say': "An hour on a cot. {man} comes back pale and four batteries heavier, and will be slow for a day."}},
      {'t': 'Not today.', 'fx': {'say': "The man in the van shrugs. There is a line behind you."}}],
     where=('paved',), when='day', needs={'crew': {'n': 1}}),
  # ---- THE ROAD IN THE COLLAPSE (Battle Brothers' location events, the valley's own) ----
  ev('ev_the_rent_crew', 'location', {'name': 'A WOMAN ON HER STEP', 'look': 'cast_skirt', 'from': 'outside a house on a cul-de-sac'},
     "The bank sold the whole street to a man with a crew, and the crew collects rent in batteries now. Three a week. I paid it for "
     "three years. This week I do not have it, so they are taking the door off.",
     [{'t': 'Pay her rent.', 'fx': {'bats': -3, 'mood': {'act': 'favor', 'place': 'near'}, 'say': "The crew counts the three twice and puts the door back on. The street saw you do it."}},
      {'t': 'Run the rent crew off.', 'fx': {'fight': {'foe': 'brigands', 'n': 2, 'label': 'the rent crew',
          'win': {'bats': 6, 'mood': {'act': 'favor', 'place': 'near'}, 'say': "Their week's take, six batteries, and the door stays on."},
          'lose': {'bats': -3, 'say': "They took her rent out of your pocket instead."}}}},
      {'t': 'Walk on.', 'fx': {'say': "The door comes off behind you."}}],
     where=('paved',), when='day', weight=3),
  ev('ev_the_green_pool', 'location', {'name': 'A MAN WITH A BUCKET', 'look': 'cast_shorts', 'from': 'at a foreclosed house with a green pool'},
     "Every house on this street was foreclosed in the first crash, and nobody ever drained the pools. Now they are the only water for "
     "a mile. Green, full of mosquitoes. You can have some if you carry it.",
     [{'t': 'Boil two nights of it for the wagon.', 'fx': {'mins': 120, 'food': 2, 'say': "Two hours over a fire made of a fence. It tastes like the bottom of a pool. It is water."}},
      {'t': 'Fill up and drink it as it is.', 'fx': {'food': 3, 'chance': {'p': 0.6,
          'yes': {'say': "Nobody gets sick. This time."},
          'no': {'wound': {'name': '{man}', 'hp': 16}, 'say': "{man} is burning up by night. The mosquitoes, or the water."}}}}],
     where=('paved',), when='day', needs={'crew': {'n': 1}}),
  ev('ev_the_copper_men', 'location', {'name': 'A MAN ON A LADDER', 'look': 'cast_barearms', 'from': 'at the top of a streetlight'},
     "There is copper wire in every one of these poles, and copper trades for batteries at the scrap yard. The lights have not been on "
     "in years. Help me strip the block and we split it.",
     [{'t': 'Help him strip the block.', 'fx': {'mins': 180, 'bats': 4, 'mood': {'act': 'minor_offensive_action', 'place': 'near'},
          'say': "Three hours of wire, four batteries at the scrap yard. The street is darker than it was, and the people on it know who did it."}},
      {'t': 'Tell him to leave the poles alone.', 'fx': {'mood': {'act': 'favor', 'place': 'near'}, 'say': "He climbs down and spits. Somebody on the corner nods at you."}}],
     where=('paved',), when='day'),
  ev('ev_the_timeshare_man', 'location', {'name': 'A MAN IN A POLO SHIRT', 'look': 'cast_shortcoat', 'from': 'outside a resort with no roof'},
     "Folks! Ninety minutes of your time and breakfast is on us. Real eggs: we keep chickens on the roof now. Vacation ownership is "
     "still the smartest money in Nevada. Ask me about week thirty-two.",
     [{'t': 'Sit through the pitch for the breakfast.', 'fx': {'mins': 120, 'food': 2, 'say': "Ninety minutes that take two hours. The eggs are real. He shakes every hand twice."}},
      {'t': 'Buy week thirty-two.', 'fx': {'bats': -10, 'say': "He hands you the deed to week thirty-two of room 1411. The room has no wall on one side. He calls it the view."}},
      {'t': 'Walk on.', 'fx': {'say': "He calls after you that the offer ends today. It has ended today for eleven years."}}],
     where=('paved',), when='day'),
  ev('ev_the_picket_line', 'location', {'name': 'A WOMAN WITH A SIGN', 'look': 'cast_apron', 'from': 'on the picket line outside a casino'},
     "The casino pays us in its own chips now. Good at its buffet and its store and nowhere else, and the buffet doubled its prices. "
     "So we stopped working. Do not cross the line. If you have food, we are on day nineteen.",
     [{'t': 'Give the line two nights of food.', 'fx': {'food': -2, 'mood': {'act': 'favor', 'place': 'near'}, 'say': "They pass it down the line. Somebody writes your company's name on a sign."}},
      {'t': 'Cross the line and sell to the casino.', 'fx': {'bats': 3, 'mood': {'act': 'minor_offensive_action', 'place': 'near'}, 'say': "The casino's store pays well for what you carry. On the way out, nobody on the line looks at you."}},
      {'t': 'Walk on.', 'fx': {'say': "Day nineteen. She turns back to the line."}}],
     where=('paved',), when='day'),
  ev('ev_the_dead_atm', 'location', {'name': 'A WOMAN AT A BANK MACHINE', 'look': 'cast_satchel', 'from': 'on a dead corner'},
     "It still has power. A battery inside it, I think. Every morning I put my card in and it says my balance is zero, and every "
     "morning I believe it a little less. Open it if you want. I only want to see it say something else.",
     [{'t': 'Pry the machine open.', 'fx': {'mins': 60, 'bats': 3, 'say': "Inside: forty thousand in twenties and the machine's own battery, still good. You take the battery. The screen goes dark in the middle of a word."}},
      {'t': 'Leave her to her machine.', 'fx': {'say': "Behind you the machine asks her if she would like a receipt."}}],
     where=('paved',), when='any'),
]

# ---- 11/11 (the coordinator's round, batch two): twelve that touch HIS PLACE, THE BOSSES and HIS JOBS; every choice costs something ----
HOME = 'FOR YOUR PLACE'
EVENTS += [
  ev('ev_the_family_at_the_door', 'location', {'name': 'A WOMAN WITH TWO KIDS', 'look': 'cast_skirt', 'from': 'on the road out of {home}'},
     "We lost the house in the first year of the crash and the car in the second. People say you have walls at {home}. I can cook for "
     "twenty and keep a ledger. The kids carry water. We do not need much, only a door that locks.",
     [{'t': 'Take them in at {home}.', 'fx': {'food': -2, 'home': {'kind': 'person', 'name': 'THE WIDOW AND HER TWO', 'look': 'cast_skirt',
        'says': 'She keeps the ledger. The kids carry the water up before anybody else is awake.'},
        'say': "Two nights of food for the walk, and a door at {home}. She asks where the ledger is before she asks where she sleeps."}},
      {'t': 'Give them two nights of food and point them to the shelter.', 'fx': {'food': -2, 'mood': {'act': 'favor', 'place': 'near'},
        'say': "She counts the food twice and thanks you once. The kids are already walking."}}],
     needs={'home': {'planted': True}}, once=True, head=HOME),
  ev('ev_the_solar_cart', 'location', {'name': 'A MAN WITH A SHOPPING CART', 'look': 'cast_bedroll', 'from': 'pushing a solar panel down the middle of the road'},
     "Pulled it off a foreclosed roof in Summerlin, the bank's notice still taped to the door. A panel lasts thirty years and this one "
     "has twenty left in it. I will walk it all the way to {home} myself.",
     [{'t': 'Pay him ten batteries for the panel.', 'fx': {'bats': -10, 'home': {'kind': 'build', 'build': 'solar', 'name': 'A ROOFTOP PANEL'},
        'say': "He pushes the cart toward {home} without being asked twice. The bank's notice is still stuck to the back of the panel."}},
      {'t': 'Trade him four nights of food for it.', 'fx': {'food': -4, 'home': {'kind': 'build', 'build': 'solar', 'name': 'A ROOFTOP PANEL'},
        'say': "Food, not batteries: he eats the first can before he lets go of the cart."}}],
     needs={'home': {}}, once=True, head=HOME, where=('paved',)),
  ev('ev_the_water_tank', 'location', {'name': 'A WATER HAULER', 'look': 'cast_barearms', 'from': 'with a tank on a trailer and no truck'},
     "The water district lost its pressure above the second floor everywhere west of Rainbow. A tank on a roof is water for a month. I "
     "pulled this one four miles by hand and I cannot pull it one more block.",
     [{'t': 'Buy the tank for {home}.', 'fx': {'bats': -6, 'home': {'kind': 'build', 'build': 'tank', 'name': 'A ROOF TANK'},
        'say': "Six batteries and a handshake. He shows you how to bleed the air out of the line before he goes."}},
      {'t': 'Help him pull it to the next town for a share.', 'fx': {'mins': 180, 'bats': 3, 'mood': {'act': 'favor', 'place': 'near'},
        'say': "Three hours of pulling. He sells the water by the bucket at {town} and pays you three batteries out of the first bucket."}}],
     needs={'home': {}}, once=True, head=HOME),
  ev('ev_the_seed_library', 'location', {'name': 'A LIBRARIAN', 'look': 'cast_shortcoat', 'from': 'with a card catalogue drawer full of seed packets'},
     "The library lent seeds before it stopped lending books. Squash, tepary beans, chiles, the ones that take the heat. The rule was "
     "you bring back seeds from what you grow. Nobody has brought any back.",
     [{'t': 'Take a drawer of seeds for a garden at {home}.', 'fx': {'bats': -3, 'home': {'kind': 'build', 'build': 'garden', 'name': 'THE SEED LIBRARY GARDEN'},
        'say': "Three batteries for the library, she says, and writes your name on the card in pencil. Due back next year."}},
      {'t': 'Carry the catalogue to the next town for her.', 'fx': {'mins': 120, 'mood': {'act': 'favor', 'place': 'near'},
        'say': "Two hours with a drawer under each arm. At {town} she sets the catalogue on a table and opens for business."}}],
     needs={'home': {}}, once=True, head=HOME),
  ev('ev_the_runaway_cook', 'location', {'name': 'A MAN WHO RAN FROM {boss}', 'look': 'cast_apron', 'from': 'hiding in a drainage ditch'},
     "I worked for {boss} at {boss_place}. Everybody does, or they leave the valley. I know the way in and where the men sleep. I want "
     "food and to be far from here before anybody knows I talked.",
     [{'t': 'Give him two nights of food for the way in.', 'fx': {'food': -2, 'boss': {'find': True},
        'say': "He draws it in the dirt with a stick: the gate, the yard, the room where {boss} sleeps. Then he is gone up the wash."}},
      {'t': 'Give him five batteries to get out of the valley.', 'fx': {'bats': -5, 'boss': {'find': True}, 'mood': {'act': 'favor', 'place': 'near'},
        'say': "Five batteries buys a seat on a cart to Barstow. He tells you everything about {boss_place} on the way to the cart."}},
      {'t': 'Hand him back to the men of {boss} for the reward.', 'fx': {'bats': 4, 'mood': {'act': 'minor_offensive_action', 'place': 'near'},
        'say': "Four batteries. Nobody in {town} will look at you the same way, and the man does not look at you at all."}}],
     needs={'boss': {'sign': True}}, head='ABOUT {boss}'),
  ev('ev_the_assessors_map', 'location', {'name': 'A MAN SELLING MAPS', 'look': 'cast_satchel', 'from': 'with a roll of county maps under his arm'},
     "The county assessor's maps, every parcel in the valley, printed the week before the servers went dark. I marked where {boss} sits. "
     "It is about {boss_blocks} blocks from here. Paper does not need a signal.",
     [{'t': 'Buy the map for four batteries.', 'fx': {'bats': -4, 'boss': {'find': True},
        'say': "Parcel numbers, lot lines, and a red circle around {boss_place} in ballpoint."}},
      {'t': 'Trade him two hours of carrying for it.', 'fx': {'mins': 120, 'boss': {'find': True},
        'say': "Two hours hauling his rolls of paper to {town}. He pays with the map that has the red circle on it."}}],
     needs={'boss': {'sign': True}}, head='ABOUT {boss}', where=('paved',)),
  ev('ev_the_roadblock', 'location', {'name': 'THE MEN OF {boss}', 'look': 'cast_cape', 'from': 'at a roadblock of shopping carts and tires'},
     "This road belongs to {boss} from here to {boss_place}. Everybody pays to use it. Four batteries for the lot of you, or turn around "
     "and go the long way.",
     [{'t': 'Pay the toll.', 'fx': {'bats': -4, 'say': "They roll one cart out of the way and roll it back behind you."}},
      {'t': 'Go the long way around.', 'fx': {'mins': 150, 'say': "Two and a half hours around through the washes. Their fire is still burning when you look back."}},
      {'t': 'Break the roadblock.', 'fx': {'fight': {'foe': 'brigands', 'n': 3, 'label': 'the roadblock of {boss}',
        'win': {'bats': 6, 'mood': {'act': 'favor', 'place': 'near'}, 'say': "The carts go into the ditch and the tolls in their can go into your wagon."},
        'lose': {'bats': -4, 'say': "They take the toll anyway, and more for the trouble."}}}}],
     needs={'boss': {'found': True}}, head='ABOUT {boss}', where=('paved',)),
  ev('ev_the_leaderless', 'location', {'name': 'A MAN WHO FOUGHT FOR {boss}', 'look': 'cast_cape', 'from': 'on the curb with his rifle across his knees'},
     "{boss} is dead and the rest of us have nobody to pay us. I can shoot and I know every room of {boss_place}. Feed me and I will "
     "shoot for you instead.",
     [{'t': 'Take him on.', 'fx': {'food': -3, 'man': {'n': 1, 'name': 'THE LAST MAN OF {boss}', 'bg': 'retired_soldier', 'look': 'cast_cape'},
        'say': "Three nights of food up front. He hands you the rifle to hold while he eats, and asks for it back after."}},
      {'t': 'Pay him to take the rest of them out of the valley.', 'fx': {'bats': -6, 'mood': {'act': 'favor', 'place': 'near'},
        'say': "Six batteries. By morning eleven men are walking north on the 95 with their rifles slung, and the street is quiet."}}],
     needs={'boss': {'fallen': True}}, once=True, head='ABOUT {boss}'),
  ev('ev_the_clients_runner', 'location', {'name': 'A RUNNER FROM {job_from}', 'look': 'cast_pack', 'from': 'out of breath on the shoulder'},
     "{job_from} sent me about your job: {job}. They need it sooner than you said. If you push, they will remember it. If you do not, they "
     "will remember that too.",
     [{'t': 'Push on through the night.', 'fx': {'food': -2, 'mood': {'act': 'favor', 'place': 'faction:{job_from}'},
        'say': "Extra rations to keep the men on their feet. The runner goes back to {job_from} with the word that you are coming."}},
      {'t': 'Tell them it takes what it takes.', 'fx': {'mood': {'act': 'negotiation_fail', 'place': 'faction:{job_from}'},
        'say': "The runner writes it down word for word. {job_from} will read it out loud, he says."}}],
     needs={'job': {'held': True}}, head='ABOUT YOUR JOB'),
  ev('ev_the_rival_crew', 'location', {'name': 'A CREW BOSS ON A MOTORBIKE', 'look': 'cast_shortcoat', 'from': 'idling across the road'},
     "Heard {job_from} gave you their job: {job}. They gave it to us first, before you came along. Walk away and nobody gets hurt. Or pay "
     "us to walk away. Your call.",
     [{'t': 'Pay them to leave it.', 'fx': {'bats': -4, 'say': "Four batteries in his saddlebag. The motorbike goes the other way, and so does his crew."}},
      {'t': 'Run them off.', 'fx': {'fight': {'foe': 'brigands', 'n': 2, 'label': 'the rival crew',
        'win': {'bats': 3, 'mood': {'act': 'favor', 'place': 'faction:{job_from}'}, 'say': "They leave the motorbike's battery behind. {job_from} hears who kept their job."},
        'lose': {'bats': -4, 'say': "They take four batteries and laugh about it. The job is still yours, if you can still do it."}}}}],
     needs={'job': {'held': True}}, head='ABOUT YOUR JOB', where=('paved',)),
  ev('ev_the_underpass', 'location', {'name': 'A KID ON A ROOF', 'look': 'cast_bedroll', 'from': 'waving from a carport'},
     "There are men waiting at the underpass for whoever comes through on business for {job_from}. They have been there since morning. "
     "Two batteries and I show you the long way around.",
     [{'t': 'Pay the kid and go the long way.', 'fx': {'bats': -2, 'mins': 120, 'say': "Two hours of back yards and broken fences. You never see the underpass."}},
      {'t': 'Go through the underpass anyway.', 'fx': {'chance': {'p': 0.5,
        'yes': {'say': "Nobody at the underpass but a burned-out car. The kid was lying, or they got bored."},
        'no': {'wound': {'name': '{man}', 'hp': 14}, 'say': "A shot from the dark at the far end. {man} is hit in the arm before you are through."}}}}],
     needs={'job': {'held': True}, 'crew': {'n': 1}}, head='ABOUT YOUR JOB'),
  ev('ev_the_letter_for_the_client', 'location', {'name': 'AN OLD MAN AT A BUS STOP', 'look': 'cast_shortcoat', 'from': 'at a bus stop with no buses'},
     "You are working for {job_from}? My daughter lives there. I have not heard from her since the phones went. Take this letter to her. "
     "Her name is on it.",
     [{'t': 'Carry the letter.', 'fx': {'mins': 30, 'mood': {'act': 'favor', 'place': 'faction:{job_from}'},
        'say': "Half an hour while he writes one more line at the bottom. {job_from} will know who brought it."}},
      {'t': 'Tell him you cannot.', 'fx': {'mood': {'act': 'negotiation_fail', 'place': 'near'},
        'say': "He puts the letter back in his coat and keeps waiting for the bus."}}],
     needs={'job': {'held': True}}, head='ABOUT YOUR JOB', where=('paved',)),
]

MORE_ABOUT = ("WORLD 14 (11/10, VAMILY rule 443(b)): twelve more rows, each with 'lane' WORLD 14 and its Battle Brothers 'kind' (company: his own "
              "men; location: the road). New words a row may use, read by slices/bohemia_road_more.js through the seam in "
              "slices/bohemia_road_events.js: needs.crew {n: 1 or 2, bg: [trades]} (one or two of HIS men, never YOU: {man}, {man_look}, {man_bg}, "
              "{other}, {other_look}; the speaker may be his own man, who.name '{man}'); needs.place {hidden: true} (a real place of "
              "records/target/bb/real_places.json still under the fog: {place}, {place_id}, {blocks}); fx.wound {name, hp} (that man loses the "
              "hitpoints, kept by the company's condition record, mended by the clock and the camp); fx.leaves {name} (he leaves the company); "
              "fx.open {id} (the place's fog lifts and it is named on the map); 'head' the card's top line. Written by "
              "tools/bohemia_world14_road_events_data.py; gate gates/twelve_more_on_the_road_gate.js. 11/11, twelve more (his place, the bosses, "
              "his jobs): needs.home {planted: true} or {} ({home}, {home_blocks}); needs.boss {sign | found | fallen} ({boss}, {boss_place}, "
              "{boss_blocks}); needs.job {held: true} ({job}, {job_from}, {job_pay}); fx.home {kind, name, build | look | gives | says} (a gift to "
              "his place through HOME BASE's own seam; it waits until he plants); fx.boss {find: true} (the boss's sign read: found, his place "
              "out of the dark). Gate gates/the_road_knows_his_place_gate.js.")

def build(t):
    k = t.find('\n    {"id": "' + FIRST + '"')
    if k >= 0:   # cut our old block (we are always last): from the comma before our first row to the list's end
        c = t.rfind(',', 0, k); end = t.rindex('\n  ]')
        t = t[:c] + t[end:]
    end = t.rindex('\n  ]')
    rows = ''.join(',\n    ' + json.dumps(e, ensure_ascii=False) for e in EVENTS)
    t = t[:end] + rows + t[end:]
    import re as _re
    if '"more_about"' not in t:
        t = t.replace('\n  "events": [', '\n  "more_about": ' + json.dumps(MORE_ABOUT, ensure_ascii=False) + ',\n  "events": [', 1)
    else:   # 11/11: the words a row may use grew; the line is rewritten in place
        t = _re.sub(r'\n  "more_about": "(?:[^"\\]|\\.)*",', lambda m: '\n  "more_about": ' + json.dumps(MORE_ABOUT, ensure_ascii=False) + ',', t, count=1)
    return t

if __name__ == '__main__':
    t0 = open(FILE, encoding='utf-8').read()
    t1 = build(t0)
    json.loads(t1)
    if '--check' in sys.argv:
        print('the twelve are ' + ('written' if t1 == t0 else 'NOT written')); sys.exit(0 if t1 == t0 else 1)
    open(FILE, 'w', encoding='utf-8').write(t1)
    print('wrote %d rows' % len(EVENTS))
