import { Instagram, Link2, Linkedin, Twitter } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";

const PLATFORM_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
    instagram: Instagram,
    twitter: Twitter,
    x: Twitter,
    linkedin: Linkedin,
};

export interface SocialMediaLink {
    platform: string;
    url: string;
}

interface SocialButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
    links?: SocialMediaLink[];
}

export default function SocialButton({
    links = [],
    className,
    onClick: onClickProp,
    ...props
}: SocialButtonProps) {
    const [isHoverOpen, setIsHoverOpen] = useState(false);
    const [isTapOpen, setIsTapOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const rootRef = useRef<HTMLDivElement>(null);
    const isMobileLayout = useMediaQuery("(max-width: 767px)");
    const expanded = isMobileLayout ? isTapOpen : isHoverOpen;

    const buttons = links.length > 0
        ? links.map(({ platform, url }) => ({
            icon: PLATFORM_ICONS[platform.toLowerCase()] ?? Link2,
            label: `${platform}`,
            url,
        }))
        : [
            { icon: Twitter, label: "Share on Twitter", url: "" },
            { icon: Instagram, label: "Share on Instagram", url: "" },
            { icon: Linkedin, label: "Share on LinkedIn", url: "" },
            { icon: Link2, label: "Copy link", url: "" },
        ];

    useEffect(() => {
        if (!isMobileLayout || !isTapOpen) return;
        const handler = (e: PointerEvent) => {
            if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
                setIsTapOpen(false);
            }
        };
        document.addEventListener("pointerdown", handler);
        return () => document.removeEventListener("pointerdown", handler);
    }, [isMobileLayout, isTapOpen]);

    const handleIconClick = (index: number) => {
        setActiveIndex(index);
        setTimeout(() => setActiveIndex(null), 300);
        const item = buttons[index];
        if (item?.url && item.url.startsWith("http")) {
            window.open(item.url, "_blank", "noopener,noreferrer");
        } else if (links.length === 0 && index === 3) {
            navigator.clipboard?.writeText(typeof window !== "undefined" ? window.location.href : "");
        }
        if (isMobileLayout) {
            setIsTapOpen(false);
        }
    };

    const handleMainButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (isMobileLayout) {
            e.preventDefault();
            setIsTapOpen((v) => !v);
        }
        onClickProp?.(e);
    };

    return (
        <div
            ref={rootRef}
            className="relative"
            data-social-root
            onMouseEnter={() => {
                if (!isMobileLayout) setIsHoverOpen(true);
            }}
            onMouseLeave={() => {
                if (!isMobileLayout) setIsHoverOpen(false);
            }}
        >
            <motion.div
                animate={{
                    opacity: expanded ? 0 : 1,
                }}
                className="relative"
                style={{ pointerEvents: expanded ? "none" : "auto" }}
                transition={{
                    duration: 0.2,
                    ease: "easeInOut",
                }}
            >
                <Button
                    type="button"
                    className={cn(
                        "relative min-w-40 rounded-full",
                        "bg-white dark:bg-card/50",
                        "hover:bg-gray-50 dark:hover:bg-gray-950",
                        "text-black dark:text-white",
                        "border border-black/10 dark:border-white/10",
                        "transition-colors duration-200",
                        className
                    )}
                    aria-expanded={isMobileLayout ? isTapOpen : undefined}
                    {...props}
                    onClick={handleMainButtonClick}
                >
                    <span className="flex items-center gap-2 font-mono text-xs text-foreground uppercase tracking-wide group-hover:text-primary transition-colors duration-300">
                        <Link2 className="h-4 w-4" />
                        Social media
                    </span>
                </Button>
            </motion.div>

            <motion.div
                animate={{
                    width: expanded ? "auto" : 0,
                }}
                className={cn(
                    "absolute top-0 left-0 flex h-10 overflow-hidden",
                    expanded ? "z-20" : "z-0"
                )}
                transition={{
                    duration: 0.3,
                    ease: [0.23, 1, 0.32, 1],
                }}
            >
                {buttons.map((button, i) => {
                    const Icon = button.icon;
                    return (
                        <motion.button
                            animate={{
                                opacity: expanded ? 1 : 0,
                                x: expanded ? 0 : -20,
                            }}
                            aria-label={button.label}
                            className={cn(
                                "h-10",
                                "w-10",
                                "shrink-0",
                                "flex items-center justify-center",
                                "bg-black dark:bg-white",
                                "text-white dark:text-black",
                                i === 0 && "rounded-l-md",
                                i === buttons.length - 1 && "rounded-r-md",
                                "border-white/10 border-r last:border-r-0 dark:border-black/10",
                                "hover:bg-gray-900 dark:hover:bg-gray-100",
                                "outline-none",
                                "relative overflow-hidden",
                                "transition-colors duration-200"
                            )}
                            key={`social-${button.label}-${i}`}
                            onClick={() => handleIconClick(i)}
                            transition={{
                                duration: 0.3,
                                ease: [0.23, 1, 0.32, 1],
                                delay: expanded ? i * 0.05 : 0,
                            }}
                            type="button"
                        >
                            <motion.div
                                animate={{
                                    scale: activeIndex === i ? 0.85 : 1,
                                }}
                                className="relative z-10"
                                transition={{
                                    duration: 0.2,
                                    ease: "easeInOut",
                                }}
                            >
                                <Icon className="h-4 w-4" />
                            </motion.div>
                            <motion.div
                                animate={{
                                    opacity: activeIndex === i ? 0.15 : 0,
                                }}
                                className="absolute inset-0 bg-white dark:bg-black"
                                initial={{ opacity: 0 }}
                                transition={{
                                    duration: 0.2,
                                    ease: "easeInOut",
                                }}
                            />
                        </motion.button>
                    );
                })}
            </motion.div>
        </div>
    );
}
