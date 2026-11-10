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

MORE_ABOUT = ("WORLD 14 (11/10, VAMILY rule 443(b)): twelve more rows, each with 'lane' WORLD 14 and its Battle Brothers 'kind' (company: his own "
              "men; location: the road). New words a row may use, read by slices/bohemia_road_more.js through the seam in "
              "slices/bohemia_road_events.js: needs.crew {n: 1 or 2, bg: [trades]} (one or two of HIS men, never YOU: {man}, {man_look}, {man_bg}, "
              "{other}, {other_look}; the speaker may be his own man, who.name '{man}'); needs.place {hidden: true} (a real place of "
              "records/target/bb/real_places.json still under the fog: {place}, {place_id}, {blocks}); fx.wound {name, hp} (that man loses the "
              "hitpoints, kept by the company's condition record, mended by the clock and the camp); fx.leaves {name} (he leaves the company); "
              "fx.open {id} (the place's fog lifts and it is named on the map); 'head' the card's top line. Written by "
              "tools/bohemia_world14_road_events_data.py; gate gates/twelve_more_on_the_road_gate.js.")

def build(t):
    k = t.find('\n    {"id": "' + FIRST + '"')
    if k >= 0:   # cut our old block (we are always last): from the comma before our first row to the list's end
        c = t.rfind(',', 0, k); end = t.rindex('\n  ]')
        t = t[:c] + t[end:]
    end = t.rindex('\n  ]')
    rows = ''.join(',\n    ' + json.dumps(e, ensure_ascii=False) for e in EVENTS)
    t = t[:end] + rows + t[end:]
    if '"more_about"' not in t:
        t = t.replace('\n  "events": [', '\n  "more_about": ' + json.dumps(MORE_ABOUT, ensure_ascii=False) + ',\n  "events": [', 1)
    return t

if __name__ == '__main__':
    t0 = open(FILE, encoding='utf-8').read()
    t1 = build(t0)
    json.loads(t1)
    if '--check' in sys.argv:
        print('the twelve are ' + ('written' if t1 == t0 else 'NOT written')); sys.exit(0 if t1 == t0 else 1)
    open(FILE, 'w', encoding='utf-8').write(t1)
    print('wrote %d rows' % len(EVENTS))
