'use client';

import React from 'react';
interface RecipeActionsProps {
  recipeUrl: string;
  setRecipeUrl: (url: string) => void;
  recipeData: any;
  setRecipeData: (data: any) => void;
  fetchData: () => void;
}

const RecipeActions: React.FC<RecipeActionsProps> = ({
  recipeUrl,
  setRecipeUrl,
  recipeData,
  setRecipeData,
  fetchData,
}) => {
  const handleFetchRecipe = async () => {
    if (recipeUrl) {
      try {
        const response = await fetch(`http://localhost:8000/api/recipe?url=${encodeURIComponent(recipeUrl)}`);
        const data = await response.json();
        setRecipeData(data);
        fetchData(); // Fetch data after setting the recipe data
      } catch (error) {
        console.error('Failed to fetch recipe:', error);
      }
    }
  };

  return (
    <div className="recipe-actions">
      <input
        type="text"
        value={recipeUrl}
        onChange={(e) => setRecipeUrl(e.target.value)}
        placeholder="Enter recipe URL"
        className="p-2 border rounded-md"
      />
      <button
        onClick={handleFetchRecipe}
        className="px-3 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600"
      >
        Fetch Recipe
      </button>
      {recipeData && (
        <div className="recipe-data">
          <h3 className="text-xl font-bold">Recipe Data:</h3>
          <pre>{JSON.stringify(recipeData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default RecipeActions;