"use client"

import { createContext, useState, useEffect, type ReactNode } from "react"
import type { CartItem, Product, OfferItem } from "@/types"
import { calculateOffers } from "@/utils/offers"

interface CartContextType {
  cartItems: (CartItem | OfferItem)[]
  addToCart: (product: Product) => void
  removeFromCart: (id: string | number) => void
  updateCartItemQuantity: (id: string | number, quantity: number) => void
  clearCart: () => void
  isUpdating: boolean
  appliedOffers: {
    description: string
    discount: number
  }[]
}

export const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateCartItemQuantity: () => {},
  clearCart: () => {},
  isUpdating: false,
  appliedOffers: [],
})

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<(CartItem | OfferItem)[]>([])
  const [isInitialized, setIsInitialized] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [appliedOffers, setAppliedOffers] = useState<{ description: string; discount: number }[]>([])

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart))
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error)
      }
    }
    setIsInitialized(true)
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("cart", JSON.stringify(cartItems))
    }
  }, [cartItems, isInitialized])

  // Apply special offers whenever cart changes
  useEffect(() => {
    if (isInitialized && cartItems.length > 0) {
      const { updatedCart, offers } = calculateOffers(cartItems.filter((item) => !item.isOffer))
      setCartItems(updatedCart)
      setAppliedOffers(offers)
    }
  }, [isInitialized])

  const addToCart = (product: Product) => {
    setIsUpdating(true)

    setCartItems((prevItems) => {
      // Filter out offer items first
      const regularItems = prevItems.filter((item) => !item.isOffer)

      const existingItem = regularItems.find((item) => String(item.id) === String(product.id))

      let newItems
      if (existingItem) {
        newItems = regularItems.map((item) =>
          String(item.id) === String(product.id) ? { ...item, quantity: item.quantity + 1 } : item,
        )
      } else {
        newItems = [
          ...regularItems,
          {
            ...product,
            quantity: 1,
            isOffer: false,
          },
        ]
      }

      // Recalculate offers
      const { updatedCart, offers } = calculateOffers(newItems)
      setAppliedOffers(offers)

      setTimeout(() => setIsUpdating(false), 300)
      return updatedCart
    })
  }

  const removeFromCart = (id: string | number) => {
    setIsUpdating(true)

    setCartItems((prevItems) => {
      // First remove the item
      const newItems = prevItems.filter((item) => String(item.id) !== String(id) && !item.isOffer)

      // Then recalculate offers
      const { updatedCart, offers } = calculateOffers(newItems)
      setAppliedOffers(offers)

      setTimeout(() => setIsUpdating(false), 300)
      return updatedCart
    })
  }

  const updateCartItemQuantity = (id: string | number, quantity: number) => {
    setIsUpdating(true)

    if (quantity <= 0) {
      removeFromCart(id)
      return
    }

    setCartItems((prevItems) => {
      // First update the quantity for regular items only
      const regularItems = prevItems.filter((item) => !item.isOffer)

      const updatedItems = regularItems.map((item) => (String(item.id) === String(id) ? { ...item, quantity } : item))

      // Then recalculate offers
      const { updatedCart, offers } = calculateOffers(updatedItems)
      setAppliedOffers(offers)

      setTimeout(() => setIsUpdating(false), 300)
      return updatedCart
    })
  }

  const clearCart = () => {
    setCartItems([])
    setAppliedOffers([])
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        clearCart,
        isUpdating,
        appliedOffers,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
