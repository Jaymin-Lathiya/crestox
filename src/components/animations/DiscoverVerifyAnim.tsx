"use client";

import React from "react";

export default function DiscoverVerifyAnim() {
  return (
    <>
      <div className="cx-anim cx-discover">
        <svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <linearGradient id="cxArt1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#E8EEFF" />
              <stop offset="100%" stopColor="#C9D6FF" />
            </linearGradient>
            <linearGradient id="cxScan" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#4A6CF7" stopOpacity="0" />
              <stop offset="50%" stopColor="#4A6CF7" stopOpacity=".55" />
              <stop offset="100%" stopColor="#4A6CF7" stopOpacity="0" />
            </linearGradient>
            <clipPath id="cxFrameClip">
              <rect x="80" y="40" width="160" height="120" rx="6" />
            </clipPath>
          </defs>

          {/* Artwork frame */}
          <rect x="76" y="36" width="168" height="128" rx="8" fill="none"
            stroke="#4A6CF7" strokeOpacity=".25" strokeWidth="1.5" />
          <rect x="80" y="40" width="160" height="120" rx="6" fill="url(#cxArt1)" />

          {/* Abstract artwork shapes */}
          <g clipPath="url(#cxFrameClip)" opacity=".75">
            <circle cx="120" cy="90" r="22" fill="#4A6CF7" opacity=".25" />
            <circle cx="180" cy="120" r="30" fill="#4A6CF7" opacity=".18" />
            <path d="M85 145 Q140 110 235 150" stroke="#4A6CF7" strokeOpacity=".4" strokeWidth="2" fill="none" />
          </g>

          {/* Scan line */}
          <g clipPath="url(#cxFrameClip)">
            <rect className="cx-scanbar" x="80" y="40" width="160" height="14" fill="url(#cxScan)" />
          </g>

          {/* Magnifying glass */}
          <g className="cx-mag">
            <circle cx="0" cy="0" r="22" fill="#FFFFFF" stroke="#4A6CF7" strokeWidth="2.2" />
            <line x1="16" y1="16" x2="28" y2="28" stroke="#4A6CF7" strokeWidth="3" strokeLinecap="round" />
            <circle cx="0" cy="0" r="22" fill="#4A6CF7" fillOpacity=".06" />
          </g>

          {/* Verified badge */}
          <g className="cx-badge" transform="translate(228,52)">
            <circle r="14" fill="#4A6CF7" />
            <path d="M-6 0 L-1 5 L7 -4" stroke="#fff" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </svg>
      </div>

      <style>{`
        .cx-anim { width: 100%; aspect-ratio: 320/200; margin: auto; background: transparent; }
        .cx-anim svg { width: 100%; height: 100%; display: block; overflow: visible; }

        .cx-discover .cx-scanbar {
          animation: cxScan 3.2s ease-in-out infinite;
          transform-box: fill-box;
        }
        @keyframes cxScan {
          0%   { transform: translateY(0);     opacity: 0 }
          15%  { opacity: 1 }
          85%  { opacity: 1 }
          100% { transform: translateY(106px); opacity: 0 }
        }

        .cx-discover .cx-mag {
          transform-origin: 160px 100px;
          animation: cxMag 4s ease-in-out infinite;
        }
        @keyframes cxMag {
          0%   { transform: translate(110px,70px) rotate(0deg) }
          35%  { transform: translate(195px,85px) rotate(0deg) }
          65%  { transform: translate(150px,130px) rotate(0deg) }
          100% { transform: translate(110px,70px) rotate(0deg) }
        }

        .cx-discover .cx-badge {
          opacity: 0;
          transform-origin: 228px 52px;
          animation: cxBadge 3.2s ease-out infinite;
        }
        @keyframes cxBadge {
          0%,70% { opacity: 0; transform: translate(228px,52px) scale(.4) }
          80%    { opacity: 1; transform: translate(228px,52px) scale(1.15) }
          100%   { opacity: 1; transform: translate(228px,52px) scale(1) }
        }
      `}</style>
    </>
  );
}
