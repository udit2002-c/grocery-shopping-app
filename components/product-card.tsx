"use client"

import type React from "react"
import { useContext, useState, useRef } from "react"
import Image from "next/image"
import { Heart, ShoppingCart, Plus, Minus } from "lucide-react"
import { CartContext } from "@/context/cart-context"
import { FavoritesContext } from "@/context/favorites-context"
import type { Product } from "@/types"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { cartItems, addToCart, updateCartItemQuantity, removeFromCart, isUpdating } = useContext(CartContext)
  const { isFavorite, addToFavorites, removeFromFavorites } = useContext(FavoritesContext)
  const [isHovered, setIsHovered] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [imageError, setImageError] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  // Check if product is in cart and get its quantity
  const cartItem = cartItems.find((item) => String(item.id) === String(product.id) && !item.isOffer)
  const quantity = cartItem ? cartItem.quantity : 0

  const handleAddToCart = () => {
    setIsAdding(true)
    addToCart(product)

    // Animation timing
    setTimeout(() => {
      setIsAdding(false)
    }, 500)
  }

  const handleIncreaseQuantity = () => {
    updateCartItemQuantity(product.id, (quantity || 0) + 1)
  }

  const handleDecreaseQuantity = () => {
    if (quantity <= 1) {
      removeFromCart(product.id)
    } else {
      updateCartItemQuantity(product.id, quantity - 1)
    }
  }

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isFavorite(product.id)) {
      removeFromFavorites(product.id)
    } else {
      addToFavorites(product)
    }
  }

  const formatPrice = (price: number | string) => {
    const numericPrice = typeof price === "string" ? Number.parseFloat(price) : price
    return `₹${numericPrice.toFixed(2)}`
  }

  const getAvailabilityText = (stock: number) => {
    if (stock >= 10) {
      return "Available"
    } else if (stock > 0) {
      return `Only ${stock} left`
    } else {
      return "Out of stock"
    }
  }

  const getAvailabilityClass = (stock: number) => {
    if (stock >= 10) {
      return "available"
    } else if (stock > 0) {
      return "low-stock"
    } else {
      return "out-of-stock"
    }
  }

  // Check for offer eligibility
  const isPartOfCokeOffer = product.name.toLowerCase().includes("coca-cola") && quantity >= 6
  const isPartOfCroissantOffer = product.name.toLowerCase().includes("croissant") && quantity >= 3

  // Determine image source with fallback
  const imageSrc = imageError || !product.image ? "/placeholder.svg?height=200&width=200" : product.image

  return (
    <div
      ref={cardRef}
      className={`product-card ${isAdding ? "scale-105 shadow-lg" : ""} ${isUpdating ? "opacity-70" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ transition: "all 0.3s ease" }}
    >
      <div className="relative pt-[100%] bg-white">
        <Image
          src={imageSrc || "/placeholder.svg"}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={`object-contain p-4 transition-transform duration-500 ${isHovered ? "scale-110" : ""}`}
          onError={() => setImageError(true)}
          priority={true}
        />
        <button onClick={toggleFavorite} className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm z-10">
          <Heart size={20} className={isFavorite(product.id) ? "fill-red-500 text-red-500" : "text-gray-400"} />
        </button>

        {/* Offer badges */}
        {isPartOfCokeOffer && (
          <div className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            Buy 6 Get 1 Free
          </div>
        )}

        {isPartOfCroissantOffer && (
          <div className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            Free Coffee with 3
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1">
          {product.name}
          {product.name.includes("™") ? "" : "™"}
        </h3>
        <p className="text-gray-600 text-sm mb-3 h-10 line-clamp-2">{product.description}</p>

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <span className={`availability-badge ${getAvailabilityClass(product.stock)}`}>
              {getAvailabilityText(product.stock)}
            </span>
            <span className="text-sm text-gray-500">{product.stock} in stock</span>
          </div>
          <span className="font-bold text-lg">{formatPrice(product.price)}</span>
        </div>

        <div className="flex justify-between items-center">
          {quantity > 0 ? (
            <div className="flex items-center border rounded-lg overflow-hidden">
              <button
                onClick={handleDecreaseQuantity}
                className="p-2 text-red-500 hover:bg-gray-100 transition-colors"
                disabled={isUpdating}
              >
                <Minus size={16} />
              </button>
              <span className="px-3 py-1 min-w-[40px] text-center">{quantity}</span>
              <button
                onClick={handleIncreaseQuantity}
                className="p-2 text-green-500 hover:bg-gray-100 transition-colors"
                disabled={isUpdating}
              >
                <Plus size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || isUpdating}
              className={`p-2 rounded-lg transition-colors ${
                product.stock === 0 || isUpdating
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-800 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              <ShoppingCart size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
