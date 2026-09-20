const AppError = require('./AppError');

const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const parseDate = (dateStr) => {
  if (!DATE_REGEX.test(dateStr)) {
    throw new AppError('Invalid date format. Use YYYY-MM-DD', 400, 'INVALID_DATE');
  }
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    throw new AppError('Invalid date', 400, 'INVALID_DATE');
  }
  return date;
};

const parseTime = (timeStr) => {
  if (!TIME_REGEX.test(timeStr)) {
    throw new AppError('Invalid time format. Use HH:mm', 400, 'INVALID_TIME');
  }
  const [hours, minutes] = timeStr.split(':').map(Number);
  return { hours, minutes };
};

const combineDateAndTime = (dateStr, timeStr) => {
  const date = parseDate(dateStr);
  const { hours, minutes } = parseTime(timeStr);
  return new Date(Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    hours,
    minutes,
    0,
    0
  ));
};

const buildBookingDateTimes = (date, startTime, endTime) => {
  const startDateTime = combineDateAndTime(date, startTime);
  const endDateTime = combineDateAndTime(date, endTime);

  if (endDateTime <= startDateTime) {
    throw new AppError('End time must be after start time', 400, 'INVALID_TIME_RANGE');
  }

  if (startDateTime <= new Date()) {
    throw new AppError('Cannot book a slot in the past', 400, 'PAST_BOOKING');
  }

  return { startDateTime, endDateTime };
};

const getDayBounds = (dateStr) => {
  const start = parseDate(dateStr);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);
  return { dayStart: start, dayEnd: end };
};

const formatTime = (date) => {
  const h = String(date.getUTCHours()).padStart(2, '0');
  const m = String(date.getUTCMinutes()).padStart(2, '0');
  return `${h}:${m}`;
};

module.exports = {
  TIME_REGEX,
  DATE_REGEX,
  parseDate,
  parseTime,
  combineDateAndTime,
  buildBookingDateTimes,
  getDayBounds,
  formatTime,
};
