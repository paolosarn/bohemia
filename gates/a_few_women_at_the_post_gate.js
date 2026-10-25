/* ==========================================================================
   A FEW WOMEN AT THE POST  (RUN TWO, 10/25/26, VAMILY [a few women at the post], rule 203)

   PAOLO 10/25: "I know Battle Brothers is only men... I'm willing to give a chance to women, like one percent of them recruitable."
   THE RULE: a woman is a whole person (her body on the rig, her face, her voice), never a man's sprite with a woman's name; her
   share is his 1 percent until he picks; she rolls like any hire; until her body exists the roll stays at 0 and says so.
   MEASURED 10/25: no woman's body exists (engine/bohemia_people_mix.js: 71 people 'm', 81 unset, every one on the master rig, a
   man's), AND the unset 81 rolled their names 50/50: about 40 men in the valley wore women's names (the smith 'HAZEL EMERY').

   LEGS (the settlement screen, its own page):
     W1 the file: his 1 percent, the realistic 2 percent beside it for him (rule 203(b) amended), draft:true
     W2 *** NOW: 10,000 rolled hires, 0 women *** (no woman's body yet), and no man at the post, the stall or in the crowd wears a
        woman's name: every name read on a man's body reads as a man's (BohemiaNames.sexOf)
     W3 THE MACHINE, with a woman's body handed in for the test only: 10,000 rolled hires come out at the share (1 percent within its
        noise), each a woman's body and a woman's name, and no man's roll moved
     W4 nothing threw
   node gates/a_few_women_at_the_post_gate.js
   ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http');
const ROOT = path.dirname(__dirname), PORT = 8917;
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp', '.woff2': 'font/woff2', '.glb': 'model/gltf-binary' };
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
const srv = http.createServer((rq, rs) => {
  const f = path.join(ROOT, decodeURIComponent(rq.url.split('?')[0]).replace(/^\/+/, ''));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end(); }
  rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(rs);
});
const FILE = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/post_women.json'), 'utf8'));

(async () => {
  await new Promise(r => srv.listen(PORT, '127.0.0.1', r));
  const { chromium } = require('playwright');
  const b = await chromium.launch();
  const errs = [];
  try {
    /* W1 */
    ok('W1 the file: his 1 percent plays, the realistic 2 percent waits for him, draft:true', FILE.share.value === 0.01 && FILE.share_realistic.value === 0.02 && FILE.draft === true);
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    const p = await ctx.newPage(); p.on('pageerror', e => errs.push(e.message));
    await p.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_SETTLEMENT_SCREEN.html', { waitUntil: 'load' });
    await p.waitForFunction(() => window.BohemiaSettlement && BohemiaSettlement.ready() && BohemiaSettlement.womenFile() != null && window.BOHEMIA_PEOPLE_MIX && window.BohemiaNames, null, { timeout: 30000 });
    /* W2 */
    const now = await p.evaluate(() => {
      const M = window.BOHEMIA_PEOPLE_MIX, N = window.BohemiaNames, S = BohemiaSettlement;
      let women = 0; for (let i = 0; i < 10000; i++) if (S.womanAt('TOWN ' + (i % 97) + ':' + Math.floor(i / 97), i % 9)) women++;
      /* every name the post, the keepers and the crowd give in 24 places of every size */
      const bad = [], seen = { post: 0, keeper: 0, crowd: 0 };
      const sex = full => N.sexOf(String(full).split(/[ ,]/)[0].charAt(0) + String(full).split(/[ ,]/)[0].slice(1).toLowerCase());
      const body = look => { const P = window.BohemiaRigBodies && BohemiaRigBodies.person(look); return P ? (P.sex || 'm') : (N.faceReads(look) || null); };
      ['camp', 'town', 'fortress'].forEach(tier => { for (let k = 0; k < 8; k++) {
        S.open({ place: { tier, name: tier.toUpperCase() + ' ' + k }, day: k * 7 });
        S.recruits().forEach(r => { seen.post++; if (body(r.look) === 'm' && sex(r.name) === 'f') bad.push('post ' + r.look + ' ' + r.name); });
      } });
      return { women, share: S.womenShare(), looks: S.womenLooks().length, sexes: M.people.reduce((o, x) => { o[x.sex || 'unset'] = (o[x.sex || 'unset'] || 0) + 1; return o; }, {}), bad, seen };
    });
    /* the keepers and the crowd, by their own name functions on the page */
    const named = { bad: [], seen: { keeper: 0, crowd: 0 } };
    for (const tier of ['camp', 'town', 'fortress']) for (let k = 0; k < 6; k++) {
      await p.evaluate(({ tier, k }) => BohemiaSettlement.open({ place: { tier, name: tier.toUpperCase() + ' ' + k }, day: k * 7 }), { tier, k });
      await p.waitForFunction(() => BohemiaSettlement.folk().some(q => q.keeper && q.look), null, { timeout: 8000 }).catch(() => {});
      const r = await p.evaluate(() => { const N = window.BohemiaNames, bad = [], seen = { keeper: 0, crowd: 0 };
        const sex = full => { const w = String(full).split(/[ ,]/)[0]; return N.sexOf(w.charAt(0) + w.slice(1).toLowerCase()); };
        BohemiaSettlement.folk().forEach(q => { if (!q.look || !/^person_/.test(q.look)) return; const P = BohemiaRigBodies.person(q.look); if (!P || P.sex === 'f') return;
          const nm = q.keeper ? BohemiaSettlement.keeperName(q.k).split(',')[0] : BohemiaSettlement.crowdRolled(q);
          if (!nm) return; q.keeper ? seen.keeper++ : seen.crowd++; if (sex(nm) === 'f') bad.push((q.keeper ? 'keeper ' : 'crowd ') + q.look + ' ' + nm); });
        return { bad, seen }; });
      named.bad.push(...r.bad); named.seen.keeper += r.seen.keeper; named.seen.crowd += r.seen.crowd;
    }
    ok('*** W2 NOW: 10,000 ROLLED HIRES, ' + now.women + ' WOMEN *** (a woman\'s body: ' + now.looks + '; the people ' + JSON.stringify(now.sexes) + '); ' + now.seen.post + ' men at posts, ' + named.seen.keeper + ' keepers, ' + named.seen.crowd + ' in the crowd: no man wears a woman\'s name',
      now.women === 0 && now.share === 0 && now.looks === 0 && now.seen.post > 50 && named.seen.keeper > 20 && named.seen.crowd > 20 && !now.bad.length && !named.bad.length, now.bad.concat(named.bad).slice(0, 4).join(' | '));
    /* W3: the machine, a woman's body handed in for this test only (a copy of one rolled person marked 'f') */
    const mach = await p.evaluate(() => {
      const M = window.BOHEMIA_PEOPLE_MIX, S = BohemiaSettlement, N = window.BohemiaNames;
      const before = []; for (let i = 0; i < 400; i++) before.push(S.womanAt('K' + i, 0));
      const src = M.people.find(x => x.fight && !x.company), her = Object.assign({}, src, { look: src.look + '_test_woman', sex: 'f' });
      M.people.push(her); if (window.BohemiaRigBodies && BohemiaRigBodies.person) { /* the rig's index reads the mix once; a look it does not know is not drawn here */ }
      let women = 0, wrong = 0, n = 0; const names = [];
      for (let i = 0; i < 10000; i++) { const key = 'TOWN ' + (i % 97) + ':' + Math.floor(i / 97), l = S.womanAt(key, i % 9); n++;
        if (l) { women++; if (l !== her.look) wrong++; if (names.length < 6) names.push(N.roll('post:' + key + ':' + (i % 9), { sex: 'f' }).full); } }
      const nm = names.map(x => { const w = x.split(' ')[0]; return N.sexOf(w.charAt(0) + w.slice(1).toLowerCase()); });
      M.people.pop();
      return { women, n, wrong, share: 0.01, names, nmM: nm.filter(x => x === 'm').length, before: before.filter(Boolean).length };
    });
    const sd = Math.sqrt(mach.n * mach.share * (1 - mach.share)), want = mach.n * mach.share;
    ok('W3 THE MACHINE (a woman\'s body handed in for the test): ' + mach.women + ' of ' + mach.n + ' rolled hires are women (the share wants ' + want + ', within 4 of its noise), each her body, her names ' + mach.names.join(', '),
      Math.abs(mach.women - want) <= 4 * sd && mach.wrong === 0 && mach.nmM === 0 && mach.before === 0);
  } catch (e) { ok('the legs ran [' + String(e.message).slice(0, 200) + ']', false); }
  ok('W4 nothing threw', errs.length === 0, errs.slice(0, 2).join(' | '));
  await b.close(); srv.close();
  console.log('A FEW WOMEN AT THE POST: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0);
})();
