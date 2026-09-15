export function csvEscape(value: unknown): string {
  const text = value === null || value === undefined ? "" : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

export function toCsv<T extends Record<string, unknown>>(rows: T[], columns: string[]): string {
  const header = columns.map(csvEscape).join(";");
  const body = rows.map((row) => columns.map((column) => csvEscape(row[column])).join(";")).join("\n");
  return `\ufeff${header}${body ? `\n${body}` : ""}\n`;
}
