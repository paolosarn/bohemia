#!/usr/bin/env python3
"""
stats.py -- measures corpus.jsonl (built by build_corpus.py) and writes stats.md beside it.
Everything printed as a quote is copied from corpus.jsonl; nothing is paraphrased inside quotes.

What is counted: rows with in_stats == true (verbatim: raw typed vote comments, the vote tab's own box,
his messages sent with an export, and record blocks the record itself labels as his words), each once.
Condensed copies (VAMILY quotes, inline fragments, card quote-backs) are never counted here.
"""
import json, re, os, collections, statistics

HERE = os.path.dirname(os.path.abspath(__file__))
rows = [json.loads(l) for l in open(os.path.join(HERE, 'corpus.jsonl'), encoding='utf-8')]

def toks(s):
    s = re.sub(r'\[[^\]]{0,80}\]', ' ', s)          # the recorder's [inserted] words are not his
    return re.findall(r"[A-Za-z0-9]+(?:'[A-Za-z]+)?", s.lower())

def sentences(s):
    """split on . ? ! (followed by space/end), on ' / ' (the recorders' line-break mark) and on '...' (a cut)"""
    s = re.sub(r'\[[^\]]{0,80}\]', ' ', s)
    parts = re.split(r'(?<=[.?!])\s+|\s+/\s+|\.\.\.+', s)
    return [p.strip() for p in parts if toks(p)]

def clauses(s):
    out = []
    for sent in sentences(s):
        out += [c.strip() for c in re.split(r'[,;:]\s+', sent) if toks(c)]
    return out

S = [r for r in rows if r['in_stats']]
TYPED = [r for r in S if r['channel'] == 'typed_vote']
VOICE = [r for r in S if r['channel'] == 'voice_record']
VOTE = [r for r in TYPED if r['kind'] == 'vote_comment']
VOICE_CLEAN = [r for r in VOICE if not r['has_cut'] and not r['has_brackets']]

out = []
def P(*a):
    out.append(' '.join(str(x) for x in a))

def src(r):
    s = r['source_file']
    if r.get('card_id'):
        s += ' id=' + r['card_id']
    return '%s, %s' % (s, r.get('date_if_known') or 'no date')

def dist(vals):
    vals = sorted(vals)
    n = len(vals)
    if not n:
        return None
    q = statistics.quantiles(vals, n=4, method='inclusive') if n > 1 else [vals[0]] * 3
    p90 = vals[min(n - 1, int(round(0.9 * (n - 1))))]
    return dict(n=n, q1=q[0], med=q[1], q3=q[2], mean=sum(vals) / n, p90=p90, mx=vals[-1],
                u6=sum(1 for v in vals if v < 6) / n, o25=sum(1 for v in vals if v > 25) / n)

def drow(label, vals):
    d = dist(vals)
    if not d:
        return '| %s | 0 | | | | | | | | |' % label
    return '| %s | %d | %.1f | %.1f | %.1f | %.1f | %d | %d | %.0f%% | %.0f%% |' % (
        label, d['n'], d['q1'], d['med'], d['q3'], d['mean'], d['p90'], d['mx'], 100 * d['u6'], 100 * d['o25'])

DHEAD = '| what | n | Q1 | median | Q3 | mean | P90 | max | under 6 words | over 25 words |\n|---|---|---|---|---|---|---|---|---|---|'

# ============================================================================================ 0. header
P('# HIS WORDS, MEASURED')
P('')
P('Built by `build_corpus.py` then `stats.py` (both beside this file) from the repo at /home/user/bohemia, read only.')
P('Every quote below is copied from `corpus.jsonl`. Counts use only the VERBATIM rows (`in_stats: true`):')
P('raw typed vote comments, the vote tab\'s own box, his two messages sent with an export, and the record blocks a record')
P('itself labels as his words. Condensed copies (VAMILY quotes, inline fragments, card quote-backs) are in the corpus')
P('with flags but are never counted here, because the coordinator trims and tidies them (measured in section 11).')
P('')

# ============================================================================================ 1. counts
P('## 1. How many quotes, per channel')
P('')
c = collections.Counter((r['channel'], r['kind'], {True: 'verbatim', False: 'entered by coordinator', None: 'condensed / unchecked'}[r['verbatim']]) for r in rows)
P('| channel | kind | reliability | rows (exact repeats merged) | words | counted in stats |')
P('|---|---|---|---|---|---|')
for k in sorted(c):
    rr = [r for r in rows if (r['channel'], r['kind'], {True: 'verbatim', False: 'entered by coordinator', None: 'condensed / unchecked'}[r['verbatim']]) == k]
    P('| %s | %s | %s | %d | %d | %d |' % (k[0], k[1], k[2], len(rr), sum(r['n_words'] for r in rr), sum(1 for r in rr if r['in_stats'])))
P('')
for ch in ('typed_vote', 'voice_record', 'vamily_quote'):
    rr = [r for r in rows if r['channel'] == ch]
    P('- **%s**: %d rows, %d words; counted in stats: %d rows, %d words.' % (
        ch, len(rr), sum(r['n_words'] for r in rr), sum(1 for r in rr if r['in_stats']), sum(r['n_words'] for r in rr if r['in_stats'])))
P('- total rows %d; counted %d rows, %d words.' % (len(rows), len(S), sum(r['n_words'] for r in S)))
reg_all = sum(r.get('vote_count', 1) for r in rows if r['kind'] == 'vote_comment')
P('- the registry holds %d non-empty vote comments; %d are distinct texts (%d typed by him, %d entered by the coordinator from his speech).' % (
    reg_all, sum(1 for r in rows if r['kind'] == 'vote_comment'), len(VOTE), sum(1 for r in rows if r['kind'] == 'vote_comment' and r['verbatim'] is False)))
P('- record blocks: %d counted; %d of them have no cut (`...`) and no [inserted word] and are the only ones used for length and punctuation.' % (len(VOICE), len(VOICE_CLEAN)))
dates = sorted(r['date_if_known'] for r in S if r['date_if_known'])
P('- dates of counted rows: %s to %s.' % (dates[0], dates[-1]))
P('')
P('### How it was entered (a guess, by rule, not a fact)')
P('')
P('The "typed" channel is not all thumb-typed and the "voice" channel is not all dictated. Rule used (`input_guess`):')
P('**thumb** = has text-speak with no apostrophe (u, ur, im, dont, cant, idk, rn, fr, asf, bc, tho, otw, pls, w, alot, wtf-style')
P('lowercase i), or ALL CAPS, or stretched letters (yettt), or an emoji; **dictated** = 8+ words with an apostrophe contraction')
P('or a comma and none of the thumb marks; **unclear** = the rest (mostly one to five word notes).')
P('')
P('| channel | thumb | dictated | unclear |')
P('|---|---|---|---|')
for name, rr in (('typed_vote (vote comments + box + messages)', TYPED), ('voice_record (record blocks)', VOICE)):
    g = collections.Counter(r.get('input_guess') for r in rr)
    P('| %s | %d | %d | %d |' % (name, g['thumb'], g['dictated'], g['unclear']))
P('')

# ============================================================================================ 2. lengths
P('## 2. Length, in words')
P('')
P('A "sentence" is a span ended by `.` `?` `!` or a line break. Dictation puts in few periods, so a dictated "sentence" is')
P('often a whole run-on; the clause row also splits at commas. Voice rows with a cut or an inserted word are left out.')
P('')
P('### Typed (the VOTE tab)')
P('')
P(DHEAD)
P(drow('whole note, each distinct text once', [r['n_words'] for r in VOTE]))
allv = []
for r in VOTE:
    allv += [r['n_words']] * r.get('vote_count', 1)
P(drow('whole note, every comment as cast (repeats counted)', allv))
P(drow('sentence (distinct notes)', [len(toks(s)) for r in VOTE for s in sentences(r['text'])]))
P(drow('clause (distinct notes)', [len(toks(s)) for r in VOTE for s in clauses(r['text'])]))
for g in ('thumb', 'dictated', 'unclear'):
    rr = [r for r in VOTE if r.get('input_guess') == g]
    P(drow('whole note, guess = %s' % g, [r['n_words'] for r in rr]))
    P(drow('sentence, guess = %s' % g, [len(toks(s)) for r in rr for s in sentences(r['text'])]))
P('')
P('### Voice (record blocks)')
P('')
P(DHEAD)
P(drow('whole message', [r['n_words'] for r in VOICE_CLEAN]))
P(drow('sentence', [len(toks(s)) for r in VOICE_CLEAN for s in sentences(r['text'])]))
P(drow('clause', [len(toks(s)) for r in VOICE_CLEAN for s in clauses(r['text'])]))
for g in ('thumb', 'dictated'):
    rr = [r for r in VOICE_CLEAN if r.get('input_guess') == g]
    P(drow('whole message, guess = %s' % g, [r['n_words'] for r in rr]))
    P(drow('sentence, guess = %s' % g, [len(toks(s)) for r in rr for s in sentences(r['text'])]))
P('')
# breath units
BREAK = re.compile(r"(?i)(?<=[.?!,])\s+|\s+/\s+|\b(?:bro|you know(?: what i(?:'m| am) saying| what i mean)?|i mean|so yeah|but yeah|type shit|or something|or whatever|and shit|for real)\b[,.]?")
def breaths(s):
    s = re.sub(r'\[[^\]]{0,80}\]', ' ', s)
    return [p for p in BREAK.split(s) if p and toks(p)]
P('### Breath units (my own unit, defined here)')
P('')
P('Cut the text at every `.` `?` `!` `,` and at every one of his own spoken commas: bro, you know, I mean, so yeah, but yeah,')
P('type shit, or something, or whatever, and shit, for real. What is left between two cuts is one breath.')
P('')
P(DHEAD)
P(drow('typed notes', [len(toks(b)) for r in VOTE for b in breaths(r['text'])]))
P(drow('voice messages', [len(toks(b)) for r in VOICE_CLEAN for b in breaths(r['text'])]))
P('')
# bro spacing
def gaps(rr, word='bro'):
    g = []
    for r in rr:
        t = toks(r['text'])
        idx = [i for i, w in enumerate(t) if w == word]
        g += [b - a - 1 for a, b in zip(idx, idx[1:])]
    return g
gb = gaps(VOICE_CLEAN)
if gb:
    d = dist(gb)
    P('- words between one "bro" and the next, inside one voice message: n=%d, Q1 %.0f, median %.0f, Q3 %.0f.' % (d['n'], d['q1'], d['med'], d['q3']))
tw = sum(r['n_words'] for r in VOICE_CLEAN)
per = sum(len(re.findall(r'[.?!]', r['text'])) for r in VOICE_CLEAN)
com = sum(r['text'].count(',') for r in VOICE_CLEAN)
P('- voice: one sentence mark (. ? !) every %.1f words; one comma every %.1f words (%d words measured).' % (tw / max(per, 1), tw / max(com, 1), tw))
tw2 = sum(r['n_words'] for r in VOTE)
per2 = sum(len(re.findall(r'[.?!]', r['text'])) for r in VOTE)
com2 = sum(r['text'].count(',') for r in VOTE)
P('- typed: one sentence mark every %.1f words; one comma every %.1f words (%d words measured).' % (tw2 / max(per2, 1), tw2 / max(com2, 1), tw2))
P('')

# ============================================================================================ 3. openers
P('## 3. Openers')
P('')
def opener(text, n):
    t = toks(text)
    return ' '.join(t[:n]) if len(t) >= n else None
for n, title in ((1, 'first word'), (2, 'first two words')):
    ct = collections.Counter(opener(r['text'], n) for r in TYPED)
    cv = collections.Counter(opener(r['text'], n) for r in VOICE)
    tot = collections.Counter()
    for k, v in ct.items():
        if k: tot[k] += v
    for k, v in cv.items():
        if k: tot[k] += v
    P('### The 40 most common openers of a whole note or message: %s' % title)
    P('')
    P('| opener | typed (of %d) | voice (of %d) | both |' % (len(TYPED), len(VOICE)))
    P('|---|---|---|---|')
    for k, v in tot.most_common(40):
        P('| %s | %d | %d | %d |' % (k, ct.get(k, 0), cv.get(k, 0), v))
    P('')
cs = collections.Counter()
for r in VOICE_CLEAN:
    for s in sentences(r['text']):
        o = opener(s, 2)
        if o: cs[o] += 1
P('### The 30 most common two-word openers of a sentence inside voice messages')
P('')
P(', '.join('%s (%d)' % kv for kv in cs.most_common(30)))
P('')

# ============================================================================================ 4. n-grams
STOP = set("""a an the and or but so if then than that this these those there here it its it's i i'm i've i'd i'll me my mine
you you're your yours u ur we we're our us they they're them their he she his her him is are was were be been being am do does did
done doing have has had having to of in on at for from with without by as into out up down off over under about like just not no
nor too very can can't could would should will won't don't doesn't didn't isn't aren't wasn't what when where who why how which
all any some one two more most much many also yeah ok okay oh well right now really get got gonna going go know think mean want
wanna need thing things even still only because cause bc s t m re ve ll d im dont thats its""".split())
def ngrams(rr, n):
    cnt = collections.Counter(); df = collections.Counter()
    for r in rr:
        seen = set()
        for s in sentences(r['text']):
            t = toks(s)
            for i in range(len(t) - n + 1):
                g = tuple(t[i:i + n])
                if all(w in STOP for w in g):
                    continue
                cnt[g] += 1
                seen.add(g)
        for g in seen:
            df[g] += 1
    return cnt, df
P('## 4. The most common word pairs and triples')
P('')
P('Counted inside sentences, each distinct quote once (a stock line he pasted 27 times counts once). A pair or triple made')
P('only of function words (the, and, I, to, like, just ...) is left out. "quotes" = how many different quotes hold it.')
P('')
for n, name in ((2, '2-grams'), (3, '3-grams')):
    cnt, df = ngrams(S, n)
    ct, _ = ngrams(TYPED, n)
    cv, _ = ngrams(VOICE, n)
    P('### Top 60 %s (typed + voice)' % name)
    P('')
    P('| # | %s | count | quotes | typed | voice |' % name[:-1])
    P('|---|---|---|---|---|---|')
    for i, (g, v) in enumerate(cnt.most_common(60), 1):
        P('| %d | %s | %d | %d | %d | %d |' % (i, ' '.join(g), v, df[g], ct.get(g, 0), cv.get(g, 0)))
    P('')
    P('Typed channel alone, top 25 %s: ' % name + ', '.join('%s (%d)' % (' '.join(g), v) for g, v in ct.most_common(25)))
    P('')

# ============================================================================================ 5/6. lexicon counts
W_T = sum(r['n_words'] for r in TYPED)
W_V = sum(r['n_words'] for r in VOICE)
def count_terms(title, terms, note=None):
    P('### ' + title)
    P('')
    if note:
        P(note)
        P('')
    P('| term | typed count | typed notes with it (of %d) | typed per 1,000 words | voice count | voice messages with it (of %d) | voice per 1,000 words |' % (len(TYPED), len(VOICE)))
    P('|---|---|---|---|---|---|---|')
    res = []
    for label, pat in terms:
        rx = re.compile(pat, re.I)
        tc = sum(len(rx.findall(r['text'])) for r in TYPED)
        td = sum(1 for r in TYPED if rx.search(r['text']))
        vc = sum(len(rx.findall(r['text'])) for r in VOICE)
        vd = sum(1 for r in VOICE if rx.search(r['text']))
        res.append((label, tc, td, vc, vd))
    for label, tc, td, vc, vd in sorted(res, key=lambda x: -(x[1] + x[3])):
        P('| %s | %d | %d | %.1f | %d | %d | %.1f |' % (label, tc, td, 1000 * tc / W_T, vc, vd, 1000 * vc / W_V))
    P('')

P('## 5. Swears and slang, counted')
P('')
P('Typed = %d distinct notes, %d words. Voice = %d messages, %d words.' % (len(TYPED), W_T, len(VOICE), W_V))
P('')
SWEARS = [
    ('fuck, any form (fuck, fucking, fucked, fucker, asfuck ...)', r"\b\w*fuck\w*"),
    ('fucking', r"\bfucking\b"),
    ('fucked (up)', r"\bfucked\b"),
    ('"what the fuck" / wtf', r"\bwhat the fuck\b|\bwtf\b"),
    ('"fuck with" / "fucking with" (= I like it)', r"\bfuck(?:ing)? w(?:ith)?\b"),
    ('shit, the bare word', r"\bshit\b"),
    ('"type shit"', r"\btype (?:of )?shit\b"),
    ('"and shit"', r"\band shit\b"),
    ('"this shit" / "that shit"', r"\b(?:this|that) shit\b"),
    ('"holy shit"', r"\bholy shit\b"),
    ('dogshit / dog shit', r"\bdog ?shi\w*"),
    ('bullshit', r"\bbullshit\b"),
    ('horseshit / horse shit', r"\bhorse ?shit\b"),
    ('ass, the bare word', r"\bass+\b"),
    ('"<word> ass" as an intensifier (ugly ass, big ass ...)', r"\b(?:ugly|big|tiny|triangle|dumb|old|large|block|cool|fat|good|weird|little|long|hispanic|some)[- ]ass\b"),
    ('asf / "as fuck" / asfuck', r"\basf+\b|\bas fuck\w*|\basfuck\w*"),
    ('asshole', r"\basshole\b"),
    ('dumbass / dumb fuck / dumb', r"\bdumb ?ass\b|\bdumb fuck\b|\bdumb\b"),
    ('bitch', r"\bbitch\b"),
    ('nigga', r"\bnigga\w*"),
    ('damn', r"\bdamn\b"),
    ('hell (hell no, hell nah, hell yeah, what the hell)', r"\bhell\b"),
    ('jesus / jesus christ', r"\bjesus\b"),
    ('"oh my god" / "for the love of god"', r"\boh my (?:fucking )?god\b|\bfor the love of god\b"),
    ('mfs', r"\bmfs?\b"),
    ('fucker', r"\bfucker\b"),
    ('"are you (fucking) insane" / insane', r"\binsane\b"),
    ('crazy', r"\bcrazy\b"),
    ('sucks / suck', r"\bsucks?\b|\bsucking\b"),
    ('ugly', r"\bugl(?:y|iest)\b"),
    ('terrible', r"\bterrible\b"),
    ('slop ("AI slop")', r"\bslop\b"),
    ('hate / hated', r"\bhate[ds]?\b"),
]
count_terms('Swears and insults', SWEARS)
SLANG = [
    ('bro', r"\bbro\b"),
    ('brother (as address; "Battle Brothers" not counted)', r"(?<!battle )\bbrother\b"),
    ('man (as address or filler; a rough count of the bare word)', r"\bman\b"),
    ('swag', r"\bswag\b"),
    ('fire (= very good)', r"\bfire\b(?! (?:a|the|at|his|their|off))"),
    ('cook / cooking / cooked / cook up / cookup', r"\bcook(?:s|ed|ing|up)?\b"),
    ('vibe / vibes', r"\bvibes?\b"),
    ('"turn up" / "turn me up" / "turn it up"', r"\bturn(?:ing)? (?:me |it |this )?up\b"),
    ('low-key / lowkey', r"\blow[- ]?key\b"),
    ('"big brain"', r"\bbig brain\b"),
    ('hella', r"\bhella\b"),
    ('"pull up" / "pulls up" / "pulled up"', r"\bpull(?:s|ed|ing)? up\b"),
    ('"down bad"', r"\bdown bad\b"),
    ('god-tier / god tier / "(god)" (his "good bros" garble)', r"\bgod[- ]tier\b"),
    ('clout', r"\bclout\b"),
    ('beef', r"\bbeef\w*\b"),
    ('"the whole enchilada"', r"\benchilada\b"),
    ('"come correct"', r"\bcome correct\b"),
    ('"on my (fucking) soul"', r"\bon my (?:fucking )?soul\b"),
    ('chill', r"\bchill\b"),
    ('"go crazy"', r"\bgo(?:ing)? crazy\b"),
    ('"my bad"', r"\bmy bad\w*\b"),
    ('"end of story"', r"\bend of story\b"),
    ('"for real" / fr / frfr', r"\bfor real\b|\bfr(?:fr)?\b"),
    ('"no cap" / cap', r"\bno cap\b"),
    ('bet (as yes)', r"^bet\b"),
    ('yo', r"\byo\b"),
    ('dude', r"\bdude\b"),
    ('homie', r"\bhomie\w*"),
    ('awesome', r"\bawesome\w*"),
    ('amazing', r"\bamazing\b"),
    ('sick / dope / lit / goated', r"\bsick\b|\bdope\b|\blit\b|\bgoa[td]ed\b"),
    ('bougie', r"\bbougie\b"),
    ('fat (= big, long: "a fat minute", "really fat")', r"\bfat\b"),
    ('glitchy', r"\bglitch\w*"),
    ('janky / clunky / choppy', r"\bjanky\b|\bclunky\b|\bchoppy\b"),
    ('"look like / looking like / looks like"', r"\blook(?:s|ing|in)? like\b"),
    ('"keep in mind"', r"\bkeep(?:ing)? (?:that |this )?in mind\b"),
    ('"work in progress" / wip', r"\bwork in progress\b|\bwip\b"),
    ('"not final"', r"\bnot final\b"),
    ('"good progress"', r"\bgood progress\b"),
    ('"analog horror"', r"\banalog (?:horror|whore|horrir)\b|\bhorror analog\b"),
    ('"Battle Brothers" (any spelling)', r"\bbattle,? ?brothers?\b"),
    ('idk', r"\bidk\b"),
    ('rn', r"\brn\b"),
    ('u / ur', r"(?<![A-Za-z'])(?:u|ur)(?![A-Za-z'])"),
    ('tho / bc / otw / pls / w (= with)', r"(?<![A-Za-z'])(?:tho|bc|otw|pls|w)(?![A-Za-z'/])"),
]
count_terms('Slang, address words and stock phrases', SLANG)

# ============================================================================================ 6. fillers
P('## 6. Fillers and tics')
P('')
FILL = [
    ('like (every use)', r"\blike\b"),
    ('"like like" (said twice)', r"\blike like\b"),
    ('"kind of" / kinda', r"\bkind of\b|\bkinda\b"),
    ('"you know"', r"\byou know\b"),
    ('"you know what I mean" / "what I\'m saying"', r"\byou know what i(?:'m| am)? (?:mean|saying)\b"),
    ('"pretty much"', r"\bpretty much\b"),
    ('"I feel like" / "it feels like"', r"\bi feel like\b|\bit feels like\b|\bfeels like\b"),
    ('"to be honest"', r"\bto be honest\b"),
    ('honestly', r"\bhonestly\b"),
    ('"I mean"', r"\bi mean\b"),
    ('"I guess"', r"\bi guess\b"),
    ('"I think"', r"\bi think\b"),
    ('"I don\'t know" / "I dont know" / idk', r"\bi don'?t know\b|\bidk\b"),
    ('"or something"', r"\bor something\b"),
    ('"or whatever"', r"\bor whatever\b"),
    ('"so yeah"', r"\bso yeah\b"),
    ('"but yeah"', r"\bbut yeah\b"),
    ('yeah (every use)', r"\byeah\b"),
    ('"Also" opening a sentence', r"(?:^|[.?!/]\s+)also\b"),
    ('just', r"\bjust\b"),
    ('really', r"\breally\b"),
    ('literally', r"\bliterally\b"),
    ('actually', r"\bactually\b"),
    ('basically', r"\bbasically\b"),
    ('definitely', r"\bdefinitely\b|\bdef\b"),
    ('maybe', r"\bmaybe\b"),
    ('potentially', r"\bpotentially\b"),
    ('obviously', r"\bobviously\b"),
    ('"at the end of the day"', r"\bat the end of the day\b"),
    ('"I\'m not gonna lie"', r"\bi'?m not gonna lie\b"),
    ('"long story short"', r"\blong story short\b"),
    ('"does that make sense" / "if that makes sense"', r"\b(?:does|do) that makes? sense\b|\bif that makes sense\b"),
    ('"(do) you understand"', r"\byou understand\b"),
    ('"first off"', r"\bfirst off\b"),
    ('anyway / anyways', r"\banyways?\b"),
    ('OK / okay', r"\bok\b|\bokay\b"),
    ('"right now"', r"\bright now\b"),
    ('gonna', r"\bgonna\b"),
    ('wanna', r"\bwanna\b"),
    ('gotta', r"\bgotta\b"),
    ('"so" opening a clause after a comma/period', r"(?:^|[.,?!]\s+)so\b"),
    ('"like" right before a quote of thought ("I was like", "it\'s like", "be like")', r"\b(?:was|is|it's|be|i'm|were) like\b"),
]
count_terms('Fillers', FILL, 'Voice-to-text keeps his fillers; the coordinator\'s condensed copies drop many of them (section 11).')
# immediate repeats
def repeats(rr):
    c = collections.Counter()
    for r in rr:
        t = toks(r['text'])
        for a, b in zip(t, t[1:]):
            if a == b:
                c[a] += 1
    return c
rt = repeats(TYPED); rv = repeats(VOICE)
P('### The same word twice in a row (stutter in dictation, or emphasis)')
P('')
P('- typed: %d times; top: %s' % (sum(rt.values()), ', '.join('%s %s (%d)' % (k, k, v) for k, v in rt.most_common(12))))
P('- voice: %d times; top: %s' % (sum(rv.values()), ', '.join('%s %s (%d)' % (k, k, v) for k, v in rv.most_common(25))))
tri = collections.Counter()
for r in S:
    t = toks(r['text'])
    for a, b, c3 in zip(t, t[1:], t[2:]):
        if a == b == c3:
            tri[a] += 1
P('- three or more in a row (emphasis): ' + ', '.join('%s x3+ (%d)' % kv for kv in tri.most_common(15)))
P('')
DIRECT = [
    ('"I want" / "I wanna"', r"\bi (?:want|wanna)\b"),
    ('"I don\'t want" / "I dont want" / "I don\'t wanna"', r"\bi don'?t (?:want|wanna)\b"),
    ('"I need" ("I need you to" inside it)', r"\bi need\b"),
    ('"I need you to"', r"\bi need you to\b"),
    ('"I should (be able to)"', r"\bi should\b"),
    ('"make sure"', r"\bmake sure\b"),
    ('"we need" / "we gotta" / "we have to"', r"\bwe (?:need|gotta|have to|got to)\b"),
    ('"has to" / "have to" / "gotta"', r"\b(?:has|have) to\b|\bgotta\b"),
    ('"you need to" / "you gotta" / "you have to"', r"\byou (?:need to|gotta|have to)\b"),
    ('"let\'s" / "lets"', r"\blet'?s\b"),
    ('please / pls', r"\bplease\b|\bpls\b"),
    ('"thank you" / thanks', r"\bthank you\b|\bthanks\b"),
    ('appreciate', r"\bappreciate\b"),
    ('sorry', r"\bsorry\b"),
    ('"I like"', r"\bi (?:really )?like\b"),
    ('"I love" / "in love with"', r"\bi (?:really |absolutely )?love\b|\bin love with\b"),
    ('"I hate"', r"\bi (?:really )?hate\b"),
    ('"I\'m (so) confused"', r"\bi'?m (?:so |just so )?confused\b|\bso confused\b"),
    ('"what\'s up with"', r"\bwhat'?s up with\b"),
    ('"what\'s going on" / "what is going on"', r"\bwhat(?:'s| is|s) going on?\b|\bwhat's going\b"),
    ('"what\'s wrong with you" / "what the fuck is wrong with you"', r"\bwrong with you\b"),
    ('"are you (fucking) insane / for real / serious"', r"\bare you (?:fucking |seriously )?(?:insane|for real|fr|serious)\b"),
    ('"why" opening a note or sentence', r"(?:^|[.?!]\s+)why\b"),
]
count_terms('How he asks, thanks and complains (set phrases)', DIRECT)

# ============================================================================================ 7. yes / no
P('## 7. How he says yes and how he says no')
P('')
up = [r for r in VOTE if r.get('vote') == 'up']
dn = [r for r in VOTE if r.get('vote') == 'down']
P('The cleanest evidence is the VOTE tab: a thumb plus his own words. %d distinct notes went with a thumbs up, %d with a thumbs down.' % (len(up), len(dn)))
P('A thumbs up is often not praise: of the %d up notes, %d contain dogshit, shit, ass, ugly, bad, terrible, sucks or worst.' % (
    len(up), sum(1 for r in up if re.search(r'(?i)dog ?shit|\bshit\b|\bass+\b|ugly|\bbad\b|terrible|sucks?|worst', r['text']))))
P('')
for name, rr in (('thumbs UP', up), ('thumbs DOWN', dn)):
    c1 = collections.Counter(opener(r['text'], 1) for r in rr)
    c2 = collections.Counter(opener(r['text'], 2) for r in rr if opener(r['text'], 2))
    P('- first word of a %s note (top 20): ' % name + ', '.join('%s (%d)' % kv for kv in c1.most_common(20)))
    P('- first two words of a %s note (top 15): ' % name + ', '.join('%s (%d)' % kv for kv in c2.most_common(15)))
P('')
YES = [('yes', r"^yes\b"), ('yeah', r"^yeah\b"), ('yep / yup', r"^(?:yep|yup)\b"), ('"hell yeah"', r"^hell yeah\b"), ('bet', r"^bet\b"),
       ('sure', r"^sure\b"), ('OK / okay', r"^(?:ok|okay)\b"), ('cool', r"^cool\b"), ('nice', r"^nice\b"), ('awesome', r"^awesome\b"),
       ('good ...', r"^good\b"), ('great', r"^great\b"), ('fire', r"^fire\b"), ('perfect / fantastic / amazing', r"^(?:perfect|fantastic|amazing)\b"),
       ('"I like"', r"^i like\b"), ('"I love"', r"^i love\b"), ('a bare letter (his pick: A, B, C, D, E)', r"^[a-e]$"),
       ('"Lets do c" style', r"^lets? do\b"), ('decent', r"^(?:its |it's )?decent\b")]
NO = [('no', r"^no\b"), ('nah', r"^nah+\b"), ('"hell no" / "hell nah"', r"^hell,? (?:no|nah)\b"), ('"bro hell no"', r"^bro,? hell no\b"),
      ('nope', r"^nope\b"), ('dead', r"^dead\b"), ('"I don\'t" / "I dont"', r"^i don'?t\b"), ('"I hate"', r"^i hate"), ('wtf', r"^wtf\b"),
      ('"looks like" / "looking like" (then an insult)', r"^look(?:s|ing|in)? like\b"), ('dogshit', r"^dog ?shit"), ('boring', r"^(?:so )?boring"),
      ('"not ..."', r"^not\b"), ('"too ..."', r"^too\b"), ('terrible', r"^terrible\b"), ('"so ..." (so boring, so ass, so confused)', r"^so\b")]
def start_counts(pats):
    res = []
    for label, pat in pats:
        rx = re.compile(pat, re.I)
        tn = sum(1 for r in TYPED if rx.search(' '.join(toks(r['text']))))
        vn = sum(1 for r in VOICE if rx.search(' '.join(toks(r['text']))))
        sn = sum(1 for r in S for s in sentences(r['text']) if rx.search(' '.join(toks(s))))
        res.append((label, tn, vn, sn))
    return res
P('| a note / message / sentence that STARTS with | typed notes | voice messages | sentences anywhere |')
P('|---|---|---|---|')
P('| **yes forms** | | | |')
for label, tn, vn, sn in start_counts(YES):
    P('| %s | %d | %d | %d |' % (label, tn, vn, sn))
P('| **no forms** | | | |')
for label, tn, vn, sn in start_counts(NO):
    P('| %s | %d | %d | %d |' % (label, tn, vn, sn))
P('')
def examples(title, pat, rr, k=10, maxw=40):
    rx = re.compile(pat, re.I)
    got = []
    for r in rr:
        for s in sentences(r['text']):
            if rx.search(' '.join(toks(s))) and len(toks(s)) <= maxw and s not in [g[0] for g in got]:
                got.append((s, r))
                break
        if len(got) >= k:
            break
    P('**%s**' % title)
    P('')
    for s, r in got:
        P('- "%s" (%s)' % (s, src(r)))
    P('')
examples('Yes, verbatim (sentences that open with yes, yeah, yep, hell yeah, bet, sure, OK, cool, nice, awesome)',
         r"^(?:yes|yeah|yep|hell yeah|bet|sure|ok|okay|cool|nice|awesome)\b", TYPED + VOICE, 14)
examples('No, verbatim (sentences that open with no, nah, hell no, hell nah, bro hell no, dead, I don\'t)',
         r"^(?:no|nah+|hell,? (?:no|nah)|bro,? hell no|dead|i don'?t (?:want|wanna|like))\b", TYPED + VOICE, 14)

# ============================================================================================ 8. praise / insult
PRAISE = [
    "Holy shit you're making like 3-D looking 2-D sprites. I think we have to do that for the rest of the game. Holy shit what the fuck that looks good that's all that's the first thing I've been impressed with visual wise in a long time, bro. What the hell?",
    "Not final but fucking amazing direction",
    "This is perfect I love it make sure people dont walk on walls though and on rooftops and shit bro",
    "Fire make sure shit doesnt clip into places it shouldnt but yeah",
    "new ones are fire put the volume down a little bit and yeah",
    "This is good i love this direction ai slop gore horror analog amazing vibes",
    "Bro, it's so bad. I actually kinda like it bro that's insane. I like that like bro it's like it's giving this like analog horror AI slop and I love it.",
    "That's way better holy shit",
    "This is one of the few things you did on your own. That is extremely impressive. This is getting a star.",
    "Keep cooking man its good ideas",
    "Fantastic progress it should all come with a slider",
    "I like this great direction not final but very good thank you",
    "Way better nice!",
    "Good direction now finally looks like they're all plain face from Batman. Shit I really appreciate that. I like that.",
    "Im in love with everythibg you been cooking",
    "Hell yeah maybe a rarer amount the horizontal tunnels combine with vertical tunnel not as often",
    "I'm so fucking impressed bro, we've come such a long way, but I have a lot of feedback.",
    "Bro, I am so fucking in love with the loading screens.",
    "Oh my fucking God I forgot about the arena system in Battle Brothers holy shit yes I love that.",
    "Hey bro, I just played the demo and honestly I'm really proud of the progress you've been making bro.",
]
INSULT = [
    "Her portrait ugly as shit",
    "Wtf is this dogshit why does everything have to happen the first second of the game or even be in the demo? This shit is ass",
    "They look good for a game that doesn't give a fuck about itself.",
    "What makes you think writing a storytime about this would be a good idea rather than actually making pixel art of footsteps that lead you to the conclusion and shit bro like why are you such a dumb fuck",
    "This shit's not even proper English bro",
    "Bro, these sound effects have like the reverb of like a glass jar, bro what the fuck",
    "Its just all looking like donkey dog shit bro",
    "Looking like a seventh grader coded it and it looks like dog shit",
    "Bro this ui is do ugly cluttered dogshit try again",
    "Bro wtf is this horseshit",
    "THIS UI IS ASSSS",
    "This is one of the worst cooks you've ever showed me",
    "So you made something white that's awesome wasting my credit with this question",
    "Awesome I'm not sure what you did other than just highlight all the streets bro good job dog shit",
    "It is a cause of concern you kinda suck at sounding like a human tweeting. Some of it is good but a lot of it is kinda like what the fuck does that even mean type shit",
    "Renown is out clout economy translation dumbass",
    "It's all looking really bad like like a seventh grader is making my game, bro it's it's pretty fucking terrible.",
    "Is this the type of fucking master coordinator you want to be bro this is dog shit, bro.",
    "The UI is still ass.",
    "Definitely a placeholder like bro, like it looks like a fucking pyramid",
]
def find_exact(q):
    hits = [r for r in S if q in r['text']]
    assert hits, 'NOT FOUND IN CORPUS: ' + q
    hits.sort(key=lambda r: (0 if r['text'] == q else 1, 0 if r['channel'] == 'typed_vote' else 1, r['n_words']))
    return hits[0]
P('## 8. How he praises (20 real examples, verbatim, typed first)')
P('')
for i, q in enumerate(PRAISE, 1):
    r = find_exact(q)
    P('%d. "%s" [%s; %s]' % (i, q, r['channel'], src(r)))
P('')
P('## 9. How he insults (20 real examples, verbatim, typed first)')
P('')
for i, q in enumerate(INSULT, 1):
    r = find_exact(q)
    P('%d. "%s" [%s; %s]' % (i, q, r['channel'], src(r)))
P('')
P('Stock lines he pasted across many cards (count of cards): ' + '; '.join(
    '"%s" x%d' % (r['text'], r.get('vote_count', 1)) for r in sorted(VOTE, key=lambda r: -r.get('vote_count', 1))[:16] if r.get('vote_count', 1) > 1))
P('')

# ============================================================================================ 10. punctuation typed
P('## 10. Punctuation and case in the typed channel (the %d distinct vote notes he typed)' % len(VOTE))
P('')
def pct(n, d):
    return '%d (%.0f%%)' % (n, 100.0 * n / d if d else 0)
def punct_table(rr, label):
    n = len(rr)
    w = sum(r['n_words'] for r in rr)
    first_up = sum(1 for r in rr if re.match(r'[A-Z]', r['text']))
    first_lo = sum(1 for r in rr if re.match(r'[a-z]', r['text']))
    caps = sum(1 for r in rr if r['all_caps'])
    capword = sum(1 for r in rr if not r['all_caps'] and re.search(r"\b[A-Z]{4,}\b", r['text']))
    end_dot = sum(1 for r in rr if r['text'].rstrip().endswith('.'))
    end_q = sum(1 for r in rr if r['text'].rstrip().endswith('?'))
    end_x = sum(1 for r in rr if r['text'].rstrip().endswith('!'))
    end_none = n - end_dot - end_q - end_x
    anyp = sum(1 for r in rr if '.' in r['text'])
    anyc = sum(1 for r in rr if ',' in r['text'])
    anyq = sum(1 for r in rr if '?' in r['text'])
    anyx = sum(1 for r in rr if '!' in r['text'])
    nop = sum(1 for r in rr if not re.search(r"[.,?!;:]", r['text']))
    emoji = sum(len(re.findall(r'[\U0001F300-\U0001FAFF☀-➿]', r['text'])) for r in rr)
    emoji_n = sum(1 for r in rr if re.search(r'[\U0001F300-\U0001FAFF☀-➿]', r['text']))
    per = sum(r['text'].count('.') for r in rr)
    com = sum(r['text'].count(',') for r in rr)
    qm = sum(r['text'].count('?') for r in rr)
    ex = sum(r['text'].count('!') for r in rr)
    multi = sum(len(re.findall(r'[?!]{2,}', r['text'])) for r in rr)
    stretch = sum(len(re.findall(r'\b\w*([A-Za-z])\1{2,}\w*\b', r['text'])) for r in rr)
    low_i = sum(len(re.findall(r"(?<![A-Za-z'])i(?![A-Za-z'])", r['text'])) for r in rr)
    up_i = sum(len(re.findall(r"(?<![A-Za-z'])I(?![A-Za-z])", r['text'])) for r in rr)
    con_ap = sum(len(re.findall(r"(?i)\b(?:don't|can't|won't|isn't|doesn't|didn't|that's|there's|it's|i'm|you're|they're|we're|what's|i've|couldn't|shouldn't|wouldn't|aren't|let's)\b", r['text'])) for r in rr)
    con_no = sum(len(re.findall(r"(?i)(?<![A-Za-z'])(?:dont|cant|wont|isnt|doesnt|didnt|thats|theres|im|youre|theyre|whats|ive|couldnt|shouldnt|wouldnt|arent|lets)(?![A-Za-z'])", r['text'])) for r in rr)
    you = sum(len(re.findall(r"(?i)\b(?:you|your|you're)\b", r['text'])) for r in rr)
    u = sum(len(re.findall(r"(?i)(?<![A-Za-z'])(?:u|ur)(?![A-Za-z'])", r['text'])) for r in rr)
    semi = sum(r['text'].count(';') for r in rr)
    colon = sum(r['text'].count(':') for r in rr)
    ell = sum(len(re.findall(r'\.\.\.', r['text'])) for r in rr)
    P('**%s** (%d notes, %d words)' % (label, n, w))
    P('')
    P('- starts with a capital: %s; starts lowercase: %s; whole note in CAPS: %s; a CAPS word of 4+ letters inside a normal note: %s' % (pct(first_up, n), pct(first_lo, n), pct(caps, n), pct(capword, n)))
    P('- ends with a period: %s; with ?: %s; with !: %s; with nothing: %s' % (pct(end_dot, n), pct(end_q, n), pct(end_x, n), pct(end_none, n)))
    P('- has a period anywhere: %s; a comma: %s; a ?: %s; a !: %s; no punctuation mark at all: %s' % (pct(anyp, n), pct(anyc, n), pct(anyq, n), pct(anyx, n), pct(nop, n)))
    P('- per 100 words: periods %.1f, commas %.1f, question marks %.1f, exclamation marks %.1f' % (100 * per / w, 100 * com / w, 100 * qm / w, 100 * ex / w))
    P('- totals: ? %d, ! %d, runs like ?? or !!?? %d, semicolons %d, colons %d, "..." %d, emoji %d (in %d notes), stretched words (asfff, yettt) %d' % (qm, ex, multi, semi, colon, ell, emoji, emoji_n, stretch))
    P('- contractions with an apostrophe %d, without (dont, im, thats) %d; "I" %d, lowercase "i" %d; you/your %d, u/ur %d' % (con_ap, con_no, up_i, low_i, you, u))
    P('')
punct_table(VOTE, 'All typed vote notes')
for g in ('thumb', 'dictated', 'unclear'):
    punct_table([r for r in VOTE if r.get('input_guess') == g], 'guess = ' + g)
em = [r for r in VOTE if re.search(r'[\U0001F300-\U0001FAFF☀-➿]', r['text'])]
P('Every note with an emoji: ' + ' | '.join('"%s"' % r['text'][:160] for r in em))
P('')
st = collections.Counter()
for r in TYPED:
    for m in re.finditer(r"\b\w*([A-Za-z])\1{2,}\w*\b", r['text']):
        st[m.group(0)] += 1
P('Stretched words in the typed channel: ' + ', '.join('%s (%d)' % kv for kv in st.most_common(30)))
P('')
P('Voice blocks for comparison (%d clean messages, %d words): per 100 words periods %.1f, commas %.1f, question marks %.1f, exclamation marks %.1f; semicolons %d; emoji %d.' % (
    len(VOICE_CLEAN), tw, 100 * sum(r['text'].count('.') for r in VOICE_CLEAN) / tw, 100 * com / tw,
    100 * sum(r['text'].count('?') for r in VOICE_CLEAN) / tw, 100 * sum(r['text'].count('!') for r in VOICE_CLEAN) / tw,
    sum(r['text'].count(';') for r in VOICE_CLEAN), sum(len(re.findall(r'[\U0001F300-\U0001FAFF]', r['text'])) for r in VOICE_CLEAN)))
P('')

# ============================================================================================ 11. absent
P('## 11. What is ABSENT (counted, so the absence is measured)')
P('')
CLEAN = VOTE + [r for r in TYPED if r['kind'] != 'vote_comment'] + VOICE_CLEAN
wc = sum(r['n_words'] for r in CLEAN)
P('Measured on the typed rows plus the voice blocks with no cut and no inserted word: %d quotes, %d words.' % (len(CLEAN), wc))
P('')
ABS = [
    ('semicolon ;', r";"), ('em dash', r"—"), ('en dash', r"–"), ('double hyphen " -- "', r" -- "),
    ('colon :', r":"), ('parenthesis (', r"\("), ('double quote mark "', r'"'),
    ('shall', r"\bshall\b"), ('whom', r"\bwhom\b"), ('perhaps', r"\bperhaps\b"), ('indeed', r"\bindeed\b"),
    ('however', r"\bhowever\b"), ('therefore', r"\btherefore\b"), ('moreover', r"\bmoreover\b"), ('furthermore', r"\bfurthermore\b"),
    ('thus', r"\bthus\b"), ('hence', r"\bhence\b"), ('nevertheless / nonetheless', r"\bnevertheless\b|\bnonetheless\b"),
    ('whereas', r"\bwhereas\b"), ('although / though (not "tho")', r"\balthough\b|\bthough\b"), ('upon', r"\bupon\b"),
    ('regarding / concerning', r"\bregarding\b|\bconcerning\b"), ('in order to', r"\bin order to\b"), ('such as', r"\bsuch as\b"),
    ('certainly / surely', r"\bcertainly\b|\bsurely\b"), ('rather', r"\brather\b"), ('quite', r"\bquite\b"),
    ('utilize / utilized', r"\butiliz\w+"), ('whilst / amongst', r"\bwhilst\b|\bamongst\b"), ('must', r"\bmust\b"),
    ('"as if"', r"\bas if\b"), ('"as though"', r"\bas though\b"), ('"like a" / "like an"', r"\blike an? \b"),
    ('"as <word> as" (as big as a house)', r"\bas \w+ as\b"),
    ('"it is" spelled out (he says it\'s / its)', r"\bit is\b"), ('"do not" spelled out', r"\bdo not\b"), ('"cannot"', r"\bcannot\b"),
    ('"I am" spelled out', r"\bi am\b"),
]
P('| thing | count in his verbatim words | per 10,000 words |')
P('|---|---|---|')
for label, pat in ABS:
    rx = re.compile(pat, re.I)
    n = sum(len(rx.findall(r['text'])) for r in CLEAN)
    P('| %s | %d | %.1f |' % (label, n, 10000.0 * n / wc))
P('')
def kwic(pat, rr, width=70, limit=200):
    rx = re.compile(pat, re.I)
    res = []
    for r in rr:
        for m in rx.finditer(r['text']):
            a = max(0, m.start() - width); b = min(len(r['text']), m.end() + width)
            res.append(('%s%s%s' % ('...' if a else '', r['text'][a:b], '...' if b < len(r['text']) else ''), r))
    return res[:limit]
for label, pat in (('however', r"\bhowever\b"), ('semicolon', r";"), ('"as if" / "as though"', r"\bas if\b|\bas though\b"),
                   ('rather', r"\brather\b"), ('must', r"\bmust\b"), ('quite', r"\bquite\b")):
    ks = kwic(pat, CLEAN)
    P('**Every "%s" in context (%d):**' % (label, len(ks)))
    P('')
    for k, r in ks[:25]:
        P('- %s (%s)' % (k, src(r)))
    P('')
la = kwic(r"\blike an? \b", CLEAN, width=55)
P('**"like a / like an" in context (%d in all; the first 60 are shown, typed first). Read them: nearly all are a plain comparison' % len(la))
P('to a concrete thing ("looks like a seventh grader coded it") or the filler "like" followed by "a"; none is a literary figure.**')
P('')
la.sort(key=lambda kr: 0 if kr[1]['channel'] == 'typed_vote' else 1)
for k, r in la[:60]:
    P('- %s (%s)' % (k, src(r)))
P('')
# how much the condensed copies drop the fillers
cond = [r for r in rows if r['verbatim'] is None and r['channel'] in ('vamily_quote',) and r['covered_by'] >= 0.5]
cw = sum(r['n_words'] for r in cond)
P('### Why the condensed copies are not counted: the coordinator cleans him up')
P('')
P('VAMILY quotes whose wording is at least half found in a verbatim row (%d quotes, %d words) against the voice blocks (%d words):' % (len(cond), cw, W_V))
P('')
P('| per 1,000 words | voice blocks (verbatim) | VAMILY quotes of the same speech |')
P('|---|---|---|')
for label, pat in (('like', r"\blike\b"), ('bro', r"\bbro\b"), ('you know', r"\byou know\b"), ('shit', r"\bshit\b"), ('fuck*', r"\b\w*fuck\w*"),
                   ('yeah', r"\byeah\b"), ('semicolons', r";"), ('"..." cuts', r"\.\.\."), ('commas', r",")):
    rx = re.compile(pat, re.I)
    a = sum(len(rx.findall(r['text'])) for r in VOICE)
    b = sum(len(rx.findall(r['text'])) for r in cond)
    P('| %s | %.1f | %.1f |' % (label, 1000.0 * a / W_V, 1000.0 * b / max(cw, 1)))
P('')
vq = [r for r in rows if r['channel'] == 'vamily_quote']
b = collections.Counter('word for word inside a verbatim row' if r['contained_exact'] else ('half or more of its wording found' if r['covered_by'] >= 0.5 else ('some found (20 to 50%)' if r['covered_by'] >= 0.2 else 'not found in the verbatim rows (older than 9/13, newer than the last record, or a paraphrase)')) for r in vq)
P('VAMILY and CLAUDE.md quotes checked against the verbatim rows (%d): ' % len(vq) + '; '.join('%s: %d' % kv for kv in b.most_common()))
P('')

# ============================================================================================ 12. voice-to-text garbles the records themselves name
P('## 12. Voice-to-text garbles (do not learn these as his words)')
P('')
P('Words the dictation got wrong, as seen in the verbatim rows (count of rows):')
P('')
GARB = [('"quiz" for quest', r"\bquiz\b"), ('"analog whore" / "horrir" for analog horror', r"analog whore|horrir"), ('"rating party" for raiding party', r"\brating part"),
        ('"fashions" for factions', r"\bfashions?\b"), ('"ax" / "acts" for acts', r"\bbetween ax\b"), ('"Malay" for melee', r"\bMalay\b"),
        ('"3040" for 30 to 40', r"\b3040\b"), ('"the feet" / "fee" for the feed', r"\bthe feet\b|\bthe fee\b"), ('"awards" for words', r"\bof awards\b"),
        ('"towels" for tiles', r"\btowels\b"), ('"Rhino" for "I know"', r"\bRhino\b"), ('"Walheim" / "Val Heim" for Valheim', r"\bWalheim|Val Heim"),
        ('"cut Syn" for cutscene', r"\bcut Syn\b"), ('"(god)" for good', r"\(god\)"), ('"plate test" for playtest', r"\bplate test"),
        ('"ragged Daling" for ragdolling', r"ragged Daling"), ('"boat shit" for vote shit', r"\bboat shit\b"), ('"goaded" for goated', r"\bgoaded\b")]
for label, pat in GARB:
    rx = re.compile(pat, re.I)
    n = sum(1 for r in S if rx.search(r['text']))
    P('- %s: %d' % (label, n))
P('')

# ============================================================================================ 13. characteristic sentences
CHAR = [
    "Idk what i was reading wtf",
    "Boring asf",
    "Chill with the spanglish bro some characters might speak Spanglish to you doesn't mean you will fucking asshole",
    "They look good for a game that doesn't give a fuck about itself.",
    "good progress not final not even close",
    "Looking like a seventh grader coded it and it looks like dog shit",
    "Bro, these sound effects have like the reverb of like a glass jar, bro what the fuck",
    "Fire make sure shit doesnt clip into places it shouldnt but yeah",
    "It is a cause of concern you kinda suck at sounding like a human tweeting. Some of it is good but a lot of it is kinda like what the fuck does that even mean type shit",
    "Whatever battle Brothers does, I don't need you to do this bullshit",
    "Mfs charge batteries bro \U0001F923\U0001F923\U0001F923 i knkw buildings can help in our game but jesus christ mfs can charge batteries",
    "Bro, it's so bad. I actually kinda like it bro that's insane.",
    "I appreciate the deep psychological philosophical dive you wanted to go into it, but let's just have some fun bro come on",
    "bro let's just re-create battle Brothers with our whole swag",
    "this is how I want like the communication to feel sometimes bro this is Bohemian bro this my swag",
]
P('## 13. Fifteen sentences that sound most like him (picked by hand, verbatim, typed first)')
P('')
for i, q in enumerate(CHAR, 1):
    r = find_exact(q)
    P('%d. "%s" [%s; %s]' % (i, q, r['channel'], src(r)))
P('')
P('And one game line he wrote himself, for a perk he called decoy (dictated, cut by the recorder): "%s" [%s]' % (
    find_exact('did you seriously just walk around with a cardboard cut out')['text'], src(find_exact('did you seriously just walk around with a cardboard cut out'))))
P('')

# ============================================================================================ 14. caveats
P('## 14. Caveats (read before trusting any number above)')
P('')
vq_low = [r for r in rows if r['channel'] == 'vamily_quote' and r['covered_by'] < 0.2 and not r['contained_exact']]
P('1. **"Typed" is two things.** Of the %d distinct notes he put in the VOTE tab, the rule guesses %d thumb-typed, %d dictated into the box, %d unclear (short). The thumb-typed ones are the purest sample of how he WRITES: no periods, no commas, u / ur / im / dont, caps for shouting.' % (
    len(VOTE), sum(1 for r in VOTE if r.get('input_guess') == 'thumb'), sum(1 for r in VOTE if r.get('input_guess') == 'dictated'), sum(1 for r in VOTE if r.get('input_guess') == 'unclear')))
P('2. **"Voice" is voice to text.** The capitals, periods and commas in it are the phone\'s, not his, and words are garbled (section 12). %d of the %d record blocks look thumb-typed, not dictated (short chat messages, some in caps lock).' % (
    sum(1 for r in VOICE if r.get('input_guess') == 'thumb'), len(VOICE)))
P('3. **Condensed copies are in the corpus but not in the counts.** %d VAMILY/CLAUDE.md quotes, %d inline fragments from records and vote summaries, %d card quote-backs: all `verbatim: null`. The coordinator cuts with `...`, drops like / bro / you know, adds commas and semicolons, fixes spelling, and sometimes caps a headline. %d record blocks counted as verbatim still carry a cut or an [inserted word]; they are used for word counts, never for length or punctuation.' % (
    sum(1 for r in rows if r['channel'] == 'vamily_quote'), sum(1 for r in rows if r['kind'] == 'inline_fragment'), sum(1 for r in rows if r['kind'] == 'card_quoteback'),
    sum(1 for r in VOICE if r['has_cut'] or r['has_brackets'])))
P('4. **Some VAMILY quotes are not his sentences.** The rule "Paolo <m/d> ... \'quote\'" also catches a law\'s wording about him. %d VAMILY/CLAUDE.md quotes share under 20%% of their wording with any verbatim row; most of those are real (dates with no record file in scope, before 9/13 or after 11/10), but in a hand check of 70 of them about 8 were law text or a paraphrase (for example "A card that promises something and does nothing is the worst bug in the game: deliver it or remove it."). %d rows are flagged `lead_suspect`.' % (
    len(vq_low), sum(1 for r in rows if r.get('lead_suspect'))))
P('5. **Three vote comments were entered by the coordinator from his speech** (`verbatim: false`), one of them copied onto 13 song cards; they are not counted.')
P('6. **Three typed notes began with words pasted from the card**; only his own span is kept as `text` (`text_full` has all of it).')
P('7. **Dates.** A record is dated by its file name; a vote by the export\'s day (`when`), which can be earlier than the date in the card\'s id.')
P('8. **Scope.** Only the three named sources were mined: the vote registry, records/BOHEMIA_PAOLO_* and records/*VOTE*.txt (%d files, %d of them gave at least one his-words block), VAMILY.md and CLAUDE.md. His words before 9/13 live mostly in laws/ and are here only as far as VAMILY.md and CLAUDE.md quote them. The newest message about talk (11/17) exists only as a condensed VAMILY quote.' % (
    sum(1 for l in open(os.path.join(HERE, 'build_diag.txt'))), sum(1 for l in open(os.path.join(HERE, 'build_diag.txt')) if int(l.split()[0]) > 0)))
P('9. **The block rule can miss or mislabel.** A quote counts as a his-words block only when the record says so (a HIS WORDS heading, "His words:", "verbatim", a "# PAOLO <date>: " title in his own case, or a stand-alone quoted paragraph). `review_blocks.txt` and `dropped_fragments.txt` beside this file list what the rule took and what it threw away.')
P('10. **Praise, insult and "most like him" lists were picked by hand** from the verbatim rows; the script checks each one is in the corpus word for word.')
P('')

# ============================================================================================ headline numbers (inserted at the top)
def per1000(pat, rr, W):
    rx = re.compile(pat, re.I)
    return 1000.0 * sum(len(rx.findall(r['text'])) for r in rr) / W
dT = dist([r['n_words'] for r in VOTE]); dTa = dist(allv)
dTh = dist([r['n_words'] for r in VOTE if r.get('input_guess') == 'thumb'])
dTd = dist([r['n_words'] for r in VOTE if r.get('input_guess') == 'dictated'])
dV = dist([r['n_words'] for r in VOICE_CLEAN])
dVs = dist([len(toks(x)) for r in VOICE_CLEAN for x in sentences(r['text'])])
dTs = dist([len(toks(x)) for r in VOTE for x in sentences(r['text'])])
bT = dist([len(toks(b)) for r in VOTE for b in breaths(r['text'])]); bV = dist([len(toks(b)) for r in VOICE_CLEAN for b in breaths(r['text'])])
nV = len(VOTE)
no_end = sum(1 for r in VOTE if not re.search(r'[.?!]$', r['text'].rstrip()))
no_p = sum(1 for r in VOTE if not re.search(r"[.,?!;:]", r['text']))
def n_in(pat, rr):
    rx = re.compile(pat, re.I)
    return sum(len(rx.findall(r['text'])) for r in rr)
H = []
H.append('## HEADLINE NUMBERS')
H.append('')
H.append('1. Corpus: %d distinct quotes (typed_vote %d, voice_record %d, vamily_quote %d). Verbatim and counted: %d quotes, %d words (typed %d quotes / %d words; voice %d quotes / %d words).' % (
    len(rows), sum(1 for r in rows if r['channel'] == 'typed_vote'), sum(1 for r in rows if r['channel'] == 'voice_record'),
    sum(1 for r in rows if r['channel'] == 'vamily_quote'), len(S), sum(r['n_words'] for r in S), len(TYPED), W_T, len(VOICE), W_V))
H.append('2. A typed vote note: median %d words (Q1 %d, Q3 %d); counting every card he cast it on, median %d. %.0f%% of cast notes are under 6 words, %.0f%% over 25. Thumb-typed notes median %d words; notes dictated into the box median %d.' % (
    dT['med'], dT['q1'], dT['q3'], dTa['med'], 100 * dTa['u6'], 100 * dTa['o25'], dTh['med'], dTd['med']))
H.append('3. A voice message: median %d words (Q1 %d, Q3 %d, longest %d). One period, ? or ! every %.0f words, so a "sentence" is a run-on (median %d words; typed %d). Cut at his own spoken commas (bro, you know, I mean ...) a breath is median %d words in voice, %d typed.' % (
    dV['med'], dV['q1'], dV['q3'], dV['mx'], tw / max(per, 1), dVs['med'], dTs['med'], bV['med'], bT['med']))
o1t = collections.Counter(opener(r['text'], 1) for r in TYPED); o1v = collections.Counter(opener(r['text'], 1) for r in VOICE)
H.append('4. Openers: "bro" starts %d of %d typed notes and %d of %d voice messages; "Also" starts %d voice messages and "And" %d; "good" starts %d typed notes, "I" %d, "nice" %d.' % (
    o1t['bro'], len(TYPED), o1v['bro'], len(VOICE), o1v['also'], o1v['and'], o1t['good'], o1t['i'], o1t['nice']))
H.append('5. Per 1,000 words, typed / voice: like %.1f / %.1f (one word in 25); bro %.1f / %.1f; shit %.1f / %.1f; any fuck form %.1f / %.1f; you know %.1f / %.1f; just %.1f / %.1f; yeah %.1f / %.1f.' % (
    per1000(r"\blike\b", TYPED, W_T), per1000(r"\blike\b", VOICE, W_V), per1000(r"\bbro\b", TYPED, W_T), per1000(r"\bbro\b", VOICE, W_V),
    per1000(r"\bshit\b", TYPED, W_T), per1000(r"\bshit\b", VOICE, W_V), per1000(r"\b\w*fuck\w*", TYPED, W_T), per1000(r"\b\w*fuck\w*", VOICE, W_V),
    per1000(r"\byou know\b", TYPED, W_T), per1000(r"\byou know\b", VOICE, W_V), per1000(r"\bjust\b", TYPED, W_T), per1000(r"\bjust\b", VOICE, W_V),
    per1000(r"\byeah\b", TYPED, W_T), per1000(r"\byeah\b", VOICE, W_V)))
H.append('6. Counts, typed + voice: dogshit / dog shit %d + %d (in %d of %d typed notes); "type shit" %d + %d; "and shit" %d + %d; vibe(s) %d + %d; cook-words %d + %d; fire (= good) %d + %d; swag %d + %d; nigga %d + %d; dude %d, homie %d, "no cap" %d.' % (
    n_in(r"\bdog ?shi\w*", TYPED), n_in(r"\bdog ?shi\w*", VOICE), sum(1 for r in TYPED if re.search(r"(?i)\bdog ?shi", r['text'])), len(TYPED),
    n_in(r"\btype (?:of )?shit\b", TYPED), n_in(r"\btype (?:of )?shit\b", VOICE), n_in(r"\band shit\b", TYPED), n_in(r"\band shit\b", VOICE),
    n_in(r"\bvibes?\b", TYPED), n_in(r"\bvibes?\b", VOICE), n_in(r"\bcook(?:s|ed|ing|up)?\b", TYPED), n_in(r"\bcook(?:s|ed|ing|up)?\b", VOICE),
    n_in(r"\bfire\b(?! (?:a|the|at|his|their|off))", TYPED), n_in(r"\bfire\b(?! (?:a|the|at|his|their|off))", VOICE),
    n_in(r"\bswag\b", TYPED), n_in(r"\bswag\b", VOICE), n_in(r"\bnigga\w*", TYPED), n_in(r"\bnigga\w*", VOICE),
    n_in(r"\bdude\b", S), n_in(r"\bhomie", S), n_in(r"\bno cap\b", S)))
H.append('7. Typed punctuation (%d notes): %.0f%% end with no mark at all, %.0f%% have no punctuation anywhere, %.0f%% start with a capital, %d notes are ALL CAPS; in all of them %d "!", %d "?", %d semicolons, %d colons, %d emoji (in %d notes).' % (
    nV, 100.0 * no_end / nV, 100.0 * no_p / nV, 100.0 * sum(1 for r in VOTE if re.match(r'[A-Z]', r['text'])) / nV, sum(1 for r in VOTE if r['all_caps']),
    n_in(r"!", VOTE), n_in(r"\?", VOTE), n_in(r";", VOTE), n_in(r":", VOTE),
    sum(len(re.findall(r'[\U0001F300-\U0001FAFF☀-➿]', r['text'])) for r in VOTE), len(em)))
u1 = collections.Counter(opener(r['text'], 1) for r in up); d1 = collections.Counter(opener(r['text'], 1) for r in dn)
H.append('8. Yes and no: a thumbs-up note most often opens with good (%d), I (%d), bro (%d), nice (%d), yeah (%d); a thumbs-down note with bro (%d). %d of the %d thumbs-up notes still hold an insult word, so his yes is "good progress, not final", rarely plain praise. Bare "no" opens %d typed notes, "nah" %d.' % (
    u1['good'], u1['i'], u1['bro'], u1['nice'], u1['yeah'], d1['bro'],
    sum(1 for r in up if re.search(r'(?i)dog ?shit|\bshit\b|\bass+\b|ugly|\bbad\b|terrible|sucks?|worst', r['text'])), len(up),
    sum(1 for r in TYPED if re.match(r'(?i)no\b', r['text'])), sum(1 for r in TYPED if re.match(r'(?i)nah', r['text']))))
H.append('9. Absent in %d verbatim words: semicolons %d, em dashes %d, shall %d, whom %d, perhaps %d, indeed %d, therefore %d, moreover %d, thus %d, "as if" %d, "as though" %d. Present but rare: however %d, rather %d, quite %d. "like a/an" %d times, a plain comparison or the filler, never a figure of speech.' % (
    wc, n_in(r";", CLEAN), n_in(r"—", CLEAN), n_in(r"\bshall\b", CLEAN), n_in(r"\bwhom\b", CLEAN), n_in(r"\bperhaps\b", CLEAN),
    n_in(r"\bindeed\b", CLEAN), n_in(r"\btherefore\b", CLEAN), n_in(r"\bmoreover\b", CLEAN), n_in(r"\bthus\b", CLEAN), n_in(r"\bas if\b", CLEAN),
    n_in(r"\bas though\b", CLEAN), n_in(r"\bhowever\b", CLEAN), n_in(r"\brather\b", CLEAN), n_in(r"\bquite\b", CLEAN), n_in(r"\blike an? \b", CLEAN)))
H.append('10. The coordinator\'s copies clean him up, which is why they are not counted: per 1,000 words the VAMILY quotes of the same speech carry like %.1f (verbatim %.1f), bro %.1f (%.1f), you know %.1f (%.1f), and %.1f semicolons (verbatim %.1f).' % (
    per1000(r"\blike\b", cond, cw), per1000(r"\blike\b", VOICE, W_V), per1000(r"\bbro\b", cond, cw), per1000(r"\bbro\b", VOICE, W_V),
    per1000(r"\byou know\b", cond, cw), per1000(r"\byou know\b", VOICE, W_V), per1000(r";", cond, cw), per1000(r";", VOICE, W_V)))
H.append('')
idx = out.index('## 1. How many quotes, per channel')
out[idx:idx] = H

open(os.path.join(HERE, 'stats.md'), 'w', encoding='utf-8').write('\n'.join(out) + '\n')
print('wrote stats.md,', len(out), 'lines')
