// BOHEMIA DIRECT BQ -- A QUEST AS ROWS HE CAN CHANGE, AND BACK AGAIN
// (9/12/26, QUESTS lane, [edit quests] DIRECT-COVERS-QUESTS)
//
// THE 8/12 LAW NAMES EIGHT VERBS for anything ordered -- SEE, ADD, DELETE, MOVE,
// RETARGET, RELOCATE, PLAY IT IMMEDIATELY, KEEP IT -- and its own test is one
// sentence: "where does he change this himself? If the answer is 'he tells me and
// I edit a file', the system is not shipped yet."
//
// MEASURED ON THE REAL ALPHA BEFORE A LINE WAS WRITTEN. A cutscene gets all eight.
// A quest gets SEE, DELETE, MOVE, RETARGET-a-choice and ADD-a-line, and:
//   - dirWhere() opens with `if(DIR_MODE!=='cutscene') return;` so a quest has no
//     WHERE control at all (measured: 1142 bytes of controls on a scene, 0 on a
//     quest)
//   - dirPlay() says it in the alpha's own words: "Quests do not play in here yet"
//   - and the ADD row offers + LINE, + CHOICE, + JOURNAL, so the thing that
//     decides how a quest ENDS -- is this ending a COMPLETE or a FAIL, how loud is
//     it, what does it pay -- was not in the tab at all
//
// *** AND THE REASON WAS HONEST, WHICH IS WHY THIS MODULE EXISTS. *** The old row
// reader says so itself: "Deliberately not a full parser -- a director does not
// need @DO effects, and pretending to edit something that DOES NOT ROUND-TRIP
// would be worse than not showing it." That was the right call with a lossy
// reader. So the fix is not to show more of a lossy thing: it is to make the rows
// LOSSLESS, and then everything else is allowed.
//
// WHAT THIS IS: one row per source line, each carrying its own line verbatim.
//   rows(text) -> rows        text(rows) -> source
// An untouched row serialises as the bytes it came from, so round-tripping a file
// nobody edited is byte-identical BY CONSTRUCTION rather than by care. A row he
// HAS edited is rebuilt from its fields, and the gate proves a forced rebuild of
// every row of every quest still parses and still validates through the real
// parser -- because a rebuilder that is only tested on the lines nobody touched is
// tested on nothing.
//
// WHY ONE ROW PER LINE AND NOT A TREE: MOVE. A director moves a stage and expects
// what belongs to it to come along. A flat list with a raw line each is the only
// shape where DELETE, MOVE and ADD are the same one-line operation they already
// are for a cutscene beat, which is the half of the tab that already works.
//
// WHAT IS DELIBERATELY NOT HERE
// - NO NEW LANGUAGE. Every field maps to a .bq line that already exists. If the
//   language cannot say it, this cannot edit it.
// - NO PRETTY PRINTER. A rebuilt line is not asked to reproduce the alignment of
//   the hand-written one. It is asked to parse and to mean the same thing, and
//   the gate checks that through bohemia_bq.js rather than by eye.
// - NO VALIDATION OF HIS TASTE. A quest he breaks is a quest he broke; the tab
//   shows him the parser's own complaint and never silently repairs it.
//
// REUSE CHECK: cooks no pixels, opens no bank, writes no save, moves nobody, and
// owns no parser of its own -- what it produces is fed to engine/bohemia_bq.js.
(function (root) {
  'use strict';
  var HASREQ = (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined');

  /* THE DIRECTOR-FACING KINDS. Everything else is carried and never shown, which
     is what makes "show him less" and "lose his file" different things. */
  var SHOWN = { stage: 1, log: 1, obj: 1, role: 1, talk: 1, say: 1, opt: 1 };


  /* *** EVERY ROW ALSO WEARS THE TAB'S OLD VOCABULARY, ON PURPOSE. ***
     The DIRECT tab has rendered quest rows as journal/objective/node/say/choice
     since 8/12 and that half of it WORKS: move, delete, edit the words, retarget
     a choice. Renaming the kinds would have meant rewriting the working half to
     ship the missing half, which is how a working thing gets broken by a feature.
     So a row carries both: `k` is what it is in the file, `kind` is what the tab
     has always called it, and a row the tab must carry but never show (a @DO, a
     comment, a blank) gets no kind at all. */
  var KIND = { stage: 'stage', log: 'journal', obj: 'objective', role: 'role',
               talk: 'node', say: 'say', opt: 'choice' };

  function rows(text) {
    var lines = String(text).replace(/\r\n/g, '\n').split('\n');
    var out = [], stage = null, node = null, m;
    for (var i = 0; i < lines.length; i++) {
      var raw = lines[i], r = { k: 'keep', raw: raw, line: i + 1 };

      if ((m = /^@STAGE\s+(\d+)(.*)$/.exec(raw))) {
        var restS = m[2] || '';
        stage = m[1];
        r = { k: 'stage', raw: raw, line: i + 1, n: m[1],
              outcome: (/\bCOMPLETE\b/.test(restS) ? 'COMPLETE'
                      : /\bFAIL\b/.test(restS) ? 'FAIL' : ''),
              clout: (/#([A-Za-z0-9_]+)/.exec(restS) || [null, ''])[1] };
      } else if ((m = /^(\s*)@LOG\s+(.*?)\s*$/.exec(raw))) {
        r = { k: 'log', raw: raw, line: i + 1, pad: m[1], text: m[2], stage: stage };
      } else if ((m = /^(\s*)@DO\s+(.*?)\s*$/.exec(raw))) {
        r = { k: 'do', raw: raw, line: i + 1, pad: m[1], text: m[2], stage: stage };
      } else if ((m = /^@OBJ\s+(\d+)\s+"([^"]*)"(.*)$/.exec(raw))) {
        r = { k: 'obj', raw: raw, line: i + 1, n: m[1], text: m[2], rest: m[3] || '' };
      } else if ((m = /^@ROLE\s+(\S+)\s+(\S+)\s*(.*?)\s*$/.exec(raw))) {
        r = { k: 'role', raw: raw, line: i + 1, name: m[1], req: m[2], cond: m[3] };
      } else if ((m = /^@TALK\s+(\S+)\s*(.*?)\s*$/.exec(raw))) {
        node = m[1];
        r = { k: 'talk', raw: raw, line: i + 1, id: m[1], rest: m[2] };
      } else if ((m = /^(\s*)@SAY\s+(.*?)\s*$/.exec(raw))) {
        var body = m[2], tone = (/(?:^|\s)#([A-Za-z0-9_]+)\s*$/.exec(body) || [null, ''])[1];
        r = { k: 'say', raw: raw, line: i + 1, pad: m[1], node: node,
              text: body.replace(/(?:^|\s)#[A-Za-z0-9_]+\s*$/, ''), tone: tone };
      } else if ((m = /^(\s*)@OPT\s+(.*?)\s*$/.exec(raw))) {
        r = optRow(m[1], m[2], raw, i + 1, node);
      }
      r.kind = KIND[r.k] || '';
      out.push(r);
    }
    return out;
  }

  /* @OPT is the one line with real shape in it, and it is the line a director
     changes most, because it is where a choice LEADS. */
  function optRow(pad, body, raw, line, node) {
    var q = /^"([^"]*)"/.exec(body), p = /^\(([^)]*)\)/.exec(body);
    var gate = (/\[gate:\s*([^\]]*)\]/.exec(body) || [null, 'none'])[1].trim();
    var goto_ = (/->\s*(\S+)/.exec(body) || [null, ''])[1];
    var dos = (/->\s*\S+\s+@DO\s+(.*?)\s*$/.exec(body) || [null, ''])[1];
    return { k: 'opt', raw: raw, line: line, pad: pad, node: node,
             text: q ? q[1] : (p ? p[1] : body),
             paren: !q && !!p, silence: /\bSILENCE\b/.test(body),
             trap: /\bTRAP\b/.test(body),
             gate: gate, goto: goto_, dos: dos };
  }

  /* ---- BACK TO SOURCE ---------------------------------------------------- */

  /* AN UNTOUCHED ROW GIVES BACK ITS OWN BYTES. That is the whole guarantee: a
     file nobody edited round-trips exactly, and only the lines he actually
     changed are ever rebuilt. */
  function lineOf(r) {
    if (!r) return '';
    if (!r.edited) return r.raw;
    return build(r);
  }

  function build(r) {
    var pad = r.pad != null ? r.pad : '  ';
    switch (r.k) {
      case 'stage':
        return '@STAGE ' + r.n
             + (r.outcome ? ' ' + r.outcome : '')
             + (r.clout ? ' #' + r.clout : '');
      case 'log':  return pad + '@LOG ' + r.text;
      case 'do':   return pad + '@DO ' + r.text;
      case 'obj':  return '@OBJ ' + r.n + '  "' + r.text + '"' + (r.rest || '');
      case 'role': return '@ROLE ' + r.name + '  ' + r.req + (r.cond ? '  ' + r.cond : '');
      case 'talk': return '@TALK ' + r.id + (r.rest ? '  ' + r.rest : '');
      case 'say':  return pad + '@SAY ' + r.text + (r.tone ? ' #' + r.tone : '');
      case 'opt':  return buildOpt(r, pad);
      default:     return r.raw;
    }
  }

  function buildOpt(r, pad) {
    var s = pad + '@OPT ' + (r.paren ? '(' + r.text + ')' : '"' + r.text + '"');
    s += '  [gate: ' + (r.gate || 'none') + ']';
    if (r.trap) s += '  TRAP';
    if (r.silence) s += '  SILENCE';
    if (r.goto) s += '  -> ' + r.goto;
    if (r.dos) s += '  @DO ' + r.dos;
    return s;
  }

  function text(rs) {
    var out = [];
    for (var i = 0; i < rs.length; i++) out.push(lineOf(rs[i]));
    return out.join('\n');
  }

  /* ---- THE THINGS A DIRECTOR ADDS ---------------------------------------- */

  /* NEW ROWS ARE BORN EDITED, so they are built rather than echoed, and they are
     born draft:true in spirit -- the words are placeholders he overwrites. */
  function newStage(n)  { return { k: 'stage', edited: true, raw: '', n: String(n), outcome: '', clout: '' }; }
  function newLog(t)    { return { k: 'log',   edited: true, raw: '', pad: '  ', text: t || 'What just happened.' }; }
  function newObj(n, t) { return { k: 'obj',   edited: true, raw: '', n: String(n), text: t || 'Do the thing', rest: '' }; }
  function newSay(t)    { return { k: 'say',   edited: true, raw: '', pad: '  ', text: t || 'New line.', tone: '' }; }
  function newOpt(t)    { return { k: 'opt',   edited: true, raw: '', pad: '  ', text: t || 'New choice.',
                                   paren: false, silence: false, trap: false, gate: 'none', goto: '', dos: '' }; }
  function newDo(t)     { return { k: 'do',    edited: true, raw: '', pad: '  ', text: t || 'set_flag something' }; }

  /* THE NEXT FREE STAGE NUMBER AND THE NEXT FREE OBJECTIVE, read off his own file
     rather than counted, so adding one to a quest whose stages are 10/20/30/31
     lands somewhere that makes sense instead of at 5. */
  function nextStage(rs) {
    var hi = 0;
    for (var i = 0; i < rs.length; i++) if (rs[i].k === 'stage') hi = Math.max(hi, parseInt(rs[i].n, 10) || 0);
    return hi ? hi + 1 : 10;
  }
  function nextObj(rs) {
    var hi = 0;
    for (var i = 0; i < rs.length; i++) if (rs[i].k === 'obj') hi = Math.max(hi, parseInt(rs[i].n, 10) || 0);
    return hi ? hi + 10 : 10;
  }

  /* WHAT A STAGE PAYS, AS ONE ANSWER, because [haggling works] made the pay line
     a thing the game says out loud and a director who cannot change it is reading
     a receipt somebody else wrote. Reads and writes the stage's own @DO pay line. */
  function payOf(rs, i) {
    for (var j = i + 1; j < rs.length && rs[j].k !== 'stage'; j++) {
      if (rs[j].k !== 'do') continue;
      var m = /^pay\s+(\S+)\s+(\S+)/.exec(rs[j].text || '');
      if (m) return { currency: m[1], amount: m[2], at: j };
    }
    return null;
  }

  /* SETTING IT IS AN EDIT TO HIS FILE AND NOTHING ELSE: no new verb, no second
     table. '' takes the pay line away, and EVERYTHING COSTS ONE means the amount
     is not a control at all. */
  function setPay(rs, i, currency) {
    var had = payOf(rs, i);
    if (!currency) { if (had) rs.splice(had.at, 1); return rs; }
    if (had) { rs[had.at].text = 'pay ' + currency + ' 1'; rs[had.at].edited = true; return rs; }
    var at = i + 1;
    while (at < rs.length && rs[at].k === 'log') at++;
    rs.splice(at, 0, newDo('pay ' + currency + ' 1'));
    return rs;
  }

  var API = {
    SHOWN: SHOWN, rows: rows, text: text, lineOf: lineOf, build: build,
    newStage: newStage, newLog: newLog, newObj: newObj, newSay: newSay,
    newOpt: newOpt, newDo: newDo,
    nextStage: nextStage, nextObj: nextObj, payOf: payOf, setPay: setPay
  };
  if (HASREQ) module.exports = API; else root.BohemiaDirectBQ = API;
})(typeof globalThis !== 'undefined' ? globalThis : this);
