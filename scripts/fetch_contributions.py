#!/usr/bin/env python3
"""Fetch public GitHub contribution calendar → data/contributions.json.
No personal access token required — uses the public contributions page."""

import json, os, re, sys
from datetime import date, timedelta

try:
    import requests
except ImportError:
    sys.exit("pip install requests")

USER = "kpaul-create"
OUT  = os.path.join(os.path.dirname(__file__), "..", "data", "contributions.json")

def fetch():
    url = f"https://github.com/users/{USER}/contributions"
    r = requests.get(url, headers={"Accept": "text/html"}, timeout=15)
    r.raise_for_status()

    # Each day: <td ... data-date="YYYY-MM-DD" data-level="0-4" ...>
    pattern = r'data-date="(\d{4}-\d{2}-\d{2})"[^>]*data-level="(\d)"'
    raw = {d: int(lv) for d, lv in re.findall(pattern, r.text)}

    # Also try to grab count from title attribute
    count_pat = r'data-date="(\d{4}-\d{2}-\d{2})"[^>]*title="([^"]+)"'
    counts = {}
    for d, title in re.findall(count_pat, r.text):
        m = re.search(r"(\d+) contribution", title)
        counts[d] = int(m.group(1)) if m else 0

    # Build last 53 weeks
    today = date.today()
    start = today - timedelta(weeks=53)
    days  = []
    cur   = start
    while cur <= today:
        ds = cur.isoformat()
        days.append({
            "date":  ds,
            "level": raw.get(ds, 0),
            "count": counts.get(ds, 0),
        })
        cur += timedelta(days=1)

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w") as f:
        json.dump({"user": USER, "days": days}, f, separators=(",", ":"))
    print(f"wrote {len(days)} days → {OUT}")

if __name__ == "__main__":
    fetch()
