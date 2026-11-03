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
    people: { grower: { name: 'DOÑA ANSELMA', look: 'faction_blues', from: 'a seed yard behind a chain fence' },
              trader: { name: 'EL GÜERO', look: 'faction_caravans', from: 'a trader with a truck of sacks' } },
    places: { trader: { name: "THE SACK TRUCK", act: 'FIND THE TRADER', blocks: [7, 14] }, grower: { name: 'THE SEED YARD', act: 'BACK TO THE YARD' } },
    ends: { 30: { food: 3, mood: { act: 'civilian_contract_done', place: 'faction:blues' } }, 31: { food: 4, mood: { act: 'favor', place: 'faction:blues' } },
            32: { bats: 25, mood: { act: 'civilian_contract_done', place: 'faction:caravans' } }, 33: { mood: { act: 'offensive_action', place: 'faction:caravans' } },
            34: { mood: { act: 'negotiation_fail', place: 'faction:blues' } } }
  }
};

/* CONTENT 2 (11/3, ask line 342: 'keep building content please, all angles'): TEN MORE, act one, from the same library. Their
   endings are PAID BY ECONOMY 2's RULE (records/BOHEMIA_ECONOMY_A_JOB_PAYS_FOR_THE_TIME_AND_THE_RISK_11_2_26.md, the numbers read
   from records/target/bb/job_pay.json, never typed here): the trip's map hours (blocks x minutes_per_block, there and, when the talk
   comes back to the giver, back) x the crew's hour x (1 + the quiet margin) for a talk, floor 10; an ending that is a FIGHT pays
   the hours at the full margin + per_fight x skulls, floor 30 a skull, in its win (the loss pays nothing; a walk-away nothing).
   A poor block pays some of it in what it has (food, a man who joins): food at a man's night (the crew's hour x 24 / the men,
   about 2 batteries), a man at the hall's floor. An ending's pay: 'quiet' | 'fight' (with n, label, skulls) | 'none'; share
   scales it (the half-done ending, the one that cost you); food / man / mood / flag / say ride along.
   THREE TIE INTO WHAT IS ON THE MAP NOW (slices/bohemia_road_events.js, read only): THE BOSSES' LEAD-UPS (A06 met while THE
   POT's flyer is up, its store room AT his flyer; A05 while THE TAP's tag is up, the pump station AT his tag: walking there is
   reading his sign, BOSSES' own next step), A FACTION'S ROAMING PARTY (A03 met while a crew that hit somebody's ground is walking
   home with it: the gone outfit is the raided town, the crew is the one on the map), THE SCAVENGE ACTION IN A TOWN (D013 met on
   the first block out of a town whose lot you just searched: she saw you come out of it). */
const GLUE2 = {
  A01_THE_KILLING_SUMMER: {
    meet: { where: ['any'], when: 'day', weight: 3, min_day: 1 },
    people: { keeper: { name: 'DON TEO', look: 'cast_apron', from: 'at a standpipe spitting air, a line of empty jugs behind him' },
              upstream: { name: 'DOÑA PAZ', look: 'faction_blues', from: 'at the standpipe up the line, her own jugs half full' } },
    places: { upstream: { name: 'THE STANDPIPE UP THE LINE', act: 'WALK UP THE LINE', blocks: [5, 10] } },
    back: false,
    ends: { 30: { pay: 'quiet', mood: { act: 'civilian_contract_done', place: 'near' }, say: 'Don Teo sends a boy after you with what the block put in a can.' },
            31: { pay: 'quiet', food: 2, mood: { act: 'favor', place: 'near' }, say: 'Your block fills your jugs first. Nobody up the line will look at you.' },
            32: { pay: 'quiet', share: 0.5, mood: { act: 'negotiation_fail', place: 'near' }, say: 'Doña Paz pays you half of what Don Teo would have. Don Teo pays nothing.' }, 33: {} }
  },
  A02_THE_ELDERS_ACCIDENT: {
    meet: { where: ['any'], when: 'any', weight: 3, min_day: 1 },
    people: { kin: { name: 'NIETA LUZ', look: 'cast_skirt', from: 'in black, at a house with the curtains shut' },
              witness: { name: 'EL CAMILLERO', look: 'faction_volunteers', from: 'a stretcher-bearer standing on the slope behind the house' } },
    places: { witness: { name: 'THE SLOPE BEHIND THE HOUSE', act: 'GO AND LOOK', blocks: [2, 4] } },
    back: false,
    ends: { 30: { pay: 'quiet', say: 'In the box: cells wrapped in a 2029 newspaper, and a plane ticket to Dubai nobody used.' },
            31: { pay: 'quiet', mood: { act: 'favor', place: 'near' }, say: 'In the box: cells wrapped in a 2029 newspaper, and a plane ticket to Dubai nobody used.' },
            32: { pay: 'quiet', mood: { act: 'minor_offensive_action', place: 'near' }, say: 'In the box: cells wrapped in a 2029 newspaper, and a plane ticket to Dubai nobody used.' }, 33: {} }
  },
  A03_THE_FACTION_THAT_DIED: {
    meet: { where: ['any'], when: 'day', weight: 5, min_day: 1, needs: { raided: true } },
    people: { runner: { name: 'MEMO EL CORREDOR', look: 'faction_caravans', from: 'a runner off the {raided} road, out of breath' },
              elder: { name: 'DOÑA FAUSTA', look: 'faction_homeless', from: 'with forty people outside the {raided} gate, the {raider} dust still on the road' } },
    places: { elder: { name: 'THE {raided} GATE', act: 'WALK THEIR GROUND', near: 'raided', blocks: [1, 3] } },
    back: false,
    ends: { 30: { pay: 'man', man: { n: 1, name: 'ONE OF THE FORTY', look: 'faction_homeless', bg: 'refugee' }, mood: { act: 'minor_offensive_action', place: 'faction:{raided}' }, say: 'One of the forty walks with you now. The rest go to your block.' },
            31: { pay: 'man', man: { n: 1, name: 'ONE OF THE FORTY', look: 'faction_homeless', bg: 'refugee' }, say: 'One of the forty walks with you now. Nobody says whose ground it is. Yet.' },
            32: { pay: 'quiet', food: 2, mood: { act: 'minor_offensive_action', place: 'faction:{raider}' }, say: 'The forty give you what they carried out. Somebody runs to tell the {raider} what you said.' }, 33: {} }
  },
  A05_THE_DRY_TAPS: {
    meet: { where: ['any'], when: 'day', weight: 6, min_day: 1, needs: { boss_sign: 'THE TAP' } },
    people: { neighbour: { name: 'DOÑA CHAYO', look: 'cast_shortcoat', from: 'with a dry hose in her hand' },
              holder: { name: "THE TAP'S MEN", look: 'cast_widebrim', from: 'three men sitting on the pump station, rifles across their knees, his tag on the pipe' } },
    places: { holder: { name: 'THE PUMP STATION', act: 'WALK OUT TO THE PUMP', near: 'boss_sign', blocks: [1, 2] } },
    trip: 4, back: false,
    ends: { 30: { pay: 'fight', n: 3, skulls: 1, label: "THE TAP's men at the pump", mood: { act: 'favor', place: 'near' }, say: 'The taps run that night. His tag is still on the pipe, and the pipe runs to his pump house.' },
            31: { pay: 'none', bats: -8, mood: { act: 'favor', place: 'near' }, say: 'Eight batteries, and nobody down there ever hears it. The pipe still says his name.' },
            32: { pay: 'fight', n: 2, skulls: 1, label: "THE TAP's night watch", mood: { act: 'favor', place: 'near' }, say: 'Four of you in the dark and it worked. His tag is on the pipe. It runs to his pump house.' }, 33: {} }
  },
  A06_THE_FIRST_HARVEST: {
    meet: { where: ['any'], when: 'day', weight: 6, min_day: 1, needs: { boss_sign: 'THE POT' } },
    people: { grower: { name: 'DON ISIDRO', look: 'faction_blues', from: 'at a store room of sacks, a pencil behind his ear' },
              hand: { name: 'EL NENE', look: 'cast_pack', from: 'a field hand with an empty sack, by THE POT\'s flyer on the pole' } },
    places: { hand: { name: 'THE STORE ROOM', act: 'COUNT IT YOURSELF', near: 'boss_sign', blocks: [1, 2] } },
    trip: 4, back: false,
    ends: { 30: { pay: 'quiet', food: 2, say: 'It went in a sack to THE POT\'s kitchen, a meal a day for carrying it. Don Isidro gives you two nights of food.' },
            31: { pay: 'quiet', mood: { act: 'favor', place: 'near' }, say: 'A lock on the door. The flyer on the pole says HOT FOOD. ASK FOR THE POT.' },
            32: { pay: 'quiet', mood: { act: 'minor_offensive_action', place: 'near' }, say: 'El Nene says he carried it to THE POT because THE POT feeds the ones who carry. Then he is gone.' }, 33: {} }
  },
  A07_THE_TWO_FAMILIES: {
    meet: { where: ['any'], when: 'day', weight: 3, min_day: 1 },
    people: { neighbour_one: { name: 'DOÑA SALAZAR', look: 'cast_poncho', from: 'at her side of a broken fence' },
              neighbour_two: { name: 'DON PEÑA', look: 'cast_satchel', from: 'at the other side of the same fence' } },
    places: { neighbour_two: { name: 'THE PEÑA HOUSE', act: 'HEAR THE OTHER SIDE', blocks: [2, 3] } },
    back: false,
    ends: { 30: { pay: 'quiet', say: 'Both houses pay you a little, and neither one knows the other did.' },
            31: { pay: 'quiet', mood: { act: 'civilian_contract_done', place: 'near' }, say: 'One house pays you. The other closes its door.' },
            32: { pay: 'quiet', share: 0.5, mood: { act: 'minor_offensive_action', place: 'near' }, say: 'Nobody pays for a fence that is gone. Doña Salazar gives you half, to make you leave.' }, 33: {} }
  },
  D013_LONG_WALK_HOME: {
    meet: { on: 'scavenge', where: ['any'], when: 'any', weight: 3, min_day: 1 },
    people: { widow: { name: 'DOÑA MERCEDES', look: 'faction_church', from: 'at the gate of {town}, she watched you come out of the lot' },
              warden: { name: 'THE WARDEN', look: 'faction_homeless', from: 'in the east ruins, standing over the dead, waving the birds off' } },
    places: { warden: { name: 'THE EAST RUINS', act: 'BRING HIM HOME', blocks: [7, 13] }, widow: { name: "MERCEDES' DOOR", act: 'CARRY HIM HOME' } },
    back: true,
    ends: { 30: { pay: 'quiet', mood: { act: 'favor', place: 'near' }, say: 'She cannot pay much. She pays it all, and a plate is kept for you.' },
            31: { pay: 'quiet', mood: { act: 'civilian_contract_done', place: 'near' }, say: 'She cannot pay much. She pays it all.' },
            32: { pay: 'fight', n: 1, skulls: 1, label: 'the warden of the east ruins', mood: { act: 'minor_offensive_action', place: 'near' }, say: 'He fought you for a body that was not his. You carry it home anyway.' }, 33: {} }
  },
  S01_THE_METER_READER: {
    meet: { where: ['paved', 'any'], when: 'night', weight: 3, min_day: 1 },
    people: { lineman: { name: 'RUBÉN EL LINIERO', look: 'faction_trades', from: 'up a pole with a meter, every night at nine' },
              fixer: { name: 'LA FIXER', look: 'faction_network', from: 'at a split in the line, a laptop on a cooler' } },
    places: { fixer: { name: 'THE SPLIT IN THE LINE', act: 'FIND THE SPLIT', blocks: [4, 8] }, lineman: { name: 'THE BROWN BLOCK', act: 'BACK TO THE LINEMAN' } },
    back: true,
    ends: { 30: { pay: 'quiet', say: 'Rubén pays from his own pocket. He does not ask how.' },
            31: { pay: 'quiet', mood: { act: 'civilian_contract_done', place: 'faction:trades' }, say: 'The Trades pay the work order. Your name is on it, third.' },
            32: { pay: 'quiet', mood: { act: 'minor_offensive_action', place: 'faction:network' }, say: 'The block pays you in a can. Somebody upstream has your face now.' }, 33: {} }
  },
  S10_THE_COUNT_THAT_DOES_NOT_ADD: {
    meet: { where: ['any'], when: 'day', weight: 3, min_day: 1 },
    people: { canvasser: { name: 'EL CONTADOR', look: 'faction_network', from: 'a man with a clipboard, going door to door' },
              organizer: { name: 'DOÑA ROSA', look: 'faction_volunteers', from: 'at the food line, behind a table of crates' } },
    places: { organizer: { name: 'THE FOOD LINE', act: 'ASK THE FOOD LINE', blocks: [3, 7] } },
    back: false,
    ends: { 30: { pay: 'food', mood: { act: 'civilian_contract_done', place: 'faction:volunteers' }, say: 'The crates come. Your crew eats from them too.' },
            31: { pay: 'food', share: 0.6, say: 'Four fewer crates. Your crew eats a little less with everybody.' },
            32: { pay: 'none', mood: { act: 'minor_offensive_action', place: 'faction:network' }, say: 'No crates for a block that reads their mail out loud.' }, 33: {} }
  },
  S11_SIXTY_SECONDS_OF_RAIN: {
    meet: { where: ['rough', 'any'], when: 'day', weight: 3, min_day: 1 },
    people: { watcher: { name: 'DON CIRO', look: 'faction_blues', from: 'in the street, looking up at a blue sky' },
              tunnel: { name: 'LA FLACA', look: 'faction_homeless', from: 'at the culvert mouth, people asleep in the dark behind her' } },
    places: { tunnel: { name: 'THE CULVERT', act: 'GET THEM OUT', blocks: [3, 6] } },
    back: false,
    ends: { 30: { pay: 'quiet', mood: { act: 'favor', place: 'faction:homeless' }, say: 'The water comes through eight minutes later. La Flaca puts the cells they had in your hand.' },
            31: { pay: 'quiet', mood: { act: 'civilian_contract_done', place: 'near' }, say: 'The market pays for the bell. Somebody took La Flaca\'s bedroll.' },
            32: { pay: 'man', man: { n: 1, name: 'EL DEL CULVERT', look: 'faction_homeless', bg: 'beggar' }, say: 'One of the ones you pulled out walks with you now. He has nowhere to sleep anyway.' }, 33: {} }
  }
};
const PAYF = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/job_pay.json'), 'utf8'));
const PV = k => PAYF[k] && PAYF[k].value;
function payOf(g, places, e) {
  const sec = Object.keys(places).find(r => places[r].blocks && !places[r].near) || Object.keys(places)[0];
  const b = (places[sec] && places[sec].blocks) || [4, 8], trip = g.trip || (b[0] + b[1]) / 2;
  const hours = trip * (g.back ? 2 : 1) * PV('minutes_per_block') / 60, crew = PV('crew_cost_per_map_hour'), share = e.share == null ? 1 : e.share;
  const quiet = Math.max(10, Math.ceil(hours * crew * (1 + PV('violence').quiet_margin)));
  const fx = {}, why = { hours: Math.round(hours * 100) / 100, kind: e.pay };
  if (e.pay === 'quiet') fx.bats = Math.max(1, Math.round(quiet * share));
  if (e.pay === 'food') fx.food = Math.max(1, Math.round(quiet * share / 2));   /* the crates: a man's night is about 2 batteries */
  if (e.pay === 'man') { fx.man = e.man; fx.bats = Math.max(1, Math.round(quiet / 2)); }   /* a man who joins is most of it; the rest in cells */
  if (e.pay === 'fight') {
    const sk = e.skulls || 1, win = Math.max(PV('floor_per_skull') * sk, Math.ceil(hours * crew * (1 + PV('margin')) + PV('per_fight') * sk));
    fx.fight = { foe: e.foe || 'brigands', n: e.n || 2, skulls: sk, label: e.label, win: { bats: win, say: e.say }, lose: { say: 'You got out of it. Nobody pays for that.' } };
    why.win = win;
  }
  if (e.bats) fx.bats = (fx.bats || 0) + e.bats;
  if (e.food && e.pay !== 'food') fx.food = (fx.food || 0) + e.food;
  if (e.mood) fx.mood = e.mood;
  if (e.flag) fx.flag = e.flag;
  if (e.say && e.pay !== 'fight') fx.say = e.say;
  if (e.say && e.pay === 'fight') fx.say = '';
  why.bats = fx.bats || 0; why.food = fx.food || 0; why.quiet_rate = quiet;
  fx.pay_why = why;
  return fx;
}

function setStage(dos) { for (const d of dos || []) { const m = /^set_stage\s+(\d+)/.exec(d.text); if (m) return +m[1]; } return null; }
function learns(dos) { const out = []; for (const d of dos || []) { const m = /^learn\s+(\S+)/.exec(d.text); if (m) out.push(m[1]); } return out; }

const out = { _about: 'CONTENT [five side quests played], 11/2/26; CONTENT 2 [ten more], 11/3/26 (ask line 342): fifteen in all, the ten new ones paid by ECONOMY 2\'s rule (each ending\'s fx.pay_why says the hours and the rate), three of them met by what is on the map now (a boss\'s sign: A05, A06; a crew walking home from a raid: A03; a search in a town\'s lot: D013). Baked by tools/bohemia_side_quests_bake.js from quests/bq (QUESTS\' pages, read and never asked to build): every say and every choice VERBATIM from the .bq; the glue (who each role is, where the giver is met on the road, where the second person waits, what an ending pays) is this lane\'s attempt, draft:true. Played by slices/bohemia_road_events.js: the giver stops you on the road (a face, the .bq\'s own words); when the talk turns to somebody who is not here, that person\'s place goes on the map; walk there, they talk; an ending\'s stage closes it and pays. A modder edits this file, or a .bq and the tool.', version: 'side-quests-11-3a', draft: true, quests: {} };
let nodes = 0, opts = 0, says = 0;
const ALL = Object.assign({}, GLUE, GLUE2);
for (const [file, g] of Object.entries(ALL)) {
  const Q = BQ.parse(fs.readFileSync(path.join(ROOT, 'quests/bq', file + '.bq'), 'utf8'));
  const q = { id: Q.id, file, title: Q.title, meet: g.meet, people: g.people, places: g.places, go: 20, start: null, nodes: {}, stages: {}, draft: true };
  for (const s of Q.stages) {
    const end = s.flags.indexOf('COMPLETE') >= 0 ? 'COMPLETE' : s.flags.indexOf('FAIL') >= 0 ? 'FAIL' : null;
    const e0 = end ? (g.ends[s.n] || {}) : undefined;
    q.stages[s.n] = { log: s.log || '', end, tag: (s.tags || [])[0] || null, fx: end ? (e0.pay && end === 'COMPLETE' ? payOf(g, g.places, e0) : e0) : undefined };
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
