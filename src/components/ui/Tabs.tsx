"use client";

import React from "react";
import { motion } from "framer-motion";

interface Tab {
    id: string;
    label: string;
    icon?: React.ReactNode;
}

interface TabsProps {
    tabs: Tab[];
    activeTab: string;
    onTabChange: (id: string) => void;
    className?: string;
}

export default function Tabs({ tabs, activeTab, onTabChange, className = "" }: TabsProps) {
    return (
        <div
            className={`inline-flex items-center gap-1 p-1 rounded-xl ${className}`}
            style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
            }}
        >
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className="relative px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-2"
                    style={{
                        color: activeTab === tab.id ? "#f1f5f9" : "#64748b",
                    }}
                >
                    {activeTab === tab.id && (
                        <motion.div
                            layoutId="tab-active"
                            className="absolute inset-0 rounded-lg"
                            style={{
                                background: "rgba(16, 185, 129, 0.15)",
                                border: "1px solid rgba(16, 185, 129, 0.2)",
                            }}
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                    )}
                    {tab.icon && <span className="relative z-10">{tab.icon}</span>}
                    <span className="relative z-10">{tab.label}</span>
                </button>
            ))}
        </div>
    );
}
