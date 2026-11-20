# WORDS THREE 11/20: writes THE VOICE (laws/BOHEMIA_LAW_THE_VOICE_11_17_26.md), plainly, from everything he has given so far:
# rule 455 (scary first, his law in his own words), his four homework answers (ask row 643), the bedrock (row 637), the complaint
# that started it (row 628), and every other thing he has said about how the game's people talk, EACH OF HIS LINES BESIDE WHAT IT
# TEACHES. VAMILY rules 454(d), 455, 458(a), 461. It replaces tools/bohemia_words_two_the_voice.py as the page's writer (that tool
# still writes its 11/18 record and the second reading; it no longer writes the page).
# HIS WORDS ARE NEVER TYPED HERE AS TRUTH: every quote of his is checked word for word against the file it came from (his record,
# the VOTE registry's verdicts, VAMILY.md where only the coordinator's copy exists, and that is said on the page), and his four lines
# come out of the registry's verdicts. HIS TEXT IS NEVER CORRECTED, not even a missing apostrophe. The count a mouth is read from
# records/words_two/scary_first_second_reading.json (written by the older tool; read only here). It rewrites nothing in the game.
#   python3 tools/bohemia_words_three_the_voice.py          (from the repo root)
import json, re
def J(p): return json.load(open(p, encoding='utf-8'))
norm = lambda s: re.sub(r'\s+', ' ', s).strip()
PAGE = 'laws/BOHEMIA_LAW_THE_VOICE_11_17_26.md'
REC = 'records/BOHEMIA_PAOLO_SCARY_FIRST_THE_GRINDER_AND_THE_CAR_CAMPS_11_17_26.md'
REGF = 'records/target/BOHEMIA_VOTE_REGISTRY.json'
rec = norm(open(REC, encoding='utf-8').read())
def his(q):
    assert norm(q) in rec, 'NOT HIS WORDS AS RECORDED: ' + q[:70]
    return q
reg = J(REGF); verd = {v['id']: v for v in reg['verdicts']}
def said_on(card, q):   # a typed note of his in the VOTE tab, checked against the registry
    s = verd.get(card, {}).get('said') or ''
    assert norm(q) in norm(s), 'NOT HIS NOTE ON ' + card + ': ' + q[:60]
    return q
def said_in(path, q):   # a sentence of his in a record (or the coordinator's copy in VAMILY.md), checked against the file
    assert norm(q) in norm(open(path, encoding='utf-8').read()), 'NOT IN ' + path + ': ' + q[:60]
    return q

# ---------- his four answers, from the registry ----------
ans = []
for i in reg['items']:
    if i.get('lane') == 'words two' and i['id'] in verd and verd[i['id']].get('said'):
        v = verd[i['id']]; h = i['homework']
        ans.append(dict(id=i['id'], n=h['n'], sheet=h['sheet'], mouth=h['mouth'], second=h.get('second'), ours=h['line'], his=v['said'], star=bool(v.get('star'))))
ans.sort(key=lambda a: (a['sheet'], a['n']))
waiting = [i for i in reg['items'] if i.get('lane') == 'words two' and i['id'] not in verd and i.get('homework')]
WAIT = {'%d.%d' % (i['homework']['sheet'], i['homework']['n']): i for i in waiting}
def card(ref):   # a card named on the page must be one still out in the tab
    assert ref in WAIT, 'the page names card ' + ref + ' but it is not waiting in the tab'
    return 'card ' + ref

# ---------- the counts (ours beside his) ----------
W = re.compile(r"[A-Za-zÀ-ÿ0-9']+")
SW = re.compile(r"\b(fuck\w*|shit\w*|damn\w*|hell|ass|asshole|bitch\w*|bastard\w*|crap|piss\w*|bullshit|goddamn|idgaf|wtf|mfs?)\b", re.I)
SPAN = re.compile(r"\b(mijo|mija|jefe|carnal|pues|órale|mira|bueno|ni modo|gracias|oye|compa|hijo|bienvenido|todo)\b", re.I)
DEAL = re.compile(r"\b(batter(y|ies)|cells?|pay\w*|paid|owe[sd]?|tax\w*|toll|price\w*|trade\w*|for free)\b", re.I)
PLEA = re.compile(r"\b(please|help)\b", re.I)
NUM = re.compile(r"\b(\d+|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|twenty|thirty|forty|fifty|hundred)\b", re.I)
def sents(t): return [s for s in re.split(r"(?<=[.!?])\s+", t.strip()) if s.strip()]
def facts(t):
    s = sents(t)
    return dict(words=len(W.findall(t)), sents=len(s), per=round(len(W.findall(t)) / len(s), 1), swears=len(SW.findall(t)), nums=len(NUM.findall(t)),
                q=t.count('?'), plea=len(PLEA.findall(t)), deal=bool(DEAL.search(t)), span=len(SPAN.findall(t)), last=len(W.findall(s[-1])),
                end=(t.rstrip()[-1:] if t.rstrip()[-1:] in '.!?' else 'nothing'))
for a in ans: a['fo'] = facts(a['ours']); a['fh'] = facts(a['his'])

# ---------- the count a mouth (read only) ----------
HR = J('records/words_two/scary_first_second_reading.json'); MM = {m['mouth']: m for m in HR['mouths']}
order = ['feed: a town falling', 'fight: the why line', 'road: what the stranger says', 'road: side quest talk', 'town: job givers at the board', 'fight: the survivor after',
         'fight: his men mid-fight', 'feed: the valley', 'road: the answer after his choice', 'town: keepers, the Elder, the bar', 'hires: rare men and the retinue', 'feed: far away',
         'bosses: the asker and after']
assert set(order) == set(MM), 'the reading has a mouth this page does not list'
def crow(k):
    m = MM[k]
    return "| %s | %s | %d of %d | %d%% | %d | %d | %d | %d |" % (k, 'all %d' % m['read'] if m['how'] == 'whole' else '%d of %d' % (m['read'], m['of']), m['scary_first'], m['read'],
                                                                   round(100 * m['scary_first'] / m['read']), m['desperate'], m['threat'], m['eerie'], m['cold'])
count_tbl = '\n'.join(crow(k) for k in order)
T = dict(read=HR['read'], scary=HR['scary_first'], D=HR['kinds']['desperate'], Th=HR['kinds']['a threat'], E=HR['kinds']['eerie'], C=HR['kinds']['cold'])
FALL = MM['feed: a town falling']; noRead = T['read'] - FALL['read']; noScary = T['scary'] - FALL['scary_first']; noD = T['D'] - FALL['desperate']

# ---------- his law, checked ----------
P1 = his("It is hell. People actually feel like they're in hell. They're in hell first, before they're in a barely surviving, one percent civilization experience. Whatever you do in this game, when you evoke a feeling out of the gamer, it is people reacting to how scary and real hell is. The emotions: it will be scary and then it can be scary happy, scary funny, scary serious. There still could be humor, but it has to be scary and then funny. I want everyone's voice to be: they can be scary confident, scary trying to be a leader, scary political. There's two words, but the first word is always scary, and whatever emotion you're trying to get out of people, the second one follows that.")
P2 = his("I really do believe people will talk to each other more desperately. It'll be this kind of thing: damn bro, you're really not gonna help starving people out because of the kindness of your heart, another piece of shit, he's gonna do it for batteries, so I got some batteries for you.")
P3 = his("The vibe I'm creating, from social media to people actually talking to you.")
R1 = his("They're in hell first, before they're in a barely surviving, one percent civilization experience."); R1b = his("it is people reacting to how scary and real hell is")
R2 = his("There's two words, but the first word is always scary, and whatever emotion you're trying to get out of people, the second one follows that.")
R3 = his("There still could be humor, but it has to be scary and then funny.")
R4 = his("damn bro, you're really not gonna help starving people out because of the kindness of your heart, another piece of shit, he's gonna do it for batteries, so I got some batteries for you."); R4b = his("people will talk to each other more desperately")
R5 = his("from social media to people actually talking to you")
G1 = his("We have to make mystery sausage out of this, because if not, we don't know what our next meal is."); G2 = his("Only the sick people will joke about it.")
BED = his("the bedrock, super important to even implementing my soul in this")
q = lambda s: '"' + s + '"'

# ---------- his four lines, each beside what it teaches ----------
K, EN, PO, OW = ('words-two-hw01-01-a-kid-begs-on-the-road-11-17', 'words-two-hw01-02-the-enemy-says-why-11-17', 'words-two-hw01-03-a-joke-post-in-the-feed-11-17', 'words-two-hw01-04-an-old-woman-offers-a-job-11-17')
A = {a['id']: a for a in ans}
assert all(k in A for k in (K, EN, PO, OW)), 'one of his first four answers is missing from the registry'
def inl(a, s): assert s in a['his'], 'not in his line: ' + s; return "'" + s + "'"
NAMES = {K: 'THE KID WHO BEGS (a road stop)', EN: "THE ENEMY'S WHY (their leader, as a fight opens)", PO: "THE FEED'S JOKE POST (a regular person in the valley)", OW: "THE OLD WOMAN'S JOB (a job giver at the board)"}
SHORT = {K: 'THE KID WHO BEGS', EN: "THE ENEMY'S WHY", PO: "THE FEED'S JOKE POST", OW: "THE OLD WOMAN'S JOB"}
k, e, p, o = A[K], A[EN], A[PO], A[OW]
TEACH = {
 K: [f"He swears about the hunger, not at you: {inl(k, 'two fucking days')}. A scared kid swears.",
     f"He counts the days, and the count goes up: two, then three. A number is for what hurts.",
     f"He asks for help and says please, and then he pays his way: {inl(k, 'I know how to shine and clean some of your equipment I see')}. Nobody asks for free.",
     f"He calls you {inl(k, 'bro')}, {inl(k, 'man')}, {inl(k, 'you guys')}. No Spanish: ours opened 'Oye, jefe'.",
     f"He pours it out: {k['fh']['sents']} sentences, about {round(k['fh']['per'])} words each (ours clipped him to {round(k['fo']['per'])}). A scared kid talks long.",
     f"He ends on the offer, while he looks at your gear ('I see'). No clever last line."],
 EN: [f"It starts with an order somebody else gave: {inl(e, 'We were told')}. Who gave it stays dark.",
      f"He insults you ({inl(e, 'rag tag bunch of fuck faces')}) and names what you owe ({inl(e, 'battery tax')}).",
      f"He ends on your body: {inl(e, 'turn you to mystery meat')}. The threat is what happens to you, said flat.",
      f"Nobody says a crew's name. Ours said 'The House'.",
      f"{e['fh']['sents']} long sentences, about {round(e['fh']['per'])} words each. An armed man takes his time."],
 PO: [f"It is typed like a phone: {inl(p, 'IDGAF')}, {inl(p, 'ur')}, a small 'i', no apostrophe, no full stop.",
      f"It is cold: somebody's mother is dying and the poster cares about his water. That is the joke, and it is scary first, then funny.",
      f"The thing is the same as ours (two jugs under the bed). What changed is who the poster is."],
 OW: [f"{inl(o, 'My Dear')}: she talks to you like family, not like a client.",
      f"She does not explain the beast: {inl(o, 'dark shadows')}. No count, no size. Afraid people do not describe the thing.",
      f"She says what is at stake, in order: the water, then the people ({inl(o, 'Theyre going to kill us next')}).",
      f"She says please and help, then the deal, as a question about you: {inl(o, 'for some batteries?')} Never a number (ours said 199).",
      f"{o['fh']['sents']} short sentences, about {round(o['fh']['per'])} words each (ours ran {round(o['fo']['per'])}). Old and scared is short of breath.",
      f"She ends on the question. Ours ended on a thought ('everybody says no').",
      f"He starred it. It is the first starred line of THE VOICE: the job board copies this shape first."],
}
for a in ans: assert a['id'] in TEACH, 'an answer of his has no WHAT IT TEACHES yet: ' + a['id']
def ex_block(a, n):
    s = "%d. %s%s\n   WAS (the game today): %s\n   HIS: %s\n   WHAT IT TEACHES (our reading, his to correct):\n" % (n, NAMES.get(a['id'], a['mouth']), '  *** HE STARRED THIS ONE ***' if a['star'] else '', q(a['ours']), q(a['his']))
    return s + '\n'.join('   - ' + t for t in TEACH[a['id']])
examples = '\n\n'.join(ex_block(a, n) for n, a in enumerate(ans, 1))

# ---------- everything else he has said about how people talk ----------
VAM = 'VAMILY.md'
OTHER = [
 ('EVERY MOUTH', [
  ('11/17, to the coordinator (the coordinator\'s copy, VAMILY rule 454; row 628)', VAM, None, "all of the dialog is so not human, no swag, no aesthetic",
   "This is the fault he named, and why THE VOICE exists: our people do not sound like people. Swag is the bar, not being correct."),
  ('9/20, to the coordinator', 'records/BOHEMIA_PAOLO_A_CARD_IS_NOT_A_QUEST_9_20_26.md', None, "text on screen coming from People's voice and when they speak to you, it shows the character portrait",
   "Every word comes out of a person with a face. No narrator box, nothing pops up on its own."),
  ('9/21, typed in the VOTE tab, on a card where the first person at your door spoke', REGF, 'words-the-first-ask-spoken-9-21', "Boring asf",
   "A line that only tells you something is dead. If nothing in it scares you or moves you, it goes."),
  ('10/24, to the coordinator', 'records/BOHEMIA_PAOLO_THE_PHONE_TWO_JOBS_TWO_HANDS_AND_STAY_ON_TOP_OF_THE_LITTLE_THINGS_10_24_26.md', None, "just to overkill with the amount of texts that you put on the phone",
   "Less. When two lines say the same thing, keep the shorter one."),
  ('10/9, typed in the VOTE tab', REGF, 'tuning-what-a-respec-costs-10-10', "We can make it harder and u have to find out through dialogue its not casual information type shit",
   "People hold what you need to know and do not hand it out. You find it out by talking to them."),
  ('9/20, to the coordinator', 'records/BOHEMIA_PAOLO_LETS_JUST_HAVE_SOME_FUN_9_20_26.md', None, "let's just have some fun bro come on",
   "No lectures and no philosophy in anybody's mouth. Hell comes first, and the game is still fun."),
  ('11/6, to the coordinator (the coordinator\'s copy, VAMILY)', VAM, None, "maybe a settlement that you're in, they'll tell a story about your granddad",
   "People talk about what you and your family did. The valley remembers you out loud."),
  ('11/3, to the coordinator', 'records/BOHEMIA_PAOLO_THE_DEAD_THE_NAME_THE_SOUND_AND_THE_FIGHT_NOTES_11_3_26.md', None, "don't put any writing anywhere that's called Las Vegas. Bohemia is Las Vegas",
   "Nobody in the game says Las Vegas. It is Bohemia, in every mouth."),
  ('9/4, his first price (the coordinator\'s copy, VAMILY rule 459)', VAM, None, "for one AA battery a bag of rice",
   "When a mouth does name a price, it is a number a person could hold in his hands. (Our reading: his old woman names none.)"),
 ]),
 ('YOU, THE PLAYER', [
  ('9/21, typed in the VOTE tab', REGF, 'words-saying-yes-to-a-job-9-15', "Chill with the spanglish bro some characters might speak Spanglish to you doesn't mean you will fucking asshole",
   "You never speak Spanglish. Other people may."),
 ]),
 ('THE SPANISH', [
  ('11/3, to the coordinator', 'records/BOHEMIA_PAOLO_NO_MORE_SPANGLISH_11_3_26.md', None, "it should really be like 15% of the human conversation vibe so if you find that it's more than 15% right now do not cook a single more fucking Spanglish line",
   "No new Spanish lines. When the game ships, about 15 in every 100 lines a player meets, never more."),
  ('9/21, typed in the VOTE tab, on the names at your door', REGF, 'people-the-names-at-your-door-9-21', "This game isn't like this Hispanic ass game so chill out up.",
   "The valley is mixed. Spanish belongs to some people, not to everybody. (He took it out of his kid.)"),
 ]),
 ('YOUR MEN IN A FIGHT', [
  ('10/24, to the coordinator', 'records/BOHEMIA_PAOLO_SPANGLISH_TEN_PERCENT_THE_WIPE_THE_COMMENTARY_AND_THE_MAP_10_24_26.md', None, "commentary vibe that people can read like reacting to shit like if someone dies be like oh fuck they got shot",
   "In a fight your men react to what just happened, fast, the way a commentator does, and they swear when a man goes down."),
  ('11/2, to the coordinator (the coordinator\'s copy, VAMILY)', VAM, None, "morbid funny, like real killers",
   "After a fight your men joke like men who kill for a living. Scary first, then funny."),
 ]),
 ('THE ENEMY', [
  ('11/14, to the coordinator (the coordinator\'s copy, VAMILY)', VAM, None, "I want there to be a sentence, just one sentence",
   "Before a fight the enemy says why they are coming for you. (OPEN: his own enemy line, above, runs two sentences.)"),
 ]),
 ('THE FEED AND THE RADIO', [
  ('11/3, typed in the VOTE tab, on the far-away posts', REGF, 'words-the-world-feed-11-3', "It is a cause of concern you kinda suck at sounding like a human tweeting. Some of it is good but a lot of it is kinda like what the fuck does that even mean type shit",
   "A post is something a real person would type, and you get it at a glance. If you have to ask what it means, it is wrong."),
  ('11/3, to the coordinator, on the last radio calls', 'records/BOHEMIA_PAOLO_THE_LAST_TRANSMISSIONS_11_3_26.md', None, "depressingly scary scary crazy death transcripts of people like oh my God like that really hits me emotionally",
   "The radio's last words are the thing he feels most: real people, scared, cut off."),
  ('11/3, the same', 'records/BOHEMIA_PAOLO_THE_LAST_TRANSMISSIONS_11_3_26.md', None, "that sort of like fucked up like it breaks your heart kind of vibe like just reading it",
   "Reading it should hurt. That is the bar for anything sent over the air."),
  ('11/2, to the coordinator (the coordinator\'s copy, VAMILY)', VAM, None, "they should only stick around for as long as it would take to read them",
   "A post is short enough to read in the time it is on the screen."),
  ('11/3, to the coordinator', 'records/BOHEMIA_PAOLO_THE_FEED_TALKS_ABOUT_THE_WHOLE_WORLD_11_3_26.md', None, "definitely international vibes kind of with Twitter",
   "The feed talks about the whole world, not just the valley."),
 ]),
 ('A LINE HE WROTE HIMSELF (besides the four)', [
  ('11/3, a perk he made up, its description', 'records/BOHEMIA_PAOLO_THE_DEAD_THE_NAME_THE_SOUND_AND_THE_FIGHT_NOTES_11_3_26.md', None, "did you seriously just walk around with a cardboard cut out",
   "His own funny: a jab, as a question, at you, about something real and dumb."),
 ]),
]
other_n = 0; blocks = []
for head, rows in OTHER:
    out = ['#### ' + head]
    for when, src, cid, quote, teach in rows:
        quote = said_on(cid, quote) if cid else said_in(src, quote)
        other_n += 1
        out.append('- %s\n  >> "%s"\n     FROM: %s%s\n     TEACHES: %s' % (when, quote, src, (' (his note on the card ' + cid + ')') if cid else '', teach))
    blocks.append('\n'.join(out))
other = '\n\n'.join(blocks)

# ---------- the short form ----------
SHORTFORM = [
 ('HELL FIRST. The first thing anybody feels from a line is that this person is in hell.', 'HIS: rule 1'),
 ('TWO WORDS, SCARY FIRST: scary funny, scary happy, scary serious, scary confident, scary trying to be a leader, scary political. Never funny alone.', 'HIS: rules 2 and 3'),
 ('NOBODY HELPS FOR FREE, AND EVERYBODY SAYS SO. A line that asks for help names the deal: work, or batteries.', 'HIS: rule 4; his kid and his old woman'),
 ('A BODY IS AT STAKE, SAID OUT LOUD: days without food, a dying mother, "kill us next", your body as meat.', 'OUR READING of all four of his lines'),
 ('THE DANGER STAYS DARK, THE NEED IS PLAIN. Do not explain the beast or who gave the order.', 'OUR READING: his old woman, his enemy'),
 ('A NUMBER IS FOR WHAT HURTS (two days, then three), never for the enemy, never for the pay ("some batteries").', 'OUR READING'),
 ('LENGTH FOLLOWS THE PERSON. A scared kid pours it out; a scared old woman is short of breath. No house length, and less is better.', 'OUR READING; HIS: "overkill with the amount of texts"'),
 ('END ON THE ASK, THE OFFER OR THE THREAT. No clever last line.', 'OUR READING; HIS: "Boring asf"'),
 ('THE YOUNG AND THE ARMED SWEAR. Your men swear when a man goes down. His old woman does not.', 'OUR READING; HIS: "oh fuck they got shot"'),
 ('PEOPLE CALL EACH OTHER WHAT THEY ARE TO THEM: bro, man, My Dear, fuck faces. Never a crew\'s name in a mouth.', 'OUR READING'),
 ('A POST IS TYPED LIKE A PHONE, AND COLD: short forms, no full stop, gone as soon as it is read.', 'OUR READING of his post; HIS: "sounding like a human tweeting"'),
 ('NO NEW SPANISH. About 15 in 100 lines at ship, some people not everybody, and never you.', 'HIS: 11/3 and 9/21'),
 ('EVERY WORD FROM A PERSON WITH A FACE, AND NOBODY SAYS LAS VEGAS.', 'HIS: 9/20 and 11/3'),
]
shortform = '\n'.join('%d. %s [%s]' % (n, s, w) for n, (s, w) in enumerate(SHORTFORM, 1))

# ---------- part two: the counts ----------
def frow(a):
    o, h = a['fo'], a['fh']
    return "| %s%s | %d / %d | %d / %d | %s / %s | %d / %d | %d / %d | %d / %d | %d / %d | %s / %s | %d / %d | %d / %d | %s / %s |" % (
        SHORT.get(a['id'], a['mouth']), ' (STARRED)' if a['star'] else '', o['words'], h['words'], o['sents'], h['sents'], o['per'], h['per'], o['swears'], h['swears'],
        o['nums'], h['nums'], o['q'], h['q'], o['plea'], h['plea'], 'yes' if o['deal'] else 'no', 'yes' if h['deal'] else 'no', o['span'], h['span'], o['last'], h['last'], o['end'], h['end'])
facts_tbl = '\n'.join(frow(a) for a in ans)
hs = [a['fh'] for a in ans]; os_ = [a['fo'] for a in ans]
qs_his = sum(1 for x in hs if x['q']); qs_ours = sum(1 for x in os_ if x['q'])

# ---------- part three: the unknowns, each with its card ----------
s1 = sorted([r for r in WAIT if r.startswith('1.')], key=lambda r: int(r[2:])); s2 = sorted([r for r in WAIT if r.startswith('2.')], key=lambda r: int(r[2:])); s3 = sorted([r for r in WAIT if r.startswith('3.')], key=lambda r: int(r[2:]))
pairs = ', '.join('scary %s (%s)' % (WAIT[r]['homework']['second'].lower(), card(r)) for r in s2 if WAIT[r]['homework'].get('second'))
UNK = [
 ('HOW EACH PAIR SOUNDS.', 'His law names the pairs; his four answers show scary begging, scary threatening, scary funny on the feed and scary asking. Still to hear: ' + pairs + '. Six of those second words are his (funny, happy, serious, confident, trying to be a leader, political); kind, proud, begging, selling, sad and angry are guesses the cards test.'),
 ('IS EERIE SCARY?', 'Part four counts a line as scary first when it is desperate, a threat, eerie or cold. None of his four is eerie, and %d of the %d we count are. A post where nobody is in danger, only something wrong nobody can explain, asks it straight (%s). If eerie is not his scary, the count falls from %d%% to %d%%.' % (T['E'], T['scary'], card('3.5'), round(100 * T['scary'] / T['read']), round(100 * (T['scary'] - T['E']) / T['read']))),
 ('THE BOSS, AND WHO SENDS YOU TO HIM.', 'Does the top dog talk more, less, or not at all (%s); today a boss has no printed line of his own. The asker who sends you after a boss is the mouth furthest from page one (%d of %d scary first) (%s).' % (card('1.12'), MM['bosses: the asker and after']['scary_first'], MM['bosses: the asker and after']['read'], card('3.1'))),
 ('YOUR MEN, TO YOU.', 'What do they call you? The game fills in "boss" (%s); no answer of his is from his own crew yet (%s, %s, %s, %s; %s, %s, %s).' % (card('3.2'), card('1.5'), card('1.8'), card('1.11'), card('1.15'), card('2.3'), card('2.11'), card('2.12'))),
 ('YOUR OWN WORDS.', 'Nearly all of your 200 buttons are written as a thing you do ("Say the company needs every hand."); a handful are already said in your own mouth ("Not our fight.", "Forget it. We have work."). Which should a button be, and how hard is your voice (%s).' % card('3.4')),
 ('THE LINES WITH NO MOUTH.', 'What comes back after a road choice (231 lines, about half told, not said) sits under a person\'s face (%s); one line of every man\'s past sits on his card in the third person (%s); a sign is read out by one of your men (%s). Who says each, or nobody.' % (card('3.3'), card('3.9'), card('3.8'))),
 ('THE SWEAR, MOUTH BY MOUTH.', 'A kid and an armed man swear, an old woman does not. A man who prays, at his most scared (%s), a shopkeeper (%s), a doc (%s), a boss (%s): not known.' % (card('3.10'), card('1.14'), card('2.7'), card('1.12'))),
 ('AGE.', 'One kid and one old woman answered. A grown man in the middle of his life is asked (%s); the kid after a death (%s).' % (card('3.1'), card('2.11'))),
 ('A LOSS.', 'Every answer so far is a win or a talk. Three short sentences after a lost fight, two of them orders (%s).' % card('3.6')),
 ('HOW LONG A PERSON MAY TALK.', 'The longest mouth is a real place\'s keeper, nine sentences about the dead dollar (%s); the longest road card (%s).' % (card('3.7'), card('1.13'))),
 ('KINDNESS.', 'His law says nobody helps out of kindness. One side quest thanks you for help nobody paid for (%s); the doc is the one whose job is to help (%s). Does it stand in hell.' % (card('3.11'), card('2.7'))),
 ('DOES THE STAR CARRY.', 'His starred old woman is one job giver of %d. A grandmother afraid of what is in her grandson\'s stew asks the same mouth again (%s).' % (MM['town: job givers at the board']['read'], card('3.12'))),
 ('THE SPANISH, MOUTH BY MOUTH.', 'He took it out of his kid. A cartel man (%s), the Elder (%s) and the bank\'s last teller (%s) still say it on their cards.' % (card('1.6'), card('1.7'), card('3.7'))),
 ('THE FEED, FAR AND FALLING.', 'He has answered one post, a joke. A far post (%s), a town falling on the radio (%s), a watch\'s page (%s), a plea (%s).' % (card('1.18'), card('1.10'), card('2.5'), card('2.9'))),
 ('A HIRE.', 'Does a man pitch himself (%s), and how does a cook brag (%s).' % (card('1.9'), card('1.19'))),
 ('ONE SENTENCE OR TWO FOR THE WHY.', 'He asked for "just one sentence" on 11/14 and wrote his own enemy line in two. Not asked; the cards will show it.'),
 ('THE APOSTROPHES.', "Two of his spoken lines have a word with none ('well' for we'll, 'Theyre'). Kept as typed; whether the game prints speech that way is not asked."),
]
assert all(r in ' '.join(t for _, t in UNK) for r in ['card ' + x for x in s3]), 'a card of sheet three is not tied to an unknown on the page'
unknown = '\n'.join('- %s %s' % (h, t) for h, t in UNK)
out_now = len(waiting)

voice = f'''# BOHEMIA -- THE VOICE (Paolo 11/17/26. Page one is LOCKED: VAMILY rule 455.)
# HOW EVERY MOUTH AND EVERY POST IN THE GAME TALKS: his rules in his own words, his own lines as the examples, and beside each of
# his lines what it teaches, in plain words. He called page one '{BED}'.
# BUILT FROM EVERYTHING HE HAS GIVEN SO FAR: rule 455 (scary first; row 637), his {len(ans)} homework answers (row 643), the complaint
# that started it (row 628), and {other_n} other things he has said about how people talk, each checked word for word against where
# he said it. It gains a rule only when he gives one.
# FOUR PARTS, IN THIS ORDER: (1) HIS WORDS; (2) WHAT CAN BE MEASURED; (3) WHAT IS STILL UNKNOWN; (4) THE GAME TODAY. Only his words
# are law. Anything marked OUR READING is this lane's, and his to correct.
# NOTHING IN THE GAME IS REWRITTEN TO IT YET (rule 454(a)). The gate that will hold the game to it is built and asleep
# (gates/the_voice_holds_gate.js): no mouth is open to a rewrite until he says go, mouth by mouth.
# Written by tools/bohemia_words_three_the_voice.py. Gate on this page: gates/the_voice_is_his_words_gate.js.
# His record: {REC}

## PART ONE: HIS WORDS

## PAGE ONE. SCARY FIRST: IT IS HELL.

HIS WORDS, kept as he said them (voice to text; the garbles left out, nothing added, nothing softened):

> '{P1}'

> '{P2}'

> '{P3}'

### THE FIVE RULES OF PAGE ONE (each one is his sentence)

1. IT IS HELL FIRST. '{R1}' Whatever the game makes the player feel, '{R1b}'.
2. EVERY VOICE IS TWO WORDS, AND THE FIRST IS ALWAYS SCARY. '{R2}'
   The second words he has named so far: happy, funny, serious, confident, trying to be a leader, political.
3. HUMOR IS SCARY, AND THEN FUNNY. '{R3}' Never funny alone.
4. THEY TALK DESPERATELY, AND NOBODY PRETENDS HELP IS FREE. He believes '{R4b}'. The sound of it, in his mouth:
   '{R4}'
   (OUR READING, his to correct: the one who needs help knows the helper wants batteries, says so, and offers them.
   Kindness is not a reason anybody gives.)
5. IT HOLDS FOR EVERY MOUTH AND EVERY POST: '{R5}'.

THE TEST OF A LINE (rule 455(e)): A LINE THAT IS NOT SCARY FIRST IS THE DEFECT, WHATEVER ELSE IT DOES WELL.

THE HORROR UNDER IT (rule 456, the grinder; it is in his own enemy line below): '{G1}' '{G2}'
(OUR READING: a mouth may say it flat, as duty; a joke about it belongs only to somebody the game means to be sick.)

### HIS OWN LINES, EACH BESIDE WHAT IT TEACHES (exactly as he gave them in the VOTE tab, rule 458(a))

{examples}

A STAR MAKES ITS WAY THE WAY (rule 115(h)). HIS TEXT IS KEPT AS HE TYPED IT: two spoken lines have a word with no apostrophe
('well' for we'll in the enemy's line, 'Theyre' in the old woman's). They are not corrected here and will not be until he says.

### EVERYTHING ELSE HE HAS SAID ABOUT HOW PEOPLE TALK, EACH BESIDE WHAT IT TEACHES ({other_n} lines)

Each is his, word for word from the file named under it. Where only the coordinator's copy of his words exists (VAMILY.md), it says
so: use those for WHAT he wants, never for how he sounds. What each TEACHES is OUR READING.

{other}

### THE VOICE SO FAR, ON ONE PAGE (what a writer does when a mouth opens; each line says whose it is)

{shortform}

## PART TWO: WHAT CAN BE MEASURED IN HIS LINES

The counts, ours beside his, the same count on both (ours / his). What each one points to is already beside his line in part one.

| Line | Words | Sentences | Words a sentence | Swears | Numbers | Questions | 'please' or 'help' | A word of the deal (batteries, pay, tax) | Spanish words | Words in the last sentence | It ends on |
|---|---|---|---|---|---|---|---|---|---|---|---|
{facts_tbl}

(The kid's 'yes / no' on the deal: OUR kid says the word only to refuse it, 'I don't want batteries'. HIS kid says no such word and
offers work. A count of words reads that backwards, so read the line.)

IN ONE BREATH: his {len(ans)} lines hold {sum(x['swears'] for x in hs)} swears to our {sum(x['swears'] for x in os_)}, {qs_his} question marks to our {qs_ours}, and {sum(x['span'] for x in hs)} Spanish words to
our {sum(x['span'] for x in os_)}; a body is at stake, said out loud, in all {len(ans)} of his and one of ours.

## PART THREE: WHAT IS STILL UNKNOWN

EACH WAITS ON HIS ANSWER, and the card that asks it is in the VOTE tab. {out_now} cards are out: {len(s1)} of sheet one ({', '.join(s1)}),
{len(s2)} of sheet two, and {len(s3)} of sheet three (queued behind sheet two so he never runs out).
{unknown}

## PART FOUR: THE GAME TODAY AGAINST PAGE ONE

HOW MANY LINES OF EACH MOUTH ARE SCARY FIRST TODAY. Read by hand, one reader (WORDS TWO), one question: read cold, is the first thing
felt that this person is in hell? A mouth of 170 lines or fewer was read WHOLE; a bigger one as 36 lines by a fixed draw. Every line
and its mark: records/words_two/scary_first_second_reading.json. The marks are his to overturn.

| Mouth | Read | Scary first | Share | Desperate | A threat | Eerie | Cold |
|---|---|---|---|---|---|---|---|
{count_tbl}
| ALL THAT WAS READ | {T['read']} | {T['scary']} of {T['read']} | {round(100 * T['scary'] / T['read'])}% | {T['D']} | {T['Th']} | {T['E']} | {T['C']} |

- ABOUT A THIRD. {T['scary']} of {T['read']} lines read are scary first; outside the one mouth written to his own brief (a town falling), {noScary} of {noRead}
  ({round(100 * noScary / noRead)}%).
- DESPERATE IS ONE LINE IN TEN. Two of his four lines are somebody afraid or in need, saying so. Outside the town falling, {noD} of {noRead}
  of ours are ({round(100 * noD / noRead)}%). Most of our scary is a threat ({T['Th']}) or eerie ({T['E']}).
- THE MOUTHS FURTHEST FROM PAGE ONE: the askers who send him after a boss, the far feed, the hires, the keepers. When he says go, the
  rewrite starts there, mouth by mouth.

## WHAT THIS PAGE DOES TO THE OLDER PAGES

- laws/BOHEMIA_VOICE_CARD_8_26_26.md (the WORDS lane's seven rules, 8/26) stands where it does not disagree; where it does, this page
  wins (newest date). Its 'NOBODY IN BOHEMIA IS WISE', 'contract it' and 'cut the last sentence' agree with his lines above. It is
  folded into this page, and archived, when THE VOICE is whole.
- laws/BOHEMIA_LAW_ANALOG_HORROR_FOR_EVERY_PIXEL_AND_EVERY_SOUND_9_20_26.md was the pixels and the sound; rule 455 says this is the
  same law for the mouth.
- Unchanged: the player never speaks Spanglish; text comes from a mouth with a portrait; every line is a draft:true attempt until he
  says otherwise.
'''
assert '—' not in voice, 'an em dash'
open(PAGE, 'w', encoding='utf-8').write(voice)
print('THE VOICE written: %d answers of his, %d other lines of his, %d cards out (%d/%d/%d), %d mouths counted' % (len(ans), other_n, out_now, len(s1), len(s2), len(s3), len(order)))
