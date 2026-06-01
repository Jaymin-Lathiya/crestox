"use client";

import React from "react";

export default function TradeAnytimeAnim() {
  return (
    <>
      <div className="cx-anim cx-trade">
        <svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">

          {/* Background Exchange Track */}
          <path d="M 100 100 A 60 60 0 1 1 220 100 A 60 60 0 1 1 100 100"
            fill="none" stroke="#4A6CF7" strokeOpacity=".2" strokeWidth="2" strokeDasharray="4 4" />

          {/* Left Node */}
          <g transform="translate(100,100)">
            <rect x="-24" y="-24" width="48" height="48" rx="12" fill="#FFFFFF" stroke="#4A6CF7" strokeOpacity=".15" strokeWidth="1.5" />
            <rect x="-14" y="-14" width="28" height="28" rx="8" fill="#E8EEFF" />
          </g>

          {/* Right Node */}
          <g transform="translate(220,100)">
            <rect x="-24" y="-24" width="48" height="48" rx="12" fill="#FFFFFF" stroke="#4A6CF7" strokeOpacity=".15" strokeWidth="1.5" />
            <rect x="-14" y="-14" width="28" height="28" rx="8" fill="#E8EEFF" />
          </g>

          {/* Central Swap Hub */}
          <g transform="translate(160,100)">
            <circle r="26" fill="#FFFFFF" stroke="#4A6CF7" strokeOpacity=".15" strokeWidth="1.5" />
            <circle r="18" fill="#E8EEFF" />
            <g stroke="#4A6CF7" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M-6,-4 L6,-4 L2,-8 M6,-4 L2,0" />
              <path d="M6,4 L-6,4 L-2,0 M-6,4 L-2,8" />
            </g>
          </g>

          {/* Orbiting Assets */}
          <g transform="translate(160,100)">
            <g className="cx-orbit">
              {/* Asset 1: Fractional Art Box */}
              <g transform="translate(-60,0)">
                <g className="cx-counter">
                  <rect x="-8" y="-8" width="16" height="16" rx="4" fill="#4A6CF7" />
                </g>
              </g>
              {/* Asset 2: Currency Token */}
              <g transform="translate(60,0)">
                <g className="cx-counter">
                  <circle cx="0" cy="0" r="8" fill="#FFFFFF" stroke="#4A6CF7" strokeWidth="2.5" />
                </g>
              </g>
            </g>
          </g>
        </svg>
      </div>

      <style>{`
        .cx-anim { width: 100%; aspect-ratio: 320/200; margin: auto; background: transparent; }
        .cx-anim svg { width: 100%; height: 100%; display: block; overflow: visible; }

        .cx-trade .cx-orbit {
          animation: cxOrbit 4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .cx-trade .cx-counter {
          animation: cxCounter 4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          transform-origin: 0px 0px;
        }
        @keyframes cxOrbit {
          0%, 15%   { transform: rotate(0deg) }
          45%, 65%  { transform: rotate(180deg) }
          95%, 100% { transform: rotate(360deg) }
        }
        @keyframes cxCounter {
          0%, 15%   { transform: rotate(0deg) }
          45%, 65%  { transform: rotate(-180deg) }
          95%, 100% { transform: rotate(-360deg) }
        }
      `}</style>
    </>
  );
}
