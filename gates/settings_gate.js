/* ============================================================================
   SETTINGS AND PAUSE (9/5/26, UI lane) -- board row [settings pause].
   "volume, mute, quit, save; nothing exists"

   MEASURED BEFORE BUILDING, and the row was right: ZERO settings surfaces in the
   walked city, no volume control anywhere in the shell or the city, no mute. The SAVE
   does exist (the city's own #savepanel behind its floppy chip), so the screen REACHES
   it rather than building a second one -- two save doors is two save bugs.

   IT LIVES IN THE SHELL, NOT THE CITY, for two measured reasons: the shell owns the
   one AudioContext (the city's own comment says "ONE AUDIOCONTEXT, THE PARENT'S"), and
   quitting means leaving the game, which only the shell can do. Being in the shell also
   means it reaches the walked surface AND the demo from one place, which rule 7 asks for.

   THERE IS NO PAUSE BUTTON AND THAT IS THE GAME'S OWN RULE. This valley runs on
   I-MOVE-YOU-MOVE -- "time moves when you move" -- so there is no clock to stop.
   Opening this screen already is the pause. A PAUSE button next to it would be a
   control that does nothing, which is worse than no control, so this gate does not
   look for one and would be wrong to.

   VOLUME AND MUTE RIDE MUS.OUT, WHICH IS ALREADY THE ONE PLACE EVERYTHING MEETS: every
   path to the speakers in the shell ends `sfxBus() || MUS.OUT || MUS.MAST ||
   AC.destination`, and MUS.OUT is the output bus the 8/2 note created exactly so the
   SFX bus would stop plugging into the music master. So the gate asserts the bus moves,
   not that some sound got quieter -- the bus is the claim.
   MUS.MAST is the MUSIC master and is deliberately untouched: a volume control that
   only moved the music would be a lie on its own label.
   ============================================================================ */
'use strict';
const path = require('path'), http = require('http'), fs = require('fs');
const ROOT = path.dirname(__dirname), SLICES = path.join(ROOT, 'slices'), PORT = 8799;
let pass = 0, fail = 0;
const ok = (m, g) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m); };
const done = () => { console.log('\nSETTINGS AND PAUSE: ' + pass + ' ok, ' + fail + ' failed');
                     process.exit(fail ? 1 : 0); };
const TYPE = { '.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png',
               '.woff2':'font/woff2','.webmanifest':'application/manifest+json' };
function serve(){ return new Promise(r=>{ const s=http.createServer((rq,rs)=>{
  const rel=decodeURIComponent(rq.url.split('?')[0]).replace(/^\/+/,''); const f=path.join(SLICES,rel);
  if(!f.startsWith(SLICES)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){rs.statusCode=404;return rs.end('no');}
  rs.setHeader('content-type',TYPE[path.extname(f)]||'application/octet-stream');
  fs.createReadStream(f).pipe(rs); }); s.listen(PORT,'127.0.0.1',()=>r(s)); }); }
const MIN = 44;

(async () => {
  let chromium;
  try { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }
  catch (e) { try { chromium = require('playwright').chromium; } catch (e2) { ok('playwright available', false); done(); } }
  const srv = await serve();
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport:{width:390,height:844}, deviceScaleFactor:2, isMobile:true, hasTouch:true });
  const p = await ctx.newPage();
  const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0,130)));
  await p.goto('http://127.0.0.1:'+PORT+'/BOHEMIA_DEMO.html',{waitUntil:'load',timeout:120000});
  await p.waitForTimeout(1300);

  /* THE SPLASH HAS EXACTLY ONE THING TO DO. A second button on the one screen that has
     to be simple is a fork in the worst possible place. */
  const onSplash = await p.evaluate(() => { const g=document.getElementById('gearbtn');
    return g ? getComputedStyle(g).display !== 'none' : null; });
  ok('the settings gear is NOT on the front splash -- that screen has one job', onSplash === false);

  await p.mouse.click(195, 509);
  await p.waitForTimeout(6000);
  try { await p.evaluate(() => { const n=document.getElementById('openNot'); if(n) n.click(); }); } catch(e) {}
  await p.waitForTimeout(1200);

  const gear = await p.evaluate(() => { const g=document.getElementById('gearbtn');
    if(!g) return null; const r=g.getBoundingClientRect();
    return { shown: getComputedStyle(g).display !== 'none',
             w: Math.round(r.width), h: Math.round(r.height),
             l: Math.round(r.left), t: Math.round(r.top),
             r: Math.round(r.right), b: Math.round(r.bottom) }; });
  ok('and it IS there once the game is up', !!gear && gear.shown);
  ok('and it clears the thumb at ' + (gear ? gear.w+'x'+gear.h : '?'),
     !!gear && gear.w >= MIN && gear.h >= MIN);

  const city = p.frames().find(f => /CITY_WORLD/.test(f.url()));
  ok('the walked city is up to check the gear against', !!city);

  /* IT MUST COVER NOTHING, IN BOTH MODES. The first cut sat top-right at 8px and cut
     "SUBURB . ON FOOT" off the city's own status strip. */
  const clashIn = async () => city.evaluate((gg) => {
    const out = [];
    for (const id of ['hud','topbar','blstack','nav','cityfeed','mode','pad']) {
      const n = document.getElementById(id); if (!n) continue;
      const s = getComputedStyle(n); if (s.display==='none'||s.visibility==='hidden') continue;
      const r = n.getBoundingClientRect();
      const ox = Math.min(gg.r, r.right) - Math.max(gg.l, r.left);
      const oy = Math.min(gg.b, r.bottom) - Math.max(gg.t, r.top);
      if (ox > 1 && oy > 1) out.push(id + ' ' + Math.round(ox) + 'x' + Math.round(oy));
    }
    return out;
  }, gear);
  const humanClash = await clashIn();
  ok('and it covers nothing on the walked street'
     + (humanClash.length ? ' -- it sits on ' + humanClash.join(', ') : ''), humanClash.length === 0);
  await city.evaluate(() => { if (typeof swapMode === 'function') swapMode(); });
  await p.waitForTimeout(2500);
  const cityClash = await clashIn();
  ok('and covers nothing in the city view either, where the feed is on screen'
     + (cityClash.length ? ' -- it sits on ' + cityClash.join(', ') : ''), cityClash.length === 0);
  await city.evaluate(() => { if (typeof swapMode === 'function') swapMode(); });
  await p.waitForTimeout(2000);

  await p.evaluate(() => document.getElementById('gearbtn').click());
  await p.waitForTimeout(450);
  const panel = await p.evaluate(() => {
    const w = document.getElementById('setwrap');
    const ctrls = [...document.querySelectorAll('#setcard [role=button],#setcard .vb,#setcard .setbtn')]
      .map(n => { const r = n.getBoundingClientRect();
        return { id: n.id || String(n.className), w: Math.round(r.width), h: Math.round(r.height) }; });
    return { shown: getComputedStyle(w).display !== 'none', ctrls,
             small: ctrls.filter(c => c.w < 44 || c.h < 44),
             text: (document.getElementById('setcard').innerText || '').replace(/\s+/g,' ').trim() };
  });
  ok('the screen opens', panel.shown);
  ok('and every control on it clears the thumb (' + panel.ctrls.length + ' controls)'
     + (panel.small.length ? ' -- ' + panel.small.map(c=>c.id+' '+c.w+'x'+c.h).join(', ') : ''),
     panel.ctrls.length >= 8 && panel.small.length === 0);
  const words = panel.text.toUpperCase();
  ok('and the row\'s four things are all on it: volume, mute, save, quit',
     /SOUND/.test(words) && /MUTE/.test(words) && /SAVE/.test(words) && /QUIT/.test(words));

  /* THE BUS IS THE CLAIM. */
  const audio = await p.evaluate(() => {
    const S = window.BOHEMIA_SETTINGS; if (!S) return null;
    const out = {};
    S.set(1, false); out.low  = S.busGain();
    S.set(5, false); out.high = S.busGain();
    S.set(5, true);  out.mute = S.busGain();
    S.set(5, false); out.back = S.busGain();
    S.set(3, false); out.mid  = S.busGain();
    return out;
  });
  ok('SOUND moves the one bus every sound in the game meets (level 1 -> '
     + (audio && audio.low) + ', level 5 -> ' + (audio && audio.high) + ')',
     !!audio && audio.low !== null && audio.high !== null && audio.low < audio.high);
  ok('MUTE takes it to silence and unmuting puts the level back rather than a default '
     + '(muted -> ' + (audio && audio.mute) + ', back -> ' + (audio && audio.back) + ')',
     !!audio && audio.mute === 0 && audio.back === audio.high);

  /* SAVE REACHES THE SAVE THAT ALREADY EXISTS. */
  await p.evaluate(() => { const w=document.getElementById('setwrap');
    if (getComputedStyle(w).display === 'none') document.getElementById('gearbtn').click(); });
  await p.waitForTimeout(350);
  await p.evaluate(() => document.getElementById('setsave').click());
  await p.waitForTimeout(900);
  const saved = await city.evaluate(() => { const n = document.getElementById('savepanel');
    return n ? { shown: getComputedStyle(n).display !== 'none',
                 txt: (n.innerText||'').replace(/\s+/g,' ').slice(0,60) } : null; });
  ok('SAVE opens the save the game already has, rather than a second one'
     + (saved && saved.shown ? ' ("' + saved.txt + '")' : ''), !!saved && saved.shown);

  /* QUIT GOES BACK TO THE FRONT DOOR, and the door still opens. */
  await city.evaluate(() => { const n=document.getElementById('savepanel'); if(n) n.style.display='none'; });
  await p.evaluate(() => document.getElementById('gearbtn').click());
  await p.waitForTimeout(350);
  await p.evaluate(() => document.getElementById('setquit').click());
  await p.waitForTimeout(900);
  const quit = await p.evaluate(() => {
    const f = document.getElementById('front'), g = document.getElementById('gearbtn');
    return { front: f ? getComputedStyle(f).display !== 'none' : null,
             gear: g ? getComputedStyle(g).display === 'none' : null,
             closed: getComputedStyle(document.getElementById('setwrap')).display === 'none' }; });
  ok('QUIT puts you back at the front door with the screen closed and the gear gone',
     quit.front === true && quit.gear === true && quit.closed === true);
  await p.mouse.click(195, 509);
  await p.waitForTimeout(3000);
  const backIn = await p.evaluate(() => { const f=document.getElementById('front');
    return f ? getComputedStyle(f).display === 'none' : null; });
  ok('and the door still opens afterwards -- QUIT is not a dead end', backIn === true);

  /* IT REMEMBERS. A phone that forgets you muted it is a phone you mute twice. */
  await p.evaluate(() => window.BOHEMIA_SETTINGS.set(2, true));
  await p.waitForTimeout(300);
  await p.reload({ waitUntil: 'load' });
  await p.waitForTimeout(1600);
  const remembered = await p.evaluate(() => window.BOHEMIA_SETTINGS
    ? window.BOHEMIA_SETTINGS.get() : null);
  ok('and it remembers across a reload (' + JSON.stringify(remembered) + ')',
     !!remembered && remembered.vol === 2 && remembered.muted === true);

  /* IT MUST NOT TOUCH SOMEBODY ELSE'S OFFLINE RENDER. Measured, not assumed: the
     menu-music checker renders a bar by parking an OfflineAudioContext node in
     MUS.OUT, rendering, and putting the real one back. This screen polls MUS.OUT,
     so it lands inside that window, and the first cut set a gain ramp on it --
     which changed the loudness of the rendered bar and failed three menu songs on
     a rule they obey. So: swap in an offline node the way that checker does, and
     the settings screen must see NO bus at all and leave the node's gain exactly
     where the render left it. */
  /* the reload above left us on the splash with no audio graph yet, and this leg
     is about the LIVE bus, so open the door and let the sound come up first --
     otherwise the swap restores an MUS.OUT that was never there. */
  await p.mouse.click(195, 509);
  await p.waitForTimeout(4000);
  const offline = await p.evaluate(async () => {
    if (typeof MUS === 'undefined' || !MUS) return { skip: 'no MUS' };
    if (!MUS.OUT) return { skip: 'no live bus to protect' };
    const OAC = new OfflineAudioContext(2, 4410, 44100);
    const fake = OAC.createGain(); fake.gain.value = 0.5; fake.connect(OAC.destination);
    const save = { AC: MUS.AC, MAST: MUS.MAST, OUT: MUS.OUT };
    MUS.AC = OAC; MUS.MAST = fake; MUS.OUT = fake;
    const sawBus = window.BOHEMIA_SETTINGS.busGain();
    window.BOHEMIA_SETTINGS.set(1, false);          /* a real change, mid-render */
    await new Promise(r => setTimeout(r, 1200));    /* longer than the 500ms poll */
    const gain = fake.gain.value;
    MUS.AC = save.AC; MUS.MAST = save.MAST; MUS.OUT = save.OUT;
    return { sawBus, gain };
  });
  ok('it does not reach into an offline render: no bus found there, and the render'
     + ' keeps its own gain (saw ' + JSON.stringify(offline.sawBus) + ', gain '
     + offline.gain + ')',
     !offline.skip && offline.sawBus === null && Math.abs(offline.gain - 0.5) < 1e-6);

  /* AND THE REAL BUS STILL MOVES AFTERWARDS -- the guard must not have turned the
     screen off, which is the cheap way to pass the leg above. */
  await p.evaluate(() => window.BOHEMIA_SETTINGS.set(5, false));
  await p.waitForTimeout(300);
  const afterGuard = await p.evaluate(() => window.BOHEMIA_SETTINGS.busGain());
  ok('and the real bus still moves once the render is over (' + afterGuard + ')',
     typeof afterGuard === 'number' && Math.abs(afterGuard - 1) < 0.02);

  ok('no page error while doing any of it' + (errs.length ? ' -- ' + errs[0] : ''), errs.length === 0);
  await b.close(); srv.close(); done();
})();
