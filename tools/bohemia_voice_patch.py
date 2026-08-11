#!/usr/bin/env python3
"""
BOHEMIA - SQUIGGLE VOICES, AND THE PAGE THAT JUDGES THEM BY EAR (8/9/26)

Paolo ruled it 8/4 and made it the SOUNDS lane's top demo priority on 8/9:
"squiggle voices (0v, top)". The demo plan's reason is one line and it is the
whole brief: "dialogue that makes sound reads alive; silent portraits read dead."

WHAT THIS SHIPS
  1. engine/bohemia_voice.js inlined verbatim into the ONE alpha, so a voice is
     available anywhere the alpha is -- the same way the SFX engine ships.
  2. A VOICES judge in the MUSIC tab: eight candidate voices, one shared line at
     a time, tap to hear, thumb, comment, export .txt.

WHY EIGHT VOICES SPEAKING THE SAME LINE, AND NOT EIGHT LINES
Hold the variable you are not testing. This lane has already been burned twice
by not doing that: a ducking measurement that tapped an additive bus and "proved"
nothing, and a room-acoustics test driven through playSFX whose random candidate
choice swamped the effect and reported open desert as the loudest space in the
game. He is judging VOICES, so the line is constant and only the voice moves.
The three lines are shapes, not content: a short statement, a long one, and a
question -- because the question is the only one that exercises the rising
contour, and a voice that sounds right saying four words can still fall apart
over twenty.

REUSE CHECK: no graphic pixels are cooked here at all, so no banks/ art bank
applies and none was opened. What it DOES reuse, in code and not in claim: the
MUSIC studio's single AudioContext and its brickwall limiter (MUS.audio / MUS.AC),
the SFX output bus (window.__SFXBUS, so the EFFECTS slider already governs
voices and no fourth bus appears), the alpha's existing export modal
(G._expName / expText / expStat / exportModal, so a voice verdict lands as the
same .txt through the same share sheet as every music and SFX verdict), and the
data-noui contract so the UI click tone cannot land on top of the voice he is
listening to. It creates no context, no bus, no second exporter and no second
verdict store.

MECHANISM-MINE / CONTENTS-PAOLO'S: this assigns NO voice to any character. It
cooks candidates and asks. Which voice belongs to the father, the mother, the
brother, the sister or anyone else is his ruling, and the bank stays empty until
he thumbs one.

SCREECH LAW: the engine contains no delay, no convolver and no feedback path.
Verified by gate, not by claim.

Idempotent by REPLACEMENT, never by refusal.

  python3 tools/bohemia_voice_patch.py
"""
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')
ENGINE = os.path.join(ROOT, 'engine', 'bohemia_voice.js')

BEGIN = '<!-- BOHEMIA SQUIGGLE VOICES (8/9/26) -->'
END = '<!-- /BOHEMIA SQUIGGLE VOICES -->'

PANEL = r'''
<style id="vxCSS">
#vxWrap{margin:0 0 10px 0;padding:10px 12px;border:1px solid #3a3350;border-radius:10px;
 background:#141020}
#vxWrap h4{margin:0 0 4px 0;font:800 10.5px ui-monospace,monospace;letter-spacing:2px;
 color:#c9b6ff;text-align:center}
#vxWrap .vxNote{font:600 9.5px ui-monospace,monospace;color:#8a7f9a;text-align:center;
 line-height:1.5;margin:0 0 8px 0}
#vxWrap .vxLines{display:flex;gap:6px;margin:0 0 9px 0}
#vxWrap .vxLine{flex:1;padding:7px 4px;border:1px solid #3a3350;border-radius:8px;
 background:#1a1626;color:#8a7f9a;font:700 9px ui-monospace,monospace;letter-spacing:1px;
 cursor:pointer;text-align:center}
#vxWrap .vxLine.on{border-color:#c9b6ff;color:#c9b6ff;background:#221a38}
#vxWrap .vxRow{display:flex;align-items:center;gap:6px;margin:0 0 6px 0}
#vxWrap .vxPlay{flex:1;padding:11px 8px;border:1px solid #4a4060;border-radius:9px;
 background:#1d1830;color:#efe6d2;font:800 11px ui-monospace,monospace;letter-spacing:1px;
 cursor:pointer;text-align:left}
#vxWrap .vxPlay b{color:#c9b6ff}
#vxWrap .vxPlay span{display:block;margin-top:3px;font:600 8.5px ui-monospace,monospace;
 color:#7a7090;letter-spacing:0}
#vxWrap .vxPlay.hot{background:#2c2448}
#vxWrap .vxUp,#vxWrap .vxDn{width:44px;padding:11px 0;border-radius:9px;cursor:pointer;
 font-size:16px;border:1px solid #3a3350;background:#1a1626}
#vxWrap .vxUp.on{border-color:#2f7a45;background:#0f2416}
#vxWrap .vxDn.on{border-color:#7a2f2f;background:#241012}
#vxWrap .vxCmt{width:100%;box-sizing:border-box;margin:0 0 10px 0;padding:7px;
 border:1px solid #3a3350;border-radius:8px;background:#100d1a;color:#cfc3a8;
 font:600 10px ui-monospace,monospace}
#vxWrap .vxOut{width:100%;padding:12px;border:1px solid #6a5a2e;border-radius:10px;
 background:#2a2414;color:#ffd98a;font:800 11px ui-monospace,monospace;letter-spacing:2px;
 cursor:pointer}
</style>
<script>
/* SQUIGGLE VOICES, JUDGED BY EAR (8/9/26).
   The engine is inlined above this block. Everything here is surface: it cooks
   no sound of its own, it only asks BOH_VOICE to speak and records the thumb. */
(function(){
 'use strict';
 var N_VOICES = 8;
 /* SHAPES, NOT CONTENT. The text only drives the babble's rhythm and contour,
    so these are deliberately plain: none of them asserts a line of canon, which
    is not mine to write. The question is here because it is the only one that
    exercises the rising end-of-sentence contour. */
 var LINES = [
   ['SHORT',    "I already told you no."],
   ['LONG',     "You want to come in here and act like the last three months never happened, and I am supposed to just let that go."],
   ['QUESTION', "Are you going to pay me or not?"]
 ];
 var LINE = 0;
 var V = {}, C = {};                       /* his thumbs and his notes */
 var NOTE = '';
 /* HIS VERDICTS ARE A REPO FILE, NOT A COOKIE (Paolo 8/1: "I can't be judging
    shit and then you pretend that I didn't"). SETTLED is baked in at build time
    from banks/BOHEMIA_VOICES_APPROVED_*.json -- his committed thumbs -- so a
    cleared cache or a second device falls back to what he already decided
    instead of asking him again. localStorage only holds CHANGES on top. */
 var SETTLED = __VOICE_SETTLED__;
 try{ window.__VOICES_APPROVED = Object.keys(SETTLED).filter(function(k){ return SETTLED[k]===1; }); }catch(e){}

 function load(){
  var k; for(k in SETTLED) V[k]=SETTLED[k];
  try{ var d=JSON.parse(localStorage.getItem('bohemia_voices')||'null');
       if(d){ if(d.V) for(k in d.V) V[k]=d.V[k];    /* he may change his mind */
              C=d.C||{}; NOTE=d.note||''; } }catch(e){}
 }
 function save(){
  try{ localStorage.setItem('bohemia_voices',JSON.stringify({V:V,C:C,note:NOTE})); }catch(e){}
 }

 function bus(){
  try{
   if(typeof MUS==='undefined') return null;
   MUS.audio(); if(!MUS.AC) return null;
   /* THE EFFECTS SLIDER ALREADY OWNS THIS. Routing voices anywhere else would
      mean a fourth thing a volume knob has to know about, which is the exact
      drift the one-bus rule was written to stop. And never MUS.MAST: that is
      the MUSIC master and MUS.stop() ducks it to zero. */
   return window.__SFXBUS || MUS.OUT || MUS.MAST || MUS.AC.destination;
  }catch(e){ return null; }
 }

 function speak(v){
  try{
   var d=bus(); if(!d||typeof BOH_VOICE==='undefined') return null;
   return BOH_VOICE.say(LINES[LINE][1], v, MUS.AC, d, null);
  }catch(e){ return null; }
 }
 window.__vxSpeak = speak;
 window.__vxLine = function(i){ if(i!=null) LINE=i; return LINE; };
 window.__vxVerdicts = function(){ return V; };

 function el(t,c,x){ var e=document.createElement(t); if(c)e.className=c;
   if(x!=null)e.textContent=x; return e; }

 function build(){
  var w=document.createElement('div'); w.id='vxWrap';
  /* the UI must not click over the voice it is asking him about (Paolo 8/4) */
  w.setAttribute('data-noui','1');
  w.appendChild(el('h4',null,'SQUIGGLE VOICES'));
  var n=el('div','vxNote');
  n.textContent='Eight candidate voices, all saying the SAME line so you are '
    +'judging the voice and not the sentence. Nothing here is assigned to '
    +'anybody yet.';
  w.appendChild(n);

  var lw=el('div','vxLines');
  LINES.forEach(function(L,i){
   var b=el('div','vxLine'+(i===LINE?' on':''),L[0]);
   b.addEventListener('click',function(){
    LINE=i;
    [].forEach.call(lw.children,function(c,j){ c.className='vxLine'+(j===i?' on':''); });
   });
   lw.appendChild(b);
  });
  w.appendChild(lw);

  var voices = BOH_VOICE.cook(N_VOICES);
  voices.forEach(function(v,i){
   var row=el('div','vxRow');
   var p=el('button','vxPlay');
   p.innerHTML='<b>VOICE '+(i+1)+'</b><span>'+BOH_VOICE.serialize(v)+'</span>';
   p.addEventListener('click',function(){
    speak(v);
    p.classList.add('hot'); setTimeout(function(){ p.classList.remove('hot'); },260);
   });
   var up=el('button','vxUp'+(V[v.seed]===1?' on':'')); up.innerHTML='&#128077;';
   var dn=el('button','vxDn'+(V[v.seed]===-1?' on':'')); dn.innerHTML='&#128078;';
   function paint(){
    up.className='vxUp'+(V[v.seed]===1?' on':'');
    dn.className='vxDn'+(V[v.seed]===-1?' on':'');
   }
   up.addEventListener('click',function(){ V[v.seed]=(V[v.seed]===1)?0:1; save(); paint(); });
   dn.addEventListener('click',function(){ V[v.seed]=(V[v.seed]===-1)?0:-1; save(); paint(); });
   row.appendChild(p); row.appendChild(dn); row.appendChild(up);
   w.appendChild(row);

   var c=document.createElement('input');
   c.className='vxCmt'; c.type='text'; c.placeholder='note on voice '+(i+1);
   c.value=C[v.seed]||'';
   c.addEventListener('input',function(){ C[v.seed]=c.value; save(); });
   w.appendChild(c);
  });

  /* THE COMMENT SECTION AT THE BOTTOM, ALWAYS (verdict workflow law) */
  var big=document.createElement('input');
  big.className='vxCmt'; big.type='text'; big.id='vxNote';
  big.placeholder='ANYTHING ELSE ABOUT THE VOICES (rides the export)';
  big.value=NOTE;
  big.addEventListener('input',function(){ NOTE=big.value; save(); });
  w.appendChild(big);

  var ex=el('button','vxOut','SEND ME THE FILE');
  ex.addEventListener('click',function(){ exportTxt(voices); });
  w.appendChild(ex);
  return w;
 }

 function exportTxt(voices){
  var L=['=== BOHEMIA SQUIGGLE VOICE VERDICTS ==='];
  L.push('BATCH VOICE-01 (8/9/26) - '+voices.length+' candidate voices');
  L.push('UP = this is a voice a person in this game has. DOWN = dead.');
  L.push('The line judged last: '+LINES[LINE][0]);
  L.push('');
  voices.forEach(function(v,i){
   var m=V[v.seed]===1?'UP  ':(V[v.seed]===-1?'DOWN':'--  ');
   L.push(m+' VOICE '+(i+1)+'   seed='+v.seed);
   L.push('     '+BOH_VOICE.serialize(v));
   if(C[v.seed]) L.push('     "'+C[v.seed]+'"');
  });
  L.push('');
  L.push('NOTE: '+(NOTE||'(none)'));
  var t=L.join('\n');
  /* COMMENTS CLEAR ON EXPORT (Paolo 7/19): once they ride an export they are
     delivered, and the repo is the memory rather than the box. */
  NOTE=''; var nb=document.getElementById('vxNote'); if(nb)nb.value=''; save();
  try{ G._expName='bohemia_voices.txt'; }catch(e){}
  document.getElementById('expText').value=t;
  document.getElementById('expStat').textContent='VOICE EXPORT: SHARE FILE into the chat';
  document.getElementById('exportModal').style.display='block';
 }

 function mount(){
  var P=document.getElementById('p-music'); if(!P) return;
  if(document.getElementById('vxWrap')) return;
  if(typeof BOH_VOICE==='undefined') return;
  load();
  /* above the SFX judge, below the soundboard: voices are the newest thing to
     rule on and the top of the tab is where he actually looks */
  var sb=document.getElementById('sbWrap');
  var w=build();
  if(sb && sb.parentNode) sb.parentNode.insertBefore(w, sb.nextSibling);
  else P.insertBefore(w, P.firstChild);
 }
 setInterval(mount, 1300);
})();
</script>
'''


def main():
    if not os.path.exists(ALPHA):
        print('FAIL: no alpha at %s' % ALPHA)
        return 1
    if not os.path.exists(ENGINE):
        print('FAIL: no voice engine at %s' % ENGINE)
        return 1
    engine = open(ENGINE, encoding='utf8').read()
    s = open(ALPHA, encoding='utf8').read()

    # HIS COMMITTED THUMBS, baked into the surface so the judge opens showing
    # what he already ruled rather than asking twice.
    settled = {}
    vb = os.path.join(ROOT, 'banks', 'BOHEMIA_VOICES_APPROVED_8_11_26.json')
    if os.path.exists(vb):
        d = json.load(open(vb, encoding='utf8'))
        for k in d.get('approved', []):
            settled[k] = 1
        for k in d.get('killed', []):
            settled[k] = -1
    panel = PANEL.replace('__VOICE_SETTLED__', json.dumps(settled, sort_keys=True))
    print('  thumbs: %d committed voice verdicts baked in' % len(settled))

    if BEGIN in s:
        i = s.index(BEGIN)
        j = s.index(END) + len(END)
        if s[j:j + 1] == '\n':
            j += 1
        s = s[:i] + s[j:]
        print('  previous voice block removed (idempotent re-inject)')

    anchor = '<!-- BOHEMIA SFX FACTORY MOUNT (7/29/26) -->'
    if anchor not in s:
        print('FAIL: cannot find the SFX factory mount to sit next to')
        return 1

    block = (BEGIN + '\n<script>\n/* engine/bohemia_voice.js, inlined verbatim */\n'
             + engine + '\n</script>\n' + panel + END + '\n')
    s = s.replace(anchor, block + anchor, 1)

    open(ALPHA, 'w', encoding='utf8').write(s)
    print('SQUIGGLE VOICES ARE IN THE MUSIC TAB.')
    print('  formant synthesis, Peterson & Barney vowels, seeded per character')
    print('  8 candidates, one shared line at a time, thumb + note + .txt export')
    print('  no samples, no second bus, no second exporter, nothing assigned')
    return 0


if __name__ == '__main__':
    sys.exit(main())
