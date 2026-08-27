/* BOHEMIA CONVERSATION — the bridge between a quest's @TALK node and the person
   standing in front of you. UI-AGNOSTIC, like the runtime it sits on.
   (8/26/26, PEOPLE lane.)

   THE FINDING THAT MADE THIS, COUNTED BEFORE A LINE WAS WRITTEN:
     quests/bq        27 files
     @TALK nodes     236
     @SAY lines      504
     @OPT choices    558
     @NOVERB          59
   bohemia_bq.js parses every one of them. bohemia_quest_runtime.js PLAYS every
   one of them -- available() / begin() / view() / choose() have been finished and
   correct since the day they were written. AND NOTHING HAS EVER RENDERED ONE.
   bohemia_demoquests.js binds stages to WORLD EVENTS -- where you walked, whether
   the block had power -- so a quest speaks to you through the phone and the
   journal and NEVER THROUGH A MOUTH. Paolo, 8/11: "I HAVE A WHOLE 170 QUEST FILE
   WITH DIALOGUE." Five hundred lines of it are in the repo, parsed, and mute.

   WHY IT IS POSSIBLE TODAY AND WAS NOT YESTERDAY. A @TALK node's `speaker` is a
   @ROLE NAME, and until this morning a role was a WORD: `@ROLE lineman REQ
   faction=TRADES` resolved to the string "lineman" and nobody in the valley was
   ever the lineman. BohemiaPeople.castAddresses now resolves a role to a person who
   is really standing on this block, so the chain closes:
       speaker -> role -> cast -> key -> the person whose card is open.

   THIS FILE IS THE CHAIN AND NOTHING ELSE. It renders nothing, styles nothing,
   and invents no words: every line the player reads comes out of the .bq file.

   REUSE CHECK: cooks no graphic pixels of any kind and opens no bank. It draws
   nothing at all. */
(function (root) {
  'use strict';

  function talkIndex(Q) {
    var by = {};
    ((Q && Q.talks) || []).forEach(function (t) { by[t.id] = t; });
    return by;
  }

  /* WHICH NODE, IF ANY, THIS PERSON CAN OPEN RIGHT NOW.
     available() is the runtime's own answer to "which entry conditions pass and
     are not locked"; all this adds is the half the runtime cannot know -- WHO the
     speaker is standing where. Returns null for the overwhelming majority of
     people, which is the point: on a block of thirty, one of them has the job. */
  function nodeFor(rt, Q, cast, key) {
    if (!rt || !Q || !cast || !key) return null;
    var by = talkIndex(Q), ids = [];
    try { ids = rt.available() || []; } catch (_e) { return null; }
    for (var i = 0; i < ids.length; i++) {
      var t = by[ids[i]];
      if (!t || !t.speaker) continue;
      var c = cast[t.speaker];
      if (!c || c.key !== key) continue;
      return { id: t.id, role: t.speaker, node: t };
    }
    return null;
  }

  /* WHAT THE BUTTON THAT STARTS IT SAYS.
     MEASURED ACROSS THE CORPUS: 52 of the 62 entry nodes have an @OBJ whose
     `target` IS that node's speaker role. So the label is THE OBJECTIVE'S OWN
     TEXT, verbatim -- the quest's words rather than mine, checkable byte for byte
     by a gate, and literally the sentence the HUD is showing the player already.
     The other ten get an attempt (ALWAYS MAKE AN ATTEMPT, 8/11) tagged draft. */
  function openerFor(Q, rt, roleName) {
    var objs = [];
    try { objs = rt.objectives() || []; } catch (_e) { objs = []; }
    for (var i = 0; i < objs.length; i++) {
      if (objs[i].status !== 'active') continue;
      if (objs[i].target !== roleName) continue;
      return { text: objs[i].text, draft: false, from: 'objective' };
    }
    return { text: 'Ask them about the job', draft: true, from: 'fallback' };
  }

  /* THE ONE THING THE RUNTIME DOES NOT DO FOR ITSELF, AND IT HAS TO BE DONE.
     ZERO @LOCK EXISTS IN THE WHOLE CORPUS (counted: 0 across 27 files), and
     available() filters on nothing but state.locked -- so every entry node
     re-opens forever, and _enter() re-runs that node's @DO verbs every time. A
     player could stand still and press one button to farm the same bond. A
     CONVERSATION YOU CAN HAVE AGAIN IS NOT A CONVERSATION. Locking the entry node
     when the conversation ends uses the runtime's OWN field, which serialize()
     already carries into the save, so this invents no state.
     ONLY the node you entered from: sub-nodes reached by -> have no entry
     condition and available() never offers them anyway. */
  function close(rt, entryId) {
    if (!rt || !entryId) return false;
    try {
      if (rt.state.locked[entryId]) return false;
      rt.state.locked[entryId] = true;
      return true;
    } catch (_e) { return false; }
  }

  /* HAS THIS CONVERSATION ALREADY BEEN HAD. */
  function closed(rt, entryId) {
    try { return !!(rt && entryId && rt.state.locked[entryId]); } catch (_e) { return false; }
  }

  /* *** IS THERE ANYWHERE LEFT TO GO, and it took a gate claim to find out there
     usually is not. *** The runtime reports `ended` only when a chosen option
     runs out of graph. A node with NO OPTIONS AT ALL never gets chosen from, so
     it never reports anything: choose(0) on it returns the same view, forever.
     MEASURED ACROSS THE CORPUS: 21 of 236 talk nodes are terminal like that --
     the lineman's whole scene ends on one, "Splits somewhere past the dead
     storefronts. Warm cable." -- so the first version of this feature left that
     conversation OPEN FOR THE REST OF THE GAME. The scene never closed, the entry
     node was never locked, and the quest's address never moved on to the second
     person. None of the 21 pays anything today, so it is not a farm yet; it is a
     farm the day somebody writes one, and it was a visibly stuck quest already.
     A NODE WITH NOWHERE TO GO IS THE END OF THE CONVERSATION. */
  function atEnd(view) {
    if (!view) return true;
    if (view.ended) return true;
    return !((view.options || []).length);
  }

  var API = { nodeFor: nodeFor, openerFor: openerFor, close: close, closed: closed,
              atEnd: atEnd, VERSION: 'bohconv-1.1.0' };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  root.BohemiaConversation = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
