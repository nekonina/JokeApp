import { create } from 'zustand'
import {getJokes} from '@/api/getData'

export const useJokeStore = create((set) => ({
  jokes: [],
  fav: [],
  jokeType: '',
  setJokes: async () => {
    const data = await getJokes()
    set({jokes: data})
  },
  setFavorites: (value) => set({ fav: value }),
  setType: (value) => set({ jokeType: value }),
  clear: () => set({
    jokes:[],
    fav:[],
    jokeType:''
  })
}))