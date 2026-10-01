# THE FENCE AND THE STAMP FOR GROK (PLUMBER 10/1/26, rows [grok fence] and [grok filter gate], rule 49)

Paolo connected Grok, the outside research helper he pays for, to this repo through its own GitHub
connector (rule 49d). Rule 49b: Grok knows everything and digs on its own, but it is never a lane, never
a decider, never a writer of law. Two rows put machines behind that. Both SHIPPED.

## THE ANSWER FIRST

- **GROK FENCE is in the suite, green, about a second.** No Grok commit on main has touched anything
  outside reference/library/grok/. The branch grok holds 3 Grok commits not yet on main ("THE BEAST
  TABLE", "WHAT I FOUND ON MY OWN", "GROK INDEX"); all 3 stay inside the folder.
- **GROK FILTER is in the suite, green, about two seconds.** Nothing outside the folder cites a Grok page
  yet, and the gate says so as zero, not as a pass over something. The first citation of a page that
  the eyes-and-ears chat has not stamped PASSED FILTER will turn it red.

## HOW A GROK COMMIT IS KNOWN, MEASURED BEFORE THE GATE WAS WRITTEN

The row said: fence any commit "whose author, committer or message says Grok". Read off the branch
first: all three Grok commits are authored AND committed under the repo owner's own GitHub account,
because the connector pushes as him. A gate keyed on the author name would have found nothing, every
time, and stayed green over an outside writer. The one mark that is Grok's alone is the message:
reference/BOHEMIA_GROK_PASTE.md tells it to start every commit "GROK:". So:
- a commit whose message STARTS with GROK: is Grok's (also any author or committer that says grok, in
  case the connector ever signs as itself);
- a coordinator commit that only MENTIONS Grok ("PAOLO 10/1: Grok writes into the repo...") is the
  coordinator's, and is not fenced. Eight such commits are on main; none was flagged.

## THE GATES

**gates/grok_fence_gate.js (GROK FENCE)**
- S1-S4 on a planted repository: a GROK: commit inside the folder passes; a GROK: commit that touches
  VAMILY.md is caught; a coordinator commit that only mentions Grok is not fenced; a commit signed by a
  grok author outside the folder is caught.
- L1 every Grok commit reachable from main touches only its folder. The clone is shallow (2,552 commits
  in reach) and the gate prints that, never hides it.
- WARN for a Grok commit on the branch grok, not yet on main, outside the folder: the coordinator reverts
  it before bringing the folder in.
- The first cut listed every commit's files: 30 s. Git now picks the candidates (message, author or
  committer) and the gate judges those exactly: about 1 s, same answers.

**gates/grok_filter_gate.js (GROK FILTER)**
- The folder's own README sets the shape: line 1 says where the page came from, line 2 is PASSED FILTER
  or FAILED FILTER with the reason, written by the eyes-and-ears chat after reading the page against
  rule 6, the newest dated ruling, and a source on every number.
- S1-S5 on a planted repository: a citation of a stamped page passes; of an unstamped page, a page
  stamped FAILED, and a page that is not there, each is caught; naming the folder itself is not a
  citation.
- L1 every file outside the folder that names a page inside it names a page that is on the branch and
  stamped PASSED FILTER on line 2.
- The first cut handed git a JavaScript pattern and git refused it (no `(?:` in its pattern dialect);
  the gate now gives git a plain pattern of its own.

## WHAT THEY DO NOT DO, STATED

Neither gate can stop a push; nothing on this repo can, there are no server hooks. They make the
suite red the moment the fence is crossed or an unstamped page is cited, which is what every lane's
pass reads. The shallow clone means a Grok commit older than the clone's reach would not be read.
