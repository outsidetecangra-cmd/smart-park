export function formatSpotLabel(number: number, sector = "A"): string {
  const pad = String(number).padStart(2, "0");
  return `${sector}${pad}`;
}

