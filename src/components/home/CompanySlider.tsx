"use client";

import React from 'react';
import Slider from 'react-infinite-logo-slider';
import { Building2, Globe, ShieldCheck, Landmark, Gem, Crown } from 'lucide-react';

const COMPANIES = [
    { name: "ArtAuth", icon: ShieldCheck },
    { name: "GlobalGallery", icon: Globe },
    { name: "SecureVault", icon: Landmark },
    { name: "GemStone", icon: Gem },
    { name: "RoyalArts", icon: Crown },
    { name: "MetroMuseum", icon: Building2 },
    { name: "PixelPerfect", icon: Gem },
    { name: "CryptoCanvas", icon: Globe },
];

export default function CompanySlider() {
    return (
        <section className="py-24 border-y border-border/40 bg-background/50 backdrop-blur-sm overflow-hidden">
            <div className="container mx-auto px-4 mb-8 text-center">
                <p className="text-muted-foreground font-mono text-xs tracking-[0.2em] uppercase">Trusted by Industry Leaders</p>
            </div>

            <div className="w-full">
                <Slider
                    width="250px"
                    duration={40}
                    blurBorders={true}
                    blurBorderColor={'transparent'}
                >
                    {COMPANIES.map((company, index) => (
                        <Slider.Slide key={index}>
                            <div className="flex items-center gap-3 px-8 opacity-50 hover:opacity-100 transition-opacity duration-300 group cursor-default">
                                <company.icon className="w-8 h-8 text-foreground group-hover:text-primary transition-colors" />
                                <span className="text-xl font-serif font-medium text-foreground group-hover:text-primary transition-colors">
                                    {company.name}
                                </span>
                            </div>
                        </Slider.Slide>
                    ))}
                </Slider>
            </div>
        </section>
    );
}
