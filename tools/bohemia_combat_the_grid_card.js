#!/usr/bin/env node
/* COMBAT [the fight holds the grid] (rule 117(e)), the VOTE card's pictures, from the game's camera on his phone's profile
   (390x844 at 3x, the one driver): (1) a pack of nine (dire wolves and hyenas, FACTIONS' early pack) at the open against the
   twelve; (2) fourteen against forty at the open; (3) a finger held on a dire wolf: its bite's card, the numbers from the wiki.
   Writes slices/vote/COMBAT_THE_FIGHT_HOLDS_THE_GRID_10_18.jpg (three phone frames side by side, phone-size jpeg).
   Run: node tools/bohemia_combat_the_grid_card.js */
'use strict';
const path = require('path'), fs = require('fs'), os = require('os');
const ROOT = path.join(__dirname, '..');
const { open } = require('./bohemia_drive_the_demo.js');
const crew = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/ours.json'), 'utf8')).crew.value;
const company = n => Array.from({ length: n }, (_, i) => ({ background: crew[i % crew.length].background, level: 1 }));
const OUT = path.join(ROOT, 'slices/vote/COMBAT_THE_FIGHT_HOLDS_THE_GRID_10_18.jpg');
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'grid-card-'));

async function frame(opts, after) {
  const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, arm: 'window.FIGHT_OPTS=' + JSON.stringify(opts) });
  const p = d.page;
  const t0 = Date.now();
  while (Date.now() - t0 < 40000 && !(await p.evaluate(() => typeof FIGHT_UI !== 'undefined' && !!FIGHT_UI.board && document.getElementById('load').style.display === 'none'))) await p.waitForTimeout(150);
  await p.waitForTimeout(1200);
  if (after) await after(p);
  const f = path.join(TMP, String(Date.now()) + '.png');
  await p.screenshot({ path: f });
  await d.close();
  return f;
}

(async () => {
  const shots = [];
  shots.push(await frame({ seed: 11, kind: 'suburb', deploy: false, night: false, company: company(12), cap: 14, party: { faction: 'beasts', count: 9, days: 1 } }));
  shots.push(await frame({ seed: 12, kind: 'scrub', deploy: false, night: false, company: company(14), cap: 14, party: { faction: 'beasts', count: 40, days: 1 } }));
  shots.push(await frame({ seed: 11, kind: 'suburb', deploy: false, night: false, company: company(12), cap: 14, party: { faction: 'beasts', count: 9, days: 1 } }, async p => {
    /* a real finger held on the nearest dire wolf: the board's own hold (HOLD_MS) opens its card */
    const at = await p.evaluate(() => { const v = FIGHT.S.units.filter(u => u.beast && FIGHT.onField(u) && FIGHT.shown(u) && u.kind === 'direwolf')
      .sort((a, b) => a.x - b.x)[0]; return { x: sx((v.x + .5) * FIGHT_UI.tw), y: sy((v.y + .6) * FIGHT_UI.th) }; });
    await p.mouse.move(at.x, at.y); await p.mouse.down(); await p.waitForTimeout(700);
    const card = await p.evaluate(() => { const d = document.getElementById('drawer'); return d.style.display === 'block' ? d.textContent : ''; });
    await p.mouse.up();
    await p.waitForTimeout(100);
    if (!/TEETH/.test(card) || !/30 to 50/.test(card)) throw new Error('the held wolf did not show its bite: ' + card.slice(0, 120));
    console.log('held card: ' + card.replace(/\s+/g, ' ').slice(0, 160));
  }));
  /* three phone frames side by side, a gap of the board's own dark between them, at a third of the device pixels */
  const py = 'from PIL import Image\nimport sys\nfs=sys.argv[2:]\nims=[Image.open(f).convert("RGB") for f in fs]\nw,h=ims[0].size\ns=0.4\nW,H=int(w*s),int(h*s)\nG=12\nout=Image.new("RGB",(W*len(ims)+G*(len(ims)+1),H+2*G),(42,34,25))\nfor i,im in enumerate(ims):\n  out.paste(im.resize((W,H),Image.LANCZOS),(G+i*(W+G),G))\nout.save(sys.argv[1],quality=74)\nprint(out.size)';
  fs.writeFileSync(path.join(TMP, 'sheet.py'), py);
  const r = require('child_process').spawnSync('python3', ['-I', path.join(TMP, 'sheet.py'), OUT].concat(shots), { encoding: 'utf8' });
  if (r.status) throw new Error(r.stderr);
  console.log(path.relative(ROOT, OUT) + ' ' + r.stdout.trim() + ' ' + Math.round(fs.statSync(OUT).size / 1024) + ' KB');
})().catch(e => { console.error(e); process.exit(1); });
