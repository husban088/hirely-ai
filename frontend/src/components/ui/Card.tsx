"use client";

import { motion } from "framer-motion";
import { HTMLAttributes } from "react";

export function Card({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <motion.div
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
}
