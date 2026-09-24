/* ============================================================================
   BOHEMIA A NAME (9/21/26, PEOPLE lane).
   VAMILY [a name], row THE-PERSON-AT-HIS-DOOR-HAS-A-NAME. Inside [face at the
   door], which is rule 19(d)'s fourth thing, and this lane's cook for the round
   under RULE 22.

   QUESTS e7e9ab81: "0 of 21 bodies on his block have a name, all answer
   SOMEBODY."

   *** MEASURED ON THE ALPHA WITH THE GAME'S OWN READER BEFORE A LINE WAS
   WRITTEN, AND IT WAS BIGGER THAN THE ROW: 61 PEOPLE, 61 OF THEM TIER
   'stranger', 0 NAMED, 0 NAMES KNOWN. *** The person who speaks at his door
   answers WATCH.

   *** THEN THE CONTROL LANDED AND IT IS THE WHOLE FINDING: ONE CALL TO
   CT_MET.ask TURNED "WATCH" INTO "Marisela Escobar". *** tier stranger ->
   asked, namesKnown 0 -> 1. Three more keys give Amos Ellison, Perla Nguyen,
   Renata Duong. THE NAMES WERE ALWAYS THERE: 64 given names and 48 surnames
   have been in bohemia_people since 7/31, under a law that is right -- A NAME
   IS EARNED, NEVER GIVEN -- and the EARNING HAD EXACTLY ONE DOOR IN THE WHOLE
   GAME, a button called #ctask on #ctcard. That is the card surface rule 19(a)
   just killed. The law was not being kept, it was STARVING.

   AND A THIRD THING WAS BUILT AND NEVER REACHED: ctNames draws a gold name tag
   over a person's head, with a dark ring so it reads over any ground. It has
   drawn nothing for the life of the game, because nobody was ever named.

   THIS ROUND OPENS THE DOOR OFF THE CARD, THE REAL-WORLD WAY: a stranger who
   walks up to YOU wanting something opens with who they are. Somebody you walk
   past does not owe you their name. So an INTERACTIVE moment earns the name and
   an ambient bark never does, and three things light up at once -- the tag over
   their head, the heading in their bubble, and every list that names people.

   WHAT THIS HOLDS:
   A. one writer, one reader: nothing here invents, stores or duplicates a name
   B. the door is the moment somebody wants something, and only that
   C. the bubble says who is talking, and the trade is what you get instead
   D. on the glass, on the alpha: the tag, the heading, and the crowd still
      strangers
   E. the VOTE tab carries the names, because names are his

   node gates/a_name_gate.js
   ========================================================================== */
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
const CITY = path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html');
const REG = path.join(ROOT, 'records/target/BOHEMIA_VOTE_REGISTRY.json');
const REC = path.join(ROOT, 'records/BOHEMIA_A_NAME_9_21_26.txt');
const DRIVE = path.join(ROOT, 'tools/bohemia_drive_the_demo.js');

let pass = 0; const fail = []; const notes = [];
function ok(claim, cond, note) {
  if (cond) { pass++; console.log('  ok   ' + claim + (note ? '   ' + note : '')); }
  else { fail.push(claim); console.log('  FAIL ' + claim + (note ? '   ' + note : '')); }
}
function probe(claim, cond) {
  if (cond) { pass++; console.log('  ok   [self-test] ' + claim); }
  else { fail.push('[self-test] ' + claim); console.log('  FAIL [self-test] ' + claim); }
}
function head(t) { console.log('\n' + t); }
function note(t, v) { notes.push('  NOTE  ' + t + (v == null ? '' : '   ' + v)); }
function stripComments(s) {
  return s.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/^\s*\/\/.*$/gm, ' ');
}
function flat(s) { return String(s).replace(/\s+/g, ' '); }
function bodyOf(src, name) {
  const i = src.indexOf('function ' + name);
  if (i < 0) return '';
  let d = 0, started = false;
  for (let k = i; k < src.length; k++) {
    if (src[k] === '{') { d++; started = true; }
    else if (src[k] === '}') { d--; if (started && d === 0) return src.slice(i, k + 1); }
  }
  return '';
}

(async () => {
  const cityRaw = fs.readFileSync(CITY, 'utf8');
  const city = stripComments(cityRaw);

  /* ======================================================================== */
  head('A. ONE WRITER, ONE READER');
  /* ======================================================================== */
  const askName = bodyOf(city, 'ctAskName');
  const speakerHead = bodyOf(city, 'ctSpeakerHead');
  probe('the two new functions are in the walked city at all',
        askName.length > 40 && speakerHead.length > 40);

  ok('*** THE NAME IS NOT INVENTED HERE. *** The only thing written is the one '
     + 'bit the ledger already owns, through the ledger\'s own call, the same one '
     + 'the card\'s ask button makes',
     /CT_MET\.ask\s*\(/.test(askName)
     && !/generatedName|GIVEN|SURNAME/.test(askName));
  /* *** A DELETE IS NOT A SECOND LIST. *** (Amended 9/24 by this lane's own
     [bubble face].) This claim forbids STORING who is known anywhere but the
     ledger, and it enforced that by refusing the mere TOKEN FACE_CV. The face
     bridge caches a built face by id and never asks twice, so when a name is
     earned that cached face has to be thrown away or she keeps a stranger's face
     for ever under a plate carrying her name. `delete FACE_CV[id]` is the
     OPPOSITE of storing: it makes the one reader be consulted again.
     So the test asks for what it means -- no WRITE into a second book -- and a
     delete is named as allowed rather than tolerated by accident. */
  const _stores = /(FACE_CV|NAME_CV|NAME_BOOK)\s*\[[^\]]*\]\s*=|var\s+NAMES\s*=/;
  const _bodies = askName + speakerHead;
  ok('and nothing new stores a name, so there is no second list of who is known',
     !_stores.test(_bodies));
  probe('and the sweep can still see the caches it is watching, so that green is '
    + 'not a regex that matches nothing',
    /FACE_CV/.test(_bodies) ? /delete\s+FACE_CV/.test(_bodies) : true);
  ok('asked once is asked forever: the writer refuses a second time rather than '
     + 'counting meetings it did not have',
     /CT_MET\.asked\s*\(/.test(askName) && /return\s+false/.test(askName));
  ok('*** AND THE READER IS THE ONE THE REST OF THIS FILE ALREADY USES. *** '
     + 'ctPersonName is what the down card, the crew list and the lock list read, '
     + 'so a person cannot end up called two things on two surfaces, which is this '
     + 'lane\'s own recurring defect',
     /ctPersonName\s*\(/.test(speakerHead));
  ok('and whether it is really a NAME is asked of the person, never guessed by '
     + 'comparing strings',
     /ctPerson\s*\(/.test(speakerHead) && /\.name/.test(speakerHead)
     && !/indexOf|toUpperCase\s*\(\)\s*===|==\s*ctKindWord/.test(speakerHead));
  ok('nothing is transformed on the way out, so a name arrives looking like a '
     + 'name and a trade arrives looking like a label',
     !/toUpperCase|toLowerCase/.test(speakerHead));
  ok('the day the ask is written down is the game\'s own day, not a number picked '
     + 'here', /T\s*&&\s*T\.day/.test(askName));

  /* ======================================================================== */
  head('B. THE DOOR IS SOMEBODY WANTING SOMETHING');
  /* ======================================================================== */
  const speak = bodyOf(city, 'walkSpeak');
  probe('walkSpeak is still the walk director\'s mouth', speak.length > 200);
  ok('the ask is a second argument, so the same mouth can speak without earning '
     + 'anything', /function walkSpeak\s*\(\s*got\s*,\s*ask\s*\)/.test(speak));
  ok('*** AND IT IS EARNED BEFORE THE BUBBLE IS BUILT ***, so the very first thing '
     + 'they say already carries their name instead of their trade',
     speak.indexOf('ctAskName') > 0
     && speak.indexOf('ctAskName') < speak.indexOf('BARK.text = txt'));
  const interactive = city.slice(city.indexOf("got.kind === 'interactive'"),
                                 city.indexOf("got.kind === 'interactive'") + 400);
  ok('the branch where somebody comes to HIM passes the ask',
     /walkSpeak\s*\(\s*got\s*,\s*true\s*\)/.test(interactive));
  ok('*** AND THE AMBIENT BARK DOES NOT, *** because somebody talking near you '
     + 'owes you nothing. The deed bark sets the same slot and never calls it',
     !/ctAskName/.test(bodyOf(city, 'ctDeedBark')));
  ok('and the road\'s own card is still not what opens this: no card is opened by '
     + 'the walk director at all, which is rule 19(e) from the round before',
     !/roadCard\s*\(/.test(interactive));

  /* ======================================================================== */
  head('C. THE BUBBLE SAYS WHO IS TALKING');
  /* ======================================================================== */
  const bark = bodyOf(city, 'barkPass');
  probe('barkPass is the bubble', bark.length > 600);
  ok('the bubble asks for a heading', /ctSpeakerHead\s*\(\s*BARK\.p\s*\)/.test(bark));
  ok('*** THE BUBBLE GROWS TO FIT IT ***, so the heading is never painted over the '
     + 'first line of what they said, the same rule the face had to obey',
     /_hh\s*=\s*_hd\s*\?/.test(flat(bark))
     && /lines\.length\s*\*\s*lh\s*\+\s*_hh/.test(flat(bark)));
  ok('and wide enough for it too', /w\s*=\s*Math\.max\(\s*w\s*,\s*gg\.measureText\(\s*_hd\.text/.test(flat(bark)));
  ok('*** NO HEADING, NO SPACE: *** a person the game cannot name at all draws the '
     + 'bubble it drew before, to the pixel',
     /_hd\s*\?\s*12\s*:\s*0/.test(flat(bark)));
  ok('the words start below the heading, not on top of it',
     /by \+ padY \+ _hh \+ m \* lh/.test(flat(bark)));
  ok('a name they gave you and a trade you guessed at are not the same colour, '
     + 'because one of them is a fact about them and the other is a fact about you',
     /_hd\.named\s*\?\s*'#[0-9a-f]{6}'\s*:\s*'#[0-9a-f]{6}'/.test(flat(bark)));
  ok('and the heading is smaller than what they said, because who is talking is '
     + 'not the sentence', /9px/.test(flat(bark)) && /11px/.test(flat(bark)));
  ok('the font is put back before the words, so a heading cannot shrink the line '
     + 'under it', (flat(bark).match(/gg\.font = '11px/g) || []).length >= 2);

  /* ======================================================================== */
  head('D. ON THE GLASS, ON THE ALPHA');
  /* ======================================================================== */
  let drove = false;
  try {
    const { open } = require(DRIVE);
    /* THE ALPHA, NOT THE DEMO: the demo is a baked cut and an alpha change is
       not in it. That cost this lane a whole measurement on 9/20. */
    const d = await open({ file: 'BOHEMIA_ALPHA_0_9.html' });
    await d.clearCards();
    drove = true;
    const r = await d.fr.evaluate(async () => {
      const out = {};
      const g = document.querySelector('canvas').getContext('2d');
      const oText = g.fillText; let texts = [];
      g.fillText = function (t, x, y) {
        texts.push({ t: String(t), x: Math.round(x), y: Math.round(y), f: this.font });
        return oText.apply(this, arguments);
      };
      const frame = () => { texts = []; try { render(); } catch (e) {} return texts.slice(); };

      /* *** A CONTROL THAT SAYS "AT BOOT NOBODY HAS A NAME" MUST ASK FOR A BOOT.
         *** This gate read "1 of 61 named at boot" and it was telling the truth:
         the met-ledger is SAVED to localStorage, and any probe in this lane that
         asks somebody their name leaves that behind for the next run of the same
         browser profile. The claim was about the profile, not about the game, and
         it stayed green for two rounds only because nothing had asked yet.
         THE GAME'S OWN WIPE, never a second idea of what clean means: ctPeopleWipe
         clears the five saved keys AND rebuilds the ledger in memory. That second
         half is the whole point, and this lane learned it the hard way on
         [lock them]: clearing storage does NOT clear the book, because the loader
         only overwrites when storage has something.
         AND THE WIPE PROVES ITSELF rather than being trusted. */
      try { ctPeopleWipe(); } catch (e) { out.wipeThrew = String(e && e.message); }
      out.wiped = (function () {
        try { return localStorage.getItem('boh.city.met') === null; } catch (e) { return false; }
      })();

      /* THE FLOOR: the block is full of people, so nothing below is measured on
         an empty street. */
      const all = (typeof ctEveryone === 'function' ? ctEveryone() : []) || [];
      out.population = all.length;
      let named0 = 0;
      for (const p of all) { try { if (ctPerson(p).name) named0++; } catch (e) {} }
      out.namedAtBoot = named0;
      try { out.knownAtBoot = CT_MET.namesKnown() | 0; } catch (e) { out.knownAtBoot = -1; }

      /* A. AN AMBIENT BARK. *** THE CLOCK IS performance.now(): ctDeedBark sets
         BARK.until from its caller and its one real caller is barkTick, which
         runs on the wall clock. Handing it a game minute expires the bubble
         before the first render and every claim below reads a blank screen. *** */
      try { ctDeed('favour', null, null); } catch (e) {}
      ctDeedBark(performance.now());
      const sp1 = BARK.p ? String(BARK.p.id) : null;
      out.ambientWho = sp1;
      out.ambientFrame = frame().filter(o => o.t !== 'HOME');
      out.ambientTags = (window.__CT_NAMES || []).slice();
      out.ambientAsked = sp1 ? CT_MET.asked('P:city:' + sp1) : null;

      /* B. THE SAME MOUTH, THE SAME MOMENT, WITHOUT THE ASK. The argument has to
         be what does it, or "an ambient bark earns nothing" is a claim about one
         call site instead of about the mechanism. */
      out.spokeNoAsk = walkSpeak({ id: 'scavenger_shakedown', kind: 'interactive' });
      const sp0 = BARK.p ? String(BARK.p.id) : null;
      out.askedWithoutTheAsk = sp0 ? CT_MET.asked('P:city:' + sp0) : null;
      out.headWithoutTheAsk = ctSpeakerHead(BARK.p);

      /* C. SOMEBODY COMES TO HIM WANTING SOMETHING */
      out.spoke = walkSpeak({ id: 'scavenger_shakedown', kind: 'interactive' }, true);
      const sp2 = BARK.p ? String(BARK.p.id) : null;
      out.who = sp2;
      out.asked = sp2 ? CT_MET.asked('P:city:' + sp2) : null;
      out.head = ctSpeakerHead(BARK.p);
      out.frame = frame().filter(o => o.t !== 'HOME');
      out.tags = (window.__CT_NAMES || []).slice();
      out.knownAfter = CT_MET.namesKnown() | 0;
      out.readerA = ctPersonName(sp2);
      out.readerB = ctWhoName(sp2);
      let named1 = 0;
      for (const p of all) { try { if (ctPerson(p).name) named1++; } catch (e) {} }
      out.namedAfter = named1;
      g.fillText = oText;
      return out;
    });

    note('the block', r.population + ' people, ' + r.namedAtBoot + ' named at boot');
    note('the ambient bubble', r.ambientFrame.map(o => o.t).join(' | ') || 'nothing drew');
    note('after somebody wanted something', r.frame.map(o => o.t).join(' | ') || 'nothing drew');
    note('the tag over their head', r.tags.join(', ') || 'none');

    probe('*** AND THE SAVE WAS REALLY WIPED FIRST, through the game\'s own wipe, '
          + 'so "at boot" below is a boot and not whatever the last run left '
          + 'behind ***', r.wiped === true && !r.wipeThrew);
    probe('the street really has people on it, so none of this is an empty pass',
          r.population > 10);
    probe('somebody really spoke to him', r.spoke === true && !!r.who);

    ok('*** THE CONTROL, AND IT IS THE WHOLE ROUND: AT BOOT NOBODY IN THIS GAME '
       + 'HAS A NAME. *** Not the crowd, not the person who talks to you',
       r.namedAtBoot === 0 && r.knownAtBoot === 0,
       r.namedAtBoot + ' of ' + r.population + ' named, ' + r.knownAtBoot + ' known');
    ok('*** AND A STRANGER TALKING NEAR HIM STAYS A STRANGER. *** Their bubble '
       + 'carries their trade, and it earns them nothing',
       r.ambientAsked === false
       && r.ambientFrame.some(o => /^[A-Z ]{3,}$/.test(o.t)),
       'bubble said ' + (r.ambientFrame[0] ? r.ambientFrame[0].t : 'nothing'));
    ok('and nothing is written over their head either, so the trade is only in the '
       + 'bubble', r.ambientTags.length === 0);
    ok('*** AND THE SAME MOUTH SPEAKING THE SAME MOMENT WITHOUT THE ASK EARNS '
       + 'NOTHING EITHER ***, so what names somebody is the asking and not the '
       + 'speaking. Their bubble still says their trade',
       r.spokeNoAsk === true && r.askedWithoutTheAsk === false
       && !!r.headWithoutTheAsk && r.headWithoutTheAsk.named === false,
       r.headWithoutTheAsk ? r.headWithoutTheAsk.text : 'nothing said');
    ok('*** SOMEBODY WHO COMES TO HIM WANTING SOMETHING TELLS HIM WHO THEY ARE ***, '
       + 'which is the door this round opened and the only one off the card',
       r.asked === true && !!r.head && r.head.named === true,
       r.head ? r.head.text : 'no heading');
    ok('*** AND IT IS ON THE REAL CANVAS, IN THEIR OWN BUBBLE, ABOVE THEIR OWN '
       + 'WORDS ***, watched on the glass and not recomputed here',
       (function () {
         if (!r.head) return false;
         const hd = r.frame.find(o => o.t === r.head.text);
         const line = r.frame.find(o => o.t !== r.head.text && o.t.length > 12
                                        && !r.tags.includes(o.t));
         return !!hd && !!line && hd.y < line.y;
       })(),
       r.frame.length + ' pieces of text in the frame');
    ok('*** AND THE GOLD TAG OVER THEIR HEAD FINALLY DRAWS SOMETHING. *** ctNames '
       + 'was built to do this and has drawn nothing for the life of the game, '
       + 'because nobody was ever named',
       r.tags.length === 1, r.tags.join(', ') || 'none');
    ok('and the tag and the bubble are the same person, because they read the same '
       + 'one answer',
       !!r.head && r.tags.length === 1
       && String(r.head.text).split(' ')[0] === r.tags[0]);
    ok('every other reader in the game says the same name too',
       r.readerA === (r.head && r.head.text) && r.readerB === r.readerA,
       r.readerA + ' / ' + r.readerB);
    ok('*** AND THE CROWD IS STILL STRANGERS. *** Exactly one person is named, so '
       + 'the law holds: a name is earned, and only the one who wanted something '
       + 'earned it', r.namedAfter === 1 && r.knownAfter === 1,
       r.namedAfter + ' of ' + r.population + ' named');
    ok('and nothing threw while any of it happened', d.errs.length === 0,
       'page errors ' + d.errs.length + (d.errs.length ? ': ' + d.errs[0] : ''));
    await d.close();
  } catch (e) {
    ok('the alpha drive finished', false, e.message);
  }
  probe('the drive really ran, so a green above is not an empty pass', drove);

  /* ======================================================================== */
  head('E. THE VOTE TAB CARRIES THE NAMES, BECAUSE NAMES ARE HIS');
  /* ======================================================================== */
  let item = null;
  try {
    const reg = JSON.parse(fs.readFileSync(REG, 'utf8'));
    item = (reg.items || []).find(i => i.id === 'people-the-names-at-your-door-9-21');
  } catch (e) {}
  ok('this lane cooked something and it is in the tab, which is rule 22', !!item);
  ok('it is this lane\'s, and it says when', !!item && item.lane === 'people'
     && item.made === '9/21');
  ok('*** AND IT SHOWS HIM THE REAL NAMES THE GAME HANDS OUT ***, not a sample I '
     + 'wrote for the page',
     !!item && /Marisela Escobar/.test(item.show.src)
     && /Amos Ellison/.test(item.show.src) && /Renata Duong/.test(item.show.src));
  ok('and it says plainly that the trade stays for a stranger, so a yes does not '
     + 'quietly name the whole street',
     !!item && /stranger/i.test(item.show.src));
  ok('and it gives him a second way to go, because a vote with one option is not a '
     + 'vote', !!item && /plainer/i.test(item.show.src));

  /* ======================================================================== */
  head('F. THE RECORD SAYS WHAT WAS MEASURED');
  /* ======================================================================== */
  let rec = '';
  try { rec = fs.readFileSync(REC, 'utf8'); } catch (e) {}
  ok('the record exists and carries the measurement that started it',
     /61/.test(rec) && /stranger/i.test(rec));
  ok('and the control that made the negative believable',
     /Marisela Escobar/.test(rec) && /CT_MET\.ask/.test(rec));
  ok('and it names the door that was the only one, so nobody rebuilds it',
     /ctask/i.test(rec) && /card/i.test(rec));
  ok('and it writes down the gate bug it found in this lane\'s own older gate',
     /could not fail|cannot fail/i.test(rec));

  console.log('');
  notes.forEach(n => console.log(n));
  console.log('\n=== A NAME: ' + pass + ' pass / ' + fail.length + ' fail ===');
  fail.forEach(f => console.log('   - ' + f));
  process.exit(fail.length ? 1 : 0);
})();
