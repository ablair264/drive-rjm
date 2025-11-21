import { format, parse, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isSameDay as dateFnsIsSameDay } from 'date-fns';

export function formatDate(date, formatStr = 'PPP') {
  return format(date, formatStr);
}

export function parseDate(dateString) {
  return parse(dateString, 'yyyy-MM-dd', new Date());
}

export function isSameDay(date1, date2) {
  return dateFnsIsSameDay(date1, date2);
}

export function getWeekRange(date) {
  return {
    start: startOfWeek(date, { weekStartsOn: 0 }), // Sunday
    end: endOfWeek(date, { weekStartsOn: 0 })
  };
}

export function getMonthRange(date) {
  return {
    start: startOfMonth(date),
    end: endOfMonth(date)
  };
}

export function addDaysToDate(date, days) {
  return addDays(date, days);
}
