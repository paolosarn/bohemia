/* THE INJURY CARD, BEFORE AND AFTER (INJURY, VAMILY rule 304, 11/3/26). Paolo 11/2 voted the card NO: 'ugly, cluttered, try
   again'. This draws one man after his THIRD knockdown (three scars, a fresh wound, -1 max HP) twice at the phone's width: on the
   card as it was (the commit before this lane, 95ba4314, its marks still listing their permanent penalties) and on the card as it
   is now (slices/bohemia_injury_card.js), the crew card's way and the clinic's way. The man's numbers come from the real engines
   (engine/bohemia_condition.js afterFight three times, engine/bohemia_long_injury.js); the old card is fed the old penalties (the
   marks' wiki effects added back), exactly what it drew.
   node tools/bohemia_injury_card_shots.js  ->  records/target/injury_card_before_11_3.png, records/target/injury_card_after_11_3.png */
'use strict';
const path = require('path'), fs = require('fs'), { execSync } = require('child_process');
const ROOT = path.join(__dirname, '..');
const { chromium } = require('playwright');
global.window = global;
const store = {}; global.localStorage = { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: k => { delete store[k]; } };
require(path.join(ROOT, 'engine/bohemia_long_injury.js'));
require(path.join(ROOT, 'engine/bohemia_condition.js'));
const C = global.BohemiaCondition, LI = global.BohemiaLongInjury;
const marks = ['missing_finger', 'broken_knee', 'missing_eye'];
marks.forEach((mk, i) => C.afterFight([{ name: 'TOMAS', hpMax: 58 - C.hpCut(C.get().men.TOMAS), hp: 0, down: true, injury: { id: mk }, laidUpDays: 7 }], { day: i * 10 }));
C.elapse(24 * 1.5, {});
const now = C.injuryOf('TOMAS');
/* the old card's input: the same man, his marks' wiki effects back in the penalties (what the old engine handed it) */
const old = JSON.parse(JSON.stringify(now));
marks.forEach(mk => { const m = LI.byId(mk); for (const k in m.effects) { const v = m.effects[k]; if (typeof v !== 'number') continue; const pct = /_pct$/.test(k); old.penalties.unshift({ stat: pct ? k.replace(/_pct$/, '') : k, value: v, unit: pct ? '%' : '', from: 'mark', id: m.id, name: m.name }); } });
const oldSrc = execSync('git show 95ba4314:slices/bohemia_injury_card.js', { cwd: ROOT }).toString();
const newSrc = fs.readFileSync(path.join(ROOT, 'slices/bohemia_injury_card.js'), 'utf8');
const liSrc = fs.readFileSync(path.join(ROOT, 'engine/bohemia_long_injury.js'), 'utf8').replace("var HASREQ = typeof module !== 'undefined' && module.exports;", 'var HASREQ = false;');
const page = (src, inj, label, oldHead) => '<!doctype html><meta charset="utf-8"><base href="file://' + path.join(ROOT, 'slices') + '/">'
  + '<style>body{margin:0;padding:16px;background:#0d0a07;color:#e9dccb;font:700 11px ui-monospace,monospace;width:358px}h1{font-size:11px;letter-spacing:2px;color:#a8988a;margin:0 0 6px}'
  + '.hurtbox{margin:6px 0 18px;padding:4px 6px;border:1px solid #6e2a20;border-radius:4px;background:#22130f;font-size:10px}.hurtbox b{color:#d0533c;letter-spacing:1px}.hurtbox i{display:block;font-style:normal;color:#a8988a}</style>'
  + '<h1>' + label + ' : THE CREW CARD</h1><div class="hurtbox" id="crew"></div><h1>' + label + ' : THE CLINIC</h1><div id="clinic"></div>'
  + '<script>' + liSrc + '</script><script>' + src + '</script><script>var inj=' + JSON.stringify(inj) + ';var hb=document.getElementById("crew");'
  + (oldHead
    ? 'var h=document.createElement("b");h.textContent="STRUCK DOWN, THE WOUND "+inj.daysLeft+" OF "+inj.wound.of+" DAYS";hb.appendChild(h);'
      + JSON.stringify(marks) + '.forEach(function(k){var m=BohemiaLongInjury.byId(k);var i=document.createElement("i");i.textContent="FOR GOOD: "+m.name.toUpperCase()+", "+m.effects_text.filter(function(x){return !/reserve/i.test(x)}).join(", ");hb.appendChild(i);});'
    : 'var h=document.createElement("b");h.textContent="HURT, STILL FIGHTING";hb.appendChild(h);')
  + 'hb.appendChild(BohemiaInjuryCard.build(document,inj,{clinic:true}));var i2=document.createElement("i");i2.textContent="He can fight. A clinic halves the days and the wound for 14 batteries.";hb.appendChild(i2);'
  + 'document.getElementById("clinic").appendChild(BohemiaInjuryCard.build(document,inj,{clinic:true,price:14,priceWord:"14 BATTERIES"}));</script>';
(async () => {
  const b = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  for (const [name, src, inj, oh] of [['before', oldSrc, old, true], ['after', newSrc, now, false]]) {
    const f = path.join(require('os').tmpdir(), 'injury_card_' + name + '.html'); fs.writeFileSync(f, page(src, inj, name.toUpperCase(), oh));
    const p = await b.newPage({ viewport: { width: 390, height: 640 }, deviceScaleFactor: 3 });
    await p.goto('file://' + f); await p.waitForTimeout(500);
    const h = await p.evaluate(() => document.body.scrollHeight);
    await p.screenshot({ path: path.join(ROOT, 'records/target/injury_card_' + name + '_11_3.png'), clip: { x: 0, y: 0, width: 390, height: Math.min(900, h + 16) } });
    console.log(name + ': ' + h + ' px tall');
  }
  console.log('the man: ' + JSON.stringify({ knocks: now.knocks, hpCut: now.hpCut, marks: now.marks, days: now.daysLeft, penalties: now.penalties.map(p => p.stat + p.value + p.unit) }));
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
