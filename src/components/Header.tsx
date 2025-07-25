import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

export default function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-4 left-4 z-40"
    >
      <div className="flex items-center gap-3 p-4 rounded-2xl bg-glass-bg backdrop-blur-glass border border-glass-border">
        <motion.div
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 8, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
          className="p-2 rounded-full bg-gradient-to-r from-electric-blue to-electric-magenta"
        >
          <Zap className="w-6 h-6 text-white" />
        </motion.div>
        
        <div>
          <motion.h1 
            className="text-xl font-bold bg-gradient-to-r from-electric-blue via-electric-magenta to-electric-purple bg-clip-text text-transparent animate-glow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Fractal Explorer
          </motion.h1>
          <motion.p 
            className="text-xs text-gray-400 font-medium tracking-wide uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            But Alive
          </motion.p>
        </div>
      </div>
    </motion.header>
  );
}
