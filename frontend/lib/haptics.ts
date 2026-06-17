"use client";

/**
 * Lightweight haptic feedback helper.
 *
 * On devices/browsers that support the Vibration API (most Android
 * browsers, some PWA contexts) this triggers a real tactile pulse.
 * Everywhere else it's a no-op — the visual "press" micro-interactions
 * on buttons and cards (scale + shadow change) carry the tactile feel
 * instead, so the UI never depends on vibration actually firing.
 */
type HapticIntensity = "tap" | "select" | "success" | "warning";

const PATTERNS: Record<HapticIntensity, number | number[]> = {
  tap: 8,
  select: 12,
  success: [10, 40, 14],
  warning: [16, 30, 16, 30, 16],
};

export function fireHaptic(intensity: HapticIntensity = "tap") {
  if (typeof window === "undefined") return;
  const nav = window.navigator;
  if (!nav || typeof nav.vibrate !== "function") return;
  try {
    nav.vibrate(PATTERNS[intensity]);
  } catch {
    // Silently ignore — vibration is an enhancement, not a requirement.
  }
}

export function useHaptic() {
  return fireHaptic;
}
