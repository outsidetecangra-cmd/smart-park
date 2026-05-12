export function nowIso(): string {
  return new Date().toISOString();
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString();
}

export function diffMinutes(fromIso: string, toIso: string): number {
  const from = new Date(fromIso).getTime();
  const to = new Date(toIso).getTime();
  return Math.max(0, Math.round((to - from) / 60000));
}

