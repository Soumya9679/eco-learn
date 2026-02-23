"use client";

import React from "react";
import { motion } from "framer-motion";

interface ProgressBarProps {
    value: number;
    max?: number;
    label?: string;
    showValue?: boolean;
    size?: "sm" | "md" | "lg";
    color?: "emerald" | "blue" | "amber" | "purple";
    className?: string;
}

const sizeMap = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
};

const colorMap = {
    emerald: "from-emerald-400 to-emerald-600",
    blue: "from-blue-400 to-blue-600",
    amber: "from-amber-400 to-amber-600",
    purple: "from-purple-400 to-purple-600",
};

export default function ProgressBar({
    value,
    max = 100,
    label,
    showValue = false,
    size = "md",
    color = "emerald",
    className = "",
}: ProgressBarProps) {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
        <div className={`w-full ${className}`}>
            {(label || showValue) && (
                <div className="flex justify-between items-center mb-1.5">
                    {label && (
                        <span className="text-sm font-medium text-slate-700">{label}</span>
                    )}
                    {showValue && (
                        <span className="text-sm font-semibold text-slate-600">
                            {Math.round(percentage)}%
                        </span>
                    )}
                </div>
            )}
            <div
                className={`w-full bg-slate-100 rounded-full overflow-hidden ${sizeMap[size]}`}
            >
                <motion.div
                    className={`h-full rounded-full bg-gradient-to-r ${colorMap[color]}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                />
            </div>
        </div>
    );
}
