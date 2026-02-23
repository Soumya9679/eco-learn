import React from "react";

interface AvatarProps {
    src?: string;
    name?: string;
    size?: "sm" | "md" | "lg" | "xl";
    ring?: boolean;
    className?: string;
}

const sizeMap = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-14 h-14 text-lg",
    xl: "w-20 h-20 text-2xl",
};

const ringMap = {
    sm: "ring-2",
    md: "ring-2",
    lg: "ring-3",
    xl: "ring-4",
};

function getInitials(name: string): string {
    return name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

function getColor(name: string): string {
    const colors = [
        "bg-emerald-500",
        "bg-blue-500",
        "bg-purple-500",
        "bg-orange-500",
        "bg-pink-500",
        "bg-teal-500",
        "bg-indigo-500",
        "bg-cyan-500",
    ];
    const index =
        name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
        colors.length;
    return colors[index];
}

export default function Avatar({
    src,
    name = "User",
    size = "md",
    ring = false,
    className = "",
}: AvatarProps) {
    if (src) {
        return (
            <img
                src={src}
                alt={name}
                className={`${sizeMap[size]} rounded-full object-cover flex-shrink-0 ${ring ? `${ringMap[size]} ring-emerald-400 ring-offset-2` : ""
                    } ${className}`}
            />
        );
    }

    return (
        <div
            className={`${sizeMap[size]} ${getColor(name)} rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 ${ring ? `${ringMap[size]} ring-emerald-400 ring-offset-2` : ""
                } ${className}`}
        >
            {getInitials(name)}
        </div>
    );
}
