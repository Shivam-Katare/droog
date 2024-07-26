import {create} from 'zustand';

interface SelectedValueState {
  value: string;
  setValue: (newValue: string) => void;
}

interface SelectedPlatformState {
  platform: string;
  setPlatform: (newPlatform: string) => void;
}

export const useSelectedValueStore = create<SelectedValueState>((set) => ({
  value: '',
  setValue: (newValue: string) => set({ value: newValue }),
}));

export const useSelectedPlatformStore = create<SelectedPlatformState>((set) => ({
  platform: '',
  setPlatform: (newPlatform: string) => set({ platform: newPlatform }),
}));