import { Cpu, LayoutGrid, Sparkles, TrendingUp, Users } from 'lucide-react';
import type { CategoryItem } from '../../types/home';

export const categories: CategoryItem[] = [
  { label: 'Software Engineering', accent: 'from-primary-500 to-secondary-500', icon: LayoutGrid },
  { label: 'Product Design', accent: 'from-secondary-500 to-accent-500', icon: Sparkles },
  { label: 'Data Science', accent: 'from-primary-600 to-primary-400', icon: Cpu },
  { label: 'Growth Marketing', accent: 'from-accent-500 to-secondary-500', icon: TrendingUp },
  { label: 'People & Ops', accent: 'from-primary-500 to-secondary-500', icon: Users },
];

// Default fallback for empty/loading states
export const defaultCategories: CategoryItem[] = [];
