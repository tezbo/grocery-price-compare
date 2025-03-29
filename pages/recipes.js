// pages/recipes.js
import { useState, useContext } from 'react';
import { RecipeContext } from '../context/RecipeContext';
import Link from 'next/link';

export default function Recipes() {
  const { addRecipe, recipes, deleteRecipe } = useContext(RecipeContext);
  const [recipeName, setRecipeName] = useState('');
  const [ingredientName, setIngredientName] = useState('');
  const [ingredientQty, setIngredientQty] = useState('');
  const [ingredientUnit, setIngredientUnit] = useState('');
  const [ingredients, setIngredients] = useState([]);

  const addIngredient = () => {
    if (ingredientName.trim()) {
      setIngredients([
        ...ingredients,
        {
          name: ingredientName.trim(),
          quantity: ingredientQty || '1',
          unit: ingredientUnit || '',
        },
      ]);
      setIngredientName('');
      setIngredientQty('');
      setIngredientUnit('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (recipeName.trim() && ingredients.length > 0) {
      addRecipe({ name: recipeName.trim(), ingredients });
      setRecipeName('');
      setIngredients([]);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">Recipe Builder</h1>
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto mb-8">
        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Recipe Name:</label>
          <input
            type="text"
            value={recipeName}
            onChange={(e) => setRecipeName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="e.g., Breakfast Special"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Add Ingredient:</label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={ingredientName}
              onChange={(e) => setIngredientName(e.target.value)}
              className="flex-1 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Ingredient name"
            />
            <input
              type="number"
              value={ingredientQty}
              onChange={(e) => setIngredientQty(e.target.value)}
              className="w-full sm:w-24 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Qty"
            />
            <input
              type="text"
              value={ingredientUnit}
              onChange={(e) => setIngredientUnit(e.target.value)}
              className="w-full sm:w-32 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Unit"
            />
            <button
              type="button"
              onClick={addIngredient}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-md transition-colors"
            >
              Add
            </button>
          </div>
        </div>
        {ingredients.length > 0 && (
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Ingredients:</h2>
            <ul className="list-disc pl-5 text-gray-700">
              {ingredients.map((ing, idx) => (
                <li key={idx}>
                  {ing.name} - {ing.quantity} {ing.unit}
                </li>
              ))}
            </ul>
          </div>
        )}
        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-md transition-colors"
        >
          Save Recipe
        </button>
      </form>
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Existing Recipes</h2>
        {recipes.length === 0 ? (
          <p className="text-gray-600">No recipes added yet.</p>
        ) : (
          recipes.map((recipe) => (
            <div key={recipe.id} className="border border-gray-300 rounded-lg p-6 shadow-sm mb-6">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-semibold text-gray-800">{recipe.name}</h3>
                <button
                  onClick={() => deleteRecipe(recipe.id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
              <ul className="list-disc pl-5 text-gray-700 mt-2">
                {recipe.ingredients.map((ing, idx) => (
                  <li key={idx}>
                    {ing.name} - {ing.quantity} {ing.unit}
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
      <div className="text-center mt-8">
        <Link href="/shopping-list">
          <a className="text-green-600 hover:underline text-xl">Go to Shopping List</a>
        </Link>
      </div>
    </div>
  );
}