'use client';

import React from 'react';

interface FiltersProps {
  savedRecipes: { title: string }[];
  selectedRecipeFilter: string;
  setSelectedRecipeFilter: (filter: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  clearFilters: () => void;
  itemsPerPage: number;
  setItemsPerPage: (items: number) => void;
  isMobile: boolean;
}

const Filters: React.FC<FiltersProps> = ({
  savedRecipes,
  selectedRecipeFilter,
  setSelectedRecipeFilter,
  selectedCategory,
  setSelectedCategory,
  clearFilters,
  itemsPerPage,
  setItemsPerPage,
  isMobile,
}) => {
  const handleRecipeFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRecipeFilter(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  const handleClearFilters = () => {
    clearFilters();
  };

  const uniqueCategories = Array.from(new Set(savedRecipes.map(recipe => recipe.category)));

  return (
    <div className="filters">
      <select
        value={selectedRecipeFilter}
        onChange={handleRecipeFilterChange}
        className="p-2 border rounded-md"
      >
        <option value="">Filter by Recipe</option>
        {savedRecipes.map((recipe, idx) => (
          <option key={idx} value={recipe.title}>{recipe.title}</option>
        ))}
      </select>

      <select
        value={selectedCategory}
        onChange={handleCategoryChange}
        className="p-2 border rounded-md"
      >
        <option value="">Filter by Category</option>
        {uniqueCategories.map((cat, idx) => (
          <option key={idx} value={cat}>{cat}</option>
        ))}
      </select>

      <button
        onClick={handleClearFilters}
        className="px-3 py-2 rounded-md bg-gray-300 hover:bg-gray-400"
      >
        Clear Filters
      </button>
    </div>
  );
};

export default Filters;