"use client";

import React from "react";

interface SkeletonProps {
    width?: string;
    height?: string;
    className?: string;
    variant?: "text" | "circular" | "rectangular";
}

export function Skeleton({ width, height, className = "", variant = "rectangular" }: SkeletonProps) {
    const variantClasses = {
        text: "rounded-md",
        circular: "rounded-full",
        rectangular: "rounded-xl",
    };
    return (
        <div
            className={`skeleton ${variantClasses[variant]} ${className}`}
            style={{ width: width || "100%", height: height || "20px" }}
        />
    );
}

export function SkeletonCard() {
    return (
        <div
            className="p-6 rounded-2xl"
            style={{ background: "rgba(17, 24, 39, 0.5)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
            <Skeleton height="16px" width="60%" className="mb-3" />
            <Skeleton height="12px" width="80%" className="mb-2" />
            <Skeleton height="12px" width="40%" />
        </div>
    );
}

export function SkeletonPage() {
    return (
        <div className="space-y-6 p-6 animate-pulse">
            <Skeleton height="32px" width="200px" />
            <Skeleton height="16px" width="300px" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                    <SkeletonCard key={i} />
                ))}
            </div>
        </div>
    );
}

export const PageSkeleton = SkeletonPage;
