// store.js
import { create } from 'zustand';

export const StoreUserRole = create((set) => ({
  role: '',
  setRole: (newRole) => set(() => ({ role: newRole })),
  clearRole: () => set(() => ({ role: '' })),
}));



