import React from 'react';

export default function NoiseOverlay() {
  return (
    <>
      {/* Noise texture overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
      {/* Scanlines */}
      <div 
        className="fixed inset-0 pointer-events-none z-[99]"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            hsla(0, 0%, 0%, 0.02) 2px,
            hsla(0, 0%, 0%, 0.02) 4px
          )`,
        }}
      />
      {/* Vignette */}
      <div 
        className="fixed inset-0 pointer-events-none z-[98]"
        style={{
          background: `radial-gradient(ellipse at center, transparent 0%, transparent 50%, hsla(0, 0%, 0%, 0.4) 100%)`,
        }}
      />
    </>
  );
}
