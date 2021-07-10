const MIN_IN_HOUR = 60;

/* ------------------------------------------------------------
*  Converts hours into a readable string
*  Format: 2h 35min
* ------------------------------------------------------------ */
export function hoursToString(h: number): string {
  const min = Math.round((h - Math.floor(h)) * MIN_IN_HOUR);
  const hours = Math.round(h - (h - Math.floor(h)));
  if (hours === 0 && min === 0) return '0h 00min';
  return (hours !== 0 ? (hours + 'h ') : '') + (min !== 0 ? (min + 'min') : '');
}
