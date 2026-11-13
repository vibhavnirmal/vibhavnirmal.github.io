"""Check resources/data.json before pushing: run `python3 scripts/check_data.py`."""
import json
import re
import sys
from pathlib import Path

root = Path(__file__).resolve().parent.parent
projects = json.loads((root / "resources/data.json").read_text())["projects"]
errors = []
for p in projects:
    title = p.get("title", "<no title>")
    if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", p.get("date", "")):
        errors.append(f"{title}: date {p.get('date')!r} is not YYYY-MM-DD")
    media = p.get("image", "")
    if media and not media.startswith("http"):
        if not (root / media).is_file():
            errors.append(f"{title}: missing file {media}")
        if media.endswith(".mp4") and not (root / media).with_suffix(".jpg").is_file():
            errors.append(f"{title}: missing poster {Path(media).with_suffix('.jpg')}")

print("\n".join(errors) or f"OK: {len(projects)} projects")
sys.exit(1 if errors else 0)
