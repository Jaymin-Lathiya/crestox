"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface MasonryGridProps {
    children: React.ReactNode;
    className?: string;
}

export function MasonryGrid({ children, className }: MasonryGridProps) {
    return (
        <div className={cn(
            "columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-10",
            className
        )}>
            {children}
        </div>
    );
}
