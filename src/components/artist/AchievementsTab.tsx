import React from 'react';
import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContent,
  MorphingDialogTitle,
  MorphingDialogImage,
  MorphingDialogSubtitle,
  MorphingDialogClose,
  MorphingDialogContainer,
} from '@/components/motion-primitives/morphing-dialog';

import { ScrollArea } from '@/components/ui/scroll-area';

interface Achievement {
  id: string;
  title: string;
  year: string;
  description: string;
  image: string;
}

const achievements: Achievement[] = [
  {
    id: '1',
    title: 'Venice Biennale Selection',
    year: '2024',
    description:
      'Featured in the Digital Pavilion with "Algorithmic Decay" series. The exhibition explored the intersection of organic decomposition and digital persistence, questioning the permanence of byte-based art forms.',
    image:
      'https://images.unsplash.com/photo-1579783902614-a3fb39279c23?q=80&w=2072&auto=format&fit=crop',
  },
  {
    id: '2',
    title: "Christie's Digital Art Auction",
    year: '2023',
    description:
      'Record-breaking sale of "Void Symphony #7" at $1.2M. This piece marked a turning point in the valuation of generative art, attracting collectors from traditional and crypto spheres alike.',
    image:
      'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1974&auto=format&fit=crop',
  },
  {
    id: '3',
    title: 'MoMA Permanent Collection',
    year: '2023',
    description:
      "Three works acquired for the museum's digital art collection. The acquisition includes early prototypes of the 'Fractal Echoes' series, now preserved for future generations of digital art historians.",
    image:
      'https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=1978&auto=format&fit=crop',
  },
  {
    id: '5',
    title: 'Emerging Artist Award',
    year: '2021',
    description: 'Recognized by the Digital Art Foundation for innovation in algorithmic art',
    image:
      'https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=1978&auto=format&fit=crop',
  },
];

const AchievementsTab: React.FC = () => {
  return (
    <div className='mx-auto max-w-xl space-y-4'>
      {achievements.map((achievement) => (
        <MorphingDialog
          key={achievement.id}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 24,
          }}
        >
          <MorphingDialogTrigger
            style={{ borderRadius: '4px' }}
            className='w-full border border-border bg-background'
          >
            <div className='flex items-center space-x-3 p-3'>
              <MorphingDialogImage
                src={achievement.image}
                alt={achievement.title}
                className='h-10 w-10 object-cover'
                style={{ borderRadius: '4px' }}
              />
              <div className='flex flex-col items-start justify-center space-y-0'>
                <MorphingDialogTitle className='text-xs font-medium text-foreground'>
                  {achievement.title}
                </MorphingDialogTitle>
                <MorphingDialogSubtitle className='text-xs text-muted-foreground'>
                  {achievement.year}
                </MorphingDialogSubtitle>
              </div>
            </div>
          </MorphingDialogTrigger>

          <MorphingDialogContainer>
            <MorphingDialogContent
              style={{ borderRadius: '12px' }}
              className='relative h-auto w-[500px] border border-border bg-background'
            >
              <ScrollArea className='h-[90vh]' type='scroll'>
                <div className='relative p-6'>
                  <div className='flex justify-center py-8'>
                    <MorphingDialogImage
                      src={achievement.image}
                      alt={achievement.title}
                      className='h-auto w-[220px]'
                    />
                  </div>

                  <MorphingDialogTitle className='text-lg font-semibold text-foreground'>
                    {achievement.title}
                  </MorphingDialogTitle>

                  <MorphingDialogSubtitle className='font-light text-muted-foreground'>
                    {achievement.year}
                  </MorphingDialogSubtitle>

                  <div className='mt-4 space-y-4 text-sm text-foreground/80 leading-relaxed font-sans'>
                    <p>{achievement.description}</p>

                    <p>
                      This milestone significantly contributed to the artist’s
                      global recognition in generative and algorithmic art,
                      influencing collectors, institutions, and future digital
                      exhibition models.
                    </p>
                  </div>
                </div>
              </ScrollArea>

              <MorphingDialogClose className='text-muted-foreground' />
            </MorphingDialogContent>
          </MorphingDialogContainer>
        </MorphingDialog>
      ))}
    </div>
  );
};

export default AchievementsTab;




