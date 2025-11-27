'use client'

interface ProductFiltersProps {
  categories: string[]
  filters: {
    category: string
    search: string
  }
  onFilterChange: (filters: Partial<{ category: string; search: string }>) => void
}

export default function ProductFilters({ categories, filters, onFilterChange }: ProductFiltersProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Filters</h3>

        {/* Category Filter */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Category</h4>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="category"
                value=""
                checked={filters.category === ''}
                onChange={(e) => onFilterChange({ category: e.target.value })}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">All Categories</span>
            </label>

            {categories.map((category) => (
              <label key={category} className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  value={category}
                  checked={filters.category === category}
                  onChange={(e) => onFilterChange({ category: e.target.value })}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700 capitalize">{category}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Clear Filters */}
        {(filters.category || filters.search) && (
          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={() => onFilterChange({ category: '', search: '' })}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
