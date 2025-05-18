export interface Product {
  id: string | number
  name: string
  description: string
  price: number | string
  stock: number
  image: string
  keywords?: string[]
}

export interface CartItem extends Product {
  quantity: number
  isOffer?: boolean
}

export interface OfferItem extends CartItem {
  isOffer: true
  offerType: string
  relatedItemId: string | number
}
