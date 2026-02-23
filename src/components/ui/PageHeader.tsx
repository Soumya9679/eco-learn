"use client";

import React from "react";
import { motion } from "framer-motion";

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    icon?: React.ReactNode;
    action?: React.ReactNode;
}

export default function PageHeader({ title, subtitle, icon, action }: PageHeaderProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start justify-between mb-8"
        >
            <div className="flex items-center gap-3">
                {icon && (
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{
                            background: "linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(6, 182, 212, 0.1))",
                            border: "1px solid rgba(16, 185, 129, 0.2)",
                            color: "#34d399",
                        }}
                    >
                        {icon}
                    </div>
                )}
                <div>
                    <h1
                        className="text-2xl font-bold text-white"
                        style={{ fontFamily: "var(--font-jakarta)" }}
                    >
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-sm mt-0.5" style={{ color: "#64748b" }}>
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>
            {action}
        </motion.div>
    );
}
