"use server"

import type { Category } from "../../types"

export async function getCategories(): Promise<Category[]> {
  // Simulate a delay for the API call
  await new Promise((resolve) => setTimeout(resolve, 300))

  // In a real app, this would fetch categories from a database
  // Here we're returning mock data
  return [
    {
      id: "cat-1",
      name: "Books",
      subcategories: [
        { id: "subcat-1", name: "Textbooks" },
        { id: "subcat-2", name: "Fiction" },
        { id: "subcat-3", name: "Non-Fiction" },
        { id: "subcat-4", name: "Reference" },
      ],
    },
    {
      id: "cat-2",
      name: "Electronics",
      subcategories: [
        { id: "subcat-5", name: "Computers" },
        { id: "subcat-6", name: "Audio/Visual" },
        { id: "subcat-7", name: "Accessories" },
      ],
    },
    {
      id: "cat-3",
      name: "Furniture",
      subcategories: [
        { id: "subcat-8", name: "Desks" },
        { id: "subcat-9", name: "Chairs" },
        { id: "subcat-10", name: "Storage" },
      ],
    },
    {
      id: "cat-4",
      name: "School Supplies",
      subcategories: [
        { id: "subcat-11", name: "Art Supplies" },
        { id: "subcat-12", name: "Writing Instruments" },
        { id: "subcat-13", name: "Paper Products" },
      ],
    },
    {
      id: "cat-5",
      name: "Sports Equipment",
      subcategories: [
        { id: "subcat-14", name: "Team Sports" },
        { id: "subcat-15", name: "Individual Sports" },
        { id: "subcat-16", name: "Fitness" },
      ],
    },
  ]
}
