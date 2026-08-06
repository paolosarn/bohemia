# A SAVE THAT SURVIVES A WEEK OFF — 8/6/26, PEOPLE lane

The one item on the eleven-month list that nobody owned, that needs no judgement,
and that can silently destroy a real player's game.

> **THE BIG MISSING, item 7, filed 7/29 and never acted on:** *"iOS WebKit EVICTS
> script-writable storage (localStorage/IndexedDB) after ~7 days of site
> inactivity for Safari-tab web apps — a player who puts the game down for a week
> can come back to DELETED SAVES."*

---

## RESEARCHED, BECAUSE THE NOTE WAS A SUMMARY AND THIS POLICY MOVES

- **It is real and current.** Since iOS 13.4 / Safari 13.1, WebKit deletes
  localStorage, IndexedDB, SessionStorage **and service worker registrations**
  after seven days with no user interaction with the origin. The counter resets
  on every visit — so it only bites **the player who stops playing**, which is
  precisely the player you want back.
- **There is a one-call fix, and we had never made it.** Eviction *"only applies
  to origins that are not persistent and skips over origins that have been
  granted data persistence by using `navigator.storage.persist()`"*. Supported
  since **Safari 17 / iOS 17**.
- **Home-screen web apps get their own counter** tied to real app use rather than
  Safari-tab use. More forgiving, but **not a substitute**: installing is the
  player's choice, not ours, and most never do.
- **Quota was never the problem here.** Web Storage caps around 5 MiB per origin;
  Bohemia uses 10.8 KB.

---

## MEASURED ON THE REAL SURFACE BEFORE WRITING A LINE

Booted the alpha, tapped RUN, asked the page:

    localStorage keys : 3     bohemia.save.v1   9,351 bytes
                              bohemia:look      1,507 bytes
                              bohemia_sfxvol        1 byte
    total             : 10,859 bytes        (quota 1,041,232,462)
    navigator.storage.persisted() : FALSE   <- never granted
    navigator.storage.persist     : present <- and never called

Grepped alongside it: **zero occurrences of `navigator.storage` anywhere in the
repo.** Sixty `localStorage` call sites across the three surfaces, zero
IndexedDB. The game was completely unprotected.

### The second injury nobody had connected

`slices/sw.js` is what makes the **ONE-LINK LAW** work — network-first, so the
one URL always serves the newest deploy. **Service worker registrations are on
the same eviction list as the save.** A player returning after a week loses their
save *and* falls back to a stale link, which is the exact failure the one-link
law exists to prevent.

---

## WHAT SHIPPED, AND THE BOUNDARY IT RESPECTS

`tools/bohemia_durable_save_patch.py` — one request at boot, marker-fenced,
idempotent.

**It touches no save code.** How a save is written, read, migrated or exported is
the RUN lane's system and none of it changes. This asks the browser to keep what
is already being written. The distinction is what makes the change legitimate
from this lane, and the gate asserts it: no `setItem` inside the block.

It is fire-and-forget by construction — `false` changes nothing, an exception
changes nothing, boot never waits on it. **The worst case is exactly today's
behaviour.** And there is nothing for Paolo to judge: Safari decides on its own
heuristics with no user prompt.

`gates/durable_save_gate.js` — 13 claims, three mutations killed.

**It measures on the real surface rather than grepping for the line**, because a
line that exists and never runs is the exact class of bug this repo has been
finding all week. It boots the alpha and asks the page whether the request really
ran.

**It deliberately does not assert that persistence was GRANTED.** Browsers decide
on their own heuristics and headless Chromium answers differently from a phone —
asserting the grant would make the gate a weather report. It asserts *that we
asked, correctly, on the surface he opens*, which is the only part that is ours.

It also alarms if the save ever outgrows localStorage: 10.8 KB today against a
~5 MiB cap, so the day somebody starts putting art in the save blob, this goes
red instead of shipping a game that cannot save.

---

## WHAT IS STILL [PENDING PAOLO], AND WHEN IT IS DUE

**What the game ships AS in eleven months** — web link, installable home-screen
app, or App Store wrapper — is his call and is unmade. It matters more now that
the eviction rules are known:

| ships as | eviction exposure |
|---|---|
| Safari tab | 7-day counter, now mitigated by the persistence request |
| home-screen web app | own counter tied to real app use — materially safer |
| App Store wrapper | native storage, not subject to this at all |

The BIG MISSING puts that decision around **month 8**, because store review,
monetisation and packaging all work backwards from it. Nothing is blocked today;
it is named so it is not discovered late.

---

**Sources:**
[What Safari's 7-day cap on script-writeable storage means for PWA developers](https://searchengineland.com/what-safaris-7-day-cap-on-script-writeable-storage-means-for-pwa-developers-332519) ·
[Updates to Storage Policy — WebKit](https://webkit.org/blog/14403/updates-to-storage-policy/) ·
[Storage quotas and eviction criteria — MDN](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria) ·
[StorageManager: persist() — MDN](https://developer.mozilla.org/en-US/docs/Web/API/StorageManager/persist) ·
[PWA iOS Limitations and Safari Support 2026](https://www.magicbell.com/blog/pwa-ios-limitations-safari-support-complete-guide) ·
[Safari iOS PWA Data Persistence Beyond 7 Days — Apple Developer Forums](https://developer.apple.com/forums/thread/710157)
