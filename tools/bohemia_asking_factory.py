#!/usr/bin/env python3
"""BOHEMIA ASKING FACTORY -- you can ask somebody about what you overheard, and
the thread goes one step deeper.

WHAT WAS HALF-BUILT. Overhearing a conversation to the end now writes a fact in
your log (8/17). The log is read-only: eleven true things about this valley, and
no way to do anything with any of them. Q018.W3 THE RUMOR WEB asks for "a thread
to PULL", and a thread you cannot pull is a list.

So: standing in front of somebody, you can ASK them about a subject you have
heard about. If they know something they tell you and the fact DEEPENS -- a
second, later line goes in the log under the same subject. If they do not, they
say so in their own voice and nothing is spent.

*** THE TRAP THIS IS BUILT TO AVOID, AND IT IS NAMED IN BOTH THE RESEARCH AND
THE CORPUS. *** The obvious shape is "every person has an answer for every
topic", and it is a content mountain nobody can climb. Disco Elysium's four
player call signs alone cost 428 new dialogue cards, all localised and voiced.
The corpus says the same thing straight at a solo dev:

  Q047.X1 ASTRONOMICAL WRITING/VO COST (flaws) -- "the never-repeating
    reactivity requires an ENORMOUS volume ... the VOLUME isn't achievable at
    Hades' scale solo -- get the EFFECT with SCOPED, SMARTLY-TEMPLATED
    reactivity". So the content here is NOT subjects x people. It is:
        7 subjects x 2 answers   = 14 answers
        4 archetypes x 1 refusal =  4 deflections, reused everywhere
    Eighteen blocks covering every combination, instead of twenty-eight per
    person. Adding a subject costs two answers, not one per resident.

  Q014.W4 MULTIPLE KEYS TO THE ANSWER (craft) -- "many diegetic paths to the
    same knowledge." Every subject is answerable by TWO DIFFERENT archetypes, so
    you are never hunting one specific person, and the factory refuses to build
    a subject whose answers all come from the same trade.

  Q014.W3 SOCIAL DEDUCTION VIA DIEGETIC MEANS (craft) -- "the investigation
    happens through the party's social fabric, not a quest-log clue." Asking a
    person IS the mechanism. There is no menu of leads anywhere.

  Q037.W3 THE JOURNAL AS A DETECTIVE NOTEBOOK (craft) -- "quest info accrues in
    a case file you reconstruct the route from -- the log IS the map." Which is
    why a deeper fact is a LINE IN THE LOG and never a marker in the world.

  Q001.P8 W8 (reward the listener (ports) -- you can only ask about something
    you actually overheard to the end. Nothing here is askable from a menu.

*** WHERE THE THREAD ENDS IS HIS, AND IT SHIPS UNANSWERED. *** Every deeper fact
asks a sharper question and NONE of them resolves, because what is actually up
the hill, who owns the tank, and who is writing the names are CANON and canon is
Paolo's. MECHANISM-MINE / CONTENTS-PAOLO'S. This ships the asking and the
deepening; the destinations are [PENDING Paolo] and are deliberately empty. A
tool that invented them would be writing his world for him.

MECHANISM-MINE, WORDS AS AMENDED 8/11: every line is a REAL ATTEMPT, written as
if it ships, draft:true, editable in the WORDS tab. NO PROPER NAMES. Nobody
explains the collapse (Q056.W8).

REUSE CHECK: cooks WORDS, not pixels.
  looked at: records/BOHEMIA_QUESTBOOK_LAW_INDEX.json -- every citation resolved
    at build time and its title compared VERBATIM; a typo refuses the write.
  looked at: engine/bohemia_exchanges.js -- the SUBJECTS are read out of the
    shipped exchanges rather than retyped here, so a subject nobody can overhear
    can never become a subject somebody can ask about.
  looked at: engine/bohemia_known.js -- a deeper fact is stored by the SAME log
    with the same shape, so there is one notebook and not two.
  used: all three.

  python3 tools/bohemia_asking_factory.py
Gate: gates/asking_gate.js
"""
import json
import os
import re
import subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IDX = os.path.join(ROOT, 'records', 'BOHEMIA_QUESTBOOK_LAW_INDEX.json')
EXCH = os.path.join(ROOT, 'engine', 'bohemia_exchanges.js')
OUT_JSON = os.path.join(ROOT, 'records', 'BOHEMIA_ASKING.json')
OUT_JS = os.path.join(ROOT, 'engine', 'bohemia_asking.js')

CITES = {
    'cost':   ('Q047.X1', 'ASTRONOMICAL WRITING/VO COST',
               'the corpus tells a solo dev to get the EFFECT of reactivity with SCOPED, '
               'SMARTLY-TEMPLATED content rather than volume. So this is 7 subjects x 2 '
               'answers plus 4 reusable refusals, never subjects x residents.'),
    'keys':   ('Q014.W4', 'MULTIPLE KEYS TO THE ANSWER',
               'many diegetic paths to the same knowledge. Every subject is answerable by '
               'two different trades, so you are never hunting one specific person, and '
               'the build refuses a subject whose answers all come from one trade.'),
    'social': ('Q014.W3', 'SOCIAL DEDUCTION VIA DIEGETIC MEANS',
               'the investigation happens through the social fabric rather than a quest '
               'log. Asking a person IS the mechanism; there is no menu of leads.'),
    'note':   ('Q037.W3', 'THE JOURNAL AS A DETECTIVE NOTEBOOK',
               'the log IS the map, so what an answer gives you is a LINE IN THE LOG and '
               'never a marker in the world.'),
    'listen': ('Q001.P8', 'W8 (reward the listener',
               'you can only ask about something you overheard to the end. Nothing here '
               'is reachable from a menu, so listening is the only key.'),
    'atmos':  ('Q056.W8', 'ATMOSPHERE OVER EXPOSITION (vibes + prose + music)',
               'nobody explains the collapse. They tell you what they carried, what they '
               'were paid, and what they noticed.'),
}

# ---------------------------------------------------------------------------
# THE ANSWERS.  subject -> two answers from TWO DIFFERENT trades (Q014.W4).
# `deeper` is what goes in the log afterwards, and it always asks a SHARPER
# question rather than settling anything -- where these end is Paolo's.
# ---------------------------------------------------------------------------
ANSWERS = {
    'water': [
        dict(who='keeper', cites=['keys', 'atmos'],
             says="Before five it comes off the high line. After five you are on the tank, "
                  "and the tank is somebody's.",
             line="After five you are on the tank, and the tank is somebody's.",
             implies="Somebody owns the tank the whole block drinks from after five."),
        dict(who='worker', cites=['social', 'atmos'],
             says="I have carried pipe for them twice. Same yard both times. Paid cash both "
                  "times, which nobody does unless they would rather not write it down.",
             line="Pipe gets carried to the same yard, and it is paid for in cash.",
             implies="Somebody is moving water and would rather it was not written down."),
    ],
    'power': [
        dict(who='watch', cites=['keys', 'atmos'],
             says="That street has been lit since before I started sitting out here. And "
                  "nobody has ever changed a bulb on it.",
             line="Nobody has ever changed a bulb on the lit street.",
             implies="Whatever keeps that street lit does not need anybody to maintain it."),
        dict(who='scav', cites=['social', 'atmos'],
             says="You cannot pull anything off that block. I have tried. It is all bolted "
                  "like somebody meant it to stay.",
             line="Everything on the lit block is bolted like somebody meant it to stay.",
             implies="Somebody built that block to last and did not want it stripped."),
    ],
    'salvage': [
        dict(who='scav', cites=['keys', 'atmos'],
             says="Carports. Awnings. Anything nobody looks up at. And go early, because you "
                  "are not the only one who worked it out.",
             line="Somebody else is already working the carports, and they go early.",
             implies="Somebody is stripping the same places you are, and getting there first."),
        dict(who='keeper', cites=['social', 'atmos'],
             says="I buy what comes off the carports and I do not ask. It comes in clean, "
                  "and clean is the part that bothers me.",
             line="What comes off the carports arrives clean, and that is unusual.",
             implies="Somebody is stripping panels carefully rather than fast."),
    ],
    'work': [
        dict(who='worker', cites=['keys', 'atmos'],
             says="They took my name in the spring and never called it. Somebody I know gave "
                  "them a name the same week and was working by Friday.",
             line="They take everybody's name and call almost nobody.",
             implies="Being on that list is not what gets you the work."),
        dict(who='watch', cites=['social', 'atmos'],
             says="The yard fills up on the days the water is off. Every time. I stopped "
                  "believing that was chance a while ago.",
             line="The yard fills up on the days the water is off, every time.",
             implies="Whoever runs the yard knows when the water goes off before it goes off."),
    ],
    'the hill': [
        dict(who='watch', cites=['keys', 'atmos'],
             says="He is not stopping anybody. He is counting. That is a different job and "
                  "it took me too long to see it.",
             line="The man on the hill road is counting, not stopping.",
             implies="Somebody wants to know how many go up, and does not mind who."),
        dict(who='scav', cites=['social', 'atmos'],
             says="I went up once. There is nothing up there worth carrying down. Somebody "
                  "still thought it was worth watching.",
             line="There is nothing up the hill worth carrying down, and it is watched anyway.",
             implies="What is up the hill is not worth stealing, which is why it is worth watching."),
    ],
    'names': [
        dict(who='keeper', cites=['keys', 'atmos'],
             says="They came to me with the book and asked who buys what. I gave them last "
                  "year's names and they wrote every one down.",
             line="They wrote down last year's names without checking one of them.",
             implies="Whoever is collecting names is not checking whether they are real."),
        dict(who='worker', cites=['social', 'atmos'],
             says="They have got me twice, spelled two ways. Both of them get post.",
             line="One man is on the list twice under two spellings, and both get post.",
             implies="The list is being used to send things, not to find people."),
    ],
    'strangers': [
        dict(who='watch', cites=['keys', 'atmos'],
             says="Two visits, nothing bought, and they walked the same line both times. That "
                  "is somebody measuring.",
             line="They walked the same line twice and bought nothing.",
             implies="Somebody is measuring this street rather than shopping on it."),
        dict(who='keeper', cites=['social', 'atmos'],
             says="They asked what I keep out back. Nobody asks what I keep out back.",
             line="They asked what is kept out back, which nobody asks.",
             implies="Somebody is interested in what is behind the counters, not on them."),
    ],
}

# ONE REFUSAL PER TRADE, REUSED FOR EVERY SUBJECT THEY CANNOT SPEAK TO. This is
# the whole cost saving: four lines instead of one per person per subject.
DEFLECT = {
    'worker': "I work. I do not keep track of who is doing what to who.",
    'scav':   "Ask somebody who stands still for a living. I am never in one place long enough.",
    'keeper': "I hear things across this counter all day. That is not one of them.",
    'watch':  "I watch this street. That is not this street.",
}


def assert_no_dashes(rows):
    bad = [t for t in rows if '—' in t or '–' in t]
    if bad:
        raise SystemExit('EM/EN DASH in a line, refusing to write: ' + repr(bad[:3]))


def assert_no_names(rows):
    """MECHANISM-MINE: who anybody IS is his ruling."""
    allow = set('I A The They We You He She It That This There Then Not Nobody Both '
                'Two Same Every Before After Ask Carports Awnings Anything Paid Pipe '
                'And But So Which Whatever Whoever Somebody One Being What Where When '
                'Friday Monday Tuesday Wednesday Thursday Saturday Sunday'.split())
    bad = []
    for t in rows:
        for w in re.findall(r'(?<![.!?]\s)(?<!^)\b([A-Z][a-z]{2,})\b', t):
            if w not in allow:
                bad.append((w, t))
    if bad:
        raise SystemExit('possible PROPER NAME: ' + repr(bad[:4]))


def subjects_on_disk():
    """READ THE SUBJECTS OUT OF THE SHIPPED EXCHANGES, never retype them. A
    subject nobody can overhear must never become a subject somebody can be
    asked about: that would be a menu entry for a thread that does not exist."""
    out = subprocess.run(
        ['node', '-e',
         "global.window=global;const X=require('" + EXCH + "');"
         "console.log(JSON.stringify([...new Set(X.EXCHANGES.filter(e=>e.leaks)"
         ".map(e=>e.subject))]))"],
        capture_output=True, text=True)
    if out.returncode != 0:
        raise SystemExit('could not read the exchanges: ' + out.stderr[:300])
    return set(json.loads(out.stdout.strip()))


def main():
    laws = json.load(open(IDX, encoding='utf-8'))['laws']

    bad = []
    for key, (cid, title, _a) in CITES.items():
        e = laws.get(cid)
        if not e:
            bad.append(cid + ' (no such law)')
        elif str(e.get('title', '')).strip() != title.strip():
            bad.append('%s title is "%s", corpus says "%s"' % (cid, title, e.get('title')))
    if bad:
        raise SystemExit('citations do not check out: ' + '; '.join(bad))

    # THE SUBJECTS MUST BE THE WORLD'S, EXACTLY.
    heard = subjects_on_disk()
    mine = set(ANSWERS)
    if mine - heard:
        raise SystemExit('askable about something nobody can overhear: %s' % sorted(mine - heard))
    if heard - mine:
        raise SystemExit('overhearable and unaskable, which is a dead end: %s'
                         % sorted(heard - mine))

    # Q014.W4: two DIFFERENT trades per subject, or you are hunting one person.
    for s, rows in ANSWERS.items():
        if len(rows) < 2:
            raise SystemExit('%s has %d answer(s); MULTIPLE KEYS needs 2' % (s, len(rows)))
        trades = {r['who'] for r in rows}
        if len(trades) < 2:
            raise SystemExit('%s is answered only by %s, so it is one person to hunt'
                             % (s, trades))
        for r in rows:
            if r['who'] not in DEFLECT:
                raise SystemExit('%s: %s is not a trade the sim makes' % (s, r['who']))
            if len(r['cites']) < 2:
                raise SystemExit('%s/%s cites %d findings, needs 2' % (s, r['who'], len(r['cites'])))

    lines = ([r['says'] for v in ANSWERS.values() for r in v]
             + [r['line'] for v in ANSWERS.values() for r in v]
             + [r['implies'] for v in ANSWERS.values() for r in v]
             + list(DEFLECT.values()))
    assert_no_dashes(lines)
    assert_no_names(lines)

    rows = []
    for s in sorted(ANSWERS):
        for r in ANSWERS[s]:
            rows.append({
                'id': s.replace(' ', '-') + ':' + r['who'],
                'subject': s, 'who': r['who'], 'says': r['says'],
                'deeper': {'id': s.replace(' ', '-') + ':' + r['who'] + ':deeper',
                           'subject': s, 'line': r['line'], 'implies': r['implies']},
                'draft': True,
                'study': [{'id': CITES[c][0], 'title': CITES[c][1], 'applied': CITES[c][2]}
                          for c in r['cites']],
            })

    payload = {
        '_meta': {
            'what': 'What somebody tells you when you ask them about a thing you overheard.',
            'why': 'The log shipped read-only. Q018.W3 asks for a thread to PULL, and a '
                   'thread you cannot pull is a list.',
            'scoped': 'Q047.X1: %d answers + %d reusable refusals covers every combination, '
                      'instead of one line per person per subject.'
                      % (len(rows), len(DEFLECT)),
            'pending': 'WHERE EVERY THREAD ENDS IS PAOLO\'S. Not one deeper fact resolves; '
                       'each asks a sharper question. What is up the hill, who owns the tank '
                       'and who is collecting names are CANON and ship unanswered.',
            'generator': 'tools/bohemia_asking_factory.py',
            'subjects': sorted(ANSWERS), 'answers': len(rows), 'deflections': len(DEFLECT),
            'draft': 'every line is draft:true and editable in the WORDS tab',
        },
        'asking': rows,
        'deflect': DEFLECT,
    }
    with open(OUT_JSON, 'w', encoding='utf-8') as f:
        json.dump(payload, f, indent=1, ensure_ascii=False)

    js = '''// BOHEMIA ASKING -- what somebody tells you when you ask about what you heard
// (8/17/26, PEOPLE lane). GENERATED by tools/bohemia_asking_factory.py.
// DO NOT HAND-EDIT: re-run the tool.
//
// The overheard-fact log shipped READ-ONLY: eleven true things and nothing to do
// with any of them. Q018.W3 THE RUMOR WEB asks for "a thread to PULL", and a
// thread you cannot pull is a list. So you can ask, and the thread deepens.
//
// SCOPED, NOT COMBINATORIAL (Q047.X1 ASTRONOMICAL WRITING/VO COST). Seven
// subjects, two answers each from two DIFFERENT trades (Q014.W4 MULTIPLE KEYS),
// and ONE refusal per trade reused everywhere. Eighteen blocks cover every
// person and every subject. Adding a subject costs two answers, not one per
// resident.
//
// NOTHING HERE RESOLVES. Every deeper fact asks a sharper question, because what
// is actually up the hill, who owns the tank and who is collecting names are
// CANON, and canon is Paolo's. The destinations ship empty on purpose.
(function (root) {
  'use strict';
  var HASREQ = (typeof module !== 'undefined' && module.exports);

  var ASKING = ''' + json.dumps(rows, ensure_ascii=False, indent=1) + ''';
  var DEFLECT = ''' + json.dumps(DEFLECT, ensure_ascii=False, indent=1) + ''';

  /* CAN THIS PERSON ANSWER THIS? Their trade decides, and only their trade, so
     the same question put to the same kind of person always gets the same
     answer -- a world where the reply depends on which body you happened to
     click is not a world with information in it. */
  function answerFor(subject, archetype) {
    for (var i = 0; i < ASKING.length; i++) {
      if (ASKING[i].subject === subject && ASKING[i].who === archetype) return ASKING[i];
    }
    return null;
  }
  function deflectFor(archetype) { return DEFLECT[archetype] || DEFLECT.worker; }

  /* WHO COULD ANSWER, for a surface that wants to say "somebody else might".
     Never a location: Q037.W3 says the log is the map, and a list of trades is
     not a waypoint. */
  function whoKnows(subject) {
    var out = [];
    for (var i = 0; i < ASKING.length; i++) {
      if (ASKING[i].subject === subject && out.indexOf(ASKING[i].who) < 0) out.push(ASKING[i].who);
    }
    return out;
  }
  function subjects() {
    var out = [];
    for (var i = 0; i < ASKING.length; i++) {
      if (out.indexOf(ASKING[i].subject) < 0) out.push(ASKING[i].subject);
    }
    return out;
  }

  var API = {
    VERSION: '8.17.26', ASKING: ASKING, DEFLECT: DEFLECT,
    answerFor: answerFor, deflectFor: deflectFor, whoKnows: whoKnows,
    subjects: subjects, count: ASKING.length
  };
  if (HASREQ) module.exports = API;
  root.BohemiaAsking = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
'''
    with open(OUT_JS, 'w', encoding='utf-8') as f:
        f.write(js)

    print('ASKING: %d answers across %d subjects, %d reusable refusals'
          % (len(rows), len(ANSWERS), len(DEFLECT)))
    print('  covers %d person-and-subject combinations with %d authored blocks'
          % (len(ANSWERS) * len(DEFLECT), len(rows) + len(DEFLECT)))
    print('  -> %s' % os.path.relpath(OUT_JS, ROOT))


if __name__ == '__main__':
    main()
