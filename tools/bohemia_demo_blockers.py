#!/usr/bin/env python3
"""
BOHEMIA DEMO BLOCKERS (8/9/26, WORLD lane).

    "First: DEMO BLOCKERS -- numbered, thumbable."          -- Paolo, 8/9/26

THE DEMO DISPATCH (records/BOHEMIA_DEMO_DISPATCH_PROMPTS_8_4_26.md) demands, before
any demo work: a numbered list of everything already in flight in this lane that needs
PAOLO to finish it -- a verdict, a pick, a playtest -- one line each, answerable by
thumb, and NOTHING a lane can decide itself.

*** THE EXISTENCE OF EVERY BLOCKER IS DERIVED, NEVER TYPED. ***
This is the house bug this repo has paid for eleven times: A VALUE PASSED BY HAND WHERE
A VALUE COULD BE DERIVED. A hand-written blocker list is stale the moment he rules one
of them, and then it asks him for something he already gave -- which is the exact thing
STALE UNJUDGED and NOTES ARE RULINGS exist to stop.

So a blocker EXISTS only if the machine can still see the hole:

  - an ENGINE table that ships empty and says [PENDING Paolo] in its own source, whose
    edge function returns NO_RULING when called. If the table has entries, the blocker
    is gone from this list the next time the tool runs. Nobody edits this file.
  - a backlog row this lane marked [HELD -- needs Paolo's ruling].
  - the live count of unjudged items in the verdict queue, read the same way the VOTE
    tab reads it (@VERDICT declarations under records/).

The QUESTION and its A/B/C conclusions are authored -- that half is judgement and
belongs in writing. The FACT that the question is still open is measured.

REALISM FIRST + THE QUESTION FORMAT (laws/BOHEMIA_ADDENDUM_REALISM_FIRST_AND_THE_
QUESTION_FORMAT_8_4_26.md): every blocker offers TWO OR THREE conclusions he answers
with ONE LETTER, and the realistic option LEADS and wins by default.

REUSE CHECK: cooks NO pixels. Reads engine/bohemia_purse.js, BOHEMIA_BACKLOG.md and
records/*.txt|md only. The rendering shell is the VOTE tab's, which is already his
approved judging surface (thumbs, SUN MODE, comment per item, global comment at the
bottom, export as .txt) -- this tool emits the DATA and the tab draws it.

  python3 tools/bohemia_demo_blockers.py
    -> records/BOHEMIA_DEMO_BLOCKERS_WORLD.md   (the report the coordinator sweeps)
    -> records/target/BOHEMIA_DEMO_BLOCKERS.json (what the VOTE tab renders)
"""
import json
import os
import re

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

PURSE = 'engine/bohemia_purse.js'
BACKLOG = 'BOHEMIA_BACKLOG.md'
BANK = 'banks/BOHEMIA_DISTRICT_HERO_CANDIDATES_7_23_26.txt'
RECORDS = 'records'
OUT_MD = 'records/BOHEMIA_DEMO_BLOCKERS_WORLD.md'
OUT_JSON = 'records/target/BOHEMIA_DEMO_BLOCKERS.json'

# ---------------------------------------------------------------------------
# 1. THE EMPTY RULED TABLES. Measured out of the engine source: a table that is
#    declared empty AND tagged [PENDING Paolo] in its own line is a hole only he
#    can fill. The moment one has contents, its blocker stops being emitted.
# ---------------------------------------------------------------------------
EMPTY_TABLE = re.compile(
    r'^\s*var\s+([A-Z_]+)\s*=\s*\{\s*\}\s*;.*?\[PENDING Paolo\]', re.M)

# The authored half: what the question actually IS, and the conclusions. Keyed by the
# table the machine finds. A table with no entry here still gets reported -- as an
# UNWRITTEN blocker, because silently dropping a hole is worse than an ugly line.
QUESTIONS = {
    'PAYOUT': {
        'q': 'A day of quests ends and the player gets paid. Paid WHAT?',
        'why': ('The payout hook is built, connected, and LIVE IN THE WORLD YOU WALK as of '
                '8/9 -- a finished quest reaches the purse, and the purse is loaded on the '
                'page the RUN tab opens. It pays ZERO, because what a quest is worth is '
                'your ruling and the table ships empty by the mechanism-mine law. That is '
                'now the only thing between the day loop and PAYING.'),
        'opts': [
            ('A', 'CLOUT ONLY for the demo',
             'Word gets around that you did the job. No goods change hands. This is what '
             'actually happens in a barter economy where a stranger has nothing to give '
             'you yet, it is the smallest ruling that closes the loop, and it keeps the '
             'three-currency law clean.'),
            ('B', 'You give me the numbers',
             'Say what a quiet / notable / risky / reckless job pays in resources, '
             'electricity and clout, and I wire exactly that.'),
            ('C', 'Demo-only placeholders, marked and disposable',
             'I seed numbers that are labelled DEMO in the ledger and can never become '
             'canon. Fastest, and the honest risk is that a placeholder that ships is a '
             'number nobody ruled.'),
        ],
    },
    'PRICES': {
        'q': 'You walk into the trading hub with a full purse. What is on the shelf, and what does it cost?',
        'why': ('The hubs are found and REACHABLE as of 8/9 -- the swap meet and the '
                'truckstop the overmap already sited, with the drive network reaching them '
                'from the curb, and the shelf is stocked with the four goods the economy '
                'sim already models. They are not SPENDABLE, because the price table ships '
                'empty. One shelf with real tags on it is the whole remaining distance.'),
        'opts': [
            ('A', 'Three goods, priced off the scarcity sim we already have',
             'Water, food, meds -- the three things a Mojave collapse actually trades. '
             'engine/bohemia_economy.js ALREADY prices them hyperbolically against '
             'remaining supply from real siege data. I read the price off the sim instead '
             'of inventing one, so the tag on the shelf moves when the valley gets '
             'thirstier. Most realistic and nothing is invented.'),
            ('B', 'You name the goods and the prices',
             'Your shelf, your numbers, I wire it verbatim.'),
            ('C', 'Barter only for the demo',
             'No prices at all -- you trade a thing for a thing. Truest to a dead economy '
             'and it means the purse buys nothing in the demo.'),
        ],
    },
    'PRODUCTION': {
        'q': 'Do buildings produce anything during the demo?',
        'why': ('produce() is built and connected and the yield table is empty. This one '
                'is city-builder territory, and the demo cut is THE ORIGIN + ONE GOOD DAY.'),
        'opts': [
            ('A', 'NO -- out of the demo cut',
             'A day-in-the-life demo never sees a production tick. Leave it empty and '
             'honest; it costs the demo nothing.'),
            ('B', 'Yes, and you give me the yields',
             'Say what a building makes per day and I wire it.'),
        ],
    },
}

src = open(PURSE, encoding='utf8').read()
empty_tables = EMPTY_TABLE.findall(src)

# PROVE the edge is really wired and really silent, so a blocker is never a story:
# the function must exist AND return NO_RULING when its table misses.
wired = {}
for t in empty_tables:
    fn = {'PAYOUT': 'payQuest', 'PRICES': 'spend', 'PRODUCTION': 'produce'}.get(t)
    wired[t] = bool(fn and re.search(r'function\s+%s\s*\(' % fn, src)
                    and re.search(r'%s\[' % t, src))

# ---------------------------------------------------------------------------
# 2. BACKLOG ROWS THIS LANE MARKED HELD ON HIS RULING.
# ---------------------------------------------------------------------------
bl = open(BACKLOG, encoding='utf8').read()
world = bl.split('\n## WORLD\n', 1)
world = world[1].split('\n## ', 1)[0] if len(world) > 1 else ''
HELD = re.compile(r'^([A-Z]+\d*)\.\s*\[HELD[^\]]*\]\s*(.+)$', re.M)
held = HELD.findall(world)

HELD_QUESTIONS = {
    'I1': {
        'q': 'Should an airfield map icon DROP the runway and just show the terminal and the aeroplane, big?',
        'why': ('Both builders are written and correct. Baked alone the aeroplane reads '
                'unmistakably as an aeroplane -- the problem is SIZE. Every other district '
                'icon is a BUILDING, which survives shrinking to one map tile; an '
                'airfield\'s signature is an AIRCRAFT, and a plot holding a runway plus a '
                'taxiway plus a terminal leaves no room to make it legible. Four attempts '
                'are written up so nobody re-walks them. This is a composition ruling, not '
                'a code fix.'),
        'opts': [
            ('A', 'Keep the runway, accept it reads small',
             'An airport IS mostly runway seen from above, and that is what the cell '
             'really holds. Truest to the place; the icon stays busy at map size.'),
            ('B', 'Drop the runway, big aeroplane and terminal',
             'Reads instantly at one tile. It is a deliberate lie about the ground -- the '
             'same lie every city-builder tells -- and it makes the airfield a landmark.'),
            ('C', 'No airfield icon at all',
             'Two cells of the valley stay generic. Cheapest, and it breaks the ICON LAW '
             'you locked on 7/27.'),
        ],
    },
}

# ---------------------------------------------------------------------------
# 3. THE LIVE VERDICT QUEUE, read exactly the way the VOTE tab reads it.
# ---------------------------------------------------------------------------
DECLARED = re.compile(r'^\s*@VERDICT\s+([a-z]+)\b', re.I | re.M)
bank = json.load(open(BANK, encoding='utf8'))
heroes = [h for h in bank['heroes'] if h.get('b64')]
names = {h['district'] for h in heroes}
judged = set()
for fn in sorted(os.listdir(RECORDS)):
    if not fn.lower().endswith(('.txt', '.md')):
        continue
    try:
        txt = open(os.path.join(RECORDS, fn), encoding='utf8', errors='ignore').read()
    except Exception:
        continue
    for m in DECLARED.finditer(txt):
        if m.group(1).lower() in names:
            judged.add(m.group(1).lower())
unjudged = sorted(names - judged)

# ---------------------------------------------------------------------------
# BUILD THE NUMBERED LIST. Order: the things that stop the demo dead, first.
# ---------------------------------------------------------------------------
blockers = []

for t in ['PAYOUT', 'PRICES', 'PRODUCTION']:
    if t not in empty_tables:
        continue                      # he ruled it; the blocker is gone, automatically
    q = QUESTIONS.get(t)
    if not q:
        blockers.append({'key': t, 'q': '[UNWRITTEN BLOCKER] %s ships empty and nothing '
                                        'here says what to ask about it.' % t,
                         'why': '', 'opts': [], 'proof': '%s: var %s = {}' % (PURSE, t)})
        continue
    blockers.append({
        'key': t, 'q': q['q'], 'why': q['why'], 'opts': q['opts'],
        'proof': '%s: var %s = {} [PENDING Paolo]%s' % (
            PURSE, t, ', edge wired and returning NO_RULING' if wired.get(t) else ''),
    })

if unjudged:
    blockers.append({
        'key': 'ICONS',
        'q': '%d district map icons have never been judged.' % len(unjudged),
        'why': ('APPROVAL UNLOCKS VOLUME and STALE UNJUDGED IS DEAD -- both your laws. '
                'Every one of these is finished, on a square, wired into the CITY tab and '
                'sitting in this same tab below. Nothing downstream of the icons moves '
                'until they are thumbed.'),
        'opts': [
            ('A', 'Thumb them here', 'Scroll down in this tab. One tap each, and you can '
                                     'stop whenever you want -- a partial pass still counts.'),
            ('B', 'Bulk-approve the lot', 'They all ship and I fix only what you complain '
                                          'about later.'),
        ],
        'proof': '%d of %d heroes carry no @VERDICT line under records/' % (
            len(unjudged), len(names)),
    })

for key, rest in held:
    q = HELD_QUESTIONS.get(key)
    if not q:
        blockers.append({'key': key, 'q': '[UNWRITTEN BLOCKER] backlog WORLD %s is HELD on '
                                          'your ruling: %s' % (key, rest[:120]),
                         'why': '', 'opts': [], 'proof': 'BOHEMIA_BACKLOG.md WORLD %s [HELD]' % key})
        continue
    blockers.append({'key': key, 'q': q['q'], 'why': q['why'], 'opts': q['opts'],
                     'proof': 'BOHEMIA_BACKLOG.md WORLD %s [HELD -- needs Paolo\'s ruling]' % key})

for i, b in enumerate(blockers):
    b['n'] = i + 1

os.makedirs(os.path.dirname(OUT_JSON), exist_ok=True)
json.dump({'lane': 'WORLD', 'built': '8/9/26', 'blockers': blockers},
          open(OUT_JSON, 'w', encoding='utf8'), indent=1)

# ---- the coordinator's copy, plain text --------------------------------------
L = ['# DEMO BLOCKERS -- WORLD LANE',
     '',
     '**Everything in flight in this lane that needs PAOLO to finish it. One line each,',
     'answerable in one letter. Nothing here is something I can decide myself.**',
     '',
     '> "First: DEMO BLOCKERS -- numbered, thumbable." -- Paolo, 8/9/26',
     '',
     'THE EXISTENCE of every row below is DERIVED, not typed: an engine table that still',
     'ships empty with [PENDING Paolo] in its own source, a backlog row this lane marked',
     'HELD, or the live count of unjudged items. Rule one and it leaves this list by',
     'itself the next time the tool runs.',
     '',
     'WHERE HE ANSWERS THEM: **the VOTE tab** (tab #1 in the alpha), at the top, above the',
     'icons. One tap per row, then EXPORT.',
     '']
for b in blockers:
    L.append('## %d. %s' % (b['n'], b['q']))
    L.append('')
    if b['why']:
        L.append(b['why'])
        L.append('')
    for letter, head, body in b['opts']:
        L.append('- **%s. %s** -- %s' % (letter, head, body))
    if b['opts']:
        L.append('')
    L.append('*proof: %s*' % b['proof'])
    L.append('')
L.append('---')
L.append('')
L.append('**NOT ON THIS LIST ON PURPOSE:** anything this lane can decide itself. The flat-')
L.append('district icon distinctness question came off it on 8/9 -- it turned out not to be')
L.append('a trade at all, just materials I had never rendered at their real brightness.')
open(OUT_MD, 'w', encoding='utf8').write('\n'.join(L) + '\n')

print('DEMO BLOCKERS: %d' % len(blockers))
for b in blockers:
    print('  %d. [%s] %s' % (b['n'], b['key'], b['q'][:88]))
print('  -> %s' % OUT_MD)
print('  -> %s' % OUT_JSON)
