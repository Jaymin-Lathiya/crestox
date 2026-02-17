"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils'; // Assuming shadcn utils exist, otherwise I'll mock or find it
import { Skeleton } from '@/components/ui/skeleton'; // Assuming shadcn skeleton exists

interface ArtworkCardProps {
    image: string;
    title: string;
    artist: string;
    price: string; // Formatted price string
    loading?: boolean;
    aspectRatio?: string; // Optional aspect ratio for the image container
}

export const ArtworkCard: React.FC<ArtworkCardProps> = ({
    image,
    title,
    artist,
    price,
    loading = false,
    aspectRatio = 'aspect-[3/4]',
}) => {
    const [isOverlayVisible, setIsOverlayVisible] = useState(false);

    // Toggle for mobile tap
    const handleInteraction = () => {
        // Check if touch device logic if needed, but simple toggle works for both usually 
        // For desktop 'hover' handles it, for mobile 'click'/tap handles it.
        // However, requirements say: 
        // Desktop (Hover): details reveal. 
        // Mobile (Tap): toggle details.
        // We can use CSS group-hover for desktop and state for mobile?
        // Or just state for simplicity if we can detect mismatch. 
        // Actually, let's use a hybrid approach. 
        // We will rely on CSS `group-hover` for desktop-like behavior where applicable,
        // and `onClick` to toggle a class or state for mobile.
        // But `onClick` on desktop would also trigger. 
        // Let's use `onMouseEnter` / `onMouseLeave` for desktop and `onClick` for mobile strictly?
        // A cleaner way for "Touch" devices usually involves checking pointer type, 
        // but a simple "onClick" to toggle visibility state works if we treat hover as a separate CSS only trigger?
        // Requirement: "Desktop (Hover): Hovering... reveals. Mobile (Tap): Tapping... toggles."

        // Best approach: Use CSS for desktop hover, and State for mobile tap active state.

        if (window.matchMedia('(hover: none)').matches) {
            setIsOverlayVisible(!isOverlayVisible);
        }
    };

    if (loading) {
        return (
            <div className={cn("relative w-full overflow-hidden rounded-none bg-muted", aspectRatio)}>
                <Skeleton className="h-full w-full" />
                <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
                    <Skeleton className="h-4 w-3/4 bg-white/20" />
                    <Skeleton className="h-3 w-1/2 bg-white/20" />
                    <Skeleton className="h-3 w-1/3 bg-white/20" />
                </div>
            </div>
        );
    }

    return (
        <div
            className={cn(
                "group relative w-full overflow-hidden rounded-none cursor-pointer bg-muted",
                aspectRatio
            )}
            onClick={handleInteraction}
            onMouseEnter={() => !window.matchMedia('(hover: none)').matches && setIsOverlayVisible(true)}
            onMouseLeave={() => !window.matchMedia('(hover: none)').matches && setIsOverlayVisible(false)}
        >
            {/* Image */}
            <img
                src={image}
                alt={title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
            />

            {/* Overlay */}
            <div
                className={cn(
                    "absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col justify-end p-5 transition-opacity duration-300",
                    isOverlayVisible ? "opacity-100" : "opacity-0 md:group-hover:opacity-100"
                )}
            >
                <div className="translate-y-4 transform transition-transform duration-300 group-hover:translate-y-0">
                    <h3 className="font-serif text-xl font-medium text-white mb-1">{title}</h3>
                    <p className="font-mono text-xs uppercase tracking-widest text-white/70 mb-3">{artist}</p>
                    <div className="flex items-center gap-2">
                        <span className="text-white/50 text-xs font-mono">STARTING FROM</span>
                        <span className="text-primary font-mono font-bold text-sm tracking-wide">{price}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
