import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

/**
 * Converts a UTC datetime string from the backend (format: "yyyy-MM-dd HH:mm:ss", no timezone info)
 * into the user's local time.
 *
 * The backend stores and returns all timestamps in UTC but without a 'Z' suffix,
 * so browsers treat them as local time instead of UTC — causing a wrong display.
 * This pipe appends 'Z' to mark the string as UTC before parsing, which makes
 * Angular's DatePipe correctly convert it to the browser's local timezone (e.g. IST = UTC+5:30).
 */
@Pipe({ name: 'localDate', standalone: true })
export class LocalDatePipe implements PipeTransform {
  private datePipe = new DatePipe('en-IN');

  transform(value: string | Date | null | undefined, format = 'dd MMM yyyy, HH:mm'): string | null {
    if (!value) return null;

    let date: Date;

    if (value instanceof Date) {
      date = value;
    } else {
      // Backend sends "2026-05-14 04:06:23" — no T, no Z.
      // Replace the space with T and append Z so it's parsed as UTC.
      const normalized = value.toString().replace(' ', 'T') + 'Z';
      date = new Date(normalized);
    }

    if (isNaN(date.getTime())) return String(value);

    return this.datePipe.transform(date, format);
  }
}
