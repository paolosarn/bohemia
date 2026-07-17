# BOHEMIA — ADDENDUM: iOS STORAGE LAW + LAUNCHER REALITY + NEMESIS PATENT FACTS
### By Paolo Alexandre Sarnataro (Babypunk / Punk4Prez)
### Living document — updated every working session. The file IS the memory.
### 7.2.26 — big research session. Everything below is sourced from primary references (WebKit blog, MDN, USPTO record) pulled today, not model memory. Engine actions taken same turn are marked BUILT.

---

## 1. iOS STORAGE LAW — the rules Bohemia's persistence lives under

**The 7-day eviction (confirmed, WebKit/MDN):** Safari deletes ALL script-writable storage for a site (localStorage, IndexedDB, Cache API, Service Worker registrations) after seven days of Safari use without the user interacting with that site. The clock counts days Safari was used, not calendar days. Applies to every browser on iOS since all must use WebKit.

**The exemption that matters:** web apps ADDED TO THE HOME SCREEN are not part of Safari, keep their own use counter, and WebKit's own engineer states first-party data deletion there would be "a serious bug." Home screen install is the persistence shield.

**Quotas (Safari 17+/iOS 17+):** an origin in a browser gets up to ~60% of disk; a home-screen web app gets browser-level quota; embedded WebViews (viewer apps) get ~15-20%. localStorage itself is capped small (~5MB and QuotaExceededError past it); real capacity lives in IndexedDB.

**No shared storage:** data saved while visiting in Safari is INVISIBLE to the installed home-screen copy of the same app, and vice versa. Separate silos.

**navigator.storage.persist() exists** and can request persistent (non-evictable) mode; Safari grants silently based on interaction history. Worth calling once at boot when we're hosted.

**IndexedDB on iOS has a documented instability history** (data loss around OS updates, transaction hangs, WebKit bugs on record). localStorage stays the primary for small saves; IndexedDB only when saves outgrow it, always alongside the export blob.

## 2. LAUNCHER REALITY — the finding that hits Paolo's workflow TODAY

**Safari refuses localStorage from file://.** When an HTML file is loaded directly from disk, localStorage.setItem throws SecurityError even though the object exists. Separately, recent iOS versions have been tightening direct opening of local HTML files in Safari at all (user reports through iOS 18.x).

**What this means:** depending on how Paolo launches the single-file alpha on his iPhone (Files preview, a viewer app's WKWebView, Safari via file, Safari via hosted URL), today's persistence either works fully, works but under a small embedded-app quota, or silently cannot write at all.

**[BUILT same turn] Persist hardened against exactly this:** the backend is now PROBED at boot with a real write. If setItem throws (the file:// case), the app falls back to in-memory session-only storage, zero crash, and exposes PERSIST.mode ('disk' or 'memory') plus a console warning that saves are export-only in this launcher. Tested against a simulated SecurityError-throwing localStorage: memory fallback saves in-session, no crash. All prior persistence, cache, and clip suites still green.

**[PENDING, Paolo's call — the ONE question]:** how do you actually open the alpha on your phone? Answer decides the strategy:
- Hosted URL + Add to Home Screen = full persistence, eviction-proof, the endgame answer
- Viewer app (WKWebView) = persistence works, smaller quota, fine for now
- file:// in anything Safari-based = export blob is the only real save; a visible EXPORT SAVE button becomes priority

**Standing law regardless of launcher:** the export/import blob (built earlier today in the engine Persist module) is the guaranteed line. Device dies, Safari evicts, launcher changes — the blob survives because Paolo holds it.

## 3. NEMESIS PATENT FACTS — for the Succession System

Paolo intends the Succession System (society reorganizes around vacancies across generations via contested power struggles resolved over real time) as Bohemia's signature, distinct from and potentially patentable against the Nemesis system. Verified record:

- **US Patent 10,926,179 B2** — "Nemesis characters, nemesis forts, social vendettas and followers in computer games." Assignee Warner Bros. Entertainment. Filed March 25, 2016; granted February 23, 2021; expires August 11, 2036 (assuming maintenance fees paid). Monolith, the studio that built it, was shut down in 2025; WB retains the patent.
- **Claim scope (per patent attorneys' published analysis):** broadly directed at adjusting the parameters of a second NPC based on predefined events between a first NPC and the player — rival memory of player encounters, promotion on player-involved events, nemesis forts, vendettas, followers. The same analyses note the breadth cuts both ways: broad claims are more exposed to invalidity challenges over prior art.

**Succession distinctness checklist (what our canon already does differently, keep it that way and DOCUMENT it):**
1. Reorganization is triggered by VACANCY from any cause — old age, natural death, generational fold — not by player-encounter events
2. Resolution happens over REAL TIME while the player is absent, society-wide, not as per-rival stat promotion
3. The unit of change is the INSTITUTION (who runs the district, which faction holds the niche), not an individual enemy's memory of you
4. It spans GENERATIONS through the fold, a mechanic with no analogue in the claims

**Not-a-lawyer line, hard:** this is the public record plus published attorney commentary, not legal advice. Before Paolo spends money on filing or before shipping commercially, one real patent attorney session reviewing the independent claims against Succession's spec is the correct move. What this research does is arm that session: the addendum trail (SUCCESSION_AND_BUNKERGUY 7/1 + this file) is exactly the dated documentation an attorney wants.

## 4. ENGINE IMPLICATIONS FILED (execution next chat with build sources)

- Home-screen install flow + navigator.storage.persist() call when the demo goes hosted
- Export-save button surfaced in the app UI if Paolo's launcher turns out to be file:// [PENDING his answer]
- IndexedDB Persist backend only when saves outgrow 5MB, never as sole store
- Keep every save also flowing through the export blob at wrap time, same as project files
