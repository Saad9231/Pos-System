import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export type CardVariant = 'dashboard' | 'product' | 'sales' | 'finance' | 'customer' | 'default';

interface InteractiveGlassCardProps {
  children: React.ReactNode;
  id?: string;
  variant?: CardVariant;
  glowColor?: string; // e.g. 'emerald', 'cyan', 'indigo', 'amber', 'rose', 'purple'
  onClick?: () => void;
  className?: string;
  enableTilt?: boolean;
  enableSpotlight?: boolean;
}

export const InteractiveGlassCard: React.FC<InteractiveGlassCardProps> = ({
  children,
  id,
  variant = 'dashboard',
  glowColor = 'cyan',
  onClick,
  className = '',
  enableTilt = true,
  enableSpotlight = true,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse position inside card for spotlight and 3D tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for tilt
  const rotateXSpring = useSpring(useTransform(mouseY, [-0.5, 0.5], [7, -7]), { stiffness: 300, damping: 25 });
  const rotateYSpring = useSpring(useTransform(mouseX, [-0.5, 0.5], [-7, 7]), { stiffness: 300, damping: 25 });

  // Mouse spotlight coordinates (in percent)
  const [spotlightPos, setSpotlightPos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Normalized mouse pos between -0.5 and 0.5
    const normalizedX = x / width - 0.5;
    const normalizedY = y / height - 0.5;

    mouseX.set(normalizedX);
    mouseY.set(normalizedY);

    if (enableSpotlight) {
      setSpotlightPos({
        x: Math.round((x / width) * 100),
        y: Math.round((y / height) * 100),
      });
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  // Color mappings for glow and borders
  const glowStyles: Record<string, { border: string; glow: string; text: string }> = {
    cyan: {
      border: 'hover:border-cyan-500/40 dark:hover:border-cyan-400/50',
      glow: 'rgba(6, 182, 212, 0.15)',
      text: 'text-cyan-500 dark:text-cyan-400',
    },
    emerald: {
      border: 'hover:border-emerald-500/40 dark:hover:border-emerald-400/50',
      glow: 'rgba(16, 185, 129, 0.15)',
      text: 'text-emerald-500 dark:text-emerald-400',
    },
    indigo: {
      border: 'hover:border-indigo-500/40 dark:hover:border-indigo-400/50',
      glow: 'rgba(99, 102, 241, 0.15)',
      text: 'text-indigo-500 dark:text-indigo-400',
    },
    amber: {
      border: 'hover:border-amber-500/40 dark:hover:border-amber-400/50',
      glow: 'rgba(245, 158, 11, 0.15)',
      text: 'text-amber-500 dark:text-amber-400',
    },
    rose: {
      border: 'hover:border-rose-500/40 dark:hover:border-rose-400/50',
      glow: 'rgba(244, 63, 94, 0.15)',
      text: 'text-rose-500 dark:text-rose-400',
    },
    purple: {
      border: 'hover:border-purple-500/40 dark:hover:border-purple-400/50',
      glow: 'rgba(168, 85, 247, 0.15)',
      text: 'text-purple-500 dark:text-purple-400',
    },
    blue: {
      border: 'hover:border-blue-500/40 dark:hover:border-blue-400/50',
      glow: 'rgba(59, 130, 246, 0.15)',
      text: 'text-blue-500 dark:text-blue-400',
    },
  };

  const selectedGlow = glowStyles[glowColor] || glowStyles.cyan;

  // Variant-specific styling adjustments
  const variantClasses: Record<CardVariant, string> = {
    dashboard:
      'bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-cyan-500/5 dark:hover:shadow-cyan-500/10',
    product:
      'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1',
    sales:
      'bg-gradient-to-br from-white to-slate-50/80 dark:from-slate-900 dark:to-slate-900/90 border border-slate-200/90 dark:border-slate-800/90 shadow-sm active:scale-[0.98]',
    finance:
      'bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/80 shadow-sm hover:shadow-lg',
    customer:
      'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-indigo-400/40',
    default:
      'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md',
  };

  return (
    <motion.div
      id={id}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        perspective: 1000,
        rotateX: enableTilt ? rotateXSpring : 0,
        rotateY: enableTilt ? rotateYSpring : 0,
        transformStyle: 'preserve-3d',
      }}
      whileHover={{ scale: variant === 'sales' ? 1 : 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`relative overflow-hidden rounded-2xl transition-colors duration-300 ${
        onClick ? 'cursor-pointer select-none' : ''
      } ${selectedGlow.border} ${variantClasses[variant]} ${className}`}
    >
      {/* Dynamic Cursor Spotlight Effect */}
      {enableSpotlight && isHovered && (
        <div
          className="pointer-events-none absolute -inset-px opacity-100 transition-opacity duration-300 z-10 rounded-2xl"
          style={{
            background: `radial-gradient(400px circle at ${spotlightPos.x}% ${spotlightPos.y}%, ${selectedGlow.glow}, transparent 70%)`,
          }}
        />
      )}

      {/* Glass Light Flare Line */}
      <div className="pointer-events-none absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Card Content Container */}
      <div className="relative z-20 h-full">{children}</div>
    </motion.div>
  );
};
