/* THE LIBRARY FETCHER TELLS THE TRUTH (PLUMBER, row [bb library], rule 33j)
   ================================================================================
   tools/bohemia_bb_library.js pulls the Battle Brothers wiki and the developers' blog
   to text. The real hosts are refused by this fleet's network policy (the proxy
   answers CONNECT with 403), so this gate proves the tool against a LOCAL STAND-IN
   that speaks the same two APIs -- MediaWiki's query API with continuation, and
   WordPress's REST posts endpoint with pages -- and never touches the real hosts.
   A gate that crawled somebody else's wiki on every suite run would be rude, slow,
   and would go red whenever their server hiccuped.

   The stand-in is this same file run with --serve, in its OWN process: the tool
   calls curl synchronously, so a server in the gate's own event loop would deadlock.

   WHAT IS HELD, each one a way the tool could otherwise lie:
     1. a full fetch writes every non-redirect page and every post, one file each
     2. wiki files carry source, revision and the CC BY-SA line
     3. BLOG FILES DO NOT CLAIM CC BY-SA and name whose they are (the row asked for the
        free-licence line on every file; on the blog that would be a false claim)
     4. two titles that sanitise to the same name BOTH survive
     5. a second run with nothing changed writes NOTHING (idempotent)
     6. one page's revision changes -> exactly ONE rewrite
     7. --max stops part way, and the rerun finishes WITHOUT rewriting what was done
     8. a host that cannot be reached -> exit 0, CANNOT REACH, names the host, writes
        nothing, and prints NO success count that could be read as a pass
     9. a host that answers but is not the API -> says so, fetches nothing from it,
        and does not guess
   ================================================================================ */
'use strict';
const fs = require('fs'), path = require('path'), os = require('os'), http = require('http');
const { spawn, spawnSync } = require('child_process');

/* ------------------------------ THE STAND-IN ------------------------------ */
if (process.argv.includes('--serve')) {
  const stateFile = process.env.BBL_STATE;
  const state = () => JSON.parse(fs.readFileSync(stateFile, 'utf8'));
  const srv = http.createServer((req, res) => {
    const u = new URL(req.url, 'http://x');
    const s = state();
    const json = (code, o) => { res.writeHead(code, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(o)); };
    if (u.pathname === '/api.php') {
      if (s.wikiBroken) { res.writeHead(200, { 'Content-Type': 'text/html' }); return res.end('<html>a landing page</html>'); }
      const q = Object.fromEntries(u.searchParams);
      if (q.meta === 'siteinfo') return json(200, { query: { general: { sitename: 'Stand-in Wiki' } } });
      if (q.generator === 'allpages') {
        const all = s.pages.filter(p => !p.redirect).sort((a, b) => a.title < b.title ? -1 : 1);
        const from = q.gapcontinue ? all.findIndex(p => p.title === q.gapcontinue) : 0;
        const lim = +q.gaplimit || 500;
        const chunk = all.slice(from, from + lim);
        const next = all[from + lim];
        return json(200, Object.assign({ query: { pages: chunk.map(p =>
          ({ pageid: p.id, title: p.title, lastrevid: p.rev })) } },
          next ? { continue: { gapcontinue: next.title, continue: 'gapcontinue||' } } : {}));
      }
      if (q.prop === 'revisions') {
        const ids = q.pageids.split('|').map(Number);
        return json(200, { query: { pages: s.pages.filter(p => ids.includes(p.id)).map(p =>
          ({ pageid: p.id, title: p.title, revisions: [{ revid: p.rev,
            slots: { main: { content: p.text } } }] })) } });
      }
      return json(400, { error: { code: 'badparams' } });
    }
    if (u.pathname === '/wp-json/wp/v2/posts') {
      if (s.blogNotWp) { res.writeHead(404, { 'Content-Type': 'text/html' }); return res.end('<html>not here</html>'); }
      const page = +u.searchParams.get('page') || 1, per = 2;
      const chunk = s.posts.slice((page - 1) * per, page * per);
      if (!chunk.length) return json(400, { code: 'rest_post_invalid_page_number' });
      return json(200, chunk.map(p => ({ id: p.id, slug: p.slug, link: 'http://blog.example/' + p.slug,
        date: p.date, modified: p.modified, title: { rendered: p.title },
        content: { rendered: p.html } })));
    }
    res.writeHead(404); res.end('no');
  });
  srv.listen(0, '127.0.0.1', () => { process.stdout.write('PORT ' + srv.address().port + '\n'); });
  return;
}

/* -------------------------------- THE GATE -------------------------------- */
const ROOT = path.dirname(__dirname);
const TOOL = path.join(ROOT, 'tools', 'bohemia_bb_library.js');
let pass = 0, fail = 0;
const ok = (n, c, why) => { if (c) { pass++; console.log('  ok   ' + n); return; }
  fail++; console.log('  FAIL ' + n); if (why) console.log('         ' + why); };

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'bbl-gate-'));
const stateFile = path.join(tmp, 'state.json');
const baseState = {
  pages: [
    { id: 1, title: 'Main Page', rev: 100, text: 'Welcome.' },
    { id: 2, title: 'Hedge Knight', rev: 200, text: "'''Hedge Knight''' is a background. [[File:Hedge.png]]" },
    { id: 3, title: 'Nimble', rev: 300, text: 'A perk.' },
    { id: 4, title: 'Weapons/Swords', rev: 400, text: 'Swords.' },
    { id: 5, title: 'Weapons:Swords', rev: 500, text: 'A different page that sanitises to the same name.' },
    { id: 6, title: 'Q: Is it worth it?', rev: 600, text: 'Maybe.' },
    { id: 7, title: 'Zweihander', rev: 700, text: 'Big sword.' },
    { id: 8, title: 'Old Name', rev: 800, text: '#REDIRECT [[Zweihander]]', redirect: true },
  ],
  posts: [
    { id: 11, slug: 'dev-blog-1', date: '2014-01-01', modified: '2014-01-02', title: 'Dev Blog #1', html: '<p>First &amp; best.</p>' },
    { id: 12, slug: 'dev-blog-2', date: '2014-02-01', modified: '2014-02-02', title: 'Dev Blog #2', html: '<p>Second.</p>' },
    { id: 13, slug: 'dev-blog-3', date: '2014-03-01', modified: '2014-03-02', title: 'Dev Blog #3', html: '<p>Third.</p>' },
  ],
};
const setState = (patch) => fs.writeFileSync(stateFile, JSON.stringify(Object.assign(
  JSON.parse(JSON.stringify(baseState)), patch || {})));
setState();

const server = spawn(process.execPath, [__filename, '--serve'],
  { env: Object.assign({}, process.env, { BBL_STATE: stateFile }), stdio: ['ignore', 'pipe', 'inherit'] });

const waitPort = () => new Promise((res, rej) => {
  let buf = ''; const t = setTimeout(() => rej(new Error('stand-in did not start')), 10000);
  server.stdout.on('data', (d) => { buf += d; const m = /PORT (\d+)/.exec(buf);
    if (m) { clearTimeout(t); res(+m[1]); } });
});

const run = (port, out, extra) => {
  const r = spawnSync(process.execPath, [TOOL,
    '--wiki', 'http://127.0.0.1:' + port + '/api.php',
    '--blog', 'http://127.0.0.1:' + port,
    '--out', out, '--delay', '0', '--page-size', '3'].concat(extra || []),
    { encoding: 'utf8', timeout: 60000 });
  return { code: r.status, out: (r.stdout || '') + (r.stderr || '') };
};
const files = (dir, sub) => { try { return fs.readdirSync(path.join(dir, sub)).filter(f => f.endsWith('.md')).sort(); }
  catch (e) { return []; } };
const writtenOf = (o) => { const m = /written (\d+), unchanged (\d+)/.exec(o); return m ? [+m[1], +m[2]] : null; };

(async () => {
  console.log('\nTHE LIBRARY FETCHER TELLS THE TRUTH (row [bb library])\n');
  let port;
  try { port = await waitPort(); } catch (e) { ok('the local stand-in started', false, e.message); return finish(); }

  /* 1-4: a full fetch */
  const A = path.join(tmp, 'a');
  const r1 = run(port, A);
  const w = files(A, 'wiki'), b = files(A, 'blog');
  ok('a full fetch exits 0 (' + r1.code + ')', r1.code === 0, r1.out.slice(-300));
  ok('every non-redirect page is written, one file each (' + w.length + ' of 7)', w.length === 7,
    'files: ' + w.join(', '));
  ok('the redirect is not fetched as a page of its own', !w.some(f => /Old_Name/.test(f)));
  ok('every blog post is written, across its pages (' + b.length + ' of 3)', b.length === 3);
  const knight = fs.readFileSync(path.join(A, 'wiki', 'Hedge_Knight.md'), 'utf8');
  ok('a wiki file carries its source, its revision and the CC BY-SA line',
    /^source: http:\/\/127\.0\.0\.1:\d+\/wiki\/Hedge_Knight$/m.test(knight)
    && /^revision: 200$/m.test(knight) && /CC BY-SA 3\.0/.test(knight));
  ok('an image reference stays as text and nothing is downloaded',
    knight.includes('[[File:Hedge.png]]') && !fs.existsSync(path.join(A, 'wiki', 'Hedge.png')));
  const post = fs.readFileSync(path.join(A, 'blog', 'dev-blog-1.md'), 'utf8');
  ok('A BLOG FILE DOES NOT CLAIM CC BY-SA, and says whose it is',
    !/CC BY-SA/.test(post) && /Overhype Studios/.test(post) && /NOT under a free licence/.test(post),
    'the row asked for the CC BY-SA line on every file; on the developers\' blog that would be a false licence claim');
  ok('blog HTML becomes text, entities decoded', /First & best\./.test(post) && !/<p>/.test(post));
  const swords = w.filter(f => /^Weapons_Swords/.test(f));
  ok('two titles that sanitise to the same name BOTH survive (' + swords.join(', ') + ')',
    swords.length === 2 && swords.every(f => /__[0-9a-f]{8}\.md$/.test(f)));

  /* 5: idempotent */
  const r2 = run(port, A);
  const c2 = writtenOf(r2.out);
  ok('a second run with nothing changed writes NOTHING (' + (c2 ? c2.join(' written, ') + ' unchanged' : 'no count') + ')',
    c2 && c2[0] === 0 && c2[1] === 10);

  /* 6: one revision changes */
  const st = JSON.parse(JSON.stringify(baseState));
  st.pages.find(p => p.id === 3).rev = 301; st.pages.find(p => p.id === 3).text = 'A better perk.';
  fs.writeFileSync(stateFile, JSON.stringify(st));
  const r3 = run(port, A);
  const c3 = writtenOf(r3.out);
  ok('one page\'s revision changes -> exactly ONE rewrite (' + (c3 ? c3[0] : '?') + ')',
    c3 && c3[0] === 1 && /A better perk\./.test(fs.readFileSync(path.join(A, 'wiki', 'Nimble.md'), 'utf8')));
  setState();

  /* 7: resumable */
  const B = path.join(tmp, 'b');
  const r4 = run(port, B, ['--max', '3']);
  const firstThree = files(B, 'wiki').concat(files(B, 'blog').map(f => 'blog/' + f));
  const mt = {};
  for (const f of files(B, 'wiki')) mt[f] = fs.statSync(path.join(B, 'wiki', f)).mtimeMs;
  ok('--max 3 stops after 3 and says it can resume (' + firstThree.length + ')',
    firstThree.length === 3 && /STOPPED AT --max 3/.test(r4.out));
  await new Promise(r => setTimeout(r, 30));
  const r5 = run(port, B);
  const c5 = writtenOf(r5.out);
  const untouched = Object.keys(mt).every(f => fs.statSync(path.join(B, 'wiki', f)).mtimeMs === mt[f]);
  ok('the rerun finishes the other 7 and does NOT rewrite the first 3 ('
    + (c5 ? c5[0] + ' written, ' + c5[1] + ' unchanged' : '?') + ')',
    c5 && c5[0] === 7 && c5[1] === 3 && untouched);

  /* 8: cannot reach */
  const dead = http.createServer(); await new Promise(r => dead.listen(0, '127.0.0.1', r));
  const deadPort = dead.address().port; await new Promise(r => dead.close(r));
  const C = path.join(tmp, 'c');
  const r6 = run(deadPort, C);
  ok('a host that cannot be reached: exit 0, CANNOT REACH, and the host named',
    r6.code === 0 && /CANNOT REACH: nothing fetched, nothing written/.test(r6.out)
    && r6.out.includes('CANNOT REACH 127.0.0.1:' + deadPort), r6.out.slice(-300));
  ok('...and it writes nothing and prints NO success count that could be read as a pass',
    files(C, 'wiki').length === 0 && files(C, 'blog').length === 0 && !/written \d+/.test(r6.out));

  /* 9: reached, but not the API */
  setState({ blogNotWp: true });
  const D = path.join(tmp, 'd');
  const r7 = run(port, D);
  ok('a blog host that is not a WordPress API: says so, fetches nothing from it, does not guess',
    /NOT A WORDPRESS REST API/.test(r7.out) && files(D, 'blog').length === 0 && files(D, 'wiki').length === 7);
  setState({ wikiBroken: true });
  const E = path.join(tmp, 'e');
  const r8 = run(port, E, ['--only', 'wiki']);
  ok('a wiki host that answers with a web page instead of the API: says so, writes nothing',
    /DID NOT ANSWER AS A MEDIAWIKI API/.test(r8.out) && files(E, 'wiki').length === 0);

  finish();
})().catch((e) => { ok('the gate ran to the end', false, e.stack); finish(); });

function finish() {
  try { server.kill(); } catch (e) { /* gone */ }
  try { fs.rmSync(tmp, { recursive: true, force: true }); } catch (e) { /* tmp */ }
  console.log('\n=== BB LIBRARY: ' + pass + ' passed, ' + fail + ' failed ===');
  console.log('    proved against a local stand-in; the real hosts are never touched by this gate.');
  process.exit(fail ? 1 : 0);
}
