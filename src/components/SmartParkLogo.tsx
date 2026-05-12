import { useState } from "react";

export default function SmartParkLogo(props: {
  variant?: "light" | "dark";
  size?: "sm" | "md" | "xl" | "hero";
  showText?: boolean;
}) {
  const variant = props.variant ?? "dark";
  const size = props.size ?? "md";
  const showText = props.showText ?? true;
  const textClass = variant === "light" ? "text-white" : "text-slate-900";
  const subClass = variant === "light" ? "text-slate-300" : "text-slate-500";
  const [imgOk, setImgOk] = useState(true);

  const logoSizeClass =
    size === "sm"
      ? "h-7 w-7"
      : size === "hero"
        ? "h-80 w-80"
        : size === "xl"
          ? "h-20 w-20"
          : "h-9 w-9";
  const titleClass =
    size === "hero"
      ? "text-2xl"
      : size === "xl"
        ? "text-xl"
        : size === "sm"
          ? "text-xs"
          : "text-sm";
  const subTitleClass =
    size === "hero"
      ? "text-base"
      : size === "xl"
        ? "text-sm"
        : size === "sm"
          ? "text-[11px]"
          : "text-xs";

  return (
    <div className="flex items-center gap-3">
      {imgOk ? (
        <img
          src="/logo-sf-sp.png"
          alt="Smart Park"
          className={`${logoSizeClass} object-contain`}
          onError={() => setImgOk(false)}
        />
      ) : (
        <div
          className={`grid ${logoSizeClass} place-items-center rounded-xl ${
            variant === "light"
              ? "bg-white/10 ring-1 ring-white/10"
              : "bg-brand-600 text-white"
          }`}
          aria-hidden
        >
          <span className="text-sm font-black tracking-tight">P</span>
        </div>
      )}
      {showText ? (
        <div className="min-w-0">
        <div className={`${titleClass} font-bold leading-5 ${textClass}`}>
          Smart Park
        </div>
        <div className={`${subTitleClass} leading-4 ${subClass}`}>
          Gestão inteligente para estacionamentos
        </div>
        </div>
      ) : null}
    </div>
  );
}
