'use client';

import { useState } from 'react';

interface FlipCardProps {
  front: {
    icon: React.ReactNode;
    title: string;
    description: string;
  };
  back: {
    title: string;
    description: string;
  };
}

export default function FlipCard({ front, back }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="group [perspective:1000px] cursor-pointer"
      onClick={() => setIsFlipped(prev => !prev)}
    >
      <div
        className={`relative h-[260px] transition-transform duration-700 ease-in-out [transform-style:preserve-3d] 
          ${isFlipped ? '[transform:rotateY(180deg)]' : ''} 
          md:group-hover:[transform:rotateY(180deg)]`}
      >
        {/* Front */}
        <div className="absolute inset-0 bg-background/50 border border-border p-8 hover:border-primary/50 transition-colors [backface-visibility:hidden]">
          <div className="w-12 h-12 bg-primary/10 flex items-center justify-center mb-6">
            {front.icon}
          </div>
          <h3 className="font-serif text-xl mb-3">{front.title}</h3>
          <p className="text-muted-foreground font-sans text-sm leading-relaxed">
            {front.description}
          </p>
        </div>

        {/* Back */}
        <div className="absolute inset-0 bg-background border border-primary/30 p-8 flex flex-col justify-center items-center text-center [transform:rotateY(180deg)] [backface-visibility:hidden]">
          <h3 className="font-serif text-xl mb-3">{back.title}</h3>
          <p className="text-muted-foreground text-sm">{back.description}</p>
        </div>
      </div>
    </div>
  );
}