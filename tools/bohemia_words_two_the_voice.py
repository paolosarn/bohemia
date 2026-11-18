# WORDS TWO 11/18: writes THE VOICE (laws/BOHEMIA_LAW_THE_VOICE_11_17_26.md) in its parts: HIS WORDS first, WHAT CAN BE MEASURED
# second, WHAT IS STILL UNKNOWN third, and THE GAME TODAY AGAINST PAGE ONE (the count a mouth) last; the second hand reading
# (records/words_two/scary_first_second_reading.json, from scary_first_to_read.json and scary_first_marks.py); and the record
# records/BOHEMIA_WORDS_TWO_THE_SECOND_READING_AND_THE_VOICE_IN_THREE_PARTS_11_18_26.md. VAMILY rules 455, 454(d), 458(a).
# HIS WORDS ARE NEVER TYPED HERE AS TRUTH: every quote of his is checked word for word against his record, and his lines come out
# of the VOTE registry's verdicts. HIS TEXT IS NEVER CORRECTED, not even a missing apostrophe. Every game line is read from the
# game's files. The counting and the reading are this lane's. Run from the repo root. It rewrites nothing in the game.
import json,re,os
def J(p): return json.load(open(p,encoding='utf-8'))
norm=lambda s: re.sub(r'\s+',' ',s).strip()
REC='records/BOHEMIA_PAOLO_SCARY_FIRST_THE_GRINDER_AND_THE_CAR_CAMPS_11_17_26.md'
rec=norm(open(REC,encoding='utf-8').read())
def his(q):
    assert norm(q) in rec, 'NOT HIS WORDS AS RECORDED: '+q[:70]
    return q
reg=J('records/target/BOHEMIA_VOTE_REGISTRY.json'); items={i['id']:i for i in reg['items']}; verd={v['id']:v for v in reg['verdicts']}
ans=[]
for i in reg['items']:
    if i.get('lane')=='words two' and i['id'] in verd and verd[i['id']].get('said'):
        v=verd[i['id']]; ans.append(dict(id=i['id'],n=i['homework']['n'],sheet=i['homework']['sheet'],mouth=i['homework']['mouth'],second=i['homework'].get('second'),ours=i['homework']['line'],his=v['said'],star=bool(v.get('star'))))
ans.sort(key=lambda a:(a['sheet'],a['n']))
waiting=[i for i in reg['items'] if i.get('lane')=='words two' and i['id'] not in verd]
W=re.compile(r"[A-Za-zÀ-ÿ0-9']+")
SW=re.compile(r"\b(fuck\w*|shit\w*|damn\w*|hell|ass|asshole|bitch\w*|bastard\w*|crap|piss\w*|bullshit|goddamn|idgaf|wtf|mfs?)\b",re.I)
SPAN=re.compile(r"\b(mijo|mija|jefe|carnal|pues|órale|mira|bueno|ni modo|gracias|oye|compa|hijo|bienvenido|todo)\b",re.I)
DEAL=re.compile(r"\b(batter(y|ies)|cells?|pay\w*|paid|owe[sd]?|tax\w*|toll|price\w*|trade\w*|for free)\b",re.I)
PLEA=re.compile(r"\b(please|help)\b",re.I)
NUM=re.compile(r"\b(\d+|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|twenty|thirty|forty|fifty|hundred)\b",re.I)
def sents(t): return [s for s in re.split(r"(?<=[.!?])\s+",t.strip()) if s.strip()]
def facts(t):
    s=sents(t); return dict(words=len(W.findall(t)),sents=len(s),per=round(len(W.findall(t))/len(s),1),swears=len(SW.findall(t)),nums=len(NUM.findall(t)),q=t.count('?'),plea=len(PLEA.findall(t)),deal=bool(DEAL.search(t)),span=len(SPAN.findall(t)),last=len(W.findall(s[-1])),end=(t.rstrip()[-1:] if t.rstrip()[-1:] in '.!?' else 'nothing'))
for a in ans: a['fo']=facts(a['ours']); a['fh']=facts(a['his'])
# ---------- the second hand reading ----------
D=J('records/words_two/scary_first_to_read.json')['mouths']; ns={}; exec(open('records/words_two/scary_first_marks.py',encoding='utf-8').read(),ns); MK=ns['MARKS']
KIND={'D':'desperate','T':'a threat','E':'eerie','C':'cold','N':None}
mouths=[]
for m in D:
    k=MK[m['mouth']]; assert len(k)==len(m['lines']) and set(k)<=set('NDTEC'), m['mouth']
    mouths.append(dict(mouth=m['mouth'],how=m['how'],of=m['of'],read=len(k),scary_first=sum(c!='N' for c in k),desperate=k.count('D'),threat=k.count('T'),eerie=k.count('E'),cold=k.count('C'),
                       lines=[dict(line=l,scary_first=(c!='N'),kind=KIND[c]) for l,c in zip(m['lines'],k)]))
T=dict(read=sum(m['read'] for m in mouths),scary=sum(m['scary_first'] for m in mouths),D=sum(m['desperate'] for m in mouths),Th=sum(m['threat'] for m in mouths),E=sum(m['eerie'] for m in mouths),C=sum(m['cold'] for m in mouths))
FALL=[m for m in mouths if m['mouth']=='feed: a town falling'][0]
est=sum(m['of']*m['scary_first']/m['read'] for m in mouths); allu=sum(m['of'] for m in mouths)
json.dump({'draft':True,'tool':'tools/bohemia_words_two_the_voice.py','law':'VAMILY rule 455 (Paolo 11/17): every voice is two words and the first is always scary',
  'the_question':'read cold, with nothing else: is the first thing felt that this person is in hell? and which kind: desperate (afraid or in need for himself or his own), a threat (dangerous to you, or a danger coming for you), eerie (something is wrong and nobody knows what), cold (cruelty or not caring, said flat)',
  'how':'a mouth of 170 lines or fewer read whole; a bigger one as 36 lines drawn by a fixed seed (its first twelve are the first reading\'s twelve). One reader, WORDS TWO; the marks are records/words_two/scary_first_marks.py and are his to overturn.',
  'read':T['read'],'scary_first':T['scary'],'kinds':{'desperate':T['D'],'a threat':T['Th'],'eerie':T['E'],'cold':T['C']},'mouths':mouths},
  open('records/words_two/scary_first_second_reading.json','w',encoding='utf-8'),indent=1,ensure_ascii=False)
order=['feed: a town falling','fight: the why line','road: what the stranger says','road: side quest talk','town: job givers at the board','fight: the survivor after','fight: his men mid-fight','feed: the valley','road: the answer after his choice','town: keepers, the Elder, the bar','hires: rare men and the retinue','feed: far away','bosses: the asker and after']
MM={m['mouth']:m for m in mouths}
def row(k):
    m=MM[k]; return "| %s | %s | %d of %d | %d%% | %d | %d | %d | %d |"%(k,'all %d'%m['read'] if m['how']=='whole' else '%d of %d'%(m['read'],m['of']),m['scary_first'],m['read'],round(100*m['scary_first']/m['read']),m['desperate'],m['threat'],m['eerie'],m['cold'])
count_tbl='\n'.join(row(k) for k in order)
def ex(k,kind,i=0):
    c=[r['line'] for r in MM[k]['lines'] if r['kind']==kind]; return '"'+c[min(i,len(c)-1)].replace('\n',' / ')+'"' if c else None
# ---------- his law, checked ----------
P1=his("It is hell. People actually feel like they're in hell. They're in hell first, before they're in a barely surviving, one percent civilization experience. Whatever you do in this game, when you evoke a feeling out of the gamer, it is people reacting to how scary and real hell is. The emotions: it will be scary and then it can be scary happy, scary funny, scary serious. There still could be humor, but it has to be scary and then funny. I want everyone's voice to be: they can be scary confident, scary trying to be a leader, scary political. There's two words, but the first word is always scary, and whatever emotion you're trying to get out of people, the second one follows that.")
P2=his("I really do believe people will talk to each other more desperately. It'll be this kind of thing: damn bro, you're really not gonna help starving people out because of the kindness of your heart, another piece of shit, he's gonna do it for batteries, so I got some batteries for you.")
P3=his("The vibe I'm creating, from social media to people actually talking to you.")
R1=his("They're in hell first, before they're in a barely surviving, one percent civilization experience."); R1b=his("it is people reacting to how scary and real hell is")
R2=his("There's two words, but the first word is always scary, and whatever emotion you're trying to get out of people, the second one follows that.")
R3=his("There still could be humor, but it has to be scary and then funny.")
R4=his("damn bro, you're really not gonna help starving people out because of the kindness of your heart, another piece of shit, he's gonna do it for batteries, so I got some batteries for you."); R4b=his("people will talk to each other more desperately")
R5=his("from social media to people actually talking to you")
G1=his("We have to make mystery sausage out of this, because if not, we don't know what our next meal is."); G2=his("Only the sick people will joke about it.")
BED=his("the bedrock, super important to even implementing my soul in this")
q=lambda s:'"'+s+'"'
NAMES={'words-two-hw01-01-a-kid-begs-on-the-road-11-17':'THE KID WHO BEGS (a road stop)','words-two-hw01-02-the-enemy-says-why-11-17':"THE ENEMY'S WHY (their leader, as a fight opens)",
       'words-two-hw01-03-a-joke-post-in-the-feed-11-17':"THE FEED'S JOKE POST (a regular person in the valley)",'words-two-hw01-04-an-old-woman-offers-a-job-11-17':"THE OLD WOMAN'S JOB (a job giver at the board)"}
SHORT={'words-two-hw01-01-a-kid-begs-on-the-road-11-17':'THE KID WHO BEGS','words-two-hw01-02-the-enemy-says-why-11-17':"THE ENEMY'S WHY",'words-two-hw01-03-a-joke-post-in-the-feed-11-17':"THE FEED'S JOKE POST",'words-two-hw01-04-an-old-woman-offers-a-job-11-17':"THE OLD WOMAN'S JOB"}
def label(a): return NAMES.get(a['id']) or (a['mouth']+(' (SCARY, THEN '+a['second']+')' if a['second'] else '')+', card '+str(a['sheet'])+'.'+str(a['n']))
examples='\n'.join("%d. %s%s\n   WAS (the game today): %s\n   HIS: %s"%(k,label(a),'  *** HE STARRED THIS ONE ***' if a['star'] else '',q(a['ours']),q(a['his'])) for k,a in enumerate(ans,1))
def frow(a):
    o,h=a['fo'],a['fh']; return "| %s%s | %d / %d | %d / %d | %s / %s | %d / %d | %d / %d | %d / %d | %d / %d | %s / %s | %d / %d | %d / %d | %s / %s |"%(SHORT.get(a['id'],a['mouth']),' (STARRED)' if a['star'] else '',o['words'],h['words'],o['sents'],h['sents'],o['per'],h['per'],o['swears'],h['swears'],o['nums'],h['nums'],o['q'],h['q'],o['plea'],h['plea'],'yes' if o['deal'] else 'no','yes' if h['deal'] else 'no',o['span'],h['span'],o['last'],h['last'],o['end'],h['end'])
facts_tbl='\n'.join(frow(a) for a in ans)
A={a['id']:a for a in ans}
K=A['words-two-hw01-01-a-kid-begs-on-the-road-11-17']; EN=A['words-two-hw01-02-the-enemy-says-why-11-17']; PO=A['words-two-hw01-03-a-joke-post-in-the-feed-11-17']; OW=A['words-two-hw01-04-an-old-woman-offers-a-job-11-17']
hs=[a['fh'] for a in ans]; os_=[a['fo'] for a in ans]
# the cards still out, by what they ask
s1=[i for i in waiting if i['homework']['sheet']==1]; s2=[i for i in waiting if i['homework']['sheet']==2]
def cards(sub): return ', '.join("%d.%d"%(i['homework']['sheet'],i['homework']['n']) for i in sorted(sub,key=lambda i:(i['homework']['sheet'],i['homework']['n'])))
pairs=', '.join("scary %s (card 2.%d)"%(i['homework']['second'].lower(),i['homework']['n']) for i in sorted(s2,key=lambda i:i['homework']['n']))
noD=T['D']-FALL['desperate']; noRead=T['read']-FALL['read']
voice=f'''# BOHEMIA -- THE VOICE (Paolo 11/17/26. Page one is LOCKED: VAMILY rule 455.)
# HOW EVERY MOUTH AND EVERY POST IN THE GAME TALKS. One page of rules in HIS words, with HIS own lines as the examples.
# He called page one '{BED}'.
# THE PAGE HAS FOUR PARTS, IN THIS ORDER: (1) HIS WORDS; (2) WHAT CAN BE MEASURED in them, which is this lane's counting; (3) WHAT IS
# STILL UNKNOWN; (4) THE GAME TODAY AGAINST PAGE ONE. Only part one is law. Parts two to four change as he answers.
# IT IS BUILT FROM HIS ANSWERS (rule 454(d)): {len(ans)} so far. It gains a rule only when he gives one. Where a sentence is this lane's
# reading it says so, and it is his to correct.
# NOTHING IN THE GAME IS REWRITTEN TO IT YET (rule 454(a)). That starts mouth by mouth, on his word.
# Written by tools/bohemia_words_two_the_voice.py, which stops if any quote here is not in his record or the VOTE registry word for
# word. Gate: gates/the_voice_is_his_words_gate.js. His record: {REC}

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
   (This lane's reading, his to correct: the one who needs help knows the helper wants batteries, says so, and offers them.
   Kindness is not a reason anybody gives.)
5. IT HOLDS FOR EVERY MOUTH AND EVERY POST: '{R5}'.

THE TEST OF A LINE (rule 455(e)): A LINE THAT IS NOT SCARY FIRST IS THE DEFECT, WHATEVER ELSE IT DOES WELL.

THE HORROR UNDER IT (rule 456, the grinder; it is in his own enemy line below): '{G1}' '{G2}'
(This lane's reading: a mouth may say it flat, as duty; a joke about it belongs only to somebody the game means to be sick.)

### HIS OWN LINES (the examples of THE VOICE; exactly as he gave them in the VOTE tab, rule 458(a))

{examples}

A STAR MAKES ITS WAY THE WAY (rule 115(h)). The old woman's line is the first starred line of THE VOICE.
HIS TEXT IS KEPT AS HE TYPED IT. Two spoken lines have a word with no apostrophe ('well' for we'll in the enemy's line, 'Theyre' in
the old woman's). They are not corrected here and will not be until he says. Whether the game prints speech that way is OPEN.

## PART TWO: WHAT CAN BE MEASURED IN HIS LINES

Everything in this part is this lane's counting, ours beside his, the same count on both. THE COUNTS ARE COUNTS. What each one
POINTS TO is a reading, his to correct, and it is one line's worth until more of his sheet lands.

Ours / his.

| Line | Words | Sentences | Words a sentence | Swears | Numbers | Questions | 'please' or 'help' | A word of the deal (batteries, pay, tax) | Spanish words | Words in the last sentence | It ends on |
|---|---|---|---|---|---|---|---|---|---|---|---|
{facts_tbl}

(The kid's 'yes / no' on the deal: OUR kid says the word only to refuse it, 'I don't want batteries'. HIS kid says no such word and
offers work. A count of words reads that backwards, so read the line.)

WHAT A COUNT CANNOT SHOW, LINE BY LINE (read off the two lines; nothing added):
- THE KID. WHO IS NAMED: ours says 'jefe' and quotes 'my brother' as the one with advice; his says 'bro', 'man', 'you guys', and the
  brother is hungry too. EXPLAINED: ours explains why he came to THEM ('ask the ones with guns, they got food') and what he does not
  want (batteries); his explains nothing but how long, who, and what he can do. OFFERED: ours nothing; his, work ('I know how to shine
  and clean some of your equipment I see'). IT ENDS: ours on the brother's saying; his on the offer, and on 'I see': he is looking at
  their gear while he talks.
- THE ENEMY. WHO IS NAMED: ours names itself ('The House') and the road; his names nobody: 'We', an order from somebody not named
  ('We were told'), and the crew in front of him as 'a rag tag bunch of fuck faces'. EXPLAINED: ours explains a rule (the road is
  theirs, you did not pay); his explains the errand (look out for the ones who did not pay their battery tax) and LEAVES DARK who gave
  the order. OFFERED: nothing in either; his is a sentence already passed ('After we clean your body'). IT ENDS: ours on what you
  failed to do; his on what happens to your body. He talks ABOUT them first ('who didn't want to pay their battery tax') and TO them
  second ('your body').
- THE POST. WHO IS NAMED: ours 'they'; his 'ur momma'. KEPT: the thing (two jugs of water under the bed). CHANGED: who the poster is.
  THE SPELLING: ours opens lower case, keeps a capital I, an apostrophe and a full stop; his is 'IDGAF', 'ur', 'momma dying' with no
  'is', a small 'i', no apostrophe and no full stop.
- THE OLD WOMAN. WHO IS NAMED: ours names nothing ('Seven of them', 'We', 'everybody'); his opens 'My Dear', and the thing is 'dark
  shadows'. EXPLAINED: ours gives the count, the size, when they come, the exact pay and that everybody refuses; his gives none of
  that: what they take (our water), what comes next (us), and NOTHING about what they are. OFFERED: ours a number with an apology
  ('only 199 batteries'); his 'some batteries', as a question about HIM. IT ENDS: ours on a closing thought ('everybody says no');
  his on the question.

WHAT EACH DIFFERENCE POINTS TO (this lane's reading; each is a rule only when he says so):
M1. A BODY IS IN THE LINE. All {len(ans)} of his have somebody's body at stake, said out loud (not eaten in days; your body turned to mystery
    meat; a mother dying; they are going to kill us next). One of ours did. POINTS TO: scary first means a body, named.
M2. THE SWEAR. Ours {sum(o['swears'] for o in os_)}, his {sum(h['swears'] for h in hs)}: {K['fh']['swears']} in the kid's line, {EN['fh']['swears']} in the enemy's, an acronym in the post, {OW['fh']['swears']} in the old woman's. It lands on the time gone hungry
    ('two fucking days') and on the insult ('fuck faces'). POINTS TO: the young and the armed swear; an old woman begging does not.
M3. HOW LONG A SENTENCE RUNS. His kid {K['fh']['per']} words a sentence (ours {K['fo']['per']}); his enemy {EN['fh']['per']} (ours {EN['fo']['per']}); his old woman {OW['fh']['per']} (ours {OW['fo']['per']}). Ours had the
    scared kid clipped and the old woman long and balanced; his are the other way round. POINTS TO: no house length; fear and age set it.
M4. THE NUMBERS. The hungry count days, and the count climbs (two, then three). The afraid do not count the enemy (ours 'Seven of
    them, big as ponies'; hers 'dark shadows'). The poor do not name a price (ours '199'; hers 'some'). Ours {sum(o['nums'] for o in os_)} numbers, his {sum(h['nums'] for h in hs)}.
    POINTS TO: a number is for what hurts, never for the enemy or the pay.
M5. WHO GETS NAMED. Nobody of his says a faction's name or a title. People are called what they are to the speaker: 'bro', 'man',
    'My Dear', 'fuck faces', 'ur momma'. Ours said 'jefe' and 'The House'. POINTS TO: names of crews belong on signs, not in mouths.
M6. WHAT IS LEFT DARK. The danger is not explained (who gave the order; what the shadows are). The need and the errand are plain.
    Ours explained the danger and the rules. POINTS TO: say what you need, not what it is.
M7. THE DEAL. Three of his four carry it: work offered, a tax owed, batteries asked as a question. Nobody asks for free, and the price
    is never a number. POINTS TO: rule 4 of page one, in every mouth that wants something.
M8. THE END. His end on the offer ({K['fh']['last']} words), on the body ({EN['fh']['last']}), on the question ({OW['fh']['last']}); two of four hold a question mark, none of ours did.
    Ours ended on a closing thought twice. POINTS TO: stop on the ask, never on a thought about it.
M9. THE ORDER OF A THREAT. His enemy goes: the order he was given, the insult, what is owed, what happens to your body. Ours was one
    claim in one sentence. POINTS TO: a why line is an errand, not an opinion (EYES' row 631 found ours said the road's words for
    every fight).
M10. A POST IS TYPED, AND COLD. Text-speak, no full stop, and the joke is that the poster does not care. POINTS TO: scary, then funny;
    and the feed is typed the way a phone types.
M11. THE SPANISH. Ours {sum(o['span'] for o in os_)} Spanish words in the four, his {sum(h['span'] for h in hs)}: 'Oye, jefe' became 'Hey bro', and he added none anywhere. His standing rule is
    unchanged (about 15% of human talk at ship, no new Spanglish line, the player never). POINTS TO: asked mouth by mouth, below.

## PART THREE: WHAT IS STILL UNKNOWN

EACH WAITS ON HIS ANSWER, and the card that asks it is in the VOTE tab. {len(waiting)} cards are out: {len(s1)} of sheet one ({cards(s1)}) and {len(s2)} of sheet two.
- HOW EACH PAIR SOUNDS. His law names the pairs; four answers show scary begging (the kid), scary threatening (the enemy), scary
  funny on the feed (the post) and scary asking (the old woman). Still to hear: {pairs}.
  Six of those second words are his (funny, happy, serious, confident, trying to be a leader, political); kind, proud, begging,
  selling, sad and angry are guesses the cards are there to test.
- THE BOSS: does the top dog talk more, less, or not at all (card 1.12). Today a boss has no printed line of his own.
- A HIRE: does a man pitch himself (card 1.9), and how does a cook brag (1.19).
- HIS OWN MEN, TO HIM: 'Boss'? his name? (cards 1.5, 1.8, 1.11, 1.15; 2.3, 2.11, 2.12). No answer of his is from his own crew yet.
- THE SWEAR, MOUTH BY MOUTH: a kid and an armed man swear and an old woman does not. A priest, a shopkeeper, a doc, a boss: not known.
- THE SPANISH: he took it out of the kid. A cartel man (1.6) and the Elder (1.7) still open with it on their cards.
- AGE: one kid, one old woman. Nobody in between has been answered.
- THE LINES WITH NO MOUTH: what comes back after a road choice is told, not said (231 lines). Who says them is not asked yet.
- THE FEED FAR AWAY (1.18) and A TOWN FALLING (1.10): he has answered one post, a joke.
- IS EERIE SCARY? Part four counts a line as scary first when it is desperate, a threat, eerie or cold. His four lines are desperate,
  a threat and cold; none is eerie. If eerie is not what he means by scary, part four's numbers fall (see the kinds).
- THE APOSTROPHES in a spoken line ('well', 'Theyre'): kept as typed, not asked.

## PART FOUR: THE GAME TODAY AGAINST PAGE ONE

HOW MANY LINES OF EACH MOUTH ARE SCARY FIRST TODAY. Read by hand, one reader (this lane), one question: read cold, is the first thing
felt that this person is in hell? A mouth of 170 lines or fewer was read WHOLE; a bigger one as 36 lines by a fixed draw. Every line
and its mark: records/words_two/scary_first_second_reading.json. The marks are his to overturn.

| Mouth | Read | Scary first | Share | Desperate | A threat | Eerie | Cold |
|---|---|---|---|---|---|---|---|
{count_tbl}
| ALL THAT WAS READ | {T['read']} | {T['scary']} of {T['read']} | {round(100*T['scary']/T['read'])}% | {T['D']} | {T['Th']} | {T['E']} | {T['C']} |

- ABOUT A THIRD. {T['scary']} of {T['read']} lines read are scary first; outside the one mouth written to his own brief (a town falling), {T['scary']-FALL['scary_first']} of {noRead}
  ({round(100*(T['scary']-FALL['scary_first'])/noRead)}%). Carried to all {allu:,} different lines by each mouth's own share: about {round(est):,} ({round(100*est/allu)}%).
- DESPERATE IS ONE LINE IN TEN. Two of his four lines are somebody afraid or in need, saying so (the kid, the old woman). Outside the
  town falling, {noD} of {noRead} of ours are ({round(100*noD/noRead)}%). Most of our scary is a threat ({T['Th']-FALL['threat']}, {MM['fight: the why line']['threat']} of them the why line) or eerie ({T['E']-FALL['eerie']}).
- THE MOUTHS FURTHEST FROM PAGE ONE: the askers who send him after a boss ({MM['bosses: the asker and after']['scary_first']} of {MM['bosses: the asker and after']['read']}), the far feed ({MM['feed: far away']['scary_first']} of {MM['feed: far away']['read']}, and {MM['feed: far away']['eerie']} of those eerie),
  the hires ({MM['hires: rare men and the retinue']['scary_first']} of {MM['hires: rare men and the retinue']['read']}, none desperate), the keepers ({MM['town: keepers, the Elder, the bar']['scary_first']} of {MM['town: keepers, the Elder, the bar']['read']}).

## WHAT THIS PAGE DOES TO THE OLDER PAGES

- laws/BOHEMIA_VOICE_CARD_8_26_26.md (the WORDS lane's seven rules, 8/26) stands where it does not disagree; where it does, this page
  wins (newest date). Its 'NOBODY IN BOHEMIA IS WISE', 'contract it' and 'cut the last sentence' agree with his lines above. It is
  folded into this page, and archived, when THE VOICE is whole.
- laws/BOHEMIA_LAW_ANALOG_HORROR_FOR_EVERY_PIXEL_AND_EVERY_SOUND_9_20_26.md was the pixels and the sound; rule 455 says this is the
  same law for the mouth.
- Unchanged: the player never speaks Spanglish; text comes from a mouth with a portrait; every line is a draft:true attempt until he
  says otherwise.
'''
assert '—' not in voice
open('laws/BOHEMIA_LAW_THE_VOICE_11_17_26.md','w',encoding='utf-8').write(voice)
old1=J('records/words_two/scary_first_hand_reading.json'); O1={m['mouth']:m for m in old1['mouths']}
cmp_tbl='\n'.join("| %s | %d of %d | %d of %d | %s |"%(k,O1[k]['scary_first'],O1[k]['read'],MM[k]['scary_first'],MM[k]['read'],'read whole' if MM[k]['how']=='whole' else '36 drawn') for k in order)
def exs(k):
    out=[]
    for kind in ('desperate','a threat','eerie','cold'):
        e=ex(k,kind)
        if e: out.append(kind.upper()+': '+e)
    n=ex(k,None)
    return '- '+k.upper()+'. '+'  '.join(out[:3])+('  NOT SCARY FIRST: '+n if n else '')
ex_block='\n'.join(exs(k) for k in order)
recmd=f'''# WORDS TWO: THE SECOND READING OF EVERY MOUTH AGAINST SCARY FIRST, AND THE VOICE IN ITS PARTS (11/18/26)

VAMILY rules 455, 454(a)(d), 458(a); ask rows 637, 643, 628. draft:true. NOTHING IN THE GAME WAS REWRITTEN. No new sheet of his has
reached the coordinator since his first four answers; this round is what four answers and rule 455 can carry.

## 0. THE ANSWER FIRST

1. THE VOICE IS IN ITS PARTS: laws/BOHEMIA_LAW_THE_VOICE_11_17_26.md. HIS WORDS first (the law in his own sentences, his four lines
   exactly, his missing apostrophes left alone and marked open). WHAT CAN BE MEASURED second: ours beside his on eleven counts, then
   who is named, what is explained and what is left dark, what is offered, how it ends, how a post is spelled, and eleven things the
   differences point to (M1 to M11), each marked as a reading. WHAT IS STILL UNKNOWN third, each with the card that asks it. THE GAME
   TODAY last.
2. THE COUNT A MOUTH IS A REAL COUNT NOW. The first reading was twelve lines a mouth (156). This one is {T['read']}: eight mouths read
   WHOLE and five by 36 drawn lines. {T['scary']} are scary first ({round(100*T['scary']/T['read'])}%); outside a town falling, {T['scary']-FALL['scary_first']} of {noRead} ({round(100*(T['scary']-FALL['scary_first'])/noRead)}%).
3. THE TWELVE-LINE READING WAS RIGHT ABOUT THE WHOLE AND WRONG ABOUT TWO MOUTHS. It said the job givers were 2 of 12 and the boss
   askers 0 of 12. Read whole they are {MM['town: job givers at the board']['scary_first']} of {MM['town: job givers at the board']['read']} and {MM['bosses: the asker and after']['scary_first']} of {MM['bosses: the asker and after']['read']}. Both readings gave the same mark to all 156 lines read twice; the
   twelve were an unlucky draw. The order of the mouths below replaces the one filed on 11/17.
4. THE NEW THING THE COUNT SHOWS: WHICH KIND OF SCARY. His own lines are DESPERATE (the kid, the old woman), a THREAT (the enemy) and
   COLD (the post). Outside a town falling, {noD} of {noRead} of our lines are desperate ({round(100*noD/noRead)}%): one in ten. Our scary is mostly a
   threat ({T['Th']-FALL['threat']}) or eerie ({T['E']-FALL['eerie']}). So the gap is not 'more horror'. It is people begging, afraid and saying so.

## 1. THE COUNT

One question: read cold, with nothing else, is the first thing felt that this person is in hell? And the kind: DESPERATE (afraid or
in need for himself or his own: a plea, hunger, panic), A THREAT (dangerous to you, or a danger coming for you), EERIE (something is
wrong and nobody knows what), COLD (cruelty or not caring, said flat). The draw is records/words_two/scary_first_to_read.json, the
marks records/words_two/scary_first_marks.py, every line with its mark records/words_two/scary_first_second_reading.json.

| Mouth | Read | Scary first | Share | Desperate | A threat | Eerie | Cold |
|---|---|---|---|---|---|---|---|
{count_tbl}
| ALL THAT WAS READ | {T['read']} | {T['scary']} of {T['read']} | {round(100*T['scary']/T['read'])}% | {T['D']} | {T['Th']} | {T['E']} | {T['C']} |

THE FIRST READING BESIDE THE SECOND:

| Mouth | First reading (12 lines) | Second reading | How |
|---|---|---|---|
{cmp_tbl}

WHAT IT SAYS, MOUTH BY MOUTH:
- THE WHY LINE is scary more than half the time and almost always the same way: a threat ({MM['fight: the why line']['threat']} of {MM['fight: the why line']['scary_first']}). His enemy is a threat too,
  but his has an order behind it, an insult in it and the grinder at the end.
- THE ROAD'S STRANGERS are the closest mouth of people ({MM['road: what the stranger says']['scary_first']} of {MM['road: what the stranger says']['read']}), and {MM['road: what the stranger says']['desperate']} of those are desperate: this is the mouth to rewrite last,
  or to learn from.
- THE JOB GIVERS are a third ({MM['town: job givers at the board']['scary_first']} of {MM['town: job givers at the board']['read']}): {MM['town: job givers at the board']['desperate']} desperate, {MM['town: job givers at the board']['eerie']} eerie. But all 102 are two sentences with the pay in the second, so even the
  frightened ones end as a quote. His starred line is the model that breaks that.
- HIS MEN IN A FIGHT are scared about a third of the time ({MM['fight: his men mid-fight']['scary_first']} of {MM['fight: his men mid-fight']['read']}, {MM['fight: his men mid-fight']['desperate']} desperate); the rest are quips and orders.
- THE SURVIVOR is a third ({MM['fight: the survivor after']['scary_first']} of {MM['fight: the survivor after']['read']}), split between shaken ({MM['fight: the survivor after']['desperate']}) and cold ({MM['fight: the survivor after']['cold']}); the cold ones are the 'morbid funny' he asked for on 11/2.
- THE FEED: the valley {MM['feed: the valley']['scary_first']} of {MM['feed: the valley']['read']} and none desperate; far away {MM['feed: far away']['scary_first']} of {MM['feed: far away']['read']} and {MM['feed: far away']['eerie']} of them eerie. Most far posts are sad first.
- THE KEEPERS ({MM['town: keepers, the Elder, the bar']['scary_first']} of {MM['town: keepers, the Elder, the bar']['read']}) are scared only when the town has the cough or was raided; on a plain day a shop is a shop.
- THE HIRES ({MM['hires: rare men and the retinue']['scary_first']} of {MM['hires: rare men and the retinue']['read']}): not one is desperate. Every man selling his gun sounds like he has options.
- THE BOSS ASKERS ({MM['bosses: the asker and after']['scary_first']} of {MM['bosses: the asker and after']['read']}): the first thing an asker says is scary half the time (6 of 12); the yes and no answers, the notes read out
  and the thanks after are directions.

ONE OF EACH KIND, AND ONE THAT IS NOT (read out of the reading file):
{ex_block}

## 2. WEAK, SAID PLAINLY

- ONE READER. The two readings agree with each other because they are the same reader. His ear is the only one that counts, and it
  has spoken four times.
- EERIE MAY NOT BE HIS SCARY. {T['E']} of the {T['scary']} are eerie. None of his four lines is. If he means fear you can name, the game is at
  {round(100*(T['scary']-T['E'])/T['read'])}%, not {round(100*T['scary']/T['read'])}%.
- FIVE MOUTHS ARE STILL A DRAW OF 36. Their share can be off by eight lines in a hundred either way.
- 'WHAT IT POINTS TO' IS A READING. Eleven of them from four lines. They are there so his next answers can break them.
- NOTHING WAS PLAYED, AND NO CARD WAS ADDED THIS ROUND: twenty-eight of this lane's cards are already waiting on him.
'''
assert '—' not in recmd
open('records/BOHEMIA_WORDS_TWO_THE_SECOND_READING_AND_THE_VOICE_IN_THREE_PARTS_11_18_26.md','w',encoding='utf-8').write(recmd)
print('voice',len(voice),'record',len(recmd),'| read',T['read'],'scary',T['scary'],'| waiting',len(waiting),len(s1),len(s2),'| est',round(est),'of',allu)
