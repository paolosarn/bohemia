/* THE PIT ON THE MOB'S TOWN SCREEN (ARENA lane, 11/3/26, VAMILY rule 375, ask lines 402 and 403; Paolo 11/3).
   'they host an arena with exotic DNA lab shits'; AMENDED: 'the mob, they're [held together] by fucking duct tape and a thread...
   barely able to.' Battle Brothers' way (bb_all/0620, bb_all/0131): the arena is a building in the town; you tap it and see the
   whole card before you sign: who, how many, the purse; a new card each day.

   THE PICTURE: slices/arena/pit_day.webp and pit_night.webp, rendered in the towns' own camera by tools/bohemia_arena_the_pit.py
   (a hotel pool drained to its tiles, the dead casino's velvet-rope stands taped where they broke, two poles and a string of
   bulbs with three still working, a breaker panel held shut with a belt, a generator, two patched cages, the crowd's chairs, a
   plywood sign painted by hand), laid over the Mob's picture where that picture already sinks a drained plaza
   (slices/arena/arena_town.json, the spot per composition). The town screen asks this file for the tap box, the bookie's door
   and the ground nobody walks on, draws the piece after the picture and lights it under the finger from its own pixels.

   THE SHEET: the bookie speaks (a line that knows tonight: the card, the dead generator, the night you already fought), the card
   in plain words (every foe in his own fight body, how many, the purse in batteries, the fifth night's prize), the house rules
   (no collar, no running, nothing off the dead). The numbers are engine/bohemia_arena.js's from records/target/bb/arena.json.
   Words are attempts, draft:true. */
(function(){
  'use strict';
  var A = {pit: null, places: null, ims: {}, sheets: {}}, waiting = [];
  function get(u, f){ try{ fetch(u).then(function(r){ return r.json(); }).then(f).catch(function(){}); }catch(e){} }
  function done(){ if(A.pit && A.places) waiting.splice(0).forEach(function(f){ try{ f(); }catch(e){} }); }
  get('arena/pit.json', function(j){ A.pit = j; done(); });
  get('arena/arena_town.json', function(j){ A.places = j; done(); });
  /* the screen re-lays its doors when the pit's numbers land after its own town did */
  function whenReady(f){ if(A.pit && A.places) f(); else waiting.push(f); }
  function img(u){ var im = A.ims[u]; if(!im){ im = A.ims[u] = new Image(); im.src = u; } return im; }
  function town(){ return A.places ? A.places.town : 'Mob'; }

  /* where the pit stands on this composition, in the picture's pixels; null where there is no pit */
  function spot(VAR){
    if(!A.pit || !A.places || !VAR || !VAR.comp || !VAR.comp.src) return null;
    var p = A.places.pictures[VAR.comp.src]; if(!p) return null;
    var ox = Math.round(p.at[0] - A.pit.anchor[0]), oy = Math.round(p.at[1] - A.pit.anchor[1]), f = A.pit.footprint, d = A.pit.door;
    return (A.last = {x: ox, y: oy, w: A.pit.px[0], h: A.pit.px[1], box: [ox + f[0], oy + f[1] - 40, ox + f[2], oy + f[3]],
      block: [ox + f[0], oy + f[1], ox + f[2], oy + f[3] - 6], door: {x: ox + d[0], y: oy + d[1]},
      pool: [ox + A.pit.pool[0], oy + A.pit.pool[1], ox + A.pit.pool[2], oy + A.pit.pool[3]], src: VAR.comp.src});
  }
  function pic(night){ return img('arena/pit_' + (night ? 'night' : 'day') + '.webp'); }
  function draw(cx, view, s, night, VAR, alpha){
    var sp = spot(VAR); if(!sp) return false; var im = pic(night); if(!im.complete || !im.naturalWidth) return false;
    if(alpha != null && alpha < 1){ cx.save(); cx.globalAlpha = alpha; }
    cx.drawImage(im, view.ox + sp.x * s, view.oy + sp.y * s, sp.w * s, sp.h * s);
    if(alpha != null && alpha < 1) cx.restore();
    return true;
  }
  /* the lit one: the pit catches the light from its own pixels, the way every building on the screen does */
  function lit(cx, view, s, a, VAR, night){
    var sp = spot(VAR); if(!sp) return false; var im = pic(night); if(!im.complete || !im.naturalWidth) return false;
    cx.save(); cx.globalCompositeOperation = 'lighter'; cx.globalAlpha = a;
    cx.drawImage(im, view.ox + sp.x * s, view.oy + sp.y * s, sp.w * s, sp.h * s); cx.restore(); return true;
  }

  /* ---------- THE CARD ---------- */
  function E(){ return window.BohemiaArena; }
  function name(id, n){ var N = E() && E().V('names'), r = N && N[id]; return r ? (n === 1 ? r[0] : r[1]) : id.replace(/_/g, ' '); }
  function look(id){ var L = E() && E().V('looks'); return L && L[id]; }
  /* a foe in his own fight body: the stand clip, facing the camera three-quarters (the rig's row 1, column 0) */
  function body(id, px){
    var c = document.createElement('canvas'), dpr = window.devicePixelRatio || 1; c.width = Math.round(px * dpr); c.height = Math.round(px * dpr);
    c.style.width = px + 'px'; c.style.height = px + 'px'; c.className = 'ar-body';
    var lk = look(id); if(!lk) return c;
    var im = img('fight_rig/' + lk[0] + '.webp'), cols = lk[1];
    /* the cell is cut to the body inside it (the rig leaves room round a man for his swing), then fit to the box */
    function paint(){ var x = c.getContext('2d'), cw = Math.floor(im.naturalWidth / cols), ch = Math.floor(im.naturalHeight / 8);
      var t = document.createElement('canvas'); t.width = cw; t.height = ch; var tx = t.getContext('2d'); tx.drawImage(im, 0, ch, cw, ch, 0, 0, cw, ch);
      var d = tx.getImageData(0, 0, cw, ch).data, x0 = cw, y0 = ch, x1 = -1, y1 = -1;
      for(var yy = 0; yy < ch; yy++) for(var xx = 0; xx < cw; xx++) if(d[(yy * cw + xx) * 4 + 3] > 40){ if(xx < x0) x0 = xx; if(xx > x1) x1 = xx; if(yy < y0) y0 = yy; if(yy > y1) y1 = yy; }
      if(x1 < 0) return; var bw = x1 - x0 + 1, bh = y1 - y0 + 1, k = Math.min((c.width * 0.9) / bw, (c.height * 0.9) / bh);
      x.imageSmoothingEnabled = true; x.clearRect(0, 0, c.width, c.height);
      x.drawImage(t, x0, y0, bw, bh, (c.width - bw * k) / 2, c.height * 0.96 - bh * k, bw * k, bh * k); }
    if(im.complete && im.naturalWidth) paint(); else im.addEventListener('load', paint);
    return c;
  }
  function el(t, cls, txt){ var e = document.createElement(t); if(cls) e.className = cls; if(txt != null) e.textContent = txt; return e; }
  var CSS = '.ar-card{margin-top:10px;border:1px solid var(--line);border-left:3px solid #b8281c;border-radius:4px;background:#17110c;padding:8px 10px}'
    + '.ar-h{font-size:11px;letter-spacing:1.5px;color:var(--dim);display:flex;justify-content:space-between;gap:8px}'
    + '.ar-h b{color:#d8c7a6;font-weight:700}'
    + '.ar-foes{display:flex;flex-wrap:wrap;gap:8px;margin:8px 0 4px}'
    + '.ar-foe{display:flex;flex-direction:column;align-items:center;width:92px;background:#0e0a07;border:1px solid #2c231a;border-radius:4px;padding:4px 2px 5px}'
    + '.ar-foe .n{font-size:20px;font-weight:700;color:var(--ink);line-height:1}'
    + '.ar-foe .w{font-size:10px;letter-spacing:.5px;color:var(--dim);text-align:center;margin-top:2px}'
    + '.ar-says{color:var(--ink);font-size:13px;margin:6px 0 2px}'
    + '.ar-purse{display:flex;justify-content:space-between;align-items:baseline;margin-top:8px;border-top:1px dashed #3a2f24;padding-top:7px}'
    + '.ar-purse span{font-size:11px;letter-spacing:1px;color:var(--dim)}.ar-purse b{font-size:18px;color:var(--gold)}'
    + '.ar-prize{margin-top:6px;color:#e0c15e;font-size:12px}'
    + '.ar-power{margin-top:6px;color:#c4553f;font-size:12px;letter-spacing:.3px}'
    + '.ar-rules{margin-top:8px;color:var(--dim);font-size:11px;line-height:1.45}'
    + '.ar-tag{display:inline-block;font-size:10px;letter-spacing:1px;padding:1px 5px;border:1px solid #6b2a20;color:#e9b9a8;border-radius:3px;margin-left:6px}'
    + '#sheet.ar-picking{max-height:100%!important;top:0}'
    + '#ar-pick .ar-top{display:flex;justify-content:space-between;align-items:center;gap:8px;min-height:44px;padding:0 52px}'
    + '#ar-pick .ar-top b{font-size:15px;letter-spacing:1.5px;color:var(--gold)}#ar-pick .ar-top span{font-size:11px;color:var(--dim);letter-spacing:.5px}'
    + '#ar-pick .ar-sum{margin:6px 0 10px;font-size:12px;color:var(--ink)}'
    + '#ar-pick .ar-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px}'
    + '.ar-man{position:relative;display:flex;flex-direction:column;align-items:center;gap:3px;background:#120d09;border:2px solid #2c231a;border-radius:6px;padding:8px 6px 7px;font:inherit;color:var(--ink);min-height:44px}'
    + '.ar-man.on{border-color:var(--gold);background:#1d150d}'
    + '.ar-man .ar-face{width:104px;height:104px;border:1px solid var(--line);border-radius:4px;background:#0b0907;image-rendering:pixelated}'
    + '.ar-man .ar-nm{font-size:13px;font-weight:700;text-align:center;line-height:1.15}'
    + '.ar-man .ar-lv{font-size:10px;letter-spacing:1px;color:var(--dim)}'
    + '.ar-man .ar-rank{font-size:10px;letter-spacing:1px;color:#e0c15e}'
    + '.ar-man .ar-hurt{font-size:10px;letter-spacing:1px;color:#c4553f}'
    + '.ar-man .ar-num{position:absolute;left:6px;top:6px;width:26px;height:26px;border-radius:13px;background:var(--gold);color:#1a120a;font-weight:700;font-size:15px;line-height:26px;text-align:center;display:none}'
    + '.ar-man.on .ar-num{display:block}'
    + '.ar-acc{display:flex;align-items:center;gap:6px;margin-top:3px;font-size:10px;color:#e9b9a8;letter-spacing:.4px}'
    + '.ar-slot{position:relative;width:26px;height:26px;border:1px solid #6b5a46;border-radius:3px;background:#0b0907;flex:none}'
    + '.ar-slot:before,.ar-slot:after{content:"";position:absolute;left:-3px;right:-3px;top:11px;height:3px;background:#d8341f;border-radius:2px}'
    + '.ar-slot:before{transform:rotate(45deg)}.ar-slot:after{transform:rotate(-45deg)}'
    + '.ar-acc s{color:#a8977c}'
    + '#ar-pick .ar-go{position:sticky;bottom:-14px;display:flex;gap:8px;margin:12px -12px -14px;padding:10px 12px 14px;background:rgba(22,17,12,.98);border-top:1px solid var(--line)}'
    + '#ar-pick .ar-go .act{flex:1 1 auto;justify-content:center}#ar-pick .ar-go .act.ar-fight{flex:2 1 auto;border:2px solid #b8281c;font-weight:700;letter-spacing:1.5px}#ar-pick .ar-go .act.ar-fight span{font-weight:700}';
  function css(){ if(document.getElementById('ar-css')) return; var s = el('style'); s.id = 'ar-css'; s.textContent = CSS; document.head.appendChild(s); }

  /* what the bookie says (draft:true attempts; a man who has kept a pit alive on tape and luck) */
  function says(t, c){
    if(!c) return 'Card is not up yet. Give me a minute, the board runs off the same battery as the lights.';
    if(t.fought) return 'You had your night. Card goes back up tomorrow. Come early, the good seats are the ones that still fold.';
    if(c.power && c.power.out) return 'Generator went dry this morning. The big ones are sick in the cold room, so tonight is half a card. Still pays.';
    if(c.fifth) return 'Fifth night. The bosses sit in the front row tonight, so the card is heavier. Win it and you walk out wearing something nobody else has.';
    return 'There it is. You see what you get, no surprises. Win and you get paid. Lose and you feed them.';
  }
  function cardEl(c){
    css();
    var w = el('div', 'ar-card'); w.dataset.card = c.id;
    var h = el('div', 'ar-h'); h.appendChild(el('span', null, c.tournament ? 'THE TOURNAMENT, ROUND ' + (c.tournament.round + 1) + ' OF ' + c.tournament.rounds : 'TONIGHT IN THE PIT'));
    h.appendChild(el('b', null, c.men + ' OF YOURS')); w.appendChild(h);
    var foes = el('div', 'ar-foes');
    c.lines.forEach(function(L){ var f = el('div', 'ar-foe'); f.dataset.foe = L.id; f.appendChild(body(L.id, 78)); f.appendChild(el('div', 'n', String(L.n))); f.appendChild(el('div', 'w', name(L.id, L.n))); foes.appendChild(f); });
    w.appendChild(foes);
    w.appendChild(el('div', 'ar-says', c.says.charAt(0).toUpperCase() + c.says.slice(1) + '.'));
    if(c.power && c.power.out) w.appendChild(el('div', 'ar-power', 'THE POWER IS OUT AT THE FARM: the big ones are off the card, the rest at half.'));
    if(c.fifth && c.prize){ var pg = E().V('pit_gear') || {}, g = pg[c.prize]; w.appendChild(el('div', 'ar-prize', 'THE FIFTH NIGHT: win it and take the ' + (g ? g.name : c.prize) + '. Nobody sells one.')); }
    var pr = el('div', 'ar-purse'); pr.appendChild(el('span', null, 'THE PURSE, ONLY IF YOU WIN')); pr.appendChild(el('b', null, c.purse + ' batteries')); w.appendChild(pr);
    w.appendChild(el('div', 'ar-rules', 'House rules: no collar, so whatever he wears on his belt stays outside. Nobody runs once the gate shuts. Nothing comes off the dead.'));
    return w;
  }

  /* the sheet for the pit: the screen hands its own helpers (speak, act, moneyWord, post, bats, S, openB) */
  function sheet(api, body, acts, line){
    var Ar = E(), S = api.S, day = Math.floor(S.mapDay != null ? S.mapDay : (S.day || 0));
    try{ document.getElementById('sheet').classList.remove('ar-picking'); }catch(e){}
    var t = Ar && Ar.ready() ? Ar.today(S.place.name, day) : null, c = t && t.card;
    body.appendChild(api.speak('arena', line || says(t || {}, c)));
    if(!c){ acts.appendChild(api.act('Wait for the card', '', function(){ api.openB('arena'); })); return; }
    body.appendChild(cardEl(c));
    if(t.fought) acts.appendChild(api.act('Come back tomorrow', 'one fight a day', function(){ api.hide(); }, true));
    acts.appendChild(api.act('Walk away', 'the card waits till morning', function(){ api.hide(); }));
  }
  function sub(S){ var Ar = E(); if(!Ar || !Ar.ready() || !S || !S.place) return 'the Mob\'s arena';
    var day = Math.floor(S.mapDay != null ? S.mapDay : (S.day || 0)), t = Ar.today(S.place.name, day);
    if(t.fought) return 'back tomorrow'; var c = t.card; if(!c) return 'the Mob\'s arena';
    return c.lines.map(function(L){ return L.n + ' ' + name(L.id, L.n); }).join(', ') + ', ' + c.purse + ' batteries'; }


  /* ---------- THE PICK (Paolo 11/3: 'I want it to be easier to choose the three people that go into the arena'; 'your accessory thing
     is X'd out and it won't apply as you enter the arena') ----------
     ONE SCREEN OF BIG FACES: every man the company has (the same men the fight would take: the crew screen's hand-over, the bench,
     the hires since, never a man who walked or died), the best three (five in a tournament) already picked by level, so a fight is
     one tap; tap a face to take him out or put him in. Each man's accessory slot is crossed out in red: there is no collar to put
     on, the slot simply does not count inside (the fight is handed him without it). */
  function J(k, d){ try{ var v = JSON.parse(localStorage.getItem(k) || 'null'); return v == null ? d : v; }catch(e){ return d; } }
  function crewList(){
    var co = J('bohemia.company.v1', null), line = J('bohemia.company.line.v1', null), hired = J('bohemia.hired.v1', []) || [];
    if(!Array.isArray(co) || !co.length){ try{ var tp = window.top && window.top.BOH_START && window.top.BOH_START.picks(); if(tp && tp.company) co = tp.company; }catch(e){} }
    var walked = (J('bohemia.walked.v1', []) || []).filter(function(x){ return x && x.dismissed; }).map(function(x){ return x.name; });
    (J('bohemia.taken.v1', []) || []).forEach(function(t){ ((t && t.names) || []).forEach(function(n){ walked.push(n); }); });
    var dead = function(n){ try{ return !!(window.BohemiaCondition && BohemiaCondition.isDead && BohemiaCondition.isDead(n)); }catch(e){ return false; } };
    var out = [], have = {}, sc = null, mm = J('bohemia.main.v1', null);
    try{ sc = window.BohemiaRoster && BohemiaRoster.startingCrew && BohemiaRoster.startingCrew(); }catch(e){ sc = null; }   /* an origin's men carry no look: the crew screen's own (lookFor) */
    (co || []).forEach(function(m, i){ if(!m) return; var n = m.name || (i === 0 ? 'YOU' : 'MAN ' + (i + 1)); if(walked.indexOf(n) >= 0 || dead(n) || have[n]) return; have[n] = 1;
      var lk = m.look || (i === 0 ? ((mm && mm.look) || 'you') : (sc && sc[i] && sc[i].look) || null);
      out.push({name: n, level: m.level || 1, look: lk, gear: m.gear || {}, you: i === 0}); });
    if(line && Array.isArray(line.bench)) line.bench.forEach(function(b){ var m = b && b.man; if(!m || !m.name || have[m.name] || walked.indexOf(m.name) >= 0 || dead(m.name)) return; have[m.name] = 1; out.push({name: m.name, level: m.level || 1, look: m.look, gear: m.gear || {}}); });
    hired.forEach(function(h){ if(!h || !h.name || have[h.name] || walked.indexOf(h.name) >= 0 || dead(h.name)) return; have[h.name] = 1; out.push({name: h.name, level: h.level || 1, look: h.look, gear: h.gear || {}}); });
    return out;
  }
  function hurt(n){ try{ var c = window.BohemiaCondition && BohemiaCondition.condFor && BohemiaCondition.condFor(n); return !!(c && (c.hpCut > 0.25 || (c.injury && c.injury.days > 0))); }catch(e){ return false; } }
  function faceEl(look){
    var c = document.createElement('canvas'); c.className = 'ar-face'; c.width = c.height = 64;
    var F = window.BohemiaCrewFaces;
    var dim = function(){ var x = c.getContext('2d'); c.width = c.height = 64; x.fillStyle = '#1a1410'; x.fillRect(0, 0, 64, 64); x.fillStyle = '#3b3026'; x.fillRect(22, 12, 20, 24); x.fillRect(14, 40, 36, 20); };
    dim();
    /* PORTRAIT's own head for his look (the crew screen's), once its manifest is in */
    if(look && F) F.ready(function(){ if(F.has(look)){ c.width = c.height = F.SIZE; F.draw(c.getContext('2d'), look, F.SIZE, dim); } });
    return c;
  }
  function pickSheet(api, c){
    css();
    var S = api.S, sh = document.getElementById('sheet'), body = document.getElementById('sbody'); body.textContent = '';
    if(sh) sh.classList.add('ar-picking');
    var men = crewList(), N = c.men;
    if(!A.rosterTried && men.some(function(m){ return !m.look; }) && window.BohemiaRoster && BohemiaRoster.load){ A.rosterTried = true;   /* the crew screen's looks, then the faces again */
      try{ BohemiaRoster.load(null, {people: false}).then(function(){ if(document.getElementById('ar-pick')) pickSheet(api, c); }).catch(function(){}); }catch(e){} }
    var chosen = men.slice().map(function(m, i){ return {m: m, i: i}; })
      .sort(function(a, b){ return (hurt(a.m.name) - hurt(b.m.name)) || (b.m.level - a.m.level) || (a.i - b.i); }).slice(0, N).map(function(x){ return x.m.name; });
    var w = el('div'); w.id = 'ar-pick'; w.dataset.card = c.id;
    var top = el('div', 'ar-top'); top.appendChild(el('b', null, 'WHO GOES IN')); top.appendChild(el('span', null, 'pick ' + N + (c.tournament ? ' for the tournament' : ''))); w.appendChild(top);
    w.appendChild(el('div', 'ar-sum', c.lines.map(function(L){ return L.n + ' ' + name(L.id, L.n); }).join(', ') + '. The purse: ' + c.purse + ' batteries, only on a win.'));
    var grid = el('div', 'ar-grid'); w.appendChild(grid);
    var go = el('div', 'ar-go'), back = api.act('Back', '', function(){ if(sh) sh.classList.remove('ar-picking'); api.openB('arena'); }), fight = api.act('FIGHT', '', function(){ start(); });
    fight.classList.add('ar-fight'); go.appendChild(back); go.appendChild(fight); w.appendChild(go);
    function paint(){
      [].forEach.call(grid.children, function(t){ var k = chosen.indexOf(t.dataset.man); t.classList.toggle('on', k >= 0); t.querySelector('.ar-num').textContent = k >= 0 ? String(k + 1) : ''; });
      fight.disabled = !chosen.length; fight.querySelector('span').textContent = chosen.length ? 'FIGHT WITH ' + chosen.length : 'PICK SOMEBODY';
    }
    men.forEach(function(m){
      var t = el('button', 'ar-man'); t.type = 'button'; t.dataset.man = m.name;
      t.appendChild(el('div', 'ar-num', ''));
      t.appendChild(faceEl(m.look));
      t.appendChild(el('div', 'ar-nm', m.you && m.name !== 'YOU' ? m.name + ' (YOU)' : m.name));
      t.appendChild(el('div', 'ar-lv', 'LEVEL ' + m.level));
      var rk = E() && E().rankOf(m.name); if(rk) t.appendChild(el('div', 'ar-rank', rk.name));
      if(hurt(m.name)) t.appendChild(el('div', 'ar-hurt', 'HURT'));
      var acc = el('div', 'ar-acc'); acc.dataset.acc = m.gear && m.gear.acc ? m.gear.acc : '';
      acc.appendChild(el('span', 'ar-slot'));
      var at = el('span'); if(m.gear && m.gear.acc){ var st = el('s', null, String(m.gear.acc).replace(/_/g, ' ')); at.appendChild(st); at.appendChild(document.createTextNode(' stays outside')); } else at.textContent = 'accessory: does not count';
      acc.appendChild(at); t.appendChild(acc);
      t.addEventListener('click', function(){ var k = chosen.indexOf(m.name); if(k >= 0) chosen.splice(k, 1); else if(chosen.length < N) chosen.push(m.name); else { chosen.shift(); chosen.push(m.name); } paint(); });
      grid.appendChild(t);
    });
    if(!men.length) grid.appendChild(el('div', 'ar-sum', 'Nobody in the company can fight. Hire at the post first.'));
    body.appendChild(w); paint(); api.show && api.show();
    function start(){
      if(!chosen.length) return;
      var pick = {card: {id: c.id, day: c.day, opp: c.opp, says: c.says, lines: c.lines, band: c.band, count: c.count, purse: c.purse, fifth: c.fifth, prize: c.prize, power: c.power, men: c.men, tournament: c.tournament, beast: c.beast}, men: chosen.slice()};
      window.__arenaPicked = pick;
      if(sh) sh.classList.remove('ar-picking');
      api.post('arena', {arena: pick});
      api.hide();
    }
  }

  /* ---------- THE WAY BACK: the bookie says how it went (the map sends BOHEMIA_ARENA_RESULT when the town opens again) ---------- */
  var BOUND = null, PEND = null;
  function bind(o){ BOUND = o; }
  function told(r){
    if(!r) return null;
    var who = (r.men || []).map(function(m){ return m.name; }), dead = (r.men || []).filter(function(m){ return m.dead; }).map(function(m){ return m.name; });
    var up = (r.ranks || []).map(function(g){ return g.name + ' is ' + (/^[AEIOU]/.test(g.rank_name) ? 'an ' : 'a ') + g.rank_name.toLowerCase() + ' now'; });
    var pg = E() && E().V('pit_gear'), g = r.prize && pg && pg[r.prize];
    if(r.won) return 'You won. ' + r.paid + ' batteries, like I said, counted out of the cash box.' + (up.length ? ' ' + up.join('. ') + '.' : '') + (g ? ' And the ' + g.name + ' is in your stash. Nobody else has one.' : '') + (dead.length ? ' We buried ' + dead.join(' and ') + ' behind the cages.' : '');
    return 'They lost. Crowd got its money\'s worth. No purse when you lose, that is the deal.' + (dead.length ? ' ' + dead.join(' and ') + ' did not get up. We put them behind the cages.' : ' Your men got carried out breathing.');
  }
  function tryTell(){
    if(!PEND || !BOUND) return;
    var S = typeof BOUND.S === 'function' ? BOUND.S() : BOUND.S; if(!S || !S.place || S.place.name !== town() || !BOUND.ready()) { if(PEND.tries++ < 60) setTimeout(tryTell, 250); return; }
    var line = told(PEND.r); PEND = null; try{ BOUND.openB('arena', line); }catch(e){}
  }
  window.addEventListener('message', function(ev){ var d = ev && ev.data; if(!d || d.type !== 'BOHEMIA_ARENA_RESULT') return; PEND = {r: d.result, tries: 0}; try{ if(E()) E().reload(); }catch(e){} setTimeout(tryTell, 300); });

  window.BohemiaArenaTown = {lastSpot: function(){ return A.last || null; }, bind: bind, told: told, pick: pickSheet, crew: crewList, whenReady: whenReady, spot: spot, draw: draw, lit: lit, sheet: sheet, sub: sub, card: cardEl, ready: function(){ return !!(A.pit && A.places); }, town: town};
})();
