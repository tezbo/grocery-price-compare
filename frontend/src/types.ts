// src/types.ts
export interface Product {
    id: string;
    name: string;
    price: number;
    sourceRecipe?: string;
    category?: string;
  }
  
  export interface ProductTableProps {
    products: Product[];
    search: string;
    selectedRecipeFilter?: string;
    selectedCategory?: string;
    itemsPerPage: number;
    setItemsPerPage: (itemsPerPage: number) => void;
  }