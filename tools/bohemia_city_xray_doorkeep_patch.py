import base64,re,sys
ALPHA='slices/BOHEMIA_ALPHA_0_9.html'; MARKER='__XRAY_DOOR_STAYS__'
ANCHOR="""        const dr=facadeDoor(v,C);
        if(dr)g.drawImage(dr,dx,dy-C,C,C*2);"""
NEW="""        /* """+MARKER+""" -- the wall goes to glass, THE DOOR DOES NOT. He ruled the
           transparency is "to reflect characters items or the player or DOORS", so a
           door that vanishes with its wall defeats the whole point: you would see
           through the building and not see the way in. Wall at XRAY_A, door at full. */
        if(xrayHas(gx,gy)) g.globalAlpha=1;
        const dr=facadeDoor(v,C);
        if(dr)g.drawImage(dr,dx,dy-C,C,C*2);"""
alpha=open(ALPHA,encoding='utf8',errors='ignore').read()
m=re.search(r"CITY_B64\s*=\s*['\"`]([A-Za-z0-9+/=]{5000,})",alpha)
city=base64.b64decode(m.group(1)).decode('utf8',errors='ignore')
if MARKER in city: print('NOOP'); sys.exit(0)
if city.count(ANCHOR)!=1: print('FAIL anchor',city.count(ANCHOR)); sys.exit(1)
city=city.replace(ANCHOR,NEW,1)
out=base64.b64encode(city.encode('utf8')).decode('ascii')
open(ALPHA,'w',encoding='utf8').write(alpha[:m.start(1)]+out+alpha[m.end(1):])
print('the door stays solid while its wall goes to glass')
