export interface Subcategory {
  id: string
  name: string
}

export interface Category {
  id: string
  name: string
  subcategories: Subcategory[]
}

export interface CreateItemResult {
  success: boolean
  itemId?: string
  error?: string
}
