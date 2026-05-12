export function calcPriceCents(params: {
  totalMinutes: number;
  firstHourCents: number;
  additionalHourCents: number;
}): { totalHoursRoundedUp: number; totalCents: number } {
  const { totalMinutes, firstHourCents, additionalHourCents } = params;
  const hours = Math.max(1, Math.ceil(totalMinutes / 60));
  const totalCents =
    hours <= 1
      ? firstHourCents
      : firstHourCents + (hours - 1) * additionalHourCents;
  return { totalHoursRoundedUp: hours, totalCents };
}

