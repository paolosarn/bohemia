#!/usr/bin/env python3
"""THE RED DEBT ONLY SHRINKS (PLUMBER 8, 11/10/26; the coordinator's routine 'PLUMBER 8: clear the red debt'; VAMILY rule 13, rule 441).

THE DEBT is gates/BOHEMIA_QUARANTINE.txt: every red on main that is named but not yet cleared, one line a gate
(NAME | OWNER | SINCE | WHY). A red is CLEARED when its gate goes green (fixed, or re-aimed to a newer rule), when its gate is retired
to graveyard/ with a post-mortem naming the ruling that killed what it guarded, or when it is a real game bug FILED as an ask row
(its WHY then starts 'FILED ask row N'): a filed red stays on the list until its bug is fixed, but it is no longer LEFT.

THE COUNT that can only shrink: NAMED (the lines on the list) and LEFT (the lines not FILED). The ratchet holds the last numbers
(gates/BOHEMIA_RED_DEBT_RATCHET.json); a run with more is red; a run with fewer says so and the next PLUMBER writes the new numbers
in the same commit as the clearing. The front page carries THE RED DEBT line with the same two numbers, so nobody reads an old count.

  D1 the list parses: every line names a gate in the table, an owner, a date and a reason (the runner's own reader)
  D2 NAMED and LEFT are not above the ratchet
  D3 VAMILY.md's THE RED DEBT line says the same two numbers
  P1 PLANTED: the list with one more red line turns D2 red; a front page with an older count turns D3 red
python3 gates/the_red_debt_only_shrinks_gate.py   (a second)
"""
import importlib.util, json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RATCHET = os.path.join(ROOT, 'gates', 'BOHEMIA_RED_DEBT_RATCHET.json')
passed = failed = 0


def ok(name, cond, detail=''):
    global passed, failed
    if cond: passed += 1
    else: failed += 1
    print(('  ok   ' if cond else '  FAIL ') + name + ('  [' + str(detail) + ']' if detail != '' else ''), flush=True)


def runner():
    spec = importlib.util.spec_from_file_location('bohemia_gates_for_debt', os.path.join(ROOT, 'gates', 'bohemia_gates.py'))
    m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m); return m


def count(lines):
    rows = [l for l in lines if l.strip() and not l.strip().startswith('#')]
    left = [l for l in rows if not re.match(r'\s*FILED ask row \d+', (l.split('|') + ['', '', '', ''])[3])]
    return len(rows), len(left)


def front_line(text):
    m = re.search(r'^THE RED DEBT\b.*?(\d[\d,]*) NAMED, (\d[\d,]*) LEFT', text, re.M)
    return (int(m.group(1).replace(',', '')), int(m.group(2).replace(',', ''))) if m else None


def main():
    print('\nTHE RED DEBT ONLY SHRINKS\n')
    m = runner()
    lines = open(m.QUARANTINE_FILE, encoding='utf8').read().split('\n')
    q = m.load_quarantine()
    rows = [l for l in lines if l.strip() and not l.strip().startswith('#')]
    ok('D1 the list parses: every line names a gate in the table, an owner, a date and a reason', len(q) == len(rows),
       '%d lines, %d accepted' % (len(rows), len(q)))
    named, left = count(lines)
    r = json.load(open(RATCHET)) if os.path.exists(RATCHET) else {}
    rn, rl = r.get('named', 10 ** 9), r.get('left', 10 ** 9)
    ok('D2 NAMED and LEFT are not above the ratchet', named <= rn and left <= rl,
       'named %d (ratchet %d), left %d (ratchet %d)%s' % (named, rn, left, rl, '; LOWER: write the new numbers in the ratchet' if (named < rn or left < rl) else ''))
    fl = front_line(open(os.path.join(ROOT, 'VAMILY.md'), encoding='utf8').read())
    ok('D3 the front page\'s THE RED DEBT line says the same two numbers', fl == (named, left), 'front page %s, the list %s' % (fl, (named, left)))
    # P1: the plants
    pn, pl = count(lines + ['PLANTED | PLUMBER | 11/10 | one more red'])
    p_d2 = not (pn <= rn and pl <= rl) if (named == rn and left == rl) else (pn > named)
    p_d3 = front_line('THE RED DEBT: %d NAMED, %d LEFT' % (named + 1, left + 1)) != (named, left)
    ok('P1 PLANTED: one more red line turns D2 red; an older count on the front page turns D3 red', p_d2 and p_d3, 'D2 %s, D3 %s' % (p_d2, p_d3))
    print('\nTHE RED DEBT ONLY SHRINKS: %d passed, %d failed' % (passed, failed))


if __name__ == '__main__':
    main()
    sys.exit(1 if failed else 0)
