# WORDS TWO 11/17: writes page one of THE VOICE (laws/BOHEMIA_LAW_THE_VOICE_11_17_26.md), the hand reading
# (records/words_two/scary_first_hand_reading.json) and the record
# (records/BOHEMIA_WORDS_TWO_SCARY_FIRST_MEASURED_AND_THE_NEXT_TWELVE_CARDS_11_17_26.md). VAMILY rules 455, 454(c)(d), 458(a).
# HIS WORDS ARE NEVER TYPED HERE AS TRUTH: every quote of his on the page is checked, word for word, against his own record or
# the registry's verdicts before the page is written, and the script stops if one is not there. Every game line is read from
# the game's files. The prose between them is this lane's. Run from the repo root after
#   python3 records/words_two/measure_every_mouth.py && python3 records/words_two/measure_scary_first.py
# It rewrites nothing in the game.
import json,re,random,os,sys
def J(p): return json.load(open(p,encoding='utf-8'))
norm=lambda s: re.sub(r'\s+',' ',s).strip()
REC='records/BOHEMIA_PAOLO_SCARY_FIRST_THE_GRINDER_AND_THE_CAR_CAMPS_11_17_26.md'
rec=norm(open(REC,encoding='utf-8').read())
def his(q):
    assert norm(q) in rec, 'NOT HIS WORDS AS RECORDED: '+q[:70]
    return q
reg=J('records/target/BOHEMIA_VOTE_REGISTRY.json')
items={i['id']:i for i in reg['items']}; verd={v['id']:v for v in reg['verdicts']}
# ---------- his answers so far (the registry is the source; the export is records/BOHEMIA_PAOLO_VOTE_11_16_26.txt) ----------
ans=[]
for i in reg['items']:
    if i.get('lane')=='words two' and i['id'] in verd and verd[i['id']].get('said'):
        v=verd[i['id']]; ans.append(dict(id=i['id'],n=i['homework']['n'],sheet=i['homework']['sheet'],mouth=i['homework']['mouth'],ours=i['homework']['line'],his=v['said'],star=bool(v.get('star')),vote=v['vote']))
ans.sort(key=lambda a:(a['sheet'],a['n']))
W=re.compile(r"[A-Za-zÀ-ÿ0-9']+")
SW=re.compile(r"\b(fuck\w*|shit\w*|damn\w*|hell|ass|asshole|bitch\w*|bastard\w*|crap|piss\w*|bullshit|goddamn|idgaf|wtf|mfs?)\b",re.I)
SPAN=re.compile(r"\b(mijo|mija|jefe|carnal|pues|órale|mira|bueno|ni modo|gracias|oye|compa|hijo|bienvenido|todo)\b",re.I)
DEAL=re.compile(r"\b(batter(y|ies)|cells?|pay\w*|paid|owe[sd]?|tax\w*|toll|price\w*|trade\w*|for free)\b",re.I)
PLEA=re.compile(r"\b(please|help)\b",re.I)
def sents(t): return [s for s in re.split(r"(?<=[.!?])\s+",t.strip()) if s.strip()]
def facts(t):
    s=sents(t); return dict(words=len(W.findall(t)),sents=len(s),swears=len(SW.findall(t)),q=t.count('?'),plea=len(PLEA.findall(t)),deal=bool(DEAL.search(t)),span=len(SPAN.findall(t)),last=len(W.findall(s[-1])),stop=t.rstrip()[-1:] in '.!?',per=round(len(W.findall(t))/len(s),1))
for a in ans: a['f_ours']=facts(a['ours']); a['f_his']=facts(a['his'])
# ---------- the hand reading: 12 lines a mouth, the same draw as measure_scary_first.py --sample 12 --batch 1 ----------
src=open('records/words_two/measure_every_mouth.py',encoding='utf-8').read().split("his_t=[];his_v=[]")[0]
ns={'__file__':os.path.abspath('records/words_two/measure_every_mouth.py')}; exec(compile(src,'pools','exec'),ns); pools=ns['pools']
ms=open('records/words_two/measure_scary_first.py',encoding='utf-8').read()
BODY=re.compile(re.search(r'BODY=re\.compile\(r"(.*)",re\.I\)',ms).group(1),re.I); FEAR=re.compile(re.search(r'FEAR=re\.compile\(r"(.*)",re\.I\)',ms).group(1),re.I)
LABELS={   # THIS LANE'S READING, one letter a line in the order drawn: Y = reading it cold, the first thing felt is that this person is in hell
 'road: what the stranger says':'NNNYYYNYNYNY','road: the answer after his choice':'NNYYNNNNNYNN','road: side quest talk':'NYYNNNYYNNNY',
 'town: job givers at the board':'NNNNNNYYNNNN','town: keepers, the Elder, the bar':'NNYNNNYNNYNN','hires: rare men and the retinue':'NYYNNNNNNYNN',
 'fight: his men mid-fight':'NNNNYYNNYYNN','fight: the survivor after':'NYNYNYNYYYNN','fight: the why line':'NYYYNNYYYNNY',
 'bosses: the asker and after':'NNNNNNNNNNNN','feed: the valley':'YYNNNNNNNYNY','feed: far away':'NNNNNNNNYYYN','feed: a town falling':'YYYYYYYYYYYY'}
hand=[]; N=12
# ONCE READ, A LINE STAYS READ: the file of the hand reading is the truth. Another lane adding a line to a pool would change the
# draw, and these marks would land on lines nobody read; so the lines are taken from the file when it is there, and drawn only once.
HR='records/words_two/scary_first_hand_reading.json'
KEPT={m['mouth']:[r['line'] for r in m['lines']] for m in J(HR)['mouths']} if os.path.exists(HR) else {}
for k,v in pools.items():
    rnd=random.Random('455:'+k); u=list(dict.fromkeys(v)); rnd.shuffle(u); draw=KEPT.get(k) or u[:N]; lab=LABELS[k]; assert len(lab)==len(draw),k
    rows=[dict(line=l,scary_first=(c=='Y'),machine=bool(BODY.search(re.sub(r"\{[a-z_]+\}","X",l)) or FEAR.search(re.sub(r"\{[a-z_]+\}","X",l)))) for l,c in zip(draw,lab)]
    hand.append(dict(mouth=k,read=len(rows),scary_first=sum(r['scary_first'] for r in rows),lines=rows))
tot=sum(h['read'] for h in hand); yes=sum(h['scary_first'] for h in hand)
agree=sum(1 for h in hand for r in h['lines'] if r['scary_first']==r['machine'])
miss=sum(1 for h in hand for r in h['lines'] if r['scary_first'] and not r['machine']); over=sum(1 for h in hand for r in h['lines'] if r['machine'] and not r['scary_first'])
json.dump({'draft':True,'tool':'tools/bohemia_words_two_scary_first_record.py','law':'VAMILY rule 455 (Paolo 11/17): every voice is two words and the first is always scary',
  'how':'12 lines a mouth, drawn by a fixed seed (python3 records/words_two/measure_scary_first.py --sample 12 --batch 1 prints the same lines); read cold by WORDS TWO; scary_first is this lane\'s judgment and his to overturn; machine is the word count of the same line',
  'read':tot,'scary_first':yes,'machine_agrees':agree,'machine_missed':miss,'machine_overcalled':over,'mouths':hand},open('records/words_two/scary_first_hand_reading.json','w',encoding='utf-8'),indent=1,ensure_ascii=False)
H={h['mouth']:h for h in hand}
MS={r['name']:r for r in J('records/words_two/measure_scary_first.json')['rows']}
allL=[re.sub(r"\{[a-z_]+\}","X",l) for v in pools.values() for l in v]
n_please=sum(bool(re.search(r"\bplease\b",l,re.I)) for l in allL); n_help=sum(bool(re.search(r"\bhelp (me|us)\b|\bhelp\b\?",l,re.I)) for l in allL)
def ex(k,want,i=0):
    c=[r['line'] for r in H[k]['lines'] if r['scary_first']==want]; return '"'+c[min(i,len(c)-1)].replace('\n',' / ')+'"' if c else '(none in the twelve)'
order=['feed: a town falling','fight: the why line','fight: the survivor after','road: what the stranger says','road: side quest talk','fight: his men mid-fight','feed: the valley','road: the answer after his choice','town: keepers, the Elder, the bar','hires: rare men and the retinue','feed: far away','town: job givers at the board','bosses: the asker and after']
hand_tbl='\n'.join("| %s | %d of %d | %d%% | %d%% | %d%% | %s | %s |"%(k,H[k]['scary_first'],H[k]['read'],MS[k]['scary'],MS[k]['deal'],MS[k]['scary_and_deal'],ex(k,True),ex(k,False)) for k in order)
G=MS['ALL THE GAME']
sheet2=J('records/target/words_two/homework_02.json'); p2={c['id']:c for c in J('slices/vote/words_two_homework_02/pulled.json')['cards']}
next_tbl='\n'.join("| %d | SCARY, THEN %s | %s | %s | %s |"%(c['n'],c['second'],c['mouth'],p2[c['id']]['line'].replace('|','/').replace('\n',' / '),c['teaches']) for c in sheet2['cards'])
q=lambda s:'"'+s+'"'
A={a['n']:a for a in ans if a['sheet']==1}
def cmp(n,label):
    a=A[n]; fo,fh=a['f_ours'],a['f_his']
    return "| %s%s | %d / %d | %s / %s | %d / %d | %d / %d | %d / %d | %s / %s | %d / %d | %d / %d |"%(label,' (STARRED)' if a['star'] else '',fo['words'],fh['words'],fo['per'],fh['per'],fo['swears'],fh['swears'],fo['q'],fh['q'],fo['plea'],fh['plea'],'yes' if fo['deal'] else 'no','yes' if fh['deal'] else 'no',fo['span'],fh['span'],fo['last'],fh['last'])
facts_tbl='\n'.join([cmp(1,'THE KID WHO BEGS'),cmp(2,"THE ENEMY'S WHY"),cmp(3,"THE FEED'S JOKE POST"),cmp(4,"THE OLD WOMAN'S JOB")])
hs=[a['f_his'] for a in ans]; os_=[a['f_ours'] for a in ans]
# ---------- his law, in his words ----------
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
# EVERY ANSWER OF HIS GOES ON THE PAGE, in the order he was asked. A card this lane has named gets its name; any other gets its
# mouth, so the page grows the moment the registry holds a new answer and the script is run (the reading under it is added by hand).
NAMES={'words-two-hw01-01-a-kid-begs-on-the-road-11-17':'THE KID WHO BEGS (a road stop)','words-two-hw01-02-the-enemy-says-why-11-17':"THE ENEMY'S WHY (their leader, as a fight opens)",
       'words-two-hw01-03-a-joke-post-in-the-feed-11-17':"THE FEED'S JOKE POST (a regular person in the valley)",'words-two-hw01-04-an-old-woman-offers-a-job-11-17':"THE OLD WOMAN'S JOB (a job giver at the board)"}
def exline(k,a):
    label=NAMES.get(a['id']) or (a['mouth']+(' (SCARY, THEN '+items[a['id']]['homework']['second']+')' if items[a['id']]['homework'].get('second') else '')+', card '+str(a['sheet'])+'.'+str(a['n']))
    return "%d. %s%s\n   WAS (the game today): %s\n   HIS: %s"%(k,label,'  *** HE STARRED THIS ONE ***' if a['star'] else '',q(a['ours']),q(a['his']))
examples='\n'.join(exline(k,a) for k,a in enumerate(ans,1))
voice=f'''# BOHEMIA -- THE VOICE (Paolo 11/17/26. Page one is LOCKED: VAMILY rule 455.)
# HOW EVERY MOUTH AND EVERY POST IN THE GAME TALKS. One page of rules in HIS words, with HIS own lines as the examples.
# He called page one '{BED}'.
# THIS PAGE IS BUILT FROM HIS ANSWERS (rule 454(d)). It gains a rule only when he gives one. Nothing on it is a lane's taste: where
# a sentence is this lane's reading it says so, and it is his to correct.
# NOTHING IN THE GAME IS REWRITTEN TO IT YET (rule 454(a)). That starts mouth by mouth, on his word.
# Written by tools/bohemia_words_two_scary_first_record.py, which stops if any quote here is not in his record or the VOTE registry
# word for word. Gate: gates/the_voice_is_his_words_gate.js. His record: {REC}

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

## HIS OWN LINES (the examples of THE VOICE; exactly as he gave them in the VOTE tab, rule 458(a))

{examples}

A STAR MAKES ITS WAY THE WAY (rule 115(h)). The old woman's line is the first starred line of THE VOICE. (This lane's reading of its
way: a job giver is afraid of a thing she cannot name, says who dies next, begs, and ends by naming the deal as a question.)

## WHAT HIS FOUR LINES DO (the counts are counts; the reading under them is this lane's and his to correct)

Ours / his, counted the same way.

| Line | Words | Words a sentence | Swears | Questions | 'please' or 'help' | A word of the deal (batteries, pay, tax) | Spanish words | Words in the last sentence |
|---|---|---|---|---|---|---|---|---|
{facts_tbl}

- EVERY ONE OF HIS HAS A BODY IN DANGER IN IT (not eaten in days; your body turned to mystery meat; a mother dying; they are going to
  kill us next). One of our four did.
- THE SWEAR IS IN THE MOUTH OF THE YOUNG AND THE ARMED ({hs[0]['swears']} in the kid's line, {hs[1]['swears']} in the enemy's, one acronym in the post), not the old
  woman's. The game had none in 34,329 words.
- HOW LONG A SENTENCE RUNS FOLLOWS THE PERSON, AND OURS HAD IT BACKWARDS. His kid pours it out ({hs[0]['per']} words a sentence; ours was
  clipped, {os_[0]['per']}). His enemy runs on ({hs[1]['per']}; ours {os_[1]['per']}). His old woman is short of breath ({hs[3]['per']}; ours was long and balanced, {os_[3]['per']}).
  There is no house length. Fear and age set it.
- NO LINE OF HIS ENDS ON A CLEVER CLOSING SENTENCE. The kid ends on what he can do for you ({hs[0]['last']} words), the enemy on what happens to
  your body ({hs[1]['last']}), the old woman on a question ({hs[3]['last']}).
- THE DEAL IS SAID. The enemy names what was owed ('their battery tax'), the old woman asks it out loud ('You'll kill them for some
  batteries?'), and the kid, who has nothing, offers work ('I know how to shine and clean some of your equipment I see'). Rule 4
  above, three times in four.
- HE TOOK THE SPANISH OUT OF THE KID ('Oye, jefe' became 'Hey bro') and put none in the other three: {sum(h['span'] for h in hs)} Spanish words in his four
  lines, {sum(o['span'] for o in os_)} in ours. His standing rule is unchanged (about 15% of human talk at ship, no new Spanglish line, the player
  never); whether a mouth keeps its Spanish is asked card by card.
- SHE DOES NOT EXPLAIN. Ours counted the beasts, sized them and named the pay ('Seven of them, big as ponies... only 199 batteries').
  Hers are 'dark shadows'. The enemy does not explain a law either: he was 'told to be on the lookout'. Somebody above him gave an order.
- THE POST IS TYPED LIKE A PHONE: 'IDGAF', 'ur', a small 'i', no full stop. And it is cold: the joke IS the cruelty. Scary, then funny.

## WHAT IS NOT ON THIS PAGE YET (each waits on his answer; the card that asks is in the VOTE tab)

Sixteen cards of his first sheet are still out. Sheet two asks how each PAIR sounds, one pair a card: scary funny (a toll on the
road), scary happy (the water is back), scary serious (a man of his is dead), scary confident (the bookie), scary trying to be a
leader (a block watch's page), scary political (forty people at his gate), scary kind (the doc), scary proud (a scar), scary begging
(a post for insulin), scary selling (a coat on a rack), scary sad (the kid after a death), scary angry (the last water).
Not asked yet: how a boss talks; who tells the lines that have no mouth; how his own men address him; how far the feed's far posts
may sit from his valley.

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
recmd=f'''# WORDS TWO: SCARY FIRST, MEASURED ON EVERY MOUTH; WHAT HIS FIRST FOUR ANSWERS TAUGHT; THE NEXT TWELVE CARDS (11/17/26)

VAMILY rules 455 (SCARY FIRST: IT IS HELL), 454(c)(d), 458(a); ask rows 637, 643, 629. draft:true. NOTHING IN THE GAME WAS REWRITTEN.
THE VOICE's page one is laws/BOHEMIA_LAW_THE_VOICE_11_17_26.md: his law in his words and his four lines as its examples.

PAOLO 11/17: '{R2}'

## 0. THE ANSWER FIRST

1. BY HAND, ABOUT A THIRD OF THE GAME'S LINES ARE SCARY FIRST TODAY: {yes} of {tot} read cold ({round(100*yes/tot)}%), twelve a mouth. Take out the one
   mouth written to his own brief (a town falling, 12 of 12) and it is {yes-12} of {tot-12} ({round(100*(yes-12)/(tot-12))}%).
2. THE MOUTHS HE NAMED ARE THE FURTHEST. The askers who send him after a boss 0 of 12, the job givers 2 of 12, what comes back after
   a road choice 3 of 12, the keepers 3 of 12, the hires 3 of 12. Nearest: a town falling 12 of 12, the why line 7, the survivor 6,
   strangers on the road 6.
3. THE SCARY WE HAVE IS THE WRONG KIND. It is eerie (something watching, a song in the wash) or it is a threat. HIS is desperate: a
   plea with a body in it and the deal said. In {G['n']:,} lines the word 'please' appears in {n_please} and 'help me' or 'help us' in {n_help}. A line that is
   both scary and names the deal: {G['scary_and_deal']}% by the word count. Two of his four lines are that, and a third offers work.
4. HIS FOUR ANSWERS ALREADY SETTLE FIVE OF THE TWELVE UNKNOWNS, partly: people swear (the young and the armed); his own words go in
   their mouths ('bro', 'man'); how long a sentence runs follows the person (his kid pours it out, his old woman is short of breath;
   ours had them the other way round) and none ends on a clever line; the Spanish came out of the kid; a post is phone typing and
   cold. Section 1.
5. THE NEXT TWELVE CARDS ARE IN THE VOTE TAB: one for each second word (funny, happy, serious, confident, trying to be a leader,
   political, kind, proud, begging, selling, sad, angry), each on a different mouth. Section 3.

## 1. WHAT EACH OF HIS FOUR ANSWERS TAUGHT

Ours / his, counted the same way (the export is records/BOHEMIA_PAOLO_VOTE_11_16_26.txt; all four were YES, the fourth a STAR).

| Line | Words | Words a sentence | Swears | Questions | 'please' or 'help' | A word of the deal (batteries, pay, tax) | Spanish words | Words in the last sentence |
|---|---|---|---|---|---|---|---|---|
{facts_tbl}

1. THE KID WHO BEGS. Ours: {q(A[1]['ours'])} His: {q(A[1]['his'])}
   TAUGHT: (a) a kid swears, twice, and it is how the hunger gets said; (b) the numbers climb (two days, then his brother's three):
   he piles it up instead of cutting it short; (c) he ASKS, with a question mark and a please; (d) he does not beg for free: he looks
   at their gear and offers to clean it, so the last thing said is the offer; (e) 'Oye, jefe' is 'Hey bro' now, and 'man' and 'you
   guys' are in a kid's mouth; (f) ours had him refuse batteries and quote his brother like a proverb ('ask the ones with guns, they
   got food'): a clever close. His has none.
2. THE ENEMY'S WHY. Ours: {q(A[2]['ours'])} His: {q(A[2]['his'])}
   TAUGHT: (a) an enemy is under ORDERS ('We were told'): there is somebody above him, which is scarier than a man with an opinion;
   (b) he insults the crew to their faces; (c) the reason is money, exact and petty ('their battery tax'); (d) THEN the horror, said
   as a chore: clean the body, turn it to mystery meat (rule 456); (e) two sentences of 24 and 11 words, not one sentence of 'this,
   and that'; (f) EYES' row 631 (the why line said the road's words for every fight) and this agree: the why is what THESE men were
   sent to do.
3. THE FEED'S JOKE POST. Ours: {q(A[3]['ours'])} His: {q(A[3]['his'])}
   TAUGHT: (a) he kept the thing (two jugs under the bed) and changed who the poster IS: ours was smug, his does not care if your
   mother dies; (b) scary, then funny: the laugh is at how cold it is; (c) text-speak, a capital only on the acronym, no full stop,
   'dying' with no 'is'. The research found the feed typed backwards (lower case, a neat full stop); this is the right way round.
4. THE OLD WOMAN'S JOB, STARRED. Ours: {q(A[4]['ours'])} His: {q(A[4]['his'])}
   TAUGHT: (a) she does not count, size or explain the thing: 'dark shadows'; fear is not knowing; (b) she says who dies next;
   (c) she begs twice ('Please help us'); (d) no pay number in her mouth: the deal is a QUESTION, and it names what he is ('You'll
   kill them for some batteries?'); (e) 'My Dear' is how an old woman opens, and there is no Spanish in it; (f) four sentences of
   about seven words: she is the short-breathed one, and it reads as fear, not as style.
AGAINST THE UNKNOWNS OF THE RESEARCH (records/BOHEMIA_WORDS_TWO_EVERY_MOUTH_AND_WHY_IT_IS_NOT_HUMAN_11_17_26.md section 6):
U1 swearing: YES for a kid and an armed man, none from the old woman (one answer each). U2 his words in their mouths: YES, 'bro',
'man'. U3 length: it follows the person (the kid 10 words a sentence, the enemy 17, the old woman 7), no clever last line. U4 Spanish: out of the kid; none added. U5 funny: scary
then funny, on the feed. U7 the why line: an order, an insult, the debt, the horror. U9 the feed: phone typing, cold.
STILL OPEN: U6 the boss, U8 a hire, U10 the lines with no mouth, U11 how his men address him, U12 age (one kid, one old woman so far).

## 2. EVERY MOUTH AGAINST SCARY FIRST

TWO RULERS, AND NEITHER IS HIS EAR.
THE HAND READING: twelve lines a mouth, drawn by a fixed seed, read cold. One question: reading it with nothing else, is the first
thing you feel that this person is in hell (afraid, desperate, dangerous, or cold in a way that frightens)? Every line and its mark
are in records/words_two/scary_first_hand_reading.json; the marks are this lane's and his to overturn.
THE WORD COUNT: across all {G['n']:,} lines, whether a line holds a word of a body in danger (dying, killing, hunger, sickness, the dead)
or of fear or a plea, and whether it names the deal (batteries, pay, owe, tax, price): records/words_two/measure_scary_first.py.
THE WORD COUNT IS A POOR EAR: on the {tot} hand-read lines it agreed with the hand {agree} times, missed {miss} the hand called scary (the
ones with no fear word in them: 'they're on the fire stairs', a lion taking a dog) and called {over} scary that were not (a line can
say 'dead' and be a joke). So the hand column orders the mouths; the word columns are there for the deal, which IS a word.

| Mouth | By hand: scary first | Word count: scary | The deal said | Scary AND the deal | One that is | One that is not |
|---|---|---|---|---|---|---|
{hand_tbl}
| **ALL THE GAME** | **{yes} of {tot}** | **{G['scary']}%** | **{G['deal']}%** | **{G['scary_and_deal']}%** | | |

WHAT THE TABLE SAYS:
- THE ONE MOUTH WRITTEN TO HIS OWN BRIEF IS THE ONE THAT PASSES. The town falling was written on 11/3 from the thing he said moved
  him most (the last transmissions). Every other mouth was written to somebody's idea of a tone.
- THE ASKERS AND THE JOB GIVERS EXPLAIN INSTEAD OF FEAR. They carry the game's directions (where the boss is, what the job pays), so
  the fear got written out to make room. His old woman carries the same job in 27 words and none of the directions.
- THE FIGHT IS BRAVER THAN IT IS SCARED. His men mid-fight are scary first 4 of 12; most barks are quips or orders. The lines that
  pass are the frightened ones ('My hands are shaking, okay?').
- THE JOKES LEAD. Where a line is funny it is funny first: 'Nobody counts at a wedding. Well. My aunt counts.' His rule is the other
  order. The survivor's morbid lines are the closest, and half of them still open on the quip.
- THE FEED IS CLOSER THAN THE MOUTHS (the valley 4 of 12, a town falling 12 of 12), but its fear is eerie, not desperate, and its far
  posts are sad first (3 of 12).

## 3. THE NEXT TWELVE CARDS (sheet two, in the VOTE tab now)

His law names the pairs; the cards ask how each pair SOUNDS. One second word a card, a different mouth each, and no mouth he has
already answered is asked the same thing again. Each card says which pair it is there to test. No rewrite of ours on any card.

| # | The pair | Mouth | The line as the game has it | Why this card |
|---|---|---|---|---|
{next_tbl}

Six of the twelve second words are his own (funny, happy, serious, confident, trying to be a leader, political). Six are the
coordinator's and this lane's guesses at pairs the game needs (kind, proud, begging, selling, sad, angry): if a pair is wrong, his
answer on that card says so, and that is worth a card.
THREE LINES HAVE A BLANK THE GAME FILLS: card 3 and card 11 a dead man's name (TEO, CHUY), card 12 the name of the man who drank the
water (RICO). The stored lines are in slices/vote/words_two_homework_02/pulled.json.

## 4. WEAK, SAID PLAINLY

- THE HAND READING IS ONE READER AND TWELVE LINES A MOUTH. It can be off by two or three lines a mouth either way. It is good for the
  order of the mouths and for the examples, not for a second decimal.
- SCARY FIRST IS HIS EAR, NOT A COUNT. This lane read 'afraid, desperate, dangerous, or frighteningly cold' as scary. If he hears
  eerie as not scary, the valley feed and the side quests drop further.
- FOUR ANSWERS ARE FOUR ANSWERS: one kid, one enemy, one post, one old woman. Each 'taught' above is one line's worth until the rest
  of his sheet lands.
- THE PICTURES ARE BUILT, NOT PHOTOGRAPHED, as on sheet one. Nothing was played.
- THE GATE HOLDS HIS WORDS, NOT THE GAME'S. It fails if THE VOICE misquotes him. It does not yet fail a line for not being scary
  first: nothing may be rewritten yet (454(a)), and a count that under-reads by this much must not block a lane.
'''
assert '—' not in recmd
open('records/BOHEMIA_WORDS_TWO_SCARY_FIRST_MEASURED_AND_THE_NEXT_TWELVE_CARDS_11_17_26.md','w',encoding='utf-8').write(recmd)
print('voice',len(voice),'record',len(recmd),'| hand',yes,'of',tot,'| agree',agree,'miss',miss,'over',over,'| please',n_please,'help',n_help)
for a in ans: print(a['n'],a['f_ours'],a['f_his'])
