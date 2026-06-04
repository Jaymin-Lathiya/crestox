"use client";

import React from "react";

export default function AcquireFractionsAnim() {
  return (
    <>
      <div className="cx-anim cx-acquire">
        <svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <linearGradient id="cxArt2" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#E8EEFF" />
              <stop offset="100%" stopColor="#B9CBFF" />
            </linearGradient>
          </defs>

          {/* Whole artwork outline */}
          <rect x="92" y="36" width="136" height="128" rx="6"
            fill="none" stroke="#4A6CF7" strokeOpacity=".25" strokeWidth="1.2" />

          {/* 9 fractal tiles */}
          <g className="cx-grid">
            <rect className="cx-tile t1" x="92"  y="36"  width="44" height="42" rx="3" fill="url(#cxArt2)" />
            <rect className="cx-tile t2" x="138" y="36"  width="44" height="42" rx="3" fill="url(#cxArt2)" />
            <rect className="cx-tile t3" x="184" y="36"  width="44" height="42" rx="3" fill="url(#cxArt2)" />
            <rect className="cx-tile t4" x="92"  y="80"  width="44" height="42" rx="3" fill="url(#cxArt2)" />
            <rect className="cx-tile t5" x="138" y="80"  width="44" height="42" rx="3" fill="url(#cxArt2)" />
            <rect className="cx-tile t6" x="184" y="80"  width="44" height="42" rx="3" fill="url(#cxArt2)" />
            <rect className="cx-tile t7" x="92"  y="124" width="44" height="40" rx="3" fill="url(#cxArt2)" />
            <rect className="cx-tile t8" x="138" y="124" width="44" height="40" rx="3" fill="url(#cxArt2)" />
            <rect className="cx-tile t9" x="184" y="124" width="44" height="40" rx="3" fill="url(#cxArt2)" />
          </g>

          {/* Highlighted owned fractal */}
          <rect className="cx-owned" x="138" y="80" width="44" height="42" rx="3"
            fill="none" stroke="#4A6CF7" strokeWidth="2.2" />

          {/* Floating fractal token */}
          <g className="cx-token">
            <circle r="16" fill="#4A6CF7" />
            <g fill="#fff">
              <rect x="-5" y="-5" width="4" height="4" rx="1" />
              <rect x="1"  y="-5" width="4" height="4" rx="1" />
              <rect x="-5" y="1"  width="4" height="4" rx="1" />
              <rect x="1"  y="1"  width="4" height="4" rx="1" />
            </g>
          </g>
        </svg>
      </div>

      <style>{`
        .cx-anim { width: 100%; aspect-ratio: 320/200; margin: auto; background: transparent; }
        .cx-anim svg { width: 100%; height: 100%; display: block; overflow: visible; }

        .cx-acquire .cx-tile {
          transform-box: fill-box;
          transform-origin: center;
          animation: cxSplit 3.6s ease-in-out infinite;
        }
        .cx-acquire .t1 { animation-delay: .00s }
        .cx-acquire .t2 { animation-delay: .05s }
        .cx-acquire .t3 { animation-delay: .10s }
        .cx-acquire .t4 { animation-delay: .15s }
        .cx-acquire .t5 { animation-delay: .20s }
        .cx-acquire .t6 { animation-delay: .25s }
        .cx-acquire .t7 { animation-delay: .30s }
        .cx-acquire .t8 { animation-delay: .35s }
        .cx-acquire .t9 { animation-delay: .40s }

        @keyframes cxSplit {
          0%,12%   { transform: translate(0,0)                          scale(1);   opacity: 1 }
          45%,55%  { transform: translate(var(--dx,0),var(--dy,0))      scale(.92); opacity: .85 }
          88%,100% { transform: translate(0,0)                          scale(1);   opacity: 1 }
        }
        .cx-acquire .t1 { --dx: -8px; --dy: -8px }
        .cx-acquire .t2 { --dx: 0;    --dy: -10px }
        .cx-acquire .t3 { --dx: 8px;  --dy: -8px }
        .cx-acquire .t4 { --dx: -10px; --dy: 0 }
        .cx-acquire .t5 { --dx: 0;    --dy: 0 }
        .cx-acquire .t6 { --dx: 10px; --dy: 0 }
        .cx-acquire .t7 { --dx: -8px; --dy: 8px }
        .cx-acquire .t8 { --dx: 0;    --dy: 10px }
        .cx-acquire .t9 { --dx: 8px;  --dy: 8px }

        .cx-acquire .cx-owned {
          stroke-dasharray: 180;
          stroke-dashoffset: 180;
          animation: cxOwn 3.6s ease-out infinite;
        }
        @keyframes cxOwn {
          0%,40%   { stroke-dashoffset: 180; opacity: 0 }
          55%      { stroke-dashoffset: 0;   opacity: 1 }
          90%,100% { stroke-dashoffset: 0;   opacity: 1 }
        }

        .cx-acquire .cx-token {
          opacity: 0;
          animation: cxToken 3.6s ease-out infinite;
        }
        @keyframes cxToken {
          0%,55%   { transform: translate(160px,101px) scale(.4); opacity: 0 }
          70%      { transform: translate(260px,60px)  scale(1.1); opacity: 1 }
          90%,100% { transform: translate(260px,60px)  scale(1);   opacity: 1 }
        }
      `}</style>
    </>
  );
}
