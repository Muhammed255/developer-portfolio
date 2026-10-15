// Date helpers shared by the home, experience and project pages.

const monthYear = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' });

export function formatMonthYear(date: Date | string): string {
  return monthYear.format(new Date(date));
}

/** "Mar 2022 – Present" */
export function formatRange(start: Date | string, end?: Date | string): string {
  return `${formatMonthYear(start)} – ${end ? formatMonthYear(end) : 'Present'}`;
}

/** "2 yrs 3 mos", counting the start and end months inclusively. */
export function formatDuration(start: Date | string, end: Date | string = new Date()): string {
  const s = new Date(start);
  const e = new Date(end);
  const months = Math.max(1, (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth()) + 1);
  const years = Math.floor(months / 12);
  const rest = months % 12;
  const parts = [];
  if (years) parts.push(`${years} yr${years > 1 ? 's' : ''}`);
  if (rest) parts.push(`${rest} mo${rest > 1 ? 's' : ''}`);
  return parts.join(' ');
}

/** Whole years elapsed since the given date. */
export function yearsSince(date: Date | string, now: Date = new Date()): number {
  const s = new Date(date);
  let years = now.getFullYear() - s.getFullYear();
  if (now.getMonth() < s.getMonth()) years--;
  return Math.max(0, years);
}
