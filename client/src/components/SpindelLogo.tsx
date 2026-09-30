import { cn } from "@/lib/utils";

interface SpindelLogoProps {
  variant?: "horizontal" | "stacked";
  className?: string;
  imageClassName?: string;
}

export function SpindelLogo({
  variant = "horizontal",
  className,
  imageClassName,
}: SpindelLogoProps) {
  const src = variant === "stacked"
    ? "/spindel-logo-stacked.jpg"
    : "/spindel-logo-horizontal.jpg";

  return (
    <span className={cn("inline-flex items-center justify-center overflow-hidden rounded-xl bg-white", className)}>
      <img
        src={src}
        alt="Spindel Eye Associates"
        className={cn(
          "h-full w-full",
          variant === "horizontal" ? "object-contain scale-[3]" : "object-contain",
          imageClassName,
        )}
      />
    </span>
  );
}
