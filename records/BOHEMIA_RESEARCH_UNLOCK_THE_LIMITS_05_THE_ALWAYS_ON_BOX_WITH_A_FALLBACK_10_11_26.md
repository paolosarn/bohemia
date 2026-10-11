# UNLOCK THE LIMITS 05: THE ALWAYS-ON BOX AS THE REPO'S OWN WORKER, WITH A FALLBACK (10/11/26)

Research only. Nothing here is built. Paolo's words: "I might even be able to set up one of my computers to stay on all the time for you, but we can't depend on that." He buys once; no subscriptions, no per-call credits. The repo is PUBLIC on a personal account. Container note: docs.github.com would not resolve from here, so every GitHub fact below rests on search-result text.

## 1. THE FINDING

A home computer can register itself as a self-hosted GitHub Actions runner, and our workflows can send the art jobs to it with one label. GitHub has NO built-in fallback: if the box is off, a job that names it just sits in the queue until a runner appears, and GitHub cancels it after 24 hours (docs say up to 48). So the fallback has to be our own first job, which asks the GitHub API "is the box online?" and hands the answer to the next job's `runs-on`. GitHub itself says do not put a self-hosted runner on a public repo, because a fork's pull request can run code on the box; the fix is to never let a pull request reach the box, make the runner single-use, and ideally give the art job its own private repo. For the hardware, a used RTX 3060 12 GB (about $290 to $400 for the card) makes a 512 px SD 1.5 picture in roughly 3 seconds, a $599 Mac mini M4 does it in roughly 8 to 15 seconds at 4 watts idle, and the free GitHub runner (CPU only) needs minutes per picture.

## 2. THE SECURITY RULE FOR A PUBLIC REPO

GitHub's own words, from the "add runners" page as returned by search: "We recommend that you do not use self-hosted runners with public repositories. Forks of your public repository can potentially run dangerous code on your self-hosted runner machine by creating a pull request that executes the code in a workflow." A second docs page adds that even with the fork-approval setting on, "potentially malicious user-controlled workflow code will execute automatically if the user is allowed to bypass approval... or if the pull request is approved." And `pull_request_target` workflows always run, with no approval at all.

The mitigations on the table, and what each is worth:

- **Never trigger a self-hosted job from a pull request.** Only `push` to `main`, `schedule`, and `workflow_dispatch`. A fork cannot push to our `main`. This is the one that actually closes the hole; everything else is belt and braces.
- **Ephemeral runner (`--ephemeral` at config time).** The runner takes one job, then de-registers itself; a service wrapper re-registers a clean one. A bad job cannot leave anything behind for the next.
- **Fork approval setting.** Settings, Actions, General, "Approval for running fork pull request workflows from contributors." Set it to require approval for ALL outside contributors, not only first-timers. Sources disagree on the exact label; read it in the UI.
- **Runner groups with "Allow public repositories" off** are an ORGANIZATION feature; the search found nothing equivalent for a personal account, so it does not help us as the repo stands.
- **Actions Runner Controller** is Kubernetes. Overkill for one box.
- **A private mirror repo for the art jobs.** The runner is registered to a PRIVATE twin repo (bohemia-art). Its workflow checks out the public repo read-only, cooks, and pushes the pictures back with a deploy key. Forks of the public repo cannot even see the box.

THE MITIGATION THIS REPO SHOULD USE: the private twin repo, ephemeral runner, triggers limited to the default branch and the clock. Plus two habits: the runner runs as its own low-rights user with nothing personal on that machine, and the fork-approval setting on the public repo goes to "all outside contributors" anyway.

## 3. THE FALLBACK PATTERN (home box when on, free runner when off)

1. **Register the box** as a self-hosted runner on the private twin repo with labels `self-hosted, bohemia-art, gpu`. Install it as a service (`svc.sh install` on Linux; the Windows service is offered at config time) with `--ephemeral`, so it survives reboots and never carries state between jobs.
2. **Job one, `pick`, runs on `ubuntu-latest`.** It calls `GET /repos/{owner}/{repo}/actions/runners` and checks whether a runner with our label is `online` AND idle. The built-in `GITHUB_TOKEN` cannot list runners; store a fine-grained token with runner read rights as a secret. The marketplace actions `mikehardy/runner-fallback-action` (the maintained fork of `jimmygchen/runner-fallback-action`) and "Check Runner Availability" do exactly this and output a JSON `runs-on` value.
3. **Job two, `cook`, uses `runs-on: ${{ fromJson(needs.pick.outputs.runs_on) }}`.** On the box it gets `[self-hosted, bohemia-art]`; otherwise `ubuntu-latest`.
4. **Two recipes in one job, chosen by a step `if`.** On the GPU: the full pixel-art diffusion pass. On the free runner (4 vCPU, 16 GB, CPU only, unlimited minutes for public repos): the fast half only, meaning the palette, the gates, the cutting and the registry, and either a few CPU pictures or none, with the diffusion backlog written to a queue file.
5. **Catch-up on wake.** A `schedule` run every hour does nothing unless the box is online and the queue file is not empty; then it drains it. So a night with the box off costs delay, not lost work.
6. **Fall back only when OFFLINE, not when busy.** A documented issue on a busy pool shows jobs falling back and running three times slower (55.9 min versus about 20). Our picker treats "busy" as "wait."
7. **Set `timeout-minutes`** on `cook`, and remember it starts counting when the job starts, not while queued; the 24-hour queue cap is why step 2 exists.
8. **Guardrails:** the twin repo's workflow has no `pull_request` trigger of any kind, and the public repo's art workflow never names the self-hosted label.

## 4. THE HARDWARE

Seconds are for one 512 px SD 1.5 picture at 20 steps. Prices are asking prices seen this month unless noted; none is invented. Watts: idle to full load.

| Option | One-time price | VRAM / RAM | Secs per picture | Watts | Noise | URL |
|---|---|---|---|---|---|---|
| Used RTX 3060 12 GB (card only, into a PC he already owns) | $288 to $312 fair range, $309 avg, early Oct 2026; another tracker's eBay median $400 in Sept | 12 GB VRAM | ~2.5 to 3 (7 to 9 it/s, user reports) | ~10 to 25 idle (card), 170 TGP; whole PC ~40 to 60 idle (inferred) | Desktop fans; audible under load | https://resaleprices.com/gpu/nvidia-rtx-3060 |
| RTX 4060 8 GB new (card only) | ~$530 Amazon, Oct 9 2026; used ~$320 to $340 | 8 GB VRAM | ~2.5 (8 to 10% faster than 3060 per Tom's Hardware) | lower than 3060 under load | same class | https://videocardprices.com/card/nvidia-rtx-4060/ |
| Mac mini M4 16 GB (a whole computer) | $599 list; $399 seen at Micro Center Dec 2025 | 16 GB unified | ~8 to 15 (inferred from M2 Pro 8 to 15 and M4 Pro 5 to 10; no base-M4 benchmark found) | 4 idle, 65 max (Apple) | 24 dB idle, "noticeably louder" under heavy load | https://support.apple.com/en-us/103253 |
| Jetson Orin Nano Super 8 GB | $249; limited stock, one per customer at some sellers | 8 GB shared | ~10 to 30 (RidgeRun 10.5 s in MAX mode, model unnamed; a gist says ~30) | 15 to 25 W modes | small fan | https://developer.ridgerun.com/wiki/index.php/Exploring_NVIDIA_Jetson_Orin_Nano_Super_Mode_performance_using_Generative_AI |
| GitHub free runner (the fallback) | $0 | 16 GB RAM, no GPU | 2 to 10 MINUTES, unmeasured estimates | n/a | n/a | https://github.blog/changelog/2026-09-17-ubuntu-26-generally-available-and-latest-migration |

Electricity, my arithmetic at the EIA 2026 forecast of about 18.2 cents per kWh: a 50 W desktop idling all month is 36 kWh, about $6.50; a Mac mini at 4 W is under $1; a Jetson at 10 W is about $1.30. Cooking two hours a day on a 3060 adds roughly 12 kWh, about $2. Prices in New York run 30 cents, so scale by his state.

## 5. WHAT IT FIXES AND WHAT IT DOES NOT

FIXES: the per-picture cost goes to zero after one purchase; the pipeline keeps running when the box is off, just slower and shorter; the box's absence never loses work, only delays it; nothing of his daily machine is exposed if the twin-repo rule holds.

DOES NOT FIX: a fork's pull request is still dangerous the day anyone puts a self-hosted label into the public repo's workflow; the free runner cannot do the GPU art at a useful pace, so a week with the box off is a week with no new diffusion pictures; the 3060 price is a card, not a computer, and an 8 GB card limits us to SD 1.5-class models; the base Mac mini M4 number is inferred, not measured, and the M4 may already have a successor on Apple's store; Windows forces update restarts past a deadline even with Active Hours set, so Linux as a service is the safer always-on choice, with BIOS "Restore on AC Power Loss: Power On" and Wake-on-LAN tested with a real power cut, and the Deep Sleep setting checked, since one Dell rebooted itself a second after every shutdown with WOL on.

## 6. ONE RULE

A SELF-HOSTED LABEL NEVER APPEARS IN THE PUBLIC REPO'S WORKFLOWS, AND THE BOX IS NEVER THE ONLY RUNNER A JOB CAN USE.

## 7. SOURCES

- GitHub docs, add runners (public-repo warning): https://docs.github.com/en/actions/how-tos/manage-runners/self-hosted-runners/add-runners
- GitHub docs, approving workflow runs from public forks: https://docs.github.com/en/enterprise-server@3.12/actions/managing-workflow-runs-and-deployments/managing-workflow-runs/approving-workflow-runs-from-public-forks
- GitHub docs, repository Actions settings (fork approval): https://docs.github.com/en/enterprise-cloud@latest/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/managing-github-actions-settings-for-a-repository
- GitHub docs, usage limits (24 to 48 hour queue cancel): https://docs.github.com/en/enterprise-server@3.12/actions/hosting-your-own-runners/managing-self-hosted-runners/usage-limits-for-self-hosted-runners
- GitHub docs, runner as a service: https://docs.github.com/en/enterprise-server@3.17/actions/how-tos/managing-self-hosted-runners/configuring-the-self-hosted-runner-application-as-a-service
- Feature request, no native fallback: https://github.com/orgs/community/discussions/20019
- Fallback actions: https://github.com/mikehardy/runner-fallback-action , https://github.com/marketplace/actions/self-hosted-runner-fallback , https://github.com/marketplace/actions/check-runner-availability
- Busy-pool fallback pitfall: https://github.com/dodi-smart/.github/issues/51
- Public-repo hardening: https://www.stepsecurity.io/blog/defend-your-github-actions-ci-cd-environment-in-public-repositories , https://latchkey.dev/learn/ci-how-to/secure-self-hosted-runner-public-repo-github-actions
- Free runner spec and ubuntu-latest migration: https://github.blog/changelog/2026-09-17-ubuntu-26-generally-available-and-latest-migration , https://www.c-sharpcorner.com/article/moving-github-actions-to-ubuntu-26
- RTX 3060 used price: https://resaleprices.com/gpu/nvidia-rtx-3060 , https://gpudojo.com/rtx-3060-12gb
- RTX 3060 it/s reports: https://github.com/AUTOMATIC1111/stable-diffusion-webui/discussions/9798
- 4060 vs 3060 in SD: https://www.tomshardware.com/pc-components/gpus/rtx-4060-vs-rtx-3060-12gb-gpu-faceoff
- RTX 4060 price: https://videocardprices.com/card/nvidia-rtx-4060/
- Mac mini power: https://support.apple.com/en-us/103253 ; review and noise: https://www.notebookcheck.net/Apple-Mac-Mini-M4-review-Smaller-faster-and-louder.918832.0.html ; price drop: https://www.notebookcheck.net/Apple-M4-Mac-Mini-with-16-GB-unified-memory-scores-200-discount-ahead-of-Christmas.1190955.0.html
- Mac SD speeds: https://insiderllm.com/guides/stable-diffusion-mac-mlx/ , https://www.heyuan110.com/posts/ai/2026-02-15-mac-mini-local-image-generation/
- Jetson: https://hwbusters.com/news/nvidias-jetson-orin-nano-super-developer-kit-power-affordability-and-ai-innovation-at-249/ , https://developer.ridgerun.com/wiki/index.php/Exploring_NVIDIA_Jetson_Orin_Nano_Super_Mode_performance_using_Generative_AI
- CPU-only SD estimates: https://localaimaster.com/blog/image-generation-without-gpu
- Electricity: https://www.eia.gov/outlooks/steo/report/elec_coal_renew.php
- BIOS power-loss and WOL pitfalls: https://www.servethehome.com/keeping-servers-bios-setup-availability/ , https://extreme.pcgameshardware.de/threads/linux-server-startet-nach-poweroff-sofort-neu-wake-on-lan-deep-sleep.662316/
- Windows restarts past deadline: https://learn.microsoft.com/en-us/answers/questions/3922938/how-can-i-stop-windows-from-automatically-updating
