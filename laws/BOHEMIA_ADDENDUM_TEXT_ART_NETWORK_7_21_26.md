# BOHEMIA — ADDENDUM: TEXT-ART PHOTOS + NOTIFICATION PATTERN (LOCKED)
### 7.21.26 — Paolo asked for research on how a barely-surviving internet could plausibly host photos/video, and clarified how phone notifications should behave. Both are LOCKED design directions, researched and built same day.

---

## THE PLAUSIBILITY QUESTION (Paolo's words, 7/21)
"In a world that BARELY BARELY BARELY had its internet and electricity structure survive, I don't think people sharing videos and photos online is plausible... maybe we can imagine a way when you take a picture it becomes like text, you know how people make those texts that look like dogs or cats but big... if a website that survives... can deliver the most while needing to host the least amount of data."

He's right, and the real numbers back him: a photo is many orders of magnitude larger than the equivalent text, and image/video hosting requires exactly the kind of always-on server/CDN/storage infrastructure this world's brownout-plagued, barely-patched Network could not sustain (per HOUSE_OF_CARDS_POWER_SHARE and the 7/18 collapse canon — brownouts, not blackouts, civilization held on by a thread).

## RESEARCH: THIS ALREADY HAPPENED, FOR EXACTLY THIS REASON
**ANSI/ASCII art on 1980s-90s dial-up BBS systems** existed because displaying real images was technically impossible over slow modems and text-only terminals. The workaround wasn't a downgrade people tolerated — it became a real craft: dedicated art groups (ACiD, formed 1990; iCE, 1991) released monthly "artpacks" of elaborate text-drawn illustrations, and in the warez/BBS scene, skilled ASCII/ANSI art functioned as literal social currency, traded for board access and status.

**Shift-JIS art on Japanese textboards (2channel and successors)** proves this isn't just a scarcity-era relic: it has been actively used and beloved since around 2005, LONG after broadband made real images trivial — including whole meme genres built entirely from text art (the JoJo's Bizarre Adventure Shift-JIS art tradition is a mainstream example). Once a text-art culture exists, people keep making it because it's *good*, not just because they have to.

**Real disaster-communication precedent**: during actual network-congestion events (hurricanes, earthquakes, blackouts), SMS texts reliably "slip through" congested cell towers when voice calls and data cannot connect, purely because of how much smaller a text packet is. Text is what survives when everything else chokes — documented, unglamorous, and exactly Bohemia's situation.

## LOCKED
- **Bohemia's Network is text-first by necessity, not by choice** — the same way BBS/ANSI art and 2channel's Shift-JIS culture were. Real image/video hosting is NOT plausible in-world and is not what the Network does.
- **"Photos" on the feed are actually community-made TEXT ART** (monospace ASCII-style drawings), not real images. This isn't a downgrade or a placeholder excuse — it's the in-fiction reason the Network survived when a real Instagram/YouTube infrastructure could not have. It also means there is genuinely no "real photo asset" production burden for this system, ever — the art IS text, produced the same way any other written content is.
- Built 7/21 in the phone demo: `photoFor()` now renders small hand-drafted TEXT ART pieces per quest (a dripping water tower for Water Run, a rooftop antenna, a tunnel arch, a breached fence) inside a "TEXT-CAM" frame, replacing the old placeholder gradient block. These specific pieces are throwaway/placeholder-quality — a real in-fiction text-art culture/production pipeline is a later system, not built here.
- **PENDING, Paolo's call, not decided**: whether Bohemia leans into the BBS-era precedent narratively — e.g., an in-fiction "text-art crews" subculture where skill at it is a real reputation/clout source (a direct echo of the real ACiD/iCE dynamic). Flagged as a strong, well-precedented option, not locked.

## THE CAMERA APP — BUILT, THEN KILLED SAME SESSION (7/21, GRAVEYARD)
Camera was built as the last dimmed "soon" home-screen tile (shutter -> develop -> a text-art shot from the same art bank the feed uses, collecting into a gallery). Paolo killed it immediately after seeing it: **"i dont want the camera app too much shit going on. i dont want the camera"** — too much surface for a slice that doesn't even have real quests yet. REMOVED entirely the same session (tile, view, CSS, all JS). Registered in gates/bohemia_graveyard.txt (`renderCamera`) — GRAVEYARD IS FINAL, do not re-add a Camera app.

**What survives**: while building it, the underlying art system was generalized in a way that's independent of Camera and Paolo did NOT reject — the 4 quest-specific TEXT-CAM pieces from the first pass (water tower, antenna, tunnel, fence) are an explicit override table for this demo's specific quests; any OTHER quest id — including any real quest not yet written — falls back to a shared `ART_BANK` (8 more pieces), picked deterministically by a hash of the quest id, same zero-authorship pattern as avatar colors/voice archetypes. The feed's `photoFor()` still uses this. Only the standalone playable Camera SCREEN is dead, not the generative art bank underneath it.

## THE NOTIFICATION PATTERN (Paolo's clarification, 7/21)
Confirming the cross-app push banner built earlier the same day (researched against Cyberpunk 2077's non-intrusive top-banner pattern): Paolo wants it to keep working "even in the overworld," not just when the phone app is open. He also likes the LOCK SCREEN recap behavior (notifications resurface when you open the phone) and wants BOTH to coexist, not one replacing the other.

**LOCKED for later polish**: the banner must never look like a literal iOS/Android system notification. Keep it in Bohemia's own salvaged/mono visual language (already true today — dark, gold/mono-accented, not a white rounded iOS card) as the game's visual fidelity increases; do not let it drift toward a real-phone-OS skeuomorphic copy.

**Built 7/21**: the phone can now be manually LOCKED at any time (a new lock icon in the status bar) as a stand-in for "putting the phone away" until a real overworld exists to actually walk away into — tapping it re-triggers the same recap the very first boot showed, now reusable instead of one-time. So both patterns coexist exactly as asked: the live pushBanner fires over whatever screen/app is open right now, AND picking the phone back up (unlocking) always resurfaces a fresh recap of what was missed.

---
*BOHEMIA — Text-Art Network + Notification Pattern — 7.21.26*
*The network that survived is the one that never needed to send a real picture.*

Sources:
- [The History of ASCII Art — ASCII Art Archive](https://www.asciiart.eu/history-of-ascii-art)
- [What Is ANSI Art, and Why Was It Popular in the 1990s? (How-To Geek)](https://www.howtogeek.com/781276/what-is-ansi-art-and-why-was-it-popular-in-the-1990s/)
- [ACiD Productions — Wikipedia](https://en.wikipedia.org/wiki/ACiD_Productions)
- [Shift JIS art — Wikipedia](https://en.wikipedia.org/wiki/Shift_JIS_art)
- [Send SMS Texts During Wireless Cellular Network Failures Caused by Disasters (Medium)](https://medium.com/@jasonfrasca/send-sms-texts-during-wireless-cellular-network-failures-caused-by-disasters-7db6354998ad)
- [The Rookies — Cyberpunk 2077 Phone Communication mechanics](https://www.therookies.co/projects/82393)
