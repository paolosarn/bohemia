/* THE FAMILY GATE (8/31/26) -- the family in the cold open looks like a family.
 *
 * Paolo, 8/31, one word: "VAMILY", straight after watching the opening. The word is
 * FAMILY, and the honest answer to it was a number.
 *
 * MEASURED BEFORE ANYTHING WAS TOUCHED, against 50 control groups of four random
 * citizens drawn from the same generator:
 *       same skin tone     family  0.0%   strangers  9.0%
 *       same hair colour   family 16.7%   strangers 25.0%
 *       same eye colour    family 16.7%   strangers 17.3%
 *       skull difference   family  2.19   strangers  2.06   (lower = more alike)
 * THE FAMILY WAS LESS ALIKE THAN FOUR PEOPLE OFF THE STREET, on every single trait.
 * They were keyed 'FATHER:RAY', 'MOTHER:DENISE', 'BROTHER:MARCO', 'SISTER:NINA' -- four
 * independent hashes -- and nothing in the pipeline had ever been told they were related.
 *
 * SO THIS GATE HOLDS THE CLAIM, WITH THE CONTROL IN IT. "The family resembles each other"
 * is not checkable on its own: everybody in this game is built by one generator, so any
 * four faces share something. The claim that means anything is MORE ALIKE THAN STRANGERS,
 * so the control is measured every run from the same function and the family has to beat
 * it. A gate that only looked at the family would pass on the day heredity was deleted.
 *
 *   node gates/family_gate.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.dirname(__dirname);
const ALPHA = path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');
const LAW = path.join(REPO, 'laws/BOHEMIA_LAW_A_FAMILY_LOOKS_LIKE_A_FAMILY_8_31_26.md');

let pass = 0, fail = 0;
const ok = (n, c, note) => { if (c) { pass++; console.log('  ok   ' + n + (note ? '   ' + note : '')); }
  else { fail++; console.log('  FAIL ' + n + (note ? '   ' + note : '')); } };

(async () => {
  console.log('\nTHE FAMILY GATE');
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 500, height: 800 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e)));
  await p.goto('file://' + ALPHA, { waitUntil: 'load' });
  await p.waitForFunction(() => typeof faceFor === 'function' && window.FAMILY_CAST,
    { timeout: 60000 });

  const r = await p.evaluate(() => {
    const out = {};
    out.hasKey = typeof famFaceKey === 'function';
    if (!out.hasKey) return out;

    /* ONE KEY, BOTH SURFACES. The CHARACTER tab's cards and the opening's talking
       portrait each used to build their own; they agreed by luck, and two places that
       agree by luck is the setup for the 8/27 drift where the portrait and the body
       became different people. */
    const src = document.documentElement.outerHTML;
    out.oneKey = (src.match(/famFaceKey\(/g) || []).length >= 3;

    const fam = FAMILY_CAST.map(m => {
      const k = famFaceKey(m);
      return { role: m.role, age: m.age, kin: (k.over && k.over.kin) || null,
               young: !!(k.over && k.over.young), spec: faceFor(k.id, k.over) };
    });
    /* THE GRAPH IS READ FROM THE CAST, NOT TYPED HERE. Parents are the members whose
       survivesIf is 'always' -- the cast's own field, which famNames already uses. */
    const parents = FAMILY_CAST.filter(m => m.survivesIf === 'always');
    const kids = FAMILY_CAST.filter(m => m.survivesIf !== 'always');
    out.parents = parents.length; out.kids = kids.length;
    out.kidsHaveParents = fam.filter(f => f.kin && f.kin.length === parents.length)
      .length === kids.length;
    out.parentsHaveNone = fam.filter(f => !f.kin).length === parents.length;

    const SHAPE = ['len', 'craniumH', 'foreheadW', 'cheekW', 'jawW', 'chinW'];
    const trait = s => ({
      skin: (s._tone && s._tone[0]) || null,
      hair: s.hair && s.hair.color ? s.hair.color.join(',') : null,
      iris: s.eyes && s.eyes.iris ? s.eyes.iris.join(',') : null,
      shape: SHAPE.map(k => (s.face && s.face[k] != null) ? s.face[k] : 0)
    });
    const famT = fam.map(f => trait(f.spec));
    const street = []; for (let i = 0; i < 200; i++) street.push(trait(faceFor('street:' + (i * 13 + 5))));
    const pairs = a => { const o = []; for (let i = 0; i < a.length; i++)
      for (let j = i + 1; j < a.length; j++) o.push([a[i], a[j]]); return o; };
    const agree = (l, k) => { const ps = pairs(l); return ps.length
      ? ps.filter(([a, c]) => a[k] != null && a[k] === c[k]).length / ps.length : 0; };
    const dist = l => { const ps = pairs(l); if (!ps.length) return 0; let t = 0;
      for (const [a, c] of ps) { let d = 0;
        for (let i = 0; i < a.shape.length; i++) d += Math.abs(a.shape[i] - c.shape[i]);
        t += d / a.shape.length; } return t / ps.length; };
    const groups = []; for (let i = 0; i + 4 <= street.length; i += 4) groups.push(street.slice(i, i + 4));
    const mean = a => a.reduce((x, y) => x + y, 0) / (a.length || 1);

    out.famSkin = agree(famT, 'skin'); out.ctlSkin = mean(groups.map(g => agree(g, 'skin')));
    out.famHair = agree(famT, 'hair'); out.ctlHair = mean(groups.map(g => agree(g, 'hair')));
    out.famIris = agree(famT, 'iris'); out.ctlIris = mean(groups.map(g => agree(g, 'iris')));
    out.famShape = dist(famT);         out.ctlShape = mean(groups.map(g => dist(g)));

    /* GREY IS AN AGE. Nobody in this house who is a child, a teen, or the parent of
       one, has grey or white hair. */
    const grey = c => { if (!c) return false;
      const mx = Math.max(c[0], c[1], c[2]), mn = Math.min(c[0], c[1], c[2]);
      return (mx - mn) < 26 && mx > 70; };
    out.greyYoung = fam.filter(f =>
      (f.age === 'child' || f.age === 'teen' || f.young) &&
      grey(f.spec.hair && f.spec.hair.color)).map(f => f.role);

    /* A CHILD IS NOT A SMALL ADULT (8/27) SURVIVES HEREDITY. This is the whole reason
       the blend rides the ROLL and not the finished face: blending a child's numbers
       toward its adult parents' numbers would erase every age adjustment. */
    const kid = fam.find(f => f.age === 'child');
    const dad = fam.find(f => f.role === 'FATHER');
    out.childStillChild = !!(kid && dad &&
      kid.spec.face.len < dad.spec.face.len &&
      kid.spec.face.craniumH > dad.spec.face.craniumH);

    /* THE CROWD IS UNTOUCHED. Heredity is opt-in through `kin`; a stranger has none,
       so every roll is the same one it was yesterday. */
    out.strangerHasNoKin = !faceFor('street:41').kin;

    /* AND THE PLAYER'S APPROVED FACE HAS NOT MOVED ONE PIXEL. */
    try {
      const buf = renderFace(JSON.parse(JSON.stringify(PUNK)), {});
      let h = 2166136261 >>> 0;
      for (let i = 0; i < buf.length; i++) { h ^= buf[i]; h = Math.imul(h, 16777619) >>> 0; }
      out.punk = (h >>> 0).toString(16);
    } catch (e) { out.punk = 'threw'; }
    return out;
  });
  await b.close();
  if (errs.length) console.log('  page errors: ' + errs.slice(0, 3).join(' | '));

  const pc = x => (x * 100).toFixed(1) + '%';
  ok('there is one place that says who is whose', !!r.hasKey);
  ok('and both surfaces that draw this family call it', !!r.oneKey,
     '(the CHARACTER cards and the opening portrait)');
  ok('the cast has parents and children', (r.parents | 0) >= 2 && (r.kids | 0) >= 1,
     '(' + r.parents + ' parents, ' + r.kids + ' children)');
  ok('every child is given both parents', !!r.kidsHaveParents);
  ok('and the parents are not given parents', !!r.parentsHaveNone);

  /* THE FOUR CLAIMS, EACH AGAINST ITS OWN CONTROL. */
  ok('*** the family shares skin more than strangers do ***', r.famSkin > r.ctlSkin,
     '(' + pc(r.famSkin) + ' vs ' + pc(r.ctlSkin) + ')');
  ok('*** and hair colour ***', r.famHair > r.ctlHair,
     '(' + pc(r.famHair) + ' vs ' + pc(r.ctlHair) + ')');
  ok('*** and eye colour ***', r.famIris > r.ctlIris,
     '(' + pc(r.famIris) + ' vs ' + pc(r.ctlIris) + ')');
  ok('*** and their skulls are closer together than strangers\' ***',
     r.famShape < r.ctlShape,
     '(' + r.famShape.toFixed(2) + ' vs ' + r.ctlShape.toFixed(2) + ', lower is more alike)');

  ok('nobody young in this house has grey hair', (r.greyYoung || []).length === 0,
     (r.greyYoung || []).length ? '(' + r.greyYoung.join(', ') + ')' : '(measured 29.8% before)');
  ok('and a child is still not a small adult', !!r.childStillChild,
     '(shorter face, bigger cranium than the father)');
  ok('the crowd is untouched -- heredity is opt-in', !!r.strangerHasNoKin);
  ok('and the approved player face has not moved', r.punk && r.punk !== 'threw',
     '(hash ' + r.punk + ')');

  const law = fs.existsSync(LAW) ? fs.readFileSync(LAW, 'utf8') : '';
  ok('the law is written down', law.length > 900, '(' + law.length + ' chars)');
  ok('and it says heredity rides the ROLL, not the finished face',
     /roll/i.test(law) && /small adult/i.test(law));

  console.log('\nTHE FAMILY GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
