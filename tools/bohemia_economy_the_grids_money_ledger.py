#!/usr/bin/env python3
"""ECONOMY [the grid's money] 10/19 -- what each fight size costs and pays (a research calculator, not a gate; rule 117(e)).

Reads banks/BOHEMIA_ECONOMY_THE_GRIDS_MONEY_10_19_26.json (tools/bohemia_economy_first_bullets.js --grid: the live fight,
TUNING's companies 1, 3, 6, 12, 14 against a job the map sizes at 1, 2, 3 skulls and against 3, 6, 12, 20, 38) and works
each cell's money, ours and Battle Brothers' beside it:

  CASH A FIGHT   rounds (shots x 0.2, five a battery, Day 69 / Day 78) + medicine (heal days x one dose, ONE, Day 69)
                 + the dead replaced (a hire, Battle Brothers' base 30 to 150 crowns at ten to one: 9 the middle)
  THE MEN OFF THE LINE  laid-up man-days a fight (ours.struck_down_laid_up_days 30 to 40, his 9/27) x a man's upkeep
                 (his wage + a ration + four litres: what the company pays him while he cannot fight)
  THE BURN       the company a day: the roster screen's wage (a background's daily wage over ten, at least one; the Lone
                 Wolf's own man none, price_table.json lonewolfWage) + a ration and four litres a man (Day 69's counter, 2)
  THE PAY        the board's job (30 / 60 / 90 a skull, THIN; FULL x1.5) times the cell's win share; a fixed count is paid as
                 the biggest job the map would size at that count or under (party_math), else NOTHING ON THE BOARD PAYS IT
  THE CYCLE      a job every J days (2 and 4): net = pay - cash - J days of burn; the cells where it is under nought are
                 where a company goes broke, worst first. The laid-up upkeep is shown apart (it is inside the burn already:
                 the man is paid whether he fights or not; what it costs is the fighting he cannot do).
  BATTLE BROTHERS beside: the same fights (our fight is the bench for both), its burn (the wiki wage over ten with no floor,
                 grains 0.4 a man a day, no water), its pay (the one sourced contract, 610 + 10 a head x 15 = 760 crowns, 76
                 batteries, at any company size: 'clout changes the pay, skulls change the size', Day 63), no laid-up month
                 (a struck-down man is dead or carries a permanent injury and fights the next battle: bb_all/1540).

  python3 tools/bohemia_economy_the_grids_money_ledger.py
"""
import json, os

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
J = lambda f: json.load(open(os.path.join(ROOT, f)))
G = J('banks/BOHEMIA_ECONOMY_THE_GRIDS_MONEY_10_19_26.json')
F, PM = G['felt'], J('records/target/bb/party_math.json')
BG = {r['id']: r for r in J('records/target/bb/backgrounds.json')['rows']}
CREW = J('records/target/bb/ours.json')['crew']['value']
ORIG = {o['id']: o for o in J('records/target/bb/origins.json')['origins']}

ROUND, DOSE, HIRE, FOODWATER, BB_FOOD, BB_PAY = 0.2, 1, 9, 2, 0.4, 76
PAY = {1: 30, 2: 60, 3: 90}


def men(n):
    if n == 1: return [m['background'] for m in ORIG['wolf']['men']]
    if n == 3: return [m['background'] for m in ORIG['newcrew']['men']]
    return [CREW[i % len(CREW)]['background'] for i in range(n)]


def wage_ours(n):
    if n == 1: return 0   # the Lone Wolf's own man: price_table.json lonewolfWage 0 (the roster screen prints 4: Day 77's two engines)
    return sum(max(1, round((BG[b]['daily_wage'] or 10) / 10)) for b in men(n))


def wage_bb(n):
    if n == 1: return 0.0
    return sum((BG[b]['daily_wage'] or 0) / 10 for b in men(n))


def job_for(n, cnt):
    """the skulls the board pays for this cell: s1..s3 as named; a fixed count, the biggest job the map sizes at or under it"""
    if isinstance(cnt, str): return int(cnt[1:])
    P, R = PM['job']['value'], PM['roster_strength']['value']
    best = 0
    for s in (1, 2, 3):
        lv = 4 if n == 1 else 1
        st = n * (R['per_man'] + R['per_level'] * (lv - 1))
        c = max(P['min'], min(P['max'], int(st / P['strength_per_enemy'] * P['skull_mult'][str(s)] * PM['difficulty_count_mult']['value'][1] + 0.5)))
        if c <= cnt: best = s
    return best


def cell(n, cnt):
    f = F[f'{n}|{cnt}']
    won = f['won_in_100'] / 100
    sk = job_for(n, cnt)
    pay = PAY.get(sk, 0) * won
    cash = f['shots_per_fight'] * ROUND + f['heal_days_per_fight'] * DOSE + f['dead_per_fight'] * HIRE
    w, wb = wage_ours(n), wage_bb(n)
    burn, burn_bb = w + FOODWATER * n, wb + BB_FOOD * n
    upkeep = (w / n + FOODWATER) if n else 0
    off_line = f['laid_up_days_per_fight'] * upkeep
    pay_bb = BB_PAY * won if sk else 0
    cash_bb = f['shots_per_fight'] * ROUND + f['heal_days_per_fight'] * DOSE + f['dead_per_fight'] * HIRE
    return dict(n=n, cnt=cnt, enemies=f['enemies'], won=f['won_in_100'], skulls=sk, pay=round(pay, 1), cash=round(cash, 1),
                ammo=round(f['shots_per_fight'] * ROUND, 1), meds=round(f['heal_days_per_fight'] * DOSE, 1), dead=round(f['dead_per_fight'] * HIRE, 1),
                burn=burn, off_line=round(off_line, 1), laid_days=f['laid_up_days_per_fight'],
                net2=round(pay - cash - 2 * burn, 1), net4=round(pay - cash - 4 * burn, 1),
                days_bought=round(pay / burn, 2) if burn else None,
                burn_bb=round(burn_bb, 1), pay_bb=round(pay_bb, 1), net2_bb=round(pay_bb - cash_bb - 2 * burn_bb, 1),
                days_bought_bb=round(pay_bb / burn_bb, 2) if burn_bb else None)


if __name__ == '__main__':
    rows = [cell(n, c) for n in G['companies'] for c in G['counts']]
    print('company burn a day, ours / Battle Brothers:', {n: (wage_ours(n) + FOODWATER * n, round(wage_bb(n) + BB_FOOD * n, 1)) for n in G['companies']})
    print('\nn   band  enemies won skulls  pay  cash(ammo/meds/dead)  burn  net@2d net@4d  daysBought | BB: burn pay net@2d daysBought | laid-up man-days, upkeep')
    for r in rows:
        print(f"{r['n']:2} {str(r['cnt']):>4} {r['enemies']:7} {r['won']:3} {r['skulls']:6} {r['pay']:5} {r['cash']:5} ({r['ammo']}/{r['meds']}/{r['dead']})"
              f" {r['burn']:5} {r['net2']:7} {r['net4']:6} {str(r['days_bought']):>6} | {r['burn_bb']:5} {r['pay_bb']:5} {r['net2_bb']:7} {str(r['days_bought_bb']):>6}"
              f" | {r['laid_days']:7} {r['off_line']}")
    broke = sorted([r for r in rows if r['net2'] < 0], key=lambda r: r['net2'])
    print(f"\nbroke at a job every two days: {len(broke)} of {len(rows)} cells; worst first:")
    for r in broke[:12]:
        print(f"  {r['n']} v {r['enemies']} ({r['cnt']}): net {r['net2']} a job (BB {r['net2_bb']})")
    ok = [r for r in rows if r['net2'] >= 0]
    print('holds at two days:', [(r['n'], r['cnt'], r['net2']) for r in ok])
    ok4 = [r for r in rows if r['net4'] >= 0]
    print('holds at four days:', [(r['n'], r['cnt'], r['net4']) for r in ok4])
    print('BB holds at two days:', [(r['n'], r['cnt'], r['net2_bb']) for r in rows if r['net2_bb'] >= 0])
    print('\nTHE PAY THAT HOLDS: what a won job must pay so a job every two days breaks even (cash + 2 days of burn, over the win share)')
    for n in G['companies']:
        out = []
        for c in ('s1', 's2', 's3'):
            r = cell(n, c); f = F[f'{n}|{c}']; won = f['won_in_100'] / 100
            need = (r['cash'] + 2 * r['burn']) / won if won else None
            out.append(f"{c}: {round(need) if need else 'never wins'} (board {PAY[int(c[1:])]}; {round(need / n, 1) if need else '-'} a man)")
        print(f"  {n:2} men: " + '; '.join(out))
    print('\nONE MAN STRUCK DOWN, in upkeep while he cannot fight (35 days, the middle of 30 to 40):')
    for n in G['companies'][1:]:
        w = wage_ours(n) / n
        print(f"  {n:2} men: {round(35 * (w + FOODWATER), 1)} batteries (the one-skull job pays {PAY[1]})")
