"use client";

import React, { useRef, useState, useEffect, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ImageTrailProps {
    children: ReactNode;
    images: string[];
    // How much mouse movement (in px) is required to spawn a new image
    renderDistance?: number;
}

export default function ImageTrail({
    children,
    images,
    renderDistance = 50,
}: ImageTrailProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    // Keep track of the mouse position to calculate distance since last spawn
    const lastRenderPosition = useRef({ x: 0, y: 0 });
    // Which image index to use next
    const imageIndex = useRef(0);

    // Active spawned images
    const [renderedImages, setRenderedImages] = useState<
        { id: number; x: number; y: number; src: string; rotation: number }[]
    >([]);

    // Auto-increment ID for uniqueness
    const imageIdCounter = useRef(0);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;

        // Get relative mouse position inside the container
        const rect = containerRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const distance = Math.hypot(
            mouseX - lastRenderPosition.current.x,
            mouseY - lastRenderPosition.current.y
        );

        if (distance >= renderDistance) {
            // Spawn a new image
            const newImage = {
                id: imageIdCounter.current++,
                x: mouseX,
                y: mouseY,
                src: images[imageIndex.current],
                // Random rotation between -10deg and 10deg
                rotation: Math.random() * 20 - 10,
            };

            setRenderedImages((prev) => [...prev, newImage]);

            lastRenderPosition.current = { x: mouseX, y: mouseY };
            imageIndex.current = (imageIndex.current + 1) % images.length;

            // Remove the image after a delay to create the "trail fading" effect
            setTimeout(() => {
                setRenderedImages((prev) => prev.filter((img) => img.id !== newImage.id));
            }, 800);
        }
    };

    return (
        <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className="relative w-full h-full overflow-hidden"
            style={{ cursor: "default" }}
        >
            {/* The underlying content (Hero Section) */}
            <div className="relative z-10 pointer-events-none">{children}</div>

            {/* The trailing images container */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                <AnimatePresence>
                    {renderedImages.map((img) => (
                        <motion.img
                            key={img.id}
                            src={img.src}
                            initial={{
                                opacity: 1,
                                scale: 0.8,
                                x: img.x - 10, // Center offset (assumes img width ~200px)
                                y: img.y - 15, // Center offset (assumes img height ~250px)
                                rotate: img.rotation,
                            }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                            }}
                            exit={{
                                opacity: 0,
                                scale: 0.9,
                            }}
                            transition={{
                                duration: 0.5,
                                ease: "easeOut",
                            }}
                            className="absolute w-[112px] h-[144px] object-cover rounded-xl shadow-2xl pointer-events-none select-none"
                            style={{
                                willChange: "transform, opacity",
                            }}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
