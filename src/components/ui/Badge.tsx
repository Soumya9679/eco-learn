"use client";

import React from "react";

interface BadgeProps {
    children: React.ReactNode;
    variant?: "emerald" | "blue" | "amber" | "red" | "purple" | "slate" | "success" | "warning" | "info" | "default" | "error";
    size?: "sm" | "md";
    className?: string;
}

const colorStyles: Record<string, React.CSSProperties> = {
    emerald: { background: "rgba(34, 197, 94, 0.15)", color: "#4ade80", border: "1px solid rgba(34, 197, 94, 0.2)" },
    success: { background: "rgba(34, 197, 94, 0.15)", color: "#4ade80", border: "1px solid rgba(34, 197, 94, 0.2)" },
    blue: { background: "rgba(59, 130, 246, 0.15)", color: "#60a5fa", border: "1px solid rgba(59, 130, 246, 0.2)" },
    info: { background: "rgba(59, 130, 246, 0.15)", color: "#60a5fa", border: "1px solid rgba(59, 130, 246, 0.2)" },
    amber: { background: "rgba(245, 158, 11, 0.15)", color: "#fbbf24", border: "1px solid rgba(245, 158, 11, 0.2)" },
    warning: { background: "rgba(245, 158, 11, 0.15)", color: "#fbbf24", border: "1px solid rgba(245, 158, 11, 0.2)" },
    red: { background: "rgba(239, 68, 68, 0.15)", color: "#f87171", border: "1px solid rgba(239, 68, 68, 0.2)" },
    error: { background: "rgba(239, 68, 68, 0.15)", color: "#f87171", border: "1px solid rgba(239, 68, 68, 0.2)" },
    purple: { background: "rgba(139, 92, 246, 0.15)", color: "#a78bfa", border: "1px solid rgba(139, 92, 246, 0.2)" },
    slate: { background: "rgba(148, 163, 184, 0.1)", color: "#94a3b8", border: "1px solid rgba(148, 163, 184, 0.15)" },
    default: { background: "rgba(148, 163, 184, 0.1)", color: "#94a3b8", border: "1px solid rgba(148, 163, 184, 0.15)" },
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
