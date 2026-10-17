#!/usr/bin/env python3
"""THE QUARTERMASTER'S LINE: THE ONE LINE EVERY COOK PAGE OPENS WITH (COOK, 10/16/26; rule 100c
as amended in sweep AJ and AL: "the one line every cook page opens with now reads from your index
until PLUMBER's command exists; write the line's exact shape at the top of the index so the four
cooks copy it").

WHY A LINE AND WHY FROM THE INDEX: his rule 82a is "look again", proven three times (210 of 294
packs never opened; 35 wrecked cars and a full gun set sat approved and unused while a lane
repainted cars for eight rounds; "Weapons and armory" turned out to be viking axes). A cook that
opens by COUNTING WHAT HE ALREADY OWNS for the thing it is about to make cannot make that mistake,
and a count that is typed can lie, so the line is READ from reference/art_bank_index/INDEX.json
(all 294 packs, 8,674 tiles) and from reference/art_bank/CORPUS.json (the approved 1,927) by this
tool, and never typed.

THE SHAPE (one line, in this order, every field present):

  QUARTERMASTER <m/d> | cooking: <the thing> | he owns: <T> tiles in <P> packs that match
  (<A> approved, <U> never judged) | packs: <name> <tiles>/<approved>; ... | nearest: <pack>#<i>
  <WxH> <approved|never judged>; ... | verdict: USE IT | COMPOSE BESIDE IT | LOOK AT THE
  UNJUDGED FIRST | OWNS ZERO, BUY OR COMMISSION | index <sha>

  USE IT                        he owns an approved piece that fits: place it, cut it, layer it
  COMPOSE BESIDE IT             he owns it and the round composes a version to score against it
  LOOK AT THE UNJUDGED FIRST    the match is in the 6,747 nobody judged; open the sheet before cooking
  OWNS ZERO, BUY OR COMMISSION  the count says zero; the hole goes to the pack card or the hero brief

HOW TO USE IT:

  python3 tools/bohemia_quartermaster_line.py "a kerb for the fight board" --family road marking
  python3 tools/bohemia_quartermaster_line.py "a gun" --packs "12. Weapons and supplies"
  python3 tools/bohemia_quartermaster_line.py "a lamp post" --words lamp light --nearest "18. Light sources and fire barrels#3"
  ... --verdict "COMPOSE BESIDE IT (he owns both; his tile is the score)"   to state the verdict yourself

  --family   one or more index families (prop settlement ground road door lamp marking weapon animal)
  --packs    exact pack names from the index
  --words    words matched against pack names, case-insensitive, any one matching counts
  --nearest  pack tile keys (<pack>#<idx>) you looked at; each is checked against the approved set
  --verdict  your own verdict text; without it the tool picks from the count
  --json     the same answer as a JSON object, for a tool that wants the numbers

The line is printed to stdout and nothing is written. A cook tool runs this first and pastes the
line at the top of its page and its card. REUSE CHECK: reads the index and the corpus, decides
nothing about art.
"""
import json, os, sys, argparse, subprocess, datetime

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INDEX = os.path.join(ROOT, 'reference/art_bank_index/INDEX.json')
CORPUS = os.path.join(ROOT, 'reference/art_bank/CORPUS.json')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('thing')
    ap.add_argument('--family', nargs='*', default=[])
    ap.add_argument('--packs', nargs='*', default=[])
    ap.add_argument('--words', nargs='*', default=[])
    ap.add_argument('--nearest', nargs='*', default=[])
    ap.add_argument('--verdict', default=None)
    ap.add_argument('--json', action='store_true')
    a = ap.parse_args()

    idx = json.load(open(INDEX))
    entries = idx['entries']
    approved = {}
    try:
        for r in json.load(open(CORPUS))['tiles'].values():
            approved[r['key'][5:]] = (r.get('w'), r.get('h'))
    except Exception:
        pass

    hits = {}
    for name, e in entries.items():
        fam_ok = e.get('family') in a.family
        pack_ok = name in a.packs
        word_ok = any(w.lower() in name.lower() for w in a.words)
        if fam_ok or pack_ok or word_ok:
            hits[name] = e
    missing = [p for p in a.packs if p not in entries]
    if missing:
        sys.exit('REFUSED: these packs are not in the index: ' + ', '.join(missing))

    T = sum(e.get('tiles', 0) for e in hits.values())
    A = sum(e.get('approved', 0) or 0 for e in hits.values())
    U = T - A
    packs_txt = '; '.join('%s %d/%d' % (n, e.get('tiles', 0), e.get('approved', 0) or 0)
                          for n, e in sorted(hits.items(), key=lambda kv: -(kv[1].get('approved', 0) or 0))[:8])
    if len(hits) > 8:
        packs_txt += '; and %d more' % (len(hits) - 8)

    near = []
    for k in a.nearest:
        pack = k.rsplit('#', 1)[0]
        if pack not in entries:
            sys.exit('REFUSED: nearest %s names a pack that is not in the index' % k)
        if k in approved:
            w, h = approved[k]
            near.append('%s %sx%s approved' % (k, w, h))
        else:
            near.append('%s never judged' % k)

    if a.verdict:
        verdict = a.verdict
    elif T == 0:
        verdict = 'OWNS ZERO, BUY OR COMMISSION'
    elif A > 0:
        verdict = 'USE IT'
    else:
        verdict = 'LOOK AT THE UNJUDGED FIRST'

    try:
        sha = subprocess.run(['git', 'log', '-1', '--format=%h', '--', INDEX], capture_output=True,
                             text=True, cwd=ROOT).stdout.strip() or 'uncommitted'
    except Exception:
        sha = 'unknown'
    today = datetime.date.today()
    line = ('QUARTERMASTER %d/%d | cooking: %s | he owns: %d tiles in %d packs that match (%d approved, %d never judged)'
            ' | packs: %s | nearest: %s | verdict: %s | index %s'
            % (today.month, today.day, a.thing, T, len(hits), A, U, packs_txt or 'none',
               '; '.join(near) or 'none named', verdict, sha))
    if a.json:
        print(json.dumps(dict(thing=a.thing, tiles=T, packs=len(hits), approved=A, never_judged=U,
                              pack_list=sorted(hits), nearest=near, verdict=verdict, index_sha=sha, line=line), indent=1))
    else:
        print(line)


if __name__ == '__main__':
    main()
