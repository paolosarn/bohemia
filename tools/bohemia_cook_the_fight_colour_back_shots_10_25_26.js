/* THE FIGHT BOARD'S COLOUR BACK, the shots (COOK, rule 167, 10/25/26). Paolo 10/25: 'the combat map like went completely like
   almost like black and white... I was like how it was previously'. COOK 9cae20af had graded the fight's 121 pictures (35 blocks,
   their raided futures, 51 cover pieces) to chroma x 0.3; this round put them back to that commit's parent byte for byte.
   This walks the BAKED DEMO into a road fight the way gates/every_fight_hands_him_back_gate.js does (a step, roadContactFight,
   ENGAGE pressed), on his phone held upright and on a computer, and shoots the map he left and the fight he lands in.
   'grey' serves the graded pictures (9cae20af's, extracted to <grey dir>) in place of the game's; 'colour' is the game as it is.
   The fight gets seed 31 through the shell's door and Math.random is seeded in every document, so both runs deal the same board.
   node tools/bohemia_cook_the_fight_colour_back_shots_10_25_26.js <out dir> <phone_portrait|computer> <grey|colour> [grey dir]
   REFERENCE CHECK (the law: compare every piece of art to the world): this draws nothing; the reference is his own 'how it was
   previously', the 121 pictures at 9cae20af's parent (put back byte for byte, every hash checked), and the world beside them is
   the map he walks out of, shot in the same run on the same screen (records/target/cook_fight_colour_back/*_map_beside_fight.jpg). */
'use strict';
const fs = require('fs'), path = require('path'); const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const [out, profile, which, greyDir] = process.argv.slice(2);
const SEED = "(function(){var s=31;Math.random=function(){s=(Math.imul(s,1664525)+1013904223)>>>0;return s/4294967296;};})();";

(async () => {
  const serve = {};
  if (which === 'grey') for (const f of fs.readdirSync(greyDir)) serve['/slices/fight_ground/' + f] = path.join(greyDir, f);
  const d = await open({ keepCards: true, engage: true, fog: false, profile, noWorker: true, arm: SEED, serve });   /* fog lifted so the map he left reads */
  const tag = profile + '_' + which;
  try {
    await d.page.waitForTimeout(2500);
    await d.page.screenshot({ path: path.join(out, tag + '_map.png') });
    /* the fight deals its board from FIGHT_OPTS.seed when it has one (BOHEMIA_FIGHT.html start()): the shell's door gets seed 31 */
    await d.page.evaluate(() => { const o = window.nfOpts; window.nfOpts = function (x) { const r = o(x); r.seed = 31; return r; }; });
    const st = await d.fr.evaluate(async () => {
      for (let i = 0; i < 40 && FZOOMING; i++) await new Promise(r => setTimeout(r, 250));
      try { stepOnce(0); stepOnce(4); } catch (_e) {}
      const t = om.at(city.x, city.y);
      return { started: roadContactFight({ id: 'toll_crew', name: 'the toll crew', seq: 1 }), district: t ? t.district : null };
    });
    let f = null;
    for (let i = 0; i < 150 && !f; i++) {
      const h = await d.page.$('#fightFrame'); const cf = h && await h.contentFrame();
      if (cf && await cf.evaluate(() => typeof FIGHT_UI !== 'undefined' && !!FIGHT_UI.board && typeof FIGHT !== 'undefined' && !!FIGHT.S.board).catch(() => false)) f = cf;
      else await d.page.waitForTimeout(200);
    }
    if (!f) throw new Error('no fight frame');
    await d.page.waitForTimeout(4000);   /* the board's pictures decode and the first beat lands */
    const board = await f.evaluate(() => ({ board: FIGHT.S.board, kinds: (FIGHT.S.boardDef && FIGHT.S.boardDef.kinds) || [],
      floor: [...new Set([].concat(...((FIGHT.S.boardDef && FIGHT.S.boardDef.blocks) || [])))] }));
    /* which fight pictures the page actually fetched, and from where (proof the grey run served the grey ones) */
    const pics = d.loads.filter(l => /fight_ground\/(block|cover)_/.test(l.url || l.u || '')).length;
    await d.page.screenshot({ path: path.join(out, tag + '_fight.png') });
    const res = { profile, which, district: st.district, started: st.started, ...board, fightPicturesLoaded: pics, errs: d.errs.slice(0, 5) };
    fs.writeFileSync(path.join(out, tag + '.json'), JSON.stringify(res, null, 1));
    console.log(tag, JSON.stringify(res));
  } finally { await d.close(); }
})().catch(e => { console.error(e); process.exit(1); });
