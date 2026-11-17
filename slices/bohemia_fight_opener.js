/* ==== __THE_CARD_THAT_OPENS_A_FIGHT__ (FIGHT SCREEN TWO 11/14/26; VAMILY rule 450(a), ask row 621; rules 449(a), 448, 441, 224) ====
   PAOLO 11/14, twice: 'The card bro, the combat card is UGLY AS SHIT, TRY TO MAKE SOME AWESOME BIG BRAIN FINAL SHIT.'
   The second of the three cards: the one where he chooses ENGAGE or FALL BACK (the map's #meetcard, built by meetShow in
   slices/BOHEMIA_CITY_WORLD.html; this file dresses it from one marked line there and keeps every piece the map's gates read).

   WHAT THE CARD IS FOR: one second, one choice. So it answers four things and nothing else leads:
     WHO     their leader's FACE, an ID photograph pinned on the house's dark board, and the crew's name
     WHY     the ONE sentence of rule 449(a), from that face, its mouth working (for beasts one of HIS men says it)
     HOW MANY their men against his, as two rows of faces of one size: the longer row is the bigger side (rule 224: no lone
             number, their number is their men, drawn)
     HOW BAD the stars and the bleeding ENGAGE button, WORLD's played read, untouched
   The ground is one quiet line in a well. ENGAGE and FALL BACK stay the map's own buttons.

   THE BLOCKER WAS A PREMISE (VAMILY rule 12; measured 11/14 on the demo's own page). The lane before named it: the men on the
   card were the MAP's models, the fight deals its own, so a face on the card would not be the man in the fight (ONE ID, ONE WHOLE
   PERSON) until the band's looks were handed from the map to the fight. MEASURED: the map already carries the fight's own engine
   (slices/bohemia_job_danger.js: fresh(), and doorOpts(), the fight's own door asked and never walked through), and the fight
   deals a band's looks by its place in the band, not by its dice (eight deals of one band on eight seeds: the same faces every
   time but for the one look whose model carries a pipe). So THE CARD ASKS THE FIGHT: it deals the band the way the fight will,
   six times (four on its own dice, once with every carried look refused and once with every carried look taken: the two ends
   of what the dice can do, on this file's own copy of the tables, nothing shared is written), one deal a tick so the map never
   stalls, and shows only a face that stood on the board in every deal; a man whose face moved between deals is a photograph
   not yet developed (dark), never a guess. Nothing is handed over and no hand-over is edited: the card leaves a
   NOTE (localStorage bohemia.fight.opener.v1) and the bell's why line (slices/BOHEMIA_FIGHT.html, __THE_WHY_LINE__) reads it,
   finds the man wearing that face on the board and has him say the same sentence once more. The bell says what it found
   (UI.whySaid.card), so a promise the card could not keep is counted, never hidden.

     BohemiaFightOpener.dress(el, msg, ctx)   the map's card, dressed (called from meetShow's marked line)
     BohemiaFightOpener.read(msg)             Promise of what the fight will stand: { them, mine, speaker, line, ... } or null
     BohemiaFightOpener.last                  what the card on the glass says and how it fits, for the gates and EYES
   Words are attempts, draft:true (the sentence is the why table's own, records/target/bb/fight_reasons.json). ==== */
(function (root) {
  'use strict';
  var NOTE_KEY = 'bohemia.fight.opener.v1', WHY_KEY = 'bohemia.fight.why.v1', DEALS = 4;   /* on the fight's own dice; the two ends are dealt besides */
  var RIM = { them: '#b8452f', you: '#d9a85a' };   /* the fight's own SIDE_RIM */
  var ENG = null, IMGS = {}, api = { last: null, deals: DEALS };
  function seedOf(s) { var h = 2166136261; s = String(s); for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function lsGet(k) { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function talks(u) { return !!u && !u.beast && !u.ghost && !u.machine; }

  /* ---------- THE FIGHT IS ASKED: the band dealt the way the fight will deal it ---------- */
  function engine() {
    var JD = root.BohemiaJobDanger; if (!JD || !JD.engine) return Promise.resolve(null);
    return Promise.resolve(JD.engine()).then(function (M) {
      if (!M) return null;
      if (!ENG) { var e = JD.fresh(); ENG = e && e !== M ? e : null; }   /* our own copy: a deal here never disturbs WORLD's read in flight */
      return ENG;
    }).catch(function () { return null; });
  }
  function dealt(E, o0, seed) {
    E.seed(seed >>> 0); E.F.setup(JSON.parse(JSON.stringify(o0)));
    var S = E.F.S, U = S.units, on = function (u) { try { return E.F.onField(u); } catch (e) { return true; } };
    return {
      them: U.filter(function (u) { return u.side === 'them'; }).map(function (u, i) { return { i: i, id: u.id, kind: u.kind, look: u.look, name: u.name, hp: u.hpMax || u.hp || 0, beast: !!u.beast, ghost: !!u.ghost, machine: !!u.machine, boss: !!u.boss, champion: !!u.champion }; }),
      mine: U.filter(function (u) { return u.side === 'you' && on(u); }).map(function (u) { return { id: u.id, name: u.name, look: u.look, main: !!u.main, beast: !!u.beast, level: u.level || 1, xp: u.xp || 0 }; }),
      ground: S.ground && S.ground.ground || null, night: !!S.night };
  }
  /* what is true this minute, the bell's own whyFacts read off the same tables */
  function facts(E, them, ground, night) {
    var DB = E.DB, f = { holds_ground: [], lives_here: false, has_food: false, known: false, night: !!night };
    try { var RD = DB.newEnemies && DB.newEnemies.road; if (RD && RD.holds && ground) f.holds_ground = Object.keys(RD.holds).filter(function (k) { return RD.holds[k].indexOf(ground) >= 0; }); } catch (e) {}
    try { if (ground && DB.newEnemies) f.lives_here = them.some(function (v) { var r = DB.newEnemies.rows.filter(function (x) { return x.id === v.kind; })[0]; return !!(r && r.habitat && r.habitat.indexOf(ground) >= 0); }); } catch (e) {}
    try { var s = lsGet('bohemia.supplies.v1'); f.has_food = !!(s && (s.food | 0) > 0); } catch (e) {}
    try { var r = lsGet('bohemia.renown.v1'); f.known = !!(r && DB.why && (r.score | 0) >= (DB.why.known_from_clout || 1e9)); } catch (e) {}
    return f;
  }
  /* a look whose model carries its own weapon is dealt only to a man whose dice gave him that weapon: it is never promised */
  function carried(E) { try { var mc = E.DB.ours.model_carries && E.DB.ours.model_carries.value; return (mc && mc.looks) || {}; } catch (e) { return {}; } }
  /* the two ends of what the dice can do with a carried look: nobody is dealt it, or the first man who reaches it is. Each is a
     shallow copy of the table on OUR engine copy only (the shared tables are never written) */
  function ends(E) {
    var real = E.DB.ours, mc = real && real.model_carries, L = mc && mc.value && mc.value.looks; if (!L || !Object.keys(L).length) return [];
    var none = {}; Object.keys(L).forEach(function (k) { none[k] = Object.assign({}, L[k], { classes: [] }); });
    var mk = function (looks) { return Object.assign({}, real, { model_carries: Object.assign({}, mc, { value: Object.assign({}, mc.value, { looks: looks }) }) }); };
    return [mk(none), mk({})];
  }
  function tick() { return new Promise(function (ok) { setTimeout(ok, 0); }); }
  function read(msg) {
    var p = msg && msg.party, band = p && Array.isArray(p.band) ? p.band.slice() : null;
    if (!band || !band.length) return Promise.resolve(null);
    return engine().then(function (E) {
      var JD = root.BohemiaJobDanger, W = root.BohemiaFightWhy; if (!E || !JD || !JD.doorOpts) return null;
      var at = msg.at ? (msg.at.gx != null ? [msg.at.gx | 0, msg.at.gy | 0] : msg.at.length === 2 ? [msg.at[0] | 0, msg.at[1] | 0] : null) : null;
      var o0 = JD.doorOpts({ count: band.length, band: band, faction: p.faction || 'brigands', days: p.days | 0 || 1, difficulty: p.difficulty | 0, act: p.act }, at);
      if (msg.boss && msg.boss.kind) o0.boss = msg.boss;   /* the boss stands in his own look, as the door hands him */
      var t0 = (root.performance || Date).now(), base = seedOf('opener:' + String(msg.why || '') + ':' + band.join(',')), D = [], real = E.DB.ours, busy = 0;
      var jobs = []; for (var k = 0; k < DEALS; k++) jobs.push({ seed: base + k * 7919, ours: null });
      ends(E).forEach(function (o, i) { jobs.splice(1 + i, 0, { seed: base + (DEALS + i) * 7919, ours: o }); });
      var run = function (j) { var a = (root.performance || Date).now(); if (j.ours) E.DB.ours = j.ours; try { D.push(dealt(E, o0, j.seed)); } finally { E.DB.ours = real; } busy = Math.max(busy, (root.performance || Date).now() - a); };
      var chain = Promise.resolve(); jobs.forEach(function (j, i) { chain = chain.then(function () { run(j); return i < jobs.length - 1 ? tick() : null; }); });
      return chain.then(function () {
      var d0 = D[0], WB = carried(E);
      /* a face is SURE when a man who talks wore it in every deal (whoever of them wore it) and its model carries nothing */
      var sure = {}; d0.them.forEach(function (u) { if (!WB[u.look] && D.every(function (d) { return d.them.some(function (x) { return x.look === u.look && x.kind === u.kind; }); })) sure[u.look] = 1; });
      var them = d0.them.map(function (u) { return { i: u.i, kind: u.kind, look: u.look, name: u.name, hp: u.hp, beast: u.beast, ghost: u.ghost, machine: u.machine, boss: u.boss, champion: u.champion, sure: !!sure[u.look] || u.beast }; });
      var mine = d0.mine.filter(function (u) { return !u.beast; });
      var vet = mine.filter(function (u) { return !u.main; }).sort(function (a, b) { return (b.level || 1) - (a.level || 1) || (b.xp || 0) - (a.xp || 0); })[0] || mine.filter(function (u) { return u.main; })[0] || mine[0] || null;
      /* the sentence: the why table's own chooser, asked before the fight as the bell asks it */
      var P = null, last = lsGet(WHY_KEY) || {}, fx = facts(E, them, d0.ground, d0.night);
      try { if (W && E.DB.why) P = W.pick({ why: msg.why || '', opts: { arena: false, camp: false, campBoard: false, boss: !!msg.boss },
        them: them.map(function (v) { return { kind: v.kind, beast: v.beast, ghost: v.ghost, machine: v.machine }; }),
        factions: W.factions({ tiers: E.DB.ours && E.DB.ours.enemy_tiers && E.DB.ours.enemy_tiers.value, own: E.DB.newEnemies }),
        facts: fx, last: last, alone: !!(vet && vet.main) }, E.DB.why); } catch (e) { P = null; }
      /* who says it: the boss, else a leader kind, else their toughest: the bell's own order, among the faces that are sure */
      var sp = null, side = P ? P.side : (them.some(talks) ? 'them' : 'ours');
      if (side === 'them') {
        var L = (E.DB.why && E.DB.why.leaders) || [], men = them.filter(talks);
        var rank = function (u) { return (u.boss ? 4 : 0) + (L.some(function (w) { return String(u.kind || '').indexOf(w) >= 0; }) ? 2 : 0); };
        var order = men.slice().sort(function (a, b) { return rank(b) - rank(a) || b.hp - a.hp || a.i - b.i; });
        var pick = order.filter(function (u) { return u.sure; })[0] || null;
        /* a lone man of a kind whose pool holds a carried look can be dealt it: his face is not promised */
        if (pick && !pick.boss) { var same = men.filter(function (u) { return u.kind === pick.kind; }).length, pool = null;
          try { var B = E.R('ours.bestiary'), PL = E.R('ours.people_looks').band, lp = B.look_pools[pick.kind]; pool = (lp && PL[lp]) || PL[pick.kind] || PL['default']; } catch (e) { pool = null; }
          if (same < 2 && pool && pool.some(function (l) { return !!WB[l]; })) pick = null; }
        var head = pick || order[0] || null;
        if (head) sp = { side: 'them', i: head.i, kind: head.kind, look: head.look, name: head.name, sure: !!pick, boss: head.boss };
      } else if (vet) sp = { side: 'ours', kind: null, look: vet.look, name: vet.name, sure: true, main: vet.main };
      if (P) { last[P.key] = P.i; lsSet(WHY_KEY, last); }
      var R = { at: Date.now(), ms: Math.round((root.performance || Date).now() - t0), longest: Math.round(busy), deals: D.length, why: String(msg.why || ''), band: band.join(','), them: them, mine: mine, speaker: sp,
        line: P ? P.line : null, rule: P ? P.rule : null, key: P ? P.key : null, wording: P ? P.i : null, how: P ? P.how : null, who: P ? P.who : null, cls: P ? P.cls : null, reason: P ? P.reason : null, side: side, draft: true };
      /* THE NOTE FOR THE BELL: what the card said and whose face said it */
      if (P && sp && sp.sure) lsSet(NOTE_KEY, { at: R.at, why: R.why, band: R.band, rule: R.rule, key: R.key, i: R.wording, side: R.side, line: R.line, how: R.how, who: R.who, reason: R.reason, look: sp.look, name: sp.name });
      else try { localStorage.removeItem(NOTE_KEY); } catch (e) {}
      return R;
      });
    }).catch(function (e) { api.err = String(e && e.message || e); return null; });
  }

  /* ---------- THE FACES: the fight's own portraits, by the look the fight will stand ---------- */
  function image(src, cb) {
    var I = IMGS[src]; if (I) { if (I.ok) cb(I.img); else if (I.wait) I.wait.push(cb); return; }
    I = IMGS[src] = { ok: false, wait: [cb], img: new Image() };
    I.img.onload = function () { I.ok = true; var w = I.wait; I.wait = null; w.forEach(function (f) { try { f(I.img); } catch (e) {} }); };
    I.img.onerror = function () { I.wait = null; };
    I.img.src = src;
  }
  function stripOf(look) {
    var F = ENG && ENG.DB && ENG.DB.rig && ENG.DB.rig.faces; if (!F) return null;
    var fi = F.order.indexOf(look); if (fi >= 0) return { file: F.file, i: fi, size: F.size };
    var hit = null; (F.more || []).some(function (M) { var j = M.order.indexOf(look); if (j < 0) return false; hit = { file: M.file, i: j, size: F.size }; return true; });
    return hit;
  }
  function rim(g, S, side) {
    var c = RIM[side] || RIM.them, fw = Math.max(2, Math.round(S * .07)), band = Math.max(3, Math.round(S * .13));
    g.fillStyle = c; g.fillRect(0, S - band, S, band);
    g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(0, S - band, S, Math.max(1, Math.round(band * .2)));
    g.strokeStyle = c; g.lineWidth = fw; g.strokeRect(fw / 2, fw / 2, S - fw, S - fw);
  }
  function beastHead(g, S) {   /* the fight's own turn-strip head for a beast: a beast has no face in the bank */
    var u = S / 24; g.fillStyle = '#c4553f'; g.beginPath();
    [[5, 4], [9, 9], [15, 9], [19, 4], [19, 13], [12, 21], [5, 13]].forEach(function (p, i) { (i ? g.lineTo : g.moveTo).call(g, p[0] * u, p[1] * u); });
    g.closePath(); g.fill(); g.fillStyle = '#17120d';
    [9.5, 14.5].forEach(function (x) { g.beginPath(); g.arc(x * u, 13 * u, 1.2 * u, 0, Math.PI * 2); g.fill(); });
  }
  /* one small photograph: side 'them' | 'you'; a face not sure is not yet developed */
  function photo(cv, u, side) {
    var S = cv.width, g = cv.getContext('2d'), base = function () { g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, S, S); g.fillStyle = side === 'you' ? '#2b2620' : '#2c1714'; g.fillRect(0, 0, S, S); };
    var dark = function () { g.fillStyle = 'rgba(14,11,8,.9)'; g.fillRect(0, 0, S, S); for (var y = 0; y < S; y += 3) { g.fillStyle = 'rgba(255,236,200,.05)'; g.fillRect(0, y, S, 1); } };
    base();
    if (u.beast) { beastHead(g, S); rim(g, S, side); return; }
    var st = stripOf(u.look);
    if (!st) { if (!u.sure) dark(); rim(g, S, side); return; }
    image('fight_rig/' + st.file, function (img) {
      base(); g.imageSmoothingEnabled = S < st.size; g.drawImage(img, st.i * st.size, 0, st.size, st.size, 0, 0, S, S);
      if (side === 'you') try { if (root.BohemiaWear) root.BohemiaWear.face(g, img, S, u.look, null, function () { photo(cv, u, side); }, [st.i * st.size, 0, st.size, st.size]); } catch (e) {}   /* his helmet on his face, as the fight draws it */
      if (u.ghost) { g.fillStyle = 'rgba(146,150,176,.5)'; g.fillRect(0, 0, S, S); }
      if (!u.sure) dark();
      rim(g, S, side);
    });
    if (!u.sure) dark();
    rim(g, S, side);
  }

  /* ---------- THE LOOK: one look with THE MAN'S SHEET (the house's dark board, a pinned photograph, a well) ---------- */
  function style() {
    if (document.getElementById('mco-style')) return;
    var M = root.BohemiaMaterials, kit = function (k, s) { try { return M && M.kit ? M.kit(k, s) : ''; } catch (e) { return ''; } };
    var C = 'BohemiaCasing,ui-monospace,monospace', R = 'BohemiaROM,ui-monospace,monospace', st = document.createElement('style'); st.id = 'mco-style';
    st.textContent = [
      '.mco .mc{box-sizing:border-box;display:grid;grid-template-columns:minmax(0,1fr);grid-template-areas:"head" "wall" "ground" "btn";gap:9px;padding:16px 12px 12px!important;border:0!important;border-left:3px solid ' + RIM.them + '!important;border-radius:0!important;background-color:#2a2016!important;color:#f2e4c6;filter:drop-shadow(3px 2px 0 rgba(10,6,3,.6))}',
      /* THE FAMILY'S EDGE (11/17, measured: the kit's board clears every border colour, so the edge above never showed): one strip, red theirs, gold his, as on the sheet and the phone's card */
      '.mco .mc{position:relative}.mco .mc::before{content:"";position:absolute;left:0;top:0;bottom:0;width:3px;background:#ff5a40;pointer-events:none}',
      '.mco.ours .mc::before{background:' + RIM.you + '}',
      '.mco.wide .mc{grid-template-columns:minmax(0,1.12fr) minmax(0,1fr);grid-template-areas:"head wall" "head ground" "btn btn";grid-template-rows:auto 1fr auto;column-gap:12px}',
      '.mco .mco-head{grid-area:head;display:flex;gap:11px;align-items:flex-start;min-width:0}',
      '.mco .mco-photo{position:relative;flex:0 0 auto;width:76px;height:76px;margin:3px 5px 5px 5px;background:#0d0b09;transform:rotate(-1.4deg);box-shadow:0 0 0 1px #0d0a07,0 0 0 3px #d8ceb6,0 0 0 4px #0d0a07,3px 4px 0 rgba(0,0,0,.55)}',
      '.mco .mco-photo canvas{display:block;width:100%;height:100%}',
      '.mco .mco-photo::after{content:"";position:absolute;left:0;right:0;bottom:0;height:6px;background:' + RIM.them + ';box-shadow:inset 0 1px 0 rgba(0,0,0,.35)}',
      '.mco.ours .mco-photo::after{background:' + RIM.you + '}',
      '.mco .mco-photo.dark canvas{filter:brightness(.16) contrast(1.3)}',
      '.mco .mco-photo.dark::before{content:"";position:absolute;inset:0;z-index:1;background:repeating-linear-gradient(0deg,rgba(255,236,200,.06) 0 1px,rgba(0,0,0,0) 1px 3px)}',
      '.mco .mco-who{min-width:0;flex:1 1 auto;display:flex;flex-direction:column;gap:3px;padding-top:1px}',
      '.mco .mch{font:400 15px/1.15 ' + C + '!important;letter-spacing:1px!important;color:#ff8a6a!important;text-shadow:0 1px 0 #000!important;overflow-wrap:anywhere}',
      '.mco .mcs{margin:0!important;font:400 11px/1.25 ' + C + '!important;letter-spacing:.8px!important;color:#cdb98e!important;display:flex!important;align-items:center!important;flex-wrap:wrap;gap:2px 6px!important}',
      '.mco .mcwhy{margin:0!important;font:400 11px/1.25 ' + C + '!important}',
      '.mco .mcboss{margin:0!important}.mco .mcboss>div{font-size:11px!important;line-height:1.3!important}.mco.faced .mcboss canvas{display:none}',
      '.mco .mco-say{margin-top:3px;min-height:36px;font:700 14px/1.28 ' + R + ';color:#efe3cc;text-shadow:0 1px 0 #000}',
      '.mco .mco-say b{display:block;margin-bottom:1px;font:400 11px/1.3 ' + C + ';letter-spacing:.6px;color:#ff8a6a}',
      '.mco.ours .mco-say b{color:#e2b45a}',
      '.mco .mco-wall{grid-area:wall;align-self:start;display:grid;grid-template-columns:auto minmax(0,1fr);gap:6px 9px;align-items:center;padding:9px 10px 9px;background:rgba(0,0,0,.3);' + kit('well', 1) + '}',
      '.mco .mco-lab{font:400 11px/1 ' + C + '!important;letter-spacing:.8px;color:#ff8a6a!important;margin:0!important;display:block!important;text-shadow:0 1px 0 #000}',
      '.mco .mco-lab.you{color:#e2b45a!important}',
      '.mco .mco-row{display:flex;flex-wrap:wrap;gap:4px;min-width:0}',
      '.mco .mco-row canvas{display:block;width:var(--mco-f,30px);height:var(--mco-f,30px);background:#0d0b09;box-shadow:0 0 0 1px #0d0a07}',
      '.mco .mco-row canvas.says{box-shadow:0 0 0 1px #0d0a07,0 0 0 2px #f2e4c6}',
      '.mco .mco-wall .mcmen{grid-column:1 / -1;margin:0!important}',
      '.mco.rows .mcmen{display:none!important}',
      '.mco .mcg{grid-area:ground;align-self:start}',
      '.mco .mcb{grid-area:btn;margin-top:1px!important}.mco .mcb button{min-height:48px!important}',
      /* the steps, when the glass is short: a smaller photograph, the ground on one line, smaller faces */
      '.mco.t1 .mco-photo{width:60px;height:60px}.mco.t1 .mco-say{font-size:13px;min-height:33px}',
      '.mco.t2 .mc{gap:6px;padding-top:13px!important;padding-bottom:9px!important}.mco.t2 .mcg>div+div{display:none}.mco.t2 .mco-wall{padding-top:6px;padding-bottom:6px}',
      '.mco.t3 .mco-photo{width:48px;height:48px}.mco.t3 .mco-say{font-size:12px;min-height:0}.mco.t3 .mcb button{min-height:44px!important}',
      '@media (prefers-reduced-motion:reduce){.mco .mco-photo{transform:none}}'
    ].join('\n');
    (document.head || document.documentElement).appendChild(st);
  }

  /* how the card stands on the glass: measured, and tightened a step at a time until nothing is off it */
  function fit(el) {
    var mc = el.querySelector('.mc'); if (!mc) return null;
    var vw = root.innerWidth || 360, vh = root.innerHeight || 640, wide = vw > vh && vh < 520;
    el.classList.toggle('wide', wide);
    mc.style.width = Math.round(wide ? Math.min(640, vw - 24) : Math.min(374, vw - 16)) + 'px';
    mc.style.marginBottom = '';
    var steps = ['t1', 't2', 't3'], step = 0, room = vh - 12;
    el.classList.remove('t1', 't2', 't3');
    faces(el);
    while (mc.offsetHeight > room && step < steps.length) { el.classList.add(steps[step++]); faces(el); }
    var b = mc.getBoundingClientRect(), all = [].slice.call(mc.querySelectorAll('*')).filter(function (e) { var r = e.getBoundingClientRect(), s = getComputedStyle(e); return r.width > 1 && r.height > 1 && s.display !== 'none' && s.visibility !== 'hidden'; });
    var small = all.filter(function (e) { return [].some.call(e.childNodes, function (n) { return n.nodeType === 3 && n.textContent.trim(); }) && parseFloat(getComputedStyle(e).fontSize) < 11; }).length;
    return { wide: wide, step: step, w: Math.round(mc.offsetWidth), h: Math.round(mc.offsetHeight), room: room, fits: mc.offsetHeight <= room, screen: [vw, vh], small: small,
      box: [Math.round(b.left), Math.round(b.top), Math.round(b.width), Math.round(b.height)] };
  }
  /* both rows wear one face size, so the longer row is the bigger side */
  function faces(el) {
    var wall = el.querySelector('.mco-wall'), rows = el.querySelectorAll('.mco-row'); if (!wall || !rows.length) return;
    var n = 1; [].forEach.call(rows, function (r) { n = Math.max(n, r.children.length); });
    var lab = wall.querySelector('.mco-lab'), w = wall.clientWidth - 20 - 9 - (lab ? Math.ceil(lab.getBoundingClientRect().width) : 40);
    var cap = el.classList.contains('t3') ? 24 : 34, f = Math.max(22, Math.min(cap, Math.floor((w - 4 * (n - 1)) / n)));
    wall.style.setProperty('--mco-f', f + 'px');
  }

  function dress(el, msg, ctx) {
    var mc = el && el.querySelector('.mc'); if (!mc || el.classList.contains('mco')) return false;
    ctx = ctx || {}; style();
    var M = root.BohemiaMaterials, kit = function (k, s) { try { return M && M.kit ? M.kit(k, s) : ''; } catch (e) { return ''; } };
    var q = function (s) { return mc.querySelector(s); };
    var mch = q('.mch'), mcs = q('.mcs'), mcwhy = q('.mcwhy'), mcboss = q('.mcboss'), men = q('.mcmen'), mcg = q('.mcg'), mcb = q('.mcb'), you = q('.mcyou');
    if (!mch || !mcs || !mcb) return false;
    el.classList.add('mco');
    /* WHO and WHY: the photograph, the crew, the sentence */
    var head = document.createElement('div'); head.className = 'mco-head';
    head.innerHTML = '<div class="mco-photo dark"><canvas width="128" height="128" aria-hidden="true"></canvas></div><div class="mco-who"></div>';
    var who = head.lastChild; who.appendChild(mch); who.appendChild(mcs); if (mcboss) who.appendChild(mcboss); if (mcwhy) who.appendChild(mcwhy);
    var say = document.createElement('div'); say.className = 'mco-say'; say.setAttribute('data-draft', 'true'); say.innerHTML = '<b></b><span></span>'; who.appendChild(say);
    /* HOW MANY: two rows of faces, theirs over his */
    var wall = document.createElement('div'); wall.className = 'mco-wall';
    var labT = document.createElement('span'); labT.className = 'mco-lab'; labT.textContent = 'THEM';
    var rowT = document.createElement('div'); rowT.className = 'mco-row'; rowT.setAttribute('data-side', 'them');
    var rowY = document.createElement('div'); rowY.className = 'mco-row'; rowY.setAttribute('data-side', 'you');
    if (you) { you.textContent = 'YOU'; you.className = 'mcyou mco-lab you'; you.style.cssText = ''; }
    if (men) wall.appendChild(men);   /* the map's own drawing stands until the fight has answered (and stays for a band the fight cannot be asked about) */
    mc.insertBefore(head, mc.firstChild); mc.insertBefore(wall, head.nextSibling);
    if (mcg) { mcg.style.cssText = 'padding:7px 10px 8px;color:#cdb98e;font:400 11px/1.4 BohemiaROM,ui-monospace,monospace;background:rgba(0,0,0,.3);' + kit('well', 1);
      var g0 = mcg.firstElementChild; if (g0) { g0.style.color = '#e2b45a'; g0.style.textShadow = '0 1px 0 #000'; } mc.insertBefore(mcg, mcb); }
    var state = { at: Date.now(), why: String(msg && msg.why || ''), read: null, fit: null, typed: false, face: null };
    api.last = state; state.fit = fit(el);
    var onSize = function () { if (!el.isConnected) { root.removeEventListener('resize', onSize); return; } state.fit = fit(el); };
    root.addEventListener('resize', onSize);
    /* NEVER UNDER ANOTHER CARD (the teardown's still: the shell's lesson lay over ENGAGE): while this card stands the lesson waits
       out of sight, and comes back the moment the card is gone (UI's #cbxsay is not edited, only asked to wait) */
    var hush = function () { var c = null; try { c = root.parent && root.parent !== root ? root.parent.document.getElementById('cbxsay') : null; } catch (e) { c = null; }
      if (!el.isConnected) { if (c && c.getAttribute('data-mco') === '1') { c.style.visibility = ''; c.removeAttribute('data-mco'); } clearInterval(hushT); return; }
      if (c && c.style.visibility !== 'hidden') { c.style.visibility = 'hidden'; c.setAttribute('data-mco', '1'); state.hushed = (state.hushed | 0) + 1; } };
    var hushT = setInterval(hush, 120); hush();
    read(msg).then(function (R) {
      if (!el.isConnected || !R) { state.read = R || { none: api.err || 'the fight could not be asked' }; return; }
      state.read = R;
      var sp = R.speaker, ours = R.side === 'ours';
      el.classList.toggle('ours', ours);
      /* the rows */
      var px = Math.round(34 * Math.min(3, root.devicePixelRatio || 1));
      var put = function (row, u, side, says) { var c = document.createElement('canvas'); c.width = c.height = px; if (says) c.className = 'says'; c.setAttribute('data-look', u.look || ''); c.setAttribute('data-sure', u.sure === false ? '0' : '1'); row.appendChild(c); photo(c, u, side); };
      R.them.forEach(function (u) { put(rowT, u, 'them', !!(sp && sp.side === 'them' && sp.sure && u.look === sp.look)); });
      R.mine.forEach(function (u) { put(rowY, { look: u.look, sure: true }, 'you', !!(sp && sp.side === 'ours' && u.look === sp.look && u.name === sp.name)); });
      if (R.them.length) { wall.appendChild(labT); wall.appendChild(rowT); if (R.mine.length && you) { wall.appendChild(you); wall.appendChild(rowY); } el.classList.add('rows'); }
      rowT.setAttribute('aria-label', 'them: ' + R.them.length); rowY.setAttribute('aria-label', 'you: ' + R.mine.length);
      /* the photograph and the sentence */
      var ph = head.firstChild, cv = ph.firstChild, nameEl = say.firstChild, lineEl = say.lastChild, line = R.line || '';
      if (sp) {
        nameEl.textContent = sp.name || '';
        var F = root.BohemiaCrewFaces, strip = function () { photoBig(cv, sp); };
        var draw = function () { try {
          if (sp.sure && F && F.has(sp.look)) { ph.classList.remove('dark'); state.face = 'portrait'; if (!(line && F.talk(cv, sp.look, line))) F.draw(cv.getContext('2d'), sp.look, 128, strip); }
          else { strip(); if (sp.sure) ph.classList.remove('dark'); state.face = sp.sure ? 'strip' : 'dark'; } } catch (e) { strip(); } };
        if (F && F.ready) F.ready(draw); else draw();
        if (sp.sure) el.classList.add('faced');
      }
      /* it types in fast (he decides in a second); at once when motion is to be less */
      var less = false; try { less = root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
      if (!line || less) { lineEl.textContent = line; state.typed = true; }
      else { var n = 0, tm = setInterval(function () { if (!el.isConnected) { clearInterval(tm); return; } n = Math.min(line.length, n + 3); lineEl.textContent = line.slice(0, n); if (n >= line.length) { clearInterval(tm); state.typed = true; } }, 33); }
      state.fit = fit(el);
    });
    return true;
  }
  function photoBig(cv, sp) {
    var g = cv.getContext('2d'), S = cv.width, st = stripOf(sp.look);
    g.fillStyle = sp.side === 'ours' ? '#2b2620' : '#2c1714'; g.fillRect(0, 0, S, S);
    if (st) image('fight_rig/' + st.file, function (img) { g.imageSmoothingEnabled = S < st.size; g.drawImage(img, st.i * st.size, 0, st.size, st.size, 0, 0, S, S); });
  }

  api.dress = dress; api.read = read; api.NOTE_KEY = NOTE_KEY;
  root.BohemiaFightOpener = api;
})(typeof window !== 'undefined' ? window : this);
