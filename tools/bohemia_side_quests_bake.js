/* BAKE THE SIDE QUESTS (CONTENT [five side quests played], 11/2/26).
   QUESTS IS RESEARCH ONLY (rule 35, laws/BOHEMIA_ADDENDUM_QUESTS_IS_RESEARCH_ONLY_9_27_26.md): this lane implements FROM its
   pages, never asks it to build. The pages are quests/bq/*.bq (QUESTS' and PEOPLE's playable layer, parsed by engine/bohemia_bq.js);
   Pages does not publish quests/, so the game cannot read them: this tool turns five of them into a data file the map can read,
   records/target/BOHEMIA_SIDE_QUESTS.json, a modder's file. Every @SAY and @OPT line is carried VERBATIM (their words); what this
   lane adds is only the glue the .bq leaves to the world: WHO each role is on the map (a name and a portrait look), WHERE the
   giver is met (a road event: a person on the road), where the second person waits (a place out on the map), and what each ending
   pays (the .bq's own 'faction X +n' rows become the town's opinion; batteries and food where the ending earns them).
   Run: node tools/bohemia_side_quests_bake.js   (writes the file; prints the counts) */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const BQ = require(path.join(ROOT, 'engine/bohemia_bq.js'));

/* THE GLUE (draft:true): names and looks are attempts; the looks are PORTRAIT's (engine/bohemia_crew_faces.js LOOKS) */
const GLUE = {
  S07_SAY_IT_BACK: {
    meet: { where: ['any'], when: 'day', weight: 3, min_day: 1 },
    people: { dying: { name: 'DOÑA REFUGIO', look: 'faction_church', from: 'in a chair at the side of the road, a blanket on her knees' },
              wrongdoer: { name: 'EL TUERTO', look: 'cast_widebrim', from: 'a one-eyed man at a shack' } },
    places: { wrongdoer: { name: "EL TUERTO'S SHACK", act: 'CARRY HER WORDS', blocks: [6, 13] } },
    ends: { 30: { mood: { act: 'favor', place: 'faction:church' } }, 31: { mood: { act: 'civilian_contract_done', place: 'faction:church' } },
            32: { mood: { act: 'minor_offensive_action', place: 'faction:church' } }, 33: {} }
  },
  S12_THE_LAST_GOOD_DOCTOR: {
    meet: { where: ['any'], when: 'any', weight: 3, min_day: 1 },
    people: { medic: { name: 'DOCTORA IBARRA', look: 'faction_volunteers', from: 'outside a clinic tent, smoking' },
              runner: { name: 'EL FLACO', look: 'faction_cartel', from: 'a runner with a cooler' } },
    places: { runner: { name: "EL FLACO'S COOLER", act: 'FIND THE RUNNER', blocks: [6, 12] }, medic: { name: 'THE CLINIC TENT', act: 'BACK TO THE DOCTOR' } },
    ends: { 30: { bats: 10, mood: { act: 'civilian_contract_done', place: 'faction:volunteers' } }, 31: { bats: 15, mood: { act: 'civilian_contract_done', place: 'faction:volunteers' } },
            32: { bats: 30, mood: { act: 'civilian_contract_done', place: 'faction:cartel' } }, 33: { mood: { act: 'negotiation_fail', place: 'faction:volunteers' } } }
  },
  S14_WHAT_THE_DOG_KNOWS: {
    meet: { where: ['any'], when: 'day', weight: 3, min_day: 1 },
    people: { scav: { name: 'LA RATA', look: 'faction_homeless', from: 'a scavenger at a stairwell, with a dog' },
              sergeant: { name: 'SARGENTO VEGA', look: 'faction_remnants', from: 'an old soldier at the bottom of the stairs' } },
    places: { sergeant: { name: 'THE STAIRWELL', act: 'GO DOWN', blocks: [5, 11] } },
    ends: { 30: { bats: 8 }, 31: { bats: 12, mood: { act: 'civilian_contract_done', place: 'faction:remnants' } },
            32: { bats: 20, mood: { act: 'minor_offensive_action', place: 'faction:remnants' } }, 33: {} }
  },
  S04_WHAT_CRIES_IN_THE_DEEP: {
    meet: { where: ['rough', 'any'], when: 'night', weight: 3, min_day: 1 },
    people: { elder: { name: 'ABUELO CHEMA', look: 'faction_homeless', from: 'at a storm tunnel mouth, holding a lamp' },
              haunt: { name: 'THE VOICE IN THE TUNNEL', look: 'faction_network', from: 'somewhere down in the dark' } },
    places: { haunt: { name: 'THE STORM TUNNEL', act: 'GO DOWN', blocks: [4, 9] } },
    ends: { 30: { bats: 12, mood: { act: 'civilian_contract_done', place: 'faction:homeless' } }, 31: { bats: 12, mood: { act: 'civilian_contract_done', place: 'faction:homeless' } },
            32: { bats: 12, mood: { act: 'civilian_contract_poor', place: 'faction:homeless' } }, 33: {} }
  },
  S17_THE_SEED_THAT_DOES_NOT_COME_BACK: {
    meet: { where: ['any'], when: 'day', weight: 3, min_day: 1 },
    people: { grower: { name: 'DON ANSELMO', look: 'faction_blues', from: 'a seed yard behind a chain fence' },
              trader: { name: 'LA GÜERA', look: 'faction_caravans', from: 'a trader with a truck of sacks' } },
    places: { trader: { name: "THE SACK TRUCK", act: 'FIND THE TRADER', blocks: [7, 14] }, grower: { name: 'THE SEED YARD', act: 'BACK TO THE YARD' } },
    ends: { 30: { food: 3, mood: { act: 'civilian_contract_done', place: 'faction:blues' } }, 31: { food: 4, mood: { act: 'favor', place: 'faction:blues' } },
            32: { bats: 25, mood: { act: 'civilian_contract_done', place: 'faction:caravans' } }, 33: { mood: { act: 'offensive_action', place: 'faction:caravans' } },
            34: { mood: { act: 'negotiation_fail', place: 'faction:blues' } } }
  }
};

function setStage(dos) { for (const d of dos || []) { const m = /^set_stage\s+(\d+)/.exec(d.text); if (m) return +m[1]; } return null; }
function learns(dos) { const out = []; for (const d of dos || []) { const m = /^learn\s+(\S+)/.exec(d.text); if (m) out.push(m[1]); } return out; }

const out = { _about: 'CONTENT [five side quests played], 11/2/26. Baked by tools/bohemia_side_quests_bake.js from quests/bq (QUESTS\' pages, read and never asked to build): every say and every choice VERBATIM from the .bq; the glue (who each role is, where the giver is met on the road, where the second person waits, what an ending pays) is this lane\'s attempt, draft:true. Played by slices/bohemia_road_events.js: the giver stops you on the road (a face, the .bq\'s own words); when the talk turns to somebody who is not here, that person\'s place goes on the map; walk there, they talk; an ending\'s stage closes it and pays. A modder edits this file, or a .bq and the tool.', version: 'side-quests-11-2a', draft: true, quests: {} };
let nodes = 0, opts = 0, says = 0;
for (const [file, g] of Object.entries(GLUE)) {
  const Q = BQ.parse(fs.readFileSync(path.join(ROOT, 'quests/bq', file + '.bq'), 'utf8'));
  const q = { id: Q.id, file, title: Q.title, meet: g.meet, people: g.people, places: g.places, go: 20, start: null, nodes: {}, stages: {}, draft: true };
  for (const s of Q.stages) {
    const end = s.flags.indexOf('COMPLETE') >= 0 ? 'COMPLETE' : s.flags.indexOf('FAIL') >= 0 ? 'FAIL' : null;
    q.stages[s.n] = { log: s.log || '', end, tag: (s.tags || [])[0] || null, fx: end ? (g.ends[s.n] || {}) : undefined };
  }
  for (const t of Q.talks) {
    if (!q.start && t.entry && /stage>=10/.test(t.entry)) q.start = t.id;
    q.nodes[t.id] = { who: t.speaker, entry: t.entry || null, says: t.says.map(s => s.text),
      opts: t.opts.map(o => { const r = { t: o.text, to: o.to || 'END' }; const st = setStage(o.dos); if (st != null) r.stage = st; const l = learns(o.dos); if (l.length) r.learn = l; if (o.silence) r.silent = true; return r; }) };
    nodes++; opts += t.opts.length; says += t.says.length;
  }
  if (!q.start) q.start = Q.talks[0].id;
  out.quests[Q.id] = q;
}
fs.writeFileSync(path.join(ROOT, 'records/target/BOHEMIA_SIDE_QUESTS.json'), JSON.stringify(out, null, 1) + '\n');
console.log('side quests:', Object.keys(out.quests).length, 'nodes:', nodes, 'says:', says, 'choices:', opts);
