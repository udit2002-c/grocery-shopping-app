import type { CartItem } from "@/types"

// Sample product images for when we need fallbacks
const SAMPLE_IMAGES = {
  "coca-cola": "/images/sample-coke.jpg",
  croissant: "/images/sample-croissant.jpg",
  coffee: "/images/sample-coffee.jpg",
}

// Special offer constants
const COCA_COLA_ID = "coca-cola" // This should match the actual ID in your data
const CROISSANT_ID = "croissant" // This should match the actual ID in your data
const COFFEE_ID = "coffee" // This should match the actual ID in your data

/**
 * Calculates special offers based on cart items
 *
 * Implements two offers:
 * 1. "Buy 6 cans of Coca-Cola, get 1 free"
 * 2. "Buy 3 croissants, get a free coffee"
 *
 * @param cartItems Array of regular cart items (non-offer items)
 * @returns Object containing updated cart with offer items and offer details
 */
export function calculateOffers(cartItems: CartItem[]) {
  let updatedCart = [...cartItems]
  const offers: { description: string; discount: number }[] = []

  // Remove any previous offer items to recalculate from scratch
  updatedCart = updatedCart.filter((item) => !item.isOffer)

  // "Buy 6 cans of Coca-Cola, get 1 free" offer
  const cokeItem = updatedCart.find((item) => String(item.id).toLowerCase().includes(COCA_COLA_ID) && !item.isOffer)

  if (cokeItem && cokeItem.quantity >= 6) {
    // Calculate how many free cokes to add (1 free for every 6 purchased)
    const freeCokes = Math.floor(cokeItem.quantity / 6)
    const cokePrice = typeof cokeItem.price === "string" ? Number.parseFloat(cokeItem.price) : cokeItem.price
    const discount = cokePrice * freeCokes

    offers.push({
      description: `Buy 6 cans of Coca-Cola, get ${freeCokes} free`,
      discount,
    })

    // Add free coke as a separate item
    updatedCart.push({
      ...cokeItem,
      id: `${cokeItem.id}-free`,
      quantity: freeCokes,
      price: 0,
      isOffer: true,
      offerType: "coca-cola-free",
      name: `${cokeItem.name} (Free)`,
      relatedItemId: cokeItem.id,
    })
  }

  // "Buy 3 croissants, get a free coffee" offer
  const croissantItem = updatedCart.find(
    (item) => String(item.id).toLowerCase().includes(CROISSANT_ID) && !item.isOffer,
  )

  // Find a coffee item to get its details
  const coffeeItem = updatedCart.find((item) => String(item.id).toLowerCase().includes(COFFEE_ID) && !item.isOffer)

  if (croissantItem && croissantItem.quantity >= 3) {
    // Only one free coffee regardless of how many croissants (unless specified otherwise)
    const freeCoffees = 1

    // If we have a coffee item in the cart, use its details
    // Otherwise, create a generic coffee item
    const coffeePrice = coffeeItem
      ? typeof coffeeItem.price === "string"
        ? Number.parseFloat(coffeeItem.price)
        : coffeeItem.price
      : 120.0
    const discount = coffeePrice * freeCoffees

    offers.push({
      description: `Buy 3 croissants, get a free coffee`,
      discount,
    })

    // Add free coffee as a separate item
    updatedCart.push({
      id: coffeeItem ? `${coffeeItem.id}-free` : "free-coffee",
      name: coffeeItem ? `${coffeeItem.name} (Free)` : "Coffee (Free)",
      description: "Free coffee with 3 croissants purchase",
      price: 0,
      quantity: freeCoffees,
      stock: 999,
      image: coffeeItem ? coffeeItem.image : "/placeholder.svg?height=200&width=200",
      isOffer: true,
      offerType: "free-coffee",
      relatedItemId: croissantItem.id,
    })
  }

  return { updatedCart, offers }
}
