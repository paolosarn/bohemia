/* SCAVENGE design round 11/7: photograph a real laid fight board through the demo's own door, on a phone.
   Nothing here is game code; it only drives the demo and saves pictures + the board's tile kinds. */
const path = require('path'), fs = require('fs');
const ROOT = '/home/user/bohemia';
const OUT = process.argv[2];
const SPOT = process.argv[3] || 'suburb';
(async () => {
  const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  const d = await drive.open({ keepCards: true, world: 1 });
  const fr = d.fr;
  for (let i = 0; i < 240; i++) { if (await fr.evaluate(() => !!(window.BohemiaStreetBoard && BohemiaStreetBoard.ready()))) break; await d.page.waitForTimeout(250); }
  const cell = JSON.parse(SPOT);
  console.log('cell', cell);
  await d.page.evaluate(c => { window.nfOpen({ type: 'BOHEMIA_CITY_ENCOUNTER', district: 'suburb', at: { gx: c[0], gy: c[1] }, label: 'scavenge-design', draft: true }); }, cell);
  let door = null;
  for (let i = 0; i < 160 && !door; i++) {
    await d.page.waitForTimeout(500);
    door = await d.page.evaluate(() => { try { const f = document.getElementById('fightFrame'), w = f && f.contentWindow, F = w && w.eval('FIGHT'); const B = F && F.S && F.S.boardDef;
      return B && F.S.board ? { laid: !!B.laid, houses: B.laid ? B.laid.houses : 0 } : null; } catch (e) { return null; } });
  }
  console.log('door', JSON.stringify(door));
  await d.page.waitForTimeout(7000);
  const uinfo = await d.page.evaluate(() => { const f = document.getElementById('fightFrame'), w = f.contentWindow, F = w.eval('FIGHT');
    const them = F.S.units.filter(u => u.side === 'them'); F.S.units = F.S.units.filter(u => u.side !== 'them');
    const hide = (doc) => { doc.querySelectorAll('body *').forEach(el => { if (el.children.length < 6 && /Drag a man|Your line, before/.test(el.textContent || '') && el.getBoundingClientRect().height < 200) el.style.visibility = 'hidden'; }); };
    hide(document); hide(w.document);
    const you = F.S.units.filter(u => u.side === 'you');
    const SPOTS = [[6, 3], [10, 4], [7, 7]]; you.forEach((u, i) => { if (SPOTS[i]) { u.x = SPOTS[i][0]; u.y = SPOTS[i][1]; } });
    return { removed: them.length, keys: Object.keys(you[0] || {}).slice(0, 80), you: you.map(u => ({ x: u.x, y: u.y, tx: u.tx, ty: u.ty, px: u.px, py: u.py, gx: u.gx, gy: u.gy })) };
  });
  console.log(JSON.stringify(uinfo));
  await d.page.waitForTimeout(3500);
  await d.page.screenshot({ path: path.join(OUT, 'board_phone.png') });
  const info = await d.page.evaluate(() => { try { const f = document.getElementById('fightFrame'), w = f.contentWindow, F = w.eval('FIGHT'); const B = F.S.boardDef, L = B.laid;
    const r = f.getBoundingClientRect();
    return { frame: [r.x, r.y, r.width, r.height], w: F.S.w, h: F.S.h, kinds: L ? L.tiles : null, ring: L ? L.ring : 0,
      sprites: L ? L.sprites.map(q => ({ kind: q.kind, name: q.name, tiles: q.tiles })).slice(0, 400) : [],
      cover: (B.cover || []).map(c => ({ piece: c.piece, x: c.x_m, y: c.y_m })).slice(0, 300), terrain: F.S.terrain };
  } catch (e) { return { err: String(e) }; } });
  fs.writeFileSync(path.join(OUT, 'board_info.json'), JSON.stringify(info));
  console.log('kinds rows', info.kinds && info.kinds.length, 'sprites', info.sprites && info.sprites.length, 'cover', info.cover && info.cover.length, info.err || '');
  await d.close();
})().catch(e => { console.error(e); process.exit(1); });
