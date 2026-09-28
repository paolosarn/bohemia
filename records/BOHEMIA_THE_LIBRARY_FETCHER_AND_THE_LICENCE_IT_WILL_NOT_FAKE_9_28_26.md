# THE LIBRARY FETCHER, AND THE LICENCE IT WILL NOT FAKE

PLUMBER, row `[bb library]`, rule 33j. Paolo 9/27: *"go through the Battle Brothers wiki and
download everything or remember everything, all the stats."*

## STATUS: THE TOOL IS BUILT AND PROVEN. THE FETCH WAITS ON ONE SETTING.

The row has three parts and two are done:

1. **A tool that pulls every wiki page and dev blog post to text** -- built, `tools/bohemia_bb_library.js`
2. **Until the hosts are allowed, it names the host that refused and exits CANNOT REACH** -- built, and it is what it does today
3. **Then every volume in the library cites fetched pages instead of (recall)** -- NOT DONE. There are **8** `(recall)` citations across the library's volumes, and they stay until the tool can actually reach the wiki.

The row stays CLAIMED, not SHIPPED, because rule 6 is explicit that a half-done job marked
SHIPPED is worse than an open one.

## MEASURED FIRST, AND THE ROW WAS RIGHT

```
battlebrothers.fandom.com    -> 000   CONNECT tunnel failed, response 403
battlebrothersgame.com       -> 000   CONNECT tunnel failed, response 403
www.battlebrothersgame.com   -> 000
api.github.com               -> 200   (the same proxy, so it is a per-host policy)
```

The fleet's proxy refuses the tunnel with **403 Forbidden**; curl reports that as HTTP 000.
That is the environment's network policy, not a fault anywhere in this repo, so the tool does not
try to route around it. The fix is one setting on the environment: allow
`battlebrothers.fandom.com` and `battlebrothersgame.com`.

What the tool prints today, run for real:

```
CANNOT REACH battlebrothers.fandom.com -- curl: (56) CONNECT tunnel failed, response 403
CANNOT REACH battlebrothersgame.com -- curl: (56) CONNECT tunnel failed, response 403

CANNOT REACH: nothing fetched, nothing written. Not a pass and not a failure of this
tool -- the hosts above are not allowed from here.
exit 0
```

## ONE THING IN THE ROW WAS WRONG, AND THE TOOL DOES NOT DO IT

The row asked for **"the CC BY-SA line at the top"** of every file, wiki and blog alike.

- The **wiki's** text is CC BY-SA 3.0. Wiki files carry that line, plus source URL and revision.
- The **developers' blog** is Overhype Studios' own writing and is **not** under a free licence.

Stamping CC BY-SA on a blog post would be a false licence claim, in a file that exists to be
cited. Blog files instead say whose text it is and that it is kept for private study and citation,
never republished. `reference/` is already in the site's exclude list, commented *"NEVER
published: not ours to serve"*, so none of this reaches the public site either way.

## HOW IT BEHAVES, SINCE IT IS SOMEBODY ELSE'S SERVER

- one request at a time, a 1-second gap by default, MediaWiki's `maxlag=5`
- retries on 429 and 503 honouring `Retry-After`, three times, then stops and says so
- page text fetched **fifty at a time** by page id through the query API. The row said "parse
  per page"; batching is the same text for a fiftieth of the requests, which is what the API's own
  etiquette asks for
- redirects skipped, so nothing is fetched twice
- a User-Agent naming the project, with no personal email in it
- no images: `[[File:...]]` references stay as text
- each file written to a `.part` and renamed, so a killed run never leaves half a page on disk

**Idempotent and resumable:** the page list is re-read every run (it is cheap), and a page is
fetched only if its file is missing or its stored revision differs from the wiki's current one.
Blog posts compare their `modified` date the same way.

## PROVEN WITHOUT THE NETWORK: A LOCAL STAND-IN THAT SPEAKS BOTH APIs

`gates/bb_library_gate.js` never touches the real hosts. A gate that crawled somebody else's
wiki on every suite run would be rude, slow, and red whenever their server hiccuped. It runs a
local server, in its own process (the tool calls curl synchronously, so a server in the gate's own
event loop would deadlock), that answers MediaWiki's `generator=allpages` with continuation and
`prop=revisions`, and WordPress's paged posts endpoint.

```
ok   a full fetch exits 0
ok   every non-redirect page is written, one file each (7 of 7)
ok   the redirect is not fetched as a page of its own
ok   every blog post is written, across its pages (3 of 3)
ok   a wiki file carries its source, its revision and the CC BY-SA line
ok   an image reference stays as text and nothing is downloaded
ok   A BLOG FILE DOES NOT CLAIM CC BY-SA, and says whose it is
ok   blog HTML becomes text, entities decoded
ok   two titles that sanitise to the same name BOTH survive
ok   a second run with nothing changed writes NOTHING (0 written, 10 unchanged)
ok   one page's revision changes -> exactly ONE rewrite
ok   --max 3 stops after 3 and says it can resume
ok   the rerun finishes the other 7 and does NOT rewrite the first 3
ok   a host that cannot be reached: exit 0, CANNOT REACH, and the host named
ok   ...and it writes nothing and prints NO success count that could be read as a pass
ok   a blog host that is not a WordPress API: says so, fetches nothing from it, does not guess
ok   a wiki host that answers with a web page instead of the API: says so, writes nothing
=== BB LIBRARY: 17 passed, 0 failed ===   (about 1 second)
```

## AND IT CAN FAIL: FOUR PLANTED BUGS, EACH CAUGHT ON THE RIGHT CHECK

| planted in the tool | result |
|---|---|
| blog files carry the CC BY-SA line | 16 / 1, on the blog-licence check |
| the skip-if-unchanged removed | 14 / 3, on all three idempotence and resume checks |
| CANNOT REACH also prints a written-count | 16 / 1, on the no-fake-pass check |
| two titles that sanitise alike not told apart | 12 / 5, starting with the one-file-per-page check |

## WHAT IS NOT MEASURED, SAID PLAINLY

- **The size of the real wiki.** Unknown from here. The tool prints bytes written, so the first
  real run answers it, and the repo budget check will judge whether it belongs in git.
- **Whether the blog really is WordPress.** Believed but unverified. If it is not, the tool says
  so and fetches nothing from it, rather than scraping whatever HTML it gets.

## WHEN THE HOSTS ARE ALLOWED

One command: `node tools/bohemia_bb_library.js`. Then the 8 `(recall)` citations get replaced with
links to the fetched pages, and this row is SHIPPED.
