# backend/app/src/utils/vehicle_url_mapper.py
"""
Maps a raw Artemis vehicle-pass record into a row tuple matching the
`vehicle_url` Postgres table.

Only plate_pic_url, target_sub_url, image_path, and pass_time/pass_id have
a confirmed source field in the sample Artemis payload seen so far.
face_pic_url, vice_pilot_url, and vehicle_pic_url_1..6 have no matching
field in the sample records - they're mapped to best-guess key names below
(commented) and will stay NULL until confirmed against a live payload that
actually contains them (e.g. richer algorithm packages / other crossing
types may return more picture fields than the two sample records did).
"""

from src.utils.vehicle_pass_mapper import _parse_iso_dt, build_upsert_sql

COLUMNS = [
    "pass_id",
    "face_pic_url",
    "plate_pic_url",
    "target_sub_url",
    "vice_pilot_url",
    "vehicle_pic_url_1",
    "vehicle_pic_url_2",
    "vehicle_pic_url_3",
    "vehicle_pic_url_4",
    "vehicle_pic_url_5",
    "vehicle_pic_url_6",
    "image_path",
    "pass_time",
]


def map_url_record(rec: dict) -> tuple:
    """Map one Artemis record dict to a tuple ordered per COLUMNS (vehicle_url)."""
    row = {
        "pass_id": rec.get("passId"),
        # Best-guess key names - not present in the sample payload seen so far.
        "face_pic_url": rec.get("facePicUrl"),
        "plate_pic_url": rec.get("platePicUrl"),
        "target_sub_url": rec.get("targetSubUrl"),
        "vice_pilot_url": rec.get("vicePilotUrl"),
        "vehicle_pic_url_1": rec.get("vehiclePicUrl1"),
        "vehicle_pic_url_2": rec.get("vehiclePicUrl2"),
        "vehicle_pic_url_3": rec.get("vehiclePicUrl3"),
        "vehicle_pic_url_4": rec.get("vehiclePicUrl4"),
        "vehicle_pic_url_5": rec.get("vehiclePicUrl5"),
        "vehicle_pic_url_6": rec.get("vehiclePicUrl6"),
        "image_path": rec.get("imagePath"),
        "pass_time": _parse_iso_dt(rec.get("passTime")),
    }

    return tuple(row[col] for col in COLUMNS)


UPSERT_SQL = build_upsert_sql("vehicle_url", COLUMNS)