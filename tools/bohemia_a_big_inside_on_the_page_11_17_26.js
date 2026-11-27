// COOK FIVE 11/17/26, VAMILY rules 453, 441, 451(a): A BIG INSIDE ON THE PAGE (the hall's page tool, made to take any inside of
// slices/fight_ground/insides.json: the mall is the second). It changes nothing in the game: it opens the real fight page on a
// phone (390 x 844 and 844 x 390 at 2), asks for the inside by name (opts.inside, a named layout), and shoots what he meets: the
// opening view with the ceiling off (UI.noCeiling, the page test's own switch) and as the data file says, then close on named
// spots, as the page is (ask row 646 is fixed: nothing is mended in memory any more).
//   node tools/bohemia_a_big_inside_on_the_page_11_17_26.js <outdir> <hall|mall|warehouse|datafort|terminal|stadium|powerhouse|sphere|homecenter|hospital|prison|school|courthouse|swapmeet|truckstop|police|bank|library> [upright,sideways] [layout]
// writes <inside>_<shape>_open_a0.png, _open_a01.png, _<spot>_close.png and page_<shape>.json (the
// board's own count of stand-ins, the pieces with no picture, whether the ceiling's picture drew, a fight tile's size in points).
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.css': 'text/css', '.woff2': 'font/woff2' };
const SPOTS = { the_split_hall: { cots: [2.5, 4], mezz: [3, 1.6], stair_w: [16.5, 1.8], pallets: [13.5, 3.6], chairs: [13, 6.6], desk: [8, 12], column: [14, 9.6], airwall: [9, 6] },
  the_long_hall: { cots: [3, 5], mezz: [3, 1.6], pallets: [12, 4], chairs: [12, 7], desk: [8, 12], column: [10, 9] },
  the_atrium: { fronts: [2.5, 3.4], bridge: [9, 6.4], escalator: [5.6, 6.8], store: [2, 1.6], camp: [7.4, 1.4], tables: [13.6, 5], kiosk: [6, 5], rubble: [14, 6], lift: [8.6, 8], south_stores: [3, 12], fountain: [9, 7.4], mannequins: [1.6, 1.8], mannequins_s: [8, 11.6] },
  the_food_court: { fronts: [2.5, 3.4], bridge: [9, 6.4], tables: [13.6, 5] },
  the_lanes: { racks: [2.5, 3.6], mezz: [5, 1.4], stair: [12.4, 1.4], lane: [3, 4.4], camp: [12.6, 4.4], conveyor: [9, 11], forklift: [4.6, 11.2], trailer: [3.6, 13], cage: [16.6, 11], desk: [2, 12] },
  the_cross_dock: { racks: [2.5, 3.6], mezz: [5, 1.4] },
  the_checkpoint: { checkpoint: [9, 4.4], desks: [2, 4], gate: [11.4, 1.6], luggage: [5.6, 5.6], camp: [14, 3], walkway: [9.4, 12.4], newsstand: [14.6, 4] },
  the_baggage_hall: { carousel: [3, 4], camp: [2, 8], walkway: [6, 1.4] },
  the_white_space: { pod: [3, 4.4], gallery: [5, 1.4], stair: [13, 1.4], crac: [16.6, 2], pod_end: [3, 7], floor_up: [5.4, 6.4], desk: [13, 12.4], batteries: [7.5, 12.4], crates: [10, 5.2] },
  the_cages: { pod: [3, 4.4], gallery: [5, 1.4] },
  the_last_show: { stand: [5, 1.4], stairs: [1.4, 1.6], bench: [2, 2.4], rig: [9.4, 4], tents: [9.5, 6.6], supplies: [2, 4.4], wreck: [2, 7], torn: [4, 5.4], south_stand: [8, 12.6], fire: [17, 7] },
  the_bowl: { stand: [5, 1.4], tent: [10, 4.4], wreck: [2, 4.4], supplies: [6, 4.4] },
  the_generator_floor: { units: [6, 7], balcony: [5, 1.4], boards: [8, 8], hook: [10, 3], camp: [16, 11], wet: [3, 9], doors: [9, 13] },
  the_service_bay: { units: [10, 6], rotor: [17, 4], column: [14, 7], balcony: [6, 13] },
  the_horseshoe: { tiers: [8, 1.4], side_tiers: [2.5, 3.4], desk: [9.5, 4.4], panels: [5, 4.4], camp: [12, 5.4], torn: [9, 6.4], cases: [4, 6.4], stage: [10, 12.6], barricade: [8, 11.4] },
  the_screen_came_down: { screen: [10.5, 4.4], screen_w: [2.5, 9.4], tiers: [8, 1.4], desk: [6, 4.4], stage: [10, 12.6], camp: [12, 9.4] },
  the_store_and_the_garden: { racks: [5, 3.4], checkouts: [6, 11.4], yard: [16, 4.4], lumber: [5, 1.4], aisle: [7, 6.4] },
  the_long_aisles: { rental: [8, 6.4], lumber: [9, 1.4], racks: [9, 3.4], propane: [9, 10.4] },
  the_emergency_room: { bays: [4, 1.4], station: [10, 5.4], chairs: [4, 13.2], wet: [4, 4.4], carts: [7, 6.4] },
  the_ward: { beds: [3, 3.4], wet: [6, 3.4], fire: [3, 10.4] },
  the_dayroom: { cells: [5, 2.4], dayroom: [7, 4.4], picket: [11, 6.6], flood: [5, 4.4], tier: [9, 12.4] },
  the_two_units: { bars: [10, 5.4], cells: [2, 4.4], tier: [17, 6.4] },
  the_gym: { bleachers: [5, 1.4], cots: [3, 3.4], tables: [8, 6.4], mats: [6, 5.4], south_bleachers: [5, 12.4], court: [9, 7] },
  the_classrooms: { room: [3, 2.4], hallway: [6, 6.6], barricade: [5, 4.4] },
  the_courtroom: { pews: [5, 6.6], bench: [10.5, 2.2], jury: [4, 2.0], witness: [16, 2.0], aisle: [9.5, 9.0] },
  the_museum_floor: { cases: [4, 2.6], walls: [8, 5.6], kiosk: [7, 7.6], brick: [9, 1.4] },
  the_covered_rows: { stalls: [8, 2.6], sets: [4, 3.6], vans: [2, 1.6], booth: [9, 5.6] },
  the_food_court: { stands: [5, 5.6], picnic: [4, 2.6] },
  // (COOK SEVEN 11/27) the truck stop: its bay shares a layout name with the powerhouse's, so an inside's own spots are keyed 'inside:layout'
  'truckstop:the_travel_store': { coolers: [3, 1.4], shelving: [5, 3.4], hotcase: [6, 6.4], island: [9.5, 6.8], booths: [4, 7.4], counter: [5, 12.4] },
  'truckstop:the_service_bay': { cab: [4, 3.4], trailer: [6, 3.4], lift: [9.5, 4.6], tires: [1.5, 1.4], compressor: [9.5, 7.4] },
  'police:the_squad_room': { cells: [5, 1.6], desks: [5, 5.4], counter: [9.5, 5.6], glass: [9.5, 8.6], lockers: [14, 12.4], evidence: [2, 12.4] },
  'police:the_sally_port': { car: [6, 3.6], cages: [2, 1.4], barrier: [9.5, 2.4] },
  'bank:the_banking_hall': { glass: [4, 3.6], desks: [2, 6.4], stations: [5, 1.6], column: [4, 7.4], island: [10, 7.6] },
  'bank:the_vault_floor': { vaultdoor: [5, 5.6], boxes: [8, 5.4], cage: [2, 1.4], tables: [7, 1.6] },
  'library:the_stacks': { stacks: [5, 2.4], heap: [6, 3.6], readers: [3, 1.4] },
  'library:the_reading_room': { catalogue: [2, 1.4], desk: [9, 6.6], tables: [4, 3.6] } };
const INSIDES = { hall: { district: 'convention', layout: 'the_split_hall' }, mall: { district: 'mall', layout: 'the_atrium' }, warehouse: { district: 'warehouse', layout: 'the_lanes' }, datafort: { district: 'datafort', layout: 'the_white_space' }, terminal: { district: 'terminal', layout: 'the_checkpoint' }, stadium: { district: 'stadium', layout: 'the_last_show' }, powerhouse: { district: 'dam', layout: 'the_generator_floor' }, sphere: { district: 'sphere', layout: 'the_horseshoe' }, homecenter: { district: 'hardware', layout: 'the_store_and_the_garden' }, hospital: { district: 'medical', layout: 'the_emergency_room' }, prison: { district: 'prison', layout: 'the_dayroom' }, school: { district: 'school', layout: 'the_gym' }, courthouse: { district: 'mobmuseum', layout: 'the_courtroom' }, swapmeet: { district: 'swapmeet', layout: 'the_covered_rows' }, truckstop: { district: 'truckstop', layout: 'the_travel_store' }, police: { district: 'policestation', layout: 'the_squad_room' }, bank: { district: 'bank', layout: 'the_banking_hall' }, library: { district: 'library', layout: 'the_stacks' } };
(async () => {
  const out = process.argv[2], inside = process.argv[3] || 'hall', shapes = (process.argv[4] || 'upright,sideways').split(','), layout = process.argv[5] || INSIDES[inside].layout;
  fs.mkdirSync(out, { recursive: true });
  const srv = http.createServer((q, r) => { const u = decodeURIComponent(q.url.split('?')[0]), f = path.join(ROOT, u);
    if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end(); }
    r.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r); }).listen(0);
  const { chromium } = require('playwright'); const br = await chromium.launch(); const errs = [], lost = [];
  for (const shape of [['upright', 390, 844], ['sideways', 844, 390]].filter(s => shapes.indexOf(s[0]) >= 0)) {
    const ctx = await br.newContext({ viewport: { width: shape[1], height: shape[2] }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
    const p = await ctx.newPage(); p.on('pageerror', e => errs.push(String(e && e.message || e)));
    p.on('response', r => { if (r.status() >= 400 && /fight_ground/.test(r.url())) lost.push(r.url().split('/slices/')[1]); });
    await p.addInitScript(o => { window.FIGHT_OPTS = o; try { localStorage.clear(); } catch (e) {} },
      { district: INSIDES[inside].district, cell: [40, 40], seed: 21, speed: 1, inside: inside, insideAsk: { layout: layout, flip: [false, false] } });
    await p.goto('http://localhost:' + srv.address().port + '/slices/BOHEMIA_FIGHT.html', { waitUntil: 'load' });
    await p.waitForFunction(() => { try { return !!eval('FIGHT').S.boardDef && document.getElementById('load').style.display === 'none'; } catch (e) { return false; } }, null, { timeout: 180000 });
    await p.waitForTimeout(3500);
    const info = await p.evaluate(() => { const S = eval('FIGHT').S, B = S.boardDef, U = eval('UI');
      return { board: B.name, inside: B.inside, ceiling: B.ceiling && { have: B.ceiling.have, src: B.ceiling.src, alpha: B.ceiling.alpha, tile: B.ceiling.tile }, drew: U.ceilOn,
        tile_points: Math.round(U.tw * U.zoom * 10) / 10, zoom: [U.zoom, U.far, U.near, U.max] }; });
    info.shape = shape[0]; info.layout = layout; console.log(shape[0], JSON.stringify(info));
    const shot = async (tag) => { await p.waitForTimeout(700); await p.screenshot({ path: path.join(out, inside + '_' + shape[0] + '_' + tag + '.png') }); };
    await p.evaluate(() => { eval('UI').noCeiling = true; }); await shot('open_a0');
    await p.evaluate(() => { eval('UI').noCeiling = false; }); await shot('open_a01');
    // CLOSE IN, as the page is. (Ask row 646, an inside's furniture not drawn close in once the camera stops, was FIXED by COMBAT
    // THREE in BUILD 11/17zl: groundOn draws on the canvas it is given. Until then this tool turned the three calls in memory and
    // named its shots 'held'. It counts the old calls still: 0 on a mended page, and nothing is turned.)
    const aim = async (at) => { await p.evaluate(([tx, ty]) => { const U = eval('UI'); eval('camMine')(); U.zoom = U.near; U.cx = (tx + 0.5) * U.tw; U.cy = (ty + 0.5) * U.th; eval('clampCam')(); }, at); };
    info.old_calls = await p.evaluate(() => (String(window.groundOn).match(/cxDraw\(/g) || []).length);
    for (const [name, at] of Object.entries(SPOTS[inside + ':' + layout] || SPOTS[layout] || {})) { await aim(at); await shot(name + '_close'); }
    info.lost = lost.slice(); info.errors = errs.slice(0, 4);
    fs.writeFileSync(path.join(out, 'page_' + shape[0] + '.json'), JSON.stringify(info, null, 1));
    await ctx.close();
  }
  await br.close(); srv.close(); console.log('errors', errs.length, errs.slice(0, 3), 'lost', lost.length, lost.slice(0, 4));
})();
