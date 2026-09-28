/* ============================================================================
   THE NAMING SCREEN GATE (9/28/26, WORDS lane) -- row [naming screen],
   THREE-NAMES-MALE-OR-FEMALE, rule 31 section 5 (Paolo 9/23): "one screen
   before act 1, three names typed by the player, male or female each."

   DYNASTY's [three names] (9/27) built and gated the mechanism
   (BohemiaActs.setName/setSex/reshuffle, three_names_gate.js 31/0) and routed
   the screen here by name: "waiting for the naming screen's own control to
   call them." This gate proves the control exists and really calls them, on
   the real glass, with a real finger and a real keyboard -- the same
   standard DYNASTY's own gate held itself to.

   THE PAGE IS slices/BOHEMIA_THE_THREE_BEFORE_ACT_ONE_9_28_26.html, loaded
   standalone (it is not wired into the alpha's boot sequence -- that is
   RUN's/UI's integration step, and this gate does not pretend otherwise; see
   leg G). It loads engine/bohemia_people.js and engine/bohemia_acts.js by
   the same relative path other standalone slices already use (REUSE-FIRST):
   no second copy of the name bank, no second copy of the acts module.
   ========================================================================== */
const path = require('path');
const fs = require('fs');
const ROOT = path.resolve(__dirname, '..');
const PAGE = path.join(ROOT, 'slices/BOHEMIA_THE_THREE_BEFORE_ACT_ONE_9_28_26.html');
const PW = '/opt/node22/lib/node_modules/playwright';

let pass = 0, fail = 0;
const ok = (name, cond, note) => {
  if (cond) { pass++; console.log('  ok   ' + name + (note ? '   ' + note : '')); }
  else { fail++; console.log('  FAIL ' + name + (note ? '   ' + note : '')); }
};
const head = t => console.log('\n' + t);

async function main() {
  head('A. THE PAGE EXISTS AND LOADS THE REAL ENGINE, NOTHING FAKED');
  ok('the page exists', fs.existsSync(PAGE));
  const src = fs.readFileSync(PAGE, 'utf8');
  ok('it loads the real name bank, not a second copy of one',
     /src="\.\.\/engine\/bohemia_people\.js"/.test(src));
  ok('it loads the real acts module DYNASTY gated, not a second copy of one',
     /src="\.\.\/engine\/bohemia_acts\.js"/.test(src));
  ok('draft:true is on the record, not just claimed in a commit message',
     /draft:true/.test(src));
  ok('no em dash anywhere on the page (standing law, every reply and everything shipped)',
     src.indexOf('—') < 0);

  head('B. RULE 27, THE PLAYER DOES NOT SPEAK SPANGLISH');
  const ES_ONLY = (function () {
    const peopleSrc = fs.readFileSync(path.join(ROOT, 'engine/bohemia_people.js'), 'utf8');
    const m = /var ES_ONLY = (\[[\s\S]*?\]);/.exec(peopleSrc);
    return m ? JSON.parse(m[1]) : [];
  })();
  ok('the closed set actually loaded (a zero here would pass by accident)', ES_ONLY.length > 100,
     ES_ONLY.length + ' words');
  let visible = src.replace(/<style>[\s\S]*?<\/style>/, '')
                    .replace(/<script[^>]*>[\s\S]*?<\/script>/g, '')
                    .replace(/<!--[\s\S]*?-->/g, '')
                    .replace(/<[^>]+>/g, ' ');
  const tokens = (visible.toLowerCase().match(/[a-zà-ÿ']+/g) || []);
  const esHits = tokens.filter(w => ES_ONLY.indexOf(w) >= 0);
  ok('nothing on the screen the player reads is Spanish',
     esHits.length === 0, esHits.length ? esHits.join(', ') : '0 hits, ' + tokens.length + ' words swept');

  head('C. THE BANNED-PHRASE LIST (voice_gate\'s own list, not a reimplementation)');
  const voiceSrc = fs.readFileSync(path.join(ROOT, 'gates/voice_gate.js'), 'utf8');
  const vBlk = voiceSrc.slice(voiceSrc.indexOf('const BANNED = ['), voiceSrc.indexOf('function banned(text)'));
  const BANNED = eval(vBlk.trim().replace(/^const BANNED = /, '').replace(/;\s*$/, ''));
  const bannedHits = BANNED.filter(b => b[1].test(visible)).map(b => b[0]);
  ok('no banned phrase on the screen', bannedHits.length === 0, bannedHits.join(', '));

  head('D. ON THE REAL GLASS: THREE REAL NAMES, THREE REAL SEXES, FROM THE FIRST FRAME');
  const { chromium } = require(PW);
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const errs = [];
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
    page.on('pageerror', e => errs.push(String(e)));
    await page.goto('file://' + PAGE);
    await page.waitForTimeout(400);

    const initial = await page.evaluate(() => {
      const cards = document.querySelectorAll('.card');
      return {
        count: cards.length,
        names: Array.from(cards).map(c => c.querySelector('.nm').value),
        sexes: Array.from(cards).map(c => { const on = c.querySelector('.sx.on'); return on ? on.textContent : null; })
      };
    });
    ok('*** RULE 32(d), NO FLIP TO AN UNNAMED DESCENDANT: all three slots are named the first frame paints ***',
       initial.count === 3 && initial.names.every(n => n && n.trim().length > 0),
       JSON.stringify(initial.names));
    ok('every slot has a concrete sex on the first frame, never a shrug',
       initial.sexes.every(s => s === 'MALE' || s === 'FEMALE'), JSON.stringify(initial.sexes));

    head('E. RESHUFFLE ONE SLOT, A REAL TAP, THE OTHER TWO DO NOT MOVE (DYNASTY\'s own ship test)');
    const rs2 = await page.$('#act2 .rs');
    const box2 = await rs2.boundingBox();
    await page.touchscreen.tap(box2.x + box2.width / 2, box2.y + box2.height / 2);
    await page.waitForTimeout(150);
    const afterReshuffle = await page.evaluate(() => Array.from(document.querySelectorAll('.card .nm')).map(i => i.value));
    ok('*** SLOT 2 ALONE CHANGED *** (' + initial.names[1] + ' -> ' + afterReshuffle[1] + ')',
       afterReshuffle[1] !== initial.names[1]);
    ok('slot 1 untouched by slot 2\'s reshuffle', afterReshuffle[0] === initial.names[0]);
    ok('slot 3 untouched by slot 2\'s reshuffle', afterReshuffle[2] === initial.names[2]);

    head('F. A REAL SEX TAP AND A REAL TYPED NAME, THROUGH THE ACTUAL CONTROLS');
    const male1 = await page.$('#act1 .sx');
    const b1 = await male1.boundingBox();
    await page.touchscreen.tap(b1.x + b1.width / 2, b1.y + b1.height / 2);
    await page.waitForTimeout(150);
    const sex1 = await page.evaluate(() => { const on = document.querySelector('#act1 .sx.on'); return on ? on.textContent : null; });
    ok('tapping MALE on slot 1 sets it, on the real control', sex1 === 'MALE');

    const in3 = await page.$('#act3 .nm');
    await in3.click({ clickCount: 3 });
    await in3.type('Guadalupe', { delay: 10 });
    await page.keyboard.press('Enter');
    await page.waitForTimeout(150);
    const named = await page.evaluate(() => ({
      names: Array.from(document.querySelectorAll('.card .nm')).map(i => i.value),
      tag: document.querySelector('#act3 .reads').textContent
    }));
    ok('a name typed with a real keyboard sticks after Enter', named.names[2] === 'Guadalupe');
    ok('typing into slot 3 never bled into slot 1 or slot 2',
       named.names[0] !== 'Guadalupe' && named.names[1] !== 'Guadalupe');
    ok('a typed name is flagged as his, not silently overwritten later (MECHANISM-MINE/CONTENTS-PAOLO\'S)',
       /yours, typed/.test(named.tag));

    head('G. WHAT THIS DOES NOT CLAIM');
    const boot = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html'), 'utf8');
    const wired = boot.indexOf('BOHEMIA_THE_THREE_BEFORE_ACT_ONE') >= 0;
    ok('the alpha does NOT yet call this page, so a green here is never read as "it ships wired"',
       !wired, wired ? 'FOUND a reference -- this note is now stale, update it' : 'confirmed standalone');
    ok('and nothing threw while any of this happened', errs.length === 0,
       errs.length ? errs[0] : 'page errors 0');
  } finally {
    await browser.close();
  }

  console.log('\n' + (fail ? 'RED' : 'GREEN') + ': ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
}
main().catch(e => { console.error(e); process.exit(1); });
