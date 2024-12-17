import { create } from 'zustand';

export const useFavouritesStore = create((set) => ({
  favourites: [],
  addToFavourites: (item) =>
    set((state) => ({
      favourites: [...state.favourites, item],
    })),
  removeFromFavourites: (id) =>
    set((state) => ({
      favourites: state.favourites.filter((item) => item.id !== id),
    })),
  clearFavourites: () => set({ favourites: [] }),
}));
