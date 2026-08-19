# backend/app/src/utils/vehicle_pass_mapper.py
"""
Maps a raw Artemis vehicle-pass record (as returned by
POST /artemis/api/xtransfer-qcs/v1/vehicle/ds/query/page)
into a row tuple matching the `vehicle_pass` Postgres table,
and builds the upsert SQL for it.
"""

import logging
from datetime import datetime

logger = logging.getLogger(__name__)

# Ordered list of destination columns - keep in sync with the table DDL.
COLUMNS = [
    "pass_id", "crossing_id", "crossing_index_code", "lane_no", "direction_index",
    "plate_no", "plate_type", "pass_time", "vehicle_speed", "vehicle_len",
    "plate_color", "vehicle_color", "vehicle_type", "vehicle_color_depth",
    "vehicle_logo", "vehicle_sub_logo", "vehicle_model", "tfs_id", "vehicle_lamp",
    "front_child", "pilot_sunvisor", "vice_pilot_sunvisor", "sunroof", "pdvs",
    "uphone", "vice_pilot_safebelt", "pendant", "label", "label_num",
    "tissue_box", "decoration", "dang_mark", "envpro_sign", "vehicle_sign",
    "temp_plate_no", "plate_position", "sunroof_position", "copilot",
    "link_face_vehicle_id", "check_result", "sequence_id", "plate_belong",
    "pic_url_num", "data_sources", "vehicle_state", "area", "cascade",
    "area_code", "pilot_safebelt", "multi_vehicle", "recognition_sign",
    "plate_no_similarity", "mobile_device_latitude", "vehicle_head",
    "vehicle_info_level", "storage_time", "sub_feature", "video_structure",
    "plate_tail", "plate_province", "plate_check_result", "plate_state",
    "mobile_device_longitude", "plate_diff", "link_vehicle_mac_id",
    "luggage_rack", "vehicle_spray_painted", "spare_tire", "card",
    "muck_truck", "cover_plate", "tricycle_canopy", "license_bright",
    "illegal_traffic_event", "ecolabel", "card_num", "card_type",
    "pdvs_position", "card_position", "decoration_position",
    "tissue_box_position", "pendant_position", "big_data_plate_no",
    "confidence", "copilot_position", "crossing_type",
    "dictionary_transfer_fields", "exchange_plate_no", "front_confidence",
    "front_confidence_detail", "is_main_vehicle", "label_position",
    "link_vehicle_rfid_id", "pass_time_local", "pass_time_timezone",
    "pilot_position", "police_plate_no", "tfs_index_code",
    "vehicle_entry_exiting_status", "vehicle_is_slave", "row_key",
]


def _parse_iso_dt(value):
    """'2026-08-13T10:18:57.818+07:00' -> aware datetime, or None."""
    if not value:
        return None
    try:
        return datetime.fromisoformat(value)
    except ValueError:
        return None


def _parse_storage_time(value):
    """'Thu Aug 13 10:18:57 ICT 2026' -> naive datetime, or None."""
    if not value:
        return None
    try:
        parts = value.split()
        if len(parts) == 6:
            parts.pop(4)  # drop tz abbreviation, e.g. "ICT"
            value = " ".join(parts)
        return datetime.strptime(value, "%a %b %d %H:%M:%S %Y")
    except ValueError:
        logger.warning(f"Could not parse storageTime: {value!r}")
        return None


def _safe_int(value):
    if value is None:
        return None
    try:
        return int(float(value))
    except (ValueError, TypeError):
        return None


def _build_field_dict(rec: dict) -> dict:
    """
    Build the full dict of vehicle_pass fields from one Artemis record.
    Shared by map_record() here and by vehicle_alarm_mapper, which needs
    the same base fields plus its own alarm-specific columns.
    """
    crossing = rec.get("crossing") or {}
    pass_time_dt = _parse_iso_dt(rec.get("passTime"))

    pass_time_tz = None
    if pass_time_dt is not None:
        offset = pass_time_dt.utcoffset()
        if offset is not None:
            total_minutes = int(offset.total_seconds() // 60)
            sign = "+" if total_minutes >= 0 else "-"
            pass_time_tz = f"{sign}{abs(total_minutes)//60:02d}:{abs(total_minutes)%60:02d}"

    plate_state = rec.get("plateNoStatus")

    return {
        "pass_id": rec.get("passId"),
        "crossing_id": None,  # no integer crossing id in the API payload
        "crossing_index_code": rec.get("crossingIndexCode"),
        "lane_no": rec.get("laneNo"),
        "direction_index": rec.get("directionIndex"),
        "plate_no": rec.get("plateNo"),
        "plate_type": rec.get("plateType"),
        "pass_time": pass_time_dt,
        "vehicle_speed": _safe_int(rec.get("vehicleSpeed")),
        "vehicle_len": _safe_int(rec.get("vehicleLen")),
        "plate_color": rec.get("plateColor"),
        "vehicle_color": rec.get("vehicleColor"),
        "vehicle_type": rec.get("vehicleType"),
        "vehicle_color_depth": rec.get("vehicleColorDepth"),
        "vehicle_logo": rec.get("vehicleLogo"),
        "vehicle_sub_logo": rec.get("vehicleSubLogo"),
        "vehicle_model": rec.get("vehicleModel"),
        "tfs_id": rec.get("tfsId"),
        "vehicle_lamp": rec.get("vehicleLamp"),
        "front_child": rec.get("frontChild"),
        "pilot_sunvisor": rec.get("pilotSunvisor"),
        "vice_pilot_sunvisor": rec.get("vicePilotSunvisor"),
        "sunroof": rec.get("sunroof"),
        "pdvs": rec.get("pdvs"),
        "uphone": rec.get("usePhoneName"),
        "vice_pilot_safebelt": rec.get("vicePilotSafebelt"),
        "pendant": rec.get("pendant"),
        "label": rec.get("label"),
        "label_num": _safe_int(rec.get("labelNum")),
        "tissue_box": rec.get("tissueBox"),
        "decoration": rec.get("decoration"),
        "dang_mark": rec.get("dangMark"),
        "envpro_sign": rec.get("envproSign"),
        "vehicle_sign": rec.get("vehicleSign"),
        "temp_plate_no": rec.get("tempPlateNo"),
        "plate_position": rec.get("platePosition"),
        "sunroof_position": rec.get("sunroofPosition"),
        "copilot": rec.get("copilot"),
        "link_face_vehicle_id": rec.get("linkFaceVehicleId"),
        "check_result": rec.get("crIndexName"),
        "sequence_id": rec.get("sequenceId"),
        "plate_belong": rec.get("plateBelong"),
        "pic_url_num": rec.get("picUrlNum"),
        "data_sources": rec.get("dataSources"),
        "vehicle_state": rec.get("vehicleState"),
        "area": rec.get("regionIndexCode"),
        "cascade": rec.get("cascade"),
        "area_code": rec.get("regionIndexCode"),
        "pilot_safebelt": rec.get("pilotSafebelt"),
        "multi_vehicle": rec.get("multiVehicle"),
        "recognition_sign": rec.get("recognitionSign"),
        "plate_no_similarity": _safe_int(rec.get("plateNoSimilarity")),
        "mobile_device_latitude": rec.get("deviceLatitude"),
        "vehicle_head": rec.get("vehicleHeadName"),
        "vehicle_info_level": _safe_int(rec.get("vehicleInfoLevel")),
        "storage_time": _parse_storage_time(rec.get("storageTime")),
        "sub_feature": rec.get("subFeature"),
        "video_structure": rec.get("videoStructure"),
        "plate_tail": rec.get("plateTail"),
        "plate_province": rec.get("plateProvince"),
        "plate_check_result": rec.get("plateCheckResult"),
        "plate_state": str(plate_state) if plate_state is not None else None,
        "mobile_device_longitude": rec.get("deviceLongitude"),
        "plate_diff": rec.get("plateDiff"),
        "link_vehicle_mac_id": rec.get("linkVehicleMacId"),
        "luggage_rack": rec.get("luggageRack"),
        "vehicle_spray_painted": rec.get("vehicleSprayPainted"),
        "spare_tire": rec.get("spareTire"),
        "card": rec.get("card"),
        "muck_truck": rec.get("muckTruck"),
        "cover_plate": rec.get("coverPlate"),
        "tricycle_canopy": rec.get("tricycleCanopy"),
        "license_bright": rec.get("licenseBright"),
        "illegal_traffic_event": rec.get("violativeActionName"),
        "ecolabel": rec.get("ecolabel"),
        "card_num": rec.get("cardNum"),
        "card_type": rec.get("cardType"),
        "pdvs_position": rec.get("pdvsPosition"),
        "card_position": rec.get("cardPosition"),
        "decoration_position": rec.get("decorationPosition"),
        "tissue_box_position": rec.get("tissueBoxPosition"),
        "pendant_position": rec.get("pendantPosition"),
        "big_data_plate_no": rec.get("bigDataPlateNo"),
        "confidence": rec.get("confidence"),
        "copilot_position": rec.get("copilotPosition"),
        "crossing_type": crossing.get("crossingType"),
        "dictionary_transfer_fields": rec.get("dictionaryTransferFields"),
        "exchange_plate_no": rec.get("exchangePlateNo"),
        "front_confidence": rec.get("frontConfidence"),
        "front_confidence_detail": rec.get("frontConfidenceDetail"),
        "is_main_vehicle": rec.get("isMainVehicle"),
        "label_position": rec.get("labelPosition"),
        "link_vehicle_rfid_id": rec.get("linkVehicleRfidId"),
        "pass_time_local": pass_time_dt.replace(tzinfo=None) if pass_time_dt else None,
        "pass_time_timezone": pass_time_tz,
        "pilot_position": rec.get("pilotPosition"),
        "police_plate_no": rec.get("policePlateNo"),
        "tfs_index_code": rec.get("tfsIndexCode"),
        "vehicle_entry_exiting_status": rec.get("vehicleEntryExitingStatus"),
        "vehicle_is_slave": rec.get("vehicleIsSlave"),
        "row_key": rec.get("cameraIndexCode"),
    }


def map_record(rec: dict) -> tuple:
    """Map one Artemis record dict to a tuple ordered per COLUMNS."""
    row = _build_field_dict(rec)
    return tuple(row[col] for col in COLUMNS)


def build_upsert_sql(table_name: str, columns: list, conflict_column: str = "pass_id") -> str:
    """
    Build an `INSERT ... VALUES %s ON CONFLICT (...) DO UPDATE` statement
    for use with psycopg2.extras.execute_values.

    Requires a UNIQUE/PRIMARY KEY constraint on `conflict_column`, e.g.:
        ALTER TABLE vehicle_pass ADD CONSTRAINT vehicle_pass_pass_id_key UNIQUE (pass_id);
    """
    update_cols = [c for c in columns if c != conflict_column]
    set_clause = ", ".join(f"{c} = EXCLUDED.{c}" for c in update_cols)
    columns_clause = ", ".join(columns)
    return (
        f"INSERT INTO {table_name} ({columns_clause}) VALUES %s "
        f"ON CONFLICT ({conflict_column}) DO UPDATE SET {set_clause}"
    )


UPSERT_SQL = build_upsert_sql("vehicle_pass", COLUMNS)