#!/usr/bin/env node
/* THE STAT ICONS (UI [the PC playtest: the UI's part] (3), rule 164 item 4, Paolo 10/24 on his PC: 'we need awesome logos for
   everything... Battle Brothers has logos too, a heart, a shield'). A picture beside every stat, Battle Brothers' way, built
   with light and form (tools/bohemia_ui_stat_icons.py), laid on by slices/bohemia_ui_materials.js __THE_STAT_ICONS__. Legs:
   I1  eight icons, one per stat of engine/bohemia_roster.js STATS, each 72 x 72 (24 points at 3 phone pixels), each a SOLID:
       lit on the sun's side (upper left) brighter than its shade side, many tones, an inked outline (read off the pixels);
   I2  the tool is seeded: run again, the same eight files byte for byte;
   I3  on the demo, the crew screen (C on the map, the one crew door) shows all eight beside their names, each its own picture,
       24 points, on his phone;
   I4  the fight's drawer (a tap on a man's name): Health, Fatigue, Resolve, Initiative and both skill rows wear their icons;
   I5  nothing thrown.
   Run: node gates/the_stat_icons_gate.js */
'use strict';
const path = require('path'), fs = require('fs'), cp = require('child_process'), os = require('os');
const ROOT = path.resolve(__dirname, '..');
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const STATS = ['hp', 'fatigue', 'resolve', 'initiative', 'melee_skill', 'ranged_skill', 'melee_defense', 'ranged_defense'];

(async () => {
  /* I1: read the pixels with the image library the tool uses */
  const py = 'import json,sys\nfrom PIL import Image\nout={}\nfor k in sys.argv[2:]:\n  im=Image.open(sys.argv[1]+"/"+k+".png").convert("RGBA"); W,H=im.size; px=im.load()\n'
    + '  sol=[(x,y) for y in range(H) for x in range(W) if px[x,y][3]==255]\n  lum=lambda p:0.2126*p[0]+0.7152*p[1]+0.0722*p[2]\n'
    + '  xs=[x for x,y in sol]; ys=[y for x,y in sol]; cx=sum(xs)/len(xs); cy=sum(ys)/len(ys)\n'
    + '  lit=[lum(px[x,y]) for x,y in sol if (x-cx)+(y-cy)<-6 and lum(px[x,y])>30]; dark=[lum(px[x,y]) for x,y in sol if (x-cx)+(y-cy)>6 and lum(px[x,y])>30]\n'
    + '  tones=len(set(px[x,y][:3] for x,y in sol)); ink=sum(1 for x,y in sol if px[x,y][:3]==(12,8,5))\n'
    + '  out[k]={"w":W,"h":H,"lit":sum(lit)/max(1,len(lit)),"dark":sum(dark)/max(1,len(dark)),"tones":tones,"ink":ink}\nprint(json.dumps(out))\n';
  const read = (dir) => JSON.parse(cp.execFileSync('python3', ['-c', py, dir].concat(STATS)).toString());
  let R = null; try { R = read(path.join(ROOT, 'slices/stat_icons')); } catch (e) { R = null; }
  const bad = R ? STATS.filter(k => !(R[k].w === 72 && R[k].h === 72 && R[k].lit > R[k].dark * 1.05 && R[k].tones >= 24 && R[k].ink >= 40)) : STATS;
  leg(!!R && bad.length === 0, 'I1  EIGHT ICONS, 72 x 72, EACH A LIT SOLID (THE SUN\'S SIDE BRIGHTER, MANY TONES, AN INKED EDGE)',
    R ? STATS.map(k => k + ' ' + Math.round(R[k].lit) + '/' + Math.round(R[k].dark) + ' ' + R[k].tones + 't').join(', ') : 'unreadable');
  /* I2 */
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'staticons-'));
  let same = 0;
  try { const src = fs.readFileSync(path.join(ROOT, 'tools/bohemia_ui_stat_icons.py'), 'utf8').replace("OUT = os.path.join(ROOT, 'slices', 'stat_icons')", 'OUT = ' + JSON.stringify(tmp))
      .replace("sheet.save(os.path.join(ROOT, 'records', 'target', 'UI_THE_STAT_ICONS_10_25_26.png'))", 'pass');
    fs.writeFileSync(path.join(tmp, 'tool.py'), src.replace("ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))", 'ROOT = ' + JSON.stringify(ROOT)));
    cp.execFileSync('python3', [path.join(tmp, 'tool.py')]);
    same = STATS.filter(k => fs.readFileSync(path.join(tmp, k + '.png')).equals(fs.readFileSync(path.join(ROOT, 'slices/stat_icons', k + '.png')))).length; } catch (e) {}
  leg(same === 8, 'I2  THE TOOL IS SEEDED: RUN AGAIN, THE SAME EIGHT FILES', same + ' of 8');
  const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  const errs = [];
  {
    const d = await open({ profile: 'phone_portrait' });
    const p = d.page, fr = d.fr;
    await p.waitForTimeout(2000); try { await d.clearCards(); } catch (_e) {}
    await fr.evaluate(() => BohemiaMaterials.ten.crewDoor());
    const rf = await (await fr.waitForSelector('#crewdoor iframe', { timeout: 30000 })).contentFrame();
    await rf.waitForFunction(() => document.querySelectorAll('.stats [data-stat]').length >= 8, null, { timeout: 30000 }).catch(() => {});
    await p.waitForTimeout(800);
    const rows = await rf.evaluate(() => [...document.querySelectorAll('.stats [data-stat]')].map(r => { const cs = getComputedStyle(r.querySelector('span'), '::before');
      return { k: r.dataset.stat, bg: cs.backgroundImage, w: parseFloat(cs.width), h: parseFloat(cs.height) }; }));
    const imgs = await rf.evaluate(async (ks) => { const o = {}; for (const k of ks) { const im = new Image(); im.src = 'stat_icons/' + k + '.png'; try { await im.decode(); o[k] = im.naturalWidth; } catch (e) { o[k] = 0; } } return o; }, STATS);
    leg(rows.length === 8 && STATS.every(k => { const r = rows.find(x => x.k === k); return r && r.bg.indexOf('stat_icons/' + k + '.png') >= 0 && r.w === 24 && r.h === 24 && imgs[k] === 72; }) && new Set(rows.map(r => r.bg)).size === 8,
      'I3  THE CREW SCREEN: ALL EIGHT BESIDE THEIR NAMES, EACH ITS OWN PICTURE, 24 POINTS, LOADED', rows.map(r => r.k + (r.bg.indexOf(r.k + '.png') >= 0 ? '' : ' NONE') + ' ' + r.w).join(', '));
    errs.push(...d.errs);
    await d.close();
  }
  {
    const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, arm: 'window.FIGHT_OPTS={seed:21,kind:"suburb",company:[{background:"companion_2hand",name:"RAUL"},{background:"companion_1hand",name:"DESI"},{background:"companion_ranged",name:"TINA"}],cap:12,party:{count:4,days:3,difficulty:1,faction:"brigands"}}' });
    await d.page.waitForFunction(() => typeof FIGHT !== 'undefined' && FIGHT.S && FIGHT.S.units && FIGHT.S.units.length, null, { timeout: 90000 }).catch(() => {});
    const got = await d.page.evaluate(async () => { drawer(FIGHT.S.units[0]); await new Promise(r => setTimeout(r, 300));
      /* RE-AIMED 10/26 (UI THREE, rules 223 and 247): the card's eight are the one stat row each (.bst-row, its icon an i.bst-ic),
         in his order; the word rows the kit dressed are kept only where they still stand */
      const rows = [...document.querySelectorAll('#drawer .bst-row')].map(r => r.dataset.stat + ':' + ((r.querySelector('i.bst-ic') || { style: {} }).style.backgroundImage || '').replace(/^.*\/|\.png.*$/g, ''));
      return rows.length ? rows : [...document.querySelectorAll('#drawer .r>span:first-child')].map(sp => sp.textContent.trim() + ':' + [...sp.querySelectorAll('img.bm-stat')].map(i => i.getAttribute('src').replace(/^.*\//, '').replace('.png', '')).join('+')); }).catch(e => ['threw ' + e.message]);
    const want = { Health: 'hp', Fatigue: 'fatigue', Resolve: 'resolve', Initiative: 'initiative', 'Melee skill / defence': 'melee_skill+melee_defense', 'Ranged skill / defence': 'ranged_skill+ranged_defense' };
    const EIGHT = ['hp', 'fatigue', 'ranged_skill', 'melee_skill', 'ranged_defense', 'melee_defense', 'resolve', 'initiative'];
    const ok = got.length === 8 && got.every((g, i) => g === EIGHT[i] + ':' + EIGHT[i]) || Object.keys(want).every(w => got.indexOf(w + ':' + want[w]) >= 0);
    leg(ok, 'I4  THE FIGHT\'S CARD: EVERY STAT WEARS ITS OWN ICON (the eight in his order as rows, rule 247)', got.join(' | '));
    errs.push(...d.errs);
    await d.close();
  }
  const e2 = errs.filter(e => !/ResizeObserver/.test(e));
  leg(e2.length === 0, 'I5  NOTHING THROWN', e2.slice(0, 3).join(' | ') || 'none');
  console.log('=== THE STAT ICONS GATE: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.log('  FAIL the gate threw: ' + (e && e.stack || e)); process.exit(1); });
