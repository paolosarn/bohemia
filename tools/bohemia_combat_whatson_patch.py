#!/usr/bin/env python3
"""BOHEMIA - COMBAT v84b: WHAT'S ON SCREEN. The instrument, so I stop guessing.

Paolo, three times now: "the brown box is absolutely still there and the dead
shot dial orange part is still there like what's wrong with you bro."

He is right three times. I have shipped three fixes for a thing I could not see,
and every one of them was a guess dressed as a diagnosis. The problem is not that
I need a better theory. THE PROBLEM IS THAT I CANNOT SEE HIS SCREEN.

So this turn builds the instrument instead of a fourth theory.

--- WHAT IT DOES ----------------------------------------------------------
A button in settings: WHAT'S ON SCREEN?

Tap it, then get a kill. At the exact moment the world freezes, the game records
EVERY draw covering more than 2% of the canvas -- the colour, the size, and what
kind of draw it was -- and prints the list into the combat log, biggest first.

He taps once, screenshots the log or hits COPY, sends it, and the brown box is
NAMED instead of guessed at. Same for the orange. Same for every future "what is
that thing on my screen", which on a 33MB single-file build is otherwise a
research project every single time.

--- WHY THIS AND NOT ANOTHER FIX ------------------------------------------
The kill cinematic cannot be driven in the headless harness (fireNow needs the
needle dead-centre; forcing startKillshot and then freezing to photograph it stops
the very cinematic being photographed -- my own instrument was breaking itself).
Every fix I shipped for this was therefore reasoning about code I never watched
run. The way out is not a smarter guess, it is a readout from HIS device, which is
the only place the bug has ever actually been observed.

VERIFY ON THE REAL SURFACE says a side-door probe is a lie. This is the opposite
of a side door: it reports from the real surface, on his phone, in his fight.

It is OFF by default, costs nothing when off, and only ever writes text.

REUSE CHECK: no art or audio assets are cooked, read or written. This wraps two
existing canvas methods behind a flag and prints to the existing combat log.

Every replacement asserts its anchor exists EXACTLY ONCE. Idempotent.

Usage: python3 tools/bohemia_combat_whatson_patch.py
Gate:  node gates/combat_lab_gate.js   (section 19)
"""
import base64, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')
MARK = "V84B WHAT'S ON SCREEN"


def sub1(src, old, new, tag):
    n = src.count(old)
    if n != 1:
        sys.exit('FAIL anchor [%s]: found %d times (want 1)' % (tag, n))
    return src.replace(old, new, 1)


CORE = r"""/* ===== V84B WHAT'S ON SCREEN =========================================
   Paolo, three times: "the brown box is absolutely still there." He is right
   three times, and the reason is that I have been fixing a thing I cannot see.
   The kill cinematic will not drive in the headless harness, so every fix was
   reasoning about code that was never watched running.
   THIS IS THE INSTRUMENT INSTEAD OF A FOURTH THEORY. Arm it, get a kill, and at
   the instant the world freezes the game records every draw covering more than
   2% of the canvas -- colour, size, kind -- and prints them into the combat log,
   biggest first. He taps COPY and the brown box is NAMED, not guessed at.
   Off by default. Costs nothing when off. Only ever writes text. */
var BohemiaWhatsOn=(function(){
  var armed=false, rows=[], done=false;
  function arm(){ armed=true; rows=[]; done=false; }
  function isArmed(){ return armed && !done; }
  function note(kind,w,h,style,area,screen){
    if(!armed||done)return;
    if(!(area>screen*0.02))return;              /* only things that actually cover the screen */
    rows.push({k:kind,w:Math.round(w),h:Math.round(h),s:String(style).slice(0,22),
               pct:Math.round(1000*area/screen)/10});
  }
  /* one line per DISTINCT thing, biggest first, counted -- a hundred identical
     fills are one finding, not a hundred lines he has to scroll past. */
  function report(){
    var m={};
    for(var i=0;i<rows.length;i++){ var r=rows[i];
      var key=r.k+' '+r.s+' '+r.w+'x'+r.h+' ('+r.pct+'% of screen)';
      /* keep pct as a NUMBER on the record. Parsing it back out of the string
         broke the sort, because 'rgba(184,...' has an earlier paren than the
         percentage does -- it was sorting on 184. */
      if(!m[key])m[key]={n:0,pct:r.pct};
      m[key].n++; }
    var out=[]; for(var k in m)out.push({k:k,n:m[k].n,pct:m[k].pct});
    out.sort(function(a,b){ return b.pct-a.pct; });
    return out.slice(0,12).map(function(o){ return 'x'+o.n+'  '+o.k; });
  }
  function finish(){ done=true; armed=false; return report(); }
  function count(){ return rows.length; }
  return { arm:arm, isArmed:isArmed, note:note, report:report, finish:finish, count:count }; })();
if(typeof module!=='undefined'&&module.exports)module.exports=BohemiaWhatsOn;
/* ===== V84B WHATS-ON CORE END ===== */
/* the hook: two canvas methods, only while ARMED and only during a freeze. */
function whatsOnHook(){
  if(whatsOnHook._on)return; whatsOnHook._on=true;
  try{
    var P=CanvasRenderingContext2D.prototype, oFR=P.fillRect, oDI=P.drawImage;
    P.fillRect=function(x,y,w,h){
      try{ if(BohemiaWhatsOn.isArmed()&&G._freezeT>0&&this.canvas&&this.canvas.id==='cv')
        BohemiaWhatsOn.note('fill',w,h,this.fillStyle,Math.abs(w*h),this.canvas.width*this.canvas.height); }catch(_e){}
      return oFR.call(this,x,y,w,h); };
    P.drawImage=function(){ var a=arguments;
      try{ var w=a.length>=9?a[7]:a[3], h=a.length>=9?a[8]:a[4];
        if(BohemiaWhatsOn.isArmed()&&G._freezeT>0&&w&&h&&this.canvas&&this.canvas.id==='cv')
          BohemiaWhatsOn.note('image',w,h,(a[0]&&(a[0].id||a[0].nodeName))||'sprite',Math.abs(w*h),this.canvas.width*this.canvas.height); }catch(_e){}
      return oDI.apply(this,a); };
  }catch(_e){}
}
"""


def patch(demo):
    if MARK in demo:
        print('  demo: already patched, skipping')
        return demo

    demo = sub1(demo, 'function hurtFlash(){', CORE + 'function hurtFlash(){', 'whats-on core')

    # dump the report the moment the freeze ends
    demo = sub1(demo,
        "  else { G._freezeClock=null; if(G._shk)G._shk=null; }",
        "  else { G._freezeClock=null; if(G._shk)G._shk=null;\n"
        "    /* V84B: the freeze just ended -- if the capture was armed, name what was\n"
        "       on screen during it, in the log, biggest first. */\n"
        "    if(BohemiaWhatsOn.isArmed()&&BohemiaWhatsOn.count()>0){\n"
        "      try{ const _r=BohemiaWhatsOn.finish();\n"
        "        /* straight into the comment box, which already has a COPY button\n"
        "           sitting next to it -- one tap and he can paste it to me. */\n"
        "        const _in=D('lcinput');\n"
        "        if(_in)_in.value='ON SCREEN AT THE PAUSE: '+_r.join('  ||  ');\n"
        "        setRead('CAPTURED - HIT COPY',_r.length+' things named, top of screen','#8fd0e8');\n"
        "      }catch(_e){} } }",
        'dump the report')

    # the button, next to the other debug controls
    demo = sub1(demo,
        '<button id="pulsebtn" style="border-color:#8fe89a;color:#cfe8c0">PULSE: AUTO</button></div>',
        '<button id="pulsebtn" style="border-color:#8fe89a;color:#cfe8c0">PULSE: AUTO</button>'
        '<button id="whatson" style="border-color:#8fd0e8;color:#8fd0e8">WHAT\'S ON SCREEN?</button></div>',
        'whats-on button')

    demo = sub1(demo,
        "  const pb=D('pulsebtn'); if(pb)pb.addEventListener('click',()=>{ audio();",
        "  /* V84B: arm the capture, then get a kill. The next freeze names itself. */\n"
        "  const wo=D('whatson'); if(wo)wo.addEventListener('click',()=>{ whatsOnHook(); BohemiaWhatsOn.arm();\n"
        "    setRead('ARMED - NOW GET A KILL','the next pause will list what is covering the screen','#8fd0e8'); });\n"
        "  const pb=D('pulsebtn'); if(pb)pb.addEventListener('click',()=>{ audio();",
        'whats-on wiring')

    return demo


def main():
    src = open(ALPHA, encoding='utf8').read()
    key = "const COMBAT_B64='"
    i = src.index(key) + len(key)
    j = src.index("'", i)
    demo = base64.b64decode(src[i:j]).decode('utf8')
    print('decoded COMBAT_B64: %d bytes' % len(demo))
    new = patch(demo)
    if new is not demo:
        b64 = base64.b64encode(new.encode('utf8')).decode('ascii')
        src = src[:i] + b64 + src[j:]
        open(ALPHA, 'w', encoding='utf8').write(src)
        print('  demo: re-embedded (%d bytes, %+d)' % (len(new), len(new) - len(demo)))
    print('OK -> slices/BOHEMIA_ALPHA_0_9.html')


if __name__ == '__main__':
    main()
