import { create }  from 'zustand'

interface ClientStateService {
  hasUnsavedCanvasChanges: boolean
  setHasUnsavedCanvasChanges: (hasUnsavedCanvasChanges: boolean) => void
}

export const useClientStateStore = create<ClientStateService>((set) => ({
  hasUnsavedCanvasChanges: false,
  setHasUnsavedCanvasChanges: (hasUnsavedCanvasChanges) => set({ hasUnsavedCanvasChanges }),
}));