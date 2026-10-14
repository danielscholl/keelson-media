#!/usr/bin/env python3
"""Usage: seg.py <stream kf|cf> <name> <from> <to> — renders one window of raw/run (seconds after marks.start) to raw/<name>.mp4,
and writes raw/<name>-meta.json with the run's marks rebased onto that clip."""
import json, os, subprocess, sys, tempfile
here = os.path.dirname(os.path.abspath(__file__)); raw = os.path.join(here, "..", "raw"); run = os.path.join(raw, "run")
stream, name, a, b = sys.argv[1], sys.argv[2], float(sys.argv[3]), float(sys.argv[4])
meta = json.load(open(os.path.join(run, "meta.json"))); s = meta["marks"]["start"]
tmp = tempfile.mkdtemp(prefix="seg-"); os.symlink(os.path.join(run, stream), os.path.join(tmp, "frames"))
json.dump({"frames": meta["kframes" if stream == "kf" else "cframes"], "marks": {"start": s + a, "end": s + b}}, open(os.path.join(tmp, "meta.json"), "w"))
subprocess.run([sys.executable, os.path.join(here, "../../../../tools/frames2mp4.py"), tmp, os.path.join(raw, name + ".mp4")], check=True)
json.dump({"marks": {k: round(v - s - a, 3) for k, v in meta["marks"].items() if a <= v - s <= b}}, open(os.path.join(raw, name + "-meta.json"), "w"), indent=1)
