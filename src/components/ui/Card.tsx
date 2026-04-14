"use client";

import React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";

interface CardProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
    variant?: "default" | "glass" | "gradient";
    padding?: "sm" | "md" | "lg" | "none";
    hover?: boolean;
    gradientFrom?: string;
    gradientTo?: string;
}

const paddingStyles = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
};

export default function Card({
    children,
    variant = "default",
    padding = "md",
    hover = true,
    gradientFrom,
    gradientTo,
    className = "",
    style,
    ...props
}: CardProps) {
    const baseClasses = `rounded-2xl transition-all duration-300 ${paddingStyles[padding]}`;

    const variantStyles: Record<string, React.CSSProperties> = {
        default: {
            background: "rgba(10, 30, 15, 0.4)",
            border: "1px solid rgba(255, 255, 255, 0.04)",
            backdropFilter: "blur(12px)",
        },
        glass: {
            background: "rgba(10, 30, 15, 0.6)",
            border: "1px solid rgba(34, 197, 94, 0.12)",
            backdropFilter: "blur(24px)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
        },
        gradient: gradientFrom && gradientTo ? {
            background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
            color: "white",
        } : {},
    };

    const hoverClasses = hover ? "hover:-translate-y-0.5" : "";

    return (
        <motion.div
            className={`${baseClasses} ${hoverClasses} ${className}`}
            style={{ ...variantStyles[variant], ...style }}
            {...props}
        >
            {children}
        </motion.div>
    );
}
