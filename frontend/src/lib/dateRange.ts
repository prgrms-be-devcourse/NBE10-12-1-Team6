export function formatInputDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getDefaultDateRange(days = 30) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days);

  return {
    startDate: formatInputDate(startDate),
    endDate: formatInputDate(endDate),
  };
}

export function toStartDateTime(date: string) {
  return `${date}T00:00:00`;
}

export function toEndDateTime(date: string) {
  return `${date}T23:59:59`;
}
