/* BOHEMIA KILL TALLY -- EVERY MAN'S FIGHTS, KILLS AND THE STRONGEST FOE HE EVER PUT DOWN (WORDS, rule 316, ask line 311, Paolo 11/2:
   'Battle Brothers keeps track of how many kills a character has and their strongest opponent... when your mouse was hovering over
   the character... on my phone, maybe when I just hold on him... display the amount of kills they've gotten').
   BATTLE BROTHERS' WAY: a brother's sheet carries his lifetime stats, battles fought, kills, and the most powerful opponent he
   vanquished, the one whose experience value was the highest of every enemy he killed (its name and its kind are kept). Here the
   same three, for his whole career:
     * HIS OWN RECORD. The tally rides in the man's own saved record (bohemia.climb.v1[name].tally, the crew screen's record of his
       level, gear and wounds), so a man renamed keeps it (the crew screen reads his old name's record, m.was) and a dead man's
       record keeps his. The fights the crew screen has not read yet (the shell's bohemia.fight.after.v1 queue, each row with his
       kills and his best foe off the fight) count on top until it does, exactly the way the end screen counts his XP.
     * A FOE'S WORTH is his experience value (the fight's t.xp, Battle Brothers' own XPValue); a tie goes to the higher level.
     * OLD SAVES start at 0 and count from the first fight after this shipped (nothing before it was kept).
   THE CARD (a long press on one of his men, on the phone, in the fight, the camp and the map; the end screen too): his face, his
   name, 'n KILLS · n FIGHTS', 'BEST: the strongest foe'. A finger held HOLD_MS without moving opens it; the next touch anywhere
   closes it; it never covers what it is about longer than it is held up.
     BohemiaKillTally.of(name, was?) -> {fights, kills, best:{name, kind, xp, boss}|null}
     BohemiaKillTally.add(tally, row) / better(a, b) / line(tally) / bestWord(best) / foeOf(unit)
     BohemiaKillTally.card(doc, men[{name, was, look, main, tally?, extra?:{kills, best}}], at{x, y}, face?) / hide(doc) / hold(el, fn)
   Words are attempts, draft:true. */
(function (root) {
  'use strict';
  var CKEY = 'bohemia.climb.v1', AKEY = 'bohemia.fight.after.v1', HOLD_MS = 450;
  function ls(k, d) { try { var v = JSON.parse(root.localStorage.getItem(k) || 'null'); return v == null ? d : v; } catch (e) { return d; } }
  function up(n) { return String(n || '').trim().toUpperCase(); }
  function blank() { return { fights: 0, kills: 0, best: null }; }
  function clean(t) { t = t || {}; return { fights: t.fights | 0, kills: t.kills | 0, best: t.best && t.best.name ? { name: String(t.best.name), kind: t.best.kind || null, xp: +t.best.xp || 0, lv: +t.best.lv || 0, boss: !!t.best.boss } : null }; }
  /* is foe a stronger than foe b (Battle Brothers: the higher experience value; a tie, the higher level) */
  function better(a, b) { if (!a || !a.name) return false; if (!b || !b.name) return true; return (+a.xp || 0) > (+b.xp || 0) || ((+a.xp || 0) === (+b.xp || 0) && (+a.lv || 0) > (+b.lv || 0)); }
  /* a man of theirs as a foe worth keeping (the fight calls it at the kill) */
  function foeOf(t) { return t ? { name: String(t.name || '?'), kind: t.kind || null, xp: +t.xp || 0, lv: +t.level || 0, boss: !!t.boss } : null; }
  /* one fight's row folded in: one fight more, his kills, the better of the two best */
  function add(t, r) { t = clean(t); if (!r) return t; t.fights += 1; t.kills += r.kills | 0; if (r.best && better(r.best, t.best)) t.best = clean({ best: r.best }).best; return t; }
  function of(name, was) {
    var c = ls(CKEY, {}) || {}, rec = c[name] || (was && c[was]) || null;
    if (!rec) { var U = up(name); for (var k in c) if (up(k) === U) { rec = c[k]; break; } }
    var t = clean(rec && rec.tally);
    (ls(AKEY, []) || []).forEach(function (f) { ((f && f.rows) || []).forEach(function (r) { if (r && (r.name === name || (was && r.name === was))) t = add(t, r); }); });
    return t;
  }
  /* the foe as he reads on a line: a boss or a name that is already a name keeps it, a kind gets 'A' */
  function bestWord(b) {
    if (!b || !b.name) return '';
    var n = up(b.name).replace(/\s+\d+$/, '');
    if (b.boss || /^(THE|EL|LA|BIG|OLD)\s/.test(n) || /'S\s/.test(n)) return n;
    return (/^[AEIOU]/.test(n) ? 'AN ' : 'A ') + n;
  }
  function line(t) { t = clean(t); var k = t.kills + (t.kills === 1 ? ' KILL' : ' KILLS');
    return t.best ? k + ', BEST: ' + bestWord(t.best) : t.fights ? k + ' IN ' + t.fights + (t.fights === 1 ? ' FIGHT' : ' FIGHTS') : 'NO KILLS YET'; }
  /* ---------- the card ---------- */
  var CSS = '.bkt-card{position:fixed;z-index:2147483000;min-width:200px;max-width:min(300px,calc(100vw - 32px));padding:8px 10px 9px;background:#1c1611;color:#efe3c8;border:1px solid #5a4630;border-radius:6px;box-shadow:0 6px 18px rgba(0,0,0,.6);font:12px/1.35 BohemiaROM,ui-monospace,Menlo,monospace;pointer-events:none;animation:bktin 140ms ease-out}'
    + '@keyframes bktin{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}'
    + '.bkt-card .bkt-row{display:flex;gap:9px;align-items:center}.bkt-card .bkt-row+.bkt-row{margin-top:7px;padding-top:7px;border-top:1px solid #3a2f24}'
    + '.bkt-card canvas{width:44px;height:44px;flex:0 0 44px;border-radius:3px;image-rendering:pixelated;background:#0b0907}'
    + '.bkt-card b{display:block;font:14px/1.1 BohemiaCasing,ui-sans-serif,sans-serif;letter-spacing:1.5px;color:#e2bd6a}'
    + '.bkt-card .bkt-k{font-size:13px;letter-spacing:.5px}.bkt-card .bkt-b{color:#c4b190;font-size:11px;letter-spacing:.3px}'
    + '.bkt-card{max-height:calc(100vh - 32px);overflow:hidden}.bkt-card.bkt-many canvas{width:30px;height:30px;flex-basis:30px}.bkt-card.bkt-many .bkt-row+.bkt-row{margin-top:4px;padding-top:4px}'
    + '.bkt-card.bkt-many b{font-size:12px;display:inline;margin-right:6px}.bkt-card.bkt-many .bkt-k{display:inline;font-size:11px}.bkt-card.bkt-many .bkt-b{font-size:10px}';
  function style(doc) { if (doc.getElementById('bkt-css')) return; var s = doc.createElement('style'); s.id = 'bkt-css'; s.textContent = CSS; (doc.head || doc.documentElement).appendChild(s); }
  function faceInto(cv, m, face) {
    var x = cv.getContext('2d'), miss = function () { x.fillStyle = '#2a2119'; x.fillRect(0, 0, 64, 64); x.fillStyle = '#a8977c'; x.font = 'bold 28px monospace'; x.textAlign = 'center'; x.fillText(String(m.main ? 'Y' : m.name || '?').charAt(0), 32, 42); };
    try { if (face) { face(cv, m); return; } var F = root.BohemiaCrewFaces, look = m.look || (m.main ? 'you' : null); if (look && F && F.draw) F.draw(x, look, 64, miss); else miss(); } catch (e) { miss(); }
  }
  function hide(doc) { doc = doc || root.document; var c = doc && doc.getElementById('bkt-card'); if (c) c.remove(); }
  function card(doc, men, at, face) {
    doc = doc || root.document; style(doc); hide(doc);
    var el = doc.createElement('div'); el.id = 'bkt-card'; el.className = 'bkt-card' + ((men || []).length > 3 ? ' bkt-many' : ''); el.setAttribute('role', 'status');
    (men || []).slice(0, 12).forEach(function (m) {
      var t = m.tally ? clean(m.tally) : of(m.name, m.was);
      if (m.extra) { t.fights += m.extra.fights | 0; t.kills += m.extra.kills | 0; if (m.extra.best && better(m.extra.best, t.best)) t.best = clean({ best: m.extra.best }).best; }
      var row = doc.createElement('div'); row.className = 'bkt-row'; row.dataset.man = m.name;
      var cv = doc.createElement('canvas'); cv.width = 64; cv.height = 64; faceInto(cv, m, face); row.appendChild(cv);
      var w = doc.createElement('div');
      var b = doc.createElement('b'); b.textContent = m.main ? 'YOU' : up(m.name); w.appendChild(b);
      var k = doc.createElement('div'); k.className = 'bkt-k'; k.textContent = t.kills + (t.kills === 1 ? ' KILL' : ' KILLS') + ' · ' + t.fights + (t.fights === 1 ? ' FIGHT' : ' FIGHTS'); w.appendChild(k);
      var bb = doc.createElement('div'); bb.className = 'bkt-b'; bb.textContent = t.best ? 'BEST: ' + bestWord(t.best) : 'NOBODY WORTH NAMING YET'; w.appendChild(bb);   /* draft:true */
      row.appendChild(w); el.appendChild(row); el.dataset.kills = String((el.dataset.kills | 0) + t.kills);
    });
    doc.body.appendChild(el);
    /* over the finger, inside the glass, 16 px off every edge */
    var W = doc.documentElement.clientWidth || 390, Hh = doc.documentElement.clientHeight || 844, r = el.getBoundingClientRect();
    var x = Math.max(16, Math.min(W - r.width - 16, ((at && at.x) || W / 2) - r.width / 2)), y = ((at && at.y) || Hh / 2) - r.height - 28;
    if (y < 16) y = Math.min(Hh - r.height - 16, ((at && at.y) || 0) + 28);
    el.style.left = Math.round(x) + 'px'; el.style.top = Math.round(Math.max(16, y)) + 'px';
    var off = function () { doc.removeEventListener('pointerdown', off, true); setTimeout(function () { hide(doc); }, 0); };
    setTimeout(function () { doc.addEventListener('pointerdown', off, true); }, 0);
    root.__TALLY_CARD = { at: Date.now(), men: (men || []).map(function (m) { return m.name; }), kills: el.dataset.kills | 0 };
    return el;
  }
  /* a finger held still on el for HOLD_MS calls fn(event, point); the click that follows the lift is eaten */
  function hold(el, fn) {
    var t = null, p = null, held = false;
    el.addEventListener('pointerdown', function (e) { held = false; p = { x: e.clientX, y: e.clientY }; clearTimeout(t);
      t = setTimeout(function () { held = true; try { fn(e, p); } catch (x) {} }, HOLD_MS); });
    var stop = function (e) { if (e && e.type === 'pointermove' && p && Math.abs(e.clientX - p.x) + Math.abs(e.clientY - p.y) < 10) return; clearTimeout(t); };
    el.addEventListener('pointermove', stop); el.addEventListener('pointerup', stop); el.addEventListener('pointercancel', stop);
    el.addEventListener('click', function (e) { if (held) { held = false; e.stopPropagation(); e.preventDefault(); } }, true);
    el.addEventListener('contextmenu', function (e) { e.preventDefault(); });
  }
  var API = { of: of, add: add, better: better, foeOf: foeOf, line: line, bestWord: bestWord, card: card, hide: hide, hold: hold, HOLD_MS: HOLD_MS, clean: clean };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  root.BohemiaKillTally = API;
})(typeof window !== 'undefined' ? window : this);
