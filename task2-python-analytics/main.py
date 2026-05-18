import json
from pathlib import Path
from datetime import datetime
import pandas as pd


DATA_FILE = Path("appointments.json")
OUTPUT_FILE = Path("doctor_day_stats.csv")


def load_appointments_from_file(path: Path) -> pd.DataFrame:
  with path.open(encoding="utf-8") as f:
    data = json.load(f)
  df = pd.DataFrame(data)
  return df


def calculate_duration(start_time: str, end_time: str) -> int:
  fmt = "%H:%M"
  start = datetime.strptime(start_time, fmt)
  end = datetime.strptime(end_time, fmt)
  delta = end - start
  return int(delta.total_seconds() // 60)


def preprocess_df(df: pd.DataFrame) -> pd.DataFrame:
  df["date"] = pd.to_datetime(df["date"])
  if "durationMinutes" not in df.columns:
    df["durationMinutes"] = df.apply(
      lambda row: calculate_duration(row["startTime"], row["endTime"]),
      axis=1
    )
  return df


def aggregate_by_doctor_and_day(df: pd.DataFrame) -> pd.DataFrame:
  grouped = df.groupby(["doctorName", "specialty", "date"])

  stats = grouped.agg(
    plannedVisits=("appointmentId", "count"),
    completedVisits=("status", lambda x: (x == "Завершён").sum()),
    cancelledVisits=("status", lambda x: (x == "Отменён").sum()),
    noShowVisits=("status", lambda x: (x == "Неявка").sum()),
    totalDurationMinutes=("durationMinutes", "sum"),
  ).reset_index()

  stats["noShowRate"] = stats["noShowVisits"] / stats["plannedVisits"]
  stats["utilizationPercent"] = stats["totalDurationMinutes"] / 480

  return stats


def save_stats_to_csv(df: pd.DataFrame, path: Path) -> None:
  df.to_csv(path, index=False, encoding="utf-8-sig")


def main():
  df = load_appointments_from_file(DATA_FILE)
  df = preprocess_df(df)
  stats = aggregate_by_doctor_and_day(df)
  save_stats_to_csv(stats, OUTPUT_FILE)
  print(f"Saved stats to {OUTPUT_FILE.resolve()}")


if __name__ == "__main__":
  main()