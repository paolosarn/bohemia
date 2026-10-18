#!/usr/bin/env node
/* ============================================================================
   THE ALLOW LIST GATE -- THE APPROVAL SCREENS NEVER COME BACK BY DRIFT
   (10/18/26, PLUMBER lane, VAMILY row [the allow list gate]; rule 111(d), amended 10/17;
   Paolo 10/16: "you put me through like 14 approval screens... we gotta have a system set up
   to where it just gonna happen"; Paolo 10/17: "stop asking me to approve it and just do it")

   WHAT HAPPENED: rule 111 opened twenty-two lane sessions and one routine through the session
   tools, and every call asked him on his screen, because .claude/settings.json carried no
   permission at all. The list was written 10/16 and widened to EVERYTHING 10/17. Nothing held it:
   one bad comma and every chat opened after that commit asks him again, silently.

   WHAT THIS ROUND FOUND (the reason A3 exists): the list names the session tools under two
   server spellings, mcp__Claude_Code_Remote__ and mcp__claude-code-remote__, and the cloud
   container this lane ran in on 10/18 exposes the same server as
   mcp__bf7c680d-5fdc-5ef4-b4a0-abadb619bf0a__ (a name-derived UUID, version 5, so the same in
   every container). A permission rule matches the tool's full name, so neither spelling covered
   one call the coordinator makes. A3 holds every spelling a container has been seen to use.

   THE LEGS
     A1  the file parses and carries permissions.allow and permissions.deny as arrays of strings.
     A2  THE CORE: every shell command (Bash or Bash(*)), the file tools, web search and fetch,
         the sub-agent tool (rule 111(d) amended 10/17: THE ALLOW LIST IS EVERYTHING).
     A3  THE COORDINATOR'S TOOLS: every session and routine tool rule 111(a)-(b) and rule 112(b)
         use (open, read, tag, title, interrupt, archive, unarchive a lane; create, update,
         delete, fire, read, list a routine; send_later; list environments), covered under EVERY
         server spelling in SPELLINGS, by the exact name, mcp__<server>, or mcp__<server>__*.
     A4  THE GITHUB READS the deploy check needs (actions_list, actions_get, get_job_logs) and
         the commit and file reads.
     A5  THE DENIES: wiping the disk and a forced push to main (both -f and --force) are denied.
     A6  NO DENY SHADOWS AN ALLOW the rule needs (deny wins over allow in the app, so a deny on a
         required tool is the same as the tool missing).
     S1-S5  SELF-TESTS on planted files, both ways: the real shape passes; a file with a trailing
         comma fails A1; a list missing create_session under the container's spelling fails A3;
         a list with no force-push deny fails A5; a deny of Bash(*) fails A6.

   RED CASE: S2-S5 above, planted every run; and on 10/18 the real file before PLUMBER added the
   container's spelling was red on A3 with 26 tools named (16 under the container spelling, 10 under claude-code-remote).

   CONSTRAINT (the row's): this gate READS the file. It never writes it.

     node gates/allow_list_gate.js
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.dirname(__dirname);
const FILE = path.join(ROOT, '.claude/settings.json');

/* every spelling of the session-and-routine server a container has been seen to expose.
   Add a spelling here the round a container shows a new one; never remove one. */
const SPELLINGS = [
  'claude-code-remote',                          /* the name the system prompt uses */
  'bf7c680d-5fdc-5ef4-b4a0-abadb619bf0a',        /* the cloud container, seen 10/18 */
];
const SESSION_TOOLS = [
  'create_session', 'get_session', 'list_sessions', 'archive_session', 'unarchive_session',
  'set_session_tags', 'set_session_title', 'interrupt_session',
  'create_trigger', 'update_trigger', 'delete_trigger', 'fire_trigger', 'get_trigger',
  'list_triggers', 'send_later', 'list_environments',
];
const CORE = ['Read', 'Edit', 'Write', 'Glob', 'Grep', 'WebSearch', 'WebFetch', 'Agent'];
const GITHUB_READS = ['actions_list', 'actions_get', 'get_job_logs', 'list_commits', 'get_commit',
  'get_file_contents'];

function covered(list, server, tool) {
  const full = 'mcp__' + server + '__' + tool;
  return list.includes(full) || list.includes('mcp__' + server) || list.includes('mcp__' + server + '__*');
}
function bashAll(list) { return list.includes('Bash') || list.includes('Bash(*)'); }

/* returns [{leg, ok, why}] for one file's text */
function check(text) {
  const out = [];
  const leg = (n, c, why) => out.push({ leg: n, ok: !!c, why: c ? '' : why });
  let j;
  try { j = JSON.parse(text); } catch (e) { leg('A1 parses', false, 'does not parse: ' + e.message); return out; }
  const p = j && j.permissions;
  const isStrs = a => Array.isArray(a) && a.every(x => typeof x === 'string');
  if (!p || !isStrs(p.allow) || !isStrs(p.deny)) {
    leg('A1 parses', false, 'permissions.allow and permissions.deny must be arrays of strings');
    return out;
  }
  leg('A1 parses', true);
  const allow = p.allow, deny = p.deny;

  const coreMissing = CORE.filter(t => !allow.includes(t));
  if (!bashAll(allow)) coreMissing.unshift('Bash(*)');
  leg('A2 the core (every shell command, file tools, web, agents)', !coreMissing.length,
    'missing: ' + coreMissing.join(', '));

  const miss = [];
  for (const s of SPELLINGS) for (const t of SESSION_TOOLS) if (!covered(allow, s, t)) miss.push('mcp__' + s + '__' + t);
  leg('A3 the coordinator\'s session and routine tools, every spelling (' + SPELLINGS.length + ' x ' +
    SESSION_TOOLS.length + ')', !miss.length, miss.length + ' missing: ' + miss.slice(0, 6).join(', ') +
    (miss.length > 6 ? ', ...' : ''));

  const gh = GITHUB_READS.filter(t => !covered(allow, 'github', t));
  leg('A4 the GitHub reads the deploy check needs', !gh.length, 'missing: ' + gh.map(t => 'mcp__github__' + t).join(', '));

  const wipe = deny.some(d => /^Bash\(rm -rf \/\*?\)$/.test(d));
  const fForce = deny.some(d => /^Bash\(git push -f origin main\*?\)$/.test(d));
  const lForce = deny.some(d => /^Bash\(git push --force origin main\*?\)$/.test(d));
  leg('A5 the denies (wipe the disk; force push to main, -f and --force)', wipe && fForce && lForce,
    'missing deny: ' + [!wipe && 'Bash(rm -rf /*)', !fForce && 'Bash(git push -f origin main*)',
      !lForce && 'Bash(git push --force origin main*)'].filter(Boolean).join(', '));

  const needed = new Set(['Bash', 'Bash(*)', ...CORE]);
  for (const s of SPELLINGS) { needed.add('mcp__' + s); needed.add('mcp__' + s + '__*');
    for (const t of SESSION_TOOLS) needed.add('mcp__' + s + '__' + t); }
  for (const t of GITHUB_READS) needed.add('mcp__github__' + t);
  needed.add('mcp__github'); needed.add('mcp__github__*');
  const shadow = deny.filter(d => needed.has(d));
  leg('A6 no deny shadows a needed allow', !shadow.length, 'denied: ' + shadow.join(', '));
  return out;
}

let pass = 0, fail = 0;
const ok = (n, c, why) => { if (c) { pass++; console.log('  ok   ' + n); }
  else { fail++; console.log('  FAIL ' + n + (why ? '\n         ' + why : '')); } };

console.log('THE ALLOW LIST GATE -- .claude/settings.json (reads only)');
let real;
try { real = fs.readFileSync(FILE, 'utf8'); } catch (e) { real = null; }
if (real === null) ok('A0 the file exists', false, 'no .claude/settings.json: every tool call asks him');
else for (const r of check(real)) ok(r.leg, r.ok, r.why);

/* ---- self-tests, both ways, on planted files ------------------------------------------ */
const good = { permissions: {
  allow: ['Bash(*)', ...CORE, ...SPELLINGS.map(s => 'mcp__' + s), ...GITHUB_READS.map(t => 'mcp__github__' + t)],
  deny: ['Bash(rm -rf /*)', 'Bash(git push --force origin main*)', 'Bash(git push -f origin main*)'] } };
const allOk = rs => rs.every(r => r.ok);
const legFails = (rs, l) => rs.some(r => r.leg.startsWith(l) && !r.ok);
ok('S1 the planted good shape passes every leg', allOk(check(JSON.stringify(good))));
ok('S2 a trailing comma fails A1', legFails(check(JSON.stringify(good).replace(/\]\}\}$/, ',]}}')), 'A1'));
{ const g = JSON.parse(JSON.stringify(good));
  g.permissions.allow = g.permissions.allow.filter(x => x !== 'mcp__' + SPELLINGS[1]);
  g.permissions.allow.push(...SESSION_TOOLS.filter(t => t !== 'create_session').map(t => 'mcp__' + SPELLINGS[1] + '__' + t));
  const rs = check(JSON.stringify(g));
  ok('S3 create_session missing under the container\'s spelling fails A3, and only A3',
    legFails(rs, 'A3') && rs.filter(r => !r.ok).length === 1); }
{ const g = JSON.parse(JSON.stringify(good)); g.permissions.deny = g.permissions.deny.slice(0, 1);
  ok('S4 no force-push deny fails A5', legFails(check(JSON.stringify(g)), 'A5')); }
{ const g = JSON.parse(JSON.stringify(good)); g.permissions.deny.push('Bash(*)');
  ok('S5 a deny of Bash(*) fails A6', legFails(check(JSON.stringify(g)), 'A6')); }

console.log('\n' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
