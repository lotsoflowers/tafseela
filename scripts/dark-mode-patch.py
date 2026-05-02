#!/usr/bin/env python3
"""Add dark: variants to common Tafseela light-mode tokens across all source files.

Conservative — only matches whole-class tokens (with a space or quote on each
side) so it won't touch things like `text-ink/40` or `bg-white/80`. After each
match, checks the surrounding string for an existing `dark:<replacement>` and
skips if found, so it's idempotent.

Run from repo root: python scripts/dark-mode-patch.py
"""

from __future__ import annotations
import re
from pathlib import Path

# (light_token, dark_replacement)
RULES: list[tuple[str, str]] = [
    # Page / surface backgrounds
    ('bg-cream',  'dark:bg-background'),
    ('bg-white',  'dark:bg-card'),
    ('bg-blush',  'dark:bg-secondary'),
    # Text
    ('text-ink',  'dark:text-foreground'),
    ('text-plum', 'dark:text-soft'),
    # Borders
    ('border-soft', 'dark:border-border'),
]

# Token boundary characters (left + right)
LEFT  = r'(?<=[\s"\'`])'
RIGHT = r'(?=[\s"\'`])'

ROOT = Path(__file__).resolve().parent.parent
SRC  = ROOT / 'src'
SKIP_DIRS = {'components/ui'}  # leave shadcn primitives alone

def patch_file(path: Path) -> int:
    text = path.read_text(encoding='utf-8')
    original = text
    edits = 0

    for light, dark in RULES:
        # Match the bare token only (not bg-white/80 etc.)
        pattern = re.compile(LEFT + re.escape(light) + RIGHT)

        def replace(match: re.Match) -> str:
            nonlocal edits
            # Look at the enclosing className-ish token group on this line.
            # If the dark replacement already exists adjacent, skip.
            line_start = text.rfind('\n', 0, match.start()) + 1
            line_end   = text.find('\n', match.end())
            if line_end == -1:
                line_end = len(text)
            line = text[line_start:line_end]
            if dark in line:
                return match.group(0)
            edits += 1
            return f'{light} {dark}'

        text = pattern.sub(replace, text)

    if text != original:
        path.write_text(text, encoding='utf-8')
    return edits

def should_skip(path: Path) -> bool:
    rel = path.relative_to(SRC).as_posix()
    return any(rel.startswith(skip) for skip in SKIP_DIRS)

def main() -> None:
    total = 0
    files_changed = 0
    for path in sorted(SRC.rglob('*.tsx')) + sorted(SRC.rglob('*.ts')):
        if not path.is_file() or should_skip(path):
            continue
        edits = patch_file(path)
        if edits:
            files_changed += 1
            total += edits
            print(f'{path.relative_to(ROOT)}: +{edits}')
    print(f'\nTotal: {total} edits across {files_changed} files.')

if __name__ == '__main__':
    main()
