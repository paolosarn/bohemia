/* BOHEMIA -- MORE MUSIC: each new song's card page and its card (SOUNDS, 10/24/26, row [more music, on the one beat]).
   Called by tools/bohemia_sounds_more_music.js pages. One page per song, the REPO MAN THE MACHINE PARTY page's pattern
   (slices/BOHEMIA_REPO_MAN_THE_MACHINE_PARTY_10_19_26.html): the real valley map from its own camera, the recorded desert
   under it at the map's level, A the new song, B his parent song, C a second song of his (rule 119(c) and (d)), STOP,
   all at the same loudness through a phone. The card is written into the song's own file ('card'); only
   tools/bohemia_sounds_register_song.py puts it in the VOTE tab. */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
const SONGS = path.join(ROOT, 'slices', 'vote', 'songs');
const NOTE = ['C', 'C sharp', 'D', 'E flat', 'E', 'F', 'F sharp', 'G', 'A flat', 'A', 'B flat', 'B'];
const pc = root => (((9 + root - 55) % 12) + 12) % 12;   /* noteHz(semi) = 110 * 2^(semi/12): 110 Hz is A */
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const title = s => s.split(' ').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ');

const VOICE = {   /* plain words for the voices, for the card (his voices, named by what they sound like) */
  brokenkeys: 'a pawned piano with keys that stick', dreadbed: 'a low dread hum', cracklewire: 'a wire that crackles as it sings',
  vacancyhum: 'an empty building\'s hum', sizzle: 'a sizzling hat', drownedpiano: 'a drowned piano', undertowbass: 'an undertow bass',
  ride: 'a ride cymbal', rotviola: 'a rotting viola', chapelbreath: 'a held breath', call: 'a call and answer tune',
  atriumvox: 'the voice in the mall\'s ceiling', deadsat: 'a dead satellite still sending', ghostflute: 'a ghost flute', abyssbass: 'a deep abyss bass'
};

function page(song, M, file) {
  const A = song.row, P = song.parent, S2 = song.beside[1];
  const H = { [P]: M.his.find(h => h.name === P), [S2]: M.his.find(h => h.name === S2) };
  const rel = f => path.relative(path.join(ROOT, 'slices'), path.join(ROOT, f)).split(path.sep).join('/');
  const rows = song._rows;
  const pr = rows.find(r => r.n === P), sr = rows.find(r => r.n === S2);
  const cfg = {
    FILE: { song: rel(M.song.file), his: rel(H[P].file), two: rel(H[S2].file) },
    SCALE: { song: A.scale, his: pr.scale, two: sr.scale },
    ROOT: { song: pc(A.root), his: pc(pr.root), two: pc(sr.root) },
    LABEL: { song: 'A. ' + song.name + ', the new one, with the machine party in the hall on tape.',
      his: 'B. Your ' + P + ', the first minute, as the map plays it now.', two: 'C. Your ' + S2 + ', the first minute, as the map plays it now.' }
  };
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title(song.name))}</title>
<!-- SOUNDS lane, ${song.made}, row [more music, on the one beat]. RULE 158(d), PAOLO 10/24: 'a big thing is we need more
     music'. Rule 119: made with his songs' own machine, never edited.

     THE SONG: ${esc(song.name)}, his ${esc(P)}'s own row with ${song.changed.length} things changed (${esc(song.changed.join(', '))}), each
     taken from one of his canon songs (slices/vote/songs/${slug(song.name)}.json, provenance), played by his engine
     with REPO MAN THE MACHINE PARTY's machine (engine/bohemia_machine_party.js, his YES 10/19) playing along, the motor
     in this song's key, in the concrete hall on the worn tape.

     WHAT THIS PAGE IS: the real valley map (slices/BOHEMIA_MAP_CURRENT.html, untouched) from its own camera, the recorded
     desert under it at the map's level, A the new song, B his ${esc(P)} and C his ${esc(S2)} as the map plays them now,
     all recorded from the alpha's own engine by tools/bohemia_sounds_more_music.js at the same loudness through a phone.
     EYES AND EARS' line (rule 119(c)) is owed; rule 158(d) put the card in the tab. Nothing is wired before his YES
     (rule 122(d)). Gate: gates/more_music_gate.js. -->
<style>
  :root{ --ink:#1b1408; --paper:#e8dfc9; --line:#8a7a52; --dim:#6a5a3e; }
  html,body{margin:0;height:100%;background:#0d0b08;color:var(--paper);font:14px/1.45 ui-monospace,SFMono-Regular,Menlo,monospace}
  body{display:flex;flex-direction:column}
  #map{flex:1 1 auto;min-height:0;width:100%;border:0;background:#0d0b08}
  #bar{flex:0 0 auto;box-sizing:border-box;padding:10px 16px 12px;background:var(--ink);border-top:1px solid var(--line)}
  .row{display:grid;grid-template-columns:1fr 1fr;gap:8px}
  button{font:inherit;font-size:13px;background:var(--paper);color:var(--ink);border:1px solid var(--line);padding:8px 6px;min-height:44px;letter-spacing:1px;cursor:pointer;border-radius:0}
  button.on{background:#6a1d10;color:var(--paper)}
  button.old{background:#b9a77e}
  .num{font-size:12px;color:#b9a77e;margin-top:8px;min-height:3em}
</style></head><body>
<iframe id="map" src="BOHEMIA_MAP_CURRENT.html" title="the valley map"></iframe>
<div id="bar">
  <div class="row">
    <button id="song">A. ${esc(song.name)}</button>
    <button id="his" class="old">B. YOUR ${esc(P)}</button>
    <button id="two" class="old">C. YOUR ${esc(S2)}</button>
    <button id="stop">STOP</button>
  </div>
  <div class="num" id="num">Tap A, then B. A is new, made in your songs' own machine with the machine party playing along. B and C are your songs. Same engine, same loudness on a phone. The desert is under all three.</div>
</div>
<script>
(function(){
  'use strict';
  var AC=null, OUT=null, n=document.getElementById('num'), mode=null, bed=null, bedT=null, clock=null, BUF={}, cur=null, t0=0;
  var CFG=${JSON.stringify(cfg)};
  var FILE=CFG.FILE, SCALE=CFG.SCALE, ROOT=CFG.ROOT, LABEL=CFG.LABEL;
  function ctx(){ if(!AC){ var C=window.AudioContext||window.webkitAudioContext; AC=new C(); OUT=AC.createGain(); OUT.connect(AC.destination); } if(AC.state==='suspended') AC.resume(); return AC; }
  function load(p){ if(BUF[p]) return Promise.resolve(BUF[p]);
    return fetch(p).then(function(r){ if(!r.ok) throw new Error(p+' '+r.status); return r.arrayBuffer(); }).then(function(ab){ return new Promise(function(res,rej){ ctx().decodeAudioData(ab,res,rej); }); }).then(function(b){ return (BUF[p]=b); }); }
  /* the desert under the map, the same file, loop and level as the alpha's MAPDESERT */
  function bedOn(){ if(bed) return; var my=bed=AC.createGain(); my.gain.setValueAtTime(0,AC.currentTime); my.gain.linearRampToValueAtTime(0.45,AC.currentTime+1.5); my.connect(OUT);
    load('vote/settlement_heard/bed_day.mp3').then(function(b){ var XF=1.0, step=b.duration-XF;
      (function one(at){ if(bed!==my) return; var s=AC.createBufferSource(); s.buffer=b; var v=AC.createGain(); s.connect(v); v.connect(my);
        v.gain.setValueAtTime(0,at); v.gain.linearRampToValueAtTime(1,at+XF); v.gain.setValueAtTime(1,at+b.duration-XF); v.gain.linearRampToValueAtTime(0,at+b.duration);
        s.start(at); bedT=setTimeout(function(){ one(at+step); }, Math.max(100,(at+step-AC.currentTime-0.5)*1000)); })(AC.currentTime+0.05); }); }
  function bedOff(){ if(bedT) clearTimeout(bedT); bedT=null; if(bed){ var x=bed; bed=null; x.gain.cancelScheduledValues(AC.currentTime); x.gain.setValueAtTime(x.gain.value,AC.currentTime); x.gain.linearRampToValueAtTime(0,AC.currentTime+0.6); setTimeout(function(){ try{x.disconnect();}catch(e){} },900); } }

  /* his form, as his engine plays it (MUS.ARR, the first 32 bars), and the key it moves to (MUS.RT on the scale) */
  var ARR=['A','B','B','A','C','B','D','B'], RT=[0,0,2,0,3,2,0,1];
  var PART={ A:'the core: the bass, the kick, one drifting note on beat one', B:'the tune', C:'the strip: kick and bass only', D:'the tune an octave up' };
  var MACH={ A:'the coupling on the kick, the clock on the hat', B:'the coupling, the clock, steel every other bar', C:'the motor comes up', D:'the machine stamps four to the bar' };
  var NOTE=${JSON.stringify(NOTE)};
  function where(){ if(!cur) return; var t=AC.currentTime-t0; if(t<0) return; var b=Math.min(32,Math.floor(Math.max(0,t)/2)+1), si=Math.floor((b-1)/4);
    var sc=SCALE[mode], key=NOTE[(ROOT[mode]+sc[RT[si]%sc.length])%12];
    n.textContent=LABEL[mode]+'  Bar '+b+' of 32: '+PART[ARR[si]]+', in '+key+(b<=8?', no drums yet (the beat arrives late)':'')+(mode==='song'?(b<=8?'; the motor is already running':'; '+MACH[ARR[si]]):'')+'.'; }
  function songOff(){ if(cur){ var h=cur; cur=null; try{ h.g.gain.cancelScheduledValues(AC.currentTime); h.g.gain.setValueAtTime(h.g.gain.value,AC.currentTime); h.g.gain.linearRampToValueAtTime(0,AC.currentTime+0.15); h.src.stop(AC.currentTime+0.2); }catch(e){} } if(clock){ clearInterval(clock); clock=null; } }
  function mark(id){ ['song','his','two'].forEach(function(k){ document.getElementById(k).classList.toggle('on',k===id); }); }
  function go(id){
    ctx(); songOff(); mode=id; mark(id); n.textContent=LABEL[id]; bedOn();
    load(FILE[id]).then(function(b){ if(mode!==id) return; var s=AC.createBufferSource(), g=AC.createGain(); s.buffer=b; g.gain.setValueAtTime(0,AC.currentTime); g.gain.linearRampToValueAtTime(1,AC.currentTime+0.03);
        s.connect(g); g.connect(OUT); t0=AC.currentTime+0.02; s.start(t0); cur={src:s,g:g,buffer:b}; clock=setInterval(where,250);
        s.onended=function(){ if(cur&&cur.src===s){ cur=null; if(clock){ clearInterval(clock); clock=null; } n.textContent='That was the first minute. Tap it again, or another one.'; } }; })
      .catch(function(e){ n.textContent='the song did not load: '+e.message; });
  }
  ['song','his','two'].forEach(function(k){ document.getElementById(k).onclick=function(){ go(k); }; });
  document.getElementById('stop').onclick=function(){ if(!AC) return; songOff(); bedOff(); mode=null; mark(null); n.textContent='Stopped.'; };
  window.__moremusic=function(){ return { mode:mode, playing:!!cur, file:cur?(mode&&FILE[mode]):null, seconds:cur?+(AC.currentTime-t0).toFixed(2):0, bed:!!bed, loaded:Object.keys(BUF), text:n.textContent }; };
})();
</script>
</body></html>
`;
}

function cardFor(song, pageName) {
  const P = song.parent, S2 = song.beside[1];
  const said = song.changed.map(f => {
    const v = f === 'kick' ? null : (f.split('.').reduce((o, k) => o && o[k], song.row));
    const from = song.provenance[f][0];
    if (f === 'kick') return 'the kick from your ' + from;
    return (VOICE[v] || v) + ' from your ' + from;
  });
  const list = said.length > 1 ? said.slice(0, -1).join(', ') + ' and ' + said[said.length - 1] : said[0];
  return {
    id: 'sounds-' + song.id + '-10-24', kind: 'song', lane: 'sounds', sha: '', made: song.made,
    title: 'A NEW NIGHT SONG: ' + song.name,
    why: 'You said we need more music. This is a new night song made in your songs\' own machine: your ' + P + ' with ' + song.changed.length +
      ' things changed, each taken from one of your songs: ' + list + '. It is ' + song.story + '. The REPO MAN machine party plays along: the train ' +
      'coupling on the kick, the old clock on the hat, the motor in its key, in the concrete hall on a worn tape. A is the new song, B your ' + P +
      ', C your ' + S2 + ', same loudness on a phone, over the real map, on the 120 beat. It is not in the game until you say yes. EYES AND EARS\' line is owed (rule 119(c)); rule 158(d) put it here.',
    options: ['A, ' + song.name + ' joins your night songs', 'B, no, not this one'],
    show: { how: 'page', src: pageName },
    draft: true
  };
}

function pages(DESIGNS) {
  const { hisRows } = require(path.join(ROOT, 'tools', 'bohemia_sounds_more_music.js'));
  const { rows } = hisRows();
  const done = [];
  for (const D of DESIGNS) {
    const sf = path.join(SONGS, slug(D.name) + '.json'), mf = path.join(SONGS, slug(D.name), 'measured.json');
    if (!fs.existsSync(mf)) { console.log('  not recorded yet: ' + D.name); continue; }
    const song = JSON.parse(fs.readFileSync(sf, 'utf8')), M = JSON.parse(fs.readFileSync(mf, 'utf8'));
    const pageName = 'BOHEMIA_' + slug(D.name).toUpperCase() + '_10_24_26.html';
    fs.writeFileSync(path.join(ROOT, 'slices', pageName), page(Object.assign({ _rows: rows }, song), M, pageName));
    const card = cardFor(song, pageName);
    if (/—|–/.test(card.why + card.title + card.options.join(''))) throw new Error('a dash on the card: ' + D.name);
    song.card = card;
    fs.writeFileSync(sf, JSON.stringify(song, null, 1) + '\n');
    done.push(pageName);
  }
  console.log('pages ' + done.length + ':\n  ' + done.join('\n  '));
}

module.exports = { pages, page, cardFor };
