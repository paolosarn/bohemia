#!/usr/bin/env node
/* ============================================================================
   BOHEMIA — HERO BEAT GATE (7/23/26, character/sound session)
   Machine-locks Paolo's ask ("lets pick the hero part of the beat"): for
   each song, which of the bar's 4 quarter-note beats is the catchy,
   easiest-to-anticipate one -- combat's dial snaps its kill-moment onto
   THAT beat instead of always assuming beat 1. Quarter-note resolution is
   the locked ceiling (the dial has no code path finer than a whole 120-grid
   beat, so 8th/16th precision would just get rounded away).
   Picked live in the MUSIC tab while the real song plays -- no separate
   audition tool, the real audio IS the audition.
   Three layers, all locked:
     1. DATA: MUS.hero persists (save/load), the MUSIC tab UI exists (4
        tap buttons + a live per-beat indicator) per song slot.
     2. THE BUS: musicPushToCombat forwards hero for factions, pools, and
        song2 alike.
     3. COMBAT: the message handler stores it, applySlot resolves f.hero
        per active slot (song1/song2/pool), heroOffset() computes it, and
        every G.beatClock assignment applies the offset.
   ============================================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const alpha = fs.readFileSync(path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html'), 'utf8');

let pass = 0, fail = 0;
function ok(name, cond, extra) {
  if (cond) { pass++; console.log('  PASS ' + name); }
  else { fail++; console.log('  FAIL ' + name + (extra ? ' -- ' + extra : '')); }
}

/* ---- 1. data model + MUSIC tab UI ---- */
ok('MUS carries a hero map', /const MUS=\{AC:null,MAST:null,playing:false,cur:0,curSlot:1,step:0,uiStep:0,nextT:0,timer:null,layers:0,V:\{\},hero:\{\}/.test(alpha));
ok('save() persists hero', /localStorage\.setItem\('bohemia_music',JSON\.stringify\(\{[^}]*hero:this\.hero\|\|\{\}/.test(alpha));
ok('load() restores hero (both branches: fresh + saved)', /this\.hero=\{\};this\.bakeCats\(\);return;/.test(alpha) &&
  /this\.hero=\(d&&d\.hero\)\|\|\{\};/.test(alpha));
ok('heroRow() exists: 4 tap buttons + a live per-beat indicator', /heroRow\(key\)\{/.test(alpha) &&
  /hero-btn/.test(alpha) && /hero-live/.test(alpha));
ok('heroRow is wired into every song slot row', /const hero=MUS\.heroRow\(key\);/.test(alpha) &&
  /r\.append\(play,nbadge,up,dn,canon,gy,cb,tags,body,hero\);/.test(alpha));
ok('beat 1 reads as the ruling for every song by default (Paolo 7/24, LOCKED: '+
  '"beat1/4 is the hero beat man, for all of them, i didnt need to do all of them" -- '+
  'a prior pass misread this ruling as a UI bug and stripped the default highlight; '+
  'reverted, the ||1 fallback in the highlight is intentional, not a leftover)',
  /\(MUS\.hero\[key\]\|\|1\)===n\?';border-color:#e8b04a;color:#e8b04a':''/.test(alpha));
ok('picking a beat saves instantly and pushes live to combat', /MUS\.hero\[key\]=n; MUS\.save\(\);/.test(alpha) &&
  /x\.style\.color='#e8b04a';\} \}\); musicPushToCombat\(\); \}\);/.test(alpha));
ok('the live indicator reads MUS.uiStep (quarter-beat = Math.floor(uiStep/4)), not finer', /Math\.floor\(\(MUS\.uiStep\|\|0\)\/4\)/.test(alpha));
ok('export (to Claude) surfaces picked hero beats as plain text, unlisted = beat 1', /HERO BEATS \(which quarter-beat/.test(alpha) &&
  /this\.hero\[k\]&&this\.hero\[k\]!==1/.test(alpha));

/* ---- 2. the bus: musicPushToCombat forwards hero for factions, pools, song2 ---- */
ok('factions: hero rides the per-faction push', /out\.factions\[f\.n\]=\{root:f\.root,wave:f\.wave,kick:f\.kick,bass:f\.bass,hat:f\.hat,scale:f\.scale,hero:MUS\.hero\[f\.n\+'#1'\]\};/.test(alpha));
ok('song2: hero rides its own pick (independent of song 1\'s)', /out\.song2\[nm\]=Object\.assign\(\{\},MUS\.song2\[nm\],\{hero:MUS\.hero\[nm\+'#2'\]\}\);/.test(alpha));
ok('pools: every category-tagged vibe carries its own hero pick onto the bus', /c\.hero=MUS\.hero\[m\.n\+'#1'\];/.test(alpha));

/* ---- 3. combat: receive, resolve per-slot, compute the offset, apply it ---- */
const bm = alpha.match(/const COMBAT_B64='([^']+)'/);
ok('alpha carries COMBAT_B64', !!bm);
const demo = Buffer.from(bm[1], 'base64').toString('utf8');
ok('message handler stores song 1\'s pick on the faction object (f._hero1)', /f\._hero1=e2\.hero;/.test(demo));
ok('hero is deliberately OUTSIDE POOL_FIELDS (no canon baseline to restore -- resolved fresh every applySlot call)',
  !/POOL_FIELDS=\[[^\]]*'hero'/.test(demo));
{
  const asIdx = demo.indexOf('function applySlot');
  const asEnd = demo.indexOf('function pickSongForEncounter');
  const as = demo.slice(asIdx, asEnd);
  ok('applySlot resolves song2\'s hero pick (independent of song 1\'s)', /f\.hero=\(ov&&ov\.hero!=null\)\?ov\.hero:undefined;/.test(as));
  ok('applySlot resolves a pool song\'s own hero pick', /f\.hero=slot\.hero;/.test(as));
  ok('applySlot falls back to song 1\'s own pick when no slot override applies', /f\.hero=f\._hero1;/.test(as));
}
ok('heroOffset() computes (hero-1), default hero=1 -> offset 0 (today\'s behavior, unchanged)',
  /function heroOffset\(\)\{ const f=FAC\(\); const h=\(f&&f\.hero\)\|\|1; return h-1; \}/.test(demo));
ok('every G.beatClock assignment applies the hero offset (all 3 call sites, none left on the raw clock)',
  (demo.match(/G\.beatClock=beatNow\(\)-heroOffset\(\)/g) || []).length === 3 &&
  !/G\.beatClock=beatNow\(\);/.test(demo));

/* ---- live-verified this pass (not just these static checks): headless Playwright
   against the real alpha -- clicked a hero-btn, confirmed MUS.hero saved; opened the
   live combat iframe (its own real boot, no shortcuts), confirmed the pushed pick
   actually lands on FACTIONS[i]._hero1, applySlot resolves it into f.hero, and
   heroOffset()/G.beatClock math shifts by exactly the picked amount. Zero console
   or window.onerror across either document. ---- */

console.log('\n=== HERO BEAT GATE: ' + pass + ' passed, ' + fail + ' FAILED ===');
process.exit(fail ? 1 : 0);
