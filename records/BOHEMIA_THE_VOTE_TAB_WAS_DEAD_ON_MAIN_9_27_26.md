# THE VOTE TAB WAS DEAD ON MAIN, AND SIX LANES' ROWS WERE OUTSIDE THE LIST
ANIMATION lane, 9/27/26, found mid-rebase. Not my row, not my round; fixed
because a dead VOTE tab is the surface he votes on.

## WHAT WAS WRONG
`records/target/BOHEMIA_VOTE_REGISTRY.json` on main **did not parse**. One
character:

```
   }
  }
],,                <-- the items array closed HERE
  {
   "id": "combat-the-only-high-ground-9-27",
```

A lane splicing its row in as text put it **after** the array's closing bracket
instead of before it. That leaves `],,` and orphans everything that follows.

## WHAT IT COST, MEASURED
- **The whole tab 404s.** The page fetches this file and parses it; invalid JSON
  is "THE LIST DID NOT LOAD", which is the exact thing Paolo hit on 9/22.
- **Six lanes' rows were outside the list**, so even a working parse would not
  have shown them: `portrait-pick-your-man-out-9-27`,
  `factions-fourteen-crews-none-on-the-map-9-27`,
  `world-the-valley-three-acts-9-27`, `cook-the-valley-reads-as-land-9-27`,
  `ui-the-fight-is-a-different-game-9-27`,
  `coordinator-the-cell-and-the-tiny-character-9-27`, and the combat row above.

Every one of those lanes ran a pre-push pass and pushed in good faith. **The
break is not in any one of their rows; it is in the splice that came after.**

## THE FIX
Deleted the stray close and comma. `items` went from 148 visible to **154**, all
six orphans back inside the list, 0 duplicates, 114 verdicts untouched. Then my
own row on top: 155.

## WHY IT KEEPS HAPPENING, AND THE TWO WAYS THAT BOTH FAIL
- **`json.load` then `json.dumps`** rewrites the whole file in your own style.
  Measured on my own push two rounds ago: a one-row append came out as **53
  insertions and 38 deletions**, because main is not internally consistent about
  indent or `ensure_ascii`. That is how a one-line change becomes a hundred-line
  conflict for whoever pushes next.
- **Splicing as text** avoids that and is what this lane switched to, but it puts
  the burden on finding the right bracket, and **that is what failed here.**

## THE ONE RULE THAT CATCHES BOTH
**`json.loads` THE RESULT BEFORE YOU WRITE IT, AND ASSERT NOTHING WAS LOST.**
Not the input. The output.

```python
out = raw[:cut] + ',\n' + body + raw[cut:]
d = json.loads(out)                      # refuses to write a file that is not JSON
assert len(d['items']) == before + 1
for i in old['items']: assert i['id'] in [x['id'] for x in d['items']]
open(p, 'w').write(out)
```

Three lines. A splice that lands outside the array fails `json.loads` instantly,
and a splice that eats somebody else's row fails the assert. **PEOPLE wrote the
sibling of this on 9/24** (`grep -c '<<<<<<<'` succeeds when it FINDS markers, so
a chain with `&& git add` behind it staged a file the merge had refused to
write). Same family: trusting the step instead of checking the result.

## ROUTED
- **PLUMBER [no markers]**: the pre-push leg that lane owns should parse the
  registry and count items, not just look for conflict markers. A file with no
  markers in it can still be broken JSON, and this one was.
- **Every lane**: the three lines above.

## TAB
The VOTE tab in the alpha, which works again.
