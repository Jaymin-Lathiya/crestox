import React from 'react';
import { motion } from 'framer-motion';

interface MetadataItem {
  label: string;
  value: string | null;
}

interface TechSpecsProps {
  metadata: MetadataItem[];
  className?: string;
}

const TechSpecs: React.FC<TechSpecsProps> = ({
  metadata,
  className = "",
}) => {
  const filteredMetadata = metadata.filter(item => item.value !== null);

  return (
    <motion.section 
      className={`max-w-[800px] mx-auto ${className}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
    >
      {/* Section Label */}
      <div className="flex items-center gap-4 mb-8">
        <span className="data-label">Technical Specifications</span>
        <motion.div 
          className="h-px bg-border flex-1"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          style={{ transformOrigin: 'left' }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />
      </div>

      {/* Spec Grid */}
      <div className="flex flex-col">
        {filteredMetadata.map((item, index) => (
          <motion.div 
            key={item.label}
            className="grid grid-cols-[30%_70%] gap-4 py-4 border-b border-secondary"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <span className="font-mono text-[11px] uppercase text-ghost tracking-wider">
              {item.label}
            </span>
            <span className="font-mono text-sm text-marble">
              {item.value}
            </span>
            
            {/* Animated underline */}
            <motion.div 
              className="col-span-2 h-px bg-acid/20 -mt-4"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              style={{ transformOrigin: 'left' }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
            />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default TechSpecs;
