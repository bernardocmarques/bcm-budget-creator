/* ------------------------------------------------------------
*  Formats a big number with commas as thousands separators
*  Source: https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
* ------------------------------------------------------------ */
export function numberWithCommas(x: number): string {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


/* ------------------------------------------------------------
*  Generates a random integer between min and max (included)
*  Source: https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
* ------------------------------------------------------------ */
export function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
