"use client"

import { useContext, useState } from "react"
import { CartContext } from "@/context/cart-context"
import CartItem from "./cart-item"
import { ShoppingCart } from "lucide-react"
import Link from "next/link"

export default function CheckoutPage() {
  const { cartItems, clearCart, appliedOffers, isUpdating } = useContext(CartContext)
  const [checkoutComplete, setCheckoutComplete] = useState(false)

  // Calculate subtotal (sum of all regular items at their listed prices)
  const subtotal = cartItems
    .filter((item) => !item.isOffer)
    .reduce((total, item) => {
      const price = typeof item.price === "string" ? Number.parseFloat(item.price) : item.price
      return total + price * item.quantity
    }, 0)

  // Calculate discount (value of free items from offers)
  const discount = appliedOffers.reduce((total, offer) => total + offer.discount, 0)

  // Calculate total (subtotal minus discounts)
  const total = subtotal - discount

  const handleCheckout = () => {
    // Show checkout animation
    setCheckoutComplete(true)

    // Clear cart after delay
    setTimeout(() => {
      clearCart()
    }, 2000)
  }

  if (checkoutComplete) {
    return (
      <div className="p-8">
        <div className="py-16 text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4">Order Complete!</h2>
          <p className="mb-8 text-gray-600">Thank you for your order.</p>
          <Link
            href="/"
            className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-8">Checkout</h1>
        <div className="py-16 text-center">
          <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-bold mb-4">Your cart is empty</h2>
          <p className="mb-8 text-gray-600">Add some products to your cart to get started.</p>
          <Link
            href="/"
            className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Your Cart</h2>

              <div className="divide-y">
                {cartItems.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                </div>

                {appliedOffers.length > 0 ? (
                  <div className="border-t pt-4">
                    <h3 className="font-medium mb-2">Applied Offers:</h3>
                    <ul className="space-y-2 text-sm">
                      {appliedOffers.map((offer, index) => (
                        <li key={index} className="flex justify-between text-green-600">
                          <span>{offer.description}</span>
                          <span>-₹{offer.discount.toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-gray-600">
                      <span>Discount</span>
                      <span>₹0.00</span>
                    </div>
                  </div>
                )}

                <div className="border-t pt-4 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isUpdating}
                className={`w-full mt-6 py-3 rounded-lg font-medium transition-colors ${
                  isUpdating
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-green-500 text-white hover:bg-green-600"
                }`}
              >
                {isUpdating ? "Processing..." : "Complete Order"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
