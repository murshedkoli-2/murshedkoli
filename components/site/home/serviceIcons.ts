import {
  Code2,
  Layout,
  Server,
  Smartphone,
  Database,
  PenTool,
  Globe,
  Zap,
  Cpu,
  Palette,
  ShoppingCart,
  LineChart,
  Rocket,
  Search,
  Cloud,
  Layers,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'

/** Maps a stored icon name (case-insensitive) to a lucide icon, with a sensible fallback. */
const ICON_MAP: Record<string, LucideIcon> = {
  code: Code2,
  frontend: Layout,
  layout: Layout,
  backend: Server,
  server: Server,
  api: Server,
  mobile: Smartphone,
  android: Smartphone,
  database: Database,
  design: PenTool,
  ux: PenTool,
  ui: Palette,
  web: Globe,
  website: Globe,
  performance: Zap,
  ai: Cpu,
  palette: Palette,
  ecommerce: ShoppingCart,
  analytics: LineChart,
  seo: Search,
  launch: Rocket,
  cloud: Cloud,
  devops: Cloud,
  fullstack: Layers,
}

export function resolveServiceIcon(name: string | null): LucideIcon {
  if (!name) return Sparkles
  return ICON_MAP[name.trim().toLowerCase()] ?? Sparkles
}
