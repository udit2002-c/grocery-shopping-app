"use client"

interface CategoryFilterProps {
  activeCategory: string
  onCategoryChange: (category: string) => void
}

export default function CategoryFilter({ activeCategory, onCategoryChange }: CategoryFilterProps) {
  const categories = [
    { id: "all", name: "All items" },
    { id: "drinks", name: "Drinks" },
    { id: "fruit", name: "Fruit" },
    { id: "bakery", name: "Bakery" },
  ]

  return (
    <div className="flex overflow-x-auto pb-4 px-8 -mx-8 sm:px-0 sm:mx-0">
      <div className="flex space-x-3">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`category-tab ${activeCategory === category.id ? "active" : ""}`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  )
}
