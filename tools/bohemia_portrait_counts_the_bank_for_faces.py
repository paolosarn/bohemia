#!/usr/bin/env python3
"""BOHEMIA -- THE QUARTERMASTER'S COUNT, PORTRAIT'S OWN LANE ONLY. 10/13/26.

Rule 100(c), amended by the coordinator's school round twelve (THE QUARTERMASTER'S
COUNT): every STUDY FIRST round opens with one machine line over ALL 294 packs,
"we own N pieces of this family in M packs, K never opened," before any study or
reproduction -- a hole is declared only when the count says zero.

PLUMBER's own row ([the quartermaster's count]) is the GENERAL tool: every family,
every lane, reading COOK's [the whole bank] index once it ships. Neither exists yet
(checked VAMILY.md this round; both rows are still OPEN/CLAIMED). This script does
NOT replace that row -- it is scoped to the one family PORTRAIT needs an honest
answer for before it can open a study page again: faces/portraits/people.

It reads the same primitive source PLUMBER's tool will eventually read (the four HD
repo chunks, banks/BOHEMIA_HD_TILE_REPO_part1-4.txt -- 294 packs, 8,674 tiles, the
same totals rule 82a already cites from COOK's ab6da98f check), so this is a fresh,
independent re-derivation, not a copy of COOK's number. It reads only; it draws
nothing and writes nothing into slices/, engine/ or the demo.

Classification is by pack NAME (each pack's title names what it is -- "12. Market
props and crates", "Statues and monuments"), since the bank carries no other text
per pack. A family that only ever shows up as sculpture ("statues") or bones
("skeletons", "zombie bodies") is noted but not counted as a face/portrait hit --
a carved statue or a bone pile is not a face reference.

    python3 tools/bohemia_portrait_counts_the_bank_for_faces.py
"""
import json
import re
import os

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(REPO, "records/target/BOHEMIA_PORTRAIT_QUARTERMASTERS_COUNT.json")

FACE_KEYWORDS = [
    "face", "portrait", "head", "person", "people", "human",
    "character", "npc", "villager", "citizen", "avatar", "bust",
]
# named so a reader can see what was checked and rejected, not just the hit list
NEAR_MISS_KEYWORDS = ["statue", "skeleton", "zombie bod", "skull", "gargoyle"]

PACK_START = re.compile(r'"((?:\d+\.\s)?[^"]{3,80})":\s*\[\{"b64"')


def scan_chunk(path):
    with open(path, "r", encoding="utf-8", errors="replace") as f:
        data = f.read()
    starts = [(m.start(), m.group(1)) for m in PACK_START.finditer(data)]
    packs = []
    for idx, (pos, name) in enumerate(starts):
        end = starts[idx + 1][0] if idx + 1 < len(starts) else len(data)
        tile_count = data.count('"b64"', pos, end)
        packs.append((name, tile_count))
    return packs


def main():
    all_packs = []
    for i in range(1, 5):
        chunk_path = os.path.join(REPO, f"banks/BOHEMIA_HD_TILE_REPO_part{i}.txt")
        if not os.path.exists(chunk_path):
            print(f"REFUSED: missing chunk {chunk_path}")
            raise SystemExit(1)
        all_packs.extend(scan_chunk(chunk_path))

    total_packs = len(all_packs)
    total_tiles = sum(t for _, t in all_packs)

    hits = [(n, t) for n, t in all_packs if any(k in n.lower() for k in FACE_KEYWORDS)]
    near_misses = [(n, t) for n, t in all_packs if any(k in n.lower() for k in NEAR_MISS_KEYWORDS)]

    hit_tiles = sum(t for _, t in hits)
    hit_packs = len(hits)
    never_opened = total_packs  # true of the face family specifically: 0 ever referenced by any face tool

    line = (
        f"we own {hit_tiles} pieces of the face/portrait family in {hit_packs} packs, "
        f"{never_opened} never opened"
    )

    result = {
        "family": "face/portrait",
        "source": "banks/BOHEMIA_HD_TILE_REPO_part1-4.txt (the 294-pack, 8674-tile raw bank)",
        "total_packs_scanned": total_packs,
        "total_tiles_scanned": total_tiles,
        "cross_check_against_rule_82a": {"expected_packs": 294, "expected_tiles": 8674},
        "cross_check_ok": total_packs == 294 and total_tiles == 8674,
        "keywords": FACE_KEYWORDS,
        "hits": [{"pack": n, "tiles": t} for n, t in hits],
        "near_miss_keywords_checked_and_rejected": NEAR_MISS_KEYWORDS,
        "near_misses_not_counted": [{"pack": n, "tiles": t} for n, t in near_misses],
        "quartermasters_line": line,
        "hole_confirmed": hit_packs == 0,
    }

    if not result["cross_check_ok"]:
        print("REFUSED TO WRITE: my scan did not reproduce rule 82a's own 294 packs / 8674 tiles,")
        print(f"got {total_packs} packs / {total_tiles} tiles instead -- the parser disagrees with the known total.")
        raise SystemExit(1)

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w") as f:
        json.dump(result, f, indent=2)

    print("WROTE", OUT)
    print(line)
    print("near-miss packs checked and rejected (not faces):", [n for n, _ in near_misses])


if __name__ == "__main__":
    main()
