#!/usr/bin/env python3
"""
make_about_talk.py -- writes about_talk.md: every quote of his about how the game's people talk
(dialog, text, words, tweets/posts, the feed, the radio, Spanglish, humour, names, reading level, boring,
not human, swag, captions), newest first, verbatim, with source and date.

The list of WHICH quotes belong here was picked by hand after reading every keyword hit in corpus.jsonl
(two keyword sweeps, 409 candidate rows). The TEXT of every quote is pulled from corpus.jsonl by this script
(or, in part 4, from the named law file); the script fails if a quote or an anchor is not found word for word.
"""
import json, re, os, collections

HERE = os.path.dirname(os.path.abspath(__file__))
import os as _os
REPO = _os.path.abspath(_os.path.join(_os.path.dirname(_os.path.abspath(__file__)), '..', '..', '..'))
rows = [json.loads(l) for l in open(os.path.join(HERE, 'corpus.jsonl'), encoding='utf-8')]
reg = json.load(open(os.path.join(REPO, 'records/target/BOHEMIA_VOTE_REGISTRY.json'), encoding='utf-8'))
items = {i['id']: i for i in reg['items']}

RANK = {True: 0, None: 1, False: 2}
def find(key, prefer_channel=None):
    hits = [r for r in rows if key in r['text']]
    assert hits, 'KEY NOT FOUND: ' + key
    # exact text first; then verbatim; then a dated row; a verbatim row: the shortest that holds the key;
    # a condensed row: the longest copy
    hits.sort(key=lambda r: (0 if r['text'] == key else 1, RANK[r['verbatim']], 0 if r.get('date_if_known') else 1,
                             0 if r['kind'] in ('vote_comment', 'verbatim_block') else 1,
                             r['n_words'] if r['verbatim'] is True else -r['n_words']))
    return hits[0]

def excerpt(text, start=None, end=None):
    a = 0; b = len(text)
    if start:
        assert start in text, 'START NOT FOUND: ' + start
        a = text.index(start)
    if end:
        assert end in text[a:], 'END NOT FOUND: ' + end
        b = text.index(end, a) + len(end)
    s = text[a:b]
    return ('[cut] ' if a > 0 else '') + s + (' [cut]' if b < len(text) else '')

def label(r):
    if r['verbatim'] is True:
        how = 'VERBATIM'
    elif r['verbatim'] is False:
        how = 'ENTERED BY THE COORDINATOR from his speech'
    else:
        how = 'CONDENSED by the coordinator or a lane'
    ch = {'typed_vote': 'typed in the VOTE tab', 'voice_record': 'said to the coordinator (record)', 'vamily_quote': 'quoted in ' + r['source_file']}[r['channel']]
    if r['channel'] == 'typed_vote' and r['kind'] in ('verbatim_block', 'message_with_export'):
        ch = 'his message sent with a VOTE export'
    if r['kind'] == 'anything_else_box':
        ch = "the VOTE tab's ANYTHING ELSE box"
    return how + '; ' + ch

# (key, [ (start, end), ... ] or None for the whole quote, tags, note)
CORE = [
 ("every time you have a human talk", None, "dialog, not human, swag, tweets, captions, the homework",
  "Only VAMILY.md rule 454 holds this; no record file has the full message. The '...' are the coordinator's cuts."),
 ("I want there to be a sentence, just one sentence, maybe with a", None, "text in the fight, one sentence, why they attack", "Only in VAMILY.md."),
 ("don't worry about the words, I got them", [("So if you had to direct a campaign", "I got them")], "marketing words: he writes them himself", None),
 ("they'll tell a story about your granddad", None, "what people say about you", "Only in VAMILY.md."),
 ("It is a cause of concern you kinda suck at sounding like a human tweeting", None, "tweets, not human", None),
 ("Bro this what the tweets are for", None, "tweets, the radio", None),
 ("do not cook a single more fucking Spanglish line", None, "Spanglish", None),
 ("I wanted to feed post to kind of talk a lot about like the rest of the world", None, "the feed, the world", "'feed post' = the feed's posts."),
 ("you need to find a final character count", None, "the feed, length", "'the feet' = the feed."),
 ("tweets are too fat for it", None, "the feed, length", None),
 ("depressingly scary", None, "the radio, transmissions, how communication should feel, swag", None),
 ("we're not adding real voices bro", None, "the radio, voices, writing", None),
 ("don't put any writing anywhere that's called Las Vegas", None, "names", None),
 ("the tweet shit is still fucked man", None, "the feed, the text box", None),
 ("a new perk potentially called decoy", None, "a line he wrote himself, humour", None),
 ("three of them are named the same", [("We need more more rare characters", "named the same thing in my company")], "names", None),
 ("on the victory screen one of your surviving characters provides commentary", None, "who speaks after a fight, funny, morbid", "Only in VAMILY.md."),
 ("there's two tweets that go out that you can see", None, "the feed, how long a tweet stays", "Only in VAMILY.md."),
 ("Pool pole spear: this is so fire and so funny", [("Pool pole spear", "I want this in the game")], "what he finds funny", "Only in VAMILY.md and on a redo card."),
 ("the perks have more like eighth grade level reading translation", None, "reading level, names of perks", "A cut bullet from a longer message the record did not keep whole."),
 ("the usernames can tell a real awesome story", None, "usernames, tweets, memes", "'awards' = words."),
 ("it's pretty much gonna be tweets", None, "the feed, tweets", None),
 ("supposed to be like the social media experience", [("You know all things talking about these are supposed to be like the social media experience", "quick edit to the name")], "the feed, names", None),
 ("the fee shouldn't be a button", [("the feed button the fee shouldn't be a button", "bigger catalog")], "the feed", "'the fee' = the feed."),
 ("I should be able to custom name my my group", [("I should be able to custom name my my group", "bro for real.")], "names", None),
 ("I don't want just a bunch of words", [("it's just a bunch of ugly fucking numbers", "down red icon")], "words against icons", None),
 ("there's a lot of Spanish going on", [("Also like bro, like there's a lot of Spanish going on", "shoving me in my fucking piss."),
                                      ("I do like how during, I believe our team members are speaking", "oh fuck they got shot"),
                                      ("but also when I die", "they can't speak anymore")], "Spanglish, crew talk in a fight, personality, commentary", "'1015%' = 10 to 15%."),
 ("squiggle voices that I'm trying to pull off", None, "voices when people speak", None),
 ("overkill with the amount of texts", [("it doesn't need to display so much information", "amount of texts that you put on the phone")], "too much text", None),
 ("Like that's part of the swag aesthetic.", [("Like that's part of the swag aesthetic.", "weird like that.")], "swag", None),
 ("I think they call it radio or whatever", None, "the radio", None),
 ("Bro, this voice was so fucking bad.", None, "voices", None),
 ("Nice can these people start getting portraits when you click and talk to them", None, "talk comes with a face", None),
 ("I don't know why all of our characters that are speaking to us", None, "talk comes with a face", None),
 ("We can make it harder and u have to find out through dialogue", None, "dialogue", None),
 ("it'd be cooler if it was like narrated", [("for example the text that you read on screen is very cool", "if I wanted it to be narrated")], "narration", None),
 ("make sure main coordinator talks w me about this shit", None, "names of perks", "He pasted the card's first words into the box, then typed this."),
 ("I don't even wanna wall of text", None, "no wall of text", None),
 ("explained in two sentences", [("from now on anything that you want me to read on that boat shit", "And a story moving forward for everything.")], "how much he will read", "'boat shit' = vote shit."),
 ("This shit's not even proper English bro", None, "wording", None),
 ("Renown is out clout economy translation dumbass", None, "names of things", None),
 ("I like the new translation.", None, "names of things", None),
 ("I would like to have some narration in this shit", None, "narration, voices", None),
 ("everything will need to have a proper translation type shit", None, "names of things", None),
 ("let's just re-create battle Brothers with our whole swag", [("bro let's just re-create battle Brothers with our whole swag", "how did battle Brothers do it?")], "swag", None),
 ("Study all the words of battle brothers.", None, "words", "Only in VAMILY.md."),
 ("possible to have like narration", [("Also, I wanted to ask you do you think it's possible to have like narration", "literally like yeah")], "narration", None),
 ("some assassins, Creed twist or something", [("It has to make sense story wise and technology wise", "more fun with this")], "story, tone", None),
 ("Keep in mind quest aren't gonna be like traditional quest", None, "quests are not text", None),
 ("putting more text on a screen in places I never ask for", [("That was dog shit let me tell you this putting more text on a screen", "you're making progress")], "too much text", None),
 ("speech bubbles of people", [("or like maybe as you move around", "potentially you know")], "speech bubbles", None),
 ("dialogue choices", [("but I kind of want the quest even to be like battle Brothers", "appreciate that")], "dialogue choices, quests", None),
 ("Cool accidental story? Dont force this on me", None, "story, names", None),
 ("U cant flip to them until u name them previously", None, "names", None),
 ("impressed with the speech", [("but I'm pretty impressed with the speech right now", "I'm impressed with that.")], "the feed's writing", None),
 ("Idk what i was reading wtf", None, "what was I reading", None),
 ("Boring asfff", None, "boring", None),
 ("So boring", None, "boring", None),
 ("Boring asf", None, "boring", "Cast on three cards (see part 2)."),
 ("Chill with the spanglish bro", None, "Spanglish, the player's own lines", None),
 ("Good a little more percentage of white people names", None, "names", None),
 ("What makes you think writing a storytime about this would be a good idea", None, "text against pixels", None),
 ("I don't wanna fucking card at the end of the day", None, "cards", None),
 ("More analog horror no more cards with quest just make an actual actual quiz", None, "cards against real quests", "The VOTE tab's ANYTHING ELSE box, dictated; 'quiz' = quest. It rode along unchanged in every later export."),
 ("what's up with all these fucking fucked up like quest cards", [("what's up with all these fucking fucked up like quest cards", "when I click on them.")], "cards", None),
 ("I appreciate the deep psychological philosophical dive", None, "tone", None),
 ("text on screen coming from People's voice", [("If if it's you want me to do something", "it's really disappointing.")], "text comes from a mouth with a face", None),
 ("bullshit ass text prompts", [("When when we make these quest live", "make me feel good.")], "text prompts", None),
 ("the social posts just scrolling", None, "the feed", "The copy in CLAUDE.md; a fuller copy is in part 4."),
 ("every time the chats try to talk to me", None, "reading level", "About how the chats talk to HIM, kept because it sets his reading level."),
]

BORDER = [
 ("these little pop-up events are fucking with my fast speed vibe", None, "pop-ups", "Only in VAMILY.md."),
 ("I'm seeing the phone covers up the UI box where people are talking", None, "the talk box", "Only in VAMILY.md."),
 ("it has to be naturally part of the world or I don't want it the little floating labels", None, "labels", None),
 ("floating city labels, your shit was fucked already", None, "labels", "Spoken to the coordinator; VAMILY.md has the longest copy."),
 ("Remove the Notes button from everywhere", [("OK so first off the text that's on the screen", "I don't want any of them."),
                                             ("so keep that in mind wherever you're gonna place all the text everywhere moving forward", "behind it")], "where text sits", None),
 ("only have post economic apocalypse new game and continue", [("you have to have the the word Bohemia underneath", "new game and continue")], "the words on the start screen", None),
 ("cut Syn or whether a text box", [("whether we get through a cut Syn or whether a text box", "on our journey or something or whatever")], "how the game opens", "'cut Syn' = cutscene."),
 ("I need you to have icons for all the perks", [("I need you to have icons for all the perks", "what's written for it as well")], "icons with the words", None),
 ("doesn't explain to you at all", [("the game doesn't explain to you at all", "your weapon suck and shit")], "what the game explains", None),
 ("in the phone can all of the font be like tinier", None, "text size", None),
 ("the combat log is not needed", [("the combat log is not needed", "icons and shit too")], "the combat log", None),
 ("The tutorial is to toggle at the very beginning", [("The tutorial is to toggle at the very beginning", "don't go gung ho.")], "tutorial", "'the demo will' is how the dictation left it."),
 ("as far away as possible from the standard look of vibe-coding", None, "font, not looking AI-made", "Only in VAMILY.md; tidied (the semicolons are the coordinator's)."),
 ("Think about how battle Brothers starts OK thank you", None, "pop-up events", None),
]

out = []
def P(*a):
    out.append(' '.join(str(x) for x in a))

def emit(entry, n):
    key, cuts, tags, note = entry
    r = find(key)
    if cuts:
        text = ' '.join(excerpt(r['text'], a, b) for a, b in cuts)
        text = text.replace('[cut] [cut]', '[cut]')
    else:
        text = r['text']
    extra = ''
    if r.get('card_title'):
        extra = '; on the card "%s" (%s, lane %s, thumbs %s)' % (r['card_title'], r.get('card_id'), r.get('card_lane'), (r.get('vote') or '?').upper())
    P('**%d. %s** | about: %s' % (n, r.get('date_if_known') or 'no date', tags))
    P('')
    P('> "%s"' % text)
    P('')
    P('%s. Source: `%s`%s.%s' % (label(r), r['source_file'], extra, (' Note: ' + note) if note else ''))
    P('')
    return r

P('# WHAT HE HAS SAID ABOUT HOW THE GAME TALKS')
P('')
P('Every quote of his, found in the three named sources, about how people in the game should talk: dialog, text, words,')
P('tweets and posts, the feed, the radio, Spanglish, funny and morbid humour, names, reading level, "boring", "not human",')
P('"swag", captions. Newest first. Built by `make_about_talk.py` from `corpus.jsonl`; no quote is retyped.')
P('')
P('How to read an entry:')
P('- **VERBATIM** = a raw note from the VOTE tab, or a block a record itself labels as his words (voice to text, so garbles stay).')
P('- **CONDENSED** = the coordinator or a lane quoting him: words cut (their `...`), fillers dropped, commas and semicolons added.')
P('  Use these for WHAT he wants, not for HOW he sounds.')
P('- `[cut]` = I trimmed a long verbatim block to the part about talk; the words between two `[cut]` marks are one unbroken span.')
P('- `...` inside a quote was already in the file (the recorder\'s cut).')
P('')

# ----------------------------------------------------------------------------------------- part 1
P('## 1. The quotes, newest first')
P('')
ent = []
for e in CORE:
    r = find(e[0])
    ent.append((r.get('date_if_known') or '0000', e))
order = sorted(range(len(ent)), key=lambda i: (ent[i][0], -i), reverse=True)
n = 0
for i in order:
    n += 1
    emit(ent[i][1], n)

# ----------------------------------------------------------------------------------------- part 2
P('## 2. His verdicts on the WORDS lane\'s cards and on every "line" card')
P('')
P('From `records/target/BOHEMIA_VOTE_REGISTRY.json`: items whose lane starts with "words" or whose kind is "line", joined to')
P('verdicts[]. The card\'s own text is shown where the registry holds it, so you can see what he was calling boring. THE CARD\'S')
P('TEXT IS A LANE\'S WRITING, NOT HIS.')
P('')
V = collections.defaultdict(list)
for v in reg['verdicts']:
    V[v['id']].append(v)
sel = [i for i in reg['items'] if str(i.get('lane', '')).lower().startswith('words') or i.get('kind') == 'line']
def vdate(v):
    # 'when' is the day he voted (the export's date), the same date part 1 uses; 'at' is the day it was logged
    m = re.match(r'(\d+)/(\d+)', v.get('when', '') or '')
    if m:
        return '2026-%02d-%02d' % (int(m.group(1)), int(m.group(2)))
    return v.get('at') or '0000'
judged = []
for it in sel:
    for v in V.get(it['id'], []):
        judged.append((vdate(v), it, v))
judged.sort(key=lambda x: x[0], reverse=True)
def card_text(it, limit=420):
    sh = it.get('show') or {}
    if isinstance(sh, dict) and sh.get('how') == 'text' and isinstance(sh.get('src'), str):
        t = re.sub(r'\s*\n\s*', ' / ', sh['src'].strip().replace('\\n', '\n'))
        t = re.sub(r'[ \t]+', ' ', t)
        return t[:limit] + (' [more on the card]' if len(t) > limit else '')
    return None
def block(title, pred):
    P('### ' + title)
    P('')
    k = 0
    for d, it, v in judged:
        if not pred(v):
            continue
        k += 1
        said = v.get('said', '').strip()
        said = re.sub(r'\s+', ' ', said)
        P('**%s | thumbs %s | "%s"** (lane %s, kind %s, made %s, id `%s`)' % (d, v['vote'].upper(), it['title'], it['lane'], it['kind'], it.get('made'), it['id']))
        P('')
        P('- HIS WORDS: ' + ('"%s"' % said if said else '(no words)'))
        ct = card_text(it)
        if ct:
            P('- the card showed (the lane\'s text, not his): ' + ct)
        elif it.get('why'):
            P('- what the lane said the card was (the lane\'s text, not his): ' + it['why'][:300] + ('...' if len(it['why']) > 300 else ''))
        P('')
    if not k:
        P('(none)')
        P('')
    return k
kd = block('2a. Thumbs DOWN (every one, with or without words)', lambda v: v['vote'] == 'down')
ku = block('2b. Thumbs UP with words', lambda v: v['vote'] == 'up' and v.get('said', '').strip())
up_silent = [(d, it, v) for d, it, v in judged if v['vote'] == 'up' and not v.get('said', '').strip()]
P('### 2c. Thumbs UP with no words (%d)' % len(up_silent))
P('')
for d, it, v in up_silent:
    P('- %s | "%s" (lane %s, id `%s`)' % (d, it['title'], it['lane'], it['id']))
P('')
unj = [it for it in sel if it['id'] not in V]
P('### 2d. Not judged yet (%d of %d such cards)' % (len(unj), len(sel)))
P('')
hw = [it for it in unj if 'hw01' in it['id']]
P('%d of these are the WORDS TWO homework cards made 11/17 (one game line each, waiting for him): ' % len(hw) + '; '.join('`%s`' % it['id'] for it in hw[:3]) + ' ...')
P('')
P('The other %d: ' % (len(unj) - len(hw)) + '; '.join('"%s" (%s)' % (it['title'][:60], it['lane']) for it in unj if 'hw01' not in it['id']))
P('')

# ----------------------------------------------------------------------------------------- part 3
P('## 3. Close to the subject: where text sits, how big it is, labels, pop-ups')
P('')
P('Not about how a line sounds, but about words on the screen. Newest first.')
P('')
ent = []
for e in BORDER:
    r = find(e[0])
    ent.append((r.get('date_if_known') or '0000', e))
order = sorted(range(len(ent)), key=lambda i: (ent[i][0], -i), reverse=True)
n = 0
for i in order:
    n += 1
    emit(ent[i][1], n)

# ----------------------------------------------------------------------------------------- part 4
P('## 4. Outside the three named sources (found in laws/ while checking; NOT in corpus.jsonl)')
P('')
P('Five older messages that the laws quote and the three sources do not hold in full. Pulled word for word from the law file named.')
P('')
def straight(s):
    return (s.replace('“', '"').replace('”', '"').replace('‘', "'").replace('’', "'").replace('…', '...'))
LAWS = [
 ('2026-09-04', 'laws/BOHEMIA_ADDENDUM_THE_FEED_ON_THE_CITY_SCREEN_9_4_26.md', 'the social post just like scrolling', 'the feed'),
 ('2026-08-26', 'laws/BOHEMIA_LAW_EVERYBODY_HAS_A_FACE_8_27_26.md', 'every time you speak to someone, their portrait will pop up on screen', 'talk comes with a face that moves'),
 ('2026-08-25', 'laws/BOHEMIA_ADDENDUM_THEY_SPEAK_SPANGLISH_8_25_26.md', 'make them speak spanglish for our game', 'Spanglish, poor English'),
 ('2026-08-11', 'laws/BOHEMIA_ADDENDUM_DIALOGUE_REFERS_TO_THE_CATALOGUE_8_11_26.md', 'I HAVE A WHOLE 170 QUEST FILE WITH DIALOGUE', 'dialogue, he edits later'),
 ('2026-08-11', 'laws/BOHEMIA_ADDENDUM_ALWAYS_MAKE_AN_ATTEMPT_8_11_26.md', 'JUST HAVE PLACEHOLDING GOOD ESTIMATES OF SPEECH', 'placeholder speech, he edits live'),
]
for i, (d, path, key, tags) in enumerate(LAWS, 1):
    t = straight(open(os.path.join(REPO, path), encoding='utf-8', errors='replace').read())
    q = None
    for m in re.finditer(r'"([^"]{20,})"', t, flags=re.S):
        if key in re.sub(r'\s+', ' ', m.group(1)):
            q = re.sub(r'\s+', ' ', re.sub(r'\n[ \t]*(?:>|#+)[ \t]?', '\n', m.group(1))).strip()
            break
    assert q, 'LAW QUOTE NOT FOUND: ' + key
    P('**%d. %s** | about: %s' % (i, d, tags))
    P('')
    P('> "%s"' % q)
    P('')
    P('As the law file quotes him (the law presents it as his words; its own `...` are cuts). Source: `%s`.' % path)
    P('')

open(os.path.join(HERE, 'about_talk.md'), 'w', encoding='utf-8').write('\n'.join(out) + '\n')
print('wrote about_talk.md:', len(CORE), 'core quotes,', len(judged), 'card verdicts (%d down, %d up with words),' % (kd, ku), len(BORDER), 'borderline, %d from laws' % len(LAWS))
