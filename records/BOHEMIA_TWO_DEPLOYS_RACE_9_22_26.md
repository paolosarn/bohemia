# TWO DEPLOYS RACE, AND THE LOSER IS THE ONE WITH HIS VOTE LIST IN IT (coordinator 9/22/26)
# Paolo 9/22: "THE LIST DID NOT LOAD... HTTP 404" on the alpha's VOTE tab, then "Im trying to vote bro".

## THE CAUSE, MEASURED OFF THE ACTIONS API
Two workflows publish the same GitHub Pages site on every push to main:
1. `pages` (.github/workflows/pages.yml): checks out, cuts the demo from the alpha, copies
   slices/ + engine/ + records/target into _site, deploys. ~75 s. Every run SUCCESS.
2. `pages build and deployment` (GitHub's own branch builder, Jekyll, reading _config.yml):
   fires on the same push. The 8/6 law says it "still fires and still fails and is NOISE".
   THAT IS NO LONGER TRUE: runs 3218, 3219, 3221 concluded SUCCESS in ~80 s (3220 cancelled).
Whichever finishes LAST is the live site. The Jekyll build obeys _config.yml's exclude list,
which drops records/ and *.json, so when it wins the site has slices/ and engine/ and NO
records/target/BOHEMIA_VOTE_REGISTRY.json. The VOTE tab fetches exactly that file and says
THE LIST DID NOT LOAD. When the actions build wins, the list loads. A coin toss per push, and
the lanes push every two minutes. His two taps landed on Jekyll's side of the coin.
It also means the demo he opens flips between the FRESH cut (actions) and the COMMITTED cut
(Jekyll, which never runs the cutter), which explains more than one "I didn't see nothing new".

## WHY IT STARTED
The branch builder used to fail on size and time (496 MB, 30 minutes, timeout), so it was
harmless and the law called it noise. The exclude list that was written for the actions
workflow's benefit also made the Jekyll build small enough to finish. Nobody re-checked the
"still fails" claim; the pages_publish_gate reads the config and the workflow, never the
Actions API.

## THE FIX
1. THE REAL ONE, HIS CLICK (the repo setting; no chat can reach it): GitHub -> the repo ->
   Settings -> Pages -> "Build and deployment" -> Source: change "Deploy from a branch" to
   "GitHub Actions". The Jekyll build stops firing; one builder, one site.
2. THE REPO-SIDE ONE, SHIPPED NOW: `include: [records/target/BOHEMIA_VOTE_REGISTRY.json]` in
   _config.yml. Jekyll checks include before exclude, so the vote list is published by both
   builders and loads whichever wins. The demo divergence stays until his click.
3. THE MACHINE: PLUMBER [list loads] adds a post-deploy fetch to pages.yml (the registry,
   the alpha, the demo, all 200) and a leg that reads the Actions API for the other builder
   and goes red while it is still firing.

## THE LAW CORRECTED
CLAUDE.md's SHIP FLOW paragraph ("Do NOT read 'pages build and deployment' any more; it
still fires and still fails and it is now NOISE") is amended: it fires, it succeeds, it
races, and it publishes a different site. Until the setting is flipped, a deploy is only
true when the `pages` run was the LAST to finish.

## SECOND ATTEMPT, SAME ROUND: THE INCLUDE DID NOT SAVE HIM
He tapped again after the include: 404 again. Either the deploy had not landed or Jekyll
prunes an excluded directory before it ever looks at a file inside it (the include is a
file under an excluded folder, and Jekyll filters entries per directory level). Not worth
proving either way; the deterministic fix went in instead: .github/workflows/pages.yml now
WAITS for GitHub's own builder to finish (polls the Actions API for workflow 314926822,
up to ~7 minutes) BEFORE deploy-pages, so our deploy always lands last and always wins,
and after deploying it FETCHES the live registry, the alpha, the demo and the vote tab and
fails the run on anything but 200. `actions: read` added to the workflow's permissions.
The include stays (harmless). His click still kills the race at the root.
