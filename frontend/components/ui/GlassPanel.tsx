import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "raised" | "inset";
  glow?: "none" | "amber" | "cyan";
}

export function GlassPanel({
  variant = "default",
  glow = "none",
  className,
  children,
  ...props
}: GlassPanelProps) {
  return (
    <div
      className={cn(
        "rounded-xl2",
        variant === "default" && "glass",
        variant === "raised" && "glass-raised",
        variant === "inset" && "glass-inset",
        glow === "amber" && "shadow-glow-amber",
        glow === "cyan" && "shadow-glow-cyan",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
