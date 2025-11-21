import { isSameDay } from './dateHelpers';
import { addMinutes, minutesBetween, timeRangesOverlap } from './timeHelpers';
import { getPostcodeArea } from './postcodeHelpers';

/**
 * Recommends optimal lesson slot based on existing lessons
 * Priority: Minimize travel by clustering similar postcodes
 */
export function computeRecommendedSlot(date, startPostcode, duration, existingLessons) {
  // Filter lessons for the same date
  const dayLessons = existingLessons
    .filter(lesson => isSameDay(lesson.date, date) && lesson.status === 'scheduled')
    .sort((a, b) => a.start_time.localeCompare(b.start_time));

  if (dayLessons.length === 0) {
    // No lessons on this day, recommend first slot
    return { time: '08:00', reason: 'First lesson of the day' };
  }

  // Find lessons with similar postcodes (first 3-4 characters match)
  const postcodeArea = getPostcodeArea(startPostcode);
  const similarPostcodeLessons = dayLessons.filter(lesson =>
    getPostcodeArea(lesson.start_postcode) === postcodeArea ||
    getPostcodeArea(lesson.end_postcode) === postcodeArea
  );

  if (similarPostcodeLessons.length > 0) {
    // Try to find slot adjacent to similar postcode lesson
    for (const similarLesson of similarPostcodeLessons) {
      // Try after this lesson
      const afterTime = addMinutes(similarLesson.end_time, 15); // 15 min buffer

      // Check if this slot conflicts with another lesson
      const hasConflict = dayLessons.some(lesson =>
        timeRangesOverlap(afterTime, duration, lesson.start_time, lesson.duration_minutes)
      );

      if (!hasConflict && afterTime < '20:00') {
        return {
          time: afterTime,
          reason: `Recommended - minimizes travel from ${similarLesson.start_time} lesson in ${getPostcodeArea(similarLesson.start_postcode)}`
        };
      }

      // Try before this lesson
      const beforeTime = addMinutes(similarLesson.start_time, -(duration + 15));
      const hasConflictBefore = dayLessons.some(lesson =>
        timeRangesOverlap(beforeTime, duration, lesson.start_time, lesson.duration_minutes)
      );

      if (!hasConflictBefore && beforeTime >= '08:00') {
        return {
          time: beforeTime,
          reason: `Recommended - minimizes travel to ${similarLesson.start_time} lesson in ${getPostcodeArea(similarLesson.start_postcode)}`
        };
      }
    }
  }

  // No similar postcodes or couldn't find adjacent slot, find earliest available
  const earliestSlot = findEarliestAvailableSlot(dayLessons, duration);
  return {
    time: earliestSlot,
    reason: 'Earliest available time slot'
  };
}

function findEarliestAvailableSlot(lessons, duration) {
  const startOfDay = '08:00';
  const endOfDay = '20:00';

  // Check if first slot is available
  if (lessons.length === 0 || lessons[0].start_time >= addMinutes(startOfDay, duration)) {
    return startOfDay;
  }

  // Check gaps between lessons
  for (let i = 0; i < lessons.length - 1; i++) {
    const gapStart = lessons[i].end_time;
    const gapEnd = lessons[i + 1].start_time;
    const gapDuration = minutesBetween(gapStart, gapEnd);

    if (gapDuration >= duration + 30) { // 30 min buffer
      return addMinutes(gapStart, 15); // 15 min buffer after previous lesson
    }
  }

  // No gaps, recommend after last lesson
  const lastLesson = lessons[lessons.length - 1];
  const afterLast = addMinutes(lastLesson.end_time, 15);

  if (afterLast < endOfDay) {
    return afterLast;
  }

  // Day is full, return first slot anyway (will show warning)
  return startOfDay;
}

/**
 * Check if a lesson time conflicts with existing lessons
 */
export function checkTimeConflict(date, startTime, duration, existingLessons, excludeLessonId = null) {
  const dayLessons = existingLessons.filter(lesson =>
    isSameDay(lesson.date, date) &&
    lesson.status === 'scheduled' &&
    lesson.id !== excludeLessonId
  );

  for (const lesson of dayLessons) {
    if (timeRangesOverlap(startTime, duration, lesson.start_time, lesson.duration_minutes)) {
      return {
        hasConflict: true,
        conflictingLesson: lesson
      };
    }
  }

  return { hasConflict: false };
}
