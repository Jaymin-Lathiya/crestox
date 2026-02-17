import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const features = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Compliance Shield',
    description: 'SEC-registered securities. Every transaction is fully compliant with federal regulations.',
    stat: '100%',
    statLabel: 'Compliant'
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    title: 'Transparent Ledger',
    description: 'Blockchain-verified ownership. Every fractal, every transfer, permanently recorded.',
    stat: '2.4M+',
    statLabel: 'Transactions'
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: 'Vault Security',
    description: 'Bank-grade encryption. Cold storage for digital assets. Insured custody.',
    stat: '$840M',
    statLabel: 'Assets Secured'
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Instant Settlement',
    description: 'T+0 settlement on all trades. No waiting periods. Immediate liquidity.',
    stat: '<1s',
    statLabel: 'Avg. Settlement'
  },
];

const BlockchainVisualization = () => {
  return (
    <div className="relative w-full h-64 overflow-hidden">
      {/* Animated blocks */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-16 h-16 border border-primary/30 rounded"
          style={{
            left: `${i * 20 + 10}%`,
            top: '50%',
          }}
          initial={{ y: '-50%', opacity: 0 }}
          animate={{
            y: '-50%',
            opacity: [0, 1, 1, 0],
            scale: [0.8, 1, 1, 0.8],
          }}
          transition={{
            duration: 4,
            delay: i * 0.5,
            repeat: Infinity,
            repeatDelay: 1,
          }}
        >
          <div className="absolute inset-0 bg-primary/5" />
          <motion.div
            className="absolute inset-0 flex items-center justify-center font-mono text-xs text-primary/50"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            #{String(i + 1).padStart(4, '0')}
          </motion.div>
        </motion.div>
      ))}

      {/* Connection lines */}
      <svg className="absolute inset-0 w-full h-full">
        <motion.line
          x1="10%"
          y1="50%"
          x2="90%"
          y2="50%"
          stroke="hsl(var(--primary) / 0.2)"
          strokeWidth="1"
          strokeDasharray="4 4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </svg>
    </div>
  );
};

const TrustMatrix = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative py-24 md:py-32 bg-background overflow-hidden"
    >
      {/* Glass overlay effect */}
      <motion.div
        className="absolute inset-0 glass-card opacity-30"
        style={{ opacity }}
      />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="terminal-text text-primary text-xs tracking-[0.4em] mb-4">TRUST INFRASTRUCTURE</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl italic text-foreground mb-6">
            Built for
            <span className="text-gradient-gold"> Security</span>
          </h2>
          <p className="font-sans text-sm text-muted-foreground max-w-xl mx-auto">
            Your investments protected by institutional-grade security,
            regulatory compliance, and transparent blockchain technology.
          </p>
        </motion.div>

        {/* Blockchain visualization */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <BlockchainVisualization />
        </motion.div>

        {/* Feature grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-muted rounded-lg p-6 border border-border group hover:border-primary/30 transition-all duration-500"
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-lg bg-secondary flex items-center justify-center text-primary mb-4 group-hover:bg-primary/10 transition-colors duration-300">
                {feature.icon}
              </div>

              {/* Content */}
              <h3 className="font-display text-lg italic text-foreground mb-2">{feature.title}</h3>
              <p className="font-sans text-xs text-muted-foreground leading-relaxed mb-4">
                {feature.description}
              </p>

              {/* Stat */}
              <div className="pt-4 border-t border-border">
                <p className="font-display text-2xl italic text-gradient-gold">{feature.stat}</p>
                <p className="terminal-text text-muted-foreground text-[10px]">{feature.statLabel}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 flex flex-wrap justify-center items-center gap-8 md:gap-12"
        >
          {['SEC Registered', 'FINRA Member', 'SOC 2 Type II', 'ISO 27001'].map((badge) => (
            <div key={badge} className="flex items-center gap-2 text-muted-foreground">
              <svg className="w-4 h-4 text-terminal" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="font-mono text-sm">{badge}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TrustMatrix;
