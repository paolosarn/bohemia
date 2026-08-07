#!/usr/bin/env python3
"""
BOHEMIA - ONE TAP PER SOUND. THE REASON NOTHING GETS JUDGED IS THAT JUDGING IS WORK.

Paolo, 8/7: "honestly im lazy today".

He is not being lazy. He is looking at a queue that costs him twenty minutes and
declining to pay it, which is the correct decision. Look at what judging ONE
sound actually costs him right now:

    open the MUSIC tab -> scroll past the mixer -> scroll past the soundboard ->
    find the judge panel -> find the card for EAT (collapsed, because the panel
    folds anything finished) -> open it -> tap PLAY on candidate 1 -> listen ->
    find the thumb -> tap it -> tap PLAY on candidate 2 -> ...

Five candidates x six new moments is THIRTY of those. At roughly four taps and
a scroll each that is a couple of hundred interactions to clear one batch. So
the batch does not get cleared, and the gate reports the consequence in one
line every single run:

    judge cards collapsed: 20 of 26

TWENTY OF TWENTY-SIX MOMENTS IN THIS GAME MAKE NO SOUND. Not because the sounds
do not exist -- the factory cooks five candidates for every one of them on
demand -- but because a verdict is the only thing that can turn a candidate into
a sound, and the verdict surface is too expensive to use. Cooking a thirty-first
candidate does not fix that. It makes it worse.

=== SO THE THING TO BUILD IS NOT A SOUND, IT IS A CHEAPER VERDICT ============

SHUFFLE JUDGE. One button on the soundboard. It plays a candidate, shows two
enormous buttons, and the moment he taps either one it records the verdict and
plays the next candidate. No scrolling, no cards, no finding, no reading. He can
do it lying down with his thumb.

    tap YES  -> that IS the sound  -> next one plays
    tap NO   -> dead               -> next one plays

REUSE CHECK: this cooks NO new audio and defines NO new store. Every candidate
comes from BOH_SFX.cook via SJ.cand (the judge's own cache), every verdict is
written to SJ.V and persisted by SJ.save, and the export is SJ.exportTxt -- the
same .txt, the same share sheet, the same repo file. If he judges here and then
opens the old panel, his thumbs are already on the cards, because there is only
one set of thumbs. A second verdict store would be a way to lose his work, and
HIS VERDICTS ARE A REPO FILE, NOT A COOKIE.

=== WHY TEN, AND NOT "ALL THIRTY" ==========================================

RESEARCH (audio quality listening-test practice, MUSHRA/ODAQ and ABX method):
formal listening tests are deliberately split into SESSIONS OF ABOUT TEN TRIALS
with breaks between them, because listener fatigue past that point makes the
later verdicts worse than the earlier ones. ODAQ ran three sessions of ten and
told its listeners to take long breaks. ABX cycles typically run five to ten
comparisons.

So a round is TEN and then it STOPS and tells him he is finished. That is not a
limitation, it is the entire ergonomics: an open-ended queue is another thing he
has to decide when to quit, and a round with an end is a thing a lazy man will
actually start. If he wants more there is a GO AGAIN button, and it is his call
rather than the surface nagging him.

=== THE ORDER IS BREADTH FIRST, AND THAT IS THE HIGH-LEVERAGE PART ==========

A moment stops being silent the instant ONE of its candidates gets a thumb up.
So the queue takes candidate 1 of EVERY unjudged moment before it takes
candidate 2 of any of them. Six taps can therefore turn six silent moments into
six live ones. Judging one moment to death first would spend the same six taps
and leave five moments still silent.

GRAVEYARD IS FINAL is respected by construction: SJ.done(ev) is true when every
candidate of a moment already carries a thumb, and a done moment never enters
the queue. Nothing he already killed can come back and ask again.

=== AND IT DOES NOT TALK OVER THE SOUND IT IS ASKING HIM ABOUT ==============

Paolo, 8/4: "I CANT HEAR THE SOUNDS IF THE UI THAT PLAYS SOUNDS EVERYTIME I
CLICK A BUTTON ALSO MAKE A SOUND WHEN I CLICK PLAY ON A NEW SOUND IM TESTING".

The overlay carries data-noui, which the parent's UI-tap listener already treats
as "this click IS a sound already" and skips. That attribute is the existing
contract rather than a new special case, so a UI click sound can never land on
top of a candidate he is trying to hear. The gate asserts it, because that
complaint has been earned once and does not need earning twice.

INJECTION: a self-contained block with its own mount interval. It never edits
the soundboard's builder, so the mix patch re-running cannot destroy it and this
tool does not become a second owner of somebody else's seam -- a bug this lane
has already shipped once.
"""
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')

BEGIN = '<!-- BOHEMIA SFX SHUFFLE JUDGE (8/7/26) -->'
END = '<!-- /BOHEMIA SFX SHUFFLE JUDGE -->'

BLOCK = r'''
<style id="shufCSS">
#shufGo{display:block;width:100%;margin:0 0 10px 0;padding:12px 10px;cursor:pointer;
 border:1px solid #6a5a2e;border-radius:10px;background:#2a2414;color:#ffd98a;
 font:800 13px ui-monospace,monospace;letter-spacing:1.5px;text-align:center}
#shufGo span{display:block;margin-top:4px;font:600 10px ui-monospace,monospace;
 letter-spacing:.5px;color:#b6a271}
#shufGo[disabled]{opacity:.5;cursor:default;border-color:#3a3350;background:#1a1726;color:#8a7f9a}
#shufWrap{position:fixed;inset:0;z-index:99999;background:#0b0910;display:flex;
 flex-direction:column;align-items:stretch;justify-content:space-between;
 padding:18px 16px calc(18px + env(safe-area-inset-bottom,0px)) 16px;
 font:600 14px ui-monospace,monospace;color:#efe6d2}
#shufWrap .shTop{display:flex;justify-content:space-between;align-items:center;
 font:700 11px ui-monospace,monospace;letter-spacing:2px;color:#8a7f9a}
#shufWrap .shX{background:none;border:none;color:#8a7f9a;font:800 20px ui-monospace,monospace;
 padding:4px 10px;cursor:pointer}
#shufWrap .shMid{flex:1;display:flex;flex-direction:column;align-items:center;
 justify-content:center;text-align:center;gap:10px}
#shufWrap .shName{font:900 30px ui-monospace,monospace;letter-spacing:2px;color:#ffd98a;
 line-height:1.15}
#shufWrap .shWhy{font:600 12px ui-monospace,monospace;color:#b6a271;max-width:300px;line-height:1.5}
#shufWrap .shWhich{font:700 11px ui-monospace,monospace;letter-spacing:2px;color:#7f93a8}
#shufWrap .shAgain{margin-top:6px;padding:12px 26px;border:1px solid #4a5a6a;border-radius:10px;
 background:#151b22;color:#bcd2e6;font:800 12px ui-monospace,monospace;letter-spacing:2px;cursor:pointer}
#shufWrap .shBot{display:flex;gap:12px}
#shufWrap .shBig{flex:1;padding:26px 0;border-radius:14px;border:2px solid;
 font:900 15px ui-monospace,monospace;letter-spacing:2px;cursor:pointer}
#shufWrap .shNo{border-color:#7a2f2f;background:#241012;color:#ff9a9a}
#shufWrap .shYes{border-color:#2f7a45;background:#0f2416;color:#8ef0ae}
#shufWrap .shEmoji{display:block;font-size:26px;margin-bottom:6px}
#shufWrap .shSkip{margin-top:10px;width:100%;padding:10px;border:1px solid #3a3350;border-radius:9px;
 background:transparent;color:#8a7f9a;font:700 10.5px ui-monospace,monospace;letter-spacing:1.5px;cursor:pointer}
#shufWrap .shDoneT{font:900 26px ui-monospace,monospace;letter-spacing:2px;color:#ffd98a}
#shufWrap .shLive{font:700 12px ui-monospace,monospace;color:#8ef0ae;line-height:1.7}
#shufWrap .shOut{width:100%;margin-top:10px;padding:16px;border-radius:12px;
 border:1px solid #6a5a2e;background:#2a2414;color:#ffd98a;
 font:800 12px ui-monospace,monospace;letter-spacing:2px;cursor:pointer}
#shufWrap.sun{background:#f4eee0;color:#241f16}
#shufWrap.sun .shName{color:#5a3d00}
#shufWrap.sun .shWhy{color:#5c5140}
#shufWrap.sun .shDoneT{color:#5a3d00}
</style>
<script>
/* ONE TAP PER SOUND (8/7/26).
   The bottleneck in this lane was never the cooking. It was that a verdict cost
   him a couple of hundred interactions per batch, so batches did not get judged,
   so twenty-six game moments sat at twenty silent. This is the cheap door onto
   the SAME thumbs: SJ.V is the store, SJ.save persists, SJ.exportTxt exports.
   Nothing here is a second source of truth. */
(function(){
 var ROUND = 10;      /* listening-test practice: sessions of ~10, then a break */
 var Q = [], IDX = 0, UPS = 0, DNS = 0, WRAP = null, BEFORE = {};

 function J(){ return window.BOH_SFX_JUDGE; }
 function ready(){
  try{ return !!(J() && typeof BOH_SFX!=='undefined' && BOH_SFX.EVENTS && typeof MUS!=='undefined'); }
  catch(e){ return false; }
 }
 function labelOf(E){ return (E.label||E.ev||'').toString().toUpperCase(); }

 /* THE QUEUE, BREADTH FIRST.
    A moment goes live the moment ONE candidate gets a thumb up, so candidate 1
    of every unjudged moment comes before candidate 2 of any of them. Six taps
    can retire six silences; six taps spent finishing one moment retires one. */
 function buildQueue(){
  var j = J(); if(!j) return [];
  var fams = [];
  try{
   BOH_SFX.EVENTS.forEach(function(E){
    var ev = E.ev;
    /* GRAVEYARD IS FINAL: done means every candidate already carries a thumb,
       including the moments where all five went down. Never ask again. */
    if(j.done(ev)) return;
    var all = j.cand(ev); if(!all || !all.length) return;
    var un = [];
    for(var i=0;i<all.length;i++) if(!j.V[all[i].id]) un.push(all[i]);
    if(un.length) fams.push({ ev:ev, label:labelOf(E), why:(E.why||''), all:all, un:un });
   });
  }catch(e){}
  var q = [], depth = 0, more = true;
  while(more){
   more = false;
   for(var f=0; f<fams.length; f++){
    var F = fams[f];
    if(depth < F.un.length){
     more = true;
     var v = F.un[depth];
     q.push({ ev:F.ev, label:F.label, why:F.why, v:v,
              n:(F.all.indexOf(v)+1), of:F.all.length });
    }
   }
   depth++;
  }
  return q;
 }
 window.__shufQueue = buildQueue;      /* the gate reads the real queue, not a copy */

 function upsOf(ev){ try{ return J().ups(ev); }catch(e){ return 0; } }

 function el(tag, cls, txt){
  var e = document.createElement(tag);
  if(cls) e.className = cls;
  if(txt != null) e.textContent = txt;
  return e;
 }

 function close(){
  if(WRAP && WRAP.parentNode) WRAP.parentNode.removeChild(WRAP);
  WRAP = null;
  /* drop the launcher so the mount interval rebuilds it with a fresh count */
  var g = document.getElementById('shufGo');
  if(g && g.parentNode) g.parentNode.removeChild(g);
 }

 function play(){
  var it = Q[IDX]; if(!it) return;
  try{ J().hear(it.v); }catch(e){}
 }

 function vote(val){
  var it = Q[IDX]; if(!it) return;
  if(val){
   try{ J().V[it.v.id] = val; J().save(); }catch(e){}
   if(val === 1) UPS++; else DNS++;
  }
  IDX++;
  paint();
 }

 function paint(){
  if(!WRAP) return;
  WRAP.innerHTML = '';
  try{ if(J().sun) WRAP.classList.add('sun'); else WRAP.classList.remove('sun'); }catch(e){}

  var lim = Math.min(ROUND, Q.length);
  var top = el('div','shTop');
  var x = el('button','shX','×');
  x.addEventListener('click', close);

  if(IDX >= lim){
   /* ---- THE ROUND IS OVER AND IT SAYS SO. He is finished, on purpose. ---- */
   top.appendChild(el('span', null, 'ROUND DONE'));
   top.appendChild(x);
   WRAP.appendChild(top);

   var mid = el('div','shMid');
   mid.appendChild(el('div','shDoneT','THAT IS THE ROUND'));
   mid.appendChild(el('div','shWhy', UPS + ' kept, ' + DNS + ' killed.'));

   /* which moments stopped being silent because of the taps he just made */
   var live = [];
   for(var k in BEFORE){ if(!BEFORE[k] && upsOf(k) > 0) live.push(k); }
   if(live.length){
    var names = {};
    try{ BOH_SFX.EVENTS.forEach(function(E){ names[E.ev] = labelOf(E); }); }catch(e){}
    var box = el('div','shLive');
    box.textContent = live.length + (live.length===1?' moment':' moments')
      + ' in the game just got a sound:';
    mid.appendChild(box);
    var l2 = el('div','shLive');
    l2.textContent = live.map(function(e){ return names[e] || e; }).join('  ·  ');
    mid.appendChild(l2);
   }

   var left = buildQueue().length;
   if(left){
    var again = el('button','shAgain', 'GO AGAIN · ' + left + ' LEFT');
    again.addEventListener('click', function(){ start(); });
    mid.appendChild(again);
   } else {
    mid.appendChild(el('div','shLive','Nothing left to judge. Every candidate has a thumb.'));
   }
   WRAP.appendChild(mid);

   var out = el('button','shOut','SEND ME THE FILE');
   out.addEventListener('click', function(){
    close();
    try{ J().exportTxt(); }catch(e){}
   });
   WRAP.appendChild(out);
   return;
  }

  var it = Q[IDX];
  top.appendChild(el('span', null, (IDX+1) + ' OF ' + lim));
  top.appendChild(x);
  WRAP.appendChild(top);

  var mid = el('div','shMid');
  mid.appendChild(el('div','shName', it.label));
  if(it.why) mid.appendChild(el('div','shWhy', it.why));
  mid.appendChild(el('div','shWhich', 'SOUND ' + it.n + ' OF ' + it.of));
  var again = el('button','shAgain','PLAY IT AGAIN');
  again.addEventListener('click', play);
  mid.appendChild(again);
  WRAP.appendChild(mid);

  var bot = el('div','shBot');
  var no = el('button','shBig shNo');
  no.innerHTML = '<span class="shEmoji">👎</span>NO';
  no.addEventListener('click', function(){ vote(-1); });
  var yes = el('button','shBig shYes');
  yes.innerHTML = '<span class="shEmoji">👍</span>YES';
  yes.addEventListener('click', function(){ vote(1); });
  bot.appendChild(no); bot.appendChild(yes);

  var foot = el('div');
  foot.appendChild(bot);
  var skip = el('button','shSkip','NOT SURE · SKIP IT');
  skip.addEventListener('click', function(){ vote(0); });
  foot.appendChild(skip);
  WRAP.appendChild(foot);

  /* the sound lands just after the card, so the tap that got him here is over */
  setTimeout(play, 260);
 }

 function start(){
  if(!ready()) return;
  Q = buildQueue(); IDX = 0; UPS = 0; DNS = 0;
  BEFORE = {};
  var seen = {};
  for(var i=0;i<Q.length;i++){ if(!seen[Q[i].ev]){ seen[Q[i].ev]=1; BEFORE[Q[i].ev] = upsOf(Q[i].ev); } }
  if(!WRAP){
   WRAP = document.createElement('div');
   WRAP.id = 'shufWrap';
   /* THE UI MUST NOT TALK OVER THE SOUND IT IS ASKING ABOUT (Paolo 8/4).
      data-noui is the parent's existing contract for "this click IS a sound
      already", so no click tone can ever land on top of a candidate. */
   WRAP.setAttribute('data-noui','1');
   document.body.appendChild(WRAP);
  }
  paint();
 }
 window.__shufStart = start;
 window.__shufState = function(){
  return { open: !!WRAP, idx: IDX, round: ROUND, len: Q.length,
           ups: UPS, dns: DNS, at: (Q[IDX] ? Q[IDX].v.id : null) };
 };

 /* THE LAUNCHER LIVES ON THE SOUNDBOARD and is rebuilt by interval rather than
    by editing the board's builder. The mix patch owns that builder; taking a
    second ownership of somebody else's seam is a bug this lane already shipped
    once, and an interval cannot be destroyed by their rebuild. */
 function mount(){
  var b = document.getElementById('sbWrap'); if(!b) return;
  if(document.getElementById('shufGo')) return;
  if(!ready()) return;
  var n = buildQueue().length;
  var go = document.createElement('button');
  go.id = 'shufGo';
  if(!n){
   go.textContent = 'EVERY SOUND IS JUDGED';
   go.disabled = true;
  } else {
   go.innerHTML = 'JUDGE ' + Math.min(ROUND, n) + ' SOUNDS'
     + '<span>' + n + ' waiting · one tap each · about a minute</span>';
   go.addEventListener('click', start);
  }
  var h = b.querySelector('h4');
  if(h && h.nextSibling) b.insertBefore(go, h.nextSibling);
  else b.insertBefore(go, b.firstChild);
 }
 setInterval(mount, 1200);
})();
</script>
'''


def main():
    if not os.path.exists(ALPHA):
        print('FAIL: no alpha at %s' % ALPHA)
        return 1
    s = open(ALPHA, encoding='utf8').read()

    # IDEMPOTENT BY REPLACEMENT, NEVER BY REFUSAL. A tool that refuses to run
    # twice cannot be re-run after the block it owns needs to change, and this
    # lane has lost a fix that way before.
    if BEGIN in s:
        i = s.index(BEGIN)
        j = s.index(END) + len(END)
        if s[j:j + 1] == '\n':
            j += 1
        s = s[:i] + s[j:]
        print('  previous shuffle block removed (idempotent re-inject)')

    anchor = '<!-- BOHEMIA SFX FACTORY MOUNT (7/29/26) -->'
    if anchor not in s:
        print('FAIL: cannot find the SFX factory mount to sit next to')
        return 1
    s = s.replace(anchor, BEGIN + BLOCK + END + '\n' + anchor, 1)

    open(ALPHA, 'w', encoding='utf8').write(s)
    print('ONE TAP PER SOUND.')
    print('  MUSIC tab -> the soundboard -> JUDGE 10 SOUNDS')
    print('  breadth first, so the earliest taps retire the most silence')
    print('  same SJ.V store, same .txt export: no second set of thumbs')
    return 0


if __name__ == '__main__':
    sys.exit(main())
