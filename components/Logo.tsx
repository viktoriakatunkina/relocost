import Image from "next/image";

interface LogoProps {
  /** horizontal — иконка + подпись "Relocost" (навбар/футер)
   *  icon — только иконка (компактный вариант) */
  variant?: "horizontal" | "icon";
  /** sm = 28px, md = 36px, lg = 48px (высота иконки) */
  size?: "sm" | "md" | "lg";
  /** Добавляет CSS-класс transition-transform + hover:rotate-6 */
  withHover?: boolean;
}

const iconSize: Record<NonNullable<LogoProps["size"]>, number> = {
  sm: 28,
  md: 36,
  lg: 48,
};

const textSize: Record<NonNullable<LogoProps["size"]>, string> = {
  sm: "text-xl",
  md: "text-2xl",
  lg: "text-3xl",
};

export function Logo({
  variant = "horizontal",
  size = "md",
  withHover = false,
}: LogoProps) {
  const px = iconSize[size];
  const iconEl = (
    <Image
      src="/logo/relocost-icon-on-dark.svg"
      alt="Relocost"
      width={px}
      height={Math.round(px * (88 / 72))} // сохраняем пропорцию viewBox 72×88
      className={withHover ? "transition-transform group-hover:rotate-6" : undefined}
      priority
    />
  );

  if (variant === "icon") return iconEl;

  return (
    <span className="flex items-center gap-3">
      {iconEl}
      <span className={`font-serif ${textSize[size]} text-cream tracking-tight`}>
        Relocost
      </span>
    </span>
  );
}
