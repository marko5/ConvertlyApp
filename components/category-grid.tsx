"use client"
import { Ruler, Weight, Thermometer, Droplet, Clock, DollarSign } from "lucide-react"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"

export const categories = [
  { id: "length", name: "Length", icon: Ruler, gradient: "from-blue-500 to-cyan-500" },
  { id: "weight", name: "Weight", icon: Weight, gradient: "from-purple-500 to-pink-500" },
  { id: "temperature", name: "Temperature", icon: Thermometer, gradient: "from-red-500 to-orange-500" },
  { id: "volume", name: "Volume", icon: Droplet, gradient: "from-cyan-500 to-blue-500" },
  { id: "time", name: "Time", icon: Clock, gradient: "from-amber-500 to-yellow-500" },
  { id: "currency", name: "Currency", icon: DollarSign, gradient: "from-emerald-500 to-teal-600" },
]

interface CategoryGridProps {
  selectedCategory: string
  onSelectCategory: (category: string) => void
  dict: any
}

export default function CategoryGrid({ selectedCategory, onSelectCategory, dict }: CategoryGridProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">{dict.categories.title}</h2>
      <div className={isDesktop ? "grid grid-cols-1 gap-3" : "grid grid-cols-3 gap-3"}>
        {categories.map((category) => {
          const Icon = category.icon
          const isSelected = selectedCategory === category.id

          return (
            <button
              key={category.id}
              className={cn(
                "rounded-lg flex items-center justify-center gap-2 transition-all duration-200",
                "border shadow-sm hover:shadow-md",
                isDesktop ? "h-14 flex-row justify-start px-4" : "h-24 flex-col",
                isSelected
                  ? `bg-gradient-to-br ${category.gradient} text-white border-transparent`
                  : "bg-white hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-900 border-border",
              )}
              onClick={() => onSelectCategory(category.id)}
            >
              <div className={cn("rounded-full p-2", isSelected ? "bg-white/20" : "bg-primary/10")}>
                <Icon className={cn("h-5 w-5", isSelected ? "text-white" : "text-primary")} />
              </div>
              <span className="text-sm font-medium">{dict.categories[category.id]}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
