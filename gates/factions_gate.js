/* THE FACTIONS GATE (FACTIONS lane, rows [the parties on the map] and [a house you give a fuck about], rule 80c)
   Every faction in records/target/bb/factions.json has a FACE slot, a WANT and a BASE; a banner nobody else owns
   (and never purple); a make-up made only of real enemy ids; a behaviour; and a quote or an honest 'ours' on
   every number. A face id is a slot: this gate refuses a person's name in it. */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const F = require(path.join(ROOT, 'engine/bohemia_factions.js'));
const D = JSON.parse(fs.readFileSync(process.env.FACTIONS_FILE || path.join(ROOT, 'records/target/bb/factions.json'), 'utf8'));
const EN = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/enemies.json'), 'utf8')).rows;
const BT = require(path.join(ROOT, 'engine/bohemia_boardterrain.js'));
const COL = JSON.parse(fs.readFileSync(path.join(ROOT, 'engine/BOHEMIA_faction_colours.json'), 'utf8')).factions;
let pass = 0, fail = 0;
const ok = (n, c, note) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n + (note ? '  [' + note + ']' : ''))); };
F.set(D, JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/party_math.json'), 'utf8')));
const ids = new Set(EN.map(e => e.id)), efac = new Set(EN.map(e => e.faction));
const lab = h => { let c = [1, 3, 5].map(i => parseInt(h.substr(i, 2), 16) / 255).map(v => v <= .04045 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4));
  const X = (c[0] * .4124 + c[1] * .3576 + c[2] * .1805) / .95047, Y = c[0] * .2126 + c[1] * .7152 + c[2] * .0722, Z = (c[0] * .0193 + c[1] * .1192 + c[2] * .9505) / 1.08883;
  const f = t => t > .008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116; return [116 * f(Y) - 16, 500 * (f(X) - f(Y)), 200 * (f(Y) - f(Z))]; };
const dE = (a, b) => { const x = lab(a), y = lab(b); return Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2]); };
const hue = h => { const r = [1, 3, 5].map(i => parseInt(h.substr(i, 2), 16) / 255), mx = Math.max(...r), mn = Math.min(...r), d = mx - mn; if (!d) return -1;
  let H = mx === r[0] ? ((r[1] - r[2]) / d) % 6 : mx === r[1] ? (r[2] - r[0]) / d + 2 : (r[0] - r[1]) / d + 4; return (H * 60 + 360) % 360; };
const cp = require('child_process');
const flat = t => t.replace(/\[https?:\/\/\S+ ([^\]]*)\]/g, '$1').replace(/\[\[(?:[^|\]]*\|)?([^\]]*)\]\]/g, '$1').replace(/\s+/g, ' ');
const wikiHas = (src, q) => { try { const n = (src.split('bb_all/')[1] || ''); return flat(cp.execSync('tar -xzOf ' + path.join(ROOT, 'reference/library/grok/wiki/PAGES_ALL.tar.gz') + ' "bb_all/' + n + '"', { encoding: 'utf8', maxBuffer: 1 << 24 })).includes(flat(q)); } catch (e) { return false; } };
const hasQuote = o => o && typeof o.source === 'string' && o.source && typeof o.quote === 'string' && o.quote.length > 8;
const NAMEY = /^face-[a-z]+(-[a-z]+)+$/;

ok('four or more factions', D.factions.length >= 4);
const seen = new Set(), banners = [];
for (const f of D.factions) {
  const n = f.id;
  ok(n + ': unique id', !seen.has(n)); seen.add(n);
  ok(n + ': FACE has an id, a role, and a portrait slot', f.face && NAMEY.test(f.face.id || '') && f.face.role && 'portrait' in f.face);
  ok(n + ': face ids are unique', D.factions.filter(g => g.face && g.face.id === (f.face || {}).id).length === 1);
  ok(n + ': WANT has an id, text and a source', f.want && f.want.id && f.want.text && hasQuote(f.want));
  ok(n + ': BASE has a kind, a tier and a note', f.base && f.base.kind && f.base.tier && f.base.note);
  ok(n + ': VOICE is a draft attempt', f.voice && f.voice.draft === true && typeof f.voice.text === 'string');
  ok(n + ': MEMORY is driven by beef and names tones', f.memory && f.memory.driven_by === 'beef' && Array.isArray(f.memory.tones) && f.memory.tones.every(t => ['cold', 'neutral', 'warm'].indexOf(t) >= 0));
  ok(n + ': enemy_faction exists in the Battle Brothers data', efac.has(f.enemy_faction));
  ok(n + ': ground kinds named', Array.isArray(f.ground) && f.ground.length >= 1);
  ok(n + ': every ground is a real board terrain kind', f.ground.every(g => BT.KINDS.indexOf(g) >= 0), f.ground.filter(g => BT.KINDS.indexOf(g) < 0).join(','));
  ok(n + ': grounds are marked ours and noted', f.ground_ours === true && typeof f.ground_note === 'string' && f.ground_note.length > 10);
  ok(n + ': behaviour is raid, patrol, caravan or roam', ['raid', 'patrol', 'caravan', 'roam'].includes(f.behaviour));
  if (f.behaviour_quote) ok(n + ': the behaviour quote is really on its wiki page', wikiHas(f.behaviour_source, f.behaviour_quote.replace(/\s*\(.*$/, '')), f.behaviour_source);
  if (f.ground_quote) ok(n + ': the ground quote is really on its wiki page', wikiHas(f.ground_quote.source, f.ground_quote.quote), f.ground_quote.source);
  ok(n + ': a faction whose ground has a quote cites a page; the dead (no wiki line) says ours', f.ground_quote ? true : f.ground_ours === true);
  ok(n + ': behaviour is sourced or marked ours', f.behaviour_ours === true || hasQuote({ source: f.behaviour_source, quote: f.behaviour_quote }));
  for (const ph in f.mix) {
    const ks = Object.keys(f.mix[ph]);
    ok(n + '/' + ph + ': every unit is a real enemy', ks.length && ks.every(k => ids.has(k)), ks.filter(k => !ids.has(k)).join(','));
    ok(n + '/' + ph + ': counts are whole and positive', ks.every(k => Number.isInteger(f.mix[ph][k]) && f.mix[ph][k] > 0));
    ok(n + '/' + ph + ': the party has a count word', F.countWord(F.size(f.mix[ph])) !== null);
  }
  ok(n + ': a make-up is sourced or marked ours', f.mix_ours === true || !!f.mix_source);
  ok(n + ': the early party is smaller than the late one', F.size(f.mix.early || {}) <= F.size(f.mix.late || f.mix.early));
  if (f.banner !== 'canon') {
    ok(n + ': banner is a hex', /^#[0-9a-f]{6}$/i.test(f.banner));
    ok(n + ': banner is never purple', !(hue(f.banner) >= 255 && hue(f.banner) <= 330));
    banners.push([n, f.banner]);
    for (const c in COL) ok(n + ': banner is far from ' + c, dE(f.banner, COL[c].hex) >= 25, dE(f.banner, COL[c].hex).toFixed(1));
  } else ok(n + ': a canon colour is the house only', n === 'noble_houses');
  ok(n + ': card reads the data', F.card(n, 5) && F.card(n, 5).face === f.face.id && F.card(n, 5).word === 'SOME');
}
for (let i = 0; i < banners.length; i++) for (let j = i + 1; j < banners.length; j++)
  ok(banners[i][0] + '/' + banners[j][0] + ' banners differ', dE(banners[i][1], banners[j][1]) >= 25);
ok('byGround finds a faction for each ground and none for a made-up one', D.factions.every(f => F.byGround(f.ground[0]).id === f.id && F.byGround(f.ground[f.ground.length - 1]).id === f.id) && F.byGround('nowhere') === null);
ok('a ground belongs to one faction', (() => { const s = {}; let bad = false; D.factions.forEach(f => f.ground.forEach(g => { if (s[g]) bad = true; s[g] = 1; })); return !bad; })());
ok('the memory line follows the relations band through its tone', F.memoryLine('brigands', 'hostile') === D.factions[0].lines.value.cold && F.memoryLine('brigands', 'neutral') === D.factions[0].lines.value.neutral && F.memoryLine('brigands', 'allied') === D.factions[0].lines.value.warm && F.memoryLine('brigands', 'nonsense') === null && F.memoryLine('beasts', 'neutral') === null);
ok('the gaps are written down honestly', D.gaps && D.gaps.length >= 2);
/* ---- FACES MEET AGAIN (row [faces meet again]): the join, ready for the day a portrait id lands ---- */
{ const RD2 = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/relations.json'), 'utf8')).bands.value.map(b => b.id);
  const tones = D.tones.value, all = [].concat(tones.cold, tones.neutral, tones.warm);
  ok('the three tones cover every relations band exactly once', all.length === RD2.length && RD2.every(b => all.filter(x => x === b).length === 1), all.join());
  ok('tones are marked ours', D.tones.ours === true);
  const ES = /\b(esta|para|te|vete|vecino|amigo|flaco|pero|no|le|digas|nadie|vimos|camino|carretera|es|nuestra|mijo)\b/i;
  for (const f of D.factions) {
    if (f.lines.value) {
      ok(f.id + ': a line for every tone it can say', ['cold', 'neutral', 'warm'].every(t => typeof f.lines.value[t] === 'string' && f.lines.value[t].length > 8));
      ok(f.id + ': the lines are drafts and ours', f.lines.draft === true && f.lines.ours === true);
      ok(f.id + ': the voice is its neutral line', f.voice.text === f.lines.value.neutral);
      ok(f.id + ': memory tones match the lines it has', f.memory.tones.length === 3);
      if (f.lines.spanglish) ok(f.id + ': it speaks Spanglish (the language law)', Object.values(f.lines.value).every(t => ES.test(t)));
      else ok(f.id + ': a non-Spanglish speaker says so', f.lines.spanglish === false);
      ok(f.id + ': no em dash in a line', Object.values(f.lines.value).every(t => t.indexOf('\u2014') < 0));
    } else {
      ok(f.id + ': a faction with no words names its sound and has no tones', typeof f.lines.sound === 'string' && f.memory.tones.length === 0 && f.voice.text === '');
    }
    for (const band of RD2) {
      const sc = F.scene(f.id, band);
      ok(f.id + '/' + band + ': a scene is known', sc.known === true && sc.who === f.face.id && sc.want === f.want.text);
      ok(f.id + '/' + band + ': WITHOUT A PORTRAIT NOTHING IS SAID', f.face.portrait ? true : (sc.speaks === false && sc.say === null));
      if (f.lines.value) ok(f.id + '/' + band + ': the unspoken line is the band\'s tone line', sc.unspoken === f.lines.value[F.toneOf(band)] && sc.why === 'PORTRAIT_OWED');
      else ok(f.id + '/' + band + ': no words, a sound, and nothing to say', sc.why === 'NO_WORDS_A_SOUND' && sc.unspoken === null && sc.say === null);
    }
  }
  /* the day a portrait lands: the same scene speaks */
  { const keep = D.factions[0].face.portrait; D.factions[0].face.portrait = 'portrait-stand-in';
    const warm = F.scene('brigands', 'allied'), cold = F.scene('brigands', 'hostile');
    ok('the day a portrait id is in the slot it speaks the band\'s line', warm.speaks === true && warm.say === D.factions[0].lines.value.warm && cold.say === D.factions[0].lines.value.cold && warm.say !== cold.say);
    ok('and a beast still has nothing to say', (() => { const b = D.factions.find(x => x.id === 'beasts'); const k = b.face.portrait; b.face.portrait = 'x'; const r = F.scene('beasts', 'neutral'); b.face.portrait = k; return r.speaks === false && r.say === null; })());
    D.factions[0].face.portrait = keep; }
  ok('an unknown faction and an unknown band are refused by name', F.scene('nobody', 'hostile').why === 'NOT_A_FACTION' && F.scene('brigands', 'furious').why === 'NOT_A_BAND');
}
/* ---- WHO GUARDS (row [who guards]): the holder of the ground guards, with its own units, sized to the guard ---- */
{ const GG = require(path.join(ROOT, 'engine/bohemia_godgear.js')), OM = require(path.join(ROOT, 'engine/bohemia_overmap.js'));
  const top = Math.max(...Object.values(GG.DEFENDED));
  for (const pl of GG.names()) {
    const kind = BT.kindOf(GG.PLACES[pl].district), guard = Math.round(GG.CEILING.guard * (GG.DEFENDED[pl] / top)), g = F.guardFor(kind, guard);
    ok(pl + ': its district maps to a real terrain kind', !!kind && BT.KINDS.indexOf(kind) >= 0);
    if (g.known) {
      const holder = D.factions.find(f => f.ground.indexOf(kind) >= 0);
      ok(pl + ': guarded by the faction that holds ' + kind, g.faction === holder.id);
      ok(pl + ': the party is exactly ' + guard + ' men', F.size(g.party) === guard, F.size(g.party));
      ok(pl + ': every unit is in that faction\'s own make-up', Object.keys(g.party).every(u => ['early', 'late'].some(ph => u in holder.mix[ph])));
      ok(pl + ': a leader never comes twice', holder.leaders.value.every(l => (g.party[l] || 0) <= 1));
    } else ok(pl + ': an unheld ground answers by name', g.why === 'NO_FACTION_HOLDS_THIS_GROUND');
  }
  ok('any place on an unheld ground has that ground named in the gaps', GG.names().every(pl => { const k = BT.kindOf(GG.PLACES[pl].district); return D.factions.some(f => f.ground.indexOf(k) >= 0) || D.gaps.some(x => x.indexOf(k) >= 0); }));
  ok('the default guard is the late make-up and the early one differs', (() => { const l = F.guardFor('freeway', 20), e = F.guardFor('freeway', 20, 'early'); return JSON.stringify(l.party) !== JSON.stringify(e.party) && e.party.brigand_thug > l.party.brigand_thug; })());
  { const save = D.factions; const real = F.all().slice();
    F.set({ factions: [{ id: 'q', ground: ['k'], mix: { late: { a: 2, b: 1, c: 1 } }, leaders: { value: [] }, banner: '#000000', name: 'Q' }] }, JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/party_math.json'), 'utf8')));
    const two = F.guardFor('k', 3).party;
    ok('largest remainder: 2,1,1 into three men gives one each (b and c outrank a)', JSON.stringify(two) === JSON.stringify({ a: 1, b: 1, c: 1 }), JSON.stringify(two));
    F.set(D, JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/party_math.json'), 'utf8'))); }
  ok('no faction holds the strip: it answers by name, never a guess', F.guardFor('the_strip', 10).why === 'NO_FACTION_HOLDS_THIS_GROUND');
  ok('a zero or half guard is refused', F.guardFor('industrial', 0).why === 'NO_GUARD' && F.guardFor('industrial', 2.5).why === 'NO_GUARD');
  for (const t of [1, 2, 3, 7, 12, 60]) for (const f of D.factions) { const k = f.ground[0]; ok(f.id + ' at ' + t + ' men sums exactly', F.size(F.guardFor(k, t).party) === t); }
  ok('the same ask gives the same party', JSON.stringify(F.guardFor('freeway', 33)) === JSON.stringify(F.guardFor('freeway', 33)));
  ok('leaders are in the make-up and ours', D.factions.every(f => f.leaders && f.leaders.ours === true && f.leaders.value.every(l => (f.mix.late[l] || f.mix.early[l]))));
}
console.log('FACTIONS GATE ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
