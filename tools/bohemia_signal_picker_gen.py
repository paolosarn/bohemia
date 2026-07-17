#!/usr/bin/env python3
"""BOHEMIA SIGNAL PICKER GENERATOR (7/18/26)

Emits tools/BOHEMIA_SIGNAL_PICKER_7_18_26.html — the interactive judging
surface for the traffic-signal commission, in the certified verdict-tool
style (SUN MODE daylight-readable, thumbs per item, per-item comments, a
comment box always at the bottom, export as .txt never .json, a COPY FOR
CHAT button).

PER-CLASS LAW: Paolo judges BY CLASS (rejection is per class). So the
picker shows a curated REPRESENTATIVE set — one telling sprite per class —
not all 348. A thumb on a class rules the whole class up or down; volume
is the variants that already exist in the bank. The intacts he already
blessed in chat ("Awesomeee nice"), but they ride here too so the record
is complete and per-color.

Run from repo root: python3 tools/bohemia_signal_picker_gen.py
"""
import json
import sys

BANK = 'banks/BOHEMIA_TRAFFIC_SIGNAL_CANDIDATES_7_17_26.txt'
OUT = 'tools/BOHEMIA_SIGNAL_PICKER_7_18_26.html'


def pick(sigs, **kw):
    for s in sigs:
        if all(s.get(k) == v for k, v in kw.items()):
            return s
    return None


def main():
    d = json.load(open(BANK))
    sigs = d['signals']
    items = []

    def add(key, label, sprite):
        if sprite is None:
            print('PICKER GEN WARN: no sprite for %s' % key)
            return
        items.append({'key': key, 'label': label, 'b64': sprite['b64']})

    # intact family, one per color (the approved look, per-color record)
    add('intact_galv', 'INTACT — galvanized gray (approved look)',
        pick(sigs, kind='intact', color='galv', arm='long', state='dead',
             dir='e', face='s'))
    add('intact_bronze', 'INTACT — bronze / stripped',
        pick(sigs, kind='intact', color='bronze', arm='long', state='dead',
             dir='e', face='s'))
    # a lit one so the lenses read
    add('intact_lit', 'INTACT — powered (red), lens glow',
        pick(sigs, kind='intact', color='galv', arm='long', state='red',
             dir='e', face='s'))
    # the north-face backs + a vertical (east/west) so every facing is judged
    add('face_back', 'FACE — the backs (north-facing head)',
        pick(sigs, kind='intact', color='galv', arm='long', state='dead',
             dir='e', face='n'))
    add('face_vertical', 'FACE — vertical arm (east/west approach)',
        pick(sigs, kind='intact', color='galv', arm='long', state='dead',
             dir='e', face='e', arm_dir='n'))
    # the wreck classes
    add('fallen_arm_h', 'WRECK — fallen arm (span in the road)',
        pick(sigs, kind='fallen_arm', color='galv', dir='e', arm_dir=None))
    add('fallen_arm_v', 'WRECK — fallen vertical span',
        pick(sigs, kind='fallen_arm', color='bronze', dir='e', arm_dir='s'))
    add('dropped_heads', 'WRECK — dropped heads (arm up, lights on floor)',
        pick(sigs, kind='dropped_heads', color='galv', dir='e', arm_dir='n'))
    add('jury_rigged', 'WRECK — jury-rigged splice',
        pick(sigs, kind='jury_rigged', color='bronze', dir='e'))
    add('headless', 'WRECK — headless arm (cable dangling)',
        pick(sigs, kind='headless', color='galv', dir='e'))
    add('scattered_a', 'WRECK — scattered debris (variant A)',
        pick(sigs, kind='scattered', color='galv', dir='e', variant=0,
             arm_dir=None))
    add('scattered_b', 'WRECK — scattered debris (variant B)',
        pick(sigs, kind='scattered', color='bronze', dir='e', variant=1,
             arm_dir=None))
    # the salvage props
    for sh in d.get('salvaged_heads', []):
        add('salvage_' + sh['pose'], 'SALVAGE — looted head (%s)' % sh['pose'],
            sh)

    n = len(items)
    data_json = json.dumps(items)
    html = TEMPLATE.replace('/*NITEMS*/', str(n)).replace('/*DATA*/', data_json)
    open(OUT, 'w').write(html)
    print('signal picker: %d classes -> %s' % (n, OUT))
    return 0


TEMPLATE = r"""<!DOCTYPE html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<title>BOHEMIA SIGNAL PICKER 7/18</title><style>
:root{--bg:#f4f1e8;--fg:#171310;--dim:#6a6255;--line:#c9c0ad;--card:#fffdf7;--up:#1c6b32;--dn:#a11b1b}
body.night{--bg:#12100d;--fg:#ece6d8;--dim:#8f8676;--line:#332e26;--card:#1b1813;--up:#5fd383;--dn:#ff6b6b}
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
body{margin:0;background:var(--bg);color:var(--fg);font:16px/1.5 ui-monospace,Menlo,monospace;padding-bottom:90px}
header{position:sticky;top:0;background:var(--bg);border-bottom:2px solid var(--line);padding:8px 10px;z-index:9}
h1{font-size:15px;margin:0 0 6px}
.sub{font-size:12px;color:var(--dim);margin:0 0 6px}
button{font:600 15px ui-monospace,monospace;padding:9px 12px;border:2px solid var(--line);background:var(--card);color:var(--fg);border-radius:8px;min-height:44px;margin:0 4px 4px 0}
.grid{display:flex;flex-wrap:wrap;gap:10px;padding:10px}
.it{background:var(--card);border:2px solid var(--line);border-radius:10px;padding:8px;width:184px}
.it img{width:164px;height:220px;object-fit:contain;image-rendering:pixelated;border-radius:6px;display:block;background:#3c3a36}
.it .k{font-size:11px;color:var(--dim);margin:5px 0;min-height:30px}
.vb{display:flex;gap:6px}
.vb button{flex:1;margin:0;min-height:40px;padding:6px}
.it.up{border-color:var(--up)}.it.dn{border-color:var(--dn)}
.it.up .bu{background:var(--up);color:var(--bg)}.it.dn .bd{background:var(--dn);color:var(--bg)}
.it input{width:100%;font:13px ui-monospace,monospace;margin-top:6px;padding:6px;border:1px solid var(--line);border-radius:6px;background:var(--bg);color:var(--fg)}
#final{margin:20px 10px}textarea{width:100%;height:90px;font:14px ui-monospace,monospace;background:var(--card);color:var(--fg);border:2px solid var(--line);border-radius:8px;padding:8px}
#cnt{font-size:13px;color:var(--dim)}
footer{position:fixed;bottom:0;left:0;right:0;background:var(--bg);border-top:2px solid var(--line);padding:8px 10px;display:flex;gap:8px;align-items:center}
</style></head><body>
<header>
<h1>BOHEMIA SIGNAL PICKER — the stoplight commission</h1>
<div class="sub">Thumb each CLASS up or down (rejection is per class). Volume = the variants already cooked. Comments optional. Bottom box for anything. Export drops a .txt.</div>
<button onclick="document.body.classList.toggle('night')">SUN / NIGHT</button>
<button onclick="allUp()">ALL UP</button>
<span id="cnt"></span>
</header>
<div class="grid" id="grid"></div>
<div id="final">
<div class="sub">COMMENT SECTION (always here at the bottom):</div>
<textarea id="note" placeholder="anything — a class to recolor, a wreck to cook more of, a thought"></textarea>
</div>
<footer>
<button onclick="exp()">EXPORT .txt</button>
<button onclick="copyChat()">COPY FOR CHAT</button>
<span id="msg" class="sub"></span>
</footer>
<script>
var ITEMS=/*DATA*/;var N=/*NITEMS*/;var V={};
var g=document.getElementById('grid');
ITEMS.forEach(function(it,i){
  var d=document.createElement('div');d.className='it';d.id='it'+i;
  d.innerHTML='<img src="data:image/png;base64,'+it.b64+'"><div class="k">'+it.label+'</div>'
   +'<div class="vb"><button class="bu" onclick="vote('+i+',1)">UP</button>'
   +'<button class="bd" onclick="vote('+i+',-1)">NO</button></div>'
   +'<input id="c'+i+'" placeholder="note (optional)">';
  g.appendChild(d);
});
function vote(i,v){V[i]=v;var d=document.getElementById('it'+i);
  d.classList.toggle('up',v===1);d.classList.toggle('dn',v===-1);cnt();}
function allUp(){for(var i=0;i<N;i++)vote(i,1);}
function cnt(){var u=0,n=0;for(var k in V){if(V[k]===1)u++;if(V[k]===-1)n++;}
  document.getElementById('cnt').textContent=u+' up / '+n+' no / '+N+' classes';}
function build(){
  var L=['=== BOHEMIA SIGNAL VERDICTS 7/18/26 ==='];
  for(var i=0;i<N;i++){var v=V[i];var tag=v===1?'UP':(v===-1?'NO':'—');
    var c=document.getElementById('c'+i).value.trim();
    L.push(ITEMS[i].key+': '+tag+(c?('  // '+c):''));}
  var note=document.getElementById('note').value.trim();
  if(note)L.push('','COMMENTS:',note);
  return L.join('\n');}
function exp(){var b=new Blob([build()],{type:'text/plain'});
  var a=document.createElement('a');a.href=URL.createObjectURL(b);
  a.download='BOHEMIA_SIGNAL_VERDICTS_7_18_26.txt';a.click();
  document.getElementById('msg').textContent='exported.';}
function copyChat(){navigator.clipboard.writeText(build()).then(function(){
  document.getElementById('msg').textContent='copied — paste to Claude.';});}
cnt();
</script></body></html>
"""


if __name__ == '__main__':
    sys.exit(main())
