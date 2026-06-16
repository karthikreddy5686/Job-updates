'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
  id?: string;
}

export function Card({ children, className = '', hover = true, delay = 0, id }: CardProps) {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      viewport={{ once: true }}
      whileHover={hover ? { y: -4, shadow: '0 20px 40px rgba(0,0,0,0.1)' } : {}}
      className={`card ${hover ? 'card-hover' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
}
