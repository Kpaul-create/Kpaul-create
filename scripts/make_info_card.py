#!/usr/bin/env python3
"""Generate generated/info-card.svg — neofetch-style terminal card."""

import os

OUT = os.path.join(os.path.dirname(__file__), "..", "generated", "info-card.svg")

LINES = [
    ("label", "KANISH@GITHUB"),
    ("sep",   "─" * 36),
    ("row",   ("OS",       "GitHub / Linux")),
    ("row",   ("NAME",     "Kanish Paul")),
    ("row",   ("ROLE",     "CSE / AI-ML")),
    ("row",   ("FOCUS",    "Artificial Intelligence")),
    ("row",   ("BUILDING", "AI · Robotics · Vision")),
    ("row",   ("STACK",    "Python · PyTorch · React")),
    ("row",   ("STATUS",   "████████░░  learning")),
    ("sep",   "─" * 36),
    ("quote", "build → break → understand → rebuild"),
]

W, H = 480, 260
FONT = "monospace"
BG   = "#0d1117"
FG   = "#c9d1d9"
ACC  = "#58a6ff"
DIM  = "#484f58"
LBL  = "#8b949e"

def svg_text(x, y, text, fill, size=13, bold=False, delay=0):
    fw = "bold" if bold else "normal"
    anim = (
        f'<animate attributeName="opacity" values="0;1" dur="0.3s" '
        f'begin="{delay:.2f}s" fill="freeze"/>'
    ) if delay >= 0 else ""
    return (
        f'<text x="{x}" y="{y}" font-family="{FONT}" font-size="{size}" '
        f'font-weight="{fw}" fill="{fill}" opacity="0">'
        f'{text}{anim}</text>'
    )

def build():
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" '
        f'viewBox="0 0 {W} {H}">',
        f'<rect width="{W}" height="{H}" fill="{BG}" rx="4"/>',
        # left colour blocks (neofetch palette strip)
        *[f'<rect x="{16 + i*14}" y="{H-22}" width="12" height="10" fill="{c}"/>'
          for i, c in enumerate(["#21262d","#388bfd","#3fb950","#d29922",
                                  "#f85149","#bc8cff","#39c5cf","#c9d1d9"])],
    ]

    y = 30
    delay = 0.0
    step  = 0.12

    for kind, val in LINES:
        if kind == "label":
            parts.append(svg_text(16, y, val, ACC, size=14, bold=True, delay=delay))
            y += 22
        elif kind == "sep":
            parts.append(svg_text(16, y, val, DIM, size=12, delay=delay))
            y += 18
        elif kind == "row":
            k, v = val
            parts.append(svg_text(16,  y, f"{k:<10}", LBL, delay=delay))
            parts.append(svg_text(130, y, v,           FG,  delay=delay))
            y += 19
        elif kind == "quote":
            parts.append(svg_text(16, y, val, DIM, size=11, delay=delay))
            y += 18
        delay += step

    parts.append("</svg>")
    with open(OUT, "w") as f:
        f.write("\n".join(parts))
    print(f"wrote {OUT}")

if __name__ == "__main__":
    build()
