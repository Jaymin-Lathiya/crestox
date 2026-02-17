"use client"

import { useTheme } from "next-themes"
import { useCallback, useEffect, useState } from "react"

/* ======================================================
   Types
====================================================== */

export type AnimationVariant =
    | "circle"
    | "rectangle"
    | "gif"
    | "polygon"
    | "circle-blur"

export type AnimationStart =
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | "center"
    | "top-center"
    | "bottom-center"
    | "bottom-up"
    | "top-down"
    | "left-right"
    | "right-left"

interface Animation {
    name: string
    css: string
}

/* ======================================================
   Public Hook
====================================================== */

export const useThemeToggle = ({
    variant = "circle",
    start = "center",
    blur = false,
    gifUrl = "",
}: {
    variant?: AnimationVariant
    start?: AnimationStart
    blur?: boolean
    gifUrl?: string
} = {}) => {
    const { theme, setTheme, resolvedTheme } = useTheme()
    const [isDark, setIsDark] = useState(false)

    // Sync after hydration
    useEffect(() => {
        setIsDark(resolvedTheme === "dark")
    }, [resolvedTheme])

    const styleId = "skiper-theme-transition"

    const updateStyles = useCallback((css: string) => {
        if (typeof window === "undefined") return

        let style = document.getElementById(styleId) as HTMLStyleElement | null

        if (!style) {
            style = document.createElement("style")
            style.id = styleId
            document.head.appendChild(style)
        }

        style.textContent = css
    }, [])

    const toggleTheme = useCallback(() => {
        setIsDark(!isDark)

        const animation = createAnimation(variant, start, blur, gifUrl)
        updateStyles(animation.css)

        const switchTheme = () => {
            setTheme(theme === "dark" ? "light" : "dark")
        }

        if (!document.startViewTransition) {
            switchTheme()
            return
        }

        document.startViewTransition(switchTheme)
    }, [theme, setTheme, variant, start, blur, gifUrl, updateStyles, isDark])

    return { isDark, toggleTheme }
}

/* ======================================================
   Animation Engine
====================================================== */

const getClipPosition = (start: AnimationStart) => {
    switch (start) {
        case "top-left":
            return "0% 0%"
        case "top-right":
            return "100% 0%"
        case "bottom-left":
            return "0% 100%"
        case "bottom-right":
            return "100% 100%"
        case "top-center":
            return "50% 0%"
        case "bottom-center":
            return "50% 100%"
        default:
            return "50% 50%"
    }
}

export const createAnimation = (
    variant: AnimationVariant,
    start: AnimationStart,
    blur: boolean,
    _url?: string,
): Animation => {
    // Circle reveal (Skiper default)
    if (variant === "circle") {
        const position = getClipPosition(start)

        return {
            name: `${variant}-${start}${blur ? "-blur" : ""}`,
            css: `
::view-transition-group(root) {
  animation-duration: 0.8s;
  animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

::view-transition-new(root) {
  animation-name: reveal-light-${start};
  ${blur ? "filter: blur(2px);" : ""}
}

.dark::view-transition-new(root) {
  animation-name: reveal-dark-${start};
  ${blur ? "filter: blur(2px);" : ""}
}

::view-transition-old(root) {
  animation: none;
  z-index: -1;
}

@keyframes reveal-light-${start} {
  from {
    clip-path: circle(0% at ${position});
    ${blur ? "filter: blur(8px);" : ""}
  }
  to {
    clip-path: circle(150% at ${position});
    ${blur ? "filter: blur(0px);" : ""}
  }
}

@keyframes reveal-dark-${start} {
  from {
    clip-path: circle(0% at ${position});
    ${blur ? "filter: blur(8px);" : ""}
  }
  to {
    clip-path: circle(150% at ${position});
    ${blur ? "filter: blur(0px);" : ""}
  }
}
      `,
        }
    }

    // Fallback (no animation)
    return {
        name: "none",
        css: "",
    }
}
