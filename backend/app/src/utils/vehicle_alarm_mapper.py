# backend/app/src/utils/vehicle_alarm_mapper.py
"""
Maps a raw Artemis vehicle-pass record into a row tuple matching the
`vehicle_alarm` Postgres table (same base columns as vehicle_pass, plus
alarm/violation fields). One row is written per record regardless of
whether an alarm actually fired - alarm_id/alarm_type/etc will simply be
NULL for non-alarm records, so no data from vehicle_pass is lost.
"""

from src.utils.vehicle_pass_mapper import COLUMNS as BASE_COLUMNS, _build_field_dict, build_upsert_sql

ALARM_ONLY_COLUMNS = [
    "alarm_id",
    "alarm_plan_info",
    "alarm_process",
    "alarm_process_result",
    "alarm_type",
    "alarm_user_name",
    "violative_action",
    "violative_company",
]

# vehicle_alarm = vehicle_pass columns + alarm-specific columns
COLUMNS = BASE_COLUMNS + ALARM_ONLY_COLUMNS


def map_alarm_record(rec: dict) -> tuple:
    """Map one Artemis record dict to a tuple ordered per COLUMNS (vehicle_alarm)."""
    row = _build_field_dict(rec)

    row.update({
        "alarm_id": rec.get("alarmId"),
        "alarm_plan_info": rec.get("alarmPlanInfo"),
        "alarm_process": rec.get("alarmProcess"),
        "alarm_process_result": rec.get("alarmProcessResult"),
        "alarm_type": rec.get("alarmType"),
        "alarm_user_name": rec.get("alarmUserName"),
        "violative_action": rec.get("violativeAction"),
        # No field in the Artemis payload corresponds to "violative company"
        # (e.g. the operator/vendor responsible for the violation). Left NULL
        # until a source field is identified - flag if you find the right key.
        "violative_company": None,
    })

    return tuple(row[col] for col in COLUMNS)


UPSERT_SQL = build_upsert_sql("vehicle_alarm", COLUMNS)