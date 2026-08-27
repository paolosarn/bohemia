#!/usr/bin/env python3
"""BOHEMIA CITY CONVERSATION (8/26/26, PEOPLE lane) -- the quest finally says its
own words, out of the mouth of a person you can walk up to.

COUNTED BEFORE A LINE OF THIS WAS WRITTEN, across quests/bq:
    quest files      27
    @TALK nodes     236
    @SAY lines      504
    @OPT choices    558
    @NOVERB          59
bohemia_bq.js parses every one. bohemia_quest_runtime.js PLAYS every one --
available() / begin() / view() / choose() have been finished and correct since
the day they were written. AND NOTHING HAS EVER RENDERED ONE. The demo day loop
binds stages to WORLD EVENTS, so a quest speaks through the phone and the
journal and never through a mouth. Paolo, 8/11: "I HAVE A WHOLE 170 QUEST FILE
WITH DIALOGUE." Five hundred lines of it sat in the repo, parsed, and mute.

WHY IT IS POSSIBLE TODAY. A @TALK node's `speaker` is a @ROLE NAME, and a role
was a WORD until this morning. Casting resolves it to somebody standing here.

FOUR DECISIONS, AND WHERE EACH ONE COMES FROM:

1. THE CARD IS THE CONVERSATION. Not a new panel. The talk renders into the SAME
   #ctcard, so it inherits the scrim, the real X, the bottom anchor, Escape, and
   the walk-away close -- and walking off mid-sentence just works, for free.

2. THE NOVERBS ARE ON SCREEN, GREY, AND DEAD TO THE TOUCH. This is the single
   most repeated finding in questbook/BOHEMIA_CONVERSATIONS_MASTER: the Baron,
   Hildern, the Whodunit survivors, Jefferson Peralez, the Strange Man, Brisby,
   Shadowheart -- seven of the master's marquee nodes are remembered for THE
   THING THE GAME WOULD NOT LET YOU SAY. 59 of them are authored in our own
   quests and the game has never shown one. A withheld verb nobody can see is
   not withheld, it is missing.

3. A TRAP IS NEVER MARKED. view() hands over trap:true and this ignores it, on
   purpose. The master's words: "Available, functional, wrong." Marking a trap
   deletes the trap.

4. A CONVERSATION PLAYED IS A CONVERSATION CLOSED. MEASURED: zero @LOCK exists
   in the entire corpus, and available() filters on nothing but state.locked --
   so every entry node re-opens forever. Swept it: ON 19 ENTRY NODES, PLAYING
   THE SAME CONVERSATION TWICE DOUBLES THE NUMBERS (CARTEL 10 -> 20,
   TRADES -8 -> -16, BLUES 12 -> 24). Standing you can farm by pressing one
   button twice. The node is locked when the graph ends.
   AND WALKING AWAY DOES NOT LOCK IT: the conversation is resumed from the node
   you were on, because begin() is called ONCE and rt.view() remembers. A reload
   starts that conversation over, which costs NOTHING and was measured too --
   only 2 of 62 entry nodes carry a node-level @DO at all, and both are
   objective bookkeeping.

  python3 tools/bohemia_city_conversation_patch.py

Gate: gates/conversation_gate.js
"""
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARK = '__CITY_CONVERSATION__'

# ---- 0. the module itself, inlined the way the city inlines every engine module.
# It goes in with the ANNOUNCED BANNER the resync tool looks for, so
# tools/bohemia_city_module_resync.py keeps it fresh from here on and ENGINE SYNC
# LAW holds without anybody having to remember this file exists.
#
# *** IT CARRIES ITS OWN CLOSING BANNER, AND THAT COST A DAY TO LEARN. ***
# The resync tool's last-resort path finds where a module ENDS by scanning for
# the next '/* ==== engine/' banner. A module parked above ordinary code has no
# end and the cut runs on: measured, 50,917 bytes against a 5,002 byte module,
# and the tool refused to write. The first answer was to park it immediately
# above ANOTHER module's banner so that banner would end the cut -- which worked,
# and made this module the thing that gets swallowed when any tool cuts the
# module BELOW it. THAT IS EXACTLY WHAT HAPPENED: a commit on 8/27 rewriting the
# demo briefs took 114 lines out of the city and 103 of them were this module,
# leaving BohemiaConversation referenced three times and defined nowhere.
# A PLACEMENT THAT MADE ONE TOOL SAFE MADE ANOTHER TOOL DANGEROUS. So the module
# is SELF-DELIMITING now: the same banner opens and closes it, which ends any
# boundary scan at the right byte and cannot be confused for a second module
# (the resync dedupes by path). Where it is parked stops mattering.
MOD_ANCHOR = '/* ==== engine/bohemia_demoquests.js ==== */'
MOD_SRC = 'engine/bohemia_conversation.js'
MOD_BANNER = '/* ==== engine/bohemia_conversation.js ==== */'

# ---- 1. the two shapes the card has never had: a spoken line, and a dead verb --
CSS_ANCHOR = ("    '#ctcard button{margin-top:11px;margin-right:8px;padding:9px 13px;"
              "border:1px solid var(--line);'+")
CSS = ("""    /* __CITY_CONVERSATION__ -- A SPOKEN LINE IS NOT A KEY/VALUE ROW. The card
       has only ever had .r/.k/.v, which is right for facts about a person and
       wrong for somebody talking: a quest line is prose and wants the width. */
    '#ctcard .say{font:13px/1.45 "Space Grotesk",system-ui,sans-serif;color:var(--ink);'+
      'margin-top:9px}'+
    /* AND THE THING YOU CANNOT SAY, WHICH THE CORPUS SAYS IS THE LOUDEST PART OF
       THE SCENE. Dim, struck through, and not a button, because it is not one. */
    '#ctcard .noverb{font:italic 11px/1.35 "Space Grotesk",system-ui,sans-serif;'+
      'color:#7b6c50;margin-top:9px;text-decoration:line-through;opacity:.75}'+
""" + CSS_ANCHOR)

# ---- 2. the state and the two questions the city can answer and the module can't
FN_ANCHOR = "/* WHAT THIS PERSON IS WANTED FOR, or null."
FN = """/* __CITY_CONVERSATION__ -- THE QUEST'S OWN WORDS, IN A REAL MOUTH.
   CT_CONV is the open conversation: {entry, role, key}. It survives walking away
   ON PURPOSE -- begin() is called exactly ONCE, and rt.view() still holds the
   node you were on, so coming back picks the scene up where you left it instead
   of re-running the top of it. */
var CT_CONV = null;
/* WHICH NODE THIS PERSON CAN OPEN RIGHT NOW, or null for almost everybody.
   *** NULL IS A REAL ANSWER HERE, WHICH IS PRECISELY WHY IT MUST NEVER ALSO BE
   THE ERROR ANSWER. *** Almost nobody in the valley has anything to say, so a
   bare catch returning null hides a missing dependency perfectly: on 8/27 the
   inlined body of bohemia_conversation.js was cut out of this file by another
   lane's tool, BohemiaConversation went undefined, every call threw, every throw
   became "they have nothing to say", and the whole feature was gone with nothing
   on screen or in the console to say so. The gate caught it; this file did not.
   Same shape as ctFactionOf's 7/29 snapshot, which cost that lane thirteen days.
   A missing module now says so, once, in a sentence. */
function ctConvNode(who){
  if (typeof BohemiaConversation === 'undefined') {
    if (!ctConvNode.__warned) { ctConvNode.__warned = 1;
      console.error('BOHEMIA: BohemiaConversation is missing -- the inlined body of '
        + 'engine/bohemia_conversation.js is not in this file. Re-run '
        + 'tools/bohemia_city_conversation_patch.py. Until then NO QUEST CAN BE '
        + 'SPOKEN and that is a bug, not a quiet valley.'); }
    return null;
  }
  try {
    if (typeof DQ === 'undefined' || !DQ || !DQ.rt || !DQ.Q) return null;
    if (DQ.rt.state && DQ.rt.state.done) return null;
    var cast = ctCast(); if (!cast) return null;
    return BohemiaConversation.nodeFor(DQ.rt, DQ.Q, cast, who.key);
  } catch(_e){ return null; }
}
/* THE CARD, WHEN SOMEBODY IS TALKING. Every word on it comes out of the .bq
   file; nothing here writes prose. */
function ctConvBody(who){
  var v; try { v = DQ.rt.view(); } catch(_e){ return null; }
  if (!v || v.ended) return null;
  var nm = BohemiaPeople.nameOf(who);
  var body = '<div class="who">' + (nm ? nm.toUpperCase() : BohemiaPeople.headingOf(who)) + '</div>';
  (v.says || []).forEach(function(s){ body += '<div class="say">' + esc(s) + '</div>'; });
  (v.options || []).forEach(function(o){
    /* THE TRAP IS NOT MARKED AND THE SILENCE IS NOT MARKED. o.trap and o.silence
       are both right here in the data and both deliberately unused: a trap you
       can see is not a trap, and "(say nothing, just go)" already reads as
       silence because the author wrote the parentheses. */
    body += '<button class="convopt" data-i="' + o.i + '">' + esc(o.text) + '</button>';
  });
  (v.noverbs || []).forEach(function(n){
    body += '<div class="noverb">' + esc(n) + '</div>';
  });
  /* AND WHEN THERE IS NOWHERE LEFT TO GO, THE BUTTON SAYS SO AND MEANS IT. A
     node with no options is the end of the scene (21 of the corpus's 236 nodes
     are exactly that, including the lineman's last line), and pressing this
     closes the conversation for good rather than leaving it standing open. */
  body += BohemiaConversation.atEnd(v)
    ? '<button id="ctconvend">That is that</button>'          /* draft:true */
    : '<button id="ctconvgo">Leave it there</button>';        /* draft:true */
  return body;
}
""" + FN_ANCHOR

# ---- 3. the card renders the conversation instead of the facts, when there is one
DRAW_ANCHOR = """function ctDraw(){
  var p=CT_OPEN; if(!p) return;
  var who=ctPerson(p);
"""
DRAW = """function ctDraw(){
  var p=CT_OPEN; if(!p) return;
  var who=ctPerson(p);
  /* __CITY_CONVERSATION__ -- IF THEY ARE TALKING, THAT IS THE CARD. It replaces
     the identity rows rather than sitting under them: while somebody is telling
     you their problem, their tan-wall address is not the thing on screen. */
  if (CT_CONV && CT_CONV.key === who.key) {
    var cb = ctConvBody(who);
    if (cb) {
      var cc = document.getElementById('ctcard');
      cc.innerHTML = cb; cc.style.display = 'block';
      ctCardToBottom();
      document.getElementById('cttalk').style.display = 'none';
      ctConvWire();
      return;
    }
    CT_CONV = null;      /* the graph ended while the card was open */
  }
"""

# ---- 4. the button that starts it, right under THE JOB row --------------------
ROW_ANCHOR = """  var ctJob = (typeof ctCastRow === 'function') ? ctCastRow(who) : null;
  if (ctJob) body += ctRow('THE JOB', ctJob);
"""
ROW = ROW_ANCHOR + """  /* __CITY_CONVERSATION__ -- AND THE DOOR INTO IT.
     THE LABEL IS THE QUEST'S OWN WORDS, NOT MINE: measured across the corpus,
     52 of the 62 entry nodes have an @OBJ whose target IS that node's speaker,
     so the button says the objective the HUD is already showing, verbatim. The
     other ten get an attempt (ALWAYS MAKE AN ATTEMPT, 8/11), tagged draft. */
  var ctCN = ctConvNode(who);
  if (ctCN) {
    var ctOp = BohemiaConversation.openerFor(DQ.Q, DQ.rt, ctCN.role);
    body += '<button id="ctconv" data-node="' + ctCN.id + '">' + esc(ctOp.text) + '</button>';
  }
"""

# ---- 5a. and the identity card wires the door into the conversation -----------
OPENWIRE_ANCHOR = "  var ask=document.getElementById('ctask');"
OPENWIRE = ("  /* __CITY_CONVERSATION__ -- the door into the quest's own words. */\n"
            "  ctConvOpenWire();\n" + OPENWIRE_ANCHOR)

# ---- 5. the wiring ------------------------------------------------------------
WIRE_ANCHOR = "function ctClose(){ CT_OPEN=null;"
WIRE = """/* __CITY_CONVERSATION__ -- THE HANDLERS. Kept in one place because a
   conversation redraws itself after every choice, so the buttons are rebuilt
   every time and re-wired every time. */
function ctConvWire(){
  var go = document.getElementById('ctconvgo');
  if (go) go.addEventListener('click', function(){ ctClose(); });
  /* THE END OF THE SCENE, WHICH IS NOT THE SAME AS WALKING OFF. */
  var end = document.getElementById('ctconvend');
  if (end) end.addEventListener('click', function(){ ctConvFinish(); });
  var opts = document.querySelectorAll('#ctcard .convopt');
  for (var i = 0; i < opts.length; i++) {
    opts[i].addEventListener('click', function(){
      var idx = parseInt(this.getAttribute('data-i'), 10);
      ctConvChoose(idx);
    });
  }
}
/* AND THE DOOR ITSELF, which lives on the IDENTITY card and so has to be wired
   from there. It is a separate function because the two cards are rebuilt at
   different moments and a button with no listener is a button that lies. */
function ctConvOpenWire(){
  var b = document.getElementById('ctconv'); if (!b) return;
  b.addEventListener('click', function(){
    var id = this.getAttribute('data-node');
    if (!CT_OPEN || !id) return;
    var who = ctPerson(CT_OPEN);
    var nd = ctConvNode(who); if (!nd || nd.id !== id) return;
    /* begin() RUNS THE NODE, so it is called exactly once and never again for
       this conversation: coming back after walking off resumes from rt.view(). */
    try { DQ.rt.begin(id); } catch(_e){ return; }
    CT_CONV = { entry: id, role: nd.role, key: who.key };
    ctDraw();
  });
}
/* THE SCENE IS OVER: lock it, drop back to who they are, and let any held card
   through. One place, so the two ways a conversation can finish -- answering the
   last question, or reaching a line with no question after it -- cannot drift
   apart. */
function ctConvFinish(){
  if (!CT_CONV) { ctClose(); return; }
  try { BohemiaConversation.close(DQ.rt, CT_CONV.entry); } catch(_e){}
  CT_CONV = null;
  ctDraw();
  try { updQline(); }catch(_e){}     /* the address moves on to the next part */
  try { if (DQ.pending) showChoice(DQ.pending); } catch(_e){}
}
function ctConvChoose(i){
  if (!CT_CONV) return;
  var v = null;
  try { v = DQ.rt.choose(i); } catch(_e){ return; }
  /* *** ENDED, NOT atEnd, AND THE DIFFERENCE IS A WRITTEN LINE. *** A chosen
     option can land on a node with no options -- 21 of the corpus's 236 are
     exactly that, and the lineman's scene ends on one: "Splits somewhere past
     the dead storefronts. Warm cable." Closing here on atEnd would lock the
     scene BEFORE that line was ever drawn, which is deleting a line the author
     wrote. So a real node is always RENDERED; the graph running out of nodes
     entirely is what closes on its own, and the end button closes the rest. */
  var over = (!v || v.ended);
  /* THE JOURNAL HEARS ABOUT IT, AND IT HEARS ABOUT IT EXACTLY ONCE. A chosen
     option can carry `@DO set_stage 20`, which has ALREADY run by the time we
     get here -- so this NARRATES, it does not apply. DQ.spoke() exists for that
     one reason and re-running the stage would pay every bond on it twice. */
  try {
    var r = DQ.spoke();
    if (r) {
      /* ONE DECISION SURFACE AT A TIME, AND THIS WAS FOUND BY TRACING RATHER
         THAN BY LOOKING. The day's RESOLUTION stage for day one IS stage 20, and
         answering "I will walk it back" reaches stage 20 in one tap -- so the
         resolution card would have thrown itself up over somebody who is still
         mid-sentence, two decisions on the glass at once, the second one
         answering a question the first has not finished asking.
         DQ.pending ALREADY HOLDS THAT CARD (it is how the phone hands the day's
         first choice over), so nothing new has to store it: the card is simply
         not passed through while the conversation is still running, and it is
         shown the moment the scene ends. */
      if (!over && r.card)
        r = { stage: r.stage, log: r.log, objectives: r.objectives, spoke: true };
      dayAfterQuest(r);
    }
  } catch(_e){}
  if (over) {
    /* THE GRAPH ENDED, SO THE DOOR CLOSES. Measured across the corpus: replaying
       an entry node DOUBLES faction numbers. Locking is the runtime's own field
       and rides the save already. */
    ctConvFinish();
    return;
  }
  ctDraw();
}
""" + WIRE_ANCHOR

# ---- 6. walking away does NOT end it, and the card knows the difference --------
CLOSE_ANCHOR = """function ctClose(){ CT_OPEN=null;
  var c=document.getElementById('ctcard'); if(c) c.style.display='none';
  ctVerb(); }"""
CLOSE = """function ctClose(){ CT_OPEN=null;
  /* __CITY_CONVERSATION__ -- CLOSING THE CARD IS NOT ENDING THE CONVERSATION.
     You walked off, or you tapped away. Come back and the scene picks up on the
     node you were on, because begin() ran once and the runtime still holds it.
     The one thing that ends a conversation is the graph ending. */
  var c=document.getElementById('ctcard'); if(c) c.style.display='none';
  ctVerb(); }"""


def module_body():
    body = open(MOD_SRC, encoding='utf-8').read()
    if not body.endswith('\n'):
        body += '\n'
    return MOD_BANNER + '\n' + body + MOD_BANNER + '\n'


def repair(html):
    """PUT THE MODULE BACK IF SOMETHING TOOK IT OUT, and say so.

    A one-shot patch that no-ops on its own marker cannot heal, and this one had
    to: on 8/27 another lane's tool cut 103 lines of the inlined module out of
    the city while leaving every call site in place. THE FEATURE WAS GONE AND THE
    ONLY SYMPTOM WAS PEOPLE HAVING NOTHING TO SAY. So the module is checked on
    its OWN evidence -- its banner -- rather than on the patch marker, and
    re-running this file is the repair.
    """
    healed = []
    # (a) THE SILENT-NULL GUARD, for a city patched before the guard existed.
    # The guarded body is taken from FN itself so the two can never drift.
    HEAD = '/* WHICH NODE THIS PERSON CAN OPEN RIGHT NOW'
    TAIL = '/* THE CARD, WHEN SOMEBODY IS TALKING.'
    if 'ctConvNode.__warned' not in html and html.count(HEAD) == 1 and html.count(TAIL) == 1:
        a, b = html.index(HEAD), html.index(TAIL)
        html = html[:a] + FN[FN.index(HEAD):FN.index(TAIL)] + html[b:]
        healed.append('the missing-module warning')
    # (b) THE CARD BODY AND THE HANDLERS, for a city patched before atEnd existed.
    # Same technique: the replacement is sliced out of the source constants above,
    # so a repaired city and a freshly patched one can never differ.
    for label, start_mark, end_mark, src in (
            ('the end-of-scene card', '/* AND WHEN THERE IS NOWHERE LEFT TO GO',
             '/* WHAT THIS PERSON IS WANTED FOR', FN),
            ('the end-of-scene handlers', '/* __CITY_CONVERSATION__ -- THE HANDLERS.',
             'function ctClose(){ CT_OPEN=null;', WIRE)):
        if 'ctConvFinish' in html:
            break
        want = src[src.index(start_mark):src.index(end_mark)] if start_mark in src else None
        if want is None:
            continue
        # the OLD text runs from wherever the old block started to the same end
        old_start = ('  body += \'<button id="ctconvgo">Leave it there</button>\';'
                     if 'card' in label else start_mark)
        if old_start not in html or html.count(end_mark) != 1:
            continue
        a = html.index(old_start)
        b = html.index(end_mark)
        html = html[:a] + want + html[b:]
        healed.append(label)
    # (c) THE MODULE ITSELF.
    if MOD_BANNER not in html:
        if html.count(MOD_ANCHOR) != 1:
            sys.exit('FAILED: cannot repair -- the day-loop module banner resolves %d times.'
                     % html.count(MOD_ANCHOR))
        html = html.replace(MOD_ANCHOR, module_body() + MOD_ANCHOR, 1)
        healed.append('the inlined module, which had been cut out')
    return html, healed


def main():
    html = open(CITY, encoding='utf-8').read()
    if MARK in html:
        html, healed = repair(html)
        if healed:
            open(CITY, 'w', encoding='utf-8').write(html)
            print('  REPAIRED  ' + CITY + '  -- put back: ' + '; '.join(healed)
                  + '.  Re-run tools/bohemia_city_module_resync.py.')
        else:
            print('  already applied  ' + CITY)
        return
    steps = [('the card CSS', CSS_ANCHOR, CSS),
             ('ctCastRow', FN_ANCHOR, FN),
             ('ctDraw head', DRAW_ANCHOR, DRAW),
             ('THE JOB row', ROW_ANCHOR, ROW),
             ('the identity card wiring', OPENWIRE_ANCHOR, OPENWIRE),
             ('ctClose (wiring)', WIRE_ANCHOR, WIRE)]
    for name, anchor, _rep in steps:
        if html.count(anchor) != 1:
            sys.exit('FAILED: %s resolves %d times in %s, expected 1.'
                     % (name, html.count(anchor), CITY))
    if html.count(CLOSE_ANCHOR) != 1:
        sys.exit('FAILED: ctClose body resolves %d times, expected 1.' % html.count(CLOSE_ANCHOR))
    if html.count(MOD_ANCHOR) != 1:
        sys.exit('FAILED: the day-loop module banner resolves %d times, expected 1.'
                 % html.count(MOD_ANCHOR))
    html = html.replace(MOD_ANCHOR, module_body() + MOD_ANCHOR, 1)
    # ctClose first: the WIRE step inserts text ABOVE the same anchor line, and
    # rewriting the body afterwards would then have two candidate matches.
    html = html.replace(CLOSE_ANCHOR, CLOSE, 1)
    for _name, anchor, rep in steps:
        html = html.replace(anchor, rep, 1)
    open(CITY, 'w', encoding='utf-8').write(html)
    print('  patched  ' + CITY + '  (the conversation: says, options, noverbs)')


if __name__ == '__main__':
    main()
