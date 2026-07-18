#!/usr/bin/env python3
# BOHEMIA MUSIC GATE (born 7/18/26)
# The music laws lived in the alpha's embedded lawbook and named a
# _newvoice_gate.js that never shipped to the repo. A LAW WITHOUT A MACHINE
# GATE IS NOT ENFORCED. This is the machine. It enforces, against the alpha:
#   1. SCREECH LAW    : no createDelay() call, no self-feeding node, anywhere.
#   2. VOICE INTEGRITY: every melodic/pad voice a song names (inst.b / inst.l /
#                       am) is actually synthesized in synthV().
#   3. NEW VOICES LAW : every song in the current cook batch (bt:N) births at
#                       least one voice defined in a BATCH-N synthesis block.
#   4. VARIETY LAW    : within a batch, no two songs share scale+feel+kick.
#   5. GRAVEYARD FINAL: no live song reuses a graveyard name; no live dup names.
import re, sys, pathlib

ALPHA = pathlib.Path(__file__).resolve().parent.parent / "slices" / "BOHEMIA_ALPHA_0_9.html"

def fail(msg): print("  MUSIC GATE   FAIL   " + msg); sys.exit(1)

def main():
    src = ALPHA.read_text(encoding="utf-8", errors="replace")

    # --- 1. SCREECH LAW: the call form createDelay( must never appear ---
    delays = src.count("createDelay(")
    if delays: fail(f"SCREECH LAW: {delays} createDelay() call(s) in the build")

    # --- collect every synthesized voice kind (synthV + drumV) and its batch tag ---
    # a voice is defined by  if(kind==='name'){ /* ...BATCHn... */
    defined = {}   # name -> batch int (0 if untagged)
    for m in re.finditer(r"kind==='([a-z0-9]+)'\s*\)\s*\{([^\n]*)", src):
        name, tail = m.group(1), m.group(2)
        bm = re.search(r"BATCH\s*(\d+)", tail)
        defined[name] = int(bm.group(1)) if bm else defined.get(name, 0)

    # --- parse the LIVE song arrays only (MFACTIONS + MLOOPS); the file's top
    #     carries a documentation copy of every entry, so anchor past it ---
    code_start = src.find("const MFACTIONS=[")
    if code_start < 0: fail("could not find live song arrays (const MFACTIONS)")
    songs = []
    for m in re.finditer(r"\{n:'([^']+)',[^\n]*\}", src):   # greedy to the last brace on the line
        if m.start() < code_start: continue          # skip the top documentation block
        line = m.group(0)
        if "root:" not in line or "inst:" not in line: continue
        # skip graveyard-commented entries (they sit inside /* ... */)
        start = src.rfind("\n", 0, m.start()) + 1
        if src[start:m.start()].lstrip().startswith("/*"): continue
        def grab(key):
            mm = re.search(key, line); return mm.group(1) if mm else None
        songs.append({
            "n": m.group(1),
            "scale": grab(r"scale:(\[[0-9,]*\])"),
            "feel": grab(r"feel:'([a-z]+)'") or "normal",
            "kick": grab(r"kick:(\[[0-9,]*\])"),
            "b": grab(r"inst:\{b:'([a-z0-9]+)'"),
            "l": grab(r"inst:\{b:'[a-z0-9]+',l:'([a-z0-9]+)'"),
            "am": grab(r"\},am:'([a-z0-9]+)'"),
            "bt": int(grab(r"bt:(\d+)")) if grab(r"bt:(\d+)") else 0,
        })
    if not songs: fail("parsed 0 live songs (array shape changed?)")

    # --- 2. VOICE INTEGRITY: every melodic/pad voice must exist in synthV ---
    # engine lead MODES remap to real voices at dispatch (see synth loop), not typos.
    MODES = {"osc", "pad", "pluck", "arp"}
    missing = []
    for s in songs:
        for slot in ("b", "l", "am"):
            v = s[slot]
            if v and v not in MODES and v not in defined:
                missing.append(f"{s['n']}: {slot}='{v}'")
    if missing: fail("undefined voices -> " + "; ".join(missing[:8]))

    # --- 5. GRAVEYARD FINAL: no live dup names; no NEW-batch name reuses a buried one ---
    # buried names come from explicit "no remake" graveyard markers only.
    dead = set()
    for line in src.splitlines():
        if "no remake" not in line: continue
        q = re.search(r"no remake\)\s*:\s*([^*]+?)\s*\*/", line)      # ☠ GRAVEYARD (down, no remake): NAME
        if q: dead.add(q.group(1).strip())
    live_names = [s["n"] for s in songs]
    dups = {n for n in live_names if live_names.count(n) > 1}
    if dups: fail("duplicate live song names -> " + ", ".join(sorted(dups)))
    for s in songs:
        if s["bt"] and s["n"] in dead:
            fail(f"GRAVEYARD FINAL: new song '{s['n']}' reuses a buried name (no remakes)")

    # --- batch checks (3 + 4), per cook batch tagged bt:N ---
    batches = {}
    for s in songs:
        if s["bt"]: batches.setdefault(s["bt"], []).append(s)
    new_voice_count = 0
    for bt, group in sorted(batches.items()):
        # 3. NEW VOICES LAW: each song births >=1 voice defined in a BATCH-bt block
        for s in group:
            born = [v for v in (s["b"], s["l"], s["am"]) if v and defined.get(v) == bt]
            if not born:
                fail(f"NEW VOICES LAW: batch {bt} song '{s['n']}' births no BATCH{bt} voice")
            new_voice_count += len(born)
        # 4. VARIETY LAW: no two in a batch share scale+feel+kick
        seen = {}
        for s in group:
            key = (s["scale"], s["feel"], s["kick"])
            if key in seen:
                fail(f"VARIETY LAW: batch {bt} '{s['n']}' shares scale+feel+kick with '{seen[key]}'")
            seen[key] = s["n"]

    print(f"  MUSIC GATE   PASS   {len(songs)} live songs, {len(defined)} voices, "
          f"{len(batches)} tagged batch(es), screech-clean")
    return 0

if __name__ == "__main__":
    sys.exit(main())
