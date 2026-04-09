import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OnboardingState {
  dismissedBanners: string[];
  isDismissed: (key: string) => boolean;
  dismiss: (key: string) => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      dismissedBanners: [],

      isDismissed: (key) => get().dismissedBanners.includes(key),

      dismiss: (key) =>
        set((state) =>
          state.dismissedBanners.includes(key)
            ? state
            : { dismissedBanners: [...state.dismissedBanners, key] },
        ),
    }),
    {
      name: 'warforge-onboarding',
      partialize: (state) => ({ dismissedBanners: state.dismissedBanners }),
    },
  ),
);
