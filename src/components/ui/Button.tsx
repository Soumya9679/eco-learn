"use client";

import React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
    children: React.ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    icon?: React.ReactNode;
    fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
    primary: {
        background: "linear-gradient(135deg, var(--primary-400), var(--primary-600))",
        color: "#020617", /* Dark text for contrast against bright cyan */
        boxShadow: "0 4px 20px rgba(6, 182, 212, 0.4)",
    },
    secondary: {
        background: "rgba(255, 255, 255, 0.05)",
        color: "#f8fafc",
        border: "1px solid var(--border-color)",
    },
    ghost: {
        background: "transparent",
        color: "#94a3b8",
    },
    danger: {
        background: "linear-gradient(135deg, #ef4444, #dc2626)",
        color: "white",
        boxShadow: "0 4px 20px rgba(239, 68, 68, 0.3)",
    },
};

const sizeClasses: Record<ButtonSize, string> = {
    sm: "px-3 py-1.5 text-sm gap-1.5",
    md: "px-5 py-2.5 text-sm gap-2",
    lg: "px-7 py-3 text-base gap-2.5",
};

export default function Button({
    children,
    variant = "primary",
    size = "md",
    loading = false,
    icon,
    fullWidth = false,
    className = "",
    disabled,
    style,
    ...props
}: ButtonProps) {
    return (
        <motion.button
            whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
            whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
            className={`
        inline-flex items-center justify-center font-medium rounded-xl
        transition-all duration-200 cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        ${sizeClasses[size]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
            style={{ ...variantStyles[variant], ...style }}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
            ) : icon ? (
                icon
            ) : null}
            {children}
        </motion.button>
    );
}
