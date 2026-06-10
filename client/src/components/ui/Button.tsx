import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type ButtonVariant = "default" | "ghost" | "panel" | "primary" | "danger";
type ButtonSize = "sm" | "md" | "icon";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const variants: Record<ButtonVariant, string> = {
  default: "border border-white/10 bg-white text-black hover:bg-white/90",
  ghost: "text-white/75 hover:bg-white/10 hover:text-white",
  panel: "border border-white/10 bg-[#17191d] text-white hover:bg-[#22262d]",
  primary: "bg-blue-600 text-white hover:bg-blue-500",
  danger: "bg-red-500/15 text-red-300 hover:bg-red-500/25"
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  icon: "h-10 w-10 p-0"
};

export function Button({ className, variant = "panel", size = "md", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-400/60 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}
