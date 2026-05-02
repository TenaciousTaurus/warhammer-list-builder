/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['pwa-192.svg', 'pwa-512.svg'],
      manifest: {
        name: 'WarForge — Warhammer 40K Companion',
        short_name: 'WarForge',
        description: 'All-in-one Warhammer 40K companion: list builder, play mode, collection tracker, and more.',
        display: 'standalone',
        orientation: 'any',
        background_color: '#0a0a0f',
        theme_color: '#0a0a0f',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: '/pwa-192.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            src: '/pwa-512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        // Pre-cache all built assets
        globPatterns: ['**/*.{js,css,html,svg,woff2,ico}'],
        runtimeCaching: [
          // Google Fonts — cache first, long TTL
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\//,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
          // Game data (public read, rarely changes) — serve stale, revalidate in background
          {
            urlPattern:
              /\/rest\/v1\/(factions|detachments|units|unit_points_tiers|weapons|abilities|enhancements|wargear_options|wargear_sub_options|battle_sizes|unit_model_variants|unit_leader_targets)/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'game-data',
              expiration: { maxEntries: 500, maxAgeSeconds: 60 * 60 * 24 },
            },
          },
          // User data — network first, fall back to cache if offline
          {
            urlPattern:
              /\/rest\/v1\/(army_lists|army_list_units|army_list_enhancements|army_list_unit_wargear|army_list_unit_composition|army_list_leader_attachments|army_list_versions|game_sessions|game_session_events|casualty_logs|collection_entries|paint_recipes|paint_inventory|crusade_|tournament_|league_|organisation_|user_profiles|friendships|hobby_streaks)/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'user-data',
              networkTimeoutSeconds: 5,
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 },
            },
          },
          // Supabase RPC calls — network first
          {
            urlPattern: /\/rest\/v1\/rpc\//,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'rpc',
              networkTimeoutSeconds: 5,
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 },
            },
          },
        ],
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'supabase': ['@supabase/supabase-js'],
          'router': ['react-router-dom'],
          'sentry': ['@sentry/react'],
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/test/**', 'src/**/*.d.ts'],
    },
  },
})
