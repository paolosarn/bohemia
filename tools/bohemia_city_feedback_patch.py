#!/usr/bin/env python3
"""BOHEMIA THE FEEDBACK CARD (8/27/26, PEOPLE lane) -- backlog row 0f, the last
unowned row on the demo path. BUILD -> DOOR -> ENDING -> INSTRUMENT -> INVITE,
and this is INSTRUMENT.

MEASURED FIRST, on the real demo build, before any of this was designed. Drove
the shell, tapped the real splash, played a few beats and read every byte the
page kept:

    boh.city.minds        118 bytes
    boh.city.deedweight     2 bytes
    bohemia:look        1,517 bytes
    bohemia_sfxvol          1 byte
    ------------------------------------------------------------
    about how the session went for the person playing:   0 bytes
    and the city did not know which build it was running.

So today a tester who stops at minute four leaves nothing behind at all, and a
tester who finishes leaves nothing either.

*** AND THE ROW AND THE PROTOCOL CONTRADICT EACH OTHER. *** The row asks for an
END-OF-DAY card. The protocol's standing rule says "a tester who stops playing
is a FINDING, never a failure -- where and why is the whole point of the
instrument." A card at the end is filled in only by people who reached the end.
The population the protocol calls the whole point is the one population that
never sees it. So the paste is WRITTEN WHILE THEY PLAY and the card only adds
the words, and the card has a door that is not the ending.

WHAT THIS PUTS IN THE CITY:

1. WHICH BUILD AM I. The city has never known. The ending's handshake already
   exists and is already proved on the real surface (the city asks, the shell
   answers), so the answer simply carries the stamp now. One handshake, not two.

2. THE RECORDER, WHICH SAMPLES AND DOES NOT HOOK. ctSave's own comment is the
   argument: "ONE SEAM, NOT TWENTY: the writers are record/adjust/setState and
   two ledgers, and hooking each is five chances to miss one." A ticker reads
   the state the game already keeps and stamps a beat the first time it is
   true. No call site is touched.

3. THE CARD. Three taps and a box, in the game's own card, so it inherits the
   scrim, the real X, Escape and the tap-outside for free.

4. TWO DOORS. A quiet one that arrives under the ending five seconds after it
   lands, and a permanent one in the save drawer, which is already the place a
   tester goes to get a block of text out of this game.

WHY THE ENDING KEEPS ITS SILENCE. ending_gate proves there is nothing to press
on the last card, because peak-end says the last moment is half of what anybody
keeps and a survey is a bad last moment. The door is not a way to keep playing
and it does not arrive until the message has been allowed to land.

  python3 tools/bohemia_city_feedback_patch.py

Gate: gates/feedback_gate.js
"""
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
CITY = 'slices/BOHEMIA_CITY_WORLD.html'
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = '__CITY_FEEDBACK__'

# The module goes in with the announced banner tools/bohemia_city_module_resync.py
# looks for, and CARRIES ITS OWN CLOSING BANNER -- the 8/27 lesson that cost the
# conversation module 103 lines: a boundary scan finds a module's end at the next
# '/* ==== engine/' banner, so a module that does not close itself is the one that
# gets swallowed when a tool cuts the module below it.
MOD_ANCHOR = '/* ==== engine/bohemia_demoquests.js ==== */'
MOD_SRC = 'engine/bohemia_blackbox.js'
MOD_BANNER = '/* ==== engine/bohemia_blackbox.js ==== */'

# ---- 1. WHICH BUILD AM I -----------------------------------------------------
# The city has never known, and "it froze when I went in the door" is
# unanswerable without it (row 0f, amended 8/25). The handshake exists already.
BUILD_ANCHOR = """window.addEventListener('message', function(ev){
  try { if (ev && ev.data && typeof ev.data.bohemiaIsDemo === 'boolean')
          CT_IS_DEMO = ev.data.bohemiaIsDemo; } catch(_e){}
});"""
BUILD_NEW = """window.addEventListener('message', function(ev){
  try { if (ev && ev.data && typeof ev.data.bohemiaIsDemo === 'boolean')
          CT_IS_DEMO = ev.data.bohemiaIsDemo; } catch(_e){}
  /* __CITY_FEEDBACK__ -- AND WHICH BUILD, WHICH THE CITY HAS NEVER KNOWN.
     A tester's paste that does not say which build they were on is an anecdote
     (row 0f, amended 8/25). The stamp is on the shell's splash and the shell is
     already answering this exact question, so it carries the answer rather than
     opening a second channel that can rot on its own. */
  try { if (ev && ev.data && typeof ev.data.bohemiaBuild === 'string')
          CT_BUILD = ev.data.bohemiaBuild; } catch(_e){}
});"""

ALPHA_ANCHOR = """    if(ev.source&&ev.source.postMessage)
      ev.source.postMessage({bohemiaIsDemo:!!window.__BOHEMIA_DEMO_BUILD},'*');"""
ALPHA_NEW = """    /* __CITY_FEEDBACK__ -- and the stamp rides along, because the city cannot
       read its own splash and a feedback paste without a build id cannot be
       answered. Read off the element rather than retyped: a retyped constant is
       how this repo's dial said 19 when the truth was 1.1. */
    var __bs=document.getElementById('buildstamp');
    if(ev.source&&ev.source.postMessage)
      ev.source.postMessage({bohemiaIsDemo:!!window.__BOHEMIA_DEMO_BUILD,
        bohemiaBuild:__bs?String(__bs.textContent||'').trim():null},'*');"""

# ---- 2. THE EXPORT, EXACTLY LIKE THE SAVE BLOB -------------------------------
EXP_ANCHOR = """  if(d.bohemiaCitySaveImport!==undefined){"""
EXP_NEW = """  /* __CITY_FEEDBACK__ -- row 0f: "exported exactly like the save blob so a
     tester can paste it into a chat". This IS that path, the same modal with
     the same iOS-safe share/copy/download and the same .txt rule, because a
     second export mechanism is a second thing that can be broken on a phone
     nobody in this project owns. */
  if(d.bohemiaFeedbackExport!==undefined){
    const txt=(d.bohemiaFeedbackExport&&d.bohemiaFeedbackExport.text)||'';
    G._expName='bohemia_what_it_was_like.txt';
    document.getElementById('expText').value=txt;
    document.getElementById('expStat').textContent='paste this whole thing into the chat';
    document.getElementById('exportModal').style.display='block';
    return true;
  }
  if(d.bohemiaCitySaveImport!==undefined){"""

# ---- 3. THE RECORDER AND THE CARD --------------------------------------------
BODY_ANCHOR = """function ctDemoOver(day){ return CT_IS_DEMO && (day|0) >= CT_DEMO_DAYS; }"""
BODY_NEW = r"""function ctDemoOver(day){ return CT_IS_DEMO && (day|0) >= CT_DEMO_DAYS; }

/* ==== __CITY_FEEDBACK__ : THE BLACK BOX AND THE CARD (row 0f) ================
   MEASURED BEFORE THIS WAS WRITTEN, on the real demo build: a session that
   stops leaves four localStorage keys and 1,638 bytes behind, and not one byte
   of it says how it went or where they stopped.
   THE RECORDER SAMPLES, IT DOES NOT HOOK, for the reason ctSave writes down in
   its own comment: hooking every writer is five chances to miss one. Nothing
   below reaches into a single call site, so no lane can break this by moving a
   function, and there is no writer to miss. Every read is guarded on its own,
   because the recorder going quiet must never be able to take the game with it.
   ============================================================================ */
var CT_BUILD = null;
var FB_KEY  = 'boh.demo.card';
var FB      = null;      /* the record */
var FB_T0   = 0;         /* wall clock this sitting started */
var FB_MS0  = 0;         /* milliseconds carried in from earlier sittings */
var FB_HOME = null;      /* the block he woke up on */
var FB_MIN0 = null;      /* the game minute he woke up at */
var FB_SAWCARD = false;  /* the wake card was up at least once */
var FB_ANS  = {};
var FB_WORDS = '';
var FB_OPEN = false;

function fbBB(){ return (typeof BohemiaBlackBox !== 'undefined') ? BohemiaBlackBox : null; }

/* AN OLDER RECORD IS NEVER THROWN AWAY. On iOS the reload is a WHEN and not an
   if (row 0h), so a second sitting is normal rather than a second tester, and
   the beats keep their first times. An unreadable blob is discarded whole
   rather than half applied, which is the rule the belonging save already sets:
   a partly restored record is worse than a fresh one because you cannot see
   that it is wrong. */
function fbBoot(){
  var B = fbBB(); if (!B) return;
  var fresh = B.blank(), old = null;
  try { old = JSON.parse(localStorage.getItem(FB_KEY) || 'null'); } catch(_e){ old = null; }
  if (old && old.v === B.REC_V) { FB = B.merge(old, fresh); FB_MS0 = old.ms | 0; }
  else { FB = fresh; FB_MS0 = 0; }
  FB_ANS = (FB.answers && typeof FB.answers === 'object') ? FB.answers : {};
  FB_WORDS = FB.words || '';
  FB_T0 = Date.now();
  try { FB.seed = (seed >>> 0); FB.seedText = BOH_SEED_TEXT; } catch(_e){}
  /* THE DEVICE MATRIX THE SOFT OPENING DOUBLES AS (row 0h). The raw string,
     because a label I derive is a guess about a phone nobody here owns. */
  try {
    FB.device = navigator.userAgent + '  ' + (screen.width|0) + 'x' + (screen.height|0)
      + ' @' + (window.devicePixelRatio || 1) + '  ' + (navigator.language || '?');
  } catch(_e){}
  fbPersist();
}

function fbPersist(){
  try { if (FB) { FB.answers = FB_ANS; FB.words = FB_WORDS;
                  localStorage.setItem(FB_KEY, JSON.stringify(FB)); } } catch(_e){}
}

/* THE TICKER. Everything it reads, the game already keeps. */
function fbSample(){
  var B = fbBB(); if (!B || !FB) return;
  fbWatchCard();          /* the card may not have existed when the page parsed */
  FB.ms = FB_MS0 + (Date.now() - FB_T0);
  var at = { ms: FB.ms, day: null, min: null };
  try { at.day = DAY.day; at.min = DAY.min; FB.day = DAY.day; FB.min = DAY.min; } catch(_e){}
  var M = function(k){ try { B.mark(FB, k, at); } catch(_e){} };
  M('open');
  /* GETTING UP IS THE WAKE CARD GOING AWAY, and it needs a latch: the card is
     also not up in the second before it appears, and marking the beat then
     would say he got out of bed before the game asked him to. Found by driving
     the real demo and reading the paste: the clock alone said he took a job
     without ever getting up, because a fourteen second session does not move a
     game clock. The clock stays as a second path for a session that never sees
     a wake card at all; either one marks it. */
  try {
    var _on = document.getElementById('daycard').classList.contains('on');
    if (_on) FB_SAWCARD = true; else if (FB_SAWCARD) M('up');
  } catch(_e){}
  try { if (FB_MIN0 == null && typeof DAY !== 'undefined') FB_MIN0 = DAY.min; } catch(_e){}
  try { if (FB_MIN0 != null && DAY.min > FB_MIN0) M('up'); } catch(_e){}
  try { if (OFFER) M('rang'); } catch(_e){}
  try { if (OFFER_TAKEN) M('took'); } catch(_e){}
  /* WALKING IS BLOCKS, NOT TILES. A step is not a journey; leaving the block he
     woke up on is, and it is the same unit the address speaks in. */
  try {
    if (typeof hx === 'number' && hx) {
      var here = ctBlockOf(hx, hy);
      if (!FB_HOME) FB_HOME = here;
      else if (here[0] !== FB_HOME[0] || here[1] !== FB_HOME[1]) M('walked');
      var d = CT_DAYCAST;
      if (d && d.cast) for (var r in d.cast) {
        if (!d.cast.hasOwnProperty(r) || !d.cast[r].block) continue;
        if (here[0] === d.cast[r].block[0] && here[1] === d.cast[r].block[1]) { M('found'); break; }
      }
    }
  } catch(_e){}
  try { if (CT_MET.known() > 0) M('talked'); } catch(_e){}
  try { if (CT_MET.namesKnown() > 0) M('named'); } catch(_e){}
  try { if (DQ.rt && DQ.rt.state && (DQ.rt.state.log || []).length >= 2) M('answered'); } catch(_e){}
  try { if (DQ.rt && DQ.rt.state && DQ.rt.state.done) M('finished'); } catch(_e){}
  try { if (window.__ENDING) M('slept'); } catch(_e){}
  fbPersist();
}

/* *** AND ONE THING IS WATCHED RATHER THAN SAMPLED, BECAUSE SAMPLING CANNOT SEE
   IT. *** Found by the gate, not by reading this: the wake card going away is a
   TRANSITION, and a two second ticker misses any card that opens and closes
   between two of its looks. A fast player got out of bed and the paste said he
   never did. A DURABLE FACT CAN BE SAMPLED; A TRANSIENT ONE NEEDS A WITNESS.
   An observer is still not a hook: no call site is touched, nothing in the day
   loop knows this exists, and the browser is the thing doing the watching. */
var FB_WATCHED = false;
function fbWatchCard(){
  if (FB_WATCHED) return;
  try {
    var el = document.getElementById('daycard'); if (!el || !window.MutationObserver) return;
    if (el.classList.contains('on')) FB_SAWCARD = true;
    new MutationObserver(function(){
      if (el.classList.contains('on')) FB_SAWCARD = true;
    }).observe(el, { attributes:true, attributeFilter:['class'] });
    FB_WATCHED = true;
  } catch(_e){}
}

/* AND IT SURVIVES THE TAB GOING AWAY, which on a phone is the normal case
   rather than the exception: backgrounding to check a message can reload the
   page, so the last thing written before the lights go out is the record. */
(function fbStart(){
  try { fbBoot(); } catch(_e){}
  try { fbWatchCard(); } catch(_e){}
  try { setInterval(fbSample, 2000); } catch(_e){}
  try {
    document.addEventListener('visibilitychange', function(){
      if (document.visibilityState === 'hidden') { try { fbSample(); } catch(_e){} } });
    window.addEventListener('pagehide', function(){ try { fbSample(); } catch(_e){} });
  } catch(_e){}
})();

/* ---- THE CARD ------------------------------------------------------------- */
function fbBody(){
  var B = fbBB(); if (!B || !FB) return '';
  var qs = B.cardFor(FB);
  var h = '<h2>ONE LAST THING</h2>'
        + '<div class="sub">not the game · thirty seconds</div>'
        /* draft:true -- SPEED IS THE ONLY DEFENCE AGAINST POLITENESS. Friends
           and family are the kindest testers and the least useful ones, and no
           framing beats asking for the answer before they can dress it up. */
        + '<div class="fbnote">answer fast. the first thing you think of is the one we need.</div>';
  for (var i = 0; i < qs.length; i++) {
    var q = qs[i];
    h += '<div class="fbq">' + esc(q.ask) + '</div><div class="fbopts">';
    for (var j = 0; j < q.options.length; j++)
      h += '<button class="fbopt' + (FB_ANS[q.id] === q.options[j] ? ' on' : '')
         + '" data-act="fba:' + q.id + ':' + j + '">' + esc(q.options[j]) + '</button>';
    h += '</div>';
  }
  h += '<div class="fbq">' + esc(B.WORDS.ask) + '</div>'
     + '<textarea id="fbwords" class="fbwords" rows="3" placeholder="'
     + esc(B.WORDS.hint) + '">' + esc(FB_WORDS) + '</textarea>'
     + '<div class="fbopts"><button class="fbgo" data-act="fbsend">MAKE THE MESSAGE</button></div>'
     /* draft:true -- AND IT SAYS WHAT IT CANNOT DO. This is a static page on a
        phone: there is no server and nothing here is sent anywhere. Implying
        otherwise would be the one lie a feedback card cannot afford. */
     + '<div class="fbnote">nothing gets sent from here. this builds a block of '
     + 'text and you paste it wherever you want.</div>';
  return h;
}

/* THE BOX IS READ BEFORE ANYTHING IS REDRAWN. Every tap rebuilds the card, and
   a rebuild that forgets what they typed is a card nobody finishes. */
function fbKeep(){
  try { var t = document.getElementById('fbwords'); if (t) FB_WORDS = t.value; } catch(_e){}
}

function fbShow(){
  var B = fbBB(); if (!B || !FB) return;
  FB_OPEN = true;
  cardShow(fbBody(), function(act){
    if (!act) return;
    if (act === 'fbsend') { fbKeep(); fbPersist(); fbSend(); return; }
    if (act.indexOf('fba:') !== 0) return;
    var bits = act.split(':'), id = bits[1], idx = parseInt(bits[2], 10);
    var qs = B.cardFor(FB), q = null;
    for (var i = 0; i < qs.length; i++) if (qs[i].id === id) q = qs[i];
    if (!q || !q.options[idx]) return;
    fbKeep();
    /* TAPPING THE ANSWER YOU ALREADY GAVE TAKES IT BACK. A question with no way
       to un-answer it is a question that punishes a misfired thumb, and a
       misfired thumb on a phone is not rare. */
    FB_ANS[id] = (FB_ANS[id] === q.options[idx]) ? null : q.options[idx];
    fbPersist();
    fbShow();
  });
}

function fbSend(){
  var B = fbBB(); if (!B || !FB) return;
  try { fbSample(); } catch(_e){}
  FB.build = CT_BUILD;
  var txt = B.render(FB, FB_ANS, FB_WORDS);
  try { window.parent.postMessage({ bohemiaFeedbackExport: { text: txt } }, '*'); } catch(_e){}
  /* AND IT SAYS SO ON THE CARD TOO, because the modal opens in the shell and a
     player who does not see it appear has no idea the tap did anything. */
  try {
    var i2 = document.getElementById('daycardIn');
    if (i2) i2.insertAdjacentHTML('beforeend',
      '<div class="fbnote">made it. the text is up in the share box now.</div>');
  } catch(_e){}
}
"""

# ---- 4. THE DOOR UNDER THE ENDING --------------------------------------------
# ANCHORED ON THE cardShow LINE ALONE, not on the two lines around it: the SOUND
# lane put a phone_buzz between __ENDING and this call the same day, and an anchor
# that spans a neighbour's insertion point is an anchor that breaks when a lane
# that is nowhere near this feature ships.
END_ANCHOR = """  cardShow(h, function(){ /* nothing to press: the day does not come */ });"""
END_NEW = """  /* __CITY_FEEDBACK__ -- THE ENDING KEEPS ITS SILENCE AND THEN ASKS. Peak-end
     is why there is nothing to press here, so the door is not a way to keep
     playing and it does not arrive until the message has had time to land. Five
     seconds, added to the card that is already up rather than built into it, so
     a player who closes the ending never sees it and the last thing the GAME
     said stays the last thing the game said. */
  cardShow(h, function(act){ if (act === 'fbdoor') { try { fbShow(); } catch(_e){} } });
  try { setTimeout(function(){
    var inn = document.getElementById('daycardIn');
    if (!inn || !document.getElementById('daycard').classList.contains('on')) return;
    if (document.getElementById('fbdoorbtn')) return;
    inn.insertAdjacentHTML('beforeend',
      '<div class="fbdoor" id="fbdoorbtn" data-act="fbdoor">' +
      'SAY WHAT THAT WAS LIKE</div>');   /* draft:true */
  }, 5000); }catch(_e){}"""

# ---- 5. AND A DOOR THAT IS NOT THE ENDING ------------------------------------
# The population the protocol calls the whole point is the one that never
# reaches the ending, so there has to be a way in that a quit can find. The save
# drawer is already where a tester goes to get a block of text out of this game.
SAVE_ANCHOR = ("""   '<div class="sbtn" id="sv-exp">EXPORT SAVE</div><div class="sbtn" id="sv-imp">IMPORT</div>"""
               """<div class="sbtn" id="sv-close">CLOSE</div>'+""")
SAVE_NEW = ("""   '<div class="sbtn" id="sv-exp">EXPORT SAVE</div><div class="sbtn" id="sv-imp">IMPORT</div>"""
            """<div class="sbtn" id="sv-close">CLOSE</div>'+
   /* __CITY_FEEDBACK__ -- THE DOOR A QUIT CAN FIND. An end-of-day card is
      filled in only by people who reached the end, and the protocol's own rule
      says a tester who stops is the finding that matters most. This drawer is
      already where somebody goes to get text out of this game. */
   '<div class="sbtn" id="sv-fb">SAY WHAT THIS WAS LIKE</div>'+""")

SAVEWIRE_ANCHOR = """  p.querySelector('#sv-close').addEventListener('click',()=>{p.style.display='none';});"""
SAVEWIRE_NEW = """  p.querySelector('#sv-close').addEventListener('click',()=>{p.style.display='none';});
  /* __CITY_FEEDBACK__ */
  const _fb=p.querySelector('#sv-fb');
  if(_fb)_fb.addEventListener('click',()=>{ p.style.display='none'; try{ fbShow(); }catch(_e){} });"""

# ---- 6. THE LOOK -------------------------------------------------------------
CSS_ANCHOR = ("""    '#daycardIn .endstop{font:10px/1.6 ui-monospace,monospace;letter-spacing:2px;'+
      'color:#6a5a3e;margin-top:26px}'+""")
CSS_NEW = ("""    '#daycardIn .endstop{font:10px/1.6 ui-monospace,monospace;letter-spacing:2px;'+
      'color:#6a5a3e;margin-top:26px}'+
    /* __CITY_FEEDBACK__ -- THE CARD THAT IS NOT THE GAME. It uses the game's
       card so it inherits the scrim, the X, Escape and the tap-outside, and it
       deliberately does not use the game's VOICE: monospace, no serif prose, so
       the frame break is visible before a word is read. */
    '#daycardIn .fbq{font:700 11px/1.4 ui-monospace,monospace;letter-spacing:1.4px;'+
      'color:#c9bda2;margin-top:18px;text-transform:uppercase}'+
    '#daycardIn .fbnote{font:11px/1.5 ui-monospace,monospace;color:#8a7a5a;margin-top:8px}'+
    '#daycardIn .fbopts{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}'+
    '#daycardIn .fbopt{padding:9px 11px;border:1px solid var(--line);background:var(--face);'+
      'color:#c9bda2;font:11px/1 ui-monospace,monospace;border-radius:8px}'+
    /* THE ANSWER YOU GAVE IS THE ONLY LIT THING ON THE ROW, and it is lit the
       way this game lights a chosen thing everywhere else. */
    '#daycardIn .fbopt.on{background:#3a3320;border-color:#c9a24a;color:#f0e4c4}'+
    '#daycardIn .fbwords{width:100%;margin-top:8px;padding:8px;background:#12100c;'+
      'border:1px solid var(--line);border-radius:8px;color:#e8e2d4;'+
      'font:12px/1.45 ui-monospace,monospace;resize:vertical}'+
    '#daycardIn .fbgo{padding:11px 15px;border:1px solid #c9a24a;background:#3a3320;'+
      'color:#f0e4c4;font:700 11px/1 ui-monospace,monospace;letter-spacing:1.6px;'+
      'border-radius:8px;margin-top:6px}'+
    /* AND THE DOOR UNDER THE ENDING IS THE QUIETEST THING ON THAT SCREEN. */
    '#daycardIn .fbdoor{margin-top:30px;padding:10px 0;border-top:1px solid #2a2418;'+
      'font:10px/1.6 ui-monospace,monospace;letter-spacing:2px;color:#7b6c50}'+""")


def module_body():
    body = open(MOD_SRC, encoding='utf-8').read()
    if not body.endswith('\n'):
        body += '\n'
    return MOD_BANNER + '\n' + body + MOD_BANNER + '\n'


def repair(html):
    """PUT THE MODULE BACK IF SOMETHING TOOK IT OUT, and say so.

    Checked on the module's OWN evidence -- its banner -- never on the patch
    marker, because a one-shot patch that no-ops on its own marker cannot heal.
    That is not hypothetical: on 8/27 another lane's tool cut 103 lines of an
    inlined module out of this file and left every call site in place.
    """
    healed = []
    if MOD_BANNER not in html:
        if html.count(MOD_ANCHOR) != 1:
            sys.exit('FAILED: cannot repair -- the day-loop module banner resolves %d times.'
                     % html.count(MOD_ANCHOR))
        html = html.replace(MOD_ANCHOR, module_body() + MOD_ANCHOR, 1)
        healed.append('the inlined black box, which had been cut out')
    return html, healed


def main():
    html = open(CITY, encoding='utf-8').read()
    alpha = open(ALPHA, encoding='utf-8').read()

    if MARK in html:
        html, healed = repair(html)
        if healed:
            open(CITY, 'w', encoding='utf-8').write(html)
            print('  REPAIRED  ' + CITY + '  -- put back: ' + '; '.join(healed)
                  + '.  Re-run tools/bohemia_city_module_resync.py.')
        else:
            print('  already applied  ' + CITY)
        return

    city_steps = [('the demo-flag listener', BUILD_ANCHOR, BUILD_NEW),
                  ('the day-over test', BODY_ANCHOR, BODY_NEW),
                  ('the ending card', END_ANCHOR, END_NEW),
                  ('the save drawer markup', SAVE_ANCHOR, SAVE_NEW),
                  ('the save drawer wiring', SAVEWIRE_ANCHOR, SAVEWIRE_NEW),
                  ('the card stylesheet', CSS_ANCHOR, CSS_NEW)]
    alpha_steps = [('the whoAmI answer', ALPHA_ANCHOR, ALPHA_NEW),
                   ('the export bus', EXP_ANCHOR, EXP_NEW)]

    for name, anchor, _rep in city_steps:
        if html.count(anchor) != 1:
            sys.exit('FAILED: %s resolves %d times in %s, expected 1.'
                     % (name, html.count(anchor), CITY))
    for name, anchor, _rep in alpha_steps:
        if alpha.count(anchor) != 1:
            sys.exit('FAILED: %s resolves %d times in %s, expected 1.'
                     % (name, alpha.count(anchor), ALPHA))
    if html.count(MOD_ANCHOR) != 1:
        sys.exit('FAILED: the day-loop module banner resolves %d times, expected 1.'
                 % html.count(MOD_ANCHOR))

    html = html.replace(MOD_ANCHOR, module_body() + MOD_ANCHOR, 1)
    for _name, anchor, rep in city_steps:
        html = html.replace(anchor, rep, 1)
    for _name, anchor, rep in alpha_steps:
        alpha = alpha.replace(anchor, rep, 1)

    open(CITY, 'w', encoding='utf-8').write(html)
    open(ALPHA, 'w', encoding='utf-8').write(alpha)
    print('  patched  ' + CITY + '  (the recorder, the card, and two doors)')
    print('  patched  ' + ALPHA + '  (the build stamp rides the handshake; the paste '
          'goes out the save blob\'s own door)')


if __name__ == '__main__':
    main()
