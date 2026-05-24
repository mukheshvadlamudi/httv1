from __future__ import annotations
from typing import Optional
from pathlib import Path

import pandas as pd
from sqlalchemy import select

from app.core.config import settings
from app.db.session import SessionLocal
from app.models import Resource


def clean(value: object) -> Optional[str]:
    if pd.isna(value):
        return None
    text = str(value).strip()
    return text or None


def import_resources(path: str | Optional[Path] = None) -> int:
    source = Path(path or settings.excel_source_path or "")
    if not source.exists():
        raise FileNotFoundError("Set EXCEL_SOURCE_PATH to the private workbook path before importing resources.")

    website_rows = pd.read_excel(source, sheet_name="Websites", header=1).dropna(how="all")
    youtube_rows = pd.read_excel(source, sheet_name="YouTube", header=3).dropna(how="all")

    resources: list[dict[str, Optional[str]]] = []
    for _, row in website_rows.iterrows():
        if clean(row.get("Resource")) and clean(row.get("URL")):
            resources.append(
                {
                    "source_type": "website",
                    "name": clean(row.get("Resource")),
                    "url": clean(row.get("URL")),
                    "category": clean(row.get("Category")),
                    "why_useful": clean(row.get("Why useful")),
                }
            )
    for _, row in youtube_rows.iterrows():
        if clean(row.get("YouTuber / Channel")) and clean(row.get("YouTube Channel URL")):
            resources.append(
                {
                    "source_type": "youtube",
                    "name": clean(row.get("YouTuber / Channel")),
                    "url": clean(row.get("YouTube Channel URL")),
                    "category": "YouTube Tutorial Channel",
                    "why_useful": "Tutorial channel from the private Futurelab knowledge vault.",
                }
            )

    imported = 0
    db = SessionLocal()
    try:
        for item in resources:
            existing = db.scalar(
                select(Resource).where(Resource.source_type == item["source_type"], Resource.url == item["url"])
            )
            if existing:
                existing.name = item["name"] or existing.name
                existing.category = item["category"]
                existing.why_useful = item["why_useful"]
            else:
                db.add(Resource(**item))
                imported += 1
        db.commit()
    finally:
        db.close()
    return imported


if __name__ == "__main__":
    count = import_resources()
    print(f"Imported {count} new resources.")

