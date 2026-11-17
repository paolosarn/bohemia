"""WORDS TWO 11/17: every live mouth of the game and Paolo's own words measured with one ruler (rule 454(b)).
   python3 records/words_two/measure_every_mouth.py   -> records/words_two/measure_every_mouth.json and a table on the screen.
   Reads the game's data files and records/words_two/his_words/corpus.jsonl; writes nothing else."""
import json,re,statistics,sys,collections
import os
R=os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..'))+'/'
def J(p): return json.load(open(R+p,encoding='utf-8'))
pools=collections.OrderedDict()
ev=J('records/target/BOHEMIA_ROAD_EVENTS.json')['events']
def says_under(o,out):
    if isinstance(o,dict):
        for k,v in o.items():
            if k=='say' and isinstance(v,str): out.append(v)
            else: says_under(v,out)
    elif isinstance(o,list):
        for v in o: says_under(v,out)
pools['road: what the stranger says']=[e['says'] for e in ev]
a=[]; [says_under(e.get('opts'),a) for e in ev]; pools['road: the answer after his choice']=a
sq=J('records/target/BOHEMIA_SIDE_QUESTS.json')['quests']
a=[]
for q in (sq.values() if isinstance(sq,dict) else sq):
    for n in (q.get('nodes') or {}).values():
        for s in n.get('says') or []: a.append(s)
pools['road: side quest talk']=a
bs=J('records/target/BOHEMIA_BOARD_SHELF.json')['offers']; jk=J('records/target/BOHEMIA_JOB_KINDS.json')['board_people']['rows']
pools['town: job givers at the board']=[o['says'] for o in bs]+[o['says'] for o in jk]
tr=J('records/target/settlement_traits.json')['traits']; a=[]
for t in tr:
    for v in t['says'].values(): a.append(v)
ru=J('records/target/settlement_rumours.json'); a+= [r['says'] for r in ru['rumours']]
for v in ru['news']['lines'].values(): a+=v
pools['town: keepers, the Elder, the bar']=a
rr=J('records/target/bb/rare_recruits.json')['men']; rt=J('records/target/bb/retinue.json')['followers']['value']
pools['hires: rare men and the retinue']=[m['line'] for m in rr]+[f['ask'] for f in rt]
cv=J('records/target/bb/crew_voices.json'); fight=[]; after=[]
for t in cv['types'].values():
    for m,v in t['lines'].items():
        tgt = after if m in('win','lost','ran','wipe') else fight
        def grab(x):
            if isinstance(x,dict):
                for k,y in x.items():
                    if k=='sp': continue
                    grab(y)
            elif isinstance(x,list):
                for y in x:
                    if isinstance(y,str): tgt.append(y)
        grab(v)
pools['fight: his men mid-fight']=fight
pools['fight: the survivor after']=after
fr=J('records/target/bb/fight_reasons.json')['rules']; a=[]
for r in fr: a+=r.get('them',[])+r.get('ours',[])
pools['fight: the why line']=a
ba=J('records/target/bb/boss_act_one.json')['bosses']; a=[]
for b in ba:
    L=b['lead']['asker']; a+=[L['says'],L['yes_says'],L['no_says'],b['lead']['thing']['says'],b['after']['valley']]
pools['bosses: the asker and after']=a
fk=J('records/target/bb/feed_kinds.json'); a=[]
for k in fk['kinds']+fk['replies']+fk['followups']:
    for w in k.get('words',[]):
        if isinstance(w,dict) and w.get('en'): a.append(w['en'])
pools['feed: the valley']=a
fw=J('records/target/bb/feed_world.json'); a=[]
for k in fw['kinds']:
    for w in k.get('words',[]):
        if w.get('en'): a.append(w['en'])
pools['feed: far away']=a
rl=J('records/target/bb/radio_lines.json'); a=[]
for t in rl['towns'].values(): a+=[l['say'] for l in t['lines']]
pools['feed: a town falling']=a
his_t=[];his_v=[]
for line in open(R+'records/words_two/his_words/corpus.jsonl',encoding='utf-8'):
    r=json.loads(line)
    if not r.get('in_stats'): continue
    (his_t if r.get('channel')=='typed_vote' else his_v).append(r['text'])
W=re.compile(r"[A-Za-zÀ-ÿ0-9']+")
CONTR=re.compile(r"\b[A-Za-z]+'(s|t|re|ve|ll|d|m)\b|\b(gonna|wanna|gotta|ain't|kinda|lemme|gimme)\b",re.I)
UNC=re.compile(r"\b(do not|does not|did not|cannot|can not|will not|is not|are not|was not|were not|would not|could not|should not|have not|has not|it is|that is|there is|what is|I am|I will|I have|you are|we are|they are|he is|she is|we will|you will|let us)\b",re.I)
SW=re.compile(r"\b(fuck\w*|shit\w*|damn\w*|hell|ass|asshole|bitch\w*|bastard\w*|crap|piss\w*|dogshit|bullshit|goddamn|motherfuck\w*|mfs?)\b",re.I)
FILL=re.compile(r"\b(like|you know|i mean|just|yeah|man|bro|kinda|really|honestly|actually|literally|pretty much|basically|uh|um|well|look|listen|hey|okay|ok|right)\b",re.I)
SPAN=re.compile(r"\b(mijo|mija|jefe|jefa|carnal|pues|órale|orale|mira|bueno|ni modo|gracias|oye|compa|cabr[oó]n|hijo|hija|ay|s[ií]|ya sabes|bienvenido|todo|mano|amigo|ya|lana|verga|d[oó]nde|qu[eé]|nada|dios|se[ñn]or|do[ñn]a|don)\b",re.I)
ABS=re.compile(r"\b(nobody|everybody|everyone|always|never|nothing|everything|no one|anybody)\b",re.I)
NUM=re.compile(r"\b(\d+|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|twenty|thirty|forty|fifty|hundred|half|twice)\b",re.I)
def sents(t): return [s for s in re.split(r"(?<=[.!?])\s+",t.strip()) if s.strip()]
def row(name,L):
    L=[re.sub(r"\{[a-z_]+\}","X",l) for l in L if isinstance(l,str) and l.strip()]
    nw=sum(len(W.findall(l)) for l in L) or 1
    wl=[len(W.findall(l)) for l in L]; sl=[len(W.findall(s)) for l in L for s in sents(l)]
    multi=[l for l in L if len(sents(l))>=2]
    short_end=sum(1 for l in multi if len(W.findall(sents(l)[-1]))<=4)
    frag3=sum(1 for l in L if len(sents(l))>=3 and all(len(W.findall(s))<=4 for s in sents(l)[:3]))
    return dict(name=name,n=len(L),words=nw,med_words=statistics.median(wl),med_sent=statistics.median(sl),
      contr=round(1000*len(CONTR.findall(' '.join(L)))/nw,1),unc=round(1000*len(UNC.findall(' '.join(L)))/nw,1),
      swear=round(1000*len(SW.findall(' '.join(L)))/nw,1),fill=round(1000*len(FILL.findall(' '.join(L)))/nw,1),
      q=round(100*sum('?' in l for l in L)/len(L)),ex=round(100*sum('!' in l for l in L)/len(L)),
      span=round(100*sum(bool(SPAN.search(l)) for l in L)/len(L)),absol=round(1000*len(ABS.findall(' '.join(L)))/nw,1),
      num=round(100*sum(bool(NUM.search(l)) for l in L)/len(L)),short_end=round(100*short_end/max(1,len(multi))),multi=len(multi),
      and2=round(100*sum(bool(re.search(r", (and|so|but) ",l)) and len(sents(l))==1 for l in L)/len(L)),semi=sum(l.count(';') for l in L),colon=sum(l.count(':') for l in L),
      period_end=round(100*sum(l.rstrip()[-1:] in '.!?' for l in L)/len(L)),cap=round(100*sum(l.strip()[:1].isupper() for l in L)/len(L)))
out=[row(k,v) for k,v in pools.items()]
allg=[l for v in pools.values() for l in v]
out.append(row('ALL THE GAME',allg)); out.append(row('PAOLO, TYPED',his_t)); out.append(row('PAOLO, VOICE',his_v))
json.dump(out,open(R+'records/words_two/measure_every_mouth.json','w'),indent=1)
hdr=['name','n','words','med_words','med_sent','contr','unc','swear','fill','q','ex','span','absol','num','short_end','and2','semi','colon','period_end','cap']
print(' | '.join(hdr))
for r in out: print(' | '.join(str(r[h]) for h in hdr))
