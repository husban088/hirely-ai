import { Sparkles } from 'lucide-react';

export function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'text-lg', md: 'text-2xl', lg: 'text-4xl' };
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold-gradient shadow-gold">
        <Sparkles className="h-4 w-4 text-obsidian" />
      </div>
      <span className={`font-display font-bold tracking-tight ${sizes[size]}`}>
        Hirely <span className="gold-text">AI</span>
      </span>
    </div>
  );
}
