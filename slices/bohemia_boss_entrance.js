/* BOHEMIA -- BOSSES, rule 482 (Paolo 11/26: 'More cooking up cleaning up improving things we're already doing type shit'; the
   coordinator's routine 'BOSSES: rule 482 next': 'make the first three he meets feel like bosses: the sign that leads to him, his entrance,
   his look, his fight's moment, what changes on the map when he falls').

   THE BOSS ARRIVES. Measured on the phone before this file (records/BOHEMIA_BOSSES_THE_FIRST_THREE_FEEL_LIKE_BOSSES_11_26_26.md): once
   THE POT's fight opened nothing on the board said which man was THE POT; nothing marked the moment he was half down; his fall was one
   more body (the kill cams are off until the player turns them on). The fight's rules for him were all there (he rallies his cooks, THE
   FILTER's machines drop with him); nobody could see them. Loaded by slices/BOHEMIA_FIGHT.html; it reads FIGHT.S and draws over the
   fight in its own layer, pointer-events none (nothing it shows takes a tap), and changes no number of the fight.

     HIS ENTRANCE  when the board is on the glass (the zoom down is over): a tape's lower third on the beat, his name large, his title
                   under it, REC on the beat, a tracking tear in and out (in 1 beat, held 4, out 1), the sound of a set coming on
     HIS LOOK      his name over his head for the whole fight, in the boss's red, his blood under it, so the eye finds him in his crew
     HIS MOMENT    the first time his blood is half gone: the tape tears for 2 beats and his own tip from his card (the line the player
                   already read, 'KILL HIM FIRST: HIS COOKS BREAK') is stamped once; no new words
     HIS FALL      he is down (dead, run off, or the fight won with him in it): the tape stops for 2 beats (the colour drains, STOP in
                   the corner), his name struck through, 'DOWN'
   Every word shown is his row's own (name, title, tip) or one the game already says on his card ('IS DOWN'); draft:true.
   Analog horror at the source: a VHS lower third, a tracking tear, a tape stop; nothing glows, nothing is clean.
   REFERENCE: no reference game; Battle Brothers marks a champion by name, so a boss is named on the board. */
(function () {
  'use strict';
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  var BE = window.BohemiaBossEntrance = { last: { shown: [], draft: true } };
  var ROOT = null, CARD = null, PLATE = null, TEAR = null, STAMP = null, ST = null, RAF = 0;
  function S() { try { return FIGHT && FIGHT.S; } catch (e) { return null; } }
  function him(s) { try { if (!s || !s.boss) return null; return s.units.filter(function (u) { return u.id === s.boss.id; })[0] || null; } catch (e) { return null; } }
  function beat() { try { var b = beatMs(); return b > 50 && b < 3000 ? b : 500; } catch (e) { return 500; } }
  /* the fight is ON THE GLASS when its own frame is the thing on top at the open area's middle (measured 11/26: the frame was shown and
     opaque while the map's camcorder zoom down still covered it, and the entrance played unseen behind it) */
  function onGlass() { try { var fe = window.frameElement; if (!fe) return true; if (!fe.getClientRects().length) return false; var cs = window.parent.getComputedStyle(fe);
      if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity < 0.9) return false;
      var r = fe.getBoundingClientRect(), O = open(), x = r.left + (O ? O.l + O.w / 2 : r.width / 2), y = r.top + (O ? O.t + O.h * 0.4 : r.height / 2);
      var top = window.parent.document.elementFromPoint(x, y); return top === fe; } catch (e) { return true; } }
  function open() { try { return OPEN && OPEN.w > 1 ? OPEN : null; } catch (e) { return null; } }
  function rom() { try { return (getComputedStyle(document.documentElement).getPropertyValue('--face-rom') || '').trim() || 'ui-monospace, monospace'; } catch (e) { return 'ui-monospace, monospace'; } }
  function say(ev) { try { if (typeof sfx === 'function') sfx(ev); } catch (e) {} }
  function mark(k) { BE.last.shown.push({ k: k, t: Math.round(performance.now()) }); window.__BOSS_ENTRANCE = BE.last; }

  function style() {
    if (document.getElementById('bossentrancecss')) return;
    var f = rom(), st = document.createElement('style'); st.id = 'bossentrancecss';
    st.textContent = [
      '#bossentrance{position:fixed;inset:0;pointer-events:none;z-index:60;overflow:hidden}',
      '#bossentrance .be-card{position:absolute;padding:9px 14px 10px 12px;border-left:3px solid #c8321e;background:linear-gradient(90deg,rgba(5,4,3,.94),rgba(5,4,3,.84) 72%,rgba(5,4,3,0));',
      'font-family:' + f + ';color:#e8e0cc;opacity:0;will-change:transform,opacity}',
      '#bossentrance .be-card::after{content:"";position:absolute;inset:0;background:repeating-linear-gradient(0deg,rgba(0,0,0,.28) 0 1px,transparent 1px 3px)}',
      '#bossentrance .be-rec{font-size:10px;letter-spacing:2px;color:#e8e0cc;margin-bottom:4px}',
      '#bossentrance .be-rec i{display:inline-block;width:7px;height:7px;background:#c8321e;margin-right:6px;vertical-align:0}',
      '#bossentrance .be-name{font-size:27px;letter-spacing:3px;line-height:1;color:#f2ead6;text-shadow:1px 0 rgba(200,50,30,.75),-1px 0 rgba(60,170,190,.45),1px 1px #050403}',
      '#bossentrance .be-title{font-size:10px;letter-spacing:1.6px;color:#c9b48a;margin-top:5px;text-transform:uppercase}',
      '#bossentrance .be-plate{position:absolute;transform:translate(-50%,-100%);font-family:' + f + ';font-size:9px;letter-spacing:1.4px;color:#f06a42;',
      'text-shadow:1px 1px #050403,0 0 1px #050403;white-space:nowrap;text-align:center}',
      '#bossentrance .be-plate b{display:block;margin:2px auto 0;height:3px;background:#2a1712;box-shadow:0 0 0 1px #050403}',
      '#bossentrance .be-plate b i{display:block;height:100%;background:#c8321e}',
      '#bossentrance .be-tear{position:absolute;inset:0;opacity:0;mix-blend-mode:screen;background:repeating-linear-gradient(0deg,rgba(232,224,204,.0) 0 7px,rgba(232,224,204,.16) 7px 8px,rgba(232,224,204,0) 8px 23px)}',
      '#bossentrance .be-stamp{position:absolute;left:50%;transform:translate(-50%,-50%);font-family:' + f + ';color:#e8e0cc;text-align:center;opacity:0;',
      'font-size:15px;letter-spacing:2.4px;padding:8px 12px;background:rgba(5,4,3,.78);border-top:1px solid #c8321e;border-bottom:1px solid #c8321e;white-space:nowrap}',
      '#bossentrance .be-stamp s{text-decoration-color:#c8321e;text-decoration-thickness:2px}',
      '#bossentrance .be-stop{position:absolute;inset:0;opacity:0;background:rgba(40,36,30,.35);backdrop-filter:saturate(.15) contrast(1.15);-webkit-backdrop-filter:saturate(.15) contrast(1.15)}',
      '#bossentrance .be-stopword{position:absolute;font-family:' + f + ';font-size:11px;letter-spacing:2px;color:#e8e0cc;opacity:0}'
    ].join('');
    document.head.appendChild(st);
  }
  function root() {
    if (ROOT && ROOT.parentNode) return ROOT;
    style(); ROOT = document.createElement('div'); ROOT.id = 'bossentrance'; ROOT.setAttribute('aria-hidden', 'true'); document.body.appendChild(ROOT); return ROOT;
  }
  function el(cls, html) { var d = document.createElement('div'); d.className = cls; if (html != null) d.innerHTML = html; root().appendChild(d); return d; }
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  /* a tape's moves, on the beat: a short ladder of steps (a tracking jump, not a slide) */
  function play(node, frames, ms) { try { return node.animate(frames, { duration: ms, easing: 'linear', fill: 'forwards' }); } catch (e) { return null; } }

  function entrance(s, u) {
    var O = open(); if (!O) return false;
    var b = beat(), n = (s.boss.name || u.name || '').toUpperCase(), t = s.boss.title || '';
    CARD = el('be-card', '<div class="be-rec"><i></i>REC</div><div class="be-name">' + esc(n) + '</div>' + (t ? '<div class="be-title">' + esc(t) + '</div>' : ''));
    CARD.style.left = Math.round(O.l + 12) + 'px'; CARD.style.top = Math.round(O.t + O.h * 0.62) + 'px'; CARD.style.maxWidth = Math.round(O.w - 24) + 'px';
    var tot = 6 * b;
    play(CARD, [
      { opacity: 0, transform: 'translateX(-14px)', offset: 0 }, { opacity: 1, transform: 'translateX(6px)', offset: 0.06 }, { opacity: 0.7, transform: 'translateX(-3px)', offset: 0.1 },
      { opacity: 1, transform: 'translateX(0)', offset: 1 / 6 }, { opacity: 1, transform: 'translateX(0)', offset: 5 / 6 },
      { opacity: 0.6, transform: 'translateX(9px) scaleY(.6)', offset: 0.9 }, { opacity: 0, transform: 'translateX(-20px) scaleY(.1)', offset: 1 }], tot);
    var rec = CARD.querySelector('.be-rec i');
    try { rec.animate([{ opacity: 1 }, { opacity: 1, offset: 0.49 }, { opacity: 0, offset: 0.5 }, { opacity: 0 }], { duration: 2 * b, iterations: 3 }); } catch (e) {}
    tear(1 * b);
    setTimeout(function () { try { if (CARD && CARD.parentNode) CARD.parentNode.removeChild(CARD); CARD = null; } catch (e) {} }, tot + 50);
    say('power_on'); mark('entrance'); BE.last.entrance = { name: n, title: t, beat: Math.round(b), at: Math.round(performance.now()) };
    return true;
  }
  function tear(ms) {
    if (!TEAR || !TEAR.parentNode) TEAR = el('be-tear');
    play(TEAR, [{ opacity: 0, transform: 'translateY(0)' }, { opacity: 1, transform: 'translateY(-6px)', offset: 0.25 }, { opacity: 0.7, transform: 'translateY(4px)', offset: 0.5 },
      { opacity: 1, transform: 'translateY(-2px)', offset: 0.75 }, { opacity: 0, transform: 'translateY(0)' }], ms);
  }
  function stamp(html, ms, cls) {
    var O = open(); if (!O) return null;
    if (STAMP && STAMP.parentNode) STAMP.parentNode.removeChild(STAMP);
    STAMP = el('be-stamp' + (cls ? ' ' + cls : ''), html); STAMP.style.top = Math.round(O.t + O.h * 0.34) + 'px'; STAMP.style.maxWidth = Math.round(O.w - 24) + 'px';
    STAMP.style.whiteSpace = 'normal';
    play(STAMP, [{ opacity: 0, transform: 'translate(-50%,-50%) scaleX(1.25)' }, { opacity: 1, transform: 'translate(-50%,-50%) scaleX(1)', offset: 0.12 },
      { opacity: 1, transform: 'translate(-50%,-50%)', offset: 0.82 }, { opacity: 0, transform: 'translate(-50%,-50%) scaleY(.2)' }], ms);
    var me = STAMP; setTimeout(function () { try { if (me.parentNode) me.parentNode.removeChild(me); } catch (e) {} }, ms + 50);
    return STAMP;
  }
  function moment(s, u) {
    var b = beat(), tip = s.boss.tip || '';
    tear(2 * b);
    if (tip) stamp(esc(tip), 4 * b);
    mark('moment'); BE.last.moment = { tip: tip, f: +(u.hp / (u.hpMax || u.hp || 1)).toFixed(2), at: Math.round(performance.now()) };
  }
  function fall(s, u) {
    var O = open(); if (!O) return;
    var b = beat(), n = (s.boss.name || u.name || '').toUpperCase();
    var stop = el('be-stop'), word = el('be-stopword', '&#9632; STOP');
    word.style.left = Math.round(O.l + 14) + 'px'; word.style.top = Math.round(O.t + 14) + 'px';
    play(stop, [{ opacity: 0 }, { opacity: 1, offset: 0.1 }, { opacity: 1, offset: 0.8 }, { opacity: 0 }], 3 * b);
    play(word, [{ opacity: 0 }, { opacity: 1, offset: 0.1 }, { opacity: 1, offset: 0.8 }, { opacity: 0 }], 3 * b);
    stamp('<s>' + esc(n) + '</s><br>DOWN', 3 * b, 'be-down');
    setTimeout(function () { try { stop.remove(); word.remove(); } catch (e) {} }, 3 * b + 60);
    say('tape_pull'); mark('fall'); BE.last.fall = { name: n, at: Math.round(performance.now()) };
  }
  function plate(u) {
    try {
      if (!PLATE || !PLATE.parentNode) { PLATE = el('be-plate', '<span></span><b><i></i></b>'); }
      if (u.dead || u.fled || u._outAt !== undefined) { PLATE.style.display = 'none'; return; }
      var tw = UI.tw, th = UI.th, X = sx((dx(u) + .5) * tw), feet = sy((dy(u) + .9) * th), lvl = th * (typeof riseAt === 'function' ? riseAt(u.x, u.y) : 0);
      var Y = feet - lvl - manH() - 4, w = Math.max(34, Math.round(tw * UI.zoom * 0.8));
      PLATE.style.display = ''; PLATE.style.left = Math.round(X) + 'px'; PLATE.style.top = Math.round(Y) + 'px';
      var sp = PLATE.firstChild; if (sp.textContent !== u.name) sp.textContent = u.name;
      var bar = PLATE.lastChild; bar.style.width = w + 'px'; bar.firstChild.style.width = Math.max(0, Math.min(100, Math.round(100 * u.hp / (u.hpMax || u.hp || 1)))) + '%';
      BE.last.plate = { x: Math.round(X), y: Math.round(Y), name: u.name, on: X >= 0 && X <= innerWidth && Y >= 0 && Y <= innerHeight };
    } catch (e) { BE.last.plateErr = String(e && e.message || e); }
  }
  function reset() { try { if (ROOT) ROOT.innerHTML = ''; } catch (e) {} CARD = PLATE = TEAR = STAMP = null; ST = null; }

  function tick() {
    RAF = requestAnimationFrame(tick);
    var s = S(); if (!s || !s.board || !s.units) { if (ST) reset(); return; }
    var u = him(s); if (!u) { if (ST && ST.id) reset(); return; }
    if (!ST || ST.id !== u.id || ST.s !== s) { reset(); ST = { id: u.id, s: s, seen: 0, half: false, down: false }; BE.last = { shown: [], draft: true }; }
    if (!ST.entered && !onGlass()) { ST.seen = 0; return; }   /* asked only until he has entered; the board stays his after */
    if (!ST.seen) { ST.seen = performance.now(); return; }
    if (!ST.entered && performance.now() - ST.seen >= beat()) ST.entered = entrance(s, u) || ST.entered;   /* one beat after the board is on the glass */
    if (!ST.down) { plate(u); BE.last.f = +(u.hp / (u.hpMax || u.hp || 1)).toFixed(2); }
    if (ST.entered && !ST.half && !u.dead && u.hp / (u.hpMax || u.hp || 1) <= 0.5) { ST.half = true; moment(s, u); }
    /* his end: dead, run off the board (his line breaks and he goes with it: measured 11/26, THE POT fled and the fight was won), or the
       fight won with him in it; the game's own word for each is the same ('THE POT IS DOWN', the map's after card) */
    var gone = u.dead || u.fled || u._outAt !== undefined || (s.over && s.result === 'won');
    if (ST.entered && !ST.down && gone) { ST.down = true; if (PLATE) PLATE.style.display = 'none'; fall(s, u); }
  }
  BE.tick = tick; BE.reset = reset;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { RAF = requestAnimationFrame(tick); }); else RAF = requestAnimationFrame(tick);
})();
