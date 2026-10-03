import React from 'react';
import { motion } from 'framer-motion';
import { useCountUp } from '../../hooks/useCountUp';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  isCurrency?: boolean;
  currencySymbol?: string;
  decimals?: number;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 900,
  prefix = '',
  suffix = '',
  isCurrency = false,
  currencySymbol = 'Rs.',
  decimals = 0,
  className = ''
}) => {
  const animatedValue = useCountUp(value, duration);

  const formattedValue = isCurrency
    ? `${currencySymbol} ${animatedValue.toLocaleString()}`
    : decimals > 0
    ? animatedValue.toFixed(decimals)
    : animatedValue.toLocaleString();

  return (
    <motion.span
      key={value}
      initial={{ scale: 0.96, opacity: 0.9 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`inline-block font-bold tracking-tight ${className}`}
    >
      {prefix}{formattedValue}{suffix}
    </motion.span>
  );
};
