import re,os,hashlib
src=open('BOHEMIA_GRAPHICS_ENGINE_MASTER_7_16_26.js').read()
os.makedirs('engine',exist_ok=True)
pat=re.compile(r'={10,}\n### FILE: (\S+)\n### MD5: ([0-9a-f]{32})[^\n]*\n={10,}\n')
parts=list(pat.finditer(src))
ok=0;bad=[]
for i,m in enumerate(parts):
    name,want=m.group(1),m.group(2)
    end=parts[i+1].start() if i+1<len(parts) else len(src)
    body=src[m.end():end].lstrip('\n').rstrip('\n')+'\n'
    open('engine/'+name,'w').write(body)
    got=hashlib.md5(body.encode()).hexdigest()
    if got==want: ok+=1; print("MD5 OK   "+name)
    else: bad.append(name); print("MD5 DIFF "+name+"  want "+want+" got "+got)
print("\n%d/%d md5 exact"%(ok,len(parts)))
