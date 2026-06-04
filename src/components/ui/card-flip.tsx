"use client";

/**
 * @author: @dorianbaffier
 * @description: Card Flip
 * @version: 1.0.0
 * @date: 2025-06-26
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import { ArrowRight, Repeat2 } from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface CardFlipProps {
    title?: string;
    subtitle?: string;
    description?: string;
    features?: string[];
    step?: string;
    animation?: ReactNode;
}

export default function CardFlip({
    title = "Design Systems",
    subtitle = "Explore the fundamentals",
    description = "Dive deep into the world of modern UI/UX design.",
    // features = ["UI/UX", "Modern Design", "Tailwind CSS", "Kokonut UI"],
    step = "1",
    animation,
}: CardFlipProps) {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div
            className="group relative h-[380px] w-full max-w-[320px] [perspective:2000px]"
            onClick={() => setIsFlipped(prev => !prev)}
        >
            <div
                className={cn(
                    "relative h-full w-full",
                    "[transform-style:preserve-3d]",
                    "transition-all duration-700",
                    isFlipped
                        ? "[transform:rotateY(180deg)] md:[transform:rotateY(0deg)]"
                        : "[transform:rotateY(0deg)]",
                    "md:group-hover:[transform:rotateY(180deg)]"
                )}
            >
                <div
                    className={cn(
                        "absolute inset-0 h-full w-full",
                        "[backface-visibility:hidden] [transform:rotateY(0deg)]",
                        "overflow-hidden rounded-2xl",
                        "bg-surface",
                        "border border-primary/20",
                        "shadow-lg",
                        "transition-all duration-700",
                        "group-hover:shadow-xl group-hover:border-primary/40",
                        isFlipped ? "opacity-0 md:opacity-100" : "opacity-100",
                        "md:group-hover:opacity-0"
                    )}
                >
                    <div className="relative h-full overflow-hidden bg-gradient-to-b from-background to-surface">
                        {animation ? (
                            <div className="absolute inset-0 flex items-center justify-center px-4 pt-4 pb-28">
                                <div className="w-full h-full max-w-[280px] flex items-center justify-center">
                                    {animation}
                                </div>
                            </div>
                        ) : (
                            <div className="absolute inset-0 flex items-start justify-center pt-24">
                                <div className="relative flex h-[100px] w-[200px] items-center justify-center">
                                    {[...Array(10)].map((_, i) => (
                                        <div
                                            className={cn(
                                                "absolute h-[50px] w-[50px]",
                                                "rounded-[140px]",
                                                "animate-[scale_3s_linear_infinite]",
                                                "opacity-0",
                                                "shadow-[0_0_50px_rgba(37,99,235,0.5)]",
                                                "group-hover:animate-[scale_2s_linear_infinite]"
                                            )}
                                            key={i}
                                            style={{
                                                animationDelay: `${i * 0.3}s`,
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="absolute right-0 bottom-0 left-0 p-5">
                        <div className="flex items-center justify-between gap-3">
                            <div className="space-y-1.5">
                                <span className="font-mono text-xs text-cyber tracking-widest block">
                                    STEP_{step}
                                </span>
                                <h3 className="font-serif font-bold text-2xl text-foreground mb-3 tracking-tight transition-all duration-500 group-hover:translate-y-[-2px]">
                                    {title}
                                </h3>
                                <p className="line-clamp-2 text-sm text-muted-foreground transition-all duration-500 group-hover:translate-y-[-2px] font-sans">
                                    {description || subtitle}
                                </p>
                            </div>
                            <div className="group/icon relative">
                                <div
                                    className={cn(
                                        "absolute inset-[-8px] rounded-lg transition-opacity duration-300",
                                        "bg-gradient-to-br from-primary/20 via-primary/10 to-transparent"
                                    )}
                                />
                                <Repeat2 className="group-hover/icon:-rotate-12 relative z-10 h-4 w-4 text-primary transition-transform duration-300 group-hover/icon:scale-110" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Back of card */}
                <div
                    className={cn(
                        "absolute inset-0 h-full w-full",
                        "[backface-visibility:hidden] [transform:rotateY(180deg)]",
                        "rounded-2xl p-6",
                        "bg-gradient-to-b from-background to-surface",
                        "border border-primary/20",
                        "shadow-lg",
                        "flex flex-col",
                        "transition-all duration-700",
                        "group-hover:shadow-lg dark:group-hover:shadow-xl",
                        isFlipped ? "opacity-100 md:opacity-0" : "opacity-0",
                        "md:group-hover:opacity-100"
                    )}
                >
                    <div className="flex-1 space-y-6">
                        <div className="space-y-2">
                            <h3 className="font-serif font-bold text-2xl text-foreground leading-snug tracking-tight transition-all duration-500 group-hover:translate-y-[-2px]">
                                {title}
                            </h3>
                            <p className="text-sm text-muted-foreground tracking-tight transition-all duration-500 group-hover:translate-y-[-2px] font-sans">
                                {description}
                            </p>
                        </div>

                        {/* <div className="space-y-2">
                            {features.map((feature, index) => (
                                <div
                                    className="flex items-center gap-2 text-sm text-zinc-700 transition-all duration-500 dark:text-zinc-300"
                                    key={feature}
                                    style={{
                                        transform: isFlipped
                                            ? "translateX(0)"
                                            : "translateX(-10px)",
                                        opacity: isFlipped ? 1 : 0,
                                        transitionDelay: `${index * 100 + 200}ms`,
                                    }}
                                >
                                    <ArrowRight className="h-3 w-3 text-orange-500" />
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div> */}
                    </div>

                    <div className="mt-6 border-border border-t pt-6">
                        <div
                            className={cn(
                                "group/start relative",
                                "flex items-center justify-between",
                                "-m-3 rounded-xl p-3",
                                "transition-all duration-300",
                                "bg-gradient-to-r from-transparent via-transparent to-transparent",
                                "hover:from-primary/20 hover:via-primary/10 hover:to-transparent",
                                "hover:scale-[1.02] hover:cursor-pointer"
                            )}
                        >
                            <span className="font-mono text-sm text-foreground transition-colors duration-300 group-hover/start:text-primary">
                                Start today
                            </span>
                            <div className="group/icon relative">
                                <div
                                    className={cn(
                                        "absolute inset-[-6px] rounded-lg transition-all duration-300",
                                        "bg-gradient-to-br from-primary/20 via-primary/10 to-transparent",
                                        "scale-90 opacity-0 group-hover/start:scale-100 group-hover/start:opacity-100"
                                    )}
                                />
                                <ArrowRight className="relative z-10 h-4 w-4 text-primary transition-all duration-300 group-hover/start:translate-x-0.5 group-hover/start:scale-110" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes scale {
                    0% {
                        transform: scale(2);
                        opacity: 0;
                        box-shadow: 0px 0px 50px rgba(37, 99, 235, 0.5);
                    }
                    50% {
                        transform: translate(0px, -5px) scale(1);
                        opacity: 1;
                        box-shadow: 0px 8px 20px rgba(37, 99, 235, 0.5);
                    }
                    100% {
                        transform: translate(0px, 5px) scale(0.1);
                        opacity: 0;
                        box-shadow: 0px 10px 20px rgba(37, 99, 235, 0);
                    }
                }
            `}</style>
        </div>
    );
}
