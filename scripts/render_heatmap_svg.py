#!/usr/bin/env python3
"""Render data/contributions.json → generated/contrib-heatmap.svg."""

import json, os, math
from datetime import date, datetime

DATA = os.path.join(os.path.dirname(__file__), "..", "data", "contributions.json")
OUT  = os.path.join(os.path.dirname(__file__), "..", "generated", "contrib-heatmap.svg")

# ── palette (GitHub-like, monochrome-green) ──────────────────────────────────
BG     = "#0d1117"
EMPTY  = "#161b22"
COLORS = ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"]
FG     = "#8b949e"
ACC    = "#58a6ff"
FONT   = "monospace"

CELL   = 11   # cell size px
GAP    = 2    # gap px
STEP   = CELL + GAP
LEFT   = 32   # left margin (weekday labels)
TOP    = 28   # top margin (month labels)
BOT    = 36   # bottom margin (legend)

DAYS   = ["Mon", "", "Wed", "", "Fri", "", ""]

def render():
    with open(DATA) as f:
        data = json.load(f)

    days = data["days"]
    total = sum(d["count"] for d in days)

    # Pad so first day is Sunday (col 0, row 0)
    first = datetime.strptime(days[0]["date"], "%Y-%m-%d").weekday()  # Mon=0
    # GitHub grid: Sunday first
    pad = (first + 1) % 7
    padded = [None] * pad + days

    cols = math.ceil(len(padded) / 7)
    W = LEFT + cols * STEP + 20
    H = TOP + 7 * STEP + BOT

    parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" '
        f'viewBox="0 0 {W} {H}">',
        f'<rect width="{W}" height="{H}" fill="{BG}" rx="4"/>',
        # title
        f'<text x="{LEFT}" y="14" font-family="{FONT}" font-size="11" '
        f'fill="{ACC}">CONTRIBUTION ACTIVITY  —  {total:,} contributions</text>',
    ]

    # month labels
    seen_months = set()
    for ci in range(cols):
        idx = ci * 7 - pad
        if 0 <= idx < len(days):
            m = days[idx]["date"][5:7]
            if m not in seen_months:
                seen_months.add(m)
                label = datetime.strptime(days[idx]["date"], "%Y-%m-%d").strftime("%b")
                x = LEFT + ci * STEP
                parts.append(
                    f'<text x="{x}" y="{TOP - 4}" font-family="{FONT}" '
                    f'font-size="9" fill="{FG}">{label}</text>'
                )

    # weekday labels
    for ri, label in enumerate(DAYS):
        if label:
            y = TOP + ri * STEP + CELL - 1
            parts.append(
                f'<text x="0" y="{y}" font-family="{FONT}" '
                f'font-size="9" fill="{FG}">{label}</text>'
            )

    # cells — progressive reveal: each column fades in with a small delay
    total_cells = len(padded)
    for i, day in enumerate(padded):
        ci = i // 7
        ri = i % 7
        x  = LEFT + ci * STEP
        y  = TOP  + ri * STEP
        if day is None:
            color = EMPTY
            title = ""
        else:
            color = COLORS[min(day["level"], 4)]
            title = f'{day["count"]} on {day["date"]}'

        delay = round(ci * 0.015, 3)   # column-by-column reveal
        anim  = (
            f'<animate attributeName="opacity" values="0;1" '
            f'dur="0.2s" begin="{delay}s" fill="freeze"/>'
        )
        tip = f"<title>{title}</title>" if title else ""
        parts.append(
            f'<rect x="{x}" y="{y}" width="{CELL}" height="{CELL}" '
            f'rx="2" fill="{color}" opacity="0">{tip}{anim}</rect>'
        )

    # legend
    lx = LEFT
    ly = H - 16
    parts.append(
        f'<text x="{lx}" y="{ly + 9}" font-family="{FONT}" '
        f'font-size="9" fill="{FG}">Less</text>'
    )
    lx += 28
    for c in COLORS:
        parts.append(
            f'<rect x="{lx}" y="{ly}" width="10" height="10" rx="2" fill="{c}"/>'
        )
        lx += 13
    parts.append(
        f'<text x="{lx + 2}" y="{ly + 9}" font-family="{FONT}" '
        f'font-size="9" fill="{FG}">More</text>'
    )

    parts.append("</svg>")
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w") as f:
        f.write("\n".join(parts))
    print(f"wrote {OUT}  ({W}×{H}px)")

if __name__ == "__main__":
    render()
