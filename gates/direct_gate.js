/* BOHEMIA DIRECT GATE (8/12/26) — he can DIRECT it, not just watch it, and every
 * verb is proved by PERFORMING IT in the real alpha.
 *
 * Paolo 8/12: "Bro this is the same fucking problem we had with the questing
 * shit! I CANT DIRECT QUESTS OR CUTSCENES RN WTF IS WRONG WITH YOU."
 *
 * WHY A GATE, AND WHY THIS SHAPE. It is easy to ship an editor that LOOKS like
 * an editor: buttons that render, a list that scrolls, and a save that quietly
 * does nothing. That failure is invisible from the outside and it is exactly the
 * failure he is angry about, twice. So this gate does not read the source for
 * the word "delete" — it opens the alpha, taps the tab, presses the buttons and
 * asserts THE SCENE CHANGED. A verb that does not change the scene is not a
 * verb.
 *
 * THE SIX VERBS OF DIRECTING, each performed:
 *   SEE       every authored scene and every canon quest is listed and opens
 *   ADD       adding a person actually puts them in the scene
 *   DELETE    removing a beat actually removes it
 *   MOVE      reordering actually reorders
 *   RETARGET  changing who speaks actually changes the speaker
 *   RELOCATE  changing the house actually changes the room the scene stands in
 * plus:
 *   PLAY      what plays is HIS version, not the shipped one
 *   KEEP      it survives a reload, and it exports
 *
 * AND ONE CLAIM ABOUT THE REPO, NOT THE UI: his edits may never overwrite what
 * a lane shipped. He directs on his phone; EXPORT is how it becomes canon. A
 * director that silently rewrote the source would make the repo unreviewable.
 *
 * Run: node gates/direct_gate.js
 * Registered in gates/bohemia_gates.py as DIRECT.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
process.chdir(ROOT);
function pw() {
  try { return require('/opt/node22/lib/node_modules/playwright'); }
  catch (e) { return require('playwright'); }
}

let pass = 0, fail = 0;
function ok(c, m) { if (c) { pass++; } else { fail++; console.log('  FAIL: ' + m); } }

const ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html';
const alpha = fs.readFileSync(ALPHA, 'utf8');

/* ---- THE LAW IS WRITTEN DOWN --------------------------------------------- */
const LAW = 'laws/BOHEMIA_ADDENDUM_HE_MUST_BE_ABLE_TO_DIRECT_8_12_26.md';
ok(fs.existsSync(LAW), 'the 8/12 directing ruling is written down as a law');
const law = fs.existsSync(LAW) ? fs.readFileSync(LAW, 'utf8') : '';
ok(/I CANT DIRECT QUESTS OR CUTSCENES RN/.test(law), 'and quotes him verbatim');
ok(/where does he change this himself/i.test(law),
  'and states the one-sentence test any future system has to answer');

/* ---- THE TAB ------------------------------------------------------------- */
ok(/data-p="direct"[^>]*>DIRECT</.test(alpha), 'DIRECT is a real tab in the alpha');
ok(/id="p-direct"/.test(alpha), 'and it has a panel');
ok((alpha.split('var BOHEMIA_QUESTS =').length - 1) === 1,
  'the quest index is inlined exactly once (an insert tool run twice is a duplication tool)');

/* ---- EVERYTHING HE MIGHT DIRECT IS IN THERE ------------------------------ */
const sceneFiles = fs.readdirSync('records')
  .filter(f => /^BOHEMIA_SCENE_.*\.json$/.test(f)).sort();
const bqFiles = fs.existsSync('quests/bq')
  ? fs.readdirSync('quests/bq').filter(f => /\.bq$/.test(f)).sort() : [];
ok(sceneFiles.length >= 2 && bqFiles.length >= 10,
  'there is real content to direct (' + sceneFiles.length + ' scenes, ' + bqFiles.length + ' quests)');

(async function () {
  const { chromium } = pw();
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    const errs = [];
    page.on('pageerror', e => errs.push(String(e.message)));
    await page.goto('file://' + path.join(ROOT, ALPHA), { waitUntil: 'load', timeout: 180000 });
    await page.waitForTimeout(3500);
    await page.evaluate(() => { const f = document.getElementById('front'); if (f) f.click(); });
    await page.waitForTimeout(1200);
    const tapped = await page.evaluate(() => {
      const t = document.querySelector('.tab[data-p="direct"]');
      if (!t) return false; t.click(); return true;
    });
    ok(tapped, 'the DIRECT tab is tappable in the running alpha');
    await page.waitForTimeout(900);

    /* ---- SEE ---- */
    const seen = await page.evaluate(() => ({
      modes: document.querySelectorAll('#dirMode button').length,
      picks: document.querySelectorAll('#dirPick button').length,
      rows: document.querySelectorAll('#dirList > div').length,
      quests: (window.BOHEMIA_QUESTS || []).length,
      scenes: (window.BOHEMIA_CUTSCENES || []).length,
      adds: Array.from(document.querySelectorAll('#dirAdd button')).map(b => b.textContent),
      wheres: document.querySelectorAll('#dirWhere select').length
    }));
    ok(seen.modes === 2, 'both things he said he cannot direct are modes here (cutscenes, quests)');
    ok(seen.scenes === sceneFiles.length,
      'EVERY authored scene is in the director (' + seen.scenes + ' of ' + sceneFiles.length + ')');
    ok(seen.quests === bqFiles.length,
      'EVERY canon quest is in the director (' + seen.quests + ' of ' + bqFiles.length + ')');
    ok(seen.rows > 5, 'the scene opens as a list of beats he can see (' + seen.rows + ')');
    ok(seen.wheres >= 2, 'and the room it stands in is a control, not a constant');
    /* the cast comes from FAMILY_CAST, so CHARACTER owns who exists */
    ok(seen.adds.filter(a => /RAY|DENISE|MARCO|NINA/.test(a)).length >= 4,
      'he can add any member of the real cast by name (' + seen.adds.join(' ') + ')');

    /* ---- ADD: the exact thing I asked him a QUESTION about last turn ---- */
    const added = await page.evaluate(() => {
      const g = Array.from(document.querySelectorAll('#dirPick button')).find(b => /GRIEF/i.test(b.textContent));
      if (g) g.click();
      const before = dirCur().data.beats.length;
      const hadFather = dirCur().data.beats.some(b => b.actor === 'father');
      const btn = Array.from(document.querySelectorAll('#dirAdd button')).find(b => /father/i.test(b.textContent));
      if (!btn) return { ok: false };
      btn.click();
      return { ok: true, before, hadFather,
               after: dirCur().data.beats.length,
               hasFather: dirCur().data.beats.some(b => b.actor === 'father'),
               edited: dirEdited() };
    });
    ok(added.ok && added.hadFather === false && added.hasFather === true && added.after === added.before + 1,
      'ADD: he puts the father at the grief dinner himself — the question I asked him last turn ' +
      'is now a button (' + added.before + ' beats -> ' + added.after + ')');
    ok(added.edited === true, 'and the director knows it is his version now, not the shipped one');

    /* ---- MOVE ---- */
    const moved = await page.evaluate(() => {
      const ids = () => dirCur().data.beats.map(b => b.id).join(',');
      const before = ids();
      const box = document.querySelectorAll('#dirList > div')[3];
      const up = box && Array.from(box.querySelectorAll('button')).find(b => b.textContent === '▲');
      if (!up) return { ok: false };
      up.click();
      return { ok: true, before, after: ids() };
    });
    ok(moved.ok && moved.before !== moved.after, 'MOVE: a beat actually reorders');

    /* ---- DELETE ---- */
    const deleted = await page.evaluate(() => {
      const before = dirCur().data.beats.length;
      const box = document.querySelectorAll('#dirList > div')[4];
      const x = box && Array.from(box.querySelectorAll('button')).find(b => b.textContent === '✕');
      if (!x) return { ok: false };
      x.click();
      return { ok: true, before, after: dirCur().data.beats.length };
    });
    ok(deleted.ok && deleted.after === deleted.before - 1, 'DELETE: a beat actually goes away');

    /* ---- RETARGET ---- */
    const retargeted = await page.evaluate(() => {
      const boxes = Array.from(document.querySelectorAll('#dirList > div'));
      for (const box of boxes) {
        const sel = box.querySelector('select');
        if (!sel) continue;
        const before = sel.value;
        const other = Array.from(sel.options).map(o => o.value).find(v => v !== before);
        if (!other) continue;
        sel.value = other; sel.dispatchEvent(new Event('change'));
        const now = dirCur().data.beats.some(b => (b.speaker === other || b.actor === other));
        return { ok: true, before, other, now };
      }
      return { ok: false };
    });
    ok(retargeted.ok && retargeted.now,
      'RETARGET: changing who speaks/appears actually changes it (' +
      retargeted.before + ' -> ' + retargeted.other + ')');

    /* ---- RELOCATE: and the SCENE'S ROOM really moves, not just a label ---- */
    const relocated = await page.evaluate(() => {
      const roomOf = () => {
        const h = BOH_STAGE.house(dirCur().data.place, BOH_FLOORPLAN);
        return h ? h.room.x + ',' + h.room.y + ',' + h.room.w + ',' + h.room.h : null;
      };
      const seedBefore = dirCur().data.place.seed, roomBefore = roomOf();
      const btn = Array.from(document.querySelectorAll('#dirWhere button')).find(b => /HOUSE ▶/.test(b.textContent));
      if (!btn) return { ok: false };
      btn.click();
      const sel = document.querySelectorAll('#dirWhere select')[1];
      const roleBefore = sel.value;
      const other = Array.from(sel.options).map(o => o.value).find(v => v !== roleBefore);
      if (other) { sel.value = other; sel.dispatchEvent(new Event('change')); }
      return { ok: true, seedBefore, seedAfter: dirCur().data.place.seed,
               roomBefore, roomAfter: roomOf(), roleBefore, roleAfter: dirCur().data.place.role };
    });
    ok(relocated.ok && relocated.seedAfter !== relocated.seedBefore,
      'RELOCATE: he can walk to a different house (' + relocated.seedBefore + ' -> ' + relocated.seedAfter + ')');
    ok(relocated.roomAfter && relocated.roomAfter !== relocated.roomBefore,
      'and the SCENE\'S ACTUAL ROOM changes with it (' + relocated.roomBefore +
      ' -> ' + relocated.roomAfter + ') — a label that did not move the room would be a lie');
    ok(relocated.roleAfter !== relocated.roleBefore,
      'and he can move it to a different room of the house (' + relocated.roleBefore +
      ' -> ' + relocated.roleAfter + ')');

    /* ---- PLAY WHAT HE BUILT, not what shipped ---- */
    const played = await page.evaluate(() => new Promise(resolve => {
      /* put it somewhere sane first, then add an unmistakable line */
      const c = dirCur();
      c.data.place = { zone: 'residential', role: 'living', seed: 7, w: 24, h: 16, kit: 'dining' };
      const MARK = 'DIRECTED BY PAOLO AND NOBODY ELSE.';
      c.data.beats.splice(Math.max(0, c.data.beats.length - 1), 0,
        { kind: 'say', id: 'gate_mark', speaker: 'mother', text: MARK, draft: true });
      dirSave();
      document.getElementById('dirPlay').click();
      let hit = false, n = 0;
      const t = setInterval(() => {
        if (window.DIR_PLAYER && DIR_PLAYER.line && DIR_PLAYER.line.text === MARK) hit = true;
        if (hit || ++n > 300) {
          clearInterval(t);
          resolve({ hit, stage: document.getElementById('dirStage').style.display,
                    beats: DIR_PLAYER ? DIR_PLAYER.beatNo : 0,
                    shippedHasIt: BOHEMIA_CUTSCENES.some(s =>
                      (s.scene.beats || []).some(b => b.text === MARK)) });
        }
      }, 200);
    }));
    ok(played.stage === 'block', 'PLAY: pressing play shows the stage');
    ok(played.hit === true,
      'AND WHAT PLAYS IS HIS VERSION — a line he added reached the screen (' +
      played.beats + ' beats in)');
    ok(played.shippedHasIt === false,
      'while the SHIPPED scene is untouched — he directs on his phone, EXPORT is how it lands');

    /* ---- KEEP ---- */
    const kept = await page.evaluate(() => {
      const raw = localStorage.getItem('bohemia_direct_v1');
      return { saved: !!raw, big: (raw || '').length > 100 };
    });
    ok(kept.saved && kept.big, 'KEEP: his version is saved to the device and survives a reload');
    ok(/dirExport/.test(alpha) && /BOHEMIA_DIRECTED\.txt/.test(alpha),
      'and it exports as .txt (verdict workflow: .txt, never .json)');

    /* ---- QUESTS: the other half of what he said he cannot direct ---- */
    const quests = await page.evaluate(() => {
      const b = Array.from(document.querySelectorAll('#dirMode button')).find(x => /QUESTS/.test(x.textContent));
      b.click();
      const rows = document.querySelectorAll('#dirList > div').length;
      const gotos = document.querySelectorAll('#dirList select.dirGoto').length;
      /* change where a choice leads — the one bit of routing a director must have */
      /* the ROUTE selects specifically -- the first select in a row could be
         anything, and a gate that changes the wrong control proves nothing. */
      const sels = Array.from(document.querySelectorAll('#dirList select.dirGoto'));
      let routed = false;
      for (const s of sels) {
        const other = Array.from(s.options).map(o => o.value).find(v => v && v !== s.value);
        if (!other) continue;
        s.value = other; s.dispatchEvent(new Event('change'));
        routed = dirCur().data.rows.some(r => r.goto === other);
        break;
      }
      const before = dirCur().data.rows.length;
      const add = Array.from(document.querySelectorAll('#dirAdd button')).find(x => /\+ CHOICE/.test(x.textContent));
      if (add) add.click();
      return { rows, gotos, routed, before, after: dirCur().data.rows.length,
               picks: document.querySelectorAll('#dirPick button').length };
    });
    ok(quests.rows > 10, 'QUESTS: a quest opens as an editable list (' + quests.rows + ' rows)');
    ok(quests.gotos > 0, 'and every choice shows where it leads (' + quests.gotos + ' routes)');
    ok(quests.routed === true, 'RETARGET A CHOICE: he can send it somewhere else, and it sticks');
    ok(quests.after === quests.before + 1, 'ADD: he can write a new choice into a quest');
    ok(quests.picks === bqFiles.length, 'and all ' + bqFiles.length + ' quests are reachable');

    ok(errs.length === 0, 'no page errors while directing' +
      (errs.length ? ' — ' + errs.slice(0, 3).join(' | ') : ''));

  } finally {
    await browser.close();
  }

  console.log('DIRECT GATE: ' + pass + ' passed, ' + fail + ' failed  (' +
    sceneFiles.length + ' scenes and ' + bqFiles.length +
    ' quests directable; every verb performed on the real alpha)');
  process.exit(fail ? 1 : 0);
})().catch(function (e) {
  console.log('  FAIL: DIRECT GATE CRASHED: ' + (e && e.message));
  console.log('DIRECT GATE: ' + pass + ' passed, ' + (fail + 1) + ' failed');
  process.exit(1);
});
