import sys
import pandas as pd
import pdfplumber
import os
import re

# Force UTF-8
sys.stdout.reconfigure(encoding='utf-8')

def clean_text(text):
    if not text: return ""
    return str(text).replace('\n', ' ').strip()

# ─────────────────────────────────────────────────────────────────
# EXAM TIMETABLE EXCEL  (has a "Date" column with day names)
# ─────────────────────────────────────────────────────────────────
def parse_exam_timetable_excel(file_path):
    output_lines = []
    try:
        df_raw = pd.read_excel(file_path, header=None)

        # Find header row containing "Date" + "Floor"/"Venue"
        header_row_idx = 0
        for i, row in df_raw.iterrows():
            row_str = " ".join([str(x).lower() for x in row if str(x) != 'nan'])
            if "date" in row_str and ("floor" in row_str or "venue" in row_str):
                header_row_idx = i
                break

        df = pd.read_excel(file_path, header=header_row_idx)
        df = df.fillna("")

        # Detect time slot columns (contain AM/PM or time range)
        time_slot_cols = [col for col in df.columns if any(t in str(col).lower() for t in ['8:15', '11:30', '2:45', 'am', 'pm'])]

        # Detect Floor, Venue, Date columns
        floor_col = next((c for c in df.columns if 'floor' in str(c).lower()), None)
        venue_col = next((c for c in df.columns if any(k in str(c).lower() for k in ['venue', 'room', 'lab'])), None)
        date_col  = next((c for c in df.columns if 'date' in str(c).lower()), None)

        for _, row in df.iterrows():
            floor = clean_text(row[floor_col]) if floor_col else ""
            venue = clean_text(row[venue_col]) if venue_col else ""
            date  = clean_text(row[date_col])  if date_col  else ""

            if not date or "date" in date.lower():
                continue

            for time_col in time_slot_cols:
                cell_content = clean_text(row[time_col])
                if cell_content and len(cell_content) > 4:
                    line = (
                        f"[EXAM SCHEDULE] "
                        f"Date: {date} | "
                        f"Time: {clean_text(str(time_col))} | "
                        f"Venue: {venue} | "
                        f"Floor: {floor} | "
                        f"Info: {cell_content}"
                    )
                    output_lines.append(line)

        return "\n".join(output_lines)
    except Exception as e:
        return f"Error reading Exam Timetable Excel: {str(e)}"


# ─────────────────────────────────────────────────────────────────
# EXAM PDF
# ─────────────────────────────────────────────────────────────────
def parse_exam_pdf(file_path):
    output_lines = []
    try:
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                tables = page.extract_tables()

                for table in tables:
                    if not table or len(table) < 3: continue

                    header_row = None
                    header_idx = -1

                    for idx, row in enumerate(table[:5]):
                        row_str = " ".join([str(x).lower() for x in row if x])
                        if "monday" in row_str:
                            header_row = row
                            header_idx = idx
                            break

                    if not header_row: continue

                    date_map = {}
                    for c_idx, cell in enumerate(header_row):
                        if cell and any(day in cell.lower() for day in ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]):
                            date_map[c_idx] = clean_text(cell)

                    current_slot = "Unknown Time"

                    for row in table[header_idx+1:]:
                        col0_text = clean_text(row[0]).lower()

                        if "08:30" in col0_text or "slot 01" in col0_text:
                            current_slot = "08:30 AM - 11:00 AM"
                        elif "11:30" in col0_text or "slot 02" in col0_text:
                            current_slot = "11:30 AM - 02:00 PM"
                        elif "02:30" in col0_text or "slot 03" in col0_text:
                            current_slot = "02:30 PM - 05:00 PM"

                        for c_idx, cell_content in enumerate(row):
                            if c_idx not in date_map: continue

                            content = clean_text(cell_content)
                            if len(content) > 5:
                                date = date_map[c_idx]
                                line = f"[EXAM SCHEDULE] Date: {date} | Time: {current_slot} | Info: {content}"
                                output_lines.append(line)

        return "\n".join(output_lines)
    except Exception as e:
        return f"Error reading Exam PDF: {str(e)}"


# ─────────────────────────────────────────────────────────────────
# CLASS SCHEDULE EXCEL  (Floor | Venue | time-slot columns)
# Layout: Row 0 = title, Row 1 = DAY NAME, Row 2 = headers
# ─────────────────────────────────────────────────────────────────
def parse_class_schedule_excel(file_path):
    output_lines = []
    try:
        df_raw = pd.read_excel(file_path, header=None)

        # ── 1. Extract the day name (e.g. MONDAY, TUESDAY …) from first 3 rows
        day_name = ""
        for i in range(min(3, len(df_raw))):
            for val in df_raw.iloc[i]:
                v = str(val).strip().upper()
                if v in ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"]:
                    day_name = v.capitalize()
                    break
            if day_name:
                break

        # ── 2. Find the header row (Floor / Venue / time-slot headers)
        header_row_idx = 0
        for i, row in df_raw.iterrows():
            row_str = row.astype(str).str.lower().to_string()
            if "venue" in row_str or "room" in row_str or "8:15" in row_str:
                header_row_idx = i
                break

        df = pd.read_excel(file_path, header=header_row_idx)

        # ── 3. Identify the Room/Venue column
        room_col_name = None
        for col in df.columns:
            if any(k in str(col).lower() for k in ["venue", "room"]):
                room_col_name = col
                break
        if not room_col_name:
            room_col_name = df.columns[1]   # fallback to second column

        # ── 4. Forward-fill room names (merged cells appear as NaN below)
        df[room_col_name] = df[room_col_name].ffill()
        df = df.fillna("")

        # ── 5. Identify time-slot columns by name pattern
        time_cols = [
            c for c in df.columns
            if c != room_col_name and any(
                t in str(c) for t in ['8:15', '11:30', '11:00', '2:45', '6:00']
            )
        ]

        # ── 6. Emit one structured line per (room, time, class) triple
        for _, row in df.iterrows():
            room = clean_text(row[room_col_name])
            if not room or "venue" in room.lower() or room.lower() == 'nan':
                continue

            for tc in time_cols:
                class_info = clean_text(row[tc])
                # Skip empty, headers, and generic "Lab Exam" placeholders
                if (not class_info
                        or len(class_info) <= 3
                        or class_info.lower() in ['lab exams', 'lab exam', 'nan']):
                    continue

                line = (
                    f"[CLASS SCHEDULE] "
                    f"Day: {day_name} | "
                    f"Time: {clean_text(str(tc))} | "
                    f"Room: {room} | "
                    f"Class: {class_info}"
                )
                output_lines.append(line)

        return "\n".join(output_lines)
    except Exception as e:
        return f"Error reading Class Excel: {str(e)}"


# ─────────────────────────────────────────────────────────────────
# AUTO-DETECT: exam timetable vs class schedule
# ─────────────────────────────────────────────────────────────────
def smart_parse_excel(file_path):
    try:
        df = pd.read_excel(file_path, header=None)
        all_text = df.astype(str).to_string().lower()

        # Exam timetable always has a column literally named "date"
        # Class schedule never does — it just has a day name in the first rows
        if "date" in all_text and any(
            d in all_text for d in ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
        ):
            result = parse_exam_timetable_excel(file_path)
            if result and "Error" not in result:
                return result

        return parse_class_schedule_excel(file_path)
    except Exception as e:
        return f"Error: {str(e)}"


# ─────────────────────────────────────────────────────────────────
# ENTRY POINT
# ─────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("No file provided")
        sys.exit(1)

    fpath = sys.argv[1]
    ext = os.path.splitext(fpath)[1].lower()

    if ext == '.pdf':
        print(parse_exam_pdf(fpath))
    elif ext in ['.xlsx', '.xls']:
        print(smart_parse_excel(fpath))
    else:
        print("Unsupported file format")