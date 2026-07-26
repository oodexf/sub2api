<template>
  <component
    :is="iconComponent"
    :class="sizeClass"
    :stroke-width="strokeWidth"
    aria-hidden="true"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  ArrowDown,
  ArrowLeft,
  ArrowLeftRight,
  ArrowRight,
  ArrowUp,
  ArrowUpDown,
  BadgeCheck,
  Ban,
  Bell,
  BookOpen,
  Box,
  Brain,
  Calculator,
  Calendar,
  ChartColumn,
  ChartNoAxesColumn,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  ChevronUp,
  CircleAlert,
  CircleCheck,
  CircleDollarSign,
  CircleHelp,
  CircleUserRound,
  CircleX,
  Clipboard,
  Clock,
  Cloud,
  Copy,
  Cpu,
  CreditCard,
  Database,
  Download,
  Ellipsis,
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  Flame,
  FlaskConical,
  Funnel,
  Gift,
  Globe,
  House,
  Inbox,
  Info,
  KeyRound,
  Languages,
  LayoutGrid,
  Lightbulb,
  Link,
  Lock,
  LogIn,
  Mail,
  Menu,
  MessageCircleMore,
  MessageSquareMore,
  Moon,
  Play,
  Plus,
  RefreshCcw,
  RefreshCw,
  Search,
  Server,
  Settings,
  ShieldCheck,
  Sparkles,
  SquarePen,
  SquareTerminal,
  Sun,
  Trash2,
  TrendingUp,
  TriangleAlert,
  Upload,
  User,
  UserPlus,
  Users,
  X,
  Zap
} from '@lucide/vue'

const props = withDefaults(defineProps<{
  name: keyof typeof icons
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  strokeWidth?: number
}>(), {
  size: 'md',
  strokeWidth: 1.75
})

// 统一图标注册表：全站通过 name 调用，底层渲染 Lucide 图标。
// 键名保持与旧版一致，调用方无需改动。
const icons = {
  // Actions
  play: Play,
  refresh: RefreshCw,
  edit: SquarePen,
  trash: Trash2,
  plus: Plus,
  search: Search,
  more: Ellipsis,

  // Status & Info
  chart: ChartColumn,
  clock: Clock,
  link: Link,
  sync: RefreshCcw,

  // Navigation
  chevronDown: ChevronDown,
  chevronRight: ChevronRight,
  chevronLeft: ChevronLeft,

  // UI Elements
  check: Check,
  x: X,
  eye: Eye,
  eyeOff: EyeOff,
  cog: Settings,
  grid: LayoutGrid,
  chat: MessageCircleMore,
  lightbulb: Lightbulb,

  // Navigation & Arrows
  arrowRight: ArrowRight,
  arrowLeft: ArrowLeft,
  arrowUp: ArrowUp,
  arrowDown: ArrowDown,
  arrowsUpDown: ArrowUpDown,
  chevronUp: ChevronUp,
  externalLink: ExternalLink,

  // Status & Indicators
  checkCircle: CircleCheck,
  xCircle: CircleX,
  exclamationCircle: CircleAlert,
  exclamationTriangle: TriangleAlert,
  infoCircle: Info,
  questionCircle: CircleHelp,

  // User & Account
  user: User,
  userCircle: CircleUserRound,
  userPlus: UserPlus,
  users: Users,

  // Files & Documents
  document: FileText,
  clipboard: Clipboard,
  copy: Copy,
  inbox: Inbox,

  // Actions
  download: Download,
  upload: Upload,
  filter: Funnel,
  globe: Globe,
  sort: ChevronsUpDown,

  // Security
  key: KeyRound,
  lock: Lock,
  shield: ShieldCheck,

  // UI Elements
  menu: Menu,
  calendar: Calendar,
  home: House,
  terminal: SquareTerminal,
  gift: Gift,
  creditCard: CreditCard,
  mail: Mail,

  // Data & Analytics
  chartBar: ChartNoAxesColumn,
  trendingUp: TrendingUp,
  database: Database,
  cube: Box,

  // Notification
  bell: Bell,

  // Misc
  bolt: Zap,
  sparkles: Sparkles,
  cloud: Cloud,
  server: Server,
  sun: Sun,
  moon: Moon,
  book: BookOpen,
  dollar: CircleDollarSign,
  ban: Ban,
  login: LogIn,
  swap: ArrowLeftRight,
  beaker: FlaskConical,
  cpu: Cpu,
  chatBubble: MessageSquareMore,
  calculator: Calculator,
  fire: Flame,
  badge: BadgeCheck,
  brain: Brain,
  languages: Languages
} as const

const iconComponent = computed(() => icons[props.name])

const sizeClass = computed(() => ({
  xs: 'h-3 w-3',
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
  xl: 'h-8 w-8'
}[props.size]))
</script>
