#!/usr/bin/env python3
"""BOHEMIA - AUTHORED BUT UNREAD. The machine that finds the class of bug this
project has now hit FOUR TIMES, each one found by a human noticing rather than by
anything that could answer the general question.

  7/30  APPROVED-BUT-UNUSED: a bank he thumbed UP that never draws a pixel.
  8/4   the reachability census: 17 finished things shipping to a file no player
        can open.
  8/6   the clout tags (#quiet/#reckless): 69 authored, and only the vanity
        follower count read them, so faction standing moved godlike.
  8/7   @DO faction_posture: 17 authored, parsed into a real field, read by nothing.

ONE DISEASE, FOUR NAMES: PAOLO AUTHORS SOMETHING, THE MACHINE PARSES IT CORRECTLY,
AND NOTHING EVER READS IT. Every gate in the repo went green through all four.

===== HOW THIS ASKS THE QUESTION, AND WHY THE OBVIOUS WAY DOES NOT WORK =====
Two text-sweep versions of this were built and BOTH were wrong, in opposite
directions, and that is worth writing down rather than hiding:

  v1 grepped the VERB NAME. It reported `advance_territory` dead -- because the
     verb is snake_case and the state field it writes is camelCase
     `advanceTerritory`. The repo already had this scar: the 8/4 census "gave four
     false alarms out of five" the same way.

  v2 grepped the STATE FIELD each verb writes, read out of the runtime's own switch
     so the vocabulary was never typed by hand. That fixed v1 and broke the other
     way: it reported EVERYTHING alive. `@DO play` writes a string into s.log and
     nothing on earth parses that log for it -- but `s.log` is read all over, and
     two JUDGE PAGES re-implement the runtime for preview, so a simulator counts as
     a consumer and a local variable called `s` counts as a coincidence.

A THIRD heuristic would have its own blind spot. Paolo 7/26: "writing a fourth
version of anything means you already failed." So the approach changed instead:

***  DO NOT ASK WHO READS IT. ASK WHETHER IT CHANGES ANYTHING.  ***

Boot a real world. Snapshot it. Resolve a quest carrying exactly one @DO verb
through the REAL runtime and the REAL world bridge. Snapshot again. Diff.

That cannot be fooled by a comment, a judge page, a coincidental variable name, or
a builder that inlines the runtime into a 26 MB slice -- because it never reads a
character of source. It is the same standard the good gates in this repo already
hold: measure the world, never the code.

  WORLD ......... the authored value changed the real FactionWorld. It is wired.
  QUEST-ONLY .... it changed only the quest's own state. Legitimate when something
                  gates on it (flags and knowledge are how dialogue opens), and the
                  report says which so a human can tell.
  INERT ......... it changed NOTHING, anywhere. The author's number goes in and
                  never comes out. THIS is the defect.

REUSE CHECK (REUSE-FIRST, Paolo 7/22). What this opened, in code, and used:
  - engine/bohemia_quest_runtime.js ... READ, only to enumerate the verb vocabulary
                                        from its own switch. Never a typed copy.
  - engine/bohemia_loop.js ............ EXECUTED. boot() gives the real valley, the
                                        real faction graph, the real world bridge.
  - quests/bq/*.bq .................... READ, counted, for how much he authored.
Nothing is written outside records/. No quest file is touched.

  python3 tools/bohemia_authored_unread.py
"""
import json
import os
import re
import subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(ROOT)

RUNTIME = 'engine/bohemia_quest_runtime.js'
BQDIR = 'quests/bq'
OUT = 'records/BOHEMIA_AUTHORED_UNREAD.json'


def verbs_from_runtime():
    """The @DO vocabulary, read out of the runtime's own switch. Never typed here,
    so a verb added or renamed tomorrow is followed automatically."""
    src = open(RUNTIME, encoding='utf-8').read()
    # BOUNDED BY THE FUNCTION, NOT BY A BYTE COUNT. This read back a fixed 4000
    # characters from UNHANDLED_DO, and on 8/12 a new verb arriving with a long
    # comment above it pushed `set_flag` and `learn` -- the FIRST TWO CASES -- out
    # of that window. The gate then reported 105 authored uses of two perfectly
    # handled verbs as UNPARSED. A magic constant silently truncating the thing this
    # function's own docstring promises to follow "automatically" is the same defect
    # in miniature that the gate exists to catch, so it now reads from the start of
    # _exec (the function that OWNS the switch) to its default arm.
    end = src.find('UNHANDLED_DO')
    start = src.rfind('Runtime.prototype._exec', 0, end)
    if start < 0:
        raise SystemExit('the runtime no longer has a _exec switch to read; fix this scraper')
    body = src[start:end]
    return sorted(set(re.findall(r"case\s*'([a-z_]+)'", body)))


def authored_counts():
    n = {}
    for fn in os.listdir(BQDIR):
        if not fn.endswith('.bq'):
            continue
        src = open(os.path.join(BQDIR, fn), encoding='utf-8').read()
        for m in re.finditer(r'@DO\s+([a-z_]+)', src):
            n[m.group(1)] = n.get(m.group(1), 0) + 1
    return n


# A VERB CAN BE NEWER THAN THE CORPUS, and the arg-lifting alone cannot follow it.
# Added 8/12 for `pay`. This gate's own charter says "a verb added, renamed, or
# deleted tomorrow is followed automatically" -- but sample_args() lifts arguments
# only from .bq files, so a verb the runtime supports and no quest has used YET gets
# probed with an empty argument, does nothing (correctly), and is reported inert.
# That would punish the only correct order of work: build the mechanism, then let
# him rule the contents. `@DO pay <currency> <n>` exists because Paolo ruled on 8/11
# that a quest declares its own reward, and the AMOUNTS are contents that wait for
# him -- so no canon quest carries it yet, ON PURPOSE.
# THE FALLBACK IS ONLY EVER USED WHEN THE CORPUS HAS NOTHING. The moment a real
# quest writes the verb, his own arguments win and this entry stops being consulted.
NEW_VERB_ARGS = {
    'pay': 'resources 3',
}


def sample_args():
    """Real arguments, lifted from his own corpus so each verb is probed the way it
    is actually written rather than with something invented. A verb the corpus has
    not used yet falls back to NEW_VERB_ARGS above, and only then."""
    args = {}
    for fn in os.listdir(BQDIR):
        if not fn.endswith('.bq'):
            continue
        src = open(os.path.join(BQDIR, fn), encoding='utf-8').read()
        for m in re.finditer(r'@DO\s+([a-z_]+)([^\n]*)', src):
            v, rest = m.group(1), m.group(2).strip()
            if v not in args and v != 'set_stage':
                args[v] = rest
    for v, a in NEW_VERB_ARGS.items():
        args.setdefault(v, a)        # corpus wins; this only fills a real gap
    return args


PROBE = r"""
'use strict';
const L = require('./engine/bohemia_loop.js');
const VERBS = %(verbs)s;    // verb -> argument string lifted from his corpus

function snapshotWorld(ctx) {
  const w = ctx.factions, out = { standing: {}, quota: {}, owner: {}, territory: {} };
  for (const f of w.factions.values()) {
    out.quota[f.id] = f.quota;
    out.territory[f.id] = [...f.territory].sort().join('|');
    out.standing[f.id] = JSON.stringify(f.standing);
  }
  for (const [d, f] of w.owner.entries()) out.owner[d] = f;
  return JSON.stringify(out);
}
/* THE ONE HAND-TYPED LIST IN A GATE THAT IS PROUD OF HAVING NONE, and it bit on
   8/12 exactly the way its own docstring predicts. The vocabulary is read out of
   the runtime's switch so a new verb is followed automatically -- but the STATE
   SHAPE is written out by hand here, so a new verb writing a NEW FIELD is followed
   by nothing and reports INERT while working perfectly. `reward` (added 8/12 with
   @DO pay) was invisible to this snapshot. Serialising the whole state instead
   would follow any future field for free, but it would also make every probe
   depend on `stage` and `done`, which the verb under test does not own -- so the
   list stays explicit and gains the field. If you add a verb that writes a new
   field, ADD IT HERE TOO. */
function snapshotQuest(rt) {
  const s = rt.state;
  return JSON.stringify({ flags: s.flags, knows: s.knows, has: s.has, roles: s.roles,
    bonds: s.bonds, faction: s.faction, posture: s.posture, objectives: s.objectives,
    advanceTerritory: s.advanceTerritory, log: s.log, doneTags: s.doneTags,
    reward: s.reward });
}
function pick(v, t) { return (v.options || []).filter(o => o.text.indexOf(t) >= 0)[0]; }

function probe(verb, args) {
  const withDo = [
    '@QUEST probe_' + verb + '  Probe', '@ACT 1', '@ONCE true',
    '@STAGE 10', '  @LOG opening',
    '@STAGE 20 COMPLETE #notable', '  @LOG resolved', '  @DO ' + verb + ' ' + args,
    '@TALK open speaker=k entry=stage>=10',
    '  @SAY hi', '  @OPT "go" [gate: none] -> END  @DO set_stage 20', '@END',
  ].join('\n');
  const without = withDo.replace('  @DO ' + verb + ' ' + args + '\n', '');

  function run(src) {
    const ctx = L.boot({ seed: 'unread-probe' });
    const w0 = snapshotWorld(ctx);
    let rt, err = null;
    try {
      rt = ctx.quests.start(src);
      rt.begin('open');
      const o = pick(rt.view(), 'go');
      if (o) rt.choose(o.i);
    } catch (e) { err = String(e).slice(0, 120); }
    return { w0, w1: snapshotWorld(ctx), q: rt ? snapshotQuest(rt) : null, err };
  }
  const a = run(withDo), b = run(without);
  if (a.err) return { verb, verdict: 'ERROR', why: a.err };
  const worldMoved = a.w1 !== b.w1;
  const questMoved = a.q !== b.q;
  return {
    verb,
    verdict: worldMoved ? 'WORLD' : questMoved ? 'QUEST-ONLY' : 'INERT',
    why: worldMoved ? 'the real FactionWorld differs with this verb present'
       : questMoved ? 'only the quest\'s own state differs'
       : 'NOTHING differed, anywhere, with the verb present versus absent',
  };
}

const rows = Object.keys(VERBS).sort().map(v => probe(v, VERBS[v]));
process.stdout.write(JSON.stringify(rows));
"""


def build():
    vocab = verbs_from_runtime()
    counts = authored_counts()
    args = sample_args()
    # probe every verb the runtime knows; use his own arguments where he wrote some
    probe_set = {v: args.get(v, 'X +1') for v in vocab if v != 'set_stage'}
    js = PROBE % {'verbs': json.dumps(probe_set)}
    p = subprocess.run(['node', '-e', js], capture_output=True, text=True)
    if p.returncode != 0:
        raise SystemExit('the probe could not run, so there is no honest answer:\n' + p.stderr[-1500:])
    rows = json.loads(p.stdout)
    for r in rows:
        r['authored'] = counts.get(r['verb'], 0)
    # verbs he authored that the runtime has no case for at all
    for v, n in counts.items():
        if v not in vocab:
            rows.append({'verb': v, 'authored': n, 'verdict': 'UNPARSED',
                         'why': 'authored in the corpus and the runtime has no case for it'})
    report = {
        'rows': rows,
        'totals': {k: sum(1 for r in rows if r['verdict'] == k)
                   for k in ('WORLD', 'QUEST-ONLY', 'INERT', 'UNPARSED', 'ERROR')},
        'authored_total': sum(counts.values()),
        'method': 'behavioural: real boot, real runtime, quest run with and without each verb, worlds diffed',
    }
    open(OUT, 'w', encoding='utf-8').write(json.dumps(report, indent=1))
    return report


def main():
    r = build()
    w = max(len(x['verb']) for x in r['rows'])
    print('=== BOHEMIA - AUTHORED BUT UNREAD ===')
    print('%d @DO lines authored across the canon corpus' % r['authored_total'])
    print('method: %s\n' % r['method'])
    order = {'INERT': 0, 'UNPARSED': 1, 'ERROR': 2, 'QUEST-ONLY': 3, 'WORLD': 4}
    for row in sorted(r['rows'], key=lambda x: (order.get(x['verdict'], 9), -x['authored'])):
        print('  %-*s  %-5d  %-11s %s' % (w, row['verb'], row['authored'], row['verdict'], row['why']))
    print('\n  ' + '  '.join('%s=%d' % (k, v) for k, v in r['totals'].items() if v))
    dead = [x for x in r['rows'] if x['verdict'] in ('INERT', 'UNPARSED')]
    if dead:
        print('\n  %d AUTHORED LINES GO NOWHERE: %s'
              % (sum(x['authored'] for x in dead), ', '.join(x['verb'] for x in dead)))
    print('  wrote ' + OUT)


if __name__ == '__main__':
    main()
