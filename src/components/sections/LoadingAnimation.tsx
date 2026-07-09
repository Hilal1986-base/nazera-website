'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export function LoadingAnimation({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<'lines' | 'fade'>('lines');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('fade'), 1800);
    const t2 = setTimeout(() => onComplete(), 2400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-white"
      animate={phase === 'fade' ? { opacity: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      {/* Blue sweeping line */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1200 800"
        fill="none"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="blueLine" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#1A3A6B" />
            <stop offset="100%" stopColor="#4AC6EB" />
          </linearGradient>
          <linearGradient id="silverLine" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#7A869A" />
            <stop offset="100%" stopColor="#E0E5EC" />
          </linearGradient>
        </defs>
        {/* Blue curve */}
        <motion.path
          d="M -100 900 Q 300 600, 600 400 T 1300 50"
          stroke="url(#blueLine)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        />
        {/* Silver curve */}
        <motion.path
          d="M -50 850 Q 350 580, 650 380 T 1350 30"
          stroke="url(#silverLine)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.7 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        />
      </svg>

      {/* Logo fade in */}
      <motion.div
        className="relative z-10 flex flex-col items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        <Image
          src="/logo.png"
          alt="NAZERA"
          width={200}
          height={55}
          className="h-14 w-auto object-contain"
        />
      </motion.div>
    </motion.div>
  );
}