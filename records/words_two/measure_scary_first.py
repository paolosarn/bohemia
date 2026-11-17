"""WORDS TWO 11/17: every live mouth measured against SCARY FIRST (VAMILY rule 455, Paolo 11/17).
   python3 records/words_two/measure_scary_first.py            -> records/words_two/measure_scary_first.json and a table
   python3 records/words_two/measure_scary_first.py --sample N -> also prints N lines a mouth (seeded) for the hand reading
A MACHINE CANNOT HEAR FEAR. What it can count is whether a line carries any word of the things his law names: a body in danger
(dying, killing, hunger, thirst, sickness, the dead), fear or a plea (please, help, afraid, run, hide, they are coming), and the deal
said out loud (batteries, pay, owe, tax, price). So this counts THREE SHARES A MOUTH, and the hand reading beside it (the record) says
how far the count can be trusted. His own four lines are run through the same patterns first, as the check on the ruler.
Reads the game's data files and the registry's verdicts; writes only its own json. It rewrites nothing."""
import json,re,sys,os,random,collections,importlib.util
R=os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..'))+'/'
spec=importlib.util.spec_from_file_location('mm',R+'records/words_two/measure_every_mouth.py')
src=open(R+'records/words_two/measure_every_mouth.py',encoding='utf-8').read()
# reuse the pools of the first ruler: run that file up to the line where it starts reading his corpus
head=src.split("his_t=[];his_v=[]")[0]
ns={'__file__':R+'records/words_two/measure_every_mouth.py'}; exec(compile(head,'pools','exec'),ns); pools=ns['pools']
BODY=re.compile(r"\b(kill\w*|die[sd]?|dying|dead|death|bod(y|ies)|blood\w*|bleed\w*|shots?|shoot\w*|burn\w*|stab\w*|cut\w*|starv\w*|hungry|hunger|thirst\w*|sick\w*|cough\w*|fever|bur(y|ied)|grave\w*|corpse\w*|meat|bones?|eaten|ate|eat (you|us|him|her|them)|bit(e|es|ten)|wound\w*|hurt\w*|breath\w*|drown\w*|rot\w*|funeral\w*|gone|didn't come back|did not come back|never came back|went quiet|took (him|her|them)|haven't seen|no food|not eaten)\b",re.I)
FEAR=re.compile(r"\b(please|help( us| me)?|afraid|scared|scary|fear\w*|terrif\w*|run|hide|hiding|they'?re coming|here they come|coming for|come back|before they|don't (shoot|hurt|leave)|get down|stay down|oh no|oh god|dios|pray\w*|beg\w*|nobody is coming|no one is coming|answer me|careful|watch (out|your)|danger\w*|alone|dark|night|scream\w*|cry\w*|cried|shak\w*)\b",re.I)
DEAL=re.compile(r"\b(batter(y|ies)|cells?|pay\w*|paid|owe[sd]?|tax\w*|toll|price\w*|cost\w*|trade\w*|sell\w*|sold|buy\w*|bought|worth|for free|share|debt\w*|reward)\b",re.I)
def marks(l): return (bool(BODY.search(l)), bool(FEAR.search(l)), bool(DEAL.search(l)))
def row(name,L):
    L=[re.sub(r"\{[a-z_]+\}","X",l) for l in L if isinstance(l,str) and l.strip()]
    m=[marks(l) for l in L]; n=len(L) or 1
    return dict(name=name,n=len(L),body=round(100*sum(a for a,b,c in m)/n),fear=round(100*sum(b for a,b,c in m)/n),
                scary=round(100*sum(a or b for a,b,c in m)/n),deal=round(100*sum(c for a,b,c in m)/n),
                scary_and_deal=round(100*sum((a or b) and c for a,b,c in m)/n),none=round(100*sum(not(a or b or c) for a,b,c in m)/n))
out=[row(k,v) for k,v in pools.items()]
out.append(row('ALL THE GAME',[l for v in pools.values() for l in v]))
reg=json.load(open(R+'records/target/BOHEMIA_VOTE_REGISTRY.json',encoding='utf-8'))
his=[v['said'] for v in reg['verdicts'] if v['id'].startswith('words-two-hw') and v.get('said')]
ours=[i['homework']['line'] for i in reg['items'] if i.get('lane')=='words two' and i['id'] in {v['id'] for v in reg['verdicts'] if v.get('said')}]
out.append(row('HIS ANSWERS SO FAR (%d)'%len(his),his)); out.append(row('OUR LINES HE ANSWERED (%d)'%len(ours),ours))
json.dump({'draft':True,'tool':'records/words_two/measure_scary_first.py','note':'a count of words, not of fear: read the record beside it','rows':out,
           'his':[{'line':l,'body':marks(l)[0],'fear':marks(l)[1],'deal':marks(l)[2]} for l in his]},open(R+'records/words_two/measure_scary_first.json','w'),indent=1)
print('mouth | lines | a body in danger | fear or a plea | SCARY (either) | the deal said | scary AND the deal | none of the three')
for r in out: print(' | '.join(str(r[k]) for k in ['name','n','body','fear','scary','deal','scary_and_deal','none'])+'')
if '--sample' in sys.argv:
    # the hand reading: N lines a mouth, seeded so anybody can draw the same ones; --batch 2 draws the next N, never one twice
    N=int(sys.argv[sys.argv.index('--sample')+1]); B=int(sys.argv[sys.argv.index('--batch')+1]) if '--batch' in sys.argv else 1
    for k,v in pools.items():
        rnd=random.Random('455:'+k); u=list(dict.fromkeys(v)); rnd.shuffle(u)
        print('\n== '+k)
        for l in u[(B-1)*N:B*N]:
            a,b,c=marks(l); print('  [%s%s%s] %s'%('B' if a else '-','F' if b else '-','D' if c else '-',l.replace('\n',' / ')[:230]))
