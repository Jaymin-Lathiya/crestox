"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { Save, FolderPlus, MoreHorizontal } from 'lucide-react';

interface CosmosArtworkCardProps {
    image: string;
    title: string;
    artist: string;
    aspectRatio?: string;
    className?: string;
}

export function CosmosArtworkCard({
    image,
    title,
    artist,
    aspectRatio = "aspect-[3/4]",
    className
}: CosmosArtworkCardProps) {
    return (
        <div className={cn("group relative break-inside-avoid mb-10", className)}>
            <div className="relative overflow-hidden rounded-none bg-secondary/20">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-[-10px] group-hover:translate-y-0">
                    <button className="bg-white/90 dark:bg-black/80 hover:bg-white dark:hover:bg-black p-2 rounded-full backdrop-blur-sm transition-colors shadow-sm">
                        <FolderPlus className="w-4 h-4 text-foreground" />
                    </button>
                    <button className="bg-primary hover:bg-primary/90 text-primary-foreground p-2 rounded-full shadow-sm transition-colors cursor-pointer">
                        <Save className="w-4 h-4" />
                    </button>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-[10px] group-hover:translate-y-0">
                    <h3 className="font-serif text-white text-lg leading-tight mb-1 drop-shadow-md">{title}</h3>
                    <div className="flex items-center justify-between">
                        <p className="font-mono text-white/80 text-xs tracking-wider">{artist}</p>
                        <button className="text-white/60 hover:text-white transition-colors">
                            <MoreHorizontal className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
