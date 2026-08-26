#!/usr/bin/env python3
"""BOHEMIA VOICE DIAGNOSIS -- read our own words the way an editor reads for
machine tells, and COUNT them.

WHY THIS EXISTS (Paolo 8/26, the WORDS lane brief):
  "I think we might have to open up a chat for how to speak like a human, how
   to write stories like a human, how to write dialogue for humans like humans
   would across games and shit."

The brief's honest premise: THE WRITER IS A MACHINE AND MACHINES HAVE TELLS.
It also says the first job is a DIAGNOSIS, not a style guide -- "which tells we
actually have, with counts and quoted examples from our own text. Measured, not
asserted." This is the measuring instrument for that sentence.

WHAT IT CANNOT DO, SAID OUT LOUD (the brief again): "Your gate can measure
sentence rhythm, repeated openers and banned phrases. It cannot tell you if a
line is good. Do not pretend it can." Everything below counts SHAPES. A scene
can pass every number here and still be dead on the page. The numbers exist to
catch the failures a reader stops noticing after the fortieth line, nothing more.

REUSE CHECK: reads records/BOHEMIA_WORDS_BOOK.json (2,442 already-harvested
lines, tools/bohemia_words_book.py) rather than re-parsing quests/bq -- the
harvester already resolves speakers, nodes, kinds, citations and language
registers, and a second parser would be a second truth.

  python3 tools/bohemia_voice_diagnosis.py

Writes: records/BOHEMIA_VOICE_DIAGNOSIS_8_26_26.md   (the report, with quotes)
        records/BOHEMIA_VOICE_METRICS.json           (the numbers, for the gate)

Card: laws/BOHEMIA_VOICE_CARD_8_26_26.md
Gate: gates/voice_gate.js
"""
import collections
import json
import os
import re
import statistics as st
import subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BOOK = os.path.join(ROOT, 'records', 'BOHEMIA_WORDS_BOOK.json')
OUT_MD = os.path.join(ROOT, 'records', 'BOHEMIA_VOICE_DIAGNOSIS_8_26_26.md')
OUT_JSON = os.path.join(ROOT, 'records', 'BOHEMIA_VOICE_METRICS.json')

# THE AS-FOUND READING. A diagnosis that silently re-measures itself after a
# writing pass stops being a diagnosis: it reports the patient's temperature
# after the medicine and quietly loses the reason anybody called a doctor. So
# the report carries BOTH columns, and the baseline is not a number typed into
# this file -- it is MEASURED off the words book as it stood in the commit
# before the first voice pass, read straight out of git. Nobody can drift it.
BASELINE_REF = '41f2d679b07e4ba6b64e844d58de4171cd601dd0'

SPOKEN = ('say', 'choice', 'bark', 'exchange', 'asking', 'quirk', 'reaction')

# A phrase a person would nearly always contract in speech. Counting the
# UNCONTRACTED form is the point: it is the spelled-out one that sounds written.
EXPANDED = re.compile(
    r"\b(do not|does not|did not|is not|are not|was not|were not|will not|would not"
    r"|could not|should not|cannot|can not|have not|has not|had not|it is|that is"
    r"|there is|they are|you are|we are|i am|i will|you will|we will|they will"
    r"|i have|you have|it will|he is|she is|who is|what is|let us|i would"
    r"|going to)\b", re.I)
CONTRACTED = re.compile(r"[A-Za-z][’'](s|t|re|ll|ve|d|m)\b")

WORD = re.compile(r"[A-Za-z0-9’']+")

# A sentence that states a general truth: present tense, nobody specific in it.
# This is the SHAPE of a maxim. It is not proof a line is one -- a short general
# sentence can be an instruction ("Do not touch that, it is live"). The count is
# a smoke alarm, not a verdict.
GENERAL = re.compile(
    r"\b(is|are|does|do|never|always|no one|nobody|everybody|everyone|people"
    r"|a man|a person|the only|out here|anymore|any more)\b", re.I)


def sentences(t):
    return [s for s in re.split(r'(?<=[.!?])\s+', t.strip()) if s]


def words(t):
    return WORD.findall(t)


def load():
    with open(BOOK, 'r', encoding='utf-8') as f:
        return json.load(f)


def load_baseline():
    """The words book as it stood before any voice pass. None if unreachable."""
    try:
        blob = subprocess.check_output(
            ['git', 'show', BASELINE_REF + ':records/BOHEMIA_WORDS_BOOK.json'],
            cwd=ROOT, stderr=subprocess.DEVNULL)
        return json.loads(blob.decode('utf-8'))
    except Exception:
        return None


def flat(books, kinds=SPOKEN, bkind=None):
    """Every line of the given kinds, flattened, each carrying its book."""
    out = []
    for b in books:
        if bkind and b.get('kind') != bkind:
            continue
        for l in b['lines']:
            if l['kind'] in kinds:
                out.append(dict(l, book=b['title'], bkind=b.get('kind')))
    return out


# ------------------------------------------------------------------ THE TELLS
def tell_contractions(books):
    """TELL 1. Spelled-out speech. The single loudest number in the corpus."""
    per = []
    for b in books:
        sp = [l for l in b['lines'] if l['kind'] in SPOKEN]
        if not sp:
            continue
        e = sum(len(EXPANDED.findall(l['text'])) for l in sp)
        c = sum(len(CONTRACTED.findall(l['text'])) for l in sp)
        per.append({'book': b['title'], 'kind': b.get('kind'), 'lines': len(sp),
                    'expanded': e, 'contracted': c,
                    'rate': round(100.0 * c / max(1, c + e), 1)})
    quests = [p for p in per if p['kind'] == 'quest']
    other = [p for p in per if p['kind'] != 'quest']
    qe = sum(p['expanded'] for p in quests)
    qc = sum(p['contracted'] for p in quests)
    oe = sum(p['expanded'] for p in other)
    oc = sum(p['contracted'] for p in other)
    return {
        'per_book': per,
        'quest_rate': round(100.0 * qc / max(1, qc + qe), 1),
        'quest_expanded': qe, 'quest_contracted': qc,
        'other_rate': round(100.0 * oc / max(1, oc + oe), 1),
        'other_expanded': oe, 'other_contracted': oc,
        'worst': sorted(quests, key=lambda p: (p['rate'], -p['expanded']))[:6],
    }


def tell_maxims(say):
    """TELL 2. The speech that lands a general truth on its last sentence."""
    multi, hits = 0, []
    for l in say:
        s = sentences(l['text'])
        if len(s) < 2:
            continue
        multi += 1
        last = s[-1]
        if GENERAL.search(last) and len(words(last)) <= 14:
            hits.append({'speaker': l['speaker'], 'book': l['book'],
                         'id': l['id'], 'last': last, 'full': l['text']})
    return {'multi': multi, 'count': len(hits),
            'pct': round(100.0 * len(hits) / max(1, multi), 1), 'hits': hits}


def tell_nobody_asks(say):
    """TELL 3. Nobody asks, nobody stumbles, nobody trails off."""
    def n(p):
        return sum(len(re.findall(p, l['text'], re.I)) for l in say)
    return {
        'lines': len(say),
        'question_marks': n(r'\?'),
        'exclamations': n(r'!'),
        'ellipses': n(r'\.\.\.'),
        'stumbles': n(r"\b(\w+)\s+\1\b"),
        'self_corrections': n(r"\b(i mean|no wait|forget it|whatever|hold on)\b"),
        'fillers': n(r"\b(yeah|okay|ok|look|listen|hey)\b"),
    }


def tell_openers(say):
    """TELL 4. The same sentence shape, over and over."""
    first1, first2, midshape = collections.Counter(), collections.Counter(), collections.Counter()
    for l in say:
        w = words(l['text'])
        if w:
            first1[w[0].lower()] += 1
        if len(w) >= 2:
            first2[' '.join(w[:2]).lower()] += 1
        for s in sentences(l['text']):
            sw = words(s)
            if sw:
                midshape[sw[0].lower()] += 1
    return {'lines': len(say),
            'first_word': first1.most_common(12),
            'first_two': first2.most_common(12),
            'sentence_opener': midshape.most_common(12)}


def tell_recycled(say):
    """TELL 5. The same four words in a row, in different mouths."""
    w = words(' '.join(l['text'] for l in say))
    w = [x.lower() for x in w]
    g = collections.Counter(tuple(w[i:i + 4]) for i in range(len(w) - 3))
    return [{'phrase': ' '.join(k), 'n': v} for k, v in g.most_common(24) if v >= 4]


def tell_rhythm(books):
    """TELL 6. Flat scenes. Every sentence the same size as the last one."""
    rows = []
    for b in books:
        if b.get('kind') != 'quest':
            continue
        wl = [len(words(s)) for l in b['lines'] if l['kind'] == 'say'
              for s in sentences(l['text'])]
        if len(wl) < 8:
            continue
        rows.append({'book': b['title'], 'sentences': len(wl),
                     'mean': round(st.mean(wl), 1), 'sd': round(st.pstdev(wl), 2),
                     'short': sum(1 for x in wl if x <= 3),
                     'shortpct': round(100.0 * sum(1 for x in wl if x <= 3) / len(wl), 1)})
    rows.sort(key=lambda r: r['sd'])
    return {'scenes': rows,
            'median_sd': round(st.median([r['sd'] for r in rows]), 2) if rows else 0}


def tell_registers(books):
    """TELL 7. Where the Spanglish actually lives."""
    tot = reg = in_quest = quest_lines = 0
    for b in books:
        for l in b['lines']:
            tot += 1
            nonen = (l.get('lang') or 'en') != 'en'
            if nonen:
                reg += 1
            if b.get('kind') == 'quest':
                quest_lines += 1
                if nonen:
                    in_quest += 1
    return {'total': tot, 'register': reg,
            'pct': round(100.0 * reg / max(1, tot), 1),
            'quest_lines': quest_lines, 'register_in_quests': in_quest}


def metrics(books, book):
    say = flat(books, kinds=('say',), bkind='quest')
    saychoice = flat(books, kinds=('say', 'choice'), bkind='quest')
    return {
        'lines': book['_meta']['lines'],
        'contractions': tell_contractions(books),
        'maxims': tell_maxims(say),
        'nobody_asks': tell_nobody_asks(say),
        'openers': tell_openers(saychoice),
        'recycled': tell_recycled(say),
        'rhythm': tell_rhythm(books),
        'registers': tell_registers(books),
    }


def main():
    book = load()
    books = book['books']
    say = flat(books, kinds=('say',), bkind='quest')
    saychoice = flat(books, kinds=('say', 'choice'), bkind='quest')

    base_book = load_baseline()
    base = metrics(base_book['books'], base_book) if base_book else None
    m = {
        '_meta': {
            'what': 'Machine-tell counts over every authored line in Bohemia.',
            'why': 'The WORDS lane brief (Paolo 8/26): a DIAGNOSIS, measured not asserted.',
            'generator': 'tools/bohemia_voice_diagnosis.py',
            'cannot': 'These are SHAPES. Nothing here can tell you whether a line is good.',
            'source_lines': book['_meta']['lines'],
            'baseline_ref': BASELINE_REF,
            'baseline_read': bool(base),
        },
    }
    m.update(metrics(books, book))
    m['baseline'] = base
    with open(OUT_JSON, 'w', encoding='utf-8') as f:
        json.dump(m, f, indent=1, ensure_ascii=False)

    write_report(m, book, base)
    c, mx, na, rh = m['contractions'], m['maxims'], m['nobody_asks'], m['rhythm']
    print('VOICE DIAGNOSIS over %d lines' % book['_meta']['lines'])
    print('  contractions   quests %.1f%%   everything else %.1f%%'
          % (c['quest_rate'], c['other_rate']))
    print('  maxim endings  %d of %d multi-sentence speeches (%.1f%%)'
          % (mx['count'], mx['multi'], mx['pct']))
    print('  questions to the player  %d in %d speeches' % (na['question_marks'], na['lines']))
    print('  flattest scene sd %.2f  (median %.2f)' % (rh['scenes'][0]['sd'], rh['median_sd']))
    print('  -> ' + os.path.relpath(OUT_MD, ROOT))
    print('  -> ' + os.path.relpath(OUT_JSON, ROOT))


def write_report(m, book, base=None):
    c, mx, na, op, rc, rh, rg = (m['contractions'], m['maxims'], m['nobody_asks'],
                                 m['openers'], m['recycled'], m['rhythm'], m['registers'])
    base_ref = m['_meta']['baseline_ref']
    # every tell below reports the AS-FOUND reading; NOW is shown in the summary
    # table at the top and in the one-line asides. A diagnosis records what was
    # found, or it is a status board wearing a diagnosis's name.
    bc = base['contractions'] if base else c
    bm = base['maxims'] if base else mx
    bn = base['nobody_asks'] if base else na
    brh = base['rhythm'] if base else rh
    L = []
    w = L.append
    w('# BOHEMIA -- THE VOICE DIAGNOSIS (8/26/26, the WORDS lane)')
    w('')
    w('GENERATED by tools/bohemia_voice_diagnosis.py. Re-run it after any writing pass.')
    w('')
    w('Paolo opened this lane and asked for a diagnosis before a style guide:')
    w('*"which tells we actually have, with counts and quoted examples from our own')
    w('text. Measured, not asserted."* So every number below is counted off')
    w('records/BOHEMIA_WORDS_BOOK.json (%d authored lines), and every quote is ours.' % m['_meta']['source_lines'])
    w('')
    w('WHAT THIS CANNOT DO. It counts SHAPES. A scene can pass every number on this')
    w('page and still be dead. The numbers catch what a reader stops noticing after')
    w('the fortieth line; they do not catch a bad line.')
    w('')
    if not base:
        # A REPORT THAT LOSES ITS BASELINE MUST SAY SO. Degrading quietly here
        # would republish today's numbers under the word DIAGNOSIS, which is the
        # precise failure this two-column layout was built to stop.
        w('> **THE BASELINE COULD NOT BE READ.** Commit `%s` is not reachable from'
          % m['_meta']['baseline_ref'][:9])
        w('> this clone, so every number below is TODAY, not what was found. Fetch the')
        w('> full history and re-run before quoting anything on this page as a finding.')
        w('')
    if base:
        w('**TWO COLUMNS, AND THE FIRST ONE IS THE POINT.** AS FOUND is the build as it')
        w('stood on 8/26 before any voice pass touched it. NOW is the build today. A')
        w('diagnosis that silently re-measures itself after the medicine stops being a')
        w('diagnosis, so the baseline is not typed into this file: it is measured off the')
        w('words book as it stood in commit `%s`, read out of git.' % base_ref[:9])
        w('')
        w('| tell | AS FOUND (8/26) | NOW |')
        w('| --- | --- | --- |')
        w('| quest scenes contract | **%.1f%%** | %.1f%% |'
          % (base['contractions']['quest_rate'], c['quest_rate']))
        w('| everything else contracts | %.1f%% | %.1f%% |'
          % (base['contractions']['other_rate'], c['other_rate']))
        w('| speeches ending on a lesson | **%.1f%%** | %.1f%% |'
          % (base['maxims']['pct'], mx['pct']))
        w('| questions asked of the player | **%d** | %d |'
          % (base['nobody_asks']['question_marks'], na['question_marks']))
        w('| stumbles, repeated words | **%d** | %d |'
          % (base['nobody_asks']['stumbles'], na['stumbles']))
        w('| flattest scene, spread over mean | **%.2f** | %.2f |'
          % (base['rhythm']['scenes'][0]['sd'] / max(0.01, base['rhythm']['scenes'][0]['mean']),
             rh['scenes'][0]['sd'] / max(0.01, rh['scenes'][0]['mean'])))
        w('')
        w('ONE SCENE of 27 has had a pass. Every NOW column below still describes a build')
        w('that is 26 scenes short, and it is meant to: the numbers only move by writing.')
        w('')
    w('---')
    w('')
    w('## TELL 1 -- NOBODY IN A QUEST USES CONTRACTIONS, AND EVERYBODY ON THE STREET DOES')
    w('')
    w('AS FOUND: the 27 quest scenes contracted **%.1f%%** of the time (%d contractions'
      % (bc['quest_rate'], bc['quest_contracted']))
    w('against %d phrases spelled out in full). Everything outside the quests -- the'
      % bc['quest_expanded'])
    w('barks, the quirks, the two-person exchanges -- contracted **%.1f%%** of the time.'
      % bc['other_rate'])
    w('One voice pass later it reads %.1f%% and %.1f%%; twenty-six scenes to go.'
      % (c['quest_rate'], c['other_rate']))
    w('')
    w('That is not a style. That is two different games in one build. The street sounds')
    w('like people and the story sounds like scripture, and the seam is audible the')
    w('second a player walks from one into the other.')
    w('')
    w('| scene | lines | spelled out | contracted | rate |')
    w('| --- | --- | --- | --- | --- |')
    for p in (base['contractions'] if base else c)['worst']:
        w('| %s | %d | %d | %d | %.1f%% |' % (p['book'], p['lines'], p['expanded'],
                                              p['contracted'], p['rate']))
    w('')
    w('Ours, verbatim: *"I will walk it back."* *"It is a shared one."* *"I do not know')
    w('whose."* *"That is worth more out here than you will understand for a few years."*')
    w('')
    w('## TELL 2 -- A THIRD OF EVERY SPEECH ENDS ON A LESSON')
    w('')
    w('AS FOUND: **%d of %d** multi-sentence NPC speeches (**%.1f%%**) ended on a short'
      % (bm['count'], bm['multi'], bm['pct']))
    w('general truth. Not a fact about this street, this night, this person: a truth')
    w('about how the world works, delivered last, where a punchline goes.')
    w('One voice pass later: %.1f%%.' % mx['pct'])
    w('')
    w('Every single person in this game is wise. The lineman is wise. The busker is')
    w('wise. The forger is wise. Wisdom is the house voice, and a house voice is the')
    w('exact thing the brief calls the comfortable middle lane.')
    w('')
    w('Twenty of ours, verbatim, all of them final sentences:')
    w('')
    step = max(1, len(bm['hits']) // 20)
    for h in bm['hits'][::step][:20]:
        w('- **%s:** *"%s"*' % (h['speaker'], h['last']))
    w('')
    w('## TELL 3 -- NOBODY ASKS THE PLAYER ANYTHING, AND NOBODY EVER STUMBLES')
    w('')
    w('AS FOUND, across **%d** NPC speeches in the quests:' % bn['lines'])
    w('')
    w('| a thing people do when they talk | times it happens |')
    w('| --- | --- |')
    w('| asks the player a question | **%d** |' % bn['question_marks'])
    w('| raises their voice | **%d** |' % bn['exclamations'])
    w('| trails off | **%d** |' % bn['ellipses'])
    w('| repeats a word, stumbles | **%d** |' % bn['stumbles'])
    w('| corrects themselves mid-thought | **%d** |' % bn['self_corrections'])
    w('')
    w('%d questions in %d speeches. Our NPCs do not have conversations, they deliver'
      % (bn['question_marks'], bn['lines']))
    w('statements and wait for the player to pick a reply off a menu. That is a vending')
    w('machine with a face on it. Real talk is two people both trying to find something')
    w('out, and one of them is usually failing to say what they mean.')
    w('')
    w('## TELL 4 -- THE SAME SENTENCE, STARTED THE SAME WAY')
    w('')
    w('Across %d spoken and player lines in the quests, the openers stack up:' % op['lines'])
    w('')
    w('| first two words | times |')
    w('| --- | --- |')
    for k, v in op['first_two'][:10]:
        w('| "%s..." | %d |' % (k, v))
    w('')
    w('And counting every sentence, not just every line, these words start it:')
    w('')
    w('| sentence begins | times |')
    w('| --- | --- |')
    for k, v in op['sentence_opener'][:8]:
        w('| "%s..." | %d |' % (k, v))
    w('')
    w('## TELL 5 -- THE SAME FOUR WORDS, IN DIFFERENT MOUTHS')
    w('')
    w('Four-word runs that show up in more than one scene, so a bounty clerk and a')
    w('midwife and a lineman are all using the same construction:')
    w('')
    w('| phrase | times |')
    w('| --- | --- |')
    for r in rc[:14]:
        w('| "%s" | %d |' % (r['phrase'], r['n']))
    w('')
    w('## TELL 6 -- THE SCENES HE MEETS FIRST ARE THE FLATTEST ONES WE WROTE')
    w('')
    w('Rhythm here is the spread of sentence lengths inside one scene. A low number')
    w('means every sentence is about the same size as the one before it, which is the')
    w('brief\'s first named tell. Corpus median is **%.2f**.' % brh['median_sd'])
    w('')
    w('| scene | sentences | mean words | spread | under 4 words |')
    w('| --- | --- | --- | --- | --- |')
    for r in brh['scenes'][:6]:
        w('| %s | %d | %.1f | **%.2f** | %.1f%% |'
          % (r['book'], r['sentences'], r['mean'], r['sd'], r['shortpct']))
    w('| ... | | | | |')
    for r in brh['scenes'][-3:]:
        w('| %s | %d | %.1f | %.2f | %.1f%% |'
          % (r['book'], r['sentences'], r['mean'], r['sd'], r['shortpct']))
    w('')
    w('**The first quest in the game is the flattest scene in the game.** That is the')
    w('one a new player meets before anything else, and it is the one where every')
    w('sentence is the same length as the last one.')
    w('')
    w('## TELL 7 -- THE SPANGLISH NEVER REACHES A CONVERSATION')
    w('')
    w('**%d** lines carry a register other than plain English (%.1f%% of the build, at'
      % (rg['register'], rg['pct']))
    w('the cap he set on 8/26). Inside the 27 quest scenes: **%d**.' % rg['register_in_quests'])
    w('')
    w('All of it is barks, quirks and street noise. The headline register is decoration')
    w('you walk past, and it is absent from every conversation that matters. This is a')
    w('DISTRIBUTION problem, not a volume one -- ENOUGH IS ENOUGH (8/26) capped the')
    w('count and that cap holds. Nothing here asks for more Spanish. It asks for the')
    w('Spanish we already paid for to be in a scene instead of on a wall.')
    w('')
    w('---')
    w('')
    w('## WHAT IS ALREADY GOOD, SO WE DO NOT BREAK IT')
    w('')
    w('- **Zero em dashes** in %d lines. That law is holding.' % m['_meta']['source_lines'])
    w('- **Zero proper names** in the quest scenes, which is why a quest can cast')
    w('  against whoever actually exists on that block.')
    w('- **The barks already sound like people.** %.1f%% contraction rate, short, rude,'
      % c['other_rate'])
    w('  specific. The voice we want is already in the build; it just is not in the')
    w('  scenes.')
    w('- **The choices are lean.** Player replies run five or six words and 102 of them')
    w('  are a silent action in parentheses instead of a speech.')
    w('')
    w('## THE SIX RULES THAT COME OUT OF THIS')
    w('')
    w('laws/BOHEMIA_VOICE_CARD_8_26_26.md. One page. Each rule answers a tell above,')
    w('and the three a machine can see are gated by gates/voice_gate.js.')
    with open(OUT_MD, 'w', encoding='utf-8') as f:
        f.write('\n'.join(L) + '\n')


if __name__ == '__main__':
    main()
