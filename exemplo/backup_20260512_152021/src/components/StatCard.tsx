import type { ReactNode } from "react";

export default function StatCard(props: {
  title: string;
  value: string;
  icon?: ReactNode;
  accentClassName?: string;
}) {
  const { title, value, icon, accentClassName } = props;
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-soft">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-medium text-slate-500">{title}</div>
          <div className="mt-1 text-2xl font-semibold text-slate-900">
            {value}
          </div>
        </div>
        <div
          className={`grid h-10 w-10 place-items-center rounded-xl bg-slate-50 text-slate-700 ${accentClassName ?? ""}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
