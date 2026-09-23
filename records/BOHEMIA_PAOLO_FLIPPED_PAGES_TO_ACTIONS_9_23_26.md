# PAOLO 9/23/26: "Okay i did it" -- Settings -> Pages -> Source: GitHub Actions
The two-builder race (records/BOHEMIA_TWO_DEPLOYS_RACE_9_22_26.md) ends here if the setting took.
From this commit on, GitHub's own "pages build and deployment" (workflow 314926822) must not fire
on a push to main; only .github/workflows/pages.yml publishes. The coordinator verifies on this
very push: if a legacy run appears for this sha, the setting did not take and he is told.
What can now go: the "wait for GitHub's own builder" step in pages.yml (it polls an idle workflow
and exits at once, so it costs nothing while it stays; PLUMBER may remove it once two pushes in a
row show no legacy run). The post-deploy fetch stays: it is what caught the marker'd registry.
