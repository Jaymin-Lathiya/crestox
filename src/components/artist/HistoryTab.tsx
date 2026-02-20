import React from 'react';
import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContent,
  MorphingDialogTitle,
  MorphingDialogImage,
  MorphingDialogSubtitle,
  MorphingDialogClose,
  MorphingDialogDescription,
  MorphingDialogContainer,
} from '@/components/motion-primitives/morphing-dialog';
import { PlusIcon } from 'lucide-react';

interface HistoryEvent {
  id: string;
  type: 'sale' | 'mint' | 'exhibition';
  title: string;
  date: string;
  value?: string;
  description: string;
  image: string;
}

const historyEvents: HistoryEvent[] = [
  {
    id: '1',
    type: 'sale',
    title: 'Void Symphony #12',
    date: 'Jan 15, 2024',
    value: '$45,000',
    description:
      'Sold to a private collector in Tokyo. This piece is part of the Void Symphony series, exploring the visualization of silence through generative algorithms.',
    image:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop',
  },
  {
    id: '2',
    type: 'exhibition',
    title: 'Art Basel Miami Feature',
    date: 'Dec 8, 2023',
    description:
      'Selected for the main digital gallery at Art Basel Miami. The installation featured a real-time generative display of the "Algorithmic Decay" series.',
    image:
      'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2670&auto=format&fit=crop',
  },
  {
    id: '3',
    type: 'mint',
    title: 'Algorithmic Decay II',
    date: 'Nov 22, 2023',
    description:
      'Minted the second iteration of the Algorithmic Decay collection. This series focuses on the concept of digital entropy and data rot over time.',
    image:
      'https://images.unsplash.com/photo-1614850523060-8da1d56ae167?q=80&w=2670&auto=format&fit=crop',
  },
  {
    id: '4',
    type: 'sale',
    title: 'Void Symphony #7',
    date: 'Oct 30, 2023',
    value: '$1,200,000',
    description:
      'Record-breaking sale at Christie’s Digital Art Auction. "Void Symphony #7" is considered a seminal work in the artist’s career.',
    image:
      'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=3000&auto=format&fit=crop',
  },
  {
    id: '5',
    type: 'sale',
    title: 'Digital Finitude #3',
    date: 'Sep 15, 2023',
    value: '$28,500',
    description:
      'Sold via the gallery platform. "Digital Finitude" questions the infinite reproducibility of digital assets through unique, one-time generation processes.',
    image:
      'https://images.unsplash.com/photo-1509023464722-18d996393ca8?q=80&w=2670&auto=format&fit=crop',
  },
  {
    id: '6',
    type: 'exhibition',
    title: 'MoMA Digital Solo Show',
    date: 'Aug 1, 2023',
    description:
      'Use of AI in modern art was the central theme of this solo exhibition at MoMA Digital. Curated by Sarah Johnson.',
    image:
      'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?q=80&w=2572&auto=format&fit=crop',
  },
];

const HistoryTab: React.FC = () => {
  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
      {historyEvents.map((event) => (
        <MorphingDialog
          key={event.id}
          transition={{
            type: 'spring',
            bounce: 0.05,
            duration: 0.25,
          }}
        >
          <MorphingDialogTrigger
            style={{
              borderRadius: '12px',
            }}
            className='flex flex-col overflow-hidden !rounded-lg border border-zinc-950/10 bg-white dark:border-zinc-50/10 dark:bg-zinc-900'
          >
            <MorphingDialogImage
              src={event.image}
              alt={event.title}
              className='h-48 w-full object-cover'
            />
            <div className='flex grow flex-row items-end justify-between px-3 py-2'>
              <div>
                <MorphingDialogTitle className='text-zinc-950 dark:text-zinc-50'>
                  {event.title}
                </MorphingDialogTitle>
                <MorphingDialogSubtitle className='text-zinc-700 dark:text-zinc-400'>
                  {event.date}
                </MorphingDialogSubtitle>
              </div>
              <button
                type='button'
                className='relative ml-1 flex h-6 w-6 shrink-0 scale-100 select-none appearance-none items-center justify-center rounded-lg border border-zinc-950/10 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 focus-visible:ring-2 active:scale-[0.98] dark:border-zinc-50/10 dark:bg-zinc-900 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 dark:focus-visible:ring-zinc-500'
                aria-label='Open dialog'
              >
                <PlusIcon size={12} />
              </button>
            </div>
          </MorphingDialogTrigger>
          <MorphingDialogContainer>
            <MorphingDialogContent
              style={{
                borderRadius: '24px',
              }}
              className='pointer-events-auto relative flex h-auto w-full flex-col overflow-hidden border border-zinc-950/10 bg-white dark:border-zinc-50/10 dark:bg-zinc-900 sm:w-[500px]'
            >
              <MorphingDialogImage
                src={event.image}
                alt={event.title}
                className='h-full w-full'
              />
              <div className='p-6'>
                <MorphingDialogTitle className='text-2xl text-zinc-950 dark:text-zinc-50'>
                  {event.title}
                </MorphingDialogTitle>
                <MorphingDialogSubtitle className='text-zinc-700 dark:text-zinc-400'>
                  {event.type.charAt(0).toUpperCase() + event.type.slice(1)} •{' '}
                  {event.date}
                  {event.value && ` • ${event.value}`}
                </MorphingDialogSubtitle>
                <MorphingDialogDescription
                  disableLayoutAnimation
                  variants={{
                    initial: { opacity: 0, scale: 0.8, y: 100 },
                    animate: { opacity: 1, scale: 1, y: 0 },
                    exit: { opacity: 0, scale: 0.8, y: 100 },
                  }}
                >
                  <p className='mt-2 text-zinc-500 dark:text-zinc-500 font-sans'>
                    {event.description}
                  </p>
                </MorphingDialogDescription>
              </div>
              <MorphingDialogClose className='text-zinc-50' />
            </MorphingDialogContent>
          </MorphingDialogContainer>
        </MorphingDialog>
      ))}
    </div>
  );
};

export default HistoryTab;


// import React from 'react';
// import { motion } from 'framer-motion';
// import { ArrowLeft, Award, History } from 'lucide-react';

// interface HistoryEvent {
//   id: string;
//   type: 'sale' | 'mint' | 'exhibition';
//   title: string;
//   date: string;
//   value?: string;
// }

// const historyEvents: HistoryEvent[] = [
//   { id: '1', type: 'sale', title: 'Void Symphony #12 sold', date: 'Jan 15, 2024', value: '$45,000' },
//   { id: '2', type: 'exhibition', title: 'Featured in Art Basel Miami', date: 'Dec 8, 2023' },
//   { id: '3', type: 'mint', title: 'New collection: Algorithmic Decay II', date: 'Nov 22, 2023' },
//   { id: '4', type: 'sale', title: 'Void Symphony #7 sold', date: 'Oct 30, 2023', value: '$1,200,000' },
//   { id: '5', type: 'sale', title: 'Digital Finitude #3 sold', date: 'Sep 15, 2023', value: '$28,500' },
//   { id: '6', type: 'exhibition', title: 'Solo show at MoMA Digital', date: 'Aug 1, 2023' },
// ];

// const HistoryTab: React.FC = () => {
//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.5 }}
//       className="max-w-2xl mx-auto space-y-3"
//     >
//       {historyEvents.map((event, index) => (
//         <motion.div
//           key={event.id}
//           initial={{ opacity: 0, x: -20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ delay: index * 0.05, duration: 0.4 }}
//           className="glass p-4 rounded-lg flex items-center justify-between hover:border-primary/50 transition-colors duration-300"
//         >
//           <div className="flex items-center space-x-4">
//             <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
//               event.type === 'sale' ? 'bg-primary/10 text-primary' :
//               event.type === 'mint' ? 'bg-accent/10 text-accent' :
//               'bg-muted text-muted-foreground'
//             }`}>
//               {event.type === 'sale' && <ArrowLeft size={16} className="rotate-[135deg]" />}
//               {event.type === 'mint' && <Award size={16} />}
//               {event.type === 'exhibition' && <History size={16} />}
//             </div>
//             <div>
//               <p className="font-mono text-sm text-foreground">{event.title}</p>
//               <p className="font-mono text-xs text-muted-foreground">{event.date}</p>
//             </div>
//           </div>
//           {event.value && (
//             <span className="font-mono text-sm text-primary">{event.value}</span>
//           )}
//         </motion.div>
//       ))}
//     </motion.div>
//   );
// };

// export default HistoryTab;
