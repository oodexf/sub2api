<template>
  <!-- Custom Home Content: Full Page Mode -->
  <div v-if="homeContent" class="min-h-screen">
    <!-- iframe mode -->
    <iframe
      v-if="isHomeContentUrl"
      :src="homeContent.trim()"
      class="h-screen w-full border-0"
      allowfullscreen
    ></iframe>
    <!-- HTML mode - SECURITY: homeContent is admin-only setting, XSS risk is acceptable -->
    <div v-else v-html="homeContent"></div>
  </div>

  <!-- Default Home Page: immersive ink canvas (forced dark art direction) -->
  <div v-else class="dark">
    <div ref="rootRef" class="home-root relative min-h-screen overflow-x-clip bg-[#070709] text-gray-100">
      <!-- Signal field canvas -->
      <canvas ref="fieldCanvas" class="pointer-events-none fixed inset-0 h-full w-full"></canvas>

      <!-- Filmic grain -->
      <div class="noise-overlay pointer-events-none fixed inset-0"></div>

      <!-- Ambient glow -->
      <div class="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          class="absolute -top-64 left-1/2 h-[36rem] w-[64rem] -translate-x-1/2 rounded-full bg-primary-600/15 blur-[140px]"
        ></div>
        <div
          class="absolute -bottom-72 -right-40 h-[30rem] w-[44rem] rounded-full bg-primary-800/20 blur-[140px]"
        ></div>
      </div>

      <!-- Scroll progress -->
      <div
        class="fixed left-0 top-0 z-50 h-0.5 bg-gradient-to-r from-primary-500 via-primary-400 to-signal-400 transition-[width] duration-150 ease-out"
        :style="{ width: `${scrollProgress * 100}%` }"
      ></div>

      <!-- Header -->
      <header
        class="fixed inset-x-0 top-0 z-40 transition-all duration-300"
        :class="scrolled ? 'border-b border-white/5 bg-[#070709]/80 backdrop-blur-xl' : 'bg-transparent'"
      >
        <nav class="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <router-link to="/" class="flex items-center gap-3">
            <div class="h-9 w-9 overflow-hidden rounded-xl ring-1 ring-white/10">
              <img :src="siteLogo || '/logo.svg'" alt="Logo" class="h-full w-full object-contain" />
            </div>
            <span class="font-display text-base font-semibold tracking-tight text-white">{{ siteName }}</span>
          </router-link>

          <div class="flex items-center gap-2">
            <a
              v-if="docUrl"
              :href="docUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-white sm:inline-flex"
            >
              <BookOpen class="h-4 w-4" />
              {{ t('home.docs') }}
            </a>
            <LocaleSwitcher />
            <router-link
              v-if="isAuthenticated"
              :to="dashboardPath"
              class="group ml-1 inline-flex items-center gap-2 rounded-full bg-white py-1.5 pl-1.5 pr-3.5 text-xs font-semibold text-gray-950 transition-transform duration-200 hover:scale-[1.03]"
            >
              <span
                class="flex h-6 w-6 items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white"
              >
                {{ userInitial }}
              </span>
              {{ t('home.dashboard') }}
              <ArrowUpRight class="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </router-link>
            <router-link
              v-else
              to="/login"
              class="ml-1 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-semibold text-gray-950 transition-transform duration-200 hover:scale-[1.03]"
            >
              {{ t('home.login') }}
              <ArrowUpRight class="h-3.5 w-3.5" />
            </router-link>
          </div>
        </nav>
      </header>

      <main class="relative z-10">
        <!-- ============ HERO ============ -->
        <section class="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 pb-24 pt-32">
          <div class="grid items-center gap-16 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <!-- Eyebrow -->
              <div class="hero-fade mb-8 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 backdrop-blur-sm" style="--d: 0.1s">
                <span class="relative flex h-2 w-2">
                  <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal-400 opacity-60"></span>
                  <span class="relative inline-flex h-2 w-2 rounded-full bg-signal-400"></span>
                </span>
                <span class="font-mono text-[11px] uppercase tracking-[0.25em] text-gray-400">{{ t('home.eyebrow') }}</span>
              </div>

              <!-- Display title: per-char reveal -->
              <h1 class="font-display text-[clamp(3.25rem,9vw,7.5rem)] font-bold leading-[0.95] tracking-tight text-white">
                <span class="block overflow-hidden pb-1">
                  <span
                    v-for="(ch, i) in siteNameChars"
                    :key="`c-${i}`"
                    class="char-rise inline-block"
                    :style="{ animationDelay: `${0.15 + i * 0.045}s` }"
                    >{{ ch === ' ' ? ' ' : ch }}</span
                  >
                </span>
              </h1>

              <!-- Outline experimental line -->
              <p
                class="hero-fade mt-2 font-display text-[clamp(1.6rem,4.2vw,3.4rem)] font-bold leading-tight tracking-tight text-outline"
                style="--d: 0.55s"
              >
                {{ t('home.heroSubtitle') }}
              </p>

              <p class="hero-fade mt-8 max-w-xl text-base leading-relaxed text-gray-400 md:text-lg" style="--d: 0.7s">
                {{ siteSubtitle || t('home.heroDescription') }}
              </p>

              <!-- CTA row -->
              <div class="hero-fade mt-10 flex flex-wrap items-center gap-4" style="--d: 0.85s">
                <div ref="magnetWrapRef" class="magnet-wrap">
                  <router-link
                    :to="isAuthenticated ? dashboardPath : '/login'"
                    class="magnet-btn group inline-flex items-center gap-2.5 rounded-full bg-white px-8 py-4 text-sm font-semibold text-gray-950 shadow-[0_0_40px_rgba(95,102,245,0.25)] transition-shadow duration-300 hover:shadow-[0_0_56px_rgba(95,102,245,0.45)]"
                  >
                    {{ isAuthenticated ? t('home.goToDashboard') : t('home.getStarted') }}
                    <ArrowRight class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </router-link>
                </div>
                <a
                  :href="githubUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-4 text-sm font-medium text-gray-300 transition-all duration-200 hover:border-white/40 hover:text-white"
                >
                  {{ t('home.viewOnGithub') }}
                  <ArrowUpRight class="h-4 w-4" />
                </a>
              </div>

              <!-- Feature tags -->
              <div class="hero-fade mt-12 flex flex-wrap gap-x-8 gap-y-3" style="--d: 1s">
                <div
                  v-for="tag in featureTags"
                  :key="tag.key"
                  class="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.15em] text-gray-500"
                >
                  <component :is="tag.icon" class="h-3.5 w-3.5 text-primary-400" />
                  {{ t(`home.tags.${tag.key}`) }}
                </div>
              </div>
            </div>

            <!-- Terminal -->
            <div class="hero-fade hidden justify-end lg:flex" style="--d: 0.5s">
              <div
                ref="tiltRef"
                class="terminal w-full max-w-md rounded-2xl border border-white/10 bg-[#0c0c10]/90 shadow-[0_40px_80px_-24px_rgba(0,0,0,0.8)] backdrop-blur-xl"
              >
                <div class="flex items-center gap-2 border-b border-white/5 px-5 py-3.5">
                  <span class="h-3 w-3 rounded-full bg-[#ff5f57]"></span>
                  <span class="h-3 w-3 rounded-full bg-[#febc2e]"></span>
                  <span class="h-3 w-3 rounded-full bg-[#28c840]"></span>
                  <span class="ml-3 flex items-center gap-1.5 font-mono text-[11px] text-gray-500">
                    <SquareTerminal class="h-3.5 w-3.5" />
                    gateway
                  </span>
                  <span class="ml-auto flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-signal-400">
                    <span class="h-1.5 w-1.5 animate-pulse rounded-full bg-signal-400"></span>
                    live
                  </span>
                </div>
                <div class="min-h-[220px] px-5 py-5 font-mono text-[13px] leading-7">
                  <div class="flex flex-wrap items-center gap-x-2">
                    <span class="font-bold text-signal-400">$</span>
                    <span class="text-gray-200">{{ typedCommand }}</span>
                    <span v-if="typing" class="terminal-cursor"></span>
                  </div>
                  <div v-if="phase >= 1" class="mt-1 flex items-center gap-2 text-gray-500">
                    <Waypoints class="h-3.5 w-3.5 text-primary-400" />
                    <span>routing</span>
                    <span class="text-gray-600">·</span>
                    <span class="text-primary-300">{{ currentReq.provider }}</span>
                    <span class="text-gray-600">·</span>
                    <span>pool-{{ currentReq.pool }}</span>
                  </div>
                  <div v-if="phase >= 2" class="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span class="inline-flex items-center gap-1.5 rounded bg-signal-400/15 px-2 py-0.5 font-semibold text-signal-400">
                      <span class="h-1.5 w-1.5 rounded-full bg-signal-400"></span>
                      200 OK
                    </span>
                    <span class="text-gray-500">{{ currentReq.latency }}ms</span>
                    <span class="text-amber-200/80">{ "content": "Hello!" }</span>
                  </div>
                  <div v-if="phase >= 2" class="mt-1 flex items-center gap-2">
                    <span class="font-bold text-signal-400">$</span>
                    <span class="terminal-cursor"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Scroll hint -->
          <div class="hero-fade absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex" style="--d: 1.3s">
            <span class="font-mono text-[10px] uppercase tracking-[0.3em] text-gray-600">{{ t('home.scrollHint') }}</span>
            <div class="scroll-line h-10 w-px bg-gradient-to-b from-gray-600 to-transparent"></div>
          </div>
        </section>

        <!-- ============ MARQUEE ============ -->
        <section class="relative border-y border-white/5 py-10">
          <div class="marquee-mask overflow-hidden">
            <div class="marquee flex w-max items-center gap-10 whitespace-nowrap">
              <template v-for="n in 2" :key="n">
                <template v-for="name in marqueeNames" :key="`${n}-${name}`">
                  <span
                    class="font-display text-5xl font-bold uppercase tracking-tight text-outline-faint md:text-7xl"
                    :aria-hidden="n === 2 ? 'true' : undefined"
                    >{{ name }}</span
                  >
                  <span class="h-2.5 w-2.5 rounded-full bg-signal-400/70" aria-hidden="true"></span>
                </template>
              </template>
            </div>
          </div>
        </section>

        <!-- ============ PAIN POINTS ============ -->
        <section class="mx-auto max-w-7xl px-6 py-28">
          <div class="reveal mb-16 max-w-2xl">
            <p class="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-primary-400">01 — {{ t('home.eyebrow') }}</p>
            <h2 class="font-display text-4xl font-bold tracking-tight text-white md:text-5xl">
              {{ t('home.painPoints.title') }}
            </h2>
          </div>
          <div class="grid gap-5 sm:grid-cols-2">
            <div
              v-for="(item, idx) in painPoints"
              :key="item.key"
              class="reveal group relative overflow-hidden rounded-2xl border border-white/8 bg-white/[0.02] p-8 transition-colors duration-300 hover:border-primary-500/30 hover:bg-white/[0.04]"
              :style="{ '--d': `${idx * 0.08}s` }"
            >
              <span
                class="pointer-events-none absolute -right-3 -top-8 font-display text-[7rem] font-bold leading-none text-white/[0.04] transition-colors duration-300 group-hover:text-primary-500/10"
                >0{{ idx + 1 }}</span
              >
              <div class="relative">
                <div class="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-primary-300">
                  <component :is="item.icon" class="h-5 w-5" />
                </div>
                <h3 class="mb-2 font-display text-lg font-semibold text-white">
                  {{ t(`home.painPoints.items.${item.key}.title`) }}
                </h3>
                <p class="text-sm leading-relaxed text-gray-400">
                  {{ t(`home.painPoints.items.${item.key}.desc`) }}
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- ============ FEATURES ============ -->
        <section class="mx-auto max-w-7xl px-6 py-28">
          <div class="reveal mb-16 flex max-w-3xl flex-col gap-3">
            <p class="font-mono text-xs uppercase tracking-[0.3em] text-primary-400">02 — {{ t('home.solutions.title') }}</p>
            <h2 class="font-display text-4xl font-bold tracking-tight text-white md:text-5xl">
              {{ t('home.solutions.subtitle') }}
            </h2>
          </div>
          <div class="grid gap-5 md:grid-cols-3">
            <div
              v-for="(feat, idx) in features"
              :key="feat.key"
              class="reveal feature-card group relative overflow-hidden rounded-2xl border border-white/8 bg-gradient-to-b from-white/[0.04] to-transparent p-8"
              :style="{ '--d': `${idx * 0.1}s` }"
            >
              <div class="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-400/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
              <p class="mb-8 font-mono text-xs text-gray-600">0{{ idx + 1 }}</p>
              <div class="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-600/15 text-primary-300 ring-1 ring-primary-500/20 transition-transform duration-300 group-hover:scale-110">
                <component :is="feat.icon" class="h-6 w-6" />
              </div>
              <h3 class="mb-3 font-display text-xl font-semibold text-white">
                {{ t(`home.features.${feat.key}`) }}
              </h3>
              <p class="text-sm leading-relaxed text-gray-400">
                {{ t(`home.features.${feat.key}Desc`) }}
              </p>
            </div>
          </div>
        </section>

        <!-- ============ COMPARISON ============ -->
        <section class="mx-auto max-w-6xl px-6 py-28">
          <div class="reveal mb-16 max-w-2xl">
            <p class="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-primary-400">03 — {{ t('home.comparison.headers.us') }}</p>
            <h2 class="font-display text-4xl font-bold tracking-tight text-white md:text-5xl">
              {{ t('home.comparison.title') }}
            </h2>
          </div>
          <div class="reveal overflow-x-auto rounded-2xl border border-white/8 bg-white/[0.02]">
            <table class="w-full min-w-[640px] text-sm">
              <thead>
                <tr class="border-b border-white/8">
                  <th class="px-6 py-4 text-left font-mono text-xs uppercase tracking-[0.2em] text-gray-500">
                    {{ t('home.comparison.headers.feature') }}
                  </th>
                  <th class="px-6 py-4 text-left font-mono text-xs uppercase tracking-[0.2em] text-gray-500">
                    {{ t('home.comparison.headers.official') }}
                  </th>
                  <th class="bg-primary-600/10 px-6 py-4 text-left font-mono text-xs uppercase tracking-[0.2em] text-primary-300">
                    {{ siteName }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="row in comparisonRows"
                  :key="row"
                  class="border-b border-white/5 last:border-b-0"
                >
                  <td class="px-6 py-4 font-medium text-gray-200">
                    {{ t(`home.comparison.items.${row}.feature`) }}
                  </td>
                  <td class="px-6 py-4 text-gray-500">
                    <div class="flex items-start gap-2.5">
                      <X class="mt-0.5 h-4 w-4 shrink-0 text-gray-600" />
                      {{ t(`home.comparison.items.${row}.official`) }}
                    </div>
                  </td>
                  <td class="bg-primary-600/10 px-6 py-4 text-gray-200">
                    <div class="flex items-start gap-2.5">
                      <Check class="mt-0.5 h-4 w-4 shrink-0 text-signal-400" />
                      {{ t(`home.comparison.items.${row}.us`) }}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- ============ PROVIDERS ============ -->
        <section class="mx-auto max-w-7xl px-6 py-28">
          <div class="reveal mb-14 text-center">
            <p class="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-primary-400">04 — {{ t('home.providers.description') }}</p>
            <h2 class="font-display text-4xl font-bold tracking-tight text-white md:text-5xl">
              {{ t('home.providers.title') }}
            </h2>
          </div>
          <div class="reveal flex flex-wrap items-center justify-center gap-4">
            <div
              v-for="p in providers"
              :key="p.key"
              class="group flex items-center gap-3 rounded-full border px-6 py-3.5 transition-all duration-300"
              :class="
                p.soon
                  ? 'border-white/5 bg-white/[0.01] opacity-50'
                  : 'border-white/10 bg-white/[0.03] hover:border-primary-500/40 hover:bg-primary-600/10'
              "
            >
              <span
                class="h-2 w-2 rounded-full"
                :class="p.soon ? 'bg-gray-600' : 'bg-signal-400'"
              ></span>
              <span class="font-display text-sm font-semibold text-white">{{ t(`home.providers.${p.key}`) }}</span>
              <span class="font-mono text-[10px] uppercase tracking-[0.2em]" :class="p.soon ? 'text-gray-600' : 'text-primary-300'">
                {{ p.soon ? t('home.providers.soon') : t('home.providers.supported') }}
              </span>
            </div>
          </div>
        </section>

        <!-- ============ CTA ============ -->
        <section class="relative mx-auto max-w-5xl px-6 py-36 text-center">
          <div class="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div class="h-72 w-[42rem] rounded-full bg-primary-600/15 blur-[120px]"></div>
          </div>
          <div class="reveal relative">
            <h2 class="font-display text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-tight tracking-tight text-white">
              {{ t('home.cta.title') }}
            </h2>
            <p class="mx-auto mt-6 max-w-xl text-base text-gray-400 md:text-lg">
              {{ t('home.cta.description') }}
            </p>
            <div class="mt-10 flex justify-center">
              <div ref="ctaMagnetWrapRef" class="magnet-wrap">
                <router-link
                  :to="isAuthenticated ? dashboardPath : '/register'"
                  class="magnet-btn group inline-flex items-center gap-2.5 rounded-full bg-white px-10 py-5 text-base font-semibold text-gray-950 shadow-[0_0_48px_rgba(95,102,245,0.3)] transition-shadow duration-300 hover:shadow-[0_0_72px_rgba(95,102,245,0.5)]"
                >
                  {{ isAuthenticated ? t('home.goToDashboard') : t('home.cta.button') }}
                  <ArrowRight class="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </router-link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <!-- Footer -->
      <footer class="relative z-10 border-t border-white/5 px-6 py-10">
        <div class="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <p class="text-sm text-gray-500">
            &copy; {{ currentYear }} {{ siteName }}. {{ t('home.footer.allRightsReserved') }}
          </p>
          <div class="flex items-center gap-6">
            <a
              v-if="docUrl"
              :href="docUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="text-sm text-gray-500 transition-colors hover:text-white"
            >
              {{ t('home.docs') }}
            </a>
            <a
              :href="githubUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="text-sm text-gray-500 transition-colors hover:text-white"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  ArrowLeftRight,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Boxes,
  ChartColumn,
  Check,
  Gauge,
  KeyRound,
  Network,
  ShieldCheck,
  SquareTerminal,
  Wallet,
  Waypoints,
  X,
  ZapOff
} from '@lucide/vue'
import { useAuthStore, useAppStore } from '@/stores'
import LocaleSwitcher from '@/components/common/LocaleSwitcher.vue'
import { sanitizeUrl } from '@/utils/url'

const { t } = useI18n()

const authStore = useAuthStore()
const appStore = useAppStore()

// Site settings - directly from appStore (already initialized from injected config)
const siteName = computed(() => appStore.cachedPublicSettings?.site_name || appStore.siteName || 'Sub2API')
const siteLogo = computed(() => sanitizeUrl(appStore.cachedPublicSettings?.site_logo || appStore.siteLogo || '', { allowRelative: true, allowDataUrl: true }))
const siteSubtitle = computed(() => appStore.cachedPublicSettings?.site_subtitle || '')
const docUrl = computed(() => sanitizeUrl(appStore.cachedPublicSettings?.doc_url || appStore.docUrl || ''))
const homeContent = computed(() => appStore.cachedPublicSettings?.home_content || '')

// Check if homeContent is a URL (for iframe display)
const isHomeContentUrl = computed(() => {
  const content = homeContent.value.trim()
  return content.startsWith('http://') || content.startsWith('https://')
})

const githubUrl = 'https://github.com/Wei-Shaw/sub2api'

// Auth state
const isAuthenticated = computed(() => authStore.isAuthenticated)
const isAdmin = computed(() => authStore.isAdmin)
const dashboardPath = computed(() => (isAdmin.value ? '/admin/dashboard' : '/dashboard'))
const userInitial = computed(() => {
  const user = authStore.user
  if (!user || !user.email) return ''
  return user.email.charAt(0).toUpperCase()
})

const currentYear = computed(() => new Date().getFullYear())

// Display title split for the per-character reveal
const siteNameChars = computed(() => Array.from(siteName.value))

// Content maps
const featureTags = [
  { key: 'subscriptionToApi', icon: ArrowLeftRight },
  { key: 'stickySession', icon: ShieldCheck },
  { key: 'realtimeBilling', icon: ChartColumn }
] as const

const painPoints = [
  { key: 'expensive', icon: Wallet },
  { key: 'complex', icon: Boxes },
  { key: 'unstable', icon: ZapOff },
  { key: 'noControl', icon: Gauge }
] as const

const features = [
  { key: 'unifiedGateway', icon: KeyRound },
  { key: 'multiAccount', icon: Network },
  { key: 'balanceQuota', icon: ChartColumn }
] as const

const comparisonRows = ['pricing', 'models', 'management', 'stability', 'control'] as const

const providers = [
  { key: 'claude', soon: false },
  { key: 'gpt', soon: false },
  { key: 'gemini', soon: false },
  { key: 'antigravity', soon: false },
  { key: 'more', soon: true }
] as const

const marqueeNames = ['Claude', 'GPT', 'Gemini', 'Antigravity']

// ---------- Motion preferences ----------
const reducedMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// ---------- Scroll state ----------
const rootRef = ref<HTMLElement | null>(null)
const scrollProgress = ref(0)
const scrolled = ref(false)
let scrollRaf = 0

function onScroll() {
  if (scrollRaf) return
  scrollRaf = requestAnimationFrame(() => {
    scrollRaf = 0
    const doc = document.documentElement
    const max = doc.scrollHeight - doc.clientHeight
    scrollProgress.value = max > 0 ? Math.min(1, doc.scrollTop / max) : 0
    scrolled.value = doc.scrollTop > 24
  })
}

// ---------- Reveal on scroll ----------
let revealObserver: IntersectionObserver | null = null

function setupReveals() {
  const els = rootRef.value?.querySelectorAll('.reveal')
  if (!els || els.length === 0) return
  if (reducedMotion || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-visible'))
    return
  }
  revealObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          revealObserver?.unobserve(entry.target)
        }
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
  )
  els.forEach((el) => revealObserver?.observe(el))
}

// ---------- Signal field canvas ----------
const fieldCanvas = ref<HTMLCanvasElement | null>(null)
let fieldRaf = 0
let fieldCleanup: (() => void) | null = null

interface FieldNode {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  signal: boolean
}

function setupField() {
  const canvas = fieldCanvas.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  let width = 0
  let height = 0
  let nodes: FieldNode[] = []
  const pointer = { x: -9999, y: -9999 }
  const LINK_DIST = 140

  function resize() {
    if (!canvas || !ctx) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    width = window.innerWidth
    height = window.innerHeight
    canvas.width = Math.floor(width * dpr)
    canvas.height = Math.floor(height * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    const target = Math.min(90, Math.floor((width * height) / 22000))
    nodes = Array.from({ length: target }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: 1 + Math.random() * 1.4,
      signal: Math.random() < 0.12
    }))
  }

  function draw() {
    if (!ctx) return
    ctx.clearRect(0, 0, width, height)

    for (const n of nodes) {
      n.x += n.vx
      n.y += n.vy

      // Gentle pointer repulsion
      const dx = n.x - pointer.x
      const dy = n.y - pointer.y
      const d2 = dx * dx + dy * dy
      if (d2 < 160 * 160 && d2 > 0.01) {
        const d = Math.sqrt(d2)
        const f = ((160 - d) / 160) * 0.06
        n.x += (dx / d) * f * 8
        n.y += (dy / d) * f * 8
      }

      if (n.x < -20) n.x = width + 20
      if (n.x > width + 20) n.x = -20
      if (n.y < -20) n.y = height + 20
      if (n.y > height + 20) n.y = -20
    }

    // Links
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i]
        const b = nodes[j]
        const dx = a.x - b.x
        const dy = a.y - b.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < LINK_DIST) {
          const alpha = (1 - dist / LINK_DIST) * 0.12
          ctx.strokeStyle = `rgba(131, 145, 251, ${alpha})`
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.stroke()
        }
      }
    }

    // Nodes
    for (const n of nodes) {
      ctx.fillStyle = n.signal ? 'rgba(163, 230, 53, 0.55)' : 'rgba(131, 145, 251, 0.45)'
      ctx.beginPath()
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  function loop() {
    draw()
    fieldRaf = requestAnimationFrame(loop)
  }

  function onPointerMove(e: PointerEvent) {
    pointer.x = e.clientX
    pointer.y = e.clientY
  }
  function onPointerLeave() {
    pointer.x = -9999
    pointer.y = -9999
  }
  function onVisibility() {
    if (document.hidden) {
      cancelAnimationFrame(fieldRaf)
      fieldRaf = 0
    } else if (!fieldRaf && !reducedMotion) {
      loop()
    }
  }

  resize()
  window.addEventListener('resize', resize)

  if (reducedMotion) {
    draw()
  } else {
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerleave', onPointerLeave)
    document.addEventListener('visibilitychange', onVisibility)
    loop()
  }

  fieldCleanup = () => {
    cancelAnimationFrame(fieldRaf)
    window.removeEventListener('resize', resize)
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerleave', onPointerLeave)
    document.removeEventListener('visibilitychange', onVisibility)
  }
}

// ---------- Terminal typing loop ----------
interface TerminalRequest {
  provider: string
  pool: number
  latency: number
}

const terminalRequests: TerminalRequest[] = [
  { provider: 'anthropic', pool: 3, latency: 412 },
  { provider: 'openai', pool: 1, latency: 388 },
  { provider: 'gemini', pool: 2, latency: 451 }
]

const COMMAND = 'curl -X POST /v1/messages'
const typedCommand = ref('')
const typing = ref(true)
const phase = ref(0)
const reqIndex = ref(0)
const currentReq = computed(() => terminalRequests[reqIndex.value])
let terminalTimers: number[] = []

function terminalDelay(fn: () => void, ms: number) {
  terminalTimers.push(window.setTimeout(fn, ms))
}

function runTerminalCycle() {
  typedCommand.value = ''
  typing.value = true
  phase.value = 0

  if (reducedMotion) {
    typedCommand.value = COMMAND
    typing.value = false
    phase.value = 2
    return
  }

  let i = 0
  const typeChar = () => {
    if (i <= COMMAND.length) {
      typedCommand.value = COMMAND.slice(0, i)
      i++
      terminalDelay(typeChar, 22 + Math.random() * 26)
    } else {
      typing.value = false
      terminalDelay(() => {
        phase.value = 1
        terminalDelay(() => {
          phase.value = 2
          terminalDelay(() => {
            reqIndex.value = (reqIndex.value + 1) % terminalRequests.length
            runTerminalCycle()
          }, 3200)
        }, 650)
      }, 350)
    }
  }
  typeChar()
}

// ---------- Magnetic buttons ----------
const magnetWrapRef = ref<HTMLElement | null>(null)
const ctaMagnetWrapRef = ref<HTMLElement | null>(null)
let magnetCleanups: (() => void)[] = []

function setupMagnet(wrap: HTMLElement | null) {
  const el = wrap?.querySelector<HTMLElement>('.magnet-btn')
  if (!wrap || !el || reducedMotion) return
  let raf = 0
  let targetX = 0
  let targetY = 0
  let curX = 0
  let curY = 0

  const tick = () => {
    curX += (targetX - curX) * 0.18
    curY += (targetY - curY) * 0.18
    el.style.transform = `translate(${curX.toFixed(2)}px, ${curY.toFixed(2)}px)`
    if (Math.abs(targetX - curX) > 0.1 || Math.abs(targetY - curY) > 0.1 || targetX !== 0 || targetY !== 0) {
      raf = requestAnimationFrame(tick)
    } else {
      el.style.transform = ''
      raf = 0
    }
  }

  const onMove = (e: PointerEvent) => {
    const rect = wrap.getBoundingClientRect()
    targetX = (e.clientX - rect.left - rect.width / 2) * 0.3
    targetY = (e.clientY - rect.top - rect.height / 2) * 0.3
    if (!raf) raf = requestAnimationFrame(tick)
  }
  const onLeave = () => {
    targetX = 0
    targetY = 0
    if (!raf) raf = requestAnimationFrame(tick)
  }

  wrap.addEventListener('pointermove', onMove)
  wrap.addEventListener('pointerleave', onLeave)
  magnetCleanups.push(() => {
    cancelAnimationFrame(raf)
    wrap.removeEventListener('pointermove', onMove)
    wrap.removeEventListener('pointerleave', onLeave)
  })
}

// ---------- Terminal tilt ----------
const tiltRef = ref<HTMLElement | null>(null)
let tiltCleanup: (() => void) | null = null

function setupTilt() {
  const el = tiltRef.value
  if (!el || reducedMotion) return
  let raf = 0
  let tx = 0
  let ty = 0
  let cx = 0
  let cy = 0

  const tick = () => {
    cx += (tx - cx) * 0.12
    cy += (ty - cy) * 0.12
    el.style.transform = `perspective(900px) rotateX(${cy.toFixed(2)}deg) rotateY(${cx.toFixed(2)}deg)`
    if (Math.abs(tx - cx) > 0.05 || Math.abs(ty - cy) > 0.05) {
      raf = requestAnimationFrame(tick)
    } else {
      raf = 0
    }
  }

  const onMove = (e: PointerEvent) => {
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    tx = px * 8
    ty = -py * 8
    if (!raf) raf = requestAnimationFrame(tick)
  }
  const onLeave = () => {
    tx = 0
    ty = 0
    if (!raf) raf = requestAnimationFrame(tick)
  }

  el.addEventListener('pointermove', onMove)
  el.addEventListener('pointerleave', onLeave)
  tiltCleanup = () => {
    cancelAnimationFrame(raf)
    el.removeEventListener('pointermove', onMove)
    el.removeEventListener('pointerleave', onLeave)
  }
}

onMounted(() => {
  // Check auth state
  authStore.checkAuth()

  // Ensure public settings are loaded (will use cache if already loaded from injected config)
  if (!appStore.publicSettingsLoaded) {
    appStore.fetchPublicSettings()
  }

  if (homeContent.value) return

  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
  setupReveals()
  setupField()
  runTerminalCycle()
  setupMagnet(magnetWrapRef.value)
  setupMagnet(ctaMagnetWrapRef.value)
  setupTilt()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  cancelAnimationFrame(scrollRaf)
  revealObserver?.disconnect()
  fieldCleanup?.()
  terminalTimers.forEach((id) => clearTimeout(id))
  terminalTimers = []
  magnetCleanups.forEach((fn) => fn())
  magnetCleanups = []
  tiltCleanup?.()
})
</script>

<style scoped>
/* Filmic grain via inline SVG turbulence */
.noise-overlay {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  opacity: 0.04;
  mix-blend-mode: overlay;
}

/* Outline typography */
.text-outline {
  color: transparent;
  -webkit-text-stroke: 1.5px rgba(255, 255, 255, 0.45);
}

.text-outline-faint {
  color: transparent;
  -webkit-text-stroke: 1px rgba(255, 255, 255, 0.14);
  transition: -webkit-text-stroke-color 0.4s ease;
}

.marquee-mask:hover .text-outline-faint {
  -webkit-text-stroke-color: rgba(255, 255, 255, 0.3);
}

/* Per-character hero title reveal */
.char-rise {
  opacity: 0;
  transform: translateY(105%) rotate(3deg);
  animation: char-rise 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

@keyframes char-rise {
  to {
    opacity: 1;
    transform: translateY(0) rotate(0deg);
  }
}

/* Staggered hero fade-ins */
.hero-fade {
  opacity: 0;
  transform: translateY(20px);
  animation: hero-fade 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  animation-delay: var(--d, 0s);
}

@keyframes hero-fade {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Scroll-triggered reveals */
.reveal {
  opacity: 0;
  transform: translateY(28px);
  filter: blur(6px);
  transition:
    opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.9s cubic-bezier(0.22, 1, 0.36, 1),
    filter 0.9s cubic-bezier(0.22, 1, 0.36, 1);
  transition-delay: var(--d, 0s);
}

.reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
  filter: blur(0);
}

/* Marquee */
.marquee {
  animation: marquee 36s linear infinite;
}

.marquee-mask:hover .marquee {
  animation-play-state: paused;
}

.marquee-mask {
  -webkit-mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
  mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
}

/* Terminal */
.terminal {
  transform-style: preserve-3d;
  will-change: transform;
}

.terminal-cursor {
  display: inline-block;
  width: 8px;
  height: 16px;
  vertical-align: middle;
  background: #a3e635;
  animation: cursor-blink 1s step-end infinite;
}

@keyframes cursor-blink {
  0%,
  50% {
    opacity: 1;
  }
  51%,
  100% {
    opacity: 0;
  }
}

/* Scroll hint line */
.scroll-line {
  animation: scroll-line 2s ease-in-out infinite;
  transform-origin: top;
}

@keyframes scroll-line {
  0% {
    transform: scaleY(0);
  }
  50% {
    transform: scaleY(1);
  }
  100% {
    transform: scaleY(0);
    transform-origin: bottom;
  }
}

/* Magnetic buttons */
.magnet-wrap {
  display: inline-block;
  padding: 6px;
  margin: -6px;
}

.magnet-btn {
  will-change: transform;
}

/* Feature card sheen */
.feature-card {
  transition:
    border-color 0.3s ease,
    transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

.feature-card:hover {
  border-color: rgba(95, 102, 245, 0.35);
  transform: translateY(-4px);
}

/* Reduced motion: settle everything instantly */
@media (prefers-reduced-motion: reduce) {
  .char-rise,
  .hero-fade {
    animation-duration: 1ms;
    animation-delay: 0ms;
  }

  .reveal {
    transition-duration: 1ms;
    transition-delay: 0ms;
  }

  .marquee {
    animation: none;
  }

  .scroll-line {
    animation: none;
  }

  .terminal-cursor {
    animation: none;
  }
}
</style>
