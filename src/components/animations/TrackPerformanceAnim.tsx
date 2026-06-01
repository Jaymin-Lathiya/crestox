"use client";

import React from "react";

export default function TrackPerformanceAnim() {
  return (
    <>
      <div className="cx-anim cx-track">
        <svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <linearGradient id="cxArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4A6CF7" stopOpacity=".28" />
              <stop offset="100%" stopColor="#4A6CF7" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <g stroke="#4A6CF7" strokeOpacity=".15" strokeWidth="1">
            <line x1="30" y1="50"  x2="300" y2="50" />
            <line x1="30" y1="95"  x2="300" y2="95" />
            <line x1="30" y1="140" x2="300" y2="140" />
          </g>

          {/* Filled area under curve */}
          <path className="cx-area"
            d="M30,140 L70,120 L110,128 L150,95 L190,108 L230,72 L270,80 L300,45 L300,160 L30,160 Z"
            fill="url(#cxArea)" />

          {/* Performance line */}
          <path className="cx-line"
            d="M30,140 L70,120 L110,128 L150,95 L190,108 L230,72 L270,80 L300,45"
            fill="none" stroke="#4A6CF7" strokeWidth="2.4"
            strokeLinecap="round" strokeLinejoin="round" />

          {/* Moving data point */}
          <g className="cx-dot">
            <circle r="9" fill="#4A6CF7" fillOpacity=".18" />
            <circle r="4.5" fill="#4A6CF7" />
            <circle r="2" fill="#fff" />
          </g>

          {/* Trend Tooltip */}
          <g className="cx-tag">
            <rect x="-16" y="-32" width="32" height="24" rx="6" fill="#4A6CF7" />
            <path d="M-4,-23 L0,-27 L4,-23 M0,-27 L0,-13"
              stroke="#fff" strokeWidth="2" fill="none"
              strokeLinecap="round" strokeLinejoin="round" />
            <path d="M-4,-8 L4,-8 L0,-2 Z" fill="#4A6CF7" />
          </g>
        </svg>
      </div>

      <style>{`
        .cx-anim { width: 100%; aspect-ratio: 320/200; margin: auto; background: transparent; }
        .cx-anim svg { width: 100%; height: 100%; display: block; overflow: visible; }

        .cx-track .cx-line {
          stroke-dasharray: 420;
          stroke-dashoffset: 420;
          animation: cxDraw 4s ease-in-out infinite;
        }
        .cx-track .cx-area {
          opacity: 0;
          animation: cxFill 4s ease-in-out infinite;
        }
        @keyframes cxDraw {
          0%   { stroke-dashoffset: 420 }
          60%  { stroke-dashoffset: 0   }
          100% { stroke-dashoffset: 0   }
        }
        @keyframes cxFill {
          0%,40% { opacity: 0 }
          70%,100% { opacity: 1 }
        }

        .cx-track .cx-dot {
          animation: cxDot 4s ease-in-out infinite;
        }
        .cx-track .cx-tag {
          opacity: 0;
          animation: cxTag 4s ease-in-out infinite;
        }
        @keyframes cxDot {
          0%       { transform: translate(30px,140px);  opacity: 0 }
          10%      { opacity: 1 }
          15%      { transform: translate(70px,120px) }
          30%      { transform: translate(110px,128px) }
          45%      { transform: translate(150px,95px) }
          55%      { transform: translate(190px,108px) }
          70%      { transform: translate(230px,72px) }
          82%      { transform: translate(270px,80px) }
          95%,100% { transform: translate(300px,45px); opacity: 1 }
        }
        @keyframes cxTag {
          0%,80%   { opacity: 0; transform: translate(300px,45px) scale(.7) }
          90%,100% { opacity: 1; transform: translate(300px,45px) scale(1) }
        }
      `}</style>
    </>
  );
}
