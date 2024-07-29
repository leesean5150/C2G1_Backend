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

/**
 * Checks if two timeslots overlap.
 * @param {string} start1 - Start time of the first timeslot.
 * @param {string} end1 - End time of the first timeslot.
 * @param {string} start2 - Start time of the second timeslot.
 * @param {string} end2 - End time of the second timeslot.
 * @returns {boolean} - Returns true if the timeslots overlap, otherwise false.
 */
function checkTimeslotOverlap(start1, end1, start2, end2) {
  const startDate1 = new Date(start1);
  const endDate1 = new Date(end1);
  const startDate2 = new Date(start2);
  const endDate2 = new Date(end2);

  return startDate1 < endDate2 && startDate2 < endDate1;
}

export { validateStartEndDates, checkTimeslotOverlap };
