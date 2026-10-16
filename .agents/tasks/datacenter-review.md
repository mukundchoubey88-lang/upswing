# DataCenter Page Implementation Review

## Summary

The DataCenter.tsx implementation provides a complete student data management interface with CSV import/export capabilities and data quality metrics. The implementation follows the Phase 12 spec closely, with drag-and-drop upload, column validation, preview table, and merge/replace operations all present.

**Watch for:** StatCard icon props use component references (correct) but the spec called for specific icon names — implementation is functionally equivalent. The Last Updated card shows the current date rather than actual last-update metadata from records.

**Verdict:** APPROVED

## High-level view

The page structure matches the spec: title and subtitle, four StatCards in a responsive grid, upload zone, preview table with action buttons, and export/template download buttons. Missing values counting correctly iterates all StudentRecord fields. The preview table displays all CSV columns with horizontal scroll and shows first 10 rows with proper labeling. Merge operation skips duplicates by rollNumber and reports added/skipped counts.

<details>
<summary>Issues (0)</summary>

No blocking issues found.

</details>

<details>
<summary>Details</summary>

### StatCards for data quality

Four StatCards render in a 2-column mobile / 4-column desktop grid:

- **Total Records** — uses `Users` icon, blue color, displays `students.length`
- **Missing Values** — uses `AlertTriangle` icon, amber color, counts null/empty/undefined across 24 StudentRecord fields
- **Duplicate IDs** — uses `AlertCircle` icon, red color, calculates duplicates by comparing `students.length` to unique `rollNumber` count
- **Last Updated** — uses `Calendar` icon, green color, displays `new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })`

The missing values counter iterates over a defined list of 24 fields from the StudentRecord type, checking each for null, undefined, or empty string. This satisfies the spec requirement to count ALL null/empty fields across ALL student records.

The Last Updated shows the current date at render time using the exact format string specified.

### CSV upload zone

The drag-and-drop zone is implemented with `onDragEnter`, `onDragLeave`, `onDragOver`, and `onDrop` handlers. An overlaid file input with `opacity-0` captures click events. The zone text reads "Drop CSV file here or click to browse" — matches spec.

File validation checks for `.csv` extension and uses Papa Parse with `header: true` and `skipEmptyLines: true`.

### Required column validation

The `REQUIRED_COLUMNS` array contains all 15 columns in lowercase: name, rollnumber, department, attendance, avgperformance, mathscore, programmingscore, aimlscore, failedsubjects, dayspresent, daysabsent, latecount, trend, remarks, risklevel.

Column matching is case-insensitive — the code normalizes both CSV headers and the required list to lowercase for comparison. Missing columns are displayed to the user with their original casing preserved.

### Preview table

When valid CSV data is parsed, the preview shows:

- A label "Showing X of Y rows" where X is `Math.min(10, rowCount)` and Y is the total row count
- A scrollable table with `overflow-x-auto` wrapper
- All columns from the CSV (not truncated) — `parsedData.meta.fields` drives the column headers
- First 10 rows via `parsedData.data.slice(0, 10)`

### Import action buttons

Three separate buttons render below the preview table:

1. **Replace Data** — red button, maps all CSV rows to StudentRecord format and calls `studentService.setStudents()` to replace the entire dataset
2. **Merge Data** — neutral button, preserves existing records, skips duplicate rollNumbers, appends new records with incremented IDs, and reports "Merged: X added, Y already existed (skipped)"
3. **Cancel** — outlined button, clears preview state and file input

The merge logic correctly builds a Set of existing rollNumbers, tracks added/skipped counts, and generates new IDs starting from `maxId + 1`.

### Download Sample CSV Template

The `handleDownloadTemplate()` function creates a CSV with the 15 required headers in the correct order and two example rows:

1. John Doe (STU001, CSE, Low risk, Improving trend)
2. Jane Smith (STU002, AI & ML, High risk, Declining trend)

Papa Parse `unparse` generates the CSV with explicit column ordering. The file downloads as `eduvision_student_template.csv`.

### Export Current Data

The `handleExport()` function retrieves all students via `studentService.getStudents()`, unparses to CSV, and triggers download with filename `eduvision_students_YYYY-MM-DD.csv`. The blob URL is properly revoked after download.

### Row mapping and defaults

The `mapRowToStudent()` function handles case-insensitive field access (e.g., `row.RollNumber || row.rollNumber`) and provides defaults for missing optional fields: Gender 'Male', Age 20, Year '1st Year', Section 'A', auto-generated email from rollNumber, Phone '9999999999', numeric fields 0, RiskLevel 'Low', Trend 'Stable'.

</details>

<details>
<summary>File Map</summary>

- `frontend/src/pages/DataCenter.tsx` — Complete DataCenter page with data quality metrics, CSV import/export, column validation, preview table, and merge/replace operations

</details>
