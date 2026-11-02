/**
 * CSV export utility. Generates a CSV string from an array of records and
 * triggers a browser download.
 *
 * Quoting rules:
 *  - If a value contains a comma, double-quote, or newline, the value is
 *    wrapped in double quotes and embedded double-quotes are escaped.
 */
export interface CsvColumn<T> {
  header: string;
  value: (row: T) => string | number | null | undefined;
}

export function exportToCsv<T>(
  rows: T[],
  columns: CsvColumn<T>[],
  fileName: string
): void {
  const header = columns.map((c) => escape(c.header)).join(',');
  const lines = rows.map((row) =>
    columns
      .map((c) => escape(toStr(c.value(row))))
      .join(',')
  );
  const csv = [header, ...lines].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName.endsWith('.csv') ? fileName : `${fileName}.csv`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

function escape(value: string): string {
  if (value == null) return '';
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function toStr(v: string | number | null | undefined): string {
  if (v == null) return '';
  return String(v);
}
