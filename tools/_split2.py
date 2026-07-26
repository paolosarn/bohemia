import re,os,hashlib
src=open('BOHEMIA_GRAPHICS_ENGINE_MASTER_7_16_26.js').read()
pat=re.compile(r'={10,}\n### FILE: (\S+)\n### MD5: ([0-9a-f]{32})[^\n]*\n={10,}\n')
parts=list(pat.finditer(src))
m=parts[0]; name=m.group(1); want=m.group(2)
raw=src[m.end():parts[1].start()]
cands={
 'raw':raw,
 'rstrip_nl':raw.rstrip('\n')+'\n',
 'rstrip_all':raw.rstrip(),
 'rstrip_all_nl':raw.rstrip()+'\n',
 'lstrip_nl_rstrip':raw.lstrip('\n').rstrip('\n')+'\n',
 'lstrip_rstrip':raw.strip()+'\n',
 'lstrip_only':raw.lstrip('\n'),
}
print(name,'want',want)
for k,v in cands.items():
    print(' ',k,hashlib.md5(v.encode()).hexdigest(), 'HIT' if hashlib.md5(v.encode()).hexdigest()==want else '')
print(repr(raw[:20]),'...',repr(raw[-20:]))
