"use client";

import React from "react";
import { motion } from "framer-motion";

interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    action?: React.ReactNode;
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 text-center"
        >
            {icon && (
                <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                    style={{
                        background: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        color: "#64748b",
                    }}
                >
                    {icon}
                </div>
            )}
            <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
            {description && (
                <p className="text-sm max-w-sm" style={{ color: "#64748b" }}>
                    {description}
                </p>
            )}
            {action && <div className="mt-4">{action}</div>}
        </motion.div>
    );
}
