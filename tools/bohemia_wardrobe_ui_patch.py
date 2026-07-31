#!/usr/bin/env python3
"""
BOHEMIA - THE LOGIC BEHIND THE NEW BUTTONS (Paolo 7/31/26)

Companion to bohemia_judging_surface_and_wardrobe_patch.py, which added the
markup. This adds the behaviour:

  AUTO-SPIN   every 2000ms the facing advances one step around the compass, on
              the ANIMATION tab and on the CHARACTER stage. ON by default. It
              SUSPENDS itself while ALL 8 is open, because that view already
              shows all eight facings and spinning it is just noise, and while
              POSE EDIT is open, because the facing is the thing being edited.

  WARDROBE    a category picker in the CHARACTER tab listing every CANON garment
              alphabetically (his 7/30 standing order), tap to wear, tap again to
              take off. Writes window.G_WORN, which buildFrame composites.

  SHUFFLE FIT rolls one random canon garment per category. Deliberately NOT every
              category at once -- head/face/hands/back stay empty unless he picks
              them, so a shuffle gives an outfit and not a costume pile.

  JUDGE ALL   every clip in one alphabetical list, KEEP/KILL per row, a live
              unjudged counter, and one export. Shares the existing CAND_VOTE
              store and its localStorage key, so thumbs he already gave are
              already there and nothing he judged before is lost.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): no joints, no anatomy, no layering. This
is UI state and DOM.
  built on: the BAKED package
  joints: none named
  parts: none

REUSE CHECK (REUSE-FIRST, Paolo 7/22): cooks ZERO graphic pixels, opens NO banks.
It lists and equips garments that already exist.

  python3 tools/bohemia_wardrobe_ui_patch.py
"""
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'

ANCHOR = "  document.getElementById('skelToggle').onclick=function(){G.showSkel=!G.showSkel;this.textContent=G.showSkel?'ON':'OFF';this.classList.toggle('on',G.showSkel);};"

BLOCK = r"""
  /* ===================================================================
     AUTO-SPIN / WARDROBE / SHUFFLE FIT / JUDGE ALL  (Paolo 7/31/26)
     =================================================================== */

  /* --- AUTO-SPIN: "automatically every 2 seconds to change the directions
     its facing... it should be on by default." ------------------------- */
  window.G_AUTODIR = true;
  (function(){
    var btn = document.getElementById('autoDirBtn');
    if (btn) btn.onclick = function(){
      window.G_AUTODIR = !window.G_AUTODIR;
      this.classList.toggle('on', window.G_AUTODIR);
    };
    setInterval(function(){
      if (!window.G_AUTODIR) return;
      /* ALL 8 already shows every facing; spinning it is noise. POSE EDIT is
         editing this exact facing, so spinning it would fight him. */
      var g8 = document.getElementById('grid8');
      if (g8 && g8.style.display !== 'none') return;
      if (window.POSE_EDIT_ON) return;
      var anim = document.getElementById('p-anim'), ch = document.getElementById('p-char');
      var vis = (anim && anim.classList.contains('on')) || (ch && ch.classList.contains('on'));
      if (!vis) return;
      var i = DIRS.indexOf(G.dir);
      G.dir = DIRS[(i < 0 ? 0 : i + 1) % DIRS.length];
      try { dirButtons('dirBtns'); dirButtons('dirBtnsC'); } catch(e){}
    }, 2000);
  })();

  /* --- THE WARDROBE: he can finally put the 221 on ---------------------- */
  window.G_WORN = window.G_WORN || {};
  window.wardrobeRefresh = function(){
    var host = document.getElementById('wardrobe');
    if (!host || !window.GARMENTS) return;
    host.innerHTML = '';
    var CATS = [['base','TOPS'],['legs','LEGS'],['feet','FEET'],['outer','OUTER'],
                ['head','HEADWEAR'],['neck','NECK'],['face','FACE'],['hands','HANDS'],
                ['waist','WAIST'],['gear','GEAR'],['back','BAGS']];
    var canon = window.GARMENTS.filter(function(g){ return g.st === 'canon'; });
    CATS.forEach(function(cat){
      var items = canon.filter(function(g){ return g.layer === cat[0]; })
                       /* ALPHABETICAL (Paolo 7/30, standing) */
                       .sort(function(a,b){ return a.n.localeCompare(b.n); });
      if (!items.length) return;
      var worn = window.G_WORN[cat[0]];
      var h = document.createElement('div');
      h.className = 'cloSection cloFold';
      h.style.cssText = 'font-size:11px;cursor:pointer;padding:5px 8px';
      h.innerHTML = '<span class="cloArrow">&#9656;</span> ' + cat[1] + ' (' + items.length + ')' +
                    (worn ? ' <span style="color:#8fd18f">' + worn + '</span>' : '');
      var body = document.createElement('div');
      body.style.display = 'none';
      h.onclick = function(){
        var open = body.style.display === 'none';
        body.style.display = open ? '' : 'none';
        h.querySelector('.cloArrow').innerHTML = open ? '&#9662;' : '&#9656;';
      };
      items.forEach(function(g){
        var b = document.createElement('button');
        b.className = 'opt' + (worn === g.n ? ' on' : '');
        b.textContent = g.n;
        b.style.cssText = 'margin:2px;font-size:10px';
        b.onclick = function(){
          /* tap the worn one again to take it off */
          if (window.G_WORN[cat[0]] === g.n) delete window.G_WORN[cat[0]];
          else window.G_WORN[cat[0]] = g.n;
          window.wardrobeRefresh();
        };
        body.appendChild(b);
      });
      host.appendChild(h); host.appendChild(body);
    });
  };

  /* --- SHUFFLE FIT ------------------------------------------------------ */
  window.shuffleFit = function(){
    if (!window.GARMENTS) return;
    /* an OUTFIT, not a costume pile: the categories a person actually wears
       every day. head/face/hands/back/gear stay his to choose. */
    var SLOTS = ['base','legs','feet','outer'];
    var canon = window.GARMENTS.filter(function(g){ return g.st === 'canon'; });
    SLOTS.forEach(function(sl){
      var pool = canon.filter(function(g){ return g.layer === sl; });
      if (!pool.length) return;
      window.G_WORN[sl] = pool[Math.floor(Math.random() * pool.length)].n;
    });
    window.wardrobeRefresh();
  };
  (function(){ var b = document.getElementById('charFit'); if (b) b.onclick = window.shuffleFit; })();

  /* --- JUDGE ALL: "i want to judge all the animations in bulk now" ------- */
  (function(){
    var btn = document.getElementById('judgeAllBtn'), host = document.getElementById('judgeAll');
    if (!btn || !host) return;
    var KEY = 'bohemia_cand_votes_b1';           /* the SAME store as the per-clip thumbs */
    function votes(){ try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch(e){ return {}; } }
    function save(v){ try { localStorage.setItem(KEY, JSON.stringify(v)); } catch(e){} }
    function build(){
      var V = votes(); host.innerHTML = '';
      var un = CLIPS.filter(function(c){ return !V[c]; }).length;
      var head = document.createElement('div');
      head.className = 'row';
      head.innerHTML = '<b>JUDGE ALL</b><span class="mini">' + CLIPS.length +
                       ' clips &middot; <span style="color:#e2b877">' + un + ' unjudged</span></span>';
      host.appendChild(head);
      /* ALPHABETICAL (Paolo 7/30, standing) -- a COPY, CLIPS keeps authoring order */
      CLIPS.slice().sort(function(a,b){ return a.localeCompare(b); }).forEach(function(c){
        var r = document.createElement('div');
        r.className = 'row';
        r.style.cssText = 'padding:2px 0;align-items:center';
        var nm = document.createElement('button');
        nm.className = 'opt' + (G.clip === c ? ' on' : '');
        nm.textContent = c;
        nm.style.cssText = 'min-width:120px;text-align:left;font-size:10px';
        nm.onclick = function(){ G.clip = c; G.t0 = performance.now(); build(); };
        var up = document.createElement('button');
        up.className = 'opt' + (V[c] === 'up' ? ' on' : '');
        up.textContent = '\u{1F44D}';
        up.onclick = function(){ var v = votes(); v[c] = (v[c] === 'up' ? '' : 'up'); save(v); build(); };
        var dn = document.createElement('button');
        dn.className = 'opt' + (V[c] === 'down' ? ' on' : '');
        dn.textContent = '\u{1F44E}';
        dn.onclick = function(){ var v = votes(); v[c] = (v[c] === 'down' ? '' : 'down'); save(v); build(); };
        var st = document.createElement('span');
        st.className = 'mini';
        st.style.marginLeft = '6px';
        st.textContent = V[c] === 'up' ? 'KEEP' : V[c] === 'down' ? 'KILL' : '';
        r.appendChild(nm); r.appendChild(up); r.appendChild(dn); r.appendChild(st);
        host.appendChild(r);
      });
      var ex = document.createElement('button');
      ex.className = 'opt';
      ex.style.cssText = 'width:100%;margin-top:8px;border-color:#6f6';
      ex.textContent = 'EXPORT ALL VERDICTS (.txt)';
      ex.onclick = function(){
        var V2 = votes(), keep = [], kill = [], un2 = [];
        CLIPS.slice().sort(function(a,b){ return a.localeCompare(b); }).forEach(function(c){
          (V2[c] === 'up' ? keep : V2[c] === 'down' ? kill : un2).push(c);
        });
        var t = '=== BOHEMIA ANIMATION VERDICTS (bulk) ===\n' +
                'KEEP (' + keep.length + '): ' + (keep.join(', ') || '(none)') + '\n\n' +
                'KILL (' + kill.length + '): ' + (kill.join(', ') || '(none)') + '\n\n' +
                'UNJUDGED (' + un2.length + '): ' + (un2.join(', ') || '(none)') + '\n';
        var blob = new Blob([t], {type:'text/plain'});
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'BOHEMIA_ANIMATION_VERDICTS.txt';
        document.body.appendChild(a); a.click(); a.remove();
      };
      host.appendChild(ex);
    }
    btn.onclick = function(){
      var open = host.style.display === 'none';
      host.style.display = open ? '' : 'none';
      this.classList.toggle('on', open);
      if (open) build();
    };
  })();
"""


def main():
    s = open(ALPHA, encoding='utf-8').read()
    if 'G_AUTODIR' in s:
        print('already applied')
        return 0
    if s.count(ANCHOR) != 1:
        print('REFUSING TO WRITE: anchor resolved %d times, expected 1' % s.count(ANCHOR))
        return 1
    open(ALPHA, 'w', encoding='utf-8').write(s.replace(ANCHOR, ANCHOR + '\n' + BLOCK))
    print('auto-spin, wardrobe, shuffle fit and judge-all wired')
    return 0


if __name__ == '__main__':
    sys.exit(main())
