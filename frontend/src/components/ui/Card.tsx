"use client";

import { motion } from "framer-motion";
import { HTMLAttributes, forwardRef } from "react";

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function Card({ className = "", children, ...props }, ref) {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        whileHover={{ y: -3 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`glass-panel rounded-2xl p-6 transition-all duration-300 ${className}`}
        {...(props as any)}
      >
        {children}
      </motion.div>
    );
  },
);
