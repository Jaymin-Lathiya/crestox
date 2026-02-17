import { motion } from "framer-motion";

export const AuroraBackground = () => {
  return (
    <div className="aurora-bg">
      {/* Primary Aurora Blob - Deep Violet */}
      <motion.div
        className="aurora-blob w-[600px] h-[600px] bg-violet-900/30 rounded-full"
        style={{ top: "10%", left: "60%" }}
        animate={{
          x: [0, 50, -30, 0],
          y: [0, -40, 30, 0],
          rotate: [0, 10, -10, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Secondary Aurora Blob - Zinc Teal */}
      <motion.div
        className="aurora-blob w-[500px] h-[500px] bg-emerald-900/20 rounded-full"
        style={{ top: "50%", left: "10%" }}
        animate={{
          x: [0, -40, 60, 0],
          y: [0, 50, -40, 0],
          rotate: [0, -15, 15, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
      
      {/* Tertiary Aurora Blob - Ochre Hint */}
      <motion.div
        className="aurora-blob w-[400px] h-[400px] bg-amber-900/10 rounded-full"
        style={{ bottom: "10%", right: "20%" }}
        animate={{
          x: [0, 30, -50, 0],
          y: [0, -30, 40, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5,
        }}
      />
    </div>
  );
};
