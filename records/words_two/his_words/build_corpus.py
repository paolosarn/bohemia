#!/usr/bin/env python3
"""
build_corpus.py -- builds corpus.jsonl of Paolo's own sentences. READ-ONLY on the repo.

Sources (all inside /home/user/bohemia):
  (a) records/target/BOHEMIA_VOTE_REGISTRY.json   verdicts[].said (typed in the VOTE tab), items[].said (quote-backs)
  (b) records/BOHEMIA_PAOLO_*.md|.txt and records/*VOTE*.txt
  (c) VAMILY.md and CLAUDE.md: quotes attributed "Paolo <m/d> ... '...'"

Nothing is invented: every text is a span copied from a file. The only edits are mechanical:
whitespace collapsed, hard line wraps joined, curly quotes straightened, markdown '> ' / '# '
continuation prefixes that sit inside a wrapped quote removed.

Each row: text, source_file, date_if_known, channel (typed_vote | voice_record | vamily_quote) plus:
  kind        vote_comment | anything_else_box | message_with_export | verbatim_block | inline_fragment |
              attributed_quote | card_quoteback
  verbatim    True  = a raw export row, or a block the record itself labels as his words
              False = known to be entered or condensed by the coordinator (not typed by him)
              None  = quoted inline by the coordinator or a lane; may be trimmed or tidied, not checkable
  has_cut     the span contains '...' (the recorder cut words out)
  has_brackets  the span contains [editorial words] added by the recorder
  all_caps    no lowercase letter in it
  covered_by  share (0..1) of this quote's word 3-grams found in OTHER, longer verbatim rows
  contained_exact  the whole quote sits word for word inside a longer verbatim row
  in_stats    True if stats.py counts it (verbatim True and not contained in a longer verbatim row)
  repeat_count  how many times the exact same text was found anywhere (exact repeats are merged into one row)
  vote_count    (vote comments) on how many cards he cast these exact words
  input_guess   (verbatim rows) thumb | dictated | unclear: how it was most likely entered, by rule, a guess
  section, record_label, why   (record rows) the heading it sat under, the record's own label (e.g. 'verbatim, voice to text'),
                and which rule made it a his-words block: marker | his_words_section | title | whole_paragraph | continues
  attr_lead     (attributed quotes) the words between 'Paolo <m/d>' and the quote; lead_suspect = they suggest a law's text
  card_id, card_title, card_lane, card_kind, vote, star   (vote rows) the card the words were cast on
  text_full, note   when the vote box began with words pasted from the card, text is his own span and text_full is all of it
  also_in, other_cards   other files / other cards carrying the same exact text
"""
import json, re, glob, os, collections

import os as _os
REPO = _os.path.abspath(_os.path.join(_os.path.dirname(_os.path.abspath(__file__)), '..', '..', '..'))
OUT = os.path.dirname(os.path.abspath(__file__))
YEAR = 2026

def straight(s):
    return (s.replace('“', '"').replace('”', '"').replace('‘', "'").replace('’', "'")
             .replace('…', '...'))

def collapse(s):
    s = re.sub(r'\n[ \t]*(?:>|#+)[ \t]?', '\n', s)      # markdown continuation prefixes inside a wrapped quote
    return re.sub(r'\s+', ' ', s).strip()

def iso(m, d):
    try:
        m = int(m); d = int(d)
        if 1 <= m <= 12 and 1 <= d <= 31:
            return '%04d-%02d-%02d' % (YEAR, m, d)
    except Exception:
        pass
    return None

def date_from_name(fn):
    m = re.search(r'_(\d{1,2})_(\d{1,2})_26[a-z]?\.(?:md|txt)$', fn)
    return iso(m.group(1), m.group(2)) if m else None

def words(s):
    return re.findall(r"[A-Za-z0-9]+(?:'[A-Za-z]+)?", s.lower())

rows = []
def add(text, source, date, channel, kind, verbatim, **extra):
    text = collapse(straight(text)).strip()
    if not words(text):
        return None
    r = dict(text=text, source_file=source, date_if_known=date, channel=channel, kind=kind, verbatim=verbatim)
    r.update(extra)
    rows.append(r)
    return r

# =============================================================================================== (a) registry
reg_path = 'records/target/BOHEMIA_VOTE_REGISTRY.json'
reg = json.load(open(os.path.join(REPO, reg_path), encoding='utf-8'))
items = {i['id']: i for i in reg['items']}

# two card lines he pasted into the vote box before his own words (the cards' text has since been rewritten)
PASTED_CARD_TEXT = ["every lash cuts your own man's hands for 1 or 2 unless he wears heavy armour (the game has no gloves yet).",
                    "every lash burns one battery from your purse, landed or not"]
COORD_ENTERED = re.compile(r"\(rule \d+|by his word to the coordinator|in the coordinator chat", re.I)
for v in reg['verdicts']:
    s = v.get('said', '')
    if not s or not s.strip():
        continue
    it = items.get(v['id'], {})
    m = re.match(r'(\d+)/(\d+)', v.get('when', '') or '')
    date = iso(m.group(1), m.group(2)) if m else None
    coord = bool(COORD_ENTERED.search(s)) or ('from' in v)
    note = 'entered by the coordinator from his spoken words, not typed by him' if coord else None
    full = None
    # he sometimes pasted a line of the card into the box and typed under it: keep only his own span
    pasted = None
    for cand in PASTED_CARD_TEXT + [x for x in (it.get('why') or '',) if x]:
        cw = words(cand); sw = words(s)
        k = 0
        while k < len(cw) and k < len(sw) and cw[k] == sw[k]:
            k += 1
        if k >= 6 and k < len(sw):
            pasted = k
            break
    if pasted:
        # cut the raw string after the k-th word, at the original characters
        mm = list(re.finditer(r"[A-Za-z0-9]+(?:'[A-Za-z]+)?", straight(s)))
        cut = mm[pasted].start()
        full = collapse(straight(s))
        s = straight(s)[cut:]
        note = 'the box began with %d words pasted from the card; only his own words are kept (text_full has all of it)' % pasted
    add(s, reg_path + ' verdicts[]', date, 'typed_vote', 'vote_comment',
        False if coord else True,
        card_id=v['id'], vote=v.get('vote'), star=True if v.get('star') else None,
        card_title=it.get('title'), card_lane=it.get('lane'), card_kind=it.get('kind'),
        note=note, text_full=full)

# items[].said : a lane quoting his words back on a redo card (cut with '...', joined with ' / ')
for it in reg['items']:
    s = it.get('said')
    if s and isinstance(s, str) and not re.match(r"\s*(FOUND BY|\(the play-tester|\(your NO|no vote on|the ladder's)", s):
        for piece in re.split(r'\s+/\s+', s):
            add(piece, reg_path + ' items[].said', None, 'voice_record', 'card_quoteback', None,
                card_id=it['id'], card_title=it.get('title'), card_lane=it.get('lane'), card_kind=it.get('kind'),
                card_made=it.get('made'))
    hw = it.get('hisWords')
    if isinstance(hw, str):
        for piece in re.split(r'\s+/\s+', hw):
            add(piece, reg_path + ' items[].hisWords', None, 'typed_vote', 'card_quoteback', None,
                card_id=it['id'], card_title=it.get('title'), card_lane=it.get('lane'), card_kind=it.get('kind'))

# =============================================================================================== quote finders
DQ = re.compile(r'"([^"]{2,})"', re.S)
# single quotes: an apostrophe followed by a letter is inside a word (don't, I'm), never a closer
SQ = re.compile(r"(?<![A-Za-z0-9])'((?:[^'\n]|\n(?!\s*\n)|'(?=[A-Za-z])|(?<=Brothers)'(?= [a-z]))+?)'(?![A-Za-z])(?!(?<=Brothers') [a-z])")
ATTR = re.compile(r"\b(PAOLO|Paolo)(?:'s)?,?\s+(\d{1,2})/(\d{1,2})(?:/(?:20)?26)?")
GAP1 = re.compile(r"(?:[^'\"\n]|(?<=[A-Za-z])'(?=[a-z])|\n(?!\s*\n)){0,180}?(?=\"|(?<![A-Za-z0-9])')")
GAPN = re.compile(r"(?:[^'\"\n]|(?<=[A-Za-z])'(?=[a-z])|\n(?!\s*\n)){0,50}?(?=\"|(?<![A-Za-z0-9])')")
CHAIN = re.compile(r"^\s*(?:[;,+:]|\.\.\.)?\s*(?:and |then |and then |on [^'\"]{0,40}|said [^'\"]{0,20})?\s*$")

def attributed_quotes(t):
    """(c): 'Paolo <m/d>' + up to 180 chars with no quote mark and the bracket not closed + a quoted span,
    plus quoted spans chained straight after it ('a'; 'b' and 'c')."""
    out = []
    for m in ATTR.finditer(t):
        date = iso(m.group(2), m.group(3))
        pos = m.end()
        n = 0
        while True:
            g = (GAP1 if n == 0 else GAPN).match(t, pos)
            if not g:
                break
            gap = g.group(0)
            if gap.count(')') > gap.count('(') and not re.match(r'^[^()]{0,90}\)\s*:\s*$', gap):
                break                                   # the attribution closed before the quote opened ("(Paolo 9/5, LOCKED): " is fine)
            if re.search(r"\.\s+[A-Z]", gap) and not re.search(r"(?i)his words|he said|verbatim|locked", gap):
                break                                   # a new sentence started: the quote is somebody else's
            if n and not CHAIN.match(gap):
                break
            qpos = g.end()
            if qpos >= len(t):
                break
            ch = t[qpos]
            if ch == '"':
                q = DQ.match(t, qpos)
            else:
                if qpos > 0 and t[qpos - 1].isalnum():
                    break
                q = SQ.match(t, qpos)
            if not q or len(q.group(1)) > (3000 if ch == '"' else 1400):
                break
            if '\n#' in q.group(1) or re.match(r'\s*[?/]', q.group(1)):
                break
            out.append((date, q.group(1), q.start(), q.end(), n, re.sub(r'\s+', ' ', gap).strip()[:120]))
            pos = q.end()
            n += 1
    return out

# =============================================================================================== (b) records
HIS_HEAD = re.compile(r'HIS WORDS|His words|WHAT HE SAID|What he said|HIS MESSAGE|[Vv]erbatim|VERBATIM|HIS NOTE|HIS ANSWER|'
                      r'HIS REPLY|HIS CORRECTION|HE ADDED')
NOT_HIS_HEAD = re.compile(r'WHAT I HEARD|MY READING|THE READING|HOW BATTLE BROTHERS|SOURCES|RESEARCH|EVIDENCE|PATCH SPEC|'
                          r'GATE SPEC|ROOT CAUSE|RISK|MEASURED|THE LAW|RULING|WHAT IT MEANS|LANES|ROUTED|What it|'
                          r'in plain lines')
MARK = re.compile(r"(?i)(his words|his own words|verbatim|his message|his reply|his answer|his note|his correction|"
                  r"he said|he says|he wrote|he typed|he asked|he added|he answered|he replied|said again|"
                  r"the question he asked|in his words|he played on his pc|anything else|the longest thing he said|"
                  r"then:|later:|and later|and again|again:|what it is to him:|sent twice:)")
STRICT = re.compile(r"(?i)(his words|his own words|verbatim|his message|his reply|his answer|his note|his correction|"
                    r"he said|he says|he wrote|he typed|he asked|he added|he answered|he replied|said again|"
                    r"the question he asked|he played on his pc|the longest thing he said|what it is to him|sent twice|"
                    r"message (?:one|two|three|four|five|\d+)|"
                    r"\bthen)[^\"]{0,110}(:|\u2014|--)$|(his words|verbatim)[^\"]{0,330}:$")
CONT = re.compile(r"^[\s,;.]*(?:and|then|and then|then:|later:|and later:|also:|and:|\+|-)?[\s:>]*$")
VOTE_MD = re.compile(r'(?:FIRST|SECOND|THIRD|FOURTH|FIFTH|SIXTH|SEVENTH|EIGHTH|NINTH|TENTH|ELEVENTH|TWELFTH)_VOTES')
GLOSS_POST = re.compile(r"\s*(?:=|is |means |was |\(=)")

rec_files = sorted(set(glob.glob(os.path.join(REPO, 'records/BOHEMIA_PAOLO_*.md')) +
                       glob.glob(os.path.join(REPO, 'records/BOHEMIA_PAOLO_*.txt')) +
                       glob.glob(os.path.join(REPO, 'records/*VOTE*.txt'))))
diag = []
for path in rec_files:
    fn = os.path.basename(path)
    rel = 'records/' + fn
    t = straight(open(path, encoding='utf-8', errors='replace').read())
    fdate = date_from_name(fn)
    is_txt = fn.endswith('.txt')
    is_vote_md = bool(VOTE_MD.search(fn)) and fn.endswith('.md')
    json_heavy = 'LIST_DIAGNOSED' in fn
    # consecutive '#' lines are one heading block (many records wrap a long title over several '#' lines)
    heads = [(m.start(), m.end(), m.group(0)) for m in re.finditer(r'^#+\s.*(?:\n#+\s.*)*$', t, flags=re.M)]
    def head_at(pos):
        h = (0, 0, '')
        for hh in heads:
            if hh[0] <= pos: h = hh
            else: break
        return h
    nb = nf = 0
    taken = []
    prev_end, prev_block = -1, False
    spans = []
    if not json_heavy:
        spans = [(m.start(), m.end(), m.group(1), '"') for m in DQ.finditer(t)]
    # single-quoted blocks introduced by HIS WORDS:
    for m in SQ.finditer(t):
        lead = t[max(0, m.start() - 90):m.start()]
        if re.search(r"(?i)(his words|his message)[^'\n]{0,60}:\s*$", lead):
            spans.append((m.start(), m.end(), m.group(1), "'"))
    spans.sort()
    for (a, b, s, qc) in spans:
        pre = t[max(0, a - 400):a]
        post = t[b:b + 14]
        nw = len(words(s))
        if qc == '"':
            if (re.match(r'\s*:', post) or GLOSS_POST.match(post)) and nw <= 6:
                continue                      # "awards" = words ; "key": value ; a gloss
            if re.search(r'[{\[,:]\s*$', pre) and re.match(r'\s*[:,\]}]', post):
                continue                      # JSON key / value / array member
            if re.search(r'=\s*$', pre) and nw <= 8:
                continue
            if re.search(r'\{"id"|"vote"\s*:|"said"\s*:|"when"\s*:', t[max(0, a - 40):b + 30]):
                continue                      # a JSON verdict row inside an export; the registry has it
        hs, he, h = head_at(a)
        in_heading = hs <= a < he
        # lead-in: the text between the previous double quote and this one, minus blank lines / '>' marks
        lead = re.sub(r'[\s>*-]+$', '', pre)
        i = lead.rfind('"') if qc == '"' else -1
        seg = (lead[i + 1:] if i >= 0 else lead)[-380:]
        gap_from_prev = t[prev_end:a] if prev_end >= 0 else None
        # strict lead-in: a his-words marker, then at most 110 chars, then a colon or dash right before the quote
        marker = bool(STRICT.search(seg.rstrip()))
        h1 = re.sub(r'^#+\s*', '', h)
        head_his = (not in_heading) and (
            bool(re.match(r'(HIS WORDS|His words|WHAT HE SAID|HIS MESSAGE|HIS NOTE|HIS ANSWER|HIS REPLY)\b', h1)) or
            bool(re.search(r'\([^()]*(?:verbatim|his words)[^()]*\)', h, re.I)))
        if head_his and re.search(r'in plain lines|read plain|ON EACH|WHO BUILDS', h1):
            head_his = False                  # the recorder's own digest of his words, cut and tidied
        all_caps = nw >= 4 and not re.search(r'[a-z]', re.sub(r'\[[^\]]*\]', '', s))
        # a paragraph that is nothing but one quoted span (optionally '> ' prefixed)
        para_a = t.rfind('\n\n', 0, a); para_b = t.find('\n\n', b)
        whole_para = (t[para_a + 2 if para_a >= 0 else 0:a].strip(' >\n') == '' and
                      t[b:para_b if para_b >= 0 else len(t)].strip() == '')
        if in_heading:
            # a quote inside a title: his words when the title is "# PAOLO <date> ...: "<quote>" in his own case,
            # or says verbatim before it; an ALL-CAPS title quote is the coordinator's headline of his words
            lead_h = t[hs:a].rstrip()
            no_lower = not re.search(r'[a-z]', re.sub(r'\[[^\]]*\]', '', s))
            lead_line = re.sub(r'^#+\s*', '', lead_h.split('\n')[-1]).strip()
            opens = bool(re.search(r'(:|--|\u2014)$', lead_h)) or lead_line in ('', 'and:', 'and', 'then:')
            is_block = (bool(re.match(r'#\s*PAOLO\b', h)) and opens and not no_lower)
            why = 'title' if is_block else None
            if not is_block and re.match(r'#\s*PAOLO\b', h) and opens and no_lower and nw >= 3:
                why = 'title_headline'        # the coordinator's ALL-CAPS headline of his words: kept, not verbatim
        else:
            is_block = marker or head_his
            why = 'marker' if marker else ('his_words_section' if head_his else None)
            if not is_block and prev_block and gap_from_prev is not None and len(gap_from_prev) <= 30 and CONT.match(gap_from_prev):
                is_block = True               # "aaa" and "bbb" straight after a his-words block
                why = 'continues'
            if is_block and nw < 4 and not (whole_para or marker):
                is_block = False              # one or two quoted words inside his-words prose are a gloss, not a message
                why = None
            if not is_block and whole_para and not is_txt and nw >= 3 and (
                    not NOT_HIS_HEAD.search(re.sub(r'\([^)]*\)', '', h)) or t[he:a].strip(' \n>') == ''):
                is_block = True               # a stand-alone quoted paragraph in a PAOLO record is his message
                why = 'whole_paragraph'
        if is_vote_md and (nw <= 30 or not re.search(r'(?i)anything else|his words|verbatim|his message', seg[-160:])):
            is_block = False                  # vote summaries quote the typed votes in a tidied form
        if is_txt:
            is_block = bool(re.search(r'(?i)anything else|his words|his message|verbatim|the longest thing he said', seg[-200:]))
        anything = bool(re.search(r'(?i)anything else[^"]{0,80}$', seg))
        typed = anything or is_vote_md or (is_txt and not re.search(r'(?i)his words|to the coordinator', seg[-200:]))
        channel = 'typed_vote' if typed else 'voice_record'
        kind = 'anything_else_box' if anything else ('verbatim_block' if is_block else 'inline_fragment')
        label = None
        mm = re.search(r'\(([^()]*(?:verbatim|voice|transcription|typed)[^()]*)\)', h + ' ' + seg)
        if mm:
            label = re.sub(r'\s+', ' ', mm.group(1))[:80]
        if anything and s.strip().startswith('('):
            continue
        # evidence that an inline fragment is HIS (not a rule text, a card line, a file name ...):
        attributed = bool(MARK.search(seg[-200:])) or bool(re.search(
            r"(?i)\b(his|he|paolo)\b[^.\"]{0,40}[:(]$|\b(his|paolo's) [a-z0-9/ ]{0,30}$", seg[-120:].rstrip()))
        add(s, rel, fdate, channel, kind, True if (is_block or anything) else None,
            section=(re.sub(r'\s+', ' ', h)[:90] or None), record_label=label,
            why=('anything_else' if anything else why), _lead=seg[-70:],
            _attributed=(attributed or is_vote_md or is_txt or why == 'title_headline' or
                         bool(re.search(r'(?i)his words|in one message|what he said', h)) and not in_heading and nw >= 3))
        taken.append((a, b))
        prev_end, prev_block = b, is_block
        if is_block: nb += 1
        else: nf += 1
    # unquoted export lines:  HIS MESSAGE WITH IT: ....   /  ANYTHING ELSE: ....  / ANYTHING ELSE\n<line>
    for m in re.finditer(r'(?m)^(HIS MESSAGE WITH IT|ANYTHING ELSE(?: \(his words\))?)\s*:?[ \t]*\n?([^\n"{(][^\n]{8,})$', t):
        txt = m.group(2).strip()
        if txt.lower().startswith('none') or txt[0] in '("\'' or '"' in txt or \
                re.search(r'(?i)already (logged|filed)|the same line|unchanged|\bexport\b|^box:', txt):
            continue                          # the coordinator's note about the box, or a quoted copy the DQ pass has
        add(txt, rel, fdate, 'typed_vote',
            'anything_else_box' if 'ANYTHING' in m.group(1) else 'message_with_export', True, section=m.group(1))
        nb += 1
    # attributed quotes (single or double) anywhere in the file: Paolo m/d ... '...'
    for date, q, a, b, n, gap in attributed_quotes(t):
        if any(x <= a < y for x, y in taken):
            continue
        add(q, rel, date, 'voice_record', 'attributed_quote', None, attr_lead=gap or None)
        nf += 1
    diag.append((fn, nb, nf))

# =============================================================================================== (c) VAMILY + CLAUDE
for fn in ('VAMILY.md', 'CLAUDE.md'):
    t = straight(open(os.path.join(REPO, fn), encoding='utf-8', errors='replace').read())
    for date, q, a, b, n, gap in attributed_quotes(t):
        add(q, fn, date, 'vamily_quote', 'attributed_quote', None, chained=(n if n else None), attr_lead=gap or None)

# the ANYTHING ELSE box holds one dictated line that rode along in every export; later exports print a tidied copy
for r in rows:
    if r['kind'] == 'anything_else_box' and ',' in r['text']:
        r['verbatim'] = None
        r['note'] = 'a tidied copy of the box line (commas and spelling by the coordinator); the raw line is the comma-less one'

# =============================================================================================== de-duplicate
PRIORITY = {('typed_vote', 'vote_comment'): 0, ('typed_vote', 'anything_else_box'): 1, ('typed_vote', 'message_with_export'): 1,
            ('voice_record', 'verbatim_block'): 2, ('typed_vote', 'verbatim_block'): 2,
            ('voice_record', 'inline_fragment'): 4, ('typed_vote', 'inline_fragment'): 4,
            ('voice_record', 'attributed_quote'): 5, ('voice_record', 'card_quoteback'): 6, ('typed_vote', 'card_quoteback'): 6,
            ('vamily_quote', 'attributed_quote'): 7}
rows.sort(key=lambda r: (PRIORITY.get((r['channel'], r['kind']), 9), 0 if r['verbatim'] else 1,
                         r['date_if_known'] or '9999', r['source_file']))
uniq = collections.OrderedDict()
for r in rows:
    k = r['text']
    if k in uniq:
        u = uniq[k]
        u['repeat_count'] += 1
        if r['source_file'] != u['source_file'] and r['source_file'] not in u.setdefault('also_in', []):
            u['also_in'].append(r['source_file'])
        if r.get('card_id') and r['kind'] == 'vote_comment' and u['kind'] == 'vote_comment':
            u.setdefault('other_cards', []).append(r['card_id'])
            u['vote_count'] += 1              # the same words cast on another card
        continue
    r['repeat_count'] = 1
    if r['kind'] == 'vote_comment':
        r['vote_count'] = 1
    uniq[k] = r
rows = list(uniq.values())

# =============================================================================================== coverage / in_stats
THUMB = re.compile(r"(?i)(?<![A-Za-z'])(u|ur|im|dont|cant|wont|isnt|doesnt|didnt|thats|theres|itll|youll|ive|idk|bc|tho|otw|rn|"
                   r"fr|frfr|asf|mfs|tf|pls|alot|lookin|makin|cmon|wouldnt|shouldnt|couldnt|arent|youre|theyre|whats|hes|"
                   r"heres|lets|w|ya|def|btw)(?![A-Za-z'])")

def grams(ws, n=3):
    return set(tuple(ws[i:i + n]) for i in range(len(ws) - n + 1))

def strip_editorial(s):
    return re.sub(r'\[[^\]]{0,80}\]', ' ', s)

for r in rows:
    r['has_cut'] = '...' in r['text']
    r['has_brackets'] = bool(re.search(r'\[[^\]]{1,80}\]', r['text']))
    r['all_caps'] = len(words(r['text'])) >= 2 and not re.search(r'[a-z]', strip_editorial(r['text']))
    r['_w'] = words(strip_editorial(r['text']))
    r['n_words'] = len(r['_w'])

verb = [r for r in rows if r['verbatim'] is True]
order = {id(r): i for i, r in enumerate(rows)}        # rows are already in priority order
index = collections.defaultdict(set)
for i, r in enumerate(verb):
    for g in grams(r['_w']):
        index[g].add(i)
verb_norm = [' ' + ' '.join(r['_w']) + ' ' for r in verb]

def may_cover(j, r):
    """verbatim row j may 'cover' row r if it is longer, or the same length and earlier in priority order"""
    v = verb[j]
    if v is r:
        return False
    if len(v['_w']) > len(r['_w']):
        return True
    return len(v['_w']) == len(r['_w']) and order[id(v)] < order[id(r)]

for r in rows:
    ws = r['_w']
    r['covered_by'] = 0.0
    r['contained_exact'] = False
    if not ws:
        continue
    needle = ' ' + ' '.join(ws) + ' '
    if len(ws) < 3:
        hit = any(needle in v for j, v in enumerate(verb_norm) if may_cover(j, r))
        r['contained_exact'] = hit
        r['covered_by'] = 1.0 if hit else 0.0
        continue
    gs = grams(ws)
    cnt = collections.Counter()
    covered = 0
    for g in gs:
        js = [j for j in index.get(g, ()) if may_cover(j, r)]
        if js:
            covered += 1
            for j in js:
                cnt[j] += 1
    r['covered_by'] = round(covered / len(gs), 3)
    if cnt:
        for best, _ in cnt.most_common(3):
            if needle in verb_norm[best]:
                r['contained_exact'] = True
                break
        best = cnt.most_common(1)[0][0]
        if r['covered_by'] >= 0.5:
            r['covered_source'] = verb[best]['source_file']

# an inline fragment stays in the corpus only with evidence it is his: its wording is found in a verbatim row,
# or the sentence around it attributes it to him. The rest (rule text, card lines, file names) is dropped.
dropped = [r for r in rows if r['kind'] == 'inline_fragment' and not (
    (r.get('_attributed') and (r['n_words'] >= 4 or r['channel'] == 'typed_vote')) or r['covered_by'] >= 0.34)]
dropped += [r for r in rows if r['kind'] == 'inline_fragment' and 'THE SNATCHER' in (r.get('_lead') or '')]  # a card's text
dropped += [r for r in rows if r['kind'] == 'attributed_quote' and r['channel'] == 'voice_record' and
            (r['n_words'] < 4 or '//' in r['text'] or '*/' in r['text'])]
with open(os.path.join(OUT, 'dropped_fragments.txt'), 'w', encoding='utf-8') as f:
    for r in dropped:
        f.write('%s | %s | %s\n' % (r['source_file'], (r.get('_lead') or '').replace('\n', ' / ')[-60:], r['text'][:200]))
rows = [r for r in rows if r not in dropped]

for r in rows:
    # every typed vote comment is its own act, so it always counts once; a record block that sits word for word
    # inside a longer block (5+ words) is the same message quoted twice and counts once
    if r['verbatim'] is True and r['kind'] in ('vote_comment', 'anything_else_box', 'message_with_export'):
        r['in_stats'] = True
    else:
        r['in_stats'] = bool(r['verbatim'] is True and not (r['contained_exact'] and r['n_words'] >= 5))
    # how it was most likely entered (a heuristic, see stats.md): thumb-typed text speak vs dictation
    if r['verbatim'] is True:
        tx = r['text']
        thumb = bool(THUMB.search(tx)) or r['all_caps'] or bool(re.search(r'([A-Za-z])\1{2,}', tx)) or \
            bool(re.search(r'[\U0001F300-\U0001FAFF]', tx)) or bool(re.search(r"(?<![A-Za-z'])i(?![A-Za-z'])", tx))
        dict_ = bool(re.search(r"\b[A-Za-z]+'(?:s|t|re|m|ll|ve|d)\b", tx)) or (', ' in tx)
        r['input_guess'] = 'thumb' if thumb else ('dictated' if (dict_ and r['n_words'] >= 8) else 'unclear')
    if r.get('attr_lead') and re.search(r"(?i)amends|law's own|intent|clause|the row|his law|ruling said", r['attr_lead']):
        r['lead_suspect'] = True      # the words may be a law's text about him, not his own sentence
    del r['_w']

KEEP_NONE = ('date_if_known', 'verbatim')
with open(os.path.join(OUT, 'corpus.jsonl'), 'w', encoding='utf-8') as f:
    for r in rows:
        f.write(json.dumps({k: v for k, v in r.items() if (v is not None or k in KEEP_NONE) and not k.startswith('_')},
                           ensure_ascii=False) + '\n')

# a review sheet for the human or agent checking the block rule (not a deliverable)
with open(os.path.join(OUT, 'review_blocks.txt'), 'w', encoding='utf-8') as f:
    for r in rows:
        if r['verbatim'] is True and r['kind'] == 'verbatim_block':
            f.write('%s|%s|%dw|%s|LEAD:%s|| %s\n' % (r['source_file'][22:60], r.get('why'), r['n_words'],
                    (r.get('section') or '')[:30], (r.get('_lead') or '').replace('\n', ' / ')[-60:], r['text'][:140]))

with open(os.path.join(OUT, 'build_diag.txt'), 'w', encoding='utf-8') as f:
    for fn, nb, nf in diag:
        f.write('%3d blocks %3d fragments  %s\n' % (nb, nf, fn))

c = collections.Counter((r['channel'], r['kind'], str(r['verbatim'])) for r in rows)
for k, v in sorted(c.items()):
    print('%5d  %s' % (v, k))
print('rows', len(rows), '| in_stats', sum(r['in_stats'] for r in rows),
      '| record files', len(rec_files), '| files with 0 blocks', sum(1 for d in diag if d[1] == 0))
