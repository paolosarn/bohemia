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

# ---------- every answer of his on the homework, from the registry (11/21: sheets one and two, rule 466(f)) ----------
# THREE KINDS: (1) HIS LINE, a YES or a star with his own line written (the examples); (2) KEPT AS IT IS, a YES on our line with
# a judgement ('Decent') or nothing written; (3) NO, what the voice is not, with his words. A note of his that carries a line of his
# own in quotes after it ("Bro, why are you scared to like curse... \n\n "Look there..."") gives the quoted line as HIS and the rest
# as what he said with it. Nothing of his is corrected: 'your're', 'Ive', 'henderson', 'the  tax' stay as typed.
answered = []
for i in reg['items']:
    if i.get('lane') == 'words two' and i.get('homework') and i['id'] in verd:
        v = verd[i['id']]; h = i['homework']
        answered.append(dict(id=i['id'], n=h['n'], sheet=h['sheet'], mouth=h['mouth'], second=h.get('second'), ours=h['line'], tried=h.get('try'), said=v.get('said') or '', vote=v.get('vote'), star=bool(v.get('star'))))
answered.sort(key=lambda a: (a['sheet'], a['n']))
KEPT_AS_IS = {'words-two-hw02-03-serious-a-man-is-dead-11-17': "his YES, and one word: 'Decent'",
              'words-two-hw03-01-the-trucker-sends-you-11-20': "his YES, and a note about the map (rule 470(c))",
              'words-two-hw03-04-your-own-button-11-20': "his YES, and a limit on what the button brings back (rule 470(h))",
              'words-two-hw05-05-count-money-in-grief-11-21': "his YES, minus one word ('Just remove lucrative')",
              'words-two-hw06-05-curse-the-herds-why-11-22': "his YES on our try, and a fix: you are the dinner"}   # a YES whose note judges our line instead of rewriting it
def split(s):
    m = re.search(r'\n\s*"([^"\n]+)"\s*$', s)
    return (m.group(1), s[:m.start()].strip()) if m else (s, '')
ans, kept, nos = [], [], []
for a in answered:
    if a['vote'] == 'down': nos.append(a)
    elif a['id'] in KEPT_AS_IS or not a['said'].strip(): kept.append(a)
    else: a['his'], a['note'] = split(a['said']); ans.append(a)
kept_game = [a for a in kept if not a.get('tried')]; kept_try = [a for a in kept if a.get('tried')]
import glob
SHEETCARD = {}
for f in sorted(glob.glob('records/target/words_two/homework_*.json')):
    for c in J(f)['cards']: SHEETCARD[c['id']] = c
ref = lambda a: '%d.%d' % (a['sheet'], a['n'])
flat = lambda s: re.sub(r'\s*\n+\s*', ' / ', s.strip())
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
def I(key):   # 'hw01-05' -> the full card id
    hit = [x['id'] for x in answered if x['id'].startswith('words-two-' + key + '-')]
    assert len(hit) == 1, key; return hit[0]
def L(key): return A[I(key)]
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
 I('hw01-05'): [f"The joke stays ('Ka ching') and then he insults the man he just shot: {inl(L('hw01-05'), 'you piece of shit')}. A bark is aimed at somebody.",
      "In the middle of a fight a man swears (rule 467)."],
 I('hw01-06'): [f"The Spanish is gone ('Inspección', 'jefe'); he calls you {inl(L('hw01-06'), 'tough guy')}.",
      f"The threat is your body, said plain: {inl(L('hw01-06'), 'we cut your fucking head off')}.",
      f"Two roads and nothing else: show everything, or pay {inl(L('hw01-06'), 'the  tax')} and {inl(L('hw01-06'), 'get the fuck out my face')}. Our speech about 'our law' is gone.",
      "Both swears are aimed at you."],
 I('hw01-07'): ["The top man of a town is not cool or clever. He is nervous, and he asks you to be peaceful.",
      f"He says what they are doing: {inl(L('hw01-07'), 'Were trying to restart civilization round here okay?')}",
      f"The warning is about the families, said like a dad would: {inl(L('hw01-07'), 'okay?')}, {inl(L('hw01-07'), 'alright')}.",
      "No swear: an old man asking for peace does not curse here. No Spanish ('Bienvenido' is gone) and no joke about batteries.",
      "He starred it: the Elder of every town copies this shape first."],
 I('hw01-08'): ["He keeps our boots joke and makes it meaner: an insult to the dead man and a bounty on his toes.",
      "Morbid funny like real killers (his 11/2): cruel, not clever.",
      f"It drops a word the way people do: {inl(L('hw01-08'), 'These nice boots my size')}.",
      "He starred it."],
 I('hw01-09'): ["He kept our first sentence word for word: 'My crew ate each other over a water tank.' The horror was right.",
      f"He cut our soft end ('I walked. I can walk with you.') for a brag: {inl(L('hw01-09'), 'real deal killers')}.",
      "A man for hire sells himself by how dangerous he is, not by being gentle. He starred it."],
 I('hw01-10'): [f"A radio call is a question, then a prayer, then it trails off: {inl(L('hw01-10'), 'God help us...')}",
      "Capitals and question marks: a scared person calling, not a lower-case post.",
      "Nobody swears here. They are too scared (rule 467: not every line). He starred it."],
 I('hw01-11'): [f"His men call him {inl(L('hw01-11'), 'Boss.')}",
      f"How a man starts a confession: {inl(L('hw01-11'), 'I gotta be honest.')} Why first, then what he did.",
      "No exact count ('Six short', 'I counted twice' are gone) and no excuse at the end ('I was going to tell you' is gone).",
      "Four short sentences. He starred it."],
 I('hw01-12'): ["The top dog does not talk smooth or mysterious. He threatens you, with two swears.",
      f"It opens on a question, {inl(L('hw01-12'), 'You got some beef?')}, and ends on what he will do to your face.",
      "Two sentences. He starred it: every boss copies this shape first."],
 I('hw01-14'): [f"A seller sells: {inl(L('hw01-14'), 'Whatever you need we got it.')} No rules about prices, no 'No haggling'.",
      f"The money is said as a favour to you: {inl(L('hw01-14'), 'You\'re lucky we deal in batteries')}. No numbers."],
 I('hw01-15'): [f"Two words: a name and a swear. {inl(L('hw01-15'), 'DESI! FUCK!')} That is the whole sound of a friend going down.",
      "'Don't you dare' was a movie line; 'FUCK!' is a person."],
 I('hw02-04'): [f"He points and asks if you are in: {inl(L('hw02-04'), 'you down?')}",
      f"The fighters are named with a curse: {inl(L('hw02-04'), 'motherfuckers')} (rule 467).",
      f"Street grammar, not written English: {inl(L('hw02-04'), 'Them the motherfuckers')}.",
      "Our explanation of winning and losing is gone. One look, one question."],
 I('hw02-07'): [f"He kept our first words: {inl(L('hw02-07'), 'Let me see them')}.",
      f"The doc talks about the body, gross and real: {inl(L('hw02-07'), 'that pus bomb')}. No days, no price.",
      f"A little kind ({inl(L('hw02-07'), 'least I can do')}), but scary first: the wound could burst. No swear here."],
 I('hw02-08'): [f"Our clever line ('out of spite') became a man telling it plainly: {inl(L('hw02-08'), 'literally')}, {inl(L('hw02-08'), 'I don\'t know')}, {inl(L('hw02-08'), 'I guess')}.",
      "Proud is not a punchline. It is a man still surprised he lived, and he thanks God."],
 I('hw02-09'): [f"{inl(L('hw02-09'), 'SOS')}, not 'ISO': a cry, not an ad.",
      f"The body is said: {inl(L('hw02-09'), 'she\'s gonna die')}.",
      "No 'message me, please': the danger does the asking."],
 I('hw02-10'): [f"A brand is fine when it is a real thing for sale, and this one came off the dead: {inl(L('hw02-10'), 'from some of the corpses')}.",
      "Our insult became a pitch, and the joke and the price are gone ('Twenty batteries and you live forever').",
      f"{inl(L('hw02-10'), 'Darling')} stays: a seller's word."],
 I('hw02-12'): ["One sentence, the threat first. The story of what Rico did is gone.",
      f"He puts it on you, the boss, and swears: {inl(L('hw02-12'), 'unless you solve this shit right now')}.",
      "Our careful 'unless you tell me why I should not' is gone."],
 I('hw01-16'): [f"The priest says why plainly: {inl(L('hw01-16'), 'Too many people died during the crash')}, and nobody sent them off.",
      f"It ends on the ask, short: {inl(L('hw01-16'), 'Pray with me tonight Hijo, it will only be a minute.')}",
      "'Hijo' stays: a priest's word. No curse: a priest."],
 I('hw01-18'): ["The eerie habit of a place (a horn at six) became one person: her husband, who still gets up for work.",
      f"The horror is said plain: {inl(L('hw01-18'), 'He has Alzheimer\'s.')} And a blessing at the end, no full stop."],
 I('hw01-19'): [f"He kept the brag: {inl(L('hw01-19'), 'I fed the whole strip once.')}",
      f"Our insult ('half of what you are wasting') became a promise about hunger: {inl(L('hw01-19'), 'make sure you guys don\'t starve')}."],
 I('hw03-03'): ["The line with no mouth got a mouth: somebody says it to you, and mocks you.",
      f"Help nobody paid for gets a sneer, not a thank you: {inl(L('hw03-03'), 'What do you want fucking cookie?')}"],
 I('hw03-06'): [f"He kept {inl(L('hw03-06'), 'We lost. Get up.')} and made our 'Count heads' plainer: {inl(L('hw03-06'), 'We need to count whats left.')}",
      "A beaten crew's leader does not need to curse."],
 I('hw03-09'): ["The line about a man became his own words, first person.",
      f"Our haunted line ('Still hears him asking for it') became a shrug: {inl(L('hw03-09'), 'Not my proudest moment.')}"],
 I('hw04-05'): [f"He swears and says it like a person: {inl(L('hw04-05'), 'They got me fucked up for a month boss.')} A month, not '34 days'.",
      f"The hurt man is scared of being dropped: {inl(L('hw04-05'), 'dont kick me to the curb')}. He begs to stay."],
 I('hw05-04'): [f"The Spanish is gone ('¡Aquí abajo!' became {inl(L('hw05-04'), 'Help!')}).",
      f"A child about to drown names both deaths, the water and the Raiders, and curses: {inl(L('hw05-04'), 'please fucking just help me')}.",
      "His 'great' for grate is kept as he typed it."],
 I('hw05-08'): ["The old soldier's speech about how a thing is done became a job, said to your face.",
      f"He knows what you are ({inl(L('hw05-08'), 'I know a group of mercenaries when I see one.')}) and dares you: {inl(L('hw05-08'), 'pussy out on these batteries')}."],
 I('hw05-09'): ["The official voice stays (an office can talk like an office), shorter and plainer.",
      f"'Family abroad is safe' is gone; the office makes an excuse instead: {inl(L('hw05-09'), 'We\'re troubleshooting this issue.')}"],
 I('hw05-11'): [f"The pun stays, said the way a man says it: {inl(L('hw05-11'), 'Looks like')} ... {inl(L('hw05-11'), 'and then some')}. One run-on breath, no full stop."],
}
KEPT_TEACH = {
 I('hw02-03'): "Short, plain news of a death works: a name, 'didn't get up', 'He's gone.' It stays as it is ('carnal' too).",
 I('hw01-20'): "A man on a corner about the dead dollar ('Nobody takes paper since the dollar died') works, 'carnal' and all.",
 I('hw03-01'): "The trucker who sends you after a boss stands as written; his note went to the map: a real fog of war that THE SURVEYOR opens (rule 470(c)).",
 I('hw03-02'): "His man saying why lab animals come ('they just come') works, and 'boss' stands.",
 I('hw03-04'): "A button may stay a thing you do ('Say the company needs every hand.'); what it brings back must come back after a set number of days (rule 470(h)).",
 I('hw03-05'): "EERIE IS SCARY: his YES on the data center that still hums settles it; the count of scary first stands.",
 I('hw03-07'): "A real place's keeper may talk nine sentences about the dead dollar; 'jefe' stands.",
 I('hw03-08'): "A sign read out by one of his men, with the scrawl under it, works.",
 I('hw03-10'): "A praying man outnumbered ('Lord, that is a lot of them') stays clean.",
 I('hw04-01'): "A kid's first kill ('Okay. Okay. That's real.') stays clean and works.",
 I('hw04-02'): "Under fire, the one who counts everybody ('Heads down, babies.') works.",
 I('hw04-03'): "Against machines, 'Somebody's driving all of those.' works.",
 I('hw04-04'): "The amount at the moment of paying ('10 batteries, like we said. Gracias.') is fine: it is not a count in a feeling.",
 I('hw04-08'): "A post that warns about a boss and how he fights works.",
 I('hw04-11'): "At the very edge, 'please' with no deal is right, and '¡Ayúdame!' stands.",
 I('hw04-12'): "A road card may describe a scene in brackets with nobody talking.",
 I('hw05-01'): "A calm old hand when a man drops ('RICO's down. Hold the line.') need not curse.",
 I('hw05-03'): "The robbed bar owner's job works: she says what she gives ('and 33 batteries'), never 'it pays'.",
 I('hw05-05'): "A greedy man may talk money over a dead friend; the fancy word ('Lucrative') goes.",
 I('hw05-06'): "Happy with no count in it ('The kitchen is open again... the whole strip eats tonight') is right.",
 I('hw05-07'): "A clerk may talk like a clerk.",
 I('hw05-10'): "A clothes joke with no brand name ('Their tailoring was a crime. Justice served.') stands.",
 I('hw02-11'): "Grief as one small fact about the dead man works. It stays as it is.",
 # sheets six to eight (11/25): his YES on OUR TRY, shown beside the game's line (rule 467 amended)
 I('hw06-01'): "WHO PAYS, SAID BY THE ONE PAYING: 'I pay out of the turbine money, up to 119 batteries' takes the place of 'it pays', the job's own deal kept, and he curses ('some motherfucker is sitting on them').",
 I('hw06-02'): "A CLEAN TRY ON PURPOSE IS RIGHT: a sergeant asking strangers for help with his men listening does not curse, and pays 'out of my own pocket'.",
 I('hw06-03'): "Grief and a threat in one breath, cursing: 'my fucking radio', 'I swear to God I follow you till one of us is dead.'",
 I('hw06-04'): "Shame said plain and cursed ('shooting water thieves, kids, fucking everybody') and the stake said out loud ('we're dead men').",
 I('hw06-05'): "THE PICTURE IN THE WORDS MUST BE RIGHT: the herd is starving and you are the dinner, not people who walked up to it. His YES stands with his fix built in.",
 I('hw06-06'): "One curse word in a bark is enough: 'Hit the fucking man, not the air!'",
 I('hw06-07'): "Plain beats the game's word: 'Grab their shit first' over 'Loot first'; the praying man curses too.",
 I('hw06-08'): "A raid said as what was lost ('with the grandmother still inside') and who did it ('those sons of bitches').",
 I('hw06-09'): "A hired man sells himself with what he did, cursing ('still can't fucking walk right').",
 I('hw06-11'): "Clean on purpose at the edge of death ('God help us.'), the way his own radio call stayed clean.",
 I('hw07-01'): "A frightened post in the person's own typing (lowercase, '??', 'i'm losing my shit') works.",
 I('hw07-02'): "A quiet memorial post stays clean and short ('who's gonna wind it now').",
 I('hw07-03'): "One word added to joy is enough: 'I fucking got him!'",
 I('hw07-04'): "Plain beats the quip: 'we got the fuck out' over 'We relocated. Loudly.'",
 I('hw07-05'): "After a wipe, the name and the revenge, cursing: 'I'm gonna find that motherfucker and every one of his boys.'",
 I('hw07-06'): "A hire line in one bitter breath: 'the fucking pension died first.'",
 I('hw07-07'): "A job giver says what she gives and out of what ('80 batteries, everything the kitchen saved'); clean on purpose.",
 I('hw07-08'): "An asker in pain curses the boss ('that son of a bitch') and keeps the trail (his flyers by the clinics); 'mijo' gone.",
 I('hw07-09'): "The last radio call before the end may curse: 'Oh shit. Oh shit.'",
 I('hw07-10'): "His man on why animals come, plain and cursing ('those hungry fuckers want it').",
 I('hw07-11'): "His 3.3 lesson held: a told line gets a mouth that sneers ('What, you want a fucking parade?'), and the town still knows.",
 I('hw08-01'): "RAIDERS CURSE, and say what they want and what it costs you ('How many of yours bleed for it is up to you.').",
 I('hw08-02'): "WHO PAYS: 'the camp pays you 95 batteries, out of what everybody chipped in.'",
 I('hw08-03'): "WHO PAYS: a grandmother pays 'of my own', and 'Nobody's that happy on stew' says why she asks.",
 I('hw08-04'): "No pay talk at all: the man she forgave says thank you like a man.",
 I('hw08-05'): "Joy with no count in it: 'Holy shit, the water's running!'",
 I('hw08-06'): "Funny with no designer: 'you look like shit and I feel sorry for you.'",
 I('hw08-07'): "A post says what the meeting is for: who, where, when, and 'till we catch the motherfucker'.",
 I('hw08-08'): "Said like a person: 'tell everybody, out loud, that this block is ours too.'",
 I('hw08-09'): "A dying woman talks like one, clean on purpose, her own words kept ('My words, not yours.').",
 I('hw08-10'): "A kid told no says what it costs him: 'My grandma's gonna keep drinking out of the fucking wash.'",
 I('hw08-12'): "Your second tells you, he does not teach you: 'your phone's been buzzing all damn day.'",
 I('hw08-13'): "A rumour with stakes: the teller lost something and saw it ('I saw the fucking tag myself').",
 I('hw08-14'): "The joke fits what he can see (chickens out back, not on a roof that is not there); the salesman stays clean.",
}
LESSON = {
 I('hw01-13'): "THE LINE AGREES WITH THE WORLD. A joke that does not fit what he can see is dead: chickens on the roof of a building that has no roof.",
 I('hw02-01'): "NO FASHION NAMES AS A JOKE. Thirty years after the end nobody quotes a designer for a laugh, and it was not funny. (A brand stays when it is a real thing somebody looted and sells, card 2.10.)",
 I('hw02-02'): "NO BATTERY COUNT IN A FEELING. Joy is not an invoice: a happy line that talks about who pays and how many is awkward and not real. (Rule 466(d): a person may say 'a car battery', the money on the screen is one number.)",
 I('hw02-05'): "NO MADE-UP COMMITTEE ENGLISH. 'Bring a flashlight and your name' is a notice nobody would say, and a meeting nobody can explain. If he has to ask what it is about, it is wrong.",
 I('hw02-06'): "SAY IT LIKE A PERSON. 'Whose ground it is' and 'guests forever' is speech English; if he has to ask what it means, it is wrong.",
 I('hw01-17'): "A RUMOUR TOLD AS A TALL TALE IS DEAD. He hates it and did not say why. (Our reading: 'A trucker swore he saw' is a campfire story with nothing at stake for the one telling it.)",
 I('hw03-11'): "NEVER 'IT DOESN'T PAY'. The job pays 85 batteries, so 'It doesn't pay' is a lie and sixth-grade English. A person says who pays what, or nothing.",
 I('hw03-12'): "NEVER 'IT PAYS'. Say who gives what ('I'll give you ten'), or say nothing about pay.",
 I('hw04-06'): "THE GAME TEACHING THROUGH A MOUTH IS HATED. 'Touch one, it lights up' is a manual, not a man. (And the straw hat on the face comes off everybody, rule 470(f), CHARACTER.)",
 I('hw04-07'): "IF HE HAS TO ASK WHAT IT MEANS, IT IS WRONG. 'His tag is still on the pipe' is a hint dressed as a goodbye; it means nothing to him.",
 I('hw04-09'): "CREEPY STILL HAS TO MAKE SENSE. A riddle ('Everything is recorded. Do you want to see what happens next?') behind a stage direction is nonsense to him.",
 I('hw04-10'): "NO ONE SPEAKS LIKE THIS. A dying woman giving orders like a clerk ('Say it back to me first so I know you have it') is written, not said.",
 I('hw05-02'): "RAIDERS CURSE. An armed crew coming over your wall swears; a clean why line from raiders is the defect.",
 I('hw05-12'): "NEVER 'IT PAYS'. 'Who's paying the person who's talking to you?' A job giver says who pays (most likely the settlement) and what, or nothing.",
 # sheets six to eight (11/25): his NO on OUR TRY. Every one curses; every one does not make plain sense.
 I('hw06-10'): "EVERY HALF OF A LINE MAKES SENSE. The first half stood (everybody wants guns, THE MACHINIST sells them); the second ('he throws nails on every street around his shop so you crawl in on your fucking knees') mixed what the nails do with a picture of crawling, and read as nonsense. Say what the nails do (you go slow), plainly.",
 I('hw06-12'): "CLEVER IS NOT CLEAR. He wrote nothing. (Our reading: 'The house always won, and look at this shit now, the house is dead' is a play on words, the casino as 'the house'; a line he has to work out is wrong.)",
 I('hw07-12'): "A LINE THAT NEEDS THE WHOLE STORY IS WRONG ON ITS OWN. He wrote nothing. (Our reading: 'every one of them goes home knowing exactly what the fuck they voted for' is irony about a vote the card never explains: one medicine, two patients, the families pick who dies. Say that.)",
 I('hw08-11'): "THE SCENE HAS TO MAKE SENSE BEFORE THE WORDS CAN. He wrote nothing, and he said no to the game's line here too (4.9). (Our reading: a TV with no back showing your crew from above, and a man offering 'the tape', still does not say who filmed you or why he shows you.)",
}
for a in ans: assert a['id'] in TEACH, 'an answer of his has no WHAT IT TEACHES yet: ' + a['id']
for a in kept: assert a['id'] in KEPT_TEACH, 'a line he kept has no WHAT IT TEACHES yet: ' + a['id']
for a in nos: assert a['id'] in LESSON, 'a NO of his has no lesson yet: ' + a['id']
def ex_block(a, n):
    s = "%d. %s (card %s)%s\n   WAS (the game today): %s\n   HIS: %s\n   WHAT IT TEACHES (our reading, his to correct):\n" % (n, NAMES.get(a['id'], a['mouth']), ref(a), '  *** HE STARRED THIS ONE ***' if a['star'] else '', q(a['ours']), q(a['his']))
    s += '\n'.join('   - ' + t for t in TEACH[a['id']])
    if a.get('note'): s += '\n   HE SAID WITH IT: ' + q(flat(a['note']))
    return s
examples = '\n\n'.join(ex_block(a, n) for n, a in enumerate(ans, 1))
kept_block = '\n'.join('- %s (card %s)\n   THE LINE (the game today, he kept it): %s\n   %s\n   WHAT IT TEACHES: %s' % (a['mouth'], ref(a), q(a['ours']), ('HE SAID: ' + q(flat(a['said']))) if a['said'].strip() else 'HE SAID: (a YES, nothing written)', KEPT_TEACH[a['id']]) for a in kept_game)
def fixline(a):   # 6.5: his note is the ruling, built and not asked again
    c = SHEETCARD.get(a['id'], {})
    return ('\n   OUR FIX, FROM HIS NOTE: ' + q(c['fixed'])) if c.get('fixed') else ''
tries_block = '\n'.join('- %s (card %s)\n   THE LINE (the game today): %s\n   OUR TRY, HE SAID YES: %s\n   %s%s\n   WHAT IT TEACHES: %s' % (a['mouth'], ref(a), q(a['ours']), q(a['tried']), ('HE SAID: ' + q(flat(a['said']))) if a['said'].strip() else 'HE SAID: (a YES, nothing written)', fixline(a), KEPT_TEACH[a['id']]) for a in kept_try)
def nofix(a):     # a NO on our try comes back fixed, as a new card on the next sheet
    to = SHEETCARD.get(a['id'], {}).get('fixed_on'); c = SHEETCARD.get(to) if to else None
    return ('\n   OUR FIX, A NEW CARD (card %d.%d): %s' % (9 if '-hw09-' in to else 0, c['n'], q(c['try']))) if c else ''
no_block = '\n\n'.join('%d. %s (card %s)\n   THE LINE (the game today): %s%s\n   HIS NO: %s%s\n   THE LESSON: %s%s' % (n, a['mouth'] + (' (SCARY, THEN ' + a['second'] + ')' if a['second'] else ''), ref(a), q(a['ours']), ('\n   OUR TRY, HE SAID NO: ' + q(a['tried'])) if a.get('tried') else '', q(flat(a['said'])), '' if a['said'].strip() else ' (a NO, nothing written)', LESSON[a['id']], nofix(a)) for n, a in enumerate(nos, 1))

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
 ('MOST PEOPLE CURSE. Fuck, shit, motherfucker, bitch, in full, never bleeped, where a real person in that spot would: a man going down, a boss, a checkpoint, raiders, a hurt man, a child about to drown. Not every line: a radio call for help, a priest, an old man asking for peace, a doc at a wound, a praying man outnumbered did not.', 'HIS: rule 467 and its 11/22 amendment, his own lines, and his YES on 28 of our 32 tries that curse (11/25)'),
 ('NEVER "IT PAYS". A person says who pays and what ("I\'ll pay you forty"), or says nothing of pay. "It doesn\'t pay" is a lie when it does.', 'HIS: rule 470(g); his NOs on 3.11, 3.12, 5.12; his YES on our who-pays tries 6.1, 7.7, 8.2, 8.3'),
 ('IF HE WOULD ASK "WHAT DOES THIS MEAN", IT IS WRONG. Creepy still has to make sense; a hint dressed as a goodbye, a riddle, a dying woman giving orders like a clerk are all dead.', 'HIS: his NOs on 4.7, 4.9, 4.10'),
 ('EVERY LINE MAKES PLAIN SENSE, WORD BY WORD, TO SOMEBODY WHO NEVER SAW THE GAME. No play on words ("the house is dead"), no irony that needs the story ("knowing exactly what they voted for"), no half that mixes what a thing does with a picture of it (nails, "crawl in on your knees"), no scene nobody explains (the tape), and the picture must be right: you ARE the dinner. Cursing never saved a line that made no sense.', 'HIS: his note on 6.5 and his NOs on 6.10, 6.12, 7.12, 8.11 (11/25), the only misses in 38 tries'),
 ('NOBODY HELPS FOR FREE, AND EVERYBODY SAYS SO. A line that asks for help names the deal: work, or batteries.', 'HIS: rule 4; his kid and his old woman'),
 ('A BODY IS AT STAKE, SAID OUT LOUD: days without food, a head cut off, a nephew on oxygen, a sister who is gonna die, a pus bomb, your body as meat.', 'OUR READING of his lines'),
 ('THE DANGER STAYS DARK, THE NEED IS PLAIN. Do not explain the beast or who gave the order.', 'OUR READING: his old woman, his enemy'),
 ('NO BATTERY COUNT IN A FEELING. A number is for what hurts (two days, then three), never for the pay in a happy line, never an exact count in a confession. The money on the screen is one number; a person may say "a car battery".', 'HIS: his NO on card 2.2, rule 466(d); his confession'),
 ('SAY IT LIKE A PERSON, NOT A NOTICE. If he would ask "what does that mean", it is wrong: no committee English, no speech English, no meeting about a flashlight.', 'HIS: his NOs on cards 2.5 and 2.6'),
 ('NO FASHION NAMES AS A JOKE thirty years after the end. A brand stays only as a real thing somebody looted and sells.', 'HIS: his NO on card 2.1, his line on card 2.10'),
 ('THE LINE AGREES WITH THE WORLD. A joke that does not fit what he sees is dead.', 'HIS: his NO on card 1.13'),
 ('PLAIN BEATS CLEVER. "Don\'t you dare" became "FUCK!"; "out of spite" became "I guess god had other plans for me"; "I walked" became "real deal killers"; "Still hears him asking for it" became "Not my proudest moment."; no fancy words ("lucrative").', 'HIS: his lines and his YES on 5.5'),
 ('A THING SAID ABOUT A PERSON BECOMES THE PERSON SAYING IT. A man\'s past on his card in his own words; a told line after a choice said by somebody, to you.', 'HIS: his lines on 3.9 and 3.3'),
 ('LENGTH FOLLOWS THE PERSON. A scared kid pours it out; a scared old woman is short of breath; a man going down says two words. Less is better.', 'OUR READING; HIS: "overkill with the amount of texts"'),
 ('END ON THE ASK, THE OFFER OR THE THREAT. No clever last line.', 'OUR READING; HIS: "Boring asf"'),
 ('PEOPLE CALL EACH OTHER WHAT THEY ARE TO THEM: bro, man, My Dear, tough guy, Darling, fuck faces. His men call him "Boss." Never a crew\'s name in a mouth.', 'HIS: his lines'),
 ('A POST IS TYPED LIKE A PHONE AND SAYS THE STAKES: short forms, cold, "SOS", gone as soon as it is read.', 'HIS: his posts; "sounding like a human tweeting"'),
 ('NO NEW SPANISH. He took it out of every line he rewrote that had it (the kid, the checkpoint, the Elder). About 15 in 100 lines at ship, some people not everybody, and never you.', 'HIS: his lines, 11/3 and 9/21'),
 ('EVERY WORD FROM A PERSON WITH A FACE, AND NOBODY SAYS LAS VEGAS.', 'HIS: 9/20 and 11/3'),
]
shortform = '\n'.join('%d. %s [%s]' % (n, s, w) for n, (s, w) in enumerate(SHORTFORM, 1))
SENSE_N = [n for n, (t, w) in enumerate(SHORTFORM, 1) if t.startswith('EVERY LINE MAKES PLAIN SENSE')][0]
CURSE_RE = re.compile(r'\b(fuck\w*|motherfuck\w*|shit\w*|bitch\w*|damn\w*|hell|asshole\w*|bastard\w*|piss\w*|pussy)\b', re.I)   # the gate's own list (V12)

# ---------- page two: THEY CURSE (rule 467, 11/21), his words checked ----------
C1 = said_in('VAMILY.md', "Are you scared to curse? I need you to curse bro real people in the apocalypse are gonna curse like what the fuck is wrong with you some of the dialog was way better than it was but it still has a long way to go for you to understand")
C2 = said_on(I('hw02-04'), "Bro, why are you scared to like curse like I'm so serious")
C3 = said_in('VAMILY.md', "People cuss in the economic apocalypse. People are going to cuss. They're gonna be scared. They're gonna say bad words and I haven't seen you type a single bad word.")
Q1 = said_on(I('hw05-12'), "you keep referring to saying it pays. What do you mean it pays? Who's paying the person who's talking to you most likely for the settlement that you're in")
Q2 = said_on(I('hw03-11'), "you can't be saying some like sixth grade bullshit English")
# ---------- part two: the counts ----------
def frow(a):
    o, h = a['fo'], a['fh']
    return "| %s%s | %d / %d | %d / %d | %s / %s | %d / %d | %d / %d | %d / %d | %d / %d | %s / %s | %d / %d | %d / %d | %s / %s |" % (
        SHORT.get(a['id'], a['mouth'] + ' (' + ref(a) + ')'), ' (STARRED)' if a['star'] else '', o['words'], h['words'], o['sents'], h['sents'], o['per'], h['per'], o['swears'], h['swears'],
        o['nums'], h['nums'], o['q'], h['q'], o['plea'], h['plea'], 'yes' if o['deal'] else 'no', 'yes' if h['deal'] else 'no', o['span'], h['span'], o['last'], h['last'], o['end'], h['end'])
facts_tbl = '\n'.join(frow(a) for a in ans)
hs = [a['fh'] for a in ans]; os_ = [a['fo'] for a in ans]
qs_his = sum(1 for x in hs if x['q']); qs_ours = sum(1 for x in os_ if x['q'])

# ---------- part three: the unknowns, each with its card ----------
s1 = sorted([r for r in WAIT if r.startswith('1.')], key=lambda r: int(r[2:])); s2 = sorted([r for r in WAIT if r.startswith('2.')], key=lambda r: int(r[2:])); s3 = sorted([r for r in WAIT if r.startswith('3.')], key=lambda r: int(r[2:])); s4 = sorted([r for r in WAIT if r.startswith('4.')], key=lambda r: int(r[2:])); s5 = sorted([r for r in WAIT if r.startswith('5.')], key=lambda r: int(r[2:]))
UNK = [
 ('SETTLED BY HIS ANSWERS, SO NOBODY ASKS AGAIN.', 'Eerie is scary (his YES on 3.5). His men call him "Boss." (1.11). A button may stay a thing you do, with a wait on what it brings back (3.4, rule 470(h)). A road card may describe a scene with nobody talking (4.12). A clerk and an office may talk like a clerk and an office (5.7, 5.9). A greedy man may talk money over the dead (5.5, without "lucrative"). The amount at the moment of paying is fine (4.4); a count in a feeling is not (2.2). MOST PEOPLE CURSE, IN FULL: his YES on 28 of our 32 tries that curse and on all 6 we left clean on purpose (sheets six to eight, 11/25). WHO PAYS, SAID BY THE ONE PAYING, works (his YES on 6.1, 7.7, 8.2, 8.3).'),
 ('SHEET NINE, IT MAKES SENSE (12 cards, 10 cursing; the only homework out).', 'His four NOs on our tries come back fixed, each a new question: THE MACHINIST\'s nails said for what they do (%s); the dealer plain, no play on words (%s); the doctor saying the families pick who dies (%s); the man with a camera on the billboard saying who filmed you and why he shows you (%s). Then the job board, where 17 of the 63 people still say "it pays", each try saying who pays and out of what: the convoy, out of the cargo (%s); the ring, out of the camp\'s money (%s); the wells, all she has (%s); the tire yard, what the parents put in the jar (%s); the lion, the old rich man himself (%s); the dog pen, the church\'s box, clean on purpose (%s); the voice on every radio at three (%s); the courier, the clinic, clean on purpose (%s).' % tuple(card('9.%d' % i) for i in range(1, 13))),
 ('ONE SENTENCE OR TWO FOR THE WHY.', 'He asked for "just one sentence" on 11/14; his own enemy and boss lines run two. Not asked; the cards will show it.'),
 ('THE APOSTROPHES.', "His typed lines drop apostrophes and capitals ('well', 'Theyre', 'your're', 'Were', 'Dont', 'Ive', 'Ill', 'whats', 'henderson', 'rico's'), keep a misspelling ('great' for grate) and one double space ('the  tax'). Kept as typed; whether the game prints speech that way is not asked."),
]
assert all(r in ' '.join(t for _, t in UNK) for r in ['card ' + x for x in s1 + s3 + s4 + s5]), 'a card still out is not tied to an unknown on the page'
unknown = '\n'.join('- %s %s' % (h, t) for h, t in UNK)
assert all('card ' + r in ' '.join(t for _, t in UNK) for r in WAIT), 'a card still out is not tied to an unknown on the page'
out_by_sheet = ', '.join('%d of sheet %d' % (sum(1 for r in WAIT if r.startswith('%d.' % k)), k) for k in sorted(set(int(r.split('.')[0]) for r in WAIT))) or 'none'
out_now = len(waiting)

voice = f'''# BOHEMIA -- THE VOICE (Paolo 11/17/26. Page one is LOCKED: VAMILY rule 455.)
# HOW EVERY MOUTH AND EVERY POST IN THE GAME TALKS: his rules in his own words, his own lines as the examples, and beside each of
# his lines what it teaches, in plain words. He called page one '{BED}'.
# BUILT FROM EVERYTHING HE HAS GIVEN SO FAR: rule 455 (scary first; row 637), rule 467 (THEY CURSE), his {len(answered)} homework answers
# ({len(ans)} lines of his own, {len(kept_game)} kept as they were, {len(kept_try)} of our tries he said YES to, {len(nos)} NO; rules 458(a), 466(f), 467; rows 643, 734), the complaint that started it
# (row 628), and {other_n} other things he has said about how people talk, each checked word for word against where he said it.
# It gains a rule only when he gives one. HE IS NOT DONE (rule 465): more sheets of his are coming; nothing goes into the game until he says so.
# FOUR PARTS, IN THIS ORDER: (1) HIS WORDS; (2) WHAT CAN BE MEASURED; (3) WHAT IS STILL UNKNOWN; (4) THE GAME TODAY. Only his words
# are law. Anything marked OUR READING is this lane's, and his to correct.
# NOTHING IN THE GAME IS REWRITTEN TO IT YET (rule 454(a)). The gate that will hold the game to it is built and asleep
# (gates/the_voice_holds_gate.py): no mouth is open to a rewrite until he says go, mouth by mouth.
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

## PAGE TWO. THEY CURSE. (rule 467, 11/21)

HIS WORDS (the first is the coordinator's copy in VAMILY.md: use it for WHAT he wants; the second is his own note, typed in the VOTE tab):
- 11/21, to the coordinator
  >> "{C1}"
     FROM: VAMILY.md
     TEACHES: In hell people swear: fuck, shit, motherfucker, bitch, in full, never bleeped, where a real person in that spot would. A line a real person would say with a curse, and ours says clean, is the defect.
- 11/21, typed in the VOTE tab, on card 2.4, with his own line under it
  >> "{C2}"
     FROM: records/target/BOHEMIA_VOTE_REGISTRY.json (his note on the card {I('hw02-04')})
     TEACHES: It is not for show and it is not every line. In his own lines the man going down, the boss, the checkpoint, the bookie, the angry man and the hit all curse; his radio call, his Elder, his doc and his old woman do not.
- 11/22, to the coordinator (rule 467 amended)
  >> "{C3}"
     FROM: VAMILY.md
     TEACHES: MOST PEOPLE CURSE. Every homework card now shows OUR TRY beside the game's line, and at least two tries in three curse in full; the ones who would not (a child praying, a priest at a grave) are left clean on purpose and say why.

## PAGE THREE. NEVER 'IT PAYS'. (rule 470(g), 11/22)

HIS WORDS (his own notes, typed in the VOTE tab):
- 11/22, on card 5.12, the professor's job
  >> "{Q1}"
     FROM: records/target/BOHEMIA_VOTE_REGISTRY.json (his note on the card {I('hw05-12')})
     TEACHES: Nobody says a job 'pays'. A person says who pays and what ('I'll pay you forty out of the turbine money') or says nothing of pay.
- 11/22, on card 3.11, the thank-you for help nobody paid for
  >> "{Q2}"
     FROM: records/target/BOHEMIA_VOTE_REGISTRY.json (his note on the card {I('hw03-11')})
     TEACHES: 'It pays' and 'it doesn't pay' are sixth-grade English, and 'it doesn't pay' was a lie (the job paid 85).

### HIS OWN LINES, EACH BESIDE WHAT IT TEACHES ({len(ans)} lines; exactly as he gave them in the VOTE tab, rules 458(a), 466(f))

{examples}

A STAR MAKES ITS WAY THE WAY (rule 115(h)): {sum(1 for a in ans if a['star'])} of his lines carry his star. HIS TEXT IS KEPT AS HE TYPED IT: words with no apostrophe or
capital ('well', 'Theyre', 'your're', 'Were', 'Dont', 'Ive', 'henderson', 'rico's') and a double space ('the  tax') are not corrected here
and will not be until he says.

### KEPT AS THEY ARE (his YES on our line)

{kept_block}

### OUR TRIES HE SAID YES TO (sheets six to eight, 11/25: each card showed the game's line and OUR TRY beside it, rule 467 amended)

{len(kept_try)} of our {len(kept_try) + sum(1 for a in nos if a.get('tried'))} tries got his YES: {sum(1 for a in kept_try if CURSE_RE.search(a['tried']))} of the {sum(1 for a in kept_try + nos if a.get('tried') and CURSE_RE.search(a['tried']))} that curse, and all {sum(1 for a in kept_try if not CURSE_RE.search(a['tried']))} clean ones. Every
NO and his one note were lines that did not make plain sense (THE VOICE SO FAR, line {SENSE_N}). Each try below is the line a rewrite would
start from, the day he says he is done (rule 465).

{tries_block}

### WHAT THE VOICE IS NOT (his NO, rule 466(f); his words exactly, and the plain lesson)

{no_block}

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

IN ONE BREATH: his {len(ans)} lines hold {sum(x['swears'] for x in hs)} swears to our {sum(x['swears'] for x in os_)} ({sum(1 for x in hs if x['swears'])} of his lines curse, none of ours), {qs_his} lines with a question
mark to our {qs_ours}, and {sum(x['span'] for x in hs)} Spanish words to our {sum(x['span'] for x in os_)}; his run {sum(x['words'] for x in hs)} words to our {sum(x['words'] for x in os_)}.

## PART THREE: WHAT IS STILL UNKNOWN

EACH WAITS ON HIS ANSWER, and the card that asks it is in the VOTE tab. {out_now} cards are out ({out_by_sheet}); he has answered {len(answered)},
every card of the sheets before. Each card of sheet six on shows OUR TRY beside the line the game says now (rule 467 amended).
HE IS NOT DONE (rule 465): he is still typing his lines into the cards; nothing he writes there goes into the game, and no line is
rewritten from it, until he says he is done. Each sheet he uploads is folded onto part one here, line by line, the same way as his four.
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
- DESPERATE IS ONE LINE IN TEN. His kid, his old woman, his town falling, his confession and his insulin post are somebody afraid or in need, saying so. Outside the town falling, {noD} of {noRead}
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
print('THE VOICE written: %d answers of his (%d lines, %d kept, %d tries of ours he said YES to, %d NO), %d other lines of his, %d cards out (%s), %d mouths counted' % (len(answered), len(ans), len(kept_game), len(kept_try), len(nos), other_n, out_now, out_by_sheet, len(order)))
