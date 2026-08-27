#!/usr/bin/env python3
"""BOHEMIA THE ENDING (8/27/26, PEOPLE lane) -- the last thirty seconds of the
demo, which nobody had built, and it ends on a thing you are not allowed to say.

THE ROW IT CLOSES. The handoff's own critical path: "BUILD -> DOOR -> ENDING ->
INSTRUMENT -> INVITE ... DEMO-END (the last thirty seconds, which nobody has
designed and which peak-end says is half of what anybody keeps)". NOBODY IS
HANDED THE DEMO LINK UNTIL ALL FOUR EXIST. The lane it was assigned to has not
shipped since 8/12. This is a message from a person on a phone at the end of a
day, which is this lane's whole subject.

THE RESEARCH, banked in records/BOHEMIA_WHAT_THE_DEMO_IS_STILL_MISSING_8_25_26:
KAHNEMAN AND FREDRICKSON'S PEAK-END RULE says what a person keeps of an episode
is predicted almost entirely by two moments, the most intense and THE LAST ONE.
DURATION NEGLECT says how long it went barely registers. And from the other
direction, Zukowski's demo work: an ending is not neutral, and ending without
giving a reason to come back actively hurts the demo. The coordinator's finding
on his own ruled cut was that BOTH PEAKS SIT IN THE FIRST FIVE MINUTES AND THE
LAST THING THE PLAYER FEELS IS GOING TO BED. The cut is his and it is good. This
is the thirty seconds after it.

*** AND IT ENDS ON A NOVERB. *** The corpus's most repeated craft finding is the
withheld verb: seven of the CONVERSATIONS MASTER's marquee nodes are remembered
for the line the game refused to let the player speak. The message that lands
here asks the player something, and the answer they want to send is sitting right
underneath it, greyed and dead. The game's own grammar, used once, at the end.

IT SPEAKS TO THE DAY THEY ACTUALLY HAD. The quest already classifies its own
outcome (#quiet / #notable / #reckless, its author's own FAIL branch, and never
having picked up at all), so there are five endings and not one. A last moment
that is the same whatever you did is half of what a person keeps, spent on
nothing.

ONLY IN THE DEMO. In the workshop, SLEEP still rolls into day two and nothing
changes: his bench is not a thing that ends. The city cannot read the shell's
window, so the shell POSTS the flag in on frame load, exactly like the player
sprite and the save already travel.

  python3 tools/bohemia_city_ending_patch.py

Gate: gates/ending_gate.js
"""
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
CITY = 'slices/BOHEMIA_CITY_WORLD.html'
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = '__THE_ENDING__'
MOD_SRC = 'engine/bohemia_ending.js'
MOD_BANNER = '/* ==== engine/bohemia_ending.js ==== */'
MOD_ANCHOR = '/* ==== engine/bohemia_demoquests.js ==== */'

# ---- 1. THE SHELL TELLS THE CITY WHICH SURFACE IT IS --------------------------
ALPHA_ANCHOR = "window.addEventListener('message',ev=>{const m=ev&&ev.data;if(!m||m.type!=='BOHEMIA_SHOT_RESULT')return;"
ALPHA_NEW = ("""/* __THE_ENDING__ -- THE CITY ASKS, AND THIS ANSWERS.
   THE FIRST CUT PUSHED THE FLAG ON THE FRAME'S `load` EVENT AND IT NEVER
   ARRIVED. Measured on the real demo build: the city's document.readyState is
   still "interactive" while the player is already walking around in it -- a
   four megabyte page whose load event fires long after the game is playable, if
   at all. THE FRAME KNOWS WHEN IT IS READY AND THE SHELL DOES NOT, so the
   direction is reversed: the city asks on boot and this replies. */
window.addEventListener('message',function(ev){
  try{
    if(!ev||!ev.data||!ev.data.bohemiaWhoAmI)return;
    if(ev.source&&ev.source.postMessage)
      ev.source.postMessage({bohemiaIsDemo:!!window.__BOHEMIA_DEMO_BUILD},'*');
  }catch(e){}
});
""" + ALPHA_ANCHOR)

# ---- 2. THE CITY RECEIVES IT --------------------------------------------------
RECV_ANCHOR = "function onNightfall(){"
RECV = """/* __THE_ENDING__ -- WHICH SURFACE AM I. Told by the shell on frame load; false
   until told, because the workshop is the safe default and a demo that never
   ends is a smaller failure than a bench that stops on day two. */
var CT_IS_DEMO = false;
window.addEventListener('message', function(ev){
  try { if (ev && ev.data && typeof ev.data.bohemiaIsDemo === 'boolean')
          CT_IS_DEMO = ev.data.bohemiaIsDemo; } catch(_e){}
});
/* *** AND THE CITY ASKS, BECAUSE WAITING TO BE TOLD DOES NOT WORK. *** The first
   cut had the shell push this on the frame's `load` event, and MEASURED ON THE
   REAL DEMO BUILD it never arrived: this document's readyState is still
   "interactive" while the player is already walking around in it. A four
   megabyte page's load event is not a thing anybody should be waiting on.
   THE FRAME KNOWS WHEN IT IS READY AND THE SHELL DOES NOT. Asked a few times
   over the first two seconds, because the shell's own listener may not be up on
   the first tick, and answering twice is free. */
(function ctAskWhoAmI(){
  var tries = 0;
  function ask(){
    tries++;
    try { if (window.parent && window.parent !== window)
            window.parent.postMessage({ bohemiaWhoAmI: true }, '*'); } catch(_e){}
    if (tries < 6) setTimeout(ask, 300);
  }
  ask();
})();
/* HIS RULED DEMO CUT IS "ONE GOOD DAY" (8/4): cold open, the vista, one day,
   sleep. So the demo ends when day one is slept through, and the workshop never
   ends at all. */
var CT_DEMO_DAYS = 1;
function ctDemoOver(day){ return CT_IS_DEMO && (day|0) >= CT_DEMO_DAYS; }
/* WHO IS TEXTING. The person the day's quest was actually about, if the casting
   found one. It is the same cast the card and the conversation used, so the
   voice at the end is somebody he can place. */
function ctEndingFrom(){
  try {
    /* *** THE CACHE, NOT ctDayCast(). *** ctDayCast() refuses once the quest is
       done, which is correct for the card -- THE JOB row must stop pointing at
       somebody after the job is over -- and exactly wrong here, because by the
       time this runs the job is ALWAYS over. Measured: it returned null on every
       finished day, so the last message in the demo came from nobody. */
    var d = CT_DAYCAST; if (!d || !d.cast) return null;
    var role = null;
    var rs = (DQ.Q && DQ.Q.roles) || [];
    for (var i = 0; i < rs.length; i++)
      if (rs[i].req && d.cast[rs[i].name]) { role = rs[i].name; break; }
    if (!role) for (var k in d.cast) { role = k; break; }
    if (!role) return null;
    /* *** AND WHETHER IT SAYS THEIR NAME IS UP TO HIM, WHICH IS FREE. *** YOU
       HAVE TO ASK (7/31) already governs names: nameOf returns null for anybody
       he never asked. So a player who took the trouble gets a person texting
       them, and a player who did not gets a job title. Nothing here decides
       that; the ledger he already wrote decides it. */
    var c = d.cast[role];
    try {
      var b = c.block, list = pplPeople(b[0], b[1]) || [];
      for (var j = 0; j < list.length; j++) {
        if ('P:city:' + list[j].id !== c.key) continue;
        var nm = BohemiaPeople.nameOf(ctPerson(list[j]));
        if (nm) return String(nm).toUpperCase();
        break;
      }
    } catch(_e){}
    return String(role).replace(/_/g, ' ').toUpperCase();
  } catch(_e){ return null; }
}
/* *** THE LAST THIRTY SECONDS. *** The screen has gone; one message lands; the
   reply he wants to send is under it, greyed and dead to the touch. */
function showEnding(){
  var ctx = { taken: !!OFFER_TAKEN,
              outcome: (function(){ try { return OFFER_TAKEN ? DQ.outcome() : null; } catch(_e){ return null; } })(),
              tags: (function(){ try { return OFFER_TAKEN ? DQ.tags() : []; } catch(_e){ return []; } })(),
              from: ctEndingFrom() };
  var e = null;
  try { e = BohemiaEnding.endingFor(ctx); } catch(_e){}
  if (!e) { DAY.nextDay(); daySync(); showWake(); return; }   /* never strand him on black */
  var h = '<h2>' + esc(e.from || 'A NUMBER YOU DO NOT HAVE') + '</h2>'
        + '<div class="sub">' + esc(DAY.hhmm(DAY.min)) + ' \\u00b7 the phone, after</div>';
  e.says.forEach(function(s){ h += '<div class="endsay">' + esc(s) + '</div>'; });
  /* THE WITHHELD VERB, and it is the whole point of ending here. */
  h += '<div class="endnoverb">' + esc(e.noverb) + '</div>';
  h += '<div class="endstop">THAT IS AS FAR AS THIS GOES FOR NOW.</div>';   /* draft:true */
  window.__ENDING = { key: e.key, from: e.from, says: e.says.slice(), noverb: e.noverb };
  cardShow(h, function(){ /* nothing to press: the day does not come */ });
}
function onNightfall(){"""

# ---- 3. AND SLEEP LEADS TO IT, IN THE DEMO ONLY -------------------------------
SLEEP_ANCHOR = """  cardShow(h,function(){ cardHide();
    /* __CITY_NEGLECT__ -- charge the upkeep for the day that is ending, BEFORE
       the rollover, because the check is "did you turn up TODAY" and after
       nextDay() today is a different number. */
    try { ctNeglectFor(ctBelongSave(), (T && T.day) || 1); } catch(_e){}
    DAY.nextDay(); daySync(); _lastDistrict=null;
    showWake(); updHud(); render(); reportState(); });"""
SLEEP_NEW = """  cardShow(h,function(){ cardHide();
    /* __CITY_NEGLECT__ -- charge the upkeep for the day that is ending, BEFORE
       the rollover, because the check is "did you turn up TODAY" and after
       nextDay() today is a different number. */
    try { ctNeglectFor(ctBelongSave(), (T && T.day) || 1); } catch(_e){}
    /* __THE_ENDING__ -- IN THE DEMO, DAY TWO DOES NOT COME. The upkeep above
       still runs, because the day he played really did happen. Everything below
       is the rollover, and the rollover is what the demo does not get. */
    if (ctDemoOver(s.day)) { try { showEnding(); return; } catch(_e){} }
    DAY.nextDay(); daySync(); _lastDistrict=null;
    showWake(); updHud(); render(); reportState(); });"""

# ---- 4. THE TWO SHAPES THE CARD HAS NEVER HAD --------------------------------
CSS_ANCHOR = "'#ctcard .say{font:13px/1.45 \"Space Grotesk\",system-ui,sans-serif;color:var(--ink);'+"
CSS = ("""    /* __THE_ENDING__ -- a text message reads bigger and slower than a card row.
       It is the last thing anybody sees of this game, so it gets the room. */
    '#daycardIn .endsay{font:15px/1.5 "Space Grotesk",system-ui,sans-serif;color:#e8e2d4;'+
      'margin-top:12px}'+
    /* AND THE REPLY HE CANNOT SEND. Same shape as a conversation's refusal,
       which is deliberate: he has met this grammar four times by now and knows
       exactly what a struck-through line means. */
    '#daycardIn .endnoverb{font:italic 12px/1.4 "Space Grotesk",system-ui,sans-serif;'+
      'color:#7b6c50;margin-top:20px;text-decoration:line-through;opacity:.8}'+
    '#daycardIn .endstop{font:10px/1.6 ui-monospace,monospace;letter-spacing:2px;'+
      'color:#6a5a3e;margin-top:26px}'+
""" + CSS_ANCHOR)


def module_body():
    body = open(MOD_SRC, encoding='utf-8').read()
    if not body.endswith('\n'):
        body += '\n'
    return MOD_BANNER + '\n' + body + MOD_BANNER + '\n'


def repair(html):
    """SELF-HEALING, and this lane learned why the hard way on 8/27: another
    tool cut an inlined module out of this file while leaving every call site in
    place, and the only symptom was a feature quietly not existing. A patch that
    no-ops on its own marker cannot heal that. This checks the module's OWN
    evidence."""
    if MOD_BANNER in html:
        return html, False
    if html.count(MOD_ANCHOR) != 1:
        sys.exit('FAILED: cannot repair -- the day-loop module banner resolves %d times.'
                 % html.count(MOD_ANCHOR))
    return html.replace(MOD_ANCHOR, module_body() + MOD_ANCHOR, 1), True


def main():
    alpha = open(ALPHA, encoding='utf-8').read()
    if MARK not in alpha:
        if alpha.count(ALPHA_ANCHOR) != 1:
            sys.exit('FAILED: the city frame boot resolves %d times in %s, expected 1.'
                     % (alpha.count(ALPHA_ANCHOR), ALPHA))
        open(ALPHA, 'w', encoding='utf-8').write(alpha.replace(ALPHA_ANCHOR, ALPHA_NEW, 1))
        print('  patched  ' + ALPHA + '  (the shell tells the city which surface it is)')
    else:
        print('  already applied  ' + ALPHA)

    html = open(CITY, encoding='utf-8').read()
    if MARK in html:
        html, healed = repair(html)
        if healed:
            open(CITY, 'w', encoding='utf-8').write(html)
            print('  REPAIRED  ' + CITY + '  -- the inlined ending module had been cut out.')
        else:
            print('  already applied  ' + CITY)
        return
    steps = [('the card CSS', CSS_ANCHOR, CSS),
             ('onNightfall', RECV_ANCHOR, RECV),
             ('the SLEEP tap', SLEEP_ANCHOR, SLEEP_NEW)]
    for name, anchor, _rep in steps:
        if html.count(anchor) != 1:
            sys.exit('FAILED: %s resolves %d times in %s, expected 1.'
                     % (name, html.count(anchor), CITY))
    if html.count(MOD_ANCHOR) != 1:
        sys.exit('FAILED: the day-loop module banner resolves %d times.' % html.count(MOD_ANCHOR))
    html = html.replace(MOD_ANCHOR, module_body() + MOD_ANCHOR, 1)
    for _name, anchor, rep in steps:
        html = html.replace(anchor, rep, 1)
    open(CITY, 'w', encoding='utf-8').write(html)
    print('  patched  ' + CITY + '  (the last thirty seconds, and the reply he cannot send)')


if __name__ == '__main__':
    main()
