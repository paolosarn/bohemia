#!/usr/bin/env python3
"""ECONOMY [the first bullets] 10/19 -- the first week and the first hour, day by day (a research calculator, not a gate).

Reads banks/BOHEMIA_ECONOMY_FIRST_BULLETS_10_19_26.json (written by tools/bohemia_economy_first_bullets.js, the live fight
played headless with guns in the crew's hands) and works Day 76's books for a new crew of three: the canon wage (1 a man a
day), food and water at the ration counter (6 a day) after Day 76's nine seeded days, the door's THIN 240, half the first
job on the handshake, the board's 30 / 60 / 90 (THIN), rounds out of the pile after each fight and topped up at five a
battery when short. Prints the tables of records/BOHEMIA_ECONOMY_DAY_78_THE_FIRST_BULLETS_10_19_26.md section 5.

  python3 tools/bohemia_economy_first_bullets_ledger.py
"""
import json, os

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
B = json.load(open(os.path.join(ROOT, 'banks/BOHEMIA_ECONOMY_FIRST_BULLETS_10_19_26.json')))['felt']
GUNS = {'bb': 1, 'two': 2, 'three': 3, 'shotgun': 3}
PAY = {1: 30, 2: 60, 3: 90}
SC = {1: 'job1', 2: 'job2', 3: 'job3'}
SCHED = {'steady': {3: 1, 5: 1, 7: 2, 9: 2, 11: 3}, 'busy': {d: (1 if d < 5 else 2 if d < 9 else 3) for d in range(2, 12)}}
PRICE, WAGE, FOODWATER, SEEDED, PURSE, HOUR = 0.2, 3, 6, 9, 240, 11


def v(sc, kit, hand, k):
    return B[sc + '|' + kit + '|' + hand][k]


def hour(kit, hand, sched, start, use='shots_per_fight', points=False, search=0, lose_all=False):
    key = 'bb_points_per_fight' if points else use
    pile, cash, bought, dry, low, paid, first, week = start, PURSE, 0.0, None, PURSE, 0.0, True, None
    for d in range(1, HOUR + 1):
        cash -= WAGE + (0 if d <= SEEDED else FOODWATER)
        if d in SCHED[sched]:
            s = SCHED[sched][d]
            won = 0.0 if lose_all else v(SC[s], kit, hand, 'won_in_100') / 100.0
            got = PAY[s] / 2 + won * PAY[s] / 2 if first else won * PAY[s]
            first = False
            cash += got
            paid += got
            pile += search * v(SC[s], kit, hand, 'enemies') * won
            pile -= v(SC[s], kit, hand, key)
            if pile < 0:
                dry = dry or d
                bought += -pile
                cash -= -pile * PRICE
                pile = 0
        if d == 7:
            week = round(bought * PRICE, 1)
        low = min(low, cash)
    return {'week_batteries': week, 'hour_batteries': round(bought * PRICE, 1), 'dry_day': dry, 'rounds_left': round(pile, 1),
            'lowest_purse': round(low, 1), 'purse_day_11': round(cash, 1), 'paid': round(paid, 1)}


if __name__ == '__main__':
    lows = []
    print('5a / 5c: start, schedule, kit -> mean | bad luck (p90 every fight)')
    for start_name, per in (('zero', 0), ('40 a company', None), ('40 a gun', 40), ('50 a gun', 50), ('60 a gun', 60), ('80 a gun', 80)):
        for sched in ('steady', 'busy'):
            for kit in ('bb', 'two', 'three', 'shotgun'):
                st = 40 if per is None else per * GUNS[kit]
                a, p = hour(kit, 'auto', sched, st), hour(kit, 'auto', sched, st, 'shots_p90')
                lows += [a['lowest_purse'], p['lowest_purse']]
                print(f"{start_name:12} {sched:6} {kit:8} dry {a['dry_day']}/{p['dry_day']}  week {a['week_batteries']}/{p['week_batteries']}"
                      f"  hour {a['hour_batteries']}/{p['hour_batteries']}  lowest {a['lowest_purse']}/{p['lowest_purse']}")
    print('\nBattle Brothers itself, its one shooter (our pipe, pipe, rifle), Low 20 / Medium 40 / High 80')
    for st in (20, 40, 80):
        for sched in ('steady', 'busy'):
            a, p = hour('bb', 'auto', sched, st), hour('bb', 'auto', sched, st, 'shots_p90')
            print(f"  {st:3} {sched:6} dry {a['dry_day']}/{p['dry_day']}")
    print('\n5d / 5e: the body search (six a body) and the careful hand, 40 a gun')
    for sched in ('steady', 'busy'):
        for kit in ('bb', 'two', 'three'):
            for hand in ('auto', 'careful'):
                for search in (0, 6):
                    r = hour(kit, hand, sched, 40 * GUNS[kit], search=search)
                    lows.append(r['lowest_purse'])
                    print(f"  {sched:6} {kit:6} {hand:7} search {search}: {r}")
    print('\n6.1: the shotgun crew at 120, one round a shot against Battle Brothers\' points')
    for sched in ('steady', 'busy'):
        print(f"  {sched}: A left {hour('shotgun', 'auto', sched, 120)['rounds_left']}, B left {hour('shotgun', 'auto', sched, 120, points=True)['rounds_left']}")
    w = min(hour(k, 'auto', 'busy', 0, 'shots_p90', lose_all=True)['purse_day_11'] for k in GUNS)
    print(f"\n5b: lowest purse in any cell above: {min(lows)}; the worst week on purpose (busy, zero rounds, bad luck, every fight lost): {w}")
