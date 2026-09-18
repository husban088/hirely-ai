"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  loading?: boolean;
  fullWidth?: boolean;
}

const variants = {
  primary:
    "bg-gold-gradient text-obsidian font-semibold shadow-gold hover:shadow-gold-lg hover:brightness-110 shine-sweep",
  secondary:
    "bg-white/5 text-ivory border border-gold/20 hover:bg-white/10 hover:border-gold/50",
  ghost: "text-ivory/70 hover:text-gold hover:bg-white/5",
  danger:
    "bg-red-500/5 text-red-600 border border-red-500/30 hover:bg-red-500/10",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      loading,
      fullWidth,
      className = "",
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: disabled ? 1 : 1.02, y: disabled ? 0 : -1 }}
        whileTap={{ scale: disabled ? 1 : 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        disabled={disabled || loading}
        className={`relative inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${
          variants[variant]
        } ${fullWidth ? "w-full" : ""} ${className}`}
        {...(props as any)}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </motion.button>
    );
  },
);
Button.displayName = "Button";
