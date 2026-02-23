"use client";

import React, { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
    helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, icon, helperText, className = "", type, ...props }, ref) => {
        const [showPassword, setShowPassword] = useState(false);
        const isPassword = type === "password";

        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium mb-1.5" style={{ color: "#cbd5e1" }}>
                        {label}
                    </label>
                )}
                <div className="relative">
                    {icon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#64748b" }}>
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        type={isPassword && showPassword ? "text" : type}
                        className={`
              w-full px-4 py-2.5 rounded-xl
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-emerald-500/40
              disabled:opacity-50 disabled:cursor-not-allowed
              ${icon ? "pl-10" : ""}
              ${isPassword ? "pr-10" : ""}
              ${className}
            `}
                        style={{
                            background: "rgba(255, 255, 255, 0.05)",
                            border: error
                                ? "1px solid rgba(239, 68, 68, 0.5)"
                                : "1px solid rgba(255, 255, 255, 0.08)",
                            color: "#f1f5f9",
                            fontSize: "0.875rem",
                        }}
                        {...props}
                    />
                    {isPassword && (
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors cursor-pointer"
                            style={{ color: "#64748b" }}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    )}
                </div>
                {error && <p className="mt-1 text-sm" style={{ color: "#f87171" }}>{error}</p>}
                {helperText && !error && (
                    <p className="mt-1 text-sm" style={{ color: "#64748b" }}>{helperText}</p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";
export default Input;
