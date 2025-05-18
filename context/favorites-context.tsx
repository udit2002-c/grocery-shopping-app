"use client"

import { createContext, useState, useEffect, type ReactNode } from "react"
import type { Product } from "@/types"

interface FavoritesContextType {
  favorites: Product[]
  addToFavorites: (product: Product) => void
  removeFromFavorites: (id: string | number) => void
  isFavorite: (id: string | number) => boolean
}

export const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  addToFavorites: () => {},
  removeFromFavorites: () => {},
  isFavorite: () => false,
})

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Product[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  // Load favorites from localStorage on initial render
  useEffect(() => {
    const savedFavorites = localStorage.getItem("favorites")
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites))
      } catch (error) {
        console.error("Failed to parse favorites from localStorage:", error)
      }
    }
    setIsInitialized(true)
  }, [])

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("favorites", JSON.stringify(favorites))
    }
  }, [favorites, isInitialized])

  const addToFavorites = (product: Product) => {
    setFavorites((prevFavorites) => {
      // Check if product is already in favorites
      if (prevFavorites.some((item) => String(item.id) === String(product.id))) {
        return prevFavorites
      }
      return [...prevFavorites, product]
    })
  }

  const removeFromFavorites = (id: string | number) => {
    setFavorites((prevFavorites) => prevFavorites.filter((item) => String(item.id) !== String(id)))
  }

  const isFavorite = (id: string | number) => {
    return favorites.some((item) => String(item.id) === String(id))
  }

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}
