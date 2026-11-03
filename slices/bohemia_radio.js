/* BOHEMIA -- THE TOWN YOU DID NOT DEFEND, ON THE PHONE (RADIO, 11/3/26; Paolo 11/3, rule 353, ask line 367: 'what happens
   if you don't support the defense enough... how creepy the audio and transcripts get... this is Bohemian, this is my swag').

   The map's side of the last transmissions. When a raid on a town you hold is settled the world's way and the crew took it
   (raidSettle, slices/BOHEMIA_CITY_WORLD.html: nobody came), your phone picks up that town's channel as it falls: the gate,
   the man on the roof, the clinic, then the open channel and the cut. Every line is a post on the phone's own strip in the
   feed's own format, a handle and the words (rule 371), one at a time and nothing else between them while it plays, each one
   staying long enough to be read whole (rule 350); the radio under it is
   one recording the shell plays (engine/bohemia_radio_heard.js, slices/radio/). No voices of any kind (Paolo 11/3, rule
   353g: 'we're not adding real voices'): the words are the phone's and the sound is the key, the carrier and the squelch.

   RARE AND QUIET (353e): a crew comes for a town you hold once an act at most, and it falls only if you stayed away. Never
   in the first minute (a fall then waits). Never a card: the phone is its mouth. Every word is in
   records/target/bb/radio_lines.json (draft:true, a modder's file).

   BohemiaRadio.fall(town, by)   start a fall (returns false when it cannot: no lines yet, one already playing, heard)
   BohemiaRadio.live()           the posts the phone shows now, oldest first ({who, txt, kind, radio:true})
   BohemiaRadio.state()          for a gate: { playing, town, shown, total, started, heard }                            */
(function (root) {
  'use strict';
  var FILE = '../records/target/bb/radio_lines.json';
  var L = null, S = null, DONE = [], HEARD = {}, WAIT = [];
  var KEY = 'bohemia.radio.heard.v1';
  try { HEARD = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { HEARD = {}; }
  try { fetch(FILE).then(function (r) { return r.ok ? r.json() : null; }).then(function (j) { if (j && j.skeleton) L = j; }).catch(function () {}); } catch (e) {}

  function act() { try { return (typeof hbRec === 'function' && hbRec().act) || 1; } catch (e) { return 1; } }
  function clockNow() {
    try { if (typeof DAY !== 'undefined' && typeof DAY.min === 'number') return (DAY.min | 0) * 60; } catch (e) {}
    return 4 * 3600 + 51 * 60;
  }
  function hms(s) { s = ((s | 0) % 86400 + 86400) % 86400; var p = function (n) { return (n < 10 ? '0' : '') + n; };
    return p((s / 3600) | 0) + ':' + p(((s / 60) | 0) % 60) + ':' + p(s % 60); }
  function voiceOf(town) { return (L.towns[town] && L.towns[town].lines && L.towns[town].lines.length === L.skeleton.length) ? L.towns[town] : L.towns._plain; }
  /* THE FEED'S OWN FORMAT (rule 371(a), Paolo 11/3: 'this is what the tweets are for... we're not running a new system'): a
     handle and the words, nothing else; no time stamp, no channel label in front. The people on the town's channel post as
     themselves (@church_gate, @church_tower); the brackets and the end come from the channel's own relay (@ch4_church).
     While the fall plays every line is PRIORITY: the phone's strip shows nothing else until it ends (371(b)). */
  function slug(s, n) { return String(s || '').toLowerCase().replace(/^the\s+/, '').split(',')[0].replace(/[^a-z0-9]+/g, '').slice(0, n); }
  function handleOf(src, lab) {
    var t = slug(S.town, 7) || 'town', H = L.handles || {};
    if (src === 'PHONE' || src === 'OPEN') return ('@' + String(L.channel || 'CH 4').toLowerCase().replace(/[^a-z0-9]+/g, '') + '_' + t).slice(0, L.handle_max || 16);
    return ('@' + t + '_' + (H[lab] || H[src] || slug(lab, 7))).slice(0, L.handle_max || 16);
  }
  function post(i) {
    var sk = L.skeleton[i], T = S.voice, lab = (T.labels || {})[sk.src] || sk.src;
    var say = String(T.lines[i].say).replace(/\{town\}/g, S.town);
    return { who: handleOf(sk.src, lab), txt: say, kind: 'world', radio: true, priority: true, n: sk.n, draft: true };
  }
  /* the phone reads the map's posts through BohemiaPhone.P.posts; the radio's lines ride on its end while the fall plays
     (so the strip shows them, newest last) and sit at its start after (so the FEED app keeps the transcript, oldest) */
  function wrapPhone() {
    var P = root.BohemiaPhone && root.BohemiaPhone.P; if (!P || P.__radio) return !!P;
    var orig = P.posts;
    P.posts = function () { var a = []; try { a = orig.apply(P, arguments) || []; } catch (e) { a = []; } return DONE.concat(a).concat(live()); };
    P.__radio = true;
    return true;
  }
  function live() { return S ? S.shown.slice() : []; }
  function tell(msg) { try { var t = root.parent && root.parent !== root ? root.parent : root; t.postMessage(msg, '*'); } catch (e) {} }
  function run(offsetMs) {
    var t0 = Date.now() + (offsetMs || 0);
    S.started = t0;
    L.skeleton.forEach(function (sk, i) {
      S.timers.push(setTimeout(function () { if (!S) return; S.shown.push(post(i)); }, Math.max(0, t0 - Date.now() + sk.at * 1000)));
    });
    /* the last line stays its read time, then the transcript moves to the FEED app's back pages and the strip is the feed's again */
    var end = L.skeleton[L.skeleton.length - 1];
    S.timers.push(setTimeout(finish, Math.max(0, t0 - Date.now() + (L.length_s || (end.at + 6)) * 1000)));
  }
  function finish() {
    if (!S) return;
    DONE = DONE.concat(S.shown.map(function (p) { var q = {}; for (var k in p) q[k] = p[k]; q.priority = false; return q; })).slice(-48);   /* after: the feed's back pages, no hold */
    root.__RADIO_FALLS = (root.__RADIO_FALLS | 0) + 1;
    S = null;
    if (WAIT.length) { var w = WAIT.shift(); setTimeout(function () { fall(w[0], w[1]); }, 4000); }
  }
  function fall(town, by) {
    town = String(town || ''); if (!town) return false;
    if (!L) { WAIT.push([town, by]); return false; }
    var hk = town + ':' + act();
    if (HEARD[hk]) return false;
    if (S) { if (S.town !== town && !WAIT.some(function (w) { return w[0] === town; })) WAIT.push([town, by]); return false; }
    /* never in the first minute (9/23): a fall then waits for it */
    var up = (root.performance && performance.now()) || 0;
    if (up < (L.when.never_before_s || 60) * 1000) { WAIT.push([town, by]); setTimeout(function () { var w = WAIT.shift(); if (w) fall(w[0], w[1]); }, (L.when.never_before_s || 60) * 1000 - up + 500); return false; }
    wrapPhone();
    HEARD[hk] = Date.now(); try { localStorage.setItem(KEY, JSON.stringify(HEARD)); } catch (e) {}
    var id = 'fall:' + hk + ':' + Date.now();
    S = { id: id, town: town, by: by || null, voice: voiceOf(town), clock: clockNow() + ((town.length * 37) % 60),
          who: (L.channel + ' ' + town.toUpperCase()).slice(0, L.handle_max || 16), shown: [], timers: [], started: null };
    /* the shell plays the recording and answers when it will start (on its next beat); without an answer in 3 s (no sound,
       or the map alone) the words run by themselves */
    var answered = false;
    function onAns(ev) {
      var d = ev && ev.data; if (!d || d.type !== 'BOHEMIA_RADIO_STARTED' || d.id !== id) return;
      answered = true; root.removeEventListener('message', onAns); if (S && S.id === id && !S.started) run(Math.max(0, +d.in_ms || 0));
    }
    root.addEventListener('message', onAns);
    tell({ type: 'BOHEMIA_RADIO', ev: 'fall', id: id, town: town, by: by || null });
    setTimeout(function () { if (!answered) { root.removeEventListener('message', onAns); if (S && S.id === id && !S.started) run(0); } }, 3000);
    return true;
  }
  /* THE RADIO UNDER THE FEED (rule 371(c), Paolo 11/3: 'I did hear all the newest sound effects... definitely need to hear more of
     that implemented'): the fall's own recording, a slice of it, under the feed's important posts (L.under_posts: a man dead,
     a wipe, a town falling, a raid, a war, a road closed; L.segments: the static, the squelch, the open mic, the carrier lost).
     Never in the first minute, never while a fall plays, never two inside L.under_gap_s; the shell plays it on its next beat. */
  var UNDER = { last: -1e9, n: 0, log: [] };
  function under(p) {
    if (!L || !L.under_posts || !L.segments || S || !p) return false;
    var what = L.under_posts[p.type]; var seg = what && L.segments[what]; if (!seg) return false;
    var up = (root.performance && performance.now()) || 0, now = Date.now();
    if (up < (L.when.never_before_s || 60) * 1000 || now - UNDER.last < (L.under_gap_s || 20) * 1000) return false;
    UNDER.last = now; UNDER.n++; UNDER.log.push({ type: p.type, what: what, t: now }); if (UNDER.log.length > 20) UNDER.log.shift();
    tell({ type: 'BOHEMIA_RADIO', ev: 'under', id: 'under:' + UNDER.n + ':' + now, what: what, from: +seg.from, dur: +seg.dur, db: seg.db == null ? null : +seg.db });
    return true;
  }
  (function listen(tries) {
    try { if (root.BohemiaFeed && typeof root.BohemiaFeed.on === 'function') { root.BohemiaFeed.on(under); return; } } catch (e) {}
    if (tries < 120) setTimeout(function () { listen(tries + 1); }, 1000);
  })(0);
  root.BohemiaRadio = {
    fall: fall, live: live,
    lines: function () { return L; },
    state: function () { return { playing: !!S, town: S ? S.town : null, shown: S ? S.shown.length : 0, total: L ? L.skeleton.length : 0,
                                  started: S ? S.started : null, heard: Object.keys(HEARD).length, done: DONE.length, waiting: WAIT.length,
                                  under: UNDER.n, underLog: UNDER.log.slice() }; },
    under: under
  };
})(typeof window !== 'undefined' ? window : globalThis);
