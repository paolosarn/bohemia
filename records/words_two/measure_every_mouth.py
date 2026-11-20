"""WORDS TWO 11/17: every live mouth of the game and Paolo's own words measured with one ruler (rule 454(b)).
   python3 records/words_two/measure_every_mouth.py   -> records/words_two/measure_every_mouth.json and a table on the screen.
   Reads the game's data files and records/words_two/his_words/corpus.jsonl; writes nothing else."""
import json,re,statistics,sys,collections
import os
R=os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..'))+'/'
def J(p): return json.load(open(R+p,encoding='utf-8'))
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from the_mouths import pools as _pools   # 11/20 WORDS THREE: the mouths live in one place (the_mouths.py), shared with gates/the_voice_holds_gate.py
pools=_pools(J)
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
