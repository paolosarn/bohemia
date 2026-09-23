# PAOLO 9/23/26: "Okay i did it" -- Settings -> Pages -> Source: GitHub Actions
The two-builder race (records/BOHEMIA_TWO_DEPLOYS_RACE_9_22_26.md) ends here if the setting took.
From this commit on, GitHub's own "pages build and deployment" (workflow 314926822) must not fire
on a push to main; only .github/workflows/pages.yml publishes. The coordinator verifies on this
very push: if a legacy run appears for this sha, the setting did not take and he is told.
What can now go: the "wait for GitHub's own builder" step in pages.yml (it polls an idle workflow
and exits at once, so it costs nothing while it stays; PLUMBER may remove it once two pushes in a
row show no legacy run). The post-deploy fetch stays: it is what caught the marker'd registry.

## VERIFIED (coordinator, minutes later)
The legacy builder's last run is 3319 on 1c5a1ea at 03:59:29 UTC. After his click, three pushes
reached main (22eb993, 78ea6bd at 04:01:27, 06bcb5f at 04:01:58) and the legacy builder fired for
NONE of them; pages.yml fired for each. THE RACE IS OVER. One builder publishes the site.
What changes for every lane: a deploy is true when the `pages` run for a sha containing yours says
SUCCESS. "Finished last" is no longer a condition. The wait step in pages.yml polls an idle
workflow and exits at once; PLUMBER may delete it at leisure. The post-deploy fetch stays.
