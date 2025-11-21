export function addMinutes(timeString, minutes) {
  const [hours, mins] = timeString.split(':').map(Number);
  const totalMinutes = hours * 60 + mins + minutes;
  const newHours = Math.floor(totalMinutes / 60) % 24;
  const newMins = totalMinutes % 60;
  return `${String(newHours).padStart(2, '0')}:${String(newMins).padStart(2, '0')}`;
}

export function minutesBetween(startTime, endTime) {
  const [startHours, startMins] = startTime.split(':').map(Number);
  const [endHours, endMins] = endTime.split(':').map(Number);
  return (endHours * 60 + endMins) - (startHours * 60 + startMins);
}

export function timeRangesOverlap(start1, duration1, start2, duration2) {
  const end1 = addMinutes(start1, duration1);
  const end2 = addMinutes(start2, duration2);
  return (start1 < end2 && end1 > start2);
}

export function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

export function parseTime(timeString) {
  const [hours, minutes] = timeString.split(':').map(Number);
  return { hours, minutes };
}
