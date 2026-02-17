import React from 'react';
import { motion } from 'framer-motion';

interface Collector {
  id: string;
  name: string;
  handle: string;
  fractalsHeld: number;
  joinedDate: string;
}

const collectors: Collector[] = [
  { id: '1', name: 'Anonymous Whale', handle: '0x7a3...f2d', fractalsHeld: 45, joinedDate: 'Oct 2023' },
  { id: '2', name: 'Digital Vault DAO', handle: '@digitalvault', fractalsHeld: 32, joinedDate: 'Nov 2023' },
  { id: '3', name: 'Art Collector Alpha', handle: '0x9c1...8e4', fractalsHeld: 28, joinedDate: 'Dec 2023' },
  { id: '4', name: 'Tokyo Art Fund', handle: '@tokyoartfund', fractalsHeld: 24, joinedDate: 'Jan 2024' },
  { id: '5', name: 'Nebula Holdings', handle: '0x2b8...a1c', fractalsHeld: 18, joinedDate: 'Feb 2024' },
  { id: '6', name: 'Renaissance DAO', handle: '@renaissancedao', fractalsHeld: 15, joinedDate: 'Mar 2024' },
];

const CollectorsTab: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {collectors.map((collector, index) => (
        <motion.div
          key={collector.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05, duration: 0.4 }}
          className="glass p-5 rounded-lg hover:border-primary/50 transition-colors duration-300"
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-mono text-sm text-foreground">{collector.name}</h3>
              <p className="font-mono text-xs text-muted-foreground">{collector.handle}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Fractals</span>
              <p className="font-mono text-lg text-accent font-medium">{collector.fractalsHeld}</p>
            </div>
            <div className="text-right">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Joined</span>
              <p className="font-mono text-xs text-muted-foreground">{collector.joinedDate}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default CollectorsTab;
