# WHY THE DEMO MAKES A PHONE WAIT (PLUMBER 10/9/26, row [first load], round 1; rule 66a, rule 72 line 12)

PAOLO 10/5: "I feel like I gotta wait 40 seconds for this shit to load."
The row: measure first; cut the bytes the demo loads before the title; RUN does the title's order, this
lane does the bytes and the budget; hold it with a gate (title under 2 s, NEW GAME lit under 8 s at 4x).
KEPT CLAIMED (rule 6): measured, gated, and the byte cut proven and handed to RUN; the bytes on the live
demo change when RUN applies it, and the ready time needs the processor work below cut.

## THE ANSWER FIRST

A stranger's first open of the demo: a fresh browser (cold cache, no service worker yet), nobody touching
the glass, a phone-shaped processor (4x throttle), served the way GitHub Pages serves (10-minute cache,
version tags, gzip).

| | today | with the patch below |
|---|---|---|
| title on screen | 3.4 to 3.6 s | 3.4 s |
| NEW GAME ready | 83 to 86 s | 84 s |
| downloaded before NEW GAME is ready | **29.7 MB** | **9.0 MB** |
| the page re-reading itself | 2.4 MB at 15 s, then every 2 minutes (about 72 MB an hour) | a few hundred KB each time |
| a file downloaded twice before ready | the page itself | nothing |

**The wait is the processor, not the download.** The patch removes two thirds of the bytes before NEW
GAME and the ready time does not move. At full speed the boot takes 21 s of processor time; 11.3 s of it
is in the demo page, 6.9 s in the map (profile below). On his phone (faster than a 4x-throttled core,
slower than this box) that is the 40 seconds he feels.

## WHAT I GOT WRONG FIRST, AND FIXED BEFORE REPORTING IT

The first reading said **69 MB, every map tile and the page itself downloaded two or three times.** That
was the test server: the driver's little server sent no caching rules and no compression, so every repeat
request was a full download. GitHub Pages sends a 10-minute cache, version tags and gzip (its documented
behaviour; github.io is refused by this machine's proxy, so it could not be read live). The driver now
serves that way on request (opts.pages), and with it most repeats come from the cache: the map's own tile
loads read 0 KB because the warm-up had already fetched them. The duplicate that survives honest serving
is the page re-reading itself. Two smaller traps, also fixed: the browser reports a page's own download as
0 bytes (the size now comes from the page's own timing records), and "a full copy" is measured against
the file's real compressed size, not against another response.

## THE PATCH, FOR RUN (your file, your cut; measured on a copy served in the page's place)

**1. The warm-up (`__TILE_WARM__`, "WARM THE WORLD WHILE HE READS THE SPLASH").** It was written when the
city loaded only on the first tap, so the splash was dead time. Now the demo builds the city at boot, and
the warm-up pulls every tile file (20 MB compressed) before NEW GAME is ready, beside the boot that needs
the processor. It should not start while the city frame is already in the page:

    var begin=function(){ if(started)return; started=true; step(); };

becomes

    var begin=function(){ if(started)return; started=true; if(document.getElementById('cityFrame'))return; step(); };

(The city still loads every tile itself, when it needs them.)

**2. The build watcher ("BUILD WATCHER (7/20 ...)").** It re-downloads the whole page to read one line,
15 s after load and every 2 minutes, forever: 2.4 MB a check on cell data. The build stamp is 290 KB into
a 6.3 MB page, so read until the stamp and stop:

    function check(){ fetch(location.href,{cache:'no-store'}).then(function(r){return r.text();}).then(function(t){
        var m=t.match(/id="buildstamp"[^>]*>([^<]+)</); if(!m)return;
        if(cur&&m[1]!==cur)show(m[1]); }).catch(function(){}); }

becomes

    function found(t){ var m=t.match(/id="buildstamp"[^>]*>([^<]+)</); if(!m)return; if(cur&&m[1]!==cur)show(m[1]); }
    function check(){ fetch(location.href,{cache:'no-store'}).then(function(r){
        if(!r.body||!r.body.getReader) return r.text().then(found);
        var rd=r.body.getReader(), dec=new TextDecoder(), buf='';
        var pump=function(){ return rd.read().then(function(x){
          if(x.done) return found(buf);
          buf+=dec.decode(x.value,{stream:true});
          if(/id="buildstamp"[^>]*>[^<]+</.test(buf)){ try{rd.cancel();}catch(_e){} return found(buf); }
          if(buf.length>2000000){ try{rd.cancel();}catch(_e){} return; }
          return pump(); }); };
        return pump(); }).catch(function(){}); }

The banner and its words are unchanged. Both changes are in the alpha too (same blocks), so the cut
carries them.

## WHERE THE 21 SECONDS GO (a processor profile of the boot at full speed, sampled every 1 ms)

| | seconds | what calls it |
|---|---|---|
| fitting clothes to bodies (cohereBind) | 3.97 | 2.5 s of it from the city's first message: combatMsgIn > citySendCast > withLook > rebuildFromRig, the page baking the STREET CAST for the city |
| the rest of that cast bake (skin, buildFrame, genTop) | about 1.2 | the same citySendCast chain |
| family and faction outfits (outfitBuild, famBuild, facWornColours) | about 1.4 | the page's start-up tasks |
| drawing a street person (renderHuman, in the map) | 1.32 | a picture finishing loading > render > render > renderHuman |
| building map cells (realizeCell, chunkCanvas, cellAt) | about 2.0 | the map's own boot |
| buildFrame warm-up (warmTick) | 0.26 | the page's frame warmer |

The street cast is baked before NEW GAME is ready, while the demo opens on the map, where those people
are not drawn (rule 38b: the walk is dead; they appear in a fight or a settlement). Baking them when they
are first needed, or behind the title after NEW GAME lights, is about 5 of the 21 seconds. That is RUN's
call with CHARACTER (the rig is theirs); this lane only measured it.

The title at 3.4 s: the title is built when the whole 6 MB page has been read (DOMContentLoaded). Under
two seconds needs the title's markup and style first in the page, ahead of the heavy scripts: RUN's order.

## WHAT WAS BUILT

- **tools/bohemia_first_load.js**: one reading of a stranger's first open, from inside the page (title on
  screen, its buttons, __LOAD_READY) and from the browser's network events (every file, its bytes, when it
  finished, files downloaded twice measured against their real compressed size).
- **The driver** (tools/bohemia_drive_the_demo.js), extended, all opt-in: `net` (a phone's network:
  kbit/s down and up, round trip), `netlog` (every response's bytes, cut-off downloads counted by the
  chunks that arrived), `pages` (serve like GitHub Pages: cache rules, version tags, 304s, gzip),
  `beforeGoto` (a hook on the browser's debugging session before the page is requested, for profiles).
- **gates/first_load_gate.js, in the suite as FIRST LOAD**, about 90 s, red on purpose (4 passed, 3
  failed): S1-S3 on planted pages (a title shown at once, a page ready at 1.5 s, a file fetched twice);
  T1 title within 2 s; T2 NEW GAME within 8 s; D1 nothing downloaded twice before ready (today: the page
  re-reading itself, 8.4 MB for two copies); R1 never worse, 33 MB before ready (today 29.7; lower it to
  about 10 when the patch lands).
- **VOTE**: plumber-first-load-10-9, two sentences, the numbers above.
