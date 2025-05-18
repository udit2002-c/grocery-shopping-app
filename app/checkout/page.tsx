import { Suspense } from "react"
import CheckoutPage from "@/components/checkout-page"
import Loading from "@/components/loading"

export default function Checkout() {
  return (
    <main>
      <Suspense fallback={<Loading />}>
        <CheckoutPage />
      </Suspense>
    </main>
  )
}
