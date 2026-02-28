import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type ColorVariant = "primary" | "secondary"

interface GradientColors {
  dark: {
    border: string
    base: string
    overlay: string
    text: string
    glow: string
    textGlow: string
    hover: string
  }
  light: {
    border: string
    base: string
    overlay: string
    text: string
    glow: string
    hover: string
  }
}

interface GradientButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  className?: string
  variant?: ColorVariant
}

const gradientColors: Record<ColorVariant, GradientColors> = {
  primary: {
    dark: {
      border:
        "from-[#1E3A8A] via-[#2563EB] to-[#3B82F6]",
      base:
        "from-[#0F172A] via-[#0B1C3F] to-[#0F172A]",
      overlay:
        "from-[#2563EB]/20 via-transparent to-[#3B82F6]/20",
      text:
        "from-[#93C5FD] to-[#60A5FA]",
      glow:
        "rgba(59,130,246,0.35)",
      textGlow:
        "rgba(96,165,250,0.6)",
      hover:
        "from-[#2563EB]/30 via-[#1D4ED8]/20 to-[#3B82F6]/30",
    },
    light: {
      border:
        "from-blue-400 via-blue-300 to-blue-200",
      base:
        "from-white via-blue-50 to-blue-100",
      overlay:
        "from-blue-300/20 via-transparent to-blue-200/30",
      text:
        "from-blue-700 to-blue-600",
      glow:
        "rgba(59,130,246,0.25)",
      hover:
        "from-blue-200/40 via-blue-100/30 to-blue-200/40",
    },
  },

  secondary: {
    dark: {
      border:
        "from-[#312E81] via-[#1E1B4B] to-[#3730A3]",
      base:
        "from-[#0F172A] via-[#111827] to-[#0F172A]",
      overlay:
        "from-indigo-500/20 via-transparent to-indigo-400/20",
      text:
        "from-indigo-300 to-indigo-200",
      glow:
        "rgba(99,102,241,0.3)",
      textGlow:
        "rgba(129,140,248,0.6)",
      hover:
        "from-indigo-600/30 via-indigo-500/20 to-indigo-600/30",
    },
    light: {
      border:
        "from-indigo-400 via-indigo-300 to-indigo-200",
      base:
        "from-white via-indigo-50 to-indigo-100",
      overlay:
        "from-indigo-300/20 via-transparent to-indigo-200/30",
      text:
        "from-indigo-700 to-indigo-600",
      glow:
        "rgba(99,102,241,0.25)",
      hover:
        "from-indigo-200/40 via-indigo-100/30 to-indigo-200/40",
    },
  },
}

export default function GradientButton({
  label,
  className,
  variant = "primary",
  ...props
}: GradientButtonProps) {
  const [isDark, setIsDark] = useState(false)
  const colors = gradientColors[variant]

  useEffect(() => {
    // Check initial theme
    setIsDark(document.documentElement.classList.contains("dark"))

    // Watch for theme changes
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"))
    })

    observer.observe(document.documentElement, { attributes: true })
    return () => observer.disconnect()
  }, [])

  const currentColors = isDark ? colors.dark : colors.light

  return (
    <Button
      variant="ghost"
      asChild
      className={cn(
        "group relative h-12 px-6 rounded-xl overflow-hidden transition-all duration-500",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-center cursor-pointer">
        {/* Gradient Border */}
        <div
          className={cn(
            "absolute inset-0 rounded-xl p-[1.5px]",
            isDark
              ? `bg-gradient-to-r ${colors.dark.border}`
              : `bg-gradient-to-r ${colors.light.border}`
          )}
        >
          <div className={cn("absolute inset-0 rounded-xl", isDark ? "bg-[#0F172A]" : "bg-white")} />
        </div>

        {/* Button Base */}
        <div
          className={cn(
            "absolute inset-[1.5px] rounded-xl bg-gradient-to-r",
            isDark ? colors.dark.base : colors.light.base
          )}
        />

        {/* Soft Overlay */}
        <div
          className={cn(
            "absolute inset-[1.5px] rounded-xl bg-gradient-to-r opacity-90",
            isDark ? colors.dark.overlay : colors.light.overlay
          )}
        />

        {/* Glow Effect */}
        <div
          className="absolute inset-[1.5px] rounded-xl"
          style={{
            boxShadow: `inset 0 0 20px ${isDark ? colors.dark.glow : colors.light.glow}`,
          }}
        />

        {/* Text */}
        <span
          className={cn(
            "relative z-10 bg-gradient-to-b flex items-center bg-clip-text text-transparent font-light tracking-wide",
            isDark ? colors.dark.text : colors.light.text
          )}
          style={{
            filter: isDark ? `drop-shadow(0 0 10px ${colors.dark.textGlow})` : "none"
          }}
        >
          {label}
          {props.children}
        </span>

        {/* Hover Layer */}
        <div
          className={cn(
            "absolute inset-[1.5px] rounded-xl bg-gradient-to-r opacity-0 transition-opacity duration-300 group-hover:opacity-100",
            isDark ? colors.dark.hover : colors.light.hover
          )}
        />
      </div>
    </Button>
  )
}
