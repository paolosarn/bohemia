#!/usr/bin/env python3
"""BOHEMIA VEHICLE SIZE GATE (Paolo 7/24/26, LOCKED) — "there can only be one
consistent car size if ur going to have busses and cars in there."

Every district hero must draw its cars/buses/trailers through the ONE canon size
set (CAR / BUS / TRAILER) via the shared _vehicle() helper — never an ad-hoc
s.box with eyeballed dimensions. This gate reads the hero factory source and
fails if the constants are missing, if _vehicle isn't defined, or if a raw
vehicle box (a box tagged as a bus/car/trailer in a comment) sneaks back in.

  python3 gates/vehicle_size_gate.py
"""
import os
import re
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
SRC = 'tools/bohemia_district_hero_factory.py'

pass_n = fail_n = 0


def ok(name, cond):
    global pass_n, fail_n
    if cond:
        pass_n += 1
    else:
        fail_n += 1
        print('  FAIL:', name)


src = open(SRC, encoding='utf8').read()

# 1. the one canon size set is defined
for c in ('CAR', 'BUS', 'TRAILER'):
    ok('%s size constant defined' % c, re.search(r'^%s\s*=\s*\(' % c, src, re.M) is not None)

# 2. the shared helper exists and is actually used
ok('_vehicle() helper defined', 'def _vehicle(' in src)
calls = len(re.findall(r'_vehicle\(', src)) - 1   # minus the def
ok('_vehicle() used across heroes (>=5 call sites)', calls >= 5)

# 3. no raw eyeballed vehicle box sneaks back in (a box commented as a bus/car/trailer)
raw = re.findall(r's\.box\([^\n]*\)[^\n]*#[^\n]*\b(bus|buses|car|cars|trailer|trailers)\b', src, re.I)
ok('no raw eyeballed vehicle boxes (all go through _vehicle)', len(raw) == 0)
if raw:
    print('    raw vehicle boxes:', raw)

print('VEHICLE SIZE GATE: %d passed, %d failed' % (pass_n, fail_n))
sys.exit(1 if fail_n else 0)
