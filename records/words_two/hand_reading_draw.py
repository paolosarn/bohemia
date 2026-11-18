"""WORDS TWO 11/18: draws the lines of the SECOND hand reading against SCARY FIRST (VAMILY rule 455) and keeps the draw.
   python3 records/words_two/hand_reading_draw.py            -> records/words_two/scary_first_to_read.json (written once, then kept)
   python3 records/words_two/hand_reading_draw.py --print MOUTH [FROM TO]   -> the lines of one mouth, numbered, for the reader
A mouth of 170 lines or fewer is read WHOLE (every different line, in the file's own order). A bigger mouth is read as 36 lines
drawn by the same fixed seed as the first reading, so its first twelve are the twelve already read. Once the draw is written it is
never redrawn: a line added to the game later is simply not in this reading. It rewrites nothing."""
import json,os,random,re,sys
R=os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..'))+'/'
OUT=R+'records/words_two/scary_first_to_read.json'
if not os.path.exists(OUT):
    src=open(R+'records/words_two/measure_every_mouth.py',encoding='utf-8').read().split("his_t=[];his_v=[]")[0]
    ns={'__file__':R+'records/words_two/measure_every_mouth.py'}; exec(compile(src,'pools','exec'),ns); pools=ns['pools']
    old={m['mouth']:[r['line'] for r in m['lines']] for m in json.load(open(R+'records/words_two/scary_first_hand_reading.json',encoding='utf-8'))['mouths']}
    D=[]
    for k,v in pools.items():
        u=list(dict.fromkeys(v))
        if len(u)<=170: D.append(dict(mouth=k,how='whole',of=len(u),lines=u))
        else:
            rnd=random.Random('455:'+k); s=u[:]; rnd.shuffle(s); first=old.get(k) or s[:12]
            rest=[l for l in s if l not in first][:24]; D.append(dict(mouth=k,how='36 drawn',of=len(u),lines=first+rest))
    json.dump({'draft':True,'seed':'455:<mouth>','mouths':D},open(OUT,'w',encoding='utf-8'),indent=1,ensure_ascii=False)
D=json.load(open(OUT,encoding='utf-8'))['mouths']
if '--print' in sys.argv:
    i=sys.argv.index('--print'); name=sys.argv[i+1]; a=int(sys.argv[i+2]) if len(sys.argv)>i+2 else 0; b=int(sys.argv[i+3]) if len(sys.argv)>i+3 else 10**6
    m=[x for x in D if x['mouth'].startswith(name)][0]
    print('== %s (%s, %d of %d)'%(m['mouth'],m['how'],len(m['lines']),m['of']))
    for n,l in enumerate(m['lines']):
        if a<=n<b: print('%3d %s'%(n,l.replace('\n',' / ')[:300]))
else:
    for m in D: print('%-36s %-9s read %3d of %3d'%(m['mouth'],m['how'],len(m['lines']),m['of']))
    print('to read:',sum(len(m['lines']) for m in D))
