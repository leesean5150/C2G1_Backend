/**
 * Validates that the end date is after the start date.
 *
 * @param {string|Date} startDate - The start date as a string or Date object.
 * @param {string|Date} endDate - The end date as a string or Date object.
 * @returns {boolean} - Returns true if the end date is after the start date, otherwise false.
 */
function validateStartEndDates(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (end <= start) {
    return false;
  }
  return true;
}

console.log(validateDates("2021-01-01", "2021-01-02")); // true
console.log(validateDates("2021-01-02", "2021-01-01")); // false
console.log(validateDates("2021-01-01", "2021-01-01")); // false
