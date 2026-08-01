#!/usr/bin/env python3
"""BOHEMIA -- JUDGE HAIR (8/1/26). Idempotent alpha patch.

Paolo 8/1: "think about how to put it in properly so I can thumbs up and thumbs
it down all your attempts into the UI".

WHERE IT GOES AND WHY. The CHARACTER tab, directly under THE CROWD. Hair is the
one wardrobe category you cannot judge on a flat swatch -- a hairstyle is a
SILHOUETTE ON A SKULL, so it has to be judged on the head, at the size it will
actually be seen, from the front AND from behind. The back matters more than it
sounds: a ponytail, a bun and a low tail are identical from the front and are
three different haircuts from the back, and the back of the head is what you see
for most of a walk cycle.

SO EACH ROW SHOWS S AND N, cropped to the head and scaled up, drawn through
drawChar -- the real render path -- not a swatch and not a side-door preview.

THE VERDICT WORKFLOW (CLAUDE.md): thumbs per item, a comment box at the bottom,
an EXPORT button, and it exports as .txt and never .json. Votes live in
localStorage under their own key so they survive a reload and never collide with
the animation votes.

REUSE CHECK: (REUSE-FIRST, Paolo 7/22) cooks ZERO graphic pixels. It draws
nothing of its own -- every image on the board is genHair output rendered by
drawChar. The board's markup, vote store, thumb buttons and build()/refresh
pattern are copied from the existing JUDGE ALL board in the same file rather
than invented, so the two judging surfaces behave identically under his thumb.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): no joints, no parts, no pixels, no rig
access of any kind. It borrows the worn-hair slot, draws, and puts his look back.
  built on: drawChar
  joints: none named
  parts: none
"""
import sys, pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1]
ALPHA = ROOT / 'slices' / 'BOHEMIA_ALPHA_0_9.html'
src = ALPHA.read_text()

if 'id="hairJudge"' in src:
    print('HAIR JUDGE: already applied, nothing to do')
    sys.exit(0)

# ---------------------------------------------------------------- 1. MARKUP
MARK_ANCHOR = '      <div id="crowdBoard" style="display:flex;flex-wrap:wrap;gap:4px;justify-content:center;margin:4px auto;max-width:min(94vw,440px)"></div>\n'
MARKUP = (
    '      <div class="row"><b>JUDGE HAIR</b><span class="mini">every shape, front and back '
    '&mdash; thumb each one</span></div>\n'
    '      <div class="row"><button id="hairExport" class="opt" style="border-color:#6f6">EXPORT VERDICTS</button>'
    '<span id="hairStat" class="mini" style="margin-left:6px"></span></div>\n'
    '      <div id="hairJudge"></div>\n'
)
if MARK_ANCHOR not in src:
    sys.exit('HAIR JUDGE: crowd board anchor not found')
src = src.replace(MARK_ANCHOR, MARK_ANCHOR + MARKUP, 1)

# ---------------------------------------------------------------- 2. THE BOARD
JS_ANCHOR = "  /* --- JUDGE ALL: \"i want to judge all the animations in bulk now\" ------- */"
JS = r'''  /* --- JUDGE HAIR (Paolo 8/1: "so I can thumbs up and thumbs it down all your
     attempts"). Each shape on the head, front AND back, at the size he will
     actually see it, drawn through drawChar. The back view is not a nicety: a
     ponytail, a bun and a low tail are the same haircut from the front. */
  (function(){
    var KEY = 'bohemia_hair_votes_b1';
    function votes(){ try { return JSON.parse(localStorage.getItem(KEY)||'{}'); } catch(e){ return {}; } }
    function save(v){ try { localStorage.setItem(KEY, JSON.stringify(v)); } catch(e){} }

    /* one head, cropped and scaled, through the REAL path */
    function headShot(name, d, px3){
      var cv = document.createElement('canvas');
      cv.width = 56; cv.height = 56;
      var keepW = window.G_WORN, keepE = G.equipped;
      var eq = {}; for (var k in keepE) eq[k] = keepE[k];
      eq.hat = ''; eq.glasses = ''; eq.hair = '';
      try {
        G.equipped = eq; window.G_WORN = { hair: name };
        drawChar(cv, d, 'idle', 0);
      } catch(e){} finally { window.G_WORN = keepW; G.equipped = keepE; }
      /* crop the head band out of whatever size drawChar produced */
      var S = cv.width / 56, ch = Math.round(30 * S);
      var out = document.createElement('canvas');
      out.width = cv.width; out.height = ch;
      out.style.cssText = 'width:' + (56*px3) + 'px;height:' + (30*px3) +
        'px;image-rendering:pixelated;background:#0e0c12;border-radius:2px';
      out.getContext('2d').drawImage(cv, 0, 0, cv.width, ch, 0, 0, cv.width, ch);
      return out;
    }

    window.hairJudgeBuild = function(){
      var host = document.getElementById('hairJudge');
      if (!host || !window.GARMENTS) return;
      var hairs = window.GARMENTS.filter(function(g){ return g.layer === 'hair' && g.st === 'canon'; });
      /* ALPHABETICAL (Paolo 7/30, standing) -- a COPY, GARMENTS keeps its order */
      hairs = hairs.slice().sort(function(a,b){ return a.n.localeCompare(b.n); });
      var V = votes();
      host.innerHTML = '';
      hairs.forEach(function(h){
        var row = document.createElement('div');
        row.className = 'row';
        row.style.cssText = 'align-items:center;gap:4px;padding:3px 0;flex-wrap:nowrap';
        row.appendChild(headShot(h.n, 'S', 2));
        row.appendChild(headShot(h.n, 'N', 2));
        var nm = document.createElement('span');
        nm.className = 'mini';
        nm.style.cssText = 'flex:1;min-width:80px;color:#c8b98a';
        nm.textContent = h.n;
        var up = document.createElement('button');
        up.className = 'opt' + (V[h.n] === 'up' ? ' on' : '');
        up.textContent = '\u{1F44D}';
        up.onclick = function(){ var v = votes(); v[h.n] = (v[h.n]==='up'?'':'up'); save(v); window.hairJudgeBuild(); };
        var dn = document.createElement('button');
        dn.className = 'opt' + (V[h.n] === 'down' ? ' on' : '');
        dn.textContent = '\u{1F44E}';
        dn.onclick = function(){ var v = votes(); v[h.n] = (v[h.n]==='down'?'':'down'); save(v); window.hairJudgeBuild(); };
        var wear = document.createElement('button');
        wear.className = 'opt';
        wear.textContent = 'WEAR';
        wear.onclick = function(){ window.G_WORN = window.G_WORN || {}; window.G_WORN.hair = h.n;
          if (window.wardrobeRefresh) window.wardrobeRefresh(); };
        row.appendChild(nm); row.appendChild(up); row.appendChild(dn); row.appendChild(wear);
        host.appendChild(row);
      });
      /* COMMENT SECTION AT THE BOTTOM, ALWAYS (the verdict workflow) */
      var cw = document.createElement('div');
      cw.className = 'row';
      cw.style.cssText = 'flex-direction:column;align-items:stretch;gap:3px';
      var cl = document.createElement('span');
      cl.className = 'mini'; cl.textContent = 'NOTES (ships with the export)';
      var ta = document.createElement('textarea');
      ta.id = 'hairNotes';
      ta.style.cssText = 'width:100%;min-height:52px;background:#131018;color:#d8cbb0;border:1px solid #3a3020;border-radius:3px;font:11px ui-monospace,monospace;padding:4px';
      try { ta.value = localStorage.getItem('bohemia_hair_notes') || ''; } catch(e){}
      ta.oninput = function(){ try { localStorage.setItem('bohemia_hair_notes', ta.value); } catch(e){} };
      cw.appendChild(cl); cw.appendChild(ta);
      host.appendChild(cw);

      var un = hairs.filter(function(h){ return !V[h.n]; }).length;
      var st = document.getElementById('hairStat');
      if (st) st.textContent = hairs.length + ' shapes · ' + un + ' unjudged';
    };

    /* EXPORT AS .txt, NEVER .json (the verdict workflow, standing) */
    var xb = document.getElementById('hairExport');
    if (xb) xb.onclick = function(){
      var V = votes(), hairs = (window.GARMENTS||[]).filter(function(g){ return g.layer==='hair'; });
      var L = ['BOHEMIA - HAIR VERDICTS', '', 'KEEP:'];
      hairs.forEach(function(h){ if (V[h.n]==='up') L.push('  ' + h.n); });
      L.push('', 'KILL:');
      hairs.forEach(function(h){ if (V[h.n]==='down') L.push('  ' + h.n); });
      L.push('', 'UNJUDGED:');
      hairs.forEach(function(h){ if (!V[h.n]) L.push('  ' + h.n); });
      var nt = (document.getElementById('hairNotes')||{}).value || '';
      L.push('', 'NOTES:', nt);
      var blob = new Blob([L.join('\n')], {type:'text/plain'});
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'BOHEMIA_HAIR_VERDICTS.txt';
      a.click();
    };
    setTimeout(function(){ try { window.hairJudgeBuild(); } catch(e){} }, 1200);
  })();

'''
if JS_ANCHOR not in src:
    sys.exit('HAIR JUDGE: JUDGE ALL anchor not found')
src = src.replace(JS_ANCHOR, JS + JS_ANCHOR, 1)

ALPHA.write_text(src)
print('HAIR JUDGE: applied (board + thumbs + notes + .txt export)')
