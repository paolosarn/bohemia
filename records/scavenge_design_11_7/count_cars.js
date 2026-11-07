/* SCAVENGE design round 11/7: how many blocks' boards carry a dead car (the siphon's spot)? Reads the map's own plan, builds nothing. */
const path = require('path');
const ROOT = '/home/user/bohemia';
(async () => {
  const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  const d = await drive.open({ keepCards: true, world: 1 });
  const fr = d.fr;
  for (let i = 0; i < 240; i++) { if (await fr.evaluate(() => !!(window.BohemiaStreetBoard && BohemiaStreetBoard.ready()))) break; await d.page.waitForTimeout(250); }
  const r = await fr.evaluate(() => {
    const N = om.n, out = {}; let n = 0; const t0 = performance.now();
    for (let y = 6; y < N - 6; y += 3) for (let x = 6; x < N - 6; x += 3) {
      if (performance.now() - t0 > 90000) break;
      const t = om.at(x, y); const dist = t && t.district || ''; if (!dist) continue;
      let p; try { p = BohemiaStreetBoard.plan({ gx: x, gy: y }, 20, 15, 10); } catch (e) { continue; }
      if (!p || p.err) continue; n++;
      const o = out[dist] = out[dist] || { boards: 0, withCar: 0, carTiles: 0, withRoad: 0, withHouse: 0, withOpen: 0, kinds: {} };
      o.boards++;
      let cars = 0, road = 0, house = 0, open = 0;
      for (let ay = 10; ay < 25; ay++) for (let ax = 10; ax < 30; ax++) { const i = ay * p.AW + ax, k = p.kind[i]; o.kinds[k] = (o.kinds[k] || 0) + 1;
        if (p.car[i]) cars++; if (k === 'road' || k === 'freeway') road++; if (k === 'house' || k === 'trailer') house++; if (k === 'yard' || k === 'lot' || k === 'dirt' || k === 'parking' || k === 'desert' || k === 'plaza') open++; }
      if (cars) o.withCar++; o.carTiles += cars; if (road) o.withRoad++; if (house) o.withHouse++; if (open) o.withOpen++;
    }
    return { n, out };
  });
  console.log(JSON.stringify(r));
  await d.close();
})().catch(e => { console.error(e); process.exit(1); });
