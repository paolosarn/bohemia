/* ============================================================================
   WHAT GITHUB PAGES ACTUALLY PUBLISHES — the one resolver, 8/15/26 (RUN lane).

   Same shape as gates/bohemia_city_app.js, and it exists for the same reason.

   `_config.yml` decides which paths reach the live site. On 8/6 the WORLD lane
   wrote a parser for that exclude list INSIDE gates/pages_publish_gate.js,
   because at the time exactly one gate needed it. The demo gate now needs the
   same answer -- "would this file exist on the real link?" -- and there are only
   two ways to give it one:

     COPY THE PARSER, which is how this repo got the hand-written city path, the
     hand-written CITY_B64 regex and the hand-written /srcdoc/ frame test. Every
     one of those went stale the day somebody legitimately changed the thing it
     described, and the copies kept answering the old question confidently.

     SHARE IT, which is this file.

   USE IT LIKE THIS:

       const PAGES = require('./bohemia_pages_publish.js');
       const why = PAGES.excluded('banks/foo.png');   // the rule that drops it, or null
       if (why) fail('the demo loads a file Pages does not publish: ' + why);

   ONE KNOWN DUPLICATE, NAMED RATHER THAN LEFT QUIET: gates/pages_publish_gate.js
   still carries its own inline copy of this parser. It is the WORLD lane's file
   and another session is editing that lane today, so it is not being rewritten
   from here -- adopting this module is a one-line change and it is written into
   the handoff for whoever owns that gate next. Until then the two agree because
   this was lifted from it verbatim, and the moment they disagree that IS the bug
   this module exists to prevent.
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.dirname(__dirname);
const CONFIG = path.join(ROOT, '_config.yml');

/** The exclude entries, parsed out of _config.yml. No YAML dependency, because
 *  adding one to a gate is a way for the gate to stop running. */
function excludeList() {
  if (!fs.existsSync(CONFIG)) return null;          // null = cannot be answered
  const cfg = fs.readFileSync(CONFIG, 'utf8');
  const out = [];
  let inEx = false;
  for (const raw of cfg.split('\n')) {
    const line = raw.replace(/#.*$/, '').trimEnd();
    if (/^exclude:\s*$/.test(line)) { inEx = true; continue; }
    if (inEx) {
      const m = /^\s+-\s+(.+?)\s*$/.exec(line);
      if (!m) { if (line.trim() !== '') inEx = false; continue; }
      out.push(m[1].replace(/^"|"$/g, '').replace(/^'|'$/g, ''));
    }
  }
  return out;
}

/**
 * Would Pages drop this repo-relative path?
 * @param {string} p  repo-relative, forward slashes, no leading ./
 * @returns {string|null}  the exclude entry that drops it, or null if it ships
 */
function excluded(p) {
  const EX = excludeList();
  if (!EX) return null;
  for (const e of EX) {
    if (e.endsWith('/') && (p === e.slice(0, -1) || p.startsWith(e))) return e;
    if (e.startsWith('*.')) { if (!p.includes('/') && p.endsWith(e.slice(1))) return e; continue; }
    if (p === e || p.startsWith(e + '/')) return e;
  }
  return null;
}

/** Turn a file:// URL seen by a browser gate into a repo-relative path, or null
 *  if it points outside the repo entirely (a data: URI, a blob, an http host). */
function repoPath(url) {
  const u = String(url || '');
  if (!u.startsWith('file://')) return null;
  let abs;
  try { abs = decodeURIComponent(u.slice('file://'.length).split(/[?#]/)[0]); }
  catch (e) { return null; }
  const rel = path.relative(ROOT, abs);
  if (!rel || rel.startsWith('..') || path.isAbsolute(rel)) return null;
  return rel.split(path.sep).join('/');
}

module.exports = { excludeList, excluded, repoPath, CONFIG, ROOT };
