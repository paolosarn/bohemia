#!/usr/bin/env python3
"""BOHEMIA WORDS BOOK -- every word in the game, in one place he can edit.

WHY THIS EXISTS (Paolo 8/11, LOCKED):
  "I HAVE A WHOLE 170 QUEST FILE WITH DIALOGUE I DONT HAVE TIME TO APPROVE THE
   DIALOGUE THIS SLOW LIKE THIS I WILL EDIT IT LATER JUST DIALOGUE ALWAYS REFER
   TO THE BEST QUESTS EVER CATALOGUE"

He took dialogue OFF the approval queue and said he will edit it later. "Later"
is only real if there is a place where later happens. He does not dig in files
(CLAUDE.md, first section), so a line living in quests/bq/S07_SAY_IT_BACK.bq or
records/BOHEMIA_SCENE_*.json is a line he cannot edit, and the rule would rot
into "Claude writes the dialogue", which is NOT what he said.

So this harvests EVERY authored player-facing line in the repo and bakes the
WORDS tab: speaker, source, the catalogue citation underneath, editable in
place, export as .txt.

WHY IT BAKES INSTEAD OF FETCHING: _config.yml publishes slices/ + engine/ +
records/target ONLY. A page that fetched records/BOHEMIA_WORDS_BOOK.json would
work perfectly on disk and 404 in production -- the exact failure mode that
config file was written to stop. The payload is inlined.

  python3 tools/bohemia_words_book.py

Writes: records/BOHEMIA_WORDS_BOOK.json   (the machine copy, for the gate)
        slices/BOHEMIA_WORDS_CURRENT.html (the WORDS tab, payload inlined)

Law:  laws/BOHEMIA_ADDENDUM_DIALOGUE_REFERS_TO_THE_CATALOGUE_8_11_26.md
Gate: gates/dialogue_catalogue_gate.js
"""
import hashlib
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BQ_DIR = os.path.join(ROOT, 'quests', 'bq')
RECORDS = os.path.join(ROOT, 'records')
IDX_PATH = os.path.join(RECORDS, 'BOHEMIA_QUESTBOOK_LAW_INDEX.json')
OUT_JSON = os.path.join(RECORDS, 'BOHEMIA_WORDS_BOOK.json')
OUT_HTML = os.path.join(ROOT, 'slices', 'BOHEMIA_WORDS_CURRENT.html')


def load_index():
    if not os.path.exists(IDX_PATH):
        sys.exit('missing ' + IDX_PATH + ' -- run python3 tools/bohemia_questbook_index.py')
    with open(IDX_PATH, 'r', encoding='utf-8') as f:
        return json.load(f)


# ---------------------------------------------------------------- .bq quests
STUDY_RE = re.compile(r'^#\s*@STUDY\s+(Q\d+\.[A-Z]+\d+)\s+(.*?)\s*$')
APPLIED_RE = re.compile(r'^#\s*applied:\s*(.*?)\s*$')
TALK_RE = re.compile(r'^@TALK\s+(\S+)(.*)$')
SPEAKER_RE = re.compile(r'speaker=(\S+)')
SAY_RE = re.compile(r'^\s*@SAY\s+(.*?)\s*$')
OPT_RE = re.compile(r'^\s*@OPT\s+(.*?)\s*$')
LOG_RE = re.compile(r'^\s*@LOG\s+(.*?)\s*$')
OBJ_RE = re.compile(r'^@OBJ\s+(\d+)\s+"([^"]*)"')
QUEST_RE = re.compile(r'^@QUEST\s+(\S+)\s+(.*?)\s*$')
STAGE_RE = re.compile(r'^@STAGE\s+(\d+)')
TAG_RE = re.compile(r'\s+#[a-z_]+\s*$')


def strip_tag(s):
    """@SAY lines carry a trailing mood tag (#tired). It is direction, not words."""
    m = TAG_RE.search(s)
    return (TAG_RE.sub('', s), m.group(0).strip()[1:] if m else None)


def parse_bq(path):
    """One quest file -> its citations and every player-facing line in it."""
    with open(path, 'r', encoding='utf-8') as f:
        lines = f.read().split('\n')

    cites, out = [], []
    quest_id = quest_title = None
    node = speaker = None
    stage = None
    pending_cite = None

    for i, raw in enumerate(lines):
        m = STUDY_RE.match(raw)
        if m:
            pending_cite = {'id': m.group(1), 'title': m.group(2), 'applied': ''}
            cites.append(pending_cite)
            continue
        m = APPLIED_RE.match(raw)
        if m and pending_cite is not None:
            pending_cite['applied'] = m.group(1)
            pending_cite = None
            continue
        m = QUEST_RE.match(raw)
        if m:
            quest_id, quest_title = m.group(1), m.group(2)
            continue
        m = STAGE_RE.match(raw)
        if m:
            stage = m.group(1)
            continue
        m = TALK_RE.match(raw)
        if m:
            node = m.group(1)
            sp = SPEAKER_RE.search(m.group(2))
            speaker = sp.group(1) if sp else None
            continue

        m = SAY_RE.match(raw)
        if m:
            text, mood = strip_tag(m.group(1))
            out.append({'kind': 'say', 'speaker': speaker or 'unknown',
                        'node': node, 'text': text, 'mood': mood, 'line': i + 1})
            continue
        m = OPT_RE.match(raw)
        if m:
            body = m.group(1)
            q = re.match(r'"([^"]*)"', body)
            if q:
                text = q.group(1)
            else:
                p = re.match(r'\(([^)]*)\)', body)
                text = ('(' + p.group(1) + ')') if p else None
            if text:
                out.append({'kind': 'choice', 'speaker': 'PLAYER', 'node': node,
                            'text': text, 'line': i + 1})
            continue
        m = LOG_RE.match(raw)
        if m:
            out.append({'kind': 'journal', 'speaker': 'JOURNAL',
                        'node': ('stage ' + stage) if stage else None,
                        'text': m.group(1), 'line': i + 1})
            continue
        m = OBJ_RE.match(raw)
        if m:
            out.append({'kind': 'objective', 'speaker': 'OBJECTIVE',
                        'node': 'obj ' + m.group(1), 'text': m.group(2), 'line': i + 1})

    rel = os.path.relpath(path, ROOT).replace(os.sep, '/')
    for n, e in enumerate(out):
        e['id'] = rel + '#' + str(e['line'])
        e['src'] = rel
        e['cites'] = cites          # .bq cites at the FILE level (QUEST STUDY LAW)
        e['citeLevel'] = 'file'
        e['title'] = quest_title or os.path.basename(path)
        e['questId'] = quest_id
        e['draft'] = True           # nothing in quests/bq has been through him yet
    return {'src': rel, 'title': quest_title or os.path.basename(path),
            'kind': 'quest', 'cites': cites, 'lines': out}


# ------------------------------------------------------------------- scenes
def parse_scene(path):
    with open(path, 'r', encoding='utf-8') as f:
        d = json.load(f)
    rel = os.path.relpath(path, ROOT).replace(os.sep, '/')
    out = []
    for b in d.get('beats', []):
        if b.get('kind') != 'say':
            continue
        out.append({
            'kind': 'say',
            'id': rel + '#' + str(b.get('id')),
            'src': rel,
            'beat': b.get('id'),
            'speaker': b.get('speaker') or 'unknown',
            'node': b.get('id'),
            'text': b.get('text') or '',
            'draft': b.get('draft') is True,
            'why': b.get('why') or '',
            'cites': b.get('study') or [],   # scenes cite PER LINE
            'citeLevel': 'line',
            'title': d.get('title') or d.get('id'),
        })
    return {'src': rel, 'title': d.get('title') or d.get('id'), 'kind': 'scene',
            'cites': [], 'lines': out}


# --------------------------------------------------------------------- bake
def sources():
    """EVERY dialogue-bearing artifact, DISCOVERED not listed. A hardcoded list
    is the thing that lets a lane invent a new dialogue file the machine never
    looks at, which is how a law stops being enforced without anybody noticing."""
    out = []
    if os.path.isdir(BQ_DIR):
        out += [os.path.join(BQ_DIR, f) for f in sorted(os.listdir(BQ_DIR)) if f.endswith('.bq')]
    out += [os.path.join(RECORDS, f) for f in sorted(os.listdir(RECORDS))
            if re.match(r'^BOHEMIA_SCENE_.*\.json$', f)]
    return out


def fingerprint(paths):
    """A hash of the SOURCE BYTES the book was baked from. The gate recomputes it
    off the same files: if a line was edited and the tool was not re-run, the
    baked WORDS tab is showing yesterday's words and that must be RED, not a
    thing somebody notices three weeks later."""
    h = hashlib.sha256()
    for p in paths:
        h.update(os.path.relpath(p, ROOT).replace(os.sep, '/').encode('utf-8'))
        h.update(b'\0')
        with open(p, 'rb') as f:
            h.update(f.read())
        h.update(b'\0')
    return h.hexdigest()[:16]


def harvest():
    books = []
    for p in sources():
        books.append(parse_bq(p) if p.endswith('.bq') else parse_scene(p))
    return books


def esc(s):
    return (s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;'))


HTML = r'''<!doctype html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover">
<title>BOHEMIA &mdash; WORDS</title>
<!-- GENERATED BY tools/bohemia_words_book.py. Do not hand-edit; re-run the tool.
     WHY THIS PAGE EXISTS: Paolo 8/11 took dialogue off the approval queue --
     "I DONT HAVE TIME TO APPROVE THE DIALOGUE THIS SLOW LIKE THIS I WILL EDIT
     IT LATER". Later needs a place. This is the place. Every authored line in
     the build, the catalogue law it was written from underneath it, editable
     in place, export as .txt.
     Payload is INLINED because _config.yml publishes slices/ only -- a fetch
     of records/ would 404 in production while working fine on disk. -->
<style>
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
html,body{margin:0;padding:0}
body{background:#0d0b09;color:#e8dfc8;font:14px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace;
     padding:0 0 90px;-webkit-text-size-adjust:100%}
body.sun{background:#f2ede1;color:#20180e}
header{position:sticky;top:0;z-index:9;background:#0d0b09;border-bottom:1px solid #2a2114;padding:10px 12px 8px}
body.sun header{background:#f2ede1;border-bottom-color:#c9bda4}
h1{margin:0;font-size:15px;letter-spacing:2px;color:#d8b45a}
body.sun h1{color:#8a6410}
.sub{font-size:11px;color:#8d8168;margin-top:3px;line-height:1.45}
body.sun .sub{color:#6a5f4a}
.bar{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px;align-items:center}
button,.chip{font:11px ui-monospace,monospace;letter-spacing:1px;background:#191308;color:#c8b98a;
  border:1px solid #3a3020;border-radius:4px;padding:6px 10px;cursor:pointer}
body.sun button,body.sun .chip{background:#e5dcc6;color:#3c3220;border-color:#bcae90}
.chip.on{background:#d8b45a;color:#191308;border-color:#d8b45a}
input[type=search]{flex:1;min-width:120px;font:12px ui-monospace,monospace;background:#120e07;color:#e8dfc8;
  border:1px solid #3a3020;border-radius:4px;padding:6px 9px}
body.sun input[type=search]{background:#fff;color:#20180e;border-color:#bcae90}
.grp{margin:14px 10px 0;border:1px solid #241c12;border-radius:6px;overflow:hidden}
body.sun .grp{border-color:#cfc2a6}
.ghd{background:#141009;padding:7px 10px;font-size:11px;letter-spacing:1px;color:#d8b45a;
  display:flex;justify-content:space-between;gap:8px;cursor:pointer}
body.sun .ghd{background:#e8e0cc;color:#8a6410}
.gsrc{color:#6d6350;font-size:10px;letter-spacing:0}
body.sun .gsrc{color:#7d7460}
.ln{border-top:1px solid #1d1710;padding:9px 10px}
body.sun .ln{border-top-color:#d9cdb2}
.who{font-size:10px;letter-spacing:1px;color:#9a8a5e;display:flex;gap:6px;flex-wrap:wrap;align-items:center}
body.sun .who{color:#7a6a3e}
.k{border:1px solid #3a3020;border-radius:3px;padding:1px 5px;font-size:9px;color:#8d8168}
body.sun .k{border-color:#bcae90;color:#6a5f4a}
.k.choice{color:#7fb3d5;border-color:#2f4a5c}
.k.journal{color:#b08a5a;border-color:#4a3a22}
.k.objective{color:#8ab07f;border-color:#31462c}
.tx{width:100%;margin-top:5px;font:14px/1.55 ui-monospace,monospace;background:#120e07;color:#e8dfc8;
  border:1px solid #2b2317;border-radius:4px;padding:8px 9px;resize:vertical;min-height:44px;display:block}
body.sun .tx{background:#fff;color:#20180e;border-color:#c9bda4}
.tx.edited{border-color:#d8b45a;background:#1a1408}
body.sun .tx.edited{background:#fff8e2;border-color:#c69a20}
.whybtn{display:block;width:100%;text-align:left;border:0;border-top:1px solid #1d1710;border-radius:0;
  background:#100c06;color:#7d7157;padding:6px 10px;font-size:10px;letter-spacing:1px}
body.sun .whybtn{background:#ece4d0;border-top-color:#d9cdb2;color:#7a6a4a}
.bookcite{padding:2px 10px 8px;background:#100c06;border-top:1px solid #1d1710;display:none}
body.sun .bookcite{background:#ece4d0;border-top-color:#d9cdb2}
.bookcite.open{display:block}
.bookcite .cite{margin-top:0;margin-bottom:5px}
.bookcite .cite:last-child{margin-bottom:0}
.cite{margin-top:5px;font-size:10.5px;line-height:1.5;color:#6f6552}
body.sun .cite{color:#6a5f4a}
.cite b{color:#9a8a5e;font-weight:400}
body.sun .cite b{color:#8a6410}
.nocite{color:#c8683a}
footer{position:fixed;left:0;right:0;bottom:0;background:#0d0b09;border-top:1px solid #2a2114;
  padding:9px 12px calc(9px + env(safe-area-inset-bottom));display:flex;gap:8px;align-items:center;z-index:10}
body.sun footer{background:#f2ede1;border-top-color:#c9bda4}
#cnt{font-size:11px;color:#8d8168;flex:1}
body.sun #cnt{color:#6a5f4a}
#exp{background:#d8b45a;color:#191308;border-color:#d8b45a;font-weight:700}
.note{margin:12px 10px 0;padding:9px 10px;border:1px dashed #3a3020;border-radius:6px;font-size:11px;
  line-height:1.55;color:#8d8168}
body.sun .note{border-color:#bcae90;color:#6a5f4a}
</style></head><body>
<header>
  <h1>WORDS</h1>
  <div class="sub">Every line in the build. Retype anything. It saves as you go and survives a reload.
    Under each line is the quest from the catalogue it was written off, so you can see what it was going for.
    Hit EXPORT when you are done and send me the file.</div>
  <div class="bar">
    <button class="chip" data-f="all">ALL</button>
    <button class="chip" data-f="say">SPOKEN</button>
    <button class="chip" data-f="choice">YOUR REPLIES</button>
    <button class="chip" data-f="journal">JOURNAL</button>
    <button class="chip" data-f="edited">EDITED</button>
    <input type="search" id="q" placeholder="search words, speaker, quest">
    <button id="sun">SUN</button>
  </div>
</header>
<div id="list"></div>
<div class="note">Nothing here needs your approval. It ships as written and you change whatever you
  want, whenever you want. If a line is wrong, just fix it in the box.<br><br>
  The four lines from THE MATCH-CUT OPEN are the ones you hear in the <b>STORY</b> tab,
  where the cold open plays.</div>
<footer><span id="cnt"></span><button id="exp">EXPORT .TXT</button></footer>
<script>
/* SOURCE FINGERPRINT __FINGERPRINT__ over __LINECOUNT__ lines -- sha256 of the
   exact source bytes this page was baked from. gates/dialogue_catalogue_gate.js
   recomputes it off quests/bq + records/BOHEMIA_SCENE_*.json, so an edited line
   that never reached this tab goes RED instead of silently disappearing. */
var WORDS_FINGERPRINT = '__FINGERPRINT__';
var BOOK = __PAYLOAD__;
var KEY = 'bohemia_words_edits_v1';
var edits = {}; try { edits = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { edits = {}; }
var filter = 'all', qs = '';

function save() { try { localStorage.setItem(KEY, JSON.stringify(edits)); } catch (e) {} }

function matches(l, b) {
  if (filter === 'edited') { if (!(l.id in edits)) return false; }
  else if (filter !== 'all' && l.kind !== filter) return false;
  if (!qs) return true;
  var hay = (l.text + ' ' + l.speaker + ' ' + b.title + ' ' + (l.node || '')).toLowerCase();
  return hay.indexOf(qs) >= 0;
}

/* A scene cites PER LINE; a .bq cites once for the whole quest and its lines
   inherit that -- same law, different grain. So the quest's citations print
   ONCE under its header instead of 40 times down the page. */
function citeHtml(c, cls) {
  if (!c || !c.length) return '<div class="cite nocite">no catalogue citation</div>';
  return c.map(function (x) {
    return '<div class="cite' + (cls ? ' ' + cls : '') + '"><b>' + x.id + ' &middot; ' + x.title +
      '</b>' + (x.applied ? '<br>' + x.applied : '') + '</div>';
  }).join('');
}

function render() {
  var host = document.getElementById('list'); host.innerHTML = '';
  var shown = 0, edited = 0, total = 0;
  BOOK.forEach(function (b) {
    total += b.lines.length;
    var hit = b.lines.filter(function (l) { return matches(l, b); });
    if (!hit.length) return;
    var g = document.createElement('div'); g.className = 'grp';
    g.innerHTML = '<div class="ghd"><span>' + b.title + '</span><span class="gsrc">' +
      hit.length + ' / ' + b.lines.length + ' &middot; ' + b.src + '</span></div>' +
      /* the quest's citations fold away by default: he came here for the WORDS,
         and four laws stacked above every quest pushes the first line off the
         screen. One tap opens them. */
      (b.cites && b.cites.length
        ? '<button class="whybtn">WHY THESE WORDS &middot; ' + b.cites.length +
          ' from the catalogue &#9656;</button><div class="bookcite">' + citeHtml(b.cites) + '</div>'
        : '');
    var wb = g.querySelector('.whybtn');
    if (wb) wb.addEventListener('click', function () {
      var box = g.querySelector('.bookcite'), on = box.classList.toggle('open');
      wb.innerHTML = 'WHY THESE WORDS &middot; ' + b.cites.length + ' from the catalogue ' +
        (on ? '&#9662;' : '&#9656;');
    });
    hit.forEach(function (l) {
      shown++;
      var d = document.createElement('div'); d.className = 'ln';
      var kc = l.kind === 'choice' ? ' choice' : l.kind === 'journal' ? ' journal'
        : l.kind === 'objective' ? ' objective' : '';
      d.innerHTML = '<div class="who"><span class="k' + kc + '">' + l.kind + '</span>' +
        '<span>' + l.speaker + '</span>' + (l.node ? '<span class="gsrc">' + l.node + '</span>' : '') + '</div>';
      var t = document.createElement('textarea');
      t.className = 'tx' + ((l.id in edits) ? ' edited' : '');
      t.value = (l.id in edits) ? edits[l.id] : l.text;
      t.rows = 1;
      t.addEventListener('input', function () {
        if (t.value === l.text) { delete edits[l.id]; t.className = 'tx'; }
        else { edits[l.id] = t.value; t.className = 'tx edited'; }
        save(); count();
        t.style.height = 'auto'; t.style.height = (t.scrollHeight + 2) + 'px';
      });
      d.appendChild(t);
      if (l.cites && l.cites.length) d.insertAdjacentHTML('beforeend', citeHtml(l.cites));
      g.appendChild(d);
      setTimeout(function () { t.style.height = 'auto'; t.style.height = (t.scrollHeight + 2) + 'px'; }, 0);
    });
    host.appendChild(g);
  });
  for (var k in edits) edited++;
  document.getElementById('cnt').textContent =
    shown + ' of ' + total + ' lines' + (edited ? ' · ' + edited + ' edited' : '');
}
function count() {
  var edited = 0; for (var k in edits) edited++;
  var c = document.getElementById('cnt');
  c.textContent = c.textContent.replace(/ · \d+ edited$/, '') + (edited ? ' · ' + edited + ' edited' : '');
}

document.querySelectorAll('.chip').forEach(function (b) {
  b.addEventListener('click', function () {
    document.querySelectorAll('.chip').forEach(function (x) { x.classList.remove('on'); });
    b.classList.add('on'); filter = b.dataset.f; render();
  });
});
document.querySelector('.chip').classList.add('on');
document.getElementById('q').addEventListener('input', function (e) {
  qs = e.target.value.toLowerCase().trim(); render();
});
document.getElementById('sun').addEventListener('click', function () {
  document.body.classList.toggle('sun');
  try { localStorage.setItem('bohemia_words_sun', document.body.classList.contains('sun') ? '1' : '0'); } catch (e) {}
});
try { if (localStorage.getItem('bohemia_words_sun') === '1') document.body.classList.add('sun'); } catch (e) {}

document.getElementById('exp').addEventListener('click', function () {
  var n = 0, out = ['BOHEMIA -- WORDS, EDITED BY PAOLO', ''];
  BOOK.forEach(function (b) {
    var hit = b.lines.filter(function (l) { return l.id in edits; });
    if (!hit.length) return;
    out.push('=== ' + b.title + '  [' + b.src + '] ===');
    hit.forEach(function (l) {
      n++;
      out.push('  LINE ' + l.id);
      out.push('  SPEAKER ' + l.speaker + (l.node ? '  NODE ' + l.node : ''));
      out.push('  WAS  ' + l.text);
      out.push('  NOW  ' + edits[l.id]);
      out.push('');
    });
    out.push('');
  });
  out.splice(1, 0, n + ' line(s) rewritten. Everything not listed is unchanged.', '');
  var blob = new Blob([out.join('\n')], { type: 'text/plain' });
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'BOHEMIA_WORDS_EDITS.txt';
  a.click();
});
render();
</script></body></html>
'''


def main():
    idx = load_index()
    laws = idx['laws']
    srcs = sources()
    fp = fingerprint(srcs)
    books = harvest()

    lines = sum(len(b['lines']) for b in books)
    cited = 0
    for b in books:
        for l in b['lines']:
            if l.get('cites'):
                cited += 1

    # the machine copy the gate reads
    payload = {
        '_meta': {
            'what': 'Every authored player-facing line in Bohemia, with the questbook '
                    'catalogue laws each was written from.',
            'why': 'DIALOGUE ALWAYS REFERS TO THE CATALOGUE (Paolo 8/11, LOCKED). He does '
                   'not approve dialogue; he edits it later, and later happens in the '
                   'WORDS tab this file bakes.',
            'generator': 'tools/bohemia_words_book.py',
            'sources': len(books),
            'lines': lines,
            'cited': cited,
            'fingerprint': fp,
            'index': 'records/BOHEMIA_QUESTBOOK_LAW_INDEX.json (%d laws)' % len(laws),
        },
        'books': books,
    }
    with open(OUT_JSON, 'w', encoding='utf-8') as f:
        json.dump(payload, f, indent=1, ensure_ascii=False)

    # The surface he taps -- payload INLINED, never fetched (see docstring).
    # A .bq cites at the FILE level, so its citations are written ONCE on the
    # book and inherited by its lines. Copying them onto all 373 @SAY lines
    # tripled the page for zero information; the reader falls back to b.cites.
    def cite(c):
        return {'id': c['id'], 'title': c['title'], 'applied': c.get('applied', '')}

    slim = []
    for b in books:
        if not b['lines']:
            continue
        per_line = b['lines'][0].get('citeLevel') == 'line'
        slim.append({
            'src': b['src'], 'title': b['title'], 'kind': b['kind'],
            'cites': [] if per_line else [cite(c) for c in b['cites']],
            'lines': [{'id': l['id'], 'kind': l['kind'], 'speaker': l['speaker'],
                       'node': l.get('node'), 'text': l['text'],
                       'cites': [cite(c) for c in (l.get('cites') or [])] if per_line else []}
                      for l in b['lines']],
        })
    html = (HTML.replace('__PAYLOAD__', json.dumps(slim, ensure_ascii=False))
                .replace('__FINGERPRINT__', fp)
                .replace('__LINECOUNT__', str(lines)))
    with open(OUT_HTML, 'w', encoding='utf-8') as f:
        f.write(html)

    print('WORDS BOOK: %d lines across %d sources (%d carry a catalogue citation)'
          % (lines, len(books), cited))
    print('  source fingerprint %s' % fp)
    print('  -> ' + os.path.relpath(OUT_JSON, ROOT))
    print('  -> ' + os.path.relpath(OUT_HTML, ROOT) + '  (%.0f KB)' % (len(html) / 1024.0))


if __name__ == '__main__':
    main()
