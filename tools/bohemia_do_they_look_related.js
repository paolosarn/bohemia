/* DO THEY LOOK RELATED? (8/31/26, CHARACTER lane)
 *
 * Paolo, 8/31, one word: "VAMILY". He had just watched the opening -- the family at the
 * table, the blink, ten years later -- so the word is FAMILY.
 *
 * THE QUESTION THIS ASKS, BEFORE ANYTHING IS TOUCHED: does the family in the cold open
 * look like a family, or like four people who happened to sit down together?
 *
 * WHY IT IS IN DOUBT. faceFor(id) has rolled a grounded face for every stranger in the
 * valley since 8/27, deterministic off the id so nobody shimmers. The family is keyed
 * `ROLE:NAME` -- 'FATHER:RAY', 'MOTHER:DENISE', 'BROTHER:MARCO', 'SISTER:NINA' -- four
 * INDEPENDENT hashes. Nothing in that pipeline knows they are related.
 *
 * MEASURE FIRST, AND WITH A CONTROL. A number about the family alone says nothing: what
 * matters is whether they are MORE ALIKE THAN STRANGERS. So it renders the four, and 200
 * random citizens, and compares the same traits both ways. If the family scores like the
 * strangers, they are strangers.
 *
 * RIG CHECK (RIG IS LAW, 7/26): reads and reports, writes nothing back. Never touches
 * BAKED, a joint, a bone or a painted pixel.
 *   built on: faceFor + renderFace (read-only)   joints: none   parts: none
 *
 * REUSE CHECK: cooks ZERO graphic pixels. Every face is the alpha's own faceFor, which is
 * the point -- a number here is a number about what the game actually draws. Looked at
 * tools/bohemia_does_the_portrait_wear_your_haircut.js (the 8/28 agreement report, whose
 * measure-then-look shape this follows) and tools/bohemia_face_candidates.js.
 *
 *   node tools/bohemia_do_they_look_related.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.dirname(__dirname);
const OUT = path.join(REPO, 'records/BOHEMIA_DO_THEY_LOOK_RELATED_8_31_26.txt');

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 500, height: 800 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e)));
  await p.goto('file://' + path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html'), { waitUntil: 'load' });
  await p.waitForFunction(() => typeof faceFor === 'function' && window.FAMILY_CAST, { timeout: 40000 });

  const r = await p.evaluate(() => {
    /* THE EXACT KEY THE GAME USES, ASKED FOR BY NAME. The first cut of this tool
       rebuilt the key itself -- `role + ':' + name` with an age -- and when heredity
       landed the numbers did not move by a thousandth, because the ruler was still
       measuring the old path while the game had moved. A RULER THAT BUILDS ITS OWN
       COPY OF WHAT IT MEASURES IS MEASURING ITS OWN COPY. famFaceKey is the one
       place that says who is whose, and both surfaces in the game call it. */
    const fam = FAMILY_CAST.map(m => {
      const k = (typeof famFaceKey === 'function')
        ? famFaceKey(m) : { id: m.role + ':' + m.name, over: { age: m.age || 'adult' } };
      return { role: m.role, name: m.name, age: m.age, key: k.id,
               kin: (k.over && k.over.kin) ? k.over.kin.join(' + ') : '-',
               spec: faceFor(k.id, k.over) };
    });

    /* THE TRAITS A PERSON ACTUALLY READS AS FAMILY RESEMBLANCE. Not a pixel diff: two
       people are not related because their pictures are similar, they are related because
       the HERITABLE things agree. Skin and eye colour are the strongest and most obvious;
       the skull proportions (how long the head is, how wide the cheeks, how heavy the jaw)
       are what face recognition calls the identity channel at this size. */
    const SHAPE = ['len', 'craniumH', 'foreheadW', 'cheekW', 'jawW', 'chinW'];
    /* *** AND THE SKIN FIELD DID NOT EXIST. *** The first cut read `s.skin`, which
       faceFor has never set -- the resolved tone lives on `s._tone`. So it compared
       undefined to undefined and reported 100% AGREEMENT ON THE ONE TRAIT A PERSON
       SEES FIRST, for the family AND for the strangers, while the rendered picture
       showed four different colours of person sitting at one table. A METRIC THAT
       READS A FIELD THAT DOES NOT EXIST REPORTS PERFECT AGREEMENT, and it will do it
       confidently, forever. Only rendering the four and looking caught it. */
    const trait = s => ({
      skin: (s._tone && s._tone[0]) || null,
      hairCol: s.hair && s.hair.color ? s.hair.color.join(',') : null,
      iris: s.eyes && s.eyes.iris ? s.eyes.iris.join(',') : null,
      shape: SHAPE.map(k => (s.face && s.face[k] != null) ? s.face[k] : 0),
      noseW: s.nose ? s.nose.w : null,
      mouthW: s.mouth ? s.mouth.w : null
    });
    const famT = fam.map(f => trait(f.spec));

    /* 200 CITIZENS AS THE CONTROL. Same function, same call shape, unrelated ids. */
    const street = [];
    for (let i = 0; i < 200; i++) street.push(trait(faceFor('street:' + (i * 13 + 5))));

    /* PAIRWISE AGREEMENT. For a categorical trait: do the two match. For the shape
       vector: distance, reported as a mean absolute difference per field. */
    const pairs = (arr) => { const out = []; for (let i = 0; i < arr.length; i++)
      for (let j = i + 1; j < arr.length; j++) out.push([arr[i], arr[j]]); return out; };
    const agree = (list, k) => { const ps = pairs(list); if (!ps.length) return 0;
      return ps.filter(([a, c]) => a[k] != null && a[k] === c[k]).length / ps.length; };
    const shapeDist = (list) => { const ps = pairs(list); if (!ps.length) return 0;
      let t = 0; for (const [a, c] of ps) { let d = 0;
        for (let i = 0; i < a.shape.length; i++) d += Math.abs(a.shape[i] - c.shape[i]);
        t += d / a.shape.length; } return t / ps.length; };

    /* the control is sampled in groups of four, the size of this family, so the numbers
       are comparable -- a 200-way average is not the same statistic as a 4-way one. */
    const groups = [];
    for (let i = 0; i + 4 <= street.length; i += 4) groups.push(street.slice(i, i + 4));
    const mean = a => a.reduce((x, y) => x + y, 0) / (a.length || 1);

    return {
      family: fam.map((f, i) => ({ role: f.role, name: f.name, age: f.age, kin: f.kin,
        skin: famT[i].skin, hair: famT[i].hairCol, iris: famT[i].iris,
        shape: famT[i].shape })),
      famSkin: agree(famT, 'skin'), famHair: agree(famT, 'hairCol'), famIris: agree(famT, 'iris'),
      famShape: shapeDist(famT),
      ctlSkin: mean(groups.map(g => agree(g, 'skin'))),
      ctlHair: mean(groups.map(g => agree(g, 'hairCol'))),
      ctlIris: mean(groups.map(g => agree(g, 'iris'))),
      ctlShape: mean(groups.map(g => shapeDist(g))),
      groups: groups.length
    };
  });

  await b.close();
  if (errs.length) console.log('  page errors: ' + errs.slice(0, 3).join(' | '));

  const pc = x => (x * 100).toFixed(1) + '%';
  const L = [];
  L.push('DO THEY LOOK RELATED? -- the family in the cold open, measured');
  L.push('8/31/26, CHARACTER lane. Written BEFORE anything was changed.');
  L.push('');
  L.push('Paolo, 8/31: "VAMILY". He had just watched the opening. The word is FAMILY.');
  L.push('');
  L.push('THE FOUR, AS THE GAME ROLLS THEM (via famFaceKey, the key the game itself uses)');
  L.push('');
  for (const m of r.family)
    L.push('  ' + (m.role + '/' + m.name).padEnd(16) + (m.age || '').padEnd(7) +
      'hair ' + String(m.hair).padEnd(14) + ' eyes ' + String(m.iris).padEnd(13) +
      ' parents: ' + m.kin);
  L.push('');
  L.push('AGREEMENT WITHIN THE FAMILY, AGAINST FOUR STRANGERS OFF THE STREET');
  L.push('(' + r.groups + ' control groups of four, same function, unrelated ids)');
  L.push('');
  L.push('                        family      strangers');
  L.push('  same skin tone        ' + pc(r.famSkin).padStart(6) + '      ' + pc(r.ctlSkin));
  L.push('  same hair colour      ' + pc(r.famHair).padStart(6) + '      ' + pc(r.ctlHair));
  L.push('  same eye colour       ' + pc(r.famIris).padStart(6) + '      ' + pc(r.ctlIris));
  L.push('  skull difference      ' + r.famShape.toFixed(2).padStart(6) + '      ' +
    r.ctlShape.toFixed(2) + '   (mean px per measurement; lower = more alike)');
  L.push('');
  const verdict = (r.famSkin <= r.ctlSkin + 0.05 && r.famHair <= r.ctlHair + 0.05 &&
    r.famShape >= r.ctlShape - 0.5);
  L.push(verdict
    ? 'THE FAMILY IS NOT MORE ALIKE THAN FOUR STRANGERS. On every trait a person\n' +
      'reads as resemblance, they score at or below random citizens. Your mother,\n' +
      'your father, your brother and your sister are four people the generator has\n' +
      'never been told are related, because nothing in the pipeline carries that\n' +
      'fact -- the key is ROLE:NAME and every hash is independent.'
    : 'The family scores above the control on at least one trait. Read the rows.');
  L.push('');
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, L.join('\n') + '\n');
  console.log(L.join('\n'));
  console.log('\nWROTE ' + path.relative(REPO, OUT));
})();
