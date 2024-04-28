import { create } from 'zustand'

export const useStore = create((set) => ({
  gameEnded: false,
  setGameEnded: (value) => set({ gameEnded: value }),

  scrorePowerUpHits: 0,
  incrementScorePowerUpHits: () =>
    set((state) => {
      return {
        scrorePowerUpHits: state.scrorePowerUpHits + 1,
      }
    }),

  invinciblePowerUp: false,
  setInvinciblePowerUp: (value) => set({ invinciblePowerUp: value }),
}))
