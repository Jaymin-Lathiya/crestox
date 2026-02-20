import React from 'react';
import { motion } from 'framer-motion';

interface ManifestoBlockProps {
  statement: string;
  className?: string;
}

const ManifestoBlock: React.FC<ManifestoBlockProps> = ({
  statement,
  className = "",
}) => {
  const firstLetter = statement.charAt(0);
  const restOfStatement = statement.slice(1);

  return (
    <motion.section 
      className={`max-w-[680px] mx-auto ${className}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
    >
      {/* Section Label */}
      <div className="flex items-center gap-4 mb-12">
        <span className="data-label">Artist Statement</span>
        <motion.div 
          className="h-px bg-border flex-1"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          style={{ transformOrigin: 'left' }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />
      </div>

      {/* Statement with Drop Cap */}
      <p className="font-serif text-xl leading-relaxed text-marble/90">
        <span className="float-left text-[80px] leading-[0.8] mr-4 mt-2 text-acid font-serif italic">
          {firstLetter}
        </span>
        {restOfStatement}
      </p>
    </motion.section>
  );
};

export default ManifestoBlock;
