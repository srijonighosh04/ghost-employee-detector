"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { fireHaptic } from "@/lib/haptics";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, onClick, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        onClick={(e) => {
          fireHaptic("tap");
          onClick?.(e);
        }}
        className={cn(
          "press-feedback inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors disabled:opacity-40 disabled:pointer-events-none",
          size === "sm" && "px-4 py-2 text-sm",
          size === "md" && "px-5 py-2.5 text-sm",
          size === "lg" && "px-7 py-3.5 text-base",
          variant === "primary" &&
            "bg-signal text-[#1A1206] shadow-glow-amber hover:bg-signal-glow",
          variant === "secondary" &&
            "bg-pulse text-[#06191D] shadow-glow-cyan hover:bg-pulse-glow",
          variant === "outline" &&
            "border border-white/15 text-bone hover:bg-white/[0.06]",
          variant === "ghost" && "text-slate hover:text-bone hover:bg-white/[0.04]",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
