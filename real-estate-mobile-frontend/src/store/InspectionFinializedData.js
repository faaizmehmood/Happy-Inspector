import {create} from 'zustand';

export const useStoreFinalizedData = create((set) => ({
    inspectionData: {}, // Initialize the key
    setInspectionData: (data) => set({ inspectionData: data }), // Setter function
  }));