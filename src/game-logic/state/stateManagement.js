import create from 'zustand';
import { settingsSlice } from './settingsStore';
import { gameSlice } from './gameStore';

export const useStore = create((set, get) => ({
  ...settingsSlice(set, get),
  ...gameSlice(set, get),
}));
