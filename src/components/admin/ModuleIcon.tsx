import React from 'react';
import {
  Activity,
  BarChart3,
  BookMarked,
  BookOpen,
  Bot,
  Briefcase,
  CalendarClock,
  Compass,
  FolderKanban,
  GraduationCap,
  Layers,
  LayoutDashboard,
  Lightbulb,
  MessageSquareHeart,
  Newspaper,
  Send,
  Settings,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Target,
  Users,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  LayoutDashboard,
  CalendarClock,
  Briefcase,
  Activity,
  Compass,
  Send,
  Lightbulb,
  Layers,
  BookOpen,
  Newspaper,
  Target,
  Users,
  ShieldCheck,
  Share2,
  MessageSquareHeart,
  BookMarked,
  Sparkles,
  GraduationCap,
  FolderKanban,
  ShoppingBag,
  BarChart3,
  Bot,
  Settings,
};

interface ModuleIconProps {
  iconName: string;
  size?: number;
  className?: string;
}

export const ModuleIcon: React.FC<ModuleIconProps> = ({
  iconName,
  size = 18,
  className = '',
}) => {
  const Icon = ICON_MAP[iconName] ?? LayoutDashboard;
  return <Icon size={size} className={className} aria-hidden="true" />;
};
