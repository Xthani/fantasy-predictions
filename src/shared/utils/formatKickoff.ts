const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const formatTime = (date: Date) =>
  date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

export const formatKickoff = (iso: string): string => {
  const kickoff = new Date(iso);
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const time = formatTime(kickoff);

  if (isSameDay(kickoff, now)) return `Сегодня, ${time}`;
  if (isSameDay(kickoff, tomorrow)) return `Завтра, ${time}`;

  const datePart = kickoff.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
  });
  return `${datePart}, ${time}`;
};
