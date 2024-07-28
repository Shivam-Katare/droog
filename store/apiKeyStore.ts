// apiKeyStore.ts
import {create} from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface ApiKeyState {
  geminiKey: string;
  stabilityAIKey: string;
  huggingFaceKey: string;
  geminiUsage: number;
  stabilityAIUsage: number;
  huggingFaceUsage: number;
  decrementGeminiUsage: () => void;
  decrementStabilityAIUsage: () => void;
  decrementHuggingFaceUsage: () => void;
  setGeminiKey: (key: string) => void;
  setStabilityAIKey: (key: string) => void;
  setHuggingFaceKey: (key: string) => void;
}

export const useApiKeyStore = create<ApiKeyState>()(
  persist(
    (set) => ({
      geminiKey: '',
      stabilityAIKey: '',
      huggingFaceKey: '',
      geminiUsage: 0, // Starting usage count
      stabilityAIUsage: 0,
      huggingFaceUsage: 0,
      decrementGeminiUsage: () => set((state) => ({ geminiUsage: Math.max(0, state.geminiUsage - 1) })),
      decrementStabilityAIUsage: () => set((state) => ({ stabilityAIUsage: Math.max(0, state.stabilityAIUsage - 1) })),
      decrementHuggingFaceUsage: () => set((state) => ({ huggingFaceUsage: Math.max(0, state.huggingFaceUsage - 1) })),
      setGeminiKey: (key) => set({ geminiKey: key }),
      setStabilityAIKey: (key) => set({ stabilityAIKey: key }),
      setHuggingFaceKey: (key) => set({ huggingFaceKey: key }),
    }),
    {
      name: 'api-key-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
