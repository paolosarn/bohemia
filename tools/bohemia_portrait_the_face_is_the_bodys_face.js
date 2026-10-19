#!/usr/bin/env node
/* PORTRAIT [the face is the body's face] (rule 120(d), Paolo 10/18: 'the portraits don't look like the people... Black
   people looking like white people'). THE READ: what the game's ONE skin mechanism says each person the fight and the
   settlement field IS, straight out of the alpha, nothing decided here.
     NPC_FACTORY.npcFrom(id).skinToneName   the person's skin (the factory has owned skin since 7/2; faceFor reads it,
                                            'SKIN AND HAIR COME FROM THE BODY, NOT FROM HERE', the 9/20 law)
     SKIN_TONES                             the game's eleven skin ramps (lit, mid, dark), world-graded
     the worn cut's own hair ramp           GARMENTS' hair entry for the look's worn.hair (the ramp the body draws it in)
     skinTone                               the player's own skin (YOU), from the face maker
   The id is the one the fight bake keys a person's face and body with ('fight:' + look id, tools/bohemia_fight_people_bake.js
   via famPaintBody / famFaceKey), so this is the same person the sheets were baked from.
   Out (stdout path): a JSON the python half composes into records/target/portrait/BOHEMIA_THE_SKIN_OF_RECORD.json.
   Run: node tools/bohemia_portrait_the_face_is_the_bodys_face.js <out.json> */
'use strict';
const fs = require('fs');
const { open } = require('./bohemia_drive_the_demo.js');

(async () => {
  const d = await open({ alpha: true });
  let ok = false;
  for (let i = 0; i < 240 && !ok; i++) {
    ok = await d.page.evaluate(() => typeof faceFor === 'function' && typeof NPC_FACTORY !== 'undefined'
      && !!window.CITY_CAST_LOOKS && !!window.FACTION_LOOKS && !!window.GARMENTS).catch(() => false);
    if (!ok) await d.page.waitForTimeout(500);
  }
  if (!ok) { console.log('the alpha never exposed its factory'); await d.browser.close(); process.exit(1); }
  const out = await d.page.evaluate(() => {
    const ramp = (name) => {   /* the cut's own ramp, read off its generator (genHair(g,{...ramp:H_BLK...})) */
      const g = window.GARMENTS.filter(x => x.n === name && x.layer === 'hair')[0];
      if (!g || !g.gen) return null;
      const m = String(g.gen).match(/ramp\s*:\s*(H_[A-Z]{3})/);
      if (!m) return null;
      let r = null; try { r = eval(m[1]); } catch (e) { r = null; }
      return r ? { ramp: m[1], dk: r.dk, mid: r.mid, lt: r.lt } : { ramp: m[1] };
    };
    const looks = [{ id: 'you', kind: 'you' }]
      .concat(window.CITY_CAST_LOOKS.map(l => ({ id: 'cast_' + l.id, kind: 'cast', worn: l.worn })))
      .concat(window.FACTION_LOOKS.map(l => ({ id: 'faction_' + l.faction.toLowerCase(), kind: 'faction', worn: l.worn })));
    const people = {};
    for (const L of looks) {
      const id = 'fight:' + L.id;
      let np = null; try { np = NPC_FACTORY.npcFrom(id); } catch (e) { np = null; }
      const tone = L.kind === 'you' ? skinTone[0] : (np && np.skinToneName);
      people[L.id] = { kind: L.kind, id: id, skin: tone,
        skin_from: L.kind === 'you' ? 'skinTone (the player\'s own, the face maker)' : 'NPC_FACTORY.npcFrom(\'' + id + '\').skinToneName',
        worn_hair: L.worn && L.worn.hair || null, worn_head: L.worn && L.worn.head || null,
        hair_ramp: L.worn && L.worn.hair ? ramp(L.worn.hair) : null };
    }
    return { tones: SKIN_TONES.map(t => ({ name: t[0], lit: t[1][0], mid: t[1][1], dark: t[1][2] })), people: people };
  });
  /* THE PROOF, NEVER SHIPPED (--bodies <dir>): the same body the fight bake paints (famPaintBody, SE, idle), once as it is
     and once with that person's own skin put on for the stroke and taken off after, the one change CHARACTER's
     [one skin, one person] makes in the engine. It shows what the body becomes; the game's sheets are not touched. */
  const bi = process.argv.indexOf('--bodies');
  if (bi > 0) {
    const dir = process.argv[bi + 1]; fs.mkdirSync(dir, { recursive: true });
    for (const id of Object.keys(out.people)) {
      const urls = await d.page.evaluate((args) => {
        const L = args.id, tone = args.tone, F = 112;
        const member = L === 'you' ? null : (L.indexOf('cast_') === 0 ? window.CITY_CAST_LOOKS.filter(x => 'cast_' + x.id === L)[0]
          : window.FACTION_LOOKS.filter(x => 'faction_' + x.faction.toLowerCase() === L)[0]);
        const m = member ? { worn: member.worn, dials: member.dials, age: member.age || 'adult', role: 'fight', name: L } : null;
        const paint = () => { const cv = document.createElement('canvas'); cv.width = F; cv.height = F;
          if (m) famPaintBody(cv, m, 'SE', 'idle', 0); else drawChar(cv, 'SE', 'idle', 0); return cv.toDataURL('image/png'); };
        const today = paint();
        const keep = skinTone; const t = SKIN_TONES.filter(s => s[0] === tone)[0];
        let own = null;
        try { if (t) skinTone = t; own = paint(); } finally { skinTone = keep; }
        return [today, own];
      }, { id: id, tone: out.people[id].skin });
      fs.writeFileSync(require('path').join(dir, id + '_today.png'), Buffer.from(urls[0].split(',')[1], 'base64'));
      fs.writeFileSync(require('path').join(dir, id + '_own_skin.png'), Buffer.from(urls[1].split(',')[1], 'base64'));
    }
  }
  fs.writeFileSync(process.argv[2], JSON.stringify(out, null, 1));
  await d.browser.close(); try { d.server && d.server.close(); } catch (_e) {}
  process.exit(0);
})().catch(e => { console.log('read failed: ' + e.message); process.exit(1); });
