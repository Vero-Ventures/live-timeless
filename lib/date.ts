const isSameDay = (date1: Date, date2: Date) =>
  date1.getDate() === date2.getDate() &&
  date1.getMonth() === date2.getMonth() &&
  date1.getFullYear() === date2.getFullYear();

export const isYesterday = (date: Date) => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return isSameDay(date, yesterday);
};

export const isToday = (date: Date) => isSameDay(date, new Date());

export const isTomorrow = (date: Date) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return isSameDay(date, tomorrow);
};

export const formatDate = (date: Date) =>
  date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export const formatTime = (date: Date) =>
  date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

export function getRelativeDateLabel(date: Date) {
  const dateConditions = [
    { condition: isYesterday, label: "Yesterday" },
    { condition: isToday, label: "Today" },
    { condition: isTomorrow, label: "Tomorrow" },
  ];
  const matchedCondition = dateConditions.find(({ condition }) =>
    condition(date)
  );
  return matchedCondition ? matchedCondition.label : formatDate(date);
}
