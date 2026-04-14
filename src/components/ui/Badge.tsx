"use client";

import React from "react";

interface BadgeProps {
    children: React.ReactNode;
    variant?: "emerald" | "blue" | "amber" | "red" | "purple" | "slate" | "success" | "warning" | "info" | "default" | "error";
    size?: "sm" | "md";
    className?: string;
}

const colorStyles: Record<string, React.CSSProperties> = {
    emerald: { background: "rgba(16, 185, 129, 0.1)", color: "#34d399", border: "1px solid rgba(16, 185, 129, 0.4)", boxShadow: "0 0 10px rgba(16, 185, 129, 0.15)" },
    success: { background: "rgba(16, 185, 129, 0.1)", color: "#34d399", border: "1px solid rgba(16, 185, 129, 0.4)", boxShadow: "0 0 10px rgba(16, 185, 129, 0.15)" },
    cyan: { background: "rgba(6, 182, 212, 0.1)", color: "#22d3ee", border: "1px solid rgba(6, 182, 212, 0.4)", boxShadow: "0 0 10px rgba(6, 182, 212, 0.15)" },
    blue: { background: "rgba(6, 182, 212, 0.1)", color: "#22d3ee", border: "1px solid rgba(6, 182, 212, 0.4)", boxShadow: "0 0 10px rgba(6, 182, 212, 0.15)" },
    info: { background: "rgba(6, 182, 212, 0.1)", color: "#22d3ee", border: "1px solid rgba(6, 182, 212, 0.4)" },
    amber: { background: "rgba(245, 158, 11, 0.1)", color: "#fbbf24", border: "1px solid rgba(245, 158, 11, 0.4)", boxShadow: "0 0 10px rgba(245, 158, 11, 0.15)" },
    warning: { background: "rgba(245, 158, 11, 0.1)", color: "#fbbf24", border: "1px solid rgba(245, 158, 11, 0.4)" },
    red: { background: "rgba(239, 68, 68, 0.1)", color: "#f87171", border: "1px solid rgba(239, 68, 68, 0.4)", boxShadow: "0 0 10px rgba(239, 68, 68, 0.15)" },
    error: { background: "rgba(239, 68, 68, 0.1)", color: "#f87171", border: "1px solid rgba(239, 68, 68, 0.4)" },
    purple: { background: "rgba(217, 70, 239, 0.1)", color: "#f0abfc", border: "1px solid rgba(217, 70, 239, 0.4)", boxShadow: "0 0 10px rgba(217, 70, 239, 0.15)" },
    slate: { background: "rgba(255, 255, 255, 0.05)", color: "#cbd5e1", border: "1px solid rgba(255, 255, 255, 0.1)" },
    default: { background: "rgba(255, 255, 255, 0.05)", color: "#cbd5e1", border: "1px solid rgba(255, 255, 255, 0.1)" },
};

export default function Badge({ children, variant = "default", size = "sm", className = "" }: BadgeProps) {
    const sizeClasses = size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm";
    return (
        <span
            className={`inline-flex items-center gap-1 font-medium rounded-full ${sizeClasses} ${className}`}
            style={colorStyles[variant] || colorStyles.default}
        >
            {children}
        </span>
    );
}
