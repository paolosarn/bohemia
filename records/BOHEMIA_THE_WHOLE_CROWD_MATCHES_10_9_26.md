# THE WHOLE CROWD MATCHES -- faceFor() HAD THE SAME TEXTURE BUG, AT CROWD SCALE
# PORTRAIT (chat 20), 10/9/26. Round two of [hairstyles match], same root cause,
# much bigger surface: not the face maker this time, the renderer every citizen
# in the valley is drawn through.

## HOW THIS WAS FOUND
Round one (earlier this round) fixed the face maker's HAIRCUT picker, which was
dropping `tex` and `fade` when the player picked a cut. That work had sat on an
orphaned branch for 61 commits; folding it back into current main meant
re-reading the surrounding code closely enough to resolve real conflicts, not
just mechanically. That re-read landed on `faceFor()`'s own hair-texture line,
the function that draws every citizen in the game, not just the player's own
face maker panel.

## WHAT WAS THERE
```
sp.hair.tex = pick(['wave','wave','coils','locs','solid'], 'htex');
```
with a comment: "all fifteen canon body styles are tex 'solid'... there is
nothing on the body to agree WITH yet." That was true on 8/28. It is not true
today: the canon bank is 11 styles, and three of them carry a real texture
(ROPE LOCKS and SHORT ROPES are `tex:'locs'`, DUST WEAVE is `tex:'braid'`) --
the same fact round one's fix already reads for the face maker. Nobody told
this line the premise it was written against had changed.

Two lines below it, the braid-sentinel code already parses the real cut's
texture via `_hd.tex` for a completely different purpose (whether to draw the
single decorative braid strand). This line never read that same value for
itself -- it rolled its own, independently, every time.

## MEASURED BEFORE TOUCHING ANYTHING
300 crowd citizens, same `faceFor`/`hairDialsFor` pair the face maker fix uses:

    citizens wearing one of the three textured canon cuts     82 of 300
    of those, portrait texture disagreeing with the body's     76 of 82 (93%)

Examples: a DUST WEAVE citizen (body texture `braid`) with a portrait reading
`wave`; a SHORT ROPES citizen (body `locs`) with a portrait reading `wave`.
Same class of bug this lane has now caught four times on these two renderers
(cut SHAPE 8/28, hair COLOUR 9/20, the braid sentinel 9/24, this).

## THE FIX
```
sp.hair.tex = (_hd && _hd.tex) ? _hd.tex : pick(['wave','wave','coils','locs','solid'], 'htex');
```
`_hd` is the same `hairDialsFor(_bodyHair)` result already computed two lines
above for the shape dials (side/front/vol/flare) -- reading it here too is the
same source, not a second one. A cut with no `tex` field (8 of the 11 canon
cuts) leaves `_hd.tex` undefined, so the random roll still runs for those,
unchanged.

## PROVED NOTHING SHIPPED MOVED
His approved face never goes through `faceFor()` -- it is `buildSpec()`/`pface`,
a separate path -- so this cannot touch it by construction. Checked anyway, not
assumed: hashed the 218 of 300 crowd citizens wearing an UNTEXTURED cut on a
clean checkout, hashed the same 218 again after the fix. 0 differences.
`talking_portrait_gate` (34/0) and `family_gate` (17/0) both confirm the
approved-face pin unmoved.

## MEASURED AFTER
    textured citizens matching their body's real texture    82 of 82 (was 6 of 82)

## GATES
talking_portrait 34/0, portrait_haircut 15/0, family 17/0, face_maker 16/0,
hair 39/0, hairline 12/0, hair_graveyard 13/0, craft_law 39/0, alpha_loads
20/0, portrait_matches_body 11/0, vote_tab 31/1 (pre-existing, three other
lanes' own items, checked against a clean origin/main worktree, not mine).

## COOKED (rule 22)
`portrait-the-whole-crowd-matches-10-9`, six real citizens before this fix
would have shown a wrong texture, now showing the real one, on real renderer
pixels, with the full 82-of-82 number. TAB: VOTE in the alpha. This is a
shipped fix, not a candidate -- the card says so.

## NOT DONE
The 8 of 11 canon cuts with no `tex` field still roll randomly for a citizen's
portrait every time `faceFor` is called fresh (no caching across calls beyond
`FACE_CACHE`'s own key), which is the SAME behaviour the game has always had
for those cuts -- not a new gap, not touched here.
