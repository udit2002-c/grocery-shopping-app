"use client"

import { useContext, useState } from "react"
import Image from "next/image"
import { Minus, Plus, X } from "lucide-react"
import { CartContext } from "@/context/cart-context"
import type { CartItem as CartItemType, OfferItem } from "@/types"

interface CartItemProps {
  item: CartItemType | OfferItem
}

export default function CartItem({ item }: CartItemProps) {
  const { updateCartItemQuantity, removeFromCart, isUpdating } = useContext(CartContext)
  const [isRemoving, setIsRemoving] = useState(false)
  const [imageError, setImageError] = useState(false)

  const handleIncreaseQuantity = () => {
    if (!item.isOffer) {
      updateCartItemQuantity(item.id, item.quantity + 1)
    }
  }

  const handleDecreaseQuantity = () => {
    if (!item.isOffer) {
      if (item.quantity > 1) {
        updateCartItemQuantity(item.id, item.quantity - 1)
      } else {
        handleRemove()
      }
    }
  }

  const handleRemove = () => {
    setIsRemoving(true)

    // Slight delay before actual removal for animation
    setTimeout(() => {
      removeFromCart(item.id)
    }, 300)
  }

  const itemTotal = (typeof item.price === "string" ? Number.parseFloat(item.price) : item.price) * item.quantity

  // Determine if this is a free item from an offer
  const isFreeItem = item.isOffer && item.price === 0

  // Determine image source with fallback
  const imageSrc = imageError || !item.image ? "/placeholder.svg?height=80&width=80" : item.image

  return (
    <div
      className={`py-4 flex items-center transition-all duration-300 ${isRemoving ? "opacity-0 transform translate-x-10" : ""} ${isUpdating ? "opacity-70" : ""}`}
    >
      <div className="w-20 h-20 relative flex-shrink-0 border border-gray-100 rounded-md overflow-hidden bg-white">
        <Image
          src={imageSrc || "/placeholder.svg"}
          alt={item.name}
          fill
          sizes="80px"
          className="object-contain p-2"
          onError={() => setImageError(true)}
          priority={true}
        />
        {isFreeItem && (
          <div className="absolute inset-0 bg-green-500 bg-opacity-20 flex items-center justify-center">
            <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">FREE</span>
          </div>
        )}
      </div>

      <div className="ml-4 flex-grow">
        <div className="flex justify-between">
          <h3 className="font-medium">{item.name}</h3>
          {!item.isOffer && (
            <button onClick={handleRemove} className="text-gray-400 hover:text-gray-600" disabled={isUpdating}>
              <X size={18} />
            </button>
          )}
        </div>
        <p className="text-sm text-gray-500">Product code: {String(item.id).substring(0, 8)}</p>

        {isFreeItem && "offerType" in item && (
          <p className="text-xs text-green-600 font-medium mt-1">
            {item.offerType === "coca-cola-free"
              ? "Free with purchase of 6 Coca-Cola"
              : item.offerType === "free-coffee"
                ? "Free with purchase of 3 croissants"
                : "Special offer"}
          </p>
        )}

        <div className="mt-2 flex items-center justify-between">
          {!item.isOffer ? (
            <div className="flex items-center border rounded-lg overflow-hidden">
              <button
                onClick={handleDecreaseQuantity}
                className="p-2 text-red-500 hover:bg-gray-100 transition-colors"
                disabled={isUpdating}
              >
                <Minus size={16} />
              </button>
              <span className="px-3 py-1 min-w-[40px] text-center">{item.quantity}</span>
              <button
                onClick={handleIncreaseQuantity}
                className="p-2 text-green-500 hover:bg-gray-100 transition-colors"
                disabled={isUpdating}
              >
                <Plus size={16} />
              </button>
            </div>
          ) : (
            <div className="text-sm text-gray-500">Quantity: {item.quantity}</div>
          )}

          <span className="font-medium">{isFreeItem ? "FREE" : `₹${itemTotal.toFixed(2)}`}</span>
        </div>
      </div>
    </div>
  )
}
